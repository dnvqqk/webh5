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
var WmyMatMag_1 = require("./wmyMats/WmyMatMag");
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
        Laya.stage.frameRate = Laya.Stage.FRAME_FAST;
        //设置水平对齐
        Laya.stage.alignH = "center";
        //设置垂直对齐
        Laya.stage.alignV = "middle";
        Laya.Stat.show();
        this["vConsole"] = new window["VConsole"]();
        this["vConsole"].switchPos.startY = 40;
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
        Wmy_Load_Mag_1.Wmy_Load_Mag.getThis.onSetWetData("loadInfo", Laya.Handler.create(this, function () {
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
        if (this._mainView != null) {
            this._mainView.width = this._uiRoot.width;
            this._mainView.height = this._uiRoot.height;
        }
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
        //自动添加材质
        this._scene3D.addComponent(WmyMatMag_1.default);
        //自动添加U3D脚本
        this._scene3D.addComponent(WmyU3dTsMag_1.default);
        WTweenManager_1.WTweenManager.killTweens(this);
        this.onMain();
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
},{"./_wmyUtilsH5/WmyUtils":2,"./_wmyUtilsH5/Wmy_Load_Mag":3,"./_wmyUtilsH5/wmyTween/WTweenManager":13,"./wmyMats/WmyMatMag":17,"./wmyU3dTs/WmyU3dTsMag":23}],2:[function(require,module,exports){
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
    //播放声音
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
    //浅拷贝
    WmyUtils.shallowCopy = function (obj) {
        // 只拷贝对象
        if (typeof obj !== 'object')
            return;
        // 根据obj的类型判断是新建一个数组还是一个对象
        var newObj = obj instanceof Array ? [] : {};
        // 遍历obj,并且判断是obj的属性才拷贝
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    };
    //深拷贝
    WmyUtils.deepCopy = function (obj) {
        // 只拷贝对象
        if (typeof obj !== 'object')
            return;
        // 根据obj的类型判断是新建一个数组还是一个对象
        var newObj = obj instanceof Array ? [] : {};
        for (var key in obj) {
            // 遍历obj,并且判断是obj的属性才拷贝
            if (obj.hasOwnProperty(key)) {
                // 判断属性值的类型，如果是对象递归调用深拷贝
                newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
            }
        }
        return newObj;
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
        this.dataName = "";
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
    Wmy_Load_Mag.prototype.getResObj = function (resName, dataName) {
        var webData;
        if (dataName == null) {
            dataName = this.dataName;
        }
        webData = this._wetData[dataName];
        if (webData == null) {
            console.warn("空数据");
            return null;
        }
        var arr = null;
        if (webData instanceof Array) {
            arr = webData;
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
    Wmy_Load_Mag.prototype.onSetWetData = function (dataName, callbackOk) {
        if (window[dataName] == null)
            return;
        this.dataName = dataName;
        this._wetData[dataName] = window[dataName];
        callbackOk.runWith([this._wetData[dataName]]);
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
        var webData = this._wetData[this.dataName];
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
                console.warn("材料数据错误", webData);
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
        if (type == "u3d") {
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
        if (type == "mats") {
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
        if (type == "cubeMap") {
            var Resres = res["Resres"];
            for (var i = 0; i < Resres.length; i++) {
                var obj = Resres[i];
                var resUrl = obj["resUrl"];
                var url = resUrl;
                Laya.TextureCube.load(url, null);
            }
        }
        if (type == "audio") {
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
    //设置阴影
    WmyScript3D.prototype.onSetShadow = function (isCastShadow, isReceiveShadow) {
        WmyUtils3D_1.WmyUtils3D.onSetShadow(this.owner3D, isCastShadow, isReceiveShadow);
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
    WmyUtils3D.onSetDirectionLight = function (directionLight, shadowResolution, shadowPCFType, shadowDistance, isShadow) {
        if (shadowResolution === void 0) { shadowResolution = 512; }
        if (shadowPCFType === void 0) { shadowPCFType = 1; }
        if (shadowDistance === void 0) { shadowDistance = 15; }
        if (isShadow === void 0) { isShadow = true; }
        if (directionLight instanceof Laya.DirectionLight) {
            //灯光开启阴影
            directionLight.shadow = isShadow;
            //可见阴影距离
            directionLight.shadowDistance = shadowDistance;
            //生成阴影贴图尺寸
            directionLight.shadowResolution = shadowResolution;
            directionLight.shadowPSSMCount = 1;
            //模糊等级,越大越高,更耗性能
            directionLight.shadowPCFType = shadowPCFType;
        }
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
    WmyUtils3D.onSetShadow = function (target, isCastShadow, isReceiveShadow) {
        if (target instanceof Laya.MeshSprite3D) {
            //产生阴影
            target.meshRenderer.castShadow = isCastShadow;
            //接收阴影
            target.meshRenderer.receiveShadow = isReceiveShadow;
        }
        else if (target instanceof Laya.SkinnedMeshSprite3D) {
            //产生阴影
            target.skinnedMeshRenderer.castShadow = isCastShadow;
            //接收阴影
            target.skinnedMeshRenderer.receiveShadow = isReceiveShadow;
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
        var a = [];
        this._vertexBuffers = this._mesh.sharedMesh["_vertexBuffers"];
        this._vertexBuffers = this._vertexBuffers.concat();
        this._mesh.sharedMesh["_vertexBuffers"] = this._vertexBuffers;
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
var WmyScript3D_1 = require("../WmyScript3D");
var WmyPhysics_Character = /** @class */ (function (_super) {
    __extends(WmyPhysics_Character, _super);
    function WmyPhysics_Character() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.speedV3 = new Laya.Vector3();
        _this.gravity = new Laya.Vector3();
        _this.isLockMove = false;
        return _this;
    }
    WmyPhysics_Character.prototype.onDel = function () {
        if (this.character != null) {
            this.character.destroy();
            this.character = null;
        }
    };
    Object.defineProperty(WmyPhysics_Character.prototype, "isGrounded", {
        get: function () {
            if (this.character == null)
                return false;
            return this.character.isGrounded;
        },
        enumerable: true,
        configurable: true
    });
    WmyPhysics_Character.prototype.onStart = function () {
    };
    WmyPhysics_Character.prototype.onInit = function (radius, length, orientation, localOffsetX, localOffsetY, localOffsetZ) {
        this.character = this.owner3D.addComponent(Laya.CharacterController);
        var sphereShape = new Laya.CapsuleColliderShape(radius, length, orientation);
        sphereShape.localOffset = new Laya.Vector3(localOffsetX, localOffsetY, localOffsetZ);
        this.character.colliderShape = sphereShape;
        this.character.gravity = this.gravity;
        // this.character._updatePhysicsTransform();
    };
    WmyPhysics_Character.prototype.onUpdate = function () {
        this.character.gravity = this.gravity;
        this.character.move(this.speedV3);
    };
    WmyPhysics_Character.prototype.move = function (v3, lockMoveTime) {
        var _this = this;
        if (lockMoveTime === void 0) { lockMoveTime = 0; }
        this.isLockMove = true;
        this.character.move(v3);
        Laya.timer.once(lockMoveTime * 1000, this, function () {
            _this.isLockMove = false;
        });
    };
    WmyPhysics_Character.prototype._updatePhysicsTransform = function () {
        //var nativeWorldTransform=this.character._nativeColliderObject.getWorldTransform();
        this.character._derivePhysicsTransformation(true);
    };
    return WmyPhysics_Character;
}(WmyScript3D_1.WmyScript3D));
exports.default = WmyPhysics_Character;
},{"../WmyScript3D":6}],10:[function(require,module,exports){
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
},{"./WEaseType":11}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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
},{"./WTweenManager":13}],13:[function(require,module,exports){
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
},{"./WTweener":15}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{"./WEaseManager":10,"./WEaseType":11,"./WTween":12,"./WTweenValue":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyMatConfig = /** @class */ (function () {
    function WmyMatConfig() {
    }
    WmyMatConfig.matConfig = [
        {
            "c_matName": "dao_1", "initData": {
                "shaderName": "wmyLaya_wmyLbt", "_AlbedoIntensity": "1", "_AlphaBlend": "0", "_AlphaTest": "0", "_Cull": "2", "_Cutoff": "0.01", "_DstBlend": "0", "_Gloss": "30", "_IsVertexColor": "0", "_Lighting": "0", "_Mode": "0", "_RenderQueue": "2000", "_Shininess": "0.078125", "_SpecularSource": "0", "_SrcBlend": "1", "_ZTest": "4", "_ZWrite": "1", "_Color": "1,1,1,1", "_SpecColor": "0.5,0.5,0.5,1", "_Specular": "0.2647059,0.2647059,0.2647059,1", "_wColor": "1,0.76838225,0.6691177,1"
            }, "targetUrlArr": [
                {
                    "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/49_C2U_\u5C9B1/50_C2U_dao_1", "matId": 0
                }
            ]
        }
    ];
    return WmyMatConfig;
}());
exports.default = WmyMatConfig;
},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*wmy版本_2018/1/3/19.31*/
var WmyScript3D_1 = require("../_wmyUtilsH5/d3/WmyScript3D");
var WmyMatConfig_1 = require("./WmyMatConfig");
var WmyMatMag = /** @class */ (function (_super) {
    __extends(WmyMatMag, _super);
    function WmyMatMag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WmyMatMag.prototype.onAwake = function () {
        var shaderMag = require('../wmyShaders/WmyShaderMag')['default'];
        if (shaderMag)
            new shaderMag();
        for (var i = 0; i < WmyMatConfig_1.default.matConfig.length; i++) {
            var matObj = WmyMatConfig_1.default.matConfig[i];
            this.addMat(matObj);
        }
    };
    WmyMatMag.prototype.addMat = function (matObj) {
        if (matObj == null)
            return;
        var c_matName = matObj['c_matName'];
        var initData = matObj['initData'];
        var targetUrlArr = matObj['targetUrlArr'];
        for (var j = 0; j < targetUrlArr.length; j++) {
            var url = targetUrlArr[j]['url'];
            var matId = targetUrlArr[j]['matId'];
            var target3D = WmyMatMag.getObj3dUrl(this.scene3D, url);
            if (target3D != null) {
                this.setMaterial(target3D, initData, matId);
            }
        }
    };
    WmyMatMag.prototype.setMaterial = function (target, initData, matId, shaderName, isNewMateria) {
        if (matId === void 0) { matId = 0; }
        if (target == null)
            return null;
        if (shaderName == undefined) {
            shaderName = initData.shaderName;
        }
        if (shaderName == undefined)
            return null;
        var shader = Laya.Shader3D.find(shaderName);
        if (shader == null)
            return;
        var renderer;
        var sharedMaterial;
        if (target instanceof Laya.SkinnedMeshSprite3D) {
            renderer = (target).skinnedMeshRenderer;
            if (renderer == null)
                return null;
            sharedMaterial = renderer.materials[matId];
        }
        else {
            renderer = (target).meshRenderer;
            if (renderer == null)
                return null;
            sharedMaterial = renderer.materials[matId];
        }
        if (sharedMaterial == null) {
            console.log('没有sharedMaterial:', target, shaderName);
            return null;
        }
        if (isNewMateria) {
            sharedMaterial = sharedMaterial.clone();
            renderer.materials[matId] = sharedMaterial;
        }
        // sharedMaterial.setShaderName(shaderName);
        // //渲染模式
        // var vsPsArr=shader['w_vsPsArr'];
        // if(vsPsArr){
        //     for (let i = 0; i < vsPsArr.length; i++) {
        //         var renderDataObj = vsPsArr[i][2];
        //         for (var key in renderDataObj) {
        //             if (renderDataObj.hasOwnProperty(key)) {
        //                 if(sharedMaterial.hasOwnProperty(key)){
        //                     sharedMaterial[key]=renderDataObj[key];
        //                 }
        //                 var renderState=sharedMaterial.getRenderState(i);
        //                 if(renderState.hasOwnProperty(key)){
        //                     renderState[key]=renderDataObj[key];
        //                 }
        //             }
        //         }
        //     }
        // }
        // //初始值
        // if (shader['w_uniformMap'] != null) {
        //     for (var key in shader['w_uniformMap']) {
        //         if (shader['w_uniformMap'].hasOwnProperty(key)) {
        //             var initId=shader['w_uniformMap'][key][0];
        //             var initV=initData[key];
        //             if(initV!=null){
        //                 initV = initV.split(',');
        //                 if(initV.length==4){
        //                    sharedMaterial._shaderValues.setVector(initId,new Laya.Vector4(parseFloat(initV[0]),parseFloat(initV[1]),parseFloat(initV[2]),parseFloat(initV[3])));
        //                 }
        //                 else if(initV.length==3){
        //                    sharedMaterial._shaderValues.setVector(initId,new Laya.Vector3(parseFloat(initV[0]),parseFloat(initV[1]),parseFloat(initV[2])));
        //                 }
        //                 else if(initV.length==2){
        //                    sharedMaterial._shaderValues.setVector(initId,new Laya.Vector2(parseFloat(initV[0]),parseFloat(initV[1])));
        //                 }
        //                 else if(initV.length==1){
        //                     if(!isNaN(parseFloat(initV[0]))){
        //                         sharedMaterial._shaderValues.setNumber(initId,parseFloat(initV[0]));
        //                     }
        //                     else{
        //                         var strObj=initV[0]+'';
        //                         if(strObj=='tex'){
        //                             var texObj=initData['TEX@'+key];
        //                             if(texObj!=null){
        //                                 var path=texObj['path'];
        //                                 Laya.loader.load(path,Laya.Handler.create(this,(_initId,tex)=>{
        //                                     if(tex==null){
        //                                         tex=new Laya.Texture2D(0,0,0,true);
        //                                     }
        //                                     sharedMaterial._shaderValues.setTexture(_initId,tex);
        //                                 },[initId]))
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }        
        //     }
        // }
        return sharedMaterial;
    };
    WmyMatMag.Sprite3D_ShaderValues = function (target, valueName, value, matsId) {
        var tObjArr = WmyMatMag.getChildrenComponent(target, Laya.RenderableSprite3D);
        for (var i = 0; i < tObjArr.length; i++) {
            var rP3d = tObjArr[i];
            WmyMatMag.RenderableSprite3D_ShaderValues(rP3d, valueName, value, matsId);
        }
    };
    /**
     * @param	target	对象
     * @param	valueName 值的名字
     * @param	value	值
     * @param	matsId	材质球ID
     */
    WmyMatMag.RenderableSprite3D_ShaderValues = function (target, valueName, value, matsId) {
        if (matsId == null)
            matsId = -1;
        var renderer = target['meshRenderer'];
        if (renderer == null) {
            renderer = target['skinnedMeshRenderer'];
        }
        if (!renderer)
            return false;
        var ms = renderer.sharedMaterials;
        if (ms.length <= 0)
            return false;
        var isMatsId = matsId < 0 ? false : true;
        var isOK = true;
        for (var i = 0; i < ms.length; i++) {
            var m = ms[i];
            var uniformMap = m._shader._uniformMap[valueName];
            if (!uniformMap)
                continue;
            if (isMatsId) {
                if (matsId != i)
                    continue;
            }
            try {
                var valueId = uniformMap[0];
                if (value instanceof Boolean) {
                    m._shaderValues.setBool(valueId, value);
                }
                else if (!isNaN(value)) {
                    var v = value + '';
                    if (v.indexOf('.') < 0) {
                        m._shaderValues.setInt(valueId, value);
                    }
                    else {
                        m._shaderValues.setNumber(valueId, value);
                    }
                }
                else if (value instanceof Laya.BaseVector) {
                    m._shaderValues.setVector(valueId, value);
                }
                else if (value instanceof Laya.Quaternion) {
                    m._shaderValues.setQuaternion(valueId, value);
                }
                else if (value instanceof Laya.Matrix4x4) {
                    m._shaderValues.setMatrix4x4(valueId, value);
                }
                else if (value instanceof Laya.Texture) {
                    m._shaderValues.setTexture(valueId, value);
                }
                else {
                    isOK = false;
                }
            }
            catch (error) {
                isOK = false;
            }
        }
        return isOK;
    };
    WmyMatMag.onInstanceName = function (name) {
        var instance = null;
        try {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            instance = Object.create(window[name].prototype);
            instance.constructor.apply(instance, args);
        }
        catch (error) { }
        return instance;
    };
    ;
    WmyMatMag.getObjectClass = function (obj) {
        if (obj && obj.constructor && obj.constructor.toString()) {
            /*
             * for browsers which have name property in the constructor
             * of the object,such as chrome
             */
            if (obj.constructor.name) {
                return obj.constructor.name;
            }
            var str = obj.constructor.toString();
            /*
             * executed if the return of object.constructor.toString() is
             * '[object objectClass]'
             */
            if (str.charAt(0) == '[') {
                var arr = str.match(/\[\w+\s*(\w+)\]/);
            }
            else {
                /*
                 * executed if the return of object.constructor.toString() is
                 * 'function objectClass () {}'
                 * for IE Firefox
                 */
                var arr = str.match(/function\s*(\w+)/);
            }
            if (arr && arr.length == 2) {
                return arr[1];
            }
        }
        return undefined;
    };
    ;
    WmyMatMag.getChildrenComponent = function (target, clas, arr) {
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
    WmyMatMag.getObj3dUrl = function (target, url) {
        var arrUrl = url.split('/');
        return this._getObjArrUrl(target, arrUrl);
    };
    WmyMatMag._getObjArrUrl = function (target, urlArr, id) {
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
    return WmyMatMag;
}(WmyScript3D_1.WmyScript3D));
exports.default = WmyMatMag;
},{"../_wmyUtilsH5/d3/WmyScript3D":6,"../wmyShaders/WmyShaderMag":20,"./WmyMatConfig":16}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Base_WmyShader = /** @class */ (function () {
    function Base_WmyShader() {
        this.__attributeMap = {
            'a_Position': /*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/ 0,
            'a_Color': /*laya.d3.graphics.Vertex.VertexMesh.MESH_COLOR0*/ 1,
            'a_Normal': /*laya.d3.graphics.Vertex.VertexMesh.MESH_NORMAL0*/ 3,
            'a_Texcoord0': /*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE0*/ 2,
            'a_Texcoord1': /*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE1*/ 8,
            'a_BoneWeights': /*laya.d3.graphics.Vertex.VertexMesh.MESH_BLENDWEIGHT0*/ 7,
            'a_BoneIndices': /*laya.d3.graphics.Vertex.VertexMesh.MESH_BLENDINDICES0*/ 6,
            'a_Tangent0': /*laya.d3.graphics.Vertex.VertexMesh.MESH_TANGENT0*/ 5,
        };
        this.__uniformMap = {
            'u_Bones': [/*laya.d3.core.SkinnedMeshSprite3D.BONES*/ 0, /*laya.d3.shader.Shader3D.PERIOD_CUSTOM*/ 0],
            'u_DiffuseTexture': [/*laya.d3.core.material.BlinnPhongMaterial.ALBEDOTEXTURE*/ 1, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/ 1],
            'u_SpecularTexture': [/*laya.d3.core.material.BlinnPhongMaterial.SPECULARTEXTURE*/ 3, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/ 1],
            'u_NormalTexture': [/*laya.d3.core.material.BlinnPhongMaterial.NORMALTEXTURE*/ 2, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/ 1],
            'u_AlphaTestValue': [/*laya.d3.core.material.BaseMaterial.ALPHATESTVALUE*/ 0, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/ 1],
            'u_DiffuseColor': [/*laya.d3.core.material.BlinnPhongMaterial.ALBEDOCOLOR*/ 5, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/ 1],
            'u_MaterialSpecular': [/*laya.d3.core.material.BlinnPhongMaterial.MATERIALSPECULAR*/ 6, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/ 1],
            'u_Shininess': [/*laya.d3.core.material.BlinnPhongMaterial.SHININESS*/ 7, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/ 1],
            'u_TilingOffset': [/*laya.d3.core.material.BlinnPhongMaterial.TILINGOFFSET*/ 8, /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/ 1],
            'u_WorldMat': [Laya.Sprite3D.WORLDMATRIX, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/ 2],
            'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/ 2],
            'u_LightmapScaleOffset': [Laya.RenderableSprite3D.LIGHTMAPSCALEOFFSET, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/ 2],
            'u_LightMap': [Laya.RenderableSprite3D.LIGHTMAP, /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/ 2],
            'u_CameraPos': [/*laya.d3.core.BaseCamera.CAMERAPOS*/ 0, /*laya.d3.shader.Shader3D.PERIOD_CAMERA*/ 3],
            'u_ReflectTexture': [/*laya.d3.core.scene.Scene3D.REFLECTIONTEXTURE*/ 22, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_ReflectIntensity': [/*laya.d3.core.scene.Scene3D.REFLETIONINTENSITY*/ 23, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_FogStart': [/*laya.d3.core.scene.Scene3D.FOGSTART*/ 1, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_FogRange': [/*laya.d3.core.scene.Scene3D.FOGRANGE*/ 2, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_FogColor': [/*laya.d3.core.scene.Scene3D.FOGCOLOR*/ 0, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_DirectionLight.Color': [/*laya.d3.core.scene.Scene3D.LIGHTDIRCOLOR*/ 4, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_DirectionLight.Direction': [/*laya.d3.core.scene.Scene3D.LIGHTDIRECTION*/ 3, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_PointLight.Position': [/*laya.d3.core.scene.Scene3D.POINTLIGHTPOS*/ 5, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_PointLight.Range': [/*laya.d3.core.scene.Scene3D.POINTLIGHTRANGE*/ 6, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_PointLight.Color': [/*laya.d3.core.scene.Scene3D.POINTLIGHTCOLOR*/ 8, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_SpotLight.Position': [/*laya.d3.core.scene.Scene3D.SPOTLIGHTPOS*/ 9, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_SpotLight.Direction': [/*laya.d3.core.scene.Scene3D.SPOTLIGHTDIRECTION*/ 10, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_SpotLight.Range': [/*laya.d3.core.scene.Scene3D.SPOTLIGHTRANGE*/ 12, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_SpotLight.Spot': [/*laya.d3.core.scene.Scene3D.SPOTLIGHTSPOTANGLE*/ 11, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_SpotLight.Color': [/*laya.d3.core.scene.Scene3D.SPOTLIGHTCOLOR*/ 14, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_AmbientColor': [/*laya.d3.core.scene.Scene3D.AMBIENTCOLOR*/ 21, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_shadowMap1': [/*laya.d3.core.scene.Scene3D.SHADOWMAPTEXTURE1*/ 18, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_shadowMap2': [/*laya.d3.core.scene.Scene3D.SHADOWMAPTEXTURE2*/ 19, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_shadowMap3': [/*laya.d3.core.scene.Scene3D.SHADOWMAPTEXTURE3*/ 20, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_shadowPSSMDistance': [/*laya.d3.core.scene.Scene3D.SHADOWDISTANCE*/ 15, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_lightShadowVP': [/*laya.d3.core.scene.Scene3D.SHADOWLIGHTVIEWPROJECT*/ 16, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_shadowPCFoffset': [/*laya.d3.core.scene.Scene3D.SHADOWMAPPCFOFFSET*/ 17, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_Time': [/*laya.d3.core.scene.Scene3D.TIME*/ 24, /*laya.d3.shader.Shader3D.PERIOD_SCENE*/ 4],
            'u_PMatrix': [2, 3],
            'u_VMatrix': [1, 3],
        };
        this._vsPsArr = [];
        this._shader = null;
        this._attributeMap = {};
        this._uniformMap = {};
        this.init();
        var spriteDefines = Laya.SkinnedMeshSprite3D.shaderDefines;
        var materialDefines = Laya.BlinnPhongMaterial.shaderDefines;
        this._shader = Laya.Shader3D.add(this._shaderName, this.__attributeMap, this.__uniformMap, spriteDefines, materialDefines);
        this._shader['w_uniformMap'] = this._uniformMap;
        for (var key in this._attributeMap) {
            if (this._attributeMap.hasOwnProperty(key)) {
                this.__attributeMap[key] = this._attributeMap[key];
            }
        }
        for (var key in this._uniformMap) {
            if (this._uniformMap.hasOwnProperty(key)) {
                this._uniformMap[key][1] = Laya.Shader3D.PERIOD_MATERIAL;
                this.__uniformMap[key] = this._uniformMap[key];
            }
        }
        this._shader['w_vsPsArr'] = this._vsPsArr;
        for (var key in this._vsPsArr) {
            if (this._vsPsArr.hasOwnProperty(key)) {
                var vsps = this._vsPsArr[key];
                this._shader.addShaderPass(vsps[0], vsps[1]);
            }
        }
    }
    Base_WmyShader.prototype.init = function () {
    };
    Base_WmyShader.prototype.onSetVsPs = function (vs, ps, renderData) {
        if (vs != null && ps != null) {
            // vs=this.onSetVs(vs);
            // ps=this.onSetPs(ps);
            if (renderData == null) {
                renderData = {};
            }
            this._vsPsArr.push([vs, ps, renderData]);
        }
    };
    Base_WmyShader.prototype.onSetVs = function (vs) {
        if (vs == null)
            return '';
        if (vs.indexOf('wmyMain(') < 0)
            return vs;
        var _Vs = "\n#include 'Lighting.glsl';\n\nattribute vec4 a_Position;\nuniform mat4 u_MvpMatrix;\n\nattribute vec2 a_Texcoord0;\n#if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))||(defined(LIGHTMAP)&&defined(UV))\n    varying vec2 v_Texcoord0;\n#endif\n\n#if defined(LIGHTMAP)&&defined(UV1)\n    attribute vec2 a_Texcoord1;\n#endif\n\n#ifdef LIGHTMAP\n    uniform vec4 u_LightmapScaleOffset;\n    varying vec2 v_LightMapUV;\n#endif\n\n#ifdef COLOR\n    attribute vec4 a_Color;\n    varying vec4 v_Color;\n#endif\n\n#ifdef BONE\n    const int c_MaxBoneCount = 24;\n    attribute vec4 a_BoneIndices;\n    attribute vec4 a_BoneWeights;\n    uniform mat4 u_Bones[c_MaxBoneCount];\n#endif\n\nattribute vec3 a_Normal;\nvarying vec3 v_Normal; \nuniform vec3 u_CameraPos;\nvarying vec3 v_ViewDir; \nattribute vec4 a_Tangent0;\nvarying mat3 worldInvMat;\nvarying vec3 v_Position;\n\nvarying vec3 v_Tangent;\nvarying vec3 v_Binormal;\n\nuniform mat4 u_WorldMat;\nvarying vec3 v_PositionWorld;\n\nvarying float v_posViewZ;\n#ifdef RECEIVESHADOW\n    #ifdef SHADOWMAP_PSSM1 \n    varying vec4 v_lightMVPPos;\n    uniform mat4 u_lightShadowVP[4];\n    #endif\n#endif\n\n#ifdef TILINGOFFSET\n    uniform vec4 u_TilingOffset;\n#endif\n\nvoid main_castShadow()\n{\n    #ifdef BONE\n        mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n        vec4 position=skinTransform*a_Position;\n        v_Position=position.xyz;\n        gl_Position = u_MvpMatrix * position;\n    #else\n        v_Position=a_Position.xyz;\n        gl_Position = u_MvpMatrix * a_Position;\n    #endif\n        \n    //TODO\u6CA1\u8003\u8651UV\u52A8\u753B\u5462\n    #if defined(DIFFUSEMAP)&&defined(ALPHATEST)\n        v_Texcoord0=a_Texcoord0;\n    #endif\n        v_posViewZ = gl_Position.z;\n}\n\nmat3 inverse(mat3 m) {\n    float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n    float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n    float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n\n    float b01 = a22 * a11 - a12 * a21;\n    float b11 = -a22 * a10 + a12 * a20;\n    float b21 = a21 * a10 - a11 * a20;\n\n    float det = a00 * b01 + a01 * b11 + a02 * b21;\n\n    return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\n                b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\n                b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n}\n\nvoid main_normal()\n{\n    #ifdef BONE\n        mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n        vec4 position=skinTransform*a_Position;\n        v_Position=position.xyz;\n        gl_Position = u_MvpMatrix * position;\n    #else\n        v_Position=a_Position.xyz;\n        gl_Position = u_MvpMatrix * a_Position;\n    #endif\n\n    #ifdef BONE\n        worldInvMat=inverse(mat3(u_WorldMat*skinTransform));\n    #else\n        worldInvMat=inverse(mat3(u_WorldMat));\n    #endif  \n    v_Normal=a_Normal*worldInvMat;\n\n    v_Tangent=a_Tangent0.xyz*worldInvMat;\n    v_Binormal=cross(v_Normal,v_Tangent)*a_Tangent0.w;\n\n    #ifdef BONE\n        v_PositionWorld=(u_WorldMat*position).xyz;\n    #else\n        v_PositionWorld=(u_WorldMat*a_Position).xyz;\n    #endif\n    \n    v_ViewDir=u_CameraPos-v_PositionWorld;\n\n    #if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))\n        v_Texcoord0=a_Texcoord0;\n        #ifdef TILINGOFFSET\n            v_Texcoord0=TransformUV(v_Texcoord0,u_TilingOffset);\n        #endif\n    #endif\n\n    #ifdef LIGHTMAP\n        #ifdef SCALEOFFSETLIGHTINGMAPUV\n            #ifdef UV1\n                v_LightMapUV=vec2(a_Texcoord1.x,1.0-a_Texcoord1.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;\n            #else\n                v_LightMapUV=vec2(a_Texcoord0.x,1.0-a_Texcoord0.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;\n            #endif \n            v_LightMapUV.y=1.0-v_LightMapUV.y;\n        #else\n            #ifdef UV1\n                v_LightMapUV=a_Texcoord1;\n            #else\n                v_LightMapUV=a_Texcoord0;\n            #endif \n        #endif \n    #endif\n\n    #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n        v_Color=a_Color;\n    #endif\n\n    #ifdef RECEIVESHADOW\n        v_posViewZ = gl_Position.w;\n        #ifdef SHADOWMAP_PSSM1 \n            v_lightMVPPos = u_lightShadowVP[0] * vec4(v_PositionWorld,1.0);\n        #endif\n    #endif\n}\n\n//--wmy-main-----------------\nmat3 MATRIX_IT_MV(mat4 ModelViewMatrix) {\n    return inverse(mat3(ModelViewMatrix));\n}\nmat3 getRotation(vec4 wTangent, vec3 wNormal) {\n    vec3 binormal = cross(wNormal.xyz, wTangent.xyz) * -wTangent.w;\n    mat3 rotation = mat3(\n        wTangent.x, binormal.x, wNormal.x,\n        wTangent.y, binormal.y, wNormal.y,\n        wTangent.z, binormal.z, wNormal.z);\n    return rotation;\n}\n" + vs + "\n//--wmy----------------------\n\nvoid main()\n{\n    #ifdef CASTSHADOW\n        main_castShadow();\n    #else\n        main_normal();\n        wmyMain();\n    #endif\n}        \n        ";
        return _Vs;
    };
    Base_WmyShader.prototype.onSetPs = function (ps) {
        if (ps == null)
            return '';
        if (ps.indexOf('wmyMain(') < 0)
            return ps;
        var _Ps = "\n#ifdef HIGHPRECISION\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\n#include 'Lighting.glsl';\n\nuniform vec4 u_DiffuseColor;\n\n#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n    varying vec4 v_Color;\n#endif\n\nvarying vec3 v_ViewDir; \n\n#ifdef ALPHATEST\n    uniform float u_AlphaTestValue;\n#endif\n\n#ifdef DIFFUSEMAP\n    uniform sampler2D u_DiffuseTexture;\n#endif\n\n#if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))\n    varying vec2 v_Texcoord0;\n#endif\n\n#ifdef LIGHTMAP\n    varying vec2 v_LightMapUV;\n    uniform sampler2D u_LightMap;\n#endif\n\n#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n    uniform vec3 u_MaterialSpecular;\n    uniform float u_Shininess;\n    #ifdef SPECULARMAP \n        uniform sampler2D u_SpecularTexture;\n    #endif\n#endif\n\n#ifdef FOG\n    uniform float u_FogStart;\n    uniform float u_FogRange;\n    uniform vec3 u_FogColor;\n#endif\n\nvarying vec3 v_Normal;\nvarying vec3 v_Position;\n\nuniform sampler2D u_NormalTexture;\nvarying vec3 v_Tangent;\nvarying vec3 v_Binormal;\n\n#ifdef DIRECTIONLIGHT\n    uniform DirectionLight u_DirectionLight;\n#endif\n\n#ifdef POINTLIGHT\n    uniform PointLight u_PointLight;\n#endif\n\n#ifdef SPOTLIGHT\n    uniform SpotLight u_SpotLight;\n#endif\n\nuniform vec3 u_AmbientColor;\n\n\n#if defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(RECEIVESHADOW)\n    varying vec3 v_PositionWorld;\n#endif\n\n#include 'ShadowHelper.glsl'\nvarying float v_posViewZ;\n#ifdef RECEIVESHADOW\n    #if defined(SHADOWMAP_PSSM2)||defined(SHADOWMAP_PSSM3)\n        uniform mat4 u_lightShadowVP[4];\n    #endif\n    #ifdef SHADOWMAP_PSSM1 \n        varying vec4 v_lightMVPPos;\n    #endif\n#endif\n\nvoid main_castShadow()\n{\n    //gl_FragColor=vec4(v_posViewZ,0.0,0.0,1.0);\n    gl_FragColor=packDepth(v_posViewZ);\n    #if defined(DIFFUSEMAP)&&defined(ALPHATEST)\n        float alpha = texture2D(u_DiffuseTexture,v_Texcoord0).w;\n        if( alpha < u_AlphaTestValue )\n        {\n            discard;\n        }\n    #endif\n}\n\n//--wmy-main-----------------\nvec4 lerpV4(vec4 a, vec4 b, float s) { return vec4(a + (b - a)*s); }\nvec3 lerpV3(vec3 a, vec3 b, float s) { return vec3(a + (b - a)*s); }\nvec2 lerpV2(vec2 a, vec2 b, float s) { return vec2(a + (b - a)*s); }\nfloat lerpF(float a, float b, float s) { return float(a + (b - a) * s); }\nfloat saturate(float n) { return clamp(n, 0.0, 1.0); }\nvec3 UnpackNormal(vec4 packednormal) {\n\t// This do the trick\n\tpackednormal.x *= packednormal.w;\n\tvec3 normal;\n\tnormal.xy = packednormal.xy * 2.0 - 1.0;\n\tnormal.z = sqrt(1.0 - saturate(dot(normal.xy, normal.xy)));\n\treturn normal;\n}\n" + ps + "\n//--wmy----------------------\n\nvoid main_normal()\n{\n\tvec3 globalDiffuse=u_AmbientColor;\n\t#ifdef LIGHTMAP\t\n\t\tglobalDiffuse += DecodeLightmap(texture2D(u_LightMap, v_LightMapUV));\n\t#endif\n\t\n\t#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n\t\tvec3 normal;\n\t\t#if (defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&defined(NORMALMAP)\n\t\t\tvec3 normalMapSample = texture2D(u_NormalTexture, v_Texcoord0).rgb;\n\t\t\tnormal = normalize(NormalSampleToWorldSpace(normalMapSample, v_Normal, v_Tangent,v_Binormal));\n\t\t#else\n\t\t\tnormal = normalize(v_Normal);\n\t\t#endif\n\t\tvec3 viewDir= normalize(v_ViewDir);\n\t#endif\n\t\n\tvec4 mainColor=u_DiffuseColor;\n\t#ifdef DIFFUSEMAP\n\t\tvec4 difTexColor=texture2D(u_DiffuseTexture, v_Texcoord0);\n\t\tmainColor=mainColor*difTexColor;\n\t#endif \n\t#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n\t\tmainColor=mainColor*v_Color;\n\t#endif \n    \n\t#ifdef ALPHATEST\n\t\tif(mainColor.a<u_AlphaTestValue)\n\t\t\tdiscard;\n\t#endif\n  \n\tvec3 diffuse = vec3(0.0);\n\tvec3 specular= vec3(0.0);\n\t#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n\t\tvec3 dif,spe;\n\t\t#ifdef SPECULARMAP\n\t\t\tvec3 gloss=texture2D(u_SpecularTexture, v_Texcoord0).rgb;\n\t\t#else\n\t\t\t#ifdef DIFFUSEMAP\n\t\t\t\tvec3 gloss=vec3(difTexColor.a);\n\t\t\t#else\n\t\t\t\tvec3 gloss=vec3(1.0);\n\t\t\t#endif\n\t\t#endif\n\t#endif\n\n\t#ifdef DIRECTIONLIGHT\n\t\tLayaAirBlinnPhongDiectionLight(u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_DirectionLight,dif,spe);\n\t\tdiffuse+=dif;\n\t\tspecular+=spe;\n\t#endif\n \n\t#ifdef POINTLIGHT\n\t\tLayaAirBlinnPhongPointLight(v_PositionWorld,u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_PointLight,dif,spe);\n\t\tdiffuse+=dif;\n\t\tspecular+=spe;\n\t#endif\n\n\t#ifdef SPOTLIGHT\n\t\tLayaAirBlinnPhongSpotLight(v_PositionWorld,u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_SpotLight,dif,spe);\n\t\tdiffuse+=dif;\n\t\tspecular+=spe;\n\t#endif\n\t\n\t#ifdef RECEIVESHADOW\n\t\tfloat shadowValue = 1.0;\n\t\t#ifdef SHADOWMAP_PSSM3\n\t\t\tshadowValue = getShadowPSSM3( u_shadowMap1,u_shadowMap2,u_shadowMap3,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);\n\t\t#endif\n\t\t#ifdef SHADOWMAP_PSSM2\n\t\t\tshadowValue = getShadowPSSM2( u_shadowMap1,u_shadowMap2,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);\n\t\t#endif \n\t\t#ifdef SHADOWMAP_PSSM1\n\t\t\tshadowValue = getShadowPSSM1( u_shadowMap1,v_lightMVPPos,u_shadowPSSMDistance,u_shadowPCFoffset,v_posViewZ,0.001);\n\t\t#endif\n\t\t//gl_FragColor =vec4(mainColor.rgb*(globalDiffuse + diffuse)*shadowValue,mainColor.a);\n\t\t//gl_FragColor = wmyMain(mainColor,(globalDiffuse + diffuse * shadowValue * 1.1));\n        gl_FragColor = wmyMain(mainColor,globalDiffuse,diffuse,shadowValue);\n\t#else\n\t\t//gl_FragColor =vec4(mainColor.rgb*(globalDiffuse + diffuse),mainColor.a);\n\t\tgl_FragColor = wmyMain(mainColor,globalDiffuse,diffuse,1.0);\n\t#endif\n    /*\n\t#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n\t\t#ifdef RECEIVESHADOW\n\t\t\tgl_FragColor.rgb+=specular*shadowValue;\n\t\t#else\n\t\t\tgl_FragColor.rgb+=specular;\n\t\t#endif\n\t#endif\n\t*/\n\t#ifdef FOG\n\t\tfloat lerpFact=clamp((1.0/gl_FragCoord.w-u_FogStart)/u_FogRange,0.0,1.0);\n\t\tgl_FragColor.rgb=mix(gl_FragColor.rgb,u_FogColor,lerpFact);\n\t#endif\n}\n\nvoid main()\n{\n\t#ifdef CASTSHADOW\t\t\n\t\tmain_castShadow();\n\t#else\n\t\tmain_normal();\n\t#endif  \n}\n        ";
        return _Ps;
    };
    return Base_WmyShader;
}());
exports.default = Base_WmyShader;
},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Base_WmyShader_1 = require("./Base_WmyShader");
var WmyLaya_wmyLbt = /** @class */ (function (_super) {
    __extends(WmyLaya_wmyLbt, _super);
    function WmyLaya_wmyLbt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WmyLaya_wmyLbt.prototype.init = function () {
        this._shaderName = this.constructor['name'];
        this._uniformMap = {
            '_wColor': [1000],
            '_Specular': [1001],
            '_Gloss': [1002],
        };
        var vspsArr = [];
        //pass0-------------------------------------------------------------------
        vspsArr[0] = [];
        //vs
        vspsArr[0][0] = "\n#include 'Lighting.glsl';\n\nattribute vec4 a_Position;\nuniform mat4 u_MvpMatrix;\n\nattribute vec2 a_Texcoord0;\n#if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))||(defined(LIGHTMAP)&&defined(UV))\n    varying vec2 v_Texcoord0;\n#endif\n\n#if defined(LIGHTMAP)&&defined(UV1)\n    attribute vec2 a_Texcoord1;\n#endif\n\n#ifdef LIGHTMAP\n    uniform vec4 u_LightmapScaleOffset;\n    varying vec2 v_LightMapUV;\n#endif\n\n#ifdef COLOR\n    attribute vec4 a_Color;\n    varying vec4 v_Color;\n#endif\n\n#ifdef BONE\n    const int c_MaxBoneCount = 24;\n    attribute vec4 a_BoneIndices;\n    attribute vec4 a_BoneWeights;\n    uniform mat4 u_Bones[c_MaxBoneCount];\n#endif\n\nattribute vec3 a_Normal;\nvarying vec3 v_Normal; \nuniform vec3 u_CameraPos;\nvarying vec3 v_ViewDir; \nattribute vec4 a_Tangent0;\nvarying mat3 worldInvMat;\nvarying vec3 v_Position;\n\nvarying vec3 v_Tangent;\nvarying vec3 v_Binormal;\n\nuniform mat4 u_WorldMat;\nvarying vec3 v_PositionWorld;\n\nvarying float v_posViewZ;\n#ifdef RECEIVESHADOW\n    #ifdef SHADOWMAP_PSSM1 \n    varying vec4 v_lightMVPPos;\n    uniform mat4 u_lightShadowVP[4];\n    #endif\n#endif\n\n#ifdef TILINGOFFSET\n    uniform vec4 u_TilingOffset;\n#endif\n\nvoid main_castShadow()\n{\n    #ifdef BONE\n        mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n        vec4 position=skinTransform*a_Position;\n        v_Position=position.xyz;\n        gl_Position = u_MvpMatrix * position;\n    #else\n        v_Position=a_Position.xyz;\n        gl_Position = u_MvpMatrix * a_Position;\n    #endif\n        \n    //TODO\u6CA1\u8003\u8651UV\u52A8\u753B\u5462\n    #if defined(DIFFUSEMAP)&&defined(ALPHATEST)\n        v_Texcoord0=a_Texcoord0;\n    #endif\n        v_posViewZ = gl_Position.z;\n}\n\nmat3 inverse(mat3 m) {\n    float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n    float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n    float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n\n    float b01 = a22 * a11 - a12 * a21;\n    float b11 = -a22 * a10 + a12 * a20;\n    float b21 = a21 * a10 - a11 * a20;\n\n    float det = a00 * b01 + a01 * b11 + a02 * b21;\n\n    return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\n                b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\n                b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n}\n\nvoid main_normal()\n{\n    #ifdef BONE\n        mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n        vec4 position=skinTransform*a_Position;\n        v_Position=position.xyz;\n        gl_Position = u_MvpMatrix * position;\n    #else\n        v_Position=a_Position.xyz;\n        gl_Position = u_MvpMatrix * a_Position;\n    #endif\n\n    #ifdef BONE\n        worldInvMat=inverse(mat3(u_WorldMat*skinTransform));\n    #else\n        worldInvMat=inverse(mat3(u_WorldMat));\n    #endif  \n    v_Normal=a_Normal*worldInvMat;\n\n    v_Tangent=a_Tangent0.xyz*worldInvMat;\n    v_Binormal=cross(v_Normal,v_Tangent)*a_Tangent0.w;\n\n    #ifdef BONE\n        v_PositionWorld=(u_WorldMat*position).xyz;\n    #else\n        v_PositionWorld=(u_WorldMat*a_Position).xyz;\n    #endif\n    \n    v_ViewDir=u_CameraPos-v_PositionWorld;\n\n    #if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))\n        v_Texcoord0=a_Texcoord0;\n        #ifdef TILINGOFFSET\n            v_Texcoord0=TransformUV(v_Texcoord0,u_TilingOffset);\n        #endif\n    #endif\n\n    #ifdef LIGHTMAP\n        #ifdef SCALEOFFSETLIGHTINGMAPUV\n            #ifdef UV1\n                v_LightMapUV=vec2(a_Texcoord1.x,1.0-a_Texcoord1.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;\n            #else\n                v_LightMapUV=vec2(a_Texcoord0.x,1.0-a_Texcoord0.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;\n            #endif \n            v_LightMapUV.y=1.0-v_LightMapUV.y;\n        #else\n            #ifdef UV1\n                v_LightMapUV=a_Texcoord1;\n            #else\n                v_LightMapUV=a_Texcoord0;\n            #endif \n        #endif \n    #endif\n\n    #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n        v_Color=a_Color;\n    #endif\n\n    #ifdef RECEIVESHADOW\n        v_posViewZ = gl_Position.w;\n        #ifdef SHADOWMAP_PSSM1 \n            v_lightMVPPos = u_lightShadowVP[0] * vec4(v_PositionWorld,1.0);\n        #endif\n    #endif\n}\n\n//--wmy-main-----------------\nmat3 MATRIX_IT_MV(mat4 ModelViewMatrix) {\n    return inverse(mat3(ModelViewMatrix));\n}\nmat3 getRotation(vec4 wTangent, vec3 wNormal) {\n    vec3 binormal = cross(wNormal.xyz, wTangent.xyz) * -wTangent.w;\n    mat3 rotation = mat3(\n        wTangent.x, binormal.x, wNormal.x,\n        wTangent.y, binormal.y, wNormal.y,\n        wTangent.z, binormal.z, wNormal.z);\n    return rotation;\n}\nuniform vec4 _wColor;\nuniform mat4 _Object2World;\nuniform vec4 _Specular;\nuniform float _Gloss;\n\nvarying vec3 g_worldNormal;\nvarying vec3 g_worldViewDir;\n\nvoid wmyMain(){\n    g_worldNormal = v_Normal;\n    g_worldNormal.x*=-1.0;\n\tg_worldViewDir = v_ViewDir;\n}\n//--wmy----------------------\n\nvoid main()\n{\n    #ifdef CASTSHADOW\n        main_castShadow();\n    #else\n        main_normal();\n        wmyMain();\n    #endif\n}\n";
        //ps
        vspsArr[0][1] = "\n#ifdef HIGHPRECISION\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\n#include 'Lighting.glsl';\n\nuniform vec4 u_DiffuseColor;\n\n#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n    varying vec4 v_Color;\n#endif\n\nvarying vec3 v_ViewDir; \n\n#ifdef ALPHATEST\n    uniform float u_AlphaTestValue;\n#endif\n\n#ifdef DIFFUSEMAP\n    uniform sampler2D u_DiffuseTexture;\n#endif\n\n#if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))\n    varying vec2 v_Texcoord0;\n#endif\n\n#ifdef LIGHTMAP\n    varying vec2 v_LightMapUV;\n    uniform sampler2D u_LightMap;\n#endif\n\n#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n    uniform vec3 u_MaterialSpecular;\n    uniform float u_Shininess;\n    #ifdef SPECULARMAP \n        uniform sampler2D u_SpecularTexture;\n    #endif\n#endif\n\n#ifdef FOG\n    uniform float u_FogStart;\n    uniform float u_FogRange;\n    uniform vec3 u_FogColor;\n#endif\n\nvarying vec3 v_Normal;\nvarying vec3 v_Position;\n\nuniform sampler2D u_NormalTexture;\nvarying vec3 v_Tangent;\nvarying vec3 v_Binormal;\n\n#ifdef DIRECTIONLIGHT\n    uniform DirectionLight u_DirectionLight;\n#endif\n\n#ifdef POINTLIGHT\n    uniform PointLight u_PointLight;\n#endif\n\n#ifdef SPOTLIGHT\n    uniform SpotLight u_SpotLight;\n#endif\n\nuniform vec3 u_AmbientColor;\n\n\n#if defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(RECEIVESHADOW)\n    varying vec3 v_PositionWorld;\n#endif\n\n#include 'ShadowHelper.glsl'\nvarying float v_posViewZ;\n#ifdef RECEIVESHADOW\n    #if defined(SHADOWMAP_PSSM2)||defined(SHADOWMAP_PSSM3)\n        uniform mat4 u_lightShadowVP[4];\n    #endif\n    #ifdef SHADOWMAP_PSSM1 \n        varying vec4 v_lightMVPPos;\n    #endif\n#endif\n\nvoid main_castShadow()\n{\n    //gl_FragColor=vec4(v_posViewZ,0.0,0.0,1.0);\n    gl_FragColor=packDepth(v_posViewZ);\n    #if defined(DIFFUSEMAP)&&defined(ALPHATEST)\n        float alpha = texture2D(u_DiffuseTexture,v_Texcoord0).w;\n        if( alpha < u_AlphaTestValue )\n        {\n            discard;\n        }\n    #endif\n}\n\n//--wmy-main-----------------\nvec4 lerpV4(vec4 a, vec4 b, float s) { return vec4(a + (b - a)*s); }\nvec3 lerpV3(vec3 a, vec3 b, float s) { return vec3(a + (b - a)*s); }\nvec2 lerpV2(vec2 a, vec2 b, float s) { return vec2(a + (b - a)*s); }\nfloat lerpF(float a, float b, float s) { return float(a + (b - a) * s); }\nfloat saturate(float n) { return clamp(n, 0.0, 1.0); }\nvec3 UnpackNormal(vec4 packednormal) {\n\t// This do the trick\n\tpackednormal.x *= packednormal.w;\n\tvec3 normal;\n\tnormal.xy = packednormal.xy * 2.0 - 1.0;\n\tnormal.z = sqrt(1.0 - saturate(dot(normal.xy, normal.xy)));\n\treturn normal;\n}\n\nuniform vec4 _wColor;\nuniform mat4 _Object2World;\nuniform vec4 _Specular;\nuniform float _Gloss;\n\nvarying vec3 g_worldNormal;\nvarying vec3 g_worldViewDir;\n\nvec4 wmyMain(vec4 _mainColor, vec3 _globalDiffuse, vec3 _diffuse, float shadowValue){\n    vec4 wmyColor=_mainColor;\n\n\t// vec3 ambient =u_AmbientColor/2.0;\n\t// vec3 lightDir = normalize(-u_DirectionLight.Direction.xyz);\n\t// float halfLambert = dot(g_worldNormal, lightDir) * 0.5 + 1.0;\n\t// vec3 diffuse = u_DirectionLight.Color.rgb * halfLambert *_wColor.rgb;\n\t\t\t\t\n\t// vec3 color = diffuse;\n\n\t// vec3 viewDir = normalize(g_worldViewDir);\n\t// vec3 halfDir = normalize(viewDir + lightDir);\n\t// vec3 specular = vec3(0.0);\n\t// specular = _Specular.rgb * pow(max(dot(g_worldNormal, halfDir), 0.0), _Gloss);\n\t// color += specular;\n\n    // color *= 1.5;\n    // color+=shadowValue*0.1;\n\twmyColor = vec4(0,0,0, 1.0);\n\n//\nreturn wmyColor;\n}\n//--wmy----------------------\n\nvoid main_normal()\n{\n\tvec3 globalDiffuse=u_AmbientColor;\n\t#ifdef LIGHTMAP\t\n\t\tglobalDiffuse += DecodeLightmap(texture2D(u_LightMap, v_LightMapUV));\n\t#endif\n\t\n\t#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n\t\tvec3 normal;\n\t\t#if (defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&defined(NORMALMAP)\n\t\t\tvec3 normalMapSample = texture2D(u_NormalTexture, v_Texcoord0).rgb;\n\t\t\tnormal = normalize(NormalSampleToWorldSpace(normalMapSample, v_Normal, v_Tangent,v_Binormal));\n\t\t#else\n\t\t\tnormal = normalize(v_Normal);\n\t\t#endif\n\t\tvec3 viewDir= normalize(v_ViewDir);\n\t#endif\n\t\n\tvec4 mainColor=u_DiffuseColor;\n\t#ifdef DIFFUSEMAP\n\t\tvec4 difTexColor=texture2D(u_DiffuseTexture, v_Texcoord0);\n\t\tmainColor=mainColor*difTexColor;\n\t#endif \n\t#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n\t\tmainColor=mainColor*v_Color;\n\t#endif \n    \n\t#ifdef ALPHATEST\n\t\tif(mainColor.a<u_AlphaTestValue)\n\t\t\tdiscard;\n\t#endif\n  \n\tvec3 diffuse = vec3(0.0);\n\tvec3 specular= vec3(0.0);\n\t#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n\t\tvec3 dif,spe;\n\t\t#ifdef SPECULARMAP\n\t\t\tvec3 gloss=texture2D(u_SpecularTexture, v_Texcoord0).rgb;\n\t\t#else\n\t\t\t#ifdef DIFFUSEMAP\n\t\t\t\tvec3 gloss=vec3(difTexColor.a);\n\t\t\t#else\n\t\t\t\tvec3 gloss=vec3(1.0);\n\t\t\t#endif\n\t\t#endif\n\t#endif\n\n\t#ifdef DIRECTIONLIGHT\n\t\tLayaAirBlinnPhongDiectionLight(u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_DirectionLight,dif,spe);\n\t\tdiffuse+=dif;\n\t\tspecular+=spe;\n\t#endif\n \n\t#ifdef POINTLIGHT\n\t\tLayaAirBlinnPhongPointLight(v_PositionWorld,u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_PointLight,dif,spe);\n\t\tdiffuse+=dif;\n\t\tspecular+=spe;\n\t#endif\n\n\t#ifdef SPOTLIGHT\n\t\tLayaAirBlinnPhongSpotLight(v_PositionWorld,u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_SpotLight,dif,spe);\n\t\tdiffuse+=dif;\n\t\tspecular+=spe;\n\t#endif\n\t\n\t#ifdef RECEIVESHADOW\n\t\tfloat shadowValue = 1.0;\n\t\t#ifdef SHADOWMAP_PSSM3\n\t\t\tshadowValue = getShadowPSSM3( u_shadowMap1,u_shadowMap2,u_shadowMap3,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);\n\t\t#endif\n\t\t#ifdef SHADOWMAP_PSSM2\n\t\t\tshadowValue = getShadowPSSM2( u_shadowMap1,u_shadowMap2,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);\n\t\t#endif \n\t\t#ifdef SHADOWMAP_PSSM1\n\t\t\tshadowValue = getShadowPSSM1( u_shadowMap1,v_lightMVPPos,u_shadowPSSMDistance,u_shadowPCFoffset,v_posViewZ,0.001);\n\t\t#endif\n\t\t//gl_FragColor =vec4(mainColor.rgb*(globalDiffuse + diffuse)*shadowValue,mainColor.a);\n\t\t//gl_FragColor = wmyMain(mainColor,(globalDiffuse + diffuse * shadowValue * 1.1));\n        gl_FragColor = wmyMain(mainColor,globalDiffuse,diffuse,shadowValue);\n\t#else\n\t\t//gl_FragColor =vec4(mainColor.rgb*(globalDiffuse + diffuse),mainColor.a);\n\t\tgl_FragColor = wmyMain(mainColor,globalDiffuse,diffuse,1.0);\n\t#endif\n    /*\n\t#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n\t\t#ifdef RECEIVESHADOW\n\t\t\tgl_FragColor.rgb+=specular*shadowValue;\n\t\t#else\n\t\t\tgl_FragColor.rgb+=specular;\n\t\t#endif\n\t#endif\n\t*/\n\t#ifdef FOG\n\t\tfloat lerpFact=clamp((1.0/gl_FragCoord.w-u_FogStart)/u_FogRange,0.0,1.0);\n\t\tgl_FragColor.rgb=mix(gl_FragColor.rgb,u_FogColor,lerpFact);\n\t#endif\n}\n\nvoid main()\n{\n\t#ifdef CASTSHADOW\t\t\n\t\tmain_castShadow();\n\t#else\n\t\tmain_normal();\n\t#endif  \n}\n";
        //渲染模式
        vspsArr[0][2] = {};
        //
        for (var i = 0; i < vspsArr.length; i++) {
            var vsps = vspsArr[i];
            this.onSetVsPs(vsps[0], vsps[1], vsps[2]);
        }
    };
    return WmyLaya_wmyLbt;
}(Base_WmyShader_1.default));
exports.default = WmyLaya_wmyLbt;
},{"./Base_WmyShader":18}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyShaderMag = /** @class */ (function () {
    function WmyShaderMag() {
        this.obj = require('./WmyLaya_wmyLbt')['default'];
        if (this.obj)
            new this.obj();
    }
    return WmyShaderMag;
}());
exports.default = WmyShaderMag;
},{"./WmyLaya_wmyLbt":19}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*wmy版本_2018/12/30/*/
var WmyU3dImport = /** @class */ (function () {
    function WmyU3dImport() {
    }
    //
    WmyU3dImport.getClass = function (name) {
        return this[name];
    };
    WmyU3dImport.Ts_DLight = require('./ts/Ts_DLight')['default'];
    WmyU3dImport.Ts_Scene = require('./ts/Ts_Scene')['default'];
    WmyU3dImport.Ts_C4DVetexAnimator = require('./ts/Ts_C4DVetexAnimator')['default'];
    WmyU3dImport.Ts_Mats = require('./ts/Ts_Mats')['default'];
    //扩展
    WmyU3dImport.WmyC4DVetexAnimator = require('../_wmyUtilsH5/d3/c4d/WmyC4DVetexAnimator')['default'];
    WmyU3dImport.WmyPhysics_Character = require('../_wmyUtilsH5/d3/physics/WmyPhysicsWorld_Character')['default'];
    //Laya
    WmyU3dImport.Animator = Laya.Animator;
    return WmyU3dImport;
}());
exports.default = WmyU3dImport;
},{"../_wmyUtilsH5/d3/c4d/WmyC4DVetexAnimator":8,"../_wmyUtilsH5/d3/physics/WmyPhysicsWorld_Character":9,"./ts/Ts_C4DVetexAnimator":24,"./ts/Ts_DLight":25,"./ts/Ts_Mats":26,"./ts/Ts_Scene":27}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyU3dTsConfig = /** @class */ (function () {
    function WmyU3dTsConfig() {
    }
    WmyU3dTsConfig.tsConfig = [
        { "c_ts": "Ts_Mats",
            "targetUrlArr": [
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/35_C2U_\u5E73\u97621_15/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/31_C2U_\u5E73\u97621_11/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/46_C2U_\u5E73\u97621_26/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/28_C2U_\u5E73\u97621_8/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/30_C2U_\u5E73\u97621_10/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/20_C2U_\u5E73\u97621/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/33_C2U_\u5E73\u97621_13/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/26_C2U_\u5E73\u97621_6/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/32_C2U_\u5E73\u97621_12/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/23_C2U_\u5E73\u97621_3/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/29_C2U_\u5E73\u97621_9/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/49_C2U_\u5C9B1/220_C2U_\u5C71/222_C2U_shan_1",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/24_C2U_\u5E73\u97621_4/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/42_C2U_\u5E73\u97621_22/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/27_C2U_\u5E73\u97621_7/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/47_C2U_\u5E73\u97621_27/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/44_C2U_\u5E73\u97621_24/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/38_C2U_\u5E73\u97621_18/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/25_C2U_\u5E73\u97621_5/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/36_C2U_\u5E73\u97621_16/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/22_C2U_\u5E73\u97621_2/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/49_C2U_\u5C9B1/220_C2U_\u5C71/223_C2U_shan_3",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/40_C2U_\u5E73\u97621_20/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/37_C2U_\u5E73\u97621_17/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/48_C2U_\u5E73\u97621_28/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/21_C2U_\u5E73\u97621_1/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/49_C2U_\u5C9B1/220_C2U_\u5C71/224_C2U_shan_4",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/49_C2U_\u5C9B1/220_C2U_\u5C71/221_C2U_shan_2_1",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/45_C2U_\u5E73\u97621_25/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/49_C2U_\u5C9B1/50_C2U_dao_1",
                    "initData": { "isCastShadow": "False",
                        "isReceiveShadow": "True" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/34_C2U_\u5E73\u97621_14/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/39_C2U_\u5E73\u97621_19/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/41_C2U_\u5E73\u97621_21/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/43_C2U_\u5E73\u97621_23/wmyVetex_malu/1_C2U_malu",
                    "initData": { "isCastShadow": "True",
                        "isReceiveShadow": "False" } }
            ] },
        { "c_ts": "Ts_C4DVetexAnimator",
            "targetUrlArr": [
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/25_C2U_\u5E73\u97621_5/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/42_C2U_\u5E73\u97621_22/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/40_C2U_\u5E73\u97621_20/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/22_C2U_\u5E73\u97621_2/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/37_C2U_\u5E73\u97621_17/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/23_C2U_\u5E73\u97621_3/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/26_C2U_\u5E73\u97621_6/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/41_C2U_\u5E73\u97621_21/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/20_C2U_\u5E73\u97621/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/21_C2U_\u5E73\u97621_1/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/29_C2U_\u5E73\u97621_9/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/45_C2U_\u5E73\u97621_25/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/31_C2U_\u5E73\u97621_11/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/27_C2U_\u5E73\u97621_7/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/44_C2U_\u5E73\u97621_24/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/43_C2U_\u5E73\u97621_23/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/30_C2U_\u5E73\u97621_10/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/35_C2U_\u5E73\u97621_15/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/24_C2U_\u5E73\u97621_4/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/33_C2U_\u5E73\u97621_13/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/38_C2U_\u5E73\u97621_18/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/28_C2U_\u5E73\u97621_8/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/39_C2U_\u5E73\u97621_19/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/47_C2U_\u5E73\u97621_27/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/34_C2U_\u5E73\u97621_14/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/36_C2U_\u5E73\u97621_16/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/32_C2U_\u5E73\u97621_12/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/46_C2U_\u5E73\u97621_26/wmyVetex_malu",
                    "initData": {} },
                { "url": "scene/1_C2U_\u4E3B\u573A\u666F/8_C2U_changj/18_C2U_\u8DEF/19_C2U_malu/48_C2U_\u5E73\u97621_28/wmyVetex_malu",
                    "initData": {} }
            ] },
        { "c_ts": "Ts_Scene",
            "targetUrlArr": [
                { "url": "scene",
                    "initData": {} }
            ] },
        { "c_ts": "Ts_DLight",
            "targetUrlArr": [
                { "url": "Directional light",
                    "initData": { "cameraUrl": "scene/1_C2U_\u4E3B\u573A\u666F/4_C2U_\u8F68\u8FF9\u52A8\u753B/5_C2U_shexiangji/6_C2U_\u6444\u50CF\u673A",
                        "isCastShadow": "True" } }
            ] }
    ];
    return WmyU3dTsConfig;
}());
exports.default = WmyU3dTsConfig;
},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*wmy版本_2018/12/28/13:19*/
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
            var targetUrlData = targetUrlArr[i];
            var url = targetUrlData['url'];
            var target = WmyU3dTsMag.getObj3dUrl(this.scene3D, url);
            if (target != null) {
                var newTs = target.addComponent(ts);
                var initData = targetUrlData['initData'];
                for (var key in initData) {
                    if (newTs.hasOwnProperty(key)) {
                        var Value = initData[key];
                        if (!isNaN(Value)) {
                            if (Value.indexOf('.') >= 0) {
                                Value = parseFloat(Value);
                            }
                            else {
                                Value = parseInt(Value);
                            }
                        }
                        else {
                            if (Value.indexOf('True') >= 0) {
                                Value = true;
                            }
                            else if (Value.indexOf('False') >= 0) {
                                Value = false;
                            }
                        }
                        newTs[key] = Value;
                    }
                }
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
},{"../_wmyUtilsH5/d3/WmyScript3D":6,"./WmyU3dImport":21,"./WmyU3dTsConfig":22}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*C4D顶点动画*/
/*wmy版本_2018/12/28*/
var WmyU3dImport_1 = require("../WmyU3dImport");
var WmyScript3D_1 = require("../../_wmyUtilsH5/d3/WmyScript3D");
var Ts_C4DVetexAnimator = /** @class */ (function (_super) {
    __extends(Ts_C4DVetexAnimator, _super);
    function Ts_C4DVetexAnimator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._initPlay = false;
        return _this;
    }
    Ts_C4DVetexAnimator.prototype.onAwake = function () {
        //setShow(false);
        this._c4dVetexAnimator = this.owner3D.getComponent(WmyU3dImport_1.default.getClass('WmyC4DVetexAnimator'));
        if (this._c4dVetexAnimator == null) {
            this._c4dVetexAnimator = this.owner3D.addComponent(WmyU3dImport_1.default.getClass('WmyC4DVetexAnimator'));
        }
        this._anir = this.owner3D.getComponent(WmyU3dImport_1.default.getClass('Animator'));
        if (this._anir != null) {
            this._initPlay = false;
            this._anir.speed = 0;
            this.setShow(false);
        }
    };
    Ts_C4DVetexAnimator.prototype.onPreRender = function () {
        if (!this._initPlay) {
            var parent = this.owner3D.parent;
            if (parent.transform.localScale.x > 0.01 || parent.transform.localScale.y > 0.01 || parent.transform.localScale.z > 0.01) {
                this._initPlay = true;
                this.setShow(true);
                this._anir.speed = 1;
            }
        }
    };
    return Ts_C4DVetexAnimator;
}(WmyScript3D_1.WmyScript3D));
exports.default = Ts_C4DVetexAnimator;
},{"../../_wmyUtilsH5/d3/WmyScript3D":6,"../WmyU3dImport":21}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyScript3D_1 = require("../../_wmyUtilsH5/d3/WmyScript3D");
var Ts_DLight = /** @class */ (function (_super) {
    __extends(Ts_DLight, _super);
    function Ts_DLight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cameraUrl = "";
        /*是否产生阴影*/
        _this.isCastShadow = false;
        return _this;
    }
    Ts_DLight.prototype.onStart = function () {
        this.camera = this.getObj3dUrl(this.scene3D, this.cameraUrl);
        this.directionLight = this.owner;
        //灯光开启阴影
        this.directionLight.shadow = this.isCastShadow;
        //生成阴影贴图尺寸
        this.directionLight.shadowResolution = 1400;
    };
    Ts_DLight.prototype.onUpdate = function () {
        try {
            //可见阴影距离
            this.directionLight.shadowDistance = this.camera.transform.position.y;
        }
        catch (error) {
        }
    };
    return Ts_DLight;
}(WmyScript3D_1.WmyScript3D));
exports.default = Ts_DLight;
},{"../../_wmyUtilsH5/d3/WmyScript3D":6}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyScript3D_1 = require("../../_wmyUtilsH5/d3/WmyScript3D");
var Ts_Mats = /** @class */ (function (_super) {
    __extends(Ts_Mats, _super);
    function Ts_Mats() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /*是否产生阴影*/
        _this.isCastShadow = false;
        /*是否接收阴影*/
        _this.isReceiveShadow = false;
        return _this;
    }
    Ts_Mats.prototype.onStart = function () {
        /*设置阴影*/
        this.onSetShadow(this.isCastShadow, this.isReceiveShadow);
    };
    return Ts_Mats;
}(WmyScript3D_1.WmyScript3D));
exports.default = Ts_Mats;
},{"../../_wmyUtilsH5/d3/WmyScript3D":6}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*场景*/
/*wmy版本_2018/12/29*/
var WmyU3dImport_1 = require("../WmyU3dImport");
var WmyScript3D_1 = require("../../_wmyUtilsH5/d3/WmyScript3D");
var Ts_Scene = /** @class */ (function (_super) {
    __extends(Ts_Scene, _super);
    function Ts_Scene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ts_Scene.prototype.onStart = function () {
        this._anir = this.owner3D.getComponent(WmyU3dImport_1.default.getClass('Animator'));
        if (this._anir != null) {
            this._anir.speed = 1;
        }
    };
    return Ts_Scene;
}(WmyScript3D_1.WmyScript3D));
exports.default = Ts_Scene;
},{"../../_wmyUtilsH5/d3/WmyScript3D":6,"../WmyU3dImport":21}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpcklERV9iZXRhNS9yZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi50cyIsInNyYy9fd215VXRpbHNINS9XbXlVdGlscy50cyIsInNyYy9fd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvV215TG9hZDNkLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteUxvYWRNYXRzLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNELnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvYzRkL1dteUM0RFZldGV4QW5pbWF0b3IudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvcGh5c2ljcy9XbXlQaHlzaWNzV29ybGRfQ2hhcmFjdGVyLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dFYXNlTWFuYWdlci50cyIsInNyYy9fd215VXRpbHNINS93bXlUd2Vlbi9XRWFzZVR5cGUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dUd2Vlbk1hbmFnZXIudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuVmFsdWUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuZXIudHMiLCJzcmMvd215TWF0cy9XbXlNYXRDb25maWcudHMiLCJzcmMvd215TWF0cy9XbXlNYXRNYWcudHMiLCJzcmMvd215U2hhZGVycy9CYXNlX1dteVNoYWRlci50cyIsInNyYy93bXlTaGFkZXJzL1dteUxheWFfd215TGJ0LnRzIiwic3JjL3dteVNoYWRlcnMvV215U2hhZGVyTWFnLnRzIiwic3JjL3dteVUzZFRzL1dteVUzZEltcG9ydC50cyIsInNyYy93bXlVM2RUcy9XbXlVM2RUc0NvbmZpZy50cyIsInNyYy93bXlVM2RUcy9XbXlVM2RUc01hZy50cyIsInNyYy93bXlVM2RUcy90cy9Uc19DNERWZXRleEFuaW1hdG9yLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX0RMaWdodC50cyIsInNyYy93bXlVM2RUcy90cy9Uc19NYXRzLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX1NjZW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1RBLDJEQUEwRDtBQUMxRCxzRUFBcUU7QUFDckUsbURBQWtEO0FBQ2xELHNEQUFpRDtBQUNqRCxpREFBNEM7QUFDNUM7SUFJQztRQUZPLFdBQU0sR0FBQyxHQUFHLENBQUM7UUFDWCxXQUFNLEdBQUMsSUFBSSxDQUFDO1FBRWxCLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU1QyxJQUFJLElBQUksR0FBQyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxJQUFHLElBQUksRUFBQztZQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO1NBQ2hEO2FBQ0c7WUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNuRDtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFD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SUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzVELEtBQUsscUJBQVMsQ0FBQyxNQUFNO2dCQUNwQixPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRSxLQUFLLHFCQUFTLENBQUMsT0FBTztnQkFDckIsSUFBSSxJQUFJLElBQUksUUFBUTtvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xELEtBQUsscUJBQVMsQ0FBQyxTQUFTO2dCQUN2QixJQUFJLElBQUksSUFBSSxDQUFDO29CQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QixJQUFJLElBQUksSUFBSSxRQUFRO29CQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMvQixJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO29CQUFFLE9BQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvQyxLQUFLLHFCQUFTLENBQUMsTUFBTTtnQkFDcEIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdB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QVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUUxRCxDQUFDO0lBQ0QsY0FBQztBQUFELENBWEQsQUFXRSxDQVhtQyx5QkFBVyxHQVc5Qzs7Ozs7QUNmRixNQUFNO0FBQ04sb0JBQW9CO0FBQ3BCLGdEQUEyQztBQUMzQyxnRUFBK0Q7QUFDL0Q7SUFBc0MsNEJBQVc7SUFBakQ7O0lBVUMsQ0FBQztJQVBLLDBCQUFPLEdBQWQ7UUFDQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtZQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDcEI7SUFFRCxDQUFDO0lBQ0QsZUFBQztBQUFELENBVkQsQUFVRSxDQVZvQyx5QkFBVyxHQVUvQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBXbXlVdGlsczNEIH0gZnJvbSBcIi4vX3dteVV0aWxzSDUvZDMvV215VXRpbHMzRFwiO1xyXG5pbXBvcnQgeyBXbXlfTG9hZF9NYWcgfSBmcm9tIFwiLi9fd215VXRpbHNINS9XbXlfTG9hZF9NYWdcIjtcclxuaW1wb3J0IHsgV1R3ZWVuTWFuYWdlciB9IGZyb20gXCIuL193bXlVdGlsc0g1L3dteVR3ZWVuL1dUd2Vlbk1hbmFnZXJcIjtcclxuaW1wb3J0IHsgV215VXRpbHMgfSBmcm9tIFwiLi9fd215VXRpbHNINS9XbXlVdGlsc1wiO1xyXG5pbXBvcnQgV215VTNkVHNNYWcgZnJvbSBcIi4vd215VTNkVHMvV215VTNkVHNNYWdcIjtcclxuaW1wb3J0IFdteU1hdE1hZyBmcm9tIFwiLi93bXlNYXRzL1dteU1hdE1hZ1wiO1xyXG5leHBvcnQgY2xhc3MgTWFpbiB7XHJcblx0cHVibGljIHN0YXRpYyBfdGhpczogTWFpbjtcclxuXHRwdWJsaWMgX3Jvb3RXPTY0MDtcclxuXHRwdWJsaWMgX3Jvb3RIPTExMzY7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRNYWluLl90aGlzPXRoaXM7XHJcblx0XHRMYXlhM0QuaW5pdCh0aGlzLl9yb290VywgdGhpcy5fcm9vdEgpO1xyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblxyXG5cdFx0dmFyIGlzUGM9V215VXRpbHMuZ2V0VGhpcy5pc1BjKCk7XHJcblx0XHRpZihpc1BjKXtcclxuXHRcdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBMYXlhLlN0YWdlLlNDQUxFX1NIT1dBTEw7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IExheWEuU3RhZ2UuU0NBTEVfRlVMTDtcclxuXHRcdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gTGF5YS5TdGFnZS5TQ1JFRU5fVkVSVElDQUw7XHJcblx0XHR9XHJcblx0XHRMYXlhLnN0YWdlLmZyYW1lUmF0ZT1MYXlhLlN0YWdlLkZSQU1FX0ZBU1Q7XHJcblx0XHQvL+iuvue9ruawtOW5s+Wvuem9kFxyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25IID0gXCJjZW50ZXJcIjtcclxuXHRcdC8v6K6+572u5Z6C55u05a+56b2QXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnblYgPSBcIm1pZGRsZVwiO1xyXG5cclxuXHRcdExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRcclxuXHRcdHRoaXNbXCJ2Q29uc29sZVwiXSA9IG5ldyB3aW5kb3dbXCJWQ29uc29sZVwiXSgpO1xyXG5cdFx0dGhpc1tcInZDb25zb2xlXCJdLnN3aXRjaFBvcy5zdGFydFkgPSA0MDtcclxuXHRcdExheWEuU2hhZGVyM0QuZGVidWdNb2RlPXRydWU7XHJcblxyXG5cdFx0Ly/mv4DmtLvotYTmupDniYjmnKzmjqfliLbvvIx2ZXJzaW9uLmpzb27nlLFJREXlj5HluIPlip/og73oh6rliqjnlJ/miJDvvIzlpoLmnpzmsqHmnInkuZ/kuI3lvbHlk43lkI7nu63mtYHnqItcclxuXHRcdHZhciB3bXlWVGltZT1cIlwiO1xyXG5cdFx0aWYod2luZG93IT1udWxsICYmIHdpbmRvd1tcIndteVZUaW1lXCJdIT1udWxsKXtcclxuXHRcdFx0d215VlRpbWU9d2luZG93W1wid215VlRpbWVcIl07XHJcblx0XHR9XHJcblx0XHRMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIit3bXlWVGltZSwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cdH1cclxuXHJcblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0TGF5YS50aW1lci5mcmFtZUxvb3AoMSx0aGlzLHRoaXMuUkVTSVpFKTtcclxuXHRcdFdteV9Mb2FkX01hZy5nZXRUaGlzLm9uU2V0V2V0RGF0YShcImxvYWRJbmZvXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG5cdFx0XHRXbXlfTG9hZF9NYWcuZ2V0VGhpcy5vbmxvYWRTdHIoXCJsb2FkXCIsIG5ldyBMYXlhLkhhbmRsZXIodGhpcywgdGhpcy5vbkxvYWRNYWluKSk7XHJcblx0XHR9KSk7XHJcblx0fVxyXG5cdFxyXG5cdFJFU0laRSgpIHtcclxuXHRcdHZhciBzdz1MYXlhLnN0YWdlLndpZHRoL3RoaXMuX3Jvb3RXO1xyXG5cdFx0dmFyIHNoPUxheWEuc3RhZ2UuaGVpZ2h0L3RoaXMuX3Jvb3RIO1xyXG5cdFx0aWYgKHRoaXMuX3VpU2NlbmUgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl91aVNjZW5lLnNjYWxlWD1zdztcclxuXHRcdFx0dGhpcy5fdWlTY2VuZS5zY2FsZVk9c3c7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5fdWlTY2VuZSAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX3VpUm9vdC53aWR0aCA9IExheWEuc3RhZ2Uud2lkdGgvc3c7XHJcblx0XHRcdHRoaXMuX3VpUm9vdC5oZWlnaHQgPSBMYXlhLnN0YWdlLmhlaWdodC9zdztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fTG9hZFJvb3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl9Mb2FkUm9vdC53aWR0aCA9IHRoaXMuX3VpUm9vdC53aWR0aDtcclxuXHRcdFx0dGhpcy5fTG9hZFJvb3QuaGVpZ2h0ID0gdGhpcy5fdWlSb290LmhlaWdodDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fbWFpblZpZXcgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl9tYWluVmlldy53aWR0aCA9IHRoaXMuX3VpUm9vdC53aWR0aDtcclxuXHRcdFx0dGhpcy5fbWFpblZpZXcuaGVpZ2h0ID0gdGhpcy5fdWlSb290LmhlaWdodDtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91aVNjZW5lOiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX3VpUm9vdDogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHJcblx0cHJpdmF0ZSBfTG9hZFJvb3Q6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfTG9hZEJveDogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHRwcml2YXRlIF9iYXI6IGZhaXJ5Z3VpLkdQcm9ncmVzc0JhcjtcclxuXHJcblx0cHJpdmF0ZSBfbWFpblZpZXc6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblxyXG5cdHByaXZhdGUgb25Mb2FkTWFpbigpIHtcclxuXHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuXHRcdHRoaXMuX3VpU2NlbmU9bmV3IGZhaXJ5Z3VpLkdDb21wb25lbnQoKTtcclxuXHRcdGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQodGhpcy5fdWlTY2VuZSk7XHJcblx0XHR0aGlzLl91aVJvb3Q9bmV3IGZhaXJ5Z3VpLkdDb21wb25lbnQoKTtcclxuXHRcdHRoaXMuX3VpU2NlbmUuYWRkQ2hpbGQodGhpcy5fdWlSb290KTtcclxuXHJcblx0XHR0aGlzLl9Mb2FkUm9vdCA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJsb2FkXCIsIFwiTG9hZFJvb3RcIikuYXNDb207XHJcblx0XHR0aGlzLl91aVJvb3QuYWRkQ2hpbGQodGhpcy5fTG9hZFJvb3QpO1xyXG5cdFx0dGhpcy5fTG9hZEJveCA9IHRoaXMuX0xvYWRSb290LmdldENoaWxkKFwiX0xvYWRCb3hcIikuYXNDb207XHJcblxyXG5cdFx0dGhpcy5fYmFyID0gdGhpcy5fTG9hZEJveC5nZXRDaGlsZChcImJhclwiKS5hc1Byb2dyZXNzO1xyXG5cclxuXHRcdFdteV9Mb2FkX01hZy5nZXRUaGlzLm9uQXV0b0xvYWRBbGwobmV3IExheWEuSGFuZGxlcih0aGlzLCB0aGlzLm9uTG9hZE9rKSwgbmV3IExheWEuSGFuZGxlcih0aGlzLCB0aGlzLm9uTG9hZGluZykpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkxvYWRpbmcocHJvZ3Jlc3M6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0dmFyIHR3ZWVuID0gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpO1xyXG5cdFx0dHdlZW4uc2V0VGFyZ2V0KHRoaXMsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5fb25Mb2FkaW5nLCBudWxsLCBmYWxzZSkpO1xyXG5cdFx0aWYodGhpcy5fYmFyKXtcclxuXHRcdFx0dHdlZW4uX3RvKHRoaXMuX2Jhci52YWx1ZSwgcHJvZ3Jlc3MsIDAuMjUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRwcml2YXRlIF9vbkxvYWRpbmcodGFyZ2V0LCBwKSB7XHJcblx0XHRpZih0aGlzLl9iYXIpe1xyXG5cdFx0XHR0aGlzLl9iYXIudmFsdWUgPSBwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfc2NlbmUzRDpMYXlhLlNjZW5lM0Q7XHJcblx0cHJpdmF0ZSBvbkxvYWRPayh1aUFyciwgdTNkQXJyKSB7XHJcblx0XHQvL+a3u+WKoDNEXHJcbiAgICAgICAgdmFyIHVybDNkPXUzZEFyclswXS51cmxMaXN0WzBdO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lM0QgPUxheWEubG9hZGVyLmdldFJlcyh1cmwzZCk7XHJcblx0XHQvL+iHquWKqOa3u+WKoOadkOi0qFxyXG5cdFx0dGhpcy5fc2NlbmUzRC5hZGRDb21wb25lbnQoV215TWF0TWFnKTtcclxuXHRcdC8v6Ieq5Yqo5re75YqgVTNE6ISa5pysXHJcblx0XHR0aGlzLl9zY2VuZTNELmFkZENvbXBvbmVudChXbXlVM2RUc01hZyk7XHJcblxyXG5cdFx0V1R3ZWVuTWFuYWdlci5raWxsVHdlZW5zKHRoaXMpO1xyXG5cdFx0dGhpcy5vbk1haW4oKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25NYWluKCl7XHJcblx0XHR0aGlzLl9tYWluVmlldyA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJtYWluXCIsIFwiTWFpblwiKS5hc0NvbTtcclxuXHRcdGlmICh0aGlzLl9tYWluVmlldyAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX3VpUm9vdC5hZGRDaGlsZEF0KHRoaXMuX21haW5WaWV3LCAwKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgX01haW49dGhpcy5fbWFpblZpZXcuZ2V0Q2hpbGQoXCJfTWFpblwiKS5hc0NvbTtcclxuXHRcdHZhciBkM0JveD1fTWFpbi5nZXRDaGlsZChcImQzQm94XCIpO1xyXG5cdFx0ZDNCb3guZGlzcGxheU9iamVjdC5hZGRDaGlsZCh0aGlzLl9zY2VuZTNEKTtcclxuXHJcblx0XHRXVHdlZW5NYW5hZ2VyLmtpbGxUd2VlbnModGhpcyk7XHJcblx0XHR0aGlzLl91aVJvb3QucmVtb3ZlQ2hpbGQodGhpcy5fTG9hZFJvb3QpO1xyXG5cdFx0dGhpcy5fTG9hZFJvb3QgPSBudWxsO1xyXG5cdFx0dGhpcy5fYmFyID0gbnVsbDtcclxuXHJcblxyXG5cdFx0Ly8gLy/liqDovb0zROWcuuaZr1xyXG5cdFx0Ly8gTGF5YS5TY2VuZTNELmxvYWQoJ3Jlcy91M2QvbWFpbi9Db252ZW50aW9uYWwvMS5scycsIExheWEuSGFuZGxlci5jcmVhdGUobnVsbCwgZnVuY3Rpb24oc2NlbmUpe1xyXG5cdFx0Ly8gXHQvL+iHquWKqOe7keWumlUzROiEmuacrFxyXG5cdFx0Ly8gXHRzY2VuZS5hZGRDb21wb25lbnQoV215VTNkVHNNYWcpO1xyXG5cdFx0Ly8gXHQvL+WcuuaZr+a3u+WKoOWIsOiInuWPsFxyXG5cdFx0Ly8gXHRMYXlhLnN0YWdlLmFkZENoaWxkKHNjZW5lKTtcclxuXHJcblx0XHQvLyBcdC8vIHZhciB3bXlWZXRleF9mejAxPVdteVV0aWxzM0QuZ2V0T2JqM2RVcmwoc2NlbmUsXCIxLzIvMy93bXlWZXRleF9mejAxQDFcIikgYXMgTGF5YS5TcHJpdGUzRDtcclxuXHRcdC8vIFx0Ly8gd215VmV0ZXhfZnowMS5ldmVudChcImFuaV9wbGF5XCIpO1xyXG5cclxuXHRcdC8vIFx0Ly8gTGF5YS50aW1lci5vbmNlKDEwMDAsdGhpcywoKT0+e1xyXG5cdFx0Ly8gXHQvLyBcdHdteVZldGV4X2Z6MDEuZXZlbnQoXCJhbmlfcGxheVwiKTtcclxuXHRcdC8vIFx0Ly8gfSlcclxuXHJcblx0XHQvLyB9KSk7XHJcblx0fVxyXG5cdFxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsIlxyXG5leHBvcnQgY2xhc3MgV215VXRpbHMgZXh0ZW5kcyBsYXlhLmV2ZW50cy5FdmVudERpc3BhdGNoZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM6V215VXRpbHM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215VXRpbHN7XHJcbiAgICAgICAgaWYoV215VXRpbHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlVdGlscy5fdGhpcz1uZXcgV215VXRpbHMoKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215VXRpbHMuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5fX2xvb3ApO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfRE9XTix0aGlzLCB0aGlzLl9fb25Ub3VjaERvd24pO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfVVAsdGhpcywgdGhpcy5fX29uVG91Y2hVcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5fX09uTW91c2VNT1ZFKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuUkVTSVpFLHRoaXMsdGhpcy5fX29uUmVzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgQ09MT1JfRklMVEVSU19NQVRSSVg6IEFycmF5PGFueT49W1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vUlxyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vR1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vQlxyXG4gICAgICAgIDAsIDAsIDAsIDEsIDAsIC8vQVxyXG4gICAgXTtcclxuICAgIC8v6L2s5o2i6aKc6ImyXHJcbiAgICBwdWJsaWMgY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXIsYT86bnVtYmVyKTpBcnJheTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMF09cjtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFs2XT1nO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzEyXT1iO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzE4XT1hfHwxO1xyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWDtcclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnModGFyZ2V0OkxheWEuU3ByaXRlLGNvbG9yOm51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKGNvbG9yICE9IDB4ZmZmZmZmKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgoXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj4xNikgJiAweGZmKS8yNTUsXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj44KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgIChjb2xvciAmIDB4ZmYpLzI1NVxyXG4gICAgICAgICAgICAgICAgKSldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnMxKHRhcmdldDpMYXlhLlNwcml0ZSxyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlcnM9bnVsbDtcclxuICAgICAgICBpZihyIDwgMSB8fCBnIDwgMSB8fCBiIDwgMSB8fCBhIDwgMSl7XHJcbiAgICAgICAgICAgIHRhcmdldC5maWx0ZXJzPVtuZXcgTGF5YS5Db2xvckZpbHRlcih0aGlzLmNvbnZlcnRDb2xvclRvQ29sb3JGaWx0ZXJzTWF0cml4KHIsZyxiLGEpKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5Yik5pat5omL5py65oiWUENcclxuICAgIHB1YmxpYyBpc1BjKCk6Ym9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHZhciBpc1BjOmJvb2xlYW49ZmFsc2U7XHJcbiAgICAgICAgaWYodGhpcy52ZXJzaW9ucygpLmFuZHJvaWQgfHwgdGhpcy52ZXJzaW9ucygpLmlQaG9uZSB8fCB0aGlzLnZlcnNpb25zKCkuaW9zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXNQYz1mYWxzZTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnZlcnNpb25zKCkuaVBhZCl7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpc1BjPXRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzUGM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmVyc2lvbnMoKXtcclxuICAgICAgICB2YXIgdTpzdHJpbmcgPSBuYXZpZ2F0b3IudXNlckFnZW50LCBhcHA6c3RyaW5nID0gbmF2aWdhdG9yLmFwcFZlcnNpb247XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLy/np7vliqjnu4jnq6/mtY/op4jlmajniYjmnKzkv6Hmga9cclxuICAgICAgICAgICAgdHJpZGVudDogdS5pbmRleE9mKCdUcmlkZW50JykgPiAtMSwgLy9JReWGheaguFxyXG4gICAgICAgICAgICBwcmVzdG86IHUuaW5kZXhPZignUHJlc3RvJykgPiAtMSwgLy9vcGVyYeWGheaguFxyXG4gICAgICAgICAgICB3ZWJLaXQ6IHUuaW5kZXhPZignQXBwbGVXZWJLaXQnKSA+IC0xLCAvL+iLueaenOOAgeiwt+atjOWGheaguFxyXG4gICAgICAgICAgICBnZWNrbzogdS5pbmRleE9mKCdHZWNrbycpID4gLTEgJiYgdS5pbmRleE9mKCdLSFRNTCcpID09IC0xLCAvL+eBq+eLkOWGheaguFxyXG4gICAgICAgICAgICBtb2JpbGU6ICEhdS5tYXRjaCgvQXBwbGVXZWJLaXQuKk1vYmlsZS4qLyl8fCEhdS5tYXRjaCgvQXBwbGVXZWJLaXQvKSwgLy/mmK/lkKbkuLrnp7vliqjnu4jnq69cclxuICAgICAgICAgICAgaW9zOiAhIXUubWF0Y2goL1xcKGlbXjtdKzsoIFU7KT8gQ1BVLitNYWMgT1MgWC8pLCAvL2lvc+e7iOerr1xyXG4gICAgICAgICAgICBhbmRyb2lkOiB1LmluZGV4T2YoJ0FuZHJvaWQnKSA+IC0xIHx8IHUuaW5kZXhPZignTGludXgnKSA+IC0xLCAvL2FuZHJvaWTnu4jnq6/miJbogIV1Y+a1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGhvbmU6IHUuaW5kZXhPZignaVBob25lJykgPiAtMSB8fCB1LmluZGV4T2YoJ01hYycpID4gLTEsIC8v5piv5ZCm5Li6aVBob25l5oiW6ICFUVFIROa1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGFkOiB1LmluZGV4T2YoJ2lQYWQnKSA+IC0xLCAvL+aYr+WQpmlQYWRcclxuICAgICAgICAgICAgd2ViQXBwOiB1LmluZGV4T2YoJ1NhZmFyaScpID09IC0xIC8v5piv5ZCmd2Vi5bqU6K+l56iL5bqP77yM5rKh5pyJ5aS06YOo5LiO5bqV6YOoXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VXJsVihrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgcmVnPSBuZXcgUmVnRXhwKFwiKF58JilcIitrZXkrXCI9KFteJl0qKSgmfCQpXCIpO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ/ZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdFsyXSk6bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25OYXZpZ2F0ZSh1cmw6c3RyaW5nLGlzUmVwbGFjZTpib29sZWFuPWZhbHNlKXtcclxuICAgICAgICBpZihpc1JlcGxhY2Upe1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh1cmwpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPXVybDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZXZlbnRMaXN0OkFycmF5PGxheWEuZXZlbnRzLkV2ZW50Pj1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaERvd24oZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdC5pbmRleE9mKGV2dCk8MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5wdXNoKGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uVG91Y2hVcChldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KT49MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5zcGxpY2UodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uUmVzaXplKCl7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0LmZvckVhY2goZXZ0ID0+IHtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcblx0XHR9KTtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3Q9bmV3IEFycmF5PGxheWEuZXZlbnRzLkV2ZW50PigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9fT25Nb3VzZU1PVkUoZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBiTnVtPTEwO1xyXG4gICAgICAgIGlmKGV2dC5zdGFnZVggPD0gYk51bSB8fCBldnQuc3RhZ2VYID49IExheWEuc3RhZ2Uud2lkdGgtYk51bSB8fFxyXG4gICAgICAgICAgICBldnQuc3RhZ2VZIDw9IGJOdW0gfHwgZXZ0LnN0YWdlWSA+PSBMYXlhLnN0YWdlLmhlaWdodC1iTnVtKXtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4sbD0yKXtcclxuXHRcdGlmKChuK1wiXCIpLmluZGV4T2YoXCIuXCIpPj0wKXtcclxuXHRcdCAgICBuPXBhcnNlRmxvYXQobi50b0ZpeGVkKGwpKTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gbjtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSX1hZKGQsIHIpXHJcbiAgICB7XHJcbiAgICBcdHZhciByYWRpYW4gPSAociAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgXHR2YXIgY29zID0gIE1hdGguY29zKHJhZGlhbik7XHJcbiAgICBcdHZhciBzaW4gPSAgTWF0aC5zaW4ocmFkaWFuKTtcclxuICAgIFx0XHJcbiAgICBcdHZhciBkeD1kICogY29zO1xyXG4gICAgXHR2YXIgZHk9ZCAqIHNpbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBMYXlhLlBvaW50KGR4ICwgZHkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICBwdWJsaWMgc3RhdGljIHN0cmluZzJidWZmZXIoc3RyKTpBcnJheUJ1ZmZlciB7XHJcbiAgICAgICAgLy8g6aaW5YWI5bCG5a2X56ym5Liy6L2s5Li6MTbov5vliLZcclxuICAgICAgICBsZXQgdmFsID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgdmFsID0gc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFsICs9ICcsJyArIHN0ci5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5bCGMTbov5vliLbovazljJbkuLpBcnJheUJ1ZmZlclxyXG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSh2YWwubWF0Y2goL1tcXGRhLWZdezJ9L2dpKS5tYXAoZnVuY3Rpb24gKGgpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoaCwgMTYpXHJcbiAgICAgICAgfSkpLmJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlcGxhY2VBbGwoc3RyLCBvbGRTdHIsIG5ld1N0cil7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnOyAgXHJcbiAgICAgICAgdGVtcCA9IHN0ci5yZXBsYWNlKG9sZFN0ciwgbmV3U3RyKTtcclxuICAgICAgICBpZih0ZW1wLmluZGV4T2Yob2xkU3RyKT49MCl7XHJcbiAgICAgICAgICAgIHRlbXAgPSB0aGlzLnJlcGxhY2VBbGwodGVtcCwgb2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDsgIFxyXG4gICAgfSAgXHJcblxyXG4gICAgLy/lpKflsI/lhpnovazmjaJcclxuICAgIHB1YmxpYyBzdGF0aWMgdG9DYXNlKHN0cjpzdHJpbmcsIGlzRHg9ZmFsc2UpeyAgXHJcbiAgICAgICAgdmFyIHRlbXAgPSAnJztcclxuICAgICAgICBpZighaXNEeCl7XHJcbiAgICAgICAgICAgIC8v6L2s5o2i5Li65bCP5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIC8v6L2s5YyW5Li65aSn5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9IFxyXG5cclxuICAgIFxyXG4gICAgLy/ot53nprtcclxuXHRwdWJsaWMgc3RhdGljIGdldERpc3RhbmNlKGE6TGF5YS5Qb2ludCxiOkxheWEuUG9pbnQpOm51bWJlciB7XHJcblx0XHR2YXIgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xyXG5cdFx0dmFyIGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcclxuXHRcdHZhciBkPU1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpO1xyXG5cdFx0ZD1wYXJzZUZsb2F0KGQudG9GaXhlZCgyKSk7XHJcblx0XHRyZXR1cm4gZDtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRYeVRvUih5LHgpOm51bWJlcntcclxuICAgICAgICB2YXIgcmFkaWFuPU1hdGguYXRhbjIoeSx4KTtcclxuICAgICAgICB2YXIgcj0oMTgwL01hdGguUEkqcmFkaWFuKTtcclxuICAgICAgICByPXRoaXMub25OdW1UbyhyKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0b3JhZ2Uoa2V5LCB2YWx1ZTphbnk9XCI/XCIsIGlzTG9jYWw9dHJ1ZSk6YW55e1xyXG4gICAgICAgIHZhciBzdG9yYWdlOmFueT1pc0xvY2FsP2xvY2FsU3RvcmFnZTpzZXNzaW9uU3RvcmFnZTtcclxuICAgICAgICBpZih2YWx1ZT09XCI/XCIpe1xyXG5cdFx0XHR2YXIgZGF0YSA9IHN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYodmFsdWU9PW51bGwpe1xyXG5cdFx0XHRzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy/mkq3mlL7lo7Dpn7NcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheUZ1aVNvdW5kKF91cmwsdm9sdW1lPTAuMixjb21wbGV0ZUhhbmRsZXI/LHN0YXJ0VGltZT0wLGxvb3BzPTEpe1xyXG4gICAgICAgIGlmKHZvbHVtZTw9MClyZXR1cm47XHJcbiAgICAgICAgdmFyIGl0ZW09ZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1CeVVSTChfdXJsKTtcclxuICAgICAgICB2YXIgdXJsPWl0ZW0uZmlsZTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQodXJsLGxvb3BzLGNvbXBsZXRlSGFuZGxlcixudWxsLHN0YXJ0VGltZSk7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIuc2V0U291bmRWb2x1bWUodm9sdW1lLHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/mtYXmi7fotJ1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2hhbGxvd0NvcHkob2JqKXtcclxuICAgICAgICAvLyDlj6rmi7fotJ3lr7nosaFcclxuICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHJldHVybjtcclxuICAgICAgICAvLyDmoLnmja5vYmrnmoTnsbvlnovliKTmlq3mmK/mlrDlu7rkuIDkuKrmlbDnu4Tov5jmmK/kuIDkuKrlr7nosaFcclxuICAgICAgICB2YXIgbmV3T2JqID0gb2JqIGluc3RhbmNlb2YgQXJyYXkgPyBbXSA6IHt9O1xyXG4gICAgICAgIC8vIOmBjeWOhm9iaizlubbkuJTliKTmlq3mmK9vYmrnmoTlsZ7mgKfmiY3mi7fotJ1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICBuZXdPYmpba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgLy/mt7Hmi7fotJ1cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVlcENvcHkob2JqKXtcclxuICAgICAgICAvLyDlj6rmi7fotJ3lr7nosaFcclxuICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHJldHVybjtcclxuICAgICAgICAvLyDmoLnmja5vYmrnmoTnsbvlnovliKTmlq3mmK/mlrDlu7rkuIDkuKrmlbDnu4Tov5jmmK/kuIDkuKrlr7nosaFcclxuICAgICAgICB2YXIgbmV3T2JqID0gb2JqIGluc3RhbmNlb2YgQXJyYXkgPyBbXSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgLy8g6YGN5Y6Gb2JqLOW5tuS4lOWIpOaWreaYr29iaueahOWxnuaAp+aJjeaLt+i0nVxyXG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIOWIpOaWreWxnuaAp+WAvOeahOexu+Wei++8jOWmguaenOaYr+WvueixoemAkuW9kuiwg+eUqOa3seaLt+i0nVxyXG4gICAgICAgICAgICAgICAgbmV3T2JqW2tleV0gPSB0eXBlb2Ygb2JqW2tleV0gPT09ICdvYmplY3QnID8gdGhpcy5kZWVwQ29weShvYmpba2V5XSkgOiBvYmpba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3T2JqO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFdteVV0aWxzIH0gZnJvbSBcIi4vV215VXRpbHNcIjtcclxuaW1wb3J0IHsgV215TG9hZDNkIH0gZnJvbSBcIi4vZDMvV215TG9hZDNkXCI7XHJcbmltcG9ydCB7IFdteUxvYWRNYXRzIH0gZnJvbSBcIi4vZDMvV215TG9hZE1hdHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlfTG9hZF9NYWdcclxue1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215X0xvYWRfTWFne1xyXG4gICAgICAgIGlmKFdteV9Mb2FkX01hZy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteV9Mb2FkX01hZy5fdGhpcz1uZXcgV215X0xvYWRfTWFnKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlfTG9hZF9NYWcuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF93ZXREYXRhOmFueT17fTtcclxuXHJcbiAgICBwdWJsaWMgZGF0YU5hbWU6c3RyaW5nPVwiXCI7XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRSZXNPYmoocmVzTmFtZTpzdHJpbmcsZGF0YU5hbWU/KXtcclxuICAgICAgICB2YXIgd2ViRGF0YTphbnk7XHJcbiAgICAgICAgaWYoZGF0YU5hbWU9PW51bGwpe1xyXG4gICAgICAgICAgICBkYXRhTmFtZT10aGlzLmRhdGFOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3ZWJEYXRhPXRoaXMuX3dldERhdGFbZGF0YU5hbWVdO1xyXG4gICAgICAgIGlmKHdlYkRhdGE9PW51bGwpe1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLnqbrmlbDmja5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYXJyOkFycmF5PGFueT49bnVsbDtcclxuICAgICAgICBpZih3ZWJEYXRhIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBhcnI9d2ViRGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc09iaj1udWxsO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPWFycltpXTtcclxuICAgICAgICAgICAgaWYob2JqW1wicmVzTmFtZVwiXT09cmVzTmFtZSl7XHJcbiAgICAgICAgICAgICAgICByZXNPYmo9b2JqO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc09iajtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25TZXRXZXREYXRhKGRhdGFOYW1lOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgaWYod2luZG93W2RhdGFOYW1lXT09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdGhpcy5kYXRhTmFtZT1kYXRhTmFtZTtcclxuICAgICAgICB0aGlzLl93ZXREYXRhW2RhdGFOYW1lXT13aW5kb3dbZGF0YU5hbWVdO1xyXG4gICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5fd2V0RGF0YVtkYXRhTmFtZV1dKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25sb2FkU3RyKHN0cjpzdHJpbmcsY2FsbGJhY2tPaz86TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc09iaj10aGlzLmdldFJlc09iaihzdHIpO1xyXG4gICAgICAgIGlmKHJlc09iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMub25sb2FkKHJlc09iaixjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJvbmxvYWRTdHIt5Ye66ZSZOlwiLHN0cik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Jlc0RhdGFBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6QXJyYXk8YW55Pj1bXTtcclxuICAgIHB1YmxpYyBvbmxvYWQocmVzT2JqOmFueSxjYWxsYmFja09rPzpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgcmVzTmFtZT1yZXNPYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgIGlmKHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdLnJ1bldpdGgoW3RoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc09ialtcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6YW55PXt9O1xyXG4gICAgICAgICAgICB2YXIgcmVzRGF0YTpzdHJpbmc9cmVzT2JqW1wicmVzRGF0YVwiXTtcclxuICAgICAgICAgICAgaWYocmVzRGF0YSE9bnVsbCAmJiByZXNEYXRhIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YT1KU09OLnBhcnNlKHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIixyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWVVcmw7XHJcbiAgICAgICAgICAgIHZhciB1cmxBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdmFyIGlzQ3JlYXRlPWZhbHNlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc1VybD1XbXlVdGlscy50b0Nhc2UocmVzVXJsKTtcclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgaWYodXJsLmluZGV4T2YoXCIudHh0XCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLkJVRkZFUn0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJOYW1lVXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodXJsLmluZGV4T2YoXCIuanBnXCIpPj0wIHx8IHVybC5pbmRleE9mKFwiLnBuZ1wiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5JTUFHRX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih1cmwuaW5kZXhPZihcIi5tcDNcIik+PTAgfHwgdXJsLmluZGV4T2YoXCIud2F2XCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLlNPVU5EfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsQXJyLmxlbmd0aDw9MClyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsQXJyLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uQXNzZXRDb25tcGxldGUsW3Jlc05hbWUsYk5hbWVVcmwsZGF0YV0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkFzc2V0UHJvZ3Jlc3MsIFtyZXNOYW1lXSwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgb25DbGVhcjNkUmVzKHVybCl7XHJcbiAgICAgICAgTGF5YS5SZXNvdXJjZS5kZXN0cm95VW51c2VkUmVzb3VyY2VzKCk7XHJcbiAgICAgICAgV215TG9hZDNkLmdldFRoaXMuY2xlYXJSZXModXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkM2RPbmUodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIFdteUxvYWQzZC5vbkxvYWQzZE9uZSh1cmwsY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25sb2FkM2QocmVzT2JqOmFueSxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNOYW1lPXJlc09ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgaWYodGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0ucnVuV2l0aChbdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzT2JqW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTphbnk9e307XHJcbiAgICAgICAgICAgIHZhciByZXNEYXRhOnN0cmluZz1yZXNPYmpbXCJyZXNEYXRhXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNEYXRhIT1udWxsICYmIHJlc0RhdGEhPVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhPUpTT04ucGFyc2UocmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZTtcclxuICAgICAgICAgICAgdmFyIHVybEFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB2YXIgdXJsTGlzdDpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsLmluZGV4T2YoXCIubHNcIik+PTAgfHwgcmVzVXJsLmluZGV4T2YoXCIubGhcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsQXJyLmxlbmd0aDw9MClyZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGEudXJsTGlzdD11cmxMaXN0O1xyXG4gICAgICAgICAgICBXbXlMb2FkM2QuZ2V0VGhpcy5vbmxvYWQzZCh1cmxBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Bc3NldENvbm1wbGV0ZSxbcmVzTmFtZSxiTmFtZSxkYXRhXSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQXNzZXRQcm9ncmVzcywgW3Jlc05hbWVdLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcblx0cHJpdmF0ZSBvbkFzc2V0UHJvZ3Jlc3MocmVzTmFtZSxwcm9ncmVzcyk6IHZvaWQge1xyXG4gICAgICAgIHZhciBjYWxsYmFja1Byb2dyZXNzQXJyOkFycmF5PExheWEuSGFuZGxlcj49dGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrUHJvZ3Jlc3NBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gY2FsbGJhY2tQcm9ncmVzc0FycltpXTtcclxuICAgICAgICAgICAgY2FsbGJhY2sucnVuV2l0aChbcHJvZ3Jlc3NdKTtcclxuICAgICAgICB9XHJcblx0fVxyXG4gICAgXHJcbiAgICBwcml2YXRlIG9uQXNzZXRDb25tcGxldGUocmVzTmFtZSxiTmFtZVVybDpzdHJpbmcsZGF0YSk6dm9pZHtcclxuICAgICAgICB2YXIgY2FsbGJhY2tPa0FycjpBcnJheTxMYXlhLkhhbmRsZXI+PXRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV07XHJcbiAgICAgICAgaWYoYk5hbWVVcmwhPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgYmFvPUxheWEubG9hZGVyLmdldFJlcyhiTmFtZVVybCk7XHJcbiAgICAgICAgICAgIHZhciBiTmFtZSA9IGJOYW1lVXJsLnJlcGxhY2UoXCIudHh0XCIsXCJcIik7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBmYWlyeWd1aS5VSVBhY2thZ2UuYWRkUGFja2FnZShiTmFtZSxiYW8pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRlVJLeWHuumUmTpcIixiTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lQXJyPWJOYW1lLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgZGF0YS5iTmFtZT1iTmFtZUFycltiTmFtZUFyci5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV09ZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja09rQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFja09rID0gY2FsbGJhY2tPa0FycltpXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW2RhdGFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPW51bGw7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1udWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzQXV0b0xvYWRQPWZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaXNVM2Q9ZmFsc2U7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZEluZm9BcnI6YW55O1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRyQ2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkQWxsKGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHdlYkRhdGE6YW55PXRoaXMuX3dldERhdGFbdGhpcy5kYXRhTmFtZV07XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhcnI9PW51bGwpe1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyPUpTT04ucGFyc2Uod2ViRGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLmnZDmlpnmlbDmja7plJnor69cIix3ZWJEYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyPXt9O1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXT0wO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl09MDtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXT1bXTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl09W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9YXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzTmFtZT1vYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgICAgICB2YXIgdD1vYmpbXCJ0eXBlXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNOYW1lPT1udWxsIHx8IHJlc05hbWU9PVwiXCIgfHwgdD09bnVsbCB8fCB0PT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uQXV0b0xvYWRPYmoodCxyZXNOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faXNBdXRvTG9hZFA9dHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25BdXRvTG9hZE9iaih0eXBlOnN0cmluZyxyZXNOYW1lKXtcclxuICAgICAgICB2YXIgcmVzPXRoaXMuZ2V0UmVzT2JqKHJlc05hbWUpO1xyXG4gICAgICAgIGlmKHJlcz09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIHJlc0lkPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdPXt9O1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJuXCJdPXJlc05hbWU7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInRcIl09dHlwZTtcclxuICAgICAgICB2YXIgbG9hZE9rPWZhbHNlO1xyXG4gICAgICAgIGlmKHR5cGU9PVwidWlcIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInVpLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZDNkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzVTNkPXRydWU7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidTNkLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZT09XCJtYXRzXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgdXJsTGlzdDpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgcmVzVXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgocmVzVXJsKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIHVybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybExpc3QubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZE1hdHMuZ2V0VGhpcy5vbmxvYWQzZCh1cmxMaXN0LG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgICAgICBsb2FkT2s9dHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibWF0cy3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGU9PVwiY3ViZU1hcFwiKXtcclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc1tcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgTGF5YS5UZXh0dXJlQ3ViZS5sb2FkKHVybCxudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlPT1cImF1ZGlvXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJhdWRpby3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdWJlKHJlc05hbWUsIGNvbXBsZXRlOiBMYXlhLkhhbmRsZXIpOkFycmF5PExheWEuVGV4dHVyZUN1YmU+e1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgIHZhciBSZXNyZXNPYmo6QXJyYXk8TGF5YS5UZXh0dXJlQ3ViZT49W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgIHJlc1VybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHJlc1VybCk7XHJcbiAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG5ldyBMYXlhLkhhbmRsZXIodGhpcyxjdWJlPT57XHJcbiAgICAgICAgICAgICAgICBSZXNyZXNPYmpbaV09Y3ViZTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlLnJ1bldpdGgoW2N1YmUsaV0pO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBSZXNyZXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkxvYWRpbmcocmVzSWQsIHByb2dyZXNzOm51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHZhciBwQz0wO1xyXG4gICAgICAgIGlmKCF0aGlzLl9pc0F1dG9Mb2FkUCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwQ10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInBcIl09cHJvZ3Jlc3M7XHJcbiAgICAgICAgdmFyIG51bT10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl07XHJcbiAgICAgICAgdmFyIHBOdW09MDtcclxuICAgICAgICB2YXIgcFM9MS9udW07XHJcbiAgICAgICAgdmFyIHAwPTAscDE9MDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPG51bTtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltpXTtcclxuICAgICAgICAgICAgdmFyIHA9b2JqW1wicFwiXTtcclxuICAgICAgICAgICAgaWYocCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9pc1UzZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYob2JqW1widFwiXT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAxPXAqKHBTKihpKzEpKSowLjg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAwPXAqKHBTKihpKzEpKSowLjI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBOdW09cDArcDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHBOdW09cCoocFMqKGkrMSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBDPXBOdW0qMTAwO1xyXG4gICAgICAgIGlmKGlzTmFOKHBDKSlwQz0wO1xyXG4gICAgICAgIGlmKHBDPjEpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocEMpO1xyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BDXSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkxvYWRPayhyZXNJZCxkYXRhPyl7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXSs9MTtcclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT09XCJ1aVwiKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl0ucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdPj10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0pe1xyXG4gICAgICAgICAgICBpZih0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl0sdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufSIsImltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi9XbXlVdGlsczNEXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215TG9hZDNke1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZDNke1xyXG4gICAgICAgIGlmKFdteUxvYWQzZC5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5fdGhpcz1uZXcgV215TG9hZDNkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlMb2FkM2QuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3VybExpc3Q6QXJyYXk8c3RyaW5nPjtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcixpc0NsZWFyUmVzPyl7XHJcbiAgICAgICAgdGhpcy5fdXJsTGlzdD1bXTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybDpzdHJpbmc9dXJsTGlzdFtpXVtcInVybFwiXTtcclxuICAgICAgICAgICAgdXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgodXJsKTtcclxuICAgICAgICAgICAgdGhpcy5fdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIHRoaXMuX29ubG9hZDNkKHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBvbkxvYWQzZE9uZSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAvLyAgICAgV215TG9hZDNkLmdldFRoaXMuX29uTG9hZDNkT25lKHVybCxjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHB1YmxpYyBfb25Mb2FkM2RPbmUodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgLy8gICAgIHRoaXMuX2xvYWQzZCh1cmwsY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIF9sb2FkM2QodXJsLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAvLyAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcclxuICAgIC8vICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgLy8gICAgICAgICBpZihjYWxsYmFja09rIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKHApPT57XHJcbiAgICAvLyAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwXSk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9LG51bGwsZmFsc2UpKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTG9hZDNkT25lKHVybDpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgd215TG9hZDNkPW5ldyBXbXlMb2FkM2QoKTtcclxuICAgICAgICB3bXlMb2FkM2QuX19vbmxvYWQzZE9uZSh1cmwsY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX19vbmxvYWQzZE9uZSh1cmwsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB0aGlzLl91cmxMaXN0PVtdO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgdXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgodXJsKTtcclxuICAgICAgICB0aGlzLl91cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICB0aGlzLl9vbmxvYWQzZCh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgX29ubG9hZDNkKF91cmxMaXN0KXtcclxuICAgIC8vICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgIC8vICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX3VybExpc3Q9bnVsbDtcclxuICAgIC8vICAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1udWxsO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPW51bGw7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX21BcnI9bnVsbDtcclxuICAgIC8vICAgICB9KSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKHApPT57XHJcbiAgICAvLyAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwXSk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KSxudWxsLG51bGwsbnVsbCwxLGZhbHNlKTtcclxuICAgIC8vIH1cclxuICAgIHByaXZhdGUgX29ubG9hZDNkKHVybCl7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcclxuICAgICAgICBMYXlhLmxvYWRlci5fY3JlYXRlTG9hZCh1cmwpO1xyXG4gICAgICAgIHZhciBsb2FkPUxheWEuTG9hZGVyTWFuYWdlcltcIl9yZXNNYXBcIl1bdXJsXTtcclxuICAgICAgICBsb2FkLm9uY2UoTGF5YS5FdmVudC5DT01QTEVURSx0aGlzLHRoaXMuX19vbmxzVXJsT2ssW3VybF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21BcnI6QXJyYXk8c3RyaW5nPjtcclxuICAgIHByaXZhdGUgX19vbmxzVXJsT2sodXJsLGQpe1xyXG4gICAgICAgIHZhciBzMD11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIHZhciBzMT11cmwucmVwbGFjZShzMFtzMC5sZW5ndGgtMV0sXCJcIik7XHJcbiAgICAgICAgdmFyIHJvb3RVcmw9czE7XHJcbiAgICAgICAgdmFyIGpzT2JqPUpTT04ucGFyc2UoZCk7XHJcbiAgICAgICAgdGhpcy5fbUFycj1bXTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpUXVVcmwoanNPYmpbXCJkYXRhXCJdLHJvb3RVcmwpO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5fbUFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMuX21BcnJbaV07XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkxvYWRPaykpO1xyXG4gICAgICAgICAgICAvL0xheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkxvYWRPayksdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsZ3JvdXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tTnVtPTA7XHJcbiAgICBwcml2YXRlIF9wTnVtPTA7XHJcbiAgICBwcml2YXRlIF9fb25Mb2FkT2soKXtcclxuICAgICAgICB0aGlzLl9tTnVtKz0xO1xyXG4gICAgICAgIHRoaXMuX3BOdW09dGhpcy5fbU51bS90aGlzLl9tQXJyLmxlbmd0aDtcclxuICAgICAgICB0aGlzLl9fb25Mb2FkUChudWxsKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5fbU51bT49dGhpcy5fbUFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cmxMaXN0PW51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rPW51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPW51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tQXJyPW51bGw7XHJcbiAgICAgICAgICAgIH0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25Mb2FkUCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfX29uTG9hZFAocCl7XHJcbiAgICAgICAgdmFyIHBOdW09dGhpcy5fcE51bSowLjc7XHJcbiAgICAgICAgaWYocCl7XHJcbiAgICAgICAgICAgIHBOdW0rPXAqMC4yNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcE51bV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gcHJpdmF0ZSBfbVA9MDtcclxuICAgIC8vIHByaXZhdGUgX21QMj0wO1xyXG5cclxuICAgIC8vIHByaXZhdGUgX19vbkFyclAocCl7XHJcbiAgICAvLyAgICAgdmFyIHBOdW09cCoodGhpcy5fbU51bSsxKTtcclxuICAgIC8vICAgICBpZihwTnVtPnRoaXMuX21QKXRoaXMuX21QPXBOdW07XHJcbiAgICAvLyAgICAgdGhpcy5fbVAyPSh0aGlzLl9tUC90aGlzLl9tQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgdmFyIHBOdW09KHRoaXMuX21QMikqMC45ODtcclxuICAgIC8vICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwTnVtXSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgLy8gcHJpdmF0ZSBfX29uQXJyT2soKXtcclxuICAgIC8vICAgICB0aGlzLl9tTnVtKz0xO1xyXG4gICAgLy8gICAgIGlmKHRoaXMuX21OdW0+PXRoaXMuX21BcnIubGVuZ3RoKXtcclxuICAgIC8vICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHRoaXMuX3VybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCgpPT57XHJcbiAgICAvLyAgICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fdXJsTGlzdD1udWxsO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1udWxsO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1udWxsO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fbUFycj1udWxsO1xyXG4gICAgLy8gICAgICAgICB9KSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgcHJpdmF0ZSBfX3RpUXVVcmwob2JqLHVybDpzdHJpbmc9XCJcIil7XHJcbiAgICAgICAgaWYob2JqW1wicHJvcHNcIl0hPW51bGwgJiYgb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBtZXNoUGF0aD11cmwrb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKG1lc2hQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChtZXNoUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsczpBcnJheTxhbnk+PW9ialtcInByb3BzXCJdW1wibWF0ZXJpYWxzXCJdO1xyXG4gICAgICAgICAgICBpZihtYXRlcmlhbHMhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpaT0wO2lpPG1hdGVyaWFscy5sZW5ndGg7aWkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGg9dXJsK21hdGVyaWFsc1tpaV1bXCJwYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbXCJjb21wb25lbnRzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGNvbXBvbmVudHM6QXJyYXk8YW55Pj1vYmpbXCJjb21wb25lbnRzXCJdO1xyXG4gICAgICAgICAgICBpZihjb21wb25lbnRzLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkwID0gMDsgaTAgPCBjb21wb25lbnRzLmxlbmd0aDsgaTArKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wID0gY29tcG9uZW50c1tpMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImF2YXRhclwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcGF0aD11cmwrY29tcFtcImF2YXRhclwiXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihhcGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goYXBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbXBbXCJsYXllcnNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXJzOkFycmF5PGFueT49Y29tcFtcImxheWVyc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IGxheWVycy5sZW5ndGg7IGkxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllciA9IGxheWVyc1tpMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVzOkFycmF5PGFueT49bGF5ZXJbXCJzdGF0ZXNcIl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBzdGF0ZXMubGVuZ3RoOyBpMisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW2kyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xpcFBhdGg9dXJsK3N0YXRlW1wiY2xpcFBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGNsaXBQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKGNsaXBQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNoaWxkOkFycmF5PGFueT49b2JqW1wiY2hpbGRcIl07XHJcbiAgICAgICAgaWYoY2hpbGQhPW51bGwgJiYgY2hpbGQubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGNoaWxkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3RpUXVVcmwoY2hpbGRbaV0sdXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL1xyXG4gICAgcHVibGljIGNsZWFyUmVzKHVybDpzdHJpbmcpe1xyXG4gICAgICAgIGlmKCF1cmwgfHwgdXJsLmluZGV4T2YoXCIvXCIpPDApcmV0dXJuO1xyXG4gICAgICAgIHZhciB1MD11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIHZhciB1MT11cmwucmVwbGFjZSh1MFt1MC5sZW5ndGgtMV0sXCJcIik7XHJcblxyXG4gICAgICAgIHZhciB1cmxzPVtdO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIExheWEuTG9hZGVyLmxvYWRlZE1hcCkge1xyXG4gICAgICAgICAgICBpZiAoTGF5YS5Mb2FkZXIubG9hZGVkTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsb2FkVXJsOnN0cmluZz0ga2V5O1xyXG4gICAgICAgICAgICAgICAgaWYobG9hZFVybC5pbmRleE9mKHUxKT49MCB8fCBsb2FkVXJsLmluZGV4T2YoXCJyZXMvbWF0cy9cIik+PTAgKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih1cmxzLmluZGV4T2YobG9hZFVybCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybHMucHVzaChsb2FkVXJsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXJscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSB1cmxzW2ldO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy/moLnmja7otYTmupDot6/lvoTojrflj5botYTmupDvvIhSZXNvdXJjZeS4uuadkOi0qOOAgei0tOWbvuOAgee9keagvOetieeahOWfuuexu++8iVxyXG4gICAgICAgICAgICAgICAgdmFyIHJlczpMYXlhLlJlc291cmNlPUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXJlcy5sb2NrKXtcclxuICAgICAgICAgICAgICAgICAgICByZXMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8v6LWE5rqQ6YeK5pS+XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlbGVhc2VSZXNvdXJjZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcclxuICAgICAgICAgICAgICAgIC8vTGF5YS5sb2FkZXIuY2xlYXJVbkxvYWRlZCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaWRSZXNvdXJjZXNNYXBMb2NrKHRhcmdldCxpc0xvY2s9dHJ1ZSl7XHJcbiAgICAgICAgaWYodGFyZ2V0PT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgb2JqTGlzdD1XbXlVdGlsczNELmdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxMYXlhLlJlbmRlcmFibGVTcHJpdGUzRCk7XHJcbiAgICAgICAgdmFyIGtJZHM9W107XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiBvYmpMaXN0KXtcclxuICAgICAgICAgICAgdmFyIG9iaj1vYmpMaXN0W2ldO1xyXG4gICAgICAgICAgICBXbXlMb2FkM2QuX2xvb3BMb2NrKG9iaixrSWRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHJNYXA9TGF5YS5SZXNvdXJjZVtcIl9pZFJlc291cmNlc01hcFwiXTtcclxuICAgICAgICBmb3IgKHZhciBrIGluIGtJZHMpe1xyXG4gICAgICAgICAgICBjb25zdCBvID1rSWRzW2tdO1xyXG4gICAgICAgICAgICB2YXIgcmVzPXJNYXBbb107XHJcbiAgICAgICAgICAgIHJlcy5sb2NrPWlzTG9jaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2xvb3BMb2NrKG9iaixhcnIpe1xyXG4gICAgICAgIFdteUxvYWQzZC5fTWVzaChvYmosYXJyKTtcclxuICAgICAgICBXbXlMb2FkM2QuX01hdGVyaWFscyhvYmosYXJyKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLkJhc2VSZW5kZXIpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9sb29wTG9jayhvLGFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX01lc2gob2JqLGFycil7XHJcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBvID0gb2JqW2tdO1xyXG4gICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5NZXNoKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgX3ZlcnRleEJ1ZmZlcnM9b1tcIl92ZXJ0ZXhCdWZmZXJzXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYoX3ZlcnRleEJ1ZmZlcnMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgazAgaW4gX3ZlcnRleEJ1ZmZlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbzAgPSBfdmVydGV4QnVmZmVyc1trMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG8wIGluc3RhbmNlb2YgTGF5YS5WZXJ0ZXhCdWZmZXIzRCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8wLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgazEgaW4gbykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG8xID0gb1trMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobzEgaW5zdGFuY2VvZiBMYXlhLkluZGV4QnVmZmVyM0Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8xLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9NYXRlcmlhbHMob2JqLGFycil7XHJcbiAgICAgICAgdmFyIF9tYXRlcmlhbHM9b2JqW1wiX21hdGVyaWFsc1wiXTtcclxuICAgICAgICBpZihfbWF0ZXJpYWxzKXtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrIGluIF9tYXRlcmlhbHMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG8gPSBfbWF0ZXJpYWxzW2tdO1xyXG4gICAgICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuQmFzZU1hdGVyaWFsKXtcclxuICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8sYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX1NoYWRlcihvLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgV215TG9hZDNkLl9TaGFkZXJEYXRhKG8sYXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX1NoYWRlcihvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLlNoYWRlcjNEKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfU2hhZGVyRGF0YShvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLlNoYWRlckRhdGEpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9CYXNlVGV4dHVyZShvW1wiX2RhdGFcIl0sYXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfQmFzZVRleHR1cmUob2JqLGFycil7XHJcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBvID0gb2JqW2tdO1xyXG4gICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5CYXNlVGV4dHVyZSl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8sYXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfZ2V0UmVzb3VyY2VzTWFwSWQob2JqLGFycil7XHJcbiAgICAgICAgdmFyIHJNYXA9TGF5YS5SZXNvdXJjZVtcIl9pZFJlc291cmNlc01hcFwiXTtcclxuICAgICAgICBmb3IgKHZhciBrIGluIHJNYXApe1xyXG4gICAgICAgICAgICB2YXIgcmVzPXJNYXBba107XHJcbiAgICAgICAgICAgIGlmKG9iaj09cmVzKXtcclxuICAgICAgICAgICAgICAgIGlmKGFyci5pbmRleE9mKGspPDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFdteUxvYWRNYXRze1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZE1hdHN7XHJcbiAgICAgICAgaWYoV215TG9hZE1hdHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlMb2FkTWF0cy5fdGhpcz1uZXcgV215TG9hZE1hdHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWRNYXRzLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vblVybEFyck9rLFt1cmxMaXN0XSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tYXRzVXJsQXJyOkFycmF5PHN0cmluZz49W107XHJcbiAgICBwcml2YXRlIF9tYXRPaz1mYWxzZTtcclxuICAgIHByaXZhdGUgX21hdE51bT0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UD0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UDI9MDtcclxuXHJcbiAgICBwcml2YXRlIF9fb25VcmxBcnJPayh1cmxMaXN0OkFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybD11cmxMaXN0W2ldO1xyXG4gICAgICAgICAgICAvLyB2YXIgdHh0PUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICAvLyB2YXIganNPYmo9SlNPTi5wYXJzZSh0eHQpO1xyXG4gICAgICAgICAgICB2YXIganNPYmo9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXJyPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIHZhciBtYXRzVXJsPXVybC5yZXBsYWNlKGFyclthcnIubGVuZ3RoLTFdLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXk6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycmF5PWpzT2JqW1wibWF0c1wiXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgICAgICBpZihvYmpbXCJ0YXJnZXROYW1lXCJdPT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hdFVybD1tYXRzVXJsK29ialtcIm1hdFVybFwiXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hdHNVcmxBcnIucHVzaChtYXRVcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21hdHNVcmxBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tYXRzVXJsQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25NYXRBcnJPayksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyclApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyUChwKXtcclxuICAgICAgICB2YXIgcE51bT1wKih0aGlzLl9tYXROdW0rMSk7XHJcbiAgICAgICAgaWYocE51bT50aGlzLl9tYXRQKXRoaXMuX21hdFA9cE51bTtcclxuICAgICAgICB0aGlzLl9tYXRQMj0odGhpcy5fbWF0UC90aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbdGhpcy5fbWF0UDJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyT2soKXtcclxuICAgICAgICB0aGlzLl9tYXROdW0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fbWF0TnVtPj10aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuL1dteVV0aWxzM0RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlTY3JpcHQzRCBleHRlbmRzIExheWEuU2NyaXB0M0Qge1xyXG4gICAgcHVibGljIGRlbChkZXN0cm95Q2hpbGQ6IGJvb2xlYW4gPSB0cnVlKXtcclxuICAgICAgICB0aGlzLm93bmVyM0QuZGVzdHJveShkZXN0cm95Q2hpbGQpO1xyXG4gICAgfVxyXG5cdHB1YmxpYyBvbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vd25lcjNEPW51bGw7XHJcbiAgICAgICAgdGhpcy5zY2VuZTNEPW51bGw7XHJcbiAgICAgICAgdGhpcy5vbkRlbCgpO1xyXG4gICAgfVxyXG4gICAgXHJcblx0cHVibGljIG9uRGVsKCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIG93bmVyM0Q6TGF5YS5TcHJpdGUzRDtcclxuICAgIHByaXZhdGUgX2xvY2FsU2NhbGU6TGF5YS5WZWN0b3IzO1xyXG5cclxuICAgIHB1YmxpYyBzY2VuZTNEOkxheWEuU2NlbmUzRDtcclxuXHJcblx0cHVibGljIF9vbkFkZGVkKCkge1xyXG4gICAgICAgIHN1cGVyLl9vbkFkZGVkKCk7XHJcbiAgICAgICAgdGhpcy5vd25lcjNEPXRoaXMub3duZXIgYXMgTGF5YS5TcHJpdGUzRDtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9jYWxTY2FsZT1uZXcgTGF5YS5WZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgICAgIGlmKHRoaXMub3duZXIzRC50cmFuc2Zvcm0pe1xyXG4gICAgICAgICAgICB0aGlzLl9sb2NhbFNjYWxlPXRoaXMub3duZXIzRC50cmFuc2Zvcm0ubG9jYWxTY2FsZS5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjZW5lM0Q9dGhpcy5vd25lcjNELnNjZW5lO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvL+aYr+WQpuWPr+ingVxyXG4gICAgcHVibGljIHNldFNob3codjpib29sZWFuKXtcclxuICAgICAgICB0aGlzLm93bmVyM0QudHJhbnNmb3JtLmxvY2FsU2NhbGUgPSAhdj8gbmV3IExheWEuVmVjdG9yMygwLCAwLCAwKTogdGhpcy5fbG9jYWxTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICAvL1xyXG4gICAgcHVibGljIGdldE9iajNkVXJsKHRhcmdldCx1cmw6c3RyaW5nKTphbnl7XHJcbiAgICAgICAgcmV0dXJuIFdteVV0aWxzM0QuZ2V0T2JqM2RVcmwodGFyZ2V0LHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/orr7nva7pmLTlvbFcclxuICAgIHB1YmxpYyBvblNldFNoYWRvdyhpc0Nhc3RTaGFkb3csaXNSZWNlaXZlU2hhZG93KVxyXG4gICAge1xyXG4gICAgICAgIFdteVV0aWxzM0Qub25TZXRTaGFkb3codGhpcy5vd25lcjNELGlzQ2FzdFNoYWRvdyxpc1JlY2VpdmVTaGFkb3cpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFdteV9Mb2FkX01hZyB9IGZyb20gXCIuLi9XbXlfTG9hZF9NYWdcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlVdGlsczNEe1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmozZCh0YXJnZXQsb2JqTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQubmFtZT09b2JqTmFtZSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgaWYgKG8uX2NoaWxkcmVuLmxlbmd0aCA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihvLm5hbWU9PW9iak5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcE9iaj10aGlzLmdldE9iajNkKG8sb2JqTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wT2JqIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcE9iajtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkVXJsKHRhcmdldCx1cmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgYXJyVXJsPXVybC5zcGxpdCgnLycpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0LGFyclVybCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIF9nZXRPYmpBcnJVcmwodGFyZ2V0LHVybEFycjpBcnJheTxzdHJpbmc+LGlkPTApe1xyXG4gICAgICAgIHZhciBfdGFyZ2V0OkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKF90YXJnZXQ9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIG5hPXVybEFycltpZF07XHJcbiAgICAgICAgdmFyIHRhcmdldE9iaj1fdGFyZ2V0LmdldENoaWxkQnlOYW1lKG5hKTtcclxuICAgICAgICBpZih0YXJnZXRPYmo9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYoaWQ+PXVybEFyci5sZW5ndGgtMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHRhcmdldE9iaj10aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0T2JqLHVybEFyciwrK2lkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRDaGlsZHJlbkNvbXBvbmVudCh0YXJnZXQsY2xhczphbnksYXJyPyk6QXJyYXk8YW55PntcclxuICAgICAgICBpZihhcnI9PW51bGwpYXJyPVtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb2JqPXRhcmdldC5nZXRDb21wb25lbnQoY2xhcyk7XHJcbiAgICAgICAgaWYob2JqPT1udWxsKXtcclxuICAgICAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgY2xhcyl7XHJcbiAgICAgICAgICAgICAgICBvYmo9dGFyZ2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9iaiE9bnVsbCAmJiBhcnIuaW5kZXhPZihvYmopPDApe1xyXG4gICAgICAgICAgICBhcnIucHVzaChvYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQuX2NoaWxkcmVuPT1udWxsKSByZXR1cm4gYXJyO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG86TGF5YS5TcHJpdGUzRCA9IHRhcmdldC5fY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRyZW5Db21wb25lbnQobyxjbGFzLGFycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW50aWF0ZSh0YXJnZXQsdGFyZ2V0TmFtZT86c3RyaW5nKTphbnl7XHJcbiAgICAgICAgaWYodGFyZ2V0PT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBfdGFyZ2V0OkxheWEuU3ByaXRlM0Q9bnVsbDtcclxuICAgICAgICBpZih0YXJnZXROYW1lKXtcclxuICAgICAgICAgICAgdmFyIHRlbXBPYmo9V215VXRpbHMzRC5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSk7XHJcbiAgICAgICAgICAgIGlmKHRlbXBPYmope1xyXG4gICAgICAgICAgICAgICAgX3RhcmdldD1MYXlhLlNwcml0ZTNELmluc3RhbnRpYXRlKHRlbXBPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIF90YXJnZXQ9TGF5YS5TcHJpdGUzRC5pbnN0YW50aWF0ZSh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX3RhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa/gOa0u+mYtOW9seOAglxyXG4gICAgICogQHBhcmFtXHRkaXJlY3Rpb25MaWdodCDnm7Tnur/lhYlcclxuICAgICAqIEBwYXJhbVx0c2hhZG93UmVzb2x1dGlvbiDnlJ/miJDpmLTlvbHotLTlm77lsLrlr7hcclxuICAgICAqIEBwYXJhbVx0c2hhZG93UENGVHlwZSDmqKHns4rnrYnnuqcs6LaK5aSn6LaK6auYLOabtOiAl+aAp+iDvVxyXG4gICAgICogQHBhcmFtXHRzaGFkb3dEaXN0YW5jZSDlj6/op4HpmLTlvbHot53nprtcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBvblNldERpcmVjdGlvbkxpZ2h0KGRpcmVjdGlvbkxpZ2h0LHNoYWRvd1Jlc29sdXRpb249NTEyLHNoYWRvd1BDRlR5cGU9MSxzaGFkb3dEaXN0YW5jZTpudW1iZXI9MTUsaXNTaGFkb3c6Ym9vbGVhbj10cnVlKXtcclxuICAgICAgICBpZihkaXJlY3Rpb25MaWdodCBpbnN0YW5jZW9mIExheWEuRGlyZWN0aW9uTGlnaHQpe1xyXG4gICAgICAgICAgICAvL+eBr+WFieW8gOWQr+mYtOW9sVxyXG4gICAgICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgLy/lj6/op4HpmLTlvbHot53nprtcclxuICAgICAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93RGlzdGFuY2UgPSBzaGFkb3dEaXN0YW5jZTtcclxuICAgICAgICAgICAgLy/nlJ/miJDpmLTlvbHotLTlm77lsLrlr7hcclxuICAgICAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UmVzb2x1dGlvbiA9IHNoYWRvd1Jlc29sdXRpb247XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd1BTU01Db3VudD0xO1xyXG4gICAgICAgICAgICAvL+aooeeziuetiee6pyzotorlpKfotorpq5gs5pu06ICX5oCn6IO9XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd1BDRlR5cGUgPSBzaGFkb3dQQ0ZUeXBlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICog5r+A5rS76Zi05b2x44CCXHJcbiAgICAgKiBAcGFyYW1cdHRhcmdldCBcclxuICAgICAqIEBwYXJhbVx0dHlwZSAw5o6l5pS26Zi05b2xLDHkuqfnlJ/pmLTlvbEsMuaOpeaUtumYtOW9seS6p+eUn+mYtOW9sVxyXG4gICAgICogQHBhcmFtXHRpc1NoYWRvdyDmmK/lkKbpmLTlvbFcclxuICAgICAqIEBwYXJhbVx0aXNDaGlsZHJlbiDmmK/lkKblrZDlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBvbkNhc3RTaGFkb3codGFyZ2V0LHR5cGU9MCxpc1NoYWRvdz10cnVlLGlzQ2hpbGRyZW49dHJ1ZSl7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5NZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICB2YXIgbXMzRD0odGFyZ2V0IGFzIExheWEuTWVzaFNwcml0ZTNEKTtcclxuICAgICAgICAgICAgaWYodHlwZT09MCl7XHJcbiAgICAgICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodHlwZT09MSl7XHJcbiAgICAgICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodHlwZT09Mil7XHJcbiAgICAgICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLmNhc3RTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICB2YXIgc21zM2Q9KHRhcmdldCBhcyBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0QpO1xyXG4gICAgICAgICAgICBpZih0eXBlPT0wKXtcclxuICAgICAgICAgICAgICAgIHNtczNkLnNraW5uZWRNZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodHlwZT09MSl7XHJcbiAgICAgICAgICAgICAgICBzbXMzZC5za2lubmVkTWVzaFJlbmRlcmVyLmNhc3RTaGFkb3c9aXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGlzQ2hpbGRyZW4pe1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5udW1DaGlsZHJlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gdGFyZ2V0LmdldENoaWxkQXQoaSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2FzdFNoYWRvdyhvYmosdHlwZSxpc1NoYWRvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25TZXRTaGFkb3codGFyZ2V0LGlzQ2FzdFNoYWRvdyxpc1JlY2VpdmVTaGFkb3cpe1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgdGFyZ2V0Lm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNDYXN0U2hhZG93O1xyXG4gICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICB0YXJnZXQubWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1JlY2VpdmVTaGFkb3c7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgdGFyZ2V0LnNraW5uZWRNZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzQ2FzdFNoYWRvdztcclxuICAgICAgICAgICAgLy/mjqXmlLbpmLTlvbFcclxuICAgICAgICAgICAgdGFyZ2V0LnNraW5uZWRNZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzUmVjZWl2ZVNoYWRvdztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmdiMmhleChyLGcsYil7XHJcbiAgICAgICAgdmFyIF9oZXg9XCIjXCIgKyB0aGlzLmhleChyKSArdGhpcy4gaGV4KGcpICsgdGhpcy5oZXgoYik7XHJcbiAgICAgICAgcmV0dXJuIF9oZXgudG9VcHBlckNhc2UoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc3RhdGljIGhleCh4KXtcclxuICAgICAgICB4PXRoaXMub25OdW1Ubyh4KTtcclxuICAgICAgICByZXR1cm4gKFwiMFwiICsgcGFyc2VJbnQoeCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBoZXgycmdiKGhleDpzdHJpbmcpIHtcclxuICAgICAgICAvLyBFeHBhbmQgc2hvcnRoYW5kIGZvcm0gKGUuZy4gXCIwM0ZcIikgdG8gZnVsbCBmb3JtIChlLmcuIFwiMDAzM0ZGXCIpXHJcbiAgICAgICAgdmFyIHNob3J0aGFuZFJlZ2V4ID0gL14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaTtcclxuICAgICAgICBoZXggPSBoZXgucmVwbGFjZShzaG9ydGhhbmRSZWdleCwgZnVuY3Rpb24obSwgciwgZywgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gciArIHIgKyBnICsgZyArIGIgKyBiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQgPyB7XHJcbiAgICAgICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxyXG4gICAgICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcclxuICAgICAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcclxuICAgICAgICB9IDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25OdW1UbyhuKXtcclxuXHRcdGlmKChuK1wiXCIpLmluZGV4T2YoXCIuXCIpPj0wKXtcclxuXHRcdCAgICBuPXBhcnNlRmxvYXQobi50b0ZpeGVkKDIpKTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gbjtcclxuXHR9XHJcblxyXG4gICAgXHJcbiAgIHB1YmxpYyBzdGF0aWMgbGVycEYoYTpudW1iZXIsIGI6bnVtYmVyLCBzOm51bWJlcik6bnVtYmVye1xyXG4gICAgICAgIHJldHVybiAoYSArIChiIC0gYSkgKiBzKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmF5Q2FzdEFsbChjYW06TGF5YS5DYW1lcmEsIHZpZXdwb3J0UG9pbnQ6TGF5YS5WZWN0b3IyLCByYXk/OkxheWEuUmF5LCBjb2xsaXNvbkdyb3VwPzogbnVtYmVyLCBjb2xsaXNpb25NYXNrPzogbnVtYmVyKXtcclxuICAgICAgICB2YXIgX291dEhpdEFsbEluZm8gPSAgbmV3IEFycmF5PExheWEuSGl0UmVzdWx0PigpO1xyXG4gICAgICAgIHZhciBfcmF5ID1yYXk7XHJcbiAgICAgICAgaWYoIV9yYXkpe1xyXG4gICAgICAgICAgICBfcmF5ID0gbmV3IExheWEuUmF5KG5ldyBMYXlhLlZlY3RvcjMoKSwgbmV3IExheWEuVmVjdG9yMygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/ku47lsY/luZXnqbrpl7TnlJ/miJDlsITnur9cclxuICAgICAgICB2YXIgX3BvaW50ID0gdmlld3BvcnRQb2ludC5jbG9uZSgpO1xyXG4gICAgICAgIGNhbS52aWV3cG9ydFBvaW50VG9SYXkoX3BvaW50LCBfcmF5KTtcclxuICAgICAgICAvL+WwhOe6v+ajgOa1i+iOt+WPluaJgOacieajgOa1i+eisOaSnuWIsOeahOeJqeS9k1xyXG4gICAgICAgIGlmKGNhbS5zY2VuZSE9bnVsbCAmJiBjYW0uc2NlbmUucGh5c2ljc1NpbXVsYXRpb24hPW51bGwpe1xyXG4gICAgICAgICAgICBjYW0uc2NlbmUucGh5c2ljc1NpbXVsYXRpb24ucmF5Q2FzdEFsbChfcmF5LCBfb3V0SGl0QWxsSW5mbywgMTAwMDAsIGNvbGxpc29uR3JvdXAsIGNvbGxpc2lvbk1hc2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX291dEhpdEFsbEluZm87XHJcbiAgICB9XHJcblxyXG4gICAgLy/ot53nprtcclxuXHRwdWJsaWMgc3RhdGljIERpc3RhbmNlKGE6TGF5YS5WZWN0b3IyLGI6TGF5YS5WZWN0b3IyKTpudW1iZXIge1xyXG5cdFx0dmFyIGR4ID0gTWF0aC5hYnMoYS54IC0gYi54KTtcclxuXHRcdHZhciBkeSA9IE1hdGguYWJzKGEueSAtIGIueSk7XHJcblx0XHR2YXIgZD1NYXRoLnNxcnQoTWF0aC5wb3coZHgsIDIpICsgTWF0aC5wb3coZHksIDIpKTtcclxuXHRcdGQ9cGFyc2VGbG9hdChkLnRvRml4ZWQoMikpO1xyXG5cdFx0cmV0dXJuIGQ7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcblxyXG4gICAgLy/liqjnlLstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgcHVibGljIHN0YXRpYyBhbmlQbGF5KHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUsIG5vcm1hbGl6ZWRUaW1lPzpudW1iZXIsIGNvbXBsZXRlRXZlbnQ/OkxheWEuSGFuZGxlciwgcGFyYW1zPzpBcnJheTxhbnk+LCBsYXllckluZGV4PzogbnVtYmVyKTpMYXlhLkFuaW1hdG9ye1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYoY29tcGxldGVFdmVudCl7XHJcbiAgICAgICAgICAgIFdteVV0aWxzM0QuYW5pQWRkRXZlbnRGdW4odGFyZ2V0M2QsbnVsbCxhbmlOYW1lLC0xLGNvbXBsZXRlRXZlbnQsdHJ1ZSxwYXJhbXMsbGF5ZXJJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldDNkX2FuaS5wbGF5KGFuaU5hbWUsbGF5ZXJJbmRleCxub3JtYWxpemVkVGltZSk7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDNkX2FuaTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaUFkZEV2ZW50RnVuKHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUsdGltZTpudW1iZXIsY2FsbGJhY2s6TGF5YS5IYW5kbGVyLGlzRXZlbnRPbmU9dHJ1ZSxwYXJhbXM/OkFycmF5PGFueT4sbGF5ZXJJbmRleD86IG51bWJlcil7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBXbXlVdGlsczNELl9hbmlBZGRFdmVudCh0YXJnZXQzZF9hbmksbnVsbCxhbmlOYW1lLFwiX3dteV9hbmlfY2FsbGJhY2tcIix0aW1lLHBhcmFtcyxsYXllckluZGV4KTtcclxuICAgICAgICB2YXIgd2FlPXRhcmdldDNkLmdldENvbXBvbmVudChfX1dteUFuaUV2ZW50KSBhcyBfX1dteUFuaUV2ZW50O1xyXG4gICAgICAgIGlmKCF3YWUpe1xyXG4gICAgICAgICAgICB3YWU9dGFyZ2V0M2QuYWRkQ29tcG9uZW50KF9fV215QW5pRXZlbnQpIGFzIF9fV215QW5pRXZlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjYWxsYmFja05hbWU9XCJ3bXlfXCIrY2FsbGJhY2suY2FsbGVyLmlkK2FuaU5hbWUrdGltZTtcclxuICAgICAgICBpZihpc0V2ZW50T25lKXtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5vbmNlKGNhbGxiYWNrTmFtZSx0aGlzLChfY2FsbGJhY2tOYW1lLF9jYWxsYmFjayxwKT0+e1xyXG4gICAgICAgICAgICAgICAgX2NhbGxiYWNrLnJ1bldpdGgocCk7XHJcbiAgICAgICAgICAgICAgICB3YWUuZGVsQ2FsbGJhY2soX2NhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgICAgIH0sW2NhbGxiYWNrTmFtZSxjYWxsYmFja10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uKGNhbGxiYWNrTmFtZSx0aGlzLChfY2FsbGJhY2tOYW1lLF9jYWxsYmFjayxwKT0+e1xyXG4gICAgICAgICAgICAgICAgX2NhbGxiYWNrLnJ1bldpdGgocCk7XHJcbiAgICAgICAgICAgIH0sW2NhbGxiYWNrTmFtZSxjYWxsYmFja10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3YWUuYWRkQ2FsbGJhY2soY2FsbGJhY2tOYW1lKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBhbmlEZWxFdmVudEZ1bih0YXJnZXQsdGFyZ2V0TmFtZSxjYWxsYmFjazpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHdhZT10YXJnZXQzZC5nZXRDb21wb25lbnQoX19XbXlBbmlFdmVudCkgYXMgX19XbXlBbmlFdmVudDtcclxuICAgICAgICBpZih3YWUpe1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tOYW1lPVwid215X1wiK2NhbGxiYWNrLmNhbGxlci5uYW1lK2NhbGxiYWNrLm1ldGhvZC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uKGNhbGxiYWNrTmFtZSxjYWxsYmFjay5jYWxsZXIsY2FsbGJhY2subWV0aG9kKTtcclxuICAgICAgICAgICAgd2FlLmRlbENhbGxiYWNrKGNhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgX2FuaUFkZEV2ZW50KHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUsZXZlbnROYW1lOnN0cmluZyx0aW1lOm51bWJlcixwYXJhbXM/OkFycmF5PGFueT4sbGF5ZXJJbmRleD86IG51bWJlcik6TGF5YS5BbmltYXRvcntcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD1udWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9bnVsbDtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNwcml0ZTNEKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGFyZ2V0O1xyXG4gICAgICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRhcmdldDNkPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLkFuaW1hdG9yKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2RfYW5pPXRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2RfYW5pPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBhbmltYXRvclN0YXRlOkxheWEuQW5pbWF0b3JTdGF0ZT10YXJnZXQzZF9hbmkuZ2V0Q29udHJvbGxlckxheWVyKGxheWVySW5kZXgpLl9zdGF0ZXNNYXBbYW5pTmFtZV07XHJcbiAgICAgICAgaWYoYW5pbWF0b3JTdGF0ZT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgaXNBZGQ9dHJ1ZTtcclxuICAgICAgICB2YXIgZXZlbnRzPWFuaW1hdG9yU3RhdGUuX2NsaXAuX2V2ZW50cztcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBldmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudDpMYXlhLkFuaW1hdGlvbkV2ZW50ID0gZXZlbnRzW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZihldmVudC5ldmVudE5hbWU9PWV2ZW50TmFtZSAmJiBhbmlFdmVudC50aW1lKXtcclxuICAgICAgICAgICAgICAgICAgICBpc0FkZD1mYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpc0FkZCl7XHJcbiAgICAgICAgICAgIHZhciBhbmlFdmVudD1uZXcgTGF5YS5BbmltYXRpb25FdmVudCgpO1xyXG4gICAgICAgICAgICBhbmlFdmVudC5ldmVudE5hbWU9ZXZlbnROYW1lO1xyXG4gICAgICAgICAgICB2YXIgY2xpcER1cmF0aW9uPWFuaW1hdG9yU3RhdGUuX2NsaXAuX2R1cmF0aW9uO1xyXG4gICAgICAgICAgICBpZih0aW1lPT0tMSl7XHJcbiAgICAgICAgICAgICAgICB0aW1lPWNsaXBEdXJhdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhbmlFdmVudC50aW1lPSB0aW1lIC8gY2xpcER1cmF0aW9uO1xyXG4gICAgICAgICAgICBhbmlFdmVudC5wYXJhbXM9cGFyYW1zO1xyXG4gICAgICAgICAgICBhbmltYXRvclN0YXRlLl9jbGlwLmFkZEV2ZW50KGFuaUV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDNkX2FuaTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaUFkZFNjcmlwdCh0YXJnZXQsdGFyZ2V0TmFtZSxhbmlOYW1lLHNjcmlwdD86YW55LGxheWVySW5kZXg/OiBudW1iZXIpOkxheWEuQW5pbWF0b3JTdGF0ZXtcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYodGFyZ2V0TmFtZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRhcmdldDNkPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldDNkPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgaWYodGFyZ2V0M2RfYW5pPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBhbmltYXRvclN0YXRlOkxheWEuQW5pbWF0b3JTdGF0ZT10YXJnZXQzZF9hbmkuZ2V0Q29udHJvbGxlckxheWVyKGxheWVySW5kZXgpLl9zdGF0ZXNNYXBbYW5pTmFtZV07XHJcbiAgICAgICAgaWYoYW5pbWF0b3JTdGF0ZT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBhbmltYXRvclN0YXRlLmFkZFNjcmlwdChzY3JpcHQpO1xyXG4gICAgICAgIHJldHVybiBhbmltYXRvclN0YXRlO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcblxyXG5cclxuY2xhc3MgX19XbXlBbmlFdmVudCBleHRlbmRzIExheWEuU2NyaXB0M0Qge1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2s9W107XHJcbiAgICBwdWJsaWMgYWRkQ2FsbGJhY2soY2FsbGJhY2tOYW1lKXtcclxuICAgICAgICB2YXIgaW5kZXhJZD10aGlzLl9jYWxsYmFjay5pbmRleE9mKGNhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgaWYoaW5kZXhJZDwwKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2sucHVzaChjYWxsYmFja05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBkZWxDYWxsYmFjayhjYWxsYmFja05hbWUpe1xyXG4gICAgICAgIHZhciBpbmRleElkPXRoaXMuX2NhbGxiYWNrLmluZGV4T2YoY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICBpZihpbmRleElkPj0wKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2suc3BsaWNlKGluZGV4SWQsMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIF93bXlfYW5pX2NhbGxiYWNrKHBhcmFtcz86QXJyYXk8YW55Pil7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jYWxsYmFjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja05hbWUgPSB0aGlzLl9jYWxsYmFja1tpXTtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChjYWxsYmFja05hbWUscGFyYW1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gXCIuLi9XbXlTY3JpcHQzRFwiO1xyXG5pbXBvcnQgeyBXbXlVdGlsczNEIH0gZnJvbSBcIi4uL1dteVV0aWxzM0RcIjtcclxuaW1wb3J0IHsgV215VXRpbHMgfSBmcm9tIFwiLi4vLi4vV215VXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteUM0RFZldGV4QW5pbWF0b3IgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XHJcbiAgICBfYW5pcjpMYXlhLkFuaW1hdG9yO1xyXG4gICAgX3ZlcnRpY2VzT2JqOkxheWEuU3ByaXRlM0Q7XHJcbiAgICBvbkF3YWtlKCl7XHJcbiAgICAgICAgdGhpcy5fYW5pcj10aGlzLm93bmVyM0QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FuaXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdGhpcy5vd25lcjNELm9uKFwiYW5pX3BsYXlcIix0aGlzLHRoaXMub25QbGF5KTtcclxuXHJcbiAgICAgICAgdmFyIG9ianM9dGhpcy5fYW5pci5fcmVuZGVyYWJsZVNwcml0ZXM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXRleFQ9bnVsbDtcclxuICAgICAgICAgICAgY29uc3QgbWVzaE9iaiA9IG9ianNbaV07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWVzaE9iai5udW1DaGlsZHJlbjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjT2JqID0gbWVzaE9iai5nZXRDaGlsZEF0KGkpO1xyXG4gICAgICAgICAgICAgICAgaWYoY09iai5uYW1lLmluZGV4T2YoXCJWZXRleF9IYW5kbGVcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHZldGV4VD1jT2JqO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHZldGV4VCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92ZXJ0aWNlc09iaj12ZXRleFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9tZXNoT2JqLl9yZW5kZXIuZW5hYmxlPWZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fdmVydGljZXNPYmogPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vbkluaXRWZXJ0ZXgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBvblBsYXkobj1cInBsYXlcIix0PTAsc3BlZWQ9MSl7XHJcbiAgICAvLyAgICAgdmFyIG9ianM9dGhpcy5fYW5pci5fcmVuZGVyYWJsZVNwcml0ZXM7XHJcbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvLyAgICAgICAgIGNvbnN0IG1lc2hPYmogPSBvYmpzW2ldO1xyXG4gICAgLy8gICAgICAgICAvL21lc2hPYmouX3JlbmRlci5lbmFibGU9dHJ1ZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIHRoaXMuX2FuaXIucGxheShuLHVuZGVmaW5lZCx0KTtcclxuICAgIC8vICAgICB0aGlzLl9hbmlyLnNwZWVkPXNwZWVkO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8v6aG254K5LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIF9tZXNoOkxheWEuTWVzaEZpbHRlcjtcclxuICAgIF9zaGFyZWRNZXNoOmFueTtcclxuXHJcbiAgICBfdmVydGV4QnVmZmVyczpBcnJheTxMYXlhLlZlcnRleEJ1ZmZlcjNEPjtcclxuICAgIF92ZXJ0ZXhBcnJheTpBcnJheTxMYXlhLlRyYW5zZm9ybTNEPjtcclxuICAgIF9tTWFwcGluZ1ZldGV4SW5mb0FycjpBcnJheTxhbnk+O1xyXG4gICAgX21DYWNoZVZlcnRpY2VzQXJyOkFycmF5PGFueT47XHJcblxyXG4gICAgb25Jbml0VmVydGV4KCl7XHJcbiAgICAgICAgdGhpcy5fbWVzaCA9IHRoaXMuX3ZlcnRpY2VzT2JqLnBhcmVudFtcIm1lc2hGaWx0ZXJcIl07XHJcbiAgICAgICAgaWYoIXRoaXMuX21lc2gpe1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fdmVydGljZXNPYmoubnVtQ2hpbGRyZW4+MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRleEFycmF5PVtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3ZlcnRpY2VzT2JqLm51bUNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRleEFycmF5W2ldID0gKHRoaXMuX3ZlcnRpY2VzT2JqLmdldENoaWxkQXQoaSkgYXMgTGF5YS5TcHJpdGUzRCkudHJhbnNmb3JtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCF0aGlzLl92ZXJ0ZXhBcnJheSl7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYT1bXTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92ZXJ0ZXhCdWZmZXJzPXRoaXMuX21lc2guc2hhcmVkTWVzaFtcIl92ZXJ0ZXhCdWZmZXJzXCJdO1xyXG4gICAgICAgIHRoaXMuX3ZlcnRleEJ1ZmZlcnM9dGhpcy5fdmVydGV4QnVmZmVycy5jb25jYXQoKTtcclxuICAgICAgICB0aGlzLl9tZXNoLnNoYXJlZE1lc2hbXCJfdmVydGV4QnVmZmVyc1wiXT10aGlzLl92ZXJ0ZXhCdWZmZXJzO1xyXG4gICAgICBcclxuICAgICAgICB0aGlzLl9tQ2FjaGVWZXJ0aWNlc0FyciA9IHRoaXMuX21lc2guc2hhcmVkTWVzaC5fZ2V0UG9zaXRpb25zKCk7XHJcbiAgICAgICAgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnI9W107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdmVydGV4QXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl92ZXJ0ZXhBcnJheVtpXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyW2ldPXt9O1xyXG4gICAgICAgICAgICB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0FycltpXS5UcmFuc2Zvcm1JbmZvID0gaXRlbTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtSW5kZXhMaXN0PVtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9tQ2FjaGVWZXJ0aWNlc0Fyci5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZlcnRleFBvcyA9IHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyW2pdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQ9TGF5YS5WZWN0b3IzLmRpc3RhbmNlKHZlcnRleFBvcyxpdGVtLmxvY2FsUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQgPD0wLjAxKXtcclxuICAgICAgICAgICAgICAgICAgICBtSW5kZXhMaXN0LnB1c2goaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyW2ldLlZldGV4SURBcnIgPSBtSW5kZXhMaXN0O1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBvbkxhdGVVcGRhdGUoKXtcclxuICAgICAgICBpZih0aGlzLl9hbmlyLnNwZWVkPT0wKXJldHVybjtcclxuICAgICAgICB2YXIgcGxheVN0YXRlPXRoaXMuX2FuaXIuZ2V0Q3VycmVudEFuaW1hdG9yUGxheVN0YXRlKCk7XHJcbiAgICAgICAgaWYocGxheVN0YXRlLl9maW5pc2gpcmV0dXJuO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0FycltpXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaXRlbS5WZXRleElEQXJyLmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmVydGV4SUQgPSBpdGVtLlZldGV4SURBcnJbal07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHBvcz0gaXRlbS5UcmFuc2Zvcm1JbmZvLmxvY2FsUG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tQ2FjaGVWZXJ0aWNlc0Fyclt2ZXJ0ZXhJRF0gPSBwb3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ZlcnRleHNfc2V0UG9zaXRpb25zKHRoaXMuX3ZlcnRleEJ1ZmZlcnMsdGhpcy5fbUNhY2hlVmVydGljZXNBcnIpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIF92ZXJ0ZXhzX2dldFBvc2l0aW9ucyh2ZXJ0ZXhCdWZmZXJzKXtcclxuXHRcdHZhciB2ZXJ0aWNlcz1bXTtcclxuXHRcdHZhciBpPTAsaj0wLHZlcnRleEJ1ZmZlcixwb3NpdGlvbkVsZW1lbnQsdmVydGV4RWxlbWVudHMsdmVydGV4RWxlbWVudCxvZnNldD0wLHZlcnRpY2VzRGF0YTtcclxuXHRcdHZhciB2ZXJ0ZXhCdWZmZXJDb3VudD12ZXJ0ZXhCdWZmZXJzLmxlbmd0aDtcclxuXHRcdGZvciAoaT0wO2kgPCB2ZXJ0ZXhCdWZmZXJDb3VudDtpKyspe1xyXG5cdFx0XHR2ZXJ0ZXhCdWZmZXI9dmVydGV4QnVmZmVyc1tpXTtcclxuXHRcdFx0dmVydGV4RWxlbWVudHM9dmVydGV4QnVmZmVyLnZlcnRleERlY2xhcmF0aW9uLnZlcnRleEVsZW1lbnRzO1xyXG5cdFx0XHRmb3IgKGo9MDtqIDwgdmVydGV4RWxlbWVudHMubGVuZ3RoO2orKyl7XHJcblx0XHRcdFx0dmVydGV4RWxlbWVudD12ZXJ0ZXhFbGVtZW50c1tqXTtcclxuXHRcdFx0XHRpZiAodmVydGV4RWxlbWVudC5lbGVtZW50Rm9ybWF0PT09LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleEVsZW1lbnRGb3JtYXQuVmVjdG9yMyovXCJ2ZWN0b3IzXCIgJiYgdmVydGV4RWxlbWVudC5lbGVtZW50VXNhZ2U9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9QT1NJVElPTjAqLzApe1xyXG5cdFx0XHRcdFx0cG9zaXRpb25FbGVtZW50PXZlcnRleEVsZW1lbnQ7XHJcblx0XHRcdFx0XHRicmVhayA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHZlcnRpY2VzRGF0YT12ZXJ0ZXhCdWZmZXIuZ2V0RGF0YSgpO1xyXG5cdFx0XHRmb3IgKGo9MDtqIDwgdmVydGljZXNEYXRhLmxlbmd0aDtqKz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4U3RyaWRlIC8gNCl7XHJcblx0XHRcdFx0b2ZzZXQ9aitwb3NpdGlvbkVsZW1lbnQub2Zmc2V0IC8gNDtcclxuXHRcdFx0XHR2ZXJ0aWNlcy5wdXNoKG5ldyBMYXlhLlZlY3RvcjModmVydGljZXNEYXRhW29mc2V0KzBdLHZlcnRpY2VzRGF0YVtvZnNldCsxXSx2ZXJ0aWNlc0RhdGFbb2ZzZXQrMl0pKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHZlcnRpY2VzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBfdmVydGV4c19zZXRQb3NpdGlvbnModmVydGV4QnVmZmVycyx2ZXJ0aWNlcyl7XHJcblx0XHR2YXIgaT0wLGo9MCx2ZXJ0ZXhCdWZmZXIscG9zaXRpb25FbGVtZW50LHZlcnRleEVsZW1lbnRzLHZlcnRleEVsZW1lbnQsb2ZzZXQ9MCx2ZXJ0aWNlc0RhdGEsdmVydGljZTtcclxuXHRcdHZhciB2ZXJ0ZXhCdWZmZXJDb3VudD12ZXJ0ZXhCdWZmZXJzLmxlbmd0aDtcclxuXHRcdGZvciAoaT0wO2kgPCB2ZXJ0ZXhCdWZmZXJDb3VudDtpKyspe1xyXG5cdFx0XHR2ZXJ0ZXhCdWZmZXI9dmVydGV4QnVmZmVyc1tpXTtcclxuXHRcdFx0dmVydGV4RWxlbWVudHM9dmVydGV4QnVmZmVyLnZlcnRleERlY2xhcmF0aW9uLnZlcnRleEVsZW1lbnRzO1xyXG5cdFx0XHRmb3IgKGo9MDtqIDwgdmVydGV4RWxlbWVudHMubGVuZ3RoO2orKyl7XHJcblx0XHRcdFx0dmVydGV4RWxlbWVudD12ZXJ0ZXhFbGVtZW50c1tqXTtcclxuXHRcdFx0XHRpZiAodmVydGV4RWxlbWVudC5lbGVtZW50Rm9ybWF0PT09LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleEVsZW1lbnRGb3JtYXQuVmVjdG9yMyovXCJ2ZWN0b3IzXCIgJiYgdmVydGV4RWxlbWVudC5lbGVtZW50VXNhZ2U9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9QT1NJVElPTjAqLzApe1xyXG5cdFx0XHRcdFx0cG9zaXRpb25FbGVtZW50PXZlcnRleEVsZW1lbnQ7XHJcblx0XHRcdFx0XHRicmVhayA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgICAgIHZlcnRpY2VzRGF0YT12ZXJ0ZXhCdWZmZXIuZ2V0RGF0YSgpO1xyXG4gICAgICAgICAgICB2YXIgbj0wO1xyXG5cdFx0XHRmb3IgKGo9MDtqIDwgdmVydGljZXNEYXRhLmxlbmd0aDtqKz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4U3RyaWRlIC8gNCl7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlPXZlcnRpY2VzW25dO1xyXG4gICAgICAgICAgICAgICAgb2ZzZXQ9aitwb3NpdGlvbkVsZW1lbnQub2Zmc2V0IC8gNDtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzRGF0YVtvZnNldCswXT12ZXJ0aWNlLng7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlc0RhdGFbb2ZzZXQrMV09dmVydGljZS55O1xyXG4gICAgICAgICAgICAgICAgdmVydGljZXNEYXRhW29mc2V0KzJdPXZlcnRpY2UuejtcclxuICAgICAgICAgICAgICAgIG4rKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIuc2V0RGF0YSh2ZXJ0aWNlc0RhdGEpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIG9uR2V0V29ybGRQb3ModGFyZ2V0LHBvcyl7XHJcbiAgICAgICAgdmFyIG91dFBvcz1uZXcgTGF5YS5WZWN0b3IzKCk7XHJcbiAgICAgICAgaWYgKHRhcmdldC5fcGFyZW50ICE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRQb3NpdGlvbj10YXJnZXQucGFyZW50LnRyYW5zZm9ybS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgTGF5YS5WZWN0b3IzLm11bHRpcGx5KHBvcyx0YXJnZXQucGFyZW50LnRyYW5zZm9ybS5zY2FsZSxMYXlhLlRyYW5zZm9ybTNEW1wiX3RlbXBWZWN0b3IzMFwiXSk7XHJcbiAgICAgICAgICAgIExheWEuVmVjdG9yMy50cmFuc2Zvcm1RdWF0KExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdLHRhcmdldC5wYXJlbnQudHJhbnNmb3JtLnJvdGF0aW9uLExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdKTtcclxuICAgICAgICAgICAgTGF5YS5WZWN0b3IzLmFkZChwYXJlbnRQb3NpdGlvbixMYXlhLlRyYW5zZm9ybTNEW1wiX3RlbXBWZWN0b3IzMFwiXSxvdXRQb3MpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgcG9zLmNsb25lVG8ob3V0UG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dFBvcztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gXCIuLi9XbXlTY3JpcHQzRFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215UGh5c2ljc19DaGFyYWN0ZXIgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XHJcblx0cHVibGljIG9uRGVsKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuY2hhcmFjdGVyIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYXJhY3Rlcj1udWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjaGFyYWN0ZXI6TGF5YS5DaGFyYWN0ZXJDb250cm9sbGVyO1xyXG5cclxuICAgIHB1YmxpYyBzcGVlZFYzPW5ldyBMYXlhLlZlY3RvcjMoKTtcclxuICAgIHB1YmxpYyBncmF2aXR5PW5ldyBMYXlhLlZlY3RvcjMoKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzR3JvdW5kZWQoKXtcclxuICAgICAgICBpZih0aGlzLmNoYXJhY3Rlcj09bnVsbClyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyLmlzR3JvdW5kZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uU3RhcnQoKXtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Jbml0KHJhZGl1cywgbGVuZ3RoLCBvcmllbnRhdGlvbixsb2NhbE9mZnNldFgsIGxvY2FsT2Zmc2V0WSwgbG9jYWxPZmZzZXRaKXtcclxuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IHRoaXMub3duZXIzRC5hZGRDb21wb25lbnQoTGF5YS5DaGFyYWN0ZXJDb250cm9sbGVyKTtcclxuXHRcdHZhciBzcGhlcmVTaGFwZTpMYXlhLkNhcHN1bGVDb2xsaWRlclNoYXBlID0gbmV3IExheWEuQ2Fwc3VsZUNvbGxpZGVyU2hhcGUocmFkaXVzLCBsZW5ndGgsIG9yaWVudGF0aW9uKTtcclxuICAgICAgICBzcGhlcmVTaGFwZS5sb2NhbE9mZnNldCA9bmV3IExheWEuVmVjdG9yMyhsb2NhbE9mZnNldFgsbG9jYWxPZmZzZXRZLGxvY2FsT2Zmc2V0Wik7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIuY29sbGlkZXJTaGFwZSA9IHNwaGVyZVNoYXBlO1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLmdyYXZpdHk9dGhpcy5ncmF2aXR5O1xyXG4gICAgICAgIC8vIHRoaXMuY2hhcmFjdGVyLl91cGRhdGVQaHlzaWNzVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgcHVibGljIGlzTG9ja01vdmU9ZmFsc2U7XHJcbiAgICBvblVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLmdyYXZpdHk9dGhpcy5ncmF2aXR5O1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLm1vdmUodGhpcy5zcGVlZFYzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbW92ZSh2MzpMYXlhLlZlY3RvcjMsbG9ja01vdmVUaW1lOm51bWJlcj0wKXtcclxuICAgICAgICB0aGlzLmlzTG9ja01vdmU9dHJ1ZTtcclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5tb3ZlKHYzKTtcclxuICAgICAgICBMYXlhLnRpbWVyLm9uY2UobG9ja01vdmVUaW1lKjEwMDAsdGhpcywoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmlzTG9ja01vdmU9ZmFsc2U7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIF91cGRhdGVQaHlzaWNzVHJhbnNmb3JtKCl7XHJcblx0XHQvL3ZhciBuYXRpdmVXb3JsZFRyYW5zZm9ybT10aGlzLmNoYXJhY3Rlci5fbmF0aXZlQ29sbGlkZXJPYmplY3QuZ2V0V29ybGRUcmFuc2Zvcm0oKTtcclxuXHRcdHRoaXMuY2hhcmFjdGVyLl9kZXJpdmVQaHlzaWNzVHJhbnNmb3JtYXRpb24odHJ1ZSk7IFxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFdFYXNlVHlwZSB9IGZyb20gXCIuL1dFYXNlVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdFYXNlTWFuYWdlciB7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX1BpT3ZlcjI6IG51bWJlciA9IE1hdGguUEkgKiAwLjU7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX1R3b1BpOiBudW1iZXIgPSBNYXRoLlBJICogMjtcclxuXHJcblx0cHVibGljIHN0YXRpYyBldmFsdWF0ZShlYXNlVHlwZTogbnVtYmVyLCB0aW1lOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIsIG92ZXJzaG9vdE9yQW1wbGl0dWRlOiBudW1iZXIsIHBlcmlvZDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdHN3aXRjaCAoZWFzZVR5cGUpIHtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuTGluZWFyOlxyXG5cdFx0XHRcdHJldHVybiB0aW1lIC8gZHVyYXRpb247XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlNpbmVJbjpcclxuXHRcdFx0XHRyZXR1cm4gLU1hdGguY29zKHRpbWUgLyBkdXJhdGlvbiAqIFdFYXNlTWFuYWdlci5fUGlPdmVyMikgKyAxO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5TaW5lT3V0OlxyXG5cdFx0XHRcdHJldHVybiBNYXRoLnNpbih0aW1lIC8gZHVyYXRpb24gKiBXRWFzZU1hbmFnZXIuX1BpT3ZlcjIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5TaW5lSW5PdXQ6XHJcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHRpbWUgLyBkdXJhdGlvbikgLSAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhZEluOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFkT3V0OlxyXG5cdFx0XHRcdHJldHVybiAtKHRpbWUgLz0gZHVyYXRpb24pICogKHRpbWUgLSAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhZEluT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoKC0tdGltZSkgKiAodGltZSAtIDIpIC0gMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkN1YmljSW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DdWJpY091dDpcclxuXHRcdFx0XHRyZXR1cm4gKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogdGltZSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DdWJpY0luT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRcdHJldHVybiAwLjUgKiAoKHRpbWUgLT0gMikgKiB0aW1lICogdGltZSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFydEluOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YXJ0T3V0OlxyXG5cdFx0XHRcdHJldHVybiAtKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogdGltZSAqIHRpbWUgLSAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhcnRJbk91dDpcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoKHRpbWUgLT0gMikgKiB0aW1lICogdGltZSAqIHRpbWUgLSAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVpbnRJbjpcclxuXHRcdFx0XHRyZXR1cm4gKHRpbWUgLz0gZHVyYXRpb24pICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVpbnRPdXQ6XHJcblx0XHRcdFx0cmV0dXJuICgodGltZSA9IHRpbWUgLyBkdXJhdGlvbiAtIDEpICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWludEluT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWUgKyAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRXhwb0luOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSA9PSAwKSA/IDAgOiBNYXRoLnBvdygyLCAxMCAqICh0aW1lIC8gZHVyYXRpb24gLSAxKSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkV4cG9PdXQ6XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gZHVyYXRpb24pIHJldHVybiAxO1xyXG5cdFx0XHRcdHJldHVybiAoLU1hdGgucG93KDIsIC0xMCAqIHRpbWUgLyBkdXJhdGlvbikgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRXhwb0luT3V0OlxyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IGR1cmF0aW9uKSByZXR1cm4gMTtcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqIE1hdGgucG93KDIsIDEwICogKHRpbWUgLSAxKSk7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgtTWF0aC5wb3coMiwgLTEwICogLS10aW1lKSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DaXJjSW46XHJcblx0XHRcdFx0cmV0dXJuIC0oTWF0aC5zcXJ0KDEgLSAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lKSAtIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DaXJjT3V0OlxyXG5cdFx0XHRcdHJldHVybiBNYXRoLnNxcnQoMSAtICh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQ2lyY0luT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHRpbWUgKiB0aW1lKSAtIDEpO1xyXG5cdFx0XHRcdHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAodGltZSAtPSAyKSAqIHRpbWUpICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkVsYXN0aWNJbjpcclxuXHRcdFx0XHR2YXIgczA6IG51bWJlcjtcclxuXHRcdFx0XHRpZiAodGltZSA9PSAwKSByZXR1cm4gMDtcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24pID09IDEpIHJldHVybiAxO1xyXG5cdFx0XHRcdGlmIChwZXJpb2QgPT0gMCkgcGVyaW9kID0gZHVyYXRpb24gKiAwLjM7XHJcblx0XHRcdFx0aWYgKG92ZXJzaG9vdE9yQW1wbGl0dWRlIDwgMSkge1xyXG5cdFx0XHRcdFx0b3ZlcnNob290T3JBbXBsaXR1ZGUgPSAxO1xyXG5cdFx0XHRcdFx0czAgPSBwZXJpb2QgLyA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHMwID0gcGVyaW9kIC8gV0Vhc2VNYW5hZ2VyLl9Ud29QaSAqIE1hdGguYXNpbigxIC8gb3ZlcnNob290T3JBbXBsaXR1ZGUpO1xyXG5cdFx0XHRcdHJldHVybiAtKG92ZXJzaG9vdE9yQW1wbGl0dWRlICogTWF0aC5wb3coMiwgMTAgKiAodGltZSAtPSAxKSkgKiBNYXRoLnNpbigodGltZSAqIGR1cmF0aW9uIC0gczApICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FbGFzdGljT3V0OlxyXG5cdFx0XHRcdHZhciBzMTogbnVtYmVyO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbikgPT0gMSkgcmV0dXJuIDE7XHJcblx0XHRcdFx0aWYgKHBlcmlvZCA9PSAwKSBwZXJpb2QgPSBkdXJhdGlvbiAqIDAuMztcclxuXHRcdFx0XHRpZiAob3ZlcnNob290T3JBbXBsaXR1ZGUgPCAxKSB7XHJcblx0XHRcdFx0XHRvdmVyc2hvb3RPckFtcGxpdHVkZSA9IDE7XHJcblx0XHRcdFx0XHRzMSA9IHBlcmlvZCAvIDQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgczEgPSBwZXJpb2QgLyBXRWFzZU1hbmFnZXIuX1R3b1BpICogTWF0aC5hc2luKDEgLyBvdmVyc2hvb3RPckFtcGxpdHVkZSk7XHJcblx0XHRcdFx0cmV0dXJuIChvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIC0xMCAqIHRpbWUpICogTWF0aC5zaW4oKHRpbWUgKiBkdXJhdGlvbiAtIHMxKSAqIFdFYXNlTWFuYWdlci5fVHdvUGkgLyBwZXJpb2QpICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkVsYXN0aWNJbk91dDpcclxuXHRcdFx0XHR2YXIgczogbnVtYmVyO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPT0gMikgcmV0dXJuIDE7XHJcblx0XHRcdFx0aWYgKHBlcmlvZCA9PSAwKSBwZXJpb2QgPSBkdXJhdGlvbiAqICgwLjMgKiAxLjUpO1xyXG5cdFx0XHRcdGlmIChvdmVyc2hvb3RPckFtcGxpdHVkZSA8IDEpIHtcclxuXHRcdFx0XHRcdG92ZXJzaG9vdE9yQW1wbGl0dWRlID0gMTtcclxuXHRcdFx0XHRcdHMgPSBwZXJpb2QgLyA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHMgPSBwZXJpb2QgLyBXRWFzZU1hbmFnZXIuX1R3b1BpICogTWF0aC5hc2luKDEgLyBvdmVyc2hvb3RPckFtcGxpdHVkZSk7XHJcblx0XHRcdFx0aWYgKHRpbWUgPCAxKSByZXR1cm4gLTAuNSAqIChvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIDEwICogKHRpbWUgLT0gMSkpICogTWF0aC5zaW4oKHRpbWUgKiBkdXJhdGlvbiAtIHMpICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkpO1xyXG5cdFx0XHRcdHJldHVybiBvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIC0xMCAqICh0aW1lIC09IDEpKSAqIE1hdGguc2luKCh0aW1lICogZHVyYXRpb24gLSBzKSAqIFdFYXNlTWFuYWdlci5fVHdvUGkgLyBwZXJpb2QpICogMC41ICsgMTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQmFja0luOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lICogKChvdmVyc2hvb3RPckFtcGxpdHVkZSArIDEpICogdGltZSAtIG92ZXJzaG9vdE9yQW1wbGl0dWRlKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQmFja091dDpcclxuXHRcdFx0XHRyZXR1cm4gKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogKChvdmVyc2hvb3RPckFtcGxpdHVkZSArIDEpICogdGltZSArIG92ZXJzaG9vdE9yQW1wbGl0dWRlKSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5CYWNrSW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiAodGltZSAqIHRpbWUgKiAoKChvdmVyc2hvb3RPckFtcGxpdHVkZSAqPSAoMS41MjUpKSArIDEpICogdGltZSAtIG92ZXJzaG9vdE9yQW1wbGl0dWRlKSk7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiAoKChvdmVyc2hvb3RPckFtcGxpdHVkZSAqPSAoMS41MjUpKSArIDEpICogdGltZSArIG92ZXJzaG9vdE9yQW1wbGl0dWRlKSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5Cb3VuY2VJbjpcclxuXHRcdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VJbih0aW1lLCBkdXJhdGlvbik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJvdW5jZU91dDpcclxuXHRcdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VPdXQodGltZSwgZHVyYXRpb24pO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5Cb3VuY2VJbk91dDpcclxuXHRcdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VJbk91dCh0aW1lLCBkdXJhdGlvbik7XHJcblxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHJldHVybiAtKHRpbWUgLz0gZHVyYXRpb24pICogKHRpbWUgLSAyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxufVxyXG5cclxuLy8vIFRoaXMgY2xhc3MgY29udGFpbnMgYSBDIyBwb3J0IG9mIHRoZSBlYXNpbmcgZXF1YXRpb25zIGNyZWF0ZWQgYnkgUm9iZXJ0IFBlbm5lciAoaHR0cDovL3JvYmVydHBlbm5lci5jb20vZWFzaW5nKS5cclxuZXhwb3J0IGNsYXNzIEJvdW5jZSB7XHJcblx0cHVibGljIHN0YXRpYyBlYXNlSW4odGltZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiAxIC0gQm91bmNlLmVhc2VPdXQoZHVyYXRpb24gLSB0aW1lLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGVhc2VPdXQodGltZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdGlmICgodGltZSAvPSBkdXJhdGlvbikgPCAoMSAvIDIuNzUpKSB7XHJcblx0XHRcdHJldHVybiAoNy41NjI1ICogdGltZSAqIHRpbWUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRpbWUgPCAoMiAvIDIuNzUpKSB7XHJcblx0XHRcdHJldHVybiAoNy41NjI1ICogKHRpbWUgLT0gKDEuNSAvIDIuNzUpKSAqIHRpbWUgKyAwLjc1KTtcclxuXHRcdH1cclxuXHRcdGlmICh0aW1lIDwgKDIuNSAvIDIuNzUpKSB7XHJcblx0XHRcdHJldHVybiAoNy41NjI1ICogKHRpbWUgLT0gKDIuMjUgLyAyLjc1KSkgKiB0aW1lICsgMC45Mzc1KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAoNy41NjI1ICogKHRpbWUgLT0gKDIuNjI1IC8gMi43NSkpICogdGltZSArIDAuOTg0Mzc1KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZWFzZUluT3V0KHRpbWU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRpZiAodGltZSA8IGR1cmF0aW9uICogMC41KSB7XHJcblx0XHRcdHJldHVybiBCb3VuY2UuZWFzZUluKHRpbWUgKiAyLCBkdXJhdGlvbikgKiAwLjU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gQm91bmNlLmVhc2VPdXQodGltZSAqIDIgLSBkdXJhdGlvbiwgZHVyYXRpb24pICogMC41ICsgMC41O1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBXRWFzZVR5cGUge1xyXG5cdHB1YmxpYyBzdGF0aWMgTGluZWFyOiBudW1iZXIgPSAwO1xyXG5cdHB1YmxpYyBzdGF0aWMgU2luZUluOiBudW1iZXIgPSAxO1xyXG5cdHB1YmxpYyBzdGF0aWMgU2luZU91dDogbnVtYmVyID0gMjtcclxuXHRwdWJsaWMgc3RhdGljIFNpbmVJbk91dDogbnVtYmVyID0gMztcclxuXHRwdWJsaWMgc3RhdGljIFF1YWRJbjogbnVtYmVyID0gNDtcclxuXHRwdWJsaWMgc3RhdGljIFF1YWRPdXQ6IG51bWJlciA9IDU7XHJcblx0cHVibGljIHN0YXRpYyBRdWFkSW5PdXQ6IG51bWJlciA9IDY7XHJcblx0cHVibGljIHN0YXRpYyBDdWJpY0luOiBudW1iZXIgPSA3O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ3ViaWNPdXQ6IG51bWJlciA9IDg7XHJcblx0cHVibGljIHN0YXRpYyBDdWJpY0luT3V0OiBudW1iZXIgPSA5O1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhcnRJbjogbnVtYmVyID0gMTA7XHJcblx0cHVibGljIHN0YXRpYyBRdWFydE91dDogbnVtYmVyID0gMTE7XHJcblx0cHVibGljIHN0YXRpYyBRdWFydEluT3V0OiBudW1iZXIgPSAxMjtcclxuXHRwdWJsaWMgc3RhdGljIFF1aW50SW46IG51bWJlciA9IDEzO1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVpbnRPdXQ6IG51bWJlciA9IDE0O1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVpbnRJbk91dDogbnVtYmVyID0gMTU7XHJcblx0cHVibGljIHN0YXRpYyBFeHBvSW46IG51bWJlciA9IDE2O1xyXG5cdHB1YmxpYyBzdGF0aWMgRXhwb091dDogbnVtYmVyID0gMTc7XHJcblx0cHVibGljIHN0YXRpYyBFeHBvSW5PdXQ6IG51bWJlciA9IDE4O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ2lyY0luOiBudW1iZXIgPSAxOTtcclxuXHRwdWJsaWMgc3RhdGljIENpcmNPdXQ6IG51bWJlciA9IDIwO1xyXG5cdHB1YmxpYyBzdGF0aWMgQ2lyY0luT3V0OiBudW1iZXIgPSAyMTtcclxuXHRwdWJsaWMgc3RhdGljIEVsYXN0aWNJbjogbnVtYmVyID0gMjI7XHJcblx0cHVibGljIHN0YXRpYyBFbGFzdGljT3V0OiBudW1iZXIgPSAyMztcclxuXHRwdWJsaWMgc3RhdGljIEVsYXN0aWNJbk91dDogbnVtYmVyID0gMjQ7XHJcblx0cHVibGljIHN0YXRpYyBCYWNrSW46IG51bWJlciA9IDI1O1xyXG5cdHB1YmxpYyBzdGF0aWMgQmFja091dDogbnVtYmVyID0gMjY7XHJcblx0cHVibGljIHN0YXRpYyBCYWNrSW5PdXQ6IG51bWJlciA9IDI3O1xyXG5cdHB1YmxpYyBzdGF0aWMgQm91bmNlSW46IG51bWJlciA9IDI4O1xyXG5cdHB1YmxpYyBzdGF0aWMgQm91bmNlT3V0OiBudW1iZXIgPSAyOTtcclxuXHRwdWJsaWMgc3RhdGljIEJvdW5jZUluT3V0OiBudW1iZXIgPSAzMDtcclxuXHRwdWJsaWMgc3RhdGljIEN1c3RvbTogbnVtYmVyID0gMzE7XHJcbn0iLCJpbXBvcnQgeyBXVHdlZW5lciB9IGZyb20gXCIuL1dUd2VlbmVyXCI7XHJcbmltcG9ydCB7IFdUd2Vlbk1hbmFnZXIgfSBmcm9tIFwiLi9XVHdlZW5NYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV1R3ZWVuIHtcclxuXHRwdWJsaWMgc3RhdGljIGNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcblx0cHVibGljIHN0YXRpYyB0byhzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3RvKHN0YXJ0LCBlbmQsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgdG8yKHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG8yKHN0YXJ0LCBzdGFydDIsIGVuZCwgZW5kMiwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB0bzMoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIHN0YXJ0MzogbnVtYmVyLFxyXG5cdFx0ZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZW5kMzogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG8zKHN0YXJ0LCBzdGFydDIsIHN0YXJ0MywgZW5kLCBlbmQyLCBlbmQzLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvNChzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgc3RhcnQzOiBudW1iZXIsIHN0YXJ0NDogbnVtYmVyLFxyXG5cdFx0ZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZW5kMzogbnVtYmVyLCBlbmQ0OiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90bzQoc3RhcnQsIHN0YXJ0Miwgc3RhcnQzLCBzdGFydDQsIGVuZCwgZW5kMiwgZW5kMywgZW5kNCwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB0b0NvbG9yKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG9Db2xvcihzdGFydCwgZW5kLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGRlbGF5ZWRDYWxsKGRlbGF5OiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLnNldERlbGF5KGRlbGF5KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgc2hha2Uoc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBhbXBsaXR1ZGU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3NoYWtlKHN0YXJ0WCwgc3RhcnRZLCBhbXBsaXR1ZGUsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgaXNUd2VlbmluZyh0YXJnZXQ6IE9iamVjdCwgcHJvcFR5cGU6IE9iamVjdCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuaXNUd2VlbmluZyh0YXJnZXQsIHByb3BUeXBlKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMga2lsbCh0YXJnZXQ6IE9iamVjdCwgY29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZSwgcHJvcFR5cGU6IE9iamVjdCA9IG51bGwpOiB2b2lkIHtcclxuXHRcdFdUd2Vlbk1hbmFnZXIua2lsbFR3ZWVucyh0YXJnZXQsIGZhbHNlLCBudWxsKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0VHdlZW4odGFyZ2V0OiBPYmplY3QsIHByb3BUeXBlOiBPYmplY3QgPSBudWxsKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuZ2V0VHdlZW4odGFyZ2V0LCBwcm9wVHlwZSk7XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBXVHdlZW5lciB9IGZyb20gXCIuL1dUd2VlbmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV1R3ZWVuTWFuYWdlciB7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX2FjdGl2ZVR3ZWVuczogYW55W10gPSBuZXcgQXJyYXkoMzApO1xyXG5cdHByaXZhdGUgc3RhdGljIF90d2VlbmVyUG9vbDogV1R3ZWVuZXJbXSA9IFtdO1xyXG5cdHByaXZhdGUgc3RhdGljIF90b3RhbEFjdGl2ZVR3ZWVuczogbnVtYmVyID0gMDtcclxuXHRwcml2YXRlIHN0YXRpYyBfaW5pdGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgY3JlYXRlVHdlZW4oKTogV1R3ZWVuZXIge1xyXG5cdFx0aWYgKCFXVHdlZW5NYW5hZ2VyLl9pbml0ZWQpIHtcclxuXHRcdFx0TGF5YS50aW1lci5mcmFtZUxvb3AoMSwgbnVsbCwgdGhpcy51cGRhdGUpO1xyXG5cdFx0XHRXVHdlZW5NYW5hZ2VyLl9pbml0ZWQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lcjtcclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3R3ZWVuZXJQb29sLmxlbmd0aDtcclxuXHRcdGlmIChjbnQgPiAwKSB7XHJcblx0XHRcdHR3ZWVuZXIgPSBXVHdlZW5NYW5hZ2VyLl90d2VlbmVyUG9vbC5wb3AoKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0dHdlZW5lciA9IG5ldyBXVHdlZW5lcigpO1xyXG5cdFx0dHdlZW5lci5faW5pdCgpO1xyXG5cdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW1dUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zKytdID0gdHdlZW5lcjtcclxuXHJcblx0XHRpZiAoV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMgPT0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aClcclxuXHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aCA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVucy5sZW5ndGggKyBNYXRoLmNlaWwoV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aCAqIDAuNSk7XHJcblxyXG5cdFx0cmV0dXJuIHR3ZWVuZXI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGlzVHdlZW5pbmcodGFyZ2V0OiBhbnksIHByb3BUeXBlOiBhbnkpOiBib29sZWFuIHtcclxuXHRcdGlmICh0YXJnZXQgPT0gbnVsbClcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHZhciBhbnlUeXBlOiBib29sZWFuID0gcHJvcFR5cGUgPT0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVuczsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgIT0gbnVsbCAmJiB0d2VlbmVyLnRhcmdldCA9PSB0YXJnZXQgJiYgIXR3ZWVuZXIuX2tpbGxlZFxyXG5cdFx0XHRcdCYmIChhbnlUeXBlIHx8IHR3ZWVuZXIuX3Byb3BUeXBlID09IHByb3BUeXBlKSlcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGtpbGxUd2VlbnModGFyZ2V0OiBhbnksIGNvbXBsZXRlZDogYm9vbGVhbj1mYWxzZSwgcHJvcFR5cGU6IGFueSA9bnVsbCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0dmFyIGZsYWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zO1xyXG5cdFx0dmFyIGFueVR5cGU6IGJvb2xlYW4gPSBwcm9wVHlwZSA9PSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgIT0gbnVsbCAmJiB0d2VlbmVyLnRhcmdldCA9PSB0YXJnZXQgJiYgIXR3ZWVuZXIuX2tpbGxlZFxyXG5cdFx0XHRcdCYmIChhbnlUeXBlIHx8IHR3ZWVuZXIuX3Byb3BUeXBlID09IHByb3BUeXBlKSkge1xyXG5cdFx0XHRcdHR3ZWVuZXIua2lsbChjb21wbGV0ZWQpO1xyXG5cdFx0XHRcdGZsYWcgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZsYWc7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGdldFR3ZWVuKHRhcmdldDogYW55LCBwcm9wVHlwZTogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHR2YXIgY250OiBudW1iZXIgPSBXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucztcclxuXHRcdHZhciBhbnlUeXBlOiBib29sZWFuID0gcHJvcFR5cGUgPT0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBjbnQ7IGkrKykge1xyXG5cdFx0XHR2YXIgdHdlZW5lcjogV1R3ZWVuZXIgPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV07XHJcblx0XHRcdGlmICh0d2VlbmVyICE9IG51bGwgJiYgdHdlZW5lci50YXJnZXQgPT0gdGFyZ2V0ICYmICF0d2VlbmVyLl9raWxsZWRcclxuXHRcdFx0XHQmJiAoYW55VHlwZSB8fCB0d2VlbmVyLl9wcm9wVHlwZSA9PSBwcm9wVHlwZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHdlZW5lcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB1cGRhdGUoKTogdm9pZCB7XHJcblx0XHR2YXIgZHQ6IG51bWJlciA9IExheWEudGltZXIuZGVsdGEgLyAxMDAwO1xyXG5cclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zO1xyXG5cdFx0dmFyIGZyZWVQb3NTdGFydDogbnVtYmVyID0gLTE7XHJcblx0XHR2YXIgZnJlZVBvc0NvdW50OiBudW1iZXIgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChmcmVlUG9zU3RhcnQgPT0gLTEpXHJcblx0XHRcdFx0XHRmcmVlUG9zU3RhcnQgPSBpO1xyXG5cdFx0XHRcdGZyZWVQb3NDb3VudCsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHR3ZWVuZXIuX2tpbGxlZCkge1xyXG5cdFx0XHRcdHR3ZWVuZXIuX3Jlc2V0KCk7XHJcblx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fdHdlZW5lclBvb2wucHVzaCh0d2VlbmVyKTtcclxuXHRcdFx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV0gPSBudWxsO1xyXG5cclxuXHRcdFx0XHRpZiAoZnJlZVBvc1N0YXJ0ID09IC0xKVxyXG5cdFx0XHRcdFx0ZnJlZVBvc1N0YXJ0ID0gaTtcclxuXHRcdFx0XHRmcmVlUG9zQ291bnQrKztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpZiAoIXR3ZWVuZXIuX3BhdXNlZClcclxuXHRcdFx0XHRcdHR3ZWVuZXIuX3VwZGF0ZShkdCk7XHJcblxyXG5cdFx0XHRcdGlmIChmcmVlUG9zU3RhcnQgIT0gLTEpIHtcclxuXHRcdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tmcmVlUG9zU3RhcnRdID0gdHdlZW5lcjtcclxuXHRcdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXSA9IG51bGw7XHJcblx0XHRcdFx0XHRmcmVlUG9zU3RhcnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZnJlZVBvc1N0YXJ0ID49IDApIHtcclxuXHRcdFx0aWYgKFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zICE9IGNudCkgLy9uZXcgdHdlZW5zIGFkZGVkXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgajogbnVtYmVyID0gY250O1xyXG5cdFx0XHRcdGNudCA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zIC0gY250O1xyXG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjbnQ7IGkrKylcclxuXHRcdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tmcmVlUG9zU3RhcnQrK10gPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaisrXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucyA9IGZyZWVQb3NTdGFydDtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgV1R3ZWVuVmFsdWUge1xyXG5cdHB1YmxpYyB4OiBudW1iZXI7XHJcblx0cHVibGljIHk6IG51bWJlcjtcclxuXHRwdWJsaWMgejogbnVtYmVyO1xyXG5cdHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gdGhpcy53ID0gMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgY29sb3IoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiAodGhpcy53IDw8IDI0KSArICh0aGlzLnggPDwgMTYpICsgKHRoaXMueSA8PCA4KSArIHRoaXMuejtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgY29sb3IodmFsdWU6IG51bWJlcikge1xyXG5cdFx0dGhpcy54ID0gKHZhbHVlICYgMHhGRjAwMDApID4+IDE2O1xyXG5cdFx0dGhpcy55ID0gKHZhbHVlICYgMHgwMEZGMDApID4+IDg7XHJcblx0XHR0aGlzLnogPSAodmFsdWUgJiAweDAwMDBGRik7XHJcblx0XHR0aGlzLncgPSAodmFsdWUgJiAweEZGMDAwMDAwKSA+PiAyNDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRGaWVsZChpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdHN3aXRjaCAoaW5kZXgpIHtcclxuXHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLng7XHJcblx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy55O1xyXG5cdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuejtcclxuXHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLnc7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5kZXggb3V0IG9mIGJvdW5kczogXCIgKyBpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RmllbGQoaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0c3dpdGNoIChpbmRleCkge1xyXG5cdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0dGhpcy54ID0gdmFsdWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHR0aGlzLnkgPSB2YWx1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdHRoaXMueiA9IHZhbHVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0dGhpcy53ID0gdmFsdWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5kZXggb3V0IG9mIGJvdW5kczogXCIgKyBpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0WmVybygpOiB2b2lkIHtcclxuXHRcdHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IHRoaXMudyA9IDA7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgV1R3ZWVuVmFsdWUgfSBmcm9tIFwiLi9XVHdlZW5WYWx1ZVwiO1xyXG5pbXBvcnQgeyBXRWFzZVR5cGUgfSBmcm9tIFwiLi9XRWFzZVR5cGVcIjtcclxuaW1wb3J0IHsgV1R3ZWVuIH0gZnJvbSBcIi4vV1R3ZWVuXCI7XHJcbmltcG9ydCB7IFdFYXNlTWFuYWdlciB9IGZyb20gXCIuL1dFYXNlTWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdUd2VlbmVyIHtcclxuXHRwdWJsaWMgX3RhcmdldDogYW55O1xyXG5cdHB1YmxpYyBfcHJvcFR5cGU6IGFueTtcclxuXHRwdWJsaWMgX2tpbGxlZDogYm9vbGVhbjtcclxuXHRwdWJsaWMgX3BhdXNlZDogYm9vbGVhbjtcclxuXHJcblx0cHJpdmF0ZSBfZGVsYXk6IG51bWJlcjtcclxuXHRwcml2YXRlIF9kdXJhdGlvbjogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2JyZWFrcG9pbnQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF9lYXNlVHlwZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2Vhc2VPdmVyc2hvb3RPckFtcGxpdHVkZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2Vhc2VQZXJpb2Q6IG51bWJlcjtcclxuXHRwcml2YXRlIF9yZXBlYXQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF95b3lvOiBib29sZWFuO1xyXG5cdHByaXZhdGUgX3RpbWVTY2FsZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3NuYXBwaW5nOiBib29sZWFuO1xyXG5cdHByaXZhdGUgX3VzZXJEYXRhOiBhbnk7XHJcblxyXG5cdHByaXZhdGUgX29uVXBkYXRlOiBGdW5jdGlvbjtcclxuXHRwcml2YXRlIF9vblVwZGF0ZUNhbGxlcjogYW55O1xyXG5cdHByaXZhdGUgX29uU3RhcnQ6IEZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgX29uU3RhcnRDYWxsZXI6IGFueTtcclxuXHRwcml2YXRlIF9vbkNvbXBsZXRlOiBGdW5jdGlvbjtcclxuXHRwcml2YXRlIF9vbkNvbXBsZXRlQ2FsbGVyOiBhbnk7XHJcblxyXG5cdHByaXZhdGUgX3N0YXJ0VmFsdWU6IFdUd2VlblZhbHVlO1xyXG5cdHByaXZhdGUgX2VuZFZhbHVlOiBXVHdlZW5WYWx1ZTtcclxuXHRwcml2YXRlIF92YWx1ZTogV1R3ZWVuVmFsdWU7XHJcblx0cHJpdmF0ZSBfZGVsdGFWYWx1ZTogV1R3ZWVuVmFsdWU7XHJcblx0cHJpdmF0ZSBfdmFsdWVTaXplOiBudW1iZXI7XHJcblxyXG5cdHByaXZhdGUgX3N0YXJ0ZWQ6IGJvb2xlYW47XHJcblx0cHVibGljIF9lbmRlZDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2VsYXBzZWRUaW1lOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfbm9ybWFsaXplZFRpbWU6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlID0gbmV3IFdUd2VlblZhbHVlKCk7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZSA9IG5ldyBXVHdlZW5WYWx1ZSgpO1xyXG5cdFx0dGhpcy5fdmFsdWUgPSBuZXcgV1R3ZWVuVmFsdWUoKTtcclxuXHRcdHRoaXMuX2RlbHRhVmFsdWUgPSBuZXcgV1R3ZWVuVmFsdWUoKTtcclxuXHJcblx0XHR0aGlzLl9yZXNldCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldERlbGF5KHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9kZWxheSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGRlbGF5KCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGVsYXk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RHVyYXRpb24odmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZHVyYXRpb24oKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9kdXJhdGlvbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRCcmVha3BvaW50KHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9icmVha3BvaW50ID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRFYXNlKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9lYXNlVHlwZSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RWFzZVBlcmlvZCh2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fZWFzZVBlcmlvZCA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9lYXNlT3ZlcnNob290T3JBbXBsaXR1ZGUgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFJlcGVhdChyZXBlYXQ6IG51bWJlciwgeW95bzogYm9vbGVhbiA9IGZhbHNlKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fcmVwZWF0ID0gdGhpcy5yZXBlYXQ7XHJcblx0XHR0aGlzLl95b3lvID0geW95bztcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCByZXBlYXQoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9yZXBlYXQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0VGltZVNjYWxlKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl90aW1lU2NhbGUgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFNuYXBwaW5nKHZhbHVlOiBib29sZWFuKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fc25hcHBpbmcgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFRhcmdldCh2YWx1ZTogYW55LCBwcm9wVHlwZTogYW55ID0gbnVsbCk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3RhcmdldCA9IHRoaXMudmFsdWU7XHJcblx0XHR0aGlzLl9wcm9wVHlwZSA9IHByb3BUeXBlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHRhcmdldCgpOiBhbnkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3RhcmdldDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRVc2VyRGF0YSh2YWx1ZTogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdXNlckRhdGEgPSB0aGlzLnZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHVzZXJEYXRhKCk6IGFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdXNlckRhdGE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgb25VcGRhdGUoY2FsbGJhY2s6IEZ1bmN0aW9uLCBjYWxsZXI6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX29uVXBkYXRlID0gY2FsbGJhY2s7XHJcblx0XHR0aGlzLl9vblVwZGF0ZUNhbGxlciA9IGNhbGxlcjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uU3RhcnQoY2FsbGJhY2s6IEZ1bmN0aW9uLCBjYWxsZXI6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX29uU3RhcnQgPSBjYWxsYmFjaztcclxuXHRcdHRoaXMuX29uU3RhcnRDYWxsZXIgPSBjYWxsZXI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBvbkNvbXBsZXRlKGNhbGxiYWNrOiBGdW5jdGlvbiwgY2FsbGVyOiBhbnkpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9vbkNvbXBsZXRlID0gY2FsbGJhY2s7XHJcblx0XHR0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyID0gY2FsbGVyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHN0YXJ0VmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGVuZFZhbHVlKCk6IFdUd2VlblZhbHVlIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbmRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBkZWx0YVZhbHVlKCk6IFdUd2VlblZhbHVlIHtcclxuXHRcdHJldHVybiB0aGlzLl9kZWx0YVZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBub3JtYWxpemVkVGltZSgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25vcm1hbGl6ZWRUaW1lO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBjb21wbGV0ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZW5kZWQgIT0gMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgYWxsQ29tcGxldGVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VuZGVkID09IDE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0UGF1c2VkKHBhdXNlZDogYm9vbGVhbik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3BhdXNlZCA9IHBhdXNlZDtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIHRoaXMuc2VlayBwb3NpdGlvbiBvZiB0aGUgdHdlZW4sIGluIHNlY29uZHMuXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzZWVrKHRpbWU6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2tpbGxlZClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGltZTtcclxuXHRcdGlmICh0aGlzLl9lbGFwc2VkVGltZSA8IHRoaXMuX2RlbGF5KSB7XHJcblx0XHRcdGlmICh0aGlzLl9zdGFydGVkKVxyXG5cdFx0XHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGhpcy5fZGVsYXk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBraWxsKGNvbXBsZXRlOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9raWxsZWQpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRpZiAoY29tcGxldGUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2VuZGVkID09IDApIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fYnJlYWtwb2ludCA+PSAwKVxyXG5cdFx0XHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aGlzLl9kZWxheSArIHRoaXMuX2JyZWFrcG9pbnQ7XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5fcmVwZWF0ID49IDApXHJcblx0XHRcdFx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IHRoaXMuX2RlbGF5ICsgdGhpcy5fZHVyYXRpb24gKiAodGhpcy5fcmVwZWF0ICsgMSk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aGlzLl9kZWxheSArIHRoaXMuX2R1cmF0aW9uICogMjtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmNhbGxDb21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fa2lsbGVkID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG8oc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAxO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF90bzIoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAyO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnQyO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueSA9IGVuZDI7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvMyhzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgc3RhcnQzOiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAzO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnQyO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueSA9IGVuZDI7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnogPSBzdGFydDM7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS56ID0gZW5kMztcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG80KHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBzdGFydDM6IG51bWJlciwgc3RhcnQ0OiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGVuZDQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnggPSBlbmQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnkgPSBzdGFydDI7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS55ID0gZW5kMjtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueiA9IHN0YXJ0MztcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnogPSBlbmQzO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS53ID0gc3RhcnQ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUudyA9IGVuZDQ7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvQ29sb3Ioc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSA0O1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS5jb2xvciA9IHN0YXJ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUuY29sb3IgPSBlbmQ7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3NoYWtlKHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgYW1wbGl0dWRlOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSA1O1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnRYO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnRZO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS53ID0gYW1wbGl0dWRlO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHRoaXMuX2Vhc2VUeXBlID0gV0Vhc2VUeXBlLkxpbmVhcjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9pbml0KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fZGVsYXkgPSAwO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSAwO1xyXG5cdFx0dGhpcy5fYnJlYWtwb2ludCA9IC0xO1xyXG5cdFx0dGhpcy5fZWFzZVR5cGUgPSBXRWFzZVR5cGUuUXVhZE91dDtcclxuXHRcdHRoaXMuX3RpbWVTY2FsZSA9IDE7XHJcblx0XHR0aGlzLl9lYXNlUGVyaW9kID0gMDtcclxuXHRcdHRoaXMuX2Vhc2VPdmVyc2hvb3RPckFtcGxpdHVkZSA9IDEuNzAxNTg7XHJcblx0XHR0aGlzLl9zbmFwcGluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fcmVwZWF0ID0gMDtcclxuXHRcdHRoaXMuX3lveW8gPSBmYWxzZTtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDA7XHJcblx0XHR0aGlzLl9zdGFydGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLl9wYXVzZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuX2tpbGxlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xyXG5cdFx0dGhpcy5fbm9ybWFsaXplZFRpbWUgPSAwO1xyXG5cdFx0dGhpcy5fZW5kZWQgPSAwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9yZXNldCgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3RhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLl91c2VyRGF0YSA9IG51bGw7XHJcblx0XHR0aGlzLl9vblN0YXJ0ID0gdGhpcy5fb25VcGRhdGUgPSB0aGlzLl9vbkNvbXBsZXRlID0gbnVsbDtcclxuXHRcdHRoaXMuX29uU3RhcnRDYWxsZXIgPSB0aGlzLl9vblVwZGF0ZUNhbGxlciA9IHRoaXMuX29uQ29tcGxldGVDYWxsZXIgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF91cGRhdGUoZHQ6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX3RpbWVTY2FsZSAhPSAxKVxyXG5cdFx0XHRkdCAqPSB0aGlzLl90aW1lU2NhbGU7XHJcblx0XHRpZiAoZHQgPT0gMClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh0aGlzLl9lbmRlZCAhPSAwKSAvL01heWJlIHRoaXMuY29tcGxldGVkIGJ5IHRoaXMuc2Vla1xyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLmNhbGxDb21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHRcdHRoaXMuX2tpbGxlZCA9IHRydWU7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9lbGFwc2VkVGltZSArPSBkdDtcclxuXHRcdHRoaXMudXBkYXRlKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2VuZGVkICE9IDApIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9raWxsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmNhbGxDb21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHRcdFx0dGhpcy5fa2lsbGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHVwZGF0ZShkdD86IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYoZHQhPW51bGwpe1xyXG5cdFx0XHRpZiAodGhpcy5fdGltZVNjYWxlICE9IDEpXHJcblx0XHRcdFx0ZHQgKj0gdGhpcy5fdGltZVNjYWxlO1xyXG5cdFx0XHRpZiAoZHQgPT0gMClcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHR0aGlzLl9lbGFwc2VkVGltZSArPSBkdDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9lbmRlZCA9IDA7XHJcblx0XHR2YXIgX2R1cmF0aW9uPXRoaXMuX2R1cmF0aW9uO1xyXG5cdFx0aWYgKHRoaXMuX3ZhbHVlU2l6ZSA9PSAwKSAvL0RlbGF5ZWRDYWxsXHJcblx0XHR7XHJcblx0XHRcdGlmICh0aGlzLl9lbGFwc2VkVGltZSA+PSB0aGlzLl9kZWxheSArIF9kdXJhdGlvbilcclxuXHRcdFx0XHR0aGlzLl9lbmRlZCA9IDE7XHJcblxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9zdGFydGVkKSB7XHJcblx0XHRcdGlmICh0aGlzLl9lbGFwc2VkVGltZSA8IHRoaXMuX2RlbGF5KVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdHRoaXMuX3N0YXJ0ZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmNhbGxTdGFydENhbGxiYWNrKCk7XHJcblx0XHRcdGlmICh0aGlzLl9raWxsZWQpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciByZXZlcnNlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0dmFyIHR0OiBudW1iZXIgPSB0aGlzLl9lbGFwc2VkVGltZSAtIHRoaXMuX2RlbGF5O1xyXG5cdFx0aWYgKHRoaXMuX2JyZWFrcG9pbnQgPj0gMCAmJiB0dCA+PSB0aGlzLl9icmVha3BvaW50KSB7XHJcblx0XHRcdHR0ID0gdGhpcy5fYnJlYWtwb2ludDtcclxuXHRcdFx0dGhpcy5fZW5kZWQgPSAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9yZXBlYXQgIT0gMCkge1xyXG5cdFx0XHR2YXIgcm91bmQ6IG51bWJlciA9IE1hdGguZmxvb3IodHQgLyBfZHVyYXRpb24pO1xyXG5cdFx0XHR0dCAtPSBfZHVyYXRpb24gKiByb3VuZDtcclxuXHRcdFx0aWYgKHRoaXMuX3lveW8pXHJcblx0XHRcdFx0cmV2ZXJzZWQgPSByb3VuZCAlIDIgPT0gMTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9yZXBlYXQgPiAwICYmIHRoaXMuX3JlcGVhdCAtIHJvdW5kIDwgMCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLl95b3lvKVxyXG5cdFx0XHRcdFx0cmV2ZXJzZWQgPSB0aGlzLl9yZXBlYXQgJSAyID09IDE7XHJcblx0XHRcdFx0dHQgPSBfZHVyYXRpb247XHJcblx0XHRcdFx0dGhpcy5fZW5kZWQgPSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0dCA+PSBfZHVyYXRpb24pIHtcclxuXHRcdFx0dHQgPSBfZHVyYXRpb247XHJcblx0XHRcdHRoaXMuX2VuZGVkID0gMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9ub3JtYWxpemVkVGltZSA9IFdFYXNlTWFuYWdlci5ldmFsdWF0ZSh0aGlzLl9lYXNlVHlwZSwgcmV2ZXJzZWQgPyAoX2R1cmF0aW9uIC0gdHQpIDogdHQsIF9kdXJhdGlvbixcclxuXHRcdFx0dGhpcy5fZWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlLCB0aGlzLl9lYXNlUGVyaW9kKTtcclxuXHJcblx0XHR0aGlzLl92YWx1ZS5zZXRaZXJvKCk7XHJcblx0XHR0aGlzLl9kZWx0YVZhbHVlLnNldFplcm8oKTtcclxuXHJcblx0XHRpZiAodGhpcy5fdmFsdWVTaXplID09IDUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2VuZGVkID09IDApIHtcclxuXHRcdFx0XHR2YXIgcjogbnVtYmVyID0gdGhpcy5fc3RhcnRWYWx1ZS53ICogKDEgLSB0aGlzLl9ub3JtYWxpemVkVGltZSk7XHJcblx0XHRcdFx0dmFyIHJ4OiBudW1iZXIgPSAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIHI7XHJcblx0XHRcdFx0dmFyIHJ5OiBudW1iZXIgPSAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIHI7XHJcblx0XHRcdFx0cnggPSByeCA+IDAgPyBNYXRoLmNlaWwocngpIDogTWF0aC5mbG9vcihyeCk7XHJcblx0XHRcdFx0cnkgPSByeSA+IDAgPyBNYXRoLmNlaWwocnkpIDogTWF0aC5mbG9vcihyeSk7XHJcblxyXG5cdFx0XHRcdHRoaXMuX2RlbHRhVmFsdWUueCA9IHJ4O1xyXG5cdFx0XHRcdHRoaXMuX2RlbHRhVmFsdWUueSA9IHJ5O1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnggPSB0aGlzLl9zdGFydFZhbHVlLnggKyByeDtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS55ID0gdGhpcy5fc3RhcnRWYWx1ZS55ICsgcnk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUueCA9IHRoaXMuX3N0YXJ0VmFsdWUueDtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS55ID0gdGhpcy5fc3RhcnRWYWx1ZS55O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuX3ZhbHVlU2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0dmFyIG4xOiBudW1iZXIgPSB0aGlzLl9zdGFydFZhbHVlLmdldEZpZWxkKGkpO1xyXG5cdFx0XHRcdHZhciBuMjogbnVtYmVyID0gdGhpcy5fZW5kVmFsdWUuZ2V0RmllbGQoaSk7XHJcblx0XHRcdFx0dmFyIGY6IG51bWJlciA9IG4xICsgKG4yIC0gbjEpICogdGhpcy5fbm9ybWFsaXplZFRpbWU7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3NuYXBwaW5nKVxyXG5cdFx0XHRcdFx0ZiA9IE1hdGgucm91bmQoZik7XHJcblx0XHRcdFx0dGhpcy5fZGVsdGFWYWx1ZS5zZXRGaWVsZChpLCBmIC0gdGhpcy5fdmFsdWUuZ2V0RmllbGQoaSkpO1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnNldEZpZWxkKGksIGYpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3RhcmdldCAhPSBudWxsICYmIHRoaXMuX3Byb3BUeXBlICE9IG51bGwpIHtcclxuXHRcdFx0aWYgKHRoaXMuX3Byb3BUeXBlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHRoaXMuX3ZhbHVlU2l6ZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSwgdGhpcy5fdmFsdWUueik7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA0OlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSwgdGhpcy5fdmFsdWUueiwgdGhpcy5fdmFsdWUudyk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA1OlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUuY29sb3IpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNjpcclxuXHRcdFx0XHRcdFx0dGhpcy5fcHJvcFR5cGUuY2FsbCh0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnkpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGhpcy5fcHJvcFR5cGUgaW5zdGFuY2VvZiBMYXlhLkhhbmRsZXIpIHtcclxuXHRcdFx0XHR2YXIgYXJyPVtdO1xyXG5cdFx0XHRcdHN3aXRjaCAodGhpcy5fdmFsdWVTaXplKSB7XHJcblx0XHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDQ6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56LCB0aGlzLl92YWx1ZS53XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDU6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS5jb2xvcl07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA2OlxyXG5cdFx0XHRcdFx0XHRhcnI9W3RoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueV07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5ydW5XaXRoKGFycik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3ZhbHVlU2l6ZSA9PSA1KVxyXG5cdFx0XHRcdFx0dGhpcy5fdGFyZ2V0W3RoaXMuX3Byb3BUeXBlXSA9IHRoaXMuX3ZhbHVlLmNvbG9yO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHRoaXMuX3RhcmdldFt0aGlzLl9wcm9wVHlwZV0gPSB0aGlzLl92YWx1ZS54O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jYWxsVXBkYXRlQ2FsbGJhY2soKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY2FsbFN0YXJ0Q2FsbGJhY2soKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fb25TdGFydCAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChXVHdlZW4uY2F0Y2hDYWxsYmFja0V4Y2VwdGlvbnMpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dGhpcy5fb25TdGFydC5jYWxsKHRoaXMuX29uU3RhcnRDYWxsZXIsIHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkZhaXJ5R1VJOiBlcnJvciBpbiBzdGFydCBjYWxsYmFjayA+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhpcy5fb25TdGFydC5jYWxsKHRoaXMuX29uU3RhcnRDYWxsZXIsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjYWxsVXBkYXRlQ2FsbGJhY2soKSB7XHJcblx0XHRpZiAodGhpcy5fb25VcGRhdGUgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAoV1R3ZWVuLmNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXMuX29uVXBkYXRlLmNhbGwodGhpcy5fb25VcGRhdGVDYWxsZXIsIHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkZhaXJ5R1VJOiBlcnJvciBpbiB0aGlzLnVwZGF0ZSBjYWxsYmFjayA+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhpcy5fb25VcGRhdGUuY2FsbCh0aGlzLl9vblVwZGF0ZUNhbGxlciwgdGhpcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNhbGxDb21wbGV0ZUNhbGxiYWNrKCkge1xyXG5cdFx0aWYgKHRoaXMuX29uQ29tcGxldGUgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAoV1R3ZWVuLmNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXMuX29uQ29tcGxldGUuY2FsbCh0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyLCB0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJGYWlyeUdVSTogZXJyb3IgaW4gY29tcGxldGUgY2FsbGJhY2sgPiBcIiArIGVyci5tZXNzYWdlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRoaXMuX29uQ29tcGxldGUuY2FsbCh0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyLCB0aGlzKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteU1hdENvbmZpZyB7XG4gICAgcHVibGljIHN0YXRpYyBtYXRDb25maWc9W1xue1xuXCJjX21hdE5hbWVcIjpcImRhb18xXCIsXCJpbml0RGF0YVwiOntcblwic2hhZGVyTmFtZVwiOlwid215TGF5YV93bXlMYnRcIixcIl9BbGJlZG9JbnRlbnNpdHlcIjpcIjFcIixcIl9BbHBoYUJsZW5kXCI6XCIwXCIsXCJfQWxwaGFUZXN0XCI6XCIwXCIsXCJfQ3VsbFwiOlwiMlwiLFwiX0N1dG9mZlwiOlwiMC4wMVwiLFwiX0RzdEJsZW5kXCI6XCIwXCIsXCJfR2xvc3NcIjpcIjMwXCIsXCJfSXNWZXJ0ZXhDb2xvclwiOlwiMFwiLFwiX0xpZ2h0aW5nXCI6XCIwXCIsXCJfTW9kZVwiOlwiMFwiLFwiX1JlbmRlclF1ZXVlXCI6XCIyMDAwXCIsXCJfU2hpbmluZXNzXCI6XCIwLjA3ODEyNVwiLFwiX1NwZWN1bGFyU291cmNlXCI6XCIwXCIsXCJfU3JjQmxlbmRcIjpcIjFcIixcIl9aVGVzdFwiOlwiNFwiLFwiX1pXcml0ZVwiOlwiMVwiLFwiX0NvbG9yXCI6XCIxLDEsMSwxXCIsXCJfU3BlY0NvbG9yXCI6XCIwLjUsMC41LDAuNSwxXCIsXCJfU3BlY3VsYXJcIjpcIjAuMjY0NzA1OSwwLjI2NDcwNTksMC4yNjQ3MDU5LDFcIixcIl93Q29sb3JcIjpcIjEsMC43NjgzODIyNSwwLjY2OTExNzcsMVwifSxcInRhcmdldFVybEFyclwiOltcbntcblwidXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS81MF9DMlVfZGFvXzFcIixcIm1hdElkXCI6MH1cbl19XG5dO1xufVxuIiwiLyp3bXnniYjmnKxfMjAxOC8xLzMvMTkuMzEqL1xyXG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcclxuaW1wb3J0IFdteU1hdENvbmZpZyBmcm9tICcuL1dteU1hdENvbmZpZyc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteU1hdE1hZyBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuICAgIHB1YmxpYyBvbkF3YWtlKCkge1xyXG4gICAgICAgIHZhciBzaGFkZXJNYWc9cmVxdWlyZSgnLi4vd215U2hhZGVycy9XbXlTaGFkZXJNYWcnKVsnZGVmYXVsdCddO2lmKHNoYWRlck1hZyluZXcgc2hhZGVyTWFnKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBXbXlNYXRDb25maWcubWF0Q29uZmlnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXRPYmogPSBXbXlNYXRDb25maWcubWF0Q29uZmlnW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hdChtYXRPYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZE1hdChtYXRPYmope1xyXG4gICAgICAgIGlmKG1hdE9iaj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIGNfbWF0TmFtZT1tYXRPYmpbJ2NfbWF0TmFtZSddO1xyXG4gICAgICAgIHZhciBpbml0RGF0YT1tYXRPYmpbJ2luaXREYXRhJ107XHJcbiAgICAgICAgdmFyIHRhcmdldFVybEFycj1tYXRPYmpbJ3RhcmdldFVybEFyciddO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGFyZ2V0VXJsQXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmw9dGFyZ2V0VXJsQXJyW2pdWyd1cmwnXTtcclxuICAgICAgICAgICAgdmFyIG1hdElkPXRhcmdldFVybEFycltqXVsnbWF0SWQnXTtcclxuICAgICAgICAgICAgdmFyIHRhcmdldDNEPVdteU1hdE1hZy5nZXRPYmozZFVybCh0aGlzLnNjZW5lM0QsdXJsKTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0M0QhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNYXRlcmlhbCh0YXJnZXQzRCxpbml0RGF0YSxtYXRJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE1hdGVyaWFsKHRhcmdldCxpbml0RGF0YSxtYXRJZD0wLHNoYWRlck5hbWU/LGlzTmV3TWF0ZXJpYT8pe1xyXG4gICAgICAgIGlmKHRhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihzaGFkZXJOYW1lPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBzaGFkZXJOYW1lPWluaXREYXRhLnNoYWRlck5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNoYWRlck5hbWU9PXVuZGVmaW5lZClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgc2hhZGVyPUxheWEuU2hhZGVyM0QuZmluZChzaGFkZXJOYW1lKTtcclxuICAgICAgICBpZihzaGFkZXI9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciByZW5kZXJlcjtcclxuICAgICAgICB2YXIgc2hhcmVkTWF0ZXJpYWw6TGF5YS5CYXNlTWF0ZXJpYWw7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgcmVuZGVyZXI9KHRhcmdldCkuc2tpbm5lZE1lc2hSZW5kZXJlcjtcclxuICAgICAgICAgICAgaWYocmVuZGVyZXI9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXJlbmRlcmVyLm1hdGVyaWFsc1ttYXRJZF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPSh0YXJnZXQpLm1lc2hSZW5kZXJlcjtcclxuICAgICAgICAgICAgaWYocmVuZGVyZXI9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXJlbmRlcmVyLm1hdGVyaWFsc1ttYXRJZF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzaGFyZWRNYXRlcmlhbD09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmsqHmnIlzaGFyZWRNYXRlcmlhbDonLHRhcmdldCxzaGFkZXJOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzTmV3TWF0ZXJpYSl7XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXNoYXJlZE1hdGVyaWFsLmNsb25lKCk7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLm1hdGVyaWFsc1ttYXRJZF09c2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNoYXJlZE1hdGVyaWFsLnNldFNoYWRlck5hbWUoc2hhZGVyTmFtZSk7XHJcbiAgICAgICAgLy8gLy/muLLmn5PmqKHlvI9cclxuICAgICAgICAvLyB2YXIgdnNQc0Fycj1zaGFkZXJbJ3dfdnNQc0FyciddO1xyXG4gICAgICAgIC8vIGlmKHZzUHNBcnIpe1xyXG4gICAgICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZzUHNBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgICAgIHZhciByZW5kZXJEYXRhT2JqID0gdnNQc0FycltpXVsyXTtcclxuICAgICAgICAvLyAgICAgICAgIGZvciAodmFyIGtleSBpbiByZW5kZXJEYXRhT2JqKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgaWYgKHJlbmRlckRhdGFPYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpZihzaGFyZWRNYXRlcmlhbC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsW2tleV09cmVuZGVyRGF0YU9ialtrZXldO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHZhciByZW5kZXJTdGF0ZT1zaGFyZWRNYXRlcmlhbC5nZXRSZW5kZXJTdGF0ZShpKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgaWYocmVuZGVyU3RhdGUuaGFzT3duUHJvcGVydHkoa2V5KSl7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICByZW5kZXJTdGF0ZVtrZXldPXJlbmRlckRhdGFPYmpba2V5XTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyAvL+WIneWni+WAvFxyXG4gICAgICAgIC8vIGlmIChzaGFkZXJbJ3dfdW5pZm9ybU1hcCddICE9IG51bGwpIHtcclxuICAgICAgICAvLyAgICAgZm9yICh2YXIga2V5IGluIHNoYWRlclsnd191bmlmb3JtTWFwJ10pIHtcclxuICAgICAgICAvLyAgICAgICAgIGlmIChzaGFkZXJbJ3dfdW5pZm9ybU1hcCddLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgaW5pdElkPXNoYWRlclsnd191bmlmb3JtTWFwJ11ba2V5XVswXTtcclxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgaW5pdFY9aW5pdERhdGFba2V5XTtcclxuICAgICAgICAvLyAgICAgICAgICAgICBpZihpbml0ViE9bnVsbCl7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGluaXRWID0gaW5pdFYuc3BsaXQoJywnKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgaWYoaW5pdFYubGVuZ3RoPT00KXtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IoaW5pdElkLG5ldyBMYXlhLlZlY3RvcjQocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkscGFyc2VGbG9hdChpbml0VlsyXSkscGFyc2VGbG9hdChpbml0VlszXSkpKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09Myl7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKGluaXRJZCxuZXcgTGF5YS5WZWN0b3IzKHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pLHBhcnNlRmxvYXQoaW5pdFZbMl0pKSk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTIpe1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcihpbml0SWQsbmV3IExheWEuVmVjdG9yMihwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSkpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0xKXtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIGlmKCFpc05hTihwYXJzZUZsb2F0KGluaXRWWzBdKSkpe1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0TnVtYmVyKGluaXRJZCxwYXJzZUZsb2F0KGluaXRWWzBdKSk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJPYmo9aW5pdFZbMF0rJyc7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3RyT2JqPT0ndGV4Jyl7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXhPYmo9aW5pdERhdGFbJ1RFWEAnK2tleV07XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRleE9iaiE9bnVsbCl7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aD10ZXhPYmpbJ3BhdGgnXTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExheWEubG9hZGVyLmxvYWQocGF0aCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKF9pbml0SWQsdGV4KT0+e1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRleD09bnVsbCl7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleD1uZXcgTGF5YS5UZXh0dXJlMkQoMCwwLDAsdHJ1ZSk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VGV4dHVyZShfaW5pdElkLHRleCk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFtpbml0SWRdKSlcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICByZXR1cm4gc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBTcHJpdGUzRF9TaGFkZXJWYWx1ZXModGFyZ2V0LHZhbHVlTmFtZSx2YWx1ZSxtYXRzSWQpe1xyXG4gICAgICAgIHZhciB0T2JqQXJyPVdteU1hdE1hZy5nZXRDaGlsZHJlbkNvbXBvbmVudCh0YXJnZXQsTGF5YS5SZW5kZXJhYmxlU3ByaXRlM0QpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdE9iakFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgclAzZCA9IHRPYmpBcnJbaV07XHJcbiAgICAgICAgICAgIFdteU1hdE1hZy5SZW5kZXJhYmxlU3ByaXRlM0RfU2hhZGVyVmFsdWVzKHJQM2QsdmFsdWVOYW1lLHZhbHVlLG1hdHNJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtXHR0YXJnZXRcdOWvueixoVxyXG4gICAgICogQHBhcmFtXHR2YWx1ZU5hbWUg5YC855qE5ZCN5a2XXHJcbiAgICAgKiBAcGFyYW1cdHZhbHVlXHTlgLxcclxuICAgICAqIEBwYXJhbVx0bWF0c0lkXHTmnZDotKjnkINJRFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJlbmRlcmFibGVTcHJpdGUzRF9TaGFkZXJWYWx1ZXModGFyZ2V0LHZhbHVlTmFtZSx2YWx1ZSxtYXRzSWQpIHtcclxuICAgICAgICBpZihtYXRzSWQ9PW51bGwpbWF0c0lkPS0xO1xyXG4gICAgICAgIHZhciByZW5kZXJlcj10YXJnZXRbJ21lc2hSZW5kZXJlciddO1xyXG4gICAgICAgIGlmKHJlbmRlcmVyPT1udWxsKXtcclxuICAgICAgICAgICAgcmVuZGVyZXI9dGFyZ2V0Wydza2lubmVkTWVzaFJlbmRlcmVyJ107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFyZW5kZXJlcilyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIG1zPXJlbmRlcmVyLnNoYXJlZE1hdGVyaWFscztcclxuICAgICAgICBpZihtcy5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBpc01hdHNJZD1tYXRzSWQ8MD9mYWxzZTp0cnVlO1xyXG5cclxuICAgICAgICB2YXIgaXNPSz10cnVlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG0gPSBtc1tpXTtcclxuICAgICAgICAgICAgdmFyIHVuaWZvcm1NYXA9IG0uX3NoYWRlci5fdW5pZm9ybU1hcFt2YWx1ZU5hbWVdO1xyXG4gICAgICAgICAgICBpZighdW5pZm9ybU1hcCljb250aW51ZTtcclxuICAgICAgICAgICAgaWYoaXNNYXRzSWQpe1xyXG4gICAgICAgICAgICAgICAgaWYobWF0c0lkIT1pKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVJZD11bmlmb3JtTWFwWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYodmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuKXtcclxuICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0Qm9vbCh2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoIWlzTmFOKHZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHY9dmFsdWUrJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodi5pbmRleE9mKCcuJyk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRJbnQodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXROdW1iZXIodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih2YWx1ZSBpbnN0YW5jZW9mIExheWEuQmFzZVZlY3Rvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcih2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsdWUgaW5zdGFuY2VvZiBMYXlhLlF1YXRlcm5pb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRRdWF0ZXJuaW9uKHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih2YWx1ZSBpbnN0YW5jZW9mIExheWEuTWF0cml4NHg0KXtcclxuICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0TWF0cml4NHg0KHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih2YWx1ZSBpbnN0YW5jZW9mIExheWEuVGV4dHVyZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldFRleHR1cmUodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGlzT0s9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBpc09LPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpc09LO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25JbnN0YW5jZU5hbWUobmFtZSkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZT1udWxsO1xyXG5cdFx0dHJ5IHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKHdpbmRvd1tuYW1lXS5wcm90b3R5cGUpO1xyXG5cdFx0XHRpbnN0YW5jZS5jb25zdHJ1Y3Rvci5hcHBseShpbnN0YW5jZSwgYXJncyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmplY3RDbGFzcyhvYmopIHtcclxuICAgICAgICBpZiAob2JqICYmIG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgLypcclxuICAgICAgICAgICAqIGZvciBicm93c2VycyB3aGljaCBoYXZlIG5hbWUgcHJvcGVydHkgaW4gdGhlIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgKiBvZiB0aGUgb2JqZWN0LHN1Y2ggYXMgY2hyb21lIFxyXG4gICAgICAgICAgICovXHJcbiAgICAgICAgICBpZihvYmouY29uc3RydWN0b3IubmFtZSkge1xyXG4gICAgICAgICAgIHJldHVybiBvYmouY29uc3RydWN0b3IubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBzdHIgPSBvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKTtcclxuICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgKiBleGVjdXRlZCBpZiB0aGUgcmV0dXJuIG9mIG9iamVjdC5jb25zdHJ1Y3Rvci50b1N0cmluZygpIGlzIFxyXG4gICAgICAgICAgICogJ1tvYmplY3Qgb2JqZWN0Q2xhc3NdJ1xyXG4gICAgICAgICAgICovXHJcbiAgICAgICAgICBpZihzdHIuY2hhckF0KDApID09ICdbJylcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGFyciA9IHN0ci5tYXRjaCgvXFxbXFx3K1xccyooXFx3KylcXF0vKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGV4ZWN1dGVkIGlmIHRoZSByZXR1cm4gb2Ygb2JqZWN0LmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkgaXMgXHJcbiAgICAgICAgICAgICAqICdmdW5jdGlvbiBvYmplY3RDbGFzcyAoKSB7fSdcclxuICAgICAgICAgICAgICogZm9yIElFIEZpcmVmb3hcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBhcnIgPSBzdHIubWF0Y2goL2Z1bmN0aW9uXFxzKihcXHcrKS8pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGFyciAmJiBhcnIubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgIHJldHVybiBhcnJbMV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LGNsYXM/LGFycj8pIHtcclxuICAgICAgICBpZihhcnI9PW51bGwpYXJyPVtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb2JqPXRhcmdldC5nZXRDb21wb25lbnQoY2xhcyk7XHJcbiAgICAgICAgaWYob2JqPT1udWxsKXtcclxuICAgICAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgY2xhcyl7XHJcbiAgICAgICAgICAgICAgICBvYmo9dGFyZ2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9iaiE9bnVsbCAmJiBhcnIuaW5kZXhPZihvYmopPDApe1xyXG4gICAgICAgICAgICBhcnIucHVzaChvYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQuX2NoaWxkcmVuPT1udWxsKSByZXR1cm4gYXJyO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG8gPSB0YXJnZXQuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmdldENoaWxkcmVuQ29tcG9uZW50KG8sY2xhcyxhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBhcnJVcmw9dXJsLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldE9iakFyclVybCh0YXJnZXQsYXJyVXJsKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBfZ2V0T2JqQXJyVXJsKHRhcmdldCx1cmxBcnI6QXJyYXk8c3RyaW5nPixpZD0wKXtcclxuICAgICAgICB2YXIgX3RhcmdldDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZihfdGFyZ2V0PT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBuYT11cmxBcnJbaWRdO1xyXG4gICAgICAgIHZhciB0YXJnZXRPYmo9X3RhcmdldC5nZXRDaGlsZEJ5TmFtZShuYSk7XHJcbiAgICAgICAgaWYodGFyZ2V0T2JqPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKGlkPj11cmxBcnIubGVuZ3RoLTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0YXJnZXRPYmo9dGhpcy5fZ2V0T2JqQXJyVXJsKHRhcmdldE9iaix1cmxBcnIsKytpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VfV215U2hhZGVye1xyXG4gICAgcHJvdGVjdGVkIF9fYXR0cmlidXRlTWFwPXtcclxuICAgICAgICAnYV9Qb3NpdGlvbic6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfUE9TSVRJT04wKi8wLFxyXG4gICAgICAgICdhX0NvbG9yJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9DT0xPUjAqLzEsXHJcbiAgICAgICAgJ2FfTm9ybWFsJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9OT1JNQUwwKi8zLFxyXG4gICAgICAgICdhX1RleGNvb3JkMCc6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfVEVYVFVSRUNPT1JESU5BVEUwKi8yLFxyXG4gICAgICAgICdhX1RleGNvb3JkMSc6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfVEVYVFVSRUNPT1JESU5BVEUxKi84LFxyXG4gICAgICAgICdhX0JvbmVXZWlnaHRzJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9CTEVORFdFSUdIVDAqLzcsXHJcbiAgICAgICAgJ2FfQm9uZUluZGljZXMnOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX0JMRU5ESU5ESUNFUzAqLzYsXHJcbiAgICAgICAgJ2FfVGFuZ2VudDAnOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1RBTkdFTlQwKi81LFxyXG4gICAgICAgIC8vdmFyIHVuaWZvcm1NYXA6T2JqZWN0ID0geyd1X012cE1hdHJpeCc6IFtTcHJpdGUzRC5NVlBNQVRSSVgsIFNoYWRlcjNELlBFUklPRF9TUFJJVEVdLCAndV9Xb3JsZE1hdCc6IFtTcHJpdGUzRC5XT1JMRE1BVFJJWCwgU2hhZGVyM0QuUEVSSU9EX1NQUklURV19O1xyXG4gICAgfTtcclxuICAgIHByb3RlY3RlZCBfX3VuaWZvcm1NYXA9e1xyXG4gICAgICAgICd1X0JvbmVzJzpbIC8qbGF5YS5kMy5jb3JlLlNraW5uZWRNZXNoU3ByaXRlM0QuQk9ORVMqLzAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfQ1VTVE9NKi8wXSxcclxuICAgICAgICAndV9EaWZmdXNlVGV4dHVyZSc6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuQUxCRURPVEVYVFVSRSovMSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTCovMV0sXHJcbiAgICAgICAgJ3VfU3BlY3VsYXJUZXh0dXJlJzpbIC8qbGF5YS5kMy5jb3JlLm1hdGVyaWFsLkJsaW5uUGhvbmdNYXRlcmlhbC5TUEVDVUxBUlRFWFRVUkUqLzMsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X05vcm1hbFRleHR1cmUnOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLk5PUk1BTFRFWFRVUkUqLzIsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X0FscGhhVGVzdFZhbHVlJzpbIC8qbGF5YS5kMy5jb3JlLm1hdGVyaWFsLkJhc2VNYXRlcmlhbC5BTFBIQVRFU1RWQUxVRSovMCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTCovMV0sXHJcbiAgICAgICAgJ3VfRGlmZnVzZUNvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLm1hdGVyaWFsLkJsaW5uUGhvbmdNYXRlcmlhbC5BTEJFRE9DT0xPUiovNSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTCovMV0sXHJcbiAgICAgICAgJ3VfTWF0ZXJpYWxTcGVjdWxhcic6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuTUFURVJJQUxTUEVDVUxBUiovNiwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTCovMV0sXHJcbiAgICAgICAgJ3VfU2hpbmluZXNzJzpbIC8qbGF5YS5kMy5jb3JlLm1hdGVyaWFsLkJsaW5uUGhvbmdNYXRlcmlhbC5TSElOSU5FU1MqLzcsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X1RpbGluZ09mZnNldCc6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuVElMSU5HT0ZGU0VUKi84LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9Xb3JsZE1hdCc6W0xheWEuU3ByaXRlM0QuV09STERNQVRSSVgsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU1BSSVRFKi8yXSxcclxuICAgICAgICAndV9NdnBNYXRyaXgnOltMYXlhLlNwcml0ZTNELk1WUE1BVFJJWCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TUFJJVEUqLzJdLFxyXG4gICAgICAgICd1X0xpZ2h0bWFwU2NhbGVPZmZzZXQnOltMYXlhLlJlbmRlcmFibGVTcHJpdGUzRC5MSUdIVE1BUFNDQUxFT0ZGU0VULC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NQUklURSovMl0sXHJcbiAgICAgICAgJ3VfTGlnaHRNYXAnOltMYXlhLlJlbmRlcmFibGVTcHJpdGUzRC5MSUdIVE1BUCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TUFJJVEUqLzJdLFxyXG4gICAgICAgICd1X0NhbWVyYVBvcyc6WyAvKmxheWEuZDMuY29yZS5CYXNlQ2FtZXJhLkNBTUVSQVBPUyovMCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9DQU1FUkEqLzNdLFxyXG4gICAgICAgICd1X1JlZmxlY3RUZXh0dXJlJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuUkVGTEVDVElPTlRFWFRVUkUqLzIyLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9SZWZsZWN0SW50ZW5zaXR5JzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuUkVGTEVUSU9OSU5URU5TSVRZKi8yMywvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfRm9nU3RhcnQnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5GT0dTVEFSVCovMSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfRm9nUmFuZ2UnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5GT0dSQU5HRSovMiwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfRm9nQ29sb3InOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5GT0dDT0xPUiovMCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfRGlyZWN0aW9uTGlnaHQuQ29sb3InOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5MSUdIVERJUkNPTE9SKi80LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9EaXJlY3Rpb25MaWdodC5EaXJlY3Rpb24nOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5MSUdIVERJUkVDVElPTiovMywvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfUG9pbnRMaWdodC5Qb3NpdGlvbic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlBPSU5UTElHSFRQT1MqLzUsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1BvaW50TGlnaHQuUmFuZ2UnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5QT0lOVExJR0hUUkFOR0UqLzYsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1BvaW50TGlnaHQuQ29sb3InOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5QT0lOVExJR0hUQ09MT1IqLzgsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1Nwb3RMaWdodC5Qb3NpdGlvbic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNQT1RMSUdIVFBPUyovOSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfU3BvdExpZ2h0LkRpcmVjdGlvbic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNQT1RMSUdIVERJUkVDVElPTiovMTAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1Nwb3RMaWdodC5SYW5nZSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNQT1RMSUdIVFJBTkdFKi8xMiwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfU3BvdExpZ2h0LlNwb3QnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TUE9UTElHSFRTUE9UQU5HTEUqLzExLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9TcG90TGlnaHQuQ29sb3InOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TUE9UTElHSFRDT0xPUiovMTQsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0FtYmllbnRDb2xvcic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELkFNQklFTlRDT0xPUiovMjEsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X3NoYWRvd01hcDEnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TSEFET1dNQVBURVhUVVJFMSovMTgsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X3NoYWRvd01hcDInOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TSEFET1dNQVBURVhUVVJFMiovMTksLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X3NoYWRvd01hcDMnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TSEFET1dNQVBURVhUVVJFMyovMjAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X3NoYWRvd1BTU01EaXN0YW5jZSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNIQURPV0RJU1RBTkNFKi8xNSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfbGlnaHRTaGFkb3dWUCc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNIQURPV0xJR0hUVklFV1BST0pFQ1QqLzE2LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9zaGFkb3dQQ0ZvZmZzZXQnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TSEFET1dNQVBQQ0ZPRkZTRVQqLzE3LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9UaW1lJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuVElNRSovMjQsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1BNYXRyaXgnOlsyLCAzXSxcclxuICAgICAgICAndV9WTWF0cml4JzpbMSwgM10sXHJcbiAgICB9O1xyXG4gICAgcHJvdGVjdGVkIF92c1BzQXJyPVtdO1xyXG4gICAgcHJvdGVjdGVkIF9zaGFkZXI9bnVsbDtcclxuICAgIHByb3RlY3RlZCBfc2hhZGVyTmFtZTtcclxuICAgIHByb3RlY3RlZCBfYXR0cmlidXRlTWFwPXt9O1xyXG4gICAgcHJvdGVjdGVkIF91bmlmb3JtTWFwPXt9O1xyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgaW5pdCgpe1xyXG5cclxuICAgIH1cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB2YXIgc3ByaXRlRGVmaW5lcz1MYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Quc2hhZGVyRGVmaW5lcztcclxuICAgICAgICB2YXIgbWF0ZXJpYWxEZWZpbmVzPUxheWEuQmxpbm5QaG9uZ01hdGVyaWFsLnNoYWRlckRlZmluZXM7XHJcbiAgICAgICAgdGhpcy5fc2hhZGVyPUxheWEuU2hhZGVyM0QuYWRkKHRoaXMuX3NoYWRlck5hbWUsdGhpcy5fX2F0dHJpYnV0ZU1hcCx0aGlzLl9fdW5pZm9ybU1hcCxzcHJpdGVEZWZpbmVzLG1hdGVyaWFsRGVmaW5lcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fc2hhZGVyWyd3X3VuaWZvcm1NYXAnXT10aGlzLl91bmlmb3JtTWFwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fYXR0cmlidXRlTWFwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hdHRyaWJ1dGVNYXAuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX2F0dHJpYnV0ZU1hcFtrZXldID0gdGhpcy5fYXR0cmlidXRlTWFwW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX3VuaWZvcm1NYXApIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3VuaWZvcm1NYXAuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdW5pZm9ybU1hcFtrZXldWzFdPUxheWEuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3VuaWZvcm1NYXBba2V5XSA9IHRoaXMuX3VuaWZvcm1NYXBba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2hhZGVyWyd3X3ZzUHNBcnInXT10aGlzLl92c1BzQXJyO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl92c1BzQXJyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl92c1BzQXJyLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2c3BzPXRoaXMuX3ZzUHNBcnJba2V5XTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NoYWRlci5hZGRTaGFkZXJQYXNzKHZzcHNbMF0sdnNwc1sxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvblNldFZzUHModnMscHMscmVuZGVyRGF0YSl7XHJcbiAgICAgICAgaWYgKHZzICE9IG51bGwgJiYgcHMhPW51bGwpIHtcclxuICAgICAgICAgICAgLy8gdnM9dGhpcy5vblNldFZzKHZzKTtcclxuICAgICAgICAgICAgLy8gcHM9dGhpcy5vblNldFBzKHBzKTtcclxuICAgICAgICAgICAgaWYocmVuZGVyRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJEYXRhPXt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3ZzUHNBcnIucHVzaChbdnMscHMscmVuZGVyRGF0YV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25TZXRWcyh2cyl7XHJcbiAgICAgICAgaWYodnM9PW51bGwpcmV0dXJuICcnO1xyXG4gICAgICAgIGlmKHZzLmluZGV4T2YoJ3dteU1haW4oJyk8MClyZXR1cm4gdnM7XHJcbiAgICAgICAgdmFyIF9Wcz1gXHJcbiNpbmNsdWRlICdMaWdodGluZy5nbHNsJztcclxuXHJcbmF0dHJpYnV0ZSB2ZWM0IGFfUG9zaXRpb247XHJcbnVuaWZvcm0gbWF0NCB1X012cE1hdHJpeDtcclxuXHJcbmF0dHJpYnV0ZSB2ZWMyIGFfVGV4Y29vcmQwO1xyXG4jaWYgZGVmaW5lZChESUZGVVNFTUFQKXx8KChkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpKSYmKGRlZmluZWQoU1BFQ1VMQVJNQVApfHxkZWZpbmVkKE5PUk1BTE1BUCkpKXx8KGRlZmluZWQoTElHSFRNQVApJiZkZWZpbmVkKFVWKSlcclxuICAgIHZhcnlpbmcgdmVjMiB2X1RleGNvb3JkMDtcclxuI2VuZGlmXHJcblxyXG4jaWYgZGVmaW5lZChMSUdIVE1BUCkmJmRlZmluZWQoVVYxKVxyXG4gICAgYXR0cmlidXRlIHZlYzIgYV9UZXhjb29yZDE7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIExJR0hUTUFQXHJcbiAgICB1bmlmb3JtIHZlYzQgdV9MaWdodG1hcFNjYWxlT2Zmc2V0O1xyXG4gICAgdmFyeWluZyB2ZWMyIHZfTGlnaHRNYXBVVjtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgQ09MT1JcclxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfQ29sb3I7XHJcbiAgICB2YXJ5aW5nIHZlYzQgdl9Db2xvcjtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgQk9ORVxyXG4gICAgY29uc3QgaW50IGNfTWF4Qm9uZUNvdW50ID0gMjQ7XHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX0JvbmVJbmRpY2VzO1xyXG4gICAgYXR0cmlidXRlIHZlYzQgYV9Cb25lV2VpZ2h0cztcclxuICAgIHVuaWZvcm0gbWF0NCB1X0JvbmVzW2NfTWF4Qm9uZUNvdW50XTtcclxuI2VuZGlmXHJcblxyXG5hdHRyaWJ1dGUgdmVjMyBhX05vcm1hbDtcclxudmFyeWluZyB2ZWMzIHZfTm9ybWFsOyBcclxudW5pZm9ybSB2ZWMzIHVfQ2FtZXJhUG9zO1xyXG52YXJ5aW5nIHZlYzMgdl9WaWV3RGlyOyBcclxuYXR0cmlidXRlIHZlYzQgYV9UYW5nZW50MDtcclxudmFyeWluZyBtYXQzIHdvcmxkSW52TWF0O1xyXG52YXJ5aW5nIHZlYzMgdl9Qb3NpdGlvbjtcclxuXHJcbnZhcnlpbmcgdmVjMyB2X1RhbmdlbnQ7XHJcbnZhcnlpbmcgdmVjMyB2X0Jpbm9ybWFsO1xyXG5cclxudW5pZm9ybSBtYXQ0IHVfV29ybGRNYXQ7XHJcbnZhcnlpbmcgdmVjMyB2X1Bvc2l0aW9uV29ybGQ7XHJcblxyXG52YXJ5aW5nIGZsb2F0IHZfcG9zVmlld1o7XHJcbiNpZmRlZiBSRUNFSVZFU0hBRE9XXHJcbiAgICAjaWZkZWYgU0hBRE9XTUFQX1BTU00xIFxyXG4gICAgdmFyeWluZyB2ZWM0IHZfbGlnaHRNVlBQb3M7XHJcbiAgICB1bmlmb3JtIG1hdDQgdV9saWdodFNoYWRvd1ZQWzRdO1xyXG4gICAgI2VuZGlmXHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIFRJTElOR09GRlNFVFxyXG4gICAgdW5pZm9ybSB2ZWM0IHVfVGlsaW5nT2Zmc2V0O1xyXG4jZW5kaWZcclxuXHJcbnZvaWQgbWFpbl9jYXN0U2hhZG93KClcclxue1xyXG4gICAgI2lmZGVmIEJPTkVcclxuICAgICAgICBtYXQ0IHNraW5UcmFuc2Zvcm0gPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLngpXSAqIGFfQm9uZVdlaWdodHMueDtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueSldICogYV9Cb25lV2VpZ2h0cy55O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy56KV0gKiBhX0JvbmVXZWlnaHRzLno7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLncpXSAqIGFfQm9uZVdlaWdodHMudztcclxuICAgICAgICB2ZWM0IHBvc2l0aW9uPXNraW5UcmFuc2Zvcm0qYV9Qb3NpdGlvbjtcclxuICAgICAgICB2X1Bvc2l0aW9uPXBvc2l0aW9uLnh5ejtcclxuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfTXZwTWF0cml4ICogcG9zaXRpb247XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIHZfUG9zaXRpb249YV9Qb3NpdGlvbi54eXo7XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X012cE1hdHJpeCAqIGFfUG9zaXRpb247XHJcbiAgICAjZW5kaWZcclxuICAgICAgICBcclxuICAgIC8vVE9ET+ayoeiAg+iZkVVW5Yqo55S75ZGiXHJcbiAgICAjaWYgZGVmaW5lZChESUZGVVNFTUFQKSYmZGVmaW5lZChBTFBIQVRFU1QpXHJcbiAgICAgICAgdl9UZXhjb29yZDA9YV9UZXhjb29yZDA7XHJcbiAgICAjZW5kaWZcclxuICAgICAgICB2X3Bvc1ZpZXdaID0gZ2xfUG9zaXRpb24uejtcclxufVxyXG5cclxubWF0MyBpbnZlcnNlKG1hdDMgbSkge1xyXG4gICAgZmxvYXQgYTAwID0gbVswXVswXSwgYTAxID0gbVswXVsxXSwgYTAyID0gbVswXVsyXTtcclxuICAgIGZsb2F0IGExMCA9IG1bMV1bMF0sIGExMSA9IG1bMV1bMV0sIGExMiA9IG1bMV1bMl07XHJcbiAgICBmbG9hdCBhMjAgPSBtWzJdWzBdLCBhMjEgPSBtWzJdWzFdLCBhMjIgPSBtWzJdWzJdO1xyXG5cclxuICAgIGZsb2F0IGIwMSA9IGEyMiAqIGExMSAtIGExMiAqIGEyMTtcclxuICAgIGZsb2F0IGIxMSA9IC1hMjIgKiBhMTAgKyBhMTIgKiBhMjA7XHJcbiAgICBmbG9hdCBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjA7XHJcblxyXG4gICAgZmxvYXQgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xyXG5cclxuICAgIHJldHVybiBtYXQzKGIwMSwgKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpLCAoYTEyICogYTAxIC0gYTAyICogYTExKSxcclxuICAgICAgICAgICAgICAgIGIxMSwgKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCksICgtYTEyICogYTAwICsgYTAyICogYTEwKSxcclxuICAgICAgICAgICAgICAgIGIyMSwgKC1hMjEgKiBhMDAgKyBhMDEgKiBhMjApLCAoYTExICogYTAwIC0gYTAxICogYTEwKSkgLyBkZXQ7XHJcbn1cclxuXHJcbnZvaWQgbWFpbl9ub3JtYWwoKVxyXG57XHJcbiAgICAjaWZkZWYgQk9ORVxyXG4gICAgICAgIG1hdDQgc2tpblRyYW5zZm9ybSA9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueCldICogYV9Cb25lV2VpZ2h0cy54O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy55KV0gKiBhX0JvbmVXZWlnaHRzLnk7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLnopXSAqIGFfQm9uZVdlaWdodHMuejtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMudyldICogYV9Cb25lV2VpZ2h0cy53O1xyXG4gICAgICAgIHZlYzQgcG9zaXRpb249c2tpblRyYW5zZm9ybSphX1Bvc2l0aW9uO1xyXG4gICAgICAgIHZfUG9zaXRpb249cG9zaXRpb24ueHl6O1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBwb3NpdGlvbjtcclxuICAgICNlbHNlXHJcbiAgICAgICAgdl9Qb3NpdGlvbj1hX1Bvc2l0aW9uLnh5ejtcclxuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfTXZwTWF0cml4ICogYV9Qb3NpdGlvbjtcclxuICAgICNlbmRpZlxyXG5cclxuICAgICNpZmRlZiBCT05FXHJcbiAgICAgICAgd29ybGRJbnZNYXQ9aW52ZXJzZShtYXQzKHVfV29ybGRNYXQqc2tpblRyYW5zZm9ybSkpO1xyXG4gICAgI2Vsc2VcclxuICAgICAgICB3b3JsZEludk1hdD1pbnZlcnNlKG1hdDModV9Xb3JsZE1hdCkpO1xyXG4gICAgI2VuZGlmICBcclxuICAgIHZfTm9ybWFsPWFfTm9ybWFsKndvcmxkSW52TWF0O1xyXG5cclxuICAgIHZfVGFuZ2VudD1hX1RhbmdlbnQwLnh5eip3b3JsZEludk1hdDtcclxuICAgIHZfQmlub3JtYWw9Y3Jvc3Modl9Ob3JtYWwsdl9UYW5nZW50KSphX1RhbmdlbnQwLnc7XHJcblxyXG4gICAgI2lmZGVmIEJPTkVcclxuICAgICAgICB2X1Bvc2l0aW9uV29ybGQ9KHVfV29ybGRNYXQqcG9zaXRpb24pLnh5ejtcclxuICAgICNlbHNlXHJcbiAgICAgICAgdl9Qb3NpdGlvbldvcmxkPSh1X1dvcmxkTWF0KmFfUG9zaXRpb24pLnh5ejtcclxuICAgICNlbmRpZlxyXG4gICAgXHJcbiAgICB2X1ZpZXdEaXI9dV9DYW1lcmFQb3Mtdl9Qb3NpdGlvbldvcmxkO1xyXG5cclxuICAgICNpZiBkZWZpbmVkKERJRkZVU0VNQVApfHwoKGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVCkpJiYoZGVmaW5lZChTUEVDVUxBUk1BUCl8fGRlZmluZWQoTk9STUFMTUFQKSkpXHJcbiAgICAgICAgdl9UZXhjb29yZDA9YV9UZXhjb29yZDA7XHJcbiAgICAgICAgI2lmZGVmIFRJTElOR09GRlNFVFxyXG4gICAgICAgICAgICB2X1RleGNvb3JkMD1UcmFuc2Zvcm1VVih2X1RleGNvb3JkMCx1X1RpbGluZ09mZnNldCk7XHJcbiAgICAgICAgI2VuZGlmXHJcbiAgICAjZW5kaWZcclxuXHJcbiAgICAjaWZkZWYgTElHSFRNQVBcclxuICAgICAgICAjaWZkZWYgU0NBTEVPRkZTRVRMSUdIVElOR01BUFVWXHJcbiAgICAgICAgICAgICNpZmRlZiBVVjFcclxuICAgICAgICAgICAgICAgIHZfTGlnaHRNYXBVVj12ZWMyKGFfVGV4Y29vcmQxLngsMS4wLWFfVGV4Y29vcmQxLnkpKnVfTGlnaHRtYXBTY2FsZU9mZnNldC54eSt1X0xpZ2h0bWFwU2NhbGVPZmZzZXQuenc7XHJcbiAgICAgICAgICAgICNlbHNlXHJcbiAgICAgICAgICAgICAgICB2X0xpZ2h0TWFwVVY9dmVjMihhX1RleGNvb3JkMC54LDEuMC1hX1RleGNvb3JkMC55KSp1X0xpZ2h0bWFwU2NhbGVPZmZzZXQueHkrdV9MaWdodG1hcFNjYWxlT2Zmc2V0Lnp3O1xyXG4gICAgICAgICAgICAjZW5kaWYgXHJcbiAgICAgICAgICAgIHZfTGlnaHRNYXBVVi55PTEuMC12X0xpZ2h0TWFwVVYueTtcclxuICAgICAgICAjZWxzZVxyXG4gICAgICAgICAgICAjaWZkZWYgVVYxXHJcbiAgICAgICAgICAgICAgICB2X0xpZ2h0TWFwVVY9YV9UZXhjb29yZDE7XHJcbiAgICAgICAgICAgICNlbHNlXHJcbiAgICAgICAgICAgICAgICB2X0xpZ2h0TWFwVVY9YV9UZXhjb29yZDA7XHJcbiAgICAgICAgICAgICNlbmRpZiBcclxuICAgICAgICAjZW5kaWYgXHJcbiAgICAjZW5kaWZcclxuXHJcbiAgICAjaWYgZGVmaW5lZChDT0xPUikmJmRlZmluZWQoRU5BQkxFVkVSVEVYQ09MT1IpXHJcbiAgICAgICAgdl9Db2xvcj1hX0NvbG9yO1xyXG4gICAgI2VuZGlmXHJcblxyXG4gICAgI2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuICAgICAgICB2X3Bvc1ZpZXdaID0gZ2xfUG9zaXRpb24udztcclxuICAgICAgICAjaWZkZWYgU0hBRE9XTUFQX1BTU00xIFxyXG4gICAgICAgICAgICB2X2xpZ2h0TVZQUG9zID0gdV9saWdodFNoYWRvd1ZQWzBdICogdmVjNCh2X1Bvc2l0aW9uV29ybGQsMS4wKTtcclxuICAgICAgICAjZW5kaWZcclxuICAgICNlbmRpZlxyXG59XHJcblxyXG4vLy0td215LW1haW4tLS0tLS0tLS0tLS0tLS0tLVxyXG5tYXQzIE1BVFJJWF9JVF9NVihtYXQ0IE1vZGVsVmlld01hdHJpeCkge1xyXG4gICAgcmV0dXJuIGludmVyc2UobWF0MyhNb2RlbFZpZXdNYXRyaXgpKTtcclxufVxyXG5tYXQzIGdldFJvdGF0aW9uKHZlYzQgd1RhbmdlbnQsIHZlYzMgd05vcm1hbCkge1xyXG4gICAgdmVjMyBiaW5vcm1hbCA9IGNyb3NzKHdOb3JtYWwueHl6LCB3VGFuZ2VudC54eXopICogLXdUYW5nZW50Lnc7XHJcbiAgICBtYXQzIHJvdGF0aW9uID0gbWF0MyhcclxuICAgICAgICB3VGFuZ2VudC54LCBiaW5vcm1hbC54LCB3Tm9ybWFsLngsXHJcbiAgICAgICAgd1RhbmdlbnQueSwgYmlub3JtYWwueSwgd05vcm1hbC55LFxyXG4gICAgICAgIHdUYW5nZW50LnosIGJpbm9ybWFsLnosIHdOb3JtYWwueik7XHJcbiAgICByZXR1cm4gcm90YXRpb247XHJcbn1cclxuJHt2c31cclxuLy8tLXdteS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbnZvaWQgbWFpbigpXHJcbntcclxuICAgICNpZmRlZiBDQVNUU0hBRE9XXHJcbiAgICAgICAgbWFpbl9jYXN0U2hhZG93KCk7XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIG1haW5fbm9ybWFsKCk7XHJcbiAgICAgICAgd215TWFpbigpO1xyXG4gICAgI2VuZGlmXHJcbn0gICAgICAgIFxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgcmV0dXJuIF9WcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIG9uU2V0UHMocHMpe1xyXG4gICAgICAgIGlmKHBzPT1udWxsKXJldHVybiAnJztcclxuICAgICAgICBpZihwcy5pbmRleE9mKCd3bXlNYWluKCcpPDApcmV0dXJuIHBzO1xyXG4gICAgICAgIHZhciBfUHM9YFxyXG4jaWZkZWYgSElHSFBSRUNJU0lPTlxyXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XHJcbiNlbHNlXHJcbnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xyXG4jZW5kaWZcclxuXHJcbiNpbmNsdWRlICdMaWdodGluZy5nbHNsJztcclxuXHJcbnVuaWZvcm0gdmVjNCB1X0RpZmZ1c2VDb2xvcjtcclxuXHJcbiNpZiBkZWZpbmVkKENPTE9SKSYmZGVmaW5lZChFTkFCTEVWRVJURVhDT0xPUilcclxuICAgIHZhcnlpbmcgdmVjNCB2X0NvbG9yO1xyXG4jZW5kaWZcclxuXHJcbnZhcnlpbmcgdmVjMyB2X1ZpZXdEaXI7IFxyXG5cclxuI2lmZGVmIEFMUEhBVEVTVFxyXG4gICAgdW5pZm9ybSBmbG9hdCB1X0FscGhhVGVzdFZhbHVlO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBESUZGVVNFTUFQXHJcbiAgICB1bmlmb3JtIHNhbXBsZXIyRCB1X0RpZmZ1c2VUZXh0dXJlO1xyXG4jZW5kaWZcclxuXHJcbiNpZiBkZWZpbmVkKERJRkZVU0VNQVApfHwoKGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVCkpJiYoZGVmaW5lZChTUEVDVUxBUk1BUCl8fGRlZmluZWQoTk9STUFMTUFQKSkpXHJcbiAgICB2YXJ5aW5nIHZlYzIgdl9UZXhjb29yZDA7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIExJR0hUTUFQXHJcbiAgICB2YXJ5aW5nIHZlYzIgdl9MaWdodE1hcFVWO1xyXG4gICAgdW5pZm9ybSBzYW1wbGVyMkQgdV9MaWdodE1hcDtcclxuI2VuZGlmXHJcblxyXG4jaWYgZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKVxyXG4gICAgdW5pZm9ybSB2ZWMzIHVfTWF0ZXJpYWxTcGVjdWxhcjtcclxuICAgIHVuaWZvcm0gZmxvYXQgdV9TaGluaW5lc3M7XHJcbiAgICAjaWZkZWYgU1BFQ1VMQVJNQVAgXHJcbiAgICAgICAgdW5pZm9ybSBzYW1wbGVyMkQgdV9TcGVjdWxhclRleHR1cmU7XHJcbiAgICAjZW5kaWZcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgRk9HXHJcbiAgICB1bmlmb3JtIGZsb2F0IHVfRm9nU3RhcnQ7XHJcbiAgICB1bmlmb3JtIGZsb2F0IHVfRm9nUmFuZ2U7XHJcbiAgICB1bmlmb3JtIHZlYzMgdV9Gb2dDb2xvcjtcclxuI2VuZGlmXHJcblxyXG52YXJ5aW5nIHZlYzMgdl9Ob3JtYWw7XHJcbnZhcnlpbmcgdmVjMyB2X1Bvc2l0aW9uO1xyXG5cclxudW5pZm9ybSBzYW1wbGVyMkQgdV9Ob3JtYWxUZXh0dXJlO1xyXG52YXJ5aW5nIHZlYzMgdl9UYW5nZW50O1xyXG52YXJ5aW5nIHZlYzMgdl9CaW5vcm1hbDtcclxuXHJcbiNpZmRlZiBESVJFQ1RJT05MSUdIVFxyXG4gICAgdW5pZm9ybSBEaXJlY3Rpb25MaWdodCB1X0RpcmVjdGlvbkxpZ2h0O1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBQT0lOVExJR0hUXHJcbiAgICB1bmlmb3JtIFBvaW50TGlnaHQgdV9Qb2ludExpZ2h0O1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBTUE9UTElHSFRcclxuICAgIHVuaWZvcm0gU3BvdExpZ2h0IHVfU3BvdExpZ2h0O1xyXG4jZW5kaWZcclxuXHJcbnVuaWZvcm0gdmVjMyB1X0FtYmllbnRDb2xvcjtcclxuXHJcblxyXG4jaWYgZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpfHxkZWZpbmVkKFJFQ0VJVkVTSEFET1cpXHJcbiAgICB2YXJ5aW5nIHZlYzMgdl9Qb3NpdGlvbldvcmxkO1xyXG4jZW5kaWZcclxuXHJcbiNpbmNsdWRlICdTaGFkb3dIZWxwZXIuZ2xzbCdcclxudmFyeWluZyBmbG9hdCB2X3Bvc1ZpZXdaO1xyXG4jaWZkZWYgUkVDRUlWRVNIQURPV1xyXG4gICAgI2lmIGRlZmluZWQoU0hBRE9XTUFQX1BTU00yKXx8ZGVmaW5lZChTSEFET1dNQVBfUFNTTTMpXHJcbiAgICAgICAgdW5pZm9ybSBtYXQ0IHVfbGlnaHRTaGFkb3dWUFs0XTtcclxuICAgICNlbmRpZlxyXG4gICAgI2lmZGVmIFNIQURPV01BUF9QU1NNMSBcclxuICAgICAgICB2YXJ5aW5nIHZlYzQgdl9saWdodE1WUFBvcztcclxuICAgICNlbmRpZlxyXG4jZW5kaWZcclxuXHJcbnZvaWQgbWFpbl9jYXN0U2hhZG93KClcclxue1xyXG4gICAgLy9nbF9GcmFnQ29sb3I9dmVjNCh2X3Bvc1ZpZXdaLDAuMCwwLjAsMS4wKTtcclxuICAgIGdsX0ZyYWdDb2xvcj1wYWNrRGVwdGgodl9wb3NWaWV3Wik7XHJcbiAgICAjaWYgZGVmaW5lZChESUZGVVNFTUFQKSYmZGVmaW5lZChBTFBIQVRFU1QpXHJcbiAgICAgICAgZmxvYXQgYWxwaGEgPSB0ZXh0dXJlMkQodV9EaWZmdXNlVGV4dHVyZSx2X1RleGNvb3JkMCkudztcclxuICAgICAgICBpZiggYWxwaGEgPCB1X0FscGhhVGVzdFZhbHVlIClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc2NhcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgI2VuZGlmXHJcbn1cclxuXHJcbi8vLS13bXktbWFpbi0tLS0tLS0tLS0tLS0tLS0tXHJcbnZlYzQgbGVycFY0KHZlYzQgYSwgdmVjNCBiLCBmbG9hdCBzKSB7IHJldHVybiB2ZWM0KGEgKyAoYiAtIGEpKnMpOyB9XHJcbnZlYzMgbGVycFYzKHZlYzMgYSwgdmVjMyBiLCBmbG9hdCBzKSB7IHJldHVybiB2ZWMzKGEgKyAoYiAtIGEpKnMpOyB9XHJcbnZlYzIgbGVycFYyKHZlYzIgYSwgdmVjMiBiLCBmbG9hdCBzKSB7IHJldHVybiB2ZWMyKGEgKyAoYiAtIGEpKnMpOyB9XHJcbmZsb2F0IGxlcnBGKGZsb2F0IGEsIGZsb2F0IGIsIGZsb2F0IHMpIHsgcmV0dXJuIGZsb2F0KGEgKyAoYiAtIGEpICogcyk7IH1cclxuZmxvYXQgc2F0dXJhdGUoZmxvYXQgbikgeyByZXR1cm4gY2xhbXAobiwgMC4wLCAxLjApOyB9XHJcbnZlYzMgVW5wYWNrTm9ybWFsKHZlYzQgcGFja2Vkbm9ybWFsKSB7XHJcblx0Ly8gVGhpcyBkbyB0aGUgdHJpY2tcclxuXHRwYWNrZWRub3JtYWwueCAqPSBwYWNrZWRub3JtYWwudztcclxuXHR2ZWMzIG5vcm1hbDtcclxuXHRub3JtYWwueHkgPSBwYWNrZWRub3JtYWwueHkgKiAyLjAgLSAxLjA7XHJcblx0bm9ybWFsLnogPSBzcXJ0KDEuMCAtIHNhdHVyYXRlKGRvdChub3JtYWwueHksIG5vcm1hbC54eSkpKTtcclxuXHRyZXR1cm4gbm9ybWFsO1xyXG59XHJcbiR7cHN9XHJcbi8vLS13bXktLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG52b2lkIG1haW5fbm9ybWFsKClcclxue1xyXG5cdHZlYzMgZ2xvYmFsRGlmZnVzZT11X0FtYmllbnRDb2xvcjtcclxuXHQjaWZkZWYgTElHSFRNQVBcdFxyXG5cdFx0Z2xvYmFsRGlmZnVzZSArPSBEZWNvZGVMaWdodG1hcCh0ZXh0dXJlMkQodV9MaWdodE1hcCwgdl9MaWdodE1hcFVWKSk7XHJcblx0I2VuZGlmXHJcblx0XHJcblx0I2lmIGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVClcclxuXHRcdHZlYzMgbm9ybWFsO1xyXG5cdFx0I2lmIChkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpKSYmZGVmaW5lZChOT1JNQUxNQVApXHJcblx0XHRcdHZlYzMgbm9ybWFsTWFwU2FtcGxlID0gdGV4dHVyZTJEKHVfTm9ybWFsVGV4dHVyZSwgdl9UZXhjb29yZDApLnJnYjtcclxuXHRcdFx0bm9ybWFsID0gbm9ybWFsaXplKE5vcm1hbFNhbXBsZVRvV29ybGRTcGFjZShub3JtYWxNYXBTYW1wbGUsIHZfTm9ybWFsLCB2X1RhbmdlbnQsdl9CaW5vcm1hbCkpO1xyXG5cdFx0I2Vsc2VcclxuXHRcdFx0bm9ybWFsID0gbm9ybWFsaXplKHZfTm9ybWFsKTtcclxuXHRcdCNlbmRpZlxyXG5cdFx0dmVjMyB2aWV3RGlyPSBub3JtYWxpemUodl9WaWV3RGlyKTtcclxuXHQjZW5kaWZcclxuXHRcclxuXHR2ZWM0IG1haW5Db2xvcj11X0RpZmZ1c2VDb2xvcjtcclxuXHQjaWZkZWYgRElGRlVTRU1BUFxyXG5cdFx0dmVjNCBkaWZUZXhDb2xvcj10ZXh0dXJlMkQodV9EaWZmdXNlVGV4dHVyZSwgdl9UZXhjb29yZDApO1xyXG5cdFx0bWFpbkNvbG9yPW1haW5Db2xvcipkaWZUZXhDb2xvcjtcclxuXHQjZW5kaWYgXHJcblx0I2lmIGRlZmluZWQoQ09MT1IpJiZkZWZpbmVkKEVOQUJMRVZFUlRFWENPTE9SKVxyXG5cdFx0bWFpbkNvbG9yPW1haW5Db2xvcip2X0NvbG9yO1xyXG5cdCNlbmRpZiBcclxuICAgIFxyXG5cdCNpZmRlZiBBTFBIQVRFU1RcclxuXHRcdGlmKG1haW5Db2xvci5hPHVfQWxwaGFUZXN0VmFsdWUpXHJcblx0XHRcdGRpc2NhcmQ7XHJcblx0I2VuZGlmXHJcbiAgXHJcblx0dmVjMyBkaWZmdXNlID0gdmVjMygwLjApO1xyXG5cdHZlYzMgc3BlY3VsYXI9IHZlYzMoMC4wKTtcclxuXHQjaWYgZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKVxyXG5cdFx0dmVjMyBkaWYsc3BlO1xyXG5cdFx0I2lmZGVmIFNQRUNVTEFSTUFQXHJcblx0XHRcdHZlYzMgZ2xvc3M9dGV4dHVyZTJEKHVfU3BlY3VsYXJUZXh0dXJlLCB2X1RleGNvb3JkMCkucmdiO1xyXG5cdFx0I2Vsc2VcclxuXHRcdFx0I2lmZGVmIERJRkZVU0VNQVBcclxuXHRcdFx0XHR2ZWMzIGdsb3NzPXZlYzMoZGlmVGV4Q29sb3IuYSk7XHJcblx0XHRcdCNlbHNlXHJcblx0XHRcdFx0dmVjMyBnbG9zcz12ZWMzKDEuMCk7XHJcblx0XHRcdCNlbmRpZlxyXG5cdFx0I2VuZGlmXHJcblx0I2VuZGlmXHJcblxyXG5cdCNpZmRlZiBESVJFQ1RJT05MSUdIVFxyXG5cdFx0TGF5YUFpckJsaW5uUGhvbmdEaWVjdGlvbkxpZ2h0KHVfTWF0ZXJpYWxTcGVjdWxhcix1X1NoaW5pbmVzcyxub3JtYWwsZ2xvc3Msdmlld0Rpcix1X0RpcmVjdGlvbkxpZ2h0LGRpZixzcGUpO1xyXG5cdFx0ZGlmZnVzZSs9ZGlmO1xyXG5cdFx0c3BlY3VsYXIrPXNwZTtcclxuXHQjZW5kaWZcclxuIFxyXG5cdCNpZmRlZiBQT0lOVExJR0hUXHJcblx0XHRMYXlhQWlyQmxpbm5QaG9uZ1BvaW50TGlnaHQodl9Qb3NpdGlvbldvcmxkLHVfTWF0ZXJpYWxTcGVjdWxhcix1X1NoaW5pbmVzcyxub3JtYWwsZ2xvc3Msdmlld0Rpcix1X1BvaW50TGlnaHQsZGlmLHNwZSk7XHJcblx0XHRkaWZmdXNlKz1kaWY7XHJcblx0XHRzcGVjdWxhcis9c3BlO1xyXG5cdCNlbmRpZlxyXG5cclxuXHQjaWZkZWYgU1BPVExJR0hUXHJcblx0XHRMYXlhQWlyQmxpbm5QaG9uZ1Nwb3RMaWdodCh2X1Bvc2l0aW9uV29ybGQsdV9NYXRlcmlhbFNwZWN1bGFyLHVfU2hpbmluZXNzLG5vcm1hbCxnbG9zcyx2aWV3RGlyLHVfU3BvdExpZ2h0LGRpZixzcGUpO1xyXG5cdFx0ZGlmZnVzZSs9ZGlmO1xyXG5cdFx0c3BlY3VsYXIrPXNwZTtcclxuXHQjZW5kaWZcclxuXHRcclxuXHQjaWZkZWYgUkVDRUlWRVNIQURPV1xyXG5cdFx0ZmxvYXQgc2hhZG93VmFsdWUgPSAxLjA7XHJcblx0XHQjaWZkZWYgU0hBRE9XTUFQX1BTU00zXHJcblx0XHRcdHNoYWRvd1ZhbHVlID0gZ2V0U2hhZG93UFNTTTMoIHVfc2hhZG93TWFwMSx1X3NoYWRvd01hcDIsdV9zaGFkb3dNYXAzLHVfbGlnaHRTaGFkb3dWUCx1X3NoYWRvd1BTU01EaXN0YW5jZSx1X3NoYWRvd1BDRm9mZnNldCx2X1Bvc2l0aW9uV29ybGQsdl9wb3NWaWV3WiwwLjAwMSk7XHJcblx0XHQjZW5kaWZcclxuXHRcdCNpZmRlZiBTSEFET1dNQVBfUFNTTTJcclxuXHRcdFx0c2hhZG93VmFsdWUgPSBnZXRTaGFkb3dQU1NNMiggdV9zaGFkb3dNYXAxLHVfc2hhZG93TWFwMix1X2xpZ2h0U2hhZG93VlAsdV9zaGFkb3dQU1NNRGlzdGFuY2UsdV9zaGFkb3dQQ0ZvZmZzZXQsdl9Qb3NpdGlvbldvcmxkLHZfcG9zVmlld1osMC4wMDEpO1xyXG5cdFx0I2VuZGlmIFxyXG5cdFx0I2lmZGVmIFNIQURPV01BUF9QU1NNMVxyXG5cdFx0XHRzaGFkb3dWYWx1ZSA9IGdldFNoYWRvd1BTU00xKCB1X3NoYWRvd01hcDEsdl9saWdodE1WUFBvcyx1X3NoYWRvd1BTU01EaXN0YW5jZSx1X3NoYWRvd1BDRm9mZnNldCx2X3Bvc1ZpZXdaLDAuMDAxKTtcclxuXHRcdCNlbmRpZlxyXG5cdFx0Ly9nbF9GcmFnQ29sb3IgPXZlYzQobWFpbkNvbG9yLnJnYiooZ2xvYmFsRGlmZnVzZSArIGRpZmZ1c2UpKnNoYWRvd1ZhbHVlLG1haW5Db2xvci5hKTtcclxuXHRcdC8vZ2xfRnJhZ0NvbG9yID0gd215TWFpbihtYWluQ29sb3IsKGdsb2JhbERpZmZ1c2UgKyBkaWZmdXNlICogc2hhZG93VmFsdWUgKiAxLjEpKTtcclxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB3bXlNYWluKG1haW5Db2xvcixnbG9iYWxEaWZmdXNlLGRpZmZ1c2Usc2hhZG93VmFsdWUpO1xyXG5cdCNlbHNlXHJcblx0XHQvL2dsX0ZyYWdDb2xvciA9dmVjNChtYWluQ29sb3IucmdiKihnbG9iYWxEaWZmdXNlICsgZGlmZnVzZSksbWFpbkNvbG9yLmEpO1xyXG5cdFx0Z2xfRnJhZ0NvbG9yID0gd215TWFpbihtYWluQ29sb3IsZ2xvYmFsRGlmZnVzZSxkaWZmdXNlLDEuMCk7XHJcblx0I2VuZGlmXHJcbiAgICAvKlxyXG5cdCNpZiBkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpXHJcblx0XHQjaWZkZWYgUkVDRUlWRVNIQURPV1xyXG5cdFx0XHRnbF9GcmFnQ29sb3IucmdiKz1zcGVjdWxhcipzaGFkb3dWYWx1ZTtcclxuXHRcdCNlbHNlXHJcblx0XHRcdGdsX0ZyYWdDb2xvci5yZ2IrPXNwZWN1bGFyO1xyXG5cdFx0I2VuZGlmXHJcblx0I2VuZGlmXHJcblx0Ki9cclxuXHQjaWZkZWYgRk9HXHJcblx0XHRmbG9hdCBsZXJwRmFjdD1jbGFtcCgoMS4wL2dsX0ZyYWdDb29yZC53LXVfRm9nU3RhcnQpL3VfRm9nUmFuZ2UsMC4wLDEuMCk7XHJcblx0XHRnbF9GcmFnQ29sb3IucmdiPW1peChnbF9GcmFnQ29sb3IucmdiLHVfRm9nQ29sb3IsbGVycEZhY3QpO1xyXG5cdCNlbmRpZlxyXG59XHJcblxyXG52b2lkIG1haW4oKVxyXG57XHJcblx0I2lmZGVmIENBU1RTSEFET1dcdFx0XHJcblx0XHRtYWluX2Nhc3RTaGFkb3coKTtcclxuXHQjZWxzZVxyXG5cdFx0bWFpbl9ub3JtYWwoKTtcclxuXHQjZW5kaWYgIFxyXG59XHJcbiAgICAgICAgYDtcclxuICAgICAgICByZXR1cm4gX1BzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VfV215U2hhZGVyIGZyb20gXCIuL0Jhc2VfV215U2hhZGVyXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteUxheWFfd215TGJ0IGV4dGVuZHMgQmFzZV9XbXlTaGFkZXIge1xyXG4gICAgcHVibGljIGluaXQoKXtcclxuICAgICAgICB0aGlzLl9zaGFkZXJOYW1lPXRoaXMuY29uc3RydWN0b3JbJ25hbWUnXTtcclxuICAgICAgICB0aGlzLl91bmlmb3JtTWFwPXtcclxuXHRcdFx0J193Q29sb3InOlsxMDAwXSxcclxuXHRcdFx0J19TcGVjdWxhcic6WzEwMDFdLFxyXG5cdFx0XHQnX0dsb3NzJzpbMTAwMl0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdnNwc0Fycj1bXTtcclxuICAgICAgICAvL3Bhc3MwLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG52c3BzQXJyWzBdPVtdO1xyXG4vL3ZzXHJcbnZzcHNBcnJbMF1bMF09YFxyXG4jaW5jbHVkZSAnTGlnaHRpbmcuZ2xzbCc7XHJcblxyXG5hdHRyaWJ1dGUgdmVjNCBhX1Bvc2l0aW9uO1xyXG51bmlmb3JtIG1hdDQgdV9NdnBNYXRyaXg7XHJcblxyXG5hdHRyaWJ1dGUgdmVjMiBhX1RleGNvb3JkMDtcclxuI2lmIGRlZmluZWQoRElGRlVTRU1BUCl8fCgoZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKSkmJihkZWZpbmVkKFNQRUNVTEFSTUFQKXx8ZGVmaW5lZChOT1JNQUxNQVApKSl8fChkZWZpbmVkKExJR0hUTUFQKSYmZGVmaW5lZChVVikpXHJcbiAgICB2YXJ5aW5nIHZlYzIgdl9UZXhjb29yZDA7XHJcbiNlbmRpZlxyXG5cclxuI2lmIGRlZmluZWQoTElHSFRNQVApJiZkZWZpbmVkKFVWMSlcclxuICAgIGF0dHJpYnV0ZSB2ZWMyIGFfVGV4Y29vcmQxO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBMSUdIVE1BUFxyXG4gICAgdW5pZm9ybSB2ZWM0IHVfTGlnaHRtYXBTY2FsZU9mZnNldDtcclxuICAgIHZhcnlpbmcgdmVjMiB2X0xpZ2h0TWFwVVY7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIENPTE9SXHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX0NvbG9yO1xyXG4gICAgdmFyeWluZyB2ZWM0IHZfQ29sb3I7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIEJPTkVcclxuICAgIGNvbnN0IGludCBjX01heEJvbmVDb3VudCA9IDI0O1xyXG4gICAgYXR0cmlidXRlIHZlYzQgYV9Cb25lSW5kaWNlcztcclxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfQm9uZVdlaWdodHM7XHJcbiAgICB1bmlmb3JtIG1hdDQgdV9Cb25lc1tjX01heEJvbmVDb3VudF07XHJcbiNlbmRpZlxyXG5cclxuYXR0cmlidXRlIHZlYzMgYV9Ob3JtYWw7XHJcbnZhcnlpbmcgdmVjMyB2X05vcm1hbDsgXHJcbnVuaWZvcm0gdmVjMyB1X0NhbWVyYVBvcztcclxudmFyeWluZyB2ZWMzIHZfVmlld0RpcjsgXHJcbmF0dHJpYnV0ZSB2ZWM0IGFfVGFuZ2VudDA7XHJcbnZhcnlpbmcgbWF0MyB3b3JsZEludk1hdDtcclxudmFyeWluZyB2ZWMzIHZfUG9zaXRpb247XHJcblxyXG52YXJ5aW5nIHZlYzMgdl9UYW5nZW50O1xyXG52YXJ5aW5nIHZlYzMgdl9CaW5vcm1hbDtcclxuXHJcbnVuaWZvcm0gbWF0NCB1X1dvcmxkTWF0O1xyXG52YXJ5aW5nIHZlYzMgdl9Qb3NpdGlvbldvcmxkO1xyXG5cclxudmFyeWluZyBmbG9hdCB2X3Bvc1ZpZXdaO1xyXG4jaWZkZWYgUkVDRUlWRVNIQURPV1xyXG4gICAgI2lmZGVmIFNIQURPV01BUF9QU1NNMSBcclxuICAgIHZhcnlpbmcgdmVjNCB2X2xpZ2h0TVZQUG9zO1xyXG4gICAgdW5pZm9ybSBtYXQ0IHVfbGlnaHRTaGFkb3dWUFs0XTtcclxuICAgICNlbmRpZlxyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBUSUxJTkdPRkZTRVRcclxuICAgIHVuaWZvcm0gdmVjNCB1X1RpbGluZ09mZnNldDtcclxuI2VuZGlmXHJcblxyXG52b2lkIG1haW5fY2FzdFNoYWRvdygpXHJcbntcclxuICAgICNpZmRlZiBCT05FXHJcbiAgICAgICAgbWF0NCBza2luVHJhbnNmb3JtID0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy54KV0gKiBhX0JvbmVXZWlnaHRzLng7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLnkpXSAqIGFfQm9uZVdlaWdodHMueTtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueildICogYV9Cb25lV2VpZ2h0cy56O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy53KV0gKiBhX0JvbmVXZWlnaHRzLnc7XHJcbiAgICAgICAgdmVjNCBwb3NpdGlvbj1za2luVHJhbnNmb3JtKmFfUG9zaXRpb247XHJcbiAgICAgICAgdl9Qb3NpdGlvbj1wb3NpdGlvbi54eXo7XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X012cE1hdHJpeCAqIHBvc2l0aW9uO1xyXG4gICAgI2Vsc2VcclxuICAgICAgICB2X1Bvc2l0aW9uPWFfUG9zaXRpb24ueHl6O1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBhX1Bvc2l0aW9uO1xyXG4gICAgI2VuZGlmXHJcbiAgICAgICAgXHJcbiAgICAvL1RPRE/msqHogIPomZFVVuWKqOeUu+WRolxyXG4gICAgI2lmIGRlZmluZWQoRElGRlVTRU1BUCkmJmRlZmluZWQoQUxQSEFURVNUKVxyXG4gICAgICAgIHZfVGV4Y29vcmQwPWFfVGV4Y29vcmQwO1xyXG4gICAgI2VuZGlmXHJcbiAgICAgICAgdl9wb3NWaWV3WiA9IGdsX1Bvc2l0aW9uLno7XHJcbn1cclxuXHJcbm1hdDMgaW52ZXJzZShtYXQzIG0pIHtcclxuICAgIGZsb2F0IGEwMCA9IG1bMF1bMF0sIGEwMSA9IG1bMF1bMV0sIGEwMiA9IG1bMF1bMl07XHJcbiAgICBmbG9hdCBhMTAgPSBtWzFdWzBdLCBhMTEgPSBtWzFdWzFdLCBhMTIgPSBtWzFdWzJdO1xyXG4gICAgZmxvYXQgYTIwID0gbVsyXVswXSwgYTIxID0gbVsyXVsxXSwgYTIyID0gbVsyXVsyXTtcclxuXHJcbiAgICBmbG9hdCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjE7XHJcbiAgICBmbG9hdCBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwO1xyXG4gICAgZmxvYXQgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwO1xyXG5cclxuICAgIGZsb2F0IGRldCA9IGEwMCAqIGIwMSArIGEwMSAqIGIxMSArIGEwMiAqIGIyMTtcclxuXHJcbiAgICByZXR1cm4gbWF0MyhiMDEsICgtYTIyICogYTAxICsgYTAyICogYTIxKSwgKGExMiAqIGEwMSAtIGEwMiAqIGExMSksXHJcbiAgICAgICAgICAgICAgICBiMTEsIChhMjIgKiBhMDAgLSBhMDIgKiBhMjApLCAoLWExMiAqIGEwMCArIGEwMiAqIGExMCksXHJcbiAgICAgICAgICAgICAgICBiMjEsICgtYTIxICogYTAwICsgYTAxICogYTIwKSwgKGExMSAqIGEwMCAtIGEwMSAqIGExMCkpIC8gZGV0O1xyXG59XHJcblxyXG52b2lkIG1haW5fbm9ybWFsKClcclxue1xyXG4gICAgI2lmZGVmIEJPTkVcclxuICAgICAgICBtYXQ0IHNraW5UcmFuc2Zvcm0gPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLngpXSAqIGFfQm9uZVdlaWdodHMueDtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueSldICogYV9Cb25lV2VpZ2h0cy55O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy56KV0gKiBhX0JvbmVXZWlnaHRzLno7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLncpXSAqIGFfQm9uZVdlaWdodHMudztcclxuICAgICAgICB2ZWM0IHBvc2l0aW9uPXNraW5UcmFuc2Zvcm0qYV9Qb3NpdGlvbjtcclxuICAgICAgICB2X1Bvc2l0aW9uPXBvc2l0aW9uLnh5ejtcclxuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfTXZwTWF0cml4ICogcG9zaXRpb247XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIHZfUG9zaXRpb249YV9Qb3NpdGlvbi54eXo7XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X012cE1hdHJpeCAqIGFfUG9zaXRpb247XHJcbiAgICAjZW5kaWZcclxuXHJcbiAgICAjaWZkZWYgQk9ORVxyXG4gICAgICAgIHdvcmxkSW52TWF0PWludmVyc2UobWF0Myh1X1dvcmxkTWF0KnNraW5UcmFuc2Zvcm0pKTtcclxuICAgICNlbHNlXHJcbiAgICAgICAgd29ybGRJbnZNYXQ9aW52ZXJzZShtYXQzKHVfV29ybGRNYXQpKTtcclxuICAgICNlbmRpZiAgXHJcbiAgICB2X05vcm1hbD1hX05vcm1hbCp3b3JsZEludk1hdDtcclxuXHJcbiAgICB2X1RhbmdlbnQ9YV9UYW5nZW50MC54eXoqd29ybGRJbnZNYXQ7XHJcbiAgICB2X0Jpbm9ybWFsPWNyb3NzKHZfTm9ybWFsLHZfVGFuZ2VudCkqYV9UYW5nZW50MC53O1xyXG5cclxuICAgICNpZmRlZiBCT05FXHJcbiAgICAgICAgdl9Qb3NpdGlvbldvcmxkPSh1X1dvcmxkTWF0KnBvc2l0aW9uKS54eXo7XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIHZfUG9zaXRpb25Xb3JsZD0odV9Xb3JsZE1hdCphX1Bvc2l0aW9uKS54eXo7XHJcbiAgICAjZW5kaWZcclxuICAgIFxyXG4gICAgdl9WaWV3RGlyPXVfQ2FtZXJhUG9zLXZfUG9zaXRpb25Xb3JsZDtcclxuXHJcbiAgICAjaWYgZGVmaW5lZChESUZGVVNFTUFQKXx8KChkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpKSYmKGRlZmluZWQoU1BFQ1VMQVJNQVApfHxkZWZpbmVkKE5PUk1BTE1BUCkpKVxyXG4gICAgICAgIHZfVGV4Y29vcmQwPWFfVGV4Y29vcmQwO1xyXG4gICAgICAgICNpZmRlZiBUSUxJTkdPRkZTRVRcclxuICAgICAgICAgICAgdl9UZXhjb29yZDA9VHJhbnNmb3JtVVYodl9UZXhjb29yZDAsdV9UaWxpbmdPZmZzZXQpO1xyXG4gICAgICAgICNlbmRpZlxyXG4gICAgI2VuZGlmXHJcblxyXG4gICAgI2lmZGVmIExJR0hUTUFQXHJcbiAgICAgICAgI2lmZGVmIFNDQUxFT0ZGU0VUTElHSFRJTkdNQVBVVlxyXG4gICAgICAgICAgICAjaWZkZWYgVVYxXHJcbiAgICAgICAgICAgICAgICB2X0xpZ2h0TWFwVVY9dmVjMihhX1RleGNvb3JkMS54LDEuMC1hX1RleGNvb3JkMS55KSp1X0xpZ2h0bWFwU2NhbGVPZmZzZXQueHkrdV9MaWdodG1hcFNjYWxlT2Zmc2V0Lnp3O1xyXG4gICAgICAgICAgICAjZWxzZVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPXZlYzIoYV9UZXhjb29yZDAueCwxLjAtYV9UZXhjb29yZDAueSkqdV9MaWdodG1hcFNjYWxlT2Zmc2V0Lnh5K3VfTGlnaHRtYXBTY2FsZU9mZnNldC56dztcclxuICAgICAgICAgICAgI2VuZGlmIFxyXG4gICAgICAgICAgICB2X0xpZ2h0TWFwVVYueT0xLjAtdl9MaWdodE1hcFVWLnk7XHJcbiAgICAgICAgI2Vsc2VcclxuICAgICAgICAgICAgI2lmZGVmIFVWMVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPWFfVGV4Y29vcmQxO1xyXG4gICAgICAgICAgICAjZWxzZVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPWFfVGV4Y29vcmQwO1xyXG4gICAgICAgICAgICAjZW5kaWYgXHJcbiAgICAgICAgI2VuZGlmIFxyXG4gICAgI2VuZGlmXHJcblxyXG4gICAgI2lmIGRlZmluZWQoQ09MT1IpJiZkZWZpbmVkKEVOQUJMRVZFUlRFWENPTE9SKVxyXG4gICAgICAgIHZfQ29sb3I9YV9Db2xvcjtcclxuICAgICNlbmRpZlxyXG5cclxuICAgICNpZmRlZiBSRUNFSVZFU0hBRE9XXHJcbiAgICAgICAgdl9wb3NWaWV3WiA9IGdsX1Bvc2l0aW9uLnc7XHJcbiAgICAgICAgI2lmZGVmIFNIQURPV01BUF9QU1NNMSBcclxuICAgICAgICAgICAgdl9saWdodE1WUFBvcyA9IHVfbGlnaHRTaGFkb3dWUFswXSAqIHZlYzQodl9Qb3NpdGlvbldvcmxkLDEuMCk7XHJcbiAgICAgICAgI2VuZGlmXHJcbiAgICAjZW5kaWZcclxufVxyXG5cclxuLy8tLXdteS1tYWluLS0tLS0tLS0tLS0tLS0tLS1cclxubWF0MyBNQVRSSVhfSVRfTVYobWF0NCBNb2RlbFZpZXdNYXRyaXgpIHtcclxuICAgIHJldHVybiBpbnZlcnNlKG1hdDMoTW9kZWxWaWV3TWF0cml4KSk7XHJcbn1cclxubWF0MyBnZXRSb3RhdGlvbih2ZWM0IHdUYW5nZW50LCB2ZWMzIHdOb3JtYWwpIHtcclxuICAgIHZlYzMgYmlub3JtYWwgPSBjcm9zcyh3Tm9ybWFsLnh5eiwgd1RhbmdlbnQueHl6KSAqIC13VGFuZ2VudC53O1xyXG4gICAgbWF0MyByb3RhdGlvbiA9IG1hdDMoXHJcbiAgICAgICAgd1RhbmdlbnQueCwgYmlub3JtYWwueCwgd05vcm1hbC54LFxyXG4gICAgICAgIHdUYW5nZW50LnksIGJpbm9ybWFsLnksIHdOb3JtYWwueSxcclxuICAgICAgICB3VGFuZ2VudC56LCBiaW5vcm1hbC56LCB3Tm9ybWFsLnopO1xyXG4gICAgcmV0dXJuIHJvdGF0aW9uO1xyXG59XHJcbnVuaWZvcm0gdmVjNCBfd0NvbG9yO1xyXG51bmlmb3JtIG1hdDQgX09iamVjdDJXb3JsZDtcclxudW5pZm9ybSB2ZWM0IF9TcGVjdWxhcjtcclxudW5pZm9ybSBmbG9hdCBfR2xvc3M7XHJcblxyXG52YXJ5aW5nIHZlYzMgZ193b3JsZE5vcm1hbDtcclxudmFyeWluZyB2ZWMzIGdfd29ybGRWaWV3RGlyO1xyXG5cclxudm9pZCB3bXlNYWluKCl7XHJcbiAgICBnX3dvcmxkTm9ybWFsID0gdl9Ob3JtYWw7XHJcbiAgICBnX3dvcmxkTm9ybWFsLngqPS0xLjA7XHJcblx0Z193b3JsZFZpZXdEaXIgPSB2X1ZpZXdEaXI7XHJcbn1cclxuLy8tLXdteS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbnZvaWQgbWFpbigpXHJcbntcclxuICAgICNpZmRlZiBDQVNUU0hBRE9XXHJcbiAgICAgICAgbWFpbl9jYXN0U2hhZG93KCk7XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIG1haW5fbm9ybWFsKCk7XHJcbiAgICAgICAgd215TWFpbigpO1xyXG4gICAgI2VuZGlmXHJcbn1cclxuYFxyXG4vL3BzXHJcbnZzcHNBcnJbMF1bMV09YFxyXG4jaWZkZWYgSElHSFBSRUNJU0lPTlxyXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XHJcbiNlbHNlXHJcbnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xyXG4jZW5kaWZcclxuXHJcbiNpbmNsdWRlICdMaWdodGluZy5nbHNsJztcclxuXHJcbnVuaWZvcm0gdmVjNCB1X0RpZmZ1c2VDb2xvcjtcclxuXHJcbiNpZiBkZWZpbmVkKENPTE9SKSYmZGVmaW5lZChFTkFCTEVWRVJURVhDT0xPUilcclxuICAgIHZhcnlpbmcgdmVjNCB2X0NvbG9yO1xyXG4jZW5kaWZcclxuXHJcbnZhcnlpbmcgdmVjMyB2X1ZpZXdEaXI7IFxyXG5cclxuI2lmZGVmIEFMUEhBVEVTVFxyXG4gICAgdW5pZm9ybSBmbG9hdCB1X0FscGhhVGVzdFZhbHVlO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBESUZGVVNFTUFQXHJcbiAgICB1bmlmb3JtIHNhbXBsZXIyRCB1X0RpZmZ1c2VUZXh0dXJlO1xyXG4jZW5kaWZcclxuXHJcbiNpZiBkZWZpbmVkKERJRkZVU0VNQVApfHwoKGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVCkpJiYoZGVmaW5lZChTUEVDVUxBUk1BUCl8fGRlZmluZWQoTk9STUFMTUFQKSkpXHJcbiAgICB2YXJ5aW5nIHZlYzIgdl9UZXhjb29yZDA7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIExJR0hUTUFQXHJcbiAgICB2YXJ5aW5nIHZlYzIgdl9MaWdodE1hcFVWO1xyXG4gICAgdW5pZm9ybSBzYW1wbGVyMkQgdV9MaWdodE1hcDtcclxuI2VuZGlmXHJcblxyXG4jaWYgZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKVxyXG4gICAgdW5pZm9ybSB2ZWMzIHVfTWF0ZXJpYWxTcGVjdWxhcjtcclxuICAgIHVuaWZvcm0gZmxvYXQgdV9TaGluaW5lc3M7XHJcbiAgICAjaWZkZWYgU1BFQ1VMQVJNQVAgXHJcbiAgICAgICAgdW5pZm9ybSBzYW1wbGVyMkQgdV9TcGVjdWxhclRleHR1cmU7XHJcbiAgICAjZW5kaWZcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgRk9HXHJcbiAgICB1bmlmb3JtIGZsb2F0IHVfRm9nU3RhcnQ7XHJcbiAgICB1bmlmb3JtIGZsb2F0IHVfRm9nUmFuZ2U7XHJcbiAgICB1bmlmb3JtIHZlYzMgdV9Gb2dDb2xvcjtcclxuI2VuZGlmXHJcblxyXG52YXJ5aW5nIHZlYzMgdl9Ob3JtYWw7XHJcbnZhcnlpbmcgdmVjMyB2X1Bvc2l0aW9uO1xyXG5cclxudW5pZm9ybSBzYW1wbGVyMkQgdV9Ob3JtYWxUZXh0dXJlO1xyXG52YXJ5aW5nIHZlYzMgdl9UYW5nZW50O1xyXG52YXJ5aW5nIHZlYzMgdl9CaW5vcm1hbDtcclxuXHJcbiNpZmRlZiBESVJFQ1RJT05MSUdIVFxyXG4gICAgdW5pZm9ybSBEaXJlY3Rpb25MaWdodCB1X0RpcmVjdGlvbkxpZ2h0O1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBQT0lOVExJR0hUXHJcbiAgICB1bmlmb3JtIFBvaW50TGlnaHQgdV9Qb2ludExpZ2h0O1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBTUE9UTElHSFRcclxuICAgIHVuaWZvcm0gU3BvdExpZ2h0IHVfU3BvdExpZ2h0O1xyXG4jZW5kaWZcclxuXHJcbnVuaWZvcm0gdmVjMyB1X0FtYmllbnRDb2xvcjtcclxuXHJcblxyXG4jaWYgZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpfHxkZWZpbmVkKFJFQ0VJVkVTSEFET1cpXHJcbiAgICB2YXJ5aW5nIHZlYzMgdl9Qb3NpdGlvbldvcmxkO1xyXG4jZW5kaWZcclxuXHJcbiNpbmNsdWRlICdTaGFkb3dIZWxwZXIuZ2xzbCdcclxudmFyeWluZyBmbG9hdCB2X3Bvc1ZpZXdaO1xyXG4jaWZkZWYgUkVDRUlWRVNIQURPV1xyXG4gICAgI2lmIGRlZmluZWQoU0hBRE9XTUFQX1BTU00yKXx8ZGVmaW5lZChTSEFET1dNQVBfUFNTTTMpXHJcbiAgICAgICAgdW5pZm9ybSBtYXQ0IHVfbGlnaHRTaGFkb3dWUFs0XTtcclxuICAgICNlbmRpZlxyXG4gICAgI2lmZGVmIFNIQURPV01BUF9QU1NNMSBcclxuICAgICAgICB2YXJ5aW5nIHZlYzQgdl9saWdodE1WUFBvcztcclxuICAgICNlbmRpZlxyXG4jZW5kaWZcclxuXHJcbnZvaWQgbWFpbl9jYXN0U2hhZG93KClcclxue1xyXG4gICAgLy9nbF9GcmFnQ29sb3I9dmVjNCh2X3Bvc1ZpZXdaLDAuMCwwLjAsMS4wKTtcclxuICAgIGdsX0ZyYWdDb2xvcj1wYWNrRGVwdGgodl9wb3NWaWV3Wik7XHJcbiAgICAjaWYgZGVmaW5lZChESUZGVVNFTUFQKSYmZGVmaW5lZChBTFBIQVRFU1QpXHJcbiAgICAgICAgZmxvYXQgYWxwaGEgPSB0ZXh0dXJlMkQodV9EaWZmdXNlVGV4dHVyZSx2X1RleGNvb3JkMCkudztcclxuICAgICAgICBpZiggYWxwaGEgPCB1X0FscGhhVGVzdFZhbHVlIClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc2NhcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgI2VuZGlmXHJcbn1cclxuXHJcbi8vLS13bXktbWFpbi0tLS0tLS0tLS0tLS0tLS0tXHJcbnZlYzQgbGVycFY0KHZlYzQgYSwgdmVjNCBiLCBmbG9hdCBzKSB7IHJldHVybiB2ZWM0KGEgKyAoYiAtIGEpKnMpOyB9XHJcbnZlYzMgbGVycFYzKHZlYzMgYSwgdmVjMyBiLCBmbG9hdCBzKSB7IHJldHVybiB2ZWMzKGEgKyAoYiAtIGEpKnMpOyB9XHJcbnZlYzIgbGVycFYyKHZlYzIgYSwgdmVjMiBiLCBmbG9hdCBzKSB7IHJldHVybiB2ZWMyKGEgKyAoYiAtIGEpKnMpOyB9XHJcbmZsb2F0IGxlcnBGKGZsb2F0IGEsIGZsb2F0IGIsIGZsb2F0IHMpIHsgcmV0dXJuIGZsb2F0KGEgKyAoYiAtIGEpICogcyk7IH1cclxuZmxvYXQgc2F0dXJhdGUoZmxvYXQgbikgeyByZXR1cm4gY2xhbXAobiwgMC4wLCAxLjApOyB9XHJcbnZlYzMgVW5wYWNrTm9ybWFsKHZlYzQgcGFja2Vkbm9ybWFsKSB7XHJcblx0Ly8gVGhpcyBkbyB0aGUgdHJpY2tcclxuXHRwYWNrZWRub3JtYWwueCAqPSBwYWNrZWRub3JtYWwudztcclxuXHR2ZWMzIG5vcm1hbDtcclxuXHRub3JtYWwueHkgPSBwYWNrZWRub3JtYWwueHkgKiAyLjAgLSAxLjA7XHJcblx0bm9ybWFsLnogPSBzcXJ0KDEuMCAtIHNhdHVyYXRlKGRvdChub3JtYWwueHksIG5vcm1hbC54eSkpKTtcclxuXHRyZXR1cm4gbm9ybWFsO1xyXG59XHJcblxyXG51bmlmb3JtIHZlYzQgX3dDb2xvcjtcclxudW5pZm9ybSBtYXQ0IF9PYmplY3QyV29ybGQ7XHJcbnVuaWZvcm0gdmVjNCBfU3BlY3VsYXI7XHJcbnVuaWZvcm0gZmxvYXQgX0dsb3NzO1xyXG5cclxudmFyeWluZyB2ZWMzIGdfd29ybGROb3JtYWw7XHJcbnZhcnlpbmcgdmVjMyBnX3dvcmxkVmlld0RpcjtcclxuXHJcbnZlYzQgd215TWFpbih2ZWM0IF9tYWluQ29sb3IsIHZlYzMgX2dsb2JhbERpZmZ1c2UsIHZlYzMgX2RpZmZ1c2UsIGZsb2F0IHNoYWRvd1ZhbHVlKXtcclxuICAgIHZlYzQgd215Q29sb3I9X21haW5Db2xvcjtcclxuXHJcblx0Ly8gdmVjMyBhbWJpZW50ID11X0FtYmllbnRDb2xvci8yLjA7XHJcblx0Ly8gdmVjMyBsaWdodERpciA9IG5vcm1hbGl6ZSgtdV9EaXJlY3Rpb25MaWdodC5EaXJlY3Rpb24ueHl6KTtcclxuXHQvLyBmbG9hdCBoYWxmTGFtYmVydCA9IGRvdChnX3dvcmxkTm9ybWFsLCBsaWdodERpcikgKiAwLjUgKyAxLjA7XHJcblx0Ly8gdmVjMyBkaWZmdXNlID0gdV9EaXJlY3Rpb25MaWdodC5Db2xvci5yZ2IgKiBoYWxmTGFtYmVydCAqX3dDb2xvci5yZ2I7XHJcblx0XHRcdFx0XHJcblx0Ly8gdmVjMyBjb2xvciA9IGRpZmZ1c2U7XHJcblxyXG5cdC8vIHZlYzMgdmlld0RpciA9IG5vcm1hbGl6ZShnX3dvcmxkVmlld0Rpcik7XHJcblx0Ly8gdmVjMyBoYWxmRGlyID0gbm9ybWFsaXplKHZpZXdEaXIgKyBsaWdodERpcik7XHJcblx0Ly8gdmVjMyBzcGVjdWxhciA9IHZlYzMoMC4wKTtcclxuXHQvLyBzcGVjdWxhciA9IF9TcGVjdWxhci5yZ2IgKiBwb3cobWF4KGRvdChnX3dvcmxkTm9ybWFsLCBoYWxmRGlyKSwgMC4wKSwgX0dsb3NzKTtcclxuXHQvLyBjb2xvciArPSBzcGVjdWxhcjtcclxuXHJcbiAgICAvLyBjb2xvciAqPSAxLjU7XHJcbiAgICAvLyBjb2xvcis9c2hhZG93VmFsdWUqMC4xO1xyXG5cdHdteUNvbG9yID0gdmVjNCgwLDAsMCwgMS4wKTtcclxuXHJcbi8vXHJcbnJldHVybiB3bXlDb2xvcjtcclxufVxyXG4vLy0td215LS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxudm9pZCBtYWluX25vcm1hbCgpXHJcbntcclxuXHR2ZWMzIGdsb2JhbERpZmZ1c2U9dV9BbWJpZW50Q29sb3I7XHJcblx0I2lmZGVmIExJR0hUTUFQXHRcclxuXHRcdGdsb2JhbERpZmZ1c2UgKz0gRGVjb2RlTGlnaHRtYXAodGV4dHVyZTJEKHVfTGlnaHRNYXAsIHZfTGlnaHRNYXBVVikpO1xyXG5cdCNlbmRpZlxyXG5cdFxyXG5cdCNpZiBkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpXHJcblx0XHR2ZWMzIG5vcm1hbDtcclxuXHRcdCNpZiAoZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKSkmJmRlZmluZWQoTk9STUFMTUFQKVxyXG5cdFx0XHR2ZWMzIG5vcm1hbE1hcFNhbXBsZSA9IHRleHR1cmUyRCh1X05vcm1hbFRleHR1cmUsIHZfVGV4Y29vcmQwKS5yZ2I7XHJcblx0XHRcdG5vcm1hbCA9IG5vcm1hbGl6ZShOb3JtYWxTYW1wbGVUb1dvcmxkU3BhY2Uobm9ybWFsTWFwU2FtcGxlLCB2X05vcm1hbCwgdl9UYW5nZW50LHZfQmlub3JtYWwpKTtcclxuXHRcdCNlbHNlXHJcblx0XHRcdG5vcm1hbCA9IG5vcm1hbGl6ZSh2X05vcm1hbCk7XHJcblx0XHQjZW5kaWZcclxuXHRcdHZlYzMgdmlld0Rpcj0gbm9ybWFsaXplKHZfVmlld0Rpcik7XHJcblx0I2VuZGlmXHJcblx0XHJcblx0dmVjNCBtYWluQ29sb3I9dV9EaWZmdXNlQ29sb3I7XHJcblx0I2lmZGVmIERJRkZVU0VNQVBcclxuXHRcdHZlYzQgZGlmVGV4Q29sb3I9dGV4dHVyZTJEKHVfRGlmZnVzZVRleHR1cmUsIHZfVGV4Y29vcmQwKTtcclxuXHRcdG1haW5Db2xvcj1tYWluQ29sb3IqZGlmVGV4Q29sb3I7XHJcblx0I2VuZGlmIFxyXG5cdCNpZiBkZWZpbmVkKENPTE9SKSYmZGVmaW5lZChFTkFCTEVWRVJURVhDT0xPUilcclxuXHRcdG1haW5Db2xvcj1tYWluQ29sb3Iqdl9Db2xvcjtcclxuXHQjZW5kaWYgXHJcbiAgICBcclxuXHQjaWZkZWYgQUxQSEFURVNUXHJcblx0XHRpZihtYWluQ29sb3IuYTx1X0FscGhhVGVzdFZhbHVlKVxyXG5cdFx0XHRkaXNjYXJkO1xyXG5cdCNlbmRpZlxyXG4gIFxyXG5cdHZlYzMgZGlmZnVzZSA9IHZlYzMoMC4wKTtcclxuXHR2ZWMzIHNwZWN1bGFyPSB2ZWMzKDAuMCk7XHJcblx0I2lmIGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVClcclxuXHRcdHZlYzMgZGlmLHNwZTtcclxuXHRcdCNpZmRlZiBTUEVDVUxBUk1BUFxyXG5cdFx0XHR2ZWMzIGdsb3NzPXRleHR1cmUyRCh1X1NwZWN1bGFyVGV4dHVyZSwgdl9UZXhjb29yZDApLnJnYjtcclxuXHRcdCNlbHNlXHJcblx0XHRcdCNpZmRlZiBESUZGVVNFTUFQXHJcblx0XHRcdFx0dmVjMyBnbG9zcz12ZWMzKGRpZlRleENvbG9yLmEpO1xyXG5cdFx0XHQjZWxzZVxyXG5cdFx0XHRcdHZlYzMgZ2xvc3M9dmVjMygxLjApO1xyXG5cdFx0XHQjZW5kaWZcclxuXHRcdCNlbmRpZlxyXG5cdCNlbmRpZlxyXG5cclxuXHQjaWZkZWYgRElSRUNUSU9OTElHSFRcclxuXHRcdExheWFBaXJCbGlublBob25nRGllY3Rpb25MaWdodCh1X01hdGVyaWFsU3BlY3VsYXIsdV9TaGluaW5lc3Msbm9ybWFsLGdsb3NzLHZpZXdEaXIsdV9EaXJlY3Rpb25MaWdodCxkaWYsc3BlKTtcclxuXHRcdGRpZmZ1c2UrPWRpZjtcclxuXHRcdHNwZWN1bGFyKz1zcGU7XHJcblx0I2VuZGlmXHJcbiBcclxuXHQjaWZkZWYgUE9JTlRMSUdIVFxyXG5cdFx0TGF5YUFpckJsaW5uUGhvbmdQb2ludExpZ2h0KHZfUG9zaXRpb25Xb3JsZCx1X01hdGVyaWFsU3BlY3VsYXIsdV9TaGluaW5lc3Msbm9ybWFsLGdsb3NzLHZpZXdEaXIsdV9Qb2ludExpZ2h0LGRpZixzcGUpO1xyXG5cdFx0ZGlmZnVzZSs9ZGlmO1xyXG5cdFx0c3BlY3VsYXIrPXNwZTtcclxuXHQjZW5kaWZcclxuXHJcblx0I2lmZGVmIFNQT1RMSUdIVFxyXG5cdFx0TGF5YUFpckJsaW5uUGhvbmdTcG90TGlnaHQodl9Qb3NpdGlvbldvcmxkLHVfTWF0ZXJpYWxTcGVjdWxhcix1X1NoaW5pbmVzcyxub3JtYWwsZ2xvc3Msdmlld0Rpcix1X1Nwb3RMaWdodCxkaWYsc3BlKTtcclxuXHRcdGRpZmZ1c2UrPWRpZjtcclxuXHRcdHNwZWN1bGFyKz1zcGU7XHJcblx0I2VuZGlmXHJcblx0XHJcblx0I2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuXHRcdGZsb2F0IHNoYWRvd1ZhbHVlID0gMS4wO1xyXG5cdFx0I2lmZGVmIFNIQURPV01BUF9QU1NNM1xyXG5cdFx0XHRzaGFkb3dWYWx1ZSA9IGdldFNoYWRvd1BTU00zKCB1X3NoYWRvd01hcDEsdV9zaGFkb3dNYXAyLHVfc2hhZG93TWFwMyx1X2xpZ2h0U2hhZG93VlAsdV9zaGFkb3dQU1NNRGlzdGFuY2UsdV9zaGFkb3dQQ0ZvZmZzZXQsdl9Qb3NpdGlvbldvcmxkLHZfcG9zVmlld1osMC4wMDEpO1xyXG5cdFx0I2VuZGlmXHJcblx0XHQjaWZkZWYgU0hBRE9XTUFQX1BTU00yXHJcblx0XHRcdHNoYWRvd1ZhbHVlID0gZ2V0U2hhZG93UFNTTTIoIHVfc2hhZG93TWFwMSx1X3NoYWRvd01hcDIsdV9saWdodFNoYWRvd1ZQLHVfc2hhZG93UFNTTURpc3RhbmNlLHVfc2hhZG93UENGb2Zmc2V0LHZfUG9zaXRpb25Xb3JsZCx2X3Bvc1ZpZXdaLDAuMDAxKTtcclxuXHRcdCNlbmRpZiBcclxuXHRcdCNpZmRlZiBTSEFET1dNQVBfUFNTTTFcclxuXHRcdFx0c2hhZG93VmFsdWUgPSBnZXRTaGFkb3dQU1NNMSggdV9zaGFkb3dNYXAxLHZfbGlnaHRNVlBQb3MsdV9zaGFkb3dQU1NNRGlzdGFuY2UsdV9zaGFkb3dQQ0ZvZmZzZXQsdl9wb3NWaWV3WiwwLjAwMSk7XHJcblx0XHQjZW5kaWZcclxuXHRcdC8vZ2xfRnJhZ0NvbG9yID12ZWM0KG1haW5Db2xvci5yZ2IqKGdsb2JhbERpZmZ1c2UgKyBkaWZmdXNlKSpzaGFkb3dWYWx1ZSxtYWluQ29sb3IuYSk7XHJcblx0XHQvL2dsX0ZyYWdDb2xvciA9IHdteU1haW4obWFpbkNvbG9yLChnbG9iYWxEaWZmdXNlICsgZGlmZnVzZSAqIHNoYWRvd1ZhbHVlICogMS4xKSk7XHJcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gd215TWFpbihtYWluQ29sb3IsZ2xvYmFsRGlmZnVzZSxkaWZmdXNlLHNoYWRvd1ZhbHVlKTtcclxuXHQjZWxzZVxyXG5cdFx0Ly9nbF9GcmFnQ29sb3IgPXZlYzQobWFpbkNvbG9yLnJnYiooZ2xvYmFsRGlmZnVzZSArIGRpZmZ1c2UpLG1haW5Db2xvci5hKTtcclxuXHRcdGdsX0ZyYWdDb2xvciA9IHdteU1haW4obWFpbkNvbG9yLGdsb2JhbERpZmZ1c2UsZGlmZnVzZSwxLjApO1xyXG5cdCNlbmRpZlxyXG4gICAgLypcclxuXHQjaWYgZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKVxyXG5cdFx0I2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuXHRcdFx0Z2xfRnJhZ0NvbG9yLnJnYis9c3BlY3VsYXIqc2hhZG93VmFsdWU7XHJcblx0XHQjZWxzZVxyXG5cdFx0XHRnbF9GcmFnQ29sb3IucmdiKz1zcGVjdWxhcjtcclxuXHRcdCNlbmRpZlxyXG5cdCNlbmRpZlxyXG5cdCovXHJcblx0I2lmZGVmIEZPR1xyXG5cdFx0ZmxvYXQgbGVycEZhY3Q9Y2xhbXAoKDEuMC9nbF9GcmFnQ29vcmQudy11X0ZvZ1N0YXJ0KS91X0ZvZ1JhbmdlLDAuMCwxLjApO1xyXG5cdFx0Z2xfRnJhZ0NvbG9yLnJnYj1taXgoZ2xfRnJhZ0NvbG9yLnJnYix1X0ZvZ0NvbG9yLGxlcnBGYWN0KTtcclxuXHQjZW5kaWZcclxufVxyXG5cclxudm9pZCBtYWluKClcclxue1xyXG5cdCNpZmRlZiBDQVNUU0hBRE9XXHRcdFxyXG5cdFx0bWFpbl9jYXN0U2hhZG93KCk7XHJcblx0I2Vsc2VcclxuXHRcdG1haW5fbm9ybWFsKCk7XHJcblx0I2VuZGlmICBcclxufVxyXG5gXHJcbi8v5riy5p+T5qih5byPXHJcbnZzcHNBcnJbMF1bMl09e307XHJcbiAgICAgICAgLy9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZzcHNBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdnNwcyA9IHZzcHNBcnJbaV07XHJcbiAgICAgICAgICAgIHRoaXMub25TZXRWc1BzKHZzcHNbMF0sIHZzcHNbMV0sIHZzcHNbMl0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteVNoYWRlck1hZ3tcclxuICAgIHByaXZhdGUgb2JqO1xyXG5cdGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5vYmo9cmVxdWlyZSgnLi9XbXlMYXlhX3dteUxidCcpWydkZWZhdWx0J107aWYodGhpcy5vYmopbmV3IHRoaXMub2JqKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCIvKndteeeJiOacrF8yMDE4LzEyLzMwLyovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteVUzZEltcG9ydCB7XG5wdWJsaWMgc3RhdGljIFRzX0RMaWdodD1yZXF1aXJlKCcuL3RzL1RzX0RMaWdodCcpWydkZWZhdWx0J107XG5wdWJsaWMgc3RhdGljIFRzX1NjZW5lPXJlcXVpcmUoJy4vdHMvVHNfU2NlbmUnKVsnZGVmYXVsdCddO1xucHVibGljIHN0YXRpYyBUc19DNERWZXRleEFuaW1hdG9yPXJlcXVpcmUoJy4vdHMvVHNfQzREVmV0ZXhBbmltYXRvcicpWydkZWZhdWx0J107XG5wdWJsaWMgc3RhdGljIFRzX01hdHM9cmVxdWlyZSgnLi90cy9Uc19NYXRzJylbJ2RlZmF1bHQnXTtcclxuLy/mianlsZVcclxucHVibGljIHN0YXRpYyBXbXlDNERWZXRleEFuaW1hdG9yPXJlcXVpcmUoJy4uL193bXlVdGlsc0g1L2QzL2M0ZC9XbXlDNERWZXRleEFuaW1hdG9yJylbJ2RlZmF1bHQnXTtcclxucHVibGljIHN0YXRpYyBXbXlQaHlzaWNzX0NoYXJhY3Rlcj1yZXF1aXJlKCcuLi9fd215VXRpbHNINS9kMy9waHlzaWNzL1dteVBoeXNpY3NXb3JsZF9DaGFyYWN0ZXInKVsnZGVmYXVsdCddO1xyXG4vL0xheWFcclxucHVibGljIHN0YXRpYyBBbmltYXRvcj1MYXlhLkFuaW1hdG9yO1xyXG4vL1xyXG5wdWJsaWMgc3RhdGljIGdldENsYXNzKG5hbWUpe1xyXG4gICAgcmV0dXJuIHRoaXNbbmFtZV07XHJcbn1cclxufVxyXG4iLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215VTNkVHNDb25maWcge1xyXG4gICAgcHVibGljIHN0YXRpYyB0c0NvbmZpZz1bXG57XCJjX3RzXCI6XCJUc19NYXRzXCIsXG5cInRhcmdldFVybEFyclwiOltcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zNV9DMlVfXFx1NUU3M1xcdTk3NjIxXzE1L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMV9DMlVfXFx1NUU3M1xcdTk3NjIxXzExL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80Nl9DMlVfXFx1NUU3M1xcdTk3NjIxXzI2L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yOF9DMlVfXFx1NUU3M1xcdTk3NjIxXzgvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMwX0MyVV9cXHU1RTczXFx1OTc2MjFfMTAvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIwX0MyVV9cXHU1RTczXFx1OTc2MjEvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMzX0MyVV9cXHU1RTczXFx1OTc2MjFfMTMvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI2X0MyVV9cXHU1RTczXFx1OTc2MjFfNi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzJfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjNfQzJVX1xcdTVFNzNcXHU5NzYyMV8zL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yOV9DMlVfXFx1NUU3M1xcdTk3NjIxXzkvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS8yMjBfQzJVX1xcdTVDNzEvMjIyX0MyVV9zaGFuXzFcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjRfQzJVX1xcdTVFNzNcXHU5NzYyMV80L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80Ml9DMlVfXFx1NUU3M1xcdTk3NjIxXzIyL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yN19DMlVfXFx1NUU3M1xcdTk3NjIxXzcvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ3X0MyVV9cXHU1RTczXFx1OTc2MjFfMjcvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ0X0MyVV9cXHU1RTczXFx1OTc2MjFfMjQvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM4X0MyVV9cXHU1RTczXFx1OTc2MjFfMTgvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI1X0MyVV9cXHU1RTczXFx1OTc2MjFfNS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzZfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjJfQzJVX1xcdTVFNzNcXHU5NzYyMV8yL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai80OV9DMlVfXFx1NUM5QjEvMjIwX0MyVV9cXHU1QzcxLzIyM19DMlVfc2hhbl8zXCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQwX0MyVV9cXHU1RTczXFx1OTc2MjFfMjAvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM3X0MyVV9cXHU1RTczXFx1OTc2MjFfMTcvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ4X0MyVV9cXHU1RTczXFx1OTc2MjFfMjgvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIxX0MyVV9cXHU1RTczXFx1OTc2MjFfMS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzIyMF9DMlVfXFx1NUM3MS8yMjRfQzJVX3NoYW5fNFwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai80OV9DMlVfXFx1NUM5QjEvMjIwX0MyVV9cXHU1QzcxLzIyMV9DMlVfc2hhbl8yXzFcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDVfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzUwX0MyVV9kYW9fMVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiRmFsc2VcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJUcnVlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zNF9DMlVfXFx1NUU3M1xcdTk3NjIxXzE0L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zOV9DMlVfXFx1NUU3M1xcdTk3NjIxXzE5L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80MV9DMlVfXFx1NUU3M1xcdTk3NjIxXzIxL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80M19DMlVfXFx1NUU3M1xcdTk3NjIxXzIzL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fVxuXX0sXG57XCJjX3RzXCI6XCJUc19DNERWZXRleEFuaW1hdG9yXCIsXG5cInRhcmdldFVybEFyclwiOltcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNV9DMlVfXFx1NUU3M1xcdTk3NjIxXzUvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80Ml9DMlVfXFx1NUU3M1xcdTk3NjIxXzIyL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDBfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIyX0MyVV9cXHU1RTczXFx1OTc2MjFfMi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM3X0MyVV9cXHU1RTczXFx1OTc2MjFfMTcvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yM19DMlVfXFx1NUU3M1xcdTk3NjIxXzMvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNl9DMlVfXFx1NUU3M1xcdTk3NjIxXzYvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80MV9DMlVfXFx1NUU3M1xcdTk3NjIxXzIxL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjBfQzJVX1xcdTVFNzNcXHU5NzYyMS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIxX0MyVV9cXHU1RTczXFx1OTc2MjFfMS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI5X0MyVV9cXHU1RTczXFx1OTc2MjFfOS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ1X0MyVV9cXHU1RTczXFx1OTc2MjFfMjUvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMV9DMlVfXFx1NUU3M1xcdTk3NjIxXzExL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjdfQzJVX1xcdTVFNzNcXHU5NzYyMV83L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDRfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQzX0MyVV9cXHU1RTczXFx1OTc2MjFfMjMvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMF9DMlVfXFx1NUU3M1xcdTk3NjIxXzEwL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzVfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI0X0MyVV9cXHU1RTczXFx1OTc2MjFfNC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMzX0MyVV9cXHU1RTczXFx1OTc2MjFfMTMvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zOF9DMlVfXFx1NUU3M1xcdTk3NjIxXzE4L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjhfQzJVX1xcdTVFNzNcXHU5NzYyMV84L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzlfQzJVX1xcdTVFNzNcXHU5NzYyMV8xOS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ3X0MyVV9cXHU1RTczXFx1OTc2MjFfMjcvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zNF9DMlVfXFx1NUU3M1xcdTk3NjIxXzE0L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzZfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMyX0MyVV9cXHU1RTczXFx1OTc2MjFfMTIvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80Nl9DMlVfXFx1NUU3M1xcdTk3NjIxXzI2L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDhfQzJVX1xcdTVFNzNcXHU5NzYyMV8yOC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319XG5dfSxcbntcImNfdHNcIjpcIlRzX1NjZW5lXCIsXG5cInRhcmdldFVybEFyclwiOltcbntcInVybFwiOlwic2NlbmVcIixcblwiaW5pdERhdGFcIjp7fX1cbl19LFxue1wiY190c1wiOlwiVHNfRExpZ2h0XCIsXG5cInRhcmdldFVybEFyclwiOltcbntcInVybFwiOlwiRGlyZWN0aW9uYWwgbGlnaHRcIixcblwiaW5pdERhdGFcIjp7XCJjYW1lcmFVcmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri80X0MyVV9cXHU4RjY4XFx1OEZGOVxcdTUyQThcXHU3NTNCLzVfQzJVX3NoZXhpYW5namkvNl9DMlVfXFx1NjQ0NFxcdTUwQ0ZcXHU2NzNBXCIsXG5cImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwifX1cbl19XG5dO1xyXG59XHJcbiIsIi8qd21554mI5pysXzIwMTgvMTIvMjgvMTM6MTkqL1xyXG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcclxuaW1wb3J0IFdteVUzZFRzQ29uZmlnIGZyb20gJy4vV215VTNkVHNDb25maWcnO1xyXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4vV215VTNkSW1wb3J0JztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215VTNkVHNNYWcgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XHJcbiAgICBwdWJsaWMgb25Bd2FrZSgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFdteVUzZFRzQ29uZmlnLnRzQ29uZmlnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRzT2JqID0gV215VTNkVHNDb25maWcudHNDb25maWdbaV07XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVHModHNPYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZFRzKGNvbmZpZ09iail7XHJcbiAgICAgICAgaWYoY29uZmlnT2JqPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgY190cz1jb25maWdPYmpbJ2NfdHMnXTtcclxuICAgICAgICB2YXIgdHM9V215VTNkSW1wb3J0LmdldENsYXNzKGNfdHMpO1xyXG4gICAgICAgIHZhciB0YXJnZXRVcmxBcnI6c3RyaW5nPWNvbmZpZ09ialsndGFyZ2V0VXJsQXJyJ107XHJcbiAgICAgICAgaWYoIXRhcmdldFVybEFyciB8fCAhdHMpcmV0dXJuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFyZ2V0VXJsQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFVybERhdGEgPSB0YXJnZXRVcmxBcnJbaV07XHJcbiAgICAgICAgICAgIHZhciB1cmw9dGFyZ2V0VXJsRGF0YVsndXJsJ107XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQ9V215VTNkVHNNYWcuZ2V0T2JqM2RVcmwodGhpcy5zY2VuZTNELHVybCk7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3VHM9dGFyZ2V0LmFkZENvbXBvbmVudCh0cyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5pdERhdGE9dGFyZ2V0VXJsRGF0YVsnaW5pdERhdGEnXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBpbml0RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdUcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBWYWx1ZTphbnk9aW5pdERhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzTmFOKFZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihWYWx1ZS5pbmRleE9mKCcuJyk+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlPXBhcnNlRmxvYXQoVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWYWx1ZT1wYXJzZUludChWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKFZhbHVlLmluZGV4T2YoJ1RydWUnKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWU9dHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoVmFsdWUuaW5kZXhPZignRmFsc2UnKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWU9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VHNba2V5XSA9IFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBhcnJVcmw9dXJsLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldE9iakFyclVybCh0YXJnZXQsYXJyVXJsKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBfZ2V0T2JqQXJyVXJsKHRhcmdldCx1cmxBcnI6QXJyYXk8c3RyaW5nPixpZD0wKXtcclxuICAgICAgICB2YXIgX3RhcmdldDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZihfdGFyZ2V0PT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBuYT11cmxBcnJbaWRdO1xyXG4gICAgICAgIHZhciB0YXJnZXRPYmo9X3RhcmdldC5nZXRDaGlsZEJ5TmFtZShuYSk7XHJcbiAgICAgICAgaWYodGFyZ2V0T2JqPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKGlkPj11cmxBcnIubGVuZ3RoLTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0YXJnZXRPYmo9dGhpcy5fZ2V0T2JqQXJyVXJsKHRhcmdldE9iaix1cmxBcnIsKytpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgICB9XHJcbn1cclxuIiwiLypDNETpobbngrnliqjnlLsqL1xuLyp3bXnniYjmnKxfMjAxOC8xMi8yOCovXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4uL1dteVUzZEltcG9ydCc7XG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uLy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRzX0M0RFZldGV4QW5pbWF0b3IgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XG5cbiBfYzRkVmV0ZXhBbmltYXRvcjphbnk7XG4gX2luaXRQbGF5OmFueT0gZmFsc2U7XG4gX2FuaXI6YW55O1xucHVibGljIG9uQXdha2UoKSB7XG4gLy9zZXRTaG93KGZhbHNlKTtcbiB0aGlzLl9jNGRWZXRleEFuaW1hdG9yID0gdGhpcy5vd25lcjNELmdldENvbXBvbmVudChXbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoJ1dteUM0RFZldGV4QW5pbWF0b3InKSk7XG4gaWYgKHRoaXMuX2M0ZFZldGV4QW5pbWF0b3IgPT0gbnVsbCkge1xuIHRoaXMuX2M0ZFZldGV4QW5pbWF0b3IgPSB0aGlzLm93bmVyM0QuYWRkQ29tcG9uZW50KFdteVUzZEltcG9ydC5nZXRDbGFzcygnV215QzREVmV0ZXhBbmltYXRvcicpKTtcbiB9XG4gdGhpcy5fYW5pciA9IHRoaXMub3duZXIzRC5nZXRDb21wb25lbnQoV215VTNkSW1wb3J0LmdldENsYXNzKCdBbmltYXRvcicpKTtcbiBpZiAodGhpcy5fYW5pciAhPSBudWxsKSB7XG4gdGhpcy5faW5pdFBsYXkgPSBmYWxzZTtcbiB0aGlzLl9hbmlyLnNwZWVkID0gMDtcbiB0aGlzLnNldFNob3coZmFsc2UpO1xuIH1cbiBcbiB9XG5wdWJsaWMgb25QcmVSZW5kZXIoKSB7XG4gaWYgKCF0aGlzLl9pbml0UGxheSkge1xuIHZhciBwYXJlbnQ6YW55PSB0aGlzLm93bmVyM0QucGFyZW50O1xuIGlmIChwYXJlbnQudHJhbnNmb3JtLmxvY2FsU2NhbGUueCA+IDAuMDEgfHwgcGFyZW50LnRyYW5zZm9ybS5sb2NhbFNjYWxlLnkgPiAwLjAxIHx8IHBhcmVudC50cmFuc2Zvcm0ubG9jYWxTY2FsZS56ID4gMC4wMSkge1xuIHRoaXMuX2luaXRQbGF5ID0gdHJ1ZTtcbiB0aGlzLnNldFNob3codHJ1ZSk7XG4gdGhpcy5fYW5pci5zcGVlZCA9IDE7XG4gfVxuIH1cbiBcbiB9XG59XG4iLCIvKuebtOe6v+eBr+WFiSovXG4vKndteeeJiOacrF8yMDE4LzEyLzI4Ki9cbmltcG9ydCBXbXlVM2RJbXBvcnQgZnJvbSAnLi4vV215VTNkSW1wb3J0JztcbmltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSAnLi4vLi4vX3dteVV0aWxzSDUvZDMvV215U2NyaXB0M0QnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHNfRExpZ2h0IGV4dGVuZHMgV215U2NyaXB0M0Qge1xuXG4gICAgXG4gICAgcHVibGljIGNhbWVyYVVybCA9IFwiXCI7XG4gICAgLyrmmK/lkKbkuqfnlJ/pmLTlvbEqL1xuICAgIHB1YmxpYyBpc0Nhc3RTaGFkb3c6IGFueSA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNhbWVyYTpMYXlhLkNhbWVyYTtcbiAgICBwdWJsaWMgZGlyZWN0aW9uTGlnaHQ6TGF5YS5EaXJlY3Rpb25MaWdodDtcbiAgICBwdWJsaWMgb25TdGFydCgpIHtcbiAgICAgICAgdGhpcy5jYW1lcmE9dGhpcy5nZXRPYmozZFVybCh0aGlzLnNjZW5lM0QsdGhpcy5jYW1lcmFVcmwpO1xuXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uTGlnaHQ9dGhpcy5vd25lciBhcyBMYXlhLkRpcmVjdGlvbkxpZ2h0O1xuICAgICAgICAvL+eBr+WFieW8gOWQr+mYtOW9sVxuICAgICAgICB0aGlzLmRpcmVjdGlvbkxpZ2h0LnNoYWRvdyA9IHRoaXMuaXNDYXN0U2hhZG93O1xuICAgICAgICAvL+eUn+aIkOmYtOW9sei0tOWbvuWwuuWvuFxuICAgICAgICB0aGlzLmRpcmVjdGlvbkxpZ2h0LnNoYWRvd1Jlc29sdXRpb24gPSAxNDAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblVwZGF0ZSgpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy/lj6/op4HpmLTlvbHot53nprtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uTGlnaHQuc2hhZG93RGlzdGFuY2UgPSB0aGlzLmNhbWVyYS50cmFuc2Zvcm0ucG9zaXRpb24ueTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCIvKuadkOi0qOaViOaenCovXG4vKndteeeJiOacrF8yMDE4LzEyLzI4Ki9cbmltcG9ydCBXbXlVM2RJbXBvcnQgZnJvbSAnLi4vV215VTNkSW1wb3J0JztcbmltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSAnLi4vLi4vX3dteVV0aWxzSDUvZDMvV215U2NyaXB0M0QnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHNfTWF0cyBleHRlbmRzIFdteVNjcmlwdDNEIHtcblxuIC8q5piv5ZCm5Lqn55Sf6Zi05b2xKi9cbiBwdWJsaWMgaXNDYXN0U2hhZG93OmFueT0gZmFsc2U7XG4gLyrmmK/lkKbmjqXmlLbpmLTlvbEqL1xuIHB1YmxpYyBpc1JlY2VpdmVTaGFkb3c6YW55PSBmYWxzZTtcbnB1YmxpYyBvblN0YXJ0KCkge1xuIC8q6K6+572u6Zi05b2xKi9cbiB0aGlzLm9uU2V0U2hhZG93KHRoaXMuaXNDYXN0U2hhZG93LCB0aGlzLmlzUmVjZWl2ZVNoYWRvdyk7XG4gXG4gfVxuIH1cbiIsIi8q5Zy65pmvKi9cbi8qd21554mI5pysXzIwMTgvMTIvMjkqL1xuaW1wb3J0IFdteVUzZEltcG9ydCBmcm9tICcuLi9XbXlVM2RJbXBvcnQnO1xuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi8uLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUc19TY2VuZSBleHRlbmRzIFdteVNjcmlwdDNEIHtcblxuIF9hbmlyOmFueTtcbnB1YmxpYyBvblN0YXJ0KCkge1xuIHRoaXMuX2FuaXIgPSB0aGlzLm93bmVyM0QuZ2V0Q29tcG9uZW50KFdteVUzZEltcG9ydC5nZXRDbGFzcygnQW5pbWF0b3InKSk7XG4gaWYgKHRoaXMuX2FuaXIgIT0gbnVsbCkge1xuIHRoaXMuX2FuaXIuc3BlZWQgPSAxO1xuIH1cbiBcbiB9XG4gfVxuIl19
