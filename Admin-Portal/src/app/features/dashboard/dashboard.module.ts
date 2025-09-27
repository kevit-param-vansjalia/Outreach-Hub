import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';


@NgModule({
  declarations: [
    DashboardListComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxChartsModule,
  ]
})
export class DashboardModule { }
