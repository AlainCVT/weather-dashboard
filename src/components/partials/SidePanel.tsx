import Icon from '@/components/icons/Icon'
import AirPollutionStats, {
  AirPollutionStatsSkeleton,
} from '@/components/sections/AirPollutionStats'
import { Button } from '@/components/ui/button'
import { useSidePanelState } from '@/contexts/side-panel'
import type { Coords } from '@/types'
import clsx from 'clsx'
import { Suspense, useEffect, type ComponentProps } from 'react'

type Props = ComponentProps<'aside'> & {
  coords: Coords
}

export default function SidePanel({ coords, className }: Props) {
  const { toggleState, isOpen } = useSidePanelState()

  useEffect(() => {
    // Close panel is Escape button is pressed
    const escapePanel = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggleState('close')
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
        className,
        'bg-sidebar border-accent grid h-screen w-xs content-start overflow-auto border-l shadow-md duration-400 not-lg:transition-transform',
        {
          'not-lg:-translate-x-full': isOpen,
          'not-lg:pointer-none': !isOpen,
        },
      )}
      {...(!isOpen && { tabIndex: -1 })}
    >
      <div className="before:bg-size-full before:from-sidebar before:to-sidebar/0 pointer-events-none sticky top-0 z-1 px-4 py-6 pb-4 *:pointer-events-auto *:relative before:pointer-events-none before:absolute before:inset-0 before:bg-linear-to-b lg:hidden">
        <Button
          variant="secondary"
          onClick={() => {
            toggleState('close')
          }}
        >
          <Icon
            name="Chevron"
            size={16}
            className="text-muted-foreground -rotate-90"
          />
          Close
        </Button>
      </div>
      <div className="px-4 pb-6 lg:pt-6">
        <Suspense fallback={<AirPollutionStatsSkeleton />}>
          <AirPollutionStats coords={coords} />
        </Suspense>
      </div>
    </aside>
  )
}
