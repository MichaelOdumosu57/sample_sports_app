import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ENV } from '@env/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(

  ) { }


 profileMainFormGroup = new FormGroup({
  [ENV.profileMain.firstNameFieldFormControlName]:new FormControl(null,[Validators.required]),
  [ENV.profileMain.lastNameFieldFormControlName]:new FormControl(null,[Validators.required]),
  [ENV.profileMain.addressFieldFormControlName]:new FormControl(null,[Validators.required]),
  [ENV.profileMain.cityFieldFormControlName]:new FormControl(null,[Validators.required]),
  [ENV.profileMain.stateFieldFormControlName]:new FormControl(null,[Validators.required]),
  [ENV.profileMain.zipcodeFieldFormControlName]:new FormControl(null,[Validators.required]),
  [ENV.profileMain.countryFieldFormControlName]:new FormControl(null,[Validators.required]),
})
 purchaseEventFormGroup = new FormGroup({
  [ENV.purchaseEvent.ticketQuantityFieldFormControlName] :new FormControl(1,[Validators.required,Validators.min(1)]),
  [ENV.purchaseEvent.eventTitleFieldFormControlName] :new FormControl(null,[Validators.required]),
  [ENV.purchaseEvent.nameFieldFormControlName]: new FormControl(null,[Validators.required]),
  [ENV.purchaseEvent.emailFieldFormControlName]: new FormControl(null,[Validators.required,Validators.email]),
  [ENV.purchaseEvent.termsFieldFormControlName]: new FormControl(null,[
    (c)=>{
      if(c.value !== true){
        return {required:true}
      }
      return null
    }
  ]),
  [ENV.purchaseEvent.orgFieldFormControlName]: new FormControl(null,[Validators.required]),
  [ENV.purchaseEvent.collegeFieldFormControlName] :  new FormControl(null,[Validators.required]),
  [ENV.purchaseEvent.socialMediaHandlesFieldFormControlName] :  new FormControl(null,[Validators.required]),
  [ENV.purchaseEvent.playSportsFieldFormControlName] :  new FormControl(null,[Validators.required]),
  [ENV.purchaseEvent.investingStageFieldFormControlName] :  new FormControl(null,[Validators.required]),
  [ENV.purchaseEvent.activeInvestorFieldFormControlName] :  new FormControl(null,[Validators.required]),
  [ENV.purchaseEvent.linkedinProfileFieldFormControlName] :  new FormControl(null,[Validators.required]),
  [ENV.purchaseEvent.phoneNumberFieldFormControlName] :  new FormControl(null,[Validators.required]),
})
  collegiateSignupMainFormGroup = new FormGroup({
    [ENV.collegiateSignupMain.linkedinFieldFormControlName]:new FormControl(null,[]),
    [ENV.collegiateSignupMain.phoneFieldFormControlName]:new FormControl(null,[]),
    [ENV.collegiateSignupMain.emailFieldFormControlName]:new FormControl(null,[]),
    [ENV.collegiateSignupMain.customerStatusFieldFormControlName]:new FormArray([],Validators.required),
    [ENV.collegiateSignupMain.profileNameFieldFormControlName]:new FormControl(null,Validators.required),
    [ENV.collegiateSignupMain.teamNameFieldFormControlName]:new FormControl(null,Validators.required),
    [ENV.collegiateSignupMain.startupStageFieldFormControlName]:new FormControl(null,Validators.required),
    [ENV.collegiateSignupMain.employeeCountFieldFormControlName]:new FormControl(null,[Validators.required,Validators.min(1)]),
    [ENV.collegiateSignupMain.atheleticPlayersFieldFormControlName]:new FormControl(null,Validators.required),
    [ENV.collegiateSignupMain.socialMediaHandlesFieldFormControlName]:new FormArray([],Validators.required),
    [ENV.collegiateSignupMain.fundingAmntFieldFormControlName]:new FormArray([],Validators.required),
    [ENV.collegiateSignupMain.preferredContactFieldFormControlName]:new FormArray([],Validators.required),
    [ENV.collegiateSignupMain.teamLogoFieldFormControlName]:new FormArray([],Validators.required),
    [ENV.collegiateSignupMain.pitchDeckFieldFormControlName]:new FormArray([],Validators.required),
  })
}
