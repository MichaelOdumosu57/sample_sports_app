// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';
import { EventsService } from '@shared/services/event/event.service';
import { MoralisService } from '@shared/services/moralis/moralis.service';

// rxjs
import { Subject,finalize, timer } from 'rxjs';
import { concatMap, filter, takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@app/core/config/configs';
// reactive forms
import { FormControl, FormGroup, Validators } from '@angular/forms';

// wml components
import { WMLForm } from '@windmillcode/wml-form';
import { WMLButton, WMLUIProperty } from '@windmillcode/wml-components-base';
import { WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';

// wml components

@Component({
  selector: 'purchase-event',
  templateUrl: './purchase-event.component.html',
  styleUrls: ['./purchase-event.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class PurchaseEventComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public eventService:EventsService,
    public wmlNotifyService:WmlNotifyService,
    public moralisService:MoralisService,
  ) { }
  classPrefix = this.utilService.generateClassPrefix('PurchaseEvent')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  @Input('params') meta!:PurchaseEventComponentParams

  ENV = ENV

  rootFormGroup = new FormGroup({
    [ENV.eventList.ticketQuantityFieldFormControlName] :new FormControl(1,[Validators.required,Validators.min(1)]),
    [ENV.eventList.eventTitleFieldFormControlName] :new FormControl(null,[Validators.required]),
    [ENV.eventList.nameFieldFormControlName]: new FormControl(null,[Validators.required]),
    [ENV.eventList.emailFieldFormControlName]: new FormControl(null,[Validators.required,Validators.email]),
    [ENV.eventList.termsFieldFormControlName]: new FormControl(null,[
      (c)=>{
        if(c.value !== true){
          return {required:true}
        }
        return null
      }
    ]),
    [ENV.eventList.orgFieldFormControlName]: new FormControl(null,[Validators.required]),
    [ENV.eventList.collegeFieldFormControlName] :  new FormControl(null,[Validators.required]),
    [ENV.eventList.socialMediaHandlesFieldFormControlName] :  new FormControl(null,[Validators.required]),
    [ENV.eventList.playSportsFieldFormControlName] :  new FormControl(null,[Validators.required]),
    [ENV.eventList.investingStageFieldFormControlName] :  new FormControl(null,[Validators.required]),
    [ENV.eventList.activeInvestorFieldFormControlName] :  new FormControl(null,[Validators.required]),
    [ENV.eventList.linkedinProfileFieldFormControlName] :  new FormControl(null,[Validators.required]),
    [ENV.eventList.phoneNumberFieldFormControlName] :  new FormControl(null,[Validators.required]),
  })

  termsField = this.baseService.generateCheckboxFormField(
    "purchaseEvent.fields.10.label",
    ENV.eventList.termsFieldFormControlName,
    this.rootFormGroup,
    {
      required:"purchaseEvent.fields.10.errorRequired"
    },
    "standalone",
    "purchaseEvent.fields.10.checkBoxDesc"
  )

  fields= [
    "nameFieldFormControlName",
    "emailFieldFormControlName",
    "orgFieldFormControlName",
    "collegeFieldFormControlName",
    "socialMediaHandlesFieldFormControlName",
    "playSportsFieldFormControlName",
    "investingStageFieldFormControlName",
    "activeInvestorFieldFormControlName",
    "linkedinProfileFieldFormControlName",
    "phoneNumberFieldFormControlName",
  ]
  .map((formControlName,index0)=>{
    let fieldToGenerate = {
      7:this.baseService.generateTextAreaFormField,
    }[index0] ?? this.baseService.generateInputFormField
    return fieldToGenerate(
      "purchaseEvent.fields."+index0+".label",
      ENV.eventList[formControlName],
      this.rootFormGroup,
      {
        required:"purchaseEvent.fields."+ index0+".errorRequired"
      }
    )
  })
  wmlForm = new WMLForm({
    fields: this.fields
  })

  updateFields = ()=>{
    this.ticketQuantityField.error.custom.meta.wmlField = this.ticketQuantityField
    this.rootFormGroup.patchValue({
      [ENV.eventList.eventTitleFieldFormControlName]:this.meta.eventTitle
    })
    this.fields.push(this.termsField)
    this.wmlForm.fieldsUpdateSubj.next()

  }



  ngOnInit = ()=> {
    this.updateFields()
    this.listenForTicketQuantityFieldValueChange().subscribe()
  }



  submitBtnClick = ()=>{
    if(!this.moralisService.moralisUser){
      let selectAWalletNote =this.baseService.generateWMLNote("purchaseEvent.wmlNotify.selectAWallet",WmlNotifyBarType.Error)
      this.wmlNotifyService.create(selectAWalletNote)
      return
    }
    if(!this.rootFormGroup.valid || !this.moralisService.moralisUser){
      let fillOutFormNote =this.baseService.generateWMLNote("purchaseEvent.wmlNotify.fillOutForm",WmlNotifyBarType.Error)
      this.wmlNotifyService.create(fillOutFormNote)
      this.baseService.validateAllFormFields(this.rootFormGroup)
      this.cdref.detectChanges()
      return
    }
    this.baseService.toggleOverlayLoadingSubj.next(true)

    this.moralisService.sendETHToSourceWallet(this.ticketTotal.pricingValue.value1.toString())
    .pipe(
      takeUntil(this.ngUnsub),
      tap({
        next:()=>{
          let ticketNote =this.baseService.generateWMLNote("purchaseEvent.wmlNotify.purchaseTicketSuccess")
          this.wmlNotifyService.create(ticketNote)
        },
        error:()=>{
          let ticketNote =this.baseService.generateWMLNote("purchaseEvent.wmlNotify.purchaseTicketError",WmlNotifyBarType.Error)
          this.wmlNotifyService.create(ticketNote)
        }
      }),
      concatMap(()=>{
        return this.eventService.sendEmailOnPurchasedTicket(this.rootFormGroup.value)
      }),
      finalize(()=>{
        this.baseService.closePopup()
      }),
      this.baseService.closeOverlayLoading
    )

    .subscribe()
  }
  submitBtn = new WMLButton({
    value:"purchaseEvent.submit",
    click: this.submitBtnClick
  })

  price = .0004
  ticketQuantityField = this.baseService.generateInputFormField(
    "",
    ENV.eventList.ticketQuantityFieldFormControlName,
    this.rootFormGroup,
    {
      required:"purchaseEvent.ticketField.errorRequired",
      min:"purchaseEvent.ticketField.errorMin"
    }

  )
  calculateTotalPrice = (val)=>{
    this.ticketTotal.pricingValue.value1 = this.ticketPrice.pricingValue.value1 *val
    this.ticketTotal.pricingValue.value1 = +this.ticketTotal.pricingValue.value1.toPrecision(5)
    this.ticketTotal.pricingValue.value = this.ticketTotal.pricingValue.value1  + " ETH"
  }
  listenForTicketQuantityFieldValueChange = ()=>{
    let formControl:FormControl =this.rootFormGroup.controls[ENV.eventList.ticketQuantityFieldFormControlName]
    this.calculateTotalPrice(formControl.value)
    return formControl.valueChanges
      .pipe(
        takeUntil(this.ngUnsub),
        filter((val)=> typeof val === "number"),
        filter((val)=> val > 0),
        tap(this.calculateTotalPrice)
      )
  }

  ticketPrice:PurchaseEventTicketInfo
  ticketQuantity:PurchaseEventTicketInfo
  ticketTotal:PurchaseEventTicketInfo
  pricing =(()=>{
    let info =[
      "purchaseEvent.price",
      "purchaseEvent.quantity",
      "purchaseEvent.total"
    ]
    .map((i18nKey,index0)=>{

      return new PurchaseEventTicketInfo({
        pricingKey:new WMLUIProperty({
          value:i18nKey,

        }),
        pricingValue:new PurchaseEventWMLUIProperty({
          type:["text","input","text"][index0],
          value:[this.price +" ETH"][index0],
          value1:[this.price][index0]
        }),
      })
    })
    this.ticketPrice = info[0]
    this.ticketQuantity = info[1]
    this.ticketTotal = info[2]
    return info
  })()



  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
export class PurchaseEventComponentParams {
  constructor(params:Partial<PurchaseEventComponentParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  mainImgSrc:string
  mainImgAlt:string
  eventTitle:string

}


class PurchaseEventWMLUIProperty extends WMLUIProperty {
  constructor(params:Partial<PurchaseEventWMLUIProperty>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  value1:number
}

class PurchaseEventTicketInfo {
  constructor(params:Partial<PurchaseEventTicketInfo>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  pricingKey:WMLUIProperty
  pricingValue:PurchaseEventWMLUIProperty
}
