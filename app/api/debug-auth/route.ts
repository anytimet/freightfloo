import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    console.log('Debug auth attempt for email:', email)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        step: 'user_not_found',
        message: 'User not found in database',
        email: email
      })
    }

    console.log('User found:', { id: user.id, email: user.email, name: user.name })

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    return NextResponse.json({
      success: isPasswordValid,
      step: isPasswordValid ? 'password_valid' : 'password_invalid',
      message: isPasswordValid ? 'Password is valid' : 'Password is invalid',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      passwordHashLength: user.password.length,
      passwordHashPreview: user.password.substring(0, 20) + '...'
    })

  } catch (error) {
    console.error('Debug auth error:', error)
    return NextResponse.json(
      {
        success: false,
        step: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      },
      { status: 500 }
    )
  }
}
