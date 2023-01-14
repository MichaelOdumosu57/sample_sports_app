// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';




// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@env/environment';
import { WmlDropdownSampleParams } from '../wml-dropdown/wml-dropdown.component';


@Component({

  selector: 'wml-dropdown-sample',
  templateUrl: './wml-dropdown-sample.component.html',
  styleUrls: ['./wml-dropdown-sample.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class WmlDropdownSampleComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

  ) { }

  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlDropdownSample')
  @Input("params") params = new WmlDropdownSampleParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
