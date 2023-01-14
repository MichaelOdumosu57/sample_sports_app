import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule),
  },
  {
    path: 'team',
    loadChildren: () => import('./pages/team/team.module').then(m => m.TeamModule),
  },
  {
    path: 'media',
    loadChildren: () => import('./pages/media/media.module').then(m => m.MediaModule),
  },
  {
    path: 'symbols',
    loadChildren: () => import('./pages/symbols/symbols.module').then(m => m.SymbolsModule),
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then(m => m.EventsModule),
  },
  {
    path: 'shoppingMall',
    loadChildren: () => import('./pages/mall/mall.module').then(m => m.MallModule),
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  // },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path:"legal",
    children:[
      {
        path:"privacy-policy",
        loadComponent: () => import("./pages/legal/privacy-policy/privacy-policy.component").then(m=>m.PrivacyPolicyComponent)
      },
      {
        path:"member-protection",
        loadComponent: () => import("./pages/legal/member-protection/member-protection.component").then(m=>m.MemberProtectionComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import("./core/not-found/not-found.component").then(m =>m.NotFoundComponent)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
