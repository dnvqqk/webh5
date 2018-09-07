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
var WmyPhysicsWorld_Character = /** @class */ (function (_super) {
    __extends(WmyPhysicsWorld_Character, _super);
    function WmyPhysicsWorld_Character() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.moveSpeed = 0.03;
        _this.jumpSpeed = 5;
        _this.isU = false;
        _this.isD = false;
        _this.isL = false;
        _this.isR = false;
        return _this;
    }
    Object.defineProperty(WmyPhysicsWorld_Character.prototype, "isGrounded", {
        get: function () {
            if (this.character == null)
                return false;
            return this.character.isGrounded;
        },
        enumerable: true,
        configurable: true
    });
    WmyPhysicsWorld_Character.prototype.onAwake = function () {
        this.mySprite3D = this.owner;
        this.scene3D = this.mySprite3D.scene;
        var physicsCollider = this.mySprite3D.getComponent(Laya.PhysicsCollider);
        physicsCollider.enabled = false;
        var sShape = physicsCollider.colliderShape;
        this.character = this.mySprite3D.addComponent(Laya.CharacterController);
        var sphereShape = new Laya.CapsuleColliderShape(sShape.radius, sShape.length, sShape.orientation);
        sphereShape.localOffset = sShape.localOffset;
        this.character.colliderShape = sphereShape;
    };
    WmyPhysicsWorld_Character.prototype.onUpdate = function () {
        this.character.jumpSpeed = this.jumpSpeed;
        var speed = this.moveSpeed;
        var speedV3 = new Laya.Vector3(0, 0, 0);
        var isGrounded = this.character.isGrounded;
        if (!(this.isU && this.isD)) {
            if (isGrounded) {
                if (this.isU) {
                    speedV3.z = -speed;
                }
                else if (this.isD) {
                    speedV3.z = speed;
                }
            }
        }
        if (!(this.isL && this.isR)) {
            if (this.isL) {
                speedV3.x = -speed;
            }
            else if (this.isR) {
                speedV3.x = speed;
            }
        }
        this.character.move(speedV3);
    };
    return WmyPhysicsWorld_Character;
}(Laya.Script));
//# sourceMappingURL=WmyPhysicsWorld_Character.js.map