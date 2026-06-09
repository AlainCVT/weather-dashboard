import { getCountryName } from '@/api'
import type { LocationResponse } from '@/schemas/location'
import { useSuspenseQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import type { ComponentProps } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

type Props = ComponentProps<'h1'> & {
  location?: LocationResponse[number]
}

export function TitleSkeleton({ className }: Props) {
  return (
    <h1 className={clsx(className, 'text-2xl font-bold')}>
      <Skeleton className="h-8 w-3xs" />
    </h1>
  )
}

export default function Title({ location, className }: Props) {
  const { data: countryName } = useSuspenseQuery({
    queryKey: ['country', location?.country],
    queryFn: () => getCountryName(location?.country ?? ''),
  })

  const locationName: string | null = location
    ? [location.name, location.state, countryName?.name.common]
        .filter(Boolean)
        .join(', ')
    : null

  return (
    <h1 className={clsx(className, 'text-2xl font-bold')}>
      {locationName || <>Select a location</>}
    </h1>
  )
}
