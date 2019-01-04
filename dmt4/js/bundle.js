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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpcklERV9iZXRhNS9yZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi50cyIsInNyYy9fd215VXRpbHNINS9XbXlVdGlscy50cyIsInNyYy9fd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvV215TG9hZDNkLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteUxvYWRNYXRzLnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNELnRzIiwic3JjL193bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvYzRkL1dteUM0RFZldGV4QW5pbWF0b3IudHMiLCJzcmMvX3dteVV0aWxzSDUvZDMvcGh5c2ljcy9XbXlQaHlzaWNzV29ybGRfQ2hhcmFjdGVyLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dFYXNlTWFuYWdlci50cyIsInNyYy9fd215VXRpbHNINS93bXlUd2Vlbi9XRWFzZVR5cGUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuLnRzIiwic3JjL193bXlVdGlsc0g1L3dteVR3ZWVuL1dUd2Vlbk1hbmFnZXIudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuVmFsdWUudHMiLCJzcmMvX3dteVV0aWxzSDUvd215VHdlZW4vV1R3ZWVuZXIudHMiLCJzcmMvd215TWF0cy9XbXlNYXRDb25maWcudHMiLCJzcmMvd215TWF0cy9XbXlNYXRNYWcudHMiLCJzcmMvd215U2hhZGVycy9CYXNlX1dteVNoYWRlci50cyIsInNyYy93bXlTaGFkZXJzL1dteUxheWFfd215TGJ0LnRzIiwic3JjL3dteVNoYWRlcnMvV215U2hhZGVyTWFnLnRzIiwic3JjL3dteVUzZFRzL1dteVUzZEltcG9ydC50cyIsInNyYy93bXlVM2RUcy9XbXlVM2RUc0NvbmZpZy50cyIsInNyYy93bXlVM2RUcy9XbXlVM2RUc01hZy50cyIsInNyYy93bXlVM2RUcy90cy9Uc19DNERWZXRleEFuaW1hdG9yLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX0RMaWdodC50cyIsInNyYy93bXlVM2RUcy90cy9Uc19NYXRzLnRzIiwic3JjL3dteVUzZFRzL3RzL1RzX1NjZW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1RBLDJEQUEwRDtBQUMxRCxzRUFBcUU7QUFDckUsbURBQWtEO0FBQ2xELHNEQUFpRDtBQUNqRCxpREFBNEM7QUFDNUM7SUFJQztRQUZPLFdBQU0sR0FBQyxHQUFHLENBQUM7UUFDWCxXQUFNLEdBQUMsSUFBSSxDQUFDO1FBRWxCLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU1QyxJQUFJLElBQUksR0FBQyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxJQUFHLElBQUksRUFBQztZQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO1NBQ2hEO2FBQ0c7WUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNuRDtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFD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QUcsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM1RCxLQUFLLHFCQUFTLENBQUMsTUFBTTtnQkFDcEIsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEUsS0FBSyxxQkFBUyxDQUFDLE9BQU87Z0JBQ3JCLElBQUksSUFBSSxJQUFJLFFBQVE7b0JBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQy9CLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRCxLQUFLLHFCQUFTLENBQUMsU0FBUztnQkFDdkIsSUFBSSxJQUFJLElBQUksQ0FBQztvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxJQUFJLElBQUksUUFBUTtvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0MsS0FBSyxxQkFBUyxDQUFDLE1BQU07Z0JBQ3BCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxHQUFH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QkFDZCxFQUFDLEtBQUssRUFBQyw0R0FBNEc7b0JBQ25ILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw0R0FBNEc7b0JBQ25ILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDRHQUE0RztvQkFDbkgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDRHQUE0RztvQkFDbkgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMsNkdBQTZHO29CQUNwSCxVQUFVLEVBQUMsRUFBRSxFQUFDO2dCQUNkLEVBQUMsS0FBSyxFQUFDLDZHQUE2RztvQkFDcEgsVUFBVSxFQUFDLEVBQUUsRUFBQztnQkFDZCxFQUFDLEtBQUssRUFBQyw2R0FBNkc7b0JBQ3BILFVBQVUsRUFBQyxFQUFFLEVBQUM7Z0JBQ2QsRUFBQyxLQUFLLEVBQUMs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QUFDL0Q7SUFBcUMsMkJBQVc7SUFBaEQ7UUFBQSxxRUFXRTtRQVRELFVBQVU7UUFDSCxrQkFBWSxHQUFNLEtBQUssQ0FBQztRQUMvQixVQUFVO1FBQ0gscUJBQWUsR0FBTSxLQUFLLENBQUM7O0lBTWxDLENBQUM7SUFMSyx5QkFBTyxHQUFkO1FBQ0MsUUFBUTtRQUNSLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFMUQsQ0FBQztJQUNELGNBQUM7QUFBRCxDQVhELEFBV0UsQ0FYbUMseUJBQVcsR0FXOUM7Ozs7O0FDZkYsTUFBTTtBQUNOLG9CQUFvQjtBQUNwQixnREFBMkM7QUFDM0MsZ0VBQStEO0FBQy9EO0lBQXNDLDRCQUFXO0lBQWpEOztJQVVDLENBQUM7SUFQSywwQkFBTyxHQUFkO1FBQ0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO0lBRUQsQ0FBQztJQUNELGVBQUM7QUFBRCxDQVZELEFBVUUsQ0FWb0MseUJBQVcsR0FVL0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuL193bXlVdGlsc0g1L2QzL1dteVV0aWxzM0RcIjtcclxuaW1wb3J0IHsgV215X0xvYWRfTWFnIH0gZnJvbSBcIi4vX3dteVV0aWxzSDUvV215X0xvYWRfTWFnXCI7XHJcbmltcG9ydCB7IFdUd2Vlbk1hbmFnZXIgfSBmcm9tIFwiLi9fd215VXRpbHNINS93bXlUd2Vlbi9XVHdlZW5NYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFdteVV0aWxzIH0gZnJvbSBcIi4vX3dteVV0aWxzSDUvV215VXRpbHNcIjtcclxuaW1wb3J0IFdteVUzZFRzTWFnIGZyb20gXCIuL3dteVUzZFRzL1dteVUzZFRzTWFnXCI7XHJcbmltcG9ydCBXbXlNYXRNYWcgZnJvbSBcIi4vd215TWF0cy9XbXlNYXRNYWdcIjtcclxuZXhwb3J0IGNsYXNzIE1haW4ge1xyXG5cdHB1YmxpYyBzdGF0aWMgX3RoaXM6IE1haW47XHJcblx0cHVibGljIF9yb290Vz02NDA7XHJcblx0cHVibGljIF9yb290SD0xMTM2O1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0TWFpbi5fdGhpcz10aGlzO1xyXG5cdFx0TGF5YTNELmluaXQodGhpcy5fcm9vdFcsIHRoaXMuX3Jvb3RIKTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cclxuXHRcdHZhciBpc1BjPVdteVV0aWxzLmdldFRoaXMuaXNQYygpO1xyXG5cdFx0aWYoaXNQYyl7XHJcblx0XHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gTGF5YS5TdGFnZS5TQ0FMRV9TSE9XQUxMO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBMYXlhLlN0YWdlLlNDQUxFX0ZVTEw7XHJcblx0XHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IExheWEuU3RhZ2UuU0NSRUVOX1ZFUlRJQ0FMO1xyXG5cdFx0fVxyXG5cdFx0TGF5YS5zdGFnZS5mcmFtZVJhdGU9TGF5YS5TdGFnZS5GUkFNRV9GQVNUO1xyXG5cdFx0Ly/orr7nva7msLTlubPlr7npvZBcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduSCA9IFwiY2VudGVyXCI7XHJcblx0XHQvL+iuvue9ruWeguebtOWvuem9kFxyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25WID0gXCJtaWRkbGVcIjtcclxuXHJcblx0XHRMYXlhLlN0YXQuc2hvdygpO1xyXG5cclxuXHRcdGlmKCF0aGlzW1widkNvbnNvbGVcIl0pe1xyXG5cdFx0XHR0aGlzW1widkNvbnNvbGVcIl0gPSBuZXcgd2luZG93W1wiVkNvbnNvbGVcIl0oKTtcclxuXHRcdFx0dGhpc1tcInZDb25zb2xlXCJdLnN3aXRjaFBvcy5zdGFydFkgPSA0MDtcclxuXHRcdH1cclxuXHRcdC8vTGF5YS5TaGFkZXIzRC5kZWJ1Z01vZGU9dHJ1ZTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0dmFyIHdteVZUaW1lPVwiXCI7XHJcblx0XHRpZih3aW5kb3chPW51bGwgJiYgd2luZG93W1wid215VlRpbWVcIl0hPW51bGwpe1xyXG5cdFx0XHR3bXlWVGltZT13aW5kb3dbXCJ3bXlWVGltZVwiXTtcclxuXHRcdH1cclxuXHRcdExheWEuUmVzb3VyY2VWZXJzaW9uLmVuYWJsZShcInZlcnNpb24uanNvblwiK3dteVZUaW1lLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25WZXJzaW9uTG9hZGVkKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XHJcblx0fVxyXG5cclxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0XHRMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5SRVNJWkUpO1xyXG5cdFx0V215X0xvYWRfTWFnLmdldFRoaXMub25TZXRXZXREYXRhKFwibG9hZEluZm9cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCAoKSA9PiB7XHJcblx0XHRcdFdteV9Mb2FkX01hZy5nZXRUaGlzLm9ubG9hZFN0cihcImxvYWRcIiwgbmV3IExheWEuSGFuZGxlcih0aGlzLCB0aGlzLm9uTG9hZE1haW4pKTtcclxuXHRcdH0pKTtcclxuXHR9XHJcblx0XHJcblx0UkVTSVpFKCkge1xyXG5cdFx0dmFyIHN3PUxheWEuc3RhZ2Uud2lkdGgvdGhpcy5fcm9vdFc7XHJcblx0XHR2YXIgc2g9TGF5YS5zdGFnZS5oZWlnaHQvdGhpcy5fcm9vdEg7XHJcblx0XHRpZiAodGhpcy5fdWlTY2VuZSAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX3VpU2NlbmUuc2NhbGVYPXN3O1xyXG5cdFx0XHR0aGlzLl91aVNjZW5lLnNjYWxlWT1zdztcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLl91aVNjZW5lICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5fdWlSb290LndpZHRoID0gTGF5YS5zdGFnZS53aWR0aC9zdztcclxuXHRcdFx0dGhpcy5fdWlSb290LmhlaWdodCA9IExheWEuc3RhZ2UuaGVpZ2h0L3N3O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9Mb2FkUm9vdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX0xvYWRSb290LndpZHRoID0gdGhpcy5fdWlSb290LndpZHRoO1xyXG5cdFx0XHR0aGlzLl9Mb2FkUm9vdC5oZWlnaHQgPSB0aGlzLl91aVJvb3QuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9tYWluVmlldyAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX21haW5WaWV3LndpZHRoID0gdGhpcy5fdWlSb290LndpZHRoO1xyXG5cdFx0XHR0aGlzLl9tYWluVmlldy5oZWlnaHQgPSB0aGlzLl91aVJvb3QuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3VpU2NlbmU6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfdWlSb290OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cclxuXHRwcml2YXRlIF9Mb2FkUm9vdDogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHRwcml2YXRlIF9Mb2FkQm94OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX2JhcjogZmFpcnlndWkuR1Byb2dyZXNzQmFyO1xyXG5cclxuXHRwcml2YXRlIF9tYWluVmlldzogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHJcblx0cHJpdmF0ZSBvbkxvYWRNYWluKCkge1xyXG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZChmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QpO1xyXG5cdFx0dGhpcy5fdWlTY2VuZT1uZXcgZmFpcnlndWkuR0NvbXBvbmVudCgpO1xyXG5cdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZCh0aGlzLl91aVNjZW5lKTtcclxuXHRcdHRoaXMuX3VpUm9vdD1uZXcgZmFpcnlndWkuR0NvbXBvbmVudCgpO1xyXG5cdFx0dGhpcy5fdWlTY2VuZS5hZGRDaGlsZCh0aGlzLl91aVJvb3QpO1xyXG5cclxuXHRcdHRoaXMuX0xvYWRSb290ID0gZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdChcImxvYWRcIiwgXCJMb2FkUm9vdFwiKS5hc0NvbTtcclxuXHRcdHRoaXMuX3VpUm9vdC5hZGRDaGlsZCh0aGlzLl9Mb2FkUm9vdCk7XHJcblx0XHR0aGlzLl9Mb2FkQm94ID0gdGhpcy5fTG9hZFJvb3QuZ2V0Q2hpbGQoXCJfTG9hZEJveFwiKS5hc0NvbTtcclxuXHJcblx0XHR0aGlzLl9iYXIgPSB0aGlzLl9Mb2FkQm94LmdldENoaWxkKFwiYmFyXCIpLmFzUHJvZ3Jlc3M7XHJcblxyXG5cdFx0V215X0xvYWRfTWFnLmdldFRoaXMub25BdXRvTG9hZEFsbChuZXcgTGF5YS5IYW5kbGVyKHRoaXMsIHRoaXMub25Mb2FkT2spLCBuZXcgTGF5YS5IYW5kbGVyKHRoaXMsIHRoaXMub25Mb2FkaW5nKSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uTG9hZGluZyhwcm9ncmVzczogbnVtYmVyKTogdm9pZCB7XHJcblx0XHR2YXIgdHdlZW4gPSBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCk7XHJcblx0XHR0d2Vlbi5zZXRUYXJnZXQodGhpcywgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLl9vbkxvYWRpbmcsIG51bGwsIGZhbHNlKSk7XHJcblx0XHRpZih0aGlzLl9iYXIpe1xyXG5cdFx0XHR0d2Vlbi5fdG8odGhpcy5fYmFyLnZhbHVlLCBwcm9ncmVzcywgMC4yNSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHByaXZhdGUgX29uTG9hZGluZyh0YXJnZXQsIHApIHtcclxuXHRcdGlmKHRoaXMuX2Jhcil7XHJcblx0XHRcdHRoaXMuX2Jhci52YWx1ZSA9IHA7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9zY2VuZTNEOkxheWEuU2NlbmUzRDtcclxuXHRwcml2YXRlIG9uTG9hZE9rKHVpQXJyLCB1M2RBcnIpIHtcclxuXHRcdC8v5re75YqgM0RcclxuICAgICAgICB2YXIgdXJsM2Q9dTNkQXJyWzBdLnVybExpc3RbMF07XHJcbiAgICAgICAgdGhpcy5fc2NlbmUzRCA9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybDNkKTtcclxuXHRcdC8v6Ieq5Yqo5re75Yqg5p2Q6LSoXHJcblx0XHR0aGlzLl9zY2VuZTNELmFkZENvbXBvbmVudChXbXlNYXRNYWcpO1xyXG5cdFx0Ly/oh6rliqjmt7vliqBVM0TohJrmnKxcclxuXHRcdHRoaXMuX3NjZW5lM0QuYWRkQ29tcG9uZW50KFdteVUzZFRzTWFnKTtcclxuXHJcblx0XHRXVHdlZW5NYW5hZ2VyLmtpbGxUd2VlbnModGhpcyk7XHJcblx0XHR0aGlzLm9uTWFpbigpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbk1haW4oKXtcclxuXHRcdHRoaXMuX21haW5WaWV3ID0gZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdChcIm1haW5cIiwgXCJNYWluXCIpLmFzQ29tO1xyXG5cdFx0aWYgKHRoaXMuX21haW5WaWV3ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5fdWlSb290LmFkZENoaWxkQXQodGhpcy5fbWFpblZpZXcsIDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBfTWFpbj10aGlzLl9tYWluVmlldy5nZXRDaGlsZChcIl9NYWluXCIpLmFzQ29tO1xyXG5cdFx0dmFyIGQzQm94PV9NYWluLmdldENoaWxkKFwiZDNCb3hcIik7XHJcblx0XHRkM0JveC5kaXNwbGF5T2JqZWN0LmFkZENoaWxkKHRoaXMuX3NjZW5lM0QpO1xyXG5cclxuXHRcdFdUd2Vlbk1hbmFnZXIua2lsbFR3ZWVucyh0aGlzKTtcclxuXHRcdHRoaXMuX3VpUm9vdC5yZW1vdmVDaGlsZCh0aGlzLl9Mb2FkUm9vdCk7XHJcblx0XHR0aGlzLl9Mb2FkUm9vdCA9IG51bGw7XHJcblx0XHR0aGlzLl9iYXIgPSBudWxsO1xyXG5cclxuXHJcblx0XHQvLyAvL+WKoOi9vTNE5Zy65pmvXHJcblx0XHQvLyBMYXlhLlNjZW5lM0QubG9hZCgncmVzL3UzZC9tYWluL0NvbnZlbnRpb25hbC8xLmxzJywgTGF5YS5IYW5kbGVyLmNyZWF0ZShudWxsLCBmdW5jdGlvbihzY2VuZSl7XHJcblx0XHQvLyBcdC8v6Ieq5Yqo57uR5a6aVTNE6ISa5pysXHJcblx0XHQvLyBcdHNjZW5lLmFkZENvbXBvbmVudChXbXlVM2RUc01hZyk7XHJcblx0XHQvLyBcdC8v5Zy65pmv5re75Yqg5Yiw6Iie5Y+wXHJcblx0XHQvLyBcdExheWEuc3RhZ2UuYWRkQ2hpbGQoc2NlbmUpO1xyXG5cclxuXHRcdC8vIFx0Ly8gdmFyIHdteVZldGV4X2Z6MDE9V215VXRpbHMzRC5nZXRPYmozZFVybChzY2VuZSxcIjEvMi8zL3dteVZldGV4X2Z6MDFAMVwiKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG5cdFx0Ly8gXHQvLyB3bXlWZXRleF9mejAxLmV2ZW50KFwiYW5pX3BsYXlcIik7XHJcblxyXG5cdFx0Ly8gXHQvLyBMYXlhLnRpbWVyLm9uY2UoMTAwMCx0aGlzLCgpPT57XHJcblx0XHQvLyBcdC8vIFx0d215VmV0ZXhfZnowMS5ldmVudChcImFuaV9wbGF5XCIpO1xyXG5cdFx0Ly8gXHQvLyB9KVxyXG5cclxuXHRcdC8vIH0pKTtcclxuXHR9XHJcblx0XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiXHJcbmV4cG9ydCBjbGFzcyBXbXlVdGlscyBleHRlbmRzIGxheWEuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpczpXbXlVdGlscztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlVdGlsc3tcclxuICAgICAgICBpZihXbXlVdGlscy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteVV0aWxzLl90aGlzPW5ldyBXbXlVdGlscygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5fdGhpcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLl9fbG9vcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9ET1dOLHRoaXMsIHRoaXMuX19vblRvdWNoRG93bik7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9VUCx0aGlzLCB0aGlzLl9fb25Ub3VjaFVwKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLl9fT25Nb3VzZU1PVkUpO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5SRVNJWkUsdGhpcyx0aGlzLl9fb25SZXNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBDT0xPUl9GSUxURVJTX01BVFJJWDogQXJyYXk8YW55Pj1bXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9SXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9HXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9CXHJcbiAgICAgICAgMCwgMCwgMCwgMSwgMCwgLy9BXHJcbiAgICBdO1xyXG4gICAgLy/ovazmjaLpopzoibJcclxuICAgIHB1YmxpYyBjb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpOkFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFswXT1yO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzZdPWc7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMTJdPWI7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMThdPWF8fDE7XHJcbiAgICAgICAgcmV0dXJuIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYO1xyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVycyh0YXJnZXQ6TGF5YS5TcHJpdGUsY29sb3I6bnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJzPW51bGw7XHJcbiAgICAgICAgaWYoY29sb3IgIT0gMHhmZmZmZmYpe1xyXG4gICAgICAgICAgICB0YXJnZXQuZmlsdGVycz1bbmV3IExheWEuQ29sb3JGaWx0ZXIodGhpcy5jb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjE2KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjgpICYgMHhmZikvMjU1LFxyXG4gICAgICAgICAgICAgICAgKGNvbG9yICYgMHhmZikvMjU1XHJcbiAgICAgICAgICAgICAgICApKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVyczEodGFyZ2V0OkxheWEuU3ByaXRlLHI6bnVtYmVyLGc6bnVtYmVyLGI6bnVtYmVyLGE/Om51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKHIgPCAxIHx8IGcgPCAxIHx8IGIgPCAxIHx8IGEgPCAxKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocixnLGIsYSkpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/liKTmlq3miYvmnLrmiJZQQ1xyXG4gICAgcHVibGljIGlzUGMoKTpib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGlzUGM6Ym9vbGVhbj1mYWxzZTtcclxuICAgICAgICBpZih0aGlzLnZlcnNpb25zKCkuYW5kcm9pZCB8fCB0aGlzLnZlcnNpb25zKCkuaVBob25lIHx8IHRoaXMudmVyc2lvbnMoKS5pb3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpc1BjPWZhbHNlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMudmVyc2lvbnMoKS5pUGFkKXtcclxuICAgICAgICAgICAgaXNQYz10cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNQYztcclxuICAgIH1cclxuICAgIHB1YmxpYyB2ZXJzaW9ucygpe1xyXG4gICAgICAgIHZhciB1OnN0cmluZyA9IG5hdmlnYXRvci51c2VyQWdlbnQsIGFwcDpzdHJpbmcgPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAvL+enu+WKqOe7iOerr+a1j+iniOWZqOeJiOacrOS/oeaBr1xyXG4gICAgICAgICAgICB0cmlkZW50OiB1LmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xLCAvL0lF5YaF5qC4XHJcbiAgICAgICAgICAgIHByZXN0bzogdS5pbmRleE9mKCdQcmVzdG8nKSA+IC0xLCAvL29wZXJh5YaF5qC4XHJcbiAgICAgICAgICAgIHdlYktpdDogdS5pbmRleE9mKCdBcHBsZVdlYktpdCcpID4gLTEsIC8v6Iu55p6c44CB6LC35q2M5YaF5qC4XHJcbiAgICAgICAgICAgIGdlY2tvOiB1LmluZGV4T2YoJ0dlY2tvJykgPiAtMSAmJiB1LmluZGV4T2YoJ0tIVE1MJykgPT0gLTEsIC8v54Gr54uQ5YaF5qC4XHJcbiAgICAgICAgICAgIG1vYmlsZTogISF1Lm1hdGNoKC9BcHBsZVdlYktpdC4qTW9iaWxlLiovKXx8ISF1Lm1hdGNoKC9BcHBsZVdlYktpdC8pLCAvL+aYr+WQpuS4uuenu+WKqOe7iOerr1xyXG4gICAgICAgICAgICBpb3M6ICEhdS5tYXRjaCgvXFwoaVteO10rOyggVTspPyBDUFUuK01hYyBPUyBYLyksIC8vaW9z57uI56uvXHJcbiAgICAgICAgICAgIGFuZHJvaWQ6IHUuaW5kZXhPZignQW5kcm9pZCcpID4gLTEgfHwgdS5pbmRleE9mKCdMaW51eCcpID4gLTEsIC8vYW5kcm9pZOe7iOerr+aIluiAhXVj5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQaG9uZTogdS5pbmRleE9mKCdpUGhvbmUnKSA+IC0xIHx8IHUuaW5kZXhPZignTWFjJykgPiAtMSwgLy/mmK/lkKbkuLppUGhvbmXmiJbogIVRUUhE5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQYWQ6IHUuaW5kZXhPZignaVBhZCcpID4gLTEsIC8v5piv5ZCmaVBhZFxyXG4gICAgICAgICAgICB3ZWJBcHA6IHUuaW5kZXhPZignU2FmYXJpJykgPT0gLTEgLy/mmK/lkKZ3ZWLlupTor6XnqIvluo/vvIzmsqHmnInlpLTpg6jkuI7lupXpg6hcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRVcmxWKGtleTpzdHJpbmcpe1xyXG4gICAgICAgIHZhciByZWc9IG5ldyBSZWdFeHAoXCIoXnwmKVwiK2tleStcIj0oW14mXSopKCZ8JClcIik7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLm1hdGNoKHJlZyk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdD9kZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzJdKTpudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk5hdmlnYXRlKHVybDpzdHJpbmcsaXNSZXBsYWNlOmJvb2xlYW49ZmFsc2Upe1xyXG4gICAgICAgIGlmKGlzUmVwbGFjZSl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHVybCk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9dXJsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ldmVudExpc3Q6QXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+PW5ldyBBcnJheTxsYXlhLmV2ZW50cy5FdmVudD4oKTtcclxuICAgIHByaXZhdGUgX19vblRvdWNoRG93bihldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KTwwKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnB1c2goZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaFVwKGV2dDogbGF5YS5ldmVudHMuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpPj0wKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnNwbGljZSh0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25SZXNpemUoKXtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3QuZm9yRWFjaChldnQgPT4ge1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuXHRcdH0pO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdD1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX19Pbk1vdXNlTU9WRShldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGJOdW09MTA7XHJcbiAgICAgICAgaWYoZXZ0LnN0YWdlWCA8PSBiTnVtIHx8IGV2dC5zdGFnZVggPj0gTGF5YS5zdGFnZS53aWR0aC1iTnVtIHx8XHJcbiAgICAgICAgICAgIGV2dC5zdGFnZVkgPD0gYk51bSB8fCBldnQuc3RhZ2VZID49IExheWEuc3RhZ2UuaGVpZ2h0LWJOdW0pe1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTnVtVG8obixsPTIpe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQobCkpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJfWFkoZCwgcilcclxuICAgIHtcclxuICAgIFx0dmFyIHJhZGlhbiA9IChyICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBcdHZhciBjb3MgPSAgTWF0aC5jb3MocmFkaWFuKTtcclxuICAgIFx0dmFyIHNpbiA9ICBNYXRoLnNpbihyYWRpYW4pO1xyXG4gICAgXHRcclxuICAgIFx0dmFyIGR4PWQgKiBjb3M7XHJcbiAgICBcdHZhciBkeT1kICogc2luO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IExheWEuUG9pbnQoZHggLCBkeSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nMmJ1ZmZlcihzdHIpOkFycmF5QnVmZmVyIHtcclxuICAgICAgICAvLyDpppblhYjlsIblrZfnrKbkuLLovazkuLoxNui/m+WItlxyXG4gICAgICAgIGxldCB2YWwgPSBcIlwiXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodmFsID09PSAnJykge1xyXG4gICAgICAgICAgICB2YWwgPSBzdHIuY2hhckNvZGVBdChpKS50b1N0cmluZygxNilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWwgKz0gJywnICsgc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDlsIYxNui/m+WItui9rOWMluS4ukFycmF5QnVmZmVyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHZhbC5tYXRjaCgvW1xcZGEtZl17Mn0vZ2kpLm1hcChmdW5jdGlvbiAoaCkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludChoLCAxNilcclxuICAgICAgICB9KSkuYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVwbGFjZUFsbChzdHIsIG9sZFN0ciwgbmV3U3RyKXsgIFxyXG4gICAgICAgIHZhciB0ZW1wID0gJyc7ICBcclxuICAgICAgICB0ZW1wID0gc3RyLnJlcGxhY2Uob2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIGlmKHRlbXAuaW5kZXhPZihvbGRTdHIpPj0wKXtcclxuICAgICAgICAgICAgdGVtcCA9IHRoaXMucmVwbGFjZUFsbCh0ZW1wLCBvbGRTdHIsIG5ld1N0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9ICBcclxuXHJcbiAgICAvL+Wkp+Wwj+WGmei9rOaNolxyXG4gICAgcHVibGljIHN0YXRpYyB0b0Nhc2Uoc3RyOnN0cmluZywgaXNEeD1mYWxzZSl7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnO1xyXG4gICAgICAgIGlmKCFpc0R4KXtcclxuICAgICAgICAgICAgLy/ovazmjaLkuLrlsI/lhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgLy/ovazljJbkuLrlpKflhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7ICBcclxuICAgIH0gXHJcblxyXG4gICAgXHJcbiAgICAvL+i3neemu1xyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0RGlzdGFuY2UoYTpMYXlhLlBvaW50LGI6TGF5YS5Qb2ludCk6bnVtYmVyIHtcclxuXHRcdHZhciBkeCA9IE1hdGguYWJzKGEueCAtIGIueCk7XHJcblx0XHR2YXIgZHkgPSBNYXRoLmFicyhhLnkgLSBiLnkpO1xyXG5cdFx0dmFyIGQ9TWF0aC5zcXJ0KE1hdGgucG93KGR4LCAyKSArIE1hdGgucG93KGR5LCAyKSk7XHJcblx0XHRkPXBhcnNlRmxvYXQoZC50b0ZpeGVkKDIpKTtcclxuXHRcdHJldHVybiBkO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFh5VG9SKHkseCk6bnVtYmVye1xyXG4gICAgICAgIHZhciByYWRpYW49TWF0aC5hdGFuMih5LHgpO1xyXG4gICAgICAgIHZhciByPSgxODAvTWF0aC5QSSpyYWRpYW4pO1xyXG4gICAgICAgIHI9dGhpcy5vbk51bVRvKHIpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc3RvcmFnZShrZXksIHZhbHVlOmFueT1cIj9cIiwgaXNMb2NhbD10cnVlKTphbnl7XHJcbiAgICAgICAgdmFyIHN0b3JhZ2U6YW55PWlzTG9jYWw/bG9jYWxTdG9yYWdlOnNlc3Npb25TdG9yYWdlO1xyXG4gICAgICAgIGlmKHZhbHVlPT1cIj9cIil7XHJcblx0XHRcdHZhciBkYXRhID0gc3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZih2YWx1ZT09bnVsbCl7XHJcblx0XHRcdHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0c3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvL+aSreaUvuWjsOmfs1xyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5RnVpU291bmQoX3VybCx2b2x1bWU9MC4yLGNvbXBsZXRlSGFuZGxlcj8sc3RhcnRUaW1lPTAsbG9vcHM9MSl7XHJcbiAgICAgICAgaWYodm9sdW1lPD0wKXJldHVybjtcclxuICAgICAgICB2YXIgaXRlbT1mYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbUJ5VVJMKF91cmwpO1xyXG4gICAgICAgIHZhciB1cmw9aXRlbS5maWxlO1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZCh1cmwsbG9vcHMsY29tcGxldGVIYW5kbGVyLG51bGwsc3RhcnRUaW1lKTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5zZXRTb3VuZFZvbHVtZSh2b2x1bWUsdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvL+a1heaLt+i0nVxyXG4gICAgcHVibGljIHN0YXRpYyBzaGFsbG93Q29weShvYmope1xyXG4gICAgICAgIC8vIOWPquaLt+i0neWvueixoVxyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgcmV0dXJuO1xyXG4gICAgICAgIC8vIOagueaNrm9iaueahOexu+Wei+WIpOaWreaYr+aWsOW7uuS4gOS4quaVsOe7hOi/mOaYr+S4gOS4quWvueixoVxyXG4gICAgICAgIHZhciBuZXdPYmogPSBvYmogaW5zdGFuY2VvZiBBcnJheSA/IFtdIDoge307XHJcbiAgICAgICAgLy8g6YGN5Y6Gb2JqLOW5tuS4lOWIpOaWreaYr29iaueahOWxnuaAp+aJjeaLt+i0nVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgIG5ld09ialtrZXldID0gb2JqW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ld09iajtcclxuICAgIH1cclxuXHJcbiAgICAvL+a3seaLt+i0nVxyXG4gICAgcHVibGljIHN0YXRpYyBkZWVwQ29weShvYmope1xyXG4gICAgICAgIC8vIOWPquaLt+i0neWvueixoVxyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgcmV0dXJuO1xyXG4gICAgICAgIC8vIOagueaNrm9iaueahOexu+Wei+WIpOaWreaYr+aWsOW7uuS4gOS4quaVsOe7hOi/mOaYr+S4gOS4quWvueixoVxyXG4gICAgICAgIHZhciBuZXdPYmogPSBvYmogaW5zdGFuY2VvZiBBcnJheSA/IFtdIDoge307XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICAvLyDpgY3ljoZvYmos5bm25LiU5Yik5pat5pivb2Jq55qE5bGe5oCn5omN5ou36LSdXHJcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgLy8g5Yik5pat5bGe5oCn5YC855qE57G75Z6L77yM5aaC5p6c5piv5a+56LGh6YCS5b2S6LCD55So5rex5ou36LSdXHJcbiAgICAgICAgICAgICAgICBuZXdPYmpba2V5XSA9IHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcgPyB0aGlzLmRlZXBDb3B5KG9ialtrZXldKSA6IG9ialtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdPYmo7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMgfSBmcm9tIFwiLi9XbXlVdGlsc1wiO1xyXG5pbXBvcnQgeyBXbXlMb2FkM2QgfSBmcm9tIFwiLi9kMy9XbXlMb2FkM2RcIjtcclxuaW1wb3J0IHsgV215TG9hZE1hdHMgfSBmcm9tIFwiLi9kMy9XbXlMb2FkTWF0c1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteV9Mb2FkX01hZ1xyXG57XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlfTG9hZF9NYWd7XHJcbiAgICAgICAgaWYoV215X0xvYWRfTWFnLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215X0xvYWRfTWFnLl90aGlzPW5ldyBXbXlfTG9hZF9NYWcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteV9Mb2FkX01hZy5fdGhpcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3dldERhdGE6YW55PXt9O1xyXG5cclxuICAgIHB1YmxpYyBkYXRhTmFtZTpzdHJpbmc9XCJcIjtcclxuICAgIFxyXG4gICAgcHVibGljIGdldFJlc09iaihyZXNOYW1lOnN0cmluZyxkYXRhTmFtZT8pe1xyXG4gICAgICAgIHZhciB3ZWJEYXRhOmFueTtcclxuICAgICAgICBpZihkYXRhTmFtZT09bnVsbCl7XHJcbiAgICAgICAgICAgIGRhdGFOYW1lPXRoaXMuZGF0YU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdlYkRhdGE9dGhpcy5fd2V0RGF0YVtkYXRhTmFtZV07XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzT2JqPW51bGw7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9YXJyW2ldO1xyXG4gICAgICAgICAgICBpZihvYmpbXCJyZXNOYW1lXCJdPT1yZXNOYW1lKXtcclxuICAgICAgICAgICAgICAgIHJlc09iaj1vYmo7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzT2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblNldFdldERhdGEoZGF0YU5hbWU6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICBpZih3aW5kb3dbZGF0YU5hbWVdPT1udWxsKXJldHVybjtcclxuICAgICAgICB0aGlzLmRhdGFOYW1lPWRhdGFOYW1lO1xyXG4gICAgICAgIHRoaXMuX3dldERhdGFbZGF0YU5hbWVdPXdpbmRvd1tkYXRhTmFtZV07XHJcbiAgICAgICAgY2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLl93ZXREYXRhW2RhdGFOYW1lXV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbmxvYWRTdHIoc3RyOnN0cmluZyxjYWxsYmFja09rPzpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgcmVzT2JqPXRoaXMuZ2V0UmVzT2JqKHN0cik7XHJcbiAgICAgICAgaWYocmVzT2JqIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5vbmxvYWQocmVzT2JqLGNhbGxiYWNrT2ssY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIm9ubG9hZFN0ci3lh7rplJk6XCIsc3RyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVzRGF0YUFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHVibGljIG9ubG9hZChyZXNPYmo6YW55LGNhbGxiYWNrT2s/OkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNOYW1lPXJlc09ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgaWYodGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0ucnVuV2l0aChbdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzT2JqW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTphbnk9e307XHJcbiAgICAgICAgICAgIHZhciByZXNEYXRhOnN0cmluZz1yZXNPYmpbXCJyZXNEYXRhXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNEYXRhIT1udWxsICYmIHJlc0RhdGEhPVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhPUpTT04ucGFyc2UocmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZVVybDtcclxuICAgICAgICAgICAgdmFyIHVybEFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB2YXIgaXNDcmVhdGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzVXJsPVdteVV0aWxzLnRvQ2FzZShyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZih1cmwuaW5kZXhPZihcIi50eHRcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuQlVGRkVSfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYk5hbWVVcmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih1cmwuaW5kZXhPZihcIi5qcGdcIik+PTAgfHwgdXJsLmluZGV4T2YoXCIucG5nXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLklNQUdFfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHVybC5pbmRleE9mKFwiLm1wM1wiKT49MCB8fCB1cmwuaW5kZXhPZihcIi53YXZcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuU09VTkR9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmxBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Bc3NldENvbm1wbGV0ZSxbcmVzTmFtZSxiTmFtZVVybCxkYXRhXSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQXNzZXRQcm9ncmVzcywgW3Jlc05hbWVdLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBvbkNsZWFyM2RSZXModXJsKXtcclxuICAgICAgICBMYXlhLlJlc291cmNlLmRlc3Ryb3lVbnVzZWRSZXNvdXJjZXMoKTtcclxuICAgICAgICBXbXlMb2FkM2QuZ2V0VGhpcy5jbGVhclJlcyh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkxvYWQzZE9uZSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgV215TG9hZDNkLm9uTG9hZDNkT25lKHVybCxjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbmxvYWQzZChyZXNPYmo6YW55LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc05hbWU9cmVzT2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICBpZih0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXS5ydW5XaXRoKFt0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNPYmpbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciBkYXRhOmFueT17fTtcclxuICAgICAgICAgICAgdmFyIHJlc0RhdGE6c3RyaW5nPXJlc09ialtcInJlc0RhdGFcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc0RhdGEhPW51bGwgJiYgcmVzRGF0YSE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9SlNPTi5wYXJzZShyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIscmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lO1xyXG4gICAgICAgICAgICB2YXIgdXJsQXJyOkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmwuaW5kZXhPZihcIi5sc1wiKT49MCB8fCByZXNVcmwuaW5kZXhPZihcIi5saFwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgICAgICB1cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YS51cmxMaXN0PXVybExpc3Q7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5nZXRUaGlzLm9ubG9hZDNkKHVybEFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkFzc2V0Q29ubXBsZXRlLFtyZXNOYW1lLGJOYW1lLGRhdGFdKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Bc3NldFByb2dyZXNzLCBbcmVzTmFtZV0sIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHRwcml2YXRlIG9uQXNzZXRQcm9ncmVzcyhyZXNOYW1lLHByb2dyZXNzKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrUHJvZ3Jlc3NBcnI6QXJyYXk8TGF5YS5IYW5kbGVyPj10aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tQcm9ncmVzc0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYWxsYmFja1Byb2dyZXNzQXJyW2ldO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5ydW5XaXRoKFtwcm9ncmVzc10pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcbiAgICBcclxuICAgIHByaXZhdGUgb25Bc3NldENvbm1wbGV0ZShyZXNOYW1lLGJOYW1lVXJsOnN0cmluZyxkYXRhKTp2b2lke1xyXG4gICAgICAgIHZhciBjYWxsYmFja09rQXJyOkFycmF5PExheWEuSGFuZGxlcj49dGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXTtcclxuICAgICAgICBpZihiTmFtZVVybCE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBiYW89TGF5YS5sb2FkZXIuZ2V0UmVzKGJOYW1lVXJsKTtcclxuICAgICAgICAgICAgdmFyIGJOYW1lID0gYk5hbWVVcmwucmVwbGFjZShcIi50eHRcIixcIlwiKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKGJOYW1lLGJhbyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJGVUkt5Ye66ZSZOlwiLGJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWVBcnI9Yk5hbWUuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICBkYXRhLmJOYW1lPWJOYW1lQXJyW2JOYW1lQXJyLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXT1kYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrT2tBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrT2sgPSBjYWxsYmFja09rQXJyW2ldO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbZGF0YV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09bnVsbDtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPW51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNBdXRvTG9hZFA9ZmFsc2U7XHJcbiAgICBwcml2YXRlIF9pc1UzZD1mYWxzZTtcclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkSW5mb0Fycjphbnk7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZHJDYWxsYmFja09rOkxheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3M6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9uQXV0b0xvYWRBbGwoY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgd2ViRGF0YTphbnk9dGhpcy5fd2V0RGF0YVt0aGlzLmRhdGFOYW1lXTtcclxuICAgICAgICBpZih3ZWJEYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi56m65pWw5o2uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFycjpBcnJheTxhbnk+PW51bGw7XHJcbiAgICAgICAgaWYod2ViRGF0YSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgYXJyPXdlYkRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbCl7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZSh3ZWJEYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuadkOaWmeaVsOaNrumUmeivr1wiLHdlYkRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnI9e307XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdPTA7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXT0wO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdPVtdO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXT1bXTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1hcnJbaV07XHJcbiAgICAgICAgICAgIHZhciByZXNOYW1lPW9ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgICAgIHZhciB0PW9ialtcInR5cGVcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc05hbWU9PW51bGwgfHwgcmVzTmFtZT09XCJcIiB8fCB0PT1udWxsIHx8IHQ9PVwiXCIpY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMub25BdXRvTG9hZE9iaih0LHJlc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pc0F1dG9Mb2FkUD10cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkT2JqKHR5cGU6c3RyaW5nLHJlc05hbWUpe1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgcmVzSWQ9dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF09e307XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcIm5cIl09cmVzTmFtZTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT10eXBlO1xyXG4gICAgICAgIHZhciBsb2FkT2s9ZmFsc2U7XHJcbiAgICAgICAgaWYodHlwZT09XCJ1aVwiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidWkt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkM2QocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgdGhpcy5faXNVM2Q9dHJ1ZTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ1M2Qt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eXBlPT1cIm1hdHNcIil7XHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICByZXNVcmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsTGlzdC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkTWF0cy5nZXRUaGlzLm9ubG9hZDNkKHVybExpc3QsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgICAgIGxvYWRPaz10cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJtYXRzLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHlwZT09XCJjdWJlTWFwXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5cGU9PVwiYXVkaW9cIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImF1ZGlvLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEN1YmUocmVzTmFtZSwgY29tcGxldGU6IExheWEuSGFuZGxlcik6QXJyYXk8TGF5YS5UZXh0dXJlQ3ViZT57XHJcbiAgICAgICAgdmFyIHJlcz10aGlzLmdldFJlc09iaihyZXNOYW1lKTtcclxuICAgICAgICBpZihyZXM9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgdmFyIFJlc3Jlc09iajpBcnJheTxMYXlhLlRleHR1cmVDdWJlPj1bXTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgcmVzVXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgocmVzVXJsKTtcclxuICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgIExheWEuVGV4dHVyZUN1YmUubG9hZCh1cmwsbmV3IExheWEuSGFuZGxlcih0aGlzLGN1YmU9PntcclxuICAgICAgICAgICAgICAgIFJlc3Jlc09ialtpXT1jdWJlO1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGUucnVuV2l0aChbY3ViZSxpXSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFJlc3Jlc09iajtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uTG9hZGluZyhyZXNJZCwgcHJvZ3Jlc3M6bnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIHBDPTA7XHJcbiAgICAgICAgaWYoIXRoaXMuX2lzQXV0b0xvYWRQKXtcclxuICAgICAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BDXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1wicFwiXT1wcm9ncmVzcztcclxuICAgICAgICB2YXIgbnVtPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXTtcclxuICAgICAgICB2YXIgcE51bT0wO1xyXG4gICAgICAgIHZhciBwUz0xL251bTtcclxuICAgICAgICB2YXIgcDA9MCxwMT0wO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bnVtO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9dGhpcy5fYXV0b0xvYWRJbmZvQXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgcD1vYmpbXCJwXCJdO1xyXG4gICAgICAgICAgICBpZihwIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2lzVTNkKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihvYmpbXCJ0XCJdPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDE9cCoocFMqKGkrMSkpKjAuODtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDA9cCoocFMqKGkrMSkpKjAuMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcE51bT1wMCtwMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgcE51bT1wKihwUyooaSsxKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcEM9cE51bSoxMDA7XHJcbiAgICAgICAgaWYoaXNOYU4ocEMpKXBDPTA7XHJcbiAgICAgICAgaWYocEM+MSlcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwQyk7XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcENdKTtcclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uTG9hZE9rKHJlc0lkLGRhdGE/KXtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdKz0xO1xyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInVpXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl0+PXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXSx0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuL1dteVV0aWxzM0RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlMb2FkM2R7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlMb2FkM2R7XHJcbiAgICAgICAgaWYoV215TG9hZDNkLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215TG9hZDNkLl90aGlzPW5ldyBXbXlMb2FkM2QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWQzZC5fdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfdXJsTGlzdDpBcnJheTxzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbmxvYWQzZCh1cmxMaXN0OkFycmF5PHN0cmluZz4sY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyLGlzQ2xlYXJSZXM/KXtcclxuICAgICAgICB0aGlzLl91cmxMaXN0PVtdO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx1cmxMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgdXJsOnN0cmluZz11cmxMaXN0W2ldW1widXJsXCJdO1xyXG4gICAgICAgICAgICB1cmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeCh1cmwpO1xyXG4gICAgICAgICAgICB0aGlzLl91cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgdGhpcy5fb25sb2FkM2QodXJsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIG9uTG9hZDNkT25lKHVybDpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgIC8vICAgICBXbXlMb2FkM2QuZ2V0VGhpcy5fb25Mb2FkM2RPbmUodXJsLGNhbGxiYWNrT2ssY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gcHVibGljIF9vbkxvYWQzZE9uZSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAvLyAgICAgdGhpcy5fbG9hZDNkKHVybCxjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHByaXZhdGUgX2xvYWQzZCh1cmwsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgIC8vICAgICBMYXlhLmxvYWRlci5jbGVhclJlcyh1cmwpO1xyXG4gICAgLy8gICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCgpPT57XHJcbiAgICAvLyAgICAgICAgIGlmKGNhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgY2FsbGJhY2tPay5ydW4oKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywocCk9PntcclxuICAgIC8vICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgICAgICBjYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BdKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0sbnVsbCxmYWxzZSkpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25Mb2FkM2RPbmUodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciB3bXlMb2FkM2Q9bmV3IFdteUxvYWQzZCgpO1xyXG4gICAgICAgIHdteUxvYWQzZC5fX29ubG9hZDNkT25lKHVybCxjYWxsYmFja09rLGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfX29ubG9hZDNkT25lKHVybCxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHRoaXMuX3VybExpc3Q9W107XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICB1cmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeCh1cmwpO1xyXG4gICAgICAgIHRoaXMuX3VybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgIHRoaXMuX29ubG9hZDNkKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBfb25sb2FkM2QoX3VybExpc3Qpe1xyXG4gICAgLy8gICAgIExheWEubG9hZGVyLmNyZWF0ZSh0aGlzLl91cmxMaXN0LExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgLy8gICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgdGhpcy5fdXJsTGlzdD1udWxsO1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9jYWxsYmFja09rPW51bGw7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9bnVsbDtcclxuICAgIC8vICAgICAgICAgdGhpcy5fbUFycj1udWxsO1xyXG4gICAgLy8gICAgIH0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywocCk9PntcclxuICAgIC8vICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BdKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pLG51bGwsbnVsbCxudWxsLDEsZmFsc2UpO1xyXG4gICAgLy8gfVxyXG4gICAgcHJpdmF0ZSBfb25sb2FkM2QodXJsKXtcclxuICAgICAgICBMYXlhLmxvYWRlci5jbGVhclJlcyh1cmwpO1xyXG4gICAgICAgIExheWEubG9hZGVyLl9jcmVhdGVMb2FkKHVybCk7XHJcbiAgICAgICAgdmFyIGxvYWQ9TGF5YS5Mb2FkZXJNYW5hZ2VyW1wiX3Jlc01hcFwiXVt1cmxdO1xyXG4gICAgICAgIGxvYWQub25jZShMYXlhLkV2ZW50LkNPTVBMRVRFLHRoaXMsdGhpcy5fX29ubHNVcmxPayxbdXJsXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbUFycjpBcnJheTxzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBfX29ubHNVcmxPayh1cmwsZCl7XHJcbiAgICAgICAgdmFyIHMwPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgdmFyIHMxPXVybC5yZXBsYWNlKHMwW3MwLmxlbmd0aC0xXSxcIlwiKTtcclxuICAgICAgICB2YXIgcm9vdFVybD1zMTtcclxuICAgICAgICB2YXIganNPYmo9SlNPTi5wYXJzZShkKTtcclxuICAgICAgICB0aGlzLl9tQXJyPVtdO1xyXG5cclxuICAgICAgICB0aGlzLl9fdGlRdVVybChqc09ialtcImRhdGFcIl0scm9vdFVybCk7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLl9tQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5fbUFycltpXTtcclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTG9hZE9rKSk7XHJcbiAgICAgICAgICAgIC8vTGF5YS5sb2FkZXIuY3JlYXRlKHVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTG9hZE9rKSx1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCxncm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21OdW09MDtcclxuICAgIHByaXZhdGUgX3BOdW09MDtcclxuICAgIHByaXZhdGUgX19vbkxvYWRPaygpe1xyXG4gICAgICAgIHRoaXMuX21OdW0rPTE7XHJcbiAgICAgICAgdGhpcy5fcE51bT10aGlzLl9tTnVtL3RoaXMuX21BcnIubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuX19vbkxvYWRQKG51bGwpO1xyXG5cclxuICAgICAgICBpZih0aGlzLl9tTnVtPj10aGlzLl9tQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh0aGlzLl91cmxMaXN0LExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3VybExpc3Q9bnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9bnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9bnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21BcnI9bnVsbDtcclxuICAgICAgICAgICAgfSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkxvYWRQKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9fb25Mb2FkUChwKXtcclxuICAgICAgICB2YXIgcE51bT10aGlzLl9wTnVtKjAuNztcclxuICAgICAgICBpZihwKXtcclxuICAgICAgICAgICAgcE51bSs9cCowLjI1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwTnVtXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBwcml2YXRlIF9tUD0wO1xyXG4gICAgLy8gcHJpdmF0ZSBfbVAyPTA7XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBfX29uQXJyUChwKXtcclxuICAgIC8vICAgICB2YXIgcE51bT1wKih0aGlzLl9tTnVtKzEpO1xyXG4gICAgLy8gICAgIGlmKHBOdW0+dGhpcy5fbVApdGhpcy5fbVA9cE51bTtcclxuICAgIC8vICAgICB0aGlzLl9tUDI9KHRoaXMuX21QL3RoaXMuX21BcnIubGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgIC8vICAgICB2YXIgcE51bT0odGhpcy5fbVAyKSowLjk4O1xyXG4gICAgLy8gICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgLy8gICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BOdW1dKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICAvLyBwcml2YXRlIF9fb25BcnJPaygpe1xyXG4gICAgLy8gICAgIHRoaXMuX21OdW0rPTE7XHJcbiAgICAvLyAgICAgaWYodGhpcy5fbU51bT49dGhpcy5fbUFyci5sZW5ndGgpe1xyXG4gICAgLy8gICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgIC8vICAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl91cmxMaXN0PW51bGw7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rPW51bGw7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPW51bGw7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLl9tQXJyPW51bGw7XHJcbiAgICAvLyAgICAgICAgIH0pKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICBwcml2YXRlIF9fdGlRdVVybChvYmosdXJsOnN0cmluZz1cIlwiKXtcclxuICAgICAgICBpZihvYmpbXCJwcm9wc1wiXSE9bnVsbCAmJiBvYmpbXCJwcm9wc1wiXVtcIm1lc2hQYXRoXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIG1lc2hQYXRoPXVybCtvYmpbXCJwcm9wc1wiXVtcIm1lc2hQYXRoXCJdO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YobWVzaFBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKG1lc2hQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxzOkFycmF5PGFueT49b2JqW1wicHJvcHNcIl1bXCJtYXRlcmlhbHNcIl07XHJcbiAgICAgICAgICAgIGlmKG1hdGVyaWFscyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGlpPTA7aWk8bWF0ZXJpYWxzLmxlbmd0aDtpaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aD11cmwrbWF0ZXJpYWxzW2lpXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKHBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2gocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9ialtcImNvbXBvbmVudHNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgY29tcG9uZW50czpBcnJheTxhbnk+PW9ialtcImNvbXBvbmVudHNcIl07XHJcbiAgICAgICAgICAgIGlmKGNvbXBvbmVudHMubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTAgPSAwOyBpMCA8IGNvbXBvbmVudHMubGVuZ3RoOyBpMCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBjb21wb25lbnRzW2kwXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihjb21wW1wiYXZhdGFyXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFwYXRoPXVybCtjb21wW1wiYXZhdGFyXCJdW1wicGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGFwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChhcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImxheWVyc1wiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcnM6QXJyYXk8YW55Pj1jb21wW1wibGF5ZXJzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpMSA9IDA7IGkxIDwgbGF5ZXJzLmxlbmd0aDsgaTErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheWVyID0gbGF5ZXJzW2kxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZXM6QXJyYXk8YW55Pj1sYXllcltcInN0YXRlc1wiXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IHN0YXRlcy5sZW5ndGg7IGkyKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbaTJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGlwUGF0aD11cmwrc3RhdGVbXCJjbGlwUGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YoY2xpcFBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goY2xpcFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY2hpbGQ6QXJyYXk8YW55Pj1vYmpbXCJjaGlsZFwiXTtcclxuICAgICAgICBpZihjaGlsZCE9bnVsbCAmJiBjaGlsZC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8Y2hpbGQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fdGlRdVVybChjaGlsZFtpXSx1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vXHJcbiAgICBwdWJsaWMgY2xlYXJSZXModXJsOnN0cmluZyl7XHJcbiAgICAgICAgaWYoIXVybCB8fCB1cmwuaW5kZXhPZihcIi9cIik8MClyZXR1cm47XHJcbiAgICAgICAgdmFyIHUwPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgdmFyIHUxPXVybC5yZXBsYWNlKHUwW3UwLmxlbmd0aC0xXSxcIlwiKTtcclxuXHJcbiAgICAgICAgdmFyIHVybHM9W107XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gTGF5YS5Mb2FkZXIubG9hZGVkTWFwKSB7XHJcbiAgICAgICAgICAgIGlmIChMYXlhLkxvYWRlci5sb2FkZWRNYXAuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvYWRVcmw6c3RyaW5nPSBrZXk7XHJcbiAgICAgICAgICAgICAgICBpZihsb2FkVXJsLmluZGV4T2YodTEpPj0wIHx8IGxvYWRVcmwuaW5kZXhPZihcInJlcy9tYXRzL1wiKT49MCApe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHVybHMuaW5kZXhPZihsb2FkVXJsKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJscy5wdXNoKGxvYWRVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cmxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHVybHNbaV07XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvL+agueaNrui1hOa6kOi3r+W+hOiOt+WPlui1hOa6kO+8iFJlc291cmNl5Li65p2Q6LSo44CB6LS05Zu+44CB572R5qC8562J55qE5Z+657G777yJXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzOkxheWEuUmVzb3VyY2U9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcbiAgICAgICAgICAgICAgICBpZighcmVzLmxvY2spe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/otYTmupDph4rmlL5cclxuICAgICAgICAgICAgICAgICAgICByZXMucmVsZWFzZVJlc291cmNlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBMYXlhLmxvYWRlci5jbGVhclJlcyh1cmwpO1xyXG4gICAgICAgICAgICAgICAgLy9MYXlhLmxvYWRlci5jbGVhclVuTG9hZGVkKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpZFJlc291cmNlc01hcExvY2sodGFyZ2V0LGlzTG9jaz10cnVlKXtcclxuICAgICAgICBpZih0YXJnZXQ9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBvYmpMaXN0PVdteVV0aWxzM0QuZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LExheWEuUmVuZGVyYWJsZVNwcml0ZTNEKTtcclxuICAgICAgICB2YXIga0lkcz1bXTtcclxuICAgICAgICBmb3IgKHZhciBpIGluIG9iakxpc3Qpe1xyXG4gICAgICAgICAgICB2YXIgb2JqPW9iakxpc3RbaV07XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5fbG9vcExvY2sob2JqLGtJZHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgck1hcD1MYXlhLlJlc291cmNlW1wiX2lkUmVzb3VyY2VzTWFwXCJdO1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4ga0lkcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPWtJZHNba107XHJcbiAgICAgICAgICAgIHZhciByZXM9ck1hcFtvXTtcclxuICAgICAgICAgICAgcmVzLmxvY2s9aXNMb2NrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfbG9vcExvY2sob2JqLGFycil7XHJcbiAgICAgICAgV215TG9hZDNkLl9NZXNoKG9iaixhcnIpO1xyXG4gICAgICAgIFdteUxvYWQzZC5fTWF0ZXJpYWxzKG9iaixhcnIpO1xyXG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcclxuICAgICAgICAgICAgY29uc3QgbyA9IG9ialtrXTtcclxuICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuQmFzZVJlbmRlcil7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX2xvb3BMb2NrKG8sYXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfTWVzaChvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLk1lc2gpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9nZXRSZXNvdXJjZXNNYXBJZChvLGFycik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBfdmVydGV4QnVmZmVycz1vW1wiX3ZlcnRleEJ1ZmZlcnNcIl07XHJcbiAgICAgICAgICAgICAgICBpZihfdmVydGV4QnVmZmVycyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBrMCBpbiBfdmVydGV4QnVmZmVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvMCA9IF92ZXJ0ZXhCdWZmZXJzW2swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobzAgaW5zdGFuY2VvZiBMYXlhLlZlcnRleEJ1ZmZlcjNEKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobzAsYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrMSBpbiBvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbzEgPSBvW2sxXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihvMSBpbnN0YW5jZW9mIExheWEuSW5kZXhCdWZmZXIzRCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobzEsYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX01hdGVyaWFscyhvYmosYXJyKXtcclxuICAgICAgICB2YXIgX21hdGVyaWFscz1vYmpbXCJfbWF0ZXJpYWxzXCJdO1xyXG4gICAgICAgIGlmKF9tYXRlcmlhbHMpe1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgaW4gX21hdGVyaWFscykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbyA9IF9tYXRlcmlhbHNba107XHJcbiAgICAgICAgICAgICAgICBpZihvIGluc3RhbmNlb2YgTGF5YS5CYXNlTWF0ZXJpYWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fU2hhZGVyKG8sYXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX1NoYWRlckRhdGEobyxhcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfU2hhZGVyKG9iaixhcnIpe1xyXG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcclxuICAgICAgICAgICAgY29uc3QgbyA9IG9ialtrXTtcclxuICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuU2hhZGVyM0Qpe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZDNkLl9nZXRSZXNvdXJjZXNNYXBJZChvLGFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgc3RhdGljIF9TaGFkZXJEYXRhKG9iaixhcnIpe1xyXG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcclxuICAgICAgICAgICAgY29uc3QgbyA9IG9ialtrXTtcclxuICAgICAgICAgICAgaWYobyBpbnN0YW5jZW9mIExheWEuU2hhZGVyRGF0YSl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkM2QuX0Jhc2VUZXh0dXJlKG9bXCJfZGF0YVwiXSxhcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9CYXNlVGV4dHVyZShvYmosYXJyKXtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBvYmpba107XHJcbiAgICAgICAgICAgIGlmKG8gaW5zdGFuY2VvZiBMYXlhLkJhc2VUZXh0dXJlKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWQzZC5fZ2V0UmVzb3VyY2VzTWFwSWQobyxhcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9nZXRSZXNvdXJjZXNNYXBJZChvYmosYXJyKXtcclxuICAgICAgICB2YXIgck1hcD1MYXlhLlJlc291cmNlW1wiX2lkUmVzb3VyY2VzTWFwXCJdO1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4gck1hcCl7XHJcbiAgICAgICAgICAgIHZhciByZXM9ck1hcFtrXTtcclxuICAgICAgICAgICAgaWYob2JqPT1yZXMpe1xyXG4gICAgICAgICAgICAgICAgaWYoYXJyLmluZGV4T2Yoayk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgV215TG9hZE1hdHN7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlMb2FkTWF0c3tcclxuICAgICAgICBpZihXbXlMb2FkTWF0cy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWRNYXRzLl90aGlzPW5ldyBXbXlMb2FkTWF0cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215TG9hZE1hdHMuX3RoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbmxvYWQzZCh1cmxMaXN0OkFycmF5PHN0cmluZz4sY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uVXJsQXJyT2ssW3VybExpc3RdKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21hdHNVcmxBcnI6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgIHByaXZhdGUgX21hdE9rPWZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfbWF0TnVtPTA7XHJcbiAgICBwcml2YXRlIF9tYXRQPTA7XHJcbiAgICBwcml2YXRlIF9tYXRQMj0wO1xyXG5cclxuICAgIHByaXZhdGUgX19vblVybEFyck9rKHVybExpc3Q6QXJyYXk8c3RyaW5nPil7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx1cmxMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgdXJsPXVybExpc3RbaV07XHJcbiAgICAgICAgICAgIC8vIHZhciB0eHQ9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcbiAgICAgICAgICAgIC8vIHZhciBqc09iaj1KU09OLnBhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgIHZhciBqc09iaj1MYXlhLmxvYWRlci5nZXRSZXModXJsKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhcnI9dXJsLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgdmFyIG1hdHNVcmw9dXJsLnJlcGxhY2UoYXJyW2Fyci5sZW5ndGgtMV0sXCJcIik7XHJcbiAgICAgICAgICAgIHZhciBhcnJheTpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXk9anNPYmpbXCJtYXRzXCJdO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJyYXkubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBhcnJheVtqXTtcclxuICAgICAgICAgICAgICAgIGlmKG9ialtcInRhcmdldE5hbWVcIl09PVwiXCIpY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0VXJsPW1hdHNVcmwrb2JqW1wibWF0VXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0c1VybEFyci5wdXNoKG1hdFVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5fbWF0c1VybEFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMuX21hdHNVcmxBcnJbaV07XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyck9rKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTWF0QXJyUCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25NYXRBcnJQKHApe1xyXG4gICAgICAgIHZhciBwTnVtPXAqKHRoaXMuX21hdE51bSsxKTtcclxuICAgICAgICBpZihwTnVtPnRoaXMuX21hdFApdGhpcy5fbWF0UD1wTnVtO1xyXG4gICAgICAgIHRoaXMuX21hdFAyPSh0aGlzLl9tYXRQL3RoaXMuX21hdHNVcmxBcnIubGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFt0aGlzLl9tYXRQMl0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25NYXRBcnJPaygpe1xyXG4gICAgICAgIHRoaXMuX21hdE51bSs9MTtcclxuICAgICAgICBpZih0aGlzLl9tYXROdW0+PXRoaXMuX21hdHNVcmxBcnIubGVuZ3RoKXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJpbXBvcnQgeyBXbXlVdGlsczNEIH0gZnJvbSBcIi4vV215VXRpbHMzRFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteVNjcmlwdDNEIGV4dGVuZHMgTGF5YS5TY3JpcHQzRCB7XHJcbiAgICBwdWJsaWMgZGVsKGRlc3Ryb3lDaGlsZDogYm9vbGVhbiA9IHRydWUpe1xyXG4gICAgICAgIHRoaXMub3duZXIzRC5kZXN0cm95KGRlc3Ryb3lDaGlsZCk7XHJcbiAgICB9XHJcblx0cHVibGljIG9uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm93bmVyM0Q9bnVsbDtcclxuICAgICAgICB0aGlzLnNjZW5lM0Q9bnVsbDtcclxuICAgICAgICB0aGlzLm9uRGVsKCk7XHJcbiAgICB9XHJcbiAgICBcclxuXHRwdWJsaWMgb25EZWwoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgb3duZXIzRDpMYXlhLlNwcml0ZTNEO1xyXG4gICAgcHJpdmF0ZSBfbG9jYWxTY2FsZTpMYXlhLlZlY3RvcjM7XHJcblxyXG4gICAgcHVibGljIHNjZW5lM0Q6TGF5YS5TY2VuZTNEO1xyXG5cclxuXHRwdWJsaWMgX29uQWRkZWQoKSB7XHJcbiAgICAgICAgc3VwZXIuX29uQWRkZWQoKTtcclxuICAgICAgICB0aGlzLm93bmVyM0Q9dGhpcy5vd25lciBhcyBMYXlhLlNwcml0ZTNEO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2NhbFNjYWxlPW5ldyBMYXlhLlZlY3RvcjMoMCwgMCwgMCk7XHJcbiAgICAgICAgaWYodGhpcy5vd25lcjNELnRyYW5zZm9ybSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsU2NhbGU9dGhpcy5vd25lcjNELnRyYW5zZm9ybS5sb2NhbFNjYWxlLmNsb25lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NlbmUzRD10aGlzLm93bmVyM0Quc2NlbmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8v5piv5ZCm5Y+v6KeBXHJcbiAgICBwdWJsaWMgc2V0U2hvdyh2OmJvb2xlYW4pe1xyXG4gICAgICAgIHRoaXMub3duZXIzRC50cmFuc2Zvcm0ubG9jYWxTY2FsZSA9ICF2PyBuZXcgTGF5YS5WZWN0b3IzKDAsIDAsIDApOiB0aGlzLl9sb2NhbFNjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vXHJcbiAgICBwdWJsaWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpOmFueXtcclxuICAgICAgICByZXR1cm4gV215VXRpbHMzRC5nZXRPYmozZFVybCh0YXJnZXQsdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvL+iuvue9rumYtOW9sVxyXG4gICAgcHVibGljIG9uU2V0U2hhZG93KGlzQ2FzdFNoYWRvdyxpc1JlY2VpdmVTaGFkb3cpXHJcbiAgICB7XHJcbiAgICAgICAgV215VXRpbHMzRC5vblNldFNoYWRvdyh0aGlzLm93bmVyM0QsaXNDYXN0U2hhZG93LGlzUmVjZWl2ZVNoYWRvdyk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgV215X0xvYWRfTWFnIH0gZnJvbSBcIi4uL1dteV9Mb2FkX01hZ1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteVV0aWxzM0R7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkKHRhcmdldCxvYmpOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5uYW1lPT1vYmpOYW1lKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvOkxheWEuU3ByaXRlM0QgPSB0YXJnZXQuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBpZiAoby5fY2hpbGRyZW4ubGVuZ3RoIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG8ubmFtZT09b2JqTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG87XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wT2JqPXRoaXMuZ2V0T2JqM2QobyxvYmpOYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBPYmohPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wT2JqO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2RVcmwodGFyZ2V0LHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBhcnJVcmw9dXJsLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldE9iakFyclVybCh0YXJnZXQsYXJyVXJsKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgX2dldE9iakFyclVybCh0YXJnZXQsdXJsQXJyOkFycmF5PHN0cmluZz4saWQ9MCl7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYoX3RhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgbmE9dXJsQXJyW2lkXTtcclxuICAgICAgICB2YXIgdGFyZ2V0T2JqPV90YXJnZXQuZ2V0Q2hpbGRCeU5hbWUobmEpO1xyXG4gICAgICAgIGlmKHRhcmdldE9iaj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihpZD49dXJsQXJyLmxlbmd0aC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGFyZ2V0T2JqPXRoaXMuX2dldE9iakFyclVybCh0YXJnZXRPYmosdXJsQXJyLCsraWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxjbGFzOmFueSxhcnI/KTpBcnJheTxhbnk+e1xyXG4gICAgICAgIGlmKGFycj09bnVsbClhcnI9W107XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvYmo9dGFyZ2V0LmdldENvbXBvbmVudChjbGFzKTtcclxuICAgICAgICBpZihvYmo9PW51bGwpe1xyXG4gICAgICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBjbGFzKXtcclxuICAgICAgICAgICAgICAgIG9iaj10YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqIT1udWxsICYmIGFyci5pbmRleE9mKG9iaik8MCl7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5fY2hpbGRyZW49PW51bGwpIHJldHVybiBhcnI7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZHJlbkNvbXBvbmVudChvLGNsYXMsYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlKHRhcmdldCx0YXJnZXROYW1lPzpzdHJpbmcpOmFueXtcclxuICAgICAgICBpZih0YXJnZXQ9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD1udWxsO1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUpe1xyXG4gICAgICAgICAgICB2YXIgdGVtcE9iaj1XbXlVdGlsczNELmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKTtcclxuICAgICAgICAgICAgaWYodGVtcE9iail7XHJcbiAgICAgICAgICAgICAgICBfdGFyZ2V0PUxheWEuU3ByaXRlM0QuaW5zdGFudGlhdGUodGVtcE9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgX3RhcmdldD1MYXlhLlNwcml0ZTNELmluc3RhbnRpYXRlKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5r+A5rS76Zi05b2x44CCXHJcbiAgICAgKiBAcGFyYW1cdGRpcmVjdGlvbkxpZ2h0IOebtOe6v+WFiVxyXG4gICAgICogQHBhcmFtXHRzaGFkb3dSZXNvbHV0aW9uIOeUn+aIkOmYtOW9sei0tOWbvuWwuuWvuFxyXG4gICAgICogQHBhcmFtXHRzaGFkb3dQQ0ZUeXBlIOaooeeziuetiee6pyzotorlpKfotorpq5gs5pu06ICX5oCn6IO9XHJcbiAgICAgKiBAcGFyYW1cdHNoYWRvd0Rpc3RhbmNlIOWPr+ingemYtOW9sei3neemu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uU2V0RGlyZWN0aW9uTGlnaHQoZGlyZWN0aW9uTGlnaHQsc2hhZG93UmVzb2x1dGlvbj01MTIsc2hhZG93UENGVHlwZT0xLHNoYWRvd0Rpc3RhbmNlOm51bWJlcj0xNSxpc1NoYWRvdzpib29sZWFuPXRydWUpe1xyXG4gICAgICAgIGlmKGRpcmVjdGlvbkxpZ2h0IGluc3RhbmNlb2YgTGF5YS5EaXJlY3Rpb25MaWdodCl7XHJcbiAgICAgICAgICAgIC8v54Gv5YWJ5byA5ZCv6Zi05b2xXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICAvL+WPr+ingemYtOW9sei3neemu1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dEaXN0YW5jZSA9IHNoYWRvd0Rpc3RhbmNlO1xyXG4gICAgICAgICAgICAvL+eUn+aIkOmYtOW9sei0tOWbvuWwuuWvuFxyXG4gICAgICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dSZXNvbHV0aW9uID0gc2hhZG93UmVzb2x1dGlvbjtcclxuICAgICAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UFNTTUNvdW50PTE7XHJcbiAgICAgICAgICAgIC8v5qih57OK562J57qnLOi2iuWkp+i2iumrmCzmm7TogJfmgKfog71cclxuICAgICAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UENGVHlwZSA9IHNoYWRvd1BDRlR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDmv4DmtLvpmLTlvbHjgIJcclxuICAgICAqIEBwYXJhbVx0dGFyZ2V0IFxyXG4gICAgICogQHBhcmFtXHR0eXBlIDDmjqXmlLbpmLTlvbEsMeS6p+eUn+mYtOW9sSwy5o6l5pS26Zi05b2x5Lqn55Sf6Zi05b2xXHJcbiAgICAgKiBAcGFyYW1cdGlzU2hhZG93IOaYr+WQpumYtOW9sVxyXG4gICAgICogQHBhcmFtXHRpc0NoaWxkcmVuIOaYr+WQpuWtkOWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uQ2FzdFNoYWRvdyh0YXJnZXQsdHlwZT0wLGlzU2hhZG93PXRydWUsaXNDaGlsZHJlbj10cnVlKXtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLk1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBtczNEPSh0YXJnZXQgYXMgTGF5YS5NZXNoU3ByaXRlM0QpO1xyXG4gICAgICAgICAgICBpZih0eXBlPT0wKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0yKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBzbXMzZD0odGFyZ2V0IGFzIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGU9PTApe1xyXG4gICAgICAgICAgICAgICAgc21zM2Quc2tpbm5lZE1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIHNtczNkLnNraW5uZWRNZXNoUmVuZGVyZXIuY2FzdFNoYWRvdz1pc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaXNDaGlsZHJlbil7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lm51bUNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSB0YXJnZXQuZ2V0Q2hpbGRBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25DYXN0U2hhZG93KG9iaix0eXBlLGlzU2hhZG93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBvblNldFNoYWRvdyh0YXJnZXQsaXNDYXN0U2hhZG93LGlzUmVjZWl2ZVNoYWRvdyl7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5NZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICB0YXJnZXQubWVzaFJlbmRlcmVyLmNhc3RTaGFkb3cgPSBpc0Nhc3RTaGFkb3c7XHJcbiAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgIHRhcmdldC5tZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzUmVjZWl2ZVNoYWRvdztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICB0YXJnZXQuc2tpbm5lZE1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNDYXN0U2hhZG93O1xyXG4gICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICB0YXJnZXQuc2tpbm5lZE1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNSZWNlaXZlU2hhZG93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZ2IyaGV4KHIsZyxiKXtcclxuICAgICAgICB2YXIgX2hleD1cIiNcIiArIHRoaXMuaGV4KHIpICt0aGlzLiBoZXgoZykgKyB0aGlzLmhleChiKTtcclxuICAgICAgICByZXR1cm4gX2hleC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGV4KHgpe1xyXG4gICAgICAgIHg9dGhpcy5vbk51bVRvKHgpO1xyXG4gICAgICAgIHJldHVybiAoXCIwXCIgKyBwYXJzZUludCh4KS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGhleDJyZ2IoaGV4OnN0cmluZykge1xyXG4gICAgICAgIC8vIEV4cGFuZCBzaG9ydGhhbmQgZm9ybSAoZS5nLiBcIjAzRlwiKSB0byBmdWxsIGZvcm0gKGUuZy4gXCIwMDMzRkZcIilcclxuICAgICAgICB2YXIgc2hvcnRoYW5kUmVnZXggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pO1xyXG4gICAgICAgIGhleCA9IGhleC5yZXBsYWNlKHNob3J0aGFuZFJlZ2V4LCBmdW5jdGlvbihtLCByLCBnLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByICsgciArIGcgKyBnICsgYiArIGI7XHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICB2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHtcclxuICAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXHJcbiAgICAgICAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxyXG4gICAgICAgICAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxyXG4gICAgICAgIH0gOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4pe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQoMikpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBcclxuICAgcHVibGljIHN0YXRpYyBsZXJwRihhOm51bWJlciwgYjpudW1iZXIsIHM6bnVtYmVyKTpudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIChhICsgKGIgLSBhKSAqIHMpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSYXlDYXN0QWxsKGNhbTpMYXlhLkNhbWVyYSwgdmlld3BvcnRQb2ludDpMYXlhLlZlY3RvcjIsIHJheT86TGF5YS5SYXksIGNvbGxpc29uR3JvdXA/OiBudW1iZXIsIGNvbGxpc2lvbk1hc2s/OiBudW1iZXIpe1xyXG4gICAgICAgIHZhciBfb3V0SGl0QWxsSW5mbyA9ICBuZXcgQXJyYXk8TGF5YS5IaXRSZXN1bHQ+KCk7XHJcbiAgICAgICAgdmFyIF9yYXkgPXJheTtcclxuICAgICAgICBpZighX3JheSl7XHJcbiAgICAgICAgICAgIF9yYXkgPSBuZXcgTGF5YS5SYXkobmV3IExheWEuVmVjdG9yMygpLCBuZXcgTGF5YS5WZWN0b3IzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL+S7juWxj+W5leepuumXtOeUn+aIkOWwhOe6v1xyXG4gICAgICAgIHZhciBfcG9pbnQgPSB2aWV3cG9ydFBvaW50LmNsb25lKCk7XHJcbiAgICAgICAgY2FtLnZpZXdwb3J0UG9pbnRUb1JheShfcG9pbnQsIF9yYXkpO1xyXG4gICAgICAgIC8v5bCE57q/5qOA5rWL6I635Y+W5omA5pyJ5qOA5rWL56Kw5pKe5Yiw55qE54mp5L2TXHJcbiAgICAgICAgaWYoY2FtLnNjZW5lIT1udWxsICYmIGNhbS5zY2VuZS5waHlzaWNzU2ltdWxhdGlvbiE9bnVsbCl7XHJcbiAgICAgICAgICAgIGNhbS5zY2VuZS5waHlzaWNzU2ltdWxhdGlvbi5yYXlDYXN0QWxsKF9yYXksIF9vdXRIaXRBbGxJbmZvLCAxMDAwMCwgY29sbGlzb25Hcm91cCwgY29sbGlzaW9uTWFzayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfb3V0SGl0QWxsSW5mbztcclxuICAgIH1cclxuXHJcbiAgICAvL+i3neemu1xyXG5cdHB1YmxpYyBzdGF0aWMgRGlzdGFuY2UoYTpMYXlhLlZlY3RvcjIsYjpMYXlhLlZlY3RvcjIpOm51bWJlciB7XHJcblx0XHR2YXIgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xyXG5cdFx0dmFyIGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcclxuXHRcdHZhciBkPU1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpO1xyXG5cdFx0ZD1wYXJzZUZsb2F0KGQudG9GaXhlZCgyKSk7XHJcblx0XHRyZXR1cm4gZDtcclxuICAgIH1cclxuICAgIFxyXG5cclxuXHJcbiAgICAvL+WKqOeUuy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaVBsYXkodGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSwgbm9ybWFsaXplZFRpbWU/Om51bWJlciwgY29tcGxldGVFdmVudD86TGF5YS5IYW5kbGVyLCBwYXJhbXM/OkFycmF5PGFueT4sIGxheWVySW5kZXg/OiBudW1iZXIpOkxheWEuQW5pbWF0b3J7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihjb21wbGV0ZUV2ZW50KXtcclxuICAgICAgICAgICAgV215VXRpbHMzRC5hbmlBZGRFdmVudEZ1bih0YXJnZXQzZCxudWxsLGFuaU5hbWUsLTEsY29tcGxldGVFdmVudCx0cnVlLHBhcmFtcyxsYXllckluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFyZ2V0M2RfYW5pLnBsYXkoYW5pTmFtZSxsYXllckluZGV4LG5vcm1hbGl6ZWRUaW1lKTtcclxuICAgICAgICByZXR1cm4gdGFyZ2V0M2RfYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pQWRkRXZlbnRGdW4odGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSx0aW1lOm51bWJlcixjYWxsYmFjazpMYXlhLkhhbmRsZXIsaXNFdmVudE9uZT10cnVlLHBhcmFtcz86QXJyYXk8YW55PixsYXllckluZGV4PzogbnVtYmVyKXtcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYodGFyZ2V0TmFtZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRhcmdldDNkPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldDNkPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgaWYodGFyZ2V0M2RfYW5pPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFdteVV0aWxzM0QuX2FuaUFkZEV2ZW50KHRhcmdldDNkX2FuaSxudWxsLGFuaU5hbWUsXCJfd215X2FuaV9jYWxsYmFja1wiLHRpbWUscGFyYW1zLGxheWVySW5kZXgpO1xyXG4gICAgICAgIHZhciB3YWU9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KF9fV215QW5pRXZlbnQpIGFzIF9fV215QW5pRXZlbnQ7XHJcbiAgICAgICAgaWYoIXdhZSl7XHJcbiAgICAgICAgICAgIHdhZT10YXJnZXQzZC5hZGRDb21wb25lbnQoX19XbXlBbmlFdmVudCkgYXMgX19XbXlBbmlFdmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrTmFtZT1cIndteV9cIitjYWxsYmFjay5jYWxsZXIuaWQrYW5pTmFtZSt0aW1lO1xyXG4gICAgICAgIGlmKGlzRXZlbnRPbmUpe1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLm9uY2UoY2FsbGJhY2tOYW1lLHRoaXMsKF9jYWxsYmFja05hbWUsX2NhbGxiYWNrLHApPT57XHJcbiAgICAgICAgICAgICAgICBfY2FsbGJhY2sucnVuV2l0aChwKTtcclxuICAgICAgICAgICAgICAgIHdhZS5kZWxDYWxsYmFjayhfY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICAgICAgfSxbY2FsbGJhY2tOYW1lLGNhbGxiYWNrXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2Uub24oY2FsbGJhY2tOYW1lLHRoaXMsKF9jYWxsYmFja05hbWUsX2NhbGxiYWNrLHApPT57XHJcbiAgICAgICAgICAgICAgICBfY2FsbGJhY2sucnVuV2l0aChwKTtcclxuICAgICAgICAgICAgfSxbY2FsbGJhY2tOYW1lLGNhbGxiYWNrXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdhZS5hZGRDYWxsYmFjayhjYWxsYmFja05hbWUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaURlbEV2ZW50RnVuKHRhcmdldCx0YXJnZXROYW1lLGNhbGxiYWNrOkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIGlmKHRhcmdldDNkX2FuaT09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgd2FlPXRhcmdldDNkLmdldENvbXBvbmVudChfX1dteUFuaUV2ZW50KSBhcyBfX1dteUFuaUV2ZW50O1xyXG4gICAgICAgIGlmKHdhZSl7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFja05hbWU9XCJ3bXlfXCIrY2FsbGJhY2suY2FsbGVyLm5hbWUrY2FsbGJhY2subWV0aG9kLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2Uub24oY2FsbGJhY2tOYW1lLGNhbGxiYWNrLmNhbGxlcixjYWxsYmFjay5tZXRob2QpO1xyXG4gICAgICAgICAgICB3YWUuZGVsQ2FsbGJhY2soY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBfYW5pQWRkRXZlbnQodGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSxldmVudE5hbWU6c3RyaW5nLHRpbWU6bnVtYmVyLHBhcmFtcz86QXJyYXk8YW55PixsYXllckluZGV4PzogbnVtYmVyKTpMYXlhLkFuaW1hdG9ye1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPW51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT1udWxsO1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICB0YXJnZXQzZD10YXJnZXQ7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldE5hbWUhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0YXJnZXQzZD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuQW5pbWF0b3Ipe1xyXG4gICAgICAgICAgICB0YXJnZXQzZF9hbmk9dGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGFuaW1hdG9yU3RhdGU6TGF5YS5BbmltYXRvclN0YXRlPXRhcmdldDNkX2FuaS5nZXRDb250cm9sbGVyTGF5ZXIobGF5ZXJJbmRleCkuX3N0YXRlc01hcFthbmlOYW1lXTtcclxuICAgICAgICBpZihhbmltYXRvclN0YXRlPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBpc0FkZD10cnVlO1xyXG4gICAgICAgIHZhciBldmVudHM9YW5pbWF0b3JTdGF0ZS5fY2xpcC5fZXZlbnRzO1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGV2ZW50cykge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50OkxheWEuQW5pbWF0aW9uRXZlbnQgPSBldmVudHNba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmKGV2ZW50LmV2ZW50TmFtZT09ZXZlbnROYW1lICYmIGFuaUV2ZW50LnRpbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQWRkPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzQWRkKXtcclxuICAgICAgICAgICAgdmFyIGFuaUV2ZW50PW5ldyBMYXlhLkFuaW1hdGlvbkV2ZW50KCk7XHJcbiAgICAgICAgICAgIGFuaUV2ZW50LmV2ZW50TmFtZT1ldmVudE5hbWU7XHJcbiAgICAgICAgICAgIHZhciBjbGlwRHVyYXRpb249YW5pbWF0b3JTdGF0ZS5fY2xpcC5fZHVyYXRpb247XHJcbiAgICAgICAgICAgIGlmKHRpbWU9PS0xKXtcclxuICAgICAgICAgICAgICAgIHRpbWU9Y2xpcER1cmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFuaUV2ZW50LnRpbWU9IHRpbWUgLyBjbGlwRHVyYXRpb247XHJcbiAgICAgICAgICAgIGFuaUV2ZW50LnBhcmFtcz1wYXJhbXM7XHJcbiAgICAgICAgICAgIGFuaW1hdG9yU3RhdGUuX2NsaXAuYWRkRXZlbnQoYW5pRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0M2RfYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pQWRkU2NyaXB0KHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUsc2NyaXB0PzphbnksbGF5ZXJJbmRleD86IG51bWJlcik6TGF5YS5BbmltYXRvclN0YXRle1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRhcmdldDtcclxuICAgICAgICBpZih0YXJnZXROYW1lIT1udWxsKXtcclxuICAgICAgICAgICAgdGFyZ2V0M2Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0M2Q9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZih0YXJnZXQzZF9hbmk9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGFuaW1hdG9yU3RhdGU6TGF5YS5BbmltYXRvclN0YXRlPXRhcmdldDNkX2FuaS5nZXRDb250cm9sbGVyTGF5ZXIobGF5ZXJJbmRleCkuX3N0YXRlc01hcFthbmlOYW1lXTtcclxuICAgICAgICBpZihhbmltYXRvclN0YXRlPT1udWxsKXJldHVybiBudWxsO1xyXG4gICAgICAgIGFuaW1hdG9yU3RhdGUuYWRkU2NyaXB0KHNjcmlwdCk7XHJcbiAgICAgICAgcmV0dXJuIGFuaW1hdG9yU3RhdGU7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuXHJcblxyXG5jbGFzcyBfX1dteUFuaUV2ZW50IGV4dGVuZHMgTGF5YS5TY3JpcHQzRCB7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFjaz1bXTtcclxuICAgIHB1YmxpYyBhZGRDYWxsYmFjayhjYWxsYmFja05hbWUpe1xyXG4gICAgICAgIHZhciBpbmRleElkPXRoaXMuX2NhbGxiYWNrLmluZGV4T2YoY2FsbGJhY2tOYW1lKTtcclxuICAgICAgICBpZihpbmRleElkPDApe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5wdXNoKGNhbGxiYWNrTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGRlbENhbGxiYWNrKGNhbGxiYWNrTmFtZSl7XHJcbiAgICAgICAgdmFyIGluZGV4SWQ9dGhpcy5fY2FsbGJhY2suaW5kZXhPZihjYWxsYmFja05hbWUpO1xyXG4gICAgICAgIGlmKGluZGV4SWQ+PTApe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjay5zcGxpY2UoaW5kZXhJZCwxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgX3dteV9hbmlfY2FsbGJhY2socGFyYW1zPzpBcnJheTxhbnk+KXtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2NhbGxiYWNrLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrTmFtZSA9IHRoaXMuX2NhbGxiYWNrW2ldO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KGNhbGxiYWNrTmFtZSxwYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSBcIi4uL1dteVNjcmlwdDNEXCI7XHJcbmltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi4vV215VXRpbHMzRFwiO1xyXG5pbXBvcnQgeyBXbXlVdGlscyB9IGZyb20gXCIuLi8uLi9XbXlVdGlsc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215QzREVmV0ZXhBbmltYXRvciBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuICAgIF9hbmlyOkxheWEuQW5pbWF0b3I7XHJcbiAgICBfdmVydGljZXNPYmo6TGF5YS5TcHJpdGUzRDtcclxuICAgIG9uQXdha2UoKXtcclxuICAgICAgICB0aGlzLl9hbmlyPXRoaXMub3duZXIzRC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICBpZiAodGhpcy5fYW5pciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGlzLm93bmVyM0Qub24oXCJhbmlfcGxheVwiLHRoaXMsdGhpcy5vblBsYXkpO1xyXG5cclxuICAgICAgICB2YXIgb2Jqcz10aGlzLl9hbmlyLl9yZW5kZXJhYmxlU3ByaXRlcztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHZldGV4VD1udWxsO1xyXG4gICAgICAgICAgICBjb25zdCBtZXNoT2JqID0gb2Jqc1tpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtZXNoT2JqLm51bUNoaWxkcmVuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNPYmogPSBtZXNoT2JqLmdldENoaWxkQXQoaSk7XHJcbiAgICAgICAgICAgICAgICBpZihjT2JqLm5hbWUuaW5kZXhPZihcIlZldGV4X0hhbmRsZVwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmV0ZXhUPWNPYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodmV0ZXhUIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2VzT2JqPXZldGV4VDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL21lc2hPYmouX3JlbmRlci5lbmFibGU9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl92ZXJ0aWNlc09iaiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uSW5pdFZlcnRleCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG9uUGxheShuPVwicGxheVwiLHQ9MCxzcGVlZD0xKXtcclxuICAgIC8vICAgICB2YXIgb2Jqcz10aGlzLl9hbmlyLl9yZW5kZXJhYmxlU3ByaXRlcztcclxuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgICAgICAgY29uc3QgbWVzaE9iaiA9IG9ianNbaV07XHJcbiAgICAvLyAgICAgICAgIC8vbWVzaE9iai5fcmVuZGVyLmVuYWJsZT10cnVlO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgdGhpcy5fYW5pci5wbGF5KG4sdW5kZWZpbmVkLHQpO1xyXG4gICAgLy8gICAgIHRoaXMuX2FuaXIuc3BlZWQ9c3BlZWQ7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy/pobbngrktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgX21lc2g6TGF5YS5NZXNoRmlsdGVyO1xyXG4gICAgX3NoYXJlZE1lc2g6YW55O1xyXG5cclxuICAgIF92ZXJ0ZXhCdWZmZXJzOkFycmF5PExheWEuVmVydGV4QnVmZmVyM0Q+O1xyXG4gICAgX3ZlcnRleEFycmF5OkFycmF5PExheWEuVHJhbnNmb3JtM0Q+O1xyXG4gICAgX21NYXBwaW5nVmV0ZXhJbmZvQXJyOkFycmF5PGFueT47XHJcbiAgICBfbUNhY2hlVmVydGljZXNBcnI6QXJyYXk8YW55PjtcclxuXHJcbiAgICBvbkluaXRWZXJ0ZXgoKXtcclxuICAgICAgICB0aGlzLl9tZXNoID0gdGhpcy5fdmVydGljZXNPYmoucGFyZW50W1wibWVzaEZpbHRlclwiXTtcclxuICAgICAgICBpZighdGhpcy5fbWVzaCl7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl92ZXJ0aWNlc09iai5udW1DaGlsZHJlbj4wKXtcclxuICAgICAgICAgICAgdGhpcy5fdmVydGV4QXJyYXk9W107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdmVydGljZXNPYmoubnVtQ2hpbGRyZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmVydGV4QXJyYXlbaV0gPSAodGhpcy5fdmVydGljZXNPYmouZ2V0Q2hpbGRBdChpKSBhcyBMYXlhLlNwcml0ZTNEKS50cmFuc2Zvcm07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIXRoaXMuX3ZlcnRleEFycmF5KXtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhPVtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3ZlcnRleEJ1ZmZlcnM9dGhpcy5fbWVzaC5zaGFyZWRNZXNoW1wiX3ZlcnRleEJ1ZmZlcnNcIl07XHJcbiAgICAgICAgdGhpcy5fdmVydGV4QnVmZmVycz10aGlzLl92ZXJ0ZXhCdWZmZXJzLmNvbmNhdCgpO1xyXG4gICAgICAgIHRoaXMuX21lc2guc2hhcmVkTWVzaFtcIl92ZXJ0ZXhCdWZmZXJzXCJdPXRoaXMuX3ZlcnRleEJ1ZmZlcnM7XHJcbiAgICAgIFxyXG4gICAgICAgIHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyID0gdGhpcy5fbWVzaC5zaGFyZWRNZXNoLl9nZXRQb3NpdGlvbnMoKTtcclxuICAgICAgICB0aGlzLl9tTWFwcGluZ1ZldGV4SW5mb0Fycj1bXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl92ZXJ0ZXhBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX3ZlcnRleEFycmF5W2ldO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnJbaV09e307XHJcbiAgICAgICAgICAgIHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyW2ldLlRyYW5zZm9ybUluZm8gPSBpdGVtO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1JbmRleExpc3Q9W107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyLmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmVydGV4UG9zID0gdGhpcy5fbUNhY2hlVmVydGljZXNBcnJbal07XHJcbiAgICAgICAgICAgICAgICB2YXIgZD1MYXlhLlZlY3RvcjMuZGlzdGFuY2UodmVydGV4UG9zLGl0ZW0ubG9jYWxQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZCA8PTAuMDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIG1JbmRleExpc3QucHVzaChqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnJbaV0uVmV0ZXhJREFyciA9IG1JbmRleExpc3Q7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIG9uTGF0ZVVwZGF0ZSgpe1xyXG4gICAgICAgIGlmKHRoaXMuX2FuaXIuc3BlZWQ9PTApcmV0dXJuO1xyXG4gICAgICAgIHZhciBwbGF5U3RhdGU9dGhpcy5fYW5pci5nZXRDdXJyZW50QW5pbWF0b3JQbGF5U3RhdGUoKTtcclxuICAgICAgICBpZihwbGF5U3RhdGUuX2ZpbmlzaClyZXR1cm47XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fbU1hcHBpbmdWZXRleEluZm9BcnIubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX21NYXBwaW5nVmV0ZXhJbmZvQXJyW2ldO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpdGVtLlZldGV4SURBcnIubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB2ZXJ0ZXhJRCA9IGl0ZW0uVmV0ZXhJREFycltqXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zPSBpdGVtLlRyYW5zZm9ybUluZm8ubG9jYWxQb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21DYWNoZVZlcnRpY2VzQXJyW3ZlcnRleElEXSA9IHBvcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdmVydGV4c19zZXRQb3NpdGlvbnModGhpcy5fdmVydGV4QnVmZmVycyx0aGlzLl9tQ2FjaGVWZXJ0aWNlc0Fycik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgX3ZlcnRleHNfZ2V0UG9zaXRpb25zKHZlcnRleEJ1ZmZlcnMpe1xyXG5cdFx0dmFyIHZlcnRpY2VzPVtdO1xyXG5cdFx0dmFyIGk9MCxqPTAsdmVydGV4QnVmZmVyLHBvc2l0aW9uRWxlbWVudCx2ZXJ0ZXhFbGVtZW50cyx2ZXJ0ZXhFbGVtZW50LG9mc2V0PTAsdmVydGljZXNEYXRhO1xyXG5cdFx0dmFyIHZlcnRleEJ1ZmZlckNvdW50PXZlcnRleEJ1ZmZlcnMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpPTA7aSA8IHZlcnRleEJ1ZmZlckNvdW50O2krKyl7XHJcblx0XHRcdHZlcnRleEJ1ZmZlcj12ZXJ0ZXhCdWZmZXJzW2ldO1xyXG5cdFx0XHR2ZXJ0ZXhFbGVtZW50cz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4RWxlbWVudHM7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0ZXhFbGVtZW50cy5sZW5ndGg7aisrKXtcclxuXHRcdFx0XHR2ZXJ0ZXhFbGVtZW50PXZlcnRleEVsZW1lbnRzW2pdO1xyXG5cdFx0XHRcdGlmICh2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRGb3JtYXQ9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4RWxlbWVudEZvcm1hdC5WZWN0b3IzKi9cInZlY3RvcjNcIiAmJiB2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRVc2FnZT09PS8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1BPU0lUSU9OMCovMCl7XHJcblx0XHRcdFx0XHRwb3NpdGlvbkVsZW1lbnQ9dmVydGV4RWxlbWVudDtcclxuXHRcdFx0XHRcdGJyZWFrIDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dmVydGljZXNEYXRhPXZlcnRleEJ1ZmZlci5nZXREYXRhKCk7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0aWNlc0RhdGEubGVuZ3RoO2orPXZlcnRleEJ1ZmZlci52ZXJ0ZXhEZWNsYXJhdGlvbi52ZXJ0ZXhTdHJpZGUgLyA0KXtcclxuXHRcdFx0XHRvZnNldD1qK3Bvc2l0aW9uRWxlbWVudC5vZmZzZXQgLyA0O1xyXG5cdFx0XHRcdHZlcnRpY2VzLnB1c2gobmV3IExheWEuVmVjdG9yMyh2ZXJ0aWNlc0RhdGFbb2ZzZXQrMF0sdmVydGljZXNEYXRhW29mc2V0KzFdLHZlcnRpY2VzRGF0YVtvZnNldCsyXSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdmVydGljZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIF92ZXJ0ZXhzX3NldFBvc2l0aW9ucyh2ZXJ0ZXhCdWZmZXJzLHZlcnRpY2VzKXtcclxuXHRcdHZhciBpPTAsaj0wLHZlcnRleEJ1ZmZlcixwb3NpdGlvbkVsZW1lbnQsdmVydGV4RWxlbWVudHMsdmVydGV4RWxlbWVudCxvZnNldD0wLHZlcnRpY2VzRGF0YSx2ZXJ0aWNlO1xyXG5cdFx0dmFyIHZlcnRleEJ1ZmZlckNvdW50PXZlcnRleEJ1ZmZlcnMubGVuZ3RoO1xyXG5cdFx0Zm9yIChpPTA7aSA8IHZlcnRleEJ1ZmZlckNvdW50O2krKyl7XHJcblx0XHRcdHZlcnRleEJ1ZmZlcj12ZXJ0ZXhCdWZmZXJzW2ldO1xyXG5cdFx0XHR2ZXJ0ZXhFbGVtZW50cz12ZXJ0ZXhCdWZmZXIudmVydGV4RGVjbGFyYXRpb24udmVydGV4RWxlbWVudHM7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0ZXhFbGVtZW50cy5sZW5ndGg7aisrKXtcclxuXHRcdFx0XHR2ZXJ0ZXhFbGVtZW50PXZlcnRleEVsZW1lbnRzW2pdO1xyXG5cdFx0XHRcdGlmICh2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRGb3JtYXQ9PT0vKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4RWxlbWVudEZvcm1hdC5WZWN0b3IzKi9cInZlY3RvcjNcIiAmJiB2ZXJ0ZXhFbGVtZW50LmVsZW1lbnRVc2FnZT09PS8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1BPU0lUSU9OMCovMCl7XHJcblx0XHRcdFx0XHRwb3NpdGlvbkVsZW1lbnQ9dmVydGV4RWxlbWVudDtcclxuXHRcdFx0XHRcdGJyZWFrIDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuICAgICAgICAgICAgdmVydGljZXNEYXRhPXZlcnRleEJ1ZmZlci5nZXREYXRhKCk7XHJcbiAgICAgICAgICAgIHZhciBuPTA7XHJcblx0XHRcdGZvciAoaj0wO2ogPCB2ZXJ0aWNlc0RhdGEubGVuZ3RoO2orPXZlcnRleEJ1ZmZlci52ZXJ0ZXhEZWNsYXJhdGlvbi52ZXJ0ZXhTdHJpZGUgLyA0KXtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2U9dmVydGljZXNbbl07XHJcbiAgICAgICAgICAgICAgICBvZnNldD1qK3Bvc2l0aW9uRWxlbWVudC5vZmZzZXQgLyA0O1xyXG4gICAgICAgICAgICAgICAgdmVydGljZXNEYXRhW29mc2V0KzBdPXZlcnRpY2UueDtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzRGF0YVtvZnNldCsxXT12ZXJ0aWNlLnk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlc0RhdGFbb2ZzZXQrMl09dmVydGljZS56O1xyXG4gICAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZlcnRleEJ1ZmZlci5zZXREYXRhKHZlcnRpY2VzRGF0YSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgb25HZXRXb3JsZFBvcyh0YXJnZXQscG9zKXtcclxuICAgICAgICB2YXIgb3V0UG9zPW5ldyBMYXlhLlZlY3RvcjMoKTtcclxuICAgICAgICBpZiAodGFyZ2V0Ll9wYXJlbnQgIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIHBhcmVudFBvc2l0aW9uPXRhcmdldC5wYXJlbnQudHJhbnNmb3JtLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBMYXlhLlZlY3RvcjMubXVsdGlwbHkocG9zLHRhcmdldC5wYXJlbnQudHJhbnNmb3JtLnNjYWxlLExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdKTtcclxuICAgICAgICAgICAgTGF5YS5WZWN0b3IzLnRyYW5zZm9ybVF1YXQoTGF5YS5UcmFuc2Zvcm0zRFtcIl90ZW1wVmVjdG9yMzBcIl0sdGFyZ2V0LnBhcmVudC50cmFuc2Zvcm0ucm90YXRpb24sTGF5YS5UcmFuc2Zvcm0zRFtcIl90ZW1wVmVjdG9yMzBcIl0pO1xyXG4gICAgICAgICAgICBMYXlhLlZlY3RvcjMuYWRkKHBhcmVudFBvc2l0aW9uLExheWEuVHJhbnNmb3JtM0RbXCJfdGVtcFZlY3RvcjMwXCJdLG91dFBvcyk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBwb3MuY2xvbmVUbyhvdXRQb3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0UG9zO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSBcIi4uL1dteVNjcmlwdDNEXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlQaHlzaWNzX0NoYXJhY3RlciBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuXHRwdWJsaWMgb25EZWwoKTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5jaGFyYWN0ZXIhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLmNoYXJhY3Rlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyPW51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGNoYXJhY3RlcjpMYXlhLkNoYXJhY3RlckNvbnRyb2xsZXI7XHJcblxyXG4gICAgcHVibGljIHNwZWVkVjM9bmV3IExheWEuVmVjdG9yMygpO1xyXG4gICAgcHVibGljIGdyYXZpdHk9bmV3IExheWEuVmVjdG9yMygpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNHcm91bmRlZCgpe1xyXG4gICAgICAgIGlmKHRoaXMuY2hhcmFjdGVyPT1udWxsKXJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFyYWN0ZXIuaXNHcm91bmRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25TdGFydCgpe1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkluaXQocmFkaXVzLCBsZW5ndGgsIG9yaWVudGF0aW9uLGxvY2FsT2Zmc2V0WCwgbG9jYWxPZmZzZXRZLCBsb2NhbE9mZnNldFope1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gdGhpcy5vd25lcjNELmFkZENvbXBvbmVudChMYXlhLkNoYXJhY3RlckNvbnRyb2xsZXIpO1xyXG5cdFx0dmFyIHNwaGVyZVNoYXBlOkxheWEuQ2Fwc3VsZUNvbGxpZGVyU2hhcGUgPSBuZXcgTGF5YS5DYXBzdWxlQ29sbGlkZXJTaGFwZShyYWRpdXMsIGxlbmd0aCwgb3JpZW50YXRpb24pO1xyXG4gICAgICAgIHNwaGVyZVNoYXBlLmxvY2FsT2Zmc2V0ID1uZXcgTGF5YS5WZWN0b3IzKGxvY2FsT2Zmc2V0WCxsb2NhbE9mZnNldFksbG9jYWxPZmZzZXRaKTtcclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5jb2xsaWRlclNoYXBlID0gc3BoZXJlU2hhcGU7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIuZ3Jhdml0eT10aGlzLmdyYXZpdHk7XHJcbiAgICAgICAgLy8gdGhpcy5jaGFyYWN0ZXIuX3VwZGF0ZVBoeXNpY3NUcmFuc2Zvcm0oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBwdWJsaWMgaXNMb2NrTW92ZT1mYWxzZTtcclxuICAgIG9uVXBkYXRlKCl7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIuZ3Jhdml0eT10aGlzLmdyYXZpdHk7XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIubW92ZSh0aGlzLnNwZWVkVjMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtb3ZlKHYzOkxheWEuVmVjdG9yMyxsb2NrTW92ZVRpbWU6bnVtYmVyPTApe1xyXG4gICAgICAgIHRoaXMuaXNMb2NrTW92ZT10cnVlO1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLm1vdmUodjMpO1xyXG4gICAgICAgIExheWEudGltZXIub25jZShsb2NrTW92ZVRpbWUqMTAwMCx0aGlzLCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2NrTW92ZT1mYWxzZTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgX3VwZGF0ZVBoeXNpY3NUcmFuc2Zvcm0oKXtcclxuXHRcdC8vdmFyIG5hdGl2ZVdvcmxkVHJhbnNmb3JtPXRoaXMuY2hhcmFjdGVyLl9uYXRpdmVDb2xsaWRlck9iamVjdC5nZXRXb3JsZFRyYW5zZm9ybSgpO1xyXG5cdFx0dGhpcy5jaGFyYWN0ZXIuX2Rlcml2ZVBoeXNpY3NUcmFuc2Zvcm1hdGlvbih0cnVlKTsgXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgV0Vhc2VUeXBlIH0gZnJvbSBcIi4vV0Vhc2VUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV0Vhc2VNYW5hZ2VyIHtcclxuXHRwcml2YXRlIHN0YXRpYyBfUGlPdmVyMjogbnVtYmVyID0gTWF0aC5QSSAqIDAuNTtcclxuXHRwcml2YXRlIHN0YXRpYyBfVHdvUGk6IG51bWJlciA9IE1hdGguUEkgKiAyO1xyXG5cclxuXHRwdWJsaWMgc3RhdGljIGV2YWx1YXRlKGVhc2VUeXBlOiBudW1iZXIsIHRpbWU6IG51bWJlciwgZHVyYXRpb246IG51bWJlciwgb3ZlcnNob290T3JBbXBsaXR1ZGU6IG51bWJlciwgcGVyaW9kOiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0c3dpdGNoIChlYXNlVHlwZSkge1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5MaW5lYXI6XHJcblx0XHRcdFx0cmV0dXJuIHRpbWUgLyBkdXJhdGlvbjtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuU2luZUluOlxyXG5cdFx0XHRcdHJldHVybiAtTWF0aC5jb3ModGltZSAvIGR1cmF0aW9uICogV0Vhc2VNYW5hZ2VyLl9QaU92ZXIyKSArIDE7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlNpbmVPdXQ6XHJcblx0XHRcdFx0cmV0dXJuIE1hdGguc2luKHRpbWUgLyBkdXJhdGlvbiAqIFdFYXNlTWFuYWdlci5fUGlPdmVyMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlNpbmVJbk91dDpcclxuXHRcdFx0XHRyZXR1cm4gLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogdGltZSAvIGR1cmF0aW9uKSAtIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFkSW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWU7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YWRPdXQ6XHJcblx0XHRcdFx0cmV0dXJuIC0odGltZSAvPSBkdXJhdGlvbikgKiAodGltZSAtIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFkSW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0XHRyZXR1cm4gLTAuNSAqICgoLS10aW1lKSAqICh0aW1lIC0gMikgLSAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQ3ViaWNJbjpcclxuXHRcdFx0XHRyZXR1cm4gKHRpbWUgLz0gZHVyYXRpb24pICogdGltZSAqIHRpbWU7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkN1YmljT3V0OlxyXG5cdFx0XHRcdHJldHVybiAoKHRpbWUgPSB0aW1lIC8gZHVyYXRpb24gLSAxKSAqIHRpbWUgKiB0aW1lICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkN1YmljSW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiB0aW1lICogdGltZSAqIHRpbWU7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiB0aW1lICsgMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1YXJ0SW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuUXVhcnRPdXQ6XHJcblx0XHRcdFx0cmV0dXJuIC0oKHRpbWUgPSB0aW1lIC8gZHVyYXRpb24gLSAxKSAqIHRpbWUgKiB0aW1lICogdGltZSAtIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWFydEluT3V0OlxyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0XHRyZXR1cm4gLTAuNSAqICgodGltZSAtPSAyKSAqIHRpbWUgKiB0aW1lICogdGltZSAtIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWludEluOlxyXG5cdFx0XHRcdHJldHVybiAodGltZSAvPSBkdXJhdGlvbikgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5RdWludE91dDpcclxuXHRcdFx0XHRyZXR1cm4gKCh0aW1lID0gdGltZSAvIGR1cmF0aW9uIC0gMSkgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLlF1aW50SW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAwLjUgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZTtcclxuXHRcdFx0XHRyZXR1cm4gMC41ICogKCh0aW1lIC09IDIpICogdGltZSAqIHRpbWUgKiB0aW1lICogdGltZSArIDIpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FeHBvSW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lID09IDApID8gMCA6IE1hdGgucG93KDIsIDEwICogKHRpbWUgLyBkdXJhdGlvbiAtIDEpKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRXhwb091dDpcclxuXHRcdFx0XHRpZiAodGltZSA9PSBkdXJhdGlvbikgcmV0dXJuIDE7XHJcblx0XHRcdFx0cmV0dXJuICgtTWF0aC5wb3coMiwgLTEwICogdGltZSAvIGR1cmF0aW9uKSArIDEpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5FeHBvSW5PdXQ6XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gMCkgcmV0dXJuIDA7XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gZHVyYXRpb24pIHJldHVybiAxO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbiAqIDAuNSkgPCAxKSByZXR1cm4gMC41ICogTWF0aC5wb3coMiwgMTAgKiAodGltZSAtIDEpKTtcclxuXHRcdFx0XHRyZXR1cm4gMC41ICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXRpbWUpICsgMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkNpcmNJbjpcclxuXHRcdFx0XHRyZXR1cm4gLShNYXRoLnNxcnQoMSAtICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUpIC0gMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkNpcmNPdXQ6XHJcblx0XHRcdFx0cmV0dXJuIE1hdGguc3FydCgxIC0gKHRpbWUgPSB0aW1lIC8gZHVyYXRpb24gLSAxKSAqIHRpbWUpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5DaXJjSW5PdXQ6XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA8IDEpIHJldHVybiAtMC41ICogKE1hdGguc3FydCgxIC0gdGltZSAqIHRpbWUpIC0gMSk7XHJcblx0XHRcdFx0cmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtICh0aW1lIC09IDIpICogdGltZSkgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRWxhc3RpY0luOlxyXG5cdFx0XHRcdHZhciBzMDogbnVtYmVyO1xyXG5cdFx0XHRcdGlmICh0aW1lID09IDApIHJldHVybiAwO1xyXG5cdFx0XHRcdGlmICgodGltZSAvPSBkdXJhdGlvbikgPT0gMSkgcmV0dXJuIDE7XHJcblx0XHRcdFx0aWYgKHBlcmlvZCA9PSAwKSBwZXJpb2QgPSBkdXJhdGlvbiAqIDAuMztcclxuXHRcdFx0XHRpZiAob3ZlcnNob290T3JBbXBsaXR1ZGUgPCAxKSB7XHJcblx0XHRcdFx0XHRvdmVyc2hvb3RPckFtcGxpdHVkZSA9IDE7XHJcblx0XHRcdFx0XHRzMCA9IHBlcmlvZCAvIDQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgczAgPSBwZXJpb2QgLyBXRWFzZU1hbmFnZXIuX1R3b1BpICogTWF0aC5hc2luKDEgLyBvdmVyc2hvb3RPckFtcGxpdHVkZSk7XHJcblx0XHRcdFx0cmV0dXJuIC0ob3ZlcnNob290T3JBbXBsaXR1ZGUgKiBNYXRoLnBvdygyLCAxMCAqICh0aW1lIC09IDEpKSAqIE1hdGguc2luKCh0aW1lICogZHVyYXRpb24gLSBzMCkgKiBXRWFzZU1hbmFnZXIuX1R3b1BpIC8gcGVyaW9kKSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkVsYXN0aWNPdXQ6XHJcblx0XHRcdFx0dmFyIHMxOiBudW1iZXI7XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gMCkgcmV0dXJuIDA7XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uKSA9PSAxKSByZXR1cm4gMTtcclxuXHRcdFx0XHRpZiAocGVyaW9kID09IDApIHBlcmlvZCA9IGR1cmF0aW9uICogMC4zO1xyXG5cdFx0XHRcdGlmIChvdmVyc2hvb3RPckFtcGxpdHVkZSA8IDEpIHtcclxuXHRcdFx0XHRcdG92ZXJzaG9vdE9yQW1wbGl0dWRlID0gMTtcclxuXHRcdFx0XHRcdHMxID0gcGVyaW9kIC8gNDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBzMSA9IHBlcmlvZCAvIFdFYXNlTWFuYWdlci5fVHdvUGkgKiBNYXRoLmFzaW4oMSAvIG92ZXJzaG9vdE9yQW1wbGl0dWRlKTtcclxuXHRcdFx0XHRyZXR1cm4gKG92ZXJzaG9vdE9yQW1wbGl0dWRlICogTWF0aC5wb3coMiwgLTEwICogdGltZSkgKiBNYXRoLnNpbigodGltZSAqIGR1cmF0aW9uIC0gczEpICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkgKyAxKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuRWxhc3RpY0luT3V0OlxyXG5cdFx0XHRcdHZhciBzOiBudW1iZXI7XHJcblx0XHRcdFx0aWYgKHRpbWUgPT0gMCkgcmV0dXJuIDA7XHJcblx0XHRcdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uICogMC41KSA9PSAyKSByZXR1cm4gMTtcclxuXHRcdFx0XHRpZiAocGVyaW9kID09IDApIHBlcmlvZCA9IGR1cmF0aW9uICogKDAuMyAqIDEuNSk7XHJcblx0XHRcdFx0aWYgKG92ZXJzaG9vdE9yQW1wbGl0dWRlIDwgMSkge1xyXG5cdFx0XHRcdFx0b3ZlcnNob290T3JBbXBsaXR1ZGUgPSAxO1xyXG5cdFx0XHRcdFx0cyA9IHBlcmlvZCAvIDQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgcyA9IHBlcmlvZCAvIFdFYXNlTWFuYWdlci5fVHdvUGkgKiBNYXRoLmFzaW4oMSAvIG92ZXJzaG9vdE9yQW1wbGl0dWRlKTtcclxuXHRcdFx0XHRpZiAodGltZSA8IDEpIHJldHVybiAtMC41ICogKG92ZXJzaG9vdE9yQW1wbGl0dWRlICogTWF0aC5wb3coMiwgMTAgKiAodGltZSAtPSAxKSkgKiBNYXRoLnNpbigodGltZSAqIGR1cmF0aW9uIC0gcykgKiBXRWFzZU1hbmFnZXIuX1R3b1BpIC8gcGVyaW9kKSk7XHJcblx0XHRcdFx0cmV0dXJuIG92ZXJzaG9vdE9yQW1wbGl0dWRlICogTWF0aC5wb3coMiwgLTEwICogKHRpbWUgLT0gMSkpICogTWF0aC5zaW4oKHRpbWUgKiBkdXJhdGlvbiAtIHMpICogV0Vhc2VNYW5hZ2VyLl9Ud29QaSAvIHBlcmlvZCkgKiAwLjUgKyAxO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5CYWNrSW46XHJcblx0XHRcdFx0cmV0dXJuICh0aW1lIC89IGR1cmF0aW9uKSAqIHRpbWUgKiAoKG92ZXJzaG9vdE9yQW1wbGl0dWRlICsgMSkgKiB0aW1lIC0gb3ZlcnNob290T3JBbXBsaXR1ZGUpO1xyXG5cdFx0XHRjYXNlIFdFYXNlVHlwZS5CYWNrT3V0OlxyXG5cdFx0XHRcdHJldHVybiAoKHRpbWUgPSB0aW1lIC8gZHVyYXRpb24gLSAxKSAqIHRpbWUgKiAoKG92ZXJzaG9vdE9yQW1wbGl0dWRlICsgMSkgKiB0aW1lICsgb3ZlcnNob290T3JBbXBsaXR1ZGUpICsgMSk7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJhY2tJbk91dDpcclxuXHRcdFx0XHRpZiAoKHRpbWUgLz0gZHVyYXRpb24gKiAwLjUpIDwgMSkgcmV0dXJuIDAuNSAqICh0aW1lICogdGltZSAqICgoKG92ZXJzaG9vdE9yQW1wbGl0dWRlICo9ICgxLjUyNSkpICsgMSkgKiB0aW1lIC0gb3ZlcnNob290T3JBbXBsaXR1ZGUpKTtcclxuXHRcdFx0XHRyZXR1cm4gMC41ICogKCh0aW1lIC09IDIpICogdGltZSAqICgoKG92ZXJzaG9vdE9yQW1wbGl0dWRlICo9ICgxLjUyNSkpICsgMSkgKiB0aW1lICsgb3ZlcnNob290T3JBbXBsaXR1ZGUpICsgMik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJvdW5jZUluOlxyXG5cdFx0XHRcdHJldHVybiBCb3VuY2UuZWFzZUluKHRpbWUsIGR1cmF0aW9uKTtcclxuXHRcdFx0Y2FzZSBXRWFzZVR5cGUuQm91bmNlT3V0OlxyXG5cdFx0XHRcdHJldHVybiBCb3VuY2UuZWFzZU91dCh0aW1lLCBkdXJhdGlvbik7XHJcblx0XHRcdGNhc2UgV0Vhc2VUeXBlLkJvdW5jZUluT3V0OlxyXG5cdFx0XHRcdHJldHVybiBCb3VuY2UuZWFzZUluT3V0KHRpbWUsIGR1cmF0aW9uKTtcclxuXHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0cmV0dXJuIC0odGltZSAvPSBkdXJhdGlvbikgKiAodGltZSAtIDIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0fVxyXG59XHJcblxyXG4vLy8gVGhpcyBjbGFzcyBjb250YWlucyBhIEMjIHBvcnQgb2YgdGhlIGVhc2luZyBlcXVhdGlvbnMgY3JlYXRlZCBieSBSb2JlcnQgUGVubmVyIChodHRwOi8vcm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcpLlxyXG5leHBvcnQgY2xhc3MgQm91bmNlIHtcclxuXHRwdWJsaWMgc3RhdGljIGVhc2VJbih0aW1lOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIDEgLSBCb3VuY2UuZWFzZU91dChkdXJhdGlvbiAtIHRpbWUsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZWFzZU91dCh0aW1lOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0aWYgKCh0aW1lIC89IGR1cmF0aW9uKSA8ICgxIC8gMi43NSkpIHtcclxuXHRcdFx0cmV0dXJuICg3LjU2MjUgKiB0aW1lICogdGltZSk7XHJcblx0XHR9XHJcblx0XHRpZiAodGltZSA8ICgyIC8gMi43NSkpIHtcclxuXHRcdFx0cmV0dXJuICg3LjU2MjUgKiAodGltZSAtPSAoMS41IC8gMi43NSkpICogdGltZSArIDAuNzUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRpbWUgPCAoMi41IC8gMi43NSkpIHtcclxuXHRcdFx0cmV0dXJuICg3LjU2MjUgKiAodGltZSAtPSAoMi4yNSAvIDIuNzUpKSAqIHRpbWUgKyAwLjkzNzUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuICg3LjU2MjUgKiAodGltZSAtPSAoMi42MjUgLyAyLjc1KSkgKiB0aW1lICsgMC45ODQzNzUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBlYXNlSW5PdXQodGltZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdGlmICh0aW1lIDwgZHVyYXRpb24gKiAwLjUpIHtcclxuXHRcdFx0cmV0dXJuIEJvdW5jZS5lYXNlSW4odGltZSAqIDIsIGR1cmF0aW9uKSAqIDAuNTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBCb3VuY2UuZWFzZU91dCh0aW1lICogMiAtIGR1cmF0aW9uLCBkdXJhdGlvbikgKiAwLjUgKyAwLjU7XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIFdFYXNlVHlwZSB7XHJcblx0cHVibGljIHN0YXRpYyBMaW5lYXI6IG51bWJlciA9IDA7XHJcblx0cHVibGljIHN0YXRpYyBTaW5lSW46IG51bWJlciA9IDE7XHJcblx0cHVibGljIHN0YXRpYyBTaW5lT3V0OiBudW1iZXIgPSAyO1xyXG5cdHB1YmxpYyBzdGF0aWMgU2luZUluT3V0OiBudW1iZXIgPSAzO1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhZEluOiBudW1iZXIgPSA0O1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVhZE91dDogbnVtYmVyID0gNTtcclxuXHRwdWJsaWMgc3RhdGljIFF1YWRJbk91dDogbnVtYmVyID0gNjtcclxuXHRwdWJsaWMgc3RhdGljIEN1YmljSW46IG51bWJlciA9IDc7XHJcblx0cHVibGljIHN0YXRpYyBDdWJpY091dDogbnVtYmVyID0gODtcclxuXHRwdWJsaWMgc3RhdGljIEN1YmljSW5PdXQ6IG51bWJlciA9IDk7XHJcblx0cHVibGljIHN0YXRpYyBRdWFydEluOiBudW1iZXIgPSAxMDtcclxuXHRwdWJsaWMgc3RhdGljIFF1YXJ0T3V0OiBudW1iZXIgPSAxMTtcclxuXHRwdWJsaWMgc3RhdGljIFF1YXJ0SW5PdXQ6IG51bWJlciA9IDEyO1xyXG5cdHB1YmxpYyBzdGF0aWMgUXVpbnRJbjogbnVtYmVyID0gMTM7XHJcblx0cHVibGljIHN0YXRpYyBRdWludE91dDogbnVtYmVyID0gMTQ7XHJcblx0cHVibGljIHN0YXRpYyBRdWludEluT3V0OiBudW1iZXIgPSAxNTtcclxuXHRwdWJsaWMgc3RhdGljIEV4cG9JbjogbnVtYmVyID0gMTY7XHJcblx0cHVibGljIHN0YXRpYyBFeHBvT3V0OiBudW1iZXIgPSAxNztcclxuXHRwdWJsaWMgc3RhdGljIEV4cG9Jbk91dDogbnVtYmVyID0gMTg7XHJcblx0cHVibGljIHN0YXRpYyBDaXJjSW46IG51bWJlciA9IDE5O1xyXG5cdHB1YmxpYyBzdGF0aWMgQ2lyY091dDogbnVtYmVyID0gMjA7XHJcblx0cHVibGljIHN0YXRpYyBDaXJjSW5PdXQ6IG51bWJlciA9IDIxO1xyXG5cdHB1YmxpYyBzdGF0aWMgRWxhc3RpY0luOiBudW1iZXIgPSAyMjtcclxuXHRwdWJsaWMgc3RhdGljIEVsYXN0aWNPdXQ6IG51bWJlciA9IDIzO1xyXG5cdHB1YmxpYyBzdGF0aWMgRWxhc3RpY0luT3V0OiBudW1iZXIgPSAyNDtcclxuXHRwdWJsaWMgc3RhdGljIEJhY2tJbjogbnVtYmVyID0gMjU7XHJcblx0cHVibGljIHN0YXRpYyBCYWNrT3V0OiBudW1iZXIgPSAyNjtcclxuXHRwdWJsaWMgc3RhdGljIEJhY2tJbk91dDogbnVtYmVyID0gMjc7XHJcblx0cHVibGljIHN0YXRpYyBCb3VuY2VJbjogbnVtYmVyID0gMjg7XHJcblx0cHVibGljIHN0YXRpYyBCb3VuY2VPdXQ6IG51bWJlciA9IDI5O1xyXG5cdHB1YmxpYyBzdGF0aWMgQm91bmNlSW5PdXQ6IG51bWJlciA9IDMwO1xyXG5cdHB1YmxpYyBzdGF0aWMgQ3VzdG9tOiBudW1iZXIgPSAzMTtcclxufSIsImltcG9ydCB7IFdUd2VlbmVyIH0gZnJvbSBcIi4vV1R3ZWVuZXJcIjtcclxuaW1wb3J0IHsgV1R3ZWVuTWFuYWdlciB9IGZyb20gXCIuL1dUd2Vlbk1hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXVHdlZW4ge1xyXG5cdHB1YmxpYyBzdGF0aWMgY2F0Y2hDYWxsYmFja0V4Y2VwdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fdG8oc3RhcnQsIGVuZCwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyB0bzIoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90bzIoc3RhcnQsIHN0YXJ0MiwgZW5kLCBlbmQyLCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvMyhzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgc3RhcnQzOiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90bzMoc3RhcnQsIHN0YXJ0Miwgc3RhcnQzLCBlbmQsIGVuZDIsIGVuZDMsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgdG80KHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBzdGFydDM6IG51bWJlciwgc3RhcnQ0OiBudW1iZXIsXHJcblx0XHRlbmQ6IG51bWJlciwgZW5kMjogbnVtYmVyLCBlbmQzOiBudW1iZXIsIGVuZDQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuX3RvNChzdGFydCwgc3RhcnQyLCBzdGFydDMsIHN0YXJ0NCwgZW5kLCBlbmQyLCBlbmQzLCBlbmQ0LCBkdXJhdGlvbik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHRvQ29sb3Ioc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5jcmVhdGVUd2VlbigpLl90b0NvbG9yKHN0YXJ0LCBlbmQsIGR1cmF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZGVsYXllZENhbGwoZGVsYXk6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHJldHVybiBXVHdlZW5NYW5hZ2VyLmNyZWF0ZVR3ZWVuKCkuc2V0RGVsYXkoZGVsYXkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBzaGFrZShzdGFydFg6IG51bWJlciwgc3RhcnRZOiBudW1iZXIsIGFtcGxpdHVkZTogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0cmV0dXJuIFdUd2Vlbk1hbmFnZXIuY3JlYXRlVHdlZW4oKS5fc2hha2Uoc3RhcnRYLCBzdGFydFksIGFtcGxpdHVkZSwgZHVyYXRpb24pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBpc1R3ZWVuaW5nKHRhcmdldDogT2JqZWN0LCBwcm9wVHlwZTogT2JqZWN0KTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5pc1R3ZWVuaW5nKHRhcmdldCwgcHJvcFR5cGUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBraWxsKHRhcmdldDogT2JqZWN0LCBjb21wbGV0ZTogYm9vbGVhbiA9IGZhbHNlLCBwcm9wVHlwZTogT2JqZWN0ID0gbnVsbCk6IHZvaWQge1xyXG5cdFx0V1R3ZWVuTWFuYWdlci5raWxsVHdlZW5zKHRhcmdldCwgZmFsc2UsIG51bGwpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBnZXRUd2Vlbih0YXJnZXQ6IE9iamVjdCwgcHJvcFR5cGU6IE9iamVjdCA9IG51bGwpOiBXVHdlZW5lciB7XHJcblx0XHRyZXR1cm4gV1R3ZWVuTWFuYWdlci5nZXRUd2Vlbih0YXJnZXQsIHByb3BUeXBlKTtcclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdH1cclxufSIsImltcG9ydCB7IFdUd2VlbmVyIH0gZnJvbSBcIi4vV1R3ZWVuZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXVHdlZW5NYW5hZ2VyIHtcclxuXHRwcml2YXRlIHN0YXRpYyBfYWN0aXZlVHdlZW5zOiBhbnlbXSA9IG5ldyBBcnJheSgzMCk7XHJcblx0cHJpdmF0ZSBzdGF0aWMgX3R3ZWVuZXJQb29sOiBXVHdlZW5lcltdID0gW107XHJcblx0cHJpdmF0ZSBzdGF0aWMgX3RvdGFsQWN0aXZlVHdlZW5zOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgc3RhdGljIF9pbml0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHVibGljIHN0YXRpYyBjcmVhdGVUd2VlbigpOiBXVHdlZW5lciB7XHJcblx0XHRpZiAoIVdUd2Vlbk1hbmFnZXIuX2luaXRlZCkge1xyXG5cdFx0XHRMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLCBudWxsLCB0aGlzLnVwZGF0ZSk7XHJcblx0XHRcdFdUd2Vlbk1hbmFnZXIuX2luaXRlZCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHR3ZWVuZXI6IFdUd2VlbmVyO1xyXG5cdFx0dmFyIGNudDogbnVtYmVyID0gV1R3ZWVuTWFuYWdlci5fdHdlZW5lclBvb2wubGVuZ3RoO1xyXG5cdFx0aWYgKGNudCA+IDApIHtcclxuXHRcdFx0dHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX3R3ZWVuZXJQb29sLnBvcCgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0d2VlbmVyID0gbmV3IFdUd2VlbmVyKCk7XHJcblx0XHR0d2VlbmVyLl9pbml0KCk7XHJcblx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnNbV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMrK10gPSB0d2VlbmVyO1xyXG5cclxuXHRcdGlmIChXVHdlZW5NYW5hZ2VyLl90b3RhbEFjdGl2ZVR3ZWVucyA9PSBXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnMubGVuZ3RoKVxyXG5cdFx0XHRXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnMubGVuZ3RoID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zLmxlbmd0aCArIE1hdGguY2VpbChXVHdlZW5NYW5hZ2VyLl9hY3RpdmVUd2VlbnMubGVuZ3RoICogMC41KTtcclxuXHJcblx0XHRyZXR1cm4gdHdlZW5lcjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgaXNUd2VlbmluZyh0YXJnZXQ6IGFueSwgcHJvcFR5cGU6IGFueSk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0dmFyIGFueVR5cGU6IGJvb2xlYW4gPSBwcm9wVHlwZSA9PSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zOyBpKyspIHtcclxuXHRcdFx0dmFyIHR3ZWVuZXI6IFdUd2VlbmVyID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldO1xyXG5cdFx0XHRpZiAodHdlZW5lciAhPSBudWxsICYmIHR3ZWVuZXIudGFyZ2V0ID09IHRhcmdldCAmJiAhdHdlZW5lci5fa2lsbGVkXHJcblx0XHRcdFx0JiYgKGFueVR5cGUgfHwgdHdlZW5lci5fcHJvcFR5cGUgPT0gcHJvcFR5cGUpKVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMga2lsbFR3ZWVucyh0YXJnZXQ6IGFueSwgY29tcGxldGVkOiBib29sZWFuPWZhbHNlLCBwcm9wVHlwZTogYW55ID1udWxsKTogYm9vbGVhbiB7XHJcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHR2YXIgZmxhZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0dmFyIGNudDogbnVtYmVyID0gV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnM7XHJcblx0XHR2YXIgYW55VHlwZTogYm9vbGVhbiA9IHByb3BUeXBlID09IG51bGw7XHJcblx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgY250OyBpKyspIHtcclxuXHRcdFx0dmFyIHR3ZWVuZXI6IFdUd2VlbmVyID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldO1xyXG5cdFx0XHRpZiAodHdlZW5lciAhPSBudWxsICYmIHR3ZWVuZXIudGFyZ2V0ID09IHRhcmdldCAmJiAhdHdlZW5lci5fa2lsbGVkXHJcblx0XHRcdFx0JiYgKGFueVR5cGUgfHwgdHdlZW5lci5fcHJvcFR5cGUgPT0gcHJvcFR5cGUpKSB7XHJcblx0XHRcdFx0dHdlZW5lci5raWxsKGNvbXBsZXRlZCk7XHJcblx0XHRcdFx0ZmxhZyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmxhZztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0VHdlZW4odGFyZ2V0OiBhbnksIHByb3BUeXBlOiBhbnkpOiBXVHdlZW5lciB7XHJcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpXHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zO1xyXG5cdFx0dmFyIGFueVR5cGU6IGJvb2xlYW4gPSBwcm9wVHlwZSA9PSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciB0d2VlbmVyOiBXVHdlZW5lciA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXTtcclxuXHRcdFx0aWYgKHR3ZWVuZXIgIT0gbnVsbCAmJiB0d2VlbmVyLnRhcmdldCA9PSB0YXJnZXQgJiYgIXR3ZWVuZXIuX2tpbGxlZFxyXG5cdFx0XHRcdCYmIChhbnlUeXBlIHx8IHR3ZWVuZXIuX3Byb3BUeXBlID09IHByb3BUeXBlKSkge1xyXG5cdFx0XHRcdHJldHVybiB0d2VlbmVyO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuXHRcdHZhciBkdDogbnVtYmVyID0gTGF5YS50aW1lci5kZWx0YSAvIDEwMDA7XHJcblxyXG5cdFx0dmFyIGNudDogbnVtYmVyID0gV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnM7XHJcblx0XHR2YXIgZnJlZVBvc1N0YXJ0OiBudW1iZXIgPSAtMTtcclxuXHRcdHZhciBmcmVlUG9zQ291bnQ6IG51bWJlciA9IDA7XHJcblx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgY250OyBpKyspIHtcclxuXHRcdFx0dmFyIHR3ZWVuZXI6IFdUd2VlbmVyID0gV1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldO1xyXG5cdFx0XHRpZiAodHdlZW5lciA9PSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKGZyZWVQb3NTdGFydCA9PSAtMSlcclxuXHRcdFx0XHRcdGZyZWVQb3NTdGFydCA9IGk7XHJcblx0XHRcdFx0ZnJlZVBvc0NvdW50Kys7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAodHdlZW5lci5fa2lsbGVkKSB7XHJcblx0XHRcdFx0dHdlZW5lci5fcmVzZXQoKTtcclxuXHRcdFx0XHRXVHdlZW5NYW5hZ2VyLl90d2VlbmVyUG9vbC5wdXNoKHR3ZWVuZXIpO1xyXG5cdFx0XHRcdFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tpXSA9IG51bGw7XHJcblxyXG5cdFx0XHRcdGlmIChmcmVlUG9zU3RhcnQgPT0gLTEpXHJcblx0XHRcdFx0XHRmcmVlUG9zU3RhcnQgPSBpO1xyXG5cdFx0XHRcdGZyZWVQb3NDb3VudCsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGlmICghdHdlZW5lci5fcGF1c2VkKVxyXG5cdFx0XHRcdFx0dHdlZW5lci5fdXBkYXRlKGR0KTtcclxuXHJcblx0XHRcdFx0aWYgKGZyZWVQb3NTdGFydCAhPSAtMSkge1xyXG5cdFx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ZyZWVQb3NTdGFydF0gPSB0d2VlbmVyO1xyXG5cdFx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ldID0gbnVsbDtcclxuXHRcdFx0XHRcdGZyZWVQb3NTdGFydCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChmcmVlUG9zU3RhcnQgPj0gMCkge1xyXG5cdFx0XHRpZiAoV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMgIT0gY250KSAvL25ldyB0d2VlbnMgYWRkZWRcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBqOiBudW1iZXIgPSBjbnQ7XHJcblx0XHRcdFx0Y250ID0gV1R3ZWVuTWFuYWdlci5fdG90YWxBY3RpdmVUd2VlbnMgLSBjbnQ7XHJcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNudDsgaSsrKVxyXG5cdFx0XHRcdFx0V1R3ZWVuTWFuYWdlci5fYWN0aXZlVHdlZW5zW2ZyZWVQb3NTdGFydCsrXSA9IFdUd2Vlbk1hbmFnZXIuX2FjdGl2ZVR3ZWVuc1tqKytdO1xyXG5cdFx0XHR9XHJcblx0XHRcdFdUd2Vlbk1hbmFnZXIuX3RvdGFsQWN0aXZlVHdlZW5zID0gZnJlZVBvc1N0YXJ0O1xyXG5cdFx0fVxyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBXVHdlZW5WYWx1ZSB7XHJcblx0cHVibGljIHg6IG51bWJlcjtcclxuXHRwdWJsaWMgeTogbnVtYmVyO1xyXG5cdHB1YmxpYyB6OiBudW1iZXI7XHJcblx0cHVibGljIHc6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSB0aGlzLncgPSAwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBjb2xvcigpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuICh0aGlzLncgPDwgMjQpICsgKHRoaXMueCA8PCAxNikgKyAodGhpcy55IDw8IDgpICsgdGhpcy56O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBjb2xvcih2YWx1ZTogbnVtYmVyKSB7XHJcblx0XHR0aGlzLnggPSAodmFsdWUgJiAweEZGMDAwMCkgPj4gMTY7XHJcblx0XHR0aGlzLnkgPSAodmFsdWUgJiAweDAwRkYwMCkgPj4gODtcclxuXHRcdHRoaXMueiA9ICh2YWx1ZSAmIDB4MDAwMEZGKTtcclxuXHRcdHRoaXMudyA9ICh2YWx1ZSAmIDB4RkYwMDAwMDApID4+IDI0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEZpZWxkKGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0c3dpdGNoIChpbmRleCkge1xyXG5cdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMueDtcclxuXHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLnk7XHJcblx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy56O1xyXG5cdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMudztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbmRleCBvdXQgb2YgYm91bmRzOiBcIiArIGluZGV4KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRGaWVsZChpbmRleDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRzd2l0Y2ggKGluZGV4KSB7XHJcblx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHR0aGlzLnggPSB2YWx1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdHRoaXMueSA9IHZhbHVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0dGhpcy56ID0gdmFsdWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHR0aGlzLncgPSB2YWx1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbmRleCBvdXQgb2YgYm91bmRzOiBcIiArIGluZGV4KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRaZXJvKCk6IHZvaWQge1xyXG5cdFx0dGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gdGhpcy53ID0gMDtcclxuXHR9XHJcbn0iLCJpbXBvcnQgeyBXVHdlZW5WYWx1ZSB9IGZyb20gXCIuL1dUd2VlblZhbHVlXCI7XHJcbmltcG9ydCB7IFdFYXNlVHlwZSB9IGZyb20gXCIuL1dFYXNlVHlwZVwiO1xyXG5pbXBvcnQgeyBXVHdlZW4gfSBmcm9tIFwiLi9XVHdlZW5cIjtcclxuaW1wb3J0IHsgV0Vhc2VNYW5hZ2VyIH0gZnJvbSBcIi4vV0Vhc2VNYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV1R3ZWVuZXIge1xyXG5cdHB1YmxpYyBfdGFyZ2V0OiBhbnk7XHJcblx0cHVibGljIF9wcm9wVHlwZTogYW55O1xyXG5cdHB1YmxpYyBfa2lsbGVkOiBib29sZWFuO1xyXG5cdHB1YmxpYyBfcGF1c2VkOiBib29sZWFuO1xyXG5cclxuXHRwcml2YXRlIF9kZWxheTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2R1cmF0aW9uOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfYnJlYWtwb2ludDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2Vhc2VUeXBlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWFzZVBlcmlvZDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3JlcGVhdDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3lveW86IGJvb2xlYW47XHJcblx0cHJpdmF0ZSBfdGltZVNjYWxlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfc25hcHBpbmc6IGJvb2xlYW47XHJcblx0cHJpdmF0ZSBfdXNlckRhdGE6IGFueTtcclxuXHJcblx0cHJpdmF0ZSBfb25VcGRhdGU6IEZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgX29uVXBkYXRlQ2FsbGVyOiBhbnk7XHJcblx0cHJpdmF0ZSBfb25TdGFydDogRnVuY3Rpb247XHJcblx0cHJpdmF0ZSBfb25TdGFydENhbGxlcjogYW55O1xyXG5cdHByaXZhdGUgX29uQ29tcGxldGU6IEZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgX29uQ29tcGxldGVDYWxsZXI6IGFueTtcclxuXHJcblx0cHJpdmF0ZSBfc3RhcnRWYWx1ZTogV1R3ZWVuVmFsdWU7XHJcblx0cHJpdmF0ZSBfZW5kVmFsdWU6IFdUd2VlblZhbHVlO1xyXG5cdHByaXZhdGUgX3ZhbHVlOiBXVHdlZW5WYWx1ZTtcclxuXHRwcml2YXRlIF9kZWx0YVZhbHVlOiBXVHdlZW5WYWx1ZTtcclxuXHRwcml2YXRlIF92YWx1ZVNpemU6IG51bWJlcjtcclxuXHJcblx0cHJpdmF0ZSBfc3RhcnRlZDogYm9vbGVhbjtcclxuXHRwdWJsaWMgX2VuZGVkOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWxhcHNlZFRpbWU6IG51bWJlcjtcclxuXHRwcml2YXRlIF9ub3JtYWxpemVkVGltZTogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUgPSBuZXcgV1R3ZWVuVmFsdWUoKTtcclxuXHRcdHRoaXMuX2VuZFZhbHVlID0gbmV3IFdUd2VlblZhbHVlKCk7XHJcblx0XHR0aGlzLl92YWx1ZSA9IG5ldyBXVHdlZW5WYWx1ZSgpO1xyXG5cdFx0dGhpcy5fZGVsdGFWYWx1ZSA9IG5ldyBXVHdlZW5WYWx1ZSgpO1xyXG5cclxuXHRcdHRoaXMuX3Jlc2V0KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RGVsYXkodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2RlbGF5ID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZGVsYXkoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9kZWxheTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXREdXJhdGlvbih2YWx1ZTogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBkdXJhdGlvbigpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEJyZWFrcG9pbnQodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2JyZWFrcG9pbnQgPSB2YWx1ZTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEVhc2UodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2Vhc2VUeXBlID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRFYXNlUGVyaW9kKHZhbHVlOiBudW1iZXIpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9lYXNlUGVyaW9kID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRFYXNlT3ZlcnNob290T3JBbXBsaXR1ZGUodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX2Vhc2VPdmVyc2hvb3RPckFtcGxpdHVkZSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0UmVwZWF0KHJlcGVhdDogbnVtYmVyLCB5b3lvOiBib29sZWFuID0gZmFsc2UpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9yZXBlYXQgPSB0aGlzLnJlcGVhdDtcclxuXHRcdHRoaXMuX3lveW8gPSB5b3lvO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHJlcGVhdCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3JlcGVhdDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRUaW1lU2NhbGUodmFsdWU6IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3RpbWVTY2FsZSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0U25hcHBpbmcodmFsdWU6IGJvb2xlYW4pOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl9zbmFwcGluZyA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0VGFyZ2V0KHZhbHVlOiBhbnksIHByb3BUeXBlOiBhbnkgPSBudWxsKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdGFyZ2V0ID0gdGhpcy52YWx1ZTtcclxuXHRcdHRoaXMuX3Byb3BUeXBlID0gcHJvcFR5cGU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdGFyZ2V0KCk6IGFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdGFyZ2V0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFVzZXJEYXRhKHZhbHVlOiBhbnkpOiBXVHdlZW5lciB7XHJcblx0XHR0aGlzLl91c2VyRGF0YSA9IHRoaXMudmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdXNlckRhdGEoKTogYW55IHtcclxuXHRcdHJldHVybiB0aGlzLl91c2VyRGF0YTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBvblVwZGF0ZShjYWxsYmFjazogRnVuY3Rpb24sIGNhbGxlcjogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fb25VcGRhdGUgPSBjYWxsYmFjaztcclxuXHRcdHRoaXMuX29uVXBkYXRlQ2FsbGVyID0gY2FsbGVyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgb25TdGFydChjYWxsYmFjazogRnVuY3Rpb24sIGNhbGxlcjogYW55KTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fb25TdGFydCA9IGNhbGxiYWNrO1xyXG5cdFx0dGhpcy5fb25TdGFydENhbGxlciA9IGNhbGxlcjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uQ29tcGxldGUoY2FsbGJhY2s6IEZ1bmN0aW9uLCBjYWxsZXI6IGFueSk6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX29uQ29tcGxldGUgPSBjYWxsYmFjaztcclxuXHRcdHRoaXMuX29uQ29tcGxldGVDYWxsZXIgPSBjYWxsZXI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgc3RhcnRWYWx1ZSgpOiBXVHdlZW5WYWx1ZSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc3RhcnRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZW5kVmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VuZFZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB2YWx1ZSgpOiBXVHdlZW5WYWx1ZSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGRlbHRhVmFsdWUoKTogV1R3ZWVuVmFsdWUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RlbHRhVmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IG5vcm1hbGl6ZWRUaW1lKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbm9ybWFsaXplZFRpbWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGNvbXBsZXRlZCgpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbmRlZCAhPSAwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBhbGxDb21wbGV0ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZW5kZWQgPT0gMTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRQYXVzZWQocGF1c2VkOiBib29sZWFuKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fcGF1c2VkID0gcGF1c2VkO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICogdGhpcy5zZWVrIHBvc2l0aW9uIG9mIHRoZSB0d2VlbiwgaW4gc2Vjb25kcy5cclxuXHQgICovXHJcblx0cHVibGljIHNlZWsodGltZTogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fa2lsbGVkKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aW1lO1xyXG5cdFx0aWYgKHRoaXMuX2VsYXBzZWRUaW1lIDwgdGhpcy5fZGVsYXkpIHtcclxuXHRcdFx0aWYgKHRoaXMuX3N0YXJ0ZWQpXHJcblx0XHRcdFx0dGhpcy5fZWxhcHNlZFRpbWUgPSB0aGlzLl9kZWxheTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGtpbGwoY29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2tpbGxlZClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdGlmIChjb21wbGV0ZSkge1xyXG5cdFx0XHRpZiAodGhpcy5fZW5kZWQgPT0gMCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLl9icmVha3BvaW50ID49IDApXHJcblx0XHRcdFx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IHRoaXMuX2RlbGF5ICsgdGhpcy5fYnJlYWtwb2ludDtcclxuXHRcdFx0XHRlbHNlIGlmICh0aGlzLl9yZXBlYXQgPj0gMClcclxuXHRcdFx0XHRcdHRoaXMuX2VsYXBzZWRUaW1lID0gdGhpcy5fZGVsYXkgKyB0aGlzLl9kdXJhdGlvbiAqICh0aGlzLl9yZXBlYXQgKyAxKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IHRoaXMuX2RlbGF5ICsgdGhpcy5fZHVyYXRpb24gKiAyO1xyXG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuY2FsbENvbXBsZXRlQ2FsbGJhY2soKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9raWxsZWQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF90byhzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDE7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnggPSBlbmQ7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3RvMihzdGFydDogbnVtYmVyLCBzdGFydDI6IG51bWJlciwgZW5kOiBudW1iZXIsIGVuZDI6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDI7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnggPSBlbmQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnkgPSBzdGFydDI7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS55ID0gZW5kMjtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG8zKHN0YXJ0OiBudW1iZXIsIHN0YXJ0MjogbnVtYmVyLCBzdGFydDM6IG51bWJlcixcclxuXHRcdGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGVuZDM6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDM7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydDtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnggPSBlbmQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnkgPSBzdGFydDI7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS55ID0gZW5kMjtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueiA9IHN0YXJ0MztcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnogPSBlbmQzO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIF90bzQoc3RhcnQ6IG51bWJlciwgc3RhcnQyOiBudW1iZXIsIHN0YXJ0MzogbnVtYmVyLCBzdGFydDQ6IG51bWJlcixcclxuXHRcdGVuZDogbnVtYmVyLCBlbmQyOiBudW1iZXIsIGVuZDM6IG51bWJlciwgZW5kNDogbnVtYmVyLCBkdXJhdGlvbjogbnVtYmVyKTogV1R3ZWVuZXIge1xyXG5cdFx0dGhpcy5fdmFsdWVTaXplID0gNDtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueCA9IHN0YXJ0O1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueCA9IGVuZDtcclxuXHRcdHRoaXMuX3N0YXJ0VmFsdWUueSA9IHN0YXJ0MjtcclxuXHRcdHRoaXMuX2VuZFZhbHVlLnkgPSBlbmQyO1xyXG5cdFx0dGhpcy5fc3RhcnRWYWx1ZS56ID0gc3RhcnQzO1xyXG5cdFx0dGhpcy5fZW5kVmFsdWUueiA9IGVuZDM7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLncgPSBzdGFydDQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS53ID0gZW5kNDtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfdG9Db2xvcihzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDQ7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLmNvbG9yID0gc3RhcnQ7XHJcblx0XHR0aGlzLl9lbmRWYWx1ZS5jb2xvciA9IGVuZDtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gZHVyYXRpb247XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBfc2hha2Uoc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBhbXBsaXR1ZGU6IG51bWJlciwgZHVyYXRpb246IG51bWJlcik6IFdUd2VlbmVyIHtcclxuXHRcdHRoaXMuX3ZhbHVlU2l6ZSA9IDU7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnggPSBzdGFydFg7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLnkgPSBzdGFydFk7XHJcblx0XHR0aGlzLl9zdGFydFZhbHVlLncgPSBhbXBsaXR1ZGU7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG5cdFx0dGhpcy5fZWFzZVR5cGUgPSBXRWFzZVR5cGUuTGluZWFyO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX2luaXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9kZWxheSA9IDA7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IDA7XHJcblx0XHR0aGlzLl9icmVha3BvaW50ID0gLTE7XHJcblx0XHR0aGlzLl9lYXNlVHlwZSA9IFdFYXNlVHlwZS5RdWFkT3V0O1xyXG5cdFx0dGhpcy5fdGltZVNjYWxlID0gMTtcclxuXHRcdHRoaXMuX2Vhc2VQZXJpb2QgPSAwO1xyXG5cdFx0dGhpcy5fZWFzZU92ZXJzaG9vdE9yQW1wbGl0dWRlID0gMS43MDE1ODtcclxuXHRcdHRoaXMuX3NuYXBwaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLl9yZXBlYXQgPSAwO1xyXG5cdFx0dGhpcy5feW95byA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fdmFsdWVTaXplID0gMDtcclxuXHRcdHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fa2lsbGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLl9lbGFwc2VkVGltZSA9IDA7XHJcblx0XHR0aGlzLl9ub3JtYWxpemVkVGltZSA9IDA7XHJcblx0XHR0aGlzLl9lbmRlZCA9IDA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3Jlc2V0KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fdGFyZ2V0ID0gbnVsbDtcclxuXHRcdHRoaXMuX3VzZXJEYXRhID0gbnVsbDtcclxuXHRcdHRoaXMuX29uU3RhcnQgPSB0aGlzLl9vblVwZGF0ZSA9IHRoaXMuX29uQ29tcGxldGUgPSBudWxsO1xyXG5cdFx0dGhpcy5fb25TdGFydENhbGxlciA9IHRoaXMuX29uVXBkYXRlQ2FsbGVyID0gdGhpcy5fb25Db21wbGV0ZUNhbGxlciA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgX3VwZGF0ZShkdDogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fdGltZVNjYWxlICE9IDEpXHJcblx0XHRcdGR0ICo9IHRoaXMuX3RpbWVTY2FsZTtcclxuXHRcdGlmIChkdCA9PSAwKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0aWYgKHRoaXMuX2VuZGVkICE9IDApIC8vTWF5YmUgdGhpcy5jb21wbGV0ZWQgYnkgdGhpcy5zZWVrXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuY2FsbENvbXBsZXRlQ2FsbGJhY2soKTtcclxuXHRcdFx0dGhpcy5fa2lsbGVkID0gdHJ1ZTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2VsYXBzZWRUaW1lICs9IGR0O1xyXG5cdFx0dGhpcy51cGRhdGUoKTtcclxuXHJcblx0XHRpZiAodGhpcy5fZW5kZWQgIT0gMCkge1xyXG5cdFx0XHRpZiAoIXRoaXMuX2tpbGxlZCkge1xyXG5cdFx0XHRcdHRoaXMuY2FsbENvbXBsZXRlQ2FsbGJhY2soKTtcclxuXHRcdFx0XHR0aGlzLl9raWxsZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlKGR0PzogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZihkdCE9bnVsbCl7XHJcblx0XHRcdGlmICh0aGlzLl90aW1lU2NhbGUgIT0gMSlcclxuXHRcdFx0XHRkdCAqPSB0aGlzLl90aW1lU2NhbGU7XHJcblx0XHRcdGlmIChkdCA9PSAwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdHRoaXMuX2VsYXBzZWRUaW1lICs9IGR0O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2VuZGVkID0gMDtcclxuXHRcdHZhciBfZHVyYXRpb249dGhpcy5fZHVyYXRpb247XHJcblx0XHRpZiAodGhpcy5fdmFsdWVTaXplID09IDApIC8vRGVsYXllZENhbGxcclxuXHRcdHtcclxuXHRcdFx0aWYgKHRoaXMuX2VsYXBzZWRUaW1lID49IHRoaXMuX2RlbGF5ICsgX2R1cmF0aW9uKVxyXG5cdFx0XHRcdHRoaXMuX2VuZGVkID0gMTtcclxuXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuX3N0YXJ0ZWQpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2VsYXBzZWRUaW1lIDwgdGhpcy5fZGVsYXkpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0dGhpcy5fc3RhcnRlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuY2FsbFN0YXJ0Q2FsbGJhY2soKTtcclxuXHRcdFx0aWYgKHRoaXMuX2tpbGxlZClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHJldmVyc2VkOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHR2YXIgdHQ6IG51bWJlciA9IHRoaXMuX2VsYXBzZWRUaW1lIC0gdGhpcy5fZGVsYXk7XHJcblx0XHRpZiAodGhpcy5fYnJlYWtwb2ludCA+PSAwICYmIHR0ID49IHRoaXMuX2JyZWFrcG9pbnQpIHtcclxuXHRcdFx0dHQgPSB0aGlzLl9icmVha3BvaW50O1xyXG5cdFx0XHR0aGlzLl9lbmRlZCA9IDI7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3JlcGVhdCAhPSAwKSB7XHJcblx0XHRcdHZhciByb3VuZDogbnVtYmVyID0gTWF0aC5mbG9vcih0dCAvIF9kdXJhdGlvbik7XHJcblx0XHRcdHR0IC09IF9kdXJhdGlvbiAqIHJvdW5kO1xyXG5cdFx0XHRpZiAodGhpcy5feW95bylcclxuXHRcdFx0XHRyZXZlcnNlZCA9IHJvdW5kICUgMiA9PSAxO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3JlcGVhdCA+IDAgJiYgdGhpcy5fcmVwZWF0IC0gcm91bmQgPCAwKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3lveW8pXHJcblx0XHRcdFx0XHRyZXZlcnNlZCA9IHRoaXMuX3JlcGVhdCAlIDIgPT0gMTtcclxuXHRcdFx0XHR0dCA9IF9kdXJhdGlvbjtcclxuXHRcdFx0XHR0aGlzLl9lbmRlZCA9IDE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHR0ID49IF9kdXJhdGlvbikge1xyXG5cdFx0XHR0dCA9IF9kdXJhdGlvbjtcclxuXHRcdFx0dGhpcy5fZW5kZWQgPSAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX25vcm1hbGl6ZWRUaW1lID0gV0Vhc2VNYW5hZ2VyLmV2YWx1YXRlKHRoaXMuX2Vhc2VUeXBlLCByZXZlcnNlZCA/IChfZHVyYXRpb24gLSB0dCkgOiB0dCwgX2R1cmF0aW9uLFxyXG5cdFx0XHR0aGlzLl9lYXNlT3ZlcnNob290T3JBbXBsaXR1ZGUsIHRoaXMuX2Vhc2VQZXJpb2QpO1xyXG5cclxuXHRcdHRoaXMuX3ZhbHVlLnNldFplcm8oKTtcclxuXHRcdHRoaXMuX2RlbHRhVmFsdWUuc2V0WmVybygpO1xyXG5cclxuXHRcdGlmICh0aGlzLl92YWx1ZVNpemUgPT0gNSkge1xyXG5cdFx0XHRpZiAodGhpcy5fZW5kZWQgPT0gMCkge1xyXG5cdFx0XHRcdHZhciByOiBudW1iZXIgPSB0aGlzLl9zdGFydFZhbHVlLncgKiAoMSAtIHRoaXMuX25vcm1hbGl6ZWRUaW1lKTtcclxuXHRcdFx0XHR2YXIgcng6IG51bWJlciA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogcjtcclxuXHRcdFx0XHR2YXIgcnk6IG51bWJlciA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogcjtcclxuXHRcdFx0XHRyeCA9IHJ4ID4gMCA/IE1hdGguY2VpbChyeCkgOiBNYXRoLmZsb29yKHJ4KTtcclxuXHRcdFx0XHRyeSA9IHJ5ID4gMCA/IE1hdGguY2VpbChyeSkgOiBNYXRoLmZsb29yKHJ5KTtcclxuXHJcblx0XHRcdFx0dGhpcy5fZGVsdGFWYWx1ZS54ID0gcng7XHJcblx0XHRcdFx0dGhpcy5fZGVsdGFWYWx1ZS55ID0gcnk7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUueCA9IHRoaXMuX3N0YXJ0VmFsdWUueCArIHJ4O1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnkgPSB0aGlzLl9zdGFydFZhbHVlLnkgKyByeTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLl92YWx1ZS54ID0gdGhpcy5fc3RhcnRWYWx1ZS54O1xyXG5cdFx0XHRcdHRoaXMuX3ZhbHVlLnkgPSB0aGlzLl9zdGFydFZhbHVlLnk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5fdmFsdWVTaXplOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgbjE6IG51bWJlciA9IHRoaXMuX3N0YXJ0VmFsdWUuZ2V0RmllbGQoaSk7XHJcblx0XHRcdFx0dmFyIG4yOiBudW1iZXIgPSB0aGlzLl9lbmRWYWx1ZS5nZXRGaWVsZChpKTtcclxuXHRcdFx0XHR2YXIgZjogbnVtYmVyID0gbjEgKyAobjIgLSBuMSkgKiB0aGlzLl9ub3JtYWxpemVkVGltZTtcclxuXHRcdFx0XHRpZiAodGhpcy5fc25hcHBpbmcpXHJcblx0XHRcdFx0XHRmID0gTWF0aC5yb3VuZChmKTtcclxuXHRcdFx0XHR0aGlzLl9kZWx0YVZhbHVlLnNldEZpZWxkKGksIGYgLSB0aGlzLl92YWx1ZS5nZXRGaWVsZChpKSk7XHJcblx0XHRcdFx0dGhpcy5fdmFsdWUuc2V0RmllbGQoaSwgZik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fdGFyZ2V0ICE9IG51bGwgJiYgdGhpcy5fcHJvcFR5cGUgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAodGhpcy5fcHJvcFR5cGUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xyXG5cdFx0XHRcdHN3aXRjaCAodGhpcy5fdmFsdWVTaXplKSB7XHJcblx0XHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDQ6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55LCB0aGlzLl92YWx1ZS56LCB0aGlzLl92YWx1ZS53KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDU6XHJcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BUeXBlLmNhbGwodGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS5jb2xvcik7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA2OlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wVHlwZS5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fdmFsdWUueCwgdGhpcy5fdmFsdWUueSk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICh0aGlzLl9wcm9wVHlwZSBpbnN0YW5jZW9mIExheWEuSGFuZGxlcikge1xyXG5cdFx0XHRcdHZhciBhcnI9W107XHJcblx0XHRcdFx0c3dpdGNoICh0aGlzLl92YWx1ZVNpemUpIHtcclxuXHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLnhdO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnldO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnksIHRoaXMuX3ZhbHVlLnpdO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNDpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLngsIHRoaXMuX3ZhbHVlLnksIHRoaXMuX3ZhbHVlLnosIHRoaXMuX3ZhbHVlLnddO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNTpcclxuXHRcdFx0XHRcdFx0YXJyPVt0aGlzLl90YXJnZXQsIHRoaXMuX3ZhbHVlLmNvbG9yXTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDY6XHJcblx0XHRcdFx0XHRcdGFycj1bdGhpcy5fdGFyZ2V0LCB0aGlzLl92YWx1ZS54LCB0aGlzLl92YWx1ZS55XTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuX3Byb3BUeXBlLnJ1bldpdGgoYXJyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fdmFsdWVTaXplID09IDUpXHJcblx0XHRcdFx0XHR0aGlzLl90YXJnZXRbdGhpcy5fcHJvcFR5cGVdID0gdGhpcy5fdmFsdWUuY29sb3I7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dGhpcy5fdGFyZ2V0W3RoaXMuX3Byb3BUeXBlXSA9IHRoaXMuX3ZhbHVlLng7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmNhbGxVcGRhdGVDYWxsYmFjaygpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjYWxsU3RhcnRDYWxsYmFjaygpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9vblN0YXJ0ICE9IG51bGwpIHtcclxuXHRcdFx0aWYgKFdUd2Vlbi5jYXRjaENhbGxiYWNrRXhjZXB0aW9ucykge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR0aGlzLl9vblN0YXJ0LmNhbGwodGhpcy5fb25TdGFydENhbGxlciwgdGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRmFpcnlHVUk6IGVycm9yIGluIHN0YXJ0IGNhbGxiYWNrID4gXCIgKyBlcnIubWVzc2FnZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLl9vblN0YXJ0LmNhbGwodGhpcy5fb25TdGFydENhbGxlciwgdGhpcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNhbGxVcGRhdGVDYWxsYmFjaygpIHtcclxuXHRcdGlmICh0aGlzLl9vblVwZGF0ZSAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChXVHdlZW4uY2F0Y2hDYWxsYmFja0V4Y2VwdGlvbnMpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dGhpcy5fb25VcGRhdGUuY2FsbCh0aGlzLl9vblVwZGF0ZUNhbGxlciwgdGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRmFpcnlHVUk6IGVycm9yIGluIHRoaXMudXBkYXRlIGNhbGxiYWNrID4gXCIgKyBlcnIubWVzc2FnZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLl9vblVwZGF0ZS5jYWxsKHRoaXMuX29uVXBkYXRlQ2FsbGVyLCB0aGlzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY2FsbENvbXBsZXRlQ2FsbGJhY2soKSB7XHJcblx0XHRpZiAodGhpcy5fb25Db21wbGV0ZSAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChXVHdlZW4uY2F0Y2hDYWxsYmFja0V4Y2VwdGlvbnMpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dGhpcy5fb25Db21wbGV0ZS5jYWxsKHRoaXMuX29uQ29tcGxldGVDYWxsZXIsIHRoaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkZhaXJ5R1VJOiBlcnJvciBpbiBjb21wbGV0ZSBjYWxsYmFjayA+IFwiICsgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGhpcy5fb25Db21wbGV0ZS5jYWxsKHRoaXMuX29uQ29tcGxldGVDYWxsZXIsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215TWF0Q29uZmlnIHtcblxuICAgIHB1YmxpYyBzdGF0aWMgbWF0Q29uZmlnPVtcbntcblwiY19tYXROYW1lXCI6XCJkYW9fMVwiLFwiaW5pdERhdGFcIjp7XG5cInNoYWRlck5hbWVcIjpcIldteUxheWFfd215TGJ0XCIsXCJfQWxiZWRvSW50ZW5zaXR5XCI6XCIxXCIsXCJfQWxwaGFCbGVuZFwiOlwiMFwiLFwiX0FscGhhVGVzdFwiOlwiMFwiLFwiX0N1bGxcIjpcIjJcIixcIl9DdXRvZmZcIjpcIjAuMDFcIixcIl9Ec3RCbGVuZFwiOlwiMFwiLFwiX0dsb3NzXCI6XCIzMFwiLFwiX0lzVmVydGV4Q29sb3JcIjpcIjBcIixcIl9MaWdodGluZ1wiOlwiMFwiLFwiX01vZGVcIjpcIjBcIixcIl9SZW5kZXJRdWV1ZVwiOlwiMjAwMFwiLFwiX1NoaW5pbmVzc1wiOlwiMC4wNzgxMjVcIixcIl9TcGVjdWxhclNvdXJjZVwiOlwiMFwiLFwiX1NyY0JsZW5kXCI6XCIxXCIsXCJfWlRlc3RcIjpcIjRcIixcIl9aV3JpdGVcIjpcIjFcIixcIl9Db2xvclwiOlwiMSwxLDEsMVwiLFwiX1NwZWNDb2xvclwiOlwiMC41LDAuNSwwLjUsMVwiLFwiX1NwZWN1bGFyXCI6XCIwLjI2NDcwNTksMC4yNjQ3MDU5LDAuMjY0NzA1OSwxXCIsXCJfd0NvbG9yXCI6XCIxLDAuNzY4MzgyMjUsMC42NjkxMTc3LDFcIn0sXCJ0YXJnZXRVcmxBcnJcIjpbXG57XG5cInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai80OV9DMlVfXFx1NUM5QjEvNTBfQzJVX2Rhb18xXCIsXCJtYXRJZFwiOjB9XG5dfVxuXTtcbn1cbiIsIi8qd21554mI5pysXzIwMTgvMS8zLzE5LjMxKi9cclxuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XHJcbmltcG9ydCBXbXlNYXRDb25maWcgZnJvbSAnLi9XbXlNYXRDb25maWcnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlNYXRNYWcgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XHJcbiAgICBwdWJsaWMgb25Bd2FrZSgpIHtcclxuICAgICAgICB2YXIgc2hhZGVyTWFnPXJlcXVpcmUoJy4uL3dteVNoYWRlcnMvV215U2hhZGVyTWFnJylbJ2RlZmF1bHQnXTtpZihzaGFkZXJNYWcpbmV3IHNoYWRlck1hZygpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgV215TWF0Q29uZmlnLm1hdENvbmZpZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbWF0T2JqID0gV215TWF0Q29uZmlnLm1hdENvbmZpZ1tpXTtcclxuICAgICAgICAgICAgdGhpcy5hZGRNYXQobWF0T2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZGRNYXQobWF0T2JqKXtcclxuICAgICAgICBpZihtYXRPYmo9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBjX21hdE5hbWU9bWF0T2JqWydjX21hdE5hbWUnXTtcclxuICAgICAgICB2YXIgaW5pdERhdGE9bWF0T2JqWydpbml0RGF0YSddO1xyXG4gICAgICAgIHZhciB0YXJnZXRVcmxBcnI9bWF0T2JqWyd0YXJnZXRVcmxBcnInXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRhcmdldFVybEFyci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgdXJsPXRhcmdldFVybEFycltqXVsndXJsJ107XHJcbiAgICAgICAgICAgIHZhciBtYXRJZD10YXJnZXRVcmxBcnJbal1bJ21hdElkJ107XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQzRD1XbXlNYXRNYWcuZ2V0T2JqM2RVcmwodGhpcy5zY2VuZTNELHVybCk7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldDNEIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TWF0ZXJpYWwodGFyZ2V0M0QsaW5pdERhdGEsbWF0SWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNYXRlcmlhbCh0YXJnZXQsaW5pdERhdGEsbWF0SWQ9MCxzaGFkZXJOYW1lPyxpc05ld01hdGVyaWE/KXtcclxuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXQpO1xyXG4gICAgICAgIGlmKHRhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihzaGFkZXJOYW1lPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBzaGFkZXJOYW1lPWluaXREYXRhLnNoYWRlck5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNoYWRlck5hbWU9PXVuZGVmaW5lZClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgc2hhZGVyPUxheWEuU2hhZGVyM0QuZmluZChzaGFkZXJOYW1lKTtcclxuICAgICAgICBpZihzaGFkZXI9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciByZW5kZXJlcjtcclxuICAgICAgICB2YXIgc2hhcmVkTWF0ZXJpYWw6TGF5YS5CYXNlTWF0ZXJpYWw7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgcmVuZGVyZXI9KHRhcmdldCkuc2tpbm5lZE1lc2hSZW5kZXJlcjtcclxuICAgICAgICAgICAgaWYocmVuZGVyZXI9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXJlbmRlcmVyLm1hdGVyaWFsc1ttYXRJZF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPSh0YXJnZXQpLm1lc2hSZW5kZXJlcjtcclxuICAgICAgICAgICAgaWYocmVuZGVyZXI9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXJlbmRlcmVyLm1hdGVyaWFsc1ttYXRJZF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzaGFyZWRNYXRlcmlhbD09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmsqHmnIlzaGFyZWRNYXRlcmlhbDonLHRhcmdldCxzaGFkZXJOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzTmV3TWF0ZXJpYSl7XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXNoYXJlZE1hdGVyaWFsLmNsb25lKCk7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLm1hdGVyaWFsc1ttYXRJZF09c2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXI9c2hhZGVyO1xyXG4gICAgICAgIC8v5riy5p+T5qih5byPXHJcbiAgICAgICAgdmFyIHZzUHNBcnI9c2hhZGVyWyd3X3ZzUHNBcnInXTtcclxuICAgICAgICBpZih2c1BzQXJyKXtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2c1BzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyRGF0YU9iaiA9IHZzUHNBcnJbaV1bMl07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVuZGVyRGF0YU9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXJEYXRhT2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2hhcmVkTWF0ZXJpYWwuaGFzT3duUHJvcGVydHkoa2V5KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbFtrZXldPXJlbmRlckRhdGFPYmpba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyU3RhdGU9c2hhcmVkTWF0ZXJpYWwuZ2V0UmVuZGVyU3RhdGUoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlbmRlclN0YXRlLmhhc093blByb3BlcnR5KGtleSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyU3RhdGVba2V5XT1yZW5kZXJEYXRhT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy/liJ3lp4vlgLxcclxuICAgICAgICBpZiAoc2hhZGVyWyd3X3VuaWZvcm1NYXAnXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzaGFkZXJbJ3dfdW5pZm9ybU1hcCddKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hhZGVyWyd3X3VuaWZvcm1NYXAnXS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRJZD1zaGFkZXJbJ3dfdW5pZm9ybU1hcCddW2tleV1bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRWPWluaXREYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaW5pdFYhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0ViA9IGluaXRWLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGluaXRWLmxlbmd0aD09NCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKGluaXRJZCxuZXcgTGF5YS5WZWN0b3I0KHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pLHBhcnNlRmxvYXQoaW5pdFZbMl0pLHBhcnNlRmxvYXQoaW5pdFZbM10pKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcihpbml0SWQsbmV3IExheWEuVmVjdG9yMyhwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSxwYXJzZUZsb2F0KGluaXRWWzJdKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0yKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IoaW5pdElkLG5ldyBMYXlhLlZlY3RvcjIocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09MSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNOYU4ocGFyc2VGbG9hdChpbml0VlswXSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldE51bWJlcihpbml0SWQscGFyc2VGbG9hdChpbml0VlswXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyT2JqPWluaXRWWzBdKycnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0ck9iaj09J3RleCcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4T2JqPWluaXREYXRhWydURVhAJytrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0ZXhPYmohPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGg9dGV4T2JqWydwYXRoJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHBhdGgsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLChfaW5pdElkLHRleCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0ZXg9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXg9bmV3IExheWEuVGV4dHVyZTJEKDAsMCwwLHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFRleHR1cmUoX2luaXRJZCx0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxbaW5pdElkXSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNoYXJlZE1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgU3ByaXRlM0RfU2hhZGVyVmFsdWVzKHRhcmdldCx2YWx1ZU5hbWUsdmFsdWUsbWF0c0lkKXtcclxuICAgICAgICB2YXIgdE9iakFycj1XbXlNYXRNYWcuZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LExheWEuUmVuZGVyYWJsZVNwcml0ZTNEKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRPYmpBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJQM2QgPSB0T2JqQXJyW2ldO1xyXG4gICAgICAgICAgICBXbXlNYXRNYWcuUmVuZGVyYWJsZVNwcml0ZTNEX1NoYWRlclZhbHVlcyhyUDNkLHZhbHVlTmFtZSx2YWx1ZSxtYXRzSWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbVx0dGFyZ2V0XHTlr7nosaFcclxuICAgICAqIEBwYXJhbVx0dmFsdWVOYW1lIOWAvOeahOWQjeWtl1xyXG4gICAgICogQHBhcmFtXHR2YWx1ZVx05YC8XHJcbiAgICAgKiBAcGFyYW1cdG1hdHNJZFx05p2Q6LSo55CDSURcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBSZW5kZXJhYmxlU3ByaXRlM0RfU2hhZGVyVmFsdWVzKHRhcmdldCx2YWx1ZU5hbWUsdmFsdWUsbWF0c0lkKSB7XHJcbiAgICAgICAgaWYobWF0c0lkPT1udWxsKW1hdHNJZD0tMTtcclxuICAgICAgICB2YXIgcmVuZGVyZXI9dGFyZ2V0WydtZXNoUmVuZGVyZXInXTtcclxuICAgICAgICBpZihyZW5kZXJlcj09bnVsbCl7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPXRhcmdldFsnc2tpbm5lZE1lc2hSZW5kZXJlciddO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighcmVuZGVyZXIpcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBtcz1yZW5kZXJlci5zaGFyZWRNYXRlcmlhbHM7XHJcbiAgICAgICAgaWYobXMubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgaXNNYXRzSWQ9bWF0c0lkPDA/ZmFsc2U6dHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIGlzT0s9dHJ1ZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBtID0gbXNbaV07XHJcbiAgICAgICAgICAgIHZhciB1bmlmb3JtTWFwPSBtLl9zaGFkZXIuX3VuaWZvcm1NYXBbdmFsdWVOYW1lXTtcclxuICAgICAgICAgICAgaWYoIXVuaWZvcm1NYXApY29udGludWU7XHJcbiAgICAgICAgICAgIGlmKGlzTWF0c0lkKXtcclxuICAgICAgICAgICAgICAgIGlmKG1hdHNJZCE9aSljb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlSWQ9dW5pZm9ybU1hcFswXTtcclxuICAgICAgICAgICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbil7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldEJvb2wodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKCFpc05hTih2YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2PXZhbHVlKycnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHYuaW5kZXhPZignLicpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0SW50KHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0TnVtYmVyKHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsdWUgaW5zdGFuY2VvZiBMYXlhLkJhc2VWZWN0b3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IodmFsdWVJZCx2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHZhbHVlIGluc3RhbmNlb2YgTGF5YS5RdWF0ZXJuaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0UXVhdGVybmlvbih2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsdWUgaW5zdGFuY2VvZiBMYXlhLk1hdHJpeDR4NCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldE1hdHJpeDR4NCh2YWx1ZUlkLHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodmFsdWUgaW5zdGFuY2VvZiBMYXlhLlRleHR1cmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRUZXh0dXJlKHZhbHVlSWQsdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBpc09LPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgaXNPSz1mYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNPSztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uSW5zdGFuY2VOYW1lKG5hbWUpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2U9bnVsbDtcclxuXHRcdHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSh3aW5kb3dbbmFtZV0ucHJvdG90eXBlKTtcclxuXHRcdFx0aW5zdGFuY2UuY29uc3RydWN0b3IuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqZWN0Q2xhc3Mob2JqKSB7XHJcbiAgICAgICAgaWYgKG9iaiAmJiBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgKiBmb3IgYnJvd3NlcnMgd2hpY2ggaGF2ZSBuYW1lIHByb3BlcnR5IGluIHRoZSBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICogb2YgdGhlIG9iamVjdCxzdWNoIGFzIGNocm9tZSBcclxuICAgICAgICAgICAqL1xyXG4gICAgICAgICAgaWYob2JqLmNvbnN0cnVjdG9yLm5hbWUpIHtcclxuICAgICAgICAgICByZXR1cm4gb2JqLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YXIgc3RyID0gb2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAvKlxyXG4gICAgICAgICAgICogZXhlY3V0ZWQgaWYgdGhlIHJldHVybiBvZiBvYmplY3QuY29uc3RydWN0b3IudG9TdHJpbmcoKSBpcyBcclxuICAgICAgICAgICAqICdbb2JqZWN0IG9iamVjdENsYXNzXSdcclxuICAgICAgICAgICAqL1xyXG4gICAgICAgICAgaWYoc3RyLmNoYXJBdCgwKSA9PSAnWycpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBhcnIgPSBzdHIubWF0Y2goL1xcW1xcdytcXHMqKFxcdyspXFxdLyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBleGVjdXRlZCBpZiB0aGUgcmV0dXJuIG9mIG9iamVjdC5jb25zdHJ1Y3Rvci50b1N0cmluZygpIGlzIFxyXG4gICAgICAgICAgICAgKiAnZnVuY3Rpb24gb2JqZWN0Q2xhc3MgKCkge30nXHJcbiAgICAgICAgICAgICAqIGZvciBJRSBGaXJlZm94XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gc3RyLm1hdGNoKC9mdW5jdGlvblxccyooXFx3KykvKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChhcnIgJiYgYXJyLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgICAgICByZXR1cm4gYXJyWzFdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7IFxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxjbGFzPyxhcnI/KSB7XHJcbiAgICAgICAgaWYoYXJyPT1udWxsKWFycj1bXTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG9iaj10YXJnZXQuZ2V0Q29tcG9uZW50KGNsYXMpO1xyXG4gICAgICAgIGlmKG9iaj09bnVsbCl7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIGNsYXMpe1xyXG4gICAgICAgICAgICAgICAgb2JqPXRhcmdldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmohPW51bGwgJiYgYXJyLmluZGV4T2Yob2JqKTwwKXtcclxuICAgICAgICAgICAgYXJyLnB1c2gob2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0Ll9jaGlsZHJlbj09bnVsbCkgcmV0dXJuIGFycjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZHJlbkNvbXBvbmVudChvLGNsYXMsYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkVXJsKHRhcmdldCx1cmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgYXJyVXJsPXVybC5zcGxpdCgnLycpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0LGFyclVybCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgX2dldE9iakFyclVybCh0YXJnZXQsdXJsQXJyOkFycmF5PHN0cmluZz4saWQ9MCl7XHJcbiAgICAgICAgdmFyIF90YXJnZXQ6TGF5YS5TcHJpdGUzRD10YXJnZXQ7XHJcbiAgICAgICAgaWYoX3RhcmdldD09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgbmE9dXJsQXJyW2lkXTtcclxuICAgICAgICB2YXIgdGFyZ2V0T2JqPV90YXJnZXQuZ2V0Q2hpbGRCeU5hbWUobmEpO1xyXG4gICAgICAgIGlmKHRhcmdldE9iaj09bnVsbClyZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihpZD49dXJsQXJyLmxlbmd0aC0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGFyZ2V0T2JqPXRoaXMuX2dldE9iakFyclVybCh0YXJnZXRPYmosdXJsQXJyLCsraWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0T2JqO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlX1dteVNoYWRlcntcclxuICAgIHByb3RlY3RlZCBfX2F0dHJpYnV0ZU1hcD17XHJcbiAgICAgICAgJ2FfUG9zaXRpb24nOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1BPU0lUSU9OMCovMCxcclxuICAgICAgICAnYV9Db2xvcic6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfQ09MT1IwKi8xLFxyXG4gICAgICAgICdhX05vcm1hbCc6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfTk9STUFMMCovMyxcclxuICAgICAgICAnYV9UZXhjb29yZDAnOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1RFWFRVUkVDT09SRElOQVRFMCovMixcclxuICAgICAgICAnYV9UZXhjb29yZDEnOi8qbGF5YS5kMy5ncmFwaGljcy5WZXJ0ZXguVmVydGV4TWVzaC5NRVNIX1RFWFRVUkVDT09SRElOQVRFMSovOCxcclxuICAgICAgICAnYV9Cb25lV2VpZ2h0cyc6LypsYXlhLmQzLmdyYXBoaWNzLlZlcnRleC5WZXJ0ZXhNZXNoLk1FU0hfQkxFTkRXRUlHSFQwKi83LFxyXG4gICAgICAgICdhX0JvbmVJbmRpY2VzJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9CTEVORElORElDRVMwKi82LFxyXG4gICAgICAgICdhX1RhbmdlbnQwJzovKmxheWEuZDMuZ3JhcGhpY3MuVmVydGV4LlZlcnRleE1lc2guTUVTSF9UQU5HRU5UMCovNSxcclxuICAgICAgICAvL3ZhciB1bmlmb3JtTWFwOk9iamVjdCA9IHsndV9NdnBNYXRyaXgnOiBbU3ByaXRlM0QuTVZQTUFUUklYLCBTaGFkZXIzRC5QRVJJT0RfU1BSSVRFXSwgJ3VfV29ybGRNYXQnOiBbU3ByaXRlM0QuV09STERNQVRSSVgsIFNoYWRlcjNELlBFUklPRF9TUFJJVEVdfTtcclxuICAgIH07XHJcbiAgICBwcm90ZWN0ZWQgX191bmlmb3JtTWFwPXtcclxuICAgICAgICAndV9Cb25lcyc6WyAvKmxheWEuZDMuY29yZS5Ta2lubmVkTWVzaFNwcml0ZTNELkJPTkVTKi8wLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX0NVU1RPTSovMF0sXHJcbiAgICAgICAgJ3VfRGlmZnVzZVRleHR1cmUnOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLkFMQkVET1RFWFRVUkUqLzEsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X1NwZWN1bGFyVGV4dHVyZSc6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuU1BFQ1VMQVJURVhUVVJFKi8zLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9Ob3JtYWxUZXh0dXJlJzpbIC8qbGF5YS5kMy5jb3JlLm1hdGVyaWFsLkJsaW5uUGhvbmdNYXRlcmlhbC5OT1JNQUxURVhUVVJFKi8yLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9BbHBoYVRlc3RWYWx1ZSc6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CYXNlTWF0ZXJpYWwuQUxQSEFURVNUVkFMVUUqLzAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X0RpZmZ1c2VDb2xvcic6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuQUxCRURPQ09MT1IqLzUsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X01hdGVyaWFsU3BlY3VsYXInOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLk1BVEVSSUFMU1BFQ1VMQVIqLzYsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfTUFURVJJQUwqLzFdLFxyXG4gICAgICAgICd1X1NoaW5pbmVzcyc6WyAvKmxheWEuZDMuY29yZS5tYXRlcmlhbC5CbGlublBob25nTWF0ZXJpYWwuU0hJTklORVNTKi83LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX01BVEVSSUFMKi8xXSxcclxuICAgICAgICAndV9UaWxpbmdPZmZzZXQnOlsgLypsYXlhLmQzLmNvcmUubWF0ZXJpYWwuQmxpbm5QaG9uZ01hdGVyaWFsLlRJTElOR09GRlNFVCovOCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTCovMV0sXHJcbiAgICAgICAgJ3VfV29ybGRNYXQnOltMYXlhLlNwcml0ZTNELldPUkxETUFUUklYLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NQUklURSovMl0sXHJcbiAgICAgICAgJ3VfTXZwTWF0cml4JzpbTGF5YS5TcHJpdGUzRC5NVlBNQVRSSVgsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU1BSSVRFKi8yXSxcclxuICAgICAgICAndV9MaWdodG1hcFNjYWxlT2Zmc2V0JzpbTGF5YS5SZW5kZXJhYmxlU3ByaXRlM0QuTElHSFRNQVBTQ0FMRU9GRlNFVCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TUFJJVEUqLzJdLFxyXG4gICAgICAgICd1X0xpZ2h0TWFwJzpbTGF5YS5SZW5kZXJhYmxlU3ByaXRlM0QuTElHSFRNQVAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU1BSSVRFKi8yXSxcclxuICAgICAgICAndV9DYW1lcmFQb3MnOlsgLypsYXlhLmQzLmNvcmUuQmFzZUNhbWVyYS5DQU1FUkFQT1MqLzAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfQ0FNRVJBKi8zXSxcclxuICAgICAgICAndV9SZWZsZWN0VGV4dHVyZSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlJFRkxFQ1RJT05URVhUVVJFKi8yMiwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfUmVmbGVjdEludGVuc2l0eSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlJFRkxFVElPTklOVEVOU0lUWSovMjMsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0ZvZ1N0YXJ0JzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuRk9HU1RBUlQqLzEsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0ZvZ1JhbmdlJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuRk9HUkFOR0UqLzIsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0ZvZ0NvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuRk9HQ09MT1IqLzAsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X0RpcmVjdGlvbkxpZ2h0LkNvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuTElHSFRESVJDT0xPUiovNCwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfRGlyZWN0aW9uTGlnaHQuRGlyZWN0aW9uJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuTElHSFRESVJFQ1RJT04qLzMsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1BvaW50TGlnaHQuUG9zaXRpb24nOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5QT0lOVExJR0hUUE9TKi81LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9Qb2ludExpZ2h0LlJhbmdlJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuUE9JTlRMSUdIVFJBTkdFKi82LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9Qb2ludExpZ2h0LkNvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuUE9JTlRMSUdIVENPTE9SKi84LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9TcG90TGlnaHQuUG9zaXRpb24nOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TUE9UTElHSFRQT1MqLzksLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1Nwb3RMaWdodC5EaXJlY3Rpb24nOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TUE9UTElHSFRESVJFQ1RJT04qLzEwLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9TcG90TGlnaHQuUmFuZ2UnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TUE9UTElHSFRSQU5HRSovMTIsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X1Nwb3RMaWdodC5TcG90JzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU1BPVExJR0hUU1BPVEFOR0xFKi8xMSwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfU3BvdExpZ2h0LkNvbG9yJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU1BPVExJR0hUQ09MT1IqLzE0LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9BbWJpZW50Q29sb3InOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5BTUJJRU5UQ09MT1IqLzIxLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9zaGFkb3dNYXAxJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XTUFQVEVYVFVSRTEqLzE4LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9zaGFkb3dNYXAyJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XTUFQVEVYVFVSRTIqLzE5LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9zaGFkb3dNYXAzJzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XTUFQVEVYVFVSRTMqLzIwLC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9zaGFkb3dQU1NNRGlzdGFuY2UnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TSEFET1dESVNUQU5DRSovMTUsLypsYXlhLmQzLnNoYWRlci5TaGFkZXIzRC5QRVJJT0RfU0NFTkUqLzRdLFxyXG4gICAgICAgICd1X2xpZ2h0U2hhZG93VlAnOlsgLypsYXlhLmQzLmNvcmUuc2NlbmUuU2NlbmUzRC5TSEFET1dMSUdIVFZJRVdQUk9KRUNUKi8xNiwvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3Vfc2hhZG93UENGb2Zmc2V0JzpbIC8qbGF5YS5kMy5jb3JlLnNjZW5lLlNjZW5lM0QuU0hBRE9XTUFQUENGT0ZGU0VUKi8xNywvKmxheWEuZDMuc2hhZGVyLlNoYWRlcjNELlBFUklPRF9TQ0VORSovNF0sXHJcbiAgICAgICAgJ3VfVGltZSc6WyAvKmxheWEuZDMuY29yZS5zY2VuZS5TY2VuZTNELlRJTUUqLzI0LC8qbGF5YS5kMy5zaGFkZXIuU2hhZGVyM0QuUEVSSU9EX1NDRU5FKi80XSxcclxuICAgICAgICAndV9QTWF0cml4JzpbMiwgM10sXHJcbiAgICAgICAgJ3VfVk1hdHJpeCc6WzEsIDNdLFxyXG4gICAgfTtcclxuICAgIHByb3RlY3RlZCBfdnNQc0Fycj1bXTtcclxuICAgIHByb3RlY3RlZCBfc2hhZGVyPW51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3NoYWRlck5hbWU7XHJcbiAgICBwcm90ZWN0ZWQgX2F0dHJpYnV0ZU1hcD17fTtcclxuICAgIHByb3RlY3RlZCBfdW5pZm9ybU1hcD17fTtcclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIGluaXQoKXtcclxuXHJcbiAgICB9XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgdmFyIHNwcml0ZURlZmluZXM9TGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNELnNoYWRlckRlZmluZXM7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsRGVmaW5lcz1MYXlhLkJsaW5uUGhvbmdNYXRlcmlhbC5zaGFkZXJEZWZpbmVzO1xyXG4gICAgICAgIHRoaXMuX3NoYWRlcj1MYXlhLlNoYWRlcjNELmFkZCh0aGlzLl9zaGFkZXJOYW1lLHRoaXMuX19hdHRyaWJ1dGVNYXAsdGhpcy5fX3VuaWZvcm1NYXAsc3ByaXRlRGVmaW5lcyxtYXRlcmlhbERlZmluZXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3NoYWRlclsnd191bmlmb3JtTWFwJ109dGhpcy5fdW5pZm9ybU1hcDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2F0dHJpYnV0ZU1hcCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYXR0cmlidXRlTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX19hdHRyaWJ1dGVNYXBba2V5XSA9IHRoaXMuX2F0dHJpYnV0ZU1hcFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl91bmlmb3JtTWFwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91bmlmb3JtTWFwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VuaWZvcm1NYXBba2V5XVsxXT1MYXlhLlNoYWRlcjNELlBFUklPRF9NQVRFUklBTDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX191bmlmb3JtTWFwW2tleV0gPSB0aGlzLl91bmlmb3JtTWFwW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NoYWRlclsnd192c1BzQXJyJ109dGhpcy5fdnNQc0FycjtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fdnNQc0Fycikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdnNQc0Fyci5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdnNwcz10aGlzLl92c1BzQXJyW2tleV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFkZXIuYWRkU2hhZGVyUGFzcyh2c3BzWzBdLHZzcHNbMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25TZXRWc1BzKHZzLHBzLHJlbmRlckRhdGEpe1xyXG4gICAgICAgIGlmICh2cyAhPSBudWxsICYmIHBzIT1udWxsKSB7XHJcbiAgICAgICAgICAgIHZzPXRoaXMub25TZXRWcyh2cyk7XHJcbiAgICAgICAgICAgIHBzPXRoaXMub25TZXRQcyhwcyk7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlckRhdGE9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyRGF0YT17fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl92c1BzQXJyLnB1c2goW3ZzLHBzLHJlbmRlckRhdGFdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uU2V0VnModnMpe1xyXG4gICAgICAgIGlmKHZzPT1udWxsKXJldHVybiAnJztcclxuICAgICAgICBpZih2cy5pbmRleE9mKCd3bXlNYWluKCcpPDApcmV0dXJuIHZzO1xyXG4gICAgICAgIHZhciBfVnM9YFxyXG4jaW5jbHVkZSAnTGlnaHRpbmcuZ2xzbCc7XHJcblxyXG5hdHRyaWJ1dGUgdmVjNCBhX1Bvc2l0aW9uO1xyXG51bmlmb3JtIG1hdDQgdV9NdnBNYXRyaXg7XHJcblxyXG5hdHRyaWJ1dGUgdmVjMiBhX1RleGNvb3JkMDtcclxuI2lmIGRlZmluZWQoRElGRlVTRU1BUCl8fCgoZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKSkmJihkZWZpbmVkKFNQRUNVTEFSTUFQKXx8ZGVmaW5lZChOT1JNQUxNQVApKSl8fChkZWZpbmVkKExJR0hUTUFQKSYmZGVmaW5lZChVVikpXHJcbiAgICB2YXJ5aW5nIHZlYzIgdl9UZXhjb29yZDA7XHJcbiNlbmRpZlxyXG5cclxuI2lmIGRlZmluZWQoTElHSFRNQVApJiZkZWZpbmVkKFVWMSlcclxuICAgIGF0dHJpYnV0ZSB2ZWMyIGFfVGV4Y29vcmQxO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBMSUdIVE1BUFxyXG4gICAgdW5pZm9ybSB2ZWM0IHVfTGlnaHRtYXBTY2FsZU9mZnNldDtcclxuICAgIHZhcnlpbmcgdmVjMiB2X0xpZ2h0TWFwVVY7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIENPTE9SXHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhX0NvbG9yO1xyXG4gICAgdmFyeWluZyB2ZWM0IHZfQ29sb3I7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIEJPTkVcclxuICAgIGNvbnN0IGludCBjX01heEJvbmVDb3VudCA9IDI0O1xyXG4gICAgYXR0cmlidXRlIHZlYzQgYV9Cb25lSW5kaWNlcztcclxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFfQm9uZVdlaWdodHM7XHJcbiAgICB1bmlmb3JtIG1hdDQgdV9Cb25lc1tjX01heEJvbmVDb3VudF07XHJcbiNlbmRpZlxyXG5cclxuYXR0cmlidXRlIHZlYzMgYV9Ob3JtYWw7XHJcbnZhcnlpbmcgdmVjMyB2X05vcm1hbDsgXHJcbnVuaWZvcm0gdmVjMyB1X0NhbWVyYVBvcztcclxudmFyeWluZyB2ZWMzIHZfVmlld0RpcjsgXHJcbmF0dHJpYnV0ZSB2ZWM0IGFfVGFuZ2VudDA7XHJcbnZhcnlpbmcgbWF0MyB3b3JsZEludk1hdDtcclxudmFyeWluZyB2ZWMzIHZfUG9zaXRpb247XHJcblxyXG52YXJ5aW5nIHZlYzMgdl9UYW5nZW50O1xyXG52YXJ5aW5nIHZlYzMgdl9CaW5vcm1hbDtcclxuXHJcbnVuaWZvcm0gbWF0NCB1X1dvcmxkTWF0O1xyXG52YXJ5aW5nIHZlYzMgdl9Qb3NpdGlvbldvcmxkO1xyXG5cclxudmFyeWluZyBmbG9hdCB2X3Bvc1ZpZXdaO1xyXG4jaWZkZWYgUkVDRUlWRVNIQURPV1xyXG4gICAgI2lmZGVmIFNIQURPV01BUF9QU1NNMSBcclxuICAgIHZhcnlpbmcgdmVjNCB2X2xpZ2h0TVZQUG9zO1xyXG4gICAgdW5pZm9ybSBtYXQ0IHVfbGlnaHRTaGFkb3dWUFs0XTtcclxuICAgICNlbmRpZlxyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBUSUxJTkdPRkZTRVRcclxuICAgIHVuaWZvcm0gdmVjNCB1X1RpbGluZ09mZnNldDtcclxuI2VuZGlmXHJcblxyXG52b2lkIG1haW5fY2FzdFNoYWRvdygpXHJcbntcclxuICAgICNpZmRlZiBCT05FXHJcbiAgICAgICAgbWF0NCBza2luVHJhbnNmb3JtID0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy54KV0gKiBhX0JvbmVXZWlnaHRzLng7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLnkpXSAqIGFfQm9uZVdlaWdodHMueTtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueildICogYV9Cb25lV2VpZ2h0cy56O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy53KV0gKiBhX0JvbmVXZWlnaHRzLnc7XHJcbiAgICAgICAgdmVjNCBwb3NpdGlvbj1za2luVHJhbnNmb3JtKmFfUG9zaXRpb247XHJcbiAgICAgICAgdl9Qb3NpdGlvbj1wb3NpdGlvbi54eXo7XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X012cE1hdHJpeCAqIHBvc2l0aW9uO1xyXG4gICAgI2Vsc2VcclxuICAgICAgICB2X1Bvc2l0aW9uPWFfUG9zaXRpb24ueHl6O1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdV9NdnBNYXRyaXggKiBhX1Bvc2l0aW9uO1xyXG4gICAgI2VuZGlmXHJcbiAgICAgICAgXHJcbiAgICAvL1RPRE/msqHogIPomZFVVuWKqOeUu+WRolxyXG4gICAgI2lmIGRlZmluZWQoRElGRlVTRU1BUCkmJmRlZmluZWQoQUxQSEFURVNUKVxyXG4gICAgICAgIHZfVGV4Y29vcmQwPWFfVGV4Y29vcmQwO1xyXG4gICAgI2VuZGlmXHJcbiAgICAgICAgdl9wb3NWaWV3WiA9IGdsX1Bvc2l0aW9uLno7XHJcbn1cclxuXHJcbm1hdDMgaW52ZXJzZShtYXQzIG0pIHtcclxuICAgIGZsb2F0IGEwMCA9IG1bMF1bMF0sIGEwMSA9IG1bMF1bMV0sIGEwMiA9IG1bMF1bMl07XHJcbiAgICBmbG9hdCBhMTAgPSBtWzFdWzBdLCBhMTEgPSBtWzFdWzFdLCBhMTIgPSBtWzFdWzJdO1xyXG4gICAgZmxvYXQgYTIwID0gbVsyXVswXSwgYTIxID0gbVsyXVsxXSwgYTIyID0gbVsyXVsyXTtcclxuXHJcbiAgICBmbG9hdCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjE7XHJcbiAgICBmbG9hdCBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwO1xyXG4gICAgZmxvYXQgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwO1xyXG5cclxuICAgIGZsb2F0IGRldCA9IGEwMCAqIGIwMSArIGEwMSAqIGIxMSArIGEwMiAqIGIyMTtcclxuXHJcbiAgICByZXR1cm4gbWF0MyhiMDEsICgtYTIyICogYTAxICsgYTAyICogYTIxKSwgKGExMiAqIGEwMSAtIGEwMiAqIGExMSksXHJcbiAgICAgICAgICAgICAgICBiMTEsIChhMjIgKiBhMDAgLSBhMDIgKiBhMjApLCAoLWExMiAqIGEwMCArIGEwMiAqIGExMCksXHJcbiAgICAgICAgICAgICAgICBiMjEsICgtYTIxICogYTAwICsgYTAxICogYTIwKSwgKGExMSAqIGEwMCAtIGEwMSAqIGExMCkpIC8gZGV0O1xyXG59XHJcblxyXG52b2lkIG1haW5fbm9ybWFsKClcclxue1xyXG4gICAgI2lmZGVmIEJPTkVcclxuICAgICAgICBtYXQ0IHNraW5UcmFuc2Zvcm0gPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLngpXSAqIGFfQm9uZVdlaWdodHMueDtcclxuICAgICAgICBza2luVHJhbnNmb3JtICs9IHVfQm9uZXNbaW50KGFfQm9uZUluZGljZXMueSldICogYV9Cb25lV2VpZ2h0cy55O1xyXG4gICAgICAgIHNraW5UcmFuc2Zvcm0gKz0gdV9Cb25lc1tpbnQoYV9Cb25lSW5kaWNlcy56KV0gKiBhX0JvbmVXZWlnaHRzLno7XHJcbiAgICAgICAgc2tpblRyYW5zZm9ybSArPSB1X0JvbmVzW2ludChhX0JvbmVJbmRpY2VzLncpXSAqIGFfQm9uZVdlaWdodHMudztcclxuICAgICAgICB2ZWM0IHBvc2l0aW9uPXNraW5UcmFuc2Zvcm0qYV9Qb3NpdGlvbjtcclxuICAgICAgICB2X1Bvc2l0aW9uPXBvc2l0aW9uLnh5ejtcclxuICAgICAgICBnbF9Qb3NpdGlvbiA9IHVfTXZwTWF0cml4ICogcG9zaXRpb247XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIHZfUG9zaXRpb249YV9Qb3NpdGlvbi54eXo7XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB1X012cE1hdHJpeCAqIGFfUG9zaXRpb247XHJcbiAgICAjZW5kaWZcclxuXHJcbiAgICAjaWZkZWYgQk9ORVxyXG4gICAgICAgIHdvcmxkSW52TWF0PWludmVyc2UobWF0Myh1X1dvcmxkTWF0KnNraW5UcmFuc2Zvcm0pKTtcclxuICAgICNlbHNlXHJcbiAgICAgICAgd29ybGRJbnZNYXQ9aW52ZXJzZShtYXQzKHVfV29ybGRNYXQpKTtcclxuICAgICNlbmRpZiAgXHJcbiAgICB2X05vcm1hbD1hX05vcm1hbCp3b3JsZEludk1hdDtcclxuXHJcbiAgICB2X1RhbmdlbnQ9YV9UYW5nZW50MC54eXoqd29ybGRJbnZNYXQ7XHJcbiAgICB2X0Jpbm9ybWFsPWNyb3NzKHZfTm9ybWFsLHZfVGFuZ2VudCkqYV9UYW5nZW50MC53O1xyXG5cclxuICAgICNpZmRlZiBCT05FXHJcbiAgICAgICAgdl9Qb3NpdGlvbldvcmxkPSh1X1dvcmxkTWF0KnBvc2l0aW9uKS54eXo7XHJcbiAgICAjZWxzZVxyXG4gICAgICAgIHZfUG9zaXRpb25Xb3JsZD0odV9Xb3JsZE1hdCphX1Bvc2l0aW9uKS54eXo7XHJcbiAgICAjZW5kaWZcclxuICAgIFxyXG4gICAgdl9WaWV3RGlyPXVfQ2FtZXJhUG9zLXZfUG9zaXRpb25Xb3JsZDtcclxuXHJcbiAgICAjaWYgZGVmaW5lZChESUZGVVNFTUFQKXx8KChkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpKSYmKGRlZmluZWQoU1BFQ1VMQVJNQVApfHxkZWZpbmVkKE5PUk1BTE1BUCkpKVxyXG4gICAgICAgIHZfVGV4Y29vcmQwPWFfVGV4Y29vcmQwO1xyXG4gICAgICAgICNpZmRlZiBUSUxJTkdPRkZTRVRcclxuICAgICAgICAgICAgdl9UZXhjb29yZDA9VHJhbnNmb3JtVVYodl9UZXhjb29yZDAsdV9UaWxpbmdPZmZzZXQpO1xyXG4gICAgICAgICNlbmRpZlxyXG4gICAgI2VuZGlmXHJcblxyXG4gICAgI2lmZGVmIExJR0hUTUFQXHJcbiAgICAgICAgI2lmZGVmIFNDQUxFT0ZGU0VUTElHSFRJTkdNQVBVVlxyXG4gICAgICAgICAgICAjaWZkZWYgVVYxXHJcbiAgICAgICAgICAgICAgICB2X0xpZ2h0TWFwVVY9dmVjMihhX1RleGNvb3JkMS54LDEuMC1hX1RleGNvb3JkMS55KSp1X0xpZ2h0bWFwU2NhbGVPZmZzZXQueHkrdV9MaWdodG1hcFNjYWxlT2Zmc2V0Lnp3O1xyXG4gICAgICAgICAgICAjZWxzZVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPXZlYzIoYV9UZXhjb29yZDAueCwxLjAtYV9UZXhjb29yZDAueSkqdV9MaWdodG1hcFNjYWxlT2Zmc2V0Lnh5K3VfTGlnaHRtYXBTY2FsZU9mZnNldC56dztcclxuICAgICAgICAgICAgI2VuZGlmIFxyXG4gICAgICAgICAgICB2X0xpZ2h0TWFwVVYueT0xLjAtdl9MaWdodE1hcFVWLnk7XHJcbiAgICAgICAgI2Vsc2VcclxuICAgICAgICAgICAgI2lmZGVmIFVWMVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPWFfVGV4Y29vcmQxO1xyXG4gICAgICAgICAgICAjZWxzZVxyXG4gICAgICAgICAgICAgICAgdl9MaWdodE1hcFVWPWFfVGV4Y29vcmQwO1xyXG4gICAgICAgICAgICAjZW5kaWYgXHJcbiAgICAgICAgI2VuZGlmIFxyXG4gICAgI2VuZGlmXHJcblxyXG4gICAgI2lmIGRlZmluZWQoQ09MT1IpJiZkZWZpbmVkKEVOQUJMRVZFUlRFWENPTE9SKVxyXG4gICAgICAgIHZfQ29sb3I9YV9Db2xvcjtcclxuICAgICNlbmRpZlxyXG5cclxuICAgICNpZmRlZiBSRUNFSVZFU0hBRE9XXHJcbiAgICAgICAgdl9wb3NWaWV3WiA9IGdsX1Bvc2l0aW9uLnc7XHJcbiAgICAgICAgI2lmZGVmIFNIQURPV01BUF9QU1NNMSBcclxuICAgICAgICAgICAgdl9saWdodE1WUFBvcyA9IHVfbGlnaHRTaGFkb3dWUFswXSAqIHZlYzQodl9Qb3NpdGlvbldvcmxkLDEuMCk7XHJcbiAgICAgICAgI2VuZGlmXHJcbiAgICAjZW5kaWZcclxufVxyXG5cclxuLy8tLXdteS1tYWluLS0tLS0tLS0tLS0tLS0tLS1cclxubWF0MyBNQVRSSVhfSVRfTVYobWF0NCBNb2RlbFZpZXdNYXRyaXgpIHtcclxuICAgIHJldHVybiBpbnZlcnNlKG1hdDMoTW9kZWxWaWV3TWF0cml4KSk7XHJcbn1cclxubWF0MyBnZXRSb3RhdGlvbih2ZWM0IHdUYW5nZW50LCB2ZWMzIHdOb3JtYWwpIHtcclxuICAgIHZlYzMgYmlub3JtYWwgPSBjcm9zcyh3Tm9ybWFsLnh5eiwgd1RhbmdlbnQueHl6KSAqIC13VGFuZ2VudC53O1xyXG4gICAgbWF0MyByb3RhdGlvbiA9IG1hdDMoXHJcbiAgICAgICAgd1RhbmdlbnQueCwgYmlub3JtYWwueCwgd05vcm1hbC54LFxyXG4gICAgICAgIHdUYW5nZW50LnksIGJpbm9ybWFsLnksIHdOb3JtYWwueSxcclxuICAgICAgICB3VGFuZ2VudC56LCBiaW5vcm1hbC56LCB3Tm9ybWFsLnopO1xyXG4gICAgcmV0dXJuIHJvdGF0aW9uO1xyXG59XHJcbiR7dnN9XHJcbi8vLS13bXktLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG52b2lkIG1haW4oKVxyXG57XHJcbiAgICAjaWZkZWYgQ0FTVFNIQURPV1xyXG4gICAgICAgIG1haW5fY2FzdFNoYWRvdygpO1xyXG4gICAgI2Vsc2VcclxuICAgICAgICBtYWluX25vcm1hbCgpO1xyXG4gICAgICAgIHdteU1haW4oKTtcclxuICAgICNlbmRpZlxyXG59ICAgICAgICBcclxuICAgICAgICBgO1xyXG4gICAgICAgIHJldHVybiBfVnM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBvblNldFBzKHBzKXtcclxuICAgICAgICBpZihwcz09bnVsbClyZXR1cm4gJyc7XHJcbiAgICAgICAgaWYocHMuaW5kZXhPZignd215TWFpbignKTwwKXJldHVybiBwcztcclxuICAgICAgICB2YXIgX1BzPWBcclxuI2lmZGVmIEhJR0hQUkVDSVNJT05cclxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xyXG4jZWxzZVxyXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcclxuI2VuZGlmXHJcblxyXG4jaW5jbHVkZSAnTGlnaHRpbmcuZ2xzbCc7XHJcblxyXG51bmlmb3JtIHZlYzQgdV9EaWZmdXNlQ29sb3I7XHJcblxyXG4jaWYgZGVmaW5lZChDT0xPUikmJmRlZmluZWQoRU5BQkxFVkVSVEVYQ09MT1IpXHJcbiAgICB2YXJ5aW5nIHZlYzQgdl9Db2xvcjtcclxuI2VuZGlmXHJcblxyXG52YXJ5aW5nIHZlYzMgdl9WaWV3RGlyOyBcclxuXHJcbiNpZmRlZiBBTFBIQVRFU1RcclxuICAgIHVuaWZvcm0gZmxvYXQgdV9BbHBoYVRlc3RWYWx1ZTtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgRElGRlVTRU1BUFxyXG4gICAgdW5pZm9ybSBzYW1wbGVyMkQgdV9EaWZmdXNlVGV4dHVyZTtcclxuI2VuZGlmXHJcblxyXG4jaWYgZGVmaW5lZChESUZGVVNFTUFQKXx8KChkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpKSYmKGRlZmluZWQoU1BFQ1VMQVJNQVApfHxkZWZpbmVkKE5PUk1BTE1BUCkpKVxyXG4gICAgdmFyeWluZyB2ZWMyIHZfVGV4Y29vcmQwO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBMSUdIVE1BUFxyXG4gICAgdmFyeWluZyB2ZWMyIHZfTGlnaHRNYXBVVjtcclxuICAgIHVuaWZvcm0gc2FtcGxlcjJEIHVfTGlnaHRNYXA7XHJcbiNlbmRpZlxyXG5cclxuI2lmIGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVClcclxuICAgIHVuaWZvcm0gdmVjMyB1X01hdGVyaWFsU3BlY3VsYXI7XHJcbiAgICB1bmlmb3JtIGZsb2F0IHVfU2hpbmluZXNzO1xyXG4gICAgI2lmZGVmIFNQRUNVTEFSTUFQIFxyXG4gICAgICAgIHVuaWZvcm0gc2FtcGxlcjJEIHVfU3BlY3VsYXJUZXh0dXJlO1xyXG4gICAgI2VuZGlmXHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIEZPR1xyXG4gICAgdW5pZm9ybSBmbG9hdCB1X0ZvZ1N0YXJ0O1xyXG4gICAgdW5pZm9ybSBmbG9hdCB1X0ZvZ1JhbmdlO1xyXG4gICAgdW5pZm9ybSB2ZWMzIHVfRm9nQ29sb3I7XHJcbiNlbmRpZlxyXG5cclxudmFyeWluZyB2ZWMzIHZfTm9ybWFsO1xyXG52YXJ5aW5nIHZlYzMgdl9Qb3NpdGlvbjtcclxuXHJcbnVuaWZvcm0gc2FtcGxlcjJEIHVfTm9ybWFsVGV4dHVyZTtcclxudmFyeWluZyB2ZWMzIHZfVGFuZ2VudDtcclxudmFyeWluZyB2ZWMzIHZfQmlub3JtYWw7XHJcblxyXG4jaWZkZWYgRElSRUNUSU9OTElHSFRcclxuICAgIHVuaWZvcm0gRGlyZWN0aW9uTGlnaHQgdV9EaXJlY3Rpb25MaWdodDtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgUE9JTlRMSUdIVFxyXG4gICAgdW5pZm9ybSBQb2ludExpZ2h0IHVfUG9pbnRMaWdodDtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgU1BPVExJR0hUXHJcbiAgICB1bmlmb3JtIFNwb3RMaWdodCB1X1Nwb3RMaWdodDtcclxuI2VuZGlmXHJcblxyXG51bmlmb3JtIHZlYzMgdV9BbWJpZW50Q29sb3I7XHJcblxyXG5cclxuI2lmIGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKXx8ZGVmaW5lZChSRUNFSVZFU0hBRE9XKVxyXG4gICAgdmFyeWluZyB2ZWMzIHZfUG9zaXRpb25Xb3JsZDtcclxuI2VuZGlmXHJcblxyXG4jaW5jbHVkZSAnU2hhZG93SGVscGVyLmdsc2wnXHJcbnZhcnlpbmcgZmxvYXQgdl9wb3NWaWV3WjtcclxuI2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuICAgICNpZiBkZWZpbmVkKFNIQURPV01BUF9QU1NNMil8fGRlZmluZWQoU0hBRE9XTUFQX1BTU00zKVxyXG4gICAgICAgIHVuaWZvcm0gbWF0NCB1X2xpZ2h0U2hhZG93VlBbNF07XHJcbiAgICAjZW5kaWZcclxuICAgICNpZmRlZiBTSEFET1dNQVBfUFNTTTEgXHJcbiAgICAgICAgdmFyeWluZyB2ZWM0IHZfbGlnaHRNVlBQb3M7XHJcbiAgICAjZW5kaWZcclxuI2VuZGlmXHJcblxyXG52b2lkIG1haW5fY2FzdFNoYWRvdygpXHJcbntcclxuICAgIC8vZ2xfRnJhZ0NvbG9yPXZlYzQodl9wb3NWaWV3WiwwLjAsMC4wLDEuMCk7XHJcbiAgICBnbF9GcmFnQ29sb3I9cGFja0RlcHRoKHZfcG9zVmlld1opO1xyXG4gICAgI2lmIGRlZmluZWQoRElGRlVTRU1BUCkmJmRlZmluZWQoQUxQSEFURVNUKVxyXG4gICAgICAgIGZsb2F0IGFscGhhID0gdGV4dHVyZTJEKHVfRGlmZnVzZVRleHR1cmUsdl9UZXhjb29yZDApLnc7XHJcbiAgICAgICAgaWYoIGFscGhhIDwgdV9BbHBoYVRlc3RWYWx1ZSApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNjYXJkO1xyXG4gICAgICAgIH1cclxuICAgICNlbmRpZlxyXG59XHJcblxyXG4vLy0td215LW1haW4tLS0tLS0tLS0tLS0tLS0tLVxyXG52ZWM0IGxlcnBWNCh2ZWM0IGEsIHZlYzQgYiwgZmxvYXQgcykgeyByZXR1cm4gdmVjNChhICsgKGIgLSBhKSpzKTsgfVxyXG52ZWMzIGxlcnBWMyh2ZWMzIGEsIHZlYzMgYiwgZmxvYXQgcykgeyByZXR1cm4gdmVjMyhhICsgKGIgLSBhKSpzKTsgfVxyXG52ZWMyIGxlcnBWMih2ZWMyIGEsIHZlYzIgYiwgZmxvYXQgcykgeyByZXR1cm4gdmVjMihhICsgKGIgLSBhKSpzKTsgfVxyXG5mbG9hdCBsZXJwRihmbG9hdCBhLCBmbG9hdCBiLCBmbG9hdCBzKSB7IHJldHVybiBmbG9hdChhICsgKGIgLSBhKSAqIHMpOyB9XHJcbmZsb2F0IHNhdHVyYXRlKGZsb2F0IG4pIHsgcmV0dXJuIGNsYW1wKG4sIDAuMCwgMS4wKTsgfVxyXG52ZWMzIFVucGFja05vcm1hbCh2ZWM0IHBhY2tlZG5vcm1hbCkge1xyXG5cdC8vIFRoaXMgZG8gdGhlIHRyaWNrXHJcblx0cGFja2Vkbm9ybWFsLnggKj0gcGFja2Vkbm9ybWFsLnc7XHJcblx0dmVjMyBub3JtYWw7XHJcblx0bm9ybWFsLnh5ID0gcGFja2Vkbm9ybWFsLnh5ICogMi4wIC0gMS4wO1xyXG5cdG5vcm1hbC56ID0gc3FydCgxLjAgLSBzYXR1cmF0ZShkb3Qobm9ybWFsLnh5LCBub3JtYWwueHkpKSk7XHJcblx0cmV0dXJuIG5vcm1hbDtcclxufVxyXG4ke3BzfVxyXG4vLy0td215LS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxudm9pZCBtYWluX25vcm1hbCgpXHJcbntcclxuXHR2ZWMzIGdsb2JhbERpZmZ1c2U9dV9BbWJpZW50Q29sb3I7XHJcblx0I2lmZGVmIExJR0hUTUFQXHRcclxuXHRcdGdsb2JhbERpZmZ1c2UgKz0gRGVjb2RlTGlnaHRtYXAodGV4dHVyZTJEKHVfTGlnaHRNYXAsIHZfTGlnaHRNYXBVVikpO1xyXG5cdCNlbmRpZlxyXG5cdFxyXG5cdCNpZiBkZWZpbmVkKERJUkVDVElPTkxJR0hUKXx8ZGVmaW5lZChQT0lOVExJR0hUKXx8ZGVmaW5lZChTUE9UTElHSFQpXHJcblx0XHR2ZWMzIG5vcm1hbDtcclxuXHRcdCNpZiAoZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKSkmJmRlZmluZWQoTk9STUFMTUFQKVxyXG5cdFx0XHR2ZWMzIG5vcm1hbE1hcFNhbXBsZSA9IHRleHR1cmUyRCh1X05vcm1hbFRleHR1cmUsIHZfVGV4Y29vcmQwKS5yZ2I7XHJcblx0XHRcdG5vcm1hbCA9IG5vcm1hbGl6ZShOb3JtYWxTYW1wbGVUb1dvcmxkU3BhY2Uobm9ybWFsTWFwU2FtcGxlLCB2X05vcm1hbCwgdl9UYW5nZW50LHZfQmlub3JtYWwpKTtcclxuXHRcdCNlbHNlXHJcblx0XHRcdG5vcm1hbCA9IG5vcm1hbGl6ZSh2X05vcm1hbCk7XHJcblx0XHQjZW5kaWZcclxuXHRcdHZlYzMgdmlld0Rpcj0gbm9ybWFsaXplKHZfVmlld0Rpcik7XHJcblx0I2VuZGlmXHJcblx0XHJcblx0dmVjNCBtYWluQ29sb3I9dV9EaWZmdXNlQ29sb3I7XHJcblx0I2lmZGVmIERJRkZVU0VNQVBcclxuXHRcdHZlYzQgZGlmVGV4Q29sb3I9dGV4dHVyZTJEKHVfRGlmZnVzZVRleHR1cmUsIHZfVGV4Y29vcmQwKTtcclxuXHRcdG1haW5Db2xvcj1tYWluQ29sb3IqZGlmVGV4Q29sb3I7XHJcblx0I2VuZGlmIFxyXG5cdCNpZiBkZWZpbmVkKENPTE9SKSYmZGVmaW5lZChFTkFCTEVWRVJURVhDT0xPUilcclxuXHRcdG1haW5Db2xvcj1tYWluQ29sb3Iqdl9Db2xvcjtcclxuXHQjZW5kaWYgXHJcbiAgICBcclxuXHQjaWZkZWYgQUxQSEFURVNUXHJcblx0XHRpZihtYWluQ29sb3IuYTx1X0FscGhhVGVzdFZhbHVlKVxyXG5cdFx0XHRkaXNjYXJkO1xyXG5cdCNlbmRpZlxyXG4gIFxyXG5cdHZlYzMgZGlmZnVzZSA9IHZlYzMoMC4wKTtcclxuXHR2ZWMzIHNwZWN1bGFyPSB2ZWMzKDAuMCk7XHJcblx0I2lmIGRlZmluZWQoRElSRUNUSU9OTElHSFQpfHxkZWZpbmVkKFBPSU5UTElHSFQpfHxkZWZpbmVkKFNQT1RMSUdIVClcclxuXHRcdHZlYzMgZGlmLHNwZTtcclxuXHRcdCNpZmRlZiBTUEVDVUxBUk1BUFxyXG5cdFx0XHR2ZWMzIGdsb3NzPXRleHR1cmUyRCh1X1NwZWN1bGFyVGV4dHVyZSwgdl9UZXhjb29yZDApLnJnYjtcclxuXHRcdCNlbHNlXHJcblx0XHRcdCNpZmRlZiBESUZGVVNFTUFQXHJcblx0XHRcdFx0dmVjMyBnbG9zcz12ZWMzKGRpZlRleENvbG9yLmEpO1xyXG5cdFx0XHQjZWxzZVxyXG5cdFx0XHRcdHZlYzMgZ2xvc3M9dmVjMygxLjApO1xyXG5cdFx0XHQjZW5kaWZcclxuXHRcdCNlbmRpZlxyXG5cdCNlbmRpZlxyXG5cclxuXHQjaWZkZWYgRElSRUNUSU9OTElHSFRcclxuXHRcdExheWFBaXJCbGlublBob25nRGllY3Rpb25MaWdodCh1X01hdGVyaWFsU3BlY3VsYXIsdV9TaGluaW5lc3Msbm9ybWFsLGdsb3NzLHZpZXdEaXIsdV9EaXJlY3Rpb25MaWdodCxkaWYsc3BlKTtcclxuXHRcdGRpZmZ1c2UrPWRpZjtcclxuXHRcdHNwZWN1bGFyKz1zcGU7XHJcblx0I2VuZGlmXHJcbiBcclxuXHQjaWZkZWYgUE9JTlRMSUdIVFxyXG5cdFx0TGF5YUFpckJsaW5uUGhvbmdQb2ludExpZ2h0KHZfUG9zaXRpb25Xb3JsZCx1X01hdGVyaWFsU3BlY3VsYXIsdV9TaGluaW5lc3Msbm9ybWFsLGdsb3NzLHZpZXdEaXIsdV9Qb2ludExpZ2h0LGRpZixzcGUpO1xyXG5cdFx0ZGlmZnVzZSs9ZGlmO1xyXG5cdFx0c3BlY3VsYXIrPXNwZTtcclxuXHQjZW5kaWZcclxuXHJcblx0I2lmZGVmIFNQT1RMSUdIVFxyXG5cdFx0TGF5YUFpckJsaW5uUGhvbmdTcG90TGlnaHQodl9Qb3NpdGlvbldvcmxkLHVfTWF0ZXJpYWxTcGVjdWxhcix1X1NoaW5pbmVzcyxub3JtYWwsZ2xvc3Msdmlld0Rpcix1X1Nwb3RMaWdodCxkaWYsc3BlKTtcclxuXHRcdGRpZmZ1c2UrPWRpZjtcclxuXHRcdHNwZWN1bGFyKz1zcGU7XHJcblx0I2VuZGlmXHJcblx0XHJcblx0I2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuXHRcdGZsb2F0IHNoYWRvd1ZhbHVlID0gMS4wO1xyXG5cdFx0I2lmZGVmIFNIQURPV01BUF9QU1NNM1xyXG5cdFx0XHRzaGFkb3dWYWx1ZSA9IGdldFNoYWRvd1BTU00zKCB1X3NoYWRvd01hcDEsdV9zaGFkb3dNYXAyLHVfc2hhZG93TWFwMyx1X2xpZ2h0U2hhZG93VlAsdV9zaGFkb3dQU1NNRGlzdGFuY2UsdV9zaGFkb3dQQ0ZvZmZzZXQsdl9Qb3NpdGlvbldvcmxkLHZfcG9zVmlld1osMC4wMDEpO1xyXG5cdFx0I2VuZGlmXHJcblx0XHQjaWZkZWYgU0hBRE9XTUFQX1BTU00yXHJcblx0XHRcdHNoYWRvd1ZhbHVlID0gZ2V0U2hhZG93UFNTTTIoIHVfc2hhZG93TWFwMSx1X3NoYWRvd01hcDIsdV9saWdodFNoYWRvd1ZQLHVfc2hhZG93UFNTTURpc3RhbmNlLHVfc2hhZG93UENGb2Zmc2V0LHZfUG9zaXRpb25Xb3JsZCx2X3Bvc1ZpZXdaLDAuMDAxKTtcclxuXHRcdCNlbmRpZiBcclxuXHRcdCNpZmRlZiBTSEFET1dNQVBfUFNTTTFcclxuXHRcdFx0c2hhZG93VmFsdWUgPSBnZXRTaGFkb3dQU1NNMSggdV9zaGFkb3dNYXAxLHZfbGlnaHRNVlBQb3MsdV9zaGFkb3dQU1NNRGlzdGFuY2UsdV9zaGFkb3dQQ0ZvZmZzZXQsdl9wb3NWaWV3WiwwLjAwMSk7XHJcblx0XHQjZW5kaWZcclxuXHRcdC8vZ2xfRnJhZ0NvbG9yID12ZWM0KG1haW5Db2xvci5yZ2IqKGdsb2JhbERpZmZ1c2UgKyBkaWZmdXNlKSpzaGFkb3dWYWx1ZSxtYWluQ29sb3IuYSk7XHJcblx0XHQvL2dsX0ZyYWdDb2xvciA9IHdteU1haW4obWFpbkNvbG9yLChnbG9iYWxEaWZmdXNlICsgZGlmZnVzZSAqIHNoYWRvd1ZhbHVlICogMS4xKSk7XHJcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gd215TWFpbihtYWluQ29sb3IsZ2xvYmFsRGlmZnVzZSxkaWZmdXNlLHNoYWRvd1ZhbHVlKTtcclxuXHQjZWxzZVxyXG5cdFx0Ly9nbF9GcmFnQ29sb3IgPXZlYzQobWFpbkNvbG9yLnJnYiooZ2xvYmFsRGlmZnVzZSArIGRpZmZ1c2UpLG1haW5Db2xvci5hKTtcclxuXHRcdGdsX0ZyYWdDb2xvciA9IHdteU1haW4obWFpbkNvbG9yLGdsb2JhbERpZmZ1c2UsZGlmZnVzZSwxLjApO1xyXG5cdCNlbmRpZlxyXG4gICAgLypcclxuXHQjaWYgZGVmaW5lZChESVJFQ1RJT05MSUdIVCl8fGRlZmluZWQoUE9JTlRMSUdIVCl8fGRlZmluZWQoU1BPVExJR0hUKVxyXG5cdFx0I2lmZGVmIFJFQ0VJVkVTSEFET1dcclxuXHRcdFx0Z2xfRnJhZ0NvbG9yLnJnYis9c3BlY3VsYXIqc2hhZG93VmFsdWU7XHJcblx0XHQjZWxzZVxyXG5cdFx0XHRnbF9GcmFnQ29sb3IucmdiKz1zcGVjdWxhcjtcclxuXHRcdCNlbmRpZlxyXG5cdCNlbmRpZlxyXG5cdCovXHJcblx0I2lmZGVmIEZPR1xyXG5cdFx0ZmxvYXQgbGVycEZhY3Q9Y2xhbXAoKDEuMC9nbF9GcmFnQ29vcmQudy11X0ZvZ1N0YXJ0KS91X0ZvZ1JhbmdlLDAuMCwxLjApO1xyXG5cdFx0Z2xfRnJhZ0NvbG9yLnJnYj1taXgoZ2xfRnJhZ0NvbG9yLnJnYix1X0ZvZ0NvbG9yLGxlcnBGYWN0KTtcclxuXHQjZW5kaWZcclxufVxyXG5cclxudm9pZCBtYWluKClcclxue1xyXG5cdCNpZmRlZiBDQVNUU0hBRE9XXHRcdFxyXG5cdFx0bWFpbl9jYXN0U2hhZG93KCk7XHJcblx0I2Vsc2VcclxuXHRcdG1haW5fbm9ybWFsKCk7XHJcblx0I2VuZGlmICBcclxufVxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgcmV0dXJuIF9QcztcclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlX1dteVNoYWRlciBmcm9tIFwiLi9CYXNlX1dteVNoYWRlclwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlMYXlhX3dteUxidCBleHRlbmRzIEJhc2VfV215U2hhZGVyIHtcclxuICAgIHB1YmxpYyBpbml0KCl7XHJcbiAgICAgICAgdGhpcy5fc2hhZGVyTmFtZT10aGlzLmNvbnN0cnVjdG9yWyduYW1lJ107XHJcbiAgICAgICAgdGhpcy5fdW5pZm9ybU1hcD17XHJcblx0XHRcdCdfd0NvbG9yJzpbMTAwMF0sXHJcblx0XHRcdCdfU3BlY3VsYXInOlsxMDAxXSxcclxuXHRcdFx0J19HbG9zcyc6WzEwMDJdLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHZzcHNBcnI9W107XHJcbiAgICAgICAgLy9wYXNzMC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxudnNwc0FyclswXT1bXTtcclxuLy92c1xyXG52c3BzQXJyWzBdWzBdPWBcclxudW5pZm9ybSB2ZWM0IF93Q29sb3I7XHJcbnVuaWZvcm0gbWF0NCBfT2JqZWN0MldvcmxkO1xyXG51bmlmb3JtIHZlYzQgX1NwZWN1bGFyO1xyXG51bmlmb3JtIGZsb2F0IF9HbG9zcztcclxuXHJcbnZhcnlpbmcgdmVjMyBnX3dvcmxkTm9ybWFsO1xyXG52YXJ5aW5nIHZlYzMgZ193b3JsZFZpZXdEaXI7XHJcblxyXG52b2lkIHdteU1haW4oKXtcclxuXHJcbiAgICBnX3dvcmxkTm9ybWFsID0gdl9Ob3JtYWw7XHJcbiAgICBnX3dvcmxkTm9ybWFsLngqPS0xLjA7XHJcblx0Z193b3JsZFZpZXdEaXIgPSB2X1ZpZXdEaXI7XHJcblxyXG59XHJcbmBcclxuLy9wc1xyXG52c3BzQXJyWzBdWzFdPWBcclxudW5pZm9ybSB2ZWM0IF93Q29sb3I7XHJcbnVuaWZvcm0gbWF0NCBfT2JqZWN0MldvcmxkO1xyXG51bmlmb3JtIHZlYzQgX1NwZWN1bGFyO1xyXG51bmlmb3JtIGZsb2F0IF9HbG9zcztcclxuXHJcbnZhcnlpbmcgdmVjMyBnX3dvcmxkTm9ybWFsO1xyXG52YXJ5aW5nIHZlYzMgZ193b3JsZFZpZXdEaXI7XHJcblxyXG52ZWM0IHdteU1haW4odmVjNCBfbWFpbkNvbG9yLCB2ZWMzIF9nbG9iYWxEaWZmdXNlLCB2ZWMzIF9kaWZmdXNlLCBmbG9hdCBzaGFkb3dWYWx1ZSl7XHJcbiAgICB2ZWM0IHdteUNvbG9yPV9tYWluQ29sb3I7XHJcblxyXG5cdHZlYzMgYW1iaWVudCA9dV9BbWJpZW50Q29sb3IvMi4wO1xyXG5cdHZlYzMgbGlnaHREaXIgPSBub3JtYWxpemUoLXVfRGlyZWN0aW9uTGlnaHQuRGlyZWN0aW9uLnh5eik7XHJcblx0ZmxvYXQgaGFsZkxhbWJlcnQgPSBkb3QoZ193b3JsZE5vcm1hbCwgbGlnaHREaXIpICogMC41ICsgMS4wO1xyXG5cdHZlYzMgZGlmZnVzZSA9IHVfRGlyZWN0aW9uTGlnaHQuQ29sb3IucmdiICogaGFsZkxhbWJlcnQgKl93Q29sb3IucmdiO1xyXG5cdFx0XHRcdFxyXG5cdHZlYzMgY29sb3IgPSBkaWZmdXNlO1xyXG5cclxuXHR2ZWMzIHZpZXdEaXIgPSBub3JtYWxpemUoZ193b3JsZFZpZXdEaXIpO1xyXG5cdHZlYzMgaGFsZkRpciA9IG5vcm1hbGl6ZSh2aWV3RGlyICsgbGlnaHREaXIpO1xyXG5cdHZlYzMgc3BlY3VsYXIgPSB2ZWMzKDAuMCk7XHJcblx0c3BlY3VsYXIgPSBfU3BlY3VsYXIucmdiICogcG93KG1heChkb3QoZ193b3JsZE5vcm1hbCwgaGFsZkRpciksIDAuMCksIF9HbG9zcyk7XHJcblx0Y29sb3IgKz0gc3BlY3VsYXI7XHJcblxyXG4gICAgY29sb3IgKj0gMS41O1xyXG4gICAgY29sb3IrPXNoYWRvd1ZhbHVlKjAuMTtcclxuXHR3bXlDb2xvciA9IHZlYzQoY29sb3IsIDEuMCk7XHJcblxyXG4vL1xyXG5yZXR1cm4gd215Q29sb3I7XHJcbn1cclxuYFxyXG4vL+a4suafk+aooeW8j1xyXG52c3BzQXJyWzBdWzJdPXt9O1xyXG5cclxuICAgICAgICAvL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdnNwc0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB2c3BzID0gdnNwc0FycltpXTtcclxuICAgICAgICAgICAgdGhpcy5vblNldFZzUHModnNwc1swXSwgdnNwc1sxXSwgdnNwc1syXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215U2hhZGVyTWFne1xyXG4gICAgcHJpdmF0ZSBvYmo7XHJcblx0Y29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLm9iaj1yZXF1aXJlKCcuL1dteUxheWFfd215TGJ0JylbJ2RlZmF1bHQnXTtpZih0aGlzLm9iailuZXcgdGhpcy5vYmooKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH1cclxufSIsIi8qd21554mI5pysXzIwMTgvMTIvMzAvKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215VTNkSW1wb3J0IHtcbnB1YmxpYyBzdGF0aWMgVHNfRExpZ2h0PXJlcXVpcmUoJy4vdHMvVHNfRExpZ2h0JylbJ2RlZmF1bHQnXTtcbnB1YmxpYyBzdGF0aWMgVHNfU2NlbmU9cmVxdWlyZSgnLi90cy9Uc19TY2VuZScpWydkZWZhdWx0J107XG5wdWJsaWMgc3RhdGljIFRzX0M0RFZldGV4QW5pbWF0b3I9cmVxdWlyZSgnLi90cy9Uc19DNERWZXRleEFuaW1hdG9yJylbJ2RlZmF1bHQnXTtcbnB1YmxpYyBzdGF0aWMgVHNfTWF0cz1yZXF1aXJlKCcuL3RzL1RzX01hdHMnKVsnZGVmYXVsdCddO1xyXG4vL+aJqeWxlVxyXG5wdWJsaWMgc3RhdGljIFdteUM0RFZldGV4QW5pbWF0b3I9cmVxdWlyZSgnLi4vX3dteVV0aWxzSDUvZDMvYzRkL1dteUM0RFZldGV4QW5pbWF0b3InKVsnZGVmYXVsdCddO1xyXG5wdWJsaWMgc3RhdGljIFdteVBoeXNpY3NfQ2hhcmFjdGVyPXJlcXVpcmUoJy4uL193bXlVdGlsc0g1L2QzL3BoeXNpY3MvV215UGh5c2ljc1dvcmxkX0NoYXJhY3RlcicpWydkZWZhdWx0J107XHJcbi8vTGF5YVxyXG5wdWJsaWMgc3RhdGljIEFuaW1hdG9yPUxheWEuQW5pbWF0b3I7XHJcbi8vXHJcbnB1YmxpYyBzdGF0aWMgZ2V0Q2xhc3MobmFtZSl7XHJcbiAgICByZXR1cm4gdGhpc1tuYW1lXTtcclxufVxyXG59XHJcbiIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlVM2RUc0NvbmZpZyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHRzQ29uZmlnPVtcbntcImNfdHNcIjpcIlRzX01hdHNcIixcblwidGFyZ2V0VXJsQXJyXCI6W1xue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM1X0MyVV9cXHU1RTczXFx1OTc2MjFfMTUvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMxX0MyVV9cXHU1RTczXFx1OTc2MjFfMTEvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ2X0MyVV9cXHU1RTczXFx1OTc2MjFfMjYvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI4X0MyVV9cXHU1RTczXFx1OTc2MjFfOC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzBfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjBfQzJVX1xcdTVFNzNcXHU5NzYyMS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzNfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMy93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjZfQzJVX1xcdTVFNzNcXHU5NzYyMV82L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zMl9DMlVfXFx1NUU3M1xcdTk3NjIxXzEyL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yM19DMlVfXFx1NUU3M1xcdTk3NjIxXzMvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI5X0MyVV9cXHU1RTczXFx1OTc2MjFfOS93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovNDlfQzJVX1xcdTVDOUIxLzIyMF9DMlVfXFx1NUM3MS8yMjJfQzJVX3NoYW5fMVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yNF9DMlVfXFx1NUU3M1xcdTk3NjIxXzQvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQyX0MyVV9cXHU1RTczXFx1OTc2MjFfMjIvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI3X0MyVV9cXHU1RTczXFx1OTc2MjFfNy93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDdfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNy93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDRfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzhfQzJVX1xcdTVFNzNcXHU5NzYyMV8xOC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjVfQzJVX1xcdTVFNzNcXHU5NzYyMV81L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zNl9DMlVfXFx1NUU3M1xcdTk3NjIxXzE2L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMl9DMlVfXFx1NUU3M1xcdTk3NjIxXzIvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS8yMjBfQzJVX1xcdTVDNzEvMjIzX0MyVV9zaGFuXzNcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDBfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzdfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNy93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDhfQzJVX1xcdTVFNzNcXHU5NzYyMV8yOC93bXlWZXRleF9tYWx1LzFfQzJVX21hbHVcIixcblwiaW5pdERhdGFcIjp7XCJpc0Nhc3RTaGFkb3dcIjpcIlRydWVcIixcblwiaXNSZWNlaXZlU2hhZG93XCI6XCJGYWxzZVwifX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjFfQzJVX1xcdTVFNzNcXHU5NzYyMV8xL3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai80OV9DMlVfXFx1NUM5QjEvMjIwX0MyVV9cXHU1QzcxLzIyNF9DMlVfc2hhbl80XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzQ5X0MyVV9cXHU1QzlCMS8yMjBfQzJVX1xcdTVDNzEvMjIxX0MyVV9zaGFuXzJfMVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80NV9DMlVfXFx1NUU3M1xcdTk3NjIxXzI1L3dteVZldGV4X21hbHUvMV9DMlVfbWFsdVwiLFxuXCJpbml0RGF0YVwiOntcImlzQ2FzdFNoYWRvd1wiOlwiVHJ1ZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIkZhbHNlXCJ9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai80OV9DMlVfXFx1NUM5QjEvNTBfQzJVX2Rhb18xXCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJGYWxzZVwiLFxuXCJpc1JlY2VpdmVTaGFkb3dcIjpcIlRydWVcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM0X0MyVV9cXHU1RTczXFx1OTc2MjFfMTQvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM5X0MyVV9cXHU1RTczXFx1OTc2MjFfMTkvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQxX0MyVV9cXHU1RTczXFx1OTc2MjFfMjEvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQzX0MyVV9cXHU1RTczXFx1OTc2MjFfMjMvd215VmV0ZXhfbWFsdS8xX0MyVV9tYWx1XCIsXG5cImluaXREYXRhXCI6e1wiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCIsXG5cImlzUmVjZWl2ZVNoYWRvd1wiOlwiRmFsc2VcIn19XG5dfSxcbntcImNfdHNcIjpcIlRzX0M0RFZldGV4QW5pbWF0b3JcIixcblwidGFyZ2V0VXJsQXJyXCI6W1xue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI1X0MyVV9cXHU1RTczXFx1OTc2MjFfNS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQyX0MyVV9cXHU1RTczXFx1OTc2MjFfMjIvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80MF9DMlVfXFx1NUU3M1xcdTk3NjIxXzIwL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjJfQzJVX1xcdTVFNzNcXHU5NzYyMV8yL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzdfQzJVX1xcdTVFNzNcXHU5NzYyMV8xNy93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzIzX0MyVV9cXHU1RTczXFx1OTc2MjFfMy93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzI2X0MyVV9cXHU1RTczXFx1OTc2MjFfNi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQxX0MyVV9cXHU1RTczXFx1OTc2MjFfMjEvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yMF9DMlVfXFx1NUU3M1xcdTk3NjIxL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjFfQzJVX1xcdTVFNzNcXHU5NzYyMV8xL3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjlfQzJVX1xcdTVFNzNcXHU5NzYyMV85L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDVfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNS93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMxX0MyVV9cXHU1RTczXFx1OTc2MjFfMTEvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yN19DMlVfXFx1NUU3M1xcdTk3NjIxXzcvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80NF9DMlVfXFx1NUU3M1xcdTk3NjIxXzI0L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDNfQzJVX1xcdTVFNzNcXHU5NzYyMV8yMy93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzMwX0MyVV9cXHU1RTczXFx1OTc2MjFfMTAvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zNV9DMlVfXFx1NUU3M1xcdTk3NjIxXzE1L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMjRfQzJVX1xcdTVFNzNcXHU5NzYyMV80L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzNfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMy93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM4X0MyVV9cXHU1RTczXFx1OTc2MjFfMTgvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8yOF9DMlVfXFx1NUU3M1xcdTk3NjIxXzgvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zOV9DMlVfXFx1NUU3M1xcdTk3NjIxXzE5L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvNDdfQzJVX1xcdTVFNzNcXHU5NzYyMV8yNy93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzM0X0MyVV9cXHU1RTczXFx1OTc2MjFfMTQvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS8zNl9DMlVfXFx1NUU3M1xcdTk3NjIxXzE2L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX0sXG57XCJ1cmxcIjpcInNjZW5lLzFfQzJVX1xcdTRFM0JcXHU1NzNBXFx1NjY2Ri84X0MyVV9jaGFuZ2ovMThfQzJVX1xcdThERUYvMTlfQzJVX21hbHUvMzJfQzJVX1xcdTVFNzNcXHU5NzYyMV8xMi93bXlWZXRleF9tYWx1XCIsXG5cImluaXREYXRhXCI6e319LFxue1widXJsXCI6XCJzY2VuZS8xX0MyVV9cXHU0RTNCXFx1NTczQVxcdTY2NkYvOF9DMlVfY2hhbmdqLzE4X0MyVV9cXHU4REVGLzE5X0MyVV9tYWx1LzQ2X0MyVV9cXHU1RTczXFx1OTc2MjFfMjYvd215VmV0ZXhfbWFsdVwiLFxuXCJpbml0RGF0YVwiOnt9fSxcbntcInVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzhfQzJVX2NoYW5nai8xOF9DMlVfXFx1OERFRi8xOV9DMlVfbWFsdS80OF9DMlVfXFx1NUU3M1xcdTk3NjIxXzI4L3dteVZldGV4X21hbHVcIixcblwiaW5pdERhdGFcIjp7fX1cbl19LFxue1wiY190c1wiOlwiVHNfU2NlbmVcIixcblwidGFyZ2V0VXJsQXJyXCI6W1xue1widXJsXCI6XCJzY2VuZVwiLFxuXCJpbml0RGF0YVwiOnt9fVxuXX0sXG57XCJjX3RzXCI6XCJUc19ETGlnaHRcIixcblwidGFyZ2V0VXJsQXJyXCI6W1xue1widXJsXCI6XCJEaXJlY3Rpb25hbCBsaWdodFwiLFxuXCJpbml0RGF0YVwiOntcImNhbWVyYVVybFwiOlwic2NlbmUvMV9DMlVfXFx1NEUzQlxcdTU3M0FcXHU2NjZGLzRfQzJVX1xcdThGNjhcXHU4RkY5XFx1NTJBOFxcdTc1M0IvNV9DMlVfc2hleGlhbmdqaS82X0MyVV9cXHU2NDQ0XFx1NTBDRlxcdTY3M0FcIixcblwiaXNDYXN0U2hhZG93XCI6XCJUcnVlXCJ9fVxuXX1cbl07XHJcbn1cclxuIiwiLyp3bXnniYjmnKxfMjAxOC8xMi8yOC8xMzoxOSovXHJcbmltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSAnLi4vX3dteVV0aWxzSDUvZDMvV215U2NyaXB0M0QnO1xyXG5pbXBvcnQgV215VTNkVHNDb25maWcgZnJvbSAnLi9XbXlVM2RUc0NvbmZpZyc7XHJcbmltcG9ydCBXbXlVM2RJbXBvcnQgZnJvbSAnLi9XbXlVM2RJbXBvcnQnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlVM2RUc01hZyBleHRlbmRzIFdteVNjcmlwdDNEIHtcclxuICAgIHB1YmxpYyBvbkF3YWtlKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgV215VTNkVHNDb25maWcudHNDb25maWcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdHNPYmogPSBXbXlVM2RUc0NvbmZpZy50c0NvbmZpZ1tpXTtcclxuICAgICAgICAgICAgdGhpcy5hZGRUcyh0c09iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYWRkVHMoY29uZmlnT2JqKXtcclxuICAgICAgICBpZihjb25maWdPYmo9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBjX3RzPWNvbmZpZ09ialsnY190cyddO1xyXG4gICAgICAgIHZhciB0cz1XbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoY190cyk7XHJcbiAgICAgICAgdmFyIHRhcmdldFVybEFycjpzdHJpbmc9Y29uZmlnT2JqWyd0YXJnZXRVcmxBcnInXTtcclxuICAgICAgICBpZighdGFyZ2V0VXJsQXJyIHx8ICF0cylyZXR1cm47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXRVcmxBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0VXJsRGF0YSA9IHRhcmdldFVybEFycltpXTtcclxuICAgICAgICAgICAgdmFyIHVybD10YXJnZXRVcmxEYXRhWyd1cmwnXTtcclxuICAgICAgICAgICAgdmFyIHRhcmdldD1XbXlVM2RUc01hZy5nZXRPYmozZFVybCh0aGlzLnNjZW5lM0QsdXJsKTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0IT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdUcz10YXJnZXQuYWRkQ29tcG9uZW50KHRzKTtcclxuICAgICAgICAgICAgICAgIHZhciBpbml0RGF0YT10YXJnZXRVcmxEYXRhWydpbml0RGF0YSddO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGluaXREYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1RzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFZhbHVlOmFueT1pbml0RGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighaXNOYU4oVmFsdWUpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKFZhbHVlLmluZGV4T2YoJy4nKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWU9cGFyc2VGbG9hdChWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlPXBhcnNlSW50KFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoVmFsdWUuaW5kZXhPZignVHJ1ZScpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWYWx1ZT10cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihWYWx1ZS5pbmRleE9mKCdGYWxzZScpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWYWx1ZT1mYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdUc1trZXldID0gVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmozZFVybCh0YXJnZXQsdXJsOnN0cmluZyl7XHJcbiAgICAgICAgdmFyIGFyclVybD11cmwuc3BsaXQoJy8nKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0T2JqQXJyVXJsKHRhcmdldCxhcnJVcmwpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIF9nZXRPYmpBcnJVcmwodGFyZ2V0LHVybEFycjpBcnJheTxzdHJpbmc+LGlkPTApe1xyXG4gICAgICAgIHZhciBfdGFyZ2V0OkxheWEuU3ByaXRlM0Q9dGFyZ2V0O1xyXG4gICAgICAgIGlmKF90YXJnZXQ9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIG5hPXVybEFycltpZF07XHJcbiAgICAgICAgdmFyIHRhcmdldE9iaj1fdGFyZ2V0LmdldENoaWxkQnlOYW1lKG5hKTtcclxuICAgICAgICBpZih0YXJnZXRPYmo9PW51bGwpcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYoaWQ+PXVybEFyci5sZW5ndGgtMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRPYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHRhcmdldE9iaj10aGlzLl9nZXRPYmpBcnJVcmwodGFyZ2V0T2JqLHVybEFyciwrK2lkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldE9iajtcclxuICAgIH1cclxufVxyXG4iLCIvKkM0ROmhtueCueWKqOeUuyovXG4vKndteeeJiOacrF8yMDE4LzEyLzI4Ki9cbmltcG9ydCBXbXlVM2RJbXBvcnQgZnJvbSAnLi4vV215VTNkSW1wb3J0JztcbmltcG9ydCB7IFdteVNjcmlwdDNEIH0gZnJvbSAnLi4vLi4vX3dteVV0aWxzSDUvZDMvV215U2NyaXB0M0QnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHNfQzREVmV0ZXhBbmltYXRvciBleHRlbmRzIFdteVNjcmlwdDNEIHtcblxuIF9jNGRWZXRleEFuaW1hdG9yOmFueTtcbiBfaW5pdFBsYXk6YW55PSBmYWxzZTtcbiBfYW5pcjphbnk7XG5wdWJsaWMgb25Bd2FrZSgpIHtcbiAvL3NldFNob3coZmFsc2UpO1xuIHRoaXMuX2M0ZFZldGV4QW5pbWF0b3IgPSB0aGlzLm93bmVyM0QuZ2V0Q29tcG9uZW50KFdteVUzZEltcG9ydC5nZXRDbGFzcygnV215QzREVmV0ZXhBbmltYXRvcicpKTtcbiBpZiAodGhpcy5fYzRkVmV0ZXhBbmltYXRvciA9PSBudWxsKSB7XG4gdGhpcy5fYzRkVmV0ZXhBbmltYXRvciA9IHRoaXMub3duZXIzRC5hZGRDb21wb25lbnQoV215VTNkSW1wb3J0LmdldENsYXNzKCdXbXlDNERWZXRleEFuaW1hdG9yJykpO1xuIH1cbiB0aGlzLl9hbmlyID0gdGhpcy5vd25lcjNELmdldENvbXBvbmVudChXbXlVM2RJbXBvcnQuZ2V0Q2xhc3MoJ0FuaW1hdG9yJykpO1xuIGlmICh0aGlzLl9hbmlyICE9IG51bGwpIHtcbiB0aGlzLl9pbml0UGxheSA9IGZhbHNlO1xuIHRoaXMuX2FuaXIuc3BlZWQgPSAwO1xuIHRoaXMuc2V0U2hvdyhmYWxzZSk7XG4gfVxuIFxuIH1cbnB1YmxpYyBvblByZVJlbmRlcigpIHtcbiBpZiAoIXRoaXMuX2luaXRQbGF5KSB7XG4gdmFyIHBhcmVudDphbnk9IHRoaXMub3duZXIzRC5wYXJlbnQ7XG4gaWYgKHBhcmVudC50cmFuc2Zvcm0ubG9jYWxTY2FsZS54ID4gMC4wMSB8fCBwYXJlbnQudHJhbnNmb3JtLmxvY2FsU2NhbGUueSA+IDAuMDEgfHwgcGFyZW50LnRyYW5zZm9ybS5sb2NhbFNjYWxlLnogPiAwLjAxKSB7XG4gdGhpcy5faW5pdFBsYXkgPSB0cnVlO1xuIHRoaXMuc2V0U2hvdyh0cnVlKTtcbiB0aGlzLl9hbmlyLnNwZWVkID0gMTtcbiB9XG4gfVxuIFxuIH1cbn1cbiIsIi8q55u057q/54Gv5YWJKi9cbi8qd21554mI5pysXzIwMTgvMTIvMjgqL1xuaW1wb3J0IFdteVUzZEltcG9ydCBmcm9tICcuLi9XbXlVM2RJbXBvcnQnO1xuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi8uLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUc19ETGlnaHQgZXh0ZW5kcyBXbXlTY3JpcHQzRCB7XG5cbiAgICBcbiAgICBwdWJsaWMgY2FtZXJhVXJsID0gXCJcIjtcbiAgICAvKuaYr+WQpuS6p+eUn+mYtOW9sSovXG4gICAgcHVibGljIGlzQ2FzdFNoYWRvdzogYW55ID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgY2FtZXJhOkxheWEuQ2FtZXJhO1xuICAgIHB1YmxpYyBkaXJlY3Rpb25MaWdodDpMYXlhLkRpcmVjdGlvbkxpZ2h0O1xuICAgIHB1YmxpYyBvblN0YXJ0KCkge1xuICAgICAgICB0aGlzLmNhbWVyYT10aGlzLmdldE9iajNkVXJsKHRoaXMuc2NlbmUzRCx0aGlzLmNhbWVyYVVybCk7XG5cbiAgICAgICAgdGhpcy5kaXJlY3Rpb25MaWdodD10aGlzLm93bmVyIGFzIExheWEuRGlyZWN0aW9uTGlnaHQ7XG4gICAgICAgIC8v54Gv5YWJ5byA5ZCv6Zi05b2xXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uTGlnaHQuc2hhZG93ID0gdGhpcy5pc0Nhc3RTaGFkb3c7XG4gICAgICAgIC8v55Sf5oiQ6Zi05b2x6LS05Zu+5bC65a+4XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uTGlnaHQuc2hhZG93UmVzb2x1dGlvbiA9IDE0MDA7XG4gICAgfVxuXG4gICAgcHVibGljIG9uVXBkYXRlKCl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvL+WPr+ingemYtOW9sei3neemu1xuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25MaWdodC5zaGFkb3dEaXN0YW5jZSA9IHRoaXMuY2FtZXJhLnRyYW5zZm9ybS5wb3NpdGlvbi55O1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsIi8q5p2Q6LSo5pWI5p6cKi9cbi8qd21554mI5pysXzIwMTgvMTIvMjgqL1xuaW1wb3J0IFdteVUzZEltcG9ydCBmcm9tICcuLi9XbXlVM2RJbXBvcnQnO1xuaW1wb3J0IHsgV215U2NyaXB0M0QgfSBmcm9tICcuLi8uLi9fd215VXRpbHNINS9kMy9XbXlTY3JpcHQzRCc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUc19NYXRzIGV4dGVuZHMgV215U2NyaXB0M0Qge1xuXG4gLyrmmK/lkKbkuqfnlJ/pmLTlvbEqL1xuIHB1YmxpYyBpc0Nhc3RTaGFkb3c6YW55PSBmYWxzZTtcbiAvKuaYr+WQpuaOpeaUtumYtOW9sSovXG4gcHVibGljIGlzUmVjZWl2ZVNoYWRvdzphbnk9IGZhbHNlO1xucHVibGljIG9uU3RhcnQoKSB7XG4gLyrorr7nva7pmLTlvbEqL1xuIHRoaXMub25TZXRTaGFkb3codGhpcy5pc0Nhc3RTaGFkb3csIHRoaXMuaXNSZWNlaXZlU2hhZG93KTtcbiBcbiB9XG4gfVxuIiwiLyrlnLrmma8qL1xuLyp3bXnniYjmnKxfMjAxOC8xMi8yOSovXG5pbXBvcnQgV215VTNkSW1wb3J0IGZyb20gJy4uL1dteVUzZEltcG9ydCc7XG5pbXBvcnQgeyBXbXlTY3JpcHQzRCB9IGZyb20gJy4uLy4uL193bXlVdGlsc0g1L2QzL1dteVNjcmlwdDNEJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRzX1NjZW5lIGV4dGVuZHMgV215U2NyaXB0M0Qge1xuXG4gX2FuaXI6YW55O1xucHVibGljIG9uU3RhcnQoKSB7XG4gdGhpcy5fYW5pciA9IHRoaXMub3duZXIzRC5nZXRDb21wb25lbnQoV215VTNkSW1wb3J0LmdldENsYXNzKCdBbmltYXRvcicpKTtcbiBpZiAodGhpcy5fYW5pciAhPSBudWxsKSB7XG4gdGhpcy5fYW5pci5zcGVlZCA9IDE7XG4gfVxuIFxuIH1cbiB9XG4iXX0=
