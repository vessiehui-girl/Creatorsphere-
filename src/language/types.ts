// Shared TypeScript interfaces used by both brain (backend) and face (frontend)

export interface User {
  id: number;
  email: string;
  createdAt: Date | null;
}

export interface ConnectedPlatform {
  id: number;
  userId: number;
  platform: string;
  accessToken: string | null;
  refreshToken: string | null;
  connectedAt: Date | null;
}

export interface VaultItem {
  id: number;
  userId: number;
  title: string;
  content: string | null;
  mediaUrl: string | null;
  createdAt: Date | null;
}

export interface Post {
  id: number;
  userId: number;
  vaultItemId: number | null;
  platform: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date | null;
}

export interface ScheduledPost {
  id: number;
  postId: number;
  scheduledFor: Date;
  createdAt: Date | null;
}

export interface AnalyticsSnapshot {
  id: number;
  userId: number;
  platform: string;
  metrics: Record<string, unknown>;
  snapshotAt: Date | null;
}
