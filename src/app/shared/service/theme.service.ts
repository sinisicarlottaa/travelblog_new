import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // stato osservabile per chi vuole reagire al cambio tema
  private _isDarkMode = new BehaviorSubject<boolean>(false);
  readonly isDarkMode$ = this._isDarkMode.asObservable();

  constructor() {
    // inizializzazione: leggi da localStorage e applica la classe
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';

    this._isDarkMode.next(isDark);
    this.applyThemeClass(isDark);
  }

  toggleTheme(): void {
    const newValue = !this._isDarkMode.value;
    this._isDarkMode.next(newValue);
    this.applyThemeClass(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  setDarkMode(value: boolean): void {
    this._isDarkMode.next(value);
    this.applyThemeClass(value);
    localStorage.setItem('theme', value ? 'dark' : 'light');
  }

  private applyThemeClass(dark: boolean): void {
    const root = document.querySelector('.app-theme');
    if (!root) return;

    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
