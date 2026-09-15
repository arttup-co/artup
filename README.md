# Artup

**The open-source, AI-native blogging platform for freelancers and founders.**

Setting up a blog shouldn't take a weekend. Artup gets you writing in minutes — self-hosted, AI-assisted, with analytics that respect your readers' privacy.

[Features](#features) • [Quickstart](#quickstart) • [Tech Stack](#tech-stack) • [Deployment](#deployment) • [Contributing](#contributing)

---

> **⚠️ Pre-v1.0 Status**
> Artup is in active development. Core features work and can be deployed to any Node.js hosting platform. Follow progress in [Issues](../../issues) or [Discussions](../../discussions).

---

## Why Artup

Most blogging tools force a trade-off: easy-but-locked-in (Medium, Substack) or powerful-but-painful-to-set-up (self-hosted WordPress, Ghost with manual server config). Artup is built to remove that trade-off — simple setup with standard npm commands gets you a fully working blog on infrastructure you own.

## Features

### v1.0 (Current)
- 🚀 **Simple deployment** — Works on any Node.js platform (Vercel, Railway, Render, VPS)
- ✍️ **Modern editor** — Novel/Tiptap-based rich text editor
- 🔓 **No lock-in** — your posts, your SQLite database, your domain
- 🔒 **Simple auth** — username/password, no external dependencies
- 📦 **Zero config** — SQLite database, no separate DB container needed

### Coming Soon
- ✍️ **AI-assisted writing** (v1.4) — inline autocomplete, auto-generated SEO
- 📊 **Built-in analytics** (v1.2) — cookieless, first-party tracking
- 🎨 **Themes** (v1.3) — customizable design system
- 📷 **Image uploads** (v1.1) — S3-compatible storage

## Quickstart

### Prerequisites
- Node.js 20+ and npm
- A hosting platform that supports Node.js (Vercel, Railway, Render, or any VPS)

### Local Development

```bash
# Clone the repository
git clone https://github.com/arttup-co/artup.git
cd artup

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your settings (see below)

# Run database migrations
npm run db:migrate

# Create admin user
npm run setup

# Start development server
npm run dev
```

Your blog will be running at `http://localhost:3000`

Default credentials (if using the `.env.example` defaults):
- Username: `admin`
- Password: `changeme`

## Tech Stack

Next.js 15 (App Router) · TypeScript · SQLite · Prisma ORM · Auth.js · Tailwind · shadcn/ui

## Deployment

Artup can be deployed to any platform that supports Node.js applications.

### Environment Configuration

Before deploying, set up your environment variables:

```bash
# Required variables
DATABASE_URL=file:./prisma/dev.db           # For production, use a persistent path
NEXTAUTH_URL=https://yourdomain.com          # Your production domain
NEXTAUTH_SECRET=your_random_secret_here      # Generate with: openssl rand -base64 32

# Admin account (for initial setup)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in Vercel project settings
4. Deploy
5. After first deployment, run migrations via Vercel CLI:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   npm run setup
   ```

### Railway/Render Deployment

1. Connect your GitHub repository
2. Add environment variables in platform settings
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run db:migrate:deploy && npm run setup && npm start`

### VPS/Cloud Deployment

```bash
# On your server
git clone https://github.com/arttup-co/artup.git
cd artup

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your production settings

# Run migrations
npm run db:migrate:deploy

# Create admin user
npm run setup

# Build and start
npm run build
npm start
```

For production VPS deployments, use a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "artup" -- start
pm2 save
pm2 startup
```

## Contributing

Contributions welcome. Check open [issues](../../issues) or start a [discussion](../../discussions) if you want to propose something bigger.

## License

MIT — see [LICENSE](./LICENSE).
