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
        var Config3D = {
            /**@private */
            "defaultPhysicsMemory": 16,
            /**@private */
            "_editerEnvironment": false,
            /**
            *是否开启抗锯齿。
            */
            "isAntialias": true,
            /**
            *设置画布是否透明。
            */
            "isAlpha": true,
            /**
            *设置画布是否预乘。
            */
            "premultipliedAlpha": true,
            /**
            *设置画布的是否开启模板缓冲。
            */
            "isStencil": true,
        };
        if (window["Laya3D"])
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height, Config3D);
        else
            Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
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
        this._LayaEngine = window["LayaEngine"];
        if (this._LayaEngine != null) {
            this._texture = this._LayaEngine["texture"];
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpciBJREUgMi4wLjAgYmV0YTIvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDb25maWcudHMiLCJzcmMvTWFpbi50cyIsInNyYy90YXIvV215VGFyLnRzIiwic3JjL3dteVV0aWxzSDUvV215VXRpbHMudHMiLCJzcmMvd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkM2QudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkTWF0cy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVNoYWRlck1zZy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkE7O0VBRUU7QUFDRjtJQVdJO0lBQWMsQ0FBQztJQUNSLGVBQUksR0FBWDtJQUNBLENBQUM7SUFaTSxnQkFBSyxHQUFRLEdBQUcsQ0FBQztJQUNqQixpQkFBTSxHQUFRLElBQUksQ0FBQztJQUNuQixvQkFBUyxHQUFRLFlBQVksQ0FBQztJQUM5QixxQkFBVSxHQUFRLE1BQU0sQ0FBQztJQUN6QixxQkFBVSxHQUFRLEVBQUUsQ0FBQztJQUNyQixvQkFBUyxHQUFRLEVBQUUsQ0FBQztJQUNwQixnQkFBSyxHQUFTLEtBQUssQ0FBQztJQUNwQixlQUFJLEdBQVMsSUFBSSxDQUFDO0lBQ2xCLHVCQUFZLEdBQVMsS0FBSyxDQUFDO0lBQzNCLDRCQUFpQixHQUFTLElBQUksQ0FBQztJQUkxQyxpQkFBQztDQWRELEFBY0MsSUFBQTtrQkFkb0IsVUFBVTtBQWUvQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7QUNsQmxCLDJDQUFzQztBQUN0Qyx5REFBd0Q7QUFDeEQsMERBQXlEO0FBQ3pELHVDQUFrQztB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LENBQUMsR0FBRSxJQUFJLENBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUNjLGNBQUcsR0FBbEIsVUFBbUIsQ0FBQztRQUNoQixDQUFDLEdBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixPQUFPLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRWEsa0JBQU8sR0FBckIsVUFBc0IsQ0FBQztRQUN6QixJQUFHLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBRSxDQUFDLEVBQUM7WUFDdEIsQ0FBQyxHQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEI7UUFDUCxPQUFPLENBQUMsQ0FBQztJQUNWLENBQUM7SUFHZSxnQkFBSyxHQUFuQixVQUFvQixDQUFRLEVBQUUsQ0FBUSxFQUFFLENBQVE7UUFDM0MsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUwsaUJBQUM7QUFBRCxDQXJLQSxBQXFLQyxJQUFBO0FBcktZLGdDQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj02NDA7XHJcbiAgICBzdGF0aWMgaGVpZ2h0Om51bWJlcj0xMTM2O1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XHJcbiAgICBzdGF0aWMgc2NyZWVuTW9kZTpzdHJpbmc9XCJub25lXCI7XHJcbiAgICBzdGF0aWMgc3RhcnRTY2VuZTpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBzY2VuZVJvb3Q6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBzdGF0OmJvb2xlYW49dHJ1ZTtcclxuICAgIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe31cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICB9XHJcbn1cclxuR2FtZUNvbmZpZy5pbml0KCk7IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBXbXlVdGlsczNEIH0gZnJvbSBcIi4vd215VXRpbHNINS9kMy9XbXlVdGlsczNEXCI7XHJcbmltcG9ydCB7IFdteV9Mb2FkX01hZyB9IGZyb20gXCIuL3dteVV0aWxzSDUvV215X0xvYWRfTWFnXCI7XHJcbmltcG9ydCBXbXlUYXIgZnJvbSBcIi4vdGFyL1dteVRhclwiO1xyXG5jbGFzcyBNYWluIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdFxyXG5cdHZhciBDb25maWczRD17XHJcblx0XHQvKipAcHJpdmF0ZSAqL1xyXG5cdFx0XCJkZWZhdWx0UGh5c2ljc01lbW9yeVwiOjE2LFxyXG5cdFx0LyoqQHByaXZhdGUgKi9cclxuXHRcdFwiX2VkaXRlckVudmlyb25tZW50XCI6ZmFsc2UsXHJcblx0XHQvKipcclxuXHRcdCrmmK/lkKblvIDlkK/mipfplK/pvb/jgIJcclxuXHRcdCovXHJcblx0XHRcImlzQW50aWFsaWFzXCI6dHJ1ZSxcclxuXHRcdC8qKlxyXG5cdFx0Kuiuvue9rueUu+W4g+aYr+WQpumAj+aYjuOAglxyXG5cdFx0Ki9cclxuXHRcdFwiaXNBbHBoYVwiOnRydWUsXHJcblx0XHQvKipcclxuXHRcdCrorr7nva7nlLvluIPmmK/lkKbpooTkuZjjgIJcclxuXHRcdCovXHJcblx0XHRcInByZW11bHRpcGxpZWRBbHBoYVwiOnRydWUsXHJcblx0XHQvKipcclxuXHRcdCrorr7nva7nlLvluIPnmoTmmK/lkKblvIDlkK/mqKHmnb/nvJPlhrLjgIJcclxuXHRcdCovXHJcblx0XHRcImlzU3RlbmNpbFwiOnRydWUsXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHdpbmRvd1tcIkxheWEzRFwiXSkgTGF5YTNELmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQsQ29uZmlnM0QpO1xyXG5cdFx0ZWxzZSBMYXlhLmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQsIExheWFbXCJXZWJHTFwiXSk7XHJcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcclxuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xyXG5cdFx0Ly8gTGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBMYXlhLlN0YWdlLlNDQUxFX1NIT1dBTEw7XHJcblx0XHQvLyBMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHYW1lQ29uZmlnLnNjcmVlbk1vZGU7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBMYXlhLlN0YWdlLlNDQUxFX0ZVTEw7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gTGF5YS5TdGFnZS5TQ1JFRU5fTk9ORTtcclxuXHRcdExheWEuc3RhZ2UuYmdDb2xvciA9ICdub25lJztcclxuXHRcdFxyXG5cdFx0Ly/orr7nva7msLTlubPlr7npvZBcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduSCA9IFwiY2VudGVyXCI7XHJcblx0XHQvL+iuvue9ruWeguebtOWvuem9kFxyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25WID0gXCJtaWRkbGVcIjtcclxuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cclxuXHRcdExheWEuVVJMLmV4cG9ydFNjZW5lVG9Kc29uID0gR2FtZUNvbmZpZy5leHBvcnRTY2VuZVRvSnNvbjtcclxuXHJcblx0XHQvL+aJk+W8gOiwg+ivlemdouadv++8iOmAmui/h0lEReiuvue9ruiwg+ivleaooeW8j++8jOaIluiAhXVybOWcsOWdgOWinuWKoGRlYnVnPXRydWXlj4LmlbDvvIzlnYflj6/miZPlvIDosIPor5XpnaLmnb/vvIlcclxuXHRcdGlmIChHYW1lQ29uZmlnLmRlYnVnIHx8IExheWEuVXRpbHMuZ2V0UXVlcnlTdHJpbmcoXCJkZWJ1Z1wiKSA9PSBcInRydWVcIikgTGF5YS5lbmFibGVEZWJ1Z1BhbmVsKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcuc3RhdCkgTGF5YS5TdGF0LnNob3coKTtcclxuXHRcdExheWEuYWxlcnRHbG9iYWxFcnJvciA9IHRydWU7XHJcblxyXG5cdFx0V215VGFyLmdldFRoaXMuaW5pdCgpO1xyXG5cclxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcblx0XHR2YXIgd215VlRpbWU9XCJcIjtcclxuXHRcdGlmKHdpbmRvdyE9bnVsbCAmJiB3aW5kb3dbXCJ3bXlWVGltZVwiXSE9bnVsbCl7XHJcblx0XHRcdHdteVZUaW1lPXdpbmRvd1tcIndteVZUaW1lXCJdO1xyXG5cdFx0fVxyXG5cdFx0Ly9MYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIit3bXlWVGltZSwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cdH1cclxuXHJcblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZChmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QpO1xyXG5cdFx0dmFyIHVybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KFwicmVzL2xvYWRJbmZvLmpzb25cIik7XHJcbiAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMub25Mb2FkV2V0RGF0YSh1cmwsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZExvYWQpKTtcclxuXHR9XHJcblx0XHJcbiAgICBwcml2YXRlIG9uTG9hZExvYWQoKXtcclxuICAgICAgICB2YXIgcmVzT2JqPVdteV9Mb2FkX01hZy5nZXRUaGlzLmdldFJlc09iaihcImxvYWRcIik7XHJcbiAgICAgICAgaWYocmVzT2JqIT1udWxsKXtcclxuICAgICAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMub25sb2FkKHJlc09iaixuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRNYWluKSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcbiAgICBwcml2YXRlIF9sb2FkVmlldzogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHRwcml2YXRlIF9iYXI6ZmFpcnlndWkuR1Byb2dyZXNzQmFyO1xyXG5cdHByaXZhdGUgb25Mb2FkTWFpbigpe1xyXG5cdFx0dGhpcy5fbG9hZFZpZXc9ZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdChcImxvYWRcIixcIkxvYWRcIikuYXNDb207XHJcblx0XHRmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKHRoaXMuX2xvYWRWaWV3KTtcclxuXHRcdHRoaXMuX2Jhcj10aGlzLl9sb2FkVmlldy5nZXRDaGlsZChcImJhclwiKS5hc1Byb2dyZXNzO1xyXG5cclxuICAgICAgICBXbXlfTG9hZF9NYWcuZ2V0VGhpcy5vbkF1dG9Mb2FkQWxsKG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25Mb2FkaW5nKHByb2dyZXNzOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Jhci52YWx1ZT1wcm9ncmVzcztcclxuXHR9XHJcblx0XHJcbiAgICBwcml2YXRlIF91M2RBcnI7XHJcbiAgICBwdWJsaWMgc2NlbmUzRDpMYXlhLlNjZW5lM0Q7XHJcblx0cHJpdmF0ZSBvbkxvYWRPayh1aUFycix1M2RBcnIpe1xyXG5cdFx0dGhpcy5fdTNkQXJyPXUzZEFycjtcclxuXHRcdExheWEudGltZXIub25jZSg0MDAsdGhpcywgKCk9PntcclxuXHRcdFx0dGhpcy5vbk1haW4oKTtcclxuXHRcdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5yZW1vdmVDaGlsZCh0aGlzLl9sb2FkVmlldyk7XHJcblx0XHRcdHRoaXMuX2xvYWRWaWV3PW51bGw7XHJcblx0XHRcdHRoaXMuX2Jhcj1udWxsO1xyXG5cdFx0fSk7XHJcblx0XHQvL+a3u+WKoDNE5Zy65pmvXHJcblx0XHRpZih1M2RBcnJbMF0hPW51bGwpe1xyXG5cdFx0XHR2YXIgdXJsM2Q9dTNkQXJyWzBdLnVybExpc3RbMF07XHJcblx0XHRcdHRoaXMuc2NlbmUzRCA9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybDNkKTtcclxuXHRcdFx0V215VXRpbHMzRC5zZXRTaGFkZXJBbGwodGhpcy5zY2VuZTNELFwicmVzL21hdHMvXCIsXCJyZXMvc2hhZGVycy9cIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG4gICAgcHJpdmF0ZSBfbWFpblZpZXc6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBvbk1haW4oKXtcclxuXHRcdHRoaXMuX21haW5WaWV3PWZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJtYWluXCIsXCJNYWluXCIpLmFzQ29tO1xyXG5cdFx0aWYodGhpcy5fbWFpblZpZXchPW51bGwpe1xyXG5cdFx0XHRmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKHRoaXMuX21haW5WaWV3KTtcclxuXHRcdFx0dmFyIF9NYWluPXRoaXMuX21haW5WaWV3LmdldENoaWxkKFwiX01haW5cIikuYXNDb207XHJcblx0XHRcdHZhciBfZDM9X01haW4uZ2V0Q2hpbGQoXCJkM1wiKS5hc0NvbTtcclxuXHRcdFx0aWYodGhpcy5zY2VuZTNEIT1udWxsKXtcclxuXHRcdFx0XHRfZDMuZGlzcGxheU9iamVjdC5hZGRDaGlsZCh0aGlzLnNjZW5lM0QpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlUYXJ7XHJcbiAgICBwcml2YXRlIF9lbmdpbmU6IFRBUi5FbmdpbmU7XHJcbiAgICBwcml2YXRlIF9hcjogVEFSLkFSO1xyXG4gICAgcHJpdmF0ZSBfcmVuZGVyOiBUQVIuUmVuZGVyO1xyXG4gICAgc3RhdGljIF90aGlzOldteVRhcjtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKXtcclxuICAgICAgICBpZihXbXlUYXIuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlUYXIuX3RoaXM9bmV3IFdteVRhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215VGFyLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIF9MYXlhRW5naW5lOmFueTtcclxuICAgIF90ZXh0dXJlOmFueTtcclxuICAgIHB1YmxpYyBpbml0KCl7XHJcblx0XHR0aGlzLl9yZW5kZXIgPSBuZXcgVEFSLlJlbmRlcigpO1xyXG5cdFx0dGhpcy5fYXIgPSBuZXcgVEFSLkFSKCk7XHJcbiAgICAgICAgdGhpcy5fZW5naW5lID0gbmV3IFRBUi5FbmdpbmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fTGF5YUVuZ2luZT13aW5kb3dbXCJMYXlhRW5naW5lXCJdO1xyXG4gICAgICAgIGlmKHRoaXMuX0xheWFFbmdpbmUhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlPXRoaXMuX0xheWFFbmdpbmVbXCJ0ZXh0dXJlXCJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyAvKipcclxuICAgICAgICAvLyAgKiBBbmRyb2lk6YCa6L+H5Li75b6q546v55uR5o6n5bmz6Z2i5Z2Q5qCH55qE5Y+Y5YyW77yM6ZyA6KaB5Li75Yqo6LCD55Sob25UYXJTdGF0ZUNoYW5nZWTljrvmlLnlj5jnirbmgIFcclxuICAgICAgICAvLyAgKiBpT1Plt7Lnu4/lsIbkuovku7bnm5HlkKzlhpnlnKjkuoZ0YXIuanPph4zpnaLvvIznirbmgIHoh6rliqjliIfmjaJcclxuICAgICAgICAvLyAgKi9cclxuICAgICAgICAvLyBpZiAoVEFSLkVOVi5BTkRST0lEKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuX3JlbmRlci5vbignVEFSX1NUQVRFX0NIQU5HRScsICgpID0+IHtcclxuICAgICAgICAvLyAgICAgICAgIGNvbnN0IHZyRGlzcGxheSA9IHRoaXMuX2FyLmdldFZSRGlzcGxheSgpO1xyXG4gICAgICAgIC8vICAgICAgICAgaWYgKHZyRGlzcGxheSAmJiB0aGlzLl9hci5pc0VuZ2luZURvd25sb2FkKCkpIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICBjb25zdCBmcmFtZURhdGEgPSBuZXcgd2luZG93W1wiVlJGcmFtZURhdGFcIl0oKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICB2ckRpc3BsYXkuZ2V0RnJhbWVEYXRhKGZyYW1lRGF0YSk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uc3QgW3gsIHksIHpdID0gZnJhbWVEYXRhLnBvc2UucG9zaXRpb247XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgaWYgKHggPT09IDAgJiYgIHkgPT09IDAgJiYgeiA9PT0gMCkge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLl9hci5vblRhclN0YXRlQ2hhbmdlZCgnbGltaXRlZCcpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuX2FyLm9uVGFyU3RhdGVDaGFuZ2VkKCdub3JtYWwnKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gLy8gdHJpZ2dlciBjYW1lcmEgcG9zaXRpb24gY2hhbmdlIGV2ZXJ5IGZyYW1lXHJcbiAgICAgICAgLy8gdGhpcy5fcmVuZGVyLm9uKCdDQU1FUkFfVFJBTlNGT1JNX0NIQU5HRScsICgpID0+IHtcclxuICAgICAgICAvLyAgICAgY29uc3QgdnJEaXNwbGF5ID0gIHRoaXMuX2FyLmdldFZSRGlzcGxheSgpO1xyXG4gICAgICAgIC8vICAgICAvLyDpnIDopoHojrflj5bliLB2ckRpc3BsYXnlr7nosaHlubbkuJRhcuW8leaTjuS4i+WujOaIkOaJjeiDveWBmuS4muWKoemAu+i+kVxyXG4gICAgICAgIC8vICAgICBpZiAodnJEaXNwbGF5ICYmICB0aGlzLl9hci5pc0VuZ2luZURvd25sb2FkKCkpIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuX2VuZ2luZS5vbkNhbWVyYVRyYW5zZm9ybUNoYW5nZSgpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG5cclxuXHRcdC8vIHJlbmRlcuWIneWni+WMlu+8jOi/kOihjOS4u+W+queOr1xyXG5cdFx0dGhpcy5fcmVuZGVyLmluaXQoKTtcclxuXHRcdGlmIChUQVIuRU5WLklPUykge1xyXG5cdFx0XHR0aGlzLkFSSW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChUQVIuRU5WLkFORFJPSUQpIHtcclxuICAgICAgICAgICAgLy8gYW5kcm9pZCBBUueahOiDveWKm+mcgOimgeS4i+i9veaJjeaciVxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU1RBVFVTX0NIQU5HReaWueazleazqOWGjDTkuKrkuI7lvJXmk47nirbmgIHnm7jlhbPnmoRjYWxsYmFja+WHveaVsHN0YXJ0LCBsb2FkaW5nLCBzdWNjZXNzLCBmYWlsXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBUQVIuVEFSVXRpbHMuU1RBVFVTX0NIQU5HRShcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsb3NlIG5hdGl2ZSBwcm9ncmVzcyBhZnRlciBkb3dubG9hZCBuYXRpdmUgYXIgZW5naW5lXHJcbiAgICAgICAgICAgICAgICAgICAgLy9OQVRJVkVfUlJPR1JFU1NfQ0xPU0UoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0luaXQgQVIgZmFpbC4gUGxhdGZvcm0gYW5kcm9pZC4gZG93bmxvYWQgZW5naW5lIGVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIC8vIHZyIGRpc3BsYXkg5b+F6aG76aaW5YWI5Yqg6L2977yMYW5kcm9pZOWcqHg15YaF5qC46YeM5bey57uP5pyJ77yMaW9z6ZyA6KaB5byV55SoV2ViQVJvbkFSa2l0XHJcbiAgICAgICAgICAgIC8vIGFuZHJvaWQgQVLnmoTog73lipvpnIDopoHkuIvovb3miY3mnInvvIzkvYbmmK/mkYTlg4/lpLTog73lipvkuI3pnIDopoHkuIvovb3lvJXmk47vvIzmiYDku6VyZW5kZXLlj6/ku6Xmj5DliY3ov5vooYzvvJtpb3PmnKzouqvlsLHmnInlkITnp43og73lipvvvIxzbGFt44CBbWFya2VybGVzc+ayv+eUqGFya2l055qE77yMbWFya2VyIGJhc2XmmK/mrabmsYnoh6rnoJTnmoTvvIzlhbbkuK3nmoRhZGRNYXJrZXLpnIDopoHnu4jnq6/mt7vliqDnmoRcclxuICAgICAgICAgICAgVEFSLkFSLmluaXRBUkVuZ2luZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogMlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hci5zZXRFbmdpbmVEb3dubG9hZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0luaXQgQVIgc3VjY2Vzcy4gUGxhdGZvcm0gYW5kcm9pZC4gQVIgRW5naW5lIGRvd25sb2FkIHN1Y2Nlc3MsIHlvdSBjYW4gdXNlIGFiaWxpdHkgb2YgdGFyICdcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW5pdCBBUiBmYWlsLiBQbGF0Zm9ybSBhbmRyb2lkLiBpbml0IGZhaWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5BUkluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQVJJbml0KCkge1xyXG4gICAgICAgIHRoaXMuX2FyLmxvYWQoKS50aGVuKChkaXNwbGF5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlci5zZXRWUkRpc3BsYXkoZGlzcGxheSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZS5jcmVhdGUoJ0xheWEnKTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIGFy5byV5pOO5Yqg6L2977yMbG9hZOWHveaVsOaciTPkuKrlj4LmlbDvvIzlkI7kuKTkuKrkuLrlm57osIPlh73mlbBvblN0YXJ0Q2FsbGJhY2vlkoxvbkNvbXBsZXRlQ2FsbGJhY2tcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZS5sb2FkKGRpc3BsYXksIG51bGwsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIHRhc2sgPSBuZXcgVGFzayhhciwgcmVuZGVyLCBlbmdpbmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1biA9IChwcmVTdGF0ZSwgbmV4dFN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFzay5ydW4ocHJlU3RhdGUsIG5leHRTdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIChhci5nZXRDdXJyZW50U3RhdGUoKSA9PT0gJ25vcm1hbCcpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBydW4oKTtcclxuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICogIOWwhnJ1biBjYWxsYmFja+azqOWGjOWIsGFy55qE54q25oCB6L2s56e75Ye95pWw5Lit77yMXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICogIOW9k+iwg+eUqGFyLm9uVGFyU3RhdGVDaGFuZ2VkKCdub3JtYWwnKeaIluiAhSBhci5vblRhclN0YXRlQ2hhbmdlZCgnbGltaXRlZCcpIO+8jCBydW7kvJrop6blj5HvvIxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgKiAg5omA5LulcnVu5Ye95pWw6KaB5YGa5LiN5ZCM54q25oCB6Ze06L2s5o2i5aSE55CGXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICovXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgYXIuc2V0Tm90QXZhaWxhYmxlMk5vcm1hbEZ1bmMocnVuKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICBhci5zZXRMaW1pdGVkMk5vcm1hbEZ1bmMocnVuKTtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYGV4Y2VwdGlvbiA9ICR7ZX1gKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIlxyXG5leHBvcnQgY2xhc3MgV215VXRpbHMgZXh0ZW5kcyBsYXlhLmV2ZW50cy5FdmVudERpc3BhdGNoZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM6V215VXRpbHM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215VXRpbHN7XHJcbiAgICAgICAgaWYoV215VXRpbHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlVdGlscy5fdGhpcz1uZXcgV215VXRpbHMoKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215VXRpbHMuX3RoaXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvLyBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5fX2xvb3ApO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfRE9XTix0aGlzLCB0aGlzLl9fb25Ub3VjaERvd24pO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24obGF5YS5ldmVudHMuRXZlbnQuTU9VU0VfVVAsdGhpcywgdGhpcy5fX29uVG91Y2hVcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5fX09uTW91c2VNT1ZFKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuUkVTSVpFLHRoaXMsdGhpcy5fX29uUmVzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgQ09MT1JfRklMVEVSU19NQVRSSVg6IEFycmF5PGFueT49W1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vUlxyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vR1xyXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIC8vQlxyXG4gICAgICAgIDAsIDAsIDAsIDEsIDAsIC8vQVxyXG4gICAgXTtcclxuICAgIC8v6L2s5o2i6aKc6ImyXHJcbiAgICBwdWJsaWMgY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocjpudW1iZXIsZzpudW1iZXIsYjpudW1iZXIsYT86bnVtYmVyKTpBcnJheTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMF09cjtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFs2XT1nO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzEyXT1iO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzE4XT1hfHwxO1xyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWDtcclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnModGFyZ2V0OkxheWEuU3ByaXRlLGNvbG9yOm51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKGNvbG9yICE9IDB4ZmZmZmZmKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgoXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj4xNikgJiAweGZmKS8yNTUsXHJcbiAgICAgICAgICAgICAgICAoKGNvbG9yPj44KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgIChjb2xvciAmIDB4ZmYpLzI1NVxyXG4gICAgICAgICAgICAgICAgKSldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8v5a+55a+56LGh5pS55Y+Y6aKc6ImyXHJcbiAgICBwdWJsaWMgYXBwbHlDb2xvckZpbHRlcnMxKHRhcmdldDpMYXlhLlNwcml0ZSxyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGFyZ2V0LmZpbHRlcnM9bnVsbDtcclxuICAgICAgICBpZihyIDwgMSB8fCBnIDwgMSB8fCBiIDwgMSB8fCBhIDwgMSl7XHJcbiAgICAgICAgICAgIHRhcmdldC5maWx0ZXJzPVtuZXcgTGF5YS5Db2xvckZpbHRlcih0aGlzLmNvbnZlcnRDb2xvclRvQ29sb3JGaWx0ZXJzTWF0cml4KHIsZyxiLGEpKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5Yik5pat5omL5py65oiWUENcclxuICAgIHB1YmxpYyBpc1BjKCk6Ym9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHZhciBpc1BjOmJvb2xlYW49ZmFsc2U7XHJcbiAgICAgICAgaWYodGhpcy52ZXJzaW9ucygpLmFuZHJvaWQgfHwgdGhpcy52ZXJzaW9ucygpLmlQaG9uZSB8fCB0aGlzLnZlcnNpb25zKCkuaW9zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXNQYz1mYWxzZTtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLnZlcnNpb25zKCkuaVBhZCl7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpc1BjPXRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzUGM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmVyc2lvbnMoKXtcclxuICAgICAgICB2YXIgdTpzdHJpbmcgPSBuYXZpZ2F0b3IudXNlckFnZW50LCBhcHA6c3RyaW5nID0gbmF2aWdhdG9yLmFwcFZlcnNpb247XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLy/np7vliqjnu4jnq6/mtY/op4jlmajniYjmnKzkv6Hmga9cclxuICAgICAgICAgICAgdHJpZGVudDogdS5pbmRleE9mKCdUcmlkZW50JykgPiAtMSwgLy9JReWGheaguFxyXG4gICAgICAgICAgICBwcmVzdG86IHUuaW5kZXhPZignUHJlc3RvJykgPiAtMSwgLy9vcGVyYeWGheaguFxyXG4gICAgICAgICAgICB3ZWJLaXQ6IHUuaW5kZXhPZignQXBwbGVXZWJLaXQnKSA+IC0xLCAvL+iLueaenOOAgeiwt+atjOWGheaguFxyXG4gICAgICAgICAgICBnZWNrbzogdS5pbmRleE9mKCdHZWNrbycpID4gLTEgJiYgdS5pbmRleE9mKCdLSFRNTCcpID09IC0xLCAvL+eBq+eLkOWGheaguFxyXG4gICAgICAgICAgICBtb2JpbGU6ICEhdS5tYXRjaCgvQXBwbGVXZWJLaXQuKk1vYmlsZS4qLyl8fCEhdS5tYXRjaCgvQXBwbGVXZWJLaXQvKSwgLy/mmK/lkKbkuLrnp7vliqjnu4jnq69cclxuICAgICAgICAgICAgaW9zOiAhIXUubWF0Y2goL1xcKGlbXjtdKzsoIFU7KT8gQ1BVLitNYWMgT1MgWC8pLCAvL2lvc+e7iOerr1xyXG4gICAgICAgICAgICBhbmRyb2lkOiB1LmluZGV4T2YoJ0FuZHJvaWQnKSA+IC0xIHx8IHUuaW5kZXhPZignTGludXgnKSA+IC0xLCAvL2FuZHJvaWTnu4jnq6/miJbogIV1Y+a1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGhvbmU6IHUuaW5kZXhPZignaVBob25lJykgPiAtMSB8fCB1LmluZGV4T2YoJ01hYycpID4gLTEsIC8v5piv5ZCm5Li6aVBob25l5oiW6ICFUVFIROa1j+iniOWZqFxyXG4gICAgICAgICAgICBpUGFkOiB1LmluZGV4T2YoJ2lQYWQnKSA+IC0xLCAvL+aYr+WQpmlQYWRcclxuICAgICAgICAgICAgd2ViQXBwOiB1LmluZGV4T2YoJ1NhZmFyaScpID09IC0xIC8v5piv5ZCmd2Vi5bqU6K+l56iL5bqP77yM5rKh5pyJ5aS06YOo5LiO5bqV6YOoXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VXJsVihrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgcmVnPSBuZXcgUmVnRXhwKFwiKF58JilcIitrZXkrXCI9KFteJl0qKSgmfCQpXCIpO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5tYXRjaChyZWcpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ/ZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdFsyXSk6bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25OYXZpZ2F0ZSh1cmw6c3RyaW5nLGlzUmVwbGFjZTpib29sZWFuPWZhbHNlKXtcclxuICAgICAgICBpZihpc1JlcGxhY2Upe1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh1cmwpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPXVybDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZXZlbnRMaXN0OkFycmF5PGxheWEuZXZlbnRzLkV2ZW50Pj1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaERvd24oZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50TGlzdC5pbmRleE9mKGV2dCk8MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5wdXNoKGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uVG91Y2hVcChldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KT49MCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdC5zcGxpY2UodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfX29uUmVzaXplKCl7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0LmZvckVhY2goZXZ0ID0+IHtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcblx0XHR9KTtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3Q9bmV3IEFycmF5PGxheWEuZXZlbnRzLkV2ZW50PigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9fT25Nb3VzZU1PVkUoZXZ0OiBsYXlhLmV2ZW50cy5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHZhciBiTnVtPTEwO1xyXG4gICAgICAgIGlmKGV2dC5zdGFnZVggPD0gYk51bSB8fCBldnQuc3RhZ2VYID49IExheWEuc3RhZ2Uud2lkdGgtYk51bSB8fFxyXG4gICAgICAgICAgICBldnQuc3RhZ2VZIDw9IGJOdW0gfHwgZXZ0LnN0YWdlWSA+PSBMYXlhLnN0YWdlLmhlaWdodC1iTnVtKXtcclxuICAgICAgICAgICAgZXZ0LnR5cGU9TGF5YS5FdmVudC5NT1VTRV9VUDtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5ldmVudChMYXlhLkV2ZW50Lk1PVVNFX1VQLGV2dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4sbD0yKXtcclxuXHRcdGlmKChuK1wiXCIpLmluZGV4T2YoXCIuXCIpPj0wKXtcclxuXHRcdCAgICBuPXBhcnNlRmxvYXQobi50b0ZpeGVkKGwpKTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gbjtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSX1hZKGQsIHIpXHJcbiAgICB7XHJcbiAgICBcdHZhciByYWRpYW4gPSAociAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgXHR2YXIgY29zID0gIE1hdGguY29zKHJhZGlhbik7XHJcbiAgICBcdHZhciBzaW4gPSAgTWF0aC5zaW4ocmFkaWFuKTtcclxuICAgIFx0XHJcbiAgICBcdHZhciBkeD1kICogY29zO1xyXG4gICAgXHR2YXIgZHk9ZCAqIHNpbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBMYXlhLlBvaW50KGR4ICwgZHkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICBwdWJsaWMgc3RhdGljIHN0cmluZzJidWZmZXIoc3RyKTpBcnJheUJ1ZmZlciB7XHJcbiAgICAgICAgLy8g6aaW5YWI5bCG5a2X56ym5Liy6L2s5Li6MTbov5vliLZcclxuICAgICAgICBsZXQgdmFsID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgdmFsID0gc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFsICs9ICcsJyArIHN0ci5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5bCGMTbov5vliLbovazljJbkuLpBcnJheUJ1ZmZlclxyXG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSh2YWwubWF0Y2goL1tcXGRhLWZdezJ9L2dpKS5tYXAoZnVuY3Rpb24gKGgpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoaCwgMTYpXHJcbiAgICAgICAgfSkpLmJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlcGxhY2VBbGwoc3RyLCBvbGRTdHIsIG5ld1N0cil7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnOyAgXHJcbiAgICAgICAgdGVtcCA9IHN0ci5yZXBsYWNlKG9sZFN0ciwgbmV3U3RyKTtcclxuICAgICAgICBpZih0ZW1wLmluZGV4T2Yob2xkU3RyKT49MCl7XHJcbiAgICAgICAgICAgIHRlbXAgPSB0aGlzLnJlcGxhY2VBbGwodGVtcCwgb2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDsgIFxyXG4gICAgfSAgXHJcblxyXG4gICAgLy/lpKflsI/lhpnovazmjaJcclxuICAgIHB1YmxpYyBzdGF0aWMgdG9DYXNlKHN0cjpzdHJpbmcsIGlzRHg9ZmFsc2UpeyAgXHJcbiAgICAgICAgdmFyIHRlbXAgPSAnJztcclxuICAgICAgICBpZighaXNEeCl7XHJcbiAgICAgICAgICAgIC8v6L2s5o2i5Li65bCP5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIC8v6L2s5YyW5Li65aSn5YaZ5a2X5q+NXHJcbiAgICAgICAgICAgIHRlbXA9c3RyLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9IFxyXG5cclxuICAgIFxyXG4gICAgLy/ot53nprtcclxuXHRwdWJsaWMgc3RhdGljIGdldERpc3RhbmNlKGE6TGF5YS5Qb2ludCxiOkxheWEuUG9pbnQpOm51bWJlciB7XHJcblx0XHR2YXIgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xyXG5cdFx0dmFyIGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcclxuXHRcdHZhciBkPU1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpO1xyXG5cdFx0ZD1wYXJzZUZsb2F0KGQudG9GaXhlZCgyKSk7XHJcblx0XHRyZXR1cm4gZDtcclxuXHR9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRYeVRvUih5LHgpOm51bWJlcntcclxuICAgICAgICB2YXIgcmFkaWFuPU1hdGguYXRhbjIoeSx4KTtcclxuICAgICAgICB2YXIgcj0oMTgwL01hdGguUEkqcmFkaWFuKTtcclxuICAgICAgICByPXRoaXMub25OdW1UbyhyKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0b3JhZ2Uoa2V5LCB2YWx1ZTphbnk9XCI/XCIsIGlzTG9jYWw9dHJ1ZSk6YW55e1xyXG4gICAgICAgIHZhciBzdG9yYWdlOmFueT1pc0xvY2FsP2xvY2FsU3RvcmFnZTpzZXNzaW9uU3RvcmFnZTtcclxuICAgICAgICBpZih2YWx1ZT09XCI/XCIpe1xyXG5cdFx0XHR2YXIgZGF0YSA9IHN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYodmFsdWU9PW51bGwpe1xyXG5cdFx0XHRzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlGdWlTb3VuZChfdXJsLHZvbHVtZT0wLjIsY29tcGxldGVIYW5kbGVyPyxzdGFydFRpbWU9MCxsb29wcz0xKXtcclxuICAgICAgICBpZih2b2x1bWU8PTApcmV0dXJuO1xyXG4gICAgICAgIHZhciBpdGVtPWZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtQnlVUkwoX3VybCk7XHJcbiAgICAgICAgdmFyIHVybD1pdGVtLmZpbGU7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKHVybCxsb29wcyxjb21wbGV0ZUhhbmRsZXIsbnVsbCxzdGFydFRpbWUpO1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnNldFNvdW5kVm9sdW1lKHZvbHVtZSx1cmwpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgV215VXRpbHMgfSBmcm9tIFwiLi9XbXlVdGlsc1wiO1xyXG5pbXBvcnQgeyBXbXlMb2FkM2QgfSBmcm9tIFwiLi9kMy9XbXlMb2FkM2RcIjtcclxuaW1wb3J0IHsgV215TG9hZE1hdHMgfSBmcm9tIFwiLi9kMy9XbXlMb2FkTWF0c1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdteV9Mb2FkX01hZ1xyXG57XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlfTG9hZF9NYWd7XHJcbiAgICAgICAgaWYoV215X0xvYWRfTWFnLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215X0xvYWRfTWFnLl90aGlzPW5ldyBXbXlfTG9hZF9NYWcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteV9Mb2FkX01hZy5fdGhpcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3dldERhdGE6YW55PXt9O1xyXG5cclxuICAgIHB1YmxpYyByZXNVcmw6c3RyaW5nPVwiXCI7XHJcbiAgICBwdWJsaWMgZ2V0V2V0RGF0YSh1cmw6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2V0RGF0YVt1cmxdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc2V0V2V0RGF0YShvYmo6YW55LHVybD86c3RyaW5nKXtcclxuICAgICAgICBpZih0aGlzLnJlc1VybD09XCJcIil7XHJcbiAgICAgICAgICAgIHRoaXMucmVzVXJsPXVybDtcclxuICAgICAgICAgICAgdmFyIGFycj1udWxsO1xyXG4gICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZShvYmopO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodXJsPT1udWxsKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMucmVzVXJsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl93ZXREYXRhW3VybF09b2JqO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0UmVzT2JqKHJlc05hbWU6c3RyaW5nLHVybD8pe1xyXG4gICAgICAgIHZhciB3ZWJEYXRhOmFueTtcclxuICAgICAgICBpZih1cmw9PW51bGwpe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5yZXNVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdlYkRhdGE9dGhpcy5nZXRXZXREYXRhKHVybCk7XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhcnI9PW51bGwpe1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyPUpTT04ucGFyc2Uod2ViRGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIix3ZWJEYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXNPYmo9bnVsbDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1hcnJbaV07XHJcbiAgICAgICAgICAgIGlmKG9ialtcInJlc05hbWVcIl09PXJlc05hbWUpe1xyXG4gICAgICAgICAgICAgICAgcmVzT2JqPW9iajtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZFdldERhdGEodXJsOnN0cmluZyxjYWxsYmFja09rOkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgaWYodXJsPT1cIlwiKXJldHVybjtcclxuICAgICAgICBpZih0aGlzLmdldFdldERhdGEodXJsKSE9bnVsbCl7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5nZXRXZXREYXRhKHVybCldKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbG9hZD1MYXlhLmxvYWRlci5sb2FkKHVybCxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsZnVuY3Rpb24ob2JqKXtcclxuICAgICAgICAgICAgdGhpcy5zZXRXZXREYXRhKG9iaix1cmwpO1xyXG4gICAgICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW3RoaXMuX3dldERhdGFbdXJsXV0pO1xyXG4gICAgICAgIH0pKVxyXG4gICAgICAgIHJldHVybiBsb2FkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Jlc0RhdGFBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6QXJyYXk8YW55Pj1bXTtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6QXJyYXk8YW55Pj1bXTtcclxuICAgIHB1YmxpYyBvbmxvYWQocmVzT2JqOmFueSxjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciByZXNOYW1lPXJlc09ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgaWYodGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0ucnVuV2l0aChbdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZih0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzT2JqW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTphbnk9e307XHJcbiAgICAgICAgICAgIHZhciByZXNEYXRhOnN0cmluZz1yZXNPYmpbXCJyZXNEYXRhXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNEYXRhIT1udWxsICYmIHJlc0RhdGEhPVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhPUpTT04ucGFyc2UocmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZVVybDtcclxuICAgICAgICAgICAgdmFyIHVybEFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB2YXIgaXNDcmVhdGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzVXJsPVdteVV0aWxzLnRvQ2FzZShyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZih1cmwuaW5kZXhPZihcIi50eHRcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuQlVGRkVSfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYk5hbWVVcmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih1cmwuaW5kZXhPZihcIi5qcGdcIik+PTAgfHwgdXJsLmluZGV4T2YoXCIucG5nXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybCx0eXBlOkxheWEuTG9hZGVyLklNQUdFfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHVybC5pbmRleE9mKFwiLm1wM1wiKT49MCB8fCB1cmwuaW5kZXhPZihcIi53YXZcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuU09VTkR9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmxBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Bc3NldENvbm1wbGV0ZSxbcmVzTmFtZSxiTmFtZVVybCxkYXRhXSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQXNzZXRQcm9ncmVzcywgW3Jlc05hbWVdLCBmYWxzZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBvbmxvYWQzZChyZXNPYmo6YW55LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc05hbWU9cmVzT2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICBpZih0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXS5ydW5XaXRoKFt0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNPYmpbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciBkYXRhOmFueT17fTtcclxuICAgICAgICAgICAgdmFyIHJlc0RhdGE6c3RyaW5nPXJlc09ialtcInJlc0RhdGFcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc0RhdGEhPW51bGwgJiYgcmVzRGF0YSE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9SlNPTi5wYXJzZShyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIscmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lO1xyXG4gICAgICAgICAgICB2YXIgdXJsQXJyOkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmw9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBpZihyZXNVcmwuaW5kZXhPZihcIi5sc1wiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmx9KTtcclxuICAgICAgICAgICAgICAgICAgICB1cmxMaXN0LnB1c2godXJsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih1cmxBcnIubGVuZ3RoPD0wKXJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV09W107XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0ucHVzaChjYWxsYmFja09rKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YS51cmxMaXN0PXVybExpc3Q7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5nZXRUaGlzLm9ubG9hZDNkKHVybEFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkFzc2V0Q29ubXBsZXRlLFtyZXNOYW1lLGJOYW1lLGRhdGFdKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Bc3NldFByb2dyZXNzLCBbcmVzTmFtZV0sIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHRwcml2YXRlIG9uQXNzZXRQcm9ncmVzcyhyZXNOYW1lLHByb2dyZXNzKTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrUHJvZ3Jlc3NBcnI6QXJyYXk8TGF5YS5IYW5kbGVyPj10aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tQcm9ncmVzc0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYWxsYmFja1Byb2dyZXNzQXJyW2ldO1xyXG4gICAgICAgICAgICBjYWxsYmFjay5ydW5XaXRoKFtwcm9ncmVzc10pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcbiAgICBcclxuICAgIHByaXZhdGUgb25Bc3NldENvbm1wbGV0ZShyZXNOYW1lLGJOYW1lVXJsOnN0cmluZyxkYXRhKTp2b2lke1xyXG4gICAgICAgIHZhciBjYWxsYmFja09rQXJyOkFycmF5PExheWEuSGFuZGxlcj49dGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXTtcclxuICAgICAgICBpZihiTmFtZVVybCE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBiYW89TGF5YS5sb2FkZXIuZ2V0UmVzKGJOYW1lVXJsKTtcclxuICAgICAgICAgICAgdmFyIGJOYW1lID0gYk5hbWVVcmwucmVwbGFjZShcIi50eHRcIixcIlwiKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKGJOYW1lLGJhbyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJGVUkt5Ye66ZSZOlwiLGJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWVBcnI9Yk5hbWUuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICBkYXRhLmJOYW1lPWJOYW1lQXJyW2JOYW1lQXJyLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXT1kYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrT2tBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrT2sgPSBjYWxsYmFja09rQXJyW2ldO1xyXG4gICAgICAgICAgICBjYWxsYmFja09rLnJ1bldpdGgoW2RhdGFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1udWxsO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV09bnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZEluZm9BcnI6YW55O1xyXG4gICAgcHJpdmF0ZSBfYXV0b0xvYWRyQ2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkQWxsKGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHdlYkRhdGE6YW55PXRoaXMuZ2V0V2V0RGF0YSh0aGlzLnJlc1VybCk7XHJcbiAgICAgICAgaWYod2ViRGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuepuuaVsOaNrlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnI6QXJyYXk8YW55Pj1udWxsO1xyXG4gICAgICAgIGlmKHdlYkRhdGEgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIGFycj13ZWJEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihhcnI9PW51bGwpe1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyPUpTT04ucGFyc2Uod2ViRGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIix3ZWJEYXRhKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2s9Y2FsbGJhY2tPaztcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzPWNhbGxiYWNrUHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyPXt9O1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXT0wO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl09MDtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXT1bXTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl09W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9YXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzTmFtZT1vYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgICAgICB2YXIgdD1vYmpbXCJ0eXBlXCJdO1xyXG4gICAgICAgICAgICBpZihyZXNOYW1lPT1udWxsIHx8IHJlc05hbWU9PVwiXCIgfHwgdD09bnVsbCB8fCB0PT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uQXV0b0xvYWRPYmoodCxyZXNOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkF1dG9Mb2FkT2JqKHR5cGU6c3RyaW5nLHJlc05hbWUpe1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgcmVzSWQ9dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF09e307XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcIm5cIl09cmVzTmFtZTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1widFwiXT10eXBlO1xyXG4gICAgICAgIHZhciBsb2FkT2s9ZmFsc2U7XHJcbiAgICAgICAgaWYodHlwZT09XCJ1aVwiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidWkt5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGU9PVwidTNkXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQzZChyZXMsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKz0xO1xyXG4gICAgICAgICAgICBpZighbG9hZE9rKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInUzZC3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJtYXRzXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICB2YXIgdXJsTGlzdDpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgcmVzVXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgocmVzVXJsKTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIHVybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybExpc3QubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgV215TG9hZE1hdHMuZ2V0VGhpcy5vbmxvYWQzZCh1cmxMaXN0LG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgICAgICBsb2FkT2s9dHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibWF0cy3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJjdWJlTWFwXCIpe1xyXG4gICAgICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPFJlc3Jlcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJhdWRpb1wiKXtcclxuICAgICAgICAgICAgbG9hZE9rPXRoaXMub25sb2FkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYXVkaW8t5Ye66ZSZOlwiLHJlc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCxudWxsLChfcmVzSWQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRPayhfcmVzSWQpO1xyXG4gICAgICAgICAgICAgICAgfSxbcmVzSWRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3ViZShyZXNOYW1lLCBjb21wbGV0ZTogTGF5YS5IYW5kbGVyKTpBcnJheTxMYXlhLlRleHR1cmVDdWJlPntcclxuICAgICAgICB2YXIgcmVzPXRoaXMuZ2V0UmVzT2JqKHJlc05hbWUpO1xyXG4gICAgICAgIGlmKHJlcz09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc1tcIlJlc3Jlc1wiXTtcclxuICAgICAgICB2YXIgUmVzcmVzT2JqOkFycmF5PExheWEuVGV4dHVyZUN1YmU+PVtdO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgdmFyIHJlc1VybDpzdHJpbmc9b2JqW1wicmVzVXJsXCJdO1xyXG4gICAgICAgICAgICByZXNVcmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChyZXNVcmwpO1xyXG4gICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgTGF5YS5UZXh0dXJlQ3ViZS5sb2FkKHVybCxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsY3ViZT0+e1xyXG4gICAgICAgICAgICAgICAgUmVzcmVzT2JqW2ldPWN1YmU7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZS5ydW5XaXRoKFtjdWJlLGldKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUmVzcmVzT2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Mb2FkaW5nKHJlc0lkLCBwcm9ncmVzczpudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1wicFwiXT1wcm9ncmVzcztcclxuICAgICAgICB2YXIgbnVtPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXTtcclxuICAgICAgICB2YXIgcE51bT0wO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bnVtO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBwPXRoaXMuX2F1dG9Mb2FkSW5mb0FycltpXVtcInBcIl07XHJcbiAgICAgICAgICAgIGlmKHAhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgcE51bSs9cDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB2YXIgcEM9KHBOdW0vdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKSoxMDA7XHJcbiAgICAgICAgaWYoaXNOYU4ocEMpKXBDPTA7XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcENdKTtcclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uTG9hZE9rKHJlc0lkLGRhdGE/KXtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJjTnVtXCJdKz0xO1xyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInVpXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPT1cInUzZFwiKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1widTNkQXJyXCJdLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl0+PXRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1aUFyclwiXSx0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJleHBvcnQgY2xhc3MgV215TG9hZDNke1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZDNke1xyXG4gICAgICAgIGlmKFdteUxvYWQzZC5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWQzZC5fdGhpcz1uZXcgV215TG9hZDNkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlMb2FkM2QuX3RoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXJsTGlzdDpBcnJheTxzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbmxvYWQzZCh1cmxMaXN0OkFycmF5PHN0cmluZz4sY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgX3VybExpc3Q9W107XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHVybExpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciB1cmw9dXJsTGlzdFtpXTtcclxuICAgICAgICAgICAgdXJsPUxheWEuUmVzb3VyY2VWZXJzaW9uLmFkZFZlcnNpb25QcmVmaXgodXJsKTtcclxuICAgICAgICAgICAgX3VybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICAvLyBvYmpbXCJ1cmxcIl0rPVwiP3dteVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcG51bT0wO1xyXG4gICAgICAgIHZhciBwTnVtPTA7XHJcbiAgICAgICAgdmFyIGlzUD1mYWxzZTtcclxuICAgICAgICB2YXIgX1Byb2dyZXNzPShwKT0+e1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwKTtcclxuICAgICAgICAgICAgcG51bSs9MC4wMTtcclxuICAgICAgICAgICAgLy8gaWYoaXNQKXtcclxuICAgICAgICAgICAgLy8gICAgIHBOdW0gPSBwbnVtKyhwKSowLjk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZXtcclxuICAgICAgICAgICAgLy8gICAgIHBOdW0gPSBwbnVtO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGlmKHBudW0+PTAuMSB8fCBwPT0xKXtcclxuICAgICAgICAgICAgLy8gICAgIGlzUD10cnVlO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmKHBudW0+MSlwbnVtPTE7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwbnVtXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9vbk9rPSgpPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUoX3VybExpc3QsbmV3IExheWEuSGFuZGxlcihudWxsLF9vbk9rKSxMYXlhLkhhbmRsZXIuY3JlYXRlKG51bGwsX1Byb2dyZXNzLG51bGwsZmFsc2UpKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHByaXZhdGUgX21BcnI6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgIHByaXZhdGUgX21OdW09MDtcclxuICAgIHByaXZhdGUgX21QPTA7XHJcbiAgICBwcml2YXRlIF9tUDI9MDtcclxuXHJcbiAgICBwcml2YXRlIF9fb25sc1VybEFyck9rKGxzVXJsQXJyOkFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bHNVcmxBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9bHNVcmxBcnJbaV07XHJcbiAgICAgICAgICAgIHZhciB1cmw9b2JqW1widXJsXCJdO1xyXG4gICAgICAgICAgICB2YXIgczA9dXJsLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgdmFyIHMxPXVybC5yZXBsYWNlKHMwW3MwLmxlbmd0aC0xXSxcIlwiKTtcclxuICAgICAgICAgICAgdmFyIHJvb3RVcmw9czE7XHJcbiAgICAgICAgICAgIHZhciB0eHQ9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcbiAgICAgICAgICAgIHZhciBqc09iaj1KU09OLnBhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9fdGlRdVVybChqc09ialtcImRhdGFcIl0scm9vdFVybCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21BcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25BcnJPayksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkFyclApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uQXJyUChwKXtcclxuICAgICAgICB2YXIgcE51bT1wKih0aGlzLl9tTnVtKzEpO1xyXG4gICAgICAgIGlmKHBOdW0+dGhpcy5fbVApdGhpcy5fbVA9cE51bTtcclxuICAgICAgICB0aGlzLl9tUDI9KHRoaXMuX21QL3RoaXMuX21BcnIubGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcE51bT0odGhpcy5fbVAyKSowLjk4O1xyXG4gICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MhPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BOdW1dKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25BcnJPaygpe1xyXG4gICAgICAgIHRoaXMuX21OdW0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fbU51bT49dGhpcy5fbUFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodGhpcy5fdXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrT2sucnVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX3RpUXVVcmwob2JqLHVybDpzdHJpbmc9XCJcIil7XHJcbiAgICAgICAgaWYob2JqW1wicHJvcHNcIl0hPW51bGwgJiYgb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciBtZXNoUGF0aD11cmwrb2JqW1wicHJvcHNcIl1bXCJtZXNoUGF0aFwiXTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKG1lc2hQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChtZXNoUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG1hdGVyaWFsczpBcnJheTxhbnk+PW9ialtcInByb3BzXCJdW1wibWF0ZXJpYWxzXCJdO1xyXG4gICAgICAgICAgICBpZihtYXRlcmlhbHMhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpaT0wO2lpPG1hdGVyaWFscy5sZW5ndGg7aWkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGg9dXJsK21hdGVyaWFsc1tpaV1bXCJwYXRoXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbXCJjb21wb25lbnRzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGNvbXBvbmVudHM6QXJyYXk8YW55Pj1vYmpbXCJjb21wb25lbnRzXCJdO1xyXG4gICAgICAgICAgICBpZihjb21wb25lbnRzLmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkwID0gMDsgaTAgPCBjb21wb25lbnRzLmxlbmd0aDsgaTArKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wID0gY29tcG9uZW50c1tpMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImF2YXRhclwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcGF0aD11cmwrY29tcFtcImF2YXRhclwiXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX21BcnIuaW5kZXhPZihhcGF0aCk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goYXBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbXBbXCJsYXllcnNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXJzOkFycmF5PGFueT49Y29tcFtcImxheWVyc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IGxheWVycy5sZW5ndGg7IGkxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllciA9IGxheWVyc1tpMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVzOkFycmF5PGFueT49bGF5ZXJbXCJzdGF0ZXNcIl1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBzdGF0ZXMubGVuZ3RoOyBpMisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW2kyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xpcFBhdGg9dXJsK3N0YXRlW1wiY2xpcFBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGNsaXBQYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKGNsaXBQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNoaWxkOkFycmF5PGFueT49b2JqW1wiY2hpbGRcIl07XHJcbiAgICAgICAgaWYoY2hpbGQhPW51bGwgJiYgY2hpbGQubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGNoaWxkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX3RpUXVVcmwoY2hpbGRbaV0sdXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiZXhwb3J0IGNsYXNzIFdteUxvYWRNYXRze1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3RoaXM7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBnZXRUaGlzKCk6V215TG9hZE1hdHN7XHJcbiAgICAgICAgaWYoV215TG9hZE1hdHMuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlMb2FkTWF0cy5fdGhpcz1uZXcgV215TG9hZE1hdHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWRNYXRzLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NhbGxiYWNrT2s6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25sb2FkM2QodXJsTGlzdDpBcnJheTxzdHJpbmc+LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybExpc3QsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vblVybEFyck9rLFt1cmxMaXN0XSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tYXRzVXJsQXJyOkFycmF5PHN0cmluZz49W107XHJcbiAgICBwcml2YXRlIF9tYXRPaz1mYWxzZTtcclxuICAgIHByaXZhdGUgX21hdE51bT0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UD0wO1xyXG4gICAgcHJpdmF0ZSBfbWF0UDI9MDtcclxuXHJcbiAgICBwcml2YXRlIF9fb25VcmxBcnJPayh1cmxMaXN0OkFycmF5PHN0cmluZz4pe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybD11cmxMaXN0W2ldO1xyXG4gICAgICAgICAgICAvLyB2YXIgdHh0PUxheWEubG9hZGVyLmdldFJlcyh1cmwpO1xyXG4gICAgICAgICAgICAvLyB2YXIganNPYmo9SlNPTi5wYXJzZSh0eHQpO1xyXG4gICAgICAgICAgICB2YXIganNPYmo9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXJyPXVybC5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIHZhciBtYXRzVXJsPXVybC5yZXBsYWNlKGFyclthcnIubGVuZ3RoLTFdLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXk6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGFycmF5PWpzT2JqW1wibWF0c1wiXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgICAgICBpZihvYmpbXCJ0YXJnZXROYW1lXCJdPT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hdFVybD1tYXRzVXJsK29ialtcIm1hdFVybFwiXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hdHNVcmxBcnIucHVzaChtYXRVcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuX21hdHNVcmxBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLl9tYXRzVXJsQXJyW2ldO1xyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLl9fb25NYXRBcnJPayksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyclApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyUChwKXtcclxuICAgICAgICB2YXIgcE51bT1wKih0aGlzLl9tYXROdW0rMSk7XHJcbiAgICAgICAgaWYocE51bT50aGlzLl9tYXRQKXRoaXMuX21hdFA9cE51bTtcclxuICAgICAgICB0aGlzLl9tYXRQMj0odGhpcy5fbWF0UC90aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbdGhpcy5fbWF0UDJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfX29uTWF0QXJyT2soKXtcclxuICAgICAgICB0aGlzLl9tYXROdW0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fbWF0TnVtPj10aGlzLl9tYXRzVXJsQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2shPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59IiwiXHJcbmV4cG9ydCBjbGFzcyBXbXlTaGFkZXJNc2d7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbVx0dGFyZ2V0XHTlr7nosaFcclxuICAgICAqIEBwYXJhbVx0bWF0XHTmnZDotKhcclxuICAgICAqIEBwYXJhbVx0c2hhZGVyVXJsXHRzaGFkZXLnmoTlnLDlnYBcclxuICAgICAqIEBwYXJhbVx0aXNOZXdNYXRlcmlhXHTmmK/lkKbmlrDmnZDotKhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXRTaGFkZXIodGFyZ2V0LCBtYXQ6TGF5YS5CYXNlTWF0ZXJpYWwsIHNoYWRlclVybDpzdHJpbmcsIGlzTmV3TWF0ZXJpYT1mYWxzZSwgcERhdGE/OmFueSk6TGF5YS5CYXNlTWF0ZXJpYWx7XHJcbiAgICAgICAgdmFyIHJlbmRlcmVyOkxheWEuQmFzZVJlbmRlcjtcclxuICAgICAgICB2YXIgc2hhcmVkTWF0ZXJpYWw6IExheWEuQmFzZU1hdGVyaWFsO1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPSh0YXJnZXQgYXMgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKS5za2lubmVkTWVzaFJlbmRlcmVyO1xyXG4gICAgICAgICAgICBpZihyZW5kZXJlcj09bnVsbClyZXR1cm47XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXJlbmRlcmVyLnNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZW5kZXJlcj0odGFyZ2V0IGFzIExheWEuTWVzaFNwcml0ZTNEKS5tZXNoUmVuZGVyZXI7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyPT1udWxsKXJldHVybjtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9cmVuZGVyZXIuc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGlzTmV3TWF0ZXJpYSl7XHJcbiAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsPXNoYXJlZE1hdGVyaWFsLmNsb25lKCk7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLnNoYXJlZE1hdGVyaWFsPXNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIH1cclxuXHRcdGZvcih2YXIga2V5IGluIG1hdCl7XHJcblx0XHRcdHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbFtrZXldPW1hdFtrZXldO1xyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChzaGFkZXJVcmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuc2hhZGVyQ29ubXBsZXRlLFtzaGFyZWRNYXRlcmlhbCxwRGF0YV0pKTtcclxuICAgICAgICByZXR1cm4gc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2hhZGVyQ29ubXBsZXRlKHNoYXJlZE1hdGVyaWFsOkxheWEuQmFzZU1hdGVyaWFsLCBwRGF0YTphbnksIGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGE9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciB4bWw9bnVsbFxyXG4gICAgICAgIHRyeVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeG1sID0gTGF5YS5VdGlscy5wYXJzZVhNTEZyb21TdHJpbmcoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgeG1sTm9kZTpOb2RlID0geG1sLmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgICB2YXIgc2hhZGVyTmFtZT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZSh4bWxOb2RlLFwibmFtZVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGksbyxvTmFtZSx2MCx2MSxpbml0VjtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgYXR0cmlidXRlTWFwPXt9O1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVNYXBOb2RlPXRoaXMuZ2V0Tm9kZSh4bWxOb2RlLFwiYXR0cmlidXRlTWFwXCIpO1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVNYXBBcnI9dGhpcy5nZXROb2RlQXJyKGF0dHJpYnV0ZU1hcE5vZGUsXCJkYXRhXCIpO1xyXG4gICAgICAgIGZvcihpPTA7aTxhdHRyaWJ1dGVNYXBBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIG8gPSBhdHRyaWJ1dGVNYXBBcnJbaV07XHJcbiAgICAgICAgICAgIG9OYW1lPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJuYW1lXCIpO1xyXG4gICAgICAgICAgICB2MD10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwidjBcIik7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZU1hcFtvTmFtZV09dGhpcy5nZXRWKHYwLFwiaW50XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHVuaWZvcm1NYXA9e307XHJcbiAgICAgICAgdmFyIHVuaWZvcm1NYXBOb2RlPXRoaXMuZ2V0Tm9kZSh4bWxOb2RlLFwidW5pZm9ybU1hcFwiKTtcclxuICAgICAgICB2YXIgdW5pZm9ybU1hcEFycj10aGlzLmdldE5vZGVBcnIodW5pZm9ybU1hcE5vZGUsXCJkYXRhXCIpO1xyXG5cclxuICAgICAgICB2YXIgd215VmFsdWVzPXNoYXJlZE1hdGVyaWFsW1wid215VmFsdWVzXCJdO1xyXG4gICAgICAgIGlmKHdteVZhbHVlcyE9bnVsbCAmJiB3bXlWYWx1ZXNbXCJjdWJlXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGN1YmVOYW1lPXdteVZhbHVlc1tcImN1YmVcIl07XHJcbiAgICAgICAgICAgIGlmKHBEYXRhIT1udWxsICYmIHBEYXRhW1wiY3ViZUZ1blwiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBwRGF0YVtcImN1YmVGdW5cIl0oc2hhcmVkTWF0ZXJpYWwsY3ViZU5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihpPTA7aTx1bmlmb3JtTWFwQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBpbml0Vj1udWxsO1xyXG4gICAgICAgICAgICBvID0gdW5pZm9ybU1hcEFycltpXTtcclxuICAgICAgICAgICAgb05hbWU9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcIm5hbWVcIik7XHJcbiAgICAgICAgICAgIHYwPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJ2MFwiKTtcclxuICAgICAgICAgICAgdjE9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcInYxXCIpO1xyXG4gICAgICAgICAgICB2YXIgdkFycj1bXTtcclxuICAgICAgICAgICAgdkFyclswXT10aGlzLmdldFYodjAsXCJpbnRcIik7XHJcbiAgICAgICAgICAgIHZBcnJbMV09dGhpcy5nZXRWKHYxLFwiaW50XCIpO1xyXG4gICAgICAgICAgICB1bmlmb3JtTWFwW29OYW1lXT12QXJyO1xyXG5cclxuICAgICAgICAgICAgaWYod215VmFsdWVzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGluaXRWPXdteVZhbHVlc1tvTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vaW5pdFY9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcImluaXRWXCIpO1xyXG4gICAgICAgICAgICBpZihpbml0ViE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpbml0ViA9IGluaXRWLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGluaXRWLmxlbmd0aD09NCl7XHJcbiAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcih2QXJyWzBdLG5ldyBMYXlhLlZlY3RvcjQocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkscGFyc2VGbG9hdChpbml0VlsyXSkscGFyc2VGbG9hdChpbml0VlszXSkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0zKXtcclxuICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKHZBcnJbMF0sbmV3IExheWEuVmVjdG9yMyhwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSxwYXJzZUZsb2F0KGluaXRWWzJdKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTIpe1xyXG4gICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IodkFyclswXSxuZXcgTGF5YS5WZWN0b3IyKHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09MSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzTmFOKHBhcnNlRmxvYXQoaW5pdFZbMF0pKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0TnVtYmVyKHZBcnJbMF0scGFyc2VGbG9hdChpbml0VlswXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyT2JqPWluaXRWWzBdK1wiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0ck9iaj09XCJ0ZXhcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4OkxheWEuQmFzZVRleHR1cmU9c2hhcmVkTWF0ZXJpYWxbb05hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRUZXh0dXJlKHZBcnJbMF0sdGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNwcml0ZURlZmluZXM9TGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNELnNoYWRlckRlZmluZXM7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsRGVmaW5lcz1MYXlhLkJsaW5uUGhvbmdNYXRlcmlhbC5zaGFkZXJEZWZpbmVzO1xyXG4gICAgICAgIGlmKHBEYXRhIT1udWxsKXtcclxuICAgICAgICAgICAgaWYocERhdGFbXCJzcHJpdGVEZWZpbmVzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHNwcml0ZURlZmluZXM9cERhdGFbXCJzcHJpdGVEZWZpbmVzXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHBEYXRhW1wibWF0ZXJpYWxEZWZpbmVzXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsRGVmaW5lcz1wRGF0YVtcIm1hdGVyaWFsRGVmaW5lc1wiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNoYWRlcj1MYXlhLlNoYWRlcjNELmFkZChzaGFkZXJOYW1lLGF0dHJpYnV0ZU1hcCx1bmlmb3JtTWFwLHNwcml0ZURlZmluZXMsbWF0ZXJpYWxEZWZpbmVzKTtcclxuXHJcbiAgICAgICAgdmFyIFN1YlNoYWRlck5vZGU9dGhpcy5nZXROb2RlKHhtbE5vZGUsXCJTdWJTaGFkZXJcIik7XHJcblxyXG4gICAgICAgIHZhciByZW5kZXJNb2RlTm9kZT10aGlzLmdldE5vZGUoeG1sTm9kZSxcInJlbmRlck1vZGVcIik7XHJcbiAgICAgICAgaWYocmVuZGVyTW9kZU5vZGUhPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyTW9kZT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShyZW5kZXJNb2RlTm9kZSxcInZcIik7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlck1vZGUhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWxbXCJyZW5kZXJNb2RlXCJdPXRoaXMuZ2V0VihyZW5kZXJNb2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIFBhc3NBcnI9dGhpcy5nZXROb2RlQXJyKFN1YlNoYWRlck5vZGUsXCJQYXNzXCIpO1xyXG4gICAgICAgIGZvcihpPTA7aTxQYXNzQXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgcGFzcyA9IFBhc3NBcnJbaV07XHJcbiAgICAgICAgICAgIHZhciB2c05vZGU6Tm9kZT10aGlzLmdldE5vZGUocGFzcyxcIlZFUlRFWFwiKTtcclxuICAgICAgICAgICAgdmFyIHZzOnN0cmluZz12c05vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIHZzID0gdnMucmVwbGFjZSgvKFxccikvZyxcIlwiKTtcclxuICAgICAgICAgICAgdmFyIHBzTm9kZTpOb2RlPXRoaXMuZ2V0Tm9kZShwYXNzLFwiRlJBR01FTlRcIik7XHJcbiAgICAgICAgICAgIHZhciBwczpzdHJpbmc9cHNOb2RlLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICBwcyA9IHBzLnJlcGxhY2UoLyhcXHIpL2csXCJcIik7XHJcbiAgICAgICAgICAgIGlmKGk+MCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcnM6TGF5YS5SZW5kZXJTdGF0ZT0gc2hhcmVkTWF0ZXJpYWwuZ2V0UmVuZGVyU3RhdGUoMCkuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9yZW5kZXJTdGF0ZXMucHVzaChycyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBjdWxsTm9kZT10aGlzLmdldE5vZGUocGFzcyxcImN1bGxcIik7XHJcbiAgICAgICAgICAgIGlmKGN1bGxOb2RlIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHZhciBjdWxsPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKGN1bGxOb2RlLFwidlwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGN1bGwhPW51bGwgfHwgY3VsbCE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuZ2V0UmVuZGVyU3RhdGUoaSkuY3VsbD10aGlzLmdldFYoY3VsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNoYWRlci5hZGRTaGFkZXJQYXNzKHZzLHBzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXI9c2hhZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VihvYmo6YW55LGJhY2tUeXBlPVwibnVsbFwiKTphbnl7XHJcbiAgICAgICAgdmFyIHRlbXBOYW1lQXJyLHRlbXBPYmosdGVtcFYsaWk7XHJcbiAgICAgICAgdGVtcE5hbWVBcnI9b2JqLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICBpZih0ZW1wTmFtZUFyclswXT09PVwiTGF5YVwiKXtcclxuICAgICAgICAgICAgdGVtcFY9TGF5YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0ZW1wTmFtZUFyclswXT09PVwibGF5YVwiKXtcclxuICAgICAgICAgICAgdGVtcFY9bGF5YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGlpPTE7aWk8dGVtcE5hbWVBcnIubGVuZ3RoO2lpKyspe1xyXG4gICAgICAgICAgICB0ZW1wVj10ZW1wVlt0ZW1wTmFtZUFycltpaV1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0ZW1wViE9bnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wVjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihiYWNrVHlwZSE9XCJudWxsXCIpe1xyXG4gICAgICAgICAgICBpZihiYWNrVHlwZT09XCJpbnRcIil7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIGEgc3RyaW5nIGluIHRoZSBmb3JtYXQgXCIjcnJnZ2JiXCIgb3IgXCJycmdnYmJcIiB0byB0aGUgY29ycmVzcG9uZGluZ1xyXG4gICAgICogdWludCByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGNvbG9yIFRoZSBjb2xvciBpbiBzdHJpbmcgZm9ybWF0LlxyXG4gICAgICogQHJldHVybiBUaGUgY29sb3IgaW4gdWludCBmb3JtYXQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbG9yU3RyaW5nVG9VaW50KGNvbG9yOlN0cmluZyk6bnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKFwiMHhcIiArIGNvbG9yLnJlcGxhY2UoXCIjXCIsIFwiXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRBdHRyaWJ1dGVzVmFsdWUobm9kZTphbnksa2V5OnN0cmluZyl7XHJcbiAgICAgICAgdmFyIG5vZGVWYWx1ZT1udWxsO1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVzPW5vZGVbXCJhdHRyaWJ1dGVzXCJdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gYXR0cmlidXRlc1tpXTtcclxuICAgICAgICAgICAgaWYoZWxlbWVudC5uYW1lPT1rZXkpe1xyXG4gICAgICAgICAgICAgICAgbm9kZVZhbHVlPWVsZW1lbnRbXCJub2RlVmFsdWVcIl07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZVZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldE5vZGUoeG1sOmFueSxrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgY2hpbGROb2Rlcz14bWwuY2hpbGROb2RlcztcclxuICAgICAgICB2YXIgbm9kZTphbnk9bnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG9iajphbnk9Y2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYob2JqW1wibm9kZU5hbWVcIl09PWtleSl7XHJcbiAgICAgICAgICAgICAgICBub2RlPW9iajtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Tm9kZUFycih4bWw6YW55LGtleTpzdHJpbmcpOkFycmF5PE5vZGU+e1xyXG4gICAgICAgIHZhciBjaGlsZE5vZGVzPXhtbC5jaGlsZE5vZGVzO1xyXG4gICAgICAgIHZhciBub2RlQXJyOkFycmF5PE5vZGU+PVtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgb2JqOmFueT1jaGlsZE5vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZihvYmpbXCJub2RlTmFtZVwiXT09a2V5KXtcclxuICAgICAgICAgICAgICAgIG5vZGVBcnIucHVzaChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlQXJyO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFdteV9Mb2FkX01hZyB9IGZyb20gXCIuLi9XbXlfTG9hZF9NYWdcIjtcclxuaW1wb3J0IHsgV215U2hhZGVyTXNnIH0gZnJvbSBcIi4vV215U2hhZGVyTXNnXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215VXRpbHMzRHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqM2QodGFyZ2V0LG9iak5hbWU6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0Lm5hbWU9PW9iak5hbWUpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG86TGF5YS5TcHJpdGUzRCA9IHRhcmdldC5fY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChvLl9jaGlsZHJlbi5sZW5ndGggPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoby5uYW1lPT1vYmpOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBPYmo9dGhpcy5nZXRPYmozZChvLG9iak5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcE9iaiE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBPYmo7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2hpbGRyZW5Db21wb25lbnQodGFyZ2V0LGNsYXM6YW55LGFycj8pOkFycmF5PGFueT57XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbClhcnI9W107XHJcblxyXG4gICAgICAgIHZhciBvYmo9dGFyZ2V0LmdldENvbXBvbmVudChjbGFzKTtcclxuICAgICAgICBpZihvYmo9PW51bGwpe1xyXG4gICAgICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBjbGFzKXtcclxuICAgICAgICAgICAgICAgIG9iaj10YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqIT1udWxsKXtcclxuICAgICAgICAgICAgYXJyLnB1c2gob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZHJlbkNvbXBvbmVudChvLGNsYXMsYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFNoYWRlckFsbCh0YXJnZXQsbWF0c1VybDpzdHJpbmcsIHNoYWRlcnNVcmw6c3RyaW5nKXtcclxuICAgICAgICB2YXIgbmV3TWF0c1VybD1tYXRzVXJsK1wid215TWF0cy5qc29uXCI7XHJcbiAgICAgICAgdmFyIG5ld1NoYWRlcnNVcmw9c2hhZGVyc1VybDtcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKG5ld01hdHNVcmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLChtYXRzVXJsLHNoYWRlcnNVcmwsZGF0YSk9PntcclxuICAgICAgICAgICAgaWYoZGF0YT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ3bXlNYXRzLeWHuumUmTpcIixuZXdNYXRzVXJsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYXJyYXk6QXJyYXk8YW55Pj1kYXRhW1wibWF0c1wiXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYob2JqW1widGFyZ2V0TmFtZVwiXT09XCJcIiljb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQzRD1XbXlVdGlsczNELmdldE9iajNkKHRhcmdldCxvYmpbXCJ0YXJnZXROYW1lXCJdKWFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgICAgICAgICBpZih0YXJnZXQzRD09bnVsbCljb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXRVcmw9bWF0c1VybCtvYmpbXCJtYXRVcmxcIl07XHJcbiAgICAgICAgICAgICAgICB2YXIgc2hhZGVyTmFtZVVybD1zaGFkZXJzVXJsK29ialtcInNoYWRlck5hbWVcIl0rXCIudHh0XCI7XHJcbiAgICAgICAgICAgICAgICBMYXlhLkJhc2VNYXRlcmlhbC5sb2FkKG1hdFVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKF90YXJnZXQzRDpMYXlhLlNwcml0ZTNELF9zaGFkZXJOYW1lVXJsLG0pPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBEYXRhPXt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHBEYXRhW1wiY3ViZUZ1blwiXT0obSxjdWJlTmFtZSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMuZ2V0Q3ViZShjdWJlTmFtZSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsKGN1YmUsaSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGk9PTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0uX3NoYWRlclZhbHVlcy5zZXRUZXh0dXJlKExheWEuU2NlbmUzRC5SRUZMRUNUSU9OVEVYVFVSRSxjdWJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBXbXlTaGFkZXJNc2cuc2V0U2hhZGVyKF90YXJnZXQzRCxtLF9zaGFkZXJOYW1lVXJsLGZhbHNlLHBEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihfdGFyZ2V0M0QhPW51bGwgJiYgX3RhcmdldDNELnBhcmVudCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90YXJnZXQzRC5wYXJlbnQucmVtb3ZlQ2hpbGQoX3RhcmdldDNEKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFt0YXJnZXQzRCxzaGFkZXJOYW1lVXJsXSkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFttYXRzVXJsLG5ld1NoYWRlcnNVcmxdKSxudWxsLExheWEuTG9hZGVyLkpTT04pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYW5pUGxheSh0YXJnZXQsdGFyZ2V0TmFtZSxhbmlOYW1lKTpMYXlhLkFuaW1hdG9ye1xyXG4gICAgICAgIHZhciB0YXJnZXQzZDpMYXlhLlNwcml0ZTNEPXRoaXMuZ2V0T2JqM2QodGFyZ2V0LHRhcmdldE5hbWUpIGFzIExheWEuU3ByaXRlM0Q7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkX2FuaT10YXJnZXQzZC5nZXRDb21wb25lbnQoTGF5YS5BbmltYXRvcikgYXMgTGF5YS5BbmltYXRvcjtcclxuICAgICAgICB0YXJnZXQzZF9hbmkucGxheShhbmlOYW1lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDNkX2FuaTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25TaGFkb3coZGlyZWN0aW9uTGlnaHQ6TGF5YS5EaXJlY3Rpb25MaWdodCxzaGFkb3dSZXNvbHV0aW9uPTUxMixzaGFkb3dQQ0ZUeXBlPTEsc2hhZG93RGlzdGFuY2U6bnVtYmVyPTEwMCxpc1NoYWRvdzpib29sZWFuPXRydWUpe1xyXG4gICAgICAgIC8v54Gv5YWJ5byA5ZCv6Zi05b2xXHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgLy/lj6/op4HpmLTlvbHot53nprtcclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dEaXN0YW5jZSA9IHNoYWRvd0Rpc3RhbmNlO1xyXG4gICAgICAgIC8v55Sf5oiQ6Zi05b2x6LS05Zu+5bC65a+4XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UmVzb2x1dGlvbiA9IHNoYWRvd1Jlc29sdXRpb247XHJcbiAgICAgICAgLy9kaXJlY3Rpb25MaWdodC5zaGFkb3dQU1NNQ291bnQ9MTtcclxuICAgICAgICAvL+aooeeziuetiee6pyzotorlpKfotorpq5gs5pu06ICX5oCn6IO9XHJcbiAgICAgICAgZGlyZWN0aW9uTGlnaHQuc2hhZG93UENGVHlwZSA9IHNoYWRvd1BDRlR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uQ2FzdFNoYWRvdyh0YXJnZXQsdHlwZT0wLGlzU2hhZG93PXRydWUsaXNDaGlsZHJlbj10cnVlKXtcclxuICAgICAgICBpZih0YXJnZXQgaW5zdGFuY2VvZiBMYXlhLk1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBtczNEPSh0YXJnZXQgYXMgTGF5YS5NZXNoU3ByaXRlM0QpO1xyXG4gICAgICAgICAgICBpZih0eXBlPT0wKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0yKXtcclxuICAgICAgICAgICAgICAgIC8v5o6l5pS26Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgICAgICAvL+S6p+eUn+mYtOW9sVxyXG4gICAgICAgICAgICAgICAgbXMzRC5tZXNoUmVuZGVyZXIuY2FzdFNoYWRvdyA9IGlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCl7XHJcbiAgICAgICAgICAgIHZhciBzbXMzZD0odGFyZ2V0IGFzIExheWEuU2tpbm5lZE1lc2hTcHJpdGUzRCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGU9PTApe1xyXG4gICAgICAgICAgICAgICAgc21zM2Quc2tpbm5lZE1lc2hSZW5kZXJlci5yZWNlaXZlU2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0eXBlPT0xKXtcclxuICAgICAgICAgICAgICAgIHNtczNkLnNraW5uZWRNZXNoUmVuZGVyZXIuY2FzdFNoYWRvdz1pc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaXNDaGlsZHJlbil7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lm51bUNoaWxkcmVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSB0YXJnZXQuZ2V0Q2hpbGRBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25DYXN0U2hhZG93KG9iaix0eXBlLGlzU2hhZG93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZ2IyaGV4KHIsZyxiKXtcclxuICAgICAgICB2YXIgX2hleD1cIiNcIiArIHRoaXMuaGV4KHIpICt0aGlzLiBoZXgoZykgKyB0aGlzLmhleChiKTtcclxuICAgICAgICByZXR1cm4gX2hleC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGV4KHgpe1xyXG4gICAgICAgIHg9dGhpcy5vbk51bVRvKHgpO1xyXG4gICAgICAgIHJldHVybiAoXCIwXCIgKyBwYXJzZUludCh4KS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvbk51bVRvKG4pe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQoMikpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBcclxuICAgcHVibGljIHN0YXRpYyBsZXJwRihhOm51bWJlciwgYjpudW1iZXIsIHM6bnVtYmVyKTpudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIChhICsgKGIgLSBhKSAqIHMpO1xyXG4gICAgfVxyXG5cclxufSJdfQ==
