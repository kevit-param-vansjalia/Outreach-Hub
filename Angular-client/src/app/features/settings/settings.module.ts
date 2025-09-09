// src/app/features/settings/settings.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SettingsListComponent } from './setting-list/setting-list.component';

const routes: Routes = [
  { path: '', component: SettingsListComponent }  // default component
];

@NgModule({
  declarations: [SettingsListComponent],
  imports: [
    CommonModule, // required for *ngIf, *ngFor, ngClass
    FormsModule,  // required for [(ngModel)]
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule {}
