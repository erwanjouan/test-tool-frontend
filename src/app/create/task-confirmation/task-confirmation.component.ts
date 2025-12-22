import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {MatLabel} from '@angular/material/form-field';
import {Execution} from '../../../model/execution';
import {Param} from '../../../model/param';
import {Task} from '../../../model/task';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem} from '@angular/material/list';

@Component({
  selector: 'app-task-confirmation',
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgForOf,
    MatLabel,
    MatIcon,
    MatList,
    MatListItem
  ],
  templateUrl: './task-confirmation.component.html',
  standalone: true,
  styleUrl: './task-confirmation.component.scss'
})
export class TaskConfirmationComponent {
  @Input() execution: Execution;

  display(param: Param): string {
    return param.content
  }

  get name(): string {
    return this.execution != null ? this.execution.name : '';
  }

  get description(): string {
    return this.execution != null ? this.execution.description : '';
  }

  get tasks(): Task[] {
    return this.execution != null ? this.execution.tasks : [];
  }
}
