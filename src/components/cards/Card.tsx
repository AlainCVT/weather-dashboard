import type { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren<{
  title: ReactNode
}>

export default function Card({ title, children }: Props) {
  return (
    <div className="grid gap-6 rounded-xl bg-zinc-900 p-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  )
}
