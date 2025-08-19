import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { CreateWorkspaceDto } from './dtos/CreateWorkspace.dto';
import { WorkspaceService } from './workspace.service';
import mongoose from 'mongoose';
import { UpdateWorkspaceDto } from './dtos/UpdateWorkspace.dto';

@Controller('workspace')
export class WorkspaceController {
    constructor(private workspacesService: WorkspaceService) {}

@Post('create')
    createworkspace(@Body() createworkspaceDto: CreateWorkspaceDto) {
        console.log(createworkspaceDto);
        return this.workspacesService.createWorkspace(createworkspaceDto);
    }

@Get('get')
    getWorkspaces() {
        return this.workspacesService.getWorkspaces();
    }

    @Get('get/:id')
    async getworkspaceById(@Param('id') id: string) {

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Workspace Not found', 404);
        const findWorkspace = await this.workspacesService.getWorkspaceById(id);
        if (!findWorkspace) throw new HttpException('Workspace Not Found', 404);
        return findWorkspace;
    }

    @Patch('update/:id')
    async updateworkspace(@Param('id') id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const updatedWorkspace = await this.workspacesService.updateWorkspace(id, updateWorkspaceDto);
        if(!updatedWorkspace) throw new HttpException('Workspace Not Found', 404);
        return updatedWorkspace;
    }

    @Delete('delete/:id')
    async deleteWorkspace(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const deleteWorkspace = await this.workspacesService.deleteWorkspace(id);
        return deleteWorkspace;
    }
};
