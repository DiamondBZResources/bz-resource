type RuntimeConfig = {
  allowedOrigins: Set<string>;
  azureClientId: string;
  azureClientSecret: string;
  azureTenantId: string;
  bodyLimit: string;
  duplicateWindowMs: number;
  enforceHttps: boolean;
  formRecipientEmail: string;
  graphSenderEmail: string;
  isProduction: boolean;
  port: number;
  rateLimitMax: number;
  rateLimitWindowMs: number;
  turnstileAllowedHostnames: Set<string>;
  turnstileSecretKey: string;
};

type EmailContent = {
  html: string;
  plainText: string;
  subject: string;
};

type FormKind = "contact" | "applicant-questionnaire" | "new-hire-application";

type NormalizedSubmission = {
  company: string;
  details: Record<string, unknown>;
  email: string;
  formKind: FormKind;
  formName: string;
  inquiryCategory: string;
  message: string;
  name: string;
  phone: string;
};

type ValidationResult =
  | { ok: true; submission: NormalizedSubmission }
  | { ok: false; message: string };

export type {
  EmailContent,
  FormKind,
  NormalizedSubmission,
  RuntimeConfig,
  ValidationResult,
};
