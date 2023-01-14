import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileMainComponent } from './profile-main/profile-main.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    ProfileMainComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,

    SharedModule
  ]
})
export class ProfileModule { }


