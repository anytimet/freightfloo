import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Find valid reset token - try PasswordResetToken table first, then fallback to user record
    let user = null
    let resetTokenId = null

    try {
      const resetToken = await prisma.passwordResetToken.findFirst({
        where: {
          token,
          expires: {
            gt: new Date()
          }
        },
        include: {
          user: true
        }
      })

      if (resetToken) {
        user = resetToken.user
        resetTokenId = resetToken.id
      }
    } catch (dbError) {
      console.log('PasswordResetToken table not found, trying user record fallback')
    }

    // Fallback: check user record for reset token
    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            gt: new Date()
          }
        }
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Token expired or invalid' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and clean up reset token
    if (resetTokenId) {
      // Use PasswordResetToken table
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword
          }
        }),
        prisma.passwordResetToken.delete({
          where: { id: resetTokenId }
        })
      ])
    } else {
      // Use user record fallback
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null
        }
      })
    }

    return NextResponse.json({
      message: 'Password reset successfully!'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
