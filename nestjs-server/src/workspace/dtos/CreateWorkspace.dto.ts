import {
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreateWorkspaceDto {
  
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsMongoId({ message: 'Invalid createdBy format' })
  createdBy?: string;
}