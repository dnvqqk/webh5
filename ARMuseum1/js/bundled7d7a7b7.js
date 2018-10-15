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
        Laya.timer.once(1000, this, function () {
            var LayaEngine = window["LayaEngine"];
            var texture = LayaEngine["texture"];
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpciBJREUgMi4wLjAgYmV0YTIvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDb25maWcudHMiLCJzcmMvTWFpbi50cyIsInNyYy90YXIvV215VGFyLnRzIiwic3JjL3dteVV0aWxzSDUvV215VXRpbHMudHMiLCJzcmMvd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkM2QudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkTWF0cy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVNoYWRlck1zZy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkE7O0VBRUU7QUFDRjtJQVdJO0lBQWMsQ0FBQztJQUNSLGVBQUksR0FBWDtJQUNBLENBQUM7SUFaTSxnQkFBSyxHQUFRLEdBQUcsQ0FBQztJQUNqQixpQkFBTSxHQUFRLElBQUksQ0FBQztJQUNuQixvQkFBUyxHQUFRLFlBQVksQ0FBQztJQUM5QixxQkFBVSxHQUFRLE1BQU0sQ0FBQztJQUN6QixxQkFBVSxHQUFRLEVBQUUsQ0FBQztJQUNyQixvQkFBUyxHQUFRLEVBQUUsQ0FBQztJQUNwQixnQkFBSyxHQUFTLEtBQUssQ0FBQztJQUNwQixlQUFJLEdBQVMsSUFBSSxDQUFDO0lBQ2xCLHVCQUFZLEdBQVMsS0FBSyxDQUFDO0lBQzNCLDRCQUFpQixHQUFTLElBQUksQ0FBQztJQUkxQyxpQkFBQztDQWRELEFBY0MsSUFBQTtrQkFkb0IsVUFBVTtBQWUvQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7QUNsQmxCLDJDQUFzQztBQUN0Qyx5REFBd0Q7QUFDeEQsMERBQXlEO0FBQ3pELHVDQUFrQztB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Q0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBQ2MsY0FBRyxHQUFsQixVQUFtQixDQUFDO1FBQ2hCLENBQUMsR0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFYSxrQkFBTyxHQUFyQixVQUFzQixDQUFDO1FBQ3pCLElBQUcsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFFLENBQUMsRUFBQztZQUN0QixDQUFDLEdBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QjtRQUNQLE9BQU8sQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQUdlLGdCQUFLLEdBQW5CLFVBQW9CLENBQVEsRUFBRSxDQUFRLEVBQUUsQ0FBUTtRQUMzQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTCxpQkFBQztBQUFELENBcktBLEFBcUtDLElBQUE7QUFyS1ksZ0NBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypcclxuKiDmuLjmiI/liJ3lp4vljJbphY3nva47XHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb25maWd7XHJcbiAgICBzdGF0aWMgd2lkdGg6bnVtYmVyPTY0MDtcclxuICAgIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTExMzY7XHJcbiAgICBzdGF0aWMgc2NhbGVNb2RlOnN0cmluZz1cImZpeGVkd2lkdGhcIjtcclxuICAgIHN0YXRpYyBzY3JlZW5Nb2RlOnN0cmluZz1cIm5vbmVcIjtcclxuICAgIHN0YXRpYyBzdGFydFNjZW5lOnN0cmluZz1cIlwiO1xyXG4gICAgc3RhdGljIHNjZW5lUm9vdDpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHN0YXQ6Ym9vbGVhbj10cnVlO1xyXG4gICAgc3RhdGljIHBoeXNpY3NEZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIGV4cG9ydFNjZW5lVG9Kc29uOmJvb2xlYW49dHJ1ZTtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLmluaXQoKTsiLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCB7IFdteVV0aWxzM0QgfSBmcm9tIFwiLi93bXlVdGlsc0g1L2QzL1dteVV0aWxzM0RcIjtcclxuaW1wb3J0IHsgV215X0xvYWRfTWFnIH0gZnJvbSBcIi4vd215VXRpbHNINS9XbXlfTG9hZF9NYWdcIjtcclxuaW1wb3J0IFdteVRhciBmcm9tIFwiLi90YXIvV215VGFyXCI7XHJcbmNsYXNzIE1haW4ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0V215VGFyLmdldFRoaXMuaW5pdChuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkluaXQpKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25Jbml0KCl7XHJcblx0XHRpZighTGF5YVtcIl9pc2luaXRcIl0pe1xyXG5cdFx0XHRMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcblx0XHR9XHJcblxyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcclxuXHRcdC8vIExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gTGF5YS5TdGFnZS5TQ0FMRV9TSE9XQUxMO1xyXG5cdFx0Ly8gTGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xyXG4gICAgICAgIExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gTGF5YS5TdGFnZS5TQ0FMRV9GVUxMO1xyXG4gICAgICAgIExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IExheWEuU3RhZ2UuU0NSRUVOX05PTkU7XHJcblx0XHRMYXlhLnN0YWdlLmJnQ29sb3IgPSAnbm9uZSc7XHJcblx0XHRcclxuXHRcdC8v6K6+572u5rC05bmz5a+56b2QXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnbkggPSBcImNlbnRlclwiO1xyXG5cdFx0Ly/orr7nva7lnoLnm7Tlr7npvZBcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduViA9IFwibWlkZGxlXCI7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHRcdExheWEudGltZXIub25jZSgxMDAwLHRoaXMsKCk9PntcclxuXHRcdFx0dmFyIExheWFFbmdpbmU9d2luZG93W1wiTGF5YUVuZ2luZVwiXTtcclxuXHRcdFx0dmFyIHRleHR1cmU9TGF5YUVuZ2luZVtcInRleHR1cmVcIl07XHJcblx0XHR9KVxyXG5cclxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcblx0XHR2YXIgd215VlRpbWU9XCJcIjtcclxuXHRcdGlmKHdpbmRvdyE9bnVsbCAmJiB3aW5kb3dbXCJ3bXlWVGltZVwiXSE9bnVsbCl7XHJcblx0XHRcdHdteVZUaW1lPXdpbmRvd1tcIndteVZUaW1lXCJdO1xyXG5cdFx0fVxyXG5cdFx0Ly9MYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIit3bXlWVGltZSwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cdH1cclxuXHJcblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZChmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QpO1xyXG5cdFx0dmFyIHVybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KFwicmVzL2xvYWRJbmZvLmpzb25cIik7XHJcbiAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMub25Mb2FkV2V0RGF0YSh1cmwsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZExvYWQpKTtcclxuXHR9XHJcblx0XHJcbiAgICBwcml2YXRlIG9uTG9hZExvYWQoKXtcclxuICAgICAgICB2YXIgcmVzT2JqPVdteV9Mb2FkX01hZy5nZXRUaGlzLmdldFJlc09iaihcImxvYWRcIik7XHJcbiAgICAgICAgaWYocmVzT2JqIT1udWxsKXtcclxuICAgICAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMub25sb2FkKHJlc09iaixuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRNYWluKSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcbiAgICBwcml2YXRlIF9sb2FkVmlldzogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHRwcml2YXRlIF9iYXI6ZmFpcnlndWkuR1Byb2dyZXNzQmFyO1xyXG5cdHByaXZhdGUgb25Mb2FkTWFpbigpe1xyXG5cdFx0dGhpcy5fbG9hZFZpZXc9ZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdChcImxvYWRcIixcIkxvYWRcIikuYXNDb207XHJcblx0XHRmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKHRoaXMuX2xvYWRWaWV3KTtcclxuXHRcdHRoaXMuX2Jhcj10aGlzLl9sb2FkVmlldy5nZXRDaGlsZChcImJhclwiKS5hc1Byb2dyZXNzO1xyXG5cclxuICAgICAgICBXbXlfTG9hZF9NYWcuZ2V0VGhpcy5vbkF1dG9Mb2FkQWxsKG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25Mb2FkaW5nKHByb2dyZXNzOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Jhci52YWx1ZT1wcm9ncmVzcztcclxuXHR9XHJcblx0XHJcbiAgICBwcml2YXRlIF91M2RBcnI7XHJcbiAgICBwdWJsaWMgc2NlbmUzRDpMYXlhLlNjZW5lM0Q7XHJcblx0cHJpdmF0ZSBvbkxvYWRPayh1aUFycix1M2RBcnIpe1xyXG5cdFx0dGhpcy5fdTNkQXJyPXUzZEFycjtcclxuXHRcdExheWEudGltZXIub25jZSg0MDAsdGhpcywgKCk9PntcclxuXHRcdFx0dGhpcy5vbk1haW4oKTtcclxuXHRcdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5yZW1vdmVDaGlsZCh0aGlzLl9sb2FkVmlldyk7XHJcblx0XHRcdHRoaXMuX2xvYWRWaWV3PW51bGw7XHJcblx0XHRcdHRoaXMuX2Jhcj1udWxsO1xyXG5cdFx0fSk7XHJcblx0XHQvL+a3u+WKoDNE5Zy65pmvXHJcblx0XHRpZih1M2RBcnJbMF0hPW51bGwpe1xyXG5cdFx0XHR2YXIgdXJsM2Q9dTNkQXJyWzBdLnVybExpc3RbMF07XHJcblx0XHRcdHRoaXMuc2NlbmUzRCA9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybDNkKTtcclxuXHRcdFx0V215VXRpbHMzRC5zZXRTaGFkZXJBbGwodGhpcy5zY2VuZTNELFwicmVzL21hdHMvXCIsXCJyZXMvc2hhZGVycy9cIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG4gICAgcHJpdmF0ZSBfbWFpblZpZXc6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBvbk1haW4oKXtcclxuXHRcdHRoaXMuX21haW5WaWV3PWZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJtYWluXCIsXCJNYWluXCIpLmFzQ29tO1xyXG5cdFx0aWYodGhpcy5fbWFpblZpZXchPW51bGwpe1xyXG5cdFx0XHRmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKHRoaXMuX21haW5WaWV3KTtcclxuXHRcdFx0dmFyIF9NYWluPXRoaXMuX21haW5WaWV3LmdldENoaWxkKFwiX01haW5cIikuYXNDb207XHJcblx0XHRcdHZhciBfZDM9X01haW4uZ2V0Q2hpbGQoXCJkM1wiKS5hc0NvbTtcclxuXHRcdFx0aWYodGhpcy5zY2VuZTNEIT1udWxsKXtcclxuXHRcdFx0XHRfZDMuZGlzcGxheU9iamVjdC5hZGRDaGlsZCh0aGlzLnNjZW5lM0QpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlUYXJ7XHJcbiAgICBwcml2YXRlIF9lbmdpbmU6IFRBUi5FbmdpbmU7XHJcbiAgICBwcml2YXRlIF9hcjogVEFSLkFSO1xyXG4gICAgcHJpdmF0ZSBfcmVuZGVyOiBUQVIuUmVuZGVyO1xyXG4gICAgc3RhdGljIF90aGlzOldteVRhcjtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKXtcclxuICAgICAgICBpZihXbXlUYXIuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlUYXIuX3RoaXM9bmV3IFdteVRhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215VGFyLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIF9jb21wbGV0ZTogTGF5YS5IYW5kbGVyO1xyXG4gICAgX0xheWFFbmdpbmU6YW55O1xyXG4gICAgX3RleHR1cmU6YW55O1xyXG4gICAgcHVibGljIGluaXQoY29tcGxldGU6TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB0aGlzLl9jb21wbGV0ZT1jb21wbGV0ZTtcclxuXHRcdHRoaXMuX3JlbmRlciA9IG5ldyBUQVIuUmVuZGVyKCk7XHJcblx0XHR0aGlzLl9hciA9IG5ldyBUQVIuQVIoKTtcclxuICAgICAgICB0aGlzLl9lbmdpbmUgPSBuZXcgVEFSLkVuZ2luZSgpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLl9MYXlhRW5naW5lPXdpbmRvd1tcIkxheWFFbmdpbmVcIl07XHJcbiAgICAgICAgLy8gaWYodGhpcy5fTGF5YUVuZ2luZSE9bnVsbCl7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuX3RleHR1cmU9dGhpcy5fTGF5YUVuZ2luZVtcInRleHR1cmVcIl07XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIC8qKlxyXG4gICAgICAgIC8vICAqIEFuZHJvaWTpgJrov4fkuLvlvqrnjq/nm5HmjqflubPpnaLlnZDmoIfnmoTlj5jljJbvvIzpnIDopoHkuLvliqjosIPnlKhvblRhclN0YXRlQ2hhbmdlZOWOu+aUueWPmOeKtuaAgVxyXG4gICAgICAgIC8vICAqIGlPU+W3sue7j+WwhuS6i+S7tuebkeWQrOWGmeWcqOS6hnRhci5qc+mHjOmdou+8jOeKtuaAgeiHquWKqOWIh+aNolxyXG4gICAgICAgIC8vICAqL1xyXG4gICAgICAgIC8vIGlmIChUQVIuRU5WLkFORFJPSUQpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5fcmVuZGVyLm9uKCdUQVJfU1RBVEVfQ0hBTkdFJywgKCkgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgY29uc3QgdnJEaXNwbGF5ID0gdGhpcy5fYXIuZ2V0VlJEaXNwbGF5KCk7XHJcbiAgICAgICAgLy8gICAgICAgICBpZiAodnJEaXNwbGF5ICYmIHRoaXMuX2FyLmlzRW5naW5lRG93bmxvYWQoKSkge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnN0IGZyYW1lRGF0YSA9IG5ldyB3aW5kb3dbXCJWUkZyYW1lRGF0YVwiXSgpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIHZyRGlzcGxheS5nZXRGcmFtZURhdGEoZnJhbWVEYXRhKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICBjb25zdCBbeCwgeSwgel0gPSBmcmFtZURhdGEucG9zZS5wb3NpdGlvbjtcclxuICAgICAgICAvLyAgICAgICAgICAgICBpZiAoeCA9PT0gMCAmJiAgeSA9PT0gMCAmJiB6ID09PSAwKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuX2FyLm9uVGFyU3RhdGVDaGFuZ2VkKCdsaW1pdGVkJyk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5fYXIub25UYXJTdGF0ZUNoYW5nZWQoJ25vcm1hbCcpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyAvLyB0cmlnZ2VyIGNhbWVyYSBwb3NpdGlvbiBjaGFuZ2UgZXZlcnkgZnJhbWVcclxuICAgICAgICAvLyB0aGlzLl9yZW5kZXIub24oJ0NBTUVSQV9UUkFOU0ZPUk1fQ0hBTkdFJywgKCkgPT4ge1xyXG4gICAgICAgIC8vICAgICBjb25zdCB2ckRpc3BsYXkgPSAgdGhpcy5fYXIuZ2V0VlJEaXNwbGF5KCk7XHJcbiAgICAgICAgLy8gICAgIC8vIOmcgOimgeiOt+WPluWIsHZyRGlzcGxheeWvueixoeW5tuS4lGFy5byV5pOO5LiL5a6M5oiQ5omN6IO95YGa5Lia5Yqh6YC76L6RXHJcbiAgICAgICAgLy8gICAgIGlmICh2ckRpc3BsYXkgJiYgIHRoaXMuX2FyLmlzRW5naW5lRG93bmxvYWQoKSkge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5fZW5naW5lLm9uQ2FtZXJhVHJhbnNmb3JtQ2hhbmdlKCk7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9KTtcclxuXHJcblxyXG5cdFx0Ly8gcmVuZGVy5Yid5aeL5YyW77yM6L+Q6KGM5Li75b6q546vXHJcblx0XHR0aGlzLl9yZW5kZXIuaW5pdCgpO1xyXG5cdFx0aWYgKFRBUi5FTlYuSU9TKSB7XHJcblx0XHRcdHRoaXMuQVJJbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFRBUi5FTlYuQU5EUk9JRCkge1xyXG4gICAgICAgICAgICAvLyBhbmRyb2lkIEFS55qE6IO95Yqb6ZyA6KaB5LiL6L295omN5pyJXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTVEFUVVNfQ0hBTkdF5pa55rOV5rOo5YaMNOS4quS4juW8leaTjueKtuaAgeebuOWFs+eahGNhbGxiYWNr5Ye95pWwc3RhcnQsIGxvYWRpbmcsIHN1Y2Nlc3MsIGZhaWxcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFRBUi5UQVJVdGlscy5TVEFUVVNfQ0hBTkdFKFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2xvc2UgbmF0aXZlIHByb2dyZXNzIGFmdGVyIGRvd25sb2FkIG5hdGl2ZSBhciBlbmdpbmVcclxuICAgICAgICAgICAgICAgICAgICAvL05BVElWRV9SUk9HUkVTU19DTE9TRSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW5pdCBBUiBmYWlsLiBQbGF0Zm9ybSBhbmRyb2lkLiBkb3dubG9hZCBlbmdpbmUgZXJyb3InKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgLy8gdnIgZGlzcGxheSDlv4XpobvpppblhYjliqDovb3vvIxhbmRyb2lk5ZyoeDXlhoXmoLjph4zlt7Lnu4/mnInvvIxpb3PpnIDopoHlvJXnlKhXZWJBUm9uQVJraXRcclxuICAgICAgICAgICAgLy8gYW5kcm9pZCBBUueahOiDveWKm+mcgOimgeS4i+i9veaJjeacie+8jOS9huaYr+aRhOWDj+WktOiDveWKm+S4jemcgOimgeS4i+i9veW8leaTju+8jOaJgOS7pXJlbmRlcuWPr+S7peaPkOWJjei/m+ihjO+8m2lvc+acrOi6q+WwseacieWQhOenjeiDveWKm++8jHNsYW3jgIFtYXJrZXJsZXNz5rK/55SoYXJraXTnmoTvvIxtYXJrZXIgYmFzZeaYr+atpuaxieiHqueglOeahO+8jOWFtuS4reeahGFkZE1hcmtlcumcgOimgee7iOerr+a3u+WKoOeahFxyXG4gICAgICAgICAgICBUQVIuQVIuaW5pdEFSRW5naW5lKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAyXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FyLnNldEVuZ2luZURvd25sb2FkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnSW5pdCBBUiBzdWNjZXNzLiBQbGF0Zm9ybSBhbmRyb2lkLiBBUiBFbmdpbmUgZG93bmxvYWQgc3VjY2VzcywgeW91IGNhbiB1c2UgYWJpbGl0eSBvZiB0YXIgJ1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbml0IEFSIGZhaWwuIFBsYXRmb3JtIGFuZHJvaWQuIGluaXQgZmFpbCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLkFSSW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQVJJbml0KCkge1xyXG4gICAgICAgIHRoaXMuX2FyLmxvYWQoKS50aGVuKChkaXNwbGF5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlci5zZXRWUkRpc3BsYXkoZGlzcGxheSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZS5jcmVhdGUoJ0xheWEnKTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIGFy5byV5pOO5Yqg6L2977yMbG9hZOWHveaVsOaciTPkuKrlj4LmlbDvvIzlkI7kuKTkuKrkuLrlm57osIPlh73mlbBvblN0YXJ0Q2FsbGJhY2vlkoxvbkNvbXBsZXRlQ2FsbGJhY2tcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZS5sb2FkKGRpc3BsYXksIG51bGwsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlLnJ1bigpO1xyXG4gICAgICAgICAgICAgICAgLy8gdGFzayA9IG5ldyBUYXNrKGFyLCByZW5kZXIsIGVuZ2luZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcnVuID0gKHByZVN0YXRlLCBuZXh0U3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0YXNrLnJ1bihwcmVTdGF0ZSwgbmV4dFN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgKGFyLmdldEN1cnJlbnRTdGF0ZSgpID09PSAnbm9ybWFsJykge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHJ1bigpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAvKipcclxuICAgICAgICAgICAgICAgIC8vICAgICAgKiAg5bCGcnVuIGNhbGxiYWNr5rOo5YaM5YiwYXLnmoTnirbmgIHovaznp7vlh73mlbDkuK3vvIxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgKiAg5b2T6LCD55SoYXIub25UYXJTdGF0ZUNoYW5nZWQoJ25vcm1hbCcp5oiW6ICFIGFyLm9uVGFyU3RhdGVDaGFuZ2VkKCdsaW1pdGVkJykg77yMIHJ1buS8muinpuWPke+8jFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAqICDmiYDku6VydW7lh73mlbDopoHlgZrkuI3lkIznirbmgIHpl7TovazmjaLlpITnkIZcclxuICAgICAgICAgICAgICAgIC8vICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vICAgICBhci5zZXROb3RBdmFpbGFibGUyTm9ybWFsRnVuYyhydW4pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGFyLnNldExpbWl0ZWQyTm9ybWFsRnVuYyhydW4pO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgZXhjZXB0aW9uID0gJHtlfWApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbmV4cG9ydCBjbGFzcyBXbXlVdGlscyBleHRlbmRzIGxheWEuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpczpXbXlVdGlscztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlVdGlsc3tcclxuICAgICAgICBpZihXbXlVdGlscy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteVV0aWxzLl90aGlzPW5ldyBXbXlVdGlscygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5fdGhpcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLl9fbG9vcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9ET1dOLHRoaXMsIHRoaXMuX19vblRvdWNoRG93bik7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9VUCx0aGlzLCB0aGlzLl9fb25Ub3VjaFVwKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLl9fT25Nb3VzZU1PVkUpO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5SRVNJWkUsdGhpcyx0aGlzLl9fb25SZXNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBDT0xPUl9GSUxURVJTX01BVFJJWDogQXJyYXk8YW55Pj1bXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9SXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9HXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9CXHJcbiAgICAgICAgMCwgMCwgMCwgMSwgMCwgLy9BXHJcbiAgICBdO1xyXG4gICAgLy/ovazmjaLpopzoibJcclxuICAgIHB1YmxpYyBjb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpOkFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFswXT1yO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzZdPWc7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMTJdPWI7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMThdPWF8fDE7XHJcbiAgICAgICAgcmV0dXJuIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYO1xyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVycyh0YXJnZXQ6TGF5YS5TcHJpdGUsY29sb3I6bnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJzPW51bGw7XHJcbiAgICAgICAgaWYoY29sb3IgIT0gMHhmZmZmZmYpe1xyXG4gICAgICAgICAgICB0YXJnZXQuZmlsdGVycz1bbmV3IExheWEuQ29sb3JGaWx0ZXIodGhpcy5jb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjE2KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjgpICYgMHhmZikvMjU1LFxyXG4gICAgICAgICAgICAgICAgKGNvbG9yICYgMHhmZikvMjU1XHJcbiAgICAgICAgICAgICAgICApKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVyczEodGFyZ2V0OkxheWEuU3ByaXRlLHI6bnVtYmVyLGc6bnVtYmVyLGI6bnVtYmVyLGE/Om51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKHIgPCAxIHx8IGcgPCAxIHx8IGIgPCAxIHx8IGEgPCAxKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocixnLGIsYSkpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/liKTmlq3miYvmnLrmiJZQQ1xyXG4gICAgcHVibGljIGlzUGMoKTpib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGlzUGM6Ym9vbGVhbj1mYWxzZTtcclxuICAgICAgICBpZih0aGlzLnZlcnNpb25zKCkuYW5kcm9pZCB8fCB0aGlzLnZlcnNpb25zKCkuaVBob25lIHx8IHRoaXMudmVyc2lvbnMoKS5pb3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpc1BjPWZhbHNlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMudmVyc2lvbnMoKS5pUGFkKXtcclxuICAgICAgICAgICAgaXNQYz10cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNQYztcclxuICAgIH1cclxuICAgIHB1YmxpYyB2ZXJzaW9ucygpe1xyXG4gICAgICAgIHZhciB1OnN0cmluZyA9IG5hdmlnYXRvci51c2VyQWdlbnQsIGFwcDpzdHJpbmcgPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAvL+enu+WKqOe7iOerr+a1j+iniOWZqOeJiOacrOS/oeaBr1xyXG4gICAgICAgICAgICB0cmlkZW50OiB1LmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xLCAvL0lF5YaF5qC4XHJcbiAgICAgICAgICAgIHByZXN0bzogdS5pbmRleE9mKCdQcmVzdG8nKSA+IC0xLCAvL29wZXJh5YaF5qC4XHJcbiAgICAgICAgICAgIHdlYktpdDogdS5pbmRleE9mKCdBcHBsZVdlYktpdCcpID4gLTEsIC8v6Iu55p6c44CB6LC35q2M5YaF5qC4XHJcbiAgICAgICAgICAgIGdlY2tvOiB1LmluZGV4T2YoJ0dlY2tvJykgPiAtMSAmJiB1LmluZGV4T2YoJ0tIVE1MJykgPT0gLTEsIC8v54Gr54uQ5YaF5qC4XHJcbiAgICAgICAgICAgIG1vYmlsZTogISF1Lm1hdGNoKC9BcHBsZVdlYktpdC4qTW9iaWxlLiovKXx8ISF1Lm1hdGNoKC9BcHBsZVdlYktpdC8pLCAvL+aYr+WQpuS4uuenu+WKqOe7iOerr1xyXG4gICAgICAgICAgICBpb3M6ICEhdS5tYXRjaCgvXFwoaVteO10rOyggVTspPyBDUFUuK01hYyBPUyBYLyksIC8vaW9z57uI56uvXHJcbiAgICAgICAgICAgIGFuZHJvaWQ6IHUuaW5kZXhPZignQW5kcm9pZCcpID4gLTEgfHwgdS5pbmRleE9mKCdMaW51eCcpID4gLTEsIC8vYW5kcm9pZOe7iOerr+aIluiAhXVj5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQaG9uZTogdS5pbmRleE9mKCdpUGhvbmUnKSA+IC0xIHx8IHUuaW5kZXhPZignTWFjJykgPiAtMSwgLy/mmK/lkKbkuLppUGhvbmXmiJbogIVRUUhE5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQYWQ6IHUuaW5kZXhPZignaVBhZCcpID4gLTEsIC8v5piv5ZCmaVBhZFxyXG4gICAgICAgICAgICB3ZWJBcHA6IHUuaW5kZXhPZignU2FmYXJpJykgPT0gLTEgLy/mmK/lkKZ3ZWLlupTor6XnqIvluo/vvIzmsqHmnInlpLTpg6jkuI7lupXpg6hcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRVcmxWKGtleTpzdHJpbmcpe1xyXG4gICAgICAgIHZhciByZWc9IG5ldyBSZWdFeHAoXCIoXnwmKVwiK2tleStcIj0oW14mXSopKCZ8JClcIik7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLm1hdGNoKHJlZyk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdD9kZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzJdKTpudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk5hdmlnYXRlKHVybDpzdHJpbmcsaXNSZXBsYWNlOmJvb2xlYW49ZmFsc2Upe1xyXG4gICAgICAgIGlmKGlzUmVwbGFjZSl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHVybCk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9dXJsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ldmVudExpc3Q6QXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+PW5ldyBBcnJheTxsYXlhLmV2ZW50cy5FdmVudD4oKTtcclxuICAgIHByaXZhdGUgX19vblRvdWNoRG93bihldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KTwwKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnB1c2goZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaFVwKGV2dDogbGF5YS5ldmVudHMuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpPj0wKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnNwbGljZSh0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25SZXNpemUoKXtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3QuZm9yRWFjaChldnQgPT4ge1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuXHRcdH0pO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdD1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX19Pbk1vdXNlTU9WRShldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGJOdW09MTA7XHJcbiAgICAgICAgaWYoZXZ0LnN0YWdlWCA8PSBiTnVtIHx8IGV2dC5zdGFnZVggPj0gTGF5YS5zdGFnZS53aWR0aC1iTnVtIHx8XHJcbiAgICAgICAgICAgIGV2dC5zdGFnZVkgPD0gYk51bSB8fCBldnQuc3RhZ2VZID49IExheWEuc3RhZ2UuaGVpZ2h0LWJOdW0pe1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTnVtVG8obixsPTIpe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQobCkpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJfWFkoZCwgcilcclxuICAgIHtcclxuICAgIFx0dmFyIHJhZGlhbiA9IChyICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBcdHZhciBjb3MgPSAgTWF0aC5jb3MocmFkaWFuKTtcclxuICAgIFx0dmFyIHNpbiA9ICBNYXRoLnNpbihyYWRpYW4pO1xyXG4gICAgXHRcclxuICAgIFx0dmFyIGR4PWQgKiBjb3M7XHJcbiAgICBcdHZhciBkeT1kICogc2luO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IExheWEuUG9pbnQoZHggLCBkeSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nMmJ1ZmZlcihzdHIpOkFycmF5QnVmZmVyIHtcclxuICAgICAgICAvLyDpppblhYjlsIblrZfnrKbkuLLovazkuLoxNui/m+WItlxyXG4gICAgICAgIGxldCB2YWwgPSBcIlwiXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodmFsID09PSAnJykge1xyXG4gICAgICAgICAgICB2YWwgPSBzdHIuY2hhckNvZGVBdChpKS50b1N0cmluZygxNilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWwgKz0gJywnICsgc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDlsIYxNui/m+WItui9rOWMluS4ukFycmF5QnVmZmVyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHZhbC5tYXRjaCgvW1xcZGEtZl17Mn0vZ2kpLm1hcChmdW5jdGlvbiAoaCkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludChoLCAxNilcclxuICAgICAgICB9KSkuYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVwbGFjZUFsbChzdHIsIG9sZFN0ciwgbmV3U3RyKXsgIFxyXG4gICAgICAgIHZhciB0ZW1wID0gJyc7ICBcclxuICAgICAgICB0ZW1wID0gc3RyLnJlcGxhY2Uob2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIGlmKHRlbXAuaW5kZXhPZihvbGRTdHIpPj0wKXtcclxuICAgICAgICAgICAgdGVtcCA9IHRoaXMucmVwbGFjZUFsbCh0ZW1wLCBvbGRTdHIsIG5ld1N0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9ICBcclxuXHJcbiAgICAvL+Wkp+Wwj+WGmei9rOaNolxyXG4gICAgcHVibGljIHN0YXRpYyB0b0Nhc2Uoc3RyOnN0cmluZywgaXNEeD1mYWxzZSl7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnO1xyXG4gICAgICAgIGlmKCFpc0R4KXtcclxuICAgICAgICAgICAgLy/ovazmjaLkuLrlsI/lhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgLy/ovazljJbkuLrlpKflhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7ICBcclxuICAgIH0gXHJcblxyXG4gICAgXHJcbiAgICAvL+i3neemu1xyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0RGlzdGFuY2UoYTpMYXlhLlBvaW50LGI6TGF5YS5Qb2ludCk6bnVtYmVyIHtcclxuXHRcdHZhciBkeCA9IE1hdGguYWJzKGEueCAtIGIueCk7XHJcblx0XHR2YXIgZHkgPSBNYXRoLmFicyhhLnkgLSBiLnkpO1xyXG5cdFx0dmFyIGQ9TWF0aC5zcXJ0KE1hdGgucG93KGR4LCAyKSArIE1hdGgucG93KGR5LCAyKSk7XHJcblx0XHRkPXBhcnNlRmxvYXQoZC50b0ZpeGVkKDIpKTtcclxuXHRcdHJldHVybiBkO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFh5VG9SKHkseCk6bnVtYmVye1xyXG4gICAgICAgIHZhciByYWRpYW49TWF0aC5hdGFuMih5LHgpO1xyXG4gICAgICAgIHZhciByPSgxODAvTWF0aC5QSSpyYWRpYW4pO1xyXG4gICAgICAgIHI9dGhpcy5vbk51bVRvKHIpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc3RvcmFnZShrZXksIHZhbHVlOmFueT1cIj9cIiwgaXNMb2NhbD10cnVlKTphbnl7XHJcbiAgICAgICAgdmFyIHN0b3JhZ2U6YW55PWlzTG9jYWw/bG9jYWxTdG9yYWdlOnNlc3Npb25TdG9yYWdlO1xyXG4gICAgICAgIGlmKHZhbHVlPT1cIj9cIil7XHJcblx0XHRcdHZhciBkYXRhID0gc3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZih2YWx1ZT09bnVsbCl7XHJcblx0XHRcdHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0c3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheUZ1aVNvdW5kKF91cmwsdm9sdW1lPTAuMixjb21wbGV0ZUhhbmRsZXI/LHN0YXJ0VGltZT0wLGxvb3BzPTEpe1xyXG4gICAgICAgIGlmKHZvbHVtZTw9MClyZXR1cm47XHJcbiAgICAgICAgdmFyIGl0ZW09ZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1CeVVSTChfdXJsKTtcclxuICAgICAgICB2YXIgdXJsPWl0ZW0uZmlsZTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQodXJsLGxvb3BzLGNvbXBsZXRlSGFuZGxlcixudWxsLHN0YXJ0VGltZSk7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIuc2V0U291bmRWb2x1bWUodm9sdW1lLHVybCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXbXlVdGlscyB9IGZyb20gXCIuL1dteVV0aWxzXCI7XHJcbmltcG9ydCB7IFdteUxvYWQzZCB9IGZyb20gXCIuL2QzL1dteUxvYWQzZFwiO1xyXG5pbXBvcnQgeyBXbXlMb2FkTWF0cyB9IGZyb20gXCIuL2QzL1dteUxvYWRNYXRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215X0xvYWRfTWFnXHJcbntcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteV9Mb2FkX01hZ3tcclxuICAgICAgICBpZihXbXlfTG9hZF9NYWcuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlfTG9hZF9NYWcuX3RoaXM9bmV3IFdteV9Mb2FkX01hZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215X0xvYWRfTWFnLl90aGlzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfd2V0RGF0YTphbnk9e307XHJcblxyXG4gICAgcHVibGljIHJlc1VybDpzdHJpbmc9XCJcIjtcclxuICAgIHB1YmxpYyBnZXRXZXREYXRhKHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93ZXREYXRhW3VybF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXRXZXREYXRhKG9iajphbnksdXJsPzpzdHJpbmcpe1xyXG4gICAgICAgIGlmKHRoaXMucmVzVXJsPT1cIlwiKXtcclxuICAgICAgICAgICAgdGhpcy5yZXNVcmw9dXJsO1xyXG4gICAgICAgICAgICB2YXIgYXJyPW51bGw7XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGFycj1KU09OLnBhcnNlKG9iaik7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih1cmw9PW51bGwpe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5yZXNVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3dldERhdGFbdXJsXT1vYmo7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRSZXNPYmoocmVzTmFtZTpzdHJpbmcsdXJsPyl7XHJcbiAgICAgICAgdmFyIHdlYkRhdGE6YW55O1xyXG4gICAgICAgIGlmKHVybD09bnVsbCl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLnJlc1VybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2ViRGF0YT10aGlzLmdldFdldERhdGEodXJsKTtcclxuICAgICAgICBpZih3ZWJEYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi56m65pWw5o2uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFycjpBcnJheTxhbnk+PW51bGw7XHJcbiAgICAgICAgaWYod2ViRGF0YSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgYXJyPXdlYkRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbCl7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZSh3ZWJEYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHdlYkRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc09iaj1udWxsO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPWFycltpXTtcclxuICAgICAgICAgICAgaWYob2JqW1wicmVzTmFtZVwiXT09cmVzTmFtZSl7XHJcbiAgICAgICAgICAgICAgICByZXNPYmo9b2JqO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc09iajtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkV2V0RGF0YSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICBpZih1cmw9PVwiXCIpcmV0dXJuO1xyXG4gICAgICAgIGlmKHRoaXMuZ2V0V2V0RGF0YSh1cmwpIT1udWxsKXtcclxuICAgICAgICAgICAgY2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLmdldFdldERhdGEodXJsKV0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsb2FkPUxheWEubG9hZGVyLmxvYWQodXJsLG5ldyBMYXlhLkhhbmRsZXIodGhpcyxmdW5jdGlvbihvYmope1xyXG4gICAgICAgICAgICB0aGlzLnNldFdldERhdGEob2JqLHVybCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5fd2V0RGF0YVt1cmxdXSk7XHJcbiAgICAgICAgfSkpXHJcbiAgICAgICAgcmV0dXJuIGxvYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVzRGF0YUFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHVibGljIG9ubG9hZChyZXNPYmo6YW55LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc05hbWU9cmVzT2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICBpZih0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXS5ydW5XaXRoKFt0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNPYmpbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciBkYXRhOmFueT17fTtcclxuICAgICAgICAgICAgdmFyIHJlc0RhdGE6c3RyaW5nPXJlc09ialtcInJlc0RhdGFcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc0RhdGEhPW51bGwgJiYgcmVzRGF0YSE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9SlNPTi5wYXJzZShyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIscmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lVXJsO1xyXG4gICAgICAgICAgICB2YXIgdXJsQXJyOkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHZhciBpc0NyZWF0ZT1mYWxzZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNVcmw9V215VXRpbHMudG9DYXNlKHJlc1VybCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIGlmKHVybC5pbmRleE9mKFwiLnR4dFwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5CVUZGRVJ9KTtcclxuICAgICAgICAgICAgICAgICAgICBiTmFtZVVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHVybC5pbmRleE9mKFwiLmpwZ1wiKT49MCB8fCB1cmwuaW5kZXhPZihcIi5wbmdcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuSU1BR0V9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodXJsLmluZGV4T2YoXCIubXAzXCIpPj0wIHx8IHVybC5pbmRleE9mKFwiLndhdlwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5TT1VORH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybEFyci5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybEFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkFzc2V0Q29ubXBsZXRlLFtyZXNOYW1lLGJOYW1lVXJsLGRhdGFdKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Bc3NldFByb2dyZXNzLCBbcmVzTmFtZV0sIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIG9ubG9hZDNkKHJlc09iajphbnksY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgcmVzTmFtZT1yZXNPYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgIGlmKHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdLnJ1bldpdGgoW3RoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc09ialtcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6YW55PXt9O1xyXG4gICAgICAgICAgICB2YXIgcmVzRGF0YTpzdHJpbmc9cmVzT2JqW1wicmVzRGF0YVwiXTtcclxuICAgICAgICAgICAgaWYocmVzRGF0YSE9bnVsbCAmJiByZXNEYXRhIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YT1KU09OLnBhcnNlKHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIixyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWU7XHJcbiAgICAgICAgICAgIHZhciB1cmxBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdmFyIHVybExpc3Q6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybC5pbmRleE9mKFwiLmxzXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHVybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybEFyci5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhLnVybExpc3Q9dXJsTGlzdDtcclxuICAgICAgICAgICAgV215TG9hZDNkLmdldFRoaXMub25sb2FkM2QodXJsQXJyLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uQXNzZXRDb25tcGxldGUsW3Jlc05hbWUsYk5hbWUsZGF0YV0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkFzc2V0UHJvZ3Jlc3MsIFtyZXNOYW1lXSwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG5cdHByaXZhdGUgb25Bc3NldFByb2dyZXNzKHJlc05hbWUscHJvZ3Jlc3MpOiB2b2lkIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2tQcm9ncmVzc0FycjpBcnJheTxMYXlhLkhhbmRsZXI+PXRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja1Byb2dyZXNzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNhbGxiYWNrUHJvZ3Jlc3NBcnJbaV07XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLnJ1bldpdGgoW3Byb2dyZXNzXSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBvbkFzc2V0Q29ubXBsZXRlKHJlc05hbWUsYk5hbWVVcmw6c3RyaW5nLGRhdGEpOnZvaWR7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrT2tBcnI6QXJyYXk8TGF5YS5IYW5kbGVyPj10aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdO1xyXG4gICAgICAgIGlmKGJOYW1lVXJsIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGJhbz1MYXlhLmxvYWRlci5nZXRSZXMoYk5hbWVVcmwpO1xyXG4gICAgICAgICAgICB2YXIgYk5hbWUgPSBiTmFtZVVybC5yZXBsYWNlKFwiLnR4dFwiLFwiXCIpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZmFpcnlndWkuVUlQYWNrYWdlLmFkZFBhY2thZ2UoYk5hbWUsYmFvKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkZVSS3lh7rplJk6XCIsYk5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZUFycj1iTmFtZS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIGRhdGEuYk5hbWU9Yk5hbWVBcnJbYk5hbWVBcnIubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdPWRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tPa0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tPayA9IGNhbGxiYWNrT2tBcnJbaV07XHJcbiAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbZGF0YV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPW51bGw7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1udWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkSW5mb0Fycjphbnk7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZHJDYWxsYmFja09rOkxheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3M6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9uQXV0b0xvYWRBbGwoY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgd2ViRGF0YTphbnk9dGhpcy5nZXRXZXREYXRhKHRoaXMucmVzVXJsKTtcclxuICAgICAgICBpZih3ZWJEYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi56m65pWw5o2uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFycjpBcnJheTxhbnk+PW51bGw7XHJcbiAgICAgICAgaWYod2ViRGF0YSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgYXJyPXdlYkRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbCl7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZSh3ZWJEYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHdlYkRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnI9e307XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdPTA7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXT0wO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdPVtdO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXT1bXTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1hcnJbaV07XHJcbiAgICAgICAgICAgIHZhciByZXNOYW1lPW9ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgICAgIHZhciB0PW9ialtcInR5cGVcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc05hbWU9PW51bGwgfHwgcmVzTmFtZT09XCJcIiB8fCB0PT1udWxsIHx8IHQ9PVwiXCIpY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMub25BdXRvTG9hZE9iaih0LHJlc05hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQXV0b0xvYWRPYmoodHlwZTpzdHJpbmcscmVzTmFtZSl7XHJcbiAgICAgICAgdmFyIHJlcz10aGlzLmdldFJlc09iaihyZXNOYW1lKTtcclxuICAgICAgICBpZihyZXM9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciByZXNJZD10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl07XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXT17fTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1wiblwiXT1yZXNOYW1lO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPXR5cGU7XHJcbiAgICAgICAgdmFyIGxvYWRPaz1mYWxzZTtcclxuICAgICAgICBpZih0eXBlPT1cInVpXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ1aS3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZDNkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidTNkLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cIm1hdHNcIil7XHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICByZXNVcmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsTGlzdC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkTWF0cy5nZXRUaGlzLm9ubG9hZDNkKHVybExpc3QsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgICAgIGxvYWRPaz10cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJtYXRzLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cImN1YmVNYXBcIil7XHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIExheWEuVGV4dHVyZUN1YmUubG9hZCh1cmwsbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cImF1ZGlvXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJhdWRpby3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdWJlKHJlc05hbWUsIGNvbXBsZXRlOiBMYXlhLkhhbmRsZXIpOkFycmF5PExheWEuVGV4dHVyZUN1YmU+e1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgIHZhciBSZXNyZXNPYmo6QXJyYXk8TGF5YS5UZXh0dXJlQ3ViZT49W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgIHJlc1VybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHJlc1VybCk7XHJcbiAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG5ldyBMYXlhLkhhbmRsZXIodGhpcyxjdWJlPT57XHJcbiAgICAgICAgICAgICAgICBSZXNyZXNPYmpbaV09Y3ViZTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlLnJ1bldpdGgoW2N1YmUsaV0pO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBSZXNyZXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkxvYWRpbmcocmVzSWQsIHByb2dyZXNzOm51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJwXCJdPXByb2dyZXNzO1xyXG4gICAgICAgIHZhciBudW09dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdO1xyXG4gICAgICAgIHZhciBwTnVtPTA7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxudW07aSsrKXtcclxuICAgICAgICAgICAgdmFyIHA9dGhpcy5fYXV0b0xvYWRJbmZvQXJyW2ldW1wicFwiXTtcclxuICAgICAgICAgICAgaWYocCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBwTnVtKz1wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBwQz0ocE51bS90aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0pKjEwMDtcclxuICAgICAgICBpZihpc05hTihwQykpcEM9MDtcclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwQ10pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25Mb2FkT2socmVzSWQsZGF0YT8pe1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInRcIl09PVwidWlcIil7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInRcIl09PVwidTNkXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl0ucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXT49dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKXtcclxuICAgICAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rLnJ1bldpdGgoW3RoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdLHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBjbGFzcyBXbXlMb2FkM2R7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlMb2FkM2R7XHJcbiAgICAgICAgaWYoV215TG9hZDNkLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215TG9hZDNkLl90aGlzPW5ldyBXbXlMb2FkM2QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWQzZC5fdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cmxMaXN0OkFycmF5PHN0cmluZz47XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja09rOkxheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9ubG9hZDNkKHVybExpc3Q6QXJyYXk8c3RyaW5nPixjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciBfdXJsTGlzdD1bXTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybD11cmxMaXN0W2ldO1xyXG4gICAgICAgICAgICB1cmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeCh1cmwpO1xyXG4gICAgICAgICAgICBfdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIC8vIG9ialtcInVybFwiXSs9XCI/d215XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwbnVtPTA7XHJcbiAgICAgICAgdmFyIHBOdW09MDtcclxuICAgICAgICB2YXIgaXNQPWZhbHNlO1xyXG4gICAgICAgIHZhciBfUHJvZ3Jlc3M9KHApPT57XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHApO1xyXG4gICAgICAgICAgICBwbnVtKz0wLjAxO1xyXG4gICAgICAgICAgICAvLyBpZihpc1Ape1xyXG4gICAgICAgICAgICAvLyAgICAgcE51bSA9IHBudW0rKHApKjAuOTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBlbHNle1xyXG4gICAgICAgICAgICAvLyAgICAgcE51bSA9IHBudW07XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gaWYocG51bT49MC4xIHx8IHA9PTEpe1xyXG4gICAgICAgICAgICAvLyAgICAgaXNQPXRydWU7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgaWYocG51bT4xKXBudW09MTtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BudW1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgX29uT2s9KCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExheWEubG9hZGVyLmNyZWF0ZShfdXJsTGlzdCxuZXcgTGF5YS5IYW5kbGVyKG51bGwsX29uT2spLExheWEuSGFuZGxlci5jcmVhdGUobnVsbCxfUHJvZ3Jlc3MsbnVsbCxmYWxzZSkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBfbUFycjpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgcHJpdmF0ZSBfbU51bT0wO1xyXG4gICAgcHJpdmF0ZSBfbVA9MDtcclxuICAgIHByaXZhdGUgX21QMj0wO1xyXG5cclxuICAgIHByaXZhdGUgX19vbmxzVXJsQXJyT2sobHNVcmxBcnI6QXJyYXk8c3RyaW5nPil7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxsc1VybEFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1sc1VybEFycltpXTtcclxuICAgICAgICAgICAgdmFyIHVybD1vYmpbXCJ1cmxcIl07XHJcbiAgICAgICAgICAgIHZhciBzMD11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICB2YXIgczE9dXJsLnJlcGxhY2UoczBbczAubGVuZ3RoLTFdLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgcm9vdFVybD1zMTtcclxuICAgICAgICAgICAgdmFyIHR4dD1MYXlhLmxvYWRlci5nZXRSZXModXJsKTtcclxuICAgICAgICAgICAgdmFyIGpzT2JqPUpTT04ucGFyc2UodHh0KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX190aVF1VXJsKGpzT2JqW1wiZGF0YVwiXSxyb290VXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5fbUFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMuX21BcnJbaV07XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkFyck9rKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uQXJyUCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25BcnJQKHApe1xyXG4gICAgICAgIHZhciBwTnVtPXAqKHRoaXMuX21OdW0rMSk7XHJcbiAgICAgICAgaWYocE51bT50aGlzLl9tUCl0aGlzLl9tUD1wTnVtO1xyXG4gICAgICAgIHRoaXMuX21QMj0odGhpcy5fbVAvdGhpcy5fbUFyci5sZW5ndGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBwTnVtPSh0aGlzLl9tUDIpKjAuOTg7XHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcE51bV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgX19vbkFyck9rKCl7XHJcbiAgICAgICAgdGhpcy5fbU51bSs9MTtcclxuICAgICAgICBpZih0aGlzLl9tTnVtPj10aGlzLl9tQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh0aGlzLl91cmxMaXN0LExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fdGlRdVVybChvYmosdXJsOnN0cmluZz1cIlwiKXtcclxuICAgICAgICBpZihvYmpbXCJwcm9wc1wiXSE9bnVsbCAmJiBvYmpbXCJwcm9wc1wiXVtcIm1lc2hQYXRoXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIG1lc2hQYXRoPXVybCtvYmpbXCJwcm9wc1wiXVtcIm1lc2hQYXRoXCJdO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YobWVzaFBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKG1lc2hQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxzOkFycmF5PGFueT49b2JqW1wicHJvcHNcIl1bXCJtYXRlcmlhbHNcIl07XHJcbiAgICAgICAgICAgIGlmKG1hdGVyaWFscyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGlpPTA7aWk8bWF0ZXJpYWxzLmxlbmd0aDtpaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aD11cmwrbWF0ZXJpYWxzW2lpXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKHBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2gocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9ialtcImNvbXBvbmVudHNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgY29tcG9uZW50czpBcnJheTxhbnk+PW9ialtcImNvbXBvbmVudHNcIl07XHJcbiAgICAgICAgICAgIGlmKGNvbXBvbmVudHMubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTAgPSAwOyBpMCA8IGNvbXBvbmVudHMubGVuZ3RoOyBpMCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBjb21wb25lbnRzW2kwXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihjb21wW1wiYXZhdGFyXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFwYXRoPXVybCtjb21wW1wiYXZhdGFyXCJdW1wicGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGFwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChhcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImxheWVyc1wiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcnM6QXJyYXk8YW55Pj1jb21wW1wibGF5ZXJzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpMSA9IDA7IGkxIDwgbGF5ZXJzLmxlbmd0aDsgaTErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheWVyID0gbGF5ZXJzW2kxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZXM6QXJyYXk8YW55Pj1sYXllcltcInN0YXRlc1wiXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IHN0YXRlcy5sZW5ndGg7IGkyKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbaTJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGlwUGF0aD11cmwrc3RhdGVbXCJjbGlwUGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YoY2xpcFBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goY2xpcFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY2hpbGQ6QXJyYXk8YW55Pj1vYmpbXCJjaGlsZFwiXTtcclxuICAgICAgICBpZihjaGlsZCE9bnVsbCAmJiBjaGlsZC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8Y2hpbGQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fdGlRdVVybChjaGlsZFtpXSx1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJleHBvcnQgY2xhc3MgV215TG9hZE1hdHN7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlMb2FkTWF0c3tcclxuICAgICAgICBpZihXbXlMb2FkTWF0cy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWRNYXRzLl90aGlzPW5ldyBXbXlMb2FkTWF0cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215TG9hZE1hdHMuX3RoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbmxvYWQzZCh1cmxMaXN0OkFycmF5PHN0cmluZz4sY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uVXJsQXJyT2ssW3VybExpc3RdKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21hdHNVcmxBcnI6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgIHByaXZhdGUgX21hdE9rPWZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfbWF0TnVtPTA7XHJcbiAgICBwcml2YXRlIF9tYXRQPTA7XHJcbiAgICBwcml2YXRlIF9tYXRQMj0wO1xyXG5cclxuICAgIHByaXZhdGUgX19vblVybEFyck9rKHVybExpc3Q6QXJyYXk8c3RyaW5nPil7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx1cmxMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgdXJsPXVybExpc3RbaV07XHJcbiAgICAgICAgICAgIC8vIHZhciB0eHQ9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcbiAgICAgICAgICAgIC8vIHZhciBqc09iaj1KU09OLnBhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgIHZhciBqc09iaj1MYXlhLmxvYWRlci5nZXRSZXModXJsKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhcnI9dXJsLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgdmFyIG1hdHNVcmw9dXJsLnJlcGxhY2UoYXJyW2Fyci5sZW5ndGgtMV0sXCJcIik7XHJcbiAgICAgICAgICAgIHZhciBhcnJheTpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXk9anNPYmpbXCJtYXRzXCJdO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJyYXkubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBhcnJheVtqXTtcclxuICAgICAgICAgICAgICAgIGlmKG9ialtcInRhcmdldE5hbWVcIl09PVwiXCIpY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0VXJsPW1hdHNVcmwrb2JqW1wibWF0VXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0c1VybEFyci5wdXNoKG1hdFVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5fbWF0c1VybEFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMuX21hdHNVcmxBcnJbaV07XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyck9rKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTWF0QXJyUCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25NYXRBcnJQKHApe1xyXG4gICAgICAgIHZhciBwTnVtPXAqKHRoaXMuX21hdE51bSsxKTtcclxuICAgICAgICBpZihwTnVtPnRoaXMuX21hdFApdGhpcy5fbWF0UD1wTnVtO1xyXG4gICAgICAgIHRoaXMuX21hdFAyPSh0aGlzLl9tYXRQL3RoaXMuX21hdHNVcmxBcnIubGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFt0aGlzLl9tYXRQMl0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25NYXRBcnJPaygpe1xyXG4gICAgICAgIHRoaXMuX21hdE51bSs9MTtcclxuICAgICAgICBpZih0aGlzLl9tYXROdW0+PXRoaXMuX21hdHNVcmxBcnIubGVuZ3RoKXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxuZXhwb3J0IGNsYXNzIFdteVNoYWRlck1zZ3tcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtXHR0YXJnZXRcdOWvueixoVxyXG4gICAgICogQHBhcmFtXHRtYXRcdOadkOi0qFxyXG4gICAgICogQHBhcmFtXHRzaGFkZXJVcmxcdHNoYWRlcueahOWcsOWdgFxyXG4gICAgICogQHBhcmFtXHRpc05ld01hdGVyaWFcdOaYr+WQpuaWsOadkOi0qFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFNoYWRlcih0YXJnZXQsIG1hdDpMYXlhLkJhc2VNYXRlcmlhbCwgc2hhZGVyVXJsOnN0cmluZywgaXNOZXdNYXRlcmlhPWZhbHNlLCBwRGF0YT86YW55KTpMYXlhLkJhc2VNYXRlcmlhbHtcclxuICAgICAgICB2YXIgcmVuZGVyZXI6TGF5YS5CYXNlUmVuZGVyO1xyXG4gICAgICAgIHZhciBzaGFyZWRNYXRlcmlhbDogTGF5YS5CYXNlTWF0ZXJpYWw7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgcmVuZGVyZXI9KHRhcmdldCBhcyBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0QpLnNraW5uZWRNZXNoUmVuZGVyZXI7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyPT1udWxsKXJldHVybjtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9cmVuZGVyZXIuc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPSh0YXJnZXQgYXMgTGF5YS5NZXNoU3ByaXRlM0QpLm1lc2hSZW5kZXJlcjtcclxuICAgICAgICAgICAgaWYocmVuZGVyZXI9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgICAgICBzaGFyZWRNYXRlcmlhbD1yZW5kZXJlci5zaGFyZWRNYXRlcmlhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoaXNOZXdNYXRlcmlhKXtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9c2hhcmVkTWF0ZXJpYWwuY2xvbmUoKTtcclxuICAgICAgICAgICAgcmVuZGVyZXIuc2hhcmVkTWF0ZXJpYWw9c2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG5cdFx0Zm9yKHZhciBrZXkgaW4gbWF0KXtcclxuXHRcdFx0dHJ5IHtcclxuICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsW2tleV09bWF0W2tleV07XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHNoYWRlclVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5zaGFkZXJDb25tcGxldGUsW3NoYXJlZE1hdGVyaWFsLHBEYXRhXSkpO1xyXG4gICAgICAgIHJldHVybiBzaGFyZWRNYXRlcmlhbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzaGFkZXJDb25tcGxldGUoc2hhcmVkTWF0ZXJpYWw6TGF5YS5CYXNlTWF0ZXJpYWwsIHBEYXRhOmFueSwgZGF0YSl7XHJcbiAgICAgICAgaWYoZGF0YT09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIHhtbD1udWxsXHJcbiAgICAgICAgdHJ5XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4bWwgPSBMYXlhLlV0aWxzLnBhcnNlWE1MRnJvbVN0cmluZyhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB4bWxOb2RlOk5vZGUgPSB4bWwuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICAgIHZhciBzaGFkZXJOYW1lPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKHhtbE5vZGUsXCJuYW1lXCIpO1xyXG5cclxuICAgICAgICB2YXIgaSxvLG9OYW1lLHYwLHYxLGluaXRWO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVNYXA9e307XHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU1hcE5vZGU9dGhpcy5nZXROb2RlKHhtbE5vZGUsXCJhdHRyaWJ1dGVNYXBcIik7XHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU1hcEFycj10aGlzLmdldE5vZGVBcnIoYXR0cmlidXRlTWFwTm9kZSxcImRhdGFcIik7XHJcbiAgICAgICAgZm9yKGk9MDtpPGF0dHJpYnV0ZU1hcEFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbyA9IGF0dHJpYnV0ZU1hcEFycltpXTtcclxuICAgICAgICAgICAgb05hbWU9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcIm5hbWVcIik7XHJcbiAgICAgICAgICAgIHYwPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJ2MFwiKTtcclxuICAgICAgICAgICAgYXR0cmlidXRlTWFwW29OYW1lXT10aGlzLmdldFYodjAsXCJpbnRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdW5pZm9ybU1hcD17fTtcclxuICAgICAgICB2YXIgdW5pZm9ybU1hcE5vZGU9dGhpcy5nZXROb2RlKHhtbE5vZGUsXCJ1bmlmb3JtTWFwXCIpO1xyXG4gICAgICAgIHZhciB1bmlmb3JtTWFwQXJyPXRoaXMuZ2V0Tm9kZUFycih1bmlmb3JtTWFwTm9kZSxcImRhdGFcIik7XHJcblxyXG4gICAgICAgIHZhciB3bXlWYWx1ZXM9c2hhcmVkTWF0ZXJpYWxbXCJ3bXlWYWx1ZXNcIl07XHJcbiAgICAgICAgaWYod215VmFsdWVzIT1udWxsICYmIHdteVZhbHVlc1tcImN1YmVcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgY3ViZU5hbWU9d215VmFsdWVzW1wiY3ViZVwiXTtcclxuICAgICAgICAgICAgaWYocERhdGEhPW51bGwgJiYgcERhdGFbXCJjdWJlRnVuXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHBEYXRhW1wiY3ViZUZ1blwiXShzaGFyZWRNYXRlcmlhbCxjdWJlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGk9MDtpPHVuaWZvcm1NYXBBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGluaXRWPW51bGw7XHJcbiAgICAgICAgICAgIG8gPSB1bmlmb3JtTWFwQXJyW2ldO1xyXG4gICAgICAgICAgICBvTmFtZT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwibmFtZVwiKTtcclxuICAgICAgICAgICAgdjA9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcInYwXCIpO1xyXG4gICAgICAgICAgICB2MT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwidjFcIik7XHJcbiAgICAgICAgICAgIHZhciB2QXJyPVtdO1xyXG4gICAgICAgICAgICB2QXJyWzBdPXRoaXMuZ2V0Vih2MCxcImludFwiKTtcclxuICAgICAgICAgICAgdkFyclsxXT10aGlzLmdldFYodjEsXCJpbnRcIik7XHJcbiAgICAgICAgICAgIHVuaWZvcm1NYXBbb05hbWVdPXZBcnI7XHJcblxyXG4gICAgICAgICAgICBpZih3bXlWYWx1ZXMhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgaW5pdFY9d215VmFsdWVzW29OYW1lXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9pbml0Vj10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwiaW5pdFZcIik7XHJcbiAgICAgICAgICAgIGlmKGluaXRWIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGluaXRWID0gaW5pdFYuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoaW5pdFYubGVuZ3RoPT00KXtcclxuICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKHZBcnJbMF0sbmV3IExheWEuVmVjdG9yNChwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSxwYXJzZUZsb2F0KGluaXRWWzJdKSxwYXJzZUZsb2F0KGluaXRWWzNdKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTMpe1xyXG4gICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IodkFyclswXSxuZXcgTGF5YS5WZWN0b3IzKHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pLHBhcnNlRmxvYXQoaW5pdFZbMl0pKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09Mil7XHJcbiAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcih2QXJyWzBdLG5ldyBMYXlhLlZlY3RvcjIocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0xKXtcclxuICAgICAgICAgICAgICAgICAgICBpZighaXNOYU4ocGFyc2VGbG9hdChpbml0VlswXSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXROdW1iZXIodkFyclswXSxwYXJzZUZsb2F0KGluaXRWWzBdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJPYmo9aW5pdFZbMF0rXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3RyT2JqPT1cInRleFwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXg6TGF5YS5CYXNlVGV4dHVyZT1zaGFyZWRNYXRlcmlhbFtvTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFRleHR1cmUodkFyclswXSx0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc3ByaXRlRGVmaW5lcz1MYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Quc2hhZGVyRGVmaW5lcztcclxuICAgICAgICB2YXIgbWF0ZXJpYWxEZWZpbmVzPUxheWEuQmxpbm5QaG9uZ01hdGVyaWFsLnNoYWRlckRlZmluZXM7XHJcbiAgICAgICAgaWYocERhdGEhPW51bGwpe1xyXG4gICAgICAgICAgICBpZihwRGF0YVtcInNwcml0ZURlZmluZXNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlRGVmaW5lcz1wRGF0YVtcInNwcml0ZURlZmluZXNcIl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocERhdGFbXCJtYXRlcmlhbERlZmluZXNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxEZWZpbmVzPXBEYXRhW1wibWF0ZXJpYWxEZWZpbmVzXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2hhZGVyPUxheWEuU2hhZGVyM0QuYWRkKHNoYWRlck5hbWUsYXR0cmlidXRlTWFwLHVuaWZvcm1NYXAsc3ByaXRlRGVmaW5lcyxtYXRlcmlhbERlZmluZXMpO1xyXG5cclxuICAgICAgICB2YXIgU3ViU2hhZGVyTm9kZT10aGlzLmdldE5vZGUoeG1sTm9kZSxcIlN1YlNoYWRlclwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlbmRlck1vZGVOb2RlPXRoaXMuZ2V0Tm9kZSh4bWxOb2RlLFwicmVuZGVyTW9kZVwiKTtcclxuICAgICAgICBpZihyZW5kZXJNb2RlTm9kZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXJNb2RlPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKHJlbmRlck1vZGVOb2RlLFwidlwiKTtcclxuICAgICAgICAgICAgaWYocmVuZGVyTW9kZSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbFtcInJlbmRlck1vZGVcIl09dGhpcy5nZXRWKHJlbmRlck1vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgUGFzc0Fycj10aGlzLmdldE5vZGVBcnIoU3ViU2hhZGVyTm9kZSxcIlBhc3NcIik7XHJcbiAgICAgICAgZm9yKGk9MDtpPFBhc3NBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBwYXNzID0gUGFzc0FycltpXTtcclxuICAgICAgICAgICAgdmFyIHZzTm9kZTpOb2RlPXRoaXMuZ2V0Tm9kZShwYXNzLFwiVkVSVEVYXCIpO1xyXG4gICAgICAgICAgICB2YXIgdnM6c3RyaW5nPXZzTm9kZS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgdnMgPSB2cy5yZXBsYWNlKC8oXFxyKS9nLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgcHNOb2RlOk5vZGU9dGhpcy5nZXROb2RlKHBhc3MsXCJGUkFHTUVOVFwiKTtcclxuICAgICAgICAgICAgdmFyIHBzOnN0cmluZz1wc05vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIHBzID0gcHMucmVwbGFjZSgvKFxccikvZyxcIlwiKTtcclxuICAgICAgICAgICAgaWYoaT4wKXtcclxuICAgICAgICAgICAgICAgIHZhciByczpMYXlhLlJlbmRlclN0YXRlPSBzaGFyZWRNYXRlcmlhbC5nZXRSZW5kZXJTdGF0ZSgwKS5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3JlbmRlclN0YXRlcy5wdXNoKHJzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGN1bGxOb2RlPXRoaXMuZ2V0Tm9kZShwYXNzLFwiY3VsbFwiKTtcclxuICAgICAgICAgICAgaWYoY3VsbE5vZGUhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1bGw9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUoY3VsbE5vZGUsXCJ2XCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoY3VsbCE9bnVsbCB8fCBjdWxsIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5nZXRSZW5kZXJTdGF0ZShpKS5jdWxsPXRoaXMuZ2V0VihjdWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2hhZGVyLmFkZFNoYWRlclBhc3ModnMscHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlcj1zaGFkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRWKG9iajphbnksYmFja1R5cGU9XCJudWxsXCIpOmFueXtcclxuICAgICAgICB2YXIgdGVtcE5hbWVBcnIsdGVtcE9iaix0ZW1wVixpaTtcclxuICAgICAgICB0ZW1wTmFtZUFycj1vYmouc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgIGlmKHRlbXBOYW1lQXJyWzBdPT09XCJMYXlhXCIpe1xyXG4gICAgICAgICAgICB0ZW1wVj1MYXlhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRlbXBOYW1lQXJyWzBdPT09XCJsYXlhXCIpe1xyXG4gICAgICAgICAgICB0ZW1wVj1sYXlhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoaWk9MTtpaTx0ZW1wTmFtZUFyci5sZW5ndGg7aWkrKyl7XHJcbiAgICAgICAgICAgIHRlbXBWPXRlbXBWW3RlbXBOYW1lQXJyW2lpXV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRlbXBWIT1udWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRlbXBWO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGJhY2tUeXBlIT1cIm51bGxcIil7XHJcbiAgICAgICAgICAgIGlmKGJhY2tUeXBlPT1cImludFwiKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYSBzdHJpbmcgaW4gdGhlIGZvcm1hdCBcIiNycmdnYmJcIiBvciBcInJyZ2diYlwiIHRvIHRoZSBjb3JyZXNwb25kaW5nXHJcbiAgICAgKiB1aW50IHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgVGhlIGNvbG9yIGluIHN0cmluZyBmb3JtYXQuXHJcbiAgICAgKiBAcmV0dXJuIFRoZSBjb2xvciBpbiB1aW50IGZvcm1hdC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29sb3JTdHJpbmdUb1VpbnQoY29sb3I6U3RyaW5nKTpudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXIoXCIweFwiICsgY29sb3IucmVwbGFjZShcIiNcIiwgXCJcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEF0dHJpYnV0ZXNWYWx1ZShub2RlOmFueSxrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgbm9kZVZhbHVlPW51bGw7XHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXM9bm9kZVtcImF0dHJpYnV0ZXNcIl07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBhdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgICAgICBpZihlbGVtZW50Lm5hbWU9PWtleSl7XHJcbiAgICAgICAgICAgICAgICBub2RlVmFsdWU9ZWxlbWVudFtcIm5vZGVWYWx1ZVwiXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Tm9kZSh4bWw6YW55LGtleTpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBjaGlsZE5vZGVzPXhtbC5jaGlsZE5vZGVzO1xyXG4gICAgICAgIHZhciBub2RlOmFueT1udWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgb2JqOmFueT1jaGlsZE5vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZihvYmpbXCJub2RlTmFtZVwiXT09a2V5KXtcclxuICAgICAgICAgICAgICAgIG5vZGU9b2JqO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXROb2RlQXJyKHhtbDphbnksa2V5OnN0cmluZyk6QXJyYXk8Tm9kZT57XHJcbiAgICAgICAgdmFyIGNoaWxkTm9kZXM9eG1sLmNoaWxkTm9kZXM7XHJcbiAgICAgICAgdmFyIG5vZGVBcnI6QXJyYXk8Tm9kZT49W107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmo6YW55PWNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgIGlmKG9ialtcIm5vZGVOYW1lXCJdPT1rZXkpe1xyXG4gICAgICAgICAgICAgICAgbm9kZUFyci5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGVBcnI7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgV215X0xvYWRfTWFnIH0gZnJvbSBcIi4uL1dteV9Mb2FkX01hZ1wiO1xyXG5pbXBvcnQgeyBXbXlTaGFkZXJNc2cgfSBmcm9tIFwiLi9XbXlTaGFkZXJNc2dcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlVdGlsczNEe1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmozZCh0YXJnZXQsb2JqTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQubmFtZT09b2JqTmFtZSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgaWYgKG8uX2NoaWxkcmVuLmxlbmd0aCA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihvLm5hbWU9PW9iak5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcE9iaj10aGlzLmdldE9iajNkKG8sb2JqTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wT2JqIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcE9iajtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRDaGlsZHJlbkNvbXBvbmVudCh0YXJnZXQsY2xhczphbnksYXJyPyk6QXJyYXk8YW55PntcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYXJyPT1udWxsKWFycj1bXTtcclxuXHJcbiAgICAgICAgdmFyIG9iaj10YXJnZXQuZ2V0Q29tcG9uZW50KGNsYXMpO1xyXG4gICAgICAgIGlmKG9iaj09bnVsbCl7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIGNsYXMpe1xyXG4gICAgICAgICAgICAgICAgb2JqPXRhcmdldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmohPW51bGwpe1xyXG4gICAgICAgICAgICBhcnIucHVzaChvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvOkxheWEuU3ByaXRlM0QgPSB0YXJnZXQuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmdldENoaWxkcmVuQ29tcG9uZW50KG8sY2xhcyxhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0U2hhZGVyQWxsKHRhcmdldCxtYXRzVXJsOnN0cmluZywgc2hhZGVyc1VybDpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBuZXdNYXRzVXJsPW1hdHNVcmwrXCJ3bXlNYXRzLmpzb25cIjtcclxuICAgICAgICB2YXIgbmV3U2hhZGVyc1VybD1zaGFkZXJzVXJsO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQobmV3TWF0c1VybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKG1hdHNVcmwsc2hhZGVyc1VybCxkYXRhKT0+e1xyXG4gICAgICAgICAgICBpZihkYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIndteU1hdHMt5Ye66ZSZOlwiLG5ld01hdHNVcmwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBhcnJheTpBcnJheTxhbnk+PWRhdGFbXCJtYXRzXCJdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJyYXlbaV07XHJcbiAgICAgICAgICAgICAgICBpZihvYmpbXCJ0YXJnZXROYW1lXCJdPT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldDNEPVdteVV0aWxzM0QuZ2V0T2JqM2QodGFyZ2V0LG9ialtcInRhcmdldE5hbWVcIl0pYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICAgICAgICAgIGlmKHRhcmdldDNEPT1udWxsKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hdFVybD1tYXRzVXJsK29ialtcIm1hdFVybFwiXTtcclxuICAgICAgICAgICAgICAgIHZhciBzaGFkZXJOYW1lVXJsPXNoYWRlcnNVcmwrb2JqW1wic2hhZGVyTmFtZVwiXStcIi50eHRcIjtcclxuICAgICAgICAgICAgICAgIExheWEuQmFzZU1hdGVyaWFsLmxvYWQobWF0VXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoX3RhcmdldDNEOkxheWEuU3ByaXRlM0QsX3NoYWRlck5hbWVVcmwsbSk9PntcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcERhdGE9e307XHJcbiAgICAgICAgICAgICAgICAgICAgcERhdGFbXCJjdWJlRnVuXCJdPShtLGN1YmVOYW1lKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBXbXlfTG9hZF9NYWcuZ2V0VGhpcy5nZXRDdWJlKGN1YmVOYW1lLG5ldyBMYXlhLkhhbmRsZXIodGhpcywoY3ViZSxpKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaT09MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldFRleHR1cmUoTGF5YS5TY2VuZTNELlJFRkxFQ1RJT05URVhUVVJFLGN1YmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFdteVNoYWRlck1zZy5zZXRTaGFkZXIoX3RhcmdldDNELG0sX3NoYWRlck5hbWVVcmwsZmFsc2UscERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKF90YXJnZXQzRCE9bnVsbCAmJiBfdGFyZ2V0M0QucGFyZW50IT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RhcmdldDNELnBhcmVudC5yZW1vdmVDaGlsZChfdGFyZ2V0M0QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sW3RhcmdldDNELHNoYWRlck5hbWVVcmxdKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sW21hdHNVcmwsbmV3U2hhZGVyc1VybF0pLG51bGwsTGF5YS5Mb2FkZXIuSlNPTik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmlQbGF5KHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUpOkxheWEuQW5pbWF0b3J7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIHRhcmdldDNkX2FuaS5wbGF5KGFuaU5hbWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGFyZ2V0M2RfYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvblNoYWRvdyhkaXJlY3Rpb25MaWdodDpMYXlhLkRpcmVjdGlvbkxpZ2h0LHNoYWRvd1Jlc29sdXRpb249NTEyLHNoYWRvd1BDRlR5cGU9MSxzaGFkb3dEaXN0YW5jZTpudW1iZXI9MTAwLGlzU2hhZG93OmJvb2xlYW49dHJ1ZSl7XHJcbiAgICAgICAgLy/nga/lhYnlvIDlkK/pmLTlvbFcclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAvL+WPr+ingemYtOW9sei3neemu1xyXG4gICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd0Rpc3RhbmNlID0gc2hhZG93RGlzdGFuY2U7XHJcbiAgICAgICAgLy/nlJ/miJDpmLTlvbHotLTlm77lsLrlr7hcclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dSZXNvbHV0aW9uID0gc2hhZG93UmVzb2x1dGlvbjtcclxuICAgICAgICAvL2RpcmVjdGlvbkxpZ2h0LnNoYWRvd1BTU01Db3VudD0xO1xyXG4gICAgICAgIC8v5qih57OK562J57qnLOi2iuWkp+i2iumrmCzmm7TogJfmgKfog71cclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dQQ0ZUeXBlID0gc2hhZG93UENGVHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25DYXN0U2hhZG93KHRhcmdldCx0eXBlPTAsaXNTaGFkb3c9dHJ1ZSxpc0NoaWxkcmVuPXRydWUpe1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgdmFyIG1zM0Q9KHRhcmdldCBhcyBMYXlhLk1lc2hTcHJpdGUzRCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGU9PTApe1xyXG4gICAgICAgICAgICAgICAgLy/mjqXmlLbpmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHR5cGU9PTEpe1xyXG4gICAgICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLmNhc3RTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHR5cGU9PTIpe1xyXG4gICAgICAgICAgICAgICAgLy/mjqXmlLbpmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgdmFyIHNtczNkPSh0YXJnZXQgYXMgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKTtcclxuICAgICAgICAgICAgaWYodHlwZT09MCl7XHJcbiAgICAgICAgICAgICAgICBzbXMzZC5za2lubmVkTWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHR5cGU9PTEpe1xyXG4gICAgICAgICAgICAgICAgc21zM2Quc2tpbm5lZE1lc2hSZW5kZXJlci5jYXN0U2hhZG93PWlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihpc0NoaWxkcmVuKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubnVtQ2hpbGRyZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHRhcmdldC5nZXRDaGlsZEF0KGkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNhc3RTaGFkb3cob2JqLHR5cGUsaXNTaGFkb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJnYjJoZXgocixnLGIpe1xyXG4gICAgICAgIHZhciBfaGV4PVwiI1wiICsgdGhpcy5oZXgocikgK3RoaXMuIGhleChnKSArIHRoaXMuaGV4KGIpO1xyXG4gICAgICAgIHJldHVybiBfaGV4LnRvVXBwZXJDYXNlKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZXgoeCl7XHJcbiAgICAgICAgeD10aGlzLm9uTnVtVG8oeCk7XHJcbiAgICAgICAgcmV0dXJuIChcIjBcIiArIHBhcnNlSW50KHgpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTnVtVG8obil7XHJcblx0XHRpZigobitcIlwiKS5pbmRleE9mKFwiLlwiKT49MCl7XHJcblx0XHQgICAgbj1wYXJzZUZsb2F0KG4udG9GaXhlZCgyKSk7XHJcbiAgICAgICAgfVxyXG5cdFx0cmV0dXJuIG47XHJcblx0fVxyXG5cclxuICAgIFxyXG4gICBwdWJsaWMgc3RhdGljIGxlcnBGKGE6bnVtYmVyLCBiOm51bWJlciwgczpudW1iZXIpOm51bWJlcntcclxuICAgICAgICByZXR1cm4gKGEgKyAoYiAtIGEpICogcyk7XHJcbiAgICB9XHJcblxyXG59Il19
