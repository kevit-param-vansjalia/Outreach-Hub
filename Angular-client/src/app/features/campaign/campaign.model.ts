export interface Campaign {
  _id: string;
  name: string;
  description?: string;
  status?: 'Draft' | 'Running' | 'Completed';
  templateId?: string;
  workspaceId: string;
}