import { Module } from '@nestjs/common';
import { MessageTemplateController } from './message-template.controller';
import { MessageTemplateService } from './message-template.service';

@Module({
  controllers: [MessageTemplateController],
  providers: [MessageTemplateService]
})
export class MessageTemplateModule {}
