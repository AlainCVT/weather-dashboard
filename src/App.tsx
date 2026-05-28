import { useState } from 'react'
import './App.css'

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

  const onMapClick = (coords: Coords) => {
    setCoords(coords)
  }

  return (
    <div className="grid gap-6 p-6">
      <Map coords={coords} onMapClick={onMapClick} />
      <SectionsCurrentWeather coords={coords} />
      <SectionsHourlyForecast coords={coords} />
      <SectionsDailyForecast coords={coords} />
      <SectionsAdditionalInfo coords={coords} />
    </div>
  )
}

export default App
