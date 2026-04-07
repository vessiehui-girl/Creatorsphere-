import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('passwordHash').notNull(),
  name: text('name'),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const connectedPlatforms = pgTable('connected_platforms', {
  id: serial('id').primaryKey(),
  userId: integer('userId').references(() => users.id),
  platform: text('platform'),
  connected: boolean('connected').default(false),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const vaultItems = pgTable('vault_items', {
  id: serial('id').primaryKey(),
  userId: integer('userId').references(() => users.id),
  type: text('type'),
  title: text('title'),
  content: text('content'),
  fileUrl: text('fileUrl'),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('userId').references(() => users.id),
  mediaUrl: text('mediaUrl'),
  caption: text('caption'),
  status: text('status').default('draft'),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const scheduledPosts = pgTable('scheduled_posts', {
  id: serial('id').primaryKey(),
  userId: integer('userId').references(() => users.id),
  postId: integer('postId').references(() => posts.id),
  platform: text('platform'),
  scheduledFor: timestamp('scheduledFor'),
  status: text('status').default('pending'),
});

export const analyticsSnapshots = pgTable('analytics_snapshots', {
  id: serial('id').primaryKey(),
  userId: integer('userId').references(() => users.id),
  platform: text('platform'),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  capturedAt: timestamp('capturedAt').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type ConnectedPlatform = typeof connectedPlatforms.$inferSelect;
export type VaultItem = typeof vaultItems.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;
