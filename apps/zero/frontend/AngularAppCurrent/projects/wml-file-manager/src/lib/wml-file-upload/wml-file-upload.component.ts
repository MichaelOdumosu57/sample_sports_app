// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { environment } from '@env/environment';




// rxjs
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc


@Component({

  selector: 'wml-file-upload',
  templateUrl: './wml-file-upload.component.html',
  styleUrls: ['./wml-file-upload.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class WmlFileUploadComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

  ) { }

  generateClassPrefix(prefix:string) {
    return (val: string) => {
      return prefix + val
    }
  }
  classPrefix = this.generateClassPrefix('WmlFileUpload')

  @ViewChild("fileInput",{static:true}) browseFileElementRef:ElementRef
  browseFileElement:HTMLInputElement
  @Input('params') params: WMLFileUploadParams = new WMLFileUploadParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.browseFileElement = this.browseFileElementRef.nativeElement;
    // specifacally for automation purposes
    if(!environment.production){
      ;(this.browseFileElement as any).chooseFiles = this.chooseFiles
    }
    this.listenForFileUpload().subscribe()
  }

  openFileBrowserToUploadFile = ()=>{
    this.browseFileElement.click()
  }

  updateFormArray= ()=>{
    if(this.params.formArray){
      this.params.formArray.clear()
      this.params.files
      .forEach((file)=>{
        let result = this.params.updateFormArrayPredicate(file)
        this.params.formArray.push(new FormControl(result))
      })
      this.params.formArray.markAsDirty()
    }

  }

  chooseFiles =(myFileList?:FileList)=>{
    let fileArray = Array.from(this.browseFileElement.files.length > 0 ?
      this.browseFileElement.files:
      myFileList
      )
    let fileObjs = fileArray
    .filter((file:File)=>{
      return this.params.uploadAllowedPredicate(file,fileArray)
    })
    .map((file:File)=>{
      return new WMLFileUploadItem({
        file,
        uploadIsPresent:!!this.params.uploadFn
      })
    })
    this.params.files.push(...fileObjs)
    this.browseFileElement.value = ''

    this.updateFormArray()

    this.cdref.detectChanges()

  }
  listenForFileUpload = ()=>{
    return fromEvent(
      this.browseFileElement,
      "change"
    )
    .pipe(
      takeUntil(this.ngUnsub),
      // @ts-ignore
      tap(this.chooseFiles)
    )

  }


  uploadFile = (item:WMLFileUploadItem)=>{

  }
  deleteFile = (item:WMLFileUploadItem)=>{
    this.params.files = this.params.files
    .filter((file)=>{
      return file !== item
    })
    this.cdref.detectChanges()
    this.updateFormArray()
  }
  retryUpload = (item:WMLFileUploadItem)=>{

  }
  cancelUpload = (item:WMLFileUploadItem)=>{

  }


  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class WMLFileUploadParams {
  constructor(params:Partial<WMLFileUploadParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  files:WMLFileUploadItem[] | any = Array(0)
  .fill(null)
  .map((nullVal,index0)=>{
    return new WMLFileUploadItem({
      file:{
        name:["Beta.jpg","Alpha.jpg"][index0]
      }
    })
  })
  dragDropText ='Drag and drop the file(s) here or click on "Browse Files".'
  browseFileText= "Browse Files"
  limit = 4
  formArray:FormArray
  duplicates = false
  uploadFn : ()=> Observable<any>
  updateFormArrayPredicate:(WMLOptionsButton) => any =(val)=> val
  uploadAllowedPredicate:(file:File,fileList:File[])=>boolean =(file,fileList)=>{

    let fileIndex = fileList.findIndex((item)=>{
      return item === file
    })

    let limitNotReached = (fileIndex+ this.files.length) < this.limit

    if(!this.duplicates){
      let result =  this.files.find((fileItem)=>{
        return fileItem.file.name === file.name &&
        fileItem.file.type === file.type &&
        fileItem.file.size === file.size &&
        fileItem.file.lastModified === file.lastModified
      })
      return result === undefined && limitNotReached
    }
    else {
      return limitNotReached

    }
  }
}


export class WMLFileUploadItem {
  constructor(params:Partial<WMLFileUploadItem>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  file:File | any
  uploadIsPresent = false
  deleteIsPresent = true
  retryIsPresent = false
  cancelIsPresent = false
  state: "attachSuccess" | "attachError" | "fileUploading" |  "uploadError" | "uploadSuccess" = "attachSuccess"
}

