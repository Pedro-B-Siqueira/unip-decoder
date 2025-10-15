import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'getControl',
  standalone: false
})
export class GetControlPipe implements PipeTransform {
  public transform(form: AbstractControl<any, any> | FormArray | FormGroup, getter: number | string): FormControl {
    if (form instanceof FormArray) {
      return form.at(Number(getter)) as FormControl;
    }

    return form.get(String(getter)) as FormControl;
  }
}
