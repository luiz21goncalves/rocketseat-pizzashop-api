import Elysia, { t } from 'elysia'

import { db } from '../../db/connection'
import { auth } from '../auth'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const getOrderDetails = new Elysia().use(auth).get(
  '/orders/:orderId',
  async ({ params, getCurrentUser, set }) => {
    const { orderId } = params

    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, orderId)
      },
      columns: {
        id: true,
        status: true,
        totalInCents: true,
        createdAt: true,
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true,
          },
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      set.status = 'Not Found'

      return { message: 'Order not found.' }
    }

    return order
  },
  {
    params: t.Object({ orderId: t.String() }),
    detail: {
      tags: ['Orders'],
    },
  },
)
