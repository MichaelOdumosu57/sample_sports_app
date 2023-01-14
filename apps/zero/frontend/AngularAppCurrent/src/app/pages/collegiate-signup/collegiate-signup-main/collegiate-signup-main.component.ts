// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@env/environment';
import { WMLButton, WMLImage } from '@windmillcode/wml-components-base';
import {  FormArray } from '@angular/forms';
import { WMLForm } from '@windmillcode/wml-form';
import { WMLOptionsButton, WMLOptionsParams } from '@windmillcode/wml-options';

import i18nObj from "src/assets/i18n/en.json"
import { WMLField } from '@windmillcode/wml-field';
import { WMLFileUploadParams } from '@windmillcode/wml-file-manager';
import { WMLChipsParams } from '@windmillcode/wml-chips';
import { WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { AutomateService } from '@helpers/automation/automation/automation.service';
import { CollegiateService } from '@shared/services/collegiate/collegiate.service';
import { FormsService } from '@shared/services/forms/forms.service';


@Component({

  selector: 'collegiate-signup-main',
  templateUrl: './collegiate-signup-main.component.html',
  styleUrls: ['./collegiate-signup-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CollegiateSignupMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public wmlNotifyService:WmlNotifyService,
    public automateService:AutomateService,
    public collegiateService:CollegiateService,
    public formsService:FormsService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('CollegiateSignupMain')


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  backdropImg = new WMLImage({
    src:"assets/media/collegiate_signup_main/stadium_background.jpg",
    alt:"collegiateSignupMain.backdropImgAlt"
  })




  optionFields = [
    ["customerStatusFieldFormControlName" ,2],
    ["fundingAmntFieldFormControlName" ,8],
    ["preferredContactFieldFormControlName",9],
  ]
  .map((entry)=>{
    let [formControlName,formIndex] = entry
    let  name = ENV.collegiateSignupMain[formControlName]
    let options = new WMLOptionsParams({
      limit:1,
      options:i18nObj.collegiateSignupMain.fields[name].options
      .map((value,index0)=>{
        return new WMLOptionsButton({
          text:"collegiateSignupMain.fields."+name+".options."+index0,
          value
        })
      }),
      formArray:this.formsService.collegiateSignupMainFormGroup.controls[ENV.collegiateSignupMain[formControlName]] as  FormArray,
      updateFormArrayPredicate:(option)=>option.value
    })
    let field = this.baseService.generateOptionsFormField(
      "collegiateSignupMain.fields."+ENV.collegiateSignupMain[formControlName]+".label",
      ENV.collegiateSignupMain[formControlName],
      this.formsService.collegiateSignupMainFormGroup,
      null,
      // {
        // required:"collegiateSignupMain.fields."+ ENV.collegiateSignupMain[formControlName]+".errorRequired"
      // },
      "standalone",
      options
    )
    return [field,formIndex]
  })

  textAreaFields = [
    ["startupStageFieldFormControlName",6]
  ]
  .map((entry)=>{
    let [formControlName,formIndex] = entry
    let field = this.baseService.generateTextAreaFormField(
      "collegiateSignupMain.fields."+ENV.collegiateSignupMain[formControlName]+".label",
      ENV.collegiateSignupMain[formControlName],
      this.formsService.collegiateSignupMainFormGroup,
      {
        // required:"collegiateSignupMain.fields."+ ENV.collegiateSignupMain[formControlName]+".errorRequired"
      },
      "standalone"
    )
    return [field,formIndex]
  })

  chipFields = [
    ["socialMediaHandlesFieldFormControlName",5],

  ]
  .map((entry)=>{
    let [formControlName,formIndex] = entry
    let field = this.baseService.generateChipsFormField(
      "collegiateSignupMain.fields."+ENV.collegiateSignupMain[formControlName]+".label",
      ENV.collegiateSignupMain[formControlName],
      this.formsService.collegiateSignupMainFormGroup,
      null,
      // {
        // required:"collegiateSignupMain.fields."+ ENV.collegiateSignupMain[formControlName]+".errorRequired"
      // },
      "standalone",
      new WMLChipsParams({
        formArray:this.formsService.collegiateSignupMainFormGroup.controls[ENV.collegiateSignupMain[formControlName]] as FormArray,
        suggestions: i18nObj.collegiateSignupMain.fields.socialMediaHandles.suggestions
        .map((entry,index0)=>{
          return "collegiateSignupMain.fields.socialMediaHandles.suggestions."+index0
        })
      })
    )
    return [field,formIndex]
  })

  inputFields = [
    ["emailFieldFormControlName",-2],
    ["linkedinFieldFormControlName",-1],
    ["phoneFieldFormControlName",0],
    ["profileNameFieldFormControlName",1],
    ["atheleticPlayersFieldFormControlName",4],
    ["teamNameFieldFormControlName",3],
    ["employeeCountFieldFormControlName",7],
  ]
  .map((entry)=>{
    let [formControlName,formIndex] = entry
    let field = this.baseService.generateInputFormField(
      "collegiateSignupMain.fields."+ENV.collegiateSignupMain[formControlName]+".label",
      ENV.collegiateSignupMain[formControlName],
      this.formsService.collegiateSignupMainFormGroup,
      // {
      //   // required:"collegiateSignupMain.fields."+ ENV.collegiateSignupMain[formControlName]+".errorRequired"
      // },
      null,
      "standalone"
    )
    return [field,formIndex]
  })

  fileUploadFields = [

    ["teamLogoFieldFormControlName",10],
    ["pitchDeckFieldFormControlName",11],
  ]
  .map((entry)=>{
    let [formControlName,formIndex] = entry
    let field = this.baseService.generateFileUploadFormField(
      "collegiateSignupMain.fields."+ENV.collegiateSignupMain[formControlName]+".label",
      ENV.collegiateSignupMain[formControlName],
      this.formsService.collegiateSignupMainFormGroup,
      null,
      "standalone",
      new WMLFileUploadParams({
        formArray:this.formsService.collegiateSignupMainFormGroup.get(ENV.collegiateSignupMain[formControlName]) as FormArray
      })
    )
    return [field,formIndex]
  })

  fields:Array<WMLField>


  wmlForm:WMLForm

  initForm = ()=>{
    (this.fields as any) = [
        ...this.optionFields,
        ...this.inputFields,
        ...this.textAreaFields,
        ...this.fileUploadFields,
      ...this.chipFields
    ]
    .sort((a:any,b:any)=> {
      return a[1] - b[1]
    })
    .map((entry)=>{
      return entry[0]
    })

    this.fields.slice(0,3)
    .forEach((field)=>{
      field.deleteLabelPart()
    })

    this.wmlForm = new WMLForm({
      fields: this.fields,
      fieldSections: [3,2,2,2,1,2,2]
    })
  }

  submitBtnClick = ()=>{
    if(!this.formsService.collegiateSignupMainFormGroup.valid ){
      this.baseService.tellUserToFillOutRequiredFields(this.formsService.collegiateSignupMainFormGroup,this.cdref)
      return
    }

    this.baseService.toggleOverlayLoadingSubj.next(true);

    this.collegiateService.submitForm(this.formsService.collegiateSignupMainFormGroup.value)
    .pipe(
      takeUntil(this.ngUnsub),
      tap({
        next: ()=>{
          let note =this.baseService.generateWMLNote("collegiateSignupMain.wmlNotify.submitFormSuccess",WmlNotifyBarType.Success)
          this.wmlNotifyService.create(note )
        },
        error:()=>{
          let note =this.baseService.generateWMLNote("collegiateSignupMain.wmlNotify.submitFormFail",WmlNotifyBarType.Error)
          this.wmlNotifyService.create(note )
        },
      }),
      this.baseService.closeOverlayLoading

    )
    .subscribe()

  }
  submitBtn = new WMLButton({
    text:"collegiateSignupMain.submit",
    click:this.submitBtnClick
  })

  ngOnInit(): void {
    this.initForm()
  }

  ngAfterViewInit(): void {
    // this.automateService.collegiateSignupMain.fillOutForm()
  }
  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
