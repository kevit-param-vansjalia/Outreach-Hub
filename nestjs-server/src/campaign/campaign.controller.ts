import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { CreateCampaignDto } from './dtos/CreateCampaign.dto';
import { CampaignService } from './campaign.service';
import mongoose from 'mongoose';
import { UpdateCampaignDto } from './dtos/UpdateCampaign.dto';

@Controller('campaign')
export class CampaignController {
    constructor(private campaignsService: CampaignService) {}

@Post('create')
    createcampaign(@Body() createcampaignDto: CreateCampaignDto) {
        console.log(createcampaignDto);
        return this.campaignsService.createCampaign(createcampaignDto);
    }

@Get('get')
    getCampaigns() {
        return this.campaignsService.getCampaigns();
    }

    @Get('get/:id')
    async getcampaignById(@Param('id') id: string) {

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Campaign Not found', 404);
        const findCampaign = await this.campaignsService.getCampaignById(id);
        if (!findCampaign) throw new HttpException('Campaign Not Found', 404);
        return findCampaign;
    }

    @Patch('update/:id')
    async updatecampaign(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const updatedCampaign = await this.campaignsService.updateCampaign(id, updateCampaignDto);
        if(!updatedCampaign) throw new HttpException('Campaign Not Found', 404);
        return updatedCampaign;
    }

    @Delete('delete/:id')
    async deleteCampaign(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const deleteCampaign = await this.campaignsService.deleteCampaign(id);
        return deleteCampaign;
    }
};
