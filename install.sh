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

read -p "NextAuth secret (leave empty for auto-generated): " NEXTAUTH_SECRET
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated NextAuth secret${NC}"
fi

echo ""
echo -e "${YELLOW}Email configuration (for magic link authentication):${NC}"
read -p "SMTP server (e.g., smtp://user:pass@smtp.example.com:587): " EMAIL_SERVER
while [ -z "$EMAIL_SERVER" ]; do
    echo -e "${RED}Email server is required for authentication.${NC}"
    read -p "SMTP server: " EMAIL_SERVER
done

read -p "Email 'from' address (default: noreply@$DOMAIN): " EMAIL_FROM
if [ -z "$EMAIL_FROM" ]; then
    EMAIL_FROM="noreply@$DOMAIN"
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

# Email (for magic link authentication)
EMAIL_SERVER=$EMAIL_SERVER
EMAIL_FROM=$EMAIL_FROM

# Admin
ADMIN_EMAIL=$ADMIN_EMAIL
EOF

echo -e "${GREEN}✓ .env file created${NC}"

# Build and start containers
echo ""
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
echo "This may take a few minutes on first run..."

docker compose up -d --build

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
echo "3. Sign in using the magic link sent to $ADMIN_EMAIL"
echo ""
echo "Useful commands:"
echo "  - View logs:    docker compose logs -f"
echo "  - Stop:         docker compose down"
echo "  - Restart:      docker compose restart"
echo "  - Update:       git pull && docker compose up -d --build"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
