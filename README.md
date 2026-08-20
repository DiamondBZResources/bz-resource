# BZ Resources Modernized Website

A replacement-ready React + TypeScript/Vite website for BZ Resources, with a separate Express forms API.

## What changed

- Modern full-width editorial layout with stronger typography and deliberate section rhythm.
- Focused split homepage hero using an optimized, locally bundled BZ workplace image.
- Continuously moving services marquee with reduced-motion support.
- Substantial employer, job-seeker, process, industry, certification, and Ocala office sections.
- Responsive desktop/mobile navigation.
- Global English / Spanish language switch saved in the browser.
- English / Spanish contact, applicant questionnaire, and new-hire application pages.
- Microsoft Graph email delivery for website submissions.
- Google reCAPTCHA v2 Checkbox on every online form.
- Server-side reCAPTCHA verification, CORS allowlist, in-memory rate limiting, duplicate prevention, honeypot protection, payload scanning, input limits, and HTML escaping.
- GitHub Pages deployment workflow with SPA fallback for direct route refreshes.

## Folder layout

```text
client/   React + Vite website deployed to GitHub Pages
server/   Express API that verifies reCAPTCHA and sends mail through Microsoft Graph
```

GitHub Pages is static hosting, so `server/` must run on an API host such as your existing Node/Azure service. Never put the Graph client secret or reCAPTCHA secret in Vite/GitHub Pages variables.

## 1. Run locally

Open two terminals.

### API

```powershell
cd server
Copy-Item .env.example .env
npm install
npm run dev
```

Fill in the server `.env` before testing delivery.

### Website

```powershell
cd client
Copy-Item .env.example .env
npm install
npm run dev
```

For local development, leave `VITE_API_BASE_URL` blank. Vite proxies `/api` to `http://localhost:4000`.

## 2. Microsoft Graph setup

Use a Microsoft Entra app registration for the API, not the browser.

Server environment variables:

```env
AZURE_TENANT_ID=...
AZURE_CLIENT_ID=...
AZURE_CLIENT_SECRET=...
GRAPH_SENDER_EMAIL=noreply@yourdomain.com
FORM_RECIPIENT_EMAIL=ceo@bz-resources.com
```

The Entra app needs Microsoft Graph **Application** permission `Mail.Send` with admin consent. The server requests a client-credentials token and posts to `/users/{sender}/sendMail`.

For tighter production security, scope the app's mailbox access in Microsoft 365/Exchange to only the sender mailbox your website needs.

## 3. Google reCAPTCHA v2 Checkbox

Create a reCAPTCHA v2 Checkbox site and register the production hostname(s), including:

```text
diamondbzresources.github.io
```

Client variable (public):

```env
VITE_RECAPTCHA_SITE_KEY=your_public_site_key
```

Server variables (private):

```env
RECAPTCHA_SECRET_KEY=your_private_secret
RECAPTCHA_ALLOWED_HOSTNAMES=diamondbzresources.github.io
```

The browser receives a challenge token. The server verifies that token with Google's `siteverify` endpoint before it sends any email.

## 4. API CORS

Production server example:

```env
ALLOWED_ORIGIN=https://diamondbzresources.github.io
```

Use only origins, without `/bz-resource/` at the end. Add a custom production domain later as a comma-separated value if needed.

## 5. GitHub Pages variables

Repository → **Settings → Secrets and variables → Actions → Variables**

Create:

```text
VITE_API_BASE_URL       https://YOUR-API-HOST
VITE_RECAPTCHA_SITE_KEY YOUR-PUBLIC-RECAPTCHA-SITE-KEY
```

`VITE_API_BASE_URL` should not end in `/api`. The client adds `/api/contact` and `/api/forms/...` itself.

Then enable GitHub Pages with **GitHub Actions** as the source. The included `.github/workflows/deploy-pages.yml` builds the client and deploys it.

## 6. Server deployment

Deploy the `server/` folder to your existing Node-capable API host. Set all values from `server/.env.example` in that host's environment/settings. Do not commit `.env`.

Health check:

```text
GET /api/health
```

Expected JSON:

```json
{ "status": "ok" }
```

## 7. Forms included

- Contact inquiry: `POST /api/contact`
- Applicant questionnaire: `POST /api/forms/applicant-questionnaire`
- New-hire application: `POST /api/forms/new-hire-application`

The new-hire web form intentionally does **not** request Social Security numbers, identity-document images, medical information, banking information, or tax documents. Those should continue through BZ Resources' approved secure onboarding process rather than ordinary website email.

## 8. Validate before deployment

```powershell
cd client
npm install
npm run lint
npm run build

cd ..\server
npm install
npm run check
```

The Pages workflow deploys the client automatically after a successful build. The original BZ logo and project photography are bundled locally; the responsive image pipeline verifies generated AVIF, WebP, and fallback assets before every production build.
