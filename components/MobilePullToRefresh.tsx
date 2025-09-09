'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'

interface MobilePullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  className?: string
}

export default function MobilePullToRefresh({
  children,
  onRefresh,
  className = ''
}: MobilePullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  const maxPullDistance = 80
  const refreshThreshold = 60

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return

    currentY.current = e.touches[0].clientY
    const distance = Math.max(0, currentY.current - startY.current)
    
    if (distance > 0) {
      e.preventDefault()
      setPullDistance(Math.min(distance, maxPullDistance))
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling || isRefreshing) return

    setIsPulling(false)

    if (pullDistance >= refreshThreshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }

  const getRefreshIconRotation = () => {
    if (isRefreshing) return 'animate-spin'
    if (pullDistance >= refreshThreshold) return 'rotate-180'
    return ''
  }

  const getRefreshIconOpacity = () => {
    return Math.min(1, pullDistance / refreshThreshold)
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-blue-50 text-blue-600 transition-all duration-200"
        style={{
          height: `${Math.max(0, pullDistance)}px`,
          opacity: isPulling || isRefreshing ? 1 : 0
        }}
      >
        <div className="flex items-center space-x-2">
          <svg
            className={`w-5 h-5 transition-all duration-200 ${getRefreshIconRotation()}`}
            style={{ opacity: getRefreshIconOpacity() }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : pullDistance >= refreshThreshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${Math.max(0, pullDistance)}px)`
        }}
      >
        {children}
      </div>
    </div>
  )
}
