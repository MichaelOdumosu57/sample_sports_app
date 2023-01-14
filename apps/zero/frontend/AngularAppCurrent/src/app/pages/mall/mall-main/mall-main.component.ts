// angular
import { ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';
import { ENV } from '@env/environment';


// rxjs
import { Subject, timer } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';



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
    window.location.href = ENV.nav.urls.mall
    // this.initECWIDStore().subscribe()
  }

  initECWIDStore = ()=>{

    return timer(0)
    .pipe(
      takeUntil(this.ngUnsub),
      tap(()=>{
        xProductBrowser(
          "categoriesPerRow=3",
          "views=grid(20,3) list(60) table(60)",
          "categoryView=grid",
          "searchView=list",
          "id=my-store-80007263"
        );
      })
    )

  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
