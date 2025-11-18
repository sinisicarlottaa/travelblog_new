// import { inject, Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   Router,
//   RouterStateSnapshot,
// } from '@angular/router';
// import { AuthService } from './auth.service';
// import { Roles } from '../models/auth.model';

// @Injectable({ providedIn: 'root' })
// export class RoleGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     if (sessionStorage.getItem('jwt')) {
//       const requiredRole = route.data['role'] as Roles;
//       const userRole = this.auth.getRole();

//       if (requiredRole && userRole !== requiredRole) {
//         this.router.navigate(['/home']);
//       }
//       return true;
//     } else {
//       this.router.navigate(['/']);
//       return false;
//     }
//   }
// }
// // 