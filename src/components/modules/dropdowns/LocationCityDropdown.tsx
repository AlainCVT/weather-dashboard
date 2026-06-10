import Dropdown from '@/components/Dropdown'
import {
  SelectGroup,
  SelectItem,
  SelectSeparator,
} from '@/components/ui/select'
import { useLocationCityStore } from '@/stores/location-city'

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

export default function LocationCityDropdown() {
  const { locationCity, setLocationCity } = useLocationCityStore()

  return (
    <Dropdown title="Location" value={locationCity} setValue={setLocationCity}>
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
