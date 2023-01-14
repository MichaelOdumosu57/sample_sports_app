
// angular
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import { FormGroup } from '@angular/forms';
import { ENV } from '@core/config/configs';

// services
import { UtilityService } from '@core/utility/utility.service';

// misc
import { environment  as env } from '@environment/environment';
import { faker } from '@faker-js/faker';
import { GetEventsSuccessUIBody } from '@shared/services/event/event.service';

// wml-components
import { WmlDropdownOptionsMeta } from '@shared/wml-components/wml-dropdown/wml-dropdown-option/wml-dropdown-option.component';
import { tap, timer } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class  AutomateService {

  constructor(
    private utilService:UtilityService,
  ) { }


  documentQuerySelector(selector:string){
    return document.querySelector(selector) as HTMLElement
  }

  documentQuerySelectorAll(selector:string){
    return Array.from(document.querySelectorAll(selector)) as Array<HTMLElement>
  }

  fillOutFormTimerFlow = 1200

  purchaseEvent = {



  clickEvent:()=>{
    if(env.production){
      return
    }
     timer(this.fillOutFormTimerFlow)
    .pipe(
      tap(()=>{
        let eventCard = this.documentQuerySelector(".EventlistPod0Item0 > wml-profile-detail-card")
        eventCard.click()
      })
    )
    .subscribe()

  },


  fillOutForm : ()=>{
    if(env.production){
      return
    }
    this.purchaseEvent.clickEvent()
    timer(this.fillOutFormTimerFlow+1000)
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
        let ticketQuantityField = this.documentQuerySelector("#root > app-root > div > div.AppPod4 > wml-popup > div > mat-card > purchase-event > div > section.PurchaseEventPod1 > div.PurchaseEventPod1Item0 > div > div:nth-child(2) > div > input") as HTMLInputElement
        ticketQuantityField.value = this.utilService.generateRandomNumber(10,3).toString()
        let [activeInvestor] =  this.documentQuerySelectorAll("purchase-event  section.PurchaseEventPod2 > wml-form wml-input > textarea") as Array<HTMLInputElement>
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

    if(env.production){
      return
    }
    this.purchaseEvent.fillOutForm()
    timer(this.fillOutFormTimerFlow+1200 )
    .pipe(tap(()=>{
      let submitbtn = this.documentQuerySelector("#root > app-root > div > div.AppPod4 > wml-popup > div > mat-card > purchase-event > div > section.PurchaseEventPod2 > button")
      submitbtn.click()
    }))
    .subscribe()
  }
  }

  eventsService = {
    getEventsMock:(amnt=10)=>{
      let body =new GetEventsSuccessUIBody()
      body.events= Array(this.utilService.generateRandomNumber(amnt,1))
      .fill(null)
      .map((nullVal,index0)=>{
        return {
          imgSrc: "imgSrc",
          title: "title",
          desc: "desc",
          start: "start",
          end: "end",
        }
      })
      let resp = new HttpResponse({
        body,
      })
      return resp
    }
  }



}
