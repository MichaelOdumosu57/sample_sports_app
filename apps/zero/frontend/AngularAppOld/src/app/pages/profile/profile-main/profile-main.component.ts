// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { finalize, takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@app/core/config/configs';
import { WMLButton, WMLImage, WMLUIProperty } from '@windmillcode/wml-components-base';
import { ActivatedRoute, Router } from '@angular/router';

// i18n
import i18nObj from "src/assets/i18n/en.json";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WMLForm } from '@windmillcode/wml-form';
import { AccountService } from '@shared/services/account/account.service';
import { WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { notEmpty } from '@rxweb/reactive-form-validators';
import { NavService } from '@shared/services/nav/nav.service';

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
    public navService:NavService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('ProfileMain')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  avatarImg = new WMLImage({
    src:"assets/media/profile_main/avatar_img.png",
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


  basicDemographicsFormGroup = new FormGroup({
    [ENV.profileMain.firstNameFieldFormControlName]:new FormControl(null,[Validators.required]),
    [ENV.profileMain.lastNameFieldFormControlName]:new FormControl(null,[Validators.required]),
    [ENV.profileMain.addressFieldFormControlName]:new FormControl(null,[Validators.required]),
    [ENV.profileMain.cityFieldFormControlName]:new FormControl(null,[Validators.required]),
    [ENV.profileMain.stateFieldFormControlName]:new FormControl(null,[Validators.required]),
    [ENV.profileMain.zipcodeFieldFormControlName]:new FormControl(null,[Validators.required]),
    [ENV.profileMain.countryFieldFormControlName]:new FormControl(null,[Validators.required]),
  })
  basicDemographicsFormFields= [
    "firstNameFieldFormControlName",
    "lastNameFieldFormControlName",
    "addressFieldFormControlName",
    "cityFieldFormControlName",
    "stateFieldFormControlName",
    "zipcodeFieldFormControlName",
    "countryFieldFormControlName",
  ]
  .map((formControlName,index0)=>{
    let field =  ENV.profileMain[formControlName]
    let fieldToGenerate = this.baseService.generateInputFormField
    let wmlField = fieldToGenerate(
      "profileMain.basicDemographic.fields."+field+".label",
      ENV.profileMain[formControlName],
      this.basicDemographicsFormGroup,
      null,
      "standalone"
    )
    wmlField.deleteLabelPart([0,0])
    return wmlField
  })
  basicDemographicsWmlForm = new WMLForm({
    fields: this.basicDemographicsFormFields,
    fieldSections: [2,1,2,2]
  })
  updateDemographics =()=>{
    this.baseService.openOverlayLoading()
    return this.accountService.updateProfile(this.basicDemographicsFormGroup.value)
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

    let firstName= this.utilService.getQueryParamByName("firstName")
    if(!firstName){
      let {firstName} = this.accountService.currentProfile
      if(!firstName){
        this.router.navigate([ENV.nav.urls.home]);
      }
    }
  }
  pullUserAccountInfo =()=>{

    return this.accountService.retrieveUserAccountInfoFromQueryParams()
    .pipe(
      takeUntil(this.ngUnsub),
      tap(()=>{
        if(this.profileInfo.firstName === ""){
          this.router.navigateByUrl(ENV.nav.urls.home)
        }
        this.basicDemographicsFormGroup.patchValue({
          [ENV.profileMain.firstNameFieldFormControlName]:this.profileInfo.firstName,
          [ENV.profileMain.lastNameFieldFormControlName]:this.profileInfo.lastName,
          [ENV.profileMain.countryFieldFormControlName]:this.profileInfo.country
        })
      })
    )
  }

  ngOnInit(): void {
    this.checkForProfileInfo()
    this.pullUserAccountInfo().subscribe()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


class ProfileMainProfileOptions {
  constructor(params:Partial<ProfileMainProfileOptions>={}){
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
