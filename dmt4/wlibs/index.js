(function (window) {
    window.onerror=function (msg,url,line,column,detail){
        //wmy
        if(!this["vConsole"]){
            this["vConsole"] = new window["VConsole"]();
            this["vConsole"].switchPos.startY = 40;
            console.error("出错啦，\n"+msg+"\n"+detail.stack);
        }
    }

    window.jsUrlArr = [];
    var _http=new window["XMLHttpRequest"]();
    window.loadLib = function (src) {
        if(!window.versionData){
            window.jsUrlArr.push(src);
        }
        else{
            var fun=function(resolve){
                if (window.versionData && window.versionData[src] != null) {
                    src = window.versionData[src];
                }

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = src;
                script.async = false;
                script.onload =resolve;
                document.body.appendChild(script);
            }
            return new Promise(fun);
        }
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
        
        totalNum = window.jsUrlArr.length;
        num = 0;

        onHtmlText();

        window.jsUrlArr.forEach(function (jsUrl) {
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

    var onHtmlText = function (ok) {
        var loaderDiv;
        var loaderTxt;
        try {
            loaderDiv = document.querySelector('.loader');
            loaderTxt = document.querySelector('.loaderTxt');
            // document.body.removeChild(div);
            // html = document["body"]["children"][0];
        }
        catch (error) { }
        if (loaderDiv != null) {
            if(!ok){
                loaderTxt["innerText"] = "正在启动...(" + num + "/" + totalNum + ")";
            }
            else{
                document.body.removeChild(loaderDiv);
            }
        }
    }

    setTimeout(function(){
        window["wmyVTime"]="?"+Date.now();
        load("version.json"+window["wmyVTime"]);
    },50);
})(window)
