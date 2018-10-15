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
        // /**
        //  * Android通过主循环监控平面坐标的变化，需要主动调用onTarStateChanged去改变状态
        //  * iOS已经将事件监听写在了tar.js里面，状态自动切换
        //  */
        // if (TAR.ENV.ANDROID) {
        //     this._render.on('TAR_STATE_CHANGE', () => {
        //         const vrDisplay = this._ar.getVRDisplay();
        //         if (vrDisplay && this._ar.isEngineDownload()) {
        //             const frameData = new window["VRFrameData"]();
        //             vrDisplay.getFrameData(frameData);
        //             const [x, y, z] = frameData.pose.position;
        //             if (x === 0 &&  y === 0 && z === 0) {
        //                 this._ar.onTarStateChanged('limited');
        //             } else {
        //                 this._ar.onTarStateChanged('normal');
        //             }
        //         }
        //     });
        // }
        // // trigger camera position change every frame
        // this._render.on('CAMERA_TRANSFORM_CHANGE', () => {
        //     const vrDisplay =  this._ar.getVRDisplay();
        //     // 需要获取到vrDisplay对象并且ar引擎下完成才能做业务逻辑
        //     if (vrDisplay &&  this._ar.isEngineDownload()) {
        //         this._engine.onCameraTransformChange();
        //     }
        // });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpciBJREUgMi4wLjAgYmV0YTIvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDb25maWcudHMiLCJzcmMvTWFpbi50cyIsInNyYy90YXIvV215VGFyLnRzIiwic3JjL3dteVV0aWxzSDUvV215VXRpbHMudHMiLCJzcmMvd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkM2QudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkTWF0cy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVNoYWRlck1zZy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkE7O0VBRUU7QUFDRjtJQVdJO0lBQWMsQ0FBQztJQUNSLGVBQUksR0FBWDtJQUNBLENBQUM7SUFaTSxnQkFBSyxHQUFRLEdBQUcsQ0FBQztJQUNqQixpQkFBTSxHQUFRLElBQUksQ0FBQztJQUNuQixvQkFBUyxHQUFRLFlBQVksQ0FBQztJQUM5QixxQkFBVSxHQUFRLE1BQU0sQ0FBQztJQUN6QixxQkFBVSxHQUFRLEVBQUUsQ0FBQztJQUNyQixvQkFBUyxHQUFRLEVBQUUsQ0FBQztJQUNwQixnQkFBSyxHQUFTLEtBQUssQ0FBQztJQUNwQixlQUFJLEdBQVMsSUFBSSxDQUFDO0lBQ2xCLHVCQUFZLEdBQVMsS0FBSyxDQUFDO0lBQzNCLDRCQUFpQixHQUFTLElBQUksQ0FBQztJQUkxQyxpQkFBQztDQWRELEFBY0MsSUFBQTtrQkFkb0IsVUFBVTtBQWUvQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7QUNsQmxCLDJDQUFzQztBQUN0Qyx5REFBd0Q7QUFDeEQsMERBQXlEO0FBQ3pELHVDQUFrQztB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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hCO1FBQ1AsT0FBTyxDQUFDLENBQUM7SUFDVixDQUFDO0lBR2UsZ0JBQUssR0FBbkIsVUFBb0IsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFRO1FBQzNDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVMLGlCQUFDO0FBQUQsQ0FyS0EsQUFxS0MsSUFBQTtBQXJLWSxnQ0FBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKlxyXG4qIOa4uOaIj+WIneWni+WMlumFjee9rjtcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbmZpZ3tcclxuICAgIHN0YXRpYyB3aWR0aDpudW1iZXI9NjQwO1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9MTEzNjtcclxuICAgIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwiZml4ZWR3aWR0aFwiO1xyXG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiO1xyXG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgc2NlbmVSb290OnN0cmluZz1cIlwiO1xyXG4gICAgc3RhdGljIGRlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgc3RhdDpib29sZWFuPXRydWU7XHJcbiAgICBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgfVxyXG59XHJcbkdhbWVDb25maWcuaW5pdCgpOyIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuL0dhbWVDb25maWdcIjtcclxuaW1wb3J0IHsgV215VXRpbHMzRCB9IGZyb20gXCIuL3dteVV0aWxzSDUvZDMvV215VXRpbHMzRFwiO1xyXG5pbXBvcnQgeyBXbXlfTG9hZF9NYWcgfSBmcm9tIFwiLi93bXlVdGlsc0g1L1dteV9Mb2FkX01hZ1wiO1xyXG5pbXBvcnQgV215VGFyIGZyb20gXCIuL3Rhci9XbXlUYXJcIjtcclxuY2xhc3MgTWFpbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKSBMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IExheWEuU3RhZ2UuU0NBTEVfU0hPV0FMTDtcclxuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcclxuXHRcdC8v6K6+572u5rC05bmz5a+56b2QXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnbkggPSBcImNlbnRlclwiO1xyXG5cdFx0Ly/orr7nva7lnoLnm7Tlr7npvZBcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduViA9IFwibWlkZGxlXCI7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHRcdFdteVRhci5nZXRUaGlzLmluaXQoKTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0dmFyIHdteVZUaW1lPVwiXCI7XHJcblx0XHRpZih3aW5kb3chPW51bGwgJiYgd2luZG93W1wid215VlRpbWVcIl0hPW51bGwpe1xyXG5cdFx0XHR3bXlWVGltZT13aW5kb3dbXCJ3bXlWVGltZVwiXTtcclxuXHRcdH1cclxuXHRcdC8vTGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIrd215VlRpbWUsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuXHRcdHZhciB1cmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChcInJlcy9sb2FkSW5mby5qc29uXCIpO1xyXG4gICAgICAgIFdteV9Mb2FkX01hZy5nZXRUaGlzLm9uTG9hZFdldERhdGEodXJsLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkxvYWRMb2FkKSk7XHJcblx0fVxyXG5cdFxyXG4gICAgcHJpdmF0ZSBvbkxvYWRMb2FkKCl7XHJcbiAgICAgICAgdmFyIHJlc09iaj1XbXlfTG9hZF9NYWcuZ2V0VGhpcy5nZXRSZXNPYmooXCJsb2FkXCIpO1xyXG4gICAgICAgIGlmKHJlc09iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgIFdteV9Mb2FkX01hZy5nZXRUaGlzLm9ubG9hZChyZXNPYmosbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkTWFpbikpO1xyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG4gICAgcHJpdmF0ZSBfbG9hZFZpZXc6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfYmFyOmZhaXJ5Z3VpLkdQcm9ncmVzc0JhcjtcclxuXHRwcml2YXRlIG9uTG9hZE1haW4oKXtcclxuXHRcdHRoaXMuX2xvYWRWaWV3PWZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJsb2FkXCIsXCJMb2FkXCIpLmFzQ29tO1xyXG5cdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZCh0aGlzLl9sb2FkVmlldyk7XHJcblx0XHR0aGlzLl9iYXI9dGhpcy5fbG9hZFZpZXcuZ2V0Q2hpbGQoXCJiYXJcIikuYXNQcm9ncmVzcztcclxuXHJcbiAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMub25BdXRvTG9hZEFsbChuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uTG9hZGluZyhwcm9ncmVzczogbnVtYmVyKTogdm9pZCB7XHJcblx0XHR0aGlzLl9iYXIudmFsdWU9cHJvZ3Jlc3M7XHJcblx0fVxyXG5cdFxyXG4gICAgcHJpdmF0ZSBfdTNkQXJyO1xyXG4gICAgcHVibGljIHNjZW5lM0Q6TGF5YS5TY2VuZTNEO1xyXG5cdHByaXZhdGUgb25Mb2FkT2sodWlBcnIsdTNkQXJyKXtcclxuXHRcdHRoaXMuX3UzZEFycj11M2RBcnI7XHJcblx0XHRMYXlhLnRpbWVyLm9uY2UoNDAwLHRoaXMsICgpPT57XHJcblx0XHRcdHRoaXMub25NYWluKCk7XHJcblx0XHRcdGZhaXJ5Z3VpLkdSb290Lmluc3QucmVtb3ZlQ2hpbGQodGhpcy5fbG9hZFZpZXcpO1xyXG5cdFx0XHR0aGlzLl9sb2FkVmlldz1udWxsO1xyXG5cdFx0XHR0aGlzLl9iYXI9bnVsbDtcclxuXHRcdH0pO1xyXG5cdFx0Ly/mt7vliqAzROWcuuaZr1xyXG5cdFx0aWYodTNkQXJyWzBdIT1udWxsKXtcclxuXHRcdFx0dmFyIHVybDNkPXUzZEFyclswXS51cmxMaXN0WzBdO1xyXG5cdFx0XHR0aGlzLnNjZW5lM0QgPUxheWEubG9hZGVyLmdldFJlcyh1cmwzZCk7XHJcblx0XHRcdFdteVV0aWxzM0Quc2V0U2hhZGVyQWxsKHRoaXMuc2NlbmUzRCxcInJlcy9tYXRzL1wiLFwicmVzL3NoYWRlcnMvXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuICAgIHByaXZhdGUgX21haW5WaWV3OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgb25NYWluKCl7XHJcblx0XHR0aGlzLl9tYWluVmlldz1mYWlyeWd1aS5VSVBhY2thZ2UuY3JlYXRlT2JqZWN0KFwibWFpblwiLFwiTWFpblwiKS5hc0NvbTtcclxuXHRcdGlmKHRoaXMuX21haW5WaWV3IT1udWxsKXtcclxuXHRcdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZCh0aGlzLl9tYWluVmlldyk7XHJcblx0XHRcdHZhciBfTWFpbj10aGlzLl9tYWluVmlldy5nZXRDaGlsZChcIl9NYWluXCIpLmFzQ29tO1xyXG5cdFx0XHR2YXIgX2QzPV9NYWluLmdldENoaWxkKFwiZDNcIikuYXNDb207XHJcblx0XHRcdGlmKHRoaXMuc2NlbmUzRCE9bnVsbCl7XHJcblx0XHRcdFx0X2QzLmRpc3BsYXlPYmplY3QuYWRkQ2hpbGQodGhpcy5zY2VuZTNEKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215VGFye1xyXG4gICAgcHJpdmF0ZSBfZW5naW5lOiBUQVIuRW5naW5lO1xyXG4gICAgcHJpdmF0ZSBfYXI6IFRBUi5BUjtcclxuICAgIHByaXZhdGUgX3JlbmRlcjogVEFSLlJlbmRlcjtcclxuICAgIHN0YXRpYyBfdGhpczpXbXlUYXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCl7XHJcbiAgICAgICAgaWYoV215VGFyLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215VGFyLl90aGlzPW5ldyBXbXlUYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteVRhci5fdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpe1xyXG5cdFx0dGhpcy5fcmVuZGVyID0gbmV3IFRBUi5SZW5kZXIoKTtcclxuXHRcdHRoaXMuX2FyID0gbmV3IFRBUi5BUigpO1xyXG4gICAgICAgIHRoaXMuX2VuZ2luZSA9IG5ldyBUQVIuRW5naW5lKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gLyoqXHJcbiAgICAgICAgLy8gICogQW5kcm9pZOmAmui/h+S4u+W+queOr+ebkeaOp+W5s+mdouWdkOagh+eahOWPmOWMlu+8jOmcgOimgeS4u+WKqOiwg+eUqG9uVGFyU3RhdGVDaGFuZ2Vk5Y675pS55Y+Y54q25oCBXHJcbiAgICAgICAgLy8gICogaU9T5bey57uP5bCG5LqL5Lu255uR5ZCs5YaZ5Zyo5LqGdGFyLmpz6YeM6Z2i77yM54q25oCB6Ieq5Yqo5YiH5o2iXHJcbiAgICAgICAgLy8gICovXHJcbiAgICAgICAgLy8gaWYgKFRBUi5FTlYuQU5EUk9JRCkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLl9yZW5kZXIub24oJ1RBUl9TVEFURV9DSEFOR0UnLCAoKSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICBjb25zdCB2ckRpc3BsYXkgPSB0aGlzLl9hci5nZXRWUkRpc3BsYXkoKTtcclxuICAgICAgICAvLyAgICAgICAgIGlmICh2ckRpc3BsYXkgJiYgdGhpcy5fYXIuaXNFbmdpbmVEb3dubG9hZCgpKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uc3QgZnJhbWVEYXRhID0gbmV3IHdpbmRvd1tcIlZSRnJhbWVEYXRhXCJdKCk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdnJEaXNwbGF5LmdldEZyYW1lRGF0YShmcmFtZURhdGEpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnN0IFt4LCB5LCB6XSA9IGZyYW1lRGF0YS5wb3NlLnBvc2l0aW9uO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGlmICh4ID09PSAwICYmICB5ID09PSAwICYmIHogPT09IDApIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5fYXIub25UYXJTdGF0ZUNoYW5nZWQoJ2xpbWl0ZWQnKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLl9hci5vblRhclN0YXRlQ2hhbmdlZCgnbm9ybWFsJyk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIC8vIHRyaWdnZXIgY2FtZXJhIHBvc2l0aW9uIGNoYW5nZSBldmVyeSBmcmFtZVxyXG4gICAgICAgIC8vIHRoaXMuX3JlbmRlci5vbignQ0FNRVJBX1RSQU5TRk9STV9DSEFOR0UnLCAoKSA9PiB7XHJcbiAgICAgICAgLy8gICAgIGNvbnN0IHZyRGlzcGxheSA9ICB0aGlzLl9hci5nZXRWUkRpc3BsYXkoKTtcclxuICAgICAgICAvLyAgICAgLy8g6ZyA6KaB6I635Y+W5YiwdnJEaXNwbGF55a+56LGh5bm25LiUYXLlvJXmk47kuIvlrozmiJDmiY3og73lgZrkuJrliqHpgLvovpFcclxuICAgICAgICAvLyAgICAgaWYgKHZyRGlzcGxheSAmJiAgdGhpcy5fYXIuaXNFbmdpbmVEb3dubG9hZCgpKSB7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLl9lbmdpbmUub25DYW1lcmFUcmFuc2Zvcm1DaGFuZ2UoKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuXHJcblx0XHQvLyByZW5kZXLliJ3lp4vljJbvvIzov5DooYzkuLvlvqrnjq9cclxuXHRcdHRoaXMuX3JlbmRlci5pbml0KCk7XHJcblx0XHRpZiAoVEFSLkVOVi5JT1MpIHtcclxuXHRcdFx0dGhpcy5BUkluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoVEFSLkVOVi5BTkRST0lEKSB7XHJcbiAgICAgICAgICAgIC8vIGFuZHJvaWQgQVLnmoTog73lipvpnIDopoHkuIvovb3miY3mnIlcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNUQVRVU19DSEFOR0Xmlrnms5Xms6jlhow05Liq5LiO5byV5pOO54q25oCB55u45YWz55qEY2FsbGJhY2vlh73mlbBzdGFydCwgbG9hZGluZywgc3VjY2VzcywgZmFpbFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgVEFSLlRBUlV0aWxzLlNUQVRVU19DSEFOR0UoXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjbG9zZSBuYXRpdmUgcHJvZ3Jlc3MgYWZ0ZXIgZG93bmxvYWQgbmF0aXZlIGFyIGVuZ2luZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vTkFUSVZFX1JST0dSRVNTX0NMT1NFKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbml0IEFSIGZhaWwuIFBsYXRmb3JtIGFuZHJvaWQuIGRvd25sb2FkIGVuZ2luZSBlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAvLyB2ciBkaXNwbGF5IOW/hemhu+mmluWFiOWKoOi9ve+8jGFuZHJvaWTlnKh4NeWGheaguOmHjOW3sue7j+acie+8jGlvc+mcgOimgeW8leeUqFdlYkFSb25BUmtpdFxyXG4gICAgICAgICAgICAvLyBhbmRyb2lkIEFS55qE6IO95Yqb6ZyA6KaB5LiL6L295omN5pyJ77yM5L2G5piv5pGE5YOP5aS06IO95Yqb5LiN6ZyA6KaB5LiL6L295byV5pOO77yM5omA5LulcmVuZGVy5Y+v5Lul5o+Q5YmN6L+b6KGM77ybaW9z5pys6Lqr5bCx5pyJ5ZCE56eN6IO95Yqb77yMc2xhbeOAgW1hcmtlcmxlc3Pmsr/nlKhhcmtpdOeahO+8jG1hcmtlciBiYXNl5piv5q2m5rGJ6Ieq56CU55qE77yM5YW25Lit55qEYWRkTWFya2Vy6ZyA6KaB57uI56uv5re75Yqg55qEXHJcbiAgICAgICAgICAgIFRBUi5BUi5pbml0QVJFbmdpbmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IDJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXIuc2V0RW5naW5lRG93bmxvYWQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdJbml0IEFSIHN1Y2Nlc3MuIFBsYXRmb3JtIGFuZHJvaWQuIEFSIEVuZ2luZSBkb3dubG9hZCBzdWNjZXNzLCB5b3UgY2FuIHVzZSBhYmlsaXR5IG9mIHRhciAnXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0luaXQgQVIgZmFpbC4gUGxhdGZvcm0gYW5kcm9pZC4gaW5pdCBmYWlsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMuQVJJbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFSSW5pdCgpIHtcclxuICAgICAgICB0aGlzLl9hci5sb2FkKCkudGhlbigoZGlzcGxheSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIuc2V0VlJEaXNwbGF5KGRpc3BsYXkpO1xyXG4gICAgICAgICAgICB0aGlzLl9lbmdpbmUuY3JlYXRlKCdMYXlhJyk7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBhcuW8leaTjuWKoOi9ve+8jGxvYWTlh73mlbDmnIkz5Liq5Y+C5pWw77yM5ZCO5Lik5Liq5Li65Zue6LCD5Ye95pWwb25TdGFydENhbGxiYWNr5ZKMb25Db21wbGV0ZUNhbGxiYWNrXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLl9lbmdpbmUubG9hZChkaXNwbGF5LCBudWxsLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB0YXNrID0gbmV3IFRhc2soYXIsIHJlbmRlciwgZW5naW5lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBydW4gPSAocHJlU3RhdGUsIG5leHRTdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRhc2sucnVuKHByZVN0YXRlLCBuZXh0U3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpZiAoYXIuZ2V0Q3VycmVudFN0YXRlKCkgPT09ICdub3JtYWwnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgcnVuKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAqICDlsIZydW4gY2FsbGJhY2vms6jlhozliLBhcueahOeKtuaAgei9rOenu+WHveaVsOS4re+8jFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAqICDlvZPosIPnlKhhci5vblRhclN0YXRlQ2hhbmdlZCgnbm9ybWFsJynmiJbogIUgYXIub25UYXJTdGF0ZUNoYW5nZWQoJ2xpbWl0ZWQnKSDvvIwgcnVu5Lya6Kem5Y+R77yMXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICogIOaJgOS7pXJ1buWHveaVsOimgeWBmuS4jeWQjOeKtuaAgemXtOi9rOaNouWkhOeQhlxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAqL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGFyLnNldE5vdEF2YWlsYWJsZTJOb3JtYWxGdW5jKHJ1bik7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgYXIuc2V0TGltaXRlZDJOb3JtYWxGdW5jKHJ1bik7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBleGNlcHRpb24gPSAke2V9YCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJcclxuZXhwb3J0IGNsYXNzIFdteVV0aWxzIGV4dGVuZHMgbGF5YS5ldmVudHMuRXZlbnREaXNwYXRjaGVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzOldteVV0aWxzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteVV0aWxze1xyXG4gICAgICAgIGlmKFdteVV0aWxzLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215VXRpbHMuX3RoaXM9bmV3IFdteVV0aWxzKClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteVV0aWxzLl90aGlzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy8gTGF5YS50aW1lci5mcmFtZUxvb3AoMSx0aGlzLHRoaXMuX19sb29wKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX0RPV04sdGhpcywgdGhpcy5fX29uVG91Y2hEb3duKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX1VQLHRoaXMsIHRoaXMuX19vblRvdWNoVXApO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfTU9WRSx0aGlzLHRoaXMuX19Pbk1vdXNlTU9WRSk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50LlJFU0laRSx0aGlzLHRoaXMuX19vblJlc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIENPTE9SX0ZJTFRFUlNfTUFUUklYOiBBcnJheTxhbnk+PVtcclxuICAgICAgICAwLCAwLCAwLCAwLCAwLCAvL1JcclxuICAgICAgICAwLCAwLCAwLCAwLCAwLCAvL0dcclxuICAgICAgICAwLCAwLCAwLCAwLCAwLCAvL0JcclxuICAgICAgICAwLCAwLCAwLCAxLCAwLCAvL0FcclxuICAgIF07XHJcbiAgICAvL+i9rOaNouminOiJslxyXG4gICAgcHVibGljIGNvbnZlcnRDb2xvclRvQ29sb3JGaWx0ZXJzTWF0cml4KHI6bnVtYmVyLGc6bnVtYmVyLGI6bnVtYmVyLGE/Om51bWJlcik6QXJyYXk8YW55PlxyXG4gICAge1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzBdPXI7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbNl09ZztcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFsxMl09YjtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFsxOF09YXx8MTtcclxuICAgICAgICByZXR1cm4gV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVg7XHJcbiAgICB9XHJcbiAgICAvL+WvueWvueixoeaUueWPmOminOiJslxyXG4gICAgcHVibGljIGFwcGx5Q29sb3JGaWx0ZXJzKHRhcmdldDpMYXlhLlNwcml0ZSxjb2xvcjpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlcnM9bnVsbDtcclxuICAgICAgICBpZihjb2xvciAhPSAweGZmZmZmZil7XHJcbiAgICAgICAgICAgIHRhcmdldC5maWx0ZXJzPVtuZXcgTGF5YS5Db2xvckZpbHRlcih0aGlzLmNvbnZlcnRDb2xvclRvQ29sb3JGaWx0ZXJzTWF0cml4KFxyXG4gICAgICAgICAgICAgICAgKChjb2xvcj4+MTYpICYgMHhmZikvMjU1LFxyXG4gICAgICAgICAgICAgICAgKChjb2xvcj4+OCkgJiAweGZmKS8yNTUsXHJcbiAgICAgICAgICAgICAgICAoY29sb3IgJiAweGZmKS8yNTVcclxuICAgICAgICAgICAgICAgICkpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvL+WvueWvueixoeaUueWPmOminOiJslxyXG4gICAgcHVibGljIGFwcGx5Q29sb3JGaWx0ZXJzMSh0YXJnZXQ6TGF5YS5TcHJpdGUscjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXIsYT86bnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJzPW51bGw7XHJcbiAgICAgICAgaWYociA8IDEgfHwgZyA8IDEgfHwgYiA8IDEgfHwgYSA8IDEpe1xyXG4gICAgICAgICAgICB0YXJnZXQuZmlsdGVycz1bbmV3IExheWEuQ29sb3JGaWx0ZXIodGhpcy5jb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChyLGcsYixhKSldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+WIpOaWreaJi+acuuaIllBDXHJcbiAgICBwdWJsaWMgaXNQYygpOmJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICB2YXIgaXNQYzpib29sZWFuPWZhbHNlO1xyXG4gICAgICAgIGlmKHRoaXMudmVyc2lvbnMoKS5hbmRyb2lkIHx8IHRoaXMudmVyc2lvbnMoKS5pUGhvbmUgfHwgdGhpcy52ZXJzaW9ucygpLmlvcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlzUGM9ZmFsc2U7XHJcbiAgICAgICAgfWVsc2UgaWYodGhpcy52ZXJzaW9ucygpLmlQYWQpe1xyXG4gICAgICAgICAgICBpc1BjPXRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaXNQYz10cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpc1BjO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHZlcnNpb25zKCl7XHJcbiAgICAgICAgdmFyIHU6c3RyaW5nID0gbmF2aWdhdG9yLnVzZXJBZ2VudCwgYXBwOnN0cmluZyA9IG5hdmlnYXRvci5hcHBWZXJzaW9uO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC8v56e75Yqo57uI56uv5rWP6KeI5Zmo54mI5pys5L+h5oGvXHJcbiAgICAgICAgICAgIHRyaWRlbnQ6IHUuaW5kZXhPZignVHJpZGVudCcpID4gLTEsIC8vSUXlhoXmoLhcclxuICAgICAgICAgICAgcHJlc3RvOiB1LmluZGV4T2YoJ1ByZXN0bycpID4gLTEsIC8vb3BlcmHlhoXmoLhcclxuICAgICAgICAgICAgd2ViS2l0OiB1LmluZGV4T2YoJ0FwcGxlV2ViS2l0JykgPiAtMSwgLy/oi7nmnpzjgIHosLfmrYzlhoXmoLhcclxuICAgICAgICAgICAgZ2Vja286IHUuaW5kZXhPZignR2Vja28nKSA+IC0xICYmIHUuaW5kZXhPZignS0hUTUwnKSA9PSAtMSwgLy/ngavni5DlhoXmoLhcclxuICAgICAgICAgICAgbW9iaWxlOiAhIXUubWF0Y2goL0FwcGxlV2ViS2l0LipNb2JpbGUuKi8pfHwhIXUubWF0Y2goL0FwcGxlV2ViS2l0LyksIC8v5piv5ZCm5Li656e75Yqo57uI56uvXHJcbiAgICAgICAgICAgIGlvczogISF1Lm1hdGNoKC9cXChpW147XSs7KCBVOyk/IENQVS4rTWFjIE9TIFgvKSwgLy9pb3Pnu4jnq69cclxuICAgICAgICAgICAgYW5kcm9pZDogdS5pbmRleE9mKCdBbmRyb2lkJykgPiAtMSB8fCB1LmluZGV4T2YoJ0xpbnV4JykgPiAtMSwgLy9hbmRyb2lk57uI56uv5oiW6ICFdWPmtY/op4jlmahcclxuICAgICAgICAgICAgaVBob25lOiB1LmluZGV4T2YoJ2lQaG9uZScpID4gLTEgfHwgdS5pbmRleE9mKCdNYWMnKSA+IC0xLCAvL+aYr+WQpuS4umlQaG9uZeaIluiAhVFRSETmtY/op4jlmahcclxuICAgICAgICAgICAgaVBhZDogdS5pbmRleE9mKCdpUGFkJykgPiAtMSwgLy/mmK/lkKZpUGFkXHJcbiAgICAgICAgICAgIHdlYkFwcDogdS5pbmRleE9mKCdTYWZhcmknKSA9PSAtMSAvL+aYr+WQpndlYuW6lOivpeeoi+W6j++8jOayoeacieWktOmDqOS4juW6lemDqFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVybFYoa2V5OnN0cmluZyl7XHJcbiAgICAgICAgdmFyIHJlZz0gbmV3IFJlZ0V4cChcIihefCYpXCIra2V5K1wiPShbXiZdKikoJnwkKVwiKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkubWF0Y2gocmVnKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0P2RlY29kZVVSSUNvbXBvbmVudChyZXN1bHRbMl0pOm51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTmF2aWdhdGUodXJsOnN0cmluZyxpc1JlcGxhY2U6Ym9vbGVhbj1mYWxzZSl7XHJcbiAgICAgICAgaWYoaXNSZXBsYWNlKXtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UodXJsKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj11cmw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2V2ZW50TGlzdDpBcnJheTxsYXlhLmV2ZW50cy5FdmVudD49bmV3IEFycmF5PGxheWEuZXZlbnRzLkV2ZW50PigpO1xyXG4gICAgcHJpdmF0ZSBfX29uVG91Y2hEb3duKGV2dDogbGF5YS5ldmVudHMuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpPDApe1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3QucHVzaChldnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgX19vblRvdWNoVXAoZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdC5pbmRleE9mKGV2dCk+PTApe1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3Quc3BsaWNlKHRoaXMuX2V2ZW50TGlzdC5pbmRleE9mKGV2dCksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgX19vblJlc2l6ZSgpe1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdC5mb3JFYWNoKGV2dCA9PiB7XHJcbiAgICAgICAgICAgIGV2dC50eXBlPUxheWEuRXZlbnQuTU9VU0VfVVA7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2UuZXZlbnQoTGF5YS5FdmVudC5NT1VTRV9VUCxldnQpO1xyXG5cdFx0fSk7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0PW5ldyBBcnJheTxsYXlhLmV2ZW50cy5FdmVudD4oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfX09uTW91c2VNT1ZFKGV2dDogbGF5YS5ldmVudHMuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICB2YXIgYk51bT0xMDtcclxuICAgICAgICBpZihldnQuc3RhZ2VYIDw9IGJOdW0gfHwgZXZ0LnN0YWdlWCA+PSBMYXlhLnN0YWdlLndpZHRoLWJOdW0gfHxcclxuICAgICAgICAgICAgZXZ0LnN0YWdlWSA8PSBiTnVtIHx8IGV2dC5zdGFnZVkgPj0gTGF5YS5zdGFnZS5oZWlnaHQtYk51bSl7XHJcbiAgICAgICAgICAgIGV2dC50eXBlPUxheWEuRXZlbnQuTU9VU0VfVVA7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2UuZXZlbnQoTGF5YS5FdmVudC5NT1VTRV9VUCxldnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25OdW1UbyhuLGw9Mil7XHJcblx0XHRpZigobitcIlwiKS5pbmRleE9mKFwiLlwiKT49MCl7XHJcblx0XHQgICAgbj1wYXJzZUZsb2F0KG4udG9GaXhlZChsKSk7XHJcbiAgICAgICAgfVxyXG5cdFx0cmV0dXJuIG47XHJcblx0fVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Ul9YWShkLCByKVxyXG4gICAge1xyXG4gICAgXHR2YXIgcmFkaWFuID0gKHIgKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgIFx0dmFyIGNvcyA9ICBNYXRoLmNvcyhyYWRpYW4pO1xyXG4gICAgXHR2YXIgc2luID0gIE1hdGguc2luKHJhZGlhbik7XHJcbiAgICBcdFxyXG4gICAgXHR2YXIgZHg9ZCAqIGNvcztcclxuICAgIFx0dmFyIGR5PWQgKiBzaW47XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgTGF5YS5Qb2ludChkeCAsIGR5KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgcHVibGljIHN0YXRpYyBzdHJpbmcyYnVmZmVyKHN0cik6QXJyYXlCdWZmZXIge1xyXG4gICAgICAgIC8vIOmmluWFiOWwhuWtl+espuS4sui9rOS4ujE26L+b5Yi2XHJcbiAgICAgICAgbGV0IHZhbCA9IFwiXCJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh2YWwgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHZhbCA9IHN0ci5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbCArPSAnLCcgKyBzdHIuY2hhckNvZGVBdChpKS50b1N0cmluZygxNilcclxuICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOWwhjE26L+b5Yi26L2s5YyW5Li6QXJyYXlCdWZmZXJcclxuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkodmFsLm1hdGNoKC9bXFxkYS1mXXsyfS9naSkubWFwKGZ1bmN0aW9uIChoKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGgsIDE2KVxyXG4gICAgICAgIH0pKS5idWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZXBsYWNlQWxsKHN0ciwgb2xkU3RyLCBuZXdTdHIpeyAgXHJcbiAgICAgICAgdmFyIHRlbXAgPSAnJzsgIFxyXG4gICAgICAgIHRlbXAgPSBzdHIucmVwbGFjZShvbGRTdHIsIG5ld1N0cik7XHJcbiAgICAgICAgaWYodGVtcC5pbmRleE9mKG9sZFN0cik+PTApe1xyXG4gICAgICAgICAgICB0ZW1wID0gdGhpcy5yZXBsYWNlQWxsKHRlbXAsIG9sZFN0ciwgbmV3U3RyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7ICBcclxuICAgIH0gIFxyXG5cclxuICAgIC8v5aSn5bCP5YaZ6L2s5o2iXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvQ2FzZShzdHI6c3RyaW5nLCBpc0R4PWZhbHNlKXsgIFxyXG4gICAgICAgIHZhciB0ZW1wID0gJyc7XHJcbiAgICAgICAgaWYoIWlzRHgpe1xyXG4gICAgICAgICAgICAvL+i9rOaNouS4uuWwj+WGmeWtl+avjVxyXG4gICAgICAgICAgICB0ZW1wPXN0ci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAvL+i9rOWMluS4uuWkp+WGmeWtl+avjVxyXG4gICAgICAgICAgICB0ZW1wPXN0ci50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDsgIFxyXG4gICAgfSBcclxuXHJcbiAgICBcclxuICAgIC8v6Led56a7XHJcblx0cHVibGljIHN0YXRpYyBnZXREaXN0YW5jZShhOkxheWEuUG9pbnQsYjpMYXlhLlBvaW50KTpudW1iZXIge1xyXG5cdFx0dmFyIGR4ID0gTWF0aC5hYnMoYS54IC0gYi54KTtcclxuXHRcdHZhciBkeSA9IE1hdGguYWJzKGEueSAtIGIueSk7XHJcblx0XHR2YXIgZD1NYXRoLnNxcnQoTWF0aC5wb3coZHgsIDIpICsgTWF0aC5wb3coZHksIDIpKTtcclxuXHRcdGQ9cGFyc2VGbG9hdChkLnRvRml4ZWQoMikpO1xyXG5cdFx0cmV0dXJuIGQ7XHJcblx0fVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0WHlUb1IoeSx4KTpudW1iZXJ7XHJcbiAgICAgICAgdmFyIHJhZGlhbj1NYXRoLmF0YW4yKHkseCk7XHJcbiAgICAgICAgdmFyIHI9KDE4MC9NYXRoLlBJKnJhZGlhbik7XHJcbiAgICAgICAgcj10aGlzLm9uTnVtVG8ocik7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzdG9yYWdlKGtleSwgdmFsdWU6YW55PVwiP1wiLCBpc0xvY2FsPXRydWUpOmFueXtcclxuICAgICAgICB2YXIgc3RvcmFnZTphbnk9aXNMb2NhbD9sb2NhbFN0b3JhZ2U6c2Vzc2lvblN0b3JhZ2U7XHJcbiAgICAgICAgaWYodmFsdWU9PVwiP1wiKXtcclxuXHRcdFx0dmFyIGRhdGEgPSBzdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKHZhbHVlPT1udWxsKXtcclxuXHRcdFx0c3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRzdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XHJcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5RnVpU291bmQoX3VybCx2b2x1bWU9MC4yLGNvbXBsZXRlSGFuZGxlcj8sc3RhcnRUaW1lPTAsbG9vcHM9MSl7XHJcbiAgICAgICAgaWYodm9sdW1lPD0wKXJldHVybjtcclxuICAgICAgICB2YXIgaXRlbT1mYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbUJ5VVJMKF91cmwpO1xyXG4gICAgICAgIHZhciB1cmw9aXRlbS5maWxlO1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZCh1cmwsbG9vcHMsY29tcGxldGVIYW5kbGVyLG51bGwsc3RhcnRUaW1lKTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5zZXRTb3VuZFZvbHVtZSh2b2x1bWUsdXJsKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFdteVV0aWxzIH0gZnJvbSBcIi4vV215VXRpbHNcIjtcclxuaW1wb3J0IHsgV215TG9hZDNkIH0gZnJvbSBcIi4vZDMvV215TG9hZDNkXCI7XHJcbmltcG9ydCB7IFdteUxvYWRNYXRzIH0gZnJvbSBcIi4vZDMvV215TG9hZE1hdHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlfTG9hZF9NYWdcclxue1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215X0xvYWRfTWFne1xyXG4gICAgICAgIGlmKFdteV9Mb2FkX01hZy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteV9Mb2FkX01hZy5fdGhpcz1uZXcgV215X0xvYWRfTWFnKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlfTG9hZF9NYWcuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF93ZXREYXRhOmFueT17fTtcclxuXHJcbiAgICBwdWJsaWMgcmVzVXJsOnN0cmluZz1cIlwiO1xyXG4gICAgcHVibGljIGdldFdldERhdGEodXJsOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dldERhdGFbdXJsXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNldFdldERhdGEob2JqOmFueSx1cmw/OnN0cmluZyl7XHJcbiAgICAgICAgaWYodGhpcy5yZXNVcmw9PVwiXCIpe1xyXG4gICAgICAgICAgICB0aGlzLnJlc1VybD11cmw7XHJcbiAgICAgICAgICAgIHZhciBhcnI9bnVsbDtcclxuICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgYXJyPUpTT04ucGFyc2Uob2JqKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHVybD09bnVsbCl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLnJlc1VybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fd2V0RGF0YVt1cmxdPW9iajtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldFJlc09iaihyZXNOYW1lOnN0cmluZyx1cmw/KXtcclxuICAgICAgICB2YXIgd2ViRGF0YTphbnk7XHJcbiAgICAgICAgaWYodXJsPT1udWxsKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMucmVzVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3ZWJEYXRhPXRoaXMuZ2V0V2V0RGF0YSh1cmwpO1xyXG4gICAgICAgIGlmKHdlYkRhdGE9PW51bGwpe1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLnqbrmlbDmja5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYXJyOkFycmF5PGFueT49bnVsbDtcclxuICAgICAgICBpZih3ZWJEYXRhIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBhcnI9d2ViRGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYXJyPT1udWxsKXtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycj1KU09OLnBhcnNlKHdlYkRhdGEpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIsd2ViRGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzT2JqPW51bGw7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9YXJyW2ldO1xyXG4gICAgICAgICAgICBpZihvYmpbXCJyZXNOYW1lXCJdPT1yZXNOYW1lKXtcclxuICAgICAgICAgICAgICAgIHJlc09iaj1vYmo7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzT2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkxvYWRXZXREYXRhKHVybDpzdHJpbmcsY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIGlmKHVybD09XCJcIilyZXR1cm47XHJcbiAgICAgICAgaWYodGhpcy5nZXRXZXREYXRhKHVybCkhPW51bGwpe1xyXG4gICAgICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW3RoaXMuZ2V0V2V0RGF0YSh1cmwpXSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxvYWQ9TGF5YS5sb2FkZXIubG9hZCh1cmwsbmV3IExheWEuSGFuZGxlcih0aGlzLGZ1bmN0aW9uKG9iail7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0V2V0RGF0YShvYmosdXJsKTtcclxuICAgICAgICAgICAgY2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLl93ZXREYXRhW3VybF1dKTtcclxuICAgICAgICB9KSlcclxuICAgICAgICByZXR1cm4gbG9hZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZXNEYXRhQXJyOkFycmF5PGFueT49W107XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja09rOkFycmF5PGFueT49W107XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkFycmF5PGFueT49W107XHJcbiAgICBwdWJsaWMgb25sb2FkKHJlc09iajphbnksY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgcmVzTmFtZT1yZXNPYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgIGlmKHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdLnJ1bldpdGgoW3RoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc09ialtcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6YW55PXt9O1xyXG4gICAgICAgICAgICB2YXIgcmVzRGF0YTpzdHJpbmc9cmVzT2JqW1wicmVzRGF0YVwiXTtcclxuICAgICAgICAgICAgaWYocmVzRGF0YSE9bnVsbCAmJiByZXNEYXRhIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YT1KU09OLnBhcnNlKHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIixyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWVVcmw7XHJcbiAgICAgICAgICAgIHZhciB1cmxBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdmFyIGlzQ3JlYXRlPWZhbHNlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc1VybD1XbXlVdGlscy50b0Nhc2UocmVzVXJsKTtcclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgaWYodXJsLmluZGV4T2YoXCIudHh0XCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLkJVRkZFUn0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJOYW1lVXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodXJsLmluZGV4T2YoXCIuanBnXCIpPj0wIHx8IHVybC5pbmRleE9mKFwiLnBuZ1wiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5JTUFHRX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih1cmwuaW5kZXhPZihcIi5tcDNcIik+PTAgfHwgdXJsLmluZGV4T2YoXCIud2F2XCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLlNPVU5EfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsQXJyLmxlbmd0aDw9MClyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsQXJyLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uQXNzZXRDb25tcGxldGUsW3Jlc05hbWUsYk5hbWVVcmwsZGF0YV0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkFzc2V0UHJvZ3Jlc3MsIFtyZXNOYW1lXSwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgb25sb2FkM2QocmVzT2JqOmFueSxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNOYW1lPXJlc09ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgaWYodGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0ucnVuV2l0aChbdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzT2JqW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTphbnk9e307XHJcbiAgICAgICAgICAgIHZhciByZXNEYXRhOnN0cmluZz1yZXNPYmpbXCJyZXNEYXRhXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNEYXRhIT1udWxsICYmIHJlc0RhdGEhPVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhPUpTT04ucGFyc2UocmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZTtcclxuICAgICAgICAgICAgdmFyIHVybEFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB2YXIgdXJsTGlzdDpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsLmluZGV4T2YoXCIubHNcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsQXJyLmxlbmd0aDw9MClyZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGEudXJsTGlzdD11cmxMaXN0O1xyXG4gICAgICAgICAgICBXbXlMb2FkM2QuZ2V0VGhpcy5vbmxvYWQzZCh1cmxBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Bc3NldENvbm1wbGV0ZSxbcmVzTmFtZSxiTmFtZSxkYXRhXSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQXNzZXRQcm9ncmVzcywgW3Jlc05hbWVdLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcblx0cHJpdmF0ZSBvbkFzc2V0UHJvZ3Jlc3MocmVzTmFtZSxwcm9ncmVzcyk6IHZvaWQge1xyXG4gICAgICAgIHZhciBjYWxsYmFja1Byb2dyZXNzQXJyOkFycmF5PExheWEuSGFuZGxlcj49dGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrUHJvZ3Jlc3NBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gY2FsbGJhY2tQcm9ncmVzc0FycltpXTtcclxuICAgICAgICAgICAgY2FsbGJhY2sucnVuV2l0aChbcHJvZ3Jlc3NdKTtcclxuICAgICAgICB9XHJcblx0fVxyXG4gICAgXHJcbiAgICBwcml2YXRlIG9uQXNzZXRDb25tcGxldGUocmVzTmFtZSxiTmFtZVVybDpzdHJpbmcsZGF0YSk6dm9pZHtcclxuICAgICAgICB2YXIgY2FsbGJhY2tPa0FycjpBcnJheTxMYXlhLkhhbmRsZXI+PXRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV07XHJcbiAgICAgICAgaWYoYk5hbWVVcmwhPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgYmFvPUxheWEubG9hZGVyLmdldFJlcyhiTmFtZVVybCk7XHJcbiAgICAgICAgICAgIHZhciBiTmFtZSA9IGJOYW1lVXJsLnJlcGxhY2UoXCIudHh0XCIsXCJcIik7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBmYWlyeWd1aS5VSVBhY2thZ2UuYWRkUGFja2FnZShiTmFtZSxiYW8pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRlVJLeWHuumUmTpcIixiTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lQXJyPWJOYW1lLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgZGF0YS5iTmFtZT1iTmFtZUFycltiTmFtZUFyci5sZW5ndGgtMV07XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV09ZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja09rQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFja09rID0gY2FsbGJhY2tPa0FycltpXTtcclxuICAgICAgICAgICAgY2FsbGJhY2tPay5ydW5XaXRoKFtkYXRhXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09bnVsbDtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPW51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRJbmZvQXJyOmFueTtcclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkckNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25BdXRvTG9hZEFsbChjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciB3ZWJEYXRhOmFueT10aGlzLmdldFdldERhdGEodGhpcy5yZXNVcmwpO1xyXG4gICAgICAgIGlmKHdlYkRhdGE9PW51bGwpe1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLnqbrmlbDmja5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYXJyOkFycmF5PGFueT49bnVsbDtcclxuICAgICAgICBpZih3ZWJEYXRhIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICBhcnI9d2ViRGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYXJyPT1udWxsKXtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycj1KU09OLnBhcnNlKHdlYkRhdGEpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIsd2ViRGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0Fycj17fTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl09MDtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdPTA7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl09W107XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdPVtdO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPWFycltpXTtcclxuICAgICAgICAgICAgdmFyIHJlc05hbWU9b2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICAgICAgdmFyIHQ9b2JqW1widHlwZVwiXTtcclxuICAgICAgICAgICAgaWYocmVzTmFtZT09bnVsbCB8fCByZXNOYW1lPT1cIlwiIHx8IHQ9PW51bGwgfHwgdD09XCJcIiljb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5vbkF1dG9Mb2FkT2JqKHQscmVzTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25BdXRvTG9hZE9iaih0eXBlOnN0cmluZyxyZXNOYW1lKXtcclxuICAgICAgICB2YXIgcmVzPXRoaXMuZ2V0UmVzT2JqKHJlc05hbWUpO1xyXG4gICAgICAgIGlmKHJlcz09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIHJlc0lkPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdPXt9O1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJuXCJdPXJlc05hbWU7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInRcIl09dHlwZTtcclxuICAgICAgICB2YXIgbG9hZE9rPWZhbHNlO1xyXG4gICAgICAgIGlmKHR5cGU9PVwidWlcIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInVpLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkM2QocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ1M2Qt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGU9PVwibWF0c1wiKXtcclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc1tcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgdmFyIHVybExpc3Q6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIHJlc1VybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHJlc1VybCk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICB1cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxMaXN0Lmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgIFdteUxvYWRNYXRzLmdldFRoaXMub25sb2FkM2QodXJsTGlzdCxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICAgICAgbG9hZE9rPXRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIm1hdHMt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGU9PVwiY3ViZU1hcFwiKXtcclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc1tcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgTGF5YS5UZXh0dXJlQ3ViZS5sb2FkKHVybCxudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGU9PVwiYXVkaW9cIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImF1ZGlvLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEN1YmUocmVzTmFtZSwgY29tcGxldGU6IExheWEuSGFuZGxlcik6QXJyYXk8TGF5YS5UZXh0dXJlQ3ViZT57XHJcbiAgICAgICAgdmFyIHJlcz10aGlzLmdldFJlc09iaihyZXNOYW1lKTtcclxuICAgICAgICBpZihyZXM9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgdmFyIFJlc3Jlc09iajpBcnJheTxMYXlhLlRleHR1cmVDdWJlPj1bXTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgcmVzVXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgocmVzVXJsKTtcclxuICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgIExheWEuVGV4dHVyZUN1YmUubG9hZCh1cmwsbmV3IExheWEuSGFuZGxlcih0aGlzLGN1YmU9PntcclxuICAgICAgICAgICAgICAgIFJlc3Jlc09ialtpXT1jdWJlO1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGUucnVuV2l0aChbY3ViZSxpXSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFJlc3Jlc09iajtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uTG9hZGluZyhyZXNJZCwgcHJvZ3Jlc3M6bnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInBcIl09cHJvZ3Jlc3M7XHJcbiAgICAgICAgdmFyIG51bT10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl07XHJcbiAgICAgICAgdmFyIHBOdW09MDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPG51bTtpKyspe1xyXG4gICAgICAgICAgICB2YXIgcD10aGlzLl9hdXRvTG9hZEluZm9BcnJbaV1bXCJwXCJdO1xyXG4gICAgICAgICAgICBpZihwIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHBOdW0rPXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHBDPShwTnVtL3RoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSkqMTAwO1xyXG4gICAgICAgIGlmKGlzTmFOKHBDKSlwQz0wO1xyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BDXSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkxvYWRPayhyZXNJZCxkYXRhPyl7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXSs9MTtcclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT09XCJ1aVwiKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl0ucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdPj10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0pe1xyXG4gICAgICAgICAgICBpZih0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widWlBcnJcIl0sdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiZXhwb3J0IGNsYXNzIFdteUxvYWQzZHtcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteUxvYWQzZHtcclxuICAgICAgICBpZihXbXlMb2FkM2QuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlMb2FkM2QuX3RoaXM9bmV3IFdteUxvYWQzZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215TG9hZDNkLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VybExpc3Q6QXJyYXk8c3RyaW5nPjtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIF91cmxMaXN0PVtdO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx1cmxMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgdXJsPXVybExpc3RbaV07XHJcbiAgICAgICAgICAgIHVybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHVybCk7XHJcbiAgICAgICAgICAgIF91cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgLy8gb2JqW1widXJsXCJdKz1cIj93bXlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBudW09MDtcclxuICAgICAgICB2YXIgcE51bT0wO1xyXG4gICAgICAgIHZhciBpc1A9ZmFsc2U7XHJcbiAgICAgICAgdmFyIF9Qcm9ncmVzcz0ocCk9PntcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocCk7XHJcbiAgICAgICAgICAgIHBudW0rPTAuMDE7XHJcbiAgICAgICAgICAgIC8vIGlmKGlzUCl7XHJcbiAgICAgICAgICAgIC8vICAgICBwTnVtID0gcG51bSsocCkqMC45O1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGVsc2V7XHJcbiAgICAgICAgICAgIC8vICAgICBwTnVtID0gcG51bTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBpZihwbnVtPj0wLjEgfHwgcD09MSl7XHJcbiAgICAgICAgICAgIC8vICAgICBpc1A9dHJ1ZTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICBpZihwbnVtPjEpcG51bT0xO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcG51bV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBfb25Paz0oKT0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKF91cmxMaXN0LG5ldyBMYXlhLkhhbmRsZXIobnVsbCxfb25PayksTGF5YS5IYW5kbGVyLmNyZWF0ZShudWxsLF9Qcm9ncmVzcyxudWxsLGZhbHNlKSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBwcml2YXRlIF9tQXJyOkFycmF5PHN0cmluZz49W107XHJcbiAgICBwcml2YXRlIF9tTnVtPTA7XHJcbiAgICBwcml2YXRlIF9tUD0wO1xyXG4gICAgcHJpdmF0ZSBfbVAyPTA7XHJcblxyXG4gICAgcHJpdmF0ZSBfX29ubHNVcmxBcnJPayhsc1VybEFycjpBcnJheTxzdHJpbmc+KXtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGxzVXJsQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPWxzVXJsQXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgdXJsPW9ialtcInVybFwiXTtcclxuICAgICAgICAgICAgdmFyIHMwPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIHZhciBzMT11cmwucmVwbGFjZShzMFtzMC5sZW5ndGgtMV0sXCJcIik7XHJcbiAgICAgICAgICAgIHZhciByb290VXJsPXMxO1xyXG4gICAgICAgICAgICB2YXIgdHh0PUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICB2YXIganNPYmo9SlNPTi5wYXJzZSh0eHQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fX3RpUXVVcmwoanNPYmpbXCJkYXRhXCJdLHJvb3RVcmwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLl9tQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5fbUFycltpXTtcclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uQXJyT2spLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25BcnJQKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX19vbkFyclAocCl7XHJcbiAgICAgICAgdmFyIHBOdW09cCoodGhpcy5fbU51bSsxKTtcclxuICAgICAgICBpZihwTnVtPnRoaXMuX21QKXRoaXMuX21QPXBOdW07XHJcbiAgICAgICAgdGhpcy5fbVAyPSh0aGlzLl9tUC90aGlzLl9tQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHBOdW09KHRoaXMuX21QMikqMC45ODtcclxuICAgICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwTnVtXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uQXJyT2soKXtcclxuICAgICAgICB0aGlzLl9tTnVtKz0xO1xyXG4gICAgICAgIGlmKHRoaXMuX21OdW0+PXRoaXMuX21BcnIubGVuZ3RoKXtcclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHRoaXMuX3VybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCgpPT57XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX190aVF1VXJsKG9iaix1cmw6c3RyaW5nPVwiXCIpe1xyXG4gICAgICAgIGlmKG9ialtcInByb3BzXCJdIT1udWxsICYmIG9ialtcInByb3BzXCJdW1wibWVzaFBhdGhcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgbWVzaFBhdGg9dXJsK29ialtcInByb3BzXCJdW1wibWVzaFBhdGhcIl07XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihtZXNoUGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2gobWVzaFBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbHM6QXJyYXk8YW55Pj1vYmpbXCJwcm9wc1wiXVtcIm1hdGVyaWFsc1wiXTtcclxuICAgICAgICAgICAgaWYobWF0ZXJpYWxzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaWk9MDtpaTxtYXRlcmlhbHMubGVuZ3RoO2lpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXRoPXVybCttYXRlcmlhbHNbaWldW1wicGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YocGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqW1wiY29tcG9uZW50c1wiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBjb21wb25lbnRzOkFycmF5PGFueT49b2JqW1wiY29tcG9uZW50c1wiXTtcclxuICAgICAgICAgICAgaWYoY29tcG9uZW50cy5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpMCA9IDA7IGkwIDwgY29tcG9uZW50cy5sZW5ndGg7IGkwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcCA9IGNvbXBvbmVudHNbaTBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbXBbXCJhdmF0YXJcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXBhdGg9dXJsK2NvbXBbXCJhdmF0YXJcIl1bXCJwYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YoYXBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKGFwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihjb21wW1wibGF5ZXJzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheWVyczpBcnJheTxhbnk+PWNvbXBbXCJsYXllcnNcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkxID0gMDsgaTEgPCBsYXllcnMubGVuZ3RoOyBpMSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXIgPSBsYXllcnNbaTFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlczpBcnJheTxhbnk+PWxheWVyW1wic3RhdGVzXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpMiA9IDA7IGkyIDwgc3RhdGVzLmxlbmd0aDsgaTIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHN0YXRlc1tpMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsaXBQYXRoPXVybCtzdGF0ZVtcImNsaXBQYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihjbGlwUGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChjbGlwUGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjaGlsZDpBcnJheTxhbnk+PW9ialtcImNoaWxkXCJdO1xyXG4gICAgICAgIGlmKGNoaWxkIT1udWxsICYmIGNoaWxkLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxjaGlsZC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX190aVF1VXJsKGNoaWxkW2ldLHVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxufSIsImV4cG9ydCBjbGFzcyBXbXlMb2FkTWF0c3tcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteUxvYWRNYXRze1xyXG4gICAgICAgIGlmKFdteUxvYWRNYXRzLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215TG9hZE1hdHMuX3RoaXM9bmV3IFdteUxvYWRNYXRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlMb2FkTWF0cy5fdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jYWxsYmFja09rOkxheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9ubG9hZDNkKHVybExpc3Q6QXJyYXk8c3RyaW5nPixjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmxMaXN0LExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25VcmxBcnJPayxbdXJsTGlzdF0pKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbWF0c1VybEFycjpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgcHJpdmF0ZSBfbWF0T2s9ZmFsc2U7XHJcbiAgICBwcml2YXRlIF9tYXROdW09MDtcclxuICAgIHByaXZhdGUgX21hdFA9MDtcclxuICAgIHByaXZhdGUgX21hdFAyPTA7XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uVXJsQXJyT2sodXJsTGlzdDpBcnJheTxzdHJpbmc+KXtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHVybExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciB1cmw9dXJsTGlzdFtpXTtcclxuICAgICAgICAgICAgLy8gdmFyIHR4dD1MYXlhLmxvYWRlci5nZXRSZXModXJsKTtcclxuICAgICAgICAgICAgLy8gdmFyIGpzT2JqPUpTT04ucGFyc2UodHh0KTtcclxuICAgICAgICAgICAgdmFyIGpzT2JqPUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFycj11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICB2YXIgbWF0c1VybD11cmwucmVwbGFjZShhcnJbYXJyLmxlbmd0aC0xXSxcIlwiKTtcclxuICAgICAgICAgICAgdmFyIGFycmF5OkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheT1qc09ialtcIm1hdHNcIl07XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhcnJheS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IGFycmF5W2pdO1xyXG4gICAgICAgICAgICAgICAgaWYob2JqW1widGFyZ2V0TmFtZVwiXT09XCJcIiljb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXRVcmw9bWF0c1VybCtvYmpbXCJtYXRVcmxcIl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRzVXJsQXJyLnB1c2gobWF0VXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLl9tYXRzVXJsQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5fbWF0c1VybEFycltpXTtcclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTWF0QXJyT2spLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25NYXRBcnJQKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX19vbk1hdEFyclAocCl7XHJcbiAgICAgICAgdmFyIHBOdW09cCoodGhpcy5fbWF0TnVtKzEpO1xyXG4gICAgICAgIGlmKHBOdW0+dGhpcy5fbWF0UCl0aGlzLl9tYXRQPXBOdW07XHJcbiAgICAgICAgdGhpcy5fbWF0UDI9KHRoaXMuX21hdFAvdGhpcy5fbWF0c1VybEFyci5sZW5ndGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3RoaXMuX21hdFAyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX19vbk1hdEFyck9rKCl7XHJcbiAgICAgICAgdGhpcy5fbWF0TnVtKz0xO1xyXG4gICAgICAgIGlmKHRoaXMuX21hdE51bT49dGhpcy5fbWF0c1VybEFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxufSIsIlxyXG5leHBvcnQgY2xhc3MgV215U2hhZGVyTXNne1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW1cdHRhcmdldFx05a+56LGhXHJcbiAgICAgKiBAcGFyYW1cdG1hdFx05p2Q6LSoXHJcbiAgICAgKiBAcGFyYW1cdHNoYWRlclVybFx0c2hhZGVy55qE5Zyw5Z2AXHJcbiAgICAgKiBAcGFyYW1cdGlzTmV3TWF0ZXJpYVx05piv5ZCm5paw5p2Q6LSoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0U2hhZGVyKHRhcmdldCwgbWF0OkxheWEuQmFzZU1hdGVyaWFsLCBzaGFkZXJVcmw6c3RyaW5nLCBpc05ld01hdGVyaWE9ZmFsc2UsIHBEYXRhPzphbnkpOkxheWEuQmFzZU1hdGVyaWFse1xyXG4gICAgICAgIHZhciByZW5kZXJlcjpMYXlhLkJhc2VSZW5kZXI7XHJcbiAgICAgICAgdmFyIHNoYXJlZE1hdGVyaWFsOiBMYXlhLkJhc2VNYXRlcmlhbDtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICByZW5kZXJlcj0odGFyZ2V0IGFzIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCkuc2tpbm5lZE1lc2hSZW5kZXJlcjtcclxuICAgICAgICAgICAgaWYocmVuZGVyZXI9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgICAgICBzaGFyZWRNYXRlcmlhbD1yZW5kZXJlci5zaGFyZWRNYXRlcmlhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgcmVuZGVyZXI9KHRhcmdldCBhcyBMYXlhLk1lc2hTcHJpdGUzRCkubWVzaFJlbmRlcmVyO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJlcj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXJlbmRlcmVyLnNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihpc05ld01hdGVyaWEpe1xyXG4gICAgICAgICAgICBzaGFyZWRNYXRlcmlhbD1zaGFyZWRNYXRlcmlhbC5jbG9uZSgpO1xyXG4gICAgICAgICAgICByZW5kZXJlci5zaGFyZWRNYXRlcmlhbD1zaGFyZWRNYXRlcmlhbDtcclxuICAgICAgICB9XHJcblx0XHRmb3IodmFyIGtleSBpbiBtYXQpe1xyXG5cdFx0XHR0cnkge1xyXG4gICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWxba2V5XT1tYXRba2V5XTtcclxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoc2hhZGVyVXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLnNoYWRlckNvbm1wbGV0ZSxbc2hhcmVkTWF0ZXJpYWwscERhdGFdKSk7XHJcbiAgICAgICAgcmV0dXJuIHNoYXJlZE1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHNoYWRlckNvbm1wbGV0ZShzaGFyZWRNYXRlcmlhbDpMYXlhLkJhc2VNYXRlcmlhbCwgcERhdGE6YW55LCBkYXRhKXtcclxuICAgICAgICBpZihkYXRhPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgeG1sPW51bGxcclxuICAgICAgICB0cnlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHhtbCA9IExheWEuVXRpbHMucGFyc2VYTUxGcm9tU3RyaW5nKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHhtbE5vZGU6Tm9kZSA9IHhtbC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICAgICAgdmFyIHNoYWRlck5hbWU9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUoeG1sTm9kZSxcIm5hbWVcIik7XHJcblxyXG4gICAgICAgIHZhciBpLG8sb05hbWUsdjAsdjEsaW5pdFY7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU1hcD17fTtcclxuICAgICAgICB2YXIgYXR0cmlidXRlTWFwTm9kZT10aGlzLmdldE5vZGUoeG1sTm9kZSxcImF0dHJpYnV0ZU1hcFwiKTtcclxuICAgICAgICB2YXIgYXR0cmlidXRlTWFwQXJyPXRoaXMuZ2V0Tm9kZUFycihhdHRyaWJ1dGVNYXBOb2RlLFwiZGF0YVwiKTtcclxuICAgICAgICBmb3IoaT0wO2k8YXR0cmlidXRlTWFwQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBvID0gYXR0cmlidXRlTWFwQXJyW2ldO1xyXG4gICAgICAgICAgICBvTmFtZT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwibmFtZVwiKTtcclxuICAgICAgICAgICAgdjA9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcInYwXCIpO1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVNYXBbb05hbWVdPXRoaXMuZ2V0Vih2MCxcImludFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB1bmlmb3JtTWFwPXt9O1xyXG4gICAgICAgIHZhciB1bmlmb3JtTWFwTm9kZT10aGlzLmdldE5vZGUoeG1sTm9kZSxcInVuaWZvcm1NYXBcIik7XHJcbiAgICAgICAgdmFyIHVuaWZvcm1NYXBBcnI9dGhpcy5nZXROb2RlQXJyKHVuaWZvcm1NYXBOb2RlLFwiZGF0YVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHdteVZhbHVlcz1zaGFyZWRNYXRlcmlhbFtcIndteVZhbHVlc1wiXTtcclxuICAgICAgICBpZih3bXlWYWx1ZXMhPW51bGwgJiYgd215VmFsdWVzW1wiY3ViZVwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBjdWJlTmFtZT13bXlWYWx1ZXNbXCJjdWJlXCJdO1xyXG4gICAgICAgICAgICBpZihwRGF0YSE9bnVsbCAmJiBwRGF0YVtcImN1YmVGdW5cIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgcERhdGFbXCJjdWJlRnVuXCJdKHNoYXJlZE1hdGVyaWFsLGN1YmVOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoaT0wO2k8dW5pZm9ybU1hcEFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgaW5pdFY9bnVsbDtcclxuICAgICAgICAgICAgbyA9IHVuaWZvcm1NYXBBcnJbaV07XHJcbiAgICAgICAgICAgIG9OYW1lPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJuYW1lXCIpO1xyXG4gICAgICAgICAgICB2MD10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwidjBcIik7XHJcbiAgICAgICAgICAgIHYxPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJ2MVwiKTtcclxuICAgICAgICAgICAgdmFyIHZBcnI9W107XHJcbiAgICAgICAgICAgIHZBcnJbMF09dGhpcy5nZXRWKHYwLFwiaW50XCIpO1xyXG4gICAgICAgICAgICB2QXJyWzFdPXRoaXMuZ2V0Vih2MSxcImludFwiKTtcclxuICAgICAgICAgICAgdW5pZm9ybU1hcFtvTmFtZV09dkFycjtcclxuXHJcbiAgICAgICAgICAgIGlmKHdteVZhbHVlcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpbml0Vj13bXlWYWx1ZXNbb05hbWVdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2luaXRWPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJpbml0VlwiKTtcclxuICAgICAgICAgICAgaWYoaW5pdFYhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgaW5pdFYgPSBpbml0Vi5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICBpZihpbml0Vi5sZW5ndGg9PTQpe1xyXG4gICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IodkFyclswXSxuZXcgTGF5YS5WZWN0b3I0KHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pLHBhcnNlRmxvYXQoaW5pdFZbMl0pLHBhcnNlRmxvYXQoaW5pdFZbM10pKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09Myl7XHJcbiAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcih2QXJyWzBdLG5ldyBMYXlhLlZlY3RvcjMocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkscGFyc2VGbG9hdChpbml0VlsyXSkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0yKXtcclxuICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKHZBcnJbMF0sbmV3IExheWEuVmVjdG9yMihwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc05hTihwYXJzZUZsb2F0KGluaXRWWzBdKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldE51bWJlcih2QXJyWzBdLHBhcnNlRmxvYXQoaW5pdFZbMF0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0ck9iaj1pbml0VlswXStcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzdHJPYmo9PVwidGV4XCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRleDpMYXlhLkJhc2VUZXh0dXJlPXNoYXJlZE1hdGVyaWFsW29OYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VGV4dHVyZSh2QXJyWzBdLHRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzcHJpdGVEZWZpbmVzPUxheWEuU2tpbm5lZE1lc2hTcHJpdGUzRC5zaGFkZXJEZWZpbmVzO1xyXG4gICAgICAgIHZhciBtYXRlcmlhbERlZmluZXM9TGF5YS5CbGlublBob25nTWF0ZXJpYWwuc2hhZGVyRGVmaW5lcztcclxuICAgICAgICBpZihwRGF0YSE9bnVsbCl7XHJcbiAgICAgICAgICAgIGlmKHBEYXRhW1wic3ByaXRlRGVmaW5lc1wiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBzcHJpdGVEZWZpbmVzPXBEYXRhW1wic3ByaXRlRGVmaW5lc1wiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihwRGF0YVtcIm1hdGVyaWFsRGVmaW5lc1wiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbERlZmluZXM9cERhdGFbXCJtYXRlcmlhbERlZmluZXNcIl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzaGFkZXI9TGF5YS5TaGFkZXIzRC5hZGQoc2hhZGVyTmFtZSxhdHRyaWJ1dGVNYXAsdW5pZm9ybU1hcCxzcHJpdGVEZWZpbmVzLG1hdGVyaWFsRGVmaW5lcyk7XHJcblxyXG4gICAgICAgIHZhciBTdWJTaGFkZXJOb2RlPXRoaXMuZ2V0Tm9kZSh4bWxOb2RlLFwiU3ViU2hhZGVyXCIpO1xyXG5cclxuICAgICAgICB2YXIgcmVuZGVyTW9kZU5vZGU9dGhpcy5nZXROb2RlKHhtbE5vZGUsXCJyZW5kZXJNb2RlXCIpO1xyXG4gICAgICAgIGlmKHJlbmRlck1vZGVOb2RlIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIHJlbmRlck1vZGU9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUocmVuZGVyTW9kZU5vZGUsXCJ2XCIpO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJNb2RlIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsW1wicmVuZGVyTW9kZVwiXT10aGlzLmdldFYocmVuZGVyTW9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBQYXNzQXJyPXRoaXMuZ2V0Tm9kZUFycihTdWJTaGFkZXJOb2RlLFwiUGFzc1wiKTtcclxuICAgICAgICBmb3IoaT0wO2k8UGFzc0Fyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHBhc3MgPSBQYXNzQXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgdnNOb2RlOk5vZGU9dGhpcy5nZXROb2RlKHBhc3MsXCJWRVJURVhcIik7XHJcbiAgICAgICAgICAgIHZhciB2czpzdHJpbmc9dnNOb2RlLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICB2cyA9IHZzLnJlcGxhY2UoLyhcXHIpL2csXCJcIik7XHJcbiAgICAgICAgICAgIHZhciBwc05vZGU6Tm9kZT10aGlzLmdldE5vZGUocGFzcyxcIkZSQUdNRU5UXCIpO1xyXG4gICAgICAgICAgICB2YXIgcHM6c3RyaW5nPXBzTm9kZS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgcHMgPSBwcy5yZXBsYWNlKC8oXFxyKS9nLFwiXCIpO1xyXG4gICAgICAgICAgICBpZihpPjApe1xyXG4gICAgICAgICAgICAgICAgdmFyIHJzOkxheWEuUmVuZGVyU3RhdGU9IHNoYXJlZE1hdGVyaWFsLmdldFJlbmRlclN0YXRlKDApLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fcmVuZGVyU3RhdGVzLnB1c2gocnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VsbE5vZGU9dGhpcy5nZXROb2RlKHBhc3MsXCJjdWxsXCIpO1xyXG4gICAgICAgICAgICBpZihjdWxsTm9kZSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VsbD10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShjdWxsTm9kZSxcInZcIik7XHJcbiAgICAgICAgICAgICAgICBpZihjdWxsIT1udWxsIHx8IGN1bGwhPVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLmdldFJlbmRlclN0YXRlKGkpLmN1bGw9dGhpcy5nZXRWKGN1bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzaGFkZXIuYWRkU2hhZGVyUGFzcyh2cyxwcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyPXNoYWRlcjtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHByaXZhdGUgc3RhdGljIGdldFYob2JqOmFueSxiYWNrVHlwZT1cIm51bGxcIik6YW55e1xyXG4gICAgICAgIHZhciB0ZW1wTmFtZUFycix0ZW1wT2JqLHRlbXBWLGlpO1xyXG4gICAgICAgIHRlbXBOYW1lQXJyPW9iai5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgaWYodGVtcE5hbWVBcnJbMF09PT1cIkxheWFcIil7XHJcbiAgICAgICAgICAgIHRlbXBWPUxheWE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGVtcE5hbWVBcnJbMF09PT1cImxheWFcIil7XHJcbiAgICAgICAgICAgIHRlbXBWPWxheWE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihpaT0xO2lpPHRlbXBOYW1lQXJyLmxlbmd0aDtpaSsrKXtcclxuICAgICAgICAgICAgdGVtcFY9dGVtcFZbdGVtcE5hbWVBcnJbaWldXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGVtcFYhPW51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGVtcFY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoYmFja1R5cGUhPVwibnVsbFwiKXtcclxuICAgICAgICAgICAgaWYoYmFja1R5cGU9PVwiaW50XCIpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhIHN0cmluZyBpbiB0aGUgZm9ybWF0IFwiI3JyZ2diYlwiIG9yIFwicnJnZ2JiXCIgdG8gdGhlIGNvcnJlc3BvbmRpbmdcclxuICAgICAqIHVpbnQgcmVwcmVzZW50YXRpb24uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjb2xvciBUaGUgY29sb3IgaW4gc3RyaW5nIGZvcm1hdC5cclxuICAgICAqIEByZXR1cm4gVGhlIGNvbG9yIGluIHVpbnQgZm9ybWF0LlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb2xvclN0cmluZ1RvVWludChjb2xvcjpTdHJpbmcpOm51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcihcIjB4XCIgKyBjb2xvci5yZXBsYWNlKFwiI1wiLCBcIlwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0QXR0cmlidXRlc1ZhbHVlKG5vZGU6YW55LGtleTpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBub2RlVmFsdWU9bnVsbDtcclxuICAgICAgICB2YXIgYXR0cmlidXRlcz1ub2RlW1wiYXR0cmlidXRlc1wiXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGF0dHJpYnV0ZXNbaV07XHJcbiAgICAgICAgICAgIGlmKGVsZW1lbnQubmFtZT09a2V5KXtcclxuICAgICAgICAgICAgICAgIG5vZGVWYWx1ZT1lbGVtZW50W1wibm9kZVZhbHVlXCJdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGVWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXROb2RlKHhtbDphbnksa2V5OnN0cmluZyl7XHJcbiAgICAgICAgdmFyIGNoaWxkTm9kZXM9eG1sLmNoaWxkTm9kZXM7XHJcbiAgICAgICAgdmFyIG5vZGU6YW55PW51bGw7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmo6YW55PWNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgIGlmKG9ialtcIm5vZGVOYW1lXCJdPT1rZXkpe1xyXG4gICAgICAgICAgICAgICAgbm9kZT1vYmo7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc3RhdGljIGdldE5vZGVBcnIoeG1sOmFueSxrZXk6c3RyaW5nKTpBcnJheTxOb2RlPntcclxuICAgICAgICB2YXIgY2hpbGROb2Rlcz14bWwuY2hpbGROb2RlcztcclxuICAgICAgICB2YXIgbm9kZUFycjpBcnJheTxOb2RlPj1bXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG9iajphbnk9Y2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYob2JqW1wibm9kZU5hbWVcIl09PWtleSl7XHJcbiAgICAgICAgICAgICAgICBub2RlQXJyLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZUFycjtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBXbXlfTG9hZF9NYWcgfSBmcm9tIFwiLi4vV215X0xvYWRfTWFnXCI7XHJcbmltcG9ydCB7IFdteVNoYWRlck1zZyB9IGZyb20gXCIuL1dteVNoYWRlck1zZ1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteVV0aWxzM0R7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE9iajNkKHRhcmdldCxvYmpOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5uYW1lPT1vYmpOYW1lKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvOkxheWEuU3ByaXRlM0QgPSB0YXJnZXQuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBpZiAoby5fY2hpbGRyZW4ubGVuZ3RoIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKG8ubmFtZT09b2JqTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG87XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wT2JqPXRoaXMuZ2V0T2JqM2QobyxvYmpOYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBPYmohPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wT2JqO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldENoaWxkcmVuQ29tcG9uZW50KHRhcmdldCxjbGFzOmFueSxhcnI/KTpBcnJheTxhbnk+e1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhcnI9PW51bGwpYXJyPVtdO1xyXG5cclxuICAgICAgICB2YXIgb2JqPXRhcmdldC5nZXRDb21wb25lbnQoY2xhcyk7XHJcbiAgICAgICAgaWYob2JqPT1udWxsKXtcclxuICAgICAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgY2xhcyl7XHJcbiAgICAgICAgICAgICAgICBvYmo9dGFyZ2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG86TGF5YS5TcHJpdGUzRCA9IHRhcmdldC5fY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRyZW5Db21wb25lbnQobyxjbGFzLGFycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRTaGFkZXJBbGwodGFyZ2V0LG1hdHNVcmw6c3RyaW5nLCBzaGFkZXJzVXJsOnN0cmluZyl7XHJcbiAgICAgICAgdmFyIG5ld01hdHNVcmw9bWF0c1VybCtcIndteU1hdHMuanNvblwiO1xyXG4gICAgICAgIHZhciBuZXdTaGFkZXJzVXJsPXNoYWRlcnNVcmw7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChuZXdNYXRzVXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywobWF0c1VybCxzaGFkZXJzVXJsLGRhdGEpPT57XHJcbiAgICAgICAgICAgIGlmKGRhdGE9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwid215TWF0cy3lh7rplJk6XCIsbmV3TWF0c1VybCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGFycmF5OkFycmF5PGFueT49ZGF0YVtcIm1hdHNcIl07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBhcnJheVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKG9ialtcInRhcmdldE5hbWVcIl09PVwiXCIpY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0M0Q9V215VXRpbHMzRC5nZXRPYmozZCh0YXJnZXQsb2JqW1widGFyZ2V0TmFtZVwiXSlhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgICAgICAgICAgaWYodGFyZ2V0M0Q9PW51bGwpY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0VXJsPW1hdHNVcmwrb2JqW1wibWF0VXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNoYWRlck5hbWVVcmw9c2hhZGVyc1VybCtvYmpbXCJzaGFkZXJOYW1lXCJdK1wiLnR4dFwiO1xyXG4gICAgICAgICAgICAgICAgTGF5YS5CYXNlTWF0ZXJpYWwubG9hZChtYXRVcmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLChfdGFyZ2V0M0Q6TGF5YS5TcHJpdGUzRCxfc2hhZGVyTmFtZVVybCxtKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwRGF0YT17fTtcclxuICAgICAgICAgICAgICAgICAgICBwRGF0YVtcImN1YmVGdW5cIl09KG0sY3ViZU5hbWUpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFdteV9Mb2FkX01hZy5nZXRUaGlzLmdldEN1YmUoY3ViZU5hbWUsbmV3IExheWEuSGFuZGxlcih0aGlzLChjdWJlLGkpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpPT0wKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLl9zaGFkZXJWYWx1ZXMuc2V0VGV4dHVyZShMYXlhLlNjZW5lM0QuUkVGTEVDVElPTlRFWFRVUkUsY3ViZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgV215U2hhZGVyTXNnLnNldFNoYWRlcihfdGFyZ2V0M0QsbSxfc2hhZGVyTmFtZVVybCxmYWxzZSxwRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoX3RhcmdldDNEIT1udWxsICYmIF90YXJnZXQzRC5wYXJlbnQhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGFyZ2V0M0QucGFyZW50LnJlbW92ZUNoaWxkKF90YXJnZXQzRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxbdGFyZ2V0M0Qsc2hhZGVyTmFtZVVybF0pKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxbbWF0c1VybCxuZXdTaGFkZXJzVXJsXSksbnVsbCxMYXlhLkxvYWRlci5KU09OKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuaVBsYXkodGFyZ2V0LHRhcmdldE5hbWUsYW5pTmFtZSk6TGF5YS5BbmltYXRvcntcclxuICAgICAgICB2YXIgdGFyZ2V0M2Q6TGF5YS5TcHJpdGUzRD10aGlzLmdldE9iajNkKHRhcmdldCx0YXJnZXROYW1lKSBhcyBMYXlhLlNwcml0ZTNEO1xyXG4gICAgICAgIHZhciB0YXJnZXQzZF9hbmk9dGFyZ2V0M2QuZ2V0Q29tcG9uZW50KExheWEuQW5pbWF0b3IpIGFzIExheWEuQW5pbWF0b3I7XHJcbiAgICAgICAgdGFyZ2V0M2RfYW5pLnBsYXkoYW5pTmFtZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0YXJnZXQzZF9hbmk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uU2hhZG93KGRpcmVjdGlvbkxpZ2h0OkxheWEuRGlyZWN0aW9uTGlnaHQsc2hhZG93UmVzb2x1dGlvbj01MTIsc2hhZG93UENGVHlwZT0xLHNoYWRvd0Rpc3RhbmNlOm51bWJlcj0xMDAsaXNTaGFkb3c6Ym9vbGVhbj10cnVlKXtcclxuICAgICAgICAvL+eBr+WFieW8gOWQr+mYtOW9sVxyXG4gICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgIC8v5Y+v6KeB6Zi05b2x6Led56a7XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93RGlzdGFuY2UgPSBzaGFkb3dEaXN0YW5jZTtcclxuICAgICAgICAvL+eUn+aIkOmYtOW9sei0tOWbvuWwuuWvuFxyXG4gICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd1Jlc29sdXRpb24gPSBzaGFkb3dSZXNvbHV0aW9uO1xyXG4gICAgICAgIC8vZGlyZWN0aW9uTGlnaHQuc2hhZG93UFNTTUNvdW50PTE7XHJcbiAgICAgICAgLy/mqKHns4rnrYnnuqcs6LaK5aSn6LaK6auYLOabtOiAl+aAp+iDvVxyXG4gICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd1BDRlR5cGUgPSBzaGFkb3dQQ0ZUeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbkNhc3RTaGFkb3codGFyZ2V0LHR5cGU9MCxpc1NoYWRvdz10cnVlLGlzQ2hpbGRyZW49dHJ1ZSl7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5NZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICB2YXIgbXMzRD0odGFyZ2V0IGFzIExheWEuTWVzaFNwcml0ZTNEKTtcclxuICAgICAgICAgICAgaWYodHlwZT09MCl7XHJcbiAgICAgICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodHlwZT09MSl7XHJcbiAgICAgICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodHlwZT09Mil7XHJcbiAgICAgICAgICAgICAgICAvL+aOpeaUtumYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLmNhc3RTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Qpe1xyXG4gICAgICAgICAgICB2YXIgc21zM2Q9KHRhcmdldCBhcyBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0QpO1xyXG4gICAgICAgICAgICBpZih0eXBlPT0wKXtcclxuICAgICAgICAgICAgICAgIHNtczNkLnNraW5uZWRNZXNoUmVuZGVyZXIucmVjZWl2ZVNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodHlwZT09MSl7XHJcbiAgICAgICAgICAgICAgICBzbXMzZC5za2lubmVkTWVzaFJlbmRlcmVyLmNhc3RTaGFkb3c9aXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGlzQ2hpbGRyZW4pe1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5udW1DaGlsZHJlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gdGFyZ2V0LmdldENoaWxkQXQoaSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2FzdFNoYWRvdyhvYmosdHlwZSxpc1NoYWRvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmdiMmhleChyLGcsYil7XHJcbiAgICAgICAgdmFyIF9oZXg9XCIjXCIgKyB0aGlzLmhleChyKSArdGhpcy4gaGV4KGcpICsgdGhpcy5oZXgoYik7XHJcbiAgICAgICAgcmV0dXJuIF9oZXgudG9VcHBlckNhc2UoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc3RhdGljIGhleCh4KXtcclxuICAgICAgICB4PXRoaXMub25OdW1Ubyh4KTtcclxuICAgICAgICByZXR1cm4gKFwiMFwiICsgcGFyc2VJbnQoeCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25OdW1UbyhuKXtcclxuXHRcdGlmKChuK1wiXCIpLmluZGV4T2YoXCIuXCIpPj0wKXtcclxuXHRcdCAgICBuPXBhcnNlRmxvYXQobi50b0ZpeGVkKDIpKTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gbjtcclxuXHR9XHJcblxyXG4gICAgXHJcbiAgIHB1YmxpYyBzdGF0aWMgbGVycEYoYTpudW1iZXIsIGI6bnVtYmVyLCBzOm51bWJlcik6bnVtYmVye1xyXG4gICAgICAgIHJldHVybiAoYSArIChiIC0gYSkgKiBzKTtcclxuICAgIH1cclxuXHJcbn0iXX0=
