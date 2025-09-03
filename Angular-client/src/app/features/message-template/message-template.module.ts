import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageTemplateRoutingModule } from './message-template-routing.module';
import { MessageListComponent } from './message-list/message-list.component';

@NgModule({
  declarations: [MessageListComponent],
  imports: [
    CommonModule,
    MessageTemplateRoutingModule
  ]
})
export class MessageTemplateModule {}
