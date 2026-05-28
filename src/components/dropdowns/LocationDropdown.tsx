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

const LOCATIONS = {
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

export type Location = ValueOf<typeof LOCATIONS>[number] | null

type Props = {
  location: Location
  setLocation: Dispatch<SetStateAction<Location>>
}

export default function LocationDropdown({ location, setLocation }: Props) {
  return (
    <Select value={location} onValueChange={(value) => setLocation(value)}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Location" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(LOCATIONS).map(([continent, cities], index) => (
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
