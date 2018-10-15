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
/*
* 游戏初始化配置;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.init = function () {
    };
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.startScene = "";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    return GameConfig;
}());
exports.default = GameConfig;
GameConfig.init();
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfig_1 = require("./GameConfig");
var WmyUtils3D_1 = require("./wmyUtilsH5/d3/WmyUtils3D");
var Wmy_Load_Mag_1 = require("./wmyUtilsH5/Wmy_Load_Mag");
var WmyTar_1 = require("./tar/WmyTar");
var Main = /** @class */ (function () {
    function Main() {
        if (window["Laya3D"])
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
        else
            Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        //设置水平对齐
        Laya.stage.alignH = "center";
        //设置垂直对齐
        Laya.stage.alignV = "middle";
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        WmyTar_1.default.getThis.init();
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        var wmyVTime = "";
        if (window != null && window["wmyVTime"] != null) {
            wmyVTime = window["wmyVTime"];
        }
        //Laya.ResourceVersion.enable("version.json"+wmyVTime, Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        var url = Laya.ResourceVersion.addVersionPrefix("res/loadInfo.json");
        Wmy_Load_Mag_1.Wmy_Load_Mag.getThis.onLoadWetData(url, Laya.Handler.create(this, this.onLoadLoad));
    };
    Main.prototype.onLoadLoad = function () {
        var resObj = Wmy_Load_Mag_1.Wmy_Load_Mag.getThis.getResObj("load");
        if (resObj != null) {
            Wmy_Load_Mag_1.Wmy_Load_Mag.getThis.onload(resObj, new Laya.Handler(this, this.onLoadMain));
        }
    };
    Main.prototype.onLoadMain = function () {
        this._loadView = fairygui.UIPackage.createObject("load", "Load").asCom;
        fairygui.GRoot.inst.addChild(this._loadView);
        this._bar = this._loadView.getChild("bar").asProgress;
        Wmy_Load_Mag_1.Wmy_Load_Mag.getThis.onAutoLoadAll(new Laya.Handler(this, this.onLoadOk), new Laya.Handler(this, this.onLoading));
    };
    Main.prototype.onLoading = function (progress) {
        this._bar.value = progress;
    };
    Main.prototype.onLoadOk = function (uiArr, u3dArr) {
        var _this = this;
        this._u3dArr = u3dArr;
        Laya.timer.once(400, this, function () {
            _this.onMain();
            fairygui.GRoot.inst.removeChild(_this._loadView);
            _this._loadView = null;
            _this._bar = null;
        });
        //添加3D场景
        if (u3dArr[0] != null) {
            var url3d = u3dArr[0].urlList[0];
            this.scene3D = Laya.loader.getRes(url3d);
            WmyUtils3D_1.WmyUtils3D.setShaderAll(this.scene3D, "res/mats/", "res/shaders/");
        }
    };
    Main.prototype.onMain = function () {
        this._mainView = fairygui.UIPackage.createObject("main", "Main").asCom;
        if (this._mainView != null) {
            fairygui.GRoot.inst.addChild(this._mainView);
            var _Main = this._mainView.getChild("_Main").asCom;
            var _d3 = _Main.getChild("d3").asCom;
            if (this.scene3D != null) {
                _d3.displayObject.addChild(this.scene3D);
            }
        }
    };
    return Main;
}());
//激活启动类
new Main();
},{"./GameConfig":1,"./tar/WmyTar":3,"./wmyUtilsH5/Wmy_Load_Mag":5,"./wmyUtilsH5/d3/WmyUtils3D":9}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyTar = /** @class */ (function () {
    function WmyTar() {
    }
    Object.defineProperty(WmyTar, "getThis", {
        get: function () {
            if (WmyTar._this == null) {
                WmyTar._this = new WmyTar();
            }
            return WmyTar._this;
        },
        enumerable: true,
        configurable: true
    });
    WmyTar.prototype.init = function () {
        var _this_1 = this;
        this._render = new TAR.Render();
        this._ar = new TAR.AR();
        this._engine = new TAR.Engine();
        // render初始化，运行主循环
        this._render.init();
        if (TAR.ENV.IOS) {
            this.ARInit();
        }
        else if (TAR.ENV.ANDROID) {
            // android AR的能力需要下载才有
            /**
             * STATUS_CHANGE方法注册4个与引擎状态相关的callback函数start, loading, success, fail
             */
            TAR.TARUtils.STATUS_CHANGE(null, null, function () {
                // close native progress after download native ar engine
                //NATIVE_RROGRESS_CLOSE();
            }, function () {
                console.log('Init AR fail. Platform android. download engine error');
            });
            // vr display 必须首先加载，android在x5内核里已经有，ios需要引用WebARonARkit
            // android AR的能力需要下载才有，但是摄像头能力不需要下载引擎，所以render可以提前进行；ios本身就有各种能力，slam、markerless沿用arkit的，marker base是武汉自研的，其中的addMarker需要终端添加的
            TAR.AR.initAREngine({
                type: 2
            }, function () {
                _this_1._ar.setEngineDownload(true);
                console.log('Init AR success. Platform android. AR Engine download success, you can use ability of tar ');
            }, function () {
                console.log('Init AR fail. Platform android. init fail');
            });
            this.ARInit();
        }
    };
    WmyTar.prototype.ARInit = function () {
        var _this_1 = this;
        this._ar.load().then(function (display) {
            _this_1._render.setVRDisplay(display);
            _this_1._engine.create('Laya');
            /**
             * ar引擎加载，load函数有3个参数，后两个为回调函数onStartCallback和onCompleteCallback
             */
            _this_1._engine.load(display, null, function () {
                // task = new Task(ar, render, engine);
                var run = function (preState, nextState) {
                    // task.run(preState, nextState);
                };
                // if (ar.getCurrentState() === 'normal') {
                //     run();
                // } else {
                //     /**
                //      *  将run callback注册到ar的状态转移函数中，
                //      *  当调用ar.onTarStateChanged('normal')或者 ar.onTarStateChanged('limited') ， run会触发，
                //      *  所以run函数要做不同状态间转换处理
                //      */
                //     ar.setNotAvailable2NormalFunc(run);
                //     ar.setLimited2NormalFunc(run);
                // }
            });
        })
            .catch(function (e) {
            console.log("exception = " + e);
        });
    };
    return WmyTar;
}());
exports.default = WmyTar;
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
                if (resUrl.indexOf(".ls") >= 0) {
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
            callbackOk.runWith([data]);
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
    return Wmy_Load_Mag;
}());
exports.Wmy_Load_Mag = Wmy_Load_Mag;
},{"./WmyUtils":4,"./d3/WmyLoad3d":6,"./d3/WmyLoadMats":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyLoad3d = /** @class */ (function () {
    function WmyLoad3d() {
        this._mArr = [];
        this._mNum = 0;
        this._mP = 0;
        this._mP2 = 0;
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
        var _this_1 = this;
        var _urlList = [];
        this._callbackOk = callbackOk;
        this._callbackProgress = callbackProgress;
        for (var i = 0; i < urlList.length; i++) {
            var url = urlList[i];
            url = Laya.ResourceVersion.addVersionPrefix(url);
            _urlList.push(url);
            // obj["url"]+="?wmy";
        }
        var pnum = 0;
        var pNum = 0;
        var isP = false;
        var _Progress = function (p) {
            // console.log(p);
            pnum += 0.01;
            // if(isP){
            //     pNum = pnum+(p)*0.9;
            // }
            // else{
            //     pNum = pnum;
            // }
            // if(pnum>=0.1 || p==1){
            //     isP=true;
            // }
            if (pnum > 1)
                pnum = 1;
            if (_this_1._callbackProgress != null) {
                _this_1._callbackProgress.runWith([pnum]);
            }
        };
        var _onOk = function () {
            if (_this_1._callbackOk != null) {
                _this_1._callbackOk.run();
            }
        };
        Laya.loader.create(_urlList, new Laya.Handler(null, _onOk), Laya.Handler.create(null, _Progress, null, false));
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
        for (var i = 0; i < this._mArr.length; i++) {
            url = this._mArr[i];
            Laya.loader.create(url, Laya.Handler.create(this, this.__onArrOk), Laya.Handler.create(this, this.__onArrP));
        }
    };
    WmyLoad3d.prototype.__onArrP = function (p) {
        var pNum = p * (this._mNum + 1);
        if (pNum > this._mP)
            this._mP = pNum;
        this._mP2 = (this._mP / this._mArr.length);
        var pNum = (this._mP2) * 0.98;
        if (this._callbackProgress != null) {
            this._callbackProgress.runWith([pNum]);
        }
    };
    WmyLoad3d.prototype.__onArrOk = function () {
        var _this_1 = this;
        this._mNum += 1;
        if (this._mNum >= this._mArr.length) {
            Laya.loader.create(this._urlList, Laya.Handler.create(this, function () {
                if (_this_1._callbackOk != null) {
                    _this_1._callbackOk.run();
                }
            }));
        }
    };
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
    return WmyLoad3d;
}());
exports.WmyLoad3d = WmyLoad3d;
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WmyShaderMsg = /** @class */ (function () {
    function WmyShaderMsg() {
    }
    /**
     * @param	target	对象
     * @param	mat	材质
     * @param	shaderUrl	shader的地址
     * @param	isNewMateria	是否新材质
     */
    WmyShaderMsg.setShader = function (target, mat, shaderUrl, isNewMateria, pData) {
        if (isNewMateria === void 0) { isNewMateria = false; }
        var renderer;
        var sharedMaterial;
        if (target instanceof Laya.SkinnedMeshSprite3D) {
            renderer = target.skinnedMeshRenderer;
            if (renderer == null)
                return;
            sharedMaterial = renderer.sharedMaterial;
        }
        else {
            renderer = target.meshRenderer;
            if (renderer == null)
                return;
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
        Laya.loader.load(shaderUrl, Laya.Handler.create(this, this.shaderConmplete, [sharedMaterial, pData]));
        return sharedMaterial;
    };
    WmyShaderMsg.shaderConmplete = function (sharedMaterial, pData, data) {
        if (data == null)
            return;
        var xml = null;
        try {
            xml = Laya.Utils.parseXMLFromString(data);
        }
        catch (e) {
            return;
        }
        var xmlNode = xml.documentElement;
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
        var wmyValues = sharedMaterial["wmyValues"];
        if (wmyValues != null && wmyValues["cube"] != null) {
            var cubeName = wmyValues["cube"];
            if (pData != null && pData["cubeFun"] != null) {
                pData["cubeFun"](sharedMaterial, cubeName);
            }
        }
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
            if (wmyValues != null) {
                initV = wmyValues[oName];
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
        var spriteDefines = Laya.SkinnedMeshSprite3D.shaderDefines;
        var materialDefines = Laya.BlinnPhongMaterial.shaderDefines;
        if (pData != null) {
            if (pData["spriteDefines"] != null) {
                spriteDefines = pData["spriteDefines"];
            }
            if (pData["materialDefines"] != null) {
                materialDefines = pData["materialDefines"];
            }
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
                if (cull != null || cull != "") {
                    sharedMaterial.getRenderState(i).cull = this.getV(cull);
                }
            }
            shader.addShaderPass(vs, ps);
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
        var nodeValue = null;
        var attributes = node["attributes"];
        for (var i = 0; i < attributes.length; i++) {
            var element = attributes[i];
            if (element.name == key) {
                nodeValue = element["nodeValue"];
                break;
            }
        }
        return nodeValue;
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
exports.WmyShaderMsg = WmyShaderMsg;
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Wmy_Load_Mag_1 = require("../Wmy_Load_Mag");
var WmyShaderMsg_1 = require("./WmyShaderMsg");
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
    WmyUtils3D.getChildrenComponent = function (target, clas, arr) {
        if (target == null) {
            return null;
        }
        if (arr == null)
            arr = [];
        var obj = target.getComponent(clas);
        if (obj == null) {
            if (target instanceof clas) {
                obj = target;
            }
        }
        if (obj != null) {
            arr.push(obj);
        }
        for (var i = 0; i < target._children.length; i++) {
            var o = target._children[i];
            this.getChildrenComponent(o, clas, arr);
        }
        return arr;
    };
    WmyUtils3D.setShaderAll = function (target, matsUrl, shadersUrl) {
        var _this = this;
        var newMatsUrl = matsUrl + "wmyMats.json";
        var newShadersUrl = shadersUrl;
        Laya.loader.load(newMatsUrl, Laya.Handler.create(this, function (matsUrl, shadersUrl, data) {
            if (data == null) {
                console.warn("wmyMats-出错:", newMatsUrl);
                return;
            }
            var array = data["mats"];
            for (var i = 0; i < array.length; i++) {
                var obj = array[i];
                if (obj["targetName"] == "")
                    continue;
                var target3D = WmyUtils3D.getObj3d(target, obj["targetName"]);
                if (target3D == null)
                    continue;
                var matUrl = matsUrl + obj["matUrl"];
                var shaderNameUrl = shadersUrl + obj["shaderName"] + ".txt";
                Laya.BaseMaterial.load(matUrl, Laya.Handler.create(_this, function (_target3D, _shaderNameUrl, m) {
                    var pData = {};
                    pData["cubeFun"] = function (m, cubeName) {
                        Wmy_Load_Mag_1.Wmy_Load_Mag.getThis.getCube(cubeName, new Laya.Handler(_this, function (cube, i) {
                            if (i == 0) {
                                m._shaderValues.setTexture(Laya.Scene3D.REFLECTIONTEXTURE, cube);
                            }
                        }));
                    };
                    WmyShaderMsg_1.WmyShaderMsg.setShader(_target3D, m, _shaderNameUrl, false, pData);
                    if (_target3D != null && _target3D.parent != null) {
                        _target3D.parent.removeChild(_target3D);
                    }
                }, [target3D, shaderNameUrl]));
            }
        }, [matsUrl, newShadersUrl]), null, Laya.Loader.JSON);
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
exports.WmyUtils3D = WmyUtils3D;
},{"../Wmy_Load_Mag":5,"./WmyShaderMsg":8}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpciBJREUgMi4wLjAgYmV0YTIvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDb25maWcudHMiLCJzcmMvTWFpbi50cyIsInNyYy90YXIvV215VGFyLnRzIiwic3JjL3dteVV0aWxzSDUvV215VXRpbHMudHMiLCJzcmMvd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkM2QudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkTWF0cy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVNoYWRlck1zZy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkE7O0VBRUU7QUFDRjtJQVdJO0lBQWMsQ0FBQztJQUNSLGVBQUksR0FBWDtJQUNBLENBQUM7SUFaTSxnQkFBSyxHQUFRLEdBQUcsQ0FBQztJQUNqQixpQkFBTSxHQUFRLElBQUksQ0FBQztJQUNuQixvQkFBUyxHQUFRLFlBQVksQ0FBQztJQUM5QixxQkFBVSxHQUFRLE1BQU0sQ0FBQztJQUN6QixxQkFBVSxHQUFRLEVBQUUsQ0FBQztJQUNyQixvQkFBUyxHQUFRLEVBQUUsQ0FBQztJQUNwQixnQkFBSyxHQUFTLEtBQUssQ0FBQztJQUNwQixlQUFJLEdBQVMsSUFBSSxDQUFDO0lBQ2xCLHVCQUFZLEdBQVMsS0FBSyxDQUFDO0lBQzNCLDRCQUFpQixHQUFTLElBQUksQ0FBQztJQUkxQyxpQkFBQztDQWRELEFBY0MsSUFBQTtrQkFkb0IsVUFBVTtBQWUvQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7QUNsQmxCLDJDQUFzQztBQUN0Qyx5REFBd0Q7QUFDeEQsMERBQXlEO0FBQ3pELHVDQUFrQztB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QkFBTyxHQUFyQixVQUFzQixDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUM7UUFDdkIsSUFBSSxJQUFJLEdBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUUsSUFBSSxDQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDYyxjQUFHLEdBQWxCLFVBQW1CLENBQUM7UUFDaEIsQ0FBQyxHQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsT0FBTyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVhLGtCQUFPLEdBQXJCLFVBQXNCLENBQUM7UUFDekIsSUFBRyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUUsQ0FBQyxFQUFDO1lBQ3RCLENBQUMsR0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hCO1FBQ1AsT0FBTyxDQUFDLENBQUM7SUFDVixDQUFDO0lBR2UsZ0JBQUssR0FBbkIsVUFBb0IsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFRO1FBQzNDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVMLGlCQUFDO0FBQUQsQ0FyS0EsQUFxS0MsSUFBQTtBQXJLWSxnQ0FBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKlxyXG4qIOa4uOaIj+WIneWni+WMlumFjee9rjtcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbmZpZ3tcclxuICAgIHN0YXRpYyB3aWR0aDpudW1iZXI9NjQwO1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9MTEzNjtcclxuICAgIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwiZml4ZWR3aWR0aFwiO1xyXG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiO1xyXG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgc2NlbmVSb290OnN0cmluZz1cIlwiO1xyXG4gICAgc3RhdGljIGRlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgc3RhdDpib29sZWFuPXRydWU7XHJcbiAgICBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgfVxyXG59XHJcbkdhbWVDb25maWcuaW5pdCgpOyIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuL0dhbWVDb25maWdcIjtcclxuaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuL3dteVV0aWxzSDUvZDMvV215VXRpbHMzRFwiO1xyXG5pbXBvcnQgeyBXbXlfTG9hZF9NYWcgfSBmcm9tIFwiLi93bXlVdGlsc0g1L1dteV9Mb2FkX01hZ1wiO1xyXG5pbXBvcnQgV215VGFyIGZyb20gXCIuL3Rhci9XbXlUYXJcIjtcclxuY2xhc3MgTWFpbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKSBMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IExheWEuU3RhZ2UuU0NBTEVfU0hPV0FMTDtcclxuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcclxuXHRcdC8v6K6+572u5rC05bmz5a+56b2QXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnbkggPSBcImNlbnRlclwiO1xyXG5cdFx0Ly/orr7nva7lnoLnm7Tlr7npvZBcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduViA9IFwibWlkZGxlXCI7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHRcdFdteVRhci5nZXRUaGlzLmluaXQoKTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0dmFyIHdteVZUaW1lPVwiXCI7XHJcblx0XHRpZih3aW5kb3chPW51bGwgJiYgd2luZG93W1wid215VlRpbWVcIl0hPW51bGwpe1xyXG5cdFx0XHR3bXlWVGltZT13aW5kb3dbXCJ3bXlWVGltZVwiXTtcclxuXHRcdH1cclxuXHRcdC8vTGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIrd215VlRpbWUsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuXHRcdHZhciB1cmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChcInJlcy9sb2FkSW5mby5qc29uXCIpO1xyXG4gICAgICAgIFdteV9Mb2FkX01hZy5nZXRUaGlzLm9uTG9hZFdldERhdGEodXJsLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkxvYWRMb2FkKSk7XHJcblx0fVxyXG5cdFxyXG4gICAgcHJpdmF0ZSBvbkxvYWRMb2FkKCl7XHJcbiAgICAgICAgdmFyIHJlc09iaj1XbXlfTG9hZF9NYWcuZ2V0VGhpcy5nZXRSZXNPYmooXCJsb2FkXCIpO1xyXG4gICAgICAgIGlmKHJlc09iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgIFdteV9Mb2FkX01hZy5nZXRUaGlzLm9ubG9hZChyZXNPYmosbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkTWFpbikpO1xyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG4gICAgcHJpdmF0ZSBfbG9hZFZpZXc6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfYmFyOmZhaXJ5Z3VpLkdQcm9ncmVzc0JhcjtcclxuXHRwcml2YXRlIG9uTG9hZE1haW4oKXtcclxuXHRcdHRoaXMuX2xvYWRWaWV3PWZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJsb2FkXCIsXCJMb2FkXCIpLmFzQ29tO1xyXG5cdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZCh0aGlzLl9sb2FkVmlldyk7XHJcblx0XHR0aGlzLl9iYXI9dGhpcy5fbG9hZFZpZXcuZ2V0Q2hpbGQoXCJiYXJcIikuYXNQcm9ncmVzcztcclxuXHJcbiAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMub25BdXRvTG9hZEFsbChuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uTG9hZGluZyhwcm9ncmVzczogbnVtYmVyKTogdm9pZCB7XHJcblx0XHR0aGlzLl9iYXIudmFsdWU9cHJvZ3Jlc3M7XHJcblx0fVxyXG5cdFxyXG4gICAgcHJpdmF0ZSBfdTNkQXJyO1xyXG4gICAgcHVibGljIHNjZW5lM0Q6TGF5YS5TY2VuZTNEO1xyXG5cdHByaXZhdGUgb25Mb2FkT2sodWlBcnIsdTNkQXJyKXtcclxuXHRcdHRoaXMuX3UzZEFycj11M2RBcnI7XHJcblx0XHRMYXlhLnRpbWVyLm9uY2UoNDAwLHRoaXMsICgpPT57XHJcblx0XHRcdHRoaXMub25NYWluKCk7XHJcblx0XHRcdGZhaXJ5Z3VpLkdSb290Lmluc3QucmVtb3ZlQ2hpbGQodGhpcy5fbG9hZFZpZXcpO1xyXG5cdFx0XHR0aGlzLl9sb2FkVmlldz1udWxsO1xyXG5cdFx0XHR0aGlzLl9iYXI9bnVsbDtcclxuXHRcdH0pO1xyXG5cdFx0Ly/mt7vliqAzROWcuuaZr1xyXG5cdFx0aWYodTNkQXJyWzBdIT1udWxsKXtcclxuXHRcdFx0dmFyIHVybDNkPXUzZEFyclswXS51cmxMaXN0WzBdO1xyXG5cdFx0XHR0aGlzLnNjZW5lM0QgPUxheWEubG9hZGVyLmdldFJlcyh1cmwzZCk7XHJcblx0XHRcdFdteVV0aWxzM0Quc2V0U2hhZGVyQWxsKHRoaXMuc2NlbmUzRCxcInJlcy9tYXRzL1wiLFwicmVzL3NoYWRlcnMvXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuICAgIHByaXZhdGUgX21haW5WaWV3OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgb25NYWluKCl7XHJcblx0XHR0aGlzLl9tYWluVmlldz1mYWlyeWd1aS5VSVBhY2thZ2UuY3JlYXRlT2JqZWN0KFwibWFpblwiLFwiTWFpblwiKS5hc0NvbTtcclxuXHRcdGlmKHRoaXMuX21haW5WaWV3IT1udWxsKXtcclxuXHRcdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZCh0aGlzLl9tYWluVmlldyk7XHJcblx0XHRcdHZhciBfTWFpbj10aGlzLl9tYWluVmlldy5nZXRDaGlsZChcIl9NYWluXCIpLmFzQ29tO1xyXG5cdFx0XHR2YXIgX2QzPV9NYWluLmdldENoaWxkKFwiZDNcIikuYXNDb207XHJcblx0XHRcdGlmKHRoaXMuc2NlbmUzRCE9bnVsbCl7XHJcblx0XHRcdFx0X2QzLmRpc3BsYXlPYmplY3QuYWRkQ2hpbGQodGhpcy5zY2VuZTNEKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215VGFye1xyXG4gICAgcHJpdmF0ZSBfZW5naW5lOiBUQVIuRW5naW5lO1xyXG4gICAgcHJpdmF0ZSBfYXI6IFRBUi5BUjtcclxuICAgIHByaXZhdGUgX3JlbmRlcjogVEFSLlJlbmRlcjtcclxuICAgIHN0YXRpYyBfdGhpczpXbXlUYXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCl7XHJcbiAgICAgICAgaWYoV215VGFyLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215VGFyLl90aGlzPW5ldyBXbXlUYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteVRhci5fdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpe1xyXG5cdFx0dGhpcy5fcmVuZGVyID0gbmV3IFRBUi5SZW5kZXIoKTtcclxuXHRcdHRoaXMuX2FyID0gbmV3IFRBUi5BUigpO1xyXG5cdFx0dGhpcy5fZW5naW5lID0gbmV3IFRBUi5FbmdpbmUoKTtcclxuXHRcdC8vIHJlbmRlcuWIneWni+WMlu+8jOi/kOihjOS4u+W+queOr1xyXG5cdFx0dGhpcy5fcmVuZGVyLmluaXQoKTtcclxuXHRcdGlmIChUQVIuRU5WLklPUykge1xyXG5cdFx0XHR0aGlzLkFSSW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChUQVIuRU5WLkFORFJPSUQpIHtcclxuICAgICAgICAgICAgLy8gYW5kcm9pZCBBUueahOiDveWKm+mcgOimgeS4i+i9veaJjeaciVxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU1RBVFVTX0NIQU5HReaWueazleazqOWGjDTkuKrkuI7lvJXmk47nirbmgIHnm7jlhbPnmoRjYWxsYmFja+WHveaVsHN0YXJ0LCBsb2FkaW5nLCBzdWNjZXNzLCBmYWlsXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBUQVIuVEFSVXRpbHMuU1RBVFVTX0NIQU5HRShcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsb3NlIG5hdGl2ZSBwcm9ncmVzcyBhZnRlciBkb3dubG9hZCBuYXRpdmUgYXIgZW5naW5lXHJcbiAgICAgICAgICAgICAgICAgICAgLy9OQVRJVkVfUlJPR1JFU1NfQ0xPU0UoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0luaXQgQVIgZmFpbC4gUGxhdGZvcm0gYW5kcm9pZC4gZG93bmxvYWQgZW5naW5lIGVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIC8vIHZyIGRpc3BsYXkg5b+F6aG76aaW5YWI5Yqg6L2977yMYW5kcm9pZOWcqHg15YaF5qC46YeM5bey57uP5pyJ77yMaW9z6ZyA6KaB5byV55SoV2ViQVJvbkFSa2l0XHJcbiAgICAgICAgICAgIC8vIGFuZHJvaWQgQVLnmoTog73lipvpnIDopoHkuIvovb3miY3mnInvvIzkvYbmmK/mkYTlg4/lpLTog73lipvkuI3pnIDopoHkuIvovb3lvJXmk47vvIzmiYDku6VyZW5kZXLlj6/ku6Xmj5DliY3ov5vooYzvvJtpb3PmnKzouqvlsLHmnInlkITnp43og73lipvvvIxzbGFt44CBbWFya2VybGVzc+ayv+eUqGFya2l055qE77yMbWFya2VyIGJhc2XmmK/mrabmsYnoh6rnoJTnmoTvvIzlhbbkuK3nmoRhZGRNYXJrZXLpnIDopoHnu4jnq6/mt7vliqDnmoRcclxuICAgICAgICAgICAgVEFSLkFSLmluaXRBUkVuZ2luZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogMlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hci5zZXRFbmdpbmVEb3dubG9hZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0luaXQgQVIgc3VjY2Vzcy4gUGxhdGZvcm0gYW5kcm9pZC4gQVIgRW5naW5lIGRvd25sb2FkIHN1Y2Nlc3MsIHlvdSBjYW4gdXNlIGFiaWxpdHkgb2YgdGFyICdcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW5pdCBBUiBmYWlsLiBQbGF0Zm9ybSBhbmRyb2lkLiBpbml0IGZhaWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5BUkluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQVJJbml0KCkge1xyXG4gICAgICAgIHRoaXMuX2FyLmxvYWQoKS50aGVuKChkaXNwbGF5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlci5zZXRWUkRpc3BsYXkoZGlzcGxheSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZS5jcmVhdGUoJ0xheWEnKTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIGFy5byV5pOO5Yqg6L2977yMbG9hZOWHveaVsOaciTPkuKrlj4LmlbDvvIzlkI7kuKTkuKrkuLrlm57osIPlh73mlbBvblN0YXJ0Q2FsbGJhY2vlkoxvbkNvbXBsZXRlQ2FsbGJhY2tcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZS5sb2FkKGRpc3BsYXksIG51bGwsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIHRhc2sgPSBuZXcgVGFzayhhciwgcmVuZGVyLCBlbmdpbmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1biA9IChwcmVTdGF0ZSwgbmV4dFN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFzay5ydW4ocHJlU3RhdGUsIG5leHRTdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIChhci5nZXRDdXJyZW50U3RhdGUoKSA9PT0gJ25vcm1hbCcpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBydW4oKTtcclxuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICogIOWwhnJ1biBjYWxsYmFja+azqOWGjOWIsGFy55qE54q25oCB6L2s56e75Ye95pWw5Lit77yMXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICogIOW9k+iwg+eUqGFyLm9uVGFyU3RhdGVDaGFuZ2VkKCdub3JtYWwnKeaIluiAhSBhci5vblRhclN0YXRlQ2hhbmdlZCgnbGltaXRlZCcpIO+8jCBydW7kvJrop6blj5HvvIxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgKiAg5omA5LulcnVu5Ye95pWw6KaB5YGa5LiN5ZCM54q25oCB6Ze06L2s5o2i5aSE55CGXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICovXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgYXIuc2V0Tm90QXZhaWxhYmxlMk5vcm1hbEZ1bmMocnVuKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICBhci5zZXRMaW1pdGVkMk5vcm1hbEZ1bmMocnVuKTtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYGV4Y2VwdGlvbiA9ICR7ZX1gKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG5leHBvcnQgY2xhc3MgV215VXRpbHMgZXh0ZW5kcyBsYXlhLmV2ZW50cy5FdmVudERpc3BhdGNoZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM6V215VXRpbHM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215VXRpbHN7XHJcbiAgICAgICAgaWYoV215VXRpbHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlVdGlscy5fdGhpcz1uZXcgV215VXRpbHMoKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215VXRpbHMuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5fX2xvb3ApO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfRE9XTix0aGlzLCB0aGlzLl9fb25Ub3VjaERvd24pO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfVVAsdGhpcywgdGhpcy5fX29uVG91Y2hVcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5fX09uTW91c2VNT1ZFKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuUkVTSVpFLHRoaXMsdGhpcy5fX29uUmVzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgQ09MT1JfRklMVEVSU19NQVRSSVg6IEFycmF5PGFueT49W1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vUlxyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vR1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vQlxyXG4gICAgICAgIDAsIDAsIDAsIDEsIDAsIC8vQVxyXG4gICAgXTtcclxuICAgIC8v6L2s5o2i6aKc6ImyXHJcbiAgICBwdWJsaWMgY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXIsYT86bnVtYmVyKTpBcnJheTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMF09cjtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFs2XT1nO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzEyXT1iO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzE4XT1hfHwxO1xyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWDtcclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnModGFyZ2V0OkxheWEuU3ByaXRlLGNvbG9yOm51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKGNvbG9yICE9IDB4ZmZmZmZmKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgoXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj4xNikgJiAweGZmKS8yNTUsXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj44KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgIChjb2xvciAmIDB4ZmYpLzI1NVxyXG4gICAgICAgICAgICAgICAgKSldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnMxKHRhcmdldDpMYXlhLlNwcml0ZSxyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlcnM9bnVsbDtcclxuICAgICAgICBpZihyIDwgMSB8fCBnIDwgMSB8fCBiIDwgMSB8fCBhIDwgMSl7XHJcbiAgICAgICAgICAgIHRhcmdldC5maWx0ZXJzPVtuZXcgTGF5YS5Db2xvckZpbHRlcih0aGlzLmNvbnZlcnRDb2xvclRvQ29sb3JGaWx0ZXJzTWF0cml4KHIsZyxiLGEpKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5Yik5pat5omL5py65oiWUENcclxuICAgIHB1YmxpYyBpc1BjKCk6Ym9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHZhciBpc1BjOmJvb2xlYW49ZmFsc2U7XHJcbiAgICAgICAgaWYodGhpcy52ZXJzaW9ucygpLmFuZHJvaWQgfHwgdGhpcy52ZXJzaW9ucygpLmlQaG9uZSB8fCB0aGlzLnZlcnNpb25zKCkuaW9zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXNQYz1mYWxzZTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnZlcnNpb25zKCkuaVBhZCl7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpc1BjPXRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzUGM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmVyc2lvbnMoKXtcclxuICAgICAgICB2YXIgdTpzdHJpbmcgPSBuYXZpZ2F0b3IudXNlckFnZW50LCBhcHA6c3RyaW5nID0gbmF2aWdhdG9yLmFwcFZlcnNpb247XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLy/np7vliqjnu4jnq6/mtY/op4jlmajniYjmnKzkv6Hmga9cclxuICAgICAgICAgICAgdHJpZGVudDogdS5pbmRleE9mKCdUcmlkZW50JykgPiAtMSwgLy9JReWGheaguFxyXG4gICAgICAgICAgICBwcmVzdG86IHUuaW5kZXhPZignUHJlc3RvJykgPiAtMSwgLy9vcGVyYeWGheaguFxyXG4gICAgICAgICAgICB3ZWJLaXQ6IHUuaW5kZXhPZignQXBwbGVXZWJLaXQnKSA+IC0xLCAvL+iLueaenOOAgeiwt+atjOWGheaguFxyXG4gICAgICAgICAgICBnZWNrbzogdS5pbmRleE9mKCdHZWNrbycpID4gLTEgJiYgdS5pbmRleE9mKCdLSFRNTCcpID09IC0xLCAvL+eBq+eLkOWGheaguFxyXG4gICAgICAgICAgICBtb2JpbGU6ICEhdS5tYXRjaCgvQXBwbGVXZWJLaXQuKk1vYmlsZS4qLyl8fCEhdS5tYXRjaCgvQXBwbGVXZWJLaXQvKSwgLy/mmK/lkKbkuLrnp7vliqjnu4jnq69cclxuICAgICAgICAgICAgaW9zOiAhIXUubWF0Y2goL1xcKGlbXjtdKzsoIFU7KT8gQ1BVLitNYWMgT1MgWC8pLCAvL2lvc+e7iOerr1xyXG4gICAgICAgICAgICBhbmRyb2lkOiB1LmluZGV4T2YoJ0FuZHJvaWQnKSA+IC0xIHx8IHUuaW5kZXhPZignTGludXgnKSA+IC0xLCAvL2FuZHJvaWTnu4jnq6/miJbogIV1Y+a1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGhvbmU6IHUuaW5kZXhPZignaVBob25lJykgPiAtMSB8fCB1LmluZGV4T2YoJ01hYycpID4gLTEsIC8v5piv5ZCm5Li6aVBob25l5oiW6ICFUVFIROa1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGFkOiB1LmluZGV4T2YoJ2lQYWQnKSA+IC0xLCAvL+aYr+WQpmlQYWRcclxuICAgICAgICAgICAgd2ViQXBwOiB1LmluZGV4T2YoJ1NhZmFyaScpID09IC0xIC8v5piv5ZCmd2Vi5bqU6K+l56iL5bqP77yM5rKh5pyJ5aS06YOo5LiO5bqV6YOoXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VXJsVihrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgcmVnPSBuZXcgUmVnRXhwKFwiKF58JilcIitrZXkrXCI9KFteJl0qKSgmfCQpXCIpO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ/ZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdFsyXSk6bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25OYXZpZ2F0ZSh1cmw6c3RyaW5nLGlzUmVwbGFjZTpib29sZWFuPWZhbHNlKXtcclxuICAgICAgICBpZihpc1JlcGxhY2Upe1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh1cmwpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPXVybDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZXZlbnRMaXN0OkFycmF5PGxheWEuZXZlbnRzLkV2ZW50Pj1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaERvd24oZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdC5pbmRleE9mKGV2dCk8MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5wdXNoKGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uVG91Y2hVcChldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KT49MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5zcGxpY2UodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uUmVzaXplKCl7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0LmZvckVhY2goZXZ0ID0+IHtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcblx0XHR9KTtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3Q9bmV3IEFycmF5PGxheWEuZXZlbnRzLkV2ZW50PigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9fT25Nb3VzZU1PVkUoZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBiTnVtPTEwO1xyXG4gICAgICAgIGlmKGV2dC5zdGFnZVggPD0gYk51bSB8fCBldnQuc3RhZ2VYID49IExheWEuc3RhZ2Uud2lkdGgtYk51bSB8fFxyXG4gICAgICAgICAgICBldnQuc3RhZ2VZIDw9IGJOdW0gfHwgZXZ0LnN0YWdlWSA+PSBMYXlhLnN0YWdlLmhlaWdodC1iTnVtKXtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4sbD0yKXtcclxuXHRcdGlmKChuK1wiXCIpLmluZGV4T2YoXCIuXCIpPj0wKXtcclxuXHRcdCAgICBuPXBhcnNlRmxvYXQobi50b0ZpeGVkKGwpKTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gbjtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSX1hZKGQsIHIpXHJcbiAgICB7XHJcbiAgICBcdHZhciByYWRpYW4gPSAociAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgXHR2YXIgY29zID0gIE1hdGguY29zKHJhZGlhbik7XHJcbiAgICBcdHZhciBzaW4gPSAgTWF0aC5zaW4ocmFkaWFuKTtcclxuICAgIFx0XHJcbiAgICBcdHZhciBkeD1kICogY29zO1xyXG4gICAgXHR2YXIgZHk9ZCAqIHNpbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBMYXlhLlBvaW50KGR4ICwgZHkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICBwdWJsaWMgc3RhdGljIHN0cmluZzJidWZmZXIoc3RyKTpBcnJheUJ1ZmZlciB7XHJcbiAgICAgICAgLy8g6aaW5YWI5bCG5a2X56ym5Liy6L2s5Li6MTbov5vliLZcclxuICAgICAgICBsZXQgdmFsID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgdmFsID0gc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFsICs9ICcsJyArIHN0ci5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5bCGMTbov5vliLbovazljJbkuLpBcnJheUJ1ZmZlclxyXG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSh2YWwubWF0Y2goL1tcXGRhLWZdezJ9L2dpKS5tYXAoZnVuY3Rpb24gKGgpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoaCwgMTYpXHJcbiAgICAgICAgfSkpLmJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlcGxhY2VBbGwoc3RyLCBvbGRTdHIsIG5ld1N0cil7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnOyAgXHJcbiAgICAgICAgdGVtcCA9IHN0ci5yZXBsYWNlKG9sZFN0ciwgbmV3U3RyKTtcclxuICAgICAgICBpZih0ZW1wLmluZGV4T2Yob2xkU3RyKT49MCl7XHJcbiAgICAgICAgICAgIHRlbXAgPSB0aGlzLnJlcGxhY2VBbGwodGVtcCwgb2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDsgIFxyXG4gICAgfSAgXHJcblxyXG4gICAgLy/lpKflsI/lhpnovazmjaJcclxuICAgIHB1YmxpYyBzdGF0aWMgdG9DYXNlKHN0cjpzdHJpbmcsIGlzRHg9ZmFsc2UpeyAgXHJcbiAgICAgICAgdmFyIHRlbXAgPSAnJztcclxuICAgICAgICBpZighaXNEeCl7XHJcbiAgICAgICAgICAgIC8v6L2s5o2i5Li65bCP5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIC8v6L2s5YyW5Li65aSn5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9IFxyXG5cclxuICAgIFxyXG4gICAgLy/ot53nprtcclxuXHRwdWJsaWMgc3RhdGljIGdldERpc3RhbmNlKGE6TGF5YS5Qb2ludCxiOkxheWEuUG9pbnQpOm51bWJlciB7XHJcblx0XHR2YXIgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xyXG5cdFx0dmFyIGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcclxuXHRcdHZhciBkPU1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpO1xyXG5cdFx0ZD1wYXJzZUZsb2F0KGQudG9GaXhlZCgyKSk7XHJcblx0XHRyZXR1cm4gZDtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRYeVRvUih5LHgpOm51bWJlcntcclxuICAgICAgICB2YXIgcmFkaWFuPU1hdGguYXRhbjIoeSx4KTtcclxuICAgICAgICB2YXIgcj0oMTgwL01hdGguUEkqcmFkaWFuKTtcclxuICAgICAgICByPXRoaXMub25OdW1UbyhyKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0b3JhZ2Uoa2V5LCB2YWx1ZTphbnk9XCI/XCIsIGlzTG9jYWw9dHJ1ZSk6YW55e1xyXG4gICAgICAgIHZhciBzdG9yYWdlOmFueT1pc0xvY2FsP2xvY2FsU3RvcmFnZTpzZXNzaW9uU3RvcmFnZTtcclxuICAgICAgICBpZih2YWx1ZT09XCI/XCIpe1xyXG5cdFx0XHR2YXIgZGF0YSA9IHN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYodmFsdWU9PW51bGwpe1xyXG5cdFx0XHRzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlGdWlTb3VuZChfdXJsLHZvbHVtZT0wLjIsY29tcGxldGVIYW5kbGVyPyxzdGFydFRpbWU9MCxsb29wcz0xKXtcclxuICAgICAgICBpZih2b2x1bWU8PTApcmV0dXJuO1xyXG4gICAgICAgIHZhciBpdGVtPWZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtQnlVUkwoX3VybCk7XHJcbiAgICAgICAgdmFyIHVybD1pdGVtLmZpbGU7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKHVybCxsb29wcyxjb21wbGV0ZUhhbmRsZXIsbnVsbCxzdGFydFRpbWUpO1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnNldFNvdW5kVm9sdW1lKHZvbHVtZSx1cmwpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMgfSBmcm9tIFwiLi9XbXlVdGlsc1wiO1xyXG5pbXBvcnQgeyBXbXlMb2FkM2QgfSBmcm9tIFwiLi9kMy9XbXlMb2FkM2RcIjtcclxuaW1wb3J0IHsgV215TG9hZE1hdHMgfSBmcm9tIFwiLi9kMy9XbXlMb2FkTWF0c1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteV9Mb2FkX01hZ1xyXG57XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlfTG9hZF9NYWd7XHJcbiAgICAgICAgaWYoV215X0xvYWRfTWFnLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215X0xvYWRfTWFnLl90aGlzPW5ldyBXbXlfTG9hZF9NYWcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteV9Mb2FkX01hZy5fdGhpcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3dldERhdGE6YW55PXt9O1xyXG5cclxuICAgIHB1YmxpYyByZXNVcmw6c3RyaW5nPVwiXCI7XHJcbiAgICBwdWJsaWMgZ2V0V2V0RGF0YSh1cmw6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2V0RGF0YVt1cmxdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc2V0V2V0RGF0YShvYmo6YW55LHVybD86c3RyaW5nKXtcclxuICAgICAgICBpZih0aGlzLnJlc1VybD09XCJcIil7XHJcbiAgICAgICAgICAgIHRoaXMucmVzVXJsPXVybDtcclxuICAgICAgICAgICAgdmFyIGFycj1udWxsO1xyXG4gICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZShvYmopO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodXJsPT1udWxsKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMucmVzVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl93ZXREYXRhW3VybF09b2JqO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0UmVzT2JqKHJlc05hbWU6c3RyaW5nLHVybD8pe1xyXG4gICAgICAgIHZhciB3ZWJEYXRhOmFueTtcclxuICAgICAgICBpZih1cmw9PW51bGwpe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5yZXNVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdlYkRhdGE9dGhpcy5nZXRXZXREYXRhKHVybCk7XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhcnI9PW51bGwpe1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyPUpTT04ucGFyc2Uod2ViRGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIix3ZWJEYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXNPYmo9bnVsbDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1hcnJbaV07XHJcbiAgICAgICAgICAgIGlmKG9ialtcInJlc05hbWVcIl09PXJlc05hbWUpe1xyXG4gICAgICAgICAgICAgICAgcmVzT2JqPW9iajtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZFdldERhdGEodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgaWYodXJsPT1cIlwiKXJldHVybjtcclxuICAgICAgICBpZih0aGlzLmdldFdldERhdGEodXJsKSE9bnVsbCl7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5nZXRXZXREYXRhKHVybCldKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbG9hZD1MYXlhLmxvYWRlci5sb2FkKHVybCxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsZnVuY3Rpb24ob2JqKXtcclxuICAgICAgICAgICAgdGhpcy5zZXRXZXREYXRhKG9iaix1cmwpO1xyXG4gICAgICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW3RoaXMuX3dldERhdGFbdXJsXV0pO1xyXG4gICAgICAgIH0pKVxyXG4gICAgICAgIHJldHVybiBsb2FkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Jlc0RhdGFBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6QXJyYXk8YW55Pj1bXTtcclxuICAgIHB1YmxpYyBvbmxvYWQocmVzT2JqOmFueSxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNOYW1lPXJlc09ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgaWYodGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0ucnVuV2l0aChbdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzT2JqW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTphbnk9e307XHJcbiAgICAgICAgICAgIHZhciByZXNEYXRhOnN0cmluZz1yZXNPYmpbXCJyZXNEYXRhXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNEYXRhIT1udWxsICYmIHJlc0RhdGEhPVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhPUpTT04ucGFyc2UocmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZVVybDtcclxuICAgICAgICAgICAgdmFyIHVybEFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB2YXIgaXNDcmVhdGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzVXJsPVdteVV0aWxzLnRvQ2FzZShyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZih1cmwuaW5kZXhPZihcIi50eHRcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuQlVGRkVSfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYk5hbWVVcmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih1cmwuaW5kZXhPZihcIi5qcGdcIik+PTAgfHwgdXJsLmluZGV4T2YoXCIucG5nXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLklNQUdFfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHVybC5pbmRleE9mKFwiLm1wM1wiKT49MCB8fCB1cmwuaW5kZXhPZihcIi53YXZcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuU09VTkR9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmxBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Bc3NldENvbm1wbGV0ZSxbcmVzTmFtZSxiTmFtZVVybCxkYXRhXSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQXNzZXRQcm9ncmVzcywgW3Jlc05hbWVdLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBvbmxvYWQzZChyZXNPYmo6YW55LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc05hbWU9cmVzT2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICBpZih0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXS5ydW5XaXRoKFt0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNPYmpbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciBkYXRhOmFueT17fTtcclxuICAgICAgICAgICAgdmFyIHJlc0RhdGE6c3RyaW5nPXJlc09ialtcInJlc0RhdGFcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc0RhdGEhPW51bGwgJiYgcmVzRGF0YSE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9SlNPTi5wYXJzZShyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIscmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lO1xyXG4gICAgICAgICAgICB2YXIgdXJsQXJyOkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmwuaW5kZXhPZihcIi5sc1wiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgICAgICB1cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YS51cmxMaXN0PXVybExpc3Q7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5nZXRUaGlzLm9ubG9hZDNkKHVybEFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkFzc2V0Q29ubXBsZXRlLFtyZXNOYW1lLGJOYW1lLGRhdGFdKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Bc3NldFByb2dyZXNzLCBbcmVzTmFtZV0sIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHRwcml2YXRlIG9uQXNzZXRQcm9ncmVzcyhyZXNOYW1lLHByb2dyZXNzKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrUHJvZ3Jlc3NBcnI6QXJyYXk8TGF5YS5IYW5kbGVyPj10aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tQcm9ncmVzc0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYWxsYmFja1Byb2dyZXNzQXJyW2ldO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5ydW5XaXRoKFtwcm9ncmVzc10pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcbiAgICBcclxuICAgIHByaXZhdGUgb25Bc3NldENvbm1wbGV0ZShyZXNOYW1lLGJOYW1lVXJsOnN0cmluZyxkYXRhKTp2b2lke1xyXG4gICAgICAgIHZhciBjYWxsYmFja09rQXJyOkFycmF5PExheWEuSGFuZGxlcj49dGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXTtcclxuICAgICAgICBpZihiTmFtZVVybCE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBiYW89TGF5YS5sb2FkZXIuZ2V0UmVzKGJOYW1lVXJsKTtcclxuICAgICAgICAgICAgdmFyIGJOYW1lID0gYk5hbWVVcmwucmVwbGFjZShcIi50eHRcIixcIlwiKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKGJOYW1lLGJhbyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJGVUkt5Ye66ZSZOlwiLGJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWVBcnI9Yk5hbWUuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICBkYXRhLmJOYW1lPWJOYW1lQXJyW2JOYW1lQXJyLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXT1kYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrT2tBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrT2sgPSBjYWxsYmFja09rQXJyW2ldO1xyXG4gICAgICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW2RhdGFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1udWxsO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZEluZm9BcnI6YW55O1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRyQ2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkQWxsKGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHdlYkRhdGE6YW55PXRoaXMuZ2V0V2V0RGF0YSh0aGlzLnJlc1VybCk7XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhcnI9PW51bGwpe1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyPUpTT04ucGFyc2Uod2ViRGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIix3ZWJEYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyPXt9O1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXT0wO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl09MDtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXT1bXTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl09W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9YXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzTmFtZT1vYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgICAgICB2YXIgdD1vYmpbXCJ0eXBlXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNOYW1lPT1udWxsIHx8IHJlc05hbWU9PVwiXCIgfHwgdD09bnVsbCB8fCB0PT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uQXV0b0xvYWRPYmoodCxyZXNOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkT2JqKHR5cGU6c3RyaW5nLHJlc05hbWUpe1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgcmVzSWQ9dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF09e307XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcIm5cIl09cmVzTmFtZTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT10eXBlO1xyXG4gICAgICAgIHZhciBsb2FkT2s9ZmFsc2U7XHJcbiAgICAgICAgaWYodHlwZT09XCJ1aVwiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidWkt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGU9PVwidTNkXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQzZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInUzZC3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJtYXRzXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgdXJsTGlzdDpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgcmVzVXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgocmVzVXJsKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIHVybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybExpc3QubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZE1hdHMuZ2V0VGhpcy5vbmxvYWQzZCh1cmxMaXN0LG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgICAgICBsb2FkT2s9dHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibWF0cy3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJjdWJlTWFwXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJhdWRpb1wiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYXVkaW8t5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3ViZShyZXNOYW1lLCBjb21wbGV0ZTogTGF5YS5IYW5kbGVyKTpBcnJheTxMYXlhLlRleHR1cmVDdWJlPntcclxuICAgICAgICB2YXIgcmVzPXRoaXMuZ2V0UmVzT2JqKHJlc05hbWUpO1xyXG4gICAgICAgIGlmKHJlcz09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc1tcIlJlc3Jlc1wiXTtcclxuICAgICAgICB2YXIgUmVzcmVzT2JqOkFycmF5PExheWEuVGV4dHVyZUN1YmU+PVtdO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICByZXNVcmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChyZXNVcmwpO1xyXG4gICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgTGF5YS5UZXh0dXJlQ3ViZS5sb2FkKHVybCxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsY3ViZT0+e1xyXG4gICAgICAgICAgICAgICAgUmVzcmVzT2JqW2ldPWN1YmU7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZS5ydW5XaXRoKFtjdWJlLGldKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUmVzcmVzT2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Mb2FkaW5nKHJlc0lkLCBwcm9ncmVzczpudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1wicFwiXT1wcm9ncmVzcztcclxuICAgICAgICB2YXIgbnVtPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXTtcclxuICAgICAgICB2YXIgcE51bT0wO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bnVtO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBwPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltpXVtcInBcIl07XHJcbiAgICAgICAgICAgIGlmKHAhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgcE51bSs9cDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgcEM9KHBOdW0vdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKSoxMDA7XHJcbiAgICAgICAgaWYoaXNOYU4ocEMpKXBDPTA7XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcENdKTtcclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uTG9hZE9rKHJlc0lkLGRhdGE/KXtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdKz0xO1xyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInVpXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl0+PXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXSx0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJleHBvcnQgY2xhc3MgV215TG9hZDNke1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZDNke1xyXG4gICAgICAgIGlmKFdteUxvYWQzZC5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5fdGhpcz1uZXcgV215TG9hZDNkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlMb2FkM2QuX3RoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXJsTGlzdDpBcnJheTxzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbmxvYWQzZCh1cmxMaXN0OkFycmF5PHN0cmluZz4sY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgX3VybExpc3Q9W107XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHVybExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciB1cmw9dXJsTGlzdFtpXTtcclxuICAgICAgICAgICAgdXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgodXJsKTtcclxuICAgICAgICAgICAgX3VybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICAvLyBvYmpbXCJ1cmxcIl0rPVwiP3dteVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcG51bT0wO1xyXG4gICAgICAgIHZhciBwTnVtPTA7XHJcbiAgICAgICAgdmFyIGlzUD1mYWxzZTtcclxuICAgICAgICB2YXIgX1Byb2dyZXNzPShwKT0+e1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwKTtcclxuICAgICAgICAgICAgcG51bSs9MC4wMTtcclxuICAgICAgICAgICAgLy8gaWYoaXNQKXtcclxuICAgICAgICAgICAgLy8gICAgIHBOdW0gPSBwbnVtKyhwKSowLjk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZXtcclxuICAgICAgICAgICAgLy8gICAgIHBOdW0gPSBwbnVtO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGlmKHBudW0+PTAuMSB8fCBwPT0xKXtcclxuICAgICAgICAgICAgLy8gICAgIGlzUD10cnVlO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmKHBudW0+MSlwbnVtPTE7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwbnVtXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9vbk9rPSgpPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUoX3VybExpc3QsbmV3IExheWEuSGFuZGxlcihudWxsLF9vbk9rKSxMYXlhLkhhbmRsZXIuY3JlYXRlKG51bGwsX1Byb2dyZXNzLG51bGwsZmFsc2UpKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHByaXZhdGUgX21BcnI6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgIHByaXZhdGUgX21OdW09MDtcclxuICAgIHByaXZhdGUgX21QPTA7XHJcbiAgICBwcml2YXRlIF9tUDI9MDtcclxuXHJcbiAgICBwcml2YXRlIF9fb25sc1VybEFyck9rKGxzVXJsQXJyOkFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bHNVcmxBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9bHNVcmxBcnJbaV07XHJcbiAgICAgICAgICAgIHZhciB1cmw9b2JqW1widXJsXCJdO1xyXG4gICAgICAgICAgICB2YXIgczA9dXJsLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgdmFyIHMxPXVybC5yZXBsYWNlKHMwW3MwLmxlbmd0aC0xXSxcIlwiKTtcclxuICAgICAgICAgICAgdmFyIHJvb3RVcmw9czE7XHJcbiAgICAgICAgICAgIHZhciB0eHQ9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcbiAgICAgICAgICAgIHZhciBqc09iaj1KU09OLnBhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9fdGlRdVVybChqc09ialtcImRhdGFcIl0scm9vdFVybCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21BcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25BcnJPayksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkFyclApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uQXJyUChwKXtcclxuICAgICAgICB2YXIgcE51bT1wKih0aGlzLl9tTnVtKzEpO1xyXG4gICAgICAgIGlmKHBOdW0+dGhpcy5fbVApdGhpcy5fbVA9cE51bTtcclxuICAgICAgICB0aGlzLl9tUDI9KHRoaXMuX21QL3RoaXMuX21BcnIubGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcE51bT0odGhpcy5fbVAyKSowLjk4O1xyXG4gICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BOdW1dKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25BcnJPaygpe1xyXG4gICAgICAgIHRoaXMuX21OdW0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fbU51bT49dGhpcy5fbUFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX3RpUXVVcmwob2JqLHVybDpzdHJpbmc9XCJcIil7XHJcbiAgICAgICAgaWYob2JqW1wicHJvcHNcIl0hPW51bGwgJiYgb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBtZXNoUGF0aD11cmwrb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKG1lc2hQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChtZXNoUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsczpBcnJheTxhbnk+PW9ialtcInByb3BzXCJdW1wibWF0ZXJpYWxzXCJdO1xyXG4gICAgICAgICAgICBpZihtYXRlcmlhbHMhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpaT0wO2lpPG1hdGVyaWFscy5sZW5ndGg7aWkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGg9dXJsK21hdGVyaWFsc1tpaV1bXCJwYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbXCJjb21wb25lbnRzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGNvbXBvbmVudHM6QXJyYXk8YW55Pj1vYmpbXCJjb21wb25lbnRzXCJdO1xyXG4gICAgICAgICAgICBpZihjb21wb25lbnRzLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkwID0gMDsgaTAgPCBjb21wb25lbnRzLmxlbmd0aDsgaTArKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wID0gY29tcG9uZW50c1tpMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImF2YXRhclwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcGF0aD11cmwrY29tcFtcImF2YXRhclwiXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihhcGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goYXBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbXBbXCJsYXllcnNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXJzOkFycmF5PGFueT49Y29tcFtcImxheWVyc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IGxheWVycy5sZW5ndGg7IGkxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllciA9IGxheWVyc1tpMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVzOkFycmF5PGFueT49bGF5ZXJbXCJzdGF0ZXNcIl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBzdGF0ZXMubGVuZ3RoOyBpMisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW2kyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xpcFBhdGg9dXJsK3N0YXRlW1wiY2xpcFBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGNsaXBQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKGNsaXBQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNoaWxkOkFycmF5PGFueT49b2JqW1wiY2hpbGRcIl07XHJcbiAgICAgICAgaWYoY2hpbGQhPW51bGwgJiYgY2hpbGQubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGNoaWxkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3RpUXVVcmwoY2hpbGRbaV0sdXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiZXhwb3J0IGNsYXNzIFdteUxvYWRNYXRze1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZE1hdHN7XHJcbiAgICAgICAgaWYoV215TG9hZE1hdHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlMb2FkTWF0cy5fdGhpcz1uZXcgV215TG9hZE1hdHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWRNYXRzLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vblVybEFyck9rLFt1cmxMaXN0XSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tYXRzVXJsQXJyOkFycmF5PHN0cmluZz49W107XHJcbiAgICBwcml2YXRlIF9tYXRPaz1mYWxzZTtcclxuICAgIHByaXZhdGUgX21hdE51bT0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UD0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UDI9MDtcclxuXHJcbiAgICBwcml2YXRlIF9fb25VcmxBcnJPayh1cmxMaXN0OkFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybD11cmxMaXN0W2ldO1xyXG4gICAgICAgICAgICAvLyB2YXIgdHh0PUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICAvLyB2YXIganNPYmo9SlNPTi5wYXJzZSh0eHQpO1xyXG4gICAgICAgICAgICB2YXIganNPYmo9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXJyPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIHZhciBtYXRzVXJsPXVybC5yZXBsYWNlKGFyclthcnIubGVuZ3RoLTFdLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXk6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycmF5PWpzT2JqW1wibWF0c1wiXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgICAgICBpZihvYmpbXCJ0YXJnZXROYW1lXCJdPT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hdFVybD1tYXRzVXJsK29ialtcIm1hdFVybFwiXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hdHNVcmxBcnIucHVzaChtYXRVcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21hdHNVcmxBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tYXRzVXJsQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25NYXRBcnJPayksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyclApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyUChwKXtcclxuICAgICAgICB2YXIgcE51bT1wKih0aGlzLl9tYXROdW0rMSk7XHJcbiAgICAgICAgaWYocE51bT50aGlzLl9tYXRQKXRoaXMuX21hdFA9cE51bTtcclxuICAgICAgICB0aGlzLl9tYXRQMj0odGhpcy5fbWF0UC90aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbdGhpcy5fbWF0UDJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyT2soKXtcclxuICAgICAgICB0aGlzLl9tYXROdW0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fbWF0TnVtPj10aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbmV4cG9ydCBjbGFzcyBXbXlTaGFkZXJNc2d7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbVx0dGFyZ2V0XHTlr7nosaFcclxuICAgICAqIEBwYXJhbVx0bWF0XHTmnZDotKhcclxuICAgICAqIEBwYXJhbVx0c2hhZGVyVXJsXHRzaGFkZXLnmoTlnLDlnYBcclxuICAgICAqIEBwYXJhbVx0aXNOZXdNYXRlcmlhXHTmmK/lkKbmlrDmnZDotKhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXRTaGFkZXIodGFyZ2V0LCBtYXQ6TGF5YS5CYXNlTWF0ZXJpYWwsIHNoYWRlclVybDpzdHJpbmcsIGlzTmV3TWF0ZXJpYT1mYWxzZSwgcERhdGE/OmFueSk6TGF5YS5CYXNlTWF0ZXJpYWx7XHJcbiAgICAgICAgdmFyIHJlbmRlcmVyOkxheWEuQmFzZVJlbmRlcjtcclxuICAgICAgICB2YXIgc2hhcmVkTWF0ZXJpYWw6IExheWEuQmFzZU1hdGVyaWFsO1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPSh0YXJnZXQgYXMgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKS5za2lubmVkTWVzaFJlbmRlcmVyO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJlcj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXJlbmRlcmVyLnNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZW5kZXJlcj0odGFyZ2V0IGFzIExheWEuTWVzaFNwcml0ZTNEKS5tZXNoUmVuZGVyZXI7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyPT1udWxsKXJldHVybjtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9cmVuZGVyZXIuc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGlzTmV3TWF0ZXJpYSl7XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXNoYXJlZE1hdGVyaWFsLmNsb25lKCk7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLnNoYXJlZE1hdGVyaWFsPXNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIH1cclxuXHRcdGZvcih2YXIga2V5IGluIG1hdCl7XHJcblx0XHRcdHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbFtrZXldPW1hdFtrZXldO1xyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChzaGFkZXJVcmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuc2hhZGVyQ29ubXBsZXRlLFtzaGFyZWRNYXRlcmlhbCxwRGF0YV0pKTtcclxuICAgICAgICByZXR1cm4gc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2hhZGVyQ29ubXBsZXRlKHNoYXJlZE1hdGVyaWFsOkxheWEuQmFzZU1hdGVyaWFsLCBwRGF0YTphbnksIGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGE9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciB4bWw9bnVsbFxyXG4gICAgICAgIHRyeVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeG1sID0gTGF5YS5VdGlscy5wYXJzZVhNTEZyb21TdHJpbmcoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgeG1sTm9kZTpOb2RlID0geG1sLmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgICB2YXIgc2hhZGVyTmFtZT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZSh4bWxOb2RlLFwibmFtZVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGksbyxvTmFtZSx2MCx2MSxpbml0VjtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgYXR0cmlidXRlTWFwPXt9O1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVNYXBOb2RlPXRoaXMuZ2V0Tm9kZSh4bWxOb2RlLFwiYXR0cmlidXRlTWFwXCIpO1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVNYXBBcnI9dGhpcy5nZXROb2RlQXJyKGF0dHJpYnV0ZU1hcE5vZGUsXCJkYXRhXCIpO1xyXG4gICAgICAgIGZvcihpPTA7aTxhdHRyaWJ1dGVNYXBBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIG8gPSBhdHRyaWJ1dGVNYXBBcnJbaV07XHJcbiAgICAgICAgICAgIG9OYW1lPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJuYW1lXCIpO1xyXG4gICAgICAgICAgICB2MD10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwidjBcIik7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZU1hcFtvTmFtZV09dGhpcy5nZXRWKHYwLFwiaW50XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHVuaWZvcm1NYXA9e307XHJcbiAgICAgICAgdmFyIHVuaWZvcm1NYXBOb2RlPXRoaXMuZ2V0Tm9kZSh4bWxOb2RlLFwidW5pZm9ybU1hcFwiKTtcclxuICAgICAgICB2YXIgdW5pZm9ybU1hcEFycj10aGlzLmdldE5vZGVBcnIodW5pZm9ybU1hcE5vZGUsXCJkYXRhXCIpO1xyXG5cclxuICAgICAgICB2YXIgd215VmFsdWVzPXNoYXJlZE1hdGVyaWFsW1wid215VmFsdWVzXCJdO1xyXG4gICAgICAgIGlmKHdteVZhbHVlcyE9bnVsbCAmJiB3bXlWYWx1ZXNbXCJjdWJlXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGN1YmVOYW1lPXdteVZhbHVlc1tcImN1YmVcIl07XHJcbiAgICAgICAgICAgIGlmKHBEYXRhIT1udWxsICYmIHBEYXRhW1wiY3ViZUZ1blwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBwRGF0YVtcImN1YmVGdW5cIl0oc2hhcmVkTWF0ZXJpYWwsY3ViZU5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihpPTA7aTx1bmlmb3JtTWFwQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBpbml0Vj1udWxsO1xyXG4gICAgICAgICAgICBvID0gdW5pZm9ybU1hcEFycltpXTtcclxuICAgICAgICAgICAgb05hbWU9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcIm5hbWVcIik7XHJcbiAgICAgICAgICAgIHYwPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJ2MFwiKTtcclxuICAgICAgICAgICAgdjE9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcInYxXCIpO1xyXG4gICAgICAgICAgICB2YXIgdkFycj1bXTtcclxuICAgICAgICAgICAgdkFyclswXT10aGlzLmdldFYodjAsXCJpbnRcIik7XHJcbiAgICAgICAgICAgIHZBcnJbMV09dGhpcy5nZXRWKHYxLFwiaW50XCIpO1xyXG4gICAgICAgICAgICB1bmlmb3JtTWFwW29OYW1lXT12QXJyO1xyXG5cclxuICAgICAgICAgICAgaWYod215VmFsdWVzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGluaXRWPXdteVZhbHVlc1tvTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vaW5pdFY9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcImluaXRWXCIpO1xyXG4gICAgICAgICAgICBpZihpbml0ViE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpbml0ViA9IGluaXRWLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGluaXRWLmxlbmd0aD09NCl7XHJcbiAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcih2QXJyWzBdLG5ldyBMYXlhLlZlY3RvcjQocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkscGFyc2VGbG9hdChpbml0VlsyXSkscGFyc2VGbG9hdChpbml0VlszXSkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0zKXtcclxuICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKHZBcnJbMF0sbmV3IExheWEuVmVjdG9yMyhwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSxwYXJzZUZsb2F0KGluaXRWWzJdKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTIpe1xyXG4gICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IodkFyclswXSxuZXcgTGF5YS5WZWN0b3IyKHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09MSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzTmFOKHBhcnNlRmxvYXQoaW5pdFZbMF0pKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0TnVtYmVyKHZBcnJbMF0scGFyc2VGbG9hdChpbml0VlswXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyT2JqPWluaXRWWzBdK1wiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0ck9iaj09XCJ0ZXhcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4OkxheWEuQmFzZVRleHR1cmU9c2hhcmVkTWF0ZXJpYWxbb05hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRUZXh0dXJlKHZBcnJbMF0sdGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNwcml0ZURlZmluZXM9TGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNELnNoYWRlckRlZmluZXM7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsRGVmaW5lcz1MYXlhLkJsaW5uUGhvbmdNYXRlcmlhbC5zaGFkZXJEZWZpbmVzO1xyXG4gICAgICAgIGlmKHBEYXRhIT1udWxsKXtcclxuICAgICAgICAgICAgaWYocERhdGFbXCJzcHJpdGVEZWZpbmVzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHNwcml0ZURlZmluZXM9cERhdGFbXCJzcHJpdGVEZWZpbmVzXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHBEYXRhW1wibWF0ZXJpYWxEZWZpbmVzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsRGVmaW5lcz1wRGF0YVtcIm1hdGVyaWFsRGVmaW5lc1wiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNoYWRlcj1MYXlhLlNoYWRlcjNELmFkZChzaGFkZXJOYW1lLGF0dHJpYnV0ZU1hcCx1bmlmb3JtTWFwLHNwcml0ZURlZmluZXMsbWF0ZXJpYWxEZWZpbmVzKTtcclxuXHJcbiAgICAgICAgdmFyIFN1YlNoYWRlck5vZGU9dGhpcy5nZXROb2RlKHhtbE5vZGUsXCJTdWJTaGFkZXJcIik7XHJcblxyXG4gICAgICAgIHZhciByZW5kZXJNb2RlTm9kZT10aGlzLmdldE5vZGUoeG1sTm9kZSxcInJlbmRlck1vZGVcIik7XHJcbiAgICAgICAgaWYocmVuZGVyTW9kZU5vZGUhPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyTW9kZT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShyZW5kZXJNb2RlTm9kZSxcInZcIik7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlck1vZGUhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWxbXCJyZW5kZXJNb2RlXCJdPXRoaXMuZ2V0VihyZW5kZXJNb2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIFBhc3NBcnI9dGhpcy5nZXROb2RlQXJyKFN1YlNoYWRlck5vZGUsXCJQYXNzXCIpO1xyXG4gICAgICAgIGZvcihpPTA7aTxQYXNzQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgcGFzcyA9IFBhc3NBcnJbaV07XHJcbiAgICAgICAgICAgIHZhciB2c05vZGU6Tm9kZT10aGlzLmdldE5vZGUocGFzcyxcIlZFUlRFWFwiKTtcclxuICAgICAgICAgICAgdmFyIHZzOnN0cmluZz12c05vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIHZzID0gdnMucmVwbGFjZSgvKFxccikvZyxcIlwiKTtcclxuICAgICAgICAgICAgdmFyIHBzTm9kZTpOb2RlPXRoaXMuZ2V0Tm9kZShwYXNzLFwiRlJBR01FTlRcIik7XHJcbiAgICAgICAgICAgIHZhciBwczpzdHJpbmc9cHNOb2RlLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICBwcyA9IHBzLnJlcGxhY2UoLyhcXHIpL2csXCJcIik7XHJcbiAgICAgICAgICAgIGlmKGk+MCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcnM6TGF5YS5SZW5kZXJTdGF0ZT0gc2hhcmVkTWF0ZXJpYWwuZ2V0UmVuZGVyU3RhdGUoMCkuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9yZW5kZXJTdGF0ZXMucHVzaChycyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBjdWxsTm9kZT10aGlzLmdldE5vZGUocGFzcyxcImN1bGxcIik7XHJcbiAgICAgICAgICAgIGlmKGN1bGxOb2RlIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHZhciBjdWxsPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKGN1bGxOb2RlLFwidlwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGN1bGwhPW51bGwgfHwgY3VsbCE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuZ2V0UmVuZGVyU3RhdGUoaSkuY3VsbD10aGlzLmdldFYoY3VsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNoYWRlci5hZGRTaGFkZXJQYXNzKHZzLHBzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXI9c2hhZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VihvYmo6YW55LGJhY2tUeXBlPVwibnVsbFwiKTphbnl7XHJcbiAgICAgICAgdmFyIHRlbXBOYW1lQXJyLHRlbXBPYmosdGVtcFYsaWk7XHJcbiAgICAgICAgdGVtcE5hbWVBcnI9b2JqLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICBpZih0ZW1wTmFtZUFyclswXT09PVwiTGF5YVwiKXtcclxuICAgICAgICAgICAgdGVtcFY9TGF5YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0ZW1wTmFtZUFyclswXT09PVwibGF5YVwiKXtcclxuICAgICAgICAgICAgdGVtcFY9bGF5YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGlpPTE7aWk8dGVtcE5hbWVBcnIubGVuZ3RoO2lpKyspe1xyXG4gICAgICAgICAgICB0ZW1wVj10ZW1wVlt0ZW1wTmFtZUFycltpaV1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0ZW1wViE9bnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wVjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihiYWNrVHlwZSE9XCJudWxsXCIpe1xyXG4gICAgICAgICAgICBpZihiYWNrVHlwZT09XCJpbnRcIil7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgc3RyaW5nIGluIHRoZSBmb3JtYXQgXCIjcnJnZ2JiXCIgb3IgXCJycmdnYmJcIiB0byB0aGUgY29ycmVzcG9uZGluZ1xyXG4gICAgICogdWludCByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGNvbG9yIFRoZSBjb2xvciBpbiBzdHJpbmcgZm9ybWF0LlxyXG4gICAgICogQHJldHVybiBUaGUgY29sb3IgaW4gdWludCBmb3JtYXQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbG9yU3RyaW5nVG9VaW50KGNvbG9yOlN0cmluZyk6bnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKFwiMHhcIiArIGNvbG9yLnJlcGxhY2UoXCIjXCIsIFwiXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRBdHRyaWJ1dGVzVmFsdWUobm9kZTphbnksa2V5OnN0cmluZyl7XHJcbiAgICAgICAgdmFyIG5vZGVWYWx1ZT1udWxsO1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVzPW5vZGVbXCJhdHRyaWJ1dGVzXCJdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gYXR0cmlidXRlc1tpXTtcclxuICAgICAgICAgICAgaWYoZWxlbWVudC5uYW1lPT1rZXkpe1xyXG4gICAgICAgICAgICAgICAgbm9kZVZhbHVlPWVsZW1lbnRbXCJub2RlVmFsdWVcIl07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZVZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldE5vZGUoeG1sOmFueSxrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgY2hpbGROb2Rlcz14bWwuY2hpbGROb2RlcztcclxuICAgICAgICB2YXIgbm9kZTphbnk9bnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG9iajphbnk9Y2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYob2JqW1wibm9kZU5hbWVcIl09PWtleSl7XHJcbiAgICAgICAgICAgICAgICBub2RlPW9iajtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Tm9kZUFycih4bWw6YW55LGtleTpzdHJpbmcpOkFycmF5PE5vZGU+e1xyXG4gICAgICAgIHZhciBjaGlsZE5vZGVzPXhtbC5jaGlsZE5vZGVzO1xyXG4gICAgICAgIHZhciBub2RlQXJyOkFycmF5PE5vZGU+PVtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgb2JqOmFueT1jaGlsZE5vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZihvYmpbXCJub2RlTmFtZVwiXT09a2V5KXtcclxuICAgICAgICAgICAgICAgIG5vZGVBcnIucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlQXJyO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFdteV9Mb2FkX01hZyB9IGZyb20gXCIuLi9XbXlfTG9hZF9NYWdcIjtcclxuaW1wb3J0IHsgV215U2hhZGVyTXNnIH0gZnJvbSBcIi4vV215U2hhZGVyTXNnXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215VXRpbHMzRHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2QodGFyZ2V0LG9iak5hbWU6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0Lm5hbWU9PW9iak5hbWUpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG86TGF5YS5TcHJpdGUzRCA9IHRhcmdldC5fY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChvLl9jaGlsZHJlbi5sZW5ndGggPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoby5uYW1lPT1vYmpOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBPYmo9dGhpcy5nZXRPYmozZChvLG9iak5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcE9iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBPYmo7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LGNsYXM6YW55LGFycj8pOkFycmF5PGFueT57XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbClhcnI9W107XHJcblxyXG4gICAgICAgIHZhciBvYmo9dGFyZ2V0LmdldENvbXBvbmVudChjbGFzKTtcclxuICAgICAgICBpZihvYmo9PW51bGwpe1xyXG4gICAgICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBjbGFzKXtcclxuICAgICAgICAgICAgICAgIG9iaj10YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqIT1udWxsKXtcclxuICAgICAgICAgICAgYXJyLnB1c2gob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZHJlbkNvbXBvbmVudChvLGNsYXMsYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFNoYWRlckFsbCh0YXJnZXQsbWF0c1VybDpzdHJpbmcsIHNoYWRlcnNVcmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgbmV3TWF0c1VybD1tYXRzVXJsK1wid215TWF0cy5qc29uXCI7XHJcbiAgICAgICAgdmFyIG5ld1NoYWRlcnNVcmw9c2hhZGVyc1VybDtcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKG5ld01hdHNVcmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLChtYXRzVXJsLHNoYWRlcnNVcmwsZGF0YSk9PntcclxuICAgICAgICAgICAgaWYoZGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ3bXlNYXRzLeWHuumUmTpcIixuZXdNYXRzVXJsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYXJyYXk6QXJyYXk8YW55Pj1kYXRhW1wibWF0c1wiXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYob2JqW1widGFyZ2V0TmFtZVwiXT09XCJcIiljb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQzRD1XbXlVdGlsczNELmdldE9iajNkKHRhcmdldCxvYmpbXCJ0YXJnZXROYW1lXCJdKWFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgICAgICAgICBpZih0YXJnZXQzRD09bnVsbCljb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXRVcmw9bWF0c1VybCtvYmpbXCJtYXRVcmxcIl07XHJcbiAgICAgICAgICAgICAgICB2YXIgc2hhZGVyTmFtZVVybD1zaGFkZXJzVXJsK29ialtcInNoYWRlck5hbWVcIl0rXCIudHh0XCI7XHJcbiAgICAgICAgICAgICAgICBMYXlhLkJhc2VNYXRlcmlhbC5sb2FkKG1hdFVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKF90YXJnZXQzRDpMYXlhLlNwcml0ZTNELF9zaGFkZXJOYW1lVXJsLG0pPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBEYXRhPXt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHBEYXRhW1wiY3ViZUZ1blwiXT0obSxjdWJlTmFtZSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMuZ2V0Q3ViZShjdWJlTmFtZSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsKGN1YmUsaSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGk9PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRUZXh0dXJlKExheWEuU2NlbmUzRC5SRUZMRUNUSU9OVEVYVFVSRSxjdWJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBXbXlTaGFkZXJNc2cuc2V0U2hhZGVyKF90YXJnZXQzRCxtLF9zaGFkZXJOYW1lVXJsLGZhbHNlLHBEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihfdGFyZ2V0M0QhPW51bGwgJiYgX3RhcmdldDNELnBhcmVudCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90YXJnZXQzRC5wYXJlbnQucmVtb3ZlQ2hpbGQoX3RhcmdldDNEKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFt0YXJnZXQzRCxzaGFkZXJOYW1lVXJsXSkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFttYXRzVXJsLG5ld1NoYWRlcnNVcmxdKSxudWxsLExheWEuTG9hZGVyLkpTT04pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pUGxheSh0YXJnZXQsdGFyZ2V0TmFtZSxhbmlOYW1lKTpMYXlhLkFuaW1hdG9ye1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICB0YXJnZXQzZF9hbmkucGxheShhbmlOYW1lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDNkX2FuaTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25TaGFkb3coZGlyZWN0aW9uTGlnaHQ6TGF5YS5EaXJlY3Rpb25MaWdodCxzaGFkb3dSZXNvbHV0aW9uPTUxMixzaGFkb3dQQ0ZUeXBlPTEsc2hhZG93RGlzdGFuY2U6bnVtYmVyPTEwMCxpc1NoYWRvdzpib29sZWFuPXRydWUpe1xyXG4gICAgICAgIC8v54Gv5YWJ5byA5ZCv6Zi05b2xXHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgLy/lj6/op4HpmLTlvbHot53nprtcclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dEaXN0YW5jZSA9IHNoYWRvd0Rpc3RhbmNlO1xyXG4gICAgICAgIC8v55Sf5oiQ6Zi05b2x6LS05Zu+5bC65a+4XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UmVzb2x1dGlvbiA9IHNoYWRvd1Jlc29sdXRpb247XHJcbiAgICAgICAgLy9kaXJlY3Rpb25MaWdodC5zaGFkb3dQU1NNQ291bnQ9MTtcclxuICAgICAgICAvL+aooeeziuetiee6pyzotorlpKfotorpq5gs5pu06ICX5oCn6IO9XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UENGVHlwZSA9IHNoYWRvd1BDRlR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uQ2FzdFNoYWRvdyh0YXJnZXQsdHlwZT0wLGlzU2hhZG93PXRydWUsaXNDaGlsZHJlbj10cnVlKXtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLk1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBtczNEPSh0YXJnZXQgYXMgTGF5YS5NZXNoU3ByaXRlM0QpO1xyXG4gICAgICAgICAgICBpZih0eXBlPT0wKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0yKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBzbXMzZD0odGFyZ2V0IGFzIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGU9PTApe1xyXG4gICAgICAgICAgICAgICAgc21zM2Quc2tpbm5lZE1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIHNtczNkLnNraW5uZWRNZXNoUmVuZGVyZXIuY2FzdFNoYWRvdz1pc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaXNDaGlsZHJlbil7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lm51bUNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSB0YXJnZXQuZ2V0Q2hpbGRBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25DYXN0U2hhZG93KG9iaix0eXBlLGlzU2hhZG93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZ2IyaGV4KHIsZyxiKXtcclxuICAgICAgICB2YXIgX2hleD1cIiNcIiArIHRoaXMuaGV4KHIpICt0aGlzLiBoZXgoZykgKyB0aGlzLmhleChiKTtcclxuICAgICAgICByZXR1cm4gX2hleC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGV4KHgpe1xyXG4gICAgICAgIHg9dGhpcy5vbk51bVRvKHgpO1xyXG4gICAgICAgIHJldHVybiAoXCIwXCIgKyBwYXJzZUludCh4KS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4pe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQoMikpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBcclxuICAgcHVibGljIHN0YXRpYyBsZXJwRihhOm51bWJlciwgYjpudW1iZXIsIHM6bnVtYmVyKTpudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIChhICsgKGIgLSBhKSAqIHMpO1xyXG4gICAgfVxyXG5cclxufSJdfQ==
