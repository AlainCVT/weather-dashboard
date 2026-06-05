import { getWeather } from '@/api'
import type { WeatherResponse } from '@/schemas/weather'
import type { Coords } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import Card from '@/components/Card'
import Icon, { type IconsNames } from '@/components/icons/Icon'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  coords: Coords
}

type CurrentWeather = WeatherResponse['current']

type InfoRow<K extends keyof CurrentWeather> = {
  type: K
  label: string
  icon: IconsNames
  formatter: (value: CurrentWeather[K], data: WeatherResponse) => ReactNode
}

const INFO_ROWS = {
  clouds: {
    type: 'clouds',
    label: 'Cloudiness',
    icon: 'Weather/Cloud',
    formatter: (value) => `${value}%`,
  },
  uvi: {
    type: 'uvi',
    label: 'UV Index',
    icon: 'Weather/UV',
    formatter: (value) => value,
  },
  wind_deg: {
    type: 'wind_deg',
    label: 'Wind Direction',
    icon: 'Weather/Wind',
    formatter: (value) => (
      <Icon
        name="Arrow"
        size={32}
        style={{ transform: `rotate(${value}deg)` }}
      />
    ),
  },
  pressure: {
    type: 'pressure',
    label: 'Pressure',
    icon: 'Weather/Pressure',
    formatter: (value) => `${value} hPa`,
  },
  sunrise: {
    type: 'sunrise',
    label: 'Sunrise',
    icon: 'Weather/Sunrise',
    formatter: (value, data) =>
      new Date(value * 1000).toLocaleTimeString('en-UK', {
        timeStyle: 'short',
        timeZone: data.timezone,
      }),
  },
  sunset: {
    type: 'sunset',
    label: 'Sunset',
    icon: 'Weather/Sunset',
    formatter: (value, data) =>
      new Date(value * 1000).toLocaleTimeString('en-UK', {
        timeStyle: 'short',
        timeZone: data.timezone,
      }),
  },
} satisfies { [K in keyof CurrentWeather]?: InfoRow<K> }

export function AdditionalInfoSkeleton() {
  return (
    <Card heading="Additional Weather Info">
      <div className="grid gap-4">
        <div className="grid gap-6">
          {Object.entries(INFO_ROWS).map(([key, { label, icon }]) => (
            <div
              key={key}
              className="grid grid-flow-col items-center justify-between gap-4 whitespace-nowrap"
            >
              <div className="text-muted-foreground flex items-center gap-4">
                <Icon name={icon} size={32} />
                <span>{label}</span>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default function AdditionalInfo({ coords }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', coords.lat, coords.lon],
    queryFn: () => getWeather(coords),
  })

  return (
    <Card heading="Additional Weather Info">
      <div className="grid gap-4">
        <div className="grid gap-6">
          {Object.entries(INFO_ROWS).map(
            ([key, { type, label, icon, formatter }]) => (
              <div
                key={key}
                className="grid grid-flow-col items-center justify-between gap-4 whitespace-nowrap"
              >
                <div className="text-muted-foreground flex items-center gap-4">
                  <Icon name={icon} size={32} />
                  <span>{label}</span>
                </div>
                <span>{formatter(data.current[type], data)}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </Card>
  )
}
