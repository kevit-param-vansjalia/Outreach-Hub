import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ContactsService, Contact } from '../../contacts/contacts.service';
import {
  MessageTemplateService,
  MessageTemplate,
} from '../../message-template/message-template.service';
import { CampaignService } from '../../campaign/campaign.service';
import { Campaign } from '../../campaign/campaign.model';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss'],
})
export class DashboardListComponent implements OnInit {
  userRole = localStorage.getItem('workspaceRole') || '';
  workspaceId = localStorage.getItem('workspaceId') || '';

  // Stats for cards
  totalContacts = 0;
  totalCampaigns = 0;
  totalTemplates = 0;
  successRate = '0.0';

  constructor(
    private router: Router,
    private contactsService: ContactsService,
    private templateService: MessageTemplateService,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    if (this.workspaceId) {
      this.loadChartData();
    }
  }

  loadChartData(): void {
    forkJoin({
      contacts: this.contactsService.getContactsByWorkspace(this.workspaceId),
      templates: this.templateService.getTemplates(this.workspaceId),
      campaigns: this.campaignService.getCampaignsByWorkspace(this.workspaceId),
    }).subscribe(({ contacts, templates, campaigns }) => {
      // Update stat cards
      this.totalContacts = contacts.length;
      this.totalTemplates = templates.length;
      this.totalCampaigns = campaigns.length;

      const completedCampaigns = campaigns.filter(
        (c) => c.status === 'Completed'
      ).length;
      const totalCampaigns = campaigns.length;

      this.successRate =
        totalCampaigns > 0
          ? ((completedCampaigns / totalCampaigns) * 100).toFixed(1)
          : '0.0';

      // Setup charts
      this.setupContactsChart(contacts);
      this.setupTemplatesChart(templates);
      this.setupCampaignStatusChart(campaigns);
    });
  }

  private setupContactsChart(contacts: Contact[]): void {
    const countsByDate = this.groupDataByCreationDate(contacts);
    const sortedDates = Object.keys(countsByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    this.barChartLabels = sortedDates;
    this.barChartData = [
      {
        data: sortedDates.map((date) => countsByDate[date]),
        label: 'Contacts Created',
        backgroundColor: '#6366f1',
      },
    ];
  }

  private setupTemplatesChart(templates: MessageTemplate[]): void {
    const countsByDate = this.groupDataByCreationDate(templates);
    const sortedDates = Object.keys(countsByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    this.lineChartLabels = sortedDates;
    this.lineChartData = [
      {
        data: sortedDates.map((date) => countsByDate[date]),
        label: 'Templates Created',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        fill: true,
      },
    ];
  }

  private setupCampaignStatusChart(campaigns: Campaign[]): void {
    const statusCounts = { Draft: 0, Running: 0, Completed: 0 };

    for (const campaign of campaigns) {
      if (campaign.status && campaign.status in statusCounts) {
        statusCounts[campaign.status]++;
      }
    }

    this.pieChartLabels = Object.keys(statusCounts);
    this.pieChartData[0].data = Object.values(statusCounts);
  }

  private groupDataByCreationDate(
    items: (Contact | MessageTemplate)[]
  ): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    items.forEach((item) => {
      if (item.createdAt) {
        const date = new Date(item.createdAt).toLocaleDateString();
        counts[date] = (counts[date] || 0) + 1;
      }
    });
    return counts;
  }

  // Bar Chart
  public barChartOptions: ChartOptions<'bar'> = { responsive: true };
  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [
    { data: [], label: 'Contacts Created', backgroundColor: '#6366f1' },
  ];

  // Line Chart
  public lineChartOptions: ChartOptions<'line'> = { responsive: true };
  public lineChartLabels: string[] = [];
  public lineChartData: ChartConfiguration<'line'>['data']['datasets'] = [
    { data: [], label: 'Templates Created', borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.2)', fill: true },
  ];

  // Pie Chart
  public pieChartOptions: ChartOptions<'pie'> = { responsive: true };
  public pieChartLabels: string[] = ['Draft', 'Running', 'Completed'];
  public pieChartData: ChartConfiguration<'pie'>['data']['datasets'] = [
    {
      data: [0, 0, 0],
      backgroundColor: ['#f59e0b', '#6366f1', '#10b981'],
    },
  ];

  quickAddContact() {
    this.router.navigate(['/contacts'], { state: { openAddModal: true } });
  }

  quickCreateTemplate() {
    this.router.navigate(['/message-template'], { state: { openAddModal: true } });
  }

  quickCreateCampaign() {
    this.router.navigate(['/campaign'], { state: { openAddModal: true } });
  }
}
