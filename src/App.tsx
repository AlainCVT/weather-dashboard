import { getLocation } from '@/api'
import { SidePanelStateProvider } from '@/contexts/side-panel'
import { useCoordinatesURL } from '@/hooks/useCoordinatesURL'
import { useLocationCityStore } from '@/stores/location-city'
import type { Coords } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import './App.css'

import Map from '@/components/Map'
import { PartialsHeader, PartialsSidePanel } from '@/components/partials'
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

function App() {
  const [coords, setCoords] = useCoordinatesURL()

  const { locationCity } = useLocationCityStore()

  const { data: locationCityData } = useQuery({
    queryKey: ['location-city', locationCity, coords.lat, coords.lon],
    queryFn: () => getLocation(locationCity ?? coords),
  })

  const onMapClick = (coords: Coords) => {
    setCoords(coords)
  }

  const currentCoords: Coords =
    locationCity === null
      ? coords
      : {
          lat: locationCityData?.[0].lat ?? 0,
          lon: locationCityData?.[0].lon ?? 0,
        }

  return (
    <SidePanelStateProvider>
      <div className="grid h-screen grid-flow-col overflow-hidden *:overflow-auto">
        <div className="grid">
          <PartialsHeader />
          <div className="grid grid-cols-12 gap-6 p-6">
            <Map
              className="col-span-full"
              coords={currentCoords}
              onMapClick={onMapClick}
            />
            <div className="col-span-12 grid md:col-span-6 2xl:col-span-4 2xl:row-span-2">
              <Suspense fallback={<SectionsCurrentWeatherSkeleton />}>
                <SectionsCurrentWeather
                  coords={currentCoords}
                  {...(locationCityData && { location: locationCityData[0] })}
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
        <PartialsSidePanel
          className="z-1 not-lg:fixed not-lg:top-0 not-lg:left-full"
          coords={currentCoords}
        />
      </div>
    </SidePanelStateProvider>
  )
}

export default App
