// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';




// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { ENV } from '@env/environment';
import { WMLDropdownIteratorParams } from '../wml-dropdown/wml-dropdown.component';
import { addCustomComponent } from '@windmillcode/wml-components-base';


@Component({

  selector: 'wml-dropdown-iterator',
  templateUrl: './wml-dropdown-iterator.component.html',
  styleUrls: ['./wml-dropdown-iterator.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class WmlDropdownIteratorComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

  ) { }

  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlDropdownIterator')
  @Input('params') params = new WMLDropdownIteratorParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  @ViewChild("customOption",{read:ViewContainerRef,static:true}) customOption!:ViewContainerRef;

  ngUnsub= new Subject<void>()

  ngOnInit(): void {
    this.renderOption()
  }

  renderOption = ()=>{
    addCustomComponent(
      this.customOption,
      this.params.cpnt,
      this.params.params
    )
    this.cdref.detectChanges()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
