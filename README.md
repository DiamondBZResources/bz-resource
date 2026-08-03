# BZ Resources

The BZ Resources public website is a Vite/React frontend with a separate Express API for secure form delivery through Microsoft Graph.

## Local development

Install dependencies and copy the placeholder environment files before starting either application:

```bash
copy client\.env.example client\.env.local
copy server\.env.example server\.env
npm --prefix client install
npm --prefix server install
npm --prefix server run dev
npm --prefix client run dev
```

The Vite development server proxies `/api` to `http://localhost:4000`. Cloudflare provides documented Turnstile test keys for local automated or manual testing; never use a production secret in the frontend.

## Production architecture

- GitHub Pages hosts only the static output from `client/dist`.
- The Express application in `server/` must run on a protected HTTPS backend such as Azure App Service or an equivalent Node host.
- The browser sends JSON to the backend. It never receives Microsoft Entra credentials, the Graph access token, the recipient address, or the Turnstile secret.
- The backend validates and normalizes the payload, verifies Turnstile, applies abuse controls, creates both plain-text and HTML email bodies, and calls Microsoft Graph `sendMail` using application-only authentication.

The frontend uses `HashRouter`, so Pages routes remain refresh-safe under `/bz-resource/`.

## Environment configuration

Only these public build variables belong in `client/.env.local` or the frontend deployment environment:

```text
VITE_API_BASE_URL=https://api.example.com
VITE_TURNSTILE_SITE_KEY=public-widget-site-key
```

Every `VITE_` value is embedded into the browser bundle. Never put a client secret, Graph token, Turnstile secret, sender credential, or private recipient configuration there.

Configure the protected backend with the variables documented in `server/.env.example`:

```text
ALLOWED_ORIGIN=https://diamondbzresources.github.io
AZURE_TENANT_ID=...
AZURE_CLIENT_ID=...
AZURE_CLIENT_SECRET=...
GRAPH_SENDER_EMAIL=website-forms@your-domain.example
FORM_RECIPIENT_EMAIL=staffing-inquiries@your-domain.example
TURNSTILE_SECRET_KEY=...
TURNSTILE_ALLOWED_HOSTNAMES=diamondbzresources.github.io
```

Store real backend values in the hosting platform's secret manager or application settings. Do not commit `.env`, `.env.local`, certificates, or exported deployment settings.

## Microsoft Entra and Graph setup

Manual administrator steps are required before real delivery can work:

1. Create a dedicated Microsoft Entra app registration for the BZ website form backend.
2. Add the Microsoft Graph **Application** permission `Mail.Send` only, and have an administrator grant tenant-wide consent. Do not add delegated permissions or unrelated Graph scopes.
3. Restrict the application to the dedicated sender mailbox with Exchange Online Application RBAC (or the currently supported mailbox-scoping control in the tenant). If an unscoped Entra `Mail.Send` grant remains, its access is combined with any RBAC assignment, so remove the unscoped grant when adopting RBAC and verify the effective scope.
4. Create a client secret, record its expiration, and place it only in the backend secret store. A certificate or managed workload identity should be preferred when the selected host and tenant support it.
5. Set `GRAPH_SENDER_EMAIL` to the authorized mailbox and `FORM_RECIPIENT_EMAIL` to the internal inbox that should receive website inquiries.

The API requests a client-credentials token with `https://graph.microsoft.com/.default` and sends MIME content through `POST /users/{sender}/sendMail`. Microsoft Graph returns `202 Accepted` when the request is accepted for processing; this does not constitute a final-delivery receipt.

## Cloudflare Turnstile setup

1. Create a Turnstile widget and allow the production website hostname plus any approved preview hostname.
2. Put the public site key in `VITE_TURNSTILE_SITE_KEY` during the frontend build.
3. Put the secret key only in the backend `TURNSTILE_SECRET_KEY` setting.
4. Set `TURNSTILE_ALLOWED_HOSTNAMES` to the exact hostnames expected in successful verification responses.

The backend validates every token with Cloudflare Siteverify and checks its success result, action, and hostname. Turnstile tokens are single-use and short-lived, so the frontend obtains a fresh token after expiration or a failed attempt.

## Form endpoints and security

All forms use one shared backend delivery service:

```text
POST /api/contact
POST /api/forms/applicant-questionnaire
POST /api/forms/new-hire-application
```

The implementation includes:

- required privacy consent, a hidden honeypot, minimum completion time, and server-verified Turnstile
- frontend guidance plus authoritative backend validation and normalization
- rejection of links, HTML, executable content, control characters, header injection, prototype-pollution keys, file-like fields, data URLs, and oversized or deeply nested JSON
- exact-origin CORS, HTTPS enforcement in production, security headers, no-store submission responses, request IDs, and generic delivery errors that preserve entered form data
- rate limiting by hashed IP and normalized email (five attempts per 15 minutes by default) and a short duplicate-submission window
- controlled subject categories, HTML escaping, plain-text and HTML email bodies, an external-content warning, and no visitor PII in application logs

The in-memory limiter protects a single server process. A multi-instance production deployment should replace it with a shared store such as managed Redis while preserving the IP-and-email policy.

Sensitive identity, tax, medical, and banking fields remain intentionally excluded from these public forms. Any legal, privacy, employment, accessibility, retention, and email-footer language must be reviewed by qualified counsel for BZ Resources and every jurisdiction where it operates; the code comments and template text are not legal advice or a compliance guarantee.

## Images and page loading

The checked-in originals live in `client/image-sources`. The deliberate optimization command uses Sharp to correct EXIF orientation, omit metadata, avoid upscaling, and generate the responsive files under `client/src/assets/generated`:

```bash
npm --prefix client run images:optimize
```

The generated files and their small TypeScript URL modules are committed because the GitHub Pages workflow performs a normal deterministic Vite build. `npm run build` runs `images:check`; it does not recompress images, but fails with instructions when an original or the optimization settings changed.

When adding an image:

1. Put the authorized, highest-quality original in `client/image-sources`.
2. Add one entry with practical output widths to `client/scripts/optimize-images.mjs`.
3. Run `npm run images:optimize`, review the result visually, then commit the source and generated files together.
4. Render it through `ResponsiveImage` with accurate `sizes` and descriptive alt text (or empty alt text for a decorative image).

The current source set is 42.89 MiB. All generated AVIF, WebP, and fallback variants together are 11.84 MiB, a 72.4% reduction in deployed image bytes even though the generated total includes several widths and formats for each large photograph. A typical browser downloads only the best matching candidate from each `<picture>` element.

The homepage hero and route page hero are eager with high fetch priority because they can be the largest above-the-fold content. Other content images are lazy-loaded and decoded asynchronously. Explicit intrinsic dimensions and stable frame aspect ratios prevent layout shifts. Secondary routes are code-split; page-specific image URL modules are loaded with their route, and image files remain external hashed assets rather than being embedded in JavaScript.

No custom webfonts are downloaded. The only third-party resource initialized by the application is Cloudflare Turnstile, and its script is loaded only when a form renders the security widget.

## Browser and service-worker caching

Vite emits JavaScript, CSS, and generated images with content hashes, so changed content receives a new URL on every deployment. Those `/assets/` requests are safe for a one-year immutable HTTP policy on hosts that support custom headers. GitHub Pages controls its own response headers and does not provide repository-level configuration for forcing that header, so no ignored `.htaccess`, IIS, Nginx, or Express configuration is included.

The existing service worker is retained with a versioned cache:

- only same-origin Vite `/assets/` URLs use cache-first behavior
- navigations use network-first with explicit revalidation, with cached HTML used only as an offline fallback
- old cache versions are removed during activation
- stable public files such as `favicon.png` and downloadable PDFs are not treated as immutable build assets
- API paths and every non-GET request bypass Cache Storage completely

The form API sets `Cache-Control: no-store`, `Pragma: no-cache`, and `Expires: 0` on POST responses, including errors with request IDs. Form contents, CAPTCHA exchanges, authentication data, and Microsoft Graph responses are never written to browser storage or service-worker caches.

## Validation and builds

```bash
npm --prefix client run lint
npm --prefix client run images:check
npm --prefix client run build
npm --prefix server run lint
npm --prefix server run build
npm --prefix server test
```

The server tests exercise valid delivery, required fields, malformed email, links, HTML, header injection, oversized bodies, honeypot submissions, missing/invalid CAPTCHA, rate limiting, duplicates, unauthorized CORS origins, and Microsoft Graph authentication/delivery failures.

## GitHub Pages deployment

Enable `Settings -> Pages -> Source -> GitHub Actions`. During the production frontend build, provide the public API URL and Turnstile site key as build variables. The backend and all private settings must be deployed separately; GitHub Pages cannot execute the Express API.

Expected Pages URL:

```text
https://diamondbzresources.github.io/bz-resource/
```
