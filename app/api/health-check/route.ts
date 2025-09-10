import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.user.count()
    
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasStripeWebhook: !!process.env.STRIPE_WEBHOOK_SECRET,
        hasGoogleMapsKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
      nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set',
      nextAuthSecretPrefix: process.env.NEXTAUTH_SECRET ? 
        process.env.NEXTAUTH_SECRET.substring(0, 10) + '...' : 'Not set',
      databaseUrlPrefix: process.env.DATABASE_URL ? 
        process.env.DATABASE_URL.substring(0, 20) + '...' : 'Not set'
    }

    return NextResponse.json(healthCheck)
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasStripeWebhook: !!process.env.STRIPE_WEBHOOK_SECRET,
        hasGoogleMapsKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      }
    }, { status: 500 })
  }
}
