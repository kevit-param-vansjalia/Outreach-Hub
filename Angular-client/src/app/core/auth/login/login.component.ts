import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { WorkspaceService } from '../../workspace-selection/workspace-selection.service';
import { jwtDecode } from 'jwt-decode';
import { forkJoin } from 'rxjs';

interface Workspace {
  _id?: string;
  name?: string;
  workspaceId?: string;
  role?: 'Editor' | 'Viewer';
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    trigger('pulse', [
      state('inactive', style({ transform: 'scale(1)' })),
      state('active', style({ transform: 'scale(1.05)' })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out')),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  rememberMe: boolean = false;
  isLoading: boolean = false;
  buttonState: string = 'inactive';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private workspaceService: WorkspaceService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.buttonState = 'active';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.buttonState = 'inactive';

        // store tokens
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);

        // decode JWT to get user id
        const decoded: any = jwtDecode(response.accessToken);
        if (decoded && decoded.sub) {
          localStorage.setItem('userId', decoded.sub);
        }

        // fetch workspaces from user object in response
        if (response.user?.workspaces?.length) {
          const workspaceObservables = response.user.workspaces.map((w: any) =>
            this.workspaceService.getWorkspaceById(w.workspaceId)
          );

          // 👇 Tell forkJoin that it will return Workspace[]
          forkJoin<Workspace[]>(workspaceObservables).subscribe({
            next: (workspaceData) => {
              const enrichedWorkspaces: Workspace[] = workspaceData.map(
                (ws: Workspace, index: number) => ({
                  workspaceId: response.user.workspaces[index].workspaceId!,
                  role: response.user.workspaces[index].role!,
                  name: ws.name,
                })
              );

              localStorage.setItem(
                'userWorkspaces',
                JSON.stringify(enrichedWorkspaces)
              );

              // ✅ Fix: ensure dashboard navigation if exactly 1 workspace
              if (enrichedWorkspaces.length === 1) {
                localStorage.setItem(
                  'workspaceId',
                  enrichedWorkspaces[0].workspaceId!
                );
                localStorage.setItem(
                  'workspaceRole',
                  enrichedWorkspaces[0].role!
                );

                // Use a microtask to ensure storage is fully written
                Promise.resolve().then(() => {
                  this.router.navigate(['/dashboard']);
                });
              } else {
                this.router.navigate(['/workspace']);
              }
            },
            error: (err) => {
              console.error('Error fetching workspace details', err);
              alert('Unable to fetch workspace names. Please try again.');
            },
          });
        } else {
          alert('You are not part of any workspace. Contact admin.');
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.buttonState = 'inactive';
        console.error('Login Error', err);
        alert('Invalid Email or Password');
      },
    });
  }

  onGoogleLogin(): void {
    console.log('Sign in with Google clicked!');
  }

  onAppleLogin(): void {
    console.log('Sign in with Apple ID clicked!');
  }
}
