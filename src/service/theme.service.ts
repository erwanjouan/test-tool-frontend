import {inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly document: Document = inject(DOCUMENT);
  private localStorageKey: string = 'dark.mode.enabled';

  constructor() {
  }

  getInitialDarkModeValue(): boolean {
    let darkModeConfig = localStorage.getItem(this.localStorageKey)
    if (darkModeConfig == null) {
      darkModeConfig = 'false'
      localStorage.setItem(this.localStorageKey, darkModeConfig)
    }
    const isDarkModeEnabled:boolean = darkModeConfig === 'true'
    this.setTheme(isDarkModeEnabled);
    return isDarkModeEnabled
  }

  toggleDarkMode():boolean {
    const darkModeConfig = localStorage.getItem(this.localStorageKey)
    const newDarkModeConfig = darkModeConfig == 'true' ? 'false' : 'true'
    localStorage.setItem(this.localStorageKey, newDarkModeConfig)
    const isDarkModeEnabled = newDarkModeConfig === 'true'
    this.setTheme(isDarkModeEnabled)
    return isDarkModeEnabled
  }

  setTheme(isDarkMode: boolean) {
    if (isDarkMode) {
      this.document.documentElement.classList.add('dark-mode');
    } else {
      this.document.documentElement.classList.remove('dark-mode');
    }
  }

}
