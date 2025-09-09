import { Component, OnInit } from '@angular/core';
import { CampaignService, Campaign } from '../campaign.service';
import { MessageTemplateService, MessageTemplate } from '../../message-template/message-template.service';
import { ContactsService } from '../../contacts/contacts.service';
import { CampaignMessageService } from '../campaign-message.service';

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

  private workspaceId = '68932904349fdbf48847312a';

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
    this.fetchCampaigns();
    this.loadMessageTemplates();
  }

  fetchCampaigns() {
    this.campaignService.getCampaigns(this.workspaceId).subscribe({
      next: (res) => {
        this.campaigns = res.map(c => ({
          ...c,
          selectedTags: c.selectedTags || [],
          message: c.message || { type: 'Text', text: '', imageUrl: '' }
        }));
      },
      error: (err) => console.error('Error fetching campaigns:', err)
    });
  }

  loadMessageTemplates() {
    this.messageTemplateService.getTemplates().subscribe({
      next: (res) => {
        this.messageTemplates = res.filter(
          t => !t.workspaceId || String(t.workspaceId) === this.workspaceId
        );
      },
      error: (err) => console.error('Error loading message templates:', err)
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
    this.campaignForm = {
      name: campaign.name,
      description: campaign.description || '',
      selectedTags: (campaign.selectedTags || []).join(', '),
      selectedTemplateId: campaign.message?.templateId ?? undefined,
      messageType: campaign.message?.type ?? 'Text',
      messageText: campaign.message?.text ?? '',
      messageImageUrl: campaign.message?.imageUrl ?? '',
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
  const tagsArray = this.campaignForm.selectedTags
    ? this.campaignForm.selectedTags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const selectedTemplate = this.messageTemplates.find(
    t => t._id === this.campaignForm.selectedTemplateId
  );

  // Build message object with type enforced
  const messageObj = selectedTemplate
    ? {
        type: selectedTemplate.type || 'Text', // ensure type exists
        text: selectedTemplate.message?.text || '',
        imageUrl: selectedTemplate.message?.imageUrl || '',
        templateId: selectedTemplate._id
      }
    : {
        type: this.campaignForm.messageType as 'Text' | 'Text-Image',
        text: this.campaignForm.messageText,
        imageUrl: this.campaignForm.messageImageUrl || ''
      };

  // Build campaign payload
  const payload = {
    name: this.campaignForm.name,
    description: this.campaignForm.description,
    selectedTags: tagsArray,
    templateId: selectedTemplate?._id,
    message: messageObj,          // ✅ type now guaranteed
    workspaceId: this.workspaceId,
    createdBy: localStorage.getItem('userId') || 'defaultUserId'
  };

  // 1) Create campaign
  this.campaignService.createCampaign(payload).subscribe({
    next: (created) => {
      // Add campaign locally
      this.campaigns.unshift({
        ...created,
        selectedTags: created.selectedTags || [],
        message: created.message || { type: 'Text', text: '', imageUrl: '' }
      });

      // 2) If tags exist, fetch contacts
      if (tagsArray.length > 0) {
        this.contactService.getContactsByTags(this.workspaceId, tagsArray).subscribe({
          next: (contacts) => {
            const contactIds = contacts.map(c => c._id!).filter(Boolean);

            // 3) Campaign message payload
            const msgPayload = {
              workspace: this.workspaceId,
              campaign: created._id!,
              contactIds,
              messageContent: messageObj.text
            };

            this.campaignMessageService.create(msgPayload).subscribe({
              next: () => this.closeCampaignModal(),
              error: (err) => {
                console.error('Error creating campaign message:', err);
                this.closeCampaignModal();
              }
            });
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
      console.error('Error creating campaign:', err);
    }
  });
}



  updateCampaign() {
    if (!this.selectedCampaign) return;

    const tagsArray = this.campaignForm.selectedTags
      ? this.campaignForm.selectedTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const selectedTemplate = this.messageTemplates.find(t => t._id === this.campaignForm.selectedTemplateId);

    const messageObj = selectedTemplate
      ? { type: selectedTemplate.type, text: selectedTemplate.message.text, imageUrl: selectedTemplate.message.imageUrl, templateId: selectedTemplate._id }
      : { type: (this.campaignForm.messageType as 'Text' | 'Text-Image'), text: this.campaignForm.messageText, imageUrl: this.campaignForm.messageImageUrl };

    const payload: Partial<Campaign> = {
      name: this.campaignForm.name,
      description: this.campaignForm.description,
      selectedTags: tagsArray,
      message: messageObj as any,
      status: this.campaignForm.status as ('Draft'|'Running'|'Completed')
    };

    this.campaignService.updateCampaign(this.selectedCampaign._id!, payload).subscribe({
      next: (res) => {
        const index = this.campaigns.findIndex(c => c._id === res._id);
        if (index !== -1) this.campaigns[index] = { ...res, selectedTags: res.selectedTags || [], message: res.message || { type: 'Text', text: '', imageUrl: '' } };
        this.closeCampaignModal();
      },
      error: (err) => console.error('Error updating campaign:', err)
    });
  }

  deleteCampaign(campaign: Campaign) {
    if (!confirm(`Are you sure you want to delete ${campaign.name}?`)) return;

    this.campaignService.deleteCampaign(campaign._id!).subscribe({
      next: () => {
        this.campaigns = this.campaigns.filter(c => c !== campaign);
        if (this.selectedCampaign === campaign) this.closeCampaignModal();
      },
      error: (err) => console.error('Error deleting campaign:', err)
    });
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
