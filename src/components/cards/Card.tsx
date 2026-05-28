import type { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren<{
  title: ReactNode
}>

export default function Card({ title, children }: Props) {
  return (
    <div className="from-card to-card/60 border-accent grid gap-6 border bg-linear-to-br p-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  )
}
