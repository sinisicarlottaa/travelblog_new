import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { ThemeService } from '../shared/service/theme.service';
import { Subscription } from 'rxjs';
import { AuthDirective } from '../shared/directives/auth-directive';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AuthDirective, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly title = signal('ngx-translate-demo-standalone');
  currentLang = signal('it');
  private router = inject(Router);
  public authService = inject(AuthService);
  path = input<string>();

  isDarkMode = false;
  public sub?: Subscription;

  constructor(private themeService: ThemeService, private translateService: TranslateService) {
    const saved = localStorage.getItem('lang');
    const initial = saved || this.translateService.getCurrentLang() || 'en';

    this.currentLang.set(initial);
    this.translateService.use(initial);

    this.translateService.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang);
    });

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

  toggleLanguage() {
    const next = this.currentLang() === 'en' ? 'it' : 'en';
    this.translateService.use(next);
    localStorage.setItem('lang', next);
  }
}
