'use client'

import { ReactNode } from 'react'

interface MobileCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  clickable?: boolean
}

export default function MobileCard({ 
  children, 
  className = '', 
  onClick,
  clickable = false 
}: MobileCardProps) {
  const baseClasses = "bg-white rounded-lg shadow-sm border border-gray-200 p-4"
  const clickableClasses = clickable || onClick ? "cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]" : ""
  
  return (
    <div 
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
