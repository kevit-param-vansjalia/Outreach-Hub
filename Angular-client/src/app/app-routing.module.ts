// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
// Import other components as needed
import { ContactsComponent } from './features/contacts/contacts.component'; 
import { CampaignComponent } from './features/campaign/campaign.component';
import { MessageTemplateComponent } from './features/message-template/message-template.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'campaigns', component: CampaignComponent },
  { path: 'message-templates', component: MessageTemplateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }