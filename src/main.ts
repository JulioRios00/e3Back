import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { initializeSentry } from './sentry';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';
import { SentryPerformanceInterceptor } from './common/interceptors/sentry-performance.interceptor';

async function bootstrap() {
  // Initialize Sentry first
  initializeSentry();
  
  const app = await NestFactory.create(AppModule);
  
  // Global exception filter for Sentry
  app.useGlobalFilters(new SentryExceptionFilter());
  
  // Global performance interceptor
  app.useGlobalInterceptors(new SentryPerformanceInterceptor());
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enhanced CORS configuration for mobile apps
  app.enableCors({
    origin: true, // Allow all origins for development/mobile apps
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🎸 E3Audio API is running on: http://localhost:${port}`);
}
bootstrap();
