// src/campaign/campaign.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dtos/CreateCampaign.dto';
import { UpdateCampaignDto } from './dtos/UpdateCampaign.dto';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post('create')
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.createCampaign(createCampaignDto);
  }

  @Get('getByWorkspace/:workspaceId')
  getByWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.campaignService.getCampaignsByWorkspace(workspaceId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.campaignService.getCampaignById(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.updateCampaign(id, updateCampaignDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.campaignService.deleteCampaign(id);
  }
}
