import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { WmlFileUploadComponent } from './wml-file-upload/wml-file-upload.component';
import { WmlDragNDropDirective } from './wml-drag-n-drop/wml-drag-n-drop.directive';




let cpnts = [
  WmlFileUploadComponent,
  WmlDragNDropDirective,
]
@NgModule({
  declarations: [
    ...cpnts,
  ],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    ...cpnts
  ]
})
export class WmlFileManagerModule { }
