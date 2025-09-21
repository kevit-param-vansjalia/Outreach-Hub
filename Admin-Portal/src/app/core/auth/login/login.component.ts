import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // If user is already logged in, redirect them to the dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        // On successful login, navigate to the admin dashboard.
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Admin Login Error', err);
        // You can add a more sophisticated notification system here (e.g., a toast message)
        alert('Login Failed: Invalid credentials or you do not have admin access.');
        this.loginForm.reset();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
