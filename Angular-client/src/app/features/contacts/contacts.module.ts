import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactListComponent } from './contact-list/contact-list.component';

@NgModule({
  declarations: [
    ContactListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ContactsRoutingModule
  ]
})
export class ContactsModule {}
