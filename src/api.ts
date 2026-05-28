import { GeocodeResponseSchema, type GeocodeResponse } from '@/schemas/geocode'
import type { Coords } from '@/types'
import { WeatherResponseSchema, type WeatherResponse } from './schemas/weather'

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const OPENWEATHER_API_URL = import.meta.env.VITE_OPENWEATHER_API_URL

export async function getWeather(coords: Coords): Promise<WeatherResponse> {
  const url = new URL('data/3.0/onecall', OPENWEATHER_API_URL)

  url.searchParams.append('lat', coords.lat.toString())
  url.searchParams.append('lon', coords.lon.toString())
  url.searchParams.append('units', 'metric')
  url.searchParams.append('appid', OPENWEATHER_API_KEY)

  const data = await fetch(url.toString()).then((result) => result.json())

  return WeatherResponseSchema.parse(data)
}

export async function getGeocode(query: string): Promise<GeocodeResponse> {
  if (!query) return []

  const url = new URL('geo/1.0/direct', OPENWEATHER_API_URL)

  url.searchParams.append('q', query)
  url.searchParams.append('limit', '1')
  url.searchParams.append('appid', OPENWEATHER_API_KEY)

  const data = await fetch(url.toString()).then((result) => result.json())

  return GeocodeResponseSchema.parse(data)
}
