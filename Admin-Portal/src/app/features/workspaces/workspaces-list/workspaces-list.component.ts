import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { WorkspacesService } from '../workspaces.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/users-list/users-list.component';
export interface Workspace { // Keep this export for the service
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
  isModalOpen = false;
  modalStep: 'details' | 'users' = 'details';
  activeTab: 'my' | 'all' = 'my';

  workspaceForm: FormGroup;
  userSelectionForm: FormGroup;

  myWorkspaces: Workspace[] = [];
  allWorkspaces: Workspace[] = [];
  allUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private workspacesService: WorkspacesService,
    private usersService: UsersService
  ) {
    this.workspaceForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.userSelectionForm = this.fb.group({
      users: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.workspacesService.getWorkspaces().subscribe(workspaces => {
      this.allWorkspaces = workspaces;
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.myWorkspaces = this.allWorkspaces.filter(ws => ws.createdBy === userId);
      }
    });
    this.usersService.getUsers().subscribe(users => this.allUsers = users);
  }

  get userSelectionArray(): FormArray {
    return this.userSelectionForm.get('users') as FormArray;
  }

  openModal(): void {
    this.isModalOpen = true;
    this.modalStep = 'details';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.workspaceForm.reset();
    this.userSelectionArray.clear();
  }

  goToUserSelection(): void {
    this.userSelectionArray.clear();
    this.allUsers.forEach(() => {
      this.userSelectionArray.push(this.fb.group({
        selected: [false],
        role: ['Viewer']
      }));
    });
    this.modalStep = 'users';
  }

  goToWorkspaceDetails(): void {
    this.modalStep = 'details';
  }

  setRole(index: number, role: 'Editor' | 'Viewer'): void {
    this.userSelectionArray.at(index).get('role')?.setValue(role);
  }

  onSubmit(): void {
    if (this.workspaceForm.invalid) {
      return;
    }

    const adminId = localStorage.getItem('userId');
    if (!adminId) {
      console.error('Admin ID not found in local storage');
      return;
    }

    const workspaceData = {
      name: this.workspaceForm.value.name,
      createdBy: adminId
    };

    this.workspacesService.createWorkspace(workspaceData).subscribe(newWorkspace => {
      // Add the new workspace to the local lists to update the UI instantly
      this.allWorkspaces.unshift(newWorkspace);
      if (newWorkspace.createdBy === adminId) {
        this.myWorkspaces.unshift(newWorkspace);
      }

      // The logic below updates other users. The admin's own workspace list
      // from login is not updated until the next login.
      const selectedUsersWithRoles = this.allUsers
        .map((user, index) => ({
          user,
          ...this.userSelectionArray.at(index).value
        }))
        .filter(item => item.selected);

      const updateObservables = selectedUsersWithRoles.map(item => {
        const updatedWorkspaces = [...item.user.workspaces, { workspaceId: newWorkspace._id, role: item.role }];
        return this.usersService.updateUser(item.user._id, { workspaces: updatedWorkspaces });
      });

      if (updateObservables.length > 0) {
        forkJoin(updateObservables).subscribe(() => this.closeModal());
      } else {
        this.closeModal();
      }
    });
  }
}
