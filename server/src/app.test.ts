import assert = require("node:assert/strict");
import test = require("node:test");
import request = require("supertest");
import appModule = require("./app.js");
import type { RuntimeConfig } from "./types.js";

function testConfig(overrides: Partial<RuntimeConfig> = {}): RuntimeConfig {
  return {
    allowedOrigins: new Set(["https://allowed.example"]),
    azureClientId: "client-id",
    azureClientSecret: "client-secret",
    azureTenantId: "tenant-id",
    bodyLimit: "100kb",
    duplicateWindowMs: 5 * 60_000,
    enforceHttps: false,
    formRecipientEmail: "recipient@example.com",
    graphSenderEmail: "sender@example.com",
    isProduction: false,
    port: 4000,
    rateLimitMax: 5,
    rateLimitWindowMs: 15 * 60_000,
    turnstileAllowedHostnames: new Set(),
    turnstileSecretKey: "turnstile-secret",
    ...overrides,
  };
}

function validContact(overrides: Record<string, unknown> = {}) {
  return {
    company: "Example Company",
    email: "visitor@example.com",
    firstName: "Ana",
    inquiryType: "staffing",
    lastName: "O'Neil",
    message: "We need help staffing our operations team next month.",
    phone: "+1 (352) 555-0100",
    security: {
      consent: true,
      startedAt: Date.now() - 2_000,
      turnstileToken: "valid-token",
      website: "",
    },
    ...overrides,
  };
}

function createTestApp(
  config = testConfig(),
  verifyTurnstile: () => Promise<boolean> = async () => true,
) {
  return appModule.createApp(config, {
    sendMail: async () => undefined,
    verifyTurnstile,
  });
}

test("accepts and delivers a valid form submission", async () => {
  let deliveries = 0;
  const app = appModule.createApp(testConfig(), {
    sendMail: async (content) => {
      deliveries += 1;
      assert.match(content.subject, /Staffing Services$/);
      assert.match(content.plainText, /official BZ Resources website/);
      assert.match(content.html, /Security notice/);
    },
    verifyTurnstile: async () => true,
  });

  const response = await request(app)
    .post("/api/contact")
    .set("Origin", "https://allowed.example")
    .send(validContact());

  assert.equal(response.status, 202);
  assert.equal(response.body.delivery, true);
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.equal(response.headers.pragma, 'no-cache');
  assert.equal(deliveries, 1);
});

test("routes applicant and new-hire forms through the shared delivery service", async () => {
  const subjects: string[] = [];
  const actions: string[] = [];
  const app = appModule.createApp(testConfig(), {
    sendMail: async (content) => {
      subjects.push(content.subject);
    },
    verifyTurnstile: async (_token, _ip, action) => {
      actions.push(action);
      return true;
    },
  });
  const security = validContact().security;

  const applicant = await request(app)
    .post("/api/forms/applicant-questionnaire")
    .send({
      language: "en",
      questionnaire: {
        applicantName: "Ana O'Neil",
        consent: "agreed",
        contactNumber: "+1 (352) 555-0100",
        position: "Warehouse Associate",
        workExperienceNotes: "Five years of warehouse and fulfillment experience.",
      },
      security,
    });
  const newHire = await request(app)
    .post("/api/forms/new-hire-application")
    .send({
      application: {
        applicantSignature: "Ana O'Neil",
        email: "ana@example.com",
        firstName: "Ana",
        lastName: "O'Neil",
        mobilePhone: "+1 (352) 555-0100",
        position: "Warehouse Associate",
        secureDocumentsAcknowledged: "agreed",
      },
      language: "en",
      security,
    });

  assert.equal(applicant.status, 202);
  assert.equal(newHire.status, 202);
  assert.deepEqual(actions, ["applicant-questionnaire", "new-hire-application"]);
  assert.deepEqual(subjects, [
    "New BZ Resources Website Inquiry — Applicant Questionnaire",
    "New BZ Resources Website Inquiry — New Hire Application",
  ]);
});

test("rejects missing required fields and invalid email formats", async () => {
  const app = createTestApp();
  const missing = await request(app).post("/api/contact").send(validContact({ firstName: "" }));
  const invalidEmail = await request(app)
    .post("/api/contact")
    .send(validContact({ email: "not-an-email" }));

  assert.equal(missing.status, 400);
  assert.equal(invalidEmail.status, 400);
});

test("rejects links, HTML injection, and email-header injection", async () => {
  const app = createTestApp();
  const link = await request(app)
    .post("/api/contact")
    .send(validContact({ message: "Please review https://example.com before calling us." }));
  const html = await request(app)
    .post("/api/contact")
    .send(validContact({ message: "This message includes <script>alert(1)</script> content." }));
  const header = await request(app)
    .post("/api/contact")
    .send(validContact({ firstName: "Ana\r\nBcc: attacker@example.com" }));

  assert.equal(link.status, 400);
  assert.match(link.body.message, /Links are not permitted/);
  assert.equal(html.status, 400);
  assert.equal(header.status, 400);
});

test("rejects oversized JSON requests", async () => {
  const app = createTestApp(testConfig({ bodyLimit: "1kb" }));
  const response = await request(app)
    .post("/api/contact")
    .send(validContact({ message: "A".repeat(1_500) }));

  assert.equal(response.status, 413);
});

test("rejects honeypot completion and missing or invalid CAPTCHA tokens", async () => {
  const app = createTestApp();
  const bot = await request(app)
    .post("/api/contact")
    .send(validContact({
      security: {
        ...validContact().security,
        website: "spam",
      },
    }));
  const missingToken = await request(app)
    .post("/api/contact")
    .send(validContact({
      security: {
        ...validContact().security,
        turnstileToken: "",
      },
    }));
  const invalidApp = createTestApp(testConfig(), async () => false);
  const invalidToken = await request(invalidApp)
    .post("/api/contact")
    .send(validContact());

  assert.equal(bot.status, 400);
  assert.equal(missingToken.status, 400);
  assert.equal(invalidToken.status, 400);
});

test("rate limits by request identity", async () => {
  const app = createTestApp(testConfig({ rateLimitMax: 1 }));
  const first = await request(app).post("/api/contact").send(validContact());
  const second = await request(app)
    .post("/api/contact")
    .send(validContact({ email: "second@example.com" }));

  assert.equal(first.status, 202);
  assert.equal(second.status, 429);
});

test("prevents duplicate submissions", async () => {
  const app = createTestApp();
  const first = await request(app).post("/api/contact").send(validContact());
  const second = await request(app).post("/api/contact").send(validContact());

  assert.equal(first.status, 202);
  assert.equal(second.status, 409);
});

test("rejects an unauthorized CORS origin", async () => {
  const app = createTestApp();
  const response = await request(app)
    .post("/api/contact")
    .set("Origin", "https://unauthorized.example")
    .send(validContact());

  assert.equal(response.status, 403);
  assert.equal(response.body.ok, false);
});
