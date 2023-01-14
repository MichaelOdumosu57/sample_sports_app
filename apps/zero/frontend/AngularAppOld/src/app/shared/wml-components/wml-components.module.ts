// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// wml components
import { WmlDropdownModule } from './wml-dropdown/wml-dropdown.module';

import { WmlNotifyModule } from '@windmillcode/wml-notify';
import { WmlPopupModule } from '@windmillcode/wml-popup';
import { WmlFieldModule } from '@windmillcode/wml-field';
import { WmlFormModule } from '@windmillcode/wml-form';
import { WmlInputModule } from '@windmillcode/wml-input';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    WmlFieldModule,
    WmlFormModule,
    WmlInputModule,
    WmlNotifyModule,
    WmlDropdownModule,
    WmlPopupModule
  ]
})
export class WmlComponentsModule { }
