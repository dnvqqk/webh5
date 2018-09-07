// 程序入口
var WmyLoadJs = (function () {
    function WmyLoadJs() {
        var jsUrl = "../";
        if (document.URL.indexOf("file:///") < 0) {
            jsUrl = "https://dnvqqk.github.io/webh5/";
        }
        var layaJs = '<script src="' + jsUrl + 'libs/layaLibs/laya.core.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.webgl.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.ani.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.d3.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.physics3D.js"></script>' +
            '<script src="' + jsUrl + 'libs/layaLibs/laya.html.min.js"></script>' +
            '<script src="' + jsUrl + 'libs/wmyList/fairygui/fairygui.js"></script>' +
            '<script src="' + jsUrl + 'libs/wmyList/greensock/minified/TweenMax.min.js"></script>' +
            "";
        this.writeJs(layaJs);
    }
    WmyLoadJs.prototype.loadJs = function (url) {
        var script = document.createElement("script");
        script.async = false;
        script.src = url;
        document.body.appendChild(script);
    };
    WmyLoadJs.prototype.writeJs = function (txt) {
        document.write(txt);
    };
    return WmyLoadJs;
}());
new WmyLoadJs();
//# sourceMappingURL=WmyLoadJs.js.map