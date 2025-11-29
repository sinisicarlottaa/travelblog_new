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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormsModule, TranslatePipe],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  isRegistered = true;
  error = '';

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  // async onLogin2() {
  //   try {
  //     console.log('init login');
  //     if (this.loginForm.invalid) {
  //       this.error = 'Compila tutti i campi';
  //       return;
  //     }

  //     const username = this.loginForm.value.email || '';
  //     const password = this.loginForm.value.password || '';

  //     const risposta = await firstValueFrom(this.authService.login(username, password));

  //     const token = risposta.token;
  //     console.log('subscribe');
  //     if (!token) {
  //       this.error = 'Token non ricevuto dal server';
  //       return;
  //     }

  //     sessionStorage.setItem('jwt', token);

  //     this.isRegistered = true;
  //     this.error = '';
  //     this.router.navigate(['/home']);
  //   } catch {
  //     console.log('error');
  //     this.error = 'Credenziali non valide';
  //   } finally {

  //   }
  // }


  onLogin() {
    if (this.loginForm.invalid) {
      this.error = this.translateService.instant('LOGIN.ERROR_FILL_ALL_FIELDS')!;
      return;
    }

    const username = this.loginForm.value.username || '';
    const password = this.loginForm.value.password || '';

    this.authService.login(username, password).subscribe({
      next: (response) => {
        const token = response.jwt;
        if (!token) {
          this.error = this.translateService.instant('LOGIN.ERROR')!;
          return;
        }

        sessionStorage.setItem('jwt', token);

        const role = response.userDetails?.roles?.[0]?.role;
        this.authService.setRole(role);

        this.isRegistered = true;
        this.error = '';
        this.router.navigate(['/home']);
      },
      error: () => {
        console.log('error');
        this.error = this.translateService.instant('LOGIN.INVALID_CREDENTIALS')!;
      },
    });
  }

  onRegister() {
    if (this.loginForm.invalid) {
      this.error = this.translateService.instant('LOGIN.ERROR_FILL_ALL_FIELDS')!;
      return;
    }

    const username = this.loginForm.value.username || '';
    const email = this.loginForm.value.email || '';
    const password = this.loginForm.value.password || '';
    const confirmPassword = this.loginForm.value.confirmPassword || '';

    this.authService.register(email, username, password, confirmPassword).subscribe({
      next: () => {
        this.isRegistered = true;
        this.error = '';
        this.router.navigate(['/']);
      },
      error: () => {
        console.log('error');
        this.error = this.translateService.instant('LOGIN.ERROR_REGISTER')!;
      },
    });
  }
}
