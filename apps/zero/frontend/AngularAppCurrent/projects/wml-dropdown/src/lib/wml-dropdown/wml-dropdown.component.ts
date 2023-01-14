// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, OnInit, Renderer2 } from '@angular/core';




// rxjs
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@env/environment';
import { WMLCustomComponent, WMLUIProperty } from '@windmillcode/wml-components-base';
import { Input } from '@angular/core';
import { WmlDropdownSampleComponent } from '../wml-dropdown-sample/wml-dropdown-sample.component';
import { AutomateService } from '@helpers/automation/automation/automation.service';


@Component({

  selector: 'wml-dropdown',
  templateUrl: './wml-dropdown.component.html',
  styleUrls: ['./wml-dropdown.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class WmlDropdownComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public el:ElementRef,
    public automateService:AutomateService,
    public renderer2:Renderer2
  ) { }


  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlDropdown')
  @Input('params') params = new WMLDropdownParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()






  ngOnInit(): void {

    // this.updateIsPresent().subscribe()


  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class WMLDropdownParams extends WMLUIProperty {
  constructor(params:Partial<WMLDropdownParams>={}){
    super();
    let isPresentSubj= (()=>{
      let subj = new BehaviorSubject(false)
      subj

      return subj
    })()
    Object.assign(
      this,
      {
        isPresentSubj,
        ...params,
      }
    )
  }
  isPresentSubj:BehaviorSubject<boolean>
  options:Array<WMLDropdownIteratorParams> = []
}

export class WMLDropdownIteratorParams extends WMLCustomComponent {
  constructor(params:Partial<WMLDropdownIteratorParams>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  override cpnt = WmlDropdownSampleComponent
  override meta = new WmlDropdownSampleParams()
}

export class WmlDropdownSampleParams extends WMLUIProperty {
  constructor(params:Partial<WmlDropdownSampleParams>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}
