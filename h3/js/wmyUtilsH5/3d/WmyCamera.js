var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,s){t.__proto__=s}||function(t,s){for(var e in s)s.hasOwnProperty(e)&&(t[e]=s[e])};return function(s,e){function i(){this.constructor=s}t(s,e),s.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}}(),WmyCamera=function(t){function s(){var e=t.call(this)||this;return e._upNum=0,e._distance=0,e._angleNum=0,e._dx=0,e._dy=0,e.lastMouseX=0,e.lastMouseY=0,e._isMouseDown=!1,e._lastDistance=0,e._lastX=0,e._lastZ=0,e._touchesNum=0,e._v3=Laya.Vector3.ZERO,e._rotaionSpeed=.01,null==s._this&&(s._this=e),e}return __extends(s,t),Object.defineProperty(s,"getThis",{get:function(){return s._this},enumerable:!0,configurable:!0}),s.prototype.onAwake=function(){this.cam=this.owner,this.scene3D=this.cam.scene,this._camBox=this.cam.parent,this._upNum=this.cam.transform.localPositionY,this._distance=this.cam.transform.localPositionZ},s.prototype.onAddEvent=function(t){this._target=t||Laya.stage,this._target.on(Laya.Event.MOUSE_DOWN,this,this.stageMouseDown),this._target.on(Laya.Event.MOUSE_UP,this,this.stageMouseUp),this._target.on(Laya.Event.MOUSE_OUT,this,this.stageMouseUp),this._target.on(Laya.Event.MOUSE_MOVE,this,this.stageMouseMove),this._target.on(Laya.Event.MOUSE_WHEEL,this,this.stageMouseWheel)},s.prototype.onSetTarget=function(t){TweenMax.killTweensOf(this),null!=t&&(this._camBox.transform.position=t)},s.prototype.onSetInfo=function(t,s,e,i,a,o){TweenMax.killTweensOf(this),this._upNum=t||this.cam.transform.localPositionY,this._upNum1=i,this._upNum2=a,this._distance=s||this.cam.transform.localPositionZ,this._angleNum=e||this._angleNum,this._dx=this.lastMouseX=0,this._dy=this.lastMouseY=0,null!=o&&(this._offXZ=Laya.Vector4.ZERO,this._offXZ.x=this._camBox.transform.position.x-Math.abs(o),this._offXZ.y=this._camBox.transform.position.x+Math.abs(o),this._offXZ.z=this._camBox.transform.position.z-Math.abs(o),this._offXZ.w=this._camBox.transform.position.z+Math.abs(o))},s.prototype.stageMouseDown=function(t){var s=t.touches;s&&(this._touchesNum=s.length),t.currentTarget==this._target&&(this._isMouseDown=!0,TweenMax.killTweensOf(this),s&&2==s.length?(this._lastDistance=this.getDistance(s),this._lastX=s[0].stageX,this._lastZ=s[0].stageY):s&&1==s.length?(this._dx=this.lastMouseX=s[0].stageX,this._dy=this.lastMouseY=s[0].stageY):null==s&&(this._dx=this.lastMouseX=Laya.stage.mouseX,this._dy=this.lastMouseY=Laya.stage.mouseY))},s.prototype.stageMouseUp=function(t){var s=t.touches;s&&(this._touchesNum=s.length),t.currentTarget==this._target&&(s&&1==s.length?(this._dx=this.lastMouseX=s[0].stageX,this._dy=this.lastMouseY=s[0].stageY):null!=s&&0!=s.length||(this._isMouseDown=!1))},s.prototype.stageMouseMove=function(t){var s=t.touches;if(s&&(this._touchesNum=s.length),t.currentTarget==this._target&&this._isMouseDown)if(s&&2==s.length){var e=this.getDistance(t.touches);this.cam.fieldOfView-=.05*(e-this._lastDistance),this.cam.fieldOfView<40&&(this.cam.fieldOfView=40),this.cam.fieldOfView>70&&(this.cam.fieldOfView=70),this._lastDistance=e;var i=V2.Distance(new V2(s[0].stageX,s[0].stageY),new V2(this._lastX,this._lastZ));if(i>3){var a=s[0].stageX-this._lastX,o=s[0].stageY-this._lastZ,h=180*Math.atan2(a,o)/Math.PI,n=Math.PI/180*(this._angleNum+h),u=Math.sin(n)*i*.04,r=Math.cos(n)*i*.04;this._camBox.transform.translate(new Laya.Vector3(u,0,r),!1)}this._lastX=s[0].stageX,this._lastZ=s[0].stageY}else s&&1==s.length?(this.lastMouseX=s[0].stageX,this.lastMouseY=s[0].stageY,TweenMax.to(this,1.5,{_dx:this.lastMouseX,_dy:this.lastMouseY})):null==s&&(this.lastMouseX=Laya.stage.mouseX,this.lastMouseY=Laya.stage.mouseY,TweenMax.to(this,1.5,{_dx:this.lastMouseX,_dy:this.lastMouseY}))},s.prototype.stageMouseWheel=function(t){this.cam.fieldOfView-=1*t.delta,this.cam.fieldOfView<40&&(this.cam.fieldOfView=40),this.cam.fieldOfView>70&&(this.cam.fieldOfView=70)},s.prototype.onUpdate=function(){if(this._touchesNum<=1){var t=Math.abs(this.lastMouseX)-Math.abs(this._dx),s=Math.abs(this.lastMouseY)-Math.abs(this._dy),e=t*this._rotaionSpeed,i=s*this._rotaionSpeed*.4;this._angleNum-=e,this._upNum+=i,null!=this._upNum1&&this._upNum<this._upNum1&&(this._upNum=this._upNum1),null!=this._upNum2&&this._upNum>this._upNum2&&(this._upNum=this._upNum2),this._v3.y=this._upNum,this._v3.x=Math.sin(this._angleNum*Math.PI/180)*this._distance,this._v3.z=Math.cos(this._angleNum*Math.PI/180)*this._distance,this.cam.transform.localPosition=this._v3,this.cam.transform.lookAt(this._camBox.transform.position,Laya.Vector3.UnitY)}if(null!=this._offXZ){var a=this._camBox.transform.position;a.x<this._offXZ.x?a.x=this._offXZ.x:a.x>this._offXZ.y&&(a.x=this._offXZ.y),a.z<this._offXZ.z?a.z=this._offXZ.z:a.z>this._offXZ.w&&(a.z=this._offXZ.w),this._camBox.transform.position=a}},s.prototype.getDistance=function(t){var s=0;if(t&&2==t.length){var e=t[0].stageX-t[1].stageX,i=t[0].stageY-t[1].stageY;s=Math.sqrt(e*e+i*i)}return s},s.prototype.onStageMouseDown=function(t){var s=this.get3dClick();s.length>0&&(this._clickObj=s[0].collider.owner)},s.prototype.onStageMouseUp=function(t){var s=this.get3dClick();s.length>0&&(s[0].collider.owner,this._clickObj),this._clickObj=null},s.prototype.get3dClick=function(t,s){var e=new Laya.Ray(new Laya.Vector3(0,0,0),new Laya.Vector3(0,0,0)),i=new Laya.Vector2,a=new Array;return i.elements[0]=Laya.MouseManager.instance.mouseX,i.elements[1]=Laya.MouseManager.instance.mouseY,this.cam.viewportPointToRay(i,e),null!=this.scene3D.physicsSimulation&&this.scene3D.physicsSimulation.rayCastAll(e,a,1e4,t,s),a},s}(Laya.Script);