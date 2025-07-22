import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryPerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.route?.path || request.url;
    
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          const response = context.switchToHttp().getResponse();
          
          // Add breadcrumb for successful requests
          Sentry.addBreadcrumb({
            message: `${method} ${url}`,
            category: 'http',
            level: 'info',
            data: {
              method,
              url: request.url,
              statusCode: response.statusCode,
              duration: `${duration}ms`,
            },
          });

          // Log slow requests (>1000ms) as performance issues
          if (duration > 1000) {
            Sentry.captureMessage(`Slow API response: ${method} ${url} took ${duration}ms`, 'warning');
          }
        },
        error: (error) => {
          const duration = Date.now() - start;
          
          // Add breadcrumb for failed requests
          Sentry.addBreadcrumb({
            message: `${method} ${url} - ERROR`,
            category: 'http',
            level: 'error',
            data: {
              method,
              url: request.url,
              duration: `${duration}ms`,
              error: error.message,
            },
          });
        },
      }),
    );
  }
}
