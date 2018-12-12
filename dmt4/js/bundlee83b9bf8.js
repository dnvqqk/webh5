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
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Wmy_Load_Mag_1 = require("./_wmyUtilsH5/Wmy_Load_Mag");
var WTweenManager_1 = require("./_wmyUtilsH5/wmyTween/WTweenManager");
var WmyUtils_1 = require("./_wmyUtilsH5/WmyUtils");
var WmyU3dTsMag_1 = require("./wmyU3dTs/WmyU3dTsMag");
var Main = /** @class */ (function () {
    function Main() {
        this._rootW = 640;
        this._rootH = 1136;
        Main._this = this;
        Laya3D.init(this._rootW, this._rootH);
        Laya["Physics"] && Laya["Physics"].enable();
        var isPc = WmyUtils_1.WmyUtils.getThis.isPc();
        if (isPc) {
            Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        }
        else {
            Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
            Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        }
        //设置水平对齐
        Laya.stage.alignH = "center";
        //设置垂直对齐
        Laya.stage.alignV = "middle";
        Laya.Stat.show();
        Laya.Shader3D.debugMode = true;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        var wmyVTime = "";
        if (window != null && window["wmyVTime"] != null) {
            wmyVTime = window["wmyVTime"];
        }
        Laya.ResourceVersion.enable("version.json" + wmyVTime, Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        var _this_1 = this;
        Laya.timer.frameLoop(1, this, this.RESIZE);
        Wmy_Load_Mag_1.Wmy_Load_Mag.getThis.onLoadWetData("res/loadInfo.json", Laya.Handler.create(this, function () {
            Wmy_Load_Mag_1.Wmy_Load_Mag.getThis.onloadStr("load", new Laya.Handler(_this_1, _this_1.onLoadMain));
        }));
    };
    Main.prototype.RESIZE = function () {
        var sw = Laya.stage.width / this._rootW;
        var sh = Laya.stage.height / this._rootH;
        if (this._uiScene != null) {
            this._uiScene.scaleX = sw;
            this._uiScene.scaleY = sw;
        }
        if (this._uiScene != null) {
            this._uiRoot.width = Laya.stage.width / sw;
            this._uiRoot.height = Laya.stage.height / sw;
        }
        if (this._LoadRoot != null) {
            this._LoadRoot.width = this._uiRoot.width;
            this._LoadRoot.height = this._uiRoot.height;
        }
        // if (this._mainView != null) {
        // 	this._mainView.width = this._uiRoot.width;
        // 	this._mainView.height = this._uiRoot.height;
        // }
    };
    Main.prototype.onLoadMain = function () {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        this._uiScene = new fairygui.GComponent();
        fairygui.GRoot.inst.addChild(this._uiScene);
        this._uiRoot = new fairygui.GComponent();
        this._uiScene.addChild(this._uiRoot);
        this._LoadRoot = fairygui.UIPackage.createObject("load", "LoadRoot").asCom;
        this._uiRoot.addChild(this._LoadRoot);
        this._LoadBox = this._LoadRoot.getChild("_LoadBox").asCom;
        this._bar = this._LoadBox.getChild("bar").asProgress;
        Wmy_Load_Mag_1.Wmy_Load_Mag.getThis.onAutoLoadAll(new Laya.Handler(this, this.onLoadOk), new Laya.Handler(this, this.onLoading));
    };
    Main.prototype.onLoading = function (progress) {
        var tween = WTweenManager_1.WTweenManager.createTween();
        tween.setTarget(this, Laya.Handler.create(this, this._onLoading, null, false));
        if (this._bar) {
            tween._to(this._bar.value, progress, 0.25);
        }
    };
    Main.prototype._onLoading = function (target, p) {
        if (this._bar) {
            this._bar.value = p;
        }
    };
    Main.prototype.onLoadOk = function (uiArr, u3dArr) {
        //添加3D
        var url3d = u3dArr[0].urlList[0];
        this._scene3D = Laya.loader.getRes(url3d);
        this._scene3D.addComponent(WmyU3dTsMag_1.default);
        WTweenManager_1.WTweenManager.killTweens(this);
        var tween = WTweenManager_1.WTweenManager.createTween();
        tween.setTarget(this, Laya.Handler.create(this, this._onLoading, null, false))
            ._to(this._bar.value, 100, 1)
            .onComplete(this.onMain, this);
    };
    Main.prototype.onMain = function () {
        this._mainView = fairygui.UIPackage.createObject("main", "Main").asCom;
        if (this._mainView != null) {
            this._uiRoot.addChildAt(this._mainView, 0);
        }
        var _Main = this._mainView.getChild("_Main").asCom;
        var d3Box = _Main.getChild("d3Box");
        d3Box.displayObject.addChild(this._scene3D);
        WTweenManager_1.WTweenManager.killTweens(this);
        this._uiRoot.removeChild(this._LoadRoot);
        this._LoadRoot = null;
        this._bar = null;
        // //加载3D场景
        // Laya.Scene3D.load('res/u3d/main/Conventional/1.ls', Laya.Handler.create(null, function(scene){
        // 	//自动绑定U3D脚本
        // 	scene.addComponent(WmyU3dTsMag);
        // 	//场景添加到舞台
        // 	Laya.stage.addChild(scene);
        // 	// var wmyVetex_fz01=WmyUtils3D.getObj3dUrl(scene,"1/2/3/wmyVetex_fz01@1") as Laya.Sprite3D;
        // 	// wmyVetex_fz01.event("ani_play");
        // 	// Laya.timer.once(1000,this,()=>{
        // 	// 	wmyVetex_fz01.event("ani_play");
        // 	// })
        // }));
    };
    return Main;
}());
exports.Main = Main;
//激活启动类
new Main();
},{"./_wmyUtilsH5/WmyUtils":2,"./_wmyUtilsH5/Wmy_Load_Mag":3,"./_wmyUtilsH5/wmyTween/WTweenManager":12,"./wmyU3dTs/WmyU3dTsMag":17}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyUtils = /** @class */ (function (_super) {
    __extends(WmyUtils, _super);
    function WmyUtils() {
        var _this_1 = _super.call(this) || this;
        _this_1._eventList = new Array();
        // Laya.timer.frameLoop(1,this,this.__loop);
        Laya.stage.on(laya.events.Event.MOUSE_DOWN, _this_1, _this_1.__onTouchDown);
        Laya.stage.on(laya.events.Event.MOUSE_UP, _this_1, _this_1.__onTouchUp);
        Laya.stage.on(laya.events.Event.MOUSE_MOVE, _this_1, _this_1.__OnMouseMOVE);
        Laya.stage.on(Laya.Event.RESIZE, _this_1, _this_1.__onResize);
        return _this_1;
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
    WmyUtils.onNumTo = function (n, l) {
        if (l === void 0) { l = 2; }
        if ((n + "").indexOf(".") >= 0) {
            n = parseFloat(n.toFixed(l));
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
    WmyUtils.playFuiSound = function (_url, volume, completeHandler, startTime, loops) {
        if (volume === void 0) { volume = 0.2; }
        if (startTime === void 0) { startTime = 0; }
        if (loops === void 0) { loops = 1; }
        if (volume <= 0)
            return;
        var item = fairygui.UIPackage.getItemByURL(_url);
        var url = item.file;
        Laya.SoundManager.playSound(url, loops, completeHandler, null, startTime);
        Laya.SoundManager.setSoundVolume(volume, url);
    };
    WmyUtils.COLOR_FILTERS_MATRIX = [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0,
    ];
    return WmyUtils;
}(laya.events.EventDispatcher));
exports.WmyUtils = WmyUtils;
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyUtils_1 = require("./WmyUtils");
var WmyLoad3d_1 = require("./d3/WmyLoad3d");
var WmyLoadMats_1 = require("./d3/WmyLoadMats");
var Wmy_Load_Mag = /** @class */ (function () {
    function Wmy_Load_Mag() {
        this._wetData = {};
        this.resUrl = "";
        this._resDataArr = [];
        this._callbackOk = [];
        this._callbackProgress = [];
        this._isAutoLoadP = false;
        this._isU3d = false;
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
            try {
                arr = JSON.parse(obj);
            }
            catch (error) { }
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
            console.warn("空数据");
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
                console.warn("加载材料数据错误", webData);
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
    Wmy_Load_Mag.prototype.onloadStr = function (str, callbackOk, callbackProgress) {
        var resObj = this.getResObj(str);
        if (resObj != null) {
            this.onload(resObj, callbackOk, callbackProgress);
        }
        else {
            console.warn("onloadStr-出错:", str);
        }
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
                return true;
            }
            var Resres = resObj["Resres"];
            var data = {};
            var resData = resObj["resData"];
            if (resData != null && resData != "") {
                try {
                    data = JSON.parse(resData);
                }
                catch (error) {
                    console.warn("加载材料数据错误", resData);
                }
            }
            var bNameUrl;
            var urlArr = [];
            var isCreate = false;
            for (var i = 0; i < Resres.length; i++) {
                var obj = Resres[i];
                var resUrl = obj["resUrl"];
                if (resUrl == null) {
                    continue;
                }
                resUrl = WmyUtils_1.WmyUtils.toCase(resUrl);
                var url = resUrl;
                if (url.indexOf(".txt") >= 0) {
                    urlArr.push({ url: url, type: Laya.Loader.BUFFER });
                    bNameUrl = resUrl;
                }
                else if (url.indexOf(".jpg") >= 0 || url.indexOf(".png") >= 0) {
                    urlArr.push({ url: url, type: Laya.Loader.IMAGE });
                }
                else if (url.indexOf(".mp3") >= 0 || url.indexOf(".wav") >= 0) {
                    urlArr.push({ url: url, type: Laya.Loader.SOUND });
                }
                else {
                    urlArr.push({ url: url });
                }
            }
            if (urlArr.length <= 0)
                return false;
            this._callbackOk[resName] = [];
            this._callbackOk[resName].push(callbackOk);
            this._callbackProgress[resName] = [];
            if (callbackProgress != null) {
                this._callbackProgress[resName].push(callbackProgress);
            }
            Laya.loader.load(urlArr, Laya.Handler.create(this, this.onAssetConmplete, [resName, bNameUrl, data]), Laya.Handler.create(this, this.onAssetProgress, [resName], false));
        }
        return true;
    };
    Wmy_Load_Mag.prototype.onClear3dRes = function (url) {
        Laya.Resource.destroyUnusedResources();
        WmyLoad3d_1.WmyLoad3d.getThis.clearRes(url);
    };
    Wmy_Load_Mag.prototype.onLoad3dOne = function (url, callbackOk, callbackProgress) {
        WmyLoad3d_1.WmyLoad3d.onLoad3dOne(url, callbackOk, callbackProgress);
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
                return true;
            }
            var Resres = resObj["Resres"];
            var data = {};
            var resData = resObj["resData"];
            if (resData != null && resData != "") {
                try {
                    data = JSON.parse(resData);
                }
                catch (error) {
                    console.warn("加载材料数据错误", resData);
                }
            }
            var bName;
            var urlArr = [];
            var urlList = [];
            for (var i = 0; i < Resres.length; i++) {
                var obj = Resres[i];
                var resUrl = obj["resUrl"];
                if (resUrl == null) {
                    continue;
                }
                var url = resUrl;
                if (resUrl.indexOf(".ls") >= 0 || resUrl.indexOf(".lh") >= 0) {
                    urlArr.push({ url: url });
                    urlList.push(url);
                }
            }
            if (urlArr.length <= 0)
                return false;
            this._callbackOk[resName] = [];
            this._callbackOk[resName].push(callbackOk);
            this._callbackProgress[resName] = [];
            if (callbackProgress != null) {
                this._callbackProgress[resName].push(callbackProgress);
            }
            data.urlList = urlList;
            WmyLoad3d_1.WmyLoad3d.getThis.onload3d(urlArr, Laya.Handler.create(this, this.onAssetConmplete, [resName, bName, data]), Laya.Handler.create(this, this.onAssetProgress, [resName], false));
        }
        return true;
    };
    Wmy_Load_Mag.prototype.onAssetProgress = function (resName, progress) {
        var callbackProgressArr = this._callbackProgress[resName];
        for (var i = 0; i < callbackProgressArr.length; i++) {
            var callback = callbackProgressArr[i];
            callback.runWith([progress]);
        }
    };
    Wmy_Load_Mag.prototype.onAssetConmplete = function (resName, bNameUrl, data) {
        var callbackOkArr = this._callbackOk[resName];
        if (bNameUrl != null) {
            var bao = Laya.loader.getRes(bNameUrl);
            var bName = bNameUrl.replace(".txt", "");
            try {
                fairygui.UIPackage.addPackage(bName, bao);
            }
            catch (error) {
                console.warn("FUI-出错:", bName);
            }
            var bNameArr = bName.split("/");
            data.bName = bNameArr[bNameArr.length - 1];
            this._resDataArr[resName] = data;
        }
        for (var i = 0; i < callbackOkArr.length; i++) {
            var callbackOk = callbackOkArr[i];
            if (callbackOk != null) {
                callbackOk.runWith([data]);
            }
        }
        this._callbackOk[resName] = null;
        this._callbackProgress[resName] = null;
    };
    Wmy_Load_Mag.prototype.onAutoLoadAll = function (callbackOk, callbackProgress) {
        var webData = this.getWetData(this.resUrl);
        if (webData == null) {
            console.warn("空数据");
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
                console.warn("加载材料数据错误", webData);
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
        this._isAutoLoadP = true;
    };
    Wmy_Load_Mag.prototype.onAutoLoadObj = function (type, resName) {
        var _this_1 = this;
        var res = this.getResObj(resName);
        if (res == null)
            return;
        var resId = this._autoLoadInfoArr["num"];
        this._autoLoadInfoArr[resId] = {};
        this._autoLoadInfoArr[resId]["n"] = resName;
        this._autoLoadInfoArr[resId]["t"] = type;
        var loadOk = false;
        if (type == "ui") {
            loadOk = this.onload(res, new Laya.Handler(this, this.onLoadOk, [resId]), new Laya.Handler(this, this.onLoading, [resId]));
            this._autoLoadInfoArr["num"] += 1;
            if (!loadOk) {
                console.warn("ui-出错:", resName);
                Laya.timer.once(100, null, function (_resId) {
                    _this_1.onLoadOk(_resId);
                }, [resId]);
            }
        }
        else if (type == "u3d") {
            loadOk = this.onload3d(res, new Laya.Handler(this, this.onLoadOk, [resId]), new Laya.Handler(this, this.onLoading, [resId]));
            this._autoLoadInfoArr["num"] += 1;
            this._isU3d = true;
            if (!loadOk) {
                console.warn("u3d-出错:", resName);
                Laya.timer.once(100, null, function (_resId) {
                    _this_1.onLoadOk(_resId);
                }, [resId]);
            }
        }
        else if (type == "mats") {
            var Resres = res["Resres"];
            var urlList = [];
            for (var i = 0; i < Resres.length; i++) {
                var obj = Resres[i];
                var resUrl = obj["resUrl"];
                resUrl = Laya.ResourceVersion.addVersionPrefix(resUrl);
                if (resUrl == null) {
                    continue;
                }
                var url = resUrl;
                urlList.push(url);
            }
            if (urlList.length > 0) {
                WmyLoadMats_1.WmyLoadMats.getThis.onload3d(urlList, new Laya.Handler(this, this.onLoadOk, [resId]), new Laya.Handler(this, this.onLoading, [resId]));
                loadOk = true;
            }
            this._autoLoadInfoArr["num"] += 1;
            if (!loadOk) {
                console.warn("mats-出错:", resName);
                Laya.timer.once(100, null, function (_resId) {
                    _this_1.onLoadOk(_resId);
                }, [resId]);
            }
        }
        else if (type == "cubeMap") {
            var Resres = res["Resres"];
            for (var i = 0; i < Resres.length; i++) {
                var obj = Resres[i];
                var resUrl = obj["resUrl"];
                var url = resUrl;
                Laya.TextureCube.load(url, null);
            }
        }
        else if (type == "audio") {
            loadOk = this.onload(res, new Laya.Handler(this, this.onLoadOk, [resId]), new Laya.Handler(this, this.onLoading, [resId]));
            this._autoLoadInfoArr["num"] += 1;
            if (!loadOk) {
                console.warn("audio-出错:", resName);
                Laya.timer.once(100, null, function (_resId) {
                    _this_1.onLoadOk(_resId);
                }, [resId]);
            }
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
            resUrl = Laya.ResourceVersion.addVersionPrefix(resUrl);
            var url = resUrl;
            Laya.TextureCube.load(url, new Laya.Handler(this, function (cube) {
                ResresObj[i] = cube;
                complete.runWith([cube, i]);
            }));
        }
        return ResresObj;
    };
    Wmy_Load_Mag.prototype.onLoading = function (resId, progress) {
        var pC = 0;
        if (!this._isAutoLoadP) {
            if (this._autoLoadrCallbackProgress != null) {
                this._autoLoadrCallbackProgress.runWith([pC]);
            }
            return;
        }
        this._autoLoadInfoArr[resId]["p"] = progress;
        var num = this._autoLoadInfoArr["num"];
        var pNum = 0;
        var pS = 1 / num;
        var p0 = 0, p1 = 0;
        for (var i = 0; i < num; i++) {
            var obj = this._autoLoadInfoArr[i];
            var p = obj["p"];
            if (p != null) {
                if (this._isU3d) {
                    if (obj["t"] == "u3d") {
                        p1 = p * (pS * (i + 1)) * 0.8;
                    }
                    else {
                        p0 = p * (pS * (i + 1)) * 0.2;
                    }
                    pNum = p0 + p1;
                }
                else {
                    pNum = p * (pS * (i + 1));
                }
            }
        }
        pC = pNum * 100;
        if (isNaN(pC))
            pC = 0;
        if (pC > 1)
            // console.log(pC);
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
    return Wmy_Load_Mag;
}());
exports.Wmy_Load_Mag = Wmy_Load_Mag;
},{"./WmyUtils":2,"./d3/WmyLoad3d":4,"./d3/WmyLoadMats":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyUtils3D_1 = require("./WmyUtils3D");
var WmyLoad3d = /** @class */ (function () {
    function WmyLoad3d() {
        this._mNum = 0;
        this._pNum = 0;
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
    WmyLoad3d.prototype.onload3d = function (urlList, callbackOk, callbackProgress, isClearRes) {
        this._urlList = [];
        this._callbackOk = callbackOk;
        this._callbackProgress = callbackProgress;
        for (var i = 0; i < urlList.length; i++) {
            var url = urlList[i]["url"];
            url = Laya.ResourceVersion.addVersionPrefix(url);
            this._urlList.push(url);
            this._onload3d(url);
        }
    };
    // public static onLoad3dOne(url:string,callbackOk:Laya.Handler,callbackProgress?:Laya.Handler){
    //     WmyLoad3d.getThis._onLoad3dOne(url,callbackOk,callbackProgress);
    // }
    // public _onLoad3dOne(url:string,callbackOk:Laya.Handler,callbackProgress?:Laya.Handler){
    //     this._load3d(url,callbackOk,callbackProgress);
    // }
    // private _load3d(url,callbackOk:Laya.Handler,callbackProgress?:Laya.Handler){
    //     Laya.loader.clearRes(url);
    //     Laya.loader.create(url,Laya.Handler.create(this,()=>{
    //         if(callbackOk!=null){
    //             callbackOk.run();
    //         }
    //     }),Laya.Handler.create(this,(p)=>{
    //         if(callbackProgress!=null){
    //             callbackProgress.runWith([p]);
    //         }
    //     },null,false));
    // }
    WmyLoad3d.onLoad3dOne = function (url, callbackOk, callbackProgress) {
        var wmyLoad3d = new WmyLoad3d();
        wmyLoad3d.__onload3dOne(url, callbackOk, callbackProgress);
    };
    WmyLoad3d.prototype.__onload3dOne = function (url, callbackOk, callbackProgress) {
        this._urlList = [];
        this._callbackOk = callbackOk;
        this._callbackProgress = callbackProgress;
        url = Laya.ResourceVersion.addVersionPrefix(url);
        this._urlList.push(url);
        this._onload3d(url);
    };
    // private _onload3d(_urlList){
    //     Laya.loader.create(this._urlList,Laya.Handler.create(this,()=>{
    //         if(this._callbackOk!=null){
    //             this._callbackOk.run();
    //         }
    //         this._urlList=null;
    //         this._callbackOk=null;
    //         this._callbackProgress=null;
    //         this._mArr=null;
    //     }),Laya.Handler.create(this,(p)=>{
    //         if(this._callbackProgress!=null){
    //             this._callbackProgress.runWith([p]);
    //         }
    //     }),null,null,null,1,false);
    // }
    WmyLoad3d.prototype._onload3d = function (url) {
        Laya.loader.clearRes(url);
        Laya.loader._createLoad(url);
        var load = Laya.LoaderManager["_resMap"][url];
        load.once(Laya.Event.COMPLETE, this, this.__onlsUrlOk, [url]);
    };
    WmyLoad3d.prototype.__onlsUrlOk = function (url, d) {
        var s0 = url.split("/");
        var s1 = url.replace(s0[s0.length - 1], "");
        var rootUrl = s1;
        var jsObj = JSON.parse(d);
        this._mArr = [];
        this.__tiQuUrl(jsObj["data"], rootUrl);
        for (var i = 0; i < this._mArr.length; i++) {
            url = this._mArr[i];
            Laya.loader.create(url, Laya.Handler.create(this, this.__onLoadOk));
            //Laya.loader.create(url,Laya.Handler.create(this,this.__onLoadOk),undefined,undefined,undefined,undefined,undefined,undefined,group);
        }
    };
    WmyLoad3d.prototype.__onLoadOk = function () {
        var _this_1 = this;
        this._mNum += 1;
        this._pNum = this._mNum / this._mArr.length;
        this.__onLoadP(null);
        if (this._mNum >= this._mArr.length) {
            Laya.loader.create(this._urlList, Laya.Handler.create(this, function () {
                if (_this_1._callbackOk != null) {
                    _this_1._callbackOk.run();
                }
                _this_1._urlList = null;
                _this_1._callbackOk = null;
                _this_1._callbackProgress = null;
                _this_1._mArr = null;
            }), Laya.Handler.create(this, this.__onLoadP));
        }
    };
    WmyLoad3d.prototype.__onLoadP = function (p) {
        var pNum = this._pNum * 0.7;
        if (p) {
            pNum += p * 0.25;
        }
        if (this._callbackProgress != null) {
            this._callbackProgress.runWith([pNum]);
        }
    };
    // private _mP=0;
    // private _mP2=0;
    // private __onArrP(p){
    //     var pNum=p*(this._mNum+1);
    //     if(pNum>this._mP)this._mP=pNum;
    //     this._mP2=(this._mP/this._mArr.length);
    //     var pNum=(this._mP2)*0.98;
    //     if(this._callbackProgress!=null){
    //         this._callbackProgress.runWith([pNum]);
    //     }
    // }
    // private __onArrOk(){
    //     this._mNum+=1;
    //     if(this._mNum>=this._mArr.length){
    //         Laya.loader.create(this._urlList,Laya.Handler.create(this,()=>{
    //             if(this._callbackOk!=null){
    //                 this._callbackOk.run();
    //             }
    //             this._urlList=null;
    //             this._callbackOk=null;
    //             this._callbackProgress=null;
    //             this._mArr=null;
    //         }));
    //     }
    // }
    WmyLoad3d.prototype.__tiQuUrl = function (obj, url) {
        if (url === void 0) { url = ""; }
        if (obj["props"] != null && obj["props"]["meshPath"] != null) {
            var meshPath = url + obj["props"]["meshPath"];
            if (this._mArr.indexOf(meshPath) < 0) {
                this._mArr.push(meshPath);
            }
            var materials = obj["props"]["materials"];
            if (materials != null) {
                for (var ii = 0; ii < materials.length; ii++) {
                    var path = url + materials[ii]["path"];
                    if (this._mArr.indexOf(path) < 0) {
                        this._mArr.push(path);
                    }
                }
            }
        }
        if (obj["components"] != null) {
            var components = obj["components"];
            if (components.length > 0) {
                for (var i0 = 0; i0 < components.length; i0++) {
                    var comp = components[i0];
                    if (comp["avatar"] != null) {
                        var apath = url + comp["avatar"]["path"];
                        if (this._mArr.indexOf(apath) < 0) {
                            this._mArr.push(apath);
                        }
                    }
                    if (comp["layers"] != null) {
                        var layers = comp["layers"];
                        for (var i1 = 0; i1 < layers.length; i1++) {
                            var layer = layers[i1];
                            var states = layer["states"];
                            for (var i2 = 0; i2 < states.length; i2++) {
                                var state = states[i2];
                                var clipPath = url + state["clipPath"];
                                if (this._mArr.indexOf(clipPath) < 0) {
                                    this._mArr.push(clipPath);
                                }
                            }
                        }
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
    //
    WmyLoad3d.prototype.clearRes = function (url) {
        if (!url || url.indexOf("/") < 0)
            return;
        var u0 = url.split("/");
        var u1 = url.replace(u0[u0.length - 1], "");
        var urls = [];
        for (var key in Laya.Loader.loadedMap) {
            if (Laya.Loader.loadedMap.hasOwnProperty(key)) {
                var loadUrl = key;
                if (loadUrl.indexOf(u1) >= 0 || loadUrl.indexOf("res/mats/") >= 0) {
                    if (urls.indexOf(loadUrl) < 0) {
                        urls.push(loadUrl);
                    }
                }
            }
        }
        for (var i = 0; i < urls.length; i++) {
            var url_1 = urls[i];
            try {
                //根据资源路径获取资源（Resource为材质、贴图、网格等的基类）
                var res = Laya.loader.getRes(url_1);
                if (!res.lock) {
                    res.destroy();
                    //资源释放
                    res.releaseResource(true);
                }
            }
            catch (error) { }
            try {
                Laya.loader.clearRes(url_1);
                //Laya.loader.clearUnLoaded();
            }
            catch (error) { }
        }
    };
    WmyLoad3d.idResourcesMapLock = function (target, isLock) {
        if (isLock === void 0) { isLock = true; }
        if (target == null)
            return;
        var objList = WmyUtils3D_1.WmyUtils3D.getChildrenComponent(target, Laya.RenderableSprite3D);
        var kIds = [];
        for (var i in objList) {
            var obj = objList[i];
            WmyLoad3d._loopLock(obj, kIds);
        }
        var rMap = Laya.Resource["_idResourcesMap"];
        for (var k in kIds) {
            var o = kIds[k];
            var res = rMap[o];
            res.lock = isLock;
        }
    };
    WmyLoad3d._loopLock = function (obj, arr) {
        WmyLoad3d._Mesh(obj, arr);
        WmyLoad3d._Materials(obj, arr);
        for (var k in obj) {
            var o = obj[k];
            if (o instanceof Laya.BaseRender) {
                WmyLoad3d._loopLock(o, arr);
            }
        }
    };
    WmyLoad3d._Mesh = function (obj, arr) {
        for (var k in obj) {
            var o = obj[k];
            if (o instanceof Laya.Mesh) {
                WmyLoad3d._getResourcesMapId(o, arr);
                var _vertexBuffers = o["_vertexBuffers"];
                if (_vertexBuffers) {
                    for (var k0 in _vertexBuffers) {
                        var o0 = _vertexBuffers[k0];
                        if (o0 instanceof Laya.VertexBuffer3D) {
                            WmyLoad3d._getResourcesMapId(o0, arr);
                        }
                    }
                }
                for (var k1 in o) {
                    var o1 = o[k1];
                    if (o1 instanceof Laya.IndexBuffer3D) {
                        WmyLoad3d._getResourcesMapId(o1, arr);
                    }
                }
            }
        }
    };
    WmyLoad3d._Materials = function (obj, arr) {
        var _materials = obj["_materials"];
        if (_materials) {
            for (var k in _materials) {
                var o = _materials[k];
                if (o instanceof Laya.BaseMaterial) {
                    WmyLoad3d._getResourcesMapId(o, arr);
                    WmyLoad3d._Shader(o, arr);
                    WmyLoad3d._ShaderData(o, arr);
                }
            }
        }
    };
    WmyLoad3d._Shader = function (obj, arr) {
        for (var k in obj) {
            var o = obj[k];
            if (o instanceof Laya.Shader3D) {
                WmyLoad3d._getResourcesMapId(o, arr);
            }
        }
    };
    WmyLoad3d._ShaderData = function (obj, arr) {
        for (var k in obj) {
            var o = obj[k];
            if (o instanceof Laya.ShaderData) {
                WmyLoad3d._BaseTexture(o["_data"], arr);
            }
        }
    };
    WmyLoad3d._BaseTexture = function (obj, arr) {
        for (var k in obj) {
            var o = obj[k];
            if (o instanceof Laya.BaseTexture) {
                WmyLoad3d._getResourcesMapId(o, arr);
            }
        }
    };
    WmyLoad3d._getResourcesMapId = function (obj, arr) {
        var rMap = Laya.Resource["_idResourcesMap"];
        for (var k in rMap) {
            var res = rMap[k];
            if (obj == res) {
                if (arr.indexOf(k) < 0) {
                    arr.push(k);
                }
            }
        }
    };
    return WmyLoad3d;
}());
exports.WmyLoad3d = WmyLoad3d;
},{"./WmyUtils3D":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyLoadMats = /** @class */ (function () {
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
            // var txt=Laya.loader.getRes(url);
            // var jsObj=JSON.parse(txt);
            var jsObj = Laya.loader.getRes(url);
            var arr = url.split("/");
            var matsUrl = url.replace(arr[arr.length - 1], "");
            var array = [];
            try {
                array = jsObj["mats"];
            }
            catch (error) { }
            for (var j = 0; j < array.length; j++) {
                var obj = array[j];
                if (obj["targetName"] == "")
                    continue;
                var matUrl = matsUrl + obj["matUrl"];
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
exports.WmyLoadMats = WmyLoadMats;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyUtils3D_1 = require("./WmyUtils3D");
var WmyScript3D = /** @class */ (function (_super) {
    __extends(WmyScript3D, _super);
    function WmyScript3D() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WmyScript3D.prototype.del = function (destroyChild) {
        if (destroyChild === void 0) { destroyChild = true; }
        this.owner3D.destroy(destroyChild);
    };
    WmyScript3D.prototype.onDestroy = function () {
        this.owner3D = null;
        this.scene3D = null;
        this.onDel();
    };
    WmyScript3D.prototype.onDel = function () {
    };
    WmyScript3D.prototype._onAdded = function () {
        _super.prototype._onAdded.call(this);
        this.owner3D = this.owner;
        this._localScale = new Laya.Vector3(0, 0, 0);
        if (this.owner3D.transform) {
            this._localScale = this.owner3D.transform.localScale.clone();
        }
        this.scene3D = this.owner3D.scene;
    };
    //是否可见
    WmyScript3D.prototype.setShow = function (v) {
        this.owner3D.transform.localScale = !v ? new Laya.Vector3(0, 0, 0) : this._localScale;
    };
    //
    WmyScript3D.prototype.getObj3dUrl = function (target, url) {
        return WmyUtils3D_1.WmyUtils3D.getObj3dUrl(target, url);
    };
    return WmyScript3D;
}(Laya.Script3D));
exports.WmyScript3D = WmyScript3D;
},{"./WmyUtils3D":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyUtils3D = /** @class */ (function () {
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
    WmyUtils3D.getObj3dUrl = function (target, url) {
        var arrUrl = url.split('/');
        return this._getObjArrUrl(target, arrUrl);
    };
    WmyUtils3D._getObjArrUrl = function (target, urlArr, id) {
        if (id === void 0) { id = 0; }
        var _target = target;
        if (_target == null)
            return null;
        var na = urlArr[id];
        var targetObj = _target.getChildByName(na);
        if (targetObj == null)
            return null;
        if (id >= urlArr.length - 1) {
            return targetObj;
        }
        else {
            targetObj = this._getObjArrUrl(targetObj, urlArr, ++id);
        }
        return targetObj;
    };
    WmyUtils3D.getChildrenComponent = function (target, clas, arr) {
        if (arr == null)
            arr = [];
        if (target == null) {
            return arr;
        }
        var obj = target.getComponent(clas);
        if (obj == null) {
            if (target instanceof clas) {
                obj = target;
            }
        }
        if (obj != null && arr.indexOf(obj) < 0) {
            arr.push(obj);
        }
        if (target._children == null)
            return arr;
        for (var i = 0; i < target._children.length; i++) {
            var o = target._children[i];
            this.getChildrenComponent(o, clas, arr);
        }
        return arr;
    };
    WmyUtils3D.instantiate = function (target, targetName) {
        if (target == null)
            return null;
        var _target = null;
        if (targetName) {
            var tempObj = WmyUtils3D.getObj3d(target, targetName);
            if (tempObj) {
                _target = Laya.Sprite3D.instantiate(tempObj);
            }
        }
        else {
            _target = Laya.Sprite3D.instantiate(target);
        }
        return _target;
    };
    /**
     * 激活阴影。
     * @param	directionLight 直线光
     * @param	shadowResolution 生成阴影贴图尺寸
     * @param	shadowPCFType 模糊等级,越大越高,更耗性能
     * @param	shadowDistance 可见阴影距离
     */
    WmyUtils3D.onShadow = function (directionLight, shadowResolution, shadowPCFType, shadowDistance, isShadow) {
        if (shadowResolution === void 0) { shadowResolution = 512; }
        if (shadowPCFType === void 0) { shadowPCFType = 1; }
        if (shadowDistance === void 0) { shadowDistance = 15; }
        if (isShadow === void 0) { isShadow = true; }
        //灯光开启阴影
        directionLight.shadow = isShadow;
        //可见阴影距离
        directionLight.shadowDistance = shadowDistance;
        //生成阴影贴图尺寸
        directionLight.shadowResolution = shadowResolution;
        directionLight.shadowPSSMCount = 1;
        //模糊等级,越大越高,更耗性能
        directionLight.shadowPCFType = shadowPCFType;
    };
    /**
     * 激活阴影。
     * @param	target
     * @param	type 0接收阴影,1产生阴影,2接收阴影产生阴影
     * @param	isShadow 是否阴影
     * @param	isChildren 是否子对象
     */
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
    WmyUtils3D.hex2rgb = function (hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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
    WmyUtils3D.getRayCastAll = function (cam, viewportPoint, ray, collisonGroup, collisionMask) {
        var _outHitAllInfo = new Array();
        var _ray = ray;
        if (!_ray) {
            _ray = new Laya.Ray(new Laya.Vector3(), new Laya.Vector3());
        }
        //从屏幕空间生成射线
        var _point = viewportPoint.clone();
        cam.viewportPointToRay(_point, _ray);
        //射线检测获取所有检测碰撞到的物体
        if (cam.scene != null && cam.scene.physicsSimulation != null) {
            cam.scene.physicsSimulation.rayCastAll(_ray, _outHitAllInfo, 10000, collisonGroup, collisionMask);
        }
        return _outHitAllInfo;
    };
    //距离
    WmyUtils3D.Distance = function (a, b) {
        var dx = Math.abs(a.x - b.x);
        var dy = Math.abs(a.y - b.y);
        var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        d = parseFloat(d.toFixed(2));
        return d;
    };
    //动画-----------------------------------------------------
    WmyUtils3D.aniPlay = function (target, targetName, aniName, normalizedTime, completeEvent, params, layerIndex) {
        var target3d = target;
        if (targetName != null) {
            target3d = this.getObj3d(target, targetName);
        }
        if (target3d == null)
            return null;
        var target3d_ani = target3d.getComponent(Laya.Animator);
        if (target3d_ani == null)
            return null;
        if (completeEvent) {
            WmyUtils3D.aniAddEventFun(target3d, null, aniName, -1, completeEvent, true, params, layerIndex);
        }
        target3d_ani.play(aniName, layerIndex, normalizedTime);
        return target3d_ani;
    };
    WmyUtils3D.aniAddEventFun = function (target, targetName, aniName, time, callback, isEventOne, params, layerIndex) {
        if (isEventOne === void 0) { isEventOne = true; }
        var target3d = target;
        if (targetName != null) {
            target3d = this.getObj3d(target, targetName);
        }
        if (target3d == null)
            return null;
        var target3d_ani = target3d.getComponent(Laya.Animator);
        if (target3d_ani == null)
            return null;
        WmyUtils3D._aniAddEvent(target3d_ani, null, aniName, "_wmy_ani_callback", time, params, layerIndex);
        var wae = target3d.getComponent(__WmyAniEvent);
        if (!wae) {
            wae = target3d.addComponent(__WmyAniEvent);
        }
        var callbackName = "wmy_" + callback.caller.id + aniName + time;
        if (isEventOne) {
            Laya.stage.once(callbackName, this, function (_callbackName, _callback, p) {
                _callback.runWith(p);
                wae.delCallback(_callbackName);
            }, [callbackName, callback]);
        }
        else {
            Laya.stage.on(callbackName, this, function (_callbackName, _callback, p) {
                _callback.runWith(p);
            }, [callbackName, callback]);
        }
        wae.addCallback(callbackName);
    };
    WmyUtils3D.aniDelEventFun = function (target, targetName, callback) {
        var target3d = target;
        if (targetName != null) {
            target3d = this.getObj3d(target, targetName);
        }
        if (target3d == null)
            return null;
        var target3d_ani = target3d.getComponent(Laya.Animator);
        if (target3d_ani == null)
            return null;
        var wae = target3d.getComponent(__WmyAniEvent);
        if (wae) {
            var callbackName = "wmy_" + callback.caller.name + callback.method.toString();
            Laya.stage.on(callbackName, callback.caller, callback.method);
            wae.delCallback(callbackName);
        }
    };
    WmyUtils3D._aniAddEvent = function (target, targetName, aniName, eventName, time, params, layerIndex) {
        var target3d = null;
        var target3d_ani = null;
        if (target instanceof Laya.Sprite3D) {
            target3d = target;
            if (targetName != null) {
                target3d = this.getObj3d(target, targetName);
            }
            if (target3d == null)
                return null;
            target3d_ani = target3d.getComponent(Laya.Animator);
        }
        else if (target instanceof Laya.Animator) {
            target3d_ani = target;
        }
        if (target3d_ani == null)
            return null;
        var animatorState = target3d_ani.getControllerLayer(layerIndex)._statesMap[aniName];
        if (animatorState == null)
            return null;
        var isAdd = true;
        var events = animatorState._clip._events;
        for (var key in events) {
            if (events.hasOwnProperty(key)) {
                var event_1 = events[key];
                if (event_1.eventName == eventName && aniEvent.time) {
                    isAdd = false;
                    break;
                }
            }
        }
        if (isAdd) {
            var aniEvent = new Laya.AnimationEvent();
            aniEvent.eventName = eventName;
            var clipDuration = animatorState._clip._duration;
            if (time == -1) {
                time = clipDuration;
            }
            aniEvent.time = time / clipDuration;
            aniEvent.params = params;
            animatorState._clip.addEvent(aniEvent);
        }
        return target3d_ani;
    };
    WmyUtils3D.aniAddScript = function (target, targetName, aniName, script, layerIndex) {
        var target3d = target;
        if (targetName != null) {
            target3d = this.getObj3d(target, targetName);
        }
        if (target3d == null)
            return null;
        var target3d_ani = target3d.getComponent(Laya.Animator);
        if (target3d_ani == null)
            return null;
        var animatorState = target3d_ani.getControllerLayer(layerIndex)._statesMap[aniName];
        if (animatorState == null)
            return null;
        animatorState.addScript(script);
        return animatorState;
    };
    return WmyUtils3D;
}());
exports.WmyUtils3D = WmyUtils3D;
var __WmyAniEvent = /** @class */ (function (_super) {
    __extends(__WmyAniEvent, _super);
    function __WmyAniEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._callback = [];
        return _this;
    }
    __WmyAniEvent.prototype.addCallback = function (callbackName) {
        var indexId = this._callback.indexOf(callbackName);
        if (indexId < 0) {
            this._callback.push(callbackName);
        }
    };
    __WmyAniEvent.prototype.delCallback = function (callbackName) {
        var indexId = this._callback.indexOf(callbackName);
        if (indexId >= 0) {
            this._callback.splice(indexId, 1);
        }
    };
    __WmyAniEvent.prototype._wmy_ani_callback = function (params) {
        for (var i = 0; i < this._callback.length; i++) {
            var callbackName = this._callback[i];
            Laya.stage.event(callbackName, params);
        }
    };
    return __WmyAniEvent;
}(Laya.Script3D));
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyScript3D_1 = require("../WmyScript3D");
var WmyC4DVetexAnimator = /** @class */ (function (_super) {
    __extends(WmyC4DVetexAnimator, _super);
    function WmyC4DVetexAnimator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WmyC4DVetexAnimator.prototype.onAwake = function () {
        this._anir = this.owner3D.getComponent(Laya.Animator);
        if (this._anir == null) {
            this.enabled = false;
            return;
        }
        // this.owner3D.on("ani_play",this,this.onPlay);
        var objs = this._anir._renderableSprites;
        for (var i = 0; i < objs.length; i++) {
            var vetexT = null;
            var meshObj = objs[i];
            for (var j = 0; j < meshObj.numChildren; j++) {
                var cObj = meshObj.getChildAt(i);
                if (cObj.name.indexOf("Vetex_Handle") >= 0) {
                    vetexT = cObj;
                    break;
                }
            }
            if (vetexT != null) {
                this._verticesObj = vetexT;
            }
            //meshObj._render.enable=false;
        }
        if (this._verticesObj == null) {
            this.enabled = false;
            return;
        }
        this.onInitVertex();
    };
    WmyC4DVetexAnimator.prototype.onInitVertex = function () {
        this._mesh = this._verticesObj.parent["meshFilter"];
        if (!this._mesh) {
            this.enabled = false;
            return;
        }
        if (this._verticesObj.numChildren > 0) {
            this._vertexArray = [];
            for (var i = 0; i < this._verticesObj.numChildren; i++) {
                this._vertexArray[i] = this._verticesObj.getChildAt(i).transform;
            }
        }
        if (!this._vertexArray) {
            this.enabled = false;
            return;
        }
        this._vertexBuffers = this._mesh.sharedMesh["_vertexBuffers"];
        this._mCacheVerticesArr = this._mesh.sharedMesh._getPositions();
        this._mMappingVetexInfoArr = [];
        for (var i = 0; i < this._vertexArray.length; i++) {
            var item = this._vertexArray[i];
            this._mMappingVetexInfoArr[i] = {};
            this._mMappingVetexInfoArr[i].TransformInfo = item;
            var mIndexList = [];
            for (var j = 0; j < this._mCacheVerticesArr.length; j++) {
                var vertexPos = this._mCacheVerticesArr[j];
                var d = Laya.Vector3.distance(vertexPos, item.localPosition);
                if (d <= 0.01) {
                    mIndexList.push(j);
                }
            }
            this._mMappingVetexInfoArr[i].VetexIDArr = mIndexList;
        }
    };
    WmyC4DVetexAnimator.prototype.onLateUpdate = function () {
        if (this.owner3D.transform.localScale.x == 0 && this.owner3D.transform.localScale.y == 0 && this.owner3D.transform.localScale.z == 0)
            return;
        if (this._anir.speed == 0)
            return;
        var playState = this._anir.getCurrentAnimatorPlayState();
        if (playState._finish)
            return;
        for (var i = 0; i < this._mMappingVetexInfoArr.length; i++) {
            var item = this._mMappingVetexInfoArr[i];
            for (var j = 0; j < item.VetexIDArr.length; j++) {
                var vertexID = item.VetexIDArr[j];
                var pos = item.TransformInfo.localPosition;
                this._mCacheVerticesArr[vertexID] = pos;
            }
        }
        this._vertexs_setPositions(this._vertexBuffers, this._mCacheVerticesArr);
    };
    WmyC4DVetexAnimator.prototype._vertexs_getPositions = function (vertexBuffers) {
        var vertices = [];
        var i = 0, j = 0, vertexBuffer, positionElement, vertexElements, vertexElement, ofset = 0, verticesData;
        var vertexBufferCount = vertexBuffers.length;
        for (i = 0; i < vertexBufferCount; i++) {
            vertexBuffer = vertexBuffers[i];
            vertexElements = vertexBuffer.vertexDeclaration.vertexElements;
            for (j = 0; j < vertexElements.length; j++) {
                vertexElement = vertexElements[j];
                if (vertexElement.elementFormat === /*laya.d3.graphics.VertexElementFormat.Vector3*/ "vector3" && vertexElement.elementUsage === /*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/ 0) {
                    positionElement = vertexElement;
                    break;
                }
            }
            verticesData = vertexBuffer.getData();
            for (j = 0; j < verticesData.length; j += vertexBuffer.vertexDeclaration.vertexStride / 4) {
                ofset = j + positionElement.offset / 4;
                vertices.push(new Laya.Vector3(verticesData[ofset + 0], verticesData[ofset + 1], verticesData[ofset + 2]));
            }
        }
        return vertices;
    };
    WmyC4DVetexAnimator.prototype._vertexs_setPositions = function (vertexBuffers, vertices) {
        var i = 0, j = 0, vertexBuffer, positionElement, vertexElements, vertexElement, ofset = 0, verticesData, vertice;
        var vertexBufferCount = vertexBuffers.length;
        for (i = 0; i < vertexBufferCount; i++) {
            vertexBuffer = vertexBuffers[i];
            vertexElements = vertexBuffer.vertexDeclaration.vertexElements;
            for (j = 0; j < vertexElements.length; j++) {
                vertexElement = vertexElements[j];
                if (vertexElement.elementFormat === /*laya.d3.graphics.VertexElementFormat.Vector3*/ "vector3" && vertexElement.elementUsage === /*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/ 0) {
                    positionElement = vertexElement;
                    break;
                }
            }
            verticesData = vertexBuffer.getData();
            var n = 0;
            for (j = 0; j < verticesData.length; j += vertexBuffer.vertexDeclaration.vertexStride / 4) {
                vertice = vertices[n];
                ofset = j + positionElement.offset / 4;
                verticesData[ofset + 0] = vertice.x;
                verticesData[ofset + 1] = vertice.y;
                verticesData[ofset + 2] = vertice.z;
                n++;
            }
            vertexBuffer.setData(verticesData);
        }
    };
    WmyC4DVetexAnimator.prototype.onGetWorldPos = function (target, pos) {
        var outPos = new Laya.Vector3();
        if (target._parent != null) {
            var parentPosition = target.parent.transform.position;
            Laya.Vector3.multiply(pos, target.parent.transform.scale, Laya.Transform3D["_tempVector30"]);
            Laya.Vector3.transformQuat(Laya.Transform3D["_tempVector30"], target.parent.transform.rotation, Laya.Transform3D["_tempVector30"]);
            Laya.Vector3.add(parentPosition, Laya.Transform3D["_tempVector30"], outPos);
        }
        else {
            pos.cloneTo(outPos);
        }
        return outPos;
    };
    return WmyC4DVetexAnimator;
}(WmyScript3D_1.WmyScript3D));
exports.default = WmyC4DVetexAnimator;
},{"../WmyScript3D":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WEaseType_1 = require("./WEaseType");
var WEaseManager = /** @class */ (function () {
    function WEaseManager() {
    }
    WEaseManager.evaluate = function (easeType, time, duration, overshootOrAmplitude, period) {
        switch (easeType) {
            case WEaseType_1.WEaseType.Linear:
                return time / duration;
            case WEaseType_1.WEaseType.SineIn:
                return -Math.cos(time / duration * WEaseManager._PiOver2) + 1;
            case WEaseType_1.WEaseType.SineOut:
                return Math.sin(time / duration * WEaseManager._PiOver2);
            case WEaseType_1.WEaseType.SineInOut:
                return -0.5 * (Math.cos(Math.PI * time / duration) - 1);
            case WEaseType_1.WEaseType.QuadIn:
                return (time /= duration) * time;
            case WEaseType_1.WEaseType.QuadOut:
                return -(time /= duration) * (time - 2);
            case WEaseType_1.WEaseType.QuadInOut:
                if ((time /= duration * 0.5) < 1)
                    return 0.5 * time * time;
                return -0.5 * ((--time) * (time - 2) - 1);
            case WEaseType_1.WEaseType.CubicIn:
                return (time /= duration) * time * time;
            case WEaseType_1.WEaseType.CubicOut:
                return ((time = time / duration - 1) * time * time + 1);
            case WEaseType_1.WEaseType.CubicInOut:
                if ((time /= duration * 0.5) < 1)
                    return 0.5 * time * time * time;
                return 0.5 * ((time -= 2) * time * time + 2);
            case WEaseType_1.WEaseType.QuartIn:
                return (time /= duration) * time * time * time;
            case WEaseType_1.WEaseType.QuartOut:
                return -((time = time / duration - 1) * time * time * time - 1);
            case WEaseType_1.WEaseType.QuartInOut:
                if ((time /= duration * 0.5) < 1)
                    return 0.5 * time * time * time * time;
                return -0.5 * ((time -= 2) * time * time * time - 2);
            case WEaseType_1.WEaseType.QuintIn:
                return (time /= duration) * time * time * time * time;
            case WEaseType_1.WEaseType.QuintOut:
                return ((time = time / duration - 1) * time * time * time * time + 1);
            case WEaseType_1.WEaseType.QuintInOut:
                if ((time /= duration * 0.5) < 1)
                    return 0.5 * time * time * time * time * time;
                return 0.5 * ((time -= 2) * time * time * time * time + 2);
            case WEaseType_1.WEaseType.ExpoIn:
                return (time == 0) ? 0 : Math.pow(2, 10 * (time / duration - 1));
            case WEaseType_1.WEaseType.ExpoOut:
                if (time == duration)
                    return 1;
                return (-Math.pow(2, -10 * time / duration) + 1);
            case WEaseType_1.WEaseType.ExpoInOut:
                if (time == 0)
                    return 0;
                if (time == duration)
                    return 1;
                if ((time /= duration * 0.5) < 1)
                    return 0.5 * Math.pow(2, 10 * (time - 1));
                return 0.5 * (-Math.pow(2, -10 * --time) + 2);
            case WEaseType_1.WEaseType.CircIn:
                return -(Math.sqrt(1 - (time /= duration) * time) - 1);
            case WEaseType_1.WEaseType.CircOut:
                return Math.sqrt(1 - (time = time / duration - 1) * time);
            case WEaseType_1.WEaseType.CircInOut:
                if ((time /= duration * 0.5) < 1)
                    return -0.5 * (Math.sqrt(1 - time * time) - 1);
                return 0.5 * (Math.sqrt(1 - (time -= 2) * time) + 1);
            case WEaseType_1.WEaseType.ElasticIn:
                var s0;
                if (time == 0)
                    return 0;
                if ((time /= duration) == 1)
                    return 1;
                if (period == 0)
                    period = duration * 0.3;
                if (overshootOrAmplitude < 1) {
                    overshootOrAmplitude = 1;
                    s0 = period / 4;
                }
                else
                    s0 = period / WEaseManager._TwoPi * Math.asin(1 / overshootOrAmplitude);
                return -(overshootOrAmplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - s0) * WEaseManager._TwoPi / period));
            case WEaseType_1.WEaseType.ElasticOut:
                var s1;
                if (time == 0)
                    return 0;
                if ((time /= duration) == 1)
                    return 1;
                if (period == 0)
                    period = duration * 0.3;
                if (overshootOrAmplitude < 1) {
                    overshootOrAmplitude = 1;
                    s1 = period / 4;
                }
                else
                    s1 = period / WEaseManager._TwoPi * Math.asin(1 / overshootOrAmplitude);
                return (overshootOrAmplitude * Math.pow(2, -10 * time) * Math.sin((time * duration - s1) * WEaseManager._TwoPi / period) + 1);
            case WEaseType_1.WEaseType.ElasticInOut:
                var s;
                if (time == 0)
                    return 0;
                if ((time /= duration * 0.5) == 2)
                    return 1;
                if (period == 0)
                    period = duration * (0.3 * 1.5);
                if (overshootOrAmplitude < 1) {
                    overshootOrAmplitude = 1;
                    s = period / 4;
                }
                else
                    s = period / WEaseManager._TwoPi * Math.asin(1 / overshootOrAmplitude);
                if (time < 1)
                    return -0.5 * (overshootOrAmplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - s) * WEaseManager._TwoPi / period));
                return overshootOrAmplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - s) * WEaseManager._TwoPi / period) * 0.5 + 1;
            case WEaseType_1.WEaseType.BackIn:
                return (time /= duration) * time * ((overshootOrAmplitude + 1) * time - overshootOrAmplitude);
            case WEaseType_1.WEaseType.BackOut:
                return ((time = time / duration - 1) * time * ((overshootOrAmplitude + 1) * time + overshootOrAmplitude) + 1);
            case WEaseType_1.WEaseType.BackInOut:
                if ((time /= duration * 0.5) < 1)
                    return 0.5 * (time * time * (((overshootOrAmplitude *= (1.525)) + 1) * time - overshootOrAmplitude));
                return 0.5 * ((time -= 2) * time * (((overshootOrAmplitude *= (1.525)) + 1) * time + overshootOrAmplitude) + 2);
            case WEaseType_1.WEaseType.BounceIn:
                return Bounce.easeIn(time, duration);
            case WEaseType_1.WEaseType.BounceOut:
                return Bounce.easeOut(time, duration);
            case WEaseType_1.WEaseType.BounceInOut:
                return Bounce.easeInOut(time, duration);
            default:
                return -(time /= duration) * (time - 2);
        }
    };
    WEaseManager._PiOver2 = Math.PI * 0.5;
    WEaseManager._TwoPi = Math.PI * 2;
    return WEaseManager;
}());
exports.WEaseManager = WEaseManager;
/// This class contains a C# port of the easing equations created by Robert Penner (http://robertpenner.com/easing).
var Bounce = /** @class */ (function () {
    function Bounce() {
    }
    Bounce.easeIn = function (time, duration) {
        return 1 - Bounce.easeOut(duration - time, duration);
    };
    Bounce.easeOut = function (time, duration) {
        if ((time /= duration) < (1 / 2.75)) {
            return (7.5625 * time * time);
        }
        if (time < (2 / 2.75)) {
            return (7.5625 * (time -= (1.5 / 2.75)) * time + 0.75);
        }
        if (time < (2.5 / 2.75)) {
            return (7.5625 * (time -= (2.25 / 2.75)) * time + 0.9375);
        }
        return (7.5625 * (time -= (2.625 / 2.75)) * time + 0.984375);
    };
    Bounce.easeInOut = function (time, duration) {
        if (time < duration * 0.5) {
            return Bounce.easeIn(time * 2, duration) * 0.5;
        }
        return Bounce.easeOut(time * 2 - duration, duration) * 0.5 + 0.5;
    };
    return Bounce;
}());
exports.Bounce = Bounce;
},{"./WEaseType":10}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WEaseType = /** @class */ (function () {
    function WEaseType() {
    }
    WEaseType.Linear = 0;
    WEaseType.SineIn = 1;
    WEaseType.SineOut = 2;
    WEaseType.SineInOut = 3;
    WEaseType.QuadIn = 4;
    WEaseType.QuadOut = 5;
    WEaseType.QuadInOut = 6;
    WEaseType.CubicIn = 7;
    WEaseType.CubicOut = 8;
    WEaseType.CubicInOut = 9;
    WEaseType.QuartIn = 10;
    WEaseType.QuartOut = 11;
    WEaseType.QuartInOut = 12;
    WEaseType.QuintIn = 13;
    WEaseType.QuintOut = 14;
    WEaseType.QuintInOut = 15;
    WEaseType.ExpoIn = 16;
    WEaseType.ExpoOut = 17;
    WEaseType.ExpoInOut = 18;
    WEaseType.CircIn = 19;
    WEaseType.CircOut = 20;
    WEaseType.CircInOut = 21;
    WEaseType.ElasticIn = 22;
    WEaseType.ElasticOut = 23;
    WEaseType.ElasticInOut = 24;
    WEaseType.BackIn = 25;
    WEaseType.BackOut = 26;
    WEaseType.BackInOut = 27;
    WEaseType.BounceIn = 28;
    WEaseType.BounceOut = 29;
    WEaseType.BounceInOut = 30;
    WEaseType.Custom = 31;
    return WEaseType;
}());
exports.WEaseType = WEaseType;
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WTweenManager_1 = require("./WTweenManager");
var WTween = /** @class */ (function () {
    function WTween() {
    }
    WTween.to = function (start, end, duration) {
        return WTweenManager_1.WTweenManager.createTween()._to(start, end, duration);
    };
    WTween.to2 = function (start, start2, end, end2, duration) {
        return WTweenManager_1.WTweenManager.createTween()._to2(start, start2, end, end2, duration);
    };
    WTween.to3 = function (start, start2, start3, end, end2, end3, duration) {
        return WTweenManager_1.WTweenManager.createTween()._to3(start, start2, start3, end, end2, end3, duration);
    };
    WTween.to4 = function (start, start2, start3, start4, end, end2, end3, end4, duration) {
        return WTweenManager_1.WTweenManager.createTween()._to4(start, start2, start3, start4, end, end2, end3, end4, duration);
    };
    WTween.toColor = function (start, end, duration) {
        return WTweenManager_1.WTweenManager.createTween()._toColor(start, end, duration);
    };
    WTween.delayedCall = function (delay) {
        return WTweenManager_1.WTweenManager.createTween().setDelay(delay);
    };
    WTween.shake = function (startX, startY, amplitude, duration) {
        return WTweenManager_1.WTweenManager.createTween()._shake(startX, startY, amplitude, duration);
    };
    WTween.isTweening = function (target, propType) {
        return WTweenManager_1.WTweenManager.isTweening(target, propType);
    };
    WTween.kill = function (target, complete, propType) {
        if (complete === void 0) { complete = false; }
        if (propType === void 0) { propType = null; }
        WTweenManager_1.WTweenManager.killTweens(target, false, null);
    };
    WTween.getTween = function (target, propType) {
        if (propType === void 0) { propType = null; }
        return WTweenManager_1.WTweenManager.getTween(target, propType);
    };
    WTween.catchCallbackExceptions = true;
    return WTween;
}());
exports.WTween = WTween;
},{"./WTweenManager":12}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WTweener_1 = require("./WTweener");
var WTweenManager = /** @class */ (function () {
    function WTweenManager() {
    }
    WTweenManager.createTween = function () {
        if (!WTweenManager._inited) {
            Laya.timer.frameLoop(1, null, this.update);
            WTweenManager._inited = true;
        }
        var tweener;
        var cnt = WTweenManager._tweenerPool.length;
        if (cnt > 0) {
            tweener = WTweenManager._tweenerPool.pop();
        }
        else
            tweener = new WTweener_1.WTweener();
        tweener._init();
        WTweenManager._activeTweens[WTweenManager._totalActiveTweens++] = tweener;
        if (WTweenManager._totalActiveTweens == WTweenManager._activeTweens.length)
            WTweenManager._activeTweens.length = WTweenManager._activeTweens.length + Math.ceil(WTweenManager._activeTweens.length * 0.5);
        return tweener;
    };
    WTweenManager.isTweening = function (target, propType) {
        if (target == null)
            return false;
        var anyType = propType == null;
        for (var i = 0; i < WTweenManager._totalActiveTweens; i++) {
            var tweener = WTweenManager._activeTweens[i];
            if (tweener != null && tweener.target == target && !tweener._killed
                && (anyType || tweener._propType == propType))
                return true;
        }
        return false;
    };
    WTweenManager.killTweens = function (target, completed, propType) {
        if (completed === void 0) { completed = false; }
        if (propType === void 0) { propType = null; }
        if (target == null)
            return false;
        var flag = false;
        var cnt = WTweenManager._totalActiveTweens;
        var anyType = propType == null;
        for (var i = 0; i < cnt; i++) {
            var tweener = WTweenManager._activeTweens[i];
            if (tweener != null && tweener.target == target && !tweener._killed
                && (anyType || tweener._propType == propType)) {
                tweener.kill(completed);
                flag = true;
            }
        }
        return flag;
    };
    WTweenManager.getTween = function (target, propType) {
        if (target == null)
            return null;
        var cnt = WTweenManager._totalActiveTweens;
        var anyType = propType == null;
        for (var i = 0; i < cnt; i++) {
            var tweener = WTweenManager._activeTweens[i];
            if (tweener != null && tweener.target == target && !tweener._killed
                && (anyType || tweener._propType == propType)) {
                return tweener;
            }
        }
        return null;
    };
    WTweenManager.update = function () {
        var dt = Laya.timer.delta / 1000;
        var cnt = WTweenManager._totalActiveTweens;
        var freePosStart = -1;
        var freePosCount = 0;
        for (var i = 0; i < cnt; i++) {
            var tweener = WTweenManager._activeTweens[i];
            if (tweener == null) {
                if (freePosStart == -1)
                    freePosStart = i;
                freePosCount++;
            }
            else if (tweener._killed) {
                tweener._reset();
                WTweenManager._tweenerPool.push(tweener);
                WTweenManager._activeTweens[i] = null;
                if (freePosStart == -1)
                    freePosStart = i;
                freePosCount++;
            }
            else {
                if (!tweener._paused)
                    tweener._update(dt);
                if (freePosStart != -1) {
                    WTweenManager._activeTweens[freePosStart] = tweener;
                    WTweenManager._activeTweens[i] = null;
                    freePosStart++;
                }
            }
        }
        if (freePosStart >= 0) {
            if (WTweenManager._totalActiveTweens != cnt) //new tweens added
             {
                var j = cnt;
                cnt = WTweenManager._totalActiveTweens - cnt;
                for (i = 0; i < cnt; i++)
                    WTweenManager._activeTweens[freePosStart++] = WTweenManager._activeTweens[j++];
            }
            WTweenManager._totalActiveTweens = freePosStart;
        }
    };
    WTweenManager._activeTweens = new Array(30);
    WTweenManager._tweenerPool = [];
    WTweenManager._totalActiveTweens = 0;
    WTweenManager._inited = false;
    return WTweenManager;
}());
exports.WTweenManager = WTweenManager;
},{"./WTweener":14}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WTweenValue = /** @class */ (function () {
    function WTweenValue() {
        this.x = this.y = this.z = this.w = 0;
    }
    Object.defineProperty(WTweenValue.prototype, "color", {
        get: function () {
            return (this.w << 24) + (this.x << 16) + (this.y << 8) + this.z;
        },
        set: function (value) {
            this.x = (value & 0xFF0000) >> 16;
            this.y = (value & 0x00FF00) >> 8;
            this.z = (value & 0x0000FF);
            this.w = (value & 0xFF000000) >> 24;
        },
        enumerable: true,
        configurable: true
    });
    WTweenValue.prototype.getField = function (index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            case 3:
                return this.w;
            default:
                throw new Error("Index out of bounds: " + index);
        }
    };
    WTweenValue.prototype.setField = function (index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            case 3:
                this.w = value;
                break;
            default:
                throw new Error("Index out of bounds: " + index);
        }
    };
    WTweenValue.prototype.setZero = function () {
        this.x = this.y = this.z = this.w = 0;
    };
    return WTweenValue;
}());
exports.WTweenValue = WTweenValue;
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WTweenValue_1 = require("./WTweenValue");
var WEaseType_1 = require("./WEaseType");
var WTween_1 = require("./WTween");
var WEaseManager_1 = require("./WEaseManager");
var WTweener = /** @class */ (function () {
    function WTweener() {
        this._startValue = new WTweenValue_1.WTweenValue();
        this._endValue = new WTweenValue_1.WTweenValue();
        this._value = new WTweenValue_1.WTweenValue();
        this._deltaValue = new WTweenValue_1.WTweenValue();
        this._reset();
    }
    WTweener.prototype.setDelay = function (value) {
        this._delay = value;
        return this;
    };
    Object.defineProperty(WTweener.prototype, "delay", {
        get: function () {
            return this._delay;
        },
        enumerable: true,
        configurable: true
    });
    WTweener.prototype.setDuration = function (value) {
        this._duration = value;
        return this;
    };
    Object.defineProperty(WTweener.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        enumerable: true,
        configurable: true
    });
    WTweener.prototype.setBreakpoint = function (value) {
        this._breakpoint = value;
        return this;
    };
    WTweener.prototype.setEase = function (value) {
        this._easeType = value;
        return this;
    };
    WTweener.prototype.setEasePeriod = function (value) {
        this._easePeriod = value;
        return this;
    };
    WTweener.prototype.setEaseOvershootOrAmplitude = function (value) {
        this._easeOvershootOrAmplitude = value;
        return this;
    };
    WTweener.prototype.setRepeat = function (repeat, yoyo) {
        if (yoyo === void 0) { yoyo = false; }
        this._repeat = this.repeat;
        this._yoyo = yoyo;
        return this;
    };
    Object.defineProperty(WTweener.prototype, "repeat", {
        get: function () {
            return this._repeat;
        },
        enumerable: true,
        configurable: true
    });
    WTweener.prototype.setTimeScale = function (value) {
        this._timeScale = value;
        return this;
    };
    WTweener.prototype.setSnapping = function (value) {
        this._snapping = value;
        return this;
    };
    WTweener.prototype.setTarget = function (value, propType) {
        if (propType === void 0) { propType = null; }
        this._target = this.value;
        this._propType = propType;
        return this;
    };
    Object.defineProperty(WTweener.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    WTweener.prototype.setUserData = function (value) {
        this._userData = this.value;
        return this;
    };
    Object.defineProperty(WTweener.prototype, "userData", {
        get: function () {
            return this._userData;
        },
        enumerable: true,
        configurable: true
    });
    WTweener.prototype.onUpdate = function (callback, caller) {
        this._onUpdate = callback;
        this._onUpdateCaller = caller;
        return this;
    };
    WTweener.prototype.onStart = function (callback, caller) {
        this._onStart = callback;
        this._onStartCaller = caller;
        return this;
    };
    WTweener.prototype.onComplete = function (callback, caller) {
        this._onComplete = callback;
        this._onCompleteCaller = caller;
        return this;
    };
    Object.defineProperty(WTweener.prototype, "startValue", {
        get: function () {
            return this._startValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WTweener.prototype, "endValue", {
        get: function () {
            return this._endValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WTweener.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WTweener.prototype, "deltaValue", {
        get: function () {
            return this._deltaValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WTweener.prototype, "normalizedTime", {
        get: function () {
            return this._normalizedTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WTweener.prototype, "completed", {
        get: function () {
            return this._ended != 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WTweener.prototype, "allCompleted", {
        get: function () {
            return this._ended == 1;
        },
        enumerable: true,
        configurable: true
    });
    WTweener.prototype.setPaused = function (paused) {
        this._paused = paused;
        return this;
    };
    /**
      * this.seek position of the tween, in seconds.
      */
    WTweener.prototype.seek = function (time) {
        if (this._killed)
            return;
        this._elapsedTime = time;
        if (this._elapsedTime < this._delay) {
            if (this._started)
                this._elapsedTime = this._delay;
            else
                return;
        }
        this.update();
    };
    WTweener.prototype.kill = function (complete) {
        if (complete === void 0) { complete = false; }
        if (this._killed)
            return;
        if (complete) {
            if (this._ended == 0) {
                if (this._breakpoint >= 0)
                    this._elapsedTime = this._delay + this._breakpoint;
                else if (this._repeat >= 0)
                    this._elapsedTime = this._delay + this._duration * (this._repeat + 1);
                else
                    this._elapsedTime = this._delay + this._duration * 2;
                this.update();
            }
            this.callCompleteCallback();
        }
        this._killed = true;
    };
    WTweener.prototype._to = function (start, end, duration) {
        this._valueSize = 1;
        this._startValue.x = start;
        this._endValue.x = end;
        this._duration = duration;
        return this;
    };
    WTweener.prototype._to2 = function (start, start2, end, end2, duration) {
        this._valueSize = 2;
        this._startValue.x = start;
        this._endValue.x = end;
        this._startValue.y = start2;
        this._endValue.y = end2;
        this._duration = duration;
        return this;
    };
    WTweener.prototype._to3 = function (start, start2, start3, end, end2, end3, duration) {
        this._valueSize = 3;
        this._startValue.x = start;
        this._endValue.x = end;
        this._startValue.y = start2;
        this._endValue.y = end2;
        this._startValue.z = start3;
        this._endValue.z = end3;
        this._duration = duration;
        return this;
    };
    WTweener.prototype._to4 = function (start, start2, start3, start4, end, end2, end3, end4, duration) {
        this._valueSize = 4;
        this._startValue.x = start;
        this._endValue.x = end;
        this._startValue.y = start2;
        this._endValue.y = end2;
        this._startValue.z = start3;
        this._endValue.z = end3;
        this._startValue.w = start4;
        this._endValue.w = end4;
        this._duration = duration;
        return this;
    };
    WTweener.prototype._toColor = function (start, end, duration) {
        this._valueSize = 4;
        this._startValue.color = start;
        this._endValue.color = end;
        this._duration = duration;
        return this;
    };
    WTweener.prototype._shake = function (startX, startY, amplitude, duration) {
        this._valueSize = 5;
        this._startValue.x = startX;
        this._startValue.y = startY;
        this._startValue.w = amplitude;
        this._duration = duration;
        this._easeType = WEaseType_1.WEaseType.Linear;
        return this;
    };
    WTweener.prototype._init = function () {
        this._delay = 0;
        this._duration = 0;
        this._breakpoint = -1;
        this._easeType = WEaseType_1.WEaseType.QuadOut;
        this._timeScale = 1;
        this._easePeriod = 0;
        this._easeOvershootOrAmplitude = 1.70158;
        this._snapping = false;
        this._repeat = 0;
        this._yoyo = false;
        this._valueSize = 0;
        this._started = false;
        this._paused = false;
        this._killed = false;
        this._elapsedTime = 0;
        this._normalizedTime = 0;
        this._ended = 0;
    };
    WTweener.prototype._reset = function () {
        this._target = null;
        this._userData = null;
        this._onStart = this._onUpdate = this._onComplete = null;
        this._onStartCaller = this._onUpdateCaller = this._onCompleteCaller = null;
    };
    WTweener.prototype._update = function (dt) {
        if (this._timeScale != 1)
            dt *= this._timeScale;
        if (dt == 0)
            return;
        if (this._ended != 0) //Maybe this.completed by this.seek
         {
            this.callCompleteCallback();
            this._killed = true;
            return;
        }
        this._elapsedTime += dt;
        this.update();
        if (this._ended != 0) {
            if (!this._killed) {
                this.callCompleteCallback();
                this._killed = true;
            }
        }
    };
    WTweener.prototype.update = function (dt) {
        if (dt != null) {
            if (this._timeScale != 1)
                dt *= this._timeScale;
            if (dt == 0)
                return;
            this._elapsedTime += dt;
        }
        this._ended = 0;
        var _duration = this._duration;
        if (this._valueSize == 0) //DelayedCall
         {
            if (this._elapsedTime >= this._delay + _duration)
                this._ended = 1;
            return;
        }
        if (!this._started) {
            if (this._elapsedTime < this._delay)
                return;
            this._started = true;
            this.callStartCallback();
            if (this._killed)
                return;
        }
        var reversed = false;
        var tt = this._elapsedTime - this._delay;
        if (this._breakpoint >= 0 && tt >= this._breakpoint) {
            tt = this._breakpoint;
            this._ended = 2;
        }
        if (this._repeat != 0) {
            var round = Math.floor(tt / _duration);
            tt -= _duration * round;
            if (this._yoyo)
                reversed = round % 2 == 1;
            if (this._repeat > 0 && this._repeat - round < 0) {
                if (this._yoyo)
                    reversed = this._repeat % 2 == 1;
                tt = _duration;
                this._ended = 1;
            }
        }
        else if (tt >= _duration) {
            tt = _duration;
            this._ended = 1;
        }
        this._normalizedTime = WEaseManager_1.WEaseManager.evaluate(this._easeType, reversed ? (_duration - tt) : tt, _duration, this._easeOvershootOrAmplitude, this._easePeriod);
        this._value.setZero();
        this._deltaValue.setZero();
        if (this._valueSize == 5) {
            if (this._ended == 0) {
                var r = this._startValue.w * (1 - this._normalizedTime);
                var rx = (Math.random() * 2 - 1) * r;
                var ry = (Math.random() * 2 - 1) * r;
                rx = rx > 0 ? Math.ceil(rx) : Math.floor(rx);
                ry = ry > 0 ? Math.ceil(ry) : Math.floor(ry);
                this._deltaValue.x = rx;
                this._deltaValue.y = ry;
                this._value.x = this._startValue.x + rx;
                this._value.y = this._startValue.y + ry;
            }
            else {
                this._value.x = this._startValue.x;
                this._value.y = this._startValue.y;
            }
        }
        else {
            for (var i = 0; i < this._valueSize; i++) {
                var n1 = this._startValue.getField(i);
                var n2 = this._endValue.getField(i);
                var f = n1 + (n2 - n1) * this._normalizedTime;
                if (this._snapping)
                    f = Math.round(f);
                this._deltaValue.setField(i, f - this._value.getField(i));
                this._value.setField(i, f);
            }
        }
        if (this._target != null && this._propType != null) {
            if (this._propType instanceof Function) {
                switch (this._valueSize) {
                    case 1:
                        this._propType.call(this._target, this._value.x);
                        break;
                    case 2:
                        this._propType.call(this._target, this._value.x, this._value.y);
                        break;
                    case 3:
                        this._propType.call(this._target, this._value.x, this._value.y, this._value.z);
                        break;
                    case 4:
                        this._propType.call(this._target, this._value.x, this._value.y, this._value.z, this._value.w);
                        break;
                    case 5:
                        this._propType.call(this._target, this._value.color);
                        break;
                    case 6:
                        this._propType.call(this._target, this._value.x, this._value.y);
                        break;
                }
            }
            else if (this._propType instanceof Laya.Handler) {
                var arr = [];
                switch (this._valueSize) {
                    case 1:
                        arr = [this._target, this._value.x];
                        break;
                    case 2:
                        arr = [this._target, this._value.x, this._value.y];
                        break;
                    case 3:
                        arr = [this._target, this._value.x, this._value.y, this._value.z];
                        break;
                    case 4:
                        arr = [this._target, this._value.x, this._value.y, this._value.z, this._value.w];
                        break;
                    case 5:
                        arr = [this._target, this._value.color];
                        break;
                    case 6:
                        arr = [this._target, this._value.x, this._value.y];
                        break;
                }
                this._propType.runWith(arr);
            }
            else {
                if (this._valueSize == 5)
                    this._target[this._propType] = this._value.color;
                else
                    this._target[this._propType] = this._value.x;
            }
        }
        this.callUpdateCallback();
    };
    WTweener.prototype.callStartCallback = function () {
        if (this._onStart != null) {
            if (WTween_1.WTween.catchCallbackExceptions) {
                try {
                    this._onStart.call(this._onStartCaller, this);
                }
                catch (err) {
                    console.log("FairyGUI: error in start callback > " + err.message);
                }
            }
            else
                this._onStart.call(this._onStartCaller, this);
        }
    };
    WTweener.prototype.callUpdateCallback = function () {
        if (this._onUpdate != null) {
            if (WTween_1.WTween.catchCallbackExceptions) {
                try {
                    this._onUpdate.call(this._onUpdateCaller, this);
                }
                catch (err) {
                    console.log("FairyGUI: error in this.update callback > " + err.message);
                }
            }
            else
                this._onUpdate.call(this._onUpdateCaller, this);
        }
    };
    WTweener.prototype.callCompleteCallback = function () {
        if (this._onComplete != null) {
            if (WTween_1.WTween.catchCallbackExceptions) {
                try {
                    this._onComplete.call(this._onCompleteCaller, this);
                }
                catch (err) {
                    console.log("FairyGUI: error in complete callback > " + err.message);
                }
            }
            else
                this._onComplete.call(this._onCompleteCaller, this);
        }
    };
    return WTweener;
}());
exports.WTweener = WTweener;
},{"./WEaseManager":9,"./WEaseType":10,"./WTween":11,"./WTweenValue":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//wmy版本_2018/12/11/19;
var WmyU3dImport = /** @class */ (function () {
    function WmyU3dImport() {
    }
    //
    WmyU3dImport.getClass = function (name) {
        return this[name];
    };
    WmyU3dImport.Ts_C4DVetexAnimator = require('./ts/Ts_C4DVetexAnimator')['default'];
    WmyU3dImport.Ts_Shu = require('./ts/Ts_Shu')['default'];
    WmyU3dImport.Ts_CameraBox = require('./ts/Ts_CameraBox')['default'];
    //
    WmyU3dImport.WmyC4DVetexAnimator = require('../_wmyUtilsH5/d3/c4d/WmyC4DVetexAnimator')['default'];
    //Laya
    WmyU3dImport.Animator = Laya.Animator;
    return WmyU3dImport;
}());
exports.default = WmyU3dImport;
},{"../_wmyUtilsH5/d3/c4d/WmyC4DVetexAnimator":8,"./ts/Ts_C4DVetexAnimator":18,"./ts/Ts_CameraBox":19,"./ts/Ts_Shu":20}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyU3dTsConfig = /** @class */ (function () {
    function WmyU3dTsConfig() {
    }
    WmyU3dTsConfig.tsConfig = [{ "c_ts": "Ts_CameraBox", "targetUrlArr": ["cameraBox"] }, { "c_ts": "Ts_Shu", "targetUrlArr": ["shu"] }, { "c_ts": "Ts_C4DVetexAnimator", "targetUrlArr": ["sceneBox/box/fz01"] }];
    return WmyU3dTsConfig;
}());
exports.default = WmyU3dTsConfig;
},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//wmy版本_2018/12/12/;
var WmyScript3D_1 = require("../_wmyUtilsH5/d3/WmyScript3D");
var WmyU3dTsConfig_1 = require("./WmyU3dTsConfig");
var WmyU3dImport_1 = require("./WmyU3dImport");
var WmyU3dTsMag = /** @class */ (function (_super) {
    __extends(WmyU3dTsMag, _super);
    function WmyU3dTsMag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WmyU3dTsMag.prototype.onAwake = function () {
        for (var i = 0; i < WmyU3dTsConfig_1.default.tsConfig.length; i++) {
            var tsObj = WmyU3dTsConfig_1.default.tsConfig[i];
            this.addTs(tsObj);
        }
    };
    WmyU3dTsMag.prototype.addTs = function (configObj) {
        if (configObj == null)
            return;
        var c_ts = configObj['c_ts'];
        var ts = WmyU3dImport_1.default.getClass(c_ts);
        var targetUrlArr = configObj['targetUrlArr'];
        if (!targetUrlArr || !ts)
            return;
        for (var i = 0; i < targetUrlArr.length; i++) {
            var targetUrl = targetUrlArr[i];
            var target = WmyU3dTsMag.getObj3dUrl(this.scene3D, targetUrl);
            if (target != null) {
                target.addComponent(ts);
            }
        }
    };
    WmyU3dTsMag.getObj3dUrl = function (target, url) {
        var arrUrl = url.split('/');
        return this._getObjArrUrl(target, arrUrl);
    };
    WmyU3dTsMag._getObjArrUrl = function (target, urlArr, id) {
        if (id === void 0) { id = 0; }
        var _target = target;
        if (_target == null)
            return null;
        var na = urlArr[id];
        var targetObj = _target.getChildByName(na);
        if (targetObj == null)
            return null;
        if (id >= urlArr.length - 1) {
            return targetObj;
        }
        else {
            targetObj = this._getObjArrUrl(targetObj, urlArr, ++id);
        }
        return targetObj;
    };
    return WmyU3dTsMag;
}(WmyScript3D_1.WmyScript3D));
exports.default = WmyU3dTsMag;
},{"../_wmyUtilsH5/d3/WmyScript3D":6,"./WmyU3dImport":15,"./WmyU3dTsConfig":16}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//wmy  2018/12/12 23:20:28
/*C4D顶点动画*/
var WmyU3dImport_1 = require("../WmyU3dImport");
var WmyScript3D_1 = require("../../_wmyUtilsH5/d3/WmyScript3D");
var Ts_C4DVetexAnimator = /** @class */ (function (_super) {
    __extends(Ts_C4DVetexAnimator, _super);
    function Ts_C4DVetexAnimator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ts_C4DVetexAnimator.prototype.onAwake = function () {
        this.setShow(false);
        this._c4dVetexAnimator = this.owner3D.getComponent(WmyU3dImport_1.default.getClass('WmyC4DVetexAnimator'));
        if (this._c4dVetexAnimator == null) {
            this._c4dVetexAnimator = this.owner3D.addComponent(WmyU3dImport_1.default.getClass('WmyC4DVetexAnimator'));
        }
        this._anir = this.owner3D.getComponent(WmyU3dImport_1.default.getClass('Animator'));
    };
    /*播放动画*/
    Ts_C4DVetexAnimator.prototype.play = function () {
        this.setShow(true);
        this._anir.enabled = true;
        this._anir.play("play");
    };
    return Ts_C4DVetexAnimator;
}(WmyScript3D_1.WmyScript3D));
exports.default = Ts_C4DVetexAnimator;
},{"../../_wmyUtilsH5/d3/WmyScript3D":6,"../WmyU3dImport":15}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//wmy  2018/12/12 23:20:28
/*场景相机*/
var WmyU3dImport_1 = require("../WmyU3dImport");
var WmyScript3D_1 = require("../../_wmyUtilsH5/d3/WmyScript3D");
var Ts_CameraBox = /** @class */ (function (_super) {
    __extends(Ts_CameraBox, _super);
    function Ts_CameraBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ts_CameraBox.prototype.onAwake = function () {
        var anir = this.owner3D.getComponent(WmyU3dImport_1.default.getClass('Animator'));
        anir.play("play");
        //anir.enabled = false;
    };
    /*播放动画*/
    Ts_CameraBox.prototype.play = function () {
        var shu = this.getObj3dUrl(this.scene3D, "shu");
        var anir = shu.getComponent(WmyU3dImport_1.default.getClass('Animator'));
        anir.play("play");
    };
    Ts_CameraBox.prototype.play1 = function () {
        var fz01 = this.getObj3dUrl(this.scene3D, "sceneBox/box/fz01");
        var c4dAnir = fz01.getComponent(WmyU3dImport_1.default.getClass('Ts_C4DVetexAnimator'));
        c4dAnir.play();
    };
    return Ts_CameraBox;
}(WmyScript3D_1.WmyScript3D));
exports.default = Ts_CameraBox;
},{"../../_wmyUtilsH5/d3/WmyScript3D":6,"../WmyU3dImport":15}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyScript3D_1 = require("../../_wmyUtilsH5/d3/WmyScript3D");
var Ts_Shu = /** @class */ (function (_super) {
    __extends(Ts_Shu, _super);
    function Ts_Shu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ts_Shu.prototype.onAwake = function () {
    };
    /*播放动画*/
    Ts_Shu.prototype.play = function () {
    };
    return Ts_Shu;
}(WmyScript3D_1.WmyScript3D));
exports.default = Ts_Shu;
},{"../../_wmyUtilsH5/d3/WmyScript3D":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L+i9r+S7ti9sYXlhQXJpL0xheWFBaXJJREVfYmV0YTIuMDEvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL01haW4udHMiLCJzcmMvX3dteVV0aWxzSDUvV215VXRpbHMudHMiLCJzcmMvX3dteVV0aWxzSDUvV215X0xvYWRfTWFnLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteUxvYWQzZC50cyIsInNyYy9fd215VXRpbHNINS9kMy9XbXlMb2FkTWF0cy50cyIsInNyYy9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRC50cyIsInNyYy9fd215VXRpbHNINS9kMy9XbXlVdGlsczNELnRzIiwic3JjL193bXlVdGlsc0g1L2QzL2M0ZC9XbXlDNERWZXRleEFuaW1hdG9yLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dFYXNlTWFuYWdlci50cyIsInNyYy9fd215VXRpbHNINS93bXlUd2Vlbi9XRWFzZVR5cGUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dUd2Vlbk1hbmFnZXIudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuVmFsdWUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuZXIudHMiLCJzcmMvd215VTNkVHMvV215VTNkSW1wb3J0LnRzIiwic3JjL3dteVUzZFRzL1dteVUzZFRzQ29uZmlnLnRzIiwic3JjL3dteVUzZFRzL1dteVUzZFRzTWFnLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX0M0RFZldGV4QW5pbWF0b3IudHMiLCJzcmMvd215VTNkVHMvdHMvVHNfQ2FtZXJhQm94LnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX1NodS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNUQSwyREFBMEQ7QUFDMUQsc0VBQXFFO0FBQ3JFLG1EQUFrRDtBQUNsRCxzREFBaUQ7QUFDakQ7SUFJQztRQUZPLFdBQU0sR0FBQyxHQUFHLENBQUM7UUFDWCxXQUFNLEdBQUMsSUFBSSxDQUFDO1FBRWxCLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU1QyxJQUFJLElBQUksR0FBQyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxJQUFHLElBQUksRUFBQztZQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO1NBQ2hEO2FBQ0c7WUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNuRDtRQUNELFFBQVE7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDbkMsUUFBUTtRQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUVuQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQztRQUU3QixnREFBZ0Q7UUFDaEQsSUFBSSxRQUFRLEdBQUMsRUFBRSxDQUFDO1FBQ2hCLElBQUcsTUFBTSxJQUFFLElBQUksSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUUsSUFBSSxFQUFDO1lBQzNDLFFBQVEsR0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDNUI7UUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzlJLENBQUM7SUFFRCw4QkFBZSxHQUFmO1FBQUEsbUJBS0M7UUFKQSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QywyQkFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2pGLDJCQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQUksRUFBRSxPQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNqRixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHFCQUFNLEdBQU47UUFDQyxJQUFJLEVBQUUsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BDLElBQUksRUFBRSxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBQyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUMsRUFBRSxDQUFDO1NBQzNDO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtZQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUMxQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUM1QztRQUVELGdDQUFnQztRQUNoQyw4Q0FBOEM7UUFDOUMsZ0RBQWdEO1FBQ2hELElBQUk7SUFFTCxDQUFDO0lBUU8seUJBQVUsR0FBbEI7UUFDQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsUUFBUSxHQUFDLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3hDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzNFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUUxRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUVyRCwyQkFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNuSCxDQUFDO0lBRU8sd0JBQVMsR0FBakIsVUFBa0IsUUFBZ0I7UUFDakMsSUFBSSxLQUFLLEdBQUcsNkJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN4QyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMvRSxJQUFHLElBQUksQ0FBQyxJQUFJLEVBQUM7WUFDWixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzQztJQUNGLENBQUM7SUFDTyx5QkFBVSxHQUFsQixVQUFtQixNQUFNLEVBQUUsQ0FBQztRQUMzQixJQUFHLElBQUksQ0FBQyxJQUFJLEVBQUM7WUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDcEI7SUFDRixDQUFDO0lBR08sdUJBQVEsR0FBaEIsVUFBaUIsS0FBSyxFQUFFLE1BQU07UUFDN0IsTUFBTTtRQUNBLElBQUksS0FBSyxHQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxxQkFBVyxDQUFDLENBQUM7UUFFeEMsNkJBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsSUFBSSxLQUFLLEdBQUcsNkJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN4QyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDN0UsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDNUIsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUlPLHFCQUFNLEdBQWQ7UUFDQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdkUsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzNDO1FBRUQsSUFBSSxLQUFLLEdBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2pELElBQUksS0FBSyxHQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVDLDZCQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUVqQixXQUFXO1FBQ1gsaUdBQWlHO1FBQ2pHLGVBQWU7UUFDZixvQ0FBb0M7UUFDcEMsYUFBYTtRQUNiLCtCQUErQjtRQUUvQixnR0FBZ0c7UUFDaEcsdUNBQXVDO1FBRXZDLHNDQUFzQztRQUN0Qyx3Q0FBd0M7UUFDeEMsU0FBUztRQUVULE9BQU87SUFDUixDQUFDO0lBRUYsV0FBQztBQUFELENBcEpBLEFBb0pDLElBQUE7QUFwSlksb0JBQUk7QUFxSmpCLE9BQU87QUFDUCxJQUFJLElBQUksRUFBRSxDQUFDOzs7O0FDMUpYO0lBQThCLDRCQUEyQjtJQVFyRDtRQUFBLGNBQ0ksaUJBQU8sU0FNVjtRQXFGTyxrQkFBVSxHQUEwQixJQUFJLEtBQUssRUFBcUIsQ0FBQztRQTFGdkUsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBQyxPQUFJLEVBQUUsT0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBQyxPQUFJLEVBQUUsT0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBQyxPQUFJLEVBQUMsT0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDLE9BQUksRUFBQyxPQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7O0lBQzFELENBQUM7SUFiRCxzQkFBa0IsbUJBQU87YUFBekI7WUFDSSxJQUFHLFFBQVEsQ0FBQyxLQUFLLElBQUUsSUFBSSxFQUFDO2dCQUNwQixRQUFRLENBQUMsS0FBSyxHQUFDLElBQUksUUFBUSxFQUFFLENBQUE7YUFDaEM7WUFDRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsQ0FBQzs7O09BQUE7SUFnQkQsTUFBTTtJQUNDLG1EQUFnQyxHQUF2QyxVQUF3QyxDQUFRLEVBQUMsQ0FBUSxFQUFDLENBQVEsRUFBQyxDQUFTO1FBRXhFLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDbkMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUNuQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxDQUFDO1FBQ3BDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sUUFBUSxDQUFDLG9CQUFvQixDQUFDO0lBQ3pDLENBQUM7SUFDRCxTQUFTO0lBQ0Ysb0NBQWlCLEdBQXhCLFVBQXlCLE1BQWtCLEVBQUMsS0FBWTtRQUVwRCxNQUFNLENBQUMsT0FBTyxHQUFDLElBQUksQ0FBQztRQUNwQixJQUFHLEtBQUssSUFBSSxRQUFRLEVBQUM7WUFDakIsTUFBTSxDQUFDLE9BQU8sR0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQ3RFLENBQUMsQ0FBQyxLQUFLLElBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUMsR0FBRyxFQUN4QixDQUFDLENBQUMsS0FBSyxJQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFDLEdBQUcsRUFDdkIsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUMsR0FBRyxDQUNqQixDQUFDLENBQUMsQ0FBQztTQUNYO0lBQ0wsQ0FBQztJQUNELFNBQVM7SUFDRixxQ0FBa0IsR0FBekIsVUFBMEIsTUFBa0IsRUFBQyxDQUFRLEVBQUMsQ0FBUSxFQUFDLENBQVEsRUFBQyxDQUFTO1FBRTdFLE1BQU0sQ0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDO1FBQ3BCLElBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQztZQUNoQyxNQUFNLENBQUMsT0FBTyxHQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekY7SUFDTCxDQUFDO0lBRUQsU0FBUztJQUNGLHVCQUFJLEdBQVg7UUFFSSxJQUFJLElBQUksR0FBUyxLQUFLLENBQUM7UUFDdkIsSUFBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFDM0U7WUFDSSxJQUFJLEdBQUMsS0FBSyxDQUFDO1NBQ2Q7YUFBSyxJQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUM7WUFDMUIsSUFBSSxHQUFDLElBQUksQ0FBQTtTQUNaO2FBQ0c7WUFDQSxJQUFJLEdBQUMsSUFBSSxDQUFBO1NBQ1o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ00sMkJBQVEsR0FBZjtRQUNJLElBQUksQ0FBQyxHQUFVLFNBQVMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxHQUFVLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDdEUsT0FBTztZQUNILGFBQWE7WUFDYixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxRCxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7WUFDcEUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDO1lBQy9DLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdELE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pELElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7U0FDeEQsQ0FBQTtJQUNMLENBQUM7SUFFYSxnQkFBTyxHQUFyQixVQUFzQixHQUFVO1FBQzVCLElBQUksR0FBRyxHQUFFLElBQUksTUFBTSxDQUFDLE9BQU8sR0FBQyxHQUFHLEdBQUMsZUFBZSxDQUFDLENBQUM7UUFDakQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6RCxPQUFPLE1BQU0sQ0FBQSxDQUFDLENBQUEsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFBLElBQUksQ0FBQztJQUNyRCxDQUFDO0lBRU0sNkJBQVUsR0FBakIsVUFBa0IsR0FBVSxFQUFDLFNBQXVCO1FBQXZCLDBCQUFBLEVBQUEsaUJBQXVCO1FBQ2hELElBQUcsU0FBUyxFQUFDO1lBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEM7YUFDRztZQUNDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFDLEdBQUcsQ0FBQztTQUM3QjtJQUNMLENBQUM7SUFHTyxnQ0FBYSxHQUFyQixVQUFzQixHQUFzQjtRQUN4QyxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsRUFBQztZQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtJQUNMLENBQUM7SUFDTyw4QkFBVyxHQUFuQixVQUFvQixHQUFzQjtRQUN0QyxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFFLENBQUMsRUFBQztZQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMzRDtJQUNMLENBQUM7SUFDTyw2QkFBVSxHQUFsQjtRQUNJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztZQUN2QixHQUFHLENBQUMsSUFBSSxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1lBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBQ0csSUFBSSxDQUFDLFVBQVUsR0FBQyxJQUFJLEtBQUssRUFBcUIsQ0FBQztJQUNuRCxDQUFDO0lBRU8sZ0NBQWEsR0FBckIsVUFBc0IsR0FBc0I7UUFDeEMsSUFBSSxJQUFJLEdBQUMsRUFBRSxDQUFDO1FBQ1osSUFBRyxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLElBQUk7WUFDeEQsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxJQUFJLEVBQUM7WUFDM0QsR0FBRyxDQUFDLElBQUksR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztZQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBQyxHQUFHLENBQUMsQ0FBQztTQUM3QztJQUNMLENBQUM7SUFHYSxnQkFBTyxHQUFyQixVQUFzQixDQUFDLEVBQUMsQ0FBRztRQUFILGtCQUFBLEVBQUEsS0FBRztRQUM3QixJQUFHLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBRSxDQUFDLEVBQUM7WUFDdEIsQ0FBQyxHQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEI7UUFDUCxPQUFPLENBQUMsQ0FBQztJQUNWLENBQUM7SUFFZ0IsZ0JBQU8sR0FBckIsVUFBc0IsQ0FBQyxFQUFFLENBQUM7UUFFekIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLEdBQUcsR0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLElBQUksR0FBRyxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFNUIsSUFBSSxFQUFFLEdBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksRUFBRSxHQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFWixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUcsRUFBRSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUlZLHNCQUFhLEdBQTNCLFVBQTRCLEdBQUc7UUFDMUIsZUFBZTtRQUNmLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQTtRQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRTtnQkFDWixHQUFHLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7YUFDdkM7aUJBQU07Z0JBQ0gsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTthQUM5QztTQUNBO1FBQ0Qsc0JBQXNCO1FBQ3RCLE9BQU8sSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO1lBQy9ELE9BQU8sUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUN0QixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNmLENBQUM7SUFFYSxtQkFBVSxHQUF4QixVQUF5QixHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU07UUFDeEMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBRSxDQUFDLEVBQUM7WUFDdkIsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNoRDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxPQUFPO0lBQ08sZUFBTSxHQUFwQixVQUFxQixHQUFVLEVBQUUsSUFBVTtRQUFWLHFCQUFBLEVBQUEsWUFBVTtRQUN2QyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFHLENBQUMsSUFBSSxFQUFDO1lBQ0wsU0FBUztZQUNULElBQUksR0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDMUI7YUFDRztZQUNBLFNBQVM7WUFDVCxJQUFJLEdBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUdELElBQUk7SUFDTyxvQkFBVyxHQUF6QixVQUEwQixDQUFZLEVBQUMsQ0FBWTtRQUNsRCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsR0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE9BQU8sQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQUVnQixpQkFBUSxHQUF0QixVQUF1QixDQUFDLEVBQUMsQ0FBQztRQUN0QixJQUFJLE1BQU0sR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBQyxDQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNCLENBQUMsR0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVhLGdCQUFPLEdBQXJCLFVBQXNCLEdBQUcsRUFBRSxLQUFhLEVBQUUsT0FBWTtRQUEzQixzQkFBQSxFQUFBLFdBQWE7UUFBRSx3QkFBQSxFQUFBLGNBQVk7UUFDbEQsSUFBSSxPQUFPLEdBQUssT0FBTyxDQUFBLENBQUMsQ0FBQSxZQUFZLENBQUEsQ0FBQyxDQUFBLGNBQWMsQ0FBQztRQUNwRCxJQUFHLEtBQUssSUFBRSxHQUFHLEVBQUM7WUFDbkIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxPQUFPLElBQUksQ0FBQztTQUNaO2FBQ0ksSUFBRyxLQUFLLElBQUUsSUFBSSxFQUFDO1lBQ25CLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDeEI7YUFDRztZQUNILE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNWLENBQUM7SUFHYSxxQkFBWSxHQUExQixVQUEyQixJQUFJLEVBQUMsTUFBVSxFQUFDLGVBQWdCLEVBQUMsU0FBVyxFQUFDLEtBQU87UUFBL0MsdUJBQUEsRUFBQSxZQUFVO1FBQWtCLDBCQUFBLEVBQUEsYUFBVztRQUFDLHNCQUFBLEVBQUEsU0FBTztRQUMzRSxJQUFHLE1BQU0sSUFBRSxDQUFDO1lBQUMsT0FBTztRQUNwQixJQUFJLElBQUksR0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLEdBQUcsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsZUFBZSxFQUFDLElBQUksRUFBQyxTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQXBOTSw2QkFBb0IsR0FBYTtRQUNwQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNiLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ2IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDYixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztLQUNoQixDQUFDO0lBZ05OLGVBQUM7Q0F0T0QsQUFzT0MsQ0F0TzZCLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxHQXNPeEQ7QUF0T1ksNEJBQVE7Ozs7QUNEckIsdUNBQXNDO0FBQ3RDLDRDQUEyQztBQUMzQyxnREFBK0M7QUFFL0M7SUFBQTtRQVNZLGFBQVEsR0FBSyxFQUFFLENBQUM7UUFFakIsV0FBTSxHQUFRLEVBQUUsQ0FBQztRQTJFaEIsZ0JBQVcsR0FBWSxFQUFFLENBQUM7UUFDMUIsZ0JBQVcsR0FBWSxFQUFFLENBQUM7UUFDMUIsc0JBQWlCLEdBQVksRUFBRSxDQUFDO1FBK0poQyxpQkFBWSxHQUFDLEtBQUssQ0FBQztRQUNuQixXQUFNLEdBQUMsS0FBSyxDQUFDO0lBNEx6QixDQUFDO0lBamJHLHNCQUFrQix1QkFBTzthQUF6QjtZQUNJLElBQUcsWUFBWSxDQUFDLEtBQUssSUFBRSxJQUFJLEVBQUM7Z0JBQ3hCLFlBQVksQ0FBQyxLQUFLLEdBQUMsSUFBSSxZQUFZLEVBQUUsQ0FBQzthQUN6QztZQUNELE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQztRQUM5QixDQUFDOzs7T0FBQTtJQUlNLGlDQUFVLEdBQWpCLFVBQWtCLEdBQVU7UUFDeEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxpQ0FBVSxHQUFqQixVQUFrQixHQUFPLEVBQUMsR0FBVztRQUNqQyxJQUFHLElBQUksQ0FBQyxNQUFNLElBQUUsRUFBRSxFQUFDO1lBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBQyxHQUFHLENBQUM7WUFDaEIsSUFBSSxHQUFHLEdBQUMsSUFBSSxDQUFDO1lBQ2IsSUFBRztnQkFDQyxHQUFHLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN2QjtZQUFDLE9BQU8sS0FBSyxFQUFFLEdBQUU7U0FDckI7UUFDRCxJQUFHLEdBQUcsSUFBRSxJQUFJLEVBQUM7WUFDVCxHQUFHLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNuQjtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUMsR0FBRyxDQUFDO0lBQzNCLENBQUM7SUFFTSxnQ0FBUyxHQUFoQixVQUFpQixPQUFjLEVBQUMsR0FBSTtRQUNoQyxJQUFJLE9BQVcsQ0FBQztRQUNoQixJQUFHLEdBQUcsSUFBRSxJQUFJLEVBQUM7WUFDVCxHQUFHLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNuQjtRQUNELE9BQU8sR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUcsT0FBTyxJQUFFLElBQUksRUFBQztZQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELElBQUksR0FBRyxHQUFZLElBQUksQ0FBQztRQUN4QixJQUFHLE9BQU8sWUFBWSxLQUFLLEVBQUM7WUFDeEIsR0FBRyxHQUFDLE9BQU8sQ0FBQztTQUNmO1FBQ0QsSUFBRyxHQUFHLElBQUUsSUFBSSxFQUFDO1lBQ1QsSUFBSTtnQkFDQSxHQUFHLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMzQjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQyxPQUFPLElBQUksQ0FBQzthQUNmO1NBQ0o7UUFDRCxJQUFJLE1BQU0sR0FBQyxJQUFJLENBQUM7UUFDaEIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7WUFDekIsSUFBSSxHQUFHLEdBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBRyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUUsT0FBTyxFQUFDO2dCQUN2QixNQUFNLEdBQUMsR0FBRyxDQUFDO2dCQUNYLE1BQU07YUFDVDtTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVNLG9DQUFhLEdBQXBCLFVBQXFCLEdBQVUsRUFBQyxVQUF1QjtRQUNuRCxJQUFHLEdBQUcsSUFBRSxFQUFFO1lBQUMsT0FBTztRQUNsQixJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUUsSUFBSSxFQUFDO1lBQzFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQyxPQUFPO1NBQ1Y7UUFDRCxJQUFJLElBQUksR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQyxVQUFTLEdBQUc7WUFDNUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7WUFDekIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sZ0NBQVMsR0FBaEIsVUFBaUIsR0FBVSxFQUFDLFVBQXdCLEVBQUMsZ0JBQThCO1FBQy9FLElBQUksTUFBTSxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsSUFBRyxNQUFNLElBQUUsSUFBSSxFQUFDO1lBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDbkQ7YUFDRztZQUNBLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQztJQUtNLDZCQUFNLEdBQWIsVUFBYyxNQUFVLEVBQUMsVUFBd0IsRUFBQyxnQkFBOEI7UUFDNUUsSUFBSSxPQUFPLEdBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlCLElBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBRSxJQUFJLEVBQUM7WUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsRTthQUNHO1lBQ0EsSUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFFLElBQUksRUFBQztnQkFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzNDLElBQUcsZ0JBQWdCLElBQUUsSUFBSSxFQUFDO29CQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQzFEO2dCQUNELE9BQU8sSUFBSSxDQUFDO2FBQ2Y7WUFFRCxJQUFJLE1BQU0sR0FBWSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkMsSUFBSSxJQUFJLEdBQUssRUFBRSxDQUFDO1lBQ2hCLElBQUksT0FBTyxHQUFRLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyQyxJQUFHLE9BQU8sSUFBRSxJQUFJLElBQUksT0FBTyxJQUFFLEVBQUUsRUFBQztnQkFDNUIsSUFBSTtvQkFDQSxJQUFJLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDNUI7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ1osT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3BDO2FBQ0o7WUFDRCxJQUFJLFFBQVEsQ0FBQztZQUNiLElBQUksTUFBTSxHQUFZLEVBQUUsQ0FBQztZQUN6QixJQUFJLFFBQVEsR0FBQyxLQUFLLENBQUM7WUFDbkIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7Z0JBQzVCLElBQUksR0FBRyxHQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxNQUFNLEdBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoQyxJQUFHLE1BQU0sSUFBRSxJQUFJLEVBQUM7b0JBQ1osU0FBUztpQkFDWjtnQkFDRCxNQUFNLEdBQUMsbUJBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQy9CLElBQUksR0FBRyxHQUFDLE1BQU0sQ0FBQztnQkFDZixJQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxFQUFDO29CQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO29CQUMvQyxRQUFRLEdBQUMsTUFBTSxDQUFDO2lCQUNuQjtxQkFDSSxJQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxFQUFDO29CQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO2lCQUNqRDtxQkFDSSxJQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxFQUFDO29CQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO2lCQUNqRDtxQkFDRztvQkFDQSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7aUJBQzFCO2FBQ0o7WUFDRCxJQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUUsQ0FBQztnQkFBQyxPQUFPLEtBQUssQ0FBQztZQUVqQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFDLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUMsRUFBRSxDQUFDO1lBQ25DLElBQUcsZ0JBQWdCLElBQUUsSUFBSSxFQUFDO2dCQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDMUQ7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBQyxDQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDdEs7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBR00sbUNBQVksR0FBbkIsVUFBb0IsR0FBRztRQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDdkMscUJBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTSxrQ0FBVyxHQUFsQixVQUFtQixHQUFVLEVBQUMsVUFBdUIsRUFBQyxnQkFBOEI7UUFDaEYscUJBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFDLFVBQVUsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFTSwrQkFBUSxHQUFmLFVBQWdCLE1BQVUsRUFBQyxVQUF1QixFQUFDLGdCQUE4QjtRQUM3RSxJQUFJLE9BQU8sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUIsSUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFFLElBQUksRUFBQztZQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xFO2FBQ0c7WUFDQSxJQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUUsSUFBSSxFQUFDO2dCQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDM0MsSUFBRyxnQkFBZ0IsSUFBRSxJQUFJLEVBQUM7b0JBQ3RCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDMUQ7Z0JBQ0QsT0FBTyxJQUFJLENBQUM7YUFDZjtZQUVELElBQUksTUFBTSxHQUFZLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2QyxJQUFJLElBQUksR0FBSyxFQUFFLENBQUM7WUFDaEIsSUFBSSxPQUFPLEdBQVEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JDLElBQUcsT0FBTyxJQUFFLElBQUksSUFBSSxPQUFPLElBQUUsRUFBRSxFQUFDO2dCQUM1QixJQUFJO29CQUNBLElBQUksR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM1QjtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDWixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEM7YUFDSjtZQUNELElBQUksS0FBSyxDQUFDO1lBQ1YsSUFBSSxNQUFNLEdBQVksRUFBRSxDQUFDO1lBQ3pCLElBQUksT0FBTyxHQUFlLEVBQUUsQ0FBQztZQUM3QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsTUFBTSxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztnQkFDNUIsSUFBSSxHQUFHLEdBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLE1BQU0sR0FBUSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hDLElBQUcsTUFBTSxJQUFFLElBQUksRUFBQztvQkFDWixTQUFTO2lCQUNaO2dCQUNELElBQUksR0FBRyxHQUFDLE1BQU0sQ0FBQztnQkFDZixJQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUUsQ0FBQyxFQUFDO29CQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7b0JBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3JCO2FBQ0o7WUFDRCxJQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUUsQ0FBQztnQkFBQyxPQUFPLEtBQUssQ0FBQztZQUVqQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFDLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUMsRUFBRSxDQUFDO1lBQ25DLElBQUcsZ0JBQWdCLElBQUUsSUFBSSxFQUFDO2dCQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDMUQ7WUFDRCxJQUFJLENBQUMsT0FBTyxHQUFDLE9BQU8sQ0FBQztZQUNyQixxQkFBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUMsQ0FBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzdLO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVJLHNDQUFlLEdBQXZCLFVBQXdCLE9BQU8sRUFBQyxRQUFRO1FBQ2pDLElBQUksbUJBQW1CLEdBQXFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pELElBQUksUUFBUSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO0lBQ1IsQ0FBQztJQUVVLHVDQUFnQixHQUF4QixVQUF5QixPQUFPLEVBQUMsUUFBZSxFQUFDLElBQUk7UUFDakQsSUFBSSxhQUFhLEdBQXFCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEUsSUFBRyxRQUFRLElBQUUsSUFBSSxFQUFDO1lBQ2QsSUFBSSxHQUFHLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEMsSUFBSTtnQkFDQSxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUMsR0FBRyxDQUFDLENBQUM7YUFDNUM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxLQUFLLENBQUMsQ0FBQzthQUNqQztZQUNELElBQUksUUFBUSxHQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFDLElBQUksQ0FBQztTQUNsQztRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQUksVUFBVSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFHLFVBQVUsSUFBRSxJQUFJLEVBQUM7Z0JBQ2hCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzlCO1NBQ0o7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFDLElBQUksQ0FBQztRQUMvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUMsSUFBSSxDQUFDO0lBQ3pDLENBQUM7SUFPTSxvQ0FBYSxHQUFwQixVQUFxQixVQUF1QixFQUFDLGdCQUE4QjtRQUN2RSxJQUFJLE9BQU8sR0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxJQUFHLE9BQU8sSUFBRSxJQUFJLEVBQUM7WUFDYixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxJQUFJLEdBQUcsR0FBWSxJQUFJLENBQUM7UUFDeEIsSUFBRyxPQUFPLFlBQVksS0FBSyxFQUFDO1lBQ3hCLEdBQUcsR0FBQyxPQUFPLENBQUM7U0FDZjtRQUNELElBQUcsR0FBRyxJQUFFLElBQUksRUFBQztZQUNULElBQUk7Z0JBQ0EsR0FBRyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDM0I7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBQyxPQUFPLENBQUMsQ0FBQztnQkFDakMsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNKO1FBQ0QsSUFBSSxDQUFDLG9CQUFvQixHQUFDLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsMEJBQTBCLEdBQUMsZ0JBQWdCLENBQUM7UUFDakQsSUFBSSxDQUFDLGdCQUFnQixHQUFDLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFDLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUMsRUFBRSxDQUFDO1FBQ25DLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO1lBQ3pCLElBQUksR0FBRyxHQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksT0FBTyxHQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsR0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEIsSUFBRyxPQUFPLElBQUUsSUFBSSxJQUFJLE9BQU8sSUFBRSxFQUFFLElBQUksQ0FBQyxJQUFFLElBQUksSUFBSSxDQUFDLElBQUUsRUFBRTtnQkFBQyxTQUFTO1lBQzdELElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBQyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQUVNLG9DQUFhLEdBQXBCLFVBQXFCLElBQVcsRUFBQyxPQUFPO1FBQXhDLG1CQXlFQztRQXhFRyxJQUFJLEdBQUcsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLElBQUcsR0FBRyxJQUFFLElBQUk7WUFBQyxPQUFPO1FBQ3BCLElBQUksS0FBSyxHQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUMsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBQyxPQUFPLENBQUM7UUFDMUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFDLElBQUksQ0FBQztRQUN2QyxJQUFJLE1BQU0sR0FBQyxLQUFLLENBQUM7UUFDakIsSUFBRyxJQUFJLElBQUUsSUFBSSxFQUFDO1lBQ1YsTUFBTSxHQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ILElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBRSxDQUFDLENBQUM7WUFDaEMsSUFBRyxDQUFDLE1BQU0sRUFBQztnQkFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxVQUFDLE1BQU07b0JBQzVCLE9BQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFCLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDZDtTQUNKO2FBQ0ksSUFBRyxJQUFJLElBQUUsS0FBSyxFQUFDO1lBQ2hCLE1BQU0sR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNySCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUUsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDO1lBQ2pCLElBQUcsQ0FBQyxNQUFNLEVBQUM7Z0JBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsVUFBQyxNQUFNO29CQUM1QixPQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxQixDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2Q7U0FDSjthQUNJLElBQUcsSUFBSSxJQUFFLE1BQU0sRUFBQztZQUNqQixJQUFJLE1BQU0sR0FBWSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsSUFBSSxPQUFPLEdBQWUsRUFBRSxDQUFDO1lBQzdCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxNQUFNLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO2dCQUM1QixJQUFJLEdBQUcsR0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksTUFBTSxHQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxHQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3JELElBQUcsTUFBTSxJQUFFLElBQUksRUFBQztvQkFDWixTQUFTO2lCQUNaO2dCQUNELElBQUksR0FBRyxHQUFDLE1BQU0sQ0FBQztnQkFDZixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JCO1lBQ0QsSUFBRyxPQUFPLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBQztnQkFDaEIseUJBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakksTUFBTSxHQUFDLElBQUksQ0FBQzthQUNmO1lBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFFLENBQUMsQ0FBQztZQUNoQyxJQUFHLENBQUMsTUFBTSxFQUFDO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLFVBQUMsTUFBTTtvQkFDNUIsT0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUIsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUNkO1NBQ0o7YUFDSSxJQUFHLElBQUksSUFBRSxTQUFTLEVBQUM7WUFDcEIsSUFBSSxNQUFNLEdBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxNQUFNLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO2dCQUM1QixJQUFJLEdBQUcsR0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksTUFBTSxHQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxHQUFHLEdBQUMsTUFBTSxDQUFDO2dCQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxJQUFJLENBQUMsQ0FBQzthQUNuQztTQUNKO2FBQ0ksSUFBRyxJQUFJLElBQUUsT0FBTyxFQUFDO1lBQ2xCLE1BQU0sR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUUsQ0FBQyxDQUFDO1lBQ2hDLElBQUcsQ0FBQyxNQUFNLEVBQUM7Z0JBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsVUFBQyxNQUFNO29CQUM1QixPQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxQixDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2Q7U0FDSjtJQUNMLENBQUM7SUFFTSw4QkFBTyxHQUFkLFVBQWUsT0FBTyxFQUFFLFFBQXNCO1FBQzFDLElBQUksR0FBRyxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsSUFBRyxHQUFHLElBQUUsSUFBSTtZQUFDLE9BQU87UUFDcEIsSUFBSSxNQUFNLEdBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLElBQUksU0FBUyxHQUF5QixFQUFFLENBQUM7UUFDekMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7WUFDNUIsSUFBSSxHQUFHLEdBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksTUFBTSxHQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoQyxNQUFNLEdBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyRCxJQUFJLEdBQUcsR0FBQyxNQUFNLENBQUM7WUFDZixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQyxVQUFBLElBQUk7Z0JBQ2hELFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUM7Z0JBQ2xCLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ1A7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRU8sZ0NBQVMsR0FBakIsVUFBa0IsS0FBSyxFQUFFLFFBQWU7UUFDcEMsSUFBSSxFQUFFLEdBQUMsQ0FBQyxDQUFDO1FBQ1QsSUFBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUM7WUFDbEIsSUFBRyxJQUFJLENBQUMsMEJBQTBCLElBQUUsSUFBSSxFQUFDO2dCQUNyQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNqRDtZQUNELE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBQyxRQUFRLENBQUM7UUFDM0MsSUFBSSxHQUFHLEdBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksSUFBSSxHQUFDLENBQUMsQ0FBQztRQUNYLElBQUksRUFBRSxHQUFDLENBQUMsR0FBQyxHQUFHLENBQUM7UUFDYixJQUFJLEVBQUUsR0FBQyxDQUFDLEVBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQztRQUNkLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUM7WUFDbEIsSUFBSSxHQUFHLEdBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxHQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUcsQ0FBQyxJQUFFLElBQUksRUFBQztnQkFDUCxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUM7b0JBQ1gsSUFBRyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUUsS0FBSyxFQUFDO3dCQUNmLEVBQUUsR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUM7cUJBQ3ZCO3lCQUNHO3dCQUNBLEVBQUUsR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUM7cUJBQ3ZCO29CQUNELElBQUksR0FBQyxFQUFFLEdBQUMsRUFBRSxDQUFDO2lCQUNkO3FCQUNHO29CQUNBLElBQUksR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDckI7YUFDSjtTQUNKO1FBQ0QsRUFBRSxHQUFDLElBQUksR0FBQyxHQUFHLENBQUM7UUFDWixJQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUcsRUFBRSxHQUFDLENBQUM7WUFDUCxtQkFBbUI7WUFDbkIsSUFBRyxJQUFJLENBQUMsMEJBQTBCLElBQUUsSUFBSSxFQUFDO2dCQUNyQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNqRDtJQUNSLENBQUM7SUFFTywrQkFBUSxHQUFoQixVQUFpQixLQUFLLEVBQUMsSUFBSztRQUNyQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUUsQ0FBQyxDQUFDO1FBQ2pDLElBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFFLElBQUksRUFBQztZQUN2QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdDO2FBQ0ksSUFBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUUsS0FBSyxFQUFDO1lBQzdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUM7UUFDRCxJQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUM7WUFDM0QsSUFBRyxJQUFJLENBQUMsb0JBQW9CLElBQUUsSUFBSSxFQUFDO2dCQUMvQixJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxFQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkc7U0FDSjtJQUNMLENBQUM7SUFHTCxtQkFBQztBQUFELENBcGJBLEFBb2JDLElBQUE7QUFwYlksb0NBQVk7Ozs7QUNKekIsMkNBQTBDO0FBRTFDO0lBQUE7UUFrR1ksVUFBSyxHQUFDLENBQUMsQ0FBQztRQUNSLFVBQUssR0FBQyxDQUFDLENBQUM7SUErUHBCLENBQUM7SUFoV0csc0JBQWtCLG9CQUFPO2FBQXpCO1lBQ0ksSUFBRyxTQUFTLENBQUMsS0FBSyxJQUFFLElBQUksRUFBQztnQkFDckIsU0FBUyxDQUFDLEtBQUssR0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDO2FBQ25DO1lBQ0QsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQzNCLENBQUM7OztPQUFBO0lBS00sNEJBQVEsR0FBZixVQUFnQixPQUFxQixFQUFDLFVBQXVCLEVBQUMsZ0JBQThCLEVBQUMsVUFBVztRQUNwRyxJQUFJLENBQUMsUUFBUSxHQUFDLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFDLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsaUJBQWlCLEdBQUMsZ0JBQWdCLENBQUM7UUFDeEMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7WUFDN0IsSUFBSSxHQUFHLEdBQVEsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLEdBQUcsR0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7SUFDTCxDQUFDO0lBR0QsZ0dBQWdHO0lBQ2hHLHVFQUF1RTtJQUN2RSxJQUFJO0lBRUosMEZBQTBGO0lBQzFGLHFEQUFxRDtJQUNyRCxJQUFJO0lBRUosK0VBQStFO0lBQy9FLGlDQUFpQztJQUNqQyw0REFBNEQ7SUFDNUQsZ0NBQWdDO0lBQ2hDLGdDQUFnQztJQUNoQyxZQUFZO0lBQ1oseUNBQXlDO0lBQ3pDLHNDQUFzQztJQUN0Qyw2Q0FBNkM7SUFDN0MsWUFBWTtJQUNaLHNCQUFzQjtJQUN0QixJQUFJO0lBRVUscUJBQVcsR0FBekIsVUFBMEIsR0FBVSxFQUFDLFVBQXVCLEVBQUMsZ0JBQThCO1FBQ3ZGLElBQUksU0FBUyxHQUFDLElBQUksU0FBUyxFQUFFLENBQUM7UUFDOUIsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUMsVUFBVSxFQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVNLGlDQUFhLEdBQXBCLFVBQXFCLEdBQUcsRUFBQyxVQUF1QixFQUFDLGdCQUE4QjtRQUMzRSxJQUFJLENBQUMsUUFBUSxHQUFDLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFDLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsaUJBQWlCLEdBQUMsZ0JBQWdCLENBQUM7UUFDeEMsR0FBRyxHQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQsK0JBQStCO0lBQy9CLHNFQUFzRTtJQUN0RSxzQ0FBc0M7SUFDdEMsc0NBQXNDO0lBQ3RDLFlBQVk7SUFDWiw4QkFBOEI7SUFDOUIsaUNBQWlDO0lBQ2pDLHVDQUF1QztJQUN2QywyQkFBMkI7SUFDM0IseUNBQXlDO0lBQ3pDLDRDQUE0QztJQUM1QyxtREFBbUQ7SUFDbkQsWUFBWTtJQUNaLGtDQUFrQztJQUNsQyxJQUFJO0lBQ0ksNkJBQVMsR0FBakIsVUFBa0IsR0FBRztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLElBQUksR0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxXQUFXLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFHTywrQkFBVyxHQUFuQixVQUFvQixHQUFHLEVBQUMsQ0FBQztRQUNyQixJQUFJLEVBQUUsR0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksRUFBRSxHQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxPQUFPLEdBQUMsRUFBRSxDQUFDO1FBQ2YsSUFBSSxLQUFLLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFDLEVBQUUsQ0FBQztRQUVkLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztZQUNoQyxHQUFHLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLHNJQUFzSTtTQUN6STtJQUNMLENBQUM7SUFJTyw4QkFBVSxHQUFsQjtRQUFBLG1CQWdCQztRQWZHLElBQUksQ0FBQyxLQUFLLElBQUUsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsS0FBSyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckIsSUFBRyxJQUFJLENBQUMsS0FBSyxJQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDO2dCQUN0RCxJQUFHLE9BQUksQ0FBQyxXQUFXLElBQUUsSUFBSSxFQUFDO29CQUN0QixPQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUMxQjtnQkFDRCxPQUFJLENBQUMsUUFBUSxHQUFDLElBQUksQ0FBQztnQkFDbkIsT0FBSSxDQUFDLFdBQVcsR0FBQyxJQUFJLENBQUM7Z0JBQ3RCLE9BQUksQ0FBQyxpQkFBaUIsR0FBQyxJQUFJLENBQUM7Z0JBQzVCLE9BQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUNoRDtJQUNMLENBQUM7SUFFTyw2QkFBUyxHQUFqQixVQUFrQixDQUFDO1FBQ2YsSUFBSSxJQUFJLEdBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUM7UUFDeEIsSUFBRyxDQUFDLEVBQUM7WUFDRCxJQUFJLElBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQztTQUNoQjtRQUVELElBQUcsSUFBSSxDQUFDLGlCQUFpQixJQUFFLElBQUksRUFBQztZQUM1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUMxQztJQUNMLENBQUM7SUFHRCxpQkFBaUI7SUFDakIsa0JBQWtCO0lBRWxCLHVCQUF1QjtJQUN2QixpQ0FBaUM7SUFDakMsc0NBQXNDO0lBQ3RDLDhDQUE4QztJQUU5QyxpQ0FBaUM7SUFDakMsd0NBQXdDO0lBQ3hDLGtEQUFrRDtJQUNsRCxRQUFRO0lBQ1IsSUFBSTtJQUNKLHVCQUF1QjtJQUN2QixxQkFBcUI7SUFDckIseUNBQXlDO0lBQ3pDLDBFQUEwRTtJQUMxRSwwQ0FBMEM7SUFDMUMsMENBQTBDO0lBQzFDLGdCQUFnQjtJQUNoQixrQ0FBa0M7SUFDbEMscUNBQXFDO0lBQ3JDLDJDQUEyQztJQUMzQywrQkFBK0I7SUFDL0IsZUFBZTtJQUNmLFFBQVE7SUFDUixJQUFJO0lBQ0ksNkJBQVMsR0FBakIsVUFBa0IsR0FBRyxFQUFDLEdBQWE7UUFBYixvQkFBQSxFQUFBLFFBQWE7UUFDL0IsSUFBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBRSxJQUFJLEVBQUM7WUFDcEQsSUFBSSxRQUFRLEdBQUMsR0FBRyxHQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMxQyxJQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFDLENBQUMsRUFBQztnQkFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDN0I7WUFDRCxJQUFJLFNBQVMsR0FBWSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkQsSUFBRyxTQUFTLElBQUUsSUFBSSxFQUFDO2dCQUNmLEtBQUksSUFBSSxFQUFFLEdBQUMsQ0FBQyxFQUFDLEVBQUUsR0FBQyxTQUFTLENBQUMsTUFBTSxFQUFDLEVBQUUsRUFBRSxFQUFDO29CQUNsQyxJQUFJLElBQUksR0FBQyxHQUFHLEdBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNuQyxJQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQzt3QkFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3pCO2lCQUNKO2FBQ0o7U0FDSjtRQUNELElBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFFLElBQUksRUFBQztZQUN2QixJQUFJLFVBQVUsR0FBWSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUMsSUFBRyxVQUFVLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBQztnQkFDbkIsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7b0JBQzNDLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDMUIsSUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUUsSUFBSSxFQUFDO3dCQUNwQixJQUFJLEtBQUssR0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNyQyxJQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFDLENBQUMsRUFBQzs0QkFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7eUJBQzFCO3FCQUNKO29CQUNELElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFFLElBQUksRUFBQzt3QkFDcEIsSUFBSSxNQUFNLEdBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUNyQyxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTs0QkFDdkMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUN2QixJQUFJLE1BQU0sR0FBWSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7NEJBQ3JDLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dDQUN2QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQ3ZCLElBQUksUUFBUSxHQUFDLEdBQUcsR0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7Z0NBQ25DLElBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUMsQ0FBQyxFQUFDO29DQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQ0FDN0I7NkJBQ0o7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKO1FBQ0QsSUFBSSxLQUFLLEdBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLElBQUcsS0FBSyxJQUFFLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBQztZQUM3QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztnQkFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7YUFDaEM7U0FDSjtJQUNMLENBQUM7SUFFRCxFQUFFO0lBQ0ssNEJBQVEsR0FBZixVQUFnQixHQUFVO1FBQ3RCLElBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDO1lBQUMsT0FBTztRQUNyQyxJQUFJLEVBQUUsR0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksRUFBRSxHQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUM7UUFFdkMsSUFBSSxJQUFJLEdBQUMsRUFBRSxDQUFDO1FBQ1osS0FBSyxJQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNyQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDM0MsSUFBSSxPQUFPLEdBQVMsR0FBRyxDQUFDO2dCQUN4QixJQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUUsQ0FBQyxFQUFFO29CQUMxRCxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUMsQ0FBQyxFQUFDO3dCQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN0QjtpQkFDSjthQUNKO1NBQ0o7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQyxJQUFNLEtBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSTtnQkFDQSxtQ0FBbUM7Z0JBQ25DLElBQUksR0FBRyxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQztvQkFDVCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ2QsTUFBTTtvQkFDTixHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM3QjthQUNKO1lBQUMsT0FBTyxLQUFLLEVBQUUsR0FBRTtZQUVsQixJQUFJO2dCQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUcsQ0FBQyxDQUFDO2dCQUMxQiw4QkFBOEI7YUFDakM7WUFBQyxPQUFPLEtBQUssRUFBRSxHQUFFO1NBQ3JCO0lBRUwsQ0FBQztJQUdhLDRCQUFrQixHQUFoQyxVQUFpQyxNQUFNLEVBQUMsTUFBVztRQUFYLHVCQUFBLEVBQUEsYUFBVztRQUMvQyxJQUFHLE1BQU0sSUFBRSxJQUFJO1lBQUMsT0FBTztRQUN2QixJQUFJLE9BQU8sR0FBQyx1QkFBVSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM1RSxJQUFJLElBQUksR0FBQyxFQUFFLENBQUM7UUFDWixLQUFLLElBQUksQ0FBQyxJQUFJLE9BQU8sRUFBQztZQUNsQixJQUFJLEdBQUcsR0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7UUFFRCxJQUFJLElBQUksR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDMUMsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUM7WUFDZixJQUFNLENBQUMsR0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxHQUFHLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxJQUFJLEdBQUMsTUFBTSxDQUFDO1NBQ25CO0lBQ0wsQ0FBQztJQUVjLG1CQUFTLEdBQXhCLFVBQXlCLEdBQUcsRUFBQyxHQUFHO1FBQzVCLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLEtBQUssSUFBTSxDQUFDLElBQUksR0FBRyxFQUFFO1lBQ2pCLElBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFHLENBQUMsWUFBWSxJQUFJLENBQUMsVUFBVSxFQUFDO2dCQUM1QixTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQzthQUM5QjtTQUNKO0lBQ0wsQ0FBQztJQUVjLGVBQUssR0FBcEIsVUFBcUIsR0FBRyxFQUFDLEdBQUc7UUFDeEIsS0FBSyxJQUFNLENBQUMsSUFBSSxHQUFHLEVBQUU7WUFDakIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUcsQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLEVBQUM7Z0JBQ3RCLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXBDLElBQUksY0FBYyxHQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUN2QyxJQUFHLGNBQWMsRUFBQztvQkFDZCxLQUFLLElBQU0sRUFBRSxJQUFJLGNBQWMsRUFBRTt3QkFDN0IsSUFBTSxFQUFFLEdBQUcsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUM5QixJQUFHLEVBQUUsWUFBWSxJQUFJLENBQUMsY0FBYyxFQUFDOzRCQUNqQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsRUFBRSxFQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUN4QztxQkFDSjtpQkFDSjtnQkFFRCxLQUFLLElBQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDaEIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNqQixJQUFHLEVBQUUsWUFBWSxJQUFJLENBQUMsYUFBYSxFQUFDO3dCQUNoQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsRUFBRSxFQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN4QztpQkFDSjthQUNKO1NBQ0o7SUFDTCxDQUFDO0lBRWMsb0JBQVUsR0FBekIsVUFBMEIsR0FBRyxFQUFDLEdBQUc7UUFDN0IsSUFBSSxVQUFVLEdBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pDLElBQUcsVUFBVSxFQUFDO1lBQ1YsS0FBSyxJQUFNLENBQUMsSUFBSSxVQUFVLEVBQUU7Z0JBQ3hCLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBRyxDQUFDLFlBQVksSUFBSSxDQUFDLFlBQVksRUFBQztvQkFDOUIsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQztvQkFDcEMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNoQzthQUNKO1NBQ0o7SUFDTCxDQUFDO0lBRWMsaUJBQU8sR0FBdEIsVUFBdUIsR0FBRyxFQUFDLEdBQUc7UUFDMUIsS0FBSyxJQUFNLENBQUMsSUFBSSxHQUFHLEVBQUU7WUFDakIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUcsQ0FBQyxZQUFZLElBQUksQ0FBQyxRQUFRLEVBQUM7Z0JBQzFCLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkM7U0FDSjtJQUNMLENBQUM7SUFFYyxxQkFBVyxHQUExQixVQUEyQixHQUFHLEVBQUMsR0FBRztRQUM5QixLQUFLLElBQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRTtZQUNqQixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBRyxDQUFDLFlBQVksSUFBSSxDQUFDLFVBQVUsRUFBQztnQkFDNUIsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7YUFDMUM7U0FDSjtJQUNMLENBQUM7SUFFYyxzQkFBWSxHQUEzQixVQUE0QixHQUFHLEVBQUMsR0FBRztRQUMvQixLQUFLLElBQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRTtZQUNqQixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBRyxDQUFDLFlBQVksSUFBSSxDQUFDLFdBQVcsRUFBQztnQkFDN0IsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQzthQUN2QztTQUNKO0lBQ0wsQ0FBQztJQUVjLDRCQUFrQixHQUFqQyxVQUFrQyxHQUFHLEVBQUMsR0FBRztRQUNyQyxJQUFJLElBQUksR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDMUMsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUM7WUFDZixJQUFJLEdBQUcsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBRyxHQUFHLElBQUUsR0FBRyxFQUFDO2dCQUNSLElBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUM7b0JBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2Y7YUFDSjtTQUNKO0lBQ0wsQ0FBQztJQUNMLGdCQUFDO0FBQUQsQ0FsV0EsQUFrV0MsSUFBQTtBQWxXWSw4QkFBUzs7OztBQ0Z0QjtJQUFBO1FBa0JZLGdCQUFXLEdBQWUsRUFBRSxDQUFDO1FBQzdCLFdBQU0sR0FBQyxLQUFLLENBQUM7UUFDYixZQUFPLEdBQUMsQ0FBQyxDQUFDO1FBQ1YsVUFBSyxHQUFDLENBQUMsQ0FBQztRQUNSLFdBQU0sR0FBQyxDQUFDLENBQUM7SUFpRHJCLENBQUM7SUFyRUcsc0JBQWtCLHNCQUFPO2FBQXpCO1lBQ0ksSUFBRyxXQUFXLENBQUMsS0FBSyxJQUFFLElBQUksRUFBQztnQkFDdkIsV0FBVyxDQUFDLEtBQUssR0FBQyxJQUFJLFdBQVcsRUFBRSxDQUFDO2FBQ3ZDO1lBQ0QsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDO1FBQzdCLENBQUM7OztPQUFBO0lBSU0sOEJBQVEsR0FBZixVQUFnQixPQUFxQixFQUFDLFVBQXVCLEVBQUMsZ0JBQThCO1FBQ3hGLElBQUksQ0FBQyxXQUFXLEdBQUMsVUFBVSxDQUFDO1FBQzVCLElBQUksQ0FBQyxpQkFBaUIsR0FBQyxnQkFBZ0IsQ0FBQztRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxZQUFZLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEYsQ0FBQztJQVFPLGtDQUFZLEdBQXBCLFVBQXFCLE9BQXFCO1FBQ3RDLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO1lBQzdCLElBQUksR0FBRyxHQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixtQ0FBbUM7WUFDbkMsNkJBQTZCO1lBQzdCLElBQUksS0FBSyxHQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWxDLElBQUksR0FBRyxHQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsSUFBSSxPQUFPLEdBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQztZQUM5QyxJQUFJLEtBQUssR0FBWSxFQUFFLENBQUM7WUFDeEIsSUFBSTtnQkFDQSxLQUFLLEdBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZCO1lBQUMsT0FBTyxLQUFLLEVBQUUsR0FBRTtZQUVsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbkMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBRSxFQUFFO29CQUFDLFNBQVM7Z0JBQ2xDLElBQUksTUFBTSxHQUFDLE9BQU8sR0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2pDO1NBQ0o7UUFFRCxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7WUFDdEMsR0FBRyxHQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1NBQ2xIO0lBQ0wsQ0FBQztJQUVPLGlDQUFXLEdBQW5CLFVBQW9CLENBQUM7UUFDakIsSUFBSSxJQUFJLEdBQUMsQ0FBQyxHQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFHLElBQUksR0FBQyxJQUFJLENBQUMsS0FBSztZQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakQsSUFBRyxJQUFJLENBQUMsaUJBQWlCLElBQUUsSUFBSSxFQUFDO1lBQzVCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNqRDtJQUNMLENBQUM7SUFFTyxrQ0FBWSxHQUFwQjtRQUNJLElBQUksQ0FBQyxPQUFPLElBQUUsQ0FBQyxDQUFDO1FBQ2hCLElBQUcsSUFBSSxDQUFDLE9BQU8sSUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBQztZQUNyQyxJQUFHLElBQUksQ0FBQyxXQUFXLElBQUUsSUFBSSxFQUFDO2dCQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQzFCO1NBQ0o7SUFDTCxDQUFDO0lBRUwsa0JBQUM7QUFBRCxDQXZFQSxBQXVFQyxJQUFBO0FBdkVZLGtDQUFXOzs7O0FDQXhCLDJDQUEwQztBQUUxQztJQUFpQywrQkFBYTtJQUE5Qzs7SUFzQ0EsQ0FBQztJQXJDVSx5QkFBRyxHQUFWLFVBQVcsWUFBNEI7UUFBNUIsNkJBQUEsRUFBQSxtQkFBNEI7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNHLCtCQUFTLEdBQWhCO1FBQ08sSUFBSSxDQUFDLE9BQU8sR0FBQyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBQyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRywyQkFBSyxHQUFaO0lBRUcsQ0FBQztJQU9HLDhCQUFRLEdBQWY7UUFDTyxpQkFBTSxRQUFRLFdBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFDLElBQUksQ0FBQyxLQUFzQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBQztZQUN0QixJQUFJLENBQUMsV0FBVyxHQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUM5RDtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDcEMsQ0FBQztJQUVELE1BQU07SUFDQyw2QkFBTyxHQUFkLFVBQWUsQ0FBUztRQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3hGLENBQUM7SUFFRCxFQUFFO0lBQ0ssaUNBQVcsR0FBbEIsVUFBbUIsTUFBTSxFQUFDLEdBQVU7UUFDaEMsT0FBTyx1QkFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0F0Q0EsQUFzQ0MsQ0F0Q2dDLElBQUksQ0FBQyxRQUFRLEdBc0M3QztBQXRDWSxrQ0FBVzs7OztBQ0F4QjtJQUFBO0lBOFVBLENBQUM7SUE3VWlCLG1CQUFRLEdBQXRCLFVBQXVCLE1BQU0sRUFBQyxPQUFjO1FBQ3hDLElBQUksTUFBTSxJQUFJLElBQUksRUFDbEI7WUFDSSxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsSUFBRyxNQUFNLENBQUMsSUFBSSxJQUFFLE9BQU8sRUFBQztZQUNwQixPQUFPLE1BQU0sQ0FBQztTQUNqQjtRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QyxJQUFJLENBQUMsR0FBaUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsRUFDM0I7Z0JBQ0ksSUFBRyxDQUFDLENBQUMsSUFBSSxJQUFFLE9BQU8sRUFBQztvQkFDZixPQUFPLENBQUMsQ0FBQztpQkFDWjthQUNKO2lCQUNHO2dCQUNBLElBQUksT0FBTyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQyxJQUFHLE9BQU8sSUFBRSxJQUFJLEVBQUM7b0JBQ2IsT0FBTyxPQUFPLENBQUM7aUJBQ2xCO2FBQ0o7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFYSxzQkFBVyxHQUF6QixVQUEwQixNQUFNLEVBQUMsR0FBVTtRQUN2QyxJQUFJLE1BQU0sR0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUNhLHdCQUFhLEdBQTNCLFVBQTRCLE1BQU0sRUFBQyxNQUFvQixFQUFDLEVBQUk7UUFBSixtQkFBQSxFQUFBLE1BQUk7UUFDeEQsSUFBSSxPQUFPLEdBQWUsTUFBTSxDQUFDO1FBQ2pDLElBQUcsT0FBTyxJQUFFLElBQUk7WUFBQyxPQUFPLElBQUksQ0FBQztRQUM3QixJQUFJLEVBQUUsR0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsSUFBSSxTQUFTLEdBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFHLFNBQVMsSUFBRSxJQUFJO1lBQUMsT0FBTyxJQUFJLENBQUM7UUFDL0IsSUFBRyxFQUFFLElBQUUsTUFBTSxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUM7WUFDbkIsT0FBTyxTQUFTLENBQUM7U0FDcEI7YUFDRztZQUNBLFNBQVMsR0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUN2RDtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFYSwrQkFBb0IsR0FBbEMsVUFBbUMsTUFBTSxFQUFDLElBQVEsRUFBQyxHQUFJO1FBQ25ELElBQUcsR0FBRyxJQUFFLElBQUk7WUFBQyxHQUFHLEdBQUMsRUFBRSxDQUFDO1FBRXBCLElBQUksTUFBTSxJQUFJLElBQUksRUFDbEI7WUFDSSxPQUFPLEdBQUcsQ0FBQztTQUNkO1FBRUQsSUFBSSxHQUFHLEdBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFHLEdBQUcsSUFBRSxJQUFJLEVBQUM7WUFDVCxJQUFHLE1BQU0sWUFBWSxJQUFJLEVBQUM7Z0JBQ3RCLEdBQUcsR0FBQyxNQUFNLENBQUM7YUFDZDtTQUNKO1FBQ0QsSUFBRyxHQUFHLElBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxFQUFDO1lBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDakI7UUFDRCxJQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUUsSUFBSTtZQUFFLE9BQU8sR0FBRyxDQUFDO1FBRXRDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QyxJQUFJLENBQUMsR0FBaUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBQyxHQUFHLENBQUMsQ0FBQztTQUN6QztRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVhLHNCQUFXLEdBQXpCLFVBQTBCLE1BQU0sRUFBQyxVQUFrQjtRQUMvQyxJQUFHLE1BQU0sSUFBRSxJQUFJO1lBQUMsT0FBTyxJQUFJLENBQUM7UUFDNUIsSUFBSSxPQUFPLEdBQWUsSUFBSSxDQUFDO1FBQy9CLElBQUcsVUFBVSxFQUFDO1lBQ1YsSUFBSSxPQUFPLEdBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkQsSUFBRyxPQUFPLEVBQUM7Z0JBQ1AsT0FBTyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzlDO1NBQ0o7YUFDRztZQUNBLE9BQU8sR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDVyxtQkFBUSxHQUF0QixVQUF1QixjQUFrQyxFQUFDLGdCQUFvQixFQUFDLGFBQWUsRUFBQyxjQUF3QixFQUFDLFFBQXFCO1FBQW5GLGlDQUFBLEVBQUEsc0JBQW9CO1FBQUMsOEJBQUEsRUFBQSxpQkFBZTtRQUFDLCtCQUFBLEVBQUEsbUJBQXdCO1FBQUMseUJBQUEsRUFBQSxlQUFxQjtRQUN6SSxRQUFRO1FBQ1IsY0FBYyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDakMsUUFBUTtRQUNSLGNBQWMsQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQy9DLFVBQVU7UUFDVixjQUFjLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDbkQsY0FBYyxDQUFDLGVBQWUsR0FBQyxDQUFDLENBQUM7UUFDakMsZ0JBQWdCO1FBQ2hCLGNBQWMsQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0lBQ2pELENBQUM7SUFHRDs7Ozs7O09BTUc7SUFDVyx1QkFBWSxHQUExQixVQUEyQixNQUFNLEVBQUMsSUFBTSxFQUFDLFFBQWEsRUFBQyxVQUFlO1FBQXBDLHFCQUFBLEVBQUEsUUFBTTtRQUFDLHlCQUFBLEVBQUEsZUFBYTtRQUFDLDJCQUFBLEVBQUEsaUJBQWU7UUFDbEUsSUFBRyxNQUFNLFlBQVksSUFBSSxDQUFDLFlBQVksRUFBQztZQUNuQyxJQUFJLElBQUksR0FBRSxNQUE0QixDQUFDO1lBQ3ZDLElBQUcsSUFBSSxJQUFFLENBQUMsRUFBQztnQkFDUCxNQUFNO2dCQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQzthQUM5QztpQkFDSSxJQUFHLElBQUksSUFBRSxDQUFDLEVBQUM7Z0JBQ1osTUFBTTtnQkFDTixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7YUFDM0M7aUJBQ0ksSUFBRyxJQUFJLElBQUUsQ0FBQyxFQUFDO2dCQUNaLE1BQU07Z0JBQ04sSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO2dCQUMzQyxNQUFNO2dCQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQzthQUMzQztTQUNKO1FBQ0QsSUFBRyxNQUFNLFlBQVksSUFBSSxDQUFDLG1CQUFtQixFQUFDO1lBQzFDLElBQUksS0FBSyxHQUFFLE1BQW1DLENBQUM7WUFDL0MsSUFBRyxJQUFJLElBQUUsQ0FBQyxFQUFDO2dCQUNQLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO2FBQ3REO2lCQUNJLElBQUcsSUFBSSxJQUFFLENBQUMsRUFBQztnQkFDWixLQUFLLENBQUMsbUJBQW1CLENBQUMsVUFBVSxHQUFDLFFBQVEsQ0FBQzthQUNqRDtTQUNKO1FBRUQsSUFBRyxVQUFVLEVBQUM7WUFDVixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3hDO1NBQ0o7SUFFTCxDQUFDO0lBRWEsa0JBQU8sR0FBckIsVUFBc0IsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDO1FBQ3ZCLElBQUksSUFBSSxHQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFFLElBQUksQ0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBQ2MsY0FBRyxHQUFsQixVQUFtQixDQUFDO1FBQ2hCLENBQUMsR0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFYSxrQkFBTyxHQUFyQixVQUFzQixHQUFVO1FBQzVCLGtFQUFrRTtRQUNsRSxJQUFJLGNBQWMsR0FBRyxrQ0FBa0MsQ0FBQztRQUN4RCxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sR0FBRywyQ0FBMkMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkUsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1osQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFCLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQixDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDN0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUdhLGtCQUFPLEdBQXJCLFVBQXNCLENBQUM7UUFDekIsSUFBRyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUUsQ0FBQyxFQUFDO1lBQ3RCLENBQUMsR0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hCO1FBQ1AsT0FBTyxDQUFDLENBQUM7SUFDVixDQUFDO0lBR2UsZ0JBQUssR0FBbkIsVUFBb0IsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFRO1FBQzNDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUdhLHdCQUFhLEdBQTNCLFVBQTRCLEdBQWUsRUFBRSxhQUEwQixFQUFFLEdBQWEsRUFBRSxhQUFzQixFQUFFLGFBQXNCO1FBQ2xJLElBQUksY0FBYyxHQUFJLElBQUksS0FBSyxFQUFrQixDQUFDO1FBQ2xELElBQUksSUFBSSxHQUFFLEdBQUcsQ0FBQztRQUNkLElBQUcsQ0FBQyxJQUFJLEVBQUM7WUFDTCxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDL0Q7UUFDRCxXQUFXO1FBQ1gsSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsa0JBQWtCO1FBQ2xCLElBQUcsR0FBRyxDQUFDLEtBQUssSUFBRSxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsSUFBRSxJQUFJLEVBQUM7WUFDcEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ3JHO1FBQ0QsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUk7SUFDTyxtQkFBUSxHQUF0QixVQUF1QixDQUFjLEVBQUMsQ0FBYztRQUNuRCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsR0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE9BQU8sQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUlELHlEQUF5RDtJQUMzQyxrQkFBTyxHQUFyQixVQUFzQixNQUFNLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBRSxjQUFzQixFQUFFLGFBQTJCLEVBQUUsTUFBa0IsRUFBRSxVQUFtQjtRQUN6SSxJQUFJLFFBQVEsR0FBZSxNQUFNLENBQUM7UUFDbEMsSUFBRyxVQUFVLElBQUUsSUFBSSxFQUFDO1lBQ2hCLFFBQVEsR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxVQUFVLENBQWtCLENBQUM7U0FDOUQ7UUFDRCxJQUFHLFFBQVEsSUFBRSxJQUFJO1lBQUMsT0FBTyxJQUFJLENBQUM7UUFDOUIsSUFBSSxZQUFZLEdBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFrQixDQUFDO1FBQ3ZFLElBQUcsWUFBWSxJQUFFLElBQUk7WUFBQyxPQUFPLElBQUksQ0FBQztRQUNsQyxJQUFHLGFBQWEsRUFBQztZQUNiLFVBQVUsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEVBQUMsYUFBYSxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsVUFBVSxDQUFDLENBQUM7U0FDNUY7UUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQyxVQUFVLEVBQUMsY0FBYyxDQUFDLENBQUM7UUFDckQsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQUVhLHlCQUFjLEdBQTVCLFVBQTZCLE1BQU0sRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFDLElBQVcsRUFBQyxRQUFxQixFQUFDLFVBQWUsRUFBQyxNQUFrQixFQUFDLFVBQW1CO1FBQXRELDJCQUFBLEVBQUEsaUJBQWU7UUFDcEcsSUFBSSxRQUFRLEdBQWUsTUFBTSxDQUFDO1FBQ2xDLElBQUcsVUFBVSxJQUFFLElBQUksRUFBQztZQUNoQixRQUFRLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUMsVUFBVSxDQUFrQixDQUFDO1NBQzlEO1FBQ0QsSUFBRyxRQUFRLElBQUUsSUFBSTtZQUFDLE9BQU8sSUFBSSxDQUFDO1FBQzlCLElBQUksWUFBWSxHQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBa0IsQ0FBQztRQUN2RSxJQUFHLFlBQVksSUFBRSxJQUFJO1lBQUMsT0FBTyxJQUFJLENBQUM7UUFFbEMsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlGLElBQUksR0FBRyxHQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFrQixDQUFDO1FBQzlELElBQUcsQ0FBQyxHQUFHLEVBQUM7WUFDSixHQUFHLEdBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQWtCLENBQUM7U0FDN0Q7UUFDRCxJQUFJLFlBQVksR0FBQyxNQUFNLEdBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUMsT0FBTyxHQUFDLElBQUksQ0FBQztRQUN4RCxJQUFHLFVBQVUsRUFBQztZQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBQyxJQUFJLEVBQUMsVUFBQyxhQUFhLEVBQUMsU0FBUyxFQUFDLENBQUM7Z0JBQ3hELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLEdBQUcsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbkMsQ0FBQyxFQUFDLENBQUMsWUFBWSxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDOUI7YUFDRztZQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBQyxJQUFJLEVBQUMsVUFBQyxhQUFhLEVBQUMsU0FBUyxFQUFDLENBQUM7Z0JBQ3RELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsQ0FBQyxFQUFDLENBQUMsWUFBWSxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDOUI7UUFDRCxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFYSx5QkFBYyxHQUE1QixVQUE2QixNQUFNLEVBQUMsVUFBVSxFQUFDLFFBQXFCO1FBQ2hFLElBQUksUUFBUSxHQUFlLE1BQU0sQ0FBQztRQUNsQyxJQUFHLFVBQVUsSUFBRSxJQUFJLEVBQUM7WUFDaEIsUUFBUSxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFDLFVBQVUsQ0FBa0IsQ0FBQztTQUM5RDtRQUNELElBQUcsUUFBUSxJQUFFLElBQUk7WUFBQyxPQUFPLElBQUksQ0FBQztRQUM5QixJQUFJLFlBQVksR0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQWtCLENBQUM7UUFDdkUsSUFBRyxZQUFZLElBQUUsSUFBSTtZQUFDLE9BQU8sSUFBSSxDQUFDO1FBQ2xDLElBQUksR0FBRyxHQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFrQixDQUFDO1FBQzlELElBQUcsR0FBRyxFQUFDO1lBQ0gsSUFBSSxZQUFZLEdBQUMsTUFBTSxHQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVELEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBRWEsdUJBQVksR0FBMUIsVUFBMkIsTUFBTSxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsU0FBZ0IsRUFBQyxJQUFXLEVBQUMsTUFBa0IsRUFBQyxVQUFtQjtRQUNwSCxJQUFJLFFBQVEsR0FBZSxJQUFJLENBQUM7UUFDaEMsSUFBSSxZQUFZLEdBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUcsTUFBTSxZQUFZLElBQUksQ0FBQyxRQUFRLEVBQUM7WUFDL0IsUUFBUSxHQUFDLE1BQU0sQ0FBQztZQUNoQixJQUFHLFVBQVUsSUFBRSxJQUFJLEVBQUM7Z0JBQ2hCLFFBQVEsR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxVQUFVLENBQWtCLENBQUM7YUFDOUQ7WUFDRCxJQUFHLFFBQVEsSUFBRSxJQUFJO2dCQUFDLE9BQU8sSUFBSSxDQUFDO1lBQzlCLFlBQVksR0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQWtCLENBQUM7U0FDdEU7YUFDSSxJQUFHLE1BQU0sWUFBWSxJQUFJLENBQUMsUUFBUSxFQUFDO1lBQ3BDLFlBQVksR0FBQyxNQUFNLENBQUM7U0FDdkI7UUFDRCxJQUFHLFlBQVksSUFBRSxJQUFJO1lBQUMsT0FBTyxJQUFJLENBQUM7UUFDbEMsSUFBSSxhQUFhLEdBQW9CLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckcsSUFBRyxhQUFhLElBQUUsSUFBSTtZQUFDLE9BQU8sSUFBSSxDQUFDO1FBQ25DLElBQUksS0FBSyxHQUFDLElBQUksQ0FBQztRQUNmLElBQUksTUFBTSxHQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3ZDLEtBQUssSUFBTSxHQUFHLElBQUksTUFBTSxFQUFFO1lBQ3RCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDNUIsSUFBTSxPQUFLLEdBQXVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsSUFBRyxPQUFLLENBQUMsU0FBUyxJQUFFLFNBQVMsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFDO29CQUMzQyxLQUFLLEdBQUMsS0FBSyxDQUFDO29CQUNaLE1BQU07aUJBQ1Q7YUFDSjtTQUNKO1FBQ0QsSUFBRyxLQUFLLEVBQUM7WUFDTCxJQUFJLFFBQVEsR0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QyxRQUFRLENBQUMsU0FBUyxHQUFDLFNBQVMsQ0FBQztZQUM3QixJQUFJLFlBQVksR0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUMvQyxJQUFHLElBQUksSUFBRSxDQUFDLENBQUMsRUFBQztnQkFDUixJQUFJLEdBQUMsWUFBWSxDQUFDO2FBQ3JCO1lBQ0QsUUFBUSxDQUFDLElBQUksR0FBRSxJQUFJLEdBQUcsWUFBWSxDQUFDO1lBQ25DLFFBQVEsQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDO1lBQ3ZCLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQUVhLHVCQUFZLEdBQTFCLFVBQTJCLE1BQU0sRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFDLE1BQVcsRUFBQyxVQUFtQjtRQUNoRixJQUFJLFFBQVEsR0FBZSxNQUFNLENBQUM7UUFDbEMsSUFBRyxVQUFVLElBQUUsSUFBSSxFQUFDO1lBQ2hCLFFBQVEsR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxVQUFVLENBQWtCLENBQUM7U0FDOUQ7UUFDRCxJQUFHLFFBQVEsSUFBRSxJQUFJO1lBQUMsT0FBTyxJQUFJLENBQUM7UUFDOUIsSUFBSSxZQUFZLEdBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFrQixDQUFDO1FBQ3ZFLElBQUcsWUFBWSxJQUFFLElBQUk7WUFBQyxPQUFPLElBQUksQ0FBQztRQUNsQyxJQUFJLGFBQWEsR0FBb0IsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRyxJQUFHLGFBQWEsSUFBRSxJQUFJO1lBQUMsT0FBTyxJQUFJLENBQUM7UUFDbkMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDO0lBR0wsaUJBQUM7QUFBRCxDQTlVQSxBQThVQyxJQUFBO0FBOVVZLGdDQUFVO0FBa1Z2QjtJQUE0QixpQ0FBYTtJQUF6QztRQUFBLHFFQW9CQztRQW5CVyxlQUFTLEdBQUMsRUFBRSxDQUFDOztJQW1CekIsQ0FBQztJQWxCVSxtQ0FBVyxHQUFsQixVQUFtQixZQUFZO1FBQzNCLElBQUksT0FBTyxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pELElBQUcsT0FBTyxHQUFDLENBQUMsRUFBQztZQUNULElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQztJQUNNLG1DQUFXLEdBQWxCLFVBQW1CLFlBQVk7UUFDM0IsSUFBSSxPQUFPLEdBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakQsSUFBRyxPQUFPLElBQUUsQ0FBQyxFQUFDO1lBQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQztJQUNNLHlDQUFpQixHQUF4QixVQUF5QixNQUFrQjtRQUN2QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUMsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUMsTUFBTSxDQUFDLENBQUM7U0FDekM7SUFDTCxDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQXBCQSxBQW9CQyxDQXBCMkIsSUFBSSxDQUFDLFFBQVEsR0FvQnhDOzs7O0FDeFdELDhDQUE2QztBQUc3QztJQUFpRCx1Q0FBVztJQUE1RDs7SUF5TEEsQ0FBQztJQXRMRyxxQ0FBTyxHQUFQO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFrQixDQUFDO1FBQ3JFLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBQyxLQUFLLENBQUM7WUFDbkIsT0FBTztTQUNWO1FBQ0QsZ0RBQWdEO1FBRWhELElBQUksSUFBSSxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUM7UUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsSUFBSSxNQUFNLEdBQUMsSUFBSSxDQUFDO1lBQ2hCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBRSxDQUFDLEVBQUM7b0JBQ3BDLE1BQU0sR0FBQyxJQUFJLENBQUM7b0JBQ1osTUFBTTtpQkFDVDthQUNKO1lBQ0QsSUFBRyxNQUFNLElBQUUsSUFBSSxFQUFDO2dCQUNaLElBQUksQ0FBQyxZQUFZLEdBQUMsTUFBTSxDQUFDO2FBQzVCO1lBQ0QsK0JBQStCO1NBQ2xDO1FBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBTyxHQUFDLEtBQUssQ0FBQztZQUNuQixPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQXNCRCwwQ0FBWSxHQUFaO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNwRCxJQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQztZQUNYLElBQUksQ0FBQyxPQUFPLEdBQUMsS0FBSyxDQUFDO1lBQ25CLE9BQU87U0FDVjtRQUNELElBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUMsQ0FBQyxFQUFDO1lBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUMsRUFBRSxDQUFDO1lBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQW1CLENBQUMsU0FBUyxDQUFDO2FBQ3ZGO1NBQ0o7UUFDRCxJQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBQztZQUNsQixJQUFJLENBQUMsT0FBTyxHQUFDLEtBQUssQ0FBQztZQUNuQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsY0FBYyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFNUQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ2hFLElBQUksQ0FBQyxxQkFBcUIsR0FBQyxFQUFFLENBQUM7UUFFOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFaEMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUVuRCxJQUFJLFVBQVUsR0FBQyxFQUFFLENBQUM7WUFFbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQ3ZEO2dCQUNJLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLEdBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLElBQUcsSUFBSSxFQUFDO29CQUNULFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RCO2FBQ0o7WUFFRCxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztTQUV6RDtJQUNMLENBQUM7SUFHRCwwQ0FBWSxHQUFaO1FBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFFLENBQUM7WUFBQyxPQUFPO1FBQ3JJLElBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUUsQ0FBQztZQUFDLE9BQU87UUFDOUIsSUFBSSxTQUFTLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1FBQ3ZELElBQUcsU0FBUyxDQUFDLE9BQU87WUFBQyxPQUFPO1FBRTVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUMxRDtZQUNJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQy9DO2dCQUNJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxDLElBQUksR0FBRyxHQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO2dCQUMxQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQzNDO1NBQ0o7UUFFRCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUU1RSxDQUFDO0lBR0QsbURBQXFCLEdBQXJCLFVBQXNCLGFBQWE7UUFDckMsSUFBSSxRQUFRLEdBQUMsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsQ0FBQyxFQUFDLFlBQVksRUFBQyxlQUFlLEVBQUMsY0FBYyxFQUFDLGFBQWEsRUFBQyxLQUFLLEdBQUMsQ0FBQyxFQUFDLFlBQVksQ0FBQztRQUMzRixJQUFJLGlCQUFpQixHQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDM0MsS0FBSyxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxpQkFBaUIsRUFBQyxDQUFDLEVBQUUsRUFBQztZQUNsQyxZQUFZLEdBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLGNBQWMsR0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDO1lBQzdELEtBQUssQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztnQkFDdEMsYUFBYSxHQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxhQUFhLENBQUMsYUFBYSxLQUFHLGdEQUFnRCxDQUFBLFNBQVMsSUFBSSxhQUFhLENBQUMsWUFBWSxLQUFHLHFEQUFxRCxDQUFBLENBQUMsRUFBQztvQkFDbEwsZUFBZSxHQUFDLGFBQWEsQ0FBQztvQkFDOUIsTUFBTztpQkFDUDthQUNEO1lBQ0QsWUFBWSxHQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQyxLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxJQUFFLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFDO2dCQUNuRixLQUFLLEdBQUMsQ0FBQyxHQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxFQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEVBQUMsWUFBWSxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkc7U0FDRDtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2QsQ0FBQztJQUVELG1EQUFxQixHQUFyQixVQUFzQixhQUFhLEVBQUMsUUFBUTtRQUM5QyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLENBQUMsRUFBQyxZQUFZLEVBQUMsZUFBZSxFQUFDLGNBQWMsRUFBQyxhQUFhLEVBQUMsS0FBSyxHQUFDLENBQUMsRUFBQyxZQUFZLEVBQUMsT0FBTyxDQUFDO1FBQ25HLElBQUksaUJBQWlCLEdBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUMzQyxLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLGlCQUFpQixFQUFDLENBQUMsRUFBRSxFQUFDO1lBQ2xDLFlBQVksR0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsY0FBYyxHQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUM7WUFDN0QsS0FBSyxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO2dCQUN0QyxhQUFhLEdBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLGFBQWEsQ0FBQyxhQUFhLEtBQUcsZ0RBQWdELENBQUEsU0FBUyxJQUFJLGFBQWEsQ0FBQyxZQUFZLEtBQUcscURBQXFELENBQUEsQ0FBQyxFQUFDO29CQUNsTCxlQUFlLEdBQUMsYUFBYSxDQUFDO29CQUM5QixNQUFPO2lCQUNQO2FBQ0Q7WUFDUSxZQUFZLEdBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQztZQUNqQixLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxJQUFFLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFDO2dCQUN2RSxPQUFPLEdBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixLQUFLLEdBQUMsQ0FBQyxHQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxZQUFZLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLFlBQVksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsWUFBWSxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsR0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDLEVBQUUsQ0FBQzthQUNQO1lBQ0QsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM1QztJQUNDLENBQUM7SUFFRCwyQ0FBYSxHQUFiLFVBQWMsTUFBTSxFQUFDLEdBQUc7UUFDcEIsSUFBSSxNQUFNLEdBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFHLElBQUksRUFBQztZQUN0QixJQUFJLGNBQWMsR0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDM0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsRUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ2pJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzdFO2FBQUs7WUFDRixHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0F6TEEsQUF5TEMsQ0F6TGdELHlCQUFXLEdBeUwzRDs7Ozs7QUM1TEQseUNBQXdDO0FBRXhDO0lBZ0hDO0lBQ0EsQ0FBQztJQTdHYSxxQkFBUSxHQUF0QixVQUF1QixRQUFnQixFQUFFLElBQVksRUFBRSxRQUFnQixFQUFFLG9CQUE0QixFQUFFLE1BQWM7UUFDcEgsUUFBUSxRQUFRLEVBQUU7WUFDakIsS0FBSyxxQkFBUyxDQUFDLE1BQU07Z0JBQ3BCLE9BQU8sSUFBSSxHQUFHLFFBQVEsQ0FBQztZQUN4QixLQUFLLHFCQUFTLENBQUMsTUFBTTtnQkFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9ELEtBQUsscUJBQVMsQ0FBQyxPQUFPO2dCQUNyQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUQsS0FBSyxxQkFBUyxDQUFDLFNBQVM7Z0JBQ3ZCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pELEtBQUsscUJBQVMsQ0FBQyxNQUFNO2dCQUNwQixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNsQyxLQUFLLHFCQUFTLENBQUMsT0FBTztnQkFDckIsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLEtBQUsscUJBQVMsQ0FBQyxTQUFTO2dCQUN2QixJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO29CQUFFLE9BQU8sR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQzNELE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0MsS0FBSyxxQkFBUyxDQUFDLE9BQU87Z0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztZQUN6QyxLQUFLLHFCQUFTLENBQUMsUUFBUTtnQkFDdEIsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RCxLQUFLLHFCQUFTLENBQUMsVUFBVTtnQkFDeEIsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDbEUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzlDLEtBQUsscUJBQVMsQ0FBQyxPQUFPO2dCQUNyQixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hELEtBQUsscUJBQVMsQ0FBQyxRQUFRO2dCQUN0QixPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLEtBQUsscUJBQVMsQ0FBQyxVQUFVO2dCQUN4QixJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO29CQUFFLE9BQU8sR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDekUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RELEtBQUsscUJBQVMsQ0FBQyxPQUFPO2dCQUNyQixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztZQUN2RCxLQUFLLHFCQUFTLENBQUMsUUFBUTtnQkFDdEIsT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLEtBQUsscUJBQVMsQ0FBQyxVQUFVO2dCQUN4QixJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO29CQUFFLE9BQU8sR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2hGLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzVELEtBQUsscUJBQVMsQ0FBQyxNQUFNO2dCQUNwQixPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRSxLQUFLLHFCQUFTLENBQUMsT0FBTztnQkFDckIsSUFBSSxJQUFJLElBQUksUUFBUTtvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xELEtBQUsscUJBQVMsQ0FBQyxTQUFTO2dCQUN2QixJQUFJLElBQUksSUFBSSxDQUFDO29CQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QixJQUFJLElBQUksSUFBSSxRQUFRO29CQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMvQixJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO29CQUFFLE9BQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvQyxLQUFLLHFCQUFTLENBQUMsTUFBTTtnQkFDcEIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEQsS0FBSyxxQkFBUyxDQUFDLE9BQU87Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMzRCxLQUFLLHFCQUFTLENBQUMsU0FBUztnQkFDdkIsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNqRixPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RELEtBQUsscUJBQVMsQ0FBQyxTQUFTO2dCQUN2QixJQUFJLEVBQVUsQ0FBQztnQkFDZixJQUFJLElBQUksSUFBSSxDQUFDO29CQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksTUFBTSxJQUFJLENBQUM7b0JBQUUsTUFBTSxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUM7Z0JBQ3pDLElBQUksb0JBQW9CLEdBQUcsQ0FBQyxFQUFFO29CQUM3QixvQkFBb0IsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2lCQUNoQjs7b0JBQ0ksRUFBRSxHQUFHLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLG9CQUFvQixDQUFDLENBQUM7Z0JBQzdFLE9BQU8sQ0FBQyxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNsSSxLQUFLLHFCQUFTLENBQUMsVUFBVTtnQkFDeEIsSUFBSSxFQUFVLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLElBQUksQ0FBQztvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLE1BQU0sSUFBSSxDQUFDO29CQUFFLE1BQU0sR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDO2dCQUN6QyxJQUFJLG9CQUFvQixHQUFHLENBQUMsRUFBRTtvQkFDN0Isb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO29CQUN6QixFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDaEI7O29CQUNJLEVBQUUsR0FBRyxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUM3RSxPQUFPLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvSCxLQUFLLHFCQUFTLENBQUMsWUFBWTtnQkFDMUIsSUFBSSxDQUFTLENBQUM7Z0JBQ2QsSUFBSSxJQUFJLElBQUksQ0FBQztvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxNQUFNLElBQUksQ0FBQztvQkFBRSxNQUFNLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLG9CQUFvQixHQUFHLENBQUMsRUFBRTtvQkFDN0Isb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO29CQUN6QixDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDZjs7b0JBQ0ksQ0FBQyxHQUFHLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLG9CQUFvQixDQUFDLENBQUM7Z0JBQzVFLElBQUksSUFBSSxHQUFHLENBQUM7b0JBQUUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDcEosT0FBTyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUN6SSxLQUFLLHFCQUFTLENBQUMsTUFBTTtnQkFDcEIsT0FBTyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO1lBQy9GLEtBQUsscUJBQVMsQ0FBQyxPQUFPO2dCQUNyQixPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9HLEtBQUsscUJBQVMsQ0FBQyxTQUFTO2dCQUN2QixJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO29CQUFFLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLG9CQUFvQixDQUFDLENBQUMsQ0FBQztnQkFDdkksT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pILEtBQUsscUJBQVMsQ0FBQyxRQUFRO2dCQUN0QixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3RDLEtBQUsscUJBQVMsQ0FBQyxTQUFTO2dCQUN2QixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZDLEtBQUsscUJBQVMsQ0FBQyxXQUFXO2dCQUN6QixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXpDO2dCQUNDLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN6QztJQUNGLENBQUM7SUE3R2MscUJBQVEsR0FBVyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUNqQyxtQkFBTSxHQUFXLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBZ0g3QyxtQkFBQztDQWxIRCxBQWtIQyxJQUFBO0FBbEhZLG9DQUFZO0FBb0h6QixvSEFBb0g7QUFDcEg7SUFBQTtJQXdCQSxDQUFDO0lBdkJjLGFBQU0sR0FBcEIsVUFBcUIsSUFBWSxFQUFFLFFBQWdCO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRWEsY0FBTyxHQUFyQixVQUFzQixJQUFZLEVBQUUsUUFBZ0I7UUFDbkQsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTtZQUNwQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztTQUM5QjtRQUNELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ3RCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDdkQ7UUFDRCxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRTtZQUN4QixPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRWEsZ0JBQVMsR0FBdkIsVUFBd0IsSUFBWSxFQUFFLFFBQWdCO1FBQ3JELElBQUksSUFBSSxHQUFHLFFBQVEsR0FBRyxHQUFHLEVBQUU7WUFDMUIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQy9DO1FBQ0QsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbEUsQ0FBQztJQUNGLGFBQUM7QUFBRCxDQXhCQSxBQXdCQyxJQUFBO0FBeEJZLHdCQUFNOzs7O0FDdkhuQjtJQUFBO0lBaUNBLENBQUM7SUFoQ2MsZ0JBQU0sR0FBVyxDQUFDLENBQUM7SUFDbkIsZ0JBQU0sR0FBVyxDQUFDLENBQUM7SUFDbkIsaUJBQU8sR0FBVyxDQUFDLENBQUM7SUFDcEIsbUJBQVMsR0FBVyxDQUFDLENBQUM7SUFDdEIsZ0JBQU0sR0FBVyxDQUFDLENBQUM7SUFDbkIsaUJBQU8sR0FBVyxDQUFDLENBQUM7SUFDcEIsbUJBQVMsR0FBVyxDQUFDLENBQUM7SUFDdEIsaUJBQU8sR0FBVyxDQUFDLENBQUM7SUFDcEIsa0JBQVEsR0FBVyxDQUFDLENBQUM7SUFDckIsb0JBQVUsR0FBVyxDQUFDLENBQUM7SUFDdkIsaUJBQU8sR0FBVyxFQUFFLENBQUM7SUFDckIsa0JBQVEsR0FBVyxFQUFFLENBQUM7SUFDdEIsb0JBQVUsR0FBVyxFQUFFLENBQUM7SUFDeEIsaUJBQU8sR0FBVyxFQUFFLENBQUM7SUFDckIsa0JBQVEsR0FBVyxFQUFFLENBQUM7SUFDdEIsb0JBQVUsR0FBVyxFQUFFLENBQUM7SUFDeEIsZ0JBQU0sR0FBVyxFQUFFLENBQUM7SUFDcEIsaUJBQU8sR0FBVyxFQUFFLENBQUM7SUFDckIsbUJBQVMsR0FBVyxFQUFFLENBQUM7SUFDdkIsZ0JBQU0sR0FBVyxFQUFFLENBQUM7SUFDcEIsaUJBQU8sR0FBVyxFQUFFLENBQUM7SUFDckIsbUJBQVMsR0FBVyxFQUFFLENBQUM7SUFDdkIsbUJBQVMsR0FBVyxFQUFFLENBQUM7SUFDdkIsb0JBQVUsR0FBVyxFQUFFLENBQUM7SUFDeEIsc0JBQVksR0FBVyxFQUFFLENBQUM7SUFDMUIsZ0JBQU0sR0FBVyxFQUFFLENBQUM7SUFDcEIsaUJBQU8sR0FBVyxFQUFFLENBQUM7SUFDckIsbUJBQVMsR0FBVyxFQUFFLENBQUM7SUFDdkIsa0JBQVEsR0FBVyxFQUFFLENBQUM7SUFDdEIsbUJBQVMsR0FBVyxFQUFFLENBQUM7SUFDdkIscUJBQVcsR0FBVyxFQUFFLENBQUM7SUFDekIsZ0JBQU0sR0FBVyxFQUFFLENBQUM7SUFDbkMsZ0JBQUM7Q0FqQ0QsQUFpQ0MsSUFBQTtBQWpDWSw4QkFBUzs7OztBQ0N0QixpREFBZ0Q7QUFFaEQ7SUE2Q0M7SUFDQSxDQUFDO0lBM0NhLFNBQUUsR0FBaEIsVUFBaUIsS0FBYSxFQUFFLEdBQVcsRUFBRSxRQUFnQjtRQUM1RCxPQUFPLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVhLFVBQUcsR0FBakIsVUFBa0IsS0FBYSxFQUFFLE1BQWMsRUFBRSxHQUFXLEVBQUUsSUFBWSxFQUFFLFFBQWdCO1FBQzNGLE9BQU8sNkJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFYSxVQUFHLEdBQWpCLFVBQWtCLEtBQWEsRUFBRSxNQUFjLEVBQUUsTUFBYyxFQUM5RCxHQUFXLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxRQUFnQjtRQUN6RCxPQUFPLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFFYSxVQUFHLEdBQWpCLFVBQWtCLEtBQWEsRUFBRSxNQUFjLEVBQUUsTUFBYyxFQUFFLE1BQWMsRUFDOUUsR0FBVyxFQUFFLElBQVksRUFBRSxJQUFZLEVBQUUsSUFBWSxFQUFFLFFBQWdCO1FBQ3ZFLE9BQU8sNkJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN6RyxDQUFDO0lBRWEsY0FBTyxHQUFyQixVQUFzQixLQUFhLEVBQUUsR0FBVyxFQUFFLFFBQWdCO1FBQ2pFLE9BQU8sNkJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRWEsa0JBQVcsR0FBekIsVUFBMEIsS0FBYTtRQUN0QyxPQUFPLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFYSxZQUFLLEdBQW5CLFVBQW9CLE1BQWMsRUFBRSxNQUFjLEVBQUUsU0FBaUIsRUFBRSxRQUFnQjtRQUN0RixPQUFPLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFYSxpQkFBVSxHQUF4QixVQUF5QixNQUFjLEVBQUUsUUFBZ0I7UUFDeEQsT0FBTyw2QkFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVhLFdBQUksR0FBbEIsVUFBbUIsTUFBYyxFQUFFLFFBQXlCLEVBQUUsUUFBdUI7UUFBbEQseUJBQUEsRUFBQSxnQkFBeUI7UUFBRSx5QkFBQSxFQUFBLGVBQXVCO1FBQ3BGLDZCQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVhLGVBQVEsR0FBdEIsVUFBdUIsTUFBYyxFQUFFLFFBQXVCO1FBQXZCLHlCQUFBLEVBQUEsZUFBdUI7UUFDN0QsT0FBTyw2QkFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQTFDYSw4QkFBdUIsR0FBWSxJQUFJLENBQUM7SUE4Q3ZELGFBQUM7Q0EvQ0QsQUErQ0MsSUFBQTtBQS9DWSx3QkFBTTs7OztBQ0huQix1Q0FBc0M7QUFFdEM7SUFBQTtJQTRIQSxDQUFDO0lBdEhjLHlCQUFXLEdBQXpCO1FBQ0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUU7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0MsYUFBYSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDN0I7UUFFRCxJQUFJLE9BQWlCLENBQUM7UUFDdEIsSUFBSSxHQUFHLEdBQVcsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7UUFDcEQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ1osT0FBTyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDM0M7O1lBRUEsT0FBTyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQixhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBRTFFLElBQUksYUFBYSxDQUFDLGtCQUFrQixJQUFJLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTTtZQUN6RSxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRS9ILE9BQU8sT0FBTyxDQUFDO0lBQ2hCLENBQUM7SUFFYSx3QkFBVSxHQUF4QixVQUF5QixNQUFXLEVBQUUsUUFBYTtRQUNsRCxJQUFJLE1BQU0sSUFBSSxJQUFJO1lBQ2pCLE9BQU8sS0FBSyxDQUFDO1FBRWQsSUFBSSxPQUFPLEdBQVksUUFBUSxJQUFJLElBQUksQ0FBQztRQUN4QyxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xFLElBQUksT0FBTyxHQUFhLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87bUJBQy9ELENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksUUFBUSxDQUFDO2dCQUM3QyxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0lBRWEsd0JBQVUsR0FBeEIsVUFBeUIsTUFBVyxFQUFFLFNBQXdCLEVBQUUsUUFBbUI7UUFBN0MsMEJBQUEsRUFBQSxpQkFBd0I7UUFBRSx5QkFBQSxFQUFBLGVBQW1CO1FBQ2xGLElBQUksTUFBTSxJQUFJLElBQUk7WUFDakIsT0FBTyxLQUFLLENBQUM7UUFFZCxJQUFJLElBQUksR0FBWSxLQUFLLENBQUM7UUFDMUIsSUFBSSxHQUFHLEdBQVcsYUFBYSxDQUFDLGtCQUFrQixDQUFDO1FBQ25ELElBQUksT0FBTyxHQUFZLFFBQVEsSUFBSSxJQUFJLENBQUM7UUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLE9BQU8sR0FBYSxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPO21CQUMvRCxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxFQUFFO2dCQUMvQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ1o7U0FDRDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVhLHNCQUFRLEdBQXRCLFVBQXVCLE1BQVcsRUFBRSxRQUFhO1FBQ2hELElBQUksTUFBTSxJQUFJLElBQUk7WUFDakIsT0FBTyxJQUFJLENBQUM7UUFFYixJQUFJLEdBQUcsR0FBVyxhQUFhLENBQUMsa0JBQWtCLENBQUM7UUFDbkQsSUFBSSxPQUFPLEdBQVksUUFBUSxJQUFJLElBQUksQ0FBQztRQUN4QyxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksT0FBTyxHQUFhLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87bUJBQy9ELENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksUUFBUSxDQUFDLEVBQUU7Z0JBQy9DLE9BQU8sT0FBTyxDQUFDO2FBQ2Y7U0FDRDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVhLG9CQUFNLEdBQXBCO1FBQ0MsSUFBSSxFQUFFLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRXpDLElBQUksR0FBRyxHQUFXLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQztRQUNuRCxJQUFJLFlBQVksR0FBVyxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLFlBQVksR0FBVyxDQUFDLENBQUM7UUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLE9BQU8sR0FBYSxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtnQkFDcEIsSUFBSSxZQUFZLElBQUksQ0FBQyxDQUFDO29CQUNyQixZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixZQUFZLEVBQUUsQ0FBQzthQUNmO2lCQUNJLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDekIsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNqQixhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBRXRDLElBQUksWUFBWSxJQUFJLENBQUMsQ0FBQztvQkFDckIsWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDbEIsWUFBWSxFQUFFLENBQUM7YUFDZjtpQkFDSTtnQkFDSixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87b0JBQ25CLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRXJCLElBQUksWUFBWSxJQUFJLENBQUMsQ0FBQyxFQUFFO29CQUN2QixhQUFhLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLE9BQU8sQ0FBQztvQkFDcEQsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ3RDLFlBQVksRUFBRSxDQUFDO2lCQUNmO2FBQ0Q7U0FDRDtRQUVELElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTtZQUN0QixJQUFJLGFBQWEsQ0FBQyxrQkFBa0IsSUFBSSxHQUFHLEVBQUUsa0JBQWtCO2FBQy9EO2dCQUNDLElBQUksQ0FBQyxHQUFXLEdBQUcsQ0FBQztnQkFDcEIsR0FBRyxHQUFHLGFBQWEsQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUM7Z0JBQzdDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRTtvQkFDdkIsYUFBYSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNoRjtZQUNELGFBQWEsQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLENBQUM7U0FDaEQ7SUFDRixDQUFDO0lBMUhjLDJCQUFhLEdBQVUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsMEJBQVksR0FBZSxFQUFFLENBQUM7SUFDOUIsZ0NBQWtCLEdBQVcsQ0FBQyxDQUFDO0lBQy9CLHFCQUFPLEdBQVksS0FBSyxDQUFDO0lBd0h6QyxvQkFBQztDQTVIRCxBQTRIQyxJQUFBO0FBNUhZLHNDQUFhOzs7O0FDRjFCO0lBTUM7UUFDQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsc0JBQVcsOEJBQUs7YUFBaEI7WUFDQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakUsQ0FBQzthQUVELFVBQWlCLEtBQWE7WUFDN0IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQyxDQUFDOzs7T0FQQTtJQVNNLDhCQUFRLEdBQWYsVUFBZ0IsS0FBYTtRQUM1QixRQUFRLEtBQUssRUFBRTtZQUNkLEtBQUssQ0FBQztnQkFDTCxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZixLQUFLLENBQUM7Z0JBQ0wsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2YsS0FBSyxDQUFDO2dCQUNMLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNmLEtBQUssQ0FBQztnQkFDTCxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZjtnQkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxDQUFDO1NBQ2xEO0lBQ0YsQ0FBQztJQUVNLDhCQUFRLEdBQWYsVUFBZ0IsS0FBYSxFQUFFLEtBQWE7UUFDM0MsUUFBUSxLQUFLLEVBQUU7WUFDZCxLQUFLLENBQUM7Z0JBQ0wsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ2YsTUFBTTtZQUNQLEtBQUssQ0FBQztnQkFDTCxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDZixNQUFNO1lBQ1AsS0FBSyxDQUFDO2dCQUNMLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNmLE1BQU07WUFDUCxLQUFLLENBQUM7Z0JBQ0wsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ2YsTUFBTTtZQUNQO2dCQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDbEQ7SUFDRixDQUFDO0lBRU0sNkJBQU8sR0FBZDtRQUNDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDRixrQkFBQztBQUFELENBMURBLEFBMERDLElBQUE7QUExRFksa0NBQVc7Ozs7QUNBeEIsNkNBQTRDO0FBQzVDLHlDQUF3QztBQUN4QyxtQ0FBa0M7QUFDbEMsK0NBQThDO0FBRTlDO0lBb0NDO1FBQ0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztRQUVyQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDO0lBRU0sMkJBQVEsR0FBZixVQUFnQixLQUFhO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELHNCQUFXLDJCQUFLO2FBQWhCO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BCLENBQUM7OztPQUFBO0lBRU0sOEJBQVcsR0FBbEIsVUFBbUIsS0FBYTtRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxzQkFBVyw4QkFBUTthQUFuQjtZQUNDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUVNLGdDQUFhLEdBQXBCLFVBQXFCLEtBQWE7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU0sMEJBQU8sR0FBZCxVQUFlLEtBQWE7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU0sZ0NBQWEsR0FBcEIsVUFBcUIsS0FBYTtRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFTSw4Q0FBMkIsR0FBbEMsVUFBbUMsS0FBYTtRQUMvQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsS0FBSyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVNLDRCQUFTLEdBQWhCLFVBQWlCLE1BQWMsRUFBRSxJQUFxQjtRQUFyQixxQkFBQSxFQUFBLFlBQXFCO1FBQ3JELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxzQkFBVyw0QkFBTTthQUFqQjtZQUNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNyQixDQUFDOzs7T0FBQTtJQUVNLCtCQUFZLEdBQW5CLFVBQW9CLEtBQWE7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU0sOEJBQVcsR0FBbEIsVUFBbUIsS0FBYztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFTSw0QkFBUyxHQUFoQixVQUFpQixLQUFVLEVBQUUsUUFBb0I7UUFBcEIseUJBQUEsRUFBQSxlQUFvQjtRQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsc0JBQVcsNEJBQU07YUFBakI7WUFDQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFFTSw4QkFBVyxHQUFsQixVQUFtQixLQUFVO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM1QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxzQkFBVyw4QkFBUTthQUFuQjtZQUNDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUVNLDJCQUFRLEdBQWYsVUFBZ0IsUUFBa0IsRUFBRSxNQUFXO1FBQzlDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVNLDBCQUFPLEdBQWQsVUFBZSxRQUFrQixFQUFFLE1BQVc7UUFDN0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU0sNkJBQVUsR0FBakIsVUFBa0IsUUFBa0IsRUFBRSxNQUFXO1FBQ2hELElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO1FBQzVCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsc0JBQVcsZ0NBQVU7YUFBckI7WUFDQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDekIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw4QkFBUTthQUFuQjtZQUNDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDJCQUFLO2FBQWhCO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BCLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsZ0NBQVU7YUFBckI7WUFDQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDekIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxvQ0FBYzthQUF6QjtZQUNDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUM3QixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLCtCQUFTO2FBQXBCO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLGtDQUFZO2FBQXZCO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDOzs7T0FBQTtJQUVNLDRCQUFTLEdBQWhCLFVBQWlCLE1BQWU7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQ7O1FBRUk7SUFDRyx1QkFBSSxHQUFYLFVBQVksSUFBWTtRQUN2QixJQUFJLElBQUksQ0FBQyxPQUFPO1lBQ2YsT0FBTztRQUVSLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3BDLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQ2hCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Z0JBRWhDLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFTSx1QkFBSSxHQUFYLFVBQVksUUFBeUI7UUFBekIseUJBQUEsRUFBQSxnQkFBeUI7UUFDcEMsSUFBSSxJQUFJLENBQUMsT0FBTztZQUNmLE9BQU87UUFFUixJQUFJLFFBQVEsRUFBRTtZQUNiLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQ3JCLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDO29CQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztxQkFDL0MsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQzs7b0JBRXRFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2Q7WUFFRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztTQUM1QjtRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxzQkFBRyxHQUFWLFVBQVcsS0FBYSxFQUFFLEdBQVcsRUFBRSxRQUFnQjtRQUN0RCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVNLHVCQUFJLEdBQVgsVUFBWSxLQUFhLEVBQUUsTUFBYyxFQUFFLEdBQVcsRUFBRSxJQUFZLEVBQUUsUUFBZ0I7UUFDckYsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVNLHVCQUFJLEdBQVgsVUFBWSxLQUFhLEVBQUUsTUFBYyxFQUFFLE1BQWMsRUFDeEQsR0FBVyxFQUFFLElBQVksRUFBRSxJQUFZLEVBQUUsUUFBZ0I7UUFDekQsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU0sdUJBQUksR0FBWCxVQUFZLEtBQWEsRUFBRSxNQUFjLEVBQUUsTUFBYyxFQUFFLE1BQWMsRUFDeEUsR0FBVyxFQUFFLElBQVksRUFBRSxJQUFZLEVBQUUsSUFBWSxFQUFFLFFBQWdCO1FBQ3ZFLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU0sMkJBQVEsR0FBZixVQUFnQixLQUFhLEVBQUUsR0FBVyxFQUFFLFFBQWdCO1FBQzNELElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU0seUJBQU0sR0FBYixVQUFjLE1BQWMsRUFBRSxNQUFjLEVBQUUsU0FBaUIsRUFBRSxRQUFnQjtRQUNoRixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFTLENBQUMsTUFBTSxDQUFDO1FBQ2xDLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVNLHdCQUFLLEdBQVo7UUFDQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQVMsQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLHlCQUF5QixHQUFHLE9BQU8sQ0FBQztRQUN6QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRU0seUJBQU0sR0FBYjtRQUNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN6RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUM1RSxDQUFDO0lBRU0sMEJBQU8sR0FBZCxVQUFlLEVBQVU7UUFDeEIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUM7WUFDdkIsRUFBRSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNWLE9BQU87UUFFUixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLG1DQUFtQztTQUN6RDtZQUNDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE9BQU87U0FDUDtRQUVELElBQUksQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVkLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzthQUNwQjtTQUNEO0lBQ0YsQ0FBQztJQUVNLHlCQUFNLEdBQWIsVUFBYyxFQUFXO1FBQ3hCLElBQUcsRUFBRSxJQUFFLElBQUksRUFBQztZQUNYLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDO2dCQUN2QixFQUFFLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN2QixJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNWLE9BQU87WUFFUixJQUFJLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztTQUN4QjtRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksU0FBUyxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsRUFBRSxhQUFhO1NBQ3ZDO1lBQ0MsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUztnQkFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFFakIsT0FBTztTQUNQO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbkIsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNO2dCQUNsQyxPQUFPO1lBRVIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDckIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDekIsSUFBSSxJQUFJLENBQUMsT0FBTztnQkFDZixPQUFPO1NBQ1I7UUFFRCxJQUFJLFFBQVEsR0FBWSxLQUFLLENBQUM7UUFDOUIsSUFBSSxFQUFFLEdBQVcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2pELElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEQsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDaEI7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFO1lBQ3RCLElBQUksS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBQy9DLEVBQUUsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLEtBQUs7Z0JBQ2IsUUFBUSxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFO2dCQUNqRCxJQUFJLElBQUksQ0FBQyxLQUFLO29CQUNiLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xDLEVBQUUsR0FBRyxTQUFTLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7YUFDaEI7U0FDRDthQUNJLElBQUksRUFBRSxJQUFJLFNBQVMsRUFBRTtZQUN6QixFQUFFLEdBQUcsU0FBUyxDQUFDO1lBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDaEI7UUFFRCxJQUFJLENBQUMsZUFBZSxHQUFHLDJCQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFDdkcsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFM0IsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsRUFBRTtZQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsR0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ2hFLElBQUksRUFBRSxHQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLElBQUksRUFBRSxHQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM3QyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ3hDO2lCQUNJO2dCQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzthQUNuQztTQUNEO2FBQ0k7WUFDSixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDakQsSUFBSSxFQUFFLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLElBQUksRUFBRSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsR0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFDdEQsSUFBSSxJQUFJLENBQUMsU0FBUztvQkFDakIsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Q7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ25ELElBQUksSUFBSSxDQUFDLFNBQVMsWUFBWSxRQUFRLEVBQUU7Z0JBQ3ZDLFFBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDeEIsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakQsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoRSxNQUFNO29CQUNQLEtBQUssQ0FBQzt3QkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQy9FLE1BQU07b0JBQ1AsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUYsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNyRCxNQUFNO29CQUNQLEtBQUssQ0FBQzt3QkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2hFLE1BQU07aUJBQ1A7YUFDRDtpQkFDSSxJQUFJLElBQUksQ0FBQyxTQUFTLFlBQVksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDaEQsSUFBSSxHQUFHLEdBQUMsRUFBRSxDQUFDO2dCQUNYLFFBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDeEIsS0FBSyxDQUFDO3dCQUNMLEdBQUcsR0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEMsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsR0FBRyxHQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqRCxNQUFNO29CQUNQLEtBQUssQ0FBQzt3QkFDTCxHQUFHLEdBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2hFLE1BQU07b0JBQ1AsS0FBSyxDQUFDO3dCQUNMLEdBQUcsR0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0UsTUFBTTtvQkFDUCxLQUFLLENBQUM7d0JBQ0wsR0FBRyxHQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN0QyxNQUFNO29CQUNQLEtBQUssQ0FBQzt3QkFDTCxHQUFHLEdBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pELE1BQU07aUJBQ1A7Z0JBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDNUI7aUJBQ0k7Z0JBQ0osSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDOztvQkFFakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDOUM7U0FDRDtRQUVELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTyxvQ0FBaUIsR0FBekI7UUFDQyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO1lBQzFCLElBQUksZUFBTSxDQUFDLHVCQUF1QixFQUFFO2dCQUNuQyxJQUFJO29CQUNILElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzlDO2dCQUNELE9BQU8sR0FBRyxFQUFFO29CQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNsRTthQUNEOztnQkFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9DO0lBQ0YsQ0FBQztJQUVPLHFDQUFrQixHQUExQjtRQUNDLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFDM0IsSUFBSSxlQUFNLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ25DLElBQUk7b0JBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDaEQ7Z0JBQ0QsT0FBTyxHQUFHLEVBQUU7b0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3hFO2FBQ0Q7O2dCQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDakQ7SUFDRixDQUFDO0lBRU8sdUNBQW9CLEdBQTVCO1FBQ0MsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtZQUM3QixJQUFJLGVBQU0sQ0FBQyx1QkFBdUIsRUFBRTtnQkFDbkMsSUFBSTtvQkFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ3BEO2dCQUNELE9BQU8sR0FBRyxFQUFFO29CQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNyRTthQUNEOztnQkFFQSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckQ7SUFDRixDQUFDO0lBQ0YsZUFBQztBQUFELENBeGdCQSxBQXdnQkMsSUFBQTtBQXhnQlksNEJBQVE7Ozs7QUNMckIsc0JBQXNCO0FBQ3RCO0lBQUE7SUFZQSxDQUFDO0lBSkQsRUFBRTtJQUNZLHFCQUFRLEdBQXRCLFVBQXVCLElBQUk7UUFDdkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQVZhLGdDQUFtQixHQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25FLG1CQUFNLEdBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pDLHlCQUFZLEdBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkUsRUFBRTtJQUNZLGdDQUFtQixHQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xHLE1BQU07SUFDUSxxQkFBUSxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFLckMsbUJBQUM7Q0FaRCxBQVlDLElBQUE7a0JBWm9CLFlBQVk7Ozs7QUNBakM7SUFBQTtJQUVBLENBQUM7SUFEaUIsdUJBQVEsR0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxjQUFjLEVBQUMsQ0FBQyxXQUFXLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxjQUFjLEVBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLHFCQUFxQixFQUFDLGNBQWMsRUFBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQy9MLHFCQUFDO0NBRkQsQUFFQyxJQUFBO2tCQUZvQixjQUFjOzs7O0FDRG5DLG9CQUFvQjtBQUNwQiw2REFBNEQ7QUFDNUQsbURBQThDO0FBQzlDLCtDQUEwQztBQUMxQztJQUF5QywrQkFBVztJQUFwRDs7SUF1Q0EsQ0FBQztJQXRDVSw2QkFBTyxHQUFkO1FBQ0ksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHdCQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyRCxJQUFNLEtBQUssR0FBRyx3QkFBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JCO0lBQ0wsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTSxTQUFTO1FBQ1gsSUFBRyxTQUFTLElBQUUsSUFBSTtZQUFDLE9BQU87UUFDMUIsSUFBSSxJQUFJLEdBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNCLElBQUksRUFBRSxHQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksWUFBWSxHQUFRLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNsRCxJQUFHLENBQUMsWUFBWSxJQUFJLENBQUMsRUFBRTtZQUFDLE9BQU87UUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUMsSUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksTUFBTSxHQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQyxTQUFTLENBQUMsQ0FBQztZQUMzRCxJQUFHLE1BQU0sSUFBRSxJQUFJLEVBQUM7Z0JBQ1osTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMzQjtTQUNKO0lBQ0wsQ0FBQztJQUNhLHVCQUFXLEdBQXpCLFVBQTBCLE1BQU0sRUFBQyxHQUFVO1FBQ3ZDLElBQUksTUFBTSxHQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ00seUJBQWEsR0FBcEIsVUFBcUIsTUFBTSxFQUFDLE1BQW9CLEVBQUMsRUFBSTtRQUFKLG1CQUFBLEVBQUEsTUFBSTtRQUNqRCxJQUFJLE9BQU8sR0FBZSxNQUFNLENBQUM7UUFDakMsSUFBRyxPQUFPLElBQUUsSUFBSTtZQUFDLE9BQU8sSUFBSSxDQUFDO1FBQzdCLElBQUksRUFBRSxHQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQixJQUFJLFNBQVMsR0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLElBQUcsU0FBUyxJQUFFLElBQUk7WUFBQyxPQUFPLElBQUksQ0FBQztRQUMvQixJQUFHLEVBQUUsSUFBRSxNQUFNLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBQztZQUNuQixPQUFPLFNBQVMsQ0FBQztTQUNwQjthQUNHO1lBQ0EsU0FBUyxHQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0F2Q0EsQUF1Q0MsQ0F2Q3dDLHlCQUFXLEdBdUNuRDs7Ozs7QUMzQ0QsMEJBQTBCO0FBQzFCLFdBQVc7QUFDWCxnREFBMkM7QUFDM0MsZ0VBQStEO0FBQy9EO0lBQWlELHVDQUFXO0lBQTVEOztJQW9CQSxDQUFDO0lBaEJNLHFDQUFPLEdBQWQ7UUFDQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7UUFDakcsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7U0FDaEc7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFFMUUsQ0FBQztJQUNELFFBQVE7SUFDRixrQ0FBSSxHQUFYO1FBQ0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFeEIsQ0FBQztJQUNGLDBCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsQ0FwQmdELHlCQUFXLEdBb0IzRDs7Ozs7QUN4QkQsMEJBQTBCO0FBQzFCLFFBQVE7QUFDUixnREFBMkM7QUFDM0MsZ0VBQStEO0FBQy9EO0lBQTBDLGdDQUFXO0lBQXJEOztJQXFCQSxDQUFDO0lBbkJNLDhCQUFPLEdBQWQ7UUFDQyxJQUFJLElBQUksR0FBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEIsdUJBQXVCO0lBRXZCLENBQUM7SUFDRCxRQUFRO0lBQ0YsMkJBQUksR0FBWDtRQUNDLElBQUksR0FBRyxHQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRCxJQUFJLElBQUksR0FBTSxHQUFHLENBQUMsWUFBWSxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVsQixDQUFDO0lBQ0ssNEJBQUssR0FBWjtRQUNDLElBQUksSUFBSSxHQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2xFLElBQUksT0FBTyxHQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsc0JBQVksQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVmLENBQUM7SUFDRixtQkFBQztBQUFELENBckJBLEFBcUJDLENBckJ5Qyx5QkFBVyxHQXFCcEQ7Ozs7O0FDdEJELGdFQUErRDtBQUMvRDtJQUFvQywwQkFBVztJQUEvQzs7SUFTQSxDQUFDO0lBUE0sd0JBQU8sR0FBZDtJQUVDLENBQUM7SUFDRCxRQUFRO0lBQ0YscUJBQUksR0FBWDtJQUVDLENBQUM7SUFDRixhQUFDO0FBQUQsQ0FUQSxBQVNDLENBVG1DLHlCQUFXLEdBUzlDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi9fd215VXRpbHNINS9kMy9XbXlVdGlsczNEXCI7XHJcbmltcG9ydCB7IFdteV9Mb2FkX01hZyB9IGZyb20gXCIuL193bXlVdGlsc0g1L1dteV9Mb2FkX01hZ1wiO1xyXG5pbXBvcnQgeyBXVHdlZW5NYW5hZ2VyIH0gZnJvbSBcIi4vX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuTWFuYWdlclwiO1xyXG5pbXBvcnQgeyBXbXlVdGlscyB9IGZyb20gXCIuL193bXlVdGlsc0g1L1dteVV0aWxzXCI7XHJcbmltcG9ydCBXbXlVM2RUc01hZyBmcm9tIFwiLi93bXlVM2RUcy9XbXlVM2RUc01hZ1wiO1xyXG5leHBvcnQgY2xhc3MgTWFpbiB7XHJcblx0cHVibGljIHN0YXRpYyBfdGhpczogTWFpbjtcclxuXHRwdWJsaWMgX3Jvb3RXPTY0MDtcclxuXHRwdWJsaWMgX3Jvb3RIPTExMzY7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRNYWluLl90aGlzPXRoaXM7XHJcblx0XHRMYXlhM0QuaW5pdCh0aGlzLl9yb290VywgdGhpcy5fcm9vdEgpO1xyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblxyXG5cdFx0dmFyIGlzUGM9V215VXRpbHMuZ2V0VGhpcy5pc1BjKCk7XHJcblx0XHRpZihpc1BjKXtcclxuXHRcdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBMYXlhLlN0YWdlLlNDQUxFX1NIT1dBTEw7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IExheWEuU3RhZ2UuU0NBTEVfRlVMTDtcclxuXHRcdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gTGF5YS5TdGFnZS5TQ1JFRU5fVkVSVElDQUw7XHJcblx0XHR9XHJcblx0XHQvL+iuvue9ruawtOW5s+Wvuem9kFxyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25IID0gXCJjZW50ZXJcIjtcclxuXHRcdC8v6K6+572u5Z6C55u05a+56b2QXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnblYgPSBcIm1pZGRsZVwiO1xyXG5cclxuXHRcdExheWEuU3RhdC5zaG93KCk7XHJcblxyXG5cdFx0TGF5YS5TaGFkZXIzRC5kZWJ1Z01vZGU9dHJ1ZTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0dmFyIHdteVZUaW1lPVwiXCI7XHJcblx0XHRpZih3aW5kb3chPW51bGwgJiYgd2luZG93W1wid215VlRpbWVcIl0hPW51bGwpe1xyXG5cdFx0XHR3bXlWVGltZT13aW5kb3dbXCJ3bXlWVGltZVwiXTtcclxuXHRcdH1cclxuXHRcdExheWEuUmVzb3VyY2VWZXJzaW9uLmVuYWJsZShcInZlcnNpb24uanNvblwiK3dteVZUaW1lLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25WZXJzaW9uTG9hZGVkKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XHJcblx0fVxyXG5cclxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0XHRMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5SRVNJWkUpO1xyXG5cdFx0V215X0xvYWRfTWFnLmdldFRoaXMub25Mb2FkV2V0RGF0YShcInJlcy9sb2FkSW5mby5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG5cdFx0XHRXbXlfTG9hZF9NYWcuZ2V0VGhpcy5vbmxvYWRTdHIoXCJsb2FkXCIsIG5ldyBMYXlhLkhhbmRsZXIodGhpcywgdGhpcy5vbkxvYWRNYWluKSk7XHJcblx0XHR9KSk7XHJcblx0fVxyXG5cdFxyXG5cdFJFU0laRSgpIHtcclxuXHRcdHZhciBzdz1MYXlhLnN0YWdlLndpZHRoL3RoaXMuX3Jvb3RXO1xyXG5cdFx0dmFyIHNoPUxheWEuc3RhZ2UuaGVpZ2h0L3RoaXMuX3Jvb3RIO1xyXG5cdFx0aWYgKHRoaXMuX3VpU2NlbmUgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl91aVNjZW5lLnNjYWxlWD1zdztcclxuXHRcdFx0dGhpcy5fdWlTY2VuZS5zY2FsZVk9c3c7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5fdWlTY2VuZSAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX3VpUm9vdC53aWR0aCA9IExheWEuc3RhZ2Uud2lkdGgvc3c7XHJcblx0XHRcdHRoaXMuX3VpUm9vdC5oZWlnaHQgPSBMYXlhLnN0YWdlLmhlaWdodC9zdztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fTG9hZFJvb3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl9Mb2FkUm9vdC53aWR0aCA9IHRoaXMuX3VpUm9vdC53aWR0aDtcclxuXHRcdFx0dGhpcy5fTG9hZFJvb3QuaGVpZ2h0ID0gdGhpcy5fdWlSb290LmhlaWdodDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBpZiAodGhpcy5fbWFpblZpZXcgIT0gbnVsbCkge1xyXG5cdFx0Ly8gXHR0aGlzLl9tYWluVmlldy53aWR0aCA9IHRoaXMuX3VpUm9vdC53aWR0aDtcclxuXHRcdC8vIFx0dGhpcy5fbWFpblZpZXcuaGVpZ2h0ID0gdGhpcy5fdWlSb290LmhlaWdodDtcclxuXHRcdC8vIH1cclxuXHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91aVNjZW5lOiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX3VpUm9vdDogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHJcblx0cHJpdmF0ZSBfTG9hZFJvb3Q6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfTG9hZEJveDogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHRwcml2YXRlIF9iYXI6IGZhaXJ5Z3VpLkdQcm9ncmVzc0JhcjtcclxuXHRwcml2YXRlIG9uTG9hZE1haW4oKSB7XHJcblx0XHRMYXlhLnN0YWdlLmFkZENoaWxkKGZhaXJ5Z3VpLkdSb290Lmluc3QuZGlzcGxheU9iamVjdCk7XHJcblx0XHR0aGlzLl91aVNjZW5lPW5ldyBmYWlyeWd1aS5HQ29tcG9uZW50KCk7XHJcblx0XHRmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKHRoaXMuX3VpU2NlbmUpO1xyXG5cdFx0dGhpcy5fdWlSb290PW5ldyBmYWlyeWd1aS5HQ29tcG9uZW50KCk7XHJcblx0XHR0aGlzLl91aVNjZW5lLmFkZENoaWxkKHRoaXMuX3VpUm9vdCk7XHJcblxyXG5cdFx0dGhpcy5fTG9hZFJvb3QgPSBmYWlyeWd1aS5VSVBhY2thZ2UuY3JlYXRlT2JqZWN0KFwibG9hZFwiLCBcIkxvYWRSb290XCIpLmFzQ29tO1xyXG5cdFx0dGhpcy5fdWlSb290LmFkZENoaWxkKHRoaXMuX0xvYWRSb290KTtcclxuXHRcdHRoaXMuX0xvYWRCb3ggPSB0aGlzLl9Mb2FkUm9vdC5nZXRDaGlsZChcIl9Mb2FkQm94XCIpLmFzQ29tO1xyXG5cclxuXHRcdHRoaXMuX2JhciA9IHRoaXMuX0xvYWRCb3guZ2V0Q2hpbGQoXCJiYXJcIikuYXNQcm9ncmVzcztcclxuXHJcblx0XHRXbXlfTG9hZF9NYWcuZ2V0VGhpcy5vbkF1dG9Mb2FkQWxsKG5ldyBMYXlhLkhhbmRsZXIodGhpcywgdGhpcy5vbkxvYWRPayksIG5ldyBMYXlhLkhhbmRsZXIodGhpcywgdGhpcy5vbkxvYWRpbmcpKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25Mb2FkaW5nKHByb2dyZXNzOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHZhciB0d2VlbiA9IFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKTtcclxuXHRcdHR3ZWVuLnNldFRhcmdldCh0aGlzLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMuX29uTG9hZGluZywgbnVsbCwgZmFsc2UpKTtcclxuXHRcdGlmKHRoaXMuX2Jhcil7XHJcblx0XHRcdHR3ZWVuLl90byh0aGlzLl9iYXIudmFsdWUsIHByb2dyZXNzLCAwLjI1KTtcclxuXHRcdH1cclxuXHR9XHJcblx0cHJpdmF0ZSBfb25Mb2FkaW5nKHRhcmdldCwgcCkge1xyXG5cdFx0aWYodGhpcy5fYmFyKXtcclxuXHRcdFx0dGhpcy5fYmFyLnZhbHVlID0gcDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3NjZW5lM0Q6TGF5YS5TY2VuZTNEO1xyXG5cdHByaXZhdGUgb25Mb2FkT2sodWlBcnIsIHUzZEFycikge1xyXG5cdFx0Ly/mt7vliqAzRFxyXG4gICAgICAgIHZhciB1cmwzZD11M2RBcnJbMF0udXJsTGlzdFswXTtcclxuICAgICAgICB0aGlzLl9zY2VuZTNEID1MYXlhLmxvYWRlci5nZXRSZXModXJsM2QpO1xyXG5cdFx0dGhpcy5fc2NlbmUzRC5hZGRDb21wb25lbnQoV215VTNkVHNNYWcpO1xyXG5cclxuXHRcdFdUd2Vlbk1hbmFnZXIua2lsbFR3ZWVucyh0aGlzKTtcclxuXHRcdHZhciB0d2VlbiA9IFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKTtcclxuXHRcdHR3ZWVuLnNldFRhcmdldCh0aGlzLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMuX29uTG9hZGluZywgbnVsbCwgZmFsc2UpKVxyXG5cdFx0Ll90byh0aGlzLl9iYXIudmFsdWUsIDEwMCwgMSlcclxuXHRcdC5vbkNvbXBsZXRlKHRoaXMub25NYWluLCB0aGlzKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX21haW5WaWV3OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdFxyXG5cdHByaXZhdGUgb25NYWluKCl7XHJcblx0XHR0aGlzLl9tYWluVmlldyA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJtYWluXCIsIFwiTWFpblwiKS5hc0NvbTtcclxuXHRcdGlmICh0aGlzLl9tYWluVmlldyAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX3VpUm9vdC5hZGRDaGlsZEF0KHRoaXMuX21haW5WaWV3LCAwKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgX01haW49dGhpcy5fbWFpblZpZXcuZ2V0Q2hpbGQoXCJfTWFpblwiKS5hc0NvbTtcclxuXHRcdHZhciBkM0JveD1fTWFpbi5nZXRDaGlsZChcImQzQm94XCIpO1xyXG5cdFx0ZDNCb3guZGlzcGxheU9iamVjdC5hZGRDaGlsZCh0aGlzLl9zY2VuZTNEKTtcclxuXHJcblx0XHRXVHdlZW5NYW5hZ2VyLmtpbGxUd2VlbnModGhpcyk7XHJcblx0XHR0aGlzLl91aVJvb3QucmVtb3ZlQ2hpbGQodGhpcy5fTG9hZFJvb3QpO1xyXG5cdFx0dGhpcy5fTG9hZFJvb3QgPSBudWxsO1xyXG5cdFx0dGhpcy5fYmFyID0gbnVsbDtcclxuXHJcblx0XHQvLyAvL+WKoOi9vTNE5Zy65pmvXHJcblx0XHQvLyBMYXlhLlNjZW5lM0QubG9hZCgncmVzL3UzZC9tYWluL0NvbnZlbnRpb25hbC8xLmxzJywgTGF5YS5IYW5kbGVyLmNyZWF0ZShudWxsLCBmdW5jdGlvbihzY2VuZSl7XHJcblx0XHQvLyBcdC8v6Ieq5Yqo57uR5a6aVTNE6ISa5pysXHJcblx0XHQvLyBcdHNjZW5lLmFkZENvbXBvbmVudChXbXlVM2RUc01hZyk7XHJcblx0XHQvLyBcdC8v5Zy65pmv5re75Yqg5Yiw6Iie5Y+wXHJcblx0XHQvLyBcdExheWEuc3RhZ2UuYWRkQ2hpbGQoc2NlbmUpO1xyXG5cclxuXHRcdC8vIFx0Ly8gdmFyIHdteVZldGV4X2Z6MDE9V215VXRpbHMzRC5nZXRPYmozZFVybChzY2VuZSxcIjEvMi8zL3dteVZldGV4X2Z6MDFAMVwiKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG5cdFx0Ly8gXHQvLyB3bXlWZXRleF9mejAxLmV2ZW50KFwiYW5pX3BsYXlcIik7XHJcblxyXG5cdFx0Ly8gXHQvLyBMYXlhLnRpbWVyLm9uY2UoMTAwMCx0aGlzLCgpPT57XHJcblx0XHQvLyBcdC8vIFx0d215VmV0ZXhfZnowMS5ldmVudChcImFuaV9wbGF5XCIpO1xyXG5cdFx0Ly8gXHQvLyB9KVxyXG5cclxuXHRcdC8vIH0pKTtcclxuXHR9XHJcblx0XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiXHJcbmV4cG9ydCBjbGFzcyBXbXlVdGlscyBleHRlbmRzIGxheWEuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpczpXbXlVdGlscztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlVdGlsc3tcclxuICAgICAgICBpZihXbXlVdGlscy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteVV0aWxzLl90aGlzPW5ldyBXbXlVdGlscygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5fdGhpcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLl9fbG9vcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9ET1dOLHRoaXMsIHRoaXMuX19vblRvdWNoRG93bik7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9VUCx0aGlzLCB0aGlzLl9fb25Ub3VjaFVwKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLl9fT25Nb3VzZU1PVkUpO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5SRVNJWkUsdGhpcyx0aGlzLl9fb25SZXNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBDT0xPUl9GSUxURVJTX01BVFJJWDogQXJyYXk8YW55Pj1bXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9SXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9HXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9CXHJcbiAgICAgICAgMCwgMCwgMCwgMSwgMCwgLy9BXHJcbiAgICBdO1xyXG4gICAgLy/ovazmjaLpopzoibJcclxuICAgIHB1YmxpYyBjb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpOkFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFswXT1yO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzZdPWc7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMTJdPWI7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMThdPWF8fDE7XHJcbiAgICAgICAgcmV0dXJuIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYO1xyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVycyh0YXJnZXQ6TGF5YS5TcHJpdGUsY29sb3I6bnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJzPW51bGw7XHJcbiAgICAgICAgaWYoY29sb3IgIT0gMHhmZmZmZmYpe1xyXG4gICAgICAgICAgICB0YXJnZXQuZmlsdGVycz1bbmV3IExheWEuQ29sb3JGaWx0ZXIodGhpcy5jb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjE2KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjgpICYgMHhmZikvMjU1LFxyXG4gICAgICAgICAgICAgICAgKGNvbG9yICYgMHhmZikvMjU1XHJcbiAgICAgICAgICAgICAgICApKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVyczEodGFyZ2V0OkxheWEuU3ByaXRlLHI6bnVtYmVyLGc6bnVtYmVyLGI6bnVtYmVyLGE/Om51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKHIgPCAxIHx8IGcgPCAxIHx8IGIgPCAxIHx8IGEgPCAxKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocixnLGIsYSkpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/liKTmlq3miYvmnLrmiJZQQ1xyXG4gICAgcHVibGljIGlzUGMoKTpib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGlzUGM6Ym9vbGVhbj1mYWxzZTtcclxuICAgICAgICBpZih0aGlzLnZlcnNpb25zKCkuYW5kcm9pZCB8fCB0aGlzLnZlcnNpb25zKCkuaVBob25lIHx8IHRoaXMudmVyc2lvbnMoKS5pb3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpc1BjPWZhbHNlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMudmVyc2lvbnMoKS5pUGFkKXtcclxuICAgICAgICAgICAgaXNQYz10cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNQYztcclxuICAgIH1cclxuICAgIHB1YmxpYyB2ZXJzaW9ucygpe1xyXG4gICAgICAgIHZhciB1OnN0cmluZyA9IG5hdmlnYXRvci51c2VyQWdlbnQsIGFwcDpzdHJpbmcgPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAvL+enu+WKqOe7iOerr+a1j+iniOWZqOeJiOacrOS/oeaBr1xyXG4gICAgICAgICAgICB0cmlkZW50OiB1LmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xLCAvL0lF5YaF5qC4XHJcbiAgICAgICAgICAgIHByZXN0bzogdS5pbmRleE9mKCdQcmVzdG8nKSA+IC0xLCAvL29wZXJh5YaF5qC4XHJcbiAgICAgICAgICAgIHdlYktpdDogdS5pbmRleE9mKCdBcHBsZVdlYktpdCcpID4gLTEsIC8v6Iu55p6c44CB6LC35q2M5YaF5qC4XHJcbiAgICAgICAgICAgIGdlY2tvOiB1LmluZGV4T2YoJ0dlY2tvJykgPiAtMSAmJiB1LmluZGV4T2YoJ0tIVE1MJykgPT0gLTEsIC8v54Gr54uQ5YaF5qC4XHJcbiAgICAgICAgICAgIG1vYmlsZTogISF1Lm1hdGNoKC9BcHBsZVdlYktpdC4qTW9iaWxlLiovKXx8ISF1Lm1hdGNoKC9BcHBsZVdlYktpdC8pLCAvL+aYr+WQpuS4uuenu+WKqOe7iOerr1xyXG4gICAgICAgICAgICBpb3M6ICEhdS5tYXRjaCgvXFwoaVteO10rOyggVTspPyBDUFUuK01hYyBPUyBYLyksIC8vaW9z57uI56uvXHJcbiAgICAgICAgICAgIGFuZHJvaWQ6IHUuaW5kZXhPZignQW5kcm9pZCcpID4gLTEgfHwgdS5pbmRleE9mKCdMaW51eCcpID4gLTEsIC8vYW5kcm9pZOe7iOerr+aIluiAhXVj5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQaG9uZTogdS5pbmRleE9mKCdpUGhvbmUnKSA+IC0xIHx8IHUuaW5kZXhPZignTWFjJykgPiAtMSwgLy/mmK/lkKbkuLppUGhvbmXmiJbogIVRUUhE5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQYWQ6IHUuaW5kZXhPZignaVBhZCcpID4gLTEsIC8v5piv5ZCmaVBhZFxyXG4gICAgICAgICAgICB3ZWJBcHA6IHUuaW5kZXhPZignU2FmYXJpJykgPT0gLTEgLy/mmK/lkKZ3ZWLlupTor6XnqIvluo/vvIzmsqHmnInlpLTpg6jkuI7lupXpg6hcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRVcmxWKGtleTpzdHJpbmcpe1xyXG4gICAgICAgIHZhciByZWc9IG5ldyBSZWdFeHAoXCIoXnwmKVwiK2tleStcIj0oW14mXSopKCZ8JClcIik7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLm1hdGNoKHJlZyk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdD9kZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzJdKTpudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk5hdmlnYXRlKHVybDpzdHJpbmcsaXNSZXBsYWNlOmJvb2xlYW49ZmFsc2Upe1xyXG4gICAgICAgIGlmKGlzUmVwbGFjZSl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHVybCk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9dXJsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ldmVudExpc3Q6QXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+PW5ldyBBcnJheTxsYXlhLmV2ZW50cy5FdmVudD4oKTtcclxuICAgIHByaXZhdGUgX19vblRvdWNoRG93bihldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KTwwKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnB1c2goZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaFVwKGV2dDogbGF5YS5ldmVudHMuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpPj0wKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnNwbGljZSh0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25SZXNpemUoKXtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3QuZm9yRWFjaChldnQgPT4ge1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuXHRcdH0pO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdD1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX19Pbk1vdXNlTU9WRShldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGJOdW09MTA7XHJcbiAgICAgICAgaWYoZXZ0LnN0YWdlWCA8PSBiTnVtIHx8IGV2dC5zdGFnZVggPj0gTGF5YS5zdGFnZS53aWR0aC1iTnVtIHx8XHJcbiAgICAgICAgICAgIGV2dC5zdGFnZVkgPD0gYk51bSB8fCBldnQuc3RhZ2VZID49IExheWEuc3RhZ2UuaGVpZ2h0LWJOdW0pe1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTnVtVG8obixsPTIpe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQobCkpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJfWFkoZCwgcilcclxuICAgIHtcclxuICAgIFx0dmFyIHJhZGlhbiA9IChyICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBcdHZhciBjb3MgPSAgTWF0aC5jb3MocmFkaWFuKTtcclxuICAgIFx0dmFyIHNpbiA9ICBNYXRoLnNpbihyYWRpYW4pO1xyXG4gICAgXHRcclxuICAgIFx0dmFyIGR4PWQgKiBjb3M7XHJcbiAgICBcdHZhciBkeT1kICogc2luO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IExheWEuUG9pbnQoZHggLCBkeSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nMmJ1ZmZlcihzdHIpOkFycmF5QnVmZmVyIHtcclxuICAgICAgICAvLyDpppblhYjlsIblrZfnrKbkuLLovazkuLoxNui/m+WItlxyXG4gICAgICAgIGxldCB2YWwgPSBcIlwiXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodmFsID09PSAnJykge1xyXG4gICAgICAgICAgICB2YWwgPSBzdHIuY2hhckNvZGVBdChpKS50b1N0cmluZygxNilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWwgKz0gJywnICsgc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDlsIYxNui/m+WItui9rOWMluS4ukFycmF5QnVmZmVyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHZhbC5tYXRjaCgvW1xcZGEtZl17Mn0vZ2kpLm1hcChmdW5jdGlvbiAoaCkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludChoLCAxNilcclxuICAgICAgICB9KSkuYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVwbGFjZUFsbChzdHIsIG9sZFN0ciwgbmV3U3RyKXsgIFxyXG4gICAgICAgIHZhciB0ZW1wID0gJyc7ICBcclxuICAgICAgICB0ZW1wID0gc3RyLnJlcGxhY2Uob2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIGlmKHRlbXAuaW5kZXhPZihvbGRTdHIpPj0wKXtcclxuICAgICAgICAgICAgdGVtcCA9IHRoaXMucmVwbGFjZUFsbCh0ZW1wLCBvbGRTdHIsIG5ld1N0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9ICBcclxuXHJcbiAgICAvL+Wkp+Wwj+WGmei9rOaNolxyXG4gICAgcHVibGljIHN0YXRpYyB0b0Nhc2Uoc3RyOnN0cmluZywgaXNEeD1mYWxzZSl7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnO1xyXG4gICAgICAgIGlmKCFpc0R4KXtcclxuICAgICAgICAgICAgLy/ovazmjaLkuLrlsI/lhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgLy/ovazljJbkuLrlpKflhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7ICBcclxuICAgIH0gXHJcblxyXG4gICAgXHJcbiAgICAvL+i3neemu1xyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0RGlzdGFuY2UoYTpMYXlhLlBvaW50LGI6TGF5YS5Qb2ludCk6bnVtYmVyIHtcclxuXHRcdHZhciBkeCA9IE1hdGguYWJzKGEueCAtIGIueCk7XHJcblx0XHR2YXIgZHkgPSBNYXRoLmFicyhhLnkgLSBiLnkpO1xyXG5cdFx0dmFyIGQ9TWF0aC5zcXJ0KE1hdGgucG93KGR4LCAyKSArIE1hdGgucG93KGR5LCAyKSk7XHJcblx0XHRkPXBhcnNlRmxvYXQoZC50b0ZpeGVkKDIpKTtcclxuXHRcdHJldHVybiBkO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFh5VG9SKHkseCk6bnVtYmVye1xyXG4gICAgICAgIHZhciByYWRpYW49TWF0aC5hdGFuMih5LHgpO1xyXG4gICAgICAgIHZhciByPSgxODAvTWF0aC5QSSpyYWRpYW4pO1xyXG4gICAgICAgIHI9dGhpcy5vbk51bVRvKHIpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc3RvcmFnZShrZXksIHZhbHVlOmFueT1cIj9cIiwgaXNMb2NhbD10cnVlKTphbnl7XHJcbiAgICAgICAgdmFyIHN0b3JhZ2U6YW55PWlzTG9jYWw/bG9jYWxTdG9yYWdlOnNlc3Npb25TdG9yYWdlO1xyXG4gICAgICAgIGlmKHZhbHVlPT1cIj9cIil7XHJcblx0XHRcdHZhciBkYXRhID0gc3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZih2YWx1ZT09bnVsbCl7XHJcblx0XHRcdHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0c3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheUZ1aVNvdW5kKF91cmwsdm9sdW1lPTAuMixjb21wbGV0ZUhhbmRsZXI/LHN0YXJ0VGltZT0wLGxvb3BzPTEpe1xyXG4gICAgICAgIGlmKHZvbHVtZTw9MClyZXR1cm47XHJcbiAgICAgICAgdmFyIGl0ZW09ZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1CeVVSTChfdXJsKTtcclxuICAgICAgICB2YXIgdXJsPWl0ZW0uZmlsZTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQodXJsLGxvb3BzLGNvbXBsZXRlSGFuZGxlcixudWxsLHN0YXJ0VGltZSk7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIuc2V0U291bmRWb2x1bWUodm9sdW1lLHVybCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXbXlVdGlscyB9IGZyb20gXCIuL1dteVV0aWxzXCI7XHJcbmltcG9ydCB7IFdteUxvYWQzZCB9IGZyb20gXCIuL2QzL1dteUxvYWQzZFwiO1xyXG5pbXBvcnQgeyBXbXlMb2FkTWF0cyB9IGZyb20gXCIuL2QzL1dteUxvYWRNYXRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215X0xvYWRfTWFnXHJcbntcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteV9Mb2FkX01hZ3tcclxuICAgICAgICBpZihXbXlfTG9hZF9NYWcuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlfTG9hZF9NYWcuX3RoaXM9bmV3IFdteV9Mb2FkX01hZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215X0xvYWRfTWFnLl90aGlzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfd2V0RGF0YTphbnk9e307XHJcblxyXG4gICAgcHVibGljIHJlc1VybDpzdHJpbmc9XCJcIjtcclxuICAgIHB1YmxpYyBnZXRXZXREYXRhKHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93ZXREYXRhW3VybF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXRXZXREYXRhKG9iajphbnksdXJsPzpzdHJpbmcpe1xyXG4gICAgICAgIGlmKHRoaXMucmVzVXJsPT1cIlwiKXtcclxuICAgICAgICAgICAgdGhpcy5yZXNVcmw9dXJsO1xyXG4gICAgICAgICAgICB2YXIgYXJyPW51bGw7XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGFycj1KU09OLnBhcnNlKG9iaik7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih1cmw9PW51bGwpe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5yZXNVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3dldERhdGFbdXJsXT1vYmo7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRSZXNPYmoocmVzTmFtZTpzdHJpbmcsdXJsPyl7XHJcbiAgICAgICAgdmFyIHdlYkRhdGE6YW55O1xyXG4gICAgICAgIGlmKHVybD09bnVsbCl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLnJlc1VybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2ViRGF0YT10aGlzLmdldFdldERhdGEodXJsKTtcclxuICAgICAgICBpZih3ZWJEYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi56m65pWw5o2uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFycjpBcnJheTxhbnk+PW51bGw7XHJcbiAgICAgICAgaWYod2ViRGF0YSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgYXJyPXdlYkRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbCl7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZSh3ZWJEYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHdlYkRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc09iaj1udWxsO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPWFycltpXTtcclxuICAgICAgICAgICAgaWYob2JqW1wicmVzTmFtZVwiXT09cmVzTmFtZSl7XHJcbiAgICAgICAgICAgICAgICByZXNPYmo9b2JqO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc09iajtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkV2V0RGF0YSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICBpZih1cmw9PVwiXCIpcmV0dXJuO1xyXG4gICAgICAgIGlmKHRoaXMuZ2V0V2V0RGF0YSh1cmwpIT1udWxsKXtcclxuICAgICAgICAgICAgY2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLmdldFdldERhdGEodXJsKV0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsb2FkPUxheWEubG9hZGVyLmxvYWQodXJsLG5ldyBMYXlhLkhhbmRsZXIodGhpcyxmdW5jdGlvbihvYmope1xyXG4gICAgICAgICAgICB0aGlzLnNldFdldERhdGEob2JqLHVybCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5fd2V0RGF0YVt1cmxdXSk7XHJcbiAgICAgICAgfSkpXHJcbiAgICAgICAgcmV0dXJuIGxvYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9ubG9hZFN0cihzdHI6c3RyaW5nLGNhbGxiYWNrT2s/OkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNPYmo9dGhpcy5nZXRSZXNPYmooc3RyKTtcclxuICAgICAgICBpZihyZXNPYmohPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLm9ubG9hZChyZXNPYmosY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwib25sb2FkU3RyLeWHuumUmTpcIixzdHIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZXNEYXRhQXJyOkFycmF5PGFueT49W107XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja09rOkFycmF5PGFueT49W107XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkFycmF5PGFueT49W107XHJcbiAgICBwdWJsaWMgb25sb2FkKHJlc09iajphbnksY2FsbGJhY2tPaz86TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc05hbWU9cmVzT2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICBpZih0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXS5ydW5XaXRoKFt0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNPYmpbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciBkYXRhOmFueT17fTtcclxuICAgICAgICAgICAgdmFyIHJlc0RhdGE6c3RyaW5nPXJlc09ialtcInJlc0RhdGFcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc0RhdGEhPW51bGwgJiYgcmVzRGF0YSE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9SlNPTi5wYXJzZShyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIscmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lVXJsO1xyXG4gICAgICAgICAgICB2YXIgdXJsQXJyOkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHZhciBpc0NyZWF0ZT1mYWxzZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNVcmw9V215VXRpbHMudG9DYXNlKHJlc1VybCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIGlmKHVybC5pbmRleE9mKFwiLnR4dFwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5CVUZGRVJ9KTtcclxuICAgICAgICAgICAgICAgICAgICBiTmFtZVVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHVybC5pbmRleE9mKFwiLmpwZ1wiKT49MCB8fCB1cmwuaW5kZXhPZihcIi5wbmdcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuSU1BR0V9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodXJsLmluZGV4T2YoXCIubXAzXCIpPj0wIHx8IHVybC5pbmRleE9mKFwiLndhdlwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5TT1VORH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybEFyci5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybEFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkFzc2V0Q29ubXBsZXRlLFtyZXNOYW1lLGJOYW1lVXJsLGRhdGFdKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Bc3NldFByb2dyZXNzLCBbcmVzTmFtZV0sIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIG9uQ2xlYXIzZFJlcyh1cmwpe1xyXG4gICAgICAgIExheWEuUmVzb3VyY2UuZGVzdHJveVVudXNlZFJlc291cmNlcygpO1xyXG4gICAgICAgIFdteUxvYWQzZC5nZXRUaGlzLmNsZWFyUmVzKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZDNkT25lKHVybDpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICBXbXlMb2FkM2Qub25Mb2FkM2RPbmUodXJsLGNhbGxiYWNrT2ssY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9ubG9hZDNkKHJlc09iajphbnksY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgcmVzTmFtZT1yZXNPYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgIGlmKHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdLnJ1bldpdGgoW3RoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc09ialtcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6YW55PXt9O1xyXG4gICAgICAgICAgICB2YXIgcmVzRGF0YTpzdHJpbmc9cmVzT2JqW1wicmVzRGF0YVwiXTtcclxuICAgICAgICAgICAgaWYocmVzRGF0YSE9bnVsbCAmJiByZXNEYXRhIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YT1KU09OLnBhcnNlKHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIixyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWU7XHJcbiAgICAgICAgICAgIHZhciB1cmxBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdmFyIHVybExpc3Q6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybC5pbmRleE9mKFwiLmxzXCIpPj0wIHx8IHJlc1VybC5pbmRleE9mKFwiLmxoXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHVybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybEFyci5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhLnVybExpc3Q9dXJsTGlzdDtcclxuICAgICAgICAgICAgV215TG9hZDNkLmdldFRoaXMub25sb2FkM2QodXJsQXJyLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uQXNzZXRDb25tcGxldGUsW3Jlc05hbWUsYk5hbWUsZGF0YV0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkFzc2V0UHJvZ3Jlc3MsIFtyZXNOYW1lXSwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG5cdHByaXZhdGUgb25Bc3NldFByb2dyZXNzKHJlc05hbWUscHJvZ3Jlc3MpOiB2b2lkIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2tQcm9ncmVzc0FycjpBcnJheTxMYXlhLkhhbmRsZXI+PXRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja1Byb2dyZXNzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNhbGxiYWNrUHJvZ3Jlc3NBcnJbaV07XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLnJ1bldpdGgoW3Byb2dyZXNzXSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBvbkFzc2V0Q29ubXBsZXRlKHJlc05hbWUsYk5hbWVVcmw6c3RyaW5nLGRhdGEpOnZvaWR7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrT2tBcnI6QXJyYXk8TGF5YS5IYW5kbGVyPj10aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdO1xyXG4gICAgICAgIGlmKGJOYW1lVXJsIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGJhbz1MYXlhLmxvYWRlci5nZXRSZXMoYk5hbWVVcmwpO1xyXG4gICAgICAgICAgICB2YXIgYk5hbWUgPSBiTmFtZVVybC5yZXBsYWNlKFwiLnR4dFwiLFwiXCIpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZmFpcnlndWkuVUlQYWNrYWdlLmFkZFBhY2thZ2UoYk5hbWUsYmFvKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkZVSS3lh7rplJk6XCIsYk5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZUFycj1iTmFtZS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIGRhdGEuYk5hbWU9Yk5hbWVBcnJbYk5hbWVBcnIubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdPWRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tPa0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tPayA9IGNhbGxiYWNrT2tBcnJbaV07XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tPay5ydW5XaXRoKFtkYXRhXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1udWxsO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pc0F1dG9Mb2FkUD1mYWxzZTtcclxuICAgIHByaXZhdGUgX2lzVTNkPWZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRJbmZvQXJyOmFueTtcclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkckNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25BdXRvTG9hZEFsbChjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciB3ZWJEYXRhOmFueT10aGlzLmdldFdldERhdGEodGhpcy5yZXNVcmwpO1xyXG4gICAgICAgIGlmKHdlYkRhdGE9PW51bGwpe1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLnqbrmlbDmja5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYXJyOkFycmF5PGFueT49bnVsbDtcclxuICAgICAgICBpZih3ZWJEYXRhIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBhcnI9d2ViRGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYXJyPT1udWxsKXtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycj1KU09OLnBhcnNlKHdlYkRhdGEpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIsd2ViRGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0Fycj17fTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl09MDtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdPTA7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl09W107XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdPVtdO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPWFycltpXTtcclxuICAgICAgICAgICAgdmFyIHJlc05hbWU9b2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICAgICAgdmFyIHQ9b2JqW1widHlwZVwiXTtcclxuICAgICAgICAgICAgaWYocmVzTmFtZT09bnVsbCB8fCByZXNOYW1lPT1cIlwiIHx8IHQ9PW51bGwgfHwgdD09XCJcIiljb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5vbkF1dG9Mb2FkT2JqKHQscmVzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2lzQXV0b0xvYWRQPXRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQXV0b0xvYWRPYmoodHlwZTpzdHJpbmcscmVzTmFtZSl7XHJcbiAgICAgICAgdmFyIHJlcz10aGlzLmdldFJlc09iaihyZXNOYW1lKTtcclxuICAgICAgICBpZihyZXM9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciByZXNJZD10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl07XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXT17fTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1wiblwiXT1yZXNOYW1lO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPXR5cGU7XHJcbiAgICAgICAgdmFyIGxvYWRPaz1mYWxzZTtcclxuICAgICAgICBpZih0eXBlPT1cInVpXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ1aS3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZDNkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzVTNkPXRydWU7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidTNkLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cIm1hdHNcIil7XHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICByZXNVcmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsTGlzdC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkTWF0cy5nZXRUaGlzLm9ubG9hZDNkKHVybExpc3QsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgICAgIGxvYWRPaz10cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJtYXRzLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cImN1YmVNYXBcIil7XHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIExheWEuVGV4dHVyZUN1YmUubG9hZCh1cmwsbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cImF1ZGlvXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJhdWRpby3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdWJlKHJlc05hbWUsIGNvbXBsZXRlOiBMYXlhLkhhbmRsZXIpOkFycmF5PExheWEuVGV4dHVyZUN1YmU+e1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgIHZhciBSZXNyZXNPYmo6QXJyYXk8TGF5YS5UZXh0dXJlQ3ViZT49W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgIHJlc1VybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHJlc1VybCk7XHJcbiAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG5ldyBMYXlhLkhhbmRsZXIodGhpcyxjdWJlPT57XHJcbiAgICAgICAgICAgICAgICBSZXNyZXNPYmpbaV09Y3ViZTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlLnJ1bldpdGgoW2N1YmUsaV0pO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBSZXNyZXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkxvYWRpbmcocmVzSWQsIHByb2dyZXNzOm51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHZhciBwQz0wO1xyXG4gICAgICAgIGlmKCF0aGlzLl9pc0F1dG9Mb2FkUCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwQ10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInBcIl09cHJvZ3Jlc3M7XHJcbiAgICAgICAgdmFyIG51bT10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl07XHJcbiAgICAgICAgdmFyIHBOdW09MDtcclxuICAgICAgICB2YXIgcFM9MS9udW07XHJcbiAgICAgICAgdmFyIHAwPTAscDE9MDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPG51bTtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltpXTtcclxuICAgICAgICAgICAgdmFyIHA9b2JqW1wicFwiXTtcclxuICAgICAgICAgICAgaWYocCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9pc1UzZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYob2JqW1widFwiXT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAxPXAqKHBTKihpKzEpKSowLjg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAwPXAqKHBTKihpKzEpKSowLjI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBOdW09cDArcDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHBOdW09cCoocFMqKGkrMSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBDPXBOdW0qMTAwO1xyXG4gICAgICAgIGlmKGlzTmFOKHBDKSlwQz0wO1xyXG4gICAgICAgIGlmKHBDPjEpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocEMpO1xyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BDXSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkxvYWRPayhyZXNJZCxkYXRhPyl7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXSs9MTtcclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT09XCJ1aVwiKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl0ucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdPj10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0pe1xyXG4gICAgICAgICAgICBpZih0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl0sdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufSIsImltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi9XbXlVdGlsczNEXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215TG9hZDNke1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZDNke1xyXG4gICAgICAgIGlmKFdteUxvYWQzZC5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5fdGhpcz1uZXcgV215TG9hZDNkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlMb2FkM2QuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3VybExpc3Q6QXJyYXk8c3RyaW5nPjtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcixpc0NsZWFyUmVzPyl7XHJcbiAgICAgICAgdGhpcy5fdXJsTGlzdD1bXTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybDpzdHJpbmc9dXJsTGlzdFtpXVtcInVybFwiXTtcclxuICAgICAgICAgICAgdXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgodXJsKTtcclxuICAgICAgICAgICAgdGhpcy5fdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIHRoaXMuX29ubG9hZDNkKHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBvbkxvYWQzZE9uZSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAvLyAgICAgV215TG9hZDNkLmdldFRoaXMuX29uTG9hZDNkT25lKHVybCxjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHB1YmxpYyBfb25Mb2FkM2RPbmUodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgLy8gICAgIHRoaXMuX2xvYWQzZCh1cmwsY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIF9sb2FkM2QodXJsLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAvLyAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcclxuICAgIC8vICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgLy8gICAgICAgICBpZihjYWxsYmFja09rIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKHApPT57XHJcbiAgICAvLyAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwXSk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9LG51bGwsZmFsc2UpKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTG9hZDNkT25lKHVybDpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgd215TG9hZDNkPW5ldyBXbXlMb2FkM2QoKTtcclxuICAgICAgICB3bXlMb2FkM2QuX19vbmxvYWQzZE9uZSh1cmwsY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX19vbmxvYWQzZE9uZSh1cmwsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB0aGlzLl91cmxMaXN0PVtdO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgdXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgodXJsKTtcclxuICAgICAgICB0aGlzLl91cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICB0aGlzLl9vbmxvYWQzZCh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgX29ubG9hZDNkKF91cmxMaXN0KXtcclxuICAgIC8vICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgIC8vICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX3VybExpc3Q9bnVsbDtcclxuICAgIC8vICAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1udWxsO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPW51bGw7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX21BcnI9bnVsbDtcclxuICAgIC8vICAgICB9KSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKHApPT57XHJcbiAgICAvLyAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwXSk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KSxudWxsLG51bGwsbnVsbCwxLGZhbHNlKTtcclxuICAgIC8vIH1cclxuICAgIHByaXZhdGUgX29ubG9hZDNkKHVybCl7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcclxuICAgICAgICBMYXlhLmxvYWRlci5fY3JlYXRlTG9hZCh1cmwpO1xyXG4gICAgICAgIHZhciBsb2FkPUxheWEuTG9hZGVyTWFuYWdlcltcIl9yZXNNYXBcIl1bdXJsXTtcclxuICAgICAgICBsb2FkLm9uY2UoTGF5YS5FdmVudC5DT01QTEVURSx0aGlzLHRoaXMuX19vbmxzVXJsT2ssW3VybF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21BcnI6QXJyYXk8c3RyaW5nPjtcclxuICAgIHByaXZhdGUgX19vbmxzVXJsT2sodXJsLGQpe1xyXG4gICAgICAgIHZhciBzMD11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIHZhciBzMT11cmwucmVwbGFjZShzMFtzMC5sZW5ndGgtMV0sXCJcIik7XHJcbiAgICAgICAgdmFyIHJvb3RVcmw9czE7XHJcbiAgICAgICAgdmFyIGpzT2JqPUpTT04ucGFyc2UoZCk7XHJcbiAgICAgICAgdGhpcy5fbUFycj1bXTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpUXVVcmwoanNPYmpbXCJkYXRhXCJdLHJvb3RVcmwpO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5fbUFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMuX21BcnJbaV07XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkxvYWRPaykpO1xyXG4gICAgICAgICAgICAvL0xheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkxvYWRPayksdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsZ3JvdXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tTnVtPTA7XHJcbiAgICBwcml2YXRlIF9wTnVtPTA7XHJcbiAgICBwcml2YXRlIF9fb25Mb2FkT2soKXtcclxuICAgICAgICB0aGlzLl9tTnVtKz0xO1xyXG4gICAgICAgIHRoaXMuX3BOdW09dGhpcy5fbU51bS90aGlzLl9tQXJyLmxlbmd0aDtcclxuICAgICAgICB0aGlzLl9fb25Mb2FkUChudWxsKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5fbU51bT49dGhpcy5fbUFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cmxMaXN0PW51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rPW51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPW51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tQXJyPW51bGw7XHJcbiAgICAgICAgICAgIH0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25Mb2FkUCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfX29uTG9hZFAocCl7XHJcbiAgICAgICAgdmFyIHBOdW09dGhpcy5fcE51bSowLjc7XHJcbiAgICAgICAgaWYocCl7XHJcbiAgICAgICAgICAgIHBOdW0rPXAqMC4yNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcE51bV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gcHJpdmF0ZSBfbVA9MDtcclxuICAgIC8vIHByaXZhdGUgX21QMj0wO1xyXG5cclxuICAgIC8vIHByaXZhdGUgX19vbkFyclAocCl7XHJcbiAgICAvLyAgICAgdmFyIHBOdW09cCoodGhpcy5fbU51bSsxKTtcclxuICAgIC8vICAgICBpZihwTnVtPnRoaXMuX21QKXRoaXMuX21QPXBOdW07XHJcbiAgICAvLyAgICAgdGhpcy5fbVAyPSh0aGlzLl9tUC90aGlzLl9tQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgdmFyIHBOdW09KHRoaXMuX21QMikqMC45ODtcclxuICAgIC8vICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwTnVtXSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgLy8gcHJpdmF0ZSBfX29uQXJyT2soKXtcclxuICAgIC8vICAgICB0aGlzLl9tTnVtKz0xO1xyXG4gICAgLy8gICAgIGlmKHRoaXMuX21OdW0+PXRoaXMuX21BcnIubGVuZ3RoKXtcclxuICAgIC8vICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHRoaXMuX3VybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCgpPT57XHJcbiAgICAvLyAgICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fdXJsTGlzdD1udWxsO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1udWxsO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1udWxsO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fbUFycj1udWxsO1xyXG4gICAgLy8gICAgICAgICB9KSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgcHJpdmF0ZSBfX3RpUXVVcmwob2JqLHVybDpzdHJpbmc9XCJcIil7XHJcbiAgICAgICAgaWYob2JqW1wicHJvcHNcIl0hPW51bGwgJiYgb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBtZXNoUGF0aD11cmwrb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKG1lc2hQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChtZXNoUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsczpBcnJheTxhbnk+PW9ialtcInByb3BzXCJdW1wibWF0ZXJpYWxzXCJdO1xyXG4gICAgICAgICAgICBpZihtYXRlcmlhbHMhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpaT0wO2lpPG1hdGVyaWFscy5sZW5ndGg7aWkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGg9dXJsK21hdGVyaWFsc1tpaV1bXCJwYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbXCJjb21wb25lbnRzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGNvbXBvbmVudHM6QXJyYXk8YW55Pj1vYmpbXCJjb21wb25lbnRzXCJdO1xyXG4gICAgICAgICAgICBpZihjb21wb25lbnRzLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkwID0gMDsgaTAgPCBjb21wb25lbnRzLmxlbmd0aDsgaTArKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wID0gY29tcG9uZW50c1tpMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImF2YXRhclwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcGF0aD11cmwrY29tcFtcImF2YXRhclwiXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihhcGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goYXBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbXBbXCJsYXllcnNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXJzOkFycmF5PGFueT49Y29tcFtcImxheWVyc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IGxheWVycy5sZW5ndGg7IGkxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllciA9IGxheWVyc1tpMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVzOkFycmF5PGFueT49bGF5ZXJbXCJzdGF0ZXNcIl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBzdGF0ZXMubGVuZ3RoOyBpMisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW2kyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xpcFBhdGg9dXJsK3N0YXRlW1wiY2xpcFBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGNsaXBQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKGNsaXBQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNoaWxkOkFycmF5PGFueT49b2JqW1wiY2hpbGRcIl07XHJcbiAgICAgICAgaWYoY2hpbGQhPW51bGwgJiYgY2hpbGQubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGNoaWxkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3RpUXVVcmwoY2hpbGRbaV0sdXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL1xyXG4gICAgcHVibGljIGNsZWFyUmVzKHVybDpzdHJpbmcpe1xyXG4gICAgICAgIGlmKCF1cmwgfHwgdXJsLmluZGV4T2YoXCIvXCIpPDApcmV0dXJuO1xyXG4gICAgICAgIHZhciB1MD11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIHZhciB1MT11cmwucmVwbGFjZSh1MFt1MC5sZW5ndGgtMV0sXCJcIik7XHJcblxyXG4gICAgICAgIHZhciB1cmxzPVtdO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIExheWEuTG9hZGVyLmxvYWRlZE1hcCkge1xyXG4gICAgICAgICAgICBpZiAoTGF5YS5Mb2FkZXIubG9hZGVkTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsb2FkVXJsOnN0cmluZz0ga2V5O1xyXG4gICAgICAgICAgICAgICAgaWYobG9hZFVybC5pbmRleE9mKHUxKT49MCB8fCBsb2FkVXJsLmluZGV4T2YoXCJyZXMvbWF0cy9cIik+PTAgKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih1cmxzLmluZGV4T2YobG9hZFVybCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybHMucHVzaChsb2FkVXJsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXJscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSB1cmxzW2ldO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy/moLnmja7otYTmupDot6/lvoTojrflj5botYTmupDvvIhSZXNvdXJjZeS4uuadkOi0qOOAgei0tOWbvuOAgee9keagvOetieeahOWfuuexu++8iVxyXG4gICAgICAgICAgICAgICAgdmFyIHJlczpMYXlhLlJlc291cmNlPUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXJlcy5sb2NrKXtcclxuICAgICAgICAgICAgICAgICAgICByZXMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8v6LWE5rqQ6YeK5pS+XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlbGVhc2VSZXNvdXJjZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcclxuICAgICAgICAgICAgICAgIC8vTGF5YS5sb2FkZXIuY2xlYXJVbkxvYWRlZCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaWRSZXNvdXJjZXNNYXBMb2NrKHRhcmdldCxpc0xvY2s9dHJ1ZSl7XHJcbiAgICAgICAgaWYodGFyZ2V0PT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgb2JqTGlzdD1XbXlVdGlsczNELmdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxMYXlhLlJlbmRlcmFibGVTcHJpdGUzRCk7XHJcbiAgICAgICAgdmFyIGtJZHM9W107XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiBvYmpMaXN0KXtcclxuICAgICAgICAgICAgdmFyIG9iaj1vYmpMaXN0W2ldO1xyXG4gICAgICAgICAgICBXbXlMb2FkM2QuX2xvb3BMb2NrKG9iaixrSWRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHJNYXA9TGF5YS5SZXNvdXJjZVtcIl9pZFJlc291cmNlc01hcFwiXTtcclxuICAgICAgICBmb3IgKHZhciBrIGluIGtJZHMpe1xyXG4gICAgICAgICAgICBjb25zdCBvID1rSWRzW2tdO1xyXG4gICAgICAgICAgICB2YXIgcmVzPXJNYXBbb107XHJcbiAgICAgICAgICAgIHJlcy5sb2NrPWlzTG9jaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2xvb3BMb2NrKG9iaixhcnIpe1xyXG4gICAgICAgIFdteUxvYWQzZC5fTWVzaChvYmosYXJyKTtcclxuICAgICAgICBXbXlMb2FkM2QuX01hdGVyaWFscyhvYmosYXJyKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLkJhc2VSZW5kZXIpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9sb29wTG9jayhvLGFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX01lc2gob2JqLGFycil7XHJcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBvID0gb2JqW2tdO1xyXG4gICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5NZXNoKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgX3ZlcnRleEJ1ZmZlcnM9b1tcIl92ZXJ0ZXhCdWZmZXJzXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYoX3ZlcnRleEJ1ZmZlcnMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgazAgaW4gX3ZlcnRleEJ1ZmZlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbzAgPSBfdmVydGV4QnVmZmVyc1trMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG8wIGluc3RhbmNlb2YgTGF5YS5WZXJ0ZXhCdWZmZXIzRCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8wLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgazEgaW4gbykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG8xID0gb1trMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobzEgaW5zdGFuY2VvZiBMYXlhLkluZGV4QnVmZmVyM0Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8xLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9NYXRlcmlhbHMob2JqLGFycil7XHJcbiAgICAgICAgdmFyIF9tYXRlcmlhbHM9b2JqW1wiX21hdGVyaWFsc1wiXTtcclxuICAgICAgICBpZihfbWF0ZXJpYWxzKXtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrIGluIF9tYXRlcmlhbHMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG8gPSBfbWF0ZXJpYWxzW2tdO1xyXG4gICAgICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuQmFzZU1hdGVyaWFsKXtcclxuICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8sYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX1NoYWRlcihvLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgV215TG9hZDNkLl9TaGFkZXJEYXRhKG8sYXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX1NoYWRlcihvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLlNoYWRlcjNEKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfU2hhZGVyRGF0YShvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLlNoYWRlckRhdGEpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9CYXNlVGV4dHVyZShvW1wiX2RhdGFcIl0sYXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfQmFzZVRleHR1cmUob2JqLGFycil7XHJcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBvID0gb2JqW2tdO1xyXG4gICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5CYXNlVGV4dHVyZSl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8sYXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfZ2V0UmVzb3VyY2VzTWFwSWQob2JqLGFycil7XHJcbiAgICAgICAgdmFyIHJNYXA9TGF5YS5SZXNvdXJjZVtcIl9pZFJlc291cmNlc01hcFwiXTtcclxuICAgICAgICBmb3IgKHZhciBrIGluIHJNYXApe1xyXG4gICAgICAgICAgICB2YXIgcmVzPXJNYXBba107XHJcbiAgICAgICAgICAgIGlmKG9iaj09cmVzKXtcclxuICAgICAgICAgICAgICAgIGlmKGFyci5pbmRleE9mKGspPDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFdteUxvYWRNYXRze1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZE1hdHN7XHJcbiAgICAgICAgaWYoV215TG9hZE1hdHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlMb2FkTWF0cy5fdGhpcz1uZXcgV215TG9hZE1hdHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWRNYXRzLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vblVybEFyck9rLFt1cmxMaXN0XSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tYXRzVXJsQXJyOkFycmF5PHN0cmluZz49W107XHJcbiAgICBwcml2YXRlIF9tYXRPaz1mYWxzZTtcclxuICAgIHByaXZhdGUgX21hdE51bT0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UD0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UDI9MDtcclxuXHJcbiAgICBwcml2YXRlIF9fb25VcmxBcnJPayh1cmxMaXN0OkFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybD11cmxMaXN0W2ldO1xyXG4gICAgICAgICAgICAvLyB2YXIgdHh0PUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICAvLyB2YXIganNPYmo9SlNPTi5wYXJzZSh0eHQpO1xyXG4gICAgICAgICAgICB2YXIganNPYmo9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXJyPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIHZhciBtYXRzVXJsPXVybC5yZXBsYWNlKGFyclthcnIubGVuZ3RoLTFdLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXk6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycmF5PWpzT2JqW1wibWF0c1wiXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgICAgICBpZihvYmpbXCJ0YXJnZXROYW1lXCJdPT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hdFVybD1tYXRzVXJsK29ialtcIm1hdFVybFwiXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hdHNVcmxBcnIucHVzaChtYXRVcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21hdHNVcmxBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tYXRzVXJsQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25NYXRBcnJPayksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyclApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyUChwKXtcclxuICAgICAgICB2YXIgcE51bT1wKih0aGlzLl9tYXROdW0rMSk7XHJcbiAgICAgICAgaWYocE51bT50aGlzLl9tYXRQKXRoaXMuX21hdFA9cE51bTtcclxuICAgICAgICB0aGlzLl9tYXRQMj0odGhpcy5fbWF0UC90aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbdGhpcy5fbWF0UDJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyT2soKXtcclxuICAgICAgICB0aGlzLl9tYXROdW0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fbWF0TnVtPj10aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuL1dteVV0aWxzM0RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlTY3JpcHQzRCBleHRlbmRzIExheWEuU2NyaXB0M0Qge1xyXG4gICAgcHVibGljIGRlbChkZXN0cm95Q2hpbGQ6IGJvb2xlYW4gPSB0cnVlKXtcclxuICAgICAgICB0aGlzLm93bmVyM0QuZGVzdHJveShkZXN0cm95Q2hpbGQpO1xyXG4gICAgfVxyXG5cdHB1YmxpYyBvbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vd25lcjNEPW51bGw7XHJcbiAgICAgICAgdGhpcy5zY2VuZTNEPW51bGw7XHJcbiAgICAgICAgdGhpcy5vbkRlbCgpO1xyXG4gICAgfVxyXG4gICAgXHJcblx0cHVibGljIG9uRGVsKCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIG93bmVyM0Q6TGF5YS5TcHJpdGUzRDtcclxuICAgIHByaXZhdGUgX2xvY2FsU2NhbGU6TGF5YS5WZWN0b3IzO1xyXG5cclxuICAgIHB1YmxpYyBzY2VuZTNEOkxheWEuU2NlbmUzRDtcclxuXHJcblx0cHVibGljIF9vbkFkZGVkKCkge1xyXG4gICAgICAgIHN1cGVyLl9vbkFkZGVkKCk7XHJcbiAgICAgICAgdGhpcy5vd25lcjNEPXRoaXMub3duZXIgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB0aGlzLl9sb2NhbFNjYWxlPW5ldyBMYXlhLlZlY3RvcjMoMCwgMCwgMCk7XHJcbiAgICAgICAgaWYodGhpcy5vd25lcjNELnRyYW5zZm9ybSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsU2NhbGU9dGhpcy5vd25lcjNELnRyYW5zZm9ybS5sb2NhbFNjYWxlLmNsb25lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NlbmUzRD10aGlzLm93bmVyM0Quc2NlbmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8v5piv5ZCm5Y+v6KeBXHJcbiAgICBwdWJsaWMgc2V0U2hvdyh2OmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMub3duZXIzRC50cmFuc2Zvcm0ubG9jYWxTY2FsZSA9ICF2PyBuZXcgTGF5YS5WZWN0b3IzKDAsIDAsIDApOiB0aGlzLl9sb2NhbFNjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vXHJcbiAgICBwdWJsaWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBXbXlVdGlsczNELmdldE9iajNkVXJsKHRhcmdldCx1cmwpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgV215X0xvYWRfTWFnIH0gZnJvbSBcIi4uL1dteV9Mb2FkX01hZ1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteVV0aWxzM0R7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkKHRhcmdldCxvYmpOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5uYW1lPT1vYmpOYW1lKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvOkxheWEuU3ByaXRlM0QgPSB0YXJnZXQuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBpZiAoby5fY2hpbGRyZW4ubGVuZ3RoIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG8ubmFtZT09b2JqTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG87XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wT2JqPXRoaXMuZ2V0T2JqM2QobyxvYmpOYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBPYmohPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wT2JqO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBhcnJVcmw9dXJsLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldE9iakFyclVybCh0YXJnZXQsYXJyVXJsKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgX2dldE9iakFyclVybCh0YXJnZXQsdXJsQXJyOkFycmF5PHN0cmluZz4saWQ9MCl7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYoX3RhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgbmE9dXJsQXJyW2lkXTtcclxuICAgICAgICB2YXIgdGFyZ2V0T2JqPV90YXJnZXQuZ2V0Q2hpbGRCeU5hbWUobmEpO1xyXG4gICAgICAgIGlmKHRhcmdldE9iaj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihpZD49dXJsQXJyLmxlbmd0aC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGFyZ2V0T2JqPXRoaXMuX2dldE9iakFyclVybCh0YXJnZXRPYmosdXJsQXJyLCsraWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxjbGFzOmFueSxhcnI/KTpBcnJheTxhbnk+e1xyXG4gICAgICAgIGlmKGFycj09bnVsbClhcnI9W107XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvYmo9dGFyZ2V0LmdldENvbXBvbmVudChjbGFzKTtcclxuICAgICAgICBpZihvYmo9PW51bGwpe1xyXG4gICAgICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBjbGFzKXtcclxuICAgICAgICAgICAgICAgIG9iaj10YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqIT1udWxsICYmIGFyci5pbmRleE9mKG9iaik8MCl7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5fY2hpbGRyZW49PW51bGwpIHJldHVybiBhcnI7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZHJlbkNvbXBvbmVudChvLGNsYXMsYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlKHRhcmdldCx0YXJnZXROYW1lPzpzdHJpbmcpOmFueXtcclxuICAgICAgICBpZih0YXJnZXQ9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD1udWxsO1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUpe1xyXG4gICAgICAgICAgICB2YXIgdGVtcE9iaj1XbXlVdGlsczNELmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKTtcclxuICAgICAgICAgICAgaWYodGVtcE9iail7XHJcbiAgICAgICAgICAgICAgICBfdGFyZ2V0PUxheWEuU3ByaXRlM0QuaW5zdGFudGlhdGUodGVtcE9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgX3RhcmdldD1MYXlhLlNwcml0ZTNELmluc3RhbnRpYXRlKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5r+A5rS76Zi05b2x44CCXHJcbiAgICAgKiBAcGFyYW1cdGRpcmVjdGlvbkxpZ2h0IOebtOe6v+WFiVxyXG4gICAgICogQHBhcmFtXHRzaGFkb3dSZXNvbHV0aW9uIOeUn+aIkOmYtOW9sei0tOWbvuWwuuWvuFxyXG4gICAgICogQHBhcmFtXHRzaGFkb3dQQ0ZUeXBlIOaooeeziuetiee6pyzotorlpKfotorpq5gs5pu06ICX5oCn6IO9XHJcbiAgICAgKiBAcGFyYW1cdHNoYWRvd0Rpc3RhbmNlIOWPr+ingemYtOW9sei3neemu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uU2hhZG93KGRpcmVjdGlvbkxpZ2h0OkxheWEuRGlyZWN0aW9uTGlnaHQsc2hhZG93UmVzb2x1dGlvbj01MTIsc2hhZG93UENGVHlwZT0xLHNoYWRvd0Rpc3RhbmNlOm51bWJlcj0xNSxpc1NoYWRvdzpib29sZWFuPXRydWUpe1xyXG4gICAgICAgIC8v54Gv5YWJ5byA5ZCv6Zi05b2xXHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgLy/lj6/op4HpmLTlvbHot53nprtcclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dEaXN0YW5jZSA9IHNoYWRvd0Rpc3RhbmNlO1xyXG4gICAgICAgIC8v55Sf5oiQ6Zi05b2x6LS05Zu+5bC65a+4XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UmVzb2x1dGlvbiA9IHNoYWRvd1Jlc29sdXRpb247XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UFNTTUNvdW50PTE7XHJcbiAgICAgICAgLy/mqKHns4rnrYnnuqcs6LaK5aSn6LaK6auYLOabtOiAl+aAp+iDvVxyXG4gICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd1BDRlR5cGUgPSBzaGFkb3dQQ0ZUeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDmv4DmtLvpmLTlvbHjgIJcclxuICAgICAqIEBwYXJhbVx0dGFyZ2V0IFxyXG4gICAgICogQHBhcmFtXHR0eXBlIDDmjqXmlLbpmLTlvbEsMeS6p+eUn+mYtOW9sSwy5o6l5pS26Zi05b2x5Lqn55Sf6Zi05b2xXHJcbiAgICAgKiBAcGFyYW1cdGlzU2hhZG93IOaYr+WQpumYtOW9sVxyXG4gICAgICogQHBhcmFtXHRpc0NoaWxkcmVuIOaYr+WQpuWtkOWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uQ2FzdFNoYWRvdyh0YXJnZXQsdHlwZT0wLGlzU2hhZG93PXRydWUsaXNDaGlsZHJlbj10cnVlKXtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLk1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBtczNEPSh0YXJnZXQgYXMgTGF5YS5NZXNoU3ByaXRlM0QpO1xyXG4gICAgICAgICAgICBpZih0eXBlPT0wKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0yKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBzbXMzZD0odGFyZ2V0IGFzIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGU9PTApe1xyXG4gICAgICAgICAgICAgICAgc21zM2Quc2tpbm5lZE1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIHNtczNkLnNraW5uZWRNZXNoUmVuZGVyZXIuY2FzdFNoYWRvdz1pc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaXNDaGlsZHJlbil7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lm51bUNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSB0YXJnZXQuZ2V0Q2hpbGRBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25DYXN0U2hhZG93KG9iaix0eXBlLGlzU2hhZG93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZ2IyaGV4KHIsZyxiKXtcclxuICAgICAgICB2YXIgX2hleD1cIiNcIiArIHRoaXMuaGV4KHIpICt0aGlzLiBoZXgoZykgKyB0aGlzLmhleChiKTtcclxuICAgICAgICByZXR1cm4gX2hleC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGV4KHgpe1xyXG4gICAgICAgIHg9dGhpcy5vbk51bVRvKHgpO1xyXG4gICAgICAgIHJldHVybiAoXCIwXCIgKyBwYXJzZUludCh4KS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGhleDJyZ2IoaGV4OnN0cmluZykge1xyXG4gICAgICAgIC8vIEV4cGFuZCBzaG9ydGhhbmQgZm9ybSAoZS5nLiBcIjAzRlwiKSB0byBmdWxsIGZvcm0gKGUuZy4gXCIwMDMzRkZcIilcclxuICAgICAgICB2YXIgc2hvcnRoYW5kUmVnZXggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pO1xyXG4gICAgICAgIGhleCA9IGhleC5yZXBsYWNlKHNob3J0aGFuZFJlZ2V4LCBmdW5jdGlvbihtLCByLCBnLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByICsgciArIGcgKyBnICsgYiArIGI7XHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICB2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHtcclxuICAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXHJcbiAgICAgICAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxyXG4gICAgICAgICAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxyXG4gICAgICAgIH0gOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4pe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQoMikpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBcclxuICAgcHVibGljIHN0YXRpYyBsZXJwRihhOm51bWJlciwgYjpudW1iZXIsIHM6bnVtYmVyKTpudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIChhICsgKGIgLSBhKSAqIHMpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSYXlDYXN0QWxsKGNhbTpMYXlhLkNhbWVyYSwgdmlld3BvcnRQb2ludDpMYXlhLlZlY3RvcjIsIHJheT86TGF5YS5SYXksIGNvbGxpc29uR3JvdXA/OiBudW1iZXIsIGNvbGxpc2lvbk1hc2s/OiBudW1iZXIpe1xyXG4gICAgICAgIHZhciBfb3V0SGl0QWxsSW5mbyA9ICBuZXcgQXJyYXk8TGF5YS5IaXRSZXN1bHQ+KCk7XHJcbiAgICAgICAgdmFyIF9yYXkgPXJheTtcclxuICAgICAgICBpZighX3JheSl7XHJcbiAgICAgICAgICAgIF9yYXkgPSBuZXcgTGF5YS5SYXkobmV3IExheWEuVmVjdG9yMygpLCBuZXcgTGF5YS5WZWN0b3IzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+S7juWxj+W5leepuumXtOeUn+aIkOWwhOe6v1xyXG4gICAgICAgIHZhciBfcG9pbnQgPSB2aWV3cG9ydFBvaW50LmNsb25lKCk7XHJcbiAgICAgICAgY2FtLnZpZXdwb3J0UG9pbnRUb1JheShfcG9pbnQsIF9yYXkpO1xyXG4gICAgICAgIC8v5bCE57q/5qOA5rWL6I635Y+W5omA5pyJ5qOA5rWL56Kw5pKe5Yiw55qE54mp5L2TXHJcbiAgICAgICAgaWYoY2FtLnNjZW5lIT1udWxsICYmIGNhbS5zY2VuZS5waHlzaWNzU2ltdWxhdGlvbiE9bnVsbCl7XHJcbiAgICAgICAgICAgIGNhbS5zY2VuZS5waHlzaWNzU2ltdWxhdGlvbi5yYXlDYXN0QWxsKF9yYXksIF9vdXRIaXRBbGxJbmZvLCAxMDAwMCwgY29sbGlzb25Hcm91cCwgY29sbGlzaW9uTWFzayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfb3V0SGl0QWxsSW5mbztcclxuICAgIH1cclxuXHJcbiAgICAvL+i3neemu1xyXG5cdHB1YmxpYyBzdGF0aWMgRGlzdGFuY2UoYTpMYXlhLlZlY3RvcjIsYjpMYXlhLlZlY3RvcjIpOm51bWJlciB7XHJcblx0XHR2YXIgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xyXG5cdFx0dmFyIGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcclxuXHRcdHZhciBkPU1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpO1xyXG5cdFx0ZD1wYXJzZUZsb2F0KGQudG9GaXhlZCgyKSk7XHJcblx0XHRyZXR1cm4gZDtcclxuICAgIH1cclxuICAgIFxyXG5cclxuXHJcbiAgICAvL+WKqOeUuy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaVBsYXkodGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSwgbm9ybWFsaXplZFRpbWU/Om51bWJlciwgY29tcGxldGVFdmVudD86TGF5YS5IYW5kbGVyLCBwYXJhbXM/OkFycmF5PGFueT4sIGxheWVySW5kZXg/OiBudW1iZXIpOkxheWEuQW5pbWF0b3J7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihjb21wbGV0ZUV2ZW50KXtcclxuICAgICAgICAgICAgV215VXRpbHMzRC5hbmlBZGRFdmVudEZ1bih0YXJnZXQzZCxudWxsLGFuaU5hbWUsLTEsY29tcGxldGVFdmVudCx0cnVlLHBhcmFtcyxsYXllckluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFyZ2V0M2RfYW5pLnBsYXkoYW5pTmFtZSxsYXllckluZGV4LG5vcm1hbGl6ZWRUaW1lKTtcclxuICAgICAgICByZXR1cm4gdGFyZ2V0M2RfYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pQWRkRXZlbnRGdW4odGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSx0aW1lOm51bWJlcixjYWxsYmFjazpMYXlhLkhhbmRsZXIsaXNFdmVudE9uZT10cnVlLHBhcmFtcz86QXJyYXk8YW55PixsYXllckluZGV4PzogbnVtYmVyKXtcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYodGFyZ2V0TmFtZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRhcmdldDNkPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldDNkPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgaWYodGFyZ2V0M2RfYW5pPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFdteVV0aWxzM0QuX2FuaUFkZEV2ZW50KHRhcmdldDNkX2FuaSxudWxsLGFuaU5hbWUsXCJfd215X2FuaV9jYWxsYmFja1wiLHRpbWUscGFyYW1zLGxheWVySW5kZXgpO1xyXG4gICAgICAgIHZhciB3YWU9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KF9fV215QW5pRXZlbnQpIGFzIF9fV215QW5pRXZlbnQ7XHJcbiAgICAgICAgaWYoIXdhZSl7XHJcbiAgICAgICAgICAgIHdhZT10YXJnZXQzZC5hZGRDb21wb25lbnQoX19XbXlBbmlFdmVudCkgYXMgX19XbXlBbmlFdmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrTmFtZT1cIndteV9cIitjYWxsYmFjay5jYWxsZXIuaWQrYW5pTmFtZSt0aW1lO1xyXG4gICAgICAgIGlmKGlzRXZlbnRPbmUpe1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uY2UoY2FsbGJhY2tOYW1lLHRoaXMsKF9jYWxsYmFja05hbWUsX2NhbGxiYWNrLHApPT57XHJcbiAgICAgICAgICAgICAgICBfY2FsbGJhY2sucnVuV2l0aChwKTtcclxuICAgICAgICAgICAgICAgIHdhZS5kZWxDYWxsYmFjayhfY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICAgICAgfSxbY2FsbGJhY2tOYW1lLGNhbGxiYWNrXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2Uub24oY2FsbGJhY2tOYW1lLHRoaXMsKF9jYWxsYmFja05hbWUsX2NhbGxiYWNrLHApPT57XHJcbiAgICAgICAgICAgICAgICBfY2FsbGJhY2sucnVuV2l0aChwKTtcclxuICAgICAgICAgICAgfSxbY2FsbGJhY2tOYW1lLGNhbGxiYWNrXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdhZS5hZGRDYWxsYmFjayhjYWxsYmFja05hbWUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaURlbEV2ZW50RnVuKHRhcmdldCx0YXJnZXROYW1lLGNhbGxiYWNrOkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgd2FlPXRhcmdldDNkLmdldENvbXBvbmVudChfX1dteUFuaUV2ZW50KSBhcyBfX1dteUFuaUV2ZW50O1xyXG4gICAgICAgIGlmKHdhZSl7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFja05hbWU9XCJ3bXlfXCIrY2FsbGJhY2suY2FsbGVyLm5hbWUrY2FsbGJhY2subWV0aG9kLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2Uub24oY2FsbGJhY2tOYW1lLGNhbGxiYWNrLmNhbGxlcixjYWxsYmFjay5tZXRob2QpO1xyXG4gICAgICAgICAgICB3YWUuZGVsQ2FsbGJhY2soY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBfYW5pQWRkRXZlbnQodGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSxldmVudE5hbWU6c3RyaW5nLHRpbWU6bnVtYmVyLHBhcmFtcz86QXJyYXk8YW55PixsYXllckluZGV4PzogbnVtYmVyKTpMYXlhLkFuaW1hdG9ye1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPW51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT1udWxsO1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10YXJnZXQ7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuQW5pbWF0b3Ipe1xyXG4gICAgICAgICAgICB0YXJnZXQzZF9hbmk9dGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGFuaW1hdG9yU3RhdGU6TGF5YS5BbmltYXRvclN0YXRlPXRhcmdldDNkX2FuaS5nZXRDb250cm9sbGVyTGF5ZXIobGF5ZXJJbmRleCkuX3N0YXRlc01hcFthbmlOYW1lXTtcclxuICAgICAgICBpZihhbmltYXRvclN0YXRlPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBpc0FkZD10cnVlO1xyXG4gICAgICAgIHZhciBldmVudHM9YW5pbWF0b3JTdGF0ZS5fY2xpcC5fZXZlbnRzO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGV2ZW50cykge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50OkxheWEuQW5pbWF0aW9uRXZlbnQgPSBldmVudHNba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmKGV2ZW50LmV2ZW50TmFtZT09ZXZlbnROYW1lICYmIGFuaUV2ZW50LnRpbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQWRkPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzQWRkKXtcclxuICAgICAgICAgICAgdmFyIGFuaUV2ZW50PW5ldyBMYXlhLkFuaW1hdGlvbkV2ZW50KCk7XHJcbiAgICAgICAgICAgIGFuaUV2ZW50LmV2ZW50TmFtZT1ldmVudE5hbWU7XHJcbiAgICAgICAgICAgIHZhciBjbGlwRHVyYXRpb249YW5pbWF0b3JTdGF0ZS5fY2xpcC5fZHVyYXRpb247XHJcbiAgICAgICAgICAgIGlmKHRpbWU9PS0xKXtcclxuICAgICAgICAgICAgICAgIHRpbWU9Y2xpcER1cmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFuaUV2ZW50LnRpbWU9IHRpbWUgLyBjbGlwRHVyYXRpb247XHJcbiAgICAgICAgICAgIGFuaUV2ZW50LnBhcmFtcz1wYXJhbXM7XHJcbiAgICAgICAgICAgIGFuaW1hdG9yU3RhdGUuX2NsaXAuYWRkRXZlbnQoYW5pRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0M2RfYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pQWRkU2NyaXB0KHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUsc2NyaXB0PzphbnksbGF5ZXJJbmRleD86IG51bWJlcik6TGF5YS5BbmltYXRvclN0YXRle1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGFuaW1hdG9yU3RhdGU6TGF5YS5BbmltYXRvclN0YXRlPXRhcmdldDNkX2FuaS5nZXRDb250cm9sbGVyTGF5ZXIobGF5ZXJJbmRleCkuX3N0YXRlc01hcFthbmlOYW1lXTtcclxuICAgICAgICBpZihhbmltYXRvclN0YXRlPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGFuaW1hdG9yU3RhdGUuYWRkU2NyaXB0KHNjcmlwdCk7XHJcbiAgICAgICAgcmV0dXJuIGFuaW1hdG9yU3RhdGU7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuXHJcblxyXG5jbGFzcyBfX1dteUFuaUV2ZW50IGV4dGVuZHMgTGF5YS5TY3JpcHQzRCB7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFjaz1bXTtcclxuICAgIHB1YmxpYyBhZGRDYWxsYmFjayhjYWxsYmFja05hbWUpe1xyXG4gICAgICAgIHZhciBpbmRleElkPXRoaXMuX2NhbGxiYWNrLmluZGV4T2YoY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICBpZihpbmRleElkPDApe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5wdXNoKGNhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGRlbENhbGxiYWNrKGNhbGxiYWNrTmFtZSl7XHJcbiAgICAgICAgdmFyIGluZGV4SWQ9dGhpcy5fY2FsbGJhY2suaW5kZXhPZihjYWxsYmFja05hbWUpO1xyXG4gICAgICAgIGlmKGluZGV4SWQ+PTApe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5zcGxpY2UoaW5kZXhJZCwxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgX3dteV9hbmlfY2FsbGJhY2socGFyYW1zPzpBcnJheTxhbnk+KXtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2NhbGxiYWNrLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrTmFtZSA9IHRoaXMuX2NhbGxiYWNrW2ldO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KGNhbGxiYWNrTmFtZSxwYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSBcIi4uL1dteVNjcmlwdDNEXCI7XHJcbmltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi4vV215VXRpbHMzRFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215QzREVmV0ZXhBbmltYXRvciBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuICAgIF9hbmlyOkxheWEuQW5pbWF0b3I7XHJcbiAgICBfdmVydGljZXNPYmo6TGF5YS5TcHJpdGUzRDtcclxuICAgIG9uQXdha2UoKXtcclxuICAgICAgICB0aGlzLl9hbmlyPXRoaXMub3duZXIzRC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZiAodGhpcy5fYW5pciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGlzLm93bmVyM0Qub24oXCJhbmlfcGxheVwiLHRoaXMsdGhpcy5vblBsYXkpO1xyXG5cclxuICAgICAgICB2YXIgb2Jqcz10aGlzLl9hbmlyLl9yZW5kZXJhYmxlU3ByaXRlcztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHZldGV4VD1udWxsO1xyXG4gICAgICAgICAgICBjb25zdCBtZXNoT2JqID0gb2Jqc1tpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtZXNoT2JqLm51bUNoaWxkcmVuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNPYmogPSBtZXNoT2JqLmdldENoaWxkQXQoaSk7XHJcbiAgICAgICAgICAgICAgICBpZihjT2JqLm5hbWUuaW5kZXhPZihcIlZldGV4X0hhbmRsZVwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmV0ZXhUPWNPYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodmV0ZXhUIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2VzT2JqPXZldGV4VDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL21lc2hPYmouX3JlbmRlci5lbmFibGU9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl92ZXJ0aWNlc09iaiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uSW5pdFZlcnRleCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG9uUGxheShuPVwicGxheVwiLHQ9MCxzcGVlZD0xKXtcclxuICAgIC8vICAgICB2YXIgb2Jqcz10aGlzLl9hbmlyLl9yZW5kZXJhYmxlU3ByaXRlcztcclxuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgICAgICAgY29uc3QgbWVzaE9iaiA9IG9ianNbaV07XHJcbiAgICAvLyAgICAgICAgIC8vbWVzaE9iai5fcmVuZGVyLmVuYWJsZT10cnVlO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgdGhpcy5fYW5pci5wbGF5KG4sdW5kZWZpbmVkLHQpO1xyXG4gICAgLy8gICAgIHRoaXMuX2FuaXIuc3BlZWQ9c3BlZWQ7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy/pobbngrktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgX21lc2g6TGF5YS5NZXNoRmlsdGVyO1xyXG4gICAgX3NoYXJlZE1lc2g6YW55O1xyXG5cclxuICAgIF92ZXJ0ZXhCdWZmZXJzOmFueTtcclxuICAgIF92ZXJ0ZXhBcnJheTpBcnJheTxMYXlhLlRyYW5zZm9ybTNEPjtcclxuICAgIF9tTWFwcGluZ1ZldGV4SW5mb0FycjpBcnJheTxhbnk+O1xyXG4gICAgX21DYWNoZVZlcnRpY2VzQXJyOkFycmF5PGFueT47XHJcblxyXG4gICAgb25Jbml0VmVydGV4KCl7XHJcbiAgICAgICAgdGhpcy5fbWVzaCA9IHRoaXMuX3ZlcnRpY2VzT2JqLnBhcmVudFtcIm1lc2hGaWx0ZXJcIl07XHJcbiAgICAgICAgaWYoIXRoaXMuX21lc2gpe1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fdmVydGljZXNPYmoubnVtQ2hpbGRyZW4+MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRleEFycmF5PVtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3ZlcnRpY2VzT2JqLm51bUNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRleEFycmF5W2ldID0gKHRoaXMuX3ZlcnRpY2VzT2JqLmdldENoaWxkQXQoaSkgYXMgTGF5YS5TcHJpdGUzRCkudHJhbnNmb3JtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCF0aGlzLl92ZXJ0ZXhBcnJheSl7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdmVydGV4QnVmZmVycz10aGlzLl9tZXNoLnNoYXJlZE1lc2hbXCJfdmVydGV4QnVmZmVyc1wiXTtcclxuICAgICAgXHJcbiAgICAgICAgdGhpcy5fbUNhY2hlVmVydGljZXNBcnIgPSB0aGlzLl9tZXNoLnNoYXJlZE1lc2guX2dldFBvc2l0aW9ucygpO1xyXG4gICAgICAgIHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyPVtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3ZlcnRleEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5fdmVydGV4QXJyYXlbaV07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0FycltpXT17fTtcclxuICAgICAgICAgICAgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnJbaV0uVHJhbnNmb3JtSW5mbyA9IGl0ZW07XHJcblxyXG4gICAgICAgICAgICB2YXIgbUluZGV4TGlzdD1bXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fbUNhY2hlVmVydGljZXNBcnIubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhQb3MgPSB0aGlzLl9tQ2FjaGVWZXJ0aWNlc0FycltqXTtcclxuICAgICAgICAgICAgICAgIHZhciBkPUxheWEuVmVjdG9yMy5kaXN0YW5jZSh2ZXJ0ZXhQb3MsaXRlbS5sb2NhbFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChkIDw9MC4wMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbUluZGV4TGlzdC5wdXNoKGopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0FycltpXS5WZXRleElEQXJyID0gbUluZGV4TGlzdDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgb25MYXRlVXBkYXRlKCl7XHJcbiAgICAgICAgaWYodGhpcy5vd25lcjNELnRyYW5zZm9ybS5sb2NhbFNjYWxlLng9PTAgJiYgdGhpcy5vd25lcjNELnRyYW5zZm9ybS5sb2NhbFNjYWxlLnk9PTAgJiYgdGhpcy5vd25lcjNELnRyYW5zZm9ybS5sb2NhbFNjYWxlLno9PTApcmV0dXJuO1xyXG4gICAgICAgIGlmKHRoaXMuX2FuaXIuc3BlZWQ9PTApcmV0dXJuO1xyXG4gICAgICAgIHZhciBwbGF5U3RhdGU9dGhpcy5fYW5pci5nZXRDdXJyZW50QW5pbWF0b3JQbGF5U3RhdGUoKTtcclxuICAgICAgICBpZihwbGF5U3RhdGUuX2ZpbmlzaClyZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnIubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyW2ldO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpdGVtLlZldGV4SURBcnIubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhJRCA9IGl0ZW0uVmV0ZXhJREFycltqXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zPSBpdGVtLlRyYW5zZm9ybUluZm8ubG9jYWxQb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyW3ZlcnRleElEXSA9IHBvcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdmVydGV4c19zZXRQb3NpdGlvbnModGhpcy5fdmVydGV4QnVmZmVycyx0aGlzLl9tQ2FjaGVWZXJ0aWNlc0Fycik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgX3ZlcnRleHNfZ2V0UG9zaXRpb25zKHZlcnRleEJ1ZmZlcnMpe1xyXG5cdFx0dmFyIHZlcnRpY2VzPVtdO1xyXG5cdFx0dmFyIGk9MCxqPTAsdmVydGV4QnVmZmVyLHBvc2l0aW9uRWxlbWVudCx2ZXJ0ZXhFbGVtZW50cyx2ZXJ0ZXhFbGVtZW50LG9mc2V0PTAsdmVydGljZXNEYXRhO1xyXG5cdFx0dmFyIHZlcnRleEJ1ZmZlckNvdW50PXZlcnRleEJ1ZmZlcnMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpPTA7aSA8IHZlcnRleEJ1ZmZlckNvdW50O2krKyl7XHJcblx0XHRcdHZlcnRleEJ1ZmZlcj12ZXJ0ZXhCdWZmZXJzW2ldO1xyXG5cdFx0XHR2ZXJ0ZXhFbGVtZW50cz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4RWxlbWVudHM7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0ZXhFbGVtZW50cy5sZW5ndGg7aisrKXtcclxuXHRcdFx0XHR2ZXJ0ZXhFbGVtZW50PXZlcnRleEVsZW1lbnRzW2pdO1xyXG5cdFx0XHRcdGlmICh2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRGb3JtYXQ9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4RWxlbWVudEZvcm1hdC5WZWN0b3IzKi9cInZlY3RvcjNcIiAmJiB2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRVc2FnZT09PS8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1BPU0lUSU9OMCovMCl7XHJcblx0XHRcdFx0XHRwb3NpdGlvbkVsZW1lbnQ9dmVydGV4RWxlbWVudDtcclxuXHRcdFx0XHRcdGJyZWFrIDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dmVydGljZXNEYXRhPXZlcnRleEJ1ZmZlci5nZXREYXRhKCk7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0aWNlc0RhdGEubGVuZ3RoO2orPXZlcnRleEJ1ZmZlci52ZXJ0ZXhEZWNsYXJhdGlvbi52ZXJ0ZXhTdHJpZGUgLyA0KXtcclxuXHRcdFx0XHRvZnNldD1qK3Bvc2l0aW9uRWxlbWVudC5vZmZzZXQgLyA0O1xyXG5cdFx0XHRcdHZlcnRpY2VzLnB1c2gobmV3IExheWEuVmVjdG9yMyh2ZXJ0aWNlc0RhdGFbb2ZzZXQrMF0sdmVydGljZXNEYXRhW29mc2V0KzFdLHZlcnRpY2VzRGF0YVtvZnNldCsyXSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdmVydGljZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIF92ZXJ0ZXhzX3NldFBvc2l0aW9ucyh2ZXJ0ZXhCdWZmZXJzLHZlcnRpY2VzKXtcclxuXHRcdHZhciBpPTAsaj0wLHZlcnRleEJ1ZmZlcixwb3NpdGlvbkVsZW1lbnQsdmVydGV4RWxlbWVudHMsdmVydGV4RWxlbWVudCxvZnNldD0wLHZlcnRpY2VzRGF0YSx2ZXJ0aWNlO1xyXG5cdFx0dmFyIHZlcnRleEJ1ZmZlckNvdW50PXZlcnRleEJ1ZmZlcnMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpPTA7aSA8IHZlcnRleEJ1ZmZlckNvdW50O2krKyl7XHJcblx0XHRcdHZlcnRleEJ1ZmZlcj12ZXJ0ZXhCdWZmZXJzW2ldO1xyXG5cdFx0XHR2ZXJ0ZXhFbGVtZW50cz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4RWxlbWVudHM7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0ZXhFbGVtZW50cy5sZW5ndGg7aisrKXtcclxuXHRcdFx0XHR2ZXJ0ZXhFbGVtZW50PXZlcnRleEVsZW1lbnRzW2pdO1xyXG5cdFx0XHRcdGlmICh2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRGb3JtYXQ9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4RWxlbWVudEZvcm1hdC5WZWN0b3IzKi9cInZlY3RvcjNcIiAmJiB2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRVc2FnZT09PS8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1BPU0lUSU9OMCovMCl7XHJcblx0XHRcdFx0XHRwb3NpdGlvbkVsZW1lbnQ9dmVydGV4RWxlbWVudDtcclxuXHRcdFx0XHRcdGJyZWFrIDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuICAgICAgICAgICAgdmVydGljZXNEYXRhPXZlcnRleEJ1ZmZlci5nZXREYXRhKCk7XHJcbiAgICAgICAgICAgIHZhciBuPTA7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0aWNlc0RhdGEubGVuZ3RoO2orPXZlcnRleEJ1ZmZlci52ZXJ0ZXhEZWNsYXJhdGlvbi52ZXJ0ZXhTdHJpZGUgLyA0KXtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2U9dmVydGljZXNbbl07XHJcbiAgICAgICAgICAgICAgICBvZnNldD1qK3Bvc2l0aW9uRWxlbWVudC5vZmZzZXQgLyA0O1xyXG4gICAgICAgICAgICAgICAgdmVydGljZXNEYXRhW29mc2V0KzBdPXZlcnRpY2UueDtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzRGF0YVtvZnNldCsxXT12ZXJ0aWNlLnk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlc0RhdGFbb2ZzZXQrMl09dmVydGljZS56O1xyXG4gICAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZlcnRleEJ1ZmZlci5zZXREYXRhKHZlcnRpY2VzRGF0YSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgb25HZXRXb3JsZFBvcyh0YXJnZXQscG9zKXtcclxuICAgICAgICB2YXIgb3V0UG9zPW5ldyBMYXlhLlZlY3RvcjMoKTtcclxuICAgICAgICBpZiAodGFyZ2V0Ll9wYXJlbnQgIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIHBhcmVudFBvc2l0aW9uPXRhcmdldC5wYXJlbnQudHJhbnNmb3JtLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBMYXlhLlZlY3RvcjMubXVsdGlwbHkocG9zLHRhcmdldC5wYXJlbnQudHJhbnNmb3JtLnNjYWxlLExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdKTtcclxuICAgICAgICAgICAgTGF5YS5WZWN0b3IzLnRyYW5zZm9ybVF1YXQoTGF5YS5UcmFuc2Zvcm0zRFtcIl90ZW1wVmVjdG9yMzBcIl0sdGFyZ2V0LnBhcmVudC50cmFuc2Zvcm0ucm90YXRpb24sTGF5YS5UcmFuc2Zvcm0zRFtcIl90ZW1wVmVjdG9yMzBcIl0pO1xyXG4gICAgICAgICAgICBMYXlhLlZlY3RvcjMuYWRkKHBhcmVudFBvc2l0aW9uLExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdLG91dFBvcyk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBwb3MuY2xvbmVUbyhvdXRQb3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0UG9zO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFdFYXNlVHlwZSB9IGZyb20gXCIuL1dFYXNlVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdFYXNlTWFuYWdlciB7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX1BpT3ZlcjI6IG51bWJlciA9IE1hdGguUEkgKiAwLjU7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX1R3b1BpOiBudW1iZXIgPSBNYXRoLlBJICogMjtcclxuXHJcblx0cHVibGljIHN0YXRpYyBldmFsdWF0ZShlYXNlVHlwZTogbnVtYmVyLCB0aW1lOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIsIG92ZXJzaG9vdE9yQW1wbGl0dWRlOiBudW1iZXIsIHBlcmlvZDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdHN3aXRjaCAoZWFzZVR5cGUpIHtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuTGluZWFyOlxyXG5cdFx0XHRcdHJldHVybiB0aW1lIC8gZHVyYXRpb247XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlNpbmVJbjpcclxuXHRcdFx0XHRyZXR1cm4gLU1hdGguY29zKHRpbWUgLyBkdXJhdGlvbiAqIFdFYXNlTWFuYWdlci5fUGlPdmVyMikgKyAxO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5TaW5lT3V0OlxyXG5cdFx0XHRcdHJldHVybiBNYXRoLnNpbih0aW1lIC8gZHVyYXRpb24gKiBXRWFzZU1hbmFnZXIuX1BpT3ZlcjIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5TaW5lSW5PdXQ6XHJcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHRpbWUgLyBkdXJhdGlvbikgLSAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhZEluOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFkT3V0OlxyXG5cdFx0XHRcdHJldHVybiAtKHRpbWUgLz0gZHVyYXRpb24pICogKHRpbWUgLSAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhZEluT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoKC0tdGltZSkgKiAodGltZSAtIDIpIC0gMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkN1YmljSW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DdWJpY091dDpcclxuXHRcdFx0XHRyZXR1cm4gKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogdGltZSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DdWJpY0luT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRcdHJldHVybiAwLjUgKiAoKHRpbWUgLT0gMikgKiB0aW1lICogdGltZSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFydEluOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YXJ0T3V0OlxyXG5cdFx0XHRcdHJldHVybiAtKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogdGltZSAqIHRpbWUgLSAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhcnRJbk91dDpcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoKHRpbWUgLT0gMikgKiB0aW1lICogdGltZSAqIHRpbWUgLSAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVpbnRJbjpcclxuXHRcdFx0XHRyZXR1cm4gKHRpbWUgLz0gZHVyYXRpb24pICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVpbnRPdXQ6XHJcblx0XHRcdFx0cmV0dXJuICgodGltZSA9IHRpbWUgLyBkdXJhdGlvbiAtIDEpICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWludEluT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWUgKyAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRXhwb0luOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSA9PSAwKSA/IDAgOiBNYXRoLnBvdygyLCAxMCAqICh0aW1lIC8gZHVyYXRpb24gLSAxKSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkV4cG9PdXQ6XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gZHVyYXRpb24pIHJldHVybiAxO1xyXG5cdFx0XHRcdHJldHVybiAoLU1hdGgucG93KDIsIC0xMCAqIHRpbWUgLyBkdXJhdGlvbikgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRXhwb0luT3V0OlxyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IGR1cmF0aW9uKSByZXR1cm4gMTtcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqIE1hdGgucG93KDIsIDEwICogKHRpbWUgLSAxKSk7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgtTWF0aC5wb3coMiwgLTEwICogLS10aW1lKSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DaXJjSW46XHJcblx0XHRcdFx0cmV0dXJuIC0oTWF0aC5zcXJ0KDEgLSAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lKSAtIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DaXJjT3V0OlxyXG5cdFx0XHRcdHJldHVybiBNYXRoLnNxcnQoMSAtICh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQ2lyY0luT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHRpbWUgKiB0aW1lKSAtIDEpO1xyXG5cdFx0XHRcdHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAodGltZSAtPSAyKSAqIHRpbWUpICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkVsYXN0aWNJbjpcclxuXHRcdFx0XHR2YXIgczA6IG51bWJlcjtcclxuXHRcdFx0XHRpZiAodGltZSA9PSAwKSByZXR1cm4gMDtcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24pID09IDEpIHJldHVybiAxO1xyXG5cdFx0XHRcdGlmIChwZXJpb2QgPT0gMCkgcGVyaW9kID0gZHVyYXRpb24gKiAwLjM7XHJcblx0XHRcdFx0aWYgKG92ZXJzaG9vdE9yQW1wbGl0dWRlIDwgMSkge1xyXG5cdFx0XHRcdFx0b3ZlcnNob290T3JBbXBsaXR1ZGUgPSAxO1xyXG5cdFx0XHRcdFx0czAgPSBwZXJpb2QgLyA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHMwID0gcGVyaW9kIC8gV0Vhc2VNYW5hZ2VyLl9Ud29QaSAqIE1hdGguYXNpbigxIC8gb3ZlcnNob290T3JBbXBsaXR1ZGUpO1xyXG5cdFx0XHRcdHJldHVybiAtKG92ZXJzaG9vdE9yQW1wbGl0dWRlICogTWF0aC5wb3coMiwgMTAgKiAodGltZSAtPSAxKSkgKiBNYXRoLnNpbigodGltZSAqIGR1cmF0aW9uIC0gczApICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FbGFzdGljT3V0OlxyXG5cdFx0XHRcdHZhciBzMTogbnVtYmVyO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbikgPT0gMSkgcmV0dXJuIDE7XHJcblx0XHRcdFx0aWYgKHBlcmlvZCA9PSAwKSBwZXJpb2QgPSBkdXJhdGlvbiAqIDAuMztcclxuXHRcdFx0XHRpZiAob3ZlcnNob290T3JBbXBsaXR1ZGUgPCAxKSB7XHJcblx0XHRcdFx0XHRvdmVyc2hvb3RPckFtcGxpdHVkZSA9IDE7XHJcblx0XHRcdFx0XHRzMSA9IHBlcmlvZCAvIDQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgczEgPSBwZXJpb2QgLyBXRWFzZU1hbmFnZXIuX1R3b1BpICogTWF0aC5hc2luKDEgLyBvdmVyc2hvb3RPckFtcGxpdHVkZSk7XHJcblx0XHRcdFx0cmV0dXJuIChvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIC0xMCAqIHRpbWUpICogTWF0aC5zaW4oKHRpbWUgKiBkdXJhdGlvbiAtIHMxKSAqIFdFYXNlTWFuYWdlci5fVHdvUGkgLyBwZXJpb2QpICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkVsYXN0aWNJbk91dDpcclxuXHRcdFx0XHR2YXIgczogbnVtYmVyO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPT0gMikgcmV0dXJuIDE7XHJcblx0XHRcdFx0aWYgKHBlcmlvZCA9PSAwKSBwZXJpb2QgPSBkdXJhdGlvbiAqICgwLjMgKiAxLjUpO1xyXG5cdFx0XHRcdGlmIChvdmVyc2hvb3RPckFtcGxpdHVkZSA8IDEpIHtcclxuXHRcdFx0XHRcdG92ZXJzaG9vdE9yQW1wbGl0dWRlID0gMTtcclxuXHRcdFx0XHRcdHMgPSBwZXJpb2QgLyA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHMgPSBwZXJpb2QgLyBXRWFzZU1hbmFnZXIuX1R3b1BpICogTWF0aC5hc2luKDEgLyBvdmVyc2hvb3RPckFtcGxpdHVkZSk7XHJcblx0XHRcdFx0aWYgKHRpbWUgPCAxKSByZXR1cm4gLTAuNSAqIChvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIDEwICogKHRpbWUgLT0gMSkpICogTWF0aC5zaW4oKHRpbWUgKiBkdXJhdGlvbiAtIHMpICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkpO1xyXG5cdFx0XHRcdHJldHVybiBvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIC0xMCAqICh0aW1lIC09IDEpKSAqIE1hdGguc2luKCh0aW1lICogZHVyYXRpb24gLSBzKSAqIFdFYXNlTWFuYWdlci5fVHdvUGkgLyBwZXJpb2QpICogMC41ICsgMTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQmFja0luOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lICogKChvdmVyc2hvb3RPckFtcGxpdHVkZSArIDEpICogdGltZSAtIG92ZXJzaG9vdE9yQW1wbGl0dWRlKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQmFja091dDpcclxuXHRcdFx0XHRyZXR1cm4gKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogKChvdmVyc2hvb3RPckFtcGxpdHVkZSArIDEpICogdGltZSArIG92ZXJzaG9vdE9yQW1wbGl0dWRlKSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5CYWNrSW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiAodGltZSAqIHRpbWUgKiAoKChvdmVyc2hvb3RPckFtcGxpdHVkZSAqPSAoMS41MjUpKSArIDEpICogdGltZSAtIG92ZXJzaG9vdE9yQW1wbGl0dWRlKSk7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiAoKChvdmVyc2hvb3RPckFtcGxpdHVkZSAqPSAoMS41MjUpKSArIDEpICogdGltZSArIG92ZXJzaG9vdE9yQW1wbGl0dWRlKSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5Cb3VuY2VJbjpcclxuXHRcdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VJbih0aW1lLCBkdXJhdGlvbik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJvdW5jZU91dDpcclxuXHRcdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VPdXQodGltZSwgZHVyYXRpb24pO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5Cb3VuY2VJbk91dDpcclxuXHRcdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VJbk91dCh0aW1lLCBkdXJhdGlvbik7XHJcblxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHJldHVybiAtKHRpbWUgLz0gZHVyYXRpb24pICogKHRpbWUgLSAyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxufVxyXG5cclxuLy8vIFRoaXMgY2xhc3MgY29udGFpbnMgYSBDIyBwb3J0IG9mIHRoZSBlYXNpbmcgZXF1YXRpb25zIGNyZWF0ZWQgYnkgUm9iZXJ0IFBlbm5lciAoaHR0cDovL3JvYmVydHBlbm5lci5jb20vZWFzaW5nKS5cclxuZXhwb3J0IGNsYXNzIEJvdW5jZSB7XHJcblx0cHVibGljIHN0YXRpYyBlYXNlSW4odGltZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiAxIC0gQm91bmNlLmVhc2VPdXQoZHVyYXRpb24gLSB0aW1lLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGVhc2VPdXQodGltZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdGlmICgodGltZSAvPSBkdXJhdGlvbikgPCAoMSAvIDIuNzUpKSB7XHJcblx0XHRcdHJldHVybiAoNy41NjI1ICogdGltZSAqIHRpbWUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRpbWUgPCAoMiAvIDIuNzUpKSB7XHJcblx0XHRcdHJldHVybiAoNy41NjI1ICogKHRpbWUgLT0gKDEuNSAvIDIuNzUpKSAqIHRpbWUgKyAwLjc1KTtcclxuXHRcdH1cclxuXHRcdGlmICh0aW1lIDwgKDIuNSAvIDIuNzUpKSB7XHJcblx0XHRcdHJldHVybiAoNy41NjI1ICogKHRpbWUgLT0gKDIuMjUgLyAyLjc1KSkgKiB0aW1lICsgMC45Mzc1KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAoNy41NjI1ICogKHRpbWUgLT0gKDIuNjI1IC8gMi43NSkpICogdGltZSArIDAuOTg0Mzc1KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZWFzZUluT3V0KHRpbWU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRpZiAodGltZSA8IGR1cmF0aW9uICogMC41KSB7XHJcblx0XHRcdHJldHVybiBCb3VuY2UuZWFzZUluKHRpbWUgKiAyLCBkdXJhdGlvbikgKiAwLjU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gQm91bmNlLmVhc2VPdXQodGltZSAqIDIgLSBkdXJhdGlvbiwgZHVyYXRpb24pICogMC41ICsgMC41O1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBXRWFzZVR5cGUge1xyXG5cdHB1YmxpYyBzdGF0aWMgTGluZWFyOiBudW1iZXIgPSAwO1xyXG5cdHB1YmxpYyBzdGF0aWMgU2luZUluOiBudW1iZXIgPSAxO1xyXG5cdHB1YmxpYyBzdGF0aWMgU2luZU91dDogbnVtYmVyID0gMjtcclxuXHRwdWJsaWMgc3RhdGljIFNpbmVJbk91dDogbnVtYmVyID0gMztcclxuXHRwdWJsaWMgc3RhdGljIFF1YWRJbjogbnVtYmVyID0gNDtcclxuXHRwdWJsaWMgc3RhdGljIFF1YWRPdXQ6IG51bWJlciA9IDU7XHJcblx0cHVibGljIHN0YXRpYyBRdWFkSW5PdXQ6IG51bWJlciA9IDY7XHJcblx0cHVibGljIHN0YXRpYyBDdWJpY0luOiBudW1iZXIgPSA3O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ3ViaWNPdXQ6IG51bWJlciA9IDg7XHJcblx0cHVibGljIHN0YXRpYyBDdWJpY0luT3V0OiBudW1iZXIgPSA5O1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhcnRJbjogbnVtYmVyID0gMTA7XHJcblx0cHVibGljIHN0YXRpYyBRdWFydE91dDogbnVtYmVyID0gMTE7XHJcblx0cHVibGljIHN0YXRpYyBRdWFydEluT3V0OiBudW1iZXIgPSAxMjtcclxuXHRwdWJsaWMgc3RhdGljIFF1aW50SW46IG51bWJlciA9IDEzO1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVpbnRPdXQ6IG51bWJlciA9IDE0O1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVpbnRJbk91dDogbnVtYmVyID0gMTU7XHJcblx0cHVibGljIHN0YXRpYyBFeHBvSW46IG51bWJlciA9IDE2O1xyXG5cdHB1YmxpYyBzdGF0aWMgRXhwb091dDogbnVtYmVyID0gMTc7XHJcblx0cHVibGljIHN0YXRpYyBFeHBvSW5PdXQ6IG51bWJlciA9IDE4O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ2lyY0luOiBudW1iZXIgPSAxOTtcclxuXHRwdWJsaWMgc3RhdGljIENpcmNPdXQ6IG51bWJlciA9IDIwO1xyXG5cdHB1YmxpYyBzdGF0aWMgQ2lyY0luT3V0OiBudW1iZXIgPSAyMTtcclxuXHRwdWJsaWMgc3RhdGljIEVsYXN0aWNJbjogbnVtYmVyID0gMjI7XHJcblx0cHVibGljIHN0YXRpYyBFbGFzdGljT3V0OiBudW1iZXIgPSAyMztcclxuXHRwdWJsaWMgc3RhdGljIEVsYXN0aWNJbk91dDogbnVtYmVyID0gMjQ7XHJcblx0cHVibGljIHN0YXRpYyBCYWNrSW46IG51bWJlciA9IDI1O1xyXG5cdHB1YmxpYyBzdGF0aWMgQmFja091dDogbnVtYmVyID0gMjY7XHJcblx0cHVibGljIHN0YXRpYyBCYWNrSW5PdXQ6IG51bWJlciA9IDI3O1xyXG5cdHB1YmxpYyBzdGF0aWMgQm91bmNlSW46IG51bWJlciA9IDI4O1xyXG5cdHB1YmxpYyBzdGF0aWMgQm91bmNlT3V0OiBudW1iZXIgPSAyOTtcclxuXHRwdWJsaWMgc3RhdGljIEJvdW5jZUluT3V0OiBudW1iZXIgPSAzMDtcclxuXHRwdWJsaWMgc3RhdGljIEN1c3RvbTogbnVtYmVyID0gMzE7XHJcbn0iLCJpbXBvcnQgeyBXVHdlZW5lciB9IGZyb20gXCIuL1dUd2VlbmVyXCI7XHJcbmltcG9ydCB7IFdUd2Vlbk1hbmFnZXIgfSBmcm9tIFwiLi9XVHdlZW5NYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV1R3ZWVuIHtcclxuXHRwdWJsaWMgc3RhdGljIGNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcblx0cHVibGljIHN0YXRpYyB0byhzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3RvKHN0YXJ0LCBlbmQsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgdG8yKHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG8yKHN0YXJ0LCBzdGFydDIsIGVuZCwgZW5kMiwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB0bzMoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIHN0YXJ0MzogbnVtYmVyLFxyXG5cdFx0ZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZW5kMzogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG8zKHN0YXJ0LCBzdGFydDIsIHN0YXJ0MywgZW5kLCBlbmQyLCBlbmQzLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvNChzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgc3RhcnQzOiBudW1iZXIsIHN0YXJ0NDogbnVtYmVyLFxyXG5cdFx0ZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZW5kMzogbnVtYmVyLCBlbmQ0OiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90bzQoc3RhcnQsIHN0YXJ0Miwgc3RhcnQzLCBzdGFydDQsIGVuZCwgZW5kMiwgZW5kMywgZW5kNCwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB0b0NvbG9yKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG9Db2xvcihzdGFydCwgZW5kLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGRlbGF5ZWRDYWxsKGRlbGF5OiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLnNldERlbGF5KGRlbGF5KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgc2hha2Uoc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBhbXBsaXR1ZGU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3NoYWtlKHN0YXJ0WCwgc3RhcnRZLCBhbXBsaXR1ZGUsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgaXNUd2VlbmluZyh0YXJnZXQ6IE9iamVjdCwgcHJvcFR5cGU6IE9iamVjdCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuaXNUd2VlbmluZyh0YXJnZXQsIHByb3BUeXBlKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMga2lsbCh0YXJnZXQ6IE9iamVjdCwgY29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZSwgcHJvcFR5cGU6IE9iamVjdCA9IG51bGwpOiB2b2lkIHtcclxuXHRcdFdUd2Vlbk1hbmFnZXIua2lsbFR3ZWVucyh0YXJnZXQsIGZhbHNlLCBudWxsKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0VHdlZW4odGFyZ2V0OiBPYmplY3QsIHByb3BUeXBlOiBPYmplY3QgPSBudWxsKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuZ2V0VHdlZW4odGFyZ2V0LCBwcm9wVHlwZSk7XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBXVHdlZW5lciB9IGZyb20gXCIuL1dUd2VlbmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV1R3ZWVuTWFuYWdlciB7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX2FjdGl2ZVR3ZWVuczogYW55W10gPSBuZXcgQXJyYXkoMzApO1xyXG5cdHByaXZhdGUgc3RhdGljIF90d2VlbmVyUG9vbDogV1R3ZWVuZXJbXSA9IFtdO1xyXG5cdHByaXZhdGUgc3RhdGljIF90b3RhbEFjdGl2ZVR3ZWVuczogbnVtYmVyID0gMDtcclxuXHRwcml2YXRlIHN0YXRpYyBfaW5pdGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgY3JlYXRlVHdlZW4oKTogV1R3ZWVuZXIge1xyXG5cdFx0aWYgKCFXVHdlZW5NYW5hZ2VyLl9pbml0ZWQpIHtcclxuXHRcdFx0TGF5YS50aW1lci5mcmFtZUxvb3AoMSwgbnVsbCwgdGhpcy51cGRhdGUpO1xyXG5cdFx0XHRXVHdlZW5NYW5hZ2VyLl9pbml0ZWQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lcjtcclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3R3ZWVuZXJQb29sLmxlbmd0aDtcclxuXHRcdGlmIChjbnQgPiAwKSB7XHJcblx0XHRcdHR3ZWVuZXIgPSBXVHdlZW5NYW5hZ2VyLl90d2VlbmVyUG9vbC5wb3AoKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0dHdlZW5lciA9IG5ldyBXVHdlZW5lcigpO1xyXG5cdFx0dHdlZW5lci5faW5pdCgpO1xyXG5cdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW1dUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zKytdID0gdHdlZW5lcjtcclxuXHJcblx0XHRpZiAoV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMgPT0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aClcclxuXHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aCA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVucy5sZW5ndGggKyBNYXRoLmNlaWwoV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aCAqIDAuNSk7XHJcblxyXG5cdFx0cmV0dXJuIHR3ZWVuZXI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGlzVHdlZW5pbmcodGFyZ2V0OiBhbnksIHByb3BUeXBlOiBhbnkpOiBib29sZWFuIHtcclxuXHRcdGlmICh0YXJnZXQgPT0gbnVsbClcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHZhciBhbnlUeXBlOiBib29sZWFuID0gcHJvcFR5cGUgPT0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVuczsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgIT0gbnVsbCAmJiB0d2VlbmVyLnRhcmdldCA9PSB0YXJnZXQgJiYgIXR3ZWVuZXIuX2tpbGxlZFxyXG5cdFx0XHRcdCYmIChhbnlUeXBlIHx8IHR3ZWVuZXIuX3Byb3BUeXBlID09IHByb3BUeXBlKSlcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGtpbGxUd2VlbnModGFyZ2V0OiBhbnksIGNvbXBsZXRlZDogYm9vbGVhbj1mYWxzZSwgcHJvcFR5cGU6IGFueSA9bnVsbCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0dmFyIGZsYWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zO1xyXG5cdFx0dmFyIGFueVR5cGU6IGJvb2xlYW4gPSBwcm9wVHlwZSA9PSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgIT0gbnVsbCAmJiB0d2VlbmVyLnRhcmdldCA9PSB0YXJnZXQgJiYgIXR3ZWVuZXIuX2tpbGxlZFxyXG5cdFx0XHRcdCYmIChhbnlUeXBlIHx8IHR3ZWVuZXIuX3Byb3BUeXBlID09IHByb3BUeXBlKSkge1xyXG5cdFx0XHRcdHR3ZWVuZXIua2lsbChjb21wbGV0ZWQpO1xyXG5cdFx0XHRcdGZsYWcgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZsYWc7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGdldFR3ZWVuKHRhcmdldDogYW55LCBwcm9wVHlwZTogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHR2YXIgY250OiBudW1iZXIgPSBXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucztcclxuXHRcdHZhciBhbnlUeXBlOiBib29sZWFuID0gcHJvcFR5cGUgPT0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBjbnQ7IGkrKykge1xyXG5cdFx0XHR2YXIgdHdlZW5lcjogV1R3ZWVuZXIgPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV07XHJcblx0XHRcdGlmICh0d2VlbmVyICE9IG51bGwgJiYgdHdlZW5lci50YXJnZXQgPT0gdGFyZ2V0ICYmICF0d2VlbmVyLl9raWxsZWRcclxuXHRcdFx0XHQmJiAoYW55VHlwZSB8fCB0d2VlbmVyLl9wcm9wVHlwZSA9PSBwcm9wVHlwZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHdlZW5lcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB1cGRhdGUoKTogdm9pZCB7XHJcblx0XHR2YXIgZHQ6IG51bWJlciA9IExheWEudGltZXIuZGVsdGEgLyAxMDAwO1xyXG5cclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zO1xyXG5cdFx0dmFyIGZyZWVQb3NTdGFydDogbnVtYmVyID0gLTE7XHJcblx0XHR2YXIgZnJlZVBvc0NvdW50OiBudW1iZXIgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChmcmVlUG9zU3RhcnQgPT0gLTEpXHJcblx0XHRcdFx0XHRmcmVlUG9zU3RhcnQgPSBpO1xyXG5cdFx0XHRcdGZyZWVQb3NDb3VudCsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHR3ZWVuZXIuX2tpbGxlZCkge1xyXG5cdFx0XHRcdHR3ZWVuZXIuX3Jlc2V0KCk7XHJcblx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fdHdlZW5lclBvb2wucHVzaCh0d2VlbmVyKTtcclxuXHRcdFx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV0gPSBudWxsO1xyXG5cclxuXHRcdFx0XHRpZiAoZnJlZVBvc1N0YXJ0ID09IC0xKVxyXG5cdFx0XHRcdFx0ZnJlZVBvc1N0YXJ0ID0gaTtcclxuXHRcdFx0XHRmcmVlUG9zQ291bnQrKztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpZiAoIXR3ZWVuZXIuX3BhdXNlZClcclxuXHRcdFx0XHRcdHR3ZWVuZXIuX3VwZGF0ZShkdCk7XHJcblxyXG5cdFx0XHRcdGlmIChmcmVlUG9zU3RhcnQgIT0gLTEpIHtcclxuXHRcdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tmcmVlUG9zU3RhcnRdID0gdHdlZW5lcjtcclxuXHRcdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXSA9IG51bGw7XHJcblx0XHRcdFx0XHRmcmVlUG9zU3RhcnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZnJlZVBvc1N0YXJ0ID49IDApIHtcclxuXHRcdFx0aWYgKFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zICE9IGNudCkgLy9uZXcgdHdlZW5zIGFkZGVkXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgajogbnVtYmVyID0gY250O1xyXG5cdFx0XHRcdGNudCA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zIC0gY250O1xyXG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjbnQ7IGkrKylcclxuXHRcdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tmcmVlUG9zU3RhcnQrK10gPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaisrXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucyA9IGZyZWVQb3NTdGFydDtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgV1R3ZWVuVmFsdWUge1xyXG5cdHB1YmxpYyB4OiBudW1iZXI7XHJcblx0cHVibGljIHk6IG51bWJlcjtcclxuXHRwdWJsaWMgejogbnVtYmVyO1xyXG5cdHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gdGhpcy53ID0gMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgY29sb3IoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiAodGhpcy53IDw8IDI0KSArICh0aGlzLnggPDwgMTYpICsgKHRoaXMueSA8PCA4KSArIHRoaXMuejtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgY29sb3IodmFsdWU6IG51bWJlcikge1xyXG5cdFx0dGhpcy54ID0gKHZhbHVlICYgMHhGRjAwMDApID4+IDE2O1xyXG5cdFx0dGhpcy55ID0gKHZhbHVlICYgMHgwMEZGMDApID4+IDg7XHJcblx0XHR0aGlzLnogPSAodmFsdWUgJiAweDAwMDBGRik7XHJcblx0XHR0aGlzLncgPSAodmFsdWUgJiAweEZGMDAwMDAwKSA+PiAyNDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRGaWVsZChpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdHN3aXRjaCAoaW5kZXgpIHtcclxuXHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLng7XHJcblx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy55O1xyXG5cdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuejtcclxuXHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLnc7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5kZXggb3V0IG9mIGJvdW5kczogXCIgKyBpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RmllbGQoaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0c3dpdGNoIChpbmRleCkge1xyXG5cdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0dGhpcy54ID0gdmFsdWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHR0aGlzLnkgPSB2YWx1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdHRoaXMueiA9IHZhbHVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0dGhpcy53ID0gdmFsdWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5kZXggb3V0IG9mIGJvdW5kczogXCIgKyBpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0WmVybygpOiB2b2lkIHtcclxuXHRcdHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IHRoaXMudyA9IDA7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgV1R3ZWVuVmFsdWUgfSBmcm9tIFwiLi9XVHdlZW5WYWx1ZVwiO1xyXG5pbXBvcnQgeyBXRWFzZVR5cGUgfSBmcm9tIFwiLi9XRWFzZVR5cGVcIjtcclxuaW1wb3J0IHsgV1R3ZWVuIH0gZnJvbSBcIi4vV1R3ZWVuXCI7XHJcbmltcG9ydCB7IFdFYXNlTWFuYWdlciB9IGZyb20gXCIuL1dFYXNlTWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdUd2VlbmVyIHtcclxuXHRwdWJsaWMgX3RhcmdldDogYW55O1xyXG5cdHB1YmxpYyBfcHJvcFR5cGU6IGFueTtcclxuXHRwdWJsaWMgX2tpbGxlZDogYm9vbGVhbjtcclxuXHRwdWJsaWMgX3BhdXNlZDogYm9vbGVhbjtcclxuXHJcblx0cHJpdmF0ZSBfZGVsYXk6IG51bWJlcjtcclxuXHRwcml2YXRlIF9kdXJhdGlvbjogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2JyZWFrcG9pbnQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF9lYXNlVHlwZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2Vhc2VPdmVyc2hvb3RPckFtcGxpdHVkZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2Vhc2VQZXJpb2Q6IG51bWJlcjtcclxuXHRwcml2YXRlIF9yZXBlYXQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF95b3lvOiBib29sZWFuO1xyXG5cdHByaXZhdGUgX3RpbWVTY2FsZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3NuYXBwaW5nOiBib29sZWFuO1xyXG5cdHByaXZhdGUgX3VzZXJEYXRhOiBhbnk7XHJcblxyXG5cdHByaXZhdGUgX29uVXBkYXRlOiBGdW5jdGlvbjtcclxuXHRwcml2YXRlIF9vblVwZGF0ZUNhbGxlcjogYW55O1xyXG5cdHByaXZhdGUgX29uU3RhcnQ6IEZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgX29uU3RhcnRDYWxsZXI6IGFueTtcclxuXHRwcml2YXRlIF9vbkNvbXBsZXRlOiBGdW5jdGlvbjtcclxuXHRwcml2YXRlIF9vbkNvbXBsZXRlQ2FsbGVyOiBhbnk7XHJcblxyXG5cdHByaXZhdGUgX3N0YXJ0VmFsdWU6IFdUd2VlblZhbHVlO1xyXG5cdHByaXZhdGUgX2VuZFZhbHVlOiBXVHdlZW5WYWx1ZTtcclxuXHRwcml2YXRlIF92YWx1ZTogV1R3ZWVuVmFsdWU7XHJcblx0cHJpdmF0ZSBfZGVsdGFWYWx1ZTogV1R3ZWVuVmFsdWU7XHJcblx0cHJpdmF0ZSBfdmFsdWVTaXplOiBudW1iZXI7XHJcblxyXG5cdHByaXZhdGUgX3N0YXJ0ZWQ6IGJvb2xlYW47XHJcblx0cHVibGljIF9lbmRlZDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2VsYXBzZWRUaW1lOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfbm9ybWFsaXplZFRpbWU6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlID0gbmV3IFdUd2VlblZhbHVlKCk7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZSA9IG5ldyBXVHdlZW5WYWx1ZSgpO1xyXG5cdFx0dGhpcy5fdmFsdWUgPSBuZXcgV1R3ZWVuVmFsdWUoKTtcclxuXHRcdHRoaXMuX2RlbHRhVmFsdWUgPSBuZXcgV1R3ZWVuVmFsdWUoKTtcclxuXHJcblx0XHR0aGlzLl9yZXNldCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldERlbGF5KHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9kZWxheSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGRlbGF5KCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGVsYXk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RHVyYXRpb24odmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZHVyYXRpb24oKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9kdXJhdGlvbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRCcmVha3BvaW50KHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9icmVha3BvaW50ID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRFYXNlKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9lYXNlVHlwZSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RWFzZVBlcmlvZCh2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fZWFzZVBlcmlvZCA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9lYXNlT3ZlcnNob290T3JBbXBsaXR1ZGUgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFJlcGVhdChyZXBlYXQ6IG51bWJlciwgeW95bzogYm9vbGVhbiA9IGZhbHNlKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fcmVwZWF0ID0gdGhpcy5yZXBlYXQ7XHJcblx0XHR0aGlzLl95b3lvID0geW95bztcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCByZXBlYXQoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9yZXBlYXQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0VGltZVNjYWxlKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl90aW1lU2NhbGUgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFNuYXBwaW5nKHZhbHVlOiBib29sZWFuKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fc25hcHBpbmcgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFRhcmdldCh2YWx1ZTogYW55LCBwcm9wVHlwZTogYW55ID0gbnVsbCk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3RhcmdldCA9IHRoaXMudmFsdWU7XHJcblx0XHR0aGlzLl9wcm9wVHlwZSA9IHByb3BUeXBlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHRhcmdldCgpOiBhbnkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3RhcmdldDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRVc2VyRGF0YSh2YWx1ZTogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdXNlckRhdGEgPSB0aGlzLnZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHVzZXJEYXRhKCk6IGFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdXNlckRhdGE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgb25VcGRhdGUoY2FsbGJhY2s6IEZ1bmN0aW9uLCBjYWxsZXI6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX29uVXBkYXRlID0gY2FsbGJhY2s7XHJcblx0XHR0aGlzLl9vblVwZGF0ZUNhbGxlciA9IGNhbGxlcjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uU3RhcnQoY2FsbGJhY2s6IEZ1bmN0aW9uLCBjYWxsZXI6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX29uU3RhcnQgPSBjYWxsYmFjaztcclxuXHRcdHRoaXMuX29uU3RhcnRDYWxsZXIgPSBjYWxsZXI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBvbkNvbXBsZXRlKGNhbGxiYWNrOiBGdW5jdGlvbiwgY2FsbGVyOiBhbnkpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9vbkNvbXBsZXRlID0gY2FsbGJhY2s7XHJcblx0XHR0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyID0gY2FsbGVyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHN0YXJ0VmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGVuZFZhbHVlKCk6IFdUd2VlblZhbHVlIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbmRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBkZWx0YVZhbHVlKCk6IFdUd2VlblZhbHVlIHtcclxuXHRcdHJldHVybiB0aGlzLl9kZWx0YVZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBub3JtYWxpemVkVGltZSgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25vcm1hbGl6ZWRUaW1lO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBjb21wbGV0ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZW5kZWQgIT0gMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgYWxsQ29tcGxldGVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VuZGVkID09IDE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0UGF1c2VkKHBhdXNlZDogYm9vbGVhbik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3BhdXNlZCA9IHBhdXNlZDtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIHRoaXMuc2VlayBwb3NpdGlvbiBvZiB0aGUgdHdlZW4sIGluIHNlY29uZHMuXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzZWVrKHRpbWU6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2tpbGxlZClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGltZTtcclxuXHRcdGlmICh0aGlzLl9lbGFwc2VkVGltZSA8IHRoaXMuX2RlbGF5KSB7XHJcblx0XHRcdGlmICh0aGlzLl9zdGFydGVkKVxyXG5cdFx0XHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGhpcy5fZGVsYXk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBraWxsKGNvbXBsZXRlOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9raWxsZWQpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRpZiAoY29tcGxldGUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2VuZGVkID09IDApIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fYnJlYWtwb2ludCA+PSAwKVxyXG5cdFx0XHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aGlzLl9kZWxheSArIHRoaXMuX2JyZWFrcG9pbnQ7XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5fcmVwZWF0ID49IDApXHJcblx0XHRcdFx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IHRoaXMuX2RlbGF5ICsgdGhpcy5fZHVyYXRpb24gKiAodGhpcy5fcmVwZWF0ICsgMSk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aGlzLl9kZWxheSArIHRoaXMuX2R1cmF0aW9uICogMjtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmNhbGxDb21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fa2lsbGVkID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG8oc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAxO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF90bzIoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAyO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnQyO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueSA9IGVuZDI7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvMyhzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgc3RhcnQzOiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAzO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnQyO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueSA9IGVuZDI7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnogPSBzdGFydDM7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS56ID0gZW5kMztcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG80KHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBzdGFydDM6IG51bWJlciwgc3RhcnQ0OiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGVuZDQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnggPSBlbmQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnkgPSBzdGFydDI7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS55ID0gZW5kMjtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueiA9IHN0YXJ0MztcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnogPSBlbmQzO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS53ID0gc3RhcnQ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUudyA9IGVuZDQ7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvQ29sb3Ioc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSA0O1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS5jb2xvciA9IHN0YXJ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUuY29sb3IgPSBlbmQ7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3NoYWtlKHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgYW1wbGl0dWRlOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSA1O1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnRYO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnRZO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS53ID0gYW1wbGl0dWRlO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHRoaXMuX2Vhc2VUeXBlID0gV0Vhc2VUeXBlLkxpbmVhcjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9pbml0KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fZGVsYXkgPSAwO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSAwO1xyXG5cdFx0dGhpcy5fYnJlYWtwb2ludCA9IC0xO1xyXG5cdFx0dGhpcy5fZWFzZVR5cGUgPSBXRWFzZVR5cGUuUXVhZE91dDtcclxuXHRcdHRoaXMuX3RpbWVTY2FsZSA9IDE7XHJcblx0XHR0aGlzLl9lYXNlUGVyaW9kID0gMDtcclxuXHRcdHRoaXMuX2Vhc2VPdmVyc2hvb3RPckFtcGxpdHVkZSA9IDEuNzAxNTg7XHJcblx0XHR0aGlzLl9zbmFwcGluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fcmVwZWF0ID0gMDtcclxuXHRcdHRoaXMuX3lveW8gPSBmYWxzZTtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDA7XHJcblx0XHR0aGlzLl9zdGFydGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLl9wYXVzZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuX2tpbGxlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xyXG5cdFx0dGhpcy5fbm9ybWFsaXplZFRpbWUgPSAwO1xyXG5cdFx0dGhpcy5fZW5kZWQgPSAwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9yZXNldCgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3RhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLl91c2VyRGF0YSA9IG51bGw7XHJcblx0XHR0aGlzLl9vblN0YXJ0ID0gdGhpcy5fb25VcGRhdGUgPSB0aGlzLl9vbkNvbXBsZXRlID0gbnVsbDtcclxuXHRcdHRoaXMuX29uU3RhcnRDYWxsZXIgPSB0aGlzLl9vblVwZGF0ZUNhbGxlciA9IHRoaXMuX29uQ29tcGxldGVDYWxsZXIgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF91cGRhdGUoZHQ6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX3RpbWVTY2FsZSAhPSAxKVxyXG5cdFx0XHRkdCAqPSB0aGlzLl90aW1lU2NhbGU7XHJcblx0XHRpZiAoZHQgPT0gMClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh0aGlzLl9lbmRlZCAhPSAwKSAvL01heWJlIHRoaXMuY29tcGxldGVkIGJ5IHRoaXMuc2Vla1xyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLmNhbGxDb21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHRcdHRoaXMuX2tpbGxlZCA9IHRydWU7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9lbGFwc2VkVGltZSArPSBkdDtcclxuXHRcdHRoaXMudXBkYXRlKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2VuZGVkICE9IDApIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9raWxsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmNhbGxDb21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHRcdFx0dGhpcy5fa2lsbGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHVwZGF0ZShkdD86IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYoZHQhPW51bGwpe1xyXG5cdFx0XHRpZiAodGhpcy5fdGltZVNjYWxlICE9IDEpXHJcblx0XHRcdFx0ZHQgKj0gdGhpcy5fdGltZVNjYWxlO1xyXG5cdFx0XHRpZiAoZHQgPT0gMClcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHR0aGlzLl9lbGFwc2VkVGltZSArPSBkdDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9lbmRlZCA9IDA7XHJcblx0XHR2YXIgX2R1cmF0aW9uPXRoaXMuX2R1cmF0aW9uO1xyXG5cdFx0aWYgKHRoaXMuX3ZhbHVlU2l6ZSA9PSAwKSAvL0RlbGF5ZWRDYWxsXHJcblx0XHR7XHJcblx0XHRcdGlmICh0aGlzLl9lbGFwc2VkVGltZSA+PSB0aGlzLl9kZWxheSArIF9kdXJhdGlvbilcclxuXHRcdFx0XHR0aGlzLl9lbmRlZCA9IDE7XHJcblxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9zdGFydGVkKSB7XHJcblx0XHRcdGlmICh0aGlzLl9lbGFwc2VkVGltZSA8IHRoaXMuX2RlbGF5KVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdHRoaXMuX3N0YXJ0ZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmNhbGxTdGFydENhbGxiYWNrKCk7XHJcblx0XHRcdGlmICh0aGlzLl9raWxsZWQpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciByZXZlcnNlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0dmFyIHR0OiBudW1iZXIgPSB0aGlzLl9lbGFwc2VkVGltZSAtIHRoaXMuX2RlbGF5O1xyXG5cdFx0aWYgKHRoaXMuX2JyZWFrcG9pbnQgPj0gMCAmJiB0dCA+PSB0aGlzLl9icmVha3BvaW50KSB7XHJcblx0XHRcdHR0ID0gdGhpcy5fYnJlYWtwb2ludDtcclxuXHRcdFx0dGhpcy5fZW5kZWQgPSAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9yZXBlYXQgIT0gMCkge1xyXG5cdFx0XHR2YXIgcm91bmQ6IG51bWJlciA9IE1hdGguZmxvb3IodHQgLyBfZHVyYXRpb24pO1xyXG5cdFx0XHR0dCAtPSBfZHVyYXRpb24gKiByb3VuZDtcclxuXHRcdFx0aWYgKHRoaXMuX3lveW8pXHJcblx0XHRcdFx0cmV2ZXJzZWQgPSByb3VuZCAlIDIgPT0gMTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9yZXBlYXQgPiAwICYmIHRoaXMuX3JlcGVhdCAtIHJvdW5kIDwgMCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLl95b3lvKVxyXG5cdFx0XHRcdFx0cmV2ZXJzZWQgPSB0aGlzLl9yZXBlYXQgJSAyID09IDE7XHJcblx0XHRcdFx0dHQgPSBfZHVyYXRpb247XHJcblx0XHRcdFx0dGhpcy5fZW5kZWQgPSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0dCA+PSBfZHVyYXRpb24pIHtcclxuXHRcdFx0dHQgPSBfZHVyYXRpb247XHJcblx0XHRcdHRoaXMuX2VuZGVkID0gMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9ub3JtYWxpemVkVGltZSA9IFdFYXNlTWFuYWdlci5ldmFsdWF0ZSh0aGlzLl9lYXNlVHlwZSwgcmV2ZXJzZWQgPyAoX2R1cmF0aW9uIC0gdHQpIDogdHQsIF9kdXJhdGlvbixcclxuXHRcdFx0dGhpcy5fZWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlLCB0aGlzLl9lYXNlUGVyaW9kKTtcclxuXHJcblx0XHR0aGlzLl92YWx1ZS5zZXRaZXJvKCk7XHJcblx0XHR0aGlzLl9kZWx0YVZhbHVlLnNldFplcm8oKTtcclxuXHJcblx0XHRpZiAodGhpcy5fdmFsdWVTaXplID09IDUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2VuZGVkID09IDApIHtcclxuXHRcdFx0XHR2YXIgcjogbnVtYmVyID0gdGhpcy5fc3RhcnRWYWx1ZS53ICogKDEgLSB0aGlzLl9ub3JtYWxpemVkVGltZSk7XHJcblx0XHRcdFx0dmFyIHJ4OiBudW1iZXIgPSAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIHI7XHJcblx0XHRcdFx0dmFyIHJ5OiBudW1iZXIgPSAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIHI7XHJcblx0XHRcdFx0cnggPSByeCA+IDAgPyBNYXRoLmNlaWwocngpIDogTWF0aC5mbG9vcihyeCk7XHJcblx0XHRcdFx0cnkgPSByeSA+IDAgPyBNYXRoLmNlaWwocnkpIDogTWF0aC5mbG9vcihyeSk7XHJcblxyXG5cdFx0XHRcdHRoaXMuX2RlbHRhVmFsdWUueCA9IHJ4O1xyXG5cdFx0XHRcdHRoaXMuX2RlbHRhVmFsdWUueSA9IHJ5O1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnggPSB0aGlzLl9zdGFydFZhbHVlLnggKyByeDtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS55ID0gdGhpcy5fc3RhcnRWYWx1ZS55ICsgcnk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUueCA9IHRoaXMuX3N0YXJ0VmFsdWUueDtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS55ID0gdGhpcy5fc3RhcnRWYWx1ZS55O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuX3ZhbHVlU2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0dmFyIG4xOiBudW1iZXIgPSB0aGlzLl9zdGFydFZhbHVlLmdldEZpZWxkKGkpO1xyXG5cdFx0XHRcdHZhciBuMjogbnVtYmVyID0gdGhpcy5fZW5kVmFsdWUuZ2V0RmllbGQoaSk7XHJcblx0XHRcdFx0dmFyIGY6IG51bWJlciA9IG4xICsgKG4yIC0gbjEpICogdGhpcy5fbm9ybWFsaXplZFRpbWU7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3NuYXBwaW5nKVxyXG5cdFx0XHRcdFx0ZiA9IE1hdGgucm91bmQoZik7XHJcblx0XHRcdFx0dGhpcy5fZGVsdGFWYWx1ZS5zZXRGaWVsZChpLCBmIC0gdGhpcy5fdmFsdWUuZ2V0RmllbGQoaSkpO1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnNldEZpZWxkKGksIGYpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3RhcmdldCAhPSBudWxsICYmIHRoaXMuX3Byb3BUeXBlICE9IG51bGwpIHtcclxuXHRcdFx0aWYgKHRoaXMuX3Byb3BUeXBlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHRoaXMuX3ZhbHVlU2l6ZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSwgdGhpcy5fdmFsdWUueik7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA0OlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSwgdGhpcy5fdmFsdWUueiwgdGhpcy5fdmFsdWUudyk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA1OlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUuY29sb3IpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNjpcclxuXHRcdFx0XHRcdFx0dGhpcy5fcHJvcFR5cGUuY2FsbCh0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnkpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGhpcy5fcHJvcFR5cGUgaW5zdGFuY2VvZiBMYXlhLkhhbmRsZXIpIHtcclxuXHRcdFx0XHR2YXIgYXJyPVtdO1xyXG5cdFx0XHRcdHN3aXRjaCAodGhpcy5fdmFsdWVTaXplKSB7XHJcblx0XHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDQ6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56LCB0aGlzLl92YWx1ZS53XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDU6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS5jb2xvcl07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA2OlxyXG5cdFx0XHRcdFx0XHRhcnI9W3RoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueV07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5ydW5XaXRoKGFycik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3ZhbHVlU2l6ZSA9PSA1KVxyXG5cdFx0XHRcdFx0dGhpcy5fdGFyZ2V0W3RoaXMuX3Byb3BUeXBlXSA9IHRoaXMuX3ZhbHVlLmNvbG9yO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHRoaXMuX3RhcmdldFt0aGlzLl9wcm9wVHlwZV0gPSB0aGlzLl92YWx1ZS54O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jYWxsVXBkYXRlQ2FsbGJhY2soKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY2FsbFN0YXJ0Q2FsbGJhY2soKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fb25TdGFydCAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChXVHdlZW4uY2F0Y2hDYWxsYmFja0V4Y2VwdGlvbnMpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dGhpcy5fb25TdGFydC5jYWxsKHRoaXMuX29uU3RhcnRDYWxsZXIsIHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkZhaXJ5R1VJOiBlcnJvciBpbiBzdGFydCBjYWxsYmFjayA+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhpcy5fb25TdGFydC5jYWxsKHRoaXMuX29uU3RhcnRDYWxsZXIsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjYWxsVXBkYXRlQ2FsbGJhY2soKSB7XHJcblx0XHRpZiAodGhpcy5fb25VcGRhdGUgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAoV1R3ZWVuLmNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXMuX29uVXBkYXRlLmNhbGwodGhpcy5fb25VcGRhdGVDYWxsZXIsIHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkZhaXJ5R1VJOiBlcnJvciBpbiB0aGlzLnVwZGF0ZSBjYWxsYmFjayA+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhpcy5fb25VcGRhdGUuY2FsbCh0aGlzLl9vblVwZGF0ZUNhbGxlciwgdGhpcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNhbGxDb21wbGV0ZUNhbGxiYWNrKCkge1xyXG5cdFx0aWYgKHRoaXMuX29uQ29tcGxldGUgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAoV1R3ZWVuLmNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXMuX29uQ29tcGxldGUuY2FsbCh0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyLCB0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJGYWlyeUdVSTogZXJyb3IgaW4gY29tcGxldGUgY2FsbGJhY2sgPiBcIiArIGVyci5tZXNzYWdlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRoaXMuX29uQ29tcGxldGUuY2FsbCh0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyLCB0aGlzKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCIvL3dteeeJiOacrF8yMDE4LzEyLzExLzE5O1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlVM2RJbXBvcnQge1xucHVibGljIHN0YXRpYyBUc19DNERWZXRleEFuaW1hdG9yPXJlcXVpcmUoJy4vdHMvVHNfQzREVmV0ZXhBbmltYXRvcicpWydkZWZhdWx0J107XG5wdWJsaWMgc3RhdGljIFRzX1NodT1yZXF1aXJlKCcuL3RzL1RzX1NodScpWydkZWZhdWx0J107XG5wdWJsaWMgc3RhdGljIFRzX0NhbWVyYUJveD1yZXF1aXJlKCcuL3RzL1RzX0NhbWVyYUJveCcpWydkZWZhdWx0J107XHJcbi8vXHJcbnB1YmxpYyBzdGF0aWMgV215QzREVmV0ZXhBbmltYXRvcj1yZXF1aXJlKCcuLi9fd215VXRpbHNINS9kMy9jNGQvV215QzREVmV0ZXhBbmltYXRvcicpWydkZWZhdWx0J107XHJcbi8vTGF5YVxyXG5wdWJsaWMgc3RhdGljIEFuaW1hdG9yPUxheWEuQW5pbWF0b3I7XHJcbi8vXHJcbnB1YmxpYyBzdGF0aWMgZ2V0Q2xhc3MobmFtZSl7XG4gICAgcmV0dXJuIHRoaXNbbmFtZV07XG59XHJcbn1cclxuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlVM2RUc0NvbmZpZyB7XG4gICAgcHVibGljIHN0YXRpYyB0c0NvbmZpZz1be1wiY190c1wiOlwiVHNfQ2FtZXJhQm94XCIsXCJ0YXJnZXRVcmxBcnJcIjpbXCJjYW1lcmFCb3hcIl19LHtcImNfdHNcIjpcIlRzX1NodVwiLFwidGFyZ2V0VXJsQXJyXCI6W1wic2h1XCJdfSx7XCJjX3RzXCI6XCJUc19DNERWZXRleEFuaW1hdG9yXCIsXCJ0YXJnZXRVcmxBcnJcIjpbXCJzY2VuZUJveC9ib3gvZnowMVwiXX1dO1xufVxuIiwiLy93bXnniYjmnKxfMjAxOC8xMi8xMi87XHJcbmltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSAnLi4vX3dteVV0aWxzSDUvZDMvV215U2NyaXB0M0QnO1xyXG5pbXBvcnQgV215VTNkVHNDb25maWcgZnJvbSAnLi9XbXlVM2RUc0NvbmZpZyc7XHJcbmltcG9ydCBXbXlVM2RJbXBvcnQgZnJvbSAnLi9XbXlVM2RJbXBvcnQnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlVM2RUc01hZyBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuICAgIHB1YmxpYyBvbkF3YWtlKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgV215VTNkVHNDb25maWcudHNDb25maWcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdHNPYmogPSBXbXlVM2RUc0NvbmZpZy50c0NvbmZpZ1tpXTtcclxuICAgICAgICAgICAgdGhpcy5hZGRUcyh0c09iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYWRkVHMoY29uZmlnT2JqKXtcclxuICAgICAgICBpZihjb25maWdPYmo9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBjX3RzPWNvbmZpZ09ialsnY190cyddO1xyXG4gICAgICAgIHZhciB0cz1XbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoY190cyk7XHJcbiAgICAgICAgdmFyIHRhcmdldFVybEFycjpzdHJpbmc9Y29uZmlnT2JqWyd0YXJnZXRVcmxBcnInXTtcclxuICAgICAgICBpZighdGFyZ2V0VXJsQXJyIHx8ICF0cylyZXR1cm47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXRVcmxBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0VXJsID0gdGFyZ2V0VXJsQXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0PVdteVUzZFRzTWFnLmdldE9iajNkVXJsKHRoaXMuc2NlbmUzRCx0YXJnZXRVcmwpO1xyXG4gICAgICAgICAgICBpZih0YXJnZXQhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmFkZENvbXBvbmVudCh0cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkVXJsKHRhcmdldCx1cmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgYXJyVXJsPXVybC5zcGxpdCgnLycpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0LGFyclVybCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgX2dldE9iakFyclVybCh0YXJnZXQsdXJsQXJyOkFycmF5PHN0cmluZz4saWQ9MCl7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYoX3RhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgbmE9dXJsQXJyW2lkXTtcclxuICAgICAgICB2YXIgdGFyZ2V0T2JqPV90YXJnZXQuZ2V0Q2hpbGRCeU5hbWUobmEpO1xyXG4gICAgICAgIGlmKHRhcmdldE9iaj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihpZD49dXJsQXJyLmxlbmd0aC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGFyZ2V0T2JqPXRoaXMuX2dldE9iakFyclVybCh0YXJnZXRPYmosdXJsQXJyLCsraWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vd215ICAyMDE4LzEyLzEyIDIzOjIwOjI4XG4vKkM0ROmhtueCueWKqOeUuyovXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4uL1dteVUzZEltcG9ydCc7XG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uLy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRzX0M0RFZldGV4QW5pbWF0b3IgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XG5cbiBfYzRkVmV0ZXhBbmltYXRvcjphbnk7XG4gX2FuaXI6YW55O1xucHVibGljIG9uQXdha2UoKSB7XG4gdGhpcy5zZXRTaG93KGZhbHNlKTtcbiB0aGlzLl9jNGRWZXRleEFuaW1hdG9yID0gdGhpcy5vd25lcjNELmdldENvbXBvbmVudChXbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoJ1dteUM0RFZldGV4QW5pbWF0b3InKSk7XG4gaWYgKHRoaXMuX2M0ZFZldGV4QW5pbWF0b3IgPT0gbnVsbCkge1xuIHRoaXMuX2M0ZFZldGV4QW5pbWF0b3IgPSB0aGlzLm93bmVyM0QuYWRkQ29tcG9uZW50KFdteVUzZEltcG9ydC5nZXRDbGFzcygnV215QzREVmV0ZXhBbmltYXRvcicpKTtcbiB9XG4gdGhpcy5fYW5pciA9IHRoaXMub3duZXIzRC5nZXRDb21wb25lbnQoV215VTNkSW1wb3J0LmdldENsYXNzKCdBbmltYXRvcicpKTtcbiBcbiB9XG4gLyrmkq3mlL7liqjnlLsqL1xucHVibGljIHBsYXkoKSB7XG4gdGhpcy5zZXRTaG93KHRydWUpO1xuIHRoaXMuX2FuaXIuZW5hYmxlZCA9IHRydWU7XG4gdGhpcy5fYW5pci5wbGF5KFwicGxheVwiKTtcbiBcbiB9XG59XG4iLCIvL3dteSAgMjAxOC8xMi8xMiAyMzoyMDoyOFxuLyrlnLrmma/nm7jmnLoqL1xuaW1wb3J0IFdteVUzZEltcG9ydCBmcm9tICcuLi9XbXlVM2RJbXBvcnQnO1xuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi8uLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUc19DYW1lcmFCb3ggZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XG5cbnB1YmxpYyBvbkF3YWtlKCkge1xuIHZhciBhbmlyOmFueT0gdGhpcy5vd25lcjNELmdldENvbXBvbmVudChXbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoJ0FuaW1hdG9yJykpO1xuIGFuaXIucGxheShcInBsYXlcIik7XG4gLy9hbmlyLmVuYWJsZWQgPSBmYWxzZTtcbiBcbiB9XG4gLyrmkq3mlL7liqjnlLsqL1xucHVibGljIHBsYXkoKSB7XG4gdmFyIHNodTphbnk9IHRoaXMuZ2V0T2JqM2RVcmwodGhpcy5zY2VuZTNELCBcInNodVwiKTtcbiB2YXIgYW5pcjphbnk9IHNodS5nZXRDb21wb25lbnQoV215VTNkSW1wb3J0LmdldENsYXNzKCdBbmltYXRvcicpKTtcbiBhbmlyLnBsYXkoXCJwbGF5XCIpO1xuIFxuIH1cbnB1YmxpYyBwbGF5MSgpIHtcbiB2YXIgZnowMTphbnk9IHRoaXMuZ2V0T2JqM2RVcmwodGhpcy5zY2VuZTNELCBcInNjZW5lQm94L2JveC9mejAxXCIpO1xuIHZhciBjNGRBbmlyOmFueT0gZnowMS5nZXRDb21wb25lbnQoV215VTNkSW1wb3J0LmdldENsYXNzKCdUc19DNERWZXRleEFuaW1hdG9yJykpO1xuIGM0ZEFuaXIucGxheSgpO1xuIFxuIH1cbn1cbiIsIi8vd215ICAyMDE4LzEyLzEyIDIzOjIwOjI4XG4vKuS5piovXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4uL1dteVUzZEltcG9ydCc7XG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uLy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRzX1NodSBleHRlbmRzIFdteVNjcmlwdDNEIHtcblxucHVibGljIG9uQXdha2UoKSB7XG4gXG4gfVxuIC8q5pKt5pS+5Yqo55S7Ki9cbnB1YmxpYyBwbGF5KCkge1xuIFxuIH1cbn1cbiJdfQ==
