import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login, Register, Roles, User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl: string = 'https://dioptrically-nonurban-elena.ngrok-free.dev/api/';

  // POST user
  public getUser(): Observable<Login> {
    return this.http.post<Login>(`${this.baseUrl}user/all`, {});
  }

  // POST user administration
  public getUserAdministration(): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}user/find_all_strict`, {});
  }

  // POST user
  // public register(): Observable<Register> {
  //   return this.http.post<Register>(`${this.baseUrl}user/register`, {});
  // }

  public role: Roles | null = null;

  login(username: string, password: string): Observable<Login> {
    return this.http.post<Login>(`${this.baseUrl}login`, { username, password });
  }

  register(email: string, username: string, password: string, confirmPassword: string): Observable<Register> {
    return this.http.post<Register>(`${this.baseUrl}user/register`, {email, username, password, confirmPassword });
  }

  setRole(role: Roles) {
    this.role = role;
    sessionStorage.setItem('role', role);
    console.log(role);
  }

  getRole() {
    if (!this.role) {
      const savedRole = sessionStorage.getItem('role') as Roles | null;
      this.role = savedRole;
    }
    return this.role;
  }

  get isAuthenticated(): boolean {
    return !!sessionStorage.getItem('jwt');
  }

  logout(): void {
    this.role = null;
    sessionStorage.removeItem('jwt');
  }
}
