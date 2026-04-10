# AnyArt

An art gallery website showcasing artworks from the Art Institute of Chicago, with a **demo idea pipeline** for live sessions: audiences submit short feature ideas, vote, and you curate builds from a separate admin app.

## Features

- Browse artworks from the Art Institute of Chicago collection
- Search for specific artworks
- **Feature ideas** ([`/ideas`](http://localhost:3000/ideas)): one-line submissions expanded with Claude into title + description; voting with per-browser limits; creators can edit their own idea text
- Responsive design with modern UI
- Pagination for easy navigation

## Tech Stack

- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- Postgres (Neon) + Prisma ORM
- Jest & React Testing Library

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example` and set at least:

- `DATABASE_URL` — Neon or other Postgres connection string
- `ANTHROPIC_API_KEY` — for expanding raw ideas into title/description

Apply migrations:

```bash
npx prisma migrate deploy
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo admin (presenter)

The presenter dashboard lives in [`demo_anyart_admin/`](./demo_anyart_admin/README.md) (separate Next.js app, same database). It serves Jira creation, Cursor plan links, Cloud Agent prompts, AI curation, and DB reset.

```bash
cd demo_anyart_admin
cp .env.example .env   # same DATABASE_URL + ADMIN_SECRET, Jira, etc.
npm install
npx prisma migrate deploy
npm run dev            # http://localhost:3001
```

## Testing

```bash
npm test
```

See [TESTING.md](./TESTING.md).

## Production migrations (CI)

Merges to `main` that touch `prisma/migrations/**` run [`.github/workflows/migrate.yml`](.github/workflows/migrate.yml), which executes `npx prisma migrate deploy`.

Add a repository secret **`DATABASE_URL`** (your Neon connection string) under **Settings → Secrets and variables → Actions** so the workflow can reach production.

## APIs

- **Art Institute of Chicago** — [API docs](https://api.artic.edu/docs/) (proxied via `app/api/artworks/`)
- **Ideas** — `GET/POST /api/ideas`, `PATCH /api/ideas/[id]`, `POST /api/ideas/[id]/vote`

## Scripts

- `npm run db:migrate` — `prisma migrate deploy`
- `npm run db:reset` — reset DB (destructive)
- `scripts/reset-demo.sh` — git reset to `demo-base` tag + Prisma reset (see script)
