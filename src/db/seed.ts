/* eslint-disable drizzle/enforce-delete-with-where */
import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'
import chalk from 'chalk'

import { db } from './connection'
import {
  authLinks,
  orderItems,
  orders,
  products,
  restaurants,
  users,
} from './schema'

await db.delete(authLinks)
await db.delete(users)
await db.delete(restaurants)
await db.delete(orderItems)
await db.delete(orders)
await db.delete(products)

console.info(chalk.yellow('✔ Database reset!'))

const [customer1, customer2] = await db
  .insert(users)
  .values([
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: 'customer',
    },
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: 'customer',
    },
  ])
  .returning()

console.info(chalk.yellow('✔ Created customers!'))

const [manager] = await db
  .insert(users)
  .values([
    {
      email: 'admin@admin.com',
      name: faker.person.fullName(),
      role: 'manager',
    },
  ])
  .returning({ id: users.id })

console.info(chalk.yellow('✔ Created manager!'))

const [restaurant] = await db
  .insert(restaurants)
  .values([
    {
      description: faker.lorem.paragraph(),
      managerId: manager.id,
      name: faker.company.name(),
    },
  ])
  .returning()

console.info(chalk.yellow('✔ Created restaurant!'))

function generateProduct() {
  return {
    name: faker.commerce.productName(),
    priceInCents: Number(
      faker.commerce.price({ min: 1900, max: 4900, dec: 0 }),
    ),
    restaurantId: restaurant.id,
    description: faker.commerce.productDescription(),
  }
}

const availableProducts = await db
  .insert(products)
  .values([
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
  ])
  .returning()

console.info(chalk.yellow('✔ Created products!'))

type OrderItemInsert = typeof orderItems.$inferInsert
type OrderToInsert = typeof orders.$inferInsert

const orderItemsToInsert: OrderItemInsert[] = []
const ordersToInsert: OrderToInsert[] = []

for (let index = 0; index < 200; index++) {
  const orderId = createId()

  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 4,
  })

  let totalInCents = 0

  orderProducts.forEach((orderProduct) => {
    const quantity = faker.number.int({ min: 1, max: 3 })

    totalInCents += quantity * orderProduct.priceInCents

    orderItemsToInsert.push({
      orderId,
      priceInCents: orderProduct.priceInCents,
      quantity,
      productId: orderProduct.id,
    })
  })

  ordersToInsert.push({
    id: orderId,
    restaurantId: restaurant.id,
    customerId: faker.helpers.arrayElement([customer1.id, customer2.id]),
    totalInCents,
    status: faker.helpers.arrayElement([
      'pending',
      'processing',
      'delivering',
      'delivered',
      'canceled',
    ]),
    createdAt: faker.date.recent({ days: 40 }),
  })
}

await db.insert(orders).values(ordersToInsert)
await db.insert(orderItems).values(orderItemsToInsert)

console.info(chalk.yellow('✔ Created orders!'))

console.info(chalk.green('Database seeded successfully!'))

process.exit()
