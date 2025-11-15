import { Component, inject, input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { ThemeComponent } from '../theme/theme.component';
import { ThemeService } from '../shared/service/theme.service';
import { Subscription } from 'rxjs';
import { AuthDirective } from '../shared/directives/auth-directive';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AuthDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  public authService = inject(AuthService);
  path = input<string>();

  isDarkMode = false;
  private sub?: Subscription;
  constructor(private themeService: ThemeService) {
    // ci iscriviamo per sapere se il tema cambia
    this.sub = this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  gOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogOut() {
    this.authService.logout();
    sessionStorage.clear(); // opzionale
    this.router.navigate(['/']);
  }
}
