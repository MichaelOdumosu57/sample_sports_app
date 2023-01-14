// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';
import { EventsService, getEventsSuccess, GetEventsSuccessAPIResponseBody, GetEventsSuccessUIBody } from '@shared/services/event/event.service';
import { AutomateService } from '@helpers/automation/automation/automation.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@app/core/config/configs';
import { ScrollBottomPaginationParams } from '@shared/directives/scroll-bottom-pagination-directive/scroll-bottom-pagination.directive';

// wml-components
import { WmlNotifyBarModel, WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { NotifyBannerComponent, NotifyBannerMeta } from '@shared/components/notify-banner/notify-banner.component';
import { WMLCustomComponent } from '@windmillcode/wml-components-base';
import { WMLProfileDetailItem } from '@windmillcode/profile-detail-card';


// material
import { PurchaseEventComponent, PurchaseEventComponentParams } from '../purchase-event/purchase-event.component';

@Component({
  selector: 'eventlist',
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush

})
export class EventlistComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public eventsService:EventsService,
    public automateService:AutomateService,
    public wmlNotifyService:WmlNotifyService,
  ) { }
  classPrefix = this.utilService.generateClassPrefix('Eventlist')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  eventList = []


  errorNote =()=>  this.baseService.generateWMLNote("eventlist.wmlNotify.loadRecordsError",WmlNotifyBarType.Error)


  openDialog = (card)=>{
    this.baseService.popupParams.cpnt = PurchaseEventComponent
    this.baseService.popupParams.meta = new PurchaseEventComponentParams({
      mainImgSrc:card.item.src,
      mainImgAlt: card.item.title,
      eventTitle:card.item.title,
    })
    this.baseService.togglePopupSubj.next(true)
  }
  scrollBottomPaginationParamsPopulateItems = (apiResult:GetEventsSuccessAPIResponseBody)=>{
    let uiResult = getEventsSuccess(apiResult)
    this.eventList.push(...uiResult.events)
    this.eventList = this.eventList.map((event)=>{

      return {
        item:new WMLProfileDetailItem({
          src:event.imgSrc,
          title:event.title,
          subtitle:event.desc,
        }),
        click:this.openDialog
      }
    })
    this.scrollBottomPaginationParams.stopMakingAPICalls = !uiResult.hasMoreItems
    this.cdref.detectChanges()
  }

  scrollBottomPaginationParamsNotifyError = (err,failedApiCalls)=>{
    if(failedApiCalls > 5){
      let finalErrorNote = this.errorNote();
      finalErrorNote.custom.meta.i18nKey ="eventlist.wmlNotify.stopTryingToLoadRecordsError"
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
      altHttpRequest:this.eventsService.getEvents(true)
    },
    elementToDetermineXFromBottom:this.automateService.documentQuerySelector("main")
  });

  ngOnInit(){

  }

  ngAfterViewInit(){
    this.automateService.purchaseEvent.fillOutFormAndSubmit()

  }
  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
