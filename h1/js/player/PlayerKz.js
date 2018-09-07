var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//角色控制
var PlayerKz = (function (_super) {
    __extends(PlayerKz, _super);
    function PlayerKz() {
        _super.apply(this, arguments);
        this._aniId = 0;
        this._dir = 0;
    }
    PlayerKz.prototype.onAwake = function () {
        this.mySprite3D = this.owner;
        this.scene3D = this.mySprite3D.scene;
        this._yy = this.mySprite3D.getChildByName("yy");
        this._role = this.mySprite3D.getChildByName("role");
        var GFX = this._role.getChildByName("GFX");
        this._animator = GFX.getComponent(Laya.Animator);
        this._character = this.mySprite3D.addComponent(WmyPhysicsWorld_Character);
    };
    /**键盘按下处理*/
    PlayerKz.prototype.onKeyDown = function (e) {
        var keyCode = e["keyCode"];
        if (keyCode == 32) {
            this._character.onJump(true);
        }
    };
    /**键盘抬起处理*/
    PlayerKz.prototype.onKeyUp = function (e) {
        var keyCode = e["keyCode"];
        if (keyCode == 32) {
            this._character.onJump(false);
        }
    };
    PlayerKz.prototype.onPreRender = function () {
        if (this._yy != null) {
            var yyPos = this._yy.transform.position;
            yyPos.y = 0.02;
            this._yy.transform.position = yyPos;
        }
        this._character.isU = Laya.KeyBoardManager.hasKeyDown(87);
        this._character.isD = Laya.KeyBoardManager.hasKeyDown(83);
        this._character.isL = Laya.KeyBoardManager.hasKeyDown(65);
        this._character.isR = Laya.KeyBoardManager.hasKeyDown(68);
        if (this._character.isL) {
            this.onTweenMaxRotation(-1);
        }
        else if (this._character.isR) {
            this.onTweenMaxRotation(1);
        }
        if (this._character.isU || this._character.isD || this._character.isL || this._character.isR) {
            this.onAnimator(1);
        }
        else {
            this.onAnimator(0);
        }
    };
    PlayerKz.prototype.onAnimator = function (aniId) {
        if (this._animator == null)
            return;
        if (this._aniId == aniId)
            return;
        this._aniId = aniId;
        switch (this._aniId) {
            case 0:
                this._animator.play("Idle");
                break;
            case 1:
                this._animator.play("Walk");
                break;
            default:
                break;
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