import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
        return this.userModel.find();
    }

    getUserById(id: string) {
        return this.userModel.findById(id);
    }

    updateUser(id: string, updateUserDto: UpdateUserDto) {
       return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true});
    }

    deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id);
    }
    };

