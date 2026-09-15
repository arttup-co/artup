# CI/CD with GitHub Actions - Beginner's Guide

Hey there! Let's set up automated testing and deployment for Artup. I'll explain everything step by step like we're pair programming.

## What is CI/CD?

Think of CI/CD as your robot assistant that:
- **CI (Continuous Integration)**: Automatically checks your code every time you push changes
- **CD (Continuous Deployment)**: Automatically deploys your code to production when everything looks good

It's like having a teammate who never sleeps and always runs your tests!

## How GitHub Actions Works

GitHub Actions uses **workflows** - think of them as recipes with steps:
1. You push code to GitHub
2. GitHub sees you pushed code
3. GitHub runs your workflow (tests, build, deploy, etc.)
4. You get notified if something breaks

Workflows live in `.github/workflows/` folder in your repo.

## Step 1: Your First Workflow - Running Tests

Let's start simple. We'll create a workflow that runs tests every time you push code.

Create this file: `.github/workflows/test.yml`

```yaml
# This is the name of your workflow - you'll see it in GitHub's UI
name: Run Tests

# When should this workflow run?
on:
  push:
    branches: [ main ]  # Run when pushing to main
  pull_request:
    branches: [ main ]  # Run when someone opens a PR to main

# What jobs should we run?
jobs:
  # Job name - you can have multiple jobs
  test:
    # What operating system to use (Ubuntu Linux is common)
    runs-on: ubuntu-latest

    # The actual steps to run
    steps:
      # Step 1: Get your code from GitHub
      - name: Checkout code
        uses: actions/checkout@v4

      # Step 2: Install Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'  # Same version as in package.json
          cache: 'npm'  # Cache npm packages to speed up builds

      # Step 3: Install dependencies
      - name: Install dependencies
        run: npm ci  # Like npm install but faster for CI

      # Step 4: Generate Prisma Client
      - name: Generate Prisma Client
        run: npx prisma generate

      # Step 5: Run linting (check code quality)
      - name: Run linter
        run: npm run lint

      # Step 6: Run type checking
      - name: Type check
        run: npx tsc --noEmit

      # Step 7: Build the project
      - name: Build
        run: npm run build
```

**What does this do?**
- Runs every time you push to `main` or open a Pull Request
- Checks out your code
- Installs Node.js and dependencies
- Runs Prisma generation
- Checks your code quality (linting)
- Checks TypeScript types
- Tries to build your project

If ANY step fails, you'll get a red X on GitHub!

## Step 2: Add a Build Status Badge (Optional but Cool!)

Want a badge in your README that shows build status? Add this to the top of README.md:

```markdown
![Tests](https://github.com/arttup-co/artup/actions/workflows/test.yml/badge.svg)
```

It'll show a green checkmark ✅ or red X ❌

## Step 3: Deployment Workflow (For Production)

This is more advanced - only run this when you're ready to deploy!

Create: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

# Only run when you manually trigger it or push a tag
on:
  workflow_dispatch:  # Manual trigger from GitHub UI
  push:
    tags:
      - 'v*'  # Runs when you push a version tag like v1.0.0

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/artup
            git pull origin main
            docker compose down
            docker compose up -d --build
```

**How to use this:**
1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `SERVER_HOST`: Your server IP (e.g., 123.45.67.89)
   - `SERVER_USER`: SSH username (e.g., root or ubuntu)
   - `SSH_PRIVATE_KEY`: Your SSH private key

3. To deploy manually:
   - Go to Actions tab on GitHub
   - Click "Deploy to Production"
   - Click "Run workflow"

## Common Commands Explained

```yaml
uses: actions/checkout@v4
```
This uses a pre-built action (like installing a library). `checkout` gets your code.

```yaml
run: npm ci
```
This runs a shell command. `npm ci` is like `npm install` but faster for CI.

```yaml
with:
  node-version: '20'
```
This passes options to an action. Here we're saying "use Node.js version 20".

```yaml
${{ secrets.SERVER_HOST }}
```
This accesses secret variables you stored in GitHub Settings.

## Testing Your Workflow Locally (Optional)

You can test workflows locally with a tool called `act`:

```bash
# Install act (macOS)
brew install act

# Run your workflow locally
act push
```

This simulates GitHub Actions on your computer!

## Debugging Tips

**Workflow fails?** Check these:
1. Click on the failed workflow in the Actions tab
2. Click on the failed job
3. Click on the failed step
4. Read the error message (it's usually at the bottom)

**Common issues:**
- `npm ci` fails → Your package-lock.json is out of sync, run `npm install` locally
- Build fails → Same error you'd get running `npm run build` locally
- Permission denied → Your SSH key might be wrong

## Best Practices (From a Tech Lead)

1. **Start simple** - Just run tests first, add deployment later
2. **Test locally first** - Never push code that doesn't work on your machine
3. **Use secrets for sensitive data** - Never hardcode passwords in workflows
4. **Keep workflows fast** - Use caching, only run what's necessary
5. **Review workflow runs** - Check the Actions tab after every push

## Next Steps

Once you're comfortable:
1. Add automated testing (when we add tests to Artup)
2. Set up staging environment deployment
3. Add automatic database migrations
4. Set up notifications (Slack, Discord, etc.)

## Quick Reference

```yaml
# Run on push
on: push

# Run on PR
on: pull_request

# Run manually
on: workflow_dispatch

# Run on schedule (cron)
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

# Cache dependencies
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

---

**Remember**: GitHub Actions gives you 2,000 free minutes per month for private repos, unlimited for public repos. You're good to go!

Need help? Check the workflow runs in the Actions tab - they show detailed logs of what happened.

Happy automating! 🚀
