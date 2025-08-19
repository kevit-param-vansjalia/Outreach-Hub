import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MinLength,
  IsArray,
  ValidateNested,
  IsEnum,
  IsMongoId
} from 'class-validator';
import { Type } from 'class-transformer';

export class WorkspaceDto {
  @IsOptional()
  @IsMongoId({ message: 'Invalid workspaceId format' })
  workspaceId?: string;

  @IsOptional()
  @IsEnum(['Editor', 'Viewer'], { message: 'Role must be Editor or Viewer' })
  role?: 'Editor' | 'Viewer';
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkspaceDto)
  workspaces?: WorkspaceDto[];
}