import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Dispatch, SetStateAction } from 'react'

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

type Props = {
  locationCity: LocationCity
  setLocationCity: Dispatch<SetStateAction<LocationCity>>
}

export default function LocationCityDropdown({
  locationCity,
  setLocationCity,
}: Props) {
  return (
    <Select
      value={locationCity}
      onValueChange={(value) => setLocationCity(value)}
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Location" />
      </SelectTrigger>
      <SelectContent>
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
      </SelectContent>
    </Select>
  )
}
