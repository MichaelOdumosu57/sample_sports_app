import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsMainComponent } from './events-main/events-main.component';
import { SharedModule } from '@shared/shared.module';
import { EventsCalendarComponent } from './events-calendar/events-calendar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule } from '../../../../projects/angular-calendar/src';
import { EventlistComponent } from './eventlist/eventlist.component';
import { ProfileDetailCardModule } from '@windmillcode/profile-detail-card';
import { PurchaseEventComponent } from './purchase-event/purchase-event.component';


// material modules


@NgModule({
  declarations: [
    EventsMainComponent,
    EventsCalendarComponent,
    EventlistComponent,
    PurchaseEventComponent
  ],
  imports: [
    ProfileDetailCardModule,
    CommonModule,
    EventsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    CalendarModule,
    FormsModule,
    FlatpickrModule.forRoot(),
  ]
})
export class EventsModule { }
