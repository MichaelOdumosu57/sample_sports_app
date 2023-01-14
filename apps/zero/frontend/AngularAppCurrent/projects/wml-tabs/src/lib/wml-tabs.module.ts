import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WmlTabsComponent } from './wml-tabs/wml-tabs.component';
import { TranslateModule } from '@ngx-translate/core';
import { WmlTabBodyComponent } from './wml-tab-body/wml-tab-body.component';
import { WmlSampleTabBodyComponent } from './wml-sample-tab-body/wml-sample-tab-body.component';


let cpnts = [
  WmlTabsComponent,
  WmlTabBodyComponent
]

@NgModule({
  declarations: [
    ...cpnts,
    WmlSampleTabBodyComponent
  ],
  exports:[
    ...cpnts
  ],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class WmlTabsModule { }
