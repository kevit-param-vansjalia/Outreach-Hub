import { Component } from '@angular/core';

export interface Workspace {
  _id: string;
  name: string;
  createdBy: string;
}

export interface UserWorkspace {
  workspaceId: Workspace;
  role: 'Editor' | 'Viewer';
}
export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isAdmin: boolean;
  workspaces: UserWorkspace[];
  createdAt: string;
  updatedAt: string;
}
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  users: User[] = [];
}
