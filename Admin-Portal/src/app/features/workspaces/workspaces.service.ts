import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workspace } from './workspaces-list/workspaces-list.component';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {
  private apiUrl = 'http://localhost:3000/workspace';

  constructor(private http: HttpClient) { }

  getWorkspaces(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${this.apiUrl}/get`);
  }

  createWorkspace(workspace: Partial<Workspace>): Observable<Workspace> {
    return this.http.post<Workspace>(`${this.apiUrl}/create`, workspace);
  }

  deleteWorkspace(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}