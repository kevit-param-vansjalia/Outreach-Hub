import { Component } from '@angular/core'; // Import if you use time series data


  @Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss']
})
export class DashboardListComponent {


  // Static Data for Recent Users Table
  public recentUsers = [
    { name: 'Alice Johnson', email: 'alice.j@example.com', initials: 'AJ', time: '2 min ago' },
    { name: 'Bob Williams', email: 'bob.w@example.com', initials: 'BW', time: '15 min ago' },
    { name: 'Charlie Brown', email: 'charlie.b@example.com', initials: 'CB', time: '1 hr ago' },
    { name: 'Diana Miller', email: 'diana.m@example.com', initials: 'DM', time: '3 hrs ago' },
  ];
}