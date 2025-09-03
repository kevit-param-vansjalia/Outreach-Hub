import { Component } from '@angular/core';

interface Template {
  title: string;
  category: string;
  preview: string;
  used: number;
  openRate: string;
  clickRate: string;
  lastModified: string;
}

@Component({
  selector: 'app-message-list',                   // ✅ fixed selector
  templateUrl: './message-list.component.html',   // ✅ correct template
  styleUrls: ['./message-list.component.scss']    // ✅ optional SCSS
})
export class MessageListComponent {
  templates: Template[] = [
    {
      title: 'Product Launch Announcement',
      category: 'Announcements',
      preview:
        'Exciting News: {ProductName} Is Here! Hi {FirstName}, We’re thrilled to announce...',
      used: 24,
      openRate: '68.2%',
      clickRate: '12.4%',
      lastModified: '2024-01-15'
    },
    {
      title: 'Welcome Email Series - Part 1',
      category: 'Onboarding',
      preview:
        'Welcome to {CompanyName}! Let’s get you started. Welcome {FirstName}! ...',
      used: 156,
      openRate: '82.1%',
      clickRate: '23.7%',
      lastModified: '2024-01-10'
    },
    {
      title: 'Follow-up After Demo',
      category: 'Sales',
      preview:
        'Thanks for your time today - Next steps. Hi {FirstName}, Thank you...',
      used: 89,
      openRate: '71.5%',
      clickRate: '18.9%',
      lastModified: '2024-01-08'
    },
    {
      title: 'Customer Feedback Request',
      category: 'Feedback',
      preview:
        'We’d love your feedback on {productName}! Hi {FirstName}, We’re hoping...',
      used: 45,
      openRate: '64.8%',
      clickRate: '31.2%',
      lastModified: '2024-01-12'
    },
    {
      title: 'Event Invitation',
      category: 'Events',
      preview:
        "You're invited: {eventName} - {eventDate}. Hi {FirstName}, You're cordially...",
      used: 12,
      openRate: '59.3%',
      clickRate: '15.8%',
      lastModified: '2024-01-14'
    }
  ];
}
