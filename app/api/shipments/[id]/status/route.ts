import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NotificationService } from '@/lib/notification-service'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const shipmentId = params.id
    const body = await request.json()
    const { status, podImage, podNotes } = body

    // Validate status
    const validStatuses = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Find the shipment
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

    // Check if user has permission to update status
    const isShipper = shipment.userId === (session.user as any).id
    const isCarrier = shipment.bids.some(bid => bid.userId === (session.user as any).id)

    if (!isShipper && !isCarrier) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Validate status transitions
    const currentStatus = shipment.currentStatus
    const validTransitions: { [key: string]: string[] } = {
      'PENDING': ['PICKED_UP'],
      'PICKED_UP': ['IN_TRANSIT'],
      'IN_TRANSIT': ['DELIVERED'],
      'DELIVERED': ['COMPLETED'],
      'COMPLETED': [] // No further transitions
    }

    if (!validTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentStatus} to ${status}` },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      currentStatus: status,
      updatedAt: new Date()
    }

    // Set timestamps based on status
    const now = new Date()
    switch (status) {
      case 'PICKED_UP':
        updateData.pickupTime = now
        break
      case 'IN_TRANSIT':
        updateData.transitTime = now
        break
      case 'DELIVERED':
        updateData.deliveryTime = now
        break
      case 'COMPLETED':
        updateData.completionTime = now
        updateData.podReceived = true
        if (podImage) updateData.podImage = podImage
        if (podNotes) updateData.podNotes = podNotes
        break
    }

    // Update shipment
    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: updateData,
      include: {
        user: true,
        bids: {
          where: { status: 'ACCEPTED' },
          include: { user: true }
        }
      }
    })

    // Create notifications for status change
    await NotificationService.notifyShipmentStatusUpdate(
      shipment.id,
      status,
      (session.user as any).name || 'User'
    )

    // Send email notifications (if configured)
    try {
      // This would integrate with your email service
      // await sendStatusUpdateEmails(updatedShipment, status)
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      shipment: updatedShipment,
      message: `Shipment status updated to ${status.replace('_', ' ')}`
    })

  } catch (error) {
    console.error('Error updating shipment status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
