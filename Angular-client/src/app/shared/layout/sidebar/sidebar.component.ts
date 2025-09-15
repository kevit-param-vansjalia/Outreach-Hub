// src/app/shared/layout/sidebar/sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isSidebarCollapsed!: boolean;
  settingsOpen = false;
  currentUrl = '';

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sidebarService.isSidebarCollapsed$.subscribe((collapsed: boolean) => {
      this.isSidebarCollapsed = collapsed;
      if (collapsed) {
        this.settingsOpen = false; // Close dropdown when sidebar collapses
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        if (!this.currentUrl.startsWith('/settings')) {
          this.settingsOpen = false;
        }
      }
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleSettingsDropdown() {
    this.settingsOpen = !this.settingsOpen;
  }

  isSettingsActive(): boolean {
    return this.router.isActive('/settings', true);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  switchWorkspace() {
    localStorage.removeItem('workspaceId');
    localStorage.removeItem('workspaceRole');
    this.router.navigate(['/workspace']);
  }
}