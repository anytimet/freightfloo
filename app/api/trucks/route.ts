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
      ownerId: userId
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    const trucks = await prisma.truck.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(trucks)
  } catch (error) {
    console.error('Error fetching trucks:', error)
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
    const requiredFields = ['make', 'model', 'year', 'vin', 'licensePlate', 'truckType', 'capacity', 'maxWeight', 'fuelType']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check for duplicate VIN or license plate
    const existingTruck = await prisma.truck.findFirst({
      where: {
        OR: [
          { vin: body.vin },
          { licensePlate: body.licensePlate }
        ]
      }
    })

    if (existingTruck) {
      return NextResponse.json(
        { error: 'Truck with this VIN or license plate already exists' },
        { status: 400 }
      )
    }

    const truck = await prisma.truck.create({
      data: {
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        vin: body.vin,
        licensePlate: body.licensePlate,
        truckType: body.truckType,
        capacity: parseFloat(body.capacity),
        maxWeight: parseFloat(body.maxWeight),
        length: body.length ? parseFloat(body.length) : null,
        width: body.width ? parseFloat(body.width) : null,
        height: body.height ? parseFloat(body.height) : null,
        fuelType: body.fuelType,
        status: body.status || 'AVAILABLE',
        location: body.location || null,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        lastMaintenance: body.lastMaintenance ? new Date(body.lastMaintenance) : null,
        nextMaintenance: body.nextMaintenance ? new Date(body.nextMaintenance) : null,
        mileage: parseInt(body.mileage) || 0,
        insuranceExpiry: body.insuranceExpiry ? new Date(body.insuranceExpiry) : null,
        registrationExpiry: body.registrationExpiry ? new Date(body.registrationExpiry) : null,
        ownerId: userId
      }
    })

    return NextResponse.json(truck, { status: 201 })
  } catch (error) {
    console.error('Error creating truck:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
