import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegiateSignupMainComponent } from './collegiate-signup-main/collegiate-signup-main.component';

const routes: Routes = [
  { path: "", component:CollegiateSignupMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegiateSignupRoutingModule { }
