import { useSidePanelState } from '@/contexts/side-panel'
import type { Coords } from '@/types'
import clsx from 'clsx'
import { Suspense, useEffect, type ComponentProps } from 'react'

import Icon from '@/components/icons/Icon'
import AirPollutionStats, {
  AirPollutionStatsSkeleton,
} from '@/components/sections/AirPollutionStats'
import { Button } from '@/components/ui/button'

type Props = ComponentProps<'aside'> & {
  coords: Coords
}

export default function SidePanel({ coords, className }: Props) {
  const { toggleState, isOpen } = useSidePanelState()

  useEffect(() => {
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
        'bg-sidebar border-accent grid h-screen w-xs content-start gap-4 overflow-auto border-l px-4 py-6 shadow-md duration-400 not-lg:transition-transform',
        {
          'not-lg:-translate-x-full': isOpen,
          'not-lg:pointer-none': !isOpen,
        },
      )}
      {...(!isOpen && { tabIndex: -1 })}
    >
      <Button
        className="lg:hidden"
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
      <Suspense fallback={<AirPollutionStatsSkeleton />}>
        <AirPollutionStats coords={coords} />
      </Suspense>
    </aside>
  )
}
