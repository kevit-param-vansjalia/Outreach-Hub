// src/app/shared/layout/sidebar/sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isSidebarCollapsed$: Observable<boolean>;

  constructor(
    public sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isSidebarCollapsed$ = this.sidebarService.isSidebarCollapsed$;
  }

  ngOnInit() {}

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}