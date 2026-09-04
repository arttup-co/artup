#!/usr/bin/env node

/**
 * Artup Production Server Entry Point
 *
 * This script orchestrates the Docker container startup:
 * 1. Runs database migrations
 * 2. Starts the Next.js standalone server
 * 3. Handles graceful shutdown
 */

const { spawn } = require('child_process');

// Color codes for logging
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Step 1: Run database migrations
log('=== Artup Server Startup ===', 'blue');
log('Running database migrations...', 'yellow');

const migrate = spawn('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  env: process.env,
});

migrate.on('error', (err) => {
  log(`Migration error: ${err.message}`, 'red');
  process.exit(1);
});

migrate.on('close', (code) => {
  if (code !== 0) {
    log(`Migration failed with code ${code}`, 'red');
    process.exit(1);
  }

  log('Migrations completed successfully!', 'green');
  log('Starting Next.js server...', 'yellow');

  // Step 2: Start Next.js standalone server
  // The standalone build creates a server.js in the output directory
  const nextServer = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: process.env,
  });

  nextServer.on('error', (err) => {
    log(`Server error: ${err.message}`, 'red');
    process.exit(1);
  });

  nextServer.on('close', (code) => {
    log(`Server exited with code ${code}`, code === 0 ? 'green' : 'red');
    process.exit(code || 0);
  });

  log('Next.js server started successfully!', 'green');
  log('=== Artup is running ===', 'blue');

  // Step 3: Handle graceful shutdown
  const shutdown = (signal) => {
    log(`\nReceived ${signal}, shutting down gracefully...`, 'yellow');
    nextServer.kill('SIGTERM');
    setTimeout(() => {
      nextServer.kill('SIGKILL');
      process.exit(0);
    }, 5000); // 5 second timeout
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
});
