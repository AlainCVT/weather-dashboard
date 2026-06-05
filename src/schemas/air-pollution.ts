import z from 'zod'

const PollutantCode = z.enum([
  'co',
  'no',
  'no2',
  'o3',
  'so2',
  'pm2_5',
  'pm10',
  'nh3',
])

export const AirPollutionSchema = z.object({
  coord: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  list: z.array(
    z.object({
      dt: z.number(),
      main: z.object({
        aqi: z.number(),
      }),
      components: z.record(PollutantCode, z.number()),
    }),
  ),
})

export type AirPollutionResponse = z.infer<typeof AirPollutionSchema>
