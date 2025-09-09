'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'

interface MobileSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
}

const MobileSelect = forwardRef<HTMLSelectElement, MobileSelectProps>(({
  label,
  error,
  helperText,
  fullWidth = true,
  options,
  placeholder,
  className = '',
  ...props
}, ref) => {
  const baseClasses = "block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
  const errorClasses = error ? "border-red-300 focus:ring-red-500" : ""
  const widthClasses = fullWidth ? "w-full" : ""
  
  return (
    <div className={widthClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

MobileSelect.displayName = 'MobileSelect'

export default MobileSelect
