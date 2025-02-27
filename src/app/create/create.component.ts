import {Component, inject, Input} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NrTest} from '../../model/nr-test';
import {SelectionChange} from '@angular/cdk/collections';
import {NrExecution} from '../../model/nr-execution';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TestSelectionComponent} from './test-selection/test-selection.component';
import {TestConfirmationComponent} from './test-confirmation/test-confirmation.component';
import {MatButtonModule} from '@angular/material/button';
import {NrExecutionParam} from '../../model/nr-execution-param';
import {RecevabiliteService} from '../../service/recevabilite.service';

@Component({
  selector: 'app-create',
  imports: [
    MatStepperModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TestSelectionComponent,
    TestConfirmationComponent,
    MatButtonModule
  ],
  templateUrl: './create.component.html',
  standalone: true,
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  private _formBuilder = inject(FormBuilder);
  generalInfo = this._formBuilder.group({
    name: ['Default', Validators.required],
    description: ''
  });
  testSelection = this._formBuilder.group({
    selectedTests: ''
  });
  testConfirm = this._formBuilder.group({
    confirmedTests: ''
  });

  protected _nrTestsMap: Map<number, NrTest> = new Map<number, NrTest>()

  constructor(private recevabiliteService: RecevabiliteService) {
  }

  onSelectionChanged(selectionChange: SelectionChange<NrTest>) {
    selectionChange.removed.forEach(nrTest => this._nrTestsMap.delete(nrTest.id))
    selectionChange.added.forEach(nrTest => this._nrTestsMap.set(nrTest.id, nrTest))
  }

  get name(): string {
    let value = this.generalInfo.get('name')?.value
    return value == null || false ? '' : value
  }

  get description(): string {
    let value = this.generalInfo.get('description')?.value
    return value == null || false ? '' : value
  }

  toNrExecutionParams(nrTestId: number, reference: string): NrExecutionParam {
    return {
      nrTestId: nrTestId,
      reference: reference
    };
  }

  launchExecution() {
    const nrExecutionParams: NrExecutionParam[] = []
    for (const tnrTest of this._nrTestsMap.values()) {
      if (tnrTest.params.length == 0) {
        nrExecutionParams.push(this.toNrExecutionParams(tnrTest.id, 'NULL'))
      } else {
        tnrTest.params
          .map(param => this.toNrExecutionParams(tnrTest.id, param))
          .forEach(nrExecutionParam => nrExecutionParams.push(nrExecutionParam))
      }
    }
    const nrExecution: NrExecution = {
      name: this.name,
      description: this.description,
      status: 'pending',
      nrExecutionParams: nrExecutionParams
    }
    console.log('pushing',nrExecution)
    this.recevabiliteService.createExecution(nrExecution)
      .subscribe(data => console.log('created',data))
  }
}
