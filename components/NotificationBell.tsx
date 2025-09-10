'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { BellIcon } from '@heroicons/react/24/outline'
import NotificationCenter from './NotificationCenter'

export default function NotificationBell() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    console.log('NotificationBell useEffect - session:', session)
    if (session?.user) {
      console.log('User found, fetching unread count...')
      fetchUnreadCount()
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    } else {
      console.log('No user session found')
    }
  }, [session])

  const fetchUnreadCount = async () => {
    try {
      console.log('Fetching unread count...')
      const response = await fetch('/api/notifications/unread-count')
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Unread count data:', data)
        setUnreadCount(data.count || 0)
      } else {
        console.error('Failed to fetch unread count:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  if (!session?.user) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        title="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
