import { ChangeDetectorRef, Injectable } from '@angular/core';
import { delay, finalize, Subject, tap } from 'rxjs';

// services

// reactive forms
import { FormArray, FormControl, FormGroup } from '@angular/forms';

// wml components
import { CustomLabelComponent } from '@shared/components/custom-label/custom-label.component';
import { WmlLabelParams, WMLField } from '@windmillcode/wml-field';
import { WmlInputParams } from '@windmillcode/wml-input';
import { WmlPopupComponentParams } from '@windmillcode/wml-popup';
import { WmlNotifyBarModel, WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { NotifyBannerComponent, NotifyBannerMeta } from '@shared/components/notify-banner/notify-banner.component';
import { WMLButton, WMLCustomComponent, WMLUIProperty } from '@windmillcode/wml-components-base';
import { WMLOptionsButton, WmlOptionsComponent, WMLOptionsParams } from '@windmillcode/wml-options';
import { WmlFileUploadComponent, WMLFileUploadParams } from '@windmillcode/wml-file-manager';
import { WMLChipsParams, WmlChipsComponent } from '@windmillcode/wml-chips';
import { MobileNavItemPodComponent, MobileNavItemPodParams } from '@shared/components/mobile-nav-item-pod/mobile-nav-item-pod.component';
import { MobileNavItemParams } from 'projects/mobile-nav/src/lib/mobile-nav-item/mobile-nav-item.component';
import { WMLTab } from '@windmillcode/wml-tabs';
import { UtilityService } from '@core/utility/utility.service';


@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private utilService:UtilityService,
    public wmlNotifyService:WmlNotifyService
  ) { }

  appCdRef!:ChangeDetectorRef


  // @ts-ignore
  toggleOverlayLoadingSubj:Subject<boolean> =new Subject<boolean>()
  toggleOverlayLoadingSubj$ = this.toggleOverlayLoadingSubj.asObservable()
  .pipe(
    delay(300),
    tap((val)=> {
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
  togglePopupSubj =new Subject<boolean>()

  popupParams= new WmlPopupComponentParams({})
  closePopup = ()=>{
    this.togglePopupSubj.next(false)
  }
  generateWMLNote = (i18nKey:string ="Success",type:WmlNotifyBarType=WmlNotifyBarType.Success,autoHide=false )=>{
    type = type ?? WmlNotifyBarType.Success
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
          required:"global.errorRequired"
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
          required:"global.errorRequired"
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
          required:"global.errorRequired"
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

  generateOptionsFormField=(
    labelValue:string,
    fieldFormControlName,
    fieldParentForm,
    errorMsgs?:WmlLabelParams["errorMsgs"],
    selfType?:WMLField["self"]["type"],
    optionsParams?:WMLOptionsParams
    )=>{
    let wmlField
    wmlField = new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"global.errorRequired"
        },
        fieldCustomCpnt:WmlOptionsComponent,
        fieldCustomMeta:optionsParams ?? new WMLOptionsParams({
          options:[new WMLOptionsButton({
            text:"use WMLOptionsParams from the wmloptions component and fill me w/ options"
          })]
        })
      }
    })
    return this.generateFormField(wmlField)
  }

  generateFileUploadFormField=(
    labelValue:string,
    fieldFormControlName,
    fieldParentForm,
    errorMsgs?:WmlLabelParams["errorMsgs"],
    selfType?:WMLField["self"]["type"],
    fileUploadParams?:WMLFileUploadParams
    )=>{
    let wmlField
    wmlField = new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"global.errorRequired"
        },
        fieldCustomCpnt:WmlFileUploadComponent,
        fieldCustomMeta:fileUploadParams ?? new WMLFileUploadParams({

        })
      }
    })
    return this.generateFormField(wmlField)
  }

  generateMobileNavLinkItem(i18nKey:string,click:WMLUIProperty["click"],isPresent=true){
    return new MobileNavItemParams({
      cpnt:MobileNavItemPodComponent,
      meta: new MobileNavItemPodParams({
        mainPod:new WMLUIProperty({
          style:{
            "justifyContent":"flex-start",
            border:"none"
          }
        }),
        link:new WMLUIProperty({
          value:i18nKey,
          click,
          style:{
            fontSize:"1.5rem"
          }
        })
      }),
      isPresent
    })
  }

  generateMobileNavBtnItem(params:GenerateMobileNavBtnItemParams){

    return new MobileNavItemParams({
      cpnt:MobileNavItemPodComponent,
      meta: new MobileNavItemPodParams({
        mainPod:new WMLUIProperty({
          style:{
            border:"none"
          }
        }),
        type:"btn",
        btn:new WMLButton({
          value:params.i18nKey,
          click:params.btnClick,
          class:params.btnClass,
          iconIsPresent:params.btnIconIsPresent,
          iconSrc:params.btnIconSrc,
          iconAlt:params.btnIconAlt,
        }),
      })
    })
  }

  generateWmlTab(wmlTabHeaderText:string,wmlTabHeaderIconIsPresent:boolean=false){
    let tab = new WMLTab({})
    tab.header.wmlTabHeader.text = wmlTabHeaderText
    tab.header.wmlTabHeader.icon.isPresent = wmlTabHeaderIconIsPresent
    return tab
  }

  tellUserToFillOutRequiredFields = (rootFormGroup:FormGroup,cdref?:ChangeDetectorRef)=>{
    let fillOutFormNote =this.generateWMLNote("global.fillOutForm",WmlNotifyBarType.Error)
    this.wmlNotifyService.create(fillOutFormNote)
    this.validateAllFormFields(rootFormGroup)
    cdref?.detectChanges()
  }


  generateChipsFormField=(
    labelValue:string,
    fieldFormControlName,
    fieldParentForm,
    errorMsgs?:WmlLabelParams["errorMsgs"],
    selfType?:WMLField["self"]["type"],
    chipsParams:WMLChipsParams=new WMLChipsParams({})
    )=>{
    let wmlField
    chipsParams.placeholder = "global.wmlChipsplaceholder"
    chipsParams.userInputsAriaLabel = "global.wmlChipsuserInputsAriaLabel"
    chipsParams.removeChipAriaLabel = "wmlChipsremoveChipAriaLabel"
    wmlField = new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"global.errorRequired"
        },
        fieldCustomCpnt:WmlChipsComponent,
        fieldCustomMeta:chipsParams
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
      if (control instanceof FormControl || control instanceof FormArray) {             //{4}
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity({ emitEvent: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }



}


export class GenerateMobileNavBtnItemParams {
  constructor(params:Partial<GenerateMobileNavBtnItemParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  i18nKey!:WMLButton["value"]
  btnClick!:WMLButton["click"]
  btnClass:WMLButton["class"]
  btnIconIsPresent!:WMLButton["iconIsPresent"]
  btnIconSrc!:WMLButton["iconSrc"]
  btnIconAlt!:WMLButton["iconAlt"]
}
