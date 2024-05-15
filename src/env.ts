import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  PORT: z.coerce.number(),
})

export const ENV = envSchema.parse(process.env)
