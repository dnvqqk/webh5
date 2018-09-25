var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a])};return function(e,a){function r(){this.constructor=e}t(e,a),e.prototype=null===a?Object.create(a):(r.prototype=a.prototype,new r)}}();!function(){function t(e,a,r){function n(i,s){if(!a[i]){if(!e[i]){var l="function"==typeof require&&require;if(!s&&l)return l(i,!0);if(o)return o(i,!0);var u=new Error("Cannot find module '"+i+"'");throw u.code="MODULE_NOT_FOUND",u}var h=a[i]={exports:{}};e[i][0].call(h.exports,function(t){return n(e[i][1][t]||t)},h,h.exports,t,e,a,r)}return a[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)n(r[i]);return n}return t}()({1:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=function(){function t(){}return t.init=function(){},t.width=1136,t.height=640,t.scaleMode="exactfit",t.screenMode="showall",t.alignV="center",t.alignH="middle",t.startScene="",t.sceneRoot="",t.debug=!1,t.stat=!1,t.physicsDebug=!1,t.exportSceneToJson=!0,t}();a.default=r,r.init()},{}],2:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=t("./GameConfig"),n=t("./wmyUtilsH5/Wmy_Load_Mag"),o=t("./wmyUtilsH5/d3/WmyUtils3D");new(function(){function t(){window.Laya3D?Laya3D.init(r.default.width,r.default.height):Laya.init(r.default.width,r.default.height,Laya.WebGL),Laya.Physics&&Laya.Physics.enable(),Laya.DebugPanel&&Laya.DebugPanel.enable(),Laya.stage.scaleMode=r.default.scaleMode,Laya.stage.screenMode=r.default.screenMode,Laya.stage.screenMode=Laya.Stage.SCREEN_HORIZONTAL,Laya.URL.exportSceneToJson=r.default.exportSceneToJson,(r.default.debug||"true"==Laya.Utils.getQueryString("debug"))&&Laya.enableDebugPanel(),r.default.physicsDebug&&Laya.PhysicsDebugDraw&&Laya.PhysicsDebugDraw.enable(),r.default.stat&&Laya.Stat.show(),Laya.alertGlobalError=!0,Laya.ResourceVersion.enable("version.json?"+Date.now(),Laya.Handler.create(this,this.onVersionLoaded),Laya.ResourceVersion.FILENAME_VERSION)}return t.prototype.onVersionLoaded=function(){Laya.stage.addChild(fairygui.GRoot.inst.displayObject),n.Wmy_Load_Mag.getThis.onLoadWetData("res/loadInfo.json",Laya.Handler.create(this,this.onLoadLoad))},t.prototype.onLoadLoad=function(){var t=n.Wmy_Load_Mag.getThis.getResObj("load");null!=t&&n.Wmy_Load_Mag.getThis.onload(t,new Laya.Handler(this,this.onLoadMain))},t.prototype.onLoadMain=function(){this._loadView=fairygui.UIPackage.createObject("load","Load").asCom,fairygui.GRoot.inst.addChild(this._loadView),this._bar=this._loadView.getChild("bar").asProgress,n.Wmy_Load_Mag.getThis.onAutoLoadAll(new Laya.Handler(this,this.onLoadOk),new Laya.Handler(this,this.onLoading))},t.prototype.onLoading=function(t){this._bar.value=t},t.prototype.onLoadOk=function(t,e){var a=this;this._u3dArr=e,Laya.timer.once(400,this,function(){a.onMain(),fairygui.GRoot.inst.removeChild(a._loadView),a._loadView=null,a._bar=null});var r=e[0].urlList[0];this.scene3D=Laya.loader.getRes(r),o.WmyUtils3D.setShaderAll(this.scene3D,"res/mats/","res/shaders/"),Laya.Shader3D.compileShader("PARTICLESHURIKEN",0,3,69214344,14),Laya.Shader3D.compileShader("PARTICLESHURIKEN",0,3,100671488,14)},t.prototype.onMain=function(){this._mainView=fairygui.UIPackage.createObject("main","Main").asCom,fairygui.GRoot.inst.addChild(this._mainView),Laya.stage.addChildAt(this.scene3D,0)},t}())},{"./GameConfig":1,"./wmyUtilsH5/Wmy_Load_Mag":4,"./wmyUtilsH5/d3/WmyUtils3D":8}],3:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=function(t){function e(){var e=t.call(this)||this;return e._eventList=new Array,Laya.stage.on(laya.events.Event.MOUSE_DOWN,e,e.__onTouchDown),Laya.stage.on(laya.events.Event.MOUSE_UP,e,e.__onTouchUp),Laya.stage.on(laya.events.Event.MOUSE_MOVE,e,e.__OnMouseMOVE),Laya.stage.on(Laya.Event.RESIZE,e,e.__onResize),e}return __extends(e,t),Object.defineProperty(e,"getThis",{get:function(){return null==e._this&&(e._this=new e),e._this},enumerable:!0,configurable:!0}),e.prototype.convertColorToColorFiltersMatrix=function(t,a,r,n){return e.COLOR_FILTERS_MATRIX[0]=t,e.COLOR_FILTERS_MATRIX[6]=a,e.COLOR_FILTERS_MATRIX[12]=r,e.COLOR_FILTERS_MATRIX[18]=n||1,e.COLOR_FILTERS_MATRIX},e.prototype.applyColorFilters=function(t,e){t.filters=null,16777215!=e&&(t.filters=[new Laya.ColorFilter(this.convertColorToColorFiltersMatrix((e>>16&255)/255,(e>>8&255)/255,(255&e)/255))])},e.prototype.applyColorFilters1=function(t,e,a,r,n){t.filters=null,(e<1||a<1||r<1||n<1)&&(t.filters=[new Laya.ColorFilter(this.convertColorToColorFiltersMatrix(e,a,r,n))])},e.prototype.isPc=function(){return!(this.versions().android||this.versions().iPhone||this.versions().ios)&&(this.versions().iPad,!0)},e.prototype.versions=function(){var t=navigator.userAgent;navigator.appVersion;return{trident:t.indexOf("Trident")>-1,presto:t.indexOf("Presto")>-1,webKit:t.indexOf("AppleWebKit")>-1,gecko:t.indexOf("Gecko")>-1&&-1==t.indexOf("KHTML"),mobile:!!t.match(/AppleWebKit.*Mobile.*/)||!!t.match(/AppleWebKit/),ios:!!t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),android:t.indexOf("Android")>-1||t.indexOf("Linux")>-1,iPhone:t.indexOf("iPhone")>-1||t.indexOf("Mac")>-1,iPad:t.indexOf("iPad")>-1,webApp:-1==t.indexOf("Safari")}},e.getUrlV=function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),a=window.location.search.substr(1).match(e);return a?decodeURIComponent(a[2]):null},e.prototype.onNavigate=function(t,e){void 0===e&&(e=!1),e?window.location.replace(t):window.location.href=t},e.prototype.__onTouchDown=function(t){this._eventList.indexOf(t)<0&&this._eventList.push(t)},e.prototype.__onTouchUp=function(t){this._eventList.indexOf(t)>=0&&this._eventList.splice(this._eventList.indexOf(t),1)},e.prototype.__onResize=function(){this._eventList.forEach(function(t){t.type=Laya.Event.MOUSE_UP,Laya.stage.event(Laya.Event.MOUSE_UP,t)}),this._eventList=new Array},e.prototype.__OnMouseMOVE=function(t){(t.stageX<=10||t.stageX>=Laya.stage.width-10||t.stageY<=10||t.stageY>=Laya.stage.height-10)&&(t.type=Laya.Event.MOUSE_UP,Laya.stage.event(Laya.Event.MOUSE_UP,t))},e.onNumTo=function(t,e){return void 0===e&&(e=2),(t+"").indexOf(".")>=0&&(t=parseFloat(t.toFixed(e))),t},e.getR_XY=function(t,e){var a=e*Math.PI/180,r=t*Math.cos(a),n=t*Math.sin(a);return new Laya.Point(r,n)},e.string2buffer=function(t){for(var e="",a=0;a<t.length;a++)""===e?e=t.charCodeAt(a).toString(16):e+=","+t.charCodeAt(a).toString(16);return new Uint8Array(e.match(/[\da-f]{2}/gi).map(function(t){return parseInt(t,16)})).buffer},e.replaceAll=function(t,e,a){var r="";return(r=t.replace(e,a)).indexOf(e)>=0&&(r=this.replaceAll(r,e,a)),r},e.toCase=function(t,e){void 0===e&&(e=!1);return e?t.toUpperCase():t.toLowerCase()},e.getDistance=function(t,e){var a=Math.abs(t.x-e.x),r=Math.abs(t.y-e.y),n=Math.sqrt(Math.pow(a,2)+Math.pow(r,2));return n=parseFloat(n.toFixed(2))},e.getXyToR=function(t,e){var a=Math.atan2(t,e),r=180/Math.PI*a;return r=this.onNumTo(r)},e.storage=function(t,e,a){void 0===e&&(e="?"),void 0===a&&(a=!0);var r=a?localStorage:sessionStorage;if("?"==e){return r.getItem(t)}return null!=e?(r.setItem(t,e),e):(r.removeItem(t),null)},e.playFuiSound=function(t,e,a,r,n){if(void 0===e&&(e=.2),void 0===r&&(r=0),void 0===n&&(n=1),!(e<=0)){var o=fairygui.UIPackage.getItemByURL(t).file;Laya.SoundManager.playSound(o,n,a,null,r),Laya.SoundManager.setSoundVolume(e,o)}},e.COLOR_FILTERS_MATRIX=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],e}(laya.events.EventDispatcher);a.WmyUtils=r},{}],4:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=t("./WmyUtils"),n=t("./d3/WmyLoad3d"),o=t("./d3/WmyLoadMats"),i=function(){function t(){this._wetData={},this.resUrl="",this._resDataArr=[],this._callbackOk=[],this._callbackProgress=[]}return Object.defineProperty(t,"getThis",{get:function(){return null==t._this&&(t._this=new t),t._this},enumerable:!0,configurable:!0}),t.prototype.getWetData=function(t){return this._wetData[t]},t.prototype.setWetData=function(e,a){if(""==this.resUrl){this.resUrl=a;var r=null;try{r=JSON.parse(e)}catch(t){}try{var n=r[0].assetUrl;!t.isDebug&&document.URL.indexOf("file:///")>=0&&(n=""),t.assetUrl=n}catch(t){}}null==a&&(a=this.resUrl),this._wetData[a]=e},t.prototype.getResObj=function(t,e){var a;if(null==e&&(e=this.resUrl),null==(a=this.getWetData(e)))return console.log("空数据"),null;var r=null;if(a instanceof Array&&(r=a),null==r)try{r=JSON.parse(a)}catch(t){return console.log("加载材料数据错误",a),null}for(var n=null,o=0;o<r.length;o++){var i=r[o];if(i.resName==t){n=i;break}}return n},t.prototype.onLoadWetData=function(t,e){if(""!=t){if(null==this.getWetData(t)){return Laya.loader.load(t,new Laya.Handler(this,function(a){this.setWetData(a,t),e.runWith([this._wetData[t]])}))}e.runWith([this.getWetData(t)])}},t.prototype.onload=function(e,a,n){var o=e.resName;if(null!=this._resDataArr[o])this._resDataArr[o].runWith([this._resDataArr[o]]);else{if(null!=this._callbackOk[o])return this._callbackOk[o].push(a),void(null!=n&&this._callbackProgress[o].push(n));this._callbackOk[o]=[],this._callbackOk[o].push(a),this._callbackProgress[o]=[],null!=n&&this._callbackProgress[o].push(n);var i=e.Resres,s={},l=e.resData;if(null!=l&&""!=l)try{s=JSON.parse(l)}catch(t){console.log("加载材料数据错误",l)}for(var u,h=[],d=0;d<i.length;d++){var c=i[d].resUrl;c=r.WmyUtils.toCase(c);var f=t.assetUrl+c;f.indexOf(".txt")>=0?(h.push({url:f,type:Laya.Loader.BUFFER}),u=c):f.indexOf(".jpg")>=0||f.indexOf(".png")>=0?h.push({url:f,type:Laya.Loader.IMAGE}):f.indexOf(".mp3")>=0||f.indexOf(".wav")>=0?h.push({url:f,type:Laya.Loader.SOUND}):h.push({url:f})}Laya.loader.load(h,Laya.Handler.create(this,this.onAssetConmplete,[o,u,s]),Laya.Handler.create(this,this.onAssetProgress,[o],!1))}},t.prototype.onload3d=function(e,a,r){var o=e.resName;if(null!=this._resDataArr[o])this._resDataArr[o].runWith([this._resDataArr[o]]);else{if(null!=this._callbackOk[o])return this._callbackOk[o].push(a),void(null!=r&&this._callbackProgress[o].push(r));this._callbackOk[o]=[],this._callbackOk[o].push(a),this._callbackProgress[o]=[],null!=r&&this._callbackProgress[o].push(r);var i=e.Resres,s={},l=e.resData;if(null!=l&&""!=l)try{s=JSON.parse(l)}catch(t){console.log("加载材料数据错误",l)}for(var u=[],h=[],d=0;d<i.length;d++){var c=i[d].resUrl,f=t.assetUrl+c;c.indexOf(".ls")>=0&&(u.push({url:f}),h.push(f))}s.urlList=h,n.WmyLoad3d.getThis.onload3d(u,Laya.Handler.create(this,this.onAssetConmplete,[o,void 0,s]),Laya.Handler.create(this,this.onAssetProgress,[o],!1))}},t.prototype.onAssetProgress=function(t,e){for(var a=this._callbackProgress[t],r=0;r<a.length;r++){a[r].runWith([e])}},t.prototype.onAssetConmplete=function(t,e,a){var r=this._callbackOk[t];if(null!=e){var n=Laya.loader.getRes(e),o=e.replace(".txt","");fairygui.UIPackage.addPackage(o,n);var i=o.split("/");a.bName=i[i.length-1],this._resDataArr[t]=a}for(var s=0;s<r.length;s++){r[s].runWith([a])}this._callbackOk[t]=null,this._callbackProgress[t]=null},t.prototype.onAutoLoadAll=function(t,e){var a=this.getWetData(this.resUrl);if(null==a)return console.log("空数据"),null;var r=null;if(a instanceof Array&&(r=a),null==r)try{r=JSON.parse(a)}catch(t){return console.log("加载材料数据错误",a),null}this._autoLoadrCallbackOk=t,this._autoLoadrCallbackProgress=e,this._autoLoadInfoArr={},this._autoLoadInfoArr.num=0,this._autoLoadInfoArr.cNum=0,this._autoLoadInfoArr.uiArr=[],this._autoLoadInfoArr.u3dArr=[];for(var n=0;n<r.length;n++){var o=r[n],i=o.resName,s=o.type;null!=i&&""!=i&&null!=s&&""!=s&&this.onAutoLoadObj(s,i)}},t.prototype.onAutoLoadObj=function(e,a){var r=this.getResObj(a);if(null!=r){var n=this._autoLoadInfoArr.num;if(this._autoLoadInfoArr[n]={},this._autoLoadInfoArr[n].n=a,this._autoLoadInfoArr[n].t=e,"ui"==e)this.onload(r,new Laya.Handler(this,this.onLoadOk,[n]),new Laya.Handler(this,this.onLoading,[n])),this._autoLoadInfoArr.num+=1;else if("mats"==e){for(var i=r.Resres,s=[],l=0;l<i.length;l++){var u=(d=i[l]).resUrl,h=t.assetUrl+u;s.push(h)}o.WmyLoadMats.getThis.onload3d(s,new Laya.Handler(this,this.onLoadOk,[n]),new Laya.Handler(this,this.onLoading,[n])),this._autoLoadInfoArr.num+=1}else if("cubeMap"==e)for(var i=r.Resres,l=0;l<i.length;l++){var d=i[l],u=d.resUrl,h=t.assetUrl+u;Laya.TextureCube.load(h,null)}else"u3d"==e?(this.onload3d(r,new Laya.Handler(this,this.onLoadOk,[n]),new Laya.Handler(this,this.onLoading,[n])),this._autoLoadInfoArr.num+=1):"audio"==e&&(this.onload(r,new Laya.Handler(this,this.onLoadOk,[n]),new Laya.Handler(this,this.onLoading,[n])),this._autoLoadInfoArr.num+=1)}},t.prototype.getCube=function(e,a){var r=this.getResObj(e);if(null!=r){for(var n=r.Resres,o=[],i=0;i<n.length;i++){var s=n[i].resUrl,l=t.assetUrl+s;Laya.TextureCube.load(l,new Laya.Handler(this,function(t){o[i]=t,a.runWith([t,i])}))}return o}},t.prototype.onLoading=function(t,e){this._autoLoadInfoArr[t].p=e;for(var a=this._autoLoadInfoArr.num,r=0,n=0;n<a;n++){var o=this._autoLoadInfoArr[n].p;null!=o&&(r+=o)}var i=r/this._autoLoadInfoArr.num*100;isNaN(i)&&(i=0),null!=this._autoLoadrCallbackProgress&&this._autoLoadrCallbackProgress.runWith([i])},t.prototype.onLoadOk=function(t,e){this._autoLoadInfoArr.cNum+=1,"ui"==this._autoLoadInfoArr[t].t?this._autoLoadInfoArr.uiArr.push(e):"u3d"==this._autoLoadInfoArr[t].t&&this._autoLoadInfoArr.u3dArr.push(e),this._autoLoadInfoArr.cNum>=this._autoLoadInfoArr.num&&null!=this._autoLoadrCallbackOk&&this._autoLoadrCallbackOk.runWith([this._autoLoadInfoArr.uiArr,this._autoLoadInfoArr.u3dArr])},t.isDebug=!1,t.assetUrl="",t}();a.Wmy_Load_Mag=i},{"./WmyUtils":3,"./d3/WmyLoad3d":5,"./d3/WmyLoadMats":6}],5:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=function(){function t(){this._mArr=[],this._mNum=0,this._mP=0,this._mP2=0}return Object.defineProperty(t,"getThis",{get:function(){return null==t._this&&(t._this=new t),t._this},enumerable:!0,configurable:!0}),t.prototype.onload3d=function(t,e,a){this._urlList=[],this._callbackOk=e,this._callbackProgress=a;for(var r=0;r<t.length;r++){var n=t[r],o={};o.url=n.url,this._urlList.push(o),n.url=Laya.ResourceVersion.addVersionPrefix(n.url),n.url+="?wmy",t[r]=n}Laya.loader.load(t,Laya.Handler.create(this,this.__onlsUrlArrOk,[t]))},t.prototype.__onlsUrlArrOk=function(t){for(i=0;i<t.length;i++){var e=t[i].url,a=e.split("/"),r=e.replace(a[a.length-1],""),n=Laya.loader.getRes(e),o=JSON.parse(n);this.__tiQuUrl(o.data,r)}for(var i=0;i<this._mArr.length;i++)e=this._mArr[i],Laya.loader.create(e,Laya.Handler.create(this,this.__onArrOk),Laya.Handler.create(this,this.__onArrP))},t.prototype.__onArrP=function(t){(e=t*(this._mNum+1))>this._mP&&(this._mP=e),this._mP2=this._mP/this._mArr.length;var e=.98*this._mP2;null!=this._callbackProgress&&this._callbackProgress.runWith([e])},t.prototype.__onArrOk=function(){var t=this;this._mNum+=1,this._mNum>=this._mArr.length&&Laya.loader.create(this._urlList,Laya.Handler.create(this,function(){null!=t._callbackOk&&t._callbackOk.run()}))},t.prototype.__tiQuUrl=function(t,e){if(void 0===e&&(e=""),null!=t.props&&null!=t.props.meshPath){var a=e+t.props.meshPath;this._mArr.indexOf(a)<0&&this._mArr.push(a);var r=t.props.materials;if(null!=r)for(var n=0;n<r.length;n++){var o=e+r[n].path;this._mArr.indexOf(o)<0&&this._mArr.push(o)}}if(null!=t.components){var i=t.components;if(i.length>0)for(var s=0;s<i.length;s++){var l=i[s];if(null!=l.avatar){var u=e+l.avatar.path;this._mArr.indexOf(u)<0&&this._mArr.push(u)}if(null!=l.layers)for(var h=l.layers,d=0;d<h.length;d++)for(var c=h[d].states,f=0;f<c.length;f++){var _=e+c[f].clipPath;this._mArr.indexOf(_)<0&&this._mArr.push(_)}}}var y=t.child;if(null!=y&&y.length>0)for(var g=0;g<y.length;g++)this.__tiQuUrl(y[g],e)},t}();a.WmyLoad3d=r},{}],6:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=function(){function t(){this._matsUrlArr=[],this._matOk=!1,this._matNum=0,this._matP=0,this._matP2=0}return Object.defineProperty(t,"getThis",{get:function(){return null==t._this&&(t._this=new t),t._this},enumerable:!0,configurable:!0}),t.prototype.onload3d=function(t,e,a){this._callbackOk=e,this._callbackProgress=a,Laya.loader.load(t,Laya.Handler.create(this,this.__onUrlArrOk,[t]))},t.prototype.__onUrlArrOk=function(t){for(h=0;h<t.length;h++)for(var e=t[h],a=Laya.loader.getRes(e),r=JSON.parse(a),n=e.split("/"),o=e.replace(n[n.length-1],""),i=r.mats,s=0;s<i.length;s++){var l=i[s];if(""!=l.targetName){var u=o+l.matUrl;this._matsUrlArr.push(u)}}for(var h=0;h<this._matsUrlArr.length;h++)e=this._matsUrlArr[h],Laya.loader.create(e,Laya.Handler.create(this,this.__onMatArrOk),Laya.Handler.create(this,this.__onMatArrP))},t.prototype.__onMatArrP=function(t){var e=t*(this._matNum+1);e>this._matP&&(this._matP=e),this._matP2=this._matP/this._matsUrlArr.length,null!=this._callbackProgress&&this._callbackProgress.runWith([this._matP2])},t.prototype.__onMatArrOk=function(){this._matNum+=1,this._matNum>=this._matsUrlArr.length&&null!=this._callbackOk&&this._callbackOk.run()},t}();a.WmyLoadMats=r},{}],7:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=t("../Wmy_Load_Mag"),n=function(){function t(){}return t.setShader=function(t,e,a,r,n,o){void 0===r&&(r=!1),void 0===n&&(n="null"),void 0===o&&(o="null");var i,s;s=t instanceof Laya.SkinnedMeshSprite3D?(i=t.skinnedMeshRenderer).sharedMaterial:(i=t.meshRenderer).sharedMaterial,r&&(s=s.clone(),i.sharedMaterial=s);for(var l in e)try{s[l]=e[l]}catch(t){}return Laya.loader.load(a,Laya.Handler.create(this,this.shaderConmplete,[s,n,o])),s},t.shaderConmplete=function(t,e,a,n){if(null!=n){var o=null;try{o=Laya.Utils.parseXMLFromString(n)}catch(t){return}var i,s,l,u,h,d,c=o.firstChild,f=this.getAttributesValue(c,"name"),_={},y=this.getNode(c,"attributeMap"),g=this.getNodeArr(y,"data");for(i=0;i<g.length;i++)s=g[i],l=this.getAttributesValue(s,"name"),u=this.getAttributesValue(s,"v0"),_[l]=this.getV(u,"int");var p={},L=this.getNode(c,"uniformMap"),v=this.getNodeArr(L,"data");for(i=0;i<v.length;i++){d=null,s=v[i],l=this.getAttributesValue(s,"name"),u=this.getAttributesValue(s,"v0"),h=this.getAttributesValue(s,"v1");var m=[];if(m[0]=this.getV(u,"int"),m[1]=this.getV(h,"int"),p[l]=m,null!=t.wmyValues){if(null!=t.wmyValues.cube){var O=t.wmyValues.cube;r.Wmy_Load_Mag.getThis.getCube(O,new Laya.Handler(this,function(e,a){0==a&&t._shaderValues.setTexture(Laya.Scene3D.REFLECTIONTEXTURE,e)}))}d=t.wmyValues[l]}if(null!=d)if(4==(d=d.split(",")).length)t._shaderValues.setVector(m[0],new Laya.Vector4(parseFloat(d[0]),parseFloat(d[1]),parseFloat(d[2]),parseFloat(d[3])));else if(3==d.length)t._shaderValues.setVector(m[0],new Laya.Vector3(parseFloat(d[0]),parseFloat(d[1]),parseFloat(d[2])));else if(2==d.length)t._shaderValues.setVector(m[0],new Laya.Vector2(parseFloat(d[0]),parseFloat(d[1])));else if(1==d.length)if(isNaN(parseFloat(d[0]))){if("tex"==d[0]+""){var b=t[l];t._shaderValues.setTexture(m[0],b)}}else t._shaderValues.setNumber(m[0],parseFloat(d[0]))}"null"==e&&(e=Laya.SkinnedMeshSprite3D.shaderDefines),"null"==a&&(a=Laya.BlinnPhongMaterial.shaderDefines);var A=Laya.Shader3D.add(f,_,p,e,a),M=this.getNode(c,"SubShader"),P=this.getNode(c,"renderMode");if(null!=P){var w=this.getAttributesValue(P,"v");null!=w&&(t.renderMode=this.getV(w))}var k=this.getNodeArr(M,"Pass");for(i=0;i<k.length;i++){var U=k[i],S=this.getNode(U,"VERTEX").textContent;S=S.replace(/(\r)/g,"");var R=this.getNode(U,"FRAGMENT").textContent;if(R=R.replace(/(\r)/g,""),i>0){var C=t.getRenderState(0).clone();t._renderStates.push(C)}var x=this.getNode(U,"cull");if(null!=x){var N=this.getAttributesValue(x,"v");null!=N&&(t.getRenderState(i).cull=this.getV(N))}A.addShaderPass(S,R)}t._shader=A}},t.getV=function(t,e){void 0===e&&(e="null");var a,r,n;for("Laya"===(a=t.split("."))[0]?r=Laya:"laya"===a[0]&&(r=laya),n=1;n<a.length;n++)r=r[a[n]];return null!=r?r:"null"!=e?"int"==e?parseInt(t):t:null},t.colorStringToUint=function(t){return Number("0x"+t.replace("#",""))},t.getAttributesValue=function(t,e){return e in t.attributes?t.attributes[e].nodeValue:null},t.getNode=function(t,e){for(var a=t.childNodes,r=null,n=0;n<a.length;n++){var o=a[n];if(o.nodeName==e){r=o;break}}return r},t.getNodeArr=function(t,e){for(var a=t.childNodes,r=[],n=0;n<a.length;n++){var o=a[n];o.nodeName==e&&r.push(o)}return r},t}();a.WmyShaderMsg=n},{"../Wmy_Load_Mag":4}],8:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=t("../Wmy_Load_Mag"),n=t("./WmyShaderMsg"),o=function(){function t(){}return t.getObj3d=function(t,e){if(null==t)return null;if(t.name==e)return t;for(var a=0;a<t._children.length;a++){var r=t._children[a];if(r._children.length<=0){if(r.name==e)return r}else{var n=this.getObj3d(r,e);if(null!=n)return n}}return null},t.getChildrenComponent=function(t,e,a){if(null==t)return null;null==a&&(a=[]);var r=t.getComponent(e);null==r&&t instanceof e&&(r=t),null!=r&&a.push(r);for(var n=0;n<t._children.length;n++){var o=t._children[n];this.getChildrenComponent(o,e,a)}return a},t.setShaderAll=function(e,a,o){var i=this,s=r.Wmy_Load_Mag.assetUrl,l=s+a+"wmyMats.txt",u=s+o;Laya.loader.load(l,Laya.Handler.create(this,function(a,r,o){for(var s=o.mats,l=0;l<s.length;l++){var u=s[l];if(""!=u.targetName){var h=t.getObj3d(e,u.targetName);if(null!=h){var d=a+u.matUrl,c=r+u.shaderName+".txt";Laya.BaseMaterial.load(d,Laya.Handler.create(i,function(t,e,a){n.WmyShaderMsg.setShader(t,a,e)},[h,c]))}}}},[a,u]),null,Laya.Loader.JSON)},t.aniPlay=function(t,e,a){var r=this.getObj3d(t,e).getComponent(Laya.Animator);return r.play(a),r},t.onShadow=function(t,e,a,r,n){void 0===e&&(e=512),void 0===a&&(a=1),void 0===r&&(r=100),void 0===n&&(n=!0),t.shadow=n,t.shadowDistance=r,t.shadowResolution=e,t.shadowPCFType=a},t.onCastShadow=function(t,e,a,r){if(void 0===e&&(e=0),void 0===a&&(a=!0),void 0===r&&(r=!0),t instanceof Laya.MeshSprite3D){var n=t;0==e?n.meshRenderer.receiveShadow=a:1==e?n.meshRenderer.castShadow=a:2==e&&(n.meshRenderer.receiveShadow=a,n.meshRenderer.castShadow=a)}if(t instanceof Laya.SkinnedMeshSprite3D){var o=t;0==e?o.skinnedMeshRenderer.receiveShadow=a:1==e&&(o.skinnedMeshRenderer.castShadow=a)}if(r)for(var i=0;i<t.numChildren;i++){var s=t.getChildAt(i);this.onCastShadow(s,e,a)}},t.rgb2hex=function(t,e,a){return("#"+this.hex(t)+this.hex(e)+this.hex(a)).toUpperCase()},t.hex=function(t){return t=this.onNumTo(t),("0"+parseInt(t).toString(16)).slice(-2)},t.onNumTo=function(t){return(t+"").indexOf(".")>=0&&(t=parseFloat(t.toFixed(2))),t},t.lerpF=function(t,e,a){return t+(e-t)*a},t}();a.WmyUtils3D=o},{"../Wmy_Load_Mag":4,"./WmyShaderMsg":7}]},{},[2]);