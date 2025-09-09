'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ReviewDisplay from './ReviewDisplay'
import ReviewForm from './ReviewForm'

interface UserProfileReviewsProps {
  userId: string
  userName: string
  userRole: 'SHIPPER' | 'CARRIER'
  canWriteReview?: boolean
  shipmentId?: string
  tripId?: string
}

interface ReviewData {
  reviews: any[]
  totalReviews: number
  averageRating: number
  ratingBreakdown: { [key: string]: number }
}

export default function UserProfileReviews({
  userId,
  userName,
  userRole,
  canWriteReview = false,
  shipmentId,
  tripId
}: UserProfileReviewsProps) {
  const { data: session } = useSession()
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [userId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?revieweeId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setReviewData(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmitted = (newReview: any) => {
    // Refresh reviews after new review is submitted
    fetchReviews()
  }

  const handleWriteReview = () => {
    setShowReviewForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!reviewData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load reviews</p>
      </div>
    )
  }

  return (
    <div>
      <ReviewDisplay
        reviews={reviewData.reviews}
        averageRating={reviewData.averageRating}
        totalReviews={reviewData.totalReviews}
        ratingBreakdown={reviewData.ratingBreakdown}
        userRole={userRole}
        showWriteReview={canWriteReview && session?.user}
        onWriteReview={handleWriteReview}
      />

      {showReviewForm && (
        <ReviewForm
          revieweeId={userId}
          revieweeName={userName}
          revieweeRole={userRole}
          shipmentId={shipmentId}
          tripId={tripId}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  )
}
