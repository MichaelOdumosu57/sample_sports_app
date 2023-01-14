// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';




// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc
import { WMLButton } from '@windmillcode/wml-components-base';
import { FormArray, FormControl } from '@angular/forms';


@Component({

  selector: 'wml-options',
  templateUrl: './wml-options.component.html',
  styleUrls: ['./wml-options.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class WmlOptionsComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

  ) { }

  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlOptions')

  @Input('params') params: WMLOptionsParams = new WMLOptionsParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }


  updateFormArray= ()=>{
    this.params.formArray.clear()
    this.params.chosen
    .forEach((chosen)=>{
      let result = this.params.updateFormArrayPredicate(chosen)
      this.params.formArray.push(new FormControl(result))
    })
    this.params.formArray.markAsDirty()
    this.cdref.detectChanges()
  }


  toggleChosen = (btn:WMLOptionsButton)=>{
    btn.isChosen = !btn.isChosen
    btn.isChosen? btn.updateClassString(this.classPrefix('MainBtn1')): btn.updateClassString(null,"clear")
    if(btn.isChosen){
      this.params.chosen.push(btn)
      if(this.params.chosen.length>this.params.limit){
        let rmvdBtn = this.params.chosen.shift()
        rmvdBtn.updateClassString(null,"clear")
        rmvdBtn.isChosen = false
      }
    }
    else{
      this.params.chosen = this.params.chosen.filter(option=>option !== btn)
    }
    this.cdref.detectChanges()


    if(this.params.formArray){
      this.updateFormArray()
    }
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class WMLOptionsParams {
  constructor(params:Partial<WMLOptionsParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  chosen:WMLOptionsParams["options"]=[]
  options:WMLOptionsButton[]= []
  limit= Infinity
  formArray:FormArray
  updateFormArrayPredicate:(WMLOptionsButton) => any =(val)=> val
}

export class WMLOptionsButton extends WMLButton {
  constructor(params:Partial<WMLOptionsButton>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  isChosen: boolean = false
}
