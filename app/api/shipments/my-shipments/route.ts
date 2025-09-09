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
    const status = searchParams.get('status')
    const userId = (session.user as any).id

    const whereClause: any = {
      userId
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    const shipments = await prisma.shipment.findMany({
      where: whereClause,
      include: {
        bids: {
          include: {
            user: {
              select: {
                name: true,
                companyName: true
              }
            }
          },
          orderBy: {
            amount: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(shipments)
  } catch (error) {
    console.error('Error fetching user shipments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
