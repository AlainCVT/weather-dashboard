import { isMac } from '@/helpers/navigator'
import clsx from 'clsx'

type Props = {
  shouldAlertScroll: boolean
}

export default function MapScrollAlert({ shouldAlertScroll }: Props) {
  return (
    <div
      className={clsx(
        'bg-background/80 pointer-events-none absolute inset-0 flex items-center justify-center p-6 backdrop-blur-sm transition-opacity duration-400',
        {
          'opacity-0': !shouldAlertScroll,
        },
      )}
    >
      <span className="text-center">
        Use{' '}
        <span className="border-border text-muted-foreground bg-background mx-1 rounded-sm border px-1 py-0.5">
          {isMac() ? '⌘' : 'Ctrl'}
        </span>{' '}
        + scroll to zoom the map
      </span>
    </div>
  )
}
