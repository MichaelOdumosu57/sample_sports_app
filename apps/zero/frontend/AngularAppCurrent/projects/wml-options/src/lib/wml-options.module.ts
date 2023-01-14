import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WmlOptionsComponent } from './wml-options/wml-options.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    WmlOptionsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class WmlOptionsModule { }
