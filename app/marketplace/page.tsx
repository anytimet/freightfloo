'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPinIcon, CalendarIcon, CurrencyDollarIcon, TruckIcon, UserIcon } from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

interface Shipment {
  id: string
  title: string
  description: string | null
  origin: string
  destination: string
  distance: number | null
  weight: number | null
  dimensions: string | null
  pickupDate: string
  deliveryDate: string | null
  pricingType: string
  startingBid: number | null
  offerPrice: number | null
  status: string
  category: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
  }
  bids: Array<{
    id: string
    amount: number
    user: {
      id: string
      name: string | null
    }
  }>
}

export default function MarketplacePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signup?redirect=/marketplace')
    } else if (status === 'authenticated') {
      fetchShipments()
    }
  }, [status, router, filters])

  const fetchShipments = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.origin) params.append('origin', filters.origin)
      if (filters.destination) params.append('destination', filters.destination)
      if (filters.status) params.append('status', filters.status)

      const response = await fetch(`/api/shipments?${params}`)
      const data = await response.json()
      setShipments(data.shipments || [])
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show signup prompt for unauthenticated users
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Join FreightFloo to Browse Shipments
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create your free account to access our marketplace and find freight shipments that match your equipment and routes.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">For Carriers</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li>• Browse available freight shipments</li>
                  <li>• Filter by route and equipment type</li>
                  <li>• Place competitive bids</li>
                  <li>• Track your bid status</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">For Shippers</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li>• Post your freight shipments</li>
                  <li>• Receive competitive quotes</li>
                  <li>• Choose the best carrier</li>
                  <li>• Track your shipments</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup?role=CARRIER" className="btn-primary">
                Sign Up as Carrier
              </Link>
              <Link href="/auth/signup?role=SHIPPER" className="btn-secondary">
                Sign Up as Shipper
              </Link>
            </div>
            
            <p className="mt-6 text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Available Shipments</h1>
          <p className="text-gray-600">Find freight shipments to bid on and grow your business</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin
              </label>
              <input
                type="text"
                placeholder="Enter origin city"
                value={filters.origin}
                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                placeholder="Enter destination city"
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="ACTIVE">Active</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shipments Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {shipment.title}
                  </h3>
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {shipment.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{shipment.origin} → {shipment.destination}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Pickup: {formatDate(shipment.pickupDate)}</span>
                  </div>

                  {shipment.pricingType === 'auction' && shipment.startingBid && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      <span>Starting Bid: {formatCurrency(shipment.startingBid)}</span>
                    </div>
                  )}
                  
                  {shipment.pricingType === 'offer' && shipment.offerPrice && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      <span>Offer Price: {formatCurrency(shipment.offerPrice)}</span>
                    </div>
                  )}

                  {shipment.weight && (
                    <div className="text-sm text-gray-600">
                      Weight: {shipment.weight} lbs
                    </div>
                  )}
                </div>

                {shipment.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {shipment.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {shipment.bids.length} bid{shipment.bids.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/shipment/${shipment.id}`}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </Link>
                    {session && (session.user as any)?.role === 'CARRIER' && (
                      <Link
                        href={`/shipment/${shipment.id}`}
                        className="btn-primary text-sm"
                      >
                        {shipment.pricingType === 'offer' ? 'Accept Offer' : 'Place Bid'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && shipments.length === 0 && (
          <div className="text-center py-12">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
