import clsx from 'clsx'
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'

type Props = ComponentProps<'div'> &
  PropsWithChildren<{
    title?: ReactNode
  }>

export default function Card({ className, title, children }: Props) {
  return (
    <div
      className={clsx(
        'from-card to-card/60 border-accent grid gap-6 border bg-linear-to-br p-4',
        className,
      )}
    >
      {!!title && <h2 className="text-2xl font-semibold">{title}</h2>}
      {children}
    </div>
  )
}
