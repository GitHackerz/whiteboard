'use server';

import { z } from 'zod';
import { handleRequest } from './utils/handleRequest';
import { ApiResponse, UserSettings } from './utils/types';

// Validation Schema
const UpdateSettingsSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  language: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  assignmentNotifications: z.boolean().optional(),
  messageNotifications: z.boolean().optional(),
  announcementNotifications: z.boolean().optional(),
  profileVisibility: z.enum(['public', 'private', 'friends']).optional(),
  showEmail: z.boolean().optional(),
});

// Types
type UpdateSettingsInput = z.infer<typeof UpdateSettingsSchema>;

/**
 * Get current user's settings
 */
export async function getSettings(): Promise<ApiResponse<UserSettings>> {
  return handleRequest<UserSettings>('get', 'settings');
}

/**
 * Update user settings
 */
export async function updateSettings(
  input: UpdateSettingsInput,
): Promise<ApiResponse<UserSettings>> {
  // Validate input
  const validation = UpdateSettingsSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: validation.error.issues[0].message,
      },
    };
  }

  return handleRequest<UserSettings>('patch', 'settings', validation.data);
}
