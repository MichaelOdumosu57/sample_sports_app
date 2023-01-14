import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "signin",
    loadComponent: () => import('./sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path:"register",
    loadComponent: () => import('./sign-up/sign-up.component').then(m => m.SignUpComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
