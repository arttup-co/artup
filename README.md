# Artup

**The open-source, AI-native blogging platform for freelancers and founders.**

Setting up a blog shouldn't take a weekend. Artup gets you writing in minutes — self-hosted, AI-assisted, with analytics that respect your readers' privacy.

[Features](#features) • [Quickstart](#quickstart) • [Tech Stack](#tech-stack) • [Self-Hosting](#self-hosting) • [Contributing](#contributing)

## Why Artup

Most blogging tools force a trade-off: easy-but-locked-in (Medium, Substack) or powerful-but-painful-to-set-up (self-hosted WordPress, Ghost with manual server config). Artup is built to remove that trade-off — one command gets you a fully working, AI-native blog on infrastructure you own.

## Features

- ✍️ **AI-assisted writing** — inline autocomplete, auto-generated titles/meta descriptions/tags, auto-summaries
- 📊 **Built-in analytics** — cookieless, first-party, no third-party trackers
- 🚀 **One-command deploy** — Docker Compose, works on any VPS/cloud provider
- 🔓 **No lock-in** — your posts, your database, your domain
- 🎨 **Themeable** — clean defaults, easy to restyle
- 🔑 **Bring your own AI key** — OpenAI, Anthropic, Google, or local models via Ollama

## Quickstart

```bash
curl -fsSL https://arttup.co/install.sh | bash
```

Answers a couple of prompts (domain, admin email) and you're live with HTTPS in a few minutes.

## Tech Stack

Next.js (App Router) · TypeScript · PostgreSQL · Drizzle ORM · Auth.js · Tailwind · Vercel AI SDK · Docker

## Self-Hosting

Full guide: [docs link — coming soon]

Also deployable on Vercel — see [deployment docs — coming soon].

## Contributing

Contributions welcome. Check open [issues](../../issues) or start a [discussion](../../discussions) if you want to propose something bigger.

## License

MIT — see [LICENSE](./LICENSE).
