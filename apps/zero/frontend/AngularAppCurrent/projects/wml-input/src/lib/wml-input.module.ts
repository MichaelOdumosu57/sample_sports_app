import { NgModule } from '@angular/core';
import { WmlInputComponent } from './wml-input/wml-input.component';

// reactive forms module
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

let cpnts = [
  WmlInputComponent
]

@NgModule({
  declarations: [
    ...cpnts
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule
  ],
  exports: [
    ...cpnts
  ]
})
export class WmlInputModule { }
