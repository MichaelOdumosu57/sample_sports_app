// angular
import { ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { filter, takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@env/environment';
import { WMLImage, WMLButton } from '@windmillcode/wml-components-base';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DefaultService } from '../default-service/default-service.service';
import { updateClassString } from '@core/utility/common-utils';
import { AccountService } from '@shared/services/account/account.service';


@Component({

  selector: 'default-aside',
  templateUrl: './default-aside.component.html',
  styleUrls: ['./default-aside.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush

})
export class DefaultAsideComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public router:Router,
    public route:ActivatedRoute,
    public defaultService:DefaultService,
    public accountService:AccountService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('DefaultAside')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  avatarImg = new WMLImage({
    src:"assets/media/shared/avatar_img.png",
    alt:"global.avatarImgAlt"
  })



  logoImg = new WMLImage({
    src:"assets/media/shared/logo_0.png",
    alt:"defaultAside.logoImgAlt",
    click:()=>{
      this.router.navigateByUrl(ENV.nav.urls.home)
    }
  })

  homeRoute = (()=>{
    let btn = new DefaultAsideWMLButton({
      text:"defaultAside.routes.home",
      route:ENV.nav.urls.home,
    })
    btn.updateIconClassString("fa-home")
    return btn
  })()
  shoppingMallRoute = (()=>{
    let btn =new DefaultAsideWMLButton({
      text:"defaultAside.routes.mall",
      url:ENV.nav.urls.mall,
    })
    btn.updateIconClassString("fa-bag-shopping")
    return btn
  })()
  eventsRoute = (()=>{
    let btn = new DefaultAsideWMLButton({
      text:"defaultAside.routes.events",
      route:ENV.nav.urls.events,
    })
    btn.updateIconClassString("fa-wifi")
    return btn
  })()
  collegiateSignUpRoute = (()=>{
    let btn = new DefaultAsideWMLButton({
      text:"defaultAside.routes.signUp",
      route:ENV.nav.urls.collegiateSignUp
    })
    btn.updateIconClassString("fa-user-plus")
    return btn
  })()

  footballRoute = (()=>{
    let btn = new DefaultAsideWMLButton({
      text:"defaultAside.routes.football",
      route:ENV.nav.urls.football,
    })
    btn.updateIconClassString("fa-football")
    return btn
  })()

  teamHandballRoute = (()=>{
    let btn = new DefaultAsideWMLButton({
      text:"defaultAside.routes.teamHandball",

    })
    btn.updateIconClassString("fa-volleyball")
    return btn
  })()
  rubgyRoute = (()=>{
    let btn = new DefaultAsideWMLButton({
      text:"defaultAside.routes.rubgy",
    })
    btn.updateIconClassString("fa-football")
    return btn
  })()

  niblsballRoute = (()=>{
    let btn = new DefaultAsideWMLButton({
      text:"defaultAside.routes.niblsball",
      route:ENV.nav.urls.niblsball,
    })
    btn.updateIconClassString("fa-medal")
    return btn
  })()


  routes = [
    this.homeRoute,
    this.shoppingMallRoute,
    this.eventsRoute,
    this.collegiateSignUpRoute,
  ]

  sportRoutes = [
    this.niblsballRoute,
    this.teamHandballRoute,
    this.footballRoute,
    this.rubgyRoute
  ]

  updateRoutes = ()=>{
    [...this.routes,...this.sportRoutes]
    .forEach((route)=>{
      route.click = ()=>{
        if(route.route){
          this.router.navigate([route.route])
        }
        else if(route.url){
          window.location.href = route.url
        }
      }
    })
  }

  ngOnInit(): void {
    this.updateRoutes()
    this.keepCurrentRouteHighlighted().subscribe()
    this.highlightCurrentRoute()
  }

  highlightCurrentRoute = (event?:NavigationEnd)=>{

    let pathParam = event?.url ?? window.location.pathname
    ;[...this.routes,...this.sportRoutes]
    .forEach(route => {
      if([route.route,route.url].includes(pathParam)){
        route.updateIconClassString(this.classPrefix("Pod1Icon0"))
      }
      else{
        route.updateIconClassString(this.classPrefix("Pod1Icon0"),"remove")
      }
    })
    this.cdref.detectChanges()

  }
  keepCurrentRouteHighlighted = ()=>{
    return this.router.events
    .pipe(
      takeUntil(this.ngUnsub),
      filter((event)=> event instanceof NavigationEnd),
      tap(this.highlightCurrentRoute)
    )


  }
  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


class DefaultAsideWMLButton extends WMLButton {
  constructor(params:Partial<DefaultAsideWMLButton>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  iconClasses = []
  updateIconClassString=updateClassString(this,"iconClass","iconClasses")
  readonly iconClass?:string
  route:string
  url:string
}
