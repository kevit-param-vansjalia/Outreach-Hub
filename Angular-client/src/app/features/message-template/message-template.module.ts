import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageTemplateRoutingModule } from './message-template-routing.module';
import { MessageListComponent } from './message-list/message-list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MessageListComponent],
  imports: [
    CommonModule,
    MessageTemplateRoutingModule,
    FormsModule
  ]
})
export class MessageTemplateModule {}
