import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
  // Example contacts
  contacts = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      location: 'Mumbai, India',
      role: 'Manager',
      company: 'ABC Corp',
      status: 'Active',
      tags: ['targeted', 'high priority'],
      lastContact: '2025-09-01'
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 9123456780',
      location: 'Delhi, India',
      role: 'HR',
      company: 'XYZ Ltd',
      status: 'Inactive',
      tags: ['non targeted', 'warm lead'],
      lastContact: '2025-08-28'
    }
  ];

  // Modal state
  showAddModal = false;

  // New contact model
  newContact = {
    name: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    company: '',
    tags: ''
  };

  // Open modal
  openAddContactModal() {
    this.showAddModal = true;
  }

  // Close modal
  closeAddContactModal() {
    this.showAddModal = false;
    this.resetForm();
  }

  // Save contact
  saveContact() {
    if (this.newContact.name && this.newContact.phone) {
      const contact = {
        ...this.newContact,
        tags: this.newContact.tags
          ? this.newContact.tags.split(',').map(tag => tag.trim())
          : [],
        status: 'Active',
        lastContact: new Date().toISOString().split('T')[0]
      };

      this.contacts.unshift(contact); // add new contact at top
      this.closeAddContactModal();
    }
  }

  private resetForm() {
    this.newContact = {
      name: '',
      email: '',
      phone: '',
      location: '',
      role: '',
      company: '',
      tags: ''
    };
  }
}
