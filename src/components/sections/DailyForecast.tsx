import { getWeather } from '@/api'
import type { Coords } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'

import Card from '@/components/Card'
import WeatherIcon from '@/components/icons/WeatherIcon'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  coords: Coords
}

export function DailyForecastSkeleton() {
  return (
    <Card heading="Daily Forecast">
      <div className="-m-4 grid overflow-auto p-4">
        <table className="whitespace-nowrap [&_td>*]:px-2">
          <tbody>
            {Array.from({ length: 8 }).map((_, index) => (
              <tr key={`index-${index}`} className="h-10">
                <td>
                  <Skeleton className="h-5 w-24" />
                </td>
                <td className="w-24 text-center">
                  <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                </td>
                <td className="w-24 text-center">
                  <Skeleton className="h-5 w-14" />
                </td>
                <td className="w-24 text-center">
                  <Skeleton className="h-5 w-14" />
                </td>
                <td className="w-24 text-center">
                  <Skeleton className="h-5 w-14" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default function DailyForecast({ coords }: Props) {
  const { data } = useSuspenseQuery({
    queryKey: ['weather', coords.lat, coords.lon],
    queryFn: () => getWeather(coords),
  })

  return (
    <Card heading="Daily Forecast">
      <div className="-m-4 grid overflow-auto p-4">
        <table className="whitespace-nowrap [&_td>*]:px-2">
          <tbody>
            {data.daily.map((day) => (
              <tr key={day.dt} className="h-10">
                <td>
                  <span>
                    {new Date(day.dt * 1000).toLocaleDateString('en-UK', {
                      weekday: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </td>
                <td className="w-24 text-center">
                  <span className="inline-flex justify-center *:shrink-0">
                    <WeatherIcon src={day.weather[0].icon} />
                  </span>
                </td>
                <td className="w-24 text-center">
                  <span className="text-gray-400">
                    {Math.round(day.temp.min)}°C
                  </span>
                </td>
                <td className="w-24 text-center">
                  <span>{Math.round(day.temp.day)}°C</span>
                </td>
                <td className="w-24 text-center">
                  <span className="text-gray-400">
                    {Math.round(day.temp.max)}°C
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
