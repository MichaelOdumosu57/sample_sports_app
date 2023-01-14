// angular
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { forkJoin, merge, pipe, Subject, takeUntil, tap } from 'rxjs';

// services
import { NavService } from '@shared/services/nav/nav.service';
import { BaseService, GenerateMobileNavBtnItemParams } from '@core/base/base.service';

// misc
import { ENV,environment as env } from '@env/environment';
import {  UtilityService } from '@core/utility/utility.service';

import { MobileNavParams } from '../../projects/mobile-nav/src/public-api';
import { MobileNavItemParams } from '../../projects/mobile-nav/src/lib/mobile-nav-item/mobile-nav-item.component';
import { MobileNavItemPodComponent, MobileNavItemPodParams } from '@shared/components/mobile-nav-item-pod/mobile-nav-item-pod.component';

// wml-components
import { WMLImage } from '@windmillcode/wml-components-base';
import { HttpClient } from '@angular/common/http';
import { WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { AccountService } from '@shared/services/account/account.service';
import { BlockchainService } from '@shared/services/bitcoin/blockchain.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  constructor(
    public baseService: BaseService,
    public utilService: UtilityService,
    public cdref: ChangeDetectorRef,
    public vcf: ViewContainerRef,
    public router:Router,
    public navService:NavService,
    public http:HttpClient,
    public wmlNotifyService:WmlNotifyService,
    public accountService:AccountService,
    public blockchainService:BlockchainService
  ) {
    this.listenForChangesOutSideChangeDetection().subscribe()
  }

  classPrefix = this.utilService.generateClassPrefix(ENV.classPrefix.app)
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub = new Subject<void>()
  webStorage = {
    siteUnderConstructionBannerWasOpened:false
  }


  headerMobileNavItem =new MobileNavItemParams({
    cpnt:MobileNavItemPodComponent,
    meta: new MobileNavItemPodParams({
      type:"img",
      img:new WMLImage({
        src:"assets/media/logo_0.png",
        alt:"global.logoImgAlt",
      })
    })
  })

  navigateWhenMobileNavItemIsClicked = (destination:string,type:"route"|"page"="route")=>{
    return ($evt)=>{
      $evt.preventDefault()
      if(type === "route"){

        this.router.navigateByUrl(destination)
      }
      else{
        window.open(destination,"_self")
      }
      this.baseService.toggleMobileNavSubj.next(false)
    }
  }
  teamMobileNavItem = this.baseService.generateMobileNavLinkItem(
    "nav.mainNav.0",
    this.navigateWhenMobileNavItemIsClicked(ENV.nav.urls.team)
    )
  eventsMobileNavItem = this.baseService.generateMobileNavLinkItem(
    "nav.mainNav.1",
    this.navigateWhenMobileNavItemIsClicked(ENV.nav.urls.events)
    )

  mallMobileNavItem = this.baseService.generateMobileNavLinkItem(
    "nav.mainNav.2",
    this.navigateWhenMobileNavItemIsClicked(ENV.nav.urls.mall,"page")
    )
  signInNavItem = this.baseService.generateMobileNavLinkItem(
    "nav.navItemsOne.0",
    this.navigateWhenMobileNavItemIsClicked(ENV.signUp.endpoint.url(),"page"),
    !this.accountService.currentProfile.isPopulated
  )
  profileNavItem = this.baseService.generateMobileNavLinkItem(
    "nav.navItemsOne.2",
    this.navigateWhenMobileNavItemIsClicked(ENV.nav.urls.register),
    this.accountService.currentProfile.isPopulated
  )
  signOutNavItem = this.baseService.generateMobileNavLinkItem(
    "nav.navItemsOne.3",
    this.navService.logOut,
    this.accountService.currentProfile.isPopulated
  )
  playSiteAudioMobileBtnItem =(()=>{
    let btnItem = this.baseService.generateMobileNavBtnItem(new GenerateMobileNavBtnItemParams({
      i18nKey:"nav.topLeft.playSiteAudio",
      btnClass:"AppMobileNavButton0"
    }))

    btnItem.meta.btn.click = this.navService.toggleMainAudio(btnItem.meta.btn)
    return btnItem
  })()
  addToSpotfiyMobileBtnItem = this.baseService.generateMobileNavBtnItem(new GenerateMobileNavBtnItemParams({
    i18nKey:"nav.topLeft.addSpotifyButton",
    btnClass:"AppMobileNavButton1",
    btnIconIsPresent:true,
    btnClick:this.navService.clickSpotifyBtn,
    btnIconSrc:"assets/media/nav/0.svg",
    btnIconAlt:"nav.topLeft.spotifyButton.add",
  }))

  mobileNavParams = new MobileNavParams({
    closeMobileAriaLabel:"nav.mobileNav.close.ariaLabel",
    closeMobileNav:()=> {
      this.baseService.toggleMobileNavSubj.next(false)
    },
    closeMobileIconSrc:"assets/media/mobile_nav/0.svg",
    navItems:[
      this.headerMobileNavItem,
      this.teamMobileNavItem,
      this.eventsMobileNavItem,
      this.mallMobileNavItem,
      this.playSiteAudioMobileBtnItem,
      this.addToSpotfiyMobileBtnItem,
      this.signInNavItem,
      this.profileNavItem,
      this.signOutNavItem,
    ]
  })

  openSiteUnderConstructionBanner = ()=>{

    let webStorage =sessionStorage.getItem(ENV.classPrefix.app)
    webStorage = JSON.parse(webStorage)
    Object.assign(this.webStorage, webStorage)
    if(!this.webStorage.siteUnderConstructionBannerWasOpened){
      this.webStorage.siteUnderConstructionBannerWasOpened = true
      sessionStorage.setItem(ENV.classPrefix.app, JSON.stringify(this.webStorage))

      let note =this.baseService.generateWMLNote("app.siteUnderConstruction",WmlNotifyBarType.Info,true)
      this.wmlNotifyService.create(note)
      this.cdref.detectChanges()

    }

  }


  listenForChangesOutSideChangeDetection = ()=>{
    return merge(
      this.baseService.togglePopupSubj,
      this.baseService.toggleOverlayLoadingSubj
    )
    .pipe(
      takeUntil(this.ngUnsub),
      tap(()=>{
        this.cdref.detectChanges()
      })
    )

  }

  ngOnInit() {
    this.doMiscConfigs()
    this.accountService.retireveUserAccountInfoFromLocalStorage()

  }

  ngAfterViewInit (){
    this.openSiteUnderConstructionBanner()
  }

  doMiscConfigs() {
    if (env.production) {
      this.vcf.element.nativeElement.removeAttribute("ng-version");
    }

    this.baseService.appCdRef = this.cdref
    ENV.nav.urls.initialURL = window.location.pathname
    console.log("Fire")
    this.http.get(ENV.app.backendHealthCheck())
    .pipe(
      takeUntil(this.ngUnsub),
      tap(()=>{
        console.log("result")
      })
    )
    .subscribe()
  }

  ngOnDestroy() {
    this.blockchainService.wagmi.coinbase.client?.disconnect()
    this.blockchainService.wagmi.metamask.client?.disconnect()
    this.ngUnsub.next()
    this.ngUnsub.complete()
  }

}
