import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Skip logging for common static file 404s to reduce noise
    const isCommonStaticFile404 =
      status === HttpStatus.NOT_FOUND &&
      /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/.test(
        request.url,
      );

    if (!isCommonStaticFile404) {
      // Log the error with full details
      this.logger.error(
        `Exception occurred`,
        exception instanceof Error ? exception : new Error(String(exception)),
        {
          requestId: (request as any).requestId,
          method: request.method,
          url: request.url,
          status,
          message,
          body: this.sanitizeBody(request.body),
          query: request.query,
          params: request.params,
          headers: this.sanitizeHeaders(request.headers),
          user: (request as any).user,
          ip: request.ip,
          userAgent: request.get('User-Agent'),
        },
      );
    }

    // Send response
    response.status(status).json({
      success: false,
      error: {
        code: error,
        message,
      },
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: (request as any).requestId,
    });
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };

    // Remove sensitive headers
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
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
