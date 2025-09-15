import { Component, OnInit } from '@angular/core';
import { MessageTemplateService } from '../message-template.service';

interface MessageTemplate {
  _id?: string;
  name: string;
  type: 'Text' | 'Text-Image';
  message: { text: string, imageUrl?: string };
  workspaceId: string;
}

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  templates: MessageTemplate[] = [];
  private allTemplates: MessageTemplate[] = [];
  searchTerm: string = '';

  // Modal state
  showTemplateModal = false;
  modalMode: 'add' | 'details' | 'edit' = 'add';
  selectedTemplate: MessageTemplate | null = null;

  userRole = localStorage.getItem('workspaceRole') || '';

  // FIX: Define a specific type for templateForm
  templateForm: {
    name: string;
    type: string;
    messageText: string;
    messageImageUrl: string;
  } = {
    name: '',
    type: '',
    messageText: '',
    messageImageUrl: ''
  };

  constructor(private messageTemplateService: MessageTemplateService) {}

  ngOnInit(): void {
    this.loadTemplates();
    if (history.state.openAddModal) {
      this.openAddTemplateModal();
    }
  }

  loadTemplates() {
    const workspaceId = localStorage.getItem('workspaceId') || '';
    this.messageTemplateService.getTemplates(workspaceId).subscribe({
      next: (data) => {
        this.allTemplates = data;
        this.templates = data;
      },
      error: (err) => console.error('Error fetching templates:', err)
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.templates = [...this.allTemplates];
    } else {
      this.templates = this.allTemplates.filter(template =>
        template.name.toLowerCase().includes(term) ||
        template.type.toLowerCase().includes(term)
      );
    }
  }

  openAddTemplateModal() {
    this.modalMode = 'add';
    this.resetForm();
    this.showTemplateModal = true;
  }

  openTemplateDetails(template: MessageTemplate) {
    this.selectedTemplate = template;
    this.modalMode = 'details';
    this.showTemplateModal = true;
  }

  openEditTemplate(template: MessageTemplate) {
    this.selectedTemplate = template;
    this.modalMode = 'edit';
    this.templateForm = {
      name: template.name,
      type: template.type,
      messageText: template.message.text,
      messageImageUrl: template.message.imageUrl || ''
    };
    this.showTemplateModal = true;
  }

  closeTemplateModal() {
    this.showTemplateModal = false;
    this.selectedTemplate = null;
    this.resetForm();
  }

  saveTemplate() {
    const message = {
      text: this.templateForm.messageText,
      ...(this.templateForm.type === 'Text-Image' && { imageUrl: this.templateForm.messageImageUrl })
    };
    
    const newTemplate: MessageTemplate = {
      name: this.templateForm.name,
      type: this.templateForm.type as 'Text' | 'Text-Image',
      message: message,
      workspaceId: localStorage.getItem('workspaceId') || ''
    };

    this.messageTemplateService.createTemplate(newTemplate).subscribe({
      next: (created) => {
        this.templates.unshift(created);
        this.closeTemplateModal();
      },
      error: (err) => console.error('Error creating template:', err)
    });
  }

  updateTemplate() {
    if (!this.selectedTemplate) return;

    const message = {
      text: this.templateForm.messageText,
      ...(this.templateForm.type === 'Text-Image' && { imageUrl: this.templateForm.messageImageUrl })
    };

    const updatedTemplate: Partial<MessageTemplate> = {
      name: this.templateForm.name,
      type: this.templateForm.type as 'Text' | 'Text-Image',
      message: message
    };

    this.messageTemplateService.updateTemplate(this.selectedTemplate._id!, updatedTemplate).subscribe({
      next: (res) => {
        const index = this.templates.findIndex(t => t._id === this.selectedTemplate?._id);
        if (index > -1) this.templates[index] = res;
        this.closeTemplateModal();
      },
      error: (err) => console.error('Error updating template:', err)
    });
  }

  deleteTemplate(template: MessageTemplate) {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return;

    this.messageTemplateService.deleteTemplate(template._id!).subscribe({
      next: () => {
        this.templates = this.templates.filter(t => t._id !== template._id);
        if (this.selectedTemplate?._id === template._id) {
          this.closeTemplateModal();
        }
      },
      error: (err) => console.error('Error deleting template:', err)
    });
  }

  private resetForm() {
    this.templateForm = { name: '', type: '', messageText: '', messageImageUrl: '' };
  }
}