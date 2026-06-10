import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

type Props = {
  displayAlertScroll: () => void
  stopAlertScrollTimer: () => void
}

export default function MapScrollZoomController({
  displayAlertScroll,
  stopAlertScrollTimer,
}: Props) {
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
    // Check if user pressed control key to allow scroll
    const container = map.getContainer()

    const handleWheel = (event: WheelEvent) => {
      if (!(event.ctrlKey || event.metaKey)) {
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
