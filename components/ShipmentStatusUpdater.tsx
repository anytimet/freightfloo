'use client'

import { useState } from 'react'
import { 
  TruckIcon, 
  MapIcon, 
  CheckCircleIcon, 
  DocumentCheckIcon,
  CameraIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface ShipmentStatusUpdaterProps {
  shipmentId: string
  currentStatus: string
  onStatusUpdate: (newStatus: string) => void
  userRole: 'SHIPPER' | 'CARRIER'
}

const statusConfig = {
  PENDING: {
    label: 'Pending Pickup',
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    nextStatus: 'PICKED_UP',
    nextLabel: 'Mark as Picked Up',
    description: 'Shipment is ready for pickup'
  },
  PICKED_UP: {
    label: 'Picked Up',
    icon: TruckIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    nextStatus: 'IN_TRANSIT',
    nextLabel: 'Start Transit',
    description: 'Shipment has been picked up and is ready for transit'
  },
  IN_TRANSIT: {
    label: 'In Transit',
    icon: MapIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    nextStatus: 'DELIVERED',
    nextLabel: 'Mark as Delivered',
    description: 'Shipment is on the road to destination'
  },
  DELIVERED: {
    label: 'Delivered',
    icon: CheckCircleIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    nextStatus: 'COMPLETED',
    nextLabel: 'Complete Delivery',
    description: 'Shipment has been delivered, awaiting POD confirmation'
  },
  COMPLETED: {
    label: 'Completed',
    icon: DocumentCheckIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    nextStatus: null,
    nextLabel: null,
    description: 'Shipment completed with POD received'
  }
}

export default function ShipmentStatusUpdater({ 
  shipmentId, 
  currentStatus, 
  onStatusUpdate, 
  userRole 
}: ShipmentStatusUpdaterProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPODForm, setShowPODForm] = useState(false)
  const [podImage, setPodImage] = useState('')
  const [podNotes, setPodNotes] = useState('')

  const config = statusConfig[currentStatus as keyof typeof statusConfig]
  const Icon = config.icon

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === 'COMPLETED') {
      setShowPODForm(true)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/shipments/${shipmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status')
      }

      onStatusUpdate(newStatus)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePODSubmission = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/shipments/${shipmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'COMPLETED',
          podImage,
          podNotes
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete delivery')
      }

      onStatusUpdate('COMPLETED')
      setShowPODForm(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const canUpdateStatus = () => {
    // Only carriers can update status, or shippers can only view
    if (userRole === 'SHIPPER') return false
    if (currentStatus === 'COMPLETED') return false
    return true
  }

  return (
    <div className="space-y-4">
      {/* Current Status Display */}
      <div className={`p-4 rounded-lg border ${config.bgColor} border-current`}>
        <div className="flex items-center">
          <Icon className={`h-6 w-6 ${config.color} mr-3`} />
          <div>
            <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Status Update Button */}
      {canUpdateStatus() && config.nextStatus && (
        <div className="space-y-3">
          <button
            onClick={() => handleStatusUpdate(config.nextStatus!)}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Icon className="h-5 w-5 mr-2" />
            )}
            {config.nextLabel}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      )}

      {/* POD Form Modal */}
      {showPODForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <DocumentCheckIcon className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Complete Delivery</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof of Delivery Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <CameraIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Upload POD image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // In a real app, you'd upload to a cloud service
                          setPodImage(URL.createObjectURL(file))
                        }
                      }}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Notes
                  </label>
                  <textarea
                    value={podNotes}
                    onChange={(e) => setPodNotes(e.target.value)}
                    placeholder="Any additional notes about the delivery..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPODForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePODSubmission}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Completing...' : 'Complete Delivery'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status History */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Status History</h4>
        <div className="space-y-2">
          {Object.entries(statusConfig).map(([status, config]) => {
            const StatusIcon = config.icon
            const isActive = currentStatus === status
            const isCompleted = getStatusOrder(currentStatus) > getStatusOrder(status)
            
            return (
              <div
                key={status}
                className={`flex items-center p-2 rounded ${
                  isActive ? 'bg-blue-50 border border-blue-200' : 
                  isCompleted ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <StatusIcon className={`h-4 w-4 mr-2 ${
                  isActive ? 'text-blue-600' : 
                  isCompleted ? 'text-green-600' : 'text-gray-400'
                }`} />
                <span className={`text-sm ${
                  isActive ? 'font-medium text-blue-900' : 
                  isCompleted ? 'text-green-800' : 'text-gray-600'
                }`}>
                  {config.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function getStatusOrder(status: string): number {
  const order = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED']
  return order.indexOf(status)
}
