import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { ThemeComponent } from '../theme/theme.component';
import { ThemeService } from '../shared/service/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  public authService = inject(AuthService);
  path = input<string>();

  onLogOut() {
  this.authService.logout();
  sessionStorage.clear(); // opzionale
  this.router.navigate(['/']);
}

}
