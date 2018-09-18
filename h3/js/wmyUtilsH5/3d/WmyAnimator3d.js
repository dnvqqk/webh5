var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},WmyAnimator3d=function(t){function e(){t.apply(this,arguments),this._aniName=""}return __extends(e,t),Object.defineProperty(e,"Event_playComplete",{get:function(){return"WmyAnimator3d.playComplete"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"Event_playEvent",{get:function(){return"WmyAnimator3d.playEvent"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"Event_playQh",{get:function(){return"WmyAnimator3d.playQh"},enumerable:!0,configurable:!0}),e.prototype.onPlayQh=function(t){return this._playQh=t,this},Object.defineProperty(e.prototype,"mySprite3D",{get:function(){return this._mySprite3D},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"animator",{get:function(){return this._animator},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"controllerLaye",{get:function(){return this._controllerLaye},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"playState",{get:function(){return this._playState},enumerable:!0,configurable:!0}),e.prototype.onAwake=function(){this._mySprite3D=this.owner,this._animator=this.mySprite3D.getComponent(Laya.Animator),this._controllerLaye=this._animator.getControllerLayer(),this._playState=this._animator.getCurrentAnimatorPlayState();var t=this._animator.getDefaultState();this.onAnimator(t.name)},Object.defineProperty(e.prototype,"aniName",{get:function(){return this._aniName},enumerable:!0,configurable:!0}),e.prototype.onAnimator=function(t,n,i,r){if(void 0===n&&(n=!1),null!=this._animator&&(this._aniName!=t||n)){var a=this._aniName;if(this._aniName=t,""!=a&&""!=t&&t!=a){var o=[this.aniName,a];this.mySprite3D.event(e.Event_playQh,o),null!=this._playQh&&this._playQh.runWith(o),Laya.timer.clearAll(this)}n?this._animator.play(t,0,0):this._animator.crossFade(t,.05);var l=this._controllerLaye._statesMap[t];return this.onPlayCompleteEvent(l,i),this.onPlayEvent(l,r),this}},e.prototype.onPlayCompleteEvent=function(t,n){var i=this,r=t._clip.duration();r*=1/t.speed*1e3;var a=function(){var t=[i.aniName];i.mySprite3D.event(e.Event_playComplete,t),null!=n&&n.runWith([t])};t._clip.islooping?Laya.timer.loop(r,this,a):Laya.timer.once(r,this,a)},e.prototype.onPlayEvent=function(t,n){for(var i=this,r=1/t.speed*1e3,a=0;a<t._clip._events.length;a++){var o=t._clip._events[a],l=WmyUtils.onNumTo(o.time,2)*r,p=function(t){var r=[i.aniName,t];i.mySprite3D.event(e.Event_playEvent,r),null!=n&&n.runWith([r])};t._clip.islooping?Laya.timer.loop(l,this,p,[o]):Laya.timer.once(l,this,p,[o])}},e}(Laya.Script);