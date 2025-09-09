import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MessageTemplate {
  _id?: string;
  name: string;
  type: 'Text' | 'Text-Image';
  message: {
    text: string;
    imageUrl?: string;
  };
  workspaceId: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageTemplateService {
  private baseUrl = 'http://localhost:3000/messageTemplate';

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<MessageTemplate[]> {
    return this.http.get<MessageTemplate[]>(`${this.baseUrl}/get`);
  }

  createTemplate(template: Partial<MessageTemplate>): Observable<MessageTemplate> {
    return this.http.post<MessageTemplate>(`${this.baseUrl}/create`, template);
  }

  updateTemplate(id: string, template: Partial<MessageTemplate>): Observable<MessageTemplate> {
    return this.http.patch<MessageTemplate>(`${this.baseUrl}/update/${id}`, template);
  }

  deleteTemplate(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }


}
