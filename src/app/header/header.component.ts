import { Component, inject, input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
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
  public sub?: Subscription;
  constructor(private themeService: ThemeService) {
    this.sub = this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogOut() {
    this.authService.logout();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
