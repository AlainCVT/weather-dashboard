import { z } from 'zod'

const WeatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
})

const RainSchema = z.record(z.string().regex(/^\d+h$/), z.number())

const CurrentSchema = z.object({
  dt: z.number(),
  sunrise: z.number(),
  sunset: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  uvi: z.number(),
  clouds: z.number(),
  visibility: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  wind_gust: z.number(),
  weather: z.array(WeatherConditionSchema),
  rain: RainSchema.optional(),
})

const HourlySchema = z.object({
  dt: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  uvi: z.number(),
  clouds: z.number(),
  visibility: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  wind_gust: z.number(),
  weather: z.array(WeatherConditionSchema),
  pop: z.number(),
  rain: RainSchema.optional(),
})

const DailyTempSchema = z.object({
  day: z.number(),
  min: z.number(),
  max: z.number(),
  night: z.number(),
  eve: z.number(),
  morn: z.number(),
})

const DailyFeelsLikeSchema = z.object({
  day: z.number(),
  night: z.number(),
  eve: z.number(),
  morn: z.number(),
})

const DailySchema = z.object({
  dt: z.number(),
  sunrise: z.number(),
  sunset: z.number(),
  moonrise: z.number(),
  moonset: z.number(),
  moon_phase: z.number(),
  summary: z.string(),
  temp: DailyTempSchema,
  feels_like: DailyFeelsLikeSchema,
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  wind_gust: z.number(),
  weather: z.array(WeatherConditionSchema),
  clouds: z.number(),
  pop: z.number(),
  rain: z.number().optional(),
  uvi: z.number(),
})

const AlertSchema = z.object({
  sender_name: z.string(),
  event: z.string(),
  start: z.number(),
  end: z.number(),
  description: z.string(),
  tags: z.array(z.string()),
})

export const WeatherResponseSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  timezone_offset: z.number(),
  current: CurrentSchema,
  hourly: z.array(HourlySchema),
  daily: z.array(DailySchema),
  alerts: z.array(AlertSchema).optional(),
})

export type WeatherResponse = z.infer<typeof WeatherResponseSchema>
