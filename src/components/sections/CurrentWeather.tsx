import { getWeather } from '@/api'
import { capitalize } from '@/libs/utils'
import { useSuspenseQuery } from '@tanstack/react-query'

import Card from '@/components/cards/Card'
import WeatherIcon from '@/components/icons/WeatherIcon'
import Spinner from '@/components/ui/Spinner'

const Stats = ({ title, value }: { title: string; value: string }) => (
  <div className="grid justify-items-center gap-2">
    <p className="text-zinc-400">{title}</p>
    <p>{value}</p>
  </div>
)

export default function CurrentWeather() {
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
    <Card title="Current Weather">
      <div className="grid gap-4">
        {!data ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 text-center">
            <div className="grid justify-items-center gap-2">
              <h2 className="text-6xl font-semibold">
                {Math.round(data.current.temp)}°C
              </h2>
              <WeatherIcon src={data.current.weather[0].icon} size="lg" />
              <h3 className="text-xl">
                {capitalize(data.current.weather[0].description)}
              </h3>
            </div>
            <div className="grid justify-items-center gap-2">
              <p className="text-xl">Local time:</p>
              <h3 className="text-4xl font-semibold">
                {new Intl.DateTimeFormat('fr-FR', {
                  timeStyle: 'short',
                  timeZone: data.timezone,
                }).format(new Date())}
              </h3>
            </div>
            <div className="grid auto-cols-fr grid-flow-col items-center gap-2">
              <Stats
                title="Feels like"
                value={`${Math.round(data.current.feels_like)}°C`}
              />
              <Stats
                title="Humidity"
                value={`${Math.round(data.current.humidity)}%`}
              />
              <Stats
                title="Wind speed"
                value={`${Math.round(data.current.wind_speed * 3.6)} km/h`}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
