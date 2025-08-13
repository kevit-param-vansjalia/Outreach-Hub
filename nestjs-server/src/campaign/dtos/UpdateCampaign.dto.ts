import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignDto } from './CreateCampaign.dto';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}