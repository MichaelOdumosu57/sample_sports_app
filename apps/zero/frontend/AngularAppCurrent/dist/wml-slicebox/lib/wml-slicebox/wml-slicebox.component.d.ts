import { ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { WMLButton, WMLImage, WMLUIProperty } from '@windmillcode/wml-components-base';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class WmlSliceboxComponent {
    cdref: ChangeDetectorRef;
    renderer2: Renderer2;
    el: ElementRef;
    constructor(cdref: ChangeDetectorRef, renderer2: Renderer2, el: ElementRef);
    generateClassPrefix(prefix: string): (val: string) => string;
    classPrefix: (val: string) => string;
    targetPerspectiveComputedStyle: CSSStyleDeclaration;
    params: WmlSliceboxParams;
    targetPerspective: ElementRef;
    myClass: string;
    ngUnsub: Subject<void>;
    perspective: WMLUIProperty;
    togglePauseBtn: WMLButton;
    cacheImages: () => import("rxjs").Observable<Event[]>;
    hostStyle: () => CSSStyleDeclaration;
    updateCssVars: () => void;
    setSliceBoxDims(): void;
    sliceBoxInit: () => import("rxjs").Observable<number>;
    stopSlideShowSubj: Subject<void>;
    startSlideShow: () => import("rxjs").Observable<number>;
    navigate: (dir: 'next' | 'prev', jumpTo?: any) => void;
    setupCuboids: () => void;
    setupSlides: () => void;
    showImageCuboid: (cuboid: WmlSliceboxCuboidParams, imgPos: any, cuboidSide: any) => void;
    checkIfSliceboxCanAnimate: () => boolean;
    determineNextRotation: (dir: WmlSliceboxDirection) => void;
    determineNextSlide(dir: WmlSliceboxDirection, jumpTo?: number): void;
    updateDispersionPoints(cuboid: WmlSliceboxCuboidParams, resizing?: boolean): void;
    rotateCuboid: (cuboid: WmlSliceboxCuboidParams, oneScndBfrCallaback: any, finishedCallback: any, dir?: WmlSliceboxDirection) => void;
    rotateSlide: (dir: WmlSliceboxDirection) => void;
    setCuboidSize: (cuboid: WmlSliceboxCuboidParams) => void;
    setupImagesBeforeRotation(cuboid: WmlSliceboxCuboidParams, dir?: WmlSliceboxDirection): void;
    configureMainCuboidStyle(cuboid: WmlSliceboxCuboidParams): void;
    configureSideCuboidStyles(cuboid: WmlSliceboxCuboidParams, updateDimsOnly?: boolean): void;
    configureCuboidStyles: (cuboid: WmlSliceboxCuboidParams) => void;
    finishResizing: ($event: TransitionEvent, cuboid: WmlSliceboxCuboidParams) => void;
    updateSliceboxOnResize: () => import("rxjs").Observable<Event>;
    firstInit: () => void;
    listenForJumpToSlideSubj: () => import("rxjs").Observable<number>;
    listenForToggleAutoPlaySubj: () => import("rxjs").Observable<any[]>;
    listenForMoveToPrevSubj: () => import("rxjs").Observable<void>;
    listenForMoveToNextSubj: () => import("rxjs").Observable<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WmlSliceboxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WmlSliceboxComponent, "wml-slicebox", never, { "params": "params"; }, {}, never, never, false, never>;
}
declare class WmlSliceboxDefaults {
    constructor();
    prev: {
        index: number;
    };
    current: {
        index: number;
    };
    sliceboxSize: {
        height?: number;
        width?: number;
    };
    sliceboxSizeUseProvidedValues: boolean;
    orientation: 'v' | 'h';
    perspective: number;
    interval: number;
    cuboidsCount: number;
    disperseFactor: number;
    disperseSpeed: any;
    colorHiddenSides: string;
    sequentialFactor: number;
    speed: number;
    easing: string;
    autoplay: boolean;
    nextRotationDegree?: string;
    prevRotationDegree?: string;
    onBeforeChange: (position: any) => void;
    onAfterChange: (position: any) => void;
    onReady: () => void;
    reverse: boolean;
    images: WmlSliceboxImg[];
}
export declare class WmlSliceboxParams extends WmlSliceboxDefaults {
    constructor(params?: Partial<WmlSliceboxParams>);
    _reverse: boolean;
    sliceboxSize: {
        height: number;
        width: number;
    };
    _dir: WmlSliceboxDirection;
    resizeDelay: number;
    isAnimating: boolean;
    isFinishedResizing: boolean;
    isReady: boolean;
    itemsCount: number;
    animationDuration: number;
    realWidth: '500px';
    _cuboids: WmlSliceboxCuboidParams[];
    moveToNextSlideSubj: Subject<void>;
    moveToPrevSlideSubj: Subject<void>;
    jumpToSlideSubj: Subject<number>;
}
declare class WmlSliceboxCuboidParams extends WmlSliceboxDefaults {
    constructor(params?: Partial<WmlSliceboxCuboidParams>);
    transitionStartTop: any;
    transitionStartLeft: any;
    appliedDisperseFactor: number;
    class: string;
    classes: any[];
    updateClassString: (val: string, type?: "add" | "remove") => void;
    size: {
        width: number;
        height: number;
    };
    side: number;
    pos: number;
    extra: number;
    style: Partial<CSSStyleDeclaration>;
    isRotateComplete: boolean;
    isInDispersion: boolean;
    sidesStyles: {
        [k: string]: Partial<CSSStyleDeclaration>;
    };
    o: WmlSliceboxParams['orientation'];
    direction: 'next' | 'prev';
    frontSide: WMLUIProperty;
    backSide: WMLUIProperty;
    rightSide: WMLUIProperty;
    leftSide: WMLUIProperty;
    topSide: WMLUIProperty;
    bottomSide: WMLUIProperty;
}
export declare class WmlSliceboxImg extends WMLImage {
    constructor(params?: Partial<WmlSliceboxImg>);
    rotationDegree: string;
    cachedSrc: string;
}
declare type WmlSliceboxDirection = "next" | "prev";
export {};
