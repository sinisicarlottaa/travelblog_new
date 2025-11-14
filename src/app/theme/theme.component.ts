import { Component } from '@angular/core';
import { ThemeService } from '../shared/service/theme.service';

@Component({
  selector: 'app-theme',
  imports: [],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeComponent {
//  constructor(private themeService: ThemeService) {}

//   // Alterna tra modalità light e dark
//   toggleTheme() {
//     const currentTheme = this.themeService.getTheme();
//     const newTheme = currentTheme === 'light' ? 'dark' : 'light';  // Alterna il tema
//     this.themeService.setTheme(newTheme);  // Imposta il nuovo tema
//   }
}
