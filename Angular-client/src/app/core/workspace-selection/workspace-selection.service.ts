import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private apiUrl = 'http://localhost:3000/workspace';

  constructor(private http: HttpClient) {}

  getWorkspaceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }
}
