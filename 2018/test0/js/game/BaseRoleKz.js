var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//角色控制
var BaseRoleKz = (function (_super) {
    __extends(BaseRoleKz, _super);
    function BaseRoleKz() {
        _super.apply(this, arguments);
        this._dir = 1;
    }
    Object.defineProperty(BaseRoleKz.prototype, "animator", {
        get: function () {
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    BaseRoleKz.prototype.onAwake = function () {
        this.mySprite3D = this.owner;
        this.scene3D = this.mySprite3D.scene;
        this._hitBox = this.mySprite3D.getChildByName("hitBox");
        if (this._hitBox != null) {
            this._hit = this._hitBox.getChildByName("hit");
            this._hit.addComponent(GameHit);
        }
        this._roleBox = this.mySprite3D.getChildByName("roleBox");
        this._gfx = this._roleBox.getChildByName("GFX");
        this._animator = this._gfx.addComponent(WmyAnimator3d);
        this._gfx.on(WmyAnimator3d.Event_playEvent, this, this.__onEvent_playEvent);
        this._character = this.mySprite3D.addComponent(WmyPhysicsWorld_Character);
        var yy = WmyUtils3D.getObj3d(this.scene3D, "yy");
        this._yy = Laya.Sprite3D.instantiate(yy, this.scene3D, true, this.mySprite3D.transform.position);
        this._HitEffect = WmyUtils3D.getObj3d(this.scene3D, "HitEffect");
        this._HitEffect.active = false;
        this._DustEffectJump = WmyUtils3D.getObj3d(this.scene3D, "DustEffectJump");
        this._DustEffectJump.active = false;
        this._DustEffectLand = WmyUtils3D.getObj3d(this.scene3D, "DustEffectLand");
        this._DustEffectLand.active = false;
        this.onInit();
    };
    BaseRoleKz.prototype.onInit = function () {
    };
    BaseRoleKz.prototype.__onEvent_playEvent = function (aniName, eve) {
        if (eve != null) {
            if (eve["eventName"] == "hit") {
                if (eve["params"][1] == 1) {
                    if (this._hitBox != null) {
                        this._hitBox.active = true;
                    }
                }
                else {
                    if (this._hitBox != null) {
                        this._hitBox.active = false;
                    }
                }
            }
            this.onEvent_playEvent(aniName, eve);
        }
    };
    BaseRoleKz.prototype.onEvent_playEvent = function (aniName, eve) {
    };
    BaseRoleKz.prototype.onUpdate = function () {
        if (this._yy != null) {
            var yyPos = this.mySprite3D.transform.position;
            yyPos.y = 0.01;
            this._yy.transform.position = yyPos;
        }
    };
    Object.defineProperty(BaseRoleKz.prototype, "dir", {
        get: function () {
            return this._dir;
        },
        enumerable: true,
        configurable: true
    });
    BaseRoleKz.prototype.onTweenMaxRotation = function (dir, time) {
        var _this = this;
        if (dir === void 0) { dir = 1; }
        if (time === void 0) { time = 0.25; }
        if (this._roleBox == null)
            return;
        if (this._dir == dir)
            return;
        this._dir = dir;
        var r = dir == 1 ? 0 : -180;
        this["_rY"] = this._roleBox.transform.localRotationEulerY;
        TweenMax.to(this, time, { _rY: r, onUpdate: function () {
                _this._roleBox.transform.localRotationEulerY = _this["_rY"];
            } });
        if (this._hitBox != null) {
            this._hitBox.transform.localScaleX = dir;
        }
    };
    BaseRoleKz.prototype.onHit = function (hitTargetObj, moveX) {
        if (moveX === void 0) { moveX = 0.01; }
        var dir = hitTargetObj.dir;
        this.onTweenMaxRotation(dir * -1, 0.2);
        this._character.move(new Laya.Vector3(moveX * dir, 0, 0), 0.1);
        var hitEffectPos = this.mySprite3D.transform.position.clone();
        hitEffectPos.y += 1.5;
        hitEffectPos.z += 0.2;
        this.onAddEffect(this._HitEffect, hitEffectPos, 0.5);
        this.onHitAim(hitTargetObj);
    };
    BaseRoleKz.prototype.onHitAim = function (hitTargetObj) {
    };
    BaseRoleKz.prototype.onAddEffect = function (effectObj, pos, delTime) {
        if (delTime === void 0) { delTime = 1; }
        var effect = Laya.Sprite3D.instantiate(effectObj, this.scene3D);
        effect.transform.position = pos;
        effect.transform.localScaleX = this._dir * -1;
        effect.active = true;
        var lzObjArr = WmyUtils3D.getChildrenComponent(effect, Laya.ShuriKenParticle3D);
        for (var i = 0; i < lzObjArr.length; i++) {
            var lz = lzObjArr[i];
            lz.particleSystem.play();
        }
        Laya.timer.once(delTime * 1000, this, function () {
            effect.destroy(true);
        });
    };
    return BaseRoleKz;
}(Laya.Script));
//# sourceMappingURL=BaseRoleKz.js.map