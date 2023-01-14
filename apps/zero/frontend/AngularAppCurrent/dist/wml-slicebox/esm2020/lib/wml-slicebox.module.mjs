import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { WmlSliceboxComponent } from './wml-slicebox/wml-slicebox.component';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
export class WmlSliceboxModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid21sLXNsaWNlYm94Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3dtbC1zbGljZWJveC9zcmMvbGliL3dtbC1zbGljZWJveC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDN0UsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQWtCL0MsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQVoxQixvQkFBb0IsYUFHcEIsZUFBZTtRQUNmLG1CQUFtQjtRQUNuQixZQUFZLGFBSVosb0JBQW9COytHQUdYLGlCQUFpQixZQVQxQixlQUFlO1FBQ2YsbUJBQW1CO1FBQ25CLFlBQVk7MkZBT0gsaUJBQWlCO2tCQWQ3QixRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWixvQkFBb0I7cUJBQ3JCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLG1CQUFtQjt3QkFDbkIsWUFBWTtxQkFFYjtvQkFDRCxPQUFPLEVBQUM7d0JBQ04sb0JBQW9CO3FCQUNyQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyYW5zbGF0ZU1vZHVsZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXbWxTbGljZWJveENvbXBvbmVudCB9IGZyb20gJy4vd21sLXNsaWNlYm94L3dtbC1zbGljZWJveC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgV21sU2xpY2Vib3hDb21wb25lbnQsXHJcbiAgXSxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUsXHJcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlXHJcblxyXG4gIF0sXHJcbiAgZXhwb3J0czpbXHJcbiAgICBXbWxTbGljZWJveENvbXBvbmVudFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFdtbFNsaWNlYm94TW9kdWxlIHsgfVxyXG4iXX0=