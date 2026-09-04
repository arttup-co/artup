/**
 * Artup Database Seed Script
 *
 * Creates the initial admin user from ADMIN_EMAIL and ADMIN_PASSWORD environment variables.
 * This script is idempotent - safe to run multiple times, will not create duplicates.
 *
 * Usage:
 *   npm run db:seed
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import type { Config } from '@libsql/client';
import bcrypt from 'bcryptjs';

async function main() {
  // Get DATABASE_URL from environment (defaults to local dev path)
  const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';

  // Initialize Prisma with LibSQL adapter (matching src/lib/prisma.ts pattern)
  const config: Config = {
    url: databaseUrl,
  };
  const adapter = new PrismaLibSql(config);
  const prisma = new PrismaClient({ adapter });

  const email = process.env.ADMIN_EMAIL || 'admin@artup.local';
  const password = process.env.ADMIN_PASSWORD || 'admin';

  console.log('🌱 Seeding database...');
  console.log(`📧 Admin email: ${email}`);

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('✓ Admin user already exists, skipping creation');
    await prisma.$disconnect();
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin',
      emailVerified: new Date(), // Mark as verified for immediate login
    },
  });

  console.log('✓ Admin user created successfully');
  console.log('');
  console.log('You can now sign in with:');
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);

  await prisma.$disconnect();
}

main()
  .catch((err) => {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  });
