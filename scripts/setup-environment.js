#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps set up the correct environment configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  log(`\n${colors.bold}🚀 FreightFloo Environment Setup${colors.reset}`);
  log('This script will help you set up your environment configuration.\n');

  // Check if .env.local already exists
  if (fs.existsSync('.env.local')) {
    const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  // Ask for environment type
  const envType = await question('Which environment are you setting up? (development/production): ');
  
  if (envType.toLowerCase() !== 'development' && envType.toLowerCase() !== 'production') {
    logError('Invalid environment type. Please choose development or production.');
    rl.close();
    return;
  }

  log(`\nSetting up ${envType} environment...\n`);

  // Get environment variables
  const config = {};

  if (envType.toLowerCase() === 'development') {
    config.NODE_ENV = 'development';
    config.NEXTAUTH_URL = 'http://localhost:3000';
    config.DATABASE_URL = 'file:./dev.db';
    
    logInfo('Development environment configuration:');
    log('- Using SQLite database');
    log('- Using localhost URLs');
    log('- Using test API keys\n');
  } else {
    config.NODE_ENV = 'production';
    
    const domain = await question('Production domain (e.g., https://yourdomain.com): ');
    config.NEXTAUTH_URL = domain;
    
    const dbUrl = await question('PostgreSQL database URL: ');
    config.DATABASE_URL = dbUrl;
    
    logInfo('Production environment configuration:');
    log('- Using PostgreSQL database');
    log('- Using HTTPS URLs');
    log('- Using live API keys\n');
  }

  // Get API keys
  config.NEXTAUTH_SECRET = await question('NextAuth secret (32+ characters): ');
  config.RESEND_API_KEY = await question('Resend API key: ');
  
  if (envType.toLowerCase() === 'development') {
    config.STRIPE_SECRET_KEY = await question('Stripe test secret key (sk_test_...): ');
    config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = await question('Stripe test publishable key (pk_test_...): ');
    config.STRIPE_WEBHOOK_SECRET = await question('Stripe test webhook secret (whsec_...): ');
  } else {
    config.STRIPE_SECRET_KEY = await question('Stripe live secret key (sk_live_...): ');
    config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = await question('Stripe live publishable key (pk_live_...): ');
    config.STRIPE_WEBHOOK_SECRET = await question('Stripe production webhook secret (whsec_...): ');
  }

  const mapsKey = await question('Google Maps API key (optional): ');
  if (mapsKey) {
    config.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = mapsKey;
  }

  const gaId = await question('Google Analytics ID (optional): ');
  if (gaId) {
    config.NEXT_PUBLIC_GA_ID = gaId;
  }

  // Generate .env.local content
  let envContent = `# FreightFloo ${envType} Environment Configuration
# Generated on ${new Date().toISOString()}

# Core Application Settings
NODE_ENV=${config.NODE_ENV}
NEXTAUTH_URL=${config.NEXTAUTH_URL}
NEXTAUTH_SECRET=${config.NEXTAUTH_SECRET}

# Database Configuration
DATABASE_URL="${config.DATABASE_URL}"

# Email Service
RESEND_API_KEY=${config.RESEND_API_KEY}

# Stripe Payment System
STRIPE_SECRET_KEY=${config.STRIPE_SECRET_KEY}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
STRIPE_WEBHOOK_SECRET=${config.STRIPE_WEBHOOK_SECRET}
`;

  if (config.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    envContent += `\n# Google Services\nNEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${config.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}\n`;
  }

  if (config.NEXT_PUBLIC_GA_ID) {
    envContent += `NEXT_PUBLIC_GA_ID=${config.NEXT_PUBLIC_GA_ID}\n`;
  }

  // Write .env.local file
  try {
    fs.writeFileSync('.env.local', envContent);
    logSuccess(`✅ .env.local created successfully!`);
  } catch (error) {
    logError(`Failed to create .env.local: ${error.message}`);
    rl.close();
    return;
  }

  // Validate the configuration
  log('\n🔍 Validating configuration...');
  
  // Set environment variables for validation
  Object.entries(config).forEach(([key, value]) => {
    if (value) process.env[key] = value;
  });

  // Run validation
  try {
    const { spawn } = require('child_process');
    const validation = spawn('node', ['scripts/validate-environment.js'], { stdio: 'inherit' });
    
    validation.on('close', (code) => {
      if (code === 0) {
        logSuccess('\n🎉 Environment setup completed successfully!');
        log('\nNext steps:');
        log('1. Start development server: npm run dev');
        log('2. Test the application');
        log('3. When ready for production, run: ./scripts/deploy-production.sh');
      } else {
        logError('\n❌ Environment validation failed. Please check your configuration.');
      }
      rl.close();
    });
  } catch (error) {
    logWarning('Could not run validation automatically. Please run: node scripts/validate-environment.js');
    rl.close();
  }
}

// Run setup
setupEnvironment().catch(error => {
  logError(`Setup failed: ${error.message}`);
  rl.close();
});
