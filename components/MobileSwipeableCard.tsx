'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'

interface SwipeAction {
  label: string
  color: string
  icon?: ReactNode
  action: () => void
}

interface MobileSwipeableCardProps {
  children: ReactNode
  leftActions?: SwipeAction[]
  rightActions?: SwipeAction[]
  className?: string
}

export default function MobileSwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  className = ''
}: MobileSwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const maxSwipeDistance = 120

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const deltaX = e.touches[0].clientX - startX
    const newTranslateX = Math.max(
      -maxSwipeDistance,
      Math.min(maxSwipeDistance, deltaX)
    )
    
    setTranslateX(newTranslateX)
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Determine if we should trigger an action or snap back
    if (Math.abs(translateX) > 60) {
      if (translateX > 0 && leftActions.length > 0) {
        // Swiped right - trigger first left action
        leftActions[0].action()
      } else if (translateX < 0 && rightActions.length > 0) {
        // Swiped left - trigger first right action
        rightActions[0].action()
      }
    }
    
    // Snap back to center
    setTranslateX(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setCurrentX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - startX
    const newTranslateX = Math.max(
      -maxSwipeDistance,
      Math.min(maxSwipeDistance, deltaX)
    )
    
    setTranslateX(newTranslateX)
    setCurrentX(e.clientX)
  }

  const handleMouseUp = () => {
    handleTouchEnd()
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, startX])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center bg-green-500 text-white px-4">
          {leftActions[0].icon}
          <span className="ml-2 font-medium">{leftActions[0].label}</span>
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center bg-red-500 text-white px-4">
          <span className="mr-2 font-medium">{rightActions[0].label}</span>
          {rightActions[0].icon}
        </div>
      )}

      {/* Card Content */}
      <div
        ref={cardRef}
        className="relative bg-white transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(${translateX}px)`,
          touchAction: 'pan-y'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>
    </div>
  )
}
