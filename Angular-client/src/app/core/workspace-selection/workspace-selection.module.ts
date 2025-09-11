import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceSelectionRoutingModule } from './workspace-selection-routing.module';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';


@NgModule({
  declarations: [
    WorkspaceListComponent
  ],
  imports: [
    CommonModule,
    WorkspaceSelectionRoutingModule
  ]
})
export class WorkspaceSelectionModule { }
