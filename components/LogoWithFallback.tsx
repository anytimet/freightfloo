'use client'

import Image from 'next/image'
import { TruckIcon } from '@heroicons/react/24/outline'

interface LogoWithFallbackProps {
  className?: string
  alt?: string
  fallbackIconClassName?: string
}

export default function LogoWithFallback({ 
  className = "object-contain", 
  alt = "FreightFloo Logo",
  fallbackIconClassName = "h-6 w-6 text-primary-400 hidden"
}: LogoWithFallbackProps) {
  return (
    <div className="relative">
      <Image
        src="/logo.png"
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={className}
        onError={(e) => {
          // Fallback to TruckIcon if logo doesn't exist
          e.currentTarget.style.display = 'none'
          const nextElement = e.currentTarget.nextElementSibling as HTMLElement
          if (nextElement) {
            nextElement.style.display = 'block'
          }
        }}
      />
      <TruckIcon className={fallbackIconClassName} />
    </div>
  )
}
