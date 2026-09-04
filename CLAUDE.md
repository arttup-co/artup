# Artup — Project Context

## Vision
Open-source, AI-native blogging platform for freelancers and founders. The core
problem: setting up a blog takes too long. Artup should get someone from zero
to a live, working blog in one command, self-hosted on infrastructure they own.
AI features come later — v1 proves the core product works without them.

## Target user
Freelancers, indie founders, and professionals who want to publish articles to
share knowledge/experience and build a presence online — not developers who
want to hand-roll infra.

## Deployment model (important, shapes architecture)
Single-tenant: each deployment = one person's blog (like Ghost or WriteFreely),
NOT a multi-tenant SaaS with many users signing up on one shared instance.

Primary deploy path: **Docker Compose on any VPS/cloud** (DigitalOcean, Hetzner,
Lightsail, etc.) via a one-command installer script. Secondary/optional path:
Vercel + Neon Postgres, documented later.

## Tech stack (decided)
- Next.js 15, App Router, TypeScript
- SQLite via Prisma ORM with LibSQL adapter
- Auth.js (NextAuth v5) — email/password authentication for v1
- Editor: Novel (Tiptap-based) — AI autocomplete plugin OFF for v1
- Styling: Tailwind + shadcn/ui
- Reverse proxy / TLS: Caddy (auto Let's Encrypt from a domain env var)
- (Deferred to later versions: Vercel AI SDK, S3-compatible media storage,
  analytics stack — see roadmap below)

## V1.0 SCOPE — MINIMAL, SHIP THIS FIRST
The only bar: a stranger can deploy Artup and publish a real article within
minutes. Nothing beyond this list belongs in v1.0.

Included:
- Auth: email/password authentication (no OAuth, no email verification)
- Create / edit / publish a post via Novel editor (AI plugin disabled)
- Draft vs. published state
- Public blog views: post list, single post page, author page
- Cover image as a plain URL field (NOT an upload pipeline)
- Docker Compose + one-command install.sh
- README, LICENSE (MIT), .env.example

Explicitly OUT of v1.0 (do not build yet, do not add tables/deps for these):
- Image upload / S3-compatible storage
- Analytics (pageviews, referrers, read time)
- OAuth login providers
- Themes/customization
- Any AI feature (writing assist, auto SEO, auto-summary, semantic search)

## Release cadence (after v1.0 ships)
- v1.1 — image upload (S3-compatible), OAuth login
- v1.2 — analytics (cookieless pageviews/referrers)
- v1.3 — themes/customization
- v1.4 — AI writing assist
- v1.5 — auto SEO (title/meta/tags)
- v1.6 — semantic search, auto-summary

## V1.0 Data model (final for this phase)
Only two tables: `users`, `posts`. No `analytics_events`, no `media`, no
`ai_usage` — those are added in later versions, not now.

## Deployment packaging (target deliverables for v1.0)
- `docker-compose.yml` — app + SQLite + caddy services
- `Caddyfile` — minimal reverse proxy + auto-HTTPS config
- `install.sh` — one-command installer: checks Docker, prompts for domain +
  admin email/password, generates `.env`, runs `docker compose up -d`, creates admin user
- `.env.example` — documents every variable for manual setup too
- `start.js` — Docker entry point that runs migrations then starts Next.js

## Repo / org
- GitHub org: `arttup-co` (reused existing org)
- Repo: `arttup-co/artup`
- License: MIT
- Status: private, will flip to public once v1.0 works end-to-end

## Branch strategy
`main` always deployable, feature branches merged via PR.

## Current phase
V1.0 deployment infrastructure complete. Core features implemented:
- Prisma schema with User and Post models
- Email/password authentication via Auth.js
- Docker deployment with SQLite database
- One-command installer with admin account creation
Next: complete remaining v1.0 features (post editor, public pages).

## Decisions log
- Cut analytics and image upload from v1.0 to keep the first release truly
  minimal and shippable — both return in v1.1/v1.2.
- Cover image is a plain URL field in v1.0, not an upload pipeline.
- **Switched from PostgreSQL to SQLite** (2026-09-03): Simpler for single-tenant
  deployments, no separate database container needed, single-file portability.
- **Switched from magic link to email/password auth** (2026-09-04): Eliminates
  SMTP dependency for single-tenant use case, matches WordPress-like setup UX,
  simpler installation (no email service required), better for self-hosted model.

## Commit conventions
Every commit authored with Claude's help must credit both authors. Use git's
standard co-author trailer format — add this as the last lines of the commit
message body (blank line before it, exact spacing matters):

Co-authored-by: Ilias Annouri <annouri.ilias@gmail.com>
Co-authored-by: Claude <noreply@anthropic.com>

Example full commit:

    feat: add posts schema and Drizzle migrations

    Co-authored-by: Ilias Annouri <annouri.ilias@gmail.com>
    Co-authored-by: Claude <noreply@anthropic.com>