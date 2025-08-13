import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageTemplateDto } from 'src/message-template/dtos/CreateMessageTemplate.dto';
import { MessageTemplate } from 'src/schemas/messageTemplate.schema';
import { Model } from 'mongoose';
import { UpdateMessageTemplateDto } from 'src/message-template/dtos/UpdateMessageTemplate.dto';

@Injectable()
export class MessageTemplateService {
  constructor(
    @InjectModel(MessageTemplate.name) private messageTemplateModel: Model<MessageTemplate>
  ) {}

  async createMessageTemplate(createMessageTemplateDto: CreateMessageTemplateDto) {
    const messageTemplate = new this.messageTemplateModel(createMessageTemplateDto);
    return await messageTemplate.save();
  }

  async getMessageTemplates() {
    return await this.messageTemplateModel.find().exec();
  }

  async getMessageTemplateById(id: string) {
    return await this.messageTemplateModel.findById(id).exec();
  }

  async updateMessageTemplate(id: string, updateMessageTemplateDto: UpdateMessageTemplateDto) {
    return await this.messageTemplateModel.findByIdAndUpdate(id, updateMessageTemplateDto, { new: true }).exec();
  }

  async deleteMessageTemplate(id: string) {
    return await this.messageTemplateModel.findByIdAndDelete(id).exec();
  }
}
