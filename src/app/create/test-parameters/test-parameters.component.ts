import {Component, Input} from '@angular/core';
import {NrTest} from '../../../model/nr-test';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {KeyValuePipe, NgForOf} from '@angular/common';
import {TestParamsComponent} from './test-params/test-params.component';

@Component({
  selector: 'app-test-parameters',
  imports: [MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgForOf,
    KeyValuePipe,
    TestParamsComponent],
  templateUrl: './test-parameters.component.html',
  standalone: true,
  styleUrl: './test-parameters.component.scss'
})
export class TestParametersComponent {
  @Input() testName: string | null | undefined;
  @Input() testDescription: string  | null | undefined;
  @Input() testMap: Map<number, NrTest>;
}
