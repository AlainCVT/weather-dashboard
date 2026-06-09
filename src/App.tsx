import { getLocation } from '@/api'
import type { Coords } from '@/types'
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
      <div className="grid">
        <header className="bg-background/80 border-b-accent sticky top-0 z-1 grid grid-flow-col items-center justify-between border-b pr-6 backdrop-blur-sm">
          <div className="no-scrollbar grid grid-flow-col justify-start gap-4 overflow-auto px-4 py-6">
            <LocationCityDropdown
              locationCity={location}
              setLocationCity={setLocation}
            />
            <MapTypeDropdown mapType={mapType} setMapType={setMapType} />
          </div>
          <div className="before:from-background before:to-background/0 relative flex h-full items-center before:pointer-events-none before:absolute before:right-full before:h-full before:w-4 before:bg-linear-to-l lg:hidden">
            <Button
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
        </header>
        <div className="grid grid-cols-12 gap-6 p-6">
          <Map
            className="col-span-full"
            coords={currentCoords}
            onMapClick={onMapClick}
            mapType={mapType}
          />
          <div className="col-span-12 grid md:col-span-6 2xl:col-span-4 2xl:row-span-2">
            <Suspense fallback={<SectionsCurrentWeatherSkeleton />}>
              <SectionsCurrentWeather
                coords={currentCoords}
                {...(locationData && { location: locationData[0] })}
              />
            </Suspense>
          </div>
          <div className="col-span-12 grid md:col-span-6 2xl:col-span-4 2xl:row-span-2">
            <Suspense fallback={<SectionsDailyForecastSkeleton />}>
              <SectionsDailyForecast coords={currentCoords} />
            </Suspense>
          </div>
          <div className="col-span-12 grid 2xl:col-span-4">
            <Suspense fallback={<SectionsHourlyForecastSkeleton />}>
              <SectionsHourlyForecast coords={currentCoords} />
            </Suspense>
          </div>
          <div className="col-span-12 grid 2xl:col-span-4">
            <Suspense fallback={<SectionsAdditionalInfoSkeleton />}>
              <SectionsAdditionalInfo coords={currentCoords} />
            </Suspense>
          </div>
        </div>
      </div>
      <PartialsPollutionPanel
        className="z-1 not-lg:fixed not-lg:top-0 not-lg:left-full"
        coords={currentCoords}
        isOpen={isSidePanelOpen}
        toggleState={setIsSidePanelOpen}
      />
    </div>
  )
}

export default App
