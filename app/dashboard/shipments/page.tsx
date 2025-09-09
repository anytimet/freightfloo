'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import ShipmentStatusWidget from '@/components/ShipmentStatusWidget'

interface Shipment {
  id: string
  title: string
  origin: string
  destination: string
  status: string
  pricingType: string
  startingBid?: number
  offerPrice?: number
  pickupDate: string
  deliveryDate?: string
  currentStatus: string
  pickupTime?: string | null
  transitTime?: string | null
  deliveryTime?: string | null
  completionTime?: string | null
  podReceived?: boolean
  bids: Array<{
    id: string
    amount: number
    status: string
    user: {
      name: string
      companyName?: string
    }
  }>
  createdAt: string
}

export default function ShipperShipmentsPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'ALL'
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShipments()
  }, [statusFilter])

  const fetchShipments = async () => {
    try {
      const url = statusFilter === 'ALL' 
        ? '/api/shipments/my-shipments'
        : `/api/shipments/my-shipments?status=${statusFilter}`
      
      const response = await fetch(url)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'ASSIGNED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'CANCELLED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800'
      case 'ASSIGNED':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
            <h1 className="text-2xl font-bold text-gray-900">My Shipments</h1>
            <p className="text-gray-600 mt-1">Manage and track your shipping requests</p>
          </div>
          <a
            href="/shipment/new"
            className="btn-primary"
          >
            Post New Shipment
          </a>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex space-x-4">
            {['ALL', 'ACTIVE', 'ASSIGNED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <a
                key={status}
                href={`/dashboard/shipments${status === 'ALL' ? '' : `?status=${status}`}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status}
              </a>
            ))}
          </div>
        </div>

        {/* Shipments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {shipments.length === 0 ? (
            <div className="p-8 text-center">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
              <p className="text-gray-500 mb-4">
                {statusFilter === 'ALL' 
                  ? "You haven't posted any shipments yet."
                  : `No shipments with status "${statusFilter}".`
                }
              </p>
              {statusFilter === 'ALL' && (
                <a href="/shipment/new" className="btn-primary">
                  Post Your First Shipment
                </a>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(shipment.status)}
                        <h3 className="text-lg font-medium text-gray-900">{shipment.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Route</p>
                          <p className="font-medium">{shipment.origin} → {shipment.destination}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pickup Date</p>
                          <p className="font-medium">{formatDate(shipment.pickupDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pricing</p>
                          <p className="font-medium">
                            {shipment.pricingType === 'auction' 
                              ? `Starting: ${formatCurrency(shipment.startingBid || 0)}`
                              : `Offer: ${formatCurrency(shipment.offerPrice || 0)}`
                            }
                          </p>
                        </div>
                      </div>

                      {/* Bids Summary */}
                      {shipment.bids.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">Bids ({shipment.bids.length})</h4>
                            {getLowestBid(shipment.bids) && (
                              <span className="text-sm text-green-600 font-medium">
                                Lowest: {formatCurrency(getLowestBid(shipment.bids)!)}
                              </span>
                            )}
                          </div>
                          <div className="space-y-2">
                            {shipment.bids.slice(0, 3).map((bid) => (
                              <div key={bid.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {bid.user.companyName || bid.user.name}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{formatCurrency(bid.amount)}</span>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    bid.status === 'ACCEPTED' 
                                      ? 'bg-green-100 text-green-800'
                                      : bid.status === 'REJECTED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {bid.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {shipment.bids.length > 3 && (
                              <p className="text-sm text-gray-500">
                                +{shipment.bids.length - 3} more bids
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Status Widget for Assigned Shipments */}
                      {shipment.status === 'ASSIGNED' && (
                        <div className="mt-4">
                          <ShipmentStatusWidget
                            shipmentId={shipment.id}
                            currentStatus={shipment.currentStatus}
                            pickupTime={shipment.pickupTime}
                            transitTime={shipment.transitTime}
                            deliveryTime={shipment.deliveryTime}
                            completionTime={shipment.completionTime}
                            podReceived={shipment.podReceived}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6 flex space-x-2">
                      <a
                        href={`/shipment/${shipment.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </a>
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
