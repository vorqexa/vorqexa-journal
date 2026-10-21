# Vorqexa Journal

Trading journal for Vorqexa traders. Connect a wallet, import trades from Orderly automatically, add notes and tags, and log manual trades.

Static site: React + TypeScript + Vite, hosted on GitHub Pages. No backend, no secrets.

## Status

- [x] Phase 1: branded shell and Pages deploy
- [ ] Phase 2: wallet connect and read-only Orderly key (broker ID `vorqexa`)
- [ ] Phase 3: trade import
- [ ] Phase 4: notes, tags, manual trades, export/import
- [ ] Phase 5: stats and charts
- [ ] Phase 6: hardening (CSP, tests) and launch

## Run locally

```bash
npm install
npm run dev
```

Before the logo shows, copy `logo-sm.webp`, `logo.webp`, `favicon.png` and `favicon-192.png` from the marketing site's `assets/` into `public/assets/`.

## Deploy to GitHub Pages

1. Push to the `main` branch.
2. In the repo: Settings, Pages, Source: **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push.

### Custom domain (journal.vorqexa.xyz)

1. In your DNS, add a `CNAME` record: `journal` pointing to `<your-github-username>.github.io`.
2. In Settings, Pages, set the custom domain and enable HTTPS.
3. Keep `base: "/"` in `vite.config.ts`.

Without a custom domain the site lives at `https://<user>.github.io/<repo>/`. In that case set `base: "/<repo>/"` in `vite.config.ts` and use paths relative to it for assets.

## Branding

See `BRANDING.md`. Colour and type tokens are defined at the top of `src/styles.css`.

## Config

`src/config.ts` holds the broker ID and ecosystem links. `SITE_URL` is an assumption: change it if the marketing site is not at `https://vorqexa.xyz`.
