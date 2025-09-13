#!/usr/bin/env node

/**
 * Environment Validation Script
 * Run this before deployment to catch configuration issues
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists
if (fs.existsSync('.env.local')) {
  require('dotenv').config({ path: '.env.local' });
} else if (fs.existsSync('.env')) {
  require('dotenv').config({ path: '.env' });
}

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

class EnvironmentValidator {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.errors = [];
    this.warnings = [];
  }

  validate() {
    log(`\n${colors.bold}🔍 Validating Environment Configuration${colors.reset}`);
    log(`Environment: ${this.environment}\n`);

    this.checkRequiredVariables();
    this.checkEnvironmentSpecific();
    this.checkCommonMismatches();
    this.checkFileStructure();

    this.printResults();
    return this.errors.length === 0;
  }

  checkRequiredVariables() {
    logInfo('Checking required environment variables...');
    
    const required = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      'RESEND_API_KEY',
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ];

    for (const variable of required) {
      if (!process.env[variable]) {
        this.errors.push(`Missing required environment variable: ${variable}`);
      }
    }
  }

  checkEnvironmentSpecific() {
    if (this.environment === 'production') {
      this.checkProductionConfig();
    } else if (this.environment === 'development') {
      this.checkDevelopmentConfig();
    }
  }

  checkProductionConfig() {
    logInfo('Checking production-specific configuration...');

    // Production must use HTTPS
    if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith('https://')) {
      this.errors.push('NEXTAUTH_URL must use HTTPS in production');
    }

    // Production must use PostgreSQL
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
      this.errors.push('DATABASE_URL must use PostgreSQL in production (not SQLite)');
    }

    // Production must use live Stripe keys
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
      this.errors.push('STRIPE_SECRET_KEY must use live keys (sk_live_) in production');
    }

    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
      this.errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must use live keys (pk_live_) in production');
    }

    // Check for weak secrets
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
      this.errors.push('NEXTAUTH_SECRET must be at least 32 characters long in production');
    }

    // Check for localhost URLs in production
    if (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.includes('localhost')) {
      this.errors.push('NEXTAUTH_URL cannot contain localhost in production');
    }
  }

  checkDevelopmentConfig() {
    logInfo('Checking development-specific configuration...');

    // Development should use test Stripe keys
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      this.warnings.push('Using live Stripe keys in development is not recommended');
    }

    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')) {
      this.warnings.push('Using live Stripe keys in development is not recommended');
    }

    // Development should use SQLite
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
      this.warnings.push('Using PostgreSQL in development may cause data conflicts');
    }

    // Development should use localhost
    if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('localhost')) {
      this.warnings.push('NEXTAUTH_URL should use localhost in development');
    }
  }

  checkCommonMismatches() {
    logInfo('Checking for common configuration mismatches...');

    // Check for mixed test/live keys
    const hasTestSecret = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');
    const hasLivePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_');
    
    if (hasTestSecret && hasLivePublishable) {
      this.errors.push('Mixing test secret key with live publishable key is not allowed');
    }

    const hasLiveSecret = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_');
    const hasTestPublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_');
    
    if (hasLiveSecret && hasTestPublishable) {
      this.errors.push('Mixing live secret key with test publishable key is not allowed');
    }

    // Check for placeholder values
    const placeholderValues = [
      'your-secret-key-here',
      'your-stripe-secret-key-here',
      'your-resend-api-key-here',
      'your-google-maps-api-key-here'
    ];

    for (const placeholder of placeholderValues) {
      const envValues = Object.values(process.env);
      if (envValues.some(value => typeof value === 'string' && value.includes(placeholder))) {
        this.errors.push(`Found placeholder value: ${placeholder}. Please replace with actual values.`);
      }
    }
  }

  checkFileStructure() {
    logInfo('Checking file structure...');

    // Check for .env.local file
    if (!fs.existsSync('.env.local')) {
      this.warnings.push('No .env.local file found. Make sure to create one from the example files.');
    }

    // Check for .gitignore
    if (fs.existsSync('.gitignore')) {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      if (!gitignore.includes('.env.local')) {
        this.warnings.push('.env.local should be in .gitignore to prevent committing secrets');
      }
    }
  }

  printResults() {
    log('\n' + '='.repeat(50));
    
    if (this.errors.length === 0) {
      logSuccess('Environment validation passed!');
    } else {
      logError('Environment validation failed!');
    }

    if (this.errors.length > 0) {
      log('\n❌ Errors:');
      this.errors.forEach(error => logError(`  ${error}`));
    }

    if (this.warnings.length > 0) {
      log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => logWarning(`  ${warning}`));
    }

    log('\n' + '='.repeat(50));

    if (this.errors.length > 0) {
      log('\n💡 Next steps:');
      log('1. Fix the errors above');
      log('2. Run this script again to verify');
      log('3. Only deploy when validation passes');
      process.exit(1);
    } else if (this.warnings.length > 0) {
      log('\n💡 Consider addressing the warnings above for better configuration');
    } else {
      log('\n🎉 Ready for deployment!');
    }
  }
}

// Run validation
const validator = new EnvironmentValidator();
const isValid = validator.validate();

if (!isValid) {
  process.exit(1);
}
