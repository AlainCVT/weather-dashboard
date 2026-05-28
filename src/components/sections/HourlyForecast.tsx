import { getWeather } from '@/api'
import type { Coords } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'

import Card from '@/components/cards/Card'
import WeatherIcon from '@/components/icons/WeatherIcon'
import Spinner from '@/components/Spinner'

type Props = {
  coords: Coords
}

export default function HourlyForecast({ coords }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', coords],
    queryFn: () => getWeather({ lat: coords.lat, lon: coords.lon }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return (
    <Card title="Hourly Forecast">
      <div className="-m-4 flex gap-6 overflow-x-auto p-4">
        {!data ? (
          <Spinner />
        ) : (
          data.hourly.map((hour) => (
            <div
              key={hour.dt}
              className="grid justify-items-center gap-2 p-2 text-center"
            >
              <p className="whitespace-nowrap">
                {new Date(hour.dt * 1000).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <WeatherIcon src={hour.weather[0].icon} size="lg" />
              <p className="text-lg">{Math.round(hour.temp)}°C</p>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
