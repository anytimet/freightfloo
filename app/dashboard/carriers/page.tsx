'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  UserGroupIcon, 
  StarIcon, 
  MapPinIcon, 
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Carrier {
  id: string
  name: string
  email: string
  role: string
  companyName?: string
  dotNumber?: string
  mcNumber?: string
  rating?: number
  reviewCount?: number
  location?: string
  equipmentTypes?: string[]
  isVerified: boolean
  createdAt: string
}

export default function BrowseCarriersPage() {
  const { data: session } = useSession()
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [equipmentFilter, setEquipmentFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')

  useEffect(() => {
    fetchCarriers()
  }, [])

  const fetchCarriers = async () => {
    try {
      const response = await fetch('/api/carriers')
      if (response.ok) {
        const data = await response.json()
        setCarriers(data.carriers || [])
      }
    } catch (error) {
      console.error('Error fetching carriers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carrier.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !locationFilter || carrier.location?.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesEquipment = !equipmentFilter || carrier.equipmentTypes?.includes(equipmentFilter)
    const matchesRating = !ratingFilter || (carrier.rating && carrier.rating >= parseFloat(ratingFilter))
    
    return matchesSearch && matchesLocation && matchesEquipment && matchesRating
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Carriers</h1>
          <p className="text-gray-600 mt-1">Find trusted carriers for your shipments</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City, State..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Type
              </label>
              <select
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Equipment</option>
                <option value="Dry Van">Dry Van</option>
                <option value="Refrigerated">Refrigerated</option>
                <option value="Flatbed">Flatbed</option>
                <option value="Container">Container</option>
                <option value="Tanker">Tanker</option>
                <option value="Car Carrier">Car Carrier</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              {filteredCarriers.length} Carrier{filteredCarriers.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          {filteredCarriers.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No carriers found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCarriers.map((carrier) => (
                <div key={carrier.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <TruckIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {carrier.companyName || carrier.name}
                          </h3>
                          {carrier.isVerified ? (
                            <CheckBadgeIcon className="h-5 w-5 text-green-500" title="Verified" />
                          ) : (
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" title="Unverified" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {carrier.name}
                        </p>
                        
                        {carrier.location && (
                          <div className="flex items-center space-x-1 mt-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{carrier.location}</span>
                          </div>
                        )}
                        
                        {carrier.dotNumber && (
                          <p className="text-sm text-gray-600 mt-1">
                            DOT: {carrier.dotNumber}
                          </p>
                        )}
                        
                        {carrier.mcNumber && (
                          <p className="text-sm text-gray-600">
                            MC: {carrier.mcNumber}
                          </p>
                        )}
                        
                        {carrier.rating && (
                          <div className="flex items-center space-x-2 mt-3">
                            <div className="flex items-center space-x-1">
                              {renderStars(carrier.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {carrier.rating.toFixed(1)} ({carrier.reviewCount || 0} reviews)
                            </span>
                          </div>
                        )}
                        
                        {carrier.equipmentTypes && carrier.equipmentTypes.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {carrier.equipmentTypes.map((equipment, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {equipment}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <EnvelopeIcon className="h-4 w-4" />
                          <span>Contact Available</span>
                        </div>
                      </div>
                      
                      <button className="btn-primary text-sm">
                        View Profile
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
