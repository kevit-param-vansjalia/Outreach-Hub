import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { WorkspacesListComponent } from './workspaces-list/workspaces-list.component';


@NgModule({
  declarations: [
    WorkspacesListComponent
  ],
  imports: [
    CommonModule,
    WorkspacesRoutingModule
  ]
})
export class WorkspacesModule { }
