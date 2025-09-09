'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  TruckIcon, 
  MapPinIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
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
  origin: string
  destination: string
  status: string
  estimatedDelivery: string
  carrier: {
    name: string
    phone: string
    email: string
  }
  cargo: {
    description: string
    weight: string
    dimensions: string
  }
  trackingEvents: TrackingEvent[]
}

export default function TrackingPage() {
  const params = useParams()
  const shipmentId = params.id as string
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchShipmentDetails()
  }, [shipmentId])

  const fetchShipmentDetails = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, this would fetch from API
      const mockShipment: ShipmentDetails = {
        id: shipmentId,
        origin: 'Los Angeles, CA',
        destination: 'New York, NY',
        status: 'IN_TRANSIT',
        estimatedDelivery: '2024-01-15T18:00:00Z',
        carrier: {
          name: 'Swift Transportation',
          phone: '(555) 123-4567',
          email: 'dispatch@swifttrans.com'
        },
        cargo: {
          description: 'Electronics and Computer Equipment',
          weight: '2,500 lbs',
          dimensions: '48" x 40" x 36"'
        },
        trackingEvents: [
          {
            id: '1',
            status: 'PICKED_UP',
            location: 'Los Angeles, CA',
            timestamp: '2024-01-10T08:00:00Z',
            description: 'Package picked up from origin'
          },
          {
            id: '2',
            status: 'IN_TRANSIT',
            location: 'Denver, CO',
            timestamp: '2024-01-12T14:30:00Z',
            description: 'Package in transit - arrived at Denver hub'
          },
          {
            id: '3',
            status: 'IN_TRANSIT',
            location: 'Chicago, IL',
            timestamp: '2024-01-14T09:15:00Z',
            description: 'Package in transit - arrived at Chicago hub'
          }
        ]
      }
      
      setShipment(mockShipment)
    } catch (err) {
      setError('Failed to load shipment details')
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load shipment tracking information'
      })
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shipment Tracking
          </h1>
          <p className="text-gray-600">
            Track your shipment in real-time
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="font-medium text-gray-900">Carrier Name</div>
              <div className="text-gray-600">{shipment.carrier.name}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Phone</div>
              <div className="text-gray-600">{shipment.carrier.phone}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Email</div>
              <div className="text-gray-600">{shipment.carrier.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
