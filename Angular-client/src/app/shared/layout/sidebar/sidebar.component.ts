// src/app/shared/layout/sidebar/sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isSidebarCollapsed!: boolean;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.isSidebarCollapsed$.subscribe((collapsed: boolean) => {
      this.isSidebarCollapsed = collapsed;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}