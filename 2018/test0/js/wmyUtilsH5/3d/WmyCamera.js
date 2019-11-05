var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WmyCamera = (function (_super) {
    __extends(WmyCamera, _super);
    function WmyCamera() {
        _super.call(this);
        this._upNum = 0;
        this._distance = 0;
        this._angleNum = 0;
        this._dx = 0;
        this._dy = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this._isMouseDown = false;
        //上次记录的两个触模点之间距离
        this._lastDistance = 0;
        this._lastX = 0;
        this._lastZ = 0;
        this._touchesNum = 0;
        this._v3 = Laya.Vector3.ZERO;
        this._rotaionSpeed = 0.01;
        if (WmyCamera._this == null) {
            WmyCamera._this = this;
        }
    }
    Object.defineProperty(WmyCamera, "getThis", {
        get: function () {
            return WmyCamera._this;
        },
        enumerable: true,
        configurable: true
    });
    WmyCamera.prototype.onAwake = function () {
        this.cam = this.owner;
        this.scene3D = this.cam.scene;
        this._camBox = this.cam.parent;
        this._upNum = this.cam.transform.localPositionY;
        this._distance = this.cam.transform.localPositionZ;
    };
    WmyCamera.prototype.onAddEvent = function (target) {
        this._target = target || Laya.stage;
        this._target.on(Laya.Event.MOUSE_DOWN, this, this.stageMouseDown);
        this._target.on(Laya.Event.MOUSE_UP, this, this.stageMouseUp);
        this._target.on(Laya.Event.MOUSE_OUT, this, this.stageMouseUp);
        this._target.on(Laya.Event.MOUSE_MOVE, this, this.stageMouseMove);
        this._target.on(Laya.Event.MOUSE_WHEEL, this, this.stageMouseWheel);
    };
    WmyCamera.prototype.onSetTarget = function (targetPos) {
        TweenMax.killTweensOf(this);
        if (targetPos != null) {
            this._camBox.transform.position = targetPos;
        }
    };
    WmyCamera.prototype.onSetInfo = function (upNum, distance, angleNum, upNum1, upNum2, offXZ) {
        TweenMax.killTweensOf(this);
        this._upNum = upNum || this.cam.transform.localPositionY;
        this._upNum1 = upNum1;
        this._upNum2 = upNum2;
        this._distance = distance || this.cam.transform.localPositionZ;
        this._angleNum = angleNum || this._angleNum;
        this._dx = this.lastMouseX = 0;
        this._dy = this.lastMouseY = 0;
        if (offXZ != null) {
            this._offXZ = Laya.Vector4.ZERO;
            this._offXZ.x = this._camBox.transform.position.x - Math.abs(offXZ);
            this._offXZ.y = this._camBox.transform.position.x + Math.abs(offXZ);
            this._offXZ.z = this._camBox.transform.position.z - Math.abs(offXZ);
            this._offXZ.w = this._camBox.transform.position.z + Math.abs(offXZ);
        }
    };
    WmyCamera.prototype.stageMouseDown = function (e) {
        var touches = e.touches;
        if (touches)
            this._touchesNum = touches.length;
        if (e.currentTarget != this._target)
            return;
        this._isMouseDown = true;
        TweenMax.killTweensOf(this);
        if (touches && touches.length == 2) {
            this._lastDistance = this.getDistance(touches);
            this._lastX = touches[0].stageX;
            this._lastZ = touches[0].stageY;
        }
        else if (touches && touches.length == 1) {
            this._dx = this.lastMouseX = touches[0].stageX;
            this._dy = this.lastMouseY = touches[0].stageY;
        }
        else if (touches == null) {
            this._dx = this.lastMouseX = Laya.stage.mouseX;
            this._dy = this.lastMouseY = Laya.stage.mouseY;
        }
    };
    WmyCamera.prototype.stageMouseUp = function (e) {
        var touches = e.touches;
        if (touches)
            this._touchesNum = touches.length;
        if (e.currentTarget != this._target)
            return;
        if (touches && touches.length == 1) {
            this._dx = this.lastMouseX = touches[0].stageX;
            this._dy = this.lastMouseY = touches[0].stageY;
        }
        else if (touches == null || touches.length == 0) {
            this._isMouseDown = false;
        }
    };
    WmyCamera.prototype.stageMouseMove = function (e) {
        var touches = e.touches;
        if (touches)
            this._touchesNum = touches.length;
        if (e.currentTarget != this._target || !this._isMouseDown)
            return;
        if (touches && touches.length == 2) {
            var distance = this.getDistance(e.touches);
            //判断当前距离与上次距离变化，确定是放大还是缩小
            var factor = 0.05;
            this.cam.fieldOfView -= (distance - this._lastDistance) * factor;
            if (this.cam.fieldOfView < 40)
                this.cam.fieldOfView = 40;
            if (this.cam.fieldOfView > 70)
                this.cam.fieldOfView = 70;
            this._lastDistance = distance;
            //平移
            var d = V2.Distance(new V2(touches[0].stageX, touches[0].stageY), new V2(this._lastX, this._lastZ));
            if (d > 3) {
                var poff = 0.04;
                var dx = (touches[0].stageX - this._lastX);
                var dy = (touches[0].stageY - this._lastZ);
                var rad = Math.atan2(dx, dy);
                var degree = rad * 180 / Math.PI;
                var rn = Math.PI / 180 * (this._angleNum + degree);
                var speedX = Math.sin(rn) * d * poff;
                var speedZ = Math.cos(rn) * d * poff;
                this._camBox.transform.translate(new Laya.Vector3(speedX, 0, speedZ), false);
            }
            this._lastX = touches[0].stageX;
            this._lastZ = touches[0].stageY;
        }
        else if (touches && touches.length == 1) {
            this.lastMouseX = touches[0].stageX;
            this.lastMouseY = touches[0].stageY;
            TweenMax.to(this, 1.5, { _dx: this.lastMouseX, _dy: this.lastMouseY });
        }
        else if (touches == null) {
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            TweenMax.to(this, 1.5, { _dx: this.lastMouseX, _dy: this.lastMouseY });
        }
    };
    WmyCamera.prototype.stageMouseWheel = function (e) {
        var factor = 1;
        this.cam.fieldOfView -= (e.delta) * factor;
        if (this.cam.fieldOfView < 40)
            this.cam.fieldOfView = 40;
        if (this.cam.fieldOfView > 70)
            this.cam.fieldOfView = 70;
    };
    WmyCamera.prototype.onUpdate = function () {
        if (this._touchesNum <= 1) {
            var offsetX = Math.abs(this.lastMouseX) - Math.abs(this._dx);
            var offsetY = Math.abs(this.lastMouseY) - Math.abs(this._dy);
            var dx = offsetX * this._rotaionSpeed;
            var dy = offsetY * this._rotaionSpeed * 0.4;
            this._angleNum -= dx;
            this._upNum += dy;
            if (this._upNum1 != null) {
                if (this._upNum < this._upNum1)
                    this._upNum = this._upNum1;
            }
            if (this._upNum2 != null) {
                if (this._upNum > this._upNum2)
                    this._upNum = this._upNum2;
            }
            this._v3.y = this._upNum;
            this._v3.x = Math.sin((this._angleNum) * Math.PI / 180) * this._distance;
            this._v3.z = Math.cos((this._angleNum) * Math.PI / 180) * this._distance;
            this.cam.transform.localPosition = this._v3;
            this.cam.transform.lookAt(this._camBox.transform.position, Laya.Vector3.UnitY);
        }
        if (this._offXZ != null) {
            var pos = this._camBox.transform.position;
            if (pos.x < this._offXZ.x) {
                pos.x = this._offXZ.x;
            }
            else if (pos.x > this._offXZ.y) {
                pos.x = this._offXZ.y;
            }
            if (pos.z < this._offXZ.z) {
                pos.z = this._offXZ.z;
            }
            else if (pos.z > this._offXZ.w) {
                pos.z = this._offXZ.w;
            }
            this._camBox.transform.position = pos;
        }
    };
    /**计算两个触摸点之间的距离*/
    WmyCamera.prototype.getDistance = function (points) {
        var distance = 0;
        if (points && points.length == 2) {
            var dx = points[0].stageX - points[1].stageX;
            var dy = points[0].stageY - points[1].stageY;
            distance = Math.sqrt(dx * dx + dy * dy);
        }
        return distance;
    };
    WmyCamera.prototype.onStageMouseDown = function (e) {
        var _outHitAllInfo = this.get3dClick();
        if (_outHitAllInfo.length > 0) {
            this._clickObj = _outHitAllInfo[0].collider.owner;
        }
    };
    WmyCamera.prototype.onStageMouseUp = function (e) {
        var _outHitAllInfo = this.get3dClick();
        var tempObj = null;
        if (_outHitAllInfo.length > 0) {
            tempObj = _outHitAllInfo[0].collider.owner;
            if (tempObj == this._clickObj) {
            }
        }
        this._clickObj = null;
    };
    WmyCamera.prototype.get3dClick = function (collisonGroup, collisionMask) {
        var _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        var _point = new Laya.Vector2();
        var _outHitAllInfo = new Array();
        //从屏幕空间生成射线
        _point.elements[0] = Laya.MouseManager.instance.mouseX;
        _point.elements[1] = Laya.MouseManager.instance.mouseY;
        this.cam.viewportPointToRay(_point, _ray);
        //射线检测获取所有检测碰撞到的物体
        if (this.scene3D.physicsSimulation != null) {
            this.scene3D.physicsSimulation.rayCastAll(_ray, _outHitAllInfo, 10000, collisonGroup, collisionMask);
        }
        return _outHitAllInfo;
    };
    return WmyCamera;
}(Laya.Script));
//# sourceMappingURL=WmyCamera.js.map