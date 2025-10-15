import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GetControlPipe } from './get-control/get-control.pipe';
import { HasErrorPipe } from './get-control-error/get-control-error.pipe';

@NgModule({
  declarations: [
    GetControlPipe,
    HasErrorPipe,
  ],
  exports: [
    GetControlPipe,
    HasErrorPipe,
  ],
  imports: [CommonModule],
  providers: [],
})
export class PipesModule {}
