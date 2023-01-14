import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsMainComponent } from './events-main/events-main.component';

const routes: Routes = [
  { path: "", component:EventsMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
