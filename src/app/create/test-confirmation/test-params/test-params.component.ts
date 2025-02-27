import {Component, Input, OnInit} from '@angular/core';
import {NrTest} from '../../../../model/nr-test';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-test-params',
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgForOf,
    MatLabel
  ],
  templateUrl: './test-params.component.html',
  standalone: true,
  styleUrl: './test-params.component.scss'
})
export class TestParamsComponent implements OnInit {

  @Input() nrTest!: NrTest;

  form = new FormGroup({
    params: new FormArray([]),
  });

  ngOnInit(): void {
    this.nrTest.params = []
    this.params.valueChanges
      .subscribe(changes => this.nrTest.params = changes)
  }

  get params(): FormArray {
    return this.form.get('params') as FormArray;
  }

  addParam() {
    this.params.push(new FormControl());
    console.log(this.params.value);
  }

  removeParam() {
    this.params.removeAt(this.params.length-1)
  }
}
