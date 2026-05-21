# WebXBeam

Marketing site for **WebXBeam** — digital marketing, web development, and AI automation.

## Project structure

```
WebXBeam/
├── index.html      # Full site (Home, About, Services, Contact)
├── 404.html        # Branded 404 with redirect home
├── vercel.json     # Clean URLs, security headers, SPA routes
├── og-image.svg    # Social preview image (export PNG for best compatibility)
├── robots.txt
├── sitemap.xml
└── README.md
```

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
cd WebXBeam
vercel
```

Production: `vercel --prod`

### Option B — Git (recommended)

1. Push this repo to GitHub/GitLab/Bitbucket
2. Import at [vercel.com/new](https://vercel.com/new)
3. **Framework preset:** Other
4. **Build command:** (leave empty)
5. **Output directory:** `./`
6. Deploy — every push to `main` redeploys

### Option C — Drag and drop

Import the project folder at [vercel.com/new](https://vercel.com/new) (no build step required).

## Routes

| URL | Page |
|-----|------|
| `/` | Home |
| `/about` | About |
| `/services` | Services |
| `/contact` | Contact |

Vercel rewrites serve `index.html` for section URLs; client-side routing handles the rest.

## Before going live

1. **Domain** — Add `webxbeam.com` in Vercel → Project → Domains; update `og:url`, canonical, and `sitemap.xml` if the domain differs.
2. **Phone** — Replace the contact phone placeholder in `index.html`.
3. **Contact form** — Create a [Formspree](https://formspree.io) form and set `data-formspree-id="your_form_id"` on `#cform`. Without it, submit opens a `mailto:` draft.
4. **OG image** — For LinkedIn/Facebook, export `og-image.svg` to `og-image.png` (1200×630) and update the `og:image` meta tag.

## Local preview

```bash
npx serve .
```

Open http://localhost:3000
