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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent password reset instructions.'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Create password reset token record
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expires: resetExpires
      }
    })

    // Send password reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    
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
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we have sent password reset instructions.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
