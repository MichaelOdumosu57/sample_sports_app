// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { of, Subject } from 'rxjs';
import { concatMap, takeUntil,tap } from 'rxjs/operators';

// misc

import { WMLButton, WMLImage, WMLUIProperty } from '@windmillcode/wml-components-base';
import { ActivatedRoute, Router } from '@angular/router';

// i18n
import i18nObj from "src/assets/i18n/en.json";
import { WMLForm } from '@windmillcode/wml-form';
import { AccountService } from '@shared/services/account/account.service';
import { WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { NavService } from '@shared/services/nav/nav.service';
import { ENV } from '@env/environment';
import { FormsService } from '@shared/services/forms/forms.service';

@Component({
  selector: 'profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class ProfileMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public route:ActivatedRoute,
    public router:Router,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public accountService:AccountService,
    public wmlNotifyService:WmlNotifyService,
    public navService:NavService,
    public formsService:FormsService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('ProfileMain')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  avatarImg = new WMLImage({
    src:"assets/media/shared/avatar_img.png",
    alt:"profileMain.avatarImgAlt"
  })
  profileInfo= this.accountService.currentProfile
  profileOptions = i18nObj.profileMain.profileOptions
  .map((entry,index0)=>{

    return new ProfileMainProfileOptions({
      title:`profileMain.profileOptions.${index0}.title`,
      subTitle:"profileMain.profileOptions."+index0+".subTitle"
    })

  })



  basicDemographicsFormFields= [
    "firstNameFieldFormControlName",
    "lastNameFieldFormControlName",
    // "addressFieldFormControlName",
    // "cityFieldFormControlName",
    // "stateFieldFormControlName",
    // "zipcodeFieldFormControlName",
    "countryFieldFormControlName",
  ]
  .map((formControlName,index0)=>{
    let field =  ENV.profileMain[formControlName]
    let fieldToGenerate = this.baseService.generateInputFormField
    let wmlField = fieldToGenerate(
      "profileMain.basicDemographic.fields."+field+".label",
      ENV.profileMain[formControlName],
      this.formsService.profileMainFormGroup,
      null,
      "standalone"
    )
    wmlField.deleteLabelPart([0,0])
    return wmlField
  })
  basicDemographicsWmlForm = new WMLForm({
    fields: this.basicDemographicsFormFields,
    fieldSections: [2,1]
  })
  updateDemographics =()=>{
    this.baseService.openOverlayLoading()
    return this.accountService.updateProfile(this.formsService.profileMainFormGroup.value)
    .pipe(
      takeUntil(this.ngUnsub),
      tap({
        next: ()=>{

          let note =this.baseService.generateWMLNote("profileMain.wmlNotify.updateProfileSuccess",WmlNotifyBarType.Success)
          this.wmlNotifyService.create(note )
        },
        error:()=>{
          let note =this.baseService.generateWMLNote("profileMain.wmlNotify.updateProfileFail",WmlNotifyBarType.Error)
          this.wmlNotifyService.create(note )
        },
      }),
      this.baseService.closeOverlayLoading
    )

  }
  basicDemographicsUpdateBtn = new WMLButton({
    value:"profileMain.basicDemographic.updateBtn",
    click:()=>{
      this.updateDemographics().subscribe()
    }
  })


  checkForProfileInfo=()=>{

    this.pullUserAccountInfo().subscribe()
    return

  }

  
  checkForProfileInfoOld = ()=>{
    let accessToken= this.utilService.getQueryParamByName("access_token") ?? this.accountService.currentProfile.accessToken

    if(!accessToken){
      this.navService.logOut()
    }
    else{
      this.pullUserAccountInfo().subscribe()
    }
  }
  pullUserAccountInfo =()=>{

    return this.accountService.retrieveUserAccountInfoFromQueryParams()
    .pipe(
      takeUntil(this.ngUnsub),
      concatMap(()=>{

        if(this.profileInfo.firstName === ""){
          this.accountService.retireveUserAccountInfoFromLocalStorage()
          if(this.profileInfo.firstName === ""){
            return this.accountService.getNewAzureAccessToken()
            this.router.navigateByUrl(ENV.nav.urls.home)
          }
          return of([])
        }
        else{
          return of([])
        }

      }),
      tap(()=>{
        this.formsService.profileMainFormGroup.patchValue({
          [ENV.profileMain.firstNameFieldFormControlName]:this.profileInfo.firstName,
          [ENV.profileMain.lastNameFieldFormControlName]:this.profileInfo.lastName,
          [ENV.profileMain.countryFieldFormControlName]:this.profileInfo.country
        })
        this.removeAllQueryParams()
      })
    )
  }

  removeAllQueryParams() {

    let urlTree = this.router.createUrlTree([], {
      queryParams: {
        user_id: null,
        user_name: null,
        first_name: null,
        last_name: null,
        country: null,
        access_token: null
       },
      queryParamsHandling: "merge",
      preserveFragment: true });

    this.router.navigateByUrl(urlTree);
  }

  ngAfterViewInit(): void {
    this.checkForProfileInfo()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


class ProfileMainProfileOptions extends WMLUIProperty {
  constructor(params:Partial<ProfileMainProfileOptions>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  title:string
  subTitle:string
}
