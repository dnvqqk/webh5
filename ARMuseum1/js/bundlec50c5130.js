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
        Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
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
        WmyTar_1.default.getThis.init(new Laya.Handler(this, this.onInit));
    }
    Main.prototype.onInit = function () {
        Laya.stage.on("tar_render", this, this.onaaa);
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        var wmyVTime = "";
        if (window != null && window["wmyVTime"] != null) {
            wmyVTime = window["wmyVTime"];
        }
        //Laya.ResourceVersion.enable("version.json"+wmyVTime, Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    };
    Main.prototype.onaaa = function (t) {
        console.log(t);
        // var LayaEngine=window["LayaEngine"];
        // var texture=LayaEngine["texture"];
        // console.log(texture);
        // //添加3D场景
        // var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        // //添加照相机
        // var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        // camera.transform.translate(new Laya.Vector3(0, 3, 3));
        // camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        // //添加方向光
        // var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        // directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        // directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        // //添加自定义模型
        // var box: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(1, 1, 1))) as Laya.MeshSprite3D;
        // box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        // var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        // material.albedoTexture = texture;
        // box.meshRenderer.material = material;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIvTGF5YUFpciBJREUgMi4wLjAgYmV0YTIvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDb25maWcudHMiLCJzcmMvTWFpbi50cyIsInNyYy90YXIvV215VGFyLnRzIiwic3JjL3dteVV0aWxzSDUvV215VXRpbHMudHMiLCJzcmMvd215VXRpbHNINS9XbXlfTG9hZF9NYWcudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkM2QudHMiLCJzcmMvd215VXRpbHNINS9kMy9XbXlMb2FkTWF0cy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVNoYWRlck1zZy50cyIsInNyYy93bXlVdGlsc0g1L2QzL1dteVV0aWxzM0QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkE7O0VBRUU7QUFDRjtJQVdJO0lBQWMsQ0FBQztJQUNSLGVBQUksR0FBWDtJQUNBLENBQUM7SUFaTSxnQkFBSyxHQUFRLEdBQUcsQ0FBQztJQUNqQixpQkFBTSxHQUFRLElBQUksQ0FBQztJQUNuQixvQkFBUyxHQUFRLFlBQVksQ0FBQztJQUM5QixxQkFBVSxHQUFRLE1BQU0sQ0FBQztJQUN6QixxQkFBVSxHQUFRLEVBQUUsQ0FBQztJQUNyQixvQkFBUyxHQUFRLEVBQUUsQ0FBQztJQUNwQixnQkFBSyxHQUFTLEtBQUssQ0FBQztJQUNwQixlQUFJLEdBQVMsSUFBSSxDQUFDO0lBQ2xCLHVCQUFZLEdBQVMsS0FBSyxDQUFDO0lBQzNCLDRCQUFpQixHQUFTLElBQUksQ0FBQztJQUkxQyxpQkFBQztDQWRELEFBY0MsSUFBQTtrQkFkb0IsVUFBVTtBQWUvQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7QUNsQmxCLDJDQUFzQztBQUN0Qyx5REFBd0Q7QUFDeEQsMERBQXlEO0FBQ3pELHVDQUFrQztB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Y2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj02NDA7XHJcbiAgICBzdGF0aWMgaGVpZ2h0Om51bWJlcj0xMTM2O1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XHJcbiAgICBzdGF0aWMgc2NyZWVuTW9kZTpzdHJpbmc9XCJub25lXCI7XHJcbiAgICBzdGF0aWMgc3RhcnRTY2VuZTpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBzY2VuZVJvb3Q6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBzdGF0OmJvb2xlYW49dHJ1ZTtcclxuICAgIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe31cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICB9XHJcbn1cclxuR2FtZUNvbmZpZy5pbml0KCk7IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBXbXlVdGlsczNEIH0gZnJvbSBcIi4vd215VXRpbHNINS9kMy9XbXlVdGlsczNEXCI7XHJcbmltcG9ydCB7IFdteV9Mb2FkX01hZyB9IGZyb20gXCIuL3dteVV0aWxzSDUvV215X0xvYWRfTWFnXCI7XHJcbmltcG9ydCBXbXlUYXIgZnJvbSBcIi4vdGFyL1dteVRhclwiO1xyXG5jbGFzcyBNYWluIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdExheWEzRC5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0KTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHQvLyBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IExheWEuU3RhZ2UuU0NBTEVfU0hPV0FMTDtcclxuXHRcdC8vIExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcclxuICAgICAgICBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IExheWEuU3RhZ2UuU0NBTEVfRlVMTDtcclxuICAgICAgICBMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBMYXlhLlN0YWdlLlNDUkVFTl9OT05FO1xyXG5cdFx0TGF5YS5zdGFnZS5iZ0NvbG9yID0gJ25vbmUnO1xyXG5cdFx0XHJcblx0XHQvL+iuvue9ruawtOW5s+Wvuem9kFxyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25IID0gXCJjZW50ZXJcIjtcclxuXHRcdC8v6K6+572u5Z6C55u05a+56b2QXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnblYgPSBcIm1pZGRsZVwiO1xyXG5cdFx0Ly/lhbzlrrnlvq7kv6HkuI3mlK/mjIHliqDovb1zY2VuZeWQjue8gOWcuuaZr1xyXG5cdFx0TGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uO1xyXG5cclxuXHRcdC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxyXG5cdFx0aWYgKEdhbWVDb25maWcuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnBoeXNpY3NEZWJ1ZyAmJiBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXSkgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0uZW5hYmxlKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xyXG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcclxuXHRcdFdteVRhci5nZXRUaGlzLmluaXQobmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Jbml0KSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uSW5pdCgpe1xyXG5cdFx0TGF5YS5zdGFnZS5vbihcInRhcl9yZW5kZXJcIix0aGlzLHRoaXMub25hYWEpO1xyXG5cdFx0XHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0dmFyIHdteVZUaW1lPVwiXCI7XHJcblx0XHRpZih3aW5kb3chPW51bGwgJiYgd2luZG93W1wid215VlRpbWVcIl0hPW51bGwpe1xyXG5cdFx0XHR3bXlWVGltZT13aW5kb3dbXCJ3bXlWVGltZVwiXTtcclxuXHRcdH1cclxuXHRcdC8vTGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIrd215VlRpbWUsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uYWFhKHQpe1xyXG5cdFx0Y29uc29sZS5sb2codCk7XHJcblx0XHQvLyB2YXIgTGF5YUVuZ2luZT13aW5kb3dbXCJMYXlhRW5naW5lXCJdO1xyXG5cdFx0Ly8gdmFyIHRleHR1cmU9TGF5YUVuZ2luZVtcInRleHR1cmVcIl07XHJcblx0XHQvLyBjb25zb2xlLmxvZyh0ZXh0dXJlKTtcclxuXHRcdC8vIC8v5re75YqgM0TlnLrmma9cclxuICAgICAgICAvLyB2YXIgc2NlbmU6IExheWEuU2NlbmUzRCA9IExheWEuc3RhZ2UuYWRkQ2hpbGQobmV3IExheWEuU2NlbmUzRCgpKSBhcyBMYXlhLlNjZW5lM0Q7XHJcblxyXG4gICAgICAgIC8vIC8v5re75Yqg54Wn55u45py6XHJcbiAgICAgICAgLy8gdmFyIGNhbWVyYTogTGF5YS5DYW1lcmEgPSAoc2NlbmUuYWRkQ2hpbGQobmV3IExheWEuQ2FtZXJhKDAsIDAuMSwgMTAwKSkpIGFzIExheWEuQ2FtZXJhO1xyXG4gICAgICAgIC8vIGNhbWVyYS50cmFuc2Zvcm0udHJhbnNsYXRlKG5ldyBMYXlhLlZlY3RvcjMoMCwgMywgMykpO1xyXG4gICAgICAgIC8vIGNhbWVyYS50cmFuc2Zvcm0ucm90YXRlKG5ldyBMYXlhLlZlY3RvcjMoLTMwLCAwLCAwKSwgdHJ1ZSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAvLyAvL+a3u+WKoOaWueWQkeWFiVxyXG4gICAgICAgIC8vIHZhciBkaXJlY3Rpb25MaWdodDogTGF5YS5EaXJlY3Rpb25MaWdodCA9IHNjZW5lLmFkZENoaWxkKG5ldyBMYXlhLkRpcmVjdGlvbkxpZ2h0KCkpIGFzIExheWEuRGlyZWN0aW9uTGlnaHQ7XHJcbiAgICAgICAgLy8gZGlyZWN0aW9uTGlnaHQuY29sb3IgPSBuZXcgTGF5YS5WZWN0b3IzKDAuNiwgMC42LCAwLjYpO1xyXG4gICAgICAgIC8vIGRpcmVjdGlvbkxpZ2h0LnRyYW5zZm9ybS53b3JsZE1hdHJpeC5zZXRGb3J3YXJkKG5ldyBMYXlhLlZlY3RvcjMoMSwgLTEsIDApKTtcclxuXHJcbiAgICAgICAgLy8gLy/mt7vliqDoh6rlrprkuYnmqKHlnotcclxuICAgICAgICAvLyB2YXIgYm94OiBMYXlhLk1lc2hTcHJpdGUzRCA9IHNjZW5lLmFkZENoaWxkKG5ldyBMYXlhLk1lc2hTcHJpdGUzRChuZXcgTGF5YS5Cb3hNZXNoKDEsIDEsIDEpKSkgYXMgTGF5YS5NZXNoU3ByaXRlM0Q7XHJcbiAgICAgICAgLy8gYm94LnRyYW5zZm9ybS5yb3RhdGUobmV3IExheWEuVmVjdG9yMygwLCA0NSwgMCksIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgLy8gdmFyIG1hdGVyaWFsOiBMYXlhLkJsaW5uUGhvbmdNYXRlcmlhbCA9IG5ldyBMYXlhLkJsaW5uUGhvbmdNYXRlcmlhbCgpO1xyXG5cdFx0Ly8gbWF0ZXJpYWwuYWxiZWRvVGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgICAgICAgLy8gYm94Lm1lc2hSZW5kZXJlci5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG5cdH1cclxuXHJcblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZChmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QpO1xyXG5cdFx0dmFyIHVybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KFwicmVzL2xvYWRJbmZvLmpzb25cIik7XHJcbiAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMub25Mb2FkV2V0RGF0YSh1cmwsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZExvYWQpKTtcclxuXHR9XHJcblx0XHJcbiAgICBwcml2YXRlIG9uTG9hZExvYWQoKXtcclxuICAgICAgICB2YXIgcmVzT2JqPVdteV9Mb2FkX01hZy5nZXRUaGlzLmdldFJlc09iaihcImxvYWRcIik7XHJcbiAgICAgICAgaWYocmVzT2JqIT1udWxsKXtcclxuICAgICAgICAgICAgV215X0xvYWRfTWFnLmdldFRoaXMub25sb2FkKHJlc09iaixuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRNYWluKSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcbiAgICBwcml2YXRlIF9sb2FkVmlldzogZmFpcnlndWkuR0NvbXBvbmVudDtcclxuXHRwcml2YXRlIF9iYXI6ZmFpcnlndWkuR1Byb2dyZXNzQmFyO1xyXG5cdHByaXZhdGUgb25Mb2FkTWFpbigpe1xyXG5cdFx0dGhpcy5fbG9hZFZpZXc9ZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdChcImxvYWRcIixcIkxvYWRcIikuYXNDb207XHJcblx0XHRmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKHRoaXMuX2xvYWRWaWV3KTtcclxuXHRcdHRoaXMuX2Jhcj10aGlzLl9sb2FkVmlldy5nZXRDaGlsZChcImJhclwiKS5hc1Byb2dyZXNzO1xyXG5cclxuICAgICAgICBXbXlfTG9hZF9NYWcuZ2V0VGhpcy5vbkF1dG9Mb2FkQWxsKG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25Mb2FkaW5nKHByb2dyZXNzOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Jhci52YWx1ZT1wcm9ncmVzcztcclxuXHR9XHJcblx0XHJcbiAgICBwcml2YXRlIF91M2RBcnI7XHJcbiAgICBwdWJsaWMgc2NlbmUzRDpMYXlhLlNjZW5lM0Q7XHJcblx0cHJpdmF0ZSBvbkxvYWRPayh1aUFycix1M2RBcnIpe1xyXG5cdFx0dGhpcy5fdTNkQXJyPXUzZEFycjtcclxuXHRcdExheWEudGltZXIub25jZSg0MDAsdGhpcywgKCk9PntcclxuXHRcdFx0dGhpcy5vbk1haW4oKTtcclxuXHRcdFx0ZmFpcnlndWkuR1Jvb3QuaW5zdC5yZW1vdmVDaGlsZCh0aGlzLl9sb2FkVmlldyk7XHJcblx0XHRcdHRoaXMuX2xvYWRWaWV3PW51bGw7XHJcblx0XHRcdHRoaXMuX2Jhcj1udWxsO1xyXG5cdFx0fSk7XHJcblx0XHQvL+a3u+WKoDNE5Zy65pmvXHJcblx0XHRpZih1M2RBcnJbMF0hPW51bGwpe1xyXG5cdFx0XHR2YXIgdXJsM2Q9dTNkQXJyWzBdLnVybExpc3RbMF07XHJcblx0XHRcdHRoaXMuc2NlbmUzRCA9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybDNkKTtcclxuXHRcdFx0V215VXRpbHMzRC5zZXRTaGFkZXJBbGwodGhpcy5zY2VuZTNELFwicmVzL21hdHMvXCIsXCJyZXMvc2hhZGVycy9cIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG4gICAgcHJpdmF0ZSBfbWFpblZpZXc6IGZhaXJ5Z3VpLkdDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBvbk1haW4oKXtcclxuXHRcdHRoaXMuX21haW5WaWV3PWZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoXCJtYWluXCIsXCJNYWluXCIpLmFzQ29tO1xyXG5cdFx0aWYodGhpcy5fbWFpblZpZXchPW51bGwpe1xyXG5cdFx0XHRmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKHRoaXMuX21haW5WaWV3KTtcclxuXHRcdFx0dmFyIF9NYWluPXRoaXMuX21haW5WaWV3LmdldENoaWxkKFwiX01haW5cIikuYXNDb207XHJcblx0XHRcdHZhciBfZDM9X01haW4uZ2V0Q2hpbGQoXCJkM1wiKS5hc0NvbTtcclxuXHRcdFx0aWYodGhpcy5zY2VuZTNEIT1udWxsKXtcclxuXHRcdFx0XHRfZDMuZGlzcGxheU9iamVjdC5hZGRDaGlsZCh0aGlzLnNjZW5lM0QpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXbXlUYXJ7XHJcbiAgICBwcml2YXRlIF9lbmdpbmU6IFRBUi5FbmdpbmU7XHJcbiAgICBwcml2YXRlIF9hcjogVEFSLkFSO1xyXG4gICAgcHJpdmF0ZSBfcmVuZGVyOiBUQVIuUmVuZGVyO1xyXG4gICAgc3RhdGljIF90aGlzOldteVRhcjtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKXtcclxuICAgICAgICBpZihXbXlUYXIuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlUYXIuX3RoaXM9bmV3IFdteVRhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215VGFyLl90aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIF9jb21wbGV0ZTogTGF5YS5IYW5kbGVyO1xyXG4gICAgX0xheWFFbmdpbmU6YW55O1xyXG4gICAgX3RleHR1cmU6YW55O1xyXG4gICAgcHVibGljIGluaXQoY29tcGxldGU6TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB0aGlzLl9jb21wbGV0ZT1jb21wbGV0ZTtcclxuXHRcdHRoaXMuX3JlbmRlciA9IG5ldyBUQVIuUmVuZGVyKCk7XHJcblx0XHR0aGlzLl9hciA9IG5ldyBUQVIuQVIoKTtcclxuICAgICAgICB0aGlzLl9lbmdpbmUgPSBuZXcgVEFSLkVuZ2luZSgpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLl9MYXlhRW5naW5lPXdpbmRvd1tcIkxheWFFbmdpbmVcIl07XHJcbiAgICAgICAgLy8gaWYodGhpcy5fTGF5YUVuZ2luZSE9bnVsbCl7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuX3RleHR1cmU9dGhpcy5fTGF5YUVuZ2luZVtcInRleHR1cmVcIl07XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIC8qKlxyXG4gICAgICAgIC8vICAqIEFuZHJvaWTpgJrov4fkuLvlvqrnjq/nm5HmjqflubPpnaLlnZDmoIfnmoTlj5jljJbvvIzpnIDopoHkuLvliqjosIPnlKhvblRhclN0YXRlQ2hhbmdlZOWOu+aUueWPmOeKtuaAgVxyXG4gICAgICAgIC8vICAqIGlPU+W3sue7j+WwhuS6i+S7tuebkeWQrOWGmeWcqOS6hnRhci5qc+mHjOmdou+8jOeKtuaAgeiHquWKqOWIh+aNolxyXG4gICAgICAgIC8vICAqL1xyXG4gICAgICAgIC8vIGlmIChUQVIuRU5WLkFORFJPSUQpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5fcmVuZGVyLm9uKCdUQVJfU1RBVEVfQ0hBTkdFJywgKCkgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgY29uc3QgdnJEaXNwbGF5ID0gdGhpcy5fYXIuZ2V0VlJEaXNwbGF5KCk7XHJcbiAgICAgICAgLy8gICAgICAgICBpZiAodnJEaXNwbGF5ICYmIHRoaXMuX2FyLmlzRW5naW5lRG93bmxvYWQoKSkge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnN0IGZyYW1lRGF0YSA9IG5ldyB3aW5kb3dbXCJWUkZyYW1lRGF0YVwiXSgpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIHZyRGlzcGxheS5nZXRGcmFtZURhdGEoZnJhbWVEYXRhKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICBjb25zdCBbeCwgeSwgel0gPSBmcmFtZURhdGEucG9zZS5wb3NpdGlvbjtcclxuICAgICAgICAvLyAgICAgICAgICAgICBpZiAoeCA9PT0gMCAmJiAgeSA9PT0gMCAmJiB6ID09PSAwKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuX2FyLm9uVGFyU3RhdGVDaGFuZ2VkKCdsaW1pdGVkJyk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5fYXIub25UYXJTdGF0ZUNoYW5nZWQoJ25vcm1hbCcpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyAvLyB0cmlnZ2VyIGNhbWVyYSBwb3NpdGlvbiBjaGFuZ2UgZXZlcnkgZnJhbWVcclxuICAgICAgICAvLyB0aGlzLl9yZW5kZXIub24oJ0NBTUVSQV9UUkFOU0ZPUk1fQ0hBTkdFJywgKCkgPT4ge1xyXG4gICAgICAgIC8vICAgICBjb25zdCB2ckRpc3BsYXkgPSAgdGhpcy5fYXIuZ2V0VlJEaXNwbGF5KCk7XHJcbiAgICAgICAgLy8gICAgIC8vIOmcgOimgeiOt+WPluWIsHZyRGlzcGxheeWvueixoeW5tuS4lGFy5byV5pOO5LiL5a6M5oiQ5omN6IO95YGa5Lia5Yqh6YC76L6RXHJcbiAgICAgICAgLy8gICAgIGlmICh2ckRpc3BsYXkgJiYgIHRoaXMuX2FyLmlzRW5naW5lRG93bmxvYWQoKSkge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5fZW5naW5lLm9uQ2FtZXJhVHJhbnNmb3JtQ2hhbmdlKCk7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9KTtcclxuXHJcblxyXG5cdFx0Ly8gcmVuZGVy5Yid5aeL5YyW77yM6L+Q6KGM5Li75b6q546vXHJcblx0XHR0aGlzLl9yZW5kZXIuaW5pdCgpO1xyXG5cdFx0aWYgKFRBUi5FTlYuSU9TKSB7XHJcblx0XHRcdHRoaXMuQVJJbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFRBUi5FTlYuQU5EUk9JRCkge1xyXG4gICAgICAgICAgICAvLyBhbmRyb2lkIEFS55qE6IO95Yqb6ZyA6KaB5LiL6L295omN5pyJXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTVEFUVVNfQ0hBTkdF5pa55rOV5rOo5YaMNOS4quS4juW8leaTjueKtuaAgeebuOWFs+eahGNhbGxiYWNr5Ye95pWwc3RhcnQsIGxvYWRpbmcsIHN1Y2Nlc3MsIGZhaWxcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFRBUi5UQVJVdGlscy5TVEFUVVNfQ0hBTkdFKFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2xvc2UgbmF0aXZlIHByb2dyZXNzIGFmdGVyIGRvd25sb2FkIG5hdGl2ZSBhciBlbmdpbmVcclxuICAgICAgICAgICAgICAgICAgICAvL05BVElWRV9SUk9HUkVTU19DTE9TRSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW5pdCBBUiBmYWlsLiBQbGF0Zm9ybSBhbmRyb2lkLiBkb3dubG9hZCBlbmdpbmUgZXJyb3InKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgLy8gdnIgZGlzcGxheSDlv4XpobvpppblhYjliqDovb3vvIxhbmRyb2lk5ZyoeDXlhoXmoLjph4zlt7Lnu4/mnInvvIxpb3PpnIDopoHlvJXnlKhXZWJBUm9uQVJraXRcclxuICAgICAgICAgICAgLy8gYW5kcm9pZCBBUueahOiDveWKm+mcgOimgeS4i+i9veaJjeacie+8jOS9huaYr+aRhOWDj+WktOiDveWKm+S4jemcgOimgeS4i+i9veW8leaTju+8jOaJgOS7pXJlbmRlcuWPr+S7peaPkOWJjei/m+ihjO+8m2lvc+acrOi6q+WwseacieWQhOenjeiDveWKm++8jHNsYW3jgIFtYXJrZXJsZXNz5rK/55SoYXJraXTnmoTvvIxtYXJrZXIgYmFzZeaYr+atpuaxieiHqueglOeahO+8jOWFtuS4reeahGFkZE1hcmtlcumcgOimgee7iOerr+a3u+WKoOeahFxyXG4gICAgICAgICAgICBUQVIuQVIuaW5pdEFSRW5naW5lKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAyXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FyLnNldEVuZ2luZURvd25sb2FkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnSW5pdCBBUiBzdWNjZXNzLiBQbGF0Zm9ybSBhbmRyb2lkLiBBUiBFbmdpbmUgZG93bmxvYWQgc3VjY2VzcywgeW91IGNhbiB1c2UgYWJpbGl0eSBvZiB0YXIgJ1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbml0IEFSIGZhaWwuIFBsYXRmb3JtIGFuZHJvaWQuIGluaXQgZmFpbCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLkFSSW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQVJJbml0KCkge1xyXG4gICAgICAgIHRoaXMuX2FyLmxvYWQoKS50aGVuKChkaXNwbGF5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlci5zZXRWUkRpc3BsYXkoZGlzcGxheSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZS5jcmVhdGUoJ0xheWEnKTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIGFy5byV5pOO5Yqg6L2977yMbG9hZOWHveaVsOaciTPkuKrlj4LmlbDvvIzlkI7kuKTkuKrkuLrlm57osIPlh73mlbBvblN0YXJ0Q2FsbGJhY2vlkoxvbkNvbXBsZXRlQ2FsbGJhY2tcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZS5sb2FkKGRpc3BsYXksIG51bGwsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlLnJ1bigpO1xyXG4gICAgICAgICAgICAgICAgLy8gdGFzayA9IG5ldyBUYXNrKGFyLCByZW5kZXIsIGVuZ2luZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcnVuID0gKHByZVN0YXRlLCBuZXh0U3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0YXNrLnJ1bihwcmVTdGF0ZSwgbmV4dFN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgKGFyLmdldEN1cnJlbnRTdGF0ZSgpID09PSAnbm9ybWFsJykge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHJ1bigpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAvKipcclxuICAgICAgICAgICAgICAgIC8vICAgICAgKiAg5bCGcnVuIGNhbGxiYWNr5rOo5YaM5YiwYXLnmoTnirbmgIHovaznp7vlh73mlbDkuK3vvIxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgKiAg5b2T6LCD55SoYXIub25UYXJTdGF0ZUNoYW5nZWQoJ25vcm1hbCcp5oiW6ICFIGFyLm9uVGFyU3RhdGVDaGFuZ2VkKCdsaW1pdGVkJykg77yMIHJ1buS8muinpuWPke+8jFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAqICDmiYDku6VydW7lh73mlbDopoHlgZrkuI3lkIznirbmgIHpl7TovazmjaLlpITnkIZcclxuICAgICAgICAgICAgICAgIC8vICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vICAgICBhci5zZXROb3RBdmFpbGFibGUyTm9ybWFsRnVuYyhydW4pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGFyLnNldExpbWl0ZWQyTm9ybWFsRnVuYyhydW4pO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgZXhjZXB0aW9uID0gJHtlfWApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiXHJcbmV4cG9ydCBjbGFzcyBXbXlVdGlscyBleHRlbmRzIGxheWEuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpczpXbXlVdGlscztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlVdGlsc3tcclxuICAgICAgICBpZihXbXlVdGlscy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteVV0aWxzLl90aGlzPW5ldyBXbXlVdGlscygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBXbXlVdGlscy5fdGhpcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLl9fbG9vcCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9ET1dOLHRoaXMsIHRoaXMuX19vblRvdWNoRG93bik7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihsYXlhLmV2ZW50cy5FdmVudC5NT1VTRV9VUCx0aGlzLCB0aGlzLl9fb25Ub3VjaFVwKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKGxheWEuZXZlbnRzLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLl9fT25Nb3VzZU1PVkUpO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5SRVNJWkUsdGhpcyx0aGlzLl9fb25SZXNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBDT0xPUl9GSUxURVJTX01BVFJJWDogQXJyYXk8YW55Pj1bXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9SXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9HXHJcbiAgICAgICAgMCwgMCwgMCwgMCwgMCwgLy9CXHJcbiAgICAgICAgMCwgMCwgMCwgMSwgMCwgLy9BXHJcbiAgICBdO1xyXG4gICAgLy/ovazmjaLpopzoibJcclxuICAgIHB1YmxpYyBjb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChyOm51bWJlcixnOm51bWJlcixiOm51bWJlcixhPzpudW1iZXIpOkFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICBXbXlVdGlscy5DT0xPUl9GSUxURVJTX01BVFJJWFswXT1yO1xyXG4gICAgICAgIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYWzZdPWc7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMTJdPWI7XHJcbiAgICAgICAgV215VXRpbHMuQ09MT1JfRklMVEVSU19NQVRSSVhbMThdPWF8fDE7XHJcbiAgICAgICAgcmV0dXJuIFdteVV0aWxzLkNPTE9SX0ZJTFRFUlNfTUFUUklYO1xyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVycyh0YXJnZXQ6TGF5YS5TcHJpdGUsY29sb3I6bnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHRhcmdldC5maWx0ZXJzPW51bGw7XHJcbiAgICAgICAgaWYoY29sb3IgIT0gMHhmZmZmZmYpe1xyXG4gICAgICAgICAgICB0YXJnZXQuZmlsdGVycz1bbmV3IExheWEuQ29sb3JGaWx0ZXIodGhpcy5jb252ZXJ0Q29sb3JUb0NvbG9yRmlsdGVyc01hdHJpeChcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjE2KSAmIDB4ZmYpLzI1NSxcclxuICAgICAgICAgICAgICAgICgoY29sb3I+PjgpICYgMHhmZikvMjU1LFxyXG4gICAgICAgICAgICAgICAgKGNvbG9yICYgMHhmZikvMjU1XHJcbiAgICAgICAgICAgICAgICApKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy/lr7nlr7nosaHmlLnlj5jpopzoibJcclxuICAgIHB1YmxpYyBhcHBseUNvbG9yRmlsdGVyczEodGFyZ2V0OkxheWEuU3ByaXRlLHI6bnVtYmVyLGc6bnVtYmVyLGI6bnVtYmVyLGE/Om51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0YXJnZXQuZmlsdGVycz1udWxsO1xyXG4gICAgICAgIGlmKHIgPCAxIHx8IGcgPCAxIHx8IGIgPCAxIHx8IGEgPCAxKXtcclxuICAgICAgICAgICAgdGFyZ2V0LmZpbHRlcnM9W25ldyBMYXlhLkNvbG9yRmlsdGVyKHRoaXMuY29udmVydENvbG9yVG9Db2xvckZpbHRlcnNNYXRyaXgocixnLGIsYSkpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/liKTmlq3miYvmnLrmiJZQQ1xyXG4gICAgcHVibGljIGlzUGMoKTpib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGlzUGM6Ym9vbGVhbj1mYWxzZTtcclxuICAgICAgICBpZih0aGlzLnZlcnNpb25zKCkuYW5kcm9pZCB8fCB0aGlzLnZlcnNpb25zKCkuaVBob25lIHx8IHRoaXMudmVyc2lvbnMoKS5pb3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpc1BjPWZhbHNlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMudmVyc2lvbnMoKS5pUGFkKXtcclxuICAgICAgICAgICAgaXNQYz10cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlzUGM9dHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNQYztcclxuICAgIH1cclxuICAgIHB1YmxpYyB2ZXJzaW9ucygpe1xyXG4gICAgICAgIHZhciB1OnN0cmluZyA9IG5hdmlnYXRvci51c2VyQWdlbnQsIGFwcDpzdHJpbmcgPSBuYXZpZ2F0b3IuYXBwVmVyc2lvbjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAvL+enu+WKqOe7iOerr+a1j+iniOWZqOeJiOacrOS/oeaBr1xyXG4gICAgICAgICAgICB0cmlkZW50OiB1LmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xLCAvL0lF5YaF5qC4XHJcbiAgICAgICAgICAgIHByZXN0bzogdS5pbmRleE9mKCdQcmVzdG8nKSA+IC0xLCAvL29wZXJh5YaF5qC4XHJcbiAgICAgICAgICAgIHdlYktpdDogdS5pbmRleE9mKCdBcHBsZVdlYktpdCcpID4gLTEsIC8v6Iu55p6c44CB6LC35q2M5YaF5qC4XHJcbiAgICAgICAgICAgIGdlY2tvOiB1LmluZGV4T2YoJ0dlY2tvJykgPiAtMSAmJiB1LmluZGV4T2YoJ0tIVE1MJykgPT0gLTEsIC8v54Gr54uQ5YaF5qC4XHJcbiAgICAgICAgICAgIG1vYmlsZTogISF1Lm1hdGNoKC9BcHBsZVdlYktpdC4qTW9iaWxlLiovKXx8ISF1Lm1hdGNoKC9BcHBsZVdlYktpdC8pLCAvL+aYr+WQpuS4uuenu+WKqOe7iOerr1xyXG4gICAgICAgICAgICBpb3M6ICEhdS5tYXRjaCgvXFwoaVteO10rOyggVTspPyBDUFUuK01hYyBPUyBYLyksIC8vaW9z57uI56uvXHJcbiAgICAgICAgICAgIGFuZHJvaWQ6IHUuaW5kZXhPZignQW5kcm9pZCcpID4gLTEgfHwgdS5pbmRleE9mKCdMaW51eCcpID4gLTEsIC8vYW5kcm9pZOe7iOerr+aIluiAhXVj5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQaG9uZTogdS5pbmRleE9mKCdpUGhvbmUnKSA+IC0xIHx8IHUuaW5kZXhPZignTWFjJykgPiAtMSwgLy/mmK/lkKbkuLppUGhvbmXmiJbogIVRUUhE5rWP6KeI5ZmoXHJcbiAgICAgICAgICAgIGlQYWQ6IHUuaW5kZXhPZignaVBhZCcpID4gLTEsIC8v5piv5ZCmaVBhZFxyXG4gICAgICAgICAgICB3ZWJBcHA6IHUuaW5kZXhPZignU2FmYXJpJykgPT0gLTEgLy/mmK/lkKZ3ZWLlupTor6XnqIvluo/vvIzmsqHmnInlpLTpg6jkuI7lupXpg6hcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRVcmxWKGtleTpzdHJpbmcpe1xyXG4gICAgICAgIHZhciByZWc9IG5ldyBSZWdFeHAoXCIoXnwmKVwiK2tleStcIj0oW14mXSopKCZ8JClcIik7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLm1hdGNoKHJlZyk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdD9kZWNvZGVVUklDb21wb25lbnQocmVzdWx0WzJdKTpudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk5hdmlnYXRlKHVybDpzdHJpbmcsaXNSZXBsYWNlOmJvb2xlYW49ZmFsc2Upe1xyXG4gICAgICAgIGlmKGlzUmVwbGFjZSl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHVybCk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9dXJsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ldmVudExpc3Q6QXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+PW5ldyBBcnJheTxsYXlhLmV2ZW50cy5FdmVudD4oKTtcclxuICAgIHByaXZhdGUgX19vblRvdWNoRG93bihldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRMaXN0LmluZGV4T2YoZXZ0KTwwKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnB1c2goZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25Ub3VjaFVwKGV2dDogbGF5YS5ldmVudHMuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpPj0wKXtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0LnNwbGljZSh0aGlzLl9ldmVudExpc3QuaW5kZXhPZihldnQpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9fb25SZXNpemUoKXtcclxuICAgICAgICB0aGlzLl9ldmVudExpc3QuZm9yRWFjaChldnQgPT4ge1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuXHRcdH0pO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdD1uZXcgQXJyYXk8bGF5YS5ldmVudHMuRXZlbnQ+KCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX19Pbk1vdXNlTU9WRShldnQ6IGxheWEuZXZlbnRzLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgdmFyIGJOdW09MTA7XHJcbiAgICAgICAgaWYoZXZ0LnN0YWdlWCA8PSBiTnVtIHx8IGV2dC5zdGFnZVggPj0gTGF5YS5zdGFnZS53aWR0aC1iTnVtIHx8XHJcbiAgICAgICAgICAgIGV2dC5zdGFnZVkgPD0gYk51bSB8fCBldnQuc3RhZ2VZID49IExheWEuc3RhZ2UuaGVpZ2h0LWJOdW0pe1xyXG4gICAgICAgICAgICBldnQudHlwZT1MYXlhLkV2ZW50Lk1PVVNFX1VQO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmV2ZW50KExheWEuRXZlbnQuTU9VU0VfVVAsZXZ0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTnVtVG8obixsPTIpe1xyXG5cdFx0aWYoKG4rXCJcIikuaW5kZXhPZihcIi5cIik+PTApe1xyXG5cdFx0ICAgIG49cGFyc2VGbG9hdChuLnRvRml4ZWQobCkpO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFJfWFkoZCwgcilcclxuICAgIHtcclxuICAgIFx0dmFyIHJhZGlhbiA9IChyICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBcdHZhciBjb3MgPSAgTWF0aC5jb3MocmFkaWFuKTtcclxuICAgIFx0dmFyIHNpbiA9ICBNYXRoLnNpbihyYWRpYW4pO1xyXG4gICAgXHRcclxuICAgIFx0dmFyIGR4PWQgKiBjb3M7XHJcbiAgICBcdHZhciBkeT1kICogc2luO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IExheWEuUG9pbnQoZHggLCBkeSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgIHB1YmxpYyBzdGF0aWMgc3RyaW5nMmJ1ZmZlcihzdHIpOkFycmF5QnVmZmVyIHtcclxuICAgICAgICAvLyDpppblhYjlsIblrZfnrKbkuLLovazkuLoxNui/m+WItlxyXG4gICAgICAgIGxldCB2YWwgPSBcIlwiXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodmFsID09PSAnJykge1xyXG4gICAgICAgICAgICB2YWwgPSBzdHIuY2hhckNvZGVBdChpKS50b1N0cmluZygxNilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWwgKz0gJywnICsgc3RyLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDlsIYxNui/m+WItui9rOWMluS4ukFycmF5QnVmZmVyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHZhbC5tYXRjaCgvW1xcZGEtZl17Mn0vZ2kpLm1hcChmdW5jdGlvbiAoaCkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludChoLCAxNilcclxuICAgICAgICB9KSkuYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVwbGFjZUFsbChzdHIsIG9sZFN0ciwgbmV3U3RyKXsgIFxyXG4gICAgICAgIHZhciB0ZW1wID0gJyc7ICBcclxuICAgICAgICB0ZW1wID0gc3RyLnJlcGxhY2Uob2xkU3RyLCBuZXdTdHIpO1xyXG4gICAgICAgIGlmKHRlbXAuaW5kZXhPZihvbGRTdHIpPj0wKXtcclxuICAgICAgICAgICAgdGVtcCA9IHRoaXMucmVwbGFjZUFsbCh0ZW1wLCBvbGRTdHIsIG5ld1N0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZW1wOyAgXHJcbiAgICB9ICBcclxuXHJcbiAgICAvL+Wkp+Wwj+WGmei9rOaNolxyXG4gICAgcHVibGljIHN0YXRpYyB0b0Nhc2Uoc3RyOnN0cmluZywgaXNEeD1mYWxzZSl7ICBcclxuICAgICAgICB2YXIgdGVtcCA9ICcnO1xyXG4gICAgICAgIGlmKCFpc0R4KXtcclxuICAgICAgICAgICAgLy/ovazmjaLkuLrlsI/lhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgLy/ovazljJbkuLrlpKflhpnlrZfmr41cclxuICAgICAgICAgICAgdGVtcD1zdHIudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7ICBcclxuICAgIH0gXHJcblxyXG4gICAgXHJcbiAgICAvL+i3neemu1xyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0RGlzdGFuY2UoYTpMYXlhLlBvaW50LGI6TGF5YS5Qb2ludCk6bnVtYmVyIHtcclxuXHRcdHZhciBkeCA9IE1hdGguYWJzKGEueCAtIGIueCk7XHJcblx0XHR2YXIgZHkgPSBNYXRoLmFicyhhLnkgLSBiLnkpO1xyXG5cdFx0dmFyIGQ9TWF0aC5zcXJ0KE1hdGgucG93KGR4LCAyKSArIE1hdGgucG93KGR5LCAyKSk7XHJcblx0XHRkPXBhcnNlRmxvYXQoZC50b0ZpeGVkKDIpKTtcclxuXHRcdHJldHVybiBkO1xyXG5cdH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFh5VG9SKHkseCk6bnVtYmVye1xyXG4gICAgICAgIHZhciByYWRpYW49TWF0aC5hdGFuMih5LHgpO1xyXG4gICAgICAgIHZhciByPSgxODAvTWF0aC5QSSpyYWRpYW4pO1xyXG4gICAgICAgIHI9dGhpcy5vbk51bVRvKHIpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc3RvcmFnZShrZXksIHZhbHVlOmFueT1cIj9cIiwgaXNMb2NhbD10cnVlKTphbnl7XHJcbiAgICAgICAgdmFyIHN0b3JhZ2U6YW55PWlzTG9jYWw/bG9jYWxTdG9yYWdlOnNlc3Npb25TdG9yYWdlO1xyXG4gICAgICAgIGlmKHZhbHVlPT1cIj9cIil7XHJcblx0XHRcdHZhciBkYXRhID0gc3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZih2YWx1ZT09bnVsbCl7XHJcblx0XHRcdHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0c3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheUZ1aVNvdW5kKF91cmwsdm9sdW1lPTAuMixjb21wbGV0ZUhhbmRsZXI/LHN0YXJ0VGltZT0wLGxvb3BzPTEpe1xyXG4gICAgICAgIGlmKHZvbHVtZTw9MClyZXR1cm47XHJcbiAgICAgICAgdmFyIGl0ZW09ZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1CeVVSTChfdXJsKTtcclxuICAgICAgICB2YXIgdXJsPWl0ZW0uZmlsZTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQodXJsLGxvb3BzLGNvbXBsZXRlSGFuZGxlcixudWxsLHN0YXJ0VGltZSk7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIuc2V0U291bmRWb2x1bWUodm9sdW1lLHVybCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXbXlVdGlscyB9IGZyb20gXCIuL1dteVV0aWxzXCI7XHJcbmltcG9ydCB7IFdteUxvYWQzZCB9IGZyb20gXCIuL2QzL1dteUxvYWQzZFwiO1xyXG5pbXBvcnQgeyBXbXlMb2FkTWF0cyB9IGZyb20gXCIuL2QzL1dteUxvYWRNYXRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV215X0xvYWRfTWFnXHJcbntcclxuICAgIHByaXZhdGUgc3RhdGljIF90aGlzO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2V0VGhpcygpOldteV9Mb2FkX01hZ3tcclxuICAgICAgICBpZihXbXlfTG9hZF9NYWcuX3RoaXM9PW51bGwpe1xyXG4gICAgICAgICAgICBXbXlfTG9hZF9NYWcuX3RoaXM9bmV3IFdteV9Mb2FkX01hZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215X0xvYWRfTWFnLl90aGlzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfd2V0RGF0YTphbnk9e307XHJcblxyXG4gICAgcHVibGljIHJlc1VybDpzdHJpbmc9XCJcIjtcclxuICAgIHB1YmxpYyBnZXRXZXREYXRhKHVybDpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93ZXREYXRhW3VybF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXRXZXREYXRhKG9iajphbnksdXJsPzpzdHJpbmcpe1xyXG4gICAgICAgIGlmKHRoaXMucmVzVXJsPT1cIlwiKXtcclxuICAgICAgICAgICAgdGhpcy5yZXNVcmw9dXJsO1xyXG4gICAgICAgICAgICB2YXIgYXJyPW51bGw7XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGFycj1KU09OLnBhcnNlKG9iaik7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih1cmw9PW51bGwpe1xyXG4gICAgICAgICAgICB1cmw9dGhpcy5yZXNVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3dldERhdGFbdXJsXT1vYmo7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRSZXNPYmoocmVzTmFtZTpzdHJpbmcsdXJsPyl7XHJcbiAgICAgICAgdmFyIHdlYkRhdGE6YW55O1xyXG4gICAgICAgIGlmKHVybD09bnVsbCl7XHJcbiAgICAgICAgICAgIHVybD10aGlzLnJlc1VybDtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2ViRGF0YT10aGlzLmdldFdldERhdGEodXJsKTtcclxuICAgICAgICBpZih3ZWJEYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi56m65pWw5o2uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFycjpBcnJheTxhbnk+PW51bGw7XHJcbiAgICAgICAgaWYod2ViRGF0YSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgYXJyPXdlYkRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbCl7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZSh3ZWJEYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHdlYkRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc09iaj1udWxsO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgb2JqPWFycltpXTtcclxuICAgICAgICAgICAgaWYob2JqW1wicmVzTmFtZVwiXT09cmVzTmFtZSl7XHJcbiAgICAgICAgICAgICAgICByZXNPYmo9b2JqO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc09iajtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkV2V0RGF0YSh1cmw6c3RyaW5nLGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICBpZih1cmw9PVwiXCIpcmV0dXJuO1xyXG4gICAgICAgIGlmKHRoaXMuZ2V0V2V0RGF0YSh1cmwpIT1udWxsKXtcclxuICAgICAgICAgICAgY2FsbGJhY2tPay5ydW5XaXRoKFt0aGlzLmdldFdldERhdGEodXJsKV0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsb2FkPUxheWEubG9hZGVyLmxvYWQodXJsLG5ldyBMYXlhLkhhbmRsZXIodGhpcyxmdW5jdGlvbihvYmope1xyXG4gICAgICAgICAgICB0aGlzLnNldFdldERhdGEob2JqLHVybCk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbdGhpcy5fd2V0RGF0YVt1cmxdXSk7XHJcbiAgICAgICAgfSkpXHJcbiAgICAgICAgcmV0dXJuIGxvYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVzRGF0YUFycjpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tQcm9ncmVzczpBcnJheTxhbnk+PVtdO1xyXG4gICAgcHVibGljIG9ubG9hZChyZXNPYmo6YW55LGNhbGxiYWNrT2s6TGF5YS5IYW5kbGVyLGNhbGxiYWNrUHJvZ3Jlc3M/OkxheWEuSGFuZGxlcil7XHJcbiAgICAgICAgdmFyIHJlc05hbWU9cmVzT2JqW1wicmVzTmFtZVwiXTtcclxuICAgICAgICBpZih0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fcmVzRGF0YUFycltyZXNOYW1lXS5ydW5XaXRoKFt0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NhbGxiYWNrT2tbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNPYmpbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciBkYXRhOmFueT17fTtcclxuICAgICAgICAgICAgdmFyIHJlc0RhdGE6c3RyaW5nPXJlc09ialtcInJlc0RhdGFcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc0RhdGEhPW51bGwgJiYgcmVzRGF0YSE9XCJcIil7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE9SlNPTi5wYXJzZShyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwi5Yqg6L295p2Q5paZ5pWw5o2u6ZSZ6K+vXCIscmVzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGJOYW1lVXJsO1xyXG4gICAgICAgICAgICB2YXIgdXJsQXJyOkFycmF5PGFueT49W107XHJcbiAgICAgICAgICAgIHZhciBpc0NyZWF0ZT1mYWxzZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNVcmw9V215VXRpbHMudG9DYXNlKHJlc1VybCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIGlmKHVybC5pbmRleE9mKFwiLnR4dFwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5CVUZGRVJ9KTtcclxuICAgICAgICAgICAgICAgICAgICBiTmFtZVVybD1yZXNVcmw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHVybC5pbmRleE9mKFwiLmpwZ1wiKT49MCB8fCB1cmwuaW5kZXhPZihcIi5wbmdcIik+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEFyci5wdXNoKHt1cmw6dXJsLHR5cGU6TGF5YS5Mb2FkZXIuSU1BR0V9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodXJsLmluZGV4T2YoXCIubXAzXCIpPj0wIHx8IHVybC5pbmRleE9mKFwiLndhdlwiKT49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsQXJyLnB1c2goe3VybDp1cmwsdHlwZTpMYXlhLkxvYWRlci5TT1VORH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybEFyci5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybEFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkFzc2V0Q29ubXBsZXRlLFtyZXNOYW1lLGJOYW1lVXJsLGRhdGFdKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Bc3NldFByb2dyZXNzLCBbcmVzTmFtZV0sIGZhbHNlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIG9ubG9hZDNkKHJlc09iajphbnksY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgcmVzTmFtZT1yZXNPYmpbXCJyZXNOYW1lXCJdO1xyXG4gICAgICAgIGlmKHRoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV0hPW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdLnJ1bldpdGgoW3RoaXMuX3Jlc0RhdGFBcnJbcmVzTmFtZV1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tPayk7XHJcbiAgICAgICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdLnB1c2goY2FsbGJhY2tQcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIFJlc3JlczpBcnJheTxhbnk+PXJlc09ialtcIlJlc3Jlc1wiXTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6YW55PXt9O1xyXG4gICAgICAgICAgICB2YXIgcmVzRGF0YTpzdHJpbmc9cmVzT2JqW1wicmVzRGF0YVwiXTtcclxuICAgICAgICAgICAgaWYocmVzRGF0YSE9bnVsbCAmJiByZXNEYXRhIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YT1KU09OLnBhcnNlKHJlc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCLliqDovb3mnZDmlpnmlbDmja7plJnor69cIixyZXNEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYk5hbWU7XHJcbiAgICAgICAgICAgIHZhciB1cmxBcnI6QXJyYXk8YW55Pj1bXTtcclxuICAgICAgICAgICAgdmFyIHVybExpc3Q6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqPVJlc3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNVcmw6c3RyaW5nPW9ialtcInJlc1VybFwiXTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybD09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIGlmKHJlc1VybC5pbmRleE9mKFwiLmxzXCIpPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICB1cmxBcnIucHVzaCh7dXJsOnVybH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHVybExpc3QucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHVybEFyci5sZW5ndGg8PTApcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXT1bXTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPa1tyZXNOYW1lXS5wdXNoKGNhbGxiYWNrT2spO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzW3Jlc05hbWVdPVtdO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV0ucHVzaChjYWxsYmFja1Byb2dyZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhLnVybExpc3Q9dXJsTGlzdDtcclxuICAgICAgICAgICAgV215TG9hZDNkLmdldFRoaXMub25sb2FkM2QodXJsQXJyLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uQXNzZXRDb25tcGxldGUsW3Jlc05hbWUsYk5hbWUsZGF0YV0pLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkFzc2V0UHJvZ3Jlc3MsIFtyZXNOYW1lXSwgZmFsc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG5cdHByaXZhdGUgb25Bc3NldFByb2dyZXNzKHJlc05hbWUscHJvZ3Jlc3MpOiB2b2lkIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2tQcm9ncmVzc0FycjpBcnJheTxMYXlhLkhhbmRsZXI+PXRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3NbcmVzTmFtZV07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja1Byb2dyZXNzQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNhbGxiYWNrUHJvZ3Jlc3NBcnJbaV07XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLnJ1bldpdGgoW3Byb2dyZXNzXSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBvbkFzc2V0Q29ubXBsZXRlKHJlc05hbWUsYk5hbWVVcmw6c3RyaW5nLGRhdGEpOnZvaWR7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrT2tBcnI6QXJyYXk8TGF5YS5IYW5kbGVyPj10aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdO1xyXG4gICAgICAgIGlmKGJOYW1lVXJsIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIGJhbz1MYXlhLmxvYWRlci5nZXRSZXMoYk5hbWVVcmwpO1xyXG4gICAgICAgICAgICB2YXIgYk5hbWUgPSBiTmFtZVVybC5yZXBsYWNlKFwiLnR4dFwiLFwiXCIpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZmFpcnlndWkuVUlQYWNrYWdlLmFkZFBhY2thZ2UoYk5hbWUsYmFvKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkZVSS3lh7rplJk6XCIsYk5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiTmFtZUFycj1iTmFtZS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIGRhdGEuYk5hbWU9Yk5hbWVBcnJbYk5hbWVBcnIubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNEYXRhQXJyW3Jlc05hbWVdPWRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tPa0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tPayA9IGNhbGxiYWNrT2tBcnJbaV07XHJcbiAgICAgICAgICAgIGNhbGxiYWNrT2sucnVuV2l0aChbZGF0YV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rW3Jlc05hbWVdPW51bGw7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzc1tyZXNOYW1lXT1udWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkSW5mb0Fycjphbnk7XHJcbiAgICBwcml2YXRlIF9hdXRvTG9hZHJDYWxsYmFja09rOkxheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3M6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9uQXV0b0xvYWRBbGwoY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB2YXIgd2ViRGF0YTphbnk9dGhpcy5nZXRXZXREYXRhKHRoaXMucmVzVXJsKTtcclxuICAgICAgICBpZih3ZWJEYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi56m65pWw5o2uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFycjpBcnJheTxhbnk+PW51bGw7XHJcbiAgICAgICAgaWYod2ViRGF0YSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgYXJyPXdlYkRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGFycj09bnVsbCl7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhcnI9SlNPTi5wYXJzZSh3ZWJEYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIuWKoOi9veadkOaWmeaVsOaNrumUmeivr1wiLHdlYkRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPaz1jYWxsYmFja09rO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkckNhbGxiYWNrUHJvZ3Jlc3M9Y2FsbGJhY2tQcm9ncmVzcztcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnI9e307XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdPTA7XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXT0wO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdPVtdO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXT1bXTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1hcnJbaV07XHJcbiAgICAgICAgICAgIHZhciByZXNOYW1lPW9ialtcInJlc05hbWVcIl07XHJcbiAgICAgICAgICAgIHZhciB0PW9ialtcInR5cGVcIl07XHJcbiAgICAgICAgICAgIGlmKHJlc05hbWU9PW51bGwgfHwgcmVzTmFtZT09XCJcIiB8fCB0PT1udWxsIHx8IHQ9PVwiXCIpY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMub25BdXRvTG9hZE9iaih0LHJlc05hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQXV0b0xvYWRPYmoodHlwZTpzdHJpbmcscmVzTmFtZSl7XHJcbiAgICAgICAgdmFyIHJlcz10aGlzLmdldFJlc09iaihyZXNOYW1lKTtcclxuICAgICAgICBpZihyZXM9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgIHZhciByZXNJZD10aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl07XHJcbiAgICAgICAgdGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXT17fTtcclxuICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbcmVzSWRdW1wiblwiXT1yZXNOYW1lO1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJ0XCJdPXR5cGU7XHJcbiAgICAgICAgdmFyIGxvYWRPaz1mYWxzZTtcclxuICAgICAgICBpZih0eXBlPT1cInVpXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ1aS3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZT09XCJ1M2RcIil7XHJcbiAgICAgICAgICAgIGxvYWRPaz10aGlzLm9ubG9hZDNkKHJlcyxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRPayxbcmVzSWRdKSxuZXcgTGF5YS5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvYWRpbmcsW3Jlc0lkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0rPTE7XHJcbiAgICAgICAgICAgIGlmKCFsb2FkT2spe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidTNkLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cIm1hdHNcIil7XHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIHZhciB1cmxMaXN0OkFycmF5PHN0cmluZz49W107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICByZXNVcmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeChyZXNVcmwpO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzVXJsPT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICAgICAgdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodXJsTGlzdC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICBXbXlMb2FkTWF0cy5nZXRUaGlzLm9ubG9hZDNkKHVybExpc3QsbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkT2ssW3Jlc0lkXSksbmV3IExheWEuSGFuZGxlcih0aGlzLHRoaXMub25Mb2FkaW5nLFtyZXNJZF0pKTtcclxuICAgICAgICAgICAgICAgIGxvYWRPaz10cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJtYXRzLeWHuumUmTpcIixyZXNOYW1lKTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsbnVsbCwoX3Jlc0lkKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkT2soX3Jlc0lkKTtcclxuICAgICAgICAgICAgICAgIH0sW3Jlc0lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cImN1YmVNYXBcIil7XHJcbiAgICAgICAgICAgIHZhciBSZXNyZXM6QXJyYXk8YW55Pj1yZXNbXCJSZXNyZXNcIl07XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8UmVzcmVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaj1SZXNyZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsPXJlc1VybDtcclxuICAgICAgICAgICAgICAgIExheWEuVGV4dHVyZUN1YmUubG9hZCh1cmwsbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlPT1cImF1ZGlvXCIpe1xyXG4gICAgICAgICAgICBsb2FkT2s9dGhpcy5vbmxvYWQocmVzLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZE9rLFtyZXNJZF0pLG5ldyBMYXlhLkhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZGluZyxbcmVzSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcIm51bVwiXSs9MTtcclxuICAgICAgICAgICAgaWYoIWxvYWRPayl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJhdWRpby3lh7rplJk6XCIscmVzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLG51bGwsKF9yZXNJZCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZE9rKF9yZXNJZCk7XHJcbiAgICAgICAgICAgICAgICB9LFtyZXNJZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdWJlKHJlc05hbWUsIGNvbXBsZXRlOiBMYXlhLkhhbmRsZXIpOkFycmF5PExheWEuVGV4dHVyZUN1YmU+e1xyXG4gICAgICAgIHZhciByZXM9dGhpcy5nZXRSZXNPYmoocmVzTmFtZSk7XHJcbiAgICAgICAgaWYocmVzPT1udWxsKXJldHVybjtcclxuICAgICAgICB2YXIgUmVzcmVzOkFycmF5PGFueT49cmVzW1wiUmVzcmVzXCJdO1xyXG4gICAgICAgIHZhciBSZXNyZXNPYmo6QXJyYXk8TGF5YS5UZXh0dXJlQ3ViZT49W107XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxSZXNyZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBvYmo9UmVzcmVzW2ldO1xyXG4gICAgICAgICAgICB2YXIgcmVzVXJsOnN0cmluZz1vYmpbXCJyZXNVcmxcIl07XHJcbiAgICAgICAgICAgIHJlc1VybD1MYXlhLlJlc291cmNlVmVyc2lvbi5hZGRWZXJzaW9uUHJlZml4KHJlc1VybCk7XHJcbiAgICAgICAgICAgIHZhciB1cmw9cmVzVXJsO1xyXG4gICAgICAgICAgICBMYXlhLlRleHR1cmVDdWJlLmxvYWQodXJsLG5ldyBMYXlhLkhhbmRsZXIodGhpcyxjdWJlPT57XHJcbiAgICAgICAgICAgICAgICBSZXNyZXNPYmpbaV09Y3ViZTtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlLnJ1bldpdGgoW2N1YmUsaV0pO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBSZXNyZXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkxvYWRpbmcocmVzSWQsIHByb2dyZXNzOm51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltyZXNJZF1bXCJwXCJdPXByb2dyZXNzO1xyXG4gICAgICAgIHZhciBudW09dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdO1xyXG4gICAgICAgIHZhciBwTnVtPTA7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxudW07aSsrKXtcclxuICAgICAgICAgICAgdmFyIHA9dGhpcy5fYXV0b0xvYWRJbmZvQXJyW2ldW1wicFwiXTtcclxuICAgICAgICAgICAgaWYocCE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBwTnVtKz1wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBwQz0ocE51bS90aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJudW1cIl0pKjEwMDtcclxuICAgICAgICBpZihpc05hTihwQykpcEM9MDtcclxuICAgICAgICBpZih0aGlzLl9hdXRvTG9hZHJDYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFtwQ10pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25Mb2FkT2socmVzSWQsZGF0YT8pe1xyXG4gICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcImNOdW1cIl0rPTE7XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInRcIl09PVwidWlcIil7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5fYXV0b0xvYWRJbmZvQXJyW3Jlc0lkXVtcInRcIl09PVwidTNkXCIpe1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvTG9hZEluZm9BcnJbXCJ1M2RBcnJcIl0ucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wiY051bVwiXT49dGhpcy5fYXV0b0xvYWRJbmZvQXJyW1wibnVtXCJdKXtcclxuICAgICAgICAgICAgaWYodGhpcy5fYXV0b0xvYWRyQ2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvTG9hZHJDYWxsYmFja09rLnJ1bldpdGgoW3RoaXMuX2F1dG9Mb2FkSW5mb0FycltcInVpQXJyXCJdLHRoaXMuX2F1dG9Mb2FkSW5mb0FycltcInUzZEFyclwiXV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImV4cG9ydCBjbGFzcyBXbXlMb2FkM2R7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlMb2FkM2R7XHJcbiAgICAgICAgaWYoV215TG9hZDNkLl90aGlzPT1udWxsKXtcclxuICAgICAgICAgICAgV215TG9hZDNkLl90aGlzPW5ldyBXbXlMb2FkM2QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFdteUxvYWQzZC5fdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cmxMaXN0OkFycmF5PHN0cmluZz47XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja09rOkxheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgX2NhbGxiYWNrUHJvZ3Jlc3M6TGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9ubG9hZDNkKHVybExpc3Q6QXJyYXk8c3RyaW5nPixjYWxsYmFja09rOkxheWEuSGFuZGxlcixjYWxsYmFja1Byb2dyZXNzPzpMYXlhLkhhbmRsZXIpe1xyXG4gICAgICAgIHZhciBfdXJsTGlzdD1bXTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dXJsTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHVybD11cmxMaXN0W2ldO1xyXG4gICAgICAgICAgICB1cmw9TGF5YS5SZXNvdXJjZVZlcnNpb24uYWRkVmVyc2lvblByZWZpeCh1cmwpO1xyXG4gICAgICAgICAgICBfdXJsTGlzdC5wdXNoKHVybCk7XHJcbiAgICAgICAgICAgIC8vIG9ialtcInVybFwiXSs9XCI/d215XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwbnVtPTA7XHJcbiAgICAgICAgdmFyIHBOdW09MDtcclxuICAgICAgICB2YXIgaXNQPWZhbHNlO1xyXG4gICAgICAgIHZhciBfUHJvZ3Jlc3M9KHApPT57XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHApO1xyXG4gICAgICAgICAgICBwbnVtKz0wLjAxO1xyXG4gICAgICAgICAgICAvLyBpZihpc1Ape1xyXG4gICAgICAgICAgICAvLyAgICAgcE51bSA9IHBudW0rKHApKjAuOTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBlbHNle1xyXG4gICAgICAgICAgICAvLyAgICAgcE51bSA9IHBudW07XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gaWYocG51bT49MC4xIHx8IHA9PTEpe1xyXG4gICAgICAgICAgICAvLyAgICAgaXNQPXRydWU7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgaWYocG51bT4xKXBudW09MTtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja1Byb2dyZXNzLnJ1bldpdGgoW3BudW1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgX29uT2s9KCk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExheWEubG9hZGVyLmNyZWF0ZShfdXJsTGlzdCxuZXcgTGF5YS5IYW5kbGVyKG51bGwsX29uT2spLExheWEuSGFuZGxlci5jcmVhdGUobnVsbCxfUHJvZ3Jlc3MsbnVsbCxmYWxzZSkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBfbUFycjpBcnJheTxzdHJpbmc+PVtdO1xyXG4gICAgcHJpdmF0ZSBfbU51bT0wO1xyXG4gICAgcHJpdmF0ZSBfbVA9MDtcclxuICAgIHByaXZhdGUgX21QMj0wO1xyXG5cclxuICAgIHByaXZhdGUgX19vbmxzVXJsQXJyT2sobHNVcmxBcnI6QXJyYXk8c3RyaW5nPil7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxsc1VybEFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG9iaj1sc1VybEFycltpXTtcclxuICAgICAgICAgICAgdmFyIHVybD1vYmpbXCJ1cmxcIl07XHJcbiAgICAgICAgICAgIHZhciBzMD11cmwuc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICB2YXIgczE9dXJsLnJlcGxhY2UoczBbczAubGVuZ3RoLTFdLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgcm9vdFVybD1zMTtcclxuICAgICAgICAgICAgdmFyIHR4dD1MYXlhLmxvYWRlci5nZXRSZXModXJsKTtcclxuICAgICAgICAgICAgdmFyIGpzT2JqPUpTT04ucGFyc2UodHh0KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX190aVF1VXJsKGpzT2JqW1wiZGF0YVwiXSxyb290VXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5fbUFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMuX21BcnJbaV07XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbkFyck9rKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uQXJyUCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25BcnJQKHApe1xyXG4gICAgICAgIHZhciBwTnVtPXAqKHRoaXMuX21OdW0rMSk7XHJcbiAgICAgICAgaWYocE51bT50aGlzLl9tUCl0aGlzLl9tUD1wTnVtO1xyXG4gICAgICAgIHRoaXMuX21QMj0odGhpcy5fbVAvdGhpcy5fbUFyci5sZW5ndGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBwTnVtPSh0aGlzLl9tUDIpKjAuOTg7XHJcbiAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tQcm9ncmVzcyE9bnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrUHJvZ3Jlc3MucnVuV2l0aChbcE51bV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgX19vbkFyck9rKCl7XHJcbiAgICAgICAgdGhpcy5fbU51bSs9MTtcclxuICAgICAgICBpZih0aGlzLl9tTnVtPj10aGlzLl9tQXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh0aGlzLl91cmxMaXN0LExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoKT0+e1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tPay5ydW4oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fdGlRdVVybChvYmosdXJsOnN0cmluZz1cIlwiKXtcclxuICAgICAgICBpZihvYmpbXCJwcm9wc1wiXSE9bnVsbCAmJiBvYmpbXCJwcm9wc1wiXVtcIm1lc2hQYXRoXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgdmFyIG1lc2hQYXRoPXVybCtvYmpbXCJwcm9wc1wiXVtcIm1lc2hQYXRoXCJdO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YobWVzaFBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbUFyci5wdXNoKG1lc2hQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWxzOkFycmF5PGFueT49b2JqW1wicHJvcHNcIl1bXCJtYXRlcmlhbHNcIl07XHJcbiAgICAgICAgICAgIGlmKG1hdGVyaWFscyE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGlpPTA7aWk8bWF0ZXJpYWxzLmxlbmd0aDtpaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGF0aD11cmwrbWF0ZXJpYWxzW2lpXVtcInBhdGhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKHBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2gocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9ialtcImNvbXBvbmVudHNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgY29tcG9uZW50czpBcnJheTxhbnk+PW9ialtcImNvbXBvbmVudHNcIl07XHJcbiAgICAgICAgICAgIGlmKGNvbXBvbmVudHMubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaTAgPSAwOyBpMCA8IGNvbXBvbmVudHMubGVuZ3RoOyBpMCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBjb21wb25lbnRzW2kwXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihjb21wW1wiYXZhdGFyXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFwYXRoPXVybCtjb21wW1wiYXZhdGFyXCJdW1wicGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbUFyci5pbmRleE9mKGFwYXRoKTwwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21BcnIucHVzaChhcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tcFtcImxheWVyc1wiXSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcnM6QXJyYXk8YW55Pj1jb21wW1wibGF5ZXJzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpMSA9IDA7IGkxIDwgbGF5ZXJzLmxlbmd0aDsgaTErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheWVyID0gbGF5ZXJzW2kxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZXM6QXJyYXk8YW55Pj1sYXllcltcInN0YXRlc1wiXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IHN0YXRlcy5sZW5ndGg7IGkyKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbaTJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGlwUGF0aD11cmwrc3RhdGVbXCJjbGlwUGF0aFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9tQXJyLmluZGV4T2YoY2xpcFBhdGgpPDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tQXJyLnB1c2goY2xpcFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY2hpbGQ6QXJyYXk8YW55Pj1vYmpbXCJjaGlsZFwiXTtcclxuICAgICAgICBpZihjaGlsZCE9bnVsbCAmJiBjaGlsZC5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8Y2hpbGQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9fdGlRdVVybChjaGlsZFtpXSx1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJleHBvcnQgY2xhc3MgV215TG9hZE1hdHN7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfdGhpcztcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdldFRoaXMoKTpXbXlMb2FkTWF0c3tcclxuICAgICAgICBpZihXbXlMb2FkTWF0cy5fdGhpcz09bnVsbCl7XHJcbiAgICAgICAgICAgIFdteUxvYWRNYXRzLl90aGlzPW5ldyBXbXlMb2FkTWF0cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gV215TG9hZE1hdHMuX3RoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2tPazpMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIF9jYWxsYmFja1Byb2dyZXNzOkxheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbmxvYWQzZCh1cmxMaXN0OkFycmF5PHN0cmluZz4sY2FsbGJhY2tPazpMYXlhLkhhbmRsZXIsY2FsbGJhY2tQcm9ncmVzcz86TGF5YS5IYW5kbGVyKXtcclxuICAgICAgICB0aGlzLl9jYWxsYmFja09rPWNhbGxiYWNrT2s7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcz1jYWxsYmFja1Byb2dyZXNzO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsTGlzdCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uVXJsQXJyT2ssW3VybExpc3RdKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21hdHNVcmxBcnI6QXJyYXk8c3RyaW5nPj1bXTtcclxuICAgIHByaXZhdGUgX21hdE9rPWZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfbWF0TnVtPTA7XHJcbiAgICBwcml2YXRlIF9tYXRQPTA7XHJcbiAgICBwcml2YXRlIF9tYXRQMj0wO1xyXG5cclxuICAgIHByaXZhdGUgX19vblVybEFyck9rKHVybExpc3Q6QXJyYXk8c3RyaW5nPil7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx1cmxMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgdXJsPXVybExpc3RbaV07XHJcbiAgICAgICAgICAgIC8vIHZhciB0eHQ9TGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XHJcbiAgICAgICAgICAgIC8vIHZhciBqc09iaj1KU09OLnBhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgIHZhciBqc09iaj1MYXlhLmxvYWRlci5nZXRSZXModXJsKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhcnI9dXJsLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgdmFyIG1hdHNVcmw9dXJsLnJlcGxhY2UoYXJyW2Fyci5sZW5ndGgtMV0sXCJcIik7XHJcbiAgICAgICAgICAgIHZhciBhcnJheTpBcnJheTxhbnk+PVtdO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXk9anNPYmpbXCJtYXRzXCJdO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJyYXkubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBhcnJheVtqXTtcclxuICAgICAgICAgICAgICAgIGlmKG9ialtcInRhcmdldE5hbWVcIl09PVwiXCIpY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF0VXJsPW1hdHNVcmwrb2JqW1wibWF0VXJsXCJdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0c1VybEFyci5wdXNoKG1hdFVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5fbWF0c1VybEFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdXJsPXRoaXMuX21hdHNVcmxBcnJbaV07XHJcbiAgICAgICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuX19vbk1hdEFyck9rKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5fX29uTWF0QXJyUCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25NYXRBcnJQKHApe1xyXG4gICAgICAgIHZhciBwTnVtPXAqKHRoaXMuX21hdE51bSsxKTtcclxuICAgICAgICBpZihwTnVtPnRoaXMuX21hdFApdGhpcy5fbWF0UD1wTnVtO1xyXG4gICAgICAgIHRoaXMuX21hdFAyPSh0aGlzLl9tYXRQL3RoaXMuX21hdHNVcmxBcnIubGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLl9jYWxsYmFja1Byb2dyZXNzIT1udWxsKXtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tQcm9ncmVzcy5ydW5XaXRoKFt0aGlzLl9tYXRQMl0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9fb25NYXRBcnJPaygpe1xyXG4gICAgICAgIHRoaXMuX21hdE51bSs9MTtcclxuICAgICAgICBpZih0aGlzLl9tYXROdW0+PXRoaXMuX21hdHNVcmxBcnIubGVuZ3RoKXtcclxuICAgICAgICAgICAgaWYodGhpcy5fY2FsbGJhY2tPayE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFja09rLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxuZXhwb3J0IGNsYXNzIFdteVNoYWRlck1zZ3tcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtXHR0YXJnZXRcdOWvueixoVxyXG4gICAgICogQHBhcmFtXHRtYXRcdOadkOi0qFxyXG4gICAgICogQHBhcmFtXHRzaGFkZXJVcmxcdHNoYWRlcueahOWcsOWdgFxyXG4gICAgICogQHBhcmFtXHRpc05ld01hdGVyaWFcdOaYr+WQpuaWsOadkOi0qFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFNoYWRlcih0YXJnZXQsIG1hdDpMYXlhLkJhc2VNYXRlcmlhbCwgc2hhZGVyVXJsOnN0cmluZywgaXNOZXdNYXRlcmlhPWZhbHNlLCBwRGF0YT86YW55KTpMYXlhLkJhc2VNYXRlcmlhbHtcclxuICAgICAgICB2YXIgcmVuZGVyZXI6TGF5YS5CYXNlUmVuZGVyO1xyXG4gICAgICAgIHZhciBzaGFyZWRNYXRlcmlhbDogTGF5YS5CYXNlTWF0ZXJpYWw7XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgcmVuZGVyZXI9KHRhcmdldCBhcyBMYXlhLlNraW5uZWRNZXNoU3ByaXRlM0QpLnNraW5uZWRNZXNoUmVuZGVyZXI7XHJcbiAgICAgICAgICAgIGlmKHJlbmRlcmVyPT1udWxsKXJldHVybjtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9cmVuZGVyZXIuc2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyPSh0YXJnZXQgYXMgTGF5YS5NZXNoU3ByaXRlM0QpLm1lc2hSZW5kZXJlcjtcclxuICAgICAgICAgICAgaWYocmVuZGVyZXI9PW51bGwpcmV0dXJuO1xyXG4gICAgICAgICAgICBzaGFyZWRNYXRlcmlhbD1yZW5kZXJlci5zaGFyZWRNYXRlcmlhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoaXNOZXdNYXRlcmlhKXtcclxuICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWw9c2hhcmVkTWF0ZXJpYWwuY2xvbmUoKTtcclxuICAgICAgICAgICAgcmVuZGVyZXIuc2hhcmVkTWF0ZXJpYWw9c2hhcmVkTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG5cdFx0Zm9yKHZhciBrZXkgaW4gbWF0KXtcclxuXHRcdFx0dHJ5IHtcclxuICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsW2tleV09bWF0W2tleV07XHJcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHNoYWRlclVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5zaGFkZXJDb25tcGxldGUsW3NoYXJlZE1hdGVyaWFsLHBEYXRhXSkpO1xyXG4gICAgICAgIHJldHVybiBzaGFyZWRNYXRlcmlhbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzaGFkZXJDb25tcGxldGUoc2hhcmVkTWF0ZXJpYWw6TGF5YS5CYXNlTWF0ZXJpYWwsIHBEYXRhOmFueSwgZGF0YSl7XHJcbiAgICAgICAgaWYoZGF0YT09bnVsbClyZXR1cm47XHJcbiAgICAgICAgdmFyIHhtbD1udWxsXHJcbiAgICAgICAgdHJ5XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4bWwgPSBMYXlhLlV0aWxzLnBhcnNlWE1MRnJvbVN0cmluZyhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB4bWxOb2RlOk5vZGUgPSB4bWwuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICAgIHZhciBzaGFkZXJOYW1lPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKHhtbE5vZGUsXCJuYW1lXCIpO1xyXG5cclxuICAgICAgICB2YXIgaSxvLG9OYW1lLHYwLHYxLGluaXRWO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVNYXA9e307XHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU1hcE5vZGU9dGhpcy5nZXROb2RlKHhtbE5vZGUsXCJhdHRyaWJ1dGVNYXBcIik7XHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU1hcEFycj10aGlzLmdldE5vZGVBcnIoYXR0cmlidXRlTWFwTm9kZSxcImRhdGFcIik7XHJcbiAgICAgICAgZm9yKGk9MDtpPGF0dHJpYnV0ZU1hcEFyci5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbyA9IGF0dHJpYnV0ZU1hcEFycltpXTtcclxuICAgICAgICAgICAgb05hbWU9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcIm5hbWVcIik7XHJcbiAgICAgICAgICAgIHYwPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKG8sXCJ2MFwiKTtcclxuICAgICAgICAgICAgYXR0cmlidXRlTWFwW29OYW1lXT10aGlzLmdldFYodjAsXCJpbnRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdW5pZm9ybU1hcD17fTtcclxuICAgICAgICB2YXIgdW5pZm9ybU1hcE5vZGU9dGhpcy5nZXROb2RlKHhtbE5vZGUsXCJ1bmlmb3JtTWFwXCIpO1xyXG4gICAgICAgIHZhciB1bmlmb3JtTWFwQXJyPXRoaXMuZ2V0Tm9kZUFycih1bmlmb3JtTWFwTm9kZSxcImRhdGFcIik7XHJcblxyXG4gICAgICAgIHZhciB3bXlWYWx1ZXM9c2hhcmVkTWF0ZXJpYWxbXCJ3bXlWYWx1ZXNcIl07XHJcbiAgICAgICAgaWYod215VmFsdWVzIT1udWxsICYmIHdteVZhbHVlc1tcImN1YmVcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICB2YXIgY3ViZU5hbWU9d215VmFsdWVzW1wiY3ViZVwiXTtcclxuICAgICAgICAgICAgaWYocERhdGEhPW51bGwgJiYgcERhdGFbXCJjdWJlRnVuXCJdIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIHBEYXRhW1wiY3ViZUZ1blwiXShzaGFyZWRNYXRlcmlhbCxjdWJlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGk9MDtpPHVuaWZvcm1NYXBBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGluaXRWPW51bGw7XHJcbiAgICAgICAgICAgIG8gPSB1bmlmb3JtTWFwQXJyW2ldO1xyXG4gICAgICAgICAgICBvTmFtZT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwibmFtZVwiKTtcclxuICAgICAgICAgICAgdjA9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUobyxcInYwXCIpO1xyXG4gICAgICAgICAgICB2MT10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwidjFcIik7XHJcbiAgICAgICAgICAgIHZhciB2QXJyPVtdO1xyXG4gICAgICAgICAgICB2QXJyWzBdPXRoaXMuZ2V0Vih2MCxcImludFwiKTtcclxuICAgICAgICAgICAgdkFyclsxXT10aGlzLmdldFYodjEsXCJpbnRcIik7XHJcbiAgICAgICAgICAgIHVuaWZvcm1NYXBbb05hbWVdPXZBcnI7XHJcblxyXG4gICAgICAgICAgICBpZih3bXlWYWx1ZXMhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgaW5pdFY9d215VmFsdWVzW29OYW1lXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9pbml0Vj10aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZShvLFwiaW5pdFZcIik7XHJcbiAgICAgICAgICAgIGlmKGluaXRWIT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGluaXRWID0gaW5pdFYuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoaW5pdFYubGVuZ3RoPT00KXtcclxuICAgICAgICAgICAgICAgICAgIHNoYXJlZE1hdGVyaWFsLl9zaGFkZXJWYWx1ZXMuc2V0VmVjdG9yKHZBcnJbMF0sbmV3IExheWEuVmVjdG9yNChwYXJzZUZsb2F0KGluaXRWWzBdKSxwYXJzZUZsb2F0KGluaXRWWzFdKSxwYXJzZUZsb2F0KGluaXRWWzJdKSxwYXJzZUZsb2F0KGluaXRWWzNdKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihpbml0Vi5sZW5ndGg9PTMpe1xyXG4gICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXRWZWN0b3IodkFyclswXSxuZXcgTGF5YS5WZWN0b3IzKHBhcnNlRmxvYXQoaW5pdFZbMF0pLHBhcnNlRmxvYXQoaW5pdFZbMV0pLHBhcnNlRmxvYXQoaW5pdFZbMl0pKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGluaXRWLmxlbmd0aD09Mil7XHJcbiAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFZlY3Rvcih2QXJyWzBdLG5ldyBMYXlhLlZlY3RvcjIocGFyc2VGbG9hdChpbml0VlswXSkscGFyc2VGbG9hdChpbml0VlsxXSkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaW5pdFYubGVuZ3RoPT0xKXtcclxuICAgICAgICAgICAgICAgICAgICBpZighaXNOYU4ocGFyc2VGbG9hdChpbml0VlswXSkpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlclZhbHVlcy5zZXROdW1iZXIodkFyclswXSxwYXJzZUZsb2F0KGluaXRWWzBdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdHJPYmo9aW5pdFZbMF0rXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3RyT2JqPT1cInRleFwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXg6TGF5YS5CYXNlVGV4dHVyZT1zaGFyZWRNYXRlcmlhbFtvTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5fc2hhZGVyVmFsdWVzLnNldFRleHR1cmUodkFyclswXSx0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc3ByaXRlRGVmaW5lcz1MYXlhLlNraW5uZWRNZXNoU3ByaXRlM0Quc2hhZGVyRGVmaW5lcztcclxuICAgICAgICB2YXIgbWF0ZXJpYWxEZWZpbmVzPUxheWEuQmxpbm5QaG9uZ01hdGVyaWFsLnNoYWRlckRlZmluZXM7XHJcbiAgICAgICAgaWYocERhdGEhPW51bGwpe1xyXG4gICAgICAgICAgICBpZihwRGF0YVtcInNwcml0ZURlZmluZXNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlRGVmaW5lcz1wRGF0YVtcInNwcml0ZURlZmluZXNcIl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocERhdGFbXCJtYXRlcmlhbERlZmluZXNcIl0hPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxEZWZpbmVzPXBEYXRhW1wibWF0ZXJpYWxEZWZpbmVzXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2hhZGVyPUxheWEuU2hhZGVyM0QuYWRkKHNoYWRlck5hbWUsYXR0cmlidXRlTWFwLHVuaWZvcm1NYXAsc3ByaXRlRGVmaW5lcyxtYXRlcmlhbERlZmluZXMpO1xyXG5cclxuICAgICAgICB2YXIgU3ViU2hhZGVyTm9kZT10aGlzLmdldE5vZGUoeG1sTm9kZSxcIlN1YlNoYWRlclwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJlbmRlck1vZGVOb2RlPXRoaXMuZ2V0Tm9kZSh4bWxOb2RlLFwicmVuZGVyTW9kZVwiKTtcclxuICAgICAgICBpZihyZW5kZXJNb2RlTm9kZSE9bnVsbCl7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXJNb2RlPXRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlKHJlbmRlck1vZGVOb2RlLFwidlwiKTtcclxuICAgICAgICAgICAgaWYocmVuZGVyTW9kZSE9bnVsbCl7XHJcbiAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbFtcInJlbmRlck1vZGVcIl09dGhpcy5nZXRWKHJlbmRlck1vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgUGFzc0Fycj10aGlzLmdldE5vZGVBcnIoU3ViU2hhZGVyTm9kZSxcIlBhc3NcIik7XHJcbiAgICAgICAgZm9yKGk9MDtpPFBhc3NBcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBwYXNzID0gUGFzc0FycltpXTtcclxuICAgICAgICAgICAgdmFyIHZzTm9kZTpOb2RlPXRoaXMuZ2V0Tm9kZShwYXNzLFwiVkVSVEVYXCIpO1xyXG4gICAgICAgICAgICB2YXIgdnM6c3RyaW5nPXZzTm9kZS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgdnMgPSB2cy5yZXBsYWNlKC8oXFxyKS9nLFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgcHNOb2RlOk5vZGU9dGhpcy5nZXROb2RlKHBhc3MsXCJGUkFHTUVOVFwiKTtcclxuICAgICAgICAgICAgdmFyIHBzOnN0cmluZz1wc05vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIHBzID0gcHMucmVwbGFjZSgvKFxccikvZyxcIlwiKTtcclxuICAgICAgICAgICAgaWYoaT4wKXtcclxuICAgICAgICAgICAgICAgIHZhciByczpMYXlhLlJlbmRlclN0YXRlPSBzaGFyZWRNYXRlcmlhbC5nZXRSZW5kZXJTdGF0ZSgwKS5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3JlbmRlclN0YXRlcy5wdXNoKHJzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGN1bGxOb2RlPXRoaXMuZ2V0Tm9kZShwYXNzLFwiY3VsbFwiKTtcclxuICAgICAgICAgICAgaWYoY3VsbE5vZGUhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1bGw9dGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWUoY3VsbE5vZGUsXCJ2XCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoY3VsbCE9bnVsbCB8fCBjdWxsIT1cIlwiKXtcclxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRNYXRlcmlhbC5nZXRSZW5kZXJTdGF0ZShpKS5jdWxsPXRoaXMuZ2V0VihjdWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2hhZGVyLmFkZFNoYWRlclBhc3ModnMscHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2hhcmVkTWF0ZXJpYWwuX3NoYWRlcj1zaGFkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRWKG9iajphbnksYmFja1R5cGU9XCJudWxsXCIpOmFueXtcclxuICAgICAgICB2YXIgdGVtcE5hbWVBcnIsdGVtcE9iaix0ZW1wVixpaTtcclxuICAgICAgICB0ZW1wTmFtZUFycj1vYmouc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgIGlmKHRlbXBOYW1lQXJyWzBdPT09XCJMYXlhXCIpe1xyXG4gICAgICAgICAgICB0ZW1wVj1MYXlhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRlbXBOYW1lQXJyWzBdPT09XCJsYXlhXCIpe1xyXG4gICAgICAgICAgICB0ZW1wVj1sYXlhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoaWk9MTtpaTx0ZW1wTmFtZUFyci5sZW5ndGg7aWkrKyl7XHJcbiAgICAgICAgICAgIHRlbXBWPXRlbXBWW3RlbXBOYW1lQXJyW2lpXV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRlbXBWIT1udWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRlbXBWO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGJhY2tUeXBlIT1cIm51bGxcIil7XHJcbiAgICAgICAgICAgIGlmKGJhY2tUeXBlPT1cImludFwiKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgYSBzdHJpbmcgaW4gdGhlIGZvcm1hdCBcIiNycmdnYmJcIiBvciBcInJyZ2diYlwiIHRvIHRoZSBjb3JyZXNwb25kaW5nXHJcbiAgICAgKiB1aW50IHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgVGhlIGNvbG9yIGluIHN0cmluZyBmb3JtYXQuXHJcbiAgICAgKiBAcmV0dXJuIFRoZSBjb2xvciBpbiB1aW50IGZvcm1hdC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29sb3JTdHJpbmdUb1VpbnQoY29sb3I6U3RyaW5nKTpudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXIoXCIweFwiICsgY29sb3IucmVwbGFjZShcIiNcIiwgXCJcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEF0dHJpYnV0ZXNWYWx1ZShub2RlOmFueSxrZXk6c3RyaW5nKXtcclxuICAgICAgICB2YXIgbm9kZVZhbHVlPW51bGw7XHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXM9bm9kZVtcImF0dHJpYnV0ZXNcIl07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBhdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgICAgICBpZihlbGVtZW50Lm5hbWU9PWtleSl7XHJcbiAgICAgICAgICAgICAgICBub2RlVmFsdWU9ZWxlbWVudFtcIm5vZGVWYWx1ZVwiXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Tm9kZSh4bWw6YW55LGtleTpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBjaGlsZE5vZGVzPXhtbC5jaGlsZE5vZGVzO1xyXG4gICAgICAgIHZhciBub2RlOmFueT1udWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgb2JqOmFueT1jaGlsZE5vZGVzW2ldO1xyXG4gICAgICAgICAgICBpZihvYmpbXCJub2RlTmFtZVwiXT09a2V5KXtcclxuICAgICAgICAgICAgICAgIG5vZGU9b2JqO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXROb2RlQXJyKHhtbDphbnksa2V5OnN0cmluZyk6QXJyYXk8Tm9kZT57XHJcbiAgICAgICAgdmFyIGNoaWxkTm9kZXM9eG1sLmNoaWxkTm9kZXM7XHJcbiAgICAgICAgdmFyIG5vZGVBcnI6QXJyYXk8Tm9kZT49W107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmo6YW55PWNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgIGlmKG9ialtcIm5vZGVOYW1lXCJdPT1rZXkpe1xyXG4gICAgICAgICAgICAgICAgbm9kZUFyci5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGVBcnI7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgV215X0xvYWRfTWFnIH0gZnJvbSBcIi4uL1dteV9Mb2FkX01hZ1wiO1xyXG5pbXBvcnQgeyBXbXlTaGFkZXJNc2cgfSBmcm9tIFwiLi9XbXlTaGFkZXJNc2dcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXbXlVdGlsczNEe1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmozZCh0YXJnZXQsb2JqTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQubmFtZT09b2JqTmFtZSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Ll9jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbzpMYXlhLlNwcml0ZTNEID0gdGFyZ2V0Ll9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgaWYgKG8uX2NoaWxkcmVuLmxlbmd0aCA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihvLm5hbWU9PW9iak5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcE9iaj10aGlzLmdldE9iajNkKG8sb2JqTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wT2JqIT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcE9iajtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRDaGlsZHJlbkNvbXBvbmVudCh0YXJnZXQsY2xhczphbnksYXJyPyk6QXJyYXk8YW55PntcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYXJyPT1udWxsKWFycj1bXTtcclxuXHJcbiAgICAgICAgdmFyIG9iaj10YXJnZXQuZ2V0Q29tcG9uZW50KGNsYXMpO1xyXG4gICAgICAgIGlmKG9iaj09bnVsbCl7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIGNsYXMpe1xyXG4gICAgICAgICAgICAgICAgb2JqPXRhcmdldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmohPW51bGwpe1xyXG4gICAgICAgICAgICBhcnIucHVzaChvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQuX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvOkxheWEuU3ByaXRlM0QgPSB0YXJnZXQuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmdldENoaWxkcmVuQ29tcG9uZW50KG8sY2xhcyxhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0U2hhZGVyQWxsKHRhcmdldCxtYXRzVXJsOnN0cmluZywgc2hhZGVyc1VybDpzdHJpbmcpe1xyXG4gICAgICAgIHZhciBuZXdNYXRzVXJsPW1hdHNVcmwrXCJ3bXlNYXRzLmpzb25cIjtcclxuICAgICAgICB2YXIgbmV3U2hhZGVyc1VybD1zaGFkZXJzVXJsO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQobmV3TWF0c1VybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsKG1hdHNVcmwsc2hhZGVyc1VybCxkYXRhKT0+e1xyXG4gICAgICAgICAgICBpZihkYXRhPT1udWxsKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIndteU1hdHMt5Ye66ZSZOlwiLG5ld01hdHNVcmwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBhcnJheTpBcnJheTxhbnk+PWRhdGFbXCJtYXRzXCJdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJyYXlbaV07XHJcbiAgICAgICAgICAgICAgICBpZihvYmpbXCJ0YXJnZXROYW1lXCJdPT1cIlwiKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldDNEPVdteVV0aWxzM0QuZ2V0T2JqM2QodGFyZ2V0LG9ialtcInRhcmdldE5hbWVcIl0pYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICAgICAgICAgIGlmKHRhcmdldDNEPT1udWxsKWNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hdFVybD1tYXRzVXJsK29ialtcIm1hdFVybFwiXTtcclxuICAgICAgICAgICAgICAgIHZhciBzaGFkZXJOYW1lVXJsPXNoYWRlcnNVcmwrb2JqW1wic2hhZGVyTmFtZVwiXStcIi50eHRcIjtcclxuICAgICAgICAgICAgICAgIExheWEuQmFzZU1hdGVyaWFsLmxvYWQobWF0VXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcywoX3RhcmdldDNEOkxheWEuU3ByaXRlM0QsX3NoYWRlck5hbWVVcmwsbSk9PntcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcERhdGE9e307XHJcbiAgICAgICAgICAgICAgICAgICAgcERhdGFbXCJjdWJlRnVuXCJdPShtLGN1YmVOYW1lKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBXbXlfTG9hZF9NYWcuZ2V0VGhpcy5nZXRDdWJlKGN1YmVOYW1lLG5ldyBMYXlhLkhhbmRsZXIodGhpcywoY3ViZSxpKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaT09MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbS5fc2hhZGVyVmFsdWVzLnNldFRleHR1cmUoTGF5YS5TY2VuZTNELlJFRkxFQ1RJT05URVhUVVJFLGN1YmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFdteVNoYWRlck1zZy5zZXRTaGFkZXIoX3RhcmdldDNELG0sX3NoYWRlck5hbWVVcmwsZmFsc2UscERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKF90YXJnZXQzRCE9bnVsbCAmJiBfdGFyZ2V0M0QucGFyZW50IT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RhcmdldDNELnBhcmVudC5yZW1vdmVDaGlsZChfdGFyZ2V0M0QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sW3RhcmdldDNELHNoYWRlck5hbWVVcmxdKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sW21hdHNVcmwsbmV3U2hhZGVyc1VybF0pLG51bGwsTGF5YS5Mb2FkZXIuSlNPTik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhbmlQbGF5KHRhcmdldCx0YXJnZXROYW1lLGFuaU5hbWUpOkxheWEuQW5pbWF0b3J7XHJcbiAgICAgICAgdmFyIHRhcmdldDNkOkxheWEuU3ByaXRlM0Q9dGhpcy5nZXRPYmozZCh0YXJnZXQsdGFyZ2V0TmFtZSkgYXMgTGF5YS5TcHJpdGUzRDtcclxuICAgICAgICB2YXIgdGFyZ2V0M2RfYW5pPXRhcmdldDNkLmdldENvbXBvbmVudChMYXlhLkFuaW1hdG9yKSBhcyBMYXlhLkFuaW1hdG9yO1xyXG4gICAgICAgIHRhcmdldDNkX2FuaS5wbGF5KGFuaU5hbWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGFyZ2V0M2RfYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBvblNoYWRvdyhkaXJlY3Rpb25MaWdodDpMYXlhLkRpcmVjdGlvbkxpZ2h0LHNoYWRvd1Jlc29sdXRpb249NTEyLHNoYWRvd1BDRlR5cGU9MSxzaGFkb3dEaXN0YW5jZTpudW1iZXI9MTAwLGlzU2hhZG93OmJvb2xlYW49dHJ1ZSl7XHJcbiAgICAgICAgLy/nga/lhYnlvIDlkK/pmLTlvbFcclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAvL+WPr+ingemYtOW9sei3neemu1xyXG4gICAgICAgIGRpcmVjdGlvbkxpZ2h0LnNoYWRvd0Rpc3RhbmNlID0gc2hhZG93RGlzdGFuY2U7XHJcbiAgICAgICAgLy/nlJ/miJDpmLTlvbHotLTlm77lsLrlr7hcclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dSZXNvbHV0aW9uID0gc2hhZG93UmVzb2x1dGlvbjtcclxuICAgICAgICAvL2RpcmVjdGlvbkxpZ2h0LnNoYWRvd1BTU01Db3VudD0xO1xyXG4gICAgICAgIC8v5qih57OK562J57qnLOi2iuWkp+i2iumrmCzmm7TogJfmgKfog71cclxuICAgICAgICBkaXJlY3Rpb25MaWdodC5zaGFkb3dQQ0ZUeXBlID0gc2hhZG93UENGVHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgb25DYXN0U2hhZG93KHRhcmdldCx0eXBlPTAsaXNTaGFkb3c9dHJ1ZSxpc0NoaWxkcmVuPXRydWUpe1xyXG4gICAgICAgIGlmKHRhcmdldCBpbnN0YW5jZW9mIExheWEuTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgdmFyIG1zM0Q9KHRhcmdldCBhcyBMYXlhLk1lc2hTcHJpdGUzRCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGU9PTApe1xyXG4gICAgICAgICAgICAgICAgLy/mjqXmlLbpmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHR5cGU9PTEpe1xyXG4gICAgICAgICAgICAgICAgLy/kuqfnlJ/pmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLmNhc3RTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHR5cGU9PTIpe1xyXG4gICAgICAgICAgICAgICAgLy/mjqXmlLbpmLTlvbFcclxuICAgICAgICAgICAgICAgIG1zM0QubWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgICAgIC8v5Lqn55Sf6Zi05b2xXHJcbiAgICAgICAgICAgICAgICBtczNELm1lc2hSZW5kZXJlci5jYXN0U2hhZG93ID0gaXNTaGFkb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0IGluc3RhbmNlb2YgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKXtcclxuICAgICAgICAgICAgdmFyIHNtczNkPSh0YXJnZXQgYXMgTGF5YS5Ta2lubmVkTWVzaFNwcml0ZTNEKTtcclxuICAgICAgICAgICAgaWYodHlwZT09MCl7XHJcbiAgICAgICAgICAgICAgICBzbXMzZC5za2lubmVkTWVzaFJlbmRlcmVyLnJlY2VpdmVTaGFkb3cgPSBpc1NoYWRvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHR5cGU9PTEpe1xyXG4gICAgICAgICAgICAgICAgc21zM2Quc2tpbm5lZE1lc2hSZW5kZXJlci5jYXN0U2hhZG93PWlzU2hhZG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihpc0NoaWxkcmVuKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubnVtQ2hpbGRyZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHRhcmdldC5nZXRDaGlsZEF0KGkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNhc3RTaGFkb3cob2JqLHR5cGUsaXNTaGFkb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJnYjJoZXgocixnLGIpe1xyXG4gICAgICAgIHZhciBfaGV4PVwiI1wiICsgdGhpcy5oZXgocikgK3RoaXMuIGhleChnKSArIHRoaXMuaGV4KGIpO1xyXG4gICAgICAgIHJldHVybiBfaGV4LnRvVXBwZXJDYXNlKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZXgoeCl7XHJcbiAgICAgICAgeD10aGlzLm9uTnVtVG8oeCk7XHJcbiAgICAgICAgcmV0dXJuIChcIjBcIiArIHBhcnNlSW50KHgpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIG9uTnVtVG8obil7XHJcblx0XHRpZigobitcIlwiKS5pbmRleE9mKFwiLlwiKT49MCl7XHJcblx0XHQgICAgbj1wYXJzZUZsb2F0KG4udG9GaXhlZCgyKSk7XHJcbiAgICAgICAgfVxyXG5cdFx0cmV0dXJuIG47XHJcblx0fVxyXG5cclxuICAgIFxyXG4gICBwdWJsaWMgc3RhdGljIGxlcnBGKGE6bnVtYmVyLCBiOm51bWJlciwgczpudW1iZXIpOm51bWJlcntcclxuICAgICAgICByZXR1cm4gKGEgKyAoYiAtIGEpICogcyk7XHJcbiAgICB9XHJcblxyXG59Il19
