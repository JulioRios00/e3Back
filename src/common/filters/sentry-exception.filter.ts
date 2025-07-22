import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { Response } from 'express';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message = typeof errorResponse === 'string' 
        ? errorResponse 
        : (errorResponse as any).message || exception.message;
    }

    // Log to Sentry for non-4xx errors or specific important 4xx errors
    if (status >= 500 || status === 409) { // 500+ errors and conflicts
      Sentry.captureException(exception, {
        tags: {
          endpoint: request.url,
          method: request.method,
          statusCode: status,
          userAgent: request.headers['user-agent'],
          origin: request.headers.origin,
        },
        extra: {
          headers: request.headers,
          body: request.body,
          params: request.params,
          query: request.query,
          ip: request.ip,
        },
        user: {
          id: request.user?.id,
          email: request.user?.email,
        },
      });
    }

    // Console log for development and mobile debugging
    console.error(`[${request.method}] ${request.url} - ${status}:`, {
      error: exception instanceof Error ? exception.message : 'Unknown error',
      userAgent: request.headers['user-agent'],
      origin: request.headers.origin,
      ip: request.ip,
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
