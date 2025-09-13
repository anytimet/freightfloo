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
  const [originMarker, setOriginMarker] = useState<any>(null)
  const [destinationMarker, setDestinationMarker] = useState<any>(null)
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const googleMap = new (window as any).google.maps.Map(mapRef.current, {
      zoom: 6,
      center: { lat: 39.8283, lng: -98.5795 }, // Center of US
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    const directionsServiceInstance = new (window as any).google.maps.DirectionsService()
    const directionsRendererInstance = new (window as any).google.maps.DirectionsRenderer({
      draggable: false,
      suppressMarkers: true, // We'll add custom markers
      polylineOptions: {
        strokeColor: '#2563eb',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
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
      if (originMarker) originMarker.setMap(null)
      if (destinationMarker) destinationMarker.setMap(null)
    }
  }, [])

  // Create custom markers
  const createCustomMarker = (position: any, title: string, iconColor: string) => {
    return new (window as any).google.maps.Marker({
      position,
      map,
      title,
      icon: {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: iconColor,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      },
      label: {
        text: title === 'Pickup Location' ? 'P' : 'D',
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    })
  }

  // Add info windows for markers
  const createInfoWindow = (content: string) => {
    return new (window as any).google.maps.InfoWindow({
      content
    })
  }

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
        
        if (leg) {
          const distance = leg.distance?.text || ''
          const duration = leg.duration?.text || ''
          
          setRouteInfo({ distance, duration })
          
          if (onDistanceDuration) {
            onDistanceDuration(distance, duration)
          }

          // Clear existing markers
          if (originMarker) originMarker.setMap(null)
          if (destinationMarker) destinationMarker.setMap(null)

          // Create custom markers
          const originPos = leg.start_location
          const destPos = leg.end_location

          const newOriginMarker = createCustomMarker(originPos, 'Pickup Location', '#10b981')
          const newDestinationMarker = createCustomMarker(destPos, 'Delivery Location', '#ef4444')

          // Create info windows
          const originInfoWindow = createInfoWindow(`
            <div class="p-2">
              <h3 class="font-semibold text-green-600">📦 Pickup Location</h3>
              <p class="text-sm">${leg.start_address}</p>
            </div>
          `)

          const destInfoWindow = createInfoWindow(`
            <div class="p-2">
              <h3 class="font-semibold text-red-600">🎯 Delivery Location</h3>
              <p class="text-sm">${leg.end_address}</p>
            </div>
          `)

          // Add click listeners to markers
          newOriginMarker.addListener('click', () => {
            originInfoWindow.open(map, newOriginMarker)
          })

          newDestinationMarker.addListener('click', () => {
            destInfoWindow.open(map, newDestinationMarker)
          })

          setOriginMarker(newOriginMarker)
          setDestinationMarker(newDestinationMarker)

          // Fit map to show the entire route
          const bounds = new (window as any).google.maps.LatLngBounds()
          bounds.extend(originPos)
          bounds.extend(destPos)
          map.fitBounds(bounds)
        }
      } else {
        console.error('Directions request failed:', status)
        // Fallback: Show basic markers without route
        if (map && origin && destination) {
          // Use Geocoding to get coordinates for basic markers
          const geocoder = new (window as any).google.maps.Geocoder()
          
          geocoder.geocode({ address: origin }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              const originPos = results[0].geometry.location
              const originMarker = createCustomMarker(originPos, 'Pickup Location', '#10b981')
              setOriginMarker(originMarker)
            }
          })
          
          geocoder.geocode({ address: destination }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              const destPos = results[0].geometry.location
              const destMarker = createCustomMarker(destPos, 'Delivery Location', '#ef4444')
              setDestinationMarker(destMarker)
              
              // Fit map to show both markers
              if (originMarker) {
                const bounds = new (window as any).google.maps.LatLngBounds()
                bounds.extend(originMarker.getPosition())
                bounds.extend(destPos)
                map.fitBounds(bounds)
              }
            }
          })
        }
      }
    })
  }, [directionsService, directionsRenderer, origin, destination, onDistanceDuration, map])

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '300px' }}
      />
      
      {/* Route Information Overlay */}
      {routeInfo && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 border z-10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Pickup</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Delivery</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Distance:</span>
              <span className="font-semibold text-blue-600">{routeInfo.distance}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold text-blue-600">{routeInfo.duration}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
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
