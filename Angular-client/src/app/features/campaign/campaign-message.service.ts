import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CampaignMessageCreatePayload {
  workspace: string;
  campaign: string;
  contactIds: string[];
  messageContent: string;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignMessageService {
  private apiUrl = 'http://localhost:3000/campaignMessage';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  create(payload: CampaignMessageCreatePayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, payload, 
      { headers: this.getHeaders() }
    );
  }
}