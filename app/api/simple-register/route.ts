import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Simple registration received:', body)
    
    // Basic validation
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 12)

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || 'SHIPPER',
        userType: body.userType || 'INDIVIDUAL',
        companyName: body.companyName || null,
        companyWebsite: body.companyWebsite || null,
        companyPhone: body.companyPhone || null,
        companyAddress: body.companyAddress || null,
        companyCity: body.companyCity || null,
        companyState: body.companyState || null,
        companyZipCode: body.companyZipCode || null,
        companyCountry: body.companyCountry || null,
        dotNumber: body.dotNumber || null,
        mcNumber: body.mcNumber || null,
        carrierStatus: body.carrierStatus || null,
        carrierVerified: body.carrierVerified || false,
        equipmentTypes: body.equipmentTypes || null,
        emailVerified: true // Auto-verify for simplicity
      }
    })

    console.log('User created successfully:', user.email)
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    })
    
  } catch (error) {
    console.error('Simple registration error:', error)
    return NextResponse.json({
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
