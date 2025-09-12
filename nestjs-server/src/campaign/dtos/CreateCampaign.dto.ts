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

  @IsOptional()
  @IsMongoId()
  templateId?: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedTags?: string[];

  @IsMongoId()
  workspaceId: string;

  @IsOptional()
  @IsMongoId()
  createdBy: string;
}
