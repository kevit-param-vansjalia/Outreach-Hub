import {
  IsString,
  IsEmail,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreateContactDto {
  
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsEmail({}, { message: 'Phone Number should be a string' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Tags cannot be empty' })
  @IsArray()
  tags: string[];

  @IsNotEmpty({ message: 'Workspace ID required.'})
  @IsMongoId({ message: 'Invalid workspaceId format' })
  workspaceId?: string;

  @IsOptional()
  @IsMongoId({ message: 'Invalid createdBy format' })
  createdBy?: string;
}