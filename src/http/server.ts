import cors from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { Logestic } from 'logestic'

import packageJson from '../../package.json'
import { ENV } from '../env'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'
import { signOut } from './routes/sign-out'

const app = new Elysia()
  .use(Logestic.preset('fancy'))
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
  .use(authenticateFromLink)
  .use(signOut)

app.listen(ENV.PORT, (server) => {
  console.log(`HTTP server running at: ${server.url}`)
})
