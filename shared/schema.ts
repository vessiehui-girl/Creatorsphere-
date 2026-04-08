import { pgTable, text, integer, timestamp, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('passwordHash').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});
