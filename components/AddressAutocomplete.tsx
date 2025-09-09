'use client'

import { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onPlaceSelect?: (place: any) => void
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="relative">
          <input
            type="text"
            placeholder="Loading autocomplete..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>
      )
    case Status.FAILURE:
      return (
        <div className="relative">
          <input
            type="text"
            placeholder="Autocomplete unavailable"
            className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled
          />
        </div>
      )
    default:
      return <div>Loading...</div>
  }
}

function AutocompleteComponent({ value, onChange, placeholder, className, onPlaceSelect }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!inputRef.current || isLoaded) return

    const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry', 'name', 'place_id']
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      
      if (place.formatted_address) {
        onChange(place.formatted_address)
        if (onPlaceSelect) {
          onPlaceSelect(place)
        }
      }
    })

    autocompleteRef.current = autocomplete
    setIsLoaded(true)

    return () => {
      if (autocompleteRef.current) {
        (window as any).google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [onChange, onPlaceSelect, isLoaded])

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  )
}

export default function AddressAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter address...", 
  className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
  onPlaceSelect 
}: AddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    )
  }

  return (
    <Wrapper apiKey={apiKey} render={render} libraries={['places']}>
      <AutocompleteComponent 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        onPlaceSelect={onPlaceSelect}
      />
    </Wrapper>
  )
}
