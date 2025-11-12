import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  public auth = inject(AuthService);
  path = input<string>();

  onLogOut() {
    this.auth.isLogged = false;
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
