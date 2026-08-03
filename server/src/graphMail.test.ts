import assert = require("node:assert/strict");
import test = require("node:test");
import type { RuntimeConfig } from "./types.js";
import graphMail = require("./graphMail.js");

const config: RuntimeConfig = {
  allowedOrigins: new Set(),
  azureClientId: "client-id",
  azureClientSecret: "client-secret",
  azureTenantId: "tenant-id",
  bodyLimit: "100kb",
  duplicateWindowMs: 300_000,
  enforceHttps: false,
  formRecipientEmail: "recipient@example.com",
  graphSenderEmail: "sender@example.com",
  isProduction: false,
  port: 4000,
  rateLimitMax: 5,
  rateLimitWindowMs: 900_000,
  turnstileAllowedHostnames: new Set(),
  turnstileSecretKey: "turnstile-secret",
};

const content = {
  html: "<p>HTML version</p>",
  plainText: "Plain text version",
  subject: "New BZ Resources Website Inquiry — General Inquiry",
};

test("reports Microsoft Graph authentication failures without exposing token details", async () => {
  const fetcher = (async () => new Response("", { status: 401 })) as typeof fetch;
  const client = graphMail.createGraphMailClient(config, fetcher);

  await assert.rejects(
    () => client.sendMail(content),
    graphMail.GraphAuthenticationError,
  );
});

test("reports Microsoft Graph delivery failures", async () => {
  let calls = 0;
  const fetcher = (async () => {
    calls += 1;
    if (calls === 1) {
      return new Response(JSON.stringify({ access_token: "secret-token", expires_in: 3600 }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
    return new Response("", { status: 500 });
  }) as typeof fetch;
  const client = graphMail.createGraphMailClient(config, fetcher);

  await assert.rejects(() => client.sendMail(content), graphMail.GraphDeliveryError);
});

test("sends a multipart plain-text and HTML MIME message", async () => {
  let mimeBody = "";
  let calls = 0;
  const fetcher = (async (_input: string | URL | Request, init?: RequestInit) => {
    calls += 1;
    if (calls === 1) {
      return new Response(JSON.stringify({ access_token: "secret-token", expires_in: 3600 }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
    mimeBody = Buffer.from(String(init?.body), "base64").toString("utf8");
    return new Response("", { status: 202 });
  }) as typeof fetch;
  const client = graphMail.createGraphMailClient(config, fetcher);

  await client.sendMail(content);

  assert.match(mimeBody, /multipart\/alternative/);
  assert.match(mimeBody, /text\/plain/);
  assert.match(mimeBody, /text\/html/);
  assert.doesNotMatch(mimeBody, /secret-token/);
});
