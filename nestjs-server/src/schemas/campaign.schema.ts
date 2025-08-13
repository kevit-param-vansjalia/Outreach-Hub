import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CampaignDocument = Campaign & Document;

class Message {
  @Prop({ enum: ['Text', 'Text-Image'], required: true })
  type: 'Text' | 'Text-Image';

  @Prop({ required: true })
  text: string;

  @Prop()
  imageUrl?: string;
}

class MessageLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true })
  contactId: mongoose.Types.ObjectId;

  @Prop()
  messageContent?: string;

  @Prop({ type: Date, default: Date.now })
  sentAt?: Date;
}

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ enum: ['Draft', 'Running', 'Completed'], default: 'Draft' })
  status: 'Draft' | 'Running' | 'Completed';

  @Prop({ type: Message, required: true })
  message: Message;

  @Prop({ type: [String] })
  selectedTags?: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: mongoose.Types.ObjectId;

  @Prop({ type: [MessageLog] })
  messages?: MessageLog[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
CampaignSchema.index({ workspaceId: 1, status: 1 });
