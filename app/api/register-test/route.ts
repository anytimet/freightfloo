import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Registration test working!',
    timestamp: new Date().toISOString()
  })
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'GET request working!',
    timestamp: new Date().toISOString()
  })
}
