var MainJs = (function () {
    function MainJs() {
        MainJs.writeJs("wmyData/require.min.js");
        var t = "?" + Date.now();
        MainJs.writeJs("js/WmyLoadJs.js", t);
    }
    MainJs.writeJs = function (url, v, jsUrl) {
        if (v === void 0) { v = ""; }
        if (jsUrl === void 0) { jsUrl = ""; }
        var script = document.createElement("script");
        script.async = false;
        script.src = jsUrl + url + v;
        document.body.appendChild(script);
    };
    return MainJs;
}());
new MainJs();
//# sourceMappingURL=MainJs.js.map