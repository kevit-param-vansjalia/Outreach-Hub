import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Injectable()
export class UserService {
     constructor(
        @InjectModel(User.name) private userModel: Model<User>) {}

    async createuser(createUserDto: CreateUserDto) {
            const user = new this.userModel(createUserDto);
            return await user.save();
    }

    getUsers() {
        return this.userModel.find().populate('workspaces.workspaceId').exec();
    }

    getUserById(id: string) {
        return this.userModel.findById(id);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.userModel.findById(id);
        if (!user) {
            return null;
        }
        // Directly assign properties and mark 'workspaces' as modified
        // to ensure Mongoose detects the change in the array of objects.
        if (updateUserDto.workspaces) {
            user.workspaces = updateUserDto.workspaces.map(w => ({
                ...w,
                workspaceId: new Types.ObjectId(w.workspaceId)
            }));
            user.markModified('workspaces');
        }

        return await user.save();
    }

    deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id);
    }
    };
