import { useTheme } from '@/contexts/theme'
import { isMac } from '@/helpers/navigator'
import '@/lib/SmoothWheelZoom'
import { useLocationCityStore } from '@/stores/location-city'
import { useMapTypeStore } from '@/stores/map-type'
import type { ColorStop, Coords } from '@/types'
import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk'
import clsx from 'clsx'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { renderToString } from 'react-dom/server'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

import type { MapType } from '@/components/dropdowns/MapTypeDropdown'
import Icon from '@/components/icons/Icon'

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const MAP_TYPE_DATA = {
  precipitation_new: {
    title: 'Rain',
    unit: 'mm',
    stops: [
      { value: 0, color: 'rgba(225, 200, 100, 0)' },
      { value: 0.1, color: 'rgba(200, 150, 150, 0)' },
      { value: 0.2, color: 'rgba(150, 150, 170, 0)' },
      { value: 0.5, color: 'rgba(120, 120, 190, 0)' },
      { value: 1, color: 'rgba(110, 110, 205, 0.3)' },
      { value: 10, color: 'rgba(80, 80, 225, 0.7)' },
      { value: 140, color: 'rgba(20, 20, 255, 0.9)' },
    ],
  },
  temp_new: {
    title: 'Temperature',
    unit: '°C',
    stops: [
      { value: -65, color: 'rgba(130, 22, 146, 1)' },
      { value: -55, color: 'rgba(130, 22, 146, 1)' },
      { value: -45, color: 'rgba(130, 22, 146, 1)' },
      { value: -40, color: 'rgba(130, 22, 146, 1)' },
      { value: -30, color: 'rgba(130, 87, 219, 1)' },
      { value: -20, color: 'rgba(32, 140, 236, 1)' },
      { value: -10, color: 'rgba(32, 196, 232, 1)' },
      { value: 0, color: 'rgba(35, 221, 221, 1)' },
      { value: 10, color: 'rgba(194, 255, 40, 1)' },
      { value: 20, color: 'rgba(255, 240, 40, 1)' },
      { value: 25, color: 'rgba(255, 194, 40, 1)' },
      { value: 30, color: 'rgba(252, 128, 20, 1)' },
    ],
  },
  clouds_new: {
    title: 'Clouds',
    unit: '%',
    stops: [
      { value: 0, color: 'rgba(255, 255, 255, 0.0)' },
      { value: 10, color: 'rgba(253, 253, 255, 0.1)' },
      { value: 20, color: 'rgba(252, 251, 255, 0.2)' },
      { value: 30, color: 'rgba(250, 250, 255, 0.3)' },
      { value: 40, color: 'rgba(249, 248, 255, 0.4)' },
      { value: 50, color: 'rgba(247, 247, 255, 0.5)' },
      { value: 60, color: 'rgba(246, 245, 255, 0.75)' },
      { value: 70, color: 'rgba(244, 244, 255, 1)' },
      { value: 80, color: 'rgba(243, 242, 255, 1)' },
      { value: 90, color: 'rgba(242, 241, 255, 1)' },
      { value: 100, color: 'rgba(240, 240, 255, 1)' },
    ],
  },
  pressure_new: {
    title: 'Pressure',
    unit: 'Pa',
    stops: [
      { value: 94000, color: 'rgba(0, 115, 255, 1)' },
      { value: 96000, color: 'rgba(0, 170, 255, 1)' },
      { value: 98000, color: 'rgba(75, 208, 214, 1)' },
      { value: 100000, color: 'rgba(141, 231, 199, 1)' },
      { value: 101000, color: 'rgba(176, 247, 32, 1)' },
      { value: 102000, color: 'rgba(240, 184, 0, 1)' },
      { value: 104000, color: 'rgba(251, 85, 21, 1)' },
      { value: 106000, color: 'rgba(243, 54, 59, 1)' },
      { value: 108000, color: 'rgba(198, 0, 0, 1)' },
    ],
  },
  wind_new: {
    title: 'Wind',
    unit: 'm/s',
    stops: [
      { value: 1, color: 'rgba(255, 255, 255, 0)' },
      { value: 5, color: 'rgba(238, 206, 206, 0.4)' },
      { value: 15, color: 'rgba(179, 100, 188, 0.7)' },
      { value: 25, color: 'rgba(63, 33, 59, 0.8)' },
      { value: 50, color: 'rgba(116, 76, 172, 0.9)' },
      { value: 100, color: 'rgba(70, 0, 175, 1)' },
      { value: 200, color: 'rgba(13, 17, 38, 1)' },
    ],
  },
} as const satisfies Record<
  NonNullable<MapType>,
  { title: string; unit: string; stops: ColorStop[] }
>

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

const MapScrollZoomController = ({
  displayAlertScroll,
  stopAlertScrollTimer,
}: {
  displayAlertScroll: () => void
  stopAlertScrollTimer: () => void
}) => {
  const map = useMap()

  useEffect(() => {
    const enableWheelZoom = () => {
      map?.smoothWheelZoom?.enable()
    }

    const disableWheelZoom = () => {
      map?.smoothWheelZoom?.disable()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) enableWheelZoom()
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) disableWheelZoom()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', disableWheelZoom)

    disableWheelZoom()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', disableWheelZoom)
    }
  }, [map])

  useEffect(() => {
    const container = map.getContainer()

    const handleWheel = (event: WheelEvent) => {
      if (!(event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        displayAlertScroll()
      } else {
        stopAlertScrollTimer()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [map, displayAlertScroll, stopAlertScrollTimer])

  return null
}

const MapClick = ({ coords, onMapClick }: Omit<Props, 'mapType'>) => {
  const map = useMap()

  const { setLocationCity } = useLocationCityStore()

  useEffect(() => {
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

const MapTileLayer = () => {
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

const MapLegend = () => {
  const { mapType } = useMapTypeStore()

  if (!mapType) return null

  const data = MAP_TYPE_DATA[mapType]

  const minValue = data.stops[0].value
  const maxValue = data.stops[data.stops.length - 1].value

  const gradientStops = data.stops
    .map(
      (stop) =>
        `${stop.color} ${((stop.value - minValue) / (maxValue - minValue)) * 100}%`,
    )
    .join(', ')

  return (
    <div className="bg-background/80 border-accent/80 xs:w-64 absolute top-4 right-4 grid w-48 gap-2 border p-2 shadow-lg backdrop-blur-xs sm:w-96">
      <h3 className="text-foreground text-sm font-semibold">{data.title}</h3>
      <div
        className="border-accent h-2 w-full border"
        style={{
          background: `linear-gradient(to right, ${gradientStops})`,
        }}
      />
      <div className="text-foreground flex justify-between gap-2 text-xs">
        <span>
          {data.stops[0].value} {data.unit}
        </span>
        <span>
          {data.stops[data.stops.length - 1].value} {data.unit}
        </span>
      </div>
    </div>
  )
}

export default function Map({ coords, onMapClick, className }: Props) {
  const { lat, lon } = coords

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
        center={[lat, lon]}
        zoom={5}
        touchZoom={true}
        zoomControl={false}
        scrollWheelZoom={false}
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
        <Marker position={[lat, lon]} icon={MarkerIcon} />
      </MapContainer>
      <MapLegend />
      <div
        className={clsx(
          'bg-background/80 pointer-events-none absolute inset-0 flex items-center justify-center p-6 backdrop-blur-sm transition-opacity duration-400',
          {
            'opacity-0': !shouldAlertScroll,
          },
        )}
      >
        <span className="text-center">
          Use{' '}
          <span className="border-foreground bg-background mx-1 rounded-sm border px-1 py-0.5">
            {isMac() ? '⌘' : 'Ctrl'}
          </span>{' '}
          + scroll to zoom the map
        </span>
      </div>
    </div>
  )
}
