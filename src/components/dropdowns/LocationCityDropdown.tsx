import type { ComponentProps, Dispatch, SetStateAction } from 'react'

import Dropdown from '@/components/dropdowns/Dropdown'
import {
  SelectGroup,
  SelectItem,
  SelectSeparator,
} from '@/components/ui/select'

const LOCATIONS_CITIES = {
  Africa: ['Cairo', 'Lagos', 'Johannesburg', 'Nairobi', 'Casablanca'],

  Europe: ['London', 'Paris', 'Berlin', 'Madrid', 'Rome'],

  Asia: ['Tokyo', 'Beijing', 'Shanghai', 'Mumbai', 'Singapore'],

  'North America': [
    'New York',
    'Los Angeles',
    'Toronto',
    'Mexico City',
    'Chicago',
  ],

  'South America': [
    'São Paulo',
    'Buenos Aires',
    'Rio de Janeiro',
    'Santiago',
    'Lima',
  ],

  Oceania: ['Sydney', 'Melbourne', 'Auckland', 'Brisbane', 'Perth'],
} as const satisfies Record<string, string[]>

export type LocationCity = ValueOf<typeof LOCATIONS_CITIES>[number] | null

type Props = ComponentProps<'div'> & {
  locationCity: LocationCity
  setLocationCity: Dispatch<SetStateAction<LocationCity>>
}

export default function LocationCityDropdown({
  locationCity,
  setLocationCity,
  className,
}: Props) {
  return (
    <Dropdown
      className={className}
      title="Location"
      value={locationCity}
      setValue={setLocationCity}
    >
      {Object.entries(LOCATIONS_CITIES).map(([continent, cities], index) => (
        <>
          {!!index && <SelectSeparator />}
          <SelectGroup key={continent}>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectGroup>
        </>
      ))}
    </Dropdown>
  )
}
