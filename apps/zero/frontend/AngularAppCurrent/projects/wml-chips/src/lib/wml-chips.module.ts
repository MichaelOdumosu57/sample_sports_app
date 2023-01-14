import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { WmlChipsComponent } from './wml-chips/wml-chips.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";


import { CommonModule } from '@angular/common';

let materialModules=[
  MatAutocompleteModule,
]
@NgModule({
  declarations: [
    WmlChipsComponent,
  ],

  imports: [
    TranslateModule,
    ReactiveFormsModule,
    ...materialModules,
    CommonModule,

  ],


})
export class WmlChipsModule { }
