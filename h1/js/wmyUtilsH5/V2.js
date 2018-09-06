var V2 = /** @class */ (function () {
    function V2(_x, _y) {
        this.x = 0;
        this.y = 0;
        this.x = _x || 0;
        this.y = _y || 0;
    }
    //插值
    V2.Lerp = function (a, b, t) {
        var v2 = new V2();
        var vx = (b.x - a.x) * t + a.x;
        var vy = (b.y - a.y) * t + a.y;
        v2.x = vx;
        v2.y = vy;
        return v2;
    };
    //距离
    V2.Distance = function (a, b) {
        var dx = Math.abs(a.x - b.x);
        var dy = Math.abs(a.y - b.y);
        var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        d = parseFloat(d.toFixed(2));
        return d;
    };
    //减
    V2.Subtract = function (a, b) {
        var v2 = new V2();
        v2.x = a.x - b.x;
        v2.y = a.y - b.y;
        return v2;
    };
    //加
    V2.Add = function (a, b) {
        var v2 = new V2();
        v2.x = a.x + b.x;
        v2.y = a.y + b.y;
        return v2;
    };
    Object.defineProperty(V2.prototype, "length", {
        get: function () {
            var a = Math.pow(this.x * this.x + this.y * this.y, 0.5);
            return parseInt(a + "");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(V2.prototype, "normalized", {
        get: function () {
            var length = this.length;
            var v2 = new V2();
            v2.x = this.x / length;
            v2.y = this.y / length;
            return v2;
        },
        enumerable: true,
        configurable: true
    });
    return V2;
}());
//# sourceMappingURL=V2.js.map