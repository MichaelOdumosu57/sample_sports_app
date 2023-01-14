import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ENV } from '@env/environment';
import { UtilityService } from '@core/utility/utility.service';
import { iif, map, of, ReplaySubject, retry, tap } from 'rxjs';
import { transformFromCamelCaseToSnakeCase, transformFromSnakeCaseToCamelCase } from '@core/utility/common-utils';
import { BaseService } from '@core/base/base.service';
import { WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    public route:ActivatedRoute,
    public utilService:UtilityService,
    public http:HttpClient,
    public baseService:BaseService,
    public wmlNotifyService:WmlNotifyService
  ) {
  }

  profiles = [new AccountProfile({})]
  currentProfile= this.profiles[0]
  profileUpdatedSubj = new ReplaySubject<void>(Infinity)
  retrieveUserAccountInfoFromQueryParams =()=>{

    return this.route.queryParams
    .pipe(
      tap((res)=>{
        let newRes = Object.entries(res)
        .map((entry)=>{
          let [key,val] = entry
          return [
            transformFromSnakeCaseToCamelCase(key),
            val
          ]
        })
        newRes = Object.fromEntries(newRes)
        Object.assign(this.currentProfile,newRes)
        this.currentProfile.isPopulated = true
        this.saveProfileToLocalStorage();
        this.profileUpdatedSubj.next()
      }),

    )
  }
  retireveUserAccountInfoFromLocalStorage = ()=>{
    console.log(this.currentProfile._localStorageName)
    let profileInfo = JSON.parse(localStorage.getItem(this.currentProfile._localStorageName))
    Object.assign(this.currentProfile,profileInfo)
    this.profileUpdatedSubj.next()
  }
  login = ()=>{
    window.location.replace(ENV.signUp.endpoint.url())

  }
  logOut = ()=>{

    localStorage.setItem(this.currentProfile._localStorageName, JSON.stringify({}))
    AccountProfile.index--
    this.currentProfile = new AccountProfile()
    this.logoutAPI().subscribe()
    this.profileUpdatedSubj.next()

  }


  getAzureAccessToken = ()=>{
    return this.currentProfile.accessToken
  }
  updateProfile = (uiBody,raw= false)=>{
    Object.assign(this.currentProfile,uiBody)
    this.saveProfileToLocalStorage()
    let apiBody = updateProfileLoad(uiBody,this.getAzureAccessToken(),this.currentProfile.userId)
    return iif(
      ()=>ENV.accountService.updateProfileEndpoint.automate,
      of(null),
      this.http
      .patch(ENV.accountService.updateProfileEndpoint.url(), apiBody,{withCredentials:true})
      .pipe(raw ? tap() : map(updateProfileSuccess))
    )
  }

  logoutAPI = ()=>{
    return iif(
      ()=>ENV.accountService.logoutAPI.automate,
      of(null),
      this.http
      .get(ENV.accountService.logoutAPI.url(),{withCredentials:true})
      .pipe(
        retry(2),
        tap({
          error:()=>{
            let note = this.baseService.generateWMLNote("global.logoutError",WmlNotifyBarType.Error)
            this.wmlNotifyService.create(note)
          }
        })
      )

    )
  }

  getNewAzureAccessToken = (raw = false)=>{
    return iif(
      ()=>ENV.accountService.getNewAzureAccessToken.automate,
      of(null),
      this.http
      .get(ENV.accountService.getNewAzureAccessToken.url(),{withCredentials:true})
      .pipe(
        tap((res:GetNewAzureAccessTokenAPIResponseModel)=>{
          this.currentProfile.accessToken = res["access_token"]
        })
      )

    )
  }


  saveProfileToLocalStorage() {
    let saveMeToLocalStorage = this.utilService.deepCopy(this.currentProfile);
    delete saveMeToLocalStorage.accessToken;
    saveMeToLocalStorage = JSON.stringify(saveMeToLocalStorage);
    localStorage.setItem(this.currentProfile._localStorageName, saveMeToLocalStorage);
  }
}

export class GetNewAzureAccessTokenAPIResponseModel {
  constructor(params:Partial<GetNewAzureAccessTokenAPIResponseModel>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )

  }
  data:{
    access_token:string
  }
}

let updateProfileSuccess = (value)=>{
  return value
}

let updateProfileLoad = (
  uiBody:UpdateProfileUIRequestBody,
  accessToken:string,
  userId:string,
)=>{

  let newuiBody = Object.entries(uiBody)
  .map((entry)=>{
    return [
      transformFromCamelCaseToSnakeCase(entry[0]),
      entry[1]
    ]
  })
  uiBody = Object.fromEntries(newuiBody)
  let apiBody : UpdateProfileAPIRequestBody = new UpdateProfileAPIRequestBody()
  Object.assign(apiBody.data,uiBody)
  apiBody.access_token = accessToken
  apiBody.data.user_id = userId
  return apiBody
}

class UpdateProfileAPIRequestBody {
  constructor(params:Partial<UpdateProfileAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data= {
    first_name:"",
    last_name:"",
    address:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    user_id:""
  }
  access_token:string
}
class UpdateProfileUIRequestBody {
  constructor(params:Partial<UpdateProfileUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}
class AccountProfile  {
  constructor(params:Partial<AccountProfile>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    this._localStorageName+=AccountProfile.index
    AccountProfile.index++
  }
  static index=0
  _localStorageName = "accountProfile"
  firstName="Default"
  lastName="User"
  country="Nigeria"
  userName="User12345"
  isPopulated=false
  accessToken:string = null
  userId=""
}
