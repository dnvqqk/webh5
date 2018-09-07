// 程序入口
var LayaAir3D = (function () {
    function LayaAir3D() {
        LayaAir3D._this = this;
        // //初始化引擎
        Laya3D.init(1136, 640);
        Laya.stage.bgColor = "#000000";
        // //适配模式
        //Laya.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        //设置横竖屏
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        //设置水平对齐
        Laya.stage.alignH = "center";
        //设置垂直对齐
        Laya.stage.alignV = "middle";
        Laya.Stat.show();
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        Wmy_Load_Mag.getThis.onLoadWetData("loadInfo.txt?" + Date.now(), Laya.Handler.create(this, this.onLoadLoad));
    }
    LayaAir3D.prototype.onLoadLoad = function () {
        var resObj = Wmy_Load_Mag.getThis.getResObj("load");
        if (resObj != null) {
            Wmy_Load_Mag.getThis.onload(resObj, new Laya.Handler(this, this.onLoadMain));
        }
    };
    LayaAir3D.prototype.onLoadMain = function () {
        this._loadView = fairygui.UIPackage.createObject("load", "Load").asCom;
        fairygui.GRoot.inst.addChild(this._loadView);
        this._bar = this._loadView.getChild("bar").asProgress;
        this._bar.value = 1;
        Wmy_Load_Mag.getThis.onAutoLoadAll(new Laya.Handler(this, this.onLoadOk), new Laya.Handler(this, this.onLoading));
    };
    LayaAir3D.prototype.onLoading = function (progress) {
        this._bar.value = progress;
    };
    LayaAir3D.prototype.onLoadOk = function (uiArr, u3dArr) {
        var _this = this;
        if (u3dArr[0] != null) {
            this._urlList = u3dArr[0].urlList;
            //添加3D场景
            this.scene3D = Laya.loader.getRes(this._urlList[0]);
            WmyUtils3D.setShaderAll(this.scene3D, "res/mats/", "res/shaders/");
            Laya.timer.once(50, this, function () {
                _this.onMain();
                fairygui.GRoot.inst.removeChild(_this._loadView);
                _this._loadView = null;
                _this._bar = null;
            });
        }
    };
    LayaAir3D.prototype.onMain = function () {
        Laya.stage.addChildAt(this.scene3D, 0);
        var Camera = WmyUtils3D.getObj3d(this.scene3D, "Camera");
        var Player1 = WmyUtils3D.getObj3d(this.scene3D, "Player1");
        Player1.addComponent(PlayerKz);
        // var Mat_Player1_Clothing=WmyUtils3D.getObj3d(this.scene3D,"Mat_Player1_Clothing")as Laya.Sprite3D;
        // Laya.BaseMaterial.load("res/mat/Mat_Player1_Clothing/Mat_Player1_Clothing.lmat",Laya.Handler.create(this,m=>{
        //     WmyShaderMsg.setShader(Mat_Player1_Clothing,m,"res/shader/wmy_MatCapAdd_glsl.xml");
        // }))
        // var Mat_Player1_Skin=WmyUtils3D.getObj3d(this.scene3D,"Mat_Player1_Skin")as Laya.Sprite3D;
        // Laya.BaseMaterial.load("res/mat/Mat_Player1_Skin/Mat_Player1_Skin.lmat",Laya.Handler.create(this,m=>{
        //     WmyShaderMsg.setShader(Mat_Player1_Skin,m,"res/shader/wmy_MatCapAdd_glsl.xml");
        // }))
    };
    return LayaAir3D;
}());
new LayaAir3D();
//# sourceMappingURL=LayaAir3D.js.map