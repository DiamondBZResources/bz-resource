import url = require("node:url");
import security = require("./security.js");
import type {
  FormKind,
  ValidationResult,
} from "./types.js";

const inquiryTypes = {
  "job-seeker": "Job Seeker Support",
  other: "General Inquiry",
  payroll: "Payroll Support",
  recruiting: "Recruiting",
  "screening-training": "Screening & Training",
  staffing: "Staffing Services",
} as const;

const invisibleCharacters =
  /(?:\u{00AD}|\u{034F}|\u{061C}|\u{115F}|\u{1160}|\u{17B4}|\u{17B5}|\u{180E}|[\u{200B}-\u{200F}]|[\u{202A}-\u{202E}]|[\u{2060}-\u{206F}]|\u{FEFF})/gu;
const namePattern = /^[\p{L}\p{M} .'-]+$/u;
const phonePattern = /^[0-9+().\-\s#xXextEXT]{7,30}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function removeInvisibleCharacters(value: string): string {
  return value.normalize("NFKC").replace(invisibleCharacters, "");
}

function normalizeSingleLine(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string" || /[\r\n]/.test(value)) return undefined;
  const normalized = removeInvisibleCharacters(value).replace(/[\t ]+/g, " ").trim();
  return normalized.length <= maxLength ? normalized : undefined;
}

function normalizeMultiline(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = removeInvisibleCharacters(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return normalized.length <= maxLength ? normalized : undefined;
}

function normalizeEmail(value: unknown): string | undefined {
  const candidate = normalizeSingleLine(value, 254);
  if (!candidate || !emailPattern.test(candidate)) return undefined;

  const separator = candidate.lastIndexOf("@");
  const local = candidate.slice(0, separator);
  const domain = url.domainToASCII(candidate.slice(separator + 1).toLowerCase());
  const normalized = `${local}@${domain}`;

  return domain && normalized.length <= 254 && emailPattern.test(normalized)
    ? normalized
    : undefined;
}

function validateName(value: string | undefined): value is string {
  return Boolean(value && value.length >= 2 && value.length <= 100 && namePattern.test(value));
}

function normalizePayload(value: unknown): unknown {
  if (typeof value === "string") {
    return normalizeMultiline(value, 8_000) ?? "";
  }
  if (Array.isArray(value)) return value.map(normalizePayload);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizePayload(item)]),
    );
  }
  return value;
}

function invalidContentMessage(body: unknown): string | undefined {
  const result = security.scanJsonPayload(body);
  return result.ok ? undefined : result.reason;
}

function validateContact(body: unknown): ValidationResult {
  if (
    !security.onlyHasKeys(body, [
      "company",
      "email",
      "firstName",
      "inquiryType",
      "lastName",
      "message",
      "phone",
      "security",
    ])
  ) {
    return { ok: false, message: "The contact form contains unexpected fields." };
  }

  const blockedMessage = invalidContentMessage({
    company: body.company,
    firstName: body.firstName,
    inquiryType: body.inquiryType,
    lastName: body.lastName,
    message: body.message,
    phone: body.phone,
  });
  if (blockedMessage) return { ok: false, message: blockedMessage };

  const firstName = normalizeSingleLine(body.firstName, 100);
  const lastName = normalizeSingleLine(body.lastName, 100);
  const name = [firstName, lastName].filter(Boolean).join(" ");
  const email = normalizeEmail(body.email);
  const phone = normalizeSingleLine(body.phone, 30);
  const company = normalizeSingleLine(body.company, 150) ?? "";
  const message = normalizeMultiline(body.message, 2_000);
  const inquiryType = normalizeSingleLine(body.inquiryType, 40);

  if (
    !firstName ||
    !lastName ||
    !namePattern.test(firstName) ||
    !namePattern.test(lastName) ||
    !validateName(name)
  ) {
    return {
      ok: false,
      message: "Please enter a valid name using letters, spaces, apostrophes, periods, or hyphens.",
    };
  }
  if (!email) return { ok: false, message: "Please enter a valid email address." };
  if (!phone || !phonePattern.test(phone)) {
    return { ok: false, message: "Please enter a valid phone number." };
  }
  if (!message || message.length < 20) {
    return { ok: false, message: "Please enter a message of at least 20 characters." };
  }
  if (!inquiryType || !(inquiryType in inquiryTypes)) {
    return { ok: false, message: "Please select a valid inquiry type." };
  }

  return {
    ok: true,
    submission: {
      company,
      details: {},
      email,
      formKind: "contact",
      formName: "Contact page inquiry",
      inquiryCategory: inquiryTypes[inquiryType as keyof typeof inquiryTypes],
      message,
      name,
      phone,
    },
  };
}

function validateApplicant(body: unknown): ValidationResult {
  if (!security.onlyHasKeys(body, ["language", "questionnaire", "security"])) {
    return { ok: false, message: "The applicant form contains unexpected fields." };
  }
  if ((body.language !== "en" && body.language !== "es") || !security.isPlainObject(body.questionnaire)) {
    return { ok: false, message: "The applicant form is incomplete or invalid." };
  }
  const blockedMessage = invalidContentMessage(body.questionnaire);
  if (blockedMessage) return { ok: false, message: blockedMessage };

  const details = normalizePayload(body.questionnaire) as Record<string, unknown>;
  const name = normalizeSingleLine(details.applicantName, 100);
  const phone = normalizeSingleLine(details.contactNumber, 30);
  const position = normalizeSingleLine(details.position, 150);
  const notes = normalizeMultiline(details.workExperienceNotes, 2_000);

  if (!validateName(name) || !phone || !phonePattern.test(phone) || !position) {
    return { ok: false, message: "The applicant form is incomplete or invalid." };
  }
  if (!notes || notes.length < 20) {
    return { ok: false, message: "Please provide at least 20 characters of work experience information." };
  }
  if (details.consent !== "agreed") {
    return { ok: false, message: "Please complete the applicant confirmation." };
  }

  return {
    ok: true,
    submission: {
      company: "",
      details,
      email: "",
      formKind: "applicant-questionnaire",
      formName: "Applicant questionnaire",
      inquiryCategory: "Applicant Questionnaire",
      message: notes,
      name,
      phone,
    },
  };
}

function validateNewHire(body: unknown): ValidationResult {
  if (!security.onlyHasKeys(body, ["application", "language", "security"])) {
    return { ok: false, message: "The new hire form contains unexpected fields." };
  }
  if ((body.language !== "en" && body.language !== "es") || !security.isPlainObject(body.application)) {
    return { ok: false, message: "The new hire form is incomplete or invalid." };
  }
  const blockedMessage = invalidContentMessage(body.application);
  if (blockedMessage) return { ok: false, message: blockedMessage };

  const details = normalizePayload(body.application) as Record<string, unknown>;
  const firstName = normalizeSingleLine(details.firstName, 100);
  const lastName = normalizeSingleLine(details.lastName, 100);
  const name = [firstName, lastName].filter(Boolean).join(" ");
  const email = normalizeEmail(details.email);
  const phone =
    normalizeSingleLine(details.mobilePhone, 30) ||
    normalizeSingleLine(details.homePhone, 30) ||
    "";
  const position = normalizeSingleLine(details.position, 150);
  const signature = normalizeSingleLine(details.applicantSignature, 100);

  if (!validateName(name) || !email || !position || !validateName(signature)) {
    return { ok: false, message: "The new hire form is incomplete or invalid." };
  }
  if (phone && !phonePattern.test(phone)) {
    return { ok: false, message: "Please enter a valid phone number." };
  }
  if (details.secureDocumentsAcknowledged !== "agreed") {
    return { ok: false, message: "Please complete the secure-document acknowledgment." };
  }

  return {
    ok: true,
    submission: {
      company: "",
      details,
      email,
      formKind: "new-hire-application",
      formName: "New hire application",
      inquiryCategory: "New Hire Application",
      message: "A completed new hire application was submitted through the website.",
      name,
      phone,
    },
  };
}

function validateSubmission(kind: FormKind, body: unknown): ValidationResult {
  if (kind === "contact") return validateContact(body);
  if (kind === "applicant-questionnaire") return validateApplicant(body);
  return validateNewHire(body);
}

function extractNormalizedEmail(kind: FormKind, body: unknown): string | undefined {
  if (!security.isPlainObject(body)) return undefined;
  if (kind === "contact") return normalizeEmail(body.email);
  if (kind === "new-hire-application" && security.isPlainObject(body.application)) {
    return normalizeEmail(body.application.email);
  }
  return undefined;
}

const validation = {
  extractNormalizedEmail,
  inquiryTypes,
  normalizeEmail,
  normalizeMultiline,
  normalizeSingleLine,
  validateSubmission,
};

export = validation;
