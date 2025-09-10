import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      return true;
    }
    this.router.navigate(['/']); // Redirect to the base path, which should handle the login route
    return false;
  }
}