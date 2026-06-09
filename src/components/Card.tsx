import clsx from 'clsx'
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'

type Props = ComponentProps<'div'> &
  PropsWithChildren<{
    heading?: ReactNode
  }>

export default function Card({ className, heading, children }: Props) {
  return (
    <div
      className={clsx(
        'from-card to-card/60 border-accent flex flex-col gap-6 border bg-linear-to-br p-4',
        className,
      )}
    >
      {!!heading && <h2 className="text-2xl font-semibold">{heading}</h2>}
      {children}
    </div>
  )
}
