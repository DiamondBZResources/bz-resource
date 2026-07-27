import cors = require("cors");
import dotenv = require("dotenv");
import express = require("express");
import security = require("./security.js");

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;
const isProduction = process.env.NODE_ENV === "production";
const enforceHttps = process.env.ENFORCE_HTTPS
  ? process.env.ENFORCE_HTTPS === "true"
  : isProduction;
const formWebhookUrl = process.env.FORM_WEBHOOK_URL?.trim() ?? "";
const formWebhookBearerToken = process.env.FORM_WEBHOOK_BEARER_TOKEN?.trim() ?? "";
const formWebhookSigningSecret = process.env.FORM_WEBHOOK_SIGNING_SECRET?.trim() ?? "";
const allowInsecureWebhook = process.env.ALLOW_INSECURE_WEBHOOK === "true";
const allowedOrigins = security.getAllowedOrigins(process.env.ALLOWED_ORIGINS);

app.disable("x-powered-by");
if (isProduction) app.set("trust proxy", 1);

app.use(security.createRequestIdMiddleware());
app.use(security.createSecurityHeadersMiddleware());
app.use(security.createHttpsMiddleware(enforceHttps));
app.use(
  cors({
    credentials: false,
    methods: ["GET", "POST", "OPTIONS"],
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin.replace(/\/$/, ""))) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS_ORIGIN_BLOCKED"));
    },
  }),
);
app.use(security.createJsonOnlyMiddleware());
app.use(express.json({ limit: "400kb", strict: true, type: "application/json" }));

const submissionRateLimiter = security.createRateLimiter({
  maxRequests: Number(process.env.FORM_RATE_LIMIT_MAX) || 30,
  windowMs: (Number(process.env.FORM_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60_000,
});

app.get("/api/health", (_req, res) => {
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json({ status: "ok" });
});

type ContactBody = {
  comments?: unknown;
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  security?: unknown;
};

function cleanText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim();
  return cleaned.length > 0 && cleaned.length <= maxLength ? cleaned : undefined;
}

app.post("/api/contact", submissionRateLimiter, (req, res) => {
  res.set("Cache-Control", "no-store");

  if (!security.onlyHasKeys(req.body, ["comments", "email", "firstName", "lastName", "phone", "security"])) {
    res.status(400).json({
      ok: false,
      delivery: false,
      message: "The contact form contains unexpected fields.",
      requestId: res.locals.requestId,
    });
    return;
  }

  const body = req.body as ContactBody;
  const securityResult = security.validateSecurityProof(body.security);
  if (!securityResult.ok) {
    res.status(400).json({
      ok: false,
      delivery: false,
      message: securityResult.reason,
      requestId: res.locals.requestId,
    });
    return;
  }

  const payloadResult = security.scanJsonPayload(req.body);
  if (!payloadResult.ok) {
    res.status(400).json({
      ok: false,
      delivery: false,
      message: payloadResult.reason,
      requestId: res.locals.requestId,
    });
    return;
  }

  const firstName = cleanText(body.firstName, 80);
  const lastName = cleanText(body.lastName, 80);
  const email = cleanText(body.email, 254);
  const phone = cleanText(body.phone, 50);
  const comments = cleanText(body.comments, 3_000);
  const emailLooksValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!firstName || !lastName || !emailLooksValid || !phone || !comments) {
    res.status(400).json({
      ok: false,
      delivery: false,
      message: "Please complete all fields with valid information.",
      requestId: res.locals.requestId,
    });
    return;
  }

  console.info("Contact form accepted", {
    requestId: res.locals.requestId,
    route: "/api/contact",
  });

  res.status(202).json({
    ok: true,
    delivery: false,
    message:
      "Message received by the development server. Delivery is not configured yet.",
    requestId: res.locals.requestId,
  });
});

type FormKind = "applicant-questionnaire" | "new-hire-application";

type FormSubmissionBody = {
  application?: unknown;
  language?: unknown;
  questionnaire?: unknown;
  security?: unknown;
};

function buildWebhookPayload(kind: FormKind, body: FormSubmissionBody): string {
  return JSON.stringify({
    formType: kind,
    submittedAt: new Date().toISOString(),
    language: body.language,
    ...(kind === "applicant-questionnaire"
      ? { questionnaire: body.questionnaire }
      : { application: body.application }),
  });
}

async function forwardFormSubmission(kind: FormKind, body: FormSubmissionBody) {
  if (!formWebhookUrl) {
    throw new Error("FORM_WEBHOOK_URL is not configured.");
  }

  const webhookUrl = security.validateWebhookUrl(formWebhookUrl, allowInsecureWebhook);
  const payload = buildWebhookPayload(kind, body);
  const timestamp = Math.floor(Date.now() / 1_000).toString();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-BZ-Form-Type": kind,
    "X-BZ-Timestamp": timestamp,
  };

  if (formWebhookBearerToken) {
    headers.Authorization = `Bearer ${formWebhookBearerToken}`;
  }
  if (formWebhookSigningSecret) {
    headers["X-BZ-Signature"] = security.createWebhookSignature(
      payload,
      timestamp,
      formWebhookSigningSecret,
    );
  }

  const response = await fetch(webhookUrl, {
    body: payload,
    headers,
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`The secure form delivery service returned ${response.status}.`);
  }
}

function hasSubmissionPayload(kind: FormKind, body: FormSubmissionBody) {
  const hasLanguage = body.language === "en" || body.language === "es";
  const payload =
    kind === "applicant-questionnaire" ? body.questionnaire : body.application;

  return hasLanguage && typeof payload === "object" && payload !== null;
}

app.post("/api/forms/:kind", submissionRateLimiter, async (req, res) => {
  res.set("Cache-Control", "no-store");

  const kind = req.params.kind as FormKind;
  if (kind !== "applicant-questionnaire" && kind !== "new-hire-application") {
    res.status(404).json({
      ok: false,
      message: "Unknown form type.",
      requestId: res.locals.requestId,
    });
    return;
  }

  const allowedKeys = kind === "applicant-questionnaire"
    ? ["language", "questionnaire", "security"]
    : ["application", "language", "security"];
  if (!security.onlyHasKeys(req.body, allowedKeys)) {
    res.status(400).json({
      ok: false,
      message: "The form contains unexpected fields.",
      requestId: res.locals.requestId,
    });
    return;
  }

  const body = req.body as FormSubmissionBody;
  const securityResult = security.validateSecurityProof(body.security);
  if (!securityResult.ok) {
    res.status(400).json({
      ok: false,
      message: securityResult.reason,
      requestId: res.locals.requestId,
    });
    return;
  }

  const payload = kind === "applicant-questionnaire" ? body.questionnaire : body.application;
  const payloadResult = security.scanJsonPayload(payload);
  if (!payloadResult.ok) {
    res.status(400).json({
      ok: false,
      message: payloadResult.reason,
      requestId: res.locals.requestId,
    });
    return;
  }

  if (!hasSubmissionPayload(kind, body)) {
    res.status(400).json({
      ok: false,
      message: "The form submission is incomplete or invalid.",
      requestId: res.locals.requestId,
    });
    return;
  }

  if (!formWebhookUrl) {
    res.status(503).json({
      ok: false,
      message:
        "Secure online submission is not configured yet. Please print or save the completed form and contact BZ Resources for next steps.",
      requestId: res.locals.requestId,
    });
    return;
  }

  try {
    await forwardFormSubmission(kind, body);
    console.info("Secure form forwarded", {
      kind,
      language: body.language,
      requestId: res.locals.requestId,
    });
    res.status(202).json({
      ok: true,
      message:
        kind === "applicant-questionnaire"
          ? "Your applicant questionnaire was submitted successfully."
          : "Your new hire packet was submitted successfully.",
      requestId: res.locals.requestId,
    });
  } catch (error) {
    console.error("Secure form delivery failed", {
      kind,
      message: error instanceof Error ? error.message : "Unknown delivery error",
      requestId: res.locals.requestId,
    });
    res.status(502).json({
      ok: false,
      message:
        "The secure delivery service is temporarily unavailable. Please print or save the form and contact BZ Resources.",
      requestId: res.locals.requestId,
    });
  }
});

app.use(((error, _req, res, _next) => {
  const errorRecord = typeof error === "object" && error !== null
    ? error as Record<string, unknown>
    : {};

  if (error instanceof Error && error.message === "CORS_ORIGIN_BLOCKED") {
    res.status(403).json({
      ok: false,
      message: "This website is not allowed to submit forms to the API.",
      requestId: res.locals.requestId,
    });
    return;
  }

  if (error instanceof SyntaxError && errorRecord.status === 400) {
    res.status(400).json({
      ok: false,
      message: "The request body is not valid JSON.",
      requestId: res.locals.requestId,
    });
    return;
  }

  if (errorRecord.type === "entity.too.large") {
    res.status(413).json({
      ok: false,
      message: "The form submission is too large.",
      requestId: res.locals.requestId,
    });
    return;
  }

  console.error("Unhandled API error", {
    message: error instanceof Error ? error.message : "Unknown server error",
    requestId: res.locals.requestId,
  });
  res.set("Cache-Control", "no-store");
  res.status(500).json({
    ok: false,
    message: "An unexpected server error occurred.",
    requestId: res.locals.requestId,
  });
}) as express.ErrorRequestHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
