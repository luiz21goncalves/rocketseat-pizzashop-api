import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { auth } from '../auth'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const deliverOrder = new Elysia().use(auth).patch(
  '/orders/:orderId/deliver',
  async ({ params, getCurrentUser, set }) => {
    const { orderId } = params

    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq, and }) {
        return and(
          eq(fields.id, orderId),
          eq(fields.restaurantId, restaurantId),
        )
      },
    })

    if (!order) {
      set.status = 'Not Found'

      return { message: 'Order not found.' }
    }

    if (order.status !== 'delivering') {
      set.status = 'Bad Request'

      return {
        message:
          'You cannot deliver orders that are not in "delivering" status.',
      }
    }

    await db
      .update(orders)
      .set({ status: 'delivered' })
      .where(eq(orders.id, orderId))

    set.status = 'No Content'
  },
  {
    params: t.Object({ orderId: t.String() }),
    cookie: t.Object({ auth: t.String() }),

    detail: {
      tags: ['Orders'],
    },
  },
)
