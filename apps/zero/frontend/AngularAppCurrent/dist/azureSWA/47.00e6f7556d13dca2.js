"use strict";(self.webpackChunkAngularAppV2=self.webpackChunkAngularAppV2||[]).push([[47],{30047:(F,m,s)=>{s.r(m),s.d(m,{MemberProtectionComponent:()=>c});var P=s(38023),u=s(13528),M=s(98168),h=s(16721),d=s(40502),t=s(64537),C=s(52522),v=s(39114),T=s(32161),a=s(17108),g=s(44551),f=s(84967),b=s(27969);class r{constructor(){this.loadpdf=e=>{let n=pdfjsLib.getDocument(e);return(0,a.D)(n.promise).pipe((0,g.b)(i=>this.loadPages(i)))},this.loadPages=e=>{let n=Array(e.numPages).fill(null).map((i,l)=>(0,a.D)(e.getPage(l+1)));return(0,f.D)(n).pipe((0,g.b)(i=>this.loadTextContent(i)))},this.loadTextContent=e=>{let n=e.map((i,l)=>i.getTextContent?(0,a.D)(i.getTextContent()):null).filter(i=>null!==i);return(0,f.D)(n).pipe((0,b.U)(i=>i))}}}r.\u0275fac=function(e){return new(e||r)},r.\u0275prov=t.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"});var p=s(88692),O=s(54910);function y(o,e){if(1&o&&(t.TgZ(0,"h3"),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&o){const n=t.oxw().$implicit,i=t.oxw();t.Tol(i.classPrefix("MainText0")),t.xp6(1),t.Oqu(t.lcZ(2,3,n.text))}}function A(o,e){if(1&o&&(t.TgZ(0,"p"),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&o){const n=t.oxw().$implicit,i=t.oxw();t.Tol(i.classPrefix("MainText1")),t.xp6(1),t.Oqu(t.lcZ(2,3,n.text))}}function Z(o,e){if(1&o&&(t.TgZ(0,"li"),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&o){const n=e.$implicit,i=t.oxw(3);t.Tol(i.classPrefix("MainText2")),t.xp6(1),t.Oqu(t.lcZ(2,3,n))}}function V(o,e){if(1&o&&(t.TgZ(0,"ul"),t.YNc(1,Z,3,5,"li",2),t.qZA()),2&o){const n=t.oxw().$implicit,i=t.oxw();t.Tol(i.classPrefix("MainText1")),t.xp6(1),t.Q6J("ngForOf",n.text)}}function Y(o,e){if(1&o&&(t.ynx(0),t.YNc(1,y,3,5,"h3",1),t.YNc(2,A,3,5,"p",1),t.YNc(3,V,2,3,"ul",1),t.BQk()),2&o){const n=e.$implicit;t.xp6(1),t.Q6J("ngIf","section"===n.type),t.xp6(1),t.Q6J("ngIf","text"===n.type),t.xp6(1),t.Q6J("ngIf","list"===n.type)}}class c{constructor(e,n,i,l,S){this.cdref=e,this.utilService=n,this.configService=i,this.baseService=l,this.legalService=S,this.classPrefix=this.utilService.generateClassPrefix("MemberProtection"),this.myClass=this.classPrefix("View"),this.ngUnsub=new P.x,this.sections=d.Cz.N.map((x,U)=>new D({text:x,type:["section","text","list","section","text","text","text","list","section","text","text","text","text","text","text","text","text","section","text","text","section","text","text","text","text","text","section","text","section","text","list","section","text","list","text","list","text","text","text","text","text","text","text","section","text","section","list","text","text","list","text","text","text","text","section","list",...Array(9).fill("text"),"section",...Array(5).fill("text"),"section","list",...Array(4).fill("text"),"list","text","section","text"][U]??"text"})),this.loadPDFInfo=()=>this.legalService.loadpdf("/assets/media/legal/Members_Protection_Policy_and_Responsible_Gaming.pdf").pipe((0,u.R)(this.ngUnsub),(0,M.b)(x=>{console.log(x)}))}ngOnInit(){}ngOnDestroy(){this.ngUnsub.next(),this.ngUnsub.complete()}}c.\u0275fac=function(e){return new(e||c)(t.Y36(t.sBO),t.Y36(C.t),t.Y36(v.E),t.Y36(T.b),t.Y36(r))},c.\u0275cmp=t.Xpm({type:c,selectors:[["member-protection"]],hostVars:2,hostBindings:function(e,n){2&e&&t.Tol(n.myClass)},standalone:!0,features:[t.jDz],decls:5,vars:6,consts:[[4,"ngFor","ngForOf"],[3,"class",4,"ngIf"],[3,"class",4,"ngFor","ngForOf"]],template:function(e,n){1&e&&(t.TgZ(0,"div")(1,"h1"),t._uU(2),t.ALo(3,"translate"),t.qZA(),t.YNc(4,Y,4,3,"ng-container",0),t.qZA()),2&e&&(t.Tol(n.classPrefix("MainPod")),t.xp6(2),t.Oqu(t.lcZ(3,4,"memberProtection.title")),t.xp6(2),t.Q6J("ngForOf",n.sections))},dependencies:[h.m,p.sg,p.O5,O.X$],styles:[".MemberProtectionView[_nghost-%COMP%]{display:block}.MemberProtectionView[_nghost-%COMP%]   .MemberProtectionMainPod[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;align-items:flex-start;margin:auto;max-width:150rem;padding:1rem 4.5rem;background-color:#f8f9fa}.MemberProtectionView[_nghost-%COMP%]   .MemberProtectionMainPod[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{align-self:flex-start;font-size:3rem}.MemberProtectionView[_nghost-%COMP%]   .MemberProtectionMainText0[_ngcontent-%COMP%]{margin:3rem 0 0}.MemberProtectionView[_nghost-%COMP%]   .MemberProtectionMainText1[_ngcontent-%COMP%]{margin:1rem 0 0}.MemberProtectionView[_nghost-%COMP%]   .MemberProtectionMainText2[_ngcontent-%COMP%]{margin:0 0 0 3rem}"],changeDetection:0});class D{constructor(e={}){this.type="text",Object.assign(this,{...e})}}}}]);