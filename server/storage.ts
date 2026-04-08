import { eq, desc, and } from 'drizzle-orm';
import { db } from './db.js';
import {
  users, connectedPlatforms, vaultItems, posts, scheduledPosts, analyticsSnapshots,
  type User, type InsertUser, type VaultItem, type InsertVaultItem,
  type Post, type InsertPost, type ScheduledPost, type InsertScheduledPost,
  type ConnectedPlatform, type InsertConnectedPlatform, type AnalyticsSnapshot,
} from '../shared/schema.js';

// --- Users ---

export async function getUserById(id: number): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user;
}

export async function createUser(data: InsertUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user;
}

// --- Connected Platforms ---

export async function getPlatformsByUserId(userId: number): Promise<ConnectedPlatform[]> {
  return db.select().from(connectedPlatforms).where(eq(connectedPlatforms.userId, userId));
}

export async function createPlatform(data: InsertConnectedPlatform): Promise<ConnectedPlatform> {
  const [platform] = await db.insert(connectedPlatforms).values(data).returning();
  return platform;
}

export async function deletePlatform(id: number, userId: number): Promise<void> {
  await db
    .delete(connectedPlatforms)
    .where(and(eq(connectedPlatforms.id, id), eq(connectedPlatforms.userId, userId)));
}

// --- Vault Items ---

export async function getVaultItemsByUserId(userId: number): Promise<VaultItem[]> {
  return db
    .select()
    .from(vaultItems)
    .where(eq(vaultItems.userId, userId))
    .orderBy(desc(vaultItems.createdAt));
}

export async function getVaultItemById(id: number): Promise<VaultItem | undefined> {
  const [item] = await db.select().from(vaultItems).where(eq(vaultItems.id, id));
  return item;
}

export async function createVaultItem(data: InsertVaultItem): Promise<VaultItem> {
  const [item] = await db.insert(vaultItems).values(data).returning();
  return item;
}

export async function updateVaultItem(id: number, data: Partial<InsertVaultItem>): Promise<VaultItem | undefined> {
  const [item] = await db
    .update(vaultItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(vaultItems.id, id))
    .returning();
  return item;
}

export async function deleteVaultItem(id: number): Promise<void> {
  await db.delete(vaultItems).where(eq(vaultItems.id, id));
}

// --- Posts ---

export async function getPostsByUserId(userId: number): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const [post] = await db.select().from(posts).where(eq(posts.id, id));
  return post;
}

export async function createPost(data: InsertPost): Promise<Post> {
  const [post] = await db.insert(posts).values(data).returning();
  return post;
}

export async function updatePost(id: number, data: Partial<InsertPost>): Promise<Post | undefined> {
  const [post] = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return post;
}

export async function deletePost(id: number): Promise<void> {
  await db.delete(posts).where(eq(posts.id, id));
}

// --- Scheduled Posts ---

export async function getScheduledPostsByUserId(userId: number): Promise<ScheduledPost[]> {
  return db
    .select()
    .from(scheduledPosts)
    .where(eq(scheduledPosts.userId, userId))
    .orderBy(desc(scheduledPosts.scheduledFor));
}

export async function getScheduledPostById(id: number): Promise<ScheduledPost | undefined> {
  const [scheduled] = await db.select().from(scheduledPosts).where(eq(scheduledPosts.id, id));
  return scheduled;
}

export async function createScheduledPost(data: InsertScheduledPost): Promise<ScheduledPost> {
  const [scheduled] = await db.insert(scheduledPosts).values(data).returning();
  return scheduled;
}

export async function deleteScheduledPost(id: number): Promise<void> {
  await db.delete(scheduledPosts).where(eq(scheduledPosts.id, id));
}

// --- Analytics ---

export async function getAnalyticsByUserId(userId: number): Promise<AnalyticsSnapshot[]> {
  return db
    .select()
    .from(analyticsSnapshots)
    .where(eq(analyticsSnapshots.userId, userId))
    .orderBy(desc(analyticsSnapshots.recordedAt));
}

export async function createAnalyticsSnapshot(data: typeof analyticsSnapshots.$inferInsert): Promise<AnalyticsSnapshot> {
  const [snapshot] = await db.insert(analyticsSnapshots).values(data).returning();
  return snapshot;
}
