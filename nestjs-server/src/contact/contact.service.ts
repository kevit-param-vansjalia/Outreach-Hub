import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../schemas/contact.schema';
import { CreateContactDto } from './dtos/CreateContact.dto';
import { UpdateContactDto } from './dtos/UpdateContact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>
  ) {}

  async createContact(createContactDto: CreateContactDto) {
    const contact = new this.contactModel(createContactDto);
    return await contact.save();
  }

  async getContacts() {
    return await this.contactModel.find().exec();
  }

  async getContactsByUser(userId: string, workspaceId: string) {
    return await this.contactModel.find({ createdBy: userId, workspaceId }).exec();
  }

  async getContactsByWorkspace(workspaceId: string) {
    return await this.contactModel.find({ workspaceId }).exec();
  }

  async getContactsByTags(workspaceId: string, tags: string[]) {
    return await this.contactModel.find({ workspaceId, tags: { $in: tags } }).exec();
  }

  async getContactById(id: string) {
    return await this.contactModel.findById(id).exec();
  }

  async updateContact(id: string, updateContactDto: UpdateContactDto) {
    return await this.contactModel.findByIdAndUpdate(id, updateContactDto, { new: true }).exec();
  }

  async deleteContact(id: string) {
    return await this.contactModel.findByIdAndDelete(id).exec();
  }
}
