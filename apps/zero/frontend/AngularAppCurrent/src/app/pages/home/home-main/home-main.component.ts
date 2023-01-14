// angular
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';
import { faker } from '@faker-js/faker';
import { WMLUIProperty } from '@windmillcode/wml-components-base';
import { WmlSliceboxImg, WmlSliceboxParams } from '@windmillcode/wml-slicebox';


// rxjs
import { Subject } from 'rxjs';

// misc

@Component({

  selector: 'home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class HomeMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public http:HttpClient,

  ) { }

  classPrefix = this.utilService.generateClassPrefix('HomeMain')



  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  pickers:HomeMainPicker[] =[]
  images: WmlSliceboxImg[] = Array(5)
  .fill(null)
  .map((nullVal, index0) => {
    let methods = Object.entries(faker.image)
    .filter((entry,index1)=>{
      let [key,val]= entry
      return val.constructor.name === "Function"
    })
    .filter(([key,val])=>{
      return !["nightlife","fashion","avatar","image","imageUrl","city","sports","dataUri"].includes(key)
    })
    let makeFakeImage =this.utilService.selectRandomOptionFromArray(methods)
    let src = makeFakeImage[1]()

    let img = new WmlSliceboxImg({
      src,
      value: index0.toString(),
    });

    this.pickers.push(new HomeMainPicker({
      value:index0,
      class:this.classPrefix('Pod1Item0')
    }))

    return img;
  });
  sliceBoxParams = new WmlSliceboxParams({
    images: this.images,
    orientation:"v",

    // nextRotationDegree:"360deg",
    disperseFactor:80,
    disperseSpeed:4000,
    speed:1500,
    sequentialFactor:150,
    autoplay:false,
  });

  moveToNextSlide =()=>{
    this.sliceBoxParams.moveToNextSlideSubj.next()
  }

  moveToPrevSlide =()=>{
    this.sliceBoxParams.moveToPrevSlideSubj.next()
  }

  jumpToSlide = (myPicker:HomeMainPicker)=>{
    this.pickers
    .forEach((picker)=>{
      picker.updateClassString(this.classPrefix('Pod1Item1'),"remove")
    })
    myPicker.updateClassString(this.classPrefix('Pod1Item1'))

    this.sliceBoxParams.jumpToSlideSubj.next(myPicker.value)
    this.cdref.detectChanges()
  }

  ngOnInit(): void {

  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class HomeMainPicker extends WMLUIProperty {
  constructor(params:Partial<HomeMainPicker>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  override value:any

}






