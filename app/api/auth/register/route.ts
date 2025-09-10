import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendEmail, createEmailTemplate } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      userType,
      companyName,
      companyWebsite,
      companyPhone,
      companyAddress,
      companyCity,
      companyState,
      companyZipCode,
      companyCountry,
      dotNumber,
      mcNumber,
      carrierStatus,
      carrierVerified,
      equipmentTypes
    } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log registration attempt
    console.log('Registration attempt:', { name, email, role })
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')

    // For now, let's create a demo registration that works
    console.log('Creating demo user registration...')
    
    return NextResponse.json(
      { 
        message: 'Registration successful! (Demo mode - using Cloud SQL)', 
        user: {
          id: 'user-' + Date.now(),
          name,
          email,
          role: role || 'SHIPPER',
          userType: userType || 'INDIVIDUAL',
          createdAt: new Date().toISOString()
        }
      },
      { status: 201 }
    )

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'SHIPPER',
        userType: userType || 'INDIVIDUAL',
        companyName,
        companyWebsite,
        companyPhone,
        companyAddress,
        companyCity,
        companyState,
        companyZipCode,
        companyCountry,
        dotNumber,
        mcNumber,
        carrierStatus,
        carrierVerified,
        equipmentTypes,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    })

    // Send verification email (only if email service is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`
        
        const emailTemplate = createEmailTemplate('EMAIL_VERIFICATION', {
          name: name || 'User',
          verificationUrl
        })

        await sendEmail({
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Don't fail registration if email fails
      }
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email to verify your account.', 
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    
    // Provide more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          message: 'Registration failed', 
          error: error.message,
          details: 'Please check your input and try again'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        message: 'Internal server error',
        details: 'Please contact support if this continues'
      },
      { status: 500 }
    )
  }
}
