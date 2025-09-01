// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { SidebarService } from './shared/layout/sidebar/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isSidebarCollapsed$!: Observable<boolean>;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.isSidebarCollapsed$ = this.sidebarService.isSidebarCollapsed$;
  }
}