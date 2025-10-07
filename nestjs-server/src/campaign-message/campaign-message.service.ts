// src/campaign-messages/campaign-messages.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CampaignMessage } from '../schemas/campaign-message.schema';
import { CreateCampaignMessageDto } from './dto/campaign-message.dto';
import { UpdateCampaignMessageDto } from './dto/updatecampaign-message.dto';

@Injectable()
export class CampaignMessagesService {
  constructor(
    @InjectModel(CampaignMessage.name)
    private readonly campaignMessageModel: Model<CampaignMessage>,
  ) {}

  async create(
    dto: CreateCampaignMessageDto,
    userId: string,
  ) {
    const message = new this.campaignMessageModel({
      ...dto,
      createdBy: new Types.ObjectId(userId),
    });
    return message.save();
  }

  async findAll(workspaceId: string, campaignId: string) {
    return this.campaignMessageModel.find({
      workspace: new Types.ObjectId(workspaceId),
      campaign: new Types.ObjectId(campaignId),
    }).exec();
  }

  async findOne(id: string) {
    const message = await this.campaignMessageModel.findById(id).exec();
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(id: string, dto: UpdateCampaignMessageDto) {
    const updated = await this.campaignMessageModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    ).exec();
    if (!updated) throw new NotFoundException('Message not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.campaignMessageModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Message not found');
    return { message: 'Deleted successfully' };
  }
}
