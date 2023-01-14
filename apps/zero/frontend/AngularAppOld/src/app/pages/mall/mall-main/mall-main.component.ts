// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@app/core/config/configs';

@Component({
  selector: 'mall-main',
  templateUrl: './mall-main.component.html',
  styleUrls: ['./mall-main.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush

})
export class MallMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('MallMain')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()



  ngAfterViewInit(): void {
    this.initECWIDStore()
  }

  initECWIDStore = ()=>{
    
    xProductBrowser(
      "categoriesPerRow=3",
      "views=grid(20,3) list(60) table(60)",
      "categoryView=grid",
      "searchView=list",
      "id=my-store-80007263"
    );
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
