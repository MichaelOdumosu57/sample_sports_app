// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';
import { EventsService } from '@shared/services/event/event.service';

// rxjs
import { Subject,finalize } from 'rxjs';
import { concatMap, filter, takeUntil,tap } from 'rxjs/operators';

// misc

// reactive forms
import { FormControl } from '@angular/forms';

// wml components
import { WMLForm } from '@windmillcode/wml-form';
import { WMLButton, WMLUIProperty } from '@windmillcode/wml-components-base';
import { WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { ENV } from '@env/environment';
import { BlockchainService } from '@shared/services/bitcoin/blockchain.service';
import { AutomateService } from '@helpers/automation/automation/automation.service';
import { FormsService } from '@shared/services/forms/forms.service';

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
    public bitcoinService:BlockchainService,
    public automateService:AutomateService,
    public formsService:FormsService
  ) { }
  classPrefix = this.utilService.generateClassPrefix('PurchaseEvent')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  @Input('params') meta!:PurchaseEventComponentParams

  ENV = ENV



  termsField = this.baseService.generateCheckboxFormField(
    "purchaseEvent.fields.10.label",
    ENV.purchaseEvent.termsFieldFormControlName,
    this.formsService.purchaseEventFormGroup,
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
      ENV.purchaseEvent[formControlName],
      this.formsService.purchaseEventFormGroup,
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
    this.formsService.purchaseEventFormGroup.patchValue({
      [ENV.purchaseEvent.eventTitleFieldFormControlName]:this.meta.eventTitle
    })
    this.fields.push(this.termsField)
    this.wmlForm.fieldsUpdateSubj.next()

  }



  ngOnInit = ()=> {
    this.updateFields()
    this.listenForTicketQuantityFieldValueChange().subscribe()
  }



  submitBtnClick = ()=>{
    let noWalletSelected = [
      this.bitcoinService.wagmi.metamask.account,
      this.bitcoinService.wagmi.coinbase.account
    ]
    .some((account)=>{
      return account !== null
    })
    if(!noWalletSelected){
      let selectAWalletNote =this.baseService.generateWMLNote("purchaseEvent.wmlNotify.selectAWallet",WmlNotifyBarType.Error)
      this.wmlNotifyService.create(selectAWalletNote)
      return
    }
    if(!this.formsService.purchaseEventFormGroup.valid ){
      this.baseService.tellUserToFillOutRequiredFields(this.formsService.purchaseEventFormGroup,this.cdref)
      return
    }
    this.baseService.toggleOverlayLoadingSubj.next(true);

    let ticketNote
    this.bitcoinService.moralis.sendETHToSourceWallet(this.ticketTotal.pricingValue.value1.toString())
    .pipe(
      takeUntil(this.ngUnsub),
      tap({
        next:()=>{
          ticketNote =this.baseService.generateWMLNote("purchaseEvent.wmlNotify.purchaseTicketSuccess")
          this.wmlNotifyService.create(ticketNote)
        },
        error:(err)=>{
          ticketNote =this.baseService.generateWMLNote("purchaseEvent.wmlNotify.purchaseTicketError",WmlNotifyBarType.Error)
          if(err === ENV.errorCodes.NOTENOUGHFUNDS){
            ticketNote = this.baseService.generateWMLNote("purchaseEvent.wmlNotify.purchaseTicketNeedMoreFunds",WmlNotifyBarType.Error)
          }
          this.wmlNotifyService.create(ticketNote)
        }
      }),
      concatMap(()=>{
        return this.eventService.sendEmailOnPurchasedTicket(this.formsService.purchaseEventFormGroup.value)
        .pipe(
          tap({
            error: (err)=>{
              ticketNote =this.baseService.generateWMLNote("purchaseEvent.wmlNotify.purchaseTicketSubmitFormFail")
              this.wmlNotifyService.create(ticketNote)
            }
          })
        )
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

  price = .0008
  ticketQuantityField = this.baseService.generateInputFormField(
    "",
    ENV.purchaseEvent.ticketQuantityFieldFormControlName,
    this.formsService.purchaseEventFormGroup,
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
    let formControl:FormControl =this.formsService.purchaseEventFormGroup.controls[ENV.purchaseEvent.ticketQuantityFieldFormControlName]
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


  ngAfterViewInit(){


  }

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
