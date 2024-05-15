import cors from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { Logestic } from 'logestic'

import { ENV } from '../env'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'

const app = new Elysia()
  .use(Logestic.preset('fancy'))
  .use(cors())
  .use(
    swagger({
      exclude: ['/docs', '/docs/json'],
      path: '/docs',
      provider: 'scalar',
    }),
  )
  .use(registerRestaurant)
  .use(sendAuthLink)

app.listen(ENV.PORT, (server) => {
  console.log(`HTTP server running at: ${server.url}`)
})
