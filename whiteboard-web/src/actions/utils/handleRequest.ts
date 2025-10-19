'use server';

import { authOptions } from '@/app/api/auth/auth-options';
import axios, { AxiosRequestConfig } from 'axios';
import { getServerSession } from 'next-auth';

const SERVER_URL = process.env.SERVER_URL;

async function getAuthToken() {
    const session = await getServerSession(authOptions);
    return session?.accessToken;
}

export async function handleRequest<T>(
    method: 'get' | 'post' | 'patch' | 'put' | 'delete',
    urlPath: string,
    data?: any,
    withToken: boolean = true,
): Promise<{ success: boolean; data?: T; error?: any; message?: string }> {
    const config: AxiosRequestConfig = {
        method,
        url: `${SERVER_URL}/${urlPath}`,
        data,
        // Start with the required Cache-Control header
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        },
    };

    if (withToken) {
        const accessToken = await getAuthToken();
        if (!accessToken) {
            // If no accessToken available, don't add Authorization header
            // This prevents sending malformed Bearer tokens
            return {
                success: false,
                error: {
                    status: 401,
                    message: 'No authentication accessToken available',
                },
            };
        }
        // Merge Authorization into existing headers
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
        };
    }

    // Note: For FormData, axios automatically sets Content-Type with boundary
    // Don't manually set it as it will break file uploads

    try {
        const response = await axios(config);

        return response.data;
    } catch (error: any) {        
        return { 
            success: false, 
            error: { 
                code: error.response?.data?.error || 'ERROR', 
                message: error.response?.data?.error.message || 'An error occurred' 
            } 
        };
    }
}

/**
 * Build query string from params object
 */
export async function buildQueryString(params: Record<string, any>) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}
