var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])};return function(e,i){function r(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(r.prototype=i.prototype,new r)}}(),WmyPhysicsWorld_Character=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.moveSpeed=.03,e.jumpSpeed=6,e.isU=!1,e.isD=!1,e.isL=!1,e.isR=!1,e.isLockMove=!1,e}return __extends(e,t),Object.defineProperty(e.prototype,"isGrounded",{get:function(){return null!=this.character&&this.character.isGrounded},enumerable:!0,configurable:!0}),e.prototype.onAwake=function(){this.mySprite3D=this.owner,this.scene3D=this.mySprite3D.scene;var t=this.mySprite3D.getComponent(Laya.PhysicsCollider);t.enabled=!1;var e=t.colliderShape;this.character=this.mySprite3D.addComponent(Laya.CharacterController);var i=new Laya.CapsuleColliderShape(e.radius,e.length,e.orientation);i.localOffset=e.localOffset,this.character.colliderShape=i,this.character.jumpSpeed=this.jumpSpeed,this.character.gravity=new Laya.Vector3(0,-14,0),this.character._updatePhysicsTransform()},e.prototype.onUpdate=function(){var t=this.moveSpeed,e=new Laya.Vector3,i=this.character.isGrounded;this.isLockMove||(this.isU&&this.isD||i&&(this.isU?e.z=-t:this.isD&&(e.z=t)),this.isL&&this.isR||(this.isL?e.x=-t:this.isR&&(e.x=t)),this.character.move(e))},e.prototype.move=function(t,e){var i=this;void 0===e&&(e=0),this.isLockMove=!0,this.character.move(t),Laya.timer.once(1e3*e,this,function(){i.isLockMove=!1})},e}(Laya.Script);