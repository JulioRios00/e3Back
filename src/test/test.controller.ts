import { Controller, Get, Post, Body } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Controller('test')
export class TestController {
  
  @Get('health')
  healthCheck() {
    return {
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      version: process.env.HEROKU_SLUG_COMMIT || 'unknown',
      sentry: !!process.env.SENTRY_DSN ? 'enabled' : 'disabled',
      cors: 'enabled',
    };
  }

  @Post('mobile-connectivity')
  testMobileConnectivity(@Body() data: any) {
    return {
      status: 'mobile_connection_successful',
      message: 'Mobile app can successfully connect to the API',
      receivedData: data,
      timestamp: new Date().toISOString(),
      cors: 'working',
    };
  }

  @Post('debug-registration')
  debugRegistration(@Body() data: any) {
    // This endpoint helps debug mobile registration issues
    console.log('🔍 Debug registration received:', {
      data,
      headers: data.headers || 'no headers info',
      timestamp: new Date().toISOString(),
    });

    return {
      status: 'debug_registration_received',
      message: 'Data received successfully - check server logs',
      receivedData: data,
      dataValidation: {
        hasEmail: !!data.email,
        hasPassword: !!data.password,
        hasFirstName: !!data.firstName,
        hasLastName: !!data.lastName,
        hasBirthday: !!data.birthday,
        emailFormat: data.email ? /\S+@\S+\.\S+/.test(data.email) : false,
        passwordLength: data.password ? data.password.length : 0,
      },
      timestamp: new Date().toISOString(),
    };
  }
  
  @Get('sentry')
  testSentry() {
    // Test Sentry error capturing
    Sentry.captureMessage('Test message from E3Audio API', 'info');
    
    return {
      message: 'Sentry test message sent! Check your Sentry dashboard.',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
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
          environment: process.env.NODE_ENV || 'development',
        });
      }, 2000);
    });
  }
}
