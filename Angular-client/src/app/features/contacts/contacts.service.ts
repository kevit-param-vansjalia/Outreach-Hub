import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Contact {
  _id: string;
  name: string;
  phoneNumber: string;
  tags: string[];
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = 'http://localhost:3000/contact';

  constructor(private http: HttpClient) {}

  // Get all contacts for the logged-in user
  getContactsByUser(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/my-contacts`);
  }

  // Create new contact (do NOT send createdBy, backend sets it)
  createContact(payload: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/create`, payload);
  }

  updateContact(id: string, payload: Partial<Contact>): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/update/${id}`, payload);
  }

  deleteContact(id: string): Observable<{ success?: boolean }> {
    return this.http.delete<{ success?: boolean }>(`${this.apiUrl}/delete/${id}`);
  }

  getContactsByTags(workspaceId: string, tags: string[]): Observable<Contact[]> {
    const q = encodeURIComponent(tags.join(','));
    return this.http.get<Contact[]>(
      `${this.apiUrl}/workspace/${workspaceId}/by-tags?tags=${q}`
    );
  }
}
