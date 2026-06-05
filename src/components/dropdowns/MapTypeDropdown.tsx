import Dropdown from '@/components/dropdowns/Dropdown'
import { SelectGroup, SelectItem } from '@/components/ui/select'
import type { Dispatch, SetStateAction } from 'react'

const TYPES = {
  clouds_new: 'Clouds',
  precipitation_new: 'Precipitation',
  pressure_new: 'Pressure',
  temp_new: 'Temperature',
  wind_new: 'Wind',
} as const satisfies Record<string, string>

export type MapType = keyof typeof TYPES | null

type Props = {
  mapType: MapType
  setMapType: Dispatch<SetStateAction<MapType>>
}

export default function MapTypeDropdown({ mapType, setMapType }: Props) {
  return (
    <Dropdown
      title="Map Type"
      {...(mapType && { currentDisplayedValue: TYPES[mapType] })}
      value={mapType}
      setValue={setMapType}
    >
      <SelectGroup>
        {Object.entries(TYPES).map(([type, label]) => (
          <SelectItem key={type} value={type}>
            {label}
          </SelectItem>
        ))}
      </SelectGroup>
    </Dropdown>
  )
}
