import type { Coords } from '@/types'
import { useEffect, useState } from 'react'

const getInitialCoords = (): Coords => {
  const params = new URLSearchParams(window.location.search)
  const lat = params.get('lat')
  const lon = params.get('lon')

  if (lat && lon) {
    const parsedLat = parseFloat(lat)
    const parsedLon = parseFloat(lon)

    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      return { lat: parsedLat, lon: parsedLon }
    }
  }

  return { lat: 0, lon: 0 }
}

export function useCoordinatesURL() {
  const [coords, setCoords] = useState<Coords>(getInitialCoords)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('lat', coords.lat.toString())
    params.set('lon', coords.lon.toString())

    const newURL = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newURL)
  }, [coords])

  return [coords, setCoords] as const
}
