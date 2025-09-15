import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

interface Workspace {
  workspaceId: string;
  name?: string;
  role: 'Editor' | 'Viewer';
}

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
  animations: [
    trigger('float', [
      state('in', style({ transform: 'translateY(0)' })),
      transition('void => *', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('0.5s ease-out'),
      ]),
    ]),
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.7s ease-out'),
      ]),
    ]),
    trigger('fadeIn', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [style({ opacity: 0 }), animate('0.5s ease-in')]),
    ]),
  ],
})
export class WorkspaceListComponent implements OnInit {
  workspaces: Workspace[] = [];
  isLoading: boolean = true;
  hasNoWorkspaces: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedWorkspaces = localStorage.getItem('userWorkspaces');
    if (storedWorkspaces) {
      this.workspaces = JSON.parse(storedWorkspaces);
      this.hasNoWorkspaces = this.workspaces.length === 0;
    } else {
      this.hasNoWorkspaces = true;
    }
    this.isLoading = false;
  }

  selectWorkspace(workspace: Workspace) {
    
    localStorage.setItem('workspaceId', workspace.workspaceId);
    localStorage.setItem('workspaceRole', workspace.role);
    this.router.navigate(['/dashboard']);
  }
}
