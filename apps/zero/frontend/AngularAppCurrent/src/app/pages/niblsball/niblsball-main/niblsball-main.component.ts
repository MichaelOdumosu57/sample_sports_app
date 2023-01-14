// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { WMLImage } from '@windmillcode/wml-components-base';
import { EventsService, GetNiblsBallEventsSuccessUIBody } from '@shared/services/event/event.service';
import { updateClassString } from '@core/utility/common-utils';


@Component({

  selector: 'niblsball-main',
  templateUrl: './niblsball-main.component.html',
  styleUrls: ['./niblsball-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class NiblsballMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public eventService:EventsService,
  ) { }

  classPrefix = this.utilService.generateClassPrefix('NiblsballMain')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  backdropImg = new WMLImage({
    src:"assets/media/shared/poster_0.jpg",
    alt:"niblsBallMain.backdropImgAlt"
  })

  season:NiblsBallMainEvent[] =[]
  getEvents = ()=>{
    return  this.eventService.getNiblsBallEvents$
    .pipe(
      takeUntil(this.ngUnsub),
      tap((res:GetNiblsBallEventsSuccessUIBody)=>{
        this.season = res.events
        .map((event)=>{

          let newEvent =new NiblsBallMainEvent(event)
          newEvent.click = (team,spread)=>{
            if(newEvent.userSelection !== team + " "+ spread){
              newEvent.userSelection = team + " "+ spread
              if(team === newEvent.homeTeam){
                newEvent.updateHomeSpreadClassString(this.classPrefix('Pod0BtnHover0'),"add")
                newEvent.updateAwaySpreadClassString(this.classPrefix('Pod0BtnHover0'),"remove")
              }
              else{
                newEvent.updateAwaySpreadClassString(this.classPrefix('Pod0BtnHover0'),"add")
                newEvent.updateHomeSpreadClassString(this.classPrefix('Pod0BtnHover0'),"remove")
              }
            }
            else{
              newEvent.userSelection = null
              if(team === newEvent.homeTeam){
                newEvent.updateHomeSpreadClassString(this.classPrefix('Pod0BtnHover0'),"remove")
              }
              else{
                newEvent.updateAwaySpreadClassString(this.classPrefix('Pod0BtnHover0'),"remove")
              }
            }

          }
          newEvent.updateHomeSpreadClassString(this.classPrefix('Pod0Btn0'))
          newEvent.updateAwaySpreadClassString(this.classPrefix('Pod0Btn0'))

          return newEvent
        })
        this.cdref.detectChanges()
      })
    )
  }
  ngOnInit(): void {

    this.getEvents().subscribe()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

class NiblsBallMainEvent  {
  constructor(params:Partial<NiblsBallMainEvent>={}){

    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  click?:Function
  awayTeam: string;
  homeTeam: string;
  matchTime: string;
  spreadAgainst: string;
  spreadFor: string;
  displayMatchTime:string
  userSelection?:string
  readonly spreadHomeClass:string = ""
  spreadHomeClasses:Array<string> =[]
  updateHomeSpreadClassString=updateClassString(this,"spreadHomeClass","spreadHomeClasses")
  readonly spreadAwayClass:string = ""
  spreadAwayClasses:Array<string> =[]
  updateAwaySpreadClassString=updateClassString(this,"spreadAwayClass","spreadAwayClasses")
}
