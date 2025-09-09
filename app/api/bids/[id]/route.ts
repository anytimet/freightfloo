import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, createEmailTemplate } from '@/lib/email'
import { NotificationService } from '@/lib/notification-service'

export async function PATCH(
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

    const { status } = await request.json()

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status. Must be ACCEPTED or REJECTED' },
        { status: 400 }
      )
    }

    // Get the bid and check if the user owns the shipment
    const bid = await prisma.bid.findUnique({
      where: { id: params.id },
      include: {
        shipment: {
          select: {
            id: true,
            userId: true,
            status: true
          }
        }
      }
    })

    if (!bid) {
      return NextResponse.json(
        { message: 'Bid not found' },
        { status: 404 }
      )
    }

    // Check if the user owns the shipment
    if (bid.shipment.userId !== (session.user as any)?.id) {
      return NextResponse.json(
        { message: 'You can only manage bids on your own shipments' },
        { status: 403 }
      )
    }

    // Check if shipment is still active
    if (bid.shipment.status !== 'ACTIVE') {
      return NextResponse.json(
        { message: 'Cannot modify bids on inactive shipments' },
        { status: 400 }
      )
    }

    // If accepting a bid, reject all other pending bids on this shipment
    if (status === 'ACCEPTED') {
      await prisma.bid.updateMany({
        where: {
          shipmentId: bid.shipment.id,
          status: 'PENDING',
          id: { not: params.id }
        },
        data: { status: 'REJECTED' }
      })

      // Update shipment status to PENDING (waiting for payment)
      await prisma.shipment.update({
        where: { id: bid.shipment.id },
        data: { 
          status: 'PENDING',
          paymentStatus: 'PENDING'
        }
      })
    }

    // Update the bid status
    const updatedBid = await prisma.bid.update({
      where: { id: params.id },
      data: { status },
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
            title: true
          }
        }
      }
    })

    // Send notification to carrier about bid status
    if (status === 'ACCEPTED') {
      await NotificationService.notifyBidAccepted(
        updatedBid.shipment.id,
        updatedBid.amount,
        (session.user as any).name || 'Shipper'
      )

      // Send email notification to carrier
      if (updatedBid.user.email) {
        const emailTemplate = createEmailTemplate('BID_ACCEPTED', {
          shipmentTitle: updatedBid.shipment.title,
          bidAmount: updatedBid.amount,
          shipmentUrl: `${process.env.NEXTAUTH_URL}/shipment/${updatedBid.shipment.id}`
        })
        
        await sendEmail({
          to: updatedBid.user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        })
      }
    } else if (status === 'REJECTED') {
      await NotificationService.notifyBidRejected(
        updatedBid.shipment.id,
        updatedBid.amount,
        (session.user as any).name || 'Shipper'
      )

      // Send email notification to carrier
      if (updatedBid.user.email) {
        const emailTemplate = createEmailTemplate('BID_REJECTED', {
          shipmentTitle: updatedBid.shipment.title,
          bidAmount: updatedBid.amount,
          shipmentUrl: `${process.env.NEXTAUTH_URL}/shipment/${updatedBid.shipment.id}`
        })
        
        await sendEmail({
          to: updatedBid.user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        })
      }
    }

    return NextResponse.json(updatedBid)
  } catch (error) {
    console.error('Error updating bid:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
