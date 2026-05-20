# WebXBeam — Vercel Deployment

## Project structure

```
webxbeam/
├── index.html      ← Full site (all 4 pages as a SPA)
├── 404.html        ← Custom 404 that redirects to home
├── vercel.json     ← Routing, headers, caching config
└── README.md
```

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
cd webxbeam
vercel
```

Follow the prompts. On subsequent deploys: `vercel --prod`

### Option B — Vercel Dashboard (drag & drop)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the entire `webxbeam/` folder onto the import area
3. Click **Deploy** — no build settings needed (static site)

### Option C — Git (recommended for ongoing updates)

1. Push this folder to a GitHub/GitLab/Bitbucket repo
2. Import the repo in the Vercel dashboard
3. Framework preset: **Other** (no build command, output dir: `./`)
4. Every push to `main` auto-deploys

## What's configured

- **Clean URLs** — `/index.html` served at `/`
- **SPA rewrites** — all routes fall through to `index.html`
- **Security headers** — X-Frame-Options, XSS Protection, Content-Type sniffing prevention
- **Asset caching** — fonts, CSS, JS, images cached for 1 year; HTML always revalidated
- **Custom 404** — branded page with auto-redirect to home

## Before going live

- [ ] Update `og:url` and `og:image` in `<head>` with your real domain
- [ ] Add your real phone number in the Contact section
- [ ] Add a real `og-image.png` (1200×630px) to the root folder
- [ ] Wire up the contact form to a backend (Formspree, Netlify Forms, or custom API)
- [ ] Set your custom domain in Vercel → Project Settings → Domains
