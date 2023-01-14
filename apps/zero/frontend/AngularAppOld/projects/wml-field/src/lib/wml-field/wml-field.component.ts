import { ChangeDetectionStrategy, ChangeDetectorRef, Component,  HostBinding,  Input, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { addCustomComponent, WMLCustomComponent, WMLWrapper } from '@windmillcode/wml-components-base';


// rxjs
import { Subject } from 'rxjs';
import { WmlInputComponent, WmlInputParams } from '@windmillcode/wml-input';
import { WmlLabelComponent, WmlLabelParams } from '@windmillcode/wml-field';

@Component({
  selector: 'wml-field',
  templateUrl: './wml-field.component.html',
  styleUrls: ['./wml-field.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class WmlFieldComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
  ) { }
  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlField')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  @Input("field") wmlField?:WMLField
  @ViewChild("customLabel",{read:ViewContainerRef,static:true}) customLabel!:ViewContainerRef;
  @ViewChild("customField", {read:ViewContainerRef,static:true}) customField!:ViewContainerRef;
  @ViewChild("customError", {read:ViewContainerRef,static:true}) customError!:ViewContainerRef;


  initComponent(){

    if(this.wmlField){
      this.wmlField.view.cdref = this.cdref
    }


    ["label","field","error"].forEach((key,index0)=>{

      if(  this.wmlField?.[key]?.type === "custom"){
        this.wmlField[key].custom.meta.wmlField = this.wmlField

        addCustomComponent(
          [this.customLabel,this.customField,this.customError][index0],
          this.wmlField[key].custom.cpnt as Type<any>,
          this.wmlField[key].custom.meta
        )

      }
    })

  }

  initUpdateComponent(){

  }

  ngOnInit(): void {
    this.initComponent()
    this.initUpdateComponent()

  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class WMLField extends WMLWrapper {
  constructor(
    params:{
      type:"default" | "custom",
      default?:{
        wmlfield:Partial<WMLField>
      },
      custom?:{
        selfType?: WMLField["self"]["type"],
        fieldType?: WMLField["field"]["type"],
        fieldCustomCpnt?:WMLField["field"]["custom"]["cpnt"],
        fieldCustomMeta?:WMLField["field"]["custom"]["meta"],
        fieldParentForm?:WMLField["field"]["parentForm"],
        fieldFormControlName?:WMLField["field"]["formControlName"],
        labelValue?:WmlLabelParams["labels"][number][number]["value"],
        labelRequired?:boolean,
        labelCpnt?:WMLField["label"]["custom"]["cpnt"]
        errorMsgs?:WmlLabelParams["errorMsgs"],
        errorCpnt?:WMLField["error"]["custom"]["cpnt"],
      }
    } = {
      type:"default",
      default:{
        wmlfield:{}
      },
      custom:{
        selfType:"wml-card"
      }
    }
  ){
    super();
    if(params.type === "default"){
      Object.assign(
        this,
        {
          ...params.default?.wmlfield
        }
      )
    }

    else if(params.type === "custom"){
      let custom = params.custom ?? {}
      let labelWMLLabelMeta:WmlLabelParams = this.label.custom.meta
      let errorWMLFieldErrorMeta:WmlLabelParams = this.error.custom.meta
      this.self.type = custom.selfType ?? "standalone"
      this.field.type = custom.fieldType ?? "custom"
      this.field.custom.cpnt = custom.fieldCustomCpnt ?? WmlInputComponent
      this.field.custom.meta = custom.fieldCustomMeta ?? new WmlInputParams({
        wmlField:this
      })
      this.field.parentForm = custom.fieldParentForm ?? this.field.parentForm
      this.field.formControlName = custom.fieldFormControlName ?? this.field.formControlName

      this.label.custom.cpnt = custom.labelCpnt ?? this.label.custom.cpnt
      labelWMLLabelMeta.labels[0][1].value = custom.labelValue ?? labelWMLLabelMeta.labels[0][1].value
      if(custom.labelRequired === false){
        labelWMLLabelMeta.labels[0].shift()
      }

      this.error.custom.cpnt = custom.errorCpnt ?? this.error.custom.cpnt
      errorWMLFieldErrorMeta.errorMsgs = custom.errorMsgs ?? errorWMLFieldErrorMeta.errorMsgs
    }



  }
  self:{
    type:"standalone" | "wml-card"
  }= {
    type:"wml-card"
  }
  label = {
    type:"custom",
    custom:new WMLCustomComponent({
      cpnt:WmlLabelComponent,
      meta:new WmlLabelParams()
    })
  }
  field:{

    type:"input" | "custom"  //may just make all components dynamic and provide metas
    parentForm:FormGroup,
    formControlName:string
    custom:WMLCustomComponent

  } = {
    type:"custom",
    custom:new WMLCustomComponent({
      cpnt:SampleCpntComponent
    }),
    parentForm:new FormGroup({
      name:new FormControl()
    }),
    formControlName:"name"
  }

  error = {
    type:"custom",
    custom:new WMLCustomComponent({
      cpnt:WmlLabelComponent,
      meta:new WmlLabelParams({
        errorMsgs:{
          required:"This field is required"
        },
        type:"error",
        labels:[
          [
            {
              type:"error",
              value:"Please resolve the above errors",
            }
          ],
        ]
      })
    })
  }

  deleteLabelPart=([labelPart,part]:[number,number])=>{
    this.label.custom.meta.labels[labelPart].splice(part,part+1)
  }

}

@Component({
  template:`
    <p> replace me with an input cpnt
  `
})
class SampleCpntComponent{}
