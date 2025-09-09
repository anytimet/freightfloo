import { prisma } from './prisma'

export interface NotificationData {
  userId: string
  type: string
  title: string
  message: string
  data?: any
  shipmentId?: string
  bidId?: string
}

export class NotificationService {
  static async createNotification(notificationData: NotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          shipmentId: notificationData.shipmentId || null,
          bidId: notificationData.bidId || null
        }
      })

      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  static async createBulkNotifications(notifications: NotificationData[]) {
    try {
      const notificationData = notifications.map(notif => ({
        userId: notif.userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        data: notif.data ? JSON.stringify(notif.data) : null,
        shipmentId: notif.shipmentId || null,
        bidId: notif.bidId || null
      }))

      const result = await prisma.notification.createMany({
        data: notificationData
      })

      return result
    } catch (error) {
      console.error('Error creating bulk notifications:', error)
      throw error
    }
  }

  // Predefined notification types
  static async notifyNewBid(shipmentId: string, bidAmount: number, carrierName: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { user: true }
    })

    if (!shipment) return

    return this.createNotification({
      userId: shipment.userId,
      type: 'NEW_BID',
      title: 'New Bid Received',
      message: `${carrierName} placed a bid of $${bidAmount} on your shipment "${shipment.title}"`,
      data: { shipmentId, bidAmount, carrierName },
      shipmentId
    })
  }

  static async notifyBidAccepted(shipmentId: string, bidAmount: number, shipperName: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { 
        bids: { 
          where: { status: 'ACCEPTED' },
          include: { user: true }
        }
      }
    })

    if (!shipment || !shipment.bids[0]) return

    return this.createNotification({
      userId: shipment.bids[0].userId,
      type: 'BID_ACCEPTED',
      title: 'Bid Accepted!',
      message: `${shipperName} accepted your bid of $${bidAmount} for shipment "${shipment.title}"`,
      data: { shipmentId, bidAmount, shipperName },
      shipmentId,
      bidId: shipment.bids[0].id
    })
  }

  static async notifyBidRejected(shipmentId: string, bidAmount: number, shipperName: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { 
        bids: { 
          where: { status: 'REJECTED' },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!shipment || !shipment.bids[0]) return

    return this.createNotification({
      userId: shipment.bids[0].userId,
      type: 'BID_REJECTED',
      title: 'Bid Rejected',
      message: `${shipperName} rejected your bid of $${bidAmount} for shipment "${shipment.title}"`,
      data: { shipmentId, bidAmount, shipperName },
      shipmentId,
      bidId: shipment.bids[0].id
    })
  }

  static async notifyPaymentCompleted(shipmentId: string, amount: number, payerName: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { 
        user: true,
        bids: { 
          where: { status: 'ACCEPTED' },
          include: { user: true }
        }
      }
    })

    if (!shipment) return

    const notifications = []

    // Notify shipper
    if (shipment.bids[0]) {
      notifications.push({
        userId: shipment.userId,
        type: 'PAYMENT_COMPLETED',
        title: 'Payment Completed',
        message: `Payment of $${amount} has been processed for shipment "${shipment.title}"`,
        data: { shipmentId, amount, payerName },
        shipmentId
      })
    }

    // Notify carrier
    if (shipment.bids[0]) {
      notifications.push({
        userId: shipment.bids[0].userId,
        type: 'PAYMENT_COMPLETED',
        title: 'Payment Received',
        message: `You received $${amount} for shipment "${shipment.title}"`,
        data: { shipmentId, amount, payerName },
        shipmentId,
        bidId: shipment.bids[0].id
      })
    }

    if (notifications.length > 0) {
      return this.createBulkNotifications(notifications)
    }
  }

  static async notifyShipmentAssigned(shipmentId: string, carrierName: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { user: true }
    })

    if (!shipment) return

    return this.createNotification({
      userId: shipment.userId,
      type: 'SHIPMENT_ASSIGNED',
      title: 'Shipment Assigned',
      message: `Your shipment "${shipment.title}" has been assigned to ${carrierName}`,
      data: { shipmentId, carrierName },
      shipmentId
    })
  }

  static async notifyDocumentUploaded(shipmentId: string, documentTitle: string, uploaderName: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { 
        user: true,
        bids: { 
          where: { status: 'ACCEPTED' },
          include: { user: true }
        }
      }
    })

    if (!shipment) return

    const notifications = []

    // Notify shipper if carrier uploaded
    if (shipment.bids[0] && shipment.bids[0].userId !== shipment.userId) {
      notifications.push({
        userId: shipment.userId,
        type: 'DOCUMENT_UPLOADED',
        title: 'New Document Uploaded',
        message: `${uploaderName} uploaded "${documentTitle}" for shipment "${shipment.title}"`,
        data: { shipmentId, documentTitle, uploaderName },
        shipmentId
      })
    }

    // Notify carrier if shipper uploaded
    if (shipment.bids[0] && shipment.bids[0].userId !== shipment.userId) {
      notifications.push({
        userId: shipment.bids[0].userId,
        type: 'DOCUMENT_UPLOADED',
        title: 'New Document Uploaded',
        message: `${uploaderName} uploaded "${documentTitle}" for shipment "${shipment.title}"`,
        data: { shipmentId, documentTitle, uploaderName },
        shipmentId
      })
    }

    if (notifications.length > 0) {
      return this.createBulkNotifications(notifications)
    }
  }

  static async notifyNewReview(userId: string, rating: number, reviewerName: string) {
    return this.createNotification({
      userId,
      type: 'NEW_REVIEW',
      title: 'New Review Received',
      message: `You received a ${rating}-star review from ${reviewerName}`,
      data: { rating, reviewerName }
    })
  }

  static async notifyShipmentStatusUpdate(shipmentId: string, status: string, updaterName: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { 
        user: true,
        bids: { 
          where: { status: 'ACCEPTED' },
          include: { user: true }
        }
      }
    })

    if (!shipment) return

    const statusMessages = {
      'PICKED_UP': 'has been picked up',
      'IN_TRANSIT': 'is now in transit',
      'DELIVERED': 'has been delivered',
      'COMPLETED': 'has been completed'
    }

    const message = statusMessages[status as keyof typeof statusMessages] || 'status has been updated'

    const notifications = []

    // Notify shipper
    notifications.push({
      userId: shipment.userId,
      type: 'SHIPMENT_STATUS_UPDATE',
      title: 'Shipment Status Updated',
      message: `Your shipment "${shipment.title}" ${message}`,
      data: { shipmentId, status, updaterName },
      shipmentId
    })

    // Notify carrier
    if (shipment.bids[0]) {
      notifications.push({
        userId: shipment.bids[0].userId,
        type: 'SHIPMENT_STATUS_UPDATE',
        title: 'Shipment Status Updated',
        message: `Shipment "${shipment.title}" ${message}`,
        data: { shipmentId, status, updaterName },
        shipmentId
      })
    }

    return this.createBulkNotifications(notifications)
  }

  static async notifyNewQuestion(userId: string, questionTitle: string, askerName: string) {
    return this.createNotification({
      userId,
      type: 'NEW_QUESTION',
      title: 'New Question Received',
      message: `You received a new question from ${askerName}: "${questionTitle}"`,
      data: { questionTitle, askerName }
    })
  }

  static async notifyQuestionAnswered(userId: string, questionTitle: string, answererName: string) {
    return this.createNotification({
      userId,
      type: 'QUESTION_ANSWERED',
      title: 'Question Answered',
      message: `Your question "${questionTitle}" has been answered by ${answererName}`,
      data: { questionTitle, answererName }
    })
  }
}
