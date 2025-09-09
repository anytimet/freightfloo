'use client'

import { useState, useEffect } from 'react'
import {
  TruckIcon,
  MapIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface ShipmentStatusWidgetProps {
  shipmentId: string
  currentStatus: string
  pickupTime?: string | null
  transitTime?: string | null
  deliveryTime?: string | null
  completionTime?: string | null
  podReceived?: boolean
}

const statusConfig = {
  PENDING: {
    label: 'Pending Pickup',
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  PICKED_UP: {
    label: 'Picked Up',
    icon: TruckIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  IN_TRANSIT: {
    label: 'In Transit',
    icon: MapIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  DELIVERED: {
    label: 'Delivered',
    icon: CheckCircleIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  COMPLETED: {
    label: 'Completed',
    icon: DocumentCheckIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200'
  }
}

export default function ShipmentStatusWidget({
  shipmentId,
  currentStatus,
  pickupTime,
  transitTime,
  deliveryTime,
  completionTime,
  podReceived
}: ShipmentStatusWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusOrder = (status: string): number => {
    const order = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED']
    return order.indexOf(status)
  }

  const currentConfig = statusConfig[currentStatus as keyof typeof statusConfig]
  const CurrentIcon = currentConfig.icon

  const statusHistory = [
    {
      status: 'PENDING',
      label: 'Pending Pickup',
      timestamp: null,
      completed: getStatusOrder(currentStatus) > 0
    },
    {
      status: 'PICKED_UP',
      label: 'Picked Up',
      timestamp: pickupTime,
      completed: getStatusOrder(currentStatus) > 1
    },
    {
      status: 'IN_TRANSIT',
      label: 'In Transit',
      timestamp: transitTime,
      completed: getStatusOrder(currentStatus) > 2
    },
    {
      status: 'DELIVERED',
      label: 'Delivered',
      timestamp: deliveryTime,
      completed: getStatusOrder(currentStatus) > 3
    },
    {
      status: 'COMPLETED',
      label: 'Completed',
      timestamp: completionTime,
      completed: currentStatus === 'COMPLETED'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Shipment Status</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Current Status */}
      <div className={`p-3 rounded-lg border ${currentConfig.bgColor} ${currentConfig.borderColor}`}>
        <div className="flex items-center">
          <CurrentIcon className={`h-5 w-5 ${currentConfig.color} mr-3`} />
          <div>
            <p className={`font-medium ${currentConfig.color}`}>{currentConfig.label}</p>
            {podReceived && currentStatus === 'COMPLETED' && (
              <p className="text-xs text-green-600 mt-1">✓ POD Received</p>
            )}
          </div>
        </div>
      </div>

      {/* Status History */}
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Status History</h4>
          <div className="space-y-2">
            {statusHistory.map((item, index) => {
              const config = statusConfig[item.status as keyof typeof statusConfig]
              const Icon = config.icon
              const isActive = currentStatus === item.status
              const isCompleted = item.completed

              return (
                <div
                  key={item.status}
                  className={`flex items-center p-2 rounded ${
                    isActive ? 'bg-blue-50 border border-blue-200' : 
                    isCompleted ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 mr-3 ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm ${
                      isActive ? 'font-medium text-blue-900' : 
                      isCompleted ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {item.label}
                    </p>
                    {item.timestamp && (
                      <p className="text-xs text-gray-500">
                        {formatDateTime(item.timestamp)}
                      </p>
                    )}
                  </div>
                  {isCompleted && (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  )}
                </div>
              )
            })}
          </div>

          {/* POD Information */}
          {podReceived && completionTime && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <DocumentCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Proof of Delivery Received</p>
                  <p className="text-xs text-green-600">
                    Completed on {formatDateTime(completionTime)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
