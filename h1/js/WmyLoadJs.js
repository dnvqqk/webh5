// 程序入口
var WmyLoadJs = (function () {
    function WmyLoadJs() {
        WmyLoadJs.jsUrl = "../";
        if (document.URL.indexOf("file:///") < 0) {
            WmyLoadJs.jsUrl = "https://dnvqqk.github.io/webh5/";
        }
        var layaJs = '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.core.min.js"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.webgl.min.js"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.ani.min.js"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.d3.min.js"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.physics3D.js"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.html.min.js"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/wmyList/fairygui/fairygui.js"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/wmyList/greensock/minified/TweenMax.min.js"></script>' +
            "";
        WmyLoadJs.writeJs(layaJs);
    }
    WmyLoadJs.writeJs = function (txt) {
        document.write(txt);
    };
    WmyLoadJs.loadJs = function (url) {
        var script = document.createElement("script");
        script.async = false;
        script.src = url;
        document.body.appendChild(script);
    };
    return WmyLoadJs;
}());
new WmyLoadJs();
//# sourceMappingURL=WmyLoadJs.js.map