// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { concatMap, takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@env/environment';
import { EventsService, getEventsSuccess, GetEventsSuccessAPIResponseBody } from '@shared/services/event/event.service';

import { WMLButton, WMLImage, WMLUIProperty } from '@windmillcode/wml-components-base';
import { ScrollBottomPaginationParams } from '@shared/directives/scroll-bottom-pagination-directive/scroll-bottom-pagination.directive';

import { WmlNotifyBarType,WmlNotifyService } from '@windmillcode/wml-notify';
import { PurchaseEventComponent, PurchaseEventComponentParams } from '../purchase-event/purchase-event.component';
import { AutomateService } from '@helpers/automation/automation/automation.service';
import { BlockchainService } from '@shared/services/bitcoin/blockchain.service';
import { ShowTextComponent, ShowTextParams } from '@shared/components/show-text/show-text.component';



@Component({

  selector: 'events-main',
  templateUrl: './events-main.component.html',
  styleUrls: ['./events-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class EventsMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public eventService:EventsService,
    public wmlNotifyService:WmlNotifyService,
    public automateService:AutomateService,
    public blockchainService:BlockchainService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('EventsMain')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  backdropImg = new WMLImage({
    src:"assets/media/shared/poster_0.jpg",
    alt:"niblsBallMain.backdropImgAlt"
  })

  eventList =[]
  errorNote =()=>  this.baseService.generateWMLNote("eventsMain.wmlNotify.loadRecordsError",WmlNotifyBarType.Error)
  openDialog = (event)=>{
    this.baseService.popupParams.cpnt = PurchaseEventComponent
    this.baseService.popupParams.meta = new PurchaseEventComponentParams({
      mainImgSrc:event.imgSrc,
      mainImgAlt: event.title,
      eventTitle:event.title,
    })
    this.baseService.togglePopupSubj.next(true)
  }
  scrollBottomPaginationParamsPopulateItems = (apiResult:GetEventsSuccessAPIResponseBody)=>{

    let uiResult = getEventsSuccess(apiResult)
    this.eventList.push(...uiResult.events)
    this.eventList = this.eventList.map((event)=>{


      return new EventsMainEventItem({
        click:this.openDialog,
        ...event
      })

    })

    this.scrollBottomPaginationParams.stopMakingAPICalls = !uiResult.hasMoreItems
    this.cdref.detectChanges()
  }
  scrollBottomPaginationParamsNotifyError = (err,failedApiCalls)=>{
    if(failedApiCalls > 5){
      let finalErrorNote = this.errorNote();
      finalErrorNote.custom.meta.i18nKey ="eventsMain.wmlNotify.stopTryingToLoadRecordsError"
      this.scrollBottomPaginationParams.stopMakingAPICalls = true
      this.wmlNotifyService.create(finalErrorNote)
    }
    this.wmlNotifyService.create(this.errorNote());
  }


  scrollBottomPaginationParams = new ScrollBottomPaginationParams({
    populateItems:this.scrollBottomPaginationParamsPopulateItems,
    notifyError:this.scrollBottomPaginationParamsNotifyError,
    apiInfo:{
      endpoint:ENV.events.getEventsEndpoint.url(),
      method:"POST",
      updateBody:this.utilService.scrollBottomPaginationParamsUpdateBody,
      altHttpRequest:this.eventService.getEvents(true)
    },
    elementToDetermineXFromBottom:this.automateService.documentQuerySelector("main")
  });


  notifyWalletSuccessAdd = ()=>{
    let note = this.baseService.generateWMLNote("eventsMain.wmlNotify.walletSuccessAdded",null,true)
    this.wmlNotifyService.create(note)
  }
  openWalletLinkDialog =(route,text)=>{

    this.baseService.popupParams.cpnt = ShowTextComponent
    this.baseService.popupParams.params = new ShowTextParams({
      route,
      text
    })

    this.baseService.togglePopupSubj.next(true)
  }
  metaMaskWallet = new EventsMainWallet({
    text:"eventsMain.wallet.metamask.title",
    click:()=>{
      this.blockchainService.wagmi.metamask.connect()
      .pipe(
        takeUntil(this.ngUnsub),
        tap({
          error:(err)=>{
            let note
            if(err.message.includes("Connector not found")){
              note = this.baseService.generateWMLNote("eventsMain.wmlNotify.installWallet",WmlNotifyBarType.Info)
              this.wmlNotifyService.create(note)
              this.openWalletLinkDialog(
                "https://metamask.io/download",
                "eventsMain.wmlNotify.downloadMetamaskWallet"
              )
            }
          }
        }),
        concatMap(()=>{
          return this.blockchainService.moralis.login("metamask")
        }),
        tap(this.notifyWalletSuccessAdd)
      )
      .subscribe()
    }
  })
  coinbaseWallet = new EventsMainWallet({
    text:"eventsMain.wallet.coinbase.title",
    click:()=>{
      this.blockchainService.wagmi.coinbase.connect()
      .pipe(
        takeUntil(this.ngUnsub),
        tap(this.notifyWalletSuccessAdd),
        tap(()=>{
          this.blockchainService.moralis.currentWallet = "coinbase"
        })
      )
      .subscribe()
    }
  })
  wallets =[
    this.metaMaskWallet,
    this.coinbaseWallet
  ]



  ngAfterViewInit(): void {

    this.automateService.eventsMain.fillOutForm()
  }


  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

class EventsMainWallet extends WMLButton {
  constructor(params:Partial<EventsMainWallet>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}


class EventsMainEventItem extends WMLUIProperty  {
  constructor(params:Partial<EventsMainEventItem>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  imgSrc:string
  imgAlt:string
  href:string
  eventbriteBtnClick=()=>{
    window.location.href=this.href
  }

}
