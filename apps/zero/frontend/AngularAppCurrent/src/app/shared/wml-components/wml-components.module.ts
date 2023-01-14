// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// wml components
import { WmlDropdownModule } from '@windmillcode/wml-dropdown';

import { WmlNotifyModule } from '@windmillcode/wml-notify';
import { WmlPopupModule } from '@windmillcode/wml-popup';
import { WmlFieldModule } from '@windmillcode/wml-field';
import { WmlFormModule } from '@windmillcode/wml-form';
import { WmlInputModule } from '@windmillcode/wml-input';
import { WmlChipsModule } from '@windmillcode/wml-chips';
import { WmlFileManagerModule } from '@windmillcode/wml-file-manager';
import { WmlOptionsModule } from '@windmillcode/wml-options';
import { WmlSliceboxModule } from '@windmillcode/wml-slicebox';


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
    WmlPopupModule,
    WmlChipsModule,
    WmlFileManagerModule,
    WmlOptionsModule,
    WmlSliceboxModule
  ]
})
export class WmlComponentsModule { }
