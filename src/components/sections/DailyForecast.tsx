import { getWeather } from '@/api'
import { useSuspenseQuery } from '@tanstack/react-query'

import Card from '@/components/cards/Card'
import WeatherIcon from '@/components/icons/WeatherIcon'
import Spinner from '@/components/ui/Spinner'

export default function DailyForecast() {
  const { data } = useSuspenseQuery({
    queryKey: ['weather'],
    queryFn: () => getWeather({ lat: 50, lon: 50 }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return (
    <Card title="Daily Forecast">
      <div className="grid gap-4">
        {!data ? (
          <Spinner />
        ) : (
          data.daily.map((day) => (
            <div
              key={day.dt}
              className="grid auto-cols-fr grid-flow-col items-center"
            >
              <p>
                {new Date(day.dt * 1000).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                })}
              </p>
              <WeatherIcon src={day.weather[0].icon} />
              <p>{Math.round(day.temp.day)}°C</p>
              <p className="text-gray-400">{Math.round(day.temp.min)}°C</p>
              <p className="text-gray-400">{Math.round(day.temp.max)}°C</p>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
