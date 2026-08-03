import crypto = require("node:crypto");
import cors = require("cors");
import express = require("express");
import type { EmailContent, FormKind, RuntimeConfig } from "./types.js";
import formSubmissionService = require("./formSubmissionService.js");
import graphMail = require("./graphMail.js");
import security = require("./security.js");
import turnstile = require("./turnstile.js");
import validation = require("./validation.js");

type AppDependencies = {
  sendMail?: (content: EmailContent) => Promise<void>;
  verifyTurnstile?: (
    token: string,
    remoteIp: string | undefined,
    expectedAction: string,
  ) => Promise<boolean>;
};

function hashRateLimitValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function getRemoteIp(request: express.Request): string | undefined {
  const cloudflareIp = request.get("CF-Connecting-IP")?.trim();
  if (cloudflareIp) return cloudflareIp;
  const forwarded = request.get("X-Forwarded-For")?.split(",")[0]?.trim();
  return forwarded || request.ip || request.socket.remoteAddress;
}

function actionForKind(kind: FormKind): string {
  if (kind === "contact") return "contact-form";
  return kind;
}

function createApp(config: RuntimeConfig, dependencies: AppDependencies = {}) {
  const app = express();
  const mailClient = dependencies.sendMail
    ? { sendMail: dependencies.sendMail }
    : graphMail.createGraphMailClient(config);
  const submissionService = formSubmissionService.createFormSubmissionService(
    mailClient,
    config.duplicateWindowMs,
  );
  const deliverSubmission = submissionService.submit;
  const verifyTurnstile =
    dependencies.verifyTurnstile ?? turnstile.createTurnstileVerifier(config);

  app.disable("x-powered-by");
  if (config.isProduction) app.set("trust proxy", 1);

  app.use(security.createRequestIdMiddleware());
  app.use(security.createSecurityHeadersMiddleware());
  app.use("/api", (request, response, next) => {
    if (request.method !== "GET") {
      response.set("Cache-Control", "no-store");
      response.set("Pragma", "no-cache");
      response.set("Expires", "0");
    }
    next();
  });
  app.use(security.createHttpsMiddleware(config.enforceHttps));
  app.use(
    cors({
      credentials: false,
      methods: ["GET", "POST", "OPTIONS"],
      origin(origin, callback) {
        const normalizedOrigin = origin?.replace(/\/$/, "");
        if (!normalizedOrigin || config.allowedOrigins.has(normalizedOrigin)) {
          callback(null, true);
          return;
        }
        callback(new Error("CORS_ORIGIN_BLOCKED"));
      },
    }),
  );
  app.use(security.createJsonOnlyMiddleware());
  app.use(express.json({ limit: config.bodyLimit, strict: true, type: "application/json" }));

  const submissionRateLimiter = security.createRateLimiter({
    keyGenerator(request) {
      const pathKind: FormKind = request.path === "/api/contact"
        ? "contact"
        : request.path.endsWith("new-hire-application")
          ? "new-hire-application"
          : "applicant-questionnaire";
      const ip = getRemoteIp(request) ?? "unknown";
      const email = validation.extractNormalizedEmail(pathKind, request.body);
      return [
        `ip:${hashRateLimitValue(ip)}:${request.path}`,
        ...(email
          ? [`email:${hashRateLimitValue(email.toLowerCase())}:${request.path}`]
          : []),
      ];
    },
    maxRequests: config.rateLimitMax,
    windowMs: config.rateLimitWindowMs,
  });

  app.get("/api/health", (_request, response) => {
    response.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    response.json({ status: "ok" });
  });

  async function handleSubmission(
    kind: FormKind,
    request: express.Request,
    response: express.Response,
  ) {
    response.set("Cache-Control", "no-store");
    const body = request.body as unknown;

    if (!security.isPlainObject(body)) {
      response.status(400).json({
        ok: false,
        message: "The form submission is invalid.",
        requestId: response.locals.requestId,
      });
      return;
    }

    const securityResult = security.validateSecurityProof(body.security);
    if (!securityResult.ok) {
      response.status(400).json({
        ok: false,
        message: securityResult.reason,
        requestId: response.locals.requestId,
      });
      return;
    }

    const proof = body.security as {
      turnstileToken: string;
    };

    try {
      const challengeIsValid = await verifyTurnstile(
        proof.turnstileToken,
        getRemoteIp(request),
        actionForKind(kind),
      );
      if (!challengeIsValid) {
        response.status(400).json({
          ok: false,
          message: "Please complete the security verification and try again.",
          requestId: response.locals.requestId,
        });
        return;
      }
    } catch (error) {
      if (error instanceof turnstile.TurnstileConfigurationError) {
        response.status(503).json({
          ok: false,
          message: "Online form submission is temporarily unavailable.",
          requestId: response.locals.requestId,
        });
        return;
      }
      throw error;
    }

    const result = validation.validateSubmission(kind, body);
    if (!result.ok) {
      response.status(400).json({
        ok: false,
        message: result.message,
        requestId: response.locals.requestId,
      });
      return;
    }

    try {
      await deliverSubmission(result.submission, response.locals.requestId);
      console.info("Website form delivered", {
        formKind: kind,
        requestId: response.locals.requestId,
      });
      response.status(202).json({
        delivery: true,
        ok: true,
        message:
          kind === "contact"
            ? "Your message was sent successfully. BZ Resources will be in touch."
            : "Your form was submitted successfully.",
        requestId: response.locals.requestId,
      });
    } catch (error) {
      if (error instanceof formSubmissionService.DuplicateSubmissionError) {
        response.status(409).json({
          ok: false,
          message: "This form was already submitted. Please wait before trying again.",
          requestId: response.locals.requestId,
        });
        return;
      }

      const errorType =
        error instanceof graphMail.DeliveryConfigurationError
          ? "configuration"
          : error instanceof graphMail.GraphAuthenticationError
            ? "graph-authentication"
            : error instanceof graphMail.GraphDeliveryError
              ? "graph-delivery"
              : "unexpected-delivery";
      console.error("Website form delivery failed", {
        errorType,
        formKind: kind,
        requestId: response.locals.requestId,
      });
      response.status(errorType === "configuration" ? 503 : 502).json({
        ok: false,
        message:
          "We could not send your form right now. Your entries have not been cleared; please wait and try again.",
        requestId: response.locals.requestId,
      });
    }
  }

  app.post("/api/contact", submissionRateLimiter, (request, response, next) => {
    handleSubmission("contact", request, response).catch(next);
  });

  app.post("/api/forms/:kind", submissionRateLimiter, (request, response, next) => {
    const kind = request.params.kind;
    if (kind !== "applicant-questionnaire" && kind !== "new-hire-application") {
      response.status(404).json({
        ok: false,
        message: "Unknown form type.",
        requestId: response.locals.requestId,
      });
      return;
    }
    handleSubmission(kind, request, response).catch(next);
  });

  app.use(((error, _request, response, _next) => {
    const errorRecord =
      typeof error === "object" && error !== null
        ? (error as Record<string, unknown>)
        : {};

    if (error instanceof Error && error.message === "CORS_ORIGIN_BLOCKED") {
      response.status(403).json({
        ok: false,
        message: "This website is not allowed to submit forms to the API.",
        requestId: response.locals.requestId,
      });
      return;
    }
    if (error instanceof SyntaxError && errorRecord.status === 400) {
      response.status(400).json({
        ok: false,
        message: "The request body is not valid JSON.",
        requestId: response.locals.requestId,
      });
      return;
    }
    if (errorRecord.type === "entity.too.large") {
      response.status(413).json({
        ok: false,
        message: "The form submission is too large.",
        requestId: response.locals.requestId,
      });
      return;
    }

    console.error("Unhandled API error", {
      errorType: error instanceof Error ? error.name : "UnknownError",
      requestId: response.locals.requestId,
    });
    response.set("Cache-Control", "no-store");
    response.status(500).json({
      ok: false,
      message: "An unexpected server error occurred.",
      requestId: response.locals.requestId,
    });
  }) as express.ErrorRequestHandler);

  return app;
}

const appModule = { createApp };

export = appModule;
