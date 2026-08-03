import crypto = require("node:crypto");
import express = require("express");

const MAX_DEPTH = 8;
const MAX_KEYS = 700;
const MAX_NODES = 3_000;
const MAX_ARRAY_ITEMS = 150;
const MAX_STRING_LENGTH = 8_000;
const MAX_TOTAL_STRING_LENGTH = 140_000;
const MIN_FORM_COMPLETION_MS = 1_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

const forbiddenObjectKeys = new Set(["__proto__", "prototype", "constructor"]);
const forbiddenUploadKeys = new Set([
  "attachment",
  "attachments",
  "base64",
  "contentbytes",
  "file",
  "filename",
  "files",
  "mimetype",
  "upload",
  "uploads",
]);

const suspiciousTextPatterns = [
  /<\s*\/?\s*[a-z][^>]*>/i,
  /\bon[a-z]{3,}\s*=/i,
  /(?:javascript|vbscript)\s*:/i,
  /data\s*:\s*(?:text\/html|application\/(?:javascript|x-javascript|octet-stream)|image\/svg\+xml)/i,
  /\$\{\s*jndi\s*:/i,
  /[\u202A-\u202E\u2066-\u2069]/,
];

const linkPatterns = [
  /(?:https?:\/\/|www\.)/i,
  /\[[^\]]+\]\(\s*[^)]+\)/i,
  /<\s*a\b/i,
  /(?:^|[\s(])(?:[a-z0-9-]+\.)+(?:app|ai|biz|co|com|dev|info|io|ly|me|net|org|us)(?:[\x2F?#:]|\b)/i,
  /\b(?:bit\.ly|buff\.ly|cutt\.ly|goo\.gl|ow\.ly|rebrand\.ly|t\.co|tinyurl\.com)\b/i,
];

const invisibleCharacters =
  /(?:\u{00AD}|\u{034F}|\u{061C}|\u{115F}|\u{1160}|\u{17B4}|\u{17B5}|\u{180E}|[\u{200B}-\u{200F}]|[\u{202A}-\u{202E}]|[\u{2060}-\u{206F}]|\u{FEFF})/gu;

type ScanResult =
  | { ok: true }
  | { ok: false; reason: string };

type RateLimitOptions = {
  keyGenerator?: (request: express.Request) => string[];
  maxRequests: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isLikelyEncodedBinary(value: string): boolean {
  if (value.length < 4_096 || value.length % 4 !== 0 || /\s/.test(value)) {
    return false;
  }

  return /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

function hasUnsupportedControlCharacters(value: string): boolean {
  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (
      codePoint === 0 ||
      (codePoint >= 1 && codePoint <= 8) ||
      codePoint === 11 ||
      codePoint === 12 ||
      (codePoint >= 14 && codePoint <= 31) ||
      codePoint === 127
    ) {
      return true;
    }
  }
  return false;
}

function onlyHasKeys(
  value: unknown,
  allowedKeys: readonly string[],
): value is Record<string, unknown> {
  if (!isPlainObject(value)) return false;
  const allowed = new Set(allowedKeys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function scanJsonPayload(root: unknown): ScanResult {
  let nodeCount = 0;
  let keyCount = 0;
  let totalStringLength = 0;

  const visit = (value: unknown, depth: number, currentKey = ""): ScanResult => {
    nodeCount += 1;
    if (nodeCount > MAX_NODES) {
      return { ok: false, reason: "The submission contains too many values." };
    }

    if (depth > MAX_DEPTH) {
      return { ok: false, reason: "The submission is nested too deeply." };
    }

    if (value === null || typeof value === "boolean") return { ok: true };

    if (typeof value === "number") {
      return Number.isFinite(value)
        ? { ok: true }
        : { ok: false, reason: "The submission contains an invalid number." };
    }

    if (typeof value === "string") {
      totalStringLength += value.length;
      const canonicalValue = value.normalize("NFKC").replace(invisibleCharacters, "");

      if (value.length > MAX_STRING_LENGTH) {
        return { ok: false, reason: "One of the form fields is too long." };
      }
      if (totalStringLength > MAX_TOTAL_STRING_LENGTH) {
        return { ok: false, reason: "The submission is too large." };
      }
      if (hasUnsupportedControlCharacters(value)) {
        return { ok: false, reason: "The submission contains unsupported control characters." };
      }
      if (
        !currentKey.toLowerCase().includes("email") &&
        linkPatterns.some((pattern) => pattern.test(canonicalValue))
      ) {
        return {
          ok: false,
          reason: "Links are not permitted in this form. Please remove the link and try again.",
        };
      }
      if (suspiciousTextPatterns.some((pattern) => pattern.test(canonicalValue))) {
        return { ok: false, reason: "The submission contains blocked executable content." };
      }
      if (isLikelyEncodedBinary(value)) {
        return { ok: false, reason: "Encoded files are not accepted through this form." };
      }
      if (/^\s*data\s*:/i.test(value)) {
        return { ok: false, reason: "Embedded files are not accepted through this form." };
      }

      return { ok: true };
    }

    if (Array.isArray(value)) {
      if (value.length > MAX_ARRAY_ITEMS) {
        return { ok: false, reason: "One of the form lists contains too many items." };
      }

      for (const item of value) {
        const result = visit(item, depth + 1, currentKey);
        if (!result.ok) return result;
      }

      return { ok: true };
    }

    if (!isPlainObject(value)) {
      return { ok: false, reason: "The submission contains an unsupported value." };
    }

    for (const [key, item] of Object.entries(value)) {
      keyCount += 1;
      if (keyCount > MAX_KEYS) {
        return { ok: false, reason: "The submission contains too many fields." };
      }
      if (key.length > 100 || forbiddenObjectKeys.has(key)) {
        return { ok: false, reason: "The submission contains an invalid field name." };
      }
      if (forbiddenUploadKeys.has(key.toLowerCase())) {
        return { ok: false, reason: "File uploads are not accepted through this form." };
      }

      const result = visit(item, depth + 1, key);
      if (!result.ok) return result;
    }

    return { ok: true };
  };

  return visit(root, 0);
}

function validateSecurityProof(value: unknown): ScanResult {
  if (!onlyHasKeys(value, ["consent", "startedAt", "turnstileToken", "website"])) {
    return { ok: false, reason: "The form security check is missing or invalid." };
  }

  const { consent, startedAt, turnstileToken, website } = value;
  if (typeof website !== "string" || website.trim().length > 0) {
    return { ok: false, reason: "The submission was blocked by the spam filter." };
  }
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) {
    return { ok: false, reason: "The form security timestamp is invalid." };
  }
  if (consent !== true) {
    return { ok: false, reason: "Please agree to the privacy consent before submitting." };
  }
  if (
    typeof turnstileToken !== "string" ||
    turnstileToken.length === 0 ||
    turnstileToken.length > 2_048
  ) {
    return { ok: false, reason: "Please complete the security verification and try again." };
  }

  const age = Date.now() - startedAt;
  if (age < MIN_FORM_COMPLETION_MS) {
    return { ok: false, reason: "The form was submitted too quickly. Please try again." };
  }
  if (age > MAX_FORM_AGE_MS || age < 0) {
    return { ok: false, reason: "This form session expired. Please refresh and try again." };
  }

  return { ok: true };
}

function createRequestIdMiddleware(): express.RequestHandler {
  return (req, res, next) => {
    const incoming = req.get("X-Request-ID")?.trim();
    const requestId = incoming && /^[A-Za-z0-9._-]{8,100}$/.test(incoming)
      ? incoming
      : crypto.randomUUID();

    res.locals.requestId = requestId;
    res.set("X-Request-ID", requestId);
    next();
  };
}

function createSecurityHeadersMiddleware(): express.RequestHandler {
  return (req, res, next) => {
    res.set("Content-Security-Policy", "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    res.set("Cross-Origin-Opener-Policy", "same-origin");
    res.set("Cross-Origin-Resource-Policy", "same-site");
    res.set("Permissions-Policy", "camera=(), geolocation=(), microphone=(), payment=(), usb=()");
    res.set("Referrer-Policy", "no-referrer");
    res.set("X-Content-Type-Options", "nosniff");
    res.set("X-Frame-Options", "DENY");

    if (req.secure || req.get("X-Forwarded-Proto") === "https") {
      res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }

    next();
  };
}

function createJsonOnlyMiddleware(): express.RequestHandler {
  return (req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method) && !req.is("application/json")) {
      res.status(415).json({
        ok: false,
        message: "Only JSON form submissions are accepted. File uploads are disabled.",
        requestId: res.locals.requestId,
      });
      return;
    }

    next();
  };
}

function createHttpsMiddleware(enabled: boolean): express.RequestHandler {
  return (req, res, next) => {
    if (!enabled || req.secure || req.get("X-Forwarded-Proto") === "https") {
      next();
      return;
    }

    res.status(426).json({
      ok: false,
      message: "A secure HTTPS connection is required.",
      requestId: res.locals.requestId,
    });
  };
}

function createRateLimiter(options: RateLimitOptions): express.RequestHandler {
  const entries = new Map<string, RateLimitEntry>();

  return (req, res, next) => {
    const now = Date.now();
    const keys = options.keyGenerator?.(req) ?? [
      `${req.ip || req.socket.remoteAddress || "unknown"}:${req.path}`,
    ];
    const activeEntries = keys.map((key) => {
      const existing = entries.get(key);
      const entry = !existing || existing.resetAt <= now
        ? { count: 0, resetAt: now + options.windowMs }
        : existing;

      entry.count += 1;
      entries.set(key, entry);
      return entry;
    });

    if (entries.size > 10_000) {
      for (const [storedKey, storedEntry] of entries) {
        if (storedEntry.resetAt <= now) entries.delete(storedKey);
      }
      while (entries.size > 10_000) {
        const oldestKey = entries.keys().next().value as string | undefined;
        if (!oldestKey) break;
        entries.delete(oldestKey);
      }
    }

    const remaining = Math.max(
      0,
      Math.min(...activeEntries.map((entry) => options.maxRequests - entry.count)),
    );
    const resetSeconds = Math.max(
      1,
      Math.ceil(
        (Math.max(...activeEntries.map((entry) => entry.resetAt)) - now) / 1_000,
      ),
    );
    res.set("RateLimit-Limit", String(options.maxRequests));
    res.set("RateLimit-Remaining", String(remaining));
    res.set("RateLimit-Reset", String(resetSeconds));

    if (activeEntries.some((entry) => entry.count > options.maxRequests)) {
      res.set("Retry-After", String(resetSeconds));
      res.status(429).json({
        ok: false,
        message: "Too many submissions were received. Please wait and try again.",
        requestId: res.locals.requestId,
      });
      return;
    }

    next();
  };
}

const security = {
  createHttpsMiddleware,
  createJsonOnlyMiddleware,
  createRateLimiter,
  createRequestIdMiddleware,
  createSecurityHeadersMiddleware,
  isPlainObject,
  onlyHasKeys,
  scanJsonPayload,
  validateSecurityProof,
};

export = security;
