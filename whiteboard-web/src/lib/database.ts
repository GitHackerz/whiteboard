import Dexie, { Table } from 'dexie';

// Types based on the API
export interface CachedCourse {
  id: string;
  code: string;
  title: string;
  description: string;
  instructorId: string;
  schedule?: string;
  location?: string;
  maxEnrollment?: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
  modules?: any[];
  _cachedAt: number; // timestamp when cached
}

export interface CachedAssignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  maxPoints?: number;
  instructions?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    title: string;
    code: string;
  };
  _cachedAt: number;
}

export interface CachedMessage {
  id: string;
  content: string;
  senderId: string;
  recipientId?: string;
  courseId?: string;
  isAnnouncement: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    name: string;
    email: string;
  };
  _cachedAt: number;
}

export interface CachedAnnouncement {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  authorId: string;
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  _cachedAt: number;
}

export interface CachedUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  _cachedAt: number;
}

export class WhiteboardDB extends Dexie {
  courses!: Table<CachedCourse>;
  assignments!: Table<CachedAssignment>;
  messages!: Table<CachedMessage>;
  announcements!: Table<CachedAnnouncement>;
  users!: Table<CachedUser>;

  constructor() {
    super('WhiteboardDB');

    this.version(1).stores({
      courses: 'id, code, instructorId, _cachedAt',
      assignments: 'id, courseId, dueDate, _cachedAt',
      messages: 'id, senderId, recipientId, courseId, isAnnouncement, createdAt, _cachedAt',
      announcements: 'id, courseId, authorId, priority, isPublished, _cachedAt',
      users: 'id, email, role, _cachedAt',
    });
  }
}

export const db = new WhiteboardDB();

// Utility functions for cache management
export const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function isCacheValid(cachedAt: number): Promise<boolean> {
  return Date.now() - cachedAt < CACHE_DURATION;
}

export async function clearExpiredCache(): Promise<void> {
  const now = Date.now();
  const expiryTime = now - CACHE_DURATION;

  await Promise.all([
    db.courses.where('_cachedAt').below(expiryTime).delete(),
    db.assignments.where('_cachedAt').below(expiryTime).delete(),
    db.messages.where('_cachedAt').below(expiryTime).delete(),
    db.announcements.where('_cachedAt').below(expiryTime).delete(),
    db.users.where('_cachedAt').below(expiryTime).delete(),
  ]);
}

// Clean up expired cache on app start
if (typeof window !== 'undefined') {
  void clearExpiredCache();
}