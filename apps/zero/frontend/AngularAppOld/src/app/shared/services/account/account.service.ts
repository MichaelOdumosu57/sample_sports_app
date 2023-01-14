import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ENV } from '@core/config/configs';
import { UtilityService } from '@core/utility/utility.service';
import { iif, map, of, ReplaySubject, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    public route:ActivatedRoute,
    public utilService:UtilityService,
    public http:HttpClient
  ) { }

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
            this.utilService.transformFromSnakeCaseToCamelCase(key),
            val
          ]
        })
        newRes = Object.fromEntries(newRes)
        Object.assign(this.currentProfile,newRes)
        this.currentProfile.isPopulated = true
        let saveMeToLocalStorage= this.utilService.deepCopy(this.currentProfile)
        delete saveMeToLocalStorage.accessToken
        saveMeToLocalStorage = JSON.stringify(saveMeToLocalStorage)
        localStorage.setItem(this.currentProfile._localStorageName, saveMeToLocalStorage)
        this.profileUpdatedSubj.next()
      }),

    )
  }
  retireveUserAccountInfoFromLocalStorage = ()=>{
    let profileInfo = JSON.parse(localStorage.getItem(this.currentProfile._localStorageName))
    Object.assign(this.currentProfile,profileInfo)
    this.profileUpdatedSubj.next()
  }
  signOut = ()=>{

    localStorage.setItem(this.currentProfile._localStorageName, JSON.stringify({}))
    AccountProfile.index--
    this.currentProfile = new AccountProfile()
    this.profileUpdatedSubj.next()

  }
  updateProfile = (uiBody,raw= false)=>{
    let apiBody = updateProfileLoad(uiBody,this.currentProfile.accessToken,this.currentProfile.userId,this.utilService.transformFromCamelCaseToSnakeCase)
    return iif(
      ()=>ENV.accountService.updateProfileEndpoint.automate,
      of(null),
      this.http
      .patch(ENV.accountService.updateProfileEndpoint.url(), apiBody)
      .pipe(raw ? tap() : map(updateProfileSuccess))
    )
  }

}

let updateProfileSuccess = (value)=>{
  return value
}

let updateProfileLoad = (
  uiBody:UpdateProfileUIRequestBody,
  accessToken:string,
  userId:string,
  toSnakeCase:Function
)=>{

  let newuiBody = Object.entries(uiBody)
  .map((entry)=>{
    return [
      toSnakeCase(entry[0]),
      entry[1]
    ]
  })
  uiBody = Object.fromEntries(newuiBody)
  let apiBody : UpdateProfileAPIRequestBody = new UpdateProfileAPIRequestBody()
  Object.assign(apiBody.data,uiBody)
  apiBody.data.access_token = accessToken
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
    access_token:"",
    user_id:""
  }
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
  accessToken=""
  userId=""
}
