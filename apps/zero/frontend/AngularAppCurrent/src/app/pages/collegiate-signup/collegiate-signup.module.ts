import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollegiateSignupRoutingModule } from './collegiate-signup-routing.module';
import { CollegiateSignupMainComponent } from './collegiate-signup-main/collegiate-signup-main.component';
import { SharedModule } from '@shared/shared.module';
import { WmlChipsModule } from '@windmillcode/wml-chips';


@NgModule({
  declarations: [
    CollegiateSignupMainComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CollegiateSignupRoutingModule,
    // MatAutocompleteModule,
    // MatChipsModule,
    // MatIconModule,
    // MatFormFieldModule
    WmlChipsModule
  ],
})
export class CollegiateSignupModule { }
