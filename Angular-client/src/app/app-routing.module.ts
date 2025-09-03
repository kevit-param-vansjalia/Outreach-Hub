// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './shared/layout/auth-layout/auth-layout.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./core/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'contacts',
    component: MainLayoutComponent,

    loadChildren: () =>
      import('./features/contacts/contacts.module').then(
        (m) => m.ContactsModule
      ),
  },
  {
    path: 'message-template',
    component: MainLayoutComponent,

    loadChildren: () =>
      import('./features/message-template/message-template.module').then(
        (m) => m.MessageTemplateModule
      ),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }