import { Controller, Get, Post, Body } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Controller('test')
export class TestController {
  
  @Get('sentry')
  testSentry() {
    // Test Sentry error capturing
    Sentry.captureMessage('Test message from E3Audio API', 'info');
    
    return {
      message: 'Sentry test message sent! Check your Sentry dashboard.',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('error')
  testError() {
    // Test error capturing
    throw new Error('This is a test error for Sentry monitoring');
  }

  @Post('slow')
  testSlowEndpoint(@Body() data: any) {
    // Simulate slow endpoint (>1000ms) to test performance monitoring
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'This was a slow endpoint (2 seconds)',
          data,
          timestamp: new Date().toISOString(),
        });
      }, 2000);
    });
  }
}
