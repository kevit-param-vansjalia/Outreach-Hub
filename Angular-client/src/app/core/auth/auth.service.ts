import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApiUrl = 'http://localhost:3000/auth';
  private userApiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  /**
   * Login the user and store access & refresh tokens
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        // decode userId from access token
        const decoded: any = this.decodeToken(res.accessToken);
        if (decoded && decoded.sub) {
          localStorage.setItem('userId', decoded.sub);
        }
      })
    );
  }

  /**
   * Logout the user
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('workspaceId');
    localStorage.removeItem('role');
  }

  /**
   * Decode JWT token
   */
  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  /**
   * Fetch the logged-in user details
   */
  getUserDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.userApiUrl}/get/${userId}`);
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<any>(`${this.authApiUrl}/refresh`, { refreshToken });
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
