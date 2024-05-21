import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { ENV } from '../env'
import * as schema from './schema'

const connection = postgres(ENV.DATABASE_URL)

export const db = drizzle(connection, { schema, logger: true })
