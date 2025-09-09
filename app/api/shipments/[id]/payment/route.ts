import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, createEmailTemplate } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the shipment and check if the user owns it
    const shipment = await prisma.shipment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        bids: {
          where: { status: 'ACCEPTED' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!shipment) {
      return NextResponse.json(
        { message: 'Shipment not found' },
        { status: 404 }
      )
    }

    // Check if the user owns the shipment
    if (shipment.userId !== (session.user as any)?.id) {
      return NextResponse.json(
        { message: 'You can only process payments for your own shipments' },
        { status: 403 }
      )
    }

    // Check if shipment is in PENDING status with PENDING payment
    if (shipment.status !== 'PENDING' || shipment.paymentStatus !== 'PENDING') {
      return NextResponse.json(
        { message: 'Shipment is not in pending payment status' },
        { status: 400 }
      )
    }

    // Check if there's an accepted bid
    if (shipment.bids.length === 0) {
      return NextResponse.json(
        { message: 'No accepted bid found for this shipment' },
        { status: 400 }
      )
    }

    const acceptedBid = shipment.bids[0]

    // Update shipment status to ASSIGNED and payment to COMPLETED
    const updatedShipment = await prisma.shipment.update({
      where: { id: params.id },
      data: {
        status: 'ASSIGNED',
        paymentStatus: 'COMPLETED'
      }
    })

    // Send notification to carrier about shipment assignment
    await prisma.notification.create({
      data: {
        type: 'SHIPMENT_ASSIGNED',
        title: 'Shipment Assigned!',
        message: `Payment completed! Your shipment "${shipment.title}" has been assigned to you. Please contact the shipper to arrange pickup.`,
        userId: acceptedBid.user.id,
        shipmentId: shipment.id,
        bidId: acceptedBid.id
      }
    })

    // Send notification to shipper about payment completion
    await prisma.notification.create({
      data: {
        type: 'PAYMENT_COMPLETED',
        title: 'Payment Completed',
        message: `Payment has been processed for shipment "${shipment.title}". The carrier has been notified and will contact you soon.`,
        userId: shipment.userId,
        shipmentId: shipment.id,
        bidId: acceptedBid.id
      }
    })

    // Send email notifications
    const shipmentUrl = `${process.env.NEXTAUTH_URL}/shipment/${shipment.id}`
    
    // Email to carrier about shipment assignment
    if (acceptedBid.user.email) {
      const carrierEmailTemplate = createEmailTemplate('SHIPMENT_ASSIGNED', {
        shipmentTitle: shipment.title,
        bidAmount: acceptedBid.amount,
        origin: shipment.origin,
        destination: shipment.destination,
        pickupDate: new Date(shipment.pickupDate).toLocaleDateString(),
        shipmentUrl
      })
      
      await sendEmail({
        to: acceptedBid.user.email,
        subject: carrierEmailTemplate.subject,
        html: carrierEmailTemplate.html
      })
    }

    // Email to shipper about payment completion
    if (shipment.user.email) {
      const shipperEmailTemplate = createEmailTemplate('PAYMENT_COMPLETED', {
        shipmentTitle: shipment.title,
        bidAmount: acceptedBid.amount,
        carrierName: acceptedBid.user.name || 'Anonymous',
        shipmentUrl
      })
      
      await sendEmail({
        to: shipment.user.email,
        subject: shipperEmailTemplate.subject,
        html: shipperEmailTemplate.html
      })
    }

    return NextResponse.json({
      message: 'Payment processed successfully',
      shipment: updatedShipment
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
