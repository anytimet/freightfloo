import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NotificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      questionId,
      content,
      isPublic
    } = body

    const answererId = (session.user as any).id

    // Validate required fields
    if (!questionId || !content) {
      return NextResponse.json(
        { error: 'Question ID and content are required' },
        { status: 400 }
      )
    }

    // Get the question and verify permissions
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        asker: true,
        shipment: true
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    // Verify the user can answer this question
    if (question.answererId && question.answererId !== answererId) {
      return NextResponse.json(
        { error: 'You are not authorized to answer this question' },
        { status: 403 }
      )
    }

    // If no specific answerer is set, check if user is involved in the shipment
    if (!question.answererId && question.shipment) {
      const isInvolved = await prisma.shipment.findFirst({
        where: {
          id: question.shipment.id,
          OR: [
            { userId: answererId }, // Shipper
            { 
              bids: {
                some: {
                  userId: answererId,
                  status: 'ACCEPTED'
                }
              }
            } // Carrier
          ]
        }
      })

      if (!isInvolved) {
        return NextResponse.json(
          { error: 'You can only answer questions for shipments you are involved in' },
          { status: 403 }
        )
      }
    }

    // Create the answer
    const answer = await prisma.answer.create({
      data: {
        questionId,
        answererId,
        content,
        isPublic: isPublic || false
      },
      include: {
        answerer: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    // Update question to mark as answered
    await prisma.question.update({
      where: { id: questionId },
      data: { 
        isAnswered: true,
        answererId: answererId
      }
    })

    // Create notification for the question asker
    if (question.asker.id !== answererId) {
      await NotificationService.createNotification({
        userId: question.asker.id,
        type: 'QUESTION_ANSWERED',
        title: 'Question Answered',
        message: `Your question "${question.title}" has been answered`,
        data: {
          questionId: question.id,
          answerId: answer.id,
          shipmentId: question.shipmentId,
          answererName: (session.user as any).name
        },
        shipmentId: question.shipmentId || undefined
      })
    }

    return NextResponse.json({
      success: true,
      answer
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating answer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
