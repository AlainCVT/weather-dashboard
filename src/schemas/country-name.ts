import z from 'zod'

export const CountryNameSchema = z.object({
  name: z.object({
    common: z.string(),
    official: z.string(),
    nativeName: z.record(
      z.string(),
      z.object({
        common: z.string(),
        official: z.string(),
      }),
    ),
  }),
})

export type CountryNameResponse = z.infer<typeof CountryNameSchema>
