import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../../schemas/contact.schema';
import { Campaign } from '../../schemas/campaign.schema';
import { User } from '../../schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getContactsPerUser(workspaceId: string) {
    return this.contactModel.aggregate([
      { $match: { workspaceId: workspaceId } },
      { $group: { _id: '$createdBy', count: { $sum: 1 } } },
      {
        $lookup: {
          from: this.userModel.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          user: '$user.email',
          count: 1,
        },
      },
    ]);
  }

  async getCampaignsByStatus(workspaceId: string) {
    return this.campaignModel.aggregate([
      { $match: { workspaceId: workspaceId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);
  }
}