import type { RuntimeConfig } from "./types.js";

function commaSeparatedSet(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim().replace(/\/$/, ""))
      .filter(Boolean),
  );
}

function loadConfig(environment: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const isProduction = environment.NODE_ENV === "production";
  const allowedOrigins = commaSeparatedSet(environment.ALLOWED_ORIGIN);

  if (!isProduction) {
    allowedOrigins.add("http://localhost:5173");
    allowedOrigins.add("http://localhost:5174");
    allowedOrigins.add("http://localhost:5175");
    allowedOrigins.add("http://localhost:5176");
  }

  return {
    allowedOrigins,
    azureClientId: environment.AZURE_CLIENT_ID?.trim() ?? "",
    azureClientSecret: environment.AZURE_CLIENT_SECRET?.trim() ?? "",
    azureTenantId: environment.AZURE_TENANT_ID?.trim() ?? "",
    bodyLimit: environment.FORM_BODY_LIMIT?.trim() || "100kb",
    duplicateWindowMs:
      (Number(environment.FORM_DUPLICATE_WINDOW_MINUTES) || 5) * 60_000,
    enforceHttps: environment.ENFORCE_HTTPS
      ? environment.ENFORCE_HTTPS === "true"
      : isProduction,
    formRecipientEmail: environment.FORM_RECIPIENT_EMAIL?.trim() ?? "",
    graphSenderEmail: environment.GRAPH_SENDER_EMAIL?.trim() ?? "",
    isProduction,
    port: Number(environment.PORT) || 4000,
    rateLimitMax: Number(environment.FORM_RATE_LIMIT_MAX) || 5,
    rateLimitWindowMs:
      (Number(environment.FORM_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60_000,
    turnstileAllowedHostnames: commaSeparatedSet(
      environment.TURNSTILE_ALLOWED_HOSTNAMES,
    ),
    turnstileSecretKey: environment.TURNSTILE_SECRET_KEY?.trim() ?? "",
  };
}

const config = { loadConfig };

export = config;
