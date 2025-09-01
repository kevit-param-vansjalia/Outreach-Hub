import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common'; // Re-added for directives like ngClass


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ContactsComponent } from './features/contacts/contacts.component';
import { MessageTemplateComponent } from './features/message-template/message-template.component';
import { CampaignComponent } from './features/campaign/campaign.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    ContactsComponent,
    MessageTemplateComponent,
    CampaignComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
