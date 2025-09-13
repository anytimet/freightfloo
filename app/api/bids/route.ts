import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, createEmailTemplate } from '@/lib/email'
import { trackBidPlaced } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { shipmentId, amount, message } = await request.json()
    console.log('Bid API called with:', { shipmentId, amount, message, userId: (session.user as any)?.id })

    // Check if shipment exists and is active
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId }
    })

    if (!shipment) {
      return NextResponse.json(
        { message: 'Shipment not found' },
        { status: 404 }
      )
    }

    if (shipment.status !== 'ACTIVE') {
      return NextResponse.json(
        { message: 'Shipment is not accepting bids' },
        { status: 400 }
      )
    }

    if (shipment.userId === (session.user as any)?.id) {
      return NextResponse.json(
        { message: 'Cannot bid on your own shipment' },
        { status: 400 }
      )
    }

    // Check if user already has a bid on this shipment (PENDING or ACCEPTED)
    const existingBid = await prisma.bid.findFirst({
      where: {
        userId: (session.user as any).id,
        shipmentId: shipmentId,
        status: { in: ['PENDING', 'ACCEPTED'] }
      }
    })

    if (existingBid) {
      return NextResponse.json(
        { message: 'You already have a bid on this shipment' },
        { status: 400 }
      )
    }

    // Reverse auction validation - only for auction type shipments
    if (shipment.pricingType === 'auction' && shipment.startingBid) {
      // Reject bids higher than or equal to starting price
      if (amount >= shipment.startingBid) {
        return NextResponse.json(
          { message: `Bid must be lower than starting price of ${shipment.startingBid}` },
          { status: 400 }
        )
      }

      // Find the current lowest bid
      const lowestBid = await prisma.bid.findFirst({
        where: {
          shipmentId: shipmentId,
          status: 'PENDING'
        },
        orderBy: {
          amount: 'asc'
        }
      })

      // If there's a lowest bid, new bid must be at least $20 lower
      if (lowestBid && amount >= (lowestBid.amount - 20)) {
        return NextResponse.json(
          { message: `Bid must be at least $20 lower than current lowest bid of ${lowestBid.amount}` },
          { status: 400 }
        )
      }
    }

    // For offer-type shipments, automatically accept the bid
    const bidStatus = shipment.pricingType === 'offer' ? 'ACCEPTED' : 'PENDING'
    console.log('Shipment pricing type:', shipment.pricingType, 'Bid status will be:', bidStatus)
    
    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: any) => {
      // Double-check for existing bid within transaction
      const existingBidInTx = await tx.bid.findFirst({
        where: {
          userId: (session.user as any).id,
          shipmentId: shipmentId,
          status: { in: ['PENDING', 'ACCEPTED'] }
        }
      })

      if (existingBidInTx) {
        throw new Error('You already have a bid on this shipment')
      }

      // Create the bid
      const bid = await tx.bid.create({
        data: {
          amount,
          message,
          status: bidStatus,
          userId: (session.user as any).id,
          shipmentId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          shipment: {
            select: {
              id: true,
              title: true,
              userId: true
            }
          }
        }
      })

      // If this is an offer acceptance, update shipment status
      if (shipment.pricingType === 'offer') {
        console.log('Updating shipment status to PENDING for offer acceptance')
        await tx.shipment.update({
          where: { id: shipmentId },
          data: {
            status: 'PENDING',
            paymentStatus: 'PENDING'
          }
        })
        console.log('Shipment status updated successfully')
      }

      return bid
    })

    const bid = result

    // Send appropriate notification based on bid type
    if (shipment.pricingType === 'offer') {
      // For offer acceptance
      await prisma.notification.create({
        data: {
          type: 'OFFER_ACCEPTED',
          title: 'Offer Accepted',
          message: `A carrier has accepted your $${amount} offer for shipment "${shipment.title}". Please complete payment to assign the shipment.`,
          userId: shipment.userId,
          shipmentId: shipment.id,
          bidId: bid.id
        }
      })

      // Also notify the carrier
      await prisma.notification.create({
        data: {
          type: 'BID_ACCEPTED',
          title: 'Offer Accepted',
          message: `Your acceptance of the $${amount} offer for "${shipment.title}" has been confirmed.`,
          userId: (session.user as any).id,
          shipmentId: shipment.id,
          bidId: bid.id
        }
      })
    } else {
      // For regular bid
      await prisma.notification.create({
        data: {
          type: 'NEW_BID',
          title: 'New Bid Received',
          message: `A new bid of $${amount} has been placed on your shipment "${shipment.title}"`,
          userId: shipment.userId,
          shipmentId: shipment.id,
          bidId: bid.id
        }
      })
    }

    // Send email notifications
    const shipper = await prisma.user.findUnique({
      where: { id: shipment.userId },
      select: { email: true, name: true }
    })

    if (shipper?.email) {
      if (shipment.pricingType === 'offer') {
        // Email for offer acceptance - shipper needs to pay
        const emailTemplate = createEmailTemplate('OFFER_ACCEPTED', {
          shipmentTitle: shipment.title,
          bidAmount: amount,
          carrierName: bid.user.name || 'Anonymous',
          shipmentUrl: `${process.env.NEXTAUTH_URL}/shipment/${shipment.id}`
        })
        
        await sendEmail({
          to: shipper.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        })
      } else {
        // Email for new bid
        const emailTemplate = createEmailTemplate('NEW_BID', {
          shipmentTitle: shipment.title,
          bidAmount: amount,
          carrierName: bid.user.name || 'Anonymous',
          bidMessage: message,
          shipmentUrl: `${process.env.NEXTAUTH_URL}/shipment/${shipment.id}`
        })
        
        await sendEmail({
          to: shipper.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        })
      }
    }

    // Send email to carrier for offer acceptance
    if (shipment.pricingType === 'offer' && bid.user.email) {
      const emailTemplate = createEmailTemplate('BID_ACCEPTED', {
        shipmentTitle: shipment.title,
        bidAmount: amount
      })
      
      await sendEmail({
        to: bid.user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      })
    }

    // Track bid placement
    trackBidPlaced(shipmentId, amount)

    return NextResponse.json(bid, { status: 201 })
  } catch (error) {
    console.error('Error creating bid:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
