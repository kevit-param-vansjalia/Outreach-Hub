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
  selector: 'app-message-template',
  templateUrl: './message-template.component.html'
})
export class MessageTemplateComponent {
  templates: Template[] = [
    {
      title: 'Product Launch Announcement',
      category: 'Announcements',
      preview: 'Exciting News: {ProductName} Is Here! Hi {FirstName}, We’re thrilled to announce the launch of our latest product - {ProductName}! After months of development and testing, we’re confident this will revolutionize the way you…',
      used: 24,
      openRate: '68.2%',
      clickRate: '12.4%',
      lastModified: '2024-01-15'
    },
    {
      title: 'Welcome Email Series - Part 1',
      category: 'Onboarding',
      preview: 'Welcome to {CompanyName}! Let’s get you started. Welcome {FirstName}! Thank you for joining {CompanyName}. We’re excited to have you on board! Over the next few days, we’ll be sending you helpful tips and resources to help you get the most out of your…',
      used: 156,
      openRate: '82.1%',
      clickRate: '23.7%',
      lastModified: '2024-01-10'
    },
    {
      title: 'Follow-up After Demo',
      category: 'Sales',
      preview: 'Thanks for your time today - Next steps. Hi {FirstName}, Thank you for taking the time to see our demo today. I hope you found it valuable and that it gave you a good sense of how {productName} can help {companyName} achieve {specificGoal}. As…',
      used: 89,
      openRate: '71.5%',
      clickRate: '18.9%',
      lastModified: '2024-01-08'
    },
    {
      title: 'Customer Feedback Request',
      category: 'Feedback',
      preview: 'We’d love your feedback on {productName}! Hi {FirstName}, We’re hoping you found {productName} enjoyable! Your success is our top priority, and we’d love to hear about your experience so far. Could you spare 2 minutes to share your thoughts? Your feedback hel…',
      used: 45,
      openRate: '64.8%',
      clickRate: '31.2%',
      lastModified: '2024-01-12'
    },
    {
      title: 'Event Invitation',
      category: 'Events',
      preview: "You're invited: {eventName} - {eventDate}. Hi {FirstName}, You're cordially invited to {eventName}! Date {eventDate}, Time {eventTime} Location: {eventLocation} Topic: {eventTopic}. Join us for an exclusive event where we’ll be…",
      used: 12,
      openRate: '59.3%',
      clickRate: '15.8%',
      lastModified: '2024-01-14'
    }
  ];
}