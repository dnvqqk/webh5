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
var WEventDispatcher_1 = require("./WEventDispatcher");
var WHttpRequest_1 = require("./WHttpRequest");
var WEvent_1 = require("./WEvent");
/**
 * <code>Loader</code> 类可用来加载文本、JSON、XML、二进制、图像等资源。
 */
var WLoader = /** @class */ (function (_super) {
    __extends(WLoader, _super);
    function WLoader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**@private 自定义解析不派发complete事件，但会派发loaded事件，手动调用endLoad方法再派发complete事件*/
        _this._customParse = false;
        return _this;
    }
    /**
     * 加载资源。加载错误会派发 Event.ERROR 事件，参数为错误信息。
     * @param	this.url			资源地址。
     * @param	this.type		(default = null)资源类型。可选值为：Loader.TEXT、Loader.JSON、Loader.XML、Loader.BUFFER、Loader.IMAGE、Loader.SOUND、Loader.ATLAS、Loader.FONT。如果为null，则根据文件后缀分析类型。
     */
    WLoader.prototype.load = function (url, type) {
        if (type === void 0) { type = null; }
        this._url = url;
        this._type = type;
        this._data = null;
        var contentType = type;
        if (WLoader.preLoadedMap[this.url]) {
            this.onLoaded(WLoader.preLoadedMap[this.url]);
        }
        else {
            if (!this._http) {
                this._http = new WHttpRequest_1.WHttpRequest();
                this._http.on(WEvent_1.WEvent.ERROR, this, this.onError);
                this._http.on(WEvent_1.WEvent.COMPLETE, this, this.onLoaded);
            }
            this._http.send(this.url, null, "get", contentType);
        }
    };
    /**@private */
    WLoader.prototype.onError = function (message) {
        this.event(WEvent_1.WEvent.ERROR, message);
    };
    /**
     * 资源加载完成的处理函数。
     * @param	this.data 数据。
     */
    WLoader.prototype.onLoaded = function (data) {
        if (data === void 0) { data = null; }
        this.parsePLFData(data);
        this.complete(data);
    };
    WLoader.prototype.parsePLFData = function (plfData) {
        var type;
        var filePath;
        var fileDic;
        for (var type in plfData) {
            fileDic = plfData[this.type];
            switch (this.type) {
                case "json":
                case "text":
                    for (filePath in fileDic) {
                        WLoader.preLoadedMap[filePath] = fileDic[filePath];
                    }
                    break;
                default:
                    for (filePath in fileDic) {
                        WLoader.preLoadedMap[filePath] = fileDic[filePath];
                    }
            }
        }
    };
    /**
     * 加载完成。
     * @param	this.data 加载的数据。
     */
    WLoader.prototype.complete = function (data) {
        this._data = data;
        if (this._customParse) {
            this.event(WEvent_1.WEvent.LOADED, this.data instanceof Array ? [this.data] : this.data);
        }
        else {
            WLoader._loaders.push(this);
            if (!WLoader._isWorking)
                WLoader.checkNext();
        }
    };
    /**@private */
    WLoader.checkNext = function () {
        WLoader._isWorking = true;
        var startTimer = Date.now();
        var thisTimer = startTimer;
        while (WLoader._startIndex < WLoader._loaders.length) {
            thisTimer = Date.now();
            WLoader._loaders[WLoader._startIndex].endLoad();
            WLoader._startIndex++;
            if (Date.now() - startTimer > WLoader.maxTimeOut) {
                console.warn("loader callback cost a long time:" + (Date.now() - startTimer) + " this.url=" + WLoader._loaders[WLoader._startIndex - 1].url);
                Laya.timer.frameOnce(1, null, WLoader.checkNext);
                return;
            }
        }
        WLoader._loaders.length = 0;
        WLoader._startIndex = 0;
        WLoader._isWorking = false;
    };
    /**
     * 结束加载，处理是否缓存及派发完成事件 <code>Event.COMPLETE</code> 。
     * @param	content 加载后的数据
     */
    WLoader.prototype.endLoad = function (content) {
        if (content === void 0) { content = null; }
        content && (this._data = content);
        this.event(WEvent_1.WEvent.PROGRESS, 1);
        this.event(WEvent_1.WEvent.COMPLETE, this.data instanceof Array ? [this.data] : this.data);
    };
    Object.defineProperty(WLoader.prototype, "url", {
        /**加载地址。*/
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WLoader.prototype, "type", {
        /**加载类型。*/
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WLoader.prototype, "data", {
        /**返回的数据。*/
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    /**文本类型，加载完成后返回文本。*/
    WLoader.TEXT = "text";
    /**JSON 类型，加载完成后返回json数据。*/
    WLoader.JSON = "json";
    /**每帧加载完成回调使用的最大超时时间，如果超时，则下帧再处理，防止帧卡顿。*/
    WLoader.maxTimeOut = 100;
    /** @private 已加载的数据文件。*/
    WLoader.preLoadedMap = {};
    /**@private */
    WLoader._loaders = [];
    /**@private */
    WLoader._isWorking = false;
    /**@private */
    WLoader._startIndex = 0;
    return WLoader;
}(WEventDispatcher_1.WEventDispatcher));
exports.WLoader = WLoader;
},{"./WEvent":3,"./WEventDispatcher":4,"./WHttpRequest":7}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Loader_1 = require("./Loader");
var MainJs = /** @class */ (function () {
    function MainJs() {
        try {
            MainJs.d = document;
            MainJs.html = MainJs.d["body"]["children"][0];
        }
        catch (error) { }
        var load = new Loader_1.WLoader();
        load.load("version.json?" + Date.now(), "json");
        load.on("complete", this, this.loadOk);
    }
    MainJs.prototype.loadOk = function (data) {
        var _this = this;
		MainJs.data = data;
		loadLib(MainJs.getUrl("wlibs/require.min.js"));
        setTimeout(function () {
            _this.onMain();
        }, 1200);
    };
	//wmy
    MainJs.JssArr = function () {
        var jsUrlArr = [];
        jsUrlArr.push("wlibs/laya.core.js");
        jsUrlArr.push("wlibs/laya.webgl.js");
        jsUrlArr.push("wlibs/laya.ani.js");
        jsUrlArr.push("wlibs/laya.d3.js");
        jsUrlArr.push("wlibs/laya.physics3D.js");
        jsUrlArr.push("wlibs/laya.html.js");
        //
        jsUrlArr.push("wlibs/fairygui.js");
		jsUrlArr.push("wlibs/TweenMax.min.js");
		//
        jsUrlArr.push("js/bundle.js");
        return jsUrlArr;
    };


    MainJs.prototype.onMain = function () {
         //正在加载启动程序...
		 MainJs.jsUrlArr = [];
		 var JssArr=MainJs.JssArr();
		 JssArr.forEach(function (js) {
			MainJs.jsUrlArr.push(MainJs.getUrl(js));
		 });
		 MainJs.totalNum = MainJs.jsUrlArr.length;
		 MainJs.num = 0;
		 MainJs.jsLoad();
	};
	
	MainJs.jsLoad = function () {
		if (MainJs.html != null && MainJs.html["innerText"] != null) {
			MainJs.html["innerText"] = "正在加载启动程序...(" + MainJs.num + "/" + MainJs.totalNum + ")";
		}
		if (MainJs.num < MainJs.totalNum) {
			var urlJs = MainJs.jsUrlArr[MainJs.num];
			MainJs.loadJs([urlJs], MainJs.jsLoad);
			MainJs.num += 1;
		}
	}
	
	MainJs.loadJs = function (jsArr, fun) {
        if (jsArr.length > 0) {
            requirejs(jsArr, fun, function (e) {
                if (MainJs.html != null && MainJs.html["innerText"] != null) {
                    MainJs.html["innerText"] = "正在加载启动程序...(网络不稳定,出现故障,请刷新页面...)^-^!";
                }
            });
        }
    };
	
    MainJs.getUrl = function (url) {
        var jsUrl = url;
        if (MainJs.data[jsUrl] != null) {
            jsUrl = MainJs.data[jsUrl];
        }
        return jsUrl;
    }
    
    return MainJs;
}());
new MainJs();
},{"./Loader":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * <code>Event</code> 是事件类型的集合。一般当发生事件时，<code>Event</code> 对象将作为参数传递给事件侦听器。
 */
var WEvent = /** @class */ (function () {
    function WEvent() {
    }
    /**
     * 设置事件数据。
     * @param	this.type 事件类型。
     * @param	this.currentTarget 事件目标触发对象。
     * @param	this.target 事件当前冒泡对象。
     * @return 返回当前 Event 对象。
     */
    WEvent.prototype.setTo = function (type, currentTarget, target) {
        this.type = this.type;
        this.currentTarget = this.currentTarget;
        this.target = this.target;
        return this;
    };
    /**
     * 阻止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 (this.currentTarget) 中的任何事件侦听器。
     */
    WEvent.prototype.stopPropagation = function () {
        this._stoped = true;
    };
    /** 定义 error 事件对象的 this.type 属性值。*/
    WEvent.ERROR = "error";
    /** 定义 complete 事件对象的 this.type 属性值。*/
    WEvent.COMPLETE = "complete";
    /** 定义 loaded 事件对象的 this.type 属性值。*/
    WEvent.LOADED = "loaded";
    /** 定义 progress 事件对象的 this.type 属性值。*/
    WEvent.PROGRESS = "progress";
    return WEvent;
}());
exports.WEvent = WEvent;
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WEventHandler_1 = require("./WEventHandler");
/**
 * <code>EventDispatcher</code> 类是可调度事件的所有类的基类。
 */
var WEventDispatcher = /** @class */ (function () {
    function WEventDispatcher() {
    }
    /**
     * 检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
     * @param	type 事件的类型。
     * @return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
     */
    WEventDispatcher.prototype.hasListener = function (type) {
        var listener = this._events && this._events[type];
        return !!listener;
    };
    /**
     * 派发事件。
     * @param type	事件类型。
     * @param data	（可选）回调数据。<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p ，且 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
     * @return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
     */
    WEventDispatcher.prototype.event = function (type, data) {
        if (data === void 0) { data = null; }
        if (!this._events || !this._events[type])
            return false;
        var listeners = this._events[type];
        if (listeners.run) {
            if (listeners.once) {
                delete this._events[type];
            }
            data != null ? listeners.runWith(data) : listeners.run();
        }
        else {
            for (var i = 0, n = listeners.length; i < n; i++) {
                var listener = listeners[i];
                if (listener) {
                    (data != null) ? listener.runWith(data) : listener.run();
                }
                if (!listener || listener.once) {
                    listeners.splice(i, 1);
                    i--;
                    n--;
                }
            }
            if (listeners.length === 0 && this._events)
                delete this._events[type];
        }
        return true;
    };
    /**
     * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
     * @param type		事件的类型。
     * @param caller	事件侦听函数的执行域。
     * @param listener	事件侦听函数。
     * @param args		（可选）事件侦听函数的回调参数。
     * @return 此 EventDispatcher 对象。
     */
    WEventDispatcher.prototype.on = function (type, caller, listener, args) {
        if (args === void 0) { args = null; }
        return this._createListener(type, caller, listener, args, false);
    };
    /**
     * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
     * @param type		事件的类型。
     * @param caller	事件侦听函数的执行域。
     * @param listener	事件侦听函数。
     * @param args		（可选）事件侦听函数的回调参数。
     * @return 此 EventDispatcher 对象。
     */
    WEventDispatcher.prototype.once = function (type, caller, listener, args) {
        if (args === void 0) { args = null; }
        return this._createListener(type, caller, listener, args, true);
    };
    /**@private */
    WEventDispatcher.prototype._createListener = function (type, caller, listener, args, once, offBefore) {
        if (offBefore === void 0) { offBefore = true; }
        //移除之前相同的监听
        offBefore && this.off(type, caller, listener, once);
        //使用对象池进行创建回收
        var handler = WEventHandler_1.WEventHandler.create(caller || this, listener, args, once);
        this._events || (this._events = {});
        var events = this._events;
        //默认单个，每个对象只有多个监听才用数组，节省一个数组的消耗
        if (!events[type])
            events[type] = handler;
        else {
            if (!events[type].run)
                events[type].push(handler);
            else
                events[type] = [events[type], handler];
        }
        return this;
    };
    /**
     * 从 EventDispatcher 对象中删除侦听器。
     * @param type		事件的类型。
     * @param caller	事件侦听函数的执行域。
     * @param listener	事件侦听函数。
     * @param onceOnly	（可选）如果值为 true ,则只移除通过 this.once 方法添加的侦听器。
     * @return 此 EventDispatcher 对象。
     */
    WEventDispatcher.prototype.off = function (type, caller, listener, onceOnly) {
        if (onceOnly === void 0) { onceOnly = false; }
        if (!this._events || !this._events[type])
            return this;
        var listeners = this._events[type];
        if (listener != null) {
            if (listeners.run) {
                if ((!caller || listeners.caller === caller) && (listener == null || listeners.method === listener) && (!onceOnly || listeners.once)) {
                    delete this._events[type];
                    listeners.recover();
                }
            }
            else {
                var count = 0;
                for (var i = 0, n = listeners.length; i < n; i++) {
                    var item = listeners[i];
                    if (!item) {
                        count++;
                        continue;
                    }
                    if (item && (!caller || item.caller === caller) && (listener == null || item.method === listener) && (!onceOnly || item.once)) {
                        count++;
                        listeners[i] = null;
                        item.recover();
                    }
                }
                //如果全部移除，则删除索引
                if (count === n)
                    delete this._events[type];
            }
        }
        return this;
    };
    /**
     * 从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
     * @param type	（可选）事件类型，如果值为 null，则移除本对象所有类型的侦听器。
     * @return 此 EventDispatcher 对象。
     */
    WEventDispatcher.prototype.offAll = function (type) {
        if (type === void 0) { type = null; }
        var events = this._events;
        if (!events)
            return this;
        if (type) {
            this._recoverHandlers(events[type]);
            delete events[type];
        }
        else {
            for (var name in events) {
                this._recoverHandlers(events[name]);
            }
            this._events = null;
        }
        return this;
    };
    /**
     * 移除caller为target的所有事件监听
     * @param	caller caller对象
     */
    WEventDispatcher.prototype.offAllCaller = function (caller) {
        if (caller && this._events) {
            for (var name in this._events) {
                this.off(name, caller, null);
            }
        }
        return this;
    };
    WEventDispatcher.prototype._recoverHandlers = function (arr) {
        if (!arr)
            return;
        if (arr.run) {
            arr.recover();
        }
        else {
            for (var i = arr.length - 1; i > -1; i--) {
                if (arr[i]) {
                    arr[i].recover();
                    arr[i] = null;
                }
            }
        }
    };
    return WEventDispatcher;
}());
exports.WEventDispatcher = WEventDispatcher;
},{"./WEventHandler":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WHandler_1 = require("./WHandler");
var WEventHandler = /** @class */ (function (_super) {
    __extends(WEventHandler, _super);
    function WEventHandler(caller, method, args, once) {
        return _super.call(this, caller, method, args, once) || this;
    }
    WEventHandler.prototype.recover = function () {
        if (this._id > 0) {
            this._id = 0;
            WEventHandler._pool.push(this.clear());
        }
    };
    /**
     * 从对象池内创建一个Handler，默认会执行一次回收，如果不需要自动回收，设置once参数为false。
     * @param caller	执行域(this)。
     * @param method	回调方法。
     * @param args		（可选）携带的参数。
     * @param this.once		（可选）是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
     * @return 返回创建的handler实例。
     */
    WEventHandler.create = function (caller, method, args, once) {
        if (args === void 0) { args = null; }
        if (once === void 0) { once = true; }
        if (WEventHandler._pool.length)
            return WEventHandler._pool.pop().setTo(caller, method, args, once);
        return new WEventHandler(caller, method, args, once);
    };
    return WEventHandler;
}(WHandler_1.WHandler));
exports.WEventHandler = WEventHandler;
},{"./WHandler":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * <p><code>Handler</code> 是事件处理器类。</p>
 * <p>推荐使用 Handler.create() 方法从对象池创建，减少对象创建消耗。创建的 Handler 对象不再使用后，可以使用 Handler.recover() 将其回收到对象池，回收后不要再使用此对象，否则会导致不可预料的错误。</p>
 * <p><b>注意：</b>由于鼠标事件也用本对象池，不正确的回收及调用，可能会影响鼠标事件的执行。</p>
 */
var WHandler = /** @class */ (function () {
    /**
     * 根据指定的属性值，创建一个 <code>Handler</code> 类的实例。
     * @param	this.caller 执行域。
     * @param	this.method 处理函数。
     * @param	this.args 函数参数。
     * @param	this.once 是否只执行一次。
     */
    function WHandler(caller, method, args, once) {
        if (caller === void 0) { caller = null; }
        if (method === void 0) { method = null; }
        if (args === void 0) { args = null; }
        if (once === void 0) { once = false; }
        /** 表示是否只执行一次。如果为true，回调后执行recover()进行回收，回收后会被再利用，默认为false 。*/
        this.once = false;
        /**@private */
        this._id = 0;
        this.setTo(caller, method, args, once);
    }
    /**
     * 设置此对象的指定属性值。
     * @param	this.caller 执行域(this)。
     * @param	this.method 回调方法。
     * @param	this.args 携带的参数。
     * @param	this.once 是否只执行一次，如果为true，执行后执行recover()进行回收。
     * @return  返回 handler 本身。
     */
    WHandler.prototype.setTo = function (caller, method, args, once) {
        this._id = WHandler._gid++;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    };
    /**
     * 执行处理器。
     */
    WHandler.prototype.run = function () {
        if (this.method == null)
            return null;
        var id = this._id;
        var result = this.method.apply(this.caller, this.args);
        this._id === id && this.once && this.recover();
        return result;
    };
    /**
     * 执行处理器，并携带额外数据。
     * @param	data 附加的回调数据，可以是单数据或者Array(作为多参)。
     */
    WHandler.prototype.runWith = function (data) {
        if (this.method == null)
            return null;
        var id = this._id;
        if (data == null)
            var result = this.method.apply(this.caller, this.args);
        else if (!this.args && !data.unshift)
            result = this.method.call(this.caller, data);
        else if (this.args)
            result = this.method.apply(this.caller, this.args.concat(data));
        else
            result = this.method.apply(this.caller, data);
        this._id === id && this.once && this.recover();
        return result;
    };
    /**
     * 清理对象引用。
     */
    WHandler.prototype.clear = function () {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    };
    /**
     * 清理并回收到 Handler 对象池内。
     */
    WHandler.prototype.recover = function () {
        if (this._id > 0) {
            this._id = 0;
            WHandler._pool.push(this.clear());
        }
    };
    /**
     * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置once参数为false。
     * @param	this.caller 执行域(this)。
     * @param	this.method 回调方法。
     * @param	this.args 携带的参数。
     * @param	this.once 是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
     * @return  返回创建的handler实例。
     */
    WHandler.create = function (caller, method, args, once) {
        if (args === void 0) { args = null; }
        if (once === void 0) { once = true; }
        if (WHandler._pool.length)
            return WHandler._pool.pop().setTo(caller, method, args, once);
        return new WHandler(caller, method, args, once);
    };
    /*[DISABLE-ADD-VARIABLE-DEFAULT-VALUE]*/
    /**@private handler对象池*/
    WHandler._pool = [];
    /**@private */
    WHandler._gid = 1;
    return WHandler;
}());
exports.WHandler = WHandler;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WEventDispatcher_1 = require("./WEventDispatcher");
var WEvent_1 = require("./WEvent");
/**
 * <p> <code>HttpRequest</code> 通过封装 HTML <code>XMLHttpRequest</code> 对象提供了对 HTTP 协议的完全的访问，包括做出 POST 和 HEAD 请求以及普通的 GET 请求的能力。 <code>HttpRequest</code> 只提供以异步的形式返回 Web 服务器的响应，并且能够以文本或者二进制的形式返回内容。</p>
 * <p><b>注意：</b>建议每次请求都使用新的 <code>HttpRequest</code> 对象，因为每次调用该对象的send方法时，都会清空之前设置的数据，并重置 HTTP 请求的状态，这会导致之前还未返回响应的请求被重置，从而得不到之前请求的响应结果。
 */
var WHttpRequest = /** @class */ (function (_super) {
    __extends(WHttpRequest, _super);
    function WHttpRequest() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        /**@private */
        _this_1._http = new window["XMLHttpRequest"]();
        return _this_1;
    }
    /**
     * 发送 HTTP 请求。
     * @param	this.url				请求的地址。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。
     * @param	this.data			(default = null)发送的数据。
     * @param	method			(default = "get")用于请求的 HTTP 方法。值包括 "get"、"post"、"head"。
     * @param	responseType	(default = "text")Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
     * @param	headers			(default = null) HTTP 请求的头部信息。参数形如key-value数组：key是头部的名称，不应该包括空白、冒号或换行；value是头部的值，不应该包括换行。比如["Content-Type", "application/json"]。
     */
    WHttpRequest.prototype.send = function (url, data, method, responseType, headers) {
        if (data === void 0) { data = null; }
        if (method === void 0) { method = "get"; }
        if (responseType === void 0) { responseType = "text"; }
        if (headers === void 0) { headers = null; }
        this._responseType = responseType;
        this._data = null;
        var _this = this;
        var http = this._http;
        this.http.open(method, url, true);
        if (headers) {
            for (var i = 0; i < headers.length; i++) {
                this.http.setRequestHeader(headers[i++], headers[i]);
            }
        }
        this.http.responseType = responseType != "arraybuffer" ? "text" : "arraybuffer";
        this.http.onerror = function (e) {
            _this._onError(e);
        };
        this.http.onabort = function (e) {
            _this._onAbort(e);
        };
        this.http.onload = function (e) {
            _this._onLoad(e);
        };
        this.http.send(this.data);
    };
    /**
     * @private
     * 请求中断的侦听处理函数。
     * @param	e 事件对象。
     */
    WHttpRequest.prototype._onAbort = function (e) {
        this.error("Request was aborted by user");
    };
    /**
     * @private
     * 请求出错侦的听处理函数。
     * @param	e 事件对象。
     */
    WHttpRequest.prototype._onError = function (e) {
        this.error("Request failed Status:" + this._http.status + " text:" + this._http.statusText);
    };
    /**
     * @private
     * 请求消息返回的侦听处理函数。
     * @param	e 事件对象。
     */
    WHttpRequest.prototype._onLoad = function (e) {
        var http = this._http;
        var status = this.http.status != undefined ? this.http.status : 200;
        if (status === 200 || status === 204 || status === 0) {
            this.complete();
        }
        else {
            this.error("[" + this.http.status + "]" + this.http.statusText + ":" + this.http.responseURL);
        }
    };
    /**
     * @private
     * 请求错误的处理函数。
     * @param	message 错误信息。
     */
    WHttpRequest.prototype.error = function (message) {
        this.clear();
        console.warn(this.url, message);
        this.event(WEvent_1.WEvent.ERROR, message);
    };
    /**
     * @private
     * 请求成功完成的处理函数。
     */
    WHttpRequest.prototype.complete = function () {
        this.clear();
        var flag = true;
        try {
            if (this._responseType === "json") {
                this._data = JSON.parse(this._http.responseText);
            }
            else if (this._responseType === "xml") {
                //this._data = Utils.parseXMLFromString(this._http.responseText);
            }
            else {
                this._data = this._http.response || this._http.responseText;
            }
        }
        catch (e) {
            flag = false;
            this.error(e.message);
        }
        flag && this.event(WEvent_1.WEvent.COMPLETE, this._data instanceof Array ? [this._data] : this._data);
    };
    /**
     * @private
     * 清除当前请求。
     */
    WHttpRequest.prototype.clear = function () {
        var http = this._http;
        this.http.onerror = this.http.onabort = this.http.onprogress = this.http.onload = null;
    };
    Object.defineProperty(WHttpRequest.prototype, "url", {
        /** 请求的地址。*/
        get: function () {
            return this._http.responseURL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WHttpRequest.prototype, "data", {
        /** 返回的数据。*/
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WHttpRequest.prototype, "http", {
        /**
         * 本对象所封装的原生 XMLHttpRequest 引用。
         */
        get: function () {
            return this._http;
        },
        enumerable: true,
        configurable: true
    });
    return WHttpRequest;
}(WEventDispatcher_1.WEventDispatcher));
exports.WHttpRequest = WHttpRequest;
},{"./WEvent":3,"./WEventDispatcher":4}]},{},[2])