import {Component, inject, OnInit} from '@angular/core';
import {ThemeService} from '../../../service/theme.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-theme-toggle',
  imports: [MatButtonModule, MatIconModule, MatSlideToggleModule, MatTooltipModule],
  templateUrl: './theme-toggle.component.html',
  standalone: true,
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent implements OnInit{

  private readonly themeService = inject(ThemeService)
  isDarkModeEnabled:boolean;

  ngOnInit(): void {
    this.isDarkModeEnabled = this.themeService.getInitialDarkModeValue()
  }

  toggleTheme() {
    this.isDarkModeEnabled = this.themeService.toggleDarkMode()
  }

  getToolTip() {
    return this.isDarkModeEnabled ? 'Vers le mode clair':'Vers le mode sombre';
  }
}
