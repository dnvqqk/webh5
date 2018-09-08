var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,i){t.__proto__=i}||function(t,i){for(var r in i)i.hasOwnProperty(r)&&(t[r]=i[r])};return function(i,r){function n(){this.constructor=i}t(i,r),i.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}(),PlayerKz=function(t){function i(){var i=null!==t&&t.apply(this,arguments)||this;return i._isLock=!1,i.keyArr={},i._jumpDown=!1,i._punchId=1,i._isAct=!1,i._dir=0,i}return __extends(i,t),i.prototype.onAwake=function(){this.mySprite3D=this.owner,this.scene3D=this.mySprite3D.scene,this._yy=this.mySprite3D.getChildByName("yy"),this._role=this.mySprite3D.getChildByName("role"),this._gfx=this._role.getChildByName("GFX"),this._unitAnimator=this._gfx.addComponent(UnitAnimator),this._character=this.mySprite3D.addComponent(WmyPhysicsWorld_Character)},i.prototype.onKeyDown=function(t){var i=t.keyCode;this.keyArr[i]||(32==i&&(this._isLock||this.onJump()),74==i&&this.onPunch()),this.keyArr[i]||(this.keyArr[i]=!0)},i.prototype.onKeyUp=function(t){var i=t.keyCode;this.keyArr[i]&&(this.keyArr[i]=!1)},i.prototype.onJump=function(){var t=this;this._character.isGrounded&&(this._punchId=1,this._character.character.jump(),this._jumpDown=!1,this._unitAnimator.onAnimator("Jump1"),Laya.timer.once(500,this,function(){t._jumpDown=!0}))},i.prototype.onPunch=function(){var t=this;if(!this._isAct&&this._character.isGrounded){this._isAct=!0,this._isLock=!0,Laya.timer.clear(this,this.onPunchInit);var i=220;2==this._punchId&&(i=380),3==this._punchId&&(i=440),this._unitAnimator.onAnimator("Punch"+this._punchId,!0),this._punchId+=1,this._punchId>3&&(this._punchId=1),Laya.timer.once(i-40,this,function(){t._isAct=!1,t._isLock=!1,Laya.timer.once(500,t,t.onPunchInit)})}},i.prototype.onPunchInit=function(){this._punchId=1},i.prototype.onPreRender=function(){if(null!=this._yy){var t=this._yy.transform.position;t.y=.02,this._yy.transform.position=t}this._character.isL=Laya.KeyBoardManager.hasKeyDown(65),this._character.isR=Laya.KeyBoardManager.hasKeyDown(68),this._character.isU=Laya.KeyBoardManager.hasKeyDown(87),this._character.isD=Laya.KeyBoardManager.hasKeyDown(83),this._isLock&&(this._character.isL=!1,this._character.isR=!1,this._character.isU=!1,this._character.isD=!1),this._character.isL?this.onTweenMaxRotation(-1):this._character.isR&&this.onTweenMaxRotation(1),this._character.isGrounded?this._isAct||(this._character.isU||this._character.isD||this._character.isL||this._character.isR?this._unitAnimator.onAnimator("Walk"):this._unitAnimator.onAnimator("Idle")):this._jumpDown&&(this._unitAnimator.onAnimator("Jump2"),this._jumpDown=!1)},i.prototype.onTweenMaxRotation=function(t){var i=this;if(void 0===t&&(t=1),null!=this._role&&this._dir!=t){var r=1==t?0:-180;this._rY=this._role.transform.localRotationEulerY,TweenMax.to(this,.25,{_rY:r,onUpdate:function(){i._role.transform.localRotationEulerY=i._rY}})}},i}(Laya.Script);