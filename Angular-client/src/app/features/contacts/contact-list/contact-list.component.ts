import { Component, OnInit } from '@angular/core';
import { ContactsService, Contact } from '../contacts.service';

interface ContactForm {
  name: string;
  phoneNumber: string;
  tags: string;
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];

  // Toggle view state
  viewMode: 'my' | 'workspace' = 'my';

  // Modal state
  showContactModal = false;
  modalMode: 'add' | 'details' | 'edit' = 'add';
  selectedContact: Contact | null = null;

  userRole = localStorage.getItem('workspaceRole') || '';

  // Strongly typed form model
  contactForm: ContactForm = {
    name: '',
    phoneNumber: '',
    tags: ''
  };

  constructor(private contactsService: ContactsService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    if (this.viewMode === 'my') {
      this.contactsService.getContactsByUser().subscribe({
        next: (data: Contact[]) => (this.contacts = data),
        error: (err) => console.error('Error fetching user contacts:', err)
      });
    } else {
      const workspaceId = localStorage.getItem('workspaceId') || '';
      this.contactsService.getContactsByWorkspace(workspaceId).subscribe({
        next: (data: Contact[]) => (this.contacts = data),
        error: (err) => console.error('Error fetching workspace contacts:', err)
      });
    }
  }

  switchView(mode: 'my' | 'workspace') {
    this.viewMode = mode;
    this.loadContacts();
  }

  openAddContactModal() {
    this.modalMode = 'add';
    this.resetForm();
    this.showContactModal = true;
  }

  openContactDetails(contact: Contact) {
    this.selectedContact = contact;
    this.modalMode = 'details';
    this.showContactModal = true;
  }

  openEditContact(contact: Contact) {
    this.selectedContact = contact;
    this.modalMode = 'edit';
    this.contactForm = {
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      tags: contact.tags.join(', ')
    };
    this.showContactModal = true;
  }

  closeContactModal() {
    this.showContactModal = false;
    this.selectedContact = null;
    this.resetForm();
  }

  saveContact() {
    const newContact = {
      name: this.contactForm.name,
      phoneNumber: this.contactForm.phoneNumber,
      tags: this.contactForm.tags
        ? this.contactForm.tags.split(',').map((tag) => tag.trim())
        : [],
      workspaceId: localStorage.getItem('workspaceId') || ''
    };

    // Backend will automatically set createdBy from JWT
    this.contactsService.createContact(newContact).subscribe({
      next: (created: Contact) => {
        this.contacts.unshift(created);
        this.closeContactModal();
      },
      error: (err) => console.error('Error creating contact:', err)
    });
  }

  updateContact() {
    if (!this.selectedContact) return;

    const updated = {
      name: this.contactForm.name,
      phoneNumber: this.contactForm.phoneNumber,
      tags: this.contactForm.tags
        ? this.contactForm.tags.split(',').map((tag) => tag.trim())
        : []
    };

    this.contactsService.updateContact(this.selectedContact._id, updated).subscribe({
      next: (res: Contact) => {
        const index = this.contacts.findIndex((c) => c._id === this.selectedContact?._id);
        if (index > -1) this.contacts[index] = res;
        this.closeContactModal();
      },
      error: (err) => console.error('Error updating contact:', err)
    });
  }

  deleteContact(contact: Contact) {
    if (!confirm(`Are you sure you want to delete ${contact.name}?`)) return;

    this.contactsService.deleteContact(contact._id).subscribe({
      next: () => {
        this.contacts = this.contacts.filter((c) => c._id !== contact._id);
        if (this.selectedContact?._id === contact._id) {
          this.closeContactModal();
        }
      },
      error: (err) => console.error('Error deleting contact:', err)
    });
  }

  private resetForm() {
    this.contactForm = { name: '', phoneNumber: '', tags: '' };
  }
}
