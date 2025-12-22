import {Component} from '@angular/core';
import {ExecutionTableComponent} from './execution-table/execution-table.component';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    ExecutionTableComponent,
    MatButton,
    RouterLink
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
