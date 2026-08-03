import crypto = require("node:crypto");
import type { RuntimeConfig } from "./types.js";

type FetchLike = typeof fetch;

class TurnstileConfigurationError extends Error {}

function createTurnstileVerifier(config: RuntimeConfig, fetcher: FetchLike = fetch) {
  return async function verifyTurnstile(
    token: string,
    remoteIp: string | undefined,
    expectedAction: string,
  ): Promise<boolean> {
    if (!config.turnstileSecretKey) {
      throw new TurnstileConfigurationError("Turnstile is not configured.");
    }

    if (!token || token.length > 2_048) return false;

    const response = await fetcher(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        body: new URLSearchParams({
          idempotency_key: crypto.randomUUID(),
          ...(remoteIp ? { remoteip: remoteIp } : {}),
          response: token,
          secret: config.turnstileSecretKey,
        }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) return false;

    const result = (await response.json()) as {
      action?: unknown;
      hostname?: unknown;
      success?: unknown;
    };

    if (result.success !== true || result.action !== expectedAction) return false;

    if (
      config.turnstileAllowedHostnames.size > 0 &&
      (typeof result.hostname !== "string" ||
        !config.turnstileAllowedHostnames.has(result.hostname))
    ) {
      return false;
    }

    return true;
  };
}

const turnstile = { createTurnstileVerifier, TurnstileConfigurationError };

export = turnstile;
