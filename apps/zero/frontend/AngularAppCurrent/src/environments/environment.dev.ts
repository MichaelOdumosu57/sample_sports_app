import { HttpParams } from '@angular/common/http';
import { WMLEndpoint } from '@windmillcode/wml-components-base';
import { chain } from '@wagmi/core'

export let environment = {
  production: false
}
export let traverseClassAndRemoveAutomationForProduction = (obj,stack=[])=>{
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

export class DevEnv {

  endpointMsgCodes = {
    'success':'OK',
    'error':'ERROR',
  }

  errorCodes = {
    NOWALLETEXTENSION:1,
    NOTENOUGHFUNDS:2
  }

  allowedDomains=[
    "https://www.linkedin.com/",
    "https://nibls-flask-backend-0.azurewebsites.net/"
  ];

  app={
    backendHealthCheck:() =>this.backendDomain0 + "/healthz/"
  }

  // backendDomain0 ="https://example.com:5000"
  backendDomain0 =" https://127.0.0.1:5000"
  frontendDomain0 ="https://example.com:4200"
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

  azureAuth = {

  }

  nav = {
    urls:{
      home:"/",
      homeAlt:"/home",
      team:"/team",
      media:"/media",
      symbols:"/symbols",
      events:"/events",
      // mall:"/shoppingMall",
      mall:"https://store80007263.company.site/",
      startURL:"/intro",
      signin:"auth/signin",
      profile:"/profile",
      register:"auth/register",
      football:"/football",
      niblsball:"/niblsball",
      privacyPolicy:"legal/privacy-policy",
      membershipProtection:"legal/member-protection",
      collegiateSignUp:"collegiate/signup",
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
      url:()=>this.backendDomain0 +"/auth/update_profile",

    }),
  getNewAzureAccessToken:new WMLEndpoint({
      url:()=>this.backendDomain0+"/auth/get_new_delegate_access_token"
    }),
    logoutAPI:new WMLEndpoint({
      url:()=>this.backendDomain0+"/auth/logout"
    }),
  }

  collegiateService ={
    sumbitSponsorshipAcceleratorForm:new WMLEndpoint({
      url:()=>this.backendDomain0 + "/collegiate/submit_collegiate_sponsorship_accelerator_form",
    })
  }

  blockchainService = {
    chains:[chain.goerli]
  }

  events = {
    getEventsEndpoint:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/events/get_events",
      automate:true
    }),
    getNiblsBallEventsEndpoint :new WMLEndpoint({
      url:()=> this.backendDomain0 + "/events/get_niblsball_events",
    })
  }



  email = {
    sendEmailOnPurchasedTicketEndpoint:new WMLEndpoint({
      url:() => this.backendDomain0 + "/events/purchase_ticket",
    })
  }

  moralis ={
    sendETHToSourceWalletEndpoint: new WMLEndpoint({
      automate:false
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

  purchaseEvent = {
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

  collegiateSignupMain ={
    linkedinFieldFormControlName:"linkedin",
    phoneFieldFormControlName:"phone",
    emailFieldFormControlName:"email",
    customerStatusFieldFormControlName:"customerStatus",
    profileNameFieldFormControlName:"profileName",
    teamNameFieldFormControlName:"teamName",
    startupStageFieldFormControlName:"startupStage",
    employeeCountFieldFormControlName:"employeeCount",
    atheleticPlayersFieldFormControlName:"atheleticPlayers",
    socialMediaHandlesFieldFormControlName:"socialMediaHandles",
    fundingAmntFieldFormControlName:"fundingAmnt",
    preferredContactFieldFormControlName:"preferredContact",
    teamLogoFieldFormControlName:"teamLogo",
    pitchDeckFieldFormControlName:"pitchDeck"
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


  }

  spotify = {
    topOfTheLeagueUrl:"https://open.spotify.com/track/1IBF7vWulIl86PmjXWsahH",
    topOfTheLeagueTrackId:"0FXx9QxSklTZ3PTCMcgOzM",
    topOfTheLeagueURI:'spotify:track:1IBF7vWulIl86PmjXWsahH',
    getUsersPlaylistEndpoint:() => this.backendDomain0 + "/spotify/get_users_playlists",
    postItemToPlaylistEndpoint:()=> this.backendDomain0 + "/spotify/add_item_to_playlist",
  }

  constructor(){
    // traverseClassAndRemoveAutomationForProduction(this)
  }
}

export let ENV =   new DevEnv()


