import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/guards';
import type { AuthUserPayload } from '../auth/types/auth-request.type';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard)
  @Get('summary')
  getSummary(@Req() req: Request & { user: AuthUserPayload }) {
    const tokenId = req.user.tokenId;
    return this.dashboardService.getSummaryByTokenId(tokenId);
  }

  @UseGuards(AuthGuard)
  @Get('weekly')
  getWeekly(@Req() req: Request & { user: AuthUserPayload }) {
    const tokenId = req.user.tokenId;
    return this.dashboardService.getWeeklyByTokenId(tokenId);
  }
}
