import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WmlFieldComponent } from '../public-api';
import { WmlLabelComponent } from './wml-label/wml-label.component';



let components= [
  WmlFieldComponent,
  WmlLabelComponent
]
@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ...components
  ]
})
export class WmlFieldModule { }
