import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateEnvironment, getEnvironmentInfo } from '@/lib/env-validation'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Validate environment configuration
    const envValidation = validateEnvironment()
    const envInfo = getEnvironmentInfo()
    
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`
    
    // Check optional services
    const optionalServices = {
      stripe: !!process.env.STRIPE_SECRET_KEY,
      email: !!process.env.RESEND_API_KEY,
      maps: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    }
    
    // If environment validation fails, return unhealthy
    if (!envValidation.isValid) {
      return NextResponse.json({
        status: 'unhealthy',
        message: 'Environment configuration errors',
        environment: envInfo.environment,
        errors: envValidation.errors,
        warnings: envValidation.warnings,
        database: 'connected'
      }, { status: 503 })
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: envInfo.environment,
      isProduction: envInfo.isProduction,
      isDevelopment: envInfo.isDevelopment,
      services: optionalServices,
      database: 'connected',
      warnings: envValidation.warnings.length > 0 ? envValidation.warnings : undefined
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV || 'development'
    }, { status: 503 })
  }
}