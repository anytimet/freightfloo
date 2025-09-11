import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Simple API test successful',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}

export async function POST() {
  return NextResponse.json({
    message: 'POST request successful',
    timestamp: new Date().toISOString()
  })
}
