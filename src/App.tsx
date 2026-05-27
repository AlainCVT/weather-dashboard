import { useQuery } from '@tanstack/react-query'
import { getWeather } from './api'
import './App.css'

import {
  SectionsAdditionalInfo,
  SectionsCurrentWeather,
  SectionsDailyForecast,
  SectionsHourlyForecast,
} from '@/components/sections'

function App() {
  useQuery({
    queryKey: ['weather'],
    queryFn: () => getWeather({ lat: 50, lon: 50 }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return (
    <div className="grid gap-6 p-6">
      <SectionsCurrentWeather />
      <SectionsHourlyForecast />
      <SectionsDailyForecast />
      <SectionsAdditionalInfo />
    </div>
  )
}

export default App
