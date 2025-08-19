import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateWorkspaceDto } from 'src/workspace/dtos/CreateWorkspace.dto';
import { Workspace } from 'src/schemas/workspace.schema';
import { Model } from 'mongoose';
import { UpdateWorkspaceDto } from 'src/workspace/dtos/UpdateWorkspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>
  ) {}

  async createWorkspace(createWorkspaceDto: CreateWorkspaceDto) {
    const workspace = new this.workspaceModel(createWorkspaceDto);
    return await workspace.save();
  }

  async getWorkspaces() {
    return await this.workspaceModel.find().exec();
  }

  async getWorkspaceById(id: string) {
    return await this.workspaceModel.findById(id).exec();
  }

  async updateWorkspace(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    return await this.workspaceModel.findByIdAndUpdate(id, updateWorkspaceDto, { new: true }).exec();
  }

  async deleteWorkspace(id: string) {
    return await this.workspaceModel.findByIdAndDelete(id).exec();
  }
}
