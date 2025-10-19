'use server';

import { handleRequest, buildQueryString } from './utils/handleRequest';
import type {
    CreateModuleDto,
    UpdateModuleDto,
    CreateResourceDto,
    UpdateResourceDto,
    ResourceProgressDto,
    ModuleProgressDto,
    CourseModuleResponse,
    ModuleResourceResponse,
    CourseStatisticsResponse,
    ResourceProgress,
    ModuleProgress,
} from './utils/types';

/**
 * Get all modules for a specific course
 */
export async function getCourseModules(courseId: string) {
  return handleRequest<CourseModuleResponse[]>('get', `modules/course/${courseId}`);
}

/**
 * Create a new module for a course
 */
export async function createModule(
  courseId: string,
  data: CreateModuleDto
) {
  return handleRequest<CourseModuleResponse>('post', 'modules', { ...data, courseId });
}

/**
 * Update an existing module
 */
export async function updateModule(
  moduleId: string,
  data: UpdateModuleDto
) {
  return handleRequest<CourseModuleResponse>('put', `modules/${moduleId}`, data);
}

/**
 * Delete a module
 */
export async function deleteModule(moduleId: string) {
  return handleRequest<{ message: string }>('delete', `modules/${moduleId}`);
}

/**
 * Get a specific module with all its resources
 */
export async function getModule(moduleId: string) {
  return handleRequest<CourseModuleResponse>('get', `modules/${moduleId}`);
}

/**
 * Create a resource within a module
 */
export async function createResource(
  moduleId: string,
  data: CreateResourceDto
) {
  return handleRequest<ModuleResourceResponse>('post', 'modules/resources', { ...data, moduleId });
}

/**
 * Update an existing resource
 */
export async function updateResource(
  resourceId: string,
  data: UpdateResourceDto
) {
  return handleRequest<ModuleResourceResponse>('put', `modules/resources/${resourceId}`, data);
}

/**
 * Delete a resource
 */
export async function deleteResource(resourceId: string) {
  return handleRequest<{ message: string }>('delete', `modules/resources/${resourceId}`);
}

/**
 * Update resource progress for a student
 */
export async function updateResourceProgress(
  resourceId: string,
  data: ResourceProgressDto
) {
  return handleRequest<{ message: string; progress: ResourceProgress }>('post', `modules/resources/${resourceId}/progress`, data);
}

/**
 * Update module progress for a student
 */
export async function updateModuleProgress(
  moduleId: string,
  data: ModuleProgressDto
) {
  return handleRequest<{ message: string; progress: ModuleProgress }>('post', `modules/${moduleId}/progress`, data);
}

/**
 * Get course statistics including progress for all students
 */
export async function getCourseStatistics(courseId: string) {
  return handleRequest<CourseStatisticsResponse>('get', `modules/course/${courseId}/statistics`);
}

/**
 * Mark a resource as completed by a student
 */
export async function completeResource(
  resourceId: string,
  userId: string
) {
  return handleRequest<{ message: string; progress: ResourceProgress }>('post', `modules/resources/${resourceId}/progress`, {
    userId,
    isCompleted: true,
    viewedAt: new Date().toISOString(),
  });
}

/**
 * Get all modules for a course with progress data
 */
export async function getCourseModulesWithProgress(
  courseId: string,
  userId: string
) {
  const queryString = await buildQueryString({ userId });
  return handleRequest<CourseModuleResponse[]>('get', `modules/course/${courseId}${queryString}`);
}
