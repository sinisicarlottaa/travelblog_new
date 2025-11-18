import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, Routes } from '@angular/router';
import { AuthService } from './auth.service';
import { Roles } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (sessionStorage.getItem('jwt')) {
      // if (!route.data['role'] ) {
      //   return false;
      // }

      const requiredRole = route.data['role'] as Roles;
      const userRole = this.auth.getRole();

      if (requiredRole && userRole !== requiredRole) {
        this.router.navigate(['/home']);
      }
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
