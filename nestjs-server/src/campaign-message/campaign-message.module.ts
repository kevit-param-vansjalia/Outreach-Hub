import { Module } from '@nestjs/common';
import { CampaignMessageController } from './campaign-message.controller';
import { CampaignMessagesService } from './campaign-message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignMessage, CampaignMessageSchema } from '../schemas/campaign-message.schema';
import { Campaign, CampaignSchema } from '../schemas/campaign.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([
    {name: CampaignMessage.name , schema: CampaignMessageSchema},
    {name: Campaign.name, schema: CampaignSchema}
  ])],
  controllers: [CampaignMessageController],
  providers: [CampaignMessagesService]
})
export class CampaignMessageModule {}
