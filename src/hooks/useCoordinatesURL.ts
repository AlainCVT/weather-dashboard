import type { Coords } from '@/types'
import { useState } from 'react'

const getInitialCoords = (): Coords => {
  // Get coordinates from URL
  const params = new URLSearchParams(window.location.search)
  const lat = params.get('lat')
  const lon = params.get('lon')

  if (lat !== null && lon !== null) {
    const parsedLat = parseFloat(lat)
    const parsedLon = parseFloat(lon)

    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      return { lat: parsedLat, lon: parsedLon }
    }
  }

  return null
}

export function useCoordinatesURL() {
  const [coords, setCoords] = useState<Coords>(getInitialCoords)

  const updateURL = (coords: Coords) => {
    if (!coords) {
      window.history.replaceState(null, '', window.location.pathname)
      return
    }

    const params = new URLSearchParams(window.location.search)
    params.set('lat', coords.lat.toString())
    params.set('lon', coords.lon.toString())

    const newURL = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newURL)
  }

  return [coords, setCoords, updateURL] as const
}
