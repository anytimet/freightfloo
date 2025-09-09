import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, createEmailTemplate } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentId } = await request.json()

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: { 
        id: paymentId,
        userId: (session.user as any).id
      },
      include: {
        shipment: {
          include: {
            user: true,
            bids: {
              where: { status: 'ACCEPTED' },
              include: { user: true }
            }
          }
        },
        user: true
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    if (payment.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 400 }
      )
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED'
      }
    })

    // Update shipment status
    await prisma.shipment.update({
      where: { id: payment.shipmentId },
      data: {
        status: 'ASSIGNED',
        paymentStatus: 'COMPLETED'
      }
    })

    // Create notifications
    const acceptedBid = payment.shipment.bids[0]
    if (acceptedBid) {
      // Notify shipper
      await prisma.notification.create({
        data: {
          type: 'PAYMENT_COMPLETED',
          title: 'Payment Completed',
          message: `Payment of $${payment.amount} has been completed for shipment: ${payment.shipment.title}`,
          userId: payment.userId,
          shipmentId: payment.shipmentId,
          bidId: acceptedBid.id
        }
      })

      // Notify carrier
      await prisma.notification.create({
        data: {
          type: 'SHIPMENT_ASSIGNED',
          title: 'Shipment Assigned',
          message: `Payment completed! Shipment "${payment.shipment.title}" has been assigned to you.`,
          userId: acceptedBid.userId,
          shipmentId: payment.shipmentId,
          bidId: acceptedBid.id
        }
      })

      // Send email notifications
      const shipmentUrl = `${process.env.NEXTAUTH_URL}/shipment/${payment.shipmentId}`
      
      // Email to shipper
      const shipperEmailTemplate = createEmailTemplate('PAYMENT_COMPLETED', {
        shipmentTitle: payment.shipment.title,
        bidAmount: payment.amount,
        carrierName: acceptedBid.user.name || 'Carrier'
      })
      
      await sendEmail({
        to: payment.user.email!,
        subject: shipperEmailTemplate.subject,
        html: shipperEmailTemplate.html
      })

      // Email to carrier
      const carrierEmailTemplate = createEmailTemplate('SHIPMENT_ASSIGNED', {
        shipmentTitle: payment.shipment.title,
        bidAmount: payment.amount,
        origin: payment.shipment.origin,
        destination: payment.shipment.destination,
        pickupDate: payment.shipment.pickupDate.toLocaleDateString(),
        shipmentUrl
      })
      
      await sendEmail({
        to: acceptedBid.user.email!,
        subject: carrierEmailTemplate.subject,
        html: carrierEmailTemplate.html
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment completed successfully',
      shipment: {
        id: payment.shipmentId,
        status: 'ASSIGNED',
        paymentStatus: 'COMPLETED'
      }
    })

  } catch (error) {
    console.error('Complete payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
