'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  UserGroupIcon,
  ClockIcon,
  MapIcon,
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  revenue: {
    total: number
    monthly: number
    weekly: number
    daily: number
    growth: number
  }
  trips: {
    total: number
    completed: number
    inProgress: number
    averageDuration: number
    growth: number
  }
  fleet: {
    totalTrucks: number
    availableTrucks: number
    utilizationRate: number
    averageMileage: number
  }
  drivers: {
    total: number
    available: number
    onTrip: number
    averageHours: number
  }
  monthlyData: Array<{
    month: string
    revenue: number
    trips: number
    mileage: number
  }>
  topRoutes: Array<{
    route: string
    trips: number
    revenue: number
  }>
  costBreakdown: {
    fuel: number
    maintenance: number
    insurance: number
    other: number
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <span className="text-green-500 mr-1">↗</span>
    ) : (
      <span className="text-red-500 mr-1">↘</span>
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
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

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
          <p className="text-gray-500">Start creating trips to see your analytics.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your fleet performance and business metrics</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
              { value: '1y', label: '1 Year' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.revenue.total)}
                </p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(analytics.revenue.growth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(analytics.revenue.growth)}`}>
                    {formatPercentage(analytics.revenue.growth)}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-500">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Trips */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analytics.trips.total)}
                </p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(analytics.trips.growth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(analytics.trips.growth)}`}>
                    {formatPercentage(analytics.trips.growth)}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-500">
                <MapIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Fleet Utilization */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fleet Utilization</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.fleet.utilizationRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {analytics.fleet.availableTrucks}/{analytics.fleet.totalTrucks} trucks available
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500">
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Driver Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Driver Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.drivers.averageHours.toFixed(1)}h
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {analytics.drivers.onTrip}/{analytics.drivers.total} drivers on trip
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-sm text-gray-400">Integration with Chart.js or similar</p>
              </div>
            </div>
          </div>

          {/* Trip Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Trips</span>
                <span className="font-medium">{analytics.trips.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-medium">{analytics.trips.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Duration</span>
                <span className="font-medium">{analytics.trips.averageDuration.toFixed(1)}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Mileage</span>
                <span className="font-medium">{formatNumber(analytics.fleet.averageMileage)} mi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Routes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Routes</h3>
            <div className="space-y-3">
              {analytics.topRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{route.route}</p>
                    <p className="text-sm text-gray-500">{route.trips} trips</p>
                  </div>
                  <span className="font-medium text-green-600">
                    {formatCurrency(route.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fuel</span>
                <span className="font-medium">{formatCurrency(analytics.costBreakdown.fuel)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Maintenance</span>
                <span className="font-medium">{formatCurrency(analytics.costBreakdown.maintenance)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Insurance</span>
                <span className="font-medium">{formatCurrency(analytics.costBreakdown.insurance)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Other</span>
                <span className="font-medium">{formatCurrency(analytics.costBreakdown.other)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Costs</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(
                      analytics.costBreakdown.fuel +
                      analytics.costBreakdown.maintenance +
                      analytics.costBreakdown.insurance +
                      analytics.costBreakdown.other
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(analytics.revenue.monthly)}
              </p>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(analytics.revenue.weekly)}
              </p>
              <p className="text-sm text-gray-500">Weekly Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(analytics.revenue.daily)}
              </p>
              <p className="text-sm text-gray-500">Daily Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {analytics.trips.total > 0 ? formatCurrency(analytics.revenue.total / analytics.trips.total) : '$0'}
              </p>
              <p className="text-sm text-gray-500">Revenue per Trip</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
