import { cn } from '@/lib/utils'
import type { ComponentProps, ElementType } from 'react'

type Props<T extends ElementType> = ComponentProps<T> & {
  as?: T
}

export function Skeleton<T extends ElementType = 'div'>({
  as,
  className,
  ...props
}: Props<T>) {
  const Component = as ?? 'div'

  return (
    <Component
      data-slot="skeleton"
      className={cn('bg-muted animate-pulse rounded-none', className)}
      {...props}
    />
  )
}
