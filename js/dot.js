!function(t){"use strict";function s(t,r){var e,i;if("function"==typeof r)void 0!==(i=r(t))&&(t=i);else if(Array.isArray(r))for(e=0;e<r.length;e++)void 0!==(i=r[e](t))&&(t=i);return t}function f(t){return"[object Object]"===Object.prototype.toString.call(t)}function a(t){return Object(t)===t}function c(t){return 0===Object.keys(t).length}function u(t,r){return 0<=t.indexOf("[")&&(t=t.replace(/\[/g,".").replace(/]/g,"")),t.split(r)}var p=Object.prototype.hasOwnProperty;function n(t,r,e,i){if(!(this instanceof n))return new n(t,r,e,i);void 0===r&&(r=!1),void 0===e&&(e=!0),void 0===i&&(i=!0),this.separator=t||".",this.override=r,this.useArray=e,this.useBrackets=i,this.keepArray=!1,this.cleanup=[]}var e=new n(".",!1,!0,!0);function r(t){return function(){return e[t].apply(e,arguments)}}n.prototype._fill=function(t,r,e,i){var n=t.shift();if(0<t.length){if(r[n]=r[n]||(this.useArray&&function(t){return/^\d+$/.test(t)}(t[0])?[]:{}),!a(r[n])){if(!this.override){if(!a(e)||!c(e))throw new Error("Trying to redefine `"+n+"` which is a "+typeof r[n]);return}r[n]={}}this._fill(t,r[n],e,i)}else{if(!this.override&&a(r[n])&&!c(r[n])){if(!a(e)||!c(e))throw new Error("Trying to redefine non-empty obj['"+n+"']");return}r[n]=s(e,i)}},n.prototype.object=function(i,n){var o=this;return Object.keys(i).forEach(function(t){var r=void 0===n?null:n[t],e=u(t,o.separator).join(o.separator);-1!==e.indexOf(o.separator)?(o._fill(e.split(o.separator),i,i[t],r),delete i[t]):i[t]=s(i[t],r)}),i},n.prototype.str=function(t,r,e,i){var n=u(t,this.separator).join(this.separator);return-1!==t.indexOf(this.separator)?this._fill(n.split(this.separator),e,r,i):e[t]=s(r,i),e},n.prototype.pick=function(t,r,e,i){var n,o,s,a,c,f,p;for(o=u(t,this.separator),n=0;n<o.length;n++){if(f=o[n],p=r,a="-"===f[0]&&Array.isArray(p)&&/^-\d+$/.test(f)?p.length+parseInt(f,10):f,!(r&&"object"==typeof r&&a in r))return;if(n===o.length-1)return e?(s=r[a],i&&Array.isArray(r)?r.splice(a,1):delete r[a],Array.isArray(r)&&(c=o.slice(0,-1).join("."),-1===this.cleanup.indexOf(c)&&this.cleanup.push(c)),s):r[a];r=r[a]}return e&&Array.isArray(r)&&(r=r.filter(function(t){return void 0!==t})),r},n.prototype.delete=function(t,r){return this.remove(t,r,!0)},n.prototype.remove=function(t,r,e){var i;if(this.cleanup=[],Array.isArray(t)){for(i=0;i<t.length;i++)this.pick(t[i],r,!0,e);return e||this._cleanup(r),r}return this.pick(t,r,!0,e)},n.prototype._cleanup=function(t){var r,e,i,n;if(this.cleanup.length){for(e=0;e<this.cleanup.length;e++)r=(r=(n=(i=this.cleanup[e].split(".")).splice(0,-1).join("."))?this.pick(n,t):t)[i[0]].filter(function(t){return void 0!==t}),this.set(this.cleanup[e],r,t);this.cleanup=[]}},n.prototype.del=n.prototype.remove,n.prototype.move=function(t,r,e,i,n){return"function"==typeof i||Array.isArray(i)?this.set(r,s(this.pick(t,e,!0),i),e,n):(n=i,this.set(r,this.pick(t,e,!0),e,n)),e},n.prototype.transfer=function(t,r,e,i,n,o){return"function"==typeof n||Array.isArray(n)?this.set(r,s(this.pick(t,e,!0),n),i,o):(o=n,this.set(r,this.pick(t,e,!0),i,o)),i},n.prototype.copy=function(t,r,e,i,n,o){return"function"==typeof n||Array.isArray(n)?this.set(r,s(JSON.parse(JSON.stringify(this.pick(t,e,!1))),n),i,o):(o=n,this.set(r,this.pick(t,e,!1),i,o)),i},n.prototype.set=function(t,r,e,i){var n,o,s,a;if(void 0===r)return e;for(s=u(t,this.separator),n=0;n<s.length;n++){if(a=s[n],n===s.length-1)if(i&&f(r)&&f(e[a]))for(o in r)p.call(r,o)&&(e[a][o]=r[o]);else if(i&&Array.isArray(e[a])&&Array.isArray(r))for(var c=0;c<r.length;c++)e[s[n]].push(r[c]);else e[a]=r;else p.call(e,a)&&(f(e[a])||Array.isArray(e[a]))||(/^\d+$/.test(s[n+1])?e[a]=[]:e[a]={});e=e[a]}return e},n.prototype.transform=function(r,e,i){return e=e||{},i=i||{},Object.keys(r).forEach(function(t){this.set(r[t],this.pick(t,e),i)}.bind(this)),i},n.prototype.dot=function(i,n,o){n=n||{},o=o||[];var s=Array.isArray(i);return Object.keys(i).forEach(function(t){var r=s&&this.useBrackets?"["+t+"]":t;if(a(i[t])&&(f(i[t])&&!c(i[t])||Array.isArray(i[t])&&!this.keepArray&&0!==i[t].length)){if(s&&this.useBrackets){var e=o[o.length-1]||"";return this.dot(i[t],n,o.slice(0,-1).concat(e+r))}return this.dot(i[t],n,o.concat(r))}s&&this.useBrackets?n[o.join(this.separator).concat("["+t+"]")]=i[t]:n[o.concat(r).join(this.separator)]=i[t]}.bind(this)),n},n.pick=r("pick"),n.move=r("move"),n.transfer=r("transfer"),n.transform=r("transform"),n.copy=r("copy"),n.object=r("object"),n.str=r("str"),n.set=r("set"),n.delete=r("delete"),n.del=n.remove=r("remove"),n.dot=r("dot"),["override","overwrite"].forEach(function(t){Object.defineProperty(n,t,{get:function(){return e.override},set:function(t){e.override=!!t}})}),["useArray","keepArray","useBrackets"].forEach(function(r){Object.defineProperty(n,r,{get:function(){return e[r]},set:function(t){e[r]=t}})}),n._process=s,"function"==typeof define&&define.amd?define(function(){return n}):"undefined"!=typeof module&&module.exports?module.exports=n:t.DotObject=n}(this);