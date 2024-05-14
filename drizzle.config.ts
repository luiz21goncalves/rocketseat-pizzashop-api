import { defineConfig } from 'drizzle-kit'

import { ENV } from './src/env'

export default defineConfig({
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/db/schema/index.ts',
})
