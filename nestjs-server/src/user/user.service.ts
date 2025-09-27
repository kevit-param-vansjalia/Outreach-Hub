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
        // The findByIdAndUpdate method is perfect for this.
        // It finds the document by its ID and applies the updates from the DTO.
        // The { new: true } option ensures that the updated document is returned.
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).populate('workspaces.workspaceId').exec();
    }

    deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id);
    }
    };
