'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/react/24/outline'

interface AdminStats {
  totalUsers: number
  totalShipments: number
  activeShipments: number
  completedShipments: number
  totalBids: number
  totalRevenue: number
  monthlyRevenue: number
  totalCarriers: number
  totalShippers: number
  pendingApprovals: number
  systemAlerts: number
  averageBidAmount: number
  conversionRate: number
}

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<AdminStats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const statsCards = [
    {
      name: 'Total Users',
      value: formatNumber(stats.totalUsers || 0),
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      href: '/dashboard/admin/users'
    },
    {
      name: 'Total Shipments',
      value: formatNumber(stats.totalShipments || 0),
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
      href: '/dashboard/admin/shipments'
    },
    {
      name: 'Active Shipments',
      value: formatNumber(stats.activeShipments || 0),
      icon: ClockIcon,
      color: 'bg-yellow-500',
      href: '/dashboard/admin/shipments?status=ACTIVE'
    },
    {
      name: 'Completed Shipments',
      value: formatNumber(stats.completedShipments || 0),
      icon: CheckCircleIcon,
      color: 'bg-green-600',
      href: '/dashboard/admin/shipments?status=COMPLETED'
    },
    {
      name: 'Total Bids',
      value: formatNumber(stats.totalBids || 0),
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
      href: '/dashboard/admin/bids'
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue || 0),
      icon: ChartBarIcon,
      color: 'bg-indigo-500',
      href: '/dashboard/admin/reports'
    },
    {
      name: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue || 0),
      icon: ChartBarIcon,
      color: 'bg-blue-600',
      href: '/dashboard/admin/reports'
    },
    {
      name: 'Total Carriers',
      value: formatNumber(stats.totalCarriers || 0),
      icon: TruckIcon,
      color: 'bg-orange-500',
      href: '/dashboard/admin/carriers'
    },
    {
      name: 'Total Shippers',
      value: formatNumber(stats.totalShippers || 0),
      icon: UserGroupIcon,
      color: 'bg-teal-500',
      href: '/dashboard/admin/shippers'
    },
    {
      name: 'Pending Approvals',
      value: formatNumber(stats.pendingApprovals || 0),
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      href: '/dashboard/admin/approvals'
    },
    {
      name: 'System Alerts',
      value: formatNumber(stats.systemAlerts || 0),
      icon: BellIcon,
      color: 'bg-red-600',
      href: '/dashboard/admin/alerts'
    },
    {
      name: 'Avg Bid Amount',
      value: formatCurrency(stats.averageBidAmount || 0),
      icon: CurrencyDollarIcon,
      color: 'bg-emerald-500',
      href: '/dashboard/admin/reports'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and system management</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = stat.href}
          >
            <div className="flex items-center">
              <div className={`p-3 ${stat.color} rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/dashboard/admin/users'}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserGroupIcon className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium">Manage Users</span>
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/admin/shipments'}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ClipboardDocumentListIcon className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-sm font-medium">View All Shipments</span>
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/admin/reports'}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChartBarIcon className="h-5 w-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium">System Reports</span>
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/admin/settings'}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5 text-gray-600 mr-3" />
            <span className="text-sm font-medium">System Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">New shipment posted by shipper</span>
            </div>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Carrier placed bid on shipment</span>
            </div>
            <span className="text-xs text-gray-500">5 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Payment completed for shipment</span>
            </div>
            <span className="text-xs text-gray-500">10 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">New carrier registration</span>
            </div>
            <span className="text-xs text-gray-500">15 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
