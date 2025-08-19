import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsNotEmpty,
  IsUrl
} from 'class-validator';
import { Type } from 'class-transformer';

class MessageDto {
  @IsEnum(['Text', 'Text-Image'])
  type: 'Text' | 'Text-Image';

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

class MessageLogDto {
  @IsMongoId()
  contactId: string;

  @IsOptional()
  @IsString()
  messageContent?: string;

  @IsOptional()
  sentAt?: Date;
}

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['Draft', 'Running', 'Completed'])
  status?: 'Draft' | 'Running' | 'Completed';

  @ValidateNested()
  @Type(() => MessageDto)
  message: MessageDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedTags?: string[];

  @IsMongoId()
  workspaceId: string;

  @IsOptional()
  @IsMongoId()
  createdBy: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageLogDto)
  messages?: MessageLogDto[];
}
