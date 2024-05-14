/* eslint-disable drizzle/enforce-delete-with-where */
import { faker } from '@faker-js/faker'
import chalk from 'chalk'

import { db } from './connection'
import { restaurants, users } from './schema'

await db.delete(users)
await db.delete(restaurants)

console.info(chalk.yellow('✔ Database reset!'))

await db.insert(users).values([
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

await db.insert(restaurants).values([
  {
    description: faker.lorem.paragraph(),
    managerId: manager.id,
    name: faker.company.name(),
  },
])

console.info(chalk.yellow('✔ Created restaurant!'))

console.info(chalk.green('Database seeded successfully!'))

process.exit()
