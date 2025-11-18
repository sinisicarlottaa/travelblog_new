import { Routes } from '@angular/router';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { AuthGuard } from './shared/auth/auth.guard'; 
import { Roles } from './shared/models/auth.model';

export const routes: Routes = [
  {
    path: '',
    component: AuthPageComponent,
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./home-page/home-page.component').then((m) => m.HomeComponent),
  },
  {
    path: 'visited-mytravels',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./visited-mytravels-page/visited-mytravels-page.component').then(
        (m) => m.VisitedMyTravelsPageComponent
      ),
  },
  {
    path: 'visited-alltravels',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./visited-alltravels-page/visited-alltravels-page.component').then(
        (m) => m.VisitedAllTravelsPageComponent
      ),
  },
  {
    path: 'next-travels',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./next-travels-page/next-travels-page.component').then(
        (m) => m.NextTravelsPageComponent
      ),
  },
  {
    path: 'statistics',
    canActivate: [AuthGuard],
    data: {role : Roles.ADMIN},
    loadComponent: () =>
      import('./statistics-page/statistics-page.component').then(
        (m) => m.StatisticsPageComponent
      ),
  },
  {
    path: 'new-travel',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./new-travel-page/new-travel-page.component').then((m) => m.NewTravelPageComponent),
  },
  {
    path: 'travel-detail/:travelId',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./travel-detail-page/travel-detail-page.component').then(
        (m) => m.TravelDetailPageComponent
      ),
  },
];
