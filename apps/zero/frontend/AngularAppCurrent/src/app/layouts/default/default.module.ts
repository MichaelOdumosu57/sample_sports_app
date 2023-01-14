import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// defaults
import { DefaultRoutingModule } from './default-routing.module';

// components
import { DefaultNavComponent } from './default-nav/default-nav.component';

import { DefaultBetslipComponent } from './default-betslip/default-betslip.component';

import { SharedModule } from '@shared/shared.module';
import { WmlTabsModule } from '@windmillcode/wml-tabs';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { DefaultNavShareComponent } from './default-nav-share/default-nav-share.component';
import { DefaultAsideComponent } from './default-aside/default-aside.component';
import { DefaultFooterComponent } from './default-footer/default-footer.component';

// material



@NgModule({
  declarations: [
    DefaultNavComponent,
    DefaultLayoutComponent,
    DefaultBetslipComponent,
    DefaultNavShareComponent,
    DefaultAsideComponent,
    DefaultFooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DefaultRoutingModule,
    WmlTabsModule
  ]
})
export class DefaultModule { }
