import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Campaign {
  _id?: string;
  name: string;
  description?: string;
  selectedTags?: string[];
  message: {
    type: 'Text' | 'Text-Image';
    text: string;
    imageUrl?: string;
    templateId?: string;
  };
  status: 'Draft' | 'Running' | 'Completed';
  workspaceId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = 'http://localhost:3000/campaign';

  constructor(private http: HttpClient) {}

  // ✅ Fetch campaigns by workspace
  getCampaigns(workspaceId: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/getByWorkspace/${workspaceId}`);
  }

  createCampaign(campaign: Partial<Campaign>): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/create`, campaign);
  }

  updateCampaign(id: string, campaign: Partial<Campaign>): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.apiUrl}/update/${id}`, campaign);
  }

  deleteCampaign(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
