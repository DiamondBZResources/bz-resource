import assert = require("node:assert/strict");
import test = require("node:test");
import security = require("./security.js");

test("accepts ordinary questionnaire data", () => {
  const result = security.scanJsonPayload({
    applicantName: "Example Applicant",
    shifts: ["first", "second"],
    workExperienceNotes: "Warehouse and inventory experience.",
  });

  assert.deepEqual(result, { ok: true });
});

test("blocks executable markup", () => {
  const result = security.scanJsonPayload({
    comments: '<script src="https://example.invalid/payload.js"></script>',
  });

  assert.equal(result.ok, false);
});

test("blocks file-like fields and encoded binary", () => {
  const fileField = security.scanJsonPayload({ filename: "payload.exe" });
  const encodedFile = security.scanJsonPayload({
    notes: "A".repeat(4_096),
  });

  assert.equal(fileField.ok, false);
  assert.equal(encodedFile.ok, false);
});

test("blocks prototype pollution keys", () => {
  const payload = JSON.parse('{"__proto__":{"polluted":true}}') as unknown;
  const result = security.scanJsonPayload(payload);

  assert.equal(result.ok, false);
});

test("validates the bot trap and completion timestamp", () => {
  const valid = security.validateSecurityProof({
    startedAt: Date.now() - 2_000,
    website: "",
  });
  const bot = security.validateSecurityProof({
    startedAt: Date.now() - 2_000,
    website: "https://spam.invalid",
  });

  assert.deepEqual(valid, { ok: true });
  assert.equal(bot.ok, false);
});
