import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NiblsballMainComponent } from './niblsball-main/niblsball-main.component';

const routes: Routes = [
  { path: "", component:NiblsballMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NiblsballRoutingModule { }
