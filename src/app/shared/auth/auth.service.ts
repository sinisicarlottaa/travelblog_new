import {
  HttpClient,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

type Role = 'ADMIN' | 'USER' | null;

@Injectable({ providedIn: 'root' })
export class AuthService implements HttpInterceptor {

  private baseUrl = 'https://dioptrically-nonurban-elena.ngrok-free.dev/api/';
  private role: Role = null;  // 👈 usato dalla direttiva

  constructor(private http: HttpClient) {
    // se ricarichi la pagina, recupero il ruolo salvato
    const storedRole = sessionStorage.getItem('role') as Role;
    if (storedRole === 'ADMIN' || storedRole === 'USER') {
      this.role = storedRole;
    }
  }

  // ---------------------------
  //  INTERCEPTOR: aggiunge il token se esiste
  // ---------------------------
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('jwt');

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(req);
  }

  // ---------------------------
  //  LOGIN: chiama il backend, salva token + ruolo
  // ---------------------------
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(this.baseUrl + 'auth/login', { email, password })
      .pipe(
        tap((res) => {
          // salvo il JWT
          sessionStorage.setItem('jwt', res.token);

          // decodifico il token per leggere il ruolo
          const decoded = this.decodeToken(res.token);
          const roleFromToken = decoded?.role as Role ?? null;

          this.role = roleFromToken;
          if (this.role) {
            sessionStorage.setItem('role', this.role);
          } else {
            sessionStorage.removeItem('role');
          }
        })
      );
  }

  // funzione di utilità per leggere il payload del JWT
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  // ---------------------------
  //  Esempio di chiamata autenticata
  // ---------------------------
  getUser(): Observable<any[]> {
    return this.http.post<any[]>(this.baseUrl + 'user/all', {});
  }

  // ---------------------------
  //  Metodi usati da guard / direttiva
  // ---------------------------
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('jwt');
  }

  getRole(): Role {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  isUser(): boolean {
    return this.role === 'USER';
  }

  // ---------------------------
  //  LOGOUT
  // ---------------------------
  logout(): void {
    this.role = null;
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('role');
  }
}
