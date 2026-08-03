import type { EmailContent, RuntimeConfig } from "./types.js";
import crypto = require("node:crypto");

type FetchLike = typeof fetch;

class DeliveryConfigurationError extends Error {}
class GraphAuthenticationError extends Error {}
class GraphDeliveryError extends Error {}

function requireGraphConfiguration(config: RuntimeConfig) {
  const values = [
    config.azureTenantId,
    config.azureClientId,
    config.azureClientSecret,
    config.graphSenderEmail,
    config.formRecipientEmail,
  ];

  if (values.some((value) => !value)) {
    throw new DeliveryConfigurationError("Microsoft Graph delivery is not configured.");
  }
  if (
    [config.graphSenderEmail, config.formRecipientEmail].some(
      (value) => /[\r\n]/.test(value) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    )
  ) {
    throw new DeliveryConfigurationError("Graph sender or recipient configuration is invalid.");
  }
}

function createGraphMailClient(config: RuntimeConfig, fetcher: FetchLike = fetch) {
  let tokenCache: { accessToken: string; expiresAt: number } | undefined;

  async function getAccessToken(): Promise<string> {
    requireGraphConfiguration(config);

    if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
      return tokenCache.accessToken;
    }

    const tokenResponse = await fetcher(
      `https://login.microsoftonline.com/${encodeURIComponent(config.azureTenantId)}/oauth2/v2.0/token`,
      {
        body: new URLSearchParams({
          client_id: config.azureClientId,
          client_secret: config.azureClientSecret,
          grant_type: "client_credentials",
          scope: "https://graph.microsoft.com/.default",
        }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!tokenResponse.ok) {
      throw new GraphAuthenticationError(
        `Microsoft identity platform returned ${tokenResponse.status}.`,
      );
    }

    const tokenBody = (await tokenResponse.json()) as {
      access_token?: unknown;
      expires_in?: unknown;
    };

    if (typeof tokenBody.access_token !== "string") {
      throw new GraphAuthenticationError("Microsoft identity platform returned no token.");
    }

    const expiresIn =
      typeof tokenBody.expires_in === "number" ? tokenBody.expires_in : 3_600;
    tokenCache = {
      accessToken: tokenBody.access_token,
      expiresAt: Date.now() + expiresIn * 1_000,
    };

    return tokenBody.access_token;
  }

  async function sendMail(content: EmailContent): Promise<void> {
    const accessToken = await getAccessToken();
    const boundary = `bz-${crypto.randomBytes(18).toString("hex")}`;
    const encodedSubject = Buffer.from(content.subject, "utf8").toString("base64");
    const mimeMessage = [
      `From: ${config.graphSenderEmail}`,
      `To: ${config.formRecipientEmail}`,
      `Subject: =?UTF-8?B?${encodedSubject}?=`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(content.plainText, "utf8").toString("base64"),
      `--${boundary}`,
      "Content-Type: text/html; charset=utf-8",
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(content.html, "utf8").toString("base64"),
      `--${boundary}--`,
      "",
    ].join("\r\n");
    const graphResponse = await fetcher(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.graphSenderEmail)}/sendMail`,
      {
        body: Buffer.from(mimeMessage, "utf8").toString("base64"),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "text/plain",
        },
        method: "POST",
        signal: AbortSignal.timeout(15_000),
      },
    );

    if (graphResponse.status !== 202) {
      throw new GraphDeliveryError(`Microsoft Graph returned ${graphResponse.status}.`);
    }
  }

  return { sendMail };
}

const graphMail = {
  createGraphMailClient,
  DeliveryConfigurationError,
  GraphAuthenticationError,
  GraphDeliveryError,
};

export = graphMail;
