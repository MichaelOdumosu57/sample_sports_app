import { NgModule } from '@angular/core';
import { WmlFormComponent } from './wml-form/wml-form.component';


// material
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { WmlFieldModule } from '@windmillcode/wml-field';
@NgModule({
  declarations: [
    WmlFormComponent
  ],
  imports: [
    MatCardModule,
    WmlFieldModule,
    CommonModule
  ],
  exports: [
    WmlFormComponent
  ]
})
export class WmlFormModule { }
