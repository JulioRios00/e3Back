import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        birthday: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        birthday: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getTodaysBirthdays() {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        birthday: true,
      },
    });

    return users.filter(user => {
      const birthday = new Date(user.birthday);
      return birthday.getMonth() + 1 === todayMonth && birthday.getDate() === todayDay;
    });
  }

  async getUpcomingBirthdays(days: number = 7) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        birthday: true,
      },
    });

    return users.filter(user => {
      const birthday = new Date(user.birthday);
      const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
      
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }

      return thisYearBirthday >= today && thisYearBirthday <= futureDate;
    });
  }

  @Cron('*/4 * * * *')
  async keepAlive() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.log('Keep-alive: DB ping OK');
    } catch (error) {
      this.logger.error('Keep-alive: DB ping failed', error.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleBirthdayNotifications() {
    const todaysBirthdays = await this.getTodaysBirthdays();
    
    if (todaysBirthdays.length > 0) {
      console.log('🎉 Birthday Notifications:');
      todaysBirthdays.forEach(user => {
        console.log(`🎂 ${user.firstName} ${user.lastName} (${user.email}) has a birthday today!`);
      });
      
      // Here you could integrate with email service, SMS, or other notification systems
      // For example: await this.emailService.sendBirthdayNotification(todaysBirthdays);
    }
  }
}