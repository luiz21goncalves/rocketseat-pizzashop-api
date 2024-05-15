import { jwt } from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

import { ENV } from '../env'

export const auth = new Elysia().use(
  jwt({
    secret: ENV.JWT_SECRET_KEY,
    schema: t.Object({
      sub: t.String(),
      restaurantId: t.Optional(t.String()),
    }),
  }),
)
