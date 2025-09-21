import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export interface Workspace {
  _id: string;
  name: string;
  createdBy: string;
}

export interface UserWorkspace {
  workspaceId: Workspace;
  role: 'Editor' | 'Viewer';
}
@Component({
  selector: 'app-workspaces-list',
  templateUrl: './workspaces-list.component.html',
  styleUrl: './workspaces-list.component.scss',
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class WorkspacesListComponent implements OnInit {
  workspaces: UserWorkspace[] = [];

  ngOnInit(): void {
    const storedWorkspaces = localStorage.getItem('workspaces');
    if (storedWorkspaces) {
      this.workspaces = JSON.parse(storedWorkspaces);
    }
  }
}
