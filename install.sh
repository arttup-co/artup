#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔═══════════════════════════════════╗"
echo "║     Artup Installation Script     ║"
echo "║  One-command blog deployment      ║"
echo "╚═══════════════════════════════════╝"
echo -e "${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed.${NC}"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Prompt for configuration
echo ""
echo -e "${YELLOW}Please provide the following information:${NC}"
echo ""

read -p "Domain name (e.g., blog.example.com): " DOMAIN
while [ -z "$DOMAIN" ]; do
    echo -e "${RED}Domain is required.${NC}"
    read -p "Domain name (e.g., blog.example.com): " DOMAIN
done

read -p "Admin email address: " ADMIN_EMAIL
while [ -z "$ADMIN_EMAIL" ]; do
    echo -e "${RED}Email is required.${NC}"
    read -p "Admin email address: " ADMIN_EMAIL
done

read -sp "Admin password: " ADMIN_PASSWORD
echo ""
while [ -z "$ADMIN_PASSWORD" ]; do
    echo -e "${RED}Password is required.${NC}"
    read -sp "Admin password: " ADMIN_PASSWORD
    echo ""
done

read -sp "Confirm admin password: " ADMIN_PASSWORD_CONFIRM
echo ""
while [ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]; do
    echo -e "${RED}Passwords do not match.${NC}"
    read -sp "Admin password: " ADMIN_PASSWORD
    echo ""
    read -sp "Confirm admin password: " ADMIN_PASSWORD_CONFIRM
    echo ""
done

read -p "NextAuth secret (leave empty for auto-generated): " NEXTAUTH_SECRET
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated NextAuth secret${NC}"
fi

# Create .env file
echo ""
echo -e "${GREEN}Creating .env file...${NC}"

cat > .env <<EOF
# Database (SQLite)
DATABASE_URL=file:/data/artup.db

# Domain
DOMAIN=$DOMAIN
NEXTAUTH_URL=https://$DOMAIN

# Auth.js
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Admin (credentials for first-time setup)
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD
EOF

echo -e "${GREEN}✓ .env file created${NC}"

# Build and start containers
echo ""
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
echo "This may take a few minutes on first run..."

docker compose up -d --build

# Wait for containers to be ready
echo ""
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 5

# Create admin user
echo -e "${YELLOW}Creating admin user...${NC}"
docker compose exec -T app node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

async function createAdminUser() {
  const libsql = createClient({ url: 'file:/data/artup.db' });
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log('Admin user already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin',
      emailVerified: new Date(),
    },
  });

  console.log('Admin user created successfully');
  process.exit(0);
}

createAdminUser().catch((err) => {
  console.error('Error creating admin user:', err);
  process.exit(1);
});
"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create admin user${NC}"
    echo "You may need to create the user manually"
fi

echo ""
echo -e "${GREEN}✓ Artup is now running!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Installation Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your blog is accessible at: https://$DOMAIN"
echo "Admin email: $ADMIN_EMAIL"
echo ""
echo "Next steps:"
echo "1. Make sure your domain DNS points to this server's IP"
echo "2. Visit https://$DOMAIN to see your blog"
echo "3. Sign in at https://$DOMAIN/auth/signin with your admin credentials"
echo ""
echo "Useful commands:"
echo "  - View logs:    docker compose logs -f"
echo "  - Stop:         docker compose down"
echo "  - Restart:      docker compose restart"
echo "  - Update:       git pull && docker compose up -d --build"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
