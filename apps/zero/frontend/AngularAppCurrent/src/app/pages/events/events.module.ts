import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsMainComponent } from './events-main/events-main.component';
import { SharedModule } from '@shared/shared.module';
import { PurchaseEventComponent } from './purchase-event/purchase-event.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EventsMainComponent,
    PurchaseEventComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class EventsModule { }
