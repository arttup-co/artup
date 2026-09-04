# Artup

**The open-source, AI-native blogging platform for freelancers and founders.**

Setting up a blog shouldn't take a weekend. Artup gets you writing in minutes — self-hosted, AI-assisted, with analytics that respect your readers' privacy.

[Features](#features) • [Quickstart](#quickstart) • [Tech Stack](#tech-stack) • [Self-Hosting](#self-hosting) • [Contributing](#contributing)

---

> **⚠️ Pre-v1.0 Status**
> Artup is in active development. Local development and core features work now. Production deployment (Docker + one-command installer) is being finalized. Follow progress in [Issues](../../issues) or [Discussions](../../discussions).

---

## Why Artup

Most blogging tools force a trade-off: easy-but-locked-in (Medium, Substack) or powerful-but-painful-to-set-up (self-hosted WordPress, Ghost with manual server config). Artup is built to remove that trade-off — one command gets you a fully working, AI-native blog on infrastructure you own.

## Features

### v1.0 (Current)
- 🚀 **One-command deploy** — Docker Compose, works on any VPS/cloud provider
- ✍️ **Modern editor** — Novel/Tiptap-based rich text editor
- 🔓 **No lock-in** — your posts, your SQLite database, your domain
- 🔒 **Simple auth** — email/password, no external dependencies
- 📦 **Zero config** — SQLite database, no separate DB container needed
- 🔐 **Auto HTTPS** — Caddy handles SSL certificates automatically

### Coming Soon
- ✍️ **AI-assisted writing** (v1.4) — inline autocomplete, auto-generated SEO
- 📊 **Built-in analytics** (v1.2) — cookieless, first-party tracking
- 🎨 **Themes** (v1.3) — customizable design system
- 📷 **Image uploads** (v1.1) — S3-compatible storage

## Quickstart

### Prerequisites
- A VPS with Docker and Docker Compose installed
- A domain name pointing to your server's IP address

### Installation

```bash
git clone https://github.com/arttup-co/artup.git
cd artup
chmod +x install.sh
./install.sh
```

The installer will prompt you for:
- Your domain name (e.g., `blog.example.com`)
- Admin email address
- Admin password

That's it! Your blog will be live with automatic HTTPS in a few minutes.

## Tech Stack

Next.js 15 (App Router) · TypeScript · SQLite · Prisma ORM · Auth.js · Tailwind · shadcn/ui · Docker · Caddy

## Self-Hosting

### Docker Compose (Recommended)

The [install.sh](install.sh) script handles everything automatically. For manual setup:

1. Copy [.env.example](.env.example) to `.env` and configure
2. Run `docker compose up -d --build`
3. Your blog will be available at your domain with automatic HTTPS

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and uncomment the dev defaults (lines 26-28):
#   ADMIN_EMAIL=admin@artup.local
#   ADMIN_PASSWORD=admin
#   NEXTAUTH_URL=http://localhost:3000
# Also generate NEXTAUTH_SECRET: openssl rand -base64 32

# 3. Set up database
npx prisma generate
npx prisma migrate dev

# 4. Create admin user (reads from .env)
npm run db:seed

# 5. Start dev server
npm run dev
```

Default dev credentials:
- Email: `admin@artup.local`
- Password: `admin`

### Production Build (Local)

For testing production mode locally:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment for production
cp .env.example .env

# Generate a secure secret for production
openssl rand -base64 32
# Copy the output and add it to .env as NEXTAUTH_SECRET

# Edit .env with production settings:
#   NODE_ENV=production
#   DATABASE_URL=file:./prisma/prod.db
#   NEXTAUTH_URL=http://localhost:3000 (or your domain)
#   NEXTAUTH_SECRET=<paste the generated secret here>
#   ADMIN_EMAIL and ADMIN_PASSWORD for your admin account

# 3. Set up database (production mode)
npx prisma generate
npm run db:migrate:deploy  # Non-interactive, production-safe migrations

# 4. Create admin user
npm run db:seed

# 5. Build and start production server
npm run build
npm run start
```

### Vercel Deployment

Vercel deployment guide coming in v1.1 (requires database migration to hosted SQLite/PostgreSQL).

## Contributing

Contributions welcome. Check open [issues](../../issues) or start a [discussion](../../discussions) if you want to propose something bigger.

## License

MIT — see [LICENSE](./LICENSE).
