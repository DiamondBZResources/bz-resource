# BZ Resources

Production rebuild for the BZ Resources public website.

## Local Development

Frontend:

```bash
npm --prefix client install
npm --prefix client run dev
```

Server:

```bash
npm --prefix server install
npm --prefix server run dev
```

The Vite dev server proxies `/api` requests to the local Express server at `http://localhost:4000`.

## Production Builds

```bash
npm --prefix client run build
npm --prefix server run build
```

The frontend production build uses the repository base path `/bz-resource/`.

## GitHub Pages Deployment

GitHub Pages deploys only the static frontend from `client/dist`. The Express server in `server/` does not run on GitHub Pages and must be hosted separately if the contact API should submit online.

Expected Pages URL:

```text
https://diamondbzresources.github.io/bz-resource/
```

Enable Pages in GitHub:

```text
Settings -> Pages -> Source -> GitHub Actions
```

Routes use `HashRouter` for static-host compatibility, so nested pages are available at URLs such as:

```text
https://diamondbzresources.github.io/bz-resource/#/about-us
```

This avoids a custom `404.html` redirect layer and keeps direct navigation and refresh working on GitHub Pages.

## Production API Configuration

Set `VITE_API_BASE_URL` during the frontend build when a separately hosted backend is available:

```bash
VITE_API_BASE_URL=https://api.example.com npm --prefix client run build
```

`VITE_` variables are embedded into the browser bundle and are public. Do not store secrets in them.

If `VITE_API_BASE_URL` is empty in production, the contact form remains visible but reports that online submission is not configured and directs visitors to the public phone and email options.

## Cache Strategy

- Vite content-hashed JavaScript and CSS files are suitable for long-term immutable caching by the static host.
- `index.html` should be revalidated and must not be cached long-term, so new deployments do not reference deleted chunks.
- No service worker is registered, and the site is not offline-first.
- The client has a dependency-free in-memory cache utility for safe GET requests only. It uses a five-minute default TTL, deduplicates simultaneous requests, supports explicit invalidation, and never caches failed responses or form submissions.
- The Express server marks `GET /api/health` as a short-lived public cache response and marks `POST /api/contact` plus server errors as `no-store`.

## Notes

- GitHub Pages static hosting cannot run the Express API.
- Contact form delivery requires a separately hosted backend and a production `VITE_API_BASE_URL`.
- Do not commit `client/dist` to `main`; the GitHub Actions workflow uploads it as a Pages artifact.

## Applicant and New Hire Forms

The React application now includes internal multi-step English and Spanish routes for the applicant questionnaire and new-hire onboarding packet:

```text
#/forms/applicant-questionnaire/en
#/forms/applicant-questionnaire/es
#/forms/new-hire-application/en
#/forms/new-hire-application/es
```

Sensitive identity, tax, medical, and banking information is intentionally excluded from the public browser forms. Those documents must be completed through an approved secure onboarding process.

To enable online questionnaire delivery, configure the separately hosted Express server with `FORM_WEBHOOK_URL`. The server forwards the completed form payload to that secure HTTPS webhook and does not write submissions to the repository or browser storage. An optional `FORM_WEBHOOK_BEARER_TOKEN` can be sent as a bearer token. When no webhook is configured, users can print or save their completed form and receive a clear configuration message rather than a false success state.

## Form Security and Malware Protection

The public forms accept structured JSON only. Multipart form data, binary bodies, file fields, embedded data URLs, and large base64-style blobs are rejected before a submission can reach the delivery webhook. The application does not expose a public file-upload endpoint.

The API also includes:

- strict browser-origin allowlisting through `ALLOWED_ORIGINS`
- HTTPS enforcement in production
- security headers and removal of the Express identification header
- per-IP and per-route submission rate limiting
- a hidden bot-trap field and minimum form-completion timing check
- body-size, depth, field-count, array-size, and string-length limits
- rejection of prototype-pollution keys and executable HTML/script payloads
- generic error responses with request IDs and no applicant PII in server logs
- optional HMAC-SHA256 webhook signatures using `FORM_WEBHOOK_SIGNING_SECRET`

The webhook receiver should verify `X-BZ-Timestamp` and `X-BZ-Signature` before processing a form. The signature is computed from:

```text
HMAC_SHA256(secret, timestamp + "." + rawJsonBody)
```

No public upload endpoint should be added without server-side MIME detection, extension allowlisting, private object storage, antivirus scanning such as ClamAV or a managed scanning service, randomized storage names, and a quarantine workflow. Client-side extension checks alone are not malware protection.
