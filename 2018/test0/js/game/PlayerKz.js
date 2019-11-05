var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//主角控制
var PlayerKz = (function (_super) {
    __extends(PlayerKz, _super);
    function PlayerKz() {
        _super.apply(this, arguments);
        /*
        "Idle",
        "Walk",
        "Jump1",
        "Jump2",
        "Punch1",
        "Punch2",
        "Punch3",
        JumpKick,
        */
        this._isLock = false;
        /**键盘按下处理*/
        this.keyArr = {};
        this._jumpDown = false;
        this._isCarom = false;
        this._punchId = 1;
        this._isAct = false;
        //是否降落
        this._jlNum = 0;
        this._isLd = false;
    }
    PlayerKz.prototype.onInit = function () {
        this._hit.on(GameHit.Event_hit, this, this.oEvent_hit);
        var walk = this._animator.controllerLaye._statesMap["Walk"];
        walk.speed = 1.2;
        var Punch1 = this._animator.controllerLaye._statesMap["Punch1"];
        Punch1.speed = 1.3;
        var Punch2 = this._animator.controllerLaye._statesMap["Punch2"];
        Punch2.speed = 1.2;
        var Punch3 = this._animator.controllerLaye._statesMap["Punch3"];
        Punch3.speed = 1;
        var JumpKick = this._animator.controllerLaye._statesMap["JumpKick"];
        JumpKick.speed = 1.3;
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
            this._animator.onAnimator("Jump1");
            WmyUtils.playFuiSound("ui://audio/PlayerJump");
            Laya.timer.once(550, this, function () {
                _this._jumpDown = true;
            });
            this.onAddEffect(this._DustEffectJump, this._yy.transform.position.clone());
        }
    };
    PlayerKz.prototype.onPunch = function () {
        var _this = this;
        if (!this._isAct || this._isCarom) {
            if (this._character.isGrounded) {
                WmyUtils.playFuiSound("ui://audio/Whoosh");
                if (this["caromFun"] == null) {
                    this["caromFun"] = function () {
                        _this._isCarom = false;
                        _this._punchId = 1;
                    };
                }
                else {
                    Laya.timer.clear(this, this["caromFun"]);
                }
                if (!this._isAct && !this._isCarom) {
                    this._punchId = 1;
                }
                this._isAct = true;
                this._isLock = true;
                this._isCarom = false;
                if (this._hitBox != null) {
                    this._hitBox.active = false;
                }
                var t = 0;
                if (this._punchId == 2) {
                    t = 30;
                }
                if (this._punchId == 3) {
                    t = 40;
                }
                this._animator.onAnimator("Punch" + this._punchId, true, t, Laya.Handler.create(this, function () {
                    _this._isAct = false;
                    _this._isLock = false;
                    var t = 50;
                    if (_this._punchId == 2) {
                        t = 120;
                    }
                    if (_this._punchId == 3) {
                        t = 150;
                    }
                    Laya.timer.once(t, _this, _this["caromFun"]);
                }));
            }
            else {
                if (this._animator.aniName == "Jump1") {
                    WmyUtils.playFuiSound("ui://audio/Whoosh");
                    this._isAct = true;
                    this._animator.onAnimator("JumpKick");
                    Laya.timer.once(420, this, function () {
                        _this._isAct = false;
                    });
                }
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
    PlayerKz.prototype.onEvent_playEvent = function (aniName, eve) {
        if (eve["eventName"] == "carom") {
            if (eve["params"][1] == 1) {
                this._isCarom = true;
                if (aniName == "Punch1") {
                    this._punchId = 2;
                }
                else if (aniName == "Punch2") {
                    this._punchId = 3;
                }
            }
        }
    };
    PlayerKz.prototype.oEvent_hit = function (roleKz) {
        var moveX = 0.01;
        if (this._animator.aniName == "Punch2") {
            moveX = 0.02;
        }
        else if (this._animator.aniName == "Punch3") {
            moveX = 0.02;
        }
        else if (this._animator.aniName == "JumpKick") {
            moveX = 0.03;
        }
        roleKz.onHit(this, moveX);
    };
    PlayerKz.prototype.onPreRender = function () {
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
        if (!this._character.isGrounded) {
            if (this._jumpDown && !this._isAct) {
                this._animator.onAnimator("Jump2");
                this._jumpDown = false;
            }
            if (this.mySprite3D.transform.localPositionY < this._jlNum) {
                if (!this._isLd && this.mySprite3D.transform.localPositionY < 0.2) {
                    this._isLd = true;
                    this.onAddEffect(this._DustEffectLand, this._yy.transform.position.clone());
                }
            }
            else {
                if (this.mySprite3D.transform.localPositionY > 0.2) {
                    this._isLd = false;
                }
            }
            this._jlNum = this.mySprite3D.transform.localPositionY;
        }
        else {
            if (!this._isAct) {
                if (this._character.isU || this._character.isD || this._character.isL || this._character.isR) {
                    this._animator.onAnimator("Walk");
                }
                else {
                    this._animator.onAnimator("Idle");
                }
            }
        }
    };
    return PlayerKz;
}(BaseRoleKz));
//# sourceMappingURL=PlayerKz.js.map