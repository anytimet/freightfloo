import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    // Test with a simple email
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email from FreightFloo',
      html: '<p>This is a test email to check if the email service is working.</p>'
    })

    return NextResponse.json({
      success: true,
      result,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY ? 
        process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'Not set',
      message: 'Email test completed. Check the result field for details.'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY ? 
        process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'Not set'
    }, { status: 500 })
  }
}
