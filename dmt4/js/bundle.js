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
                "shaderName": "WmyLaya_wmyLbt", "_AlbedoIntensity": "1", "_AlphaBlend": "0", "_AlphaTest": "0", "_Cull": "2", "_Cutoff": "0.01", "_DstBlend": "0", "_Gloss": "30", "_IsVertexColor": "0", "_Lighting": "0", "_Mode": "0", "_RenderQueue": "2000", "_Shininess": "0.078125", "_SpecularSource": "0", "_SrcBlend": "1", "_ZTest": "4", "_ZWrite": "1", "_Color": "1,1,1,1", "_SpecColor": "0.5,0.5,0.5,1", "_Specular": "0.2647059,0.2647059,0.2647059,1", "_wColor": "1,0.76838225,0.6691177,1"
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
        console.log(target);
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
            vs = this.onSetVs(vs);
            ps = this.onSetPs(ps);
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
        vspsArr[0][0] = "\nuniform vec4 _wColor;\nuniform mat4 _Object2World;\nuniform vec4 _Specular;\nuniform float _Gloss;\n\nvarying vec3 g_worldNormal;\nvarying vec3 g_worldViewDir;\n\nvoid wmyMain(){\n\n    g_worldNormal = v_Normal;\n    g_worldNormal.x*=-1.0;\n\tg_worldViewDir = v_ViewDir;\n\n}\n";
        //ps
        vspsArr[0][1] = "\nuniform vec4 _wColor;\nuniform mat4 _Object2World;\nuniform vec4 _Specular;\nuniform float _Gloss;\n\nvarying vec3 g_worldNormal;\nvarying vec3 g_worldViewDir;\n\nvec4 wmyMain(vec4 _mainColor, vec3 _globalDiffuse, vec3 _diffuse, float shadowValue){\n    vec4 wmyColor=_mainColor;\n\n\tvec3 ambient =u_AmbientColor/2.0;\n\tvec3 lightDir = normalize(-u_DirectionLight.Direction.xyz);\n\tfloat halfLambert = dot(g_worldNormal, lightDir) * 0.5 + 1.0;\n\tvec3 diffuse = u_DirectionLight.Color.rgb * halfLambert *_wColor.rgb;\n\t\t\t\t\n\tvec3 color = diffuse;\n\n\tvec3 viewDir = normalize(g_worldViewDir);\n\tvec3 halfDir = normalize(viewDir + lightDir);\n\tvec3 specular = vec3(0.0);\n\tspecular = _Specular.rgb * pow(max(dot(g_worldNormal, halfDir), 0.0), _Gloss);\n\tcolor += specular;\n\n    color *= 1.5;\n    color+=shadowValue*0.1;\n\twmyColor = vec4(color, 1.0);\n\n//\nreturn wmyColor;\n}\n";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpcklERV9iZXRhNS9yZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi50cyIsInNyYy9fd215VXRpbHNINS9XbXlVdGlscy50cyIsInNyYy9fd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvV215TG9hZDNkLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteUxvYWRNYXRzLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNELnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvYzRkL1dteUM0RFZldGV4QW5pbWF0b3IudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvcGh5c2ljcy9XbXlQaHlzaWNzV29ybGRfQ2hhcmFjdGVyLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dFYXNlTWFuYWdlci50cyIsInNyYy9fd215VXRpbHNINS93bXlUd2Vlbi9XRWFzZVR5cGUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dUd2Vlbk1hbmFnZXIudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuVmFsdWUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuZXIudHMiLCJzcmMvd215TWF0cy9XbXlNYXRDb25maWcudHMiLCJzcmMvd215TWF0cy9XbXlNYXRNYWcudHMiLCJzcmMvd215U2hhZGVycy9CYXNlX1dteVNoYWRlci50cyIsInNyYy93bXlTaGFkZXJzL1dteUxheWFfd215TGJ0LnRzIiwic3JjL3dteVNoYWRlcnMvV215U2hhZGVyTWFnLnRzIiwic3JjL3dteVUzZFRzL1dteVUzZEltcG9ydC50cyIsInNyYy93bXlVM2RUcy9XbXlVM2RUc0NvbmZpZy50cyIsInNyYy93bXlVM2RUcy9XbXlVM2RUc01hZy50cyIsInNyYy93bXlVM2RUcy90cy9Uc19DNERWZXRleEFuaW1hdG9yLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX0RMaWdodC50cyIsInNyYy93bXlVM2RUcy90cy9Uc19NYXRzLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX1NjZW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1RBLDJEQUEwRDtBQUMxRCxzRUFBcUU7QUFDckUsbURBQWtEO0FBQ2xELHNEQUFpRDtBQUNqRCxpREFBNEM7QUFDNUM7SUFJQztRQUZPLFdBQU0sR0FBQyxHQUFHLENBQUM7UUFDWCxXQUFNLEdBQUMsSUFBSSxDQUFDO1FBRWxCLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU1QyxJQUFJLElBQUksR0FBQyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxJQUFHLElBQUksRUFBQztZQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO1NBQ2hEO2FBQ0c7WUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNuRDtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFD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QUcsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM1RCxLQUFLLHFCQUFTLENBQUMsTUFBTTtnQkFDcEIsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEUsS0FBSyxxQkFBUyxDQUFDLE9BQU87Z0JBQ3JCLElBQUksSUFBSSxJQUFJLFFBQVE7b0JBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQy9CLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRCxLQUFLLHFCQUFTLENBQUMsU0FBUztnQkFDdkIsSUFBSSxJQUFJLElBQUksQ0FBQztvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxJQUFJLElBQUksUUFBUTtvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0MsS0FBSyxxQkFBUyxDQUFDLE1BQU07Z0JBQ3BCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxHQUFH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QUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDRHQUE0RztvQkFDbkgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDRHQUE0RztvQkFDbkgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNEdBQTRHO29CQUNuSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNEdBQTRHO29CQUNuSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUss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QUErRDtBQUMvRDtJQUFxQywyQkFBVztJQUFoRDtRQUFBLHFFQVdFO1FBVEQsVUFBVTtRQUNILGtCQUFZLEdBQU0sS0FBSyxDQUFDO1FBQy9CLFVBQVU7UUFDSCxxQkFBZSxHQUFNLEtBQUssQ0FBQzs7SUFNbEMsQ0FBQztJQUxLLHlCQUFPLEdBQWQ7UUFDQyxRQUFRO1FBQ1IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUUxRCxDQUFDO0lBQ0QsY0FBQztBQUFELENBWEQsQUFXRSxDQVhtQyx5QkFBVyxHQVc5Qzs7Ozs7QUNmRixNQUFNO0FBQ04sb0JBQW9CO0FBQ3BCLGdEQUEyQztBQUMzQyxnRUFBK0Q7QUFDL0Q7SUFBc0MsNEJBQVc7SUFBakQ7O0lBVUMsQ0FBQztJQVBLLDBCQUFPLEdBQWQ7UUFDQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtZQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDcEI7SUFFRCxDQUFDO0lBQ0QsZUFBQztBQUFELENBVkQsQUFVRSxDQVZvQyx5QkFBVyxHQVUvQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBXbXlVdGlsczNEIH0gZnJvbSBcIi4vX3dteVV0aWxzSDUvZDMvV215VXRpbHMzRFwiO1xyXG5pbXBvcnQgeyBXbXlfTG9hZF9NYWcgfSBmcm9tIFwiLi9fd215VXRpbHNINS9XbXlfTG9hZF9NYWdcIjtcclxuaW1wb3J0IHsgV1R3ZWVuTWFuYWdlciB9IGZyb20gXCIuL193bXlVdGlsc0g1L3dteVR3ZWVuL1dUd2Vlbk1hbmFnZXJcIjtcclxuaW1wb3J0IHsgV215VXRpbHMgfSBmcm9tIFwiLi9fd215VXRpbHNINS9XbXlVdGlsc1wiO1xyXG5pbXBvcnQgV215VTNkVHNNYWcgZnJvbSBcIi4vd215VTNkVHMvV215VTNkVHNNYWdcIjtcclxuaW1wb3J0IFdteU1hdE1hZyBmcm9tIFwiLi93bXlNYXRzL1dteU1hdE1hZ1wiO1xyXG5leHBvcnQgY2xhc3MgTWFpbiB7XHJcblx0cHVibGljIHN0YXRpYyBfdGhpczogTWFpbjtcclxuXHRwdWJsaWMgX3Jvb3RXPTY0MDtcclxuXHRwdWJsaWMgX3Jvb3RIPTExMzY7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRNYWluLl90aGlzPXRoaXM7XHJcblx0XHRMYXlhM0QuaW5pdCh0aGlzLl9yb290VywgdGhpcy5fcm9vdEgpO1xyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblxyXG5cdFx0dmFyIGlzUGM9V215VXRpbHMuZ2V0VGhpcy5pc1BjKCk7XHJcblx0XHRpZihpc1BjKXtcclxuXHRcdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBMYXlhLlN0YWdlLlNDQUxFX1NIT1dBTEw7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IExheWEuU3RhZ2UuU0NBTEVfRlVMTDtcclxuXHRcdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gTGF5YS5TdGFnZS5TQ1JFRU5fVkVSVElDQUw7XHJcblx0XHR9XHJcblx0XHRMYXlhLnN0YWdlLmZyYW1lUmF0ZT1MYXlhLlN0YWdlLkZSQU1FX0ZBU1Q7XHJcblx0XHQvL+iuvue9ruawtOW5s+Wvuem9kFxyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25IID0gXCJjZW50ZXJcIjtcclxuXHRcdC8v6K6+572u5Z6C55u05a+56b2QXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnblYgPSBcIm1pZGRsZVwiO1xyXG5cclxuXHRcdExheWEuU3RhdC5zaG93KCk7XHJcblxyXG5cdFx0aWYoIXRoaXNbXCJ2Q29uc29sZVwiXSl7XHJcblx0XHRcdHRoaXNbXCJ2Q29uc29sZVwiXSA9IG5ldyB3aW5kb3dbXCJWQ29uc29sZVwiXSgpO1xyXG5cdFx0XHR0aGlzW1widkNvbnNvbGVcIl0uc3dpdGNoUG9zLnN0YXJ0WSA9IDQwO1xyXG5cdFx0fVxyXG5cdFx0Ly9MYXlhLlNoYWRlcjNELmRlYnVnTW9kZT10cnVlO1xyXG5cclxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcblx0XHR2YXIgd215VlRpbWU9XCJcIjtcclxuXHRcdGlmKHdpbmRvdyE9bnVsbCAmJiB3aW5kb3dbXCJ3bXlWVGltZVwiXSE9bnVsbCl7XHJcblx0XHRcdHdteVZUaW1lPXdpbmRvd1tcIndteVZUaW1lXCJdO1xyXG5cdFx0fVxyXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIrd215VlRpbWUsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLlJFU0laRSk7XHJcblx0XHRXbXlfTG9hZF9NYWcuZ2V0VGhpcy5vblNldFdldERhdGEoXCJsb2FkSW5mb1wiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcclxuXHRcdFx0V215X0xvYWRfTWFnLmdldFRoaXMub25sb2FkU3RyKFwibG9hZFwiLCBuZXcgTGF5YS5IYW5kbGVyKHRoaXMsIHRoaXMub25Mb2FkTWFpbikpO1xyXG5cdFx0fSkpO1xyXG5cdH1cclxuXHRcclxuXHRSRVNJWkUoKSB7XHJcblx0XHR2YXIgc3c9TGF5YS5zdGFnZS53aWR0aC90aGlzLl9yb290VztcclxuXHRcdHZhciBzaD1MYXlhLnN0YWdlLmhlaWdodC90aGlzLl9yb290SDtcclxuXHRcdGlmICh0aGlzLl91aVNjZW5lICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5fdWlTY2VuZS5zY2FsZVg9c3c7XHJcblx0XHRcdHRoaXMuX3VpU2NlbmUuc2NhbGVZPXN3O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuX3VpU2NlbmUgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl91aVJvb3Qud2lkdGggPSBMYXlhLnN0YWdlLndpZHRoL3N3O1xyXG5cdFx0XHR0aGlzLl91aVJvb3QuaGVpZ2h0ID0gTGF5YS5zdGFnZS5oZWlnaHQvc3c7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX0xvYWRSb290ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5fTG9hZFJvb3Qud2lkdGggPSB0aGlzLl91aVJvb3Qud2lkdGg7XHJcblx0XHRcdHRoaXMuX0xvYWRSb290LmhlaWdodCA9IHRoaXMuX3VpUm9vdC5oZWlnaHQ7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX21haW5WaWV3ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5fbWFpblZpZXcud2lkdGggPSB0aGlzLl91aVJvb3Qud2lkdGg7XHJcblx0XHRcdHRoaXMuX21haW5WaWV3LmhlaWdodCA9IHRoaXMuX3VpUm9vdC5oZWlnaHQ7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfdWlTY2VuZTogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHRwcml2YXRlIF91aVJvb3Q6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblxyXG5cdHByaXZhdGUgX0xvYWRSb290OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX0xvYWRCb3g6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfYmFyOiBmYWlyeWd1aS5HUHJvZ3Jlc3NCYXI7XHJcblxyXG5cdHByaXZhdGUgX21haW5WaWV3OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cclxuXHRwcml2YXRlIG9uTG9hZE1haW4oKSB7XHJcblx0XHRMYXlhLnN0YWdlLmFkZENoaWxkKGZhaXJ5Z3VpLkdSb290Lmluc3QuZGlzcGxheU9iamVjdCk7XHJcblx0XHR0aGlzLl91aVNjZW5lPW5ldyBmYWlyeWd1aS5HQ29tcG9uZW50KCk7XHJcblx0XHRmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKHRoaXMuX3VpU2NlbmUpO1xyXG5cdFx0dGhpcy5fdWlSb290PW5ldyBmYWlyeWd1aS5HQ29tcG9uZW50KCk7XHJcblx0XHR0aGlzLl91aVNjZW5lLmFkZENoaWxkKHRoaXMuX3VpUm9vdCk7XHJcblxyXG5cdFx0dGhpcy5fTG9hZFJvb3QgPSBmYWlyeWd1aS5VSVBhY2thZ2UuY3JlYXRlT2JqZWN0KFwibG9hZFwiLCBcIkxvYWRSb290XCIpLmFzQ29tO1xyXG5cdFx0dGhpcy5fdWlSb290LmFkZENoaWxkKHRoaXMuX0xvYWRSb290KTtcclxuXHRcdHRoaXMuX0xvYWRCb3ggPSB0aGlzLl9Mb2FkUm9vdC5nZXRDaGlsZChcIl9Mb2FkQm94XCIpLmFzQ29tO1xyXG5cclxuXHRcdHRoaXMuX2JhciA9IHRoaXMuX0xvYWRCb3guZ2V0Q2hpbGQoXCJiYXJcIikuYXNQcm9ncmVzcztcclxuXHJcblx0XHRXbXlfTG9hZF9NYWcuZ2V0VGhpcy5vbkF1dG9Mb2FkQWxsKG5ldyBMYXlhLkhhbmRsZXIodGhpcywgdGhpcy5vbkxvYWRPayksIG5ldyBMYXlhLkhhbmRsZXIodGhpcywgdGhpcy5vbkxvYWRpbmcpKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25Mb2FkaW5nKHByb2dyZXNzOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHZhciB0d2VlbiA9IFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKTtcclxuXHRcdHR3ZWVuLnNldFRhcmdldCh0aGlzLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMuX29uTG9hZGluZywgbnVsbCwgZmFsc2UpKTtcclxuXHRcdGlmKHRoaXMuX2Jhcil7XHJcblx0XHRcdHR3ZWVuLl90byh0aGlzLl9iYXIudmFsdWUsIHByb2dyZXNzLCAwLjI1KTtcclxuXHRcdH1cclxuXHR9XHJcblx0cHJpdmF0ZSBfb25Mb2FkaW5nKHRhcmdldCwgcCkge1xyXG5cdFx0aWYodGhpcy5fYmFyKXtcclxuXHRcdFx0dGhpcy5fYmFyLnZhbHVlID0gcDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3NjZW5lM0Q6TGF5YS5TY2VuZTNEO1xyXG5cdHByaXZhdGUgb25Mb2FkT2sodWlBcnIsIHUzZEFycikge1xyXG5cdFx0Ly/mt7vliqAzRFxyXG4gICAgICAgIHZhciB1cmwzZD11M2RBcnJbMF0udXJsTGlzdFswXTtcclxuICAgICAgICB0aGlzLl9zY2VuZTNEID1MYXlhLmxvYWRlci5nZXRSZXModXJsM2QpO1xyXG5cdFx0Ly/oh6rliqjmt7vliqDmnZDotKhcclxuXHRcdHRoaXMuX3NjZW5lM0QuYWRkQ29tcG9uZW50KFdteU1hdE1hZyk7XHJcblx0XHQvL+iHquWKqOa3u+WKoFUzROiEmuacrFxyXG5cdFx0dGhpcy5fc2NlbmUzRC5hZGRDb21wb25lbnQoV215VTNkVHNNYWcpO1xyXG5cclxuXHRcdFdUd2Vlbk1hbmFnZXIua2lsbFR3ZWVucyh0aGlzKTtcclxuXHRcdHRoaXMub25NYWluKCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uTWFpbigpe1xyXG5cdFx0dGhpcy5fbWFpblZpZXcgPSBmYWlyeWd1aS5VSVBhY2thZ2UuY3JlYXRlT2JqZWN0KFwibWFpblwiLCBcIk1haW5cIikuYXNDb207XHJcblx0XHRpZiAodGhpcy5fbWFpblZpZXcgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl91aVJvb3QuYWRkQ2hpbGRBdCh0aGlzLl9tYWluVmlldywgMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIF9NYWluPXRoaXMuX21haW5WaWV3LmdldENoaWxkKFwiX01haW5cIikuYXNDb207XHJcblx0XHR2YXIgZDNCb3g9X01haW4uZ2V0Q2hpbGQoXCJkM0JveFwiKTtcclxuXHRcdGQzQm94LmRpc3BsYXlPYmplY3QuYWRkQ2hpbGQodGhpcy5fc2NlbmUzRCk7XHJcblxyXG5cdFx0V1R3ZWVuTWFuYWdlci5raWxsVHdlZW5zKHRoaXMpO1xyXG5cdFx0dGhpcy5fdWlSb290LnJlbW92ZUNoaWxkKHRoaXMuX0xvYWRSb290KTtcclxuXHRcdHRoaXMuX0xvYWRSb290ID0gbnVsbDtcclxuXHRcdHRoaXMuX2JhciA9IG51bGw7XHJcblxyXG5cclxuXHRcdC8vIC8v5Yqg6L29M0TlnLrmma9cclxuXHRcdC8vIExheWEuU2NlbmUzRC5sb2FkKCdyZXMvdTNkL21haW4vQ29udmVudGlvbmFsLzEubHMnLCBMYXlhLkhhbmRsZXIuY3JlYXRlKG51bGwsIGZ1bmN0aW9uKHNjZW5lKXtcclxuXHRcdC8vIFx0Ly/oh6rliqjnu5HlrppVM0TohJrmnKxcclxuXHRcdC8vIFx0c2NlbmUuYWRkQ29tcG9uZW50KFdteVUzZFRzTWFnKTtcclxuXHRcdC8vIFx0Ly/lnLrmma/mt7vliqDliLDoiJ7lj7BcclxuXHRcdC8vIFx0TGF5YS5zdGFnZS5hZGRDaGlsZChzY2VuZSk7XHJcblxyXG5cdFx0Ly8gXHQvLyB2YXIgd215VmV0ZXhfZnowMT1XbXlVdGlsczNELmdldE9iajNkVXJsKHNjZW5lLFwiMS8yLzMvd215VmV0ZXhfZnowMUAxXCIpIGFzIExheWEuU3ByaXRlM0Q7XHJcblx0XHQvLyBcdC8vIHdteVZldGV4X2Z6MDEuZXZlbnQoXCJhbmlfcGxheVwiKTtcclxuXHJcblx0XHQvLyBcdC8vIExheWEudGltZXIub25jZSgxMDAwLHRoaXMsKCk9PntcclxuXHRcdC8vIFx0Ly8gXHR3bXlWZXRleF9mejAxLmV2ZW50KFwiYW5pX3BsYXlcIik7XHJcblx0XHQvLyBcdC8vIH0pXHJcblxyXG5cdFx0Ly8gfSkpO1xyXG5cdH1cclxuXHRcclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJcclxuZXhwb3J0IGNsYXNzIFdteVV0aWxzIGV4dGVuZHMgbGF5YS5ldmVudHMuRXZlbnREaXNwYXRjaGVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzOldteVV0aWxzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteVV0aWxze1xyXG4gICAgICAgIGlmKFdteVV0aWxzLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215VXRpbHMuX3RoaXM9bmV3IFdteVV0aWxzKClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteVV0aWxzLl90aGlzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gTGF5YS50aW1lci5mcmFtZUxvb3AoMSx0aGlzLHRoaXMuX19sb29wKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX0RPV04sdGhpcywgdGhpcy5fX29uVG91Y2hEb3duKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX1VQLHRoaXMsIHRoaXMuX19vblRvdWNoVXApO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfTU9WRSx0aGlzLHRoaXMuX19Pbk1vdXNlTU9WRSk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50LlJFU0laRSx0aGlzLHRoaXMuX19vblJlc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIENPTE9SX0ZJTFRFUlNfTUFUUklYOiBBcnJheTxhbnk+PVtcclxuICAgICAgICAwLCAwLCAwLCAwLCAwLCAvL1JcclxuICAgICAgICAwLCAwLCAwLCAwLCAwLCAvL0dcclxuICAgICAgICAwLCAwLCAwLCAwLCAwLCAvL0JcclxuICAgICAgICAwLCAwLCAwLCAxLCAwLCAvL0FcclxuICAgIF07XHJcbiAgICAvL+i9rOaNouminOiJslxyXG4gICAgcHVibGljIGNvbnZlcnRDb2xvclRvQ29sb3JGaWx0ZXJzTWF0cml4KHI6bnVtYmVyLGc6bnVtYmVyLGI6bnVtYmVyLGE/Om51bWJlcik6QXJyYXk8YW55PlxyXG4gICAge1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzBdPXI7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbNl09ZztcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFsxMl09YjtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFsxOF09YXx8MTtcclxuICAgICAgICByZXR1cm4gV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVg7XHJcbiAgICB9XHJcbiAgICAvL+WvueWvueixoeaUueWPmOminOiJslxyXG4gICAgcHVibGljIGFwcGx5Q29sb3JGaWx0ZXJzKHRhcmdldDpMYXlhLlNwcml0ZSxjb2xvcjpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlcnM9bnVsbDtcclxuICAgICAgICBpZihjb2xvciAhPSAweGZmZmZmZil7XHJcbiAgICAgICAgICAgIHRhcmdldC5maWx0ZXJzPVtuZXcgTGF5YS5Db2xvckZpbHRlcih0aGlzLmNvbnZlcnRDb2xvclRvQ29sb3JGaWx0ZXJzTWF0cml4KFxyXG4gICAgICAgICAgICAgICAgKChjb2xvcj4+MTYpICYgMHhmZikvMjU1LFxyXG4gICAgICAgICAgICAgICAgKChjb2xvcj4+OCkgJiAweGZmKS8yNTUsXHJcbiAgICAgICAgICAgICAgICAoY29sb3IgJiAweGZmKS8yNTVcclxuICAgICAgICAgICAgICAgICkpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvL+WvueWvueixoeaUueWPmOminOiJslxyXG4gICAgcHVibGljIGFwcGx5Q29sb3JGaWx0ZXJzMSh0YXJnZXQ6TGF5YS5TcHJpdGUscjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXIsYT86bnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJzPW51bGw7XHJcbiAgICAgICAgaWYociA8IDEgfHwgZyA8IDEgfHwgYiA8IDEgfHwgYSA8IDEpe1xyXG4gICAgICAgICAgICB0YXJnZXQuZmlsdGVycz1bbmV3IExheWEuQ29sb3JGaWx0ZXIodGhpcy5jb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChyLGcsYixhKSldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+WIpOaWreaJi+acuuaIllBDXHJcbiAgICBwdWJsaWMgaXNQYygpOmJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICB2YXIgaXNQYzpib29sZWFuPWZhbHNlO1xyXG4gICAgICAgIGlmKHRoaXMudmVyc2lvbnMoKS5hbmRyb2lkIHx8IHRoaXMudmVyc2lvbnMoKS5pUGhvbmUgfHwgdGhpcy52ZXJzaW9ucygpLmlvcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlzUGM9ZmFsc2U7XHJcbiAgICAgICAgfWVsc2UgaWYodGhpcy52ZXJzaW9ucygpLmlQYWQpe1xyXG4gICAgICAgICAgICBpc1BjPXRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaXNQYz10cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpc1BjO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHZlcnNpb25zKCl7XHJcbiAgICAgICAgdmFyIHU6c3RyaW5nID0gbmF2aWdhdG9yLnVzZXJBZ2VudCwgYXBwOnN0cmluZyA9IG5hdmlnYXRvci5hcHBWZXJzaW9uO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC8v56e75Yqo57uI56uv5rWP6KeI5Zmo54mI5pys5L+h5oGvXHJcbiAgICAgICAgICAgIHRyaWRlbnQ6IHUuaW5kZXhPZignVHJpZGVudCcpID4gLTEsIC8vSUXlhoXmoLhcclxuICAgICAgICAgICAgcHJlc3RvOiB1LmluZGV4T2YoJ1ByZXN0bycpID4gLTEsIC8vb3BlcmHlhoXmoLhcclxuICAgICAgICAgICAgd2ViS2l0OiB1LmluZGV4T2YoJ0FwcGxlV2ViS2l0JykgPiAtMSwgLy/oi7nmnpzjgIHosLfmrYzlhoXmoLhcclxuICAgICAgICAgICAgZ2Vja286IHUuaW5kZXhPZignR2Vja28nKSA+IC0xICYmIHUuaW5kZXhPZignS0hUTUwnKSA9PSAtMSwgLy/ngavni5DlhoXmoLhcclxuICAgICAgICAgICAgbW9iaWxlOiAhIXUubWF0Y2goL0FwcGxlV2ViS2l0LipNb2JpbGUuKi8pfHwhIXUubWF0Y2goL0FwcGxlV2ViS2l0LyksIC8v5piv5ZCm5Li656e75Yqo57uI56uvXHJcbiAgICAgICAgICAgIGlvczogISF1Lm1hdGNoKC9cXChpW147XSs7KCBVOyk/IENQVS4rTWFjIE9TIFgvKSwgLy9pb3Pnu4jnq69cclxuICAgICAgICAgICAgYW5kcm9pZDogdS5pbmRleE9mKCdBbmRyb2lkJykgPiAtMSB8fCB1LmluZGV4T2YoJ0xpbnV4JykgPiAtMSwgLy9hbmRyb2lk57uI56uv5oiW6ICFdWPmtY/op4jlmahcclxuICAgICAgICAgICAgaVBob25lOiB1LmluZGV4T2YoJ2lQaG9uZScpID4gLTEgfHwgdS5pbmRleE9mKCdNYWMnKSA+IC0xLCAvL+aYr+WQpuS4umlQaG9uZeaIluiAhVFRSETmtY/op4jlmahcclxuICAgICAgICAgICAgaVBhZDogdS5pbmRleE9mKCdpUGFkJykgPiAtMSwgLy/mmK/lkKZpUGFkXHJcbiAgICAgICAgICAgIHdlYkFwcDogdS5pbmRleE9mKCdTYWZhcmknKSA9PSAtMSAvL+aYr+WQpndlYuW6lOivpeeoi+W6j++8jOayoeacieWktOmDqOS4juW6lemDqFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVybFYoa2V5OnN0cmluZyl7XHJcbiAgICAgICAgdmFyIHJlZz0gbmV3IFJlZ0V4cChcIihefCYpXCIra2V5K1wiPShbXiZdKikoJnwkKVwiKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkubWF0Y2gocmVnKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0P2RlY29kZVVSSUNvbXBvbmVudChyZXN1bHRbMl0pOm51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTmF2aWdhdGUodXJsOnN0cmluZyxpc1JlcGxhY2U6Ym9vbGVhbj1mYWxzZSl7XHJcbiAgICAgICAgaWYoaXNSZXBsYWNlKXtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UodXJsKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj11cmw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2V2ZW50TGlzdDpBcnJheTxsYXlhLmV2ZW50cy5FdmVudD49bmV3IEFycmF5PGxheWEuZXZlbnRzLkV2ZW50PigpO1xyXG4gICAgcHJpdmF0ZSBfX29uVG91Y2hEb3duKGV2dDogbGF5YS5ldmVudHMuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpPDApe1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3QucHVzaChldnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgX19vblRvdWNoVXAoZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdC5pbmRleE9mKGV2dCk+PTApe1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3Quc3BsaWNlKHRoaXMuX2V2ZW50TGlzdC5pbmRleE9mKGV2dCksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgX19vblJlc2l6ZSgpe1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdC5mb3JFYWNoKGV2dCA9PiB7XHJcbiAgICAgICAgICAgIGV2dC50eXBlPUxheWEuRXZlbnQuTU9VU0VfVVA7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2UuZXZlbnQoTGF5YS5FdmVudC5NT1VTRV9VUCxldnQpO1xyXG5cdFx0fSk7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0PW5ldyBBcnJheTxsYXlhLmV2ZW50cy5FdmVudD4oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfX09uTW91c2VNT1ZFKGV2dDogbGF5YS5ldmVudHMuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICB2YXIgYk51bT0xMDtcclxuICAgICAgICBpZihldnQuc3RhZ2VYIDw9IGJOdW0gfHwgZXZ0LnN0YWdlWCA+PSBMYXlhLnN0YWdlLndpZHRoLWJOdW0gfHxcclxuICAgICAgICAgICAgZXZ0LnN0YWdlWSA8PSBiTnVtIHx8IGV2dC5zdGFnZVkgPj0gTGF5YS5zdGFnZS5oZWlnaHQtYk51bSl7XHJcbiAgICAgICAgICAgIGV2dC50eXBlPUxheWEuRXZlbnQuTU9VU0VfVVA7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2UuZXZlbnQoTGF5YS5FdmVudC5NT1VTRV9VUCxldnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25OdW1UbyhuLGw9Mil7XHJcblx0XHRpZigobitcIlwiKS5pbmRleE9mKFwiLlwiKT49MCl7XHJcblx0XHQgICAgbj1wYXJzZUZsb2F0KG4udG9GaXhlZChsKSk7XHJcbiAgICAgICAgfVxyXG5cdFx0cmV0dXJuIG47XHJcblx0fVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Ul9YWShkLCByKVxyXG4gICAge1xyXG4gICAgXHR2YXIgcmFkaWFuID0gKHIgKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgIFx0dmFyIGNvcyA9ICBNYXRoLmNvcyhyYWRpYW4pO1xyXG4gICAgXHR2YXIgc2luID0gIE1hdGguc2luKHJhZGlhbik7XHJcbiAgICBcdFxyXG4gICAgXHR2YXIgZHg9ZCAqIGNvcztcclxuICAgIFx0dmFyIGR5PWQgKiBzaW47XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgTGF5YS5Qb2ludChkeCAsIGR5KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgcHVibGljIHN0YXRpYyBzdHJpbmcyYnVmZmVyKHN0cik6QXJyYXlCdWZmZXIge1xyXG4gICAgICAgIC8vIOmmluWFiOWwhuWtl+espuS4sui9rOS4ujE26L+b5Yi2XHJcbiAgICAgICAgbGV0IHZhbCA9IFwiXCJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh2YWwgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHZhbCA9IHN0ci5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbCArPSAnLCcgKyBzdHIuY2hhckNvZGVBdChpKS50b1N0cmluZygxNilcclxuICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOWwhjE26L+b5Yi26L2s5YyW5Li6QXJyYXlCdWZmZXJcclxuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkodmFsLm1hdGNoKC9bXFxkYS1mXXsyfS9naSkubWFwKGZ1bmN0aW9uIChoKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGgsIDE2KVxyXG4gICAgICAgIH0pKS5idWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZXBsYWNlQWxsKHN0ciwgb2xkU3RyLCBuZXdTdHIpeyAgXHJcbiAgICAgICAgdmFyIHRlbXAgPSAnJzsgIFxyXG4gICAgICAgIHRlbXAgPSBzdHIucmVwbGFjZShvbGRTdHIsIG5ld1N0cik7XHJcbiAgICAgICAgaWYodGVtcC5pbmRleE9mKG9sZFN0cik+PTApe1xyXG4gICAgICAgICAgICB0ZW1wID0gdGhpcy5yZXBsYWNlQWxsKHRlbXAsIG9sZFN0ciwgbmV3U3RyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7ICBcclxuICAgIH0gIFxyXG5cclxuICAgIC8v5aSn5bCP5YaZ6L2s5o2iXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvQ2FzZShzdHI6c3RyaW5nLCBpc0R4PWZhbHNlKXsgIFxyXG4gICAgICAgIHZhciB0ZW1wID0gJyc7XHJcbiAgICAgICAgaWYoIWlzRHgpe1xyXG4gICAgICAgICAgICAvL+i9rOaNouS4uuWwj+WGmeWtl+avjVxyXG4gICAgICAgICAgICB0ZW1wPXN0ci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAvL+i9rOWMluS4uuWkp+WGmeWtl+avjVxyXG4gICAgICAgICAgICB0ZW1wPXN0ci50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDsgIFxyXG4gICAgfSBcclxuXHJcbiAgICBcclxuICAgIC8v6Led56a7XHJcblx0cHVibGljIHN0YXRpYyBnZXREaXN0YW5jZShhOkxheWEuUG9pbnQsYjpMYXlhLlBvaW50KTpudW1iZXIge1xyXG5cdFx0dmFyIGR4ID0gTWF0aC5hYnMoYS54IC0gYi54KTtcclxuXHRcdHZhciBkeSA9IE1hdGguYWJzKGEueSAtIGIueSk7XHJcblx0XHR2YXIgZD1NYXRoLnNxcnQoTWF0aC5wb3coZHgsIDIpICsgTWF0aC5wb3coZHksIDIpKTtcclxuXHRcdGQ9cGFyc2VGbG9hdChkLnRvRml4ZWQoMikpO1xyXG5cdFx0cmV0dXJuIGQ7XHJcblx0fVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0WHlUb1IoeSx4KTpudW1iZXJ7XHJcbiAgICAgICAgdmFyIHJhZGlhbj1NYXRoLmF0YW4yKHkseCk7XHJcbiAgICAgICAgdmFyIHI9KDE4MC9NYXRoLlBJKnJhZGlhbik7XHJcbiAgICAgICAgcj10aGlzLm9uTnVtVG8ocik7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzdG9yYWdlKGtleSwgdmFsdWU6YW55PVwiP1wiLCBpc0xvY2FsPXRydWUpOmFueXtcclxuICAgICAgICB2YXIgc3RvcmFnZTphbnk9aXNMb2NhbD9sb2NhbFN0b3JhZ2U6c2Vzc2lvblN0b3JhZ2U7XHJcbiAgICAgICAgaWYodmFsdWU9PVwiP1wiKXtcclxuXHRcdFx0dmFyIGRhdGEgPSBzdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKHZhbHVlPT1udWxsKXtcclxuXHRcdFx0c3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRzdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XHJcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5pKt5pS+5aOw6Z+zXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlGdWlTb3VuZChfdXJsLHZvbHVtZT0wLjIsY29tcGxldGVIYW5kbGVyPyxzdGFydFRpbWU9MCxsb29wcz0xKXtcclxuICAgICAgICBpZih2b2x1bWU8PTApcmV0dXJuO1xyXG4gICAgICAgIHZhciBpdGVtPWZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtQnlVUkwoX3VybCk7XHJcbiAgICAgICAgdmFyIHVybD1pdGVtLmZpbGU7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKHVybCxsb29wcyxjb21wbGV0ZUhhbmRsZXIsbnVsbCxzdGFydFRpbWUpO1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnNldFNvdW5kVm9sdW1lKHZvbHVtZSx1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5rWF5ou36LSdXHJcbiAgICBwdWJsaWMgc3RhdGljIHNoYWxsb3dDb3B5KG9iail7XHJcbiAgICAgICAgLy8g5Y+q5ou36LSd5a+56LGhXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSByZXR1cm47XHJcbiAgICAgICAgLy8g5qC55o2ub2Jq55qE57G75Z6L5Yik5pat5piv5paw5bu65LiA5Liq5pWw57uE6L+Y5piv5LiA5Liq5a+56LGhXHJcbiAgICAgICAgdmFyIG5ld09iaiA9IG9iaiBpbnN0YW5jZW9mIEFycmF5ID8gW10gOiB7fTtcclxuICAgICAgICAvLyDpgY3ljoZvYmos5bm25LiU5Yik5pat5pivb2Jq55qE5bGe5oCn5omN5ou36LSdXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBvYmpba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3T2JqO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5rex5ou36LSdXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlZXBDb3B5KG9iail7XHJcbiAgICAgICAgLy8g5Y+q5ou36LSd5a+56LGhXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSByZXR1cm47XHJcbiAgICAgICAgLy8g5qC55o2ub2Jq55qE57G75Z6L5Yik5pat5piv5paw5bu65LiA5Liq5pWw57uE6L+Y5piv5LiA5Liq5a+56LGhXHJcbiAgICAgICAgdmFyIG5ld09iaiA9IG9iaiBpbnN0YW5jZW9mIEFycmF5ID8gW10gOiB7fTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIC8vIOmBjeWOhm9iaizlubbkuJTliKTmlq3mmK9vYmrnmoTlsZ7mgKfmiY3mi7fotJ1cclxuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDliKTmlq3lsZ7mgKflgLznmoTnsbvlnovvvIzlpoLmnpzmmK/lr7nosaHpgJLlvZLosIPnlKjmt7Hmi7fotJ1cclxuICAgICAgICAgICAgICAgIG5ld09ialtrZXldID0gdHlwZW9mIG9ialtrZXldID09PSAnb2JqZWN0JyA/IHRoaXMuZGVlcENvcHkob2JqW2tleV0pIDogb2JqW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iajtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBXbXlVdGlscyB9IGZyb20gXCIuL1dteVV0aWxzXCI7XHJcbmltcG9ydCB7IFdteUxvYWQzZCB9IGZyb20gXCIuL2QzL1dteUxvYWQzZFwiO1xyXG5pbXBvcnQgeyBXbXlMb2FkTWF0cyB9IGZyb20gXCIuL2QzL1dteUxvYWRNYXRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215X0xvYWRfTWFnXHJcbntcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteV9Mb2FkX01hZ3tcclxuICAgICAgICBpZihXbXlfTG9hZF9NYWcuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlfTG9hZF9NYWcuX3RoaXM9bmV3IFdteV9Mb2FkX01hZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215X0xvYWRfTWFnLl90aGlzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfd2V0RGF0YTphbnk9e307XHJcblxyXG4gICAgcHVibGljIGRhdGFOYW1lOnN0cmluZz1cIlwiO1xyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0UmVzT2JqKHJlc05hbWU6c3RyaW5nLGRhdGFOYW1lPyl7XHJcbiAgICAgICAgdmFyIHdlYkRhdGE6YW55O1xyXG4gICAgICAgIGlmKGRhdGFOYW1lPT1udWxsKXtcclxuICAgICAgICAgICAgZGF0YU5hbWU9dGhpcy5kYXRhTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2ViRGF0YT10aGlzLl93ZXREYXRhW2RhdGFOYW1lXTtcclxuICAgICAgICBpZih3ZWJEYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi56m65pWw5o2uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFycjpBcnJheTxhbnk+PW51bGw7XHJcbiAgICAgICAgaWYod2ViRGF0YSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgYXJyPXdlYkRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXNPYmo9bnVsbDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1hcnJbaV07XHJcbiAgICAgICAgICAgIGlmKG9ialtcInJlc05hbWVcIl09PXJlc05hbWUpe1xyXG4gICAgICAgICAgICAgICAgcmVzT2JqPW9iajtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uU2V0V2V0RGF0YShkYXRhTmFtZTpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIGlmKHdpbmRvd1tkYXRhTmFtZV09PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZGF0YU5hbWU9ZGF0YU5hbWU7XHJcbiAgICAgICAgdGhpcy5fd2V0RGF0YVtkYXRhTmFtZV09d2luZG93W2RhdGFOYW1lXTtcclxuICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW3RoaXMuX3dldERhdGFbZGF0YU5hbWVdXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9ubG9hZFN0cihzdHI6c3RyaW5nLGNhbGxiYWNrT2s/OkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNPYmo9dGhpcy5nZXRSZXNPYmooc3RyKTtcclxuICAgICAgICBpZihyZXNPYmohPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLm9ubG9hZChyZXNPYmosY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwib25sb2FkU3RyLeWHuumUmTpcIixzdHIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZXNEYXRhQXJyOkFycmF5PGFueT49W107XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja09rOkFycmF5PGFueT49W107XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkFycmF5PGFueT49W107XHJcbiAgICBwdWJsaWMgb25sb2FkKHJlc09iajphbnksY2FsbGJhY2tPaz86TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc05hbWU9cmVzT2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICBpZih0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXS5ydW5XaXRoKFt0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNPYmpbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciBkYXRhOmFueT17fTtcclxuICAgICAgICAgICAgdmFyIHJlc0RhdGE6c3RyaW5nPXJlc09ialtcInJlc0RhdGFcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc0RhdGEhPW51bGwgJiYgcmVzRGF0YSE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9SlNPTi5wYXJzZShyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIscmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lVXJsO1xyXG4gICAgICAgICAgICB2YXIgdXJsQXJyOkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHZhciBpc0NyZWF0ZT1mYWxzZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNVcmw9V215VXRpbHMudG9DYXNlKHJlc1VybCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIGlmKHVybC5pbmRleE9mKFwiLnR4dFwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5CVUZGRVJ9KTtcclxuICAgICAgICAgICAgICAgICAgICBiTmFtZVVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHVybC5pbmRleE9mKFwiLmpwZ1wiKT49MCB8fCB1cmwuaW5kZXhPZihcIi5wbmdcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuSU1BR0V9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodXJsLmluZGV4T2YoXCIubXAzXCIpPj0wIHx8IHVybC5pbmRleE9mKFwiLndhdlwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5TT1VORH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybEFyci5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybEFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkFzc2V0Q29ubXBsZXRlLFtyZXNOYW1lLGJOYW1lVXJsLGRhdGFdKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Bc3NldFByb2dyZXNzLCBbcmVzTmFtZV0sIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIG9uQ2xlYXIzZFJlcyh1cmwpe1xyXG4gICAgICAgIExheWEuUmVzb3VyY2UuZGVzdHJveVVudXNlZFJlc291cmNlcygpO1xyXG4gICAgICAgIFdteUxvYWQzZC5nZXRUaGlzLmNsZWFyUmVzKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZDNkT25lKHVybDpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICBXbXlMb2FkM2Qub25Mb2FkM2RPbmUodXJsLGNhbGxiYWNrT2ssY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9ubG9hZDNkKHJlc09iajphbnksY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgcmVzTmFtZT1yZXNPYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgIGlmKHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdLnJ1bldpdGgoW3RoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc09ialtcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6YW55PXt9O1xyXG4gICAgICAgICAgICB2YXIgcmVzRGF0YTpzdHJpbmc9cmVzT2JqW1wicmVzRGF0YVwiXTtcclxuICAgICAgICAgICAgaWYocmVzRGF0YSE9bnVsbCAmJiByZXNEYXRhIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YT1KU09OLnBhcnNlKHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIixyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWU7XHJcbiAgICAgICAgICAgIHZhciB1cmxBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdmFyIHVybExpc3Q6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybC5pbmRleE9mKFwiLmxzXCIpPj0wIHx8IHJlc1VybC5pbmRleE9mKFwiLmxoXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHVybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybEFyci5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhLnVybExpc3Q9dXJsTGlzdDtcclxuICAgICAgICAgICAgV215TG9hZDNkLmdldFRoaXMub25sb2FkM2QodXJsQXJyLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uQXNzZXRDb25tcGxldGUsW3Jlc05hbWUsYk5hbWUsZGF0YV0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkFzc2V0UHJvZ3Jlc3MsIFtyZXNOYW1lXSwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG5cdHByaXZhdGUgb25Bc3NldFByb2dyZXNzKHJlc05hbWUscHJvZ3Jlc3MpOiB2b2lkIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2tQcm9ncmVzc0FycjpBcnJheTxMYXlhLkhhbmRsZXI+PXRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja1Byb2dyZXNzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNhbGxiYWNrUHJvZ3Jlc3NBcnJbaV07XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLnJ1bldpdGgoW3Byb2dyZXNzXSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBvbkFzc2V0Q29ubXBsZXRlKHJlc05hbWUsYk5hbWVVcmw6c3RyaW5nLGRhdGEpOnZvaWR7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrT2tBcnI6QXJyYXk8TGF5YS5IYW5kbGVyPj10aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdO1xyXG4gICAgICAgIGlmKGJOYW1lVXJsIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGJhbz1MYXlhLmxvYWRlci5nZXRSZXMoYk5hbWVVcmwpO1xyXG4gICAgICAgICAgICB2YXIgYk5hbWUgPSBiTmFtZVVybC5yZXBsYWNlKFwiLnR4dFwiLFwiXCIpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZmFpcnlndWkuVUlQYWNrYWdlLmFkZFBhY2thZ2UoYk5hbWUsYmFvKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkZVSS3lh7rplJk6XCIsYk5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZUFycj1iTmFtZS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIGRhdGEuYk5hbWU9Yk5hbWVBcnJbYk5hbWVBcnIubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdPWRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tPa0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tPayA9IGNhbGxiYWNrT2tBcnJbaV07XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tPay5ydW5XaXRoKFtkYXRhXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1udWxsO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pc0F1dG9Mb2FkUD1mYWxzZTtcclxuICAgIHByaXZhdGUgX2lzVTNkPWZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRJbmZvQXJyOmFueTtcclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkckNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25BdXRvTG9hZEFsbChjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciB3ZWJEYXRhOmFueT10aGlzLl93ZXREYXRhW3RoaXMuZGF0YU5hbWVdO1xyXG4gICAgICAgIGlmKHdlYkRhdGE9PW51bGwpe1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLnqbrmlbDmja5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYXJyOkFycmF5PGFueT49bnVsbDtcclxuICAgICAgICBpZih3ZWJEYXRhIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBhcnI9d2ViRGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYXJyPT1udWxsKXtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycj1KU09OLnBhcnNlKHdlYkRhdGEpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5p2Q5paZ5pWw5o2u6ZSZ6K+vXCIsd2ViRGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0Fycj17fTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl09MDtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdPTA7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl09W107XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdPVtdO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPWFycltpXTtcclxuICAgICAgICAgICAgdmFyIHJlc05hbWU9b2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICAgICAgdmFyIHQ9b2JqW1widHlwZVwiXTtcclxuICAgICAgICAgICAgaWYocmVzTmFtZT09bnVsbCB8fCByZXNOYW1lPT1cIlwiIHx8IHQ9PW51bGwgfHwgdD09XCJcIiljb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5vbkF1dG9Mb2FkT2JqKHQscmVzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2lzQXV0b0xvYWRQPXRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQXV0b0xvYWRPYmoodHlwZTpzdHJpbmcscmVzTmFtZSl7XHJcbiAgICAgICAgdmFyIHJlcz10aGlzLmdldFJlc09iaihyZXNOYW1lKTtcclxuICAgICAgICBpZihyZXM9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciByZXNJZD10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl07XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXT17fTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1wiblwiXT1yZXNOYW1lO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPXR5cGU7XHJcbiAgICAgICAgdmFyIGxvYWRPaz1mYWxzZTtcclxuICAgICAgICBpZih0eXBlPT1cInVpXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ1aS3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGU9PVwidTNkXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQzZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICB0aGlzLl9pc1UzZD10cnVlO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInUzZC3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGU9PVwibWF0c1wiKXtcclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc1tcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgdmFyIHVybExpc3Q6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIHJlc1VybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHJlc1VybCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICB1cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxMaXN0Lmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWRNYXRzLmdldFRoaXMub25sb2FkM2QodXJsTGlzdCxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICAgICAgbG9hZE9rPXRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIm1hdHMt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlPT1cImN1YmVNYXBcIil7XHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIExheWEuVGV4dHVyZUN1YmUubG9hZCh1cmwsbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZT09XCJhdWRpb1wiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYXVkaW8t5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3ViZShyZXNOYW1lLCBjb21wbGV0ZTogTGF5YS5IYW5kbGVyKTpBcnJheTxMYXlhLlRleHR1cmVDdWJlPntcclxuICAgICAgICB2YXIgcmVzPXRoaXMuZ2V0UmVzT2JqKHJlc05hbWUpO1xyXG4gICAgICAgIGlmKHJlcz09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc1tcIlJlc3Jlc1wiXTtcclxuICAgICAgICB2YXIgUmVzcmVzT2JqOkFycmF5PExheWEuVGV4dHVyZUN1YmU+PVtdO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICByZXNVcmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChyZXNVcmwpO1xyXG4gICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgTGF5YS5UZXh0dXJlQ3ViZS5sb2FkKHVybCxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsY3ViZT0+e1xyXG4gICAgICAgICAgICAgICAgUmVzcmVzT2JqW2ldPWN1YmU7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZS5ydW5XaXRoKFtjdWJlLGldKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUmVzcmVzT2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Mb2FkaW5nKHJlc0lkLCBwcm9ncmVzczpudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB2YXIgcEM9MDtcclxuICAgICAgICBpZighdGhpcy5faXNBdXRvTG9hZFApe1xyXG4gICAgICAgICAgICBpZih0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcENdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJwXCJdPXByb2dyZXNzO1xyXG4gICAgICAgIHZhciBudW09dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdO1xyXG4gICAgICAgIHZhciBwTnVtPTA7XHJcbiAgICAgICAgdmFyIHBTPTEvbnVtO1xyXG4gICAgICAgIHZhciBwMD0wLHAxPTA7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxudW07aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj10aGlzLl9hdXRvTG9hZEluZm9BcnJbaV07XHJcbiAgICAgICAgICAgIHZhciBwPW9ialtcInBcIl07XHJcbiAgICAgICAgICAgIGlmKHAhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5faXNVM2Qpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG9ialtcInRcIl09PVwidTNkXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwMT1wKihwUyooaSsxKSkqMC44O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwMD1wKihwUyooaSsxKSkqMC4yO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwTnVtPXAwK3AxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBwTnVtPXAqKHBTKihpKzEpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwQz1wTnVtKjEwMDtcclxuICAgICAgICBpZihpc05hTihwQykpcEM9MDtcclxuICAgICAgICBpZihwQz4xKVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBDKTtcclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwQ10pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25Mb2FkT2socmVzSWQsZGF0YT8pe1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInRcIl09PVwidWlcIil7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInRcIl09PVwidTNkXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl0ucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXT49dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKXtcclxuICAgICAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rLnJ1bldpdGgoW3RoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdLHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn0iLCJpbXBvcnQgeyBXbXlVdGlsczNEIH0gZnJvbSBcIi4vV215VXRpbHMzRFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteUxvYWQzZHtcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteUxvYWQzZHtcclxuICAgICAgICBpZihXbXlMb2FkM2QuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlMb2FkM2QuX3RoaXM9bmV3IFdteUxvYWQzZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215TG9hZDNkLl90aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF91cmxMaXN0OkFycmF5PHN0cmluZz47XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja09rOkxheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9ubG9hZDNkKHVybExpc3Q6QXJyYXk8c3RyaW5nPixjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIsaXNDbGVhclJlcz8pe1xyXG4gICAgICAgIHRoaXMuX3VybExpc3Q9W107XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHVybExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciB1cmw6c3RyaW5nPXVybExpc3RbaV1bXCJ1cmxcIl07XHJcbiAgICAgICAgICAgIHVybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHVybCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICB0aGlzLl9vbmxvYWQzZCh1cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgb25Mb2FkM2RPbmUodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgLy8gICAgIFdteUxvYWQzZC5nZXRUaGlzLl9vbkxvYWQzZE9uZSh1cmwsY2FsbGJhY2tPayxjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgX29uTG9hZDNkT25lKHVybDpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgIC8vICAgICB0aGlzLl9sb2FkM2QodXJsLGNhbGxiYWNrT2ssY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBfbG9hZDNkKHVybCxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgLy8gICAgIExheWEubG9hZGVyLmNsZWFyUmVzKHVybCk7XHJcbiAgICAvLyAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgIC8vICAgICAgICAgaWYoY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgICAgICBjYWxsYmFja09rLnJ1bigpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLChwKT0+e1xyXG4gICAgLy8gICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgIGNhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcF0pO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSxudWxsLGZhbHNlKSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBvbkxvYWQzZE9uZSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHdteUxvYWQzZD1uZXcgV215TG9hZDNkKCk7XHJcbiAgICAgICAgd215TG9hZDNkLl9fb25sb2FkM2RPbmUodXJsLGNhbGxiYWNrT2ssY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9fb25sb2FkM2RPbmUodXJsLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdGhpcy5fdXJsTGlzdD1bXTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIHVybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHVybCk7XHJcbiAgICAgICAgdGhpcy5fdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgdGhpcy5fb25sb2FkM2QodXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIF9vbmxvYWQzZChfdXJsTGlzdCl7XHJcbiAgICAvLyAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHRoaXMuX3VybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCgpPT57XHJcbiAgICAvLyAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB0aGlzLl91cmxMaXN0PW51bGw7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9bnVsbDtcclxuICAgIC8vICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1udWxsO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9tQXJyPW51bGw7XHJcbiAgICAvLyAgICAgfSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLChwKT0+e1xyXG4gICAgLy8gICAgICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcF0pO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSksbnVsbCxudWxsLG51bGwsMSxmYWxzZSk7XHJcbiAgICAvLyB9XHJcbiAgICBwcml2YXRlIF9vbmxvYWQzZCh1cmwpe1xyXG4gICAgICAgIExheWEubG9hZGVyLmNsZWFyUmVzKHVybCk7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIuX2NyZWF0ZUxvYWQodXJsKTtcclxuICAgICAgICB2YXIgbG9hZD1MYXlhLkxvYWRlck1hbmFnZXJbXCJfcmVzTWFwXCJdW3VybF07XHJcbiAgICAgICAgbG9hZC5vbmNlKExheWEuRXZlbnQuQ09NUExFVEUsdGhpcyx0aGlzLl9fb25sc1VybE9rLFt1cmxdKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tQXJyOkFycmF5PHN0cmluZz47XHJcbiAgICBwcml2YXRlIF9fb25sc1VybE9rKHVybCxkKXtcclxuICAgICAgICB2YXIgczA9dXJsLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICB2YXIgczE9dXJsLnJlcGxhY2UoczBbczAubGVuZ3RoLTFdLFwiXCIpO1xyXG4gICAgICAgIHZhciByb290VXJsPXMxO1xyXG4gICAgICAgIHZhciBqc09iaj1KU09OLnBhcnNlKGQpO1xyXG4gICAgICAgIHRoaXMuX21BcnI9W107XHJcblxyXG4gICAgICAgIHRoaXMuX190aVF1VXJsKGpzT2JqW1wiZGF0YVwiXSxyb290VXJsKTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21BcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25Mb2FkT2spKTtcclxuICAgICAgICAgICAgLy9MYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25Mb2FkT2spLHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLGdyb3VwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbU51bT0wO1xyXG4gICAgcHJpdmF0ZSBfcE51bT0wO1xyXG4gICAgcHJpdmF0ZSBfX29uTG9hZE9rKCl7XHJcbiAgICAgICAgdGhpcy5fbU51bSs9MTtcclxuICAgICAgICB0aGlzLl9wTnVtPXRoaXMuX21OdW0vdGhpcy5fbUFyci5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5fX29uTG9hZFAobnVsbCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX21OdW0+PXRoaXMuX21BcnIubGVuZ3RoKXtcclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHRoaXMuX3VybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCgpPT57XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXJsTGlzdD1udWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1udWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1udWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbUFycj1udWxsO1xyXG4gICAgICAgICAgICB9KSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTG9hZFApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX19vbkxvYWRQKHApe1xyXG4gICAgICAgIHZhciBwTnVtPXRoaXMuX3BOdW0qMC43O1xyXG4gICAgICAgIGlmKHApe1xyXG4gICAgICAgICAgICBwTnVtKz1wKjAuMjU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BOdW1dKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIHByaXZhdGUgX21QPTA7XHJcbiAgICAvLyBwcml2YXRlIF9tUDI9MDtcclxuXHJcbiAgICAvLyBwcml2YXRlIF9fb25BcnJQKHApe1xyXG4gICAgLy8gICAgIHZhciBwTnVtPXAqKHRoaXMuX21OdW0rMSk7XHJcbiAgICAvLyAgICAgaWYocE51bT50aGlzLl9tUCl0aGlzLl9tUD1wTnVtO1xyXG4gICAgLy8gICAgIHRoaXMuX21QMj0odGhpcy5fbVAvdGhpcy5fbUFyci5sZW5ndGgpO1xyXG4gICAgICAgIFxyXG4gICAgLy8gICAgIHZhciBwTnVtPSh0aGlzLl9tUDIpKjAuOTg7XHJcbiAgICAvLyAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcE51bV0pO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuICAgIC8vIHByaXZhdGUgX19vbkFyck9rKCl7XHJcbiAgICAvLyAgICAgdGhpcy5fbU51bSs9MTtcclxuICAgIC8vICAgICBpZih0aGlzLl9tTnVtPj10aGlzLl9tQXJyLmxlbmd0aCl7XHJcbiAgICAvLyAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh0aGlzLl91cmxMaXN0LExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgLy8gICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuX3VybExpc3Q9bnVsbDtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9bnVsbDtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9bnVsbDtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuX21BcnI9bnVsbDtcclxuICAgIC8vICAgICAgICAgfSkpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuICAgIHByaXZhdGUgX190aVF1VXJsKG9iaix1cmw6c3RyaW5nPVwiXCIpe1xyXG4gICAgICAgIGlmKG9ialtcInByb3BzXCJdIT1udWxsICYmIG9ialtcInByb3BzXCJdW1wibWVzaFBhdGhcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgbWVzaFBhdGg9dXJsK29ialtcInByb3BzXCJdW1wibWVzaFBhdGhcIl07XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihtZXNoUGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2gobWVzaFBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbHM6QXJyYXk8YW55Pj1vYmpbXCJwcm9wc1wiXVtcIm1hdGVyaWFsc1wiXTtcclxuICAgICAgICAgICAgaWYobWF0ZXJpYWxzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaWk9MDtpaTxtYXRlcmlhbHMubGVuZ3RoO2lpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXRoPXVybCttYXRlcmlhbHNbaWldW1wicGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YocGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqW1wiY29tcG9uZW50c1wiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBjb21wb25lbnRzOkFycmF5PGFueT49b2JqW1wiY29tcG9uZW50c1wiXTtcclxuICAgICAgICAgICAgaWYoY29tcG9uZW50cy5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpMCA9IDA7IGkwIDwgY29tcG9uZW50cy5sZW5ndGg7IGkwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcCA9IGNvbXBvbmVudHNbaTBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbXBbXCJhdmF0YXJcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXBhdGg9dXJsK2NvbXBbXCJhdmF0YXJcIl1bXCJwYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YoYXBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKGFwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihjb21wW1wibGF5ZXJzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheWVyczpBcnJheTxhbnk+PWNvbXBbXCJsYXllcnNcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkxID0gMDsgaTEgPCBsYXllcnMubGVuZ3RoOyBpMSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXIgPSBsYXllcnNbaTFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlczpBcnJheTxhbnk+PWxheWVyW1wic3RhdGVzXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpMiA9IDA7IGkyIDwgc3RhdGVzLmxlbmd0aDsgaTIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHN0YXRlc1tpMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsaXBQYXRoPXVybCtzdGF0ZVtcImNsaXBQYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihjbGlwUGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChjbGlwUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjaGlsZDpBcnJheTxhbnk+PW9ialtcImNoaWxkXCJdO1xyXG4gICAgICAgIGlmKGNoaWxkIT1udWxsICYmIGNoaWxkLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxjaGlsZC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX190aVF1VXJsKGNoaWxkW2ldLHVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9cclxuICAgIHB1YmxpYyBjbGVhclJlcyh1cmw6c3RyaW5nKXtcclxuICAgICAgICBpZighdXJsIHx8IHVybC5pbmRleE9mKFwiL1wiKTwwKXJldHVybjtcclxuICAgICAgICB2YXIgdTA9dXJsLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICB2YXIgdTE9dXJsLnJlcGxhY2UodTBbdTAubGVuZ3RoLTFdLFwiXCIpO1xyXG5cclxuICAgICAgICB2YXIgdXJscz1bXTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBMYXlhLkxvYWRlci5sb2FkZWRNYXApIHtcclxuICAgICAgICAgICAgaWYgKExheWEuTG9hZGVyLmxvYWRlZE1hcC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9hZFVybDpzdHJpbmc9IGtleTtcclxuICAgICAgICAgICAgICAgIGlmKGxvYWRVcmwuaW5kZXhPZih1MSk+PTAgfHwgbG9hZFVybC5pbmRleE9mKFwicmVzL21hdHMvXCIpPj0wICl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodXJscy5pbmRleE9mKGxvYWRVcmwpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmxzLnB1c2gobG9hZFVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVybHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gdXJsc1tpXTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8v5qC55o2u6LWE5rqQ6Lev5b6E6I635Y+W6LWE5rqQ77yIUmVzb3VyY2XkuLrmnZDotKjjgIHotLTlm77jgIHnvZHmoLznrYnnmoTln7rnsbvvvIlcclxuICAgICAgICAgICAgICAgIHZhciByZXM6TGF5YS5SZXNvdXJjZT1MYXlhLmxvYWRlci5nZXRSZXModXJsKTtcclxuICAgICAgICAgICAgICAgIGlmKCFyZXMubG9jayl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICAvL+i1hOa6kOmHiuaUvlxyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWxlYXNlUmVzb3VyY2UodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIExheWEubG9hZGVyLmNsZWFyUmVzKHVybCk7XHJcbiAgICAgICAgICAgICAgICAvL0xheWEubG9hZGVyLmNsZWFyVW5Mb2FkZWQoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGlkUmVzb3VyY2VzTWFwTG9jayh0YXJnZXQsaXNMb2NrPXRydWUpe1xyXG4gICAgICAgIGlmKHRhcmdldD09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIG9iakxpc3Q9V215VXRpbHMzRC5nZXRDaGlsZHJlbkNvbXBvbmVudCh0YXJnZXQsTGF5YS5SZW5kZXJhYmxlU3ByaXRlM0QpO1xyXG4gICAgICAgIHZhciBrSWRzPVtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gb2JqTGlzdCl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9b2JqTGlzdFtpXTtcclxuICAgICAgICAgICAgV215TG9hZDNkLl9sb29wTG9jayhvYmosa0lkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciByTWFwPUxheWEuUmVzb3VyY2VbXCJfaWRSZXNvdXJjZXNNYXBcIl07XHJcbiAgICAgICAgZm9yICh2YXIgayBpbiBrSWRzKXtcclxuICAgICAgICAgICAgY29uc3QgbyA9a0lkc1trXTtcclxuICAgICAgICAgICAgdmFyIHJlcz1yTWFwW29dO1xyXG4gICAgICAgICAgICByZXMubG9jaz1pc0xvY2s7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9sb29wTG9jayhvYmosYXJyKXtcclxuICAgICAgICBXbXlMb2FkM2QuX01lc2gob2JqLGFycik7XHJcbiAgICAgICAgV215TG9hZDNkLl9NYXRlcmlhbHMob2JqLGFycik7XHJcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBvID0gb2JqW2tdO1xyXG4gICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5CYXNlUmVuZGVyKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fbG9vcExvY2sobyxhcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9NZXNoKG9iaixhcnIpe1xyXG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcclxuICAgICAgICAgICAgY29uc3QgbyA9IG9ialtrXTtcclxuICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuTWVzaCl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8sYXJyKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIF92ZXJ0ZXhCdWZmZXJzPW9bXCJfdmVydGV4QnVmZmVyc1wiXTtcclxuICAgICAgICAgICAgICAgIGlmKF92ZXJ0ZXhCdWZmZXJzKXtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGswIGluIF92ZXJ0ZXhCdWZmZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG8wID0gX3ZlcnRleEJ1ZmZlcnNbazBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvMCBpbnN0YW5jZW9mIExheWEuVmVydGV4QnVmZmVyM0Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgV215TG9hZDNkLl9nZXRSZXNvdXJjZXNNYXBJZChvMCxhcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGsxIGluIG8pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvMSA9IG9bazFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG8xIGluc3RhbmNlb2YgTGF5YS5JbmRleEJ1ZmZlcjNEKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgV215TG9hZDNkLl9nZXRSZXNvdXJjZXNNYXBJZChvMSxhcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfTWF0ZXJpYWxzKG9iaixhcnIpe1xyXG4gICAgICAgIHZhciBfbWF0ZXJpYWxzPW9ialtcIl9tYXRlcmlhbHNcIl07XHJcbiAgICAgICAgaWYoX21hdGVyaWFscyl7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgayBpbiBfbWF0ZXJpYWxzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvID0gX21hdGVyaWFsc1trXTtcclxuICAgICAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLkJhc2VNYXRlcmlhbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgV215TG9hZDNkLl9nZXRSZXNvdXJjZXNNYXBJZChvLGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgV215TG9hZDNkLl9TaGFkZXIobyxhcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fU2hhZGVyRGF0YShvLGFycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgc3RhdGljIF9TaGFkZXIob2JqLGFycil7XHJcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBvID0gb2JqW2tdO1xyXG4gICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5TaGFkZXIzRCl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2dldFJlc291cmNlc01hcElkKG8sYXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX1NoYWRlckRhdGEob2JqLGFycil7XHJcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iaikge1xyXG4gICAgICAgICAgICBjb25zdCBvID0gb2JqW2tdO1xyXG4gICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5TaGFkZXJEYXRhKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fQmFzZVRleHR1cmUob1tcIl9kYXRhXCJdLGFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX0Jhc2VUZXh0dXJlKG9iaixhcnIpe1xyXG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcclxuICAgICAgICAgICAgY29uc3QgbyA9IG9ialtrXTtcclxuICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuQmFzZVRleHR1cmUpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9nZXRSZXNvdXJjZXNNYXBJZChvLGFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2dldFJlc291cmNlc01hcElkKG9iaixhcnIpe1xyXG4gICAgICAgIHZhciByTWFwPUxheWEuUmVzb3VyY2VbXCJfaWRSZXNvdXJjZXNNYXBcIl07XHJcbiAgICAgICAgZm9yICh2YXIgayBpbiByTWFwKXtcclxuICAgICAgICAgICAgdmFyIHJlcz1yTWFwW2tdO1xyXG4gICAgICAgICAgICBpZihvYmo9PXJlcyl7XHJcbiAgICAgICAgICAgICAgICBpZihhcnIuaW5kZXhPZihrKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBXbXlMb2FkTWF0c3tcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteUxvYWRNYXRze1xyXG4gICAgICAgIGlmKFdteUxvYWRNYXRzLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215TG9hZE1hdHMuX3RoaXM9bmV3IFdteUxvYWRNYXRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlMb2FkTWF0cy5fdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jYWxsYmFja09rOkxheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9ubG9hZDNkKHVybExpc3Q6QXJyYXk8c3RyaW5nPixjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmxMaXN0LExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25VcmxBcnJPayxbdXJsTGlzdF0pKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbWF0c1VybEFycjpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgcHJpdmF0ZSBfbWF0T2s9ZmFsc2U7XHJcbiAgICBwcml2YXRlIF9tYXROdW09MDtcclxuICAgIHByaXZhdGUgX21hdFA9MDtcclxuICAgIHByaXZhdGUgX21hdFAyPTA7XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uVXJsQXJyT2sodXJsTGlzdDpBcnJheTxzdHJpbmc+KXtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHVybExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciB1cmw9dXJsTGlzdFtpXTtcclxuICAgICAgICAgICAgLy8gdmFyIHR4dD1MYXlhLmxvYWRlci5nZXRSZXModXJsKTtcclxuICAgICAgICAgICAgLy8gdmFyIGpzT2JqPUpTT04ucGFyc2UodHh0KTtcclxuICAgICAgICAgICAgdmFyIGpzT2JqPUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFycj11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICB2YXIgbWF0c1VybD11cmwucmVwbGFjZShhcnJbYXJyLmxlbmd0aC0xXSxcIlwiKTtcclxuICAgICAgICAgICAgdmFyIGFycmF5OkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheT1qc09ialtcIm1hdHNcIl07XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhcnJheS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IGFycmF5W2pdO1xyXG4gICAgICAgICAgICAgICAgaWYob2JqW1widGFyZ2V0TmFtZVwiXT09XCJcIiljb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXRVcmw9bWF0c1VybCtvYmpbXCJtYXRVcmxcIl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRzVXJsQXJyLnB1c2gobWF0VXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLl9tYXRzVXJsQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5fbWF0c1VybEFycltpXTtcclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTWF0QXJyT2spLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25NYXRBcnJQKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX19vbk1hdEFyclAocCl7XHJcbiAgICAgICAgdmFyIHBOdW09cCoodGhpcy5fbWF0TnVtKzEpO1xyXG4gICAgICAgIGlmKHBOdW0+dGhpcy5fbWF0UCl0aGlzLl9tYXRQPXBOdW07XHJcbiAgICAgICAgdGhpcy5fbWF0UDI9KHRoaXMuX21hdFAvdGhpcy5fbWF0c1VybEFyci5sZW5ndGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3RoaXMuX21hdFAyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX19vbk1hdEFyck9rKCl7XHJcbiAgICAgICAgdGhpcy5fbWF0TnVtKz0xO1xyXG4gICAgICAgIGlmKHRoaXMuX21hdE51bT49dGhpcy5fbWF0c1VybEFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxufSIsImltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi9XbXlVdGlsczNEXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215U2NyaXB0M0QgZXh0ZW5kcyBMYXlhLlNjcmlwdDNEIHtcclxuICAgIHB1YmxpYyBkZWwoZGVzdHJveUNoaWxkOiBib29sZWFuID0gdHJ1ZSl7XHJcbiAgICAgICAgdGhpcy5vd25lcjNELmRlc3Ryb3koZGVzdHJveUNoaWxkKTtcclxuICAgIH1cclxuXHRwdWJsaWMgb25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub3duZXIzRD1udWxsO1xyXG4gICAgICAgIHRoaXMuc2NlbmUzRD1udWxsO1xyXG4gICAgICAgIHRoaXMub25EZWwoKTtcclxuICAgIH1cclxuICAgIFxyXG5cdHB1YmxpYyBvbkRlbCgpOiB2b2lkIHtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBvd25lcjNEOkxheWEuU3ByaXRlM0Q7XHJcbiAgICBwcml2YXRlIF9sb2NhbFNjYWxlOkxheWEuVmVjdG9yMztcclxuXHJcbiAgICBwdWJsaWMgc2NlbmUzRDpMYXlhLlNjZW5lM0Q7XHJcblxyXG5cdHB1YmxpYyBfb25BZGRlZCgpIHtcclxuICAgICAgICBzdXBlci5fb25BZGRlZCgpO1xyXG4gICAgICAgIHRoaXMub3duZXIzRD10aGlzLm93bmVyIGFzIExheWEuU3ByaXRlM0Q7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvY2FsU2NhbGU9bmV3IExheWEuVmVjdG9yMygwLCAwLCAwKTtcclxuICAgICAgICBpZih0aGlzLm93bmVyM0QudHJhbnNmb3JtKXtcclxuICAgICAgICAgICAgdGhpcy5fbG9jYWxTY2FsZT10aGlzLm93bmVyM0QudHJhbnNmb3JtLmxvY2FsU2NhbGUuY2xvbmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zY2VuZTNEPXRoaXMub3duZXIzRC5zY2VuZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy/mmK/lkKblj6/op4FcclxuICAgIHB1YmxpYyBzZXRTaG93KHY6Ym9vbGVhbil7XHJcbiAgICAgICAgdGhpcy5vd25lcjNELnRyYW5zZm9ybS5sb2NhbFNjYWxlID0gIXY/IG5ldyBMYXlhLlZlY3RvcjMoMCwgMCwgMCk6IHRoaXMuX2xvY2FsU2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9cclxuICAgIHB1YmxpYyBnZXRPYmozZFVybCh0YXJnZXQsdXJsOnN0cmluZyk6YW55e1xyXG4gICAgICAgIHJldHVybiBXbXlVdGlsczNELmdldE9iajNkVXJsKHRhcmdldCx1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v6K6+572u6Zi05b2xXHJcbiAgICBwdWJsaWMgb25TZXRTaGFkb3coaXNDYXN0U2hhZG93LGlzUmVjZWl2ZVNoYWRvdylcclxuICAgIHtcclxuICAgICAgICBXbXlVdGlsczNELm9uU2V0U2hhZG93KHRoaXMub3duZXIzRCxpc0Nhc3RTaGFkb3csaXNSZWNlaXZlU2hhZG93KTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBXbXlfTG9hZF9NYWcgfSBmcm9tIFwiLi4vV215X0xvYWRfTWFnXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215VXRpbHMzRHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2QodGFyZ2V0LG9iak5hbWU6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0Lm5hbWU9PW9iak5hbWUpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG86TGF5YS5TcHJpdGUzRCA9IHRhcmdldC5fY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChvLl9jaGlsZHJlbi5sZW5ndGggPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoby5uYW1lPT1vYmpOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBPYmo9dGhpcy5nZXRPYmozZChvLG9iak5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcE9iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBPYmo7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmozZFVybCh0YXJnZXQsdXJsOnN0cmluZyl7XHJcbiAgICAgICAgdmFyIGFyclVybD11cmwuc3BsaXQoJy8nKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0T2JqQXJyVXJsKHRhcmdldCxhcnJVcmwpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBfZ2V0T2JqQXJyVXJsKHRhcmdldCx1cmxBcnI6QXJyYXk8c3RyaW5nPixpZD0wKXtcclxuICAgICAgICB2YXIgX3RhcmdldDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZihfdGFyZ2V0PT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBuYT11cmxBcnJbaWRdO1xyXG4gICAgICAgIHZhciB0YXJnZXRPYmo9X3RhcmdldC5nZXRDaGlsZEJ5TmFtZShuYSk7XHJcbiAgICAgICAgaWYodGFyZ2V0T2JqPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKGlkPj11cmxBcnIubGVuZ3RoLTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0YXJnZXRPYmo9dGhpcy5fZ2V0T2JqQXJyVXJsKHRhcmdldE9iaix1cmxBcnIsKytpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LGNsYXM6YW55LGFycj8pOkFycmF5PGFueT57XHJcbiAgICAgICAgaWYoYXJyPT1udWxsKWFycj1bXTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG9iaj10YXJnZXQuZ2V0Q29tcG9uZW50KGNsYXMpO1xyXG4gICAgICAgIGlmKG9iaj09bnVsbCl7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIGNsYXMpe1xyXG4gICAgICAgICAgICAgICAgb2JqPXRhcmdldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmohPW51bGwgJiYgYXJyLmluZGV4T2Yob2JqKTwwKXtcclxuICAgICAgICAgICAgYXJyLnB1c2gob2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0Ll9jaGlsZHJlbj09bnVsbCkgcmV0dXJuIGFycjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvOkxheWEuU3ByaXRlM0QgPSB0YXJnZXQuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmdldENoaWxkcmVuQ29tcG9uZW50KG8sY2xhcyxhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFudGlhdGUodGFyZ2V0LHRhcmdldE5hbWU/OnN0cmluZyk6YW55e1xyXG4gICAgICAgIGlmKHRhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgX3RhcmdldDpMYXlhLlNwcml0ZTNEPW51bGw7XHJcbiAgICAgICAgaWYodGFyZ2V0TmFtZSl7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wT2JqPVdteVV0aWxzM0QuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpO1xyXG4gICAgICAgICAgICBpZih0ZW1wT2JqKXtcclxuICAgICAgICAgICAgICAgIF90YXJnZXQ9TGF5YS5TcHJpdGUzRC5pbnN0YW50aWF0ZSh0ZW1wT2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBfdGFyZ2V0PUxheWEuU3ByaXRlM0QuaW5zdGFudGlhdGUodGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF90YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmv4DmtLvpmLTlvbHjgIJcclxuICAgICAqIEBwYXJhbVx0ZGlyZWN0aW9uTGlnaHQg55u057q/5YWJXHJcbiAgICAgKiBAcGFyYW1cdHNoYWRvd1Jlc29sdXRpb24g55Sf5oiQ6Zi05b2x6LS05Zu+5bC65a+4XHJcbiAgICAgKiBAcGFyYW1cdHNoYWRvd1BDRlR5cGUg5qih57OK562J57qnLOi2iuWkp+i2iumrmCzmm7TogJfmgKfog71cclxuICAgICAqIEBwYXJhbVx0c2hhZG93RGlzdGFuY2Ug5Y+v6KeB6Zi05b2x6Led56a7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgb25TZXREaXJlY3Rpb25MaWdodChkaXJlY3Rpb25MaWdodCxzaGFkb3dSZXNvbHV0aW9uPTUxMixzaGFkb3dQQ0ZUeXBlPTEsc2hhZG93RGlzdGFuY2U6bnVtYmVyPTE1LGlzU2hhZG93OmJvb2xlYW49dHJ1ZSl7XHJcbiAgICAgICAgaWYoZGlyZWN0aW9uTGlnaHQgaW5zdGFuY2VvZiBMYXlhLkRpcmVjdGlvbkxpZ2h0KXtcclxuICAgICAgICAgICAgLy/nga/lhYnlvIDlkK/pmLTlvbFcclxuICAgICAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIC8v5Y+v6KeB6Zi05b2x6Led56a7XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd0Rpc3RhbmNlID0gc2hhZG93RGlzdGFuY2U7XHJcbiAgICAgICAgICAgIC8v55Sf5oiQ6Zi05b2x6LS05Zu+5bC65a+4XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd1Jlc29sdXRpb24gPSBzaGFkb3dSZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dQU1NNQ291bnQ9MTtcclxuICAgICAgICAgICAgLy/mqKHns4rnrYnnuqcs6LaK5aSn6LaK6auYLOabtOiAl+aAp+iDvVxyXG4gICAgICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dQQ0ZUeXBlID0gc2hhZG93UENGVHlwZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIOa/gOa0u+mYtOW9seOAglxyXG4gICAgICogQHBhcmFtXHR0YXJnZXQgXHJcbiAgICAgKiBAcGFyYW1cdHR5cGUgMOaOpeaUtumYtOW9sSwx5Lqn55Sf6Zi05b2xLDLmjqXmlLbpmLTlvbHkuqfnlJ/pmLTlvbFcclxuICAgICAqIEBwYXJhbVx0aXNTaGFkb3cg5piv5ZCm6Zi05b2xXHJcbiAgICAgKiBAcGFyYW1cdGlzQ2hpbGRyZW4g5piv5ZCm5a2Q5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgb25DYXN0U2hhZG93KHRhcmdldCx0eXBlPTAsaXNTaGFkb3c9dHJ1ZSxpc0NoaWxkcmVuPXRydWUpe1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgdmFyIG1zM0Q9KHRhcmdldCBhcyBMYXlhLk1lc2hTcHJpdGUzRCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGU9PTApe1xyXG4gICAgICAgICAgICAgICAgLy/mjqXmlLbpmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHR5cGU9PTEpe1xyXG4gICAgICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLmNhc3RTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHR5cGU9PTIpe1xyXG4gICAgICAgICAgICAgICAgLy/mjqXmlLbpmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgdmFyIHNtczNkPSh0YXJnZXQgYXMgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKTtcclxuICAgICAgICAgICAgaWYodHlwZT09MCl7XHJcbiAgICAgICAgICAgICAgICBzbXMzZC5za2lubmVkTWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHR5cGU9PTEpe1xyXG4gICAgICAgICAgICAgICAgc21zM2Quc2tpbm5lZE1lc2hSZW5kZXJlci5jYXN0U2hhZG93PWlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihpc0NoaWxkcmVuKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubnVtQ2hpbGRyZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHRhcmdldC5nZXRDaGlsZEF0KGkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNhc3RTaGFkb3cob2JqLHR5cGUsaXNTaGFkb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uU2V0U2hhZG93KHRhcmdldCxpc0Nhc3RTaGFkb3csaXNSZWNlaXZlU2hhZG93KXtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLk1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgIHRhcmdldC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzQ2FzdFNoYWRvdztcclxuICAgICAgICAgICAgLy/mjqXmlLbpmLTlvbFcclxuICAgICAgICAgICAgdGFyZ2V0Lm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNSZWNlaXZlU2hhZG93O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgIHRhcmdldC5za2lubmVkTWVzaFJlbmRlcmVyLmNhc3RTaGFkb3cgPSBpc0Nhc3RTaGFkb3c7XHJcbiAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgIHRhcmdldC5za2lubmVkTWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1JlY2VpdmVTaGFkb3c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJnYjJoZXgocixnLGIpe1xyXG4gICAgICAgIHZhciBfaGV4PVwiI1wiICsgdGhpcy5oZXgocikgK3RoaXMuIGhleChnKSArIHRoaXMuaGV4KGIpO1xyXG4gICAgICAgIHJldHVybiBfaGV4LnRvVXBwZXJDYXNlKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZXgoeCl7XHJcbiAgICAgICAgeD10aGlzLm9uTnVtVG8oeCk7XHJcbiAgICAgICAgcmV0dXJuIChcIjBcIiArIHBhcnNlSW50KHgpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaGV4MnJnYihoZXg6c3RyaW5nKSB7XHJcbiAgICAgICAgLy8gRXhwYW5kIHNob3J0aGFuZCBmb3JtIChlLmcuIFwiMDNGXCIpIHRvIGZ1bGwgZm9ybSAoZS5nLiBcIjAwMzNGRlwiKVxyXG4gICAgICAgIHZhciBzaG9ydGhhbmRSZWdleCA9IC9eIz8oW2EtZlxcZF0pKFthLWZcXGRdKShbYS1mXFxkXSkkL2k7XHJcbiAgICAgICAgaGV4ID0gaGV4LnJlcGxhY2Uoc2hvcnRoYW5kUmVnZXgsIGZ1bmN0aW9uKG0sIHIsIGcsIGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHIgKyByICsgZyArIGcgKyBiICsgYjtcclxuICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgIHZhciByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0ID8ge1xyXG4gICAgICAgICAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcclxuICAgICAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXHJcbiAgICAgICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXHJcbiAgICAgICAgfSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTnVtVG8obil7XHJcblx0XHRpZigobitcIlwiKS5pbmRleE9mKFwiLlwiKT49MCl7XHJcblx0XHQgICAgbj1wYXJzZUZsb2F0KG4udG9GaXhlZCgyKSk7XHJcbiAgICAgICAgfVxyXG5cdFx0cmV0dXJuIG47XHJcblx0fVxyXG5cclxuICAgIFxyXG4gICBwdWJsaWMgc3RhdGljIGxlcnBGKGE6bnVtYmVyLCBiOm51bWJlciwgczpudW1iZXIpOm51bWJlcntcclxuICAgICAgICByZXR1cm4gKGEgKyAoYiAtIGEpICogcyk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJheUNhc3RBbGwoY2FtOkxheWEuQ2FtZXJhLCB2aWV3cG9ydFBvaW50OkxheWEuVmVjdG9yMiwgcmF5PzpMYXlhLlJheSwgY29sbGlzb25Hcm91cD86IG51bWJlciwgY29sbGlzaW9uTWFzaz86IG51bWJlcil7XHJcbiAgICAgICAgdmFyIF9vdXRIaXRBbGxJbmZvID0gIG5ldyBBcnJheTxMYXlhLkhpdFJlc3VsdD4oKTtcclxuICAgICAgICB2YXIgX3JheSA9cmF5O1xyXG4gICAgICAgIGlmKCFfcmF5KXtcclxuICAgICAgICAgICAgX3JheSA9IG5ldyBMYXlhLlJheShuZXcgTGF5YS5WZWN0b3IzKCksIG5ldyBMYXlhLlZlY3RvcjMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v5LuO5bGP5bmV56m66Ze055Sf5oiQ5bCE57q/XHJcbiAgICAgICAgdmFyIF9wb2ludCA9IHZpZXdwb3J0UG9pbnQuY2xvbmUoKTtcclxuICAgICAgICBjYW0udmlld3BvcnRQb2ludFRvUmF5KF9wb2ludCwgX3JheSk7XHJcbiAgICAgICAgLy/lsITnur/mo4DmtYvojrflj5bmiYDmnInmo4DmtYvnorDmkp7liLDnmoTniankvZNcclxuICAgICAgICBpZihjYW0uc2NlbmUhPW51bGwgJiYgY2FtLnNjZW5lLnBoeXNpY3NTaW11bGF0aW9uIT1udWxsKXtcclxuICAgICAgICAgICAgY2FtLnNjZW5lLnBoeXNpY3NTaW11bGF0aW9uLnJheUNhc3RBbGwoX3JheSwgX291dEhpdEFsbEluZm8sIDEwMDAwLCBjb2xsaXNvbkdyb3VwLCBjb2xsaXNpb25NYXNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF9vdXRIaXRBbGxJbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIC8v6Led56a7XHJcblx0cHVibGljIHN0YXRpYyBEaXN0YW5jZShhOkxheWEuVmVjdG9yMixiOkxheWEuVmVjdG9yMik6bnVtYmVyIHtcclxuXHRcdHZhciBkeCA9IE1hdGguYWJzKGEueCAtIGIueCk7XHJcblx0XHR2YXIgZHkgPSBNYXRoLmFicyhhLnkgLSBiLnkpO1xyXG5cdFx0dmFyIGQ9TWF0aC5zcXJ0KE1hdGgucG93KGR4LCAyKSArIE1hdGgucG93KGR5LCAyKSk7XHJcblx0XHRkPXBhcnNlRmxvYXQoZC50b0ZpeGVkKDIpKTtcclxuXHRcdHJldHVybiBkO1xyXG4gICAgfVxyXG4gICAgXHJcblxyXG5cclxuICAgIC8v5Yqo55S7LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pUGxheSh0YXJnZXQsdGFyZ2V0TmFtZSxhbmlOYW1lLCBub3JtYWxpemVkVGltZT86bnVtYmVyLCBjb21wbGV0ZUV2ZW50PzpMYXlhLkhhbmRsZXIsIHBhcmFtcz86QXJyYXk8YW55PiwgbGF5ZXJJbmRleD86IG51bWJlcik6TGF5YS5BbmltYXRvcntcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYodGFyZ2V0TmFtZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRhcmdldDNkPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldDNkPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgaWYodGFyZ2V0M2RfYW5pPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKGNvbXBsZXRlRXZlbnQpe1xyXG4gICAgICAgICAgICBXbXlVdGlsczNELmFuaUFkZEV2ZW50RnVuKHRhcmdldDNkLG51bGwsYW5pTmFtZSwtMSxjb21wbGV0ZUV2ZW50LHRydWUscGFyYW1zLGxheWVySW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXQzZF9hbmkucGxheShhbmlOYW1lLGxheWVySW5kZXgsbm9ybWFsaXplZFRpbWUpO1xyXG4gICAgICAgIHJldHVybiB0YXJnZXQzZF9hbmk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmlBZGRFdmVudEZ1bih0YXJnZXQsdGFyZ2V0TmFtZSxhbmlOYW1lLHRpbWU6bnVtYmVyLGNhbGxiYWNrOkxheWEuSGFuZGxlcixpc0V2ZW50T25lPXRydWUscGFyYW1zPzpBcnJheTxhbnk+LGxheWVySW5kZXg/OiBudW1iZXIpe1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgV215VXRpbHMzRC5fYW5pQWRkRXZlbnQodGFyZ2V0M2RfYW5pLG51bGwsYW5pTmFtZSxcIl93bXlfYW5pX2NhbGxiYWNrXCIsdGltZSxwYXJhbXMsbGF5ZXJJbmRleCk7XHJcbiAgICAgICAgdmFyIHdhZT10YXJnZXQzZC5nZXRDb21wb25lbnQoX19XbXlBbmlFdmVudCkgYXMgX19XbXlBbmlFdmVudDtcclxuICAgICAgICBpZighd2FlKXtcclxuICAgICAgICAgICAgd2FlPXRhcmdldDNkLmFkZENvbXBvbmVudChfX1dteUFuaUV2ZW50KSBhcyBfX1dteUFuaUV2ZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY2FsbGJhY2tOYW1lPVwid215X1wiK2NhbGxiYWNrLmNhbGxlci5pZCthbmlOYW1lK3RpbWU7XHJcbiAgICAgICAgaWYoaXNFdmVudE9uZSl7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2Uub25jZShjYWxsYmFja05hbWUsdGhpcywoX2NhbGxiYWNrTmFtZSxfY2FsbGJhY2sscCk9PntcclxuICAgICAgICAgICAgICAgIF9jYWxsYmFjay5ydW5XaXRoKHApO1xyXG4gICAgICAgICAgICAgICAgd2FlLmRlbENhbGxiYWNrKF9jYWxsYmFja05hbWUpO1xyXG4gICAgICAgICAgICB9LFtjYWxsYmFja05hbWUsY2FsbGJhY2tdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5vbihjYWxsYmFja05hbWUsdGhpcywoX2NhbGxiYWNrTmFtZSxfY2FsbGJhY2sscCk9PntcclxuICAgICAgICAgICAgICAgIF9jYWxsYmFjay5ydW5XaXRoKHApO1xyXG4gICAgICAgICAgICB9LFtjYWxsYmFja05hbWUsY2FsbGJhY2tdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2FlLmFkZENhbGxiYWNrKGNhbGxiYWNrTmFtZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pRGVsRXZlbnRGdW4odGFyZ2V0LHRhcmdldE5hbWUsY2FsbGJhY2s6TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYodGFyZ2V0TmFtZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRhcmdldDNkPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldDNkPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgaWYodGFyZ2V0M2RfYW5pPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB3YWU9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KF9fV215QW5pRXZlbnQpIGFzIF9fV215QW5pRXZlbnQ7XHJcbiAgICAgICAgaWYod2FlKXtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrTmFtZT1cIndteV9cIitjYWxsYmFjay5jYWxsZXIubmFtZStjYWxsYmFjay5tZXRob2QudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5vbihjYWxsYmFja05hbWUsY2FsbGJhY2suY2FsbGVyLGNhbGxiYWNrLm1ldGhvZCk7XHJcbiAgICAgICAgICAgIHdhZS5kZWxDYWxsYmFjayhjYWxsYmFja05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIF9hbmlBZGRFdmVudCh0YXJnZXQsdGFyZ2V0TmFtZSxhbmlOYW1lLGV2ZW50TmFtZTpzdHJpbmcsdGltZTpudW1iZXIscGFyYW1zPzpBcnJheTxhbnk+LGxheWVySW5kZXg/OiBudW1iZXIpOkxheWEuQW5pbWF0b3J7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9bnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPW51bGw7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5TcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHRhcmdldDNkPXRhcmdldDtcclxuICAgICAgICAgICAgaWYodGFyZ2V0TmFtZSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRhcmdldDNkPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB0YXJnZXQzZF9hbmk9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5BbmltYXRvcil7XHJcbiAgICAgICAgICAgIHRhcmdldDNkX2FuaT10YXJnZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgYW5pbWF0b3JTdGF0ZTpMYXlhLkFuaW1hdG9yU3RhdGU9dGFyZ2V0M2RfYW5pLmdldENvbnRyb2xsZXJMYXllcihsYXllckluZGV4KS5fc3RhdGVzTWFwW2FuaU5hbWVdO1xyXG4gICAgICAgIGlmKGFuaW1hdG9yU3RhdGU9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGlzQWRkPXRydWU7XHJcbiAgICAgICAgdmFyIGV2ZW50cz1hbmltYXRvclN0YXRlLl9jbGlwLl9ldmVudHM7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZXZlbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnQ6TGF5YS5BbmltYXRpb25FdmVudCA9IGV2ZW50c1trZXldO1xyXG4gICAgICAgICAgICAgICAgaWYoZXZlbnQuZXZlbnROYW1lPT1ldmVudE5hbWUgJiYgYW5pRXZlbnQudGltZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNBZGQ9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaXNBZGQpe1xyXG4gICAgICAgICAgICB2YXIgYW5pRXZlbnQ9bmV3IExheWEuQW5pbWF0aW9uRXZlbnQoKTtcclxuICAgICAgICAgICAgYW5pRXZlbnQuZXZlbnROYW1lPWV2ZW50TmFtZTtcclxuICAgICAgICAgICAgdmFyIGNsaXBEdXJhdGlvbj1hbmltYXRvclN0YXRlLl9jbGlwLl9kdXJhdGlvbjtcclxuICAgICAgICAgICAgaWYodGltZT09LTEpe1xyXG4gICAgICAgICAgICAgICAgdGltZT1jbGlwRHVyYXRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYW5pRXZlbnQudGltZT0gdGltZSAvIGNsaXBEdXJhdGlvbjtcclxuICAgICAgICAgICAgYW5pRXZlbnQucGFyYW1zPXBhcmFtcztcclxuICAgICAgICAgICAgYW5pbWF0b3JTdGF0ZS5fY2xpcC5hZGRFdmVudChhbmlFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQzZF9hbmk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmlBZGRTY3JpcHQodGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSxzY3JpcHQ/OmFueSxsYXllckluZGV4PzogbnVtYmVyKTpMYXlhLkFuaW1hdG9yU3RhdGV7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgYW5pbWF0b3JTdGF0ZTpMYXlhLkFuaW1hdG9yU3RhdGU9dGFyZ2V0M2RfYW5pLmdldENvbnRyb2xsZXJMYXllcihsYXllckluZGV4KS5fc3RhdGVzTWFwW2FuaU5hbWVdO1xyXG4gICAgICAgIGlmKGFuaW1hdG9yU3RhdGU9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgYW5pbWF0b3JTdGF0ZS5hZGRTY3JpcHQoc2NyaXB0KTtcclxuICAgICAgICByZXR1cm4gYW5pbWF0b3JTdGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5cclxuXHJcbmNsYXNzIF9fV215QW5pRXZlbnQgZXh0ZW5kcyBMYXlhLlNjcmlwdDNEIHtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrPVtdO1xyXG4gICAgcHVibGljIGFkZENhbGxiYWNrKGNhbGxiYWNrTmFtZSl7XHJcbiAgICAgICAgdmFyIGluZGV4SWQ9dGhpcy5fY2FsbGJhY2suaW5kZXhPZihjYWxsYmFja05hbWUpO1xyXG4gICAgICAgIGlmKGluZGV4SWQ8MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrLnB1c2goY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZGVsQ2FsbGJhY2soY2FsbGJhY2tOYW1lKXtcclxuICAgICAgICB2YXIgaW5kZXhJZD10aGlzLl9jYWxsYmFjay5pbmRleE9mKGNhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgaWYoaW5kZXhJZD49MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrLnNwbGljZShpbmRleElkLDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBfd215X2FuaV9jYWxsYmFjayhwYXJhbXM/OkFycmF5PGFueT4pe1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY2FsbGJhY2subGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2tOYW1lID0gdGhpcy5fY2FsbGJhY2tbaV07XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2UuZXZlbnQoY2FsbGJhY2tOYW1lLHBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tIFwiLi4vV215U2NyaXB0M0RcIjtcclxuaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuLi9XbXlVdGlsczNEXCI7XHJcbmltcG9ydCB7IFdteVV0aWxzIH0gZnJvbSBcIi4uLy4uL1dteVV0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlDNERWZXRleEFuaW1hdG9yIGV4dGVuZHMgV215U2NyaXB0M0Qge1xyXG4gICAgX2FuaXI6TGF5YS5BbmltYXRvcjtcclxuICAgIF92ZXJ0aWNlc09iajpMYXlhLlNwcml0ZTNEO1xyXG4gICAgb25Bd2FrZSgpe1xyXG4gICAgICAgIHRoaXMuX2FuaXI9dGhpcy5vd25lcjNELmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmICh0aGlzLl9hbmlyID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHRoaXMub3duZXIzRC5vbihcImFuaV9wbGF5XCIsdGhpcyx0aGlzLm9uUGxheSk7XHJcblxyXG4gICAgICAgIHZhciBvYmpzPXRoaXMuX2FuaXIuX3JlbmRlcmFibGVTcHJpdGVzO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdmV0ZXhUPW51bGw7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lc2hPYmogPSBvYmpzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1lc2hPYmoubnVtQ2hpbGRyZW47IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY09iaiA9IG1lc2hPYmouZ2V0Q2hpbGRBdChpKTtcclxuICAgICAgICAgICAgICAgIGlmKGNPYmoubmFtZS5pbmRleE9mKFwiVmV0ZXhfSGFuZGxlXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB2ZXRleFQ9Y09iajtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih2ZXRleFQhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmVydGljZXNPYmo9dmV0ZXhUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vbWVzaE9iai5fcmVuZGVyLmVuYWJsZT1mYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZlcnRpY2VzT2JqID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub25Jbml0VmVydGV4KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb25QbGF5KG49XCJwbGF5XCIsdD0wLHNwZWVkPTEpe1xyXG4gICAgLy8gICAgIHZhciBvYmpzPXRoaXMuX2FuaXIuX3JlbmRlcmFibGVTcHJpdGVzO1xyXG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xyXG4gICAgLy8gICAgICAgICBjb25zdCBtZXNoT2JqID0gb2Jqc1tpXTtcclxuICAgIC8vICAgICAgICAgLy9tZXNoT2JqLl9yZW5kZXIuZW5hYmxlPXRydWU7XHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICB0aGlzLl9hbmlyLnBsYXkobix1bmRlZmluZWQsdCk7XHJcbiAgICAvLyAgICAgdGhpcy5fYW5pci5zcGVlZD1zcGVlZDtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvL+mhtueCuS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBfbWVzaDpMYXlhLk1lc2hGaWx0ZXI7XHJcbiAgICBfc2hhcmVkTWVzaDphbnk7XHJcblxyXG4gICAgX3ZlcnRleEJ1ZmZlcnM6QXJyYXk8TGF5YS5WZXJ0ZXhCdWZmZXIzRD47XHJcbiAgICBfdmVydGV4QXJyYXk6QXJyYXk8TGF5YS5UcmFuc2Zvcm0zRD47XHJcbiAgICBfbU1hcHBpbmdWZXRleEluZm9BcnI6QXJyYXk8YW55PjtcclxuICAgIF9tQ2FjaGVWZXJ0aWNlc0FycjpBcnJheTxhbnk+O1xyXG5cclxuICAgIG9uSW5pdFZlcnRleCgpe1xyXG4gICAgICAgIHRoaXMuX21lc2ggPSB0aGlzLl92ZXJ0aWNlc09iai5wYXJlbnRbXCJtZXNoRmlsdGVyXCJdO1xyXG4gICAgICAgIGlmKCF0aGlzLl9tZXNoKXtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3ZlcnRpY2VzT2JqLm51bUNoaWxkcmVuPjApe1xyXG4gICAgICAgICAgICB0aGlzLl92ZXJ0ZXhBcnJheT1bXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl92ZXJ0aWNlc09iai5udW1DaGlsZHJlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92ZXJ0ZXhBcnJheVtpXSA9ICh0aGlzLl92ZXJ0aWNlc09iai5nZXRDaGlsZEF0KGkpIGFzIExheWEuU3ByaXRlM0QpLnRyYW5zZm9ybTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZighdGhpcy5fdmVydGV4QXJyYXkpe1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGE9W107XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fdmVydGV4QnVmZmVycz10aGlzLl9tZXNoLnNoYXJlZE1lc2hbXCJfdmVydGV4QnVmZmVyc1wiXTtcclxuICAgICAgICB0aGlzLl92ZXJ0ZXhCdWZmZXJzPXRoaXMuX3ZlcnRleEJ1ZmZlcnMuY29uY2F0KCk7XHJcbiAgICAgICAgdGhpcy5fbWVzaC5zaGFyZWRNZXNoW1wiX3ZlcnRleEJ1ZmZlcnNcIl09dGhpcy5fdmVydGV4QnVmZmVycztcclxuICAgICAgXHJcbiAgICAgICAgdGhpcy5fbUNhY2hlVmVydGljZXNBcnIgPSB0aGlzLl9tZXNoLnNoYXJlZE1lc2guX2dldFBvc2l0aW9ucygpO1xyXG4gICAgICAgIHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyPVtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3ZlcnRleEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5fdmVydGV4QXJyYXlbaV07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0FycltpXT17fTtcclxuICAgICAgICAgICAgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnJbaV0uVHJhbnNmb3JtSW5mbyA9IGl0ZW07XHJcblxyXG4gICAgICAgICAgICB2YXIgbUluZGV4TGlzdD1bXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fbUNhY2hlVmVydGljZXNBcnIubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhQb3MgPSB0aGlzLl9tQ2FjaGVWZXJ0aWNlc0FycltqXTtcclxuICAgICAgICAgICAgICAgIHZhciBkPUxheWEuVmVjdG9yMy5kaXN0YW5jZSh2ZXJ0ZXhQb3MsaXRlbS5sb2NhbFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChkIDw9MC4wMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbUluZGV4TGlzdC5wdXNoKGopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0FycltpXS5WZXRleElEQXJyID0gbUluZGV4TGlzdDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgb25MYXRlVXBkYXRlKCl7XHJcbiAgICAgICAgaWYodGhpcy5fYW5pci5zcGVlZD09MClyZXR1cm47XHJcbiAgICAgICAgdmFyIHBsYXlTdGF0ZT10aGlzLl9hbmlyLmdldEN1cnJlbnRBbmltYXRvclBsYXlTdGF0ZSgpO1xyXG4gICAgICAgIGlmKHBsYXlTdGF0ZS5fZmluaXNoKXJldHVybjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0Fyci5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnJbaV07XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGl0ZW0uVmV0ZXhJREFyci5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZlcnRleElEID0gaXRlbS5WZXRleElEQXJyW2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwb3M9IGl0ZW0uVHJhbnNmb3JtSW5mby5sb2NhbFBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbUNhY2hlVmVydGljZXNBcnJbdmVydGV4SURdID0gcG9zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl92ZXJ0ZXhzX3NldFBvc2l0aW9ucyh0aGlzLl92ZXJ0ZXhCdWZmZXJzLHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBfdmVydGV4c19nZXRQb3NpdGlvbnModmVydGV4QnVmZmVycyl7XHJcblx0XHR2YXIgdmVydGljZXM9W107XHJcblx0XHR2YXIgaT0wLGo9MCx2ZXJ0ZXhCdWZmZXIscG9zaXRpb25FbGVtZW50LHZlcnRleEVsZW1lbnRzLHZlcnRleEVsZW1lbnQsb2ZzZXQ9MCx2ZXJ0aWNlc0RhdGE7XHJcblx0XHR2YXIgdmVydGV4QnVmZmVyQ291bnQ9dmVydGV4QnVmZmVycy5sZW5ndGg7XHJcblx0XHRmb3IgKGk9MDtpIDwgdmVydGV4QnVmZmVyQ291bnQ7aSsrKXtcclxuXHRcdFx0dmVydGV4QnVmZmVyPXZlcnRleEJ1ZmZlcnNbaV07XHJcblx0XHRcdHZlcnRleEVsZW1lbnRzPXZlcnRleEJ1ZmZlci52ZXJ0ZXhEZWNsYXJhdGlvbi52ZXJ0ZXhFbGVtZW50cztcclxuXHRcdFx0Zm9yIChqPTA7aiA8IHZlcnRleEVsZW1lbnRzLmxlbmd0aDtqKyspe1xyXG5cdFx0XHRcdHZlcnRleEVsZW1lbnQ9dmVydGV4RWxlbWVudHNbal07XHJcblx0XHRcdFx0aWYgKHZlcnRleEVsZW1lbnQuZWxlbWVudEZvcm1hdD09PS8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXhFbGVtZW50Rm9ybWF0LlZlY3RvcjMqL1widmVjdG9yM1wiICYmIHZlcnRleEVsZW1lbnQuZWxlbWVudFVzYWdlPT09LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfUE9TSVRJT04wKi8wKXtcclxuXHRcdFx0XHRcdHBvc2l0aW9uRWxlbWVudD12ZXJ0ZXhFbGVtZW50O1xyXG5cdFx0XHRcdFx0YnJlYWsgO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHR2ZXJ0aWNlc0RhdGE9dmVydGV4QnVmZmVyLmdldERhdGEoKTtcclxuXHRcdFx0Zm9yIChqPTA7aiA8IHZlcnRpY2VzRGF0YS5sZW5ndGg7ais9dmVydGV4QnVmZmVyLnZlcnRleERlY2xhcmF0aW9uLnZlcnRleFN0cmlkZSAvIDQpe1xyXG5cdFx0XHRcdG9mc2V0PWorcG9zaXRpb25FbGVtZW50Lm9mZnNldCAvIDQ7XHJcblx0XHRcdFx0dmVydGljZXMucHVzaChuZXcgTGF5YS5WZWN0b3IzKHZlcnRpY2VzRGF0YVtvZnNldCswXSx2ZXJ0aWNlc0RhdGFbb2ZzZXQrMV0sdmVydGljZXNEYXRhW29mc2V0KzJdKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB2ZXJ0aWNlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgX3ZlcnRleHNfc2V0UG9zaXRpb25zKHZlcnRleEJ1ZmZlcnMsdmVydGljZXMpe1xyXG5cdFx0dmFyIGk9MCxqPTAsdmVydGV4QnVmZmVyLHBvc2l0aW9uRWxlbWVudCx2ZXJ0ZXhFbGVtZW50cyx2ZXJ0ZXhFbGVtZW50LG9mc2V0PTAsdmVydGljZXNEYXRhLHZlcnRpY2U7XHJcblx0XHR2YXIgdmVydGV4QnVmZmVyQ291bnQ9dmVydGV4QnVmZmVycy5sZW5ndGg7XHJcblx0XHRmb3IgKGk9MDtpIDwgdmVydGV4QnVmZmVyQ291bnQ7aSsrKXtcclxuXHRcdFx0dmVydGV4QnVmZmVyPXZlcnRleEJ1ZmZlcnNbaV07XHJcblx0XHRcdHZlcnRleEVsZW1lbnRzPXZlcnRleEJ1ZmZlci52ZXJ0ZXhEZWNsYXJhdGlvbi52ZXJ0ZXhFbGVtZW50cztcclxuXHRcdFx0Zm9yIChqPTA7aiA8IHZlcnRleEVsZW1lbnRzLmxlbmd0aDtqKyspe1xyXG5cdFx0XHRcdHZlcnRleEVsZW1lbnQ9dmVydGV4RWxlbWVudHNbal07XHJcblx0XHRcdFx0aWYgKHZlcnRleEVsZW1lbnQuZWxlbWVudEZvcm1hdD09PS8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXhFbGVtZW50Rm9ybWF0LlZlY3RvcjMqL1widmVjdG9yM1wiICYmIHZlcnRleEVsZW1lbnQuZWxlbWVudFVzYWdlPT09LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfUE9TSVRJT04wKi8wKXtcclxuXHRcdFx0XHRcdHBvc2l0aW9uRWxlbWVudD12ZXJ0ZXhFbGVtZW50O1xyXG5cdFx0XHRcdFx0YnJlYWsgO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgICAgICB2ZXJ0aWNlc0RhdGE9dmVydGV4QnVmZmVyLmdldERhdGEoKTtcclxuICAgICAgICAgICAgdmFyIG49MDtcclxuXHRcdFx0Zm9yIChqPTA7aiA8IHZlcnRpY2VzRGF0YS5sZW5ndGg7ais9dmVydGV4QnVmZmVyLnZlcnRleERlY2xhcmF0aW9uLnZlcnRleFN0cmlkZSAvIDQpe1xyXG4gICAgICAgICAgICAgICAgdmVydGljZT12ZXJ0aWNlc1tuXTtcclxuICAgICAgICAgICAgICAgIG9mc2V0PWorcG9zaXRpb25FbGVtZW50Lm9mZnNldCAvIDQ7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlc0RhdGFbb2ZzZXQrMF09dmVydGljZS54O1xyXG4gICAgICAgICAgICAgICAgdmVydGljZXNEYXRhW29mc2V0KzFdPXZlcnRpY2UueTtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzRGF0YVtvZnNldCsyXT12ZXJ0aWNlLno7XHJcbiAgICAgICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmVydGV4QnVmZmVyLnNldERhdGEodmVydGljZXNEYXRhKTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBvbkdldFdvcmxkUG9zKHRhcmdldCxwb3Mpe1xyXG4gICAgICAgIHZhciBvdXRQb3M9bmV3IExheWEuVmVjdG9yMygpO1xyXG4gICAgICAgIGlmICh0YXJnZXQuX3BhcmVudCAhPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50UG9zaXRpb249dGFyZ2V0LnBhcmVudC50cmFuc2Zvcm0ucG9zaXRpb247XHJcbiAgICAgICAgICAgIExheWEuVmVjdG9yMy5tdWx0aXBseShwb3MsdGFyZ2V0LnBhcmVudC50cmFuc2Zvcm0uc2NhbGUsTGF5YS5UcmFuc2Zvcm0zRFtcIl90ZW1wVmVjdG9yMzBcIl0pO1xyXG4gICAgICAgICAgICBMYXlhLlZlY3RvcjMudHJhbnNmb3JtUXVhdChMYXlhLlRyYW5zZm9ybTNEW1wiX3RlbXBWZWN0b3IzMFwiXSx0YXJnZXQucGFyZW50LnRyYW5zZm9ybS5yb3RhdGlvbixMYXlhLlRyYW5zZm9ybTNEW1wiX3RlbXBWZWN0b3IzMFwiXSk7XHJcbiAgICAgICAgICAgIExheWEuVmVjdG9yMy5hZGQocGFyZW50UG9zaXRpb24sTGF5YS5UcmFuc2Zvcm0zRFtcIl90ZW1wVmVjdG9yMzBcIl0sb3V0UG9zKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHBvcy5jbG9uZVRvKG91dFBvcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRQb3M7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tIFwiLi4vV215U2NyaXB0M0RcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteVBoeXNpY3NfQ2hhcmFjdGVyIGV4dGVuZHMgV215U2NyaXB0M0Qge1xyXG5cdHB1YmxpYyBvbkRlbCgpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLmNoYXJhY3RlciE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXI9bnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2hhcmFjdGVyOkxheWEuQ2hhcmFjdGVyQ29udHJvbGxlcjtcclxuXHJcbiAgICBwdWJsaWMgc3BlZWRWMz1uZXcgTGF5YS5WZWN0b3IzKCk7XHJcbiAgICBwdWJsaWMgZ3Jhdml0eT1uZXcgTGF5YS5WZWN0b3IzKCk7XHJcblxyXG4gICAgcHVibGljIGdldCBpc0dyb3VuZGVkKCl7XHJcbiAgICAgICAgaWYodGhpcy5jaGFyYWN0ZXI9PW51bGwpcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJhY3Rlci5pc0dyb3VuZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblN0YXJ0KCl7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uSW5pdChyYWRpdXMsIGxlbmd0aCwgb3JpZW50YXRpb24sbG9jYWxPZmZzZXRYLCBsb2NhbE9mZnNldFksIGxvY2FsT2Zmc2V0Wil7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSB0aGlzLm93bmVyM0QuYWRkQ29tcG9uZW50KExheWEuQ2hhcmFjdGVyQ29udHJvbGxlcik7XHJcblx0XHR2YXIgc3BoZXJlU2hhcGU6TGF5YS5DYXBzdWxlQ29sbGlkZXJTaGFwZSA9IG5ldyBMYXlhLkNhcHN1bGVDb2xsaWRlclNoYXBlKHJhZGl1cywgbGVuZ3RoLCBvcmllbnRhdGlvbik7XHJcbiAgICAgICAgc3BoZXJlU2hhcGUubG9jYWxPZmZzZXQgPW5ldyBMYXlhLlZlY3RvcjMobG9jYWxPZmZzZXRYLGxvY2FsT2Zmc2V0WSxsb2NhbE9mZnNldFopO1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLmNvbGxpZGVyU2hhcGUgPSBzcGhlcmVTaGFwZTtcclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5ncmF2aXR5PXRoaXMuZ3Jhdml0eTtcclxuICAgICAgICAvLyB0aGlzLmNoYXJhY3Rlci5fdXBkYXRlUGh5c2ljc1RyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIHB1YmxpYyBpc0xvY2tNb3ZlPWZhbHNlO1xyXG4gICAgb25VcGRhdGUoKXtcclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5ncmF2aXR5PXRoaXMuZ3Jhdml0eTtcclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5tb3ZlKHRoaXMuc3BlZWRWMyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1vdmUodjM6TGF5YS5WZWN0b3IzLGxvY2tNb3ZlVGltZTpudW1iZXI9MCl7XHJcbiAgICAgICAgdGhpcy5pc0xvY2tNb3ZlPXRydWU7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIubW92ZSh2Myk7XHJcbiAgICAgICAgTGF5YS50aW1lci5vbmNlKGxvY2tNb3ZlVGltZSoxMDAwLHRoaXMsKCk9PntcclxuICAgICAgICAgICAgdGhpcy5pc0xvY2tNb3ZlPWZhbHNlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBfdXBkYXRlUGh5c2ljc1RyYW5zZm9ybSgpe1xyXG5cdFx0Ly92YXIgbmF0aXZlV29ybGRUcmFuc2Zvcm09dGhpcy5jaGFyYWN0ZXIuX25hdGl2ZUNvbGxpZGVyT2JqZWN0LmdldFdvcmxkVHJhbnNmb3JtKCk7XHJcblx0XHR0aGlzLmNoYXJhY3Rlci5fZGVyaXZlUGh5c2ljc1RyYW5zZm9ybWF0aW9uKHRydWUpOyBcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBXRWFzZVR5cGUgfSBmcm9tIFwiLi9XRWFzZVR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXRWFzZU1hbmFnZXIge1xyXG5cdHByaXZhdGUgc3RhdGljIF9QaU92ZXIyOiBudW1iZXIgPSBNYXRoLlBJICogMC41O1xyXG5cdHByaXZhdGUgc3RhdGljIF9Ud29QaTogbnVtYmVyID0gTWF0aC5QSSAqIDI7XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZXZhbHVhdGUoZWFzZVR5cGU6IG51bWJlciwgdGltZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyLCBvdmVyc2hvb3RPckFtcGxpdHVkZTogbnVtYmVyLCBwZXJpb2Q6IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRzd2l0Y2ggKGVhc2VUeXBlKSB7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkxpbmVhcjpcclxuXHRcdFx0XHRyZXR1cm4gdGltZSAvIGR1cmF0aW9uO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5TaW5lSW46XHJcblx0XHRcdFx0cmV0dXJuIC1NYXRoLmNvcyh0aW1lIC8gZHVyYXRpb24gKiBXRWFzZU1hbmFnZXIuX1BpT3ZlcjIpICsgMTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuU2luZU91dDpcclxuXHRcdFx0XHRyZXR1cm4gTWF0aC5zaW4odGltZSAvIGR1cmF0aW9uICogV0Vhc2VNYW5hZ2VyLl9QaU92ZXIyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuU2luZUluT3V0OlxyXG5cdFx0XHRcdHJldHVybiAtMC41ICogKE1hdGguY29zKE1hdGguUEkgKiB0aW1lIC8gZHVyYXRpb24pIC0gMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YWRJbjpcclxuXHRcdFx0XHRyZXR1cm4gKHRpbWUgLz0gZHVyYXRpb24pICogdGltZTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhZE91dDpcclxuXHRcdFx0XHRyZXR1cm4gLSh0aW1lIC89IGR1cmF0aW9uKSAqICh0aW1lIC0gMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YWRJbk91dDpcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRcdHJldHVybiAtMC41ICogKCgtLXRpbWUpICogKHRpbWUgLSAyKSAtIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DdWJpY0luOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lICogdGltZTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQ3ViaWNPdXQ6XHJcblx0XHRcdFx0cmV0dXJuICgodGltZSA9IHRpbWUgLyBkdXJhdGlvbiAtIDEpICogdGltZSAqIHRpbWUgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQ3ViaWNJbk91dDpcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0XHRyZXR1cm4gMC41ICogKCh0aW1lIC09IDIpICogdGltZSAqIHRpbWUgKyAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhcnRJbjpcclxuXHRcdFx0XHRyZXR1cm4gKHRpbWUgLz0gZHVyYXRpb24pICogdGltZSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFydE91dDpcclxuXHRcdFx0XHRyZXR1cm4gLSgodGltZSA9IHRpbWUgLyBkdXJhdGlvbiAtIDEpICogdGltZSAqIHRpbWUgKiB0aW1lIC0gMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YXJ0SW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRcdHJldHVybiAtMC41ICogKCh0aW1lIC09IDIpICogdGltZSAqIHRpbWUgKiB0aW1lIC0gMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1aW50SW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1aW50T3V0OlxyXG5cdFx0XHRcdHJldHVybiAoKHRpbWUgPSB0aW1lIC8gZHVyYXRpb24gLSAxKSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWUgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVpbnRJbk91dDpcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRcdHJldHVybiAwLjUgKiAoKHRpbWUgLT0gMikgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lICsgMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkV4cG9JbjpcclxuXHRcdFx0XHRyZXR1cm4gKHRpbWUgPT0gMCkgPyAwIDogTWF0aC5wb3coMiwgMTAgKiAodGltZSAvIGR1cmF0aW9uIC0gMSkpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FeHBvT3V0OlxyXG5cdFx0XHRcdGlmICh0aW1lID09IGR1cmF0aW9uKSByZXR1cm4gMTtcclxuXHRcdFx0XHRyZXR1cm4gKC1NYXRoLnBvdygyLCAtMTAgKiB0aW1lIC8gZHVyYXRpb24pICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkV4cG9Jbk91dDpcclxuXHRcdFx0XHRpZiAodGltZSA9PSAwKSByZXR1cm4gMDtcclxuXHRcdFx0XHRpZiAodGltZSA9PSBkdXJhdGlvbikgcmV0dXJuIDE7XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiBNYXRoLnBvdygyLCAxMCAqICh0aW1lIC0gMSkpO1xyXG5cdFx0XHRcdHJldHVybiAwLjUgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tdGltZSkgKyAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQ2lyY0luOlxyXG5cdFx0XHRcdHJldHVybiAtKE1hdGguc3FydCgxIC0gKHRpbWUgLz0gZHVyYXRpb24pICogdGltZSkgLSAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQ2lyY091dDpcclxuXHRcdFx0XHRyZXR1cm4gTWF0aC5zcXJ0KDEgLSAodGltZSA9IHRpbWUgLyBkdXJhdGlvbiAtIDEpICogdGltZSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkNpcmNJbk91dDpcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIC0wLjUgKiAoTWF0aC5zcXJ0KDEgLSB0aW1lICogdGltZSkgLSAxKTtcclxuXHRcdFx0XHRyZXR1cm4gMC41ICogKE1hdGguc3FydCgxIC0gKHRpbWUgLT0gMikgKiB0aW1lKSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FbGFzdGljSW46XHJcblx0XHRcdFx0dmFyIHMwOiBudW1iZXI7XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gMCkgcmV0dXJuIDA7XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uKSA9PSAxKSByZXR1cm4gMTtcclxuXHRcdFx0XHRpZiAocGVyaW9kID09IDApIHBlcmlvZCA9IGR1cmF0aW9uICogMC4zO1xyXG5cdFx0XHRcdGlmIChvdmVyc2hvb3RPckFtcGxpdHVkZSA8IDEpIHtcclxuXHRcdFx0XHRcdG92ZXJzaG9vdE9yQW1wbGl0dWRlID0gMTtcclxuXHRcdFx0XHRcdHMwID0gcGVyaW9kIC8gNDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBzMCA9IHBlcmlvZCAvIFdFYXNlTWFuYWdlci5fVHdvUGkgKiBNYXRoLmFzaW4oMSAvIG92ZXJzaG9vdE9yQW1wbGl0dWRlKTtcclxuXHRcdFx0XHRyZXR1cm4gLShvdmVyc2hvb3RPckFtcGxpdHVkZSAqIE1hdGgucG93KDIsIDEwICogKHRpbWUgLT0gMSkpICogTWF0aC5zaW4oKHRpbWUgKiBkdXJhdGlvbiAtIHMwKSAqIFdFYXNlTWFuYWdlci5fVHdvUGkgLyBwZXJpb2QpKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRWxhc3RpY091dDpcclxuXHRcdFx0XHR2YXIgczE6IG51bWJlcjtcclxuXHRcdFx0XHRpZiAodGltZSA9PSAwKSByZXR1cm4gMDtcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24pID09IDEpIHJldHVybiAxO1xyXG5cdFx0XHRcdGlmIChwZXJpb2QgPT0gMCkgcGVyaW9kID0gZHVyYXRpb24gKiAwLjM7XHJcblx0XHRcdFx0aWYgKG92ZXJzaG9vdE9yQW1wbGl0dWRlIDwgMSkge1xyXG5cdFx0XHRcdFx0b3ZlcnNob290T3JBbXBsaXR1ZGUgPSAxO1xyXG5cdFx0XHRcdFx0czEgPSBwZXJpb2QgLyA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHMxID0gcGVyaW9kIC8gV0Vhc2VNYW5hZ2VyLl9Ud29QaSAqIE1hdGguYXNpbigxIC8gb3ZlcnNob290T3JBbXBsaXR1ZGUpO1xyXG5cdFx0XHRcdHJldHVybiAob3ZlcnNob290T3JBbXBsaXR1ZGUgKiBNYXRoLnBvdygyLCAtMTAgKiB0aW1lKSAqIE1hdGguc2luKCh0aW1lICogZHVyYXRpb24gLSBzMSkgKiBXRWFzZU1hbmFnZXIuX1R3b1BpIC8gcGVyaW9kKSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FbGFzdGljSW5PdXQ6XHJcblx0XHRcdFx0dmFyIHM6IG51bWJlcjtcclxuXHRcdFx0XHRpZiAodGltZSA9PSAwKSByZXR1cm4gMDtcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpID09IDIpIHJldHVybiAxO1xyXG5cdFx0XHRcdGlmIChwZXJpb2QgPT0gMCkgcGVyaW9kID0gZHVyYXRpb24gKiAoMC4zICogMS41KTtcclxuXHRcdFx0XHRpZiAob3ZlcnNob290T3JBbXBsaXR1ZGUgPCAxKSB7XHJcblx0XHRcdFx0XHRvdmVyc2hvb3RPckFtcGxpdHVkZSA9IDE7XHJcblx0XHRcdFx0XHRzID0gcGVyaW9kIC8gNDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBzID0gcGVyaW9kIC8gV0Vhc2VNYW5hZ2VyLl9Ud29QaSAqIE1hdGguYXNpbigxIC8gb3ZlcnNob290T3JBbXBsaXR1ZGUpO1xyXG5cdFx0XHRcdGlmICh0aW1lIDwgMSkgcmV0dXJuIC0wLjUgKiAob3ZlcnNob290T3JBbXBsaXR1ZGUgKiBNYXRoLnBvdygyLCAxMCAqICh0aW1lIC09IDEpKSAqIE1hdGguc2luKCh0aW1lICogZHVyYXRpb24gLSBzKSAqIFdFYXNlTWFuYWdlci5fVHdvUGkgLyBwZXJpb2QpKTtcclxuXHRcdFx0XHRyZXR1cm4gb3ZlcnNob290T3JBbXBsaXR1ZGUgKiBNYXRoLnBvdygyLCAtMTAgKiAodGltZSAtPSAxKSkgKiBNYXRoLnNpbigodGltZSAqIGR1cmF0aW9uIC0gcykgKiBXRWFzZU1hbmFnZXIuX1R3b1BpIC8gcGVyaW9kKSAqIDAuNSArIDE7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJhY2tJbjpcclxuXHRcdFx0XHRyZXR1cm4gKHRpbWUgLz0gZHVyYXRpb24pICogdGltZSAqICgob3ZlcnNob290T3JBbXBsaXR1ZGUgKyAxKSAqIHRpbWUgLSBvdmVyc2hvb3RPckFtcGxpdHVkZSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJhY2tPdXQ6XHJcblx0XHRcdFx0cmV0dXJuICgodGltZSA9IHRpbWUgLyBkdXJhdGlvbiAtIDEpICogdGltZSAqICgob3ZlcnNob290T3JBbXBsaXR1ZGUgKyAxKSAqIHRpbWUgKyBvdmVyc2hvb3RPckFtcGxpdHVkZSkgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQmFja0luT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogKHRpbWUgKiB0aW1lICogKCgob3ZlcnNob290T3JBbXBsaXR1ZGUgKj0gKDEuNTI1KSkgKyAxKSAqIHRpbWUgLSBvdmVyc2hvb3RPckFtcGxpdHVkZSkpO1xyXG5cdFx0XHRcdHJldHVybiAwLjUgKiAoKHRpbWUgLT0gMikgKiB0aW1lICogKCgob3ZlcnNob290T3JBbXBsaXR1ZGUgKj0gKDEuNTI1KSkgKyAxKSAqIHRpbWUgKyBvdmVyc2hvb3RPckFtcGxpdHVkZSkgKyAyKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQm91bmNlSW46XHJcblx0XHRcdFx0cmV0dXJuIEJvdW5jZS5lYXNlSW4odGltZSwgZHVyYXRpb24pO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5Cb3VuY2VPdXQ6XHJcblx0XHRcdFx0cmV0dXJuIEJvdW5jZS5lYXNlT3V0KHRpbWUsIGR1cmF0aW9uKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQm91bmNlSW5PdXQ6XHJcblx0XHRcdFx0cmV0dXJuIEJvdW5jZS5lYXNlSW5PdXQodGltZSwgZHVyYXRpb24pO1xyXG5cclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRyZXR1cm4gLSh0aW1lIC89IGR1cmF0aW9uKSAqICh0aW1lIC0gMik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHR9XHJcbn1cclxuXHJcbi8vLyBUaGlzIGNsYXNzIGNvbnRhaW5zIGEgQyMgcG9ydCBvZiB0aGUgZWFzaW5nIGVxdWF0aW9ucyBjcmVhdGVkIGJ5IFJvYmVydCBQZW5uZXIgKGh0dHA6Ly9yb2JlcnRwZW5uZXIuY29tL2Vhc2luZykuXHJcbmV4cG9ydCBjbGFzcyBCb3VuY2Uge1xyXG5cdHB1YmxpYyBzdGF0aWMgZWFzZUluKHRpbWU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gMSAtIEJvdW5jZS5lYXNlT3V0KGR1cmF0aW9uIC0gdGltZSwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBlYXNlT3V0KHRpbWU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24pIDwgKDEgLyAyLjc1KSkge1xyXG5cdFx0XHRyZXR1cm4gKDcuNTYyNSAqIHRpbWUgKiB0aW1lKTtcclxuXHRcdH1cclxuXHRcdGlmICh0aW1lIDwgKDIgLyAyLjc1KSkge1xyXG5cdFx0XHRyZXR1cm4gKDcuNTYyNSAqICh0aW1lIC09ICgxLjUgLyAyLjc1KSkgKiB0aW1lICsgMC43NSk7XHJcblx0XHR9XHJcblx0XHRpZiAodGltZSA8ICgyLjUgLyAyLjc1KSkge1xyXG5cdFx0XHRyZXR1cm4gKDcuNTYyNSAqICh0aW1lIC09ICgyLjI1IC8gMi43NSkpICogdGltZSArIDAuOTM3NSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKDcuNTYyNSAqICh0aW1lIC09ICgyLjYyNSAvIDIuNzUpKSAqIHRpbWUgKyAwLjk4NDM3NSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGVhc2VJbk91dCh0aW1lOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0aWYgKHRpbWUgPCBkdXJhdGlvbiAqIDAuNSkge1xyXG5cdFx0XHRyZXR1cm4gQm91bmNlLmVhc2VJbih0aW1lICogMiwgZHVyYXRpb24pICogMC41O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIEJvdW5jZS5lYXNlT3V0KHRpbWUgKiAyIC0gZHVyYXRpb24sIGR1cmF0aW9uKSAqIDAuNSArIDAuNTtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgV0Vhc2VUeXBlIHtcclxuXHRwdWJsaWMgc3RhdGljIExpbmVhcjogbnVtYmVyID0gMDtcclxuXHRwdWJsaWMgc3RhdGljIFNpbmVJbjogbnVtYmVyID0gMTtcclxuXHRwdWJsaWMgc3RhdGljIFNpbmVPdXQ6IG51bWJlciA9IDI7XHJcblx0cHVibGljIHN0YXRpYyBTaW5lSW5PdXQ6IG51bWJlciA9IDM7XHJcblx0cHVibGljIHN0YXRpYyBRdWFkSW46IG51bWJlciA9IDQ7XHJcblx0cHVibGljIHN0YXRpYyBRdWFkT3V0OiBudW1iZXIgPSA1O1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhZEluT3V0OiBudW1iZXIgPSA2O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ3ViaWNJbjogbnVtYmVyID0gNztcclxuXHRwdWJsaWMgc3RhdGljIEN1YmljT3V0OiBudW1iZXIgPSA4O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ3ViaWNJbk91dDogbnVtYmVyID0gOTtcclxuXHRwdWJsaWMgc3RhdGljIFF1YXJ0SW46IG51bWJlciA9IDEwO1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhcnRPdXQ6IG51bWJlciA9IDExO1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhcnRJbk91dDogbnVtYmVyID0gMTI7XHJcblx0cHVibGljIHN0YXRpYyBRdWludEluOiBudW1iZXIgPSAxMztcclxuXHRwdWJsaWMgc3RhdGljIFF1aW50T3V0OiBudW1iZXIgPSAxNDtcclxuXHRwdWJsaWMgc3RhdGljIFF1aW50SW5PdXQ6IG51bWJlciA9IDE1O1xyXG5cdHB1YmxpYyBzdGF0aWMgRXhwb0luOiBudW1iZXIgPSAxNjtcclxuXHRwdWJsaWMgc3RhdGljIEV4cG9PdXQ6IG51bWJlciA9IDE3O1xyXG5cdHB1YmxpYyBzdGF0aWMgRXhwb0luT3V0OiBudW1iZXIgPSAxODtcclxuXHRwdWJsaWMgc3RhdGljIENpcmNJbjogbnVtYmVyID0gMTk7XHJcblx0cHVibGljIHN0YXRpYyBDaXJjT3V0OiBudW1iZXIgPSAyMDtcclxuXHRwdWJsaWMgc3RhdGljIENpcmNJbk91dDogbnVtYmVyID0gMjE7XHJcblx0cHVibGljIHN0YXRpYyBFbGFzdGljSW46IG51bWJlciA9IDIyO1xyXG5cdHB1YmxpYyBzdGF0aWMgRWxhc3RpY091dDogbnVtYmVyID0gMjM7XHJcblx0cHVibGljIHN0YXRpYyBFbGFzdGljSW5PdXQ6IG51bWJlciA9IDI0O1xyXG5cdHB1YmxpYyBzdGF0aWMgQmFja0luOiBudW1iZXIgPSAyNTtcclxuXHRwdWJsaWMgc3RhdGljIEJhY2tPdXQ6IG51bWJlciA9IDI2O1xyXG5cdHB1YmxpYyBzdGF0aWMgQmFja0luT3V0OiBudW1iZXIgPSAyNztcclxuXHRwdWJsaWMgc3RhdGljIEJvdW5jZUluOiBudW1iZXIgPSAyODtcclxuXHRwdWJsaWMgc3RhdGljIEJvdW5jZU91dDogbnVtYmVyID0gMjk7XHJcblx0cHVibGljIHN0YXRpYyBCb3VuY2VJbk91dDogbnVtYmVyID0gMzA7XHJcblx0cHVibGljIHN0YXRpYyBDdXN0b206IG51bWJlciA9IDMxO1xyXG59IiwiaW1wb3J0IHsgV1R3ZWVuZXIgfSBmcm9tIFwiLi9XVHdlZW5lclwiO1xyXG5pbXBvcnQgeyBXVHdlZW5NYW5hZ2VyIH0gZnJvbSBcIi4vV1R3ZWVuTWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdUd2VlbiB7XHJcblx0cHVibGljIHN0YXRpYyBjYXRjaENhbGxiYWNrRXhjZXB0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgdG8oc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90byhzdGFydCwgZW5kLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvMihzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3RvMihzdGFydCwgc3RhcnQyLCBlbmQsIGVuZDIsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgdG8zKHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBzdGFydDM6IG51bWJlcixcclxuXHRcdGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGVuZDM6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3RvMyhzdGFydCwgc3RhcnQyLCBzdGFydDMsIGVuZCwgZW5kMiwgZW5kMywgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB0bzQoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIHN0YXJ0MzogbnVtYmVyLCBzdGFydDQ6IG51bWJlcixcclxuXHRcdGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGVuZDM6IG51bWJlciwgZW5kNDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG80KHN0YXJ0LCBzdGFydDIsIHN0YXJ0Mywgc3RhcnQ0LCBlbmQsIGVuZDIsIGVuZDMsIGVuZDQsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgdG9Db2xvcihzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3RvQ29sb3Ioc3RhcnQsIGVuZCwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBkZWxheWVkQ2FsbChkZWxheTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5zZXREZWxheShkZWxheSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHNoYWtlKHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgYW1wbGl0dWRlOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl9zaGFrZShzdGFydFgsIHN0YXJ0WSwgYW1wbGl0dWRlLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGlzVHdlZW5pbmcodGFyZ2V0OiBPYmplY3QsIHByb3BUeXBlOiBPYmplY3QpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmlzVHdlZW5pbmcodGFyZ2V0LCBwcm9wVHlwZSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGtpbGwodGFyZ2V0OiBPYmplY3QsIGNvbXBsZXRlOiBib29sZWFuID0gZmFsc2UsIHByb3BUeXBlOiBPYmplY3QgPSBudWxsKTogdm9pZCB7XHJcblx0XHRXVHdlZW5NYW5hZ2VyLmtpbGxUd2VlbnModGFyZ2V0LCBmYWxzZSwgbnVsbCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIGdldFR3ZWVuKHRhcmdldDogT2JqZWN0LCBwcm9wVHlwZTogT2JqZWN0ID0gbnVsbCk6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmdldFR3ZWVuKHRhcmdldCwgcHJvcFR5cGUpO1xyXG5cdH1cclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgV1R3ZWVuZXIgfSBmcm9tIFwiLi9XVHdlZW5lclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdUd2Vlbk1hbmFnZXIge1xyXG5cdHByaXZhdGUgc3RhdGljIF9hY3RpdmVUd2VlbnM6IGFueVtdID0gbmV3IEFycmF5KDMwKTtcclxuXHRwcml2YXRlIHN0YXRpYyBfdHdlZW5lclBvb2w6IFdUd2VlbmVyW10gPSBbXTtcclxuXHRwcml2YXRlIHN0YXRpYyBfdG90YWxBY3RpdmVUd2VlbnM6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX2luaXRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRwdWJsaWMgc3RhdGljIGNyZWF0ZVR3ZWVuKCk6IFdUd2VlbmVyIHtcclxuXHRcdGlmICghV1R3ZWVuTWFuYWdlci5faW5pdGVkKSB7XHJcblx0XHRcdExheWEudGltZXIuZnJhbWVMb29wKDEsIG51bGwsIHRoaXMudXBkYXRlKTtcclxuXHRcdFx0V1R3ZWVuTWFuYWdlci5faW5pdGVkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdHdlZW5lcjogV1R3ZWVuZXI7XHJcblx0XHR2YXIgY250OiBudW1iZXIgPSBXVHdlZW5NYW5hZ2VyLl90d2VlbmVyUG9vbC5sZW5ndGg7XHJcblx0XHRpZiAoY250ID4gMCkge1xyXG5cdFx0XHR0d2VlbmVyID0gV1R3ZWVuTWFuYWdlci5fdHdlZW5lclBvb2wucG9wKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHRcdHR3ZWVuZXIgPSBuZXcgV1R3ZWVuZXIoKTtcclxuXHRcdHR3ZWVuZXIuX2luaXQoKTtcclxuXHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucysrXSA9IHR3ZWVuZXI7XHJcblxyXG5cdFx0aWYgKFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zID09IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVucy5sZW5ndGgpXHJcblx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVucy5sZW5ndGggPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnMubGVuZ3RoICsgTWF0aC5jZWlsKFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVucy5sZW5ndGggKiAwLjUpO1xyXG5cclxuXHRcdHJldHVybiB0d2VlbmVyO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBpc1R3ZWVuaW5nKHRhcmdldDogYW55LCBwcm9wVHlwZTogYW55KTogYm9vbGVhbiB7XHJcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHR2YXIgYW55VHlwZTogYm9vbGVhbiA9IHByb3BUeXBlID09IG51bGw7XHJcblx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnM7IGkrKykge1xyXG5cdFx0XHR2YXIgdHdlZW5lcjogV1R3ZWVuZXIgPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV07XHJcblx0XHRcdGlmICh0d2VlbmVyICE9IG51bGwgJiYgdHdlZW5lci50YXJnZXQgPT0gdGFyZ2V0ICYmICF0d2VlbmVyLl9raWxsZWRcclxuXHRcdFx0XHQmJiAoYW55VHlwZSB8fCB0d2VlbmVyLl9wcm9wVHlwZSA9PSBwcm9wVHlwZSkpXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBraWxsVHdlZW5zKHRhcmdldDogYW55LCBjb21wbGV0ZWQ6IGJvb2xlYW49ZmFsc2UsIHByb3BUeXBlOiBhbnkgPW51bGwpOiBib29sZWFuIHtcclxuXHRcdGlmICh0YXJnZXQgPT0gbnVsbClcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHZhciBmbGFnOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHR2YXIgY250OiBudW1iZXIgPSBXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucztcclxuXHRcdHZhciBhbnlUeXBlOiBib29sZWFuID0gcHJvcFR5cGUgPT0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBjbnQ7IGkrKykge1xyXG5cdFx0XHR2YXIgdHdlZW5lcjogV1R3ZWVuZXIgPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV07XHJcblx0XHRcdGlmICh0d2VlbmVyICE9IG51bGwgJiYgdHdlZW5lci50YXJnZXQgPT0gdGFyZ2V0ICYmICF0d2VlbmVyLl9raWxsZWRcclxuXHRcdFx0XHQmJiAoYW55VHlwZSB8fCB0d2VlbmVyLl9wcm9wVHlwZSA9PSBwcm9wVHlwZSkpIHtcclxuXHRcdFx0XHR0d2VlbmVyLmtpbGwoY29tcGxldGVkKTtcclxuXHRcdFx0XHRmbGFnID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmbGFnO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBnZXRUd2Vlbih0YXJnZXQ6IGFueSwgcHJvcFR5cGU6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdGlmICh0YXJnZXQgPT0gbnVsbClcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdFx0dmFyIGNudDogbnVtYmVyID0gV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnM7XHJcblx0XHR2YXIgYW55VHlwZTogYm9vbGVhbiA9IHByb3BUeXBlID09IG51bGw7XHJcblx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgY250OyBpKyspIHtcclxuXHRcdFx0dmFyIHR3ZWVuZXI6IFdUd2VlbmVyID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldO1xyXG5cdFx0XHRpZiAodHdlZW5lciAhPSBudWxsICYmIHR3ZWVuZXIudGFyZ2V0ID09IHRhcmdldCAmJiAhdHdlZW5lci5fa2lsbGVkXHJcblx0XHRcdFx0JiYgKGFueVR5cGUgfHwgdHdlZW5lci5fcHJvcFR5cGUgPT0gcHJvcFR5cGUpKSB7XHJcblx0XHRcdFx0cmV0dXJuIHR3ZWVuZXI7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgdXBkYXRlKCk6IHZvaWQge1xyXG5cdFx0dmFyIGR0OiBudW1iZXIgPSBMYXlhLnRpbWVyLmRlbHRhIC8gMTAwMDtcclxuXHJcblx0XHR2YXIgY250OiBudW1iZXIgPSBXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucztcclxuXHRcdHZhciBmcmVlUG9zU3RhcnQ6IG51bWJlciA9IC0xO1xyXG5cdFx0dmFyIGZyZWVQb3NDb3VudDogbnVtYmVyID0gMDtcclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBjbnQ7IGkrKykge1xyXG5cdFx0XHR2YXIgdHdlZW5lcjogV1R3ZWVuZXIgPSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV07XHJcblx0XHRcdGlmICh0d2VlbmVyID09IG51bGwpIHtcclxuXHRcdFx0XHRpZiAoZnJlZVBvc1N0YXJ0ID09IC0xKVxyXG5cdFx0XHRcdFx0ZnJlZVBvc1N0YXJ0ID0gaTtcclxuXHRcdFx0XHRmcmVlUG9zQ291bnQrKztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0d2VlbmVyLl9raWxsZWQpIHtcclxuXHRcdFx0XHR0d2VlbmVyLl9yZXNldCgpO1xyXG5cdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX3R3ZWVuZXJQb29sLnB1c2godHdlZW5lcik7XHJcblx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldID0gbnVsbDtcclxuXHJcblx0XHRcdFx0aWYgKGZyZWVQb3NTdGFydCA9PSAtMSlcclxuXHRcdFx0XHRcdGZyZWVQb3NTdGFydCA9IGk7XHJcblx0XHRcdFx0ZnJlZVBvc0NvdW50Kys7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0aWYgKCF0d2VlbmVyLl9wYXVzZWQpXHJcblx0XHRcdFx0XHR0d2VlbmVyLl91cGRhdGUoZHQpO1xyXG5cclxuXHRcdFx0XHRpZiAoZnJlZVBvc1N0YXJ0ICE9IC0xKSB7XHJcblx0XHRcdFx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbZnJlZVBvc1N0YXJ0XSA9IHR3ZWVuZXI7XHJcblx0XHRcdFx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbaV0gPSBudWxsO1xyXG5cdFx0XHRcdFx0ZnJlZVBvc1N0YXJ0Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGZyZWVQb3NTdGFydCA+PSAwKSB7XHJcblx0XHRcdGlmIChXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucyAhPSBjbnQpIC8vbmV3IHR3ZWVucyBhZGRlZFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIGo6IG51bWJlciA9IGNudDtcclxuXHRcdFx0XHRjbnQgPSBXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucyAtIGNudDtcclxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgY250OyBpKyspXHJcblx0XHRcdFx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbZnJlZVBvc1N0YXJ0KytdID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2orK107XHJcblx0XHRcdH1cclxuXHRcdFx0V1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMgPSBmcmVlUG9zU3RhcnQ7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIFdUd2VlblZhbHVlIHtcclxuXHRwdWJsaWMgeDogbnVtYmVyO1xyXG5cdHB1YmxpYyB5OiBudW1iZXI7XHJcblx0cHVibGljIHo6IG51bWJlcjtcclxuXHRwdWJsaWMgdzogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IHRoaXMudyA9IDA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGNvbG9yKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gKHRoaXMudyA8PCAyNCkgKyAodGhpcy54IDw8IDE2KSArICh0aGlzLnkgPDwgOCkgKyB0aGlzLno7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGNvbG9yKHZhbHVlOiBudW1iZXIpIHtcclxuXHRcdHRoaXMueCA9ICh2YWx1ZSAmIDB4RkYwMDAwKSA+PiAxNjtcclxuXHRcdHRoaXMueSA9ICh2YWx1ZSAmIDB4MDBGRjAwKSA+PiA4O1xyXG5cdFx0dGhpcy56ID0gKHZhbHVlICYgMHgwMDAwRkYpO1xyXG5cdFx0dGhpcy53ID0gKHZhbHVlICYgMHhGRjAwMDAwMCkgPj4gMjQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0RmllbGQoaW5kZXg6IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRzd2l0Y2ggKGluZGV4KSB7XHJcblx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy54O1xyXG5cdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMueTtcclxuXHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLno7XHJcblx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy53O1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkluZGV4IG91dCBvZiBib3VuZHM6IFwiICsgaW5kZXgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEZpZWxkKGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHN3aXRjaCAoaW5kZXgpIHtcclxuXHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdHRoaXMueCA9IHZhbHVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0dGhpcy55ID0gdmFsdWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHR0aGlzLnogPSB2YWx1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdHRoaXMudyA9IHZhbHVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkluZGV4IG91dCBvZiBib3VuZHM6IFwiICsgaW5kZXgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFplcm8oKTogdm9pZCB7XHJcblx0XHR0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSB0aGlzLncgPSAwO1xyXG5cdH1cclxufSIsImltcG9ydCB7IFdUd2VlblZhbHVlIH0gZnJvbSBcIi4vV1R3ZWVuVmFsdWVcIjtcclxuaW1wb3J0IHsgV0Vhc2VUeXBlIH0gZnJvbSBcIi4vV0Vhc2VUeXBlXCI7XHJcbmltcG9ydCB7IFdUd2VlbiB9IGZyb20gXCIuL1dUd2VlblwiO1xyXG5pbXBvcnQgeyBXRWFzZU1hbmFnZXIgfSBmcm9tIFwiLi9XRWFzZU1hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXVHdlZW5lciB7XHJcblx0cHVibGljIF90YXJnZXQ6IGFueTtcclxuXHRwdWJsaWMgX3Byb3BUeXBlOiBhbnk7XHJcblx0cHVibGljIF9raWxsZWQ6IGJvb2xlYW47XHJcblx0cHVibGljIF9wYXVzZWQ6IGJvb2xlYW47XHJcblxyXG5cdHByaXZhdGUgX2RlbGF5OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZHVyYXRpb246IG51bWJlcjtcclxuXHRwcml2YXRlIF9icmVha3BvaW50OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWFzZVR5cGU6IG51bWJlcjtcclxuXHRwcml2YXRlIF9lYXNlT3ZlcnNob290T3JBbXBsaXR1ZGU6IG51bWJlcjtcclxuXHRwcml2YXRlIF9lYXNlUGVyaW9kOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfcmVwZWF0OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfeW95bzogYm9vbGVhbjtcclxuXHRwcml2YXRlIF90aW1lU2NhbGU6IG51bWJlcjtcclxuXHRwcml2YXRlIF9zbmFwcGluZzogYm9vbGVhbjtcclxuXHRwcml2YXRlIF91c2VyRGF0YTogYW55O1xyXG5cclxuXHRwcml2YXRlIF9vblVwZGF0ZTogRnVuY3Rpb247XHJcblx0cHJpdmF0ZSBfb25VcGRhdGVDYWxsZXI6IGFueTtcclxuXHRwcml2YXRlIF9vblN0YXJ0OiBGdW5jdGlvbjtcclxuXHRwcml2YXRlIF9vblN0YXJ0Q2FsbGVyOiBhbnk7XHJcblx0cHJpdmF0ZSBfb25Db21wbGV0ZTogRnVuY3Rpb247XHJcblx0cHJpdmF0ZSBfb25Db21wbGV0ZUNhbGxlcjogYW55O1xyXG5cclxuXHRwcml2YXRlIF9zdGFydFZhbHVlOiBXVHdlZW5WYWx1ZTtcclxuXHRwcml2YXRlIF9lbmRWYWx1ZTogV1R3ZWVuVmFsdWU7XHJcblx0cHJpdmF0ZSBfdmFsdWU6IFdUd2VlblZhbHVlO1xyXG5cdHByaXZhdGUgX2RlbHRhVmFsdWU6IFdUd2VlblZhbHVlO1xyXG5cdHByaXZhdGUgX3ZhbHVlU2l6ZTogbnVtYmVyO1xyXG5cclxuXHRwcml2YXRlIF9zdGFydGVkOiBib29sZWFuO1xyXG5cdHB1YmxpYyBfZW5kZWQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF9lbGFwc2VkVGltZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX25vcm1hbGl6ZWRUaW1lOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZSA9IG5ldyBXVHdlZW5WYWx1ZSgpO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUgPSBuZXcgV1R3ZWVuVmFsdWUoKTtcclxuXHRcdHRoaXMuX3ZhbHVlID0gbmV3IFdUd2VlblZhbHVlKCk7XHJcblx0XHR0aGlzLl9kZWx0YVZhbHVlID0gbmV3IFdUd2VlblZhbHVlKCk7XHJcblxyXG5cdFx0dGhpcy5fcmVzZXQoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXREZWxheSh2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fZGVsYXkgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBkZWxheSgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RlbGF5O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldER1cmF0aW9uKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGR1cmF0aW9uKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZHVyYXRpb247XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0QnJlYWtwb2ludCh2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fYnJlYWtwb2ludCA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RWFzZSh2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fZWFzZVR5cGUgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEVhc2VQZXJpb2QodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2Vhc2VQZXJpb2QgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEVhc2VPdmVyc2hvb3RPckFtcGxpdHVkZSh2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fZWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRSZXBlYXQocmVwZWF0OiBudW1iZXIsIHlveW86IGJvb2xlYW4gPSBmYWxzZSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3JlcGVhdCA9IHRoaXMucmVwZWF0O1xyXG5cdFx0dGhpcy5feW95byA9IHlveW87XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgcmVwZWF0KCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcmVwZWF0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFRpbWVTY2FsZSh2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdGltZVNjYWxlID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRTbmFwcGluZyh2YWx1ZTogYm9vbGVhbik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3NuYXBwaW5nID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRUYXJnZXQodmFsdWU6IGFueSwgcHJvcFR5cGU6IGFueSA9IG51bGwpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl90YXJnZXQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0dGhpcy5fcHJvcFR5cGUgPSBwcm9wVHlwZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB0YXJnZXQoKTogYW55IHtcclxuXHRcdHJldHVybiB0aGlzLl90YXJnZXQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0VXNlckRhdGEodmFsdWU6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3VzZXJEYXRhID0gdGhpcy52YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB1c2VyRGF0YSgpOiBhbnkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3VzZXJEYXRhO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uVXBkYXRlKGNhbGxiYWNrOiBGdW5jdGlvbiwgY2FsbGVyOiBhbnkpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9vblVwZGF0ZSA9IGNhbGxiYWNrO1xyXG5cdFx0dGhpcy5fb25VcGRhdGVDYWxsZXIgPSBjYWxsZXI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBvblN0YXJ0KGNhbGxiYWNrOiBGdW5jdGlvbiwgY2FsbGVyOiBhbnkpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9vblN0YXJ0ID0gY2FsbGJhY2s7XHJcblx0XHR0aGlzLl9vblN0YXJ0Q2FsbGVyID0gY2FsbGVyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgb25Db21wbGV0ZShjYWxsYmFjazogRnVuY3Rpb24sIGNhbGxlcjogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fb25Db21wbGV0ZSA9IGNhbGxiYWNrO1xyXG5cdFx0dGhpcy5fb25Db21wbGV0ZUNhbGxlciA9IGNhbGxlcjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBzdGFydFZhbHVlKCk6IFdUd2VlblZhbHVlIHtcclxuXHRcdHJldHVybiB0aGlzLl9zdGFydFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBlbmRWYWx1ZSgpOiBXVHdlZW5WYWx1ZSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZW5kVmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHZhbHVlKCk6IFdUd2VlblZhbHVlIHtcclxuXHRcdHJldHVybiB0aGlzLl92YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZGVsdGFWYWx1ZSgpOiBXVHdlZW5WYWx1ZSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGVsdGFWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgbm9ybWFsaXplZFRpbWUoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9ub3JtYWxpemVkVGltZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgY29tcGxldGVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VuZGVkICE9IDA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGFsbENvbXBsZXRlZCgpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbmRlZCA9PSAxO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFBhdXNlZChwYXVzZWQ6IGJvb2xlYW4pOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9wYXVzZWQgPSBwYXVzZWQ7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiB0aGlzLnNlZWsgcG9zaXRpb24gb2YgdGhlIHR3ZWVuLCBpbiBzZWNvbmRzLlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc2Vlayh0aW1lOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9raWxsZWQpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IHRpbWU7XHJcblx0XHRpZiAodGhpcy5fZWxhcHNlZFRpbWUgPCB0aGlzLl9kZWxheSkge1xyXG5cdFx0XHRpZiAodGhpcy5fc3RhcnRlZClcclxuXHRcdFx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IHRoaXMuX2RlbGF5O1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudXBkYXRlKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMga2lsbChjb21wbGV0ZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fa2lsbGVkKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0aWYgKGNvbXBsZXRlKSB7XHJcblx0XHRcdGlmICh0aGlzLl9lbmRlZCA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX2JyZWFrcG9pbnQgPj0gMClcclxuXHRcdFx0XHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGhpcy5fZGVsYXkgKyB0aGlzLl9icmVha3BvaW50O1xyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMuX3JlcGVhdCA+PSAwKVxyXG5cdFx0XHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aGlzLl9kZWxheSArIHRoaXMuX2R1cmF0aW9uICogKHRoaXMuX3JlcGVhdCArIDEpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGhpcy5fZGVsYXkgKyB0aGlzLl9kdXJhdGlvbiAqIDI7XHJcblx0XHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5jYWxsQ29tcGxldGVDYWxsYmFjaygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2tpbGxlZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdmFsdWVTaXplID0gMTtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueCA9IHN0YXJ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueCA9IGVuZDtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG8yKHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdmFsdWVTaXplID0gMjtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueCA9IHN0YXJ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueCA9IGVuZDtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueSA9IHN0YXJ0MjtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnkgPSBlbmQyO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF90bzMoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIHN0YXJ0MzogbnVtYmVyLFxyXG5cdFx0ZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZW5kMzogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdmFsdWVTaXplID0gMztcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueCA9IHN0YXJ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueCA9IGVuZDtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueSA9IHN0YXJ0MjtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnkgPSBlbmQyO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS56ID0gc3RhcnQzO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueiA9IGVuZDM7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvNChzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgc3RhcnQzOiBudW1iZXIsIHN0YXJ0NDogbnVtYmVyLFxyXG5cdFx0ZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZW5kMzogbnVtYmVyLCBlbmQ0OiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSA0O1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS54ID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS54ID0gZW5kO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS55ID0gc3RhcnQyO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueSA9IGVuZDI7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnogPSBzdGFydDM7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS56ID0gZW5kMztcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUudyA9IHN0YXJ0NDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLncgPSBlbmQ0O1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF90b0NvbG9yKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdmFsdWVTaXplID0gNDtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUuY29sb3IgPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLmNvbG9yID0gZW5kO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF9zaGFrZShzdGFydFg6IG51bWJlciwgc3RhcnRZOiBudW1iZXIsIGFtcGxpdHVkZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdmFsdWVTaXplID0gNTtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueCA9IHN0YXJ0WDtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueSA9IHN0YXJ0WTtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUudyA9IGFtcGxpdHVkZTtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHR0aGlzLl9lYXNlVHlwZSA9IFdFYXNlVHlwZS5MaW5lYXI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfaW5pdCgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2RlbGF5ID0gMDtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gMDtcclxuXHRcdHRoaXMuX2JyZWFrcG9pbnQgPSAtMTtcclxuXHRcdHRoaXMuX2Vhc2VUeXBlID0gV0Vhc2VUeXBlLlF1YWRPdXQ7XHJcblx0XHR0aGlzLl90aW1lU2NhbGUgPSAxO1xyXG5cdFx0dGhpcy5fZWFzZVBlcmlvZCA9IDA7XHJcblx0XHR0aGlzLl9lYXNlT3ZlcnNob290T3JBbXBsaXR1ZGUgPSAxLjcwMTU4O1xyXG5cdFx0dGhpcy5fc25hcHBpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuX3JlcGVhdCA9IDA7XHJcblx0XHR0aGlzLl95b3lvID0gZmFsc2U7XHJcblx0XHR0aGlzLl92YWx1ZVNpemUgPSAwO1xyXG5cdFx0dGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fcGF1c2VkID0gZmFsc2U7XHJcblx0XHR0aGlzLl9raWxsZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gMDtcclxuXHRcdHRoaXMuX25vcm1hbGl6ZWRUaW1lID0gMDtcclxuXHRcdHRoaXMuX2VuZGVkID0gMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfcmVzZXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl90YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5fdXNlckRhdGEgPSBudWxsO1xyXG5cdFx0dGhpcy5fb25TdGFydCA9IHRoaXMuX29uVXBkYXRlID0gdGhpcy5fb25Db21wbGV0ZSA9IG51bGw7XHJcblx0XHR0aGlzLl9vblN0YXJ0Q2FsbGVyID0gdGhpcy5fb25VcGRhdGVDYWxsZXIgPSB0aGlzLl9vbkNvbXBsZXRlQ2FsbGVyID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdXBkYXRlKGR0OiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl90aW1lU2NhbGUgIT0gMSlcclxuXHRcdFx0ZHQgKj0gdGhpcy5fdGltZVNjYWxlO1xyXG5cdFx0aWYgKGR0ID09IDApXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRpZiAodGhpcy5fZW5kZWQgIT0gMCkgLy9NYXliZSB0aGlzLmNvbXBsZXRlZCBieSB0aGlzLnNlZWtcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5jYWxsQ29tcGxldGVDYWxsYmFjaygpO1xyXG5cdFx0XHR0aGlzLl9raWxsZWQgPSB0cnVlO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fZWxhcHNlZFRpbWUgKz0gZHQ7XHJcblx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9lbmRlZCAhPSAwKSB7XHJcblx0XHRcdGlmICghdGhpcy5fa2lsbGVkKSB7XHJcblx0XHRcdFx0dGhpcy5jYWxsQ29tcGxldGVDYWxsYmFjaygpO1xyXG5cdFx0XHRcdHRoaXMuX2tpbGxlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGUoZHQ/OiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdGlmKGR0IT1udWxsKXtcclxuXHRcdFx0aWYgKHRoaXMuX3RpbWVTY2FsZSAhPSAxKVxyXG5cdFx0XHRcdGR0ICo9IHRoaXMuX3RpbWVTY2FsZTtcclxuXHRcdFx0aWYgKGR0ID09IDApXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgKz0gZHQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fZW5kZWQgPSAwO1xyXG5cdFx0dmFyIF9kdXJhdGlvbj10aGlzLl9kdXJhdGlvbjtcclxuXHRcdGlmICh0aGlzLl92YWx1ZVNpemUgPT0gMCkgLy9EZWxheWVkQ2FsbFxyXG5cdFx0e1xyXG5cdFx0XHRpZiAodGhpcy5fZWxhcHNlZFRpbWUgPj0gdGhpcy5fZGVsYXkgKyBfZHVyYXRpb24pXHJcblx0XHRcdFx0dGhpcy5fZW5kZWQgPSAxO1xyXG5cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGhpcy5fc3RhcnRlZCkge1xyXG5cdFx0XHRpZiAodGhpcy5fZWxhcHNlZFRpbWUgPCB0aGlzLl9kZWxheSlcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHR0aGlzLl9zdGFydGVkID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5jYWxsU3RhcnRDYWxsYmFjaygpO1xyXG5cdFx0XHRpZiAodGhpcy5fa2lsbGVkKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcmV2ZXJzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHZhciB0dDogbnVtYmVyID0gdGhpcy5fZWxhcHNlZFRpbWUgLSB0aGlzLl9kZWxheTtcclxuXHRcdGlmICh0aGlzLl9icmVha3BvaW50ID49IDAgJiYgdHQgPj0gdGhpcy5fYnJlYWtwb2ludCkge1xyXG5cdFx0XHR0dCA9IHRoaXMuX2JyZWFrcG9pbnQ7XHJcblx0XHRcdHRoaXMuX2VuZGVkID0gMjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fcmVwZWF0ICE9IDApIHtcclxuXHRcdFx0dmFyIHJvdW5kOiBudW1iZXIgPSBNYXRoLmZsb29yKHR0IC8gX2R1cmF0aW9uKTtcclxuXHRcdFx0dHQgLT0gX2R1cmF0aW9uICogcm91bmQ7XHJcblx0XHRcdGlmICh0aGlzLl95b3lvKVxyXG5cdFx0XHRcdHJldmVyc2VkID0gcm91bmQgJSAyID09IDE7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcmVwZWF0ID4gMCAmJiB0aGlzLl9yZXBlYXQgLSByb3VuZCA8IDApIHtcclxuXHRcdFx0XHRpZiAodGhpcy5feW95bylcclxuXHRcdFx0XHRcdHJldmVyc2VkID0gdGhpcy5fcmVwZWF0ICUgMiA9PSAxO1xyXG5cdFx0XHRcdHR0ID0gX2R1cmF0aW9uO1xyXG5cdFx0XHRcdHRoaXMuX2VuZGVkID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodHQgPj0gX2R1cmF0aW9uKSB7XHJcblx0XHRcdHR0ID0gX2R1cmF0aW9uO1xyXG5cdFx0XHR0aGlzLl9lbmRlZCA9IDE7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fbm9ybWFsaXplZFRpbWUgPSBXRWFzZU1hbmFnZXIuZXZhbHVhdGUodGhpcy5fZWFzZVR5cGUsIHJldmVyc2VkID8gKF9kdXJhdGlvbiAtIHR0KSA6IHR0LCBfZHVyYXRpb24sXHJcblx0XHRcdHRoaXMuX2Vhc2VPdmVyc2hvb3RPckFtcGxpdHVkZSwgdGhpcy5fZWFzZVBlcmlvZCk7XHJcblxyXG5cdFx0dGhpcy5fdmFsdWUuc2V0WmVybygpO1xyXG5cdFx0dGhpcy5fZGVsdGFWYWx1ZS5zZXRaZXJvKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX3ZhbHVlU2l6ZSA9PSA1KSB7XHJcblx0XHRcdGlmICh0aGlzLl9lbmRlZCA9PSAwKSB7XHJcblx0XHRcdFx0dmFyIHI6IG51bWJlciA9IHRoaXMuX3N0YXJ0VmFsdWUudyAqICgxIC0gdGhpcy5fbm9ybWFsaXplZFRpbWUpO1xyXG5cdFx0XHRcdHZhciByeDogbnVtYmVyID0gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiByO1xyXG5cdFx0XHRcdHZhciByeTogbnVtYmVyID0gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiByO1xyXG5cdFx0XHRcdHJ4ID0gcnggPiAwID8gTWF0aC5jZWlsKHJ4KSA6IE1hdGguZmxvb3IocngpO1xyXG5cdFx0XHRcdHJ5ID0gcnkgPiAwID8gTWF0aC5jZWlsKHJ5KSA6IE1hdGguZmxvb3IocnkpO1xyXG5cclxuXHRcdFx0XHR0aGlzLl9kZWx0YVZhbHVlLnggPSByeDtcclxuXHRcdFx0XHR0aGlzLl9kZWx0YVZhbHVlLnkgPSByeTtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS54ID0gdGhpcy5fc3RhcnRWYWx1ZS54ICsgcng7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUueSA9IHRoaXMuX3N0YXJ0VmFsdWUueSArIHJ5O1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnggPSB0aGlzLl9zdGFydFZhbHVlLng7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUueSA9IHRoaXMuX3N0YXJ0VmFsdWUueTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLl92YWx1ZVNpemU7IGkrKykge1xyXG5cdFx0XHRcdHZhciBuMTogbnVtYmVyID0gdGhpcy5fc3RhcnRWYWx1ZS5nZXRGaWVsZChpKTtcclxuXHRcdFx0XHR2YXIgbjI6IG51bWJlciA9IHRoaXMuX2VuZFZhbHVlLmdldEZpZWxkKGkpO1xyXG5cdFx0XHRcdHZhciBmOiBudW1iZXIgPSBuMSArIChuMiAtIG4xKSAqIHRoaXMuX25vcm1hbGl6ZWRUaW1lO1xyXG5cdFx0XHRcdGlmICh0aGlzLl9zbmFwcGluZylcclxuXHRcdFx0XHRcdGYgPSBNYXRoLnJvdW5kKGYpO1xyXG5cdFx0XHRcdHRoaXMuX2RlbHRhVmFsdWUuc2V0RmllbGQoaSwgZiAtIHRoaXMuX3ZhbHVlLmdldEZpZWxkKGkpKTtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS5zZXRGaWVsZChpLCBmKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl90YXJnZXQgIT0gbnVsbCAmJiB0aGlzLl9wcm9wVHlwZSAhPSBudWxsKSB7XHJcblx0XHRcdGlmICh0aGlzLl9wcm9wVHlwZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcblx0XHRcdFx0c3dpdGNoICh0aGlzLl92YWx1ZVNpemUpIHtcclxuXHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0dGhpcy5fcHJvcFR5cGUuY2FsbCh0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0dGhpcy5fcHJvcFR5cGUuY2FsbCh0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnkpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHRcdFx0dGhpcy5fcHJvcFR5cGUuY2FsbCh0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnksIHRoaXMuX3ZhbHVlLnopO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNDpcclxuXHRcdFx0XHRcdFx0dGhpcy5fcHJvcFR5cGUuY2FsbCh0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnksIHRoaXMuX3ZhbHVlLnosIHRoaXMuX3ZhbHVlLncpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNTpcclxuXHRcdFx0XHRcdFx0dGhpcy5fcHJvcFR5cGUuY2FsbCh0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLmNvbG9yKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDY6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHRoaXMuX3Byb3BUeXBlIGluc3RhbmNlb2YgTGF5YS5IYW5kbGVyKSB7XHJcblx0XHRcdFx0dmFyIGFycj1bXTtcclxuXHRcdFx0XHRzd2l0Y2ggKHRoaXMuX3ZhbHVlU2l6ZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHRhcnI9W3RoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueF07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0XHRhcnI9W3RoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueV07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdFx0XHRhcnI9W3RoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSwgdGhpcy5fdmFsdWUuel07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA0OlxyXG5cdFx0XHRcdFx0XHRhcnI9W3RoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSwgdGhpcy5fdmFsdWUueiwgdGhpcy5fdmFsdWUud107XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA1OlxyXG5cdFx0XHRcdFx0XHRhcnI9W3RoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUuY29sb3JdO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNjpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnldO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5fcHJvcFR5cGUucnVuV2l0aChhcnIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGlmICh0aGlzLl92YWx1ZVNpemUgPT0gNSlcclxuXHRcdFx0XHRcdHRoaXMuX3RhcmdldFt0aGlzLl9wcm9wVHlwZV0gPSB0aGlzLl92YWx1ZS5jb2xvcjtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR0aGlzLl90YXJnZXRbdGhpcy5fcHJvcFR5cGVdID0gdGhpcy5fdmFsdWUueDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuY2FsbFVwZGF0ZUNhbGxiYWNrKCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNhbGxTdGFydENhbGxiYWNrKCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX29uU3RhcnQgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAoV1R3ZWVuLmNhdGNoQ2FsbGJhY2tFeGNlcHRpb25zKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXMuX29uU3RhcnQuY2FsbCh0aGlzLl9vblN0YXJ0Q2FsbGVyLCB0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJGYWlyeUdVSTogZXJyb3IgaW4gc3RhcnQgY2FsbGJhY2sgPiBcIiArIGVyci5tZXNzYWdlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRoaXMuX29uU3RhcnQuY2FsbCh0aGlzLl9vblN0YXJ0Q2FsbGVyLCB0aGlzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY2FsbFVwZGF0ZUNhbGxiYWNrKCkge1xyXG5cdFx0aWYgKHRoaXMuX29uVXBkYXRlICE9IG51bGwpIHtcclxuXHRcdFx0aWYgKFdUd2Vlbi5jYXRjaENhbGxiYWNrRXhjZXB0aW9ucykge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR0aGlzLl9vblVwZGF0ZS5jYWxsKHRoaXMuX29uVXBkYXRlQ2FsbGVyLCB0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJGYWlyeUdVSTogZXJyb3IgaW4gdGhpcy51cGRhdGUgY2FsbGJhY2sgPiBcIiArIGVyci5tZXNzYWdlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRoaXMuX29uVXBkYXRlLmNhbGwodGhpcy5fb25VcGRhdGVDYWxsZXIsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjYWxsQ29tcGxldGVDYWxsYmFjaygpIHtcclxuXHRcdGlmICh0aGlzLl9vbkNvbXBsZXRlICE9IG51bGwpIHtcclxuXHRcdFx0aWYgKFdUd2Vlbi5jYXRjaENhbGxiYWNrRXhjZXB0aW9ucykge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR0aGlzLl9vbkNvbXBsZXRlLmNhbGwodGhpcy5fb25Db21wbGV0ZUNhbGxlciwgdGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRmFpcnlHVUk6IGVycm9yIGluIGNvbXBsZXRlIGNhbGxiYWNrID4gXCIgKyBlcnIubWVzc2FnZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLl9vbkNvbXBsZXRlLmNhbGwodGhpcy5fb25Db21wbGV0ZUNhbGxlciwgdGhpcyk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlNYXRDb25maWcge1xuXG4gICAgcHVibGljIHN0YXRpYyBtYXRDb25maWc9W1xue1xuXCJjX21hdE5hbWVcIjpcImRhb18xXCIsXCJpbml0RGF0YVwiOntcblwic2hhZGVyTmFtZVwiOlwiV215TGF5YV93bXlMYnRcIixcIl9BbGJlZG9JbnRlbnNpdHlcIjpcIjFcIixcIl9BbHBoYUJsZW5kXCI6XCIwXCIsXCJfQWxwaGFUZXN0XCI6XCIwXCIsXCJfQ3VsbFwiOlwiMlwiLFwiX0N1dG9mZlwiOlwiMC4wMVwiLFwiX0RzdEJsZW5kXCI6XCIwXCIsXCJfR2xvc3NcIjpcIjMwXCIsXCJfSXNWZXJ0ZXhDb2xvclwiOlwiMFwiLFwiX0xpZ2h0aW5nXCI6XCIwXCIsXCJfTW9kZVwiOlwiMFwiLFwiX1JlbmRlclF1ZXVlXCI6XCIyMDAwXCIsXCJfU2hpbmluZXNzXCI6XCIwLjA3ODEyNVwiLFwiX1NwZWN1bGFyU291cmNlXCI6XCIwXCIsXCJfU3JjQmxlbmRcIjpcIjFcIixcIl9aVGVzdFwiOlwiNFwiLFwiX1pXcml0ZVwiOlwiMVwiLFwiX0NvbG9yXCI6XCIxLDEsMSwxXCIsXCJfU3BlY0NvbG9yXCI6XCIwLjUsMC41LDAuNSwxXCIsXCJfU3BlY3VsYXJcIjpcIjAuMjY0NzA1OSwwLjI2NDcwNTksMC4yNjQ3MDU5LDFcIixcIl93Q29sb3JcIjpcIjEsMC43NjgzODIyNSwwLjY2OTExNzcsMVwifSxcInRhcmdldFVybEFyclwiOltcbntcblwidXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS81MF9DMlVfZGFvXzFcIixcIm1hdElkXCI6MH1cbl19XG5dO1xufVxuIiwiLyp3bXnniYjmnKxfMjAxOC8xLzMvMTkuMzEqL1xyXG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcclxuaW1wb3J0IFdteU1hdENvbmZpZyBmcm9tICcuL1dteU1hdENvbmZpZyc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteU1hdE1hZyBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuICAgIHB1YmxpYyBvbkF3YWtlKCkge1xyXG4gICAgICAgIHZhciBzaGFkZXJNYWc9cmVxdWlyZSgnLi4vd215U2hhZGVycy9XbXlTaGFkZXJNYWcnKVsnZGVmYXVsdCddO2lmKHNoYWRlck1hZyluZXcgc2hhZGVyTWFnKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBXbXlNYXRDb25maWcubWF0Q29uZmlnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXRPYmogPSBXbXlNYXRDb25maWcubWF0Q29uZmlnW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmFkZE1hdChtYXRPYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZE1hdChtYXRPYmope1xyXG4gICAgICAgIGlmKG1hdE9iaj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIGNfbWF0TmFtZT1tYXRPYmpbJ2NfbWF0TmFtZSddO1xyXG4gICAgICAgIHZhciBpbml0RGF0YT1tYXRPYmpbJ2luaXREYXRhJ107XHJcbiAgICAgICAgdmFyIHRhcmdldFVybEFycj1tYXRPYmpbJ3RhcmdldFVybEFyciddO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGFyZ2V0VXJsQXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmw9dGFyZ2V0VXJsQXJyW2pdWyd1cmwnXTtcclxuICAgICAgICAgICAgdmFyIG1hdElkPXRhcmdldFVybEFycltqXVsnbWF0SWQnXTtcclxuICAgICAgICAgICAgdmFyIHRhcmdldDNEPVdteU1hdE1hZy5nZXRPYmozZFVybCh0aGlzLnNjZW5lM0QsdXJsKTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0M0QhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNYXRlcmlhbCh0YXJnZXQzRCxpbml0RGF0YSxtYXRJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE1hdGVyaWFsKHRhcmdldCxpbml0RGF0YSxtYXRJZD0wLHNoYWRlck5hbWU/LGlzTmV3TWF0ZXJpYT8pe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldCk7XHJcbiAgICAgICAgaWYodGFyZ2V0PT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKHNoYWRlck5hbWU9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHNoYWRlck5hbWU9aW5pdERhdGEuc2hhZGVyTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc2hhZGVyTmFtZT09dW5kZWZpbmVkKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBzaGFkZXI9TGF5YS5TaGFkZXIzRC5maW5kKHNoYWRlck5hbWUpO1xyXG4gICAgICAgIGlmKHNoYWRlcj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIHJlbmRlcmVyO1xyXG4gICAgICAgIHZhciBzaGFyZWRNYXRlcmlhbDpMYXlhLkJhc2VNYXRlcmlhbDtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICByZW5kZXJlcj0odGFyZ2V0KS5za2lubmVkTWVzaFJlbmRlcmVyO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJlcj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9cmVuZGVyZXIubWF0ZXJpYWxzW21hdElkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgcmVuZGVyZXI9KHRhcmdldCkubWVzaFJlbmRlcmVyO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJlcj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9cmVuZGVyZXIubWF0ZXJpYWxzW21hdElkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHNoYXJlZE1hdGVyaWFsPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ+ayoeaciXNoYXJlZE1hdGVyaWFsOicsdGFyZ2V0LHNoYWRlck5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaXNOZXdNYXRlcmlhKXtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9c2hhcmVkTWF0ZXJpYWwuY2xvbmUoKTtcclxuICAgICAgICAgICAgcmVuZGVyZXIubWF0ZXJpYWxzW21hdElkXT1zaGFyZWRNYXRlcmlhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcmVkTWF0ZXJpYWwuc2V0U2hhZGVyTmFtZShzaGFkZXJOYW1lKTtcclxuICAgICAgICAvL+a4suafk+aooeW8j1xyXG4gICAgICAgIHZhciB2c1BzQXJyPXNoYWRlclsnd192c1BzQXJyJ107XHJcbiAgICAgICAgaWYodnNQc0Fycil7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdnNQc0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlckRhdGFPYmogPSB2c1BzQXJyW2ldWzJdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJlbmRlckRhdGFPYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyRGF0YU9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNoYXJlZE1hdGVyaWFsLmhhc093blByb3BlcnR5KGtleSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWxba2V5XT1yZW5kZXJEYXRhT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlbmRlclN0YXRlPXNoYXJlZE1hdGVyaWFsLmdldFJlbmRlclN0YXRlKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZW5kZXJTdGF0ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlclN0YXRlW2tleV09cmVuZGVyRGF0YU9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v5Yid5aeL5YC8XHJcbiAgICAgICAgaWYgKHNoYWRlclsnd191bmlmb3JtTWFwJ10gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2hhZGVyWyd3X3VuaWZvcm1NYXAnXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNoYWRlclsnd191bmlmb3JtTWFwJ10uaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbml0SWQ9c2hhZGVyWyd3X3VuaWZvcm1NYXAnXVtrZXldWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbml0Vj1pbml0RGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGluaXRWIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdFYgPSBpbml0Vi5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpbml0Vi5sZW5ndGg9PTQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcihpbml0SWQsbmV3IExheWEuVmVjdG9yNChwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSxwYXJzZUZsb2F0KGluaXRWWzJdKSxwYXJzZUZsb2F0KGluaXRWWzNdKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0zKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IoaW5pdElkLG5ldyBMYXlhLlZlY3RvcjMocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkscGFyc2VGbG9hdChpbml0VlsyXSkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09Mil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKGluaXRJZCxuZXcgTGF5YS5WZWN0b3IyKHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzTmFOKHBhcnNlRmxvYXQoaW5pdFZbMF0pKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXROdW1iZXIoaW5pdElkLHBhcnNlRmxvYXQoaW5pdFZbMF0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0ck9iaj1pbml0VlswXSsnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdHJPYmo9PSd0ZXgnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRleE9iaj1pbml0RGF0YVsnVEVYQCcra2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGV4T2JqIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXRoPXRleE9ialsncGF0aCddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZChwYXRoLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoX2luaXRJZCx0ZXgpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGV4PT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4PW5ldyBMYXlhLlRleHR1cmUyRCgwLDAsMCx0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRUZXh0dXJlKF9pbml0SWQsdGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sW2luaXRJZF0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzaGFyZWRNYXRlcmlhbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIFNwcml0ZTNEX1NoYWRlclZhbHVlcyh0YXJnZXQsdmFsdWVOYW1lLHZhbHVlLG1hdHNJZCl7XHJcbiAgICAgICAgdmFyIHRPYmpBcnI9V215TWF0TWFnLmdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxMYXlhLlJlbmRlcmFibGVTcHJpdGUzRCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0T2JqQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByUDNkID0gdE9iakFycltpXTtcclxuICAgICAgICAgICAgV215TWF0TWFnLlJlbmRlcmFibGVTcHJpdGUzRF9TaGFkZXJWYWx1ZXMoclAzZCx2YWx1ZU5hbWUsdmFsdWUsbWF0c0lkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW1cdHRhcmdldFx05a+56LGhXHJcbiAgICAgKiBAcGFyYW1cdHZhbHVlTmFtZSDlgLznmoTlkI3lrZdcclxuICAgICAqIEBwYXJhbVx0dmFsdWVcdOWAvFxyXG4gICAgICogQHBhcmFtXHRtYXRzSWRcdOadkOi0qOeQg0lEXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgUmVuZGVyYWJsZVNwcml0ZTNEX1NoYWRlclZhbHVlcyh0YXJnZXQsdmFsdWVOYW1lLHZhbHVlLG1hdHNJZCkge1xyXG4gICAgICAgIGlmKG1hdHNJZD09bnVsbCltYXRzSWQ9LTE7XHJcbiAgICAgICAgdmFyIHJlbmRlcmVyPXRhcmdldFsnbWVzaFJlbmRlcmVyJ107XHJcbiAgICAgICAgaWYocmVuZGVyZXI9PW51bGwpe1xyXG4gICAgICAgICAgICByZW5kZXJlcj10YXJnZXRbJ3NraW5uZWRNZXNoUmVuZGVyZXInXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXJlbmRlcmVyKXJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgbXM9cmVuZGVyZXIuc2hhcmVkTWF0ZXJpYWxzO1xyXG4gICAgICAgIGlmKG1zLmxlbmd0aDw9MClyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGlzTWF0c0lkPW1hdHNJZDwwP2ZhbHNlOnRydWU7XHJcblxyXG4gICAgICAgIHZhciBpc09LPXRydWU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbSA9IG1zW2ldO1xyXG4gICAgICAgICAgICB2YXIgdW5pZm9ybU1hcD0gbS5fc2hhZGVyLl91bmlmb3JtTWFwW3ZhbHVlTmFtZV07XHJcbiAgICAgICAgICAgIGlmKCF1bmlmb3JtTWFwKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZihpc01hdHNJZCl7XHJcbiAgICAgICAgICAgICAgICBpZihtYXRzSWQhPWkpY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZUlkPXVuaWZvcm1NYXBbMF07XHJcbiAgICAgICAgICAgICAgICBpZih2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4pe1xyXG4gICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRCb29sKHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZighaXNOYU4odmFsdWUpKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdj12YWx1ZSsnJztcclxuICAgICAgICAgICAgICAgICAgICBpZih2LmluZGV4T2YoJy4nKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldEludCh2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldE51bWJlcih2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHZhbHVlIGluc3RhbmNlb2YgTGF5YS5CYXNlVmVjdG9yKXtcclxuICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih2YWx1ZSBpbnN0YW5jZW9mIExheWEuUXVhdGVybmlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldFF1YXRlcm5pb24odmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHZhbHVlIGluc3RhbmNlb2YgTGF5YS5NYXRyaXg0eDQpe1xyXG4gICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRNYXRyaXg0eDQodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHZhbHVlIGluc3RhbmNlb2YgTGF5YS5UZXh0dXJlKXtcclxuICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0VGV4dHVyZSh2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNPSz1mYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGlzT0s9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzT0s7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBvbkluc3RhbmNlTmFtZShuYW1lKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlPW51bGw7XHJcblx0XHR0cnkge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUod2luZG93W25hbWVdLnByb3RvdHlwZSk7XHJcblx0XHRcdGluc3RhbmNlLmNvbnN0cnVjdG9yLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iamVjdENsYXNzKG9iaikge1xyXG4gICAgICAgIGlmIChvYmogJiYgb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAvKlxyXG4gICAgICAgICAgICogZm9yIGJyb3dzZXJzIHdoaWNoIGhhdmUgbmFtZSBwcm9wZXJ0eSBpbiB0aGUgY29uc3RydWN0b3JcclxuICAgICAgICAgICAqIG9mIHRoZSBvYmplY3Qsc3VjaCBhcyBjaHJvbWUgXHJcbiAgICAgICAgICAgKi9cclxuICAgICAgICAgIGlmKG9iai5jb25zdHJ1Y3Rvci5uYW1lKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5uYW1lO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIHN0ciA9IG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpO1xyXG4gICAgICAgICAgLypcclxuICAgICAgICAgICAqIGV4ZWN1dGVkIGlmIHRoZSByZXR1cm4gb2Ygb2JqZWN0LmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkgaXMgXHJcbiAgICAgICAgICAgKiAnW29iamVjdCBvYmplY3RDbGFzc10nXHJcbiAgICAgICAgICAgKi9cclxuICAgICAgICAgIGlmKHN0ci5jaGFyQXQoMCkgPT0gJ1snKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gc3RyLm1hdGNoKC9cXFtcXHcrXFxzKihcXHcrKVxcXS8pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogZXhlY3V0ZWQgaWYgdGhlIHJldHVybiBvZiBvYmplY3QuY29uc3RydWN0b3IudG9TdHJpbmcoKSBpcyBcclxuICAgICAgICAgICAgICogJ2Z1bmN0aW9uIG9iamVjdENsYXNzICgpIHt9J1xyXG4gICAgICAgICAgICAgKiBmb3IgSUUgRmlyZWZveFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIGFyciA9IHN0ci5tYXRjaCgvZnVuY3Rpb25cXHMqKFxcdyspLyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoYXJyICYmIGFyci5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICAgcmV0dXJuIGFyclsxXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyBcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRDaGlsZHJlbkNvbXBvbmVudCh0YXJnZXQsY2xhcz8sYXJyPykge1xyXG4gICAgICAgIGlmKGFycj09bnVsbClhcnI9W107XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvYmo9dGFyZ2V0LmdldENvbXBvbmVudChjbGFzKTtcclxuICAgICAgICBpZihvYmo9PW51bGwpe1xyXG4gICAgICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBjbGFzKXtcclxuICAgICAgICAgICAgICAgIG9iaj10YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqIT1udWxsICYmIGFyci5pbmRleE9mKG9iaik8MCl7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5fY2hpbGRyZW49PW51bGwpIHJldHVybiBhcnI7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbyA9IHRhcmdldC5fY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRyZW5Db21wb25lbnQobyxjbGFzLGFycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmozZFVybCh0YXJnZXQsdXJsOnN0cmluZyl7XHJcbiAgICAgICAgdmFyIGFyclVybD11cmwuc3BsaXQoJy8nKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0T2JqQXJyVXJsKHRhcmdldCxhcnJVcmwpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIF9nZXRPYmpBcnJVcmwodGFyZ2V0LHVybEFycjpBcnJheTxzdHJpbmc+LGlkPTApe1xyXG4gICAgICAgIHZhciBfdGFyZ2V0OkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKF90YXJnZXQ9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIG5hPXVybEFycltpZF07XHJcbiAgICAgICAgdmFyIHRhcmdldE9iaj1fdGFyZ2V0LmdldENoaWxkQnlOYW1lKG5hKTtcclxuICAgICAgICBpZih0YXJnZXRPYmo9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYoaWQ+PXVybEFyci5sZW5ndGgtMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHRhcmdldE9iaj10aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0T2JqLHVybEFyciwrK2lkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgIH1cclxufVxyXG4iLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZV9XbXlTaGFkZXJ7XHJcbiAgICBwcm90ZWN0ZWQgX19hdHRyaWJ1dGVNYXA9e1xyXG4gICAgICAgICdhX1Bvc2l0aW9uJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9QT1NJVElPTjAqLzAsXHJcbiAgICAgICAgJ2FfQ29sb3InOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX0NPTE9SMCovMSxcclxuICAgICAgICAnYV9Ob3JtYWwnOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX05PUk1BTDAqLzMsXHJcbiAgICAgICAgJ2FfVGV4Y29vcmQwJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9URVhUVVJFQ09PUkRJTkFURTAqLzIsXHJcbiAgICAgICAgJ2FfVGV4Y29vcmQxJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9URVhUVVJFQ09PUkRJTkFURTEqLzgsXHJcbiAgICAgICAgJ2FfQm9uZVdlaWdodHMnOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX0JMRU5EV0VJR0hUMCovNyxcclxuICAgICAgICAnYV9Cb25lSW5kaWNlcyc6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfQkxFTkRJTkRJQ0VTMCovNixcclxuICAgICAgICAnYV9UYW5nZW50MCc6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfVEFOR0VOVDAqLzUsXHJcbiAgICAgICAgLy92YXIgdW5pZm9ybU1hcDpPYmplY3QgPSB7J3VfTXZwTWF0cml4JzogW1Nwcml0ZTNELk1WUE1BVFJJWCwgU2hhZGVyM0QuUEVSSU9EX1NQUklURV0sICd1X1dvcmxkTWF0JzogW1Nwcml0ZTNELldPUkxETUFUUklYLCBTaGFkZXIzRC5QRVJJT0RfU1BSSVRFXX07XHJcbiAgICB9O1xyXG4gICAgcHJvdGVjdGVkIF9fdW5pZm9ybU1hcD17XHJcbiAgICAgICAgJ3VfQm9uZXMnOlsgLypsYXlhLmQzLmNvcmUuU2tpbm5lZE1lc2hTcHJpdGUzRC5CT05FUyovMCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9DVVNUT00qLzBdLFxyXG4gICAgICAgICd1X0RpZmZ1c2VUZXh0dXJlJzpbIC8qbGF5YS5kMy5jb3JlLm1hdGVyaWFsLkJsaW5uUGhvbmdNYXRlcmlhbC5BTEJFRE9URVhUVVJFKi8xLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9TcGVjdWxhclRleHR1cmUnOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLlNQRUNVTEFSVEVYVFVSRSovMywvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTCovMV0sXHJcbiAgICAgICAgJ3VfTm9ybWFsVGV4dHVyZSc6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuTk9STUFMVEVYVFVSRSovMiwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTCovMV0sXHJcbiAgICAgICAgJ3VfQWxwaGFUZXN0VmFsdWUnOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmFzZU1hdGVyaWFsLkFMUEhBVEVTVFZBTFVFKi8wLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9EaWZmdXNlQ29sb3InOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLkFMQkVET0NPTE9SKi81LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9NYXRlcmlhbFNwZWN1bGFyJzpbIC8qbGF5YS5kMy5jb3JlLm1hdGVyaWFsLkJsaW5uUGhvbmdNYXRlcmlhbC5NQVRFUklBTFNQRUNVTEFSKi82LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9TaGluaW5lc3MnOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLlNISU5JTkVTUyovNywvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTCovMV0sXHJcbiAgICAgICAgJ3VfVGlsaW5nT2Zmc2V0JzpbIC8qbGF5YS5kMy5jb3JlLm1hdGVyaWFsLkJsaW5uUGhvbmdNYXRlcmlhbC5USUxJTkdPRkZTRVQqLzgsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X1dvcmxkTWF0JzpbTGF5YS5TcHJpdGUzRC5XT1JMRE1BVFJJWCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TUFJJVEUqLzJdLFxyXG4gICAgICAgICd1X012cE1hdHJpeCc6W0xheWEuU3ByaXRlM0QuTVZQTUFUUklYLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NQUklURSovMl0sXHJcbiAgICAgICAgJ3VfTGlnaHRtYXBTY2FsZU9mZnNldCc6W0xheWEuUmVuZGVyYWJsZVNwcml0ZTNELkxJR0hUTUFQU0NBTEVPRkZTRVQsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU1BSSVRFKi8yXSxcclxuICAgICAgICAndV9MaWdodE1hcCc6W0xheWEuUmVuZGVyYWJsZVNwcml0ZTNELkxJR0hUTUFQLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NQUklURSovMl0sXHJcbiAgICAgICAgJ3VfQ2FtZXJhUG9zJzpbIC8qbGF5YS5kMy5jb3JlLkJhc2VDYW1lcmEuQ0FNRVJBUE9TKi8wLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX0NBTUVSQSovM10sXHJcbiAgICAgICAgJ3VfUmVmbGVjdFRleHR1cmUnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5SRUZMRUNUSU9OVEVYVFVSRSovMjIsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1JlZmxlY3RJbnRlbnNpdHknOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5SRUZMRVRJT05JTlRFTlNJVFkqLzIzLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9Gb2dTdGFydCc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELkZPR1NUQVJUKi8xLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9Gb2dSYW5nZSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELkZPR1JBTkdFKi8yLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9Gb2dDb2xvcic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELkZPR0NPTE9SKi8wLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9EaXJlY3Rpb25MaWdodC5Db2xvcic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELkxJR0hURElSQ09MT1IqLzQsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0RpcmVjdGlvbkxpZ2h0LkRpcmVjdGlvbic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELkxJR0hURElSRUNUSU9OKi8zLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9Qb2ludExpZ2h0LlBvc2l0aW9uJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuUE9JTlRMSUdIVFBPUyovNSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfUG9pbnRMaWdodC5SYW5nZSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlBPSU5UTElHSFRSQU5HRSovNiwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfUG9pbnRMaWdodC5Db2xvcic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlBPSU5UTElHSFRDT0xPUiovOCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfU3BvdExpZ2h0LlBvc2l0aW9uJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU1BPVExJR0hUUE9TKi85LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9TcG90TGlnaHQuRGlyZWN0aW9uJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU1BPVExJR0hURElSRUNUSU9OKi8xMCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfU3BvdExpZ2h0LlJhbmdlJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU1BPVExJR0hUUkFOR0UqLzEyLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9TcG90TGlnaHQuU3BvdCc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNQT1RMSUdIVFNQT1RBTkdMRSovMTEsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1Nwb3RMaWdodC5Db2xvcic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNQT1RMSUdIVENPTE9SKi8xNCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfQW1iaWVudENvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuQU1CSUVOVENPTE9SKi8yMSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3Vfc2hhZG93TWFwMSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNIQURPV01BUFRFWFRVUkUxKi8xOCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3Vfc2hhZG93TWFwMic6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNIQURPV01BUFRFWFRVUkUyKi8xOSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3Vfc2hhZG93TWFwMyc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNIQURPV01BUFRFWFRVUkUzKi8yMCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3Vfc2hhZG93UFNTTURpc3RhbmNlJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XRElTVEFOQ0UqLzE1LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9saWdodFNoYWRvd1ZQJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XTElHSFRWSUVXUFJPSkVDVCovMTYsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X3NoYWRvd1BDRm9mZnNldCc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlNIQURPV01BUFBDRk9GRlNFVCovMTcsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1RpbWUnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5USU1FKi8yNCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfUE1hdHJpeCc6WzIsIDNdLFxyXG4gICAgICAgICd1X1ZNYXRyaXgnOlsxLCAzXSxcclxuICAgIH07XHJcbiAgICBwcm90ZWN0ZWQgX3ZzUHNBcnI9W107XHJcbiAgICBwcm90ZWN0ZWQgX3NoYWRlcj1udWxsO1xyXG4gICAgcHJvdGVjdGVkIF9zaGFkZXJOYW1lO1xyXG4gICAgcHJvdGVjdGVkIF9hdHRyaWJ1dGVNYXA9e307XHJcbiAgICBwcm90ZWN0ZWQgX3VuaWZvcm1NYXA9e307XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBpbml0KCl7XHJcblxyXG4gICAgfVxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIHZhciBzcHJpdGVEZWZpbmVzPUxheWEuU2tpbm5lZE1lc2hTcHJpdGUzRC5zaGFkZXJEZWZpbmVzO1xyXG4gICAgICAgIHZhciBtYXRlcmlhbERlZmluZXM9TGF5YS5CbGlublBob25nTWF0ZXJpYWwuc2hhZGVyRGVmaW5lcztcclxuICAgICAgICB0aGlzLl9zaGFkZXI9TGF5YS5TaGFkZXIzRC5hZGQodGhpcy5fc2hhZGVyTmFtZSx0aGlzLl9fYXR0cmlidXRlTWFwLHRoaXMuX191bmlmb3JtTWFwLHNwcml0ZURlZmluZXMsbWF0ZXJpYWxEZWZpbmVzKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9zaGFkZXJbJ3dfdW5pZm9ybU1hcCddPXRoaXMuX3VuaWZvcm1NYXA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9hdHRyaWJ1dGVNYXApIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2F0dHJpYnV0ZU1hcC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fYXR0cmlidXRlTWFwW2tleV0gPSB0aGlzLl9hdHRyaWJ1dGVNYXBba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fdW5pZm9ybU1hcCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdW5pZm9ybU1hcC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91bmlmb3JtTWFwW2tleV1bMV09TGF5YS5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fdW5pZm9ybU1hcFtrZXldID0gdGhpcy5fdW5pZm9ybU1hcFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zaGFkZXJbJ3dfdnNQc0FyciddPXRoaXMuX3ZzUHNBcnI7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX3ZzUHNBcnIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZzUHNBcnIuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZzcHM9dGhpcy5fdnNQc0FycltrZXldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhZGVyLmFkZFNoYWRlclBhc3ModnNwc1swXSx2c3BzWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uU2V0VnNQcyh2cyxwcyxyZW5kZXJEYXRhKXtcclxuICAgICAgICBpZiAodnMgIT0gbnVsbCAmJiBwcyE9bnVsbCkge1xyXG4gICAgICAgICAgICB2cz10aGlzLm9uU2V0VnModnMpO1xyXG4gICAgICAgICAgICBwcz10aGlzLm9uU2V0UHMocHMpO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJEYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHJlbmRlckRhdGE9e307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdnNQc0Fyci5wdXNoKFt2cyxwcyxyZW5kZXJEYXRhXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvblNldFZzKHZzKXtcclxuICAgICAgICBpZih2cz09bnVsbClyZXR1cm4gJyc7XHJcbiAgICAgICAgaWYodnMuaW5kZXhPZignd215TWFpbignKTwwKXJldHVybiB2cztcclxuICAgICAgICB2YXIgX1ZzPWBcclxuI2luY2x1ZGUgJ0xpZ2h0aW5nLmdsc2wnO1xyXG5cclxuYXR0cmlidXRlIHZlYzQgYV9Qb3NpdGlvbjtcclxudW5pZm9ybSBtYXQ0IHVfTXZwTWF0cml4O1xyXG5cclxuYXR0cmlidXRlIHZlYzIgYV9UZXhjb29yZDA7XHJcbiNpZiBkZWZpbmVkKERJRkZVU0VNQVApfHwoKGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVCkpJiYoZGVmaW5lZChTUEVDVUxBUk1BUCl8fGRlZmluZWQoTk9STUFMTUFQKSkpfHwoZGVmaW5lZChMSUdIVE1BUCkmJmRlZmluZWQoVVYpKVxyXG4gICAgdmFyeWluZyB2ZWMyIHZfVGV4Y29vcmQwO1xyXG4jZW5kaWZcclxuXHJcbiNpZiBkZWZpbmVkKExJR0hUTUFQKSYmZGVmaW5lZChVVjEpXHJcbiAgICBhdHRyaWJ1dGUgdmVjMiBhX1RleGNvb3JkMTtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgTElHSFRNQVBcclxuICAgIHVuaWZvcm0gdmVjNCB1X0xpZ2h0bWFwU2NhbGVPZmZzZXQ7XHJcbiAgICB2YXJ5aW5nIHZlYzIgdl9MaWdodE1hcFVWO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBDT0xPUlxyXG4gICAgYXR0cmlidXRlIHZlYzQgYV9Db2xvcjtcclxuICAgIHZhcnlpbmcgdmVjNCB2X0NvbG9yO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBCT05FXHJcbiAgICBjb25zdCBpbnQgY19NYXhCb25lQ291bnQgPSAyNDtcclxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfQm9uZUluZGljZXM7XHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX0JvbmVXZWlnaHRzO1xyXG4gICAgdW5pZm9ybSBtYXQ0IHVfQm9uZXNbY19NYXhCb25lQ291bnRdO1xyXG4jZW5kaWZcclxuXHJcbmF0dHJpYnV0ZSB2ZWMzIGFfTm9ybWFsO1xyXG52YXJ5aW5nIHZlYzMgdl9Ob3JtYWw7IFxyXG51bmlmb3JtIHZlYzMgdV9DYW1lcmFQb3M7XHJcbnZhcnlpbmcgdmVjMyB2X1ZpZXdEaXI7IFxyXG5hdHRyaWJ1dGUgdmVjNCBhX1RhbmdlbnQwO1xyXG52YXJ5aW5nIG1hdDMgd29ybGRJbnZNYXQ7XHJcbnZhcnlpbmcgdmVjMyB2X1Bvc2l0aW9uO1xyXG5cclxudmFyeWluZyB2ZWMzIHZfVGFuZ2VudDtcclxudmFyeWluZyB2ZWMzIHZfQmlub3JtYWw7XHJcblxyXG51bmlmb3JtIG1hdDQgdV9Xb3JsZE1hdDtcclxudmFyeWluZyB2ZWMzIHZfUG9zaXRpb25Xb3JsZDtcclxuXHJcbnZhcnlpbmcgZmxvYXQgdl9wb3NWaWV3WjtcclxuI2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuICAgICNpZmRlZiBTSEFET1dNQVBfUFNTTTEgXHJcbiAgICB2YXJ5aW5nIHZlYzQgdl9saWdodE1WUFBvcztcclxuICAgIHVuaWZvcm0gbWF0NCB1X2xpZ2h0U2hhZG93VlBbNF07XHJcbiAgICAjZW5kaWZcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgVElMSU5HT0ZGU0VUXHJcbiAgICB1bmlmb3JtIHZlYzQgdV9UaWxpbmdPZmZzZXQ7XHJcbiNlbmRpZlxyXG5cclxudm9pZCBtYWluX2Nhc3RTaGFkb3coKVxyXG57XHJcbiAgICAjaWZkZWYgQk9ORVxyXG4gICAgICAgIG1hdDQgc2tpblRyYW5zZm9ybSA9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueCldICogYV9Cb25lV2VpZ2h0cy54O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy55KV0gKiBhX0JvbmVXZWlnaHRzLnk7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLnopXSAqIGFfQm9uZVdlaWdodHMuejtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMudyldICogYV9Cb25lV2VpZ2h0cy53O1xyXG4gICAgICAgIHZlYzQgcG9zaXRpb249c2tpblRyYW5zZm9ybSphX1Bvc2l0aW9uO1xyXG4gICAgICAgIHZfUG9zaXRpb249cG9zaXRpb24ueHl6O1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBwb3NpdGlvbjtcclxuICAgICNlbHNlXHJcbiAgICAgICAgdl9Qb3NpdGlvbj1hX1Bvc2l0aW9uLnh5ejtcclxuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfTXZwTWF0cml4ICogYV9Qb3NpdGlvbjtcclxuICAgICNlbmRpZlxyXG4gICAgICAgIFxyXG4gICAgLy9UT0RP5rKh6ICD6JmRVVbliqjnlLvlkaJcclxuICAgICNpZiBkZWZpbmVkKERJRkZVU0VNQVApJiZkZWZpbmVkKEFMUEhBVEVTVClcclxuICAgICAgICB2X1RleGNvb3JkMD1hX1RleGNvb3JkMDtcclxuICAgICNlbmRpZlxyXG4gICAgICAgIHZfcG9zVmlld1ogPSBnbF9Qb3NpdGlvbi56O1xyXG59XHJcblxyXG5tYXQzIGludmVyc2UobWF0MyBtKSB7XHJcbiAgICBmbG9hdCBhMDAgPSBtWzBdWzBdLCBhMDEgPSBtWzBdWzFdLCBhMDIgPSBtWzBdWzJdO1xyXG4gICAgZmxvYXQgYTEwID0gbVsxXVswXSwgYTExID0gbVsxXVsxXSwgYTEyID0gbVsxXVsyXTtcclxuICAgIGZsb2F0IGEyMCA9IG1bMl1bMF0sIGEyMSA9IG1bMl1bMV0sIGEyMiA9IG1bMl1bMl07XHJcblxyXG4gICAgZmxvYXQgYjAxID0gYTIyICogYTExIC0gYTEyICogYTIxO1xyXG4gICAgZmxvYXQgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMDtcclxuICAgIGZsb2F0IGIyMSA9IGEyMSAqIGExMCAtIGExMSAqIGEyMDtcclxuXHJcbiAgICBmbG9hdCBkZXQgPSBhMDAgKiBiMDEgKyBhMDEgKiBiMTEgKyBhMDIgKiBiMjE7XHJcblxyXG4gICAgcmV0dXJuIG1hdDMoYjAxLCAoLWEyMiAqIGEwMSArIGEwMiAqIGEyMSksIChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpLFxyXG4gICAgICAgICAgICAgICAgYjExLCAoYTIyICogYTAwIC0gYTAyICogYTIwKSwgKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApLFxyXG4gICAgICAgICAgICAgICAgYjIxLCAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCksIChhMTEgKiBhMDAgLSBhMDEgKiBhMTApKSAvIGRldDtcclxufVxyXG5cclxudm9pZCBtYWluX25vcm1hbCgpXHJcbntcclxuICAgICNpZmRlZiBCT05FXHJcbiAgICAgICAgbWF0NCBza2luVHJhbnNmb3JtID0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy54KV0gKiBhX0JvbmVXZWlnaHRzLng7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLnkpXSAqIGFfQm9uZVdlaWdodHMueTtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueildICogYV9Cb25lV2VpZ2h0cy56O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy53KV0gKiBhX0JvbmVXZWlnaHRzLnc7XHJcbiAgICAgICAgdmVjNCBwb3NpdGlvbj1za2luVHJhbnNmb3JtKmFfUG9zaXRpb247XHJcbiAgICAgICAgdl9Qb3NpdGlvbj1wb3NpdGlvbi54eXo7XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X012cE1hdHJpeCAqIHBvc2l0aW9uO1xyXG4gICAgI2Vsc2VcclxuICAgICAgICB2X1Bvc2l0aW9uPWFfUG9zaXRpb24ueHl6O1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBhX1Bvc2l0aW9uO1xyXG4gICAgI2VuZGlmXHJcblxyXG4gICAgI2lmZGVmIEJPTkVcclxuICAgICAgICB3b3JsZEludk1hdD1pbnZlcnNlKG1hdDModV9Xb3JsZE1hdCpza2luVHJhbnNmb3JtKSk7XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIHdvcmxkSW52TWF0PWludmVyc2UobWF0Myh1X1dvcmxkTWF0KSk7XHJcbiAgICAjZW5kaWYgIFxyXG4gICAgdl9Ob3JtYWw9YV9Ob3JtYWwqd29ybGRJbnZNYXQ7XHJcblxyXG4gICAgdl9UYW5nZW50PWFfVGFuZ2VudDAueHl6KndvcmxkSW52TWF0O1xyXG4gICAgdl9CaW5vcm1hbD1jcm9zcyh2X05vcm1hbCx2X1RhbmdlbnQpKmFfVGFuZ2VudDAudztcclxuXHJcbiAgICAjaWZkZWYgQk9ORVxyXG4gICAgICAgIHZfUG9zaXRpb25Xb3JsZD0odV9Xb3JsZE1hdCpwb3NpdGlvbikueHl6O1xyXG4gICAgI2Vsc2VcclxuICAgICAgICB2X1Bvc2l0aW9uV29ybGQ9KHVfV29ybGRNYXQqYV9Qb3NpdGlvbikueHl6O1xyXG4gICAgI2VuZGlmXHJcbiAgICBcclxuICAgIHZfVmlld0Rpcj11X0NhbWVyYVBvcy12X1Bvc2l0aW9uV29ybGQ7XHJcblxyXG4gICAgI2lmIGRlZmluZWQoRElGRlVTRU1BUCl8fCgoZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKSkmJihkZWZpbmVkKFNQRUNVTEFSTUFQKXx8ZGVmaW5lZChOT1JNQUxNQVApKSlcclxuICAgICAgICB2X1RleGNvb3JkMD1hX1RleGNvb3JkMDtcclxuICAgICAgICAjaWZkZWYgVElMSU5HT0ZGU0VUXHJcbiAgICAgICAgICAgIHZfVGV4Y29vcmQwPVRyYW5zZm9ybVVWKHZfVGV4Y29vcmQwLHVfVGlsaW5nT2Zmc2V0KTtcclxuICAgICAgICAjZW5kaWZcclxuICAgICNlbmRpZlxyXG5cclxuICAgICNpZmRlZiBMSUdIVE1BUFxyXG4gICAgICAgICNpZmRlZiBTQ0FMRU9GRlNFVExJR0hUSU5HTUFQVVZcclxuICAgICAgICAgICAgI2lmZGVmIFVWMVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPXZlYzIoYV9UZXhjb29yZDEueCwxLjAtYV9UZXhjb29yZDEueSkqdV9MaWdodG1hcFNjYWxlT2Zmc2V0Lnh5K3VfTGlnaHRtYXBTY2FsZU9mZnNldC56dztcclxuICAgICAgICAgICAgI2Vsc2VcclxuICAgICAgICAgICAgICAgIHZfTGlnaHRNYXBVVj12ZWMyKGFfVGV4Y29vcmQwLngsMS4wLWFfVGV4Y29vcmQwLnkpKnVfTGlnaHRtYXBTY2FsZU9mZnNldC54eSt1X0xpZ2h0bWFwU2NhbGVPZmZzZXQuenc7XHJcbiAgICAgICAgICAgICNlbmRpZiBcclxuICAgICAgICAgICAgdl9MaWdodE1hcFVWLnk9MS4wLXZfTGlnaHRNYXBVVi55O1xyXG4gICAgICAgICNlbHNlXHJcbiAgICAgICAgICAgICNpZmRlZiBVVjFcclxuICAgICAgICAgICAgICAgIHZfTGlnaHRNYXBVVj1hX1RleGNvb3JkMTtcclxuICAgICAgICAgICAgI2Vsc2VcclxuICAgICAgICAgICAgICAgIHZfTGlnaHRNYXBVVj1hX1RleGNvb3JkMDtcclxuICAgICAgICAgICAgI2VuZGlmIFxyXG4gICAgICAgICNlbmRpZiBcclxuICAgICNlbmRpZlxyXG5cclxuICAgICNpZiBkZWZpbmVkKENPTE9SKSYmZGVmaW5lZChFTkFCTEVWRVJURVhDT0xPUilcclxuICAgICAgICB2X0NvbG9yPWFfQ29sb3I7XHJcbiAgICAjZW5kaWZcclxuXHJcbiAgICAjaWZkZWYgUkVDRUlWRVNIQURPV1xyXG4gICAgICAgIHZfcG9zVmlld1ogPSBnbF9Qb3NpdGlvbi53O1xyXG4gICAgICAgICNpZmRlZiBTSEFET1dNQVBfUFNTTTEgXHJcbiAgICAgICAgICAgIHZfbGlnaHRNVlBQb3MgPSB1X2xpZ2h0U2hhZG93VlBbMF0gKiB2ZWM0KHZfUG9zaXRpb25Xb3JsZCwxLjApO1xyXG4gICAgICAgICNlbmRpZlxyXG4gICAgI2VuZGlmXHJcbn1cclxuXHJcbi8vLS13bXktbWFpbi0tLS0tLS0tLS0tLS0tLS0tXHJcbm1hdDMgTUFUUklYX0lUX01WKG1hdDQgTW9kZWxWaWV3TWF0cml4KSB7XHJcbiAgICByZXR1cm4gaW52ZXJzZShtYXQzKE1vZGVsVmlld01hdHJpeCkpO1xyXG59XHJcbm1hdDMgZ2V0Um90YXRpb24odmVjNCB3VGFuZ2VudCwgdmVjMyB3Tm9ybWFsKSB7XHJcbiAgICB2ZWMzIGJpbm9ybWFsID0gY3Jvc3Mod05vcm1hbC54eXosIHdUYW5nZW50Lnh5eikgKiAtd1RhbmdlbnQudztcclxuICAgIG1hdDMgcm90YXRpb24gPSBtYXQzKFxyXG4gICAgICAgIHdUYW5nZW50LngsIGJpbm9ybWFsLngsIHdOb3JtYWwueCxcclxuICAgICAgICB3VGFuZ2VudC55LCBiaW5vcm1hbC55LCB3Tm9ybWFsLnksXHJcbiAgICAgICAgd1RhbmdlbnQueiwgYmlub3JtYWwueiwgd05vcm1hbC56KTtcclxuICAgIHJldHVybiByb3RhdGlvbjtcclxufVxyXG4ke3ZzfVxyXG4vLy0td215LS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxudm9pZCBtYWluKClcclxue1xyXG4gICAgI2lmZGVmIENBU1RTSEFET1dcclxuICAgICAgICBtYWluX2Nhc3RTaGFkb3coKTtcclxuICAgICNlbHNlXHJcbiAgICAgICAgbWFpbl9ub3JtYWwoKTtcclxuICAgICAgICB3bXlNYWluKCk7XHJcbiAgICAjZW5kaWZcclxufSAgICAgICAgXHJcbiAgICAgICAgYDtcclxuICAgICAgICByZXR1cm4gX1ZzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgb25TZXRQcyhwcyl7XHJcbiAgICAgICAgaWYocHM9PW51bGwpcmV0dXJuICcnO1xyXG4gICAgICAgIGlmKHBzLmluZGV4T2YoJ3dteU1haW4oJyk8MClyZXR1cm4gcHM7XHJcbiAgICAgICAgdmFyIF9Qcz1gXHJcbiNpZmRlZiBISUdIUFJFQ0lTSU9OXHJcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcclxuI2Vsc2VcclxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XHJcbiNlbmRpZlxyXG5cclxuI2luY2x1ZGUgJ0xpZ2h0aW5nLmdsc2wnO1xyXG5cclxudW5pZm9ybSB2ZWM0IHVfRGlmZnVzZUNvbG9yO1xyXG5cclxuI2lmIGRlZmluZWQoQ09MT1IpJiZkZWZpbmVkKEVOQUJMRVZFUlRFWENPTE9SKVxyXG4gICAgdmFyeWluZyB2ZWM0IHZfQ29sb3I7XHJcbiNlbmRpZlxyXG5cclxudmFyeWluZyB2ZWMzIHZfVmlld0RpcjsgXHJcblxyXG4jaWZkZWYgQUxQSEFURVNUXHJcbiAgICB1bmlmb3JtIGZsb2F0IHVfQWxwaGFUZXN0VmFsdWU7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIERJRkZVU0VNQVBcclxuICAgIHVuaWZvcm0gc2FtcGxlcjJEIHVfRGlmZnVzZVRleHR1cmU7XHJcbiNlbmRpZlxyXG5cclxuI2lmIGRlZmluZWQoRElGRlVTRU1BUCl8fCgoZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKSkmJihkZWZpbmVkKFNQRUNVTEFSTUFQKXx8ZGVmaW5lZChOT1JNQUxNQVApKSlcclxuICAgIHZhcnlpbmcgdmVjMiB2X1RleGNvb3JkMDtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgTElHSFRNQVBcclxuICAgIHZhcnlpbmcgdmVjMiB2X0xpZ2h0TWFwVVY7XHJcbiAgICB1bmlmb3JtIHNhbXBsZXIyRCB1X0xpZ2h0TWFwO1xyXG4jZW5kaWZcclxuXHJcbiNpZiBkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpXHJcbiAgICB1bmlmb3JtIHZlYzMgdV9NYXRlcmlhbFNwZWN1bGFyO1xyXG4gICAgdW5pZm9ybSBmbG9hdCB1X1NoaW5pbmVzcztcclxuICAgICNpZmRlZiBTUEVDVUxBUk1BUCBcclxuICAgICAgICB1bmlmb3JtIHNhbXBsZXIyRCB1X1NwZWN1bGFyVGV4dHVyZTtcclxuICAgICNlbmRpZlxyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBGT0dcclxuICAgIHVuaWZvcm0gZmxvYXQgdV9Gb2dTdGFydDtcclxuICAgIHVuaWZvcm0gZmxvYXQgdV9Gb2dSYW5nZTtcclxuICAgIHVuaWZvcm0gdmVjMyB1X0ZvZ0NvbG9yO1xyXG4jZW5kaWZcclxuXHJcbnZhcnlpbmcgdmVjMyB2X05vcm1hbDtcclxudmFyeWluZyB2ZWMzIHZfUG9zaXRpb247XHJcblxyXG51bmlmb3JtIHNhbXBsZXIyRCB1X05vcm1hbFRleHR1cmU7XHJcbnZhcnlpbmcgdmVjMyB2X1RhbmdlbnQ7XHJcbnZhcnlpbmcgdmVjMyB2X0Jpbm9ybWFsO1xyXG5cclxuI2lmZGVmIERJUkVDVElPTkxJR0hUXHJcbiAgICB1bmlmb3JtIERpcmVjdGlvbkxpZ2h0IHVfRGlyZWN0aW9uTGlnaHQ7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIFBPSU5UTElHSFRcclxuICAgIHVuaWZvcm0gUG9pbnRMaWdodCB1X1BvaW50TGlnaHQ7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIFNQT1RMSUdIVFxyXG4gICAgdW5pZm9ybSBTcG90TGlnaHQgdV9TcG90TGlnaHQ7XHJcbiNlbmRpZlxyXG5cclxudW5pZm9ybSB2ZWMzIHVfQW1iaWVudENvbG9yO1xyXG5cclxuXHJcbiNpZiBkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVCl8fGRlZmluZWQoUkVDRUlWRVNIQURPVylcclxuICAgIHZhcnlpbmcgdmVjMyB2X1Bvc2l0aW9uV29ybGQ7XHJcbiNlbmRpZlxyXG5cclxuI2luY2x1ZGUgJ1NoYWRvd0hlbHBlci5nbHNsJ1xyXG52YXJ5aW5nIGZsb2F0IHZfcG9zVmlld1o7XHJcbiNpZmRlZiBSRUNFSVZFU0hBRE9XXHJcbiAgICAjaWYgZGVmaW5lZChTSEFET1dNQVBfUFNTTTIpfHxkZWZpbmVkKFNIQURPV01BUF9QU1NNMylcclxuICAgICAgICB1bmlmb3JtIG1hdDQgdV9saWdodFNoYWRvd1ZQWzRdO1xyXG4gICAgI2VuZGlmXHJcbiAgICAjaWZkZWYgU0hBRE9XTUFQX1BTU00xIFxyXG4gICAgICAgIHZhcnlpbmcgdmVjNCB2X2xpZ2h0TVZQUG9zO1xyXG4gICAgI2VuZGlmXHJcbiNlbmRpZlxyXG5cclxudm9pZCBtYWluX2Nhc3RTaGFkb3coKVxyXG57XHJcbiAgICAvL2dsX0ZyYWdDb2xvcj12ZWM0KHZfcG9zVmlld1osMC4wLDAuMCwxLjApO1xyXG4gICAgZ2xfRnJhZ0NvbG9yPXBhY2tEZXB0aCh2X3Bvc1ZpZXdaKTtcclxuICAgICNpZiBkZWZpbmVkKERJRkZVU0VNQVApJiZkZWZpbmVkKEFMUEhBVEVTVClcclxuICAgICAgICBmbG9hdCBhbHBoYSA9IHRleHR1cmUyRCh1X0RpZmZ1c2VUZXh0dXJlLHZfVGV4Y29vcmQwKS53O1xyXG4gICAgICAgIGlmKCBhbHBoYSA8IHVfQWxwaGFUZXN0VmFsdWUgKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlzY2FyZDtcclxuICAgICAgICB9XHJcbiAgICAjZW5kaWZcclxufVxyXG5cclxuLy8tLXdteS1tYWluLS0tLS0tLS0tLS0tLS0tLS1cclxudmVjNCBsZXJwVjQodmVjNCBhLCB2ZWM0IGIsIGZsb2F0IHMpIHsgcmV0dXJuIHZlYzQoYSArIChiIC0gYSkqcyk7IH1cclxudmVjMyBsZXJwVjModmVjMyBhLCB2ZWMzIGIsIGZsb2F0IHMpIHsgcmV0dXJuIHZlYzMoYSArIChiIC0gYSkqcyk7IH1cclxudmVjMiBsZXJwVjIodmVjMiBhLCB2ZWMyIGIsIGZsb2F0IHMpIHsgcmV0dXJuIHZlYzIoYSArIChiIC0gYSkqcyk7IH1cclxuZmxvYXQgbGVycEYoZmxvYXQgYSwgZmxvYXQgYiwgZmxvYXQgcykgeyByZXR1cm4gZmxvYXQoYSArIChiIC0gYSkgKiBzKTsgfVxyXG5mbG9hdCBzYXR1cmF0ZShmbG9hdCBuKSB7IHJldHVybiBjbGFtcChuLCAwLjAsIDEuMCk7IH1cclxudmVjMyBVbnBhY2tOb3JtYWwodmVjNCBwYWNrZWRub3JtYWwpIHtcclxuXHQvLyBUaGlzIGRvIHRoZSB0cmlja1xyXG5cdHBhY2tlZG5vcm1hbC54ICo9IHBhY2tlZG5vcm1hbC53O1xyXG5cdHZlYzMgbm9ybWFsO1xyXG5cdG5vcm1hbC54eSA9IHBhY2tlZG5vcm1hbC54eSAqIDIuMCAtIDEuMDtcclxuXHRub3JtYWwueiA9IHNxcnQoMS4wIC0gc2F0dXJhdGUoZG90KG5vcm1hbC54eSwgbm9ybWFsLnh5KSkpO1xyXG5cdHJldHVybiBub3JtYWw7XHJcbn1cclxuJHtwc31cclxuLy8tLXdteS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbnZvaWQgbWFpbl9ub3JtYWwoKVxyXG57XHJcblx0dmVjMyBnbG9iYWxEaWZmdXNlPXVfQW1iaWVudENvbG9yO1xyXG5cdCNpZmRlZiBMSUdIVE1BUFx0XHJcblx0XHRnbG9iYWxEaWZmdXNlICs9IERlY29kZUxpZ2h0bWFwKHRleHR1cmUyRCh1X0xpZ2h0TWFwLCB2X0xpZ2h0TWFwVVYpKTtcclxuXHQjZW5kaWZcclxuXHRcclxuXHQjaWYgZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKVxyXG5cdFx0dmVjMyBub3JtYWw7XHJcblx0XHQjaWYgKGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVCkpJiZkZWZpbmVkKE5PUk1BTE1BUClcclxuXHRcdFx0dmVjMyBub3JtYWxNYXBTYW1wbGUgPSB0ZXh0dXJlMkQodV9Ob3JtYWxUZXh0dXJlLCB2X1RleGNvb3JkMCkucmdiO1xyXG5cdFx0XHRub3JtYWwgPSBub3JtYWxpemUoTm9ybWFsU2FtcGxlVG9Xb3JsZFNwYWNlKG5vcm1hbE1hcFNhbXBsZSwgdl9Ob3JtYWwsIHZfVGFuZ2VudCx2X0Jpbm9ybWFsKSk7XHJcblx0XHQjZWxzZVxyXG5cdFx0XHRub3JtYWwgPSBub3JtYWxpemUodl9Ob3JtYWwpO1xyXG5cdFx0I2VuZGlmXHJcblx0XHR2ZWMzIHZpZXdEaXI9IG5vcm1hbGl6ZSh2X1ZpZXdEaXIpO1xyXG5cdCNlbmRpZlxyXG5cdFxyXG5cdHZlYzQgbWFpbkNvbG9yPXVfRGlmZnVzZUNvbG9yO1xyXG5cdCNpZmRlZiBESUZGVVNFTUFQXHJcblx0XHR2ZWM0IGRpZlRleENvbG9yPXRleHR1cmUyRCh1X0RpZmZ1c2VUZXh0dXJlLCB2X1RleGNvb3JkMCk7XHJcblx0XHRtYWluQ29sb3I9bWFpbkNvbG9yKmRpZlRleENvbG9yO1xyXG5cdCNlbmRpZiBcclxuXHQjaWYgZGVmaW5lZChDT0xPUikmJmRlZmluZWQoRU5BQkxFVkVSVEVYQ09MT1IpXHJcblx0XHRtYWluQ29sb3I9bWFpbkNvbG9yKnZfQ29sb3I7XHJcblx0I2VuZGlmIFxyXG4gICAgXHJcblx0I2lmZGVmIEFMUEhBVEVTVFxyXG5cdFx0aWYobWFpbkNvbG9yLmE8dV9BbHBoYVRlc3RWYWx1ZSlcclxuXHRcdFx0ZGlzY2FyZDtcclxuXHQjZW5kaWZcclxuICBcclxuXHR2ZWMzIGRpZmZ1c2UgPSB2ZWMzKDAuMCk7XHJcblx0dmVjMyBzcGVjdWxhcj0gdmVjMygwLjApO1xyXG5cdCNpZiBkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpXHJcblx0XHR2ZWMzIGRpZixzcGU7XHJcblx0XHQjaWZkZWYgU1BFQ1VMQVJNQVBcclxuXHRcdFx0dmVjMyBnbG9zcz10ZXh0dXJlMkQodV9TcGVjdWxhclRleHR1cmUsIHZfVGV4Y29vcmQwKS5yZ2I7XHJcblx0XHQjZWxzZVxyXG5cdFx0XHQjaWZkZWYgRElGRlVTRU1BUFxyXG5cdFx0XHRcdHZlYzMgZ2xvc3M9dmVjMyhkaWZUZXhDb2xvci5hKTtcclxuXHRcdFx0I2Vsc2VcclxuXHRcdFx0XHR2ZWMzIGdsb3NzPXZlYzMoMS4wKTtcclxuXHRcdFx0I2VuZGlmXHJcblx0XHQjZW5kaWZcclxuXHQjZW5kaWZcclxuXHJcblx0I2lmZGVmIERJUkVDVElPTkxJR0hUXHJcblx0XHRMYXlhQWlyQmxpbm5QaG9uZ0RpZWN0aW9uTGlnaHQodV9NYXRlcmlhbFNwZWN1bGFyLHVfU2hpbmluZXNzLG5vcm1hbCxnbG9zcyx2aWV3RGlyLHVfRGlyZWN0aW9uTGlnaHQsZGlmLHNwZSk7XHJcblx0XHRkaWZmdXNlKz1kaWY7XHJcblx0XHRzcGVjdWxhcis9c3BlO1xyXG5cdCNlbmRpZlxyXG4gXHJcblx0I2lmZGVmIFBPSU5UTElHSFRcclxuXHRcdExheWFBaXJCbGlublBob25nUG9pbnRMaWdodCh2X1Bvc2l0aW9uV29ybGQsdV9NYXRlcmlhbFNwZWN1bGFyLHVfU2hpbmluZXNzLG5vcm1hbCxnbG9zcyx2aWV3RGlyLHVfUG9pbnRMaWdodCxkaWYsc3BlKTtcclxuXHRcdGRpZmZ1c2UrPWRpZjtcclxuXHRcdHNwZWN1bGFyKz1zcGU7XHJcblx0I2VuZGlmXHJcblxyXG5cdCNpZmRlZiBTUE9UTElHSFRcclxuXHRcdExheWFBaXJCbGlublBob25nU3BvdExpZ2h0KHZfUG9zaXRpb25Xb3JsZCx1X01hdGVyaWFsU3BlY3VsYXIsdV9TaGluaW5lc3Msbm9ybWFsLGdsb3NzLHZpZXdEaXIsdV9TcG90TGlnaHQsZGlmLHNwZSk7XHJcblx0XHRkaWZmdXNlKz1kaWY7XHJcblx0XHRzcGVjdWxhcis9c3BlO1xyXG5cdCNlbmRpZlxyXG5cdFxyXG5cdCNpZmRlZiBSRUNFSVZFU0hBRE9XXHJcblx0XHRmbG9hdCBzaGFkb3dWYWx1ZSA9IDEuMDtcclxuXHRcdCNpZmRlZiBTSEFET1dNQVBfUFNTTTNcclxuXHRcdFx0c2hhZG93VmFsdWUgPSBnZXRTaGFkb3dQU1NNMyggdV9zaGFkb3dNYXAxLHVfc2hhZG93TWFwMix1X3NoYWRvd01hcDMsdV9saWdodFNoYWRvd1ZQLHVfc2hhZG93UFNTTURpc3RhbmNlLHVfc2hhZG93UENGb2Zmc2V0LHZfUG9zaXRpb25Xb3JsZCx2X3Bvc1ZpZXdaLDAuMDAxKTtcclxuXHRcdCNlbmRpZlxyXG5cdFx0I2lmZGVmIFNIQURPV01BUF9QU1NNMlxyXG5cdFx0XHRzaGFkb3dWYWx1ZSA9IGdldFNoYWRvd1BTU00yKCB1X3NoYWRvd01hcDEsdV9zaGFkb3dNYXAyLHVfbGlnaHRTaGFkb3dWUCx1X3NoYWRvd1BTU01EaXN0YW5jZSx1X3NoYWRvd1BDRm9mZnNldCx2X1Bvc2l0aW9uV29ybGQsdl9wb3NWaWV3WiwwLjAwMSk7XHJcblx0XHQjZW5kaWYgXHJcblx0XHQjaWZkZWYgU0hBRE9XTUFQX1BTU00xXHJcblx0XHRcdHNoYWRvd1ZhbHVlID0gZ2V0U2hhZG93UFNTTTEoIHVfc2hhZG93TWFwMSx2X2xpZ2h0TVZQUG9zLHVfc2hhZG93UFNTTURpc3RhbmNlLHVfc2hhZG93UENGb2Zmc2V0LHZfcG9zVmlld1osMC4wMDEpO1xyXG5cdFx0I2VuZGlmXHJcblx0XHQvL2dsX0ZyYWdDb2xvciA9dmVjNChtYWluQ29sb3IucmdiKihnbG9iYWxEaWZmdXNlICsgZGlmZnVzZSkqc2hhZG93VmFsdWUsbWFpbkNvbG9yLmEpO1xyXG5cdFx0Ly9nbF9GcmFnQ29sb3IgPSB3bXlNYWluKG1haW5Db2xvciwoZ2xvYmFsRGlmZnVzZSArIGRpZmZ1c2UgKiBzaGFkb3dWYWx1ZSAqIDEuMSkpO1xyXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHdteU1haW4obWFpbkNvbG9yLGdsb2JhbERpZmZ1c2UsZGlmZnVzZSxzaGFkb3dWYWx1ZSk7XHJcblx0I2Vsc2VcclxuXHRcdC8vZ2xfRnJhZ0NvbG9yID12ZWM0KG1haW5Db2xvci5yZ2IqKGdsb2JhbERpZmZ1c2UgKyBkaWZmdXNlKSxtYWluQ29sb3IuYSk7XHJcblx0XHRnbF9GcmFnQ29sb3IgPSB3bXlNYWluKG1haW5Db2xvcixnbG9iYWxEaWZmdXNlLGRpZmZ1c2UsMS4wKTtcclxuXHQjZW5kaWZcclxuICAgIC8qXHJcblx0I2lmIGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVClcclxuXHRcdCNpZmRlZiBSRUNFSVZFU0hBRE9XXHJcblx0XHRcdGdsX0ZyYWdDb2xvci5yZ2IrPXNwZWN1bGFyKnNoYWRvd1ZhbHVlO1xyXG5cdFx0I2Vsc2VcclxuXHRcdFx0Z2xfRnJhZ0NvbG9yLnJnYis9c3BlY3VsYXI7XHJcblx0XHQjZW5kaWZcclxuXHQjZW5kaWZcclxuXHQqL1xyXG5cdCNpZmRlZiBGT0dcclxuXHRcdGZsb2F0IGxlcnBGYWN0PWNsYW1wKCgxLjAvZ2xfRnJhZ0Nvb3JkLnctdV9Gb2dTdGFydCkvdV9Gb2dSYW5nZSwwLjAsMS4wKTtcclxuXHRcdGdsX0ZyYWdDb2xvci5yZ2I9bWl4KGdsX0ZyYWdDb2xvci5yZ2IsdV9Gb2dDb2xvcixsZXJwRmFjdCk7XHJcblx0I2VuZGlmXHJcbn1cclxuXHJcbnZvaWQgbWFpbigpXHJcbntcclxuXHQjaWZkZWYgQ0FTVFNIQURPV1x0XHRcclxuXHRcdG1haW5fY2FzdFNoYWRvdygpO1xyXG5cdCNlbHNlXHJcblx0XHRtYWluX25vcm1hbCgpO1xyXG5cdCNlbmRpZiAgXHJcbn1cclxuICAgICAgICBgO1xyXG4gICAgICAgIHJldHVybiBfUHM7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZV9XbXlTaGFkZXIgZnJvbSBcIi4vQmFzZV9XbXlTaGFkZXJcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215TGF5YV93bXlMYnQgZXh0ZW5kcyBCYXNlX1dteVNoYWRlciB7XHJcbiAgICBwdWJsaWMgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMuX3NoYWRlck5hbWU9dGhpcy5jb25zdHJ1Y3RvclsnbmFtZSddO1xyXG4gICAgICAgIHRoaXMuX3VuaWZvcm1NYXA9e1xyXG5cdFx0XHQnX3dDb2xvcic6WzEwMDBdLFxyXG5cdFx0XHQnX1NwZWN1bGFyJzpbMTAwMV0sXHJcblx0XHRcdCdfR2xvc3MnOlsxMDAyXSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB2c3BzQXJyPVtdO1xyXG4gICAgICAgIC8vcGFzczAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbnZzcHNBcnJbMF09W107XHJcbi8vdnNcclxudnNwc0FyclswXVswXT1gXHJcbnVuaWZvcm0gdmVjNCBfd0NvbG9yO1xyXG51bmlmb3JtIG1hdDQgX09iamVjdDJXb3JsZDtcclxudW5pZm9ybSB2ZWM0IF9TcGVjdWxhcjtcclxudW5pZm9ybSBmbG9hdCBfR2xvc3M7XHJcblxyXG52YXJ5aW5nIHZlYzMgZ193b3JsZE5vcm1hbDtcclxudmFyeWluZyB2ZWMzIGdfd29ybGRWaWV3RGlyO1xyXG5cclxudm9pZCB3bXlNYWluKCl7XHJcblxyXG4gICAgZ193b3JsZE5vcm1hbCA9IHZfTm9ybWFsO1xyXG4gICAgZ193b3JsZE5vcm1hbC54Kj0tMS4wO1xyXG5cdGdfd29ybGRWaWV3RGlyID0gdl9WaWV3RGlyO1xyXG5cclxufVxyXG5gXHJcbi8vcHNcclxudnNwc0FyclswXVsxXT1gXHJcbnVuaWZvcm0gdmVjNCBfd0NvbG9yO1xyXG51bmlmb3JtIG1hdDQgX09iamVjdDJXb3JsZDtcclxudW5pZm9ybSB2ZWM0IF9TcGVjdWxhcjtcclxudW5pZm9ybSBmbG9hdCBfR2xvc3M7XHJcblxyXG52YXJ5aW5nIHZlYzMgZ193b3JsZE5vcm1hbDtcclxudmFyeWluZyB2ZWMzIGdfd29ybGRWaWV3RGlyO1xyXG5cclxudmVjNCB3bXlNYWluKHZlYzQgX21haW5Db2xvciwgdmVjMyBfZ2xvYmFsRGlmZnVzZSwgdmVjMyBfZGlmZnVzZSwgZmxvYXQgc2hhZG93VmFsdWUpe1xyXG4gICAgdmVjNCB3bXlDb2xvcj1fbWFpbkNvbG9yO1xyXG5cclxuXHR2ZWMzIGFtYmllbnQgPXVfQW1iaWVudENvbG9yLzIuMDtcclxuXHR2ZWMzIGxpZ2h0RGlyID0gbm9ybWFsaXplKC11X0RpcmVjdGlvbkxpZ2h0LkRpcmVjdGlvbi54eXopO1xyXG5cdGZsb2F0IGhhbGZMYW1iZXJ0ID0gZG90KGdfd29ybGROb3JtYWwsIGxpZ2h0RGlyKSAqIDAuNSArIDEuMDtcclxuXHR2ZWMzIGRpZmZ1c2UgPSB1X0RpcmVjdGlvbkxpZ2h0LkNvbG9yLnJnYiAqIGhhbGZMYW1iZXJ0ICpfd0NvbG9yLnJnYjtcclxuXHRcdFx0XHRcclxuXHR2ZWMzIGNvbG9yID0gZGlmZnVzZTtcclxuXHJcblx0dmVjMyB2aWV3RGlyID0gbm9ybWFsaXplKGdfd29ybGRWaWV3RGlyKTtcclxuXHR2ZWMzIGhhbGZEaXIgPSBub3JtYWxpemUodmlld0RpciArIGxpZ2h0RGlyKTtcclxuXHR2ZWMzIHNwZWN1bGFyID0gdmVjMygwLjApO1xyXG5cdHNwZWN1bGFyID0gX1NwZWN1bGFyLnJnYiAqIHBvdyhtYXgoZG90KGdfd29ybGROb3JtYWwsIGhhbGZEaXIpLCAwLjApLCBfR2xvc3MpO1xyXG5cdGNvbG9yICs9IHNwZWN1bGFyO1xyXG5cclxuICAgIGNvbG9yICo9IDEuNTtcclxuICAgIGNvbG9yKz1zaGFkb3dWYWx1ZSowLjE7XHJcblx0d215Q29sb3IgPSB2ZWM0KGNvbG9yLCAxLjApO1xyXG5cclxuLy9cclxucmV0dXJuIHdteUNvbG9yO1xyXG59XHJcbmBcclxuLy/muLLmn5PmqKHlvI9cclxudnNwc0FyclswXVsyXT17fTtcclxuXHJcbiAgICAgICAgLy9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZzcHNBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdnNwcyA9IHZzcHNBcnJbaV07XHJcbiAgICAgICAgICAgIHRoaXMub25TZXRWc1BzKHZzcHNbMF0sIHZzcHNbMV0sIHZzcHNbMl0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteVNoYWRlck1hZ3tcclxuICAgIHByaXZhdGUgb2JqO1xyXG5cdGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5vYmo9cmVxdWlyZSgnLi9XbXlMYXlhX3dteUxidCcpWydkZWZhdWx0J107aWYodGhpcy5vYmopbmV3IHRoaXMub2JqKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCIvKndteeeJiOacrF8yMDE4LzEyLzMwLyovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdteVUzZEltcG9ydCB7XG5wdWJsaWMgc3RhdGljIFRzX0RMaWdodD1yZXF1aXJlKCcuL3RzL1RzX0RMaWdodCcpWydkZWZhdWx0J107XG5wdWJsaWMgc3RhdGljIFRzX1NjZW5lPXJlcXVpcmUoJy4vdHMvVHNfU2NlbmUnKVsnZGVmYXVsdCddO1xucHVibGljIHN0YXRpYyBUc19DNERWZXRleEFuaW1hdG9yPXJlcXVpcmUoJy4vdHMvVHNfQzREVmV0ZXhBbmltYXRvcicpWydkZWZhdWx0J107XG5wdWJsaWMgc3RhdGljIFRzX01hdHM9cmVxdWlyZSgnLi90cy9Uc19NYXRzJylbJ2RlZmF1bHQnXTtcclxuLy/mianlsZVcclxucHVibGljIHN0YXRpYyBXbXlDNERWZXRleEFuaW1hdG9yPXJlcXVpcmUoJy4uL193bXlVdGlsc0g1L2QzL2M0ZC9XbXlDNERWZXRleEFuaW1hdG9yJylbJ2RlZmF1bHQnXTtcclxucHVibGljIHN0YXRpYyBXbXlQaHlzaWNzX0NoYXJhY3Rlcj1yZXF1aXJlKCcuLi9fd215VXRpbHNINS9kMy9waHlzaWNzL1dteVBoeXNpY3NXb3JsZF9DaGFyYWN0ZXInKVsnZGVmYXVsdCddO1xyXG4vL0xheWFcclxucHVibGljIHN0YXRpYyBBbmltYXRvcj1MYXlhLkFuaW1hdG9yO1xyXG4vL1xyXG5wdWJsaWMgc3RhdGljIGdldENsYXNzKG5hbWUpe1xyXG4gICAgcmV0dXJuIHRoaXNbbmFtZV07XHJcbn1cclxufVxyXG4iLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215VTNkVHNDb25maWcge1xyXG4gICAgcHVibGljIHN0YXRpYyB0c0NvbmZpZz1bXG57XCJjX3RzXCI6XCJUc19NYXRzXCIsXG5cInRhcmdldFVybEFyclwiOltcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zNV9DMlVfXFx1NUU3M1xcdTk3NjIxXzE1L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMV9DMlVfXFx1NUU3M1xcdTk3NjIxXzExL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80Nl9DMlVfXFx1NUU3M1xcdTk3NjIxXzI2L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yOF9DMlVfXFx1NUU3M1xcdTk3NjIxXzgvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMwX0MyVV9cXHU1RTczXFx1OTc2MjFfMTAvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIwX0MyVV9cXHU1RTczXFx1OTc2MjEvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMzX0MyVV9cXHU1RTczXFx1OTc2MjFfMTMvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI2X0MyVV9cXHU1RTczXFx1OTc2MjFfNi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzJfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjNfQzJVX1xcdTVFNzNcXHU5NzYyMV8zL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yOV9DMlVfXFx1NUU3M1xcdTk3NjIxXzkvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS8yMjBfQzJVX1xcdTVDNzEvMjIyX0MyVV9zaGFuXzFcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjRfQzJVX1xcdTVFNzNcXHU5NzYyMV80L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80Ml9DMlVfXFx1NUU3M1xcdTk3NjIxXzIyL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yN19DMlVfXFx1NUU3M1xcdTk3NjIxXzcvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ3X0MyVV9cXHU1RTczXFx1OTc2MjFfMjcvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ0X0MyVV9cXHU1RTczXFx1OTc2MjFfMjQvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM4X0MyVV9cXHU1RTczXFx1OTc2MjFfMTgvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI1X0MyVV9cXHU1RTczXFx1OTc2MjFfNS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzZfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNi93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjJfQzJVX1xcdTVFNzNcXHU5NzYyMV8yL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai80OV9DMlVfXFx1NUM5QjEvMjIwX0MyVV9cXHU1QzcxLzIyM19DMlVfc2hhbl8zXCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQwX0MyVV9cXHU1RTczXFx1OTc2MjFfMjAvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM3X0MyVV9cXHU1RTczXFx1OTc2MjFfMTcvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ4X0MyVV9cXHU1RTczXFx1OTc2MjFfMjgvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIxX0MyVV9cXHU1RTczXFx1OTc2MjFfMS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzIyMF9DMlVfXFx1NUM3MS8yMjRfQzJVX3NoYW5fNFwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai80OV9DMlVfXFx1NUM5QjEvMjIwX0MyVV9cXHU1QzcxLzIyMV9DMlVfc2hhbl8yXzFcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDVfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzUwX0MyVV9kYW9fMVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiRmFsc2VcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJUcnVlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zNF9DMlVfXFx1NUU3M1xcdTk3NjIxXzE0L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zOV9DMlVfXFx1NUU3M1xcdTk3NjIxXzE5L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80MV9DMlVfXFx1NUU3M1xcdTk3NjIxXzIxL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80M19DMlVfXFx1NUU3M1xcdTk3NjIxXzIzL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fVxuXX0sXG57XCJjX3RzXCI6XCJUc19DNERWZXRleEFuaW1hdG9yXCIsXG5cInRhcmdldFVybEFyclwiOltcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNV9DMlVfXFx1NUU3M1xcdTk3NjIxXzUvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80Ml9DMlVfXFx1NUU3M1xcdTk3NjIxXzIyL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDBfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIyX0MyVV9cXHU1RTczXFx1OTc2MjFfMi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM3X0MyVV9cXHU1RTczXFx1OTc2MjFfMTcvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yM19DMlVfXFx1NUU3M1xcdTk3NjIxXzMvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNl9DMlVfXFx1NUU3M1xcdTk3NjIxXzYvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80MV9DMlVfXFx1NUU3M1xcdTk3NjIxXzIxL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjBfQzJVX1xcdTVFNzNcXHU5NzYyMS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIxX0MyVV9cXHU1RTczXFx1OTc2MjFfMS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI5X0MyVV9cXHU1RTczXFx1OTc2MjFfOS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ1X0MyVV9cXHU1RTczXFx1OTc2MjFfMjUvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMV9DMlVfXFx1NUU3M1xcdTk3NjIxXzExL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjdfQzJVX1xcdTVFNzNcXHU5NzYyMV83L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDRfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQzX0MyVV9cXHU1RTczXFx1OTc2MjFfMjMvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMF9DMlVfXFx1NUU3M1xcdTk3NjIxXzEwL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzVfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI0X0MyVV9cXHU1RTczXFx1OTc2MjFfNC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMzX0MyVV9cXHU1RTczXFx1OTc2MjFfMTMvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zOF9DMlVfXFx1NUU3M1xcdTk3NjIxXzE4L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjhfQzJVX1xcdTVFNzNcXHU5NzYyMV84L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzlfQzJVX1xcdTVFNzNcXHU5NzYyMV8xOS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ3X0MyVV9cXHU1RTczXFx1OTc2MjFfMjcvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zNF9DMlVfXFx1NUU3M1xcdTk3NjIxXzE0L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzZfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMyX0MyVV9cXHU1RTczXFx1OTc2MjFfMTIvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80Nl9DMlVfXFx1NUU3M1xcdTk3NjIxXzI2L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDhfQzJVX1xcdTVFNzNcXHU5NzYyMV8yOC93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319XG5dfSxcbntcImNfdHNcIjpcIlRzX1NjZW5lXCIsXG5cInRhcmdldFVybEFyclwiOltcbntcInVybFwiOlwic2NlbmVcIixcblwiaW5pdERhdGFcIjp7fX1cbl19LFxue1wiY190c1wiOlwiVHNfRExpZ2h0XCIsXG5cInRhcmdldFVybEFyclwiOltcbntcInVybFwiOlwiRGlyZWN0aW9uYWwgbGlnaHRcIixcblwiaW5pdERhdGFcIjp7XCJjYW1lcmFVcmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri80X0MyVV9cXHU4RjY4XFx1OEZGOVxcdTUyQThcXHU3NTNCLzVfQzJVX3NoZXhpYW5namkvNl9DMlVfXFx1NjQ0NFxcdTUwQ0ZcXHU2NzNBXCIsXG5cImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwifX1cbl19XG5dO1xyXG59XHJcbiIsIi8qd21554mI5pysXzIwMTgvMTIvMjgvMTM6MTkqL1xyXG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcclxuaW1wb3J0IFdteVUzZFRzQ29uZmlnIGZyb20gJy4vV215VTNkVHNDb25maWcnO1xyXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4vV215VTNkSW1wb3J0JztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215VTNkVHNNYWcgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XHJcbiAgICBwdWJsaWMgb25Bd2FrZSgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFdteVUzZFRzQ29uZmlnLnRzQ29uZmlnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRzT2JqID0gV215VTNkVHNDb25maWcudHNDb25maWdbaV07XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVHModHNPYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZFRzKGNvbmZpZ09iail7XHJcbiAgICAgICAgaWYoY29uZmlnT2JqPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgY190cz1jb25maWdPYmpbJ2NfdHMnXTtcclxuICAgICAgICB2YXIgdHM9V215VTNkSW1wb3J0LmdldENsYXNzKGNfdHMpO1xyXG4gICAgICAgIHZhciB0YXJnZXRVcmxBcnI6c3RyaW5nPWNvbmZpZ09ialsndGFyZ2V0VXJsQXJyJ107XHJcbiAgICAgICAgaWYoIXRhcmdldFVybEFyciB8fCAhdHMpcmV0dXJuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFyZ2V0VXJsQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFVybERhdGEgPSB0YXJnZXRVcmxBcnJbaV07XHJcbiAgICAgICAgICAgIHZhciB1cmw9dGFyZ2V0VXJsRGF0YVsndXJsJ107XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQ9V215VTNkVHNNYWcuZ2V0T2JqM2RVcmwodGhpcy5zY2VuZTNELHVybCk7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3VHM9dGFyZ2V0LmFkZENvbXBvbmVudCh0cyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5pdERhdGE9dGFyZ2V0VXJsRGF0YVsnaW5pdERhdGEnXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBpbml0RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdUcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBWYWx1ZTphbnk9aW5pdERhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzTmFOKFZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihWYWx1ZS5pbmRleE9mKCcuJyk+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlPXBhcnNlRmxvYXQoVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWYWx1ZT1wYXJzZUludChWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKFZhbHVlLmluZGV4T2YoJ1RydWUnKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWU9dHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoVmFsdWUuaW5kZXhPZignRmFsc2UnKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWU9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VHNba2V5XSA9IFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBhcnJVcmw9dXJsLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldE9iakFyclVybCh0YXJnZXQsYXJyVXJsKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBfZ2V0T2JqQXJyVXJsKHRhcmdldCx1cmxBcnI6QXJyYXk8c3RyaW5nPixpZD0wKXtcclxuICAgICAgICB2YXIgX3RhcmdldDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZihfdGFyZ2V0PT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBuYT11cmxBcnJbaWRdO1xyXG4gICAgICAgIHZhciB0YXJnZXRPYmo9X3RhcmdldC5nZXRDaGlsZEJ5TmFtZShuYSk7XHJcbiAgICAgICAgaWYodGFyZ2V0T2JqPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKGlkPj11cmxBcnIubGVuZ3RoLTEpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0YXJnZXRPYmo9dGhpcy5fZ2V0T2JqQXJyVXJsKHRhcmdldE9iaix1cmxBcnIsKytpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgICB9XHJcbn1cclxuIiwiLypDNETpobbngrnliqjnlLsqL1xuLyp3bXnniYjmnKxfMjAxOC8xMi8yOCovXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4uL1dteVUzZEltcG9ydCc7XG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uLy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRzX0M0RFZldGV4QW5pbWF0b3IgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XG5cbiBfYzRkVmV0ZXhBbmltYXRvcjphbnk7XG4gX2luaXRQbGF5OmFueT0gZmFsc2U7XG4gX2FuaXI6YW55O1xucHVibGljIG9uQXdha2UoKSB7XG4gLy9zZXRTaG93KGZhbHNlKTtcbiB0aGlzLl9jNGRWZXRleEFuaW1hdG9yID0gdGhpcy5vd25lcjNELmdldENvbXBvbmVudChXbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoJ1dteUM0RFZldGV4QW5pbWF0b3InKSk7XG4gaWYgKHRoaXMuX2M0ZFZldGV4QW5pbWF0b3IgPT0gbnVsbCkge1xuIHRoaXMuX2M0ZFZldGV4QW5pbWF0b3IgPSB0aGlzLm93bmVyM0QuYWRkQ29tcG9uZW50KFdteVUzZEltcG9ydC5nZXRDbGFzcygnV215QzREVmV0ZXhBbmltYXRvcicpKTtcbiB9XG4gdGhpcy5fYW5pciA9IHRoaXMub3duZXIzRC5nZXRDb21wb25lbnQoV215VTNkSW1wb3J0LmdldENsYXNzKCdBbmltYXRvcicpKTtcbiBpZiAodGhpcy5fYW5pciAhPSBudWxsKSB7XG4gdGhpcy5faW5pdFBsYXkgPSBmYWxzZTtcbiB0aGlzLl9hbmlyLnNwZWVkID0gMDtcbiB0aGlzLnNldFNob3coZmFsc2UpO1xuIH1cbiBcbiB9XG5wdWJsaWMgb25QcmVSZW5kZXIoKSB7XG4gaWYgKCF0aGlzLl9pbml0UGxheSkge1xuIHZhciBwYXJlbnQ6YW55PSB0aGlzLm93bmVyM0QucGFyZW50O1xuIGlmIChwYXJlbnQudHJhbnNmb3JtLmxvY2FsU2NhbGUueCA+IDAuMDEgfHwgcGFyZW50LnRyYW5zZm9ybS5sb2NhbFNjYWxlLnkgPiAwLjAxIHx8IHBhcmVudC50cmFuc2Zvcm0ubG9jYWxTY2FsZS56ID4gMC4wMSkge1xuIHRoaXMuX2luaXRQbGF5ID0gdHJ1ZTtcbiB0aGlzLnNldFNob3codHJ1ZSk7XG4gdGhpcy5fYW5pci5zcGVlZCA9IDE7XG4gfVxuIH1cbiBcbiB9XG59XG4iLCIvKuebtOe6v+eBr+WFiSovXG4vKndteeeJiOacrF8yMDE4LzEyLzI4Ki9cbmltcG9ydCBXbXlVM2RJbXBvcnQgZnJvbSAnLi4vV215VTNkSW1wb3J0JztcbmltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSAnLi4vLi4vX3dteVV0aWxzSDUvZDMvV215U2NyaXB0M0QnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHNfRExpZ2h0IGV4dGVuZHMgV215U2NyaXB0M0Qge1xuXG4gICAgXG4gICAgcHVibGljIGNhbWVyYVVybCA9IFwiXCI7XG4gICAgLyrmmK/lkKbkuqfnlJ/pmLTlvbEqL1xuICAgIHB1YmxpYyBpc0Nhc3RTaGFkb3c6IGFueSA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNhbWVyYTpMYXlhLkNhbWVyYTtcbiAgICBwdWJsaWMgZGlyZWN0aW9uTGlnaHQ6TGF5YS5EaXJlY3Rpb25MaWdodDtcbiAgICBwdWJsaWMgb25TdGFydCgpIHtcbiAgICAgICAgdGhpcy5jYW1lcmE9dGhpcy5nZXRPYmozZFVybCh0aGlzLnNjZW5lM0QsdGhpcy5jYW1lcmFVcmwpO1xuXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uTGlnaHQ9dGhpcy5vd25lciBhcyBMYXlhLkRpcmVjdGlvbkxpZ2h0O1xuICAgICAgICAvL+eBr+WFieW8gOWQr+mYtOW9sVxuICAgICAgICB0aGlzLmRpcmVjdGlvbkxpZ2h0LnNoYWRvdyA9IHRoaXMuaXNDYXN0U2hhZG93O1xuICAgICAgICAvL+eUn+aIkOmYtOW9sei0tOWbvuWwuuWvuFxuICAgICAgICB0aGlzLmRpcmVjdGlvbkxpZ2h0LnNoYWRvd1Jlc29sdXRpb24gPSAxNDAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblVwZGF0ZSgpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy/lj6/op4HpmLTlvbHot53nprtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uTGlnaHQuc2hhZG93RGlzdGFuY2UgPSB0aGlzLmNhbWVyYS50cmFuc2Zvcm0ucG9zaXRpb24ueTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCIvKuadkOi0qOaViOaenCovXG4vKndteeeJiOacrF8yMDE4LzEyLzI4Ki9cbmltcG9ydCBXbXlVM2RJbXBvcnQgZnJvbSAnLi4vV215VTNkSW1wb3J0JztcbmltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSAnLi4vLi4vX3dteVV0aWxzSDUvZDMvV215U2NyaXB0M0QnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHNfTWF0cyBleHRlbmRzIFdteVNjcmlwdDNEIHtcblxuIC8q5piv5ZCm5Lqn55Sf6Zi05b2xKi9cbiBwdWJsaWMgaXNDYXN0U2hhZG93OmFueT0gZmFsc2U7XG4gLyrmmK/lkKbmjqXmlLbpmLTlvbEqL1xuIHB1YmxpYyBpc1JlY2VpdmVTaGFkb3c6YW55PSBmYWxzZTtcbnB1YmxpYyBvblN0YXJ0KCkge1xuIC8q6K6+572u6Zi05b2xKi9cbiB0aGlzLm9uU2V0U2hhZG93KHRoaXMuaXNDYXN0U2hhZG93LCB0aGlzLmlzUmVjZWl2ZVNoYWRvdyk7XG4gXG4gfVxuIH1cbiIsIi8q5Zy65pmvKi9cbi8qd21554mI5pysXzIwMTgvMTIvMjkqL1xuaW1wb3J0IFdteVUzZEltcG9ydCBmcm9tICcuLi9XbXlVM2RJbXBvcnQnO1xuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi8uLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUc19TY2VuZSBleHRlbmRzIFdteVNjcmlwdDNEIHtcblxuIF9hbmlyOmFueTtcbnB1YmxpYyBvblN0YXJ0KCkge1xuIHRoaXMuX2FuaXIgPSB0aGlzLm93bmVyM0QuZ2V0Q29tcG9uZW50KFdteVUzZEltcG9ydC5nZXRDbGFzcygnQW5pbWF0b3InKSk7XG4gaWYgKHRoaXMuX2FuaXIgIT0gbnVsbCkge1xuIHRoaXMuX2FuaXIuc3BlZWQgPSAxO1xuIH1cbiBcbiB9XG4gfVxuIl19
