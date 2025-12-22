import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Task} from '../../../model/task';

export function testSelectionValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

    const value:Task[] = control.value;

    console.log(value);

    if (!value) {
      return null;
    }

    const selectionValid = value.length > 0;

    return !selectionValid ? {nonEmptySelection:true}: null;
  }
}
