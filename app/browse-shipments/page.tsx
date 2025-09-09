'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import {
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ClockIcon,
  EyeIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  FunnelIcon
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: '',
    pricingType: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      // Redirect to signup page if not logged in
      router.push('/auth/signup?redirect=/browse-shipments')
      return
    }

    fetchShipments()
  }, [session, status, router, filter])

  const fetchShipments = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.category) params.append('category', filter.category)
      if (filter.pricingType) params.append('pricingType', filter.pricingType)
      if (filter.status) params.append('status', filter.status)

      const response = await fetch(`/api/shipments?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        // API returns { shipments: [], pagination: {} }
        setShipments(Array.isArray(data.shipments) ? data.shipments : [])
      } else {
        console.error('Failed to fetch shipments:', response.statusText)
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
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Shipments</h1>
          <p className="text-gray-600">Find freight opportunities that match your routes and equipment.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="general">General Freight</option>
                <option value="refrigerated">Refrigerated</option>
                <option value="hazmat">Hazmat</option>
                <option value="oversized">Oversized</option>
                <option value="auto">Auto Transport</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Type
              </label>
              <select
                value={filter.pricingType}
                onChange={(e) => setFilter({...filter, pricingType: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="auction">Auction</option>
                <option value="offer">Fixed Offer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="ASSIGNED">Assigned</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={fetchShipments}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <MagnifyingGlassIcon className="h-4 w-4 inline mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Shipments Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.isArray(shipments) && shipments.map((shipment) => (
              <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {shipment.title}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>

                {shipment.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {shipment.description}
                  </p>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="line-clamp-1">{shipment.origin}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="line-clamp-1">{shipment.destination}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Pickup: {formatDate(shipment.pickupDate)}</span>
                  </div>
                  {shipment.weight && (
                    <div className="flex items-center text-sm text-gray-500">
                      <ScaleIcon className="h-4 w-4 mr-2" />
                      <span>{shipment.weight} lbs</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <TruckIcon className="h-4 w-4 mr-2" />
                    <span>{shipment.bids.length} bids</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {shipment.pricingType === 'auction' && shipment.startingBid && (
                      <span>Starting: {formatCurrency(shipment.startingBid)}</span>
                    )}
                    {shipment.pricingType === 'offer' && shipment.offerPrice && (
                      <span>Offer: {formatCurrency(shipment.offerPrice)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>By: {shipment.user.companyName || shipment.user.name}</span>
                  <span>{formatDate(shipment.createdAt)}</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/shipment/${shipment.id}`)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 inline mr-2" />
                    View Details
                  </button>
                  {shipment.pricingType === 'auction' ? (
                    <button
                      onClick={() => router.push(`/shipment/${shipment.id}`)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Place Bid
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/shipment/${shipment.id}`)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Accept Offer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && Array.isArray(shipments) && shipments.length === 0 && (
          <div className="text-center py-12">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  )
}
