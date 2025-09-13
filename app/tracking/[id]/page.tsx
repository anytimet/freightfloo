'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  TruckIcon, 
  MapPinIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'
import { showToast } from '@/components/Toast'

interface TrackingEvent {
  id: string
  status: string
  location: string
  timestamp: string
  description: string
}

interface ShipmentDetails {
  id: string
  title: string
  origin: string
  destination: string
  status: string
  estimatedDelivery: string
  carrier: {
    name: string
    companyName?: string
    phone?: string
    email: string
  } | null
  cargo: {
    description: string
    weight: string
    dimensions: string
  }
  trackingEvents: TrackingEvent[]
  podReceived?: boolean
  podImage?: string
  podNotes?: string
}

export default function TrackingPage() {
  const params = useParams()
  const shipmentId = params.id as string
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchShipmentDetails()
    
    // Auto-refresh every 30 seconds if shipment is in transit
    const interval = setInterval(() => {
      if (shipment && ['PICKED_UP', 'IN_TRANSIT'].includes(shipment.status)) {
        fetchShipmentDetails(true)
      }
    }, 30000) // 30 seconds
    
    return () => clearInterval(interval)
  }, [shipmentId, shipment?.status])

  const fetchShipmentDetails = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError('')
      
      const response = await fetch(`/api/shipments/${shipmentId}/tracking`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Shipment not found or you do not have access to track this shipment')
        } else if (response.status === 401) {
          setError('Please sign in to track shipments')
        } else {
          setError('Failed to load shipment details')
        }
        return
      }
      
      const shipmentData = await response.json()
      setShipment(shipmentData)
      
      if (isRefresh) {
        showToast({
          type: 'success',
          title: 'Updated',
          message: 'Tracking information refreshed'
        })
      }
    } catch (err) {
      console.error('Error fetching shipment details:', err)
      setError('Failed to load shipment details')
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load shipment tracking information'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PICKED_UP':
        return 'text-blue-600 bg-blue-100'
      case 'IN_TRANSIT':
        return 'text-yellow-600 bg-yellow-100'
      case 'DELIVERED':
        return 'text-green-600 bg-green-100'
      case 'DELAYED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PICKED_UP':
      case 'IN_TRANSIT':
        return <TruckIcon className="h-5 w-5" />
      case 'DELIVERED':
        return <CheckCircleIcon className="h-5 w-5" />
      case 'DELAYED':
        return <ExclamationTriangleIcon className="h-5 w-5" />
      default:
        return <ClockIcon className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Shipment Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find a shipment with ID: {shipmentId}
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Shipment Tracking
              </h1>
              <p className="text-gray-600">
                Track your shipment in real-time
              </p>
            </div>
            <button
              onClick={() => fetchShipmentDetails(true)}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Shipment Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Origin</div>
                    <div className="text-gray-600">{shipment.origin}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Destination</div>
                    <div className="text-gray-600">{shipment.destination}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Estimated Delivery</div>
                    <div className="text-gray-600">{formatDate(shipment.estimatedDelivery)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cargo Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900">Description</div>
                  <div className="text-gray-600">{shipment.cargo.description}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Weight</div>
                  <div className="text-gray-600">{shipment.cargo.weight}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Dimensions</div>
                  <div className="text-gray-600">{shipment.cargo.dimensions}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${getStatusColor(shipment.status)} mr-4`}>
              {getStatusIcon(shipment.status)}
            </div>
            <div>
              <div className="font-medium text-gray-900 capitalize">
                {shipment.status.replace('_', ' ')}
              </div>
              <div className="text-gray-600">
                {shipment.trackingEvents[shipment.trackingEvents.length - 1]?.description}
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Tracking Timeline</h3>
          <div className="space-y-6">
            {shipment.trackingEvents.map((event, index) => (
              <div key={event.id} className="flex items-start">
                <div className={`p-2 rounded-full ${getStatusColor(event.status)} mr-4 mt-1`}>
                  {getStatusIcon(event.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 capitalize">
                      {event.status.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(event.timestamp)}
                    </div>
                  </div>
                  <div className="text-gray-600 mt-1">{event.description}</div>
                  <div className="text-sm text-gray-500 mt-1">{event.location}</div>
                </div>
                {index < shipment.trackingEvents.length - 1 && (
                  <div className="absolute left-6 mt-12 w-0.5 h-6 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Carrier Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Carrier Information</h3>
          {shipment.carrier ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="font-medium text-gray-900">Carrier Name</div>
                <div className="text-gray-600">{shipment.carrier.name}</div>
                {shipment.carrier.companyName && (
                  <div className="text-sm text-gray-500">{shipment.carrier.companyName}</div>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">Phone</div>
                <div className="text-gray-600">{shipment.carrier.phone || 'Not provided'}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Email</div>
                <div className="text-gray-600">{shipment.carrier.email}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Carrier Assigned</h4>
              <p className="text-gray-600">
                This shipment is still waiting for a carrier to be assigned. 
                Once a carrier accepts the shipment, their information will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
