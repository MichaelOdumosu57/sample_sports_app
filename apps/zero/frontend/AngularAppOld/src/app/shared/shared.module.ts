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
import { DropdownOptionComponent } from './components/dropdown-option/dropdown-option.component';
import { NavComponent } from './components/nav/nav.component';
import { CustomLabelComponent } from './components/custom-label/custom-label.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollBottomPaginationDirective } from './directives/scroll-bottom-pagination-directive/scroll-bottom-pagination.directive';
import { SpotifyPlaylistsComponent } from './components/spotify-playlists/spotify-playlists.component';
import { NiblsIsPresentDirective } from '../../../projects/nibls-is-present/src/public-api';
import {  MobileNavModule } from '../../../projects/mobile-nav/src/public-api';
import { MobileNavItemPodComponent } from './components/mobile-nav-item-pod/mobile-nav-item-pod.component';


// ngrx
import { StoreModule } from '@ngrx/store';
import { getSpotifyReducer } from './store/spotify/spotify.reducers';
import { OverlayLoadingComponent } from './components/overlay-loading/overlay-loading.component';


// material
import { MatCardModule } from '@angular/material/card';


let components = [
  SampleCpntComponent,
  NavComponent,
  CustomLabelComponent,
  FooterComponent,
  ScrollBottomPaginationDirective,
  SpotifyPlaylistsComponent,
  MobileNavItemPodComponent,
  OverlayLoadingComponent,
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
  declarations: [
    ...components,
    DropdownOptionComponent,
    NotifyBannerComponent,


  ]
})
export class SharedModule { }
