import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact, ContactSchema } from 'src/schemas/contact.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Contact.name,
        schema: ContactSchema,
      },
      { name: User.name, schema: UserSchema }, // Add User schema for RolesGuard
    ]),
  ],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule {}
