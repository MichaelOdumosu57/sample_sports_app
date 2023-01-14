// angular
import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, Input, OnInit } from '@angular/core';

// reactive forms
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WMLField } from '@windmillcode/wml-field';

@Component({
  selector: 'wml-input',
  templateUrl: './wml-input.component.html',
  styleUrls: ['./wml-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WmlInputComponent),
      multi: true
    }
  ]
})
export class WmlInputComponent implements ControlValueAccessor {

  @Input('meta') meta: WmlInputParams = new WmlInputParams();
  constructor() { }

  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlInput')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);


  ngOnInit(): void {
  }

  triggerChange(evt: any) {
    this.writeValue(evt.target.value)
  }

  onChange: Function = () => { }
  onTouch: Function = () => { }


  writeValue(val: any) {
    if(val === ""){
      val = null
    }
    this.onChange(val)
    this.onTouch(val)
  }

  registerOnChange(fn: Function) {
    this.onChange = fn
  }

  registerOnTouched(fn: Function) {
    this.onTouch = fn
  }


}

export class WmlInputParams {
  constructor(params: Partial<WmlInputParams> = {}) {
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  type: "range"| "input" | "number" | "password" | "email" | "tel" | "textarea" | "checkbox" = "input";
  wmlField: WMLField = new WMLField()
  checkboxDesc:string
}
