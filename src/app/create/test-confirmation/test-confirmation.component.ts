import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {NrTest} from '../../../model/nr-test';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {KeyValuePipe, NgForOf} from '@angular/common';
import {TestParamsComponent} from '../test-parameters/test-params/test-params.component';
import {MatLabel} from '@angular/material/form-field';

@Component({
  selector: 'app-test-confirmation',
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgForOf,
    KeyValuePipe,
    MatLabel
  ],
  templateUrl: './test-confirmation.component.html',
  standalone: true,
  styleUrl: './test-confirmation.component.scss'
})
export class TestConfirmationComponent {
  @Input() testName: string | null | undefined;
  @Input() testDescription: string  | null | undefined;
  @Input() testMap: Map<number, NrTest>;
}
