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
var Wmy_UiObj = /** @class */ (function (_super) {
    __extends(Wmy_UiObj, _super);
    function Wmy_UiObj() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Wmy_UiObj.prototype.dispose = function () {
        this.off(Laya.Event.DISPLAY, this, this.onShow);
        this.off(Laya.Event.UNDISPLAY, this, this.onHide);
        _super.prototype.dispose.call(this);
    };
    Wmy_UiObj.prototype.constructFromXML = function (xml) {
        _super.prototype.constructFromXML.call(this, xml);
        this.on(Laya.Event.DISPLAY, this, this.onShow);
        this.on(Laya.Event.UNDISPLAY, this, this.onHide);
        this.onInit();
    };
    Wmy_UiObj.prototype.onInit = function () {
    };
    Wmy_UiObj.prototype.onShow = function () {
    };
    Wmy_UiObj.prototype.onHide = function () {
    };
    return Wmy_UiObj;
}(fairygui.GComponent));
//# sourceMappingURL=Wmy_UiObj.js.map