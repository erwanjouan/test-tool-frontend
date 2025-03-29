import {Component} from '@angular/core';
import {TestTableComponent} from './test-table/test-table.component';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {LogComponent} from './log/log.component';

@Component({
  selector: 'app-home',
  imports: [
    TestTableComponent,
    MatButton,
    RouterLink,
    LogComponent
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
