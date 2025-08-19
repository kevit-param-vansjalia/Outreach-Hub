import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { CreateContactDto } from './dtos/CreateContact.dto';
import { ContactService } from './contact.service';
import mongoose from 'mongoose';
import { UpdateContactDto } from './dtos/UpdateContact.dto';

@Controller('contact')
export class ContactController {
    constructor(private contactsService: ContactService) {}

@Post('create')
    createcontact(@Body() createcontactDto: CreateContactDto) {
        console.log(createcontactDto);
        return this.contactsService.createContact(createcontactDto);
    }

@Get('get')
    getContacts() {
        return this.contactsService.getContacts();
    }

    @Get('get/:id')
    async getcontactById(@Param('id') id: string) {

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Contact Not found', 404);
        const findContact = await this.contactsService.getContactById(id);
        if (!findContact) throw new HttpException('Contact Not Found', 404);
        return findContact;
    }

    @Patch('update/:id')
    async updatecontact(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const updatedContact = await this.contactsService.updateContact(id, updateContactDto);
        if(!updatedContact) throw new HttpException('Contact Not Found', 404);
        return updatedContact;
    }

    @Delete('delete/:id')
    async deleteContact(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);
        const deleteContact = await this.contactsService.deleteContact(id);
        return deleteContact;
    }
};


