import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss']
})
export class DashboardListComponent {

  userRole = localStorage.getItem('workspaceRole') || '';

  // Bar Chart
  public barChartOptions: ChartOptions<'bar'> = { responsive: true };
  public barChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [
    { data: [1200, 1900, 3000, 2500, 3200, 2800, 4000], label: 'Sent', backgroundColor: '#6366f1' },
    { data: [800, 1500, 2200, 2000, 2600, 2100, 3200], label: 'Opened', backgroundColor: '#f43f5e' }
  ];

  // Line Chart
  public lineChartOptions: ChartOptions<'line'> = { responsive: true };
  public lineChartLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  public lineChartData: ChartConfiguration<'line'>['data']['datasets'] = [
    { data: [300, 500, 800, 600], label: 'Clicks', borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.2)', fill: true },
    { data: [200, 400, 700, 500], label: 'Conversions', borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.2)', fill: true }
  ];

  // Pie Chart
  public pieChartOptions: ChartOptions<'pie'> = { responsive: true };
  public pieChartLabels = ['Successful', 'Bounced', 'Unsubscribed'];
  public pieChartData: ChartConfiguration<'pie'>['data']['datasets'] = [
    { data: [68, 20, 12], backgroundColor: ['#6366f1', '#f43f5e', '#f59e0b'] }
  ];
}
