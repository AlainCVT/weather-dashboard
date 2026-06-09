import type {
  ComponentProps,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
} from 'react'

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import clsx from 'clsx'

type Props<T extends string> = ComponentProps<'div'> &
  PropsWithChildren<{
    title: string
    currentDisplayedValue?: string
    value: T | null
    setValue: Dispatch<SetStateAction<T | null>>
  }>

export default function Dropdown<T extends string>({
  title,
  currentDisplayedValue,
  value,
  setValue,
  className,
  children,
}: Props<T>) {
  return (
    <div className={clsx(className, 'flex items-center gap-2')}>
      <label className="text-lg font-semibold whitespace-nowrap not-md:hidden">
        {title}:
      </label>
      <div className="bg-background">
        <Select value={value} onValueChange={(value) => setValue(value)}>
          <SelectTrigger className="w-40 sm:w-48">
            <SelectValue placeholder={title}>
              {currentDisplayedValue && currentDisplayedValue}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      </div>
    </div>
  )
}
