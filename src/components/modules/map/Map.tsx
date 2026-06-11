import Icon from '@/components/icons/Icon'
import '@/lib/SmoothWheelZoom'
import { useMapTypeStore } from '@/stores/map-type'
import type { Coords } from '@/types'
import clsx from 'clsx'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRef, useState, type ComponentProps } from 'react'
import { renderToString } from 'react-dom/server'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import MapClick from './MapClick'
import MapLegend from './MapLegend'
import MapScrollAlert from './MapScrollAlert'
import MapScrollZoomController from './MapScrollZoomController'
import MapTileLayer from './MapTileLayer'

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

type Props = ComponentProps<'div'> & {
  coords: Coords
  onMapClick: (coords: Coords) => void
}

const MarkerIcon = L.divIcon({
  html: renderToString(
    <Icon name="Marker" size={48} className="text-foreground absolute" />,
  ),
  className: 'flex! justify-center items-end',
})

export default function Map({ coords, onMapClick, className }: Props) {
  const [shouldAlertScroll, setShouldAlertScroll] = useState<boolean>(false)

  const alertScrollTimerRef = useRef<number | null>(null)

  const { mapType } = useMapTypeStore()

  const clearAlertScrollTimer = () => {
    if (alertScrollTimerRef.current) {
      clearTimeout(alertScrollTimerRef.current)
      alertScrollTimerRef.current = null
    }
  }

  const displayAlertScroll = () => {
    clearAlertScrollTimer()
    setShouldAlertScroll(true)

    alertScrollTimerRef.current = setTimeout(() => {
      setShouldAlertScroll(false)
    }, 1000)
  }

  const stopAlertScrollTimer = () => {
    clearAlertScrollTimer()
    setShouldAlertScroll(false)
  }

  return (
    <div className={clsx(className, 'border-accent relative grid border')}>
      <MapContainer
        className="h-128 w-full"
        center={[coords?.lat ?? 0, coords?.lon ?? 0]}
        maxBoundsViscosity={1}
        minZoom={1}
        scrollWheelZoom={false}
        touchZoom={true}
        zoom={1.5}
        zoomControl={false}
      >
        <MapScrollZoomController
          displayAlertScroll={displayAlertScroll}
          stopAlertScrollTimer={stopAlertScrollTimer}
        />
        <MapClick coords={coords} onMapClick={onMapClick} />
        <MapTileLayer />
        <TileLayer
          url={`https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
        />
        {coords && (
          <Marker position={[coords.lat, coords.lon]} icon={MarkerIcon} />
        )}
      </MapContainer>
      <MapLegend />
      <MapScrollAlert shouldAlertScroll={shouldAlertScroll} />
    </div>
  )
}
