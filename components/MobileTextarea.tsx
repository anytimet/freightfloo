'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'

interface MobileTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

const MobileTextarea = forwardRef<HTMLTextAreaElement, MobileTextareaProps>(({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const baseClasses = "block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
  const errorClasses = error ? "border-red-300 focus:ring-red-500" : ""
  const widthClasses = fullWidth ? "w-full" : ""
  
  return (
    <div className={widthClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

MobileTextarea.displayName = 'MobileTextarea'

export default MobileTextarea
