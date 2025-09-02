import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('float', [
      state('in', style({ transform: 'translateY(0)' })),
      transition('void => *', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('0.5s ease-out')
      ]),
    ]),
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.7s ease-out')
      ]),
    ]),
    trigger('fadeIn', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('0.5s ease-in')
      ]),
    ]),
    trigger('pulse', [
      state('inactive', style({
        transform: 'scale(1)'
      })),
      state('active', style({
        transform: 'scale(1.05)'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  rememberMe: boolean = false;
  isLoading: boolean = false;
  buttonState: string = 'inactive';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.buttonState = 'active';

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.buttonState = 'inactive';
        console.log('Form Submitted!', this.loginForm.value);
        // Here you would typically navigate to a new page
        // this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onGoogleLogin(): void {
    console.log('Sign in with Google clicked!');
  }

  onAppleLogin(): void {
    console.log('Sign in with Apple ID clicked!');
  }
}