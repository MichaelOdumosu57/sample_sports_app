// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';
import { AutomateService } from '@helpers/automation/automation/automation.service';
import { EventsService } from '@shared/services/event/event.service';

// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@app/core/config/configs';



import { WMLButton } from '@windmillcode/wml-components-base';


import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { CalendarView,CalendarEventAction, CalendarEventTimesChangedEvent } from '@angular-calendar';
import { CalendarEvent } from 'calendar-utils';
import { MwlCalendarViewParams } from 'projects/angular-calendar/src/modules/common/util';

class EventsCalendarColor {
  primary!:string
  secondary!:string
}


const colors: Record<string, EventsCalendarColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};



class EventsCalendarBtn extends WMLButton {
  constructor(params){
    super(params);
  }
  mwlCalendarViewParams: MwlCalendarViewParams
  viewDateChange?:Function


}


@Component({
  selector: 'events-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class EventsCalendarComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public automateService:AutomateService,
    public eventsService:EventsService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('EventsCalendar')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()



  ngOnInit(){
    this.eventsService.getEvents()
    .pipe(
      takeUntil(this.ngUnsub),
      tap(console.log)
    )
    .subscribe()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }



  prevBtn = new EventsCalendarBtn({
    value:"eventsCalendar.prevBtn.value",
    viewDateChange:this.closeOpenMonthViewDay,
    mwlCalendarViewParams:new MwlCalendarViewParams({
      previousView:true
    })
  })
  currentBtn = new EventsCalendarBtn({
    value:"eventsCalendar.currentBtn.value",
    mwlCalendarViewParams:new MwlCalendarViewParams({
      todayView:true
    })
  })
  nextBtn = new EventsCalendarBtn({
    value:"eventsCalendar.nextBtn.value",
    viewDateChange:this.closeOpenMonthViewDay,
    mwlCalendarViewParams:new MwlCalendarViewParams({
      nextView:true
    })
  })

  monthBtn =  new EventsCalendarBtn({
    value: "eventsCalendar.monthBtn.value",
    click:()=> this.setView(CalendarView.Month)
  })
  weekBtn =  new EventsCalendarBtn({
    value: "eventsCalendar.weekBtn.value",
    click: ()=> this.setView(CalendarView.Week)
  })
  dayBtn = new EventsCalendarBtn({
    value: "eventsCalendar.dayBtn.value",
    click:  ()=> this.setView(CalendarView.Day)
  })

  calendarNavBtns = [
    this.prevBtn,
    this.currentBtn,
    this.nextBtn
  ]

  calendarViewBtns = [
    this.monthBtn,
    this.weekBtn,
    this.dayBtn
  ]





  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events:CalendarEvent[] = [ //CalendarEvent
    {
      start: subDays(startOfDay(new Date()), 0),
      end: addDays(new Date(), 0),
      title: 'A 3 day event',
      color: { ...colors['red'] },
      actions: this.actions,
      allDay: true,

    },

  ];

  activeDayIsOpen: boolean = true;



  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    console.log("Fire")
  }


  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


}
