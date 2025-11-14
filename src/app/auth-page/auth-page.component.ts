import { Component } from '@angular/core';
import { AuthComponent } from '../auth/auth.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth-page',
  imports: [AuthComponent, AuthComponent],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthPageComponent {}
