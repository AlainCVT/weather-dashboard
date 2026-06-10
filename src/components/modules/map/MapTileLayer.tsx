import { useTheme } from '@/contexts/theme'
import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY

export default function MapTileLayer() {
  const map = useMap()

  const { isDark } = useTheme()

  useEffect(() => {
    const tileLayer = new MaptilerLayer({
      style: isDark ? 'basic-dark' : 'basic-light',
      apiKey: MAPTILER_API_KEY,
    })
    tileLayer.addTo(map)

    return () => {
      map.removeLayer(tileLayer)
    }
  }, [map, isDark])

  return null
}
