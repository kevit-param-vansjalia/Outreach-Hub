import { Component } from '@angular/core';

interface Contact {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  company: string;
  status: 'Active' | 'Inactive' | 'Pending';
  tags: string[];
  lastContact: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html'
})
export class ContactsComponent {
  contacts: Contact[] = [
    {
      name: 'Contact 1',
      email: 'contact1@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York',
      role: 'CTO',
      company: 'Company A',
      status: 'Active',
      tags: ['targeted'],
      lastContact: '2025-08-15'
    },
    {
      name: 'Contact 2',
      email: 'contact2@example.com',
      phone: '+1 (555) 987-6543',
      location: 'London',
      role: 'Manager',
      company: 'Company B',
      status: 'Pending',
      tags: ['non targeted'],
      lastContact: '2025-08-20'
    }
  ];
}