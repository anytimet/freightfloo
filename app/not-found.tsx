'use client'

import { useRouter } from 'next/navigation'
import { HomeIcon, ArrowLeftIcon, TruckIcon } from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <TruckIcon className="h-32 w-32 text-gray-300" />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-2xl font-bold rounded-full h-12 w-12 flex items-center justify-center">
                4
              </div>
              <div className="absolute -bottom-2 -left-2 bg-red-500 text-white text-2xl font-bold rounded-full h-12 w-12 flex items-center justify-center">
                4
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Oops!
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            The page you're looking for seems to have taken a detour. Don't worry, 
            our freight experts are here to help you get back on track!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Go Home
            </button>
            
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TruckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Shipments</h3>
              <p className="text-gray-600">Browse available freight loads</p>
              <button
                onClick={() => router.push('/marketplace')}
                className="mt-2 text-blue-600 hover:text-blue-500 font-medium"
              >
                Browse Marketplace →
              </button>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Post a Load</h3>
              <p className="text-gray-600">List your shipment for carriers</p>
              <button
                onClick={() => router.push('/shipment/new')}
                className="mt-2 text-green-600 hover:text-green-500 font-medium"
              >
                Create Shipment →
              </button>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Help</h3>
              <p className="text-gray-600">Need assistance? We're here to help</p>
              <button
                onClick={() => router.push('/help')}
                className="mt-2 text-purple-600 hover:text-purple-500 font-medium"
              >
                Help Center →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}