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

  app.enableCors();
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🎸 E3Audio API is running on: http://localhost:${port}`);
}
bootstrap();
