import { Skeleton } from '@/components/ui/skeleton'
import type { Location } from '@/schemas/location'
import clsx from 'clsx'
import type { ComponentProps } from 'react'

type Props = ComponentProps<'h1'> & {
  location?: Location | null
  isLoading: boolean
}

export default function Title({ location, isLoading, className }: Props) {
  const regionNames = new Intl.DisplayNames(['en'], {
    type: 'region',
  })

  const locationName: string | null = location
    ? [location.name, location.state, regionNames.of(location.country)]
        .filter(Boolean)
        .join(', ')
    : null

  return (
    <h1 className={clsx(className, 'text-2xl font-bold')}>
      {isLoading ? (
        <Skeleton className="h-8 w-3xs" />
      ) : (
        locationName || <>Select a location</>
      )}
    </h1>
  )
}
