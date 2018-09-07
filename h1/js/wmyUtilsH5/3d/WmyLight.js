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
var WmyLight = /** @class */ (function (_super) {
    __extends(WmyLight, _super);
    function WmyLight() {
        var _this = _super.call(this) || this;
        if (WmyLight._this == null) {
            WmyLight._this = _this;
        }
        return _this;
    }
    Object.defineProperty(WmyLight, "getThis", {
        get: function () {
            return WmyLight._this;
        },
        enumerable: true,
        configurable: true
    });
    WmyLight.prototype.onAwake = function () {
        this.light = this.owner;
        this._lightBox = this.light.parent;
        this._lightBoxTemp = new Laya.Sprite3D();
        this._lightBoxTemp.transform.localRotationEuler = this._lightBox.transform.localRotationEuler;
        this.scene3D = this.light.scene;
        WmyUtils3D.onShadow(this.light, 2000);
    };
    WmyLight.prototype.onUpdate = function () {
        this._lightBoxTemp.transform.localRotationEuler = this._lightBox.transform.localRotationEuler;
        if (WmyLight.dirX != null) {
            this._lightBoxTemp.transform.localRotationEulerX = WmyLight.dirX;
        }
        if (WmyLight.dirY != null) {
            this._lightBoxTemp.transform.localRotationEulerY = -WmyLight.dirY;
        }
        this._lightBox.transform.localRotationEuler = this._lightBoxTemp.transform.localRotationEuler;
    };
    return WmyLight;
}(Laya.Script));
//# sourceMappingURL=WmyLight.js.map