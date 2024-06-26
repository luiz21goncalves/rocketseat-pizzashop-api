import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  PORT: z.coerce.number(),
  JWT_SECRET_KEY: z.string(),
  MAILER_SMTP_URL: z.string().url(),
})

export const ENV = envSchema.parse(process.env)
