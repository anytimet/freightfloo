import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Simple readiness check - just verify database connection
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'not ready',
      message: 'Database not ready'
    }, { status: 503 })
  }
}
