import type { Coords } from '@/types'
import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

import type { MapType } from '@/components/dropdowns/MapTypeDropdown'
import { useEffect } from 'react'

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

type MapProps = {
  coords: Coords
  onMapClick: (coords: Coords) => void
}

type Props = MapProps & {
  mapType: MapType
}

const MapClick = ({ coords, onMapClick }: MapProps) => {
  const map = useMap()

  map.panTo([coords.lat, coords.lon])

  map.on('click', (event) => {
    const { lat, lng } = event.latlng
    onMapClick({ lat, lon: lng })
  })

  return null
}

const MapTileLayer = () => {
  const map = useMap()

  useEffect(() => {
    const tileLayer = new MaptilerLayer({
      style: 'basic-dark',
      apiKey: MAPTILER_API_KEY,
    })
    tileLayer.addTo(map)

    return () => {
      map.removeLayer(tileLayer)
    }
  }, [map])

  return null
}

export default function Map({ coords, onMapClick, mapType }: Props) {
  const { lat, lon } = coords

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={5}
      style={{ width: '100%', height: '500px' }}
    >
      <MapClick coords={coords} onMapClick={onMapClick} />
      <MapTileLayer />
      <TileLayer
        url={`https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
      />
      <Marker position={[lat, lon]} />
    </MapContainer>
  )
}
