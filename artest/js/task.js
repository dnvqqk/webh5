const Task = function(ar, render, engine) {
    this.ar = ar;
    this.render = render;
    this.engine = engine;

    this.mark = new TAR.Marker(this.ar.getVRDisplay());
    this.mark.addMarker({
        name: '123',
        url: 'http://res.imtt.qq.com/penghu/ARCore/examples/assets/10-0.jpg'
    });

    this.cubeLeftButtom = new Laya.MeshSprite3D(new Laya.BoxMesh(0.01, 0.01, 0.01));
    this.cubeRightBottom = new Laya.MeshSprite3D(new Laya.BoxMesh(0.01, 0.01, 0.01));
    this.cubeRightTop = new Laya.MeshSprite3D(new Laya.BoxMesh(0.01, 0.01, 0.01));
    this.cubeLeftTop = new Laya.MeshSprite3D(new Laya.BoxMesh(0.01, 0.01, 0.01));
};

Task.prototype = {
    constructor: Task,
    // 业务逻辑写在这里
    run(preState, nextState) {
        console.log('preState', preState);
        console.log('nextState', nextState);
        // 设了flag后，render循环的engine.onCameraTransformChange();才可以真正执行
        this.engine.setCameraTransformChange(true);
        this.engine.getScene().addChild(this.cubeLeftButtom);
        this.engine.getScene().addChild(this.cubeRightBottom);
        this.engine.getScene().addChild(this.cubeRightTop);
        this.engine.getScene().addChild(this.cubeLeftTop);
    },
    follow() {
        const vrDisplay = this.ar.getVRDisplay();
        const markers = vrDisplay.getMarkers(vrDisplay.MARKER_TYPE_AR, 0);
        for (const marker of markers) {
            this.cubeLeftButtom.transform.position = new Laya.Vector3(
                marker.vertices[0],
                marker.vertices[1],
                marker.vertices[2]
            );
            this.cubeRightBottom.transform.position = new Laya.Vector3(
                marker.vertices[3],
                marker.vertices[4],
                marker.vertices[5]
            );
            this.cubeRightTop.transform.position = new Laya.Vector3(
                marker.vertices[6],
                marker.vertices[7],
                marker.vertices[8]
            );
            this.cubeLeftTop.transform.position = new Laya.Vector3(
                marker.vertices[9],
                marker.vertices[10],
                marker.vertices[11]
            );
        }
    }
}