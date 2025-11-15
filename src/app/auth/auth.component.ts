import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { PasswordMatch } from '../shared/directives/password-match';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  isRegistered = true;
  error = '';

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true
    }),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
  if (this.loginForm.invalid) {
    this.error = 'Compila tutti i campi';
    return;
  }

  const email = this.loginForm.value.email!;
  const password = this.loginForm.value.password!;

  this.authService.login(email, password).subscribe({
    next: () => {
      this.error = '';
      this.router.navigate(['/home']);
    },
    error: () => {
      this.error = 'Credenziali non valide';
    }
  });
}

}
