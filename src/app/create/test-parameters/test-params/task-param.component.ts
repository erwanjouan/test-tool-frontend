import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Task} from '../../../../model/task';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Param} from '../../../../model/param';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem} from '@angular/material/list';

@Component({
  selector: 'app-task-param',
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgForOf,
    MatLabel,
    MatIcon,
    MatList,
    MatListItem
  ],
  templateUrl: './task-param.component.html',
  standalone: true,
  styleUrl: './task-param.component.scss'
})
export class TaskParamComponent implements OnInit, OnChanges {

  @Input() task!: Task;

  form: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      params: this._fb.array([])
    })
  }
  
  get params(): FormArray {
    return this.form.controls['params'] as FormArray;
  }

  get title() {
    return this.task != null ? this.task.taskTemplate.title : '';
  }

  get content() {
    return this.task != null ? this.task.taskTemplate.content : '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  ngOnInit(): void {
    this.params.valueChanges
      .subscribe(changes => this.updateModel(changes))
  }

  addParam() {
    const paramForm = this._fb.group({
      value: ['', Validators.required],
    })
    this.params.push(paramForm);
  }

  deleteParam(index: number) {
    this.params.removeAt(index)
  }

  updateModel(changes: any) {
    this.task.params = []
    for (let change of changes) {
      if (change.value != null && change.value != '') {
        this.task.params.push({
          content: change.value
        })
        console.log(this.task.params)
      }
    }
  }

  addParameter(param: Param) {
    const paramForm = this._fb.group({
      value: [param.content, Validators.required],
    })
  }

  hasOneParam() {
    return this.params.length > 0;
  }


  private init() {
    if (this.task != null) {
      if (this.task.params.length > 0) {
        for (const param of this.task.params) {
          this.addParameter(param)
        }
      }
    }
  }
}
