import z from 'zod'

export const LocationSchema = z.array(
  z.object({
    name: z.string(),
    local_names: z.record(z.string(), z.string()).optional(),
    lat: z.number(),
    lon: z.number(),
    country: z.string(),
    state: z.string().optional(),
  }),
)

export type LocationResponse = z.infer<typeof LocationSchema>
export type Location = LocationResponse[number]
