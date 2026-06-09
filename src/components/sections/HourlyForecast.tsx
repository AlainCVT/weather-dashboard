import { getWeather } from '@/api'
import type { Coords } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'

import Card from '@/components/Card'
import WeatherIcon from '@/components/icons/WeatherIcon'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  coords: Coords
}

export function HourlyForecastSkeleton() {
  return (
    <Card heading="Hourly Forecast" className="overflow-hidden">
      <div className="-m-4 flex gap-6 overflow-x-auto p-4">
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            key={`hour-${index}`}
            className="grid justify-items-center gap-2 p-2 text-center"
          >
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-7 w-10" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function HourlyForecast({ coords }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', coords.lat, coords.lon],
    queryFn: () => getWeather(coords),
  })

  return (
    <Card heading="Hourly Forecast" className="overflow-hidden">
      <div className="-m-4 flex gap-6 overflow-x-auto p-4">
        {data.hourly.map((hour) => (
          <div
            key={hour.dt}
            className="grid justify-items-center gap-2 p-2 text-center"
          >
            <p className="whitespace-nowrap">
              {new Date(hour.dt * 1000).toLocaleDateString('en-UK', {
                weekday: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </p>
            <WeatherIcon src={hour.weather[0].icon} size="lg" />
            <p className="text-lg">{Math.round(hour.temp)}°C</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
