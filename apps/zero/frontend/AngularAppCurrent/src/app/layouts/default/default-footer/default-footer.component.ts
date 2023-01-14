// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc
import { ENV } from '@env/environment';

import { WMLRoute } from '@windmillcode/wml-components-base';
import i18nObj from "src/assets/i18n/en.json";


@Component({

  selector: 'default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class DefaultFooterComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('DefaultFooter')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }


  contactContent = new DefaultFooterContent({
    title :"defaultFooter.contact.title",
    links:(i18nObj.defaultFooter.contact.items)
    .map((entry,index0)=>{
      return new DefaultFooterListItem({
        type:["href","href","download","download"][index0],
        text:"defaultFooter.contact.items."+index0,
        download:[false,false,"NIBLS_Presentation.pdf","NIBLS_Whitepapers.pdf"][index0],
        href:[
          "https://www.linkedin.com/company/national-intelligent-blockchain-league-sport/",
          "https://brieflink.com/v/jpsq2",
          "assets/media/footer/presentation.pdf",
          "assets/media/footer/whitepapers.pdf"

        ][index0]
      })

    })
  })
  securityContent = new DefaultFooterContent({
    title :"defaultFooter.security.title",
    links:(i18nObj.defaultFooter.security.items)
    .map((entry,index0)=>{
      return new DefaultFooterListItem({
        type:["route","route","href"][index0],
        text:"defaultFooter.security.items."+index0,
        download:[false,false][index0],
        route:[
          ENV.nav.urls.privacyPolicy,
          ENV.nav.urls.membershipProtection
        ][index0],
        href:[,,"https://priorart.ip.com/IPCOM/000271355"][index0]
      })

    })
  })
  contents =[
    this.contactContent,
    this.securityContent,
  ]

  integrations

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


export class DefaultFooterListItem extends WMLRoute {
  constructor(params:Partial<DefaultFooterListItem>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  override type: "download" |"route" |"url" | string
  override text:string = "Update Me"
  href:string = "www.nibls.com"
  download:boolean | string = true
}
class DefaultFooterContent {
  constructor(params:Partial<DefaultFooterContent>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  title:string;
  links:DefaultFooterListItem[]
}
