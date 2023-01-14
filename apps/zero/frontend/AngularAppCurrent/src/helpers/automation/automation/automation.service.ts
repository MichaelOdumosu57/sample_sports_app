
// angular
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import {ENV, environment} from '@env/environment'

// services
import { UtilityService } from '@core/utility/utility.service';

// misc
import { faker } from '@faker-js/faker';
import { GetEventsSuccessAPIResponseBody, GetEventsSuccessUIBody } from '@shared/services/event/event.service';


// rxjs
import { concatMap, forkJoin, from, of, tap, timer } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class  AutomateService {

  constructor(
    private utilService:UtilityService,
  ) {

    this.traverseClassAndNoopAllAutomationInit()

  }



  documentQuerySelector(selector:string){
    return document.querySelector(selector) as HTMLElement
  }

  documentQuerySelectorAll(selector:string){
    return Array.from(document.querySelectorAll(selector)) as Array<HTMLElement>
  }

  defaultNav ={
    openShareTray:()=>{

      of([])
      .pipe(

        tap(()=>{
          let shareBtn = this.documentQuerySelector("default-nav section.DefaultNavPod1 > button:nth-child(1)")
          shareBtn.click()
        })
      )
      .subscribe()

    }
  }


  eventsService = {
    getEventsMock:(amnt=10)=>{
      let body =new GetEventsSuccessAPIResponseBody()
      body.data  ={
        // @ts-ignore
        pagination:{
          has_more_items:false
        },
        // @ts-ignore
        events: [    {
          "name": {
              "text": "Summer Music Fest",
              "html": "Summer Music Fest"
          },
          "description": {
              "text": "Id dolorum cum aut voluptate maxime laborum adipisci culpa. Amet accusantium totam soluta atque quas.",
              "html": "Id dolorum cum aut voluptate maxime laborum adipisci culpa. Amet accusantium totam soluta atque quas."
          },
          "url": "https://www.eventbrite.com/e/summer-music-fest-tickets-492779074477",
          "start": {
              "timezone": "America/New_York",
              "local": "2022-12-26T05:17:25",
              "utc": "2022-12-26T10:17:25Z"
          },
          "end": {
              "timezone": "America/New_York",
              "local": "2023-11-06T01:35:10",
              "utc": "2023-11-06T06:35:10Z"
          },
          "organization_id": "1322280652203",
          "created": "2022-12-20T17:38:14Z",
          "changed": "2022-12-21T21:47:39Z",
          "capacity": 0,
          "capacity_is_custom": false,
          "status": "draft",
          "currency": "USD",
          "listed": true,
          "shareable": false,
          "invite_only": false,
          "online_event": false,
          "show_remaining": false,
          "tx_time_limit": 1200,
          "hide_start_date": false,
          "hide_end_date": false,
          "locale": "en_US",
          "is_locked": false,
          "privacy_setting": "unlocked",
          "is_series": false,
          "is_series_parent": false,
          "inventory_type": "limited",
          "is_reserved_seating": false,
          "show_pick_a_seat": false,
          "show_seatmap_thumbnail": false,
          "show_colors_in_seatmap_thumbnail": false,
          "source": "api",
          "is_free": true,
          "version": null,
          "summary": "Id dolorum cum aut voluptate maxime laborum adipisci culpa. Amet accusantium totam soluta atque quas.",
          "facebook_event_id": null,
          "logo_id": null,
          "organizer_id": "58508632433",
          "venue_id": null,
          "category_id": null,
          "subcategory_id": null,
          "format_id": null,
          "id": "492779074477",
          "resource_uri": "https://www.eventbriteapi.com/v3/events/492779074477/",
          "is_externally_ticketed": false,
          // @ts-ignore
          "logo": {
            url:faker.image.abstract()
          }
      }
    ]
      }
      let resp = new HttpResponse({
        body,
      })
      return resp
    }
  }

  eventsMain = {
    fillOutFormTimerFlow:2000,
    selectWallet:()=>{

      timer(this.eventsMain.fillOutFormTimerFlow)
      .pipe(
        tap(()=>{
          let [metamaskWallet,coinbaseWallet] = this.documentQuerySelectorAll(" events-main > div > mat-card > div.EventsMainPod0Item2 > div > mat-card > ul > li > button")
          metamaskWallet.click()
        })
      )
      .subscribe()
    },
    clickEvent:()=>{

      this.eventsMain.selectWallet()
       timer(this.eventsMain.fillOutFormTimerFlow+1000)
      .pipe(
        tap(()=>{
          let eventCard = this.documentQuerySelector(" events-main  div.EventsMainPod0Item2  div.EventsMainPod0Item7 > div.EventsMainPod0Item9 > button:nth-child(2)")
          eventCard.click()
        })
      )
      .subscribe()

    },
    fillOutForm : ()=>{
      console.log("fire")
      this.eventsMain.clickEvent()
      timer(this.eventsMain.fillOutFormTimerFlow+1200)
      .pipe(
        tap(()=>{
          let fields = this.documentQuerySelectorAll("purchase-event  section.PurchaseEventPod2 > wml-form wml-input > input")
          let [
            nameField,
            emailField,
            orgField,
            collegeField,
            socialMediaHandles,
            playSports,
            investingStage,
            linkedinProfile,
            phoneNumber
          ]= fields as Array<HTMLInputElement>

          nameField.value = faker.name.fullName()
          emailField.value = nameField.value.split(" ").join("_") + "@"+ faker.internet.email().split("@")[1]
          orgField.value = faker.company.name()
          collegeField.value = faker.science.chemicalElement().name
          socialMediaHandles.value = faker.internet.domainName()
          playSports.value = this.utilService.selectRandomOptionFromArray(["YES","NO"])
          investingStage.value = this.utilService.selectRandomOptionFromArray(['Pre-seed', 'Angel', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Other:'])
          linkedinProfile.value = "https:/linkedin.com/in/" + encodeURIComponent(nameField.value)
          phoneNumber.value = faker.phone.number()
          let ticketQuantityField = this.documentQuerySelector("div.PurchaseEventPod1Item1  div.PurchaseEventPod1Item2:nth-child(2)  input") as HTMLInputElement
          ticketQuantityField.value = this.utilService.generateRandomNumber(10,3).toString()
          let [activeInvestor] =  this.documentQuerySelectorAll("wml-form  textarea") as Array<HTMLInputElement>
          activeInvestor.value =  this.utilService.selectRandomOptionFromArray(["YES","NO"]) + " " + faker.lorem.sentences()
          let termsField = this.documentQuerySelector("input[type='checkbox']")
          termsField.click()
          fields.push(activeInvestor,termsField,ticketQuantityField)
          fields.forEach((field)=>{
            this.utilService.eventDispatcher("input",field)
          })

        })
      )
      .subscribe()

    },
    fillOutFormAndSubmit :()=>{

      this.eventsMain.fillOutForm()
      timer(this.eventsMain.fillOutFormTimerFlow+1400 )
      .pipe(tap(()=>{
        let submitbtn = this.documentQuerySelector("purchase-event > div > section.PurchaseEventPod2 > button")
        submitbtn.click()
      }))
      .subscribe()
    }
  }

  collegiateSignupMain ={
    fillOutFormTimerFlow:0,
    fillOutForm:()=>{
      timer(this.collegiateSignupMain.fillOutFormTimerFlow)
      .pipe(
        concatMap(()=>{
          return forkJoin(
            [
              from(fetch(ENV.frontendDomain0+"/assets/media/shared/13.jpg").then(res => res.blob())),
              from(fetch(ENV.frontendDomain0+"/assets/media/legal/Members_Protection_Policy_and_Responsible_Gaming.pdf").then(res => res.blob())),
            ]
          )
        }),
        tap((res)=>{
          let [inputFields,optionFields,chipFields,uploadFields]  = [
            "wml-input",
            "wml-options",
            "wml-chips",
            "wml-file-upload"
          ]
          .map((selector)=>{
            let result =this.documentQuerySelectorAll("wml-form wml-field .WmlFieldPod1 > "+selector)
            return result
          })

          inputFields
          .forEach((ele)=>{
            let myInput = ele.querySelector("input") ?? ele.querySelector("textarea")
            myInput.value =faker.name.fullName()
            this.utilService.eventDispatcher("input",myInput)
          })

          optionFields
          .forEach((field)=>{
            let options = Array.from(field.querySelectorAll("button"))
            this.utilService.selectRandomOptionFromArray(options).click()
          })

          chipFields
          .forEach((ele)=>{
            let myInput = ele.querySelector("textarea")
            myInput.value = faker.internet.url() +"/" + faker.internet.userName()
            this.utilService.eventDispatcher("input",myInput)
            this.utilService.eventDispatcher("keydown",myInput)
          })

          uploadFields
          .forEach((ele,index0)=>{


            // let myFile:any = res[index0] ?? this.generateFile(index0)
            let myFile:any = this.generateFile(index0)
            // myFile.name =["13.jpg","a.pdf"][index0]
            let myInput = ele.querySelector("input") as any
            myInput.chooseFiles([myFile])
          })



        })
      )
      .subscribe()
    },
    submit :()=>{
      this.collegiateSignupMain.fillOutForm()
      timer(this.collegiateSignupMain.fillOutFormTimerFlow+1000)
      .pipe(
        tap(()=>{
          let submitBtn = this.documentQuerySelector("collegiate-signup-main > div > mat-card > button")
          submitBtn.click()
        })
      )
      .subscribe()
    }

  }

  generateFile(counter = 0){
    let obj = { hello: "world "+ counter };
    let blob =  new File([JSON.stringify(obj)], "foo.json", {
      type: "application/json",
    });
    return blob
  }

  traverseClassAndNoopAllAutomationInit(){
    let entries = Object.entries(this)
    .filter((entry)=>{
      let [key,val]= entry
      return val.constructor.name === "Object"
    })

    let result = Object.fromEntries(entries)

    this.traverseClassAndNoopAllAutomation(result)
  }

  traverseClassAndNoopAllAutomation(obj,stack=[]){
    if(!environment.production) {
      return
    }
    Object.entries(obj).forEach(entry=>{
      let [key,value] = entry
      if(value.constructor.name === "Object"){
        stack.push(obj[key])
        this.traverseClassAndNoopAllAutomation(value,stack)
        stack = []
      }
      else{
        if(value instanceof Function){
          stack[stack.length-1][key] = ()=>{}
        }
      }
    })
  }




}
