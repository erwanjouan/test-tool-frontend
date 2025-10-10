import {Component, Input} from '@angular/core';
import {Task} from '../../../model/task';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {TaskParamComponent} from './test-params/task-param.component';
import {Execution} from '../../../model/execution';

@Component({
  selector: 'app-task-parameters',
  imports: [MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgForOf, TaskParamComponent
  ],
  templateUrl: './task-parameters.component.html',
  standalone: true,
  styleUrl: './task-parameters.component.scss'
})
export class TaskParametersComponent {

  @Input() execution: Execution;

  get name(): string {
    if (this.execution) {
      return this.execution.name != null ? this.execution.name : '';
    }
    return ''
  }

  get tasks(): Task[] {
    if (this.execution) {
      return this.execution.tasks != null ? this.execution.tasks : [];
    }
    return [];
  }

}
