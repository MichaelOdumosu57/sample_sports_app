// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc
import { SharedModule } from '@shared/shared.module';

// i18n
import i18nObj from "src/assets/i18n/en.json";

@Component({
  standalone:true,
  imports:[
    SharedModule
  ],
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class PrivacyPolicyComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('PrivacyPolicy')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  sections = i18nObj.privacyPolicy.sections
  .map((sectionText,index0)=>{
    return new PrivacyPolicySection({
      text:sectionText,
      // @ts-ignore
      type:[
        "text",
        "section","text","list","text","text","list","text",
        "section","text","text",
        "section","text","text","text",
        "section","text","list","text",
        "section","text","list","text","list",
        "section","text","text",
        "section","text",
        "section","text","text",
        "section","text",
        "section","text",
        "section","text","text","text","text",
      ][index0]?? "text"
    })
  })



  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

class PrivacyPolicySection {
  constructor(params:Partial<PrivacyPolicySection>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  type:"text"|"section"|"list" = "text"
  text:string|string[]
}
