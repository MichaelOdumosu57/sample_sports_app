// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@app/core/config/configs';
import { addCustomComponent, WMLCustomComponent, WMLUIProperty } from '@windmillcode/wml-components-base';

@Component({
  selector: 'wml-popup',
  templateUrl: './wml-popup.component.html',
  styleUrls: ['./wml-popup.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class WmlPopupComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService
  ) { }
  classPrefix = this.utilService.generateClassPrefix('WmlPopup')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  @Input('params')params: WmlPopupComponentParams = new  WmlPopupComponentParams()
  @ViewChild("customPopup",{read:ViewContainerRef,static:true}) customPopup!:ViewContainerRef;

  ngOnInit(): void {
    this.updatePopup()
    this.params.updatePopup = this.updatePopup
  }
  closePopup=()=>{

  }

  updatePopup = ()=>{
    this.customPopup.clear()
    addCustomComponent(
      this.customPopup,
      this.params.cpnt,
      this.params.meta
    )
    this.cdref.detectChanges()
  }



  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class WmlPopupComponentParams extends WMLCustomComponent  {
  constructor(params:Partial<WmlPopupComponentParams>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  popup = new WMLUIProperty()
  updatePopup!:Function
  closePopup: Function
}
