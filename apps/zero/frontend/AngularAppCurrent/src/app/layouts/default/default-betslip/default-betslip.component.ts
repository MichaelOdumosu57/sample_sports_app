// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc
import { WMLUIProperty } from '@windmillcode/wml-components-base';


@Component({

  selector: 'default-betslip',
  templateUrl: './default-betslip.component.html',
  styleUrls: ['./default-betslip.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class DefaultBetslipComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('DefaultBetslip')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  betSlipTab = new WMLUIProperty({
    text:"defaultBetslip.betSlipTabText",
    value:"Content 1"
  })
  myBetsTab = new WMLUIProperty({
    text:"defaultBetslip.myBetsTabText",
    value:"Content 2"
  })
  tabs = [
    this.betSlipTab,
    this.myBetsTab,
  ]



  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



