'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  HomeIcon,
  TruckIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  MapIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  roles: string[]
  badge?: number
}

const sidebarItems: SidebarItem[] = [
  // Common items for all roles
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: ['SHIPPER', 'CARRIER', 'ADMIN']
  },
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    icon: BellIcon,
    roles: ['SHIPPER', 'CARRIER', 'ADMIN']
  },
  
  // Shipper specific items
  {
    name: 'My Shipments',
    href: '/dashboard/shipments',
    icon: ClipboardDocumentListIcon,
    roles: ['SHIPPER']
  },
  {
    name: 'Post Shipment',
    href: '/shipment/new',
    icon: DocumentTextIcon,
    roles: ['SHIPPER']
  },
  {
    name: 'Browse Carriers',
    href: '/dashboard/carriers',
    icon: UserGroupIcon,
    roles: ['SHIPPER']
  },
  
  // Carrier specific items
  {
    name: 'Browse Shipments',
    href: '/browse-shipments',
    icon: MapIcon,
    roles: ['CARRIER']
  },
  {
    name: 'My Bids',
    href: '/dashboard/bids',
    icon: CurrencyDollarIcon,
    roles: ['CARRIER']
  },
  {
    name: 'Fleet Management',
    href: '/dashboard/fleet',
    icon: TruckIcon,
    roles: ['CARRIER']
  },
  {
    name: 'Drivers',
    href: '/dashboard/drivers',
    icon: UserGroupIcon,
    roles: ['CARRIER']
  },
  {
    name: 'Trips',
    href: '/dashboard/trips',
    icon: MapIcon,
    roles: ['CARRIER']
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    roles: ['CARRIER']
  },
  
  // Admin items
  {
    name: 'Admin Dashboard',
    href: '/dashboard/admin',
    icon: HomeIcon,
    roles: ['ADMIN']
  },
  {
    name: 'User Management',
    href: '/dashboard/admin/users',
    icon: UserGroupIcon,
    roles: ['ADMIN']
  },
  {
    name: 'All Shipments',
    href: '/dashboard/admin/shipments',
    icon: ClipboardDocumentListIcon,
    roles: ['ADMIN']
  },
  {
    name: 'All Carriers',
    href: '/dashboard/admin/carriers',
    icon: UserGroupIcon,
    roles: ['ADMIN']
  },
  {
    name: 'System Reports',
    href: '/dashboard/admin/reports',
    icon: ChartBarIcon,
    roles: ['ADMIN']
  },
  
  // Common settings
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: CogIcon,
    roles: ['SHIPPER', 'CARRIER', 'ADMIN']
  }
]

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session?.user) return null

  const userRole = (session.user as any).role || 'SHIPPER'
  const filteredItems = sidebarItems.filter(item => item.roles.includes(userRole))

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200"
        >
          {mobileOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } ${
        mobileOpen ? 'fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto' : 'hidden lg:block'
      }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">FreightFloo</h2>
              <p className="text-sm text-gray-500 capitalize">{userRole.toLowerCase()} Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

        {/* User Info */}
        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {(session.user as any).name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {(session.user as any).name || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userRole.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
