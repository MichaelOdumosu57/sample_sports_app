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
import { WMLButton, WMLImage, WMLRoute, WMLUIProperty } from '@windmillcode/wml-components-base';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WMLForm } from '@windmillcode/wml-form';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone:true,
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports:[SharedModule],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class SignInComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('SignIn')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  splashScreenImg = new WMLImage({
    src:"assets/media/shared/splash-screen-logo.png",
    alt:"signIn.splashScreenImg.alt"
  })

  rootFormGroup = new FormGroup({
    [ENV.signIn.field0.emailFieldFormControlName]: new FormControl(null,[Validators.required]),
    [ENV.signIn.field0.passwordFieldFormControlName]: new FormControl(null,[Validators.required]),
  })

  emailField = this.baseService.generateInputFormField(
    "signIn.info.fields.0.label",
    ENV.signIn.field0.emailFieldFormControlName,
    this.rootFormGroup,
    null,"standalone"
  );

  passwordField = this.baseService.generateInputFormField(
    "signIn.info.fields.1.label",
    ENV.signIn.field0.passwordFieldFormControlName,
    this.rootFormGroup,
    null,"standalone"
  );


  fields = [this.emailField, this.passwordField];
  wmlForm = new WMLForm({
    fields:this.fields,
  })

  forgotPasswordBtn = new WMLButton({
    value:"signIn.info.forgotPass",
    click:()=>{}
  })

  signInBtn = new WMLButton({
    value:"signIn.info.signIn",
    click:()=>{}
  })

  signUpLink = new WMLRoute({
    value:"signIn.info.signUp",
    route:ENV.nav.urls.register
  })

  updateFields = ()=>{
    this.fields.forEach((field)=>{
      field.label.custom.meta.labels[0].shift()
    })
  }

  ngOnInit(): void {
    this.updateFields()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
