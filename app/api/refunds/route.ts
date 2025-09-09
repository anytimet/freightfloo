import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentId, amount, reason, description } = await request.json()

    if (!paymentId || !amount || !reason) {
      return NextResponse.json(
        { error: 'Payment ID, amount, and reason are required' },
        { status: 400 }
      )
    }

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: { 
        id: paymentId,
        userId: (session.user as any).id,
        status: 'COMPLETED'
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
        }
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found or not eligible for refund' },
        { status: 404 }
      )
    }

    // Check if refund amount is valid
    if (amount > payment.amount) {
      return NextResponse.json(
        { error: 'Refund amount cannot exceed payment amount' },
        { status: 400 }
      )
    }

    // Check if there are existing pending refunds
    const existingRefund = await prisma.refund.findFirst({
      where: {
        paymentId,
        status: 'PENDING'
      }
    })

    if (existingRefund) {
      return NextResponse.json(
        { error: 'A refund request is already pending for this payment' },
        { status: 400 }
      )
    }

    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        amount,
        reason,
        description,
        status: 'PENDING',
        paymentId,
        requestedById: (session.user as any).id,
        metadata: JSON.stringify({
          originalPaymentAmount: payment.amount,
          refundPercentage: (amount / payment.amount) * 100
        })
      }
    })

    // Process refund with Stripe if payment intent exists
    if (payment.stripePaymentIntentId) {
      try {
        const stripeRefund = await stripe.refunds.create({
          payment_intent: payment.stripePaymentIntentId,
          amount: Math.round(amount * 100), // Convert to cents
          reason: reason === 'DISPUTE' ? 'requested_by_customer' : 'duplicate',
          metadata: {
            refundId: refund.id,
            paymentId: payment.id,
            shipmentId: payment.shipmentId
          }
        })

        // Update refund with Stripe refund ID
        await prisma.refund.update({
          where: { id: refund.id },
          data: { 
            stripeRefundId: stripeRefund.id,
            status: stripeRefund.status === 'succeeded' ? 'COMPLETED' : 'PENDING'
          }
        })

        // If refund is completed, update payment status
        if (stripeRefund.status === 'succeeded') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'REFUNDED' }
          })

          // Update shipment status
          await prisma.shipment.update({
            where: { id: payment.shipmentId },
            data: { 
              status: 'CANCELLED',
              paymentStatus: 'REFUNDED'
            }
          })

          // Create notifications
          const acceptedBid = payment.shipment.bids[0]
          if (acceptedBid) {
            // Notify shipper
            await prisma.notification.create({
              data: {
                type: 'REFUND_COMPLETED',
                title: 'Refund Completed',
                message: `Refund of $${amount} has been processed for shipment: ${payment.shipment.title}`,
                userId: payment.userId,
                shipmentId: payment.shipmentId
              }
            })

            // Notify carrier
            await prisma.notification.create({
              data: {
                type: 'SHIPMENT_CANCELLED',
                title: 'Shipment Cancelled',
                message: `Shipment "${payment.shipment.title}" has been cancelled due to refund.`,
                userId: acceptedBid.userId,
                shipmentId: payment.shipmentId
              }
            })
          }
        }
      } catch (stripeError) {
        console.error('Stripe refund error:', stripeError)
        // Keep refund as PENDING for manual review
      }
    }

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        reason: refund.reason
      }
    })

  } catch (error) {
    console.error('Create refund error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')

    let whereClause: any = {
      requestedById: (session.user as any).id
    }

    if (paymentId) {
      whereClause.paymentId = paymentId
    }

    const refunds = await prisma.refund.findMany({
      where: whereClause,
      include: {
        payment: {
          include: {
            shipment: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ refunds })

  } catch (error) {
    console.error('Get refunds error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
