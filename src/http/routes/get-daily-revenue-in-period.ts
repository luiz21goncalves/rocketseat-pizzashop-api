import dayjs from 'dayjs'
import { and, asc, eq, gte, lte, sql, sum } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { auth } from '../auth'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const getDailyRevenueInPeriod = new Elysia().use(auth).get(
  '/metrics/daily-revenue-in-period',
  async ({ getCurrentUser, query, set }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const { from, to } = query

    const startDate = from ? dayjs(from) : dayjs().subtract(7, 'days')
    const endDate = to ? dayjs(to) : startDate.add(7, 'days')

    if (endDate.diff(startDate, 'days') > 7) {
      set.status = 'Bad Request'

      return {
        message: 'You cannot list revenue in a longer period than 7 days.',
      }
    }

    const revenueInPeriod = await db
      .select({
        date: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
        revenue: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(
            orders.createdAt,
            startDate
              .startOf('day')
              .add(startDate.utcOffset(), 'minutes')
              .toDate(),
          ),
          lte(
            orders.createdAt,
            endDate.endOf('day').add(endDate.utcOffset(), 'minutes').toDate(),
          ),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)
      .orderBy((fields) => {
        return asc(fields.date)
      })

    return revenueInPeriod
  },
  {
    query: t.Object({
      from: t.Optional(t.String()),
      to: t.Optional(t.String()),
    }),
    detail: { tags: ['Metrics'] },
  },
)
