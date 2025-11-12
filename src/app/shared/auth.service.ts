import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly validEmail = 'sinisicarlotta@gmail.com';
  private readonly validPassword = '12';

  isLogged = sessionStorage.getItem('isLoggedIn') === 'true';

  login(email: string, password: string): boolean {
    const validCredentials = email === this.validEmail && password === this.validPassword;
    this.isLogged = validCredentials;
    sessionStorage.setItem('isLoggedIn', String(validCredentials));
    return validCredentials;
  }

  logout(): void {
    this.isLogged = false;
    sessionStorage.removeItem('isLoggedIn');
  }

  get isAuthenticated(): boolean {
    return this.isLogged;
  }
}
