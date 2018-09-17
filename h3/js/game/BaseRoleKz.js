var __extends=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var o in i)i.hasOwnProperty(o)&&(t[o]=i[o]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},BaseRoleKz=function(t){function i(){t.apply(this,arguments),this._dir=1}return __extends(i,t),i.prototype.onAwake=function(){this.mySprite3D=this.owner,this.scene3D=this.mySprite3D.scene,this._hitBox=this.mySprite3D.getChildByName("hitBox"),null!=this._hitBox&&(this._gameHit=this._hitBox.getChildByName("hit").addComponent(GameHit)),this._roleBox=this.mySprite3D.getChildByName("roleBox"),this._gfx=this._roleBox.getChildByName("GFX"),this._animator=this._gfx.addComponent(WmyAnimator3d),this._gfx.on(WmyAnimator3d.Event_playEvent,this,this.onEvent_playEvent),this._character=this.mySprite3D.addComponent(WmyPhysicsWorld_Character);var t=WmyUtils3D.getObj3d(this.scene3D,"yy");this._yy=Laya.Sprite3D.instantiate(t,this.scene3D,!0,this.mySprite3D.transform.position),this._HitEffect=WmyUtils3D.getObj3d(this.scene3D,"HitEffect"),this._HitEffect.active=!1,this.onInit()},i.prototype.onInit=function(){},i.prototype.onEvent_playEvent=function(t,i){null!=i&&"hit"==i.eventName&&(1==i.params[1]?null!=this._hitBox&&(this._hitBox.active=!0):null!=this._hitBox&&(this._hitBox.active=!1))},i.prototype.onUpdate=function(){if(null!=this._yy){var t=this.mySprite3D.transform.position;t.y=.01,this._yy.transform.position=t}},Object.defineProperty(i.prototype,"dir",{get:function(){return this._dir},enumerable:!0,configurable:!0}),i.prototype.onTweenMaxRotation=function(t,i){var e=this;if(void 0===t&&(t=1),void 0===i&&(i=.25),null!=this._roleBox&&this._dir!=t){this._dir=t;var o=1==t?0:-180;this._rY=this._roleBox.transform.localRotationEulerY,TweenMax.to(this,i,{_rY:o,onUpdate:function(){e._roleBox.transform.localRotationEulerY=e._rY}}),null!=this._hitBox&&(this._hitBox.transform.localScaleX=t)}},i.prototype.onHit=function(t){var i=t.dir;this.onTweenMaxRotation(-1*i,.2),this._character.move(new Laya.Vector3(this._character.moveSpeed*i,0,0),.1);var e=this.mySprite3D.transform.position.clone();e.y+=1.5,e.z+=.2,this.onAddEffect(this._HitEffect,e,.5)},i.prototype.onAddEffect=function(t,i,e){void 0===e&&(e=1);var o=Laya.Sprite3D.instantiate(t,this.scene3D);o.transform.position=i,o.transform.localScaleX=-1*this._dir,o.active=!0;for(var n=WmyUtils3D.getChildrenComponent(o,Laya.ShuriKenParticle3D),r=0;r<n.length;r++){n[r].particleSystem.play()}Laya.timer.once(1e3*e,this,function(){o.destroy(!0)})},i}(Laya.Script);