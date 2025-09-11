import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Workspace {
  workspaceId: string;
  name?: string;
  role: 'Editor' | 'Viewer';
}

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss']
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
