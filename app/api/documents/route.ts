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
    const shipmentId = searchParams.get('shipmentId')
    const tripId = searchParams.get('tripId')
    const category = searchParams.get('category')
    const userId = (session.user as any).id

    const whereClause: any = {
      OR: [
        { uploadedById: userId }, // User's own documents
        { isPublic: true } // Public documents
      ]
    }

    if (shipmentId) {
      whereClause.shipmentId = shipmentId
    }

    if (tripId) {
      whereClause.tripId = tripId
    }

    if (category) {
      whereClause.category = category
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
