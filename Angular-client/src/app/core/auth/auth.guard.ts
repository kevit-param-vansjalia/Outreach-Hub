import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
  const accessToken = localStorage.getItem('access_token');
  const workspaceId = localStorage.getItem('workspaceId'); // 👈 corrected key

  if (accessToken) {
    if (!workspaceId) {
      this.router.navigate(['/workspace']);
      return false;
    }
    return true;
  }

  this.router.navigate(['/']);
  return false;
}
}
