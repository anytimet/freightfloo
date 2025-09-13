/**
 * Environment Validation System
 * Prevents dev/prod mismatches and ensures proper configuration
 */

interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  DATABASE_URL: string
  RESEND_API_KEY: string
  STRIPE_SECRET_KEY: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string
  NEXT_PUBLIC_GA_ID?: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  environment: string
}

export class EnvironmentValidator {
  private config: Partial<EnvironmentConfig>
  private environment: string

  constructor() {
    this.environment = process.env.NODE_ENV || 'development'
    this.config = {
      NODE_ENV: process.env.NODE_ENV as any,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    }
  }

  validate(): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Check required environment variables
    this.validateRequiredVariables(errors)
    
    // Check environment-specific configurations
    if (this.environment === 'production') {
      this.validateProductionConfig(errors, warnings)
    } else if (this.environment === 'development') {
      this.validateDevelopmentConfig(errors, warnings)
    }

    // Check for common mismatches
    this.validateCommonMismatches(errors, warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      environment: this.environment
    }
  }

  private validateRequiredVariables(errors: string[]): void {
    const required = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      'RESEND_API_KEY',
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ]

    for (const variable of required) {
      if (!this.config[variable as keyof EnvironmentConfig]) {
        errors.push(`Missing required environment variable: ${variable}`)
      }
    }
  }

  private validateProductionConfig(errors: string[], warnings: string[]): void {
    // Production must use HTTPS
    if (this.config.NEXTAUTH_URL && !this.config.NEXTAUTH_URL.startsWith('https://')) {
      errors.push('NEXTAUTH_URL must use HTTPS in production')
    }

    // Production must use PostgreSQL
    if (this.config.DATABASE_URL && !this.config.DATABASE_URL.startsWith('postgresql://')) {
      errors.push('DATABASE_URL must use PostgreSQL in production (not SQLite)')
    }

    // Production must use live Stripe keys
    if (this.config.STRIPE_SECRET_KEY && this.config.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
      errors.push('STRIPE_SECRET_KEY must use live keys (sk_live_) in production')
    }

    if (this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
        this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
      errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must use live keys (pk_live_) in production')
    }

    // Check for weak secrets
    if (this.config.NEXTAUTH_SECRET && this.config.NEXTAUTH_SECRET.length < 32) {
      errors.push('NEXTAUTH_SECRET must be at least 32 characters long in production')
    }

    // Check for localhost URLs in production
    if (this.config.NEXTAUTH_URL && this.config.NEXTAUTH_URL.includes('localhost')) {
      errors.push('NEXTAUTH_URL cannot contain localhost in production')
    }
  }

  private validateDevelopmentConfig(errors: string[], warnings: string[]): void {
    // Development should use test Stripe keys
    if (this.config.STRIPE_SECRET_KEY && this.config.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      warnings.push('Using live Stripe keys in development is not recommended')
    }

    if (this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
        this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')) {
      warnings.push('Using live Stripe keys in development is not recommended')
    }

    // Development should use SQLite
    if (this.config.DATABASE_URL && !this.config.DATABASE_URL.startsWith('file:')) {
      warnings.push('Using PostgreSQL in development may cause data conflicts')
    }

    // Development should use localhost
    if (this.config.NEXTAUTH_URL && !this.config.NEXTAUTH_URL.includes('localhost')) {
      warnings.push('NEXTAUTH_URL should use localhost in development')
    }
  }

  private validateCommonMismatches(errors: string[], warnings: string[]): void {
    // Check for mixed test/live keys
    const hasTestSecret = this.config.STRIPE_SECRET_KEY?.startsWith('sk_test_')
    const hasLivePublishable = this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_')
    
    if (hasTestSecret && hasLivePublishable) {
      errors.push('Mixing test secret key with live publishable key is not allowed')
    }

    const hasLiveSecret = this.config.STRIPE_SECRET_KEY?.startsWith('sk_live_')
    const hasTestPublishable = this.config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_')
    
    if (hasLiveSecret && hasTestPublishable) {
      errors.push('Mixing live secret key with test publishable key is not allowed')
    }

    // Check for placeholder values
    const placeholderValues = [
      'your-secret-key-here',
      'your-stripe-secret-key-here',
      'your-resend-api-key-here',
      'your-google-maps-api-key-here'
    ]

    for (const placeholder of placeholderValues) {
      if (Object.values(this.config).some(value => 
        typeof value === 'string' && value.includes(placeholder))) {
        errors.push(`Found placeholder value: ${placeholder}. Please replace with actual values.`)
      }
    }
  }

  getEnvironmentInfo(): { environment: string; isProduction: boolean; isDevelopment: boolean } {
    return {
      environment: this.environment,
      isProduction: this.environment === 'production',
      isDevelopment: this.environment === 'development'
    }
  }
}

// Singleton instance
export const envValidator = new EnvironmentValidator()

// Validation function for use in API routes
export function validateEnvironment(): ValidationResult {
  return envValidator.validate()
}

// Environment info getter
export function getEnvironmentInfo() {
  return envValidator.getEnvironmentInfo()
}
