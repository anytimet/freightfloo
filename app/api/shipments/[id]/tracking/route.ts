import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const shipmentId = params.id

    // Get shipment with all related data
    const shipment = await prisma.shipment.findFirst({
      where: {
        id: shipmentId,
        OR: [
          { userId: (session.user as any).id }, // Shipper
          { 
            bids: {
              some: {
                userId: (session.user as any).id,
                status: 'ACCEPTED'
              }
            }
          } // Carrier with accepted bid
        ]
      },
      include: {
        user: true,
        bids: {
          where: { status: 'ACCEPTED' },
          include: { user: true }
        }
      }
    })

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found or access denied' },
        { status: 404 }
      )
    }

    // Get accepted bid (carrier info)
    const acceptedBid = shipment.bids[0]
    const carrier = acceptedBid?.user

    // Build tracking events based on status and timestamps
    const trackingEvents = []

    // Always show the initial status
    trackingEvents.push({
      id: '1',
      status: 'PENDING',
      location: shipment.origin,
      timestamp: shipment.createdAt.toISOString(),
      description: 'Shipment created and ready for pickup'
    })

    // Add events based on actual timestamps
    if (shipment.pickupTime) {
      trackingEvents.push({
        id: '2',
        status: 'PICKED_UP',
        location: shipment.origin,
        timestamp: shipment.pickupTime.toISOString(),
        description: 'Package picked up from origin'
      })
    }

    if (shipment.transitTime) {
      trackingEvents.push({
        id: '3',
        status: 'IN_TRANSIT',
        location: 'In Transit',
        timestamp: shipment.transitTime.toISOString(),
        description: 'Package in transit to destination'
      })
    }

    if (shipment.deliveryTime) {
      trackingEvents.push({
        id: '4',
        status: 'DELIVERED',
        location: shipment.destination,
        timestamp: shipment.deliveryTime.toISOString(),
        description: 'Package delivered to destination'
      })
    }

    if (shipment.completionTime) {
      trackingEvents.push({
        id: '5',
        status: 'COMPLETED',
        location: shipment.destination,
        timestamp: shipment.completionTime.toISOString(),
        description: 'Shipment completed and proof of delivery received'
      })
    }

    // Calculate estimated delivery if not delivered yet
    let estimatedDelivery = shipment.deliveryDate?.toISOString()
    if (!estimatedDelivery && shipment.pickupTime) {
      // Estimate 3-5 days for delivery based on pickup time
      const estimatedDate = new Date(shipment.pickupTime)
      estimatedDate.setDate(estimatedDate.getDate() + 4) // 4 days average
      estimatedDelivery = estimatedDate.toISOString()
    }

    // Build response
    const trackingData = {
      id: shipment.id,
      title: shipment.title,
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.currentStatus,
      estimatedDelivery,
      carrier: carrier ? {
        name: carrier.name,
        companyName: carrier.companyName,
        phone: carrier.companyPhone,
        email: carrier.email
      } : null,
      cargo: {
        description: shipment.description || 'Freight shipment',
        weight: shipment.weight ? `${shipment.weight} lbs` : 'Not specified',
        dimensions: shipment.dimensions || 'Not specified'
      },
      trackingEvents,
      podReceived: shipment.podReceived,
      podImage: shipment.podImage,
      podNotes: shipment.podNotes
    }

    return NextResponse.json(trackingData)
  } catch (error) {
    console.error('Tracking API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    )
  }
}
