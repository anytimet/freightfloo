import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendEmail, createEmailTemplate } from '@/lib/email'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Find the payment record
        const payment = await prisma.payment.findFirst({
          where: { stripePaymentIntentId: paymentIntent.id },
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

        if (payment) {
          // Update payment status
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              stripeChargeId: paymentIntent.latest_charge as string
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
        }
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
