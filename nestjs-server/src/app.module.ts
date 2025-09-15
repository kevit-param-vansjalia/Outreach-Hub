import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { CampaignsModule } from './campaign/campaign.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://paramvansjalia:param2003@learningproject.9uhsmza.mongodb.net/OutreachHub?retryWrites=true&w=majority&appName=LearningProject'),
    UserModule,
    ContactModule,
    WorkspaceModule,
    CampaignsModule,
    MessageTemplateModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
