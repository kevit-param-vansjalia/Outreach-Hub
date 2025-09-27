import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

// Define the structure of the login response for type safety
export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    email: string;
    isAdmin: boolean;
    workspaces: any[]; // Define a more specific type if you have one
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Base API URL

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Logs in an admin user by calling the dedicated admin endpoint.
   * On success, it stores user data and tokens in localStorage.
   * @param credentials The admin's email and password.
   */
  login(credentials: { email: string; password: string }): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/admin/login`, credentials).pipe(
      tap((response) => this.setSession(response))
    );
  }

  /**
   * Stores the login response data in local storage.
   * @param authResult The response from the admin login endpoint.
   */
  private setSession(authResult: AdminLoginResponse): void {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('refresh_token', authResult.refreshToken);
    localStorage.setItem('userId', authResult.user._id);
    // Store the entire workspaces array as a stringified JSON object
    localStorage.setItem('workspaces', JSON.stringify(authResult.user.workspaces));
  }

  /**
   * Logs out the current user by clearing localStorage and navigating to login.
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
   * Checks if a user is currently logged in by verifying the presence of an access token.
   */
  public isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return false;
    }

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);

      // Return true if the token is not expired
      return expirationDate.valueOf() > new Date().valueOf();
    } catch (error) {
      // If token is malformed, treat as not logged in
      return false;
    }
  }
}
