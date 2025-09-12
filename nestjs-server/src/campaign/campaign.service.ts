// src/campaign/campaign.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Campaign } from '../schemas/campaign.schema';
import { CreateCampaignDto } from './dtos/CreateCampaign.dto';
import { UpdateCampaignDto } from './dtos/UpdateCampaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>
  ) {}

  async createCampaign(createCampaignDto: CreateCampaignDto) {
    const campaign = new this.campaignModel(createCampaignDto);
    return await campaign.save();
  }

  async getCampaigns() {
    return await this.campaignModel.find().exec();
  }

  async getCampaignsByWorkspace(workspaceId: string) {
    return await this.campaignModel
      .find({ workspaceId: new Types.ObjectId(workspaceId) })
      .exec();
  }

  async getCampaignById(id: string) {
    return await this.campaignModel.findById(id).exec();
  }

  async updateCampaign(id: string, updateCampaignDto: UpdateCampaignDto) {
    return await this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .exec();
  }

  async deleteCampaign(id: string) {
    return await this.campaignModel.findByIdAndDelete(id).exec();
  }
}
