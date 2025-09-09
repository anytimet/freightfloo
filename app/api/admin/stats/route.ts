import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get current date for monthly calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Fetch all admin statistics
    const [
      totalUsers,
      totalShipments,
      activeShipments,
      completedShipments,
      totalBids,
      totalRevenue,
      monthlyRevenue,
      totalCarriers,
      totalShippers,
      pendingApprovals,
      systemAlerts,
      averageBidAmount,
      conversionRate
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total shipments
      prisma.shipment.count(),
      
      // Active shipments
      prisma.shipment.count({
        where: {
          status: {
            in: ['ACTIVE', 'PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED']
          }
        }
      }),
      
      // Completed shipments
      prisma.shipment.count({
        where: {
          status: 'COMPLETED'
        }
      }),
      
      // Total bids
      prisma.bid.count(),
      
      // Total revenue (from completed payments)
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      }),
      
      // Monthly revenue
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startOfMonth
          }
        },
        _sum: {
          amount: true
        }
      }),
      
      // Total carriers
      prisma.user.count({
        where: {
          role: 'CARRIER'
        }
      }),
      
      // Total shippers
      prisma.user.count({
        where: {
          role: 'SHIPPER'
        }
      }),
      
      // Pending approvals (carriers awaiting verification)
      prisma.user.count({
        where: {
          role: 'CARRIER',
          carrierVerified: false
        }
      }),
      
      // System alerts (placeholder - would be from a system alerts table)
      0,
      
      // Average bid amount
      prisma.bid.aggregate({
        _avg: {
          amount: true
        }
      }),
      
      // Conversion rate (shipments with accepted bids / total shipments)
      prisma.shipment.count({
        where: {
          status: {
            in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED']
          }
        }
      })
    ])

    // Calculate conversion rate
    const totalShipmentsCount = await prisma.shipment.count()
    const conversionRateValue = totalShipmentsCount > 0 ? (conversionRate / totalShipmentsCount) * 100 : 0

    const stats = {
      totalUsers,
      totalShipments,
      activeShipments,
      completedShipments,
      totalBids,
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      totalCarriers,
      totalShippers,
      pendingApprovals,
      systemAlerts,
      averageBidAmount: averageBidAmount._avg.amount || 0,
      conversionRate: Math.round(conversionRateValue * 100) / 100
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
