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
        WmyTar_1.default.getThis.init(new Laya.Handler(this, this.onInit));
    }
    Main.prototype.onInit = function () {
        if (!Laya["_isinit"]) {
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
        }
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        // Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        // Laya.stage.screenMode = GameConfig.screenMode;
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.stage.bgColor = 'none';
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
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        var wmyVTime = "";
        if (window != null && window["wmyVTime"] != null) {
            wmyVTime = window["wmyVTime"];
        }
        //Laya.ResourceVersion.enable("version.json"+wmyVTime, Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    };
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
    WmyTar.prototype.init = function (complete) {
        var _this_1 = this;
        this._complete = complete;
        this._render = new TAR.Render();
        this._ar = new TAR.AR();
        this._engine = new TAR.Engine();
        // this._LayaEngine=window["LayaEngine"];
        // if(this._LayaEngine!=null){
        //     this._texture=this._LayaEngine["texture"];
        // }
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
        else {
            this._complete.run();
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
                _this_1._complete.run();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpciBJREUgMi4wLjAgYmV0YTIvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDb25maWcudHMiLCJzcmMvTWFpbi50cyIsInNyYy90YXIvV215VGFyLnRzIiwic3JjL3dteVV0aWxzSDUvV215VXRpbHMudHMiLCJzcmMvd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkM2QudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkTWF0cy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVNoYWRlck1zZy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkE7O0VBRUU7QUFDRjtJQVdJO0lBQWMsQ0FBQztJQUNSLGVBQUksR0FBWDtJQUNBLENBQUM7SUFaTSxnQkFBSyxHQUFRLEdBQUcsQ0FBQztJQUNqQixpQkFBTSxHQUFRLElBQUksQ0FBQztJQUNuQixvQkFBUyxHQUFRLFlBQVksQ0FBQztJQUM5QixxQkFBVSxHQUFRLE1BQU0sQ0FBQztJQUN6QixxQkFBVSxHQUFRLEVBQUUsQ0FBQztJQUNyQixvQkFBUyxHQUFRLEVBQUUsQ0FBQztJQUNwQixnQkFBSyxHQUFTLEtBQUssQ0FBQztJQUNwQixlQUFJLEdBQVMsSUFBSSxDQUFDO0lBQ2xCLHVCQUFZLEdBQVMsS0FBSyxDQUFDO0lBQzNCLDRCQUFpQixHQUFTLElBQUksQ0FBQztJQUkxQyxpQkFBQztDQWRELEFBY0MsSUFBQTtrQkFkb0IsVUFBVTtBQWUvQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7QUNsQmxCLDJDQUFzQztBQUN0Qyx5REFBd0Q7QUFDeEQsMERBQXlEO0FBQ3pELHVDQUFrQztB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QyxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFYSxrQkFBTyxHQUFyQixVQUFzQixDQUFDO1FBQ3pCLElBQUcsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFFLENBQUMsRUFBQztZQUN0QixDQUFDLEdBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QjtRQUNQLE9BQU8sQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQUdlLGdCQUFLLEdBQW5CLFVBQW9CLENBQVEsRUFBRSxDQUFRLEVBQUUsQ0FBUTtRQUMzQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTCxpQkFBQztBQUFELENBcktBLEFBcUtDLElBQUE7QUFyS1ksZ0NBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypcclxuKiDmuLjmiI/liJ3lp4vljJbphY3nva47XHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb25maWd7XHJcbiAgICBzdGF0aWMgd2lkdGg6bnVtYmVyPTY0MDtcclxuICAgIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTExMzY7XHJcbiAgICBzdGF0aWMgc2NhbGVNb2RlOnN0cmluZz1cImZpeGVkd2lkdGhcIjtcclxuICAgIHN0YXRpYyBzY3JlZW5Nb2RlOnN0cmluZz1cIm5vbmVcIjtcclxuICAgIHN0YXRpYyBzdGFydFNjZW5lOnN0cmluZz1cIlwiO1xyXG4gICAgc3RhdGljIHNjZW5lUm9vdDpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHN0YXQ6Ym9vbGVhbj10cnVlO1xyXG4gICAgc3RhdGljIHBoeXNpY3NEZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIGV4cG9ydFNjZW5lVG9Kc29uOmJvb2xlYW49dHJ1ZTtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLmluaXQoKTsiLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi93bXlVdGlsc0g1L2QzL1dteVV0aWxzM0RcIjtcclxuaW1wb3J0IHsgV215X0xvYWRfTWFnIH0gZnJvbSBcIi4vd215VXRpbHNINS9XbXlfTG9hZF9NYWdcIjtcclxuaW1wb3J0IFdteVRhciBmcm9tIFwiLi90YXIvV215VGFyXCI7XHJcbmNsYXNzIE1haW4ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0V215VGFyLmdldFRoaXMuaW5pdChuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkluaXQpKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25Jbml0KCl7XHJcblx0XHRpZighTGF5YVtcIl9pc2luaXRcIl0pe1xyXG5cdFx0XHRMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcblx0XHR9XHJcblxyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcclxuXHRcdC8vIExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gTGF5YS5TdGFnZS5TQ0FMRV9TSE9XQUxMO1xyXG5cdFx0Ly8gTGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xyXG4gICAgICAgIExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gTGF5YS5TdGFnZS5TQ0FMRV9GVUxMO1xyXG4gICAgICAgIExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IExheWEuU3RhZ2UuU0NSRUVOX05PTkU7XHJcblx0XHRMYXlhLnN0YWdlLmJnQ29sb3IgPSAnbm9uZSc7XHJcblx0XHRcclxuXHRcdC8v6K6+572u5rC05bmz5a+56b2QXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnbkggPSBcImNlbnRlclwiO1xyXG5cdFx0Ly/orr7nva7lnoLnm7Tlr7npvZBcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduViA9IFwibWlkZGxlXCI7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0dmFyIHdteVZUaW1lPVwiXCI7XHJcblx0XHRpZih3aW5kb3chPW51bGwgJiYgd2luZG93W1wid215VlRpbWVcIl0hPW51bGwpe1xyXG5cdFx0XHR3bXlWVGltZT13aW5kb3dbXCJ3bXlWVGltZVwiXTtcclxuXHRcdH1cclxuXHRcdC8vTGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIrd215VlRpbWUsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuXHRcdHZhciB1cmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChcInJlcy9sb2FkSW5mby5qc29uXCIpO1xyXG4gICAgICAgIFdteV9Mb2FkX01hZy5nZXRUaGlzLm9uTG9hZFdldERhdGEodXJsLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkxvYWRMb2FkKSk7XHJcblx0fVxyXG5cdFxyXG4gICAgcHJpdmF0ZSBvbkxvYWRMb2FkKCl7XHJcbiAgICAgICAgdmFyIHJlc09iaj1XbXlfTG9hZF9NYWcuZ2V0VGhpcy5nZXRSZXNPYmooXCJsb2FkXCIpO1xyXG4gICAgICAgIGlmKHJlc09iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgIFdteV9Mb2FkX01hZy5nZXRUaGlzLm9ubG9hZChyZXNPYmosbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkTWFpbikpO1xyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG4gICAgcHJpdmF0ZSBfbG9hZFZpZXc6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfYmFyOmZhaXJ5Z3VpLkdQcm9ncmVzc0JhcjtcclxuXHRwcml2YXRlIG9uTG9hZE1haW4oKXtcclxuXHRcdHRoaXMuX2xvYWRWaWV3PWZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJsb2FkXCIsXCJMb2FkXCIpLmFzQ29tO1xyXG5cdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZCh0aGlzLl9sb2FkVmlldyk7XHJcblx0XHR0aGlzLl9iYXI9dGhpcy5fbG9hZFZpZXcuZ2V0Q2hpbGQoXCJiYXJcIikuYXNQcm9ncmVzcztcclxuXHJcbiAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMub25BdXRvTG9hZEFsbChuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uTG9hZGluZyhwcm9ncmVzczogbnVtYmVyKTogdm9pZCB7XHJcblx0XHR0aGlzLl9iYXIudmFsdWU9cHJvZ3Jlc3M7XHJcblx0fVxyXG5cdFxyXG4gICAgcHJpdmF0ZSBfdTNkQXJyO1xyXG4gICAgcHVibGljIHNjZW5lM0Q6TGF5YS5TY2VuZTNEO1xyXG5cdHByaXZhdGUgb25Mb2FkT2sodWlBcnIsdTNkQXJyKXtcclxuXHRcdHRoaXMuX3UzZEFycj11M2RBcnI7XHJcblx0XHRMYXlhLnRpbWVyLm9uY2UoNDAwLHRoaXMsICgpPT57XHJcblx0XHRcdHRoaXMub25NYWluKCk7XHJcblx0XHRcdGZhaXJ5Z3VpLkdSb290Lmluc3QucmVtb3ZlQ2hpbGQodGhpcy5fbG9hZFZpZXcpO1xyXG5cdFx0XHR0aGlzLl9sb2FkVmlldz1udWxsO1xyXG5cdFx0XHR0aGlzLl9iYXI9bnVsbDtcclxuXHRcdH0pO1xyXG5cdFx0Ly/mt7vliqAzROWcuuaZr1xyXG5cdFx0aWYodTNkQXJyWzBdIT1udWxsKXtcclxuXHRcdFx0dmFyIHVybDNkPXUzZEFyclswXS51cmxMaXN0WzBdO1xyXG5cdFx0XHR0aGlzLnNjZW5lM0QgPUxheWEubG9hZGVyLmdldFJlcyh1cmwzZCk7XHJcblx0XHRcdFdteVV0aWxzM0Quc2V0U2hhZGVyQWxsKHRoaXMuc2NlbmUzRCxcInJlcy9tYXRzL1wiLFwicmVzL3NoYWRlcnMvXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuICAgIHByaXZhdGUgX21haW5WaWV3OiBmYWlyeWd1aS5HQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgb25NYWluKCl7XHJcblx0XHR0aGlzLl9tYWluVmlldz1mYWlyeWd1aS5VSVBhY2thZ2UuY3JlYXRlT2JqZWN0KFwibWFpblwiLFwiTWFpblwiKS5hc0NvbTtcclxuXHRcdGlmKHRoaXMuX21haW5WaWV3IT1udWxsKXtcclxuXHRcdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZCh0aGlzLl9tYWluVmlldyk7XHJcblx0XHRcdHZhciBfTWFpbj10aGlzLl9tYWluVmlldy5nZXRDaGlsZChcIl9NYWluXCIpLmFzQ29tO1xyXG5cdFx0XHR2YXIgX2QzPV9NYWluLmdldENoaWxkKFwiZDNcIikuYXNDb207XHJcblx0XHRcdGlmKHRoaXMuc2NlbmUzRCE9bnVsbCl7XHJcblx0XHRcdFx0X2QzLmRpc3BsYXlPYmplY3QuYWRkQ2hpbGQodGhpcy5zY2VuZTNEKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV215VGFye1xyXG4gICAgcHJpdmF0ZSBfZW5naW5lOiBUQVIuRW5naW5lO1xyXG4gICAgcHJpdmF0ZSBfYXI6IFRBUi5BUjtcclxuICAgIHByaXZhdGUgX3JlbmRlcjogVEFSLlJlbmRlcjtcclxuICAgIHN0YXRpYyBfdGhpczpXbXlUYXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCl7XHJcbiAgICAgICAgaWYoV215VGFyLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215VGFyLl90aGlzPW5ldyBXbXlUYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteVRhci5fdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBfY29tcGxldGU6IExheWEuSGFuZGxlcjtcclxuICAgIF9MYXlhRW5naW5lOmFueTtcclxuICAgIF90ZXh0dXJlOmFueTtcclxuICAgIHB1YmxpYyBpbml0KGNvbXBsZXRlOkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdGhpcy5fY29tcGxldGU9Y29tcGxldGU7XHJcblx0XHR0aGlzLl9yZW5kZXIgPSBuZXcgVEFSLlJlbmRlcigpO1xyXG5cdFx0dGhpcy5fYXIgPSBuZXcgVEFSLkFSKCk7XHJcbiAgICAgICAgdGhpcy5fZW5naW5lID0gbmV3IFRBUi5FbmdpbmUoKTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5fTGF5YUVuZ2luZT13aW5kb3dbXCJMYXlhRW5naW5lXCJdO1xyXG4gICAgICAgIC8vIGlmKHRoaXMuX0xheWFFbmdpbmUhPW51bGwpe1xyXG4gICAgICAgIC8vICAgICB0aGlzLl90ZXh0dXJlPXRoaXMuX0xheWFFbmdpbmVbXCJ0ZXh0dXJlXCJdO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyAvKipcclxuICAgICAgICAvLyAgKiBBbmRyb2lk6YCa6L+H5Li75b6q546v55uR5o6n5bmz6Z2i5Z2Q5qCH55qE5Y+Y5YyW77yM6ZyA6KaB5Li75Yqo6LCD55Sob25UYXJTdGF0ZUNoYW5nZWTljrvmlLnlj5jnirbmgIFcclxuICAgICAgICAvLyAgKiBpT1Plt7Lnu4/lsIbkuovku7bnm5HlkKzlhpnlnKjkuoZ0YXIuanPph4zpnaLvvIznirbmgIHoh6rliqjliIfmjaJcclxuICAgICAgICAvLyAgKi9cclxuICAgICAgICAvLyBpZiAoVEFSLkVOVi5BTkRST0lEKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuX3JlbmRlci5vbignVEFSX1NUQVRFX0NIQU5HRScsICgpID0+IHtcclxuICAgICAgICAvLyAgICAgICAgIGNvbnN0IHZyRGlzcGxheSA9IHRoaXMuX2FyLmdldFZSRGlzcGxheSgpO1xyXG4gICAgICAgIC8vICAgICAgICAgaWYgKHZyRGlzcGxheSAmJiB0aGlzLl9hci5pc0VuZ2luZURvd25sb2FkKCkpIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICBjb25zdCBmcmFtZURhdGEgPSBuZXcgd2luZG93W1wiVlJGcmFtZURhdGFcIl0oKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICB2ckRpc3BsYXkuZ2V0RnJhbWVEYXRhKGZyYW1lRGF0YSk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uc3QgW3gsIHksIHpdID0gZnJhbWVEYXRhLnBvc2UucG9zaXRpb247XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgaWYgKHggPT09IDAgJiYgIHkgPT09IDAgJiYgeiA9PT0gMCkge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLl9hci5vblRhclN0YXRlQ2hhbmdlZCgnbGltaXRlZCcpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuX2FyLm9uVGFyU3RhdGVDaGFuZ2VkKCdub3JtYWwnKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gLy8gdHJpZ2dlciBjYW1lcmEgcG9zaXRpb24gY2hhbmdlIGV2ZXJ5IGZyYW1lXHJcbiAgICAgICAgLy8gdGhpcy5fcmVuZGVyLm9uKCdDQU1FUkFfVFJBTlNGT1JNX0NIQU5HRScsICgpID0+IHtcclxuICAgICAgICAvLyAgICAgY29uc3QgdnJEaXNwbGF5ID0gIHRoaXMuX2FyLmdldFZSRGlzcGxheSgpO1xyXG4gICAgICAgIC8vICAgICAvLyDpnIDopoHojrflj5bliLB2ckRpc3BsYXnlr7nosaHlubbkuJRhcuW8leaTjuS4i+WujOaIkOaJjeiDveWBmuS4muWKoemAu+i+kVxyXG4gICAgICAgIC8vICAgICBpZiAodnJEaXNwbGF5ICYmICB0aGlzLl9hci5pc0VuZ2luZURvd25sb2FkKCkpIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuX2VuZ2luZS5vbkNhbWVyYVRyYW5zZm9ybUNoYW5nZSgpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG5cclxuXHRcdC8vIHJlbmRlcuWIneWni+WMlu+8jOi/kOihjOS4u+W+queOr1xyXG5cdFx0dGhpcy5fcmVuZGVyLmluaXQoKTtcclxuXHRcdGlmIChUQVIuRU5WLklPUykge1xyXG5cdFx0XHR0aGlzLkFSSW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChUQVIuRU5WLkFORFJPSUQpIHtcclxuICAgICAgICAgICAgLy8gYW5kcm9pZCBBUueahOiDveWKm+mcgOimgeS4i+i9veaJjeaciVxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU1RBVFVTX0NIQU5HReaWueazleazqOWGjDTkuKrkuI7lvJXmk47nirbmgIHnm7jlhbPnmoRjYWxsYmFja+WHveaVsHN0YXJ0LCBsb2FkaW5nLCBzdWNjZXNzLCBmYWlsXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBUQVIuVEFSVXRpbHMuU1RBVFVTX0NIQU5HRShcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsb3NlIG5hdGl2ZSBwcm9ncmVzcyBhZnRlciBkb3dubG9hZCBuYXRpdmUgYXIgZW5naW5lXHJcbiAgICAgICAgICAgICAgICAgICAgLy9OQVRJVkVfUlJPR1JFU1NfQ0xPU0UoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0luaXQgQVIgZmFpbC4gUGxhdGZvcm0gYW5kcm9pZC4gZG93bmxvYWQgZW5naW5lIGVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIC8vIHZyIGRpc3BsYXkg5b+F6aG76aaW5YWI5Yqg6L2977yMYW5kcm9pZOWcqHg15YaF5qC46YeM5bey57uP5pyJ77yMaW9z6ZyA6KaB5byV55SoV2ViQVJvbkFSa2l0XHJcbiAgICAgICAgICAgIC8vIGFuZHJvaWQgQVLnmoTog73lipvpnIDopoHkuIvovb3miY3mnInvvIzkvYbmmK/mkYTlg4/lpLTog73lipvkuI3pnIDopoHkuIvovb3lvJXmk47vvIzmiYDku6VyZW5kZXLlj6/ku6Xmj5DliY3ov5vooYzvvJtpb3PmnKzouqvlsLHmnInlkITnp43og73lipvvvIxzbGFt44CBbWFya2VybGVzc+ayv+eUqGFya2l055qE77yMbWFya2VyIGJhc2XmmK/mrabmsYnoh6rnoJTnmoTvvIzlhbbkuK3nmoRhZGRNYXJrZXLpnIDopoHnu4jnq6/mt7vliqDnmoRcclxuICAgICAgICAgICAgVEFSLkFSLmluaXRBUkVuZ2luZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogMlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hci5zZXRFbmdpbmVEb3dubG9hZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0luaXQgQVIgc3VjY2Vzcy4gUGxhdGZvcm0gYW5kcm9pZC4gQVIgRW5naW5lIGRvd25sb2FkIHN1Y2Nlc3MsIHlvdSBjYW4gdXNlIGFiaWxpdHkgb2YgdGFyICdcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW5pdCBBUiBmYWlsLiBQbGF0Zm9ybSBhbmRyb2lkLiBpbml0IGZhaWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5BUkluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUucnVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFSSW5pdCgpIHtcclxuICAgICAgICB0aGlzLl9hci5sb2FkKCkudGhlbigoZGlzcGxheSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIuc2V0VlJEaXNwbGF5KGRpc3BsYXkpO1xyXG4gICAgICAgICAgICB0aGlzLl9lbmdpbmUuY3JlYXRlKCdMYXlhJyk7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBhcuW8leaTjuWKoOi9ve+8jGxvYWTlh73mlbDmnIkz5Liq5Y+C5pWw77yM5ZCO5Lik5Liq5Li65Zue6LCD5Ye95pWwb25TdGFydENhbGxiYWNr5ZKMb25Db21wbGV0ZUNhbGxiYWNrXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLl9lbmdpbmUubG9hZChkaXNwbGF5LCBudWxsLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICAgICAgICAgIC8vIHRhc2sgPSBuZXcgVGFzayhhciwgcmVuZGVyLCBlbmdpbmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1biA9IChwcmVTdGF0ZSwgbmV4dFN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFzay5ydW4ocHJlU3RhdGUsIG5leHRTdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIChhci5nZXRDdXJyZW50U3RhdGUoKSA9PT0gJ25vcm1hbCcpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBydW4oKTtcclxuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICogIOWwhnJ1biBjYWxsYmFja+azqOWGjOWIsGFy55qE54q25oCB6L2s56e75Ye95pWw5Lit77yMXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICogIOW9k+iwg+eUqGFyLm9uVGFyU3RhdGVDaGFuZ2VkKCdub3JtYWwnKeaIluiAhSBhci5vblRhclN0YXRlQ2hhbmdlZCgnbGltaXRlZCcpIO+8jCBydW7kvJrop6blj5HvvIxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgKiAg5omA5LulcnVu5Ye95pWw6KaB5YGa5LiN5ZCM54q25oCB6Ze06L2s5o2i5aSE55CGXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICovXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgYXIuc2V0Tm90QXZhaWxhYmxlMk5vcm1hbEZ1bmMocnVuKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICBhci5zZXRMaW1pdGVkMk5vcm1hbEZ1bmMocnVuKTtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYGV4Y2VwdGlvbiA9ICR7ZX1gKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG5leHBvcnQgY2xhc3MgV215VXRpbHMgZXh0ZW5kcyBsYXlhLmV2ZW50cy5FdmVudERpc3BhdGNoZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM6V215VXRpbHM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215VXRpbHN7XHJcbiAgICAgICAgaWYoV215VXRpbHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlVdGlscy5fdGhpcz1uZXcgV215VXRpbHMoKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215VXRpbHMuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5fX2xvb3ApO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfRE9XTix0aGlzLCB0aGlzLl9fb25Ub3VjaERvd24pO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfVVAsdGhpcywgdGhpcy5fX29uVG91Y2hVcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5fX09uTW91c2VNT1ZFKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuUkVTSVpFLHRoaXMsdGhpcy5fX29uUmVzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgQ09MT1JfRklMVEVSU19NQVRSSVg6IEFycmF5PGFueT49W1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vUlxyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vR1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vQlxyXG4gICAgICAgIDAsIDAsIDAsIDEsIDAsIC8vQVxyXG4gICAgXTtcclxuICAgIC8v6L2s5o2i6aKc6ImyXHJcbiAgICBwdWJsaWMgY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXIsYT86bnVtYmVyKTpBcnJheTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMF09cjtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFs2XT1nO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzEyXT1iO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzE4XT1hfHwxO1xyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWDtcclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnModGFyZ2V0OkxheWEuU3ByaXRlLGNvbG9yOm51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKGNvbG9yICE9IDB4ZmZmZmZmKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgoXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj4xNikgJiAweGZmKS8yNTUsXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj44KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgIChjb2xvciAmIDB4ZmYpLzI1NVxyXG4gICAgICAgICAgICAgICAgKSldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnMxKHRhcmdldDpMYXlhLlNwcml0ZSxyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlcnM9bnVsbDtcclxuICAgICAgICBpZihyIDwgMSB8fCBnIDwgMSB8fCBiIDwgMSB8fCBhIDwgMSl7XHJcbiAgICAgICAgICAgIHRhcmdldC5maWx0ZXJzPVtuZXcgTGF5YS5Db2xvckZpbHRlcih0aGlzLmNvbnZlcnRDb2xvclRvQ29sb3JGaWx0ZXJzTWF0cml4KHIsZyxiLGEpKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5Yik5pat5omL5py65oiWUENcclxuICAgIHB1YmxpYyBpc1BjKCk6Ym9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHZhciBpc1BjOmJvb2xlYW49ZmFsc2U7XHJcbiAgICAgICAgaWYodGhpcy52ZXJzaW9ucygpLmFuZHJvaWQgfHwgdGhpcy52ZXJzaW9ucygpLmlQaG9uZSB8fCB0aGlzLnZlcnNpb25zKCkuaW9zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXNQYz1mYWxzZTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnZlcnNpb25zKCkuaVBhZCl7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpc1BjPXRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzUGM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmVyc2lvbnMoKXtcclxuICAgICAgICB2YXIgdTpzdHJpbmcgPSBuYXZpZ2F0b3IudXNlckFnZW50LCBhcHA6c3RyaW5nID0gbmF2aWdhdG9yLmFwcFZlcnNpb247XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLy/np7vliqjnu4jnq6/mtY/op4jlmajniYjmnKzkv6Hmga9cclxuICAgICAgICAgICAgdHJpZGVudDogdS5pbmRleE9mKCdUcmlkZW50JykgPiAtMSwgLy9JReWGheaguFxyXG4gICAgICAgICAgICBwcmVzdG86IHUuaW5kZXhPZignUHJlc3RvJykgPiAtMSwgLy9vcGVyYeWGheaguFxyXG4gICAgICAgICAgICB3ZWJLaXQ6IHUuaW5kZXhPZignQXBwbGVXZWJLaXQnKSA+IC0xLCAvL+iLueaenOOAgeiwt+atjOWGheaguFxyXG4gICAgICAgICAgICBnZWNrbzogdS5pbmRleE9mKCdHZWNrbycpID4gLTEgJiYgdS5pbmRleE9mKCdLSFRNTCcpID09IC0xLCAvL+eBq+eLkOWGheaguFxyXG4gICAgICAgICAgICBtb2JpbGU6ICEhdS5tYXRjaCgvQXBwbGVXZWJLaXQuKk1vYmlsZS4qLyl8fCEhdS5tYXRjaCgvQXBwbGVXZWJLaXQvKSwgLy/mmK/lkKbkuLrnp7vliqjnu4jnq69cclxuICAgICAgICAgICAgaW9zOiAhIXUubWF0Y2goL1xcKGlbXjtdKzsoIFU7KT8gQ1BVLitNYWMgT1MgWC8pLCAvL2lvc+e7iOerr1xyXG4gICAgICAgICAgICBhbmRyb2lkOiB1LmluZGV4T2YoJ0FuZHJvaWQnKSA+IC0xIHx8IHUuaW5kZXhPZignTGludXgnKSA+IC0xLCAvL2FuZHJvaWTnu4jnq6/miJbogIV1Y+a1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGhvbmU6IHUuaW5kZXhPZignaVBob25lJykgPiAtMSB8fCB1LmluZGV4T2YoJ01hYycpID4gLTEsIC8v5piv5ZCm5Li6aVBob25l5oiW6ICFUVFIROa1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGFkOiB1LmluZGV4T2YoJ2lQYWQnKSA+IC0xLCAvL+aYr+WQpmlQYWRcclxuICAgICAgICAgICAgd2ViQXBwOiB1LmluZGV4T2YoJ1NhZmFyaScpID09IC0xIC8v5piv5ZCmd2Vi5bqU6K+l56iL5bqP77yM5rKh5pyJ5aS06YOo5LiO5bqV6YOoXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VXJsVihrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgcmVnPSBuZXcgUmVnRXhwKFwiKF58JilcIitrZXkrXCI9KFteJl0qKSgmfCQpXCIpO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ/ZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdFsyXSk6bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25OYXZpZ2F0ZSh1cmw6c3RyaW5nLGlzUmVwbGFjZTpib29sZWFuPWZhbHNlKXtcclxuICAgICAgICBpZihpc1JlcGxhY2Upe1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh1cmwpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPXVybDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZXZlbnRMaXN0OkFycmF5PGxheWEuZXZlbnRzLkV2ZW50Pj1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaERvd24oZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdC5pbmRleE9mKGV2dCk8MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5wdXNoKGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uVG91Y2hVcChldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KT49MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5zcGxpY2UodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uUmVzaXplKCl7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0LmZvckVhY2goZXZ0ID0+IHtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcblx0XHR9KTtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3Q9bmV3IEFycmF5PGxheWEuZXZlbnRzLkV2ZW50PigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9fT25Nb3VzZU1PVkUoZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBiTnVtPTEwO1xyXG4gICAgICAgIGlmKGV2dC5zdGFnZVggPD0gYk51bSB8fCBldnQuc3RhZ2VYID49IExheWEuc3RhZ2Uud2lkdGgtYk51bSB8fFxyXG4gICAgICAgICAgICBldnQuc3RhZ2VZIDw9IGJOdW0gfHwgZXZ0LnN0YWdlWSA+PSBMYXlhLnN0YWdlLmhlaWdodC1iTnVtKXtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4sbD0yKXtcclxuXHRcdGlmKChuK1wiXCIpLmluZGV4T2YoXCIuXCIpPj0wKXtcclxuXHRcdCAgICBuPXBhcnNlRmxvYXQobi50b0ZpeGVkKGwpKTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gbjtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSX1hZKGQsIHIpXHJcbiAgICB7XHJcbiAgICBcdHZhciByYWRpYW4gPSAociAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgXHR2YXIgY29zID0gIE1hdGguY29zKHJhZGlhbik7XHJcbiAgICBcdHZhciBzaW4gPSAgTWF0aC5zaW4ocmFkaWFuKTtcclxuICAgIFx0XHJcbiAgICBcdHZhciBkeD1kICogY29zO1xyXG4gICAgXHR2YXIgZHk9ZCAqIHNpbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBMYXlhLlBvaW50KGR4ICwgZHkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICBwdWJsaWMgc3RhdGljIHN0cmluZzJidWZmZXIoc3RyKTpBcnJheUJ1ZmZlciB7XHJcbiAgICAgICAgLy8g6aaW5YWI5bCG5a2X56ym5Liy6L2s5Li6MTbov5vliLZcclxuICAgICAgICBsZXQgdmFsID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgdmFsID0gc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFsICs9ICcsJyArIHN0ci5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5bCGMTbov5vliLbovazljJbkuLpBcnJheUJ1ZmZlclxyXG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSh2YWwubWF0Y2goL1tcXGRhLWZdezJ9L2dpKS5tYXAoZnVuY3Rpb24gKGgpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoaCwgMTYpXHJcbiAgICAgICAgfSkpLmJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlcGxhY2VBbGwoc3RyLCBvbGRTdHIsIG5ld1N0cil7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnOyAgXHJcbiAgICAgICAgdGVtcCA9IHN0ci5yZXBsYWNlKG9sZFN0ciwgbmV3U3RyKTtcclxuICAgICAgICBpZih0ZW1wLmluZGV4T2Yob2xkU3RyKT49MCl7XHJcbiAgICAgICAgICAgIHRlbXAgPSB0aGlzLnJlcGxhY2VBbGwodGVtcCwgb2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDsgIFxyXG4gICAgfSAgXHJcblxyXG4gICAgLy/lpKflsI/lhpnovazmjaJcclxuICAgIHB1YmxpYyBzdGF0aWMgdG9DYXNlKHN0cjpzdHJpbmcsIGlzRHg9ZmFsc2UpeyAgXHJcbiAgICAgICAgdmFyIHRlbXAgPSAnJztcclxuICAgICAgICBpZighaXNEeCl7XHJcbiAgICAgICAgICAgIC8v6L2s5o2i5Li65bCP5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIC8v6L2s5YyW5Li65aSn5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9IFxyXG5cclxuICAgIFxyXG4gICAgLy/ot53nprtcclxuXHRwdWJsaWMgc3RhdGljIGdldERpc3RhbmNlKGE6TGF5YS5Qb2ludCxiOkxheWEuUG9pbnQpOm51bWJlciB7XHJcblx0XHR2YXIgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xyXG5cdFx0dmFyIGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcclxuXHRcdHZhciBkPU1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpO1xyXG5cdFx0ZD1wYXJzZUZsb2F0KGQudG9GaXhlZCgyKSk7XHJcblx0XHRyZXR1cm4gZDtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRYeVRvUih5LHgpOm51bWJlcntcclxuICAgICAgICB2YXIgcmFkaWFuPU1hdGguYXRhbjIoeSx4KTtcclxuICAgICAgICB2YXIgcj0oMTgwL01hdGguUEkqcmFkaWFuKTtcclxuICAgICAgICByPXRoaXMub25OdW1UbyhyKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0b3JhZ2Uoa2V5LCB2YWx1ZTphbnk9XCI/XCIsIGlzTG9jYWw9dHJ1ZSk6YW55e1xyXG4gICAgICAgIHZhciBzdG9yYWdlOmFueT1pc0xvY2FsP2xvY2FsU3RvcmFnZTpzZXNzaW9uU3RvcmFnZTtcclxuICAgICAgICBpZih2YWx1ZT09XCI/XCIpe1xyXG5cdFx0XHR2YXIgZGF0YSA9IHN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYodmFsdWU9PW51bGwpe1xyXG5cdFx0XHRzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlGdWlTb3VuZChfdXJsLHZvbHVtZT0wLjIsY29tcGxldGVIYW5kbGVyPyxzdGFydFRpbWU9MCxsb29wcz0xKXtcclxuICAgICAgICBpZih2b2x1bWU8PTApcmV0dXJuO1xyXG4gICAgICAgIHZhciBpdGVtPWZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtQnlVUkwoX3VybCk7XHJcbiAgICAgICAgdmFyIHVybD1pdGVtLmZpbGU7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKHVybCxsb29wcyxjb21wbGV0ZUhhbmRsZXIsbnVsbCxzdGFydFRpbWUpO1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnNldFNvdW5kVm9sdW1lKHZvbHVtZSx1cmwpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMgfSBmcm9tIFwiLi9XbXlVdGlsc1wiO1xyXG5pbXBvcnQgeyBXbXlMb2FkM2QgfSBmcm9tIFwiLi9kMy9XbXlMb2FkM2RcIjtcclxuaW1wb3J0IHsgV215TG9hZE1hdHMgfSBmcm9tIFwiLi9kMy9XbXlMb2FkTWF0c1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteV9Mb2FkX01hZ1xyXG57XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlfTG9hZF9NYWd7XHJcbiAgICAgICAgaWYoV215X0xvYWRfTWFnLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215X0xvYWRfTWFnLl90aGlzPW5ldyBXbXlfTG9hZF9NYWcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteV9Mb2FkX01hZy5fdGhpcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3dldERhdGE6YW55PXt9O1xyXG5cclxuICAgIHB1YmxpYyByZXNVcmw6c3RyaW5nPVwiXCI7XHJcbiAgICBwdWJsaWMgZ2V0V2V0RGF0YSh1cmw6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2V0RGF0YVt1cmxdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc2V0V2V0RGF0YShvYmo6YW55LHVybD86c3RyaW5nKXtcclxuICAgICAgICBpZih0aGlzLnJlc1VybD09XCJcIil7XHJcbiAgICAgICAgICAgIHRoaXMucmVzVXJsPXVybDtcclxuICAgICAgICAgICAgdmFyIGFycj1udWxsO1xyXG4gICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZShvYmopO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodXJsPT1udWxsKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMucmVzVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl93ZXREYXRhW3VybF09b2JqO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0UmVzT2JqKHJlc05hbWU6c3RyaW5nLHVybD8pe1xyXG4gICAgICAgIHZhciB3ZWJEYXRhOmFueTtcclxuICAgICAgICBpZih1cmw9PW51bGwpe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5yZXNVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdlYkRhdGE9dGhpcy5nZXRXZXREYXRhKHVybCk7XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhcnI9PW51bGwpe1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyPUpTT04ucGFyc2Uod2ViRGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIix3ZWJEYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXNPYmo9bnVsbDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1hcnJbaV07XHJcbiAgICAgICAgICAgIGlmKG9ialtcInJlc05hbWVcIl09PXJlc05hbWUpe1xyXG4gICAgICAgICAgICAgICAgcmVzT2JqPW9iajtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZFdldERhdGEodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgaWYodXJsPT1cIlwiKXJldHVybjtcclxuICAgICAgICBpZih0aGlzLmdldFdldERhdGEodXJsKSE9bnVsbCl7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5nZXRXZXREYXRhKHVybCldKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbG9hZD1MYXlhLmxvYWRlci5sb2FkKHVybCxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsZnVuY3Rpb24ob2JqKXtcclxuICAgICAgICAgICAgdGhpcy5zZXRXZXREYXRhKG9iaix1cmwpO1xyXG4gICAgICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW3RoaXMuX3dldERhdGFbdXJsXV0pO1xyXG4gICAgICAgIH0pKVxyXG4gICAgICAgIHJldHVybiBsb2FkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Jlc0RhdGFBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6QXJyYXk8YW55Pj1bXTtcclxuICAgIHB1YmxpYyBvbmxvYWQocmVzT2JqOmFueSxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNOYW1lPXJlc09ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgaWYodGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0ucnVuV2l0aChbdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzT2JqW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTphbnk9e307XHJcbiAgICAgICAgICAgIHZhciByZXNEYXRhOnN0cmluZz1yZXNPYmpbXCJyZXNEYXRhXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNEYXRhIT1udWxsICYmIHJlc0RhdGEhPVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhPUpTT04ucGFyc2UocmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZVVybDtcclxuICAgICAgICAgICAgdmFyIHVybEFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB2YXIgaXNDcmVhdGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzVXJsPVdteVV0aWxzLnRvQ2FzZShyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZih1cmwuaW5kZXhPZihcIi50eHRcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuQlVGRkVSfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYk5hbWVVcmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih1cmwuaW5kZXhPZihcIi5qcGdcIik+PTAgfHwgdXJsLmluZGV4T2YoXCIucG5nXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLklNQUdFfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHVybC5pbmRleE9mKFwiLm1wM1wiKT49MCB8fCB1cmwuaW5kZXhPZihcIi53YXZcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuU09VTkR9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmxBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Bc3NldENvbm1wbGV0ZSxbcmVzTmFtZSxiTmFtZVVybCxkYXRhXSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQXNzZXRQcm9ncmVzcywgW3Jlc05hbWVdLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBvbmxvYWQzZChyZXNPYmo6YW55LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc05hbWU9cmVzT2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICBpZih0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXS5ydW5XaXRoKFt0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNPYmpbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciBkYXRhOmFueT17fTtcclxuICAgICAgICAgICAgdmFyIHJlc0RhdGE6c3RyaW5nPXJlc09ialtcInJlc0RhdGFcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc0RhdGEhPW51bGwgJiYgcmVzRGF0YSE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9SlNPTi5wYXJzZShyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIscmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lO1xyXG4gICAgICAgICAgICB2YXIgdXJsQXJyOkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmwuaW5kZXhPZihcIi5sc1wiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgICAgICB1cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YS51cmxMaXN0PXVybExpc3Q7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5nZXRUaGlzLm9ubG9hZDNkKHVybEFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkFzc2V0Q29ubXBsZXRlLFtyZXNOYW1lLGJOYW1lLGRhdGFdKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Bc3NldFByb2dyZXNzLCBbcmVzTmFtZV0sIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHRwcml2YXRlIG9uQXNzZXRQcm9ncmVzcyhyZXNOYW1lLHByb2dyZXNzKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrUHJvZ3Jlc3NBcnI6QXJyYXk8TGF5YS5IYW5kbGVyPj10aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tQcm9ncmVzc0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYWxsYmFja1Byb2dyZXNzQXJyW2ldO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5ydW5XaXRoKFtwcm9ncmVzc10pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcbiAgICBcclxuICAgIHByaXZhdGUgb25Bc3NldENvbm1wbGV0ZShyZXNOYW1lLGJOYW1lVXJsOnN0cmluZyxkYXRhKTp2b2lke1xyXG4gICAgICAgIHZhciBjYWxsYmFja09rQXJyOkFycmF5PExheWEuSGFuZGxlcj49dGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXTtcclxuICAgICAgICBpZihiTmFtZVVybCE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBiYW89TGF5YS5sb2FkZXIuZ2V0UmVzKGJOYW1lVXJsKTtcclxuICAgICAgICAgICAgdmFyIGJOYW1lID0gYk5hbWVVcmwucmVwbGFjZShcIi50eHRcIixcIlwiKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKGJOYW1lLGJhbyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJGVUkt5Ye66ZSZOlwiLGJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWVBcnI9Yk5hbWUuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICBkYXRhLmJOYW1lPWJOYW1lQXJyW2JOYW1lQXJyLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXT1kYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrT2tBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrT2sgPSBjYWxsYmFja09rQXJyW2ldO1xyXG4gICAgICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW2RhdGFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1udWxsO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZEluZm9BcnI6YW55O1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRyQ2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkQWxsKGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHdlYkRhdGE6YW55PXRoaXMuZ2V0V2V0RGF0YSh0aGlzLnJlc1VybCk7XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhcnI9PW51bGwpe1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyPUpTT04ucGFyc2Uod2ViRGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIix3ZWJEYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyPXt9O1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXT0wO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl09MDtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXT1bXTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl09W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9YXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzTmFtZT1vYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgICAgICB2YXIgdD1vYmpbXCJ0eXBlXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNOYW1lPT1udWxsIHx8IHJlc05hbWU9PVwiXCIgfHwgdD09bnVsbCB8fCB0PT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uQXV0b0xvYWRPYmoodCxyZXNOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkT2JqKHR5cGU6c3RyaW5nLHJlc05hbWUpe1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgcmVzSWQ9dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF09e307XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcIm5cIl09cmVzTmFtZTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT10eXBlO1xyXG4gICAgICAgIHZhciBsb2FkT2s9ZmFsc2U7XHJcbiAgICAgICAgaWYodHlwZT09XCJ1aVwiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidWkt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGU9PVwidTNkXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQzZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInUzZC3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJtYXRzXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgdXJsTGlzdDpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgcmVzVXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgocmVzVXJsKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIHVybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybExpc3QubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZE1hdHMuZ2V0VGhpcy5vbmxvYWQzZCh1cmxMaXN0LG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgICAgICBsb2FkT2s9dHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibWF0cy3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJjdWJlTWFwXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJhdWRpb1wiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYXVkaW8t5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3ViZShyZXNOYW1lLCBjb21wbGV0ZTogTGF5YS5IYW5kbGVyKTpBcnJheTxMYXlhLlRleHR1cmVDdWJlPntcclxuICAgICAgICB2YXIgcmVzPXRoaXMuZ2V0UmVzT2JqKHJlc05hbWUpO1xyXG4gICAgICAgIGlmKHJlcz09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc1tcIlJlc3Jlc1wiXTtcclxuICAgICAgICB2YXIgUmVzcmVzT2JqOkFycmF5PExheWEuVGV4dHVyZUN1YmU+PVtdO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICByZXNVcmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChyZXNVcmwpO1xyXG4gICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgTGF5YS5UZXh0dXJlQ3ViZS5sb2FkKHVybCxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsY3ViZT0+e1xyXG4gICAgICAgICAgICAgICAgUmVzcmVzT2JqW2ldPWN1YmU7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZS5ydW5XaXRoKFtjdWJlLGldKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUmVzcmVzT2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Mb2FkaW5nKHJlc0lkLCBwcm9ncmVzczpudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1wicFwiXT1wcm9ncmVzcztcclxuICAgICAgICB2YXIgbnVtPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXTtcclxuICAgICAgICB2YXIgcE51bT0wO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bnVtO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBwPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltpXVtcInBcIl07XHJcbiAgICAgICAgICAgIGlmKHAhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgcE51bSs9cDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgcEM9KHBOdW0vdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKSoxMDA7XHJcbiAgICAgICAgaWYoaXNOYU4ocEMpKXBDPTA7XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcENdKTtcclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uTG9hZE9rKHJlc0lkLGRhdGE/KXtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdKz0xO1xyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInVpXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl0+PXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXSx0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJleHBvcnQgY2xhc3MgV215TG9hZDNke1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZDNke1xyXG4gICAgICAgIGlmKFdteUxvYWQzZC5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5fdGhpcz1uZXcgV215TG9hZDNkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlMb2FkM2QuX3RoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXJsTGlzdDpBcnJheTxzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbmxvYWQzZCh1cmxMaXN0OkFycmF5PHN0cmluZz4sY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgX3VybExpc3Q9W107XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHVybExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciB1cmw9dXJsTGlzdFtpXTtcclxuICAgICAgICAgICAgdXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgodXJsKTtcclxuICAgICAgICAgICAgX3VybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICAvLyBvYmpbXCJ1cmxcIl0rPVwiP3dteVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcG51bT0wO1xyXG4gICAgICAgIHZhciBwTnVtPTA7XHJcbiAgICAgICAgdmFyIGlzUD1mYWxzZTtcclxuICAgICAgICB2YXIgX1Byb2dyZXNzPShwKT0+e1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwKTtcclxuICAgICAgICAgICAgcG51bSs9MC4wMTtcclxuICAgICAgICAgICAgLy8gaWYoaXNQKXtcclxuICAgICAgICAgICAgLy8gICAgIHBOdW0gPSBwbnVtKyhwKSowLjk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZXtcclxuICAgICAgICAgICAgLy8gICAgIHBOdW0gPSBwbnVtO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGlmKHBudW0+PTAuMSB8fCBwPT0xKXtcclxuICAgICAgICAgICAgLy8gICAgIGlzUD10cnVlO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmKHBudW0+MSlwbnVtPTE7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwbnVtXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9vbk9rPSgpPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUoX3VybExpc3QsbmV3IExheWEuSGFuZGxlcihudWxsLF9vbk9rKSxMYXlhLkhhbmRsZXIuY3JlYXRlKG51bGwsX1Byb2dyZXNzLG51bGwsZmFsc2UpKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHByaXZhdGUgX21BcnI6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgIHByaXZhdGUgX21OdW09MDtcclxuICAgIHByaXZhdGUgX21QPTA7XHJcbiAgICBwcml2YXRlIF9tUDI9MDtcclxuXHJcbiAgICBwcml2YXRlIF9fb25sc1VybEFyck9rKGxzVXJsQXJyOkFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bHNVcmxBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9bHNVcmxBcnJbaV07XHJcbiAgICAgICAgICAgIHZhciB1cmw9b2JqW1widXJsXCJdO1xyXG4gICAgICAgICAgICB2YXIgczA9dXJsLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgdmFyIHMxPXVybC5yZXBsYWNlKHMwW3MwLmxlbmd0aC0xXSxcIlwiKTtcclxuICAgICAgICAgICAgdmFyIHJvb3RVcmw9czE7XHJcbiAgICAgICAgICAgIHZhciB0eHQ9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcbiAgICAgICAgICAgIHZhciBqc09iaj1KU09OLnBhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9fdGlRdVVybChqc09ialtcImRhdGFcIl0scm9vdFVybCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21BcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25BcnJPayksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkFyclApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uQXJyUChwKXtcclxuICAgICAgICB2YXIgcE51bT1wKih0aGlzLl9tTnVtKzEpO1xyXG4gICAgICAgIGlmKHBOdW0+dGhpcy5fbVApdGhpcy5fbVA9cE51bTtcclxuICAgICAgICB0aGlzLl9tUDI9KHRoaXMuX21QL3RoaXMuX21BcnIubGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcE51bT0odGhpcy5fbVAyKSowLjk4O1xyXG4gICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BOdW1dKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25BcnJPaygpe1xyXG4gICAgICAgIHRoaXMuX21OdW0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fbU51bT49dGhpcy5fbUFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX3RpUXVVcmwob2JqLHVybDpzdHJpbmc9XCJcIil7XHJcbiAgICAgICAgaWYob2JqW1wicHJvcHNcIl0hPW51bGwgJiYgb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBtZXNoUGF0aD11cmwrb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKG1lc2hQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChtZXNoUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsczpBcnJheTxhbnk+PW9ialtcInByb3BzXCJdW1wibWF0ZXJpYWxzXCJdO1xyXG4gICAgICAgICAgICBpZihtYXRlcmlhbHMhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpaT0wO2lpPG1hdGVyaWFscy5sZW5ndGg7aWkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGg9dXJsK21hdGVyaWFsc1tpaV1bXCJwYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbXCJjb21wb25lbnRzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGNvbXBvbmVudHM6QXJyYXk8YW55Pj1vYmpbXCJjb21wb25lbnRzXCJdO1xyXG4gICAgICAgICAgICBpZihjb21wb25lbnRzLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkwID0gMDsgaTAgPCBjb21wb25lbnRzLmxlbmd0aDsgaTArKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wID0gY29tcG9uZW50c1tpMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImF2YXRhclwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcGF0aD11cmwrY29tcFtcImF2YXRhclwiXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihhcGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goYXBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbXBbXCJsYXllcnNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXJzOkFycmF5PGFueT49Y29tcFtcImxheWVyc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IGxheWVycy5sZW5ndGg7IGkxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllciA9IGxheWVyc1tpMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVzOkFycmF5PGFueT49bGF5ZXJbXCJzdGF0ZXNcIl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBzdGF0ZXMubGVuZ3RoOyBpMisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW2kyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xpcFBhdGg9dXJsK3N0YXRlW1wiY2xpcFBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGNsaXBQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKGNsaXBQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNoaWxkOkFycmF5PGFueT49b2JqW1wiY2hpbGRcIl07XHJcbiAgICAgICAgaWYoY2hpbGQhPW51bGwgJiYgY2hpbGQubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGNoaWxkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3RpUXVVcmwoY2hpbGRbaV0sdXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiZXhwb3J0IGNsYXNzIFdteUxvYWRNYXRze1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZE1hdHN7XHJcbiAgICAgICAgaWYoV215TG9hZE1hdHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlMb2FkTWF0cy5fdGhpcz1uZXcgV215TG9hZE1hdHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWRNYXRzLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vblVybEFyck9rLFt1cmxMaXN0XSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tYXRzVXJsQXJyOkFycmF5PHN0cmluZz49W107XHJcbiAgICBwcml2YXRlIF9tYXRPaz1mYWxzZTtcclxuICAgIHByaXZhdGUgX21hdE51bT0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UD0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UDI9MDtcclxuXHJcbiAgICBwcml2YXRlIF9fb25VcmxBcnJPayh1cmxMaXN0OkFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybD11cmxMaXN0W2ldO1xyXG4gICAgICAgICAgICAvLyB2YXIgdHh0PUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICAvLyB2YXIganNPYmo9SlNPTi5wYXJzZSh0eHQpO1xyXG4gICAgICAgICAgICB2YXIganNPYmo9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXJyPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIHZhciBtYXRzVXJsPXVybC5yZXBsYWNlKGFyclthcnIubGVuZ3RoLTFdLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXk6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycmF5PWpzT2JqW1wibWF0c1wiXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgICAgICBpZihvYmpbXCJ0YXJnZXROYW1lXCJdPT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hdFVybD1tYXRzVXJsK29ialtcIm1hdFVybFwiXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hdHNVcmxBcnIucHVzaChtYXRVcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21hdHNVcmxBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tYXRzVXJsQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25NYXRBcnJPayksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyclApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyUChwKXtcclxuICAgICAgICB2YXIgcE51bT1wKih0aGlzLl9tYXROdW0rMSk7XHJcbiAgICAgICAgaWYocE51bT50aGlzLl9tYXRQKXRoaXMuX21hdFA9cE51bTtcclxuICAgICAgICB0aGlzLl9tYXRQMj0odGhpcy5fbWF0UC90aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbdGhpcy5fbWF0UDJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyT2soKXtcclxuICAgICAgICB0aGlzLl9tYXROdW0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fbWF0TnVtPj10aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbmV4cG9ydCBjbGFzcyBXbXlTaGFkZXJNc2d7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbVx0dGFyZ2V0XHTlr7nosaFcclxuICAgICAqIEBwYXJhbVx0bWF0XHTmnZDotKhcclxuICAgICAqIEBwYXJhbVx0c2hhZGVyVXJsXHRzaGFkZXLnmoTlnLDlnYBcclxuICAgICAqIEBwYXJhbVx0aXNOZXdNYXRlcmlhXHTmmK/lkKbmlrDmnZDotKhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXRTaGFkZXIodGFyZ2V0LCBtYXQ6TGF5YS5CYXNlTWF0ZXJpYWwsIHNoYWRlclVybDpzdHJpbmcsIGlzTmV3TWF0ZXJpYT1mYWxzZSwgcERhdGE/OmFueSk6TGF5YS5CYXNlTWF0ZXJpYWx7XHJcbiAgICAgICAgdmFyIHJlbmRlcmVyOkxheWEuQmFzZVJlbmRlcjtcclxuICAgICAgICB2YXIgc2hhcmVkTWF0ZXJpYWw6IExheWEuQmFzZU1hdGVyaWFsO1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPSh0YXJnZXQgYXMgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKS5za2lubmVkTWVzaFJlbmRlcmVyO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJlcj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXJlbmRlcmVyLnNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZW5kZXJlcj0odGFyZ2V0IGFzIExheWEuTWVzaFNwcml0ZTNEKS5tZXNoUmVuZGVyZXI7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyPT1udWxsKXJldHVybjtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9cmVuZGVyZXIuc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGlzTmV3TWF0ZXJpYSl7XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXNoYXJlZE1hdGVyaWFsLmNsb25lKCk7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLnNoYXJlZE1hdGVyaWFsPXNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIH1cclxuXHRcdGZvcih2YXIga2V5IGluIG1hdCl7XHJcblx0XHRcdHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbFtrZXldPW1hdFtrZXldO1xyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChzaGFkZXJVcmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuc2hhZGVyQ29ubXBsZXRlLFtzaGFyZWRNYXRlcmlhbCxwRGF0YV0pKTtcclxuICAgICAgICByZXR1cm4gc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2hhZGVyQ29ubXBsZXRlKHNoYXJlZE1hdGVyaWFsOkxheWEuQmFzZU1hdGVyaWFsLCBwRGF0YTphbnksIGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGE9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciB4bWw9bnVsbFxyXG4gICAgICAgIHRyeVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeG1sID0gTGF5YS5VdGlscy5wYXJzZVhNTEZyb21TdHJpbmcoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgeG1sTm9kZTpOb2RlID0geG1sLmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgICB2YXIgc2hhZGVyTmFtZT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZSh4bWxOb2RlLFwibmFtZVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGksbyxvTmFtZSx2MCx2MSxpbml0VjtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgYXR0cmlidXRlTWFwPXt9O1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVNYXBOb2RlPXRoaXMuZ2V0Tm9kZSh4bWxOb2RlLFwiYXR0cmlidXRlTWFwXCIpO1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVNYXBBcnI9dGhpcy5nZXROb2RlQXJyKGF0dHJpYnV0ZU1hcE5vZGUsXCJkYXRhXCIpO1xyXG4gICAgICAgIGZvcihpPTA7aTxhdHRyaWJ1dGVNYXBBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIG8gPSBhdHRyaWJ1dGVNYXBBcnJbaV07XHJcbiAgICAgICAgICAgIG9OYW1lPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJuYW1lXCIpO1xyXG4gICAgICAgICAgICB2MD10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwidjBcIik7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZU1hcFtvTmFtZV09dGhpcy5nZXRWKHYwLFwiaW50XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHVuaWZvcm1NYXA9e307XHJcbiAgICAgICAgdmFyIHVuaWZvcm1NYXBOb2RlPXRoaXMuZ2V0Tm9kZSh4bWxOb2RlLFwidW5pZm9ybU1hcFwiKTtcclxuICAgICAgICB2YXIgdW5pZm9ybU1hcEFycj10aGlzLmdldE5vZGVBcnIodW5pZm9ybU1hcE5vZGUsXCJkYXRhXCIpO1xyXG5cclxuICAgICAgICB2YXIgd215VmFsdWVzPXNoYXJlZE1hdGVyaWFsW1wid215VmFsdWVzXCJdO1xyXG4gICAgICAgIGlmKHdteVZhbHVlcyE9bnVsbCAmJiB3bXlWYWx1ZXNbXCJjdWJlXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGN1YmVOYW1lPXdteVZhbHVlc1tcImN1YmVcIl07XHJcbiAgICAgICAgICAgIGlmKHBEYXRhIT1udWxsICYmIHBEYXRhW1wiY3ViZUZ1blwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBwRGF0YVtcImN1YmVGdW5cIl0oc2hhcmVkTWF0ZXJpYWwsY3ViZU5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihpPTA7aTx1bmlmb3JtTWFwQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBpbml0Vj1udWxsO1xyXG4gICAgICAgICAgICBvID0gdW5pZm9ybU1hcEFycltpXTtcclxuICAgICAgICAgICAgb05hbWU9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcIm5hbWVcIik7XHJcbiAgICAgICAgICAgIHYwPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJ2MFwiKTtcclxuICAgICAgICAgICAgdjE9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcInYxXCIpO1xyXG4gICAgICAgICAgICB2YXIgdkFycj1bXTtcclxuICAgICAgICAgICAgdkFyclswXT10aGlzLmdldFYodjAsXCJpbnRcIik7XHJcbiAgICAgICAgICAgIHZBcnJbMV09dGhpcy5nZXRWKHYxLFwiaW50XCIpO1xyXG4gICAgICAgICAgICB1bmlmb3JtTWFwW29OYW1lXT12QXJyO1xyXG5cclxuICAgICAgICAgICAgaWYod215VmFsdWVzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGluaXRWPXdteVZhbHVlc1tvTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vaW5pdFY9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcImluaXRWXCIpO1xyXG4gICAgICAgICAgICBpZihpbml0ViE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpbml0ViA9IGluaXRWLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGluaXRWLmxlbmd0aD09NCl7XHJcbiAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcih2QXJyWzBdLG5ldyBMYXlhLlZlY3RvcjQocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkscGFyc2VGbG9hdChpbml0VlsyXSkscGFyc2VGbG9hdChpbml0VlszXSkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0zKXtcclxuICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKHZBcnJbMF0sbmV3IExheWEuVmVjdG9yMyhwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSxwYXJzZUZsb2F0KGluaXRWWzJdKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTIpe1xyXG4gICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IodkFyclswXSxuZXcgTGF5YS5WZWN0b3IyKHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09MSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzTmFOKHBhcnNlRmxvYXQoaW5pdFZbMF0pKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0TnVtYmVyKHZBcnJbMF0scGFyc2VGbG9hdChpbml0VlswXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyT2JqPWluaXRWWzBdK1wiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0ck9iaj09XCJ0ZXhcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4OkxheWEuQmFzZVRleHR1cmU9c2hhcmVkTWF0ZXJpYWxbb05hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRUZXh0dXJlKHZBcnJbMF0sdGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNwcml0ZURlZmluZXM9TGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNELnNoYWRlckRlZmluZXM7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsRGVmaW5lcz1MYXlhLkJsaW5uUGhvbmdNYXRlcmlhbC5zaGFkZXJEZWZpbmVzO1xyXG4gICAgICAgIGlmKHBEYXRhIT1udWxsKXtcclxuICAgICAgICAgICAgaWYocERhdGFbXCJzcHJpdGVEZWZpbmVzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHNwcml0ZURlZmluZXM9cERhdGFbXCJzcHJpdGVEZWZpbmVzXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHBEYXRhW1wibWF0ZXJpYWxEZWZpbmVzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsRGVmaW5lcz1wRGF0YVtcIm1hdGVyaWFsRGVmaW5lc1wiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNoYWRlcj1MYXlhLlNoYWRlcjNELmFkZChzaGFkZXJOYW1lLGF0dHJpYnV0ZU1hcCx1bmlmb3JtTWFwLHNwcml0ZURlZmluZXMsbWF0ZXJpYWxEZWZpbmVzKTtcclxuXHJcbiAgICAgICAgdmFyIFN1YlNoYWRlck5vZGU9dGhpcy5nZXROb2RlKHhtbE5vZGUsXCJTdWJTaGFkZXJcIik7XHJcblxyXG4gICAgICAgIHZhciByZW5kZXJNb2RlTm9kZT10aGlzLmdldE5vZGUoeG1sTm9kZSxcInJlbmRlck1vZGVcIik7XHJcbiAgICAgICAgaWYocmVuZGVyTW9kZU5vZGUhPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyTW9kZT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShyZW5kZXJNb2RlTm9kZSxcInZcIik7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlck1vZGUhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWxbXCJyZW5kZXJNb2RlXCJdPXRoaXMuZ2V0VihyZW5kZXJNb2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIFBhc3NBcnI9dGhpcy5nZXROb2RlQXJyKFN1YlNoYWRlck5vZGUsXCJQYXNzXCIpO1xyXG4gICAgICAgIGZvcihpPTA7aTxQYXNzQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgcGFzcyA9IFBhc3NBcnJbaV07XHJcbiAgICAgICAgICAgIHZhciB2c05vZGU6Tm9kZT10aGlzLmdldE5vZGUocGFzcyxcIlZFUlRFWFwiKTtcclxuICAgICAgICAgICAgdmFyIHZzOnN0cmluZz12c05vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIHZzID0gdnMucmVwbGFjZSgvKFxccikvZyxcIlwiKTtcclxuICAgICAgICAgICAgdmFyIHBzTm9kZTpOb2RlPXRoaXMuZ2V0Tm9kZShwYXNzLFwiRlJBR01FTlRcIik7XHJcbiAgICAgICAgICAgIHZhciBwczpzdHJpbmc9cHNOb2RlLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICBwcyA9IHBzLnJlcGxhY2UoLyhcXHIpL2csXCJcIik7XHJcbiAgICAgICAgICAgIGlmKGk+MCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcnM6TGF5YS5SZW5kZXJTdGF0ZT0gc2hhcmVkTWF0ZXJpYWwuZ2V0UmVuZGVyU3RhdGUoMCkuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9yZW5kZXJTdGF0ZXMucHVzaChycyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBjdWxsTm9kZT10aGlzLmdldE5vZGUocGFzcyxcImN1bGxcIik7XHJcbiAgICAgICAgICAgIGlmKGN1bGxOb2RlIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHZhciBjdWxsPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKGN1bGxOb2RlLFwidlwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGN1bGwhPW51bGwgfHwgY3VsbCE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuZ2V0UmVuZGVyU3RhdGUoaSkuY3VsbD10aGlzLmdldFYoY3VsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNoYWRlci5hZGRTaGFkZXJQYXNzKHZzLHBzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXI9c2hhZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VihvYmo6YW55LGJhY2tUeXBlPVwibnVsbFwiKTphbnl7XHJcbiAgICAgICAgdmFyIHRlbXBOYW1lQXJyLHRlbXBPYmosdGVtcFYsaWk7XHJcbiAgICAgICAgdGVtcE5hbWVBcnI9b2JqLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICBpZih0ZW1wTmFtZUFyclswXT09PVwiTGF5YVwiKXtcclxuICAgICAgICAgICAgdGVtcFY9TGF5YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0ZW1wTmFtZUFyclswXT09PVwibGF5YVwiKXtcclxuICAgICAgICAgICAgdGVtcFY9bGF5YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGlpPTE7aWk8dGVtcE5hbWVBcnIubGVuZ3RoO2lpKyspe1xyXG4gICAgICAgICAgICB0ZW1wVj10ZW1wVlt0ZW1wTmFtZUFycltpaV1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0ZW1wViE9bnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wVjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihiYWNrVHlwZSE9XCJudWxsXCIpe1xyXG4gICAgICAgICAgICBpZihiYWNrVHlwZT09XCJpbnRcIil7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgc3RyaW5nIGluIHRoZSBmb3JtYXQgXCIjcnJnZ2JiXCIgb3IgXCJycmdnYmJcIiB0byB0aGUgY29ycmVzcG9uZGluZ1xyXG4gICAgICogdWludCByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGNvbG9yIFRoZSBjb2xvciBpbiBzdHJpbmcgZm9ybWF0LlxyXG4gICAgICogQHJldHVybiBUaGUgY29sb3IgaW4gdWludCBmb3JtYXQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbG9yU3RyaW5nVG9VaW50KGNvbG9yOlN0cmluZyk6bnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKFwiMHhcIiArIGNvbG9yLnJlcGxhY2UoXCIjXCIsIFwiXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRBdHRyaWJ1dGVzVmFsdWUobm9kZTphbnksa2V5OnN0cmluZyl7XHJcbiAgICAgICAgdmFyIG5vZGVWYWx1ZT1udWxsO1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVzPW5vZGVbXCJhdHRyaWJ1dGVzXCJdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gYXR0cmlidXRlc1tpXTtcclxuICAgICAgICAgICAgaWYoZWxlbWVudC5uYW1lPT1rZXkpe1xyXG4gICAgICAgICAgICAgICAgbm9kZVZhbHVlPWVsZW1lbnRbXCJub2RlVmFsdWVcIl07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZVZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldE5vZGUoeG1sOmFueSxrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgY2hpbGROb2Rlcz14bWwuY2hpbGROb2RlcztcclxuICAgICAgICB2YXIgbm9kZTphbnk9bnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG9iajphbnk9Y2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYob2JqW1wibm9kZU5hbWVcIl09PWtleSl7XHJcbiAgICAgICAgICAgICAgICBub2RlPW9iajtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Tm9kZUFycih4bWw6YW55LGtleTpzdHJpbmcpOkFycmF5PE5vZGU+e1xyXG4gICAgICAgIHZhciBjaGlsZE5vZGVzPXhtbC5jaGlsZE5vZGVzO1xyXG4gICAgICAgIHZhciBub2RlQXJyOkFycmF5PE5vZGU+PVtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgb2JqOmFueT1jaGlsZE5vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZihvYmpbXCJub2RlTmFtZVwiXT09a2V5KXtcclxuICAgICAgICAgICAgICAgIG5vZGVBcnIucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlQXJyO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFdteV9Mb2FkX01hZyB9IGZyb20gXCIuLi9XbXlfTG9hZF9NYWdcIjtcclxuaW1wb3J0IHsgV215U2hhZGVyTXNnIH0gZnJvbSBcIi4vV215U2hhZGVyTXNnXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215VXRpbHMzRHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2QodGFyZ2V0LG9iak5hbWU6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0Lm5hbWU9PW9iak5hbWUpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG86TGF5YS5TcHJpdGUzRCA9IHRhcmdldC5fY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChvLl9jaGlsZHJlbi5sZW5ndGggPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoby5uYW1lPT1vYmpOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBPYmo9dGhpcy5nZXRPYmozZChvLG9iak5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcE9iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBPYmo7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LGNsYXM6YW55LGFycj8pOkFycmF5PGFueT57XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbClhcnI9W107XHJcblxyXG4gICAgICAgIHZhciBvYmo9dGFyZ2V0LmdldENvbXBvbmVudChjbGFzKTtcclxuICAgICAgICBpZihvYmo9PW51bGwpe1xyXG4gICAgICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBjbGFzKXtcclxuICAgICAgICAgICAgICAgIG9iaj10YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqIT1udWxsKXtcclxuICAgICAgICAgICAgYXJyLnB1c2gob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZHJlbkNvbXBvbmVudChvLGNsYXMsYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFNoYWRlckFsbCh0YXJnZXQsbWF0c1VybDpzdHJpbmcsIHNoYWRlcnNVcmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgbmV3TWF0c1VybD1tYXRzVXJsK1wid215TWF0cy5qc29uXCI7XHJcbiAgICAgICAgdmFyIG5ld1NoYWRlcnNVcmw9c2hhZGVyc1VybDtcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKG5ld01hdHNVcmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLChtYXRzVXJsLHNoYWRlcnNVcmwsZGF0YSk9PntcclxuICAgICAgICAgICAgaWYoZGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ3bXlNYXRzLeWHuumUmTpcIixuZXdNYXRzVXJsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYXJyYXk6QXJyYXk8YW55Pj1kYXRhW1wibWF0c1wiXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYob2JqW1widGFyZ2V0TmFtZVwiXT09XCJcIiljb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQzRD1XbXlVdGlsczNELmdldE9iajNkKHRhcmdldCxvYmpbXCJ0YXJnZXROYW1lXCJdKWFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgICAgICAgICBpZih0YXJnZXQzRD09bnVsbCljb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXRVcmw9bWF0c1VybCtvYmpbXCJtYXRVcmxcIl07XHJcbiAgICAgICAgICAgICAgICB2YXIgc2hhZGVyTmFtZVVybD1zaGFkZXJzVXJsK29ialtcInNoYWRlck5hbWVcIl0rXCIudHh0XCI7XHJcbiAgICAgICAgICAgICAgICBMYXlhLkJhc2VNYXRlcmlhbC5sb2FkKG1hdFVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKF90YXJnZXQzRDpMYXlhLlNwcml0ZTNELF9zaGFkZXJOYW1lVXJsLG0pPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBEYXRhPXt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHBEYXRhW1wiY3ViZUZ1blwiXT0obSxjdWJlTmFtZSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMuZ2V0Q3ViZShjdWJlTmFtZSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsKGN1YmUsaSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGk9PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRUZXh0dXJlKExheWEuU2NlbmUzRC5SRUZMRUNUSU9OVEVYVFVSRSxjdWJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBXbXlTaGFkZXJNc2cuc2V0U2hhZGVyKF90YXJnZXQzRCxtLF9zaGFkZXJOYW1lVXJsLGZhbHNlLHBEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihfdGFyZ2V0M0QhPW51bGwgJiYgX3RhcmdldDNELnBhcmVudCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90YXJnZXQzRC5wYXJlbnQucmVtb3ZlQ2hpbGQoX3RhcmdldDNEKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFt0YXJnZXQzRCxzaGFkZXJOYW1lVXJsXSkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFttYXRzVXJsLG5ld1NoYWRlcnNVcmxdKSxudWxsLExheWEuTG9hZGVyLkpTT04pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pUGxheSh0YXJnZXQsdGFyZ2V0TmFtZSxhbmlOYW1lKTpMYXlhLkFuaW1hdG9ye1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICB0YXJnZXQzZF9hbmkucGxheShhbmlOYW1lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDNkX2FuaTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25TaGFkb3coZGlyZWN0aW9uTGlnaHQ6TGF5YS5EaXJlY3Rpb25MaWdodCxzaGFkb3dSZXNvbHV0aW9uPTUxMixzaGFkb3dQQ0ZUeXBlPTEsc2hhZG93RGlzdGFuY2U6bnVtYmVyPTEwMCxpc1NoYWRvdzpib29sZWFuPXRydWUpe1xyXG4gICAgICAgIC8v54Gv5YWJ5byA5ZCv6Zi05b2xXHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgLy/lj6/op4HpmLTlvbHot53nprtcclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dEaXN0YW5jZSA9IHNoYWRvd0Rpc3RhbmNlO1xyXG4gICAgICAgIC8v55Sf5oiQ6Zi05b2x6LS05Zu+5bC65a+4XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UmVzb2x1dGlvbiA9IHNoYWRvd1Jlc29sdXRpb247XHJcbiAgICAgICAgLy9kaXJlY3Rpb25MaWdodC5zaGFkb3dQU1NNQ291bnQ9MTtcclxuICAgICAgICAvL+aooeeziuetiee6pyzotorlpKfotorpq5gs5pu06ICX5oCn6IO9XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UENGVHlwZSA9IHNoYWRvd1BDRlR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uQ2FzdFNoYWRvdyh0YXJnZXQsdHlwZT0wLGlzU2hhZG93PXRydWUsaXNDaGlsZHJlbj10cnVlKXtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLk1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBtczNEPSh0YXJnZXQgYXMgTGF5YS5NZXNoU3ByaXRlM0QpO1xyXG4gICAgICAgICAgICBpZih0eXBlPT0wKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0yKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBzbXMzZD0odGFyZ2V0IGFzIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGU9PTApe1xyXG4gICAgICAgICAgICAgICAgc21zM2Quc2tpbm5lZE1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIHNtczNkLnNraW5uZWRNZXNoUmVuZGVyZXIuY2FzdFNoYWRvdz1pc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaXNDaGlsZHJlbil7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lm51bUNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSB0YXJnZXQuZ2V0Q2hpbGRBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25DYXN0U2hhZG93KG9iaix0eXBlLGlzU2hhZG93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZ2IyaGV4KHIsZyxiKXtcclxuICAgICAgICB2YXIgX2hleD1cIiNcIiArIHRoaXMuaGV4KHIpICt0aGlzLiBoZXgoZykgKyB0aGlzLmhleChiKTtcclxuICAgICAgICByZXR1cm4gX2hleC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGV4KHgpe1xyXG4gICAgICAgIHg9dGhpcy5vbk51bVRvKHgpO1xyXG4gICAgICAgIHJldHVybiAoXCIwXCIgKyBwYXJzZUludCh4KS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4pe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQoMikpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBcclxuICAgcHVibGljIHN0YXRpYyBsZXJwRihhOm51bWJlciwgYjpudW1iZXIsIHM6bnVtYmVyKTpudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIChhICsgKGIgLSBhKSAqIHMpO1xyXG4gICAgfVxyXG5cclxufSJdfQ==
