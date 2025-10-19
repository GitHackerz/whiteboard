import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.headers['user-agent'] || '';
    const startTime = Date.now();
    const requestId =
      req.headers['x-request-id'] ||
      `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add request ID to request for correlation
    (req as any).requestId = requestId;

    // Log incoming request
    this.logger.info(`${method} ${originalUrl} - Request started`, {
      requestId,
      ip,
      userAgent,
      userId: (req as any).user?.id,
    });

    // Log request body for POST/PUT/PATCH (excluding sensitive data)
    if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
      const safeBody = this.sanitizeBody(req.body);
      this.logger.info(`Request Body`, {
        requestId,
        method,
        url: originalUrl,
        body: safeBody,
      });
    }

    // Capture response data
    const originalSend = res.send;
    res.send = function (body: any) {
      return originalSend.call(this, body);
    };

    // Log response
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      // Log response with method, status code, and duration
      const statusColor = statusCode >= 400 ? 'error' : 'info';
      const statusText = statusCode >= 400 ? 'ERROR' : 'OK';

      this.logger.log(
        statusColor,
        `${method} ${originalUrl} - ${statusCode} ${statusText} (${duration}ms)`,
        {
          requestId,
          statusCode,
          duration: `${duration}ms`,
          ip,
          userAgent,
          userId: (req as any).user?.id,
        },
      );
    });

    next();
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };

    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'token',
      'authorization',
      'secret',
      'creditCard',
      'ssn',
    ];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    // Recursively sanitize nested objects
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeBody(sanitized[key]);
      }
    });

    return sanitized;
  }
}
