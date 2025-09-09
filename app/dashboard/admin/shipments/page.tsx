'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface Shipment {
  id: string
  title: string
  description: string
  pickupAddress: string
  deliveryAddress: string
  status: string
  pricingType: string
  startingBid?: number
  offerPrice?: number
  createdAt: string
  user: {
    name: string
    email: string
  }
  bids: {
    id: string
    amount: number
    status: string
    user: {
      name: string
    }
  }[]
}

export default function AdminShipmentsPage() {
  const { data: session } = useSession()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [pricingFilter, setPricingFilter] = useState('ALL')

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      const response = await fetch('/api/admin/shipments')
      if (response.ok) {
        const data = await response.json()
        setShipments(data)
      }
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || shipment.status === statusFilter
    const matchesPricing = pricingFilter === 'ALL' || shipment.pricingType === pricingFilter
    
    return matchesSearch && matchesStatus && matchesPricing
  })

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
      case 'PICKED_UP': return 'bg-purple-100 text-purple-800'
      case 'IN_TRANSIT': return 'bg-indigo-100 text-indigo-800'
      case 'DELIVERED': return 'bg-orange-100 text-orange-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Shipments</h1>
          <p className="text-gray-600">Monitor and manage all platform shipments</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Shipments: {shipments.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Shipments
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or shipper..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pricing Type
            </label>
            <select
              value={pricingFilter}
              onChange={(e) => setPricingFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="auction">Auction</option>
              <option value="offer">Fixed Offer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredShipments.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {shipment.title}
              </h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                {shipment.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {shipment.description}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span className="line-clamp-1">{shipment.pickupAddress}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span className="line-clamp-1">{shipment.deliveryAddress}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Posted {formatDate(shipment.createdAt)}</span>
              </div>
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
              <span>By: {shipment.user.name}</span>
              <span>{shipment.user.email}</span>
            </div>

            {shipment.bids.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Bids:</h4>
                <div className="space-y-1">
                  {shipment.bids.slice(0, 3).map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{bid.user.name}</span>
                      <span className="font-medium">{formatCurrency(bid.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = `/shipment/${shipment.id}`}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <EyeIcon className="h-4 w-4 inline mr-2" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredShipments.length === 0 && (
        <div className="text-center py-8">
          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No shipments found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
