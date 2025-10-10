import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {SelectionChange} from '@angular/cdk/collections';
import {Execution} from '../../model/execution';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {BackendService} from '../../service/backend.service';
import {TaskParametersComponent} from './test-parameters/task-parameters.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskTemplateSelectionComponent} from './task-template-selection/task-template-selection.component';
import {TaskTemplate} from '../../model/task-template';
import {Task} from '../../model/task';
import {TaskConfirmationComponent} from './task-confirmation/task-confirmation.component';

@Component({
  selector: 'app-create',
  imports: [
    MatStepperModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TaskParametersComponent,
    TaskTemplateSelectionComponent,
    TaskConfirmationComponent
  ],
  templateUrl: './create.component.html',
  standalone: true,
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {

  execution: Execution
  private _formBuilder = inject(FormBuilder);
  generalInfo = this._formBuilder.group({
    name: ['', Validators.required],
    description: ''
  });
  taskSelection = this._formBuilder.group({
    selectedTests: ''
  });
  taskParams = this._formBuilder.group({
    confirmedTests: ''
  });
  private readonly _backendService = inject(BackendService);
  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  get name(): string {
    let value = this.generalInfo.get('name')?.value
    return value == null || false ? '' : value
  }

  get description(): string {
    let value = this.generalInfo.get('description')?.value
    return value == null || false ? '' : value
  }

  ngOnInit(): void {
    const execId = this._route.snapshot.paramMap.get('executionId');
    if (execId != null) {
      this._backendService.getExecution(execId).subscribe(exec => {
        this.execution = exec;
        this.generalInfo.setValue({
          name: exec.name,
          description: exec.description
        })
      })
    }
  }

  onSelectionChanged(selectionChange: SelectionChange<TaskTemplate>) {
    selectionChange.removed.forEach(taskTemplate => this.removeTask(taskTemplate));
    selectionChange.added.forEach(taskTemplate => this.addIfMissing(taskTemplate))
  }

  removeTask(taskTemplate: TaskTemplate) {
    this.execution.tasks = this.execution.tasks
      .filter(task => task.taskTemplate.id !== taskTemplate.id)
  }

  private addIfMissing(taskTemplate: TaskTemplate) {
    let task: Task = this.toTask(taskTemplate);
    const duplicates: Task[] = this.execution.tasks
      .filter(task => task.taskTemplate.id === taskTemplate.id)
    if (duplicates.length == 0) {
      this.execution.tasks = this.execution.tasks.concat(task);
    }
  }

  createExecution(): void {
    this.execution.name = this.name
    this.execution.description = this.description
    this._backendService.saveExecution(this.execution)
      .subscribe(newExecution => {
        this._router.navigateByUrl("'home'");
      })
  }

  hasSelectedTask(): boolean {
    let hasExecution = this.execution != null && this.execution != undefined;
    if (hasExecution) {
      let hasTasks: boolean = this.execution.tasks != null && this.execution.tasks != undefined;
      return hasExecution && hasTasks && this.execution.tasks.length > 0;
    }
    return false;
  }

  toTask(taskTemplate: TaskTemplate): Task {
    return {
      taskTemplate: taskTemplate,
      status: 'CREATED',
      params: []
    }
  }
}
