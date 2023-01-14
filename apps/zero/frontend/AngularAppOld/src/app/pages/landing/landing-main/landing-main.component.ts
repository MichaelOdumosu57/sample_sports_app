// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { Subject, timer } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@app/core/config/configs';

import Marquee3k from 'marquee3000';
import { WMLImage } from '@windmillcode/wml-components-base';

@Component({
  selector: 'landing-main',
  templateUrl: './landing-main.component.html',
  styleUrls: ['./landing-main.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush

})
export class LandingMainComponent  {

  constructor(
    private cdref:ChangeDetectorRef,
    private utilService:UtilityService,
    private configService:ConfigService,
    private baseService:BaseService
  ) { }
  classPrefix = this.utilService.generateClassPrefix('LandingMain')  
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>() 

  marqueeImages:WMLImage[]=[
    "landing_main_0.jpg", 
    "landing_main_1.png", 
    "landing_main_2.jpg",  
    "landing_main_3.jpg",  
    "landing_main_4.jpg",  
    "landing_main_5.jpg",
  ].map((resource,index0)=>{
    return  new WMLImage({
      src:"assets/media/"+resource,
      alt:"landingMain.marqueeImagesAlt."+index0
    })
  })


  ngOnInit(): void {

  }

  ngAfterViewInit(){
    this.initMarquee();
  }

  initMarquee() {
    Marquee3k.init({
      selector: this.classPrefix('Pod0Item0')
    });
    this.utilService.eventDispatcher("resize", window);
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }  

}


