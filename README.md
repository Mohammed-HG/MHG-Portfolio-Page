# Mohammed Alghareeb — Portfolio

React portfolio with a separately hosted Express contact API.
Live: https://mohammed-hg-portfolio.netlify.app

## Local development

Use Node.js 24.15 or newer. Run `npm ci` in the root and in `backend`.
Copy each `.env.example` to `.env` in the same directory.
Start the API with `npm start --prefix backend` and the frontend with `npm run dev`.
Never point development contact requests at the production mail service.

## Checks

- `npm run lint`
- `npm test`
- `npm run build`
- `npm test --prefix backend`
- `npm audit` in both dependency trees.

## Production

Netlify follows the GitHub `main` branch and reads `netlify.toml`.
The existing Render service follows the same repository, with root directory `backend`,
build `npm ci`, start `npm start`, Node 24, and health check `/healthz`.
No database is needed. Do not attach this application's configuration to the QR service.

### Signed API proxy

Set a new random 32-byte secret (hex) as `PORTFOLIO_PROXY_SECRET` in **both**:

1. The portfolio Netlify project, with Runtime scope.
2. The portfolio Render service.

Netlify signs API requests; the server verifies the HS256 signature, expiration,
issuer, production context and exact site URL before trusting Netlify client-IP metadata.
Direct or forged API requests fail closed. Keep this secret out of `VITE_*`, Git and logs.

Set `NODE_ENV=production`, `CLIENT_ORIGIN=https://mohammed-hg-portfolio.netlify.app`
and `TRUST_PROXY_HOPS=1` in Render. The verified Netlify client IP isolates contact
rate limits per visitor; arbitrary headers on direct requests are not trusted.

### Contact configuration

The public reCAPTCHA site key is stored in the Netlify build configuration; it is
intentionally public. The secret verification key stays only in Render.
Keep `VITE_CONTACT_ENABLED=false` until the mail provider is configured and tested.
Set it to `true` in the production build configuration only after that check.

Set `VITE_RECAPTCHA_SITE_KEY` in Netlify builds. Set the matching
`RECAPTCHA_SECRET_KEY` and `RECAPTCHA_ALLOWED_HOSTNAMES=mohammed-hg-portfolio.netlify.app`
in Render. Register this exact domain for a reCAPTCHA v2 checkbox key.

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
`FROM_EMAIL` and `TO_EMAIL` in Render. `SMTP_PASSWORD` is accepted as an alias.
Use a verified sender and TLS. Render Free blocks SMTP ports 25, 465 and 587;
select a provider that supports a permitted alternate port such as 2525.
Do not disable TLS certificate verification. Do not send test messages without the
owner's authorization.

Missing mail or CAPTCHA configuration returns 503 and the frontend offers LinkedIn.
`/healthz` reports process health; `/readyz` reports configuration readiness only,
not proof that a real email has been delivered.

Deploy previews must not send production email: signed requests require production
context and the production site URL. Disable preview builds in Netlify to conserve usage.

## Design

Navy backgrounds, cyan primary actions and restrained amber accents keep the terminal
identity consistent. Tabs support arrow keys/Home/End; navigation supports Escape,
outside clicks and normal anchors. Motion respects reduced-motion preferences.
