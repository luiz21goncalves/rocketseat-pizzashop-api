import cors from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { Logestic } from 'logestic'

import packageJson from '../../package.json'
import { ENV } from '../env'
import { approveOrder } from './routes/approve-order'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { cancelOrder } from './routes/cancel-order'
import { deliverOrder } from './routes/deliver-order'
import { dispatchOrder } from './routes/dispatch-order'
import { getDailyRevenueInPeriod } from './routes/get-daily-revenue-in-period'
import { getDayOrdersAmount } from './routes/get-day-orders-amount'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { getMonthCanceledOrdersAmount } from './routes/get-month-canceled-orders-amount'
import { getMonthOrdersAmount } from './routes/get-month-orders-amount'
import { getMonthRevenue } from './routes/get-month-revenue'
import { getOrderDetails } from './routes/get-order-details'
import { getOrders } from './routes/get-orders'
import { getPopularProducts } from './routes/get-popular-products'
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
  .onError(({ code, error, set, logestic, path, request }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = 'Bad Request'

        return { code, error: 'Validation failed.', details: error.all }
      }

      case 'NOT_FOUND': {
        set.status = 'Not Found'

        return { code, message: `${request.method}:${path} not found` }
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
  .use(getOrders)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(cancelOrder)
  .use(deliverOrder)
  .use(dispatchOrder)
  .use(getMonthRevenue)
  .use(getDayOrdersAmount)
  .use(getMonthOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getPopularProducts)
  .use(getDailyRevenueInPeriod)

app.listen(ENV.PORT, (server) => {
  console.log(`HTTP server running at: ${server.url}`)
})
