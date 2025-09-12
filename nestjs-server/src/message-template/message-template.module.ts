import { Module } from '@nestjs/common';
import { MessageTemplateController } from './message-template.controller';
import { MessageTemplateService } from './message-template.service';
import { MessageTemplate, MessageTemplateSchema } from 'src/schemas/messageTemplate.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: MessageTemplate.name,
        schema: MessageTemplateSchema,
      },
      { name: User.name, schema: UserSchema }, // Add User schema for RolesGuard
    ]),
  ],
  controllers: [MessageTemplateController],
  providers: [MessageTemplateService]
})
export class MessageTemplateModule {}
