// angular
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';


// misc
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { environment as env } from '@environment/environment';

// i18n
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// rxjs
import { Observable } from 'rxjs';

// ngrx
import { StoreModule } from '@ngrx/store';


// angular calendar
import { CalendarModule, DateAdapter } from '../../projects/angular-calendar/src';
import { adapterFactory } from '../../projects/angular-calendar/src/date-adapters/date-fns';




declare global {
  interface Window { ethereum:any }
  let Moralis:any
  let xProductBrowser:Function
  let MSAL:any
}


if (env.production) {

  Object.entries(console)
    .forEach((x, i) => {
      let [key, val] = x
      if (typeof val === "function") {
        ((console as any)[key] ) = () => { }
      }
    })
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

function waitFori18nextToLoad(translateService: TranslateService): () => Observable<any> {
  return () => {
    return translateService.use('en')
  }
}

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),

    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot({}, {})
  ],

  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: waitFori18nextToLoad,
      deps: [TranslateService],
      multi: true
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
