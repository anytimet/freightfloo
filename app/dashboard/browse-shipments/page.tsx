'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ClockIcon,
  EyeIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface Shipment {
  id: string
  title: string
  description: string | null
  origin: string
  destination: string
  weight: number | null
  dimensions: string | null
  pickupDate: string
  deliveryDate: string | null
  pricingType: string
  startingBid: number | null
  offerPrice: number | null
  category: string | null
  status: string
  user: {
    name: string
    companyName: string | null
  }
  bids: Array<{
    id: string
    amount: number
    status: string
  }>
  createdAt: string
}

export default function BrowseShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: '',
    pricingType: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    fetchShipments()
  }, [filter])

  const fetchShipments = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.category) params.append('category', filter.category)
      if (filter.pricingType) params.append('pricingType', filter.pricingType)
      if (filter.status) params.append('status', filter.status)

      const response = await fetch(`/api/shipments?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        // Ensure data is an array
        if (Array.isArray(data)) {
          setShipments(data)
        } else if (data.shipments && Array.isArray(data.shipments)) {
          setShipments(data.shipments)
        } else {
          console.error('Unexpected data format:', data)
          setShipments([])
        }
      } else {
        console.error('Failed to fetch shipments:', response.status)
        setShipments([])
      }
    } catch (error) {
      console.error('Error fetching shipments:', error)
      setShipments([])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getLowestBid = (bids: Shipment['bids']) => {
    const activeBids = bids.filter(bid => bid.status === 'PENDING')
    if (activeBids.length === 0) return null
    return Math.min(...activeBids.map(bid => bid.amount))
  }

  const getBidButtonText = (shipment: Shipment) => {
    if (shipment.pricingType === 'offer') {
      return 'Accept Offer'
    }
    return 'Place Bid'
  }

  const getBidButtonColor = (shipment: Shipment) => {
    if (shipment.pricingType === 'offer') {
      return 'bg-green-600 hover:bg-green-700'
    }
    return 'bg-blue-600 hover:bg-blue-700'
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Shipments</h1>
          <p className="text-gray-600 mt-1">Find new opportunities and place bids</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="General Freight">General Freight</option>
                <option value="Refrigerated">Refrigerated</option>
                <option value="Flatbed">Flatbed</option>
                <option value="Tanker">Tanker</option>
                <option value="Auto Transport">Auto Transport</option>
                <option value="Oversized">Oversized</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
              <select
                value={filter.pricingType}
                onChange={(e) => setFilter(prev => ({ ...prev, pricingType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="auction">Auction</option>
                <option value="offer">Fixed Offer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="ASSIGNED">Assigned</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilter({ category: '', pricingType: '', status: 'ACTIVE' })}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Shipments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.isArray(shipments) && shipments.map((shipment) => (
            <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{shipment.title}</h3>
                    <p className="text-sm text-gray-600">
                      by {shipment.user.companyName || shipment.user.name}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {shipment.status}
                  </span>
                </div>

                {/* Route */}
                <div className="flex items-center mb-4">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {shipment.origin} → {shipment.destination}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Pickup: {formatDate(shipment.pickupDate)}
                    </span>
                  </div>
                  
                  {shipment.weight && (
                    <div className="flex items-center">
                      <ScaleIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Weight: {shipment.weight} lbs
                      </span>
                    </div>
                  )}
                  
                  {shipment.category && (
                    <div className="flex items-center">
                      <TruckIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Category: {shipment.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {shipment.pricingType === 'auction' ? 'Starting Bid' : 'Offer Price'}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(shipment.pricingType === 'auction' 
                          ? shipment.startingBid || 0 
                          : shipment.offerPrice || 0
                        )}
                      </p>
                    </div>
                    {getLowestBid(shipment.bids) && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Lowest Bid</p>
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(getLowestBid(shipment.bids)!)}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {shipment.bids.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        {shipment.bids.length} bid{shipment.bids.length !== 1 ? 's' : ''} received
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <a
                    href={`/shipment/${shipment.id}`}
                    className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Details
                  </a>
                  <button
                    onClick={() => window.location.href = `/shipment/${shipment.id}`}
                    className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getBidButtonColor(shipment)}`}
                  >
                    {getBidButtonText(shipment)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {shipments.length === 0 && !loading && (
          <div className="text-center py-12">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or check back later for new opportunities.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
