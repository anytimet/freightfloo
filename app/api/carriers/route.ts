import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// API Version 2.4 - Complete rewrite to fix caching issues
const CARRIERS_API_VERSION = '2.4'

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

    // Build OR conditions for search and location
    const orConditions: any[] = []

    if (search) {
      orConditions.push(
        { name: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } }
      )
    }

    if (location) {
      orConditions.push(
        { companyCity: { contains: location, mode: 'insensitive' } },
        { companyState: { contains: location, mode: 'insensitive' } }
      )
    }

    if (orConditions.length > 0) {
      whereClause.OR = orConditions
    }

    if (equipmentType) {
      whereClause.equipmentTypes = { has: equipmentType }
    }

    // Note: Rating filtering would require a computed field or separate query
    // For now, we'll skip rating filtering until we implement proper rating calculation
    // if (minRating) {
    //   whereClause.rating = { gte: parseFloat(minRating) }
    // }

    // Complete rewrite - v2.4 - No invalid fields
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
      hasMore: offset + carriers.length < totalCount,
      version: CARRIERS_API_VERSION
    })

  } catch (error) {
    console.error('Error fetching carriers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}