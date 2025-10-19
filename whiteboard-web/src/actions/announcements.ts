'use server';

import { z } from 'zod';
import { handleRequest, buildQueryString } from './utils/handleRequest';
import type { ApiResponse } from './utils/types';

// Validation Schemas
const CreateAnnouncementSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  isPinned: z.boolean().optional(),
});

const UpdateAnnouncementSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  isPinned: z.boolean().optional(),
});

const QueryAnnouncementsSchema = z.object({
  courseId: z.string().uuid().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

// Types
type CreateAnnouncementInput = z.infer<typeof CreateAnnouncementSchema>;
type UpdateAnnouncementInput = z.infer<typeof UpdateAnnouncementSchema>;
type QueryAnnouncementsInput = z.infer<typeof QueryAnnouncementsSchema>;

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    code: string;
    title: string;
  };
}

/**
 * Get all announcements (optionally filtered by course)
 */
export async function getAnnouncements(
  params: QueryAnnouncementsInput = {}
): Promise<ApiResponse<any>> {
  const validation = QueryAnnouncementsSchema.safeParse(params);

  if (!validation.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: validation.error.issues[0].message,
      },
    };
  }

  const queryString = await buildQueryString(validation.data);
  return handleRequest('get', `announcements${queryString}`);
}

/**
 * Get announcement by ID
 */
export async function getAnnouncementById(
  announcementId: string
): Promise<ApiResponse<Announcement>> {
  if (!announcementId) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Announcement ID is required',
      },
    };
  }

  return handleRequest<Announcement>('get', `announcements/${announcementId}`);
}

/**
 * Create new announcement (Instructor only)
 */
export async function createAnnouncement(
  input: CreateAnnouncementInput
): Promise<ApiResponse<Announcement>> {
  const validation = CreateAnnouncementSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: validation.error.issues[0].message,
      },
    };
  }

  return handleRequest<Announcement>('post', 'announcements', validation.data);
}

/**
 * Update announcement (Instructor only)
 */
export async function updateAnnouncement(
  announcementId: string,
  input: UpdateAnnouncementInput
): Promise<ApiResponse<Announcement>> {
  if (!announcementId) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Announcement ID is required',
      },
    };
  }

  const validation = UpdateAnnouncementSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: validation.error.issues[0].message,
      },
    };
  }

  return handleRequest<Announcement>(
    'put',
    `announcements/${announcementId}`,
    validation.data
  );
}

/**
 * Delete announcement (Instructor only)
 */
export async function deleteAnnouncement(
  announcementId: string
): Promise<ApiResponse<void>> {
  if (!announcementId) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Announcement ID is required',
      },
    };
  }

  return handleRequest<void>('delete', `announcements/${announcementId}`);
}
