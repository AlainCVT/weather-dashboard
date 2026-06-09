import { getLocation } from '@/api'
import { useQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import './App.css'

import LocationCityDropdown, {
  type LocationCity,
} from '@/components/dropdowns/LocationCityDropdown'
import MapTypeDropdown, {
  type MapType,
} from '@/components/dropdowns/MapTypeDropdown'
import Icon from '@/components/icons/Icon'
import Map from '@/components/Map'
import { PartialsPollutionPanel } from '@/components/partials'
import {
  SectionsAdditionalInfo,
  SectionsAdditionalInfoSkeleton,
  SectionsCurrentWeather,
  SectionsCurrentWeatherSkeleton,
  SectionsDailyForecast,
  SectionsDailyForecastSkeleton,
  SectionsHourlyForecast,
  SectionsHourlyForecastSkeleton,
} from '@/components/sections'
import { Button } from '@/components/ui/button'
import type { Coords } from '@/types'

function App() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false)
  const [coords, setCoords] = useState<Coords>({ lat: 0, lon: 0 })
  const [location, setLocation] = useState<LocationCity>(null)
  const [mapType, setMapType] = useState<MapType>(null)

  const { data: locationData } = useQuery({
    queryKey: ['location', location, coords.lat, coords.lon],
    queryFn: () => getLocation(location ?? coords),
  })

  const onMapClick = (coords: Coords) => {
    setCoords(coords)
    setLocation(null)
  }

  const currentCoords: Coords =
    location === null
      ? coords
      : { lat: locationData?.[0].lat ?? 0, lon: locationData?.[0].lon ?? 0 }

  return (
    <div className="grid h-screen grid-flow-col overflow-hidden *:overflow-auto">
      <div className="grid gap-6 p-6">
        <div className="flex justify-between gap-4">
          <div className="grid justify-start gap-4 md:grid-flow-col">
            <LocationCityDropdown
              locationCity={location}
              setLocationCity={setLocation}
            />
            <MapTypeDropdown mapType={mapType} setMapType={setMapType} />
          </div>
          <Button
            className="lg:hidden"
            variant="secondary"
            onClick={() => {
              setIsSidePanelOpen(true)
            }}
          >
            <Icon
              name="Hamburger"
              size={16}
              className="text-muted-foreground"
            />
          </Button>
        </div>
        <Map coords={currentCoords} onMapClick={onMapClick} mapType={mapType} />
        <Suspense fallback={<SectionsCurrentWeatherSkeleton />}>
          <SectionsCurrentWeather
            coords={currentCoords}
            {...(locationData && { location: locationData[0] })}
          />
        </Suspense>
        <Suspense fallback={<SectionsHourlyForecastSkeleton />}>
          <SectionsHourlyForecast coords={currentCoords} />
        </Suspense>
        <Suspense fallback={<SectionsDailyForecastSkeleton />}>
          <SectionsDailyForecast coords={currentCoords} />
        </Suspense>
        <Suspense fallback={<SectionsAdditionalInfoSkeleton />}>
          <SectionsAdditionalInfo coords={currentCoords} />
        </Suspense>
      </div>
      <PartialsPollutionPanel
        className="not-lg:fixed not-lg:top-0 not-lg:left-full"
        coords={currentCoords}
        isOpen={isSidePanelOpen}
        toggleState={setIsSidePanelOpen}
      />
    </div>
  )
}

export default App
