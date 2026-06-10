import { getAirPollution } from '@/api'
import Card from '@/components/Card'
import Icon from '@/components/icons/Icon'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { capitalize } from '@/helpers/capitalize'
import type { AirPollutionResponse } from '@/schemas/air-pollution'
import type { Coords } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import clsx from 'clsx'

type Props = {
  coords: Coords
}

type AirPollutant = keyof AirPollutionResponse['list'][number]['components']

type AirQualityLevel = 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor'
type AirQualityRanges = Record<
  AirPollutant,
  {
    name: string
    qualities: Record<AirQualityLevel, Record<'min' | 'max', number>>
  }
>

const AIR_QUALITY_RANGES: AirQualityRanges = {
  co: {
    name: 'carbon monoxide',
    qualities: {
      Good: { min: 0, max: 4400 },
      Fair: { min: 4400, max: 9400 },
      Moderate: { min: 9400, max: 12400 },
      Poor: { min: 12400, max: 15400 },
      'Very Poor': { min: 15400, max: Infinity },
    },
  },
  no: {
    name: 'nitrogen monoxide',
    qualities: {
      Good: { min: 0, max: 20 },
      Fair: { min: 20, max: 40 },
      Moderate: { min: 40, max: 60 },
      Poor: { min: 60, max: 80 },
      'Very Poor': { min: 80, max: Infinity },
    },
  },
  no2: {
    name: 'nitrogen dioxide',
    qualities: {
      Good: { min: 0, max: 40 },
      Fair: { min: 40, max: 70 },
      Moderate: { min: 70, max: 150 },
      Poor: { min: 150, max: 200 },
      'Very Poor': { min: 200, max: Infinity },
    },
  },
  o3: {
    name: 'ozone',
    qualities: {
      Good: { min: 0, max: 60 },
      Fair: { min: 60, max: 100 },
      Moderate: { min: 100, max: 140 },
      Poor: { min: 140, max: 180 },
      'Very Poor': { min: 180, max: Infinity },
    },
  },
  so2: {
    name: 'sulfur dioxide',
    qualities: {
      Good: { min: 0, max: 20 },
      Fair: { min: 20, max: 80 },
      Moderate: { min: 80, max: 250 },
      Poor: { min: 250, max: 350 },
      'Very Poor': { min: 350, max: Infinity },
    },
  },
  pm2_5: {
    name: 'fine particles matter',
    qualities: {
      Good: { min: 0, max: 10 },
      Fair: { min: 10, max: 25 },
      Moderate: { min: 25, max: 50 },
      Poor: { min: 50, max: 75 },
      'Very Poor': { min: 75, max: Infinity },
    },
  },
  pm10: {
    name: 'particulate matter 10',
    qualities: {
      Good: { min: 0, max: 20 },
      Fair: { min: 20, max: 50 },
      Moderate: { min: 50, max: 100 },
      Poor: { min: 100, max: 200 },
      'Very Poor': { min: 200, max: Infinity },
    },
  },
  nh3: {
    name: 'ammonia',
    qualities: {
      Good: { min: 0, max: 40 },
      Fair: { min: 40, max: 70 },
      Moderate: { min: 70, max: 150 },
      Poor: { min: 150, max: 200 },
      'Very Poor': { min: 200, max: Infinity },
    },
  },
}

export function AirPollutionStatsSkeleton() {
  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-semibold">Air Pollution</h2>
      <div className="grid gap-2">
        <Skeleton className="inline-flex h-12 w-9" />
        <span className="inline-flex items-center gap-2">
          <span className="text-xl">AQI</span>
          <Tooltip>
            <TooltipTrigger>
              <Icon name="Information" size={24} className="text-ring" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 =
                Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
              </p>
            </TooltipContent>
          </Tooltip>
        </span>
      </div>
      {Object.entries(AIR_QUALITY_RANGES).map(([symbol, pollutant], index) => {
        return (
          <Card
            key={`pollutant-${index}`}
            className="hover:border-ring from-sidebar-accent/40 to-sidebar-accent/0 transition-colors duration-200"
          >
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>
                    <span className="font-semibold">{capitalize(symbol)}</span>{' '}
                    <span className="text-xs">(μg/m&sup3;)</span>
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Icon
                        name="Information"
                        size={16}
                        className="text-ring"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Concentration of {pollutant.name}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </span>
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-8 w-full" />
              <div className="flex items-center justify-between">
                {Object.keys(pollutant.qualities).map((quality) => (
                  <span
                    key={quality}
                    className="relative inline-flex items-center justify-center py-0.5 text-xs text-transparent select-none"
                  >
                    {quality}
                    <Skeleton as="span" className="absolute size-full" />
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default function AirPollutionStats({ coords }: Pick<Props, 'coords'>) {
  const { data } = useSuspenseQuery({
    queryKey: ['air-pollution', coords?.lat, coords?.lon],
    queryFn: () => getAirPollution(coords),
  })

  return data ? (
    <div className="grid gap-4">
      <h2 className="text-2xl font-semibold">Air Pollution</h2>
      <div className="grid gap-2">
        <span className="text-5xl font-semibold">{data.list[0].main.aqi} </span>
        <span className="inline-flex items-center gap-2">
          <span className="text-xl">AQI</span>
          <Tooltip>
            <TooltipTrigger>
              <Icon name="Information" size={24} className="text-ring" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 =
                Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
              </p>
            </TooltipContent>
          </Tooltip>
        </span>
      </div>
      {Object.entries(data.list[0].components).map(([symbol, value]) => {
        const pollutant = AIR_QUALITY_RANGES[symbol]

        const min = Math.min(
          pollutant.qualities['Good'].min === -Infinity
            ? pollutant.qualities['Good'].max
            : pollutant.qualities['Good'].min,
          value,
        )
        const max = Math.max(
          pollutant.qualities['Very Poor'].max === Infinity
            ? pollutant.qualities['Very Poor'].min
            : pollutant.qualities['Very Poor'].max,
          value,
        )

        const currentQualityLevel: AirQualityLevel = (() => {
          for (const [level, range] of Object.entries(pollutant.qualities)) {
            if (value >= range.min && value <= range.max) return level
          }
          return 'Very Poor'
        })()

        return (
          <Card
            key={symbol}
            className="hover:border-ring from-sidebar-accent/40 to-sidebar-accent/0 transition-colors duration-200"
          >
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>
                    <span className="font-semibold">{capitalize(symbol)}</span>{' '}
                    <span className="text-xs">(μg/m&sup3;)</span>
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Icon
                        name="Information"
                        size={16}
                        className="text-ring"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Concentration of {pollutant.name}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </span>
                <span>{value}</span>
              </div>
              <Slider disabled value={[value]} min={min} max={max} />
              <div className="flex justify-between text-xs">
                <span>{min}</span>
                <span>{max}</span>
              </div>
              <div className="flex items-center justify-between">
                {Object.keys(pollutant.qualities).map((quality) => (
                  <span
                    key={quality}
                    className={clsx(
                      'rounded-sm px-1 py-0.5 text-xs',
                      quality === currentQualityLevel
                        ? {
                            'bg-green-500': quality === 'Good',
                            'bg-yellow-500': quality === 'Fair',
                            'bg-orange-500': quality === 'Moderate',
                            'bg-red-500': quality === 'Poor',
                            'bg-purple-500': quality === 'Very Poor',
                          }
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {quality}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  ) : (
    <AirPollutionStatsSkeleton />
  )
}
