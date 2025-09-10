import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  refreshToken(): Observable<{ accessToken: string, refreshToken: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.apiUrl}/refresh`, { refreshToken });
  }
}