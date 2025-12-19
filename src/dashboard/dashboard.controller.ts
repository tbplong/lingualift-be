import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/guards';
import { User } from 'src/auth/decorators';
import { RequiredUserIdPipe } from '../auth/pipes/required-user-id.pipe';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard)
  @Get('summary')
  async getSummary(@User(RequiredUserIdPipe) userId: string) {
    return this.dashboardService.getSummary(userId);
  }

  @UseGuards(AuthGuard)
  @Get('weekly')
  async getWeekly(@User(RequiredUserIdPipe) userId: string) {
    return this.dashboardService.getWeekly(userId);
  }
}
