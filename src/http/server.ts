import cors from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia, t } from 'elysia'

import { db } from '../db/connection'
import { restaurants, users } from '../db/schema'
import { ENV } from '../env'

const app = new Elysia()
  .use(cors())
  .use(swagger({ path: '/docs', provider: 'swagger-ui' }))
  .post(
    '/restaurants',
    async ({ body, set }) => {
      const { restaurantName, managerName, email, phone } = body

      const [manager] = await db
        .insert(users)
        .values({ email, name: managerName, phone })
        .returning({ id: users.id })

      await db.insert(restaurants).values({
        managerId: manager.id,
        name: restaurantName,
      })

      set.status = 'No Content'
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        managerName: t.String({ minLength: 1 }),
        phone: t.Optional(t.String({ minLength: 1 })),
        restaurantName: t.String({ minLength: 1 }),
      }),
    },
  )

app.listen(ENV.PORT, (server) => {
  console.log(`HTTP server running at: ${server.url}`)
})
