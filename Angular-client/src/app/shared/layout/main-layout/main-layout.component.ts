// src/app/shared/layout/main-layout/main-layout.component.ts

import { Component } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service'; 

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  constructor(public sidebarService: SidebarService) { }
}