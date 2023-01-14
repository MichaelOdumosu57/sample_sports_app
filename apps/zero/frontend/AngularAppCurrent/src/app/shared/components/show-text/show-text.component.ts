// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc
import { WMLRoute } from '@windmillcode/wml-components-base';


@Component({

  selector: 'show-text',
  templateUrl: './show-text.component.html',
  styleUrls: ['./show-text.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class ShowTextComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('ShowText')

  @Input('params') params:ShowTextParams = new ShowTextParams();
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class ShowTextParams extends WMLRoute {
  constructor(params:Partial<ShowTextParams>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}
