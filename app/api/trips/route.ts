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

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        truck: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            licensePlate: true
          }
        },
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            licenseNumber: true
          }
        },
        shipment: {
          select: {
            id: true,
            title: true,
            origin: true,
            destination: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
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
    const requiredFields = ['tripNumber', 'startLocation', 'endLocation', 'plannedStartTime', 'plannedEndTime', 'truckId', 'driverId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if truck and driver belong to the carrier
    const truck = await prisma.truck.findFirst({
      where: {
        id: body.truckId,
        ownerId: userId
      }
    })

    if (!truck) {
      return NextResponse.json(
        { error: 'Truck not found or does not belong to you' },
        { status: 400 }
      )
    }

    const driver = await prisma.driver.findFirst({
      where: {
        id: body.driverId,
        carrierId: userId
      }
    })

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found or does not belong to you' },
        { status: 400 }
      )
    }

    // Check for duplicate trip number
    const existingTrip = await prisma.trip.findFirst({
      where: {
        tripNumber: body.tripNumber
      }
    })

    if (existingTrip) {
      return NextResponse.json(
        { error: 'Trip with this number already exists' },
        { status: 400 }
      )
    }

    const trip = await prisma.trip.create({
      data: {
        tripNumber: body.tripNumber,
        status: body.status || 'PLANNED',
        startLocation: body.startLocation,
        endLocation: body.endLocation,
        startLatitude: body.startLatitude ? parseFloat(body.startLatitude) : null,
        startLongitude: body.startLongitude ? parseFloat(body.startLongitude) : null,
        endLatitude: body.endLatitude ? parseFloat(body.endLatitude) : null,
        endLongitude: body.endLongitude ? parseFloat(body.endLongitude) : null,
        distance: body.distance ? parseFloat(body.distance) : null,
        estimatedDuration: body.estimatedDuration ? parseInt(body.estimatedDuration) : null,
        plannedStartTime: new Date(body.plannedStartTime),
        plannedEndTime: new Date(body.plannedEndTime),
        actualStartTime: body.actualStartTime ? new Date(body.actualStartTime) : null,
        actualEndTime: body.actualEndTime ? new Date(body.actualEndTime) : null,
        fuelCost: body.fuelCost ? parseFloat(body.fuelCost) : null,
        tollCost: body.tollCost ? parseFloat(body.tollCost) : null,
        otherExpenses: body.otherExpenses ? parseFloat(body.otherExpenses) : null,
        totalCost: body.totalCost ? parseFloat(body.totalCost) : null,
        notes: body.notes || null,
        carrierId: userId,
        truckId: body.truckId,
        driverId: body.driverId,
        shipmentId: body.shipmentId || null
      }
    })

    return NextResponse.json(trip, { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
