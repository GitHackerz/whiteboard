'use server';

import { z } from 'zod';
import { handleRequest } from './utils/handleRequest';
import { ApiResponse, AuthTokens, User, Role } from './utils/types';

// Validation Schemas
const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(Role).optional(),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Types
type RegisterInput = z.infer<typeof RegisterSchema>;
type LoginInput = z.infer<typeof LoginSchema>;
type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

/**
 * Register a new user
 */
export async function register(
  input: RegisterInput,
): Promise<ApiResponse<User>> {
  // Validate input
  const validation = RegisterSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: validation.error.issues[0].message,
      },
    };
  }

  return handleRequest<User>('post', 'auth/register', validation.data, false);
}

/**
 * Login user and get tokens
 */
export async function login(
  input: LoginInput,
): Promise<ApiResponse<AuthTokens>> {

  return handleRequest<AuthTokens>('post', 'auth/login', {
    email: input.email,
    password: input.password,
  }, false);
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(
  input: RefreshTokenInput,
): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  // Validate input
  const validation = RefreshTokenSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: validation.error.issues[0].message,
      },
    };
  }

  return handleRequest<{ accessToken: string; refreshToken: string }>(
    'post',
    'auth/refresh',
    validation.data,
    false,
  );
}

/**
 * Logout user
 */
export async function logout(
  input: RefreshTokenInput,
): Promise<ApiResponse<void>> {
  // Validate input
  const validation = RefreshTokenSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: validation.error.issues[0].message,
      },
    };
  }

  return handleRequest<void>('post', 'auth/logout', validation.data, false);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return handleRequest<User>('get', 'auth/me');
}
