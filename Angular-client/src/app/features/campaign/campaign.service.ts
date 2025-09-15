import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private apiUrl = 'http://localhost:3000/campaign';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCampaignsByWorkspace(workspaceId: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/getByWorkspace/${workspaceId}`, 
        { headers: this.getHeaders() }
      )
  }

  getCampaignById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, 
      { headers: this.getHeaders() }
    );
  }

  createCampaign(campaign: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, campaign, 
      { headers: this.getHeaders() }
    );
  }

  updateCampaign(id: string, campaign: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/update/${id}`, campaign, 
      { headers: this.getHeaders() }
    );
  }

  deleteCampaign(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, 
      { headers: this.getHeaders() }
    );
  }
}