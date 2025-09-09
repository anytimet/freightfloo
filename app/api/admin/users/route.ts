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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        carrierVerified: true,
        createdAt: true,
        shipments: {
          select: {
            id: true
          }
        },
        bids: {
          select: {
            id: true,
            amount: true
          }
        },
        payments: {
          where: {
            status: 'COMPLETED'
          },
          select: {
            amount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate additional stats for each user
    const usersWithStats = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.carrierVerified,
      createdAt: user.createdAt.toISOString(),
      totalShipments: user.shipments.length,
      totalBids: user.bids.length,
      totalRevenue: user.payments.reduce((sum, payment) => sum + payment.amount, 0)
    }))

    return NextResponse.json(usersWithStats)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
