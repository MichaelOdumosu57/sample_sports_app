// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Renderer2 } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc
import { AutomateService } from '@helpers/automation/automation/automation.service';


@Component({

  selector: 'default-nav-share',
  templateUrl: './default-nav-share.component.html',
  styleUrls: ['./default-nav-share.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class DefaultNavShareComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public renderer2:Renderer2,
    public automateService:AutomateService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('DefaultNavShare')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  s:HTMLScriptElement
  loadNeededScript =()=>{
    this.s= this.renderer2.createElement("script")
    this.s.src= "https://platform-api.sharethis.com/js/sharethis.js#property=636af1b6f2ceb00013984275&product=inline-share-buttons&source=platform"
    this.s.type = "text/javascript"
    this.s.className = this.classPrefix('MainPodScript0')
    this.renderer2.appendChild(
      this.automateService.documentQuerySelector("body"),
      this.s
    )
  }

  ngOnInit(): void {

    this.loadNeededScript()
  }

  ngOnDestroy(){

    window.__sharethis__ = window.st = undefined
     let shareThisScripts =  this.automateService.documentQuerySelectorAll("."+this.s.className)
     shareThisScripts
    .forEach((element)=>{
      this.renderer2.removeChild(
        this.automateService.documentQuerySelector("body"),
        element
      )

    })

    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
