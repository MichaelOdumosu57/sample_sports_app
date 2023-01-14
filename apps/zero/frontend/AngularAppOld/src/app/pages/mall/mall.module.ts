import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MallRoutingModule } from './mall-routing.module';
import { MallMainComponent } from './mall-main/mall-main.component';


@NgModule({
  declarations: [
    MallMainComponent,
  ],
  imports: [
    CommonModule,
    MallRoutingModule
  ]
})
export class MallModule { }
