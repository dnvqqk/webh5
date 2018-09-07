// 程序入口
var WmyLoadJs = (function () {
    function WmyLoadJs() {
        var jsUrl = "../";
        if (document.URL.indexOf("file:///") < 0) {
            jsUrl = "https://dnvqqk.github.io/webh5/";
        }
        var layaJs = '<script src="' + jsUrl + 'libs/layaLibs/laya.core.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.webgl.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.ani.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.d3.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.physics3D.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.html.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/wmyList/fairygui/fairygui.js"></script>' +
            '<script src="' + jsUrl + 'libs/wmyList/greensock/minified/TweenMax.min.js"></script>' +
            "";
        this.writeJs(layaJs);
    }
    WmyLoadJs.prototype.loadJs = function (url) {
        var script = document.createElement("script");
        script.async = false;
        script.src = url;
        document.body.appendChild(script);
    };
    WmyLoadJs.prototype.writeJs = function (txt) {
        document.write(txt);
    };
    return WmyLoadJs;
}());
new WmyLoadJs();
//# sourceMappingURL=WmyLoadJs.js.map
var Wmy_Load_Mag = (function () {
    function Wmy_Load_Mag() {
        this._wetData = {};
        this.resUrl = "";
        this._resDataArr = [];
        this._callbackOk = [];
        this._callbackProgress = [];
    }
    Object.defineProperty(Wmy_Load_Mag, "getThis", {
        get: function () {
            if (Wmy_Load_Mag._this == null) {
                Wmy_Load_Mag._this = new Wmy_Load_Mag();
            }
            return Wmy_Load_Mag._this;
        },
        enumerable: true,
        configurable: true
    });
    Wmy_Load_Mag.prototype.getWetData = function (url) {
        return this._wetData[url];
    };
    Wmy_Load_Mag.prototype.setWetData = function (obj, url) {
        if (this.resUrl == "") {
            this.resUrl = url;
            var arr = null;
            var V = null;
            try {
                arr = JSON.parse(obj);
            }
            catch (error) { }
            try {
                var assetUrl = arr[0]["assetUrl"];
                if (document.URL.indexOf("file:///") >= 0) {
                    assetUrl = "";
                }
                Wmy_Load_Mag.assetUrl = assetUrl;
            }
            catch (error) { }
            try {
                V = arr[0]["V"];
            }
            catch (error) { }
            if (V != null) {
                if (fairygui.UIPackage["wObj"] == null) {
                    fairygui.UIPackage["wObj"] = {};
                }
                if (fairygui.UIPackage["wObj"].V == null || fairygui.UIPackage["wObj"].V == "") {
                    Wmy_Load_Mag.V = V;
                    fairygui.UIPackage["wObj"].V = Wmy_Load_Mag.V;
                }
                else {
                    Wmy_Load_Mag.V = fairygui.UIPackage["wObj"].V;
                }
            }
        }
        if (url == null) {
            url = this.resUrl;
        }
        this._wetData[url] = obj;
    };
    Wmy_Load_Mag.prototype.getResObj = function (resName, url) {
        var webData;
        if (url == null) {
            url = this.resUrl;
        }
        webData = this.getWetData(url);
        if (webData == null) {
            console.log("空数据");
            return null;
        }
        var arr = null;
        if (webData instanceof Array) {
            arr = webData;
        }
        if (arr == null) {
            try {
                arr = JSON.parse(webData);
            }
            catch (error) {
                console.log("加载材料数据错误", webData);
                return null;
            }
        }
        var resObj = null;
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            if (obj["resName"] == resName) {
                resObj = obj;
                break;
            }
        }
        return resObj;
    };
    Wmy_Load_Mag.prototype.onLoadWetData = function (url, callbackOk) {
        if (url == "")
            return;
        if (this.getWetData(url) != null) {
            callbackOk.runWith([this.getWetData(url)]);
            return;
        }
        var load = Laya.loader.load(url, new Laya.Handler(this, function (obj) {
            this.setWetData(obj, url);
            callbackOk.runWith([this._wetData[url]]);
        }));
        return load;
    };
    Wmy_Load_Mag.prototype.onload = function (resObj, callbackOk, callbackProgress) {
        var resName = resObj["resName"];
        if (this._resDataArr[resName] != null) {
            this._resDataArr[resName].runWith([this._resDataArr[resName]]);
        }
        else {
            if (this._callbackOk[resName] != null) {
                this._callbackOk[resName].push(callbackOk);
                if (callbackProgress != null) {
                    this._callbackProgress[resName].push(callbackProgress);
                }
                return;
            }
            this._callbackOk[resName] = [];
            this._callbackOk[resName].push(callbackOk);
            this._callbackProgress[resName] = [];
            if (callbackProgress != null) {
                this._callbackProgress[resName].push(callbackProgress);
            }
            var Resres = resObj["Resres"];
            var data = {};
            var resData = resObj["resData"];
            if (resData != null && resData != "") {
                try {
                    data = JSON.parse(resData);
                }
                catch (error) {
                    console.log("加载材料数据错误", resData);
                }
            }
            var bName;
            var urlArr = [];
            var isCreate = false;
            for (var i = 0; i < Resres.length; i++) {
                var obj = Resres[i];
                var resUrl = obj["resUrl"];
                resUrl = WmyUtils.toCase(resUrl);
                var url = Wmy_Load_Mag.assetUrl + resUrl + Wmy_Load_Mag.V;
                if (resUrl.indexOf(".txt") >= 0) {
                    urlArr.push({ url: url, type: Laya.Loader.BUFFER });
                    bName = resUrl.split(".")[0];
                    bName = Wmy_Load_Mag.assetUrl + bName;
                }
                else if (resUrl.indexOf(".jpg") >= 0 || resUrl.indexOf(".png") >= 0) {
                    urlArr.push({ url: url, type: Laya.Loader.IMAGE });
                }
                else if (resUrl.indexOf(".mp3") >= 0) {
                    urlArr.push({ url: url, type: Laya.Loader.SOUND });
                }
                else {
                    urlArr.push({ url: url });
                }
            }
            Laya.loader.load(urlArr, Laya.Handler.create(this, this.onAssetConmplete, [resName, bName, data]), Laya.Handler.create(this, this.onAssetProgress, [resName], false));
        }
    };
    Wmy_Load_Mag.prototype.onload3d = function (resObj, callbackOk, callbackProgress) {
        var resName = resObj["resName"];
        if (this._resDataArr[resName] != null) {
            this._resDataArr[resName].runWith([this._resDataArr[resName]]);
        }
        else {
            if (this._callbackOk[resName] != null) {
                this._callbackOk[resName].push(callbackOk);
                if (callbackProgress != null) {
                    this._callbackProgress[resName].push(callbackProgress);
                }
                return;
            }
            this._callbackOk[resName] = [];
            this._callbackOk[resName].push(callbackOk);
            this._callbackProgress[resName] = [];
            if (callbackProgress != null) {
                this._callbackProgress[resName].push(callbackProgress);
            }
            var Resres = resObj["Resres"];
            var data = {};
            var resData = resObj["resData"];
            if (resData != null && resData != "") {
                try {
                    data = JSON.parse(resData);
                }
                catch (error) {
                    console.log("加载材料数据错误", resData);
                }
            }
            var bName;
            var urlArr = [];
            var urlList = [];
            for (var i = 0; i < Resres.length; i++) {
                var obj = Resres[i];
                var resUrl = obj["resUrl"];
                var url = Wmy_Load_Mag.assetUrl + resUrl + Wmy_Load_Mag.V;
                if (resUrl.indexOf(".ls") >= 0) {
                    urlArr.push({ url: url });
                    urlList.push(url);
                }
            }
            data.urlList = urlList;
            WmyLoad3d.getThis.onload3d(urlArr, Laya.Handler.create(this, this.onAssetConmplete, [resName, bName, data]), Laya.Handler.create(this, this.onAssetProgress, [resName], false));
        }
    };
    Wmy_Load_Mag.prototype.onAssetProgress = function (resName, progress) {
        var callbackProgressArr = this._callbackProgress[resName];
        for (var i = 0; i < callbackProgressArr.length; i++) {
            var callback = callbackProgressArr[i];
            callback.runWith([progress]);
        }
    };
    Wmy_Load_Mag.prototype.onAssetConmplete = function (resName, bName, data) {
        var callbackOkArr = this._callbackOk[resName];
        if (bName != null) {
            var bao = Laya.loader.getRes(bName + ".txt" + Wmy_Load_Mag.V);
            fairygui.UIPackage.addPackage(bName, bao);
            var bNameArr = bName.split("/");
            data.bName = bNameArr[bNameArr.length - 1];
            this._resDataArr[resName] = data;
        }
        for (var i = 0; i < callbackOkArr.length; i++) {
            var callbackOk = callbackOkArr[i];
            callbackOk.runWith([data]);
        }
        this._callbackOk[resName] = null;
        this._callbackProgress[resName] = null;
    };
    Wmy_Load_Mag.prototype.onAutoLoadAll = function (callbackOk, callbackProgress) {
        var webData = this.getWetData(this.resUrl);
        if (webData == null) {
            console.log("空数据");
            return null;
        }
        var arr = null;
        if (webData instanceof Array) {
            arr = webData;
        }
        if (arr == null) {
            try {
                arr = JSON.parse(webData);
            }
            catch (error) {
                console.log("加载材料数据错误", webData);
                return null;
            }
        }
        this._autoLoadrCallbackOk = callbackOk;
        this._autoLoadrCallbackProgress = callbackProgress;
        this._autoLoadInfoArr = {};
        this._autoLoadInfoArr["num"] = 0;
        this._autoLoadInfoArr["cNum"] = 0;
        this._autoLoadInfoArr["uiArr"] = [];
        this._autoLoadInfoArr["u3dArr"] = [];
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            var resName = obj["resName"];
            var t = obj["type"];
            if (resName == null || resName == "" || t == null || t == "")
                continue;
            this.onAutoLoadObj(t, resName);
        }
    };
    Wmy_Load_Mag.prototype.onAutoLoadObj = function (type, resName) {
        var res = this.getResObj(resName);
        if (res == null)
            return;
        var resId = this._autoLoadInfoArr["num"];
        this._autoLoadInfoArr[resId] = {};
        this._autoLoadInfoArr[resId]["n"] = resName;
        this._autoLoadInfoArr[resId]["t"] = type;
        if (type == "ui") {
            this.onload(res, new Laya.Handler(this, this.onLoadOk, [resId]), new Laya.Handler(this, this.onLoading, [resId]));
            this._autoLoadInfoArr["num"] += 1;
        }
        else if (type == "mats") {
            var Resres = res["Resres"];
            var urlList = [];
            for (var i = 0; i < Resres.length; i++) {
                var obj = Resres[i];
                var resUrl = obj["resUrl"];
                var url = Wmy_Load_Mag.assetUrl + resUrl;
                urlList.push(url);
            }
            WmyLoadMats.getThis.onload3d(urlList, new Laya.Handler(this, this.onLoadOk, [resId]), new Laya.Handler(this, this.onLoading, [resId]));
            this._autoLoadInfoArr["num"] += 1;
        }
        else if (type == "cubeMap") {
            var Resres = res["Resres"];
            for (var i = 0; i < Resres.length; i++) {
                var obj = Resres[i];
                var resUrl = obj["resUrl"];
                var url = Wmy_Load_Mag.assetUrl + resUrl + Wmy_Load_Mag.V;
                Laya.TextureCube.load(url, null);
            }
        }
        else if (type == "u3d") {
            this.onload3d(res, new Laya.Handler(this, this.onLoadOk, [resId]), new Laya.Handler(this, this.onLoading, [resId]));
            this._autoLoadInfoArr["num"] += 1;
        }
    };
    Wmy_Load_Mag.prototype.getCube = function (resName, complete) {
        var res = this.getResObj(resName);
        if (res == null)
            return;
        var Resres = res["Resres"];
        var ResresObj = [];
        for (var i = 0; i < Resres.length; i++) {
            var obj = Resres[i];
            var resUrl = obj["resUrl"];
            var url = Wmy_Load_Mag.assetUrl + resUrl + Wmy_Load_Mag.V;
            Laya.TextureCube.load(url, new Laya.Handler(this, function (cube) {
                ResresObj[i] = cube;
                complete.runWith([cube, i]);
            }));
        }
        return ResresObj;
    };
    Wmy_Load_Mag.prototype.onLoading = function (resId, progress) {
        this._autoLoadInfoArr[resId]["p"] = progress;
        var num = this._autoLoadInfoArr["num"];
        var pNum = 0;
        for (var i = 0; i < num; i++) {
            var p = this._autoLoadInfoArr[i]["p"];
            if (p != null) {
                pNum += p;
            }
        }
        var pC = (pNum / this._autoLoadInfoArr["num"]) * 100;
        if (isNaN(pC))
            pC = 0;
        if (this._autoLoadrCallbackProgress != null) {
            this._autoLoadrCallbackProgress.runWith([pC]);
        }
    };
    Wmy_Load_Mag.prototype.onLoadOk = function (resId, data) {
        this._autoLoadInfoArr["cNum"] += 1;
        if (this._autoLoadInfoArr[resId]["t"] == "ui") {
            this._autoLoadInfoArr["uiArr"].push(data);
        }
        else if (this._autoLoadInfoArr[resId]["t"] == "u3d") {
            this._autoLoadInfoArr["u3dArr"].push(data);
        }
        if (this._autoLoadInfoArr["cNum"] >= this._autoLoadInfoArr["num"]) {
            if (this._autoLoadrCallbackOk != null) {
                this._autoLoadrCallbackOk.runWith([this._autoLoadInfoArr["uiArr"], this._autoLoadInfoArr["u3dArr"]]);
            }
        }
    };
    Wmy_Load_Mag.assetUrl = "";
    Wmy_Load_Mag.V = "";
    return Wmy_Load_Mag;
}());
//# sourceMappingURL=Wmy_Load_Mag.js.map
var V2 = (function () {
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
var ObjectUtils = (function () {
    function ObjectUtils() {
    }
    ObjectUtils.onGetInstanceName = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            var instance = Object.create(window[name].prototype);
            instance.constructor.apply(instance, args);
            return instance;
        }
        catch (error) {
            return null;
        }
    };
    ObjectUtils.onGetInstance = function (obj) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var instance = Object.create(obj["prototype"]);
        instance.constructor.apply(instance, args);
        return instance;
    };
    ObjectUtils.onCreateObject = function (obj, values) {
        var instance = ObjectUtils.onGetInstance(obj);
        for (var key in values) {
            try {
                if (instance["set" + key] != null) {
                    instance["set" + key](values[key]);
                }
            }
            catch (error) {
            }
        }
        return instance;
    };
    return ObjectUtils;
}());
//# sourceMappingURL=ObjectUtils.js.map
var WmyUtils3D = (function () {
    function WmyUtils3D() {
    }
    WmyUtils3D.getObj3d = function (target, objName) {
        if (target == null) {
            return null;
        }
        if (target.name == objName) {
            return target;
        }
        for (var i = 0; i < target._children.length; i++) {
            var o = target._children[i];
            if (o._children.length <= 0) {
                if (o.name == objName) {
                    return o;
                }
            }
            else {
                var tempObj = this.getObj3d(o, objName);
                if (tempObj != null) {
                    return tempObj;
                }
            }
        }
        return null;
    };
    WmyUtils3D.setShaderAll = function (target, matsUrl, shadersUrl) {
        var _this = this;
        var assetUrl = Wmy_Load_Mag.assetUrl;
        var newMatsUrl = assetUrl + matsUrl + "wmyMats.txt";
        Laya.loader.load(newMatsUrl, Laya.Handler.create(this, function (assetUrl, matsUrl, shadersUrl, data) {
            var array = data["mats"];
            for (var i = 0; i < array.length; i++) {
                var obj = array[i];
                if (obj["targetName"] == "")
                    continue;
                var target3D = WmyUtils3D.getObj3d(target, obj["targetName"]);
                if (target3D == null)
                    continue;
                var matUrl = assetUrl + matsUrl + obj["matUrl"] + Wmy_Load_Mag.V;
                var shaderNameUrl = assetUrl + shadersUrl + obj["shaderName"] + ".xml" + Wmy_Load_Mag.V;
                Laya.BaseMaterial.load(matUrl, Laya.Handler.create(_this, function (target3D, shaderNameUrl, m) {
                    WmyShaderMsg.setShader(target3D, m, shaderNameUrl);
                }, [target3D, shaderNameUrl]));
            }
        }, [assetUrl, matsUrl, shadersUrl]), null, Laya.Loader.JSON);
    };
    WmyUtils3D.aniPlay = function (target, targetName, aniName) {
        var target3d = this.getObj3d(target, targetName);
        var target3d_ani = target3d.getComponent(Laya.Animator);
        target3d_ani.play(aniName);
        return target3d_ani;
    };
    WmyUtils3D.onShadow = function (directionLight, shadowResolution, shadowPCFType, shadowDistance, isShadow) {
        if (shadowResolution === void 0) { shadowResolution = 512; }
        if (shadowPCFType === void 0) { shadowPCFType = 1; }
        if (shadowDistance === void 0) { shadowDistance = 100; }
        if (isShadow === void 0) { isShadow = true; }
        //灯光开启阴影
        directionLight.shadow = isShadow;
        //可见阴影距离
        directionLight.shadowDistance = shadowDistance;
        //生成阴影贴图尺寸
        directionLight.shadowResolution = shadowResolution;
        //directionLight.shadowPSSMCount=1;
        //模糊等级,越大越高,更耗性能
        directionLight.shadowPCFType = shadowPCFType;
    };
    WmyUtils3D.onCastShadow = function (target, type, isShadow, isChildren) {
        if (type === void 0) { type = 0; }
        if (isShadow === void 0) { isShadow = true; }
        if (isChildren === void 0) { isChildren = true; }
        if (target instanceof Laya.MeshSprite3D) {
            var ms3D = target;
            if (type == 0) {
                //接收阴影
                ms3D.meshRenderer.receiveShadow = isShadow;
            }
            else if (type == 1) {
                //产生阴影
                ms3D.meshRenderer.castShadow = isShadow;
            }
            else if (type == 2) {
                //接收阴影
                ms3D.meshRenderer.receiveShadow = isShadow;
                //产生阴影
                ms3D.meshRenderer.castShadow = isShadow;
            }
        }
        if (target instanceof Laya.SkinnedMeshSprite3D) {
            var sms3d = target;
            if (type == 0) {
                sms3d.skinnedMeshRenderer.receiveShadow = isShadow;
            }
            else if (type == 1) {
                sms3d.skinnedMeshRenderer.castShadow = isShadow;
            }
        }
        if (isChildren) {
            for (var i = 0; i < target.numChildren; i++) {
                var obj = target.getChildAt(i);
                this.onCastShadow(obj, type, isShadow);
            }
        }
    };
    WmyUtils3D.rgb2hex = function (r, g, b) {
        var _hex = "#" + this.hex(r) + this.hex(g) + this.hex(b);
        return _hex.toUpperCase();
    };
    WmyUtils3D.hex = function (x) {
        x = this.onNumTo(x);
        return ("0" + parseInt(x).toString(16)).slice(-2);
    };
    WmyUtils3D.onNumTo = function (n) {
        if ((n + "").indexOf(".") >= 0) {
            n = parseFloat(n.toFixed(2));
        }
        return n;
    };
    WmyUtils3D.lerpF = function (a, b, s) {
        return (a + (b - a) * s);
    };
    return WmyUtils3D;
}());
//# sourceMappingURL=WmyUtils3D.js.map
var WmyShaderMsg = (function () {
    function WmyShaderMsg() {
    }
    /**
     * @param	target	对象
     * @param	mat	材质
     * @param	shaderUrl	shader的地址
     * @param	isNewMateria	是否新材质
     */
    WmyShaderMsg.setShader = function (target, mat, shaderUrl, isNewMateria, spriteDefines, materialDefines) {
        if (isNewMateria === void 0) { isNewMateria = false; }
        if (spriteDefines === void 0) { spriteDefines = "null"; }
        if (materialDefines === void 0) { materialDefines = "null"; }
        var renderer;
        var sharedMaterial;
        if (target instanceof Laya.SkinnedMeshSprite3D) {
            renderer = target.skinnedMeshRenderer;
            sharedMaterial = renderer.sharedMaterial;
        }
        else {
            renderer = target.meshRenderer;
            sharedMaterial = renderer.sharedMaterial;
        }
        if (isNewMateria) {
            sharedMaterial = sharedMaterial.clone();
            renderer.sharedMaterial = sharedMaterial;
        }
        for (var key in mat) {
            try {
                sharedMaterial[key] = mat[key];
            }
            catch (error) {
            }
        }
        Laya.loader.load(shaderUrl, Laya.Handler.create(this, this.shaderConmplete, [sharedMaterial, spriteDefines, materialDefines]), null, Laya.Loader.XML);
        return sharedMaterial;
    };
    WmyShaderMsg.shaderConmplete = function (sharedMaterial, spriteDefines, materialDefines, data) {
        if (data == null)
            return;
        var xmlNode = data.firstChild;
        var shaderName = this.getAttributesValue(xmlNode, "name");
        var i, o, oName, v0, v1, initV;
        var attributeMap = {};
        var attributeMapNode = this.getNode(xmlNode, "attributeMap");
        var attributeMapArr = this.getNodeArr(attributeMapNode, "data");
        for (i = 0; i < attributeMapArr.length; i++) {
            o = attributeMapArr[i];
            oName = this.getAttributesValue(o, "name");
            v0 = this.getAttributesValue(o, "v0");
            attributeMap[oName] = this.getV(v0, "int");
        }
        var uniformMap = {};
        var uniformMapNode = this.getNode(xmlNode, "uniformMap");
        var uniformMapArr = this.getNodeArr(uniformMapNode, "data");
        for (i = 0; i < uniformMapArr.length; i++) {
            initV = null;
            o = uniformMapArr[i];
            oName = this.getAttributesValue(o, "name");
            v0 = this.getAttributesValue(o, "v0");
            v1 = this.getAttributesValue(o, "v1");
            var vArr = [];
            vArr[0] = this.getV(v0, "int");
            vArr[1] = this.getV(v1, "int");
            uniformMap[oName] = vArr;
            if (sharedMaterial["wmyValues"] != null) {
                if (sharedMaterial["wmyValues"]["cube"] != null) {
                    var cubeName = sharedMaterial["wmyValues"]["cube"];
                    Wmy_Load_Mag.getThis.getCube(cubeName, new Laya.Handler(this, function (cube, i) {
                        if (i == 0) {
                            sharedMaterial._shaderValues.setTexture(Laya.Scene3D.REFLECTIONTEXTURE, cube);
                        }
                    }));
                }
                initV = sharedMaterial["wmyValues"][oName];
            }
            //initV=this.getAttributesValue(o,"initV");
            if (initV != null) {
                initV = initV.split(",");
                if (initV.length == 4) {
                    sharedMaterial._shaderValues.setVector(vArr[0], new Laya.Vector4(parseFloat(initV[0]), parseFloat(initV[1]), parseFloat(initV[2]), parseFloat(initV[3])));
                }
                else if (initV.length == 3) {
                    sharedMaterial._shaderValues.setVector(vArr[0], new Laya.Vector3(parseFloat(initV[0]), parseFloat(initV[1]), parseFloat(initV[2])));
                }
                else if (initV.length == 2) {
                    sharedMaterial._shaderValues.setVector(vArr[0], new Laya.Vector2(parseFloat(initV[0]), parseFloat(initV[1])));
                }
                else if (initV.length == 1) {
                    if (!isNaN(parseFloat(initV[0]))) {
                        sharedMaterial._shaderValues.setNumber(vArr[0], parseFloat(initV[0]));
                    }
                    else {
                        var strObj = initV[0] + "";
                        if (strObj == "tex") {
                            var tex = sharedMaterial[oName];
                            sharedMaterial._shaderValues.setTexture(vArr[0], tex);
                        }
                    }
                }
            }
        }
        if (spriteDefines == "null") {
            spriteDefines = Laya.SkinnedMeshSprite3D.shaderDefines;
        }
        if (materialDefines == "null") {
            materialDefines = Laya.BlinnPhongMaterial.shaderDefines;
        }
        var shader = Laya.Shader3D.add(shaderName, attributeMap, uniformMap, spriteDefines, materialDefines);
        var SubShaderNode = this.getNode(xmlNode, "SubShader");
        var renderModeNode = this.getNode(xmlNode, "renderMode");
        if (renderModeNode != null) {
            var renderMode = this.getAttributesValue(renderModeNode, "v");
            if (renderMode != null) {
                sharedMaterial["renderMode"] = this.getV(renderMode);
            }
        }
        var PassArr = this.getNodeArr(SubShaderNode, "Pass");
        for (i = 0; i < PassArr.length; i++) {
            var pass = PassArr[i];
            var vsNode = this.getNode(pass, "VERTEX");
            var vs = vsNode.textContent;
            vs = vs.replace(/(\r)/g, "");
            var psNode = this.getNode(pass, "FRAGMENT");
            var ps = psNode.textContent;
            ps = ps.replace(/(\r)/g, "");
            if (i > 0) {
                var rs = sharedMaterial.getRenderState(0).clone();
                sharedMaterial._renderStates.push(rs);
            }
            var cullNode = this.getNode(pass, "cull");
            if (cullNode != null) {
                var cull = this.getAttributesValue(cullNode, "v");
                if (cull != null) {
                    sharedMaterial.getRenderState(i).cull = this.getV(cull);
                }
            }
            shader._addShaderPass(vs, ps);
        }
        sharedMaterial._shader = shader;
    };
    WmyShaderMsg.getV = function (obj, backType) {
        if (backType === void 0) { backType = "null"; }
        var tempNameArr, tempObj, tempV, ii;
        tempNameArr = obj.split(".");
        if (tempNameArr[0] === "Laya") {
            tempV = Laya;
        }
        else if (tempNameArr[0] === "laya") {
            tempV = laya;
        }
        for (ii = 1; ii < tempNameArr.length; ii++) {
            tempV = tempV[tempNameArr[ii]];
        }
        if (tempV != null) {
            return tempV;
        }
        else if (backType != "null") {
            if (backType == "int") {
                return parseInt(obj);
            }
            else {
                return obj;
            }
        }
        return null;
    };
    /**
     * Converts a string in the format "#rrggbb" or "rrggbb" to the corresponding
     * uint representation.
     *
     * @param color The color in string format.
     * @return The color in uint format.
     */
    WmyShaderMsg.colorStringToUint = function (color) {
        return Number("0x" + color.replace("#", ""));
    };
    WmyShaderMsg.getAttributesValue = function (node, key) {
        return key in node.attributes ? node["attributes"][key]["nodeValue"] : null;
    };
    WmyShaderMsg.getNode = function (xml, key) {
        var childNodes = xml.childNodes;
        var node = null;
        for (var i = 0; i < childNodes.length; i++) {
            var obj = childNodes[i];
            if (obj["nodeName"] == key) {
                node = obj;
                break;
            }
        }
        return node;
    };
    WmyShaderMsg.getNodeArr = function (xml, key) {
        var childNodes = xml.childNodes;
        var nodeArr = [];
        for (var i = 0; i < childNodes.length; i++) {
            var obj = childNodes[i];
            if (obj["nodeName"] == key) {
                nodeArr.push(obj);
            }
        }
        return nodeArr;
    };
    return WmyShaderMsg;
}());
//# sourceMappingURL=WmyShaderMsg.js.map
var WmyLoadMats = (function () {
    function WmyLoadMats() {
        this._matsUrlArr = [];
        this._matOk = false;
        this._matNum = 0;
        this._matP = 0;
        this._matP2 = 0;
    }
    Object.defineProperty(WmyLoadMats, "getThis", {
        get: function () {
            if (WmyLoadMats._this == null) {
                WmyLoadMats._this = new WmyLoadMats();
            }
            return WmyLoadMats._this;
        },
        enumerable: true,
        configurable: true
    });
    WmyLoadMats.prototype.onload3d = function (urlList, callbackOk, callbackProgress) {
        this._callbackOk = callbackOk;
        this._callbackProgress = callbackProgress;
        Laya.loader.load(urlList, Laya.Handler.create(this, this.__onUrlArrOk, [urlList]));
    };
    WmyLoadMats.prototype.__onUrlArrOk = function (urlList) {
        for (var i = 0; i < urlList.length; i++) {
            var url = urlList[i];
            var txt = Laya.loader.getRes(url);
            var jsObj = JSON.parse(txt);
            var arr = url.split("/");
            var matsUrl = url.replace(arr[arr.length - 1], "");
            var array = jsObj["mats"];
            for (var j = 0; j < array.length; j++) {
                var obj = array[j];
                if (obj["targetName"] == "")
                    continue;
                var v = Wmy_Load_Mag.V;
                var matUrl = matsUrl + obj["matUrl"] + v;
                this._matsUrlArr.push(matUrl);
            }
        }
        for (var i = 0; i < this._matsUrlArr.length; i++) {
            url = this._matsUrlArr[i];
            Laya.loader.create(url, Laya.Handler.create(this, this.__onMatArrOk), Laya.Handler.create(this, this.__onMatArrP));
        }
    };
    WmyLoadMats.prototype.__onMatArrP = function (p) {
        var pNum = p * (this._matNum + 1);
        if (pNum > this._matP)
            this._matP = pNum;
        this._matP2 = (this._matP / this._matsUrlArr.length);
        if (this._callbackProgress != null) {
            this._callbackProgress.runWith([this._matP2]);
        }
    };
    WmyLoadMats.prototype.__onMatArrOk = function () {
        this._matNum += 1;
        if (this._matNum >= this._matsUrlArr.length) {
            if (this._callbackOk != null) {
                this._callbackOk.run();
            }
        }
    };
    return WmyLoadMats;
}());
//# sourceMappingURL=WmyLoadMats.js.map
var WmyLoad3d = (function () {
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
            obj["url"] += "?wmy";
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
            url = this._meshArr[i] + Wmy_Load_Mag.V;
            Laya.loader.create(url, Laya.Handler.create(this, this.__onMeshArrOk), Laya.Handler.create(this, this.__onMeshArrP));
        }
        for (var i = 0; i < this._matArr.length; i++) {
            url = this._matArr[i] + Wmy_Load_Mag.V;
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WmyCamera = (function (_super) {
    __extends(WmyCamera, _super);
    function WmyCamera() {
        _super.call(this);
        this._upNum = 0;
        this._distance = 0;
        this._angleNum = 0;
        this._dx = 0;
        this._dy = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this._isMouseDown = false;
        //上次记录的两个触模点之间距离
        this._lastDistance = 0;
        this._lastX = 0;
        this._lastZ = 0;
        this._touchesNum = 0;
        this._v3 = Laya.Vector3.ZERO;
        this._rotaionSpeed = 0.01;
        if (WmyCamera._this == null) {
            WmyCamera._this = this;
        }
    }
    Object.defineProperty(WmyCamera, "getThis", {
        get: function () {
            return WmyCamera._this;
        },
        enumerable: true,
        configurable: true
    });
    WmyCamera.prototype.onAwake = function () {
        this.cam = this.owner;
        this.scene3D = this.cam.scene;
        this._camBox = this.cam.parent;
        this._upNum = this.cam.transform.localPositionY;
        this._distance = this.cam.transform.localPositionZ;
    };
    WmyCamera.prototype.onAddEvent = function (target) {
        this._target = target || Laya.stage;
        this._target.on(Laya.Event.MOUSE_DOWN, this, this.stageMouseDown);
        this._target.on(Laya.Event.MOUSE_UP, this, this.stageMouseUp);
        this._target.on(Laya.Event.MOUSE_OUT, this, this.stageMouseUp);
        this._target.on(Laya.Event.MOUSE_MOVE, this, this.stageMouseMove);
        this._target.on(Laya.Event.MOUSE_WHEEL, this, this.stageMouseWheel);
    };
    WmyCamera.prototype.onSetTarget = function (targetPos) {
        TweenMax.killTweensOf(this);
        if (targetPos != null) {
            this._camBox.transform.position = targetPos;
        }
    };
    WmyCamera.prototype.onSetInfo = function (upNum, distance, angleNum, upNum1, upNum2, offXZ) {
        TweenMax.killTweensOf(this);
        this._upNum = upNum || this.cam.transform.localPositionY;
        this._upNum1 = upNum1;
        this._upNum2 = upNum2;
        this._distance = distance || this.cam.transform.localPositionZ;
        this._angleNum = angleNum || this._angleNum;
        this._dx = this.lastMouseX = 0;
        this._dy = this.lastMouseY = 0;
        if (offXZ != null) {
            this._offXZ = Laya.Vector4.ZERO;
            this._offXZ.x = this._camBox.transform.position.x - Math.abs(offXZ);
            this._offXZ.y = this._camBox.transform.position.x + Math.abs(offXZ);
            this._offXZ.z = this._camBox.transform.position.z - Math.abs(offXZ);
            this._offXZ.w = this._camBox.transform.position.z + Math.abs(offXZ);
        }
    };
    WmyCamera.prototype.stageMouseDown = function (e) {
        var touches = e.touches;
        if (touches)
            this._touchesNum = touches.length;
        if (e.currentTarget != this._target)
            return;
        this._isMouseDown = true;
        TweenMax.killTweensOf(this);
        if (touches && touches.length == 2) {
            this._lastDistance = this.getDistance(touches);
            this._lastX = touches[0].stageX;
            this._lastZ = touches[0].stageY;
        }
        else if (touches && touches.length == 1) {
            this._dx = this.lastMouseX = touches[0].stageX;
            this._dy = this.lastMouseY = touches[0].stageY;
        }
        else if (touches == null) {
            this._dx = this.lastMouseX = Laya.stage.mouseX;
            this._dy = this.lastMouseY = Laya.stage.mouseY;
        }
    };
    WmyCamera.prototype.stageMouseUp = function (e) {
        var touches = e.touches;
        if (touches)
            this._touchesNum = touches.length;
        if (e.currentTarget != this._target)
            return;
        if (touches && touches.length == 1) {
            this._dx = this.lastMouseX = touches[0].stageX;
            this._dy = this.lastMouseY = touches[0].stageY;
        }
        else if (touches == null || touches.length == 0) {
            this._isMouseDown = false;
        }
    };
    WmyCamera.prototype.stageMouseMove = function (e) {
        var touches = e.touches;
        if (touches)
            this._touchesNum = touches.length;
        if (e.currentTarget != this._target || !this._isMouseDown)
            return;
        if (touches && touches.length == 2) {
            var distance = this.getDistance(e.touches);
            //判断当前距离与上次距离变化，确定是放大还是缩小
            var factor = 0.05;
            this.cam.fieldOfView -= (distance - this._lastDistance) * factor;
            if (this.cam.fieldOfView < 40)
                this.cam.fieldOfView = 40;
            if (this.cam.fieldOfView > 70)
                this.cam.fieldOfView = 70;
            this._lastDistance = distance;
            //平移
            var d = V2.Distance(new V2(touches[0].stageX, touches[0].stageY), new V2(this._lastX, this._lastZ));
            if (d > 3) {
                var poff = 0.04;
                var dx = (touches[0].stageX - this._lastX);
                var dy = (touches[0].stageY - this._lastZ);
                var rad = Math.atan2(dx, dy);
                var degree = rad * 180 / Math.PI;
                var rn = Math.PI / 180 * (this._angleNum + degree);
                var speedX = Math.sin(rn) * d * poff;
                var speedZ = Math.cos(rn) * d * poff;
                this._camBox.transform.translate(new Laya.Vector3(speedX, 0, speedZ), false);
            }
            this._lastX = touches[0].stageX;
            this._lastZ = touches[0].stageY;
        }
        else if (touches && touches.length == 1) {
            this.lastMouseX = touches[0].stageX;
            this.lastMouseY = touches[0].stageY;
            TweenMax.to(this, 1.5, { _dx: this.lastMouseX, _dy: this.lastMouseY });
        }
        else if (touches == null) {
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            TweenMax.to(this, 1.5, { _dx: this.lastMouseX, _dy: this.lastMouseY });
        }
    };
    WmyCamera.prototype.stageMouseWheel = function (e) {
        var factor = 1;
        this.cam.fieldOfView -= (e.delta) * factor;
        if (this.cam.fieldOfView < 40)
            this.cam.fieldOfView = 40;
        if (this.cam.fieldOfView > 70)
            this.cam.fieldOfView = 70;
    };
    WmyCamera.prototype.onUpdate = function () {
        if (this._touchesNum <= 1) {
            var offsetX = Math.abs(this.lastMouseX) - Math.abs(this._dx);
            var offsetY = Math.abs(this.lastMouseY) - Math.abs(this._dy);
            var dx = offsetX * this._rotaionSpeed;
            var dy = offsetY * this._rotaionSpeed * 0.4;
            this._angleNum -= dx;
            this._upNum += dy;
            if (this._upNum1 != null) {
                if (this._upNum < this._upNum1)
                    this._upNum = this._upNum1;
            }
            if (this._upNum2 != null) {
                if (this._upNum > this._upNum2)
                    this._upNum = this._upNum2;
            }
            this._v3.y = this._upNum;
            this._v3.x = Math.sin((this._angleNum) * Math.PI / 180) * this._distance;
            this._v3.z = Math.cos((this._angleNum) * Math.PI / 180) * this._distance;
            this.cam.transform.localPosition = this._v3;
            this.cam.transform.lookAt(this._camBox.transform.position, Laya.Vector3.UnitY);
        }
        if (this._offXZ != null) {
            var pos = this._camBox.transform.position;
            if (pos.x < this._offXZ.x) {
                pos.x = this._offXZ.x;
            }
            else if (pos.x > this._offXZ.y) {
                pos.x = this._offXZ.y;
            }
            if (pos.z < this._offXZ.z) {
                pos.z = this._offXZ.z;
            }
            else if (pos.z > this._offXZ.w) {
                pos.z = this._offXZ.w;
            }
            this._camBox.transform.position = pos;
        }
    };
    /**计算两个触摸点之间的距离*/
    WmyCamera.prototype.getDistance = function (points) {
        var distance = 0;
        if (points && points.length == 2) {
            var dx = points[0].stageX - points[1].stageX;
            var dy = points[0].stageY - points[1].stageY;
            distance = Math.sqrt(dx * dx + dy * dy);
        }
        return distance;
    };
    WmyCamera.prototype.onStageMouseDown = function (e) {
        var _outHitAllInfo = this.get3dClick();
        if (_outHitAllInfo.length > 0) {
            this._clickObj = _outHitAllInfo[0].collider.owner;
        }
    };
    WmyCamera.prototype.onStageMouseUp = function (e) {
        var _outHitAllInfo = this.get3dClick();
        var tempObj = null;
        if (_outHitAllInfo.length > 0) {
            tempObj = _outHitAllInfo[0].collider.owner;
            if (tempObj == this._clickObj) {
            }
        }
        this._clickObj = null;
    };
    WmyCamera.prototype.get3dClick = function (collisonGroup, collisionMask) {
        var _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        var _point = new Laya.Vector2();
        var _outHitAllInfo = new Array();
        //从屏幕空间生成射线
        _point.elements[0] = Laya.MouseManager.instance.mouseX;
        _point.elements[1] = Laya.MouseManager.instance.mouseY;
        this.cam.viewportPointToRay(_point, _ray);
        //射线检测获取所有检测碰撞到的物体
        if (this.scene3D.physicsSimulation != null) {
            this.scene3D.physicsSimulation.rayCastAll(_ray, _outHitAllInfo, 10000, collisonGroup, collisionMask);
        }
        return _outHitAllInfo;
    };
    return WmyCamera;
}(Laya.Script));
//# sourceMappingURL=WmyCamera.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WmyLight = (function (_super) {
    __extends(WmyLight, _super);
    function WmyLight() {
        _super.call(this);
        if (WmyLight._this == null) {
            WmyLight._this = this;
        }
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WmyPhysicsWorld_Character = (function (_super) {
    __extends(WmyPhysicsWorld_Character, _super);
    function WmyPhysicsWorld_Character() {
        _super.apply(this, arguments);
        this.moveSpeed = 0.03;
        this.jumpSpeed = 5;
        this.isU = false;
        this.isD = false;
        this.isL = false;
        this.isR = false;
    }
    Object.defineProperty(WmyPhysicsWorld_Character.prototype, "isGrounded", {
        get: function () {
            if (this.character == null)
                return false;
            return this.character.isGrounded;
        },
        enumerable: true,
        configurable: true
    });
    WmyPhysicsWorld_Character.prototype.onAwake = function () {
        this.mySprite3D = this.owner;
        this.scene3D = this.mySprite3D.scene;
        var physicsCollider = this.mySprite3D.getComponent(Laya.PhysicsCollider);
        physicsCollider.enabled = false;
        var sShape = physicsCollider.colliderShape;
        this.character = this.mySprite3D.addComponent(Laya.CharacterController);
        var sphereShape = new Laya.CapsuleColliderShape(sShape.radius, sShape.length, sShape.orientation);
        sphereShape.localOffset = sShape.localOffset;
        this.character.colliderShape = sphereShape;
    };
    WmyPhysicsWorld_Character.prototype.onJump = function (isJump) {
        this._keyJup = isJump;
        var isGrounded = this.character.isGrounded;
        if (!this._isJump && isJump && isGrounded) {
            this.character.jump();
        }
        this._isJump = isJump;
    };
    WmyPhysicsWorld_Character.prototype.onUpdate = function () {
        this.character.jumpSpeed = this.jumpSpeed;
        var speed = this.moveSpeed;
        var speedV3 = new Laya.Vector3(0, 0, 0);
        var isGrounded = this.character.isGrounded;
        if (!(this.isU && this.isD)) {
            if (isGrounded) {
                if (this.isU) {
                    speedV3.z = -speed;
                }
                else if (this.isD) {
                    speedV3.z = speed;
                }
            }
        }
        if (!(this.isL && this.isR)) {
            if (this.isL) {
                speedV3.x = -speed;
            }
            else if (this.isR) {
                speedV3.x = speed;
            }
        }
        this.character.move(speedV3);
    };
    return WmyPhysicsWorld_Character;
}(Laya.Script));
//# sourceMappingURL=WmyPhysicsWorld_Character.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var B = Laya.Browser;
var WmyUtils = (function (_super) {
    __extends(WmyUtils, _super);
    function WmyUtils() {
        _super.call(this);
        this._eventList = new Array();
        // Laya.timer.frameLoop(1,this,this.__loop);
        Laya.stage.on(laya.events.Event.MOUSE_DOWN, this, this.__onTouchDown);
        Laya.stage.on(laya.events.Event.MOUSE_UP, this, this.__onTouchUp);
        Laya.stage.on(laya.events.Event.MOUSE_MOVE, this, this.__OnMouseMOVE);
        Laya.stage.on(Laya.Event.RESIZE, this, this.__onResize);
    }
    Object.defineProperty(WmyUtils, "getThis", {
        get: function () {
            if (WmyUtils._this == null) {
                WmyUtils._this = new WmyUtils();
            }
            return WmyUtils._this;
        },
        enumerable: true,
        configurable: true
    });
    //转换颜色
    WmyUtils.prototype.convertColorToColorFiltersMatrix = function (r, g, b, a) {
        WmyUtils.COLOR_FILTERS_MATRIX[0] = r;
        WmyUtils.COLOR_FILTERS_MATRIX[6] = g;
        WmyUtils.COLOR_FILTERS_MATRIX[12] = b;
        WmyUtils.COLOR_FILTERS_MATRIX[18] = a || 1;
        return WmyUtils.COLOR_FILTERS_MATRIX;
    };
    //对对象改变颜色
    WmyUtils.prototype.applyColorFilters = function (target, color) {
        target.filters = null;
        if (color != 0xffffff) {
            target.filters = [new Laya.ColorFilter(this.convertColorToColorFiltersMatrix(((color >> 16) & 0xff) / 255, ((color >> 8) & 0xff) / 255, (color & 0xff) / 255))];
        }
    };
    //对对象改变颜色
    WmyUtils.prototype.applyColorFilters1 = function (target, r, g, b, a) {
        target.filters = null;
        if (r < 1 || g < 1 || b < 1 || a < 1) {
            target.filters = [new Laya.ColorFilter(this.convertColorToColorFiltersMatrix(r, g, b, a))];
        }
    };
    //判断手机或PC
    WmyUtils.prototype.isPc = function () {
        var isPc = false;
        if (this.versions().android || this.versions().iPhone || this.versions().ios) {
            isPc = false;
        }
        else if (this.versions().iPad) {
            isPc = true;
        }
        else {
            isPc = true;
        }
        return isPc;
    };
    WmyUtils.prototype.versions = function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1,
            presto: u.indexOf('Presto') > -1,
            webKit: u.indexOf('AppleWebKit') > -1,
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
            iPad: u.indexOf('iPad') > -1,
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    };
    WmyUtils.getUrlV = function (key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    };
    WmyUtils.prototype.onNavigate = function (url, isReplace) {
        if (isReplace === void 0) { isReplace = false; }
        if (isReplace) {
            window.location.replace(url);
        }
        else {
            window.location.href = url;
        }
    };
    WmyUtils.prototype.__onTouchDown = function (evt) {
        if (this._eventList.indexOf(evt) < 0) {
            this._eventList.push(evt);
        }
    };
    WmyUtils.prototype.__onTouchUp = function (evt) {
        if (this._eventList.indexOf(evt) >= 0) {
            this._eventList.splice(this._eventList.indexOf(evt), 1);
        }
    };
    WmyUtils.prototype.__onResize = function () {
        this._eventList.forEach(function (evt) {
            evt.type = Laya.Event.MOUSE_UP;
            Laya.stage.event(Laya.Event.MOUSE_UP, evt);
        });
        this._eventList = new Array();
    };
    WmyUtils.prototype.__OnMouseMOVE = function (evt) {
        var bNum = 10;
        if (evt.stageX <= bNum || evt.stageX >= Laya.stage.width - bNum ||
            evt.stageY <= bNum || evt.stageY >= Laya.stage.height - bNum) {
            evt.type = Laya.Event.MOUSE_UP;
            Laya.stage.event(Laya.Event.MOUSE_UP, evt);
        }
    };
    WmyUtils.onNumTo = function (n) {
        if ((n + "").indexOf(".") >= 0) {
            n = parseFloat(n.toFixed(2));
        }
        return n;
    };
    WmyUtils.getR_XY = function (d, r) {
        var radian = (r * Math.PI / 180);
        var cos = Math.cos(radian);
        var sin = Math.sin(radian);
        var dx = d * cos;
        var dy = d * sin;
        return new Laya.Point(dx, dy);
    };
    WmyUtils.string2buffer = function (str) {
        // 首先将字符串转为16进制
        var val = "";
        for (var i = 0; i < str.length; i++) {
            if (val === '') {
                val = str.charCodeAt(i).toString(16);
            }
            else {
                val += ',' + str.charCodeAt(i).toString(16);
            }
        }
        // 将16进制转化为ArrayBuffer
        return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16);
        })).buffer;
    };
    WmyUtils.replaceAll = function (str, oldStr, newStr) {
        var temp = '';
        temp = str.replace(oldStr, newStr);
        if (temp.indexOf(oldStr) >= 0) {
            temp = this.replaceAll(temp, oldStr, newStr);
        }
        return temp;
    };
    //大小写转换
    WmyUtils.toCase = function (str, isDx) {
        if (isDx === void 0) { isDx = false; }
        var temp = '';
        if (!isDx) {
            //转换为小写字母
            temp = str.toLowerCase();
        }
        else {
            //转化为大写字母
            temp = str.toUpperCase();
        }
        return temp;
    };
    //距离
    WmyUtils.getDistance = function (a, b) {
        var dx = Math.abs(a.x - b.x);
        var dy = Math.abs(a.y - b.y);
        var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        d = parseFloat(d.toFixed(2));
        return d;
    };
    WmyUtils.getXyToR = function (y, x) {
        var radian = Math.atan2(y, x);
        var r = (180 / Math.PI * radian);
        r = this.onNumTo(r);
        return r;
    };
    WmyUtils.storage = function (key, value, isLocal) {
        if (value === void 0) { value = "?"; }
        if (isLocal === void 0) { isLocal = true; }
        var storage = isLocal ? localStorage : sessionStorage;
        if (value == "?") {
            var data = storage.getItem(key);
            return data;
        }
        else if (value == null) {
            storage.removeItem(key);
        }
        else {
            storage.setItem(key, value);
            return value;
        }
        return null;
    };
    WmyUtils.COLOR_FILTERS_MATRIX = [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0,
    ];
    return WmyUtils;
}(laya.events.EventDispatcher));
//# sourceMappingURL=WmyUtils.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Wmy_UiObj = (function (_super) {
    __extends(Wmy_UiObj, _super);
    function Wmy_UiObj() {
        _super.apply(this, arguments);
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
// 程序入口
var LayaAir3D = (function () {
    function LayaAir3D() {
        LayaAir3D._this = this;
        // //初始化引擎
        Laya3D.init(1136, 640);
        Laya.stage.bgColor = "#000000";
        // //适配模式
        //Laya.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        //设置横竖屏
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        //设置水平对齐
        Laya.stage.alignH = "center";
        //设置垂直对齐
        Laya.stage.alignV = "middle";
        Laya.Stat.show();
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        Wmy_Load_Mag.getThis.onLoadWetData("loadInfo.txt?" + Date.now(), Laya.Handler.create(this, this.onLoadLoad));
    }
    LayaAir3D.prototype.onLoadLoad = function () {
        var resObj = Wmy_Load_Mag.getThis.getResObj("load");
        if (resObj != null) {
            Wmy_Load_Mag.getThis.onload(resObj, new Laya.Handler(this, this.onLoadMain));
        }
    };
    LayaAir3D.prototype.onLoadMain = function () {
        this._loadView = fairygui.UIPackage.createObject("load", "Load").asCom;
        fairygui.GRoot.inst.addChild(this._loadView);
        this._bar = this._loadView.getChild("bar").asProgress;
        this._bar.value = 1;
        Wmy_Load_Mag.getThis.onAutoLoadAll(new Laya.Handler(this, this.onLoadOk), new Laya.Handler(this, this.onLoading));
    };
    LayaAir3D.prototype.onLoading = function (progress) {
        this._bar.value = progress;
    };
    LayaAir3D.prototype.onLoadOk = function (uiArr, u3dArr) {
        var _this = this;
        if (u3dArr[0] != null) {
            this._urlList = u3dArr[0].urlList;
            //添加3D场景
            this.scene3D = Laya.loader.getRes(this._urlList[0]);
            WmyUtils3D.setShaderAll(this.scene3D, Wmy_Load_Mag.assetUrl + "res/mats/", Wmy_Load_Mag.assetUrl + "res/shaders/");
            Laya.timer.once(200, this, function () {
                _this.onMain();
                fairygui.GRoot.inst.removeChild(_this._loadView);
                _this._loadView = null;
                _this._bar = null;
            });
        }
    };
    LayaAir3D.prototype.onMain = function () {
        Laya.stage.addChildAt(this.scene3D, 0);
        var Camera = WmyUtils3D.getObj3d(this.scene3D, "Camera");
        var Player1 = WmyUtils3D.getObj3d(this.scene3D, "Player1");
        Player1.addComponent(PlayerKz);
        // var Mat_Player1_Clothing=WmyUtils3D.getObj3d(this.scene3D,"Mat_Player1_Clothing")as Laya.Sprite3D;
        // Laya.BaseMaterial.load("res/mat/Mat_Player1_Clothing/Mat_Player1_Clothing.lmat",Laya.Handler.create(this,m=>{
        //     WmyShaderMsg.setShader(Mat_Player1_Clothing,m,"res/shader/wmy_MatCapAdd_glsl.xml");
        // }))
        // var Mat_Player1_Skin=WmyUtils3D.getObj3d(this.scene3D,"Mat_Player1_Skin")as Laya.Sprite3D;
        // Laya.BaseMaterial.load("res/mat/Mat_Player1_Skin/Mat_Player1_Skin.lmat",Laya.Handler.create(this,m=>{
        //     WmyShaderMsg.setShader(Mat_Player1_Skin,m,"res/shader/wmy_MatCapAdd_glsl.xml");
        // }))
    };
    return LayaAir3D;
}());
new LayaAir3D();
//# sourceMappingURL=LayaAir3D.js.map