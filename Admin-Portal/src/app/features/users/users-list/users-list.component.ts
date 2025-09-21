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

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const newUser = { ...this.userForm.value, isAdmin: false, workspaces: [] };
    this.usersService.createUser(newUser).subscribe(createdUser => {
      this.users.unshift(createdUser);
      this.closeModal();
    });
  }
}
