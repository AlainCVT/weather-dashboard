import {
  AirPollutionSchema,
  type AirPollutionResponse,
} from '@/schemas/air-pollution'
import { LocationSchema, type LocationResponse } from '@/schemas/location'
import { WeatherSchema, type WeatherResponse } from '@/schemas/weather'
import type { Coords } from '@/types'

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const OPENWEATHER_API_URL = import.meta.env.VITE_OPENWEATHER_API_URL

export async function getWeather(coords: Coords): Promise<WeatherResponse> {
  const url = new URL('data/3.0/onecall', OPENWEATHER_API_URL)

  url.searchParams.append('lat', coords.lat.toString())
  url.searchParams.append('lon', coords.lon.toString())
  url.searchParams.append('units', 'metric')
  url.searchParams.append('appid', OPENWEATHER_API_KEY)

  const data = await fetch(url.toString()).then((result) => result.json())

  return WeatherSchema.parse(data)
}

export async function getLocation(
  payload: string | Coords,
): Promise<LocationResponse> {
  if (!payload) return []

  const url =
    typeof payload === 'string'
      ? new URL('geo/1.0/direct', OPENWEATHER_API_URL)
      : new URL('geo/1.0/reverse', OPENWEATHER_API_URL)

  if (typeof payload === 'string') {
    url.searchParams.append('q', payload)
  } else {
    url.searchParams.append('lat', payload.lat.toString())
    url.searchParams.append('lon', payload.lon.toString())
  }
  url.searchParams.append('limit', '1')
  url.searchParams.append('appid', OPENWEATHER_API_KEY)

  const data = await fetch(url.toString()).then((result) => result.json())

  return LocationSchema.parse(data)
}

export async function getAirPollution(
  coords: Coords,
): Promise<AirPollutionResponse> {
  const url = new URL('data/2.5/air_pollution', OPENWEATHER_API_URL)

  url.searchParams.append('lat', coords.lat.toString())
  url.searchParams.append('lon', coords.lon.toString())
  url.searchParams.append('appid', OPENWEATHER_API_KEY)

  const data = await fetch(url.toString()).then((result) => result.json())

  return AirPollutionSchema.parse(data)
}
