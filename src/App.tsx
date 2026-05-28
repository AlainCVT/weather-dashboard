import { getGeocode } from '@/api'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'

import LocationDropdown, {
  type Location,
} from '@/components/dropdowns/LocationDropdown'
import MapTypeDropdown, {
  type MapType,
} from '@/components/dropdowns/MapTypeDropdown'
import Map from '@/components/Map'
import {
  SectionsAdditionalInfo,
  SectionsCurrentWeather,
  SectionsDailyForecast,
  SectionsHourlyForecast,
} from '@/components/sections'
import type { Coords } from '@/types'

function App() {
  const [coords, setCoords] = useState<Coords>({ lat: 0, lon: 0 })
  const [location, setLocation] = useState<Location>(null)
  const [mapType, setMapType] = useState<MapType>(null)

  const { data: geotcodeData } = useQuery({
    queryKey: ['geocode', location],
    queryFn: () => getGeocode(location ?? ''),
  })

  const onMapClick = (coords: Coords) => {
    setCoords(coords)
    setLocation(null)
  }

  const currentCoords: Coords =
    location === null
      ? coords
      : { lat: geotcodeData?.[0].lat ?? 0, lon: geotcodeData?.[0].lon ?? 0 }

  return (
    <div className="grid gap-6 p-6">
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Location:</h2>
          <LocationDropdown location={location} setLocation={setLocation} />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Map Type:</h2>
          <MapTypeDropdown mapType={mapType} setMapType={setMapType} />
        </div>
      </div>
      <Map coords={currentCoords} onMapClick={onMapClick} mapType={mapType} />
      <SectionsCurrentWeather coords={currentCoords} />
      <SectionsHourlyForecast coords={currentCoords} />
      <SectionsDailyForecast coords={currentCoords} />
      <SectionsAdditionalInfo coords={currentCoords} />
    </div>
  )
}

export default App
