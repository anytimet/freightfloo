import { NextRequest, NextResponse } from 'next/server'
import { validateCarrier, validateMCNumber } from '@/lib/safer'

export async function POST(request: NextRequest) {
  try {
    const { dotNumber, mcNumber } = await request.json()

    if (!dotNumber && !mcNumber) {
      return NextResponse.json(
        { message: 'DOT number or MC number is required' },
        { status: 400 }
      )
    }

    let validationResult

    if (dotNumber) {
      validationResult = await validateCarrier(dotNumber)
    } else if (mcNumber) {
      validationResult = await validateMCNumber(mcNumber)
    }

    if (!validationResult?.success) {
      return NextResponse.json(
        { 
          message: validationResult?.error || 'Validation failed',
          valid: false 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Carrier validated successfully',
      valid: true,
      carrierData: validationResult.data
    })
  } catch (error) {
    console.error('Carrier validation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
