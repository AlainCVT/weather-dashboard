import type { MapType } from '@/components/modules/dropdowns/MapTypeDropdown'
import { create } from 'zustand'

type MapTypeStore = {
  mapType: MapType
  setMapType: (mapType: MapType) => void
}

export const useMapTypeStore = create<MapTypeStore>()((set) => ({
  mapType: null,
  setMapType: (mapType) => {
    set({ mapType })
  },
}))
