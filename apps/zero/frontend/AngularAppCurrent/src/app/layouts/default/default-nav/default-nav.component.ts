// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';


// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';
import { NavService } from '@shared/services/nav/nav.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// misc
import { WMLButton } from '@windmillcode/wml-components-base';
import { DefaultNavShareComponent } from '../default-nav-share/default-nav-share.component';
import { AutomateService } from '@helpers/automation/automation/automation.service';
import { WMLDropdownIteratorParams, WMLDropdownParams, WmlDropdownSampleParams } from '@windmillcode/wml-dropdown';

// i18n
import i18nObj from "src/assets/i18n/en.json";
import { TranslateService } from '@ngx-translate/core';
import { DefaultService } from '../default-service/default-service.service';


@Component({
  selector: 'default-nav',
  templateUrl: './default-nav.component.html',
  styleUrls: ['./default-nav.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DefaultNavComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public automateService:AutomateService,
    public translateService:TranslateService,
    public router:Router,
    public navService:NavService,
    public defaultService:DefaultService,
  ) { }


  classPrefix = this.utilService.generateClassPrefix('DefaultNav')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  openShareDialog =(event)=>{

    this.baseService.popupParams.cpnt = DefaultNavShareComponent
    this.baseService.togglePopupSubj.next(true)
  }
  shareBtn=  new DefaultNavBtn({
    type:"btn",
    text:"defaultNav.share",
    class:"DefaultNavPod1Btn1",
    click:this.openShareDialog
  })
  locationCircle =  new DefaultNavBtn()
  openLangMenu = ()=>{
    this.changeLangBtn.dropdown.isPresent = !this.changeLangBtn.dropdown.isPresent
    this.cdref.detectChanges()
  }
  changeLangBtn =(()=>{
    let dropdown =new WMLDropdownParams({
      isPresent: false,
    })
    dropdown.options = i18nObj.defaultNav.lang.options
    .map((nullVal,index0)=>{
      let params = new WmlDropdownSampleParams({
        text:"defaultNav.lang.options."+index0,
        value:["ar","de","en","es","ja","uk","zh","fr","hi"][index0],
      })
      params.click = ()=>{
        this.translateService.use(params.value)
        dropdown.isPresent= false
        this.cdref.detectChanges()
      }
      return new WMLDropdownIteratorParams({
        params
      })
    })


    return new DefaultNavBtn({
      type:"btn",
      text:"defaultNav.lang.label",
      class:"DefaultNavPod1Btn1",
      dropdown,
      click:this.openLangMenu
    })
  })()
  helpCircle = new DefaultNavBtn()




  logoutBtn = new DefaultNavBtn({
    isPresent:false,
    type:"btn",
    text: "defaultNav.logout",
    class:"DefaultNavPod1Btn0",
    click:this.navService.logOut
  })


  navCircles = [
    this.shareBtn,
    new DefaultNavBtn({type:"divider"}),
    this.locationCircle,
    this.changeLangBtn,
    this.helpCircle,
    new DefaultNavBtn({type:"divider"}),
    this.defaultService.signUpBtn,
    this.defaultService.loginBtn,
    this.defaultService.profileBtn,
    this.logoutBtn
  ]

  listenForLoginChanges =()=>{
    let target = [
      this.defaultService.signUpBtn,
      this.defaultService.loginBtn,
      this.defaultService.profileBtn,
      this.logoutBtn,
    ]
    .map((btn,index0)=>{
      return{
        target:btn,
        isPresentOnLogin:[true,true,false,false][index0]
      }
    })

    return this.navService.listerForLoginChanges(
      target,
      this.ngUnsub,
      this.cdref
    )
    .pipe(
      takeUntil(this.ngUnsub),
    )


  }

  ngOnInit(): void {
    this.listenForLoginChanges().subscribe()
  }

  ngAfterViewInit(): void {
    // this.automateService.defaultNav.openShareTray()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

class DefaultNavBtn extends WMLButton {
  constructor(params:Partial<DefaultNavBtn>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  override type: "circle" |"divider" |"btn" = "circle";

  dropdown = new WMLDropdownParams({isPresent: false})
}
