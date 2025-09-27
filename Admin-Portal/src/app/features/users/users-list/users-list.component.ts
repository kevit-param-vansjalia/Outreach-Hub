import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { UsersService } from '../users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  styleUrls: ['./users-list.component.scss'],
  animations: [
    trigger('rowAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  isModalOpen = false;
  userForm: FormGroup;
  modalMode: 'create' | 'edit' = 'create';
  selectedUser: User | null = null;

  constructor(private usersService: UsersService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  openModal(user?: User): void {
    if (user) {
      // Edit mode
      this.modalMode = 'edit';
      this.selectedUser = user;
      this.userForm.patchValue(user);
      this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      // Create mode
      this.modalMode = 'create';
      this.selectedUser = null;
      this.userForm.reset();
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.userForm.reset();
    this.selectedUser = null;
    this.modalMode = 'create';
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    if (this.modalMode === 'create') {
      const newUser = { ...this.userForm.value, isAdmin: false, workspaces: [] };
      this.usersService.createUser(newUser).subscribe(createdUser => {
        this.users.unshift(createdUser); // Add to the top of the list
        this.closeModal();
      });
    } else if (this.selectedUser) {
      const updatedData = { ...this.userForm.value };
      // Don't send an empty password
      if (!updatedData.password) {
        delete updatedData.password;
      }
      this.usersService.updateUser(this.selectedUser._id, updatedData).subscribe(updatedUser => {
        const index = this.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.closeModal();
      });
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter(u => u._id !== userId);
      });
    }
  }
}
