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
        if (this["vConsole"]) {
            this["vConsole"] = new window["VConsole"]();
            this["vConsole"].switchPos.startY = 40;
        }
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
    WmyMatConfig.matConfig = [];
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
        sharedMaterial.setShaderName(shaderName);
        //渲染模式
        var vsPsArr = shader['w_vsPsArr'];
        if (vsPsArr) {
            for (var i = 0; i < vsPsArr.length; i++) {
                var renderDataObj = vsPsArr[i][2];
                for (var key in renderDataObj) {
                    if (renderDataObj.hasOwnProperty(key)) {
                        if (sharedMaterial.hasOwnProperty(key)) {
                            sharedMaterial[key] = renderDataObj[key];
                        }
                        var renderState = sharedMaterial.getRenderState(i);
                        if (renderState.hasOwnProperty(key)) {
                            renderState[key] = renderDataObj[key];
                        }
                    }
                }
            }
        }
        //初始值
        if (shader['w_uniformMap'] != null) {
            for (var key in shader['w_uniformMap']) {
                if (shader['w_uniformMap'].hasOwnProperty(key)) {
                    var initId = shader['w_uniformMap'][key][0];
                    var initV = initData[key];
                    if (initV != null) {
                        initV = initV.split(',');
                        if (initV.length == 4) {
                            sharedMaterial._shaderValues.setVector(initId, new Laya.Vector4(parseFloat(initV[0]), parseFloat(initV[1]), parseFloat(initV[2]), parseFloat(initV[3])));
                        }
                        else if (initV.length == 3) {
                            sharedMaterial._shaderValues.setVector(initId, new Laya.Vector3(parseFloat(initV[0]), parseFloat(initV[1]), parseFloat(initV[2])));
                        }
                        else if (initV.length == 2) {
                            sharedMaterial._shaderValues.setVector(initId, new Laya.Vector2(parseFloat(initV[0]), parseFloat(initV[1])));
                        }
                        else if (initV.length == 1) {
                            if (!isNaN(parseFloat(initV[0]))) {
                                sharedMaterial._shaderValues.setNumber(initId, parseFloat(initV[0]));
                            }
                            else {
                                var strObj = initV[0] + '';
                                if (strObj == 'tex') {
                                    var texObj = initData['TEX@' + key];
                                    if (texObj != null) {
                                        var path = texObj['path'];
                                        Laya.loader.load(path, Laya.Handler.create(this, function (_initId, tex) {
                                            if (tex == null) {
                                                tex = new Laya.Texture2D(0, 0, 0, true);
                                            }
                                            sharedMaterial._shaderValues.setTexture(_initId, tex);
                                        }, [initId]));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpcklERV9iZXRhNS9yZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi50cyIsInNyYy9fd215VXRpbHNINS9XbXlVdGlscy50cyIsInNyYy9fd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvV215TG9hZDNkLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteUxvYWRNYXRzLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNELnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvYzRkL1dteUM0RFZldGV4QW5pbWF0b3IudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvcGh5c2ljcy9XbXlQaHlzaWNzV29ybGRfQ2hhcmFjdGVyLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dFYXNlTWFuYWdlci50cyIsInNyYy9fd215VXRpbHNINS93bXlUd2Vlbi9XRWFzZVR5cGUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dUd2Vlbk1hbmFnZXIudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuVmFsdWUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuZXIudHMiLCJzcmMvd215TWF0cy9XbXlNYXRDb25maWcudHMiLCJzcmMvd215TWF0cy9XbXlNYXRNYWcudHMiLCJzcmMvd215U2hhZGVycy9CYXNlX1dteVNoYWRlci50cyIsInNyYy93bXlTaGFkZXJzL1dteUxheWFfd215TGJ0LnRzIiwic3JjL3dteVNoYWRlcnMvV215U2hhZGVyTWFnLnRzIiwic3JjL3dteVUzZFRzL1dteVUzZEltcG9ydC50cyIsInNyYy93bXlVM2RUcy9XbXlVM2RUc0NvbmZpZy50cyIsInNyYy93bXlVM2RUcy9XbXlVM2RUc01hZy50cyIsInNyYy93bXlVM2RUcy90cy9Uc19DNERWZXRleEFuaW1hdG9yLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX0RMaWdodC50cyIsInNyYy93bXlVM2RUcy90cy9Uc19NYXRzLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX1NjZW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1RBLDJEQUEwRDtBQUMxRCxzRUFBcUU7QUFDckUsbURBQWtEO0FBQ2xELHNEQUFpRDtBQUNqRCxpREFBNEM7QUFDNUM7SUFJQztRQUZPLFdBQU0sR0FBQyxHQUFHLENBQUM7UUFDWCxXQUFNLEdBQUMsSUFBSSxDQUFDO1FBRWxCLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU1QyxJQUFJLElBQUksR0FBQyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxJQUFHLElBQUksRUFBQztZQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO1NBQ2hEO2FBQ0c7WUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNuRDtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFD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QUMsS0FBSyxDQUFDO1lBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1NBQzVDO0lBRUYsQ0FBQztJQVdPLHlCQUFVLEdBQWxCO1FBQ0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFFBQVEsR0FBQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN4QyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUMsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFFMUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFFckQsMkJBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FB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ZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi9fd215VXRpbHNINS9kMy9XbXlVdGlsczNEXCI7XHJcbmltcG9ydCB7IFdteV9Mb2FkX01hZyB9IGZyb20gXCIuL193bXlVdGlsc0g1L1dteV9Mb2FkX01hZ1wiO1xyXG5pbXBvcnQgeyBXVHdlZW5NYW5hZ2VyIH0gZnJvbSBcIi4vX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuTWFuYWdlclwiO1xyXG5pbXBvcnQgeyBXbXlVdGlscyB9IGZyb20gXCIuL193bXlVdGlsc0g1L1dteVV0aWxzXCI7XHJcbmltcG9ydCBXbXlVM2RUc01hZyBmcm9tIFwiLi93bXlVM2RUcy9XbXlVM2RUc01hZ1wiO1xyXG5pbXBvcnQgV215TWF0TWFnIGZyb20gXCIuL3dteU1hdHMvV215TWF0TWFnXCI7XHJcbmV4cG9ydCBjbGFzcyBNYWluIHtcclxuXHRwdWJsaWMgc3RhdGljIF90aGlzOiBNYWluO1xyXG5cdHB1YmxpYyBfcm9vdFc9NjQwO1xyXG5cdHB1YmxpYyBfcm9vdEg9MTEzNjtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdE1haW4uX3RoaXM9dGhpcztcclxuXHRcdExheWEzRC5pbml0KHRoaXMuX3Jvb3RXLCB0aGlzLl9yb290SCk7XHJcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcclxuXHJcblx0XHR2YXIgaXNQYz1XbXlVdGlscy5nZXRUaGlzLmlzUGMoKTtcclxuXHRcdGlmKGlzUGMpe1xyXG5cdFx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IExheWEuU3RhZ2UuU0NBTEVfU0hPV0FMTDtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gTGF5YS5TdGFnZS5TQ0FMRV9GVUxMO1xyXG5cdFx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBMYXlhLlN0YWdlLlNDUkVFTl9WRVJUSUNBTDtcclxuXHRcdH1cclxuXHRcdExheWEuc3RhZ2UuZnJhbWVSYXRlPUxheWEuU3RhZ2UuRlJBTUVfRkFTVDtcclxuXHRcdC8v6K6+572u5rC05bmz5a+56b2QXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnbkggPSBcImNlbnRlclwiO1xyXG5cdFx0Ly/orr7nva7lnoLnm7Tlr7npvZBcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduViA9IFwibWlkZGxlXCI7XHJcblxyXG5cdFx0TGF5YS5TdGF0LnNob3coKTtcclxuXHJcblx0XHRpZih0aGlzW1widkNvbnNvbGVcIl0pe1xyXG5cdFx0XHR0aGlzW1widkNvbnNvbGVcIl0gPSBuZXcgd2luZG93W1wiVkNvbnNvbGVcIl0oKTtcclxuXHRcdFx0dGhpc1tcInZDb25zb2xlXCJdLnN3aXRjaFBvcy5zdGFydFkgPSA0MDtcclxuXHRcdH1cclxuXHRcdExheWEuU2hhZGVyM0QuZGVidWdNb2RlPXRydWU7XHJcblxyXG5cdFx0Ly/mv4DmtLvotYTmupDniYjmnKzmjqfliLbvvIx2ZXJzaW9uLmpzb27nlLFJREXlj5HluIPlip/og73oh6rliqjnlJ/miJDvvIzlpoLmnpzmsqHmnInkuZ/kuI3lvbHlk43lkI7nu63mtYHnqItcclxuXHRcdHZhciB3bXlWVGltZT1cIlwiO1xyXG5cdFx0aWYod2luZG93IT1udWxsICYmIHdpbmRvd1tcIndteVZUaW1lXCJdIT1udWxsKXtcclxuXHRcdFx0d215VlRpbWU9d2luZG93W1wid215VlRpbWVcIl07XHJcblx0XHR9XHJcblx0XHRMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIit3bXlWVGltZSwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cdH1cclxuXHJcblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0TGF5YS50aW1lci5mcmFtZUxvb3AoMSx0aGlzLHRoaXMuUkVTSVpFKTtcclxuXHRcdFdteV9Mb2FkX01hZy5nZXRUaGlzLm9uU2V0V2V0RGF0YShcImxvYWRJbmZvXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgKCkgPT4ge1xyXG5cdFx0XHRXbXlfTG9hZF9NYWcuZ2V0VGhpcy5vbmxvYWRTdHIoXCJsb2FkXCIsIG5ldyBMYXlhLkhhbmRsZXIodGhpcywgdGhpcy5vbkxvYWRNYWluKSk7XHJcblx0XHR9KSk7XHJcblx0fVxyXG5cdFxyXG5cdFJFU0laRSgpIHtcclxuXHRcdHZhciBzdz1MYXlhLnN0YWdlLndpZHRoL3RoaXMuX3Jvb3RXO1xyXG5cdFx0dmFyIHNoPUxheWEuc3RhZ2UuaGVpZ2h0L3RoaXMuX3Jvb3RIO1xyXG5cdFx0aWYgKHRoaXMuX3VpU2NlbmUgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl91aVNjZW5lLnNjYWxlWD1zdztcclxuXHRcdFx0dGhpcy5fdWlTY2VuZS5zY2FsZVk9c3c7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5fdWlTY2VuZSAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX3VpUm9vdC53aWR0aCA9IExheWEuc3RhZ2Uud2lkdGgvc3c7XHJcblx0XHRcdHRoaXMuX3VpUm9vdC5oZWlnaHQgPSBMYXlhLnN0YWdlLmhlaWdodC9zdztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fTG9hZFJvb3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl9Mb2FkUm9vdC53aWR0aCA9IHRoaXMuX3VpUm9vdC53aWR0aDtcclxuXHRcdFx0dGhpcy5fTG9hZFJvb3QuaGVpZ2h0ID0gdGhpcy5fdWlSb290LmhlaWdodDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fbWFpblZpZXcgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl9tYWluVmlldy53aWR0aCA9IHRoaXMuX3VpUm9vdC53aWR0aDtcclxuXHRcdFx0dGhpcy5fbWFpblZpZXcuaGVpZ2h0ID0gdGhpcy5fdWlSb290LmhlaWdodDtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91aVNjZW5lOiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX3VpUm9vdDogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHJcblx0cHJpdmF0ZSBfTG9hZFJvb3Q6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfTG9hZEJveDogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHRwcml2YXRlIF9iYXI6IGZhaXJ5Z3VpLkdQcm9ncmVzc0JhcjtcclxuXHJcblx0cHJpdmF0ZSBfbWFpblZpZXc6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblxyXG5cdHByaXZhdGUgb25Mb2FkTWFpbigpIHtcclxuXHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuXHRcdHRoaXMuX3VpU2NlbmU9bmV3IGZhaXJ5Z3VpLkdDb21wb25lbnQoKTtcclxuXHRcdGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQodGhpcy5fdWlTY2VuZSk7XHJcblx0XHR0aGlzLl91aVJvb3Q9bmV3IGZhaXJ5Z3VpLkdDb21wb25lbnQoKTtcclxuXHRcdHRoaXMuX3VpU2NlbmUuYWRkQ2hpbGQodGhpcy5fdWlSb290KTtcclxuXHJcblx0XHR0aGlzLl9Mb2FkUm9vdCA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJsb2FkXCIsIFwiTG9hZFJvb3RcIikuYXNDb207XHJcblx0XHR0aGlzLl91aVJvb3QuYWRkQ2hpbGQodGhpcy5fTG9hZFJvb3QpO1xyXG5cdFx0dGhpcy5fTG9hZEJveCA9IHRoaXMuX0xvYWRSb290LmdldENoaWxkKFwiX0xvYWRCb3hcIikuYXNDb207XHJcblxyXG5cdFx0dGhpcy5fYmFyID0gdGhpcy5fTG9hZEJveC5nZXRDaGlsZChcImJhclwiKS5hc1Byb2dyZXNzO1xyXG5cclxuXHRcdFdteV9Mb2FkX01hZy5nZXRUaGlzLm9uQXV0b0xvYWRBbGwobmV3IExheWEuSGFuZGxlcih0aGlzLCB0aGlzLm9uTG9hZE9rKSwgbmV3IExheWEuSGFuZGxlcih0aGlzLCB0aGlzLm9uTG9hZGluZykpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkxvYWRpbmcocHJvZ3Jlc3M6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0dmFyIHR3ZWVuID0gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpO1xyXG5cdFx0dHdlZW4uc2V0VGFyZ2V0KHRoaXMsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5fb25Mb2FkaW5nLCBudWxsLCBmYWxzZSkpO1xyXG5cdFx0aWYodGhpcy5fYmFyKXtcclxuXHRcdFx0dHdlZW4uX3RvKHRoaXMuX2Jhci52YWx1ZSwgcHJvZ3Jlc3MsIDAuMjUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRwcml2YXRlIF9vbkxvYWRpbmcodGFyZ2V0LCBwKSB7XHJcblx0XHRpZih0aGlzLl9iYXIpe1xyXG5cdFx0XHR0aGlzLl9iYXIudmFsdWUgPSBwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfc2NlbmUzRDpMYXlhLlNjZW5lM0Q7XHJcblx0cHJpdmF0ZSBvbkxvYWRPayh1aUFyciwgdTNkQXJyKSB7XHJcblx0XHQvL+a3u+WKoDNEXHJcbiAgICAgICAgdmFyIHVybDNkPXUzZEFyclswXS51cmxMaXN0WzBdO1xyXG4gICAgICAgIHRoaXMuX3NjZW5lM0QgPUxheWEubG9hZGVyLmdldFJlcyh1cmwzZCk7XHJcblx0XHQvL+iHquWKqOa3u+WKoOadkOi0qFxyXG5cdFx0dGhpcy5fc2NlbmUzRC5hZGRDb21wb25lbnQoV215TWF0TWFnKTtcclxuXHRcdC8v6Ieq5Yqo5re75YqgVTNE6ISa5pysXHJcblx0XHR0aGlzLl9zY2VuZTNELmFkZENvbXBvbmVudChXbXlVM2RUc01hZyk7XHJcblxyXG5cdFx0V1R3ZWVuTWFuYWdlci5raWxsVHdlZW5zKHRoaXMpO1xyXG5cdFx0dGhpcy5vbk1haW4oKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25NYWluKCl7XHJcblx0XHR0aGlzLl9tYWluVmlldyA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJtYWluXCIsIFwiTWFpblwiKS5hc0NvbTtcclxuXHRcdGlmICh0aGlzLl9tYWluVmlldyAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX3VpUm9vdC5hZGRDaGlsZEF0KHRoaXMuX21haW5WaWV3LCAwKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgX01haW49dGhpcy5fbWFpblZpZXcuZ2V0Q2hpbGQoXCJfTWFpblwiKS5hc0NvbTtcclxuXHRcdHZhciBkM0JveD1fTWFpbi5nZXRDaGlsZChcImQzQm94XCIpO1xyXG5cdFx0ZDNCb3guZGlzcGxheU9iamVjdC5hZGRDaGlsZCh0aGlzLl9zY2VuZTNEKTtcclxuXHJcblx0XHRXVHdlZW5NYW5hZ2VyLmtpbGxUd2VlbnModGhpcyk7XHJcblx0XHR0aGlzLl91aVJvb3QucmVtb3ZlQ2hpbGQodGhpcy5fTG9hZFJvb3QpO1xyXG5cdFx0dGhpcy5fTG9hZFJvb3QgPSBudWxsO1xyXG5cdFx0dGhpcy5fYmFyID0gbnVsbDtcclxuXHJcblxyXG5cdFx0Ly8gLy/liqDovb0zROWcuuaZr1xyXG5cdFx0Ly8gTGF5YS5TY2VuZTNELmxvYWQoJ3Jlcy91M2QvbWFpbi9Db252ZW50aW9uYWwvMS5scycsIExheWEuSGFuZGxlci5jcmVhdGUobnVsbCwgZnVuY3Rpb24oc2NlbmUpe1xyXG5cdFx0Ly8gXHQvL+iHquWKqOe7keWumlUzROiEmuacrFxyXG5cdFx0Ly8gXHRzY2VuZS5hZGRDb21wb25lbnQoV215VTNkVHNNYWcpO1xyXG5cdFx0Ly8gXHQvL+WcuuaZr+a3u+WKoOWIsOiInuWPsFxyXG5cdFx0Ly8gXHRMYXlhLnN0YWdlLmFkZENoaWxkKHNjZW5lKTtcclxuXHJcblx0XHQvLyBcdC8vIHZhciB3bXlWZXRleF9mejAxPVdteVV0aWxzM0QuZ2V0T2JqM2RVcmwoc2NlbmUsXCIxLzIvMy93bXlWZXRleF9mejAxQDFcIikgYXMgTGF5YS5TcHJpdGUzRDtcclxuXHRcdC8vIFx0Ly8gd215VmV0ZXhfZnowMS5ldmVudChcImFuaV9wbGF5XCIpO1xyXG5cclxuXHRcdC8vIFx0Ly8gTGF5YS50aW1lci5vbmNlKDEwMDAsdGhpcywoKT0+e1xyXG5cdFx0Ly8gXHQvLyBcdHdteVZldGV4X2Z6MDEuZXZlbnQoXCJhbmlfcGxheVwiKTtcclxuXHRcdC8vIFx0Ly8gfSlcclxuXHJcblx0XHQvLyB9KSk7XHJcblx0fVxyXG5cdFxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsIlxyXG5leHBvcnQgY2xhc3MgV215VXRpbHMgZXh0ZW5kcyBsYXlhLmV2ZW50cy5FdmVudERpc3BhdGNoZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM6V215VXRpbHM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215VXRpbHN7XHJcbiAgICAgICAgaWYoV215VXRpbHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlVdGlscy5fdGhpcz1uZXcgV215VXRpbHMoKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215VXRpbHMuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5fX2xvb3ApO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfRE9XTix0aGlzLCB0aGlzLl9fb25Ub3VjaERvd24pO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfVVAsdGhpcywgdGhpcy5fX29uVG91Y2hVcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5fX09uTW91c2VNT1ZFKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuUkVTSVpFLHRoaXMsdGhpcy5fX29uUmVzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgQ09MT1JfRklMVEVSU19NQVRSSVg6IEFycmF5PGFueT49W1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vUlxyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vR1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vQlxyXG4gICAgICAgIDAsIDAsIDAsIDEsIDAsIC8vQVxyXG4gICAgXTtcclxuICAgIC8v6L2s5o2i6aKc6ImyXHJcbiAgICBwdWJsaWMgY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXIsYT86bnVtYmVyKTpBcnJheTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMF09cjtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFs2XT1nO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzEyXT1iO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzE4XT1hfHwxO1xyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWDtcclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnModGFyZ2V0OkxheWEuU3ByaXRlLGNvbG9yOm51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKGNvbG9yICE9IDB4ZmZmZmZmKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgoXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj4xNikgJiAweGZmKS8yNTUsXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj44KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgIChjb2xvciAmIDB4ZmYpLzI1NVxyXG4gICAgICAgICAgICAgICAgKSldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnMxKHRhcmdldDpMYXlhLlNwcml0ZSxyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlcnM9bnVsbDtcclxuICAgICAgICBpZihyIDwgMSB8fCBnIDwgMSB8fCBiIDwgMSB8fCBhIDwgMSl7XHJcbiAgICAgICAgICAgIHRhcmdldC5maWx0ZXJzPVtuZXcgTGF5YS5Db2xvckZpbHRlcih0aGlzLmNvbnZlcnRDb2xvclRvQ29sb3JGaWx0ZXJzTWF0cml4KHIsZyxiLGEpKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5Yik5pat5omL5py65oiWUENcclxuICAgIHB1YmxpYyBpc1BjKCk6Ym9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHZhciBpc1BjOmJvb2xlYW49ZmFsc2U7XHJcbiAgICAgICAgaWYodGhpcy52ZXJzaW9ucygpLmFuZHJvaWQgfHwgdGhpcy52ZXJzaW9ucygpLmlQaG9uZSB8fCB0aGlzLnZlcnNpb25zKCkuaW9zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXNQYz1mYWxzZTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnZlcnNpb25zKCkuaVBhZCl7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpc1BjPXRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzUGM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmVyc2lvbnMoKXtcclxuICAgICAgICB2YXIgdTpzdHJpbmcgPSBuYXZpZ2F0b3IudXNlckFnZW50LCBhcHA6c3RyaW5nID0gbmF2aWdhdG9yLmFwcFZlcnNpb247XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLy/np7vliqjnu4jnq6/mtY/op4jlmajniYjmnKzkv6Hmga9cclxuICAgICAgICAgICAgdHJpZGVudDogdS5pbmRleE9mKCdUcmlkZW50JykgPiAtMSwgLy9JReWGheaguFxyXG4gICAgICAgICAgICBwcmVzdG86IHUuaW5kZXhPZignUHJlc3RvJykgPiAtMSwgLy9vcGVyYeWGheaguFxyXG4gICAgICAgICAgICB3ZWJLaXQ6IHUuaW5kZXhPZignQXBwbGVXZWJLaXQnKSA+IC0xLCAvL+iLueaenOOAgeiwt+atjOWGheaguFxyXG4gICAgICAgICAgICBnZWNrbzogdS5pbmRleE9mKCdHZWNrbycpID4gLTEgJiYgdS5pbmRleE9mKCdLSFRNTCcpID09IC0xLCAvL+eBq+eLkOWGheaguFxyXG4gICAgICAgICAgICBtb2JpbGU6ICEhdS5tYXRjaCgvQXBwbGVXZWJLaXQuKk1vYmlsZS4qLyl8fCEhdS5tYXRjaCgvQXBwbGVXZWJLaXQvKSwgLy/mmK/lkKbkuLrnp7vliqjnu4jnq69cclxuICAgICAgICAgICAgaW9zOiAhIXUubWF0Y2goL1xcKGlbXjtdKzsoIFU7KT8gQ1BVLitNYWMgT1MgWC8pLCAvL2lvc+e7iOerr1xyXG4gICAgICAgICAgICBhbmRyb2lkOiB1LmluZGV4T2YoJ0FuZHJvaWQnKSA+IC0xIHx8IHUuaW5kZXhPZignTGludXgnKSA+IC0xLCAvL2FuZHJvaWTnu4jnq6/miJbogIV1Y+a1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGhvbmU6IHUuaW5kZXhPZignaVBob25lJykgPiAtMSB8fCB1LmluZGV4T2YoJ01hYycpID4gLTEsIC8v5piv5ZCm5Li6aVBob25l5oiW6ICFUVFIROa1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGFkOiB1LmluZGV4T2YoJ2lQYWQnKSA+IC0xLCAvL+aYr+WQpmlQYWRcclxuICAgICAgICAgICAgd2ViQXBwOiB1LmluZGV4T2YoJ1NhZmFyaScpID09IC0xIC8v5piv5ZCmd2Vi5bqU6K+l56iL5bqP77yM5rKh5pyJ5aS06YOo5LiO5bqV6YOoXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VXJsVihrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgcmVnPSBuZXcgUmVnRXhwKFwiKF58JilcIitrZXkrXCI9KFteJl0qKSgmfCQpXCIpO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ/ZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdFsyXSk6bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25OYXZpZ2F0ZSh1cmw6c3RyaW5nLGlzUmVwbGFjZTpib29sZWFuPWZhbHNlKXtcclxuICAgICAgICBpZihpc1JlcGxhY2Upe1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh1cmwpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPXVybDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZXZlbnRMaXN0OkFycmF5PGxheWEuZXZlbnRzLkV2ZW50Pj1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaERvd24oZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdC5pbmRleE9mKGV2dCk8MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5wdXNoKGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uVG91Y2hVcChldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KT49MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5zcGxpY2UodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uUmVzaXplKCl7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0LmZvckVhY2goZXZ0ID0+IHtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcblx0XHR9KTtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3Q9bmV3IEFycmF5PGxheWEuZXZlbnRzLkV2ZW50PigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9fT25Nb3VzZU1PVkUoZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBiTnVtPTEwO1xyXG4gICAgICAgIGlmKGV2dC5zdGFnZVggPD0gYk51bSB8fCBldnQuc3RhZ2VYID49IExheWEuc3RhZ2Uud2lkdGgtYk51bSB8fFxyXG4gICAgICAgICAgICBldnQuc3RhZ2VZIDw9IGJOdW0gfHwgZXZ0LnN0YWdlWSA+PSBMYXlhLnN0YWdlLmhlaWdodC1iTnVtKXtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4sbD0yKXtcclxuXHRcdGlmKChuK1wiXCIpLmluZGV4T2YoXCIuXCIpPj0wKXtcclxuXHRcdCAgICBuPXBhcnNlRmxvYXQobi50b0ZpeGVkKGwpKTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gbjtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSX1hZKGQsIHIpXHJcbiAgICB7XHJcbiAgICBcdHZhciByYWRpYW4gPSAociAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgXHR2YXIgY29zID0gIE1hdGguY29zKHJhZGlhbik7XHJcbiAgICBcdHZhciBzaW4gPSAgTWF0aC5zaW4ocmFkaWFuKTtcclxuICAgIFx0XHJcbiAgICBcdHZhciBkeD1kICogY29zO1xyXG4gICAgXHR2YXIgZHk9ZCAqIHNpbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBMYXlhLlBvaW50KGR4ICwgZHkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICBwdWJsaWMgc3RhdGljIHN0cmluZzJidWZmZXIoc3RyKTpBcnJheUJ1ZmZlciB7XHJcbiAgICAgICAgLy8g6aaW5YWI5bCG5a2X56ym5Liy6L2s5Li6MTbov5vliLZcclxuICAgICAgICBsZXQgdmFsID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgdmFsID0gc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFsICs9ICcsJyArIHN0ci5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5bCGMTbov5vliLbovazljJbkuLpBcnJheUJ1ZmZlclxyXG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSh2YWwubWF0Y2goL1tcXGRhLWZdezJ9L2dpKS5tYXAoZnVuY3Rpb24gKGgpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoaCwgMTYpXHJcbiAgICAgICAgfSkpLmJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlcGxhY2VBbGwoc3RyLCBvbGRTdHIsIG5ld1N0cil7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnOyAgXHJcbiAgICAgICAgdGVtcCA9IHN0ci5yZXBsYWNlKG9sZFN0ciwgbmV3U3RyKTtcclxuICAgICAgICBpZih0ZW1wLmluZGV4T2Yob2xkU3RyKT49MCl7XHJcbiAgICAgICAgICAgIHRlbXAgPSB0aGlzLnJlcGxhY2VBbGwodGVtcCwgb2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDsgIFxyXG4gICAgfSAgXHJcblxyXG4gICAgLy/lpKflsI/lhpnovazmjaJcclxuICAgIHB1YmxpYyBzdGF0aWMgdG9DYXNlKHN0cjpzdHJpbmcsIGlzRHg9ZmFsc2UpeyAgXHJcbiAgICAgICAgdmFyIHRlbXAgPSAnJztcclxuICAgICAgICBpZighaXNEeCl7XHJcbiAgICAgICAgICAgIC8v6L2s5o2i5Li65bCP5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIC8v6L2s5YyW5Li65aSn5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9IFxyXG5cclxuICAgIFxyXG4gICAgLy/ot53nprtcclxuXHRwdWJsaWMgc3RhdGljIGdldERpc3RhbmNlKGE6TGF5YS5Qb2ludCxiOkxheWEuUG9pbnQpOm51bWJlciB7XHJcblx0XHR2YXIgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xyXG5cdFx0dmFyIGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcclxuXHRcdHZhciBkPU1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpO1xyXG5cdFx0ZD1wYXJzZUZsb2F0KGQudG9GaXhlZCgyKSk7XHJcblx0XHRyZXR1cm4gZDtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRYeVRvUih5LHgpOm51bWJlcntcclxuICAgICAgICB2YXIgcmFkaWFuPU1hdGguYXRhbjIoeSx4KTtcclxuICAgICAgICB2YXIgcj0oMTgwL01hdGguUEkqcmFkaWFuKTtcclxuICAgICAgICByPXRoaXMub25OdW1UbyhyKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0b3JhZ2Uoa2V5LCB2YWx1ZTphbnk9XCI/XCIsIGlzTG9jYWw9dHJ1ZSk6YW55e1xyXG4gICAgICAgIHZhciBzdG9yYWdlOmFueT1pc0xvY2FsP2xvY2FsU3RvcmFnZTpzZXNzaW9uU3RvcmFnZTtcclxuICAgICAgICBpZih2YWx1ZT09XCI/XCIpe1xyXG5cdFx0XHR2YXIgZGF0YSA9IHN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYodmFsdWU9PW51bGwpe1xyXG5cdFx0XHRzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy/mkq3mlL7lo7Dpn7NcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheUZ1aVNvdW5kKF91cmwsdm9sdW1lPTAuMixjb21wbGV0ZUhhbmRsZXI/LHN0YXJ0VGltZT0wLGxvb3BzPTEpe1xyXG4gICAgICAgIGlmKHZvbHVtZTw9MClyZXR1cm47XHJcbiAgICAgICAgdmFyIGl0ZW09ZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1CeVVSTChfdXJsKTtcclxuICAgICAgICB2YXIgdXJsPWl0ZW0uZmlsZTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQodXJsLGxvb3BzLGNvbXBsZXRlSGFuZGxlcixudWxsLHN0YXJ0VGltZSk7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIuc2V0U291bmRWb2x1bWUodm9sdW1lLHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/mtYXmi7fotJ1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2hhbGxvd0NvcHkob2JqKXtcclxuICAgICAgICAvLyDlj6rmi7fotJ3lr7nosaFcclxuICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHJldHVybjtcclxuICAgICAgICAvLyDmoLnmja5vYmrnmoTnsbvlnovliKTmlq3mmK/mlrDlu7rkuIDkuKrmlbDnu4Tov5jmmK/kuIDkuKrlr7nosaFcclxuICAgICAgICB2YXIgbmV3T2JqID0gb2JqIGluc3RhbmNlb2YgQXJyYXkgPyBbXSA6IHt9O1xyXG4gICAgICAgIC8vIOmBjeWOhm9iaizlubbkuJTliKTmlq3mmK9vYmrnmoTlsZ7mgKfmiY3mi7fotJ1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICBuZXdPYmpba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgLy/mt7Hmi7fotJ1cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVlcENvcHkob2JqKXtcclxuICAgICAgICAvLyDlj6rmi7fotJ3lr7nosaFcclxuICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHJldHVybjtcclxuICAgICAgICAvLyDmoLnmja5vYmrnmoTnsbvlnovliKTmlq3mmK/mlrDlu7rkuIDkuKrmlbDnu4Tov5jmmK/kuIDkuKrlr7nosaFcclxuICAgICAgICB2YXIgbmV3T2JqID0gb2JqIGluc3RhbmNlb2YgQXJyYXkgPyBbXSA6IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgLy8g6YGN5Y6Gb2JqLOW5tuS4lOWIpOaWreaYr29iaueahOWxnuaAp+aJjeaLt+i0nVxyXG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIOWIpOaWreWxnuaAp+WAvOeahOexu+Wei++8jOWmguaenOaYr+WvueixoemAkuW9kuiwg+eUqOa3seaLt+i0nVxyXG4gICAgICAgICAgICAgICAgbmV3T2JqW2tleV0gPSB0eXBlb2Ygb2JqW2tleV0gPT09ICdvYmplY3QnID8gdGhpcy5kZWVwQ29weShvYmpba2V5XSkgOiBvYmpba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3T2JqO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFdteVV0aWxzIH0gZnJvbSBcIi4vV215VXRpbHNcIjtcclxuaW1wb3J0IHsgV215TG9hZDNkIH0gZnJvbSBcIi4vZDMvV215TG9hZDNkXCI7XHJcbmltcG9ydCB7IFdteUxvYWRNYXRzIH0gZnJvbSBcIi4vZDMvV215TG9hZE1hdHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlfTG9hZF9NYWdcclxue1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215X0xvYWRfTWFne1xyXG4gICAgICAgIGlmKFdteV9Mb2FkX01hZy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteV9Mb2FkX01hZy5fdGhpcz1uZXcgV215X0xvYWRfTWFnKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlfTG9hZF9NYWcuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF93ZXREYXRhOmFueT17fTtcclxuXHJcbiAgICBwdWJsaWMgZGF0YU5hbWU6c3RyaW5nPVwiXCI7XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRSZXNPYmoocmVzTmFtZTpzdHJpbmcsZGF0YU5hbWU/KXtcclxuICAgICAgICB2YXIgd2ViRGF0YTphbnk7XHJcbiAgICAgICAgaWYoZGF0YU5hbWU9PW51bGwpe1xyXG4gICAgICAgICAgICBkYXRhTmFtZT10aGlzLmRhdGFOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3ZWJEYXRhPXRoaXMuX3dldERhdGFbZGF0YU5hbWVdO1xyXG4gICAgICAgIGlmKHdlYkRhdGE9PW51bGwpe1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLnqbrmlbDmja5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYXJyOkFycmF5PGFueT49bnVsbDtcclxuICAgICAgICBpZih3ZWJEYXRhIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBhcnI9d2ViRGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc09iaj1udWxsO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPWFycltpXTtcclxuICAgICAgICAgICAgaWYob2JqW1wicmVzTmFtZVwiXT09cmVzTmFtZSl7XHJcbiAgICAgICAgICAgICAgICByZXNPYmo9b2JqO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc09iajtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25TZXRXZXREYXRhKGRhdGFOYW1lOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgaWYod2luZG93W2RhdGFOYW1lXT09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdGhpcy5kYXRhTmFtZT1kYXRhTmFtZTtcclxuICAgICAgICB0aGlzLl93ZXREYXRhW2RhdGFOYW1lXT13aW5kb3dbZGF0YU5hbWVdO1xyXG4gICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5fd2V0RGF0YVtkYXRhTmFtZV1dKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25sb2FkU3RyKHN0cjpzdHJpbmcsY2FsbGJhY2tPaz86TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc09iaj10aGlzLmdldFJlc09iaihzdHIpO1xyXG4gICAgICAgIGlmKHJlc09iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMub25sb2FkKHJlc09iaixjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJvbmxvYWRTdHIt5Ye66ZSZOlwiLHN0cik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Jlc0RhdGFBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6QXJyYXk8YW55Pj1bXTtcclxuICAgIHB1YmxpYyBvbmxvYWQocmVzT2JqOmFueSxjYWxsYmFja09rPzpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgcmVzTmFtZT1yZXNPYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgIGlmKHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdLnJ1bldpdGgoW3RoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc09ialtcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6YW55PXt9O1xyXG4gICAgICAgICAgICB2YXIgcmVzRGF0YTpzdHJpbmc9cmVzT2JqW1wicmVzRGF0YVwiXTtcclxuICAgICAgICAgICAgaWYocmVzRGF0YSE9bnVsbCAmJiByZXNEYXRhIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YT1KU09OLnBhcnNlKHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIixyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWVVcmw7XHJcbiAgICAgICAgICAgIHZhciB1cmxBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdmFyIGlzQ3JlYXRlPWZhbHNlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc1VybD1XbXlVdGlscy50b0Nhc2UocmVzVXJsKTtcclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgaWYodXJsLmluZGV4T2YoXCIudHh0XCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLkJVRkZFUn0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJOYW1lVXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodXJsLmluZGV4T2YoXCIuanBnXCIpPj0wIHx8IHVybC5pbmRleE9mKFwiLnBuZ1wiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5JTUFHRX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih1cmwuaW5kZXhPZihcIi5tcDNcIik+PTAgfHwgdXJsLmluZGV4T2YoXCIud2F2XCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLlNPVU5EfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsQXJyLmxlbmd0aDw9MClyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsQXJyLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uQXNzZXRDb25tcGxldGUsW3Jlc05hbWUsYk5hbWVVcmwsZGF0YV0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkFzc2V0UHJvZ3Jlc3MsIFtyZXNOYW1lXSwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgb25DbGVhcjNkUmVzKHVybCl7XHJcbiAgICAgICAgTGF5YS5SZXNvdXJjZS5kZXN0cm95VW51c2VkUmVzb3VyY2VzKCk7XHJcbiAgICAgICAgV215TG9hZDNkLmdldFRoaXMuY2xlYXJSZXModXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkM2RPbmUodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIFdteUxvYWQzZC5vbkxvYWQzZE9uZSh1cmwsY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25sb2FkM2QocmVzT2JqOmFueSxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNOYW1lPXJlc09ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgaWYodGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0ucnVuV2l0aChbdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzT2JqW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTphbnk9e307XHJcbiAgICAgICAgICAgIHZhciByZXNEYXRhOnN0cmluZz1yZXNPYmpbXCJyZXNEYXRhXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNEYXRhIT1udWxsICYmIHJlc0RhdGEhPVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhPUpTT04ucGFyc2UocmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZTtcclxuICAgICAgICAgICAgdmFyIHVybEFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB2YXIgdXJsTGlzdDpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsLmluZGV4T2YoXCIubHNcIik+PTAgfHwgcmVzVXJsLmluZGV4T2YoXCIubGhcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsQXJyLmxlbmd0aDw9MClyZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGEudXJsTGlzdD11cmxMaXN0O1xyXG4gICAgICAgICAgICBXbXlMb2FkM2QuZ2V0VGhpcy5vbmxvYWQzZCh1cmxBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Bc3NldENvbm1wbGV0ZSxbcmVzTmFtZSxiTmFtZSxkYXRhXSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQXNzZXRQcm9ncmVzcywgW3Jlc05hbWVdLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcblx0cHJpdmF0ZSBvbkFzc2V0UHJvZ3Jlc3MocmVzTmFtZSxwcm9ncmVzcyk6IHZvaWQge1xyXG4gICAgICAgIHZhciBjYWxsYmFja1Byb2dyZXNzQXJyOkFycmF5PExheWEuSGFuZGxlcj49dGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrUHJvZ3Jlc3NBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gY2FsbGJhY2tQcm9ncmVzc0FycltpXTtcclxuICAgICAgICAgICAgY2FsbGJhY2sucnVuV2l0aChbcHJvZ3Jlc3NdKTtcclxuICAgICAgICB9XHJcblx0fVxyXG4gICAgXHJcbiAgICBwcml2YXRlIG9uQXNzZXRDb25tcGxldGUocmVzTmFtZSxiTmFtZVVybDpzdHJpbmcsZGF0YSk6dm9pZHtcclxuICAgICAgICB2YXIgY2FsbGJhY2tPa0FycjpBcnJheTxMYXlhLkhhbmRsZXI+PXRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV07XHJcbiAgICAgICAgaWYoYk5hbWVVcmwhPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgYmFvPUxheWEubG9hZGVyLmdldFJlcyhiTmFtZVVybCk7XHJcbiAgICAgICAgICAgIHZhciBiTmFtZSA9IGJOYW1lVXJsLnJlcGxhY2UoXCIudHh0XCIsXCJcIik7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBmYWlyeWd1aS5VSVBhY2thZ2UuYWRkUGFja2FnZShiTmFtZSxiYW8pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRlVJLeWHuumUmTpcIixiTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lQXJyPWJOYW1lLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgZGF0YS5iTmFtZT1iTmFtZUFycltiTmFtZUFyci5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV09ZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja09rQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFja09rID0gY2FsbGJhY2tPa0FycltpXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW2RhdGFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPW51bGw7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1udWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzQXV0b0xvYWRQPWZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaXNVM2Q9ZmFsc2U7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZEluZm9BcnI6YW55O1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRyQ2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkQWxsKGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHdlYkRhdGE6YW55PXRoaXMuX3dldERhdGFbdGhpcy5kYXRhTmFtZV07XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhcnI9PW51bGwpe1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyPUpTT04ucGFyc2Uod2ViRGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLmnZDmlpnmlbDmja7plJnor69cIix3ZWJEYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyPXt9O1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXT0wO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl09MDtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXT1bXTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl09W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9YXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzTmFtZT1vYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgICAgICB2YXIgdD1vYmpbXCJ0eXBlXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNOYW1lPT1udWxsIHx8IHJlc05hbWU9PVwiXCIgfHwgdD09bnVsbCB8fCB0PT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uQXV0b0xvYWRPYmoodCxyZXNOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faXNBdXRvTG9hZFA9dHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25BdXRvTG9hZE9iaih0eXBlOnN0cmluZyxyZXNOYW1lKXtcclxuICAgICAgICB2YXIgcmVzPXRoaXMuZ2V0UmVzT2JqKHJlc05hbWUpO1xyXG4gICAgICAgIGlmKHJlcz09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIHJlc0lkPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdPXt9O1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJuXCJdPXJlc05hbWU7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInRcIl09dHlwZTtcclxuICAgICAgICB2YXIgbG9hZE9rPWZhbHNlO1xyXG4gICAgICAgIGlmKHR5cGU9PVwidWlcIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInVpLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZDNkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzVTNkPXRydWU7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidTNkLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZT09XCJtYXRzXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgdXJsTGlzdDpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgcmVzVXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgocmVzVXJsKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIHVybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybExpc3QubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZE1hdHMuZ2V0VGhpcy5vbmxvYWQzZCh1cmxMaXN0LG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgICAgICBsb2FkT2s9dHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibWF0cy3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGU9PVwiY3ViZU1hcFwiKXtcclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc1tcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgTGF5YS5UZXh0dXJlQ3ViZS5sb2FkKHVybCxudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlPT1cImF1ZGlvXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJhdWRpby3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdWJlKHJlc05hbWUsIGNvbXBsZXRlOiBMYXlhLkhhbmRsZXIpOkFycmF5PExheWEuVGV4dHVyZUN1YmU+e1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgIHZhciBSZXNyZXNPYmo6QXJyYXk8TGF5YS5UZXh0dXJlQ3ViZT49W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgIHJlc1VybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHJlc1VybCk7XHJcbiAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG5ldyBMYXlhLkhhbmRsZXIodGhpcyxjdWJlPT57XHJcbiAgICAgICAgICAgICAgICBSZXNyZXNPYmpbaV09Y3ViZTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlLnJ1bldpdGgoW2N1YmUsaV0pO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBSZXNyZXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkxvYWRpbmcocmVzSWQsIHByb2dyZXNzOm51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHZhciBwQz0wO1xyXG4gICAgICAgIGlmKCF0aGlzLl9pc0F1dG9Mb2FkUCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwQ10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInBcIl09cHJvZ3Jlc3M7XHJcbiAgICAgICAgdmFyIG51bT10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl07XHJcbiAgICAgICAgdmFyIHBOdW09MDtcclxuICAgICAgICB2YXIgcFM9MS9udW07XHJcbiAgICAgICAgdmFyIHAwPTAscDE9MDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPG51bTtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltpXTtcclxuICAgICAgICAgICAgdmFyIHA9b2JqW1wicFwiXTtcclxuICAgICAgICAgICAgaWYocCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9pc1UzZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYob2JqW1widFwiXT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAxPXAqKHBTKihpKzEpKSowLjg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAwPXAqKHBTKihpKzEpKSowLjI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBOdW09cDArcDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHBOdW09cCoocFMqKGkrMSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBDPXBOdW0qMTAwO1xyXG4gICAgICAgIGlmKGlzTmFOKHBDKSlwQz0wO1xyXG4gICAgICAgIGlmKHBDPjEpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocEMpO1xyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BDXSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkxvYWRPayhyZXNJZCxkYXRhPyl7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXSs9MTtcclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT09XCJ1aVwiKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl0ucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdPj10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0pe1xyXG4gICAgICAgICAgICBpZih0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl0sdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufSIsImltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi9XbXlVdGlsczNEXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215TG9hZDNke1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZDNke1xyXG4gICAgICAgIGlmKFdteUxvYWQzZC5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5fdGhpcz1uZXcgV215TG9hZDNkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlMb2FkM2QuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3VybExpc3Q6QXJyYXk8c3RyaW5nPjtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcixpc0NsZWFyUmVzPyl7XHJcbiAgICAgICAgdGhpcy5fdXJsTGlzdD1bXTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybDpzdHJpbmc9dXJsTGlzdFtpXVtcInVybFwiXTtcclxuICAgICAgICAgICAgdXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgodXJsKTtcclxuICAgICAgICAgICAgdGhpcy5fdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIHRoaXMuX29ubG9hZDNkKHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBvbkxvYWQzZE9uZSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAvLyAgICAgV215TG9hZDNkLmdldFRoaXMuX29uTG9hZDNkT25lKHVybCxjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHB1YmxpYyBfb25Mb2FkM2RPbmUodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgLy8gICAgIHRoaXMuX2xvYWQzZCh1cmwsY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIF9sb2FkM2QodXJsLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAvLyAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcclxuICAgIC8vICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgLy8gICAgICAgICBpZihjYWxsYmFja09rIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKHApPT57XHJcbiAgICAvLyAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwXSk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9LG51bGwsZmFsc2UpKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTG9hZDNkT25lKHVybDpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgd215TG9hZDNkPW5ldyBXbXlMb2FkM2QoKTtcclxuICAgICAgICB3bXlMb2FkM2QuX19vbmxvYWQzZE9uZSh1cmwsY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX19vbmxvYWQzZE9uZSh1cmwsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB0aGlzLl91cmxMaXN0PVtdO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgdXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgodXJsKTtcclxuICAgICAgICB0aGlzLl91cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICB0aGlzLl9vbmxvYWQzZCh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgX29ubG9hZDNkKF91cmxMaXN0KXtcclxuICAgIC8vICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgIC8vICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX3VybExpc3Q9bnVsbDtcclxuICAgIC8vICAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1udWxsO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPW51bGw7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX21BcnI9bnVsbDtcclxuICAgIC8vICAgICB9KSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKHApPT57XHJcbiAgICAvLyAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwXSk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KSxudWxsLG51bGwsbnVsbCwxLGZhbHNlKTtcclxuICAgIC8vIH1cclxuICAgIHByaXZhdGUgX29ubG9hZDNkKHVybCl7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcclxuICAgICAgICBMYXlhLmxvYWRlci5fY3JlYXRlTG9hZCh1cmwpO1xyXG4gICAgICAgIHZhciBsb2FkPUxheWEuTG9hZGVyTWFuYWdlcltcIl9yZXNNYXBcIl1bdXJsXTtcclxuICAgICAgICBsb2FkLm9uY2UoTGF5YS5FdmVudC5DT01QTEVURSx0aGlzLHRoaXMuX19vbmxzVXJsT2ssW3VybF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21BcnI6QXJyYXk8c3RyaW5nPjtcclxuICAgIHByaXZhdGUgX19vbmxzVXJsT2sodXJsLGQpe1xyXG4gICAgICAgIHZhciBzMD11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIHZhciBzMT11cmwucmVwbGFjZShzMFtzMC5sZW5ndGgtMV0sXCJcIik7XHJcbiAgICAgICAgdmFyIHJvb3RVcmw9czE7XHJcbiAgICAgICAgdmFyIGpzT2JqPUpTT04ucGFyc2UoZCk7XHJcbiAgICAgICAgdGhpcy5fbUFycj1bXTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3RpUXVVcmwoanNPYmpbXCJkYXRhXCJdLHJvb3RVcmwpO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5fbUFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMuX21BcnJbaV07XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkxvYWRPaykpO1xyXG4gICAgICAgICAgICAvL0xheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkxvYWRPayksdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsZ3JvdXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tTnVtPTA7XHJcbiAgICBwcml2YXRlIF9wTnVtPTA7XHJcbiAgICBwcml2YXRlIF9fb25Mb2FkT2soKXtcclxuICAgICAgICB0aGlzLl9tTnVtKz0xO1xyXG4gICAgICAgIHRoaXMuX3BOdW09dGhpcy5fbU51bS90aGlzLl9tQXJyLmxlbmd0aDtcclxuICAgICAgICB0aGlzLl9fb25Mb2FkUChudWxsKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5fbU51bT49dGhpcy5fbUFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cmxMaXN0PW51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rPW51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPW51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tQXJyPW51bGw7XHJcbiAgICAgICAgICAgIH0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25Mb2FkUCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfX29uTG9hZFAocCl7XHJcbiAgICAgICAgdmFyIHBOdW09dGhpcy5fcE51bSowLjc7XHJcbiAgICAgICAgaWYocCl7XHJcbiAgICAgICAgICAgIHBOdW0rPXAqMC4yNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcE51bV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gcHJpdmF0ZSBfbVA9MDtcclxuICAgIC8vIHByaXZhdGUgX21QMj0wO1xyXG5cclxuICAgIC8vIHByaXZhdGUgX19vbkFyclAocCl7XHJcbiAgICAvLyAgICAgdmFyIHBOdW09cCoodGhpcy5fbU51bSsxKTtcclxuICAgIC8vICAgICBpZihwTnVtPnRoaXMuX21QKXRoaXMuX21QPXBOdW07XHJcbiAgICAvLyAgICAgdGhpcy5fbVAyPSh0aGlzLl9tUC90aGlzLl9tQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgdmFyIHBOdW09KHRoaXMuX21QMikqMC45ODtcclxuICAgIC8vICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwTnVtXSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgLy8gcHJpdmF0ZSBfX29uQXJyT2soKXtcclxuICAgIC8vICAgICB0aGlzLl9tTnVtKz0xO1xyXG4gICAgLy8gICAgIGlmKHRoaXMuX21OdW0+PXRoaXMuX21BcnIubGVuZ3RoKXtcclxuICAgIC8vICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHRoaXMuX3VybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCgpPT57XHJcbiAgICAvLyAgICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fdXJsTGlzdD1udWxsO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1udWxsO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1udWxsO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fbUFycj1udWxsO1xyXG4gICAgLy8gICAgICAgICB9KSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgcHJpdmF0ZSBfX3RpUXVVcmwob2JqLHVybDpzdHJpbmc9XCJcIil7XHJcbiAgICAgICAgaWYob2JqW1wicHJvcHNcIl0hPW51bGwgJiYgb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBtZXNoUGF0aD11cmwrb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKG1lc2hQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChtZXNoUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsczpBcnJheTxhbnk+PW9ialtcInByb3BzXCJdW1wibWF0ZXJpYWxzXCJdO1xyXG4gICAgICAgICAgICBpZihtYXRlcmlhbHMhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpaT0wO2lpPG1hdGVyaWFscy5sZW5ndGg7aWkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGg9dXJsK21hdGVyaWFsc1tpaV1bXCJwYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbXCJjb21wb25lbnRzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGNvbXBvbmVudHM6QXJyYXk8YW55Pj1vYmpbXCJjb21wb25lbnRzXCJdO1xyXG4gICAgICAgICAgICBpZihjb21wb25lbnRzLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkwID0gMDsgaTAgPCBjb21wb25lbnRzLmxlbmd0aDsgaTArKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wID0gY29tcG9uZW50c1tpMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImF2YXRhclwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcGF0aD11cmwrY29tcFtcImF2YXRhclwiXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihhcGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goYXBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbXBbXCJsYXllcnNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXJzOkFycmF5PGFueT49Y29tcFtcImxheWVyc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IGxheWVycy5sZW5ndGg7IGkxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllciA9IGxheWVyc1tpMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVzOkFycmF5PGFueT49bGF5ZXJbXCJzdGF0ZXNcIl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBzdGF0ZXMubGVuZ3RoOyBpMisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW2kyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xpcFBhdGg9dXJsK3N0YXRlW1wiY2xpcFBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGNsaXBQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKGNsaXBQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNoaWxkOkFycmF5PGFueT49b2JqW1wiY2hpbGRcIl07XHJcbiAgICAgICAgaWYoY2hpbGQhPW51bGwgJiYgY2hpbGQubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGNoaWxkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3RpUXVVcmwoY2hpbGRbaV0sdXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL1xyXG4gICAgcHVibGljIGNsZWFyUmVzKHVybDpzdHJpbmcpe1xyXG4gICAgICAgIGlmKCF1cmwgfHwgdXJsLmluZGV4T2YoXCIvXCIpPDApcmV0dXJuO1xyXG4gICAgICAgIHZhciB1MD11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgIHZhciB1MT11cmwucmVwbGFjZSh1MFt1MC5sZW5ndGgtMV0sXCJcIik7XHJcblxyXG4gICAgICAgIHZhciB1cmxzPVtdO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIExheWEuTG9hZGVyLmxvYWRlZE1hcCkge1xyXG4gICAgICAgICAgICBpZiAoTGF5YS5Mb2FkZXIubG9hZGVkTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsb2FkVXJsOnN0cmluZz0ga2V5O1xyXG4gICAgICAgICAgICAgICAgaWYobG9hZFVybC5pbmRleE9mKHUxKT49MCB8fCBsb2FkVXJsLmluZGV4T2YoXCJyZXMvbWF0cy9cIik+PTAgKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih1cmxzLmluZGV4T2YobG9hZFVybCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybHMucHVzaChsb2FkVXJsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXJscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSB1cmxzW2ldO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy/moLnmja7otYTmupDot6/lvoTojrflj5botYTmupDvvIhSZXNvdXJjZeS4uuadkOi0qOOAgei0tOWbvuOAgee9keagvOetieeahOWfuuexu++8iVxyXG4gICAgICAgICAgICAgICAgdmFyIHJlczpMYXlhLlJlc291cmNlPUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXJlcy5sb2NrKXtcclxuICAgICAgICAgICAgICAgICAgICByZXMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8v6LWE5rqQ6YeK5pS+XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlbGVhc2VSZXNvdXJjZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcclxuICAgICAgICAgICAgICAgIC8vTGF5YS5sb2FkZXIuY2xlYXJVbkxvYWRlZCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaWRSZXNvdXJjZXNNYXBMb2NrKHRhcmdldCxpc0xvY2s9dHJ1ZSl7XHJcbiAgICAgICAgaWYodGFyZ2V0PT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgb2JqTGlzdD1XbXlVdGlsczNELmdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxMYXlhLlJlbmRlcmFibGVTcHJpdGUzRCk7XHJcbiAgICAgICAgdmFyIGtJZHM9W107XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiBvYmpMaXN0KXtcclxuICAgICAgICAgICAgdmFyIG9iaj1vYmpMaXN0W2ldO1xyXG4gICAgICAgICAgICBXbXlMb2FkM2QuX2xvb3BMb2NrKG9iaixrSWRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHJNYXA9TGF5YS5SZXNvdXJjZVtcIl9pZFJlc291cmNlc01hcFwiXTtcclxuICAgICAgICBmb3IgKHZhciBrIGluIGtJZHMpe1xyXG4gICAgICAgICAgICBjb25zdCBvID1rSWRzW2tdO1xyXG4gICAgICAgICAgICB2YXIgcmVzPXJNYXBbb107XHJcbiAgICAgICAgICAgIHJlcy5sb2NrPWlzTG9jaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2xvb3BMb2NrKG9iaixhcnIpe1xyXG4gICAgICAgIFdteUxvYWQzZC5fTWVzaChvYmosYXJyKTtcclxuICAgICAgICBXbXlMb2FkM2QuX01hdGVyaWFscyhvYmosYXJyKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLkJhc2VSZW5kZXIpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9sb29wTG9jayhvLGFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX01lc2gob2JqLGFycil7XHJcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBvID0gb2JqW2tdO1xyXG4gICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5NZXNoKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgX3ZlcnRleEJ1ZmZlcnM9b1tcIl92ZXJ0ZXhCdWZmZXJzXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYoX3ZlcnRleEJ1ZmZlcnMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgazAgaW4gX3ZlcnRleEJ1ZmZlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbzAgPSBfdmVydGV4QnVmZmVyc1trMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG8wIGluc3RhbmNlb2YgTGF5YS5WZXJ0ZXhCdWZmZXIzRCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8wLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgazEgaW4gbykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG8xID0gb1trMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobzEgaW5zdGFuY2VvZiBMYXlhLkluZGV4QnVmZmVyM0Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8xLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9NYXRlcmlhbHMob2JqLGFycil7XHJcbiAgICAgICAgdmFyIF9tYXRlcmlhbHM9b2JqW1wiX21hdGVyaWFsc1wiXTtcclxuICAgICAgICBpZihfbWF0ZXJpYWxzKXtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrIGluIF9tYXRlcmlhbHMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG8gPSBfbWF0ZXJpYWxzW2tdO1xyXG4gICAgICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuQmFzZU1hdGVyaWFsKXtcclxuICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8sYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX1NoYWRlcihvLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgV215TG9hZDNkLl9TaGFkZXJEYXRhKG8sYXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX1NoYWRlcihvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLlNoYWRlcjNEKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfU2hhZGVyRGF0YShvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLlNoYWRlckRhdGEpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9CYXNlVGV4dHVyZShvW1wiX2RhdGFcIl0sYXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfQmFzZVRleHR1cmUob2JqLGFycil7XHJcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBvID0gb2JqW2tdO1xyXG4gICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5CYXNlVGV4dHVyZSl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8sYXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfZ2V0UmVzb3VyY2VzTWFwSWQob2JqLGFycil7XHJcbiAgICAgICAgdmFyIHJNYXA9TGF5YS5SZXNvdXJjZVtcIl9pZFJlc291cmNlc01hcFwiXTtcclxuICAgICAgICBmb3IgKHZhciBrIGluIHJNYXApe1xyXG4gICAgICAgICAgICB2YXIgcmVzPXJNYXBba107XHJcbiAgICAgICAgICAgIGlmKG9iaj09cmVzKXtcclxuICAgICAgICAgICAgICAgIGlmKGFyci5pbmRleE9mKGspPDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFdteUxvYWRNYXRze1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZE1hdHN7XHJcbiAgICAgICAgaWYoV215TG9hZE1hdHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlMb2FkTWF0cy5fdGhpcz1uZXcgV215TG9hZE1hdHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWRNYXRzLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vblVybEFyck9rLFt1cmxMaXN0XSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tYXRzVXJsQXJyOkFycmF5PHN0cmluZz49W107XHJcbiAgICBwcml2YXRlIF9tYXRPaz1mYWxzZTtcclxuICAgIHByaXZhdGUgX21hdE51bT0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UD0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UDI9MDtcclxuXHJcbiAgICBwcml2YXRlIF9fb25VcmxBcnJPayh1cmxMaXN0OkFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybD11cmxMaXN0W2ldO1xyXG4gICAgICAgICAgICAvLyB2YXIgdHh0PUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICAvLyB2YXIganNPYmo9SlNPTi5wYXJzZSh0eHQpO1xyXG4gICAgICAgICAgICB2YXIganNPYmo9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXJyPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIHZhciBtYXRzVXJsPXVybC5yZXBsYWNlKGFyclthcnIubGVuZ3RoLTFdLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXk6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycmF5PWpzT2JqW1wibWF0c1wiXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgICAgICBpZihvYmpbXCJ0YXJnZXROYW1lXCJdPT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hdFVybD1tYXRzVXJsK29ialtcIm1hdFVybFwiXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hdHNVcmxBcnIucHVzaChtYXRVcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21hdHNVcmxBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tYXRzVXJsQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25NYXRBcnJPayksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyclApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyUChwKXtcclxuICAgICAgICB2YXIgcE51bT1wKih0aGlzLl9tYXROdW0rMSk7XHJcbiAgICAgICAgaWYocE51bT50aGlzLl9tYXRQKXRoaXMuX21hdFA9cE51bTtcclxuICAgICAgICB0aGlzLl9tYXRQMj0odGhpcy5fbWF0UC90aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbdGhpcy5fbWF0UDJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyT2soKXtcclxuICAgICAgICB0aGlzLl9tYXROdW0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fbWF0TnVtPj10aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuL1dteVV0aWxzM0RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlTY3JpcHQzRCBleHRlbmRzIExheWEuU2NyaXB0M0Qge1xyXG4gICAgcHVibGljIGRlbChkZXN0cm95Q2hpbGQ6IGJvb2xlYW4gPSB0cnVlKXtcclxuICAgICAgICB0aGlzLm93bmVyM0QuZGVzdHJveShkZXN0cm95Q2hpbGQpO1xyXG4gICAgfVxyXG5cdHB1YmxpYyBvbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vd25lcjNEPW51bGw7XHJcbiAgICAgICAgdGhpcy5zY2VuZTNEPW51bGw7XHJcbiAgICAgICAgdGhpcy5vbkRlbCgpO1xyXG4gICAgfVxyXG4gICAgXHJcblx0cHVibGljIG9uRGVsKCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIG93bmVyM0Q6TGF5YS5TcHJpdGUzRDtcclxuICAgIHByaXZhdGUgX2xvY2FsU2NhbGU6TGF5YS5WZWN0b3IzO1xyXG5cclxuICAgIHB1YmxpYyBzY2VuZTNEOkxheWEuU2NlbmUzRDtcclxuXHJcblx0cHVibGljIF9vbkFkZGVkKCkge1xyXG4gICAgICAgIHN1cGVyLl9vbkFkZGVkKCk7XHJcbiAgICAgICAgdGhpcy5vd25lcjNEPXRoaXMub3duZXIgYXMgTGF5YS5TcHJpdGUzRDtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9jYWxTY2FsZT1uZXcgTGF5YS5WZWN0b3IzKDAsIDAsIDApO1xyXG4gICAgICAgIGlmKHRoaXMub3duZXIzRC50cmFuc2Zvcm0pe1xyXG4gICAgICAgICAgICB0aGlzLl9sb2NhbFNjYWxlPXRoaXMub3duZXIzRC50cmFuc2Zvcm0ubG9jYWxTY2FsZS5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjZW5lM0Q9dGhpcy5vd25lcjNELnNjZW5lO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvL+aYr+WQpuWPr+ingVxyXG4gICAgcHVibGljIHNldFNob3codjpib29sZWFuKXtcclxuICAgICAgICB0aGlzLm93bmVyM0QudHJhbnNmb3JtLmxvY2FsU2NhbGUgPSAhdj8gbmV3IExheWEuVmVjdG9yMygwLCAwLCAwKTogdGhpcy5fbG9jYWxTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICAvL1xyXG4gICAgcHVibGljIGdldE9iajNkVXJsKHRhcmdldCx1cmw6c3RyaW5nKTphbnl7XHJcbiAgICAgICAgcmV0dXJuIFdteVV0aWxzM0QuZ2V0T2JqM2RVcmwodGFyZ2V0LHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/orr7nva7pmLTlvbFcclxuICAgIHB1YmxpYyBvblNldFNoYWRvdyhpc0Nhc3RTaGFkb3csaXNSZWNlaXZlU2hhZG93KVxyXG4gICAge1xyXG4gICAgICAgIFdteVV0aWxzM0Qub25TZXRTaGFkb3codGhpcy5vd25lcjNELGlzQ2FzdFNoYWRvdyxpc1JlY2VpdmVTaGFkb3cpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFdteV9Mb2FkX01hZyB9IGZyb20gXCIuLi9XbXlfTG9hZF9NYWdcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlVdGlsczNEe1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmozZCh0YXJnZXQsb2JqTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQubmFtZT09b2JqTmFtZSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgaWYgKG8uX2NoaWxkcmVuLmxlbmd0aCA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihvLm5hbWU9PW9iak5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcE9iaj10aGlzLmdldE9iajNkKG8sb2JqTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wT2JqIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcE9iajtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkVXJsKHRhcmdldCx1cmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgYXJyVXJsPXVybC5zcGxpdCgnLycpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0LGFyclVybCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIF9nZXRPYmpBcnJVcmwodGFyZ2V0LHVybEFycjpBcnJheTxzdHJpbmc+LGlkPTApe1xyXG4gICAgICAgIHZhciBfdGFyZ2V0OkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKF90YXJnZXQ9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIG5hPXVybEFycltpZF07XHJcbiAgICAgICAgdmFyIHRhcmdldE9iaj1fdGFyZ2V0LmdldENoaWxkQnlOYW1lKG5hKTtcclxuICAgICAgICBpZih0YXJnZXRPYmo9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYoaWQ+PXVybEFyci5sZW5ndGgtMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHRhcmdldE9iaj10aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0T2JqLHVybEFyciwrK2lkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRDaGlsZHJlbkNvbXBvbmVudCh0YXJnZXQsY2xhczphbnksYXJyPyk6QXJyYXk8YW55PntcclxuICAgICAgICBpZihhcnI9PW51bGwpYXJyPVtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb2JqPXRhcmdldC5nZXRDb21wb25lbnQoY2xhcyk7XHJcbiAgICAgICAgaWYob2JqPT1udWxsKXtcclxuICAgICAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgY2xhcyl7XHJcbiAgICAgICAgICAgICAgICBvYmo9dGFyZ2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9iaiE9bnVsbCAmJiBhcnIuaW5kZXhPZihvYmopPDApe1xyXG4gICAgICAgICAgICBhcnIucHVzaChvYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQuX2NoaWxkcmVuPT1udWxsKSByZXR1cm4gYXJyO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG86TGF5YS5TcHJpdGUzRCA9IHRhcmdldC5fY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRyZW5Db21wb25lbnQobyxjbGFzLGFycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW50aWF0ZSh0YXJnZXQsdGFyZ2V0TmFtZT86c3RyaW5nKTphbnl7XHJcbiAgICAgICAgaWYodGFyZ2V0PT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBfdGFyZ2V0OkxheWEuU3ByaXRlM0Q9bnVsbDtcclxuICAgICAgICBpZih0YXJnZXROYW1lKXtcclxuICAgICAgICAgICAgdmFyIHRlbXBPYmo9V215VXRpbHMzRC5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSk7XHJcbiAgICAgICAgICAgIGlmKHRlbXBPYmope1xyXG4gICAgICAgICAgICAgICAgX3RhcmdldD1MYXlhLlNwcml0ZTNELmluc3RhbnRpYXRlKHRlbXBPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIF90YXJnZXQ9TGF5YS5TcHJpdGUzRC5pbnN0YW50aWF0ZSh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX3RhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa/gOa0u+mYtOW9seOAglxyXG4gICAgICogQHBhcmFtXHRkaXJlY3Rpb25MaWdodCDnm7Tnur/lhYlcclxuICAgICAqIEBwYXJhbVx0c2hhZG93UmVzb2x1dGlvbiDnlJ/miJDpmLTlvbHotLTlm77lsLrlr7hcclxuICAgICAqIEBwYXJhbVx0c2hhZG93UENGVHlwZSDmqKHns4rnrYnnuqcs6LaK5aSn6LaK6auYLOabtOiAl+aAp+iDvVxyXG4gICAgICogQHBhcmFtXHRzaGFkb3dEaXN0YW5jZSDlj6/op4HpmLTlvbHot53nprtcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBvblNldERpcmVjdGlvbkxpZ2h0KGRpcmVjdGlvbkxpZ2h0LHNoYWRvd1Jlc29sdXRpb249NTEyLHNoYWRvd1BDRlR5cGU9MSxzaGFkb3dEaXN0YW5jZTpudW1iZXI9MTUsaXNTaGFkb3c6Ym9vbGVhbj10cnVlKXtcclxuICAgICAgICBpZihkaXJlY3Rpb25MaWdodCBpbnN0YW5jZW9mIExheWEuRGlyZWN0aW9uTGlnaHQpe1xyXG4gICAgICAgICAgICAvL+eBr+WFieW8gOWQr+mYtOW9sVxyXG4gICAgICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgLy/lj6/op4HpmLTlvbHot53nprtcclxuICAgICAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93RGlzdGFuY2UgPSBzaGFkb3dEaXN0YW5jZTtcclxuICAgICAgICAgICAgLy/nlJ/miJDpmLTlvbHotLTlm77lsLrlr7hcclxuICAgICAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UmVzb2x1dGlvbiA9IHNoYWRvd1Jlc29sdXRpb247XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd1BTU01Db3VudD0xO1xyXG4gICAgICAgICAgICAvL+aooeeziuetiee6pyzotorlpKfotorpq5gs5pu06ICX5oCn6IO9XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd1BDRlR5cGUgPSBzaGFkb3dQQ0ZUeXBlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICog5r+A5rS76Zi05b2x44CCXHJcbiAgICAgKiBAcGFyYW1cdHRhcmdldCBcclxuICAgICAqIEBwYXJhbVx0dHlwZSAw5o6l5pS26Zi05b2xLDHkuqfnlJ/pmLTlvbEsMuaOpeaUtumYtOW9seS6p+eUn+mYtOW9sVxyXG4gICAgICogQHBhcmFtXHRpc1NoYWRvdyDmmK/lkKbpmLTlvbFcclxuICAgICAqIEBwYXJhbVx0aXNDaGlsZHJlbiDmmK/lkKblrZDlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBvbkNhc3RTaGFkb3codGFyZ2V0LHR5cGU9MCxpc1NoYWRvdz10cnVlLGlzQ2hpbGRyZW49dHJ1ZSl7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5NZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICB2YXIgbXMzRD0odGFyZ2V0IGFzIExheWEuTWVzaFNwcml0ZTNEKTtcclxuICAgICAgICAgICAgaWYodHlwZT09MCl7XHJcbiAgICAgICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodHlwZT09MSl7XHJcbiAgICAgICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodHlwZT09Mil7XHJcbiAgICAgICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLmNhc3RTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICB2YXIgc21zM2Q9KHRhcmdldCBhcyBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0QpO1xyXG4gICAgICAgICAgICBpZih0eXBlPT0wKXtcclxuICAgICAgICAgICAgICAgIHNtczNkLnNraW5uZWRNZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodHlwZT09MSl7XHJcbiAgICAgICAgICAgICAgICBzbXMzZC5za2lubmVkTWVzaFJlbmRlcmVyLmNhc3RTaGFkb3c9aXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGlzQ2hpbGRyZW4pe1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5udW1DaGlsZHJlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gdGFyZ2V0LmdldENoaWxkQXQoaSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2FzdFNoYWRvdyhvYmosdHlwZSxpc1NoYWRvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25TZXRTaGFkb3codGFyZ2V0LGlzQ2FzdFNoYWRvdyxpc1JlY2VpdmVTaGFkb3cpe1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgdGFyZ2V0Lm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNDYXN0U2hhZG93O1xyXG4gICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICB0YXJnZXQubWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1JlY2VpdmVTaGFkb3c7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgdGFyZ2V0LnNraW5uZWRNZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzQ2FzdFNoYWRvdztcclxuICAgICAgICAgICAgLy/mjqXmlLbpmLTlvbFcclxuICAgICAgICAgICAgdGFyZ2V0LnNraW5uZWRNZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzUmVjZWl2ZVNoYWRvdztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmdiMmhleChyLGcsYil7XHJcbiAgICAgICAgdmFyIF9oZXg9XCIjXCIgKyB0aGlzLmhleChyKSArdGhpcy4gaGV4KGcpICsgdGhpcy5oZXgoYik7XHJcbiAgICAgICAgcmV0dXJuIF9oZXgudG9VcHBlckNhc2UoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc3RhdGljIGhleCh4KXtcclxuICAgICAgICB4PXRoaXMub25OdW1Ubyh4KTtcclxuICAgICAgICByZXR1cm4gKFwiMFwiICsgcGFyc2VJbnQoeCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBoZXgycmdiKGhleDpzdHJpbmcpIHtcclxuICAgICAgICAvLyBFeHBhbmQgc2hvcnRoYW5kIGZvcm0gKGUuZy4gXCIwM0ZcIikgdG8gZnVsbCBmb3JtIChlLmcuIFwiMDAzM0ZGXCIpXHJcbiAgICAgICAgdmFyIHNob3J0aGFuZFJlZ2V4ID0gL14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaTtcclxuICAgICAgICBoZXggPSBoZXgucmVwbGFjZShzaG9ydGhhbmRSZWdleCwgZnVuY3Rpb24obSwgciwgZywgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gciArIHIgKyBnICsgZyArIGIgKyBiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQgPyB7XHJcbiAgICAgICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxyXG4gICAgICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcclxuICAgICAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcclxuICAgICAgICB9IDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25OdW1UbyhuKXtcclxuXHRcdGlmKChuK1wiXCIpLmluZGV4T2YoXCIuXCIpPj0wKXtcclxuXHRcdCAgICBuPXBhcnNlRmxvYXQobi50b0ZpeGVkKDIpKTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gbjtcclxuXHR9XHJcblxyXG4gICAgXHJcbiAgIHB1YmxpYyBzdGF0aWMgbGVycEYoYTpudW1iZXIsIGI6bnVtYmVyLCBzOm51bWJlcik6bnVtYmVye1xyXG4gICAgICAgIHJldHVybiAoYSArIChiIC0gYSkgKiBzKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmF5Q2FzdEFsbChjYW06TGF5YS5DYW1lcmEsIHZpZXdwb3J0UG9pbnQ6TGF5YS5WZWN0b3IyLCByYXk/OkxheWEuUmF5LCBjb2xsaXNvbkdyb3VwPzogbnVtYmVyLCBjb2xsaXNpb25NYXNrPzogbnVtYmVyKXtcclxuICAgICAgICB2YXIgX291dEhpdEFsbEluZm8gPSAgbmV3IEFycmF5PExheWEuSGl0UmVzdWx0PigpO1xyXG4gICAgICAgIHZhciBfcmF5ID1yYXk7XHJcbiAgICAgICAgaWYoIV9yYXkpe1xyXG4gICAgICAgICAgICBfcmF5ID0gbmV3IExheWEuUmF5KG5ldyBMYXlhLlZlY3RvcjMoKSwgbmV3IExheWEuVmVjdG9yMygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/ku47lsY/luZXnqbrpl7TnlJ/miJDlsITnur9cclxuICAgICAgICB2YXIgX3BvaW50ID0gdmlld3BvcnRQb2ludC5jbG9uZSgpO1xyXG4gICAgICAgIGNhbS52aWV3cG9ydFBvaW50VG9SYXkoX3BvaW50LCBfcmF5KTtcclxuICAgICAgICAvL+WwhOe6v+ajgOa1i+iOt+WPluaJgOacieajgOa1i+eisOaSnuWIsOeahOeJqeS9k1xyXG4gICAgICAgIGlmKGNhbS5zY2VuZSE9bnVsbCAmJiBjYW0uc2NlbmUucGh5c2ljc1NpbXVsYXRpb24hPW51bGwpe1xyXG4gICAgICAgICAgICBjYW0uc2NlbmUucGh5c2ljc1NpbXVsYXRpb24ucmF5Q2FzdEFsbChfcmF5LCBfb3V0SGl0QWxsSW5mbywgMTAwMDAsIGNvbGxpc29uR3JvdXAsIGNvbGxpc2lvbk1hc2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX291dEhpdEFsbEluZm87XHJcbiAgICB9XHJcblxyXG4gICAgLy/ot53nprtcclxuXHRwdWJsaWMgc3RhdGljIERpc3RhbmNlKGE6TGF5YS5WZWN0b3IyLGI6TGF5YS5WZWN0b3IyKTpudW1iZXIge1xyXG5cdFx0dmFyIGR4ID0gTWF0aC5hYnMoYS54IC0gYi54KTtcclxuXHRcdHZhciBkeSA9IE1hdGguYWJzKGEueSAtIGIueSk7XHJcblx0XHR2YXIgZD1NYXRoLnNxcnQoTWF0aC5wb3coZHgsIDIpICsgTWF0aC5wb3coZHksIDIpKTtcclxuXHRcdGQ9cGFyc2VGbG9hdChkLnRvRml4ZWQoMikpO1xyXG5cdFx0cmV0dXJuIGQ7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcblxyXG4gICAgLy/liqjnlLstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgcHVibGljIHN0YXRpYyBhbmlQbGF5KHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUsIG5vcm1hbGl6ZWRUaW1lPzpudW1iZXIsIGNvbXBsZXRlRXZlbnQ/OkxheWEuSGFuZGxlciwgcGFyYW1zPzpBcnJheTxhbnk+LCBsYXllckluZGV4PzogbnVtYmVyKTpMYXlhLkFuaW1hdG9ye1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYoY29tcGxldGVFdmVudCl7XHJcbiAgICAgICAgICAgIFdteVV0aWxzM0QuYW5pQWRkRXZlbnRGdW4odGFyZ2V0M2QsbnVsbCxhbmlOYW1lLC0xLGNvbXBsZXRlRXZlbnQsdHJ1ZSxwYXJhbXMsbGF5ZXJJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldDNkX2FuaS5wbGF5KGFuaU5hbWUsbGF5ZXJJbmRleCxub3JtYWxpemVkVGltZSk7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDNkX2FuaTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaUFkZEV2ZW50RnVuKHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUsdGltZTpudW1iZXIsY2FsbGJhY2s6TGF5YS5IYW5kbGVyLGlzRXZlbnRPbmU9dHJ1ZSxwYXJhbXM/OkFycmF5PGFueT4sbGF5ZXJJbmRleD86IG51bWJlcil7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBcclxuICAgICAgICBXbXlVdGlsczNELl9hbmlBZGRFdmVudCh0YXJnZXQzZF9hbmksbnVsbCxhbmlOYW1lLFwiX3dteV9hbmlfY2FsbGJhY2tcIix0aW1lLHBhcmFtcyxsYXllckluZGV4KTtcclxuICAgICAgICB2YXIgd2FlPXRhcmdldDNkLmdldENvbXBvbmVudChfX1dteUFuaUV2ZW50KSBhcyBfX1dteUFuaUV2ZW50O1xyXG4gICAgICAgIGlmKCF3YWUpe1xyXG4gICAgICAgICAgICB3YWU9dGFyZ2V0M2QuYWRkQ29tcG9uZW50KF9fV215QW5pRXZlbnQpIGFzIF9fV215QW5pRXZlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjYWxsYmFja05hbWU9XCJ3bXlfXCIrY2FsbGJhY2suY2FsbGVyLmlkK2FuaU5hbWUrdGltZTtcclxuICAgICAgICBpZihpc0V2ZW50T25lKXtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5vbmNlKGNhbGxiYWNrTmFtZSx0aGlzLChfY2FsbGJhY2tOYW1lLF9jYWxsYmFjayxwKT0+e1xyXG4gICAgICAgICAgICAgICAgX2NhbGxiYWNrLnJ1bldpdGgocCk7XHJcbiAgICAgICAgICAgICAgICB3YWUuZGVsQ2FsbGJhY2soX2NhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgICAgIH0sW2NhbGxiYWNrTmFtZSxjYWxsYmFja10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uKGNhbGxiYWNrTmFtZSx0aGlzLChfY2FsbGJhY2tOYW1lLF9jYWxsYmFjayxwKT0+e1xyXG4gICAgICAgICAgICAgICAgX2NhbGxiYWNrLnJ1bldpdGgocCk7XHJcbiAgICAgICAgICAgIH0sW2NhbGxiYWNrTmFtZSxjYWxsYmFja10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3YWUuYWRkQ2FsbGJhY2soY2FsbGJhY2tOYW1lKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBhbmlEZWxFdmVudEZ1bih0YXJnZXQsdGFyZ2V0TmFtZSxjYWxsYmFjazpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHdhZT10YXJnZXQzZC5nZXRDb21wb25lbnQoX19XbXlBbmlFdmVudCkgYXMgX19XbXlBbmlFdmVudDtcclxuICAgICAgICBpZih3YWUpe1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tOYW1lPVwid215X1wiK2NhbGxiYWNrLmNhbGxlci5uYW1lK2NhbGxiYWNrLm1ldGhvZC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uKGNhbGxiYWNrTmFtZSxjYWxsYmFjay5jYWxsZXIsY2FsbGJhY2subWV0aG9kKTtcclxuICAgICAgICAgICAgd2FlLmRlbENhbGxiYWNrKGNhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgX2FuaUFkZEV2ZW50KHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUsZXZlbnROYW1lOnN0cmluZyx0aW1lOm51bWJlcixwYXJhbXM/OkFycmF5PGFueT4sbGF5ZXJJbmRleD86IG51bWJlcik6TGF5YS5BbmltYXRvcntcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD1udWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9bnVsbDtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNwcml0ZTNEKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGFyZ2V0O1xyXG4gICAgICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRhcmdldDNkPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLkFuaW1hdG9yKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2RfYW5pPXRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2RfYW5pPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBhbmltYXRvclN0YXRlOkxheWEuQW5pbWF0b3JTdGF0ZT10YXJnZXQzZF9hbmkuZ2V0Q29udHJvbGxlckxheWVyKGxheWVySW5kZXgpLl9zdGF0ZXNNYXBbYW5pTmFtZV07XHJcbiAgICAgICAgaWYoYW5pbWF0b3JTdGF0ZT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgaXNBZGQ9dHJ1ZTtcclxuICAgICAgICB2YXIgZXZlbnRzPWFuaW1hdG9yU3RhdGUuX2NsaXAuX2V2ZW50cztcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBldmVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudDpMYXlhLkFuaW1hdGlvbkV2ZW50ID0gZXZlbnRzW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZihldmVudC5ldmVudE5hbWU9PWV2ZW50TmFtZSAmJiBhbmlFdmVudC50aW1lKXtcclxuICAgICAgICAgICAgICAgICAgICBpc0FkZD1mYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpc0FkZCl7XHJcbiAgICAgICAgICAgIHZhciBhbmlFdmVudD1uZXcgTGF5YS5BbmltYXRpb25FdmVudCgpO1xyXG4gICAgICAgICAgICBhbmlFdmVudC5ldmVudE5hbWU9ZXZlbnROYW1lO1xyXG4gICAgICAgICAgICB2YXIgY2xpcER1cmF0aW9uPWFuaW1hdG9yU3RhdGUuX2NsaXAuX2R1cmF0aW9uO1xyXG4gICAgICAgICAgICBpZih0aW1lPT0tMSl7XHJcbiAgICAgICAgICAgICAgICB0aW1lPWNsaXBEdXJhdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhbmlFdmVudC50aW1lPSB0aW1lIC8gY2xpcER1cmF0aW9uO1xyXG4gICAgICAgICAgICBhbmlFdmVudC5wYXJhbXM9cGFyYW1zO1xyXG4gICAgICAgICAgICBhbmltYXRvclN0YXRlLl9jbGlwLmFkZEV2ZW50KGFuaUV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDNkX2FuaTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaUFkZFNjcmlwdCh0YXJnZXQsdGFyZ2V0TmFtZSxhbmlOYW1lLHNjcmlwdD86YW55LGxheWVySW5kZXg/OiBudW1iZXIpOkxheWEuQW5pbWF0b3JTdGF0ZXtcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYodGFyZ2V0TmFtZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRhcmdldDNkPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldDNkPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgaWYodGFyZ2V0M2RfYW5pPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBhbmltYXRvclN0YXRlOkxheWEuQW5pbWF0b3JTdGF0ZT10YXJnZXQzZF9hbmkuZ2V0Q29udHJvbGxlckxheWVyKGxheWVySW5kZXgpLl9zdGF0ZXNNYXBbYW5pTmFtZV07XHJcbiAgICAgICAgaWYoYW5pbWF0b3JTdGF0ZT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBhbmltYXRvclN0YXRlLmFkZFNjcmlwdChzY3JpcHQpO1xyXG4gICAgICAgIHJldHVybiBhbmltYXRvclN0YXRlO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcblxyXG5cclxuY2xhc3MgX19XbXlBbmlFdmVudCBleHRlbmRzIExheWEuU2NyaXB0M0Qge1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2s9W107XHJcbiAgICBwdWJsaWMgYWRkQ2FsbGJhY2soY2FsbGJhY2tOYW1lKXtcclxuICAgICAgICB2YXIgaW5kZXhJZD10aGlzLl9jYWxsYmFjay5pbmRleE9mKGNhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgaWYoaW5kZXhJZDwwKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2sucHVzaChjYWxsYmFja05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBkZWxDYWxsYmFjayhjYWxsYmFja05hbWUpe1xyXG4gICAgICAgIHZhciBpbmRleElkPXRoaXMuX2NhbGxiYWNrLmluZGV4T2YoY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICBpZihpbmRleElkPj0wKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2suc3BsaWNlKGluZGV4SWQsMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIF93bXlfYW5pX2NhbGxiYWNrKHBhcmFtcz86QXJyYXk8YW55Pil7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jYWxsYmFjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja05hbWUgPSB0aGlzLl9jYWxsYmFja1tpXTtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChjYWxsYmFja05hbWUscGFyYW1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gXCIuLi9XbXlTY3JpcHQzRFwiO1xyXG5pbXBvcnQgeyBXbXlVdGlsczNEIH0gZnJvbSBcIi4uL1dteVV0aWxzM0RcIjtcclxuaW1wb3J0IHsgV215VXRpbHMgfSBmcm9tIFwiLi4vLi4vV215VXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteUM0RFZldGV4QW5pbWF0b3IgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XHJcbiAgICBfYW5pcjpMYXlhLkFuaW1hdG9yO1xyXG4gICAgX3ZlcnRpY2VzT2JqOkxheWEuU3ByaXRlM0Q7XHJcbiAgICBvbkF3YWtlKCl7XHJcbiAgICAgICAgdGhpcy5fYW5pcj10aGlzLm93bmVyM0QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FuaXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdGhpcy5vd25lcjNELm9uKFwiYW5pX3BsYXlcIix0aGlzLHRoaXMub25QbGF5KTtcclxuXHJcbiAgICAgICAgdmFyIG9ianM9dGhpcy5fYW5pci5fcmVuZGVyYWJsZVNwcml0ZXM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZXRleFQ9bnVsbDtcclxuICAgICAgICAgICAgY29uc3QgbWVzaE9iaiA9IG9ianNbaV07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWVzaE9iai5udW1DaGlsZHJlbjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjT2JqID0gbWVzaE9iai5nZXRDaGlsZEF0KGkpO1xyXG4gICAgICAgICAgICAgICAgaWYoY09iai5uYW1lLmluZGV4T2YoXCJWZXRleF9IYW5kbGVcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHZldGV4VD1jT2JqO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHZldGV4VCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92ZXJ0aWNlc09iaj12ZXRleFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9tZXNoT2JqLl9yZW5kZXIuZW5hYmxlPWZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fdmVydGljZXNPYmogPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vbkluaXRWZXJ0ZXgoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBvblBsYXkobj1cInBsYXlcIix0PTAsc3BlZWQ9MSl7XHJcbiAgICAvLyAgICAgdmFyIG9ianM9dGhpcy5fYW5pci5fcmVuZGVyYWJsZVNwcml0ZXM7XHJcbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvLyAgICAgICAgIGNvbnN0IG1lc2hPYmogPSBvYmpzW2ldO1xyXG4gICAgLy8gICAgICAgICAvL21lc2hPYmouX3JlbmRlci5lbmFibGU9dHJ1ZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIHRoaXMuX2FuaXIucGxheShuLHVuZGVmaW5lZCx0KTtcclxuICAgIC8vICAgICB0aGlzLl9hbmlyLnNwZWVkPXNwZWVkO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8v6aG254K5LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIF9tZXNoOkxheWEuTWVzaEZpbHRlcjtcclxuICAgIF9zaGFyZWRNZXNoOmFueTtcclxuXHJcbiAgICBfdmVydGV4QnVmZmVyczpBcnJheTxMYXlhLlZlcnRleEJ1ZmZlcjNEPjtcclxuICAgIF92ZXJ0ZXhBcnJheTpBcnJheTxMYXlhLlRyYW5zZm9ybTNEPjtcclxuICAgIF9tTWFwcGluZ1ZldGV4SW5mb0FycjpBcnJheTxhbnk+O1xyXG4gICAgX21DYWNoZVZlcnRpY2VzQXJyOkFycmF5PGFueT47XHJcblxyXG4gICAgb25Jbml0VmVydGV4KCl7XHJcbiAgICAgICAgdGhpcy5fbWVzaCA9IHRoaXMuX3ZlcnRpY2VzT2JqLnBhcmVudFtcIm1lc2hGaWx0ZXJcIl07XHJcbiAgICAgICAgaWYoIXRoaXMuX21lc2gpe1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fdmVydGljZXNPYmoubnVtQ2hpbGRyZW4+MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRleEFycmF5PVtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3ZlcnRpY2VzT2JqLm51bUNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRleEFycmF5W2ldID0gKHRoaXMuX3ZlcnRpY2VzT2JqLmdldENoaWxkQXQoaSkgYXMgTGF5YS5TcHJpdGUzRCkudHJhbnNmb3JtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCF0aGlzLl92ZXJ0ZXhBcnJheSl7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYT1bXTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl92ZXJ0ZXhCdWZmZXJzPXRoaXMuX21lc2guc2hhcmVkTWVzaFtcIl92ZXJ0ZXhCdWZmZXJzXCJdO1xyXG4gICAgICAgIHRoaXMuX3ZlcnRleEJ1ZmZlcnM9dGhpcy5fdmVydGV4QnVmZmVycy5jb25jYXQoKTtcclxuICAgICAgICB0aGlzLl9tZXNoLnNoYXJlZE1lc2hbXCJfdmVydGV4QnVmZmVyc1wiXT10aGlzLl92ZXJ0ZXhCdWZmZXJzO1xyXG4gICAgICBcclxuICAgICAgICB0aGlzLl9tQ2FjaGVWZXJ0aWNlc0FyciA9IHRoaXMuX21lc2guc2hhcmVkTWVzaC5fZ2V0UG9zaXRpb25zKCk7XHJcbiAgICAgICAgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnI9W107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdmVydGV4QXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl92ZXJ0ZXhBcnJheVtpXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyW2ldPXt9O1xyXG4gICAgICAgICAgICB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0FycltpXS5UcmFuc2Zvcm1JbmZvID0gaXRlbTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtSW5kZXhMaXN0PVtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9tQ2FjaGVWZXJ0aWNlc0Fyci5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZlcnRleFBvcyA9IHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyW2pdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGQ9TGF5YS5WZWN0b3IzLmRpc3RhbmNlKHZlcnRleFBvcyxpdGVtLmxvY2FsUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQgPD0wLjAxKXtcclxuICAgICAgICAgICAgICAgICAgICBtSW5kZXhMaXN0LnB1c2goaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyW2ldLlZldGV4SURBcnIgPSBtSW5kZXhMaXN0O1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBvbkxhdGVVcGRhdGUoKXtcclxuICAgICAgICBpZih0aGlzLl9hbmlyLnNwZWVkPT0wKXJldHVybjtcclxuICAgICAgICB2YXIgcGxheVN0YXRlPXRoaXMuX2FuaXIuZ2V0Q3VycmVudEFuaW1hdG9yUGxheVN0YXRlKCk7XHJcbiAgICAgICAgaWYocGxheVN0YXRlLl9maW5pc2gpcmV0dXJuO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0FycltpXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaXRlbS5WZXRleElEQXJyLmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmVydGV4SUQgPSBpdGVtLlZldGV4SURBcnJbal07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHBvcz0gaXRlbS5UcmFuc2Zvcm1JbmZvLmxvY2FsUG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tQ2FjaGVWZXJ0aWNlc0Fyclt2ZXJ0ZXhJRF0gPSBwb3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ZlcnRleHNfc2V0UG9zaXRpb25zKHRoaXMuX3ZlcnRleEJ1ZmZlcnMsdGhpcy5fbUNhY2hlVmVydGljZXNBcnIpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIF92ZXJ0ZXhzX2dldFBvc2l0aW9ucyh2ZXJ0ZXhCdWZmZXJzKXtcclxuXHRcdHZhciB2ZXJ0aWNlcz1bXTtcclxuXHRcdHZhciBpPTAsaj0wLHZlcnRleEJ1ZmZlcixwb3NpdGlvbkVsZW1lbnQsdmVydGV4RWxlbWVudHMsdmVydGV4RWxlbWVudCxvZnNldD0wLHZlcnRpY2VzRGF0YTtcclxuXHRcdHZhciB2ZXJ0ZXhCdWZmZXJDb3VudD12ZXJ0ZXhCdWZmZXJzLmxlbmd0aDtcclxuXHRcdGZvciAoaT0wO2kgPCB2ZXJ0ZXhCdWZmZXJDb3VudDtpKyspe1xyXG5cdFx0XHR2ZXJ0ZXhCdWZmZXI9dmVydGV4QnVmZmVyc1tpXTtcclxuXHRcdFx0dmVydGV4RWxlbWVudHM9dmVydGV4QnVmZmVyLnZlcnRleERlY2xhcmF0aW9uLnZlcnRleEVsZW1lbnRzO1xyXG5cdFx0XHRmb3IgKGo9MDtqIDwgdmVydGV4RWxlbWVudHMubGVuZ3RoO2orKyl7XHJcblx0XHRcdFx0dmVydGV4RWxlbWVudD12ZXJ0ZXhFbGVtZW50c1tqXTtcclxuXHRcdFx0XHRpZiAodmVydGV4RWxlbWVudC5lbGVtZW50Rm9ybWF0PT09LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleEVsZW1lbnRGb3JtYXQuVmVjdG9yMyovXCJ2ZWN0b3IzXCIgJiYgdmVydGV4RWxlbWVudC5lbGVtZW50VXNhZ2U9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9QT1NJVElPTjAqLzApe1xyXG5cdFx0XHRcdFx0cG9zaXRpb25FbGVtZW50PXZlcnRleEVsZW1lbnQ7XHJcblx0XHRcdFx0XHRicmVhayA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHZlcnRpY2VzRGF0YT12ZXJ0ZXhCdWZmZXIuZ2V0RGF0YSgpO1xyXG5cdFx0XHRmb3IgKGo9MDtqIDwgdmVydGljZXNEYXRhLmxlbmd0aDtqKz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4U3RyaWRlIC8gNCl7XHJcblx0XHRcdFx0b2ZzZXQ9aitwb3NpdGlvbkVsZW1lbnQub2Zmc2V0IC8gNDtcclxuXHRcdFx0XHR2ZXJ0aWNlcy5wdXNoKG5ldyBMYXlhLlZlY3RvcjModmVydGljZXNEYXRhW29mc2V0KzBdLHZlcnRpY2VzRGF0YVtvZnNldCsxXSx2ZXJ0aWNlc0RhdGFbb2ZzZXQrMl0pKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHZlcnRpY2VzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBfdmVydGV4c19zZXRQb3NpdGlvbnModmVydGV4QnVmZmVycyx2ZXJ0aWNlcyl7XHJcblx0XHR2YXIgaT0wLGo9MCx2ZXJ0ZXhCdWZmZXIscG9zaXRpb25FbGVtZW50LHZlcnRleEVsZW1lbnRzLHZlcnRleEVsZW1lbnQsb2ZzZXQ9MCx2ZXJ0aWNlc0RhdGEsdmVydGljZTtcclxuXHRcdHZhciB2ZXJ0ZXhCdWZmZXJDb3VudD12ZXJ0ZXhCdWZmZXJzLmxlbmd0aDtcclxuXHRcdGZvciAoaT0wO2kgPCB2ZXJ0ZXhCdWZmZXJDb3VudDtpKyspe1xyXG5cdFx0XHR2ZXJ0ZXhCdWZmZXI9dmVydGV4QnVmZmVyc1tpXTtcclxuXHRcdFx0dmVydGV4RWxlbWVudHM9dmVydGV4QnVmZmVyLnZlcnRleERlY2xhcmF0aW9uLnZlcnRleEVsZW1lbnRzO1xyXG5cdFx0XHRmb3IgKGo9MDtqIDwgdmVydGV4RWxlbWVudHMubGVuZ3RoO2orKyl7XHJcblx0XHRcdFx0dmVydGV4RWxlbWVudD12ZXJ0ZXhFbGVtZW50c1tqXTtcclxuXHRcdFx0XHRpZiAodmVydGV4RWxlbWVudC5lbGVtZW50Rm9ybWF0PT09LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleEVsZW1lbnRGb3JtYXQuVmVjdG9yMyovXCJ2ZWN0b3IzXCIgJiYgdmVydGV4RWxlbWVudC5lbGVtZW50VXNhZ2U9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9QT1NJVElPTjAqLzApe1xyXG5cdFx0XHRcdFx0cG9zaXRpb25FbGVtZW50PXZlcnRleEVsZW1lbnQ7XHJcblx0XHRcdFx0XHRicmVhayA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgICAgIHZlcnRpY2VzRGF0YT12ZXJ0ZXhCdWZmZXIuZ2V0RGF0YSgpO1xyXG4gICAgICAgICAgICB2YXIgbj0wO1xyXG5cdFx0XHRmb3IgKGo9MDtqIDwgdmVydGljZXNEYXRhLmxlbmd0aDtqKz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4U3RyaWRlIC8gNCl7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlPXZlcnRpY2VzW25dO1xyXG4gICAgICAgICAgICAgICAgb2ZzZXQ9aitwb3NpdGlvbkVsZW1lbnQub2Zmc2V0IC8gNDtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzRGF0YVtvZnNldCswXT12ZXJ0aWNlLng7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlc0RhdGFbb2ZzZXQrMV09dmVydGljZS55O1xyXG4gICAgICAgICAgICAgICAgdmVydGljZXNEYXRhW29mc2V0KzJdPXZlcnRpY2UuejtcclxuICAgICAgICAgICAgICAgIG4rKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2ZXJ0ZXhCdWZmZXIuc2V0RGF0YSh2ZXJ0aWNlc0RhdGEpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIG9uR2V0V29ybGRQb3ModGFyZ2V0LHBvcyl7XHJcbiAgICAgICAgdmFyIG91dFBvcz1uZXcgTGF5YS5WZWN0b3IzKCk7XHJcbiAgICAgICAgaWYgKHRhcmdldC5fcGFyZW50ICE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRQb3NpdGlvbj10YXJnZXQucGFyZW50LnRyYW5zZm9ybS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgTGF5YS5WZWN0b3IzLm11bHRpcGx5KHBvcyx0YXJnZXQucGFyZW50LnRyYW5zZm9ybS5zY2FsZSxMYXlhLlRyYW5zZm9ybTNEW1wiX3RlbXBWZWN0b3IzMFwiXSk7XHJcbiAgICAgICAgICAgIExheWEuVmVjdG9yMy50cmFuc2Zvcm1RdWF0KExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdLHRhcmdldC5wYXJlbnQudHJhbnNmb3JtLnJvdGF0aW9uLExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdKTtcclxuICAgICAgICAgICAgTGF5YS5WZWN0b3IzLmFkZChwYXJlbnRQb3NpdGlvbixMYXlhLlRyYW5zZm9ybTNEW1wiX3RlbXBWZWN0b3IzMFwiXSxvdXRQb3MpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgcG9zLmNsb25lVG8ob3V0UG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dFBvcztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gXCIuLi9XbXlTY3JpcHQzRFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215UGh5c2ljc19DaGFyYWN0ZXIgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XHJcblx0cHVibGljIG9uRGVsKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuY2hhcmFjdGVyIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYXJhY3Rlcj1udWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjaGFyYWN0ZXI6TGF5YS5DaGFyYWN0ZXJDb250cm9sbGVyO1xyXG5cclxuICAgIHB1YmxpYyBzcGVlZFYzPW5ldyBMYXlhLlZlY3RvcjMoKTtcclxuICAgIHB1YmxpYyBncmF2aXR5PW5ldyBMYXlhLlZlY3RvcjMoKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzR3JvdW5kZWQoKXtcclxuICAgICAgICBpZih0aGlzLmNoYXJhY3Rlcj09bnVsbClyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyLmlzR3JvdW5kZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uU3RhcnQoKXtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Jbml0KHJhZGl1cywgbGVuZ3RoLCBvcmllbnRhdGlvbixsb2NhbE9mZnNldFgsIGxvY2FsT2Zmc2V0WSwgbG9jYWxPZmZzZXRaKXtcclxuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IHRoaXMub3duZXIzRC5hZGRDb21wb25lbnQoTGF5YS5DaGFyYWN0ZXJDb250cm9sbGVyKTtcclxuXHRcdHZhciBzcGhlcmVTaGFwZTpMYXlhLkNhcHN1bGVDb2xsaWRlclNoYXBlID0gbmV3IExheWEuQ2Fwc3VsZUNvbGxpZGVyU2hhcGUocmFkaXVzLCBsZW5ndGgsIG9yaWVudGF0aW9uKTtcclxuICAgICAgICBzcGhlcmVTaGFwZS5sb2NhbE9mZnNldCA9bmV3IExheWEuVmVjdG9yMyhsb2NhbE9mZnNldFgsbG9jYWxPZmZzZXRZLGxvY2FsT2Zmc2V0Wik7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIuY29sbGlkZXJTaGFwZSA9IHNwaGVyZVNoYXBlO1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLmdyYXZpdHk9dGhpcy5ncmF2aXR5O1xyXG4gICAgICAgIC8vIHRoaXMuY2hhcmFjdGVyLl91cGRhdGVQaHlzaWNzVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgcHVibGljIGlzTG9ja01vdmU9ZmFsc2U7XHJcbiAgICBvblVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLmdyYXZpdHk9dGhpcy5ncmF2aXR5O1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLm1vdmUodGhpcy5zcGVlZFYzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbW92ZSh2MzpMYXlhLlZlY3RvcjMsbG9ja01vdmVUaW1lOm51bWJlcj0wKXtcclxuICAgICAgICB0aGlzLmlzTG9ja01vdmU9dHJ1ZTtcclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5tb3ZlKHYzKTtcclxuICAgICAgICBMYXlhLnRpbWVyLm9uY2UobG9ja01vdmVUaW1lKjEwMDAsdGhpcywoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmlzTG9ja01vdmU9ZmFsc2U7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIF91cGRhdGVQaHlzaWNzVHJhbnNmb3JtKCl7XHJcblx0XHQvL3ZhciBuYXRpdmVXb3JsZFRyYW5zZm9ybT10aGlzLmNoYXJhY3Rlci5fbmF0aXZlQ29sbGlkZXJPYmplY3QuZ2V0V29ybGRUcmFuc2Zvcm0oKTtcclxuXHRcdHRoaXMuY2hhcmFjdGVyLl9kZXJpdmVQaHlzaWNzVHJhbnNmb3JtYXRpb24odHJ1ZSk7IFxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFdFYXNlVHlwZSB9IGZyb20gXCIuL1dFYXNlVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdFYXNlTWFuYWdlciB7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX1BpT3ZlcjI6IG51bWJlciA9IE1hdGguUEkgKiAwLjU7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX1R3b1BpOiBudW1iZXIgPSBNYXRoLlBJICogMjtcclxuXHJcblx0cHVibGljIHN0YXRpYyBldmFsdWF0ZShlYXNlVHlwZTogbnVtYmVyLCB0aW1lOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIsIG92ZXJzaG9vdE9yQW1wbGl0dWRlOiBudW1iZXIsIHBlcmlvZDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdHN3aXRjaCAoZWFzZVR5cGUpIHtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuTGluZWFyOlxyXG5cdFx0XHRcdHJldHVybiB0aW1lIC8gZHVyYXRpb247XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlNpbmVJbjpcclxuXHRcdFx0XHRyZXR1cm4gLU1hdGguY29zKHRpbWUgLyBkdXJhdGlvbiAqIFdFYXNlTWFuYWdlci5fUGlPdmVyMikgKyAxO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5TaW5lT3V0OlxyXG5cdFx0XHRcdHJldHVybiBNYXRoLnNpbih0aW1lIC8gZHVyYXRpb24gKiBXRWFzZU1hbmFnZXIuX1BpT3ZlcjIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5TaW5lSW5PdXQ6XHJcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHRpbWUgLyBkdXJhdGlvbikgLSAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhZEluOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFkT3V0OlxyXG5cdFx0XHRcdHJldHVybiAtKHRpbWUgLz0gZHVyYXRpb24pICogKHRpbWUgLSAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhZEluT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoKC0tdGltZSkgKiAodGltZSAtIDIpIC0gMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkN1YmljSW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DdWJpY091dDpcclxuXHRcdFx0XHRyZXR1cm4gKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogdGltZSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DdWJpY0luT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRcdHJldHVybiAwLjUgKiAoKHRpbWUgLT0gMikgKiB0aW1lICogdGltZSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFydEluOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YXJ0T3V0OlxyXG5cdFx0XHRcdHJldHVybiAtKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogdGltZSAqIHRpbWUgLSAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhcnRJbk91dDpcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoKHRpbWUgLT0gMikgKiB0aW1lICogdGltZSAqIHRpbWUgLSAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVpbnRJbjpcclxuXHRcdFx0XHRyZXR1cm4gKHRpbWUgLz0gZHVyYXRpb24pICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVpbnRPdXQ6XHJcblx0XHRcdFx0cmV0dXJuICgodGltZSA9IHRpbWUgLyBkdXJhdGlvbiAtIDEpICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWludEluT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWUgKyAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRXhwb0luOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSA9PSAwKSA/IDAgOiBNYXRoLnBvdygyLCAxMCAqICh0aW1lIC8gZHVyYXRpb24gLSAxKSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkV4cG9PdXQ6XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gZHVyYXRpb24pIHJldHVybiAxO1xyXG5cdFx0XHRcdHJldHVybiAoLU1hdGgucG93KDIsIC0xMCAqIHRpbWUgLyBkdXJhdGlvbikgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRXhwb0luT3V0OlxyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IGR1cmF0aW9uKSByZXR1cm4gMTtcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqIE1hdGgucG93KDIsIDEwICogKHRpbWUgLSAxKSk7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgtTWF0aC5wb3coMiwgLTEwICogLS10aW1lKSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DaXJjSW46XHJcblx0XHRcdFx0cmV0dXJuIC0oTWF0aC5zcXJ0KDEgLSAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lKSAtIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DaXJjT3V0OlxyXG5cdFx0XHRcdHJldHVybiBNYXRoLnNxcnQoMSAtICh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQ2lyY0luT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHRpbWUgKiB0aW1lKSAtIDEpO1xyXG5cdFx0XHRcdHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAodGltZSAtPSAyKSAqIHRpbWUpICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkVsYXN0aWNJbjpcclxuXHRcdFx0XHR2YXIgczA6IG51bWJlcjtcclxuXHRcdFx0XHRpZiAodGltZSA9PSAwKSByZXR1cm4gMDtcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24pID09IDEpIHJldHVybiAxO1xyXG5cdFx0XHRcdGlmIChwZXJpb2QgPT0gMCkgcGVyaW9kID0gZHVyYXRpb24gKiAwLjM7XHJcblx0XHRcdFx0aWYgKG92ZXJzaG9vdE9yQW1wbGl0dWRlIDwgMSkge1xyXG5cdFx0XHRcdFx0b3ZlcnNob290T3JBbXBsaXR1ZGUgPSAxO1xyXG5cdFx0XHRcdFx0czAgPSBwZXJpb2QgLyA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHMwID0gcGVyaW9kIC8gV0Vhc2VNYW5hZ2VyLl9Ud29QaSAqIE1hdGguYXNpbigxIC8gb3ZlcnNob290T3JBbXBsaXR1ZGUpO1xyXG5cdFx0XHRcdHJldHVybiAtKG92ZXJzaG9vdE9yQW1wbGl0dWRlICogTWF0aC5wb3coMiwgMTAgKiAodGltZSAtPSAxKSkgKiBNYXRoLnNpbigodGltZSAqIGR1cmF0aW9uIC0gczApICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FbGFzdGljT3V0OlxyXG5cdFx0XHRcdHZhciBzMTogbnVtYmVyO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbikgPT0gMSkgcmV0dXJuIDE7XHJcblx0XHRcdFx0aWYgKHBlcmlvZCA9PSAwKSBwZXJpb2QgPSBkdXJhdGlvbiAqIDAuMztcclxuXHRcdFx0XHRpZiAob3ZlcnNob290T3JBbXBsaXR1ZGUgPCAxKSB7XHJcblx0XHRcdFx0XHRvdmVyc2hvb3RPckFtcGxpdHVkZSA9IDE7XHJcblx0XHRcdFx0XHRzMSA9IHBlcmlvZCAvIDQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgczEgPSBwZXJpb2QgLyBXRWFzZU1hbmFnZXIuX1R3b1BpICogTWF0aC5hc2luKDEgLyBvdmVyc2hvb3RPckFtcGxpdHVkZSk7XHJcblx0XHRcdFx0cmV0dXJuIChvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIC0xMCAqIHRpbWUpICogTWF0aC5zaW4oKHRpbWUgKiBkdXJhdGlvbiAtIHMxKSAqIFdFYXNlTWFuYWdlci5fVHdvUGkgLyBwZXJpb2QpICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkVsYXN0aWNJbk91dDpcclxuXHRcdFx0XHR2YXIgczogbnVtYmVyO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPT0gMikgcmV0dXJuIDE7XHJcblx0XHRcdFx0aWYgKHBlcmlvZCA9PSAwKSBwZXJpb2QgPSBkdXJhdGlvbiAqICgwLjMgKiAxLjUpO1xyXG5cdFx0XHRcdGlmIChvdmVyc2hvb3RPckFtcGxpdHVkZSA8IDEpIHtcclxuXHRcdFx0XHRcdG92ZXJzaG9vdE9yQW1wbGl0dWRlID0gMTtcclxuXHRcdFx0XHRcdHMgPSBwZXJpb2QgLyA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHMgPSBwZXJpb2QgLyBXRWFzZU1hbmFnZXIuX1R3b1BpICogTWF0aC5hc2luKDEgLyBvdmVyc2hvb3RPckFtcGxpdHVkZSk7XHJcblx0XHRcdFx0aWYgKHRpbWUgPCAxKSByZXR1cm4gLTAuNSAqIChvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIDEwICogKHRpbWUgLT0gMSkpICogTWF0aC5zaW4oKHRpbWUgKiBkdXJhdGlvbiAtIHMpICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkpO1xyXG5cdFx0XHRcdHJldHVybiBvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIC0xMCAqICh0aW1lIC09IDEpKSAqIE1hdGguc2luKCh0aW1lICogZHVyYXRpb24gLSBzKSAqIFdFYXNlTWFuYWdlci5fVHdvUGkgLyBwZXJpb2QpICogMC41ICsgMTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQmFja0luOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lICogKChvdmVyc2hvb3RPckFtcGxpdHVkZSArIDEpICogdGltZSAtIG92ZXJzaG9vdE9yQW1wbGl0dWRlKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQmFja091dDpcclxuXHRcdFx0XHRyZXR1cm4gKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogKChvdmVyc2hvb3RPckFtcGxpdHVkZSArIDEpICogdGltZSArIG92ZXJzaG9vdE9yQW1wbGl0dWRlKSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5CYWNrSW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiAodGltZSAqIHRpbWUgKiAoKChvdmVyc2hvb3RPckFtcGxpdHVkZSAqPSAoMS41MjUpKSArIDEpICogdGltZSAtIG92ZXJzaG9vdE9yQW1wbGl0dWRlKSk7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiAoKChvdmVyc2hvb3RPckFtcGxpdHVkZSAqPSAoMS41MjUpKSArIDEpICogdGltZSArIG92ZXJzaG9vdE9yQW1wbGl0dWRlKSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5Cb3VuY2VJbjpcclxuXHRcdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VJbih0aW1lLCBkdXJhdGlvbik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJvdW5jZU91dDpcclxuXHRcdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VPdXQodGltZSwgZHVyYXRpb24pO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5Cb3VuY2VJbk91dDpcclxuXHRcdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VJbk91dCh0aW1lLCBkdXJhdGlvbik7XHJcblxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHJldHVybiAtKHRpbWUgLz0gZHVyYXRpb24pICogKHRpbWUgLSAyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxufVxyXG5cclxuLy8vIFRoaXMgY2xhc3MgY29udGFpbnMgYSBDIyBwb3J0IG9mIHRoZSBlYXNpbmcgZXF1YXRpb25zIGNyZWF0ZWQgYnkgUm9iZXJ0IFBlbm5lciAoaHR0cDovL3JvYmVydHBlbm5lci5jb20vZWFzaW5nKS5cclxuZXhwb3J0IGNsYXNzIEJvdW5jZSB7XHJcblx0cHVibGljIHN0YXRpYyBlYXNlSW4odGltZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiAxIC0gQm91bmNlLmVhc2VPdXQoZHVyYXRpb24gLSB0aW1lLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGVhc2VPdXQodGltZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdGlmICgodGltZSAvPSBkdXJhdGlvbikgPCAoMSAvIDIuNzUpKSB7XHJcblx0XHRcdHJldHVybiAoNy41NjI1ICogdGltZSAqIHRpbWUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRpbWUgPCAoMiAvIDIuNzUpKSB7XHJcblx0XHRcdHJldHVybiAoNy41NjI1ICogKHRpbWUgLT0gKDEuNSAvIDIuNzUpKSAqIHRpbWUgKyAwLjc1KTtcclxuXHRcdH1cclxuXHRcdGlmICh0aW1lIDwgKDIuNSAvIDIuNzUpKSB7XHJcblx0XHRcdHJldHVybiAoNy41NjI1ICogKHRpbWUgLT0gKDIuMjUgLyAyLjc1KSkgKiB0aW1lICsgMC45Mzc1KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAoNy41NjI1ICogKHRpbWUgLT0gKDIuNjI1IC8gMi43NSkpICogdGltZSArIDAuOTg0Mzc1KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZWFzZUluT3V0KHRpbWU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRpZiAodGltZSA8IGR1cmF0aW9uICogMC41KSB7XHJcblx0XHRcdHJldHVybiBCb3VuY2UuZWFzZUluKHRpbWUgKiAyLCBkdXJhdGlvbikgKiAwLjU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gQm91bmNlLmVhc2VPdXQodGltZSAqIDIgLSBkdXJhdGlvbiwgZHVyYXRpb24pICogMC41ICsgMC41O1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBXRWFzZVR5cGUge1xyXG5cdHB1YmxpYyBzdGF0aWMgTGluZWFyOiBudW1iZXIgPSAwO1xyXG5cdHB1YmxpYyBzdGF0aWMgU2luZUluOiBudW1iZXIgPSAxO1xyXG5cdHB1YmxpYyBzdGF0aWMgU2luZU91dDogbnVtYmVyID0gMjtcclxuXHRwdWJsaWMgc3RhdGljIFNpbmVJbk91dDogbnVtYmVyID0gMztcclxuXHRwdWJsaWMgc3RhdGljIFF1YWRJbjogbnVtYmVyID0gNDtcclxuXHRwdWJsaWMgc3RhdGljIFF1YWRPdXQ6IG51bWJlciA9IDU7XHJcblx0cHVibGljIHN0YXRpYyBRdWFkSW5PdXQ6IG51bWJlciA9IDY7XHJcblx0cHVibGljIHN0YXRpYyBDdWJpY0luOiBudW1iZXIgPSA3O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ3ViaWNPdXQ6IG51bWJlciA9IDg7XHJcblx0cHVibGljIHN0YXRpYyBDdWJpY0luT3V0OiBudW1iZXIgPSA5O1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhcnRJbjogbnVtYmVyID0gMTA7XHJcblx0cHVibGljIHN0YXRpYyBRdWFydE91dDogbnVtYmVyID0gMTE7XHJcblx0cHVibGljIHN0YXRpYyBRdWFydEluT3V0OiBudW1iZXIgPSAxMjtcclxuXHRwdWJsaWMgc3RhdGljIFF1aW50SW46IG51bWJlciA9IDEzO1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVpbnRPdXQ6IG51bWJlciA9IDE0O1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVpbnRJbk91dDogbnVtYmVyID0gMTU7XHJcblx0cHVibGljIHN0YXRpYyBFeHBvSW46IG51bWJlciA9IDE2O1xyXG5cdHB1YmxpYyBzdGF0aWMgRXhwb091dDogbnVtYmVyID0gMTc7XHJcblx0cHVibGljIHN0YXRpYyBFeHBvSW5PdXQ6IG51bWJlciA9IDE4O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ2lyY0luOiBudW1iZXIgPSAxOTtcclxuXHRwdWJsaWMgc3RhdGljIENpcmNPdXQ6IG51bWJlciA9IDIwO1xyXG5cdHB1YmxpYyBzdGF0aWMgQ2lyY0luT3V0OiBudW1iZXIgPSAyMTtcclxuXHRwdWJsaWMgc3RhdGljIEVsYXN0aWNJbjogbnVtYmVyID0gMjI7XHJcblx0cHVibGljIHN0YXRpYyBFbGFzdGljT3V0OiBudW1iZXIgPSAyMztcclxuXHRwdWJsaWMgc3RhdGljIEVsYXN0aWNJbk91dDogbnVtYmVyID0gMjQ7XHJcblx0cHVibGljIHN0YXRpYyBCYWNrSW46IG51bWJlciA9IDI1O1xyXG5cdHB1YmxpYyBzdGF0aWMgQmFja091dDogbnVtYmVyID0gMjY7XHJcblx0cHVibGljIHN0YXRpYyBCYWNrSW5PdXQ6IG51bWJlciA9IDI3O1xyXG5cdHB1YmxpYyBzdGF0aWMgQm91bmNlSW46IG51bWJlciA9IDI4O1xyXG5cdHB1YmxpYyBzdGF0aWMgQm91bmNlT3V0OiBudW1iZXIgPSAyOTtcclxuXHRwdWJsaWMgc3RhdGljIEJvdW5jZUluT3V0OiBudW1iZXIgPSAzMDtcclxuXHRwdWJsaWMgc3RhdGljIEN1c3RvbTogbnVtYmVyID0gMzE7XHJcbn0iLCJpbXBvcnQgeyBXVHdlZW5lciB9IGZyb20gXCIuL1dUd2VlbmVyXCI7XHJcbmltcG9ydCB7IFdUd2Vlbk1hbmFnZXIgfSBmcm9tIFwiLi9XVHdlZW5NYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV1R3ZWVuIHtcclxuXHRwdWJsaWMgc3RhdGljIGNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcblx0cHVibGljIHN0YXRpYyB0byhzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3RvKHN0YXJ0LCBlbmQsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgdG8yKHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG8yKHN0YXJ0LCBzdGFydDIsIGVuZCwgZW5kMiwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB0bzMoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIHN0YXJ0MzogbnVtYmVyLFxyXG5cdFx0ZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZW5kMzogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG8zKHN0YXJ0LCBzdGFydDIsIHN0YXJ0MywgZW5kLCBlbmQyLCBlbmQzLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvNChzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgc3RhcnQzOiBudW1iZXIsIHN0YXJ0NDogbnVtYmVyLFxyXG5cdFx0ZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZW5kMzogbnVtYmVyLCBlbmQ0OiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90bzQoc3RhcnQsIHN0YXJ0Miwgc3RhcnQzLCBzdGFydDQsIGVuZCwgZW5kMiwgZW5kMywgZW5kNCwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB0b0NvbG9yKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG9Db2xvcihzdGFydCwgZW5kLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGRlbGF5ZWRDYWxsKGRlbGF5OiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLnNldERlbGF5KGRlbGF5KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgc2hha2Uoc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBhbXBsaXR1ZGU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3NoYWtlKHN0YXJ0WCwgc3RhcnRZLCBhbXBsaXR1ZGUsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgaXNUd2VlbmluZyh0YXJnZXQ6IE9iamVjdCwgcHJvcFR5cGU6IE9iamVjdCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuaXNUd2VlbmluZyh0YXJnZXQsIHByb3BUeXBlKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMga2lsbCh0YXJnZXQ6IE9iamVjdCwgY29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZSwgcHJvcFR5cGU6IE9iamVjdCA9IG51bGwpOiB2b2lkIHtcclxuXHRcdFdUd2Vlbk1hbmFnZXIua2lsbFR3ZWVucyh0YXJnZXQsIGZhbHNlLCBudWxsKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0VHdlZW4odGFyZ2V0OiBPYmplY3QsIHByb3BUeXBlOiBPYmplY3QgPSBudWxsKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuZ2V0VHdlZW4odGFyZ2V0LCBwcm9wVHlwZSk7XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBXVHdlZW5lciB9IGZyb20gXCIuL1dUd2VlbmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV1R3ZWVuTWFuYWdlciB7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX2FjdGl2ZVR3ZWVuczogYW55W10gPSBuZXcgQXJyYXkoMzApO1xyXG5cdHByaXZhdGUgc3RhdGljIF90d2VlbmVyUG9vbDogV1R3ZWVuZXJbXSA9IFtdO1xyXG5cdHByaXZhdGUgc3RhdGljIF90b3RhbEFjdGl2ZVR3ZWVuczogbnVtYmVyID0gMDtcclxuXHRwcml2YXRlIHN0YXRpYyBfaW5pdGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgY3JlYXRlVHdlZW4oKTogV1R3ZWVuZXIge1xyXG5cdFx0aWYgKCFXVHdlZW5NYW5hZ2VyLl9pbml0ZWQpIHtcclxuXHRcdFx0TGF5YS50aW1lci5mcmFtZUxvb3AoMSwgbnVsbCwgdGhpcy51cGRhdGUpO1xyXG5cdFx0XHRXVHdlZW5NYW5hZ2VyLl9pbml0ZWQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lcjtcclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3R3ZWVuZXJQb29sLmxlbmd0aDtcclxuXHRcdGlmIChjbnQgPiAwKSB7XHJcblx0XHRcdHR3ZWVuZXIgPSBXVHdlZW5NYW5hZ2VyLl90d2VlbmVyUG9vbC5wb3AoKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0dHdlZW5lciA9IG5ldyBXVHdlZW5lcigpO1xyXG5cdFx0dHdlZW5lci5faW5pdCgpO1xyXG5cdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW1dUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zKytdID0gdHdlZW5lcjtcclxuXHJcblx0XHRpZiAoV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMgPT0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aClcclxuXHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aCA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVucy5sZW5ndGggKyBNYXRoLmNlaWwoV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aCAqIDAuNSk7XHJcblxyXG5cdFx0cmV0dXJuIHR3ZWVuZXI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGlzVHdlZW5pbmcodGFyZ2V0OiBhbnksIHByb3BUeXBlOiBhbnkpOiBib29sZWFuIHtcclxuXHRcdGlmICh0YXJnZXQgPT0gbnVsbClcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHZhciBhbnlUeXBlOiBib29sZWFuID0gcHJvcFR5cGUgPT0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVuczsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgIT0gbnVsbCAmJiB0d2VlbmVyLnRhcmdldCA9PSB0YXJnZXQgJiYgIXR3ZWVuZXIuX2tpbGxlZFxyXG5cdFx0XHRcdCYmIChhbnlUeXBlIHx8IHR3ZWVuZXIuX3Byb3BUeXBlID09IHByb3BUeXBlKSlcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGtpbGxUd2VlbnModGFyZ2V0OiBhbnksIGNvbXBsZXRlZDogYm9vbGVhbj1mYWxzZSwgcHJvcFR5cGU6IGFueSA9bnVsbCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0dmFyIGZsYWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zO1xyXG5cdFx0dmFyIGFueVR5cGU6IGJvb2xlYW4gPSBwcm9wVHlwZSA9PSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgIT0gbnVsbCAmJiB0d2VlbmVyLnRhcmdldCA9PSB0YXJnZXQgJiYgIXR3ZWVuZXIuX2tpbGxlZFxyXG5cdFx0XHRcdCYmIChhbnlUeXBlIHx8IHR3ZWVuZXIuX3Byb3BUeXBlID09IHByb3BUeXBlKSkge1xyXG5cdFx0XHRcdHR3ZWVuZXIua2lsbChjb21wbGV0ZWQpO1xyXG5cdFx0XHRcdGZsYWcgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZsYWc7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGdldFR3ZWVuKHRhcmdldDogYW55LCBwcm9wVHlwZTogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHR2YXIgY250OiBudW1iZXIgPSBXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucztcclxuXHRcdHZhciBhbnlUeXBlOiBib29sZWFuID0gcHJvcFR5cGUgPT0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBjbnQ7IGkrKykge1xyXG5cdFx0XHR2YXIgdHdlZW5lcjogV1R3ZWVuZXIgPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV07XHJcblx0XHRcdGlmICh0d2VlbmVyICE9IG51bGwgJiYgdHdlZW5lci50YXJnZXQgPT0gdGFyZ2V0ICYmICF0d2VlbmVyLl9raWxsZWRcclxuXHRcdFx0XHQmJiAoYW55VHlwZSB8fCB0d2VlbmVyLl9wcm9wVHlwZSA9PSBwcm9wVHlwZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHdlZW5lcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB1cGRhdGUoKTogdm9pZCB7XHJcblx0XHR2YXIgZHQ6IG51bWJlciA9IExheWEudGltZXIuZGVsdGEgLyAxMDAwO1xyXG5cclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zO1xyXG5cdFx0dmFyIGZyZWVQb3NTdGFydDogbnVtYmVyID0gLTE7XHJcblx0XHR2YXIgZnJlZVBvc0NvdW50OiBudW1iZXIgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChmcmVlUG9zU3RhcnQgPT0gLTEpXHJcblx0XHRcdFx0XHRmcmVlUG9zU3RhcnQgPSBpO1xyXG5cdFx0XHRcdGZyZWVQb3NDb3VudCsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHR3ZWVuZXIuX2tpbGxlZCkge1xyXG5cdFx0XHRcdHR3ZWVuZXIuX3Jlc2V0KCk7XHJcblx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fdHdlZW5lclBvb2wucHVzaCh0d2VlbmVyKTtcclxuXHRcdFx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV0gPSBudWxsO1xyXG5cclxuXHRcdFx0XHRpZiAoZnJlZVBvc1N0YXJ0ID09IC0xKVxyXG5cdFx0XHRcdFx0ZnJlZVBvc1N0YXJ0ID0gaTtcclxuXHRcdFx0XHRmcmVlUG9zQ291bnQrKztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpZiAoIXR3ZWVuZXIuX3BhdXNlZClcclxuXHRcdFx0XHRcdHR3ZWVuZXIuX3VwZGF0ZShkdCk7XHJcblxyXG5cdFx0XHRcdGlmIChmcmVlUG9zU3RhcnQgIT0gLTEpIHtcclxuXHRcdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tmcmVlUG9zU3RhcnRdID0gdHdlZW5lcjtcclxuXHRcdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXSA9IG51bGw7XHJcblx0XHRcdFx0XHRmcmVlUG9zU3RhcnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZnJlZVBvc1N0YXJ0ID49IDApIHtcclxuXHRcdFx0aWYgKFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zICE9IGNudCkgLy9uZXcgdHdlZW5zIGFkZGVkXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgajogbnVtYmVyID0gY250O1xyXG5cdFx0XHRcdGNudCA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zIC0gY250O1xyXG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjbnQ7IGkrKylcclxuXHRcdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tmcmVlUG9zU3RhcnQrK10gPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaisrXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucyA9IGZyZWVQb3NTdGFydDtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgV1R3ZWVuVmFsdWUge1xyXG5cdHB1YmxpYyB4OiBudW1iZXI7XHJcblx0cHVibGljIHk6IG51bWJlcjtcclxuXHRwdWJsaWMgejogbnVtYmVyO1xyXG5cdHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gdGhpcy53ID0gMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgY29sb3IoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiAodGhpcy53IDw8IDI0KSArICh0aGlzLnggPDwgMTYpICsgKHRoaXMueSA8PCA4KSArIHRoaXMuejtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgY29sb3IodmFsdWU6IG51bWJlcikge1xyXG5cdFx0dGhpcy54ID0gKHZhbHVlICYgMHhGRjAwMDApID4+IDE2O1xyXG5cdFx0dGhpcy55ID0gKHZhbHVlICYgMHgwMEZGMDApID4+IDg7XHJcblx0XHR0aGlzLnogPSAodmFsdWUgJiAweDAwMDBGRik7XHJcblx0XHR0aGlzLncgPSAodmFsdWUgJiAweEZGMDAwMDAwKSA+PiAyNDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRGaWVsZChpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdHN3aXRjaCAoaW5kZXgpIHtcclxuXHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLng7XHJcblx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy55O1xyXG5cdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuejtcclxuXHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLnc7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5kZXggb3V0IG9mIGJvdW5kczogXCIgKyBpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RmllbGQoaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0c3dpdGNoIChpbmRleCkge1xyXG5cdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0dGhpcy54ID0gdmFsdWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHR0aGlzLnkgPSB2YWx1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdHRoaXMueiA9IHZhbHVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0dGhpcy53ID0gdmFsdWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5kZXggb3V0IG9mIGJvdW5kczogXCIgKyBpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0WmVybygpOiB2b2lkIHtcclxuXHRcdHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IHRoaXMudyA9IDA7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgV1R3ZWVuVmFsdWUgfSBmcm9tIFwiLi9XVHdlZW5WYWx1ZVwiO1xyXG5pbXBvcnQgeyBXRWFzZVR5cGUgfSBmcm9tIFwiLi9XRWFzZVR5cGVcIjtcclxuaW1wb3J0IHsgV1R3ZWVuIH0gZnJvbSBcIi4vV1R3ZWVuXCI7XHJcbmltcG9ydCB7IFdFYXNlTWFuYWdlciB9IGZyb20gXCIuL1dFYXNlTWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdUd2VlbmVyIHtcclxuXHRwdWJsaWMgX3RhcmdldDogYW55O1xyXG5cdHB1YmxpYyBfcHJvcFR5cGU6IGFueTtcclxuXHRwdWJsaWMgX2tpbGxlZDogYm9vbGVhbjtcclxuXHRwdWJsaWMgX3BhdXNlZDogYm9vbGVhbjtcclxuXHJcblx0cHJpdmF0ZSBfZGVsYXk6IG51bWJlcjtcclxuXHRwcml2YXRlIF9kdXJhdGlvbjogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2JyZWFrcG9pbnQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF9lYXNlVHlwZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2Vhc2VPdmVyc2hvb3RPckFtcGxpdHVkZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2Vhc2VQZXJpb2Q6IG51bWJlcjtcclxuXHRwcml2YXRlIF9yZXBlYXQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF95b3lvOiBib29sZWFuO1xyXG5cdHByaXZhdGUgX3RpbWVTY2FsZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3NuYXBwaW5nOiBib29sZWFuO1xyXG5cdHByaXZhdGUgX3VzZXJEYXRhOiBhbnk7XHJcblxyXG5cdHByaXZhdGUgX29uVXBkYXRlOiBGdW5jdGlvbjtcclxuXHRwcml2YXRlIF9vblVwZGF0ZUNhbGxlcjogYW55O1xyXG5cdHByaXZhdGUgX29uU3RhcnQ6IEZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgX29uU3RhcnRDYWxsZXI6IGFueTtcclxuXHRwcml2YXRlIF9vbkNvbXBsZXRlOiBGdW5jdGlvbjtcclxuXHRwcml2YXRlIF9vbkNvbXBsZXRlQ2FsbGVyOiBhbnk7XHJcblxyXG5cdHByaXZhdGUgX3N0YXJ0VmFsdWU6IFdUd2VlblZhbHVlO1xyXG5cdHByaXZhdGUgX2VuZFZhbHVlOiBXVHdlZW5WYWx1ZTtcclxuXHRwcml2YXRlIF92YWx1ZTogV1R3ZWVuVmFsdWU7XHJcblx0cHJpdmF0ZSBfZGVsdGFWYWx1ZTogV1R3ZWVuVmFsdWU7XHJcblx0cHJpdmF0ZSBfdmFsdWVTaXplOiBudW1iZXI7XHJcblxyXG5cdHByaXZhdGUgX3N0YXJ0ZWQ6IGJvb2xlYW47XHJcblx0cHVibGljIF9lbmRlZDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2VsYXBzZWRUaW1lOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfbm9ybWFsaXplZFRpbWU6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlID0gbmV3IFdUd2VlblZhbHVlKCk7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZSA9IG5ldyBXVHdlZW5WYWx1ZSgpO1xyXG5cdFx0dGhpcy5fdmFsdWUgPSBuZXcgV1R3ZWVuVmFsdWUoKTtcclxuXHRcdHRoaXMuX2RlbHRhVmFsdWUgPSBuZXcgV1R3ZWVuVmFsdWUoKTtcclxuXHJcblx0XHR0aGlzLl9yZXNldCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldERlbGF5KHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9kZWxheSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGRlbGF5KCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGVsYXk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RHVyYXRpb24odmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZHVyYXRpb24oKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9kdXJhdGlvbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRCcmVha3BvaW50KHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9icmVha3BvaW50ID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRFYXNlKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9lYXNlVHlwZSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RWFzZVBlcmlvZCh2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fZWFzZVBlcmlvZCA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9lYXNlT3ZlcnNob290T3JBbXBsaXR1ZGUgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFJlcGVhdChyZXBlYXQ6IG51bWJlciwgeW95bzogYm9vbGVhbiA9IGZhbHNlKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fcmVwZWF0ID0gdGhpcy5yZXBlYXQ7XHJcblx0XHR0aGlzLl95b3lvID0geW95bztcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCByZXBlYXQoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9yZXBlYXQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0VGltZVNjYWxlKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl90aW1lU2NhbGUgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFNuYXBwaW5nKHZhbHVlOiBib29sZWFuKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fc25hcHBpbmcgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFRhcmdldCh2YWx1ZTogYW55LCBwcm9wVHlwZTogYW55ID0gbnVsbCk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3RhcmdldCA9IHRoaXMudmFsdWU7XHJcblx0XHR0aGlzLl9wcm9wVHlwZSA9IHByb3BUeXBlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHRhcmdldCgpOiBhbnkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3RhcmdldDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRVc2VyRGF0YSh2YWx1ZTogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdXNlckRhdGEgPSB0aGlzLnZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHVzZXJEYXRhKCk6IGFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdXNlckRhdGE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgb25VcGRhdGUoY2FsbGJhY2s6IEZ1bmN0aW9uLCBjYWxsZXI6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX29uVXBkYXRlID0gY2FsbGJhY2s7XHJcblx0XHR0aGlzLl9vblVwZGF0ZUNhbGxlciA9IGNhbGxlcjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uU3RhcnQoY2FsbGJhY2s6IEZ1bmN0aW9uLCBjYWxsZXI6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX29uU3RhcnQgPSBjYWxsYmFjaztcclxuXHRcdHRoaXMuX29uU3RhcnRDYWxsZXIgPSBjYWxsZXI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBvbkNvbXBsZXRlKGNhbGxiYWNrOiBGdW5jdGlvbiwgY2FsbGVyOiBhbnkpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9vbkNvbXBsZXRlID0gY2FsbGJhY2s7XHJcblx0XHR0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyID0gY2FsbGVyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHN0YXJ0VmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGVuZFZhbHVlKCk6IFdUd2VlblZhbHVlIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbmRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBkZWx0YVZhbHVlKCk6IFdUd2VlblZhbHVlIHtcclxuXHRcdHJldHVybiB0aGlzLl9kZWx0YVZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBub3JtYWxpemVkVGltZSgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25vcm1hbGl6ZWRUaW1lO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBjb21wbGV0ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZW5kZWQgIT0gMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgYWxsQ29tcGxldGVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VuZGVkID09IDE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0UGF1c2VkKHBhdXNlZDogYm9vbGVhbik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3BhdXNlZCA9IHBhdXNlZDtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIHRoaXMuc2VlayBwb3NpdGlvbiBvZiB0aGUgdHdlZW4sIGluIHNlY29uZHMuXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzZWVrKHRpbWU6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2tpbGxlZClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGltZTtcclxuXHRcdGlmICh0aGlzLl9lbGFwc2VkVGltZSA8IHRoaXMuX2RlbGF5KSB7XHJcblx0XHRcdGlmICh0aGlzLl9zdGFydGVkKVxyXG5cdFx0XHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGhpcy5fZGVsYXk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGUoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBraWxsKGNvbXBsZXRlOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9raWxsZWQpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRpZiAoY29tcGxldGUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2VuZGVkID09IDApIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fYnJlYWtwb2ludCA+PSAwKVxyXG5cdFx0XHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aGlzLl9kZWxheSArIHRoaXMuX2JyZWFrcG9pbnQ7XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5fcmVwZWF0ID49IDApXHJcblx0XHRcdFx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IHRoaXMuX2RlbGF5ICsgdGhpcy5fZHVyYXRpb24gKiAodGhpcy5fcmVwZWF0ICsgMSk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aGlzLl9kZWxheSArIHRoaXMuX2R1cmF0aW9uICogMjtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmNhbGxDb21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fa2lsbGVkID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG8oc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAxO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF90bzIoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAyO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnQyO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueSA9IGVuZDI7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvMyhzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgc3RhcnQzOiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAzO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnQyO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueSA9IGVuZDI7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnogPSBzdGFydDM7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS56ID0gZW5kMztcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG80KHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBzdGFydDM6IG51bWJlciwgc3RhcnQ0OiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGVuZDQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnggPSBlbmQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnkgPSBzdGFydDI7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS55ID0gZW5kMjtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueiA9IHN0YXJ0MztcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnogPSBlbmQzO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS53ID0gc3RhcnQ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUudyA9IGVuZDQ7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvQ29sb3Ioc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSA0O1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS5jb2xvciA9IHN0YXJ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUuY29sb3IgPSBlbmQ7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3NoYWtlKHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgYW1wbGl0dWRlOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSA1O1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnRYO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnRZO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS53ID0gYW1wbGl0dWRlO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHRoaXMuX2Vhc2VUeXBlID0gV0Vhc2VUeXBlLkxpbmVhcjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9pbml0KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fZGVsYXkgPSAwO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSAwO1xyXG5cdFx0dGhpcy5fYnJlYWtwb2ludCA9IC0xO1xyXG5cdFx0dGhpcy5fZWFzZVR5cGUgPSBXRWFzZVR5cGUuUXVhZE91dDtcclxuXHRcdHRoaXMuX3RpbWVTY2FsZSA9IDE7XHJcblx0XHR0aGlzLl9lYXNlUGVyaW9kID0gMDtcclxuXHRcdHRoaXMuX2Vhc2VPdmVyc2hvb3RPckFtcGxpdHVkZSA9IDEuNzAxNTg7XHJcblx0XHR0aGlzLl9zbmFwcGluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fcmVwZWF0ID0gMDtcclxuXHRcdHRoaXMuX3lveW8gPSBmYWxzZTtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDA7XHJcblx0XHR0aGlzLl9zdGFydGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLl9wYXVzZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuX2tpbGxlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSAwO1xyXG5cdFx0dGhpcy5fbm9ybWFsaXplZFRpbWUgPSAwO1xyXG5cdFx0dGhpcy5fZW5kZWQgPSAwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9yZXNldCgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3RhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLl91c2VyRGF0YSA9IG51bGw7XHJcblx0XHR0aGlzLl9vblN0YXJ0ID0gdGhpcy5fb25VcGRhdGUgPSB0aGlzLl9vbkNvbXBsZXRlID0gbnVsbDtcclxuXHRcdHRoaXMuX29uU3RhcnRDYWxsZXIgPSB0aGlzLl9vblVwZGF0ZUNhbGxlciA9IHRoaXMuX29uQ29tcGxldGVDYWxsZXIgPSBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF91cGRhdGUoZHQ6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX3RpbWVTY2FsZSAhPSAxKVxyXG5cdFx0XHRkdCAqPSB0aGlzLl90aW1lU2NhbGU7XHJcblx0XHRpZiAoZHQgPT0gMClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmICh0aGlzLl9lbmRlZCAhPSAwKSAvL01heWJlIHRoaXMuY29tcGxldGVkIGJ5IHRoaXMuc2Vla1xyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLmNhbGxDb21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHRcdHRoaXMuX2tpbGxlZCA9IHRydWU7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9lbGFwc2VkVGltZSArPSBkdDtcclxuXHRcdHRoaXMudXBkYXRlKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2VuZGVkICE9IDApIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9raWxsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmNhbGxDb21wbGV0ZUNhbGxiYWNrKCk7XHJcblx0XHRcdFx0dGhpcy5fa2lsbGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHVwZGF0ZShkdD86IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYoZHQhPW51bGwpe1xyXG5cdFx0XHRpZiAodGhpcy5fdGltZVNjYWxlICE9IDEpXHJcblx0XHRcdFx0ZHQgKj0gdGhpcy5fdGltZVNjYWxlO1xyXG5cdFx0XHRpZiAoZHQgPT0gMClcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHR0aGlzLl9lbGFwc2VkVGltZSArPSBkdDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9lbmRlZCA9IDA7XHJcblx0XHR2YXIgX2R1cmF0aW9uPXRoaXMuX2R1cmF0aW9uO1xyXG5cdFx0aWYgKHRoaXMuX3ZhbHVlU2l6ZSA9PSAwKSAvL0RlbGF5ZWRDYWxsXHJcblx0XHR7XHJcblx0XHRcdGlmICh0aGlzLl9lbGFwc2VkVGltZSA+PSB0aGlzLl9kZWxheSArIF9kdXJhdGlvbilcclxuXHRcdFx0XHR0aGlzLl9lbmRlZCA9IDE7XHJcblxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9zdGFydGVkKSB7XHJcblx0XHRcdGlmICh0aGlzLl9lbGFwc2VkVGltZSA8IHRoaXMuX2RlbGF5KVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdHRoaXMuX3N0YXJ0ZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmNhbGxTdGFydENhbGxiYWNrKCk7XHJcblx0XHRcdGlmICh0aGlzLl9raWxsZWQpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciByZXZlcnNlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0dmFyIHR0OiBudW1iZXIgPSB0aGlzLl9lbGFwc2VkVGltZSAtIHRoaXMuX2RlbGF5O1xyXG5cdFx0aWYgKHRoaXMuX2JyZWFrcG9pbnQgPj0gMCAmJiB0dCA+PSB0aGlzLl9icmVha3BvaW50KSB7XHJcblx0XHRcdHR0ID0gdGhpcy5fYnJlYWtwb2ludDtcclxuXHRcdFx0dGhpcy5fZW5kZWQgPSAyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9yZXBlYXQgIT0gMCkge1xyXG5cdFx0XHR2YXIgcm91bmQ6IG51bWJlciA9IE1hdGguZmxvb3IodHQgLyBfZHVyYXRpb24pO1xyXG5cdFx0XHR0dCAtPSBfZHVyYXRpb24gKiByb3VuZDtcclxuXHRcdFx0aWYgKHRoaXMuX3lveW8pXHJcblx0XHRcdFx0cmV2ZXJzZWQgPSByb3VuZCAlIDIgPT0gMTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9yZXBlYXQgPiAwICYmIHRoaXMuX3JlcGVhdCAtIHJvdW5kIDwgMCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLl95b3lvKVxyXG5cdFx0XHRcdFx0cmV2ZXJzZWQgPSB0aGlzLl9yZXBlYXQgJSAyID09IDE7XHJcblx0XHRcdFx0dHQgPSBfZHVyYXRpb247XHJcblx0XHRcdFx0dGhpcy5fZW5kZWQgPSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0dCA+PSBfZHVyYXRpb24pIHtcclxuXHRcdFx0dHQgPSBfZHVyYXRpb247XHJcblx0XHRcdHRoaXMuX2VuZGVkID0gMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9ub3JtYWxpemVkVGltZSA9IFdFYXNlTWFuYWdlci5ldmFsdWF0ZSh0aGlzLl9lYXNlVHlwZSwgcmV2ZXJzZWQgPyAoX2R1cmF0aW9uIC0gdHQpIDogdHQsIF9kdXJhdGlvbixcclxuXHRcdFx0dGhpcy5fZWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlLCB0aGlzLl9lYXNlUGVyaW9kKTtcclxuXHJcblx0XHR0aGlzLl92YWx1ZS5zZXRaZXJvKCk7XHJcblx0XHR0aGlzLl9kZWx0YVZhbHVlLnNldFplcm8oKTtcclxuXHJcblx0XHRpZiAodGhpcy5fdmFsdWVTaXplID09IDUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2VuZGVkID09IDApIHtcclxuXHRcdFx0XHR2YXIgcjogbnVtYmVyID0gdGhpcy5fc3RhcnRWYWx1ZS53ICogKDEgLSB0aGlzLl9ub3JtYWxpemVkVGltZSk7XHJcblx0XHRcdFx0dmFyIHJ4OiBudW1iZXIgPSAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIHI7XHJcblx0XHRcdFx0dmFyIHJ5OiBudW1iZXIgPSAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIHI7XHJcblx0XHRcdFx0cnggPSByeCA+IDAgPyBNYXRoLmNlaWwocngpIDogTWF0aC5mbG9vcihyeCk7XHJcblx0XHRcdFx0cnkgPSByeSA+IDAgPyBNYXRoLmNlaWwocnkpIDogTWF0aC5mbG9vcihyeSk7XHJcblxyXG5cdFx0XHRcdHRoaXMuX2RlbHRhVmFsdWUueCA9IHJ4O1xyXG5cdFx0XHRcdHRoaXMuX2RlbHRhVmFsdWUueSA9IHJ5O1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnggPSB0aGlzLl9zdGFydFZhbHVlLnggKyByeDtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS55ID0gdGhpcy5fc3RhcnRWYWx1ZS55ICsgcnk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUueCA9IHRoaXMuX3N0YXJ0VmFsdWUueDtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS55ID0gdGhpcy5fc3RhcnRWYWx1ZS55O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuX3ZhbHVlU2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0dmFyIG4xOiBudW1iZXIgPSB0aGlzLl9zdGFydFZhbHVlLmdldEZpZWxkKGkpO1xyXG5cdFx0XHRcdHZhciBuMjogbnVtYmVyID0gdGhpcy5fZW5kVmFsdWUuZ2V0RmllbGQoaSk7XHJcblx0XHRcdFx0dmFyIGY6IG51bWJlciA9IG4xICsgKG4yIC0gbjEpICogdGhpcy5fbm9ybWFsaXplZFRpbWU7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3NuYXBwaW5nKVxyXG5cdFx0XHRcdFx0ZiA9IE1hdGgucm91bmQoZik7XHJcblx0XHRcdFx0dGhpcy5fZGVsdGFWYWx1ZS5zZXRGaWVsZChpLCBmIC0gdGhpcy5fdmFsdWUuZ2V0RmllbGQoaSkpO1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnNldEZpZWxkKGksIGYpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3RhcmdldCAhPSBudWxsICYmIHRoaXMuX3Byb3BUeXBlICE9IG51bGwpIHtcclxuXHRcdFx0aWYgKHRoaXMuX3Byb3BUeXBlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHRoaXMuX3ZhbHVlU2l6ZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSwgdGhpcy5fdmFsdWUueik7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA0OlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSwgdGhpcy5fdmFsdWUueiwgdGhpcy5fdmFsdWUudyk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA1OlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUuY29sb3IpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNjpcclxuXHRcdFx0XHRcdFx0dGhpcy5fcHJvcFR5cGUuY2FsbCh0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnkpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodGhpcy5fcHJvcFR5cGUgaW5zdGFuY2VvZiBMYXlhLkhhbmRsZXIpIHtcclxuXHRcdFx0XHR2YXIgYXJyPVtdO1xyXG5cdFx0XHRcdHN3aXRjaCAodGhpcy5fdmFsdWVTaXplKSB7XHJcblx0XHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDQ6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56LCB0aGlzLl92YWx1ZS53XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDU6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS5jb2xvcl07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA2OlxyXG5cdFx0XHRcdFx0XHRhcnI9W3RoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueV07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5ydW5XaXRoKGFycik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3ZhbHVlU2l6ZSA9PSA1KVxyXG5cdFx0XHRcdFx0dGhpcy5fdGFyZ2V0W3RoaXMuX3Byb3BUeXBlXSA9IHRoaXMuX3ZhbHVlLmNvbG9yO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHRoaXMuX3RhcmdldFt0aGlzLl9wcm9wVHlwZV0gPSB0aGlzLl92YWx1ZS54O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jYWxsVXBkYXRlQ2FsbGJhY2soKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY2FsbFN0YXJ0Q2FsbGJhY2soKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fb25TdGFydCAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChXVHdlZW4uY2F0Y2hDYWxsYmFja0V4Y2VwdGlvbnMpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dGhpcy5fb25TdGFydC5jYWxsKHRoaXMuX29uU3RhcnRDYWxsZXIsIHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkZhaXJ5R1VJOiBlcnJvciBpbiBzdGFydCBjYWxsYmFjayA+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhpcy5fb25TdGFydC5jYWxsKHRoaXMuX29uU3RhcnRDYWxsZXIsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjYWxsVXBkYXRlQ2FsbGJhY2soKSB7XHJcblx0XHRpZiAodGhpcy5fb25VcGRhdGUgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAoV1R3ZWVuLmNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXMuX29uVXBkYXRlLmNhbGwodGhpcy5fb25VcGRhdGVDYWxsZXIsIHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkZhaXJ5R1VJOiBlcnJvciBpbiB0aGlzLnVwZGF0ZSBjYWxsYmFjayA+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhpcy5fb25VcGRhdGUuY2FsbCh0aGlzLl9vblVwZGF0ZUNhbGxlciwgdGhpcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNhbGxDb21wbGV0ZUNhbGxiYWNrKCkge1xyXG5cdFx0aWYgKHRoaXMuX29uQ29tcGxldGUgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAoV1R3ZWVuLmNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXMuX29uQ29tcGxldGUuY2FsbCh0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyLCB0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJGYWlyeUdVSTogZXJyb3IgaW4gY29tcGxldGUgY2FsbGJhY2sgPiBcIiArIGVyci5tZXNzYWdlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRoaXMuX29uQ29tcGxldGUuY2FsbCh0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyLCB0aGlzKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteU1hdENvbmZpZyB7XG5cbiAgICBwdWJsaWMgc3RhdGljIG1hdENvbmZpZz1bXTtcbn1cbiIsIi8qd21554mI5pysXzIwMTgvMS8zLzE5LjMxKi9cclxuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XHJcbmltcG9ydCBXbXlNYXRDb25maWcgZnJvbSAnLi9XbXlNYXRDb25maWcnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlNYXRNYWcgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XHJcbiAgICBwdWJsaWMgb25Bd2FrZSgpIHtcclxuICAgICAgICB2YXIgc2hhZGVyTWFnPXJlcXVpcmUoJy4uL3dteVNoYWRlcnMvV215U2hhZGVyTWFnJylbJ2RlZmF1bHQnXTtpZihzaGFkZXJNYWcpbmV3IHNoYWRlck1hZygpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgV215TWF0Q29uZmlnLm1hdENvbmZpZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbWF0T2JqID0gV215TWF0Q29uZmlnLm1hdENvbmZpZ1tpXTtcclxuICAgICAgICAgICAgdGhpcy5hZGRNYXQobWF0T2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZGRNYXQobWF0T2JqKXtcclxuICAgICAgICBpZihtYXRPYmo9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBjX21hdE5hbWU9bWF0T2JqWydjX21hdE5hbWUnXTtcclxuICAgICAgICB2YXIgaW5pdERhdGE9bWF0T2JqWydpbml0RGF0YSddO1xyXG4gICAgICAgIHZhciB0YXJnZXRVcmxBcnI9bWF0T2JqWyd0YXJnZXRVcmxBcnInXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRhcmdldFVybEFyci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgdXJsPXRhcmdldFVybEFycltqXVsndXJsJ107XHJcbiAgICAgICAgICAgIHZhciBtYXRJZD10YXJnZXRVcmxBcnJbal1bJ21hdElkJ107XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQzRD1XbXlNYXRNYWcuZ2V0T2JqM2RVcmwodGhpcy5zY2VuZTNELHVybCk7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldDNEIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TWF0ZXJpYWwodGFyZ2V0M0QsaW5pdERhdGEsbWF0SWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNYXRlcmlhbCh0YXJnZXQsaW5pdERhdGEsbWF0SWQ9MCxzaGFkZXJOYW1lPyxpc05ld01hdGVyaWE/KXtcclxuICAgICAgICBpZih0YXJnZXQ9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYoc2hhZGVyTmFtZT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgc2hhZGVyTmFtZT1pbml0RGF0YS5zaGFkZXJOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzaGFkZXJOYW1lPT11bmRlZmluZWQpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHNoYWRlcj1MYXlhLlNoYWRlcjNELmZpbmQoc2hhZGVyTmFtZSk7XHJcbiAgICAgICAgaWYoc2hhZGVyPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgcmVuZGVyZXI7XHJcbiAgICAgICAgdmFyIHNoYXJlZE1hdGVyaWFsOkxheWEuQmFzZU1hdGVyaWFsO1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPSh0YXJnZXQpLnNraW5uZWRNZXNoUmVuZGVyZXI7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBzaGFyZWRNYXRlcmlhbD1yZW5kZXJlci5tYXRlcmlhbHNbbWF0SWRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZW5kZXJlcj0odGFyZ2V0KS5tZXNoUmVuZGVyZXI7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBzaGFyZWRNYXRlcmlhbD1yZW5kZXJlci5tYXRlcmlhbHNbbWF0SWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoc2hhcmVkTWF0ZXJpYWw9PW51bGwpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn5rKh5pyJc2hhcmVkTWF0ZXJpYWw6Jyx0YXJnZXQsc2hhZGVyTmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpc05ld01hdGVyaWEpe1xyXG4gICAgICAgICAgICBzaGFyZWRNYXRlcmlhbD1zaGFyZWRNYXRlcmlhbC5jbG9uZSgpO1xyXG4gICAgICAgICAgICByZW5kZXJlci5tYXRlcmlhbHNbbWF0SWRdPXNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaGFyZWRNYXRlcmlhbC5zZXRTaGFkZXJOYW1lKHNoYWRlck5hbWUpO1xyXG4gICAgICAgIC8v5riy5p+T5qih5byPXHJcbiAgICAgICAgdmFyIHZzUHNBcnI9c2hhZGVyWyd3X3ZzUHNBcnInXTtcclxuICAgICAgICBpZih2c1BzQXJyKXtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2c1BzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyRGF0YU9iaiA9IHZzUHNBcnJbaV1bMl07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVuZGVyRGF0YU9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXJEYXRhT2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2hhcmVkTWF0ZXJpYWwuaGFzT3duUHJvcGVydHkoa2V5KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbFtrZXldPXJlbmRlckRhdGFPYmpba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyU3RhdGU9c2hhcmVkTWF0ZXJpYWwuZ2V0UmVuZGVyU3RhdGUoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlbmRlclN0YXRlLmhhc093blByb3BlcnR5KGtleSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyU3RhdGVba2V5XT1yZW5kZXJEYXRhT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy/liJ3lp4vlgLxcclxuICAgICAgICBpZiAoc2hhZGVyWyd3X3VuaWZvcm1NYXAnXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzaGFkZXJbJ3dfdW5pZm9ybU1hcCddKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hhZGVyWyd3X3VuaWZvcm1NYXAnXS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRJZD1zaGFkZXJbJ3dfdW5pZm9ybU1hcCddW2tleV1bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRWPWluaXREYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaW5pdFYhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0ViA9IGluaXRWLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGluaXRWLmxlbmd0aD09NCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKGluaXRJZCxuZXcgTGF5YS5WZWN0b3I0KHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pLHBhcnNlRmxvYXQoaW5pdFZbMl0pLHBhcnNlRmxvYXQoaW5pdFZbM10pKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcihpbml0SWQsbmV3IExheWEuVmVjdG9yMyhwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSxwYXJzZUZsb2F0KGluaXRWWzJdKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0yKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IoaW5pdElkLG5ldyBMYXlhLlZlY3RvcjIocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09MSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNOYU4ocGFyc2VGbG9hdChpbml0VlswXSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldE51bWJlcihpbml0SWQscGFyc2VGbG9hdChpbml0VlswXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyT2JqPWluaXRWWzBdKycnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0ck9iaj09J3RleCcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4T2JqPWluaXREYXRhWydURVhAJytrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0ZXhPYmohPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGg9dGV4T2JqWydwYXRoJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHBhdGgsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLChfaW5pdElkLHRleCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0ZXg9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXg9bmV3IExheWEuVGV4dHVyZTJEKDAsMCwwLHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFRleHR1cmUoX2luaXRJZCx0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxbaW5pdElkXSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNoYXJlZE1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgU3ByaXRlM0RfU2hhZGVyVmFsdWVzKHRhcmdldCx2YWx1ZU5hbWUsdmFsdWUsbWF0c0lkKXtcclxuICAgICAgICB2YXIgdE9iakFycj1XbXlNYXRNYWcuZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LExheWEuUmVuZGVyYWJsZVNwcml0ZTNEKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRPYmpBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJQM2QgPSB0T2JqQXJyW2ldO1xyXG4gICAgICAgICAgICBXbXlNYXRNYWcuUmVuZGVyYWJsZVNwcml0ZTNEX1NoYWRlclZhbHVlcyhyUDNkLHZhbHVlTmFtZSx2YWx1ZSxtYXRzSWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbVx0dGFyZ2V0XHTlr7nosaFcclxuICAgICAqIEBwYXJhbVx0dmFsdWVOYW1lIOWAvOeahOWQjeWtl1xyXG4gICAgICogQHBhcmFtXHR2YWx1ZVx05YC8XHJcbiAgICAgKiBAcGFyYW1cdG1hdHNJZFx05p2Q6LSo55CDSURcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBSZW5kZXJhYmxlU3ByaXRlM0RfU2hhZGVyVmFsdWVzKHRhcmdldCx2YWx1ZU5hbWUsdmFsdWUsbWF0c0lkKSB7XHJcbiAgICAgICAgaWYobWF0c0lkPT1udWxsKW1hdHNJZD0tMTtcclxuICAgICAgICB2YXIgcmVuZGVyZXI9dGFyZ2V0WydtZXNoUmVuZGVyZXInXTtcclxuICAgICAgICBpZihyZW5kZXJlcj09bnVsbCl7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPXRhcmdldFsnc2tpbm5lZE1lc2hSZW5kZXJlciddO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighcmVuZGVyZXIpcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBtcz1yZW5kZXJlci5zaGFyZWRNYXRlcmlhbHM7XHJcbiAgICAgICAgaWYobXMubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgaXNNYXRzSWQ9bWF0c0lkPDA/ZmFsc2U6dHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIGlzT0s9dHJ1ZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBtID0gbXNbaV07XHJcbiAgICAgICAgICAgIHZhciB1bmlmb3JtTWFwPSBtLl9zaGFkZXIuX3VuaWZvcm1NYXBbdmFsdWVOYW1lXTtcclxuICAgICAgICAgICAgaWYoIXVuaWZvcm1NYXApY29udGludWU7XHJcbiAgICAgICAgICAgIGlmKGlzTWF0c0lkKXtcclxuICAgICAgICAgICAgICAgIGlmKG1hdHNJZCE9aSljb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlSWQ9dW5pZm9ybU1hcFswXTtcclxuICAgICAgICAgICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbil7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldEJvb2wodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKCFpc05hTih2YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2PXZhbHVlKycnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHYuaW5kZXhPZignLicpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0SW50KHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0TnVtYmVyKHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsdWUgaW5zdGFuY2VvZiBMYXlhLkJhc2VWZWN0b3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHZhbHVlIGluc3RhbmNlb2YgTGF5YS5RdWF0ZXJuaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0UXVhdGVybmlvbih2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsdWUgaW5zdGFuY2VvZiBMYXlhLk1hdHJpeDR4NCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldE1hdHJpeDR4NCh2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsdWUgaW5zdGFuY2VvZiBMYXlhLlRleHR1cmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRUZXh0dXJlKHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBpc09LPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgaXNPSz1mYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNPSztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uSW5zdGFuY2VOYW1lKG5hbWUpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2U9bnVsbDtcclxuXHRcdHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSh3aW5kb3dbbmFtZV0ucHJvdG90eXBlKTtcclxuXHRcdFx0aW5zdGFuY2UuY29uc3RydWN0b3IuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqZWN0Q2xhc3Mob2JqKSB7XHJcbiAgICAgICAgaWYgKG9iaiAmJiBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgKiBmb3IgYnJvd3NlcnMgd2hpY2ggaGF2ZSBuYW1lIHByb3BlcnR5IGluIHRoZSBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICogb2YgdGhlIG9iamVjdCxzdWNoIGFzIGNocm9tZSBcclxuICAgICAgICAgICAqL1xyXG4gICAgICAgICAgaWYob2JqLmNvbnN0cnVjdG9yLm5hbWUpIHtcclxuICAgICAgICAgICByZXR1cm4gb2JqLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YXIgc3RyID0gb2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAvKlxyXG4gICAgICAgICAgICogZXhlY3V0ZWQgaWYgdGhlIHJldHVybiBvZiBvYmplY3QuY29uc3RydWN0b3IudG9TdHJpbmcoKSBpcyBcclxuICAgICAgICAgICAqICdbb2JqZWN0IG9iamVjdENsYXNzXSdcclxuICAgICAgICAgICAqL1xyXG4gICAgICAgICAgaWYoc3RyLmNoYXJBdCgwKSA9PSAnWycpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBhcnIgPSBzdHIubWF0Y2goL1xcW1xcdytcXHMqKFxcdyspXFxdLyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBleGVjdXRlZCBpZiB0aGUgcmV0dXJuIG9mIG9iamVjdC5jb25zdHJ1Y3Rvci50b1N0cmluZygpIGlzIFxyXG4gICAgICAgICAgICAgKiAnZnVuY3Rpb24gb2JqZWN0Q2xhc3MgKCkge30nXHJcbiAgICAgICAgICAgICAqIGZvciBJRSBGaXJlZm94XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gc3RyLm1hdGNoKC9mdW5jdGlvblxccyooXFx3KykvKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChhcnIgJiYgYXJyLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgICByZXR1cm4gYXJyWzFdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7IFxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxjbGFzPyxhcnI/KSB7XHJcbiAgICAgICAgaWYoYXJyPT1udWxsKWFycj1bXTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG9iaj10YXJnZXQuZ2V0Q29tcG9uZW50KGNsYXMpO1xyXG4gICAgICAgIGlmKG9iaj09bnVsbCl7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIGNsYXMpe1xyXG4gICAgICAgICAgICAgICAgb2JqPXRhcmdldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmohPW51bGwgJiYgYXJyLmluZGV4T2Yob2JqKTwwKXtcclxuICAgICAgICAgICAgYXJyLnB1c2gob2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0Ll9jaGlsZHJlbj09bnVsbCkgcmV0dXJuIGFycjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZHJlbkNvbXBvbmVudChvLGNsYXMsYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkVXJsKHRhcmdldCx1cmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgYXJyVXJsPXVybC5zcGxpdCgnLycpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0LGFyclVybCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgX2dldE9iakFyclVybCh0YXJnZXQsdXJsQXJyOkFycmF5PHN0cmluZz4saWQ9MCl7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYoX3RhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgbmE9dXJsQXJyW2lkXTtcclxuICAgICAgICB2YXIgdGFyZ2V0T2JqPV90YXJnZXQuZ2V0Q2hpbGRCeU5hbWUobmEpO1xyXG4gICAgICAgIGlmKHRhcmdldE9iaj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihpZD49dXJsQXJyLmxlbmd0aC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGFyZ2V0T2JqPXRoaXMuX2dldE9iakFyclVybCh0YXJnZXRPYmosdXJsQXJyLCsraWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlX1dteVNoYWRlcntcclxuICAgIHByb3RlY3RlZCBfX2F0dHJpYnV0ZU1hcD17XHJcbiAgICAgICAgJ2FfUG9zaXRpb24nOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1BPU0lUSU9OMCovMCxcclxuICAgICAgICAnYV9Db2xvcic6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfQ09MT1IwKi8xLFxyXG4gICAgICAgICdhX05vcm1hbCc6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfTk9STUFMMCovMyxcclxuICAgICAgICAnYV9UZXhjb29yZDAnOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1RFWFRVUkVDT09SRElOQVRFMCovMixcclxuICAgICAgICAnYV9UZXhjb29yZDEnOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1RFWFRVUkVDT09SRElOQVRFMSovOCxcclxuICAgICAgICAnYV9Cb25lV2VpZ2h0cyc6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfQkxFTkRXRUlHSFQwKi83LFxyXG4gICAgICAgICdhX0JvbmVJbmRpY2VzJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9CTEVORElORElDRVMwKi82LFxyXG4gICAgICAgICdhX1RhbmdlbnQwJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9UQU5HRU5UMCovNSxcclxuICAgICAgICAvL3ZhciB1bmlmb3JtTWFwOk9iamVjdCA9IHsndV9NdnBNYXRyaXgnOiBbU3ByaXRlM0QuTVZQTUFUUklYLCBTaGFkZXIzRC5QRVJJT0RfU1BSSVRFXSwgJ3VfV29ybGRNYXQnOiBbU3ByaXRlM0QuV09STERNQVRSSVgsIFNoYWRlcjNELlBFUklPRF9TUFJJVEVdfTtcclxuICAgIH07XHJcbiAgICBwcm90ZWN0ZWQgX191bmlmb3JtTWFwPXtcclxuICAgICAgICAndV9Cb25lcyc6WyAvKmxheWEuZDMuY29yZS5Ta2lubmVkTWVzaFNwcml0ZTNELkJPTkVTKi8wLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX0NVU1RPTSovMF0sXHJcbiAgICAgICAgJ3VfRGlmZnVzZVRleHR1cmUnOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLkFMQkVET1RFWFRVUkUqLzEsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X1NwZWN1bGFyVGV4dHVyZSc6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuU1BFQ1VMQVJURVhUVVJFKi8zLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9Ob3JtYWxUZXh0dXJlJzpbIC8qbGF5YS5kMy5jb3JlLm1hdGVyaWFsLkJsaW5uUGhvbmdNYXRlcmlhbC5OT1JNQUxURVhUVVJFKi8yLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9BbHBoYVRlc3RWYWx1ZSc6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CYXNlTWF0ZXJpYWwuQUxQSEFURVNUVkFMVUUqLzAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X0RpZmZ1c2VDb2xvcic6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuQUxCRURPQ09MT1IqLzUsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X01hdGVyaWFsU3BlY3VsYXInOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLk1BVEVSSUFMU1BFQ1VMQVIqLzYsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X1NoaW5pbmVzcyc6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuU0hJTklORVNTKi83LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9UaWxpbmdPZmZzZXQnOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLlRJTElOR09GRlNFVCovOCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTCovMV0sXHJcbiAgICAgICAgJ3VfV29ybGRNYXQnOltMYXlhLlNwcml0ZTNELldPUkxETUFUUklYLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NQUklURSovMl0sXHJcbiAgICAgICAgJ3VfTXZwTWF0cml4JzpbTGF5YS5TcHJpdGUzRC5NVlBNQVRSSVgsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU1BSSVRFKi8yXSxcclxuICAgICAgICAndV9MaWdodG1hcFNjYWxlT2Zmc2V0JzpbTGF5YS5SZW5kZXJhYmxlU3ByaXRlM0QuTElHSFRNQVBTQ0FMRU9GRlNFVCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TUFJJVEUqLzJdLFxyXG4gICAgICAgICd1X0xpZ2h0TWFwJzpbTGF5YS5SZW5kZXJhYmxlU3ByaXRlM0QuTElHSFRNQVAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU1BSSVRFKi8yXSxcclxuICAgICAgICAndV9DYW1lcmFQb3MnOlsgLypsYXlhLmQzLmNvcmUuQmFzZUNhbWVyYS5DQU1FUkFQT1MqLzAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfQ0FNRVJBKi8zXSxcclxuICAgICAgICAndV9SZWZsZWN0VGV4dHVyZSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlJFRkxFQ1RJT05URVhUVVJFKi8yMiwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfUmVmbGVjdEludGVuc2l0eSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlJFRkxFVElPTklOVEVOU0lUWSovMjMsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0ZvZ1N0YXJ0JzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuRk9HU1RBUlQqLzEsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0ZvZ1JhbmdlJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuRk9HUkFOR0UqLzIsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0ZvZ0NvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuRk9HQ09MT1IqLzAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0RpcmVjdGlvbkxpZ2h0LkNvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuTElHSFRESVJDT0xPUiovNCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfRGlyZWN0aW9uTGlnaHQuRGlyZWN0aW9uJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuTElHSFRESVJFQ1RJT04qLzMsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1BvaW50TGlnaHQuUG9zaXRpb24nOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5QT0lOVExJR0hUUE9TKi81LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9Qb2ludExpZ2h0LlJhbmdlJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuUE9JTlRMSUdIVFJBTkdFKi82LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9Qb2ludExpZ2h0LkNvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuUE9JTlRMSUdIVENPTE9SKi84LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9TcG90TGlnaHQuUG9zaXRpb24nOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TUE9UTElHSFRQT1MqLzksLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1Nwb3RMaWdodC5EaXJlY3Rpb24nOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TUE9UTElHSFRESVJFQ1RJT04qLzEwLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9TcG90TGlnaHQuUmFuZ2UnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TUE9UTElHSFRSQU5HRSovMTIsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1Nwb3RMaWdodC5TcG90JzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU1BPVExJR0hUU1BPVEFOR0xFKi8xMSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfU3BvdExpZ2h0LkNvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU1BPVExJR0hUQ09MT1IqLzE0LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9BbWJpZW50Q29sb3InOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5BTUJJRU5UQ09MT1IqLzIxLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9zaGFkb3dNYXAxJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XTUFQVEVYVFVSRTEqLzE4LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9zaGFkb3dNYXAyJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XTUFQVEVYVFVSRTIqLzE5LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9zaGFkb3dNYXAzJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XTUFQVEVYVFVSRTMqLzIwLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9zaGFkb3dQU1NNRGlzdGFuY2UnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TSEFET1dESVNUQU5DRSovMTUsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X2xpZ2h0U2hhZG93VlAnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TSEFET1dMSUdIVFZJRVdQUk9KRUNUKi8xNiwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3Vfc2hhZG93UENGb2Zmc2V0JzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XTUFQUENGT0ZGU0VUKi8xNywvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfVGltZSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlRJTUUqLzI0LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9QTWF0cml4JzpbMiwgM10sXHJcbiAgICAgICAgJ3VfVk1hdHJpeCc6WzEsIDNdLFxyXG4gICAgfTtcclxuICAgIHByb3RlY3RlZCBfdnNQc0Fycj1bXTtcclxuICAgIHByb3RlY3RlZCBfc2hhZGVyPW51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3NoYWRlck5hbWU7XHJcbiAgICBwcm90ZWN0ZWQgX2F0dHJpYnV0ZU1hcD17fTtcclxuICAgIHByb3RlY3RlZCBfdW5pZm9ybU1hcD17fTtcclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIGluaXQoKXtcclxuXHJcbiAgICB9XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgdmFyIHNwcml0ZURlZmluZXM9TGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNELnNoYWRlckRlZmluZXM7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsRGVmaW5lcz1MYXlhLkJsaW5uUGhvbmdNYXRlcmlhbC5zaGFkZXJEZWZpbmVzO1xyXG4gICAgICAgIHRoaXMuX3NoYWRlcj1MYXlhLlNoYWRlcjNELmFkZCh0aGlzLl9zaGFkZXJOYW1lLHRoaXMuX19hdHRyaWJ1dGVNYXAsdGhpcy5fX3VuaWZvcm1NYXAsc3ByaXRlRGVmaW5lcyxtYXRlcmlhbERlZmluZXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3NoYWRlclsnd191bmlmb3JtTWFwJ109dGhpcy5fdW5pZm9ybU1hcDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2F0dHJpYnV0ZU1hcCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYXR0cmlidXRlTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX19hdHRyaWJ1dGVNYXBba2V5XSA9IHRoaXMuX2F0dHJpYnV0ZU1hcFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl91bmlmb3JtTWFwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91bmlmb3JtTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VuaWZvcm1NYXBba2V5XVsxXT1MYXlhLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX191bmlmb3JtTWFwW2tleV0gPSB0aGlzLl91bmlmb3JtTWFwW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NoYWRlclsnd192c1BzQXJyJ109dGhpcy5fdnNQc0FycjtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fdnNQc0Fycikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdnNQc0Fyci5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdnNwcz10aGlzLl92c1BzQXJyW2tleV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFkZXIuYWRkU2hhZGVyUGFzcyh2c3BzWzBdLHZzcHNbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25TZXRWc1BzKHZzLHBzLHJlbmRlckRhdGEpe1xyXG4gICAgICAgIGlmICh2cyAhPSBudWxsICYmIHBzIT1udWxsKSB7XHJcbiAgICAgICAgICAgIC8vIHZzPXRoaXMub25TZXRWcyh2cyk7XHJcbiAgICAgICAgICAgIC8vIHBzPXRoaXMub25TZXRQcyhwcyk7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlckRhdGE9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyRGF0YT17fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl92c1BzQXJyLnB1c2goW3ZzLHBzLHJlbmRlckRhdGFdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uU2V0VnModnMpe1xyXG4gICAgICAgIGlmKHZzPT1udWxsKXJldHVybiAnJztcclxuICAgICAgICBpZih2cy5pbmRleE9mKCd3bXlNYWluKCcpPDApcmV0dXJuIHZzO1xyXG4gICAgICAgIHZhciBfVnM9YFxyXG4jaW5jbHVkZSAnTGlnaHRpbmcuZ2xzbCc7XHJcblxyXG5hdHRyaWJ1dGUgdmVjNCBhX1Bvc2l0aW9uO1xyXG51bmlmb3JtIG1hdDQgdV9NdnBNYXRyaXg7XHJcblxyXG5hdHRyaWJ1dGUgdmVjMiBhX1RleGNvb3JkMDtcclxuI2lmIGRlZmluZWQoRElGRlVTRU1BUCl8fCgoZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKSkmJihkZWZpbmVkKFNQRUNVTEFSTUFQKXx8ZGVmaW5lZChOT1JNQUxNQVApKSl8fChkZWZpbmVkKExJR0hUTUFQKSYmZGVmaW5lZChVVikpXHJcbiAgICB2YXJ5aW5nIHZlYzIgdl9UZXhjb29yZDA7XHJcbiNlbmRpZlxyXG5cclxuI2lmIGRlZmluZWQoTElHSFRNQVApJiZkZWZpbmVkKFVWMSlcclxuICAgIGF0dHJpYnV0ZSB2ZWMyIGFfVGV4Y29vcmQxO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBMSUdIVE1BUFxyXG4gICAgdW5pZm9ybSB2ZWM0IHVfTGlnaHRtYXBTY2FsZU9mZnNldDtcclxuICAgIHZhcnlpbmcgdmVjMiB2X0xpZ2h0TWFwVVY7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIENPTE9SXHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX0NvbG9yO1xyXG4gICAgdmFyeWluZyB2ZWM0IHZfQ29sb3I7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIEJPTkVcclxuICAgIGNvbnN0IGludCBjX01heEJvbmVDb3VudCA9IDI0O1xyXG4gICAgYXR0cmlidXRlIHZlYzQgYV9Cb25lSW5kaWNlcztcclxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfQm9uZVdlaWdodHM7XHJcbiAgICB1bmlmb3JtIG1hdDQgdV9Cb25lc1tjX01heEJvbmVDb3VudF07XHJcbiNlbmRpZlxyXG5cclxuYXR0cmlidXRlIHZlYzMgYV9Ob3JtYWw7XHJcbnZhcnlpbmcgdmVjMyB2X05vcm1hbDsgXHJcbnVuaWZvcm0gdmVjMyB1X0NhbWVyYVBvcztcclxudmFyeWluZyB2ZWMzIHZfVmlld0RpcjsgXHJcbmF0dHJpYnV0ZSB2ZWM0IGFfVGFuZ2VudDA7XHJcbnZhcnlpbmcgbWF0MyB3b3JsZEludk1hdDtcclxudmFyeWluZyB2ZWMzIHZfUG9zaXRpb247XHJcblxyXG52YXJ5aW5nIHZlYzMgdl9UYW5nZW50O1xyXG52YXJ5aW5nIHZlYzMgdl9CaW5vcm1hbDtcclxuXHJcbnVuaWZvcm0gbWF0NCB1X1dvcmxkTWF0O1xyXG52YXJ5aW5nIHZlYzMgdl9Qb3NpdGlvbldvcmxkO1xyXG5cclxudmFyeWluZyBmbG9hdCB2X3Bvc1ZpZXdaO1xyXG4jaWZkZWYgUkVDRUlWRVNIQURPV1xyXG4gICAgI2lmZGVmIFNIQURPV01BUF9QU1NNMSBcclxuICAgIHZhcnlpbmcgdmVjNCB2X2xpZ2h0TVZQUG9zO1xyXG4gICAgdW5pZm9ybSBtYXQ0IHVfbGlnaHRTaGFkb3dWUFs0XTtcclxuICAgICNlbmRpZlxyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBUSUxJTkdPRkZTRVRcclxuICAgIHVuaWZvcm0gdmVjNCB1X1RpbGluZ09mZnNldDtcclxuI2VuZGlmXHJcblxyXG52b2lkIG1haW5fY2FzdFNoYWRvdygpXHJcbntcclxuICAgICNpZmRlZiBCT05FXHJcbiAgICAgICAgbWF0NCBza2luVHJhbnNmb3JtID0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy54KV0gKiBhX0JvbmVXZWlnaHRzLng7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLnkpXSAqIGFfQm9uZVdlaWdodHMueTtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueildICogYV9Cb25lV2VpZ2h0cy56O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy53KV0gKiBhX0JvbmVXZWlnaHRzLnc7XHJcbiAgICAgICAgdmVjNCBwb3NpdGlvbj1za2luVHJhbnNmb3JtKmFfUG9zaXRpb247XHJcbiAgICAgICAgdl9Qb3NpdGlvbj1wb3NpdGlvbi54eXo7XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X012cE1hdHJpeCAqIHBvc2l0aW9uO1xyXG4gICAgI2Vsc2VcclxuICAgICAgICB2X1Bvc2l0aW9uPWFfUG9zaXRpb24ueHl6O1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBhX1Bvc2l0aW9uO1xyXG4gICAgI2VuZGlmXHJcbiAgICAgICAgXHJcbiAgICAvL1RPRE/msqHogIPomZFVVuWKqOeUu+WRolxyXG4gICAgI2lmIGRlZmluZWQoRElGRlVTRU1BUCkmJmRlZmluZWQoQUxQSEFURVNUKVxyXG4gICAgICAgIHZfVGV4Y29vcmQwPWFfVGV4Y29vcmQwO1xyXG4gICAgI2VuZGlmXHJcbiAgICAgICAgdl9wb3NWaWV3WiA9IGdsX1Bvc2l0aW9uLno7XHJcbn1cclxuXHJcbm1hdDMgaW52ZXJzZShtYXQzIG0pIHtcclxuICAgIGZsb2F0IGEwMCA9IG1bMF1bMF0sIGEwMSA9IG1bMF1bMV0sIGEwMiA9IG1bMF1bMl07XHJcbiAgICBmbG9hdCBhMTAgPSBtWzFdWzBdLCBhMTEgPSBtWzFdWzFdLCBhMTIgPSBtWzFdWzJdO1xyXG4gICAgZmxvYXQgYTIwID0gbVsyXVswXSwgYTIxID0gbVsyXVsxXSwgYTIyID0gbVsyXVsyXTtcclxuXHJcbiAgICBmbG9hdCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjE7XHJcbiAgICBmbG9hdCBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwO1xyXG4gICAgZmxvYXQgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwO1xyXG5cclxuICAgIGZsb2F0IGRldCA9IGEwMCAqIGIwMSArIGEwMSAqIGIxMSArIGEwMiAqIGIyMTtcclxuXHJcbiAgICByZXR1cm4gbWF0MyhiMDEsICgtYTIyICogYTAxICsgYTAyICogYTIxKSwgKGExMiAqIGEwMSAtIGEwMiAqIGExMSksXHJcbiAgICAgICAgICAgICAgICBiMTEsIChhMjIgKiBhMDAgLSBhMDIgKiBhMjApLCAoLWExMiAqIGEwMCArIGEwMiAqIGExMCksXHJcbiAgICAgICAgICAgICAgICBiMjEsICgtYTIxICogYTAwICsgYTAxICogYTIwKSwgKGExMSAqIGEwMCAtIGEwMSAqIGExMCkpIC8gZGV0O1xyXG59XHJcblxyXG52b2lkIG1haW5fbm9ybWFsKClcclxue1xyXG4gICAgI2lmZGVmIEJPTkVcclxuICAgICAgICBtYXQ0IHNraW5UcmFuc2Zvcm0gPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLngpXSAqIGFfQm9uZVdlaWdodHMueDtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueSldICogYV9Cb25lV2VpZ2h0cy55O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy56KV0gKiBhX0JvbmVXZWlnaHRzLno7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLncpXSAqIGFfQm9uZVdlaWdodHMudztcclxuICAgICAgICB2ZWM0IHBvc2l0aW9uPXNraW5UcmFuc2Zvcm0qYV9Qb3NpdGlvbjtcclxuICAgICAgICB2X1Bvc2l0aW9uPXBvc2l0aW9uLnh5ejtcclxuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfTXZwTWF0cml4ICogcG9zaXRpb247XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIHZfUG9zaXRpb249YV9Qb3NpdGlvbi54eXo7XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X012cE1hdHJpeCAqIGFfUG9zaXRpb247XHJcbiAgICAjZW5kaWZcclxuXHJcbiAgICAjaWZkZWYgQk9ORVxyXG4gICAgICAgIHdvcmxkSW52TWF0PWludmVyc2UobWF0Myh1X1dvcmxkTWF0KnNraW5UcmFuc2Zvcm0pKTtcclxuICAgICNlbHNlXHJcbiAgICAgICAgd29ybGRJbnZNYXQ9aW52ZXJzZShtYXQzKHVfV29ybGRNYXQpKTtcclxuICAgICNlbmRpZiAgXHJcbiAgICB2X05vcm1hbD1hX05vcm1hbCp3b3JsZEludk1hdDtcclxuXHJcbiAgICB2X1RhbmdlbnQ9YV9UYW5nZW50MC54eXoqd29ybGRJbnZNYXQ7XHJcbiAgICB2X0Jpbm9ybWFsPWNyb3NzKHZfTm9ybWFsLHZfVGFuZ2VudCkqYV9UYW5nZW50MC53O1xyXG5cclxuICAgICNpZmRlZiBCT05FXHJcbiAgICAgICAgdl9Qb3NpdGlvbldvcmxkPSh1X1dvcmxkTWF0KnBvc2l0aW9uKS54eXo7XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIHZfUG9zaXRpb25Xb3JsZD0odV9Xb3JsZE1hdCphX1Bvc2l0aW9uKS54eXo7XHJcbiAgICAjZW5kaWZcclxuICAgIFxyXG4gICAgdl9WaWV3RGlyPXVfQ2FtZXJhUG9zLXZfUG9zaXRpb25Xb3JsZDtcclxuXHJcbiAgICAjaWYgZGVmaW5lZChESUZGVVNFTUFQKXx8KChkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpKSYmKGRlZmluZWQoU1BFQ1VMQVJNQVApfHxkZWZpbmVkKE5PUk1BTE1BUCkpKVxyXG4gICAgICAgIHZfVGV4Y29vcmQwPWFfVGV4Y29vcmQwO1xyXG4gICAgICAgICNpZmRlZiBUSUxJTkdPRkZTRVRcclxuICAgICAgICAgICAgdl9UZXhjb29yZDA9VHJhbnNmb3JtVVYodl9UZXhjb29yZDAsdV9UaWxpbmdPZmZzZXQpO1xyXG4gICAgICAgICNlbmRpZlxyXG4gICAgI2VuZGlmXHJcblxyXG4gICAgI2lmZGVmIExJR0hUTUFQXHJcbiAgICAgICAgI2lmZGVmIFNDQUxFT0ZGU0VUTElHSFRJTkdNQVBVVlxyXG4gICAgICAgICAgICAjaWZkZWYgVVYxXHJcbiAgICAgICAgICAgICAgICB2X0xpZ2h0TWFwVVY9dmVjMihhX1RleGNvb3JkMS54LDEuMC1hX1RleGNvb3JkMS55KSp1X0xpZ2h0bWFwU2NhbGVPZmZzZXQueHkrdV9MaWdodG1hcFNjYWxlT2Zmc2V0Lnp3O1xyXG4gICAgICAgICAgICAjZWxzZVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPXZlYzIoYV9UZXhjb29yZDAueCwxLjAtYV9UZXhjb29yZDAueSkqdV9MaWdodG1hcFNjYWxlT2Zmc2V0Lnh5K3VfTGlnaHRtYXBTY2FsZU9mZnNldC56dztcclxuICAgICAgICAgICAgI2VuZGlmIFxyXG4gICAgICAgICAgICB2X0xpZ2h0TWFwVVYueT0xLjAtdl9MaWdodE1hcFVWLnk7XHJcbiAgICAgICAgI2Vsc2VcclxuICAgICAgICAgICAgI2lmZGVmIFVWMVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPWFfVGV4Y29vcmQxO1xyXG4gICAgICAgICAgICAjZWxzZVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPWFfVGV4Y29vcmQwO1xyXG4gICAgICAgICAgICAjZW5kaWYgXHJcbiAgICAgICAgI2VuZGlmIFxyXG4gICAgI2VuZGlmXHJcblxyXG4gICAgI2lmIGRlZmluZWQoQ09MT1IpJiZkZWZpbmVkKEVOQUJMRVZFUlRFWENPTE9SKVxyXG4gICAgICAgIHZfQ29sb3I9YV9Db2xvcjtcclxuICAgICNlbmRpZlxyXG5cclxuICAgICNpZmRlZiBSRUNFSVZFU0hBRE9XXHJcbiAgICAgICAgdl9wb3NWaWV3WiA9IGdsX1Bvc2l0aW9uLnc7XHJcbiAgICAgICAgI2lmZGVmIFNIQURPV01BUF9QU1NNMSBcclxuICAgICAgICAgICAgdl9saWdodE1WUFBvcyA9IHVfbGlnaHRTaGFkb3dWUFswXSAqIHZlYzQodl9Qb3NpdGlvbldvcmxkLDEuMCk7XHJcbiAgICAgICAgI2VuZGlmXHJcbiAgICAjZW5kaWZcclxufVxyXG5cclxuLy8tLXdteS1tYWluLS0tLS0tLS0tLS0tLS0tLS1cclxubWF0MyBNQVRSSVhfSVRfTVYobWF0NCBNb2RlbFZpZXdNYXRyaXgpIHtcclxuICAgIHJldHVybiBpbnZlcnNlKG1hdDMoTW9kZWxWaWV3TWF0cml4KSk7XHJcbn1cclxubWF0MyBnZXRSb3RhdGlvbih2ZWM0IHdUYW5nZW50LCB2ZWMzIHdOb3JtYWwpIHtcclxuICAgIHZlYzMgYmlub3JtYWwgPSBjcm9zcyh3Tm9ybWFsLnh5eiwgd1RhbmdlbnQueHl6KSAqIC13VGFuZ2VudC53O1xyXG4gICAgbWF0MyByb3RhdGlvbiA9IG1hdDMoXHJcbiAgICAgICAgd1RhbmdlbnQueCwgYmlub3JtYWwueCwgd05vcm1hbC54LFxyXG4gICAgICAgIHdUYW5nZW50LnksIGJpbm9ybWFsLnksIHdOb3JtYWwueSxcclxuICAgICAgICB3VGFuZ2VudC56LCBiaW5vcm1hbC56LCB3Tm9ybWFsLnopO1xyXG4gICAgcmV0dXJuIHJvdGF0aW9uO1xyXG59XHJcbiR7dnN9XHJcbi8vLS13bXktLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG52b2lkIG1haW4oKVxyXG57XHJcbiAgICAjaWZkZWYgQ0FTVFNIQURPV1xyXG4gICAgICAgIG1haW5fY2FzdFNoYWRvdygpO1xyXG4gICAgI2Vsc2VcclxuICAgICAgICBtYWluX25vcm1hbCgpO1xyXG4gICAgICAgIHdteU1haW4oKTtcclxuICAgICNlbmRpZlxyXG59ICAgICAgICBcclxuICAgICAgICBgO1xyXG4gICAgICAgIHJldHVybiBfVnM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBvblNldFBzKHBzKXtcclxuICAgICAgICBpZihwcz09bnVsbClyZXR1cm4gJyc7XHJcbiAgICAgICAgaWYocHMuaW5kZXhPZignd215TWFpbignKTwwKXJldHVybiBwcztcclxuICAgICAgICB2YXIgX1BzPWBcclxuI2lmZGVmIEhJR0hQUkVDSVNJT05cclxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xyXG4jZWxzZVxyXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcclxuI2VuZGlmXHJcblxyXG4jaW5jbHVkZSAnTGlnaHRpbmcuZ2xzbCc7XHJcblxyXG51bmlmb3JtIHZlYzQgdV9EaWZmdXNlQ29sb3I7XHJcblxyXG4jaWYgZGVmaW5lZChDT0xPUikmJmRlZmluZWQoRU5BQkxFVkVSVEVYQ09MT1IpXHJcbiAgICB2YXJ5aW5nIHZlYzQgdl9Db2xvcjtcclxuI2VuZGlmXHJcblxyXG52YXJ5aW5nIHZlYzMgdl9WaWV3RGlyOyBcclxuXHJcbiNpZmRlZiBBTFBIQVRFU1RcclxuICAgIHVuaWZvcm0gZmxvYXQgdV9BbHBoYVRlc3RWYWx1ZTtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgRElGRlVTRU1BUFxyXG4gICAgdW5pZm9ybSBzYW1wbGVyMkQgdV9EaWZmdXNlVGV4dHVyZTtcclxuI2VuZGlmXHJcblxyXG4jaWYgZGVmaW5lZChESUZGVVNFTUFQKXx8KChkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpKSYmKGRlZmluZWQoU1BFQ1VMQVJNQVApfHxkZWZpbmVkKE5PUk1BTE1BUCkpKVxyXG4gICAgdmFyeWluZyB2ZWMyIHZfVGV4Y29vcmQwO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBMSUdIVE1BUFxyXG4gICAgdmFyeWluZyB2ZWMyIHZfTGlnaHRNYXBVVjtcclxuICAgIHVuaWZvcm0gc2FtcGxlcjJEIHVfTGlnaHRNYXA7XHJcbiNlbmRpZlxyXG5cclxuI2lmIGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVClcclxuICAgIHVuaWZvcm0gdmVjMyB1X01hdGVyaWFsU3BlY3VsYXI7XHJcbiAgICB1bmlmb3JtIGZsb2F0IHVfU2hpbmluZXNzO1xyXG4gICAgI2lmZGVmIFNQRUNVTEFSTUFQIFxyXG4gICAgICAgIHVuaWZvcm0gc2FtcGxlcjJEIHVfU3BlY3VsYXJUZXh0dXJlO1xyXG4gICAgI2VuZGlmXHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIEZPR1xyXG4gICAgdW5pZm9ybSBmbG9hdCB1X0ZvZ1N0YXJ0O1xyXG4gICAgdW5pZm9ybSBmbG9hdCB1X0ZvZ1JhbmdlO1xyXG4gICAgdW5pZm9ybSB2ZWMzIHVfRm9nQ29sb3I7XHJcbiNlbmRpZlxyXG5cclxudmFyeWluZyB2ZWMzIHZfTm9ybWFsO1xyXG52YXJ5aW5nIHZlYzMgdl9Qb3NpdGlvbjtcclxuXHJcbnVuaWZvcm0gc2FtcGxlcjJEIHVfTm9ybWFsVGV4dHVyZTtcclxudmFyeWluZyB2ZWMzIHZfVGFuZ2VudDtcclxudmFyeWluZyB2ZWMzIHZfQmlub3JtYWw7XHJcblxyXG4jaWZkZWYgRElSRUNUSU9OTElHSFRcclxuICAgIHVuaWZvcm0gRGlyZWN0aW9uTGlnaHQgdV9EaXJlY3Rpb25MaWdodDtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgUE9JTlRMSUdIVFxyXG4gICAgdW5pZm9ybSBQb2ludExpZ2h0IHVfUG9pbnRMaWdodDtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgU1BPVExJR0hUXHJcbiAgICB1bmlmb3JtIFNwb3RMaWdodCB1X1Nwb3RMaWdodDtcclxuI2VuZGlmXHJcblxyXG51bmlmb3JtIHZlYzMgdV9BbWJpZW50Q29sb3I7XHJcblxyXG5cclxuI2lmIGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKXx8ZGVmaW5lZChSRUNFSVZFU0hBRE9XKVxyXG4gICAgdmFyeWluZyB2ZWMzIHZfUG9zaXRpb25Xb3JsZDtcclxuI2VuZGlmXHJcblxyXG4jaW5jbHVkZSAnU2hhZG93SGVscGVyLmdsc2wnXHJcbnZhcnlpbmcgZmxvYXQgdl9wb3NWaWV3WjtcclxuI2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuICAgICNpZiBkZWZpbmVkKFNIQURPV01BUF9QU1NNMil8fGRlZmluZWQoU0hBRE9XTUFQX1BTU00zKVxyXG4gICAgICAgIHVuaWZvcm0gbWF0NCB1X2xpZ2h0U2hhZG93VlBbNF07XHJcbiAgICAjZW5kaWZcclxuICAgICNpZmRlZiBTSEFET1dNQVBfUFNTTTEgXHJcbiAgICAgICAgdmFyeWluZyB2ZWM0IHZfbGlnaHRNVlBQb3M7XHJcbiAgICAjZW5kaWZcclxuI2VuZGlmXHJcblxyXG52b2lkIG1haW5fY2FzdFNoYWRvdygpXHJcbntcclxuICAgIC8vZ2xfRnJhZ0NvbG9yPXZlYzQodl9wb3NWaWV3WiwwLjAsMC4wLDEuMCk7XHJcbiAgICBnbF9GcmFnQ29sb3I9cGFja0RlcHRoKHZfcG9zVmlld1opO1xyXG4gICAgI2lmIGRlZmluZWQoRElGRlVTRU1BUCkmJmRlZmluZWQoQUxQSEFURVNUKVxyXG4gICAgICAgIGZsb2F0IGFscGhhID0gdGV4dHVyZTJEKHVfRGlmZnVzZVRleHR1cmUsdl9UZXhjb29yZDApLnc7XHJcbiAgICAgICAgaWYoIGFscGhhIDwgdV9BbHBoYVRlc3RWYWx1ZSApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNjYXJkO1xyXG4gICAgICAgIH1cclxuICAgICNlbmRpZlxyXG59XHJcblxyXG4vLy0td215LW1haW4tLS0tLS0tLS0tLS0tLS0tLVxyXG52ZWM0IGxlcnBWNCh2ZWM0IGEsIHZlYzQgYiwgZmxvYXQgcykgeyByZXR1cm4gdmVjNChhICsgKGIgLSBhKSpzKTsgfVxyXG52ZWMzIGxlcnBWMyh2ZWMzIGEsIHZlYzMgYiwgZmxvYXQgcykgeyByZXR1cm4gdmVjMyhhICsgKGIgLSBhKSpzKTsgfVxyXG52ZWMyIGxlcnBWMih2ZWMyIGEsIHZlYzIgYiwgZmxvYXQgcykgeyByZXR1cm4gdmVjMihhICsgKGIgLSBhKSpzKTsgfVxyXG5mbG9hdCBsZXJwRihmbG9hdCBhLCBmbG9hdCBiLCBmbG9hdCBzKSB7IHJldHVybiBmbG9hdChhICsgKGIgLSBhKSAqIHMpOyB9XHJcbmZsb2F0IHNhdHVyYXRlKGZsb2F0IG4pIHsgcmV0dXJuIGNsYW1wKG4sIDAuMCwgMS4wKTsgfVxyXG52ZWMzIFVucGFja05vcm1hbCh2ZWM0IHBhY2tlZG5vcm1hbCkge1xyXG5cdC8vIFRoaXMgZG8gdGhlIHRyaWNrXHJcblx0cGFja2Vkbm9ybWFsLnggKj0gcGFja2Vkbm9ybWFsLnc7XHJcblx0dmVjMyBub3JtYWw7XHJcblx0bm9ybWFsLnh5ID0gcGFja2Vkbm9ybWFsLnh5ICogMi4wIC0gMS4wO1xyXG5cdG5vcm1hbC56ID0gc3FydCgxLjAgLSBzYXR1cmF0ZShkb3Qobm9ybWFsLnh5LCBub3JtYWwueHkpKSk7XHJcblx0cmV0dXJuIG5vcm1hbDtcclxufVxyXG4ke3BzfVxyXG4vLy0td215LS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxudm9pZCBtYWluX25vcm1hbCgpXHJcbntcclxuXHR2ZWMzIGdsb2JhbERpZmZ1c2U9dV9BbWJpZW50Q29sb3I7XHJcblx0I2lmZGVmIExJR0hUTUFQXHRcclxuXHRcdGdsb2JhbERpZmZ1c2UgKz0gRGVjb2RlTGlnaHRtYXAodGV4dHVyZTJEKHVfTGlnaHRNYXAsIHZfTGlnaHRNYXBVVikpO1xyXG5cdCNlbmRpZlxyXG5cdFxyXG5cdCNpZiBkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpXHJcblx0XHR2ZWMzIG5vcm1hbDtcclxuXHRcdCNpZiAoZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKSkmJmRlZmluZWQoTk9STUFMTUFQKVxyXG5cdFx0XHR2ZWMzIG5vcm1hbE1hcFNhbXBsZSA9IHRleHR1cmUyRCh1X05vcm1hbFRleHR1cmUsIHZfVGV4Y29vcmQwKS5yZ2I7XHJcblx0XHRcdG5vcm1hbCA9IG5vcm1hbGl6ZShOb3JtYWxTYW1wbGVUb1dvcmxkU3BhY2Uobm9ybWFsTWFwU2FtcGxlLCB2X05vcm1hbCwgdl9UYW5nZW50LHZfQmlub3JtYWwpKTtcclxuXHRcdCNlbHNlXHJcblx0XHRcdG5vcm1hbCA9IG5vcm1hbGl6ZSh2X05vcm1hbCk7XHJcblx0XHQjZW5kaWZcclxuXHRcdHZlYzMgdmlld0Rpcj0gbm9ybWFsaXplKHZfVmlld0Rpcik7XHJcblx0I2VuZGlmXHJcblx0XHJcblx0dmVjNCBtYWluQ29sb3I9dV9EaWZmdXNlQ29sb3I7XHJcblx0I2lmZGVmIERJRkZVU0VNQVBcclxuXHRcdHZlYzQgZGlmVGV4Q29sb3I9dGV4dHVyZTJEKHVfRGlmZnVzZVRleHR1cmUsIHZfVGV4Y29vcmQwKTtcclxuXHRcdG1haW5Db2xvcj1tYWluQ29sb3IqZGlmVGV4Q29sb3I7XHJcblx0I2VuZGlmIFxyXG5cdCNpZiBkZWZpbmVkKENPTE9SKSYmZGVmaW5lZChFTkFCTEVWRVJURVhDT0xPUilcclxuXHRcdG1haW5Db2xvcj1tYWluQ29sb3Iqdl9Db2xvcjtcclxuXHQjZW5kaWYgXHJcbiAgICBcclxuXHQjaWZkZWYgQUxQSEFURVNUXHJcblx0XHRpZihtYWluQ29sb3IuYTx1X0FscGhhVGVzdFZhbHVlKVxyXG5cdFx0XHRkaXNjYXJkO1xyXG5cdCNlbmRpZlxyXG4gIFxyXG5cdHZlYzMgZGlmZnVzZSA9IHZlYzMoMC4wKTtcclxuXHR2ZWMzIHNwZWN1bGFyPSB2ZWMzKDAuMCk7XHJcblx0I2lmIGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVClcclxuXHRcdHZlYzMgZGlmLHNwZTtcclxuXHRcdCNpZmRlZiBTUEVDVUxBUk1BUFxyXG5cdFx0XHR2ZWMzIGdsb3NzPXRleHR1cmUyRCh1X1NwZWN1bGFyVGV4dHVyZSwgdl9UZXhjb29yZDApLnJnYjtcclxuXHRcdCNlbHNlXHJcblx0XHRcdCNpZmRlZiBESUZGVVNFTUFQXHJcblx0XHRcdFx0dmVjMyBnbG9zcz12ZWMzKGRpZlRleENvbG9yLmEpO1xyXG5cdFx0XHQjZWxzZVxyXG5cdFx0XHRcdHZlYzMgZ2xvc3M9dmVjMygxLjApO1xyXG5cdFx0XHQjZW5kaWZcclxuXHRcdCNlbmRpZlxyXG5cdCNlbmRpZlxyXG5cclxuXHQjaWZkZWYgRElSRUNUSU9OTElHSFRcclxuXHRcdExheWFBaXJCbGlublBob25nRGllY3Rpb25MaWdodCh1X01hdGVyaWFsU3BlY3VsYXIsdV9TaGluaW5lc3Msbm9ybWFsLGdsb3NzLHZpZXdEaXIsdV9EaXJlY3Rpb25MaWdodCxkaWYsc3BlKTtcclxuXHRcdGRpZmZ1c2UrPWRpZjtcclxuXHRcdHNwZWN1bGFyKz1zcGU7XHJcblx0I2VuZGlmXHJcbiBcclxuXHQjaWZkZWYgUE9JTlRMSUdIVFxyXG5cdFx0TGF5YUFpckJsaW5uUGhvbmdQb2ludExpZ2h0KHZfUG9zaXRpb25Xb3JsZCx1X01hdGVyaWFsU3BlY3VsYXIsdV9TaGluaW5lc3Msbm9ybWFsLGdsb3NzLHZpZXdEaXIsdV9Qb2ludExpZ2h0LGRpZixzcGUpO1xyXG5cdFx0ZGlmZnVzZSs9ZGlmO1xyXG5cdFx0c3BlY3VsYXIrPXNwZTtcclxuXHQjZW5kaWZcclxuXHJcblx0I2lmZGVmIFNQT1RMSUdIVFxyXG5cdFx0TGF5YUFpckJsaW5uUGhvbmdTcG90TGlnaHQodl9Qb3NpdGlvbldvcmxkLHVfTWF0ZXJpYWxTcGVjdWxhcix1X1NoaW5pbmVzcyxub3JtYWwsZ2xvc3Msdmlld0Rpcix1X1Nwb3RMaWdodCxkaWYsc3BlKTtcclxuXHRcdGRpZmZ1c2UrPWRpZjtcclxuXHRcdHNwZWN1bGFyKz1zcGU7XHJcblx0I2VuZGlmXHJcblx0XHJcblx0I2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuXHRcdGZsb2F0IHNoYWRvd1ZhbHVlID0gMS4wO1xyXG5cdFx0I2lmZGVmIFNIQURPV01BUF9QU1NNM1xyXG5cdFx0XHRzaGFkb3dWYWx1ZSA9IGdldFNoYWRvd1BTU00zKCB1X3NoYWRvd01hcDEsdV9zaGFkb3dNYXAyLHVfc2hhZG93TWFwMyx1X2xpZ2h0U2hhZG93VlAsdV9zaGFkb3dQU1NNRGlzdGFuY2UsdV9zaGFkb3dQQ0ZvZmZzZXQsdl9Qb3NpdGlvbldvcmxkLHZfcG9zVmlld1osMC4wMDEpO1xyXG5cdFx0I2VuZGlmXHJcblx0XHQjaWZkZWYgU0hBRE9XTUFQX1BTU00yXHJcblx0XHRcdHNoYWRvd1ZhbHVlID0gZ2V0U2hhZG93UFNTTTIoIHVfc2hhZG93TWFwMSx1X3NoYWRvd01hcDIsdV9saWdodFNoYWRvd1ZQLHVfc2hhZG93UFNTTURpc3RhbmNlLHVfc2hhZG93UENGb2Zmc2V0LHZfUG9zaXRpb25Xb3JsZCx2X3Bvc1ZpZXdaLDAuMDAxKTtcclxuXHRcdCNlbmRpZiBcclxuXHRcdCNpZmRlZiBTSEFET1dNQVBfUFNTTTFcclxuXHRcdFx0c2hhZG93VmFsdWUgPSBnZXRTaGFkb3dQU1NNMSggdV9zaGFkb3dNYXAxLHZfbGlnaHRNVlBQb3MsdV9zaGFkb3dQU1NNRGlzdGFuY2UsdV9zaGFkb3dQQ0ZvZmZzZXQsdl9wb3NWaWV3WiwwLjAwMSk7XHJcblx0XHQjZW5kaWZcclxuXHRcdC8vZ2xfRnJhZ0NvbG9yID12ZWM0KG1haW5Db2xvci5yZ2IqKGdsb2JhbERpZmZ1c2UgKyBkaWZmdXNlKSpzaGFkb3dWYWx1ZSxtYWluQ29sb3IuYSk7XHJcblx0XHQvL2dsX0ZyYWdDb2xvciA9IHdteU1haW4obWFpbkNvbG9yLChnbG9iYWxEaWZmdXNlICsgZGlmZnVzZSAqIHNoYWRvd1ZhbHVlICogMS4xKSk7XHJcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gd215TWFpbihtYWluQ29sb3IsZ2xvYmFsRGlmZnVzZSxkaWZmdXNlLHNoYWRvd1ZhbHVlKTtcclxuXHQjZWxzZVxyXG5cdFx0Ly9nbF9GcmFnQ29sb3IgPXZlYzQobWFpbkNvbG9yLnJnYiooZ2xvYmFsRGlmZnVzZSArIGRpZmZ1c2UpLG1haW5Db2xvci5hKTtcclxuXHRcdGdsX0ZyYWdDb2xvciA9IHdteU1haW4obWFpbkNvbG9yLGdsb2JhbERpZmZ1c2UsZGlmZnVzZSwxLjApO1xyXG5cdCNlbmRpZlxyXG4gICAgLypcclxuXHQjaWYgZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKVxyXG5cdFx0I2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuXHRcdFx0Z2xfRnJhZ0NvbG9yLnJnYis9c3BlY3VsYXIqc2hhZG93VmFsdWU7XHJcblx0XHQjZWxzZVxyXG5cdFx0XHRnbF9GcmFnQ29sb3IucmdiKz1zcGVjdWxhcjtcclxuXHRcdCNlbmRpZlxyXG5cdCNlbmRpZlxyXG5cdCovXHJcblx0I2lmZGVmIEZPR1xyXG5cdFx0ZmxvYXQgbGVycEZhY3Q9Y2xhbXAoKDEuMC9nbF9GcmFnQ29vcmQudy11X0ZvZ1N0YXJ0KS91X0ZvZ1JhbmdlLDAuMCwxLjApO1xyXG5cdFx0Z2xfRnJhZ0NvbG9yLnJnYj1taXgoZ2xfRnJhZ0NvbG9yLnJnYix1X0ZvZ0NvbG9yLGxlcnBGYWN0KTtcclxuXHQjZW5kaWZcclxufVxyXG5cclxudm9pZCBtYWluKClcclxue1xyXG5cdCNpZmRlZiBDQVNUU0hBRE9XXHRcdFxyXG5cdFx0bWFpbl9jYXN0U2hhZG93KCk7XHJcblx0I2Vsc2VcclxuXHRcdG1haW5fbm9ybWFsKCk7XHJcblx0I2VuZGlmICBcclxufVxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgcmV0dXJuIF9QcztcclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlX1dteVNoYWRlciBmcm9tIFwiLi9CYXNlX1dteVNoYWRlclwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlMYXlhX3dteUxidCBleHRlbmRzIEJhc2VfV215U2hhZGVyIHtcclxuICAgIHB1YmxpYyBpbml0KCl7XHJcbiAgICAgICAgdGhpcy5fc2hhZGVyTmFtZT10aGlzLmNvbnN0cnVjdG9yWyduYW1lJ107XHJcbiAgICAgICAgdGhpcy5fdW5pZm9ybU1hcD17XHJcblx0XHRcdCdfd0NvbG9yJzpbMTAwMF0sXHJcblx0XHRcdCdfU3BlY3VsYXInOlsxMDAxXSxcclxuXHRcdFx0J19HbG9zcyc6WzEwMDJdLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHZzcHNBcnI9W107XHJcbiAgICAgICAgLy9wYXNzMC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxudnNwc0FyclswXT1bXTtcclxuLy92c1xyXG52c3BzQXJyWzBdWzBdPWBcclxuI2luY2x1ZGUgJ0xpZ2h0aW5nLmdsc2wnO1xyXG5cclxuYXR0cmlidXRlIHZlYzQgYV9Qb3NpdGlvbjtcclxudW5pZm9ybSBtYXQ0IHVfTXZwTWF0cml4O1xyXG5cclxuYXR0cmlidXRlIHZlYzIgYV9UZXhjb29yZDA7XHJcbiNpZiBkZWZpbmVkKERJRkZVU0VNQVApfHwoKGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVCkpJiYoZGVmaW5lZChTUEVDVUxBUk1BUCl8fGRlZmluZWQoTk9STUFMTUFQKSkpfHwoZGVmaW5lZChMSUdIVE1BUCkmJmRlZmluZWQoVVYpKVxyXG4gICAgdmFyeWluZyB2ZWMyIHZfVGV4Y29vcmQwO1xyXG4jZW5kaWZcclxuXHJcbiNpZiBkZWZpbmVkKExJR0hUTUFQKSYmZGVmaW5lZChVVjEpXHJcbiAgICBhdHRyaWJ1dGUgdmVjMiBhX1RleGNvb3JkMTtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgTElHSFRNQVBcclxuICAgIHVuaWZvcm0gdmVjNCB1X0xpZ2h0bWFwU2NhbGVPZmZzZXQ7XHJcbiAgICB2YXJ5aW5nIHZlYzIgdl9MaWdodE1hcFVWO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBDT0xPUlxyXG4gICAgYXR0cmlidXRlIHZlYzQgYV9Db2xvcjtcclxuICAgIHZhcnlpbmcgdmVjNCB2X0NvbG9yO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBCT05FXHJcbiAgICBjb25zdCBpbnQgY19NYXhCb25lQ291bnQgPSAyNDtcclxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfQm9uZUluZGljZXM7XHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX0JvbmVXZWlnaHRzO1xyXG4gICAgdW5pZm9ybSBtYXQ0IHVfQm9uZXNbY19NYXhCb25lQ291bnRdO1xyXG4jZW5kaWZcclxuXHJcbmF0dHJpYnV0ZSB2ZWMzIGFfTm9ybWFsO1xyXG52YXJ5aW5nIHZlYzMgdl9Ob3JtYWw7IFxyXG51bmlmb3JtIHZlYzMgdV9DYW1lcmFQb3M7XHJcbnZhcnlpbmcgdmVjMyB2X1ZpZXdEaXI7IFxyXG5hdHRyaWJ1dGUgdmVjNCBhX1RhbmdlbnQwO1xyXG52YXJ5aW5nIG1hdDMgd29ybGRJbnZNYXQ7XHJcbnZhcnlpbmcgdmVjMyB2X1Bvc2l0aW9uO1xyXG5cclxudmFyeWluZyB2ZWMzIHZfVGFuZ2VudDtcclxudmFyeWluZyB2ZWMzIHZfQmlub3JtYWw7XHJcblxyXG51bmlmb3JtIG1hdDQgdV9Xb3JsZE1hdDtcclxudmFyeWluZyB2ZWMzIHZfUG9zaXRpb25Xb3JsZDtcclxuXHJcbnZhcnlpbmcgZmxvYXQgdl9wb3NWaWV3WjtcclxuI2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuICAgICNpZmRlZiBTSEFET1dNQVBfUFNTTTEgXHJcbiAgICB2YXJ5aW5nIHZlYzQgdl9saWdodE1WUFBvcztcclxuICAgIHVuaWZvcm0gbWF0NCB1X2xpZ2h0U2hhZG93VlBbNF07XHJcbiAgICAjZW5kaWZcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgVElMSU5HT0ZGU0VUXHJcbiAgICB1bmlmb3JtIHZlYzQgdV9UaWxpbmdPZmZzZXQ7XHJcbiNlbmRpZlxyXG5cclxudm9pZCBtYWluX2Nhc3RTaGFkb3coKVxyXG57XHJcbiAgICAjaWZkZWYgQk9ORVxyXG4gICAgICAgIG1hdDQgc2tpblRyYW5zZm9ybSA9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueCldICogYV9Cb25lV2VpZ2h0cy54O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy55KV0gKiBhX0JvbmVXZWlnaHRzLnk7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLnopXSAqIGFfQm9uZVdlaWdodHMuejtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMudyldICogYV9Cb25lV2VpZ2h0cy53O1xyXG4gICAgICAgIHZlYzQgcG9zaXRpb249c2tpblRyYW5zZm9ybSphX1Bvc2l0aW9uO1xyXG4gICAgICAgIHZfUG9zaXRpb249cG9zaXRpb24ueHl6O1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBwb3NpdGlvbjtcclxuICAgICNlbHNlXHJcbiAgICAgICAgdl9Qb3NpdGlvbj1hX1Bvc2l0aW9uLnh5ejtcclxuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfTXZwTWF0cml4ICogYV9Qb3NpdGlvbjtcclxuICAgICNlbmRpZlxyXG4gICAgICAgIFxyXG4gICAgLy9UT0RP5rKh6ICD6JmRVVbliqjnlLvlkaJcclxuICAgICNpZiBkZWZpbmVkKERJRkZVU0VNQVApJiZkZWZpbmVkKEFMUEhBVEVTVClcclxuICAgICAgICB2X1RleGNvb3JkMD1hX1RleGNvb3JkMDtcclxuICAgICNlbmRpZlxyXG4gICAgICAgIHZfcG9zVmlld1ogPSBnbF9Qb3NpdGlvbi56O1xyXG59XHJcblxyXG5tYXQzIGludmVyc2UobWF0MyBtKSB7XHJcbiAgICBmbG9hdCBhMDAgPSBtWzBdWzBdLCBhMDEgPSBtWzBdWzFdLCBhMDIgPSBtWzBdWzJdO1xyXG4gICAgZmxvYXQgYTEwID0gbVsxXVswXSwgYTExID0gbVsxXVsxXSwgYTEyID0gbVsxXVsyXTtcclxuICAgIGZsb2F0IGEyMCA9IG1bMl1bMF0sIGEyMSA9IG1bMl1bMV0sIGEyMiA9IG1bMl1bMl07XHJcblxyXG4gICAgZmxvYXQgYjAxID0gYTIyICogYTExIC0gYTEyICogYTIxO1xyXG4gICAgZmxvYXQgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMDtcclxuICAgIGZsb2F0IGIyMSA9IGEyMSAqIGExMCAtIGExMSAqIGEyMDtcclxuXHJcbiAgICBmbG9hdCBkZXQgPSBhMDAgKiBiMDEgKyBhMDEgKiBiMTEgKyBhMDIgKiBiMjE7XHJcblxyXG4gICAgcmV0dXJuIG1hdDMoYjAxLCAoLWEyMiAqIGEwMSArIGEwMiAqIGEyMSksIChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpLFxyXG4gICAgICAgICAgICAgICAgYjExLCAoYTIyICogYTAwIC0gYTAyICogYTIwKSwgKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApLFxyXG4gICAgICAgICAgICAgICAgYjIxLCAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCksIChhMTEgKiBhMDAgLSBhMDEgKiBhMTApKSAvIGRldDtcclxufVxyXG5cclxudm9pZCBtYWluX25vcm1hbCgpXHJcbntcclxuICAgICNpZmRlZiBCT05FXHJcbiAgICAgICAgbWF0NCBza2luVHJhbnNmb3JtID0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy54KV0gKiBhX0JvbmVXZWlnaHRzLng7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLnkpXSAqIGFfQm9uZVdlaWdodHMueTtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueildICogYV9Cb25lV2VpZ2h0cy56O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy53KV0gKiBhX0JvbmVXZWlnaHRzLnc7XHJcbiAgICAgICAgdmVjNCBwb3NpdGlvbj1za2luVHJhbnNmb3JtKmFfUG9zaXRpb247XHJcbiAgICAgICAgdl9Qb3NpdGlvbj1wb3NpdGlvbi54eXo7XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X012cE1hdHJpeCAqIHBvc2l0aW9uO1xyXG4gICAgI2Vsc2VcclxuICAgICAgICB2X1Bvc2l0aW9uPWFfUG9zaXRpb24ueHl6O1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBhX1Bvc2l0aW9uO1xyXG4gICAgI2VuZGlmXHJcblxyXG4gICAgI2lmZGVmIEJPTkVcclxuICAgICAgICB3b3JsZEludk1hdD1pbnZlcnNlKG1hdDModV9Xb3JsZE1hdCpza2luVHJhbnNmb3JtKSk7XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIHdvcmxkSW52TWF0PWludmVyc2UobWF0Myh1X1dvcmxkTWF0KSk7XHJcbiAgICAjZW5kaWYgIFxyXG4gICAgdl9Ob3JtYWw9YV9Ob3JtYWwqd29ybGRJbnZNYXQ7XHJcblxyXG4gICAgdl9UYW5nZW50PWFfVGFuZ2VudDAueHl6KndvcmxkSW52TWF0O1xyXG4gICAgdl9CaW5vcm1hbD1jcm9zcyh2X05vcm1hbCx2X1RhbmdlbnQpKmFfVGFuZ2VudDAudztcclxuXHJcbiAgICAjaWZkZWYgQk9ORVxyXG4gICAgICAgIHZfUG9zaXRpb25Xb3JsZD0odV9Xb3JsZE1hdCpwb3NpdGlvbikueHl6O1xyXG4gICAgI2Vsc2VcclxuICAgICAgICB2X1Bvc2l0aW9uV29ybGQ9KHVfV29ybGRNYXQqYV9Qb3NpdGlvbikueHl6O1xyXG4gICAgI2VuZGlmXHJcbiAgICBcclxuICAgIHZfVmlld0Rpcj11X0NhbWVyYVBvcy12X1Bvc2l0aW9uV29ybGQ7XHJcblxyXG4gICAgI2lmIGRlZmluZWQoRElGRlVTRU1BUCl8fCgoZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKSkmJihkZWZpbmVkKFNQRUNVTEFSTUFQKXx8ZGVmaW5lZChOT1JNQUxNQVApKSlcclxuICAgICAgICB2X1RleGNvb3JkMD1hX1RleGNvb3JkMDtcclxuICAgICAgICAjaWZkZWYgVElMSU5HT0ZGU0VUXHJcbiAgICAgICAgICAgIHZfVGV4Y29vcmQwPVRyYW5zZm9ybVVWKHZfVGV4Y29vcmQwLHVfVGlsaW5nT2Zmc2V0KTtcclxuICAgICAgICAjZW5kaWZcclxuICAgICNlbmRpZlxyXG5cclxuICAgICNpZmRlZiBMSUdIVE1BUFxyXG4gICAgICAgICNpZmRlZiBTQ0FMRU9GRlNFVExJR0hUSU5HTUFQVVZcclxuICAgICAgICAgICAgI2lmZGVmIFVWMVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPXZlYzIoYV9UZXhjb29yZDEueCwxLjAtYV9UZXhjb29yZDEueSkqdV9MaWdodG1hcFNjYWxlT2Zmc2V0Lnh5K3VfTGlnaHRtYXBTY2FsZU9mZnNldC56dztcclxuICAgICAgICAgICAgI2Vsc2VcclxuICAgICAgICAgICAgICAgIHZfTGlnaHRNYXBVVj12ZWMyKGFfVGV4Y29vcmQwLngsMS4wLWFfVGV4Y29vcmQwLnkpKnVfTGlnaHRtYXBTY2FsZU9mZnNldC54eSt1X0xpZ2h0bWFwU2NhbGVPZmZzZXQuenc7XHJcbiAgICAgICAgICAgICNlbmRpZiBcclxuICAgICAgICAgICAgdl9MaWdodE1hcFVWLnk9MS4wLXZfTGlnaHRNYXBVVi55O1xyXG4gICAgICAgICNlbHNlXHJcbiAgICAgICAgICAgICNpZmRlZiBVVjFcclxuICAgICAgICAgICAgICAgIHZfTGlnaHRNYXBVVj1hX1RleGNvb3JkMTtcclxuICAgICAgICAgICAgI2Vsc2VcclxuICAgICAgICAgICAgICAgIHZfTGlnaHRNYXBVVj1hX1RleGNvb3JkMDtcclxuICAgICAgICAgICAgI2VuZGlmIFxyXG4gICAgICAgICNlbmRpZiBcclxuICAgICNlbmRpZlxyXG5cclxuICAgICNpZiBkZWZpbmVkKENPTE9SKSYmZGVmaW5lZChFTkFCTEVWRVJURVhDT0xPUilcclxuICAgICAgICB2X0NvbG9yPWFfQ29sb3I7XHJcbiAgICAjZW5kaWZcclxuXHJcbiAgICAjaWZkZWYgUkVDRUlWRVNIQURPV1xyXG4gICAgICAgIHZfcG9zVmlld1ogPSBnbF9Qb3NpdGlvbi53O1xyXG4gICAgICAgICNpZmRlZiBTSEFET1dNQVBfUFNTTTEgXHJcbiAgICAgICAgICAgIHZfbGlnaHRNVlBQb3MgPSB1X2xpZ2h0U2hhZG93VlBbMF0gKiB2ZWM0KHZfUG9zaXRpb25Xb3JsZCwxLjApO1xyXG4gICAgICAgICNlbmRpZlxyXG4gICAgI2VuZGlmXHJcbn1cclxuXHJcbi8vLS13bXktbWFpbi0tLS0tLS0tLS0tLS0tLS0tXHJcbm1hdDMgTUFUUklYX0lUX01WKG1hdDQgTW9kZWxWaWV3TWF0cml4KSB7XHJcbiAgICByZXR1cm4gaW52ZXJzZShtYXQzKE1vZGVsVmlld01hdHJpeCkpO1xyXG59XHJcbm1hdDMgZ2V0Um90YXRpb24odmVjNCB3VGFuZ2VudCwgdmVjMyB3Tm9ybWFsKSB7XHJcbiAgICB2ZWMzIGJpbm9ybWFsID0gY3Jvc3Mod05vcm1hbC54eXosIHdUYW5nZW50Lnh5eikgKiAtd1RhbmdlbnQudztcclxuICAgIG1hdDMgcm90YXRpb24gPSBtYXQzKFxyXG4gICAgICAgIHdUYW5nZW50LngsIGJpbm9ybWFsLngsIHdOb3JtYWwueCxcclxuICAgICAgICB3VGFuZ2VudC55LCBiaW5vcm1hbC55LCB3Tm9ybWFsLnksXHJcbiAgICAgICAgd1RhbmdlbnQueiwgYmlub3JtYWwueiwgd05vcm1hbC56KTtcclxuICAgIHJldHVybiByb3RhdGlvbjtcclxufVxyXG51bmlmb3JtIHZlYzQgX3dDb2xvcjtcclxudW5pZm9ybSBtYXQ0IF9PYmplY3QyV29ybGQ7XHJcbnVuaWZvcm0gdmVjNCBfU3BlY3VsYXI7XHJcbnVuaWZvcm0gZmxvYXQgX0dsb3NzO1xyXG5cclxudmFyeWluZyB2ZWMzIGdfd29ybGROb3JtYWw7XHJcbnZhcnlpbmcgdmVjMyBnX3dvcmxkVmlld0RpcjtcclxuXHJcbnZvaWQgd215TWFpbigpe1xyXG4gICAgZ193b3JsZE5vcm1hbCA9IHZfTm9ybWFsO1xyXG4gICAgZ193b3JsZE5vcm1hbC54Kj0tMS4wO1xyXG5cdGdfd29ybGRWaWV3RGlyID0gdl9WaWV3RGlyO1xyXG59XHJcbi8vLS13bXktLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG52b2lkIG1haW4oKVxyXG57XHJcbiAgICAjaWZkZWYgQ0FTVFNIQURPV1xyXG4gICAgICAgIG1haW5fY2FzdFNoYWRvdygpO1xyXG4gICAgI2Vsc2VcclxuICAgICAgICBtYWluX25vcm1hbCgpO1xyXG4gICAgICAgIHdteU1haW4oKTtcclxuICAgICNlbmRpZlxyXG59XHJcbmBcclxuLy9wc1xyXG52c3BzQXJyWzBdWzFdPWBcclxuI2lmZGVmIEhJR0hQUkVDSVNJT05cclxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xyXG4jZWxzZVxyXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcclxuI2VuZGlmXHJcblxyXG4jaW5jbHVkZSAnTGlnaHRpbmcuZ2xzbCc7XHJcblxyXG51bmlmb3JtIHZlYzQgdV9EaWZmdXNlQ29sb3I7XHJcblxyXG4jaWYgZGVmaW5lZChDT0xPUikmJmRlZmluZWQoRU5BQkxFVkVSVEVYQ09MT1IpXHJcbiAgICB2YXJ5aW5nIHZlYzQgdl9Db2xvcjtcclxuI2VuZGlmXHJcblxyXG52YXJ5aW5nIHZlYzMgdl9WaWV3RGlyOyBcclxuXHJcbiNpZmRlZiBBTFBIQVRFU1RcclxuICAgIHVuaWZvcm0gZmxvYXQgdV9BbHBoYVRlc3RWYWx1ZTtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgRElGRlVTRU1BUFxyXG4gICAgdW5pZm9ybSBzYW1wbGVyMkQgdV9EaWZmdXNlVGV4dHVyZTtcclxuI2VuZGlmXHJcblxyXG4jaWYgZGVmaW5lZChESUZGVVNFTUFQKXx8KChkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpKSYmKGRlZmluZWQoU1BFQ1VMQVJNQVApfHxkZWZpbmVkKE5PUk1BTE1BUCkpKVxyXG4gICAgdmFyeWluZyB2ZWMyIHZfVGV4Y29vcmQwO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBMSUdIVE1BUFxyXG4gICAgdmFyeWluZyB2ZWMyIHZfTGlnaHRNYXBVVjtcclxuICAgIHVuaWZvcm0gc2FtcGxlcjJEIHVfTGlnaHRNYXA7XHJcbiNlbmRpZlxyXG5cclxuI2lmIGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVClcclxuICAgIHVuaWZvcm0gdmVjMyB1X01hdGVyaWFsU3BlY3VsYXI7XHJcbiAgICB1bmlmb3JtIGZsb2F0IHVfU2hpbmluZXNzO1xyXG4gICAgI2lmZGVmIFNQRUNVTEFSTUFQIFxyXG4gICAgICAgIHVuaWZvcm0gc2FtcGxlcjJEIHVfU3BlY3VsYXJUZXh0dXJlO1xyXG4gICAgI2VuZGlmXHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIEZPR1xyXG4gICAgdW5pZm9ybSBmbG9hdCB1X0ZvZ1N0YXJ0O1xyXG4gICAgdW5pZm9ybSBmbG9hdCB1X0ZvZ1JhbmdlO1xyXG4gICAgdW5pZm9ybSB2ZWMzIHVfRm9nQ29sb3I7XHJcbiNlbmRpZlxyXG5cclxudmFyeWluZyB2ZWMzIHZfTm9ybWFsO1xyXG52YXJ5aW5nIHZlYzMgdl9Qb3NpdGlvbjtcclxuXHJcbnVuaWZvcm0gc2FtcGxlcjJEIHVfTm9ybWFsVGV4dHVyZTtcclxudmFyeWluZyB2ZWMzIHZfVGFuZ2VudDtcclxudmFyeWluZyB2ZWMzIHZfQmlub3JtYWw7XHJcblxyXG4jaWZkZWYgRElSRUNUSU9OTElHSFRcclxuICAgIHVuaWZvcm0gRGlyZWN0aW9uTGlnaHQgdV9EaXJlY3Rpb25MaWdodDtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgUE9JTlRMSUdIVFxyXG4gICAgdW5pZm9ybSBQb2ludExpZ2h0IHVfUG9pbnRMaWdodDtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgU1BPVExJR0hUXHJcbiAgICB1bmlmb3JtIFNwb3RMaWdodCB1X1Nwb3RMaWdodDtcclxuI2VuZGlmXHJcblxyXG51bmlmb3JtIHZlYzMgdV9BbWJpZW50Q29sb3I7XHJcblxyXG5cclxuI2lmIGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKXx8ZGVmaW5lZChSRUNFSVZFU0hBRE9XKVxyXG4gICAgdmFyeWluZyB2ZWMzIHZfUG9zaXRpb25Xb3JsZDtcclxuI2VuZGlmXHJcblxyXG4jaW5jbHVkZSAnU2hhZG93SGVscGVyLmdsc2wnXHJcbnZhcnlpbmcgZmxvYXQgdl9wb3NWaWV3WjtcclxuI2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuICAgICNpZiBkZWZpbmVkKFNIQURPV01BUF9QU1NNMil8fGRlZmluZWQoU0hBRE9XTUFQX1BTU00zKVxyXG4gICAgICAgIHVuaWZvcm0gbWF0NCB1X2xpZ2h0U2hhZG93VlBbNF07XHJcbiAgICAjZW5kaWZcclxuICAgICNpZmRlZiBTSEFET1dNQVBfUFNTTTEgXHJcbiAgICAgICAgdmFyeWluZyB2ZWM0IHZfbGlnaHRNVlBQb3M7XHJcbiAgICAjZW5kaWZcclxuI2VuZGlmXHJcblxyXG52b2lkIG1haW5fY2FzdFNoYWRvdygpXHJcbntcclxuICAgIC8vZ2xfRnJhZ0NvbG9yPXZlYzQodl9wb3NWaWV3WiwwLjAsMC4wLDEuMCk7XHJcbiAgICBnbF9GcmFnQ29sb3I9cGFja0RlcHRoKHZfcG9zVmlld1opO1xyXG4gICAgI2lmIGRlZmluZWQoRElGRlVTRU1BUCkmJmRlZmluZWQoQUxQSEFURVNUKVxyXG4gICAgICAgIGZsb2F0IGFscGhhID0gdGV4dHVyZTJEKHVfRGlmZnVzZVRleHR1cmUsdl9UZXhjb29yZDApLnc7XHJcbiAgICAgICAgaWYoIGFscGhhIDwgdV9BbHBoYVRlc3RWYWx1ZSApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNjYXJkO1xyXG4gICAgICAgIH1cclxuICAgICNlbmRpZlxyXG59XHJcblxyXG4vLy0td215LW1haW4tLS0tLS0tLS0tLS0tLS0tLVxyXG52ZWM0IGxlcnBWNCh2ZWM0IGEsIHZlYzQgYiwgZmxvYXQgcykgeyByZXR1cm4gdmVjNChhICsgKGIgLSBhKSpzKTsgfVxyXG52ZWMzIGxlcnBWMyh2ZWMzIGEsIHZlYzMgYiwgZmxvYXQgcykgeyByZXR1cm4gdmVjMyhhICsgKGIgLSBhKSpzKTsgfVxyXG52ZWMyIGxlcnBWMih2ZWMyIGEsIHZlYzIgYiwgZmxvYXQgcykgeyByZXR1cm4gdmVjMihhICsgKGIgLSBhKSpzKTsgfVxyXG5mbG9hdCBsZXJwRihmbG9hdCBhLCBmbG9hdCBiLCBmbG9hdCBzKSB7IHJldHVybiBmbG9hdChhICsgKGIgLSBhKSAqIHMpOyB9XHJcbmZsb2F0IHNhdHVyYXRlKGZsb2F0IG4pIHsgcmV0dXJuIGNsYW1wKG4sIDAuMCwgMS4wKTsgfVxyXG52ZWMzIFVucGFja05vcm1hbCh2ZWM0IHBhY2tlZG5vcm1hbCkge1xyXG5cdC8vIFRoaXMgZG8gdGhlIHRyaWNrXHJcblx0cGFja2Vkbm9ybWFsLnggKj0gcGFja2Vkbm9ybWFsLnc7XHJcblx0dmVjMyBub3JtYWw7XHJcblx0bm9ybWFsLnh5ID0gcGFja2Vkbm9ybWFsLnh5ICogMi4wIC0gMS4wO1xyXG5cdG5vcm1hbC56ID0gc3FydCgxLjAgLSBzYXR1cmF0ZShkb3Qobm9ybWFsLnh5LCBub3JtYWwueHkpKSk7XHJcblx0cmV0dXJuIG5vcm1hbDtcclxufVxyXG5cclxudW5pZm9ybSB2ZWM0IF93Q29sb3I7XHJcbnVuaWZvcm0gbWF0NCBfT2JqZWN0MldvcmxkO1xyXG51bmlmb3JtIHZlYzQgX1NwZWN1bGFyO1xyXG51bmlmb3JtIGZsb2F0IF9HbG9zcztcclxuXHJcbnZhcnlpbmcgdmVjMyBnX3dvcmxkTm9ybWFsO1xyXG52YXJ5aW5nIHZlYzMgZ193b3JsZFZpZXdEaXI7XHJcblxyXG52ZWM0IHdteU1haW4odmVjNCBfbWFpbkNvbG9yLCB2ZWMzIF9nbG9iYWxEaWZmdXNlLCB2ZWMzIF9kaWZmdXNlLCBmbG9hdCBzaGFkb3dWYWx1ZSl7XHJcbiAgICB2ZWM0IHdteUNvbG9yPV9tYWluQ29sb3I7XHJcblxyXG5cdC8vIHZlYzMgYW1iaWVudCA9dV9BbWJpZW50Q29sb3IvMi4wO1xyXG5cdC8vIHZlYzMgbGlnaHREaXIgPSBub3JtYWxpemUoLXVfRGlyZWN0aW9uTGlnaHQuRGlyZWN0aW9uLnh5eik7XHJcblx0Ly8gZmxvYXQgaGFsZkxhbWJlcnQgPSBkb3QoZ193b3JsZE5vcm1hbCwgbGlnaHREaXIpICogMC41ICsgMS4wO1xyXG5cdC8vIHZlYzMgZGlmZnVzZSA9IHVfRGlyZWN0aW9uTGlnaHQuQ29sb3IucmdiICogaGFsZkxhbWJlcnQgKl93Q29sb3IucmdiO1xyXG5cdFx0XHRcdFxyXG5cdC8vIHZlYzMgY29sb3IgPSBkaWZmdXNlO1xyXG5cclxuXHQvLyB2ZWMzIHZpZXdEaXIgPSBub3JtYWxpemUoZ193b3JsZFZpZXdEaXIpO1xyXG5cdC8vIHZlYzMgaGFsZkRpciA9IG5vcm1hbGl6ZSh2aWV3RGlyICsgbGlnaHREaXIpO1xyXG5cdC8vIHZlYzMgc3BlY3VsYXIgPSB2ZWMzKDAuMCk7XHJcblx0Ly8gc3BlY3VsYXIgPSBfU3BlY3VsYXIucmdiICogcG93KG1heChkb3QoZ193b3JsZE5vcm1hbCwgaGFsZkRpciksIDAuMCksIF9HbG9zcyk7XHJcblx0Ly8gY29sb3IgKz0gc3BlY3VsYXI7XHJcblxyXG4gICAgLy8gY29sb3IgKj0gMS41O1xyXG4gICAgLy8gY29sb3IrPXNoYWRvd1ZhbHVlKjAuMTtcclxuXHR3bXlDb2xvciA9IHZlYzQoMCwwLDAsIDEuMCk7XHJcblxyXG4vL1xyXG5yZXR1cm4gd215Q29sb3I7XHJcbn1cclxuLy8tLXdteS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbnZvaWQgbWFpbl9ub3JtYWwoKVxyXG57XHJcblx0dmVjMyBnbG9iYWxEaWZmdXNlPXVfQW1iaWVudENvbG9yO1xyXG5cdCNpZmRlZiBMSUdIVE1BUFx0XHJcblx0XHRnbG9iYWxEaWZmdXNlICs9IERlY29kZUxpZ2h0bWFwKHRleHR1cmUyRCh1X0xpZ2h0TWFwLCB2X0xpZ2h0TWFwVVYpKTtcclxuXHQjZW5kaWZcclxuXHRcclxuXHQjaWYgZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKVxyXG5cdFx0dmVjMyBub3JtYWw7XHJcblx0XHQjaWYgKGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVCkpJiZkZWZpbmVkKE5PUk1BTE1BUClcclxuXHRcdFx0dmVjMyBub3JtYWxNYXBTYW1wbGUgPSB0ZXh0dXJlMkQodV9Ob3JtYWxUZXh0dXJlLCB2X1RleGNvb3JkMCkucmdiO1xyXG5cdFx0XHRub3JtYWwgPSBub3JtYWxpemUoTm9ybWFsU2FtcGxlVG9Xb3JsZFNwYWNlKG5vcm1hbE1hcFNhbXBsZSwgdl9Ob3JtYWwsIHZfVGFuZ2VudCx2X0Jpbm9ybWFsKSk7XHJcblx0XHQjZWxzZVxyXG5cdFx0XHRub3JtYWwgPSBub3JtYWxpemUodl9Ob3JtYWwpO1xyXG5cdFx0I2VuZGlmXHJcblx0XHR2ZWMzIHZpZXdEaXI9IG5vcm1hbGl6ZSh2X1ZpZXdEaXIpO1xyXG5cdCNlbmRpZlxyXG5cdFxyXG5cdHZlYzQgbWFpbkNvbG9yPXVfRGlmZnVzZUNvbG9yO1xyXG5cdCNpZmRlZiBESUZGVVNFTUFQXHJcblx0XHR2ZWM0IGRpZlRleENvbG9yPXRleHR1cmUyRCh1X0RpZmZ1c2VUZXh0dXJlLCB2X1RleGNvb3JkMCk7XHJcblx0XHRtYWluQ29sb3I9bWFpbkNvbG9yKmRpZlRleENvbG9yO1xyXG5cdCNlbmRpZiBcclxuXHQjaWYgZGVmaW5lZChDT0xPUikmJmRlZmluZWQoRU5BQkxFVkVSVEVYQ09MT1IpXHJcblx0XHRtYWluQ29sb3I9bWFpbkNvbG9yKnZfQ29sb3I7XHJcblx0I2VuZGlmIFxyXG4gICAgXHJcblx0I2lmZGVmIEFMUEhBVEVTVFxyXG5cdFx0aWYobWFpbkNvbG9yLmE8dV9BbHBoYVRlc3RWYWx1ZSlcclxuXHRcdFx0ZGlzY2FyZDtcclxuXHQjZW5kaWZcclxuICBcclxuXHR2ZWMzIGRpZmZ1c2UgPSB2ZWMzKDAuMCk7XHJcblx0dmVjMyBzcGVjdWxhcj0gdmVjMygwLjApO1xyXG5cdCNpZiBkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpXHJcblx0XHR2ZWMzIGRpZixzcGU7XHJcblx0XHQjaWZkZWYgU1BFQ1VMQVJNQVBcclxuXHRcdFx0dmVjMyBnbG9zcz10ZXh0dXJlMkQodV9TcGVjdWxhclRleHR1cmUsIHZfVGV4Y29vcmQwKS5yZ2I7XHJcblx0XHQjZWxzZVxyXG5cdFx0XHQjaWZkZWYgRElGRlVTRU1BUFxyXG5cdFx0XHRcdHZlYzMgZ2xvc3M9dmVjMyhkaWZUZXhDb2xvci5hKTtcclxuXHRcdFx0I2Vsc2VcclxuXHRcdFx0XHR2ZWMzIGdsb3NzPXZlYzMoMS4wKTtcclxuXHRcdFx0I2VuZGlmXHJcblx0XHQjZW5kaWZcclxuXHQjZW5kaWZcclxuXHJcblx0I2lmZGVmIERJUkVDVElPTkxJR0hUXHJcblx0XHRMYXlhQWlyQmxpbm5QaG9uZ0RpZWN0aW9uTGlnaHQodV9NYXRlcmlhbFNwZWN1bGFyLHVfU2hpbmluZXNzLG5vcm1hbCxnbG9zcyx2aWV3RGlyLHVfRGlyZWN0aW9uTGlnaHQsZGlmLHNwZSk7XHJcblx0XHRkaWZmdXNlKz1kaWY7XHJcblx0XHRzcGVjdWxhcis9c3BlO1xyXG5cdCNlbmRpZlxyXG4gXHJcblx0I2lmZGVmIFBPSU5UTElHSFRcclxuXHRcdExheWFBaXJCbGlublBob25nUG9pbnRMaWdodCh2X1Bvc2l0aW9uV29ybGQsdV9NYXRlcmlhbFNwZWN1bGFyLHVfU2hpbmluZXNzLG5vcm1hbCxnbG9zcyx2aWV3RGlyLHVfUG9pbnRMaWdodCxkaWYsc3BlKTtcclxuXHRcdGRpZmZ1c2UrPWRpZjtcclxuXHRcdHNwZWN1bGFyKz1zcGU7XHJcblx0I2VuZGlmXHJcblxyXG5cdCNpZmRlZiBTUE9UTElHSFRcclxuXHRcdExheWFBaXJCbGlublBob25nU3BvdExpZ2h0KHZfUG9zaXRpb25Xb3JsZCx1X01hdGVyaWFsU3BlY3VsYXIsdV9TaGluaW5lc3Msbm9ybWFsLGdsb3NzLHZpZXdEaXIsdV9TcG90TGlnaHQsZGlmLHNwZSk7XHJcblx0XHRkaWZmdXNlKz1kaWY7XHJcblx0XHRzcGVjdWxhcis9c3BlO1xyXG5cdCNlbmRpZlxyXG5cdFxyXG5cdCNpZmRlZiBSRUNFSVZFU0hBRE9XXHJcblx0XHRmbG9hdCBzaGFkb3dWYWx1ZSA9IDEuMDtcclxuXHRcdCNpZmRlZiBTSEFET1dNQVBfUFNTTTNcclxuXHRcdFx0c2hhZG93VmFsdWUgPSBnZXRTaGFkb3dQU1NNMyggdV9zaGFkb3dNYXAxLHVfc2hhZG93TWFwMix1X3NoYWRvd01hcDMsdV9saWdodFNoYWRvd1ZQLHVfc2hhZG93UFNTTURpc3RhbmNlLHVfc2hhZG93UENGb2Zmc2V0LHZfUG9zaXRpb25Xb3JsZCx2X3Bvc1ZpZXdaLDAuMDAxKTtcclxuXHRcdCNlbmRpZlxyXG5cdFx0I2lmZGVmIFNIQURPV01BUF9QU1NNMlxyXG5cdFx0XHRzaGFkb3dWYWx1ZSA9IGdldFNoYWRvd1BTU00yKCB1X3NoYWRvd01hcDEsdV9zaGFkb3dNYXAyLHVfbGlnaHRTaGFkb3dWUCx1X3NoYWRvd1BTU01EaXN0YW5jZSx1X3NoYWRvd1BDRm9mZnNldCx2X1Bvc2l0aW9uV29ybGQsdl9wb3NWaWV3WiwwLjAwMSk7XHJcblx0XHQjZW5kaWYgXHJcblx0XHQjaWZkZWYgU0hBRE9XTUFQX1BTU00xXHJcblx0XHRcdHNoYWRvd1ZhbHVlID0gZ2V0U2hhZG93UFNTTTEoIHVfc2hhZG93TWFwMSx2X2xpZ2h0TVZQUG9zLHVfc2hhZG93UFNTTURpc3RhbmNlLHVfc2hhZG93UENGb2Zmc2V0LHZfcG9zVmlld1osMC4wMDEpO1xyXG5cdFx0I2VuZGlmXHJcblx0XHQvL2dsX0ZyYWdDb2xvciA9dmVjNChtYWluQ29sb3IucmdiKihnbG9iYWxEaWZmdXNlICsgZGlmZnVzZSkqc2hhZG93VmFsdWUsbWFpbkNvbG9yLmEpO1xyXG5cdFx0Ly9nbF9GcmFnQ29sb3IgPSB3bXlNYWluKG1haW5Db2xvciwoZ2xvYmFsRGlmZnVzZSArIGRpZmZ1c2UgKiBzaGFkb3dWYWx1ZSAqIDEuMSkpO1xyXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHdteU1haW4obWFpbkNvbG9yLGdsb2JhbERpZmZ1c2UsZGlmZnVzZSxzaGFkb3dWYWx1ZSk7XHJcblx0I2Vsc2VcclxuXHRcdC8vZ2xfRnJhZ0NvbG9yID12ZWM0KG1haW5Db2xvci5yZ2IqKGdsb2JhbERpZmZ1c2UgKyBkaWZmdXNlKSxtYWluQ29sb3IuYSk7XHJcblx0XHRnbF9GcmFnQ29sb3IgPSB3bXlNYWluKG1haW5Db2xvcixnbG9iYWxEaWZmdXNlLGRpZmZ1c2UsMS4wKTtcclxuXHQjZW5kaWZcclxuICAgIC8qXHJcblx0I2lmIGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVClcclxuXHRcdCNpZmRlZiBSRUNFSVZFU0hBRE9XXHJcblx0XHRcdGdsX0ZyYWdDb2xvci5yZ2IrPXNwZWN1bGFyKnNoYWRvd1ZhbHVlO1xyXG5cdFx0I2Vsc2VcclxuXHRcdFx0Z2xfRnJhZ0NvbG9yLnJnYis9c3BlY3VsYXI7XHJcblx0XHQjZW5kaWZcclxuXHQjZW5kaWZcclxuXHQqL1xyXG5cdCNpZmRlZiBGT0dcclxuXHRcdGZsb2F0IGxlcnBGYWN0PWNsYW1wKCgxLjAvZ2xfRnJhZ0Nvb3JkLnctdV9Gb2dTdGFydCkvdV9Gb2dSYW5nZSwwLjAsMS4wKTtcclxuXHRcdGdsX0ZyYWdDb2xvci5yZ2I9bWl4KGdsX0ZyYWdDb2xvci5yZ2IsdV9Gb2dDb2xvcixsZXJwRmFjdCk7XHJcblx0I2VuZGlmXHJcbn1cclxuXHJcbnZvaWQgbWFpbigpXHJcbntcclxuXHQjaWZkZWYgQ0FTVFNIQURPV1x0XHRcclxuXHRcdG1haW5fY2FzdFNoYWRvdygpO1xyXG5cdCNlbHNlXHJcblx0XHRtYWluX25vcm1hbCgpO1xyXG5cdCNlbmRpZiAgXHJcbn1cclxuYFxyXG4vL+a4suafk+aooeW8j1xyXG52c3BzQXJyWzBdWzJdPXt9O1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2c3BzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZzcHMgPSB2c3BzQXJyW2ldO1xyXG4gICAgICAgICAgICB0aGlzLm9uU2V0VnNQcyh2c3BzWzBdLCB2c3BzWzFdLCB2c3BzWzJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlTaGFkZXJNYWd7XHJcbiAgICBwcml2YXRlIG9iajtcclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMub2JqPXJlcXVpcmUoJy4vV215TGF5YV93bXlMYnQnKVsnZGVmYXVsdCddO2lmKHRoaXMub2JqKW5ldyB0aGlzLm9iaigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwiLyp3bXnniYjmnKxfMjAxOC8xMi8zMC8qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlVM2RJbXBvcnQge1xucHVibGljIHN0YXRpYyBUc19ETGlnaHQ9cmVxdWlyZSgnLi90cy9Uc19ETGlnaHQnKVsnZGVmYXVsdCddO1xucHVibGljIHN0YXRpYyBUc19TY2VuZT1yZXF1aXJlKCcuL3RzL1RzX1NjZW5lJylbJ2RlZmF1bHQnXTtcbnB1YmxpYyBzdGF0aWMgVHNfQzREVmV0ZXhBbmltYXRvcj1yZXF1aXJlKCcuL3RzL1RzX0M0RFZldGV4QW5pbWF0b3InKVsnZGVmYXVsdCddO1xucHVibGljIHN0YXRpYyBUc19NYXRzPXJlcXVpcmUoJy4vdHMvVHNfTWF0cycpWydkZWZhdWx0J107XHJcbi8v5omp5bGVXHJcbnB1YmxpYyBzdGF0aWMgV215QzREVmV0ZXhBbmltYXRvcj1yZXF1aXJlKCcuLi9fd215VXRpbHNINS9kMy9jNGQvV215QzREVmV0ZXhBbmltYXRvcicpWydkZWZhdWx0J107XHJcbnB1YmxpYyBzdGF0aWMgV215UGh5c2ljc19DaGFyYWN0ZXI9cmVxdWlyZSgnLi4vX3dteVV0aWxzSDUvZDMvcGh5c2ljcy9XbXlQaHlzaWNzV29ybGRfQ2hhcmFjdGVyJylbJ2RlZmF1bHQnXTtcclxuLy9MYXlhXHJcbnB1YmxpYyBzdGF0aWMgQW5pbWF0b3I9TGF5YS5BbmltYXRvcjtcclxuLy9cclxucHVibGljIHN0YXRpYyBnZXRDbGFzcyhuYW1lKXtcclxuICAgIHJldHVybiB0aGlzW25hbWVdO1xyXG59XHJcbn1cclxuIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteVUzZFRzQ29uZmlnIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgdHNDb25maWc9W1xue1wiY190c1wiOlwiVHNfTWF0c1wiLFxuXCJ0YXJnZXRVcmxBcnJcIjpbXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzVfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzFfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDZfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjhfQzJVX1xcdTVFNzNcXHU5NzYyMV84L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMF9DMlVfXFx1NUU3M1xcdTk3NjIxXzEwL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMF9DMlVfXFx1NUU3M1xcdTk3NjIxL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zM19DMlVfXFx1NUU3M1xcdTk3NjIxXzEzL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNl9DMlVfXFx1NUU3M1xcdTk3NjIxXzYvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMyX0MyVV9cXHU1RTczXFx1OTc2MjFfMTIvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIzX0MyVV9cXHU1RTczXFx1OTc2MjFfMy93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjlfQzJVX1xcdTVFNzNcXHU5NzYyMV85L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai80OV9DMlVfXFx1NUM5QjEvMjIwX0MyVV9cXHU1QzcxLzIyMl9DMlVfc2hhbl8xXCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI0X0MyVV9cXHU1RTczXFx1OTc2MjFfNC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDJfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjdfQzJVX1xcdTVFNzNcXHU5NzYyMV83L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80N19DMlVfXFx1NUU3M1xcdTk3NjIxXzI3L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80NF9DMlVfXFx1NUU3M1xcdTk3NjIxXzI0L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zOF9DMlVfXFx1NUU3M1xcdTk3NjIxXzE4L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNV9DMlVfXFx1NUU3M1xcdTk3NjIxXzUvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM2X0MyVV9cXHU1RTczXFx1OTc2MjFfMTYvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIyX0MyVV9cXHU1RTczXFx1OTc2MjFfMi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzIyMF9DMlVfXFx1NUM3MS8yMjNfQzJVX3NoYW5fM1wiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80MF9DMlVfXFx1NUU3M1xcdTk3NjIxXzIwL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zN19DMlVfXFx1NUU3M1xcdTk3NjIxXzE3L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80OF9DMlVfXFx1NUU3M1xcdTk3NjIxXzI4L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMV9DMlVfXFx1NUU3M1xcdTk3NjIxXzEvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS8yMjBfQzJVX1xcdTVDNzEvMjI0X0MyVV9zaGFuXzRcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzIyMF9DMlVfXFx1NUM3MS8yMjFfQzJVX3NoYW5fMl8xXCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ1X0MyVV9cXHU1RTczXFx1OTc2MjFfMjUvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS81MF9DMlVfZGFvXzFcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIkZhbHNlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiVHJ1ZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzRfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzlfQzJVX1xcdTVFNzNcXHU5NzYyMV8xOS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDFfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDNfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMy93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX1cbl19LFxue1wiY190c1wiOlwiVHNfQzREVmV0ZXhBbmltYXRvclwiLFxuXCJ0YXJnZXRVcmxBcnJcIjpbXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjVfQzJVX1xcdTVFNzNcXHU5NzYyMV81L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDJfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQwX0MyVV9cXHU1RTczXFx1OTc2MjFfMjAvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMl9DMlVfXFx1NUU3M1xcdTk3NjIxXzIvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zN19DMlVfXFx1NUU3M1xcdTk3NjIxXzE3L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjNfQzJVX1xcdTVFNzNcXHU5NzYyMV8zL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjZfQzJVX1xcdTVFNzNcXHU5NzYyMV82L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDFfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIwX0MyVV9cXHU1RTczXFx1OTc2MjEvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMV9DMlVfXFx1NUU3M1xcdTk3NjIxXzEvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yOV9DMlVfXFx1NUU3M1xcdTk3NjIxXzkvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80NV9DMlVfXFx1NUU3M1xcdTk3NjIxXzI1L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzFfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI3X0MyVV9cXHU1RTczXFx1OTc2MjFfNy93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ0X0MyVV9cXHU1RTczXFx1OTc2MjFfMjQvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80M19DMlVfXFx1NUU3M1xcdTk3NjIxXzIzL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzBfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM1X0MyVV9cXHU1RTczXFx1OTc2MjFfMTUvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNF9DMlVfXFx1NUU3M1xcdTk3NjIxXzQvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zM19DMlVfXFx1NUU3M1xcdTk3NjIxXzEzL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzhfQzJVX1xcdTVFNzNcXHU5NzYyMV8xOC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI4X0MyVV9cXHU1RTczXFx1OTc2MjFfOC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM5X0MyVV9cXHU1RTczXFx1OTc2MjFfMTkvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80N19DMlVfXFx1NUU3M1xcdTk3NjIxXzI3L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzRfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM2X0MyVV9cXHU1RTczXFx1OTc2MjFfMTYvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMl9DMlVfXFx1NUU3M1xcdTk3NjIxXzEyL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDZfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ4X0MyVV9cXHU1RTczXFx1OTc2MjFfMjgvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fVxuXX0sXG57XCJjX3RzXCI6XCJUc19TY2VuZVwiLFxuXCJ0YXJnZXRVcmxBcnJcIjpbXG57XCJ1cmxcIjpcInNjZW5lXCIsXG5cImluaXREYXRhXCI6e319XG5dfSxcbntcImNfdHNcIjpcIlRzX0RMaWdodFwiLFxuXCJ0YXJnZXRVcmxBcnJcIjpbXG57XCJ1cmxcIjpcIkRpcmVjdGlvbmFsIGxpZ2h0XCIsXG5cImluaXREYXRhXCI6e1wiY2FtZXJhVXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvNF9DMlVfXFx1OEY2OFxcdThGRjlcXHU1MkE4XFx1NzUzQi81X0MyVV9zaGV4aWFuZ2ppLzZfQzJVX1xcdTY0NDRcXHU1MENGXFx1NjczQVwiLFxuXCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIn19XG5dfVxuXTtcclxufVxyXG4iLCIvKndteeeJiOacrF8yMDE4LzEyLzI4LzEzOjE5Ki9cclxuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XHJcbmltcG9ydCBXbXlVM2RUc0NvbmZpZyBmcm9tICcuL1dteVUzZFRzQ29uZmlnJztcclxuaW1wb3J0IFdteVUzZEltcG9ydCBmcm9tICcuL1dteVUzZEltcG9ydCc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteVUzZFRzTWFnIGV4dGVuZHMgV215U2NyaXB0M0Qge1xyXG4gICAgcHVibGljIG9uQXdha2UoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBXbXlVM2RUc0NvbmZpZy50c0NvbmZpZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB0c09iaiA9IFdteVUzZFRzQ29uZmlnLnRzQ29uZmlnW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFRzKHRzT2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZGRUcyhjb25maWdPYmope1xyXG4gICAgICAgIGlmKGNvbmZpZ09iaj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIGNfdHM9Y29uZmlnT2JqWydjX3RzJ107XHJcbiAgICAgICAgdmFyIHRzPVdteVUzZEltcG9ydC5nZXRDbGFzcyhjX3RzKTtcclxuICAgICAgICB2YXIgdGFyZ2V0VXJsQXJyOnN0cmluZz1jb25maWdPYmpbJ3RhcmdldFVybEFyciddO1xyXG4gICAgICAgIGlmKCF0YXJnZXRVcmxBcnIgfHwgIXRzKXJldHVybjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcmdldFVybEFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRVcmxEYXRhID0gdGFyZ2V0VXJsQXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgdXJsPXRhcmdldFVybERhdGFbJ3VybCddO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0PVdteVUzZFRzTWFnLmdldE9iajNkVXJsKHRoaXMuc2NlbmUzRCx1cmwpO1xyXG4gICAgICAgICAgICBpZih0YXJnZXQhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1RzPXRhcmdldC5hZGRDb21wb25lbnQodHMpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGluaXREYXRhPXRhcmdldFVybERhdGFbJ2luaXREYXRhJ107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gaW5pdERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgVmFsdWU6YW55PWluaXREYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc05hTihWYWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoVmFsdWUuaW5kZXhPZignLicpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWYWx1ZT1wYXJzZUZsb2F0KFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWU9cGFyc2VJbnQoVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihWYWx1ZS5pbmRleE9mKCdUcnVlJyk+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlPXRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKFZhbHVlLmluZGV4T2YoJ0ZhbHNlJyk+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1RzW2tleV0gPSBWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkVXJsKHRhcmdldCx1cmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgYXJyVXJsPXVybC5zcGxpdCgnLycpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0LGFyclVybCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgX2dldE9iakFyclVybCh0YXJnZXQsdXJsQXJyOkFycmF5PHN0cmluZz4saWQ9MCl7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYoX3RhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgbmE9dXJsQXJyW2lkXTtcclxuICAgICAgICB2YXIgdGFyZ2V0T2JqPV90YXJnZXQuZ2V0Q2hpbGRCeU5hbWUobmEpO1xyXG4gICAgICAgIGlmKHRhcmdldE9iaj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihpZD49dXJsQXJyLmxlbmd0aC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGFyZ2V0T2JqPXRoaXMuX2dldE9iakFyclVybCh0YXJnZXRPYmosdXJsQXJyLCsraWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qQzRE6aG254K55Yqo55S7Ki9cbi8qd21554mI5pysXzIwMTgvMTIvMjgqL1xuaW1wb3J0IFdteVUzZEltcG9ydCBmcm9tICcuLi9XbXlVM2RJbXBvcnQnO1xuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi8uLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUc19DNERWZXRleEFuaW1hdG9yIGV4dGVuZHMgV215U2NyaXB0M0Qge1xuXG4gX2M0ZFZldGV4QW5pbWF0b3I6YW55O1xuIF9pbml0UGxheTphbnk9IGZhbHNlO1xuIF9hbmlyOmFueTtcbnB1YmxpYyBvbkF3YWtlKCkge1xuIC8vc2V0U2hvdyhmYWxzZSk7XG4gdGhpcy5fYzRkVmV0ZXhBbmltYXRvciA9IHRoaXMub3duZXIzRC5nZXRDb21wb25lbnQoV215VTNkSW1wb3J0LmdldENsYXNzKCdXbXlDNERWZXRleEFuaW1hdG9yJykpO1xuIGlmICh0aGlzLl9jNGRWZXRleEFuaW1hdG9yID09IG51bGwpIHtcbiB0aGlzLl9jNGRWZXRleEFuaW1hdG9yID0gdGhpcy5vd25lcjNELmFkZENvbXBvbmVudChXbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoJ1dteUM0RFZldGV4QW5pbWF0b3InKSk7XG4gfVxuIHRoaXMuX2FuaXIgPSB0aGlzLm93bmVyM0QuZ2V0Q29tcG9uZW50KFdteVUzZEltcG9ydC5nZXRDbGFzcygnQW5pbWF0b3InKSk7XG4gaWYgKHRoaXMuX2FuaXIgIT0gbnVsbCkge1xuIHRoaXMuX2luaXRQbGF5ID0gZmFsc2U7XG4gdGhpcy5fYW5pci5zcGVlZCA9IDA7XG4gdGhpcy5zZXRTaG93KGZhbHNlKTtcbiB9XG4gXG4gfVxucHVibGljIG9uUHJlUmVuZGVyKCkge1xuIGlmICghdGhpcy5faW5pdFBsYXkpIHtcbiB2YXIgcGFyZW50OmFueT0gdGhpcy5vd25lcjNELnBhcmVudDtcbiBpZiAocGFyZW50LnRyYW5zZm9ybS5sb2NhbFNjYWxlLnggPiAwLjAxIHx8IHBhcmVudC50cmFuc2Zvcm0ubG9jYWxTY2FsZS55ID4gMC4wMSB8fCBwYXJlbnQudHJhbnNmb3JtLmxvY2FsU2NhbGUueiA+IDAuMDEpIHtcbiB0aGlzLl9pbml0UGxheSA9IHRydWU7XG4gdGhpcy5zZXRTaG93KHRydWUpO1xuIHRoaXMuX2FuaXIuc3BlZWQgPSAxO1xuIH1cbiB9XG4gXG4gfVxufVxuIiwiLyrnm7Tnur/nga/lhYkqL1xuLyp3bXnniYjmnKxfMjAxOC8xMi8yOCovXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4uL1dteVUzZEltcG9ydCc7XG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uLy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRzX0RMaWdodCBleHRlbmRzIFdteVNjcmlwdDNEIHtcblxuICAgIFxuICAgIHB1YmxpYyBjYW1lcmFVcmwgPSBcIlwiO1xuICAgIC8q5piv5ZCm5Lqn55Sf6Zi05b2xKi9cbiAgICBwdWJsaWMgaXNDYXN0U2hhZG93OiBhbnkgPSBmYWxzZTtcblxuICAgIHB1YmxpYyBjYW1lcmE6TGF5YS5DYW1lcmE7XG4gICAgcHVibGljIGRpcmVjdGlvbkxpZ2h0OkxheWEuRGlyZWN0aW9uTGlnaHQ7XG4gICAgcHVibGljIG9uU3RhcnQoKSB7XG4gICAgICAgIHRoaXMuY2FtZXJhPXRoaXMuZ2V0T2JqM2RVcmwodGhpcy5zY2VuZTNELHRoaXMuY2FtZXJhVXJsKTtcblxuICAgICAgICB0aGlzLmRpcmVjdGlvbkxpZ2h0PXRoaXMub3duZXIgYXMgTGF5YS5EaXJlY3Rpb25MaWdodDtcbiAgICAgICAgLy/nga/lhYnlvIDlkK/pmLTlvbFcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25MaWdodC5zaGFkb3cgPSB0aGlzLmlzQ2FzdFNoYWRvdztcbiAgICAgICAgLy/nlJ/miJDpmLTlvbHotLTlm77lsLrlr7hcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25MaWdodC5zaGFkb3dSZXNvbHV0aW9uID0gMTQwMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25VcGRhdGUoKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8v5Y+v6KeB6Zi05b2x6Led56a7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbkxpZ2h0LnNoYWRvd0Rpc3RhbmNlID0gdGhpcy5jYW1lcmEudHJhbnNmb3JtLnBvc2l0aW9uLnk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiLyrmnZDotKjmlYjmnpwqL1xuLyp3bXnniYjmnKxfMjAxOC8xMi8yOCovXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4uL1dteVUzZEltcG9ydCc7XG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uLy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRzX01hdHMgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XG5cbiAvKuaYr+WQpuS6p+eUn+mYtOW9sSovXG4gcHVibGljIGlzQ2FzdFNoYWRvdzphbnk9IGZhbHNlO1xuIC8q5piv5ZCm5o6l5pS26Zi05b2xKi9cbiBwdWJsaWMgaXNSZWNlaXZlU2hhZG93OmFueT0gZmFsc2U7XG5wdWJsaWMgb25TdGFydCgpIHtcbiAvKuiuvue9rumYtOW9sSovXG4gdGhpcy5vblNldFNoYWRvdyh0aGlzLmlzQ2FzdFNoYWRvdywgdGhpcy5pc1JlY2VpdmVTaGFkb3cpO1xuIFxuIH1cbiB9XG4iLCIvKuWcuuaZryovXG4vKndteeeJiOacrF8yMDE4LzEyLzI5Ki9cbmltcG9ydCBXbXlVM2RJbXBvcnQgZnJvbSAnLi4vV215VTNkSW1wb3J0JztcbmltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSAnLi4vLi4vX3dteVV0aWxzSDUvZDMvV215U2NyaXB0M0QnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHNfU2NlbmUgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XG5cbiBfYW5pcjphbnk7XG5wdWJsaWMgb25TdGFydCgpIHtcbiB0aGlzLl9hbmlyID0gdGhpcy5vd25lcjNELmdldENvbXBvbmVudChXbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoJ0FuaW1hdG9yJykpO1xuIGlmICh0aGlzLl9hbmlyICE9IG51bGwpIHtcbiB0aGlzLl9hbmlyLnNwZWVkID0gMTtcbiB9XG4gXG4gfVxuIH1cbiJdfQ==
