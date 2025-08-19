import { Module } from '@nestjs/common';
import { MessageTemplateController } from './message-template.controller';
import { MessageTemplateService } from './message-template.service';
import { MessageTemplate, MessageTemplateSchema } from 'src/schemas/messageTemplate.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([
          {
            name: MessageTemplate.name,
            schema: MessageTemplateSchema,
          },
          ])
        ],
  controllers: [MessageTemplateController],
  providers: [MessageTemplateService]
})
export class MessageTemplateModule {}
