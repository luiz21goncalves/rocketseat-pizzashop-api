import { jwt } from '@elysiajs/jwt'
import type { Static } from 'elysia'
import Elysia, { t } from 'elysia'

import { ENV } from '../env'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      secret: ENV.JWT_SECRET_KEY,
      schema: jwtPayload,
    }),
  )
  .derive({ as: 'scoped' }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async ({ sub, restaurantId }: Static<typeof jwtPayload>) => {
        const token = await jwt.sign({
          sub,
          restaurantId,
        })

        auth.set({
          value: token,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days,
          path: '/',
        })
      },
      signOut: () => {
        auth.remove()
      },
    }
  })
