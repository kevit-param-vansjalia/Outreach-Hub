// src/app/campaign-list/campaign-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../campaign.service';
import { MessageTemplateService, MessageTemplate } from '../../message-template/message-template.service';
import { ContactsService } from '../../contacts/contacts.service';
import { CampaignMessageService } from '../campaign-message.service';
import { forkJoin } from 'rxjs';

interface Campaign {
  _id?: string;
  name: string;
  description?: string;
  selectedTags?: string[];
  message?: {
    type: 'Text' | 'Text-Image';
    text: string;
    imageUrl?: string;
    templateId?: string;
  };
  templateId?: string;
  status: 'Draft' | 'Running' | 'Completed';
  workspaceId: string;
}

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  campaigns: Campaign[] = [];

  showCampaignModal = false;
  modalMode: 'add' | 'details' | 'edit' = 'add';
  selectedCampaign: Campaign | null = null;

  messageTemplates: MessageTemplate[] = [];

  private workspaceId = localStorage.getItem('workspaceId') || '';
  userRole = localStorage.getItem('workspaceRole') || '';

  campaignForm: {
    name: string;
    description: string;
    selectedTags: string;
    selectedTemplateId?: string;
    messageType: 'Text' | 'Text-Image' | string;
    messageText: string;
    messageImageUrl?: string;
    status: 'Draft' | 'Running' | 'Completed' | string;
  } = {
    name: '',
    description: '',
    selectedTags: '',
    selectedTemplateId: undefined,
    messageType: 'Text',
    messageText: '',
    messageImageUrl: '',
    status: 'Draft',
  };

  constructor(
    private campaignService: CampaignService,
    private messageTemplateService: MessageTemplateService,
    private contactService: ContactsService,
    private campaignMessageService: CampaignMessageService
  ) {}

  ngOnInit() {
    // ensure workspace id present and attempt fetch
    this.workspaceId = localStorage.getItem('workspaceId') || '';
    this.fetchCampaignsAndTemplates();
    if (history.state.openAddModal) {
      this.openAddCampaignModal();
    }
  }

  fetchCampaignsAndTemplates() {
  
  if (!this.workspaceId) {
    console.error('No workspaceId available');
    return;
  }

  forkJoin({
    campaigns: this.campaignService.getCampaignsByWorkspace(this.workspaceId),
    templates: this.messageTemplateService.getTemplates(this.workspaceId)
  }).subscribe({
    next: (res) => {
      
      this.messageTemplates = res.templates.filter(
        t => !t.workspaceId || String(t.workspaceId) === this.workspaceId
      );
      
      this.campaigns = res.campaigns.map((c: Campaign) => ({
        ...c,
        selectedTags: c.selectedTags || [],
        message: c.templateId
          ? this.getMessageFromTemplate(c.templateId)
          : { type: 'Text', text: '', imageUrl: '' }
      }));
      
    },
    error: (err) => {
      console.error('Error fetching data:', err);
      console.error('Error status:', err.status);
      console.error('Error message:', err.message);
      
      // Check if it's an authentication error
      if (err.status === 401) {
        console.error('Authentication failed - token might be invalid');
      } else if (err.status === 0) {
        console.error('Network error - backend might not be reachable');
      }
    }
  });
}

  onMessageTemplateChange(templateId?: string) {
    this.campaignForm.selectedTemplateId = templateId;
    if (!templateId) {
      this.campaignForm.messageText = '';
      this.campaignForm.messageImageUrl = '';
      this.campaignForm.messageType = 'Text';
      return;
    }
    const temp = this.messageTemplates.find(t => t._id === templateId);
    if (temp) {
      this.campaignForm.messageText = temp.message?.text ?? '';
      this.campaignForm.messageImageUrl = temp.message?.imageUrl ?? '';
      this.campaignForm.messageType = temp.type ?? 'Text';
    }
  }

  changeStatus(status: 'Draft' | 'Running' | 'Completed') {
    if (this.selectedCampaign) {
      this.selectedCampaign.status = status;
      this.campaignForm.status = status;
    } else {
      this.campaignForm.status = status;
    }
  }

  openAddCampaignModal() {
    this.modalMode = 'add';
    this.resetForm();
    this.showCampaignModal = true;
  }

  openCampaignDetails(campaign: Campaign) {
    this.selectedCampaign = campaign;
    this.modalMode = 'details';
    this.showCampaignModal = true;
  }

  openEditCampaign(campaign: Campaign) {
    this.selectedCampaign = campaign;
    this.modalMode = 'edit';
    const messageDetails = this.getMessageFromTemplate(campaign.templateId);

    // ensure the current status is displayed in the edit form
    this.campaignForm = {
      name: campaign.name,
      description: campaign.description || '',
      selectedTags: (campaign.selectedTags || []).join(', '),
      selectedTemplateId: campaign.templateId ?? undefined,
      messageType: messageDetails.type,
      messageText: messageDetails.text,
      messageImageUrl: messageDetails.imageUrl,
      status: campaign.status ?? 'Draft',
    };
    this.showCampaignModal = true;
  }

  closeCampaignModal() {
    this.showCampaignModal = false;
    this.selectedCampaign = null;
    this.resetForm();
  }

  saveCampaign() {
    if (localStorage.getItem('role') === 'Viewer') {
      console.warn('Viewer role cannot create campaigns.');
      return;
    }
    const tagsArray = this.campaignForm.selectedTags
      ? this.campaignForm.selectedTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const selectedTemplate = this.messageTemplates.find(
      t => t._id === this.campaignForm.selectedTemplateId
    );

    const payload = {
      name: this.campaignForm.name,
      description: this.campaignForm.description,
      selectedTags: tagsArray,
      templateId: selectedTemplate?._id,
      workspaceId: this.workspaceId,
      createdBy: localStorage.getItem('userId') || 'defaultUserId',
      status: this.campaignForm.status || 'Draft',
    };

    const messageContent = this.campaignForm.messageText;

    this.campaignService.createCampaign(payload).subscribe({
      next: (created) => {
        const messageForLocalState = created.templateId
          ? this.getMessageFromTemplate(created.templateId)
          : {
              type: this.campaignForm.messageType as 'Text' | 'Text-Image',
              text: this.campaignForm.messageText,
              imageUrl: this.campaignForm.messageImageUrl || ''
            };

        this.campaigns.unshift({
          ...created,
          selectedTags: created.selectedTags || [],
          message: messageForLocalState
        });

        if (tagsArray.length > 0) {
          this.contactService.getContactsByTags(this.workspaceId, tagsArray).subscribe({
            next: (contacts) => {
              const contactIds = contacts.map(c => c._id!).filter(Boolean);

              if (contactIds.length > 0) {
                const msgPayload = {
                  workspace: this.workspaceId,
                  campaign: created._id!,
                  contactIds,
                  messageContent: messageContent
                };

                this.campaignMessageService.create(msgPayload).subscribe({
                  next: () => this.closeCampaignModal(),
                  error: (err) => {
                    console.error('Error creating campaign message:', err);
                    this.closeCampaignModal();
                  }
                });
              } else {
                console.warn('No contacts found for selected tags. Campaign created without messages.');
                this.closeCampaignModal();
              }
            },
            error: (err) => {
              console.error('Error fetching contacts by tags:', err);
              this.closeCampaignModal();
            }
          });
        } else {
          this.closeCampaignModal();
        }
      },
      error: (err) => {
        console.error('Error creating campaign:', err)
      }
    });
  }

  updateCampaign() {
    if (!this.selectedCampaign) return;
    if (localStorage.getItem('role') === 'Viewer') {
      console.warn('Viewer role cannot update campaigns.');
      return;
    }

    const tagsArray = this.campaignForm.selectedTags
      ? this.campaignForm.selectedTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const selectedTemplate = this.messageTemplates.find(t => t._id === this.campaignForm.selectedTemplateId);

    const payload: Partial<Campaign> = {
      name: this.campaignForm.name,
      description: this.campaignForm.description,
      selectedTags: tagsArray,
      templateId: selectedTemplate?._id,
      status: this.campaignForm.status as ('Draft'|'Running'|'Completed')
    };

    this.campaignService.updateCampaign(this.selectedCampaign._id!, payload).subscribe({
      next: (res) => {
        const index = this.campaigns.findIndex(c => c._id === res._id);
        if (index !== -1) {
          const updatedMessage = this.getMessageFromTemplate(res.templateId);
          this.campaigns[index] = { 
            ...res, 
            selectedTags: res.selectedTags || [], 
            message: updatedMessage,
            status: res.status 
          };
        }
        this.closeCampaignModal();
      },
      error: (err) => console.error('Error updating campaign:', err)
    });
  }

  deleteCampaign(campaign: Campaign) {
    if (localStorage.getItem('role') === 'Viewer') {
      console.warn('Viewer role cannot delete campaigns.');
      return;
    }
    if (!confirm(`Are you sure you want to delete ${campaign.name}?`)) return;

    this.campaignService.deleteCampaign(campaign._id!).subscribe({
      next: () => {
        this.campaigns = this.campaigns.filter(c => c !== campaign);
        if (this.selectedCampaign === campaign) this.closeCampaignModal();
      },
      error: (err) => console.error('Error deleting campaign:', err)
    });
  }

  private getMessageFromTemplate(templateId?: string): { type: 'Text' | 'Text-Image', text: string, imageUrl?: string } {
    const template = this.messageTemplates.find(t => t._id === templateId);
    if (template) {
      const type = template.type as 'Text' | 'Text-Image';
      return { type, text: template.message.text, imageUrl: template.message.imageUrl };
    } else {
      return { type: 'Text', text: '', imageUrl: '' };
    }
  }

  private resetForm() {
    this.campaignForm = {
      name: '',
      description: '',
      selectedTags: '',
      selectedTemplateId: undefined,
      messageType: 'Text',
      messageText: '',
      messageImageUrl: '',
      status: 'Draft',
    };
  }
}
