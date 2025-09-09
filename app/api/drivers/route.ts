import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = (session.user as any).id

    const whereClause: any = {
      carrierId: userId
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    const drivers = await prisma.driver.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(drivers)
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const userId = (session.user as any).id

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'licenseNumber', 'licenseClass', 'licenseExpiry', 'medicalCardExpiry']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check for duplicate email or license number
    const existingDriver = await prisma.driver.findFirst({
      where: {
        OR: [
          { email: body.email },
          { licenseNumber: body.licenseNumber }
        ]
      }
    })

    if (existingDriver) {
      return NextResponse.json(
        { error: 'Driver with this email or license number already exists' },
        { status: 400 }
      )
    }

    const driver = await prisma.driver.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        licenseNumber: body.licenseNumber,
        licenseClass: body.licenseClass,
        licenseExpiry: new Date(body.licenseExpiry),
        medicalCardExpiry: new Date(body.medicalCardExpiry),
        twicCardExpiry: body.twicCardExpiry ? new Date(body.twicCardExpiry) : null,
        hazmatEndorsement: body.hazmatEndorsement || false,
        tankerEndorsement: body.tankerEndorsement || false,
        doublesTriplesEndorsement: body.doublesTriplesEndorsement || false,
        passengerEndorsement: body.passengerEndorsement || false,
        schoolBusEndorsement: body.schoolBusEndorsement || false,
        status: body.status || 'AVAILABLE',
        currentLocation: body.currentLocation || null,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        hoursOfService: parseInt(body.hoursOfService) || 0,
        maxHoursOfService: parseInt(body.maxHoursOfService) || 70,
        carrierId: userId
      }
    })

    return NextResponse.json(driver, { status: 201 })
  } catch (error) {
    console.error('Error creating driver:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
