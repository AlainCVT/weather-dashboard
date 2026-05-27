import { WeatherResponseSchema, type WeatherResponse } from './schemas/weather'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const API_URL = import.meta.env.VITE_OPENWEATHER_API_URL

interface ApiPosition {
  lat: number
  lon: number
}

export async function getWeather(
  position: ApiPosition,
): Promise<WeatherResponse> {
  const url = new URL(API_URL)

  url.searchParams.append('lat', position.lat.toString())
  url.searchParams.append('lon', position.lon.toString())
  url.searchParams.append('units', 'metric')
  url.searchParams.append('appid', API_KEY)

  const data = await fetch(url.toString()).then((result) => result.json())

  return WeatherResponseSchema.parse(data)
}
