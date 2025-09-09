'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  TruckIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import AddTruckForm from '@/components/AddTruckForm'

interface Truck {
  id: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  truckType: string
  capacity: number
  maxWeight: number
  length?: number
  width?: number
  height?: number
  fuelType: string
  status: string
  location?: string
  latitude?: number
  longitude?: number
  lastMaintenance?: string
  nextMaintenance?: string
  mileage: number
  insuranceExpiry?: string
  registrationExpiry?: string
  createdAt: string
}

export default function FleetManagementPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'ALL'
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchTrucks()
  }, [statusFilter])

  const fetchTrucks = async () => {
    try {
      const url = statusFilter === 'ALL' 
        ? '/api/trucks'
        : `/api/trucks?status=${statusFilter}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setTrucks(data)
      }
    } catch (error) {
      console.error('Error fetching trucks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'IN_USE':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'MAINTENANCE':
        return <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-500" />
      case 'OUT_OF_SERVICE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'IN_USE':
        return 'bg-blue-100 text-blue-800'
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800'
      case 'OUT_OF_SERVICE':
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

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const isExpiringSoon = (expiryDate: string, daysThreshold: number = 30) => {
    return getDaysUntilExpiry(expiryDate) <= daysThreshold && getDaysUntilExpiry(expiryDate) > 0
  }

  const isExpired = (expiryDate: string) => {
    return getDaysUntilExpiry(expiryDate) <= 0
  }

  const handleTruckAdded = () => {
    fetchTrucks() // Refresh the trucks list
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
            <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
            <p className="text-gray-600 mt-1">Manage your truck fleet and track maintenance</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Truck
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trucks</p>
                <p className="text-2xl font-bold text-gray-900">{trucks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trucks.filter(t => t.status === 'AVAILABLE').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500">
                <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trucks.filter(t => t.status === 'MAINTENANCE').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-500">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Service</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trucks.filter(t => t.status === 'OUT_OF_SERVICE').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex space-x-4">
            {['ALL', 'AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE'].map((status) => (
              <a
                key={status}
                href={`/dashboard/fleet${status === 'ALL' ? '' : `?status=${status}`}`}
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

        {/* Trucks List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {trucks.length === 0 ? (
            <div className="p-8 text-center">
              <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trucks found</h3>
              <p className="text-gray-500 mb-4">
                {statusFilter === 'ALL' 
                  ? "You haven't added any trucks to your fleet yet."
                  : `No trucks with status "${statusFilter}".`
                }
              </p>
              {statusFilter === 'ALL' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  Add Your First Truck
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {trucks.map((truck) => (
                <div key={truck.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(truck.status)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {truck.year} {truck.make} {truck.model}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(truck.status)}`}>
                          {truck.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">License Plate</p>
                          <p className="font-medium">{truck.licensePlate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium">{truck.truckType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <p className="font-medium">{truck.capacity} tons</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mileage</p>
                          <p className="font-medium">{truck.mileage.toLocaleString()} mi</p>
                        </div>
                      </div>

                      {/* Location */}
                      {truck.location && (
                        <div className="flex items-center mb-4">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{truck.location}</span>
                        </div>
                      )}

                      {/* Maintenance & Expiry Alerts */}
                      <div className="space-y-2">
                        {truck.insuranceExpiry && (
                          <div className={`p-3 rounded-lg ${
                            isExpired(truck.insuranceExpiry) 
                              ? 'bg-red-50 border border-red-200' 
                              : isExpiringSoon(truck.insuranceExpiry)
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">Insurance Expiry</span>
                              <span className={`text-sm font-medium ${
                                isExpired(truck.insuranceExpiry) 
                                  ? 'text-red-600' 
                                  : isExpiringSoon(truck.insuranceExpiry)
                                  ? 'text-yellow-600'
                                  : 'text-gray-600'
                              }`}>
                                {formatDate(truck.insuranceExpiry)}
                                {isExpired(truck.insuranceExpiry) && ' (EXPIRED)'}
                                {isExpiringSoon(truck.insuranceExpiry) && !isExpired(truck.insuranceExpiry) && 
                                  ` (${getDaysUntilExpiry(truck.insuranceExpiry)} days)`
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        {truck.registrationExpiry && (
                          <div className={`p-3 rounded-lg ${
                            isExpired(truck.registrationExpiry) 
                              ? 'bg-red-50 border border-red-200' 
                              : isExpiringSoon(truck.registrationExpiry)
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">Registration Expiry</span>
                              <span className={`text-sm font-medium ${
                                isExpired(truck.registrationExpiry) 
                                  ? 'text-red-600' 
                                  : isExpiringSoon(truck.registrationExpiry)
                                  ? 'text-yellow-600'
                                  : 'text-gray-600'
                              }`}>
                                {formatDate(truck.registrationExpiry)}
                                {isExpired(truck.registrationExpiry) && ' (EXPIRED)'}
                                {isExpiringSoon(truck.registrationExpiry) && !isExpired(truck.registrationExpiry) && 
                                  ` (${getDaysUntilExpiry(truck.registrationExpiry)} days)`
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        {truck.nextMaintenance && (
                          <div className={`p-3 rounded-lg ${
                            isExpired(truck.nextMaintenance) 
                              ? 'bg-red-50 border border-red-200' 
                              : isExpiringSoon(truck.nextMaintenance, 7)
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">Next Maintenance</span>
                              <span className={`text-sm font-medium ${
                                isExpired(truck.nextMaintenance) 
                                  ? 'text-red-600' 
                                  : isExpiringSoon(truck.nextMaintenance, 7)
                                  ? 'text-yellow-600'
                                  : 'text-gray-600'
                              }`}>
                                {formatDate(truck.nextMaintenance)}
                                {isExpired(truck.nextMaintenance) && ' (OVERDUE)'}
                                {isExpiringSoon(truck.nextMaintenance, 7) && !isExpired(truck.nextMaintenance) && 
                                  ` (${getDaysUntilExpiry(truck.nextMaintenance)} days)`
                                }
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
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
                        title="Edit Truck"
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

      {/* Add Truck Form Modal */}
      {showAddForm && (
        <AddTruckForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleTruckAdded}
        />
      )}
    </DashboardLayout>
  )
}
