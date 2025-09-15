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
    
    const query: any = {};
    query.workspaceId = workspaceId;
    try {
      const result = await this.campaignModel.find(query).exec();
      return result;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
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