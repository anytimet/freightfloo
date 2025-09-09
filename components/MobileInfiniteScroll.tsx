'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface MobileInfiniteScrollProps {
  children: ReactNode
  hasMore: boolean
  loadMore: () => void
  loading?: boolean
  threshold?: number
  className?: string
}

export default function MobileInfiniteScroll({
  children,
  hasMore,
  loadMore,
  loading = false,
  threshold = 200,
  className = ''
}: MobileInfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !hasMore || loading || isLoading) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      if (distanceFromBottom <= threshold) {
        setIsLoading(true)
        loadMore()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [hasMore, loading, isLoading, threshold, loadMore])

  useEffect(() => {
    if (!loading) {
      setIsLoading(false)
    }
  }, [loading])

  return (
    <div ref={containerRef} className={`overflow-y-auto ${className}`}>
      {children}
      
      {/* Loading Indicator */}
      {(loading || isLoading) && (
        <div ref={loadingRef} className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm">Loading more...</span>
          </div>
        </div>
      )}
      
      {/* End of List Indicator */}
      {!hasMore && (
        <div className="flex justify-center items-center py-8">
          <div className="text-sm text-gray-500">
            You've reached the end of the list
          </div>
        </div>
      )}
    </div>
  )
}
