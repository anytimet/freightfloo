'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MapPinIcon, CalendarIcon, CurrencyDollarIcon, ScaleIcon } from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'
import AddressAutocomplete from '@/components/AddressAutocomplete'
import { trackShipmentCreated } from '@/lib/analytics'

export default function NewShipmentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Get today's date in YYYY-MM-DD format for date picker min
  const today = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    origin: '',
    destination: '',
    distance: '',
    weight: '',
    dimensions: '',
    pickupDate: '',
    deliveryDate: '',
    pricingType: 'auction', // 'auction' or 'offer'
    startingBid: '',
    offerPrice: '',
    category: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          distance: formData.distance ? parseFloat(formData.distance) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          startingBid: formData.startingBid ? parseFloat(formData.startingBid) : null,
          offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
        }),
      })

      if (response.ok) {
        const shipment = await response.json()
        // Track shipment creation
        trackShipmentCreated(shipment.id, (session?.user as any)?.role || 'SHIPPER')
        router.push(`/shipment/${shipment.id}`)
      } else {
        const data = await response.json()
        if (response.status === 401) {
          // Session expired, redirect to sign in
          router.push('/auth/signin?redirect=/shipment/new')
        } else {
          setError(data.message || 'An error occurred')
        }
      }
    } catch (error) {
      console.error('Shipment creation error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to post a shipment.</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post a Shipment</h1>
          <p className="text-gray-600">Describe your freight and get competitive quotes from carriers.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Shipment Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Furniture from NYC to LA"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select a category</option>
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Automotive">Automotive</option>
                <option value="General Freight">General Freight</option>
                <option value="Hazardous Materials">Hazardous Materials</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Construction Materials">Construction Materials</option>
                <option value="Textiles">Textiles</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your shipment in detail..."
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                  Origin Address *
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <AddressAutocomplete
                    value={formData.origin}
                    onChange={(value) => setFormData(prev => ({ ...prev, origin: value }))}
                    placeholder="e.g., 123 Main St, New York, NY 10001"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Address *
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <AddressAutocomplete
                    value={formData.destination}
                    onChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}
                    placeholder="e.g., 456 Oak Ave, Los Angeles, CA 90210"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="pickupDate"
                    name="pickupDate"
                    required
                    min={today}
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    min={today}
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <div className="relative">
                  <ScaleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder="L x W x H"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pricingType" className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Type *
              </label>
              <select
                id="pricingType"
                name="pricingType"
                required
                value={formData.pricingType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="auction">Auction (Carriers can bid lower)</option>
                <option value="offer">Fixed Offer (Carriers accept or decline)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.pricingType === 'auction' ? (
                <div>
                  <label htmlFor="startingBid" className="block text-sm font-medium text-gray-700 mb-2">
                    Starting Bid ($) *
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="startingBid"
                      name="startingBid"
                      required
                      value={formData.startingBid}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="input-field pl-10"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Carriers can bid lower than this amount
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Price ($) *
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="offerPrice"
                      name="offerPrice"
                      required
                      value={formData.offerPrice}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="input-field pl-10"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Fixed price - carriers can accept or decline
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting...' : 'Post Shipment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
