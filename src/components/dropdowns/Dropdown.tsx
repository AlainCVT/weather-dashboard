import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props<T extends string> = PropsWithChildren<{
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
  children,
}: Props<T>) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-lg font-semibold whitespace-nowrap">
        {title}:
      </label>
      <Select value={value} onValueChange={(value) => setValue(value)}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder={title}>
            {currentDisplayedValue && currentDisplayedValue}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  )
}
