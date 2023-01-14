// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit, SimpleChanges } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';

// rxjs
import { ReplaySubject, Subject, takeUntil, tap } from 'rxjs';

// misc
import { ENV } from '@env/environment';

// wml components
import { WMLView } from '@windmillcode/wml-components-base';
import { WMLField } from '@windmillcode/wml-field';



@Component({
  selector: 'wml-form',
  templateUrl: './wml-form.component.html',
  styleUrls: ['./wml-form.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class WmlFormComponent  {

  constructor(
    public cdref:ChangeDetectorRef
  ) { }
  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlForm')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  @Input("params") params:WMLForm = new WMLForm({})
  displayFields:Array<WMLField>[]=[]
  ngUnsub=new Subject<void>()


  updateFields = ()=>{
    let displayFields:Array<WMLField> =  [...this.params.fields]
    this.displayFields = []
    this.params.fieldSections
    .forEach((count)=>{

      let section:Array<WMLField> =[]
      while(count-- !== 0){
        section.push(displayFields.shift())
      }
      this.displayFields.push(section)
    })
  }
  ngOnChanges(changes:SimpleChanges){
    this.updateFields()
  }
  listenForChangesInFields = ()=>{
    return this.params.fieldsUpdateSubj
    .pipe(
      takeUntil(this.ngUnsub),
      tap((params= new WMLFormFieldsUpdateSubjParams())=>{

        // @ts-ignore
        if(params.resetFieldSections){
          this.params.resetFieldSections()
        }
        this.updateFields()
        this.cdref.detectChanges()

      })
    )
  }
  ngOnInit(){
    this.listenForChangesInFields().subscribe()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }




}

export class WMLForm{
  constructor(params:Partial<WMLForm>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    if(params.fieldSections){
      this.fieldSectionsIsPresent = true
    }
    this.resetFieldSections()

  }
  view:WMLView
  fields:Array<WMLField> =[]
  fieldSections:Array<number>
  fieldSectionsIsPresent=false
  fieldsUpdateSubj=new ReplaySubject<WMLFormFieldsUpdateSubjParams|void>()
  resetFieldSections=()=>{
    if(!this.fieldSectionsIsPresent ){
      this.fieldSections = [this.fields.length]
    }
  }
}

export class WMLFormFieldsUpdateSubjParams {
  constructor(params:Partial<WMLFormFieldsUpdateSubjParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  resetFieldSections= true
}
