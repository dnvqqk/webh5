var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//角色控制
var PlayerKz = /** @class */ (function (_super) {
    __extends(PlayerKz, _super);
    function PlayerKz() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isLock = false;
        /**键盘按下处理*/
        _this.keyArr = {};
        _this._jumpDown = false;
        _this._punchId = 1;
        _this._isAct = false;
        _this._dir = 0;
        return _this;
    }
    PlayerKz.prototype.onAwake = function () {
        this.mySprite3D = this.owner;
        this.scene3D = this.mySprite3D.scene;
        this._yy = this.mySprite3D.getChildByName("yy");
        this._role = this.mySprite3D.getChildByName("role");
        this._gfx = this._role.getChildByName("GFX");
        this._unitAnimator = this._gfx.addComponent(UnitAnimator);
        this._character = this.mySprite3D.addComponent(WmyPhysicsWorld_Character);
    };
    PlayerKz.prototype.onKeyDown = function (e) {
        var keyCode = e["keyCode"];
        if (!this.keyArr[keyCode]) {
            if (keyCode == 32) {
                if (!this._isLock) {
                    this.onJump();
                }
            }
            if (keyCode == 74) {
                this.onPunch();
            }
            if (keyCode == 75) {
            }
        }
        if (!this.keyArr[keyCode]) {
            this.keyArr[keyCode] = true;
        }
    };
    /**键盘抬起处理*/
    PlayerKz.prototype.onKeyUp = function (e) {
        var keyCode = e["keyCode"];
        if (this.keyArr[keyCode]) {
            this.keyArr[keyCode] = false;
        }
    };
    PlayerKz.prototype.onJump = function () {
        var _this = this;
        var isGrounded = this._character.isGrounded;
        if (isGrounded) {
            this._punchId = 1;
            this._character.character.jump();
            this._jumpDown = false;
            this._unitAnimator.onAnimator("Jump1");
            Laya.timer.once(500, this, function () {
                _this._jumpDown = true;
            });
        }
    };
    PlayerKz.prototype.onPunch = function () {
        var _this = this;
        if (!this._isAct) {
            if (this._character.isGrounded) {
                this._isAct = true;
                this._isLock = true;
                Laya.timer.clear(this, this.onPunchInit);
                var pupunchT = 220;
                if (this._punchId == 2) {
                    pupunchT = 380;
                }
                if (this._punchId == 3) {
                    pupunchT = 440;
                }
                this._unitAnimator.onAnimator("Punch" + this._punchId, true);
                this._punchId += 1;
                if (this._punchId > 3)
                    this._punchId = 1;
                Laya.timer.once(pupunchT - 40, this, function () {
                    _this._isAct = false;
                    _this._isLock = false;
                    Laya.timer.once(500, _this, _this.onPunchInit);
                });
            }
        }
    };
    // __actOK(o){
    //     Laya.timer.once(100,this,()=>{
    //         this._isAct=false;
    //         this._isLock=false;
    //     })
    //     Laya.timer.once(300,this,this.onPunchInit)
    // }
    PlayerKz.prototype.onPunchInit = function () {
        this._punchId = 1;
    };
    PlayerKz.prototype.onPreRender = function () {
        if (this._yy != null) {
            var yyPos = this._yy.transform.position;
            yyPos.y = 0.02;
            this._yy.transform.position = yyPos;
        }
        this._character.isL = Laya.KeyBoardManager.hasKeyDown(65);
        this._character.isR = Laya.KeyBoardManager.hasKeyDown(68);
        this._character.isU = Laya.KeyBoardManager.hasKeyDown(87);
        this._character.isD = Laya.KeyBoardManager.hasKeyDown(83);
        if (this._isLock) {
            this._character.isL = false;
            this._character.isR = false;
            this._character.isU = false;
            this._character.isD = false;
        }
        if (this._character.isL) {
            this.onTweenMaxRotation(-1);
        }
        else if (this._character.isR) {
            this.onTweenMaxRotation(1);
        }
        if (this._character.isGrounded) {
            if (!this._isAct) {
                if (this._character.isU || this._character.isD || this._character.isL || this._character.isR) {
                    this._unitAnimator.onAnimator("Walk");
                }
                else {
                    this._unitAnimator.onAnimator("Idle");
                }
            }
        }
        else {
            if (this._jumpDown) {
                this._unitAnimator.onAnimator("Jump2");
                this._jumpDown = false;
            }
        }
    };
    PlayerKz.prototype.onTweenMaxRotation = function (dir) {
        var _this = this;
        if (dir === void 0) { dir = 1; }
        if (this._role == null)
            return;
        if (this._dir == dir)
            return;
        var r = dir == 1 ? 0 : -180;
        this["_rY"] = this._role.transform.localRotationEulerY;
        TweenMax.to(this, 0.25, { _rY: r, onUpdate: function () {
                _this._role.transform.localRotationEulerY = _this["_rY"];
            } });
    };
    return PlayerKz;
}(Laya.Script));
//# sourceMappingURL=PlayerKz.js.map