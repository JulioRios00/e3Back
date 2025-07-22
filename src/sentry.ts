import * as Sentry from '@sentry/node';

export function initializeSentry() {
  if (!process.env.SENTRY_DSN) {
    console.warn('SENTRY_DSN not configured - Sentry monitoring disabled');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session Replay (optional)
    integrations: [
      // Enable HTTP calls tracing
      Sentry.httpIntegration(),
    ],
    
    // Enable automatic error capturing
    beforeSend(event, hint) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Sentry event captured:', event.exception?.values?.[0]?.value || event.message);
      }
      return event;
    },
    
    // Filter out some common noise
    ignoreErrors: [
      // Ignore validation errors from class-validator
      'ValidationError',
    ],
  });

  console.log('✅ Sentry initialized successfully');
}
