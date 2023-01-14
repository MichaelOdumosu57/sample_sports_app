// angular
import { ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
// services
import { BaseService } from '@core/base/base.service';

// misc
import { ENV } from '@core/config/configs';
import { LinkedList } from '@core/utility/utils';
import { WMLButton } from '@windmillcode/wml-components-base';
import { Subject, takeUntil, tap } from 'rxjs';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(
    public baseService:BaseService,
    public accountService:AccountService,
    public router:Router,
  ) { }

  mainAudio = (()=>{
    let audio = new Audio("assets/media/nav_1.mp3")
    audio.loop = true;
    return audio
  })()
  mainAudioToggleOptions= (()=>{
    let on = {
      value:"nav.topLeft.pauseSiteAudio",
      isPlaying:true
    }
    let off = {
      value:"nav.topLeft.playSiteAudio",
      isPlaying:false
    }
    let linkedList:LinkedList<NavIsPlaying> = new LinkedList(on);
    linkedList.addNode(off);
    return linkedList

  })();
  mainAudioCurrentOption = this.mainAudioToggleOptions.getHead()

  toggleMainAudio = (audioBtn:WMLButton)=>()=>{
    let shouldPlay = this.mainAudioCurrentOption.val.isPlaying

    if(shouldPlay){
      this.mainAudio.play();
    }
    else{
      this.mainAudio.pause();
    }
    this.baseService.playSiteAudioSubj.next(
      this.mainAudioCurrentOption.val.isPlaying
    )
    audioBtn.value = this.mainAudioCurrentOption.val.value
    if(this.mainAudioCurrentOption.next === null){
      this.mainAudioCurrentOption = this.mainAudioToggleOptions.getHead()
    }
    else{
      this.mainAudioCurrentOption = this.mainAudioCurrentOption.next
    }
  }

  clickSpotifyBtn =()=>{
    window.location.href = ENV.spotify.topOfTheLeagueUrl
  }
  signOut=()=>{
    this.accountService.signOut()
    this.router.navigateByUrl(ENV.nav.urls.home)
  }

  listerForLoginChanges=(
    targetArray:Array<Required<{isPresent:boolean}>>,
    ngUnsub:Subject<void>,
    cdref:ChangeDetectorRef,
  )=>{
    return this.accountService.profileUpdatedSubj
    .pipe(
      takeUntil(ngUnsub),
      tap(()=>{

        targetArray
        .forEach((route,index0)=>{
          let {isPopulated} =this.accountService.currentProfile
          route.isPresent = [!isPopulated,isPopulated,isPopulated][index0]
        })
        cdref.detectChanges()

      })
    )

  }
}


export class NavIsPlaying {
  constructor(params:Partial<NavIsPlaying>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  value!:string
  isPlaying!:boolean
}
