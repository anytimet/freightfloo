'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  UserGroupIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  IdentificationIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  licenseClass: string
  licenseExpiry: string
  medicalCardExpiry: string
  twicCardExpiry?: string
  hazmatEndorsement: boolean
  tankerEndorsement: boolean
  doublesTriplesEndorsement: boolean
  passengerEndorsement: boolean
  schoolBusEndorsement: boolean
  status: string
  currentLocation?: string
  hoursOfService: number
  maxHoursOfService: number
  createdAt: string
}

export default function DriversManagementPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'ALL'
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchDrivers()
  }, [statusFilter])

  const fetchDrivers = async () => {
    try {
      const url = statusFilter === 'ALL' 
        ? '/api/drivers'
        : `/api/drivers?status=${statusFilter}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setDrivers(data)
      }
    } catch (error) {
      console.error('Error fetching drivers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'ON_TRIP':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'OFF_DUTY':
        return <XCircleIcon className="h-5 w-5 text-gray-500" />
      case 'SUSPENDED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'ON_TRIP':
        return 'bg-blue-100 text-blue-800'
      case 'OFF_DUTY':
        return 'bg-gray-100 text-gray-800'
      case 'SUSPENDED':
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

  const getEndorsements = (driver: Driver) => {
    const endorsements = []
    if (driver.hazmatEndorsement) endorsements.push('Hazmat')
    if (driver.tankerEndorsement) endorsements.push('Tanker')
    if (driver.doublesTriplesEndorsement) endorsements.push('Doubles/Triples')
    if (driver.passengerEndorsement) endorsements.push('Passenger')
    if (driver.schoolBusEndorsement) endorsements.push('School Bus')
    return endorsements
  }

  const handleDriverAdded = () => {
    fetchDrivers() // Refresh the drivers list
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
            <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
            <p className="text-gray-600 mt-1">Manage your drivers and track certifications</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Driver
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
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
                  {drivers.filter(d => d.status === 'AVAILABLE').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Trip</p>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'ON_TRIP').length}
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
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'SUSPENDED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex space-x-4">
            {['ALL', 'AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'].map((status) => (
              <a
                key={status}
                href={`/dashboard/drivers${status === 'ALL' ? '' : `?status=${status}`}`}
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

        {/* Drivers List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {drivers.length === 0 ? (
            <div className="p-8 text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
              <p className="text-gray-500 mb-4">
                {statusFilter === 'ALL' 
                  ? "You haven't added any drivers yet."
                  : `No drivers with status "${statusFilter}".`
                }
              </p>
              {statusFilter === 'ALL' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  Add Your First Driver
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {drivers.map((driver) => (
                <div key={driver.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(driver.status)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {driver.firstName} {driver.lastName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(driver.status)}`}>
                          {driver.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">License Number</p>
                          <p className="font-medium">{driver.licenseNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">License Class</p>
                          <p className="font-medium">{driver.licenseClass}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{driver.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Hours of Service</p>
                          <p className="font-medium">{driver.hoursOfService}/{driver.maxHoursOfService}</p>
                        </div>
                      </div>

                      {/* Endorsements */}
                      {getEndorsements(driver).length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">Endorsements</p>
                          <div className="flex flex-wrap gap-2">
                            {getEndorsements(driver).map((endorsement) => (
                              <span
                                key={endorsement}
                                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                              >
                                {endorsement}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certification Expiry Alerts */}
                      <div className="space-y-2">
                        <div className={`p-3 rounded-lg ${
                          isExpired(driver.licenseExpiry) 
                            ? 'bg-red-50 border border-red-200' 
                            : isExpiringSoon(driver.licenseExpiry)
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">CDL Expiry</span>
                            <span className={`text-sm font-medium ${
                              isExpired(driver.licenseExpiry) 
                                ? 'text-red-600' 
                                : isExpiringSoon(driver.licenseExpiry)
                                ? 'text-yellow-600'
                                : 'text-gray-600'
                            }`}>
                              {formatDate(driver.licenseExpiry)}
                              {isExpired(driver.licenseExpiry) && ' (EXPIRED)'}
                              {isExpiringSoon(driver.licenseExpiry) && !isExpired(driver.licenseExpiry) && 
                                ` (${getDaysUntilExpiry(driver.licenseExpiry)} days)`
                              }
                            </span>
                          </div>
                        </div>

                        <div className={`p-3 rounded-lg ${
                          isExpired(driver.medicalCardExpiry) 
                            ? 'bg-red-50 border border-red-200' 
                            : isExpiringSoon(driver.medicalCardExpiry)
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Medical Card Expiry</span>
                            <span className={`text-sm font-medium ${
                              isExpired(driver.medicalCardExpiry) 
                                ? 'text-red-600' 
                                : isExpiringSoon(driver.medicalCardExpiry)
                                ? 'text-yellow-600'
                                : 'text-gray-600'
                            }`}>
                              {formatDate(driver.medicalCardExpiry)}
                              {isExpired(driver.medicalCardExpiry) && ' (EXPIRED)'}
                              {isExpiringSoon(driver.medicalCardExpiry) && !isExpired(driver.medicalCardExpiry) && 
                                ` (${getDaysUntilExpiry(driver.medicalCardExpiry)} days)`
                              }
                            </span>
                          </div>
                        </div>

                        {driver.twicCardExpiry && (
                          <div className={`p-3 rounded-lg ${
                            isExpired(driver.twicCardExpiry) 
                              ? 'bg-red-50 border border-red-200' 
                              : isExpiringSoon(driver.twicCardExpiry)
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">TWIC Card Expiry</span>
                              <span className={`text-sm font-medium ${
                                isExpired(driver.twicCardExpiry) 
                                  ? 'text-red-600' 
                                  : isExpiringSoon(driver.twicCardExpiry)
                                  ? 'text-yellow-600'
                                  : 'text-gray-600'
                              }`}>
                                {formatDate(driver.twicCardExpiry)}
                                {isExpired(driver.twicCardExpiry) && ' (EXPIRED)'}
                                {isExpiringSoon(driver.twicCardExpiry) && !isExpired(driver.twicCardExpiry) && 
                                  ` (${getDaysUntilExpiry(driver.twicCardExpiry)} days)`
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
                        title="Edit Driver"
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
