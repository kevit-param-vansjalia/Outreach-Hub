import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Alert, AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  animations: [
    trigger('alertAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AlertComponent implements OnInit, OnDestroy {
  alert: Alert | null = null;
  private subscription!: Subscription;

  iconMap = {
    error: 'fa-solid fa-circle-xmark',
    success: 'fa-solid fa-check-circle',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info'
  };

  colorMap = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.subscription = this.alertService.alert$.subscribe(alert => {
      this.alert = alert;
      if (alert) {
        setTimeout(() => this.closeAlert(), 5000); // Auto-close after 5 seconds
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeAlert(): void {
    this.alert = null;
  }
}