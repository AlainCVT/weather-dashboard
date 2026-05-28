import type { Coords } from '@/types'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

type MapProps = {
  onMapClick: (coords: Coords) => void
}

type Props = MapProps & {
  coords: Coords
}

const MapClick = ({ onMapClick }: MapProps) => {
  const map = useMap()

  map.on('click', (event) => {
    const { lat, lng } = event.latlng
    map.panTo([lat, lng])
    onMapClick({ lat, lon: lng })
  })

  return null
}

export default function Map({ coords, onMapClick }: Props) {
  const { lat, lon } = coords

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={5}
      style={{ width: '100%', height: '500px' }}
    >
      <MapClick onMapClick={onMapClick} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]}></Marker>
    </MapContainer>
  )
}
