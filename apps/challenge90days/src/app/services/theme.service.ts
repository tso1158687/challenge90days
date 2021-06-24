import { Injectable } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themeToggle = true;
  constructor(private themeService: NbThemeService) {
    this.detectTheme();
  }

  changeThemeMode(themeToggle: boolean): void {
    const theme = themeToggle ? 'dark' : 'default';
    this.themeService.changeTheme(theme);
  }

  detectTheme(): void {
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.themeToggle = isDarkMode;
    this.changeThemeMode(this.themeToggle);
  }
}
