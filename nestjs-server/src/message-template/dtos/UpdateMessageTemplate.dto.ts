import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageTemplateDto } from './CreateMessageTemplate.dto';

export class UpdateMessageTemplateDto extends PartialType(CreateMessageTemplateDto) {}