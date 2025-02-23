import {Component} from '@angular/core';
import {CreateTestComponent} from './create-test/create-test.component';
import {TestTableComponent} from './test-table/test-table.component';

@Component({
  selector: 'app-home',
  imports: [
    CreateTestComponent,
    TestTableComponent
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
