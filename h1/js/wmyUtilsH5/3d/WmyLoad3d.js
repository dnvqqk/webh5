var WmyLoad3d = /** @class */ (function () {
    function WmyLoad3d() {
        this._meshArr = [];
        this._meshOk = false;
        this._meshNum = 0;
        this._meshP = 0;
        this._meshP2 = 0;
        this._matArr = [];
        this._matOk = false;
        this._matNum = 0;
        this._matP = 0;
        this._matP2 = 0;
    }
    Object.defineProperty(WmyLoad3d, "getThis", {
        get: function () {
            if (WmyLoad3d._this == null) {
                WmyLoad3d._this = new WmyLoad3d();
            }
            return WmyLoad3d._this;
        },
        enumerable: true,
        configurable: true
    });
    WmyLoad3d.prototype.onload3d = function (urlList, callbackOk, callbackProgress) {
        this._urlList = [];
        this._callbackOk = callbackOk;
        this._callbackProgress = callbackProgress;
        for (var i = 0; i < urlList.length; i++) {
            var obj = urlList[i];
            var obj1 = {};
            obj1.url = obj["url"];
            this._urlList.push(obj1);
            obj["url"] += "wmy";
            urlList[i] = obj;
        }
        Laya.loader.load(urlList, Laya.Handler.create(this, this.__onlsUrlArrOk, [urlList]));
    };
    WmyLoad3d.prototype.__onlsUrlArrOk = function (lsUrlArr) {
        for (var i = 0; i < lsUrlArr.length; i++) {
            var obj = lsUrlArr[i];
            var url = obj["url"];
            var s0 = url.split("/");
            var s1 = url.replace(s0[s0.length - 1], "");
            var rootUrl = s1;
            var txt = Laya.loader.getRes(url);
            var jsObj = JSON.parse(txt);
            this.__tiQuUrl(jsObj["data"], rootUrl);
        }
        for (var i = 0; i < this._meshArr.length; i++) {
            url = Wmy_Load_Mag.assetUrl + this._meshArr[i] + Wmy_Load_Mag.V;
            Laya.loader.create(url, Laya.Handler.create(this, this.__onMeshArrOk), Laya.Handler.create(this, this.__onMeshArrP));
        }
        for (var i = 0; i < this._matArr.length; i++) {
            url = Wmy_Load_Mag.assetUrl + this._matArr[i] + Wmy_Load_Mag.V;
            Laya.loader.create(url, Laya.Handler.create(this, this.__onMatArrOk), Laya.Handler.create(this, this.__onMatArrP));
        }
    };
    WmyLoad3d.prototype.__onMeshArrP = function (p) {
        var pNum = p * (this._meshNum + 1);
        if (pNum > this._meshP)
            this._meshP = pNum;
        this._meshP2 = (this._meshP / this._meshArr.length);
        this.__onLoadP();
    };
    WmyLoad3d.prototype.__onMeshArrOk = function () {
        this._meshNum += 1;
        if (this._meshNum >= this._meshArr.length) {
            this._meshOk = true;
            this.__onLoadOK();
        }
    };
    WmyLoad3d.prototype.__onMatArrP = function (p) {
        var pNum = p * (this._matNum + 1);
        if (pNum > this._matP)
            this._matP = pNum;
        this._matP2 = (this._matP / this._matArr.length);
        this.__onLoadP();
    };
    WmyLoad3d.prototype.__onMatArrOk = function () {
        this._matNum += 1;
        if (this._matNum >= this._matArr.length) {
            this._matOk = true;
            this.__onLoadOK();
        }
    };
    WmyLoad3d.prototype.__onLoadP = function () {
        var pNum = (this._meshP2 + this._matP2) / 2 * 0.92;
        if (this._callbackProgress != null) {
            this._callbackProgress.runWith([pNum]);
        }
    };
    WmyLoad3d.prototype.__onLoadOK = function () {
        var _this = this;
        if (this._meshOk && this._matOk) {
            Laya.loader.create(this._urlList, Laya.Handler.create(this, function () {
                if (_this._callbackOk != null) {
                    _this._callbackOk.run();
                }
            }));
        }
    };
    WmyLoad3d.prototype.__tiQuUrl = function (obj, url) {
        if (url === void 0) { url = ""; }
        if (obj["props"] != null && obj["props"]["meshPath"] != null) {
            var meshPath = url + obj["props"]["meshPath"];
            if (this._meshArr.indexOf(meshPath) < 0) {
                this._meshArr.push(meshPath);
            }
            var materials = obj["props"]["materials"];
            if (materials != null) {
                for (var ii = 0; ii < materials.length; ii++) {
                    var path = url + materials[ii]["path"];
                    if (this._matArr.indexOf(path) < 0) {
                        this._matArr.push(path);
                    }
                }
            }
        }
        var child = obj["child"];
        if (child != null && child.length > 0) {
            for (var i = 0; i < child.length; i++) {
                this.__tiQuUrl(child[i], url);
            }
        }
    };
    return WmyLoad3d;
}());
//# sourceMappingURL=WmyLoad3d.js.map