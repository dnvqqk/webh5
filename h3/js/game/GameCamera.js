var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var n in o)o.hasOwnProperty(n)&&(t[n]=o[n])};return function(o,n){function e(){this.constructor=o}t(o,n),o.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e)}}(),GameCamera=function(t){function o(){var n=t.call(this)||this;return null==o._this&&(o._this=n),n}return __extends(o,t),Object.defineProperty(o,"getThis",{get:function(){return o._this},enumerable:!0,configurable:!0}),o.prototype.onAwake=function(){this.cam=this.owner,this.camBox=this.cam.parent,this.scene3D=this.cam.scene,this._camPos=this.cam.transform.position},o.prototype.onSetTarget=function(t){TweenMax.killTweensOf(this),this._target=t},o.prototype.onUpdate=function(){if(null!=this._target){var t=this._camPos.clone(),o=this._target.transform.position;t.x=o.x,t.x<-11.5&&(t.x=-11.5),t.x>15&&(t.x=15),t.y=o.y+2.5,this.onTweenMaxPos(t)}},o.prototype.onTweenMaxPos=function(t){var o=this,n=this.camBox.transform.position;this.tposX=n.x,this.tposY=n.y,this.tposZ=n.z,TweenMax.to(this,1,{tposX:t.x,tposY:t.y,tposZ:t.z,onUpdate:function(){n.x=o.tposX,n.y=o.tposY,n.z=o.tposZ,o.camBox.transform.position=n}})},o}(Laya.Script);