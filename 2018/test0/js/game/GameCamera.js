var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameCamera = (function (_super) {
    __extends(GameCamera, _super);
    function GameCamera() {
        _super.call(this);
        if (GameCamera._this == null) {
            GameCamera._this = this;
        }
    }
    Object.defineProperty(GameCamera, "getThis", {
        get: function () {
            return GameCamera._this;
        },
        enumerable: true,
        configurable: true
    });
    GameCamera.prototype.onAwake = function () {
        this.cam = this.owner;
        this.camBox = this.cam.parent;
        this.scene3D = this.cam.scene;
        this._camPos = this.cam.transform.position;
    };
    GameCamera.prototype.onSetTarget = function (targes) {
        TweenMax.killTweensOf(this);
        this._target = targes;
    };
    GameCamera.prototype.onUpdate = function () {
        if (this._target == null)
            return;
        var pos = this._camPos.clone();
        var targetPos = this._target.transform.position;
        pos.x = targetPos.x;
        if (pos.x < -11.5) {
            pos.x = -11.5;
        }
        if (pos.x > 15) {
            pos.x = 15;
        }
        pos.y = targetPos.y + 2.5;
        this.onTweenMaxPos(pos);
    };
    GameCamera.prototype.onTweenMaxPos = function (pos) {
        var _this = this;
        var tpos = this.camBox.transform.position;
        this["tposX"] = tpos.x;
        this["tposY"] = tpos.y;
        this["tposZ"] = tpos.z;
        TweenMax.to(this, 1, { tposX: pos.x, tposY: pos.y, tposZ: pos.z, onUpdate: function () {
                tpos.x = _this["tposX"];
                tpos.y = _this["tposY"];
                tpos.z = _this["tposZ"];
                _this.camBox.transform.position = tpos;
            } });
    };
    return GameCamera;
}(Laya.Script));
//# sourceMappingURL=GameCamera.js.map