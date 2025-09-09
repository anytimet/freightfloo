'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  BellIcon, 
  XMarkIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  TruckIcon,
  DocumentTextIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: string
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

const notificationIcons = {
  'NEW_BID': CurrencyDollarIcon,
  'BID_ACCEPTED': CheckCircleIcon,
  'BID_REJECTED': ExclamationTriangleIcon,
  'PAYMENT_COMPLETED': CheckCircleIcon,
  'SHIPMENT_ASSIGNED': TruckIcon,
  'DOCUMENT_UPLOADED': DocumentTextIcon,
  'NEW_REVIEW': StarIcon,
  'SHIPMENT_STATUS_UPDATE': InformationCircleIcon,
  'PAYMENT_FAILED': ExclamationTriangleIcon,
  'REFUND_PROCESSED': CurrencyDollarIcon,
  'TRIP_STARTED': TruckIcon,
  'TRIP_COMPLETED': CheckCircleIcon,
  'DEFAULT': BellIcon
}

const notificationColors = {
  'NEW_BID': 'text-blue-600 bg-blue-100',
  'BID_ACCEPTED': 'text-green-600 bg-green-100',
  'BID_REJECTED': 'text-red-600 bg-red-100',
  'PAYMENT_COMPLETED': 'text-green-600 bg-green-100',
  'SHIPMENT_ASSIGNED': 'text-blue-600 bg-blue-100',
  'DOCUMENT_UPLOADED': 'text-purple-600 bg-purple-100',
  'NEW_REVIEW': 'text-yellow-600 bg-yellow-100',
  'SHIPMENT_STATUS_UPDATE': 'text-indigo-600 bg-indigo-100',
  'PAYMENT_FAILED': 'text-red-600 bg-red-100',
  'REFUND_PROCESSED': 'text-orange-600 bg-orange-100',
  'TRIP_STARTED': 'text-blue-600 bg-blue-100',
  'TRIP_COMPLETED': 'text-green-600 bg-green-100',
  'DEFAULT': 'text-gray-600 bg-gray-100'
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (isOpen && session?.user) {
      fetchNotifications()
    }
  }, [isOpen, session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, read: true }
              : notif
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH'
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        )
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notif => notif.id !== notificationId)
        )
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return date.toLocaleDateString()
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(notif => !notif.read)
    : notifications

  const unreadCount = notifications.filter(notif => !notif.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BellIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-1 p-4 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'unread'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const IconComponent = notificationIcons[notification.type as keyof typeof notificationIcons] || notificationIcons.DEFAULT
                const colorClass = notificationColors[notification.type as keyof typeof notificationColors] || notificationColors.DEFAULT
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${colorClass}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                title="Mark as read"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'You\'re all caught up!' 
                  : 'You\'ll see notifications here when they arrive.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Mark all as read
              </button>
              <button
                onClick={fetchNotifications}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
