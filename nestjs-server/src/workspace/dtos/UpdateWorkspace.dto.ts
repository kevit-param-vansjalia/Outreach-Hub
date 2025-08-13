import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './CreateWorkspace.dto';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}