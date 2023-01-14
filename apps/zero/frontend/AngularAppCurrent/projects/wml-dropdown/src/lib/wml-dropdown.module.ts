import { NgModule } from '@angular/core';
import { WmlDropdownComponent } from './wml-dropdown/wml-dropdown.component';
import { WmlDropdownIteratorComponent } from './wml-dropdown-iterator/wml-dropdown-iterator.component';
import { WmlDropdownSampleComponent } from './wml-dropdown-sample/wml-dropdown-sample.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    WmlDropdownComponent,
    WmlDropdownIteratorComponent,
    WmlDropdownSampleComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    WmlDropdownComponent
  ]
})
export class WmlDropdownModule { }
