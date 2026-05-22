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

## Contact form storage (Vercel OIDC)

The contact form saves via `/api/contact` using Vercel OIDC — no AWS access keys in code.

**Postgres (Aurora/RDS)** — used when `PGHOST` is set:

1. Connect **Amazon Aurora PostgreSQL** on the [Vercel Marketplace](https://vercel.com/marketplace).
2. Link the project and pull env: `vercel link` → `vercel env pull .env.local`
3. Create the table: `npm run db:init` (or run `scripts/init-contact-table.sql` in AWS Query Editor)
4. `npm install` and deploy

**DynamoDB** — fallback when `PGHOST` is not set but `DYNAMODB_TABLE_NAME` is:

1. Connect the **DynamoDB** integration.
2. Deploy — items use `PK: CONTACT` and `SK: {timestamp}#{id}`.

| Standard | Integration-prefixed |
|----------|----------------------|
| `AWS_REGION` | `SPACEKAYSONKELLY_AWS_REGION` |
| `AWS_ROLE_ARN` | `SPACEKAYSONKELLY_AWS_ROLE_ARN` |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE` | (often auto-set by integration) |
| `DYNAMODB_TABLE_NAME` | `SPACEKAYSONKELLY_DYNAMODB_TABLE_NAME` |

See `.env.example` and `lib/pg.js` for the RDS IAM pool pattern.

## Before going live

1. **Domain** — Add `webxbeam.com` in Vercel → Project → Domains; update `og:url`, canonical, and `sitemap.xml` if the domain differs.
2. **Phone** — Replace the WhatsApp placeholder in `index.html`.
3. **DynamoDB** — Confirm the Vercel ↔ AWS OIDC integration is linked to this project.
4. **OG image** — For LinkedIn/Facebook, export `og-image.svg` to `og-image.png` (1200×630) and update the `og:image` meta tag.

## Local preview

```bash
npx serve .
```

Open http://localhost:3000
