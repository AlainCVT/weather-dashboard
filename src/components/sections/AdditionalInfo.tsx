import { getWeather } from '@/api'
import type { WeatherResponse } from '@/schemas/weather'
import type { Coords } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import Card from '@/components/cards/Card'
import Icon, { type IconsNames } from '@/components/icons/Icon'
import Spinner from '@/components/Spinner'

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
    icon: 'Cloud',
    formatter: (value) => `${value}%`,
  },
  uvi: {
    type: 'uvi',
    label: 'UV Index',
    icon: 'UV',
    formatter: (value) => value,
  },
  wind_deg: {
    type: 'wind_deg',
    label: 'Wind Direction',
    icon: 'Wind',
    formatter: (value) => (
      <Icon
        name="Arrow"
        className="size-8"
        style={{ transform: `rotate(${value}deg)` }}
      />
    ),
  },
  pressure: {
    type: 'pressure',
    label: 'Pressure',
    icon: 'Pressure',
    formatter: (value) => `${value} hPa`,
  },
  sunrise: {
    type: 'sunrise',
    label: 'Sunrise',
    icon: 'Sunrise',
    formatter: (value, data) =>
      new Date(value * 1000).toLocaleTimeString('fr-FR', {
        timeStyle: 'short',
        timeZone: data.timezone,
      }),
  },
  sunset: {
    type: 'sunset',
    label: 'Sunset',
    icon: 'Sunset',
    formatter: (value, data) =>
      new Date(value * 1000).toLocaleTimeString('fr-FR', {
        timeStyle: 'short',
        timeZone: data.timezone,
      }),
  },
} satisfies { [K in keyof CurrentWeather]?: InfoRow<K> }

export default function AdditionalInfo({ coords }: Props) {
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
    <Card title="Additional Weather Info">
      <div className="grid gap-4">
        {!data ? (
          <Spinner />
        ) : (
          <div className="grid gap-6">
            {Object.entries(INFO_ROWS).map(
              ([key, { type, label, icon, formatter }]) => (
                <div
                  key={key}
                  className="grid grid-flow-col items-center justify-between gap-4 whitespace-nowrap"
                >
                  <div className="flex items-center gap-4 text-zinc-400">
                    <Icon name={icon} className="size-8" />
                    <span>{label}</span>
                  </div>
                  <span>{formatter(data.current[type], data)}</span>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
