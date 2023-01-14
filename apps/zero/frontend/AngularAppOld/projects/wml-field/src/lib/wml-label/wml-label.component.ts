// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { Subject } from 'rxjs';
import { delay, takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLField } from '../wml-field/wml-field.component';


// reactive-forms
import { AbstractControl } from '@angular/forms';
import { WMLWrapper } from '@windmillcode/wml-components-base';

@Component({
  selector: 'wml-label',
  templateUrl: './wml-label.component.html',
  styleUrls: ['./wml-label.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class WmlLabelComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

  ) { }

  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlLabel')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  @Input('params') meta!: WmlLabelParams
  formControl!:AbstractControl
  displayErrors:string[] = []

  ngOnInit(): void {
    this.formControl = this.meta.wmlField.field.parentForm.controls[this.meta.wmlField.field.formControlName]
    this.listenForParentFormStatusChanges().subscribe()
  }

  private listenForParentFormStatusChanges() {
    return this.meta.wmlField.field.parentForm
      .statusChanges
      .pipe(
        takeUntil(this.ngUnsub),
        delay(100),
        tap((res) => {

          this.displayErrors = this.meta.toggleErrors(this.formControl);
          this.cdref.detectChanges();
        })
      )
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class WmlLabelParams extends WMLWrapper{
  constructor(params:Partial<WmlLabelParams>={}){
    super(params)
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.labels = this.labels.map((labelLine)=>{
      return labelLine.map((label)=>{
        label.type  = label.type || 'default'
        label.isPresent = (label.isPresent === undefined ? true :label.isPresent )
        return label
      })
    })
  }

  type: 'label' | 'error'  = 'label'
  isPresent:boolean = true
  errorMsgs:{
    [k:string]:string
  } = {}
  labels:{
    type?:"default" | "error" | 'required',
    value:string
    isPresent?:boolean
  }[][] = [
    [
      {
        type:"required",
        value:"*"
      },
      {
        type:"default",
        value:"My Label"
      }
    ]
  ]
  toggleErrors(formControl:AbstractControl){
    return  Object.keys(formControl.errors ?? {})
    .map((key)=>{
      return this.errorMsgs[key]
    })
  }
  wmlField!:WMLField
}
