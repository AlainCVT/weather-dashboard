import type { LocationCity } from '@/components/dropdowns/LocationCityDropdown'
import { create } from 'zustand'

type LocationCityStore = {
  locationCity: LocationCity
  setLocationCity: (locationCity: LocationCity) => void
}

export const useLocationCityStore = create<LocationCityStore>()((set) => ({
  locationCity: null,
  setLocationCity: (locationCity) => {
    set({ locationCity })
  },
}))
