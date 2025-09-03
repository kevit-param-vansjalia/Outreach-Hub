import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MessageListComponent } from './features/message-template/message-list/message-list.component';
import { CampaignComponent } from './features/campaign/campaign.component';

import { LayoutModule } from './shared/layout/layout.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CampaignComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    LayoutModule           
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
