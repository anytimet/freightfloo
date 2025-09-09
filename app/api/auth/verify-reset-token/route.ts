import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      )
    }

    // Find valid reset token
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

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Token is valid',
      user: {
        id: resetToken.user.id,
        email: resetToken.user.email
      }
    })
  } catch (error) {
    console.error('Verify reset token error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
