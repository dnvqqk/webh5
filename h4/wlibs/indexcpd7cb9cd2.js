var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();!function(){function t(e,r,n){function o(s,a){if(!r[s]){if(!e[s]){var h="function"==typeof require&&require;if(!a&&h)return h(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var l=r[s]={exports:{}};e[s][0].call(l.exports,function(t){return o(e[s][1][t]||t)},l,l.exports,t,e,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}return t}()({1:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t("./WEventDispatcher"),o=t("./WHttpRequest"),i=t("./WEvent"),s=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._customParse=!1,e}return __extends(e,t),e.prototype.load=function(t,r){void 0===r&&(r=null),this._url=t,this._type=r,this._data=null;var n=r;e.preLoadedMap[this.url]?this.onLoaded(e.preLoadedMap[this.url]):(this._http||(this._http=new o.WHttpRequest,this._http.on(i.WEvent.ERROR,this,this.onError),this._http.on(i.WEvent.COMPLETE,this,this.onLoaded)),this._http.send(this.url,null,"get",n))},e.prototype.onError=function(t){this.event(i.WEvent.ERROR,t)},e.prototype.onLoaded=function(t){void 0===t&&(t=null),this.parsePLFData(t),this.complete(t)},e.prototype.parsePLFData=function(t){var r,n;for(var o in t)switch(n=t[this.type],this.type){case"json":case"text":for(r in n)e.preLoadedMap[r]=n[r];break;default:for(r in n)e.preLoadedMap[r]=n[r]}},e.prototype.complete=function(t){this._data=t,this._customParse?this.event(i.WEvent.LOADED,this.data instanceof Array?[this.data]:this.data):(e._loaders.push(this),e._isWorking||e.checkNext())},e.checkNext=function(){e._isWorking=!0;for(var t=Date.now();e._startIndex<e._loaders.length;)if(Date.now(),e._loaders[e._startIndex].endLoad(),e._startIndex++,Date.now()-t>e.maxTimeOut)return console.warn("loader callback cost a long time:"+(Date.now()-t)+" this.url="+e._loaders[e._startIndex-1].url),void setInterval(e.checkNext,1);e._loaders.length=0,e._startIndex=0,e._isWorking=!1},e.prototype.endLoad=function(t){void 0===t&&(t=null),t&&(this._data=t),this.event(i.WEvent.PROGRESS,1),this.event(i.WEvent.COMPLETE,this.data instanceof Array?[this.data]:this.data)},Object.defineProperty(e.prototype,"url",{get:function(){return this._url},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"type",{get:function(){return this._type},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"data",{get:function(){return this._data},enumerable:!0,configurable:!0}),e.TEXT="text",e.JSON="json",e.maxTimeOut=100,e.preLoadedMap={},e._loaders=[],e._isWorking=!1,e._startIndex=0,e}(n.WEventDispatcher);r.WLoader=s},{"./WEvent":3,"./WEventDispatcher":4,"./WHttpRequest":7}],2:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t("./Loader");new(function(){function t(){try{t.d=document,t.html=t.d.body.children[0]}catch(t){}var e=new n.WLoader;e.load("version.json","json"),e.on("complete",this,this.loadOk)}return t.prototype.loadOk=function(e){var r=this;t.data=e,loadLib(t.getUrl("wlibs/require.min.js")),setTimeout(function(){r.onMain()},1500)},t.JssArr=function(){var t=[];return t.push("libs/laya.core.js"),t.push("libs/laya.webgl.js"),t.push("libs/laya.ani.js"),t.push("libs/laya.d3.js"),t.push("libs/laya.physics3D.js"),t.push("libs/laya.html.js"),t.push("wlibs/fairygui.js"),t.push("wlibs/TweenMax.min.js"),t.push("js/bundle.js"),t},t.prototype.onMain=function(){t.jsUrlArr=[];t.JssArr().forEach(function(e){t.jsUrlArr.push(t.getUrl(e))}),t.totalNum=t.jsUrlArr.length,t.num=0,t.jsLoad()},t.jsLoad=function(){if(null!=t.html&&null!=t.html.innerText&&(t.html.innerText="正在加载启动程序...("+t.num+"/"+t.totalNum+")"),t.num<t.totalNum){var e=t.jsUrlArr[t.num],r=new n.WLoader;r.load(e,"text"),r.on("error",this,t.loadError),r.on("complete",this,function(r){t.loadJs([e],t.jsLoad)}),t.num+=1}},t.loadJs=function(e,r){e.length>0&&requirejs(e,r,t.loadError)},t.loadError=function(e){null!=t.html&&null!=t.html.innerText&&(t.html.innerText="正在加载启动程序...(网络不稳定,出现故障,请刷新页面...)^-^!")},t.getUrl=function(e){var r=e;return null!=t.data[r]&&(r=t.data[r]),r},t}())},{"./Loader":1}],3:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(){}return t.prototype.setTo=function(t,e,r){return this.type=this.type,this.currentTarget=this.currentTarget,this.target=this.target,this},t.prototype.stopPropagation=function(){this._stoped=!0},t.ERROR="error",t.COMPLETE="complete",t.LOADED="loaded",t.PROGRESS="progress",t}();r.WEvent=n},{}],4:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t("./WEventHandler"),o=function(){function t(){}return t.prototype.hasListener=function(t){return!!(this._events&&this._events[t])},t.prototype.event=function(t,e){if(void 0===e&&(e=null),!this._events||!this._events[t])return!1;var r=this._events[t];if(r.run)r.once&&delete this._events[t],null!=e?r.runWith(e):r.run();else{for(var n=0,o=r.length;n<o;n++){var i=r[n];i&&(null!=e?i.runWith(e):i.run()),i&&!i.once||(r.splice(n,1),n--,o--)}0===r.length&&this._events&&delete this._events[t]}return!0},t.prototype.on=function(t,e,r,n){return void 0===n&&(n=null),this._createListener(t,e,r,n,!1)},t.prototype.once=function(t,e,r,n){return void 0===n&&(n=null),this._createListener(t,e,r,n,!0)},t.prototype._createListener=function(t,e,r,o,i,s){void 0===s&&(s=!0),s&&this.off(t,e,r,i);var a=n.WEventHandler.create(e||this,r,o,i);this._events||(this._events={});var h=this._events;return h[t]?h[t].run?h[t]=[h[t],a]:h[t].push(a):h[t]=a,this},t.prototype.off=function(t,e,r,n){if(void 0===n&&(n=!1),!this._events||!this._events[t])return this;var o=this._events[t];if(null!=r)if(o.run)e&&o.caller!==e||null!=r&&o.method!==r||n&&!o.once||(delete this._events[t],o.recover());else{for(var i=0,s=0,a=o.length;s<a;s++){var h=o[s];h?!h||e&&h.caller!==e||null!=r&&h.method!==r||n&&!h.once||(i++,o[s]=null,h.recover()):i++}i===a&&delete this._events[t]}return this},t.prototype.offAll=function(t){void 0===t&&(t=null);var e=this._events;if(!e)return this;if(t)this._recoverHandlers(e[t]),delete e[t];else{for(var r in e)this._recoverHandlers(e[r]);this._events=null}return this},t.prototype.offAllCaller=function(t){if(t&&this._events)for(var e in this._events)this.off(e,t,null);return this},t.prototype._recoverHandlers=function(t){if(t)if(t.run)t.recover();else for(var e=t.length-1;e>-1;e--)t[e]&&(t[e].recover(),t[e]=null)},t}();r.WEventDispatcher=o},{"./WEventHandler":5}],5:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(t){function e(e,r,n,o){return t.call(this,e,r,n,o)||this}return __extends(e,t),e.prototype.recover=function(){this._id>0&&(this._id=0,e._pool.push(this.clear()))},e.create=function(t,r,n,o){return void 0===n&&(n=null),void 0===o&&(o=!0),e._pool.length?e._pool.pop().setTo(t,r,n,o):new e(t,r,n,o)},e}(t("./WHandler").WHandler);r.WEventHandler=n},{"./WHandler":6}],6:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function t(t,e,r,n){void 0===t&&(t=null),void 0===e&&(e=null),void 0===r&&(r=null),void 0===n&&(n=!1),this.once=!1,this._id=0,this.setTo(t,e,r,n)}return t.prototype.setTo=function(e,r,n,o){return this._id=t._gid++,this.caller=e,this.method=r,this.args=n,this.once=o,this},t.prototype.run=function(){if(null==this.method)return null;var t=this._id,e=this.method.apply(this.caller,this.args);return this._id===t&&this.once&&this.recover(),e},t.prototype.runWith=function(t){if(null==this.method)return null;var e=this._id;if(null==t)var r=this.method.apply(this.caller,this.args);else r=this.args||t.unshift?this.args?this.method.apply(this.caller,this.args.concat(t)):this.method.apply(this.caller,t):this.method.call(this.caller,t);return this._id===e&&this.once&&this.recover(),r},t.prototype.clear=function(){return this.caller=null,this.method=null,this.args=null,this},t.prototype.recover=function(){this._id>0&&(this._id=0,t._pool.push(this.clear()))},t.create=function(e,r,n,o){return void 0===n&&(n=null),void 0===o&&(o=!0),t._pool.length?t._pool.pop().setTo(e,r,n,o):new t(e,r,n,o)},t._pool=[],t._gid=1,t}();r.WHandler=n},{}],7:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t("./WEventDispatcher"),o=t("./WEvent"),i=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._http=new window.XMLHttpRequest,e}return __extends(e,t),e.prototype.send=function(t,e,r,n,o){void 0===e&&(e=null),void 0===r&&(r="get"),void 0===n&&(n="text"),void 0===o&&(o=null),this._responseType=n,this._data=null;var i=this;this._http;if(this.http.open(r,t,!0),o)for(var s=0;s<o.length;s++)this.http.setRequestHeader(o[s++],o[s]);this.http.responseType="arraybuffer"!=n?"text":"arraybuffer",this.http.onerror=function(t){i._onError(t)},this.http.onabort=function(t){i._onAbort(t)},this.http.onload=function(t){i._onLoad(t)},this.http.send(this.data)},e.prototype._onAbort=function(t){this.error("Request was aborted by user")},e.prototype._onError=function(t){this.error("Request failed Status:"+this._http.status+" text:"+this._http.statusText)},e.prototype._onLoad=function(t){this._http;var e=void 0!=this.http.status?this.http.status:200;200===e||204===e||0===e?this.complete():this.error("["+this.http.status+"]"+this.http.statusText+":"+this.http.responseURL)},e.prototype.error=function(t){this.clear(),console.warn(this.url,t),this.event(o.WEvent.ERROR,t)},e.prototype.complete=function(){this.clear();var t=!0;try{"json"===this._responseType?this._data=JSON.parse(this._http.responseText):"xml"===this._responseType||(this._data=this._http.response||this._http.responseText)}catch(e){t=!1,this.error(e.message)}t&&this.event(o.WEvent.COMPLETE,this._data instanceof Array?[this._data]:this._data)},e.prototype.clear=function(){this._http;this.http.onerror=this.http.onabort=this.http.onprogress=this.http.onload=null},Object.defineProperty(e.prototype,"url",{get:function(){return this._http.responseURL},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"data",{get:function(){return this._data},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"http",{get:function(){return this._http},enumerable:!0,configurable:!0}),e}(n.WEventDispatcher);r.WHttpRequest=i},{"./WEvent":3,"./WEventDispatcher":4}]},{},[2]);