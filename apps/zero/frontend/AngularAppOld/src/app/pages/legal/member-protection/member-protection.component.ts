// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { SharedModule } from '@shared/shared.module';

// i18n
import i18nObj from "src/assets/i18n/en.json";


@Component({
  standalone:true,
  imports:[
    SharedModule
  ],
  selector: 'member-protection',
  templateUrl: './member-protection.component.html',
  styleUrls: ['./member-protection.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class MemberProtectionComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('MemberProtection')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  sections = i18nObj.memberProtection.sections
  .map((sectionText,index0)=>{
    return new MembershipProtectionSection({
      text:sectionText,
      // @ts-ignore
      type:[
        "section","text","list"

      ][index0]?? "text"
    })
  })

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


class MembershipProtectionSection {
  constructor(params:Partial<MembershipProtectionSection>={}){
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
