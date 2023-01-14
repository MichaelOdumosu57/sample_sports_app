import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NiblsballRoutingModule } from './niblsball-routing.module';
import { NiblsballMainComponent } from './niblsball-main/niblsball-main.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    NiblsballMainComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NiblsballRoutingModule
  ]
})
export class NiblsballModule { }
