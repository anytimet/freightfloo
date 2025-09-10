import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        companyName: true,
        dotNumber: true,
        mcNumber: true,
        equipmentTypes: true,
        notificationSettings: true,
        privacySettings: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const settings = {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      companyName: user.companyName || '',
      dotNumber: user.dotNumber || '',
      mcNumber: user.mcNumber || '',
      equipmentTypes: user.equipmentTypes || [],
      notifications: user.notificationSettings || {
        email: true,
        sms: false,
        push: true
      },
      privacy: user.privacySettings || {
        profileVisible: true,
        contactVisible: false
      }
    }

    return NextResponse.json({ settings })

  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()

    const {
      name,
      email,
      phone,
      companyName,
      dotNumber,
      mcNumber,
      equipmentTypes,
      notifications,
      privacy
    } = body

    // Update user settings
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        companyName,
        dotNumber,
        mcNumber,
        equipmentTypes,
        notificationSettings: notifications,
        privacySettings: privacy
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        companyName: true,
        dotNumber: true,
        mcNumber: true,
        equipmentTypes: true,
        notificationSettings: true,
        privacySettings: true
      }
    })

    return NextResponse.json({
      success: true,
      settings: {
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        companyName: updatedUser.companyName || '',
        dotNumber: updatedUser.dotNumber || '',
        mcNumber: updatedUser.mcNumber || '',
        equipmentTypes: updatedUser.equipmentTypes || [],
        notifications: updatedUser.notificationSettings || {
          email: true,
          sms: false,
          push: true
        },
        privacy: updatedUser.privacySettings || {
          profileVisible: true,
          contactVisible: false
        }
      }
    })

  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
