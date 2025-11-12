import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    const email = this.loginForm.value.email || '';
    const password = this.loginForm.value.password || '';

    sessionStorage.setItem('es@es.com', '12');

    const ok = this.auth.login(email, password);

    if (ok) {
      this.router.navigate(['/home']);
    } else {
      this.error = 'Email o password errate';
    }
  }
}
