// src/app/app.component.ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SidebarService } from './shared/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public sidebarService: SidebarService) {}
}