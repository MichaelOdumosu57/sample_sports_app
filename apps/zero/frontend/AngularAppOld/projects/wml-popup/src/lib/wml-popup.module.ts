import { NgModule } from '@angular/core';
import { WmlPopupComponent } from './wml-popup/wml-popup.component';
import {MatCardModule} from '@angular/material/card';

// material

@NgModule({
  declarations: [
    WmlPopupComponent
  ],
  imports: [
    MatCardModule
  ],
  exports: [
    WmlPopupComponent
  ]
})
export class WmlPopupModule { }
