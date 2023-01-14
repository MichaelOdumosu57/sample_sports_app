// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';




// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@env/environment';
import { WMLCustomComponent, WMLUIProperty } from '@windmillcode/wml-components-base';
import { WmlSampleTabBodyComponent, WmlSampleTabBodyComponentParams } from '../wml-sample-tab-body/wml-sample-tab-body.component';


@Component({

  selector: 'wml-tabs',
  templateUrl: './wml-tabs.component.html',
  styleUrls: ['./wml-tabs.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class WmlTabsComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

  ) { }

  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlTabs')
  @Input('params') meta = new WMLTabsParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
    this.updateTabs()
  }


  updateTabs = ()=>{
    this.meta.tabs.forEach((tab,index0)=>{
      tab.header.wmlTabHeader.click = this.toggleSelectedTab
    })
    this.toggleSelectedTab(this.meta.tabs[0])
  }

  toggleSelectedTab = (targetTab:WMLTab) => {

    this.meta.tabs.forEach((tab)=>{
      if(targetTab === tab){
        tab.isChosen = true
        if(tab.header.wmlTabHeader){
          tab.header.wmlTabHeader.updateClassString(null,"clear")
          tab.header.wmlTabHeader.updateClassString(tab.header.wmlTabHeader.isChosenClass)

        }
      }
      else{
        tab.isChosen  = false
        if(tab.header.wmlTabHeader){
          tab.header.wmlTabHeader.updateClassString(null,"clear")
          tab.header.wmlTabHeader.updateClassString(tab.header.wmlTabHeader.isNotChosenClass)


        }
      }
    })
    this.cdref.detectChanges()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class WMLTabsParams {
  constructor(params:Partial<WMLTabsParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  tabs:Array<WMLTab> = []
}

export class WMLTab {
  constructor(params:Partial<WMLTab>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  isChosen:boolean = false
  header:{
    type:"custom" |"wmlTabHeader",
    wmlTabHeader?:WMLTabHeader,
    custom?:WMLCustomComponent
  } = {
    type:"wmlTabHeader",
    wmlTabHeader:new WMLTabHeader()
  }
  body = new WMLCustomComponent({
    cpnt:WmlSampleTabBodyComponent,
    params:new WmlSampleTabBodyComponentParams()
  })
}

export class WMLTabHeader extends WMLUIProperty{
  constructor(params:Partial<WMLTabHeader>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.updateClassString("WmlTabsPod0Item0")
  }
  isChosenClass ="WmlTabsPod0Item2"
  isNotChosenClass="WmlTabsPod0Item0"
  icon = new WMLUIProperty({
    isPresent:false
  })
  override click:(val?:any)=>void
}

