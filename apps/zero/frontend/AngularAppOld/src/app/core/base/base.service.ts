import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BehaviorSubject, delay, finalize, ReplaySubject, Subject, tap } from 'rxjs';

// services
import { UtilityService } from '@core/utility/utility.service';

// reactive forms
import { FormControl, FormGroup } from '@angular/forms';

// wml components
import { CustomLabelComponent } from '@shared/components/custom-label/custom-label.component';
import { WmlLabelParams, WMLField } from '@windmillcode/wml-field';
import { WmlInputParams } from '@windmillcode/wml-input';
import { WmlPopupComponentParams } from '@windmillcode/wml-popup';
import { WmlNotifyBarModel, WmlNotifyBarType } from '@windmillcode/wml-notify';
import { NotifyBannerComponent, NotifyBannerMeta } from '@shared/components/notify-banner/notify-banner.component';
import { WMLCustomComponent } from '@windmillcode/wml-components-base';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private utilService:UtilityService,
  ) { }

  appCdRef!:ChangeDetectorRef

  // @ts-ignore
  toggleOverlayLoadingSubj:Subject=new Subject<boolean>()
  .pipe(
    tap(()=> {
      this.appCdRef.detectChanges()
    })
  )

  updateOverlayLoadingText:string = "app.overlayLoading"
  closeOverlayLoading = finalize(()=>{
    this.toggleOverlayLoadingSubj.next(false)
  })
  openOverlayLoading = ()=>{
    this.toggleOverlayLoadingSubj.next(true)
  }
  playSiteAudioSubj = new Subject<boolean>()
  toggleMobileNavSubj = new Subject<boolean>()
  togglePopupSubj = (()=>{
    let subj = new Subject<boolean>()
    subj
    .pipe(
      tap(()=>{
        this.popupParams.updatePopup()
      })
    )
    return subj

  })()

  popupParams= new WmlPopupComponentParams({})
  closePopup = ()=>{
    this.togglePopupSubj.next(false)
  }
  generateWMLNote = (i18nKey:string ="Success",type:WmlNotifyBarType=WmlNotifyBarType.Success,autoHide=false )=>{
    return  new WmlNotifyBarModel({
      type,
      autoHide,
      msgtype:"custom",
      custom:new WMLCustomComponent({
        cpnt:NotifyBannerComponent,
        meta:new NotifyBannerMeta({
          i18nKey
        })
      })
    })
  }

  generateInputFormField=(labelValue:string,fieldFormControlName,fieldParentForm:FormGroup,errorMsgs?:WmlLabelParams["errorMsgs"],selfType?:WMLField["self"]["type"])=>{

    return this.generateFormField(
      new WMLField({
        type: "custom",
        custom: {

          selfType: selfType ?? "wml-card",
          fieldParentForm,
          fieldFormControlName,
          labelValue,
          errorMsgs: errorMsgs ?? {
            required:"global.errorRequired"
          }
        }
      })
    )
  }

  generateRangeFormField=(labelValue:string,fieldFormControlName,fieldParentForm,errorMsgs?:WmlLabelParams["errorMsgs"],selfType?:WMLField["self"]["type"])=>{
    let wmlField
    wmlField =      new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"value is required"
        },
        fieldCustomMeta:new WmlInputParams({
          wmlField,
          type:"range"
        })
      }
    })
    return this.generateFormField(wmlField)
  }

  generateTextAreaFormField=(labelValue:string,fieldFormControlName,fieldParentForm,errorMsgs?:WmlLabelParams["errorMsgs"],selfType?:WMLField["self"]["type"])=>{
    let wmlField
    wmlField =  new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "wml-card",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"value is required"
        },
        fieldCustomMeta:new WmlInputParams({
          wmlField,
          type:"textarea"
        })
      }
    })
    return this.generateFormField(wmlField)
  }

  generateCheckboxFormField=(labelValue:string,fieldFormControlName,fieldParentForm,errorMsgs?:WmlLabelParams["errorMsgs"],selfType?:WMLField["self"]["type"],checkboxDesc?:string)=>{
    let wmlField
    wmlField = new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"value is Required"
        },
        fieldCustomMeta:new WmlInputParams({
          wmlField,
          type:"checkbox",
          checkboxDesc
        })
      }
    })
    return this.generateFormField(wmlField)
  }


  generateFormField= (wmlField:WMLField)=>{
    wmlField.label.custom.cpnt = CustomLabelComponent
    wmlField.error.custom.cpnt = CustomLabelComponent
    return wmlField
  }


  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity({ emitEvent: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }



}
