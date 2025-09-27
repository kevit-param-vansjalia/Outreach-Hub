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

export interface UserWorkspaceUpdate {
  workspaceId: string;
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

  isDetailsModalOpen = false;
  detailsModalStep: 'view' | 'add' = 'view';
  selectedWorkspace: Workspace | null = null;
  workspaceUsers: { user: User, role: 'Editor' | 'Viewer' }[] = [];

  activeTab: 'my' | 'all' = 'my';

  workspaceForm: FormGroup;
  userSelectionForm: FormGroup;
  addUserForm: FormGroup;

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

    this.addUserForm = this.fb.group({
      users: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.workspacesService.getWorkspaces().subscribe(workspaces => {
      this.allWorkspaces = workspaces;
      const userId = localStorage.getItem('userId'); // Assuming you store the logged-in user's ID
      if (userId) {
        this.myWorkspaces = this.allWorkspaces.filter(ws => ws.createdBy === userId);
      }
    });
    this.usersService.getUsers().subscribe(users => this.allUsers = users);
  }

  get userSelectionArray(): FormArray {
    return this.userSelectionForm.get('users') as FormArray;
  }

  get addUserArray(): FormArray {
    return this.addUserForm.get('users') as FormArray;
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
    if (this.allUsers.length === 0) {
      this.usersService.getUsers().subscribe(users => {
        this.allUsers = users;
        this.populateUserSelectionArray();
        this.modalStep = 'users';
      });
    } else {
      this.populateUserSelectionArray();
      this.modalStep = 'users';
    }
  }

  private populateUserSelectionArray(): void {
    this.userSelectionArray.clear();
    this.allUsers.forEach(() => {
      this.userSelectionArray.push(this.fb.group({
        selected: [false],
        role: ['Viewer']
      }));
    });
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
      // After creating the workspace, update the users.
      const selectedUsersWithRoles = this.allUsers
        .map((user, index) => ({
          user,
          ...this.userSelectionArray.at(index).value
        }))
        .filter(item => item.selected);

      const updateObservables = selectedUsersWithRoles.map(item => {
        // Prepare updatedWorkspaces with workspaceId as string for update
        const updatedWorkspaces: UserWorkspaceUpdate[] = [...item.user.workspaces.map((w: any) => ({
          workspaceId: typeof w.workspaceId === 'string' ? w.workspaceId : w.workspaceId._id,
          role: w.role
        })), { workspaceId: newWorkspace._id.toString(), role: item.role }];
        return this.usersService.updateUser(item.user._id, { workspaces: updatedWorkspaces as any });
      });

      if (updateObservables.length > 0) {
        forkJoin(updateObservables).subscribe(() => {
          this.loadInitialData(); // Reload all data to reflect changes
          this.closeModal();
        });
      } else {
        this.loadInitialData(); // Reload all data even if no users were added
        this.closeModal();
      }
    });
  }

  // --- Details Modal Methods ---

  openDetailsModal(workspace: Workspace): void {
    this.selectedWorkspace = { ...workspace }; // Use a copy to avoid unintended modifications
    this.workspaceUsers = this.allUsers // Make sure allUsers is loaded
      .map(user => {
        // Handle workspaceId as string or object
        const userWorkspace = user.workspaces.find((w: any) => {
          if (typeof w.workspaceId === 'string') {
            return w.workspaceId === workspace._id;
          } else if (w.workspaceId && typeof w.workspaceId === 'object') {
            return w.workspaceId._id === workspace._id;
          }
          return false;
        });
        return userWorkspace ? { user, role: userWorkspace.role } : null;
      })
      .filter((item): item is { user: User; role: 'Editor' | 'Viewer' } => !!item);

    this.isDetailsModalOpen = true;
    this.detailsModalStep = 'view';
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedWorkspace = null;
    this.workspaceUsers = [];
    this.detailsModalStep = 'view';
  }

  removeUserFromWorkspace(userId: string): void {
    const user = this.allUsers.find(u => u._id === userId);
    if (!user || !this.selectedWorkspace) return;

    const updatedWorkspaces: UserWorkspaceUpdate[] = user.workspaces
      .filter((w: any) => {
        if (typeof w.workspaceId === 'string') {
          return w.workspaceId !== this.selectedWorkspace!._id;
        } else if (w.workspaceId && typeof w.workspaceId === 'object') {
          return w.workspaceId._id !== this.selectedWorkspace!._id;
        }
        return true;
      })
      .map((w: any) => ({
        workspaceId: typeof w.workspaceId === 'string' ? w.workspaceId : w.workspaceId._id,
        role: w.role
      }));
    this.usersService.updateUser(userId, { workspaces: updatedWorkspaces as any }).subscribe(() => {
      // Refresh local data
      this.loadInitialData(); // Reload all data to ensure consistency
      this.workspaceUsers = this.workspaceUsers.filter(wu => wu.user._id !== userId);
    });
  }

  updateUserRole(userId: string, event: Event): void {
    const newRole = (event.target as HTMLSelectElement).value as 'Editor' | 'Viewer';
    const user = this.allUsers.find(u => u._id === userId);
    if (!user || !this.selectedWorkspace) return;

    const updatedWorkspaces: UserWorkspaceUpdate[] = user.workspaces.map((w: any) => {
      const workspaceId = typeof w.workspaceId === 'string' ? w.workspaceId : w.workspaceId._id;
      if (workspaceId === this.selectedWorkspace!._id) {
        return { workspaceId, role: newRole };
      }
      return { workspaceId, role: w.role };
    });

    this.usersService.updateUser(userId, { workspaces: updatedWorkspaces as any }).subscribe(() => {
      // Refresh local data
      this.usersService.getUsers().subscribe(users => {
        this.allUsers = users;
        // Re-open the modal to reflect the role change in the list
        this.openDetailsModal(this.selectedWorkspace!);
      });
    });
  }

  goToAddUser(): void {
    this.populateAddUserArray();
    this.detailsModalStep = 'add';
  }

  private populateAddUserArray(): void {
    this.addUserArray.clear();
    this.allUsers.forEach(user => {
      const isInWorkspace = this.workspaceUsers.some(wu => wu.user._id === user._id);
      this.addUserArray.push(this.fb.group({
        selected: [isInWorkspace],
        role: [this.workspaceUsers.find(wu => wu.user._id === user._id)?.role || 'Viewer']
      }));
    });
  }

  saveAddedUsers(): void {
    if (!this.selectedWorkspace) {
      return;
    }

    const workspaceIdToUpdate = this.selectedWorkspace._id;

    const updateObservables = this.allUsers.map((user, index) => {
      const formGroup = this.addUserArray.at(index);
      const isSelectedInForm = formGroup.get('selected')?.value;
      const newRole = formGroup.get('role')?.value;

      const currentWorkspace = user.workspaces.find(
        (w: any) => (w.workspaceId?._id || w.workspaceId) === workspaceIdToUpdate
      );

      const needsAdding = isSelectedInForm && !currentWorkspace;
      const needsRemoving = !isSelectedInForm && currentWorkspace;
      const needsRoleUpdate = isSelectedInForm && currentWorkspace && currentWorkspace.role !== newRole;

      if (needsAdding || needsRemoving || needsRoleUpdate) {
        let updatedWorkspaces: UserWorkspaceUpdate[];

        if (needsRemoving) {
          updatedWorkspaces = user.workspaces
            .filter((w: any) => (w.workspaceId?._id || w.workspaceId) !== workspaceIdToUpdate)
            .map((w: any) => ({ workspaceId: w.workspaceId?._id || w.workspaceId, role: w.role }));
        } else { // needsAdding or needsRoleUpdate
          const otherWorkspaces = user.workspaces
            .filter((w: any) => (w.workspaceId?._id || w.workspaceId) !== workspaceIdToUpdate)
            .map((w: any) => ({ workspaceId: w.workspaceId?._id || w.workspaceId, role: w.role }));
          updatedWorkspaces = [...otherWorkspaces, { workspaceId: workspaceIdToUpdate, role: newRole }];
        }
        return this.usersService.updateUser(user._id, { workspaces: updatedWorkspaces as any });
      }

      return null;
    }).filter(obs => obs !== null);

    if (updateObservables.length > 0) {
      forkJoin(updateObservables).subscribe(() => {
        // After all users are updated, reload all data to reflect changes everywhere.
        this.workspacesService.getWorkspaces().subscribe(workspaces => {
          this.allWorkspaces = workspaces;
          const updatedWorkspace = this.allWorkspaces.find(ws => ws._id === workspaceIdToUpdate);
          this.usersService.getUsers().subscribe(users => {
            this.allUsers = users;
            if (updatedWorkspace) {
              this.openDetailsModal(updatedWorkspace); // Re-open the modal with fresh data
            }
          });
        });
      }, () => {
        // Error case
        this.detailsModalStep = 'view';
      });
    } else {
      // If no updates are needed, just go back to the view
      this.detailsModalStep = 'view';
    }
  }

  deleteWorkspace(): void {
    if (!this.selectedWorkspace || !confirm('Are you sure you want to delete this workspace? This will remove it for all users.')) return;

    this.workspacesService.deleteWorkspace(this.selectedWorkspace._id).subscribe(() => {
      this.loadInitialData(); // Reload all data after deletion
      this.closeDetailsModal();
    });
  }
}