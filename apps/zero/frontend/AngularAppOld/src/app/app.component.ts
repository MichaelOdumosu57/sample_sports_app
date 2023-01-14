// angular
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { Subject, takeUntil, tap } from 'rxjs';

// services
import { NavService } from '@shared/services/nav/nav.service';
import { BaseService } from '@core/base/base.service';

// misc
import { environment as env } from "@environment/environment";
import { ENV } from '@core/config/configs';
import { GenerateMobileNavBtnItemParams, UtilityService } from '@core/utility/utility.service';
import { SpotifyPlaylistsParams } from '@shared/components/spotify-playlists/spotify-playlists.component';
import { MobileNavParams } from '../../projects/mobile-nav/src/public-api';
import { MobileNavItemParams } from '../../projects/mobile-nav/src/lib/mobile-nav-item/mobile-nav-item.component';
import { MobileNavItemPodComponent, MobileNavItemPodParams } from '@shared/components/mobile-nav-item-pod/mobile-nav-item-pod.component';

// wml-components
import { WMLImage } from '@windmillcode/wml-components-base';
import { HttpClient } from '@angular/common/http';
import { WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { AccountService } from '@shared/services/account/account.service';



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
    public accountService:AccountService
  ) { }

  classPrefix = this.utilService.generateClassPrefix(ENV.classPrefix.app)
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub = new Subject<void>()
  webStorage = {
    siteUnderConstructionBannerWasOpened:false
  }

  spotifyPlaylistsParams = new SpotifyPlaylistsParams()
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
  teamMobileNavItem = this.utilService.generateMobileNavLinkItem(
    "nav.mainNav.0",
    this.navigateWhenMobileNavItemIsClicked(ENV.nav.urls.team)
    )
  eventsMobileNavItem = this.utilService.generateMobileNavLinkItem(
    "nav.mainNav.1",
    this.navigateWhenMobileNavItemIsClicked(ENV.nav.urls.events)
    )

  mallMobileNavItem = this.utilService.generateMobileNavLinkItem(
    "nav.mainNav.2",
    this.navigateWhenMobileNavItemIsClicked(ENV.nav.urls.mall,"page")
    )
  signInNavItem = this.utilService.generateMobileNavLinkItem(
    "nav.navItemsOne.0",
    this.navigateWhenMobileNavItemIsClicked(ENV.signUp.endpoint.url(),"page"),
    !this.accountService.currentProfile.isPopulated
  )
  profileNavItem = this.utilService.generateMobileNavLinkItem(
    "nav.navItemsOne.2",
    this.navigateWhenMobileNavItemIsClicked(ENV.nav.urls.register),
    this.accountService.currentProfile.isPopulated
  )
  signOutNavItem = this.utilService.generateMobileNavLinkItem(
    "nav.navItemsOne.3",
    this.navService.signOut,
    this.accountService.currentProfile.isPopulated
  )
  playSiteAudioMobileBtnItem =(()=>{
    let btnItem = this.utilService.generateMobileNavBtnItem(new GenerateMobileNavBtnItemParams({
      i18nKey:"nav.topLeft.playSiteAudio",
      btnClass:"AppMobileNavButton0"
    }))

    btnItem.meta.btn.click = this.navService.toggleMainAudio(btnItem.meta.btn)
    return btnItem
  })()
  addToSpotfiyMobileBtnItem = this.utilService.generateMobileNavBtnItem(new GenerateMobileNavBtnItemParams({
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


  listenForLoginChanges =()=>{

  }

  ngOnInit() {
    this.doMiscConfigs()
    this.accountService.retireveUserAccountInfoFromLocalStorage()
    this.navService.listerForLoginChanges(
      [this.signInNavItem,this.profileNavItem,this.signOutNavItem],
      this.ngUnsub,
      this.cdref
    )
    .subscribe()
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
    this.http.get(ENV.app.backendHealthCheck()).subscribe()
  }

  ngOnDestroy() {
    this.ngUnsub.next()
    this.ngUnsub.complete()
  }

}
