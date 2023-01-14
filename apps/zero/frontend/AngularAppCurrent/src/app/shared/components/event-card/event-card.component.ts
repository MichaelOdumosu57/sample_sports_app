// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc


@Component({
  
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class EventCardComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService
    
  ) { }
  
  classPrefix = this.utilService.generateClassPrefix('EventCard')
  
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
