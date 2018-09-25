var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();!function(){function t(e,n,r){function o(s,a){if(!n[s]){if(!e[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var l=n[s]={exports:{}};e[s][0].call(l.exports,function(t){return o(e[s][1][t]||t)},l,l.exports,t,e,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}return t}()({1:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t("./WEventDispatcher"),o=t("./WHttpRequest"),i=t("./WEvent"),s=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._customParse=!1,e}return __extends(e,t),e.prototype.load=function(t,n){void 0===n&&(n=null),this._url=t,this._type=n,this._data=null;var r=n;e.preLoadedMap[this.url]?this.onLoaded(e.preLoadedMap[this.url]):(this._http||(this._http=new o.WHttpRequest,this._http.on(i.WEvent.ERROR,this,this.onError),this._http.on(i.WEvent.COMPLETE,this,this.onLoaded)),this._http.send(this.url,null,"get",r))},e.prototype.onError=function(t){this.event(i.WEvent.ERROR,t)},e.prototype.onLoaded=function(t){void 0===t&&(t=null),this.parsePLFData(t),this.complete(t)},e.prototype.parsePLFData=function(t){var n,r;for(var o in t)switch(r=t[this.type],this.type){case"json":case"text":for(n in r)e.preLoadedMap[n]=r[n];break;default:for(n in r)e.preLoadedMap[n]=r[n]}},e.prototype.complete=function(t){this._data=t,this._customParse?this.event(i.WEvent.LOADED,this.data instanceof Array?[this.data]:this.data):(e._loaders.push(this),e._isWorking||e.checkNext())},e.checkNext=function(){e._isWorking=!0;for(var t=Date.now();e._startIndex<e._loaders.length;)if(Date.now(),e._loaders[e._startIndex].endLoad(),e._startIndex++,Date.now()-t>e.maxTimeOut)return console.warn("loader callback cost a long time:"+(Date.now()-t)+" this.url="+e._loaders[e._startIndex-1].url),void Laya.timer.frameOnce(1,null,e.checkNext);e._loaders.length=0,e._startIndex=0,e._isWorking=!1},e.prototype.endLoad=function(t){void 0===t&&(t=null),t&&(this._data=t),this.event(i.WEvent.PROGRESS,1),this.event(i.WEvent.COMPLETE,this.data instanceof Array?[this.data]:this.data)},Object.defineProperty(e.prototype,"url",{get:function(){return this._url},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"type",{get:function(){return this._type},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"data",{get:function(){return this._data},enumerable:!0,configurable:!0}),e.TEXT="text",e.JSON="json",e.maxTimeOut=100,e.preLoadedMap={},e._loaders=[],e._isWorking=!1,e._startIndex=0,e}(r.WEventDispatcher);n.WLoader=s},{"./WEvent":3,"./WEventDispatcher":4,"./WHttpRequest":7}],2:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t("./Loader");new(function(){function t(){try{t.d=document,t.html=t.d.body.children[0]}catch(t){}var e=new r.WLoader;e.load("version.json?"+Date.now(),"json"),e.on("complete",this,this.loadOk)}return t.prototype.loadOk=function(e){var n=this;t.data=e,loadLib(t.getUrl("wlibs/require.min.js")),setTimeout(function(){n.onMain()},200)},t.JssArr=function(){var t=[];return t.push("wlibs/laya.core.js"),t.push("wlibs/laya.webgl.js"),t.push("wlibs/laya.ani.js"),t.push("wlibs/laya.d3.js"),t.push("wlibs/laya.physics3D.js"),t.push("wlibs/fairygui.js"),t.push("wlibs/TweenMax.min.js"),t.push("js/bundle.js"),t},t.prototype.onMain=function(){t.jsUrlArr=[];t.JssArr().forEach(function(e){t.jsUrlArr.push(t.getUrl(e))}),t.totalNum=t.jsUrlArr.length,t.num=0,t.jsLoad()},t.jsLoad=function(){if(null!=t.html&&null!=t.html.innerText&&(t.html.innerText="正在加载启动程序...("+t.num+"/"+t.totalNum+")"),t.num<t.totalNum){var e=t.jsUrlArr[t.num];t.loadJs([e],t.jsLoad),t.num+=1}},t.loadJs=function(e,n){e.length>0&&requirejs(e,n,function(e){null!=t.html&&null!=t.html.innerText&&(t.html.innerText="正在加载启动程序...(网络不稳定,出现故障,请刷新页面...)^-^!")})},t.getUrl=function(e){var n=e;return null!=t.data[n]&&(n=t.data[n]),n},t}())},{"./Loader":1}],3:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function t(){}return t.prototype.setTo=function(t,e,n){return this.type=this.type,this.currentTarget=this.currentTarget,this.target=this.target,this},t.prototype.stopPropagation=function(){this._stoped=!0},t.ERROR="error",t.COMPLETE="complete",t.LOADED="loaded",t.PROGRESS="progress",t}();n.WEvent=r},{}],4:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t("./WEventHandler"),o=function(){function t(){}return t.prototype.hasListener=function(t){return!!(this._events&&this._events[t])},t.prototype.event=function(t,e){if(void 0===e&&(e=null),!this._events||!this._events[t])return!1;var n=this._events[t];if(n.run)n.once&&delete this._events[t],null!=e?n.runWith(e):n.run();else{for(var r=0,o=n.length;r<o;r++){var i=n[r];i&&(null!=e?i.runWith(e):i.run()),i&&!i.once||(n.splice(r,1),r--,o--)}0===n.length&&this._events&&delete this._events[t]}return!0},t.prototype.on=function(t,e,n,r){return void 0===r&&(r=null),this._createListener(t,e,n,r,!1)},t.prototype.once=function(t,e,n,r){return void 0===r&&(r=null),this._createListener(t,e,n,r,!0)},t.prototype._createListener=function(t,e,n,o,i,s){void 0===s&&(s=!0),s&&this.off(t,e,n,i);var a=r.WEventHandler.create(e||this,n,o,i);this._events||(this._events={});var u=this._events;return u[t]?u[t].run?u[t]=[u[t],a]:u[t].push(a):u[t]=a,this},t.prototype.off=function(t,e,n,r){if(void 0===r&&(r=!1),!this._events||!this._events[t])return this;var o=this._events[t];if(null!=n)if(o.run)e&&o.caller!==e||null!=n&&o.method!==n||r&&!o.once||(delete this._events[t],o.recover());else{for(var i=0,s=0,a=o.length;s<a;s++){var u=o[s];u?!u||e&&u.caller!==e||null!=n&&u.method!==n||r&&!u.once||(i++,o[s]=null,u.recover()):i++}i===a&&delete this._events[t]}return this},t.prototype.offAll=function(t){void 0===t&&(t=null);var e=this._events;if(!e)return this;if(t)this._recoverHandlers(e[t]),delete e[t];else{for(var n in e)this._recoverHandlers(e[n]);this._events=null}return this},t.prototype.offAllCaller=function(t){if(t&&this._events)for(var e in this._events)this.off(e,t,null);return this},t.prototype._recoverHandlers=function(t){if(t)if(t.run)t.recover();else for(var e=t.length-1;e>-1;e--)t[e]&&(t[e].recover(),t[e]=null)},t}();n.WEventDispatcher=o},{"./WEventHandler":5}],5:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(t){function e(e,n,r,o){return t.call(this,e,n,r,o)||this}return __extends(e,t),e.prototype.recover=function(){this._id>0&&(this._id=0,e._pool.push(this.clear()))},e.create=function(t,n,r,o){return void 0===r&&(r=null),void 0===o&&(o=!0),e._pool.length?e._pool.pop().setTo(t,n,r,o):new e(t,n,r,o)},e}(t("./WHandler").WHandler);n.WEventHandler=r},{"./WHandler":6}],6:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function t(t,e,n,r){void 0===t&&(t=null),void 0===e&&(e=null),void 0===n&&(n=null),void 0===r&&(r=!1),this.once=!1,this._id=0,this.setTo(t,e,n,r)}return t.prototype.setTo=function(e,n,r,o){return this._id=t._gid++,this.caller=e,this.method=n,this.args=r,this.once=o,this},t.prototype.run=function(){if(null==this.method)return null;var t=this._id,e=this.method.apply(this.caller,this.args);return this._id===t&&this.once&&this.recover(),e},t.prototype.runWith=function(t){if(null==this.method)return null;var e=this._id;if(null==t)var n=this.method.apply(this.caller,this.args);else n=this.args||t.unshift?this.args?this.method.apply(this.caller,this.args.concat(t)):this.method.apply(this.caller,t):this.method.call(this.caller,t);return this._id===e&&this.once&&this.recover(),n},t.prototype.clear=function(){return this.caller=null,this.method=null,this.args=null,this},t.prototype.recover=function(){this._id>0&&(this._id=0,t._pool.push(this.clear()))},t.create=function(e,n,r,o){return void 0===r&&(r=null),void 0===o&&(o=!0),t._pool.length?t._pool.pop().setTo(e,n,r,o):new t(e,n,r,o)},t._pool=[],t._gid=1,t}();n.WHandler=r},{}],7:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t("./WEventDispatcher"),o=t("./WEvent"),i=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._http=new window.XMLHttpRequest,e}return __extends(e,t),e.prototype.send=function(t,e,n,r,o){void 0===e&&(e=null),void 0===n&&(n="get"),void 0===r&&(r="text"),void 0===o&&(o=null),this._responseType=r,this._data=null;var i=this;this._http;if(this.http.open(n,t,!0),o)for(var s=0;s<o.length;s++)this.http.setRequestHeader(o[s++],o[s]);this.http.responseType="arraybuffer"!=r?"text":"arraybuffer",this.http.onerror=function(t){i._onError(t)},this.http.onabort=function(t){i._onAbort(t)},this.http.onload=function(t){i._onLoad(t)},this.http.send(this.data)},e.prototype._onAbort=function(t){this.error("Request was aborted by user")},e.prototype._onError=function(t){this.error("Request failed Status:"+this._http.status+" text:"+this._http.statusText)},e.prototype._onLoad=function(t){this._http;var e=void 0!=this.http.status?this.http.status:200;200===e||204===e||0===e?this.complete():this.error("["+this.http.status+"]"+this.http.statusText+":"+this.http.responseURL)},e.prototype.error=function(t){this.clear(),console.warn(this.url,t),this.event(o.WEvent.ERROR,t)},e.prototype.complete=function(){this.clear();var t=!0;try{"json"===this._responseType?this._data=JSON.parse(this._http.responseText):"xml"===this._responseType||(this._data=this._http.response||this._http.responseText)}catch(e){t=!1,this.error(e.message)}t&&this.event(o.WEvent.COMPLETE,this._data instanceof Array?[this._data]:this._data)},e.prototype.clear=function(){this._http;this.http.onerror=this.http.onabort=this.http.onprogress=this.http.onload=null},Object.defineProperty(e.prototype,"url",{get:function(){return this._http.responseURL},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"data",{get:function(){return this._data},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"http",{get:function(){return this._http},enumerable:!0,configurable:!0}),e}(r.WEventDispatcher);n.WHttpRequest=i},{"./WEvent":3,"./WEventDispatcher":4}]},{},[2]);