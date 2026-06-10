import { getWeather } from '@/api'
import Card from '@/components/Card'
import WeatherIcon from '@/components/icons/WeatherIcon'
import { Skeleton } from '@/components/ui/skeleton'
import { capitalize } from '@/helpers/capitalize'
import type { Coords } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { type ReactNode } from 'react'

type Props = {
  coords: Coords
}

const Stats = ({ title, value }: { title: string; value: ReactNode }) => (
  <div className="grid items-center justify-items-center gap-2">
    <p className="text-muted-foreground">{title}</p>
    <p>{value}</p>
  </div>
)

export function CurrentWeatherSkeleton() {
  return (
    <Card heading="Current Weather">
      <div className="grid grow gap-4">
        <div className="grid gap-8 text-center">
          <div className="grid items-center justify-items-center gap-2">
            <Skeleton className="h-15 w-40" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-7 w-36" />
          </div>
          <div className="grid items-center justify-items-center gap-2">
            <p className="text-muted-foreground text-xl">Local time</p>
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="grid auto-cols-fr grid-flow-col items-center gap-2">
            <Stats
              title="Feels like"
              value={<Skeleton as="span" className="h-6 w-16" />}
            />
            <Stats
              title="Humidity"
              value={<Skeleton as="span" className="h-6 w-16" />}
            />
            <Stats
              title="Wind speed"
              value={<Skeleton as="span" className="h-6 w-16" />}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function CurrentWeather({ coords }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', coords?.lat, coords?.lon],
    queryFn: () => getWeather(coords),
  })

  return data ? (
    <Card heading="Current Weather">
      <div className="grid grow gap-4">
        <div className="grid gap-8 text-center">
          <div className="grid items-center justify-items-center gap-2">
            <h2 className="text-6xl font-semibold">
              {Math.round(data.current.temp)}°C
            </h2>
            <WeatherIcon src={data.current.weather[0].icon} size="lg" />
            <h3 className="text-xl">
              {capitalize(data.current.weather[0].description)}
            </h3>
          </div>
          <div className="grid items-center justify-items-center gap-2">
            <p className="text-muted-foreground text-xl">Local time</p>
            <h3 className="text-4xl font-semibold">
              {new Intl.DateTimeFormat('en-UK', {
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
      </div>
    </Card>
  ) : (
    <CurrentWeatherSkeleton />
  )
}
