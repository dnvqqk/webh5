var WmyLoadJs = (function () {
    function WmyLoadJs() {
        WmyLoadJs.jsUrl = "https://dnvqqk.github.io/webh5/";
        WmyLoadJs.ggJsv = "?0.3";
        WmyLoadJs.assetUrl = "";
        WmyLoadJs.jsV = "?9_18_1337";
        try {
            WmyLoadJs.d = document;
            WmyLoadJs.html = WmyLoadJs.d["body"]["children"][0];
        }
        catch (error) { }
        if (WmyLoadJs.d.URL.indexOf("file:///") >= 0) {
            WmyLoadJs.jsUrl = "../";
        }
        WmyLoadJs.mainJs();
    }
    WmyLoadJs.ggJssArr = function () {
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.core.min.js");
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.webgl.min.js");
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.ani.min.js");
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.d3.js");
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.physics3D.js");
        WmyLoadJs._ggJssArr.push("libs/layaLibs/laya.html.js");
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
        WmyLoadJs._jssArr.push("js/wmyUtilsH5/3d/WmyAnimator3d.js");
        WmyLoadJs._jssArr.push("js/game/GameCamera.js");
        WmyLoadJs._jssArr.push("js/game/GameHit.js");
        WmyLoadJs._jssArr.push("js/game/BaseRoleKz.js");
        WmyLoadJs._jssArr.push("js/game/PlayerKz.js");
        WmyLoadJs._jssArr.push("js/game/EnemyKz.js");
        WmyLoadJs._jssArr.push("js/LayaAir3D.js");
    };
    WmyLoadJs.mainJs = function () {
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
        var jsLoad = function () {
            if (WmyLoadJs.html != null && WmyLoadJs.html["innerText"] != null) {
                WmyLoadJs.html["innerText"] = "正在加载启动程序...(" + num + "/" + totalNum + ")";
            }
            if (num < totalNum) {
                var urlJs = jsUrlArr[num];
                WmyLoadJs.loadJs([urlJs], "", "", jsLoad);
                num += 1;
            }
        };
        jsLoad();
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
            require(jsArr1, fun, function (e) {
                if (WmyLoadJs.html != null && WmyLoadJs.html["innerText"] != null) {
                    WmyLoadJs.html["innerText"] = "正在加载启动程序...(网络不稳定,出现故障,请刷新页面...)^-^!";
                }
            });
        }
    };
    WmyLoadJs.jsUrl = "";
    WmyLoadJs.ggJsv = "";
    WmyLoadJs.assetUrl = "";
    WmyLoadJs.jsV = "";
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