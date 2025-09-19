import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats/contacts-per-user/:workspaceId')
  getContactsPerUser(@Param('workspaceId') workspaceId: string) {
    return this.dashboardService.getContactsPerUser(workspaceId);
  }

  @Get('stats/campaigns-by-status/:workspaceId')
  getCampaignsByStatus(@Param('workspaceId') workspaceId: string) {
    return this.dashboardService.getCampaignsByStatus(workspaceId);
  }
}