import type { EmailContent, NormalizedSubmission } from "./types.js";

const securityNotice =
  "Security notice: This content was submitted by a website visitor. Do not open unexpected attachments, follow payment instructions, or share credentials based solely on this message.";

/*
 * This footer is general informational language, not a guarantee of legal
 * compliance. Qualified legal counsel should review the final privacy,
 * employment, staffing, email, accessibility, and data-retention language for
 * BZ Resources and every jurisdiction where it operates.
 */
const legalFooter = `BZ Resources
This message was generated from a form submitted through the BZ Resources website. The information provided by the sender has not been independently verified.

This communication is intended only for the addressed recipient and may contain confidential or proprietary information. If you received it in error, please notify the sender and delete it. Nothing in this message constitutes legal, tax, financial, employment, or professional advice, nor does it create a contract, employment relationship, staffing agreement, or other binding obligation unless confirmed in a separately executed written agreement.

Personal information contained in this message should be handled only for legitimate business purposes and in accordance with applicable privacy and data-retention policies. Do not forward or disclose it unless authorized.`;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function humanizeKey(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function flattenDetails(
  value: unknown,
  prefix = "",
): Array<{ label: string; value: string }> {
  if (value === null || value === undefined || value === "") return [];
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [{ label: prefix || "Value", value: String(value) }];
  }
  if (Array.isArray(value)) {
    const primitiveValues = value.filter(
      (item) => ["boolean", "number", "string"].includes(typeof item),
    );
    if (primitiveValues.length === value.length) {
      return primitiveValues.length
        ? [{ label: prefix || "Items", value: primitiveValues.join(", ") }]
        : [];
    }
    return value.flatMap((item, index) =>
      flattenDetails(item, `${prefix} ${index + 1}`.trim()),
    );
  }
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      flattenDetails(item, [prefix, humanizeKey(key)].filter(Boolean).join(" — ")),
    );
  }
  return [];
}

function buildEmailContent(
  submission: NormalizedSubmission,
  requestId: string,
  submittedAt: Date,
): EmailContent {
  const subject = `New BZ Resources Website Inquiry — ${submission.inquiryCategory}`;
  const coreRows = [
    ["Submission date and time", submittedAt.toISOString()],
    ["Form or page name", submission.formName],
    ["Inquiry category", submission.inquiryCategory],
    ["Name", submission.name || "Not provided"],
    ["Email", submission.email || "Not provided"],
    ["Phone", submission.phone || "Not provided"],
    ["Company", submission.company || "Not provided"],
    ["Request ID", requestId],
  ] as const;
  const detailRows = flattenDetails(submission.details);

  const plainText = [
    subject,
    "",
    ...coreRows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    submission.message,
    "",
    securityNotice,
    ...(detailRows.length
      ? [
          "",
          "Additional form details:",
          ...detailRows.map((row) => `${row.label}: ${row.value}`),
        ]
      : []),
    "",
    "This message was submitted through the official BZ Resources website.",
    "",
    "---",
    legalFooter,
    "---",
  ].join("\n");

  const htmlRows = coreRows
    .map(
      ([label, value]) =>
        `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;color:#24477f;background:#eef3fb;border-bottom:1px solid #d8e0e8">${escapeHtml(label)}</th><td style="padding:8px 12px;color:#172635;border-bottom:1px solid #d8e0e8">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const detailHtml = detailRows.length
    ? `<h2 style="margin:28px 0 12px;color:#172635;font-size:18px">Additional form details</h2><table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #d8e0e8">${detailRows
        .map(
          (row) =>
            `<tr><th style="width:38%;padding:7px 10px;text-align:left;vertical-align:top;color:#24477f;background:#f5f7f9;border-bottom:1px solid #d8e0e8">${escapeHtml(row.label)}</th><td style="padding:7px 10px;white-space:pre-wrap;color:#172635;border-bottom:1px solid #d8e0e8">${escapeHtml(row.value)}</td></tr>`,
        )
        .join("")}</table>`
    : "";

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f5f7f9;font-family:Arial,Helvetica,sans-serif"><div style="max-width:760px;margin:0 auto;padding:28px 18px"><div style="padding:28px;background:#ffffff;border-top:5px solid #335fae"><h1 style="margin:0 0 22px;color:#172635;font-family:Georgia,serif;font-size:28px">${escapeHtml(subject)}</h1><table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #d8e0e8">${htmlRows}</table><h2 style="margin:28px 0 10px;color:#172635;font-size:18px">Message</h2><div style="padding:16px;white-space:pre-wrap;color:#172635;background:#f8fafc;border-left:4px solid #6f93e5">${escapeHtml(submission.message)}</div><div style="margin-top:18px;padding:14px;color:#5f3c00;background:#fff5d8;border:1px solid #ead39a;font-weight:700">${escapeHtml(securityNotice)}</div>${detailHtml}<p style="margin:24px 0 0;color:#526577">This message was submitted through the official BZ Resources website.</p><div style="margin-top:30px;padding-top:20px;border-top:1px solid #d8e0e8;color:#738293;font-size:12px;line-height:1.55;white-space:pre-wrap">${escapeHtml(legalFooter)}</div></div></div></body></html>`;

  return { html, plainText, subject };
}

const emailTemplate = { buildEmailContent, escapeHtml };

export = emailTemplate;
