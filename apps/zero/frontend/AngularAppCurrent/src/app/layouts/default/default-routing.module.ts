import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';



const routes: Routes = [
  {
    path: "",
    component:DefaultLayoutComponent,
    children:[
      // environment.production ? {
      //   path:"",
      //   redirectTo:"events",
      //   pathMatch:"full"
      // }:
      {
        path:"",
        loadChildren:() => import("../../pages/home/home.module").then(m=>m.HomeModule)
      },
      {
        path:"profile",
        loadChildren:() => import("../../pages/profile/profile.module").then(m=>m.ProfileModule)
      },
      {
        path: 'shoppingMall',
        loadChildren: () => import('../../pages/mall/mall.module').then(m => m.MallModule),
      },
      {
        path: 'niblsball',
        loadChildren: () => import('../../pages/niblsball/niblsball.module').then(m => m.NiblsballModule),
      },
      {
        path: 'events',
        loadChildren: () => import('../../pages/events/events.module').then(m => m.EventsModule),
      },
      {
        path: 'collegiate',
        children:[
          {
            'path':'signup',
            loadChildren: () => import('../../pages/collegiate-signup/collegiate-signup.module').then(m => m.CollegiateSignupModule),
          }
        ],
      },

      {
        path:"legal",
        children:[
          {
            path:"privacy-policy",
            loadComponent: () => import("../../pages/legal/privacy-policy/privacy-policy.component").then(m=>m.PrivacyPolicyComponent)
          },
          {
            path:"member-protection",
            loadComponent: () => import("../../pages/legal/member-protection/member-protection.component").then(m=>m.MemberProtectionComponent)
          }
        ]
      },
    ]
  },


];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
