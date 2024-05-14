import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string().url() 
})

export const ENV = envSchema.parse(process.env)