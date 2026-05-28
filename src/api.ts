import type { Coords } from '@/types'
import { WeatherResponseSchema, type WeatherResponse } from './schemas/weather'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const API_URL = import.meta.env.VITE_OPENWEATHER_API_URL

export async function getWeather(coords: Coords): Promise<WeatherResponse> {
  const url = new URL('data/3.0/onecall', API_URL)

  url.searchParams.append('lat', coords.lat.toString())
  url.searchParams.append('lon', coords.lon.toString())
  url.searchParams.append('units', 'metric')
  url.searchParams.append('appid', API_KEY)

  const data = await fetch(url.toString()).then((result) => result.json())

  return WeatherResponseSchema.parse(data)
}
