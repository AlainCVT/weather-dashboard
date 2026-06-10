import { useLocationCityStore } from '@/stores/location-city'
import type { Coords } from '@/types'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

type Props = {
  coords: Coords
  onMapClick: (coords: Coords) => void
}

export default function MapClick({ coords, onMapClick }: Props) {
  const map = useMap()

  const { setLocationCity } = useLocationCityStore()

  useEffect(() => {
    if (!coords) return
    map.panTo([coords.lat, coords.lon])
  }, [map, coords])

  useEffect(() => {
    const handleMapClick = (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng
      onMapClick({ lat, lon: lng })
      setLocationCity(null)
    }

    map.on('click', handleMapClick)
    return () => {
      map.off('click', handleMapClick)
    }
  }, [map, onMapClick, setLocationCity])

  return null
}
