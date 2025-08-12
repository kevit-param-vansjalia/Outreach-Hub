import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: false, trim: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({
    type: [
      {
        workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: false },
        role: { type: String, enum: ['Editor', 'Viewer'], required: false },
      },
    ],
    default: [],
  })
  workspaces: {
    workspaceId?: mongoose.Schema.Types.ObjectId;
    role?: 'Editor' | 'Viewer';
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});
         