var __extends=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function a(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(a.prototype=n.prototype,new a)}}();!function(){function e(t,n,a){function o(i,u){if(!n[i]){if(!t[i]){var s="function"==typeof require&&require;if(!u&&s)return s(i,!0);if(r)return r(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var f=n[i]={exports:{}};t[i][0].call(f.exports,function(e){return o(t[i][1][e]||e)},f,f.exports,e,t,n,a)}return n[i].exports}for(var r="function"==typeof require&&require,i=0;i<a.length;i++)o(a[i]);return o}return e}()({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=function(){function e(){}return e.init=function(){},e.width=1136,e.height=640,e.scaleMode="exactfit",e.screenMode="showall",e.alignV="center",e.alignH="middle",e.startScene="",e.sceneRoot="",e.debug=!1,e.stat=!1,e.physicsDebug=!1,e.exportSceneToJson=!0,e}();n.default=a,a.init()},{}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=e("./GameConfig");new(function(){function e(){window.Laya3D?Laya3D.init(a.default.width,a.default.height):Laya.init(a.default.width,a.default.height,Laya.WebGL),Laya.Physics&&Laya.Physics.enable(),Laya.DebugPanel&&Laya.DebugPanel.enable(),Laya.stage.scaleMode=a.default.scaleMode,Laya.stage.screenMode=a.default.screenMode,Laya.URL.exportSceneToJson=a.default.exportSceneToJson,(a.default.debug||"true"==Laya.Utils.getQueryString("debug"))&&Laya.enableDebugPanel(),a.default.physicsDebug&&Laya.PhysicsDebugDraw&&Laya.PhysicsDebugDraw.enable(),a.default.stat&&Laya.Stat.show(),Laya.alertGlobalError=!0,Laya.ResourceVersion.enable("version.json?"+Date.now(),Laya.Handler.create(this,this.onVersionLoaded),Laya.ResourceVersion.FILENAME_VERSION)}return e.prototype.onVersionLoaded=function(){var e=Laya.ResourceVersion.addVersionPrefix("loadInfo.txt");console.log(e)},e}())},{"./GameConfig":1}]},{},[2]);