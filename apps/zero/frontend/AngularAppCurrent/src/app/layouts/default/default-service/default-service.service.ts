import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ENV } from '@env/environment';
import { AccountService } from '@shared/services/account/account.service';
import { WMLButton } from '@windmillcode/wml-components-base';
import { WMLDropdownParams } from '@windmillcode/wml-dropdown';

@Injectable({
  providedIn: 'root'
})
export class DefaultService {

  constructor(
    public router:Router,
    public accountService:AccountService
  ) { }



  navToProfile = ()=>{
    this.router.navigate([ENV.nav.urls.profile])
  }
  profileBtn = new DefaultServiceBtn({
    isPresent:false,
    type:"btn",
    text: "defaultNav.profile",
    class:"DefaultNavPod1Btn1",
    click:this.navToProfile
  })
  signUpBtn = new DefaultServiceBtn({
    type:"btn",
    text: "defaultNav.register",
    class:"DefaultNavPod1Btn1",
    click:this.accountService.login
  })
  loginBtn = new DefaultServiceBtn({
    type:"btn",
    text: "defaultNav.login",
    class:"DefaultNavPod1Btn0",
    click:this.accountService.login

  })
}

class DefaultServiceBtn extends WMLButton {
  constructor(params:Partial<DefaultServiceBtn>={}){
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
