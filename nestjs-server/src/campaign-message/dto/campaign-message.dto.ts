import { IsNotEmpty, IsString, IsArray, IsMongoId } from 'class-validator';

export class CreateCampaignMessageDto {
  @IsString()
  @IsNotEmpty()
  workspace: string;

  @IsString()
  @IsNotEmpty()
  campaign: string;

  @IsArray()
  @IsMongoId({ each: true })
  contactIds: string[];

  @IsString()
  @IsNotEmpty()
  messageContent: string;
}