// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';




// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@env/environment';


@Component({

  selector: 'wml-sample-tab-body',
  templateUrl: './wml-sample-tab-body.component.html',
  styleUrls: ['./wml-sample-tab-body.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class WmlSampleTabBodyComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

  ) { }

  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlSampleTabBody')
  @Input('params') params:WmlSampleTabBodyComponentParams
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
    
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class WmlSampleTabBodyComponentParams  {
  constructor(params:Partial<WmlSampleTabBodyComponentParams>={}){
    WmlSampleTabBodyComponentParams.index++
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  static index =0
  text:string ="my component work "+ WmlSampleTabBodyComponentParams.index
}
