var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),B=Laya.Browser,WmyUtils=function(t){function e(){var e=t.call(this)||this;return e._eventList=new Array,Laya.stage.on(laya.events.Event.MOUSE_DOWN,e,e.__onTouchDown),Laya.stage.on(laya.events.Event.MOUSE_UP,e,e.__onTouchUp),Laya.stage.on(laya.events.Event.MOUSE_MOVE,e,e.__OnMouseMOVE),Laya.stage.on(Laya.Event.RESIZE,e,e.__onResize),e}return __extends(e,t),Object.defineProperty(e,"getThis",{get:function(){return null==e._this&&(e._this=new e),e._this},enumerable:!0,configurable:!0}),e.prototype.convertColorToColorFiltersMatrix=function(t,n,o,i){return e.COLOR_FILTERS_MATRIX[0]=t,e.COLOR_FILTERS_MATRIX[6]=n,e.COLOR_FILTERS_MATRIX[12]=o,e.COLOR_FILTERS_MATRIX[18]=i||1,e.COLOR_FILTERS_MATRIX},e.prototype.applyColorFilters=function(t,e){t.filters=null,16777215!=e&&(t.filters=[new Laya.ColorFilter(this.convertColorToColorFiltersMatrix((e>>16&255)/255,(e>>8&255)/255,(255&e)/255))])},e.prototype.applyColorFilters1=function(t,e,n,o,i){t.filters=null,(e<1||n<1||o<1||i<1)&&(t.filters=[new Laya.ColorFilter(this.convertColorToColorFiltersMatrix(e,n,o,i))])},e.prototype.isPc=function(){return!(this.versions().android||this.versions().iPhone||this.versions().ios)&&(this.versions().iPad,!0)},e.prototype.versions=function(){var t=navigator.userAgent;navigator.appVersion;return{trident:t.indexOf("Trident")>-1,presto:t.indexOf("Presto")>-1,webKit:t.indexOf("AppleWebKit")>-1,gecko:t.indexOf("Gecko")>-1&&-1==t.indexOf("KHTML"),mobile:!!t.match(/AppleWebKit.*Mobile.*/)||!!t.match(/AppleWebKit/),ios:!!t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),android:t.indexOf("Android")>-1||t.indexOf("Linux")>-1,iPhone:t.indexOf("iPhone")>-1||t.indexOf("Mac")>-1,iPad:t.indexOf("iPad")>-1,webApp:-1==t.indexOf("Safari")}},e.getUrlV=function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),n=window.location.search.substr(1).match(e);return n?decodeURIComponent(n[2]):null},e.prototype.onNavigate=function(t,e){void 0===e&&(e=!1),e?window.location.replace(t):window.location.href=t},e.prototype.__onTouchDown=function(t){this._eventList.indexOf(t)<0&&this._eventList.push(t)},e.prototype.__onTouchUp=function(t){this._eventList.indexOf(t)>=0&&this._eventList.splice(this._eventList.indexOf(t),1)},e.prototype.__onResize=function(){this._eventList.forEach(function(t){t.type=Laya.Event.MOUSE_UP,Laya.stage.event(Laya.Event.MOUSE_UP,t)}),this._eventList=new Array},e.prototype.__OnMouseMOVE=function(t){(t.stageX<=10||t.stageX>=Laya.stage.width-10||t.stageY<=10||t.stageY>=Laya.stage.height-10)&&(t.type=Laya.Event.MOUSE_UP,Laya.stage.event(Laya.Event.MOUSE_UP,t))},e.onNumTo=function(t,e){return void 0===e&&(e=2),(t+"").indexOf(".")>=0&&(t=parseFloat(t.toFixed(e))),t},e.getR_XY=function(t,e){var n=e*Math.PI/180,o=t*Math.cos(n),i=t*Math.sin(n);return new Laya.Point(o,i)},e.string2buffer=function(t){for(var e="",n=0;n<t.length;n++)""===e?e=t.charCodeAt(n).toString(16):e+=","+t.charCodeAt(n).toString(16);return new Uint8Array(e.match(/[\da-f]{2}/gi).map(function(t){return parseInt(t,16)})).buffer},e.replaceAll=function(t,e,n){var o="";return(o=t.replace(e,n)).indexOf(e)>=0&&(o=this.replaceAll(o,e,n)),o},e.toCase=function(t,e){void 0===e&&(e=!1);return e?t.toUpperCase():t.toLowerCase()},e.getDistance=function(t,e){var n=Math.abs(t.x-e.x),o=Math.abs(t.y-e.y),i=Math.sqrt(Math.pow(n,2)+Math.pow(o,2));return i=parseFloat(i.toFixed(2))},e.getXyToR=function(t,e){var n=Math.atan2(t,e),o=180/Math.PI*n;return o=this.onNumTo(o)},e.storage=function(t,e,n){void 0===e&&(e="?"),void 0===n&&(n=!0);var o=n?localStorage:sessionStorage;if("?"==e){return o.getItem(t)}return null!=e?(o.setItem(t,e),e):(o.removeItem(t),null)},e.COLOR_FILTERS_MATRIX=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],e}(laya.events.EventDispatcher);