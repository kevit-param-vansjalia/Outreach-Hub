import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { CampaignModule } from './campaign/campaign.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://paramvansjalia:Par%40kev.2025@learningproject.9uhsmza.mongodb.net/OutreachHub?retryWrites=true&w=majority&appName=LearningProject'),
    UserModule,
    ContactModule,
    WorkspaceModule,
    CampaignModule,
    MessageTemplateModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
