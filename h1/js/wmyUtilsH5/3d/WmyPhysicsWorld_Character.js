var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WmyPhysicsWorld_Character = (function (_super) {
    __extends(WmyPhysicsWorld_Character, _super);
    function WmyPhysicsWorld_Character() {
        _super.apply(this, arguments);
        this.moveSpeed = 0.03;
        this.jumpSpeed = 5;
        this.isU = false;
        this.isD = false;
        this.isL = false;
        this.isR = false;
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
    WmyPhysicsWorld_Character.prototype.onJump = function (isJump) {
        this._keyJup = isJump;
        var isGrounded = this.character.isGrounded;
        if (!this._isJump && isJump && isGrounded) {
            this.character.jump();
        }
        this._isJump = isJump;
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