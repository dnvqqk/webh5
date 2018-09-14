var WmyLoadJs = /** @class */ (function () {
    function WmyLoadJs() {
        var _this = this;
        try {
            WmyLoadJs.d = document;
            WmyLoadJs.html = WmyLoadJs.d["body"]["children"][0];
        }
        catch (error) { }
        WmyLoadJs.html["innerText"] = "正在加载启动程序...(?/?)";
        WmyLoadJs.jsUrl = "https://dnvqqk.github.io/webh5/";
        if (WmyLoadJs.d.URL.indexOf("file:///") >= 0) {
            WmyLoadJs.jsUrl = "../";
        }
        var jsArr = [];
        jsArr.push("libs/layaLibs/laya.core.min.js");
        WmyLoadJs.loadJs(jsArr, WmyLoadJs.ggJsv, WmyLoadJs.jsUrl, function () {
            var load = new laya.net.LoaderManager();
            WmyLoadJs.loadInfoV = "?" + Date.now();
            load.load("wmyData/loadInfo.txt" + WmyLoadJs.loadInfoV, laya.utils.Handler.create(_this, function (data) {
                try {
                    WmyLoadJs.assetUrl = data[0]["assetUrl"];
                    if (WmyLoadJs.d.URL.indexOf("file:///") >= 0) {
                        WmyLoadJs.assetUrl = "";
                    }
                }
                catch (error) { }
                try {
                    WmyLoadJs.jsV = data[0]["jsV"];
                }
                catch (error) { }
                WmyLoadJs.mainJs();
            }), null, laya.net.Loader.JSON);
        });
    }
    WmyLoadJs.ggJssArr = function () {
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.webgl.min.js");
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.ani.min.js");
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.d3.min.js");
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.physics3D.js");
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.html.min.js");
        WmyLoadJs._ggJssArr.push("libs/wmyList/fairygui/fairygui.js");
        WmyLoadJs._ggJssArr.push("libs/wmyList/greensock/minified/TweenMax.min.js");
    };
    WmyLoadJs.jssArr = function () {
        WmyLoadJs._jssArr.push("js/wmyUtilsH5/Wmy_Load_Mag.js");
        WmyLoadJs._jssArr.push("js/wmyUtilsH5/WmyUtils.js");
        WmyLoadJs._jssArr.push("js/wmyUtilsH5/3d/WmyUtils3D.js");
        WmyLoadJs._jssArr.push("js/wmyUtilsH5/3d/WmyShaderMsg.js");
        WmyLoadJs._jssArr.push("js/wmyUtilsH5/3d/WmyLoadMats.js");
        WmyLoadJs._jssArr.push("js/wmyUtilsH5/3d/WmyLoad3d.js");
        WmyLoadJs._jssArr.push("js/wmyUtilsH5/3d/WmyPhysicsWorld_Character.js");
        WmyLoadJs._jssArr.push("js/player/PlayerKz.js");
        WmyLoadJs._jssArr.push("js/player/UnitAnimator.js");
        WmyLoadJs._jssArr.push("js/LayaAir3D.js");
    };
    WmyLoadJs.mainJs = function () {
        var _this = this;
        WmyLoadJs.ggJssArr();
        WmyLoadJs.jssArr();
        //正在加载启动程序...
        //document
        var jsUrlArr = [];
        WmyLoadJs._ggJssArr.forEach(function (js) {
            jsUrlArr.push(WmyLoadJs.jsUrl + js + WmyLoadJs.ggJsv);
        });
        WmyLoadJs._jssArr.forEach(function (js) {
            jsUrlArr.push(WmyLoadJs.assetUrl + js + WmyLoadJs.jsV);
        });
        var totalNum = jsUrlArr.length;
        var num = 0;
        WmyLoadJs.html["innerText"] = "正在加载启动程序...(" + num + "/" + totalNum + ")";
        for (var i = 0; i < jsUrlArr.length; i++) {
            var url = jsUrlArr[i] + "";
            WmyLoadJs.html["innerText"] = url;
        }
        jsUrlArr.forEach(function (js) {
            var load = new laya.net.LoaderManager();
            load.load(js, laya.utils.Handler.create(_this, function () {
                num += 1;
                WmyLoadJs.html["innerText"] = "正在加载启动程序...(" + num + "/" + totalNum + ")";
                if (num == totalNum) {
                    WmyLoadJs.loadJs(WmyLoadJs._ggJssArr, WmyLoadJs.ggJsv, WmyLoadJs.jsUrl, function () {
                        WmyLoadJs.loadJs(WmyLoadJs._jssArr, WmyLoadJs.jsV, WmyLoadJs.assetUrl);
                    });
                }
            }), null, laya.net.Loader.TEXT);
        });
    };
    WmyLoadJs.loadJs = function (jsArr, v, jsUrl, fun) {
        if (v === void 0) { v = ""; }
        if (jsUrl === void 0) { jsUrl = ""; }
        var jsArr1 = [];
        jsArr.forEach(function (js) {
            if (WmyLoadJs._jsArr.indexOf(js) < 0) {
                WmyLoadJs._jsArr.push(js);
                jsArr1.push(jsUrl + js + v);
            }
        });
        if (jsArr1.length > 0) {
            require(jsArr1, fun);
        }
    };
    WmyLoadJs.ggJsv = "?0.2";
    WmyLoadJs.loadInfoV = "";
    WmyLoadJs.assetUrl = "";
    WmyLoadJs.jsV = "";
    WmyLoadJs.jsUrl = "";
    WmyLoadJs._ggJssArr = [];
    WmyLoadJs._jssArr = [];
    // private static importJs(jsArr:Array<string>, v="",jsUrl=""){
    //     jsArr.forEach(js => {
    //         WmyLoadJs.writeJs(js,v,jsUrl);
    //     });
    // }
    // private static writeJs(url, v="",jsUrl=""){
    //     document.write('<script src="'+jsUrl+url+v+'"></script>');
    // }
    // public static writeJs(url, v="",jsUrl=""){
    //     var script = document.createElement("script");
    //     script.async = false;
    //     script.src = jsUrl+url+v;
    //     document.body.appendChild(script);
    // }
    WmyLoadJs._jsArr = [];
    return WmyLoadJs;
}());
new WmyLoadJs();
//# sourceMappingURL=WmyLoadJs.js.map