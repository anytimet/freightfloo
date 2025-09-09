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

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Fetch all report data
    const [
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      totalUsers,
      monthlyUsers,
      lastMonthUsers,
      totalShipments,
      monthlyShipments,
      lastMonthShipments,
      totalBids,
      monthlyBids,
      lastMonthBids,
      averageBidAmount,
      topCarriers,
      topShippers,
      monthlyStats
    ] = await Promise.all([
      // Total revenue
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      
      // Monthly revenue
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth }
        },
        _sum: { amount: true }
      }),
      
      // Last month revenue
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        _sum: { amount: true }
      }),
      
      // Total users
      prisma.user.count(),
      
      // Monthly users
      prisma.user.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      
      // Last month users
      prisma.user.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        }
      }),
      
      // Total shipments
      prisma.shipment.count(),
      
      // Monthly shipments
      prisma.shipment.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      
      // Last month shipments
      prisma.shipment.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        }
      }),
      
      // Total bids
      prisma.bid.count(),
      
      // Monthly bids
      prisma.bid.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      
      // Last month bids
      prisma.bid.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        }
      }),
      
      // Average bid amount
      prisma.bid.aggregate({
        _avg: { amount: true }
      }),
      
      // Top carriers
      prisma.user.findMany({
        where: { role: 'CARRIER' },
        include: {
          bids: {
            include: {
              payments: {
                where: { status: 'COMPLETED' }
              }
            }
          }
        },
        take: 5
      }),
      
      // Top shippers
      prisma.user.findMany({
        where: { role: 'SHIPPER' },
        include: {
          shipments: true,
          payments: {
            where: { status: 'COMPLETED' }
          }
        },
        take: 5
      }),
      
      // Monthly stats for last 6 months
      getMonthlyStats()
    ])

    // Calculate growth percentages
    const revenueGrowth = calculateGrowth(
      monthlyRevenue._sum.amount || 0,
      lastMonthRevenue._sum.amount || 0
    )
    const userGrowth = calculateGrowth(monthlyUsers, lastMonthUsers)
    const shipmentGrowth = calculateGrowth(monthlyShipments, lastMonthShipments)
    const bidGrowth = calculateGrowth(monthlyBids, lastMonthBids)

    // Calculate conversion rate
    const completedShipments = await prisma.shipment.count({
      where: {
        status: {
          in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED']
        }
      }
    })
    const conversionRate = totalShipments > 0 ? (completedShipments / totalShipments) * 100 : 0

    // Process top carriers
    const processedTopCarriers = topCarriers.map((carrier: any) => ({
      name: carrier.name || 'Unknown',
      totalBids: carrier.bids.length,
      totalRevenue: carrier.bids.reduce((sum: number, bid: any) => 
        sum + (bid.payments?.[0]?.amount || 0), 0
      )
    })).sort((a, b) => b.totalRevenue - a.totalRevenue)

    // Process top shippers
    const processedTopShippers = topShippers.map(shipper => ({
      name: shipper.name || 'Unknown',
      totalShipments: shipper.shipments.length,
      totalSpent: shipper.payments.reduce((sum, payment) => sum + payment.amount, 0)
    })).sort((a, b) => b.totalSpent - a.totalSpent)

    const reportData = {
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      revenueGrowth,
      totalUsers,
      userGrowth,
      totalShipments,
      shipmentGrowth,
      totalBids,
      bidGrowth,
      averageBidAmount: averageBidAmount._avg.amount || 0,
      conversionRate: Math.round(conversionRate * 100) / 100,
      topCarriers: processedTopCarriers,
      topShippers: processedTopShippers,
      monthlyStats
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error fetching report data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

async function getMonthlyStats() {
  const months = []
  const now = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    
    const [revenue, shipments, users] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: monthStart, lte: monthEnd }
        },
        _sum: { amount: true }
      }),
      prisma.shipment.count({
        where: {
          createdAt: { gte: monthStart, lte: monthEnd }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: monthStart, lte: monthEnd }
        }
      })
    ])
    
    months.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: revenue._sum.amount || 0,
      shipments,
      users
    })
  }
  
  return months
}
