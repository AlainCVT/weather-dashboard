import { useMapTypeStore } from '@/stores/map-type'

import Dropdown from '@/components/dropdowns/Dropdown'
import { SelectGroup, SelectItem } from '@/components/ui/select'

const TYPES = {
  clouds_new: 'Clouds',
  precipitation_new: 'Precipitation',
  pressure_new: 'Pressure',
  temp_new: 'Temperature',
  wind_new: 'Wind',
} as const satisfies Record<string, string>

export type MapType = keyof typeof TYPES | null

export default function MapTypeDropdown() {
  const { mapType, setMapType } = useMapTypeStore()

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
