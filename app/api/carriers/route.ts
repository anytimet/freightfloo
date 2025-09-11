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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const equipmentType = searchParams.get('equipmentType') || ''
    const minRating = searchParams.get('minRating') || ''

    // Build where clause
    const whereClause: any = {
      role: 'CARRIER'
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' }
    }

    if (equipmentType) {
      whereClause.equipmentTypes = { has: equipmentType }
    }

    if (minRating) {
      whereClause.rating = { gte: parseFloat(minRating) }
    }

    const carriers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        dotNumber: true,
        mcNumber: true,
        companyCity: true,
        companyState: true,
        equipmentTypes: true,
        carrierVerified: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.user.count({
      where: whereClause
    })

    return NextResponse.json({
      carriers,
      totalCount,
      hasMore: offset + carriers.length < totalCount
    })

  } catch (error) {
    console.error('Error fetching carriers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
