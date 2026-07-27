# Security Policy

## Public form boundary

The public BZ Resources website accepts text-based JSON form submissions only. It does not accept resumes, images, PDFs, Office documents, executables, archives, or other attachments. Requests using multipart form data or non-JSON content types are rejected.

## Controls included

- explicit CORS origin allowlist
- production HTTPS enforcement
- API security headers and disabled `X-Powered-By`
- 400 KB request-body limit
- per-IP, per-route submission rate limiting
- honeypot and minimum completion-time bot checks
- JSON depth, node, key, array, and string limits
- prototype-pollution key rejection
- executable-markup and embedded-data rejection
- base64-style binary payload rejection
- exact top-level field allowlists
- generic errors with request IDs
- no applicant PII in application logs
- HTTPS webhook validation and optional HMAC-SHA256 signatures

## Deployment requirements

1. Host the Express API behind TLS and set `NODE_ENV=production`.
2. Set `ALLOWED_ORIGINS` to the exact production website origin.
3. Store webhook tokens and signing secrets only in the server environment.
4. Set a long random `FORM_WEBHOOK_SIGNING_SECRET` and verify signatures at the receiver.
5. Keep the API and dependencies patched.
6. Place production rate limiting in a shared store or edge service if multiple API instances are used. The included limiter is per process.
7. Keep sensitive identity, tax, medical, and banking documents out of these public forms.

## Future file uploads

Do not add a public upload endpoint without all of the following:

- strict extension and MIME allowlists
- server-side file-signature detection
- low size and count limits
- randomized storage names
- private storage outside the web root
- antivirus or managed malware scanning
- quarantine before staff access
- archive and macro handling rules
- authorization and audit logs
- automatic retention and deletion controls

Client-side checks alone do not protect against malware.

## Reporting a vulnerability

Report suspected vulnerabilities privately to the project administrator. Do not include real applicant data in a bug report.
