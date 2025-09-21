// src/app/services/sidebar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isSidebarCollapsed = new BehaviorSubject<boolean>(false);
  isSidebarCollapsed$ = this._isSidebarCollapsed.asObservable();

  toggleSidebar() {
    this._isSidebarCollapsed.next(!this._isSidebarCollapsed.value);
  }
}