import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const revieweeId = searchParams.get('revieweeId')
    const reviewerId = searchParams.get('reviewerId')
    const shipmentId = searchParams.get('shipmentId')
    const tripId = searchParams.get('tripId')
    const rating = searchParams.get('rating')

    const whereClause: any = {
      isPublic: true
    }

    if (revieweeId) {
      whereClause.revieweeId = revieweeId
    }

    if (reviewerId) {
      whereClause.reviewerId = reviewerId
    }

    if (shipmentId) {
      whereClause.shipmentId = shipmentId
    }

    if (tripId) {
      whereClause.tripId = tripId
    }

    if (rating) {
      whereClause.rating = parseInt(rating)
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        shipment: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate rating statistics
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews 
      : 0

    const ratingBreakdown = reviews.reduce((acc: { [key: string]: number }, review: any) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    return NextResponse.json({
      reviews,
      totalReviews,
      averageRating,
      ratingBreakdown
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      revieweeId,
      rating,
      comment,
      communicationRating,
      timelinessRating,
      professionalismRating,
      valueRating,
      shipmentId,
      tripId
    } = body

    const reviewerId = (session.user as any).id

    // Validate required fields
    if (!revieweeId || !rating) {
      return NextResponse.json(
        { error: 'Reviewee ID and rating are required' },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user is trying to review themselves
    if (reviewerId === revieweeId) {
      return NextResponse.json(
        { error: 'You cannot review yourself' },
        { status: 400 }
      )
    }

    // Check if user has already reviewed this person for this shipment/trip
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId,
        revieweeId,
        OR: [
          { shipmentId: shipmentId || null },
          { tripId: tripId || null }
        ]
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this user for this shipment/trip' },
        { status: 400 }
      )
    }

    // Verify the reviewer has permission to review (completed shipment/trip)
    if (shipmentId) {
      const shipment = await prisma.shipment.findFirst({
        where: {
          id: shipmentId,
          OR: [
            { userId: reviewerId }, // Shipper reviewing carrier
            { 
              bids: {
                some: {
                  userId: reviewerId,
                  status: 'ACCEPTED'
                }
              }
            } // Carrier reviewing shipper
          ],
          status: 'COMPLETED' // Only allow reviews for completed shipments
        }
      })

      if (!shipment) {
        return NextResponse.json(
          { error: 'You can only review users for completed shipments you were involved in' },
          { status: 403 }
        )
      }
    }

    if (tripId) {
      const trip = await prisma.trip.findFirst({
        where: {
          id: tripId,
          OR: [
            { carrierId: reviewerId }, // Carrier reviewing shipper
            { 
              shipment: {
                userId: reviewerId
              }
            } // Shipper reviewing carrier
          ],
          status: 'COMPLETED' // Only allow reviews for completed trips
        }
      })

      if (!trip) {
        return NextResponse.json(
          { error: 'You can only review users for completed trips you were involved in' },
          { status: 403 }
        )
      }
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        reviewerId,
        revieweeId,
        rating,
        comment: comment || null,
        communicationRating: communicationRating || null,
        timelinessRating: timelinessRating || null,
        professionalismRating: professionalismRating || null,
        valueRating: valueRating || null,
        shipmentId: shipmentId || null,
        tripId: tripId || null,
        isVerified: true, // Mark as verified since it's from a completed transaction
        reviewType: shipmentId ? 'SHIPMENT' : tripId ? 'TRIP' : 'GENERAL'
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        shipment: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    // Create notification for the reviewee
    await prisma.notification.create({
      data: {
        userId: revieweeId,
        type: 'NEW_REVIEW',
        title: 'New Review Received',
        message: `You received a ${rating}-star review from ${(session.user as any).name}`,
      }
    })

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
