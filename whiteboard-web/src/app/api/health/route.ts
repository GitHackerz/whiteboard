import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Basic health check
        const healthData = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
            memory: {
                used:
                    Math.round(
                        (process.memoryUsage().heapUsed / 1024 / 1024) * 100,
                    ) / 100,
                total:
                    Math.round(
                        (process.memoryUsage().heapTotal / 1024 / 1024) * 100,
                    ) / 100,
            },
            checks: {
                server: 'ok',
            },
        };

        return NextResponse.json(healthData, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Content-Type': 'application/json',
            },
        });
    } catch {
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: 'Health check failed',
            },
            {
                status: 503,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}
