import Elysia, { t } from 'elysia'

import { db } from '../../db/connection'
import { auth } from '../auth'

export const getManagedRestaurant = new Elysia().use(auth).get(
  '/managed-restaurant',
  async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new Error('User is not a manager.')
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    if (!managedRestaurant) {
      throw new Error('Restaurant not found.')
    }

    return managedRestaurant
  },
  {
    cookie: t.Cookie({
      auth: t.String(),
    }),
    detail: {
      tags: ['Restaurants'],
    },
  },
)
