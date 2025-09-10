import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Simple registration received:', body)
    
    // Basic validation
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Simulate successful registration
    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: 'user-' + Date.now(),
        name: body.name,
        email: body.email,
        role: body.role || 'SHIPPER',
        createdAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Simple registration error:', error)
    return NextResponse.json({
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
