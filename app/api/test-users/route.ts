import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get user count and sample users (without passwords)
    const userCount = await prisma.user.count()
    
    const sampleUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      status: 'success',
      userCount: userCount,
      sampleUsers: sampleUsers,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Test users error:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
