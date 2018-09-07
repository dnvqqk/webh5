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
var UnitAnimator = /** @class */ (function (_super) {
    __extends(UnitAnimator, _super);
    function UnitAnimator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._aniName = "";
        _this._eveInit = true;
        return _this;
        // public aaa(p){
        //     //console.log(p[2]);
        // }
        // public PlaySFX(p){
        //    // console.log(p[2]);
        // }
    }
    /*
    "Idle",
    "Walk",
    "Jump1",
    "Jump2",
    "Punch1",
    "Punch2",
    "Punch3",
    */
    UnitAnimator.prototype.onAwake = function () {
        this.mySprite3D = this.owner;
        this._animator = this.mySprite3D.getComponent(Laya.Animator);
        this._controllerLaye = this._animator.getControllerLayer();
        this._playState = this._animator.getCurrentAnimatorPlayState();
        var walk = this._controllerLaye._statesMap["Walk"];
        walk.speed = 1.2;
        var Punch1 = this._controllerLaye._statesMap["Punch1"];
        Punch1.speed = 1.3;
        var Punch2 = this._controllerLaye._statesMap["Punch2"];
        Punch2.speed = 1;
        var Punch3 = this._controllerLaye._statesMap["Punch3"];
        Punch3.speed = 1;
        var state = this._animator.getDefaultState();
        this.onAnimator(state.name);
        //Laya.timer.frameLoop(1,this,this.__loop);
        //this.onKeyPress
    };
    UnitAnimator.prototype.onAnimator = function (aniName, isZPlay) {
        if (isZPlay === void 0) { isZPlay = false; }
        if (this._animator == null)
            return;
        if (this._aniName != aniName) {
            this._eveInit = true;
        }
        if (this._aniName == aniName && !isZPlay)
            return;
        this._aniName = aniName;
        var tt = 0.05;
        if (!isZPlay) {
            this._animator.crossFade(aniName, tt);
        }
        else {
            this._animator.play(aniName, 0, 0);
        }
        this._currentState = this._controllerLaye._statesMap[aniName];
        this._currentClip = this._currentState._clip;
    };
    UnitAnimator.prototype.onPreRender = function () {
        if (this._animator == null)
            return;
        // this._currentState
        // this._currentClip
        var aa = 1 / this._currentClip._duration;
        var playTime = this._playState._normalizedPlayTime;
        if (playTime != null) {
            var cF = WmyUtils.onNumTo(playTime, 2);
            for (var i = 0; i < this._currentClip._events.length; i++) {
                var eve = this._currentClip._events[i];
                var ff = (WmyUtils.onNumTo(eve.time, 2) / this._currentClip._duration);
                var eveF = ff;
                eveF = WmyUtils.onNumTo(eveF, 2);
                if (Math.abs(cF - eveF) < 0.02 * aa) {
                    if (this._eveInit) {
                        this._eveInit = false;
                        this.mySprite3D.event(eve.eventName, [eve.params]);
                    }
                }
            }
            if (playTime <= 0.1 || playTime == 1) {
                this._eveInit = true;
            }
            //var fNum=this._currentClip._duration*(this._currentClip._frameRate/60)
        }
    };
    return UnitAnimator;
}(Laya.Script));
//# sourceMappingURL=UnitAnimator.js.map