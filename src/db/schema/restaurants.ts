import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const restaurants = pgTable('restaurants', {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  description: text('description'),
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  managerId: text('manager_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  name: text('name').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const restaurantsRelations = relations(restaurants, ({ one }) => {
  return {
    manager: one(users, {
      fields: [restaurants.managerId],
      references: [users.id],
      relationName: 'restaurante_manager',
    }),
  }
})
