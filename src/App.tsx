import { getLocation } from '@/api'
import { ModulesMap } from '@/components/modules'
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
import Title, { TitleSkeleton } from '@/components/Title'
import { SidePanelStateProvider } from '@/contexts/side-panel'
import { useCoordinatesURL } from '@/hooks/useCoordinatesURL'
import { useLocationCityStore } from '@/stores/location-city'
import type { Coords } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import './App.css'

function App() {
  const [coords, setCoords, updateURL] = useCoordinatesURL()

  const { locationCity } = useLocationCityStore()

  const { data: locationData } = useQuery({
    queryKey: [
      'location-city',
      ...(locationCity ? [locationCity] : [coords?.lat, coords?.lon]),
    ],
    queryFn: () => getLocation(locationCity ?? coords),
  })

  const currentCoords: Coords =
    locationCity === null
      ? coords
      : locationData?.[0]
        ? {
            lat: locationData?.[0].lat,
            lon: locationData?.[0].lon,
          }
        : null

  if (currentCoords) {
    updateURL(currentCoords)
  }

  return (
    <SidePanelStateProvider>
      <div className="grid h-screen grid-flow-col overflow-hidden *:overflow-auto">
        <div className="grid">
          <PartialsHeader />
          <div className="grid grid-cols-12 gap-6 p-6">
            <Suspense fallback={<TitleSkeleton />}>
              <Title
                className="col-span-full"
                {...(locationData && { location: locationData[0] })}
              />
            </Suspense>
            <ModulesMap
              className="col-span-full"
              coords={currentCoords}
              onMapClick={(coords) => {
                setCoords(coords)
              }}
            />
            <div className="col-span-12 grid md:col-span-6 2xl:col-span-4 2xl:row-span-2">
              <Suspense fallback={<SectionsCurrentWeatherSkeleton />}>
                <SectionsCurrentWeather coords={currentCoords} />
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
