import * as Sentry from '@sentry/node';

export function initializeSentry() {
  if (!process.env.SENTRY_DSN) {
    console.warn('SENTRY_DSN not configured - Sentry monitoring disabled');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    
    // Release tracking for better error correlation
    release: process.env.HEROKU_SLUG_COMMIT || 'unknown',
    
    // Performance Monitoring - lower sampling in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session Replay and integrations
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
      // Ignore common client-side errors
      'Network request failed',
      'fetch',
    ],

    // Server name for better identification
    serverName: process.env.DYNO || 'local-development',
    
    // Additional tags for production tracking
    initialScope: {
      tags: {
        component: 'e3audio-api',
        platform: 'heroku',
      },
    },
  });

  console.log(`✅ Sentry initialized successfully for ${process.env.NODE_ENV || 'development'}`);
}
