var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var n in o)o.hasOwnProperty(n)&&(t[n]=o[n])};return function(o,n){function i(){this.constructor=o}t(o,n),o.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),Wmy_UiObj=function(t){function o(){return null!==t&&t.apply(this,arguments)||this}return __extends(o,t),o.prototype.dispose=function(){this.off(Laya.Event.DISPLAY,this,this.onShow),this.off(Laya.Event.UNDISPLAY,this,this.onHide),t.prototype.dispose.call(this)},o.prototype.constructFromXML=function(o){t.prototype.constructFromXML.call(this,o),this.on(Laya.Event.DISPLAY,this,this.onShow),this.on(Laya.Event.UNDISPLAY,this,this.onHide),this.onInit()},o.prototype.onInit=function(){},o.prototype.onShow=function(){},o.prototype.onHide=function(){},o}(fairygui.GComponent);