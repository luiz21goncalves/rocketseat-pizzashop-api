import cors from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { Logestic } from 'logestic'

import packageJson from '../../package.json'
import { ENV } from '../env'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { getOrderDetails } from './routes/get-order-details'
import { getProfile } from './routes/get-profile'
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
  .onError(({ code, error, set, logestic }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = 'Bad Request'

        return { code, error: 'Validation failed.', details: error.all }
      }

      default: {
        set.status = 'Internal Server Error'

        logestic.error(JSON.stringify(error))

        return {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
        }
      }
    }
  })
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(getOrderDetails)

app.listen(ENV.PORT, (server) => {
  console.log(`HTTP server running at: ${server.url}`)
})
