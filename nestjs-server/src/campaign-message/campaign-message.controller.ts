// src/campaign-message/campaign-message.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseGuards, HttpException } from '@nestjs/common';
import { CampaignMessagesService } from './campaign-message.service';
import { CreateCampaignMessageDto } from './dto/campaign-message.dto';
import { UpdateCampaignMessageDto } from './dto/updatecampaign-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('campaign-message')
@UseGuards(JwtAuthGuard)
export class CampaignMessageController {
  constructor(
    private readonly campaignMessagesService: CampaignMessagesService,
  ) {}

  @Post('create')
  create(
    @Body() dto: CreateCampaignMessageDto,
    @Req() req,
  ) {
    // The ValidationPipe handles the checks for workspace and campaign from the DTO.
    return this.campaignMessagesService.create(dto, req.user._id);
  }

  @Get('get/:workspaceId/:campaignId')
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('campaignId') campaignId: string,
  ) {
    return this.campaignMessagesService.findAll(workspaceId, campaignId);
  }

  // renamed to avoid route ambiguity with the above
  @Get('getById/:id')
  findOne(@Param('id') id: string) {
    return this.campaignMessagesService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCampaignMessageDto) {
    return this.campaignMessagesService.update(id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.campaignMessagesService.remove(id);
  }
}
