// Shared constants used by both brain (backend) and face (frontend)

export const SUPPORTED_PLATFORMS = [
  'instagram',
  'tiktok',
  'youtube',
  'twitter',
  'facebook',
  'linkedin',
  'pinterest',
] as const;

export type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number];

export const POST_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  FAILED: 'failed',
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

export const MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export const API_BASE = '/api';
