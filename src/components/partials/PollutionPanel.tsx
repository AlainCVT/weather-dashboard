import { getAirPollution } from '@/api'
import { capitalize } from '@/helpers/capitalize'
import type { AirPollutionResponse } from '@/schemas/air-pollution'
import type { Coords } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Suspense, useEffect, type Dispatch, type SetStateAction } from 'react'

import Card from '@/components/Card'
import Icon from '@/components/icons/Icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Props = {
  coords: Coords
  isOpen: boolean
  toggleState: Dispatch<SetStateAction<boolean>>
}

type AirPollutant = keyof AirPollutionResponse['list'][number]['components']

type AirQualityLevel = 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor'
type AirQualityRanges = Record<
  AirPollutant,
  Record<AirQualityLevel, Record<'min' | 'max', number>>
>

const POLLUTANT_NAME: Record<AirPollutant, string> = {
  so2: 'sulfur dioxide',
  no2: 'nitrogen dioxide',
  pm10: 'particulate matter 10',
  pm2_5: 'fine particles matter',
  o3: 'ozone',
  co: 'carbon monoxide',
  no: 'nitrogen monoxide',
  nh3: 'ammonia',
}

const AIR_POLLUTANTS: AirPollutant[] = [
  'co',
  'no',
  'no2',
  'o3',
  'so2',
  'pm2_5',
  'pm10',
  'nh3',
]

const AIR_QUALITY_RANGES: AirQualityRanges = {
  co: {
    Good: { min: 0, max: 4400 },
    Fair: { min: 4400, max: 9400 },
    Moderate: { min: 9400, max: 12400 },
    Poor: { min: 12400, max: 15400 },
    'Very Poor': { min: 15400, max: Infinity },
  },
  no: {
    Good: { min: 0, max: 20 },
    Fair: { min: 20, max: 40 },
    Moderate: { min: 40, max: 60 },
    Poor: { min: 60, max: 80 },
    'Very Poor': { min: 80, max: Infinity },
  },
  no2: {
    Good: { min: 0, max: 40 },
    Fair: { min: 40, max: 70 },
    Moderate: { min: 70, max: 150 },
    Poor: { min: 150, max: 200 },
    'Very Poor': { min: 200, max: Infinity },
  },
  o3: {
    Good: { min: 0, max: 60 },
    Fair: { min: 60, max: 100 },
    Moderate: { min: 100, max: 140 },
    Poor: { min: 140, max: 180 },
    'Very Poor': { min: 180, max: Infinity },
  },
  so2: {
    Good: { min: 0, max: 20 },
    Fair: { min: 20, max: 80 },
    Moderate: { min: 80, max: 250 },
    Poor: { min: 250, max: 350 },
    'Very Poor': { min: 350, max: Infinity },
  },
  pm2_5: {
    Good: { min: 0, max: 10 },
    Fair: { min: 10, max: 25 },
    Moderate: { min: 25, max: 50 },
    Poor: { min: 50, max: 75 },
    'Very Poor': { min: 75, max: Infinity },
  },
  pm10: {
    Good: { min: 0, max: 20 },
    Fair: { min: 20, max: 50 },
    Moderate: { min: 50, max: 100 },
    Poor: { min: 100, max: 200 },
    'Very Poor': { min: 200, max: Infinity },
  },
  nh3: {
    Good: { min: 0, max: 40 },
    Fair: { min: 40, max: 70 },
    Moderate: { min: 70, max: 150 },
    Poor: { min: 150, max: 200 },
    'Very Poor': { min: 200, max: Infinity },
  },
}

function AirPollutionStatsSkeleton() {
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
      {AIR_POLLUTANTS.map((key) => {
        const pollutant = AIR_QUALITY_RANGES[key]

        return (
          <Card
            key={key}
            className="hover:border-ring from-sidebar-accent/40 to-sidebar-accent/0 transition-colors duration-200"
          >
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>
                    <span className="font-semibold">{capitalize(key)}</span>{' '}
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
                        Concentration of {POLLUTANT_NAME[key]}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </span>
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-8 w-full" />
              <div className="flex items-center justify-between">
                {Object.keys(pollutant).map((quality) => (
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

const AirPollutionStats = ({ coords }: Props) => {
  const { data } = useSuspenseQuery({
    queryKey: ['air-pollution', coords.lat, coords.lon],
    queryFn: () => getAirPollution(coords),
  })

  return (
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
      {Object.entries(data.list[0].components).map(([key, value]) => {
        const pollutant = AIR_QUALITY_RANGES[key]
        const min = Math.min(
          pollutant['Good'].min === -Infinity
            ? pollutant['Good'].max
            : pollutant['Good'].min,
          value,
        )
        const max = Math.max(
          pollutant['Very Poor'].max === Infinity
            ? pollutant['Very Poor'].min
            : pollutant['Very Poor'].max,
          value,
        )

        const currentQualityLevel: AirQualityLevel = (() => {
          for (const [level, range] of Object.entries(pollutant)) {
            if (value >= range.min && value <= range.max) return level
          }
          return 'Very Poor'
        })()

        return (
          <Card
            key={key}
            className="hover:border-ring from-sidebar-accent/40 to-sidebar-accent/0 transition-colors duration-200"
          >
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>
                    <span className="font-semibold">{capitalize(key)}</span>{' '}
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
                        Concentration of {POLLUTANT_NAME[key]}
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
                {Object.keys(pollutant).map((quality) => (
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
  )
}

export default function PollutionPanel(props: Props) {
  const { isOpen, toggleState } = props

  useEffect(() => {
    const escapePanel = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggleState(false)
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', escapePanel)
    }

    return () => {
      window.removeEventListener('keydown', escapePanel)
    }
  })

  return (
    <aside
      className={clsx(
        'bg-sidebar border-accent fixed top-0 left-full grid h-screen w-xs gap-4 overflow-auto border-l px-4 py-6 shadow-md transition-transform duration-400',
        {
          '-translate-x-full': isOpen,
          'pointer-none': !isOpen,
        },
      )}
      {...(!isOpen && { tabIndex: -1 })}
    >
      <Button
        variant="secondary"
        onClick={() => {
          toggleState(false)
        }}
      >
        <Icon
          name="Chevron"
          size={16}
          className="text-muted-foreground -rotate-90"
        />
        Close
      </Button>
      <Suspense fallback={<AirPollutionStatsSkeleton />}>
        <AirPollutionStats {...props} />
      </Suspense>
    </aside>
  )
}
