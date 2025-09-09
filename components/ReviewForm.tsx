'use client'

import { useState } from 'react'
import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface ReviewFormProps {
  revieweeId: string
  revieweeName: string
  revieweeRole: 'SHIPPER' | 'CARRIER'
  shipmentId?: string
  tripId?: string
  onReviewSubmitted: (review: any) => void
  onClose: () => void
}

const ratingCategories = {
  SHIPPER: [
    { key: 'communicationRating', label: 'Communication', description: 'How well did they communicate?' },
    { key: 'timelinessRating', label: 'Timeliness', description: 'Were they on time for pickup/delivery?' },
    { key: 'professionalismRating', label: 'Professionalism', description: 'How professional was their service?' },
    { key: 'valueRating', label: 'Value', description: 'Was the service worth the price?' }
  ],
  CARRIER: [
    { key: 'communicationRating', label: 'Communication', description: 'How well did they communicate?' },
    { key: 'timelinessRating', label: 'Timeliness', description: 'Were they ready for pickup/delivery?' },
    { key: 'professionalismRating', label: 'Professionalism', description: 'How professional were they?' },
    { key: 'valueRating', label: 'Value', description: 'Was the price fair for the service?' }
  ]
}

export default function ReviewForm({
  revieweeId,
  revieweeName,
  revieweeRole,
  shipmentId,
  tripId,
  onReviewSubmitted,
  onClose
}: ReviewFormProps) {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    communicationRating: 0,
    timelinessRating: 0,
    professionalismRating: 0,
    valueRating: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRatingChange = (category: string, rating: number) => {
    setFormData(prev => ({ ...prev, [category]: rating }))
    
    // Auto-calculate overall rating as average of all categories
    const newData = { ...formData, [category]: rating }
    const ratings = [
      newData.communicationRating,
      newData.timelinessRating,
      newData.professionalismRating,
      newData.valueRating
    ].filter(r => r > 0)
    
    if (ratings.length > 0) {
      const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      setFormData(prev => ({ ...prev, rating: Math.round(average) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          revieweeId,
          rating: formData.rating,
          comment: formData.comment,
          communicationRating: formData.communicationRating,
          timelinessRating: formData.timelinessRating,
          professionalismRating: formData.professionalismRating,
          valueRating: formData.valueRating,
          shipmentId,
          tripId
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      onReviewSubmitted(data.review)
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    size = 'h-6 w-6' 
  }: { 
    rating: number
    onRatingChange: (rating: number) => void
    size?: string
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            {star <= rating ? (
              <StarIconSolid className={`${size} text-yellow-400`} />
            ) : (
              <StarIcon className={`${size} text-gray-300`} />
            )}
          </button>
        ))}
      </div>
    )
  }

  const categories = ratingCategories[revieweeRole]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
              <p className="text-sm text-gray-600 mt-1">
                Review {revieweeName} ({revieweeRole.toLowerCase()})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating *
              </label>
              <div className="flex items-center space-x-4">
                <StarRating 
                  rating={formData.rating} 
                  onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                  size="h-8 w-8"
                />
                <span className="text-sm text-gray-600">
                  {formData.rating > 0 ? `${formData.rating} out of 5` : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Detailed Ratings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Ratings</h3>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {category.label}
                      </label>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                    <StarRating
                      rating={formData[category.key as keyof typeof formData] as number}
                      onRatingChange={(rating) => handleRatingChange(category.key, rating)}
                      size="h-5 w-5"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder={`Share your experience with ${revieweeName}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Help others by sharing your experience (optional)
              </p>
            </div>

            {/* Review Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be honest and constructive in your feedback</li>
                <li>• Focus on the service provided, not personal characteristics</li>
                <li>• Avoid inappropriate language or personal attacks</li>
                <li>• Your review will be visible to other users</li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || formData.rating === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
