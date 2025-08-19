import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { CampaignModule } from './campaign/campaign.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
  import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://paramvansjalia:Par%40kev.2025@learningproject.9uhsmza.mongodb.net/OutreachHub?retryWrites=true&w=majority&appName=LearningProject'),
    UserModule,
    ContactModule,
    WorkspaceModule,
    CampaignModule,
    MessageTemplateModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule],
  controllers: [],
  providers: [{
    provide:  APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
