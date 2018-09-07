// 程序入口
var WmyLoadJs = /** @class */ (function () {
    function WmyLoadJs() {
        var wmy = document["all"]["wmy"];
        if (wmy != null) {
            try {
                var assetUrl = wmy["attributes"]["assetUrl"]["nodeValue"];
                WmyLoadJs.assetUrl = assetUrl;
            }
            catch (error) { }
            try {
                var V = wmy["attributes"]["V"]["nodeValue"];
                WmyLoadJs.V = V;
            }
            catch (error) { }
        }
        if (document.URL.indexOf("file:///") >= 0) {
            WmyLoadJs.jsUrl = "../";
        }
        var layaJs = '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.core.min.js' + WmyLoadJs.V + '"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.webgl.min.js' + WmyLoadJs.V + '"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.ani.min.js' + WmyLoadJs.V + '"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.d3.js' + WmyLoadJs.V + '"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.physics3D.js' + WmyLoadJs.V + '"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/layaLibs/laya.html.min.js' + WmyLoadJs.V + '"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/wmyList/fairygui/fairygui.js' + WmyLoadJs.V + '"></script>' +
            '<script src="' + WmyLoadJs.jsUrl + 'libs/wmyList/greensock/minified/TweenMax.min.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/wmyUtilsH5/Wmy_Load_Mag.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/wmyUtilsH5/WmyUtils.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/wmyUtilsH5/3d/WmyUtils3D.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/wmyUtilsH5/3d/WmyShaderMsg.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/wmyUtilsH5/3d/WmyLoadMats.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/wmyUtilsH5/3d/WmyLoad3d.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/wmyUtilsH5/3d/WmyPhysicsWorld_Character.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/player/PlayerKz.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/player/UnitAnimator.js' + WmyLoadJs.V + '"></script>' +
            '<script src="js/LayaAir3D.js' + WmyLoadJs.V + '"></script>' +
            "";
        WmyLoadJs.writeJs(layaJs);
    }
    WmyLoadJs.writeJs = function (txt) {
        document.write(txt);
    };
    WmyLoadJs.assetUrl = "";
    WmyLoadJs.V = "";
    WmyLoadJs.jsUrl = "https://dnvqqk.github.io/webh5/";
    return WmyLoadJs;
}());
new WmyLoadJs();
//# sourceMappingURL=WmyLoadJs.js.map