import { Component } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  constructor(public sidebarService: SidebarService) {}
}
