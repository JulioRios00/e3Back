import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Get('birthdays/today')
  async getTodaysBirthdays() {
    return this.adminService.getTodaysBirthdays();
  }

  @Get('birthdays/upcoming')
  async getUpcomingBirthdays(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 7;
    return this.adminService.getUpcomingBirthdays(daysNumber);
  }
}