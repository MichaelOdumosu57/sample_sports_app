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
import { ENV } from '@app/core/config/configs';
import { SharedModule } from '@shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WMLForm } from '@windmillcode/wml-form';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { WMLButton } from '@windmillcode/wml-components-base';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone:true,
  imports:[
    SharedModule,
    CommonModule
  ],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class SignUpComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('SignUp')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  rootFormGroup = new FormGroup({
    [ENV.signUp.field0.emailFieldFormControlName]: new FormControl(null,[Validators.required,Validators.email]),
    [ENV.signUp.field0.passwordFieldFormControlName]: new FormControl(null,[Validators.required]),
    [ENV.signUp.field0.confirmPasswordFieldFormControlName]: new FormControl(null,[Validators.required,RxwebValidators.compare({fieldName:ENV.signUp.field0.passwordFieldFormControlName })]),
  })

  emailField = this.baseService.generateInputFormField(
    "signUp.fields.0.label",
    ENV.signUp.field0.emailFieldFormControlName,
    this.rootFormGroup,
    null,"standalone"
  );

  passwordField = this.baseService.generateInputFormField(
    "signUp.fields.1.label",
    ENV.signUp.field0.passwordFieldFormControlName,
    this.rootFormGroup,
    null,"standalone"
  );

  confirmPasswordField = this.baseService.generateInputFormField(
    "signUp.fields.2.label",
    ENV.signUp.field0.confirmPasswordFieldFormControlName,
    this.rootFormGroup,
    {
      required:"global.errorRequired",
      compare:"signUp.fields.2.errorDoNotMatch"
    },"standalone"
  );


  fields = [this.emailField, this.passwordField,this.confirmPasswordField];
  signUpForm = new WMLForm({
    fields:this.fields,
  })
  clickSignUpBtn=()=>{}
  signUpBtn = new WMLButton({
    value:"signUp.btn",
    click:this.clickSignUpBtn
  })

  paypalBtn = new WMLButton({
    value:"signUp.paypalBtn.text",
    iconAlt:"signUp.paypalBtn.iconAlt",
    iconSrc:"assets/media/shared/paypal-icon.svg"
  })
  yahooSportsBtn = new WMLButton({
    value:"signUp.yahooSportsBtn.text",
    iconAlt:"signUp.yahooSportsBtn.iconAlt",
    iconSrc:"assets/media/shared/yahoo-icon.svg"
  })
  facebookBtn = new WMLButton({
    value:"signUp.facebookBtn.text",
    iconAlt:"signUp.facebookBtn.iconAlt",
    iconSrc:"assets/media/shared/facebook-icon.svg"
  })
  linkedinBtn = new WMLButton({
    value:"signUp.linkedinBtn.text",
    iconAlt:"signUp.linkedinBtn.iconAlt",
    iconSrc:"assets/media/shared/linkedin-icon.svg"
  })
  googleBtn = new WMLButton({
    value:"signUp.googleBtn.text",
    iconAlt:"signUp.googleBtn.iconAlt",
    iconSrc:"assets/media/shared/google-icon.svg"
  })

  socialMediaLoginBtns = [
    this.paypalBtn,
    this.yahooSportsBtn,
    this.facebookBtn,
    this.linkedinBtn,
    this.googleBtn,
  ]

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
