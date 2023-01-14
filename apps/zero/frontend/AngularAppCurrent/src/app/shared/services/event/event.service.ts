import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@env/environment';
import { UtilityService } from '@core/utility/utility.service';
import { AutomateService } from '@helpers/automation/automation/automation.service';
import { iif, map, of, shareReplay, tap } from 'rxjs';
import { formatDate } from '@angular/common';
import { transformFromCamelCaseToSnakeCase } from '@core/utility/common-utils';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(
    public http: HttpClient,
    public utilService:UtilityService,
    public automateService:AutomateService
  ) {}

  getEvents = (raw = false) => {

    return iif(
      ()=>ENV.events.getEventsEndpoint.automate,
      of(this.automateService.eventsService.getEventsMock()),
      this.http
        .post(ENV.events.getEventsEndpoint.url(), {},{observe: 'response'})
        // @ts-ignore
        .pipe(raw ? tap() : map(getEventsSuccess))
    )

  };


  getNiblsBallEvents  = (raw =false)=>{
    return iif(
      ()=>ENV.events.getNiblsBallEventsEndpoint.automate,
      of(null),
      this.http
        .get(ENV.events.getNiblsBallEventsEndpoint.url())
        // @ts-ignore
        .pipe(
          shareReplay(),
          raw ? tap() : map(getNiblsBallEventsSuccess))
    )

  }
  getNiblsBallEvents$ = this.getNiblsBallEvents()

  sendEmailOnPurchasedTicket = (uiBody, raw = false) => {

    let apiBody = sendEmailOnPurchasedTicketLoad(
      uiBody
    );

    return iif(
      ()=>ENV.email.sendEmailOnPurchasedTicketEndpoint.automate,
      of(),
      this.http
        .post(ENV.email.sendEmailOnPurchasedTicketEndpoint.url(), apiBody)
        .pipe(raw ? tap() : map(sendEmailOnPurchasedTicketSuccess))
    )

  };
}

let getNiblsBallEventsSuccess= (apiBody:GetNiblsBallEventsSuccessAPIBody)=>{
  let uiBody = new GetNiblsBallEventsSuccessUIBody({
    events:apiBody.data.map((e:any)=>{
      e.spreadAgainst = (-parseFloat(e.spreadFor)).toFixed(2)
      e.displayMatchTime = formatDate(e.matchTime,"EEEE, MMM d, y, h:mma","en")
      return e
    })
  })
  return uiBody
}


export class GetNiblsBallEventsSuccessUIBody {
  constructor(params:Partial<GetNiblsBallEventsSuccessUIBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  events:Array<GetNiblsBallEventsSuccessAPIBody["data"][number]  &{
    displayMatchTime:string
  }>
}
class GetNiblsBallEventsSuccessAPIBody {
  constructor(params:Partial<GetNiblsBallEventsSuccessAPIBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  data: {
    awayTeam: string;
    homeTeam: string;
    matchTime: string;
    spreadAgainst: string;
    spreadFor: string;
  }[]
  msg:string
}
export let getEventsSuccess = (apiReponse: HttpResponse<GetEventsSuccessAPIResponseBody>|GetEventsSuccessAPIResponseBody) => {
  let uiBody = new GetEventsSuccessUIBody();
  let apiBody = apiReponse as GetEventsSuccessAPIResponseBody
  if (apiReponse instanceof HttpResponse) {
    apiBody =apiReponse.body
  }
  uiBody.events = apiBody.data.events.map((event) => {
    return {
      imgSrc: event.logo.url,
      title: event.name.html,
      desc: event.description.text,
      start: event.start.local,
      displayStartTime:formatDate(event.start.local,"EEEE, MMM d, y, h:mma","en"),
      end: event.end.local,
      href:event.url
    };
  });
  uiBody.hasMoreItems = apiBody.data.pagination.has_more_items;
  return uiBody;
};

let sendEmailOnPurchasedTicketLoad = (
  uiBody: SendEmailOnPurchasedTicketUIRequestBody
) => {
  let apiBody: SendEmailOnPurchasedTicketAPIRequestBody =
    new SendEmailOnPurchasedTicketAPIRequestBody();

  apiBody.data = Object.fromEntries(
    Object.entries(uiBody)
    .map((entry)=>{
      return [
        transformFromCamelCaseToSnakeCase(entry[0]),
        entry[1]
      ]
    })
  )

  return apiBody;
};

let sendEmailOnPurchasedTicketSuccess = (
  apiBody: SendEmailOnPurchasedTicketAPIResponseBody
) => {
  let uiBody: SendEmailOnPurchasedTicketUIResponseBody = apiBody;
  return uiBody;
};
export class SendEmailOnPurchasedTicketAPIRequestBody {
  constructor(params: Partial<SendEmailOnPurchasedTicketAPIRequestBody> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  data: {
    name: string;
    email: string;
    terms: boolean;
    org: string;
    college: string;
    socialMediaHandles: string;
    playSports: string;
    investingStage: string;
    activeInvestor: string;
    linkedinProfile: string;
    phoneNumber: string;
    event_title: string;
    ticket_quantity:number;
  };
}

export class SendEmailOnPurchasedTicketAPIResponseBody {
  constructor(params: Partial<SendEmailOnPurchasedTicketAPIResponseBody> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
}

export class SendEmailOnPurchasedTicketUIResponseBody {
  constructor(params: Partial<SendEmailOnPurchasedTicketUIResponseBody> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
}

export class SendEmailOnPurchasedTicketUIRequestBody {
  constructor(params: Partial<SendEmailOnPurchasedTicketUIRequestBody> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  ticketQuantity:number;
  eventTitle: string;
  name: string;
  email: string;
  terms: boolean;
  org: string;
  college: string;
  socialMediaHandles: string;
  playSports: string;
  investingStage: string;
  activeInvestor: string;
  linkedinProfile: string;
  phoneNumber: string;
  event_title: string;
}

export class GetEventsSuccessAPIResponseBody {
  constructor(params: Partial<GetEventsSuccessAPIResponseBody> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  data: {
    events: {
      capacity: number;
      capacity_is_custom: boolean;
      category_id: string;
      changed: string;
      created: string;
      currency: string;
      description: {
        html: string;
        text: string;
      };
      end: {
        local: string;
        timezone: string;
        utc: string;
      };
      facebook_event_id: null;
      format_id: string;
      hide_end_date: boolean;
      hide_start_date: boolean;
      id: string;
      inventory_type: string;
      invite_only: boolean;
      is_externally_ticketed: boolean;
      is_free: boolean;
      is_locked: boolean;
      is_reserved_seating: boolean;
      is_series: boolean;
      is_series_parent: boolean;
      listed: boolean;
      locale: string;
      logo: {
        aspect_ratio: string;
        crop_mask: {
          height: number;
          top_left: {
            x: number;
            y: number;
          };
          width: number;
        };
        edge_color: string;
        edge_color_set: boolean;
        id: string;
        original: {
          height: number;
          top_left: {
            x: number;
            y: number;
          };
          width: number;
        };
        url: string;
      };
      logo_id: string;
      name: {
        html: string;
        text: string;
      };
      online_event: boolean;
      organization_id: string;
      organizer_id: string;
      privacy_setting: string;
      published: string;
      resource_uri: string;
      shareable: boolean;
      show_colors_in_seatmap_thumbnail: boolean;
      show_pick_a_seat: boolean;
      show_remaining: boolean;
      show_seatmap_thumbnail: boolean;
      source: string;
      start: {
        local: string;
        timezone: string;
        utc: string;
      };
      status: string;
      subcategory_id: string;
      summary: string;
      tx_time_limit: number;
      url: string;
      venue_id: string;
      version: null;
    }[];
    pagination: {
      has_more_items: boolean;
      object_count: number;
      page_count: number;
      page_number: number;
      page_size: number;
    };
  };
  msg: string;
}
export class GetEventsSuccessUIBody {
  constructor(params: Partial<GetEventsSuccessUIBody> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  events: Array<{
    imgSrc: string;
    title: string;
    desc: string;
    start: string;
    end: string;
  }>;
  hasMoreItems = true;
}
