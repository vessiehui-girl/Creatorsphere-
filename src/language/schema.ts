import { sqliteTable, text, integer, timestamp } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('passwordHash').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});
