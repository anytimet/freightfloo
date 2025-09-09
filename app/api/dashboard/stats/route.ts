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

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || 'SHIPPER'
    const userId = (session.user as any).id

    let stats: any = {}

    switch (role) {
      case 'SHIPPER':
        stats = await getShipperStats(userId)
        break
      case 'CARRIER':
        stats = await getCarrierStats(userId)
        break
      case 'ADMIN':
        stats = await getAdminStats()
        break
      default:
        stats = await getShipperStats(userId)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getShipperStats(userId: string) {
  const [
    totalShipments,
    activeShipments,
    totalBids,
    pendingBids
  ] = await Promise.all([
    prisma.shipment.count({
      where: { userId }
    }),
    prisma.shipment.count({
      where: { userId, status: 'ACTIVE' }
    }),
    prisma.bid.count({
      where: {
        shipment: { userId }
      }
    }),
    prisma.bid.count({
      where: {
        shipment: { userId },
        status: 'PENDING'
      }
    })
  ])

  return {
    totalShipments,
    activeShipments,
    totalBids,
    pendingBids
  }
}

async function getCarrierStats(userId: string) {
  const [
    totalTrucks,
    availableTrucks,
    totalDrivers,
    availableDrivers,
    totalTrips,
    activeTrips,
    totalRevenue,
    monthlyRevenue
  ] = await Promise.all([
    prisma.truck.count({
      where: { ownerId: userId }
    }),
    prisma.truck.count({
      where: { ownerId: userId, status: 'AVAILABLE' }
    }),
    prisma.driver.count({
      where: { carrierId: userId }
    }),
    prisma.driver.count({
      where: { carrierId: userId, status: 'AVAILABLE' }
    }),
    prisma.trip.count({
      where: { carrierId: userId }
    }),
    prisma.trip.count({
      where: { carrierId: userId, status: 'IN_PROGRESS' }
    }),
    prisma.payment.aggregate({
      where: {
        bid: { user: { id: userId } },
        status: 'COMPLETED'
      },
      _sum: { amount: true }
    }),
    prisma.payment.aggregate({
      where: {
        bid: { user: { id: userId } },
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    })
  ])

  return {
    totalTrucks,
    availableTrucks,
    totalDrivers,
    availableDrivers,
    totalTrips,
    activeTrips,
    totalRevenue: totalRevenue._sum.amount || 0,
    monthlyRevenue: monthlyRevenue._sum.amount || 0
  }
}

async function getAdminStats() {
  const [
    totalShipments,
    totalCarriers,
    activeTrips,
    totalRevenue
  ] = await Promise.all([
    prisma.shipment.count(),
    prisma.user.count({
      where: { role: 'CARRIER' }
    }),
    prisma.trip.count({
      where: { status: 'IN_PROGRESS' }
    }),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    })
  ])

  return {
    totalShipments,
    totalTrucks: totalCarriers, // Using carriers count as trucks for admin
    activeTrips,
    totalRevenue: totalRevenue._sum.amount || 0
  }
}
