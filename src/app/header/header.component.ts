import {Component, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {ThemeToggleComponent} from './theme-toggle/theme-toggle.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    RouterLink,
    ThemeToggleComponent
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  applicationVersion: string;

  ngOnInit(): void {
    this.applicationVersion = environment.applicationVersion;
  }

}
