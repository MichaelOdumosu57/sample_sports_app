import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { readFileContent, transformFromCamelCaseToSnakeCase } from '@core/utility/common-utils';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment.dev';
import { WMLFileUploadItem } from '@windmillcode/wml-file-manager';
import { concatMap, iif, map, of, take, tap, zip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollegiateService {

  constructor(
    public http:HttpClient,
    public utilityService:UtilityService
  ) { }

  submitForm = (uiBody,raw = false)=>{
    return iif(
      ()=>ENV.collegiateService.sumbitSponsorshipAcceleratorForm.automate,
      of(new SubmitFormUIResponseBody()),

      submitFormLoad(uiBody)
      .pipe(
        concatMap((apiBody)=>{
          return this.http
          .post(ENV.collegiateService.sumbitSponsorshipAcceleratorForm.url(),apiBody)
          .pipe(raw ? tap() : map(submitFormSuccess))
        })
      )


    )
  }
}


let submitFormSuccess = (apiBody:SubmitFormAPIResponseBody)=>{
  let uiBody = new SubmitFormUIResponseBody()
  return uiBody
}

let submitFormLoad = (uiBody:SubmitFormUIRequestBody)=>{

  let apiData =Object.entries(uiBody as any)
  .map((entry)=>{
    let [key,val]= entry
    return [transformFromCamelCaseToSnakeCase(key),val]
  })
  apiData = Object.fromEntries(apiData)

  let apiBody = new SubmitFormAPIRequestBody({
    data :{
      ...(apiData as any)
    }
  })

  let files = [
    ...uiBody.teamLogo
    .map((item)=>{
      return readFileContent(item.file,"readAsDataURL")
    })
    ,...uiBody.pitchDeck
    .map((item)=>{
      return readFileContent(item.file)
    })
  ]


  return zip(
    files
  )
  .pipe(
    take(1),
    map((res)=>{
      apiBody.data.team_logo = []
      apiBody.data.pitch_deck = []
      ;["teamLogo","pitchDeck"]
      .forEach((key)=>{
        uiBody[key].forEach((wmlFile)=>{
          let match = res.find((res)=> res.file === wmlFile.file)
          if(  match ){
            apiBody.data[transformFromCamelCaseToSnakeCase(key)].push({
              body:match.content,
              name:match.file.name,
              type:match.file.type,
            })
          }
        })
      })

      return apiBody
    })
  )

}

class SubmitFormUIRequestBody {
  constructor(params:Partial<SubmitFormUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  linkedin: string;
  phone: string;
  email: string;
  customerStatus: string[];
  profileName: string;
  teamName: string;
  startupStage: string;
  employeeCount: string;
  atheleticPlayers: string;
  socialMediaHandles: string[];
  fundingAmnt: string[];
  preferredContact: string[];
  teamLogo: WMLFileUploadItem[];
  pitchDeck:WMLFileUploadItem[];
}

class SubmitFormAPIRequestBody {
  constructor(params:Partial<SubmitFormAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:{
    linkedin?: string;
    phone?: string;
    email?: string;
    customer_status: string[];
    profile_name: string;
    team_name: string;
    startup_stage: string;
    employee_count: string;
    atheletic_players: string;
    social_media_handles: string[];
    funding_amnt: string[];
    preferred_contact: string[];
    team_logo:{
      body:string,
      name:string,
      type:string
    }[];
    pitch_deck:SubmitFormAPIRequestBody["data"]["team_logo"];
  }
}

class SubmitFormUIResponseBody {
  constructor(params:Partial<SubmitFormUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}

class SubmitFormAPIResponseBody {
  constructor(params:Partial<SubmitFormAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}
