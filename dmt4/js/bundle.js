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
        if (!this["vConsole"]) {
            this["vConsole"] = new window["VConsole"]();
            this["vConsole"].switchPos.startY = 40;
        }
        //Laya.Shader3D.debugMode=true;
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
        //自动添加材质
        this._scene3D.addComponent(WmyMatMag_1.default);
        //自动添加U3D脚本
        this._scene3D.addComponent(WmyU3dTsMag_1.default);
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
},{"./_wmyUtilsH5/WmyUtils":2,"./_wmyUtilsH5/Wmy_Load_Mag":3,"./_wmyUtilsH5/wmyTween/WTweenManager":13,"./wmyMats/WmyMatMag":17,"./wmyU3dTs/WmyU3dTsMag":20}],2:[function(require,module,exports){
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
        console.log(target);
        if (target == null)
            return null;
        if (shaderName == undefined) {
            shaderName = initData.shaderName;
        }
        if (shaderName == undefined)
            return null;
        var shader = Laya.Shader3D.find(shaderName);
        console.log(shader);
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
        sharedMaterial._shader = shader;
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
},{"../_wmyUtilsH5/d3/WmyScript3D":6,"./WmyMatConfig":16}],18:[function(require,module,exports){
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
},{"../_wmyUtilsH5/d3/c4d/WmyC4DVetexAnimator":8,"../_wmyUtilsH5/d3/physics/WmyPhysicsWorld_Character":9,"./ts/Ts_C4DVetexAnimator":21,"./ts/Ts_DLight":22,"./ts/Ts_Mats":23,"./ts/Ts_Scene":24}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{"../_wmyUtilsH5/d3/WmyScript3D":6,"./WmyU3dImport":18,"./WmyU3dTsConfig":19}],21:[function(require,module,exports){
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
},{"../../_wmyUtilsH5/d3/WmyScript3D":6,"../WmyU3dImport":18}],22:[function(require,module,exports){
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
},{"../../_wmyUtilsH5/d3/WmyScript3D":6}],23:[function(require,module,exports){
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
},{"../../_wmyUtilsH5/d3/WmyScript3D":6}],24:[function(require,module,exports){
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
},{"../../_wmyUtilsH5/d3/WmyScript3D":6,"../WmyU3dImport":18}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpcklERV9iZXRhNS9yZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi50cyIsInNyYy9fd215VXRpbHNINS9XbXlVdGlscy50cyIsInNyYy9fd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvV215TG9hZDNkLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteUxvYWRNYXRzLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNELnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvYzRkL1dteUM0RFZldGV4QW5pbWF0b3IudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvcGh5c2ljcy9XbXlQaHlzaWNzV29ybGRfQ2hhcmFjdGVyLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dFYXNlTWFuYWdlci50cyIsInNyYy9fd215VXRpbHNINS93bXlUd2Vlbi9XRWFzZVR5cGUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dUd2Vlbk1hbmFnZXIudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuVmFsdWUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuZXIudHMiLCJzcmMvd215TWF0cy9XbXlNYXRDb25maWcudHMiLCJzcmMvd215TWF0cy9XbXlNYXRNYWcudHMiLCJzcmMvd215VTNkVHMvV215VTNkSW1wb3J0LnRzIiwic3JjL3dteVUzZFRzL1dteVUzZFRzQ29uZmlnLnRzIiwic3JjL3dteVUzZFRzL1dteVUzZFRzTWFnLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX0M0RFZldGV4QW5pbWF0b3IudHMiLCJzcmMvd215VTNkVHMvdHMvVHNfRExpZ2h0LnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX01hdHMudHMiLCJzcmMvd215VTNkVHMvdHMvVHNfU2NlbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVEEsMkRBQTBEO0FBQzFELHNFQUFxRTtBQUNyRSxtREFBa0Q7QUFDbEQsc0RBQWlEO0FBQ2pELGlEQUE0QztBQUM1QztJQUlDO1FBRk8sV0FBTSxHQUFDLEdBQUcsQ0FBQztRQUNYLFdBQU0sR0FBQyxJQUFJLENBQUM7UUFFbEIsSUFBSSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTVDLElBQUksSUFBSSxHQUFDLG1CQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pDLElBQUcsSUFBSSxFQUFDO1lBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7U0FDaEQ7YUFDRztZQUNILElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO1NBQ25EO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDM0MsUUFBUTtRQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUNuQyxRQUFRO1FBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcs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MEdBQTBHO29CQUNqSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDRHQUE0RztvQkFDbkgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw0R0FBNEc7b0JBQ25ILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw0R0FBNEc7b0JBQ25ILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDRHQUE0RztvQkFDbkgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDRHQUE0RztvQkFDbkgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxF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S0FBSyxFQUFFO1NBRWY7SUFDTCxDQUFDO0lBRUwsZ0JBQUM7QUFBRCxDQTVCQSxBQTRCQyxDQTVCc0MseUJBQVcsR0E0QmpEOzs7OztBQzdCRCxnRUFBK0Q7QUFDL0Q7SUFBcUMsMkJBQVc7SUFBaEQ7UUFBQSxxRUFXRTtRQVRELFVBQVU7UUFDSCxrQkFBWSxHQUFNLEtBQUssQ0FBQztRQUMvQixVQUFVO1FBQ0gscUJBQWUsR0FBTSxLQUFLLENBQUM7O0lBTWxDLENBQUM7SUFMSyx5QkFBTyxHQUFkO1FBQ0MsUUFBUTtRQUNSLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFMUQsQ0FBQztJQUNELGNBQUM7QUFBRCxDQVhELEFBV0UsQ0FYbUMseUJBQVcsR0FXOUM7Ozs7O0FDZkYsTUFBTTtBQUNOLG9CQUFvQjtBQUNwQixnREFBMkM7QUFDM0MsZ0VBQStEO0FBQy9EO0lBQXNDLDRCQUFXO0lBQWpEOztJQVVDLENBQUM7SUFQSywwQkFBTyxHQUFkO1FBQ0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO0lBRUQsQ0FBQztJQUNELGVBQUM7QUFBRCxDQVZELEFBVUUsQ0FWb0MseUJBQVcsR0FVL0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuL193bXlVdGlsc0g1L2QzL1dteVV0aWxzM0RcIjtcclxuaW1wb3J0IHsgV215X0xvYWRfTWFnIH0gZnJvbSBcIi4vX3dteVV0aWxzSDUvV215X0xvYWRfTWFnXCI7XHJcbmltcG9ydCB7IFdUd2Vlbk1hbmFnZXIgfSBmcm9tIFwiLi9fd215VXRpbHNINS93bXlUd2Vlbi9XVHdlZW5NYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFdteVV0aWxzIH0gZnJvbSBcIi4vX3dteVV0aWxzSDUvV215VXRpbHNcIjtcclxuaW1wb3J0IFdteVUzZFRzTWFnIGZyb20gXCIuL3dteVUzZFRzL1dteVUzZFRzTWFnXCI7XHJcbmltcG9ydCBXbXlNYXRNYWcgZnJvbSBcIi4vd215TWF0cy9XbXlNYXRNYWdcIjtcclxuZXhwb3J0IGNsYXNzIE1haW4ge1xyXG5cdHB1YmxpYyBzdGF0aWMgX3RoaXM6IE1haW47XHJcblx0cHVibGljIF9yb290Vz02NDA7XHJcblx0cHVibGljIF9yb290SD0xMTM2O1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0TWFpbi5fdGhpcz10aGlzO1xyXG5cdFx0TGF5YTNELmluaXQodGhpcy5fcm9vdFcsIHRoaXMuX3Jvb3RIKTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cclxuXHRcdHZhciBpc1BjPVdteVV0aWxzLmdldFRoaXMuaXNQYygpO1xyXG5cdFx0aWYoaXNQYyl7XHJcblx0XHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gTGF5YS5TdGFnZS5TQ0FMRV9TSE9XQUxMO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBMYXlhLlN0YWdlLlNDQUxFX0ZVTEw7XHJcblx0XHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IExheWEuU3RhZ2UuU0NSRUVOX1ZFUlRJQ0FMO1xyXG5cdFx0fVxyXG5cdFx0TGF5YS5zdGFnZS5mcmFtZVJhdGU9TGF5YS5TdGFnZS5GUkFNRV9GQVNUO1xyXG5cdFx0Ly/orr7nva7msLTlubPlr7npvZBcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduSCA9IFwiY2VudGVyXCI7XHJcblx0XHQvL+iuvue9ruWeguebtOWvuem9kFxyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25WID0gXCJtaWRkbGVcIjtcclxuXHJcblx0XHRMYXlhLlN0YXQuc2hvdygpO1xyXG5cclxuXHRcdGlmKCF0aGlzW1widkNvbnNvbGVcIl0pe1xyXG5cdFx0XHR0aGlzW1widkNvbnNvbGVcIl0gPSBuZXcgd2luZG93W1wiVkNvbnNvbGVcIl0oKTtcclxuXHRcdFx0dGhpc1tcInZDb25zb2xlXCJdLnN3aXRjaFBvcy5zdGFydFkgPSA0MDtcclxuXHRcdH1cclxuXHRcdC8vTGF5YS5TaGFkZXIzRC5kZWJ1Z01vZGU9dHJ1ZTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0dmFyIHdteVZUaW1lPVwiXCI7XHJcblx0XHRpZih3aW5kb3chPW51bGwgJiYgd2luZG93W1wid215VlRpbWVcIl0hPW51bGwpe1xyXG5cdFx0XHR3bXlWVGltZT13aW5kb3dbXCJ3bXlWVGltZVwiXTtcclxuXHRcdH1cclxuXHRcdExheWEuUmVzb3VyY2VWZXJzaW9uLmVuYWJsZShcInZlcnNpb24uanNvblwiK3dteVZUaW1lLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25WZXJzaW9uTG9hZGVkKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XHJcblx0fVxyXG5cclxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0XHRMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5SRVNJWkUpO1xyXG5cdFx0V215X0xvYWRfTWFnLmdldFRoaXMub25TZXRXZXREYXRhKFwibG9hZEluZm9cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XHJcblx0XHRcdFdteV9Mb2FkX01hZy5nZXRUaGlzLm9ubG9hZFN0cihcImxvYWRcIiwgbmV3IExheWEuSGFuZGxlcih0aGlzLCB0aGlzLm9uTG9hZE1haW4pKTtcclxuXHRcdH0pKTtcclxuXHR9XHJcblx0XHJcblx0UkVTSVpFKCkge1xyXG5cdFx0dmFyIHN3PUxheWEuc3RhZ2Uud2lkdGgvdGhpcy5fcm9vdFc7XHJcblx0XHR2YXIgc2g9TGF5YS5zdGFnZS5oZWlnaHQvdGhpcy5fcm9vdEg7XHJcblx0XHRpZiAodGhpcy5fdWlTY2VuZSAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX3VpU2NlbmUuc2NhbGVYPXN3O1xyXG5cdFx0XHR0aGlzLl91aVNjZW5lLnNjYWxlWT1zdztcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLl91aVNjZW5lICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5fdWlSb290LndpZHRoID0gTGF5YS5zdGFnZS53aWR0aC9zdztcclxuXHRcdFx0dGhpcy5fdWlSb290LmhlaWdodCA9IExheWEuc3RhZ2UuaGVpZ2h0L3N3O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9Mb2FkUm9vdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX0xvYWRSb290LndpZHRoID0gdGhpcy5fdWlSb290LndpZHRoO1xyXG5cdFx0XHR0aGlzLl9Mb2FkUm9vdC5oZWlnaHQgPSB0aGlzLl91aVJvb3QuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9tYWluVmlldyAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX21haW5WaWV3LndpZHRoID0gdGhpcy5fdWlSb290LndpZHRoO1xyXG5cdFx0XHR0aGlzLl9tYWluVmlldy5oZWlnaHQgPSB0aGlzLl91aVJvb3QuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3VpU2NlbmU6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfdWlSb290OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cclxuXHRwcml2YXRlIF9Mb2FkUm9vdDogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHRwcml2YXRlIF9Mb2FkQm94OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX2JhcjogZmFpcnlndWkuR1Byb2dyZXNzQmFyO1xyXG5cclxuXHRwcml2YXRlIF9tYWluVmlldzogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHJcblx0cHJpdmF0ZSBvbkxvYWRNYWluKCkge1xyXG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZChmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QpO1xyXG5cdFx0dGhpcy5fdWlTY2VuZT1uZXcgZmFpcnlndWkuR0NvbXBvbmVudCgpO1xyXG5cdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZCh0aGlzLl91aVNjZW5lKTtcclxuXHRcdHRoaXMuX3VpUm9vdD1uZXcgZmFpcnlndWkuR0NvbXBvbmVudCgpO1xyXG5cdFx0dGhpcy5fdWlTY2VuZS5hZGRDaGlsZCh0aGlzLl91aVJvb3QpO1xyXG5cclxuXHRcdHRoaXMuX0xvYWRSb290ID0gZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdChcImxvYWRcIiwgXCJMb2FkUm9vdFwiKS5hc0NvbTtcclxuXHRcdHRoaXMuX3VpUm9vdC5hZGRDaGlsZCh0aGlzLl9Mb2FkUm9vdCk7XHJcblx0XHR0aGlzLl9Mb2FkQm94ID0gdGhpcy5fTG9hZFJvb3QuZ2V0Q2hpbGQoXCJfTG9hZEJveFwiKS5hc0NvbTtcclxuXHJcblx0XHR0aGlzLl9iYXIgPSB0aGlzLl9Mb2FkQm94LmdldENoaWxkKFwiYmFyXCIpLmFzUHJvZ3Jlc3M7XHJcblxyXG5cdFx0V215X0xvYWRfTWFnLmdldFRoaXMub25BdXRvTG9hZEFsbChuZXcgTGF5YS5IYW5kbGVyKHRoaXMsIHRoaXMub25Mb2FkT2spLCBuZXcgTGF5YS5IYW5kbGVyKHRoaXMsIHRoaXMub25Mb2FkaW5nKSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uTG9hZGluZyhwcm9ncmVzczogbnVtYmVyKTogdm9pZCB7XHJcblx0XHR2YXIgdHdlZW4gPSBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCk7XHJcblx0XHR0d2Vlbi5zZXRUYXJnZXQodGhpcywgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLl9vbkxvYWRpbmcsIG51bGwsIGZhbHNlKSk7XHJcblx0XHRpZih0aGlzLl9iYXIpe1xyXG5cdFx0XHR0d2Vlbi5fdG8odGhpcy5fYmFyLnZhbHVlLCBwcm9ncmVzcywgMC4yNSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHByaXZhdGUgX29uTG9hZGluZyh0YXJnZXQsIHApIHtcclxuXHRcdGlmKHRoaXMuX2Jhcil7XHJcblx0XHRcdHRoaXMuX2Jhci52YWx1ZSA9IHA7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9zY2VuZTNEOkxheWEuU2NlbmUzRDtcclxuXHRwcml2YXRlIG9uTG9hZE9rKHVpQXJyLCB1M2RBcnIpIHtcclxuXHRcdC8v5re75YqgM0RcclxuICAgICAgICB2YXIgdXJsM2Q9dTNkQXJyWzBdLnVybExpc3RbMF07XHJcbiAgICAgICAgdGhpcy5fc2NlbmUzRCA9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybDNkKTtcclxuXHJcblx0XHRXVHdlZW5NYW5hZ2VyLmtpbGxUd2VlbnModGhpcyk7XHJcblx0XHR0aGlzLm9uTWFpbigpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbk1haW4oKXtcclxuXHRcdHRoaXMuX21haW5WaWV3ID0gZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdChcIm1haW5cIiwgXCJNYWluXCIpLmFzQ29tO1xyXG5cdFx0aWYgKHRoaXMuX21haW5WaWV3ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5fdWlSb290LmFkZENoaWxkQXQodGhpcy5fbWFpblZpZXcsIDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBfTWFpbj10aGlzLl9tYWluVmlldy5nZXRDaGlsZChcIl9NYWluXCIpLmFzQ29tO1xyXG5cdFx0dmFyIGQzQm94PV9NYWluLmdldENoaWxkKFwiZDNCb3hcIik7XHJcblx0XHRkM0JveC5kaXNwbGF5T2JqZWN0LmFkZENoaWxkKHRoaXMuX3NjZW5lM0QpO1xyXG5cclxuXHRcdFdUd2Vlbk1hbmFnZXIua2lsbFR3ZWVucyh0aGlzKTtcclxuXHRcdHRoaXMuX3VpUm9vdC5yZW1vdmVDaGlsZCh0aGlzLl9Mb2FkUm9vdCk7XHJcblx0XHR0aGlzLl9Mb2FkUm9vdCA9IG51bGw7XHJcblx0XHR0aGlzLl9iYXIgPSBudWxsO1xyXG5cclxuXHRcdC8v6Ieq5Yqo5re75Yqg5p2Q6LSoXHJcblx0XHR0aGlzLl9zY2VuZTNELmFkZENvbXBvbmVudChXbXlNYXRNYWcpO1xyXG5cdFx0Ly/oh6rliqjmt7vliqBVM0TohJrmnKxcclxuXHRcdHRoaXMuX3NjZW5lM0QuYWRkQ29tcG9uZW50KFdteVUzZFRzTWFnKTtcclxuXHJcblx0XHQvLyAvL+WKoOi9vTNE5Zy65pmvXHJcblx0XHQvLyBMYXlhLlNjZW5lM0QubG9hZCgncmVzL3UzZC9tYWluL0NvbnZlbnRpb25hbC8xLmxzJywgTGF5YS5IYW5kbGVyLmNyZWF0ZShudWxsLCBmdW5jdGlvbihzY2VuZSl7XHJcblx0XHQvLyBcdC8v6Ieq5Yqo57uR5a6aVTNE6ISa5pysXHJcblx0XHQvLyBcdHNjZW5lLmFkZENvbXBvbmVudChXbXlVM2RUc01hZyk7XHJcblx0XHQvLyBcdC8v5Zy65pmv5re75Yqg5Yiw6Iie5Y+wXHJcblx0XHQvLyBcdExheWEuc3RhZ2UuYWRkQ2hpbGQoc2NlbmUpO1xyXG5cclxuXHRcdC8vIFx0Ly8gdmFyIHdteVZldGV4X2Z6MDE9V215VXRpbHMzRC5nZXRPYmozZFVybChzY2VuZSxcIjEvMi8zL3dteVZldGV4X2Z6MDFAMVwiKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG5cdFx0Ly8gXHQvLyB3bXlWZXRleF9mejAxLmV2ZW50KFwiYW5pX3BsYXlcIik7XHJcblxyXG5cdFx0Ly8gXHQvLyBMYXlhLnRpbWVyLm9uY2UoMTAwMCx0aGlzLCgpPT57XHJcblx0XHQvLyBcdC8vIFx0d215VmV0ZXhfZnowMS5ldmVudChcImFuaV9wbGF5XCIpO1xyXG5cdFx0Ly8gXHQvLyB9KVxyXG5cclxuXHRcdC8vIH0pKTtcclxuXHR9XHJcblx0XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiXHJcbmV4cG9ydCBjbGFzcyBXbXlVdGlscyBleHRlbmRzIGxheWEuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpczpXbXlVdGlscztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlVdGlsc3tcclxuICAgICAgICBpZihXbXlVdGlscy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteVV0aWxzLl90aGlzPW5ldyBXbXlVdGlscygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5fdGhpcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLl9fbG9vcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9ET1dOLHRoaXMsIHRoaXMuX19vblRvdWNoRG93bik7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9VUCx0aGlzLCB0aGlzLl9fb25Ub3VjaFVwKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLl9fT25Nb3VzZU1PVkUpO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5SRVNJWkUsdGhpcyx0aGlzLl9fb25SZXNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBDT0xPUl9GSUxURVJTX01BVFJJWDogQXJyYXk8YW55Pj1bXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9SXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9HXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9CXHJcbiAgICAgICAgMCwgMCwgMCwgMSwgMCwgLy9BXHJcbiAgICBdO1xyXG4gICAgLy/ovazmjaLpopzoibJcclxuICAgIHB1YmxpYyBjb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpOkFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFswXT1yO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzZdPWc7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMTJdPWI7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMThdPWF8fDE7XHJcbiAgICAgICAgcmV0dXJuIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYO1xyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVycyh0YXJnZXQ6TGF5YS5TcHJpdGUsY29sb3I6bnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJzPW51bGw7XHJcbiAgICAgICAgaWYoY29sb3IgIT0gMHhmZmZmZmYpe1xyXG4gICAgICAgICAgICB0YXJnZXQuZmlsdGVycz1bbmV3IExheWEuQ29sb3JGaWx0ZXIodGhpcy5jb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjE2KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjgpICYgMHhmZikvMjU1LFxyXG4gICAgICAgICAgICAgICAgKGNvbG9yICYgMHhmZikvMjU1XHJcbiAgICAgICAgICAgICAgICApKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVyczEodGFyZ2V0OkxheWEuU3ByaXRlLHI6bnVtYmVyLGc6bnVtYmVyLGI6bnVtYmVyLGE/Om51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKHIgPCAxIHx8IGcgPCAxIHx8IGIgPCAxIHx8IGEgPCAxKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocixnLGIsYSkpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/liKTmlq3miYvmnLrmiJZQQ1xyXG4gICAgcHVibGljIGlzUGMoKTpib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGlzUGM6Ym9vbGVhbj1mYWxzZTtcclxuICAgICAgICBpZih0aGlzLnZlcnNpb25zKCkuYW5kcm9pZCB8fCB0aGlzLnZlcnNpb25zKCkuaVBob25lIHx8IHRoaXMudmVyc2lvbnMoKS5pb3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpc1BjPWZhbHNlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMudmVyc2lvbnMoKS5pUGFkKXtcclxuICAgICAgICAgICAgaXNQYz10cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNQYztcclxuICAgIH1cclxuICAgIHB1YmxpYyB2ZXJzaW9ucygpe1xyXG4gICAgICAgIHZhciB1OnN0cmluZyA9IG5hdmlnYXRvci51c2VyQWdlbnQsIGFwcDpzdHJpbmcgPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAvL+enu+WKqOe7iOerr+a1j+iniOWZqOeJiOacrOS/oeaBr1xyXG4gICAgICAgICAgICB0cmlkZW50OiB1LmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xLCAvL0lF5YaF5qC4XHJcbiAgICAgICAgICAgIHByZXN0bzogdS5pbmRleE9mKCdQcmVzdG8nKSA+IC0xLCAvL29wZXJh5YaF5qC4XHJcbiAgICAgICAgICAgIHdlYktpdDogdS5pbmRleE9mKCdBcHBsZVdlYktpdCcpID4gLTEsIC8v6Iu55p6c44CB6LC35q2M5YaF5qC4XHJcbiAgICAgICAgICAgIGdlY2tvOiB1LmluZGV4T2YoJ0dlY2tvJykgPiAtMSAmJiB1LmluZGV4T2YoJ0tIVE1MJykgPT0gLTEsIC8v54Gr54uQ5YaF5qC4XHJcbiAgICAgICAgICAgIG1vYmlsZTogISF1Lm1hdGNoKC9BcHBsZVdlYktpdC4qTW9iaWxlLiovKXx8ISF1Lm1hdGNoKC9BcHBsZVdlYktpdC8pLCAvL+aYr+WQpuS4uuenu+WKqOe7iOerr1xyXG4gICAgICAgICAgICBpb3M6ICEhdS5tYXRjaCgvXFwoaVteO10rOyggVTspPyBDUFUuK01hYyBPUyBYLyksIC8vaW9z57uI56uvXHJcbiAgICAgICAgICAgIGFuZHJvaWQ6IHUuaW5kZXhPZignQW5kcm9pZCcpID4gLTEgfHwgdS5pbmRleE9mKCdMaW51eCcpID4gLTEsIC8vYW5kcm9pZOe7iOerr+aIluiAhXVj5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQaG9uZTogdS5pbmRleE9mKCdpUGhvbmUnKSA+IC0xIHx8IHUuaW5kZXhPZignTWFjJykgPiAtMSwgLy/mmK/lkKbkuLppUGhvbmXmiJbogIVRUUhE5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQYWQ6IHUuaW5kZXhPZignaVBhZCcpID4gLTEsIC8v5piv5ZCmaVBhZFxyXG4gICAgICAgICAgICB3ZWJBcHA6IHUuaW5kZXhPZignU2FmYXJpJykgPT0gLTEgLy/mmK/lkKZ3ZWLlupTor6XnqIvluo/vvIzmsqHmnInlpLTpg6jkuI7lupXpg6hcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRVcmxWKGtleTpzdHJpbmcpe1xyXG4gICAgICAgIHZhciByZWc9IG5ldyBSZWdFeHAoXCIoXnwmKVwiK2tleStcIj0oW14mXSopKCZ8JClcIik7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLm1hdGNoKHJlZyk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdD9kZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzJdKTpudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk5hdmlnYXRlKHVybDpzdHJpbmcsaXNSZXBsYWNlOmJvb2xlYW49ZmFsc2Upe1xyXG4gICAgICAgIGlmKGlzUmVwbGFjZSl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHVybCk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9dXJsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ldmVudExpc3Q6QXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+PW5ldyBBcnJheTxsYXlhLmV2ZW50cy5FdmVudD4oKTtcclxuICAgIHByaXZhdGUgX19vblRvdWNoRG93bihldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KTwwKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnB1c2goZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaFVwKGV2dDogbGF5YS5ldmVudHMuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpPj0wKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnNwbGljZSh0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25SZXNpemUoKXtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3QuZm9yRWFjaChldnQgPT4ge1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuXHRcdH0pO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdD1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX19Pbk1vdXNlTU9WRShldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGJOdW09MTA7XHJcbiAgICAgICAgaWYoZXZ0LnN0YWdlWCA8PSBiTnVtIHx8IGV2dC5zdGFnZVggPj0gTGF5YS5zdGFnZS53aWR0aC1iTnVtIHx8XHJcbiAgICAgICAgICAgIGV2dC5zdGFnZVkgPD0gYk51bSB8fCBldnQuc3RhZ2VZID49IExheWEuc3RhZ2UuaGVpZ2h0LWJOdW0pe1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTnVtVG8obixsPTIpe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQobCkpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJfWFkoZCwgcilcclxuICAgIHtcclxuICAgIFx0dmFyIHJhZGlhbiA9IChyICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBcdHZhciBjb3MgPSAgTWF0aC5jb3MocmFkaWFuKTtcclxuICAgIFx0dmFyIHNpbiA9ICBNYXRoLnNpbihyYWRpYW4pO1xyXG4gICAgXHRcclxuICAgIFx0dmFyIGR4PWQgKiBjb3M7XHJcbiAgICBcdHZhciBkeT1kICogc2luO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IExheWEuUG9pbnQoZHggLCBkeSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nMmJ1ZmZlcihzdHIpOkFycmF5QnVmZmVyIHtcclxuICAgICAgICAvLyDpppblhYjlsIblrZfnrKbkuLLovazkuLoxNui/m+WItlxyXG4gICAgICAgIGxldCB2YWwgPSBcIlwiXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodmFsID09PSAnJykge1xyXG4gICAgICAgICAgICB2YWwgPSBzdHIuY2hhckNvZGVBdChpKS50b1N0cmluZygxNilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWwgKz0gJywnICsgc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDlsIYxNui/m+WItui9rOWMluS4ukFycmF5QnVmZmVyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHZhbC5tYXRjaCgvW1xcZGEtZl17Mn0vZ2kpLm1hcChmdW5jdGlvbiAoaCkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludChoLCAxNilcclxuICAgICAgICB9KSkuYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVwbGFjZUFsbChzdHIsIG9sZFN0ciwgbmV3U3RyKXsgIFxyXG4gICAgICAgIHZhciB0ZW1wID0gJyc7ICBcclxuICAgICAgICB0ZW1wID0gc3RyLnJlcGxhY2Uob2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIGlmKHRlbXAuaW5kZXhPZihvbGRTdHIpPj0wKXtcclxuICAgICAgICAgICAgdGVtcCA9IHRoaXMucmVwbGFjZUFsbCh0ZW1wLCBvbGRTdHIsIG5ld1N0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9ICBcclxuXHJcbiAgICAvL+Wkp+Wwj+WGmei9rOaNolxyXG4gICAgcHVibGljIHN0YXRpYyB0b0Nhc2Uoc3RyOnN0cmluZywgaXNEeD1mYWxzZSl7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnO1xyXG4gICAgICAgIGlmKCFpc0R4KXtcclxuICAgICAgICAgICAgLy/ovazmjaLkuLrlsI/lhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgLy/ovazljJbkuLrlpKflhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7ICBcclxuICAgIH0gXHJcblxyXG4gICAgXHJcbiAgICAvL+i3neemu1xyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0RGlzdGFuY2UoYTpMYXlhLlBvaW50LGI6TGF5YS5Qb2ludCk6bnVtYmVyIHtcclxuXHRcdHZhciBkeCA9IE1hdGguYWJzKGEueCAtIGIueCk7XHJcblx0XHR2YXIgZHkgPSBNYXRoLmFicyhhLnkgLSBiLnkpO1xyXG5cdFx0dmFyIGQ9TWF0aC5zcXJ0KE1hdGgucG93KGR4LCAyKSArIE1hdGgucG93KGR5LCAyKSk7XHJcblx0XHRkPXBhcnNlRmxvYXQoZC50b0ZpeGVkKDIpKTtcclxuXHRcdHJldHVybiBkO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFh5VG9SKHkseCk6bnVtYmVye1xyXG4gICAgICAgIHZhciByYWRpYW49TWF0aC5hdGFuMih5LHgpO1xyXG4gICAgICAgIHZhciByPSgxODAvTWF0aC5QSSpyYWRpYW4pO1xyXG4gICAgICAgIHI9dGhpcy5vbk51bVRvKHIpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc3RvcmFnZShrZXksIHZhbHVlOmFueT1cIj9cIiwgaXNMb2NhbD10cnVlKTphbnl7XHJcbiAgICAgICAgdmFyIHN0b3JhZ2U6YW55PWlzTG9jYWw/bG9jYWxTdG9yYWdlOnNlc3Npb25TdG9yYWdlO1xyXG4gICAgICAgIGlmKHZhbHVlPT1cIj9cIil7XHJcblx0XHRcdHZhciBkYXRhID0gc3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZih2YWx1ZT09bnVsbCl7XHJcblx0XHRcdHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0c3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvL+aSreaUvuWjsOmfs1xyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5RnVpU291bmQoX3VybCx2b2x1bWU9MC4yLGNvbXBsZXRlSGFuZGxlcj8sc3RhcnRUaW1lPTAsbG9vcHM9MSl7XHJcbiAgICAgICAgaWYodm9sdW1lPD0wKXJldHVybjtcclxuICAgICAgICB2YXIgaXRlbT1mYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbUJ5VVJMKF91cmwpO1xyXG4gICAgICAgIHZhciB1cmw9aXRlbS5maWxlO1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZCh1cmwsbG9vcHMsY29tcGxldGVIYW5kbGVyLG51bGwsc3RhcnRUaW1lKTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5zZXRTb3VuZFZvbHVtZSh2b2x1bWUsdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvL+a1heaLt+i0nVxyXG4gICAgcHVibGljIHN0YXRpYyBzaGFsbG93Q29weShvYmope1xyXG4gICAgICAgIC8vIOWPquaLt+i0neWvueixoVxyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgcmV0dXJuO1xyXG4gICAgICAgIC8vIOagueaNrm9iaueahOexu+Wei+WIpOaWreaYr+aWsOW7uuS4gOS4quaVsOe7hOi/mOaYr+S4gOS4quWvueixoVxyXG4gICAgICAgIHZhciBuZXdPYmogPSBvYmogaW5zdGFuY2VvZiBBcnJheSA/IFtdIDoge307XHJcbiAgICAgICAgLy8g6YGN5Y6Gb2JqLOW5tuS4lOWIpOaWreaYr29iaueahOWxnuaAp+aJjeaLt+i0nVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgIG5ld09ialtrZXldID0gb2JqW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iajtcclxuICAgIH1cclxuXHJcbiAgICAvL+a3seaLt+i0nVxyXG4gICAgcHVibGljIHN0YXRpYyBkZWVwQ29weShvYmope1xyXG4gICAgICAgIC8vIOWPquaLt+i0neWvueixoVxyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgcmV0dXJuO1xyXG4gICAgICAgIC8vIOagueaNrm9iaueahOexu+Wei+WIpOaWreaYr+aWsOW7uuS4gOS4quaVsOe7hOi/mOaYr+S4gOS4quWvueixoVxyXG4gICAgICAgIHZhciBuZXdPYmogPSBvYmogaW5zdGFuY2VvZiBBcnJheSA/IFtdIDoge307XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICAvLyDpgY3ljoZvYmos5bm25LiU5Yik5pat5pivb2Jq55qE5bGe5oCn5omN5ou36LSdXHJcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgLy8g5Yik5pat5bGe5oCn5YC855qE57G75Z6L77yM5aaC5p6c5piv5a+56LGh6YCS5b2S6LCD55So5rex5ou36LSdXHJcbiAgICAgICAgICAgICAgICBuZXdPYmpba2V5XSA9IHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcgPyB0aGlzLmRlZXBDb3B5KG9ialtrZXldKSA6IG9ialtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdPYmo7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMgfSBmcm9tIFwiLi9XbXlVdGlsc1wiO1xyXG5pbXBvcnQgeyBXbXlMb2FkM2QgfSBmcm9tIFwiLi9kMy9XbXlMb2FkM2RcIjtcclxuaW1wb3J0IHsgV215TG9hZE1hdHMgfSBmcm9tIFwiLi9kMy9XbXlMb2FkTWF0c1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteV9Mb2FkX01hZ1xyXG57XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlfTG9hZF9NYWd7XHJcbiAgICAgICAgaWYoV215X0xvYWRfTWFnLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215X0xvYWRfTWFnLl90aGlzPW5ldyBXbXlfTG9hZF9NYWcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteV9Mb2FkX01hZy5fdGhpcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3dldERhdGE6YW55PXt9O1xyXG5cclxuICAgIHB1YmxpYyBkYXRhTmFtZTpzdHJpbmc9XCJcIjtcclxuICAgIFxyXG4gICAgcHVibGljIGdldFJlc09iaihyZXNOYW1lOnN0cmluZyxkYXRhTmFtZT8pe1xyXG4gICAgICAgIHZhciB3ZWJEYXRhOmFueTtcclxuICAgICAgICBpZihkYXRhTmFtZT09bnVsbCl7XHJcbiAgICAgICAgICAgIGRhdGFOYW1lPXRoaXMuZGF0YU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdlYkRhdGE9dGhpcy5fd2V0RGF0YVtkYXRhTmFtZV07XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzT2JqPW51bGw7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9YXJyW2ldO1xyXG4gICAgICAgICAgICBpZihvYmpbXCJyZXNOYW1lXCJdPT1yZXNOYW1lKXtcclxuICAgICAgICAgICAgICAgIHJlc09iaj1vYmo7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzT2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblNldFdldERhdGEoZGF0YU5hbWU6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICBpZih3aW5kb3dbZGF0YU5hbWVdPT1udWxsKXJldHVybjtcclxuICAgICAgICB0aGlzLmRhdGFOYW1lPWRhdGFOYW1lO1xyXG4gICAgICAgIHRoaXMuX3dldERhdGFbZGF0YU5hbWVdPXdpbmRvd1tkYXRhTmFtZV07XHJcbiAgICAgICAgY2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLl93ZXREYXRhW2RhdGFOYW1lXV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbmxvYWRTdHIoc3RyOnN0cmluZyxjYWxsYmFja09rPzpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgcmVzT2JqPXRoaXMuZ2V0UmVzT2JqKHN0cik7XHJcbiAgICAgICAgaWYocmVzT2JqIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5vbmxvYWQocmVzT2JqLGNhbGxiYWNrT2ssY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIm9ubG9hZFN0ci3lh7rplJk6XCIsc3RyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVzRGF0YUFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHVibGljIG9ubG9hZChyZXNPYmo6YW55LGNhbGxiYWNrT2s/OkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNOYW1lPXJlc09ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgaWYodGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0ucnVuV2l0aChbdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzT2JqW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTphbnk9e307XHJcbiAgICAgICAgICAgIHZhciByZXNEYXRhOnN0cmluZz1yZXNPYmpbXCJyZXNEYXRhXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNEYXRhIT1udWxsICYmIHJlc0RhdGEhPVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhPUpTT04ucGFyc2UocmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZVVybDtcclxuICAgICAgICAgICAgdmFyIHVybEFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB2YXIgaXNDcmVhdGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzVXJsPVdteVV0aWxzLnRvQ2FzZShyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZih1cmwuaW5kZXhPZihcIi50eHRcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuQlVGRkVSfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYk5hbWVVcmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih1cmwuaW5kZXhPZihcIi5qcGdcIik+PTAgfHwgdXJsLmluZGV4T2YoXCIucG5nXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLklNQUdFfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHVybC5pbmRleE9mKFwiLm1wM1wiKT49MCB8fCB1cmwuaW5kZXhPZihcIi53YXZcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuU09VTkR9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmxBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Bc3NldENvbm1wbGV0ZSxbcmVzTmFtZSxiTmFtZVVybCxkYXRhXSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQXNzZXRQcm9ncmVzcywgW3Jlc05hbWVdLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBvbkNsZWFyM2RSZXModXJsKXtcclxuICAgICAgICBMYXlhLlJlc291cmNlLmRlc3Ryb3lVbnVzZWRSZXNvdXJjZXMoKTtcclxuICAgICAgICBXbXlMb2FkM2QuZ2V0VGhpcy5jbGVhclJlcyh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkxvYWQzZE9uZSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgV215TG9hZDNkLm9uTG9hZDNkT25lKHVybCxjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbmxvYWQzZChyZXNPYmo6YW55LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc05hbWU9cmVzT2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICBpZih0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXS5ydW5XaXRoKFt0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNPYmpbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciBkYXRhOmFueT17fTtcclxuICAgICAgICAgICAgdmFyIHJlc0RhdGE6c3RyaW5nPXJlc09ialtcInJlc0RhdGFcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc0RhdGEhPW51bGwgJiYgcmVzRGF0YSE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9SlNPTi5wYXJzZShyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIscmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lO1xyXG4gICAgICAgICAgICB2YXIgdXJsQXJyOkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmwuaW5kZXhPZihcIi5sc1wiKT49MCB8fCByZXNVcmwuaW5kZXhPZihcIi5saFwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgICAgICB1cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YS51cmxMaXN0PXVybExpc3Q7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5nZXRUaGlzLm9ubG9hZDNkKHVybEFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkFzc2V0Q29ubXBsZXRlLFtyZXNOYW1lLGJOYW1lLGRhdGFdKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Bc3NldFByb2dyZXNzLCBbcmVzTmFtZV0sIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHRwcml2YXRlIG9uQXNzZXRQcm9ncmVzcyhyZXNOYW1lLHByb2dyZXNzKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrUHJvZ3Jlc3NBcnI6QXJyYXk8TGF5YS5IYW5kbGVyPj10aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tQcm9ncmVzc0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYWxsYmFja1Byb2dyZXNzQXJyW2ldO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5ydW5XaXRoKFtwcm9ncmVzc10pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcbiAgICBcclxuICAgIHByaXZhdGUgb25Bc3NldENvbm1wbGV0ZShyZXNOYW1lLGJOYW1lVXJsOnN0cmluZyxkYXRhKTp2b2lke1xyXG4gICAgICAgIHZhciBjYWxsYmFja09rQXJyOkFycmF5PExheWEuSGFuZGxlcj49dGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXTtcclxuICAgICAgICBpZihiTmFtZVVybCE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBiYW89TGF5YS5sb2FkZXIuZ2V0UmVzKGJOYW1lVXJsKTtcclxuICAgICAgICAgICAgdmFyIGJOYW1lID0gYk5hbWVVcmwucmVwbGFjZShcIi50eHRcIixcIlwiKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKGJOYW1lLGJhbyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJGVUkt5Ye66ZSZOlwiLGJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWVBcnI9Yk5hbWUuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICBkYXRhLmJOYW1lPWJOYW1lQXJyW2JOYW1lQXJyLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXT1kYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrT2tBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrT2sgPSBjYWxsYmFja09rQXJyW2ldO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbZGF0YV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09bnVsbDtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPW51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNBdXRvTG9hZFA9ZmFsc2U7XHJcbiAgICBwcml2YXRlIF9pc1UzZD1mYWxzZTtcclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkSW5mb0Fycjphbnk7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZHJDYWxsYmFja09rOkxheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3M6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9uQXV0b0xvYWRBbGwoY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgd2ViRGF0YTphbnk9dGhpcy5fd2V0RGF0YVt0aGlzLmRhdGFOYW1lXTtcclxuICAgICAgICBpZih3ZWJEYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi56m65pWw5o2uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFycjpBcnJheTxhbnk+PW51bGw7XHJcbiAgICAgICAgaWYod2ViRGF0YSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgYXJyPXdlYkRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbCl7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZSh3ZWJEYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuadkOaWmeaVsOaNrumUmeivr1wiLHdlYkRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnI9e307XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdPTA7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXT0wO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdPVtdO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXT1bXTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1hcnJbaV07XHJcbiAgICAgICAgICAgIHZhciByZXNOYW1lPW9ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgICAgIHZhciB0PW9ialtcInR5cGVcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc05hbWU9PW51bGwgfHwgcmVzTmFtZT09XCJcIiB8fCB0PT1udWxsIHx8IHQ9PVwiXCIpY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMub25BdXRvTG9hZE9iaih0LHJlc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pc0F1dG9Mb2FkUD10cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkT2JqKHR5cGU6c3RyaW5nLHJlc05hbWUpe1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgcmVzSWQ9dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF09e307XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcIm5cIl09cmVzTmFtZTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT10eXBlO1xyXG4gICAgICAgIHZhciBsb2FkT2s9ZmFsc2U7XHJcbiAgICAgICAgaWYodHlwZT09XCJ1aVwiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidWkt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkM2QocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgdGhpcy5faXNVM2Q9dHJ1ZTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ1M2Qt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlPT1cIm1hdHNcIil7XHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICByZXNVcmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsTGlzdC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkTWF0cy5nZXRUaGlzLm9ubG9hZDNkKHVybExpc3QsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgICAgIGxvYWRPaz10cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJtYXRzLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZT09XCJjdWJlTWFwXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGU9PVwiYXVkaW9cIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImF1ZGlvLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEN1YmUocmVzTmFtZSwgY29tcGxldGU6IExheWEuSGFuZGxlcik6QXJyYXk8TGF5YS5UZXh0dXJlQ3ViZT57XHJcbiAgICAgICAgdmFyIHJlcz10aGlzLmdldFJlc09iaihyZXNOYW1lKTtcclxuICAgICAgICBpZihyZXM9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgdmFyIFJlc3Jlc09iajpBcnJheTxMYXlhLlRleHR1cmVDdWJlPj1bXTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgcmVzVXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgocmVzVXJsKTtcclxuICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgIExheWEuVGV4dHVyZUN1YmUubG9hZCh1cmwsbmV3IExheWEuSGFuZGxlcih0aGlzLGN1YmU9PntcclxuICAgICAgICAgICAgICAgIFJlc3Jlc09ialtpXT1jdWJlO1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGUucnVuV2l0aChbY3ViZSxpXSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFJlc3Jlc09iajtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uTG9hZGluZyhyZXNJZCwgcHJvZ3Jlc3M6bnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIHBDPTA7XHJcbiAgICAgICAgaWYoIXRoaXMuX2lzQXV0b0xvYWRQKXtcclxuICAgICAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BDXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1wicFwiXT1wcm9ncmVzcztcclxuICAgICAgICB2YXIgbnVtPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXTtcclxuICAgICAgICB2YXIgcE51bT0wO1xyXG4gICAgICAgIHZhciBwUz0xL251bTtcclxuICAgICAgICB2YXIgcDA9MCxwMT0wO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bnVtO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9dGhpcy5fYXV0b0xvYWRJbmZvQXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgcD1vYmpbXCJwXCJdO1xyXG4gICAgICAgICAgICBpZihwIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2lzVTNkKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihvYmpbXCJ0XCJdPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDE9cCoocFMqKGkrMSkpKjAuODtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDA9cCoocFMqKGkrMSkpKjAuMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcE51bT1wMCtwMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgcE51bT1wKihwUyooaSsxKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcEM9cE51bSoxMDA7XHJcbiAgICAgICAgaWYoaXNOYU4ocEMpKXBDPTA7XHJcbiAgICAgICAgaWYocEM+MSlcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwQyk7XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcENdKTtcclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uTG9hZE9rKHJlc0lkLGRhdGE/KXtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdKz0xO1xyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInVpXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl0+PXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXSx0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuL1dteVV0aWxzM0RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlMb2FkM2R7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlMb2FkM2R7XHJcbiAgICAgICAgaWYoV215TG9hZDNkLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215TG9hZDNkLl90aGlzPW5ldyBXbXlMb2FkM2QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWQzZC5fdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfdXJsTGlzdDpBcnJheTxzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbmxvYWQzZCh1cmxMaXN0OkFycmF5PHN0cmluZz4sY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyLGlzQ2xlYXJSZXM/KXtcclxuICAgICAgICB0aGlzLl91cmxMaXN0PVtdO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx1cmxMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgdXJsOnN0cmluZz11cmxMaXN0W2ldW1widXJsXCJdO1xyXG4gICAgICAgICAgICB1cmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeCh1cmwpO1xyXG4gICAgICAgICAgICB0aGlzLl91cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgdGhpcy5fb25sb2FkM2QodXJsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIG9uTG9hZDNkT25lKHVybDpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgIC8vICAgICBXbXlMb2FkM2QuZ2V0VGhpcy5fb25Mb2FkM2RPbmUodXJsLGNhbGxiYWNrT2ssY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHVibGljIF9vbkxvYWQzZE9uZSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAvLyAgICAgdGhpcy5fbG9hZDNkKHVybCxjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHByaXZhdGUgX2xvYWQzZCh1cmwsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgIC8vICAgICBMYXlhLmxvYWRlci5jbGVhclJlcyh1cmwpO1xyXG4gICAgLy8gICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCgpPT57XHJcbiAgICAvLyAgICAgICAgIGlmKGNhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgY2FsbGJhY2tPay5ydW4oKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywocCk9PntcclxuICAgIC8vICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgICAgICBjYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BdKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0sbnVsbCxmYWxzZSkpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25Mb2FkM2RPbmUodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciB3bXlMb2FkM2Q9bmV3IFdteUxvYWQzZCgpO1xyXG4gICAgICAgIHdteUxvYWQzZC5fX29ubG9hZDNkT25lKHVybCxjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfX29ubG9hZDNkT25lKHVybCxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHRoaXMuX3VybExpc3Q9W107XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICB1cmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeCh1cmwpO1xyXG4gICAgICAgIHRoaXMuX3VybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgIHRoaXMuX29ubG9hZDNkKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBfb25sb2FkM2QoX3VybExpc3Qpe1xyXG4gICAgLy8gICAgIExheWEubG9hZGVyLmNyZWF0ZSh0aGlzLl91cmxMaXN0LExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgLy8gICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgdGhpcy5fdXJsTGlzdD1udWxsO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9jYWxsYmFja09rPW51bGw7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9bnVsbDtcclxuICAgIC8vICAgICAgICAgdGhpcy5fbUFycj1udWxsO1xyXG4gICAgLy8gICAgIH0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywocCk9PntcclxuICAgIC8vICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BdKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pLG51bGwsbnVsbCxudWxsLDEsZmFsc2UpO1xyXG4gICAgLy8gfVxyXG4gICAgcHJpdmF0ZSBfb25sb2FkM2QodXJsKXtcclxuICAgICAgICBMYXlhLmxvYWRlci5jbGVhclJlcyh1cmwpO1xyXG4gICAgICAgIExheWEubG9hZGVyLl9jcmVhdGVMb2FkKHVybCk7XHJcbiAgICAgICAgdmFyIGxvYWQ9TGF5YS5Mb2FkZXJNYW5hZ2VyW1wiX3Jlc01hcFwiXVt1cmxdO1xyXG4gICAgICAgIGxvYWQub25jZShMYXlhLkV2ZW50LkNPTVBMRVRFLHRoaXMsdGhpcy5fX29ubHNVcmxPayxbdXJsXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbUFycjpBcnJheTxzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBfX29ubHNVcmxPayh1cmwsZCl7XHJcbiAgICAgICAgdmFyIHMwPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgdmFyIHMxPXVybC5yZXBsYWNlKHMwW3MwLmxlbmd0aC0xXSxcIlwiKTtcclxuICAgICAgICB2YXIgcm9vdFVybD1zMTtcclxuICAgICAgICB2YXIganNPYmo9SlNPTi5wYXJzZShkKTtcclxuICAgICAgICB0aGlzLl9tQXJyPVtdO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGlRdVVybChqc09ialtcImRhdGFcIl0scm9vdFVybCk7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLl9tQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5fbUFycltpXTtcclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTG9hZE9rKSk7XHJcbiAgICAgICAgICAgIC8vTGF5YS5sb2FkZXIuY3JlYXRlKHVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTG9hZE9rKSx1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCxncm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21OdW09MDtcclxuICAgIHByaXZhdGUgX3BOdW09MDtcclxuICAgIHByaXZhdGUgX19vbkxvYWRPaygpe1xyXG4gICAgICAgIHRoaXMuX21OdW0rPTE7XHJcbiAgICAgICAgdGhpcy5fcE51bT10aGlzLl9tTnVtL3RoaXMuX21BcnIubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuX19vbkxvYWRQKG51bGwpO1xyXG5cclxuICAgICAgICBpZih0aGlzLl9tTnVtPj10aGlzLl9tQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh0aGlzLl91cmxMaXN0LExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3VybExpc3Q9bnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9bnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9bnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21BcnI9bnVsbDtcclxuICAgICAgICAgICAgfSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkxvYWRQKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9fb25Mb2FkUChwKXtcclxuICAgICAgICB2YXIgcE51bT10aGlzLl9wTnVtKjAuNztcclxuICAgICAgICBpZihwKXtcclxuICAgICAgICAgICAgcE51bSs9cCowLjI1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwTnVtXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBwcml2YXRlIF9tUD0wO1xyXG4gICAgLy8gcHJpdmF0ZSBfbVAyPTA7XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBfX29uQXJyUChwKXtcclxuICAgIC8vICAgICB2YXIgcE51bT1wKih0aGlzLl9tTnVtKzEpO1xyXG4gICAgLy8gICAgIGlmKHBOdW0+dGhpcy5fbVApdGhpcy5fbVA9cE51bTtcclxuICAgIC8vICAgICB0aGlzLl9tUDI9KHRoaXMuX21QL3RoaXMuX21BcnIubGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgIC8vICAgICB2YXIgcE51bT0odGhpcy5fbVAyKSowLjk4O1xyXG4gICAgLy8gICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BOdW1dKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICAvLyBwcml2YXRlIF9fb25BcnJPaygpe1xyXG4gICAgLy8gICAgIHRoaXMuX21OdW0rPTE7XHJcbiAgICAvLyAgICAgaWYodGhpcy5fbU51bT49dGhpcy5fbUFyci5sZW5ndGgpe1xyXG4gICAgLy8gICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgIC8vICAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl91cmxMaXN0PW51bGw7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rPW51bGw7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPW51bGw7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9tQXJyPW51bGw7XHJcbiAgICAvLyAgICAgICAgIH0pKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICBwcml2YXRlIF9fdGlRdVVybChvYmosdXJsOnN0cmluZz1cIlwiKXtcclxuICAgICAgICBpZihvYmpbXCJwcm9wc1wiXSE9bnVsbCAmJiBvYmpbXCJwcm9wc1wiXVtcIm1lc2hQYXRoXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIG1lc2hQYXRoPXVybCtvYmpbXCJwcm9wc1wiXVtcIm1lc2hQYXRoXCJdO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YobWVzaFBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKG1lc2hQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxzOkFycmF5PGFueT49b2JqW1wicHJvcHNcIl1bXCJtYXRlcmlhbHNcIl07XHJcbiAgICAgICAgICAgIGlmKG1hdGVyaWFscyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGlpPTA7aWk8bWF0ZXJpYWxzLmxlbmd0aDtpaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aD11cmwrbWF0ZXJpYWxzW2lpXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKHBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2gocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9ialtcImNvbXBvbmVudHNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgY29tcG9uZW50czpBcnJheTxhbnk+PW9ialtcImNvbXBvbmVudHNcIl07XHJcbiAgICAgICAgICAgIGlmKGNvbXBvbmVudHMubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTAgPSAwOyBpMCA8IGNvbXBvbmVudHMubGVuZ3RoOyBpMCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBjb21wb25lbnRzW2kwXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihjb21wW1wiYXZhdGFyXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFwYXRoPXVybCtjb21wW1wiYXZhdGFyXCJdW1wicGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGFwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChhcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImxheWVyc1wiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcnM6QXJyYXk8YW55Pj1jb21wW1wibGF5ZXJzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpMSA9IDA7IGkxIDwgbGF5ZXJzLmxlbmd0aDsgaTErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheWVyID0gbGF5ZXJzW2kxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZXM6QXJyYXk8YW55Pj1sYXllcltcInN0YXRlc1wiXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IHN0YXRlcy5sZW5ndGg7IGkyKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbaTJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGlwUGF0aD11cmwrc3RhdGVbXCJjbGlwUGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YoY2xpcFBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goY2xpcFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY2hpbGQ6QXJyYXk8YW55Pj1vYmpbXCJjaGlsZFwiXTtcclxuICAgICAgICBpZihjaGlsZCE9bnVsbCAmJiBjaGlsZC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8Y2hpbGQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fdGlRdVVybChjaGlsZFtpXSx1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vXHJcbiAgICBwdWJsaWMgY2xlYXJSZXModXJsOnN0cmluZyl7XHJcbiAgICAgICAgaWYoIXVybCB8fCB1cmwuaW5kZXhPZihcIi9cIik8MClyZXR1cm47XHJcbiAgICAgICAgdmFyIHUwPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgdmFyIHUxPXVybC5yZXBsYWNlKHUwW3UwLmxlbmd0aC0xXSxcIlwiKTtcclxuXHJcbiAgICAgICAgdmFyIHVybHM9W107XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gTGF5YS5Mb2FkZXIubG9hZGVkTWFwKSB7XHJcbiAgICAgICAgICAgIGlmIChMYXlhLkxvYWRlci5sb2FkZWRNYXAuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvYWRVcmw6c3RyaW5nPSBrZXk7XHJcbiAgICAgICAgICAgICAgICBpZihsb2FkVXJsLmluZGV4T2YodTEpPj0wIHx8IGxvYWRVcmwuaW5kZXhPZihcInJlcy9tYXRzL1wiKT49MCApe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHVybHMuaW5kZXhPZihsb2FkVXJsKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJscy5wdXNoKGxvYWRVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cmxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHVybHNbaV07XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvL+agueaNrui1hOa6kOi3r+W+hOiOt+WPlui1hOa6kO+8iFJlc291cmNl5Li65p2Q6LSo44CB6LS05Zu+44CB572R5qC8562J55qE5Z+657G777yJXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzOkxheWEuUmVzb3VyY2U9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcbiAgICAgICAgICAgICAgICBpZighcmVzLmxvY2spe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/otYTmupDph4rmlL5cclxuICAgICAgICAgICAgICAgICAgICByZXMucmVsZWFzZVJlc291cmNlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBMYXlhLmxvYWRlci5jbGVhclJlcyh1cmwpO1xyXG4gICAgICAgICAgICAgICAgLy9MYXlhLmxvYWRlci5jbGVhclVuTG9hZGVkKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpZFJlc291cmNlc01hcExvY2sodGFyZ2V0LGlzTG9jaz10cnVlKXtcclxuICAgICAgICBpZih0YXJnZXQ9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBvYmpMaXN0PVdteVV0aWxzM0QuZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LExheWEuUmVuZGVyYWJsZVNwcml0ZTNEKTtcclxuICAgICAgICB2YXIga0lkcz1bXTtcclxuICAgICAgICBmb3IgKHZhciBpIGluIG9iakxpc3Qpe1xyXG4gICAgICAgICAgICB2YXIgb2JqPW9iakxpc3RbaV07XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5fbG9vcExvY2sob2JqLGtJZHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgck1hcD1MYXlhLlJlc291cmNlW1wiX2lkUmVzb3VyY2VzTWFwXCJdO1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4ga0lkcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPWtJZHNba107XHJcbiAgICAgICAgICAgIHZhciByZXM9ck1hcFtvXTtcclxuICAgICAgICAgICAgcmVzLmxvY2s9aXNMb2NrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfbG9vcExvY2sob2JqLGFycil7XHJcbiAgICAgICAgV215TG9hZDNkLl9NZXNoKG9iaixhcnIpO1xyXG4gICAgICAgIFdteUxvYWQzZC5fTWF0ZXJpYWxzKG9iaixhcnIpO1xyXG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcclxuICAgICAgICAgICAgY29uc3QgbyA9IG9ialtrXTtcclxuICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuQmFzZVJlbmRlcil7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2xvb3BMb2NrKG8sYXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfTWVzaChvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLk1lc2gpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9nZXRSZXNvdXJjZXNNYXBJZChvLGFycik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBfdmVydGV4QnVmZmVycz1vW1wiX3ZlcnRleEJ1ZmZlcnNcIl07XHJcbiAgICAgICAgICAgICAgICBpZihfdmVydGV4QnVmZmVycyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBrMCBpbiBfdmVydGV4QnVmZmVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvMCA9IF92ZXJ0ZXhCdWZmZXJzW2swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobzAgaW5zdGFuY2VvZiBMYXlhLlZlcnRleEJ1ZmZlcjNEKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobzAsYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrMSBpbiBvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbzEgPSBvW2sxXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihvMSBpbnN0YW5jZW9mIExheWEuSW5kZXhCdWZmZXIzRCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobzEsYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX01hdGVyaWFscyhvYmosYXJyKXtcclxuICAgICAgICB2YXIgX21hdGVyaWFscz1vYmpbXCJfbWF0ZXJpYWxzXCJdO1xyXG4gICAgICAgIGlmKF9tYXRlcmlhbHMpe1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgaW4gX21hdGVyaWFscykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbyA9IF9tYXRlcmlhbHNba107XHJcbiAgICAgICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5CYXNlTWF0ZXJpYWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fU2hhZGVyKG8sYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX1NoYWRlckRhdGEobyxhcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfU2hhZGVyKG9iaixhcnIpe1xyXG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcclxuICAgICAgICAgICAgY29uc3QgbyA9IG9ialtrXTtcclxuICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuU2hhZGVyM0Qpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9nZXRSZXNvdXJjZXNNYXBJZChvLGFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgc3RhdGljIF9TaGFkZXJEYXRhKG9iaixhcnIpe1xyXG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcclxuICAgICAgICAgICAgY29uc3QgbyA9IG9ialtrXTtcclxuICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuU2hhZGVyRGF0YSl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX0Jhc2VUZXh0dXJlKG9bXCJfZGF0YVwiXSxhcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9CYXNlVGV4dHVyZShvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLkJhc2VUZXh0dXJlKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9nZXRSZXNvdXJjZXNNYXBJZChvYmosYXJyKXtcclxuICAgICAgICB2YXIgck1hcD1MYXlhLlJlc291cmNlW1wiX2lkUmVzb3VyY2VzTWFwXCJdO1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4gck1hcCl7XHJcbiAgICAgICAgICAgIHZhciByZXM9ck1hcFtrXTtcclxuICAgICAgICAgICAgaWYob2JqPT1yZXMpe1xyXG4gICAgICAgICAgICAgICAgaWYoYXJyLmluZGV4T2Yoayk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgV215TG9hZE1hdHN7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlMb2FkTWF0c3tcclxuICAgICAgICBpZihXbXlMb2FkTWF0cy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWRNYXRzLl90aGlzPW5ldyBXbXlMb2FkTWF0cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215TG9hZE1hdHMuX3RoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbmxvYWQzZCh1cmxMaXN0OkFycmF5PHN0cmluZz4sY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uVXJsQXJyT2ssW3VybExpc3RdKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21hdHNVcmxBcnI6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgIHByaXZhdGUgX21hdE9rPWZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfbWF0TnVtPTA7XHJcbiAgICBwcml2YXRlIF9tYXRQPTA7XHJcbiAgICBwcml2YXRlIF9tYXRQMj0wO1xyXG5cclxuICAgIHByaXZhdGUgX19vblVybEFyck9rKHVybExpc3Q6QXJyYXk8c3RyaW5nPil7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx1cmxMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgdXJsPXVybExpc3RbaV07XHJcbiAgICAgICAgICAgIC8vIHZhciB0eHQ9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcbiAgICAgICAgICAgIC8vIHZhciBqc09iaj1KU09OLnBhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgIHZhciBqc09iaj1MYXlhLmxvYWRlci5nZXRSZXModXJsKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhcnI9dXJsLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgdmFyIG1hdHNVcmw9dXJsLnJlcGxhY2UoYXJyW2Fyci5sZW5ndGgtMV0sXCJcIik7XHJcbiAgICAgICAgICAgIHZhciBhcnJheTpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXk9anNPYmpbXCJtYXRzXCJdO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJyYXkubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBhcnJheVtqXTtcclxuICAgICAgICAgICAgICAgIGlmKG9ialtcInRhcmdldE5hbWVcIl09PVwiXCIpY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0VXJsPW1hdHNVcmwrb2JqW1wibWF0VXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0c1VybEFyci5wdXNoKG1hdFVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5fbWF0c1VybEFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMuX21hdHNVcmxBcnJbaV07XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyck9rKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTWF0QXJyUCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25NYXRBcnJQKHApe1xyXG4gICAgICAgIHZhciBwTnVtPXAqKHRoaXMuX21hdE51bSsxKTtcclxuICAgICAgICBpZihwTnVtPnRoaXMuX21hdFApdGhpcy5fbWF0UD1wTnVtO1xyXG4gICAgICAgIHRoaXMuX21hdFAyPSh0aGlzLl9tYXRQL3RoaXMuX21hdHNVcmxBcnIubGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFt0aGlzLl9tYXRQMl0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25NYXRBcnJPaygpe1xyXG4gICAgICAgIHRoaXMuX21hdE51bSs9MTtcclxuICAgICAgICBpZih0aGlzLl9tYXROdW0+PXRoaXMuX21hdHNVcmxBcnIubGVuZ3RoKXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJpbXBvcnQgeyBXbXlVdGlsczNEIH0gZnJvbSBcIi4vV215VXRpbHMzRFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteVNjcmlwdDNEIGV4dGVuZHMgTGF5YS5TY3JpcHQzRCB7XHJcbiAgICBwdWJsaWMgZGVsKGRlc3Ryb3lDaGlsZDogYm9vbGVhbiA9IHRydWUpe1xyXG4gICAgICAgIHRoaXMub3duZXIzRC5kZXN0cm95KGRlc3Ryb3lDaGlsZCk7XHJcbiAgICB9XHJcblx0cHVibGljIG9uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm93bmVyM0Q9bnVsbDtcclxuICAgICAgICB0aGlzLnNjZW5lM0Q9bnVsbDtcclxuICAgICAgICB0aGlzLm9uRGVsKCk7XHJcbiAgICB9XHJcbiAgICBcclxuXHRwdWJsaWMgb25EZWwoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgb3duZXIzRDpMYXlhLlNwcml0ZTNEO1xyXG4gICAgcHJpdmF0ZSBfbG9jYWxTY2FsZTpMYXlhLlZlY3RvcjM7XHJcblxyXG4gICAgcHVibGljIHNjZW5lM0Q6TGF5YS5TY2VuZTNEO1xyXG5cclxuXHRwdWJsaWMgX29uQWRkZWQoKSB7XHJcbiAgICAgICAgc3VwZXIuX29uQWRkZWQoKTtcclxuICAgICAgICB0aGlzLm93bmVyM0Q9dGhpcy5vd25lciBhcyBMYXlhLlNwcml0ZTNEO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2NhbFNjYWxlPW5ldyBMYXlhLlZlY3RvcjMoMCwgMCwgMCk7XHJcbiAgICAgICAgaWYodGhpcy5vd25lcjNELnRyYW5zZm9ybSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsU2NhbGU9dGhpcy5vd25lcjNELnRyYW5zZm9ybS5sb2NhbFNjYWxlLmNsb25lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NlbmUzRD10aGlzLm93bmVyM0Quc2NlbmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8v5piv5ZCm5Y+v6KeBXHJcbiAgICBwdWJsaWMgc2V0U2hvdyh2OmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMub3duZXIzRC50cmFuc2Zvcm0ubG9jYWxTY2FsZSA9ICF2PyBuZXcgTGF5YS5WZWN0b3IzKDAsIDAsIDApOiB0aGlzLl9sb2NhbFNjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vXHJcbiAgICBwdWJsaWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpOmFueXtcclxuICAgICAgICByZXR1cm4gV215VXRpbHMzRC5nZXRPYmozZFVybCh0YXJnZXQsdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvL+iuvue9rumYtOW9sVxyXG4gICAgcHVibGljIG9uU2V0U2hhZG93KGlzQ2FzdFNoYWRvdyxpc1JlY2VpdmVTaGFkb3cpXHJcbiAgICB7XHJcbiAgICAgICAgV215VXRpbHMzRC5vblNldFNoYWRvdyh0aGlzLm93bmVyM0QsaXNDYXN0U2hhZG93LGlzUmVjZWl2ZVNoYWRvdyk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgV215X0xvYWRfTWFnIH0gZnJvbSBcIi4uL1dteV9Mb2FkX01hZ1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteVV0aWxzM0R7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkKHRhcmdldCxvYmpOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5uYW1lPT1vYmpOYW1lKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvOkxheWEuU3ByaXRlM0QgPSB0YXJnZXQuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBpZiAoby5fY2hpbGRyZW4ubGVuZ3RoIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG8ubmFtZT09b2JqTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG87XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wT2JqPXRoaXMuZ2V0T2JqM2QobyxvYmpOYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBPYmohPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wT2JqO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBhcnJVcmw9dXJsLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldE9iakFyclVybCh0YXJnZXQsYXJyVXJsKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgX2dldE9iakFyclVybCh0YXJnZXQsdXJsQXJyOkFycmF5PHN0cmluZz4saWQ9MCl7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYoX3RhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgbmE9dXJsQXJyW2lkXTtcclxuICAgICAgICB2YXIgdGFyZ2V0T2JqPV90YXJnZXQuZ2V0Q2hpbGRCeU5hbWUobmEpO1xyXG4gICAgICAgIGlmKHRhcmdldE9iaj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihpZD49dXJsQXJyLmxlbmd0aC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGFyZ2V0T2JqPXRoaXMuX2dldE9iakFyclVybCh0YXJnZXRPYmosdXJsQXJyLCsraWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxjbGFzOmFueSxhcnI/KTpBcnJheTxhbnk+e1xyXG4gICAgICAgIGlmKGFycj09bnVsbClhcnI9W107XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvYmo9dGFyZ2V0LmdldENvbXBvbmVudChjbGFzKTtcclxuICAgICAgICBpZihvYmo9PW51bGwpe1xyXG4gICAgICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBjbGFzKXtcclxuICAgICAgICAgICAgICAgIG9iaj10YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqIT1udWxsICYmIGFyci5pbmRleE9mKG9iaik8MCl7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5fY2hpbGRyZW49PW51bGwpIHJldHVybiBhcnI7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZHJlbkNvbXBvbmVudChvLGNsYXMsYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlKHRhcmdldCx0YXJnZXROYW1lPzpzdHJpbmcpOmFueXtcclxuICAgICAgICBpZih0YXJnZXQ9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD1udWxsO1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUpe1xyXG4gICAgICAgICAgICB2YXIgdGVtcE9iaj1XbXlVdGlsczNELmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKTtcclxuICAgICAgICAgICAgaWYodGVtcE9iail7XHJcbiAgICAgICAgICAgICAgICBfdGFyZ2V0PUxheWEuU3ByaXRlM0QuaW5zdGFudGlhdGUodGVtcE9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgX3RhcmdldD1MYXlhLlNwcml0ZTNELmluc3RhbnRpYXRlKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5r+A5rS76Zi05b2x44CCXHJcbiAgICAgKiBAcGFyYW1cdGRpcmVjdGlvbkxpZ2h0IOebtOe6v+WFiVxyXG4gICAgICogQHBhcmFtXHRzaGFkb3dSZXNvbHV0aW9uIOeUn+aIkOmYtOW9sei0tOWbvuWwuuWvuFxyXG4gICAgICogQHBhcmFtXHRzaGFkb3dQQ0ZUeXBlIOaooeeziuetiee6pyzotorlpKfotorpq5gs5pu06ICX5oCn6IO9XHJcbiAgICAgKiBAcGFyYW1cdHNoYWRvd0Rpc3RhbmNlIOWPr+ingemYtOW9sei3neemu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uU2V0RGlyZWN0aW9uTGlnaHQoZGlyZWN0aW9uTGlnaHQsc2hhZG93UmVzb2x1dGlvbj01MTIsc2hhZG93UENGVHlwZT0xLHNoYWRvd0Rpc3RhbmNlOm51bWJlcj0xNSxpc1NoYWRvdzpib29sZWFuPXRydWUpe1xyXG4gICAgICAgIGlmKGRpcmVjdGlvbkxpZ2h0IGluc3RhbmNlb2YgTGF5YS5EaXJlY3Rpb25MaWdodCl7XHJcbiAgICAgICAgICAgIC8v54Gv5YWJ5byA5ZCv6Zi05b2xXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICAvL+WPr+ingemYtOW9sei3neemu1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dEaXN0YW5jZSA9IHNoYWRvd0Rpc3RhbmNlO1xyXG4gICAgICAgICAgICAvL+eUn+aIkOmYtOW9sei0tOWbvuWwuuWvuFxyXG4gICAgICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dSZXNvbHV0aW9uID0gc2hhZG93UmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UFNTTUNvdW50PTE7XHJcbiAgICAgICAgICAgIC8v5qih57OK562J57qnLOi2iuWkp+i2iumrmCzmm7TogJfmgKfog71cclxuICAgICAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UENGVHlwZSA9IHNoYWRvd1BDRlR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDmv4DmtLvpmLTlvbHjgIJcclxuICAgICAqIEBwYXJhbVx0dGFyZ2V0IFxyXG4gICAgICogQHBhcmFtXHR0eXBlIDDmjqXmlLbpmLTlvbEsMeS6p+eUn+mYtOW9sSwy5o6l5pS26Zi05b2x5Lqn55Sf6Zi05b2xXHJcbiAgICAgKiBAcGFyYW1cdGlzU2hhZG93IOaYr+WQpumYtOW9sVxyXG4gICAgICogQHBhcmFtXHRpc0NoaWxkcmVuIOaYr+WQpuWtkOWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uQ2FzdFNoYWRvdyh0YXJnZXQsdHlwZT0wLGlzU2hhZG93PXRydWUsaXNDaGlsZHJlbj10cnVlKXtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLk1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBtczNEPSh0YXJnZXQgYXMgTGF5YS5NZXNoU3ByaXRlM0QpO1xyXG4gICAgICAgICAgICBpZih0eXBlPT0wKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0yKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBzbXMzZD0odGFyZ2V0IGFzIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGU9PTApe1xyXG4gICAgICAgICAgICAgICAgc21zM2Quc2tpbm5lZE1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIHNtczNkLnNraW5uZWRNZXNoUmVuZGVyZXIuY2FzdFNoYWRvdz1pc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaXNDaGlsZHJlbil7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lm51bUNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSB0YXJnZXQuZ2V0Q2hpbGRBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25DYXN0U2hhZG93KG9iaix0eXBlLGlzU2hhZG93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBvblNldFNoYWRvdyh0YXJnZXQsaXNDYXN0U2hhZG93LGlzUmVjZWl2ZVNoYWRvdyl7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5NZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICB0YXJnZXQubWVzaFJlbmRlcmVyLmNhc3RTaGFkb3cgPSBpc0Nhc3RTaGFkb3c7XHJcbiAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgIHRhcmdldC5tZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzUmVjZWl2ZVNoYWRvdztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICB0YXJnZXQuc2tpbm5lZE1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNDYXN0U2hhZG93O1xyXG4gICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICB0YXJnZXQuc2tpbm5lZE1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNSZWNlaXZlU2hhZG93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZ2IyaGV4KHIsZyxiKXtcclxuICAgICAgICB2YXIgX2hleD1cIiNcIiArIHRoaXMuaGV4KHIpICt0aGlzLiBoZXgoZykgKyB0aGlzLmhleChiKTtcclxuICAgICAgICByZXR1cm4gX2hleC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGV4KHgpe1xyXG4gICAgICAgIHg9dGhpcy5vbk51bVRvKHgpO1xyXG4gICAgICAgIHJldHVybiAoXCIwXCIgKyBwYXJzZUludCh4KS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGhleDJyZ2IoaGV4OnN0cmluZykge1xyXG4gICAgICAgIC8vIEV4cGFuZCBzaG9ydGhhbmQgZm9ybSAoZS5nLiBcIjAzRlwiKSB0byBmdWxsIGZvcm0gKGUuZy4gXCIwMDMzRkZcIilcclxuICAgICAgICB2YXIgc2hvcnRoYW5kUmVnZXggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pO1xyXG4gICAgICAgIGhleCA9IGhleC5yZXBsYWNlKHNob3J0aGFuZFJlZ2V4LCBmdW5jdGlvbihtLCByLCBnLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByICsgciArIGcgKyBnICsgYiArIGI7XHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICB2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHtcclxuICAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXHJcbiAgICAgICAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxyXG4gICAgICAgICAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxyXG4gICAgICAgIH0gOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4pe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQoMikpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBcclxuICAgcHVibGljIHN0YXRpYyBsZXJwRihhOm51bWJlciwgYjpudW1iZXIsIHM6bnVtYmVyKTpudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIChhICsgKGIgLSBhKSAqIHMpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSYXlDYXN0QWxsKGNhbTpMYXlhLkNhbWVyYSwgdmlld3BvcnRQb2ludDpMYXlhLlZlY3RvcjIsIHJheT86TGF5YS5SYXksIGNvbGxpc29uR3JvdXA/OiBudW1iZXIsIGNvbGxpc2lvbk1hc2s/OiBudW1iZXIpe1xyXG4gICAgICAgIHZhciBfb3V0SGl0QWxsSW5mbyA9ICBuZXcgQXJyYXk8TGF5YS5IaXRSZXN1bHQ+KCk7XHJcbiAgICAgICAgdmFyIF9yYXkgPXJheTtcclxuICAgICAgICBpZighX3JheSl7XHJcbiAgICAgICAgICAgIF9yYXkgPSBuZXcgTGF5YS5SYXkobmV3IExheWEuVmVjdG9yMygpLCBuZXcgTGF5YS5WZWN0b3IzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+S7juWxj+W5leepuumXtOeUn+aIkOWwhOe6v1xyXG4gICAgICAgIHZhciBfcG9pbnQgPSB2aWV3cG9ydFBvaW50LmNsb25lKCk7XHJcbiAgICAgICAgY2FtLnZpZXdwb3J0UG9pbnRUb1JheShfcG9pbnQsIF9yYXkpO1xyXG4gICAgICAgIC8v5bCE57q/5qOA5rWL6I635Y+W5omA5pyJ5qOA5rWL56Kw5pKe5Yiw55qE54mp5L2TXHJcbiAgICAgICAgaWYoY2FtLnNjZW5lIT1udWxsICYmIGNhbS5zY2VuZS5waHlzaWNzU2ltdWxhdGlvbiE9bnVsbCl7XHJcbiAgICAgICAgICAgIGNhbS5zY2VuZS5waHlzaWNzU2ltdWxhdGlvbi5yYXlDYXN0QWxsKF9yYXksIF9vdXRIaXRBbGxJbmZvLCAxMDAwMCwgY29sbGlzb25Hcm91cCwgY29sbGlzaW9uTWFzayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfb3V0SGl0QWxsSW5mbztcclxuICAgIH1cclxuXHJcbiAgICAvL+i3neemu1xyXG5cdHB1YmxpYyBzdGF0aWMgRGlzdGFuY2UoYTpMYXlhLlZlY3RvcjIsYjpMYXlhLlZlY3RvcjIpOm51bWJlciB7XHJcblx0XHR2YXIgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xyXG5cdFx0dmFyIGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcclxuXHRcdHZhciBkPU1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpO1xyXG5cdFx0ZD1wYXJzZUZsb2F0KGQudG9GaXhlZCgyKSk7XHJcblx0XHRyZXR1cm4gZDtcclxuICAgIH1cclxuICAgIFxyXG5cclxuXHJcbiAgICAvL+WKqOeUuy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaVBsYXkodGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSwgbm9ybWFsaXplZFRpbWU/Om51bWJlciwgY29tcGxldGVFdmVudD86TGF5YS5IYW5kbGVyLCBwYXJhbXM/OkFycmF5PGFueT4sIGxheWVySW5kZXg/OiBudW1iZXIpOkxheWEuQW5pbWF0b3J7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihjb21wbGV0ZUV2ZW50KXtcclxuICAgICAgICAgICAgV215VXRpbHMzRC5hbmlBZGRFdmVudEZ1bih0YXJnZXQzZCxudWxsLGFuaU5hbWUsLTEsY29tcGxldGVFdmVudCx0cnVlLHBhcmFtcyxsYXllckluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFyZ2V0M2RfYW5pLnBsYXkoYW5pTmFtZSxsYXllckluZGV4LG5vcm1hbGl6ZWRUaW1lKTtcclxuICAgICAgICByZXR1cm4gdGFyZ2V0M2RfYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pQWRkRXZlbnRGdW4odGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSx0aW1lOm51bWJlcixjYWxsYmFjazpMYXlhLkhhbmRsZXIsaXNFdmVudE9uZT10cnVlLHBhcmFtcz86QXJyYXk8YW55PixsYXllckluZGV4PzogbnVtYmVyKXtcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYodGFyZ2V0TmFtZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRhcmdldDNkPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldDNkPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgaWYodGFyZ2V0M2RfYW5pPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFdteVV0aWxzM0QuX2FuaUFkZEV2ZW50KHRhcmdldDNkX2FuaSxudWxsLGFuaU5hbWUsXCJfd215X2FuaV9jYWxsYmFja1wiLHRpbWUscGFyYW1zLGxheWVySW5kZXgpO1xyXG4gICAgICAgIHZhciB3YWU9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KF9fV215QW5pRXZlbnQpIGFzIF9fV215QW5pRXZlbnQ7XHJcbiAgICAgICAgaWYoIXdhZSl7XHJcbiAgICAgICAgICAgIHdhZT10YXJnZXQzZC5hZGRDb21wb25lbnQoX19XbXlBbmlFdmVudCkgYXMgX19XbXlBbmlFdmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrTmFtZT1cIndteV9cIitjYWxsYmFjay5jYWxsZXIuaWQrYW5pTmFtZSt0aW1lO1xyXG4gICAgICAgIGlmKGlzRXZlbnRPbmUpe1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uY2UoY2FsbGJhY2tOYW1lLHRoaXMsKF9jYWxsYmFja05hbWUsX2NhbGxiYWNrLHApPT57XHJcbiAgICAgICAgICAgICAgICBfY2FsbGJhY2sucnVuV2l0aChwKTtcclxuICAgICAgICAgICAgICAgIHdhZS5kZWxDYWxsYmFjayhfY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICAgICAgfSxbY2FsbGJhY2tOYW1lLGNhbGxiYWNrXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2Uub24oY2FsbGJhY2tOYW1lLHRoaXMsKF9jYWxsYmFja05hbWUsX2NhbGxiYWNrLHApPT57XHJcbiAgICAgICAgICAgICAgICBfY2FsbGJhY2sucnVuV2l0aChwKTtcclxuICAgICAgICAgICAgfSxbY2FsbGJhY2tOYW1lLGNhbGxiYWNrXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdhZS5hZGRDYWxsYmFjayhjYWxsYmFja05hbWUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaURlbEV2ZW50RnVuKHRhcmdldCx0YXJnZXROYW1lLGNhbGxiYWNrOkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgd2FlPXRhcmdldDNkLmdldENvbXBvbmVudChfX1dteUFuaUV2ZW50KSBhcyBfX1dteUFuaUV2ZW50O1xyXG4gICAgICAgIGlmKHdhZSl7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFja05hbWU9XCJ3bXlfXCIrY2FsbGJhY2suY2FsbGVyLm5hbWUrY2FsbGJhY2subWV0aG9kLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2Uub24oY2FsbGJhY2tOYW1lLGNhbGxiYWNrLmNhbGxlcixjYWxsYmFjay5tZXRob2QpO1xyXG4gICAgICAgICAgICB3YWUuZGVsQ2FsbGJhY2soY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBfYW5pQWRkRXZlbnQodGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSxldmVudE5hbWU6c3RyaW5nLHRpbWU6bnVtYmVyLHBhcmFtcz86QXJyYXk8YW55PixsYXllckluZGV4PzogbnVtYmVyKTpMYXlhLkFuaW1hdG9ye1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPW51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT1udWxsO1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10YXJnZXQ7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuQW5pbWF0b3Ipe1xyXG4gICAgICAgICAgICB0YXJnZXQzZF9hbmk9dGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGFuaW1hdG9yU3RhdGU6TGF5YS5BbmltYXRvclN0YXRlPXRhcmdldDNkX2FuaS5nZXRDb250cm9sbGVyTGF5ZXIobGF5ZXJJbmRleCkuX3N0YXRlc01hcFthbmlOYW1lXTtcclxuICAgICAgICBpZihhbmltYXRvclN0YXRlPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBpc0FkZD10cnVlO1xyXG4gICAgICAgIHZhciBldmVudHM9YW5pbWF0b3JTdGF0ZS5fY2xpcC5fZXZlbnRzO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGV2ZW50cykge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50OkxheWEuQW5pbWF0aW9uRXZlbnQgPSBldmVudHNba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmKGV2ZW50LmV2ZW50TmFtZT09ZXZlbnROYW1lICYmIGFuaUV2ZW50LnRpbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQWRkPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzQWRkKXtcclxuICAgICAgICAgICAgdmFyIGFuaUV2ZW50PW5ldyBMYXlhLkFuaW1hdGlvbkV2ZW50KCk7XHJcbiAgICAgICAgICAgIGFuaUV2ZW50LmV2ZW50TmFtZT1ldmVudE5hbWU7XHJcbiAgICAgICAgICAgIHZhciBjbGlwRHVyYXRpb249YW5pbWF0b3JTdGF0ZS5fY2xpcC5fZHVyYXRpb247XHJcbiAgICAgICAgICAgIGlmKHRpbWU9PS0xKXtcclxuICAgICAgICAgICAgICAgIHRpbWU9Y2xpcER1cmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFuaUV2ZW50LnRpbWU9IHRpbWUgLyBjbGlwRHVyYXRpb247XHJcbiAgICAgICAgICAgIGFuaUV2ZW50LnBhcmFtcz1wYXJhbXM7XHJcbiAgICAgICAgICAgIGFuaW1hdG9yU3RhdGUuX2NsaXAuYWRkRXZlbnQoYW5pRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0M2RfYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pQWRkU2NyaXB0KHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUsc2NyaXB0PzphbnksbGF5ZXJJbmRleD86IG51bWJlcik6TGF5YS5BbmltYXRvclN0YXRle1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGFuaW1hdG9yU3RhdGU6TGF5YS5BbmltYXRvclN0YXRlPXRhcmdldDNkX2FuaS5nZXRDb250cm9sbGVyTGF5ZXIobGF5ZXJJbmRleCkuX3N0YXRlc01hcFthbmlOYW1lXTtcclxuICAgICAgICBpZihhbmltYXRvclN0YXRlPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGFuaW1hdG9yU3RhdGUuYWRkU2NyaXB0KHNjcmlwdCk7XHJcbiAgICAgICAgcmV0dXJuIGFuaW1hdG9yU3RhdGU7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuXHJcblxyXG5jbGFzcyBfX1dteUFuaUV2ZW50IGV4dGVuZHMgTGF5YS5TY3JpcHQzRCB7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFjaz1bXTtcclxuICAgIHB1YmxpYyBhZGRDYWxsYmFjayhjYWxsYmFja05hbWUpe1xyXG4gICAgICAgIHZhciBpbmRleElkPXRoaXMuX2NhbGxiYWNrLmluZGV4T2YoY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICBpZihpbmRleElkPDApe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5wdXNoKGNhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGRlbENhbGxiYWNrKGNhbGxiYWNrTmFtZSl7XHJcbiAgICAgICAgdmFyIGluZGV4SWQ9dGhpcy5fY2FsbGJhY2suaW5kZXhPZihjYWxsYmFja05hbWUpO1xyXG4gICAgICAgIGlmKGluZGV4SWQ+PTApe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5zcGxpY2UoaW5kZXhJZCwxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgX3dteV9hbmlfY2FsbGJhY2socGFyYW1zPzpBcnJheTxhbnk+KXtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2NhbGxiYWNrLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrTmFtZSA9IHRoaXMuX2NhbGxiYWNrW2ldO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KGNhbGxiYWNrTmFtZSxwYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSBcIi4uL1dteVNjcmlwdDNEXCI7XHJcbmltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi4vV215VXRpbHMzRFwiO1xyXG5pbXBvcnQgeyBXbXlVdGlscyB9IGZyb20gXCIuLi8uLi9XbXlVdGlsc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215QzREVmV0ZXhBbmltYXRvciBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuICAgIF9hbmlyOkxheWEuQW5pbWF0b3I7XHJcbiAgICBfdmVydGljZXNPYmo6TGF5YS5TcHJpdGUzRDtcclxuICAgIG9uQXdha2UoKXtcclxuICAgICAgICB0aGlzLl9hbmlyPXRoaXMub3duZXIzRC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZiAodGhpcy5fYW5pciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGlzLm93bmVyM0Qub24oXCJhbmlfcGxheVwiLHRoaXMsdGhpcy5vblBsYXkpO1xyXG5cclxuICAgICAgICB2YXIgb2Jqcz10aGlzLl9hbmlyLl9yZW5kZXJhYmxlU3ByaXRlcztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHZldGV4VD1udWxsO1xyXG4gICAgICAgICAgICBjb25zdCBtZXNoT2JqID0gb2Jqc1tpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtZXNoT2JqLm51bUNoaWxkcmVuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNPYmogPSBtZXNoT2JqLmdldENoaWxkQXQoaSk7XHJcbiAgICAgICAgICAgICAgICBpZihjT2JqLm5hbWUuaW5kZXhPZihcIlZldGV4X0hhbmRsZVwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmV0ZXhUPWNPYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodmV0ZXhUIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2VzT2JqPXZldGV4VDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL21lc2hPYmouX3JlbmRlci5lbmFibGU9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl92ZXJ0aWNlc09iaiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uSW5pdFZlcnRleCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG9uUGxheShuPVwicGxheVwiLHQ9MCxzcGVlZD0xKXtcclxuICAgIC8vICAgICB2YXIgb2Jqcz10aGlzLl9hbmlyLl9yZW5kZXJhYmxlU3ByaXRlcztcclxuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgICAgICAgY29uc3QgbWVzaE9iaiA9IG9ianNbaV07XHJcbiAgICAvLyAgICAgICAgIC8vbWVzaE9iai5fcmVuZGVyLmVuYWJsZT10cnVlO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgdGhpcy5fYW5pci5wbGF5KG4sdW5kZWZpbmVkLHQpO1xyXG4gICAgLy8gICAgIHRoaXMuX2FuaXIuc3BlZWQ9c3BlZWQ7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy/pobbngrktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgX21lc2g6TGF5YS5NZXNoRmlsdGVyO1xyXG4gICAgX3NoYXJlZE1lc2g6YW55O1xyXG5cclxuICAgIF92ZXJ0ZXhCdWZmZXJzOkFycmF5PExheWEuVmVydGV4QnVmZmVyM0Q+O1xyXG4gICAgX3ZlcnRleEFycmF5OkFycmF5PExheWEuVHJhbnNmb3JtM0Q+O1xyXG4gICAgX21NYXBwaW5nVmV0ZXhJbmZvQXJyOkFycmF5PGFueT47XHJcbiAgICBfbUNhY2hlVmVydGljZXNBcnI6QXJyYXk8YW55PjtcclxuXHJcbiAgICBvbkluaXRWZXJ0ZXgoKXtcclxuICAgICAgICB0aGlzLl9tZXNoID0gdGhpcy5fdmVydGljZXNPYmoucGFyZW50W1wibWVzaEZpbHRlclwiXTtcclxuICAgICAgICBpZighdGhpcy5fbWVzaCl7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl92ZXJ0aWNlc09iai5udW1DaGlsZHJlbj4wKXtcclxuICAgICAgICAgICAgdGhpcy5fdmVydGV4QXJyYXk9W107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdmVydGljZXNPYmoubnVtQ2hpbGRyZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmVydGV4QXJyYXlbaV0gPSAodGhpcy5fdmVydGljZXNPYmouZ2V0Q2hpbGRBdChpKSBhcyBMYXlhLlNwcml0ZTNEKS50cmFuc2Zvcm07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXRoaXMuX3ZlcnRleEFycmF5KXtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhPVtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3ZlcnRleEJ1ZmZlcnM9dGhpcy5fbWVzaC5zaGFyZWRNZXNoW1wiX3ZlcnRleEJ1ZmZlcnNcIl07XHJcbiAgICAgICAgdGhpcy5fdmVydGV4QnVmZmVycz10aGlzLl92ZXJ0ZXhCdWZmZXJzLmNvbmNhdCgpO1xyXG4gICAgICAgIHRoaXMuX21lc2guc2hhcmVkTWVzaFtcIl92ZXJ0ZXhCdWZmZXJzXCJdPXRoaXMuX3ZlcnRleEJ1ZmZlcnM7XHJcbiAgICAgIFxyXG4gICAgICAgIHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyID0gdGhpcy5fbWVzaC5zaGFyZWRNZXNoLl9nZXRQb3NpdGlvbnMoKTtcclxuICAgICAgICB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0Fycj1bXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl92ZXJ0ZXhBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX3ZlcnRleEFycmF5W2ldO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnJbaV09e307XHJcbiAgICAgICAgICAgIHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyW2ldLlRyYW5zZm9ybUluZm8gPSBpdGVtO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1JbmRleExpc3Q9W107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyLmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmVydGV4UG9zID0gdGhpcy5fbUNhY2hlVmVydGljZXNBcnJbal07XHJcbiAgICAgICAgICAgICAgICB2YXIgZD1MYXlhLlZlY3RvcjMuZGlzdGFuY2UodmVydGV4UG9zLGl0ZW0ubG9jYWxQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZCA8PTAuMDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIG1JbmRleExpc3QucHVzaChqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnJbaV0uVmV0ZXhJREFyciA9IG1JbmRleExpc3Q7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIG9uTGF0ZVVwZGF0ZSgpe1xyXG4gICAgICAgIGlmKHRoaXMuX2FuaXIuc3BlZWQ9PTApcmV0dXJuO1xyXG4gICAgICAgIHZhciBwbGF5U3RhdGU9dGhpcy5fYW5pci5nZXRDdXJyZW50QW5pbWF0b3JQbGF5U3RhdGUoKTtcclxuICAgICAgICBpZihwbGF5U3RhdGUuX2ZpbmlzaClyZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnIubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyW2ldO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpdGVtLlZldGV4SURBcnIubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhJRCA9IGl0ZW0uVmV0ZXhJREFycltqXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zPSBpdGVtLlRyYW5zZm9ybUluZm8ubG9jYWxQb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyW3ZlcnRleElEXSA9IHBvcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdmVydGV4c19zZXRQb3NpdGlvbnModGhpcy5fdmVydGV4QnVmZmVycyx0aGlzLl9tQ2FjaGVWZXJ0aWNlc0Fycik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgX3ZlcnRleHNfZ2V0UG9zaXRpb25zKHZlcnRleEJ1ZmZlcnMpe1xyXG5cdFx0dmFyIHZlcnRpY2VzPVtdO1xyXG5cdFx0dmFyIGk9MCxqPTAsdmVydGV4QnVmZmVyLHBvc2l0aW9uRWxlbWVudCx2ZXJ0ZXhFbGVtZW50cyx2ZXJ0ZXhFbGVtZW50LG9mc2V0PTAsdmVydGljZXNEYXRhO1xyXG5cdFx0dmFyIHZlcnRleEJ1ZmZlckNvdW50PXZlcnRleEJ1ZmZlcnMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpPTA7aSA8IHZlcnRleEJ1ZmZlckNvdW50O2krKyl7XHJcblx0XHRcdHZlcnRleEJ1ZmZlcj12ZXJ0ZXhCdWZmZXJzW2ldO1xyXG5cdFx0XHR2ZXJ0ZXhFbGVtZW50cz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4RWxlbWVudHM7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0ZXhFbGVtZW50cy5sZW5ndGg7aisrKXtcclxuXHRcdFx0XHR2ZXJ0ZXhFbGVtZW50PXZlcnRleEVsZW1lbnRzW2pdO1xyXG5cdFx0XHRcdGlmICh2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRGb3JtYXQ9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4RWxlbWVudEZvcm1hdC5WZWN0b3IzKi9cInZlY3RvcjNcIiAmJiB2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRVc2FnZT09PS8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1BPU0lUSU9OMCovMCl7XHJcblx0XHRcdFx0XHRwb3NpdGlvbkVsZW1lbnQ9dmVydGV4RWxlbWVudDtcclxuXHRcdFx0XHRcdGJyZWFrIDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dmVydGljZXNEYXRhPXZlcnRleEJ1ZmZlci5nZXREYXRhKCk7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0aWNlc0RhdGEubGVuZ3RoO2orPXZlcnRleEJ1ZmZlci52ZXJ0ZXhEZWNsYXJhdGlvbi52ZXJ0ZXhTdHJpZGUgLyA0KXtcclxuXHRcdFx0XHRvZnNldD1qK3Bvc2l0aW9uRWxlbWVudC5vZmZzZXQgLyA0O1xyXG5cdFx0XHRcdHZlcnRpY2VzLnB1c2gobmV3IExheWEuVmVjdG9yMyh2ZXJ0aWNlc0RhdGFbb2ZzZXQrMF0sdmVydGljZXNEYXRhW29mc2V0KzFdLHZlcnRpY2VzRGF0YVtvZnNldCsyXSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdmVydGljZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIF92ZXJ0ZXhzX3NldFBvc2l0aW9ucyh2ZXJ0ZXhCdWZmZXJzLHZlcnRpY2VzKXtcclxuXHRcdHZhciBpPTAsaj0wLHZlcnRleEJ1ZmZlcixwb3NpdGlvbkVsZW1lbnQsdmVydGV4RWxlbWVudHMsdmVydGV4RWxlbWVudCxvZnNldD0wLHZlcnRpY2VzRGF0YSx2ZXJ0aWNlO1xyXG5cdFx0dmFyIHZlcnRleEJ1ZmZlckNvdW50PXZlcnRleEJ1ZmZlcnMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpPTA7aSA8IHZlcnRleEJ1ZmZlckNvdW50O2krKyl7XHJcblx0XHRcdHZlcnRleEJ1ZmZlcj12ZXJ0ZXhCdWZmZXJzW2ldO1xyXG5cdFx0XHR2ZXJ0ZXhFbGVtZW50cz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4RWxlbWVudHM7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0ZXhFbGVtZW50cy5sZW5ndGg7aisrKXtcclxuXHRcdFx0XHR2ZXJ0ZXhFbGVtZW50PXZlcnRleEVsZW1lbnRzW2pdO1xyXG5cdFx0XHRcdGlmICh2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRGb3JtYXQ9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4RWxlbWVudEZvcm1hdC5WZWN0b3IzKi9cInZlY3RvcjNcIiAmJiB2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRVc2FnZT09PS8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1BPU0lUSU9OMCovMCl7XHJcblx0XHRcdFx0XHRwb3NpdGlvbkVsZW1lbnQ9dmVydGV4RWxlbWVudDtcclxuXHRcdFx0XHRcdGJyZWFrIDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuICAgICAgICAgICAgdmVydGljZXNEYXRhPXZlcnRleEJ1ZmZlci5nZXREYXRhKCk7XHJcbiAgICAgICAgICAgIHZhciBuPTA7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0aWNlc0RhdGEubGVuZ3RoO2orPXZlcnRleEJ1ZmZlci52ZXJ0ZXhEZWNsYXJhdGlvbi52ZXJ0ZXhTdHJpZGUgLyA0KXtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2U9dmVydGljZXNbbl07XHJcbiAgICAgICAgICAgICAgICBvZnNldD1qK3Bvc2l0aW9uRWxlbWVudC5vZmZzZXQgLyA0O1xyXG4gICAgICAgICAgICAgICAgdmVydGljZXNEYXRhW29mc2V0KzBdPXZlcnRpY2UueDtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzRGF0YVtvZnNldCsxXT12ZXJ0aWNlLnk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlc0RhdGFbb2ZzZXQrMl09dmVydGljZS56O1xyXG4gICAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZlcnRleEJ1ZmZlci5zZXREYXRhKHZlcnRpY2VzRGF0YSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgb25HZXRXb3JsZFBvcyh0YXJnZXQscG9zKXtcclxuICAgICAgICB2YXIgb3V0UG9zPW5ldyBMYXlhLlZlY3RvcjMoKTtcclxuICAgICAgICBpZiAodGFyZ2V0Ll9wYXJlbnQgIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIHBhcmVudFBvc2l0aW9uPXRhcmdldC5wYXJlbnQudHJhbnNmb3JtLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBMYXlhLlZlY3RvcjMubXVsdGlwbHkocG9zLHRhcmdldC5wYXJlbnQudHJhbnNmb3JtLnNjYWxlLExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdKTtcclxuICAgICAgICAgICAgTGF5YS5WZWN0b3IzLnRyYW5zZm9ybVF1YXQoTGF5YS5UcmFuc2Zvcm0zRFtcIl90ZW1wVmVjdG9yMzBcIl0sdGFyZ2V0LnBhcmVudC50cmFuc2Zvcm0ucm90YXRpb24sTGF5YS5UcmFuc2Zvcm0zRFtcIl90ZW1wVmVjdG9yMzBcIl0pO1xyXG4gICAgICAgICAgICBMYXlhLlZlY3RvcjMuYWRkKHBhcmVudFBvc2l0aW9uLExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdLG91dFBvcyk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBwb3MuY2xvbmVUbyhvdXRQb3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0UG9zO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSBcIi4uL1dteVNjcmlwdDNEXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlQaHlzaWNzX0NoYXJhY3RlciBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuXHRwdWJsaWMgb25EZWwoKTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5jaGFyYWN0ZXIhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLmNoYXJhY3Rlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyPW51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGNoYXJhY3RlcjpMYXlhLkNoYXJhY3RlckNvbnRyb2xsZXI7XHJcblxyXG4gICAgcHVibGljIHNwZWVkVjM9bmV3IExheWEuVmVjdG9yMygpO1xyXG4gICAgcHVibGljIGdyYXZpdHk9bmV3IExheWEuVmVjdG9yMygpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNHcm91bmRlZCgpe1xyXG4gICAgICAgIGlmKHRoaXMuY2hhcmFjdGVyPT1udWxsKXJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFyYWN0ZXIuaXNHcm91bmRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25TdGFydCgpe1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkluaXQocmFkaXVzLCBsZW5ndGgsIG9yaWVudGF0aW9uLGxvY2FsT2Zmc2V0WCwgbG9jYWxPZmZzZXRZLCBsb2NhbE9mZnNldFope1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gdGhpcy5vd25lcjNELmFkZENvbXBvbmVudChMYXlhLkNoYXJhY3RlckNvbnRyb2xsZXIpO1xyXG5cdFx0dmFyIHNwaGVyZVNoYXBlOkxheWEuQ2Fwc3VsZUNvbGxpZGVyU2hhcGUgPSBuZXcgTGF5YS5DYXBzdWxlQ29sbGlkZXJTaGFwZShyYWRpdXMsIGxlbmd0aCwgb3JpZW50YXRpb24pO1xyXG4gICAgICAgIHNwaGVyZVNoYXBlLmxvY2FsT2Zmc2V0ID1uZXcgTGF5YS5WZWN0b3IzKGxvY2FsT2Zmc2V0WCxsb2NhbE9mZnNldFksbG9jYWxPZmZzZXRaKTtcclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5jb2xsaWRlclNoYXBlID0gc3BoZXJlU2hhcGU7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIuZ3Jhdml0eT10aGlzLmdyYXZpdHk7XHJcbiAgICAgICAgLy8gdGhpcy5jaGFyYWN0ZXIuX3VwZGF0ZVBoeXNpY3NUcmFuc2Zvcm0oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBwdWJsaWMgaXNMb2NrTW92ZT1mYWxzZTtcclxuICAgIG9uVXBkYXRlKCl7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIuZ3Jhdml0eT10aGlzLmdyYXZpdHk7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIubW92ZSh0aGlzLnNwZWVkVjMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtb3ZlKHYzOkxheWEuVmVjdG9yMyxsb2NrTW92ZVRpbWU6bnVtYmVyPTApe1xyXG4gICAgICAgIHRoaXMuaXNMb2NrTW92ZT10cnVlO1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLm1vdmUodjMpO1xyXG4gICAgICAgIExheWEudGltZXIub25jZShsb2NrTW92ZVRpbWUqMTAwMCx0aGlzLCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2NrTW92ZT1mYWxzZTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgX3VwZGF0ZVBoeXNpY3NUcmFuc2Zvcm0oKXtcclxuXHRcdC8vdmFyIG5hdGl2ZVdvcmxkVHJhbnNmb3JtPXRoaXMuY2hhcmFjdGVyLl9uYXRpdmVDb2xsaWRlck9iamVjdC5nZXRXb3JsZFRyYW5zZm9ybSgpO1xyXG5cdFx0dGhpcy5jaGFyYWN0ZXIuX2Rlcml2ZVBoeXNpY3NUcmFuc2Zvcm1hdGlvbih0cnVlKTsgXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgV0Vhc2VUeXBlIH0gZnJvbSBcIi4vV0Vhc2VUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV0Vhc2VNYW5hZ2VyIHtcclxuXHRwcml2YXRlIHN0YXRpYyBfUGlPdmVyMjogbnVtYmVyID0gTWF0aC5QSSAqIDAuNTtcclxuXHRwcml2YXRlIHN0YXRpYyBfVHdvUGk6IG51bWJlciA9IE1hdGguUEkgKiAyO1xyXG5cclxuXHRwdWJsaWMgc3RhdGljIGV2YWx1YXRlKGVhc2VUeXBlOiBudW1iZXIsIHRpbWU6IG51bWJlciwgZHVyYXRpb246IG51bWJlciwgb3ZlcnNob290T3JBbXBsaXR1ZGU6IG51bWJlciwgcGVyaW9kOiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0c3dpdGNoIChlYXNlVHlwZSkge1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5MaW5lYXI6XHJcblx0XHRcdFx0cmV0dXJuIHRpbWUgLyBkdXJhdGlvbjtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuU2luZUluOlxyXG5cdFx0XHRcdHJldHVybiAtTWF0aC5jb3ModGltZSAvIGR1cmF0aW9uICogV0Vhc2VNYW5hZ2VyLl9QaU92ZXIyKSArIDE7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlNpbmVPdXQ6XHJcblx0XHRcdFx0cmV0dXJuIE1hdGguc2luKHRpbWUgLyBkdXJhdGlvbiAqIFdFYXNlTWFuYWdlci5fUGlPdmVyMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlNpbmVJbk91dDpcclxuXHRcdFx0XHRyZXR1cm4gLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogdGltZSAvIGR1cmF0aW9uKSAtIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFkSW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWU7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YWRPdXQ6XHJcblx0XHRcdFx0cmV0dXJuIC0odGltZSAvPSBkdXJhdGlvbikgKiAodGltZSAtIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFkSW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0XHRyZXR1cm4gLTAuNSAqICgoLS10aW1lKSAqICh0aW1lIC0gMikgLSAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQ3ViaWNJbjpcclxuXHRcdFx0XHRyZXR1cm4gKHRpbWUgLz0gZHVyYXRpb24pICogdGltZSAqIHRpbWU7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkN1YmljT3V0OlxyXG5cdFx0XHRcdHJldHVybiAoKHRpbWUgPSB0aW1lIC8gZHVyYXRpb24gLSAxKSAqIHRpbWUgKiB0aW1lICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkN1YmljSW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiB0aW1lICsgMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YXJ0SW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhcnRPdXQ6XHJcblx0XHRcdFx0cmV0dXJuIC0oKHRpbWUgPSB0aW1lIC8gZHVyYXRpb24gLSAxKSAqIHRpbWUgKiB0aW1lICogdGltZSAtIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFydEluT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0XHRyZXR1cm4gLTAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiB0aW1lICogdGltZSAtIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWludEluOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWludE91dDpcclxuXHRcdFx0XHRyZXR1cm4gKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1aW50SW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0XHRyZXR1cm4gMC41ICogKCh0aW1lIC09IDIpICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FeHBvSW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lID09IDApID8gMCA6IE1hdGgucG93KDIsIDEwICogKHRpbWUgLyBkdXJhdGlvbiAtIDEpKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRXhwb091dDpcclxuXHRcdFx0XHRpZiAodGltZSA9PSBkdXJhdGlvbikgcmV0dXJuIDE7XHJcblx0XHRcdFx0cmV0dXJuICgtTWF0aC5wb3coMiwgLTEwICogdGltZSAvIGR1cmF0aW9uKSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FeHBvSW5PdXQ6XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gMCkgcmV0dXJuIDA7XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gZHVyYXRpb24pIHJldHVybiAxO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogTWF0aC5wb3coMiwgMTAgKiAodGltZSAtIDEpKTtcclxuXHRcdFx0XHRyZXR1cm4gMC41ICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXRpbWUpICsgMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkNpcmNJbjpcclxuXHRcdFx0XHRyZXR1cm4gLShNYXRoLnNxcnQoMSAtICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUpIC0gMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkNpcmNPdXQ6XHJcblx0XHRcdFx0cmV0dXJuIE1hdGguc3FydCgxIC0gKHRpbWUgPSB0aW1lIC8gZHVyYXRpb24gLSAxKSAqIHRpbWUpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DaXJjSW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAtMC41ICogKE1hdGguc3FydCgxIC0gdGltZSAqIHRpbWUpIC0gMSk7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtICh0aW1lIC09IDIpICogdGltZSkgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRWxhc3RpY0luOlxyXG5cdFx0XHRcdHZhciBzMDogbnVtYmVyO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbikgPT0gMSkgcmV0dXJuIDE7XHJcblx0XHRcdFx0aWYgKHBlcmlvZCA9PSAwKSBwZXJpb2QgPSBkdXJhdGlvbiAqIDAuMztcclxuXHRcdFx0XHRpZiAob3ZlcnNob290T3JBbXBsaXR1ZGUgPCAxKSB7XHJcblx0XHRcdFx0XHRvdmVyc2hvb3RPckFtcGxpdHVkZSA9IDE7XHJcblx0XHRcdFx0XHRzMCA9IHBlcmlvZCAvIDQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgczAgPSBwZXJpb2QgLyBXRWFzZU1hbmFnZXIuX1R3b1BpICogTWF0aC5hc2luKDEgLyBvdmVyc2hvb3RPckFtcGxpdHVkZSk7XHJcblx0XHRcdFx0cmV0dXJuIC0ob3ZlcnNob290T3JBbXBsaXR1ZGUgKiBNYXRoLnBvdygyLCAxMCAqICh0aW1lIC09IDEpKSAqIE1hdGguc2luKCh0aW1lICogZHVyYXRpb24gLSBzMCkgKiBXRWFzZU1hbmFnZXIuX1R3b1BpIC8gcGVyaW9kKSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkVsYXN0aWNPdXQ6XHJcblx0XHRcdFx0dmFyIHMxOiBudW1iZXI7XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gMCkgcmV0dXJuIDA7XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uKSA9PSAxKSByZXR1cm4gMTtcclxuXHRcdFx0XHRpZiAocGVyaW9kID09IDApIHBlcmlvZCA9IGR1cmF0aW9uICogMC4zO1xyXG5cdFx0XHRcdGlmIChvdmVyc2hvb3RPckFtcGxpdHVkZSA8IDEpIHtcclxuXHRcdFx0XHRcdG92ZXJzaG9vdE9yQW1wbGl0dWRlID0gMTtcclxuXHRcdFx0XHRcdHMxID0gcGVyaW9kIC8gNDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBzMSA9IHBlcmlvZCAvIFdFYXNlTWFuYWdlci5fVHdvUGkgKiBNYXRoLmFzaW4oMSAvIG92ZXJzaG9vdE9yQW1wbGl0dWRlKTtcclxuXHRcdFx0XHRyZXR1cm4gKG92ZXJzaG9vdE9yQW1wbGl0dWRlICogTWF0aC5wb3coMiwgLTEwICogdGltZSkgKiBNYXRoLnNpbigodGltZSAqIGR1cmF0aW9uIC0gczEpICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRWxhc3RpY0luT3V0OlxyXG5cdFx0XHRcdHZhciBzOiBudW1iZXI7XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gMCkgcmV0dXJuIDA7XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA9PSAyKSByZXR1cm4gMTtcclxuXHRcdFx0XHRpZiAocGVyaW9kID09IDApIHBlcmlvZCA9IGR1cmF0aW9uICogKDAuMyAqIDEuNSk7XHJcblx0XHRcdFx0aWYgKG92ZXJzaG9vdE9yQW1wbGl0dWRlIDwgMSkge1xyXG5cdFx0XHRcdFx0b3ZlcnNob290T3JBbXBsaXR1ZGUgPSAxO1xyXG5cdFx0XHRcdFx0cyA9IHBlcmlvZCAvIDQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgcyA9IHBlcmlvZCAvIFdFYXNlTWFuYWdlci5fVHdvUGkgKiBNYXRoLmFzaW4oMSAvIG92ZXJzaG9vdE9yQW1wbGl0dWRlKTtcclxuXHRcdFx0XHRpZiAodGltZSA8IDEpIHJldHVybiAtMC41ICogKG92ZXJzaG9vdE9yQW1wbGl0dWRlICogTWF0aC5wb3coMiwgMTAgKiAodGltZSAtPSAxKSkgKiBNYXRoLnNpbigodGltZSAqIGR1cmF0aW9uIC0gcykgKiBXRWFzZU1hbmFnZXIuX1R3b1BpIC8gcGVyaW9kKSk7XHJcblx0XHRcdFx0cmV0dXJuIG92ZXJzaG9vdE9yQW1wbGl0dWRlICogTWF0aC5wb3coMiwgLTEwICogKHRpbWUgLT0gMSkpICogTWF0aC5zaW4oKHRpbWUgKiBkdXJhdGlvbiAtIHMpICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkgKiAwLjUgKyAxO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5CYWNrSW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUgKiAoKG92ZXJzaG9vdE9yQW1wbGl0dWRlICsgMSkgKiB0aW1lIC0gb3ZlcnNob290T3JBbXBsaXR1ZGUpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5CYWNrT3V0OlxyXG5cdFx0XHRcdHJldHVybiAoKHRpbWUgPSB0aW1lIC8gZHVyYXRpb24gLSAxKSAqIHRpbWUgKiAoKG92ZXJzaG9vdE9yQW1wbGl0dWRlICsgMSkgKiB0aW1lICsgb3ZlcnNob290T3JBbXBsaXR1ZGUpICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJhY2tJbk91dDpcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqICh0aW1lICogdGltZSAqICgoKG92ZXJzaG9vdE9yQW1wbGl0dWRlICo9ICgxLjUyNSkpICsgMSkgKiB0aW1lIC0gb3ZlcnNob290T3JBbXBsaXR1ZGUpKTtcclxuXHRcdFx0XHRyZXR1cm4gMC41ICogKCh0aW1lIC09IDIpICogdGltZSAqICgoKG92ZXJzaG9vdE9yQW1wbGl0dWRlICo9ICgxLjUyNSkpICsgMSkgKiB0aW1lICsgb3ZlcnNob290T3JBbXBsaXR1ZGUpICsgMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJvdW5jZUluOlxyXG5cdFx0XHRcdHJldHVybiBCb3VuY2UuZWFzZUluKHRpbWUsIGR1cmF0aW9uKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQm91bmNlT3V0OlxyXG5cdFx0XHRcdHJldHVybiBCb3VuY2UuZWFzZU91dCh0aW1lLCBkdXJhdGlvbik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJvdW5jZUluT3V0OlxyXG5cdFx0XHRcdHJldHVybiBCb3VuY2UuZWFzZUluT3V0KHRpbWUsIGR1cmF0aW9uKTtcclxuXHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0cmV0dXJuIC0odGltZSAvPSBkdXJhdGlvbikgKiAodGltZSAtIDIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0fVxyXG59XHJcblxyXG4vLy8gVGhpcyBjbGFzcyBjb250YWlucyBhIEMjIHBvcnQgb2YgdGhlIGVhc2luZyBlcXVhdGlvbnMgY3JlYXRlZCBieSBSb2JlcnQgUGVubmVyIChodHRwOi8vcm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcpLlxyXG5leHBvcnQgY2xhc3MgQm91bmNlIHtcclxuXHRwdWJsaWMgc3RhdGljIGVhc2VJbih0aW1lOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIDEgLSBCb3VuY2UuZWFzZU91dChkdXJhdGlvbiAtIHRpbWUsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZWFzZU91dCh0aW1lOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uKSA8ICgxIC8gMi43NSkpIHtcclxuXHRcdFx0cmV0dXJuICg3LjU2MjUgKiB0aW1lICogdGltZSk7XHJcblx0XHR9XHJcblx0XHRpZiAodGltZSA8ICgyIC8gMi43NSkpIHtcclxuXHRcdFx0cmV0dXJuICg3LjU2MjUgKiAodGltZSAtPSAoMS41IC8gMi43NSkpICogdGltZSArIDAuNzUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRpbWUgPCAoMi41IC8gMi43NSkpIHtcclxuXHRcdFx0cmV0dXJuICg3LjU2MjUgKiAodGltZSAtPSAoMi4yNSAvIDIuNzUpKSAqIHRpbWUgKyAwLjkzNzUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuICg3LjU2MjUgKiAodGltZSAtPSAoMi42MjUgLyAyLjc1KSkgKiB0aW1lICsgMC45ODQzNzUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBlYXNlSW5PdXQodGltZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdGlmICh0aW1lIDwgZHVyYXRpb24gKiAwLjUpIHtcclxuXHRcdFx0cmV0dXJuIEJvdW5jZS5lYXNlSW4odGltZSAqIDIsIGR1cmF0aW9uKSAqIDAuNTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBCb3VuY2UuZWFzZU91dCh0aW1lICogMiAtIGR1cmF0aW9uLCBkdXJhdGlvbikgKiAwLjUgKyAwLjU7XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIFdFYXNlVHlwZSB7XHJcblx0cHVibGljIHN0YXRpYyBMaW5lYXI6IG51bWJlciA9IDA7XHJcblx0cHVibGljIHN0YXRpYyBTaW5lSW46IG51bWJlciA9IDE7XHJcblx0cHVibGljIHN0YXRpYyBTaW5lT3V0OiBudW1iZXIgPSAyO1xyXG5cdHB1YmxpYyBzdGF0aWMgU2luZUluT3V0OiBudW1iZXIgPSAzO1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhZEluOiBudW1iZXIgPSA0O1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhZE91dDogbnVtYmVyID0gNTtcclxuXHRwdWJsaWMgc3RhdGljIFF1YWRJbk91dDogbnVtYmVyID0gNjtcclxuXHRwdWJsaWMgc3RhdGljIEN1YmljSW46IG51bWJlciA9IDc7XHJcblx0cHVibGljIHN0YXRpYyBDdWJpY091dDogbnVtYmVyID0gODtcclxuXHRwdWJsaWMgc3RhdGljIEN1YmljSW5PdXQ6IG51bWJlciA9IDk7XHJcblx0cHVibGljIHN0YXRpYyBRdWFydEluOiBudW1iZXIgPSAxMDtcclxuXHRwdWJsaWMgc3RhdGljIFF1YXJ0T3V0OiBudW1iZXIgPSAxMTtcclxuXHRwdWJsaWMgc3RhdGljIFF1YXJ0SW5PdXQ6IG51bWJlciA9IDEyO1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVpbnRJbjogbnVtYmVyID0gMTM7XHJcblx0cHVibGljIHN0YXRpYyBRdWludE91dDogbnVtYmVyID0gMTQ7XHJcblx0cHVibGljIHN0YXRpYyBRdWludEluT3V0OiBudW1iZXIgPSAxNTtcclxuXHRwdWJsaWMgc3RhdGljIEV4cG9JbjogbnVtYmVyID0gMTY7XHJcblx0cHVibGljIHN0YXRpYyBFeHBvT3V0OiBudW1iZXIgPSAxNztcclxuXHRwdWJsaWMgc3RhdGljIEV4cG9Jbk91dDogbnVtYmVyID0gMTg7XHJcblx0cHVibGljIHN0YXRpYyBDaXJjSW46IG51bWJlciA9IDE5O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ2lyY091dDogbnVtYmVyID0gMjA7XHJcblx0cHVibGljIHN0YXRpYyBDaXJjSW5PdXQ6IG51bWJlciA9IDIxO1xyXG5cdHB1YmxpYyBzdGF0aWMgRWxhc3RpY0luOiBudW1iZXIgPSAyMjtcclxuXHRwdWJsaWMgc3RhdGljIEVsYXN0aWNPdXQ6IG51bWJlciA9IDIzO1xyXG5cdHB1YmxpYyBzdGF0aWMgRWxhc3RpY0luT3V0OiBudW1iZXIgPSAyNDtcclxuXHRwdWJsaWMgc3RhdGljIEJhY2tJbjogbnVtYmVyID0gMjU7XHJcblx0cHVibGljIHN0YXRpYyBCYWNrT3V0OiBudW1iZXIgPSAyNjtcclxuXHRwdWJsaWMgc3RhdGljIEJhY2tJbk91dDogbnVtYmVyID0gMjc7XHJcblx0cHVibGljIHN0YXRpYyBCb3VuY2VJbjogbnVtYmVyID0gMjg7XHJcblx0cHVibGljIHN0YXRpYyBCb3VuY2VPdXQ6IG51bWJlciA9IDI5O1xyXG5cdHB1YmxpYyBzdGF0aWMgQm91bmNlSW5PdXQ6IG51bWJlciA9IDMwO1xyXG5cdHB1YmxpYyBzdGF0aWMgQ3VzdG9tOiBudW1iZXIgPSAzMTtcclxufSIsImltcG9ydCB7IFdUd2VlbmVyIH0gZnJvbSBcIi4vV1R3ZWVuZXJcIjtcclxuaW1wb3J0IHsgV1R3ZWVuTWFuYWdlciB9IGZyb20gXCIuL1dUd2Vlbk1hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXVHdlZW4ge1xyXG5cdHB1YmxpYyBzdGF0aWMgY2F0Y2hDYWxsYmFja0V4Y2VwdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG8oc3RhcnQsIGVuZCwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB0bzIoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90bzIoc3RhcnQsIHN0YXJ0MiwgZW5kLCBlbmQyLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvMyhzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgc3RhcnQzOiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90bzMoc3RhcnQsIHN0YXJ0Miwgc3RhcnQzLCBlbmQsIGVuZDIsIGVuZDMsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgdG80KHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBzdGFydDM6IG51bWJlciwgc3RhcnQ0OiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGVuZDQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3RvNChzdGFydCwgc3RhcnQyLCBzdGFydDMsIHN0YXJ0NCwgZW5kLCBlbmQyLCBlbmQzLCBlbmQ0LCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvQ29sb3Ioc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90b0NvbG9yKHN0YXJ0LCBlbmQsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZGVsYXllZENhbGwoZGVsYXk6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuc2V0RGVsYXkoZGVsYXkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBzaGFrZShzdGFydFg6IG51bWJlciwgc3RhcnRZOiBudW1iZXIsIGFtcGxpdHVkZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fc2hha2Uoc3RhcnRYLCBzdGFydFksIGFtcGxpdHVkZSwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBpc1R3ZWVuaW5nKHRhcmdldDogT2JqZWN0LCBwcm9wVHlwZTogT2JqZWN0KTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5pc1R3ZWVuaW5nKHRhcmdldCwgcHJvcFR5cGUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBraWxsKHRhcmdldDogT2JqZWN0LCBjb21wbGV0ZTogYm9vbGVhbiA9IGZhbHNlLCBwcm9wVHlwZTogT2JqZWN0ID0gbnVsbCk6IHZvaWQge1xyXG5cdFx0V1R3ZWVuTWFuYWdlci5raWxsVHdlZW5zKHRhcmdldCwgZmFsc2UsIG51bGwpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBnZXRUd2Vlbih0YXJnZXQ6IE9iamVjdCwgcHJvcFR5cGU6IE9iamVjdCA9IG51bGwpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5nZXRUd2Vlbih0YXJnZXQsIHByb3BUeXBlKTtcclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxufSIsImltcG9ydCB7IFdUd2VlbmVyIH0gZnJvbSBcIi4vV1R3ZWVuZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXVHdlZW5NYW5hZ2VyIHtcclxuXHRwcml2YXRlIHN0YXRpYyBfYWN0aXZlVHdlZW5zOiBhbnlbXSA9IG5ldyBBcnJheSgzMCk7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX3R3ZWVuZXJQb29sOiBXVHdlZW5lcltdID0gW107XHJcblx0cHJpdmF0ZSBzdGF0aWMgX3RvdGFsQWN0aXZlVHdlZW5zOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgc3RhdGljIF9pbml0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHVibGljIHN0YXRpYyBjcmVhdGVUd2VlbigpOiBXVHdlZW5lciB7XHJcblx0XHRpZiAoIVdUd2Vlbk1hbmFnZXIuX2luaXRlZCkge1xyXG5cdFx0XHRMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLCBudWxsLCB0aGlzLnVwZGF0ZSk7XHJcblx0XHRcdFdUd2Vlbk1hbmFnZXIuX2luaXRlZCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHR3ZWVuZXI6IFdUd2VlbmVyO1xyXG5cdFx0dmFyIGNudDogbnVtYmVyID0gV1R3ZWVuTWFuYWdlci5fdHdlZW5lclBvb2wubGVuZ3RoO1xyXG5cdFx0aWYgKGNudCA+IDApIHtcclxuXHRcdFx0dHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX3R3ZWVuZXJQb29sLnBvcCgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0d2VlbmVyID0gbmV3IFdUd2VlbmVyKCk7XHJcblx0XHR0d2VlbmVyLl9pbml0KCk7XHJcblx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMrK10gPSB0d2VlbmVyO1xyXG5cclxuXHRcdGlmIChXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucyA9PSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnMubGVuZ3RoKVxyXG5cdFx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnMubGVuZ3RoID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aCArIE1hdGguY2VpbChXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnMubGVuZ3RoICogMC41KTtcclxuXHJcblx0XHRyZXR1cm4gdHdlZW5lcjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgaXNUd2VlbmluZyh0YXJnZXQ6IGFueSwgcHJvcFR5cGU6IGFueSk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0dmFyIGFueVR5cGU6IGJvb2xlYW4gPSBwcm9wVHlwZSA9PSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zOyBpKyspIHtcclxuXHRcdFx0dmFyIHR3ZWVuZXI6IFdUd2VlbmVyID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldO1xyXG5cdFx0XHRpZiAodHdlZW5lciAhPSBudWxsICYmIHR3ZWVuZXIudGFyZ2V0ID09IHRhcmdldCAmJiAhdHdlZW5lci5fa2lsbGVkXHJcblx0XHRcdFx0JiYgKGFueVR5cGUgfHwgdHdlZW5lci5fcHJvcFR5cGUgPT0gcHJvcFR5cGUpKVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMga2lsbFR3ZWVucyh0YXJnZXQ6IGFueSwgY29tcGxldGVkOiBib29sZWFuPWZhbHNlLCBwcm9wVHlwZTogYW55ID1udWxsKTogYm9vbGVhbiB7XHJcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHR2YXIgZmxhZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0dmFyIGNudDogbnVtYmVyID0gV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnM7XHJcblx0XHR2YXIgYW55VHlwZTogYm9vbGVhbiA9IHByb3BUeXBlID09IG51bGw7XHJcblx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgY250OyBpKyspIHtcclxuXHRcdFx0dmFyIHR3ZWVuZXI6IFdUd2VlbmVyID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldO1xyXG5cdFx0XHRpZiAodHdlZW5lciAhPSBudWxsICYmIHR3ZWVuZXIudGFyZ2V0ID09IHRhcmdldCAmJiAhdHdlZW5lci5fa2lsbGVkXHJcblx0XHRcdFx0JiYgKGFueVR5cGUgfHwgdHdlZW5lci5fcHJvcFR5cGUgPT0gcHJvcFR5cGUpKSB7XHJcblx0XHRcdFx0dHdlZW5lci5raWxsKGNvbXBsZXRlZCk7XHJcblx0XHRcdFx0ZmxhZyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmxhZztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0VHdlZW4odGFyZ2V0OiBhbnksIHByb3BUeXBlOiBhbnkpOiBXVHdlZW5lciB7XHJcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpXHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zO1xyXG5cdFx0dmFyIGFueVR5cGU6IGJvb2xlYW4gPSBwcm9wVHlwZSA9PSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgIT0gbnVsbCAmJiB0d2VlbmVyLnRhcmdldCA9PSB0YXJnZXQgJiYgIXR3ZWVuZXIuX2tpbGxlZFxyXG5cdFx0XHRcdCYmIChhbnlUeXBlIHx8IHR3ZWVuZXIuX3Byb3BUeXBlID09IHByb3BUeXBlKSkge1xyXG5cdFx0XHRcdHJldHVybiB0d2VlbmVyO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuXHRcdHZhciBkdDogbnVtYmVyID0gTGF5YS50aW1lci5kZWx0YSAvIDEwMDA7XHJcblxyXG5cdFx0dmFyIGNudDogbnVtYmVyID0gV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnM7XHJcblx0XHR2YXIgZnJlZVBvc1N0YXJ0OiBudW1iZXIgPSAtMTtcclxuXHRcdHZhciBmcmVlUG9zQ291bnQ6IG51bWJlciA9IDA7XHJcblx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgY250OyBpKyspIHtcclxuXHRcdFx0dmFyIHR3ZWVuZXI6IFdUd2VlbmVyID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldO1xyXG5cdFx0XHRpZiAodHdlZW5lciA9PSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKGZyZWVQb3NTdGFydCA9PSAtMSlcclxuXHRcdFx0XHRcdGZyZWVQb3NTdGFydCA9IGk7XHJcblx0XHRcdFx0ZnJlZVBvc0NvdW50Kys7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodHdlZW5lci5fa2lsbGVkKSB7XHJcblx0XHRcdFx0dHdlZW5lci5fcmVzZXQoKTtcclxuXHRcdFx0XHRXVHdlZW5NYW5hZ2VyLl90d2VlbmVyUG9vbC5wdXNoKHR3ZWVuZXIpO1xyXG5cdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXSA9IG51bGw7XHJcblxyXG5cdFx0XHRcdGlmIChmcmVlUG9zU3RhcnQgPT0gLTEpXHJcblx0XHRcdFx0XHRmcmVlUG9zU3RhcnQgPSBpO1xyXG5cdFx0XHRcdGZyZWVQb3NDb3VudCsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGlmICghdHdlZW5lci5fcGF1c2VkKVxyXG5cdFx0XHRcdFx0dHdlZW5lci5fdXBkYXRlKGR0KTtcclxuXHJcblx0XHRcdFx0aWYgKGZyZWVQb3NTdGFydCAhPSAtMSkge1xyXG5cdFx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ZyZWVQb3NTdGFydF0gPSB0d2VlbmVyO1xyXG5cdFx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldID0gbnVsbDtcclxuXHRcdFx0XHRcdGZyZWVQb3NTdGFydCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChmcmVlUG9zU3RhcnQgPj0gMCkge1xyXG5cdFx0XHRpZiAoV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMgIT0gY250KSAvL25ldyB0d2VlbnMgYWRkZWRcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBqOiBudW1iZXIgPSBjbnQ7XHJcblx0XHRcdFx0Y250ID0gV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMgLSBjbnQ7XHJcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNudDsgaSsrKVxyXG5cdFx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ZyZWVQb3NTdGFydCsrXSA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tqKytdO1xyXG5cdFx0XHR9XHJcblx0XHRcdFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zID0gZnJlZVBvc1N0YXJ0O1xyXG5cdFx0fVxyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBXVHdlZW5WYWx1ZSB7XHJcblx0cHVibGljIHg6IG51bWJlcjtcclxuXHRwdWJsaWMgeTogbnVtYmVyO1xyXG5cdHB1YmxpYyB6OiBudW1iZXI7XHJcblx0cHVibGljIHc6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSB0aGlzLncgPSAwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBjb2xvcigpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuICh0aGlzLncgPDwgMjQpICsgKHRoaXMueCA8PCAxNikgKyAodGhpcy55IDw8IDgpICsgdGhpcy56O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBjb2xvcih2YWx1ZTogbnVtYmVyKSB7XHJcblx0XHR0aGlzLnggPSAodmFsdWUgJiAweEZGMDAwMCkgPj4gMTY7XHJcblx0XHR0aGlzLnkgPSAodmFsdWUgJiAweDAwRkYwMCkgPj4gODtcclxuXHRcdHRoaXMueiA9ICh2YWx1ZSAmIDB4MDAwMEZGKTtcclxuXHRcdHRoaXMudyA9ICh2YWx1ZSAmIDB4RkYwMDAwMDApID4+IDI0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEZpZWxkKGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0c3dpdGNoIChpbmRleCkge1xyXG5cdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMueDtcclxuXHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLnk7XHJcblx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy56O1xyXG5cdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMudztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbmRleCBvdXQgb2YgYm91bmRzOiBcIiArIGluZGV4KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRGaWVsZChpbmRleDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRzd2l0Y2ggKGluZGV4KSB7XHJcblx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHR0aGlzLnggPSB2YWx1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdHRoaXMueSA9IHZhbHVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0dGhpcy56ID0gdmFsdWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHR0aGlzLncgPSB2YWx1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbmRleCBvdXQgb2YgYm91bmRzOiBcIiArIGluZGV4KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRaZXJvKCk6IHZvaWQge1xyXG5cdFx0dGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gdGhpcy53ID0gMDtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBXVHdlZW5WYWx1ZSB9IGZyb20gXCIuL1dUd2VlblZhbHVlXCI7XHJcbmltcG9ydCB7IFdFYXNlVHlwZSB9IGZyb20gXCIuL1dFYXNlVHlwZVwiO1xyXG5pbXBvcnQgeyBXVHdlZW4gfSBmcm9tIFwiLi9XVHdlZW5cIjtcclxuaW1wb3J0IHsgV0Vhc2VNYW5hZ2VyIH0gZnJvbSBcIi4vV0Vhc2VNYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV1R3ZWVuZXIge1xyXG5cdHB1YmxpYyBfdGFyZ2V0OiBhbnk7XHJcblx0cHVibGljIF9wcm9wVHlwZTogYW55O1xyXG5cdHB1YmxpYyBfa2lsbGVkOiBib29sZWFuO1xyXG5cdHB1YmxpYyBfcGF1c2VkOiBib29sZWFuO1xyXG5cclxuXHRwcml2YXRlIF9kZWxheTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2R1cmF0aW9uOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfYnJlYWtwb2ludDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2Vhc2VUeXBlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWFzZVBlcmlvZDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3JlcGVhdDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3lveW86IGJvb2xlYW47XHJcblx0cHJpdmF0ZSBfdGltZVNjYWxlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfc25hcHBpbmc6IGJvb2xlYW47XHJcblx0cHJpdmF0ZSBfdXNlckRhdGE6IGFueTtcclxuXHJcblx0cHJpdmF0ZSBfb25VcGRhdGU6IEZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgX29uVXBkYXRlQ2FsbGVyOiBhbnk7XHJcblx0cHJpdmF0ZSBfb25TdGFydDogRnVuY3Rpb247XHJcblx0cHJpdmF0ZSBfb25TdGFydENhbGxlcjogYW55O1xyXG5cdHByaXZhdGUgX29uQ29tcGxldGU6IEZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgX29uQ29tcGxldGVDYWxsZXI6IGFueTtcclxuXHJcblx0cHJpdmF0ZSBfc3RhcnRWYWx1ZTogV1R3ZWVuVmFsdWU7XHJcblx0cHJpdmF0ZSBfZW5kVmFsdWU6IFdUd2VlblZhbHVlO1xyXG5cdHByaXZhdGUgX3ZhbHVlOiBXVHdlZW5WYWx1ZTtcclxuXHRwcml2YXRlIF9kZWx0YVZhbHVlOiBXVHdlZW5WYWx1ZTtcclxuXHRwcml2YXRlIF92YWx1ZVNpemU6IG51bWJlcjtcclxuXHJcblx0cHJpdmF0ZSBfc3RhcnRlZDogYm9vbGVhbjtcclxuXHRwdWJsaWMgX2VuZGVkOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWxhcHNlZFRpbWU6IG51bWJlcjtcclxuXHRwcml2YXRlIF9ub3JtYWxpemVkVGltZTogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUgPSBuZXcgV1R3ZWVuVmFsdWUoKTtcclxuXHRcdHRoaXMuX2VuZFZhbHVlID0gbmV3IFdUd2VlblZhbHVlKCk7XHJcblx0XHR0aGlzLl92YWx1ZSA9IG5ldyBXVHdlZW5WYWx1ZSgpO1xyXG5cdFx0dGhpcy5fZGVsdGFWYWx1ZSA9IG5ldyBXVHdlZW5WYWx1ZSgpO1xyXG5cclxuXHRcdHRoaXMuX3Jlc2V0KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RGVsYXkodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2RlbGF5ID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZGVsYXkoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9kZWxheTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXREdXJhdGlvbih2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBkdXJhdGlvbigpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEJyZWFrcG9pbnQodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2JyZWFrcG9pbnQgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEVhc2UodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2Vhc2VUeXBlID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRFYXNlUGVyaW9kKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9lYXNlUGVyaW9kID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRFYXNlT3ZlcnNob290T3JBbXBsaXR1ZGUodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2Vhc2VPdmVyc2hvb3RPckFtcGxpdHVkZSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0UmVwZWF0KHJlcGVhdDogbnVtYmVyLCB5b3lvOiBib29sZWFuID0gZmFsc2UpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9yZXBlYXQgPSB0aGlzLnJlcGVhdDtcclxuXHRcdHRoaXMuX3lveW8gPSB5b3lvO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHJlcGVhdCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3JlcGVhdDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRUaW1lU2NhbGUodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3RpbWVTY2FsZSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0U25hcHBpbmcodmFsdWU6IGJvb2xlYW4pOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9zbmFwcGluZyA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0VGFyZ2V0KHZhbHVlOiBhbnksIHByb3BUeXBlOiBhbnkgPSBudWxsKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdGFyZ2V0ID0gdGhpcy52YWx1ZTtcclxuXHRcdHRoaXMuX3Byb3BUeXBlID0gcHJvcFR5cGU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdGFyZ2V0KCk6IGFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdGFyZ2V0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFVzZXJEYXRhKHZhbHVlOiBhbnkpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl91c2VyRGF0YSA9IHRoaXMudmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdXNlckRhdGEoKTogYW55IHtcclxuXHRcdHJldHVybiB0aGlzLl91c2VyRGF0YTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBvblVwZGF0ZShjYWxsYmFjazogRnVuY3Rpb24sIGNhbGxlcjogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fb25VcGRhdGUgPSBjYWxsYmFjaztcclxuXHRcdHRoaXMuX29uVXBkYXRlQ2FsbGVyID0gY2FsbGVyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgb25TdGFydChjYWxsYmFjazogRnVuY3Rpb24sIGNhbGxlcjogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fb25TdGFydCA9IGNhbGxiYWNrO1xyXG5cdFx0dGhpcy5fb25TdGFydENhbGxlciA9IGNhbGxlcjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uQ29tcGxldGUoY2FsbGJhY2s6IEZ1bmN0aW9uLCBjYWxsZXI6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX29uQ29tcGxldGUgPSBjYWxsYmFjaztcclxuXHRcdHRoaXMuX29uQ29tcGxldGVDYWxsZXIgPSBjYWxsZXI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgc3RhcnRWYWx1ZSgpOiBXVHdlZW5WYWx1ZSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc3RhcnRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZW5kVmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VuZFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB2YWx1ZSgpOiBXVHdlZW5WYWx1ZSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGRlbHRhVmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RlbHRhVmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IG5vcm1hbGl6ZWRUaW1lKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbm9ybWFsaXplZFRpbWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGNvbXBsZXRlZCgpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbmRlZCAhPSAwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBhbGxDb21wbGV0ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZW5kZWQgPT0gMTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRQYXVzZWQocGF1c2VkOiBib29sZWFuKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fcGF1c2VkID0gcGF1c2VkO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICogdGhpcy5zZWVrIHBvc2l0aW9uIG9mIHRoZSB0d2VlbiwgaW4gc2Vjb25kcy5cclxuXHQgICovXHJcblx0cHVibGljIHNlZWsodGltZTogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fa2lsbGVkKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aW1lO1xyXG5cdFx0aWYgKHRoaXMuX2VsYXBzZWRUaW1lIDwgdGhpcy5fZGVsYXkpIHtcclxuXHRcdFx0aWYgKHRoaXMuX3N0YXJ0ZWQpXHJcblx0XHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aGlzLl9kZWxheTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGtpbGwoY29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2tpbGxlZClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmIChjb21wbGV0ZSkge1xyXG5cdFx0XHRpZiAodGhpcy5fZW5kZWQgPT0gMCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLl9icmVha3BvaW50ID49IDApXHJcblx0XHRcdFx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IHRoaXMuX2RlbGF5ICsgdGhpcy5fYnJlYWtwb2ludDtcclxuXHRcdFx0XHRlbHNlIGlmICh0aGlzLl9yZXBlYXQgPj0gMClcclxuXHRcdFx0XHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGhpcy5fZGVsYXkgKyB0aGlzLl9kdXJhdGlvbiAqICh0aGlzLl9yZXBlYXQgKyAxKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IHRoaXMuX2RlbGF5ICsgdGhpcy5fZHVyYXRpb24gKiAyO1xyXG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuY2FsbENvbXBsZXRlQ2FsbGJhY2soKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9raWxsZWQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF90byhzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDE7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnggPSBlbmQ7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvMihzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDI7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnggPSBlbmQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnkgPSBzdGFydDI7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS55ID0gZW5kMjtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG8zKHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBzdGFydDM6IG51bWJlcixcclxuXHRcdGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGVuZDM6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDM7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnggPSBlbmQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnkgPSBzdGFydDI7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS55ID0gZW5kMjtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueiA9IHN0YXJ0MztcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnogPSBlbmQzO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF90bzQoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIHN0YXJ0MzogbnVtYmVyLCBzdGFydDQ6IG51bWJlcixcclxuXHRcdGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGVuZDM6IG51bWJlciwgZW5kNDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdmFsdWVTaXplID0gNDtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueCA9IHN0YXJ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueCA9IGVuZDtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueSA9IHN0YXJ0MjtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnkgPSBlbmQyO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS56ID0gc3RhcnQzO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueiA9IGVuZDM7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLncgPSBzdGFydDQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS53ID0gZW5kNDtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG9Db2xvcihzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLmNvbG9yID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS5jb2xvciA9IGVuZDtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfc2hha2Uoc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBhbXBsaXR1ZGU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDU7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydFg7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnkgPSBzdGFydFk7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLncgPSBhbXBsaXR1ZGU7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0dGhpcy5fZWFzZVR5cGUgPSBXRWFzZVR5cGUuTGluZWFyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2luaXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9kZWxheSA9IDA7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IDA7XHJcblx0XHR0aGlzLl9icmVha3BvaW50ID0gLTE7XHJcblx0XHR0aGlzLl9lYXNlVHlwZSA9IFdFYXNlVHlwZS5RdWFkT3V0O1xyXG5cdFx0dGhpcy5fdGltZVNjYWxlID0gMTtcclxuXHRcdHRoaXMuX2Vhc2VQZXJpb2QgPSAwO1xyXG5cdFx0dGhpcy5fZWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlID0gMS43MDE1ODtcclxuXHRcdHRoaXMuX3NuYXBwaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLl9yZXBlYXQgPSAwO1xyXG5cdFx0dGhpcy5feW95byA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fdmFsdWVTaXplID0gMDtcclxuXHRcdHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fa2lsbGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IDA7XHJcblx0XHR0aGlzLl9ub3JtYWxpemVkVGltZSA9IDA7XHJcblx0XHR0aGlzLl9lbmRlZCA9IDA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3Jlc2V0KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fdGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMuX3VzZXJEYXRhID0gbnVsbDtcclxuXHRcdHRoaXMuX29uU3RhcnQgPSB0aGlzLl9vblVwZGF0ZSA9IHRoaXMuX29uQ29tcGxldGUgPSBudWxsO1xyXG5cdFx0dGhpcy5fb25TdGFydENhbGxlciA9IHRoaXMuX29uVXBkYXRlQ2FsbGVyID0gdGhpcy5fb25Db21wbGV0ZUNhbGxlciA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3VwZGF0ZShkdDogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fdGltZVNjYWxlICE9IDEpXHJcblx0XHRcdGR0ICo9IHRoaXMuX3RpbWVTY2FsZTtcclxuXHRcdGlmIChkdCA9PSAwKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0aWYgKHRoaXMuX2VuZGVkICE9IDApIC8vTWF5YmUgdGhpcy5jb21wbGV0ZWQgYnkgdGhpcy5zZWVrXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuY2FsbENvbXBsZXRlQ2FsbGJhY2soKTtcclxuXHRcdFx0dGhpcy5fa2lsbGVkID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2VsYXBzZWRUaW1lICs9IGR0O1xyXG5cdFx0dGhpcy51cGRhdGUoKTtcclxuXHJcblx0XHRpZiAodGhpcy5fZW5kZWQgIT0gMCkge1xyXG5cdFx0XHRpZiAoIXRoaXMuX2tpbGxlZCkge1xyXG5cdFx0XHRcdHRoaXMuY2FsbENvbXBsZXRlQ2FsbGJhY2soKTtcclxuXHRcdFx0XHR0aGlzLl9raWxsZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlKGR0PzogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZihkdCE9bnVsbCl7XHJcblx0XHRcdGlmICh0aGlzLl90aW1lU2NhbGUgIT0gMSlcclxuXHRcdFx0XHRkdCAqPSB0aGlzLl90aW1lU2NhbGU7XHJcblx0XHRcdGlmIChkdCA9PSAwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdHRoaXMuX2VsYXBzZWRUaW1lICs9IGR0O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2VuZGVkID0gMDtcclxuXHRcdHZhciBfZHVyYXRpb249dGhpcy5fZHVyYXRpb247XHJcblx0XHRpZiAodGhpcy5fdmFsdWVTaXplID09IDApIC8vRGVsYXllZENhbGxcclxuXHRcdHtcclxuXHRcdFx0aWYgKHRoaXMuX2VsYXBzZWRUaW1lID49IHRoaXMuX2RlbGF5ICsgX2R1cmF0aW9uKVxyXG5cdFx0XHRcdHRoaXMuX2VuZGVkID0gMTtcclxuXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuX3N0YXJ0ZWQpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2VsYXBzZWRUaW1lIDwgdGhpcy5fZGVsYXkpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0dGhpcy5fc3RhcnRlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuY2FsbFN0YXJ0Q2FsbGJhY2soKTtcclxuXHRcdFx0aWYgKHRoaXMuX2tpbGxlZClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHJldmVyc2VkOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHR2YXIgdHQ6IG51bWJlciA9IHRoaXMuX2VsYXBzZWRUaW1lIC0gdGhpcy5fZGVsYXk7XHJcblx0XHRpZiAodGhpcy5fYnJlYWtwb2ludCA+PSAwICYmIHR0ID49IHRoaXMuX2JyZWFrcG9pbnQpIHtcclxuXHRcdFx0dHQgPSB0aGlzLl9icmVha3BvaW50O1xyXG5cdFx0XHR0aGlzLl9lbmRlZCA9IDI7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3JlcGVhdCAhPSAwKSB7XHJcblx0XHRcdHZhciByb3VuZDogbnVtYmVyID0gTWF0aC5mbG9vcih0dCAvIF9kdXJhdGlvbik7XHJcblx0XHRcdHR0IC09IF9kdXJhdGlvbiAqIHJvdW5kO1xyXG5cdFx0XHRpZiAodGhpcy5feW95bylcclxuXHRcdFx0XHRyZXZlcnNlZCA9IHJvdW5kICUgMiA9PSAxO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3JlcGVhdCA+IDAgJiYgdGhpcy5fcmVwZWF0IC0gcm91bmQgPCAwKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3lveW8pXHJcblx0XHRcdFx0XHRyZXZlcnNlZCA9IHRoaXMuX3JlcGVhdCAlIDIgPT0gMTtcclxuXHRcdFx0XHR0dCA9IF9kdXJhdGlvbjtcclxuXHRcdFx0XHR0aGlzLl9lbmRlZCA9IDE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHR0ID49IF9kdXJhdGlvbikge1xyXG5cdFx0XHR0dCA9IF9kdXJhdGlvbjtcclxuXHRcdFx0dGhpcy5fZW5kZWQgPSAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX25vcm1hbGl6ZWRUaW1lID0gV0Vhc2VNYW5hZ2VyLmV2YWx1YXRlKHRoaXMuX2Vhc2VUeXBlLCByZXZlcnNlZCA/IChfZHVyYXRpb24gLSB0dCkgOiB0dCwgX2R1cmF0aW9uLFxyXG5cdFx0XHR0aGlzLl9lYXNlT3ZlcnNob290T3JBbXBsaXR1ZGUsIHRoaXMuX2Vhc2VQZXJpb2QpO1xyXG5cclxuXHRcdHRoaXMuX3ZhbHVlLnNldFplcm8oKTtcclxuXHRcdHRoaXMuX2RlbHRhVmFsdWUuc2V0WmVybygpO1xyXG5cclxuXHRcdGlmICh0aGlzLl92YWx1ZVNpemUgPT0gNSkge1xyXG5cdFx0XHRpZiAodGhpcy5fZW5kZWQgPT0gMCkge1xyXG5cdFx0XHRcdHZhciByOiBudW1iZXIgPSB0aGlzLl9zdGFydFZhbHVlLncgKiAoMSAtIHRoaXMuX25vcm1hbGl6ZWRUaW1lKTtcclxuXHRcdFx0XHR2YXIgcng6IG51bWJlciA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogcjtcclxuXHRcdFx0XHR2YXIgcnk6IG51bWJlciA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogcjtcclxuXHRcdFx0XHRyeCA9IHJ4ID4gMCA/IE1hdGguY2VpbChyeCkgOiBNYXRoLmZsb29yKHJ4KTtcclxuXHRcdFx0XHRyeSA9IHJ5ID4gMCA/IE1hdGguY2VpbChyeSkgOiBNYXRoLmZsb29yKHJ5KTtcclxuXHJcblx0XHRcdFx0dGhpcy5fZGVsdGFWYWx1ZS54ID0gcng7XHJcblx0XHRcdFx0dGhpcy5fZGVsdGFWYWx1ZS55ID0gcnk7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUueCA9IHRoaXMuX3N0YXJ0VmFsdWUueCArIHJ4O1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnkgPSB0aGlzLl9zdGFydFZhbHVlLnkgKyByeTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS54ID0gdGhpcy5fc3RhcnRWYWx1ZS54O1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnkgPSB0aGlzLl9zdGFydFZhbHVlLnk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5fdmFsdWVTaXplOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgbjE6IG51bWJlciA9IHRoaXMuX3N0YXJ0VmFsdWUuZ2V0RmllbGQoaSk7XHJcblx0XHRcdFx0dmFyIG4yOiBudW1iZXIgPSB0aGlzLl9lbmRWYWx1ZS5nZXRGaWVsZChpKTtcclxuXHRcdFx0XHR2YXIgZjogbnVtYmVyID0gbjEgKyAobjIgLSBuMSkgKiB0aGlzLl9ub3JtYWxpemVkVGltZTtcclxuXHRcdFx0XHRpZiAodGhpcy5fc25hcHBpbmcpXHJcblx0XHRcdFx0XHRmID0gTWF0aC5yb3VuZChmKTtcclxuXHRcdFx0XHR0aGlzLl9kZWx0YVZhbHVlLnNldEZpZWxkKGksIGYgLSB0aGlzLl92YWx1ZS5nZXRGaWVsZChpKSk7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUuc2V0RmllbGQoaSwgZik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fdGFyZ2V0ICE9IG51bGwgJiYgdGhpcy5fcHJvcFR5cGUgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAodGhpcy5fcHJvcFR5cGUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG5cdFx0XHRcdHN3aXRjaCAodGhpcy5fdmFsdWVTaXplKSB7XHJcblx0XHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDQ6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56LCB0aGlzLl92YWx1ZS53KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDU6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS5jb2xvcik7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA2OlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0aGlzLl9wcm9wVHlwZSBpbnN0YW5jZW9mIExheWEuSGFuZGxlcikge1xyXG5cdFx0XHRcdHZhciBhcnI9W107XHJcblx0XHRcdFx0c3dpdGNoICh0aGlzLl92YWx1ZVNpemUpIHtcclxuXHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLnhdO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnldO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnksIHRoaXMuX3ZhbHVlLnpdO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNDpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnksIHRoaXMuX3ZhbHVlLnosIHRoaXMuX3ZhbHVlLnddO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNTpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLmNvbG9yXTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDY6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuX3Byb3BUeXBlLnJ1bldpdGgoYXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fdmFsdWVTaXplID09IDUpXHJcblx0XHRcdFx0XHR0aGlzLl90YXJnZXRbdGhpcy5fcHJvcFR5cGVdID0gdGhpcy5fdmFsdWUuY29sb3I7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dGhpcy5fdGFyZ2V0W3RoaXMuX3Byb3BUeXBlXSA9IHRoaXMuX3ZhbHVlLng7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmNhbGxVcGRhdGVDYWxsYmFjaygpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjYWxsU3RhcnRDYWxsYmFjaygpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9vblN0YXJ0ICE9IG51bGwpIHtcclxuXHRcdFx0aWYgKFdUd2Vlbi5jYXRjaENhbGxiYWNrRXhjZXB0aW9ucykge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR0aGlzLl9vblN0YXJ0LmNhbGwodGhpcy5fb25TdGFydENhbGxlciwgdGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRmFpcnlHVUk6IGVycm9yIGluIHN0YXJ0IGNhbGxiYWNrID4gXCIgKyBlcnIubWVzc2FnZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLl9vblN0YXJ0LmNhbGwodGhpcy5fb25TdGFydENhbGxlciwgdGhpcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNhbGxVcGRhdGVDYWxsYmFjaygpIHtcclxuXHRcdGlmICh0aGlzLl9vblVwZGF0ZSAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChXVHdlZW4uY2F0Y2hDYWxsYmFja0V4Y2VwdGlvbnMpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dGhpcy5fb25VcGRhdGUuY2FsbCh0aGlzLl9vblVwZGF0ZUNhbGxlciwgdGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRmFpcnlHVUk6IGVycm9yIGluIHRoaXMudXBkYXRlIGNhbGxiYWNrID4gXCIgKyBlcnIubWVzc2FnZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLl9vblVwZGF0ZS5jYWxsKHRoaXMuX29uVXBkYXRlQ2FsbGVyLCB0aGlzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY2FsbENvbXBsZXRlQ2FsbGJhY2soKSB7XHJcblx0XHRpZiAodGhpcy5fb25Db21wbGV0ZSAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChXVHdlZW4uY2F0Y2hDYWxsYmFja0V4Y2VwdGlvbnMpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dGhpcy5fb25Db21wbGV0ZS5jYWxsKHRoaXMuX29uQ29tcGxldGVDYWxsZXIsIHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkZhaXJ5R1VJOiBlcnJvciBpbiBjb21wbGV0ZSBjYWxsYmFjayA+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhpcy5fb25Db21wbGV0ZS5jYWxsKHRoaXMuX29uQ29tcGxldGVDYWxsZXIsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlNYXRDb25maWcge1xuXHJcbiAgICBwdWJsaWMgc3RhdGljIG1hdENvbmZpZz1bXG57XG5cImNfbWF0TmFtZVwiOlwiZGFvXzFcIixcImluaXREYXRhXCI6e1xuXCJzaGFkZXJOYW1lXCI6XCJ3bXlMYXlhX3dteUxidFwiLFwiX0FsYmVkb0ludGVuc2l0eVwiOlwiMVwiLFwiX0FscGhhQmxlbmRcIjpcIjBcIixcIl9BbHBoYVRlc3RcIjpcIjBcIixcIl9DdWxsXCI6XCIyXCIsXCJfQ3V0b2ZmXCI6XCIwLjAxXCIsXCJfRHN0QmxlbmRcIjpcIjBcIixcIl9HbG9zc1wiOlwiMzBcIixcIl9Jc1ZlcnRleENvbG9yXCI6XCIwXCIsXCJfTGlnaHRpbmdcIjpcIjBcIixcIl9Nb2RlXCI6XCIwXCIsXCJfUmVuZGVyUXVldWVcIjpcIjIwMDBcIixcIl9TaGluaW5lc3NcIjpcIjAuMDc4MTI1XCIsXCJfU3BlY3VsYXJTb3VyY2VcIjpcIjBcIixcIl9TcmNCbGVuZFwiOlwiMVwiLFwiX1pUZXN0XCI6XCI0XCIsXCJfWldyaXRlXCI6XCIxXCIsXCJfQ29sb3JcIjpcIjEsMSwxLDFcIixcIl9TcGVjQ29sb3JcIjpcIjAuNSwwLjUsMC41LDFcIixcIl9TcGVjdWxhclwiOlwiMC4yNjQ3MDU5LDAuMjY0NzA1OSwwLjI2NDcwNTksMVwiLFwiX3dDb2xvclwiOlwiMSwwLjc2ODM4MjI1LDAuNjY5MTE3NywxXCJ9LFwidGFyZ2V0VXJsQXJyXCI6W1xue1xuXCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzUwX0MyVV9kYW9fMVwiLFwibWF0SWRcIjowfVxuXX1cbl07XHJcbn1cclxuIiwiLyp3bXnniYjmnKxfMjAxOC8xLzMvMTkuMzEqL1xyXG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcclxuaW1wb3J0IFdteU1hdENvbmZpZyBmcm9tICcuL1dteU1hdENvbmZpZyc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteU1hdE1hZyBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuICAgIHB1YmxpYyBvbkF3YWtlKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgV215TWF0Q29uZmlnLm1hdENvbmZpZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbWF0T2JqID0gV215TWF0Q29uZmlnLm1hdENvbmZpZ1tpXTtcclxuICAgICAgICAgICAgdGhpcy5hZGRNYXQobWF0T2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZGRNYXQobWF0T2JqKXtcclxuICAgICAgICBpZihtYXRPYmo9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBjX21hdE5hbWU9bWF0T2JqWydjX21hdE5hbWUnXTtcclxuICAgICAgICB2YXIgaW5pdERhdGE9bWF0T2JqWydpbml0RGF0YSddO1xyXG4gICAgICAgIHZhciB0YXJnZXRVcmxBcnI9bWF0T2JqWyd0YXJnZXRVcmxBcnInXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRhcmdldFVybEFyci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgdXJsPXRhcmdldFVybEFycltqXVsndXJsJ107XHJcbiAgICAgICAgICAgIHZhciBtYXRJZD10YXJnZXRVcmxBcnJbal1bJ21hdElkJ107XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQzRD1XbXlNYXRNYWcuZ2V0T2JqM2RVcmwodGhpcy5zY2VuZTNELHVybCk7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldDNEIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TWF0ZXJpYWwodGFyZ2V0M0QsaW5pdERhdGEsbWF0SWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNYXRlcmlhbCh0YXJnZXQsaW5pdERhdGEsbWF0SWQ9MCxzaGFkZXJOYW1lPyxpc05ld01hdGVyaWE/KXtcclxuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXQpO1xyXG4gICAgICAgIGlmKHRhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihzaGFkZXJOYW1lPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBzaGFkZXJOYW1lPWluaXREYXRhLnNoYWRlck5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNoYWRlck5hbWU9PXVuZGVmaW5lZClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgc2hhZGVyPUxheWEuU2hhZGVyM0QuZmluZChzaGFkZXJOYW1lKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzaGFkZXIpO1xyXG4gICAgICAgIGlmKHNoYWRlcj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIHJlbmRlcmVyO1xyXG4gICAgICAgIHZhciBzaGFyZWRNYXRlcmlhbDpMYXlhLkJhc2VNYXRlcmlhbDtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICByZW5kZXJlcj0odGFyZ2V0KS5za2lubmVkTWVzaFJlbmRlcmVyO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJlcj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9cmVuZGVyZXIubWF0ZXJpYWxzW21hdElkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgcmVuZGVyZXI9KHRhcmdldCkubWVzaFJlbmRlcmVyO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJlcj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9cmVuZGVyZXIubWF0ZXJpYWxzW21hdElkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHNoYXJlZE1hdGVyaWFsPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ+ayoeaciXNoYXJlZE1hdGVyaWFsOicsdGFyZ2V0LHNoYWRlck5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaXNOZXdNYXRlcmlhKXtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9c2hhcmVkTWF0ZXJpYWwuY2xvbmUoKTtcclxuICAgICAgICAgICAgcmVuZGVyZXIubWF0ZXJpYWxzW21hdElkXT1zaGFyZWRNYXRlcmlhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlcj1zaGFkZXI7XHJcbiAgICAgICAgLy/muLLmn5PmqKHlvI9cclxuICAgICAgICB2YXIgdnNQc0Fycj1zaGFkZXJbJ3dfdnNQc0FyciddO1xyXG4gICAgICAgIGlmKHZzUHNBcnIpe1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZzUHNBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJEYXRhT2JqID0gdnNQc0FycltpXVsyXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZW5kZXJEYXRhT2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlckRhdGFPYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzaGFyZWRNYXRlcmlhbC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsW2tleV09cmVuZGVyRGF0YU9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZW5kZXJTdGF0ZT1zaGFyZWRNYXRlcmlhbC5nZXRSZW5kZXJTdGF0ZShpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVuZGVyU3RhdGUuaGFzT3duUHJvcGVydHkoa2V5KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJTdGF0ZVtrZXldPXJlbmRlckRhdGFPYmpba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL+WIneWni+WAvFxyXG4gICAgICAgIGlmIChzaGFkZXJbJ3dfdW5pZm9ybU1hcCddICE9IG51bGwpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNoYWRlclsnd191bmlmb3JtTWFwJ10pIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaGFkZXJbJ3dfdW5pZm9ybU1hcCddLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5pdElkPXNoYWRlclsnd191bmlmb3JtTWFwJ11ba2V5XVswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5pdFY9aW5pdERhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpbml0ViE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRWID0gaW5pdFYuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaW5pdFYubGVuZ3RoPT00KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IoaW5pdElkLG5ldyBMYXlhLlZlY3RvcjQocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkscGFyc2VGbG9hdChpbml0VlsyXSkscGFyc2VGbG9hdChpbml0VlszXSkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09Myl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKGluaXRJZCxuZXcgTGF5YS5WZWN0b3IzKHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pLHBhcnNlRmxvYXQoaW5pdFZbMl0pKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcihpbml0SWQsbmV3IExheWEuVmVjdG9yMihwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0xKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc05hTihwYXJzZUZsb2F0KGluaXRWWzBdKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0TnVtYmVyKGluaXRJZCxwYXJzZUZsb2F0KGluaXRWWzBdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJPYmo9aW5pdFZbMF0rJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3RyT2JqPT0ndGV4Jyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXhPYmo9aW5pdERhdGFbJ1RFWEAnK2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRleE9iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aD10ZXhPYmpbJ3BhdGgnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExheWEubG9hZGVyLmxvYWQocGF0aCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKF9pbml0SWQsdGV4KT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRleD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleD1uZXcgTGF5YS5UZXh0dXJlMkQoMCwwLDAsdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VGV4dHVyZShfaW5pdElkLHRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFtpbml0SWRdKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBTcHJpdGUzRF9TaGFkZXJWYWx1ZXModGFyZ2V0LHZhbHVlTmFtZSx2YWx1ZSxtYXRzSWQpe1xyXG4gICAgICAgIHZhciB0T2JqQXJyPVdteU1hdE1hZy5nZXRDaGlsZHJlbkNvbXBvbmVudCh0YXJnZXQsTGF5YS5SZW5kZXJhYmxlU3ByaXRlM0QpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdE9iakFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgclAzZCA9IHRPYmpBcnJbaV07XHJcbiAgICAgICAgICAgIFdteU1hdE1hZy5SZW5kZXJhYmxlU3ByaXRlM0RfU2hhZGVyVmFsdWVzKHJQM2QsdmFsdWVOYW1lLHZhbHVlLG1hdHNJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtXHR0YXJnZXRcdOWvueixoVxyXG4gICAgICogQHBhcmFtXHR2YWx1ZU5hbWUg5YC855qE5ZCN5a2XXHJcbiAgICAgKiBAcGFyYW1cdHZhbHVlXHTlgLxcclxuICAgICAqIEBwYXJhbVx0bWF0c0lkXHTmnZDotKjnkINJRFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJlbmRlcmFibGVTcHJpdGUzRF9TaGFkZXJWYWx1ZXModGFyZ2V0LHZhbHVlTmFtZSx2YWx1ZSxtYXRzSWQpIHtcclxuICAgICAgICBpZihtYXRzSWQ9PW51bGwpbWF0c0lkPS0xO1xyXG4gICAgICAgIHZhciByZW5kZXJlcj10YXJnZXRbJ21lc2hSZW5kZXJlciddO1xyXG4gICAgICAgIGlmKHJlbmRlcmVyPT1udWxsKXtcclxuICAgICAgICAgICAgcmVuZGVyZXI9dGFyZ2V0Wydza2lubmVkTWVzaFJlbmRlcmVyJ107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFyZW5kZXJlcilyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIG1zPXJlbmRlcmVyLnNoYXJlZE1hdGVyaWFscztcclxuICAgICAgICBpZihtcy5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBpc01hdHNJZD1tYXRzSWQ8MD9mYWxzZTp0cnVlO1xyXG5cclxuICAgICAgICB2YXIgaXNPSz10cnVlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG0gPSBtc1tpXTtcclxuICAgICAgICAgICAgdmFyIHVuaWZvcm1NYXA9IG0uX3NoYWRlci5fdW5pZm9ybU1hcFt2YWx1ZU5hbWVdO1xyXG4gICAgICAgICAgICBpZighdW5pZm9ybU1hcCljb250aW51ZTtcclxuICAgICAgICAgICAgaWYoaXNNYXRzSWQpe1xyXG4gICAgICAgICAgICAgICAgaWYobWF0c0lkIT1pKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVJZD11bmlmb3JtTWFwWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYodmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuKXtcclxuICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0Qm9vbCh2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoIWlzTmFOKHZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHY9dmFsdWUrJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodi5pbmRleE9mKCcuJyk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRJbnQodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXROdW1iZXIodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih2YWx1ZSBpbnN0YW5jZW9mIExheWEuQmFzZVZlY3Rvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcih2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsdWUgaW5zdGFuY2VvZiBMYXlhLlF1YXRlcm5pb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRRdWF0ZXJuaW9uKHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih2YWx1ZSBpbnN0YW5jZW9mIExheWEuTWF0cml4NHg0KXtcclxuICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0TWF0cml4NHg0KHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih2YWx1ZSBpbnN0YW5jZW9mIExheWEuVGV4dHVyZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldFRleHR1cmUodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGlzT0s9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBpc09LPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpc09LO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25JbnN0YW5jZU5hbWUobmFtZSkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZT1udWxsO1xyXG5cdFx0dHJ5IHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKHdpbmRvd1tuYW1lXS5wcm90b3R5cGUpO1xyXG5cdFx0XHRpbnN0YW5jZS5jb25zdHJ1Y3Rvci5hcHBseShpbnN0YW5jZSwgYXJncyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmplY3RDbGFzcyhvYmopIHtcclxuICAgICAgICBpZiAob2JqICYmIG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgLypcclxuICAgICAgICAgICAqIGZvciBicm93c2VycyB3aGljaCBoYXZlIG5hbWUgcHJvcGVydHkgaW4gdGhlIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgKiBvZiB0aGUgb2JqZWN0LHN1Y2ggYXMgY2hyb21lIFxyXG4gICAgICAgICAgICovXHJcbiAgICAgICAgICBpZihvYmouY29uc3RydWN0b3IubmFtZSkge1xyXG4gICAgICAgICAgIHJldHVybiBvYmouY29uc3RydWN0b3IubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBzdHIgPSBvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKTtcclxuICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgKiBleGVjdXRlZCBpZiB0aGUgcmV0dXJuIG9mIG9iamVjdC5jb25zdHJ1Y3Rvci50b1N0cmluZygpIGlzIFxyXG4gICAgICAgICAgICogJ1tvYmplY3Qgb2JqZWN0Q2xhc3NdJ1xyXG4gICAgICAgICAgICovXHJcbiAgICAgICAgICBpZihzdHIuY2hhckF0KDApID09ICdbJylcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGFyciA9IHN0ci5tYXRjaCgvXFxbXFx3K1xccyooXFx3KylcXF0vKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGV4ZWN1dGVkIGlmIHRoZSByZXR1cm4gb2Ygb2JqZWN0LmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkgaXMgXHJcbiAgICAgICAgICAgICAqICdmdW5jdGlvbiBvYmplY3RDbGFzcyAoKSB7fSdcclxuICAgICAgICAgICAgICogZm9yIElFIEZpcmVmb3hcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBhcnIgPSBzdHIubWF0Y2goL2Z1bmN0aW9uXFxzKihcXHcrKS8pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGFyciAmJiBhcnIubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgIHJldHVybiBhcnJbMV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDsgXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LGNsYXM/LGFycj8pIHtcclxuICAgICAgICBpZihhcnI9PW51bGwpYXJyPVtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb2JqPXRhcmdldC5nZXRDb21wb25lbnQoY2xhcyk7XHJcbiAgICAgICAgaWYob2JqPT1udWxsKXtcclxuICAgICAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgY2xhcyl7XHJcbiAgICAgICAgICAgICAgICBvYmo9dGFyZ2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9iaiE9bnVsbCAmJiBhcnIuaW5kZXhPZihvYmopPDApe1xyXG4gICAgICAgICAgICBhcnIucHVzaChvYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQuX2NoaWxkcmVuPT1udWxsKSByZXR1cm4gYXJyO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG8gPSB0YXJnZXQuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmdldENoaWxkcmVuQ29tcG9uZW50KG8sY2xhcyxhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBhcnJVcmw9dXJsLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldE9iakFyclVybCh0YXJnZXQsYXJyVXJsKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBfZ2V0T2JqQXJyVXJsKHRhcmdldCx1cmxBcnI6QXJyYXk8c3RyaW5nPixpZD0wKXtcclxuICAgICAgICB2YXIgX3RhcmdldDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZihfdGFyZ2V0PT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBuYT11cmxBcnJbaWRdO1xyXG4gICAgICAgIHZhciB0YXJnZXRPYmo9X3RhcmdldC5nZXRDaGlsZEJ5TmFtZShuYSk7XHJcbiAgICAgICAgaWYodGFyZ2V0T2JqPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKGlkPj11cmxBcnIubGVuZ3RoLTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0YXJnZXRPYmo9dGhpcy5fZ2V0T2JqQXJyVXJsKHRhcmdldE9iaix1cmxBcnIsKytpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgICB9XHJcbn1cclxuIiwiLyp3bXnniYjmnKxfMjAxOC8xMi8zMC8qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlVM2RJbXBvcnQge1xucHVibGljIHN0YXRpYyBUc19ETGlnaHQ9cmVxdWlyZSgnLi90cy9Uc19ETGlnaHQnKVsnZGVmYXVsdCddO1xucHVibGljIHN0YXRpYyBUc19TY2VuZT1yZXF1aXJlKCcuL3RzL1RzX1NjZW5lJylbJ2RlZmF1bHQnXTtcbnB1YmxpYyBzdGF0aWMgVHNfQzREVmV0ZXhBbmltYXRvcj1yZXF1aXJlKCcuL3RzL1RzX0M0RFZldGV4QW5pbWF0b3InKVsnZGVmYXVsdCddO1xucHVibGljIHN0YXRpYyBUc19NYXRzPXJlcXVpcmUoJy4vdHMvVHNfTWF0cycpWydkZWZhdWx0J107XHJcbi8v5omp5bGVXHJcbnB1YmxpYyBzdGF0aWMgV215QzREVmV0ZXhBbmltYXRvcj1yZXF1aXJlKCcuLi9fd215VXRpbHNINS9kMy9jNGQvV215QzREVmV0ZXhBbmltYXRvcicpWydkZWZhdWx0J107XHJcbnB1YmxpYyBzdGF0aWMgV215UGh5c2ljc19DaGFyYWN0ZXI9cmVxdWlyZSgnLi4vX3dteVV0aWxzSDUvZDMvcGh5c2ljcy9XbXlQaHlzaWNzV29ybGRfQ2hhcmFjdGVyJylbJ2RlZmF1bHQnXTtcclxuLy9MYXlhXHJcbnB1YmxpYyBzdGF0aWMgQW5pbWF0b3I9TGF5YS5BbmltYXRvcjtcclxuLy9cclxucHVibGljIHN0YXRpYyBnZXRDbGFzcyhuYW1lKXtcclxuICAgIHJldHVybiB0aGlzW25hbWVdO1xyXG59XHJcbn1cclxuIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteVUzZFRzQ29uZmlnIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgdHNDb25maWc9W1xue1wiY190c1wiOlwiVHNfTWF0c1wiLFxuXCJ0YXJnZXRVcmxBcnJcIjpbXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzVfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzFfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDZfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjhfQzJVX1xcdTVFNzNcXHU5NzYyMV84L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMF9DMlVfXFx1NUU3M1xcdTk3NjIxXzEwL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMF9DMlVfXFx1NUU3M1xcdTk3NjIxL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zM19DMlVfXFx1NUU3M1xcdTk3NjIxXzEzL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNl9DMlVfXFx1NUU3M1xcdTk3NjIxXzYvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMyX0MyVV9cXHU1RTczXFx1OTc2MjFfMTIvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIzX0MyVV9cXHU1RTczXFx1OTc2MjFfMy93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjlfQzJVX1xcdTVFNzNcXHU5NzYyMV85L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai80OV9DMlVfXFx1NUM5QjEvMjIwX0MyVV9cXHU1QzcxLzIyMl9DMlVfc2hhbl8xXCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI0X0MyVV9cXHU1RTczXFx1OTc2MjFfNC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDJfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjdfQzJVX1xcdTVFNzNcXHU5NzYyMV83L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80N19DMlVfXFx1NUU3M1xcdTk3NjIxXzI3L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80NF9DMlVfXFx1NUU3M1xcdTk3NjIxXzI0L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zOF9DMlVfXFx1NUU3M1xcdTk3NjIxXzE4L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNV9DMlVfXFx1NUU3M1xcdTk3NjIxXzUvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM2X0MyVV9cXHU1RTczXFx1OTc2MjFfMTYvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIyX0MyVV9cXHU1RTczXFx1OTc2MjFfMi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzIyMF9DMlVfXFx1NUM3MS8yMjNfQzJVX3NoYW5fM1wiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80MF9DMlVfXFx1NUU3M1xcdTk3NjIxXzIwL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zN19DMlVfXFx1NUU3M1xcdTk3NjIxXzE3L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80OF9DMlVfXFx1NUU3M1xcdTk3NjIxXzI4L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMV9DMlVfXFx1NUU3M1xcdTk3NjIxXzEvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS8yMjBfQzJVX1xcdTVDNzEvMjI0X0MyVV9zaGFuXzRcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzIyMF9DMlVfXFx1NUM3MS8yMjFfQzJVX3NoYW5fMl8xXCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ1X0MyVV9cXHU1RTczXFx1OTc2MjFfMjUvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS81MF9DMlVfZGFvXzFcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIkZhbHNlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiVHJ1ZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzRfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzlfQzJVX1xcdTVFNzNcXHU5NzYyMV8xOS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDFfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDNfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMy93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX1cbl19LFxue1wiY190c1wiOlwiVHNfQzREVmV0ZXhBbmltYXRvclwiLFxuXCJ0YXJnZXRVcmxBcnJcIjpbXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjVfQzJVX1xcdTVFNzNcXHU5NzYyMV81L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDJfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQwX0MyVV9cXHU1RTczXFx1OTc2MjFfMjAvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMl9DMlVfXFx1NUU3M1xcdTk3NjIxXzIvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zN19DMlVfXFx1NUU3M1xcdTk3NjIxXzE3L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjNfQzJVX1xcdTVFNzNcXHU5NzYyMV8zL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjZfQzJVX1xcdTVFNzNcXHU5NzYyMV82L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDFfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIwX0MyVV9cXHU1RTczXFx1OTc2MjEvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMV9DMlVfXFx1NUU3M1xcdTk3NjIxXzEvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yOV9DMlVfXFx1NUU3M1xcdTk3NjIxXzkvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80NV9DMlVfXFx1NUU3M1xcdTk3NjIxXzI1L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzFfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI3X0MyVV9cXHU1RTczXFx1OTc2MjFfNy93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ0X0MyVV9cXHU1RTczXFx1OTc2MjFfMjQvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80M19DMlVfXFx1NUU3M1xcdTk3NjIxXzIzL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzBfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM1X0MyVV9cXHU1RTczXFx1OTc2MjFfMTUvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNF9DMlVfXFx1NUU3M1xcdTk3NjIxXzQvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zM19DMlVfXFx1NUU3M1xcdTk3NjIxXzEzL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzhfQzJVX1xcdTVFNzNcXHU5NzYyMV8xOC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI4X0MyVV9cXHU1RTczXFx1OTc2MjFfOC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM5X0MyVV9cXHU1RTczXFx1OTc2MjFfMTkvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80N19DMlVfXFx1NUU3M1xcdTk3NjIxXzI3L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzRfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM2X0MyVV9cXHU1RTczXFx1OTc2MjFfMTYvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMl9DMlVfXFx1NUU3M1xcdTk3NjIxXzEyL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDZfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ4X0MyVV9cXHU1RTczXFx1OTc2MjFfMjgvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fVxuXX0sXG57XCJjX3RzXCI6XCJUc19TY2VuZVwiLFxuXCJ0YXJnZXRVcmxBcnJcIjpbXG57XCJ1cmxcIjpcInNjZW5lXCIsXG5cImluaXREYXRhXCI6e319XG5dfSxcbntcImNfdHNcIjpcIlRzX0RMaWdodFwiLFxuXCJ0YXJnZXRVcmxBcnJcIjpbXG57XCJ1cmxcIjpcIkRpcmVjdGlvbmFsIGxpZ2h0XCIsXG5cImluaXREYXRhXCI6e1wiY2FtZXJhVXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvNF9DMlVfXFx1OEY2OFxcdThGRjlcXHU1MkE4XFx1NzUzQi81X0MyVV9zaGV4aWFuZ2ppLzZfQzJVX1xcdTY0NDRcXHU1MENGXFx1NjczQVwiLFxuXCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIn19XG5dfVxuXTtcclxufVxyXG4iLCIvKndteeeJiOacrF8yMDE4LzEyLzI4LzEzOjE5Ki9cclxuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XHJcbmltcG9ydCBXbXlVM2RUc0NvbmZpZyBmcm9tICcuL1dteVUzZFRzQ29uZmlnJztcclxuaW1wb3J0IFdteVUzZEltcG9ydCBmcm9tICcuL1dteVUzZEltcG9ydCc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteVUzZFRzTWFnIGV4dGVuZHMgV215U2NyaXB0M0Qge1xyXG4gICAgcHVibGljIG9uQXdha2UoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBXbXlVM2RUc0NvbmZpZy50c0NvbmZpZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB0c09iaiA9IFdteVUzZFRzQ29uZmlnLnRzQ29uZmlnW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFRzKHRzT2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZGRUcyhjb25maWdPYmope1xyXG4gICAgICAgIGlmKGNvbmZpZ09iaj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIGNfdHM9Y29uZmlnT2JqWydjX3RzJ107XHJcbiAgICAgICAgdmFyIHRzPVdteVUzZEltcG9ydC5nZXRDbGFzcyhjX3RzKTtcclxuICAgICAgICB2YXIgdGFyZ2V0VXJsQXJyOnN0cmluZz1jb25maWdPYmpbJ3RhcmdldFVybEFyciddO1xyXG4gICAgICAgIGlmKCF0YXJnZXRVcmxBcnIgfHwgIXRzKXJldHVybjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcmdldFVybEFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRVcmxEYXRhID0gdGFyZ2V0VXJsQXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgdXJsPXRhcmdldFVybERhdGFbJ3VybCddO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0PVdteVUzZFRzTWFnLmdldE9iajNkVXJsKHRoaXMuc2NlbmUzRCx1cmwpO1xyXG4gICAgICAgICAgICBpZih0YXJnZXQhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1RzPXRhcmdldC5hZGRDb21wb25lbnQodHMpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGluaXREYXRhPXRhcmdldFVybERhdGFbJ2luaXREYXRhJ107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gaW5pdERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgVmFsdWU6YW55PWluaXREYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc05hTihWYWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoVmFsdWUuaW5kZXhPZignLicpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWYWx1ZT1wYXJzZUZsb2F0KFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWU9cGFyc2VJbnQoVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihWYWx1ZS5pbmRleE9mKCdUcnVlJyk+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlPXRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKFZhbHVlLmluZGV4T2YoJ0ZhbHNlJyk+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1RzW2tleV0gPSBWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkVXJsKHRhcmdldCx1cmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgYXJyVXJsPXVybC5zcGxpdCgnLycpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0LGFyclVybCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgX2dldE9iakFyclVybCh0YXJnZXQsdXJsQXJyOkFycmF5PHN0cmluZz4saWQ9MCl7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYoX3RhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgbmE9dXJsQXJyW2lkXTtcclxuICAgICAgICB2YXIgdGFyZ2V0T2JqPV90YXJnZXQuZ2V0Q2hpbGRCeU5hbWUobmEpO1xyXG4gICAgICAgIGlmKHRhcmdldE9iaj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihpZD49dXJsQXJyLmxlbmd0aC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGFyZ2V0T2JqPXRoaXMuX2dldE9iakFyclVybCh0YXJnZXRPYmosdXJsQXJyLCsraWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qQzRE6aG254K55Yqo55S7Ki9cbi8qd21554mI5pysXzIwMTgvMTIvMjgqL1xuaW1wb3J0IFdteVUzZEltcG9ydCBmcm9tICcuLi9XbXlVM2RJbXBvcnQnO1xuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi8uLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUc19DNERWZXRleEFuaW1hdG9yIGV4dGVuZHMgV215U2NyaXB0M0Qge1xuXG4gX2M0ZFZldGV4QW5pbWF0b3I6YW55O1xuIF9pbml0UGxheTphbnk9IGZhbHNlO1xuIF9hbmlyOmFueTtcbnB1YmxpYyBvbkF3YWtlKCkge1xuIC8vc2V0U2hvdyhmYWxzZSk7XG4gdGhpcy5fYzRkVmV0ZXhBbmltYXRvciA9IHRoaXMub3duZXIzRC5nZXRDb21wb25lbnQoV215VTNkSW1wb3J0LmdldENsYXNzKCdXbXlDNERWZXRleEFuaW1hdG9yJykpO1xuIGlmICh0aGlzLl9jNGRWZXRleEFuaW1hdG9yID09IG51bGwpIHtcbiB0aGlzLl9jNGRWZXRleEFuaW1hdG9yID0gdGhpcy5vd25lcjNELmFkZENvbXBvbmVudChXbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoJ1dteUM0RFZldGV4QW5pbWF0b3InKSk7XG4gfVxuIHRoaXMuX2FuaXIgPSB0aGlzLm93bmVyM0QuZ2V0Q29tcG9uZW50KFdteVUzZEltcG9ydC5nZXRDbGFzcygnQW5pbWF0b3InKSk7XG4gaWYgKHRoaXMuX2FuaXIgIT0gbnVsbCkge1xuIHRoaXMuX2luaXRQbGF5ID0gZmFsc2U7XG4gdGhpcy5fYW5pci5zcGVlZCA9IDA7XG4gdGhpcy5zZXRTaG93KGZhbHNlKTtcbiB9XG4gXG4gfVxucHVibGljIG9uUHJlUmVuZGVyKCkge1xuIGlmICghdGhpcy5faW5pdFBsYXkpIHtcbiB2YXIgcGFyZW50OmFueT0gdGhpcy5vd25lcjNELnBhcmVudDtcbiBpZiAocGFyZW50LnRyYW5zZm9ybS5sb2NhbFNjYWxlLnggPiAwLjAxIHx8IHBhcmVudC50cmFuc2Zvcm0ubG9jYWxTY2FsZS55ID4gMC4wMSB8fCBwYXJlbnQudHJhbnNmb3JtLmxvY2FsU2NhbGUueiA+IDAuMDEpIHtcbiB0aGlzLl9pbml0UGxheSA9IHRydWU7XG4gdGhpcy5zZXRTaG93KHRydWUpO1xuIHRoaXMuX2FuaXIuc3BlZWQgPSAxO1xuIH1cbiB9XG4gXG4gfVxufVxuIiwiLyrnm7Tnur/nga/lhYkqL1xuLyp3bXnniYjmnKxfMjAxOC8xMi8yOCovXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4uL1dteVUzZEltcG9ydCc7XG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uLy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRzX0RMaWdodCBleHRlbmRzIFdteVNjcmlwdDNEIHtcblxuICAgIFxuICAgIHB1YmxpYyBjYW1lcmFVcmwgPSBcIlwiO1xuICAgIC8q5piv5ZCm5Lqn55Sf6Zi05b2xKi9cbiAgICBwdWJsaWMgaXNDYXN0U2hhZG93OiBhbnkgPSBmYWxzZTtcblxuICAgIHB1YmxpYyBjYW1lcmE6TGF5YS5DYW1lcmE7XG4gICAgcHVibGljIGRpcmVjdGlvbkxpZ2h0OkxheWEuRGlyZWN0aW9uTGlnaHQ7XG4gICAgcHVibGljIG9uU3RhcnQoKSB7XG4gICAgICAgIHRoaXMuY2FtZXJhPXRoaXMuZ2V0T2JqM2RVcmwodGhpcy5zY2VuZTNELHRoaXMuY2FtZXJhVXJsKTtcblxuICAgICAgICB0aGlzLmRpcmVjdGlvbkxpZ2h0PXRoaXMub3duZXIgYXMgTGF5YS5EaXJlY3Rpb25MaWdodDtcbiAgICAgICAgLy/nga/lhYnlvIDlkK/pmLTlvbFcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25MaWdodC5zaGFkb3cgPSB0aGlzLmlzQ2FzdFNoYWRvdztcbiAgICAgICAgLy/nlJ/miJDpmLTlvbHotLTlm77lsLrlr7hcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25MaWdodC5zaGFkb3dSZXNvbHV0aW9uID0gMTQwMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25VcGRhdGUoKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8v5Y+v6KeB6Zi05b2x6Led56a7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbkxpZ2h0LnNoYWRvd0Rpc3RhbmNlID0gdGhpcy5jYW1lcmEudHJhbnNmb3JtLnBvc2l0aW9uLnk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiLyrmnZDotKjmlYjmnpwqL1xuLyp3bXnniYjmnKxfMjAxOC8xMi8yOCovXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4uL1dteVUzZEltcG9ydCc7XG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uLy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRzX01hdHMgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XG5cbiAvKuaYr+WQpuS6p+eUn+mYtOW9sSovXG4gcHVibGljIGlzQ2FzdFNoYWRvdzphbnk9IGZhbHNlO1xuIC8q5piv5ZCm5o6l5pS26Zi05b2xKi9cbiBwdWJsaWMgaXNSZWNlaXZlU2hhZG93OmFueT0gZmFsc2U7XG5wdWJsaWMgb25TdGFydCgpIHtcbiAvKuiuvue9rumYtOW9sSovXG4gdGhpcy5vblNldFNoYWRvdyh0aGlzLmlzQ2FzdFNoYWRvdywgdGhpcy5pc1JlY2VpdmVTaGFkb3cpO1xuIFxuIH1cbiB9XG4iLCIvKuWcuuaZryovXG4vKndteeeJiOacrF8yMDE4LzEyLzI5Ki9cbmltcG9ydCBXbXlVM2RJbXBvcnQgZnJvbSAnLi4vV215VTNkSW1wb3J0JztcbmltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSAnLi4vLi4vX3dteVV0aWxzSDUvZDMvV215U2NyaXB0M0QnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHNfU2NlbmUgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XG5cbiBfYW5pcjphbnk7XG5wdWJsaWMgb25TdGFydCgpIHtcbiB0aGlzLl9hbmlyID0gdGhpcy5vd25lcjNELmdldENvbXBvbmVudChXbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoJ0FuaW1hdG9yJykpO1xuIGlmICh0aGlzLl9hbmlyICE9IG51bGwpIHtcbiB0aGlzLl9hbmlyLnNwZWVkID0gMTtcbiB9XG4gXG4gfVxuIH1cbiJdfQ==
