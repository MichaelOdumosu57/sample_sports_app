import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MallMainComponent } from './mall-main/mall-main.component';

const routes: Routes = [
  { path: "", component:MallMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MallRoutingModule { }
