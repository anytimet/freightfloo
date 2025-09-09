import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NotificationService } from '@/lib/notification-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const shipmentId = searchParams.get('shipmentId')
    const userId = (session.user as any).id

    const whereClause: any = {}

    if (shipmentId) {
      whereClause.shipmentId = shipmentId
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      include: {
        asker: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        answerer: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        answers: {
          include: {
            answerer: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter questions based on visibility
    const visibleQuestions = questions.filter((question: any) => {
      return question.isPublic || 
             question.asker.id === userId || 
             question.answererId === userId
    })

    return NextResponse.json({ questions: visibleQuestions })
  } catch (error) {
    console.error('Error fetching questions:', error)
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
      shipmentId,
      title,
      content,
      isPublic,
      answererId
    } = body

    const askerId = (session.user as any).id

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Verify the user has permission to ask questions for this shipment
    if (shipmentId) {
      const shipment = await prisma.shipment.findFirst({
        where: {
          id: shipmentId,
          OR: [
            { userId: askerId }, // Shipper asking carrier
            { 
              bids: {
                some: {
                  userId: askerId,
                  status: 'ACCEPTED'
                }
              }
            } // Carrier asking shipper
          ]
        }
      })

      if (!shipment) {
        return NextResponse.json(
          { error: 'You can only ask questions for shipments you are involved in' },
          { status: 403 }
        )
      }
    }

    // Create the question
    const question = await prisma.question.create({
      data: {
        askerId,
        answererId: answererId || null,
        shipmentId: shipmentId || null,
        title,
        content,
        isPublic: isPublic || false
      },
      include: {
        asker: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        answerer: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        answers: {
          include: {
            answerer: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          }
        }
      }
    })

    // Create notification for the answerer
    if (answererId) {
      await NotificationService.createNotification({
        userId: answererId,
        type: 'NEW_QUESTION',
        title: 'New Question Received',
        message: `You received a new question: "${title}"`,
        data: {
          questionId: question.id,
          shipmentId: shipmentId,
          askerName: (session.user as any).name
        },
        shipmentId: shipmentId || undefined
      })
    }

    return NextResponse.json({
      success: true,
      question
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
