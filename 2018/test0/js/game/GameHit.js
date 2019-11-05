var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameHit = (function (_super) {
    __extends(GameHit, _super);
    function GameHit() {
        _super.call(this);
        this._hitsObjArr = [];
    }
    Object.defineProperty(GameHit, "Event_hit", {
        get: function () {
            return "GameHit.hit";
        },
        enumerable: true,
        configurable: true
    });
    GameHit.prototype.onAwake = function () {
        this.obj = this.owner;
        this.hitBox = this.obj.parent;
        this.hitBox.active = false;
        this.myObj = this.getMyObj(this.obj, "hit_");
        if (this.myObj != null) {
            this.baseRoleKz = this.myObj.getComponent(BaseRoleKz);
        }
        if (this.myObj == null) {
            this.myObj = this.obj;
        }
    };
    GameHit.prototype.getMyObj = function (obj, objName) {
        if (obj == null)
            return null;
        if (obj.name.indexOf(objName) >= 0) {
            return obj;
        }
        else {
            return this.getMyObj(obj.parent, objName);
        }
    };
    GameHit.prototype.onUpdate = function () {
        //console.log(1111);
    };
    GameHit.prototype.onTriggerEnter = function (other) {
        if (!this.hitBox.active)
            return;
        var obj3d = other.owner;
        if (!obj3d.activeInHierarchy)
            return;
        if (obj3d == this.myObj)
            return;
        if (obj3d.name.indexOf("hit_") < 0)
            return;
        if (this._hitsObjArr.indexOf(obj3d) >= 0)
            return;
        this._hitsObjArr.push(obj3d);
        var roleKz = obj3d.getComponent(BaseRoleKz);
        if (roleKz != null && this.baseRoleKz != null) {
            var data = [roleKz];
            this.obj.event(GameHit.Event_hit, data);
        }
    };
    GameHit.prototype.onTriggerExit = function (other) {
        // if(other.owner==this.myObj)return;
        // if(this._hitsObjArr.indexOf(other.owner)>=0){
        //     this._hitsObjArr.splice(this._hitsObjArr.indexOf(other.owner),1);
        // }
    };
    GameHit.prototype.onDisable = function () {
        this._hitsObjArr = [];
    };
    return GameHit;
}(Laya.Script));
//# sourceMappingURL=GameHit.js.map