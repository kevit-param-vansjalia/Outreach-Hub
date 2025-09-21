import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

const routes: Routes = [
   {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./core/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
   { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
