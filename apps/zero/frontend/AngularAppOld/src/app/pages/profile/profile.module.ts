import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileMainComponent } from './profile-main/profile-main.component';
import { TranslateModule } from '@ngx-translate/core';
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


