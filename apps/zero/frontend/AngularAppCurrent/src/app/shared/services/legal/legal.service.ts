import { Injectable } from '@angular/core';
import { from, forkJoin, concatMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LegalService {

  constructor(

  ) { }

  loadpdf = (fileUrl)=>{
    let loadingTask = pdfjsLib.getDocument(fileUrl);
    return from(loadingTask.promise)
    .pipe(
      concatMap((pdf:any)=>{
        return this.loadPages(pdf)
      })
    )

  }

  loadPages = (pdf)=>{
    let pages$ = Array(pdf.numPages)
    .fill(null)
    .map((nullVal,index0)=>{
      return from(pdf.getPage(index0+1))
    })

    return forkJoin(
      pages$
    )
    .pipe(
      concatMap((pages)=>{

        return this.loadTextContent(pages)
      })
    )

  }

  loadTextContent = (pages)=>{
    let textContent$ = pages
    .map((page,index0)=>{
      if(page.getTextContent){
        return from(page.getTextContent())
      }
      return null
    })
    .filter((item)=>{
      return item !== null
    })


    return forkJoin(
      textContent$
    )
    .pipe(
      map((textContent)=>{
        return textContent
      })
    )
  }
}
