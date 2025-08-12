import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UserService } from './user.service';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Controller('user')
export class UserController {
    constructor(private usersService: UserService) {}

@Post('create')
    createuser(@Body() createuserDto: CreateUserDto) {
        console.log(createuserDto);
        return this.usersService.createuser(createuserDto);
    }

@Get('get')
    getUsers() {
        return this.usersService.getUsers();
    }

    @Get('get/:id')
    async getuserById(@Param('id') id: string) {

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('User Not found', 404);
        const findUser = await this.usersService.getUserById(id);
        if (!findUser) throw new HttpException('User Not Found', 404);
        return findUser;
    }

    @Patch('update/:id')
    async updateuser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const updatedUser = await this.usersService.updateUser(id, updateUserDto);
        if(!updatedUser) throw new HttpException('User Not Found', 404);
        return updatedUser;
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const deleteUser = await this.usersService.deleteUser(id);
        return deleteUser;
    }
};


