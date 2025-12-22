import {Component, Input, output} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Execution} from '../../../model/execution';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-task-info',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './task-info.component.html',
  standalone: true,
  styleUrl: './task-info.component.scss'
})
export class TaskInfoComponent {
  inputFormControl = new FormControl('', [Validators.required]);
  descriptionFormControl = new FormControl('', []);
  matcher = new MyErrorStateMatcher();

  onTitleUpdate = output<string>({alias: 'titleModified'});
  onDescriptionUpdate = output<string>({alias: 'descriptionModified'});
  @Input() nrTestExecution!: Execution;

  updateTitle() {
    if (this.inputFormControl.value != null) {
      this.onTitleUpdate.emit(this.inputFormControl.value);
    }
  }

  updateDescription() {
    if (this.descriptionFormControl.value != null) {
      this.onDescriptionUpdate.emit(this.descriptionFormControl.value);
    }
  }
}
