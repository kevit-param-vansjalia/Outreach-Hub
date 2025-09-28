import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards, Req, Query, ForbiddenException } from '@nestjs/common';
import { CreateContactDto } from './dtos/CreateContact.dto'; 
import { ContactService } from './contact.service';
import mongoose from 'mongoose';
import { UpdateContactDto } from './dtos/UpdateContact.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('contact')
@UseGuards(JwtAuthGuard)
export class ContactController {
    constructor(private contactsService: ContactService) {}

@Post('create')
    createcontact(@Body() createcontactDto: CreateContactDto, @Req() req: { user: { sub: string } }) {
        // Pass the DTO and the authenticated user's ID to the service
        return this.contactsService.createContact(createcontactDto, req.user.sub);
    }

@Get('get')
    getContacts() {
        return this.contactsService.getContacts();
    }

@Get('my-contacts')
    getContactsByUser(@Req() req: { user: { sub: string } }, @Query('workspaceId') workspaceId: string) {
        return this.contactsService.getContactsByUser(req.user.sub, workspaceId);
    }

@Get('workspace/:workspaceId/all')
    getContactsByWorkspace(@Param('workspaceId') workspaceId: string) {
        return this.contactsService.getContactsByWorkspace(workspaceId);
    }

@Get('workspace/:workspaceId/by-tags')
    getContactsByTags(@Param('workspaceId') workspaceId: string, @Query('tags') tags: string) {
        const tagsArray = tags.split(',');
        return this.contactsService.getContactsByTags(workspaceId, tagsArray);
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
    async updatecontact(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto, @Req() req: { user: { sub: string } }) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);

        const contact = await this.contactsService.getContactById(id);
        if (!contact) throw new HttpException('Contact Not Found', 404);
        if (contact.createdBy.toString() !== req.user.sub) {
            throw new ForbiddenException('You do not have permission to edit this contact.');
        }

        const updatedContact = await this.contactsService.updateContact(id, updateContactDto);
        if(!updatedContact) throw new HttpException('Contact Not Found', 404);
        return updatedContact;
    }

    @Delete('delete/:id')
    async deleteContact(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid Id', 404);

        const contact = await this.contactsService.getContactById(id);
        if (!contact) throw new HttpException('Contact Not Found', 404);
        if (contact.createdBy.toString() !== req.user.sub) {
            throw new ForbiddenException('You do not have permission to delete this contact.');
        }

        const deleteContact = await this.contactsService.deleteContact(id);
        return deleteContact;
    }
};
