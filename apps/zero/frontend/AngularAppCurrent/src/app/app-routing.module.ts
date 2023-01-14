import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserUtils } from '@azure/msal-browser';

const routes: Routes = [
  // {
  //   path:"",
  //   loadChildren:() => import("./pages/home/home.module").then(m=>m.HomeModule)
  // },
  {
    path:"",
    loadChildren: () => import("./layouts/default/default.module").then(m=>m.DefaultModule),
  },
  {
    path: '**',
    loadComponent: () => import("./core/not-found/not-found.component").then(m =>m.NotFoundComponent)
  },
];


@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      // Don't perform initial navigation in iframes or popups
     initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' // Set to enabledBlocking to use Angular Universal
    }

  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
