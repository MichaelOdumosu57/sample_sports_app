// angular
import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewChild, } from '@angular/core';
import { WMLButton, WMLImage, WMLUIProperty, } from '@windmillcode/wml-components-base';
// rxjs
import { combineLatest, concatMap, debounceTime, filter, fromEvent, interval, of, startWith, Subject, takeUntil, tap, timer, } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
let retriveValueFromCSSUnit = (str) => {
    return parseFloat(str.match(/-?\d+/)[0]);
};
let updateClassString = (obj, myClassDefault, classListDefault) => {
    return (val, type = "add") => {
        let myClass = myClassDefault;
        let classList = classListDefault;
        if (type === "add") {
            obj[classList].push(val);
        }
        else if (type === "remove") {
            obj[classList] = (obj[classList])
                .filter((myClass) => {
                return myClass !== val;
            });
        }
        obj[myClass] = obj[classList]
            .reduce((acc, x, i) => {
            return acc + " " + x;
        }, "");
    };
};
// misc
export class WmlSliceboxComponent {
    constructor(cdref, renderer2, el) {
        this.cdref = cdref;
        this.renderer2 = renderer2;
        this.el = el;
        this.classPrefix = this.generateClassPrefix('WmlSlicebox');
        this.myClass = this.classPrefix(`View`);
        this.ngUnsub = new Subject();
        this.perspective = new WMLUIProperty();
        // TODO possible development no way to pause transitions, may refactor to use animations
        this.togglePauseBtn = new WMLButton({
            click: () => {
                this.params._cuboids?.forEach((cuboid) => {
                    cuboid.style.transition = 'none';
                    cuboid.style.animationPlayState =
                        cuboid.style.animationPlayState !== 'paused' ? 'paused' : 'running';
                    // cuboid.style.animationPlayState = "paused"
                });
                this.cdref.detectChanges();
            },
        });
        this.cacheImages = () => {
            let savedImages$ = this.params.images.map((sliceboxImg) => {
                let image = new Image();
                image.crossOrigin = 'Anonymous';
                image.style.height = this.params.sliceboxSize.height + 'px';
                image.style.width = this.params.sliceboxSize.width + 'px';
                this.cdref.detectChanges();
                let savedImage$ = fromEvent(image, 'load').pipe(takeUntil(this.ngUnsub), tap((res) => {
                    let canvas = this.renderer2.createElement('canvas');
                    let context = canvas.getContext('2d');
                    canvas.height = this.params.sliceboxSize.height;
                    canvas.width = this.params.sliceboxSize.width;
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    sliceboxImg.cachedSrc = canvas.toDataURL('image/png');
                }));
                image.src = sliceboxImg.src;
                return savedImage$;
            });
            return combineLatest(savedImages$);
        };
        this.hostStyle = () => getComputedStyle(this.el.nativeElement);
        this.updateCssVars = () => {
            this.el.nativeElement.style.setProperty('--time-for-one-cuboid-rotation', this.params.speed / 1000 + 's');
            this.el.nativeElement.style.setProperty('--vertical-rotate', this.params.orientation === 'v' ? -1 : 0);
            this.el.nativeElement.style.setProperty('--horizontal-rotate', this.params.orientation === 'h' ? -1 : 0);
            this.el.nativeElement.style.setProperty('--reverse-deg-end', this.params.nextRotationDegree ??
                this.hostStyle().getPropertyValue('--reverse-deg-end'));
            this.el.nativeElement.style.setProperty('--disperse-speed', this.params.disperseSpeed / 1000 + 's');
            this.el.nativeElement.style.setProperty('--animation-easing', this.params.easing);
            this.el.nativeElement.style.setProperty('--side-background-color', this.params.colorHiddenSides);
            this.cdref.detectChanges();
        };
        this.sliceBoxInit = () => {
            this.params.itemsCount = this.params.images.length;
            this.targetPerspectiveComputedStyle = getComputedStyle(this.targetPerspective.nativeElement);
            this.setSliceBoxDims();
            this.params.isReady = true;
            return this.startSlideShow();
        };
        this.stopSlideShowSubj = new Subject();
        this.startSlideShow = () => {
            let obs$ = this.params.autoplay
                ? interval(this.params.interval)
                : timer(this.params.interval);
            return obs$.pipe(startWith(0), takeUntil(this.stopSlideShowSubj), takeUntil(this.ngUnsub), tap(() => {
                this.navigate(this.params.autoplay ? 'next' : null);
            }));
        };
        this.navigate = (dir, jumpTo) => {
            this.stopSlideShowSubj.next();
            if (this.checkIfSliceboxCanAnimate()) {
                return;
            }
            this.params.prev.index = this.params.current.index;
            this.determineNextSlide(dir, jumpTo);
            this.setupCuboids();
            this.setupSlides();
        };
        this.setupCuboids = () => {
            let boxStyle = {
                width: this.params.sliceboxSize.width,
                height: this.params.sliceboxSize.height,
                perspective: this.params.perspective + 'px',
            };
            this.perspective.style = boxStyle;
            let config = {
                ...this.params,
                items: this.params.images,
                prev: this.params.prev,
                current: this.params.current,
                o: this.params.orientation,
                reverse: this.params._reverse
            };
            this.params._cuboids = Array(this.params.cuboidsCount)
                .fill(null)
                .map((nullVal, index0) => {
                let cuboid = new WmlSliceboxCuboidParams({
                    pos: index0,
                    ...config,
                });
                this.setCuboidSize(cuboid);
                this.configureCuboidStyles(cuboid);
                return cuboid;
            });
            this.cdref.detectChanges();
        };
        this.setupSlides = () => {
            if (this.params.autoplay) {
                this.params.isAnimating = true;
                this.rotateSlide("next");
            }
            else if (!this.params.autoplay) {
                this.params._cuboids.forEach((cuboid) => {
                    this.setupImagesBeforeRotation(cuboid);
                });
            }
        };
        this.showImageCuboid = (cuboid, imgPos, cuboidSide) => {
            let sideIdx;
            let item = cuboid.images[imgPos];
            let imgParam = {
                'background-size': cuboid.sliceboxSize.width + 'px ' + cuboid.sliceboxSize.height + 'px',
                'background-image': 'url(' + item.cachedSrc + ')',
            };
            switch (cuboidSide) {
                case 1:
                    sideIdx = 0;
                    break;
                case 2:
                    sideIdx = cuboid.o === 'v' ? 4 : 2;
                    break;
                case 3:
                    sideIdx = 1;
                    break;
                case 4:
                    sideIdx = cuboid.o === 'v' ? 5 : 3;
                    break;
            }
            imgParam['background-position'] =
                cuboid.o === 'v'
                    ? -(cuboid.pos * cuboid.size.width) + 'px 0px'
                    : '0px -' + cuboid.pos * cuboid.size.height + 'px';
            let val = cuboid[[
                'frontSide',
                'backSide',
                'rightSide',
                'leftSide',
                'topSide',
                'bottomSide',
            ][sideIdx]];
            Object.assign(val.style, imgParam);
            // val.value = item.src
            this.cdref.detectChanges();
        };
        this.checkIfSliceboxCanAnimate = () => {
            let result = !this.params.isFinishedResizing ||
                this.params.isAnimating ||
                !this.params.isReady ||
                this.params.itemsCount < 2;
            return result;
        };
        this.determineNextRotation = (dir) => {
            if (dir === "prev") {
                this.el.nativeElement.style.setProperty('--reverse-deg-end', this.params.prevRotationDegree);
            }
            else {
                this.el.nativeElement.style.setProperty('--reverse-deg-end', this.params.nextRotationDegree);
            }
        };
        this.rotateCuboid = (cuboid, oneScndBfrCallaback, finishedCallback, dir) => {
            cuboid.isRotateComplete = false;
            cuboid.isInDispersion = true;
            this.setupImagesBeforeRotation(cuboid, dir);
            timer(cuboid.sequentialFactor * cuboid.pos + 30)
                .pipe(takeUntil(this.ngUnsub), tap(() => {
                this.updateDispersionPoints(cuboid);
                cuboid.updateClassString('WmlSliceboxPod1Rotate0');
                this.cdref.detectChanges();
                timer(cuboid.speed / 2)
                    .pipe(takeUntil(this.ngUnsub), tap(() => {
                    cuboid.isInDispersion = false;
                    cuboid.style.top = cuboid.transitionStartTop;
                    cuboid.style.left = cuboid.transitionStartLeft;
                    this.cdref.detectChanges();
                }))
                    .subscribe();
                timer(cuboid.speed - cuboid.speed * 0.0761904761904762)
                    .pipe(takeUntil(this.ngUnsub), tap((res) => {
                    cuboid.isRotateComplete = true;
                    oneScndBfrCallaback(cuboid.pos);
                }))
                    .subscribe();
                timer(cuboid.speed)
                    .pipe(takeUntil(this.ngUnsub), tap((res) => {
                    finishedCallback(cuboid.pos);
                }))
                    .subscribe();
            }))
                .subscribe();
        };
        this.rotateSlide = (dir) => {
            this.params._dir = dir;
            this.params._cuboids
                .forEach((cuboid) => {
                this.rotateCuboid(cuboid, () => {
                    // updates the frontface early for next transition
                    this.showImageCuboid(cuboid, cuboid.current.index, 1);
                    cuboid.updateClassString('WmlSliceboxPod1Rotate0', 'remove');
                }, (pos) => {
                    if (pos === this.params.cuboidsCount - 1) {
                        this.params.isAnimating = false;
                        this.startSlideShow().subscribe();
                        this.cdref.detectChanges();
                    }
                }, dir);
            });
        };
        this.setCuboidSize = (cuboid) => {
            cuboid.size = {
                width: cuboid.o === 'v'
                    ? Math.floor(this.params.sliceboxSize.width / cuboid.cuboidsCount)
                    : this.params.sliceboxSize.width,
                height: cuboid.o === 'v'
                    ? this.params.sliceboxSize.height
                    : Math.floor(this.params.sliceboxSize.height / cuboid.cuboidsCount),
            };
            // extra space to fix gaps
            cuboid.extra =
                cuboid.o === 'v'
                    ? this.params.sliceboxSize.width -
                        cuboid.size.width * cuboid.cuboidsCount
                    : this.params.sliceboxSize.height -
                        cuboid.size.height * cuboid.cuboidsCount;
        };
        this.configureCuboidStyles = (cuboid) => {
            this.configureMainCuboidStyle(cuboid);
            this.configureSideCuboidStyles(cuboid);
        };
        this.finishResizing = ($event, cuboid) => {
            if ([cuboid.o === "v" ? "left" : "top"].includes($event.propertyName) &&
                cuboid.cuboidsCount === cuboid.pos + 1 &&
                ($event.elapsedTime > 1 || !this.params.isAnimating)) {
                this.params.isFinishedResizing = true;
                this.startSlideShow().subscribe();
                this.cdref.detectChanges();
            }
        };
        this.updateSliceboxOnResize = () => {
            return fromEvent(window, 'resize').pipe(takeUntil(this.ngUnsub), debounceTime(this.params.resizeDelay), tap(() => {
                this.params.isFinishedResizing = false;
                this.setSliceBoxDims();
                let boxStyle = {
                    width: this.params.sliceboxSize.width,
                    height: this.params.sliceboxSize.height,
                    perspective: this.params.perspective + 'px',
                };
                this.perspective.style = boxStyle;
                this.params._cuboids.forEach((cuboid) => {
                    this.setCuboidSize(cuboid);
                    this.configureMainCuboidStyle(cuboid);
                    this.configureSideCuboidStyles(cuboid);
                    if (!cuboid.isRotateComplete) {
                        this.setupImagesBeforeRotation(cuboid, this.params._dir);
                    }
                    else {
                        this.showImageCuboid(cuboid, cuboid.current.index, 1);
                    }
                    if (cuboid.isInDispersion) {
                        this.updateDispersionPoints(cuboid, true);
                    }
                });
                this.cdref.detectChanges();
                // this.firstInit()
            }));
        };
        this.firstInit = () => {
            this.updateCssVars();
            this.updateSliceboxOnResize().subscribe();
            this.cacheImages()
                .pipe(takeUntil(this.ngUnsub), concatMap(() => {
                return this.sliceBoxInit();
            }))
                .subscribe();
        };
        this.listenForJumpToSlideSubj = () => {
            return this.params.jumpToSlideSubj
                .pipe(takeUntil(this.ngUnsub), filter((index) => { return index !== this.params.current.index; }), filter(() => !this.checkIfSliceboxCanAnimate()), tap((index) => {
                let dir = index > this.params.current.index ? "next" : "prev";
                this.params.isAnimating = true;
                this.determineNextSlide(dir, index);
                this.rotateSlide(dir);
            }));
        };
        // TODO implement this mabye
        this.listenForToggleAutoPlaySubj = () => {
            return of([]);
            // return this.params.toggleAutoPlaySubj
            // .pipe(
            //   takeUntil(this.ngUnsub),
            //   filter(()=>!this.checkIfSliceboxCanAnimate()),
            //   tap(()=>{
            //     console.log("fire3")
            //   })
            // )
        };
        this.listenForMoveToPrevSubj = () => {
            return this.params.moveToPrevSlideSubj
                .pipe(takeUntil(this.ngUnsub), filter(() => !this.checkIfSliceboxCanAnimate()), tap(() => {
                let dir = "prev";
                this.params.isAnimating = true;
                this.determineNextSlide(dir);
                this.rotateSlide(dir);
            }));
        };
        this.listenForMoveToNextSubj = () => {
            return this.params.moveToNextSlideSubj
                .pipe(takeUntil(this.ngUnsub), filter(() => !this.checkIfSliceboxCanAnimate()), tap(() => {
                let dir = "next";
                this.params.isAnimating = true;
                this.determineNextSlide(dir);
                this.rotateSlide(dir);
            }));
        };
    }
    generateClassPrefix(prefix) {
        return (val) => {
            return prefix + val;
        };
    }
    setSliceBoxDims() {
        if (this.params.sliceboxSizeUseProvidedValues) {
            if (!this.params.sliceboxSize.height || !this.params.sliceboxSize.width) {
                throw new Error('you have indicated that you want to use provided values for width and height for the size of the slicebox, please provide them in the sliceboxSize or set sliceboxSizeUseProvidedValues to false');
            }
        }
        else {
            this.params.sliceboxSize.height = retriveValueFromCSSUnit(this.targetPerspectiveComputedStyle.getPropertyValue('height'));
            this.params.sliceboxSize.width = retriveValueFromCSSUnit(this.targetPerspectiveComputedStyle.getPropertyValue('width'));
        }
    }
    determineNextSlide(dir, jumpTo) {
        if (typeof jumpTo === "number") {
            this.params.current.index = jumpTo;
        }
        else if (dir === 'next') {
            this.params.current.index =
                this.params.current.index < this.params.itemsCount - 1
                    ? this.params.current.index + 1
                    : 0;
        }
        else if (dir === 'prev') {
            this.params.current.index =
                this.params.current.index > 0
                    ? this.params.current.index - 1
                    : this.params.itemsCount - 1;
        }
        this.determineNextRotation(dir);
    }
    updateDispersionPoints(cuboid, resizing = false) {
        cuboid.transitionStartTop = cuboid.style.top;
        cuboid.transitionStartLeft = cuboid.style.left;
        if (!resizing) {
            if (cuboid.o === 'h') {
                let base = retriveValueFromCSSUnit(cuboid.style.top);
                cuboid.style.top = cuboid.appliedDisperseFactor + base + 'px';
            }
            else if (cuboid.o === 'v') {
                let base = retriveValueFromCSSUnit(cuboid.style.left);
                cuboid.style.left = cuboid.appliedDisperseFactor + base + 'px';
            }
        }
    }
    setupImagesBeforeRotation(cuboid, dir) {
        this.showImageCuboid(cuboid, cuboid.prev.index, 1);
        if (dir) {
            this.showImageCuboid(cuboid, cuboid.current.index, dir === "next" ? 2 : 4);
        }
    }
    configureMainCuboidStyle(cuboid) {
        let middlepos = Math.ceil(cuboid.cuboidsCount / 2);
        let positionStyle = cuboid.pos < middlepos
            ? {
                zIndex: ((cuboid.pos + 1) * 100).toString(),
                left: (cuboid.o === 'v' ? cuboid.size.width * cuboid.pos : 0) + 'px',
                top: (cuboid.o === 'v' ? 0 : cuboid.size.height * cuboid.pos) + 'px',
            }
            : {
                zIndex: ((cuboid.cuboidsCount - cuboid.pos) * 100).toString(),
                left: (cuboid.o === 'v' ? cuboid.size.width * cuboid.pos : 0) + 'px',
                top: (cuboid.o === 'v' ? 0 : cuboid.size.height * cuboid.pos) + 'px',
            };
        cuboid.style = {
            ...positionStyle,
        };
        ['width', 'height'].forEach((val) => {
            cuboid.style[val] = cuboid.size[val] + 'px';
        });
        // how much cuboid cuboid is going to move (left or top values)
        cuboid.appliedDisperseFactor =
            cuboid.disperseFactor * (cuboid.pos + 1 - middlepos);
    }
    configureSideCuboidStyles(cuboid, updateDimsOnly = false) {
        let rotationDirection = cuboid.reverse ? '' : '-'; //default negative
        let oppositeRotationDirection = cuboid.reverse ? '-' : ''; //default positive
        let measure = cuboid.o === 'v' ? cuboid.sliceboxSize.height : cuboid.sliceboxSize.width;
        cuboid.sidesStyles = {
            frontSide: {
                width: (cuboid.o === 'v'
                    ? cuboid.size.width + cuboid.extra
                    : cuboid.size.width) + 'px',
                height: (cuboid.o === 'v'
                    ? cuboid.size.height
                    : cuboid.size.height + cuboid.extra) + 'px',
                transform: 'rotate3d( 0, 1, 0, 0deg ) translate3d( 0, 0, ' +
                    measure / 2 +
                    'px )',
            },
            backSide: {
                width: cuboid.size.width + 'px',
                height: cuboid.size.height + 'px',
                transform: 'rotate3d( 0, 1, 0, ' +
                    oppositeRotationDirection +
                    '180deg ) translate3d( 0, 0, ' +
                    measure / 2 +
                    'px ) rotateZ( ' +
                    oppositeRotationDirection +
                    '180deg )',
            },
            rightSide: {
                width: measure + 'px',
                height: (cuboid.o === 'v'
                    ? cuboid.size.height
                    : cuboid.size.height + cuboid.extra) + 'px',
                left: (cuboid.o === 'v'
                    ? cuboid.size.width / 2 - cuboid.size.height / 2
                    : 0) + 'px',
                transform: 'rotate3d( 0, 1, 0, ' +
                    oppositeRotationDirection +
                    '90deg ) translate3d( 0, 0, ' +
                    cuboid.size.width / 2 +
                    'px )',
            },
            leftSide: {
                width: measure + 'px',
                height: (cuboid.o === 'v'
                    ? cuboid.size.height
                    : cuboid.size.height + cuboid.extra) + 'px',
                left: (cuboid.o === 'v'
                    ? cuboid.size.width / 2 - cuboid.size.height / 2
                    : 0) + 'px',
                transform: 'rotate3d( 0, 1, 0, ' +
                    rotationDirection +
                    '90deg ) translate3d( 0, 0, ' +
                    cuboid.size.width / 2 +
                    'px )',
            },
            topSide: {
                width: (cuboid.o === 'v'
                    ? cuboid.size.width + cuboid.extra
                    : cuboid.size.width) + 'px',
                top: (cuboid.o === 'v'
                    ? 0
                    : cuboid.size.height / 2 - cuboid.size.width / 2) + 'px',
                height: measure + 'px',
                transform: 'rotate3d( 1, 0, 0, ' +
                    oppositeRotationDirection +
                    '90deg ) translate3d( 0, 0, ' +
                    cuboid.size.height / 2 +
                    'px )',
            },
            bottomSide: {
                width: (cuboid.o === 'v'
                    ? cuboid.size.width + cuboid.extra
                    : cuboid.size.width) + 'px',
                top: (cuboid.o === 'v'
                    ? 0
                    : cuboid.size.height / 2 - cuboid.size.width / 2) + 'px',
                height: measure + 'px',
                transform: 'rotate3d( 1, 0, 0, ' +
                    rotationDirection +
                    '90deg ) translate3d( 0, 0, ' +
                    cuboid.size.height / 2 +
                    'px )',
            },
        };
        [
            'frontSide',
            'backSide',
            'rightSide',
            'leftSide',
            'topSide',
            'bottomSide',
        ].forEach((otherVal) => {
            if (updateDimsOnly) {
                delete cuboid.sidesStyles[otherVal].transform;
            }
            let myVal = cuboid[otherVal];
            Object.assign(myVal.style, cuboid.sidesStyles[otherVal]);
        });
    }
    ngAfterViewInit() {
        this.firstInit();
        this.listenForMoveToNextSubj().subscribe();
        this.listenForToggleAutoPlaySubj().subscribe();
        this.listenForMoveToPrevSubj().subscribe();
        this.listenForJumpToSlideSubj().subscribe();
    }
    ngOnDestroy() {
        this.ngUnsub.next();
        this.ngUnsub.complete();
    }
}
WmlSliceboxComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.3", ngImport: i0, type: WmlSliceboxComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
WmlSliceboxComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.3", type: WmlSliceboxComponent, selector: "wml-slicebox", inputs: { params: "params" }, host: { properties: { "class": "this.myClass" } }, viewQueries: [{ propertyName: "targetPerspective", first: true, predicate: ["targetPerspective"], descendants: true }], ngImport: i0, template: "<div [class]=\"classPrefix('MainPod')\">\r\n  <section #targetPerspective [ngStyle]=\"perspective.style\" [class]=\"classPrefix('Pod1') + ' sb-perspective'\">\r\n    <div    (transitionend)=\"finishResizing($event,cuboid)\" [class]=\"cuboid.class\" [ngStyle]=cuboid.style *ngFor=\"let cuboid of $any(params._cuboids)\">\r\n      <div   [ngStyle]=\"cuboid.frontSide.style\"  class=\"sb-side frontSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.backSide.style\"   class=\"sb-side backSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.rightSide.style\"  class=\"sb-side rightSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.leftSide.style\"   class=\"sb-side leftSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.topSide.style\"    class=\"sb-side topSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.bottomSide.style\" class=\"sb-side bottomSide\" ></div>\r\n    </div>\r\n  </section>\r\n</div>\r\n", styles: [":host{--vertical-rotate:-1;--horizontal-rotate:0;--time-for-one-cuboid-rotation:4s;--reverse-deg-end:90deg;--disperse-speed:5s;--animation-easing:ease;--side-background-color:#222}@keyframes wmlsliceboxkeyframe0{0%{transform:rotate3d(var(--vertical-rotate),var(--horizontal-rotate),0,0)}to{transform:rotate3d(var(--vertical-rotate),var(--horizontal-rotate),0,var(--reverse-deg-end))}}@keyframes wmlsliceboxkeyframe1{0%{top:var(--animate-in-top);left:var(--animate-in-left)}50%{top:var(--animate-out-top);left:var(--animate-out-left)}to{top:var(--animate-in-top);left:var(--animate-in-left)}}:host.WmlSliceboxView{display:block;height:100%}:host.WmlSliceboxView .WmlSliceboxMainPod{display:flex;height:100%}:host.WmlSliceboxView .WmlSliceboxPod0Btn0{justify-self:flex-start;position:absolute;left:-10px}:host.WmlSliceboxView .WmlSliceboxPod1{width:100%;height:100%}:host.WmlSliceboxView .WmlSliceboxPod1Rotate0{transition:left var(--disperse-speed),top var(--disperse-speed);animation-name:wmlsliceboxkeyframe0;animation-duration:var(--time-for-one-cuboid-rotation);animation-timing-function:var(--animation-easing)}:host .sb-perspective{position:relative}:host .sb-perspective>div{position:absolute;transform-style:preserve-3d;-webkit-backface-visibility:hidden;backface-visibility:hidden}:host .sb-side{margin:0;display:block;position:absolute;-webkit-backface-visibility:hidden;backface-visibility:hidden;background-repeat:no-repeat;transform-style:preserve-3d;background-color:var(--side-background-color)}:host .frontSide{background-color:transparent;transition:all .5s!important}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.3", ngImport: i0, type: WmlSliceboxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'wml-slicebox', changeDetection: ChangeDetectionStrategy.OnPush, template: "<div [class]=\"classPrefix('MainPod')\">\r\n  <section #targetPerspective [ngStyle]=\"perspective.style\" [class]=\"classPrefix('Pod1') + ' sb-perspective'\">\r\n    <div    (transitionend)=\"finishResizing($event,cuboid)\" [class]=\"cuboid.class\" [ngStyle]=cuboid.style *ngFor=\"let cuboid of $any(params._cuboids)\">\r\n      <div   [ngStyle]=\"cuboid.frontSide.style\"  class=\"sb-side frontSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.backSide.style\"   class=\"sb-side backSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.rightSide.style\"  class=\"sb-side rightSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.leftSide.style\"   class=\"sb-side leftSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.topSide.style\"    class=\"sb-side topSide\" ></div>\r\n      <div   [ngStyle]=\"cuboid.bottomSide.style\" class=\"sb-side bottomSide\" ></div>\r\n    </div>\r\n  </section>\r\n</div>\r\n", styles: [":host{--vertical-rotate:-1;--horizontal-rotate:0;--time-for-one-cuboid-rotation:4s;--reverse-deg-end:90deg;--disperse-speed:5s;--animation-easing:ease;--side-background-color:#222}@keyframes wmlsliceboxkeyframe0{0%{transform:rotate3d(var(--vertical-rotate),var(--horizontal-rotate),0,0)}to{transform:rotate3d(var(--vertical-rotate),var(--horizontal-rotate),0,var(--reverse-deg-end))}}@keyframes wmlsliceboxkeyframe1{0%{top:var(--animate-in-top);left:var(--animate-in-left)}50%{top:var(--animate-out-top);left:var(--animate-out-left)}to{top:var(--animate-in-top);left:var(--animate-in-left)}}:host.WmlSliceboxView{display:block;height:100%}:host.WmlSliceboxView .WmlSliceboxMainPod{display:flex;height:100%}:host.WmlSliceboxView .WmlSliceboxPod0Btn0{justify-self:flex-start;position:absolute;left:-10px}:host.WmlSliceboxView .WmlSliceboxPod1{width:100%;height:100%}:host.WmlSliceboxView .WmlSliceboxPod1Rotate0{transition:left var(--disperse-speed),top var(--disperse-speed);animation-name:wmlsliceboxkeyframe0;animation-duration:var(--time-for-one-cuboid-rotation);animation-timing-function:var(--animation-easing)}:host .sb-perspective{position:relative}:host .sb-perspective>div{position:absolute;transform-style:preserve-3d;-webkit-backface-visibility:hidden;backface-visibility:hidden}:host .sb-side{margin:0;display:block;position:absolute;-webkit-backface-visibility:hidden;backface-visibility:hidden;background-repeat:no-repeat;transform-style:preserve-3d;background-color:var(--side-background-color)}:host .frontSide{background-color:transparent;transition:all .5s!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; }, propDecorators: { params: [{
                type: Input,
                args: ['params']
            }], targetPerspective: [{
                type: ViewChild,
                args: ['targetPerspective']
            }], myClass: [{
                type: HostBinding,
                args: ['class']
            }] } });
class WmlSliceboxDefaults {
    constructor() {
        this.prev = {
            index: 0,
        };
        this.current = {
            index: 0,
        };
        this.sliceboxSizeUseProvidedValues = false;
        this.orientation = 'v';
        this.perspective = 10000;
        this.interval = 3000;
        this.cuboidsCount = 9;
        this.disperseFactor = 20;
        this.colorHiddenSides = '#222';
        this.sequentialFactor = 350;
        this.speed = 15660;
        this.easing = 'ease-out';
        this.autoplay = true;
        this.onBeforeChange = function (position) { };
        this.onAfterChange = function (position) { };
        this.onReady = function () { };
        this.reverse = false;
        this.images = [];
        this.disperseSpeed = this.disperseSpeed ?? this.speed;
    }
}
export class WmlSliceboxParams extends WmlSliceboxDefaults {
    constructor(params = {}) {
        super();
        this.sliceboxSize = {
            height: 500,
            width: 500,
        };
        this.resizeDelay = 1000;
        this.isAnimating = false;
        this.isFinishedResizing = true;
        this.isReady = false;
        this.animationDuration = 3200;
        this.moveToNextSlideSubj = new Subject();
        this.moveToPrevSlideSubj = new Subject();
        this.jumpToSlideSubj = new Subject();
        Object.assign(this, {
            ...params,
        });
        this._reverse = this.reverse;
        this.nextRotationDegree = this.nextRotationDegree ?? (this._reverse ? '-90deg' : '90deg');
        let degree = this.nextRotationDegree;
        degree = retriveValueFromCSSUnit(degree);
        degree *= -1;
        degree += "deg";
        this.prevRotationDegree = this.prevRotationDegree ?? degree;
    }
}
class WmlSliceboxCuboidParams extends WmlSliceboxDefaults {
    constructor(params = {}) {
        super();
        this.class = '';
        this.classes = [];
        // updateClassString:any=()=>{}
        this.updateClassString = updateClassString(this, 'class', 'classes');
        this.side = 1;
        this.isRotateComplete = false;
        this.isInDispersion = false;
        this.frontSide = new WMLUIProperty();
        this.backSide = new WMLUIProperty();
        this.rightSide = new WMLUIProperty();
        this.leftSide = new WMLUIProperty();
        this.topSide = new WMLUIProperty();
        this.bottomSide = new WMLUIProperty();
        Object.assign(this, {
            ...params,
        });
    }
}
export class WmlSliceboxImg extends WMLImage {
    constructor(params = {}) {
        super(params);
        Object.assign(this, {
            ...params,
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid21sLXNsaWNlYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3dtbC1zbGljZWJveC9zcmMvbGliL3dtbC1zbGljZWJveC93bWwtc2xpY2Vib3guY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvd21sLXNsaWNlYm94L3NyYy9saWIvd21sLXNsaWNlYm94L3dtbC1zbGljZWJveC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxVQUFVO0FBQ1YsT0FBTyxFQUNMLHVCQUF1QixFQUV2QixTQUFTLEVBRVQsV0FBVyxFQUNYLEtBQUssRUFFTCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLFNBQVMsRUFDVCxRQUFRLEVBQ1IsYUFBYSxHQUNkLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsT0FBTztBQUNQLE9BQU8sRUFDTCxhQUFhLEVBQ2IsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsRUFDUixFQUFFLEVBQ0YsU0FBUyxFQUNULE9BQU8sRUFDUCxTQUFTLEVBQ1QsR0FBRyxFQUNILEtBQUssR0FDTixNQUFNLE1BQU0sQ0FBQzs7O0FBRWQsSUFBSSx1QkFBdUIsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO0lBQzVDLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxDQUFDLENBQUM7QUFDRixJQUFJLGlCQUFpQixHQUFDLENBQUMsR0FBTyxFQUFDLGNBQXFCLEVBQUMsZ0JBQXVCLEVBQUMsRUFBRTtJQUU3RSxPQUFPLENBQUMsR0FBVSxFQUFDLE9BQW9CLEtBQUssRUFBQyxFQUFFO1FBQzNDLElBQUksT0FBTyxHQUFDLGNBQWMsQ0FBQTtRQUMxQixJQUFJLFNBQVMsR0FBQyxnQkFBZ0IsQ0FB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QUM5QixlQUFVLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQTlCL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDbEIsR0FBRyxNQUFNO1NBQ1YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQTRCRjtBQUVELE1BQU0sT0FBTyxjQUFlLFNBQVEsUUFBUTtJQUMxQyxZQUFZLFNBQWtDLEVBQUU7UUFDOUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDbEIsR0FBRyxNQUFNO1NBQ1YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUtGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYW5ndWxhclxyXG5pbXBvcnQge1xyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEhvc3RCaW5kaW5nLFxyXG4gIElucHV0LFxyXG4gIFJlbmRlcmVyMixcclxuICBWaWV3Q2hpbGQsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgV01MQnV0dG9uLFxyXG4gIFdNTEltYWdlLFxyXG4gIFdNTFVJUHJvcGVydHksXHJcbn0gZnJvbSAnQHdpbmRtaWxsY29kZS93bWwtY29tcG9uZW50cy1iYXNlJztcclxuXHJcbi8vIHJ4anNcclxuaW1wb3J0IHtcclxuICBjb21iaW5lTGF0ZXN0LFxyXG4gIGNvbmNhdE1hcCxcclxuICBkZWJvdW5jZVRpbWUsXHJcbiAgZmlsdGVyLFxyXG4gIGZyb21FdmVudCxcclxuICBpbnRlcnZhbCxcclxuICBvZixcclxuICBzdGFydFdpdGgsXHJcbiAgU3ViamVjdCxcclxuICB0YWtlVW50aWwsXHJcbiAgdGFwLFxyXG4gIHRpbWVyLFxyXG59IGZyb20gJ3J4anMnO1xyXG5cclxubGV0IHJldHJpdmVWYWx1ZUZyb21DU1NVbml0ID0gKHN0cjogc3RyaW5nKSA9PiB7XHJcbiAgcmV0dXJuIHBhcnNlRmxvYXQoc3RyLm1hdGNoKC8tP1xcZCsvKVswXSk7XHJcbn07XHJcbmxldCB1cGRhdGVDbGFzc1N0cmluZz0ob2JqOmFueSxteUNsYXNzRGVmYXVsdDpzdHJpbmcsY2xhc3NMaXN0RGVmYXVsdDpzdHJpbmcpPT57XHJcblxyXG4gIHJldHVybiAodmFsOnN0cmluZyx0eXBlOlwiYWRkXCJ8XCJyZW1vdmVcIj1cImFkZFwiKT0+e1xyXG4gICAgICBsZXQgbXlDbGFzcz1teUNsYXNzRGVmYXVsdFxyXG4gICAgICBsZXQgY2xhc3NMaXN0PWNsYXNzTGlzdERlZmF1bHRcclxuICAgICAgaWYodHlwZSA9PT0gXCJhZGRcIil7XHJcbiAgICAgICAgb2JqW2NsYXNzTGlzdF0ucHVzaCh2YWwpXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZih0eXBlID09PSBcInJlbW92ZVwiKXtcclxuICAgICAgICBvYmpbY2xhc3NMaXN0XSA9IChvYmpbY2xhc3NMaXN0XSlcclxuICAgICAgICAuZmlsdGVyKChteUNsYXNzKT0+e1xyXG4gICAgICAgICAgcmV0dXJuIG15Q2xhc3MgIT09IHZhbFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgb2JqW215Q2xhc3NdID0gb2JqW2NsYXNzTGlzdF1cclxuICAgICAgLnJlZHVjZSgoYWNjLHgsaSk9PntcclxuICAgICAgICByZXR1cm4gYWNjKyBcIiBcIiArICB4XHJcbiAgICAgIH0sXCJcIilcclxuICAgIH1cclxufVxyXG5cclxuLy8gbWlzY1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICd3bWwtc2xpY2Vib3gnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi93bWwtc2xpY2Vib3guY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3dtbC1zbGljZWJveC5jb21wb25lbnQuc2NzcyddLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgV21sU2xpY2Vib3hDb21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIGNkcmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuICAgIHB1YmxpYyByZW5kZXJlcjI6IFJlbmRlcmVyMixcclxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZlxyXG4gICkge31cclxuXHJcbiAgZ2VuZXJhdGVDbGFzc1ByZWZpeChwcmVmaXg6IHN0cmluZykge1xyXG4gICAgcmV0dXJuICh2YWw6IHN0cmluZykgPT4ge1xyXG4gICAgICByZXR1cm4gcHJlZml4ICsgdmFsO1xyXG4gICAgfTtcclxuICB9XHJcbiAgY2xhc3NQcmVmaXggPSB0aGlzLmdlbmVyYXRlQ2xhc3NQcmVmaXgoJ1dtbFNsaWNlYm94Jyk7XHJcbiAgdGFyZ2V0UGVyc3BlY3RpdmVDb21wdXRlZFN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uO1xyXG4gIEBJbnB1dCgncGFyYW1zJykgcGFyYW1zOiBXbWxTbGljZWJveFBhcmFtcyA7XHJcbiAgQFZpZXdDaGlsZCgndGFyZ2V0UGVyc3BlY3RpdmUnKSB0YXJnZXRQZXJzcGVjdGl2ZTogRWxlbWVudFJlZjtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIG15Q2xhc3M6IHN0cmluZyA9IHRoaXMuY2xhc3NQcmVmaXgoYFZpZXdgKTtcclxuICBuZ1Vuc3ViID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcclxuICBwZXJzcGVjdGl2ZSA9IG5ldyBXTUxVSVByb3BlcnR5KCk7XHJcbiAgLy8gVE9ETyBwb3NzaWJsZSBkZXZlbG9wbWVudCBubyB3YXkgdG8gcGF1c2UgdHJhbnNpdGlvbnMsIG1heSByZWZhY3RvciB0byB1c2UgYW5pbWF0aW9uc1xyXG4gIHRvZ2dsZVBhdXNlQnRuID0gbmV3IFdNTEJ1dHRvbih7XHJcbiAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICB0aGlzLnBhcmFtcy5fY3Vib2lkcz8uZm9yRWFjaCgoY3Vib2lkKSA9PiB7XHJcbiAgICAgICAgY3Vib2lkLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSc7XHJcbiAgICAgICAgY3Vib2lkLnN0eWxlLmFuaW1hdGlvblBsYXlTdGF0ZSA9XHJcbiAgICAgICAgICBjdWJvaWQuc3R5bGUuYW5pbWF0aW9uUGxheVN0YXRlICE9PSAncGF1c2VkJyA/ICdwYXVzZWQnIDogJ3J1bm5pbmcnO1xyXG4gICAgICAgIC8vIGN1Ym9pZC5zdHlsZS5hbmltYXRpb25QbGF5U3RhdGUgPSBcInBhdXNlZFwiXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmNkcmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG4gIGNhY2hlSW1hZ2VzID0gKCkgPT4ge1xyXG4gICAgbGV0IHNhdmVkSW1hZ2VzJCA9IHRoaXMucGFyYW1zLmltYWdlcy5tYXAoKHNsaWNlYm94SW1nKSA9PiB7XHJcbiAgICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICBpbWFnZS5jcm9zc09yaWdpbiA9ICdBbm9ueW1vdXMnO1xyXG4gICAgICBpbWFnZS5zdHlsZS5oZWlnaHQgPSB0aGlzLnBhcmFtcy5zbGljZWJveFNpemUuaGVpZ2h0ICsgJ3B4JztcclxuICAgICAgaW1hZ2Uuc3R5bGUud2lkdGggPSB0aGlzLnBhcmFtcy5zbGljZWJveFNpemUud2lkdGggKyAncHgnO1xyXG4gICAgICB0aGlzLmNkcmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgbGV0IHNhdmVkSW1hZ2UkID0gZnJvbUV2ZW50KGltYWdlLCAnbG9hZCcpLnBpcGUoXHJcbiAgICAgICAgdGFrZVVudGlsKHRoaXMubmdVbnN1YiksXHJcbiAgICAgICAgdGFwKChyZXMpID0+IHtcclxuICAgICAgICAgIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID1cclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlcjIuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMucGFyYW1zLnNsaWNlYm94U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgICBjYW52YXMud2lkdGggPSB0aGlzLnBhcmFtcy5zbGljZWJveFNpemUud2lkdGg7XHJcbiAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAgIHNsaWNlYm94SW1nLmNhY2hlZFNyYyA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICAgIGltYWdlLnNyYyA9IHNsaWNlYm94SW1nLnNyYztcclxuICAgICAgcmV0dXJuIHNhdmVkSW1hZ2UkO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChzYXZlZEltYWdlcyQpO1xyXG4gIH07XHJcblxyXG4gIGhvc3RTdHlsZSA9KCk9PiBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XHJcbiAgdXBkYXRlQ3NzVmFycyA9ICgpID0+IHtcclxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgJy0tdGltZS1mb3Itb25lLWN1Ym9pZC1yb3RhdGlvbicsXHJcbiAgICAgIHRoaXMucGFyYW1zLnNwZWVkIC8gMTAwMCArICdzJ1xyXG4gICAgKTtcclxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgJy0tdmVydGljYWwtcm90YXRlJyxcclxuICAgICAgdGhpcy5wYXJhbXMub3JpZW50YXRpb24gPT09ICd2JyA/IC0xIDogMFxyXG4gICAgKTtcclxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgJy0taG9yaXpvbnRhbC1yb3RhdGUnLFxyXG4gICAgICB0aGlzLnBhcmFtcy5vcmllbnRhdGlvbiA9PT0gJ2gnID8gLTEgOiAwXHJcbiAgICApO1xyXG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFxyXG4gICAgICAnLS1yZXZlcnNlLWRlZy1lbmQnLFxyXG4gICAgICB0aGlzLnBhcmFtcy5uZXh0Um90YXRpb25EZWdyZWUgPz9cclxuICAgICAgICB0aGlzLmhvc3RTdHlsZSgpLmdldFByb3BlcnR5VmFsdWUoJy0tcmV2ZXJzZS1kZWctZW5kJylcclxuICAgICk7XHJcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXHJcbiAgICAgICctLWRpc3BlcnNlLXNwZWVkJyxcclxuICAgICAgdGhpcy5wYXJhbXMuZGlzcGVyc2VTcGVlZCAvIDEwMDAgKyAncydcclxuICAgICk7XHJcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXHJcbiAgICAgICctLWFuaW1hdGlvbi1lYXNpbmcnLFxyXG4gICAgICB0aGlzLnBhcmFtcy5lYXNpbmdcclxuICAgICk7XHJcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXHJcbiAgICAgICctLXNpZGUtYmFja2dyb3VuZC1jb2xvcicsXHJcbiAgICAgIHRoaXMucGFyYW1zLmNvbG9ySGlkZGVuU2lkZXNcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5jZHJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgfTtcclxuXHJcbiAgc2V0U2xpY2VCb3hEaW1zKCkge1xyXG4gICAgaWYgKHRoaXMucGFyYW1zLnNsaWNlYm94U2l6ZVVzZVByb3ZpZGVkVmFsdWVzKSB7XHJcbiAgICAgIGlmICghdGhpcy5wYXJhbXMuc2xpY2Vib3hTaXplLmhlaWdodCB8fCAhdGhpcy5wYXJhbXMuc2xpY2Vib3hTaXplLndpZHRoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgJ3lvdSBoYXZlIGluZGljYXRlZCB0aGF0IHlvdSB3YW50IHRvIHVzZSBwcm92aWRlZCB2YWx1ZXMgZm9yIHdpZHRoIGFuZCBoZWlnaHQgZm9yIHRoZSBzaXplIG9mIHRoZSBzbGljZWJveCwgcGxlYXNlIHByb3ZpZGUgdGhlbSBpbiB0aGUgc2xpY2Vib3hTaXplIG9yIHNldCBzbGljZWJveFNpemVVc2VQcm92aWRlZFZhbHVlcyB0byBmYWxzZSdcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBhcmFtcy5zbGljZWJveFNpemUuaGVpZ2h0ID0gcmV0cml2ZVZhbHVlRnJvbUNTU1VuaXQoXHJcbiAgICAgICAgdGhpcy50YXJnZXRQZXJzcGVjdGl2ZUNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0JylcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5wYXJhbXMuc2xpY2Vib3hTaXplLndpZHRoID0gcmV0cml2ZVZhbHVlRnJvbUNTU1VuaXQoXHJcbiAgICAgICAgdGhpcy50YXJnZXRQZXJzcGVjdGl2ZUNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2xpY2VCb3hJbml0ID0gKCkgPT4ge1xyXG4gICAgdGhpcy5wYXJhbXMuaXRlbXNDb3VudCA9IHRoaXMucGFyYW1zLmltYWdlcy5sZW5ndGg7XHJcbiAgICB0aGlzLnRhcmdldFBlcnNwZWN0aXZlQ29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoXHJcbiAgICAgIHRoaXMudGFyZ2V0UGVyc3BlY3RpdmUubmF0aXZlRWxlbWVudFxyXG4gICAgKTtcclxuICAgIHRoaXMuc2V0U2xpY2VCb3hEaW1zKCk7XHJcbiAgICB0aGlzLnBhcmFtcy5pc1JlYWR5ID0gdHJ1ZTtcclxuICAgIHJldHVybiB0aGlzLnN0YXJ0U2xpZGVTaG93KCk7XHJcbiAgfTtcclxuXHJcbiAgc3RvcFNsaWRlU2hvd1N1YmogPW5ldyBTdWJqZWN0PHZvaWQ+KClcclxuICBzdGFydFNsaWRlU2hvdyA9ICgpID0+IHtcclxuXHJcbiAgICBsZXQgb2JzJCA9IHRoaXMucGFyYW1zLmF1dG9wbGF5XHJcbiAgICAgID8gaW50ZXJ2YWwodGhpcy5wYXJhbXMuaW50ZXJ2YWwpXHJcbiAgICAgIDogdGltZXIodGhpcy5wYXJhbXMuaW50ZXJ2YWwpO1xyXG5cclxuXHJcbiAgICByZXR1cm4gb2JzJC5waXBlKFxyXG4gICAgICBzdGFydFdpdGgoMCksXHJcbiAgICAgIHRha2VVbnRpbCh0aGlzLnN0b3BTbGlkZVNob3dTdWJqKSxcclxuICAgICAgdGFrZVVudGlsKHRoaXMubmdVbnN1YiksXHJcblxyXG4gICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMubmF2aWdhdGUodGhpcy5wYXJhbXMuYXV0b3BsYXkgPyAnbmV4dCc6bnVsbCk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIG5hdmlnYXRlID0gKGRpcjogJ25leHQnIHwgJ3ByZXYnLCBqdW1wVG8/KSA9PiB7XHJcbiAgICB0aGlzLnN0b3BTbGlkZVNob3dTdWJqLm5leHQoKVxyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLmNoZWNrSWZTbGljZWJveENhbkFuaW1hdGUoKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBhcmFtcy5wcmV2LmluZGV4ID0gdGhpcy5wYXJhbXMuY3VycmVudC5pbmRleDtcclxuICAgIHRoaXMuZGV0ZXJtaW5lTmV4dFNsaWRlKGRpcixqdW1wVG8pO1xyXG4gICAgdGhpcy5zZXR1cEN1Ym9pZHMoKTtcclxuICAgIHRoaXMuc2V0dXBTbGlkZXMoKTtcclxuICB9O1xyXG5cclxuICBzZXR1cEN1Ym9pZHMgPSAoKSA9PiB7XHJcbiAgICBsZXQgYm94U3R5bGU6IGFueSA9IHtcclxuICAgICAgd2lkdGg6IHRoaXMucGFyYW1zLnNsaWNlYm94U2l6ZS53aWR0aCxcclxuICAgICAgaGVpZ2h0OiB0aGlzLnBhcmFtcy5zbGljZWJveFNpemUuaGVpZ2h0LFxyXG4gICAgICBwZXJzcGVjdGl2ZTogdGhpcy5wYXJhbXMucGVyc3BlY3RpdmUgKyAncHgnLFxyXG4gICAgfTtcclxuICAgIHRoaXMucGVyc3BlY3RpdmUuc3R5bGUgPSBib3hTdHlsZTtcclxuICAgIGxldCBjb25maWcgPSB7XHJcbiAgICAgIC4uLnRoaXMucGFyYW1zLFxyXG4gICAgICBpdGVtczogdGhpcy5wYXJhbXMuaW1hZ2VzLFxyXG4gICAgICBwcmV2OiB0aGlzLnBhcmFtcy5wcmV2LFxyXG4gICAgICBjdXJyZW50OiB0aGlzLnBhcmFtcy5jdXJyZW50LFxyXG4gICAgICBvOiB0aGlzLnBhcmFtcy5vcmllbnRhdGlvbixcclxuICAgICAgcmV2ZXJzZTp0aGlzLnBhcmFtcy5fcmV2ZXJzZVxyXG4gICAgfTtcclxuICAgIHRoaXMucGFyYW1zLl9jdWJvaWRzID0gQXJyYXkodGhpcy5wYXJhbXMuY3Vib2lkc0NvdW50KVxyXG4gICAgICAuZmlsbChudWxsKVxyXG4gICAgICAubWFwKChudWxsVmFsLCBpbmRleDApID0+IHtcclxuICAgICAgICBsZXQgY3Vib2lkID0gbmV3IFdtbFNsaWNlYm94Q3Vib2lkUGFyYW1zKHtcclxuICAgICAgICAgIHBvczogaW5kZXgwLFxyXG4gICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2V0Q3Vib2lkU2l6ZShjdWJvaWQpO1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJlQ3Vib2lkU3R5bGVzKGN1Ym9pZCk7XHJcbiAgICAgICAgcmV0dXJuIGN1Ym9pZDtcclxuICAgICAgfSk7XHJcbiAgICB0aGlzLmNkcmVmLmRldGVjdENoYW5nZXMoKTtcclxuICB9O1xyXG5cclxuICBzZXR1cFNsaWRlcyA9ICgpID0+IHtcclxuXHJcbiAgICAgIGlmKHRoaXMucGFyYW1zLmF1dG9wbGF5KXtcclxuICAgICAgICB0aGlzLnBhcmFtcy5pc0FuaW1hdGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVTbGlkZShcIm5leHRcIik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZighdGhpcy5wYXJhbXMuYXV0b3BsYXkpIHtcclxuICAgICAgICB0aGlzLnBhcmFtcy5fY3Vib2lkcy5mb3JFYWNoKChjdWJvaWQpID0+IHtcclxuICAgICAgICAgIHRoaXMuc2V0dXBJbWFnZXNCZWZvcmVSb3RhdGlvbihjdWJvaWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gIH07XHJcbiAgc2hvd0ltYWdlQ3Vib2lkID0gKGN1Ym9pZDogV21sU2xpY2Vib3hDdWJvaWRQYXJhbXMsIGltZ1BvcywgY3Vib2lkU2lkZSkgPT4ge1xyXG5cclxuICAgIGxldCBzaWRlSWR4O1xyXG4gICAgbGV0IGl0ZW0gPSBjdWJvaWQuaW1hZ2VzW2ltZ1Bvc107XHJcbiAgICBsZXQgaW1nUGFyYW0gPSB7XHJcbiAgICAgICdiYWNrZ3JvdW5kLXNpemUnOlxyXG4gICAgICAgIGN1Ym9pZC5zbGljZWJveFNpemUud2lkdGggKyAncHggJyArIGN1Ym9pZC5zbGljZWJveFNpemUuaGVpZ2h0ICsgJ3B4JyxcclxuICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiAndXJsKCcgKyBpdGVtLmNhY2hlZFNyYyArICcpJyxcclxuICAgIH07XHJcblxyXG4gICAgc3dpdGNoIChjdWJvaWRTaWRlKSB7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICBzaWRlSWR4ID0gMDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHNpZGVJZHggPSBjdWJvaWQubyA9PT0gJ3YnID8gNCA6IDI7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICBzaWRlSWR4ID0gMTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA0OlxyXG4gICAgICAgIHNpZGVJZHggPSBjdWJvaWQubyA9PT0gJ3YnID8gNSA6IDM7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaW1nUGFyYW1bJ2JhY2tncm91bmQtcG9zaXRpb24nXSA9XHJcbiAgICAgIGN1Ym9pZC5vID09PSAndidcclxuICAgICAgICA/IC0oY3Vib2lkLnBvcyAqIGN1Ym9pZC5zaXplLndpZHRoKSArICdweCAwcHgnXHJcbiAgICAgICAgOiAnMHB4IC0nICsgY3Vib2lkLnBvcyAqIGN1Ym9pZC5zaXplLmhlaWdodCArICdweCc7XHJcblxyXG4gICAgbGV0IHZhbDogV01MVUlQcm9wZXJ0eSA9XHJcbiAgICAgIGN1Ym9pZFtcclxuICAgICAgICBbXHJcbiAgICAgICAgICAnZnJvbnRTaWRlJyxcclxuICAgICAgICAgICdiYWNrU2lkZScsXHJcbiAgICAgICAgICAncmlnaHRTaWRlJyxcclxuICAgICAgICAgICdsZWZ0U2lkZScsXHJcbiAgICAgICAgICAndG9wU2lkZScsXHJcbiAgICAgICAgICAnYm90dG9tU2lkZScsXHJcbiAgICAgICAgXVtzaWRlSWR4XVxyXG4gICAgICBdO1xyXG4gICAgT2JqZWN0LmFzc2lnbih2YWwuc3R5bGUsIGltZ1BhcmFtKTtcclxuICAgIC8vIHZhbC52YWx1ZSA9IGl0ZW0uc3JjXHJcbiAgICB0aGlzLmNkcmVmLmRldGVjdENoYW5nZXMoKTtcclxuICB9O1xyXG4gIGNoZWNrSWZTbGljZWJveENhbkFuaW1hdGUgPSgpID0+e1xyXG4gICAgbGV0IHJlc3VsdCA9IXRoaXMucGFyYW1zLmlzRmluaXNoZWRSZXNpemluZyB8fFxyXG4gICAgICB0aGlzLnBhcmFtcy5pc0FuaW1hdGluZyB8fFxyXG4gICAgICAhdGhpcy5wYXJhbXMuaXNSZWFkeSB8fFxyXG4gICAgICB0aGlzLnBhcmFtcy5pdGVtc0NvdW50IDwgMjtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0XHJcbiAgfVxyXG4gIGRldGVybWluZU5leHRSb3RhdGlvbiA9KGRpcjogV21sU2xpY2Vib3hEaXJlY3Rpb24pPT57XHJcbiAgICBpZihkaXIgPT09IFwicHJldlwiKSB7XHJcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgICAnLS1yZXZlcnNlLWRlZy1lbmQnLFxyXG4gICAgICAgIHRoaXMucGFyYW1zLnByZXZSb3RhdGlvbkRlZ3JlZVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFxyXG4gICAgICAgICctLXJldmVyc2UtZGVnLWVuZCcsXHJcbiAgICAgICAgdGhpcy5wYXJhbXMubmV4dFJvdGF0aW9uRGVncmVlXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGRldGVybWluZU5leHRTbGlkZSggZGlyOiBXbWxTbGljZWJveERpcmVjdGlvbixqdW1wVG8/OiBudW1iZXIpIHtcclxuXHJcbiAgICBpZiAodHlwZW9mIGp1bXBUbyA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICB0aGlzLnBhcmFtcy5jdXJyZW50LmluZGV4ID0ganVtcFRvO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZGlyID09PSAnbmV4dCcpIHtcclxuICAgICAgdGhpcy5wYXJhbXMuY3VycmVudC5pbmRleCA9XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuY3VycmVudC5pbmRleCA8IHRoaXMucGFyYW1zLml0ZW1zQ291bnQgLSAxXHJcbiAgICAgICAgICA/IHRoaXMucGFyYW1zLmN1cnJlbnQuaW5kZXggKyAxXHJcbiAgICAgICAgICA6IDA7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChkaXIgPT09ICdwcmV2JyApIHtcclxuICAgIHRoaXMucGFyYW1zLmN1cnJlbnQuaW5kZXggPVxyXG4gICAgICB0aGlzLnBhcmFtcy5jdXJyZW50LmluZGV4ID4gMFxyXG4gICAgICAgID8gdGhpcy5wYXJhbXMuY3VycmVudC5pbmRleCAtIDFcclxuICAgICAgICA6IHRoaXMucGFyYW1zLml0ZW1zQ291bnQgLSAxO1xyXG4gICAgICB9XHJcbiAgICB0aGlzLmRldGVybWluZU5leHRSb3RhdGlvbihkaXIpXHJcblxyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGlzcGVyc2lvblBvaW50cyhjdWJvaWQ6IFdtbFNsaWNlYm94Q3Vib2lkUGFyYW1zLHJlc2l6aW5nPWZhbHNlKSB7XHJcbiAgICBjdWJvaWQudHJhbnNpdGlvblN0YXJ0VG9wID0gY3Vib2lkLnN0eWxlLnRvcDtcclxuICAgIGN1Ym9pZC50cmFuc2l0aW9uU3RhcnRMZWZ0ID0gY3Vib2lkLnN0eWxlLmxlZnQ7XHJcbiAgICBpZighcmVzaXppbmcpIHtcclxuICAgICAgaWYgKGN1Ym9pZC5vID09PSAnaCcpIHtcclxuICAgICAgICBsZXQgYmFzZSA9IHJldHJpdmVWYWx1ZUZyb21DU1NVbml0KGN1Ym9pZC5zdHlsZS50b3ApO1xyXG4gICAgICAgIGN1Ym9pZC5zdHlsZS50b3AgPSBjdWJvaWQuYXBwbGllZERpc3BlcnNlRmFjdG9yICsgYmFzZSArICdweCc7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3Vib2lkLm8gPT09ICd2Jykge1xyXG4gICAgICAgIGxldCBiYXNlID0gcmV0cml2ZVZhbHVlRnJvbUNTU1VuaXQoY3Vib2lkLnN0eWxlLmxlZnQpO1xyXG4gICAgICAgIGN1Ym9pZC5zdHlsZS5sZWZ0ID0gY3Vib2lkLmFwcGxpZWREaXNwZXJzZUZhY3RvciArIGJhc2UgKyAncHgnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgcm90YXRlQ3Vib2lkID0gKFxyXG4gICAgY3Vib2lkOiBXbWxTbGljZWJveEN1Ym9pZFBhcmFtcyxcclxuICAgIG9uZVNjbmRCZnJDYWxsYWJhY2ssXHJcbiAgICBmaW5pc2hlZENhbGxiYWNrLFxyXG4gICAgZGlyPzpXbWxTbGljZWJveERpcmVjdGlvblxyXG4gICkgPT4ge1xyXG4gICAgY3Vib2lkLmlzUm90YXRlQ29tcGxldGUgPSBmYWxzZTtcclxuICAgIGN1Ym9pZC5pc0luRGlzcGVyc2lvbiA9IHRydWVcclxuICAgIHRoaXMuc2V0dXBJbWFnZXNCZWZvcmVSb3RhdGlvbihjdWJvaWQsZGlyKTtcclxuXHJcblxyXG4gICAgdGltZXIoY3Vib2lkLnNlcXVlbnRpYWxGYWN0b3IgKiBjdWJvaWQucG9zICsgMzApXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIHRha2VVbnRpbCh0aGlzLm5nVW5zdWIpLFxyXG5cclxuICAgICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVEaXNwZXJzaW9uUG9pbnRzKGN1Ym9pZCk7XHJcblxyXG4gICAgICAgICAgY3Vib2lkLnVwZGF0ZUNsYXNzU3RyaW5nKCdXbWxTbGljZWJveFBvZDFSb3RhdGUwJyk7XHJcbiAgICAgICAgICB0aGlzLmNkcmVmLmRldGVjdENoYW5nZXMoKTtcclxuXHJcbiAgICAgICAgICB0aW1lcihjdWJvaWQuc3BlZWQgLyAyKVxyXG4gICAgICAgICAgICAucGlwZShcclxuICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5uZ1Vuc3ViKSxcclxuICAgICAgICAgICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY3Vib2lkLmlzSW5EaXNwZXJzaW9uID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIGN1Ym9pZC5zdHlsZS50b3AgPSBjdWJvaWQudHJhbnNpdGlvblN0YXJ0VG9wO1xyXG4gICAgICAgICAgICAgICAgY3Vib2lkLnN0eWxlLmxlZnQgPSBjdWJvaWQudHJhbnNpdGlvblN0YXJ0TGVmdDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2RyZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgpO1xyXG5cclxuICAgICAgICAgIHRpbWVyKGN1Ym9pZC5zcGVlZCAtIGN1Ym9pZC5zcGVlZCAqIDAuMDc2MTkwNDc2MTkwNDc2MilcclxuICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMubmdVbnN1YiksXHJcblxyXG4gICAgICAgICAgICAgIHRhcCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdWJvaWQuaXNSb3RhdGVDb21wbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBvbmVTY25kQmZyQ2FsbGFiYWNrKGN1Ym9pZC5wb3MpO1xyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgpO1xyXG5cclxuICAgICAgICAgIHRpbWVyKGN1Ym9pZC5zcGVlZClcclxuICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMubmdVbnN1YiksXHJcblxyXG4gICAgICAgICAgICAgIHRhcCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmaW5pc2hlZENhbGxiYWNrKGN1Ym9pZC5wb3MpO1xyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSgpO1xyXG4gIH07XHJcbiAgcm90YXRlU2xpZGU9KGRpcjpXbWxTbGljZWJveERpcmVjdGlvbik9PiB7XHJcbiAgICB0aGlzLnBhcmFtcy5fZGlyID0gZGlyXHJcbiAgICB0aGlzLnBhcmFtcy5fY3Vib2lkc1xyXG4gICAgICAuZm9yRWFjaCgoY3Vib2lkKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVDdWJvaWQoXHJcbiAgICAgICAgICBjdWJvaWQsXHJcbiAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhlIGZyb250ZmFjZSBlYXJseSBmb3IgbmV4dCB0cmFuc2l0aW9uXHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0ltYWdlQ3Vib2lkKGN1Ym9pZCwgY3Vib2lkLmN1cnJlbnQuaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBjdWJvaWQudXBkYXRlQ2xhc3NTdHJpbmcoJ1dtbFNsaWNlYm94UG9kMVJvdGF0ZTAnLCAncmVtb3ZlJyk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKHBvcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAocG9zID09PSB0aGlzLnBhcmFtcy5jdWJvaWRzQ291bnQgLSAxKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wYXJhbXMuaXNBbmltYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICB0aGlzLnN0YXJ0U2xpZGVTaG93KCkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5jZHJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkaXJcclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgc2V0Q3Vib2lkU2l6ZSA9IChjdWJvaWQ6IFdtbFNsaWNlYm94Q3Vib2lkUGFyYW1zKSA9PiB7XHJcbiAgICBjdWJvaWQuc2l6ZSA9IHtcclxuICAgICAgd2lkdGg6XHJcbiAgICAgICAgY3Vib2lkLm8gPT09ICd2J1xyXG4gICAgICAgICAgPyBNYXRoLmZsb29yKHRoaXMucGFyYW1zLnNsaWNlYm94U2l6ZS53aWR0aCAvIGN1Ym9pZC5jdWJvaWRzQ291bnQpXHJcbiAgICAgICAgICA6IHRoaXMucGFyYW1zLnNsaWNlYm94U2l6ZS53aWR0aCxcclxuICAgICAgaGVpZ2h0OlxyXG4gICAgICAgIGN1Ym9pZC5vID09PSAndidcclxuICAgICAgICAgID8gdGhpcy5wYXJhbXMuc2xpY2Vib3hTaXplLmhlaWdodFxyXG4gICAgICAgICAgOiBNYXRoLmZsb29yKHRoaXMucGFyYW1zLnNsaWNlYm94U2l6ZS5oZWlnaHQgLyBjdWJvaWQuY3Vib2lkc0NvdW50KSxcclxuICAgIH07XHJcbiAgICAvLyBleHRyYSBzcGFjZSB0byBmaXggZ2Fwc1xyXG4gICAgY3Vib2lkLmV4dHJhID1cclxuICAgICAgY3Vib2lkLm8gPT09ICd2J1xyXG4gICAgICAgID8gdGhpcy5wYXJhbXMuc2xpY2Vib3hTaXplLndpZHRoIC1cclxuICAgICAgICAgIGN1Ym9pZC5zaXplLndpZHRoICogY3Vib2lkLmN1Ym9pZHNDb3VudFxyXG4gICAgICAgIDogdGhpcy5wYXJhbXMuc2xpY2Vib3hTaXplLmhlaWdodCAtXHJcbiAgICAgICAgICBjdWJvaWQuc2l6ZS5oZWlnaHQgKiBjdWJvaWQuY3Vib2lkc0NvdW50O1xyXG4gIH07XHJcblxyXG4gIHNldHVwSW1hZ2VzQmVmb3JlUm90YXRpb24oY3Vib2lkOiBXbWxTbGljZWJveEN1Ym9pZFBhcmFtcyxkaXI/OldtbFNsaWNlYm94RGlyZWN0aW9uKSB7XHJcblxyXG4gICAgdGhpcy5zaG93SW1hZ2VDdWJvaWQoY3Vib2lkLCBjdWJvaWQucHJldi5pbmRleCwgMSk7XHJcbiAgICBpZihkaXIpe1xyXG4gICAgICB0aGlzLnNob3dJbWFnZUN1Ym9pZChjdWJvaWQsIGN1Ym9pZC5jdXJyZW50LmluZGV4LCBkaXI9PT1cIm5leHRcIiA/MiA6IDQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uZmlndXJlTWFpbkN1Ym9pZFN0eWxlKGN1Ym9pZDogV21sU2xpY2Vib3hDdWJvaWRQYXJhbXMpIHtcclxuICAgIGxldCBtaWRkbGVwb3MgPSBNYXRoLmNlaWwoY3Vib2lkLmN1Ym9pZHNDb3VudCAvIDIpO1xyXG5cclxuICAgIGxldCBwb3NpdGlvblN0eWxlID1cclxuICAgICAgY3Vib2lkLnBvcyA8IG1pZGRsZXBvc1xyXG4gICAgICAgID8ge1xyXG4gICAgICAgICAgICB6SW5kZXg6ICgoY3Vib2lkLnBvcyArIDEpICogMTAwKS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICBsZWZ0OlxyXG4gICAgICAgICAgICAgIChjdWJvaWQubyA9PT0gJ3YnID8gY3Vib2lkLnNpemUud2lkdGggKiBjdWJvaWQucG9zIDogMCkgKyAncHgnLFxyXG4gICAgICAgICAgICB0b3A6XHJcbiAgICAgICAgICAgICAgKGN1Ym9pZC5vID09PSAndicgPyAwIDogY3Vib2lkLnNpemUuaGVpZ2h0ICogY3Vib2lkLnBvcykgKyAncHgnLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIDoge1xyXG4gICAgICAgICAgICB6SW5kZXg6ICgoY3Vib2lkLmN1Ym9pZHNDb3VudCAtIGN1Ym9pZC5wb3MpICogMTAwKS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICBsZWZ0OlxyXG4gICAgICAgICAgICAgIChjdWJvaWQubyA9PT0gJ3YnID8gY3Vib2lkLnNpemUud2lkdGggKiBjdWJvaWQucG9zIDogMCkgKyAncHgnLFxyXG4gICAgICAgICAgICB0b3A6XHJcbiAgICAgICAgICAgICAgKGN1Ym9pZC5vID09PSAndicgPyAwIDogY3Vib2lkLnNpemUuaGVpZ2h0ICogY3Vib2lkLnBvcykgKyAncHgnLFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICBjdWJvaWQuc3R5bGUgPSB7XHJcbiAgICAgIC4uLnBvc2l0aW9uU3R5bGUsXHJcbiAgICB9O1xyXG4gICAgWyd3aWR0aCcsICdoZWlnaHQnXS5mb3JFYWNoKCh2YWwpID0+IHtcclxuICAgICAgY3Vib2lkLnN0eWxlW3ZhbF0gPSBjdWJvaWQuc2l6ZVt2YWxdICsgJ3B4JztcclxuICAgIH0pO1xyXG4gICAgLy8gaG93IG11Y2ggY3Vib2lkIGN1Ym9pZCBpcyBnb2luZyB0byBtb3ZlIChsZWZ0IG9yIHRvcCB2YWx1ZXMpXHJcbiAgICBjdWJvaWQuYXBwbGllZERpc3BlcnNlRmFjdG9yID1cclxuICAgICAgY3Vib2lkLmRpc3BlcnNlRmFjdG9yICogKGN1Ym9pZC5wb3MgKyAxIC0gbWlkZGxlcG9zKTtcclxuICB9XHJcblxyXG4gIGNvbmZpZ3VyZVNpZGVDdWJvaWRTdHlsZXMoXHJcbiAgICBjdWJvaWQ6IFdtbFNsaWNlYm94Q3Vib2lkUGFyYW1zLFxyXG4gICAgdXBkYXRlRGltc09ubHkgPSBmYWxzZVxyXG4gICkge1xyXG4gICAgbGV0IHJvdGF0aW9uRGlyZWN0aW9uID0gY3Vib2lkLnJldmVyc2UgPyAnJyA6ICctJzsgLy9kZWZhdWx0IG5lZ2F0aXZlXHJcbiAgICBsZXQgb3Bwb3NpdGVSb3RhdGlvbkRpcmVjdGlvbiA9IGN1Ym9pZC5yZXZlcnNlID8gJy0nIDogJyc7IC8vZGVmYXVsdCBwb3NpdGl2ZVxyXG5cclxuICAgIGxldCBtZWFzdXJlOiBhbnkgPVxyXG4gICAgICBjdWJvaWQubyA9PT0gJ3YnID8gY3Vib2lkLnNsaWNlYm94U2l6ZS5oZWlnaHQgOiBjdWJvaWQuc2xpY2Vib3hTaXplLndpZHRoO1xyXG5cclxuICAgIGN1Ym9pZC5zaWRlc1N0eWxlcyA9IHtcclxuICAgICAgZnJvbnRTaWRlOiB7XHJcbiAgICAgICAgd2lkdGg6XHJcbiAgICAgICAgICAoY3Vib2lkLm8gPT09ICd2J1xyXG4gICAgICAgICAgICA/IGN1Ym9pZC5zaXplLndpZHRoICsgY3Vib2lkLmV4dHJhXHJcbiAgICAgICAgICAgIDogY3Vib2lkLnNpemUud2lkdGgpICsgJ3B4JyxcclxuICAgICAgICBoZWlnaHQ6XHJcbiAgICAgICAgICAoY3Vib2lkLm8gPT09ICd2J1xyXG4gICAgICAgICAgICA/IGN1Ym9pZC5zaXplLmhlaWdodFxyXG4gICAgICAgICAgICA6IGN1Ym9pZC5zaXplLmhlaWdodCArIGN1Ym9pZC5leHRyYSkgKyAncHgnLFxyXG5cclxuICAgICAgICB0cmFuc2Zvcm06XHJcbiAgICAgICAgICAncm90YXRlM2QoIDAsIDEsIDAsIDBkZWcgKSB0cmFuc2xhdGUzZCggMCwgMCwgJyArXHJcbiAgICAgICAgICBtZWFzdXJlIC8gMiArXHJcbiAgICAgICAgICAncHggKScsXHJcbiAgICAgIH0sXHJcbiAgICAgIGJhY2tTaWRlOiB7XHJcbiAgICAgICAgd2lkdGg6IGN1Ym9pZC5zaXplLndpZHRoICsgJ3B4JyxcclxuICAgICAgICBoZWlnaHQ6IGN1Ym9pZC5zaXplLmhlaWdodCArICdweCcsXHJcbiAgICAgICAgdHJhbnNmb3JtOlxyXG4gICAgICAgICAgJ3JvdGF0ZTNkKCAwLCAxLCAwLCAnICtcclxuICAgICAgICAgIG9wcG9zaXRlUm90YXRpb25EaXJlY3Rpb24gK1xyXG4gICAgICAgICAgJzE4MGRlZyApIHRyYW5zbGF0ZTNkKCAwLCAwLCAnICtcclxuICAgICAgICAgIG1lYXN1cmUgLyAyICtcclxuICAgICAgICAgICdweCApIHJvdGF0ZVooICcgK1xyXG4gICAgICAgICAgb3Bwb3NpdGVSb3RhdGlvbkRpcmVjdGlvbiArXHJcbiAgICAgICAgICAnMTgwZGVnICknLFxyXG4gICAgICB9LFxyXG4gICAgICByaWdodFNpZGU6IHtcclxuICAgICAgICB3aWR0aDogbWVhc3VyZSArICdweCcsXHJcbiAgICAgICAgaGVpZ2h0OlxyXG4gICAgICAgICAgKGN1Ym9pZC5vID09PSAndidcclxuICAgICAgICAgICAgPyBjdWJvaWQuc2l6ZS5oZWlnaHRcclxuICAgICAgICAgICAgOiBjdWJvaWQuc2l6ZS5oZWlnaHQgKyBjdWJvaWQuZXh0cmEpICsgJ3B4JyxcclxuICAgICAgICBsZWZ0OlxyXG4gICAgICAgICAgKGN1Ym9pZC5vID09PSAndidcclxuICAgICAgICAgICAgPyBjdWJvaWQuc2l6ZS53aWR0aCAvIDIgLSBjdWJvaWQuc2l6ZS5oZWlnaHQgLyAyXHJcbiAgICAgICAgICAgIDogMCkgKyAncHgnLFxyXG4gICAgICAgIHRyYW5zZm9ybTpcclxuICAgICAgICAgICdyb3RhdGUzZCggMCwgMSwgMCwgJyArXHJcbiAgICAgICAgICBvcHBvc2l0ZVJvdGF0aW9uRGlyZWN0aW9uICtcclxuICAgICAgICAgICc5MGRlZyApIHRyYW5zbGF0ZTNkKCAwLCAwLCAnICtcclxuICAgICAgICAgIGN1Ym9pZC5zaXplLndpZHRoIC8gMiArXHJcbiAgICAgICAgICAncHggKScsXHJcbiAgICAgIH0sXHJcbiAgICAgIGxlZnRTaWRlOiB7XHJcbiAgICAgICAgd2lkdGg6IG1lYXN1cmUgKyAncHgnLFxyXG4gICAgICAgIGhlaWdodDpcclxuICAgICAgICAgIChjdWJvaWQubyA9PT0gJ3YnXHJcbiAgICAgICAgICAgID8gY3Vib2lkLnNpemUuaGVpZ2h0XHJcbiAgICAgICAgICAgIDogY3Vib2lkLnNpemUuaGVpZ2h0ICsgY3Vib2lkLmV4dHJhKSArICdweCcsXHJcbiAgICAgICAgbGVmdDpcclxuICAgICAgICAgIChjdWJvaWQubyA9PT0gJ3YnXHJcbiAgICAgICAgICAgID8gY3Vib2lkLnNpemUud2lkdGggLyAyIC0gY3Vib2lkLnNpemUuaGVpZ2h0IC8gMlxyXG4gICAgICAgICAgICA6IDApICsgJ3B4JyxcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtOlxyXG4gICAgICAgICAgJ3JvdGF0ZTNkKCAwLCAxLCAwLCAnICtcclxuICAgICAgICAgIHJvdGF0aW9uRGlyZWN0aW9uICtcclxuICAgICAgICAgICc5MGRlZyApIHRyYW5zbGF0ZTNkKCAwLCAwLCAnICtcclxuICAgICAgICAgIGN1Ym9pZC5zaXplLndpZHRoIC8gMiArXHJcbiAgICAgICAgICAncHggKScsXHJcbiAgICAgIH0sXHJcbiAgICAgIHRvcFNpZGU6IHtcclxuICAgICAgICB3aWR0aDpcclxuICAgICAgICAgIChjdWJvaWQubyA9PT0gJ3YnXHJcbiAgICAgICAgICAgID8gY3Vib2lkLnNpemUud2lkdGggKyBjdWJvaWQuZXh0cmFcclxuICAgICAgICAgICAgOiBjdWJvaWQuc2l6ZS53aWR0aCkgKyAncHgnLFxyXG4gICAgICAgIHRvcDpcclxuICAgICAgICAgIChjdWJvaWQubyA9PT0gJ3YnXHJcbiAgICAgICAgICAgID8gMFxyXG4gICAgICAgICAgICA6IGN1Ym9pZC5zaXplLmhlaWdodCAvIDIgLSBjdWJvaWQuc2l6ZS53aWR0aCAvIDIpICsgJ3B4JyxcclxuICAgICAgICBoZWlnaHQ6IG1lYXN1cmUgKyAncHgnLFxyXG5cclxuICAgICAgICB0cmFuc2Zvcm06XHJcbiAgICAgICAgICAncm90YXRlM2QoIDEsIDAsIDAsICcgK1xyXG4gICAgICAgICAgb3Bwb3NpdGVSb3RhdGlvbkRpcmVjdGlvbiArXHJcbiAgICAgICAgICAnOTBkZWcgKSB0cmFuc2xhdGUzZCggMCwgMCwgJyArXHJcbiAgICAgICAgICBjdWJvaWQuc2l6ZS5oZWlnaHQgLyAyICtcclxuICAgICAgICAgICdweCApJyxcclxuICAgICAgfSxcclxuICAgICAgYm90dG9tU2lkZToge1xyXG4gICAgICAgIHdpZHRoOlxyXG4gICAgICAgICAgKGN1Ym9pZC5vID09PSAndidcclxuICAgICAgICAgICAgPyBjdWJvaWQuc2l6ZS53aWR0aCArIGN1Ym9pZC5leHRyYVxyXG4gICAgICAgICAgICA6IGN1Ym9pZC5zaXplLndpZHRoKSArICdweCcsXHJcbiAgICAgICAgdG9wOlxyXG4gICAgICAgICAgKGN1Ym9pZC5vID09PSAndidcclxuICAgICAgICAgICAgPyAwXHJcbiAgICAgICAgICAgIDogY3Vib2lkLnNpemUuaGVpZ2h0IC8gMiAtIGN1Ym9pZC5zaXplLndpZHRoIC8gMikgKyAncHgnLFxyXG4gICAgICAgIGhlaWdodDogbWVhc3VyZSArICdweCcsXHJcbiAgICAgICAgdHJhbnNmb3JtOlxyXG4gICAgICAgICAgJ3JvdGF0ZTNkKCAxLCAwLCAwLCAnICtcclxuICAgICAgICAgIHJvdGF0aW9uRGlyZWN0aW9uICtcclxuICAgICAgICAgICc5MGRlZyApIHRyYW5zbGF0ZTNkKCAwLCAwLCAnICtcclxuICAgICAgICAgIGN1Ym9pZC5zaXplLmhlaWdodCAvIDIgK1xyXG4gICAgICAgICAgJ3B4ICknLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICBbXHJcbiAgICAgICdmcm9udFNpZGUnLFxyXG4gICAgICAnYmFja1NpZGUnLFxyXG4gICAgICAncmlnaHRTaWRlJyxcclxuICAgICAgJ2xlZnRTaWRlJyxcclxuICAgICAgJ3RvcFNpZGUnLFxyXG4gICAgICAnYm90dG9tU2lkZScsXHJcbiAgICBdLmZvckVhY2goKG90aGVyVmFsKSA9PiB7XHJcbiAgICAgIGlmICh1cGRhdGVEaW1zT25seSkge1xyXG4gICAgICAgIGRlbGV0ZSBjdWJvaWQuc2lkZXNTdHlsZXNbb3RoZXJWYWxdLnRyYW5zZm9ybTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgbXlWYWwgPSBjdWJvaWRbb3RoZXJWYWxdO1xyXG4gICAgICBPYmplY3QuYXNzaWduKG15VmFsLnN0eWxlLCBjdWJvaWQuc2lkZXNTdHlsZXNbb3RoZXJWYWxdKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29uZmlndXJlQ3Vib2lkU3R5bGVzID0gKGN1Ym9pZDogV21sU2xpY2Vib3hDdWJvaWRQYXJhbXMpID0+IHtcclxuICAgIHRoaXMuY29uZmlndXJlTWFpbkN1Ym9pZFN0eWxlKGN1Ym9pZCk7XHJcbiAgICB0aGlzLmNvbmZpZ3VyZVNpZGVDdWJvaWRTdHlsZXMoY3Vib2lkKTtcclxuICB9O1xyXG5cclxuICBmaW5pc2hSZXNpemluZyAgPSgkZXZlbnQ6VHJhbnNpdGlvbkV2ZW50wqAsY3Vib2lkOldtbFNsaWNlYm94Q3Vib2lkUGFyYW1zKT0+e1xyXG4gICAgaWYoXHJcbiAgICAgIFtjdWJvaWQubyA9PT0gXCJ2XCIgPyBcImxlZnRcIiA6XCJ0b3BcIl0uaW5jbHVkZXMoJGV2ZW50LnByb3BlcnR5TmFtZSkgJiZcclxuICAgICAgY3Vib2lkLmN1Ym9pZHNDb3VudD09PSBjdWJvaWQucG9zKzEgJiZcclxuICAgICAgKCRldmVudC5lbGFwc2VkVGltZSA+IDEgfHwgIXRoaXMucGFyYW1zLmlzQW5pbWF0aW5nKVxyXG4gICAgKXtcclxuICAgICAgdGhpcy5wYXJhbXMuaXNGaW5pc2hlZFJlc2l6aW5nID0gdHJ1ZTtcclxuICAgICAgdGhpcy5zdGFydFNsaWRlU2hvdygpLnN1YnNjcmliZSgpXHJcbiAgICAgIHRoaXMuY2RyZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlU2xpY2Vib3hPblJlc2l6ZSA9ICgpID0+IHtcclxuICAgIHJldHVybiBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJykucGlwZShcclxuICAgICAgdGFrZVVudGlsKHRoaXMubmdVbnN1YiksXHJcbiAgICAgIGRlYm91bmNlVGltZSh0aGlzLnBhcmFtcy5yZXNpemVEZWxheSksXHJcbiAgICAgIHRhcCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuaXNGaW5pc2hlZFJlc2l6aW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnNldFNsaWNlQm94RGltcygpO1xyXG4gICAgICAgIGxldCBib3hTdHlsZTogYW55ID0ge1xyXG4gICAgICAgICAgd2lkdGg6IHRoaXMucGFyYW1zLnNsaWNlYm94U2l6ZS53aWR0aCxcclxuICAgICAgICAgIGhlaWdodDogdGhpcy5wYXJhbXMuc2xpY2Vib3hTaXplLmhlaWdodCxcclxuICAgICAgICAgIHBlcnNwZWN0aXZlOiB0aGlzLnBhcmFtcy5wZXJzcGVjdGl2ZSArICdweCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnBlcnNwZWN0aXZlLnN0eWxlID0gYm94U3R5bGU7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuX2N1Ym9pZHMuZm9yRWFjaCgoY3Vib2lkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnNldEN1Ym9pZFNpemUoY3Vib2lkKTtcclxuICAgICAgICAgIHRoaXMuY29uZmlndXJlTWFpbkN1Ym9pZFN0eWxlKGN1Ym9pZCk7XHJcbiAgICAgICAgICB0aGlzLmNvbmZpZ3VyZVNpZGVDdWJvaWRTdHlsZXMoY3Vib2lkKTtcclxuICAgICAgICAgIGlmICghY3Vib2lkLmlzUm90YXRlQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR1cEltYWdlc0JlZm9yZVJvdGF0aW9uKGN1Ym9pZCx0aGlzLnBhcmFtcy5fZGlyKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93SW1hZ2VDdWJvaWQoY3Vib2lkLCBjdWJvaWQuY3VycmVudC5pbmRleCwgMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihjdWJvaWQuaXNJbkRpc3BlcnNpb24pe1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVEaXNwZXJzaW9uUG9pbnRzKGN1Ym9pZCx0cnVlKTtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY2RyZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgIC8vIHRoaXMuZmlyc3RJbml0KClcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgZmlyc3RJbml0ID0gKCkgPT4ge1xyXG4gICAgdGhpcy51cGRhdGVDc3NWYXJzKCk7XHJcbiAgICB0aGlzLnVwZGF0ZVNsaWNlYm94T25SZXNpemUoKS5zdWJzY3JpYmUoKTtcclxuICAgIHRoaXMuY2FjaGVJbWFnZXMoKVxyXG4gICAgICAucGlwZShcclxuXHJcbiAgICAgICAgdGFrZVVudGlsKHRoaXMubmdVbnN1YiksXHJcbiAgICAgICAgY29uY2F0TWFwKCgpID0+IHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnNsaWNlQm94SW5pdCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSgpO1xyXG4gIH07XHJcblxyXG4gIGxpc3RlbkZvckp1bXBUb1NsaWRlU3ViaiA9ICgpPT57XHJcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMuanVtcFRvU2xpZGVTdWJqXHJcbiAgICAucGlwZShcclxuICAgICAgdGFrZVVudGlsKHRoaXMubmdVbnN1YiksXHJcbiAgICAgIGZpbHRlcigoaW5kZXgpPT57cmV0dXJuIGluZGV4ICE9PSB0aGlzLnBhcmFtcy5jdXJyZW50LmluZGV4fSksXHJcbiAgICAgIGZpbHRlcigoKT0+IXRoaXMuY2hlY2tJZlNsaWNlYm94Q2FuQW5pbWF0ZSgpKSxcclxuICAgICAgdGFwKChpbmRleCk9PntcclxuICAgICAgICBsZXQgZGlyOldtbFNsaWNlYm94RGlyZWN0aW9uID0gIGluZGV4ICA+IHRoaXMucGFyYW1zLmN1cnJlbnQuaW5kZXggPyBcIm5leHRcIiA6XCJwcmV2XCJcclxuICAgICAgICB0aGlzLnBhcmFtcy5pc0FuaW1hdGluZyA9dHJ1ZVxyXG4gICAgICAgIHRoaXMuZGV0ZXJtaW5lTmV4dFNsaWRlKGRpcixpbmRleClcclxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlKGRpcik7XHJcbiAgICAgIH0pXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICAvLyBUT0RPIGltcGxlbWVudCB0aGlzIG1hYnllXHJcbiAgbGlzdGVuRm9yVG9nZ2xlQXV0b1BsYXlTdWJqID0gKCk9PntcclxuICAgIHJldHVybiBvZihbXSlcclxuICAgIC8vIHJldHVybiB0aGlzLnBhcmFtcy50b2dnbGVBdXRvUGxheVN1YmpcclxuICAgIC8vIC5waXBlKFxyXG4gICAgLy8gICB0YWtlVW50aWwodGhpcy5uZ1Vuc3ViKSxcclxuICAgIC8vICAgZmlsdGVyKCgpPT4hdGhpcy5jaGVja0lmU2xpY2Vib3hDYW5BbmltYXRlKCkpLFxyXG4gICAgLy8gICB0YXAoKCk9PntcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhcImZpcmUzXCIpXHJcbiAgICAvLyAgIH0pXHJcbiAgICAvLyApXHJcbiAgfVxyXG5cclxuICBsaXN0ZW5Gb3JNb3ZlVG9QcmV2U3ViaiA9ICgpPT57XHJcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMubW92ZVRvUHJldlNsaWRlU3VialxyXG4gICAgLnBpcGUoXHJcbiAgICAgIHRha2VVbnRpbCh0aGlzLm5nVW5zdWIpLFxyXG4gICAgICBmaWx0ZXIoKCk9PiF0aGlzLmNoZWNrSWZTbGljZWJveENhbkFuaW1hdGUoKSksXHJcbiAgICAgIHRhcCgoKT0+e1xyXG4gICAgICAgIGxldCBkaXI6V21sU2xpY2Vib3hEaXJlY3Rpb24gPSBcInByZXZcIlxyXG4gICAgICAgIHRoaXMucGFyYW1zLmlzQW5pbWF0aW5nID10cnVlXHJcbiAgICAgICAgdGhpcy5kZXRlcm1pbmVOZXh0U2xpZGUoZGlyKVxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGUoZGlyKTtcclxuICAgICAgfSlcclxuICAgIClcclxuICB9XHJcblxyXG5cclxuICBsaXN0ZW5Gb3JNb3ZlVG9OZXh0U3ViaiA9ICgpPT57XHJcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMubW92ZVRvTmV4dFNsaWRlU3VialxyXG4gICAgLnBpcGUoXHJcbiAgICAgIHRha2VVbnRpbCh0aGlzLm5nVW5zdWIpLFxyXG4gICAgICBmaWx0ZXIoKCk9PiF0aGlzLmNoZWNrSWZTbGljZWJveENhbkFuaW1hdGUoKSksXHJcbiAgICAgIHRhcCgoKT0+e1xyXG4gICAgICAgIGxldCBkaXI6V21sU2xpY2Vib3hEaXJlY3Rpb24gPSBcIm5leHRcIlxyXG4gICAgICAgIHRoaXMucGFyYW1zLmlzQW5pbWF0aW5nID10cnVlXHJcbiAgICAgICAgdGhpcy5kZXRlcm1pbmVOZXh0U2xpZGUoZGlyKVxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGUoZGlyKTtcclxuICAgICAgfSlcclxuICAgIClcclxuICB9XHJcblxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmZpcnN0SW5pdCgpO1xyXG4gICAgdGhpcy5saXN0ZW5Gb3JNb3ZlVG9OZXh0U3ViaigpLnN1YnNjcmliZSgpXHJcbiAgICB0aGlzLmxpc3RlbkZvclRvZ2dsZUF1dG9QbGF5U3ViaigpLnN1YnNjcmliZSgpXHJcbiAgICB0aGlzLmxpc3RlbkZvck1vdmVUb1ByZXZTdWJqKCkuc3Vic2NyaWJlKClcclxuICAgIHRoaXMubGlzdGVuRm9ySnVtcFRvU2xpZGVTdWJqKCkuc3Vic2NyaWJlKClcclxuXHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMubmdVbnN1Yi5uZXh0KCk7XHJcbiAgICB0aGlzLm5nVW5zdWIuY29tcGxldGUoKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFdtbFNsaWNlYm94RGVmYXVsdHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kaXNwZXJzZVNwZWVkID0gdGhpcy5kaXNwZXJzZVNwZWVkID8/IHRoaXMuc3BlZWQ7XHJcbiAgfVxyXG5cclxuICBwcmV2ID0ge1xyXG4gICAgaW5kZXg6IDAsXHJcbiAgfTtcclxuICBjdXJyZW50ID0ge1xyXG4gICAgaW5kZXg6IDAsXHJcbiAgfTtcclxuICBzbGljZWJveFNpemU6IHtcclxuICAgIGhlaWdodD86IG51bWJlcjtcclxuICAgIHdpZHRoPzogbnVtYmVyO1xyXG4gIH07XHJcbiAgc2xpY2Vib3hTaXplVXNlUHJvdmlkZWRWYWx1ZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBvcmllbnRhdGlvbjogJ3YnIHwgJ2gnID0gJ3YnO1xyXG4gIHBlcnNwZWN0aXZlID0gMTAwMDA7XHJcbiAgaW50ZXJ2YWwgPSAzMDAwO1xyXG4gIGN1Ym9pZHNDb3VudCA9IDk7XHJcbiAgZGlzcGVyc2VGYWN0b3IgPSAyMDtcclxuICBkaXNwZXJzZVNwZWVkO1xyXG4gIGNvbG9ySGlkZGVuU2lkZXMgPSAnIzIyMic7XHJcbiAgc2VxdWVudGlhbEZhY3RvciA9IDM1MDtcclxuICBzcGVlZCA9IDE1NjYwO1xyXG4gIGVhc2luZyA9ICdlYXNlLW91dCc7XHJcbiAgYXV0b3BsYXkgPSB0cnVlO1xyXG4gIG5leHRSb3RhdGlvbkRlZ3JlZT86IHN0cmluZztcclxuICBwcmV2Um90YXRpb25EZWdyZWU/OnN0cmluZztcclxuXHJcbiAgb25CZWZvcmVDaGFuZ2UgPSBmdW5jdGlvbiAocG9zaXRpb24pIHt9O1xyXG4gIG9uQWZ0ZXJDaGFuZ2UgPSBmdW5jdGlvbiAocG9zaXRpb24pIHt9O1xyXG4gIG9uUmVhZHkgPSBmdW5jdGlvbiAoKSB7fTtcclxuXHJcbiAgcmV2ZXJzZSA9IGZhbHNlO1xyXG4gIGltYWdlczogV21sU2xpY2Vib3hJbWdbXSA9IFtdO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdtbFNsaWNlYm94UGFyYW1zIGV4dGVuZHMgV21sU2xpY2Vib3hEZWZhdWx0cyB7XHJcbiAgY29uc3RydWN0b3IocGFyYW1zOiBQYXJ0aWFsPFdtbFNsaWNlYm94UGFyYW1zPiA9IHt9KSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgIC4uLnBhcmFtcyxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5fcmV2ZXJzZSA9IHRoaXMucmV2ZXJzZVxyXG5cclxuICAgIHRoaXMubmV4dFJvdGF0aW9uRGVncmVlID0gdGhpcy5uZXh0Um90YXRpb25EZWdyZWUgPz8gKHRoaXMuX3JldmVyc2UgPyAnLTkwZGVnJyA6ICc5MGRlZycpXHJcblxyXG4gICAgbGV0IGRlZ3JlZTphbnk9dGhpcy5uZXh0Um90YXRpb25EZWdyZWVcclxuICAgIGRlZ3JlZSA9IHJldHJpdmVWYWx1ZUZyb21DU1NVbml0KGRlZ3JlZSlcclxuXHJcbiAgICBkZWdyZWUgKj0gLTFcclxuICAgIGRlZ3JlZSArPVwiZGVnXCJcclxuICAgIHRoaXMucHJldlJvdGF0aW9uRGVncmVlID0gdGhpcy5wcmV2Um90YXRpb25EZWdyZWUgPz8gZGVncmVlXHJcbiAgfVxyXG5cclxuICBfcmV2ZXJzZSA6Ym9vbGVhblxyXG4gIG92ZXJyaWRlIHNsaWNlYm94U2l6ZSA9IHtcclxuICAgIGhlaWdodDogNTAwLFxyXG4gICAgd2lkdGg6IDUwMCxcclxuICB9O1xyXG4gIF9kaXI6V21sU2xpY2Vib3hEaXJlY3Rpb25cclxuICByZXNpemVEZWxheSA9IDEwMDBcclxuICBpc0FuaW1hdGluZyA9IGZhbHNlO1xyXG4gIGlzRmluaXNoZWRSZXNpemluZyA9dHJ1ZVxyXG4gIGlzUmVhZHkgPSBmYWxzZTtcclxuICBpdGVtc0NvdW50OiBudW1iZXI7XHJcbiAgYW5pbWF0aW9uRHVyYXRpb24gPSAzMjAwO1xyXG4gIHJlYWxXaWR0aDogJzUwMHB4JztcclxuICBfY3Vib2lkczogV21sU2xpY2Vib3hDdWJvaWRQYXJhbXNbXTtcclxuICBtb3ZlVG9OZXh0U2xpZGVTdWJqID0gbmV3IFN1YmplY3Q8dm9pZD4oKVxyXG4gIG1vdmVUb1ByZXZTbGlkZVN1YmogPSBuZXcgU3ViamVjdDx2b2lkPigpXHJcbiAganVtcFRvU2xpZGVTdWJqID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpXHJcbiAgLy8gVE9ETyBtYWJ5ZSBpbXBsZW1udFxyXG4gIC8vIHRvZ2dsZUF1dG9QbGF5U3ViaiA9IG5ldyBTdWJqZWN0PGJvb2xlYW4gfHZvaWQ+KClcclxuXHJcbn1cclxuXHJcbmNsYXNzIFdtbFNsaWNlYm94Q3Vib2lkUGFyYW1zIGV4dGVuZHMgV21sU2xpY2Vib3hEZWZhdWx0cyB7XHJcbiAgY29uc3RydWN0b3IocGFyYW1zOiBQYXJ0aWFsPFdtbFNsaWNlYm94Q3Vib2lkUGFyYW1zPiA9IHt9KSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgIC4uLnBhcmFtcyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNpdGlvblN0YXJ0VG9wO1xyXG4gIHRyYW5zaXRpb25TdGFydExlZnQ7XHJcbiAgYXBwbGllZERpc3BlcnNlRmFjdG9yOm51bWJlclxyXG4gIGNsYXNzID0gJyc7XHJcbiAgY2xhc3NlcyA9IFtdO1xyXG4gIC8vIHVwZGF0ZUNsYXNzU3RyaW5nOmFueT0oKT0+e31cclxuICB1cGRhdGVDbGFzc1N0cmluZyA9IHVwZGF0ZUNsYXNzU3RyaW5nKHRoaXMsICdjbGFzcycsICdjbGFzc2VzJyk7XHJcbiAgc2l6ZToge1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG4gIH07XHJcbiAgc2lkZSA9IDE7XHJcbiAgcG9zOiBudW1iZXI7XHJcbiAgZXh0cmE6IG51bWJlcjtcclxuICBzdHlsZTogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPjtcclxuICBpc1JvdGF0ZUNvbXBsZXRlID0gZmFsc2U7XHJcbiAgaXNJbkRpc3BlcnNpb24gPSBmYWxzZVxyXG4gIHNpZGVzU3R5bGVzOiB7IFtrOiBzdHJpbmddOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+IH07XHJcbiAgbzogV21sU2xpY2Vib3hQYXJhbXNbJ29yaWVudGF0aW9uJ107XHJcbiAgZGlyZWN0aW9uOiAnbmV4dCcgfCAncHJldic7XHJcbiAgZnJvbnRTaWRlID0gbmV3IFdNTFVJUHJvcGVydHkoKTtcclxuICBiYWNrU2lkZSA9IG5ldyBXTUxVSVByb3BlcnR5KCk7XHJcbiAgcmlnaHRTaWRlID0gbmV3IFdNTFVJUHJvcGVydHkoKTtcclxuICBsZWZ0U2lkZSA9IG5ldyBXTUxVSVByb3BlcnR5KCk7XHJcbiAgdG9wU2lkZSA9IG5ldyBXTUxVSVByb3BlcnR5KCk7XHJcbiAgYm90dG9tU2lkZSA9IG5ldyBXTUxVSVByb3BlcnR5KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXbWxTbGljZWJveEltZyBleHRlbmRzIFdNTEltYWdlIHtcclxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IFBhcnRpYWw8V21sU2xpY2Vib3hJbWc+ID0ge30pIHtcclxuICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgLi4ucGFyYW1zLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPIGFsbG93IGRldmVsb3BlciB0byBzcGVjaWZpYyByb3RhdGlvbiBmb3IgZWFjaCBzdHJpbmdcclxuICByb3RhdGlvbkRlZ3JlZTpzdHJpbmdcclxuICBjYWNoZWRTcmM6IHN0cmluZztcclxufVxyXG5cclxuXHJcbnR5cGUgV21sU2xpY2Vib3hEaXJlY3Rpb24gPSBcIm5leHRcIiB8XCJwcmV2XCJcclxuIiwiPGRpdiBbY2xhc3NdPVwiY2xhc3NQcmVmaXgoJ01haW5Qb2QnKVwiPlxyXG4gIDxzZWN0aW9uICN0YXJnZXRQZXJzcGVjdGl2ZSBbbmdTdHlsZV09XCJwZXJzcGVjdGl2ZS5zdHlsZVwiIFtjbGFzc109XCJjbGFzc1ByZWZpeCgnUG9kMScpICsgJyBzYi1wZXJzcGVjdGl2ZSdcIj5cclxuICAgIDxkaXYgICAgKHRyYW5zaXRpb25lbmQpPVwiZmluaXNoUmVzaXppbmcoJGV2ZW50LGN1Ym9pZClcIiBbY2xhc3NdPVwiY3Vib2lkLmNsYXNzXCIgW25nU3R5bGVdPWN1Ym9pZC5zdHlsZSAqbmdGb3I9XCJsZXQgY3Vib2lkIG9mICRhbnkocGFyYW1zLl9jdWJvaWRzKVwiPlxyXG4gICAgICA8ZGl2ICAgW25nU3R5bGVdPVwiY3Vib2lkLmZyb250U2lkZS5zdHlsZVwiICBjbGFzcz1cInNiLXNpZGUgZnJvbnRTaWRlXCIgPjwvZGl2PlxyXG4gICAgICA8ZGl2ICAgW25nU3R5bGVdPVwiY3Vib2lkLmJhY2tTaWRlLnN0eWxlXCIgICBjbGFzcz1cInNiLXNpZGUgYmFja1NpZGVcIiA+PC9kaXY+XHJcbiAgICAgIDxkaXYgICBbbmdTdHlsZV09XCJjdWJvaWQucmlnaHRTaWRlLnN0eWxlXCIgIGNsYXNzPVwic2Itc2lkZSByaWdodFNpZGVcIiA+PC9kaXY+XHJcbiAgICAgIDxkaXYgICBbbmdTdHlsZV09XCJjdWJvaWQubGVmdFNpZGUuc3R5bGVcIiAgIGNsYXNzPVwic2Itc2lkZSBsZWZ0U2lkZVwiID48L2Rpdj5cclxuICAgICAgPGRpdiAgIFtuZ1N0eWxlXT1cImN1Ym9pZC50b3BTaWRlLnN0eWxlXCIgICAgY2xhc3M9XCJzYi1zaWRlIHRvcFNpZGVcIiA+PC9kaXY+XHJcbiAgICAgIDxkaXYgICBbbmdTdHlsZV09XCJjdWJvaWQuYm90dG9tU2lkZS5zdHlsZVwiIGNsYXNzPVwic2Itc2lkZSBib3R0b21TaWRlXCIgPjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9zZWN0aW9uPlxyXG48L2Rpdj5cclxuIl19