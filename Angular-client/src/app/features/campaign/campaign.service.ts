// src/app/services/campaign.service.ts (or wherever your service is)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private apiUrl = 'http://localhost:3000/campaign';  // ✅ point to backend

  constructor(private http: HttpClient) {}

  getCampaignsByWorkspace(workspaceId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getByWorkspace/${workspaceId}`);
  }

  getCampaignById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createCampaign(campaign: any): Observable<any> {
    return this.http.post(this.apiUrl, campaign);
  }

  updateCampaign(id: string, campaign: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, campaign);
  }

  deleteCampaign(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
