# Artup

**The open-source, AI-native blogging platform for freelancers and founders.**

Setting up a blog shouldn't take a weekend. Artup gets you writing in minutes — self-hosted, AI-assisted, with analytics that respect your readers' privacy.

[Features](#features) • [Quickstart](#quickstart) • [Tech Stack](#tech-stack) • [Self-Hosting](#self-hosting) • [Contributing](#contributing)

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
# Install dependencies
npm install

# Set up database
cp .env.example .env
npx prisma generate
npx prisma migrate dev

# Start dev server
npm run dev
```

Default dev credentials:
- Email: `admin@artup.local`
- Password: `admin`

### Vercel Deployment

Vercel deployment guide coming in v1.1 (requires database migration to hosted SQLite/PostgreSQL).

## Contributing

Contributions welcome. Check open [issues](../../issues) or start a [discussion](../../discussions) if you want to propose something bigger.

## License

MIT — see [LICENSE](./LICENSE).
