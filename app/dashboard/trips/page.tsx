'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  MapIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface Trip {
  id: string
  tripNumber: string
  status: string
  startLocation: string
  endLocation: string
  startLatitude?: number
  startLongitude?: number
  endLatitude?: number
  endLongitude?: number
  distance?: number
  estimatedDuration?: number
  actualDuration?: number
  plannedStartTime: string
  actualStartTime?: string
  plannedEndTime: string
  actualEndTime?: string
  fuelCost?: number
  tollCost?: number
  otherExpenses?: number
  totalCost?: number
  notes?: string
  createdAt: string
  truck: {
    id: string
    make: string
    model: string
    year: number
    licensePlate: string
  }
  driver: {
    id: string
    firstName: string
    lastName: string
    licenseNumber: string
  }
  shipment?: {
    id: string
    title: string
    origin: string
    destination: string
  }
}

export default function TripsManagementPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'ALL'
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchTrips()
  }, [statusFilter])

  const fetchTrips = async () => {
    try {
      const url = statusFilter === 'ALL' 
        ? '/api/trips'
        : `/api/trips?status=${statusFilter}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setTrips(data)
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'IN_PROGRESS':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'CANCELLED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getProgressPercentage = (trip: Trip) => {
    if (trip.status === 'COMPLETED') return 100
    if (trip.status === 'CANCELLED') return 0
    if (trip.status === 'PLANNED') return 0
    
    // For IN_PROGRESS, calculate based on time elapsed
    if (trip.actualStartTime) {
      const start = new Date(trip.actualStartTime)
      const plannedEnd = new Date(trip.plannedEndTime)
      const now = new Date()
      const totalDuration = plannedEnd.getTime() - start.getTime()
      const elapsed = now.getTime() - start.getTime()
      return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
    }
    
    return 0
  }

  const handleTripAdded = () => {
    fetchTrips() // Refresh the trips list
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trip Management</h1>
            <p className="text-gray-600 mt-1">Track and manage your trips and deliveries</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Trip
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <MapIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trips.filter(t => t.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trips.filter(t => t.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-600">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(trips.reduce((sum, trip) => sum + (trip.totalCost || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex space-x-4">
            {['ALL', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
              <a
                key={status}
                href={`/dashboard/trips${status === 'ALL' ? '' : `?status=${status}`}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.replace('_', ' ')}
              </a>
            ))}
          </div>
        </div>

        {/* Trips List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {trips.length === 0 ? (
            <div className="p-8 text-center">
              <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
              <p className="text-gray-500 mb-4">
                {statusFilter === 'ALL' 
                  ? "You haven't created any trips yet."
                  : `No trips with status "${statusFilter}".`
                }
              </p>
              {statusFilter === 'ALL' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  Create Your First Trip
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {trips.map((trip) => (
                <div key={trip.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(trip.status)}
                        <h3 className="text-lg font-medium text-gray-900">
                          Trip #{trip.tripNumber}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
                          {trip.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {/* Route */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          {trip.startLocation} → {trip.endLocation}
                        </p>
                        {trip.distance && (
                          <p className="text-sm text-gray-500">
                            Distance: {trip.distance.toFixed(1)} miles
                          </p>
                        )}
                      </div>

                      {/* Progress Bar for In Progress Trips */}
                      {trip.status === 'IN_PROGRESS' && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{getProgressPercentage(trip).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressPercentage(trip)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Truck</p>
                          <div className="flex items-center">
                            <TruckIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium">
                              {trip.truck.year} {trip.truck.make} {trip.truck.model}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{trip.truck.licensePlate}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Driver</p>
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium">
                              {trip.driver.firstName} {trip.driver.lastName}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{trip.driver.licenseNumber}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Timing</p>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium">
                              {formatDate(trip.plannedStartTime)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {trip.estimatedDuration && formatDuration(trip.estimatedDuration)} estimated
                          </p>
                        </div>
                      </div>

                      {/* Shipment Info */}
                      {trip.shipment && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Associated Shipment</h4>
                          <p className="text-sm text-gray-600">{trip.shipment.title}</p>
                          <p className="text-sm text-gray-500">
                            {trip.shipment.origin} → {trip.shipment.destination}
                          </p>
                        </div>
                      )}

                      {/* Cost Information */}
                      {trip.totalCost && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Trip Cost</span>
                            <span className="text-lg font-bold text-blue-600">
                              {formatCurrency(trip.totalCost)}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-2 text-xs text-gray-600">
                            {trip.fuelCost && (
                              <div>
                                <span>Fuel: </span>
                                <span className="font-medium">{formatCurrency(trip.fuelCost)}</span>
                              </div>
                            )}
                            {trip.tollCost && (
                              <div>
                                <span>Tolls: </span>
                                <span className="font-medium">{formatCurrency(trip.tollCost)}</span>
                              </div>
                            )}
                            {trip.otherExpenses && (
                              <div>
                                <span>Other: </span>
                                <span className="font-medium">{formatCurrency(trip.otherExpenses)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6 flex space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit Trip"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
