import type { MailContent, NormalizedSubmission } from './types'

function esc(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char)
}

function titleFor(kind: NormalizedSubmission['formKind']) {
  if (kind === 'contact') return 'Website Contact Inquiry'
  if (kind === 'new-hire-application') return 'New Hire Application'
  return 'Applicant Questionnaire'
}

function label(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
}

export function buildMail(submission: NormalizedSubmission, requestId: string): MailContent {
  const heading = titleFor(submission.formKind)
  const rows = Object.entries(submission.details)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid #e5ebef;color:#17324a;width:34%">${esc(label(key))}</th><td style="padding:10px 12px;border-bottom:1px solid #e5ebef;white-space:pre-wrap">${esc(value)}</td></tr>`)
    .join('')

  const html = `<!doctype html><html><body style="margin:0;background:#f3f7f9;font-family:Arial,sans-serif;color:#20303b"><div style="max-width:760px;margin:0 auto;padding:28px"><div style="background:#071e35;color:#fff;padding:26px 30px"><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#73d2ed">BZ Resources</div><h1 style="font-size:26px;margin:8px 0 0">${esc(heading)}</h1></div><div style="background:#fff;padding:28px 30px"><p style="margin-top:0"><strong>Name:</strong> ${esc(submission.name)}<br><strong>Email:</strong> ${esc(submission.email)}<br><strong>Phone:</strong> ${esc(submission.phone)}${submission.company ? `<br><strong>Company:</strong> ${esc(submission.company)}` : ''}</p><table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table><p style="margin:24px 0 0;color:#6a7881;font-size:12px">Language: ${submission.language.toUpperCase()} · Request ID: ${esc(requestId)} · Submitted through bz-resource website.</p></div></div></body></html>`

  const textLines = Object.entries(submission.details).filter(([, value]) => value.trim()).map(([key, value]) => `${label(key)}: ${value}`)
  const text = [heading, '', `Name: ${submission.name}`, `Email: ${submission.email}`, `Phone: ${submission.phone}`, submission.company ? `Company: ${submission.company}` : '', '', ...textLines, '', `Request ID: ${requestId}`].filter(Boolean).join('\n')

  return {
    subject: `[BZ Website] ${heading} - ${submission.name}`,
    html,
    text,
    replyTo: submission.email,
  }
}
