import { HttpParams } from '@angular/common/http';
import { environment as env } from '@environment/environment';
import { WMLEndpoint } from '@windmillcode/wml-components-base';


let traverseClassAndRemoveAutomationForProduction = (obj,stack=[])=>{
  Object.entries(obj).forEach(entry=>{
    let [key,value] = entry
    if(value instanceof Object){
      stack.push(obj[key])
      traverseClassAndRemoveAutomationForProduction(value,stack)
      stack = []
    }
    else{
      if(key ==="automate"){
        stack[stack.length-1].automate = false
      }
    }
  })
}

class Configs {

  endpointMsgCodes = {
    'success':'OK',
    'error':'ERROR',
  }
  allowedDomains=[
    "https://www.linkedin.com/",
    "https://nibls-flask-backend-0.azurewebsites.net/"
  ];

  app={
    backendHealthCheck:() =>this.backendDomain0 + "/healthz/"
  }
  // backendDomain0 = "http://127.0.0.1:5000"
  backendDomain0 ="https://example.com:5000"
  classPrefix= {
    certsMain:"CertsMain",
    footer:"Footer",
    mediaMain:"MediaMain",
    teamMain:"TeamMain",
    app:"App"
  }

  mediaMain = {
    articlesEndpoint:() =>this.backendDomain0  + "/news"
  }

  nav = {
    urls:{
      home:"/",
      homeAlt:"/home",
      team:"/team",
      media:"/media",
      symbols:"/symbols",
      events:"/events",
      mall:"/shoppingMall",
      startURL:"/intro",
      signin:"auth/signin",
      profile:"/profile",
      register:"auth/register",
      privacyPolicy:"legal/privacy-policy",
      initialURL:"",
    },
    spotifyLoginEndpoint:() => this.backendDomain0 + "/spotify/login"
  }

  eventsMain = {
    metamaskRequestMessage:() => this.backendDomain0 + "/blockchain/metamask_request_message",
    metamaskVerifyMessage:() => this.backendDomain0  + "/blockchain/metamask_verify_message"
  }

  accountService ={
    updateProfileEndpoint:new WMLEndpoint({
      url:()=>this.backendDomain0 +"/auth/update_profile"
    })
  }

  events = {
    getEventsEndpoint:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/events/get_events",
      automate:true
    })
  }



  email = {
    sendEmailOnPurchasedTicketEndpoint:new WMLEndpoint({
      url:() => this.backendDomain0 + "/events/purchase_ticket",
      automate:true
    })
  }

  moralis ={
    sendETHToSourceWalletEndpoint: new WMLEndpoint({
      automate:true
    })
  }


  profileMain:any =(()=>{
    let obj = ["firstName","lastName","address","city","state","zipcode","country"]
    .map((controlName)=>{
      return [controlName+"FieldFormControlName",controlName]
    })
    obj= Object.fromEntries(obj)

    return obj
  })()

  eventList = {
    ticketQuantityFieldFormControlName:"ticketQuantity",
    eventTitleFieldFormControlName:"eventTitle",
    nameFieldFormControlName:"name",
    emailFieldFormControlName:"email",
    orgFieldFormControlName:"org",
    collegeFieldFormControlName:"college",
    socialMediaHandlesFieldFormControlName:"socialMediaHandles",
    playSportsFieldFormControlName:"playSports",
    investingStageFieldFormControlName:"investingStage",
    activeInvestorFieldFormControlName:"activeInvestor",
    linkedinProfileFieldFormControlName:"linkedinProfile",
    phoneNumberFieldFormControlName:"phoneNumber",
    termsFieldFormControlName:"terms",
  }

  signIn={
    field0:{
      emailFieldFormControlName:"email",
      passwordFieldFormControlName:"password"
    }
  }

  signUp={
    field0:{
      emailFieldFormControlName:"email",
      passwordFieldFormControlName:"password",
      confirmPasswordFieldFormControlName:"confirmPassword",
    },
    endpoint:new WMLEndpoint({
      url:()=>{
      let queryParams = new HttpParams()
        .set('p',"B2C_1_nibls-webapp-acctmgnt-signupsignin-0" )
        .set('client_id', "c3a61ac9-f5c2-4fb0-afc7-7c16246e1a67")
        .set("nonce", "defaultNonce")
        .set("redirect_uri",this.backendDomain0+"/auth/login_callback")
        .set("scope","openid offline_access")
        .set("response_type","code")
        .set("prompt","login")

      let url = "https://niblscoin.b2clogin.com/niblscoin.onmicrosoft.com/oauth2/v2.0/authorize?"+queryParams
      return url
      }
  })
    // endpoint:(()=>{
    //   let queryParams = new HttpParams()
    //     .set('client_id', "c3a61ac9-f5c2-4fb0-afc7-7c16246e1a67")
    //     .set("nonce", "defaultNonce")
    //     .set("redirect_uri","https://example.com:5000/auth/login_callback")
    //     .set("scope","openid offline_access user.readwrite")
    //     .set("response_type","code")
    //     .set("response_mode","query")
    //     .set("prompt","login")

    //   let url = "https://login.microsoftonline.com/6ec537e6-c82d-4caa-91a9-e7ba59ebf85a/oauth2/v2.0/authorize?"+queryParams
    //   return url
    // })()

  }

  spotify = {
    topOfTheLeagueUrl:"https://open.spotify.com/track/1IBF7vWulIl86PmjXWsahH",
    topOfTheLeagueTrackId:"0FXx9QxSklTZ3PTCMcgOzM",
    topOfTheLeagueURI:'spotify:track:1IBF7vWulIl86PmjXWsahH',
    getUsersPlaylistEndpoint:() => this.backendDomain0 + "/spotify/get_users_playlists",
    postItemToPlaylistEndpoint:()=> this.backendDomain0 + "/spotify/add_item_to_playlist",
  }

  constructor(){
    traverseClassAndRemoveAutomationForProduction(this)
  }
}




class DefaultConfigs extends Configs  {


  constructor(){
    super()
    this.backendDomain0 = "https://nibls-flask-backend-0.azurewebsites.net"

    traverseClassAndRemoveAutomationForProduction(this)
  }
}

export let ENV = !env.production    ?  new Configs() : new DefaultConfigs()


