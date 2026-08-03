import crypto = require("node:crypto");
import emailTemplate = require("./emailTemplate.js");
import type { NormalizedSubmission } from "./types.js";

type MailClient = {
  sendMail(content: ReturnType<typeof emailTemplate.buildEmailContent>): Promise<void>;
};

class DuplicateSubmissionError extends Error {}

function createFormSubmissionService(
  mailClient: MailClient,
  duplicateWindowMs: number,
  now: () => Date = () => new Date(),
) {
  const recentSubmissions = new Map<string, number>();

  function fingerprint(submission: NormalizedSubmission): string {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(submission))
      .digest("hex");
  }

  async function submit(
    submission: NormalizedSubmission,
    requestId: string,
  ): Promise<void> {
    const submittedAt = now();
    const hash = fingerprint(submission);
    const previousSubmission = recentSubmissions.get(hash);

    if (
      previousSubmission !== undefined &&
      previousSubmission + duplicateWindowMs > submittedAt.getTime()
    ) {
      throw new DuplicateSubmissionError("Duplicate form submission.");
    }

    for (const [storedHash, storedAt] of recentSubmissions) {
      if (storedAt + duplicateWindowMs <= submittedAt.getTime()) {
        recentSubmissions.delete(storedHash);
      }
    }

    const content = emailTemplate.buildEmailContent(
      submission,
      requestId,
      submittedAt,
    );
    await mailClient.sendMail(content);
    recentSubmissions.set(hash, submittedAt.getTime());
  }

  return { submit };
}

const formSubmissionService = {
  createFormSubmissionService,
  DuplicateSubmissionError,
};

export = formSubmissionService;
