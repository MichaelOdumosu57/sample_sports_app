// angular
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { Subject, takeUntil, tap } from 'rxjs';

// misc
import { ENV } from '@app/core/config/configs';
import { NavService } from '@shared/services/nav/nav.service';

// wml-components
import { WMLButton, WMLImage, WMLRoute } from '@windmillcode/wml-components-base';
import { AccountService } from '@shared/services/account/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent   {

  constructor(
    private cdref:ChangeDetectorRef,
    private utilService:UtilityService,
    private configService:ConfigService,
    public baseService:BaseService,
    private navService:NavService,
    public accountService:AccountService,
    public router:Router
  ) { }
  classPrefix = this.utilService.generateClassPrefix('Nav')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()



  mainAudioButton = (()=>{
    let btn = new WMLButton({
      value:"nav.topLeft.playSiteAudio",
    })
    btn.click = this.navService.toggleMainAudio(btn)
    return btn
  })()

  spotifyButton = new WMLButton({
    value:"nav.topLeft.addSpotifyButton",
    buttonClass:this.classPrefix("Pod0Button1"),
    iconIsPresent:true,
    iconSrc:"assets/media/nav/0.svg",
    iconAlt:"nav.topLeft.spotifyButton.add",
    click:this.navService.clickSpotifyBtn
  })

  firstRowButtons:Array<WMLButton> = [
    this.mainAudioButton,
    this.spotifyButton
  ]

  mobileNavMenuIcon = new WMLImage({
    src:"assets/media/nav/1.svg",
    alt:"nav.mobileNav.iconAlt",
    ariaLabel:"nav.mobileNav.iconAlt",
    click:()=>{
      this.baseService.toggleMobileNavSubj.next(true)
      this.mobileNavMenuIcon.ariaExpanded = true
    }
  })


  mainNavItems = ["team","events","mall"]
  .map((route,index0)=>{
    return new NavWMLRoute({
      value:"nav.mainNav."+[index0],
      route:ENV.nav.urls[route]
    })
  })

  signInRoute =  new NavWMLRoute({
    isPresent:!this.accountService.currentProfile.isPopulated,
    value:"nav.navItemsOne.0",
    route:ENV.signUp.endpoint.url(),
  })
  profileRoute =  new NavWMLRoute({
    isPresent:this.accountService.currentProfile.isPopulated,
    value:"nav.navItemsOne.2",
    route:ENV.nav.urls.profile,
  })
  signOutRoute =  new NavWMLRoute({
    isPresent:this.accountService.currentProfile.isPopulated,
    value:"nav.navItemsOne.3",
    click:this.navService.signOut,
    type:"action"
  })

  navItemsOne = [this.signInRoute,this.profileRoute,this.signOutRoute]



  ngOnInit(){
    this.navService.listerForLoginChanges(
      this.navItemsOne,
      this.ngUnsub,
      this.cdref
    )
    .subscribe()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


class NavWMLRoute extends WMLRoute {
  constructor(params:Partial<NavWMLRoute>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  override type ="link"
}


