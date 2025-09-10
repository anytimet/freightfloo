import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
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
      },
      nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set',
      nextAuthSecretPrefix: process.env.NEXTAUTH_SECRET ? 
        process.env.NEXTAUTH_SECRET.substring(0, 10) + '...' : 'Not set'
    }

    return NextResponse.json(healthCheck)
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
