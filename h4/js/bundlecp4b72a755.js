var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a])};return function(e,a){function r(){this.constructor=e}t(e,a),e.prototype=null===a?Object.create(a):(r.prototype=a.prototype,new r)}}();!function(){function t(e,a,r){function o(i,s){if(!a[i]){if(!e[i]){var l="function"==typeof require&&require;if(!s&&l)return l(i,!0);if(n)return n(i,!0);var u=new Error("Cannot find module '"+i+"'");throw u.code="MODULE_NOT_FOUND",u}var h=a[i]={exports:{}};e[i][0].call(h.exports,function(t){return o(e[i][1][t]||t)},h,h.exports,t,e,a,r)}return a[i].exports}for(var n="function"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}return t}()({1:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=function(){function t(){}return t.init=function(){},t.width=1136,t.height=640,t.scaleMode="exactfit",t.screenMode="showall",t.alignV="center",t.alignH="middle",t.startScene="",t.sceneRoot="",t.debug=!1,t.stat=!1,t.physicsDebug=!1,t.exportSceneToJson=!0,t}();a.default=r,r.init()},{}],2:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=t("./GameConfig"),o=t("./wmyUtilsH5/Wmy_Load_Mag");new(function(){function t(){window.Laya3D?Laya3D.init(r.default.width,r.default.height):Laya.init(r.default.width,r.default.height,Laya.WebGL),Laya.Physics&&Laya.Physics.enable(),Laya.DebugPanel&&Laya.DebugPanel.enable(),Laya.stage.scaleMode=r.default.scaleMode,Laya.stage.screenMode=r.default.screenMode,Laya.stage.screenMode=Laya.Stage.SCREEN_HORIZONTAL,Laya.URL.exportSceneToJson=r.default.exportSceneToJson,(r.default.debug||"true"==Laya.Utils.getQueryString("debug"))&&Laya.enableDebugPanel(),r.default.physicsDebug&&Laya.PhysicsDebugDraw&&Laya.PhysicsDebugDraw.enable(),r.default.stat&&Laya.Stat.show(),Laya.alertGlobalError=!0,Laya.ResourceVersion.enable("version.json?"+Date.now(),Laya.Handler.create(this,this.onVersionLoaded),Laya.ResourceVersion.FILENAME_VERSION)}return t.prototype.onVersionLoaded=function(){Laya.stage.addChild(fairygui.GRoot.inst.displayObject),o.Wmy_Load_Mag.getThis.onLoadWetData("res/loadInfo.txt",Laya.Handler.create(this,this.onLoadLoad))},t.prototype.onLoadLoad=function(){var t=o.Wmy_Load_Mag.getThis.getResObj("load");null!=t&&o.Wmy_Load_Mag.getThis.onload(t,new Laya.Handler(this,this.onLoadMain))},t.prototype.onLoadMain=function(){this._loadView=fairygui.UIPackage.createObject("load","Load").asCom,fairygui.GRoot.inst.addChild(this._loadView),this._bar=this._loadView.getChild("bar").asProgress,this._bar.value=1},t}())},{"./GameConfig":1,"./wmyUtilsH5/Wmy_Load_Mag":4}],3:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=function(t){function e(){var e=t.call(this)||this;return e._eventList=new Array,Laya.stage.on(laya.events.Event.MOUSE_DOWN,e,e.__onTouchDown),Laya.stage.on(laya.events.Event.MOUSE_UP,e,e.__onTouchUp),Laya.stage.on(laya.events.Event.MOUSE_MOVE,e,e.__OnMouseMOVE),Laya.stage.on(Laya.Event.RESIZE,e,e.__onResize),e}return __extends(e,t),Object.defineProperty(e,"getThis",{get:function(){return null==e._this&&(e._this=new e),e._this},enumerable:!0,configurable:!0}),e.prototype.convertColorToColorFiltersMatrix=function(t,a,r,o){return e.COLOR_FILTERS_MATRIX[0]=t,e.COLOR_FILTERS_MATRIX[6]=a,e.COLOR_FILTERS_MATRIX[12]=r,e.COLOR_FILTERS_MATRIX[18]=o||1,e.COLOR_FILTERS_MATRIX},e.prototype.applyColorFilters=function(t,e){t.filters=null,16777215!=e&&(t.filters=[new Laya.ColorFilter(this.convertColorToColorFiltersMatrix((e>>16&255)/255,(e>>8&255)/255,(255&e)/255))])},e.prototype.applyColorFilters1=function(t,e,a,r,o){t.filters=null,(e<1||a<1||r<1||o<1)&&(t.filters=[new Laya.ColorFilter(this.convertColorToColorFiltersMatrix(e,a,r,o))])},e.prototype.isPc=function(){return!(this.versions().android||this.versions().iPhone||this.versions().ios)&&(this.versions().iPad,!0)},e.prototype.versions=function(){var t=navigator.userAgent;navigator.appVersion;return{trident:t.indexOf("Trident")>-1,presto:t.indexOf("Presto")>-1,webKit:t.indexOf("AppleWebKit")>-1,gecko:t.indexOf("Gecko")>-1&&-1==t.indexOf("KHTML"),mobile:!!t.match(/AppleWebKit.*Mobile.*/)||!!t.match(/AppleWebKit/),ios:!!t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),android:t.indexOf("Android")>-1||t.indexOf("Linux")>-1,iPhone:t.indexOf("iPhone")>-1||t.indexOf("Mac")>-1,iPad:t.indexOf("iPad")>-1,webApp:-1==t.indexOf("Safari")}},e.getUrlV=function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),a=window.location.search.substr(1).match(e);return a?decodeURIComponent(a[2]):null},e.prototype.onNavigate=function(t,e){void 0===e&&(e=!1),e?window.location.replace(t):window.location.href=t},e.prototype.__onTouchDown=function(t){this._eventList.indexOf(t)<0&&this._eventList.push(t)},e.prototype.__onTouchUp=function(t){this._eventList.indexOf(t)>=0&&this._eventList.splice(this._eventList.indexOf(t),1)},e.prototype.__onResize=function(){this._eventList.forEach(function(t){t.type=Laya.Event.MOUSE_UP,Laya.stage.event(Laya.Event.MOUSE_UP,t)}),this._eventList=new Array},e.prototype.__OnMouseMOVE=function(t){(t.stageX<=10||t.stageX>=Laya.stage.width-10||t.stageY<=10||t.stageY>=Laya.stage.height-10)&&(t.type=Laya.Event.MOUSE_UP,Laya.stage.event(Laya.Event.MOUSE_UP,t))},e.onNumTo=function(t,e){return void 0===e&&(e=2),(t+"").indexOf(".")>=0&&(t=parseFloat(t.toFixed(e))),t},e.getR_XY=function(t,e){var a=e*Math.PI/180,r=t*Math.cos(a),o=t*Math.sin(a);return new Laya.Point(r,o)},e.string2buffer=function(t){for(var e="",a=0;a<t.length;a++)""===e?e=t.charCodeAt(a).toString(16):e+=","+t.charCodeAt(a).toString(16);return new Uint8Array(e.match(/[\da-f]{2}/gi).map(function(t){return parseInt(t,16)})).buffer},e.replaceAll=function(t,e,a){var r="";return(r=t.replace(e,a)).indexOf(e)>=0&&(r=this.replaceAll(r,e,a)),r},e.toCase=function(t,e){void 0===e&&(e=!1);return e?t.toUpperCase():t.toLowerCase()},e.getDistance=function(t,e){var a=Math.abs(t.x-e.x),r=Math.abs(t.y-e.y),o=Math.sqrt(Math.pow(a,2)+Math.pow(r,2));return o=parseFloat(o.toFixed(2))},e.getXyToR=function(t,e){var a=Math.atan2(t,e),r=180/Math.PI*a;return r=this.onNumTo(r)},e.storage=function(t,e,a){void 0===e&&(e="?"),void 0===a&&(a=!0);var r=a?localStorage:sessionStorage;if("?"==e){return r.getItem(t)}return null!=e?(r.setItem(t,e),e):(r.removeItem(t),null)},e.playFuiSound=function(t,e,a,r,o){if(void 0===e&&(e=.2),void 0===r&&(r=0),void 0===o&&(o=1),!(e<=0)){var n=fairygui.UIPackage.getItemByURL(t).file;Laya.SoundManager.playSound(n,o,a,null,r),Laya.SoundManager.setSoundVolume(e,n)}},e.COLOR_FILTERS_MATRIX=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],e}(laya.events.EventDispatcher);a.WmyUtils=r},{}],4:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=t("./WmyUtils"),o=function(){function t(){this._wetData={},this.resUrl="",this._resDataArr=[],this._callbackOk=[],this._callbackProgress=[]}return Object.defineProperty(t,"getThis",{get:function(){return null==t._this&&(t._this=new t),t._this},enumerable:!0,configurable:!0}),t.prototype.getWetData=function(t){return this._wetData[t]},t.prototype.setWetData=function(e,a){if(""==this.resUrl){this.resUrl=a;var r=null;try{r=JSON.parse(e)}catch(t){}try{var o=r[0].assetUrl;!t.isDebug&&document.URL.indexOf("file:///")>=0&&(o=""),t.assetUrl=o}catch(t){}}null==a&&(a=this.resUrl),this._wetData[a]=e},t.prototype.getResObj=function(t,e){var a;if(null==e&&(e=this.resUrl),null==(a=this.getWetData(e)))return console.log("空数据"),null;var r=null;if(a instanceof Array&&(r=a),null==r)try{r=JSON.parse(a)}catch(t){return console.log("加载材料数据错误",a),null}for(var o=null,n=0;n<r.length;n++){var i=r[n];if(i.resName==t){o=i;break}}return o},t.prototype.onLoadWetData=function(t,e){if(""!=t){if(null==this.getWetData(t)){return Laya.loader.load(t,new Laya.Handler(this,function(a){this.setWetData(a,t),e.runWith([this._wetData[t]])}))}e.runWith([this.getWetData(t)])}},t.prototype.onload=function(e,a,o){var n=e.resName;if(null!=this._resDataArr[n])this._resDataArr[n].runWith([this._resDataArr[n]]);else{if(null!=this._callbackOk[n])return this._callbackOk[n].push(a),void(null!=o&&this._callbackProgress[n].push(o));this._callbackOk[n]=[],this._callbackOk[n].push(a),this._callbackProgress[n]=[],null!=o&&this._callbackProgress[n].push(o);var i=e.Resres,s={},l=e.resData;if(null!=l&&""!=l)try{s=JSON.parse(l)}catch(t){console.log("加载材料数据错误",l)}for(var u,h=[],c=0;c<i.length;c++){var d=i[c].resUrl;d=r.WmyUtils.toCase(d);var f=t.assetUrl+d;d.indexOf(".txt")>=0?(h.push({url:f,type:Laya.Loader.BUFFER}),u=d.split(".")[0],u=t.assetUrl+u):d.indexOf(".jpg")>=0||d.indexOf(".png")>=0?h.push({url:f,type:Laya.Loader.IMAGE}):d.indexOf(".mp3")>=0||d.indexOf(".wav")>=0?h.push({url:f,type:Laya.Loader.SOUND}):h.push({url:f})}Laya.loader.load(h,Laya.Handler.create(this,this.onAssetConmplete,[n,u,s]),Laya.Handler.create(this,this.onAssetProgress,[n],!1))}},t.prototype.onload3d=function(e,a,r){var o=e.resName;if(null!=this._resDataArr[o])this._resDataArr[o].runWith([this._resDataArr[o]]);else{if(null!=this._callbackOk[o])return this._callbackOk[o].push(a),void(null!=r&&this._callbackProgress[o].push(r));this._callbackOk[o]=[],this._callbackOk[o].push(a),this._callbackProgress[o]=[],null!=r&&this._callbackProgress[o].push(r);var n=e.Resres,i={},s=e.resData;if(null!=s&&""!=s)try{i=JSON.parse(s)}catch(t){console.log("加载材料数据错误",s)}for(var l=[],u=[],h=0;h<n.length;h++){var c=n[h].resUrl,d=t.assetUrl+c;c.indexOf(".ls")>=0&&(l.push({url:d}),u.push(d))}i.urlList=u}},t.prototype.onAssetProgress=function(t,e){for(var a=this._callbackProgress[t],r=0;r<a.length;r++){a[r].runWith([e])}},t.prototype.onAssetConmplete=function(t,e,a){var r=this._callbackOk[t];if(null!=e){var o=Laya.loader.getRes(e+".txt");fairygui.UIPackage.addPackage(e,o);var n=e.split("/");a.bName=n[n.length-1],this._resDataArr[t]=a}for(var i=0;i<r.length;i++){r[i].runWith([a])}this._callbackOk[t]=null,this._callbackProgress[t]=null},t.prototype.onAutoLoadAll=function(t,e){var a=this.getWetData(this.resUrl);if(null==a)return console.log("空数据"),null;var r=null;if(a instanceof Array&&(r=a),null==r)try{r=JSON.parse(a)}catch(t){return console.log("加载材料数据错误",a),null}this._autoLoadrCallbackOk=t,this._autoLoadrCallbackProgress=e,this._autoLoadInfoArr={},this._autoLoadInfoArr.num=0,this._autoLoadInfoArr.cNum=0,this._autoLoadInfoArr.uiArr=[],this._autoLoadInfoArr.u3dArr=[];for(var o=0;o<r.length;o++){var n=r[o],i=n.resName,s=n.type;null!=i&&""!=i&&null!=s&&""!=s&&this.onAutoLoadObj(s,i)}},t.prototype.onAutoLoadObj=function(e,a){var r=this.getResObj(a);if(null!=r){var o=this._autoLoadInfoArr.num;if(this._autoLoadInfoArr[o]={},this._autoLoadInfoArr[o].n=a,this._autoLoadInfoArr[o].t=e,"ui"==e)this.onload(r,new Laya.Handler(this,this.onLoadOk,[o]),new Laya.Handler(this,this.onLoading,[o])),this._autoLoadInfoArr.num+=1;else if("mats"==e){for(var n=r.Resres,i=[],s=0;s<n.length;s++){var l=(h=n[s]).resUrl,u=t.assetUrl+l;i.push(u)}this._autoLoadInfoArr.num+=1}else if("cubeMap"==e)for(var n=r.Resres,s=0;s<n.length;s++){var h=n[s],l=h.resUrl,u=t.assetUrl+l;Laya.TextureCube.load(u,null)}else"u3d"==e?(this.onload3d(r,new Laya.Handler(this,this.onLoadOk,[o]),new Laya.Handler(this,this.onLoading,[o])),this._autoLoadInfoArr.num+=1):"audio"==e&&(this.onload(r,new Laya.Handler(this,this.onLoadOk,[o]),new Laya.Handler(this,this.onLoading,[o])),this._autoLoadInfoArr.num+=1)}},t.prototype.getCube=function(e,a){var r=this.getResObj(e);if(null!=r){for(var o=r.Resres,n=[],i=0;i<o.length;i++){var s=o[i].resUrl,l=t.assetUrl+s;Laya.TextureCube.load(l,new Laya.Handler(this,function(t){n[i]=t,a.runWith([t,i])}))}return n}},t.prototype.onLoading=function(t,e){this._autoLoadInfoArr[t].p=e;for(var a=this._autoLoadInfoArr.num,r=0,o=0;o<a;o++){var n=this._autoLoadInfoArr[o].p;null!=n&&(r+=n)}var i=r/this._autoLoadInfoArr.num*100;isNaN(i)&&(i=0),null!=this._autoLoadrCallbackProgress&&this._autoLoadrCallbackProgress.runWith([i])},t.prototype.onLoadOk=function(t,e){this._autoLoadInfoArr.cNum+=1,"ui"==this._autoLoadInfoArr[t].t?this._autoLoadInfoArr.uiArr.push(e):"u3d"==this._autoLoadInfoArr[t].t&&this._autoLoadInfoArr.u3dArr.push(e),this._autoLoadInfoArr.cNum>=this._autoLoadInfoArr.num&&null!=this._autoLoadrCallbackOk&&this._autoLoadrCallbackOk.runWith([this._autoLoadInfoArr.uiArr,this._autoLoadInfoArr.u3dArr])},t.isDebug=!1,t.assetUrl="",t}();a.Wmy_Load_Mag=o},{"./WmyUtils":3}]},{},[2]);