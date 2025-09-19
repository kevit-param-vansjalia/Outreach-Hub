import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert | null>();
  alert$ = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'error') {
    this.alertSubject.next({ message, type });
  }
}