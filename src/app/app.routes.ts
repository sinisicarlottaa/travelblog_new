import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./home-page/home-page.component').then((m) => m.HomeComponent),
  },
  {
    path: 'visited-travels',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./visited-travels-page/visited-travels-page.component').then(
        (m) => m.VisitedTravelsPageComponent
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
