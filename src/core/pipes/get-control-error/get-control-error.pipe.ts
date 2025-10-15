import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'hasError',
  pure: false,
  standalone: false
})
export class HasErrorPipe implements PipeTransform {
  public transform(form: AbstractControl<any, any> | FormArray | FormGroup, getter: number | string, errorName: string): boolean {
    let control: FormControl;

    if (form instanceof FormArray) {
      control = form.at(Number(getter)) as FormControl;
    } else {
      control = form.get(String(getter)) as FormControl;
    }

    return control.hasError(errorName);
  }
}