import cookie from '@elysiajs/cookie'
import cors from '@elysiajs/cors'
import jwt from '@elysiajs/jwt'
import { swagger } from '@elysiajs/swagger'
import { Elysia, t } from 'elysia'
import { Logestic } from 'logestic'

import packageJson from '../../package.json'
import { ENV } from '../env'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'

const app = new Elysia()
  .use(Logestic.preset('fancy'))
  .use(
    jwt({
      secret: ENV.JWT_SECRET_KEY,
      schema: t.Object({
        sub: t.String(),
        restaurantId: t.Optional(t.String()),
      }),
    }),
  )
  .use(cookie())
  .use(cors())
  .use(
    swagger({
      exclude: ['/docs', '/docs/json'],
      path: '/docs',
      provider: 'scalar',
      documentation: {
        info: {
          title: packageJson.name,
          version: packageJson.version,
          description: packageJson.description,
        },
      },
    }),
  )
  .use(registerRestaurant)
  .use(sendAuthLink)

app.listen(ENV.PORT, (server) => {
  console.log(`HTTP server running at: ${server.url}`)
})
