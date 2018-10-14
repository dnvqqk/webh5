let task = null;
const render = new TAR.Render();
const ar = new TAR.AR();
const engine = new TAR.Engine();


/**
 * Android通过主循环监控平面坐标的变化，需要主动调用onTarStateChanged去改变状态
 * iOS已经将事件监听写在了tar.js里面，状态自动切换
 */
if (TAR.ENV.ANDROID) {
    render.on('TAR_STATE_CHANGE', () => {
        const vrDisplay = ar.getVRDisplay();
        if (vrDisplay && ar.isEngineDownload()) {
            const frameData = new VRFrameData();
            vrDisplay.getFrameData(frameData);
            const [x, y, z] = frameData.pose.position;
            if (x === 0 &&  y === 0 && z === 0) {
                ar.onTarStateChanged('limited');
            } else {
                ar.onTarStateChanged('normal');
            }
        }
    });
}

// trigger camera position change every frame
render.on('CAMERA_TRANSFORM_CHANGE', () => {
    const vrDisplay = ar.getVRDisplay();
    // 需要获取到vrDisplay对象并且ar引擎下完成才能做业务逻辑
    if (vrDisplay && ar.isEngineDownload()) {
        engine.onCameraTransformChange();
    }
});


/**
 * 一切ready后的业务主逻辑
 */
render.on('MARKER_FOLLOW', () => {
    if (task) {
        task.follow();
    }
});

function ARInit() {
    ar.load()
        .then((display) => {
            render.setVRDisplay(display);
            engine.create('Laya');
            /**
             * ar引擎加载，load函数有3个参数，后两个为回调函数onStartCallback和onCompleteCallback
             */
            engine.load(display, null, () => {
                task = new Task(ar, render, engine);

                const run = (preState, nextState) => {
                    task.run(preState, nextState);
                };

                if (ar.getCurrentState() === 'normal') {
                    run();
                } else {
                    /**
                     *  将run callback注册到ar的状态转移函数中，
                     *  当调用ar.onTarStateChanged('normal')或者 ar.onTarStateChanged('limited') ， run会触发，
                     *  所以run函数要做不同状态间转换处理
                     */
                    ar.setNotAvailable2NormalFunc(run);
                    ar.setLimited2NormalFunc(run);
                }
            });
        })
        .catch((e) => {
            console.log(`exception = ${e}`);
        });
}

function main() {
    // render初始化，运行主循环
    render.init();
    // 初始化AR
    if (TAR.ENV.IOS) {
        ARInit();
    } else if (TAR.ENV.ANDROID) {
        // android AR的能力需要下载才有
        /**
         * STATUS_CHANGE方法注册4个与引擎状态相关的callback函数start, loading, success, fail
         */
        TAR.TARUtils.STATUS_CHANGE(
            null,
            null,
            () => {
                // close native progress after download native ar engine
                //NATIVE_RROGRESS_CLOSE();
            },
            () => {
                console.log('Init AR fail. Platform android. download engine error');
            }
        );
        // vr display 必须首先加载，android在x5内核里已经有，ios需要引用WebARonARkit
        // android AR的能力需要下载才有，但是摄像头能力不需要下载引擎，所以render可以提前进行；ios本身就有各种能力，slam、markerless沿用arkit的，marker base是武汉自研的，其中的addMarker需要终端添加的
        TAR.AR.initAREngine({
                type: 2
            },
            () => {
                ar.setEngineDownload(true);
                console.log(
                    'Init AR success. Platform android. AR Engine download success, you can use ability of tar '
                );
            },
            () => {
                console.log('Init AR fail. Platform android. init fail');
            }
        );
        ARInit();
    }
}

main();
