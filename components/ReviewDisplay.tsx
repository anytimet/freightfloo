'use client'

import { useState } from 'react'
import { StarIcon, StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { 
  ChatBubbleLeftIcon, 
  CalendarIcon, 
  CheckBadgeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Review {
  id: string
  rating: number
  comment: string | null
  communicationRating: number | null
  timelinessRating: number | null
  professionalismRating: number | null
  valueRating: number | null
  reviewType: string
  isVerified: boolean
  isPublic: boolean
  createdAt: string
  reviewer: {
    id: string
    name: string
    role: string
  }
  reviewee: {
    id: string
    name: string
    role: string
  }
  shipment?: {
    id: string
    title: string
  }
}

interface ReviewDisplayProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  ratingBreakdown: {
    [key: string]: number
  }
  userRole: 'SHIPPER' | 'CARRIER'
  showWriteReview?: boolean
  onWriteReview?: () => void
}

export default function ReviewDisplay({
  reviews,
  averageRating,
  totalReviews,
  ratingBreakdown,
  userRole,
  showWriteReview = false,
  onWriteReview
}: ReviewDisplayProps) {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [filterRating, setFilterRating] = useState<number | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const StarRating = ({ rating, size = 'h-4 w-4' }: { rating: number, size?: string }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIconSolid className={`${size} text-yellow-400`} />
            ) : (
              <StarIconOutline className={`${size} text-gray-300`} />
            )}
          </span>
        ))}
      </div>
    )
  }

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    }
    return labels[rating as keyof typeof labels] || ''
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'communicationRating': 'Communication',
      'timelinessRating': 'Timeliness',
      'professionalismRating': 'Professionalism',
      'valueRating': 'Value'
    }
    return labels[category] || category
  }

  const filteredReviews = filterRating 
    ? reviews.filter(review => review.rating === filterRating)
    : reviews

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reviews & Ratings</h3>
            <p className="text-sm text-gray-600">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
          {showWriteReview && onWriteReview && (
            <button
              onClick={onWriteReview}
              className="btn-primary"
            >
              Write Review
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(averageRating)} size="h-6 w-6" />
            <p className="text-sm text-gray-600 mt-1">
              {getRatingLabel(Math.round(averageRating))}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingBreakdown[rating] || 0
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              
              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-8">{rating}</span>
                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Review Filters */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-3 py-1 text-sm rounded-full ${
              filterRating === null
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Reviews
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilterRating(rating)}
              className={`px-3 py-1 text-sm rounded-full ${
                filterRating === rating
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {rating} Star{rating !== 1 ? 's' : ''} ({ratingBreakdown[rating] || 0})
            </button>
          ))}
        </div>
      )}

      {/* Reviews List */}
      {displayedReviews.length > 0 ? (
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {review.reviewer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{review.reviewer.name}</h4>
                      {review.isVerified && (
                        <CheckBadgeIcon className="h-4 w-4 text-green-500" title="Verified Review" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(review.createdAt)}</span>
                      <span>•</span>
                      <span className="capitalize">{review.reviewer.role.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={review.rating} />
                  <p className="text-sm text-gray-600 mt-1">
                    {getRatingLabel(review.rating)}
                  </p>
                </div>
              </div>

              {/* Detailed Ratings */}
              {(review.communicationRating || review.timelinessRating || 
                review.professionalismRating || review.valueRating) && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Detailed Ratings</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'communicationRating', value: review.communicationRating },
                      { key: 'timelinessRating', value: review.timelinessRating },
                      { key: 'professionalismRating', value: review.professionalismRating },
                      { key: 'valueRating', value: review.valueRating }
                    ].map(({ key, value }) => (
                      value && (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {getCategoryLabel(key)}
                          </span>
                          <StarRating rating={value} size="h-3 w-3" />
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Review Comment */}
              {review.comment && (
                <div className="mb-3">
                  <div className="flex items-start space-x-2">
                    <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              )}

              {/* Shipment Reference */}
              {review.shipment && (
                <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                  Review for: {review.shipment.title}
                </div>
              )}
            </div>
          ))}

          {/* Show More/Less Button */}
          {reviews.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showAllReviews 
                  ? `Show Less (${reviews.length - 3} hidden)`
                  : `Show All Reviews (${reviews.length - 3} more)`
                }
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500 mb-4">
            {filterRating 
              ? `No ${filterRating}-star reviews found.`
              : 'Be the first to leave a review!'
            }
          </p>
          {showWriteReview && onWriteReview && !filterRating && (
            <button
              onClick={onWriteReview}
              className="btn-primary"
            >
              Write First Review
            </button>
          )}
        </div>
      )}
    </div>
  )
}
