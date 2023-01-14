import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, ViewChild, HostBinding, NgModule } from '@angular/core';
import { WMLUIProperty, WMLButton, WMLImage } from '@windmillcode/wml-components-base';
import { Subject, fromEvent, takeUntil, tap, combineLatest, interval, timer, startWith, debounceTime, concatMap, filter, of } from 'rxjs';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

// angular
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
class WmlSliceboxComponent {
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
                var _a;
                (_a = this.params._cuboids) === null || _a === void 0 ? void 0 : _a.forEach((cuboid) => {
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
            var _a;
            this.el.nativeElement.style.setProperty('--time-for-one-cuboid-rotation', this.params.speed / 1000 + 's');
            this.el.nativeElement.style.setProperty('--vertical-rotate', this.params.orientation === 'v' ? -1 : 0);
            this.el.nativeElement.style.setProperty('--horizontal-rotate', this.params.orientation === 'h' ? -1 : 0);
            this.el.nativeElement.style.setProperty('--reverse-deg-end', (_a = this.params.nextRotationDegree) !== null && _a !== void 0 ? _a : this.hostStyle().getPropertyValue('--reverse-deg-end'));
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
            let config = Object.assign(Object.assign({}, this.params), { items: this.params.images, prev: this.params.prev, current: this.params.current, o: this.params.orientation, reverse: this.params._reverse });
            this.params._cuboids = Array(this.params.cuboidsCount)
                .fill(null)
                .map((nullVal, index0) => {
                let cuboid = new WmlSliceboxCuboidParams(Object.assign({ pos: index0 }, config));
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
        cuboid.style = Object.assign({}, positionStyle);
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
        var _a;
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
        this.disperseSpeed = (_a = this.disperseSpeed) !== null && _a !== void 0 ? _a : this.speed;
    }
}
class WmlSliceboxParams extends WmlSliceboxDefaults {
    constructor(params = {}) {
        var _a, _b;
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
        Object.assign(this, Object.assign({}, params));
        this._reverse = this.reverse;
        this.nextRotationDegree = (_a = this.nextRotationDegree) !== null && _a !== void 0 ? _a : (this._reverse ? '-90deg' : '90deg');
        let degree = this.nextRotationDegree;
        degree = retriveValueFromCSSUnit(degree);
        degree *= -1;
        degree += "deg";
        this.prevRotationDegree = (_b = this.prevRotationDegree) !== null && _b !== void 0 ? _b : degree;
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
        Object.assign(this, Object.assign({}, params));
    }
}
class WmlSliceboxImg extends WMLImage {
    constructor(params = {}) {
        super(params);
        Object.assign(this, Object.assign({}, params));
    }
}

class WmlSliceboxModule {
}
WmlSliceboxModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.3", ngImport: i0, type: WmlSliceboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
WmlSliceboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.3", ngImport: i0, type: WmlSliceboxModule, declarations: [WmlSliceboxComponent], imports: [TranslateModule,
        ReactiveFormsModule,
        CommonModule], exports: [WmlSliceboxComponent] });
WmlSliceboxModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.3", ngImport: i0, type: WmlSliceboxModule, imports: [TranslateModule,
        ReactiveFormsModule,
        CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.3", ngImport: i0, type: WmlSliceboxModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        WmlSliceboxComponent,
                    ],
                    imports: [
                        TranslateModule,
                        ReactiveFormsModule,
                        CommonModule
                    ],
                    exports: [
                        WmlSliceboxComponent
                    ]
                }]
        }] });

/*
 * Public API Surface of wml-slicebox
 */

/**
 * Generated bundle index. Do not edit.
 */

export { WmlSliceboxComponent, WmlSliceboxImg, WmlSliceboxModule, WmlSliceboxParams };
//# sourceMappingURL=windmillcode-wml-slicebox.mjs.map
//# sourceMappingURL=windmillcode-wml-slicebox.mjs.map
