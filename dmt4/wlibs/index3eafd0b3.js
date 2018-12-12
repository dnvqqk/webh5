(function (window) {
    var _http=new window["XMLHttpRequest"]();
    window.loadLib = function (src) {
        var fun=function(resolve){
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.async = false;
            script.onload =resolve;
            document.body.appendChild(script);
        }
        return new Promise(fun);
    }

    var load = function (url) {
        _http.open("get", url, true);
        _http.onload = function (e) {
            var status = _http.status != undefined ? _http.status : 200;
            if (status === 200 || status === 204 || status === 0) {
                complete();
            }
            else {
                console.log("[" + _http.status + "]" + _http.statusText + ":" + _http.responseURL);
            }
        };
        
        _http.send();
    }
    var num=0;
    var totalNum=0;
    var complete = function () {
        window.versionData = JSON.parse(_http.responseText);
        var jsUrlArr = [];
        
        if(window.jsUrlArr){
            window.jsUrlArr.forEach(function (jsUrl) {
                if(jsUrl.length>0){
                    var jsUrl1=getUrl(jsUrl);
                    jsUrlArr.push(jsUrl1);
                }
            });
        }
        totalNum = jsUrlArr.length;
        num = 0;

        onHtmlText();

        jsUrlArr.forEach(function (jsUrl) {
            var fun=function(){
                num+=1;
                onHtmlText();
                if(num>=totalNum){
                    onHtmlText(true);
                }
            }
            window.loadLib(jsUrl).then(fun);
        });
    }
    
    var getUrl = function (url) {
        var jsUrl = url;
        if (window.versionData && window.versionData[jsUrl] != null) {
            jsUrl = window.versionData[jsUrl];
        }
        return jsUrl;
    }

    var onHtmlText = function (ok) {
        var html;
        try {
            html = document["body"]["children"][0];
        }
        catch (error) { }
        if (html != null && html["innerText"] != null) {
            if(!ok){
                html["innerText"] = "正在启动...(" + num + "/" + totalNum + ")";
            }
            else{
                html["innerText"] = "";
            }
        }
    }

    window["wmyVTime"]="?"+Date.now();
    load("version.json"+window["wmyVTime"]);
})(window)
