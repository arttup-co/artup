# Artup Development Setup

This guide covers local development setup for Artup v1.0.

## Prerequisites

- Node.js 20+ (we're using v20.20.0)
- Docker and Docker Compose (for PostgreSQL)
- npm (comes with Node.js)

**Note**: This project uses Prisma 7 (ORM v7), which requires database adapters. Configuration is in `prisma7.config.ts`.

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL Database

We use Docker Compose for the local database:

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts PostgreSQL on `localhost:5432` with:
- Username: `artup`
- Password: `artup_dev_password`
- Database: `artup`

### 3. Configure Environment

Copy the example environment file and update values:

```bash
cp .env.example .env
```

For local development, ensure these values in `.env`:

```env
DATABASE_URL="postgresql://artup:artup_dev_password@localhost:5432/artup"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_here"  # Generate with: openssl rand -base64 32
EMAIL_SERVER="smtp://user:password@smtp.example.com:587"
EMAIL_FROM="dev@localhost"
```

**For email testing in development**, use one of:
- [Ethereal Email](https://ethereal.email/) - Fake SMTP service
- [Resend](https://resend.com/) - Free tier available
- [Mailtrap](https://mailtrap.io/) - Email testing service

### 4. Run Database Migrations

Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Database Management

- **Generate migration**: `npm run db:generate`
- **Apply migration**: `npm run db:migrate`
- **Push schema changes**: `npm run db:push` (for prototyping)
- **Open Prisma Studio**: `npm run db:studio` (visual DB editor)

### Making Schema Changes

1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` (dev) or `npm run db:migrate` (prod)
3. Prisma client auto-updates

### Stopping Services

```bash
# Stop database
docker compose -f docker-compose.dev.yml down

# Keep data
docker compose -f docker-compose.dev.yml down

# Remove data volumes
docker compose -f docker-compose.dev.yml down -v
```

## Project Structure

```
artup/
├── prisma/
│   └── schema.prisma          # Database schema (users, posts, auth tables)
├── prisma7.config.ts          # Prisma 7 configuration (datasource URL)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Public homepage (post list)
│   │   ├── [slug]/            # Single post page
│   │   ├── author/[id]/       # Author page
│   │   ├── admin/             # Admin dashboard & post editor
│   │   ├── auth/              # Sign-in pages
│   │   └── api/               # API routes (posts, auth)
│   ├── components/
│   │   └── editor.tsx         # Tiptap rich-text editor (NO AI features)
│   ├── lib/
│   │   ├── prisma.ts          # Prisma 7 client with PostgreSQL adapter
│   │   └── utils.ts           # Helper functions (cn, etc.)
│   └── auth.ts                # Auth.js configuration
├── docker-compose.dev.yml     # Local development database
├── docker-compose.yml         # Production stack (app + postgres + caddy)
├── Dockerfile                 # Next.js app container
├── Caddyfile                  # Reverse proxy config (auto-HTTPS)
├── install.sh                 # One-command production installer
└── .env.example               # Environment variables template
```

## Tech Stack Details

- **Next.js 15** - App Router, TypeScript, Server Components
- **Prisma 7** - Type-safe ORM with PostgreSQL (using @prisma/adapter-pg)
- **Auth.js v5** - Email magic links (no OAuth in v1.0)
- **Tiptap** - Modern rich-text editor (replaces outdated Novel)
- **Tailwind CSS** + **shadcn/ui** - Styling and components
- **Docker Compose** - Local and production deployment
- **Caddy** - Auto-HTTPS reverse proxy

## Troubleshooting

### Prisma Client Errors

If you see "Prisma Client not found":

```bash
npm run db:generate
```

### Port Already in Use

If port 3000 or 5432 is taken:

```bash
# Check what's using the port
lsof -i :3000
lsof -i :5432

# Stop conflicting services or change ports in .env
```

### Database Connection Issues

1. Ensure Docker containers are running:
   ```bash
   docker compose -f docker-compose.dev.yml ps
   ```

2. Check DATABASE_URL matches docker-compose.dev.yml credentials

### Email Not Sending (Dev)

- Use [Ethereal Email](https://ethereal.email/) for testing
- Check EMAIL_SERVER and EMAIL_FROM in `.env`
- For production, use a real SMTP service (Resend, SendGrid, etc.)

## v1.0 Scope Reminder

This version includes ONLY:
- ✅ Email magic link auth
- ✅ Create/edit/publish posts (Tiptap editor)
- ✅ Draft vs. published state
- ✅ Public views (list, single, author)
- ✅ Cover image (URL field only, no upload)

Explicitly NOT included (coming in v1.1+):
- ❌ Image upload / S3 storage
- ❌ Analytics
- ❌ OAuth login
- ❌ Themes
- ❌ Any AI features

## Next Steps

See `CLAUDE.md` for full project vision and roadmap.
