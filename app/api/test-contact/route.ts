import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Test contact API received:', body)
    
    return NextResponse.json({
      message: 'Test contact API working!',
      receivedData: body,
      timestamp: new Date().toISOString(),
      hasResendKey: !!process.env.RESEND_API_KEY
    })
  } catch (error) {
    console.error('Test contact API error:', error)
    return NextResponse.json({
      error: 'Failed to parse JSON',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}
