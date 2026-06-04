# AGENTS.md

## Cursor Cloud specific instructions

### Product

**AnyArt** — Next.js 15 art gallery (Art Institute of Chicago API) plus `/ideas` feature pipeline (Postgres + Prisma). The separate presenter app `demo_anyart_admin/` is documented in README but is **not** in this repository.

### Services

| Service | Required for | Start |
|---------|----------------|-------|
| Next.js dev server | All UI/API work | `npm run dev` → http://localhost:3000 |
| PostgreSQL | `/ideas` and idea APIs | See **Database** below |
| Art Institute API | Home gallery / search | External; needs outbound network |
| Anthropic API | **New** idea submissions only | `ANTHROPIC_API_KEY` in `.env` |

Gallery-only work does not need Postgres or Anthropic.

### Database

This Cloud VM uses **system PostgreSQL 16** (not Docker; Docker is not installed by default):

```bash
sudo pg_ctlcluster 16 main start   # if not running
```

Connection string used locally:

`postgresql://postgres:postgres@localhost:5432/anyart`

Create DB once: `sudo -u postgres createdb anyart` (if missing). Copy `.env.example` → `.env` and set `DATABASE_URL`. Apply schema: `npx prisma migrate deploy` (or `npm run db:migrate`). Migrations are **not** re-run on every VM startup via the update script—run them after schema changes or on a fresh database.

Alternative: `docker compose up -d` per `docker-compose.yml` (same credentials/DB name) if Docker is available.

### Standard commands

See `README.md` and `package.json`:

- **Lint:** `npm run lint`
- **Test:** `npm test` (Jest; no DB or dev server required)
- **Build:** `npm run build` (runs `prisma generate` + `next build`)
- **Dev:** `npm run dev`

Node **20+** matches CI (`.github/workflows/migrate.yml`); Node 22 works.

### Non-obvious notes

- `postinstall` runs `prisma generate`; `npm install` alone refreshes the Prisma client after schema changes.
- Jest tests mock external APIs; they do not start Postgres or Next.js.
- Listing/voting/editing existing ideas works without `ANTHROPIC_API_KEY`; only `POST /api/ideas` expansion needs it.
- Long-running dev server: use a tmux session (e.g. `anyart-dev`) with `npm run dev` in `/workspace`.
