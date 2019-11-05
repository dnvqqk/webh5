var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WmyAnimator3d = (function (_super) {
    __extends(WmyAnimator3d, _super);
    function WmyAnimator3d() {
        _super.apply(this, arguments);
        this._aniName = "";
    }
    Object.defineProperty(WmyAnimator3d, "Event_playComplete", {
        //播放完成
        get: function () {
            return "WmyAnimator3d.playComplete";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WmyAnimator3d, "Event_playEvent", {
        //播放事件触发
        get: function () {
            return "WmyAnimator3d.playEvent";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WmyAnimator3d, "Event_playQh", {
        //切换动画
        get: function () {
            return "WmyAnimator3d.playQh";
        },
        enumerable: true,
        configurable: true
    });
    WmyAnimator3d.prototype.onPlayQh = function (playQh) {
        this._playQh = playQh;
        return this;
    };
    Object.defineProperty(WmyAnimator3d.prototype, "mySprite3D", {
        get: function () {
            return this._mySprite3D;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WmyAnimator3d.prototype, "animator", {
        get: function () {
            return this._animator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WmyAnimator3d.prototype, "controllerLaye", {
        get: function () {
            return this._controllerLaye;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WmyAnimator3d.prototype, "playState", {
        get: function () {
            return this._playState;
        },
        enumerable: true,
        configurable: true
    });
    WmyAnimator3d.prototype.onAwake = function () {
        this._mySprite3D = this.owner;
        this._animator = this.mySprite3D.getComponent(Laya.Animator);
        this._controllerLaye = this._animator.getControllerLayer();
        this._playState = this._animator.getCurrentAnimatorPlayState();
        var state = this._animator.getDefaultState();
        this.onAnimator(state.name);
        //Laya.timer.frameLoop(1,this,this.__loop);
        //this.onKeyPress
    };
    Object.defineProperty(WmyAnimator3d.prototype, "aniName", {
        get: function () {
            return this._aniName;
        },
        enumerable: true,
        configurable: true
    });
    WmyAnimator3d.prototype.onAnimator = function (aniName, isZPlay, t, onPlayComplete, onPlayEvent) {
        var _this = this;
        if (isZPlay === void 0) { isZPlay = false; }
        if (t === void 0) { t = 0; }
        if (this._animator == null)
            return;
        if (this._aniName == aniName && !isZPlay)
            return;
        var pAniName = this._aniName;
        this._aniName = aniName;
        if (pAniName != "" && aniName != "" && aniName != pAniName) {
            var arrData = [this.aniName, pAniName];
            this.mySprite3D.event(WmyAnimator3d.Event_playQh, arrData);
            if (this._playQh != null) {
                this._playQh.runWith(arrData);
            }
            Laya.timer.clearAll(this);
        }
        Laya.timer.once(t, this, function () {
            var tt = 0.05;
            if (!isZPlay) {
                _this._animator.crossFade(aniName, tt);
            }
            else {
                _this._animator.play(aniName, 0, 0);
            }
            var currentState = _this._controllerLaye._statesMap[aniName];
            _this.onPlayCompleteEvent(currentState, onPlayComplete);
            _this.onPlayEvent(currentState, onPlayEvent);
        });
        return this;
    };
    WmyAnimator3d.prototype.onPlayCompleteEvent = function (currentState, onPlayComplete) {
        var _this = this;
        var tNum = currentState._clip.duration();
        tNum *= (1 / currentState.speed) * 1000;
        var playComplete = function () {
            var arrData = [_this.aniName];
            _this.mySprite3D.event(WmyAnimator3d.Event_playComplete, arrData);
            if (onPlayComplete != null) {
                onPlayComplete.runWith([arrData]);
            }
        };
        if (currentState._clip.islooping) {
            Laya.timer.loop(tNum, this, playComplete);
        }
        else {
            Laya.timer.once(tNum, this, playComplete);
        }
    };
    WmyAnimator3d.prototype.onPlayEvent = function (currentState, onPlayEvent) {
        var _this = this;
        var t = (1 / currentState.speed) * 1000;
        for (var i = 0; i < currentState._clip._events.length; i++) {
            var eve = currentState._clip._events[i];
            var ff = (WmyUtils.onNumTo(eve.time, 2) * t);
            var playEvent = function (eve) {
                var arrData = [_this.aniName, eve];
                _this.mySprite3D.event(WmyAnimator3d.Event_playEvent, arrData);
                if (onPlayEvent != null) {
                    onPlayEvent.runWith([arrData]);
                }
            };
            if (currentState._clip.islooping) {
                Laya.timer.loop(ff, this, playEvent, [eve]);
            }
            else {
                Laya.timer.once(ff, this, playEvent, [eve]);
            }
        }
    };
    return WmyAnimator3d;
}(Laya.Script));
//# sourceMappingURL=WmyAnimator3d.js.map