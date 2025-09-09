'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  TruckIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalShipments?: number
  activeShipments?: number
  totalBids?: number
  pendingBids?: number
  totalTrucks?: number
  availableTrucks?: number
  totalDrivers?: number
  availableDrivers?: number
  totalTrips?: number
  activeTrips?: number
  totalRevenue?: number
  monthlyRevenue?: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({})
  const [loading, setLoading] = useState(true)

  const userRole = (session?.user as any)?.role || 'SHIPPER'

  useEffect(() => {
    fetchDashboardStats()
  }, [userRole])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`/api/dashboard/stats?role=${userRole}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getShipperStats = () => [
    {
      name: 'Total Shipments',
      value: stats.totalShipments || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
      href: '/dashboard/shipments'
    },
    {
      name: 'Active Shipments',
      value: stats.activeShipments || 0,
      icon: ClockIcon,
      color: 'bg-green-500',
      href: '/dashboard/shipments?status=ACTIVE'
    },
    {
      name: 'Total Bids Received',
      value: stats.totalBids || 0,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      href: '/dashboard/shipments'
    },
    {
      name: 'Pending Bids',
      value: stats.pendingBids || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-orange-500',
      href: '/dashboard/shipments?status=PENDING'
    }
  ]

  const getCarrierStats = () => [
    {
      name: 'Total Trucks',
      value: stats.totalTrucks || 0,
      icon: TruckIcon,
      color: 'bg-blue-500',
      href: '/dashboard/fleet'
    },
    {
      name: 'Available Trucks',
      value: stats.availableTrucks || 0,
      icon: TruckIcon,
      color: 'bg-green-500',
      href: '/dashboard/fleet?status=AVAILABLE'
    },
    {
      name: 'Total Drivers',
      value: stats.totalDrivers || 0,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      href: '/dashboard/drivers'
    },
    {
      name: 'Active Trips',
      value: stats.activeTrips || 0,
      icon: ClockIcon,
      color: 'bg-orange-500',
      href: '/dashboard/trips?status=IN_PROGRESS'
    },
    {
      name: 'Total Revenue',
      value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-600',
      href: '/dashboard/analytics'
    },
    {
      name: 'Monthly Revenue',
      value: `$${(stats.monthlyRevenue || 0).toLocaleString()}`,
      icon: ChartBarIcon,
      color: 'bg-blue-600',
      href: '/dashboard/analytics'
    }
  ]

  const getAdminStats = () => [
    {
      name: 'Total Shipments',
      value: stats.totalShipments || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
      href: '/dashboard/admin/shipments'
    },
    {
      name: 'Total Carriers',
      value: stats.totalTrucks || 0,
      icon: UserGroupIcon,
      color: 'bg-green-500',
      href: '/dashboard/admin/carriers'
    },
    {
      name: 'Active Trips',
      value: stats.activeTrips || 0,
      icon: ClockIcon,
      color: 'bg-orange-500',
      href: '/dashboard/admin/trips'
    },
    {
      name: 'System Revenue',
      value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
      href: '/dashboard/admin/reports'
    }
  ]

  const getStatsForRole = () => {
    switch (userRole) {
      case 'SHIPPER':
        return getShipperStats()
      case 'CARRIER':
        return getCarrierStats()
      case 'ADMIN':
        return getAdminStats()
      default:
        return getShipperStats()
    }
  }

  const getWelcomeMessage = () => {
    const name = (session?.user as any)?.name || 'User'
    switch (userRole) {
      case 'SHIPPER':
        return `Welcome back, ${name}! Manage your shipments and track deliveries.`
      case 'CARRIER':
        return `Welcome back, ${name}! Monitor your fleet and find new opportunities.`
      case 'ADMIN':
        return `Welcome back, ${name}! Oversee the platform and system performance.`
      default:
        return `Welcome back, ${name}!`
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">{getWelcomeMessage()}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getStatsForRole().map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => window.location.href = stat.href}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRole === 'SHIPPER' && (
              <>
                <a
                  href="/shipment/new"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Post New Shipment</p>
                    <p className="text-sm text-gray-500">Create a new shipping request</p>
                  </div>
                </a>
                <a
                  href="/dashboard/shipments"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ClockIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">View My Shipments</p>
                    <p className="text-sm text-gray-500">Track your active shipments</p>
                  </div>
                </a>
                <a
                  href="/dashboard/carriers"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserGroupIcon className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Browse Carriers</p>
                    <p className="text-sm text-gray-500">Find trusted carriers</p>
                  </div>
                </a>
              </>
            )}
            
            {userRole === 'CARRIER' && (
              <>
                <a
                  href="/dashboard/browse-shipments"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Browse Shipments</p>
                    <p className="text-sm text-gray-500">Find new opportunities</p>
                  </div>
                </a>
                <a
                  href="/dashboard/fleet"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TruckIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Fleet</p>
                    <p className="text-sm text-gray-500">View and manage trucks</p>
                  </div>
                </a>
                <a
                  href="/dashboard/drivers"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserGroupIcon className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Drivers</p>
                    <p className="text-sm text-gray-500">View driver information</p>
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}