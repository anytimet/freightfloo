import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendEmail, createEmailTemplate } from '@/lib/email'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook received!')
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  const stripe = getStripeClient()
  if (!stripe) {
    console.error('❌ Stripe not configured')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log('✅ Webhook signature verified, event type:', event.type)
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        console.log('💰 Payment intent succeeded!')
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment intent metadata:', paymentIntent.metadata)
        
        // Get shipment and bid info from payment intent metadata
        const { shipmentId, bidId, userId, shipperEmail, carrierEmail } = paymentIntent.metadata
        
        if (!shipmentId || !bidId || !userId) {
          console.error('❌ Missing required metadata in payment intent:', paymentIntent.metadata)
          break
        }
        
        console.log('✅ Processing payment for shipment:', shipmentId, 'bid:', bidId, 'user:', userId)

        // Get shipment and bid details
        const shipment = await prisma.shipment.findUnique({
          where: { id: shipmentId },
          include: {
            user: true,
            bids: {
              where: { id: bidId, status: 'ACCEPTED' },
              include: { user: true }
            }
          }
        })

        if (!shipment || shipment.bids.length === 0) {
          console.error('Shipment or bid not found:', { shipmentId, bidId })
          break
        }

        const bid = shipment.bids[0]

        // Create payment record now that payment is successful
        console.log('💳 Creating payment record...')
        const payment = await prisma.payment.create({
          data: {
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency.toUpperCase(),
            status: 'COMPLETED',
            stripePaymentIntentId: paymentIntent.id,
            stripeChargeId: paymentIntent.latest_charge as string,
            description: `Payment for shipment: ${shipment.title}`,
            metadata: JSON.stringify({
              shipmentId,
              bidId,
              carrierId: bid.userId,
              carrierName: bid.user.name,
              shipperEmail,
              carrierEmail
            }),
            userId,
            shipmentId,
            bidId
          }
        })
        console.log('✅ Payment record created:', payment.id)

        // Update shipment status
        await prisma.shipment.update({
          where: { id: shipmentId },
          data: {
            status: 'ASSIGNED',
            paymentStatus: 'COMPLETED'
          }
        })

        // Create notifications
        // Notify shipper
        await prisma.notification.create({
          data: {
            type: 'PAYMENT_COMPLETED',
            title: 'Payment Completed',
            message: `Payment of $${payment.amount} has been completed for shipment: ${shipment.title}`,
            userId,
            shipmentId,
            bidId
          }
        })

        // Notify carrier
        await prisma.notification.create({
          data: {
            type: 'SHIPMENT_ASSIGNED',
            title: 'Shipment Assigned',
            message: `Payment completed! Shipment "${shipment.title}" has been assigned to you.`,
            userId: bid.userId,
            shipmentId,
            bidId
          }
        })

        // Send email notifications
        const shipmentUrl = `${process.env.NEXTAUTH_URL}/shipment/${shipmentId}`
        
        // Email to shipper
        const shipperEmailTemplate = createEmailTemplate('PAYMENT_COMPLETED', {
          shipmentTitle: shipment.title,
          bidAmount: payment.amount,
          carrierName: bid.user.name || 'Carrier'
        })
        
        await sendEmail({
          to: shipment.user.email!,
          subject: shipperEmailTemplate.subject,
          html: shipperEmailTemplate.html
        })

        // Email to carrier
        const carrierEmailTemplate = createEmailTemplate('SHIPMENT_ASSIGNED', {
          shipmentTitle: shipment.title,
          bidAmount: payment.amount,
          origin: shipment.origin,
          destination: shipment.destination,
          pickupDate: shipment.pickupDate.toLocaleDateString(),
          shipmentUrl
        })
        
        await sendEmail({
          to: bid.user.email!,
          subject: carrierEmailTemplate.subject,
          html: carrierEmailTemplate.html
        })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Find and update payment record
        const payment = await prisma.payment.findFirst({
          where: { stripePaymentIntentId: paymentIntent.id }
        })

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED' }
          })

          // Create notification for failed payment
          await prisma.notification.create({
            data: {
              type: 'PAYMENT_FAILED',
              title: 'Payment Failed',
              message: `Payment failed for shipment. Please try again or contact support.`,
              userId: payment.userId,
              shipmentId: payment.shipmentId
            }
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
