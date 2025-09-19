import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Contact, ContactSchema } from '../../schemas/contact.schema';
import { Campaign, CampaignSchema } from '../../schemas/campaign.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}