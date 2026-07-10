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
