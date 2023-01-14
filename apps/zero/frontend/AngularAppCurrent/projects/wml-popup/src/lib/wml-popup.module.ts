import { NgModule } from '@angular/core';
import { WmlPopupComponent } from './wml-popup/wml-popup.component';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';

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
