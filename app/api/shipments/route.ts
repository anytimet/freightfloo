import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'ACTIVE'
    const origin = searchParams.get('origin')
    const destination = searchParams.get('destination')

    const where: any = {
      status: status as any
    }

    if (origin) {
      where.origin = {
        contains: origin
      }
    }

    if (destination) {
      where.destination = {
        contains: destination
      }
    }

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        bids: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.shipment.count({ where })

    return NextResponse.json({
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Session check:', session ? 'Session exists' : 'No session')
    
    if (!session) {
      console.log('No session found, returning 401')
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    console.log('Received shipment data:', data)
    
    const {
      title,
      description,
      origin,
      destination,
      distance,
      weight,
      dimensions,
      pickupDate,
      deliveryDate,
      pricingType,
      startingBid,
      offerPrice,
      category,
      images
    } = data

    const shipment = await prisma.shipment.create({
      data: {
        title,
        description,
        origin,
        destination,
        distance,
        weight,
        dimensions,
        pickupDate: new Date(pickupDate),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        pricingType: pricingType || 'auction',
        startingBid,
        offerPrice,
        category,
        images: images || null,
        userId: (session.user as any).id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
