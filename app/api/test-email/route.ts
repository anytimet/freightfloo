import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    // Test email sending
    const result = await sendEmail({
      to: 'test@example.com', // This will fail but we'll see the error
      subject: 'Test Email',
      html: '<p>This is a test email</p>'
    })

    return NextResponse.json({
      success: true,
      result,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'Not set'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'Not set'
    }, { status: 500 })
  }
}
