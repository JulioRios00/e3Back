import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Sentry from '@sentry/node';

@Controller('test')
export class TestController {
  constructor(private prisma: PrismaService) {}
  
  @Get('health')
  async healthCheck() {
    // Ping DB to keep Neon alive on every health check
    let dbStatus = 'connected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'disconnected';
    }

    return {
      status: dbStatus === 'connected' ? 'healthy' : 'degraded',
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
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

  @Post('create-admin')
  async createAdminUser(@Body() data: { email: string; password: string; firstName: string; lastName: string; birthday: string }) {
    // This endpoint helps create an admin user for testing
    try {
      const adminData = {
        ...data,
        role: 'ADMIN' // This will need to be handled in the registration logic
      };
      
      return {
        status: 'admin_creation_attempted',
        message: 'Admin user creation attempted - check server logs',
        data: adminData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('check-users')
  async checkUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      return {
        status: 'success',
        message: 'Users retrieved',
        totalUsers: users.length,
        users: users,
        adminUsers: users.filter(u => u.role === 'ADMIN').length,
        regularUsers: users.filter(u => u.role === 'USER').length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('promote-to-admin')
  async promoteToAdmin(@Body() data: { email: string }) {
    try {
      const user = await this.prisma.user.update({
        where: { email: data.email },
        data: { role: 'ADMIN' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      return {
        status: 'success',
        message: 'User promoted to admin',
        user: user,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
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
