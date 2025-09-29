import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { UsersService } from '../../users/users.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';
import { User } from '../../users/users-list/users-list.component';
import { Workspace } from '../../workspaces/workspaces-list/workspaces-list.component';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss'],
})
export class DashboardListComponent implements OnInit {
  // Stats
  totalUsers: number = 0;
  totalWorkspaces: number = 0;
  newUsersToday: number = 0;

  // Chart data
  userChartData: any[] = [];
  workspaceChartData: any[] = [];

  // Chart options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';  
  yAxisLabelUsers: string = 'New Users';
  yAxisLabelWorkspaces: string = 'New Workspaces';
  timeline: boolean = true;

  colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3b82f6', '#60a5fa', '#6366f1', '#818cf8', '#a78bfa', '#c084fc'],
  };

  constructor(
    private usersService: UsersService,
    private workspacesService: WorkspacesService
  ) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    forkJoin({
      users: this.usersService.getUsers(),
      workspaces: this.workspacesService.getWorkspaces()
    }).subscribe(({ users, workspaces }) => {
      // Process stats
      this.totalUsers = users.length;
      this.totalWorkspaces = workspaces.length;
      this.newUsersToday = this.countItemsCreatedToday(users);

      // Process chart data
      this.userChartData = this.processDataForBarChart(users);
      this.workspaceChartData = this.processDataForAreaChart(workspaces, 'Workspaces');
    });
  }

  private processDataForAreaChart(data: (User | Workspace)[], seriesName: string): any[] {
    // Use reduce to group items by date and count them in a single pass
    const countsByDate = data.reduce((acc, item) => {
      if (item.createdAt) {
        const dateKey = new Date(item.createdAt).toLocaleDateString('en-CA'); // YYYY-MM-DD format
        acc[dateKey] = (acc[dateKey] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });
 
    // Map the aggregated data to the format ngx-charts expects
    const series = Object.entries(countsByDate).map(([date, count]) => ({
      name: new Date(date), // Use Date object for the timeline
      value: count,
    })).sort((a, b) => a.name.getTime() - b.name.getTime()); // Sort by date
 
    return [{
      name: seriesName,
      series: series
    }];
  }

  private processDataForBarChart(data: (User | Workspace)[]): any[] {
    const countsByDate = data.reduce((acc, item) => {
      if (item.createdAt) {
        const dateKey = new Date(item.createdAt).toLocaleDateString('en-CA'); // YYYY-MM-DD format
        acc[dateKey] = (acc[dateKey] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    // Map the aggregated data to the format ngx-charts expects for a bar chart
    return Object.entries(countsByDate).map(([date, count]) => ({
      name: date,
      value: count,
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()); // Sort by date
  }

  private countItemsCreatedToday(data: (User | Workspace)[]): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    return data.filter(item => {
      if (!item.createdAt) return false;
      const itemDate = new Date(item.createdAt);
      return itemDate.getTime() >= today.getTime();
    }).length;
  }
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
}