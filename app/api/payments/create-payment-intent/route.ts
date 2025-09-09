import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripeClient, formatAmountForStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { validatePaymentSecurity, checkRateLimit, logSuspiciousActivity } from '@/lib/payment-security'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if Stripe is configured
    const stripe = getStripeClient()
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 500 }
      )
    }

    const { shipmentId, bidId } = await request.json()

    if (!shipmentId || !bidId) {
      return NextResponse.json(
        { error: 'Shipment ID and Bid ID are required' },
        { status: 400 }
      )
    }

    // Rate limiting check
    if (!checkRateLimit((session.user as any).id)) {
      await logSuspiciousActivity(
        (session.user as any).id,
        'Rate limit exceeded for payment creation',
        { shipmentId, bidId }
      )
      return NextResponse.json(
        { error: 'Too many payment attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Get shipment and bid details
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        user: true,
        bids: {
          where: { id: bidId },
          include: { user: true }
        }
      }
    })

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    const bid = shipment.bids[0]
    if (!bid) {
      return NextResponse.json(
        { error: 'Bid not found' },
        { status: 404 }
      )
    }

    // Verify the user owns the shipment
    if (shipment.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized to pay for this shipment' },
        { status: 403 }
      )
    }

    // Security validation
    const securityCheck = await validatePaymentSecurity(
      (session.user as any).id,
      bid.amount,
      shipmentId
    )

    if (!securityCheck.isValid) {
      await logSuspiciousActivity(
        (session.user as any).id,
        `Payment blocked: ${securityCheck.reason}`,
        { shipmentId, bidId, amount: bid.amount, riskLevel: securityCheck.riskLevel }
      )
      return NextResponse.json(
        { error: securityCheck.reason || 'Payment security check failed' },
        { status: 403 }
      )
    }

    // Verify the bid is accepted
    if (bid.status !== 'ACCEPTED') {
      return NextResponse.json(
        { error: 'Bid must be accepted before payment' },
        { status: 400 }
      )
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: {
        shipmentId,
        bidId,
        status: { in: ['PENDING', 'COMPLETED'] }
      }
    })

    if (existingPayment) {
      if (existingPayment.stripePaymentIntentId) {
        // Return existing payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(existingPayment.stripePaymentIntentId)
        return NextResponse.json({
          clientSecret: paymentIntent.client_secret,
          paymentId: existingPayment.id
        })
      } else {
        // Payment exists but no Stripe intent, create a new one
        const paymentIntent = await stripe.paymentIntents.create({
          amount: formatAmountForStripe(bid.amount, 'USD'),
          currency: 'usd',
          metadata: {
            paymentId: existingPayment.id,
            shipmentId,
            bidId,
            userId: (session.user as any).id
          },
          description: `FreightFloo payment for shipment: ${shipment.title}`,
          automatic_payment_methods: {
            enabled: true,
          },
        })

        // Update payment with Stripe Payment Intent ID
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { stripePaymentIntentId: paymentIntent.id }
        })

        return NextResponse.json({
          clientSecret: paymentIntent.client_secret,
          paymentId: existingPayment.id
        })
      }
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: bid.amount,
        currency: 'USD',
        status: 'PENDING',
        description: `Payment for shipment: ${shipment.title}`,
        metadata: JSON.stringify({
          shipmentId,
          bidId,
          carrierId: bid.userId,
          carrierName: bid.user.name
        }),
        userId: (session.user as any).id,
        shipmentId,
        bidId
      }
    })

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(bid.amount, 'USD'),
      currency: 'usd',
      metadata: {
        paymentId: payment.id,
        shipmentId,
        bidId,
        userId: (session.user as any).id
      },
      description: `FreightFloo payment for shipment: ${shipment.title}`,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Update payment with Stripe Payment Intent ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripePaymentIntentId: paymentIntent.id }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id
    })
  } catch (error) {
    console.error('Create payment intent error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
