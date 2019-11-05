var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//敌人控制
var EnemyKz = (function (_super) {
    __extends(EnemyKz, _super);
    function EnemyKz() {
        _super.apply(this, arguments);
        this._hitAinNameId = 0;
    }
    EnemyKz.prototype.onInit = function () {
        this.onTweenMaxRotation(-1);
    };
    EnemyKz.prototype.onHitAim = function (hitTargetObj) {
        var _this = this;
        this._hitAinNameId += 1;
        if (this._hitAinNameId < 1)
            this._hitAinNameId = 1;
        if (this._hitAinNameId > 2)
            this._hitAinNameId = 1;
        var hitName = "Enemy1_Hit" + this._hitAinNameId;
        this._animator.onAnimator(hitName, false, 0, Laya.Handler.create(this, function () {
            _this._animator.onAnimator("Enemy_Idle");
        }));
        WmyUtils.playFuiSound("ui://audio/PunchHit1");
    };
    return EnemyKz;
}(BaseRoleKz));
//# sourceMappingURL=EnemyKz.js.map