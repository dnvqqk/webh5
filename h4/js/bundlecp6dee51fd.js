var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var a in e)e.hasOwnProperty(a)&&(t[a]=e[a])};return function(e,a){function i(){this.constructor=e}t(e,a),e.prototype=null===a?Object.create(a):(i.prototype=a.prototype,new i)}}();!function(){function t(e,a,i){function r(o,s){if(!a[o]){if(!e[o]){var l="function"==typeof require&&require;if(!s&&l)return l(o,!0);if(n)return n(o,!0);var h=new Error("Cannot find module '"+o+"'");throw h.code="MODULE_NOT_FOUND",h}var u=a[o]={exports:{}};e[o][0].call(u.exports,function(t){return r(e[o][1][t]||t)},u,u.exports,t,e,a,i)}return a[o].exports}for(var n="function"==typeof require&&require,o=0;o<i.length;o++)r(i[o]);return r}return t}()({1:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=function(){function t(){}return t.init=function(){},t.width=1136,t.height=640,t.scaleMode="exactfit",t.screenMode="showall",t.alignV="center",t.alignH="middle",t.startScene="",t.sceneRoot="",t.debug=!1,t.stat=!1,t.physicsDebug=!1,t.exportSceneToJson=!0,t}();a.default=i,i.init()},{}],2:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("./GameConfig"),r=t("./wmyUtilsH5/Wmy_Load_Mag"),n=t("./wmyUtilsH5/d3/WmyUtils3D"),o=t("./z_game/GameCamera"),s=t("./z_game/PlayerKz"),l=t("./z_game/EnemyKz");new(function(){function t(){window.Laya3D?Laya3D.init(i.default.width,i.default.height):Laya.init(i.default.width,i.default.height,Laya.WebGL),Laya.Physics&&Laya.Physics.enable(),Laya.DebugPanel&&Laya.DebugPanel.enable(),Laya.stage.scaleMode=Laya.Stage.SCALE_EXACTFIT,Laya.stage.scaleMode=Laya.Stage.SCALE_SHOWALL,Laya.stage.screenMode=Laya.Stage.SCREEN_HORIZONTAL,Laya.stage.alignH="center",Laya.stage.alignV="middle",(i.default.debug||"true"==Laya.Utils.getQueryString("debug"))&&Laya.enableDebugPanel(),i.default.physicsDebug&&Laya.PhysicsDebugDraw&&Laya.PhysicsDebugDraw.enable(),i.default.stat&&Laya.Stat.show(),Laya.alertGlobalError=!0,Laya.ResourceVersion.enable("version.json?"+Date.now(),Laya.Handler.create(this,this.onVersionLoaded),Laya.ResourceVersion.FILENAME_VERSION)}return t.prototype.onVersionLoaded=function(){Laya.stage.addChild(fairygui.GRoot.inst.displayObject),r.Wmy_Load_Mag.getThis.onLoadWetData("res/loadInfo.json",Laya.Handler.create(this,this.onLoadLoad))},t.prototype.onLoadLoad=function(){var t=r.Wmy_Load_Mag.getThis.getResObj("load");null!=t&&r.Wmy_Load_Mag.getThis.onload(t,new Laya.Handler(this,this.onLoadMain))},t.prototype.onLoadMain=function(){this._loadView=fairygui.UIPackage.createObject("load","Load").asCom,fairygui.GRoot.inst.addChild(this._loadView),this._bar=this._loadView.getChild("bar").asProgress,r.Wmy_Load_Mag.getThis.onAutoLoadAll(new Laya.Handler(this,this.onLoadOk),new Laya.Handler(this,this.onLoading))},t.prototype.onLoading=function(t){this._bar.value=t},t.prototype.onLoadOk=function(t,e){var a=this;this._u3dArr=e,Laya.timer.once(400,this,function(){a.onMain(),fairygui.GRoot.inst.removeChild(a._loadView),a._loadView=null,a._bar=null});var i=e[0].urlList[0];this.scene3D=Laya.loader.getRes(i),n.WmyUtils3D.setShaderAll(this.scene3D,"res/mats/","res/shaders/"),Laya.Shader3D.debugMode=!0,Laya.Shader3D.compileShader("PARTICLESHURIKEN",0,3,69214344,14),Laya.Shader3D.compileShader("PARTICLESHURIKEN",0,3,100671488,14),Laya.Shader3D.compileShader("PARTICLESHURIKEN",0,3,69763208,14)},t.prototype.onMain=function(){this._mainView=fairygui.UIPackage.createObject("main","Main").asCom,fairygui.GRoot.inst.addChild(this._mainView),Laya.stage.addChildAt(this.scene3D,0);var t=n.WmyUtils3D.getObj3d(this.scene3D,"Camera").addComponent(o.GameCamera),e=n.WmyUtils3D.getObj3d(this.scene3D,"hit_Player1");e.addComponent(s.PlayerKz),t.onSetTarget(e);n.WmyUtils3D.getObj3d(this.scene3D,"hit_Enemy").addComponent(l.EnemyKz)},t}())},{"./GameConfig":1,"./wmyUtilsH5/Wmy_Load_Mag":4,"./wmyUtilsH5/d3/WmyUtils3D":10,"./z_game/EnemyKz":12,"./z_game/GameCamera":13,"./z_game/PlayerKz":15}],3:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=function(t){function e(){var e=t.call(this)||this;return e._eventList=new Array,Laya.stage.on(laya.events.Event.MOUSE_DOWN,e,e.__onTouchDown),Laya.stage.on(laya.events.Event.MOUSE_UP,e,e.__onTouchUp),Laya.stage.on(laya.events.Event.MOUSE_MOVE,e,e.__OnMouseMOVE),Laya.stage.on(Laya.Event.RESIZE,e,e.__onResize),e}return __extends(e,t),Object.defineProperty(e,"getThis",{get:function(){return null==e._this&&(e._this=new e),e._this},enumerable:!0,configurable:!0}),e.prototype.convertColorToColorFiltersMatrix=function(t,a,i,r){return e.COLOR_FILTERS_MATRIX[0]=t,e.COLOR_FILTERS_MATRIX[6]=a,e.COLOR_FILTERS_MATRIX[12]=i,e.COLOR_FILTERS_MATRIX[18]=r||1,e.COLOR_FILTERS_MATRIX},e.prototype.applyColorFilters=function(t,e){t.filters=null,16777215!=e&&(t.filters=[new Laya.ColorFilter(this.convertColorToColorFiltersMatrix((e>>16&255)/255,(e>>8&255)/255,(255&e)/255))])},e.prototype.applyColorFilters1=function(t,e,a,i,r){t.filters=null,(e<1||a<1||i<1||r<1)&&(t.filters=[new Laya.ColorFilter(this.convertColorToColorFiltersMatrix(e,a,i,r))])},e.prototype.isPc=function(){return!(this.versions().android||this.versions().iPhone||this.versions().ios)&&(this.versions().iPad,!0)},e.prototype.versions=function(){var t=navigator.userAgent;navigator.appVersion;return{trident:t.indexOf("Trident")>-1,presto:t.indexOf("Presto")>-1,webKit:t.indexOf("AppleWebKit")>-1,gecko:t.indexOf("Gecko")>-1&&-1==t.indexOf("KHTML"),mobile:!!t.match(/AppleWebKit.*Mobile.*/)||!!t.match(/AppleWebKit/),ios:!!t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),android:t.indexOf("Android")>-1||t.indexOf("Linux")>-1,iPhone:t.indexOf("iPhone")>-1||t.indexOf("Mac")>-1,iPad:t.indexOf("iPad")>-1,webApp:-1==t.indexOf("Safari")}},e.getUrlV=function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),a=window.location.search.substr(1).match(e);return a?decodeURIComponent(a[2]):null},e.prototype.onNavigate=function(t,e){void 0===e&&(e=!1),e?window.location.replace(t):window.location.href=t},e.prototype.__onTouchDown=function(t){this._eventList.indexOf(t)<0&&this._eventList.push(t)},e.prototype.__onTouchUp=function(t){this._eventList.indexOf(t)>=0&&this._eventList.splice(this._eventList.indexOf(t),1)},e.prototype.__onResize=function(){this._eventList.forEach(function(t){t.type=Laya.Event.MOUSE_UP,Laya.stage.event(Laya.Event.MOUSE_UP,t)}),this._eventList=new Array},e.prototype.__OnMouseMOVE=function(t){(t.stageX<=10||t.stageX>=Laya.stage.width-10||t.stageY<=10||t.stageY>=Laya.stage.height-10)&&(t.type=Laya.Event.MOUSE_UP,Laya.stage.event(Laya.Event.MOUSE_UP,t))},e.onNumTo=function(t,e){return void 0===e&&(e=2),(t+"").indexOf(".")>=0&&(t=parseFloat(t.toFixed(e))),t},e.getR_XY=function(t,e){var a=e*Math.PI/180,i=t*Math.cos(a),r=t*Math.sin(a);return new Laya.Point(i,r)},e.string2buffer=function(t){for(var e="",a=0;a<t.length;a++)""===e?e=t.charCodeAt(a).toString(16):e+=","+t.charCodeAt(a).toString(16);return new Uint8Array(e.match(/[\da-f]{2}/gi).map(function(t){return parseInt(t,16)})).buffer},e.replaceAll=function(t,e,a){var i="";return(i=t.replace(e,a)).indexOf(e)>=0&&(i=this.replaceAll(i,e,a)),i},e.toCase=function(t,e){void 0===e&&(e=!1);return e?t.toUpperCase():t.toLowerCase()},e.getDistance=function(t,e){var a=Math.abs(t.x-e.x),i=Math.abs(t.y-e.y),r=Math.sqrt(Math.pow(a,2)+Math.pow(i,2));return r=parseFloat(r.toFixed(2))},e.getXyToR=function(t,e){var a=Math.atan2(t,e),i=180/Math.PI*a;return i=this.onNumTo(i)},e.storage=function(t,e,a){void 0===e&&(e="?"),void 0===a&&(a=!0);var i=a?localStorage:sessionStorage;if("?"==e){return i.getItem(t)}return null!=e?(i.setItem(t,e),e):(i.removeItem(t),null)},e.playFuiSound=function(t,e,a,i,r){if(void 0===e&&(e=.2),void 0===i&&(i=0),void 0===r&&(r=1),!(e<=0)){var n=fairygui.UIPackage.getItemByURL(t).file;Laya.SoundManager.playSound(n,r,a,null,i),Laya.SoundManager.setSoundVolume(e,n)}},e.COLOR_FILTERS_MATRIX=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],e}(laya.events.EventDispatcher);a.WmyUtils=i},{}],4:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("./WmyUtils"),r=t("./d3/WmyLoad3d"),n=t("./d3/WmyLoadMats"),o=function(){function t(){this._wetData={},this.resUrl="",this._resDataArr=[],this._callbackOk=[],this._callbackProgress=[]}return Object.defineProperty(t,"getThis",{get:function(){return null==t._this&&(t._this=new t),t._this},enumerable:!0,configurable:!0}),t.prototype.getWetData=function(t){return this._wetData[t]},t.prototype.setWetData=function(e,a){if(""==this.resUrl){this.resUrl=a;var i=null;try{i=JSON.parse(e)}catch(t){}try{var r=i[0].assetUrl;!t.isDebug&&document.URL.indexOf("file:///")>=0&&(r=""),t.assetUrl=r}catch(t){}}null==a&&(a=this.resUrl),this._wetData[a]=e},t.prototype.getResObj=function(t,e){var a;if(null==e&&(e=this.resUrl),null==(a=this.getWetData(e)))return console.log("空数据"),null;var i=null;if(a instanceof Array&&(i=a),null==i)try{i=JSON.parse(a)}catch(t){return console.log("加载材料数据错误",a),null}for(var r=null,n=0;n<i.length;n++){var o=i[n];if(o.resName==t){r=o;break}}return r},t.prototype.onLoadWetData=function(t,e){if(""!=t){if(null==this.getWetData(t)){return Laya.loader.load(t,new Laya.Handler(this,function(a){this.setWetData(a,t),e.runWith([this._wetData[t]])}))}e.runWith([this.getWetData(t)])}},t.prototype.onload=function(e,a,r){var n=e.resName;if(null!=this._resDataArr[n])this._resDataArr[n].runWith([this._resDataArr[n]]);else{if(null!=this._callbackOk[n])return this._callbackOk[n].push(a),void(null!=r&&this._callbackProgress[n].push(r));this._callbackOk[n]=[],this._callbackOk[n].push(a),this._callbackProgress[n]=[],null!=r&&this._callbackProgress[n].push(r);var o=e.Resres,s={},l=e.resData;if(null!=l&&""!=l)try{s=JSON.parse(l)}catch(t){console.log("加载材料数据错误",l)}for(var h,u=[],c=0;c<o.length;c++){var d=o[c].resUrl;d=i.WmyUtils.toCase(d);var y=t.assetUrl+d;y.indexOf(".txt")>=0?(u.push({url:y,type:Laya.Loader.BUFFER}),h=d):y.indexOf(".jpg")>=0||y.indexOf(".png")>=0?u.push({url:y,type:Laya.Loader.IMAGE}):y.indexOf(".mp3")>=0||y.indexOf(".wav")>=0?u.push({url:y,type:Laya.Loader.SOUND}):u.push({url:y})}Laya.loader.load(u,Laya.Handler.create(this,this.onAssetConmplete,[n,h,s]),Laya.Handler.create(this,this.onAssetProgress,[n],!1))}},t.prototype.onload3d=function(e,a,i){var n=e.resName;if(null!=this._resDataArr[n])this._resDataArr[n].runWith([this._resDataArr[n]]);else{if(null!=this._callbackOk[n])return this._callbackOk[n].push(a),void(null!=i&&this._callbackProgress[n].push(i));this._callbackOk[n]=[],this._callbackOk[n].push(a),this._callbackProgress[n]=[],null!=i&&this._callbackProgress[n].push(i);var o=e.Resres,s={},l=e.resData;if(null!=l&&""!=l)try{s=JSON.parse(l)}catch(t){console.log("加载材料数据错误",l)}for(var h=[],u=[],c=0;c<o.length;c++){var d=o[c].resUrl,y=t.assetUrl+d;d.indexOf(".ls")>=0&&(h.push({url:y}),u.push(y))}s.urlList=u,r.WmyLoad3d.getThis.onload3d(h,Laya.Handler.create(this,this.onAssetConmplete,[n,void 0,s]),Laya.Handler.create(this,this.onAssetProgress,[n],!1))}},t.prototype.onAssetProgress=function(t,e){for(var a=this._callbackProgress[t],i=0;i<a.length;i++){a[i].runWith([e])}},t.prototype.onAssetConmplete=function(t,e,a){var i=this._callbackOk[t];if(null!=e){var r=Laya.loader.getRes(e),n=e.replace(".txt","");fairygui.UIPackage.addPackage(n,r);var o=n.split("/");a.bName=o[o.length-1],this._resDataArr[t]=a}for(var s=0;s<i.length;s++){i[s].runWith([a])}this._callbackOk[t]=null,this._callbackProgress[t]=null},t.prototype.onAutoLoadAll=function(t,e){var a=this.getWetData(this.resUrl);if(null==a)return console.log("空数据"),null;var i=null;if(a instanceof Array&&(i=a),null==i)try{i=JSON.parse(a)}catch(t){return console.log("加载材料数据错误",a),null}this._autoLoadrCallbackOk=t,this._autoLoadrCallbackProgress=e,this._autoLoadInfoArr={},this._autoLoadInfoArr.num=0,this._autoLoadInfoArr.cNum=0,this._autoLoadInfoArr.uiArr=[],this._autoLoadInfoArr.u3dArr=[];for(var r=0;r<i.length;r++){var n=i[r],o=n.resName,s=n.type;null!=o&&""!=o&&null!=s&&""!=s&&this.onAutoLoadObj(s,o)}},t.prototype.onAutoLoadObj=function(e,a){var i=this.getResObj(a);if(null!=i){var r=this._autoLoadInfoArr.num;if(this._autoLoadInfoArr[r]={},this._autoLoadInfoArr[r].n=a,this._autoLoadInfoArr[r].t=e,"ui"==e)this.onload(i,new Laya.Handler(this,this.onLoadOk,[r]),new Laya.Handler(this,this.onLoading,[r])),this._autoLoadInfoArr.num+=1;else if("mats"==e){for(var o=i.Resres,s=[],l=0;l<o.length;l++){var h=(c=o[l]).resUrl,u=t.assetUrl+h;s.push(u)}n.WmyLoadMats.getThis.onload3d(s,new Laya.Handler(this,this.onLoadOk,[r]),new Laya.Handler(this,this.onLoading,[r])),this._autoLoadInfoArr.num+=1}else if("cubeMap"==e)for(var o=i.Resres,l=0;l<o.length;l++){var c=o[l],h=c.resUrl,u=t.assetUrl+h;Laya.TextureCube.load(u,null)}else"u3d"==e?(this.onload3d(i,new Laya.Handler(this,this.onLoadOk,[r]),new Laya.Handler(this,this.onLoading,[r])),this._autoLoadInfoArr.num+=1):"audio"==e&&(this.onload(i,new Laya.Handler(this,this.onLoadOk,[r]),new Laya.Handler(this,this.onLoading,[r])),this._autoLoadInfoArr.num+=1)}},t.prototype.getCube=function(e,a){var i=this.getResObj(e);if(null!=i){for(var r=i.Resres,n=[],o=0;o<r.length;o++){var s=r[o].resUrl,l=t.assetUrl+s;Laya.TextureCube.load(l,new Laya.Handler(this,function(t){n[o]=t,a.runWith([t,o])}))}return n}},t.prototype.onLoading=function(t,e){this._autoLoadInfoArr[t].p=e;for(var a=this._autoLoadInfoArr.num,i=0,r=0;r<a;r++){var n=this._autoLoadInfoArr[r].p;null!=n&&(i+=n)}var o=i/this._autoLoadInfoArr.num*100;isNaN(o)&&(o=0),null!=this._autoLoadrCallbackProgress&&this._autoLoadrCallbackProgress.runWith([o])},t.prototype.onLoadOk=function(t,e){this._autoLoadInfoArr.cNum+=1,"ui"==this._autoLoadInfoArr[t].t?this._autoLoadInfoArr.uiArr.push(e):"u3d"==this._autoLoadInfoArr[t].t&&this._autoLoadInfoArr.u3dArr.push(e),this._autoLoadInfoArr.cNum>=this._autoLoadInfoArr.num&&null!=this._autoLoadrCallbackOk&&this._autoLoadrCallbackOk.runWith([this._autoLoadInfoArr.uiArr,this._autoLoadInfoArr.u3dArr])},t.isDebug=!1,t.assetUrl="",t}();a.Wmy_Load_Mag=o},{"./WmyUtils":3,"./d3/WmyLoad3d":6,"./d3/WmyLoadMats":7}],5:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("../WmyUtils"),r=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._aniName="",e}return __extends(e,t),Object.defineProperty(e,"Event_playComplete",{get:function(){return"WmyAnimator3d.playComplete"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"Event_playEvent",{get:function(){return"WmyAnimator3d.playEvent"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"Event_playQh",{get:function(){return"WmyAnimator3d.playQh"},enumerable:!0,configurable:!0}),e.prototype.onPlayQh=function(t){return this._playQh=t,this},Object.defineProperty(e.prototype,"mySprite3D",{get:function(){return this._mySprite3D},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"animator",{get:function(){return this._animator},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"controllerLaye",{get:function(){return this._controllerLaye},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"playState",{get:function(){return this._playState},enumerable:!0,configurable:!0}),e.prototype._onAdded=function(){this._mySprite3D=this.owner,this._animator=this.mySprite3D.getComponent(Laya.Animator),this._controllerLaye=this._animator.getControllerLayer(),this._playState=this._animator.getCurrentAnimatorPlayState();var t=this._animator.getDefaultState();this.onAnimator(t.name)},Object.defineProperty(e.prototype,"aniName",{get:function(){return this._aniName},enumerable:!0,configurable:!0}),e.prototype.onAnimator=function(t,a,i,r,n){var o=this;if(void 0===a&&(a=!1),void 0===i&&(i=0),null!=this._animator&&(this._aniName!=t||a)){var s=this._aniName;if(this._aniName=t,""!=s&&""!=t&&t!=s){var l=[this.aniName,s];this.mySprite3D.event(e.Event_playQh,l),null!=this._playQh&&this._playQh.runWith(l),Laya.timer.clearAll(this)}return Laya.timer.once(i,this,function(){a?o._animator.play(t,0,0):o._animator.crossFade(t,.05);var e=o._controllerLaye._statesMap[t];o.onPlayCompleteEvent(e,r),o.onPlayEvent(e,n)}),this}},e.prototype.onPlayCompleteEvent=function(t,a){var i=this,r=t._clip.duration();r*=1/t.speed*1e3;var n=function(){var t=[i.aniName];i.mySprite3D.event(e.Event_playComplete,t),null!=a&&a.runWith([t])};t._clip.islooping?Laya.timer.loop(r,this,n):Laya.timer.once(r,this,n)},e.prototype.onPlayEvent=function(t,a){for(var r=this,n=1/t.speed*1e3,o=0;o<t._clip._events.length;o++){var s=t._clip._events[o],l=i.WmyUtils.onNumTo(s.time,2)*n,h=function(t){var i=[r.aniName,t];r.mySprite3D.event(e.Event_playEvent,i),null!=a&&a.runWith([i])};t._clip.islooping?Laya.timer.loop(l,this,h,[s]):Laya.timer.once(l,this,h,[s])}},e}(Laya.Script3D);a.WmyAnimator3d=r},{"../WmyUtils":3}],6:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=function(){function t(){this._mArr=[],this._mNum=0,this._mP=0,this._mP2=0}return Object.defineProperty(t,"getThis",{get:function(){return null==t._this&&(t._this=new t),t._this},enumerable:!0,configurable:!0}),t.prototype.onload3d=function(t,e,a){this._urlList=[],this._callbackOk=e,this._callbackProgress=a;for(var i=0;i<t.length;i++){var r=t[i],n={};n.url=r.url,this._urlList.push(n),r.url=Laya.ResourceVersion.addVersionPrefix(r.url),r.url+="?wmy",t[i]=r}Laya.loader.load(t,Laya.Handler.create(this,this.__onlsUrlArrOk,[t]))},t.prototype.__onlsUrlArrOk=function(t){for(o=0;o<t.length;o++){var e=t[o].url,a=e.split("/"),i=e.replace(a[a.length-1],""),r=Laya.loader.getRes(e),n=JSON.parse(r);this.__tiQuUrl(n.data,i)}for(var o=0;o<this._mArr.length;o++)e=this._mArr[o],Laya.loader.create(e,Laya.Handler.create(this,this.__onArrOk),Laya.Handler.create(this,this.__onArrP))},t.prototype.__onArrP=function(t){(e=t*(this._mNum+1))>this._mP&&(this._mP=e),this._mP2=this._mP/this._mArr.length;var e=.98*this._mP2;null!=this._callbackProgress&&this._callbackProgress.runWith([e])},t.prototype.__onArrOk=function(){var t=this;this._mNum+=1,this._mNum>=this._mArr.length&&Laya.loader.create(this._urlList,Laya.Handler.create(this,function(){null!=t._callbackOk&&t._callbackOk.run()}))},t.prototype.__tiQuUrl=function(t,e){if(void 0===e&&(e=""),null!=t.props&&null!=t.props.meshPath){var a=e+t.props.meshPath;this._mArr.indexOf(a)<0&&this._mArr.push(a);var i=t.props.materials;if(null!=i)for(var r=0;r<i.length;r++){var n=e+i[r].path;this._mArr.indexOf(n)<0&&this._mArr.push(n)}}if(null!=t.components){var o=t.components;if(o.length>0)for(var s=0;s<o.length;s++){var l=o[s];if(null!=l.avatar){var h=e+l.avatar.path;this._mArr.indexOf(h)<0&&this._mArr.push(h)}if(null!=l.layers)for(var u=l.layers,c=0;c<u.length;c++)for(var d=u[c].states,y=0;y<d.length;y++){var p=e+d[y].clipPath;this._mArr.indexOf(p)<0&&this._mArr.push(p)}}}var _=t.child;if(null!=_&&_.length>0)for(var f=0;f<_.length;f++)this.__tiQuUrl(_[f],e)},t}();a.WmyLoad3d=i},{}],7:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=function(){function t(){this._matsUrlArr=[],this._matOk=!1,this._matNum=0,this._matP=0,this._matP2=0}return Object.defineProperty(t,"getThis",{get:function(){return null==t._this&&(t._this=new t),t._this},enumerable:!0,configurable:!0}),t.prototype.onload3d=function(t,e,a){this._callbackOk=e,this._callbackProgress=a,Laya.loader.load(t,Laya.Handler.create(this,this.__onUrlArrOk,[t]))},t.prototype.__onUrlArrOk=function(t){for(h=0;h<t.length;h++)for(var e=t[h],a=Laya.loader.getRes(e),i=e.split("/"),r=e.replace(i[i.length-1],""),n=a.mats,o=0;o<n.length;o++){var s=n[o];if(""!=s.targetName){var l=r+s.matUrl;this._matsUrlArr.push(l)}}for(var h=0;h<this._matsUrlArr.length;h++)e=this._matsUrlArr[h],Laya.loader.create(e,Laya.Handler.create(this,this.__onMatArrOk),Laya.Handler.create(this,this.__onMatArrP))},t.prototype.__onMatArrP=function(t){var e=t*(this._matNum+1);e>this._matP&&(this._matP=e),this._matP2=this._matP/this._matsUrlArr.length,null!=this._callbackProgress&&this._callbackProgress.runWith([this._matP2])},t.prototype.__onMatArrOk=function(){this._matNum+=1,this._matNum>=this._matsUrlArr.length&&null!=this._callbackOk&&this._callbackOk.run()},t}();a.WmyLoadMats=i},{}],8:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.moveSpeed=.03,e.jumpSpeed=6,e.isU=!1,e.isD=!1,e.isL=!1,e.isR=!1,e.isLockMove=!1,e}return __extends(e,t),Object.defineProperty(e.prototype,"isGrounded",{get:function(){return null!=this.character&&this.character.isGrounded},enumerable:!0,configurable:!0}),e.prototype.onAwake=function(){this.mySprite3D=this.owner,this.scene3D=this.mySprite3D.scene;var t=this.mySprite3D.getComponent(Laya.PhysicsCollider);t.enabled=!1;var e=t.colliderShape;this.character=this.mySprite3D.addComponent(Laya.CharacterController);var a=new Laya.CapsuleColliderShape(e.radius,e.length,e.orientation);a.localOffset=e.localOffset,this.character.colliderShape=a,this.character.jumpSpeed=this.jumpSpeed,this.character.gravity=new Laya.Vector3(0,-14,0)},e.prototype.onUpdate=function(){var t=this.moveSpeed,e=new Laya.Vector3,a=this.character.isGrounded;this.isLockMove||(this.isU&&this.isD||a&&(this.isU?e.z=-t:this.isD&&(e.z=t)),this.isL&&this.isR||(this.isL?e.x=-t:this.isR&&(e.x=t)),this.character.move(e))},e.prototype.move=function(t,e){var a=this;void 0===e&&(e=0),this.isLockMove=!0,this.character.move(t),Laya.timer.once(1e3*e,this,function(){a.isLockMove=!1})},e}(Laya.Script);a.WmyPhysicsWorld_Character=i},{}],9:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("../Wmy_Load_Mag"),r=function(){function t(){}return t.setShader=function(t,e,a,i,r,n){void 0===i&&(i=!1),void 0===r&&(r="null"),void 0===n&&(n="null");var o,s;s=t instanceof Laya.SkinnedMeshSprite3D?(o=t.skinnedMeshRenderer).sharedMaterial:(o=t.meshRenderer).sharedMaterial,i&&(s=s.clone(),o.sharedMaterial=s);for(var l in e)try{s[l]=e[l]}catch(t){}return Laya.loader.load(a,Laya.Handler.create(this,this.shaderConmplete,[s,r,n])),s},t.shaderConmplete=function(t,e,a,r){if(null!=r){var n=null;try{n=Laya.Utils.parseXMLFromString(r)}catch(t){return}var o,s,l,h,u,c,d=n.firstChild,y=this.getAttributesValue(d,"name"),p={},_=this.getNode(d,"attributeMap"),f=this.getNodeArr(_,"data");for(o=0;o<f.length;o++)s=f[o],l=this.getAttributesValue(s,"name"),h=this.getAttributesValue(s,"v0"),p[l]=this.getV(h,"int");var m={},g=this.getNode(d,"uniformMap"),v=this.getNodeArr(g,"data");for(o=0;o<v.length;o++){c=null,s=v[o],l=this.getAttributesValue(s,"name"),h=this.getAttributesValue(s,"v0"),u=this.getAttributesValue(s,"v1");var L=[];if(L[0]=this.getV(h,"int"),L[1]=this.getV(u,"int"),m[l]=L,null!=t.wmyValues){if(null!=t.wmyValues.cube){var b=t.wmyValues.cube;i.Wmy_Load_Mag.getThis.getCube(b,new Laya.Handler(this,function(e,a){0==a&&t._shaderValues.setTexture(Laya.Scene3D.REFLECTIONTEXTURE,e)}))}c=t.wmyValues[l]}if(null!=c)if(4==(c=c.split(",")).length)t._shaderValues.setVector(L[0],new Laya.Vector4(parseFloat(c[0]),parseFloat(c[1]),parseFloat(c[2]),parseFloat(c[3])));else if(3==c.length)t._shaderValues.setVector(L[0],new Laya.Vector3(parseFloat(c[0]),parseFloat(c[1]),parseFloat(c[2])));else if(2==c.length)t._shaderValues.setVector(L[0],new Laya.Vector2(parseFloat(c[0]),parseFloat(c[1])));else if(1==c.length)if(isNaN(parseFloat(c[0]))){if("tex"==c[0]+""){var A=t[l];t._shaderValues.setTexture(L[0],A)}}else t._shaderValues.setNumber(L[0],parseFloat(c[0]))}"null"==e&&(e=Laya.SkinnedMeshSprite3D.shaderDefines),"null"==a&&(a=Laya.BlinnPhongMaterial.shaderDefines);var O=Laya.Shader3D.add(y,p,m,e,a),P=this.getNode(d,"SubShader"),S=this.getNode(d,"renderMode");if(null!=S){var D=this.getAttributesValue(S,"v");null!=D&&(t.renderMode=this.getV(D))}var M=this.getNodeArr(P,"Pass");for(o=0;o<M.length;o++){var w=M[o],U=this.getNode(w,"VERTEX").textContent;U=U.replace(/(\r)/g,"");var x=this.getNode(w,"FRAGMENT").textContent;if(x=x.replace(/(\r)/g,""),o>0){var C=t.getRenderState(0).clone();t._renderStates.push(C)}var k=this.getNode(w,"cull");if(null!=k){var E=this.getAttributesValue(k,"v");null!=E&&(t.getRenderState(o).cull=this.getV(E))}O._addShaderPass(U,x)}t._shader=O}},t.getV=function(t,e){void 0===e&&(e="null");var a,i,r;for("Laya"===(a=t.split("."))[0]?i=Laya:"laya"===a[0]&&(i=laya),r=1;r<a.length;r++)i=i[a[r]];return null!=i?i:"null"!=e?"int"==e?parseInt(t):t:null},t.colorStringToUint=function(t){return Number("0x"+t.replace("#",""))},t.getAttributesValue=function(t,e){return e in t.attributes?t.attributes[e].nodeValue:null},t.getNode=function(t,e){for(var a=t.childNodes,i=null,r=0;r<a.length;r++){var n=a[r];if(n.nodeName==e){i=n;break}}return i},t.getNodeArr=function(t,e){for(var a=t.childNodes,i=[],r=0;r<a.length;r++){var n=a[r];n.nodeName==e&&i.push(n)}return i},t}();a.WmyShaderMsg=r},{"../Wmy_Load_Mag":4}],10:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("../Wmy_Load_Mag"),r=t("./WmyShaderMsg"),n=function(){function t(){}return t.getObj3d=function(t,e){if(null==t)return null;if(t.name==e)return t;for(var a=0;a<t._children.length;a++){var i=t._children[a];if(i._children.length<=0){if(i.name==e)return i}else{var r=this.getObj3d(i,e);if(null!=r)return r}}return null},t.getChildrenComponent=function(t,e,a){if(null==t)return null;null==a&&(a=[]);var i=t.getComponent(e);null==i&&t instanceof e&&(i=t),null!=i&&a.push(i);for(var r=0;r<t._children.length;r++){var n=t._children[r];this.getChildrenComponent(n,e,a)}return a},t.setShaderAll=function(e,a,n){var o=this,s=i.Wmy_Load_Mag.assetUrl,l=s+a+"wmyMats.json",h=s+n;Laya.loader.load(l,Laya.Handler.create(this,function(a,i,n){for(var s=n.mats,l=0;l<s.length;l++){var h=s[l];if(""!=h.targetName){var u=t.getObj3d(e,h.targetName);if(null!=u){var c=a+h.matUrl,d=i+h.shaderName+".txt";Laya.BaseMaterial.load(c,Laya.Handler.create(o,function(t,e,a){r.WmyShaderMsg.setShader(t,a,e)},[u,d]))}}}},[a,h]),null,Laya.Loader.JSON)},t.aniPlay=function(t,e,a){var i=this.getObj3d(t,e).getComponent(Laya.Animator);return i.play(a),i},t.onShadow=function(t,e,a,i,r){void 0===e&&(e=512),void 0===a&&(a=1),void 0===i&&(i=100),void 0===r&&(r=!0),t.shadow=r,t.shadowDistance=i,t.shadowResolution=e,t.shadowPCFType=a},t.onCastShadow=function(t,e,a,i){if(void 0===e&&(e=0),void 0===a&&(a=!0),void 0===i&&(i=!0),t instanceof Laya.MeshSprite3D){var r=t;0==e?r.meshRenderer.receiveShadow=a:1==e?r.meshRenderer.castShadow=a:2==e&&(r.meshRenderer.receiveShadow=a,r.meshRenderer.castShadow=a)}if(t instanceof Laya.SkinnedMeshSprite3D){var n=t;0==e?n.skinnedMeshRenderer.receiveShadow=a:1==e&&(n.skinnedMeshRenderer.castShadow=a)}if(i)for(var o=0;o<t.numChildren;o++){var s=t.getChildAt(o);this.onCastShadow(s,e,a)}},t.rgb2hex=function(t,e,a){return("#"+this.hex(t)+this.hex(e)+this.hex(a)).toUpperCase()},t.hex=function(t){return t=this.onNumTo(t),("0"+parseInt(t).toString(16)).slice(-2)},t.onNumTo=function(t){return(t+"").indexOf(".")>=0&&(t=parseFloat(t.toFixed(2))),t},t.lerpF=function(t,e,a){return t+(e-t)*a},t}();a.WmyUtils3D=n},{"../Wmy_Load_Mag":4,"./WmyShaderMsg":9}],11:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("../wmyUtilsH5/d3/WmyAnimator3d"),r=t("../wmyUtilsH5/d3/WmyPhysicsWorld_Character"),n=t("./GameHit"),o=t("../wmyUtilsH5/d3/WmyUtils3D"),s=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._dir=1,e}return __extends(e,t),Object.defineProperty(e.prototype,"animator",{get:function(){return this._animator},enumerable:!0,configurable:!0}),e.prototype.onAwake=function(){this.mySprite3D=this.owner,this.scene3D=this.mySprite3D.scene,this._hitBox=this.mySprite3D.getChildByName("hitBox"),null!=this._hitBox&&(this._hit=this._hitBox.getChildByName("hit"),this._hit.addComponent(n.GameHit)),this._roleBox=this.mySprite3D.getChildByName("roleBox"),this._gfx=this._roleBox.getChildByName("GFX"),this._animator=this._gfx.addComponent(i.WmyAnimator3d),this._gfx.on(i.WmyAnimator3d.Event_playEvent,this,this.__onEvent_playEvent),this._character=this.mySprite3D.addComponent(r.WmyPhysicsWorld_Character);var t=o.WmyUtils3D.getObj3d(this.scene3D,"yy");this._yy=Laya.Sprite3D.instantiate(t,this.scene3D,!0,this.mySprite3D.transform.position),this._HitEffect=o.WmyUtils3D.getObj3d(this.scene3D,"HitEffect"),this._HitEffect.active=!1,this._DustEffectJump=o.WmyUtils3D.getObj3d(this.scene3D,"DustEffectJump"),this._DustEffectJump.active=!1,this._DustEffectLand=o.WmyUtils3D.getObj3d(this.scene3D,"DustEffectLand"),this._DustEffectLand.active=!1,this.onInit()},e.prototype.onInit=function(){},e.prototype.__onEvent_playEvent=function(t,e){null!=e&&("hit"==e.eventName&&(1==e.params[1]?null!=this._hitBox&&(this._hitBox.active=!0):null!=this._hitBox&&(this._hitBox.active=!1)),this.onEvent_playEvent(t,e))},e.prototype.onEvent_playEvent=function(t,e){},e.prototype.onUpdate=function(){if(null!=this._yy){var t=this.mySprite3D.transform.position;t.y=.01,this._yy.transform.position=t}},Object.defineProperty(e.prototype,"dir",{get:function(){return this._dir},enumerable:!0,configurable:!0}),e.prototype.onTweenMaxRotation=function(t,e){var a=this;if(void 0===t&&(t=1),void 0===e&&(e=.25),null!=this._roleBox&&this._dir!=t){this._dir=t;var i=1==t?0:-180;this._rY=this._roleBox.transform.localRotationEulerY,TweenMax.to(this,e,{_rY:i,onUpdate:function(){a._roleBox.transform.localRotationEulerY=a._rY}}),null!=this._hitBox&&(this._hitBox.transform.localScaleX=t)}},e.prototype.onHit=function(t,e){void 0===e&&(e=.01);var a=t.dir;this.onTweenMaxRotation(-1*a,.2),this._character.move(new Laya.Vector3(e*a,0,0),.1);var i=this.mySprite3D.transform.position.clone();i.y+=1.5,i.z+=.2,this.onAddEffect(this._HitEffect,i,.5),this.onHitAim(t)},e.prototype.onHitAim=function(t){},e.prototype.onAddEffect=function(t,e,a){void 0===a&&(a=1);var i=Laya.Sprite3D.instantiate(t,this.scene3D);i.transform.position=e,i.transform.localScaleX=-1*this._dir,i.active=!0;for(var r=o.WmyUtils3D.getChildrenComponent(i,Laya.ShuriKenParticle3D),n=0;n<r.length;n++){r[n].particleSystem.play()}Laya.timer.once(1e3*a,this,function(){i.destroy(!0)})},e}(Laya.Script);a.BaseRoleKz=s},{"../wmyUtilsH5/d3/WmyAnimator3d":5,"../wmyUtilsH5/d3/WmyPhysicsWorld_Character":8,"../wmyUtilsH5/d3/WmyUtils3D":10,"./GameHit":14}],12:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("./BaseRoleKz"),r=t("../wmyUtilsH5/WmyUtils"),n=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._hitAinNameId=0,e}return __extends(e,t),e.prototype.onInit=function(){this.onTweenMaxRotation(-1)},e.prototype.onHitAim=function(t){var e=this;this._hitAinNameId+=1,this._hitAinNameId<1&&(this._hitAinNameId=1),this._hitAinNameId>2&&(this._hitAinNameId=1);var a="Enemy1_Hit"+this._hitAinNameId;this._animator.onAnimator(a,!1,0,Laya.Handler.create(this,function(){e._animator.onAnimator("Enemy_Idle")})),r.WmyUtils.playFuiSound("ui://audio/PunchHit1")},e}(i.BaseRoleKz);a.EnemyKz=n},{"../wmyUtilsH5/WmyUtils":3,"./BaseRoleKz":11}],13:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=function(t){function e(){var a=t.call(this)||this;return null==e._this&&(e._this=a),a}return __extends(e,t),Object.defineProperty(e,"getThis",{get:function(){return e._this},enumerable:!0,configurable:!0}),e.prototype.onAwake=function(){this.cam=this.owner,this.camBox=this.cam.parent,this.scene3D=this.cam.scene,this._camPos=this.cam.transform.position},e.prototype.onSetTarget=function(t){TweenMax.killTweensOf(this),this._target=t},e.prototype.onUpdate=function(){if(null!=this._target){var t=this._camPos.clone(),e=this._target.transform.position;t.x=e.x,t.x<-11.5&&(t.x=-11.5),t.x>15&&(t.x=15),t.y=e.y+2.5,this.onTweenMaxPos(t)}},e.prototype.onTweenMaxPos=function(t){var e=this,a=this.camBox.transform.position;this.tposX=a.x,this.tposY=a.y,this.tposZ=a.z,TweenMax.to(this,1,{tposX:t.x,tposY:t.y,tposZ:t.z,onUpdate:function(){a.x=e.tposX,a.y=e.tposY,a.z=e.tposZ,e.camBox.transform.position=a}})},e}(Laya.Script3D);a.GameCamera=i},{}],14:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("./BaseRoleKz"),r=function(t){function e(){var e=t.call(this)||this;return e._hitsObjArr=[],e}return __extends(e,t),Object.defineProperty(e,"Event_hit",{get:function(){return"GameHit.hit"},enumerable:!0,configurable:!0}),e.prototype.onAwake=function(){this.obj=this.owner,this.hitBox=this.obj.parent,this.hitBox.active=!1,this.myObj=this.getMyObj(this.obj,"hit_"),null!=this.myObj&&(this.baseRoleKz=this.myObj.getComponent(i.BaseRoleKz)),null==this.myObj&&(this.myObj=this.obj)},e.prototype.getMyObj=function(t,e){return null==t?null:t.name.indexOf(e)>=0?t:this.getMyObj(t.parent,e)},e.prototype.onUpdate=function(){},e.prototype.onTriggerEnter=function(t){if(this.hitBox.active){var a=t.owner;if(a.activeInHierarchy&&a!=this.myObj&&!(a.name.indexOf("hit_")<0||this._hitsObjArr.indexOf(a)>=0)){this._hitsObjArr.push(a);var r=a.getComponent(i.BaseRoleKz);if(null!=r&&null!=this.baseRoleKz){var n=[r];this.obj.event(e.Event_hit,n)}}}},e.prototype.onTriggerExit=function(t){},e.prototype.onDisable=function(){this._hitsObjArr=[]},e}(Laya.Script);a.GameHit=r},{"./BaseRoleKz":11}],15:[function(t,e,a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("./BaseRoleKz"),r=t("./GameHit"),n=t("../wmyUtilsH5/WmyUtils"),o=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._isLock=!1,e.keyArr={},e._jumpDown=!1,e._isCarom=!1,e._punchId=1,e._isAct=!1,e._jlNum=0,e._isLd=!1,e}return __extends(e,t),e.prototype.onInit=function(){this._hit.on(r.GameHit.Event_hit,this,this.oEvent_hit);this._animator.controllerLaye._statesMap.Walk.speed=1.2;this._animator.controllerLaye._statesMap.Punch1.speed=1.3;this._animator.controllerLaye._statesMap.Punch2.speed=1.2;this._animator.controllerLaye._statesMap.Punch3.speed=1;this._animator.controllerLaye._statesMap.JumpKick.speed=1.3},e.prototype.onKeyDown=function(t){var e=t.keyCode;this.keyArr[e]||(32==e&&(this._isLock||this.onJump()),74==e&&this.onPunch()),this.keyArr[e]||(this.keyArr[e]=!0)},e.prototype.onKeyUp=function(t){var e=t.keyCode;this.keyArr[e]&&(this.keyArr[e]=!1)},e.prototype.onJump=function(){var t=this;this._character.isGrounded&&(this._punchId=1,this._character.character.jump(),this._jumpDown=!1,this._animator.onAnimator("Jump1"),n.WmyUtils.playFuiSound("ui://audio/PlayerJump"),Laya.timer.once(550,this,function(){t._jumpDown=!0}),this.onAddEffect(this._DustEffectJump,this._yy.transform.position.clone()))},e.prototype.onPunch=function(){var t=this;if(!this._isAct||this._isCarom)if(this._character.isGrounded){n.WmyUtils.playFuiSound("ui://audio/Whoosh"),null==this.caromFun?this.caromFun=function(){t._isCarom=!1,t._punchId=1}:Laya.timer.clear(this,this.caromFun),this._isAct||this._isCarom||(this._punchId=1),this._isAct=!0,this._isLock=!0,this._isCarom=!1,null!=this._hitBox&&(this._hitBox.active=!1);var e=0;2==this._punchId&&(e=30),3==this._punchId&&(e=40),this._animator.onAnimator("Punch"+this._punchId,!0,e,Laya.Handler.create(this,function(){t._isAct=!1,t._isLock=!1;var e=50;2==t._punchId&&(e=120),3==t._punchId&&(e=150),Laya.timer.once(e,t,t.caromFun)}))}else"Jump1"==this._animator.aniName&&(n.WmyUtils.playFuiSound("ui://audio/Whoosh"),this._isAct=!0,this._animator.onAnimator("JumpKick"),Laya.timer.once(420,this,function(){t._isAct=!1}))},e.prototype.onEvent_playEvent=function(t,e){"carom"==e.eventName&&1==e.params[1]&&(this._isCarom=!0,"Punch1"==t?this._punchId=2:"Punch2"==t&&(this._punchId=3))},e.prototype.oEvent_hit=function(t){var e=.01;"Punch2"==this._animator.aniName?e=.02:"Punch3"==this._animator.aniName?e=.02:"JumpKick"==this._animator.aniName&&(e=.03),t.onHit(this,e)},e.prototype.onPreRender=function(){this._character.isL=Laya.KeyBoardManager.hasKeyDown(65),this._character.isR=Laya.KeyBoardManager.hasKeyDown(68),this._character.isU=Laya.KeyBoardManager.hasKeyDown(87),this._character.isD=Laya.KeyBoardManager.hasKeyDown(83),this._isLock&&(this._character.isL=!1,this._character.isR=!1,this._character.isU=!1,this._character.isD=!1),this._character.isL?this.onTweenMaxRotation(-1):this._character.isR&&this.onTweenMaxRotation(1),this._character.isGrounded?this._isAct||(this._character.isU||this._character.isD||this._character.isL||this._character.isR?this._animator.onAnimator("Walk"):this._animator.onAnimator("Idle")):(this._jumpDown&&!this._isAct&&(this._animator.onAnimator("Jump2"),this._jumpDown=!1),this.mySprite3D.transform.localPositionY<this._jlNum?!this._isLd&&this.mySprite3D.transform.localPositionY<.2&&(this._isLd=!0,this.onAddEffect(this._DustEffectLand,this._yy.transform.position.clone())):this.mySprite3D.transform.localPositionY>.2&&(this._isLd=!1),this._jlNum=this.mySprite3D.transform.localPositionY)},e}(i.BaseRoleKz);a.PlayerKz=o},{"../wmyUtilsH5/WmyUtils":3,"./BaseRoleKz":11,"./GameHit":14}]},{},[2]);