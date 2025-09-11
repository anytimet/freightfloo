import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, createEmailTemplate } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Password reset request for email:', email)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('User not found for email:', email)
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent password reset instructions.'
      })
    }

    console.log('User found, generating reset token for:', user.email)

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Create password reset token record
    try {
      await prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.id,
          expires: resetExpires
        }
      })
    } catch (dbError) {
      console.error('Database error creating reset token:', dbError)
      // Fallback: store token in user record if PasswordResetToken table doesn't exist
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires
        }
      })
    }

    console.log('Password reset token created:', resetToken)

    // Send password reset email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`
    
    const emailTemplate = createEmailTemplate('PASSWORD_RESET', {
      name: user.name || 'User',
      resetUrl
    })

    const emailResult = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    })

    // If email service is not configured, still return success but log the issue
    if (!emailResult.success) {
      console.log('Email service not available, but password reset token created:', resetToken)
      console.log('Reset URL for manual use:', resetUrl)
    } else {
      console.log('Password reset email sent successfully to:', email)
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we have sent password reset instructions.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
