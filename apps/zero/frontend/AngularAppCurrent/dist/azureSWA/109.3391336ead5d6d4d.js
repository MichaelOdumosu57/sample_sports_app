(self.webpackChunkAngularAppV2=self.webpackChunkAngularAppV2||[]).push([[109],{96434:(E,A)=>{"use strict";A.byteLength=function g(o){var u=c(o),m=u[1];return 3*(u[0]+m)/4-m},A.toByteArray=function C(o){var u,n,h=c(o),m=h[0],x=h[1],d=new M(function _(o,u,h){return 3*(u+h)/4-h}(0,m,x)),e=0,t=x>0?m-4:m;for(n=0;n<t;n+=4)u=f[o.charCodeAt(n)]<<18|f[o.charCodeAt(n+1)]<<12|f[o.charCodeAt(n+2)]<<6|f[o.charCodeAt(n+3)],d[e++]=u>>16&255,d[e++]=u>>8&255,d[e++]=255&u;return 2===x&&(u=f[o.charCodeAt(n)]<<2|f[o.charCodeAt(n+1)]>>4,d[e++]=255&u),1===x&&(u=f[o.charCodeAt(n)]<<10|f[o.charCodeAt(n+1)]<<4|f[o.charCodeAt(n+2)]>>2,d[e++]=u>>8&255,d[e++]=255&u),d},A.fromByteArray=function F(o){for(var u,h=o.length,m=h%3,x=[],d=16383,e=0,t=h-m;e<t;e+=d)x.push(L(o,e,e+d>t?t:e+d));return 1===m?x.push(p[(u=o[h-1])>>2]+p[u<<4&63]+"=="):2===m&&x.push(p[(u=(o[h-2]<<8)+o[h-1])>>10]+p[u>>4&63]+p[u<<2&63]+"="),x.join("")};for(var p=[],f=[],M=typeof Uint8Array<"u"?Uint8Array:Array,w="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,y=w.length;i<y;++i)p[i]=w[i],f[w.charCodeAt(i)]=i;function c(o){var u=o.length;if(u%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var h=o.indexOf("=");return-1===h&&(h=u),[h,h===u?0:4-h%4]}function l(o){return p[o>>18&63]+p[o>>12&63]+p[o>>6&63]+p[63&o]}function L(o,u,h){for(var x=[],d=u;d<h;d+=3)x.push(l((o[d]<<16&16711680)+(o[d+1]<<8&65280)+(255&o[d+2])));return x.join("")}f["-".charCodeAt(0)]=62,f["_".charCodeAt(0)]=63},93105:E=>{"use strict";var f,A="object"==typeof Reflect?Reflect:null,p=A&&"function"==typeof A.apply?A.apply:function(t,n,r){return Function.prototype.apply.call(t,n,r)};f=A&&"function"==typeof A.ownKeys?A.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var w=Number.isNaN||function(t){return t!=t};function i(){i.init.call(this)}E.exports=i,E.exports.once=function m(e,t){return new Promise(function(n,r){function s(a){e.removeListener(t,v),r(a)}function v(){"function"==typeof e.removeListener&&e.removeListener("error",s),n([].slice.call(arguments))}d(e,t,v,{once:!0}),"error"!==t&&function x(e,t,n){"function"==typeof e.on&&d(e,"error",t,n)}(e,s,{once:!0})})},i.EventEmitter=i,i.prototype._events=void 0,i.prototype._eventsCount=0,i.prototype._maxListeners=void 0;var y=10;function c(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function g(e){return void 0===e._maxListeners?i.defaultMaxListeners:e._maxListeners}function _(e,t,n,r){var s,v,a;if(c(n),void 0===(v=e._events)?(v=e._events=Object.create(null),e._eventsCount=0):(void 0!==v.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),v=e._events),a=v[t]),void 0===a)a=v[t]=n,++e._eventsCount;else if("function"==typeof a?a=v[t]=r?[n,a]:[a,n]:r?a.unshift(n):a.push(n),(s=g(e))>0&&a.length>s&&!a.warned){a.warned=!0;var b=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");b.name="MaxListenersExceededWarning",b.emitter=e,b.type=t,b.count=a.length,function M(e){console&&console.warn&&console.warn(e)}(b)}return e}function C(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function l(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},s=C.bind(r);return s.listener=n,r.wrapFn=s,s}function L(e,t,n){var r=e._events;if(void 0===r)return[];var s=r[t];return void 0===s?[]:"function"==typeof s?n?[s.listener||s]:[s]:n?function h(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(s):o(s,s.length)}function F(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function o(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}function d(e,t,n,r){if("function"==typeof e.on)r.once?e.once(t,n):e.on(t,n);else{if("function"!=typeof e.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e);e.addEventListener(t,function s(v){r.once&&e.removeEventListener(t,s),n(v)})}}Object.defineProperty(i,"defaultMaxListeners",{enumerable:!0,get:function(){return y},set:function(e){if("number"!=typeof e||e<0||w(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");y=e}}),i.init=function(){(void 0===this._events||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},i.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||w(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},i.prototype.getMaxListeners=function(){return g(this)},i.prototype.emit=function(t){for(var n=[],r=1;r<arguments.length;r++)n.push(arguments[r]);var s="error"===t,v=this._events;if(void 0!==v)s=s&&void 0===v.error;else if(!s)return!1;if(s){var a;if(n.length>0&&(a=n[0]),a instanceof Error)throw a;var b=new Error("Unhandled error."+(a?" ("+a.message+")":""));throw b.context=a,b}var O=v[t];if(void 0===O)return!1;if("function"==typeof O)p(O,this,n);else{var N=O.length,j=o(O,N);for(r=0;r<N;++r)p(j[r],this,n)}return!0},i.prototype.on=i.prototype.addListener=function(t,n){return _(this,t,n,!1)},i.prototype.prependListener=function(t,n){return _(this,t,n,!0)},i.prototype.once=function(t,n){return c(n),this.on(t,l(this,t,n)),this},i.prototype.prependOnceListener=function(t,n){return c(n),this.prependListener(t,l(this,t,n)),this},i.prototype.off=i.prototype.removeListener=function(t,n){var r,s,v,a,b;if(c(n),void 0===(s=this._events))return this;if(void 0===(r=s[t]))return this;if(r===n||r.listener===n)0==--this._eventsCount?this._events=Object.create(null):(delete s[t],s.removeListener&&this.emit("removeListener",t,r.listener||n));else if("function"!=typeof r){for(v=-1,a=r.length-1;a>=0;a--)if(r[a]===n||r[a].listener===n){b=r[a].listener,v=a;break}if(v<0)return this;0===v?r.shift():function u(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(r,v),1===r.length&&(s[t]=r[0]),void 0!==s.removeListener&&this.emit("removeListener",t,b||n)}return this},i.prototype.removeAllListeners=function(t){var n,r,s;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[t]),this;if(0===arguments.length){var a,v=Object.keys(r);for(s=0;s<v.length;++s)"removeListener"!==(a=v[s])&&this.removeAllListeners(a);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(n=r[t]))this.removeListener(t,n);else if(void 0!==n)for(s=n.length-1;s>=0;s--)this.removeListener(t,n[s]);return this},i.prototype.listeners=function(t){return L(this,t,!0)},i.prototype.rawListeners=function(t){return L(this,t,!1)},i.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):F.call(e,t)},i.prototype.listenerCount=F,i.prototype.eventNames=function(){return this._eventsCount>0?f(this._events):[]}},12658:(E,A)=>{A.read=function(p,f,M,w,i){var y,c,g=8*i-w-1,_=(1<<g)-1,C=_>>1,l=-7,L=M?i-1:0,F=M?-1:1,o=p[f+L];for(L+=F,y=o&(1<<-l)-1,o>>=-l,l+=g;l>0;y=256*y+p[f+L],L+=F,l-=8);for(c=y&(1<<-l)-1,y>>=-l,l+=w;l>0;c=256*c+p[f+L],L+=F,l-=8);if(0===y)y=1-C;else{if(y===_)return c?NaN:1/0*(o?-1:1);c+=Math.pow(2,w),y-=C}return(o?-1:1)*c*Math.pow(2,y-w)},A.write=function(p,f,M,w,i,y){var c,g,_,C=8*y-i-1,l=(1<<C)-1,L=l>>1,F=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,o=w?0:y-1,u=w?1:-1,h=f<0||0===f&&1/f<0?1:0;for(f=Math.abs(f),isNaN(f)||f===1/0?(g=isNaN(f)?1:0,c=l):(c=Math.floor(Math.log(f)/Math.LN2),f*(_=Math.pow(2,-c))<1&&(c--,_*=2),(f+=c+L>=1?F/_:F*Math.pow(2,1-L))*_>=2&&(c++,_/=2),c+L>=l?(g=0,c=l):c+L>=1?(g=(f*_-1)*Math.pow(2,i),c+=L):(g=f*Math.pow(2,L-1)*Math.pow(2,i),c=0));i>=8;p[M+o]=255&g,o+=u,g/=256,i-=8);for(c=c<<i|g,C+=i;C>0;p[M+o]=255&c,o+=u,c/=256,C-=8);p[M+o-u]|=128*h}}}]);