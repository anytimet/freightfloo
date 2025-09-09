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

    // Send verification email
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
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
