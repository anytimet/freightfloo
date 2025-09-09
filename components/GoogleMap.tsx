'use client'

import { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

interface GoogleMapProps {
  origin: string
  destination: string
  onDistanceDuration?: (distance: string, duration: string) => void
  className?: string
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
          <div className="text-center">
            <p className="text-red-600">Failed to load map</p>
            <p className="text-sm text-red-500 mt-1">Please check your Google Maps API key</p>
          </div>
        </div>
      )
    default:
      return <div>Loading...</div>
  }
}

function MapComponent({ origin, destination, onDistanceDuration }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [directionsService, setDirectionsService] = useState<any>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null)
  const [autocompleteService, setAutocompleteService] = useState<any>(null)
  const [placesService, setPlacesService] = useState<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const googleMap = new (window as any).google.maps.Map(mapRef.current, {
      zoom: 6,
      center: { lat: 39.8283, lng: -98.5795 }, // Center of US
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    })

    const directionsServiceInstance = new (window as any).google.maps.DirectionsService()
    const directionsRendererInstance = new (window as any).google.maps.DirectionsRenderer({
      draggable: false,
      suppressMarkers: false,
    })

    const autocompleteServiceInstance = new (window as any).google.maps.places.AutocompleteService()
    const placesServiceInstance = new (window as any).google.maps.places.PlacesService(googleMap)

    setMap(googleMap)
    setDirectionsService(directionsServiceInstance)
    setDirectionsRenderer(directionsRendererInstance)
    setAutocompleteService(autocompleteServiceInstance)
    setPlacesService(placesServiceInstance)

    directionsRendererInstance.setMap(googleMap)

    return () => {
      directionsRendererInstance.setMap(null)
    }
  }, [])

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination) return

    const request: any = {
      origin: origin,
      destination: destination,
      travelMode: (window as any).google.maps.TravelMode.DRIVING,
      unitSystem: (window as any).google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false,
    }

    directionsService.route(request, (result: any, status: any) => {
      if (status === (window as any).google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.setDirections(result)
        
        const route = result.routes[0]
        const leg = route.legs[0]
        
        if (leg && onDistanceDuration) {
          onDistanceDuration(leg.distance?.text || '', leg.duration?.text || '')
        }
      } else {
        console.error('Directions request failed:', status)
      }
    })
  }, [directionsService, directionsRenderer, origin, destination, onDistanceDuration])

  return <div ref={mapRef} className="w-full h-full rounded-lg" />
}

export default function GoogleMap({ origin, destination, onDistanceDuration, className = "h-96" }: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center bg-yellow-50 rounded-lg ${className}`}>
        <div className="text-center">
          <p className="text-yellow-600">Google Maps API key not configured</p>
          <p className="text-sm text-yellow-500 mt-1">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Wrapper apiKey={apiKey} render={render} libraries={['places']}>
        <MapComponent 
          origin={origin} 
          destination={destination} 
          onDistanceDuration={onDistanceDuration}
        />
      </Wrapper>
    </div>
  )
}
