import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileMainComponent } from './profile-main/profile-main.component';

const routes: Routes = [
  {
    path: "",
    component:ProfileMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
