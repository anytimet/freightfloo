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
    const range = searchParams.get('range') || '30d'
    const userId = (session.user as any).id

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get previous period for growth calculation
    const previousStartDate = new Date(startDate)
    const previousEndDate = new Date(startDate)
    previousStartDate.setTime(startDate.getTime() - (now.getTime() - startDate.getTime()))

    // Fetch trips data
    const [currentTrips, previousTrips, trucks, drivers, payments] = await Promise.all([
      // Current period trips
      prisma.trip.findMany({
        where: {
          carrierId: userId,
          createdAt: {
            gte: startDate,
            lte: now
          }
        },
        include: {
          truck: true,
          driver: true
        }
      }),
      // Previous period trips for growth calculation
      prisma.trip.findMany({
        where: {
          carrierId: userId,
          createdAt: {
            gte: previousStartDate,
            lt: startDate
          }
        }
      }),
      // Fleet data
      prisma.truck.findMany({
        where: { ownerId: userId }
      }),
      // Driver data
      prisma.driver.findMany({
        where: { carrierId: userId }
      }),
      // Payment data
      prisma.payment.findMany({
        where: {
          bid: {
            user: { id: userId }
          },
          status: 'COMPLETED',
          createdAt: {
            gte: startDate,
            lte: now
          }
        }
      })
    ])

    // Calculate revenue metrics
    const totalRevenue = payments.reduce((sum: number, payment: any) => sum + payment.amount, 0)
    const previousRevenue = await prisma.payment.aggregate({
      where: {
        bid: {
          user: { id: userId }
        },
        status: 'COMPLETED',
        createdAt: {
          gte: previousStartDate,
          lt: startDate
        }
      },
      _sum: { amount: true }
    })

    const revenueGrowth = previousRevenue._sum.amount 
      ? ((totalRevenue - previousRevenue._sum.amount) / previousRevenue._sum.amount) * 100
      : 0

    // Calculate trip metrics
    const completedTrips = currentTrips.filter((trip: any) => trip.status === 'COMPLETED')
    const inProgressTrips = currentTrips.filter((trip: any) => trip.status === 'IN_PROGRESS')
    const averageDuration = completedTrips.length > 0
      ? completedTrips.reduce((sum: number, trip: any) => sum + (trip.actualDuration || 0), 0) / completedTrips.length
      : 0

    const tripGrowth = previousTrips.length > 0
      ? ((currentTrips.length - previousTrips.length) / previousTrips.length) * 100
      : 0

    // Calculate fleet metrics
    const availableTrucks = trucks.filter((truck: any) => truck.status === 'AVAILABLE').length
    const utilizationRate = trucks.length > 0 ? ((trucks.length - availableTrucks) / trucks.length) * 100 : 0
    const averageMileage = trucks.length > 0
      ? trucks.reduce((sum: number, truck: any) => sum + truck.mileage, 0) / trucks.length
      : 0

    // Calculate driver metrics
    const availableDrivers = drivers.filter((driver: any) => driver.status === 'AVAILABLE').length
    const onTripDrivers = drivers.filter((driver: any) => driver.status === 'ON_TRIP').length
    const averageHours = drivers.length > 0
      ? drivers.reduce((sum: number, driver: any) => sum + driver.hoursOfService, 0) / drivers.length
      : 0

    // Generate monthly data (last 12 months)
    const monthlyData = []
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthTrips = currentTrips.filter((trip: any) =>
        trip.createdAt >= monthStart && trip.createdAt <= monthEnd
      )
      
      const monthRevenue = payments.filter((payment: any) =>
        payment.createdAt >= monthStart && payment.createdAt <= monthEnd
      ).reduce((sum: number, payment: any) => sum + payment.amount, 0)

      const monthMileage = monthTrips.reduce((sum: number, trip: any) => sum + (trip.distance || 0), 0)

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        trips: monthTrips.length,
        mileage: monthMileage
      })
    }

    // Calculate top routes
    const routeMap = new Map()
    currentTrips.forEach((trip: any) => {
      const route = `${trip.startLocation} → ${trip.endLocation}`
      if (routeMap.has(route)) {
        const existing = routeMap.get(route)
        existing.trips += 1
        existing.revenue += trip.totalCost || 0
      } else {
        routeMap.set(route, {
          route,
          trips: 1,
          revenue: trip.totalCost || 0
        })
      }
    })

    const topRoutes = Array.from(routeMap.values())
      .sort((a, b) => b.trips - a.trips)
      .slice(0, 5)

    // Calculate cost breakdown (mock data for now)
    const costBreakdown = {
      fuel: totalRevenue * 0.3, // 30% of revenue
      maintenance: totalRevenue * 0.15, // 15% of revenue
      insurance: totalRevenue * 0.1, // 10% of revenue
      other: totalRevenue * 0.05 // 5% of revenue
    }

    // Calculate time-based revenue
    const monthlyRevenue = payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt)
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return paymentDate >= currentMonth
    }).reduce((sum, payment) => sum + payment.amount, 0)

    const weeklyRevenue = payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt)
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return paymentDate >= weekAgo
    }).reduce((sum, payment) => sum + payment.amount, 0)

    const dailyRevenue = payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt)
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      return paymentDate >= yesterday
    }).reduce((sum, payment) => sum + payment.amount, 0)

    const analytics = {
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        weekly: weeklyRevenue,
        daily: dailyRevenue,
        growth: revenueGrowth
      },
      trips: {
        total: currentTrips.length,
        completed: completedTrips.length,
        inProgress: inProgressTrips.length,
        averageDuration: averageDuration / 60, // Convert to hours
        growth: tripGrowth
      },
      fleet: {
        totalTrucks: trucks.length,
        availableTrucks: availableTrucks,
        utilizationRate: utilizationRate,
        averageMileage: averageMileage
      },
      drivers: {
        total: drivers.length,
        available: availableDrivers,
        onTrip: onTripDrivers,
        averageHours: averageHours
      },
      monthlyData,
      topRoutes,
      costBreakdown
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
