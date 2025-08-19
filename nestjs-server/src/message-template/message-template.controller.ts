import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { CreateMessageTemplateDto } from './dtos/CreateMessageTemplate.dto';
import { MessageTemplateService } from './message-template.service';
import mongoose from 'mongoose';
import { UpdateMessageTemplateDto } from './dtos/UpdateMessageTemplate.dto';

@Controller('messageTemplate')
export class MessageTemplateController {
    constructor(private messageTemplatesService: MessageTemplateService) {}

@Post('create')
    createmessageTemplate(@Body() createmessageTemplateDto: CreateMessageTemplateDto) {
        console.log(createmessageTemplateDto);
        return this.messageTemplatesService.createMessageTemplate(createmessageTemplateDto);
    }

@Get('get')
    getMessageTemplates() {
        return this.messageTemplatesService.getMessageTemplates();
    }

    @Get('get/:id')
    async getmessageTemplateById(@Param('id') id: string) {

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('MessageTemplate Not found', 404);
        const findMessageTemplate = await this.messageTemplatesService.getMessageTemplateById(id);
        if (!findMessageTemplate) throw new HttpException('MessageTemplate Not Found', 404);
        return findMessageTemplate;
    }

    @Patch('update/:id')
    async updatemessageTemplate(@Param('id') id: string, @Body() updateMessageTemplateDto: UpdateMessageTemplateDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const updatedMessageTemplate = await this.messageTemplatesService.updateMessageTemplate(id, updateMessageTemplateDto);
        if(!updatedMessageTemplate) throw new HttpException('MessageTemplate Not Found', 404);
        return updatedMessageTemplate;
    }

    @Delete('delete/:id')
    async deleteMessageTemplate(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const deleteMessageTemplate = await this.messageTemplatesService.deleteMessageTemplate(id);
        return deleteMessageTemplate;
    }
};
