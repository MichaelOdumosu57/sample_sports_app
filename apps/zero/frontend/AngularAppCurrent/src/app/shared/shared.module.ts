// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// wml components
import { WmlComponentsModule } from './wml-components/wml-components.module';

// i18n
import { TranslateModule } from '@ngx-translate/core';

// misc
import { NotifyBannerComponent } from './components/notify-banner/notify-banner.component';
import { SampleCpntComponent } from './components/sample-cpnt/sample-cpnt.component';

import { CustomLabelComponent } from './components/custom-label/custom-label.component';

import { ScrollBottomPaginationDirective } from './directives/scroll-bottom-pagination-directive/scroll-bottom-pagination.directive';

import { NiblsIsPresentDirective } from '../../../projects/nibls-is-present/src/public-api';
import {  MobileNavModule } from '../../../projects/mobile-nav/src/public-api';
import { MobileNavItemPodComponent } from './components/mobile-nav-item-pod/mobile-nav-item-pod.component';
import { EventCardComponent } from './components/event-card/event-card.component';


// ngrx
import { StoreModule } from '@ngrx/store';
import { getSpotifyReducer } from './store/spotify/spotify.reducers';
import { OverlayLoadingComponent } from './components/overlay-loading/overlay-loading.component';


// material
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ShowTextComponent } from './components/show-text/show-text.component';


let components = [
  SampleCpntComponent,
  CustomLabelComponent,
  ScrollBottomPaginationDirective,
  MobileNavItemPodComponent,
  OverlayLoadingComponent,
  EventCardComponent,
  // lib
  NiblsIsPresentDirective,

]

let materialModules =[
  MatCardModule
]
let modules = [
  TranslateModule,
  MobileNavModule,
  CommonModule,
  ...materialModules
]
@NgModule({
  imports:[
    ...modules,
    RouterModule,
    StoreModule.forFeature('spotify', getSpotifyReducer),
  ],
  exports: [
    ...components,
    ...modules,
    WmlComponentsModule,
    HttpClientModule,
  ],
  providers:[

  ],
  declarations: [
    ...components,
    NotifyBannerComponent,
    ShowTextComponent,


  ]
})
export class SharedModule { }
