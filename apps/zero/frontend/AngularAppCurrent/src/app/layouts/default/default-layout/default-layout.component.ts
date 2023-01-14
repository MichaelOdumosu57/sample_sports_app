// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc
import { WMLTabsParams } from '@windmillcode/wml-tabs';

@Component({
  selector: 'default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DefaultLayoutComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('DefaultLayout')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()


  betSlipTab = this.baseService.generateWmlTab("defaultBetslip.betSlipTabText",true)
  myBets = this.baseService.generateWmlTab("defaultBetslip.myBetsTabText")

  betSlip = new WMLTabsParams({
    tabs:[
      this.betSlipTab,
      this.myBets,
    ]
  })

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
