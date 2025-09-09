'use client'

import { ReactNode } from 'react'

interface MobileFormWrapperProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function MobileFormWrapper({ 
  children, 
  title, 
  description 
}: MobileFormWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        {title && (
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        )}
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>

      {/* Form Content */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
