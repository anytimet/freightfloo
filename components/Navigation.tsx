'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Bars3Icon, XMarkIcon, TruckIcon } from '@heroicons/react/24/outline'
import NotificationBell from './NotificationBell'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="FreightFloo Logo"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // Fallback to TruckIcon if logo doesn't exist
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling.style.display = 'block'
                  }}
                />
                <TruckIcon className="h-6 w-6 text-primary-600 hidden" />
              </div>
              <span className="text-xl font-bold text-gray-900">FreightFloo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse-shipments" className="text-gray-700 hover:text-primary-600 transition-colors">
              Browse Shipments
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">
              How it Works
            </Link>
            <Link href="/business" className="text-gray-700 hover:text-primary-600 transition-colors">
              Business
            </Link>
            <Link href="/carrier" className="text-gray-700 hover:text-primary-600 transition-colors">
              Carrier
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/payments" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Payments
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Sign Out
                </button>
                <Link href="/shipment/new" className="btn-primary">
                  Post Shipment
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white">
              {/* Mobile Notification Bell */}
              {session && (
                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                  <NotificationBell />
                </div>
              )}
              
              <Link 
                href="/browse-shipments" 
                className="block px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Browse Shipments
              </Link>
              <Link 
                href="/how-it-works" 
                className="block px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How it Works
              </Link>
              <Link 
                href="/business" 
                className="block px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Business
              </Link>
              <Link 
                href="/carrier" 
                className="block px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Carrier
              </Link>
              {session ? (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link 
                    href="/dashboard" 
                    className="block px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/payments" 
                    className="block px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Payments
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                  <Link href="/shipment/new" className="block px-3 py-2" onClick={() => setIsOpen(false)}>
                    <span className="btn-primary w-full text-center">Post Shipment</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link 
                    href="/auth/signin" 
                    className="block px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="block px-3 py-2" onClick={() => setIsOpen(false)}>
                    <span className="btn-primary w-full text-center">Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
