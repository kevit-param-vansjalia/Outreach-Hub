import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';


export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  phoneNumber: string;

  @Prop({ required: true, trim: true })
  tags: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  createdBy: mongoose.Types.ObjectId;
} 

export const ContactSchema = SchemaFactory.createForClass(Contact);

ContactSchema.index({ workspaceId: 1, phoneNumber: 1 });
ContactSchema.index({ workspaceId: 1, tags: 1 });