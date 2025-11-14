import { HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class AuthService {
  
intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = sessionStorage.getItem('jwt');

    if (!token) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: { Authorization: 'Bearer ' + token }
    });

    return next.handle(cloned);
  }  

  private role: 'ADMIN' | 'USER' | null = null;

  login(email: string, password: string) {
    if (email.includes('admin')) {
      this.role = 'ADMIN';
    } else {
      this.role = 'USER';
    }

    // finto token
   sessionStorage.setItem('jwta', 'MOCK_TOKEN');
  }

  getRole() {
    return this.role;
  }

  isAdmin() {
    return this.role === 'ADMIN';
  }

  isUser() {
    return this.role === 'USER';
  }
  
  logout(): void {
  this.role = null;
  sessionStorage.removeItem('jwt');
}

  
  // private readonly validEmail = 'sinisicarlotta@gmail.com';
  // private readonly validPassword = '12';

  // isLogged = sessionStorage.getItem('isLoggedIn') === 'true';

  // login(email: string, password: string): boolean {
  //   const validCredentials = email === this.validEmail && password === this.validPassword;
  //   this.isLogged = validCredentials;
  //   sessionStorage.setItem('isLoggedIn', String(validCredentials));
  //   return validCredentials;
  // }

  // logout(): void {
  //   this.isLogged = false;
  //   sessionStorage.removeItem('isLoggedIn');
  // }

  // get isAuthenticated(): boolean {
  //   return this.isLogged;
  // }
}
